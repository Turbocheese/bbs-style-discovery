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

// Each region redraws the cloth rotated and horizontally compressed, which
// is what makes a stripe read as bending around form rather than lying on
// top of it. Coordinates are fractions of the canvas, read off a labelled
// grid rendered over each photograph — regenerate that grid before moving
// any of them rather than nudging numbers blind.
//
// Lapels used to get their own boxes (two stacked per side, stepping
// inboard down the roll edge) and they never worked: a lapel is a
// triangle and a region is a rectangle, so the box always tilted a wedge
// of flat chest alongside it. On a stripe that read as a faint kink; on a
// check the grid visibly broke and stepped at the box edge — what the
// founder circled. Removing the rotation entirely (sleeves-only) fixed
// the leak but lost the lapel's roll, which a real lapel does have (the
// founder's reference photos of an actual suit confirm a real, visible
// bend at the roll line, not zero — a first pass at ~4.6 degrees turned
// out visually indistinguishable from no rotation at all at normal
// viewing size, so the angle now matches the original's magnitude
// (~10 degrees). What's different from the original is that every lapel
// region now also carries a `clip`: a polygon (fractions of canvas, read
// off the same labelled grid as the box coordinates) tracing the lapel's
// actual roll-line triangle.
// applyClothDisplacement fills the polygon in addition to feathering the
// box, so no rotated pixel can land outside the true lapel shape — the
// box only sets the rotation's centre and the feather's extent.
var JACKET_SLEEVES = [
    { x: 0.05, y: 0.12, w: 0.22, h: 0.55, angle: -0.05, strength: 0.74 },
    { x: 0.73, y: 0.12, w: 0.22, h: 0.55, angle: 0.05, strength: 0.74 }
];

// Notch lapel (jacket-sb): the founder traced the true outline by hand
// (collar top -> notch -> roll line down to the button) over a render of
// this exact photo; these points are that trace, extracted by flood-filling
// the drawn outline and simplifying the resulting contour (Douglas-Peucker,
// same technique as MAP_COASTS in mill-map.js), not hand-estimated off a
// grid. The two halves share one seam down the centre (x 0.5051) so they
// meet without a gap.
var JACKET_SB_LAPELS = [
    {
        x: 0.27, y: 0.045, w: 0.245, h: 0.50, angle: -0.18, strength: 0.82,
        clip: [{ x: 0.5051, y: 0.5343 }, { x: 0.4931, y: 0.53 }, { x: 0.4746, y: 0.4873 }, { x: 0.4299, y: 0.4405 }, { x: 0.4014, y: 0.3875 }, { x: 0.32, y: 0.2799 }, { x: 0.2824, y: 0.2018 }, { x: 0.3278, y: 0.1773 }, { x: 0.302, y: 0.151 }, { x: 0.4052, y: 0.088 }, { x: 0.413, y: 0.0693 }, { x: 0.5051, y: 0.0611 }]
    },
    {
        x: 0.49, y: 0.045, w: 0.245, h: 0.50, angle: 0.18, strength: 0.82,
        clip: [{ x: 0.7045, y: 0.2535 }, { x: 0.5051, y: 0.5343 }, { x: 0.5051, y: 0.0611 }, { x: 0.5874, y: 0.0707 }, { x: 0.6151, y: 0.0994 }, { x: 0.707, y: 0.1515 }, { x: 0.6901, y: 0.1805 }, { x: 0.7265, y: 0.2021 }, { x: 0.7057, y: 0.2478 }]
    }
];

// Peak lapel (jacket-db): shoulder seam, peak tip, roll line down to the
// crossover — traced off jacket-db.webp's own fractional grid. The peak
// points further out than a notch, so the box is a little wider.
var JACKET_DB_LAPELS = [
    {
        x: 0.30, y: 0.09, w: 0.20, h: 0.46, angle: -0.18, strength: 0.82,
        clip: [{ x: 0.42, y: 0.115 }, { x: 0.335, y: 0.255 }, { x: 0.44, y: 0.52 }]
    },
    {
        x: 0.50, y: 0.09, w: 0.20, h: 0.46, angle: 0.18, strength: 0.82,
        clip: [{ x: 0.58, y: 0.115 }, { x: 0.665, y: 0.255 }, { x: 0.56, y: 0.52 }]
    }
];

// All three trousers share one envelope: waistband to y 0.11, legs to
// y 0.94, inseam at x 0.50, front creases near x 0.35 and x 0.63. Each leg
// gets a band either side of its crease, tilted away from it, so the cloth
// falls off the crease in both directions the way it does on the leg
// rather than simply running finer than the jacket's.
// They run past the top and bottom of the frame on purpose: a region edge
// that lands inside the garment leaves the feather band visible as a faint
// horizontal seam across the hem.
var TROUSER_LEGS = [
    { x: 0.25, y: 0.02, w: 0.12, h: 1.00, angle: -0.03, strength: 0.80 },
    { x: 0.37, y: 0.02, w: 0.12, h: 1.00, angle: 0.03, strength: 0.80 },
    { x: 0.51, y: 0.02, w: 0.12, h: 1.00, angle: -0.03, strength: 0.80 },
    { x: 0.63, y: 0.02, w: 0.12, h: 1.00, angle: 0.03, strength: 0.80 }
];

var DISPLACEMENT_REGIONS = {
    "jacket-sb": JACKET_SB_LAPELS.concat(JACKET_SLEEVES),
    "jacket-db": JACKET_DB_LAPELS.concat(JACKET_SLEEVES),

    // A vest front is a flat panel with no sleeve to curve. It used to get
    // two tall bands either side of the buttons, which broke a check down
    // the length of the garment for the same reason the lapel boxes did.
    "vest-sb-none": [],
    "vest-sb-shawl": [],

    "trousers-flat": TROUSER_LEGS,
    "trousers-double": TROUSER_LEGS,
    "trousers-belt": TROUSER_LEGS
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

// A region's rectangular feather mask softens the box's own edges, but a
// lapel isn't the box — it's the triangle traced by its `clip` points. This
// fills just that triangle (in the offscreen region's local coordinates),
// blurred by the same feather width so the roll line fades rather than
// cuts. Composited via "destination-in" alongside the feather mask, so a
// rotated pixel needs to pass BOTH: inside the box's soft edge AND inside
// the true lapel shape. That second test is what stops the rotation from
// ever landing on the flat chest next to the lapel, whatever the box says.
function buildPolygonMask(width, height, localPoints, blurPx) {
    var mask = document.createElement("canvas");
    mask.width = width;
    mask.height = height;
    var mctx = mask.getContext("2d");
    if (blurPx > 0) mctx.filter = "blur(" + blurPx + "px)";
    mctx.fillStyle = "#000";
    mctx.beginPath();
    for (var i = 0; i < localPoints.length; i++) {
        var p = localPoints[i];
        if (i === 0) mctx.moveTo(p.x, p.y); else mctx.lineTo(p.x, p.y);
    }
    mctx.closePath();
    mctx.fill();
    return mask;
}

var polygonMaskCache = {};

function getPolygonMask(width, height, localPoints, blurPx) {
    var key = width + "x" + height + "x" + blurPx + ":" + JSON.stringify(localPoints);
    var cached = polygonMaskCache[key];
    if (cached) return cached;
    var mask = buildPolygonMask(width, height, localPoints, blurPx);
    polygonMaskCache[key] = mask;
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

        // A lapel/collar region also carries a `clip`: the box only
        // decides the rotation's centre and reach, the polygon decides
        // what's actually allowed to show the rotated pattern.
        if (r.clip) {
            var localPoints = [];
            for (var p = 0; p < r.clip.length; p++) {
                localPoints.push({
                    x: r.clip[p].x * canvas.width - offX,
                    y: r.clip[p].y * canvas.height - offY
                });
            }
            var polyMask = getPolygonMask(offW, offH, localPoints, feather);
            octx.globalCompositeOperation = "destination-in";
            octx.drawImage(polyMask, 0, 0);
        }

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

// The 96px cloth tile was authored against a 644px-wide garment frame. The
// canvases now carry the asset's native pixel size (2x that) so the weave
// stays sharp on a retina iPad and in the loupe, so the tile is drawn at the
// same whole-number multiple — the weave keeps its scale relative to the
// garment, and the multiple stays whole because a fractional tile seams.
var TILE_REFERENCE_WIDTH = 644;

function clothTileScale(canvas) {
    return Math.max(1, Math.round(canvas.width / TILE_REFERENCE_WIDTH));
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
    var s = clothTileScale(canvas);
    tile.width = 96 * s; tile.height = 96 * s;
    var tctx = tile.getContext("2d");
    tctx.scale(s, s);
    drawClothTile(tctx, cloth);
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

// The Cloth Room used to show a neutral "ghost" silhouette before a cloth was
// chosen (renderGarmentGhost). Both the single-cloth and ensemble views now
// start fully blank instead, so the ghost render was removed — no caller
// remains. Reintroduce a cloth-free preview here only if that changes.

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
