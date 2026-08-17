# Client Profile Saving — Design

**Status:** approved in chat, written up for the record.

## Goal

The first user-visible feature built on the Firebase groundwork
(`2026-08-16-firebase-connection-design.md`): once a client has a Style
result, a Colour result, and has started a wardrobe worksheet, save a
profile to Firestore and give them a short Client ID so staff can look
their picks up again on a later visit.

This is opportunistic, not a hard dependency: if the save never lands
(offline, blocked, Firestore down), the client's on-device session is
completely unaffected — they still get their Client ID displayed and their
results still work exactly as before. Only the "staff can look this up
later" promise degrades, and it degrades silently.

## Data model & Firestore rules

Document at `clients/{clientId}`:

```
{
  clientName: string,        // <80 chars
  styleArchetype: string,    // appState.archetypeKey, <60 chars
  colourSeason: string,      // appState.colourResultKey, <60 chars
  wardrobeChecklist: map,    // appState.wardrobeChecklist as-is
  createdAt: string          // ISO timestamp, <40 chars
}
```

`clientId` format: `BBS-` + 6 random characters from a 32-symbol alphabet
(uppercase, excluding visually ambiguous `0/O/1/I/L`), generated with
`crypto.getRandomValues` where available, `Math.random` fallback. ~1
billion combinations. No uniqueness check before write — collision odds
are negligible at this app's realistic volume, and a collision just
silently overwrites the earlier record. Accepted risk, matching the
project's existing "don't add complexity for a vanishingly unlikely case"
posture (e.g. no dedup logic on the pending-save retry queue either, see
below).

Founder decision, flagged explicitly during design: **the client's real
name is included**, even though this is the first real PII this app sends
to a server anywhere, and there is no consent/privacy-notice flow in the
kiosk. Accepted for the value of staff being able to recognize a returning
client by name rather than only by a code.

`firestore.rules` addition (alongside the existing `_health/kiosk` rule):

```
match /clients/{clientId} {
  allow read: if request.auth != null;
  allow update, delete: if false;
  allow create: if request.resource.data.keys().hasOnly(
      ['clientName', 'styleArchetype', 'colourSeason', 'wardrobeChecklist', 'createdAt']) &&
    request.resource.data.clientName is string &&
    request.resource.data.clientName.size() < 80 &&
    request.resource.data.styleArchetype is string &&
    request.resource.data.styleArchetype.size() < 60 &&
    request.resource.data.colourSeason is string &&
    request.resource.data.colourSeason.size() < 60 &&
    request.resource.data.wardrobeChecklist is map &&
    request.resource.data.createdAt is string &&
    request.resource.data.createdAt.size() < 40;
}
```

`wardrobeChecklist`'s internal keys (per-item `{checked, expanded}` maps)
are deliberately **not** deep-validated — itemIds are dynamic and
enumerating them in rules isn't practical. The rule only constrains it to
being a map; the real ceiling is Firestore's own 1MiB document size limit.
Accepted, same posture as the other unenforced edge cases in this spec.

Create is open (unauthenticated) like `_health/kiosk` — the kiosk has no
client-side auth to gate writes with, and the shape constraint above is
the actual protection (mirrors the reasoning in `firestore.rules`'s
existing rule and its commit `5e38a9b`). Reads require
`request.auth != null` — a signed-in staff session. Update/delete are
always denied; profiles are immutable once created. If the founder ever
needs to edit or remove one, that's a Firebase Console action (owner
access bypasses rules) — no in-app path is built for it.

## Architecture: REST-only, no new vendored SDK

Every existing Firebase interaction in this app deliberately avoids the
SDK's realtime/write-channel path — `firebase-init.js`'s health check uses
a raw `fetch()` PATCH specifically because the SDK's write methods open a
persistent Firestore Write-channel that never closes, which hung
Playwright's `networkidle` wait and, offline, retried indefinitely with
console-spammed `net::ERR_*` lines a `.catch()` cannot suppress. This
feature extends that same constraint rather than reintroducing the
problem it already solved once:

- **Staff sign-in** uses the Identity Toolkit REST API
  (`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=<apiKey>`)
  to exchange a password for a short-lived ID token. No `firebase-auth-compat.js`
  vendored, no SDK auth-state listener.
- **The client-side profile write** is a `fetch()` PATCH to
  `https://firestore.googleapis.com/v1/projects/bbs-style-discovery/databases/(default)/documents/clients/{clientId}`,
  unauthenticated — same shape as the existing health-check PATCH.
- **The staff lookup read** is a `fetch()` GET to the same document path,
  with `Authorization: Bearer <idToken>`.

No file in this feature calls `firebase.*` directly, so the existing
"exactly one file may call `firebase.*`: `firebase-init.js`" rule
(CLAUDE.md) is trivially preserved — this feature doesn't touch the SDK at
all.

**Files:**

- `client-profile.js?v=1` — new file. Owns: `clientId` generation, the
  save-if-ready check, the offline retry queue, staff sign-in, and staff
  lookup. Loaded immediately after `share-qr.js` in `index.html` — same
  position/reasoning `share-qr.js` itself documents: it only defines
  functions and reads `appState` at call time, never at parse time, so it
  is safe to sit before the deferred Firebase vendor block despite
  depending on `firebase-init.js`'s exports (by the time any of its
  functions actually run — a `render()` call, a staff button tap — all
  `defer` scripts have long since executed).
- `firebase-init.js` — one small addition: `getFirebaseConfig()`, exposing
  the `projectId`/`apiKey` it already holds privately in its closure, so
  `client-profile.js` has one source of truth for those values instead of
  a duplicated constant. Everything else in this file is unchanged; it
  still does not know `client-profile.js` exists.

## State model changes

`getFreshState()` gains one field: `clientId: null`. Set once, persisted
via the existing `bbs_session` mechanism, shown on the Style/Colour result
cards once non-null. No other existing field changes shape.

The offline retry queue is intentionally **not** part of `appState` /
`bbs_session`. It lives in its own localStorage key,
`bbs_pending_client_saves`. This is deliberate: the double-tap-logo staff
reset wipes `bbs_session` to give the next client a clean slate, but it
must not also discard an unsynced save from the *previous* client — those
are unrelated concerns and must not share storage.

## Save trigger & flow

On every `render()`, `client-profile.js` checks:

```
appState.archetypeKey && appState.colourResultKey &&
  appState.clientId === null &&
  Object.keys(appState.wardrobeChecklist || {}).some(function (k) {
    return appState.wardrobeChecklist[k].checked;
  })
```

("Worksheet exists" is read as *at least one checked item*, not merely an
item having been expanded/viewed — `expanded` alone isn't a signal the
client curated anything.)

When true: generate `clientId`, store it on `appState` (so it's part of
the next `bbs_session` persist and the check above never fires twice for
the same session), and attempt one PATCH. On success, done. On failure —
including `navigator.onLine === false`, checked before attempting — the
payload is appended to `bbs_pending_client_saves` instead.

Retry of the pending queue fires on the `online` event and once at app
boot. Because the write is a PATCH to a fixed, already-generated document
ID, retries are naturally idempotent — no dedup or attempt-counting logic
needed; a queue entry is simply removed once its PATCH resolves
successfully.

## Staff auth & lookup UI

A plain text link/button — labelled "Staff", not a hidden gesture, placed
on the welcome/home chrome — opens a new `staffLookup` view (a new `case`
in `render()`'s switch, per the existing router pattern). It has:

1. A password field (the shared staff account's email is a fixed constant
   in `client-profile.js`; only the password is entered). Submitting signs
   in via the REST call above.
2. Once signed in, a Client ID field. Submitting does the authenticated
   GET and renders the result (name, style archetype, colour season,
   checklist) or "No profile found for that ID."

The obtained ID token is held in a **module-level JS variable only** —
never written to `localStorage` or `appState`/`bbs_session`. This means
staff re-authenticate every time they open this screen rather than the
app managing token refresh or persisting a credential on a shared kiosk
device. Given this is expected to be low-frequency (a staff member
occasionally looking something up, not a per-transaction flow), the
simplicity is worth the extra typing.

All new interactive elements route through the existing single delegated
`data-action` click handler on `document.body` — no second listener.

## Error handling

- Save PATCH fails or offline: queued silently, no client-visible error —
  the client's Client ID still displays regardless of save outcome.
- Firebase entirely absent/blocked (ad-blocker, corporate firewall,
  `firebase-init.js` failed to initialize): `getFirebaseConfig()` returns
  `null`; `client-profile.js` treats that exactly like an offline PATCH
  failure — queued, retried later, never surfaced.
- Staff sign-in with wrong password: inline error message on the
  `staffLookup` view. No lockout/rate-limiting in v1 — a shared low-stakes
  credential, consistent with the "single shared staff login" decision.
- Staff lookup of a nonexistent ID: "No profile found for that ID",
  handled as a normal 404 from the Firestore REST GET, not an exception.

## Out of scope (deliberately)

- No TTL/expiry on saved profiles for v1 (founder decision — revisit if
  it becomes a real concern).
- No per-staff accounts — one shared login.
- No in-app UI to edit or delete a saved profile.
- No uniqueness check on `clientId` generation.
- No Cloud Functions, no custom claims, no Blaze-plan features.

## Setup steps outside this codebase

Two manual actions the founder must take, neither of which this
implementation can perform:

1. Create the single shared staff account in the Firebase Console
   (Authentication → Add user, email/password) and share the password with
   staff out of band.
2. Deploy the updated `firestore.rules` (`firebase deploy --only
   firestore:rules`), same step already taken for the `_health/kiosk` rule
   in commit `5e38a9b`.

## Testing

- `node --check` on `client-profile.js` and the modified `firebase-init.js`.
- Extend `verify/audit.js`'s `EXPECTED_SCRIPT_ORDER` for the new file;
  re-run to confirm green.
- `node verify/smoke.js` must still pass unmodified — this is exactly the
  bug class (`networkidle` hang, offline retry spam) already fixed once in
  this project's history; staying REST-only is what keeps it passing.
- Rules verification via `curl`, same style as commit `5e38a9b`'s
  documented verification: allowed create with the exact shape, denied
  create with an extra/wrong-shaped field, denied update, denied delete,
  denied anonymous read, allowed read with a valid staff ID token.
- Manual: complete both quizzes and check a worksheet item on a live
  deploy; confirm the `clients/{id}` document appears in the Firestore
  console with the right shape, and the Client ID renders on the result
  card.
- Manual offline test: airplane mode, complete the same flow, confirm the
  Client ID still displays and a pending entry appears in
  `bbs_pending_client_saves`; return online, confirm the queued save
  fires and the document appears.
- Bump `?v=` for `client-profile.js` and `firebase-init.js`, bump
  `CACHE_VERSION` in `sw.js`, add `client-profile.js` to `sw.js`'s
  `PRECACHE` array. Update CLAUDE.md's script load-order section and this
  repo's `verify/audit.js` script-order list to include the new file.
