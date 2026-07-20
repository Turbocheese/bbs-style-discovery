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
