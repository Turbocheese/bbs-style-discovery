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

// --- Light garment pixel on the silhouette edge is preserved ---------
//
// With the shadow sweep removed (sources are shot on a pure-white ground
// with no cast shadow), a light garment pixel on the silhouette edge is
// no longer confused with a shadow. As long as it is not itself
// background-coloured (>= the flood threshold) it is not reachable by the
// edge flood, so it stays masked IN as garment. This replaces the old
// "documented limitation" test that pinned down sweepShadow erasing it.
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
    set(2, 1, 210); // light highlight on the top edge of the garment, luma 210
    return { px: px, w: w, h: h };
}

var lf = lightEdgeFixture();
var lightMask = b.extractMask(lf.px, lf.w, lf.h);

assert.strictEqual(
    lightMask[1 * 5 + 2],
    255,
    "a light (luma 210) silhouette-edge pixel connected to the garment is " +
    "preserved, not erased"
);

console.log("PASS: light silhouette edge preserved (no shadow sweep)");

// --- keepLargestComponent: detached shadow islands must not survive -----
//
// sweepShadow floods outward from cleared background through neighbours
// with luma >= SHADOW_MIN_LUMA. A soft cast shadow's luma dips toward the
// object, so if it drops below the threshold anywhere along the path from
// background to the true garment edge, the flood halts there — pixels
// beyond that point (further shadow, disconnected from both the cleared
// background AND the garment) are never reached and stay masked IN as if
// they were garment. This is a topology problem, not a threshold problem:
// a real garment is one connected object, so a same-mask blob that isn't
// connected to the main silhouette can only be shadow debris.
//
// 9x7 mask (no pixel data needed — this operates directly on a mask that
// already has two disconnected 255 regions): a 3x3 main "garment" block
// and a separate 1x2 "shadow" blob elsewhere, with zeroed pixels forming
// a gap between them so they share no 4-connected edge.
function twoIslandMask() {
    var w = 9, h = 7;
    var mask = new Uint8Array(w * h);
    function set(x, y) { mask[y * w + x] = 255; }

    // Main region: 3x3 block, 9 pixels.
    for (var y = 2; y <= 4; y++) for (var x = 1; x <= 3; x++) set(x, y);

    // Detached blob: 2 pixels, far from the main block on all sides
    // (4-connectivity) — not just diagonally adjacent.
    set(7, 0);
    set(8, 0);

    return { mask: mask, w: w, h: h };
}

var ti = twoIslandMask();
var kept = b.keepLargestComponent(ti.mask, ti.w, ti.h);

assert.strictEqual(kept[2 * ti.w + 2], 255, "main garment region survives");
assert.strictEqual(kept[3 * ti.w + 1], 255, "main garment region survives (edge pixel)");
assert.strictEqual(kept[0 * ti.w + 7], 0, "detached shadow blob is discarded");
assert.strictEqual(kept[0 * ti.w + 8], 0, "detached shadow blob is discarded (second pixel)");

console.log("PASS: keepLargestComponent (detached island discarded, main region kept)");

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

// --- Multi-pass erosion verification (production uses passes=2) -----------
//
// 7x7 all-garment fixture to verify that multi-pass erosion behaves correctly.
// Production code calls erodeMask with 2 passes, but the original test only
// covered 1 pass. This test proves that 2 passes erode strictly more than 1.
//
// After 1 pass on 7x7 all-255: outer ring (the frame) clears, leaving a 5x5
// core of 255s at positions (1,1) through (5,5).
//
// After 2 passes: the second pass erodes the 5x5 core by one more pixel on
// each side, leaving only a 3x3 core at positions (2,2) through (4,4).
var solid7x7 = new Uint8Array(49);
for (var i = 0; i < 49; i++) solid7x7[i] = 255;

var eroded1pass = b.erodeMask(solid7x7, 7, 7, 1);
var eroded2pass = b.erodeMask(solid7x7, 7, 7, 2);

assert.strictEqual(
    eroded1pass[1 * 7 + 1],
    255,
    "pixel (1,1) survives 1 pass (inset from border)"
);
assert.strictEqual(
    eroded2pass[1 * 7 + 1],
    0,
    "pixel (1,1) does NOT survive 2 passes (eroded away in second pass)"
);
assert.strictEqual(
    eroded2pass[3 * 7 + 3],
    255,
    "centre pixel (3,3) survives 2 passes (deep enough)"
);

// Count surviving (non-zero) pixels to prove 2 passes erodes more than 1.
var count1pass = 0, count2pass = 0;
for (var j = 0; j < 49; j++) {
    if (eroded1pass[j]) count1pass++;
    if (eroded2pass[j]) count2pass++;
}
assert(count2pass < count1pass,
    "2 passes erodes more pixels than 1 pass: " +
    count1pass + " pixels after 1 pass, " +
    count2pass + " pixels after 2 passes"
);

console.log("PASS: erodeMask (multi-pass, passes=2)");

// A garment spanning luma 100..180 should stretch to fill the band.
var w2 = 4, h2 = 1;
var px2 = new Uint8Array(w2 * h2 * 4);
var vals = [100, 140, 180, 250];
for (var k = 0; k < 4; k++) {
    px2[k * 4] = vals[k]; px2[k * 4 + 1] = vals[k]; px2[k * 4 + 2] = vals[k]; px2[k * 4 + 3] = 255;
}
var m2 = new Uint8Array([255, 255, 255, 0]); // last pixel is background

var norm = b.normaliseLuminance(px2, m2, w2, h2);

assert.strictEqual(norm[0], b.LUMA_FLOOR, "darkest garment pixel maps to the floor");
assert.strictEqual(norm[2], b.LUMA_CEIL, "lightest garment pixel maps to the ceiling");
assert.ok(norm[1] > b.LUMA_FLOOR && norm[1] < b.LUMA_CEIL, "mid pixel lands between");
assert.strictEqual(norm[3], 0, "background is zeroed and ignored by the range");

console.log("PASS: normaliseLuminance");
