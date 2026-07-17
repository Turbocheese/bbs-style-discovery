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

function renderFabricVisualiser() {
    var recommended = getRecommendedFabricKeys();
    var activeKey = appState.visFabricKey || (recommended.length ? recommended[0] : FABRIC_LIBRARY[0].key);
    var fabric = getFabricByKey(activeKey);

    var recoStripHTML = "";
    if (recommended.length && typeof archetypeProfiles !== "undefined") {
        var archetypeName = archetypeProfiles[appState.archetypeKey].name;
        recoStripHTML =
            '<div class="vis-reco-strip">Marked cloths are recommended for <em>' +
            archetypeName +
            "</em></div>";
    }

    var swatchesHTML = "";
    for (var i = 0; i < FABRIC_LIBRARY.length; i++) {
        var f = FABRIC_LIBRARY[i];
        var sel = f.key === activeKey ? " sel" : "";
        var reco = recommended.indexOf(f.key) !== -1 ? " reco" : "";
        swatchesHTML +=
            '<button class="vis-swatch' + sel + reco + '" data-action="vis-pick-fabric" data-fabric="' + f.key + '" aria-label="' + f.name + '" title="' + f.name + '">' +
            '<span class="vis-swatch-cloth" style="background-image:url(' + getFabricTile(f.key) + ')"></span>' +
            "</button>";
    }

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
        '<div class="vis-swatch-tray">' + swatchesHTML + "</div>" +
        recoStripHTML +
        '<div class="vis-info" id="vis-info">' + getFabricInfoHTML(fabric) + "</div>" +
        '<div class="vis-footnote">Preview woven from placeholder textures. Final renders will use photographed cloth.</div>' +
        '<div class="nav-buttons"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
        "</div>"
    );
}

function getFabricInfoHTML(fabric) {
    return (
        '<div class="vis-info-head">' +
        '<h2 class="vis-fabric-name">' + fabric.name + "</h2>" +
        '<div class="vis-fabric-specs">' +
        '<span class="vis-spec">' + fabric.mill + "</span>" +
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

// Partial DOM update on swatch tap — crossfades the fabric
// layers instead of re-rendering the whole view.
function visApplyFabric(key) {
    var a = document.getElementById("vis-fabric-a");
    var b = document.getElementById("vis-fabric-b");
    var info = document.getElementById("vis-info");
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

    if (info) info.innerHTML = getFabricInfoHTML(getFabricByKey(key));

    var swatches = document.querySelectorAll(".vis-swatch");
    for (var i = 0; i < swatches.length; i++) {
        var isSel = swatches[i].getAttribute("data-fabric") === key;
        var isReco = swatches[i].className.indexOf("reco") !== -1;
        swatches[i].className = "vis-swatch" + (isReco ? " reco" : "") + (isSel ? " sel" : "");
    }
}
