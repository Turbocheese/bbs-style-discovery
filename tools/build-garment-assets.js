// Offline preprocessor. Not shipped to the browser.
//
// The mask is a flood fill inward from the frame edge rather than a
// luminance threshold: the flood keys on the near-white background and
// stops at the garment, then connectivity (keepLargestComponent) keeps
// only the silhouette and drops stray specks. Source photographs are shot
// on a pure-white ground with no cast shadow — the two trousers that
// arrived on a tinted ground are white-normalised in preprocessing (see
// SOURCES) — so there is no cast shadow to sweep.
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

    var mask = new Uint8Array(w * h);
    for (i = 0; i < w * h; i++) mask[i] = outside[i] ? 0 : 255;

    // A garment is one connected object; keep only the largest connected
    // region and drop every stray island (JPEG speckle, a detached
    // hardware glint) as debris.
    return keepLargestComponent(mask, w, h);
}

// A garment is a single connected object. The edge flood can leave a
// detached blob stranded (masked in) — a speck of JPEG noise or a glint
// that never got keyed as background. That blob shares no 4-connected
// path to the true silhouette, so label every connected region of the
// mask and keep only the largest — everything else is debris, not cloth.
// Same 4-connectivity as the flood fill above.
function keepLargestComponent(mask, w, h) {
    var n = w * h;
    var labels = new Int32Array(n);
    var i, x, y, j;
    for (i = 0; i < n; i++) labels[i] = -1;

    var sizes = [];
    var stack = [];
    var label = 0;

    for (i = 0; i < n; i++) {
        if (mask[i] === 0 || labels[i] !== -1) continue;
        stack.push(i);
        labels[i] = label;
        var count = 0;
        while (stack.length) {
            j = stack.pop();
            count++;
            x = j % w; y = (j / w) | 0;
            if (x > 0 && mask[j - 1] !== 0 && labels[j - 1] === -1) { labels[j - 1] = label; stack.push(j - 1); }
            if (x < w - 1 && mask[j + 1] !== 0 && labels[j + 1] === -1) { labels[j + 1] = label; stack.push(j + 1); }
            if (y > 0 && mask[j - w] !== 0 && labels[j - w] === -1) { labels[j - w] = label; stack.push(j - w); }
            if (y < h - 1 && mask[j + w] !== 0 && labels[j + w] === -1) { labels[j + w] = label; stack.push(j + w); }
        }
        sizes.push(count);
        label++;
    }

    var out = new Uint8Array(n);
    if (label === 0) return out; // nothing masked in at all

    var bestLabel = 0, bestSize = sizes[0];
    for (i = 1; i < sizes.length; i++) {
        if (sizes[i] > bestSize) { bestSize = sizes[i]; bestLabel = i; }
    }

    for (i = 0; i < n; i++) {
        out[i] = (labels[i] === bestLabel) ? mask[i] : 0;
    }
    return out;
}

function luma(px, i) {
    return 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];
}

// The multiply band. The floor is above zero deliberately: a fold that
// multiplies to pure black destroys the cloth underneath it instead of
// shading it.
var LUMA_FLOOR = 90;
var LUMA_CEIL = 255;

// Baked-in black Bemberg linings (the jacket neck opening, the vest back)
// sit in a distinct dark cluster far below the cloth — measured luma < ~50,
// with a clear valley around 55-65 before the cloth mass begins near 70.
// Normalising them together with the cloth would stretch that near-black up
// to LUMA_FLOOR, so the cloth would show THROUGH the lining under multiply
// (a translucent lining). Instead, treat anything darker than LINING_LUMA as
// lining and map it into [0, LINING_CEIL]; the cloth above the threshold keeps
// the [FLOOR, CEIL] band so its folds still shade rather than punch through.
// Trousers carry no lining and never dip below the threshold, so they are
// unaffected.
//
// Because the cloth is applied by multiply, the lining renders as
// cloth-luminance x (lining / 255). LINING_CEIL therefore sets its character:
// a very low ceil crushes it to pure black on every cloth (too harsh on pale
// cloths), while a higher ceil makes it TONAL — near-black on dark cloths, a
// soft dark grey on pale ones (the bespoke look). Tuned for that balance;
// lower it toward black, raise it toward soft.
var LINING_LUMA = 60;
var LINING_CEIL = 70;

// The endpoints are percentiles, not the absolute darkest and lightest
// pixel. A single crushed pixel and a single blown highlight are enough to
// pin min/max to the full range, which turns the stretch below into a no-op
// and leaves the garment with whatever contrast the photograph happened to
// have. That is what shipped: the trousers measured a luminance spread of
// sd 18 against the jacket's sd 39, so under multiply they modelled almost
// no form and read flat and washed out beside it. Clipping the extreme 1%
// at each end throws those outliers away and stretches the range the cloth
// actually occupies, which evens the garments out against each other.
// Anything beyond the endpoints clamps, which is intended — a genuine
// deep fold should sit at the floor.
var LUMA_CLIP_LOW = 0.01;
var LUMA_CLIP_HIGH = 0.99;

function normaliseLuminance(px, mask, w, h) {
    var out = new Uint8Array(w * h);
    var min = 255, max = 0, i, v;

    // Cloth range excludes the lining-dark pixels, so the lining can't drag
    // the floor down and darken the whole garment. Histogram rather than a
    // sort: this runs over the supersampled image (millions of pixels) and
    // luma is already integral, so 256 bins give exact percentiles in one
    // pass and no allocation per pixel.
    var hist = new Uint32Array(256);
    var total = 0;
    for (i = 0; i < w * h; i++) {
        if (!mask[i]) continue;
        v = luma(px, i);
        if (v < LINING_LUMA) continue;
        hist[v | 0]++;
        total++;
    }

    if (total > 0) {
        var lowTarget = total * LUMA_CLIP_LOW;
        var highTarget = total * LUMA_CLIP_HIGH;
        var seen = 0;
        min = 255; max = 0;
        for (v = 0; v < 256; v++) {
            if (!hist[v]) continue;
            var before = seen;
            seen += hist[v];
            if (before <= lowTarget && min === 255 && seen > lowTarget) min = v;
            if (before < highTarget && seen >= highTarget) { max = v; break; }
        }
        if (min === 255 && max === 0) { min = 0; max = 255; }
    }
    if (max <= min) max = min + 1;

    for (i = 0; i < w * h; i++) {
        if (!mask[i]) { out[i] = 0; continue; }
        v = luma(px, i);
        if (v < LINING_LUMA) {
            // Near-black lining, kept proportional so its own faint shading
            // survives but it still multiplies to black on any cloth.
            out[i] = Math.round((v / LINING_LUMA) * LINING_CEIL);
        } else {
            var t = (v - min) / (max - min);
            if (t < 0) t = 0; else if (t > 1) t = 1;
            out[i] = Math.round(LUMA_FLOOR + t * (LUMA_CEIL - LUMA_FLOOR));
        }
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

// How far the boundary ring may sit above the garment's own median luma
// before it counts as background bleed rather than as a lit edge.
var FRINGE_TOLERANCE = 8;

// How far in to look for the garment's own luma when judging the rim.
var FRINGE_PROBE_DEPTH = 6;

function medianMaskedLuma(px, mask, w, h) {
    var hist = new Int32Array(256);
    var n = w * h, total = 0, i;
    for (i = 0; i < n; i++) {
        if (!mask[i]) continue;
        hist[Math.round(luma(px, i))]++;
        total++;
    }
    if (!total) return 0;
    var seen = 0;
    for (i = 0; i < 256; i++) {
        seen += hist[i];
        if (seen * 2 >= total) return i;
    }
    return 255;
}

// Mean luma of the masked pixels that touch the outside — the ring the
// silhouette edge is currently cut through.
function ringMeanLuma(px, mask, w, h) {
    var sum = 0, count = 0, x, y, i;
    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            i = y * w + x;
            if (!mask[i]) continue;
            if ((x > 0 && !mask[i - 1]) || (x < w - 1 && !mask[i + 1]) ||
                (y > 0 && !mask[i - w]) || (y < h - 1 && !mask[i + w])) {
                sum += luma(px, i);
                count++;
            }
        }
    }
    return count ? sum / count : 0;
}

// The mask boundary lands wherever the background flood stopped, which is
// partway down the photograph's own soft edge. On a clean white-ground shot
// that leaves a pixel or two of fringe and the fixed EDGE_ERODE covers it.
// The two trousers that arrived on a tinted ground and were white-normalised
// are different: the normalisation stretched their falloff into a bright rim
// more than ten pixels deep, which multiplies through as a pale halo tracing
// the whole silhouette (measured +71 luma over the garment's interior). A
// fixed erosion wide enough for those would bite lapel points and hems off
// every other garment, so cut one pass at a time and stop as soon as the
// boundary ring is no longer brighter than the garment's own median.
function erodeFringe(px, mask, w, h, tolerance, maxPasses) {
    if (tolerance === undefined) tolerance = FRINGE_TOLERANCE;
    if (maxPasses === undefined) maxPasses = 40;
    // Take the reference median from well inside the silhouette. Measured on
    // the whole mask the rim would help set the very level it is being judged
    // against, and a wide enough rim drags the median up to its own value.
    var probe = erodeMask(mask, w, h, FRINGE_PROBE_DEPTH);
    var probed = false;
    for (var p = 0; p < w * h; p++) { if (probe[p]) { probed = true; break; } }
    var limit = medianMaskedLuma(px, probed ? probe : mask, w, h) + tolerance;
    var passes = 0;
    while (passes < maxPasses && ringMeanLuma(px, mask, w, h) > limit) {
        var next = erodeMask(mask, w, h, 1);
        var any = false;
        for (var i = 0; i < w * h; i++) { if (next[i]) { any = true; break; } }
        if (!any) break; // pathological photo: keep what we have rather than nothing
        mask = next;
        passes++;
    }
    return { mask: mask, passes: passes };
}

module.exports = {
    extractMask: extractMask,
    luma: luma,
    keepLargestComponent: keepLargestComponent,
    erodeMask: erodeMask,
    erodeFringe: erodeFringe,
    medianMaskedLuma: medianMaskedLuma,
    ringMeanLuma: ringMeanLuma,
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
    // Second-generation photographs (2026-07-21): pure-white ground, black
    // Bemberg lining baked in, house-cut trousers. trousers-flat and
    // trousers-belt arrived on a tinted/shadowed ground and are white-
    // normalised copies (…-white.jpeg); every other source is the raw
    // generation. Double-breasted vests and the Gurkha trouser are real
    // products but have no photograph yet, so they are intentionally absent
    // here and hidden from the configurator until their image lands.
    var SOURCES = {
        // Bespoke Spec Configurator photos (2026-08-17, Nano Banana Pro).
        // "jacket-sb" was repointed at a fresh notch+flap generation —
        // the ORIGINAL replicate-prediction-z3qrb03... source stays on
        // disk untouched (git history intact per the comment above), it
        // is just no longer what this key builds from. The two
        // *-peak-* keys are new spec-driven variants picked up
        // automatically by resolveGarmentKey's self-healing lookup in
        // garment-photo.js the moment their key is added to
        // GARMENT_ASSET_KEYS below — see that function's own comment.
        //
        // jacket-db-peak-flap.png (also generated this session) is
        // deliberately NOT wired in here — house style doesn't do ticket
        // pockets, and that generation put one on the right hip (a
        // second, smaller flap stacked above the main hip flap). The
        // file is left on disk for reference; regenerate without a
        // ticket pocket before adding a "jacket-db" + flap-pocket entry.
        "jacket-sb": "jacket-sb-notch-flap-v2.png",
        "jacket-sb-peak-patch": "jacket-sb-peak-patch.png",
        "jacket-sb-peak-flap": "jacket-sb-peak-flap.png",
        "jacket-db": "replicate-prediction-fwrcgcn33xrmy0czgjavmrrfxg.jpeg",
        "vest-sb-none": "replicate-prediction-teg047kh8nrmr0czgjbtqq820w.jpeg",
        "vest-sb-shawl": "replicate-prediction-dxnwnqk7enrmt0czgjca61ysrw.jpeg",
        "trousers-flat": "replicate-prediction-4f5k730hsdrmy0czgjxs50wad0-white.jpeg",
        "trousers-double": "replicate-prediction-y3t5wmjtdsrmr0czgk09dhpbq4.jpeg",
        "trousers-belt": "replicate-prediction-e4sjndde3nrmy0czgk2vc6ncqm-white.jpeg"
        // The build MUST skip any key whose source file is absent and report
        // it by name rather than failing.
    };

    // Final asset. Renders at most ~600 CSS px in app, but the Cloth Room
    // canvases are devicePixelRatio-scaled (2x on an iPad) and the loupe
    // magnifies further, so 1600 is the sharpness ceiling worth shipping.
    // Sources are 1856x2304 / 1696x2528, so this never upscales.
    // No file-size budget here by founder decision: the kiosk precaches once
    // over shop wifi and then runs offline.
    var MAX_EDGE = 1600;

    // Mask, erode and normalise at 2x the final size, then let sharp downscale
    // the assembled RGBA to MAX_EDGE. Sharp anti-aliases the (binary) alpha as
    // it shrinks — with premultiplied edges, so no dark or light fringe — which
    // turns the hard 1-bit silhouette into smooth edges. EDGE_ERODE is applied
    // at supersample scale to cut just past the source's own soft edge fringe
    // before that downscale, so the smoothing comes from clean coverage.
    // SUPERSAMPLE asks for 2x but withoutEnlargement caps it at the source's
    // own size, so at MAX_EDGE 1600 the mask work happens at native
    // resolution (~1.5x final). EDGE_ERODE is in supersample pixels and is
    // scaled to match, staying ~2 final pixels of cut.
    var SUPERSAMPLE = MAX_EDGE * 2;
    var EDGE_ERODE = 3;

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
            .resize({ width: SUPERSAMPLE, height: SUPERSAMPLE, fit: "inside", withoutEnlargement: true })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then(function (result) {
                var data = result.data, info = result.info;
                var w = info.width, h = info.height;
                var px = new Uint8Array(data.buffer, data.byteOffset, data.length);

                var mask = extractMask(px, w, h);
                mask = erodeMask(mask, w, h, EDGE_ERODE);
                var fringe = erodeFringe(px, mask, w, h);
                mask = fringe.mask;
                if (fringe.passes) console.log("  " + key + ": cut " + fringe.passes + " extra pass(es) of bright fringe");
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
                    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
                    .webp({ quality: QUALITY })
                    .toFile(outPath)
                    .then(function (fileInfo) {
                        console.log(
                            "WROTE " + key + ".webp  " + fileInfo.width + "x" + fileInfo.height + "  " +
                            (fileInfo.size / 1024).toFixed(1) + " KB"
                        );
                        return fileInfo.size;
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
