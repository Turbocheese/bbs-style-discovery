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
                resolve({ opaque: opaque, transparent: transparent });
            }
            tryRender();
        });
    });

    if (result.error) { console.error("FAIL: " + result.error); process.exit(1); }
    if (result.opaque < 20000) { console.error("FAIL: garment barely rendered (" + result.opaque + " opaque px)"); process.exit(1); }
    if (result.transparent < 20000) { console.error("FAIL: no background left — mask not applied"); process.exit(1); }

    console.log("PASS: garment composited (" + result.opaque + " opaque, " + result.transparent + " transparent)");
    await browser.close();
})();
