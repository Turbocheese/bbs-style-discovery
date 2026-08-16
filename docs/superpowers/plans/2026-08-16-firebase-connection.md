# Firebase Connection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire a Firebase backend into BBS Style Discovery for the first
time — vendored compat SDK, a single init/accessor file, and a best-effort
health-check write — with zero change to any existing view, state, or
offline guarantee.

**Architecture:** Two vendored UMD script files establish a global
`firebase` namespace; one new file (`firebase-init.js`) initializes it from
a committed (non-secret) config object and exposes a single accessor,
`getFirestoreDb()`. A closed-by-default Firestore ruleset permits writes to
one heartbeat collection only. Everything is additive — no existing file's
behavior changes, and every new code path degrades silently to a no-op if
the network, the SDK, or Firestore itself is unavailable.

**Tech Stack:** Firebase JS SDK v12.17.1, compat build (vendored from the
gstatic CDN, not the npm package — see Global Constraints). Firebase CLI
(already installed and authenticated as `ryanmichael.lim@gmail.com` in this
environment) for the one Firestore rules deploy.

**Spec:** `docs/superpowers/specs/2026-08-16-firebase-connection-design.md`

## Global Constraints

- SDK version: **12.17.1**, compat build only (not modular v9+ — see spec's
  "compat vs v9+" rationale: no bundler in this repo, tree-shaking gives no
  win, and this app has a standing "no asset size limit" preference).
- Vendor from `https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js`
  and `.../firebase-firestore-compat.js` — **never** from the `firebase`
  npm package's `dist/index.cjs.js` (verified during design to be pure
  CommonJS, not `<script>`-tag-safe).
- Exactly one file may call `firebase.*` directly: `firebase-init.js`. All
  other code must go through its exported `getFirestoreDb()` accessor.
- Every new code path must degrade to a silent no-op — no console error,
  no thrown exception reaching the page, no delay to first paint — when
  offline, blocked, or misconfigured. This app's offline-first guarantee
  is non-negotiable (CLAUDE.md).
- Script load order: `vendor/firebase-app-compat.js`, then
  `vendor/firebase-firestore-compat.js`, then `firebase-init.js?v=1`,
  immediately before `app.js?v=95` in index.html (matches where
  `share-qr.js` sits today, index.html:350-351).
- Firestore config values (`apiKey`, `authDomain`, `projectId`,
  `storageBucket`, `messagingSenderId`, `appId`) are **not secrets** — they
  identify the project only; access control is entirely in
  `firestore.rules`. They are committed in plain text, matching this
  repo's no-build/no-env-injection model.
- Firestore rules stay closed (deny all) except a write-only allow on the
  `_health` collection. Do not broaden this speculatively — a real feature
  defines its own rules later.
- Whenever any precached file changes, bump `CACHE_VERSION` in `sw.js` and
  add the new file(s) to its `PRECACHE` array (current `CACHE_VERSION` is
  `"bbs-v118"` — see Task 3 for the exact bump).
- 4-space indent, ES5 (`var`, function declarations, no arrow functions/
  `let`/`const`/template literals), double quotes — match the rest of this
  codebase.

---

### Task 1: Vendor the Firebase compat SDK

**Files:**
- Create: `vendor/firebase-app-compat.js`
- Create: `vendor/firebase-firestore-compat.js`

**Interfaces:**
- Produces: a global `firebase` namespace (from `firebase-app-compat.js`)
  with `firebase.firestore()` attached (from `firebase-firestore-compat.js`,
  which must load after `firebase-app-compat.js`). Task 2 consumes this
  global.

- [ ] **Step 1: Fetch the two vendored files**

Run these two commands from the repo root:

```bash
curl -s "https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js" -o vendor/firebase-app-compat.js
curl -s "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore-compat.js" -o vendor/firebase-firestore-compat.js
```

- [ ] **Step 2: Verify both are the expected UMD build, unmodified**

```bash
node --check vendor/firebase-app-compat.js
node --check vendor/firebase-firestore-compat.js
grep -c "globalThis" vendor/firebase-app-compat.js
```

Expected: both `node --check` commands print nothing (valid syntax), and
the `grep -c` prints a number ≥ 1 (confirms the UMD global-fallback branch
is present — `(e="undefined"!=typeof globalThis?globalThis:e||self).firebase=t()`
somewhere in the minified source). If `grep -c` prints `0`, the fetched
file is not the expected build — stop and report back rather than
proceeding.

- [ ] **Step 3: Commit**

```bash
git add vendor/firebase-app-compat.js vendor/firebase-firestore-compat.js
git commit -m "Vendor Firebase compat SDK v12.17.1 (app + firestore)"
```

---

### Task 2: firebase-init.js — init, accessor, health-check write

**Files:**
- Create: `firebase-init.js`
- Modify: `index.html:350-351` (insert three new `<script>` tags before
  the existing `app.js?v=95` tag)

**Interfaces:**
- Consumes: global `firebase` namespace from Task 1.
- Produces: global function `getFirestoreDb()` — returns the initialized
  Firestore instance, or `null` if the SDK is missing or initialization
  failed. This is the only sanctioned way any future file may reach
  Firestore.

- [ ] **Step 1: Write `firebase-init.js`**

```js
// firebase-init.js — Firebase connection groundwork.
// See docs/superpowers/specs/2026-08-16-firebase-connection-design.md.
// Exactly one file may call firebase.* directly: this one. Everything
// else must go through getFirestoreDb().

var _firestoreDb = null;

(function initFirebase() {
    if (typeof firebase === "undefined") return;
    try {
        var firebaseConfig = {
            apiKey: "AIzaSyD9IUD84Ps5oj79_VwPOQzWCw8ukcIt4jc",
            authDomain: "bbs-style-discovery.firebaseapp.com",
            projectId: "bbs-style-discovery",
            storageBucket: "bbs-style-discovery.firebasestorage.app",
            messagingSenderId: "220798978767",
            appId: "1:220798978767:web:8b0954e1cb619933fc85ba"
        };
        firebase.initializeApp(firebaseConfig);
        _firestoreDb = firebase.firestore();
    } catch (e) {
        _firestoreDb = null;
    }
})();

function getFirestoreDb() {
    return _firestoreDb;
}

(function reportHealthCheck() {
    var db = getFirestoreDb();
    if (!db) return;
    try {
        db.collection("_health").add({ ts: new Date().toISOString() }).catch(function () {});
    } catch (e) {
        // Connectivity is opportunistic and never user-visible — swallow.
    }
})();
```

- [ ] **Step 2: Verify syntax**

```bash
node --check firebase-init.js
```

Expected: no output (valid).

- [ ] **Step 3: Wire the script tags into index.html**

In `index.html`, find this block (currently lines 350-351):

```html
    <script src="share-qr.js?v=2"></script>
    <script src="app.js?v=95"></script>
```

Replace it with:

```html
    <script src="share-qr.js?v=2"></script>
    <script src="vendor/firebase-app-compat.js"></script>
    <script src="vendor/firebase-firestore-compat.js"></script>
    <script src="firebase-init.js?v=1"></script>
    <script src="app.js?v=95"></script>
```

- [ ] **Step 4: Manual load check**

From the repo root: `npx serve .` (or any static server), open the served
URL in a browser with devtools open. Confirm:
- Zero console errors or warnings.
- The app loads and behaves exactly as before (welcome screen, name
  entry, etc. — no visible change).

Then open the Firestore console at
`https://console.firebase.google.com/project/bbs-style-discovery/firestore/databases/-default-/data`
and confirm a new document appears under a `_health` collection within a
few seconds of the page load, containing a `ts` field.

- [ ] **Step 5: Commit**

```bash
git add firebase-init.js index.html
git commit -m "Add firebase-init.js: SDK init, getFirestoreDb() accessor, health-check write"
```

---

### Task 3: Firestore rules, cache-bump, and full verification

**Files:**
- Create: `firestore.rules`
- Modify: `sw.js` (bump `CACHE_VERSION`, add three entries to `PRECACHE`)

**Interfaces:**
- Consumes: nothing new — this task is infra + caching + verification
  around Tasks 1-2's files.

- [ ] **Step 1: Write `firestore.rules`**

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

- [ ] **Step 2: Deploy the rules**

```bash
firebase deploy --only firestore:rules --project bbs-style-discovery
```

Expected: `firebase deploy` reports success. This deploy replaces the
project's current default-closed rules with the ruleset above — the only
behavioral change is that `_health` becomes writable (it was previously
fully closed, so Task 2's health-check write would have been silently
failing until this step runs).

- [ ] **Step 3: Bump `CACHE_VERSION` and `PRECACHE` in `sw.js`**

Change:

```js
var CACHE_VERSION = "bbs-v118";
```

to:

```js
var CACHE_VERSION = "bbs-v119";
```

And in the `PRECACHE` array, find:

```js
    "./share-qr.js?v=2",
    "./app.js?v=95",
```

Replace with:

```js
    "./share-qr.js?v=2",
    "./vendor/firebase-app-compat.js",
    "./vendor/firebase-firestore-compat.js",
    "./firebase-init.js?v=1",
    "./app.js?v=95",
```

- [ ] **Step 4: Re-run the manual load check from Task 2, this time offline**

With the static server running, load the app once (online) so the service
worker installs and precaches. Then switch devtools to offline mode (or
airplane mode) and reload. Confirm:
- Zero console errors.
- No delay to first paint versus the online load.
- The app is fully usable (this repeats the existing offline-boot
  guarantee — it must still hold with the three new precached files).

- [ ] **Step 5: Run the full smoke suite**

```bash
node verify/smoke.js
```

Expected: all checks pass, matching the pre-existing baseline. (This
branch's diff does not touch any application view, quiz flow, or export
path, so no new failures are expected. If the pre-existing "Cloth Room
entry" flake — documented in this repo's history as a load-sensitive,
unrelated timing issue in `verify/smoke.js`'s `entry()` helper — appears,
re-run once to confirm it's not a real regression before reporting it as
one.)

- [ ] **Step 6: Commit**

```bash
git add firestore.rules sw.js
git commit -m "Add firestore.rules, bump cache version for Firebase connection files"
```

---

## Definition of Done

- [ ] All three tasks committed.
- [ ] `node --check` clean on `firebase-init.js` and both vendored files.
- [ ] Firestore console shows a `_health` document appearing on page load.
- [ ] `node verify/smoke.js` passes with no new failures versus baseline.
- [ ] App boots with zero console errors both online and offline.
- [ ] No existing file's rendered output, state shape, or behavior changed.
