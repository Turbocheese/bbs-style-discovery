// firebase-init.js — Firebase connection groundwork.
// See docs/superpowers/specs/2026-08-16-firebase-connection-design.md.
// Exactly one file may call firebase.* directly: this one. Everything
// else must go through getFirestoreDb().
//
// getFirestoreDb() is lazy — firebase.firestore() is not called until
// something actually asks for it. Calling firebase.firestore() and
// performing an operation opens a persistent Write-channel connection
// that never closes on its own, which breaks Playwright's networkidle
// wait and, offline, retries indefinitely and spams the console with
// net::ERR_* lines the JS layer cannot suppress (browser-logged network
// failures, not JS exceptions — a .catch() cannot hide them). The
// health-check write below deliberately avoids the SDK entirely (a
// one-shot fetch to the Firestore REST API instead) so a normal page
// load never opens that channel at all.

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

    function getFirestoreDb() {
        if (!_firebaseInitialized) return null;
        if (!_firestoreDb) {
            try {
                _firestoreDb = firebase.firestore();
            } catch (e) {
                _firestoreDb = null;
            }
        }
        return _firestoreDb;
    }

    (function reportHealthCheck() {
        if (typeof navigator !== "undefined" && navigator.onLine === false) return;
        try {
            // PATCH to a fixed document path ("create or update this exact
            // ID") rather than POST to the collection — a POST would mint a
            // brand-new auto-ID document on every page load forever; the
            // firestore.rules for _health/kiosk only allow writes to this
            // one document, so this must match.
            fetch("https://firestore.googleapis.com/v1/projects/bbs-style-discovery/databases/(default)/documents/_health/kiosk", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fields: { ts: { stringValue: new Date().toISOString() } } })
            }).catch(function () {});
        } catch (e) {
            // Connectivity is opportunistic and never user-visible — swallow.
        }
    })();

    global.getFirestoreDb = getFirestoreDb;
})(typeof window !== "undefined" ? window : this);
