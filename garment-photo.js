// Composites a cloth tile into a photographed garment.
//
// The photograph's LUMINANCE is the artwork, not the photograph. RGB
// carries normalised drape; alpha carries the garment mask. Both come
// from tools/build-garment-assets.js.
var garmentImages = {};

// Bounded-retry tracking for assets that fail to load (404, decode error,
// etc). Without this, a missing asset re-requests itself forever: every
// renderGarmentPhoto call that finds no cached image re-invokes
// loadGarmentImage, which builds a brand new Image() and re-fetches the
// same URL. 3 attempts allows for a transient in-store network blip
// without turning a genuinely broken asset into an unbounded request loop.
var GARMENT_LOAD_MAX_ATTEMPTS = 3;
var garmentImageFailures = {};

// cloth-data.js exposes CLOTH_LIBRARY as a flat array keyed by `key`.
function findCloth(key) {
    for (var i = 0; i < CLOTH_LIBRARY.length; i++) {
        if (CLOTH_LIBRARY[i].key === key) return CLOTH_LIBRARY[i];
    }
    return null;
}

function loadGarmentImage(key, onReady) {
    if (garmentImages[key]) { onReady(garmentImages[key]); return; }
    if ((garmentImageFailures[key] || 0) >= GARMENT_LOAD_MAX_ATTEMPTS) { return; }
    var src = "images/garments/" + key + ".webp";
    var img = new Image();
    img.onload = function () { garmentImages[key] = img; onReady(img); };
    img.onerror = function () {
        garmentImageFailures[key] = (garmentImageFailures[key] || 0) + 1;
        if (garmentImageFailures[key] >= GARMENT_LOAD_MAX_ATTEMPTS) {
            console.error("garment-photo: giving up on asset after " + garmentImageFailures[key] + " failed attempts: " + src);
        }
    };
    img.src = src;
}

// Flat-laid garments curve in four places only. Each region redraws the
// cloth rotated and horizontally compressed, which is what makes a
// stripe read as bending around form rather than lying on top of it.
var DISPLACEMENT_REGIONS = {
    "jacket-sb": [
        { x: 0.30, y: 0.08, w: 0.20, h: 0.34, angle: -0.14, strength: 0.82 },
        { x: 0.50, y: 0.08, w: 0.20, h: 0.34, angle: 0.14, strength: 0.82 },
        { x: 0.05, y: 0.12, w: 0.22, h: 0.55, angle: -0.05, strength: 0.74 },
        { x: 0.73, y: 0.12, w: 0.22, h: 0.55, angle: 0.05, strength: 0.74 }
    ]
    // Remaining garments follow once their photographs exist.
};
window.DISPLACEMENT_REGIONS = DISPLACEMENT_REGIONS;

// Feather width as a fraction of a region's smaller dimension. A hard
// rectangular clip (the original implementation) produces a visible
// straight-line seam where the pattern angle changes abruptly — real
// cloth has no such discontinuity except at an actual seam. 20% softens
// that into a gradual transition without eating so much of the region
// that the bend itself washes out to nothing. Picked from the brief's
// 15-25% guidance; not tuned per-region since all four regions are
// comparable in scale.
var DISPLACEMENT_FEATHER_FRACTION = 0.20;

// Builds an alpha mask the size of an offscreen region canvas: fully
// opaque across the interior, falling off linearly to transparent over
// `feather` px at every edge. Built as the product of an independent
// horizontal falloff and vertical falloff (two gradient fills combined
// with "destination-in") rather than a single radial gradient, so a
// wide-short region doesn't get clipped into an ellipse that eats into
// its flat top/bottom edges — each axis fades on its own terms and the
// corners simply fall off faster where both axes overlap.
function buildFeatherMask(width, height, feather) {
    var mask = document.createElement("canvas");
    mask.width = width;
    mask.height = height;
    var mctx = mask.getContext("2d");

    var xIn = feather / width;
    var xOut = (width - feather) / width;
    var gH = mctx.createLinearGradient(0, 0, width, 0);
    gH.addColorStop(0, "rgba(0,0,0,0)");
    gH.addColorStop(xIn, "rgba(0,0,0,1)");
    gH.addColorStop(xOut, "rgba(0,0,0,1)");
    gH.addColorStop(1, "rgba(0,0,0,0)");
    mctx.fillStyle = gH;
    mctx.fillRect(0, 0, width, height);

    var yIn = feather / height;
    var yOut = (height - feather) / height;
    var gV = mctx.createLinearGradient(0, 0, 0, height);
    gV.addColorStop(0, "rgba(0,0,0,0)");
    gV.addColorStop(yIn, "rgba(0,0,0,1)");
    gV.addColorStop(yOut, "rgba(0,0,0,1)");
    gV.addColorStop(1, "rgba(0,0,0,0)");
    mctx.globalCompositeOperation = "destination-in";
    mctx.fillStyle = gV;
    mctx.fillRect(0, 0, width, height);

    return mask;
}

// buildFeatherMask's output depends only on the offscreen region's
// dimensions and the feather width, not on the selected cloth. The Cloth
// Room re-renders on every one of 102 possible cloth swaps, and without
// this cache each render rebuilt all four jacket-sb masks from scratch
// (two gradient fills + a destination-in composite apiece) for a result
// that is byte-identical to the previous render. Cache by the same
// dimensions that determine the output; unbounded is fine here since the
// key space is bounded by the small, fixed set of displacement regions.
var featherMaskCache = {};

// Exposed purely so verification tooling can confirm the cache is doing
// its job (build count should stop growing after the first render of a
// given garment/canvas size). Not read anywhere in the render path.
var featherMaskCacheStats = { built: 0, hits: 0 };
window.featherMaskCacheStats = featherMaskCacheStats;

function getFeatherMask(width, height, feather) {
    var key = width + "x" + height + "x" + feather;
    var cached = featherMaskCache[key];
    if (cached) {
        featherMaskCacheStats.hits++;
        return cached;
    }
    featherMaskCacheStats.built++;
    var mask = buildFeatherMask(width, height, feather);
    featherMaskCache[key] = mask;
    return mask;
}

// Redraws the cloth pattern inside each of the garment's curvature
// regions with a rotation and a horizontal-only scale applied to the
// pattern's transform, so straight stripes/checks bend the way they
// would wrapping a lapel roll or a sleeve cylinder. Everywhere else is
// left as the flat tiled fill from step 1 — these garments are
// photographed laid flat, so curvature is the exception, not the rule.
//
// Each region is rendered into its own offscreen canvas (padded by the
// feather margin on every side) rather than clipped directly onto the
// main canvas. That lets a soft alpha mask (buildFeatherMask) be applied
// via "destination-in" before the region is composited back over the
// flat cloth, so the pattern angle blends smoothly into its surroundings
// instead of cutting at a rectangular edge.
function applyClothDisplacement(ctx, canvas, pattern, garmentKey) {
    var regions = DISPLACEMENT_REGIONS[garmentKey];
    if (!regions) return;

    for (var i = 0; i < regions.length; i++) {
        var r = regions[i];
        var rx = r.x * canvas.width;
        var ry = r.y * canvas.height;
        var rw = r.w * canvas.width;
        var rh = r.h * canvas.height;
        var cx = rx + rw / 2;
        var cy = ry + rh / 2;

        var feather = Math.min(rw, rh) * DISPLACEMENT_FEATHER_FRACTION;
        var offX = rx - feather;
        var offY = ry - feather;
        var offW = rw + feather * 2;
        var offH = rh + feather * 2;

        var off = document.createElement("canvas");
        off.width = offW;
        off.height = offH;
        var octx = off.getContext("2d");

        // Same rotate/scale-about-center transform as before, plus a
        // leading translate that re-anchors main-canvas coordinates onto
        // the offscreen canvas's own (0,0). Because that translate is
        // applied last (outermost) in the composed matrix, it shifts the
        // finished device pixels by (-offX, -offY) without disturbing the
        // rotation/scale math — the pattern phase lines up exactly as it
        // would have on the main canvas, so this is the same displaced
        // cloth, just drawn onto a smaller, offset, paddable surface.
        octx.save();
        octx.translate(-offX, -offY);
        octx.translate(cx, cy);
        octx.rotate(r.angle);
        octx.scale(r.strength, 1);
        octx.translate(-cx, -cy);

        // Rotating/scaling around the region's center means the padded
        // area maps to a larger area in pattern space; overdraw
        // generously so no corner is left unfilled.
        var pad = (rw + rh);
        octx.fillStyle = pattern;
        octx.fillRect(rx - pad, ry - pad, rw + pad * 2, rh + pad * 2);
        octx.restore();

        // Feather the offscreen region's edges, then composite it over
        // the flat cloth already on the main canvas. Partial alpha in
        // the feather band blends displaced and flat pixels; full alpha
        // in the interior reproduces the original hard-edged bend.
        var mask = getFeatherMask(offW, offH, feather);
        octx.globalCompositeOperation = "destination-in";
        octx.drawImage(mask, 0, 0);

        ctx.drawImage(off, offX, offY);
    }
}

// Buttons are part of the photograph now (the second-generation shots have
// real horn buttons), so they composite with the cloth like the rest of the
// garment — no separate drawn-button pass. The old overlay was authored for
// the first-gen grey mockups and no longer lines up with these photos.

// Linings are baked into the photographs (black Bemberg — the jacket neck
// opening, the vest back and inner front). Because the cloth is composited
// with a "multiply", a near-black lining stays near-black on every cloth,
// so it needs no separate runtime pass.

function renderGarmentPhoto(canvas, garmentKey, clothKey) {
    var img = garmentImages[garmentKey];
    if (!img) { loadGarmentImage(garmentKey, function () {
        renderGarmentPhoto(canvas, garmentKey, clothKey);
    }); return false; }

    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Cloth, tiled across the whole frame. drawClothTile paints a
    //    96x96 tile into a context; we build that tile once per cloth
    //    and repeat it as a pattern.
    var cloth = findCloth(clothKey);
    if (!cloth) return false;
    var tile = document.createElement("canvas");
    tile.width = 96; tile.height = 96;
    drawClothTile(tile.getContext("2d"), cloth);
    var pattern = ctx.createPattern(tile, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1b. Bend the pattern at the lapel roll and sleeve cylinders — see
    // applyClothDisplacement above for why only these regions move.
    applyClothDisplacement(ctx, canvas, pattern, garmentKey);

    // 2. Multiply the drape over it.
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 3. Clip to the garment. destination-in keeps only where the
    //    photograph's alpha is set, which is the eroded mask.
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "source-over";

    // Buttons and linings are both part of the photograph now and composite
    // with the cloth — no separate drawn passes.

    return true;
}

window.renderGarmentPhoto = renderGarmentPhoto;

// The photographs that exist and are selectable. Double-breasted vests
// (vest-db-none, vest-db-shawl) and the Gurkha trouser are real makes but
// have no photograph yet, so they are absent here and hidden from the
// configurator until their image lands — add the key the moment it does.
var GARMENT_ASSET_KEYS = [
    "jacket-sb", "jacket-db",
    "vest-sb-none", "vest-sb-shawl",
    "trousers-flat", "trousers-double", "trousers-belt"
];

// Every remaining option drives the photograph directly — there are no
// cosmetic-only options left after Task 8's reduction.
function resolveGarmentKey(garment, style) {
    if (garment === "jacket") return "jacket-" + style.closure;
    if (garment === "vest") return "vest-" + style.closure + "-" + style.lapel;
    if (garment === "trousers") return "trousers-" + style.style;
    return null;
}

window.resolveGarmentKey = resolveGarmentKey;
window.GARMENT_ASSET_KEYS = GARMENT_ASSET_KEYS;
