// share-qr.js
// Builds the client-facing share URL for a result and draws it as a QR
// code. Loaded before app.js — only defines functions here, appState is
// read inside them at call time, not at parse time.

function buildShareURL(archetypeKey, colourResultKey) {
    var params = [];
    if (archetypeKey) params.push("styleKey=" + encodeURIComponent(archetypeKey));
    if (colourResultKey) params.push("colourKey=" + encodeURIComponent(colourResultKey));
    if (params.length === 0) return null;
    var base = location.origin + location.pathname;
    return base + "?" + params.join("&");
}

// A QR encoded from a file:// or localhost URL looks valid but is useless
// on a client's own phone — better to say so than draw a code that fails
// silently once scanned.
function isUsableShareOrigin() {
    return location.protocol !== "file:" &&
        location.hostname !== "localhost" &&
        location.hostname !== "127.0.0.1";
}

function initShareQR() {
    if (typeof QRCode === "undefined") return;
    var canvas = document.querySelector(".qr-share-canvas");
    if (!canvas) return;
    var url = buildShareURL(appState.archetypeKey, appState.colourResultKey);
    if (!url) return;
    if (!isUsableShareOrigin()) {
        var caption = document.querySelector(".qr-share-caption");
        if (caption) caption.textContent = "QR codes only work on the deployed site, not this local preview.";
        return;
    }
    QRCode.toCanvas(canvas, url, { width: 220, margin: 1 }, function (err) {
        if (err) console.error("QR generation failed:", err);
    });
}
