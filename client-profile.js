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

// ---- Bespoke Spec Configurator: custom_configurations save (2026-08-17) ----
//
// Same REST-only, no-SDK approach as saveClientProfile above and for the
// same reason (see this file's header comment / firebase-init.js). One
// real constraint this introduces: a true Firestore ServerTimestamp is a
// write-transform sentinel only expressible via the SDK's write path or
// the more complex `:commit` API with `updateTransforms` — neither of
// which this app uses. `timestamp` here is therefore a client-set ISO
// string, same as `clients/{clientId}`'s own `createdAt` field, not a
// server-authoritative value. Good enough for "when was this configured
// on this kiosk" — not something to build billing or ordering off.

var CONFIG_ID_ALPHABET = CLIENT_ID_ALPHABET;
var PENDING_CONFIG_SAVES_KEY = "bbs_pending_config_saves";

// configId -> callback, so a save that had to queue offline can still
// notify the Spec Card once retryPendingConfigSaves() actually lands it,
// even if that happens well after the call that queued it returned.
var _pendingConfigSyncCallbacks = {};

function generateConfigId() {
    var randomValues = null;
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        randomValues = new Uint8Array(6);
        crypto.getRandomValues(randomValues);
    }
    var chars = "";
    for (var i = 0; i < 6; i++) {
        var idx = randomValues
            ? randomValues[i] % CONFIG_ID_ALPHABET.length
            : Math.floor(Math.random() * CONFIG_ID_ALPHABET.length);
        chars += CONFIG_ID_ALPHABET.charAt(idx);
    }
    return "CFG-" + chars;
}

function readPendingConfigSaves() {
    try {
        var raw = localStorage.getItem(PENDING_CONFIG_SAVES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function writePendingConfigSaves(queue) {
    try {
        localStorage.setItem(PENDING_CONFIG_SAVES_KEY, JSON.stringify(queue));
    } catch (e) {
        // Storage unavailable — the pending save is simply lost.
    }
}

function queuePendingConfigSave(configId, payload) {
    var queue = readPendingConfigSaves().filter(function (entry) {
        return entry.configId !== configId;
    });
    queue.push({ configId: configId, payload: payload });
    writePendingConfigSaves(queue);
}

function removePendingConfigSave(configId) {
    var queue = readPendingConfigSaves().filter(function (entry) {
        return entry.configId !== configId;
    });
    writePendingConfigSaves(queue);
}

function customConfigDocUrl(config, configId) {
    return "https://firestore.googleapis.com/v1/projects/" + config.projectId +
        "/databases/(default)/documents/custom_configurations/" + configId;
}

// selections: { jacket: {lapelStyle, pockets}, trousers: {pleat, waistband} }
// (whatever subset of garments the outfit actually includes). Returns the
// generated configId synchronously — same "always available immediately,
// online or not" contract as generateClientId()/saveClientProfile — and
// calls onSynced(true) once a 200 is actually confirmed, whether that
// happens on this call or later via retryPendingConfigSaves(), or
// onSynced(false) if the write is still only queued when this call returns.
function saveCustomConfiguration(selections, onSynced) {
    var configId = generateConfigId();
    var payload = {
        configId: configId,
        timestamp: new Date().toISOString(),
        selections: selections,
        archetype: (typeof appState !== "undefined" && appState.archetypeKey) || "",
        clientPalette: (typeof appState !== "undefined" && appState.colourResultKey) || ""
    };

    if (onSynced) _pendingConfigSyncCallbacks[configId] = onSynced;

    function queueAndReport() {
        queuePendingConfigSave(configId, payload);
        if (onSynced) onSynced(false, configId);
    }

    if (typeof navigator !== "undefined" && navigator.onLine === false) { queueAndReport(); return configId; }
    var config = (typeof getFirebaseConfig === "function") ? getFirebaseConfig() : null;
    if (!config) { queueAndReport(); return configId; }
    try {
        fetch(customConfigDocUrl(config, configId), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fields: toFirestoreFields(payload) })
        }).then(function (res) {
            if (res.ok) {
                delete _pendingConfigSyncCallbacks[configId];
                if (onSynced) onSynced(true, configId);
            } else {
                queueAndReport();
            }
        }).catch(queueAndReport);
    } catch (e) {
        queueAndReport();
    }
    return configId;
}

function retryPendingConfigSaves() {
    if (typeof navigator !== "undefined" && navigator.onLine === false) return;
    var config = (typeof getFirebaseConfig === "function") ? getFirebaseConfig() : null;
    if (!config) return;
    var queue = readPendingConfigSaves();
    queue.forEach(function (entry) {
        fetch(customConfigDocUrl(config, entry.configId), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fields: toFirestoreFields(entry.payload) })
        }).then(function (res) {
            if (res.ok) {
                removePendingConfigSave(entry.configId);
                var cb = _pendingConfigSyncCallbacks[entry.configId];
                if (cb) { delete _pendingConfigSyncCallbacks[entry.configId]; cb(true, entry.configId); }
            }
        }).catch(function () {});
    });
}

if (typeof window !== "undefined") {
    window.addEventListener("online", retryPendingConfigSaves);
    window.addEventListener("load", retryPendingConfigSaves);
}
