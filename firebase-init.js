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
