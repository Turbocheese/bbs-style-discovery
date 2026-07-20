// Drives the real app. Reads pixels out of the composited canvas —
// asserting that an asset loaded proves nothing about what rendered.
var playwright = require("playwright");

(async function () {
    var browser = await playwright.chromium.launch();
    var page = await browser.newPage();
    var url = process.env.SMOKE_URL || "http://localhost:3000";
    await page.goto(url);
    await page.waitForLoadState("networkidle");

    // renderGarmentPhoto returns false while the garment image is still
    // loading (documented behavior), so the first call in a fresh page
    // will race the async Image load. Poll until it succeeds instead of
    // asserting on a single synchronous call.
    //
    // Opaque/transparent pixel counts alone can't prove the cloth was
    // actually drawn: if step 1 (tiling the cloth) were skipped and only
    // the garment photo were drawn onto a transparent canvas, canvas
    // "multiply" against a transparent destination collapses to plain
    // source-over, producing the same opaque/transparent profile. To
    // genuinely require the cloth, render the same garment with two
    // visually distinct cloths and assert the interior pixels differ.
    var result = await page.evaluate(function () {
        return new Promise(function (resolve) {
            var c = document.createElement("canvas");
            c.width = 400; c.height = 500;
            if (!window.renderGarmentPhoto) { resolve({ error: "renderGarmentPhoto missing" }); return; }

            var attempts = 0;
            function tryRender() {
                attempts++;
                var ok = window.renderGarmentPhoto(c, "jacket-sb", "fox_classic_flannel_charcoal");
                if (!ok) {
                    if (attempts > 100) { resolve({ error: "render returned false after " + attempts + " attempts" }); return; }
                    setTimeout(tryRender, 50);
                    return;
                }
                var d = c.getContext("2d").getImageData(0, 0, 400, 500).data;
                var opaque = 0, transparent = 0;
                for (var i = 3; i < d.length; i += 4) {
                    if (d[i] > 200) opaque++; else if (d[i] < 20) transparent++;
                }

                // Second render, same garment, a clearly different cloth
                // (dark charcoal plain vs. navy). By this point the
                // garment image is already cached so this call is
                // synchronous.
                var c2 = document.createElement("canvas");
                c2.width = 400; c2.height = 500;
                var ok2 = window.renderGarmentPhoto(c2, "jacket-sb", "fox_worsted_flannel_navy");
                if (!ok2) { resolve({ error: "second-cloth render returned false" }); return; }
                var d2 = c2.getContext("2d").getImageData(0, 0, 400, 500).data;

                // Sample interior pixels that are opaque in BOTH renders
                // (garment area, not background) and compare RGB. Stride
                // by 4 pixels' worth of components * 7 to spread samples
                // across the canvas without walking every pixel.
                var sampled = 0, differing = 0;
                for (var i2 = 0; i2 < d.length; i2 += 4 * 7) {
                    var a1 = d[i2 + 3], a2 = d2[i2 + 3];
                    if (a1 <= 200 || a2 <= 200) continue;
                    sampled++;
                    var dr = Math.abs(d[i2] - d2[i2]);
                    var dg = Math.abs(d[i2 + 1] - d2[i2 + 1]);
                    var db = Math.abs(d[i2 + 2] - d2[i2 + 2]);
                    if (dr + dg + db > 6) differing++;
                }

                resolve({
                    opaque: opaque,
                    transparent: transparent,
                    sampled: sampled,
                    differing: differing
                });
            }
            tryRender();
        });
    });

    if (result.error) { console.error("FAIL: " + result.error); process.exit(1); }
    if (result.opaque < 20000) { console.error("FAIL: garment barely rendered (" + result.opaque + " opaque px)"); process.exit(1); }
    if (result.transparent < 20000) { console.error("FAIL: no background left — mask not applied"); process.exit(1); }
    if (result.sampled < 50) { console.error("FAIL: too few interior samples to judge cloth (" + result.sampled + ")"); process.exit(1); }
    if (result.differing / result.sampled < 0.9) {
        console.error("FAIL: charcoal vs. navy renders look the same — cloth may not be drawn (" +
            result.differing + "/" + result.sampled + " sampled pixels differed)");
        process.exit(1);
    }

    console.log("PASS: garment composited (" + result.opaque + " opaque, " + result.transparent + " transparent); cloth discriminates (" +
        result.differing + "/" + result.sampled + " sampled pixels differed between charcoal and navy)");
    await browser.close();
})();
