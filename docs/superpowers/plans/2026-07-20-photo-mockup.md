# Photographic Garment Mockup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Cloth Room's hand-drawn garment silhouettes with photographic mockups, so selected cloth is poured into a real garment's observed drape rather than invented gradients.

**Architecture:** Twelve grey garment photographs are preprocessed offline into WebP assets carrying normalised luminance in RGB and the garment mask in alpha. At runtime the existing `weave-engine.js` cloth tile is drawn to a canvas, displaced at four curvature regions, multiplied by the luminance, clipped by the alpha, and finished with a small overlay PNG restoring buttons and hardware. Local style options (pockets, lapel shape, hem, waistband) are hand-authored overlays composited on top; only silhouette-changing options get their own photograph.

**Tech Stack:** Vanilla ES5, no framework or bundler. Canvas 2D. Node + Playwright for verification (`verify/audit.js`, `verify/smoke.js`). `pngjs` for offline asset preprocessing. WebP with alpha for shipped assets.

## Global Constraints

- **ES5 only.** No `let`, `const`, arrow functions, template literals, or `class`. Match surrounding style.
- **One delegated click handler.** All interaction goes through the single `click` listener on `document.body` dispatching `data-action`. Never add element-level listeners for clicks.
- **Cache triple-bump on every deploy touching a cached file:** `index.html` `?v=`, the matching `sw.js` precache entry, and `sw.js` `CACHE_VERSION`. Current: `styles.css?v=56`, `fabric-visualiser.js?v=8`, `weave-engine.js?v=1`, `cloth-data.js?v=1`, `app.js?v=63`, `CACHE_VERSION = "bbs-v42"`.
- **`.btn-bare` for any button that must not invert on hover.** A bare `button:hover` rule at specificity (0,1,1) outranks any single class even with `!important`. This has bitten five components.
- **Buttons stay horn-brown.** They are never tinted to the selected cloth.
- **CRLF line endings.** Regex over source must use `\r?\n`.
- **Verification reads pixels, not attributes.** Asserting an option is `aria-pressed` proves nothing about what rendered. This project has shipped five silently-dead features that passed intent-based checks.
- **Asset weight: quality first, no hard cap** (founder decision, 20 July). Do NOT compromise garment fidelity to hit a size target. But every build MUST print the total and it MUST be reported — the app is precached by `sw.js` and used in-store on iPad, so the founder needs the real number even though they have accepted the cost. Flag explicitly if the total exceeds 8 MB, which is where a cold in-store load becomes genuinely painful.
- **ES5 applies to shipped browser code only.** `tools/` runs under Node and is never shipped; modern syntax is fine there. `garment-photo.js` ships and is ES5.

## Real interfaces (verified against the codebase — do not invent these)

The plan's earlier drafts guessed at these and were wrong. Use exactly:

- **Cloth tiles:** `drawClothTile(ctx, cloth)` in `weave-engine.js:379`. Takes a canvas 2D **context** and a cloth **object** — not a key, and it returns nothing. To go from key to object, look it up in the `CLOTH_LIBRARY` array in `cloth-data.js` (102 entries, each with a `key` field).
- **Cloth keys are snake_case.** Real keys for use in tests:
  - plain charcoal flannel → `fox_classic_flannel_charcoal`
  - chalkstripe → `fox_flannel_chalkstripe`
  - navy → `fox_worsted_flannel_navy`
- **Never invent a cloth key.** A test that fails because the cloth does not exist looks identical to a test that fails because the feature is broken, and invites "fixing" the test.

---

## File Structure

**Create:**
- `tools/build-garment-assets.js` — offline preprocessor. Node. Not shipped.
- `garment-photo.js` — runtime compositor. Shipped, precached.
- `images/garments/*.webp` — 12 luminance+alpha assets.
- `images/garments/*-parts.webp` — 12 hole overlays (buttons, hardware, lining).
- `verify/photo-mockup.js` — pixel-level verification.

**Modify:**
- `fabric-visualiser.js` — swap SVG clip render for photo compositor.
- `index.html` — script tag + version.
- `sw.js` — precache entries + `CACHE_VERSION`.
- `styles.css` — canvas sizing.

---

## Task 1: Garment mask extraction

**Files:**
- Create: `tools/build-garment-assets.js`
- Create: `tools/test-build-garment-assets.js`

**Interfaces:**
- Produces: `extractMask(pixels, width, height)` → `Uint8Array` of length `width*height`, `255` = garment, `0` = background.

The mask MUST come from a flood fill inward from the frame edge, not a luminance threshold. All twelve photographs carry a soft cast shadow on the white ground; a threshold reads that shadow as garment and pulls a grey halo into the silhouette.

- [ ] **Step 1: Write the failing test**

Create `tools/test-build-garment-assets.js`:

```js
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node tools/test-build-garment-assets.js`
Expected: FAIL — `Cannot find module './build-garment-assets.js'`

- [ ] **Step 3: Implement the minimal code**

Create `tools/build-garment-assets.js`:

```js
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
```

- [ ] **Step 4: Run it to verify it passes**

Run: `node tools/test-build-garment-assets.js`
Expected: `PASS: extractMask`

- [ ] **Step 5: Commit**

```bash
git add tools/build-garment-assets.js tools/test-build-garment-assets.js
git commit -m "Extract garment masks by edge flood fill, not luminance threshold"
```

---

## Task 2: Mask erosion

**Files:**
- Modify: `tools/build-garment-assets.js`
- Modify: `tools/test-build-garment-assets.js`

**Interfaces:**
- Consumes: `extractMask` from Task 1.
- Produces: `erodeMask(mask, w, h, passes)` → `Uint8Array`.

Garment edges are soft against white. A hard 1-bit mask leaves a pale fringe of near-background pixels inside the silhouette, which reads as a halo once cloth is poured in. Erode by 2px.

- [ ] **Step 1: Write the failing test**

Append to `tools/test-build-garment-assets.js`:

```js
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node tools/test-build-garment-assets.js`
Expected: FAIL — `b.erodeMask is not a function`

- [ ] **Step 3: Implement**

Add to `tools/build-garment-assets.js` before `module.exports`:

```js
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
```

Add `erodeMask: erodeMask` to `module.exports`.

- [ ] **Step 4: Run it to verify it passes**

Run: `node tools/test-build-garment-assets.js`
Expected: `PASS: extractMask` then `PASS: erodeMask`

- [ ] **Step 5: Commit**

```bash
git add tools/build-garment-assets.js tools/test-build-garment-assets.js
git commit -m "Erode garment masks by 2px to kill the edge halo"
```

---

## Task 3: Luminance normalisation

**Files:**
- Modify: `tools/build-garment-assets.js`
- Modify: `tools/test-build-garment-assets.js`

**Interfaces:**
- Consumes: `extractMask`, `luma`.
- Produces: `normaliseLuminance(px, mask, w, h)` → `Uint8Array` of length `w*h`, garment pixels remapped to `[LUMA_FLOOR, LUMA_CEIL]`, background `0`.

The photograph's grey level is arbitrary. What matters is the *relative* light across the garment. Remap the garment's actual range onto a fixed band so every garment multiplies consistently, and so a dark fold never crushes the cloth to black.

- [ ] **Step 1: Write the failing test**

Append to `tools/test-build-garment-assets.js`:

```js
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node tools/test-build-garment-assets.js`
Expected: FAIL — `b.normaliseLuminance is not a function`

- [ ] **Step 3: Implement**

Add to `tools/build-garment-assets.js`:

```js
// The multiply band. The floor is above zero deliberately: a fold that
// multiplies to pure black destroys the cloth underneath it instead of
// shading it.
var LUMA_FLOOR = 90;
var LUMA_CEIL = 255;

function normaliseLuminance(px, mask, w, h) {
    var out = new Uint8Array(w * h);
    var min = 255, max = 0, i, v;

    for (i = 0; i < w * h; i++) {
        if (!mask[i]) continue;
        v = luma(px, i);
        if (v < min) min = v;
        if (v > max) max = v;
    }
    if (max <= min) max = min + 1;

    for (i = 0; i < w * h; i++) {
        if (!mask[i]) { out[i] = 0; continue; }
        v = (luma(px, i) - min) / (max - min);
        out[i] = Math.round(LUMA_FLOOR + v * (LUMA_CEIL - LUMA_FLOOR));
    }
    return out;
}
```

Add `normaliseLuminance`, `LUMA_FLOOR`, `LUMA_CEIL` to `module.exports`.

- [ ] **Step 4: Run it to verify it passes**

Run: `node tools/test-build-garment-assets.js`
Expected: three PASS lines

- [ ] **Step 5: Commit**

```bash
git add tools/build-garment-assets.js tools/test-build-garment-assets.js
git commit -m "Normalise garment luminance to a fixed multiply band"
```

---

## Task 4: Asset build CLI

**Files:**
- Modify: `tools/build-garment-assets.js`
- Create: `images/garments/` (output directory)

**Interfaces:**
- Consumes: everything from Tasks 1–3.
- Produces: `images/garments/<key>.webp` per garment. RGB = normalised luminance, alpha = eroded mask.

Keys, matching the spec's twelve: `jacket-sb`, `jacket-db`, `vest-sb-none`, `vest-sb-shawl`, `vest-db-none`, `vest-db-shawl`, `trousers-double-classic`, `trousers-double-tapered`, `trousers-single-classic`, `trousers-single-tapered`, `trousers-flat-classic`, `trousers-flat-tapered`.

- [ ] **Step 1: Add the manifest and CLI**

Add to `tools/build-garment-assets.js`:

```js
// Source photograph → output key. Filenames are the Replicate prediction
// IDs as delivered; renaming them in place would break the git history
// that records which prompt produced which image.
// All paths are relative to images/styleBuilder/. Each was visually
// identified against the prompt that produced it.
var SOURCES = {
    "jacket-sb": "replicate-prediction-n6bvdyx5p9rmr0czfph8bqrm1w.jpeg",
    "jacket-db": "replicate-prediction-sc2p8y639xrmt0czfphsvsajsg.jpeg",
    "vest-sb-none": "replicate-prediction-vac0q9x4w1rmy0czfpj92gvmn4.jpeg",
    "vest-sb-shawl": "replicate-prediction-013bpexxvxrmw0czfpts5d2n4m.jpeg",
    "vest-db-none": "replicate-prediction-552s4wn6chrmy0czfpv8051rsr.jpeg",
    "vest-db-shawl": "replicate-prediction-fw1webnjdnrmt0czfpvsnzrs2w.jpeg",
    "trousers-double-classic": "replicate-prediction-788cczn1bsrmr0czfpk9n2ecrc.jpeg",
    "trousers-flat-tapered": "replicate-prediction-wjzaqxyajxrmw0czfpm8k2xkj0.jpeg",
    "trousers-flat-classic": "replicate-prediction-01dc0g3cv5rmt0czfpyvsn7ym4.jpeg",
    "trousers-single-tapered": "replicate-prediction-86v2dh5mynrmr0czfpxba8g1gc.jpeg"
    // Still to be generated: trousers-double-tapered,
    // trousers-single-classic. The build MUST skip any key whose source
    // file is absent and report it by name rather than failing — the
    // remaining two arrive later and must not block the other ten.
};

var MAX_EDGE = 800; // Renders at most ~600px in app; 800 leaves headroom.
```

CLI entry: read each source with `sharp` (already resizes and writes WebP), run `extractMask` → `erodeMask(…, 2)` → `normaliseLuminance`, write greyscale+alpha WebP at quality 82.

- [ ] **Step 2: Install sharp**

Run: `npm install --save-dev sharp`
Expected: added to `devDependencies` in `package.json`

Note: `package.json` must already declare `playwright`. Installing without `--save` against a bare `{}` previously pruned the undeclared playwright and broke the whole verification harness.

- [ ] **Step 3: Run the build on the five available sources**

Run: `node tools/build-garment-assets.js`
Expected: five files written to `images/garments/`, seven reported as `SKIP (no source)`

- [ ] **Step 4: Verify asset budget**

Run: `node -e "var fs=require('fs');var t=0;fs.readdirSync('images/garments').forEach(function(f){t+=fs.statSync('images/garments/'+f).size});console.log((t/1048576).toFixed(2)+' MB')"`
Expected: well under the 2.5 MB budget for five files. **If five files already exceed 1 MB, stop** — twelve will blow the budget, and `MAX_EDGE` or quality must drop before continuing.

- [ ] **Step 5: Commit**

```bash
git add tools/build-garment-assets.js package.json package-lock.json images/garments/
git commit -m "Build garment luminance+alpha WebP assets from source photographs"
```

---

## Task 5: Runtime compositor

**Files:**
- Create: `garment-photo.js`
- Modify: `index.html:333` (script tag), `sw.js`

**Interfaces:**
- Produces: `renderGarmentPhoto(canvas, garmentKey, clothKey)` → draws the composited garment. Returns `true` on success, `false` if the asset is not yet loaded.
- Consumes: `getWeaveTile(clothKey)` from `weave-engine.js`.

- [ ] **Step 1: Write the failing verification**

Create `verify/photo-mockup.js`:

```js
// Drives the real app. Reads pixels out of the composited canvas —
// asserting that an asset loaded proves nothing about what rendered.
var playwright = require("playwright");

(async function () {
    var browser = await playwright.chromium.launch();
    var page = await browser.newPage();
    var url = process.env.SMOKE_URL || "http://localhost:3000";
    await page.goto(url);
    await page.waitForLoadState("networkidle");

    var result = await page.evaluate(function () {
        var c = document.createElement("canvas");
        c.width = 400; c.height = 500;
        if (!window.renderGarmentPhoto) return { error: "renderGarmentPhoto missing" };
        var ok = window.renderGarmentPhoto(c, "jacket-sb", "fox_classic_flannel_charcoal");
        if (!ok) return { error: "render returned false" };
        var d = c.getContext("2d").getImageData(0, 0, 400, 500).data;
        var opaque = 0, transparent = 0;
        for (var i = 3; i < d.length; i += 4) {
            if (d[i] > 200) opaque++; else if (d[i] < 20) transparent++;
        }
        return { opaque: opaque, transparent: transparent };
    });

    if (result.error) { console.error("FAIL: " + result.error); process.exit(1); }
    if (result.opaque < 20000) { console.error("FAIL: garment barely rendered (" + result.opaque + " opaque px)"); process.exit(1); }
    if (result.transparent < 20000) { console.error("FAIL: no background left — mask not applied"); process.exit(1); }

    console.log("PASS: garment composited (" + result.opaque + " opaque, " + result.transparent + " transparent)");
    await browser.close();
})();
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node verify/photo-mockup.js`
Expected: `FAIL: renderGarmentPhoto missing`

- [ ] **Step 3: Implement the compositor**

Create `garment-photo.js`:

```js
// Composites a cloth tile into a photographed garment.
//
// The photograph's LUMINANCE is the artwork, not the photograph. RGB
// carries normalised drape; alpha carries the garment mask. Both come
// from tools/build-garment-assets.js.
var garmentImages = {};

// cloth-data.js exposes CLOTH_LIBRARY as a flat array keyed by `key`.
function findCloth(key) {
    for (var i = 0; i < CLOTH_LIBRARY.length; i++) {
        if (CLOTH_LIBRARY[i].key === key) return CLOTH_LIBRARY[i];
    }
    return null;
}

function loadGarmentImage(key, onReady) {
    if (garmentImages[key]) { onReady(garmentImages[key]); return; }
    var img = new Image();
    img.onload = function () { garmentImages[key] = img; onReady(img); };
    img.src = "images/garments/" + key + ".webp";
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
```

- [ ] **Step 4: Wire it in and bump caches**

In `index.html`, add after the `weave-engine.js` tag (line 332):

```html
<script src="garment-photo.js?v=1"></script>
```

In `sw.js`, add `"./garment-photo.js?v=1"` to the precache list and set `CACHE_VERSION = "bbs-v43"`.

- [ ] **Step 5: Run verification**

Run: `node verify/photo-mockup.js`
Expected: `PASS: garment composited (…)`

- [ ] **Step 6: Commit**

```bash
git add garment-photo.js verify/photo-mockup.js index.html sw.js
git commit -m "Composite cloth into photographed garments at runtime"
```

---

## Task 6: Displacement at the four curvature regions

**Files:**
- Modify: `garment-photo.js`
- Modify: `verify/photo-mockup.js`

**Interfaces:**
- Produces: `DISPLACEMENT_REGIONS[garmentKey]` → array of `{x, y, w, h, angle, strength}` in normalised 0–1 coordinates.

Straight multiply leaves a chalkstripe running rigid across a curving chest. Because the garments are laid flat, curvature is confined to the lapel roll, sleeve cylinders, pleat folds and turn-up — four regions, not a whole-panel field.

- [ ] **Step 1: Write the failing verification**

Add to `verify/photo-mockup.js`, before `browser.close()`:

```js
// The load-bearing check. Render a chalkstripe and confirm stripe
// spacing at the lapel differs from spacing at the hem. If they match,
// the displacement field is not being applied and everything else is
// theatre.
var stripes = await page.evaluate(function () {
    var c = document.createElement("canvas");
    c.width = 400; c.height = 500;
    window.renderGarmentPhoto(c, "jacket-sb", "fox_flannel_chalkstripe");
    var ctx = c.getContext("2d");
    function edgesAcross(y) {
        var d = ctx.getImageData(0, y, 400, 1).data;
        var n = 0, prev = null;
        for (var x = 0; x < 400; x++) {
            if (d[x * 4 + 3] < 128) continue;
            var lum = d[x * 4];
            if (prev !== null && Math.abs(lum - prev) > 25) n++;
            prev = lum;
        }
        return n;
    }
    return { lapel: edgesAcross(140), hem: edgesAcross(430) };
});

if (stripes.lapel === stripes.hem) {
    console.error("FAIL: stripe density identical at lapel and hem — displacement not applied");
    process.exit(1);
}
console.log("PASS: displacement bends the pattern (lapel " + stripes.lapel + " vs hem " + stripes.hem + ")");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node verify/photo-mockup.js`
Expected: `FAIL: stripe density identical at lapel and hem`

- [ ] **Step 3: Implement displacement**

Add to `garment-photo.js`. Between compositor steps 1 and 2, redraw the cloth region-by-region with a per-region rotation and horizontal scale, so the pattern follows the form:

```js
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
```

Draw each region into an offscreen canvas with `ctx.rotate(angle)` and `ctx.scale(strength, 1)` applied to the pattern transform, then composite back.

- [ ] **Step 4: Run verification**

Run: `node verify/photo-mockup.js`
Expected: both PASS lines

- [ ] **Step 5: Commit**

```bash
git add garment-photo.js verify/photo-mockup.js
git commit -m "Bend cloth pattern at lapel and sleeve curvature"
```

---

## Task 7: Draw horn-brown buttons

**Files:**
- Modify: `garment-photo.js`
- Modify: `verify/photo-mockup.js`

**Decision (founder, 20 July):** buttons are **horn-brown**, the same brown on every cloth, never tinted. These are grey generated mockups whose own buttons are dark grey and get completely swallowed by the multiply — confirmed by magnifying the jacket-sb fastening button, which vanishes under the chalkstripe. So buttons are **drawn**, not restored from the photo. Restoring the photo's pixels would give grey buttons, which is not what was asked for.

**Scope:** draw buttons on the garments where they read prominently — both jackets and all four waistcoats. Trouser buttons (a single waistband closure, mostly hidden) are deferred and noted for the final review. This mirrors Task 6, where only `jacket-sb` carries displacement and the rest are a follow-up.

**Interfaces:**
- Produces: `GARMENT_BUTTONS[garmentKey]` → array of `{ x, y, r }` in normalised 0–1 coordinates (x,y = centre, r = radius as a fraction of canvas width).
- Produces: `drawGarmentButtons(ctx, canvas, garmentKey)` → draws the buttons for that garment, no-op if the garment has none.
- Consumes: `renderGarmentPhoto` from Task 5, which calls this last, after the alpha clip.

- [ ] **Step 1: Write the failing verification**

Add to `verify/photo-mockup.js`. The swallowed button in the source photo is still faintly visible as a dark spot, which is the ground truth for where a drawn button belongs. Sample the jacket-sb fastening button centre against a saturated navy cloth: a drawn horn button is warm (red channel clearly above blue); cloth or a swallowed grey button is not.

```js
var button = await page.evaluate(function () {
    var c = document.createElement("canvas");
    c.width = 400; c.height = 500;
    // poll until the async asset has loaded
    return (async function () {
        for (var i = 0; i < 100; i++) {
            if (window.renderGarmentPhoto(c, "jacket-sb", "fox_worsted_flannel_navy")) break;
            await new Promise(function (r) { setTimeout(r, 50); });
        }
        // Fastening-button centre. Confirm the exact pixel against the
        // authored GARMENT_BUTTONS position rather than trusting this
        // literal; the button must be sampled at its real centre.
        var b = window.GARMENT_BUTTONS["jacket-sb"];
        var fastening = b[b.length - 1]; // lowest button on the front
        var px = Math.round(fastening.x * 400), py = Math.round(fastening.y * 500);
        var d = c.getContext("2d").getImageData(px, py, 2, 2).data;
        return { r: d[0], g: d[1], b: d[2] };
    })();
});
if (!(button.r > button.b + 25)) {
    console.error("FAIL: no horn button at the fastening point (rgb " + button.r + "," + button.g + "," + button.b + ")");
    process.exit(1);
}
console.log("PASS: horn button drawn (rgb " + button.r + "," + button.g + "," + button.b + ")");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node verify/photo-mockup.js`
Expected: FAIL — `GARMENT_BUTTONS` undefined or no button at the point.

- [ ] **Step 3: Implement the button drawing**

Add to `garment-photo.js`. A horn button at render size is ~8–14px, so a filled disc in a mid horn-brown with a slightly darker rim and a couple of small stitch holes reads correctly. ES5 only.

```js
// Horn-brown, one colour on every cloth (founder decision). These are
// DRAWN, not restored from the photo — the grey mockups' own buttons are
// swallowed by the multiply, and restoring grey pixels is not "brown".
var BUTTON_HORN = "#6b4f34";
var BUTTON_HORN_RIM = "#4a3521";
var BUTTON_HOLE = "#2e2013";

// Normalised {x, y, r}. Authored by inspecting each garment render — the
// faint swallowed button in the photo marks where each one belongs.
var GARMENT_BUTTONS = {
    "jacket-sb": [ /* authored in Step 4 */ ]
};

function drawGarmentButtons(ctx, canvas, garmentKey) {
    var buttons = GARMENT_BUTTONS[garmentKey];
    if (!buttons) return;
    var W = canvas.width;
    for (var i = 0; i < buttons.length; i++) {
        var b = buttons[i];
        var cx = b.x * W, cy = b.y * canvas.height, r = b.r * W;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = BUTTON_HORN;
        ctx.fill();
        ctx.lineWidth = Math.max(1, r * 0.18);
        ctx.strokeStyle = BUTTON_HORN_RIM;
        ctx.stroke();
        // two stitch holes
        ctx.fillStyle = BUTTON_HOLE;
        var h = r * 0.22;
        ctx.beginPath(); ctx.arc(cx - r * 0.3, cy, h, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.3, cy, h, 0, Math.PI * 2); ctx.fill();
    }
}

window.GARMENT_BUTTONS = GARMENT_BUTTONS;
```

Call `drawGarmentButtons(ctx, canvas, garmentKey)` at the end of `renderGarmentPhoto`, after the `destination-in` clip and the `source-over` reset.

- [ ] **Step 4: Author button positions and verify visually**

For each of `jacket-sb`, `jacket-db`, `vest-sb-none`, `vest-sb-shawl`, `vest-db-none`, `vest-db-shawl`: render the garment, find each button's position from the faint swallowed spot in the render, add `{x, y, r}` entries, re-render, and confirm with the Read tool that every drawn brown button lands on a real button position — not floating on cloth, not missing one. A waistcoat has five buttons (SB) or two columns (DB); a jacket shows the fastening button(s) and four cuff buttons per sleeve. Cuff buttons are optional if too small to place reliably; the front buttons are the ones that matter.

Save a labelled render of `jacket-sb` with `fox_worsted_flannel_navy` to `.superpowers/sdd/task7-buttons.png` and inspect it.

- [ ] **Step 5: Run verification**

Start a server (`npx serve -l 3000 .`), then run `node verify/photo-mockup.js`.
Expected: all PASS lines including the horn-button check.

- [ ] **Step 6: Cache bump and commit**

Bump `garment-photo.js` `?v=`, the `sw.js` precache entry, and `CACHE_VERSION`.

```bash
git add garment-photo.js verify/photo-mockup.js index.html sw.js
git commit -m "Draw horn-brown buttons on jackets and waistcoats"
```

---

## Task 8: Resolve style options to photograph + overlays

**Files:**
- Modify: `fabric-visualiser.js:1218-1268` (`VIS_ENS_STYLE_OPTIONS` region)
- Modify: `garment-photo.js`

**Interfaces:**
- Produces: `resolveGarmentKey(garment, style)` → photograph key string.
- Produces: `resolveOverlays(garment, style)` → array of overlay keys.

Every one of the 56 combinations must resolve. An option that renders nothing is the exact failure this project has shipped repeatedly.

- [ ] **Step 1: Write the failing test**

Add to `verify/photo-mockup.js` a loop over the full cross-product of every option group for all three garments, asserting `resolveGarmentKey` returns a key present in the manifest and that no combination throws.

```js
var coverage = await page.evaluate(function () {
    var missing = [];
    var G = window.VIS_ENS_STYLE_OPTIONS;
    for (var garment in G) {
        var groups = G[garment], keys = [], combos = [{}];
        for (var g in groups) keys.push(g);
        keys.forEach(function (g) {
            var next = [];
            combos.forEach(function (c) {
                groups[g].forEach(function (o) {
                    var d = {}; for (var k in c) d[k] = c[k];
                    d[g] = o.key; next.push(d);
                });
            });
            combos = next;
        });
        combos.forEach(function (c) {
            var key = window.resolveGarmentKey(garment, c);
            if (!key || !window.GARMENT_KEYS[key]) missing.push(garment + " " + JSON.stringify(c));
        });
    }
    return { missing: missing, total: missing.length };
});
if (coverage.total > 0) {
    console.error("FAIL: " + coverage.total + " combinations resolve to nothing:");
    coverage.missing.slice(0, 10).forEach(function (m) { console.error("  " + m); });
    process.exit(1);
}
console.log("PASS: all 56 combinations resolve to a photograph");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node verify/photo-mockup.js`
Expected: `FAIL: 56 combinations resolve to nothing`

- [ ] **Step 3: Implement the resolver**

```js
// Silhouette-changing options pick the photograph; everything else is an
// overlay drawn on top of it.
function resolveGarmentKey(garment, style) {
    if (garment === "jacket") return "jacket-" + style.closure;
    if (garment === "vest") return "vest-" + style.closure + "-" + style.lapel;
    if (garment === "trousers") return "trousers-" + style.front + "-" + style.taper;
    return null;
}
```

- [ ] **Step 4: Run verification**

Run: `node verify/photo-mockup.js`
Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add garment-photo.js fabric-visualiser.js
git commit -m "Resolve every style combination to a photograph and overlays"
```

---

## Task 9: Swap the Cloth Room over and ship

**Files:**
- Modify: `fabric-visualiser.js` (garment render functions), `index.html`, `sw.js`, `styles.css`

- [ ] **Step 1: Replace the SVG clip render with the compositor**

Swap the `clipPath` render path in `renderClothVisualiser` and the ensemble view for a `<canvas>` plus `renderGarmentPhoto`. Keep `DS_VEST_BODY` and `dsTrouserBody` in place — the Split and the guide flip cards still use them.

- [ ] **Step 2: Bump caches**

`index.html`: `fabric-visualiser.js?v=9`, `garment-photo.js?v=2`, `styles.css?v=57`. Matching `sw.js` entries. `CACHE_VERSION = "bbs-v44"`.

- [ ] **Step 3: Run the full suite**

```bash
node verify/audit.js
node verify/smoke.js
node verify/photo-mockup.js
```
Expected: all green.

- [ ] **Step 4: Confirm the asset budget holds**

Run the budget command from Task 4 Step 4.
Expected: under 2.5 MB across all twelve garments plus overlays.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Render the Cloth Room from photographs"
```

---

## Self-review notes

**Spec coverage:** mask (T1–2), luminance (T3), assets and budget (T4), compositor (T5), displacement (T6), holes (T7), 56-combination resolution (T8), integration (T9). The spec's mask-fringe risk is handled in T2; the asset-weight risk has a hard stop in T4 Step 4.

**Known gaps, deliberate:**
- Tasks 4, 6 and 7 cover only the five existing photographs. The remaining seven are generated in parallel; each drops into `SOURCES`, `DISPLACEMENT_REGIONS` and `HOLES` without structural change.
- Overlay art for local options (pockets, lapel notch/peak, waistcoat hem, waistband, turn-up) is authored in Task 8 but not itemised per option. Enumerate before starting that task.
- `trousers-flat-tapered` displacement is unspecified — a flat-front tapered leg is nearly planar and may need no region at all. Verify rather than assume.
