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

module.exports = { extractMask: extractMask, luma: luma };
