# Client Profile Saving Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Once a client has a Style result, a Colour result, and has checked
at least one wardrobe worksheet item, save their profile to Firestore under
a short Client ID and display that ID on their result card, so staff can
look their picks up again on a later visit via an in-app, password-gated
lookup screen.

**Architecture:** A new file, `client-profile.js`, owns ID generation, a
one-shot REST write (PATCH) to Firestore, an offline retry queue in its own
localStorage key, and staff sign-in/lookup — all via raw `fetch()` calls to
the Firestore and Identity Toolkit REST APIs, never the SDK's realtime/
write-channel path (the same constraint `firebase-init.js`'s health check
already established). `firebase-init.js` gains one small accessor,
`getFirebaseConfig()`, so `client-profile.js` has one source of truth for
the project's config instead of a duplicated constant. `firestore.rules`
gains a `clients/{clientId}` rule: open, shape-constrained create; read
gated on `request.auth != null`; update/delete always denied.

**Tech Stack:** Firestore REST API v1, Identity Toolkit REST API v1 (both
via `fetch()`, no new vendored SDK). Firebase CLI (already installed and
authenticated as `ryanmichael.lim@gmail.com` in this environment) for the
rules deploy.

**Spec:** `docs/superpowers/specs/2026-08-17-client-profile-saving-design.md`

## Global Constraints

- No new vendored SDK. Staff auth and all Firestore reads/writes for this
  feature go through raw `fetch()` to `identitytoolkit.googleapis.com` and
  `firestore.googleapis.com` — the SDK's write path opens a persistent
  channel that hangs Playwright's `networkidle` wait and retries forever
  offline (already fixed once in this project's history; do not
  reintroduce it).
- No file in this feature calls `firebase.*` directly. `firebase-init.js`
  remains the only file that does (existing CLAUDE.md rule, unaffected by
  this feature since it never touches the SDK).
- `clientId` format: `"BBS-" + 6 chars` from alphabet
  `"23456789ABCDEFGHJKMNPQRSTUVWXYZ"` (excludes ambiguous `0/O/1/I/L`). No
  uniqueness check before write — accepted risk per spec.
- The offline retry queue lives in its own localStorage key,
  `bbs_pending_client_saves` — never merged into `bbs_session`, so the
  staff double-tap-logo reset (`localStorage.removeItem("bbs_session")`)
  never discards an unsynced save.
- Firestore document shape at `clients/{clientId}`: exactly `clientName`,
  `styleArchetype`, `colourSeason`, `wardrobeChecklist`, `createdAt` — see
  spec for the full rules text.
- Staff ID token is held in a module-level JS variable only — never
  `localStorage` or `appState`/`bbs_session`. Staff re-authenticate every
  time they open the lookup screen.
- All new interactive elements route through the existing single delegated
  `data-action` click handler on `document.body` in `app.js` — never a
  second listener.
- A button that is a label/link rather than a filled pill needs
  `.btn-bare` (CLAUDE.md's documented `button:hover` cascade trap).
- Whenever any precached file's content changes: bump its `?v=` in
  `index.html` AND its precache entry in `sw.js`, and bump `CACHE_VERSION`
  in `sw.js`. Current baseline at the start of this plan: `app.js?v=95`,
  `firebase-init.js?v=2`, `styles.css?v=94`, `CACHE_VERSION = "bbs-v120"`.
- 4-space indent, ES5 (`var`, function declarations, no arrow functions/
  `let`/`const`/template literals), double quotes — match the rest of this
  codebase.

---

### Task 1: `firebase-init.js` — expose `getFirebaseConfig()`

**Files:**
- Modify: `firebase-init.js`
- Modify: `index.html` (bump the `firebase-init.js` script tag)
- Modify: `sw.js` (bump the precache entry + `CACHE_VERSION`)

**Interfaces:**
- Produces: global function `getFirebaseConfig()` — returns
  `{ projectId, apiKey }` if Firebase initialized successfully, or `null`
  otherwise. Task 2 and Task 4 both consume this.

- [ ] **Step 1: Lift the config object to outer scope and add the accessor**

In `firebase-init.js`, find:

```js
(function (global) {
    var _firebaseInitialized = false;
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
            _firebaseInitialized = true;
        } catch (e) {
            _firebaseInitialized = false;
        }
    })();
```

Replace with:

```js
(function (global) {
    var _firebaseInitialized = false;
    var _firestoreDb = null;
    var _firebaseConfig = {
        apiKey: "AIzaSyD9IUD84Ps5oj79_VwPOQzWCw8ukcIt4jc",
        authDomain: "bbs-style-discovery.firebaseapp.com",
        projectId: "bbs-style-discovery",
        storageBucket: "bbs-style-discovery.firebasestorage.app",
        messagingSenderId: "220798978767",
        appId: "1:220798978767:web:8b0954e1cb619933fc85ba"
    };

    (function initFirebase() {
        if (typeof firebase === "undefined") return;
        try {
            firebase.initializeApp(_firebaseConfig);
            _firebaseInitialized = true;
        } catch (e) {
            _firebaseInitialized = false;
        }
    })();
```

Then find:

```js
    global.getFirestoreDb = getFirestoreDb;
})(typeof window !== "undefined" ? window : this);
```

Replace with:

```js
    function getFirebaseConfig() {
        if (!_firebaseInitialized) return null;
        return { projectId: _firebaseConfig.projectId, apiKey: _firebaseConfig.apiKey };
    }

    global.getFirestoreDb = getFirestoreDb;
    global.getFirebaseConfig = getFirebaseConfig;
})(typeof window !== "undefined" ? window : this);
```

- [ ] **Step 2: Verify syntax**

```bash
node --check firebase-init.js
```

Expected: no output.

- [ ] **Step 3: Bump the script tag and precache entry**

In `index.html`, change:

```html
    <script src="firebase-init.js?v=2" defer></script>
```

to:

```html
    <script src="firebase-init.js?v=3" defer></script>
```

In `sw.js`, change:

```js
var CACHE_VERSION = "bbs-v120";
```

to:

```js
var CACHE_VERSION = "bbs-v121";
```

and change:

```js
    "./firebase-init.js?v=2",
```

to:

```js
    "./firebase-init.js?v=3",
```

- [ ] **Step 4: Manual verification**

```bash
npx serve .
```

Open the served URL, open devtools console, and run:

```js
getFirebaseConfig()
```

Expected: `{projectId: "bbs-style-discovery", apiKey: "AIzaSyD9IUD84Ps5oj79_VwPOQzWCw8ukcIt4jc"}`
(or `null` if offline/blocked — either is correct behavior, but on a normal
online load it should be the object). Confirm zero console errors and the
welcome screen looks unchanged.

- [ ] **Step 5: Commit**

```bash
git add firebase-init.js index.html sw.js
git commit -m "firebase-init.js: expose getFirebaseConfig() accessor"
```

---

### Task 2: `client-profile.js` core — ID generation, save, offline queue

**Files:**
- Create: `client-profile.js`
- Modify: `index.html` (add script tag, bump `app.js` tag)
- Modify: `sw.js` (add precache entry, bump `app.js` entry + `CACHE_VERSION`)
- Modify: `app.js` (`getFreshState()`, top of `render()`, both result renderers)

**Interfaces:**
- Consumes: `getFirebaseConfig()` from Task 1.
- Produces: global functions `maybeSaveClientProfile()` (called from
  `render()`), `getClientIdLineHTML()` (called from both result renderers),
  `retryPendingClientSaves()` (self-wired to the `online`/`load` events,
  not called elsewhere yet). Task 4 adds `staffSignIn`, `staffLookupClient`,
  etc. to this same file, reusing its `toFirestoreFields`/
  `fromFirestoreDocument` converters.

- [ ] **Step 1: Write `client-profile.js`**

```js
// client-profile.js — Client Profile Saving.
// See docs/superpowers/specs/2026-08-17-client-profile-saving-design.md.
// Only defines functions at load time (appState/getFirebaseConfig are
// read inside them at call time, not at parse time), so it is safe to
// sit before the deferred Firebase block despite depending on
// firebase-init.js's getFirebaseConfig() — same reasoning share-qr.js
// documents for its own position in the load order.
//
// Every Firestore call here is a raw fetch() to the REST API, never the
// SDK's write/realtime path — see firebase-init.js's header comment for
// why (a persistent Write-channel that hangs Playwright and retries
// forever offline). Reusing that path here would reintroduce the same
// bug for this feature.

var CLIENT_ID_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O/1/I/L
var PENDING_CLIENT_SAVES_KEY = "bbs_pending_client_saves";

function generateClientId() {
    var randomValues = null;
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        randomValues = new Uint8Array(6);
        crypto.getRandomValues(randomValues);
    }
    var chars = "";
    for (var i = 0; i < 6; i++) {
        var idx = randomValues
            ? randomValues[i] % CLIENT_ID_ALPHABET.length
            : Math.floor(Math.random() * CLIENT_ID_ALPHABET.length);
        chars += CLIENT_ID_ALPHABET.charAt(idx);
    }
    return "BBS-" + chars;
}

// ---- Firestore REST value (de)serialization ----

function toFirestoreValue(val) {
    if (typeof val === "string") return { stringValue: val };
    if (typeof val === "boolean") return { booleanValue: val };
    if (typeof val === "number") return { doubleValue: val };
    if (val && typeof val === "object") {
        return { mapValue: { fields: toFirestoreFields(val) } };
    }
    return { nullValue: null };
}

function toFirestoreFields(obj) {
    var fields = {};
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fields[key] = toFirestoreValue(obj[key]);
        }
    }
    return fields;
}

function fromFirestoreValue(value) {
    if (!value) return null;
    if ("stringValue" in value) return value.stringValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("doubleValue" in value) return value.doubleValue;
    if ("integerValue" in value) return parseInt(value.integerValue, 10);
    if ("mapValue" in value) return fromFirestoreDocument(value.mapValue);
    return null;
}

function fromFirestoreDocument(doc) {
    var fields = (doc && doc.fields) || {};
    var out = {};
    for (var key in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, key)) {
            out[key] = fromFirestoreValue(fields[key]);
        }
    }
    return out;
}

// ---- Offline retry queue ----

function readPendingClientSaves() {
    try {
        var raw = localStorage.getItem(PENDING_CLIENT_SAVES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function writePendingClientSaves(queue) {
    try {
        localStorage.setItem(PENDING_CLIENT_SAVES_KEY, JSON.stringify(queue));
    } catch (e) {
        // Storage unavailable — the pending save is simply lost; the
        // client's on-device experience is unaffected either way.
    }
}

function queuePendingClientSave(clientId, payload) {
    var queue = readPendingClientSaves().filter(function (entry) {
        return entry.clientId !== clientId;
    });
    queue.push({ clientId: clientId, payload: payload });
    writePendingClientSaves(queue);
}

function removePendingClientSave(clientId) {
    var queue = readPendingClientSaves().filter(function (entry) {
        return entry.clientId !== clientId;
    });
    writePendingClientSaves(queue);
}

function firestoreDocUrl(config, clientId) {
    return "https://firestore.googleapis.com/v1/projects/" + config.projectId +
        "/databases/(default)/documents/clients/" + clientId;
}

function saveClientProfile(clientId, payload) {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
        queuePendingClientSave(clientId, payload);
        return;
    }
    var config = (typeof getFirebaseConfig === "function") ? getFirebaseConfig() : null;
    if (!config) {
        queuePendingClientSave(clientId, payload);
        return;
    }
    try {
        fetch(firestoreDocUrl(config, clientId), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fields: toFirestoreFields(payload) })
        }).then(function (res) {
            if (!res.ok) queuePendingClientSave(clientId, payload);
        }).catch(function () {
            queuePendingClientSave(clientId, payload);
        });
    } catch (e) {
        queuePendingClientSave(clientId, payload);
    }
}

function retryPendingClientSaves() {
    if (typeof navigator !== "undefined" && navigator.onLine === false) return;
    var config = (typeof getFirebaseConfig === "function") ? getFirebaseConfig() : null;
    if (!config) return;
    var queue = readPendingClientSaves();
    queue.forEach(function (entry) {
        fetch(firestoreDocUrl(config, entry.clientId), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fields: toFirestoreFields(entry.payload) })
        }).then(function (res) {
            if (res.ok) removePendingClientSave(entry.clientId);
        }).catch(function () {});
    });
}

if (typeof window !== "undefined") {
    window.addEventListener("online", retryPendingClientSaves);
    window.addEventListener("load", retryPendingClientSaves);
}

// ---- Save trigger ----

function buildClientProfilePayload() {
    return {
        clientName: appState.clientName || "",
        styleArchetype: appState.archetypeKey || "",
        colourSeason: appState.colourResultKey || "",
        wardrobeChecklist: appState.wardrobeChecklist || {},
        createdAt: new Date().toISOString()
    };
}

function maybeSaveClientProfile() {
    if (appState.clientId) return;
    if (!appState.archetypeKey || !appState.colourResultKey) return;
    var checklist = appState.wardrobeChecklist || {};
    var hasCheckedItem = Object.keys(checklist).some(function (k) {
        return checklist[k] && checklist[k].checked;
    });
    if (!hasCheckedItem) return;

    appState.clientId = generateClientId();
    saveClientProfile(appState.clientId, buildClientProfilePayload());
}

// ---- Result-card display ----

function getClientIdLineHTML() {
    if (!appState.clientId) return "";
    return '<p class="arch-result-secondary">Client ID: ' + appState.clientId + "</p>";
}
```

- [ ] **Step 2: Verify syntax**

```bash
node --check client-profile.js
```

Expected: no output.

- [ ] **Step 3: Add `clientId` to `getFreshState()`**

In `app.js`, find:

```js
        visEnsembleState: null,
        galleryKey: null,
    };
}
```

Replace with:

```js
        visEnsembleState: null,
        galleryKey: null,
        clientId: null,
    };
}
```

- [ ] **Step 4: Call the save check at the top of `render()`**

In `app.js`, find:

```js
function render(options) {
    // 🌟 AUTO-SAVE TO IPAD MEMORY ON EVERY SCREEN CHANGE
    localStorage.setItem("bbs_session", JSON.stringify(appState));
```

Replace with:

```js
function render(options) {
    if (typeof maybeSaveClientProfile === "function") maybeSaveClientProfile();

    // 🌟 AUTO-SAVE TO IPAD MEMORY ON EVERY SCREEN CHANGE
    localStorage.setItem("bbs_session", JSON.stringify(appState));
```

- [ ] **Step 5: Display the Client ID on the Style result card**

In `app.js`, inside `renderResult()`, find:

```js
        '<div class="arch-result-divider"></div>' +
        '<p class="arch-result-desc">' + resultDesc + "</p>" +
```

Replace with:

```js
        '<div class="arch-result-divider"></div>' +
        getClientIdLineHTML() +
        '<p class="arch-result-desc">' + resultDesc + "</p>" +
```

- [ ] **Step 6: Display the Client ID on the Colour result card**

In `app.js`, inside `renderColourDirectionResult()`, find:

```js
        '<div class="arch-result-divider"></div>' +
        getColourResultContentHTML(resultKey, scores, profile, hasAnswers) +
```

Replace with:

```js
        '<div class="arch-result-divider"></div>' +
        getClientIdLineHTML() +
        getColourResultContentHTML(resultKey, scores, profile, hasAnswers) +
```

- [ ] **Step 7: Wire the script tag and bump `app.js`**

In `index.html`, find:

```html
    <script src="share-qr.js?v=2"></script>
```

Replace with:

```html
    <script src="share-qr.js?v=2"></script>
    <script src="client-profile.js?v=1"></script>
```

Then find:

```html
    <script src="app.js?v=95"></script>
```

Replace with:

```html
    <script src="app.js?v=96"></script>
```

- [ ] **Step 8: Precache and cache-bump**

In `sw.js`, find:

```js
    "./share-qr.js?v=2",
    "./vendor/firebase-app-compat.js",
```

Replace with:

```js
    "./share-qr.js?v=2",
    "./client-profile.js?v=1",
    "./vendor/firebase-app-compat.js",
```

Then find:

```js
    "./app.js?v=95",
```

Replace with:

```js
    "./app.js?v=96",
```

Then find:

```js
var CACHE_VERSION = "bbs-v121";
```

Replace with:

```js
var CACHE_VERSION = "bbs-v122";
```

(This is `bbs-v121` from Task 1 — if Task 1 hasn't been run in this exact
session, use whatever the current `CACHE_VERSION` is at this point, +1.)

- [ ] **Step 9: End-to-end manual verification**

```bash
npx serve .
```

Open the served URL. Complete the Style quiz, complete the Colour quiz,
then open the Worksheet and check at least one item. Confirm a Client ID
(`Client ID: BBS-XXXXXX`) appears on the result card. Open devtools
console: expect **zero thrown JS errors**. A failed network request to
`firestore.googleapis.com` returning 403 is expected and correct at this
point in the plan — Task 3 hasn't deployed the `clients/{clientId}` rule
yet, so the write is denied and should land in the offline queue instead.
Confirm this by running in the console:

```js
JSON.parse(localStorage.getItem("bbs_pending_client_saves"))
```

Expected: an array with one entry whose `clientId` matches what's shown on
the card. This proves the queue-on-failure path works — Task 3 will prove
the queue drains once the rule exists.

- [ ] **Step 10: Commit**

```bash
git add client-profile.js index.html sw.js app.js
git commit -m "Add client-profile.js: Client ID generation, Firestore save, offline retry queue"
```

---

### Task 3: Firestore rules, staff account provisioning, verification

**Files:**
- Modify: `firestore.rules`

**Interfaces:**
- Consumes: the `clients/{clientId}` document shape from Task 2's
  `buildClientProfilePayload()`.
- Produces: the deployed rule Task 4's staff lookup depends on, and a
  provisioned staff Firebase Auth account Task 4's sign-in depends on.

- [ ] **Step 1: Add the `clients/{clientId}` rule**

In `firestore.rules`, find:

```
    match /_health/kiosk {
      allow read: if false;
      allow write: if request.resource.data.keys().hasOnly(['ts']) &&
        request.resource.data.ts is string &&
        request.resource.data.ts.size() < 40;
    }
```

Replace with:

```
    match /_health/kiosk {
      allow read: if false;
      allow write: if request.resource.data.keys().hasOnly(['ts']) &&
        request.resource.data.ts is string &&
        request.resource.data.ts.size() < 40;
    }
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

- [ ] **Step 2: Deploy the rules**

```bash
firebase deploy --only firestore:rules --project bbs-style-discovery
```

Expected: `firebase deploy` reports success.

- [ ] **Step 3: Confirm Task 2's queued save now drains**

Reload the app from Task 2's testing session (or repeat: complete both
quizzes + check a worksheet item). Within a few seconds of the page having
been loaded (the `load` listener fires `retryPendingClientSaves()`),
confirm in devtools console:

```js
JSON.parse(localStorage.getItem("bbs_pending_client_saves"))
```

Expected: `[]` (empty — the queued entry drained successfully now that the
rule permits the write). Confirm the corresponding document appears at
`https://console.firebase.google.com/project/bbs-style-discovery/firestore/databases/-default-/data/~2Fclients`.

- [ ] **Step 4: Provision the shared staff account**

Generate a password and create the account via the Identity Toolkit's
public sign-up REST endpoint (this does not require Console access — it's
the same endpoint client-side sign-up flows use):

```bash
STAFF_PASSWORD=$(openssl rand -base64 18)
echo "Staff password (save this — it will not be shown again): $STAFF_PASSWORD"
curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD9IUD84Ps5oj79_VwPOQzWCw8ukcIt4jc" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"staff@bbs-style-discovery.internal\",\"password\":\"$STAFF_PASSWORD\",\"returnSecureToken\":true}"
```

Expected: a JSON response containing `idToken` and `localId` — the account
was created. **If instead the response contains
`"message": "OPERATION_NOT_ALLOWED"`**, the Email/Password sign-in
provider isn't enabled on this Firebase project yet — that one toggle is a
Console-only action (Authentication → Sign-in method → Email/Password →
Enable) with no REST/CLI equivalent. Stop here, ask the user to enable it,
then re-run this step.

Report the generated `$STAFF_PASSWORD` value back to the user in this
step's output — it is needed for Task 4's testing and for the user to
share with staff afterward. Do not commit it anywhere.

- [ ] **Step 5: Curl-based rules verification**

Using the `idToken` from Step 4's response (`$STAFF_ID_TOKEN` below) and a
scratch test ID:

```bash
STAFF_ID_TOKEN="<idToken from Step 4>"
TEST_URL="https://firestore.googleapis.com/v1/projects/bbs-style-discovery/databases/(default)/documents/clients/BBS-TEST01"

# 1. Allowed create with the exact shape — expect 200
curl -s -o /dev/null -w "%{http_code}\n" -X PATCH "$TEST_URL" \
  -H "Content-Type: application/json" \
  -d '{"fields":{"clientName":{"stringValue":"Test"},"styleArchetype":{"stringValue":"x"},"colourSeason":{"stringValue":"y"},"wardrobeChecklist":{"mapValue":{"fields":{}}},"createdAt":{"stringValue":"2026-08-17T00:00:00.000Z"}}}'

# 2. Denied create with an extra field — expect 403
curl -s -o /dev/null -w "%{http_code}\n" -X PATCH "${TEST_URL}2" \
  -H "Content-Type: application/json" \
  -d '{"fields":{"clientName":{"stringValue":"Test"},"styleArchetype":{"stringValue":"x"},"colourSeason":{"stringValue":"y"},"wardrobeChecklist":{"mapValue":{"fields":{}}},"createdAt":{"stringValue":"2026-08-17T00:00:00.000Z"},"extra":{"stringValue":"nope"}}}'

# 3. Denied update (PATCH to the same doc from #1 again with different data,
#    which Firestore's REST API treats as an update to an existing doc) — expect 403
curl -s -o /dev/null -w "%{http_code}\n" -X PATCH "$TEST_URL" \
  -H "Content-Type: application/json" \
  -d '{"fields":{"clientName":{"stringValue":"Changed"},"styleArchetype":{"stringValue":"x"},"colourSeason":{"stringValue":"y"},"wardrobeChecklist":{"mapValue":{"fields":{}}},"createdAt":{"stringValue":"2026-08-17T00:00:00.000Z"}}}'

# 4. Denied delete — expect 403
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE "$TEST_URL"

# 5. Denied anonymous read — expect 403
curl -s -o /dev/null -w "%{http_code}\n" "$TEST_URL"

# 6. Allowed authenticated read — expect 200
curl -s -o /dev/null -w "%{http_code}\n" "$TEST_URL" -H "Authorization: Bearer $STAFF_ID_TOKEN"
```

Expected codes in order: `200, 403, 403, 403, 403, 200`. If any differ,
stop and re-check the rule text from Step 1 before proceeding — do not
move on with a rule that doesn't match this verification.

- [ ] **Step 6: Clean up the scratch test document**

Rules deny delete unconditionally, including for signed-in staff, so
`clients/BBS-TEST01` from Step 5 cannot be removed via REST. Delete it
manually via the Firebase Console
(`https://console.firebase.google.com/project/bbs-style-discovery/firestore/databases/-default-/data/~2Fclients~2FBBS-TEST01`)
before finishing this task.

- [ ] **Step 7: Commit**

```bash
git add firestore.rules
git commit -m "firestore.rules: add clients/{clientId} rule (open shape-constrained create, staff-only read)"
```

---

### Task 4: Staff sign-in and lookup UI

**Files:**
- Modify: `client-profile.js` (staff auth/lookup functions)
- Modify: `app.js` (`staffLookup` view, `data-action` handlers, welcome
  screen "Staff" link, `getFreshState()`)
- Modify: `styles.css` (`.welcome-staff-link`)
- Modify: `index.html` (bump `client-profile.js`, `app.js`, `styles.css`)
- Modify: `sw.js` (matching precache bumps + `CACHE_VERSION`)

**Interfaces:**
- Consumes: `getFirebaseConfig()` (Task 1), `toFirestoreFields`/
  `fromFirestoreDocument` (Task 2, same file).
- Produces: global functions `staffSignIn(password, onDone)`,
  `staffIsSignedIn()`, `staffLookupClient(clientId, onDone)`, consumed by
  the new `app.js` view and its `data-action` handlers.

- [ ] **Step 1: Add staff auth/lookup functions to `client-profile.js`**

Append to the end of `client-profile.js`:

```js
// ---- Staff auth & lookup ----

var STAFF_EMAIL = "staff@bbs-style-discovery.internal";
var _staffIdToken = null;

function staffSignIn(password, onDone) {
    var config = (typeof getFirebaseConfig === "function") ? getFirebaseConfig() : null;
    if (!config) { onDone(false, "Not connected."); return; }
    var url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + config.apiKey;
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: STAFF_EMAIL, password: password, returnSecureToken: true })
    }).then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok, data: data }; });
    }).then(function (result) {
        if (result.ok && result.data.idToken) {
            _staffIdToken = result.data.idToken;
            onDone(true, null);
        } else {
            onDone(false, "Incorrect password.");
        }
    }).catch(function () {
        onDone(false, "Could not reach the server.");
    });
}

function staffIsSignedIn() {
    return !!_staffIdToken;
}

function staffLookupClient(clientId, onDone) {
    if (!_staffIdToken) { onDone(null, "Not signed in."); return; }
    var config = (typeof getFirebaseConfig === "function") ? getFirebaseConfig() : null;
    if (!config) { onDone(null, "Not connected."); return; }
    fetch(firestoreDocUrl(config, clientId), {
        headers: { "Authorization": "Bearer " + _staffIdToken }
    }).then(function (res) {
        if (res.status === 404) { onDone(null, "No profile found for that ID."); return; }
        if (!res.ok) { onDone(null, "Could not reach the server."); return; }
        return res.json().then(function (doc) {
            onDone(fromFirestoreDocument(doc), null);
        });
    }).catch(function () {
        onDone(null, "Could not reach the server.");
    });
}
```

- [ ] **Step 2: Verify syntax**

```bash
node --check client-profile.js
```

Expected: no output.

- [ ] **Step 3: Add transient staff-view fields to `getFreshState()`**

In `app.js`, find:

```js
        visEnsembleState: null,
        galleryKey: null,
        clientId: null,
    };
}
```

Replace with:

```js
        visEnsembleState: null,
        galleryKey: null,
        clientId: null,
        staffLookupError: null,
        staffLookupResult: null,
    };
}
```

- [ ] **Step 4: Add the `staffLookup` view case**

In `app.js`, inside `render()`'s switch, find:

```js
        case "mill-map":
            content = renderMillMap();
            break;
```

Replace with:

```js
        case "mill-map":
            content = renderMillMap();
            break;
        case "staffLookup":
            content = renderStaffLookup();
            break;
```

- [ ] **Step 5: Write `renderStaffLookup()` and `renderStaffLookupResult()`**

In `app.js`, immediately after the `renderWelcome()` function (after its
closing `}`), add:

```js
function renderStaffLookup() {
    var signedIn = typeof staffIsSignedIn === "function" && staffIsSignedIn();
    var errorHTML = appState.staffLookupError
        ? '<p class="arch-result-secondary">' + appState.staffLookupError + "</p>"
        : "";
    var body = signedIn
        ? '<div class="welcome-form-card">' +
          '<div class="welcome-form">' +
          '<label class="welcome-label" for="staff-lookup-id">Client ID</label>' +
          '<input id="staff-lookup-id" class="welcome-input" type="text" placeholder="BBS-XXXXXX" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false">' +
          "</div>" +
          '<div class="welcome-actions">' +
          '<button class="button-primary" data-action="staff-lookup-submit">Look up</button>' +
          "</div>" +
          errorHTML +
          (appState.staffLookupResult ? renderStaffLookupResult(appState.staffLookupResult) : "") +
          "</div>"
        : '<div class="welcome-form-card">' +
          '<div class="welcome-form">' +
          '<label class="welcome-label" for="staff-password-input">Staff password</label>' +
          '<input id="staff-password-input" class="welcome-input" type="password" autocomplete="off">' +
          "</div>" +
          '<div class="welcome-actions">' +
          '<button class="button-primary" data-action="staff-sign-in">Sign in</button>' +
          "</div>" +
          errorHTML +
          "</div>";
    return (
        '<div class="arch-result-shell">' +
        '<div class="arch-result-label">Staff</div>' +
        body +
        '<div class="arch-secondary-actions">' +
        '<button class="arch-btn-stroke" data-action="home">Back</button>' +
        "</div>" +
        "</div>"
    );
}

function renderStaffLookupResult(profile) {
    var checklist = profile.wardrobeChecklist || {};
    var checkedCount = Object.keys(checklist).filter(function (k) {
        return checklist[k] && checklist[k].checked;
    }).length;
    return (
        '<div class="arch-card-wrap">' +
        '<div class="arch-style-card">' +
        '<div class="arch-card-persona">' + (profile.clientName || "Client") + "</div>" +
        '<div class="arch-card-persona-sub">' + (profile.styleArchetype || "") + " &middot; " + (profile.colourSeason || "") + "</div>" +
        '<p class="arch-result-secondary">' + checkedCount + " worksheet item(s) selected</p>" +
        "</div>" +
        "</div>"
    );
}
```

- [ ] **Step 6: Add the "Staff" link to the welcome screen**

In `app.js`, inside `renderWelcome()`, find:

```js
        '<div class="welcome-actions">' +
        '<button class="button-primary" data-action="save-name">Begin the Discovery</button>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
    );
}
```

Replace with:

```js
        '<div class="welcome-actions">' +
        '<button class="button-primary" data-action="save-name">Begin the Discovery</button>' +
        "</div>" +
        "</div>" +
        '<button class="welcome-staff-link btn-bare" data-action="staff-lookup">Staff</button>' +
        "</div>" +
        "</div>"
    );
}
```

- [ ] **Step 7: Add the `data-action` handlers**

In `app.js`, inside the delegated click handler, find:

```js
    else if (action === "arch-tour-exit") {
        stopArchTour();
    }
```

Replace with:

```js
    else if (action === "arch-tour-exit") {
        stopArchTour();
    }
    else if (action === "staff-lookup") {
        appState.staffLookupError = null;
        appState.staffLookupResult = null;
        appState.view = "staffLookup";
        render({ animate: true });
    }
    else if (action === "staff-sign-in") {
        var staffPwEl = document.getElementById("staff-password-input");
        var staffPw = staffPwEl ? staffPwEl.value : "";
        if (!staffPw) return;
        target.disabled = true;
        staffSignIn(staffPw, function (ok, err) {
            target.disabled = false;
            appState.staffLookupError = ok ? null : err;
            render({ animate: false });
        });
    }
    else if (action === "staff-lookup-submit") {
        var lookupIdEl = document.getElementById("staff-lookup-id");
        var lookupId = lookupIdEl ? lookupIdEl.value.trim().toUpperCase() : "";
        if (!lookupId) return;
        target.disabled = true;
        staffLookupClient(lookupId, function (profile, err) {
            target.disabled = false;
            appState.staffLookupResult = profile;
            appState.staffLookupError = err;
            render({ animate: false });
        });
    }
```

- [ ] **Step 8: Add `.welcome-staff-link` styling**

At the end of `styles.css`, append:

```css
/* Client Profile Saving — staff entry link (2026-08-17) */
.welcome-staff-link {
    display: block;
    margin: 24px auto 0;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--taupe, #a4a19c);
    background: transparent;
    border: none;
    padding: 8px;
}
```

- [ ] **Step 9: Bump versions**

In `index.html`, change:

```html
    <script src="client-profile.js?v=1"></script>
```

to:

```html
    <script src="client-profile.js?v=2"></script>
```

Change:

```html
    <script src="app.js?v=96"></script>
```

to:

```html
    <script src="app.js?v=97"></script>
```

Change:

```html
    <link rel="stylesheet" href="styles.css?v=94" />
```

to:

```html
    <link rel="stylesheet" href="styles.css?v=95" />
```

In `sw.js`, apply the matching three precache entry bumps
(`client-profile.js?v=2`, `app.js?v=97`, `styles.css?v=95`), and change:

```js
var CACHE_VERSION = "bbs-v122";
```

to:

```js
var CACHE_VERSION = "bbs-v123";
```

(Use whatever the current value is at this point in execution, +1, if it
differs from `bbs-v122`.)

- [ ] **Step 10: Manual verification**

```bash
npx serve .
```

On the welcome screen, tap "Staff". Enter an incorrect password — confirm
"Incorrect password." renders and the app doesn't crash. Enter the real
`$STAFF_PASSWORD` from Task 3 Step 4 — confirm the password field is
replaced by the Client ID lookup field. Enter a Client ID that doesn't
exist (e.g. `BBS-000000`) — confirm "No profile found for that ID."  Enter
the real Client ID generated during Task 2/3 testing — confirm the name,
style archetype, colour season, and checked-item count render correctly
and match what was saved.

- [ ] **Step 11: Commit**

```bash
git add client-profile.js app.js styles.css index.html sw.js
git commit -m "Add staff sign-in and Client ID lookup UI"
```

---

### Task 5: Docs and final verification

**Files:**
- Modify: `CLAUDE.md`
- Modify: `verify/audit.js`

**Interfaces:**
- Consumes: nothing new — this task is documentation + full-suite
  verification of everything Tasks 1-4 built.

- [ ] **Step 1: Update CLAUDE.md's script load-order section**

In `CLAUDE.md`, find:

```
- `share-qr.js?v=N` — builds the share URL and draws the "Scan to Take With You" QR code. Only defines functions at load time (`appState` is read inside them at call time, not at parse time), but sits before `app.js` anyway to match the load-order convention every other optional-feature file here follows.
```

Replace with:

```
- `share-qr.js?v=N` — builds the share URL and draws the "Scan to Take With You" QR code. Only defines functions at load time (`appState` is read inside them at call time, not at parse time), but sits before `app.js` anyway to match the load-order convention every other optional-feature file here follows.
- `client-profile.js?v=N` — Client Profile Saving (August 2026). Generates a short Client ID, saves a profile (name, style archetype, colour season, wardrobe checklist) to Firestore via raw REST `fetch()` calls (never the SDK — same reasoning as `firebase-init.js`'s health check), queues failed/offline saves in `bbs_pending_client_saves`, and holds the staff sign-in/lookup functions for the password-gated `staffLookup` view. Same load-order exception as the Firebase block below: only defines functions at parse time, reads `appState`/calls `getFirebaseConfig()` at call time.
```

Then find:

```
- `vendor/firebase-app-compat.js`, `vendor/firebase-firestore-compat.js`, `firebase-init.js?v=N` — the Firebase connection (August 2026), all three marked `defer` in `index.html`. This is a **deliberate, documented exception** to the top-down load order this section otherwise enforces: `defer` scripts run after the document parses, so these three actually execute *after* `app.js` even though they sit before it in markup — safe only because nothing in `app.js` (or the inline validator/service-worker script at the bottom of `index.html`) references `firebase.*` or `getFirestoreDb()`. Re-check that grep before removing `defer` or moving these files. Exactly **one file may call `firebase.*` directly: `firebase-init.js`** — everything else must go through its `getFirestoreDb()` accessor, which is lazy (does not call `firebase.firestore()` until something actually asks for it, so a normal page load never pays that cost). `firebase-init.js`'s health-check write deliberately uses a raw REST `fetch()` PATCH instead of the Firestore SDK's own write methods (e.g. `db.collection(...).add(...)`): calling the SDK's write path opens a persistent Firestore long-polling "Write channel" that never closes on its own, which hung Playwright's `networkidle` wait outright in `verify/*.js` and, offline, retried indefinitely with console-spammed `net::ERR_*` lines a `.catch()` cannot suppress (browser-logged network failures, not JS exceptions). Do not revert the health check to the SDK without re-solving that.
```

Replace with:

```
- `vendor/firebase-app-compat.js`, `vendor/firebase-firestore-compat.js`, `firebase-init.js?v=N` — the Firebase connection (August 2026), all three marked `defer` in `index.html`. This is a **deliberate, documented exception** to the top-down load order this section otherwise enforces: `defer` scripts run after the document parses, so these three actually execute *after* `app.js` even though they sit before it in markup — safe only because nothing in `app.js` (or the inline validator/service-worker script at the bottom of `index.html`) references `firebase.*` or `getFirestoreDb()`. Re-check that grep before removing `defer` or moving these files. Exactly **one file may call `firebase.*` directly: `firebase-init.js`** — everything else must go through its `getFirestoreDb()` or `getFirebaseConfig()` accessors, both lazy/config-only (does not call `firebase.firestore()` until something actually asks for it, so a normal page load never pays that cost). `firebase-init.js`'s health-check write deliberately uses a raw REST `fetch()` PATCH instead of the Firestore SDK's own write methods (e.g. `db.collection(...).add(...)`): calling the SDK's write path opens a persistent Firestore long-polling "Write channel" that never closes on its own, which hung Playwright's `networkidle` wait outright in `verify/*.js` and, offline, retried indefinitely with console-spammed `net::ERR_*` lines a `.catch()` cannot suppress (browser-logged network failures, not JS exceptions). Do not revert the health check to the SDK without re-solving that. `client-profile.js` (see above) follows this same REST-only constraint for its own Firestore/Auth calls.
```

- [ ] **Step 2: Extend `verify/audit.js`'s `EXPECTED_SCRIPT_ORDER`**

In `verify/audit.js`, find:

```js
    "vendor/qrcode.min.js", "share-qr.js",
    "vendor/firebase-app-compat.js", "vendor/firebase-firestore-compat.js",
    "firebase-init.js", "app.js"
];
```

Replace with:

```js
    "vendor/qrcode.min.js", "share-qr.js", "client-profile.js",
    "vendor/firebase-app-compat.js", "vendor/firebase-firestore-compat.js",
    "firebase-init.js", "app.js"
];
```

- [ ] **Step 3: Run the audit**

```bash
node verify/audit.js
```

Expected: `AUDIT: ALL GREEN`, including the `script tag order matches
CLAUDE.md's documented load order` check.

- [ ] **Step 4: Run the full smoke suite**

```bash
node verify/smoke.js
```

Expected: all checks pass, matching the pre-existing baseline. This
feature's writes are REST-only (never the SDK's write-channel path), so
this run must not reintroduce the `networkidle`-hang class of failure
already fixed once in this project's history — if it does, stop and
investigate before proceeding; do not work around it by skipping the
check.

- [ ] **Step 5: Manual offline retry test**

With the static server running, load the app once online so the service
worker installs. Switch to airplane mode / devtools offline. Complete both
quizzes and check a worksheet item. Confirm the Client ID still displays
immediately (offline never blocks or delays this) and
`bbs_pending_client_saves` in devtools console contains the new entry.
Return online, reload. Confirm the entry drains (empty array) and the
document appears in the Firestore console.

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md verify/audit.js
git commit -m "Document Client Profile Saving in CLAUDE.md; extend audit.js script-order check"
```

---

## Definition of Done

- [ ] All five tasks committed.
- [ ] `node --check` clean on `client-profile.js` and modified `firebase-init.js`.
- [ ] `node verify/audit.js` reports `AUDIT: ALL GREEN`.
- [ ] `node verify/smoke.js` passes with no new failures versus baseline.
- [ ] Completing both quizzes + checking a worksheet item displays a
      Client ID on both result cards and creates a matching
      `clients/{clientId}` document in Firestore.
- [ ] Offline: the same flow still displays a Client ID immediately, with
      the save queued in `bbs_pending_client_saves` and draining once back
      online.
- [ ] The `staffLookup` screen: wrong password shows an inline error;
      correct password (the `$STAFF_PASSWORD` from Task 3) reveals the
      lookup field; a valid Client ID shows the saved profile; an invalid
      one shows "No profile found for that ID."
- [ ] Firestore rules verified via the Task 3 curl suite: create allowed
      (shape-constrained), update/delete always denied, anonymous read
      denied, authenticated read allowed.
- [ ] `CLAUDE.md` documents the new file and its position in the load
      order; the founder has the staff password recorded to share with
      staff out of band.
