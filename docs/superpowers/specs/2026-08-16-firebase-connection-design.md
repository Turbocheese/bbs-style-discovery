# Firebase Connection — Design

**Status:** approved in chat, written up for the record.

## Goal

Wire a Firebase backend into BBS Style Discovery for the first time — not to
ship any client-facing feature yet, but as the prerequisite groundwork that
unlocks future backend-shaped features (cross-store analytics, client
lookup, SKU linking — see `PRODUCT_LINKING_SCHEMA.md`) that are otherwise
architecturally impossible on GitHub Pages' static-only hosting.

This is additive and opportunistic only. The kiosk's offline-first
guarantee (CLAUDE.md: works fully offline via `sw.js`, no hard backend
dependency for the quiz flows) is not renegotiable. If Firebase is
unreachable, slow, or blocked, the app must behave exactly as it does
today — no loading delay, no console error, no broken flow.

## Cloud-side state (already provisioned)

- New Firebase project: `bbs-style-discovery` (separate from the founder's
  other Firebase project, `vinylvaulthosting`, used by an unrelated app).
- Currently on the **Spark** (free, no billing account attached) plan.
  Firestore, Hosting, Auth, and Storage are all usable on Spark. The
  founder's Google account also has an active Blaze-plan project
  elsewhere, so upgrading this project to Blaze later (only if a future
  feature needs Cloud Functions) is a one-click, still-effectively-free
  operation given this app's traffic.
- One Web App registered inside the project, producing a client config
  object (`apiKey`, `authDomain`, `projectId`, `storageBucket`,
  `messagingSenderId`, `appId`). These values are **not secrets** — they
  identify the project, not grant access (confirmed by the founder's own
  `.env.example` comment in the VinylVault repo, and standard Firebase
  guidance). Real access control lives entirely in Firestore security
  rules, so the config object is committed directly into a plain JS file
  — no env-injection step needed, matching this repo's no-build model.
- A default Firestore database (`(default)`, `nam5`), created with
  Firebase's default rules: **closed — deny all reads and writes.**

## Architecture

**SDK choice: vendor the Firebase "compat" build, not the modular v9+ SDK.**

The compat build (`firebase-app-compat.js`, `firebase-firestore-compat.js`)
ships as plain scripts that attach a global `firebase` namespace — it drops
straight into this codebase's existing convention (ES5, global objects,
`<script>` tags), the same way `vendor/html2canvas.min.js` and
`vendor/qrcode.min.js` already do. The modular SDK is only smaller with a
bundler doing tree-shaking; without one, vendoring it means pulling in many
interlinked ESM chunk files and introducing `<script type="module">` into
an app that deliberately has no build step and no partial-ESM precedent.
That's a real convention deviation for a payload-size benefit this offline
kiosk (no asset size limit — see founder's standing preference) doesn't
need.

**Files:**

- `vendor/firebase-app-compat.js`, `vendor/firebase-firestore-compat.js` —
  vendored unmodified, **version 12.17.1** (latest at time of writing).
  **Not** the `firebase` npm package's `dist/index.cjs.js` — verified
  during design that those are pure CommonJS (`require('@firebase/app-compat')`,
  no `<script>`-tag-safe fallback) since Firebase stopped shipping a
  standalone browser build through npm. The actual global-script build
  only exists at `https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js`
  and `.../firebase-firestore-compat.js` — verified UMD (falls back to
  attaching `firebase` on the global object when no `module`/`define` is
  present, confirmed by inspecting both files' source). Fetch each once
  with `curl`/browser and commit the output unmodified — this is a
  one-time vendoring fetch, not a runtime CDN dependency, matching how the
  other vendored libraries entered this repo.
- `firebase-init.js?v=1` — new file. Holds the (non-secret) config object,
  calls `firebase.initializeApp(...)` inside a `typeof firebase ===
  "undefined"` guard (same defensive pattern as the existing
  `typeof html2canvas === "undefined"` guards), and exposes one function,
  `getFirestoreDb()`, returning the initialized Firestore instance or
  `null` if initialization failed. No other file calls `firebase.*`
  directly — everything goes through this one accessor, so later features
  have one place to look and one failure mode to reason about.
  Load order: immediately before `app.js`, matching where `share-qr.js`
  sits today (index.html:350-351) — an optional-feature file, defines
  functions only, reads no other global at parse time.
- `firebase-init.js` also performs the one-time connectivity proof: on
  load, best-effort write a single document (client timestamp) to a
  `_health` collection. Wrapped so any failure (offline, blocked script,
  closed rules, quota) is caught and silently dropped — never a console
  error, never anything user-visible. This is how "hooked up" gets
  verified: the document shows up in the Firestore console.

**Security rules** (`firestore.rules`, new file, deployed via `firebase
deploy --only firestore:rules`):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /_health/{doc} {
      allow write: if true;
      allow read: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Only the health-check collection is writable (write-only, not readable —
it's a heartbeat, not a log to expose). Everything else stays closed until
a real feature defines what it needs. This is a conscious narrow scope,
not a placeholder — do not broaden it speculatively.

**Caching:** the two vendored SDK files and `firebase-init.js?v=1` are
static assets like every other vendored/app file — added to `sw.js`'s
`PRECACHE` array so the kiosk still boots fully offline. `CACHE_VERSION`
bumps accordingly. The Firestore SDK's own network calls are never
cached by the service worker (only same-origin GET requests are — see
`sw.js`'s fetch handler) and require no special-casing there.

## Data flow

```
index.html load
  → firebase-app-compat.js, firebase-firestore-compat.js (vendored, sync)
  → firebase-init.js: typeof firebase check → initializeApp → getFirestoreDb()
      → best-effort write to _health/{auto-id}: { ts: <client ISO time> }
      → any error: caught, swallowed, no console output
  → app.js boots exactly as before, unaware Firebase exists
```

No existing view, state field, or render path changes. `appState` and
`getFreshState()` are untouched — this step adds no application state.

## Testing

- `node --check` on `firebase-init.js`.
- Load the app with the network open: confirm a new document appears in
  the `bbs-style-discovery` Firestore console under `_health` within a
  few seconds, and confirm zero console errors.
- Load the app with the network blocked (devtools offline / airplane
  mode): confirm zero console errors, zero delay to first paint, and that
  `verify/smoke.js`'s offline-boot check still passes unmodified.
- Run `verify/smoke.js` in full — this step must not regress any existing
  check.
- Bump `?v=` and `CACHE_VERSION` per the standing convention; confirm the
  service worker precaches the three new files.

## Out of scope (deliberately)

No feature reads or writes anything beyond the `_health` heartbeat. No
Cloud Functions, no Auth, no client-facing UI change, no Blaze upgrade.
Those are separate decisions for whichever feature (analytics / client
lookup / SKU linking) gets picked next, each warranting its own
brainstorm.
