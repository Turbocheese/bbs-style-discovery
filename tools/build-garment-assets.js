// Offline preprocessor. Not shipped to the browser.
//
// The mask is a flood fill inward from the frame edge rather than a
// luminance threshold, because every source photograph has a soft cast
// shadow on the white ground. A threshold reads that shadow as garment
// and drags a grey halo into the silhouette.
var BACKGROUND_TOLERANCE = 18;

function isBackgroundish(px, i) {
    return px[i * 4] >= 255 - BACKGROUND_TOLERANCE &&
        px[i * 4 + 1] >= 255 - BACKGROUND_TOLERANCE &&
        px[i * 4 + 2] >= 255 - BACKGROUND_TOLERANCE;
}

function extractMask(px, w, h) {
    var outside = new Uint8Array(w * h);
    var stack = [];
    var x, y, i;

    // Seed from every frame-edge pixel.
    for (x = 0; x < w; x++) { stack.push(x); stack.push((h - 1) * w + x); }
    for (y = 0; y < h; y++) { stack.push(y * w); stack.push(y * w + w - 1); }

    while (stack.length) {
        i = stack.pop();
        if (outside[i]) continue;
        if (!isBackgroundish(px, i)) continue;
        outside[i] = 1;
        x = i % w; y = (i / w) | 0;
        if (x > 0) stack.push(i - 1);
        if (x < w - 1) stack.push(i + 1);
        if (y > 0) stack.push(i - w);
        if (y < h - 1) stack.push(i + w);
    }

    // The cast shadow is darker than the tolerance, so the fill stops at
    // it. Sweep it up: anything not reached that is still lighter than a
    // garment and connected to the outside is ground, not cloth.
    var mask = new Uint8Array(w * h);
    for (i = 0; i < w * h; i++) mask[i] = outside[i] ? 0 : 255;
    return sweepShadow(mask, px, w, h);
}

// Second pass over the pixels the fill could not enter. A cast shadow is
// still much lighter than mid-grey cloth, so luminance separates them
// once we already know they touch the background region.
//
// KNOWN LIMITATION: this sweep cannot tell a cast shadow from a genuinely
// light part of the garment. Any silhouette-edge pixel at luma >=
// SHADOW_MIN_LUMA that is reachable from the background gets erased along
// with the shadow — light trims, cream linings, or pale hardware sitting
// on the silhouette edge will be lost. The source photographs are shot
// against mid-grey cloth specifically so real garment content stays well
// below this threshold and this trade-off stays safe. Do not "fix" this
// without changing the photography, or the shadow sweep breaks instead.
var SHADOW_MIN_LUMA = 200;

function sweepShadow(mask, px, w, h) {
    var stack = [];
    var i, x, y;
    for (i = 0; i < w * h; i++) {
        if (mask[i] !== 0) continue;
        x = i % w; y = (i / w) | 0;
        if (x > 0) stack.push(i - 1);
        if (x < w - 1) stack.push(i + 1);
        if (y > 0) stack.push(i - w);
        if (y < h - 1) stack.push(i + w);
    }
    while (stack.length) {
        i = stack.pop();
        if (mask[i] === 0) continue;
        if (luma(px, i) < SHADOW_MIN_LUMA) continue;
        mask[i] = 0;
        x = i % w; y = (i / w) | 0;
        if (x > 0) stack.push(i - 1);
        if (x < w - 1) stack.push(i + 1);
        if (y > 0) stack.push(i - w);
        if (y < h - 1) stack.push(i + w);
    }
    return mask;
}

function luma(px, i) {
    return 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];
}

// The multiply band. The floor is above zero deliberately: a fold that
// multiplies to pure black destroys the cloth underneath it instead of
// shading it.
var LUMA_FLOOR = 90;
var LUMA_CEIL = 255;

function normaliseLuminance(px, mask, w, h) {
    var out = new Uint8Array(w * h);
    var min = 255, max = 0, i, v;

    for (i = 0; i < w * h; i++) {
        if (!mask[i]) continue;
        v = luma(px, i);
        if (v < min) min = v;
        if (v > max) max = v;
    }
    if (max <= min) max = min + 1;

    for (i = 0; i < w * h; i++) {
        if (!mask[i]) { out[i] = 0; continue; }
        v = (luma(px, i) - min) / (max - min);
        out[i] = Math.round(LUMA_FLOOR + v * (LUMA_CEIL - LUMA_FLOOR));
    }
    return out;
}

// Garment edges are soft against the white ground. Without erosion a
// pale fringe of near-background pixels stays inside the silhouette and
// reads as a halo once cloth is multiplied through it.
function erodeMask(mask, w, h, passes) {
    var cur = mask;
    for (var p = 0; p < passes; p++) {
        var next = new Uint8Array(w * h);
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var i = y * w + x;
                if (!cur[i]) continue;
                if (x === 0 || y === 0 || x === w - 1 || y === h - 1) continue;
                if (cur[i - 1] && cur[i + 1] && cur[i - w] && cur[i + w]) next[i] = 255;
            }
        }
        cur = next;
    }
    return cur;
}

module.exports = {
    extractMask: extractMask,
    luma: luma,
    erodeMask: erodeMask,
    normaliseLuminance: normaliseLuminance,
    LUMA_FLOOR: LUMA_FLOOR,
    LUMA_CEIL: LUMA_CEIL
};

// --- CLI: build images/garments/<key>.webp from source photographs -------
//
// Not exercised by tools/test-build-garment-assets.js (that file only
// touches the pure functions above). Guarded behind require.main so
// requiring this module for its pure functions never pulls in sharp or
// touches the filesystem.
if (require.main === module) {
    var sharp = require("sharp");
    var fs = require("fs");
    var path = require("path");

    // Source photograph → output key. Filenames are the Replicate prediction
    // IDs as delivered; renaming them in place would break the git history
    // that records which prompt produced which image.
    // All paths are relative to images/styleBuilder/. Each was visually
    // identified against the prompt that produced it.
    var SOURCES = {
        "jacket-sb": "replicate-prediction-n6bvdyx5p9rmr0czfph8bqrm1w.jpeg",
        "jacket-db": "replicate-prediction-sc2p8y639xrmt0czfphsvsajsg.jpeg",
        "vest-sb-none": "replicate-prediction-vac0q9x4w1rmy0czfpj92gvmn4.jpeg",
        "vest-sb-shawl": "replicate-prediction-013bpexxvxrmw0czfpts5d2n4m.jpeg",
        "vest-db-none": "replicate-prediction-552s4wn6chrmy0czfpv8051rsr.jpeg",
        "vest-db-shawl": "replicate-prediction-fw1webnjdnrmt0czfpvsnzrs2w.jpeg",
        "trousers-double-classic": "replicate-prediction-788cczn1bsrmr0czfpk9n2ecrc.jpeg",
        "trousers-flat-tapered": "replicate-prediction-wjzaqxyajxrmw0czfpm8k2xkj0.jpeg",
        "trousers-flat-classic": "replicate-prediction-01dc0g3cv5rmt0czfpyvsn7ym4.jpeg",
        "trousers-single-tapered": "replicate-prediction-86v2dh5mynrmr0czfpxba8g1gc.jpeg"
        // Still to be generated: trousers-double-tapered,
        // trousers-single-classic. The build MUST skip any key whose source
        // file is absent and report it by name rather than failing — the
        // remaining two arrive later and must not block the other ten.
    };

    var MAX_EDGE = 800; // Renders at most ~600px in app; 800 leaves headroom.

    var SRC_DIR = path.join(__dirname, "..", "images", "styleBuilder");
    var OUT_DIR = path.join(__dirname, "..", "images", "garments");
    var QUALITY = 82;

    function buildOne(key, filename) {
        var srcPath = path.join(SRC_DIR, filename);
        if (!fs.existsSync(srcPath)) {
            console.log("SKIP (no source): " + key + " -- " + filename);
            return Promise.resolve(null);
        }

        return sharp(srcPath)
            .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then(function (result) {
                var data = result.data, info = result.info;
                var w = info.width, h = info.height;
                var px = new Uint8Array(data.buffer, data.byteOffset, data.length);

                var mask = extractMask(px, w, h);
                mask = erodeMask(mask, w, h, 2);
                var lum = normaliseLuminance(px, mask, w, h);

                var out = Buffer.alloc(w * h * 4);
                for (var i = 0; i < w * h; i++) {
                    out[i * 4] = lum[i];
                    out[i * 4 + 1] = lum[i];
                    out[i * 4 + 2] = lum[i];
                    out[i * 4 + 3] = mask[i];
                }

                var outPath = path.join(OUT_DIR, key + ".webp");
                return sharp(out, { raw: { width: w, height: h, channels: 4 } })
                    .webp({ quality: QUALITY })
                    .toFile(outPath)
                    .then(function () {
                        var size = fs.statSync(outPath).size;
                        console.log(
                            "WROTE " + key + ".webp  " + w + "x" + h + "  " +
                            (size / 1024).toFixed(1) + " KB"
                        );
                        return size;
                    });
            });
    }

    (function main() {
        if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

        var keys = Object.keys(SOURCES);
        var written = 0, skipped = 0, total = 0;

        keys.reduce(function (chain, key) {
            return chain.then(function () {
                return buildOne(key, SOURCES[key]).then(function (size) {
                    if (size === null) { skipped++; }
                    else { written++; total += size; }
                });
            });
        }, Promise.resolve()).then(function () {
            console.log("---");
            console.log(written + " written, " + skipped + " skipped");
            console.log("TOTAL ASSET SIZE: " + (total / 1048576).toFixed(2) + " MB");
            if (total > 8 * 1048576) {
                console.log(
                    "WARNING: total asset size exceeds 8 MB " +
                    "(founder-accepted quality-first budget, but flagged as required)."
                );
            }
        }).catch(function (err) {
            console.error(err);
            process.exit(1);
        });
    })();
}
