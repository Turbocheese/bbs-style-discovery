// share-qr.js
// Builds the client-facing share URL for a result and draws it as a QR
// code. Loaded after app.js (needs the global appState).

function buildShareURL(archetypeKey, colourResultKey) {
    var params = [];
    if (archetypeKey) params.push("styleKey=" + encodeURIComponent(archetypeKey));
    if (colourResultKey) params.push("colourKey=" + encodeURIComponent(colourResultKey));
    if (params.length === 0) return null;
    var base = location.origin + location.pathname;
    return base + "?" + params.join("&");
}

function initShareQR() {
    if (typeof QRCode === "undefined") return;
    var canvas = document.querySelector(".qr-share-canvas");
    if (!canvas) return;
    var url = buildShareURL(appState.archetypeKey, appState.colourResultKey);
    if (!url) return;
    QRCode.toCanvas(canvas, url, { width: 220, margin: 1 }, function (err) {
        if (err) console.error("QR generation failed:", err);
    });
}
