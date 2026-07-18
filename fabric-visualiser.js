// ============================================
// BBS FABRIC VISUALISER — "The Cloth Room"
// Layered 2D technique: tiled fabric texture under a
// grayscale-shaded garment SVG (multiply blend).
// Tiles are generated in canvas as placeholders; swap
// each fabric's drawTile for a photographed swatch
// image when photography lands (see image pipeline).
// ============================================

// Each cloth carries a `mill` (from the houses BBS stocks — see
// cloth_origins in data.js) and a `guidePath` into the guide tree:
// the original 8 link to their fabric topics, the mill-attributed
// additions link to the mill's own topic page.
var FABRIC_LIBRARY = [
    {
        key: "hopsack",
        name: "Navy Hopsack",
        mill: "Vitale Barberis Canonico",
        composition: "100% Wool",
        weight: "260 g",
        character: "Open basket weave with surface depth. Breathes well, resists wrinkling, and reads as texture rather than pattern.",
        guidePath: ["fabrics", "suiting", "hopsack"],
        drawTile: function (g) {
            g.fillStyle = "#232f4b";
            g.fillRect(0, 0, 96, 96);
            g.lineWidth = 3;
            for (var y = 0; y < 96; y += 6) {
                for (var x = 0; x < 96; x += 6) {
                    var lit = ((x + y) / 6) % 2 === 0;
                    g.fillStyle = lit ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)";
                    g.fillRect(x, y, 5, 5);
                }
            }
        },
    },
    {
        key: "fresco",
        name: "Slate Fresco",
        mill: "Huddersfield",
        composition: "100% High-Twist Wool",
        weight: "250 g",
        character: "The tropical workhorse. Open, porous weave with a dry crisp hand — cool in heat, sharp all day.",
        guidePath: ["fabrics", "suiting", "fresco"],
        drawTile: function (g) {
            g.fillStyle = "#54607a";
            g.fillRect(0, 0, 96, 96);
            for (var y = 2; y < 96; y += 4) {
                for (var x = 2; x < 96; x += 4) {
                    g.fillStyle = "rgba(20,24,34," + (0.10 + 0.1 * Math.random()) + ")";
                    g.fillRect(x, y, 2, 2);
                }
            }
            for (var i = 0; i < 300; i++) {
                g.fillStyle = "rgba(255,255,255," + 0.05 * Math.random() + ")";
                g.fillRect(Math.random() * 96, Math.random() * 96, 1.5, 1.5);
            }
        },
    },
    {
        key: "high_twist_wool",
        name: "Midnight High-Twist",
        mill: "Reda",
        composition: "100% Wool",
        weight: "270 g",
        character: "Springy, resilient yarn that shrugs off creases. The travel cloth — composed after a red-eye.",
        guidePath: ["fabrics", "suiting", "high_twist_wool"],
        drawTile: function (g) {
            g.fillStyle = "#1c2436";
            g.fillRect(0, 0, 96, 96);
            g.strokeStyle = "rgba(255,255,255,0.05)";
            g.lineWidth = 1;
            for (var i = -96; i < 192; i += 4) {
                g.beginPath();
                g.moveTo(i, 0);
                g.lineTo(i + 96, 96);
                g.stroke();
            }
        },
    },
    {
        key: "linen_suiting",
        name: "Flax Irish Linen",
        mill: "Solbiati",
        composition: "100% Linen",
        weight: "290 g",
        character: "Dry, cool, and honest — the slubs and creases are the point. Elegance that loosens as the day goes on.",
        guidePath: ["fabrics", "suiting", "linen_suiting"],
        drawTile: function (g) {
            g.fillStyle = "#c8b494";
            g.fillRect(0, 0, 96, 96);
            for (var y = 0; y < 96; y += 3) {
                g.fillStyle = "rgba(140,115,80," + (0.06 + 0.1 * Math.random()) + ")";
                g.fillRect(0, y, 96, 1.5);
            }
            for (var i = 0; i < 26; i++) {
                g.fillStyle = "rgba(105,85,60,0.35)";
                g.fillRect(Math.random() * 96, Math.random() * 96, 6 + Math.random() * 14, 1.6);
            }
            for (var j = 0; j < 20; j++) {
                g.fillStyle = "rgba(255,250,240,0.30)";
                g.fillRect(Math.random() * 96, Math.random() * 96, 4 + Math.random() * 10, 1.2);
            }
        },
    },
    {
        key: "worsted_wool",
        name: "Charcoal Worsted",
        mill: "Alfred Brown",
        composition: "Super 120s Wool",
        weight: "280 g",
        character: "Smooth, fine, and quietly formal. The businessman's cloth — clean drape, subtle twill, no argument.",
        guidePath: ["fabrics", "suiting", "worsted_wool"],
        drawTile: function (g) {
            g.fillStyle = "#3b3b40";
            g.fillRect(0, 0, 96, 96);
            g.strokeStyle = "rgba(255,255,255,0.045)";
            g.lineWidth = 1.4;
            for (var i = -96; i < 192; i += 3) {
                g.beginPath();
                g.moveTo(i, 96);
                g.lineTo(i + 96, 0);
                g.stroke();
            }
        },
    },
    {
        key: "wool_silk_linen",
        name: "Taupe Wool-Silk-Linen",
        mill: "Loro Piana",
        composition: "Wool / Silk / Linen",
        weight: "240 g",
        character: "Three fibres, one cloth: wool's drape, silk's low sheen, linen's dry touch. The occasion jacket blend.",
        guidePath: ["fabrics", "suiting", "wool_silk_linen"],
        drawTile: function (g) {
            g.fillStyle = "#8d7f6d";
            g.fillRect(0, 0, 96, 96);
            for (var i = 0; i < 420; i++) {
                var warm = Math.random() > 0.5;
                g.fillStyle = warm
                    ? "rgba(220,205,180," + 0.16 * Math.random() + ")"
                    : "rgba(70,60,48," + 0.16 * Math.random() + ")";
                g.fillRect(Math.random() * 96, Math.random() * 96, 2.4, 1.4);
            }
        },
    },
    {
        key: "summer_tweed",
        name: "Sand Summer Tweed",
        mill: "Harrisons",
        composition: "Wool / Silk Blend",
        weight: "255 g",
        character: "Tweed character without tweed weight — herringbone texture and flecks in a breathable summer hand.",
        guidePath: ["fabrics", "suiting", "summer_tweed"],
        drawTile: function (g) {
            g.fillStyle = "#a98e66";
            g.fillRect(0, 0, 96, 96);
            g.lineWidth = 2.4;
            for (var r = 0; r < 12; r++) {
                var y = r * 8 + 4;
                var flip = r % 2 === 1;
                g.strokeStyle = "rgba(70,52,30,0.28)";
                for (var x = 0; x < 96; x += 8) {
                    g.beginPath();
                    if (flip) {
                        g.moveTo(x, y - 3);
                        g.lineTo(x + 8, y + 3);
                    } else {
                        g.moveTo(x, y + 3);
                        g.lineTo(x + 8, y - 3);
                    }
                    g.stroke();
                }
            }
            for (var i = 0; i < 14; i++) {
                g.fillStyle = "rgba(245,240,228,0.5)";
                g.fillRect(Math.random() * 96, Math.random() * 96, 2, 2);
            }
        },
    },
    {
        key: "wool_linen",
        name: "Stone Wool-Linen",
        mill: "Standeven",
        composition: "Wool / Linen",
        weight: "250 g",
        character: "Linen's texture tempered by wool's recovery. Softly rumpled, never sloppy — the smart-casual anchor.",
        guidePath: ["fabrics", "suiting", "wool_linen"],
        drawTile: function (g) {
            g.fillStyle = "#a49a88";
            g.fillRect(0, 0, 96, 96);
            for (var y = 0; y < 96; y += 4) {
                g.fillStyle = "rgba(120,110,92," + (0.08 + 0.08 * Math.random()) + ")";
                g.fillRect(0, y, 96, 2);
            }
            for (var i = 0; i < 16; i++) {
                g.fillStyle = "rgba(85,76,60,0.30)";
                g.fillRect(Math.random() * 96, Math.random() * 96, 5 + Math.random() * 10, 1.5);
            }
        },
    },
    {
        key: "fox_flannel",
        name: "Chalkstripe Grey Flannel",
        mill: "Fox Brothers",
        composition: "100% Woollen Flannel",
        weight: "310 g",
        character: "The definitive flannel, milled in Somerset since 1772. Soft, matte, and quietly authoritative under a chalk stripe.",
        guidePath: ["cloth_origins", "suiting", "english", "fox"],
        drawTile: function (g) {
            g.fillStyle = "#6e6c6a";
            g.fillRect(0, 0, 96, 96);
            for (var i = 0; i < 700; i++) {
                var lite = Math.random() > 0.5;
                g.fillStyle = lite
                    ? "rgba(200,198,194," + 0.10 * Math.random() + ")"
                    : "rgba(40,40,42," + 0.10 * Math.random() + ")";
                g.fillRect(Math.random() * 96, Math.random() * 96, 2.5, 1.2);
            }
            for (var x = 12; x < 96; x += 32) {
                g.fillStyle = "rgba(235,232,226,0.16)";
                g.fillRect(x - 1, 0, 3, 96);
                g.fillStyle = "rgba(235,232,226,0.5)";
                g.fillRect(x, 0, 1, 96);
            }
        },
    },
    {
        key: "dormeuil_glencheck",
        name: "Prince of Wales Check",
        mill: "Dormeuil",
        composition: "100% Wool",
        weight: "270 g",
        character: "The gentleman's pattern — glen check discipline with Parisian polish. Wears as a suit or breaks apart beautifully.",
        guidePath: ["cloth_origins", "suiting", "french", "dormeuil"],
        drawTile: function (g) {
            g.fillStyle = "#b3aea4";
            g.fillRect(0, 0, 96, 96);
            // alternating fine-check blocks
            g.fillStyle = "rgba(60,58,54,0.22)";
            for (var by = 0; by < 96; by += 48) {
                for (var bx = 0; bx < 96; bx += 48) {
                    if ((bx / 48 + by / 48) % 2 === 0) {
                        for (var y = by; y < by + 48; y += 4) {
                            for (var x = bx; x < bx + 48; x += 4) {
                                if ((x / 4 + y / 4) % 2 === 0) g.fillRect(x, y, 2, 2);
                            }
                        }
                    }
                }
            }
            // overcheck lines
            g.strokeStyle = "rgba(44,42,40,0.45)";
            g.lineWidth = 1;
            [0, 48].forEach(function (o) {
                g.beginPath(); g.moveTo(o, 0); g.lineTo(o, 96); g.stroke();
                g.beginPath(); g.moveTo(0, o); g.lineTo(96, o); g.stroke();
            });
        },
    },
    {
        key: "drago_birdseye",
        name: "Navy Birdseye",
        mill: "Drago",
        composition: "Super 130s Wool",
        weight: "260 g",
        character: "Solid at arm's length, alive up close — a pin-dot weave that gives navy quiet dimension. Boardroom-proof.",
        guidePath: ["cloth_origins", "suiting", "italian", "drago"],
        drawTile: function (g) {
            g.fillStyle = "#1f2940";
            g.fillRect(0, 0, 96, 96);
            g.fillStyle = "rgba(210,214,222,0.30)";
            for (var y = 0; y < 96; y += 6) {
                for (var x = 0; x < 96; x += 6) {
                    var ox = (y / 6) % 2 === 0 ? 0 : 3;
                    g.fillRect(x + ox, y, 1.6, 1.6);
                }
            }
        },
    },
    {
        key: "hs_gabardine",
        name: "Ecru Wool Gabardine",
        mill: "Holland & Sherry",
        composition: "100% Worsted Wool",
        weight: "290 g",
        character: "Steep-twill smoothness with real body. The summer-city trouser cloth — sharp crease, soft colour.",
        guidePath: ["cloth_origins", "suiting", "english", "holland_sherry"],
        drawTile: function (g) {
            g.fillStyle = "#ddd3bf";
            g.fillRect(0, 0, 96, 96);
            g.strokeStyle = "rgba(150,138,115,0.30)";
            g.lineWidth = 1.2;
            for (var i = -192; i < 96; i += 3) {
                g.beginPath();
                g.moveTo(i, 96);
                g.lineTo(i + 192, 0);
                g.stroke();
            }
        },
    },
    {
        key: "standeven_herringbone",
        name: "Storm Blue Herringbone",
        mill: "Standeven",
        composition: "Wool / Linen",
        weight: "265 g",
        character: "A weatherworn blue with a fine broken-twill rhythm. Odd-jacket cloth with instant depth.",
        guidePath: ["cloth_origins", "suiting", "english", "standeven"],
        drawTile: function (g) {
            g.fillStyle = "#46586b";
            g.fillRect(0, 0, 96, 96);
            g.lineWidth = 1.8;
            for (var r = 0; r < 16; r++) {
                var y = r * 6 + 3;
                var flip = r % 2 === 1;
                g.strokeStyle = "rgba(220,228,236,0.16)";
                for (var x = 0; x < 96; x += 6) {
                    g.beginPath();
                    if (flip) {
                        g.moveTo(x, y - 2.2);
                        g.lineTo(x + 6, y + 2.2);
                    } else {
                        g.moveTo(x, y + 2.2);
                        g.lineTo(x + 6, y - 2.2);
                    }
                    g.stroke();
                }
            }
        },
    },
    {
        key: "piacenza_camel",
        name: "Camel Cashmere Blend",
        mill: "Piacenza",
        composition: "Cashmere / Wool",
        weight: "320 g",
        character: "Biella's oldest cashmere house. A warm camel jacketing with a soft nap that photographs like candlelight.",
        guidePath: ["cloth_origins", "suiting", "italian", "piacenza"],
        drawTile: function (g) {
            g.fillStyle = "#b98f5e";
            g.fillRect(0, 0, 96, 96);
            for (var i = 0; i < 900; i++) {
                var lite = Math.random() > 0.45;
                g.fillStyle = lite
                    ? "rgba(240,220,190," + 0.09 * Math.random() + ")"
                    : "rgba(120,85,45," + 0.09 * Math.random() + ")";
                g.fillRect(Math.random() * 96, Math.random() * 96, 1.6, 2.6);
            }
        },
    },
];

var _fabricTileCache = {};

function getFabricByKey(key) {
    for (var i = 0; i < FABRIC_LIBRARY.length; i++) {
        if (FABRIC_LIBRARY[i].key === key) return FABRIC_LIBRARY[i];
    }
    return FABRIC_LIBRARY[0];
}

// Cloths recommended for the client's style archetype, derived from
// the archetype's existing exploreNext guide links (fabrics/suiting/*).
// Returns [] when no archetype result exists yet.
function getRecommendedFabricKeys() {
    if (!appState.archetypeKey || typeof archetypeProfiles === "undefined") return [];
    var profile = archetypeProfiles[appState.archetypeKey];
    if (!profile || !profile.exploreNext) return [];
    var keys = [];
    for (var i = 0; i < profile.exploreNext.length; i++) {
        var path = profile.exploreNext[i];
        if (path.length === 3 && path[0] === "fabrics" && path[1] === "suiting") {
            for (var j = 0; j < FABRIC_LIBRARY.length; j++) {
                if (FABRIC_LIBRARY[j].key === path[2]) keys.push(path[2]);
            }
        }
    }
    return keys;
}

function getFabricTile(key) {
    if (_fabricTileCache[key]) return _fabricTileCache[key];
    var fabric = getFabricByKey(key);
    var c = document.createElement("canvas");
    c.width = 96;
    c.height = 96;
    fabric.drawTile(c.getContext("2d"));
    var url = c.toDataURL();
    _fabricTileCache[key] = url;
    return url;
}

// ============================================
// GARMENT ART — single-breasted notch-lapel jacket,
// front view. Grayscale shading only; colour comes
// entirely from the fabric layer underneath.
// ============================================

function getVisualiserJacketSVG() {
    var body =
        "M220 58 " +
        "L172 70 Q136 79 126 108 " +
        "L108 190 Q102 220 104 268 L108 420 Q109 452 116 470 " +
        "L150 478 Q158 479 160 462 L158 300 L152 210 " +
        "L166 262 Q170 276 172 300 L172 470 Q172 486 188 488 " +
        "L252 488 Q268 486 268 470 L268 300 Q270 276 274 262 " +
        "L288 210 L282 300 L280 462 Q282 479 290 478 " +
        "L324 470 Q331 452 332 420 L336 268 Q338 220 332 190 " +
        "L314 108 Q304 79 268 70 L220 58 Z";

    return (
        '<svg class="vis-shading" viewBox="0 0 440 540" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
        "<defs>" +
        // objectBoundingBox units so the same clip scales with the CSS-sized
        // fabric layer div exactly as the viewBox scales this SVG (both boxes
        // share the 440:540 aspect via .vis-stage's aspect-ratio).
        '<clipPath id="vis-jacket-clip" clipPathUnits="objectBoundingBox"><path transform="scale(0.00227273 0.00185185)" d="' + body + '"/></clipPath>' +
        '<linearGradient id="vis-body-light" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#8f8b84"/>' +
        '<stop offset="0.12" stop-color="#dedad2"/>' +
        '<stop offset="0.35" stop-color="#ffffff"/>' +
        '<stop offset="0.65" stop-color="#f4f1ea"/>' +
        '<stop offset="0.88" stop-color="#d5d1c8"/>' +
        '<stop offset="1" stop-color="#88847d"/>' +
        "</linearGradient>" +
        '<linearGradient id="vis-sleeve-l" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#9b978f"/>' +
        '<stop offset="0.5" stop-color="#e8e4dc"/>' +
        '<stop offset="1" stop-color="#b5b1a9"/>' +
        "</linearGradient>" +
        '<linearGradient id="vis-sleeve-r" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#b5b1a9"/>' +
        '<stop offset="0.5" stop-color="#e8e4dc"/>' +
        '<stop offset="1" stop-color="#9b978f"/>' +
        "</linearGradient>" +
        "</defs>" +
        '<g clip-path="url(#vis-jacket-clip)">' +
        '<rect width="440" height="540" fill="url(#vis-body-light)"/>' +
        // sleeves shaded separately
        '<path d="M126 108 L108 190 Q102 220 104 268 L108 420 Q109 452 116 470 L150 478 Q158 479 160 462 L158 300 L152 210 L150 150 Q146 118 126 108 Z" fill="url(#vis-sleeve-l)" opacity="0.9"/>' +
        '<path d="M314 108 L332 190 Q338 220 336 268 L332 420 Q331 452 324 470 L290 478 Q282 479 280 462 L282 300 L288 210 L290 150 Q294 118 314 108 Z" fill="url(#vis-sleeve-r)" opacity="0.9"/>' +
        // armhole seam shadows
        '<path d="M152 210 L150 150 Q146 118 126 108" stroke="#6f6b64" stroke-width="3" fill="none" opacity="0.55"/>' +
        '<path d="M288 210 L290 150 Q294 118 314 108" stroke="#6f6b64" stroke-width="3" fill="none" opacity="0.55"/>' +
        // lapels: lighter facets + roll shadow (inner edges part to leave a shirt V,
        // painted opaque by the separate non-blended overlay SVG)
        '<path d="M220 58 L196 74 L166 150 Q160 168 176 214 L206 300 L216 306 L206 96 Z" fill="#f6f3ec" opacity="0.92"/>' +
        '<path d="M220 58 L244 74 L274 150 Q280 168 264 214 L234 300 L224 306 L234 96 Z" fill="#e4e0d7" opacity="0.92"/>' +
        // notch cuts
        '<path d="M196 74 L170 96 L188 104 Z" fill="#b3afa7" opacity="0.8"/>' +
        '<path d="M244 74 L270 96 L252 104 Z" fill="#a5a199" opacity="0.8"/>' +
        // collar band
        '<path d="M196 74 L220 58 L244 74 L232 84 L220 78 L208 84 Z" fill="#cbc7be" opacity="0.9"/>' +
        // lapel edges
        '<path d="M196 74 L166 150 Q160 168 176 214 L206 300" stroke="#7d7972" stroke-width="2" fill="none" opacity="0.6"/>' +
        '<path d="M244 74 L274 150 Q280 168 264 214 L234 300" stroke="#7d7972" stroke-width="2" fill="none" opacity="0.6"/>' +
        // centre front: overlap shadow + open-quarters V below stance
        '<path d="M218 300 L222 300 L222 360 L220 364 L218 360 Z" fill="#8b8780" opacity="0.7"/>' +
        '<path d="M220 364 L196 488 L220 488 L244 488 Z" fill="#a5a199" opacity="0.45"/>' +
        '<path d="M220 364 L206 488" stroke="#7d7972" stroke-width="2" fill="none" opacity="0.6"/>' +
        '<path d="M220 364 L234 488" stroke="#8d8982" stroke-width="1.6" fill="none" opacity="0.5"/>' +
        // waist suppression shadows (dart hints)
        '<path d="M186 250 Q182 320 188 420" stroke="#a9a59d" stroke-width="4" fill="none" opacity="0.35"/>' +
        '<path d="M254 250 Q258 320 252 420" stroke="#a9a59d" stroke-width="4" fill="none" opacity="0.35"/>' +
        // chest pocket (left chest = viewer right? keep classic: wearer left, viewer left-of-centre mirrored — put viewer-left)
        '<rect x="178" y="176" width="34" height="5" rx="2" fill="#87837c" opacity="0.6" transform="rotate(-4 195 178)"/>' +
        // hip pocket flaps
        '<path d="M148 366 L196 372 L194 388 L146 382 Z" fill="#c9c5bc" opacity="0.85"/>' +
        '<path d="M148 366 L196 372" stroke="#7d7972" stroke-width="2" opacity="0.6"/>' +
        '<path d="M244 372 L292 366 L294 382 L246 388 Z" fill="#c2beb5" opacity="0.85"/>' +
        '<path d="M244 372 L292 366" stroke="#7d7972" stroke-width="2" opacity="0.6"/>' +
        // buttons
        '<circle cx="217" cy="316" r="7" fill="#4e4a43"/>' +
        '<circle cx="217" cy="316" r="7" fill="none" stroke="#2e2b26" stroke-width="1.4"/>' +
        '<circle cx="218" cy="352" r="7" fill="#4e4a43"/>' +
        '<circle cx="218" cy="352" r="7" fill="none" stroke="#2e2b26" stroke-width="1.4"/>' +
        // hem shadow
        '<path d="M116 470 L150 478 L188 488 L252 488 L290 478 L324 470 L324 486 L116 486 Z" fill="#8b8780" opacity="0.35"/>' +
        "</g>" +
        // outer contour
        '<path d="' + body + '" fill="none" stroke="#3d3931" stroke-width="2.5" opacity="0.75"/>' +
        "</svg>"
    );
}

// Opaque overlay (NOT multiply-blended): shirt V between the lapels.
// Separate element because anything inside .vis-shading multiplies with
// the fabric and cannot render lighter than the cloth.
function getVisualiserShirtOverlaySVG() {
    return (
        '<svg class="vis-overlay" viewBox="0 0 440 540" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
        // shirt wedge
        '<path d="M220 70 L204 88 L217 302 L220 308 L223 302 L236 88 Z" fill="#f8f5ef"/>' +
        // collar points
        '<path d="M220 70 L204 88 L216 104 L220 84 Z" fill="#eeeae2"/>' +
        '<path d="M220 70 L236 88 L224 104 L220 84 Z" fill="#e6e2da"/>' +
        // placket line
        '<path d="M220 106 L220 300" stroke="#d8d3c9" stroke-width="2" fill="none"/>' +
        // soft inner shadows where lapels overlap the shirt
        '<path d="M204 88 L217 302 L214 302 L201 92 Z" fill="#c9c4ba" opacity="0.7"/>' +
        '<path d="M236 88 L223 302 L226 302 L239 92 Z" fill="#c9c4ba" opacity="0.7"/>' +
        "</svg>"
    );
}

// ============================================
// VIEW
// ============================================

// The cloth the compare view opens against: the next recommendation
// for the client's archetype, else the next cloth in the bunch.
function visDefaultCompareKey(aKey) {
    var recommended = getRecommendedFabricKeys();
    for (var i = 0; i < recommended.length; i++) {
        if (recommended[i] !== aKey) return recommended[i];
    }
    for (var j = 0; j < FABRIC_LIBRARY.length; j++) {
        if (FABRIC_LIBRARY[j].key === aKey) {
            return FABRIC_LIBRARY[(j + 1) % FABRIC_LIBRARY.length].key;
        }
    }
    return FABRIC_LIBRARY[1].key;
}

function getVisRecoStripHTML(recommended) {
    if (!recommended.length || typeof archetypeProfiles === "undefined") return "";
    return (
        '<div class="vis-reco-strip">Marked cloths are recommended for <em>' +
        archetypeProfiles[appState.archetypeKey].name +
        "</em></div>"
    );
}

// selKey gets the accent ring; altKey (compare mode: the cloth dressed
// on the other side) gets a quiet one.
function getVisSwatchesHTML(recommended, selKey, altKey) {
    var swatchesHTML = "";
    for (var i = 0; i < FABRIC_LIBRARY.length; i++) {
        var f = FABRIC_LIBRARY[i];
        var cls = "vis-swatch";
        if (recommended.indexOf(f.key) !== -1) cls += " reco";
        if (f.key === selKey) cls += " sel";
        else if (altKey && f.key === altKey) cls += " sel-alt";
        swatchesHTML +=
            '<button class="' + cls + '" data-action="vis-pick-fabric" data-fabric="' + f.key + '" aria-label="' + f.name + '" title="' + f.name + '">' +
            '<span class="vis-swatch-cloth" style="background-image:url(' + getFabricTile(f.key) + ')"></span>' +
            "</button>";
    }
    return swatchesHTML;
}

function renderFabricVisualiser() {
    var recommended = getRecommendedFabricKeys();
    var activeKey = appState.visFabricKey || (recommended.length ? recommended[0] : FABRIC_LIBRARY[0].key);
    if (appState.visEnsemble) return renderClothEnsemble(recommended);
    if (appState.visCompare) return renderClothCompare(activeKey, recommended);
    var fabric = getFabricByKey(activeKey);

    return (
        '<div class="vis-shell">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
        "<h1 class=\"vis-title\">See It In Cloth</h1>" +
        '<p class="vis-lead">Select a cloth from the bunch. The garment re-renders instantly, the way it would leave the workshop.</p>' +
        '<div class="vis-stage">' +
        '<div class="vis-fabric-layer" id="vis-fabric-a" style="background-image:url(' + getFabricTile(activeKey) + ')"></div>' +
        '<div class="vis-fabric-layer" id="vis-fabric-b"></div>' +
        getVisualiserShirtOverlaySVG() +
        getVisualiserJacketSVG() +
        "</div>" +
        '<div class="vis-swatch-tray">' + getVisSwatchesHTML(recommended, activeKey, null) + "</div>" +
        getVisRecoStripHTML(recommended) +
        '<div class="vis-mode-toggles">' +
        '<button class="vis-mode-toggle" data-action="vis-compare-toggle">Compare two cloths &rarr;</button>' +
        '<button class="vis-mode-toggle" data-action="vis-ensemble-toggle">Design an ensemble &rarr;</button>' +
        "</div>" +
        '<div class="vis-info" id="vis-info">' + getFabricInfoHTML(fabric) + "</div>" +
        '<div class="vis-footnote">Preview woven from placeholder textures. Final renders will use photographed cloth.</div>' +
        '<div class="nav-buttons"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
        "</div>"
    );
}

// One side of the compare view. Both stages repeat the jacket SVG, so
// its clip/gradient ids appear twice: url(#) resolves to the first
// copy, the copies are identical, and the clipPath uses
// objectBoundingBox units — each layer clips in its own box.
function getVisCompareStageHTML(side, key) {
    var active = appState.visCompareSide === side;
    return (
        '<div class="vis-cmp-side' + (active ? " active" : "") + '" data-action="vis-side" data-side="' + side + '">' +
        '<div class="vis-stage vis-stage--cmp">' +
        '<div class="vis-fabric-layer" id="vis-cmp-base-' + side + '" style="background-image:url(' + getFabricTile(key) + ')"></div>' +
        '<div class="vis-fabric-layer" id="vis-cmp-fade-' + side + '"></div>' +
        getVisualiserShirtOverlaySVG() +
        getVisualiserJacketSVG() +
        "</div>" +
        '<div class="vis-cmp-tag">' + (active ? "Now dressing" : "Tap to dress") + "</div>" +
        "</div>"
    );
}

function renderClothCompare(aKey, recommended) {
    var bKey = appState.visFabricKeyB || visDefaultCompareKey(aKey);
    var side = appState.visCompareSide === "a" ? "a" : "b";
    var selKey = side === "a" ? aKey : bKey;
    var altKey = side === "a" ? bKey : aKey;

    return (
        '<div class="vis-shell">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
        "<h1 class=\"vis-title\">Two Cloths, One Decision</h1>" +
        '<p class="vis-lead">Tap a garment to choose a side, then tap a cloth from the bunch to dress it.</p>' +
        '<div class="vis-compare-grid">' +
        getVisCompareStageHTML("a", aKey) +
        getVisCompareStageHTML("b", bKey) +
        '<div class="vis-info vis-info--cmp" id="vis-info-a">' + getFabricInfoHTML(getFabricByKey(aKey)) + "</div>" +
        '<div class="vis-info vis-info--cmp" id="vis-info-b">' + getFabricInfoHTML(getFabricByKey(bKey)) + "</div>" +
        "</div>" +
        '<div class="vis-swatch-tray">' + getVisSwatchesHTML(recommended, selKey, altKey) + "</div>" +
        getVisRecoStripHTML(recommended) +
        '<button class="vis-mode-toggle" data-action="vis-compare-toggle">&larr; Back to one cloth</button>' +
        '<div class="vis-footnote">Preview woven from placeholder textures. Final renders will use photographed cloth.</div>' +
        '<div class="nav-buttons"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
        "</div>"
    );
}

function getFabricInfoHTML(fabric) {
    // The mill name taps through to its marker on the Mill Map.
    var millSpec =
        typeof getMillPinByName === "function" && getMillPinByName(fabric.mill)
            ? '<button class="vis-spec vis-spec-link" data-action="mill-map-focus" data-mill="' + fabric.mill + '">' + fabric.mill + "</button>"
            : '<span class="vis-spec">' + fabric.mill + "</span>";
    return (
        '<div class="vis-info-head">' +
        '<h2 class="vis-fabric-name">' + fabric.name + "</h2>" +
        '<div class="vis-fabric-specs">' +
        millSpec +
        '<span class="vis-spec-divider"></span>' +
        '<span class="vis-spec">' + fabric.composition + "</span>" +
        '<span class="vis-spec-divider"></span>' +
        '<span class="vis-spec">' + fabric.weight + "</span>" +
        "</div>" +
        "</div>" +
        '<p class="vis-fabric-character">' + fabric.character + "</p>" +
        '<button class="vis-guide-link" data-action="result-link" data-path=\'' +
        JSON.stringify(fabric.guidePath) +
        "'>Read about this cloth &rarr;</button>"
    );
}

// Crossfade a stage's paired fabric layers to a new cloth.
function visCrossfade(baseId, fadeId, key) {
    var a = document.getElementById(baseId);
    var b = document.getElementById(fadeId);
    if (!a || !b) return;

    var tile = getFabricTile(key);
    b.style.transition = "none";
    b.style.opacity = "0";
    b.style.backgroundImage = "url(" + tile + ")";
    // force reflow so the transition below actually runs
    void b.offsetWidth;
    b.style.transition = "opacity 0.45s ease";
    b.style.opacity = "1";

    setTimeout(function () {
        a.style.backgroundImage = "url(" + tile + ")";
        b.style.transition = "none";
        b.style.opacity = "0";
    }, 480);
}

function visSyncSwatchMarks(selKey, altKey) {
    var swatches = document.querySelectorAll(".vis-swatch");
    for (var i = 0; i < swatches.length; i++) {
        var k = swatches[i].getAttribute("data-fabric");
        var isReco = swatches[i].className.indexOf("reco") !== -1;
        swatches[i].className =
            "vis-swatch" +
            (isReco ? " reco" : "") +
            (k === selKey ? " sel" : altKey && k === altKey ? " sel-alt" : "");
    }
}

// Partial DOM update on swatch tap — crossfades the fabric
// layers instead of re-rendering the whole view.
function visApplyFabric(key) {
    visCrossfade("vis-fabric-a", "vis-fabric-b", key);
    var info = document.getElementById("vis-info");
    if (info) info.innerHTML = getFabricInfoHTML(getFabricByKey(key));
    visSyncSwatchMarks(key, null);
}

// Compare mode: dress one side. Call after appState is updated.
function visApplyCompareFabric(side, key) {
    visCrossfade("vis-cmp-base-" + side, "vis-cmp-fade-" + side, key);
    var info = document.getElementById("vis-info-" + side);
    if (info) info.innerHTML = getFabricInfoHTML(getFabricByKey(key));
    var otherKey = side === "a" ? appState.visFabricKeyB : appState.visFabricKey;
    visSyncSwatchMarks(key, otherKey);
}

// Compare mode: switch which side the next swatch tap dresses.
function visSetCompareSide(side) {
    var sides = document.querySelectorAll(".vis-cmp-side");
    for (var i = 0; i < sides.length; i++) {
        var isActive = sides[i].getAttribute("data-side") === side;
        sides[i].className = "vis-cmp-side" + (isActive ? " active" : "");
        var tag = sides[i].querySelector(".vis-cmp-tag");
        if (tag) tag.textContent = isActive ? "Now dressing" : "Tap to dress";
    }
    var selKey = side === "a" ? appState.visFabricKey : appState.visFabricKeyB;
    var altKey = side === "a" ? appState.visFabricKeyB : appState.visFabricKey;
    visSyncSwatchMarks(selKey, altKey);
}

// ============================================
// ENSEMBLE GARMENT ART (redesigned parametric SVG)
// ============================================

var DS_JACKET_BODY =
    "M220 52 " +
    "C204 52 196 58 190 62 " +
    "C168 66 150 74 143 86 " +
    "C130 108 122 150 119 196 C116 240 114 300 113 360 C112 410 112 452 116 466 " +
    "C118 474 126 478 138 479 C148 480 156 477 157 468 " +
    "L160 380 L163 300 L160 210 " +
    "C163 246 167 270 170 292 C172 306 173 330 173 356 " +
    "L173 480 C173 494 180 500 194 501 L246 501 C260 500 267 494 267 480 " +
    "L267 356 C267 330 268 306 270 292 C273 270 277 246 280 210 " +
    "L277 300 L280 380 L283 468 " +
    "C284 477 292 480 302 479 C314 478 322 474 324 466 " +
    "C328 452 328 410 327 360 C326 300 324 240 321 196 C318 150 310 108 297 86 " +
    "C290 74 272 66 250 62 " +
    "C244 58 236 52 220 52 Z";

// Parametric jacket shading. clipId lets other views (e.g. the
// Cloth Room) reuse this artwork with their own clip reference.
function getDSJacketShadingSVG(style, clipId) {
    clipId = clipId || "ds-clip-jacket";
    var isDB = style.closure === "db";
    var isPeak = style.lapel === "peak";

    // Lapels: collar runs from the neck to the gorge; the lapel
    // rolls from the gorge down to the top button stance.
    var lapels;
    if (isPeak) {
        lapels =
            // collar
            '<path d="M212 62 C200 70 190 84 183 102 L206 112 C210 96 214 80 218 68 Z" fill="#dcdcdc" opacity="0.9"/>' +
            '<path d="M228 62 C240 70 250 84 257 102 L234 112 C230 96 226 80 222 68 Z" fill="#cfcfcf" opacity="0.9"/>' +
            // peak tips sweeping up-out
            '<path d="M183 102 C172 100 160 94 154 88 C158 102 162 110 168 118 L200 300 L214 306 L206 112 Z" fill="#fbfbfb" opacity="0.97"/>' +
            '<path d="M257 102 C268 100 280 94 286 88 C282 102 278 110 272 118 L240 300 L226 306 L234 112 Z" fill="#dedede" opacity="0.97"/>' +
            // roll-line shadows
            '<path d="M168 118 L200 300" stroke="#8a8a8a" stroke-width="2" opacity="0.4" fill="none"/>' +
            '<path d="M272 118 L240 300" stroke="#8a8a8a" stroke-width="2" opacity="0.4" fill="none"/>';
    } else {
        lapels =
            // collar
            '<path d="M212 62 C200 70 190 84 184 100 L204 110 C209 94 214 78 218 68 Z" fill="#dcdcdc" opacity="0.9"/>' +
            '<path d="M228 62 C240 70 250 84 256 100 L236 110 C231 94 226 78 222 68 Z" fill="#cfcfcf" opacity="0.9"/>' +
            // notch gap then lapel body widening to mid-chest, rolling to stance
            '<path d="M188 112 C178 122 172 140 171 158 C170 190 182 240 200 300 L214 306 L204 110 Z" fill="#fbfbfb" opacity="0.97"/>' +
            '<path d="M252 112 C262 122 268 140 269 158 C270 190 258 240 240 300 L226 306 L236 110 Z" fill="#dedede" opacity="0.97"/>' +
            // notch cut shadows
            '<path d="M184 100 L188 112 L204 110 Z" fill="#a8a8a8" opacity="0.7"/>' +
            '<path d="M256 100 L252 112 L236 110 Z" fill="#9c9c9c" opacity="0.7"/>' +
            '<path d="M171 158 C170 190 182 240 200 300" stroke="#6e6e6e" stroke-width="2.2" opacity="0.6" fill="none"/>' +
            '<path d="M269 158 C270 190 258 240 240 300" stroke="#6e6e6e" stroke-width="2.2" opacity="0.6" fill="none"/>';
    }

    var buttons = "";
    var frontTreatment;
    if (isDB) {
        var bx = [197, 243];
        var by = [304, 340, 376];
        for (var c = 0; c < 2; c++) {
            for (var r = 0; r < 3; r++) {
                buttons +=
                    '<circle cx="' + bx[c] + '" cy="' + by[r] + '" r="6" fill="#4c4c4c"/>' +
                    '<circle cx="' + bx[c] + '" cy="' + by[r] + '" r="6" fill="none" stroke="#2e2e2e" stroke-width="1.2"/>';
            }
        }
        frontTreatment =
            '<path d="M254 302 L206 306 L204 494 L250 494 Z" fill="#ededed" opacity="0.25"/>' +
            '<path d="M206 306 C205 370 204 440 204 494" stroke="#8a8a8a" stroke-width="1.8" fill="none" opacity="0.5"/>';
    } else {
        buttons =
            '<circle cx="219" cy="304" r="6" fill="#4c4c4c"/>' +
            '<circle cx="219" cy="304" r="6" fill="none" stroke="#2e2e2e" stroke-width="1.2"/>' +
            '<circle cx="219" cy="342" r="6" fill="#4c4c4c"/>' +
            '<circle cx="219" cy="342" r="6" fill="none" stroke="#2e2e2e" stroke-width="1.2"/>' +
            // cuff buttons
            '<circle cx="146" cy="452" r="3.4" fill="#4c4c4c"/>' +
            '<circle cx="146" cy="462" r="3.4" fill="#4c4c4c"/>' +
            '<circle cx="294" cy="452" r="3.4" fill="#4c4c4c"/>' +
            '<circle cx="294" cy="462" r="3.4" fill="#4c4c4c"/>';
        frontTreatment =
            // centre-front seam and softly cutaway quarters
            '<path d="M219 306 L221 306 L221 350 L220 354 L219 350 Z" fill="#8f8f8f" opacity="0.6"/>' +
            '<path d="M220 354 C214 400 208 452 202 494 L220 496 L238 494 C232 452 226 400 220 354 Z" fill="#a8a8a8" opacity="0.35"/>' +
            '<path d="M220 354 C214 400 208 452 202 494" stroke="#8a8a8a" stroke-width="1.6" fill="none" opacity="0.5"/>' +
            '<path d="M220 354 C226 400 232 452 238 494" stroke="#979797" stroke-width="1.3" fill="none" opacity="0.4"/>';
    }

    var pockets;
    if (style.pockets === "jetted") {
        pockets =
            '<path d="M142 386 L192 391" stroke="#6e6e6e" stroke-width="3.5" opacity="0.6" stroke-linecap="round"/>' +
            '<path d="M248 391 L298 386" stroke="#6e6e6e" stroke-width="3.5" opacity="0.6" stroke-linecap="round"/>';
    } else if (style.pockets === "patch") {
        pockets =
            '<path d="M140 382 C140 380 142 379 144 379 L190 384 C192 384 193 386 193 388 L191 432 C191 434 189 435 187 435 L143 430 C141 430 140 428 140 426 Z" fill="none" stroke="#7d7d7d" stroke-width="2.2" opacity="0.7"/>' +
            '<path d="M250 384 L296 379 C298 379 300 380 300 382 L300 426 C300 428 299 430 297 430 L253 435 C251 435 249 434 249 432 L247 388 C247 386 248 384 250 384 Z" fill="none" stroke="#7d7d7d" stroke-width="2.2" opacity="0.7"/>';
    } else {
        pockets =
            '<path d="M140 383 L193 388 L192 404 C192 406 190 407 188 407 L143 402 C141 402 140 400 140 398 Z" fill="#cccccc" opacity="0.85"/>' +
            '<path d="M140 383 L193 388" stroke="#7d7d7d" stroke-width="2" opacity="0.6"/>' +
            '<path d="M247 388 L300 383 L300 398 C300 400 299 402 297 402 L252 407 C250 407 248 406 248 404 Z" fill="#c4c4c4" opacity="0.85"/>' +
            '<path d="M247 388 L300 383" stroke="#7d7d7d" stroke-width="2" opacity="0.6"/>';
    }

    return (
        '<svg class="ds-shading" viewBox="0 0 440 540" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
        "<defs>" +
        '<clipPath id="' + clipId + '" clipPathUnits="objectBoundingBox"><path transform="scale(0.00227273 0.00185185)" d="' + DS_JACKET_BODY + '"/></clipPath>' +
        '<linearGradient id="ds-jkt-body" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#9a9a9a"/><stop offset="0.10" stop-color="#cfcfcf"/>' +
        '<stop offset="0.30" stop-color="#f6f6f6"/><stop offset="0.5" stop-color="#ffffff"/>' +
        '<stop offset="0.70" stop-color="#f0f0f0"/><stop offset="0.90" stop-color="#c7c7c7"/>' +
        '<stop offset="1" stop-color="#949494"/>' +
        "</linearGradient>" +
        '<linearGradient id="ds-jkt-sleeve-l" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#a8a8a8"/><stop offset="0.45" stop-color="#e8e8e8"/>' +
        '<stop offset="1" stop-color="#c2c2c2"/>' +
        "</linearGradient>" +
        '<linearGradient id="ds-jkt-sleeve-r" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#c2c2c2"/><stop offset="0.55" stop-color="#e8e8e8"/>' +
        '<stop offset="1" stop-color="#a8a8a8"/>' +
        "</linearGradient>" +
        '<radialGradient id="ds-jkt-chest" cx="0.5" cy="0.32" r="0.55">' +
        '<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>' +
        "</radialGradient>" +
        "</defs>" +
        '<g clip-path="url(#' + clipId + ')">' +
        '<rect width="440" height="540" fill="url(#ds-jkt-body)"/>' +
        '<rect width="440" height="540" fill="url(#ds-jkt-chest)" opacity="0.5"/>' +
        // sleeves as soft panels with their own light
        '<path d="M143 86 C130 108 122 150 119 196 C116 240 114 300 113 360 C112 410 112 452 116 466 C118 474 126 478 138 479 C148 480 156 477 157 468 L160 380 L163 300 L160 210 L158 150 C157 120 152 98 143 86 Z" fill="url(#ds-jkt-sleeve-l)" opacity="0.85"/>' +
        '<path d="M297 86 C310 108 318 150 321 196 C324 240 326 300 327 360 C328 410 328 452 324 466 C322 474 314 478 302 479 C292 480 284 477 283 468 L280 380 L277 300 L280 210 L282 150 C283 120 288 98 297 86 Z" fill="url(#ds-jkt-sleeve-r)" opacity="0.85"/>' +
        // armhole seams (soft double line)
        '<path d="M160 210 L158 150 C157 120 152 98 143 86" stroke="#7f7f7f" stroke-width="2.2" fill="none" opacity="0.5"/>' +
        '<path d="M280 210 L282 150 C283 120 288 98 297 86" stroke="#7f7f7f" stroke-width="2.2" fill="none" opacity="0.5"/>' +
        // shoulder-seam shadows
        '<path d="M190 62 C168 66 150 74 143 86" stroke="#8f8f8f" stroke-width="2.5" fill="none" opacity="0.4"/>' +
        '<path d="M250 62 C272 66 290 74 297 86" stroke="#8f8f8f" stroke-width="2.5" fill="none" opacity="0.4"/>' +
        // side-body drape shadows (waist suppression)
        '<path d="M180 220 C176 280 177 360 182 460" stroke="#adadad" stroke-width="7" fill="none" opacity="0.28"/>' +
        '<path d="M260 220 C264 280 263 360 258 460" stroke="#adadad" stroke-width="7" fill="none" opacity="0.28"/>' +
        // chest welt pocket
        '<path d="M170 196 L204 200 L203 206 L170 202 Z" fill="#8a8a8a" opacity="0.55"/>' +
        lapels +
        frontTreatment +
        pockets +
        buttons +
        // cuff seams
        '<path d="M118 452 C128 456 146 458 156 456" stroke="#8a8a8a" stroke-width="1.8" fill="none" opacity="0.45"/>' +
        '<path d="M322 452 C312 456 294 458 284 456" stroke="#8a8a8a" stroke-width="1.8" fill="none" opacity="0.45"/>' +
        // hem shadow
        '<path d="M173 490 C190 498 250 498 267 490 L267 502 L173 502 Z" fill="#8f8f8f" opacity="0.3"/>' +
        "</g>" +
        '<path d="' + DS_JACKET_BODY + '" fill="none" stroke="#4a443a" stroke-width="1.6" opacity="0.55"/>' +
        "</svg>"
    );
}

// Opaque shirt V (not multiply-blended) — sits between the fabric
// and the shading so the open front reads as shirt, not cloth.
function getDSJacketShirtSVG(style) {
    var isDB = style.closure === "db";
    if (isDB) {
        // DB closes high: just a sliver of shirt and collar
        return (
            '<svg class="ds-overlay" viewBox="0 0 440 540" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
            '<path d="M220 64 L206 84 L216 300 L220 306 L224 300 L234 84 Z" fill="#f8f5ef"/>' +
            '<path d="M220 64 L206 84 L217 100 L220 82 Z" fill="#eceae2"/>' +
            '<path d="M220 64 L234 84 L223 100 L220 82 Z" fill="#e4e2da"/>' +
            "</svg>"
        );
    }
    return (
        '<svg class="ds-overlay" viewBox="0 0 440 540" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
        '<path d="M220 64 L202 86 L215 302 L220 308 L225 302 L238 86 Z" fill="#f8f5ef"/>' +
        '<path d="M220 64 L202 86 L215 104 L220 82 Z" fill="#eceae2"/>' +
        '<path d="M220 64 L238 86 L225 104 L220 82 Z" fill="#e4e2da"/>' +
        '<path d="M220 106 L220 300" stroke="#dcd7cd" stroke-width="1.8" fill="none"/>' +
        '<path d="M202 86 L215 302 L212 302 L199 90 Z" fill="#cfcabe" opacity="0.65"/>' +
        '<path d="M238 86 L225 302 L228 302 L241 90 Z" fill="#cfcabe" opacity="0.65"/>' +
        "</svg>"
    );
}

var DS_VEST_BODY =
    "M220 20 " +
    "C210 20 202 24 196 28 " +
    "C182 32 170 38 165 46 " +
    "C158 60 154 88 152 120 C150 156 149 210 150 260 C150 292 152 310 155 318 " +
    "L192 336 C198 338 202 336 204 330 L216 296 L220 292 L224 296 L236 330 " +
    "C238 336 242 338 248 336 L285 318 " +
    "C288 310 290 292 290 260 C291 210 290 156 288 120 C286 88 282 60 275 46 " +
    "C270 38 258 32 244 28 " +
    "C238 24 230 20 220 20 Z";

function getDSVestShadingSVG() {
    return (
        '<svg class="ds-shading" viewBox="0 0 440 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
        "<defs>" +
        '<clipPath id="ds-clip-vest" clipPathUnits="objectBoundingBox"><path transform="scale(0.00227273 0.00277778)" d="' + DS_VEST_BODY + '"/></clipPath>' +
        '<linearGradient id="ds-vest-body" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#9d9d9d"/><stop offset="0.22" stop-color="#ededed"/>' +
        '<stop offset="0.5" stop-color="#fbfbfb"/><stop offset="0.78" stop-color="#e6e6e6"/>' +
        '<stop offset="1" stop-color="#979797"/>' +
        "</linearGradient>" +
        "</defs>" +
        '<g clip-path="url(#ds-clip-vest)">' +
        '<rect width="440" height="360" fill="url(#ds-vest-body)"/>' +
        // armhole shadows
        '<path d="M165 46 C158 60 154 88 152 120 C160 96 166 66 172 50 Z" fill="#8f8f8f" opacity="0.4"/>' +
        '<path d="M275 46 C282 60 286 88 288 120 C280 96 274 66 268 50 Z" fill="#868686" opacity="0.4"/>' +
        // side drape
        '<path d="M170 120 C167 180 167 250 172 310" stroke="#ababab" stroke-width="6" fill="none" opacity="0.3"/>' +
        '<path d="M270 120 C273 180 273 250 268 310" stroke="#ababab" stroke-width="6" fill="none" opacity="0.3"/>' +
        // front edges toward the points
        '<path d="M212 88 L216 292 L220 292" stroke="#828282" stroke-width="1.8" fill="none" opacity="0.5"/>' +
        '<path d="M228 88 L224 292 L220 292" stroke="#909090" stroke-width="1.4" fill="none" opacity="0.4"/>' +
        // welt pockets
        '<path d="M168 252 L202 256 L201 264 L168 260 Z" fill="#8a8a8a" opacity="0.6"/>' +
        '<path d="M238 256 L272 252 L272 260 L239 264 Z" fill="#8a8a8a" opacity="0.6"/>' +
        // buttons down the front edge
        '<circle cx="220" cy="180" r="4.6" fill="#4c4c4c"/>' +
        '<circle cx="220" cy="206" r="4.6" fill="#4c4c4c"/>' +
        '<circle cx="220" cy="232" r="4.6" fill="#4c4c4c"/>' +
        '<circle cx="220" cy="258" r="4.6" fill="#4c4c4c"/>' +
        '<circle cx="220" cy="282" r="4.6" fill="#4c4c4c"/>' +
        // point shadows at the hem
        '<path d="M155 318 L192 336 L194 322 L160 306 Z" fill="#8a8a8a" opacity="0.3"/>' +
        '<path d="M285 318 L248 336 L246 322 L280 306 Z" fill="#8a8a8a" opacity="0.3"/>' +
        "</g>" +
        '<path d="' + DS_VEST_BODY + '" fill="none" stroke="#4a443a" stroke-width="1.6" opacity="0.55"/>' +
        "</svg>"
    );
}

// Opaque shirt in the vest V
function getDSVestShirtSVG() {
    return (
        '<svg class="ds-overlay" viewBox="0 0 440 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
        '<path d="M220 24 L196 40 L212 88 L216 170 L220 176 L224 170 L228 88 L244 40 Z" fill="#f8f5ef"/>' +
        '<path d="M220 24 L196 40 L214 56 L220 36 Z" fill="#eceae2"/>' +
        '<path d="M220 24 L244 40 L226 56 L220 36 Z" fill="#e4e2da"/>' +
        '<path d="M212 88 L216 170 L214 170 L209 92 Z" fill="#cfcabe" opacity="0.6"/>' +
        '<path d="M228 88 L224 170 L226 170 L231 92 Z" fill="#cfcabe" opacity="0.6"/>' +
        "</svg>"
    );
}

var DS_TROUSER_BODY =
    "M152 16 L288 16 " +
    "C292 16 294 18 294 22 L296 44 " +
    "C294 90 290 150 286 210 C282 280 278 350 275 404 C274 412 269 416 260 416 L230 416 C223 416 220 412 220 405 " +
    "L221 260 L220 170 L219 260 L220 405 " +
    "C220 412 217 416 210 416 L180 416 C171 416 166 412 165 404 " +
    "C162 350 158 280 154 210 C150 150 146 90 144 44 L146 22 " +
    "C146 18 148 16 152 16 Z";

function getDSTrouserShadingSVG() {
    return (
        '<svg class="ds-shading" viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
        "<defs>" +
        '<clipPath id="ds-clip-trousers" clipPathUnits="objectBoundingBox"><path transform="scale(0.00227273 0.00227273)" d="' + DS_TROUSER_BODY + '"/></clipPath>' +
        '<linearGradient id="ds-trs-leg-l" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#939393"/><stop offset="0.35" stop-color="#f4f4f4"/>' +
        '<stop offset="0.62" stop-color="#e8e8e8"/><stop offset="1" stop-color="#9d9d9d"/>' +
        "</linearGradient>" +
        '<linearGradient id="ds-trs-leg-r" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#9d9d9d"/><stop offset="0.38" stop-color="#e8e8e8"/>' +
        '<stop offset="0.65" stop-color="#f4f4f4"/><stop offset="1" stop-color="#939393"/>' +
        "</linearGradient>" +
        "</defs>" +
        '<g clip-path="url(#ds-clip-trousers)">' +
        // legs shaded independently
        '<path d="M144 44 L220 44 L220 416 L165 416 Z" fill="url(#ds-trs-leg-l)"/>' +
        '<path d="M220 44 L296 44 L275 416 L220 416 Z" fill="url(#ds-trs-leg-r)"/>' +
        // waistband
        '<rect x="140" y="16" width="160" height="30" fill="#d6d6d6"/>' +
        '<path d="M144 46 L296 46" stroke="#767676" stroke-width="2" opacity="0.55"/>' +
        '<rect x="160" y="24" width="18" height="7" rx="2" fill="#9c9c9c" opacity="0.7"/>' +
        '<rect x="262" y="24" width="18" height="7" rx="2" fill="#9c9c9c" opacity="0.7"/>' +
        '<circle cx="220" cy="30" r="4.2" fill="#4c4c4c"/>' +
        // fly
        '<path d="M220 46 C217 70 216 100 217 140" stroke="#828282" stroke-width="1.8" opacity="0.5" fill="none"/>' +
        // rise shadow between the legs
        '<path d="M220 170 L219 260 L220 405 L221 260 Z" fill="#6e6e6e" opacity="0.7"/>' +
        '<path d="M214 150 C212 240 213 330 215 400" stroke="#9a9a9a" stroke-width="5" opacity="0.35" fill="none"/>' +
        '<path d="M226 150 C228 240 227 330 225 400" stroke="#9a9a9a" stroke-width="5" opacity="0.35" fill="none"/>' +
        // centre creases: highlight beside soft shadow
        '<path d="M182 60 C180 180 180 320 181 410" stroke="#ffffff" stroke-width="2.6" opacity="0.7" fill="none"/>' +
        '<path d="M185 60 C183 180 183 320 184 410" stroke="#8f8f8f" stroke-width="2" opacity="0.35" fill="none"/>' +
        '<path d="M258 60 C260 180 260 320 259 410" stroke="#ffffff" stroke-width="2.6" opacity="0.7" fill="none"/>' +
        '<path d="M255 60 C257 180 257 320 256 410" stroke="#8f8f8f" stroke-width="2" opacity="0.35" fill="none"/>' +
        // side pockets
        '<path d="M150 52 C156 68 162 84 168 98" stroke="#7a7a7a" stroke-width="2.2" opacity="0.55" fill="none"/>' +
        '<path d="M290 52 C284 68 278 84 272 98" stroke="#7a7a7a" stroke-width="2.2" opacity="0.55" fill="none"/>' +
        // knee light
        '<ellipse cx="182" cy="260" rx="26" ry="70" fill="#ffffff" opacity="0.25"/>' +
        '<ellipse cx="258" cy="260" rx="26" ry="70" fill="#ffffff" opacity="0.25"/>' +
        // hem shadows
        '<path d="M165 402 L220 404 L220 416 L165 416 Z" fill="#8a8a8a" opacity="0.35"/>' +
        '<path d="M220 404 L275 402 L275 416 L220 416 Z" fill="#828282" opacity="0.35"/>' +
        "</g>" +
        '<path d="' + DS_TROUSER_BODY + '" fill="none" stroke="#4a443a" stroke-width="1.6" opacity="0.55"/>' +
        "</svg>"
    );
}

// ============================================
// CLOTH ROOM — ENSEMBLE MODE ("Design an outfit")
// Third mode alongside single-cloth and compare
// (toggled by appState.visEnsemble). A full three-piece:
// jacket, vest, and trousers, each cloth-swappable from
// the bunch, plus jacket style options (closure / lapel /
// pockets). Garment art above is parametric SVG — style
// combinations need no artwork assets.
// ============================================

var VIS_ENS_GARMENTS = ["jacket", "vest", "trousers"];

var VIS_ENS_STYLE_OPTIONS = {
    closure: [
        { key: "sb", label: "Single Breasted" },
        { key: "db", label: "Double Breasted" }
    ],
    lapel: [
        { key: "notch", label: "Notch Lapel" },
        { key: "peak", label: "Peak Lapel" }
    ],
    pockets: [
        { key: "flap", label: "Flap Pockets" },
        { key: "jetted", label: "Jetted Pockets" },
        { key: "patch", label: "Patch Pockets" }
    ]
};

function getVisEnsembleState() {
    if (!appState.visEnsembleState || typeof appState.visEnsembleState !== "object") {
        var recos = getRecommendedFabricKeys();
        appState.visEnsembleState = {
            activeGarment: "jacket",
            fabrics: {
                jacket: recos.length ? recos[0] : FABRIC_LIBRARY[0].key,
                vest: "wool_silk_linen",
                trousers: "worsted_wool"
            },
            style: { closure: "sb", lapel: "notch", pockets: "flap" }
        };
    }
    return appState.visEnsembleState;
}

function getVisEnsGarmentBlock(garment, ens) {
    var fabricKey = ens.fabrics[garment];
    var shading;
    var shirtOverlay = "";
    if (garment === "jacket") {
        shading = getDSJacketShadingSVG(ens.style);
        shirtOverlay = getDSJacketShirtSVG(ens.style);
    } else if (garment === "vest") {
        shading = getDSVestShadingSVG();
        shirtOverlay = getDSVestShirtSVG();
    } else {
        shading = getDSTrouserShadingSVG();
    }

    var activeClass = ens.activeGarment === garment ? " active" : "";
    var label = garment.charAt(0).toUpperCase() + garment.slice(1);
    return (
        '<div class="ds-garment ds-garment--' + garment + activeClass + '" data-action="vis-ens-garment" data-garment="' + garment + '">' +
        '<div class="ds-fabric-layer" id="vis-ens-fabric-' + garment + '" style="background-image:url(' + getFabricTile(fabricKey) + ');clip-path:url(#ds-clip-' + garment + ')"></div>' +
        shirtOverlay +
        shading +
        '<div class="ds-garment-label">' + label + "</div>" +
        "</div>"
    );
}

function renderClothEnsemble(recommended) {
    var ens = getVisEnsembleState();
    var activeFabric = getFabricByKey(ens.fabrics[ens.activeGarment]);

    var tabsHTML = '<div class="ds-tabs">';
    for (var g = 0; g < VIS_ENS_GARMENTS.length; g++) {
        var gar = VIS_ENS_GARMENTS[g];
        tabsHTML +=
            '<button class="ds-tab' + (ens.activeGarment === gar ? " sel" : "") + '" data-action="vis-ens-garment" data-garment="' + gar + '">' +
            gar.charAt(0).toUpperCase() + gar.slice(1) +
            "</button>";
    }
    tabsHTML += "</div>";

    var swatchesHTML =
        '<div class="vis-swatch-tray ds-swatch-tray">' +
        getVisSwatchesHTML(recommended, ens.fabrics[ens.activeGarment], null) +
        "</div>";

    var styleHTML = "";
    if (ens.activeGarment === "jacket") {
        styleHTML = '<div class="ds-style-menu">';
        for (var groupKey in VIS_ENS_STYLE_OPTIONS) {
            if (!VIS_ENS_STYLE_OPTIONS.hasOwnProperty(groupKey)) continue;
            var opts = VIS_ENS_STYLE_OPTIONS[groupKey];
            styleHTML += '<div class="ds-style-group">';
            for (var o = 0; o < opts.length; o++) {
                var isSel = ens.style[groupKey] === opts[o].key;
                styleHTML +=
                    '<button class="ds-style-opt' + (isSel ? " sel" : "") + '" data-action="vis-ens-style" data-group="' + groupKey + '" data-value="' + opts[o].key + '">' +
                    opts[o].label +
                    "</button>";
            }
            styleHTML += "</div>";
        }
        styleHTML += "</div>";
    }

    return (
        '<div class="vis-shell ds-shell">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
        "<h1 class=\"vis-title\">Design an Ensemble</h1>" +
        '<p class="vis-lead">Assign a cloth to each garment, shape the jacket, and take the finished design to your fitting.</p>' +
        '<div class="ds-stage" id="vis-ens-stage">' +
        '<div class="ds-stage-left">' + getVisEnsGarmentBlock("jacket", ens) + "</div>" +
        '<div class="ds-stage-right">' +
        getVisEnsGarmentBlock("vest", ens) +
        getVisEnsGarmentBlock("trousers", ens) +
        "</div>" +
        "</div>" +
        tabsHTML +
        swatchesHTML +
        getVisRecoStripHTML(recommended) +
        styleHTML +
        '<div class="ds-selected-cloth" id="vis-ens-selected">' + getVisEnsSelectedHTML(activeFabric) + "</div>" +
        '<div class="ds-actions">' +
        '<button class="arch-btn-fill" data-action="vis-ens-export">Export Design Spec</button>' +
        '<button class="arch-btn-stroke" data-action="vis-ens-share">Share to Phone</button>' +
        "</div>" +
        '<button class="vis-mode-toggle" data-action="vis-ensemble-toggle">&larr; Back to one cloth</button>' +
        '<div class="vis-footnote">Preview woven from placeholder textures. Final renders will use photographed cloth.</div>' +
        '<div class="nav-buttons"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
        "</div>"
    );
}

function getVisEnsSelectedHTML(fabric) {
    var millSpec =
        typeof getMillPinByName === "function" && getMillPinByName(fabric.mill)
            ? '<button class="vis-spec vis-spec-link" data-action="mill-map-focus" data-mill="' + fabric.mill + '">' + fabric.mill + "</button>"
            : '<span class="vis-spec">' + fabric.mill + "</span>";
    return (
        millSpec +
        '<span class="vis-spec-divider"></span>' +
        '<span class="ds-selected-name">' + fabric.name + "</span>"
    );
}

// Partial DOM update: dress the active garment, crossfade in place.
function visEnsApplyFabric(fabricKey) {
    var ens = getVisEnsembleState();
    ens.activeGarment = ens.activeGarment || "jacket";
    ens.fabrics[ens.activeGarment] = fabricKey;
    var layer = document.getElementById("vis-ens-fabric-" + ens.activeGarment);
    if (layer) layer.style.backgroundImage = "url(" + getFabricTile(fabricKey) + ")";
    visSyncSwatchMarks(fabricKey, null);
    var sel = document.getElementById("vis-ens-selected");
    if (sel) sel.innerHTML = getVisEnsSelectedHTML(getFabricByKey(fabricKey));
}

// ============================================
// ENSEMBLE — DESIGN SPEC EXPORT
// ============================================

function exportEnsembleSpec() {
    if (typeof html2canvas === "undefined" || typeof window.jspdf === "undefined") {
        alert("Export libraries not loaded. Please refresh and try again.");
        return;
    }
    var ens = getVisEnsembleState();
    var clientName = appState.clientName || "Client";
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var now = new Date();
    var dateLabel = now.getDate() + " " + months[now.getMonth()] + " " + now.getFullYear();

    var eyebrow = "font-size:11px; letter-spacing:0.3em; text-transform:uppercase; color:#a4a19c;";
    var serif = "font-family:'EB Garamond',Georgia,serif;";

    function garmentRow(garment) {
        var f = getFabricByKey(ens.fabrics[garment]);
        var styleNote = "";
        if (garment === "jacket") {
            var closure = ens.style.closure === "db" ? "Double breasted" : "Single breasted";
            var lapel = ens.style.lapel === "peak" ? "peak lapel" : "notch lapel";
            styleNote = closure + ", " + lapel + ", " + ens.style.pockets + " pockets";
        }
        return (
            '<div style="padding:20px 0; border-bottom:1px solid #ddd5c8;">' +
            '<div style="' + eyebrow + ' margin-bottom:6px;">' + garment + "</div>" +
            '<div style="' + serif + ' font-size:24px; font-style:italic; margin-bottom:4px;">' + f.name + "</div>" +
            '<div style="font-size:12px; color:#6b6155;">' + f.mill + " &nbsp;&middot;&nbsp; " + f.composition + " &nbsp;&middot;&nbsp; " + f.weight +
            (styleNote ? " &nbsp;&middot;&nbsp; " + styleNote : "") +
            "</div>" +
            "</div>"
        );
    }

    // Build the whole spec as ONE offscreen page and render it in a single
    // html2canvas pass (a live stage clone, not a re-rendered image — nesting
    // a second render around a data-URL image can stall). Mirrors the reliable
    // single-pass render the share path uses.
    var page = document.createElement("div");
    page.setAttribute(
        "style",
        "width:800px; padding:70px 80px; background:#faf8f3; font-family:Manrope,sans-serif; color:#2a2218; box-sizing:border-box;"
    );
    page.innerHTML =
        '<div style="' + serif + ' font-size:28px; text-align:center;">BBS</div>' +
        '<div style="' + eyebrow + ' text-align:center; margin:4px 0 40px;">Design Specification</div>' +
        '<div style="' + serif + ' font-size:40px; text-align:center; margin-bottom:4px;">' + clientName + "</div>" +
        '<div style="font-size:12px; color:#6b6155; text-align:center; margin-bottom:36px;">' + dateLabel + "</div>" +
        '<div class="ds-spec-stage-slot" style="display:flex; justify-content:center; margin-bottom:36px;"></div>' +
        garmentRow("jacket") +
        garmentRow("vest") +
        garmentRow("trousers") +
        '<div style="' + eyebrow + ' text-align:center; margin-top:50px;">Bring this specification to your fitting &mdash; benjaminbarkerstudios.com</div>';

    var liveStage = document.getElementById("vis-ens-stage");
    if (liveStage) {
        var stageClone = liveStage.cloneNode(true);
        stageClone.removeAttribute("id");
        stageClone.style.width = "540px";
        stageClone.style.maxWidth = "540px";
        stageClone.style.margin = "0";
        var slot = page.querySelector(".ds-spec-stage-slot");
        if (slot) slot.appendChild(stageClone);
    }

    var container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.appendChild(page);
    document.body.appendChild(container);

    renderElementToCanvas(page, { backgroundColor: "#faf8f3" })
        .then(function (canvas) {
            canvasToPDF(canvas, {
                orientation: "portrait",
                filename: "BBS-Design-Spec-" + clientName.replace(/\s+/g, "") + ".pdf"
            });
            document.body.removeChild(container);
        })
        .catch(function (err) {
            if (container.parentNode) document.body.removeChild(container);
            console.error("Design spec export failed:", err);
            alert("Could not generate the design spec. Please try again.");
        });
}

function shareEnsemble(btn) {
    var stage = document.getElementById("vis-ens-stage");
    if (!stage) return;
    if (!navigator.share || !navigator.canShare) {
        alert("Your device does not support native sharing. Please use Export Design Spec.");
        return;
    }
    renderElementToCanvas(stage, { backgroundColor: "#f4efe7", useCORS: true })
        .then(function (canvas) {
            shareCanvasAsPNG(canvas, {
                filename: "BBS-Design-" + (appState.clientName || "Client").replace(/\s+/g, "") + ".png"
            });
        })
        .catch(function (err) {
            console.error("Design share failed:", err);
            alert("Export failed. Please take a screenshot.");
        });
}
