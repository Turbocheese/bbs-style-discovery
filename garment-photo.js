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

// Redraws the cloth pattern inside each of the garment's curvature
// regions with a rotation and a horizontal-only scale applied to the
// pattern's transform, so straight stripes/checks bend the way they
// would wrapping a lapel roll or a sleeve cylinder. Everywhere else is
// left as the flat tiled fill from step 1 — these garments are
// photographed laid flat, so curvature is the exception, not the rule.
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

        ctx.save();
        // Clip to the region's own bounding box so the transformed
        // redraw only replaces cloth inside that region — everywhere
        // else keeps the untouched flat fill from step 1.
        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh);
        ctx.clip();

        ctx.translate(cx, cy);
        ctx.rotate(r.angle);
        ctx.scale(r.strength, 1);
        ctx.translate(-cx, -cy);

        // Rotating/scaling around the region's center means the clip
        // rect maps to a larger area in pattern space; overdraw
        // generously so no corner of the clip is left unfilled.
        var pad = (rw + rh);
        ctx.fillStyle = pattern;
        ctx.fillRect(rx - pad, ry - pad, rw + pad * 2, rh + pad * 2);

        ctx.restore();
    }
}

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
    return true;
}

window.renderGarmentPhoto = renderGarmentPhoto;
