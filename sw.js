// BBS Style Discovery — service worker.
// Full offline for the in-store iPad: precache every asset the app
// needs, serve cache-first for versioned/static files, network-first
// for the HTML shell so deployed updates are picked up when online.
//
// IMPORTANT: bump CACHE_VERSION on every deploy that changes any
// cached file (the ?v= params below must match index.html).

var CACHE_VERSION = "bbs-v7";

var PRECACHE = [
    "./",
    "./index.html",
    "./styles.css?v=21",
    "./data.js",
    "./validator.js",
    "./query.js",
    "./discovery-ui.js",
    "./colour-direction.js",
    "./lookbook.js",
    "./wardrobe-templates.js",
    "./fabric-visualiser.js",
    "./archetype-avatars.js",
    "./vendor/html2canvas.min.js",
    "./vendor/jspdf.umd.min.js",
    "./app.js?v=37",
    "./fonts/eb-garamond-latin.woff2",
    "./fonts/eb-garamond-italic-latin.woff2",
    "./fonts/manrope-latin.woff2",
    "./images/bbs-logo.svg",
    "./icon.png",
    "./manifest.json",
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function (cache) {
            return cache.addAll(PRECACHE);
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys.filter(function (k) { return k !== CACHE_VERSION; })
                    .map(function (k) { return caches.delete(k); })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") return;

    var isNavigation = event.request.mode === "navigate";

    if (isNavigation) {
        // Network-first for the shell: pick up deploys when online,
        // fall back to the cached shell when offline.
        event.respondWith(
            fetch(event.request).then(function (response) {
                var copy = response.clone();
                caches.open(CACHE_VERSION).then(function (cache) {
                    cache.put(event.request, copy);
                });
                return response;
            }).catch(function () {
                // Try the exact request, then the root shell. (Not
                // "./index.html": some static hosts 301 that to "./",
                // and Chromium rejects redirected cached responses
                // for navigations.)
                return caches.match(event.request).then(function (hit) {
                    return hit || caches.match("./");
                });
            })
        );
        return;
    }

    // Cache-first for everything else (assets are ?v=-versioned, so
    // stale-cache bugs are handled by the version bump + CACHE_VERSION).
    event.respondWith(
        caches.match(event.request).then(function (cached) {
            if (cached) return cached;
            return fetch(event.request).then(function (response) {
                if (response.ok && event.request.url.indexOf(self.location.origin) === 0) {
                    var copy = response.clone();
                    caches.open(CACHE_VERSION).then(function (cache) {
                        cache.put(event.request, copy);
                    });
                }
                return response;
            });
        })
    );
});
