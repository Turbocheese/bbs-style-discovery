// The Cloth Study drape — pixel checks on what actually rendered.
//
// Usage (from the repo root, with `npx serve .` running):
//   node verify/drape.js
//
// The drape hangs a GATHERED panel: the cloth is wider than the bar, so the
// surplus has to buckle out of the plane, and the folds you see are the
// shading of that buckle. Two ways that silently breaks, both hit during
// development, and both invisible to a "did it render" assertion:
//
//   1. The surplus escapes sideways instead of folding (it did, until the mesh
//      got diagonal/shear constraints). The panel then hangs flat and wide —
//      still a picture of cloth, just a dead one.
//   2. The shading loses its range and every column reads the same.
//
// So this measures the column-by-column luminance of a PLAIN cloth — no stripe
// to fake fold structure — and the panel's width against the frame.
var playwright = require("playwright");

var MIN_COVERAGE = 0.42;   // opaque share of the canvas box
// Calibration: the shipped gather measures ~9.8. Setting gather to 1.0 (no
// surplus, so nothing to buckle) drops it to ~5.3 — the seeded fold shape
// lingers even with nothing driving it — so the floor sits between the two.
var MIN_FOLD_SD = 7.5;     // stddev of per-column mean luminance, 0-255
var MIN_WIDTH = 0.58;      // panel width as a share of canvas width
var MAX_WIDTH = 0.97;      // above this the gather has relaxed / it is clipping

(async function () {
    var browser = await playwright.chromium.launch();
    var page = await browser.newPage();
    var url = process.env.SMOKE_URL || "http://localhost:3000";
    var errors = [];
    page.on("pageerror", function (e) { errors.push(String(e)); });
    page.on("console", function (m) { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(url);
    await page.waitForLoadState("networkidle");

    var out = await page.evaluate(function () {
        // A cloth with no overlay: its fold structure can only come from the
        // shading, not from a stripe that would read as folds either way.
        var plain = null;
        for (var i = 0; i < CLOTH_LIBRARY.length && !plain; i++) {
            var c = CLOTH_LIBRARY[i];
            if (!c.overlay || c.overlay.type === "none") plain = c;
        }
        if (!plain) return { error: "no unpatterned cloth in CLOTH_LIBRARY" };
        appState.clientName = "Verify";
        appState.visFabricKey = plain.key;
        appState.view = "fabric-visualiser";
        render({ animate: false });
        return { key: plain.key };
    });
    if (out.error) { console.error("FAIL: " + out.error); process.exit(1); }

    // The panel starts as a flat grid and has to buckle and settle.
    await page.waitForTimeout(3000);

    var m = await page.evaluate(function () {
        var cv = document.getElementById("cstudy-drape");
        if (!cv) return { error: "no #cstudy-drape canvas" };
        var w = cv.width, h = cv.height;
        var px = cv.getContext("2d").getImageData(0, 0, w, h).data;
        // Read the middle band only: the bar sits over the top and the hem
        // swings, so neither says anything about the folds.
        var y0 = Math.round(h * 0.3), y1 = Math.round(h * 0.75);
        var opaque = 0, cols = [], minX = w, maxX = -1;
        for (var x = 0; x < w; x++) {
            var sum = 0, n = 0;
            for (var y = y0; y < y1; y++) {
                var i = (y * w + x) * 4;
                if (px[i + 3] < 200) continue;
                sum += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
                n++;
            }
            opaque += n;
            if (n > (y1 - y0) * 0.5) { cols.push(sum / n); if (x < minX) minX = x; if (x > maxX) maxX = x; }
        }
        var mean = 0;
        for (var k = 0; k < cols.length; k++) mean += cols[k];
        mean /= (cols.length || 1);
        var v = 0;
        for (k = 0; k < cols.length; k++) v += (cols[k] - mean) * (cols[k] - mean);
        return {
            coverage: opaque / (w * (y1 - y0)),
            foldSD: Math.sqrt(v / (cols.length || 1)),
            widthFrac: maxX < 0 ? 0 : (maxX - minX + 1) / w
        };
    });
    if (m.error) { console.error("FAIL: " + m.error); process.exit(1); }

    var fails = [];
    function check(name, ok, detail) {
        console.log((ok ? "PASS: " : "FAIL: ") + name + " (" + detail + ")");
        if (!ok) fails.push(name);
    }
    check("panel covers the frame", m.coverage >= MIN_COVERAGE,
        "opaque " + m.coverage.toFixed(2) + " >= " + MIN_COVERAGE);
    check("folds shade the plain cloth", m.foldSD >= MIN_FOLD_SD,
        "column luminance sd " + m.foldSD.toFixed(1) + " >= " + MIN_FOLD_SD);
    check("panel stays gathered, not splayed flat", m.widthFrac >= MIN_WIDTH && m.widthFrac <= MAX_WIDTH,
        "width " + m.widthFrac.toFixed(2) + " within " + MIN_WIDTH + "-" + MAX_WIDTH);
    check("no console or page errors", errors.length === 0, errors.length + " errors");

    await browser.close();
    if (fails.length) process.exit(1);
})();
