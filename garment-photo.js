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
