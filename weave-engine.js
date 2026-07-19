// ============================================
// WEAVE ENGINE
//
// Renders a 96x96 seamlessly-tiling cloth swatch from a cloth record's
// parameters. Replaces the per-cloth hand-written drawTile functions:
// a cloth's visual identity is now its weave, ground colour, overlay
// and overlay colour, so adding a cloth is data entry rather than
// drawing code.
//
// Contract: drawClothTile(ctx, cloth) paints a 96x96 context.
// Consumed by getFabricTile() in fabric-visualiser.js.
//
// Everything here is deterministic — the yarn slubs and melange
// flecks come from a seeded PRNG keyed on the cloth, not Math.random.
// A cloth therefore looks identical on every load and across every
// iPad, and the self-check at the bottom of this file can assert on
// exact output.
//
// Self-check: node weave-engine.js   (needs canvas shim; see runSelfCheck)
// ============================================

var WEAVE_TILE = 96;

// 96 is the tile size, so a pattern only tiles seamlessly when its
// pitch divides 96. Authors give a rough pitch in the cloth record and
// this snaps it to the nearest legal one rather than letting a stripe
// visibly jump at the tile boundary.
var WEAVE_PITCHES = [2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 96];

var WEAVE_GROUNDS = ["plain", "twill", "hopsack", "flannel", "birdseye", "herringbone"];
var WEAVE_OVERLAYS = ["none", "chalkstripe", "pinstripe", "windowpane", "glen"];

function snapWeavePitch(pitch) {
    var best = WEAVE_PITCHES[0];
    var bestGap = Infinity;
    for (var i = 0; i < WEAVE_PITCHES.length; i++) {
        var gap = Math.abs(WEAVE_PITCHES[i] - pitch);
        if (gap < bestGap) {
            bestGap = gap;
            best = WEAVE_PITCHES[i];
        }
    }
    return best;
}

// ---- colour helpers ----

function weaveHexToRGB(hex) {
    var h = String(hex).replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16)
    };
}

function weaveShade(hex, amount) {
    var c = weaveHexToRGB(hex);
    function step(v) {
        var out = amount >= 0 ? v + (255 - v) * amount : v * (1 + amount);
        return Math.max(0, Math.min(255, Math.round(out)));
    }
    return "rgb(" + step(c.r) + "," + step(c.g) + "," + step(c.b) + ")";
}

function weaveRGBA(hex, alpha) {
    var c = weaveHexToRGB(hex);
    return "rgba(" + c.r + "," + c.g + "," + c.b + "," + alpha + ")";
}

// ---- deterministic randomness ----

// Mulberry32. Cloth texture needs irregularity to read as woven wool
// rather than printed vinyl, but it must be the *same* irregularity
// every time, so the seed comes from the cloth key.
function weaveRandom(seed) {
    var t = seed >>> 0;
    return function () {
        t = (t + 0x6d2b79f5) >>> 0;
        var x = Math.imul(t ^ (t >>> 15), 1 | t);
        x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
}

function weaveSeedFromKey(key) {
    var h = 2166136261;
    var s = String(key);
    for (var i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

// ============================================
// GROUNDS
// Each paints the full 96x96 field. Grounds must wrap: any mark drawn
// past an edge is redrawn on the opposite side.
// ============================================

// The soft fibrous haze shared by every ground. This is what stops a
// swatch reading as flat colour — real cloth scatters light.
function weaveMelange(g, ground, rnd, density, strength) {
    var n = Math.round(WEAVE_TILE * WEAVE_TILE * density);
    for (var i = 0; i < n; i++) {
        var x = rnd() * WEAVE_TILE;
        var y = rnd() * WEAVE_TILE;
        var up = rnd() > 0.5;
        g.fillStyle = up
            ? "rgba(255,255,255," + strength * rnd() + ")"
            : "rgba(0,0,0," + strength * rnd() + ")";
        g.fillRect(x, y, 1.2, 1.2);
    }
}

function weaveGroundPlain(g, ground, rnd) {
    g.fillStyle = ground;
    g.fillRect(0, 0, WEAVE_TILE, WEAVE_TILE);
    // Warp and weft: a fine over-under grid at 2px, which at swatch
    // scale reads as a smooth worsted rather than as visible squares.
    for (var y = 0; y < WEAVE_TILE; y += 2) {
        for (var x = 0; x < WEAVE_TILE; x += 2) {
            var lit = ((x + y) / 2) % 2 === 0;
            g.fillStyle = lit ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.075)";
            g.fillRect(x, y, 2, 2);
        }
    }
    weaveMelange(g, ground, rnd, 0.03, 0.10);
}

// Draws one set of 45-degree ribs across the current clip. Shared by
// twill and herringbone: a rib is a lit face and a shadowed face
// side by side, which is what makes the diagonal read as raised.
// They must be spaced well apart — packed tighter than about 6px the
// lit and shadowed faces average out and the whole field goes flat.
function weaveRibs(g, spacing, rightward, lit, shade) {
    g.lineWidth = 2;
    for (var d = -WEAVE_TILE * 2; d < WEAVE_TILE * 2; d += spacing) {
        g.strokeStyle = "rgba(255,255,255," + lit + ")";
        g.beginPath();
        if (rightward) {
            g.moveTo(d, 0);
            g.lineTo(d + WEAVE_TILE, WEAVE_TILE);
        } else {
            g.moveTo(d + WEAVE_TILE, 0);
            g.lineTo(d, WEAVE_TILE);
        }
        g.stroke();
        g.strokeStyle = "rgba(0,0,0," + shade + ")";
        g.beginPath();
        if (rightward) {
            g.moveTo(d + 3, 0);
            g.lineTo(d + 3 + WEAVE_TILE, WEAVE_TILE);
        } else {
            g.moveTo(d + 3 + WEAVE_TILE, 0);
            g.lineTo(d + 3, WEAVE_TILE);
        }
        g.stroke();
    }
}

function weaveGroundTwill(g, ground, rnd) {
    g.fillStyle = ground;
    g.fillRect(0, 0, WEAVE_TILE, WEAVE_TILE);
    weaveRibs(g, 8, true, 0.17, 0.16);
    weaveMelange(g, ground, rnd, 0.02, 0.09);
}

function weaveGroundHopsack(g, ground, rnd) {
    g.fillStyle = ground;
    g.fillRect(0, 0, WEAVE_TILE, WEAVE_TILE);
    // Basket weave: 2x2 yarn bundles alternating direction, with a gap
    // between bundles — the open, airy look hopsack is chosen for.
    var cell = 8;
    for (var y = 0; y < WEAVE_TILE; y += cell) {
        for (var x = 0; x < WEAVE_TILE; x += cell) {
            var flip = ((x / cell) + (y / cell)) % 2 === 0;
            g.fillStyle = "rgba(255,255,255,0.09)";
            if (flip) {
                g.fillRect(x + 0.5, y + 0.5, cell - 2, (cell / 2) - 1);
                g.fillStyle = "rgba(0,0,0,0.10)";
                g.fillRect(x + 0.5, y + (cell / 2) + 0.5, cell - 2, (cell / 2) - 1);
            } else {
                g.fillRect(x + 0.5, y + 0.5, (cell / 2) - 1, cell - 2);
                g.fillStyle = "rgba(0,0,0,0.10)";
                g.fillRect(x + (cell / 2) + 0.5, y + 0.5, (cell / 2) - 1, cell - 2);
            }
        }
    }
    weaveMelange(g, ground, rnd, 0.02, 0.08);
}

function weaveGroundFlannel(g, ground, rnd) {
    g.fillStyle = ground;
    g.fillRect(0, 0, WEAVE_TILE, WEAVE_TILE);
    // Flannel is milled and raised until the weave disappears, so
    // there is deliberately no grid here — only dense soft fibre.
    weaveMelange(g, ground, rnd, 0.55, 0.13);
    weaveMelange(g, ground, rnd, 0.10, 0.20);
}

function weaveGroundBirdseye(g, ground, rnd) {
    g.fillStyle = ground;
    g.fillRect(0, 0, WEAVE_TILE, WEAVE_TILE);
    // Birdseye is a dark ground carrying a grid of tiny light "eyes".
    // Rows are offset by half a cell — a square grid reads as a printed
    // screen, the brick offset reads as woven.
    var cell = 8;
    for (var y = 0; y < WEAVE_TILE; y += cell) {
        var offset = ((y / cell) % 2) * (cell / 2);
        for (var x = -cell; x < WEAVE_TILE + cell; x += cell) {
            var cx = x + offset + cell / 2;
            var cy = y + cell / 2;
            g.fillStyle = "rgba(0,0,0,0.16)";
            g.beginPath();
            g.arc(cx, cy, 2.6, 0, Math.PI * 2);
            g.fill();
            g.fillStyle = "rgba(255,255,255,0.42)";
            g.beginPath();
            g.arc(cx, cy, 1.3, 0, Math.PI * 2);
            g.fill();
        }
    }
    weaveMelange(g, ground, rnd, 0.02, 0.08);
}

function weaveGroundHerringbone(g, ground, rnd) {
    g.fillStyle = ground;
    g.fillRect(0, 0, WEAVE_TILE, WEAVE_TILE);
    // Twill that reverses direction every band, producing the chevron.
    // Bands are 16px, so the tile holds exactly 6 and the seam lands on
    // a direction change rather than mid-band.
    var band = 16;
    for (var b = 0; b < WEAVE_TILE; b += band) {
        g.save();
        g.beginPath();
        g.rect(b, 0, band, WEAVE_TILE);
        g.clip();
        weaveRibs(g, 8, (b / band) % 2 === 0, 0.19, 0.17);
        g.restore();
    }
    // A hairline down each band join. Real herringbone shows a visible
    // seam where the two directions meet; without it the chevrons
    // blur into one another at swatch scale.
    g.strokeStyle = "rgba(0,0,0,0.14)";
    g.lineWidth = 1;
    for (var s = 0; s < WEAVE_TILE; s += band) {
        g.beginPath();
        g.moveTo(s + 0.5, 0);
        g.lineTo(s + 0.5, WEAVE_TILE);
        g.stroke();
    }
    weaveMelange(g, ground, rnd, 0.02, 0.08);
}

var WEAVE_GROUND_FNS = {
    plain: weaveGroundPlain,
    twill: weaveGroundTwill,
    hopsack: weaveGroundHopsack,
    flannel: weaveGroundFlannel,
    birdseye: weaveGroundBirdseye,
    herringbone: weaveGroundHerringbone
};

// ============================================
// OVERLAYS
// Painted over the ground. Pitch is snapped to a divisor of the tile
// so stripes and checks meet cleanly at the seam.
// ============================================

function weaveOverlayChalkstripe(g, o, rnd) {
    var pitch = snapWeavePitch(o.pitch || 24);
    // A chalkstripe is a soft chalky line, not a crisp rule — built
    // from three passes of decreasing width and increasing opacity.
    for (var x = 0; x < WEAVE_TILE; x += pitch) {
        g.fillStyle = weaveRGBA(o.colour, 0.10);
        g.fillRect(x - 1.5, 0, 4, WEAVE_TILE);
        g.fillStyle = weaveRGBA(o.colour, 0.18);
        g.fillRect(x - 0.5, 0, 2, WEAVE_TILE);
        // Broken texture along the stripe keeps it looking woven in.
        for (var y = 0; y < WEAVE_TILE; y += 2) {
            if (rnd() > 0.45) {
                g.fillStyle = weaveRGBA(o.colour, 0.30 * rnd());
                g.fillRect(x, y, 1.2, 2);
            }
        }
    }
}

function weaveOverlayPinstripe(g, o, rnd) {
    var pitch = snapWeavePitch(o.pitch || 12);
    // A pinstripe is a single yarn: a dotted line, not a solid one.
    for (var x = 0; x < WEAVE_TILE; x += pitch) {
        for (var y = 0; y < WEAVE_TILE; y += 3) {
            g.fillStyle = weaveRGBA(o.colour, 0.34 + 0.16 * rnd());
            g.fillRect(x, y, 1, 2);
        }
    }
}

function weaveOverlayWindowpane(g, o, rnd) {
    var pitch = snapWeavePitch(o.pitch || 32);
    g.lineWidth = 1;
    g.strokeStyle = weaveRGBA(o.colour, 0.40);
    for (var x = 0; x < WEAVE_TILE; x += pitch) {
        g.beginPath();
        g.moveTo(x + 0.5, 0);
        g.lineTo(x + 0.5, WEAVE_TILE);
        g.stroke();
    }
    for (var y = 0; y < WEAVE_TILE; y += pitch) {
        g.beginPath();
        g.moveTo(0, y + 0.5);
        g.lineTo(WEAVE_TILE, y + 0.5);
        g.stroke();
    }
}

function weaveOverlayGlen(g, o, rnd) {
    var pitch = snapWeavePitch(o.pitch || 24);
    var half = pitch / 2;

    // Glenurquhart is a checkerboard, not a grid: quadrants of dense
    // houndstooth alternating with quadrants of plain hairline. An
    // even grid in both directions — which is what this used to draw —
    // reads as windowpane, because the blocks are what make it glen.
    for (var by = 0; by < WEAVE_TILE; by += half) {
        for (var bx = 0; bx < WEAVE_TILE; bx += half) {
            var dense = (((bx / half) + (by / half)) % 2) === 0;
            if (dense) {
                // Houndstooth-ish: staggered notched blocks.
                for (var y = by; y < by + half; y += 4) {
                    for (var x = bx; x < bx + half; x += 4) {
                        var stagger = ((y - by) / 4) % 2 === 0;
                        g.fillStyle = weaveRGBA(o.colour, stagger ? 0.30 : 0.20);
                        g.fillRect(x, y, stagger ? 3 : 2, 2);
                    }
                }
            } else {
                // Sparse quadrant: fine hairlines only, one direction.
                for (var hy = by; hy < by + half; hy += 4) {
                    g.fillStyle = weaveRGBA(o.colour, 0.11);
                    g.fillRect(bx, hy, half, 1);
                }
            }
        }
    }

    // The overcheck: a coloured rule on the block boundary, repeated at
    // full pitch. This is the line that reads as Prince of Wales.
    if (o.overcheck) {
        g.lineWidth = 1;
        g.strokeStyle = weaveRGBA(o.overcheck, 0.50);
        for (var p = 0; p < WEAVE_TILE; p += pitch) {
            g.beginPath();
            g.moveTo(p + 0.5, 0);
            g.lineTo(p + 0.5, WEAVE_TILE);
            g.moveTo(0, p + 0.5);
            g.lineTo(WEAVE_TILE, p + 0.5);
            g.stroke();
        }
    }
}

var WEAVE_OVERLAY_FNS = {
    none: null,
    chalkstripe: weaveOverlayChalkstripe,
    pinstripe: weaveOverlayPinstripe,
    windowpane: weaveOverlayWindowpane,
    glen: weaveOverlayGlen
};

// ============================================
// ENTRY POINT
// ============================================

function drawClothTile(g, cloth) {
    var rnd = weaveRandom(weaveSeedFromKey(cloth.key || "cloth"));
    var ground = cloth.ground || "#3a3b3f";

    var groundFn = WEAVE_GROUND_FNS[cloth.weave] || weaveGroundPlain;
    groundFn(g, ground, rnd);

    if (cloth.overlay && cloth.overlay.type && cloth.overlay.type !== "none") {
        var overlayFn = WEAVE_OVERLAY_FNS[cloth.overlay.type];
        if (overlayFn) overlayFn(g, cloth.overlay, rnd);
    }

    // A final unifying wash. Without it the overlay sits on top of the
    // ground rather than in it, and the swatch reads as printed.
    g.fillStyle = weaveRGBA(ground, 0.07);
    g.fillRect(0, 0, WEAVE_TILE, WEAVE_TILE);
}

// ============================================
// SELF-CHECK
// Asserts every weave x overlay pair renders something that is both
// non-blank and non-uniform — a silently flat tile is the failure
// mode that would otherwise ship looking like solid colour.
// ============================================

function runWeaveSelfCheck(makeContext) {
    var failures = [];
    for (var w = 0; w < WEAVE_GROUNDS.length; w++) {
        for (var o = 0; o < WEAVE_OVERLAYS.length; o++) {
            var name = WEAVE_GROUNDS[w] + " + " + WEAVE_OVERLAYS[o];
            var made = makeContext();
            drawClothTile(made.ctx, {
                key: "selfcheck_" + w + "_" + o,
                weave: WEAVE_GROUNDS[w],
                ground: "#3a4a63",
                overlay: { type: WEAVE_OVERLAYS[o], colour: "#d8d2c6", pitch: 24 }
            });
            var px = made.pixels();
            var min = 255;
            var max = 0;
            var opaque = 0;
            for (var i = 0; i < px.length; i += 4) {
                if (px[i + 3] > 0) opaque++;
                var lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
                if (lum < min) min = lum;
                if (lum > max) max = lum;
            }
            if (opaque !== px.length / 4) failures.push(name + ": tile has transparent pixels");
            else if (max - min < 6) failures.push(name + ": tile is flat (luminance range " + (max - min).toFixed(1) + ")");
        }
    }
    return failures;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        drawClothTile: drawClothTile,
        runWeaveSelfCheck: runWeaveSelfCheck,
        WEAVE_GROUNDS: WEAVE_GROUNDS,
        WEAVE_OVERLAYS: WEAVE_OVERLAYS,
        snapWeavePitch: snapWeavePitch
    };
}
