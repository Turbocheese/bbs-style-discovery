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

// Sleeve-only regions for the 5 garments added 23-24 Aug 2026, each
// measured directly off its own labelled grid (same technique as the
// header comment above, just done per-photo since none of these share
// jacket-sb's original framing). JACKET_SLEEVES above is NOT reused for
// any of them — that box was measured against the pre-23-Aug jacket-sb
// photo specifically, and reusing it against a differently-framed photo
// is exactly what caused the body/sleeve seam artifact on jacket-sb
// after its 23 Aug regeneration (see JACKET_SB_LAPELS's own comment on
// that photo changing). No lapel/collar bend on any of these yet — see
// that comment above about why a box-only (no clip) region doesn't work
// for a triangular shape; these need the same flat-colour-panel
// calibration technique the tailored lapels used, not a fresh eyeball
// guess.
var JACKET_SB_SLEEVES_V2 = [
    { x: 0.17, y: 0.18, w: 0.20, h: 0.62, angle: -0.06, strength: 0.74 },
    { x: 0.63, y: 0.18, w: 0.20, h: 0.62, angle: 0.06, strength: 0.74 }
];
var JACKET_SB_NOTCH_PATCH_SLEEVES = [
    { x: 0.17, y: 0.10, w: 0.20, h: 0.70, angle: -0.06, strength: 0.74 },
    { x: 0.63, y: 0.10, w: 0.20, h: 0.70, angle: 0.06, strength: 0.74 }
];
var JACKET_DB_PEAK_FLAP_SLEEVES = [
    { x: 0.17, y: 0.10, w: 0.21, h: 0.70, angle: -0.06, strength: 0.74 },
    { x: 0.62, y: 0.10, w: 0.21, h: 0.70, angle: 0.06, strength: 0.74 }
];
var JACKET_SAFARI_SLEEVES = [
    { x: 0.20, y: 0.09, w: 0.18, h: 0.72, angle: -0.06, strength: 0.74 },
    { x: 0.62, y: 0.09, w: 0.18, h: 0.72, angle: 0.06, strength: 0.74 }
];
var JACKET_CHORE_SLEEVES = [
    { x: 0.24, y: 0.11, w: 0.16, h: 0.70, angle: -0.06, strength: 0.74 },
    { x: 0.60, y: 0.11, w: 0.16, h: 0.70, angle: 0.06, strength: 0.74 }
];
// Same measurement pass, 24 Aug 2026, for the three casual jackets added
// after chore. A2 and Teba are raglan-sleeved (the seam itself runs
// diagonal from collar to underarm, not a set-in shoulder seam) — the
// box position accounts for that, but a box+feather region was never
// meant to trace the exact seam, only to bend the pattern roughly with
// the sleeve's own direction, same as every other JACKET_*_SLEEVES entry.
var JACKET_A2_SLEEVES = [
    { x: 0.17, y: 0.19, w: 0.20, h: 0.60, angle: -0.06, strength: 0.74 },
    { x: 0.63, y: 0.19, w: 0.20, h: 0.60, angle: 0.06, strength: 0.74 }
];
var JACKET_TRUCKER_SLEEVES = [
    { x: 0.18, y: 0.19, w: 0.20, h: 0.62, angle: -0.06, strength: 0.74 },
    { x: 0.62, y: 0.19, w: 0.20, h: 0.62, angle: 0.06, strength: 0.74 }
];
var JACKET_TEBA_SLEEVES = [
    { x: 0.17, y: 0.18, w: 0.20, h: 0.62, angle: -0.06, strength: 0.74 },
    { x: 0.62, y: 0.18, w: 0.20, h: 0.62, angle: 0.06, strength: 0.74 }
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

// Peak lapel (jacket-sb-peak-*): two prior passes at this trace both
// mis-shaped it — a blind grid-eyeball guess, then a pinstripe-kink
// analysis (August 2026) that fixed the worst of it but still
// misidentified WHICH point was the peak tip, assuming it sat flush
// with the shoulder silhouette when it actually sits well inboard of
// it. Fixed properly (August 2026) with a flat-colour panel edit: the
// left lapel recoloured solid red, the right solid blue, everything
// else pixel-unchanged (Qwen-Image-Edit-Plus, editing the actual
// jacket-sb-peak-flap.png rather than generating a fresh pose — this
// is the part the stripe method got wrong). That makes the seam an
// exact colour-vs-fabric pixel boundary instead of something inferred
// from where a printed line happens to bend, extracted by thresholding
// red/blue against the grey body per row and Douglas-Peucker-simplifying
// the resulting curve. The edit's own pose match to the real photo was
// verified before trusting it: fitting its garment silhouette against
// jacket-sb-peak-flap.png's gave a sub-half-pixel-percent residual
// (vs. ~3-5% for the old pinstripe reference, which was a different
// generation entirely), so these coordinates needed only that tiny
// fitted correction, not a real reconstruction. The result: the peak
// tip is NOT flush with the shoulder line on this cut — it's the sharp
// corner partway down where the colour boundary suddenly pulls ~0.06
// inboard of the true silhouette, at roughly (0.27, 0.15) on the left.
// Right lapel is independently measured here too, not mirrored.
// Angle nudged from 0.18 to 0.14 rad (August 2026): tracking the collar
// band's own stripe on the reference photo separately from the main
// lapel gave ~-6 degrees for the collar vs. the -10.3 degrees this
// region was using — a real difference, but a ~4-degree one, not a
// distinct seam. Splitting it (rather than adding a third clip zone
// for a 4-degree gap the feathering already absorbs) is the
// proportionate fix.
var JACKET_SB_PEAK_LAPELS = [
    {
        x: 0.27, y: 0.045, w: 0.245, h: 0.50, angle: -0.14, strength: 0.82,
        clip: [{ x: 0.4866, y: 0.5449 }, { x: 0.4952, y: 0.4982 }, { x: 0.3678, y: 0.3287 }, { x: 0.2673, y: 0.1567 }, { x: 0.2684, y: 0.1493 }, { x: 0.3073, y: 0.1469 }, { x: 0.3440, y: 0.1051 }, { x: 0.4131, y: 0.0559 }, { x: 0.4499, y: 0.0510 }]
    },
    {
        x: 0.49, y: 0.045, w: 0.245, h: 0.50, angle: 0.14, strength: 0.82,
        clip: [{ x: 0.7318, y: 0.1542 }, { x: 0.6929, y: 0.1493 }, { x: 0.6529, y: 0.1026 }, { x: 0.5946, y: 0.0609 }, { x: 0.5503, y: 0.0510 }, { x: 0.4866, y: 0.5449 }, { x: 0.5039, y: 0.5056 }, { x: 0.6518, y: 0.3041 }]
    }
];

// The peak tip itself is a real corner in the cut, not a smooth fold —
// tracking one stripe across it in the reference photo shows a local
// angle swing from about -22 degrees to +34 degrees in the space of
// about 15 pixels, sharper than the ~10-degree bend the main lapel
// region above uses across its whole span. A single shared rotation
// can't carry both — so this is a second, small region layered on top
// of the tip corner only (same pattern JACKET_SLEEVES already uses:
// more than one region per garment key, each with its own angle),
// giving just that corner a steeper turn while the rest of the lapel
// keeps the gentler, already-verified rotation underneath. Angle
// magnitude here is double the main lapel's rather than matching the
// raw measurement — that measurement's own window was noisy (a few
// pixels either side of an actual vertex) and the photo's chest
// panel isn't perfectly vertical to begin with (ghost-mannequin
// volume alone reads ~24 degrees off vertical lower down, nothing to
// do with the lapel), so it's a starting point tuned against the
// rendered result, not a value taken verbatim off the pixel count.
var JACKET_SB_PEAK_TIPS = [
    {
        x: 0.24, y: 0.09, w: 0.14, h: 0.14, angle: -0.36, strength: 0.78,
        clip: [{ x: 0.322, y: 0.128 }, { x: 0.3073, y: 0.1469 }, { x: 0.2684, y: 0.1493 }, { x: 0.2673, y: 0.1567 }, { x: 0.30, y: 0.20 }]
    },
    {
        x: 0.60, y: 0.07, w: 0.16, h: 0.16, angle: 0.36, strength: 0.78,
        clip: [{ x: 0.624, y: 0.082 }, { x: 0.6529, y: 0.1026 }, { x: 0.6929, y: 0.1493 }, { x: 0.7318, y: 0.1542 }, { x: 0.70, y: 0.20 }]
    }
];

// Peak lapel (jacket-db): traced the same way as JACKET_SB_LAPELS — a
// founder-drawn outline (green) on a real DB peak-lapel photo, flood-filled,
// ray-cast from the enclosed area's centroid into a boundary polygon,
// Douglas-Peucker simplified, then calibrated onto jacket-db.webp's own
// fractional grid using the peak tips and the crossover point as the shared
// landmarks (the two photos differ in pose, so this is a proportional
// calibration, not a pixel-identical one). The founder's reference also
// marked a small red-outlined corner at each collar notch, sitting at a
// visibly different stripe angle than the lapel body — that corner is the
// collar, cut as a separate piece in real tailoring, and is deliberately
// left out of the clip so it keeps the body's own alignment instead of
// inheriting the lapel's rotation.
// Both lapels share one traced shape split at the centre front (x=0.505);
// the boxes below overlap slightly past centre, but the clip keeps each to
// its own half.
var JACKET_DB_LAPELS = [
    {
        x: 0.13, y: 0.10, w: 0.40, h: 0.44, angle: -0.18, strength: 0.82,
        clip: [{ x: 0.2275, y: 0.2434 }, { x: 0.1921, y: 0.2205 }, { x: 0.1513, y: 0.1781 }, { x: 0.1566, y: 0.1757 }, { x: 0.2524, y: 0.1879 }, { x: 0.3428, y: 0.1455 }, { x: 0.505, y: 0.1469 }, { x: 0.505, y: 0.3403 }, { x: 0.4651, y: 0.3625 }, { x: 0.4403, y: 0.2858 }, { x: 0.4315, y: 0.2858 }, { x: 0.3729, y: 0.3429 }, { x: 0.279, y: 0.2866 }, { x: 0.263, y: 0.2646 }, { x: 0.2311, y: 0.2458 }]
    },
    {
        x: 0.47, y: 0.10, w: 0.40, h: 0.44, angle: 0.18, strength: 0.82,
        clip: [{ x: 0.505, y: 0.1469 }, { x: 0.5237, y: 0.1471 }, { x: 0.5804, y: 0.1855 }, { x: 0.5964, y: 0.1887 }, { x: 0.7099, y: 0.1781 }, { x: 0.6974, y: 0.2002 }, { x: 0.5503, y: 0.3152 }, { x: 0.505, y: 0.3403 }]
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

// The waistband is its own cut piece, sewn on so the pattern runs along
// its own length rather than continuing the legs' vertical run — a real
// waistband is on the cross grain from the leg, which is what "sewn
// perpendicular" means here. One region, rotated a full quarter turn
// (not scaled — this is a flat band, not a cylinder, so there's no
// foreshortening to fake), spanning past both the left and right edges
// for the same "run past the frame" reason TROUSER_LEGS runs past top
// and bottom: a region edge that lands inside the garment leaves the
// feather band visible as a seam. Confined to the waistband's own
// narrow vertical span (all three trousers share this envelope, per the
// comment above) so it composites over the legs only there, feathering
// into their vertical run at the seam below — the legs themselves are
// untouched outside that band, which is what keeps the rest of the body
// straight.
// y/h corrected 24 Aug 2026 (founder: the band was reading taller than
// the real waistband) — measured directly off a fine-scale grid against
// all three photos: the actual waistband seam sits at y≈0.05 (top edge)
// to y≈0.095-0.10 (where it meets the leg), consistent across
// trousers-flat/double/belt despite each photo's own slightly different
// framing. The previous 0.045-0.11 span ran a good 0.01-0.015 past that
// seam into the leg fabric, which is what made the band look oversized.
var TROUSER_WAISTBAND = [
    { x: -0.1, y: 0.05, w: 1.2, h: 0.05, angle: Math.PI / 2, strength: 1.0 }
];

// trousers-gurkha and trousers-double-sideAdjusters (24 Aug 2026) were
// missing from DISPLACEMENT_REGIONS entirely — a striped-cloth audit
// found they rendered with zero fabric bend: no leg curve, no waistband
// turn, a flat undistorted tile. These photos were edited from real BBS
// garment photos and padded into the canonical frame differently than
// trousers-flat/double/belt, so TROUSER_LEGS/TROUSER_WAISTBAND's own
// coordinates (measured against those three) don't line up here — the
// garment sits noticeably higher in frame (waistband top y≈0.085 vs
// ≈0.05). Measured fresh off each photo's own grid; both share almost
// identical framing so one set of coordinates covers both.
var GURKHA_STYLE_LEGS = [
    { x: 0.30, y: 0.02, w: 0.10, h: 1.00, angle: -0.03, strength: 0.80 },
    { x: 0.40, y: 0.02, w: 0.10, h: 1.00, angle: 0.03, strength: 0.80 },
    { x: 0.53, y: 0.02, w: 0.11, h: 1.00, angle: -0.03, strength: 0.80 },
    { x: 0.64, y: 0.02, w: 0.11, h: 1.00, angle: 0.03, strength: 0.80 }
];
var GURKHA_STYLE_WAISTBAND = [
    { x: -0.1, y: 0.085, w: 1.2, h: 0.05, angle: Math.PI / 2, strength: 1.0 }
];

var DISPLACEMENT_REGIONS = {
    // jacket-sb was regenerated 23 Aug 2026 (wider notch lapel) — JACKET_SB_LAPELS
    // was traced against the OLD photo and is retired here, not reused: its clip
    // polygon no longer lines up with this photo's actual lapel at all (collar top
    // alone moved from y≈0.045 to y≈0.18), so keeping it produced a visibly wrong
    // bend, not just a slightly-off one. Sleeves-only until a real retrace happens.
    "jacket-sb": JACKET_SB_SLEEVES_V2,
    "jacket-sb-peak-patch": JACKET_SB_PEAK_LAPELS.concat(JACKET_SB_PEAK_TIPS, JACKET_SLEEVES),
    "jacket-sb-peak-flap": JACKET_SB_PEAK_LAPELS.concat(JACKET_SB_PEAK_TIPS, JACKET_SLEEVES),
    "jacket-db": JACKET_DB_LAPELS.concat(JACKET_SLEEVES),
    // The four below are new (23-24 Aug 2026) and have never had a lapel/collar
    // trace — sleeves only, same reasoning as jacket-sb above.
    "jacket-sb-notch-patch": JACKET_SB_NOTCH_PATCH_SLEEVES,
    "jacket-db-peak-flap": JACKET_DB_PEAK_FLAP_SLEEVES,
    "jacket-safari": JACKET_SAFARI_SLEEVES,
    "jacket-chore": JACKET_CHORE_SLEEVES,
    "jacket-a2": JACKET_A2_SLEEVES,
    "jacket-trucker": JACKET_TRUCKER_SLEEVES,
    "jacket-teba": JACKET_TEBA_SLEEVES,

    // A vest front is a flat panel with no sleeve to curve. It used to get
    // two tall bands either side of the buttons, which broke a check down
    // the length of the garment for the same reason the lapel boxes did.
    "vest-sb-none": [],
    "vest-sb-shawl": [],

    "trousers-flat": TROUSER_LEGS.concat(TROUSER_WAISTBAND),
    "trousers-double": TROUSER_LEGS.concat(TROUSER_WAISTBAND),
    "trousers-belt": TROUSER_LEGS.concat(TROUSER_WAISTBAND),
    "trousers-gurkha": GURKHA_STYLE_LEGS.concat(GURKHA_STYLE_WAISTBAND),
    "trousers-double-sideAdjusters": GURKHA_STYLE_LEGS.concat(GURKHA_STYLE_WAISTBAND)
};
window.DISPLACEMENT_REGIONS = DISPLACEMENT_REGIONS;

// Feather width as a fraction of a region's smaller dimension. A hard
// rectangular clip (the original implementation) produces a visible
// straight-line seam where the pattern angle changes abruptly — real
// cloth has no such discontinuity except at an actual seam. Some
// softening avoids that, but on a fine pattern (pinstripe, chalkstripe)
// too wide a feather reads as the stripes losing definition before the
// bend itself — tightened from 0.20 to 0.15 (August 2026, still inside
// the brief's original 15-25% guidance, just at the crisp end) so the
// pattern stays sharp closer to the bend. Not tuned per-region since
// all four regions are comparable in scale.
var DISPLACEMENT_FEATHER_FRACTION = 0.15;

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

// ---- The Atelier Lighting Rig ----
// Optional colour-temperature / ambient-shadow overlays for the composited
// garment canvas, selected in the "Study the Cloth" panel (cloth-study.js)
// and passed in here by fabric-visualiser.js. Every fill is confined to the
// garment's own already-painted pixels via "source-atop" — the same
// technique cloth-study.js's drape uses for its top-light/bottom-shadow
// vignette (see its draw(), step 3) — rather than a rectangular clip or a
// getImageData/putImageData pass, so a rotated/displaced pattern under the
// lapel or sleeve regions gets lit too, without per-pixel cost. "daylight"
// (absent from this map) is the untouched baseline render.
var LIGHTING_RIGS = {
    warm: function (ctx, W, H) {
        // Warm Showroom Spotlight: an amber colour-temperature wash (reads
        // as a cool photograph lit warm) plus a soft centred brightening
        // that falls off toward the frame edges, like a single tungsten
        // spot overhead.
        var wash = ctx.createLinearGradient(0, 0, 0, H);
        wash.addColorStop(0, "rgba(255,214,158,0.18)");
        wash.addColorStop(1, "rgba(120,80,40,0.14)");
        ctx.fillStyle = wash;
        ctx.fillRect(0, 0, W, H);
        var spot = ctx.createRadialGradient(W * 0.5, H * 0.30, 0, W * 0.5, H * 0.30, Math.max(W, H) * 0.68);
        spot.addColorStop(0, "rgba(255,238,205,0.20)");
        spot.addColorStop(1, "rgba(255,238,205,0)");
        ctx.fillStyle = spot;
        ctx.fillRect(0, 0, W, H);
    },
    sunlight: function (ctx, W, H) {
        // Direct Sunlight: a hard directional highlight from the upper left
        // and a correspondingly deeper shadow toward the lower right — real
        // contrast rather than a flat brightness bump — with a faint
        // cool-white cast instead of warm.
        var hi = ctx.createLinearGradient(0, 0, W * 0.75, H * 0.55);
        hi.addColorStop(0, "rgba(255,255,250,0.32)");
        hi.addColorStop(0.45, "rgba(255,255,250,0.09)");
        hi.addColorStop(1, "rgba(255,255,250,0)");
        ctx.fillStyle = hi;
        ctx.fillRect(0, 0, W, H);
        var sh = ctx.createLinearGradient(W * 0.35, H * 0.4, W, H);
        sh.addColorStop(0, "rgba(22,24,30,0)");
        sh.addColorStop(1, "rgba(22,24,30,0.34)");
        ctx.fillStyle = sh;
        ctx.fillRect(0, 0, W, H);
    }
};

function applyLightingRig(ctx, canvas, mode) {
    var rig = LIGHTING_RIGS[mode];
    if (!rig) return;
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    rig(ctx, canvas.width, canvas.height);
    ctx.restore();
}

// ---- Real-photo pattern rendering (Phase 1, August 2026) ----
// The lapel/collar bend problem (see the long history in the comments
// above and in docs/2026-08-*-*.md) was ultimately solved by photographing
// the garment for real instead of procedurally displacing a flat tile —
// but only once per PATTERN TYPE, not once per cloth: the founder's own
// insight was to shoot every (weave, overlay) combination in one neutral
// grey, then recolour it per-cloth at runtime. Checked against the actual
// 117-cloth library, there are only 20 distinct combinations, against
// WEAVE_GROUNDS x WEAVE_OVERLAYS's larger nominal grid.
//
// PATTERN_PHOTO_KEYS[garmentKey][weave + "-" + pattern] = true marks a
// combination that has a real reference photo at
// images/garments/<garmentKey>__<weave>-<pattern>.webp. Absent/false means
// "no photo yet" — renderGarmentPhoto falls through to the existing
// tile-composite path below, so adding entries here is the only step
// needed to bring a pattern online once its asset lands (same self-healing
// convention resolveGarmentKey/GARMENT_ASSET_KEYS already use).
//
// CLOSED (August 2026), left empty on purpose. Five genuinely different
// classification approaches were tried and each failed for its own,
// verified reason — this is a real signal-processing ceiling for a fine
// pinstripe on a plain weave, not a bug worth chasing further:
//   1. Global threshold on the photo's own luminance -- bisects light-side-
//      of-a-fold from dark-side-of-a-fold, erasing the pattern (shading
//      spans a far wider range than the actual ground/overlay gap).
//   2. Local-contrast threshold on the photo -- fires on the photo's own
//      fabric-grain noise instead of the pattern (confirmed by directly
//      visualising the delta signal: pure blob noise, no periodic
//      structure at any radius tried).
//   3. Global threshold on the WebGL grey SEED the photo was generated
//      from instead (tools/build-garment-assets.js's classifyFromSeed) --
//      the seed is noise-free by construction, but a real 3D fold catches
//      the mesh's key light at a different angle than the flat chest,
//      swinging luma across a wide range there too; the lapel came out a
//      flat, misclassified band.
//   4/5. High-pass, then band-pass (high-pass + a second smoothing blur),
//      on the seed -- correctly removes the fold's shading field, but even
//      weave-engine's "plain" ground carries its own procedural grain at a
//      spatial frequency close to the actual stripe pitch. No blur radius
//      threads that needle: wide enough to suppress the grain also
//      suppresses the real stripe (confirmed directly -- a binary
//      majority-filter at radius 6-10 didn't clean up into stripes, it
//      collapsed into one flat colour per garment region, the pattern
//      erased along with the noise; radius 3 was still visibly noisy).
// Any future attempt at this needs either a much bolder/higher-contrast
// reference pattern (a new AI generation, not a code fix) or a
// fundamentally different technique (real image registration between
// seed and photo, or per-column period-matched extraction rather than a
// spatial blur) -- not another threshold/radius tweak on this same
// approach.
var PATTERN_PHOTO_KEYS = {
    "jacket-sb-peak-flap": {}
};
window.PATTERN_PHOTO_KEYS = PATTERN_PHOTO_KEYS;

function patternPhotoKey(cloth) {
    return cloth.weave + "-" + cloth.pattern;
}

function hasPatternPhoto(garmentKey, cloth) {
    var set = PATTERN_PHOTO_KEYS[garmentKey];
    return !!(set && set[patternPhotoKey(cloth)]);
}

// The reference photos are shot/rendered against two fixed neutral greys
// (see garment-mesh.js's pilot render seeding and the asset-generation
// brief) — ground #8a8a8a (138), overlay #d8d8d8 (216). Every other tone in
// the photo is real shading (fold, AO, highlight) riding on one of those
// two bands, not a third colour.
var PATTERN_GROUND_REF = 138;
var PATTERN_OVERLAY_REF = 216;

var patternPhotoSources = {}; // raw reference photos, keyed by "<garmentKey>__<weave>-<pattern>"
var patternPhotoRecoloured = {}; // recoloured results, keyed by "<garmentKey>::<clothKey>"

function loadPatternPhoto(garmentKey, patternKey, onReady) {
    var srcKey = garmentKey + "__" + patternKey;
    if (patternPhotoSources[srcKey]) { onReady(patternPhotoSources[srcKey]); return; }
    if ((garmentImageFailures[srcKey] || 0) >= GARMENT_LOAD_MAX_ATTEMPTS) return;
    var src = "images/garments/" + srcKey + ".webp";
    var img = new Image();
    img.onload = function () { patternPhotoSources[srcKey] = img; onReady(img); };
    img.onerror = function () {
        garmentImageFailures[srcKey] = (garmentImageFailures[srcKey] || 0) + 1;
        if (garmentImageFailures[srcKey] >= GARMENT_LOAD_MAX_ATTEMPTS) {
            console.error("garment-photo: giving up on pattern photo after " + garmentImageFailures[srcKey] + " failed attempts: " + src);
        }
    };
    img.src = src;
}

function hexToRgb(hex) {
    var n = parseInt(hex.replace("#", ""), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

// Recolours a neutral-grey reference photo into one cloth's actual ground/
// overlay colours. Each pixel's luminance says which of the two bands it
// belongs to (nearer PATTERN_GROUND_REF or PATTERN_OVERLAY_REF) and how far
// real shading has pushed it off that band's flat value; the output scales
// that band's target colour by the same ratio, so a fold or a highlight
// stays a fold or a highlight under any cloth, not just the grey it was
// shot in. This is a direct getImageData/putImageData map rather than a
// composite-operation blend (this file's header notes the same "photograph's
// luminance is the artwork" principle for the drape photos) because a
// single multiply pass can't route two independent target colours off one
// luminance channel — a duotone needs two reference points, not one.
// A photographed (or, for pilot testing, procedurally rendered) cloth
// carries THREE luminance signals at once: the coarse ground/overlay
// duotone this function wants, real shading (fold, AO, highlight), and
// fine weave-grain texture. An earlier version of this function classified
// off a heavily downsampled-then-upsampled (box-blur) copy of the image to
// separate the pattern from grain noise — necessary when it was tested
// directly against a raw, unprocessed WebGL pilot render, where ground and
// overlay were NOT yet cleanly separated. That's no longer the shape of
// the input: tools/build-garment-assets.js's classifyFromSeed already does
// the hard classification work once, at build time, using the noise-free
// WebGL seed rather than the noisy photo (see that function's own history
// for why) — the .webp this function loads has every pixel already pushed
// into one of two well-separated bands (118-158 or 196-236, a wide empty
// gap either side of PATTERN_GROUND_REF/PATTERN_OVERLAY_REF's midpoint).
// Re-blurring an already-classified, already-bimodal image before
// classifying again just smears real stripe edges across that gap and
// re-introduces the same speckle it was meant to fix — confirmed visually
// against the first real generation: removing the blur fixed a chest full
// of salt-and-pepper misclassification. Classify directly off the loaded
// image's own per-pixel luminance instead.
function recolourPatternPhoto(img, cloth) {
    var groundRgb = hexToRgb(cloth.ground);
    var overlayRgb = cloth.overlay ? hexToRgb(cloth.overlay.colour) : groundRgb;
    var mid = (PATTERN_GROUND_REF + PATTERN_OVERLAY_REF) / 2;

    var out = document.createElement("canvas");
    out.width = img.naturalWidth || img.width;
    out.height = img.naturalHeight || img.height;
    var octx = out.getContext("2d");
    octx.drawImage(img, 0, 0);
    var frame = octx.getImageData(0, 0, out.width, out.height);
    var px = frame.data;

    for (var i = 0; i < px.length; i += 4) {
        if (px[i + 3] === 0) continue;
        var lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
        var isOverlay = lum > mid;
        var ref = isOverlay ? PATTERN_OVERLAY_REF : PATTERN_GROUND_REF;
        var target = isOverlay ? overlayRgb : groundRgb;
        var ratio = lum / ref;
        px[i] = Math.max(0, Math.min(255, target.r * ratio));
        px[i + 1] = Math.max(0, Math.min(255, target.g * ratio));
        px[i + 2] = Math.max(0, Math.min(255, target.b * ratio));
    }

    octx.putImageData(frame, 0, 0);
    return out;
}

function getRecolouredPatternPhoto(garmentKey, cloth) {
    var cacheKey = garmentKey + "::" + cloth.key;
    var cached = patternPhotoRecoloured[cacheKey];
    if (cached) return cached;
    var srcKey = garmentKey + "__" + patternPhotoKey(cloth);
    var src = patternPhotoSources[srcKey];
    if (!src) return null;
    var result = recolourPatternPhoto(src, cloth);
    patternPhotoRecoloured[cacheKey] = result;
    return result;
}

// Loads (if needed) and draws the recoloured pattern photo, applying the
// same lighting rig as the tile-composite path so the two remain visually
// consistent under the "Study the Cloth" lighting options. Mirrors
// loadGarmentImage's retry-then-re-render pattern: a cache miss kicks off
// a load and returns false, and the caller (fabric-visualiser.js, already
// written for the existing async photo path) re-renders when it's ready.
function renderPatternPhoto(canvas, garmentKey, cloth, clothKey, lightingMode) {
    var patternKey = patternPhotoKey(cloth);
    var srcKey = garmentKey + "__" + patternKey;
    if (!patternPhotoSources[srcKey]) {
        loadPatternPhoto(garmentKey, patternKey, function () {
            renderGarmentPhoto(canvas, garmentKey, clothKey, lightingMode);
        });
        return false;
    }

    var ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("garment-photo: canvas already claimed by a WebGL context, cannot fall back to 2D on this element");
        return false;
    }
    var recoloured = getRecolouredPatternPhoto(garmentKey, cloth);
    if (!recoloured) return false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(recoloured, 0, 0, canvas.width, canvas.height);
    applyLightingRig(ctx, canvas, lightingMode);
    return true;
}

// Real-3D dispatch (garment-mesh.js, loaded after this file). Checked
// FIRST and before any canvas.getContext("2d") call below — a canvas's
// context type is fixed for its lifetime, so the mesh path must claim a
// "webgl" context before the 2D path ever claims "2d" on the same element.
// Every canvas is rebuilt fresh on each render() (fabric-visualiser.js's
// HTML-string templates), so which context type a given element ends up
// with is decided fresh each time, per garmentKey — not a conflict.
// GARMENT_MESH_KEYS/renderGarmentMesh3D are read here at CALL time, not
// parse time, so garment-mesh.js loading after this file is safe (same
// pattern as share-qr.js/client-profile.js's load-order exception).
function renderGarmentPhoto(canvas, garmentKey, clothKey, lightingMode) {
    if (typeof GARMENT_MESH_KEYS !== "undefined" && GARMENT_MESH_KEYS.indexOf(garmentKey) !== -1 &&
        typeof renderGarmentMesh3D === "function") {
        var meshOk = false;
        try { meshOk = renderGarmentMesh3D(canvas, garmentKey, clothKey, lightingMode); }
        catch (e) { console.error("garment-photo: 3D mesh render threw, falling back to photo path", e); meshOk = false; }
        if (meshOk) return true;
        // Any failure (WebGL unavailable, context loss, render error) falls
        // through to the photo-compositing path below rather than showing
        // a blank canvas — kiosk reliability over purity.
    }

    var cloth = findCloth(clothKey);
    if (!cloth) return false;

    // Real-photo pattern dispatch (Phase 1, August 2026) — checked before
    // the tile-composite path below. Empty/absent entries in
    // PATTERN_PHOTO_KEYS make this a no-op for every garment/pattern until
    // a real photo actually lands, so this is safe to ship ahead of the
    // assets themselves.
    if (hasPatternPhoto(garmentKey, cloth)) {
        return renderPatternPhoto(canvas, garmentKey, cloth, clothKey, lightingMode);
    }

    var img = garmentImages[garmentKey];
    if (!img) { loadGarmentImage(garmentKey, function () {
        renderGarmentPhoto(canvas, garmentKey, clothKey, lightingMode);
    }); return false; }

    var ctx = canvas.getContext("2d");
    if (!ctx) {
        // A canvas's context type is permanent once claimed — this only
        // happens if the mesh path above got as far as constructing a
        // WebGLRenderer (claiming "webgl" on this element) and then failed
        // on a later step. Nothing more can be drawn to this canvas
        // instance; the next render() rebuilds it fresh. Fail quietly
        // rather than throw on ctx.clearRect below.
        console.error("garment-photo: canvas already claimed by a WebGL context, cannot fall back to 2D on this element");
        return false;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Cloth, tiled across the whole frame. drawClothTile paints a
    //    96x96 tile into a context; we build that tile once per cloth
    //    and repeat it as a pattern.
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

    // 4. The Atelier Lighting Rig, applied last so it reads over the
    //    displaced/bent pattern too, not just the flat tile from step 1.
    applyLightingRig(ctx, canvas, lightingMode);

    return true;
}

window.renderGarmentPhoto = renderGarmentPhoto;

// The Cloth Room used to show a neutral "ghost" silhouette before a cloth was
// chosen (renderGarmentGhost). Both the single-cloth and ensemble views now
// start fully blank instead, so the ghost render was removed — no caller
// remains. Reintroduce a cloth-free preview here only if that changes.

// The photographs that exist and are selectable. Double-breasted vests
// (vest-db-none, vest-db-shawl) are a real make but have no photograph yet
// (paused by founder direction, 23 Aug 2026 — not a priority right now), so
// they stay absent here and hidden from the configurator until it lands.
//
// jacket-sb-peak-patch and jacket-sb-peak-flap are Bespoke Spec Configurator
// variants (2026-08-17) — resolveGarmentKey above picks either up
// automatically when the client's lapel/pocket spec matches, falling back
// to plain "jacket-sb" otherwise. jacket-sb-notch-patch and jacket-db-peak-
// flap (2026-08-23) join the same self-healing lookup the same way.
//
// jacket-sb was regenerated 2026-08-23 with a wider notch lapel (founder:
// the original read too narrow). The OLD JACKET_SB_LAPELS trace no longer
// applies — DISPLACEMENT_REGIONS drops it for this key entirely rather
// than keeping a stale trace (which produced a visible seam artifact
// between body and sleeve, since JACKET_SLEEVES was calibrated against the
// old photo's framing too; both replaced 24 Aug with regenerated boxes —
// see JACKET_SB_SLEEVES_V2 and the comment above it). No lapel bend on
// jacket-sb until a real retrace happens; sleeves are correct.
//
// trousers-gurkha and trousers-double-sideAdjusters (2026-08-23) were
// generated by editing real BBS garment photos rather than from scratch —
// trousers-flat-sideAdjusters (the flat-front sibling) hasn't been
// generated yet, add it here the same way once it lands.
//
// jacket-safari, jacket-chore, jacket-a2, jacket-trucker, jacket-teba
// (23-24 Aug 2026) are the five "casual jackets" — see fabric-visualiser.js's
// VIS_SINGLE_GARMENTS for the Cloth Room picker entries that resolve to
// them. None has a collar/lapel bend trace yet, same reasoning as jacket-sb
// above (a box-only region doesn't work for a triangular/curved collar
// shape — see the comment above JACKET_SLEEVES) — sleeves only.
var GARMENT_ASSET_KEYS = [
    "jacket-sb", "jacket-sb-peak-patch", "jacket-sb-peak-flap", "jacket-sb-notch-patch",
    "jacket-db", "jacket-db-peak-flap",
    "jacket-safari", "jacket-chore", "jacket-a2", "jacket-trucker", "jacket-teba",
    "vest-sb-none", "vest-sb-shawl",
    "trousers-flat", "trousers-double", "trousers-belt",
    "trousers-gurkha", "trousers-double-sideAdjusters"
];

// Every remaining STYLE option drives the photograph directly — there are
// no cosmetic-only options left in VIS_ENS_STYLE_OPTIONS after Task 8's
// reduction. The Bespoke Spec Configurator (August 2026) is a second,
// separate axis: order-form detail (lapel width, pocket style, waistband)
// that intentionally does NOT drive the photo today, because no
// photograph exists for those variants — see fabric-visualiser.js's
// BESPOKE_SPEC_OPTIONS header comment for why that's a deliberate,
// temporary limitation rather than an oversight.
//
// `spec` is optional so every existing caller (which only ever passed
// `style`) keeps working unchanged. When present, this checks for a
// spec-driven variant photo FIRST, falling back to the plain style-only
// key when that variant doesn't exist yet — the same self-healing
// pattern GARMENT_ASSET_KEYS already uses everywhere else in this file.
// A future photo shoot only has to land the asset and add its key to
// GARMENT_ASSET_KEYS below; nothing else here needs to change.
function resolveGarmentKey(garment, style, spec) {
    var base = null;
    if (garment === "jacket") base = "jacket-" + style.closure;
    else if (garment === "vest") base = "vest-" + style.closure + "-" + style.lapel;
    else if (garment === "trousers") base = "trousers-" + style.style;
    if (!base) return null;

    if (spec) {
        var variant = null;
        // Both jacket spec axes are entirely new (no existing photo
        // varies with either), so a full combination is the natural
        // asset name: jacket-sb-peak-patch, jacket-db-notch-flap, etc.
        if (garment === "jacket" && spec.lapelStyle && spec.pockets) {
            variant = base + "-" + spec.lapelStyle + "-" + spec.pockets;
        // Trouser PLEAT is already expressed by `style.style` (flat/
        // double/belt each have their own stock photo); only WAISTBAND
        // is a new axis, so only it extends the key — trying to also
        // fold spec.pleat in here would just contradict style.style's
        // own pleat choice.
        } else if (garment === "trousers" && spec.waistband) {
            variant = base + "-" + spec.waistband;
        }
        if (variant && GARMENT_ASSET_KEYS.indexOf(variant) !== -1) return variant;
    }
    return base;
}

window.resolveGarmentKey = resolveGarmentKey;
window.GARMENT_ASSET_KEYS = GARMENT_ASSET_KEYS;
