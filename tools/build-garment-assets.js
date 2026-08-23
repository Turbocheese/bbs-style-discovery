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

// ---- Two-tone variant (real-photo pattern rendering, Phase 1, August 2026) ----
//
// The variant above stretches whichever luma range a photo actually
// contains to fill [LUMA_FLOOR, LUMA_CEIL] -- right for a single-colour
// cloth, where only the SHAPE of shading matters and every photo can land
// wherever its own contrast happens to put it. A pattern-photo source (shot
// in two flat neutral greys -- ground #8a8a8a, overlay #d8d8d8, per
// garment-mesh.js's pilot-render seeding) needs the OPPOSITE guarantee:
// garment-photo.js's recolourPatternPhoto reads a FIXED midpoint (177) to
// decide ground vs overlay per pixel, so every processed pattern photo must
// land its two bands at the SAME absolute levels regardless of that
// particular photo's own exposure -- a per-photo relative stretch would let
// the split drift from photo to photo and break the classifier.
//
// PATTERN_GROUND_BAND / PATTERN_OVERLAY_BAND must stay numerically centred
// on garment-photo.js's PATTERN_GROUND_REF (138) / PATTERN_OVERLAY_REF
// (216) -- kept in sync by hand, since this Node CLI tool has no access to
// that browser file's globals at build time.
var PATTERN_GROUND_BAND = [118, 158];
var PATTERN_OVERLAY_BAND = [196, 236];

function clipPercentiles(hist, total, lowFrac, highFrac) {
    var lowTarget = total * lowFrac;
    var highTarget = total * highFrac;
    var seen = 0, min = 255, max = 0, v;
    for (v = 0; v < 256; v++) {
        if (!hist[v]) continue;
        var before = seen;
        seen += hist[v];
        if (before <= lowTarget && min === 255 && seen > lowTarget) min = v;
        if (before < highTarget && seen >= highTarget) { max = v; break; }
    }
    if (min === 255 && max === 0) { min = 0; max = 255; }
    if (max <= min) max = min + 1;
    return { min: min, max: max };
}

// The classic bimodal threshold: the split point that maximises the
// variance BETWEEN the two classes it creates. Ground and overlay pixels
// come from two distinct flat reference greys with shading riding on each
// -- exactly the bimodal shape Otsu's method is built to split -- so no
// pattern geometry (pitch, stripe vs check shape) needs to be known here.
function otsuThreshold(hist, total) {
    var sum = 0, v;
    for (v = 0; v < 256; v++) sum += v * hist[v];
    var sumB = 0, wB = 0, wF, mB, mF, varBetween, best = 0, bestVar = -1;
    for (v = 0; v < 256; v++) {
        wB += hist[v];
        if (wB === 0) continue;
        wF = total - wB;
        if (wF === 0) break;
        sumB += v * hist[v];
        mB = sumB / wB;
        mF = (sum - sumB) / wF;
        varBetween = wB * wF * (mB - mF) * (mB - mF);
        if (varBetween > bestVar) { bestVar = varBetween; best = v; }
    }
    return best;
}

// A real photograph's shading (a lapel fold, a chest highlight) swings luma
// across a far wider range than the actual ground/overlay reflectance gap,
// AND the pattern itself is deliberately subtle ("understated," per this
// app's own generation prompts) -- measured on the first real generation:
// shading spans luma 60-240 while the pinstripe is only a ~4-8 unit ripple
// on top of it, weaker than the photo's own ~±15-20 unit fabric-grain
// noise. No amount of thresholding on the PHOTO's own luminance survives
// that: a global split (Otsu) just bisects bright-side-of-a-fold from
// dark-side-of-a-fold and erases the pattern; a local-contrast test (an
// earlier version of this function, comparing each pixel to a blurred
// neighbourhood average) fires on grain noise instead, since the grain and
// the pattern sit in the same amplitude range -- confirmed by directly
// visualising that delta signal: blob noise, no periodic structure, at
// every blur radius tried.
//
// The fix is to not classify from the photo at all. The WebGL grey seed
// this photo was generated FROM (garment-mesh.js, images/styleBuilder/
// pattern-seeds/) has a mathematically exact, noise-free split by
// construction -- literally two flat reference greys with only real
// per-column shading on top, nothing else. Since the AI edit was
// instructed to preserve pose/crop/proportions exactly (and that held:
// aspect ratio matched to within 0.06% on the first real generation), the
// seed classifies which pixel is ground vs overlay far more reliably than
// the photo ever could, and that classification carries over pixel-for-
// pixel once the seed is resized to the photo's own dimensions. The
// PHOTO's own luminance still drives the OUTPUT value within whichever
// band the seed assigned it to -- real shading and grain survive as
// brightness variation on the correct colour, they just no longer get to
// vote on WHICH colour.
// A first version of this function classified by a fixed midpoint (the
// exact reference greys garment-mesh.js seeds a pilot render with -- ground
// #8a8a8a = 138, overlay #d8d8d8 = 216 -- so midpoint 177). That works on
// the flat chest, where the seed's own lighting is nearly even, but fails
// exactly at the lapel: a real fold is a physical 3D surface catching the
// mesh's key light at a different angle than the flat chest, which swings
// its luma across a wide range regardless of ground/overlay -- verified
// directly: a vertical scan through the lapel showed real per-region
// shading (raw values 97-225) that a fixed midpoint reads as "mostly
// overlay" there, misclassifying real ground pixels caught in a bright
// fold.
//
// A second version subtracted a coarse blur of the seed from the seed
// itself (a high-pass: the coarse blur approximates the fold's smooth
// lighting gradient, the difference is the pattern signal with that
// gradient subtracted out) and thresholded the raw difference at zero.
// That fixed the lapel but broke the chest: even weave-engine's "plain"
// ground carries its own subtle procedural grain, finer-grained than the
// actual stripe pitch, and it rode straight through a bare high-pass --
// measured directly, classification flipped every ~2px (504 transitions
// across one chest row) instead of the ~2-per-stripe-period a clean
// pattern gives (~110 expected for a ~20px pitch over that row).
//
// This function is a BAND-PASS, not just a high-pass: buildOne first
// removes the shading field (coarse blur, same idea as before) THEN
// smooths that residual with a second, smaller blur before thresholding --
// removing the fine grain noise while preserving the pattern's own,
// coarser period. Measured after adding that second pass: 118 transitions
// on the same chest row (vs. ~110 expected) -- a clean match. `bandpassPx`
// arrives pre-computed by buildOne (delta centred at grey level 128, then
// blurred) so this function itself stays a simple threshold, easy to keep
// pure/testable; all the actual image-processing lives in buildOne where
// sharp is available.
function classifyFromSeed(bandpassPx, mask, w, h) {
    var classification = new Uint8Array(w * h);
    for (var i = 0; i < w * h; i++) {
        if (!mask[i]) continue;
        classification[i] = luma(bandpassPx, i) > 128 ? 1 : 0;
    }
    return classification;
}

// Builds the band-pass input classifyFromSeed reads: (seed - coarse blur of
// seed), recentred on grey level 128 so it can be materialised as an
// ordinary image and blurred again by buildOne (sharp has no notion of a
// signed delta buffer, so 128 stands in for zero). Pure/testable on its
// own; buildOne runs the second, smaller blur afterward.
function buildSeedHighpass(seedPx, seedCoarseBlurPx, mask, w, h) {
    var out = new Uint8Array(w * h * 4);
    for (var i = 0; i < w * h; i++) {
        var v = 128;
        if (mask[i]) {
            var d = luma(seedPx, i) - luma(seedCoarseBlurPx, i);
            v = Math.max(0, Math.min(255, Math.round(d + 128)));
        }
        out[i * 4] = v; out[i * 4 + 1] = v; out[i * 4 + 2] = v; out[i * 4 + 3] = 255;
    }
    return out;
}

// Coarse blur: wide enough to erase the pattern and leave only the fold's
// lighting gradient. Fine blur: the second pass, wide enough to erase
// weave-engine's own grain noise without eroding the pattern's own,
// coarser period. Both measured against the first real pattern (pinstripe,
// pitch ~20px at this same resize resolution).
var SEED_SHADING_BLUR_SIGMA = 15;
var SEED_GRAIN_SMOOTH_SIGMA = 4;

function normaliseLuminanceTwoTone(px, mask, w, h, classification) {
    var out = new Uint8Array(w * h);
    var i, v;

    if (classification) {
        var groundHist = new Uint32Array(256), overlayHist = new Uint32Array(256);
        var groundTotal = 0, overlayTotal = 0;
        for (i = 0; i < w * h; i++) {
            if (!mask[i]) continue;
            v = luma(px, i);
            if (v < LINING_LUMA) continue;
            if (classification[i]) { overlayHist[v | 0]++; overlayTotal++; }
            else { groundHist[v | 0]++; groundTotal++; }
        }
        if (groundTotal === 0 && overlayTotal === 0) return out; // nothing masked in

        var groundRangeC = groundTotal > 0 ? clipPercentiles(groundHist, groundTotal, LUMA_CLIP_LOW, LUMA_CLIP_HIGH) : { min: 0, max: 255 };
        var overlayRangeC = overlayTotal > 0 ? clipPercentiles(overlayHist, overlayTotal, LUMA_CLIP_LOW, LUMA_CLIP_HIGH) : { min: 0, max: 255 };

        for (i = 0; i < w * h; i++) {
            if (!mask[i]) { out[i] = 0; continue; }
            v = luma(px, i);
            if (v < LINING_LUMA) {
                out[i] = Math.round((v / LINING_LUMA) * LINING_CEIL);
                continue;
            }
            var isOv = classification[i];
            var rangeC = isOv ? overlayRangeC : groundRangeC;
            var bandC = isOv ? PATTERN_OVERLAY_BAND : PATTERN_GROUND_BAND;
            var tC = (v - rangeC.min) / (rangeC.max - rangeC.min);
            if (tC < 0) tC = 0; else if (tC > 1) tC = 1;
            out[i] = Math.round(bandC[0] + tC * (bandC[1] - bandC[0]));
        }
        return out;
    }

    // Fallback: a single global Otsu split. Only correct for a source with
    // no per-region shading field of its own -- the pure-function test
    // fixtures below are clean and bimodal by construction, which is why
    // this path stays covered by tests even though real photo processing
    // always supplies a seed-derived classification instead (see buildOne).
    var hist = new Uint32Array(256);
    var total = 0;
    for (i = 0; i < w * h; i++) {
        if (!mask[i]) continue;
        v = luma(px, i);
        if (v < LINING_LUMA) continue;
        hist[v | 0]++;
        total++;
    }
    if (total === 0) return out;

    var split = otsuThreshold(hist, total);

    var groundHist2 = new Uint32Array(256), overlayHist2 = new Uint32Array(256);
    var groundTotal2 = 0, overlayTotal2 = 0;
    for (v = 0; v < 256; v++) {
        if (!hist[v]) continue;
        if (v <= split) { groundHist2[v] = hist[v]; groundTotal2 += hist[v]; }
        else { overlayHist2[v] = hist[v]; overlayTotal2 += hist[v]; }
    }

    var groundRange = groundTotal2 > 0 ? clipPercentiles(groundHist2, groundTotal2, LUMA_CLIP_LOW, LUMA_CLIP_HIGH) : { min: 0, max: split };
    var overlayRange = overlayTotal2 > 0 ? clipPercentiles(overlayHist2, overlayTotal2, LUMA_CLIP_LOW, LUMA_CLIP_HIGH) : { min: split + 1, max: 255 };

    for (i = 0; i < w * h; i++) {
        if (!mask[i]) { out[i] = 0; continue; }
        v = luma(px, i);
        if (v < LINING_LUMA) {
            out[i] = Math.round((v / LINING_LUMA) * LINING_CEIL);
            continue;
        }
        var isOverlay = v > split;
        var range = isOverlay ? overlayRange : groundRange;
        var band = isOverlay ? PATTERN_OVERLAY_BAND : PATTERN_GROUND_BAND;
        var t = (v - range.min) / (range.max - range.min);
        if (t < 0) t = 0; else if (t > 1) t = 1;
        out[i] = Math.round(band[0] + t * (band[1] - band[0]));
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
    normaliseLuminanceTwoTone: normaliseLuminanceTwoTone,
    classifyFromSeed: classifyFromSeed,
    buildSeedHighpass: buildSeedHighpass,
    otsuThreshold: otsuThreshold,
    LUMA_FLOOR: LUMA_FLOOR,
    LUMA_CEIL: LUMA_CEIL,
    PATTERN_GROUND_BAND: PATTERN_GROUND_BAND,
    PATTERN_OVERLAY_BAND: PATTERN_OVERLAY_BAND
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
    // generation. Double-breasted vests have no photograph yet (paused by
    // founder direction, 23 Aug 2026 — not a priority right now), so they
    // stay intentionally absent here and hidden from the configurator.
    var SOURCES = {
        // Bespoke Spec Configurator photos (2026-08-17, Nano Banana Pro).
        // "jacket-sb" was repointed AGAIN on 2026-08-23 to a widened-notch
        // regeneration (founder: the notch lapel read too narrow, wanted
        // at least 4in/10cm) — the prior "notch-flap-v2" source stays on
        // disk untouched, it is just no longer what this key builds from.
        // Retracing JACKET_SB_LAPELS in garment-photo.js against the new
        // outline is required follow-up (see that file).
        "jacket-sb": "replicate-prediction-mapxkr394drmr0d05wa9n2cnbw.png",
        "jacket-sb-peak-patch": "jacket-sb-peak-patch.png",
        "jacket-sb-peak-flap": "jacket-sb-peak-flap.png",
        // New 2026-08-23: same widened notch as "jacket-sb" above, patch
        // pockets instead of flap. Shares the same lapel shape/trace.
        "jacket-sb-notch-patch": "replicate-prediction-g6tmgy2vcxrmw0d05wdtqdee58.png",
        "jacket-db": "replicate-prediction-fwrcgcn33xrmy0czgjavmrrfxg.jpeg",
        // New 2026-08-23: retry of the DB peak+flap combo, this one
        // without the unrequested ticket pocket the first attempt had
        // (that rejected file, jacket-db-peak-flap.png, stays on disk for
        // reference/comparison only — not referenced by any key).
        "jacket-db-peak-flap": "replicate-prediction-3rqn9047m5rmt0d05wctyqk4yw.png",
        "vest-sb-none": "replicate-prediction-teg047kh8nrmr0czgjbtqq820w.jpeg",
        "vest-sb-shawl": "replicate-prediction-dxnwnqk7enrmt0czgjca61ysrw.jpeg",
        "trousers-flat": "replicate-prediction-4f5k730hsdrmy0czgjxs50wad0-white.jpeg",
        "trousers-double": "replicate-prediction-y3t5wmjtdsrmr0czgk09dhpbq4.jpeg",
        "trousers-belt": "replicate-prediction-e4sjndde3nrmy0czgk2vc6ncqm-white.jpeg",
        // New 2026-08-23: single Gurkha, edited from a real BBS garment
        // photo rather than generated from scratch (see the prompts doc).
        "trousers-gurkha": "replicate-prediction-5839x2k9y5rmt0d05wv9p278gc.png",
        // New 2026-08-23: double-pleat side-adjuster, also edited from a
        // real BBS photo. The flat-front sibling (trousers-flat-side
        // Adjusters) was not generated this round — add it the same way
        // once it lands.
        "trousers-double-sideAdjusters": "replicate-prediction-6a380h7qssrmr0d05wwss6jgag.png"
        // The build MUST skip any key whose source file is absent and report
        // it by name rather than failing.
    };

    // Real-photo pattern rendering (Phase 1, August 2026) -- object form
    // { file, twoTone: true, seed } instead of a bare filename, so buildOne
    // routes these through normaliseLuminanceTwoTone instead of the
    // single-tone normaliseLuminance above (see that function's header for
    // why the two can't share one code path). `seed` is the WebGL grey
    // render this photo was generated FROM (path relative to SRC_DIR,
    // typically under pattern-seeds/) -- required for twoTone, since the
    // seed is what makes ground/overlay classification reliable at all
    // (see normaliseLuminanceTwoTone's header for why classifying from the
    // photo itself doesn't work). Keys use the
    // "<garmentKey>__<weave>-<pattern>" convention garment-photo.js's
    // PATTERN_PHOTO_KEYS/loadPatternPhoto expect. Add the matching key to
    // PATTERN_PHOTO_KEYS in garment-photo.js to bring a pattern online once
    // its build here looks right.
    // CLOSED (August 2026) -- see garment-photo.js's PATTERN_PHOTO_KEYS
    // comment for the full history of why this pattern (fine pinstripe on
    // plain weave) can't be reliably classified with the tools tried so
    // far. Left empty; the seed-classification machinery below
    // (classifyFromSeed, buildSeedHighpass, normaliseLuminanceTwoTone)
    // stays in place for a future attempt with a bolder reference pattern
    // or a different technique, not deleted.
    var PATTERN_SOURCES = {
        // "jacket-sb-peak-flap__plain-pinstripe": {
        //     file: "jacket-sb-peak-flap__plain-pinstripe.png",
        //     twoTone: true,
        //     seed: "pattern-seeds/grey-plain-pinstripe.png"
        // }
    };
    for (var patternKey in PATTERN_SOURCES) {
        if (PATTERN_SOURCES.hasOwnProperty(patternKey)) SOURCES[patternKey] = PATTERN_SOURCES[patternKey];
    }

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

    // fabric-visualiser.js and the Ensemble builder size a garment's
    // <canvas> by TYPE, not by each image's own native dimensions
    // (1289x1600 jackets/vests, 1073x1600 trousers — see
    // getVisGarmentCanvasWidth), and renderGarmentPhoto stretch-fills via
    // drawImage(img, 0, 0, canvas.width, canvas.height). A source whose
    // own crop doesn't land on that exact WxH renders visibly distorted
    // (confirmed 2026-08-23: a 961x1600 source stretched into a 1289x1600
    // canvas read noticeably wider/squatter than every other jacket).
    // Every source up to 17 Aug happened to share that framing by luck
    // (same generation batch, same prompt discipline); newer ones don't.
    function canonicalDims(key) {
        if (key.indexOf("trousers-") === 0) return { w: 1073, h: 1600 };
        if (key.indexOf("jacket-") === 0 || key.indexOf("vest-") === 0) return { w: 1289, h: 1600 };
        return null;
    }

    function writeAsset(key, w, h, lum, mask) {
        var out = Buffer.alloc(w * h * 4);
        for (var i = 0; i < w * h; i++) {
            out[i * 4] = lum[i];
            out[i * 4 + 1] = lum[i];
            out[i * 4 + 2] = lum[i];
            out[i * 4 + 3] = mask[i];
        }

        var outPath = path.join(OUT_DIR, key + ".webp");
        var canon = canonicalDims(key);

        // w/h here are pre-MAX_EDGE (can be much larger than 1600 on the
        // long edge) — resize to the real shipped scale FIRST, so the
        // canonical-frame comparison below is apples to apples. Every
        // previous asset in this library happens to already land exactly
        // on 1289x1600/1073x1600 after this step (same source framing);
        // only a source with different aspect ratio needs padding next.
        return sharp(out, { raw: { width: w, height: h, channels: 4 } })
            .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then(function (resized) {
                var rw = resized.info.width, rh = resized.info.height;
                var pipeline;
                if (canon && (rw !== canon.w || rh !== canon.h)) {
                    if (rw > canon.w || rh > canon.h) {
                        console.log("  " + key + ": WARNING resized " + rw + "x" + rh + " exceeds canonical " + canon.w + "x" + canon.h + " — shipped unpadded, will still distort");
                        pipeline = sharp(resized.data, { raw: { width: rw, height: rh, channels: 4 } });
                    } else {
                        // Centre the garment inside the canonical frame with
                        // transparent padding — safe because everything
                        // outside the mask is already transparent; this just
                        // adds more of the same, at the correct in-frame
                        // scale instead of edge-to-edge.
                        var left = Math.round((canon.w - rw) / 2);
                        var top = Math.round((canon.h - rh) / 2);
                        console.log("  " + key + ": padded " + rw + "x" + rh + " into canonical " + canon.w + "x" + canon.h);
                        pipeline = sharp({
                            create: { width: canon.w, height: canon.h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
                        }).composite([{ input: resized.data, raw: { width: rw, height: rh, channels: 4 }, left: left, top: top }]);
                    }
                } else {
                    pipeline = sharp(resized.data, { raw: { width: rw, height: rh, channels: 4 } });
                }
                return pipeline.webp({ quality: QUALITY }).toFile(outPath);
            })
            .then(function (fileInfo) {
                console.log(
                    "WROTE " + key + ".webp  " + fileInfo.width + "x" + fileInfo.height + "  " +
                    (fileInfo.size / 1024).toFixed(1) + " KB"
                );
                return fileInfo.size;
            });
    }

    function buildOne(key, source) {
        var filename = (typeof source === "string") ? source : source.file;
        var twoTone = (typeof source === "object") && !!source.twoTone;
        var seedFilename = twoTone ? source.seed : null;
        var srcPath = path.join(SRC_DIR, filename);
        if (!fs.existsSync(srcPath)) {
            console.log("SKIP (no source): " + key + " -- " + filename);
            return Promise.resolve(null);
        }
        if (twoTone && !seedFilename) {
            console.log("SKIP (twoTone source needs a seed): " + key);
            return Promise.resolve(null);
        }
        var seedPath = twoTone ? path.join(SRC_DIR, seedFilename) : null;
        if (twoTone && !fs.existsSync(seedPath)) {
            console.log("SKIP (no seed): " + key + " -- " + seedFilename);
            return Promise.resolve(null);
        }

        var resizeOpts = { width: SUPERSAMPLE, height: SUPERSAMPLE, fit: "inside", withoutEnlargement: true };

        return sharp(srcPath).resize(resizeOpts).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
            .then(function (result) {
                var data = result.data, info = result.info;
                var w = info.width, h = info.height;
                var px = new Uint8Array(data.buffer, data.byteOffset, data.length);

                var mask = extractMask(px, w, h);
                mask = erodeMask(mask, w, h, EDGE_ERODE);
                var fringe = erodeFringe(px, mask, w, h);
                mask = fringe.mask;
                if (fringe.passes) console.log("  " + key + ": cut " + fringe.passes + " extra pass(es) of bright fringe");

                if (!twoTone) {
                    var lum = normaliseLuminance(px, mask, w, h);
                    return writeAsset(key, w, h, lum, mask);
                }

                // The seed was generated at its own canvas resolution, not
                // this photo's -- force it to this exact w x h ("fill", not
                // "inside") so every pixel lines up with the photo's own
                // buffer. The aspect ratios already agree to within 0.06%
                // (verified against the first real generation), so this is
                // a negligible stretch, not a real distortion.
                var seedSharp = sharp(seedPath).resize(w, h, { fit: "fill" });
                return Promise.all([
                    seedSharp.clone().ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
                    seedSharp.clone().blur(SEED_SHADING_BLUR_SIGMA).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
                ]).then(function (seedResults) {
                    var seedPx = new Uint8Array(seedResults[0].data.buffer, seedResults[0].data.byteOffset, seedResults[0].data.length);
                    var seedCoarseBlurPx = new Uint8Array(seedResults[1].data.buffer, seedResults[1].data.byteOffset, seedResults[1].data.length);
                    var highpass = buildSeedHighpass(seedPx, seedCoarseBlurPx, mask, w, h);
                    return sharp(highpass, { raw: { width: w, height: h, channels: 4 } })
                        .blur(SEED_GRAIN_SMOOTH_SIGMA)
                        .raw()
                        .toBuffer({ resolveWithObject: true })
                        .then(function (bandpassResult) {
                            var bandpassPx = new Uint8Array(bandpassResult.data.buffer, bandpassResult.data.byteOffset, bandpassResult.data.length);
                            var classification = classifyFromSeed(bandpassPx, mask, w, h);
                            var lumC = normaliseLuminanceTwoTone(px, mask, w, h, classification);
                            return writeAsset(key, w, h, lumC, mask);
                        });
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
