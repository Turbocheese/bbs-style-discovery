var assert = require("assert");
var b = require("./build-garment-assets.js");

// 5x5 image: white ground, a 3x3 dark square inset by 1, and one
// mid-grey pixel at (0,4) standing in for a cast shadow on the ground.
function fixture() {
    var w = 5, h = 5, px = new Uint8Array(w * h * 4);
    for (var i = 0; i < w * h; i++) {
        px[i * 4] = 250; px[i * 4 + 1] = 250; px[i * 4 + 2] = 250; px[i * 4 + 3] = 255;
    }
    function set(x, y, v) {
        var o = (y * w + x) * 4;
        px[o] = v; px[o + 1] = v; px[o + 2] = v;
    }
    for (var y = 1; y <= 3; y++) for (var x = 1; x <= 3; x++) set(x, y, 120);
    set(0, 4, 225); // cast shadow, touching the frame edge
    return { px: px, w: w, h: h };
}

var f = fixture();
var mask = b.extractMask(f.px, f.w, f.h);

assert.strictEqual(mask[1 * 5 + 1], 255, "garment interior should be masked in");
assert.strictEqual(mask[2 * 5 + 2], 255, "garment centre should be masked in");
assert.strictEqual(mask[0 * 5 + 0], 0, "white ground should be masked out");
assert.strictEqual(mask[4 * 5 + 0], 0, "cast shadow should be masked OUT, not read as garment");

console.log("PASS: extractMask");

// --- Enclosed background-coloured region -----------------------------
//
// 7x7 image: white ground, a closed dark ring (garment), and a single
// white pixel dead centre of that ring. The centre pixel is never
// touching the frame edge, so a correct edge flood fill can never reach
// it and it must stay masked IN as garment.
//
// A plain luminance threshold has no notion of connectivity: it would
// look at the centre pixel in isolation, see it's white/background-
// coloured, and return 0 for it. This case exists specifically to catch
// that failure mode, which the first fixture above cannot catch (its
// garment and shadow luma values are separable by threshold alone).
function ringFixture() {
    var w = 7, h = 7, px = new Uint8Array(w * h * 4);
    for (var i = 0; i < w * h; i++) {
        px[i * 4] = 250; px[i * 4 + 1] = 250; px[i * 4 + 2] = 250; px[i * 4 + 3] = 255;
    }
    function set(x, y, v) {
        var o = (y * w + x) * 4;
        px[o] = v; px[o + 1] = v; px[o + 2] = v;
    }
    // Closed loop: the perimeter of the square from (1,1) to (5,5).
    for (var x = 1; x <= 5; x++) { set(x, 1, 120); set(x, 5, 120); }
    for (var y = 1; y <= 5; y++) { set(1, y, 120); set(5, y, 120); }
    // Interior of the ring, including the centre, stays white/background-
    // coloured — but it is fully enclosed and unreachable from the edge.
    return { px: px, w: w, h: h };
}

var rf = ringFixture();
var ringMask = b.extractMask(rf.px, rf.w, rf.h);

assert.strictEqual(
    ringMask[3 * 7 + 3],
    255,
    "background-coloured region enclosed by garment must stay masked IN " +
    "(a luminance threshold would wrongly return 0 here)"
);

console.log("PASS: extractMask (enclosed background-coloured region)");

// --- Documented limitation: light garment on the silhouette edge -----
//
// sweepShadow cannot distinguish a cast shadow from a genuinely light
// part of the garment. A silhouette-edge pixel at luma >= SHADOW_MIN_LUMA
// (200) that is reachable from the background gets erased along with the
// shadow. This test does not assert desired behaviour — it pins down the
// actual, currently-accepted trade-off so a future change to the sweep is
// visible in a failing test rather than silently shipping.
function lightEdgeFixture() {
    var w = 5, h = 5, px = new Uint8Array(w * h * 4);
    for (var i = 0; i < w * h; i++) {
        px[i * 4] = 250; px[i * 4 + 1] = 250; px[i * 4 + 2] = 250; px[i * 4 + 3] = 255;
    }
    function set(x, y, v) {
        var o = (y * w + x) * 4;
        px[o] = v; px[o + 1] = v; px[o + 2] = v;
    }
    for (var y = 1; y <= 3; y++) for (var x = 1; x <= 3; x++) set(x, y, 120);
    set(2, 1, 210); // light trim on the top edge of the garment, luma 210 >= 200
    return { px: px, w: w, h: h };
}

var lf = lightEdgeFixture();
var lightMask = b.extractMask(lf.px, lf.w, lf.h);

assert.strictEqual(
    lightMask[1 * 5 + 2],
    0,
    "documents current behaviour: a light (luma 210) silhouette-edge pixel " +
    "IS erased by sweepShadow, not preserved as garment"
);

console.log("PASS: sweepShadow documented limitation (light silhouette edge erased)");

// 5x5, all garment. One pass of erosion should clear the border ring
// and leave only the 3x3 core.
var solid = new Uint8Array(25);
for (var i = 0; i < 25; i++) solid[i] = 255;
var eroded = b.erodeMask(solid, 5, 5, 1);

assert.strictEqual(eroded[2 * 5 + 2], 255, "centre survives erosion");
assert.strictEqual(eroded[0 * 5 + 2], 0, "top edge is eroded away");
assert.strictEqual(eroded[2 * 5 + 0], 0, "left edge is eroded away");
assert.strictEqual(eroded[1 * 5 + 1], 255, "inset ring survives one pass");

console.log("PASS: erodeMask");
