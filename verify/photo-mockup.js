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
    // ~10% of interior samples legitimately do NOT differ between two cloths:
    // the baked-in black Bemberg lining (jacket neck, vest back) multiplies to
    // black on ANY cloth by design, and deep near-black folds barely move. So
    // the bar is 0.8, not ~1.0 — still far above the ~0% a genuinely undrawn
    // cloth would produce, which is what this check exists to catch.
    if (result.differing / result.sampled < 0.8) {
        console.error("FAIL: charcoal vs. navy renders look the same — cloth may not be drawn (" +
            result.differing + "/" + result.sampled + " sampled pixels differed)");
        process.exit(1);
    }

    console.log("PASS: garment composited (" + result.opaque + " opaque, " + result.transparent + " transparent); cloth discriminates (" +
        result.differing + "/" + result.sampled + " sampled pixels differed between charcoal and navy)");

    // The load-bearing check. Render a chalkstripe and confirm stripe
    // spacing at the lapel differs from spacing at the hem. If they match,
    // the displacement field is not being applied and everything else is
    // theatre.
    var stripes = await page.evaluate(function () {
        var c = document.createElement("canvas");
        c.width = 400; c.height = 500;
        window.renderGarmentPhoto(c, "jacket-sb", "fox_flannel_chalkstripe");
        var ctx = c.getContext("2d");
        function edgesAcross(y) {
            var d = ctx.getImageData(0, y, 400, 1).data;
            var n = 0, prev = null;
            for (var x = 0; x < 400; x++) {
                if (d[x * 4 + 3] < 128) continue;
                var lum = d[x * 4];
                if (prev !== null && Math.abs(lum - prev) > 25) n++;
                prev = lum;
            }
            return n;
        }
        return { lapel: edgesAcross(140), hem: edgesAcross(430) };
    });

    if (stripes.lapel === stripes.hem) {
        console.error("FAIL: stripe density identical at lapel and hem — displacement not applied");
        process.exit(1);
    }
    console.log("PASS: displacement bends the pattern (lapel " + stripes.lapel + " vs hem " + stripes.hem + ")");

    // The edge-count check above can pass on incidental noise alone —
    // confirmed by disabling displacement and finding lapel(3) still
    // != hem(4) purely from mask-width/texture variation, with no
    // displacement code running at all. This is the decisive check:
    // build a "flat baseline" render with the same public helpers
    // (findCloth, drawClothTile) but skip the displacement step, then
    // diff it against the real output. The lapel band MUST differ
    // substantially from that baseline (displacement changed it) and
    // the hem band MUST be byte-identical (no region covers it, so
    // nothing should have changed there — if it did, something other
    // than the four defined regions is being touched).
    var regionCheck = await page.evaluate(function () {
        return new Promise(function (resolve) {
            var c1 = document.createElement("canvas");
            c1.width = 400; c1.height = 500;

            function tryReal() {
                var ok = window.renderGarmentPhoto(c1, "jacket-sb", "fox_flannel_chalkstripe");
                if (!ok) { setTimeout(tryReal, 50); return; }
                buildReference();
            }

            function buildReference() {
                var cloth = findCloth("fox_flannel_chalkstripe");
                var tile = document.createElement("canvas");
                tile.width = 96; tile.height = 96;
                drawClothTile(tile.getContext("2d"), cloth);

                var img = new Image();
                img.onload = function () {
                    var c2 = document.createElement("canvas");
                    c2.width = 400; c2.height = 500;
                    var ctx = c2.getContext("2d");
                    var pattern = ctx.createPattern(tile, "repeat");
                    ctx.fillStyle = pattern;
                    ctx.fillRect(0, 0, 400, 500);
                    // Deliberately no displacement step — flat baseline.
                    ctx.globalCompositeOperation = "multiply";
                    ctx.drawImage(img, 0, 0, 400, 500);
                    ctx.globalCompositeOperation = "destination-in";
                    ctx.drawImage(img, 0, 0, 400, 500);
                    ctx.globalCompositeOperation = "source-over";

                    var real = c1.getContext("2d").getImageData(0, 0, 400, 500).data;
                    var ref = c2.getContext("2d").getImageData(0, 0, 400, 500).data;

                    function regionDiff(y0, y1) {
                        var sampled = 0, differing = 0;
                        for (var y = y0; y < y1; y++) {
                            for (var x = 0; x < 400; x++) {
                                var i = (y * 400 + x) * 4;
                                if (real[i + 3] < 128 || ref[i + 3] < 128) continue;
                                sampled++;
                                var d = Math.abs(real[i] - ref[i]) + Math.abs(real[i + 1] - ref[i + 1]) + Math.abs(real[i + 2] - ref[i + 2]);
                                if (d > 15) differing++;
                            }
                        }
                        return { sampled: sampled, differing: differing };
                    }

                    resolve({ lapel: regionDiff(120, 160), hem: regionDiff(410, 450) });
                };
                img.src = "images/garments/jacket-sb.webp";
            }

            tryReal();
        });
    });

    var lapelFrac = regionCheck.lapel.sampled ? regionCheck.lapel.differing / regionCheck.lapel.sampled : 0;
    var hemFrac = regionCheck.hem.sampled ? regionCheck.hem.differing / regionCheck.hem.sampled : 0;

    if (lapelFrac <= 0.3 || hemFrac >= 0.05) {
        console.error("FAIL: displacement not confirmed as region-confined (lapel " + (lapelFrac * 100).toFixed(0) +
            "% differ from flat baseline, hem " + (hemFrac * 100).toFixed(0) + "% differ — expected lapel > 30%, hem < 5%)");
        process.exit(1);
    }
    console.log("PASS: displacement confined to defined regions (lapel " + (lapelFrac * 100).toFixed(0) +
        "% of pixels differ from flat baseline, hem " + (hemFrac * 100).toFixed(0) + "% differ)");

    // Coverage: walk the full cross-product of the (Task 8-reduced)
    // option set and confirm every combination resolves to a key that
    // is a real, loadable asset.
    var coverage = await page.evaluate(function () {
        var missing = [];
        var G = window.VIS_ENS_STYLE_OPTIONS;
        for (var garment in G) {
            var groups = G[garment], keys = [], combos = [{}];
            for (var g in groups) keys.push(g);
            keys.forEach(function (g) {
                var next = [];
                combos.forEach(function (c) {
                    groups[g].forEach(function (o) {
                        var d = {}; for (var k in c) d[k] = c[k];
                        d[g] = o.key; next.push(d);
                    });
                });
                combos = next;
            });
            combos.forEach(function (c) {
                var key = window.resolveGarmentKey(garment, c);
                if (!key || window.GARMENT_ASSET_KEYS.indexOf(key) === -1) {
                    missing.push(garment + " " + JSON.stringify(c) + " -> " + key);
                }
            });
        }
        return { missing: missing, total: missing.length };
    });

    // Every selectable option combination must resolve to a real, built
    // photograph. There are no pending garments now — double-breasted vests
    // and the Gurkha trouser are hidden from the configurator, not offered,
    // so they never appear in this cross-product.
    if (coverage.missing.length > 0) {
        console.error("FAIL: " + coverage.missing.length + " combinations resolve to no asset:");
        coverage.missing.slice(0, 12).forEach(function (m) { console.error("  " + m); });
        process.exit(1);
    }
    console.log("PASS: every option combination resolves to a real photograph");

    await browser.close();
})();
