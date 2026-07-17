// ============================================
// ARCHETYPE AVATARS — faceless tailoring busts
// ============================================
// One parameterized figure (mannequin-neutral, no face, bust crop),
// differentiated per archetype by garment style + palette:
//   style: "suit" (lapels + tie) | "odd" (lapels, pocket square)
//        | "casual" (collar band, no lapels) | "dinner" (lapels + bow)
// Real illustrations can still replace these wholesale via
// archetype.galleryImage — see getGalleryMarkHTML in app.js.

var AVATAR_SKIN = "#c9b8a3";
var AVATAR_SKIN_SHADE = "#b5a48f";

var ARCHETYPE_AVATARS = {
    v: { style: "odd", bg: "#dfe6ea", jacket: "#e4dbc8", shirt: "#faf7f0", accent: "#9fb9cf" },
    o: { style: "suit", bg: "#e9e2d6", jacket: "#3a3a3c", shirt: "#faf7f0", accent: "#5b6377" },
    c: { style: "odd", bg: "#e4e0d3", jacket: "#8a6a4f", shirt: "#efe7d6", accent: "#b45c39" },
    m: { style: "casual", bg: "#e7e3da", jacket: "#a8ab97", shirt: "#a8ab97", accent: "#87907c" },
    g: { style: "suit", bg: "#e6e0d2", jacket: "#2e3a52", shirt: "#faf7f0", accent: "#7d3b43" },
    q: { style: "suit", bg: "#e8e4dc", jacket: "#6f6e6a", shirt: "#f5f2ea", accent: "#8b8a84" },
    a: { style: "casual", bg: "#e2e2e0", jacket: "#3c3c3e", shirt: "#3c3c3e", accent: "#2c2c2e" },
    u: { style: "casual", bg: "#e5e2d4", jacket: "#6f7355", shirt: "#6f7355", accent: "#5b5f45" },
    t: { style: "odd", bg: "#dfe2e6", jacket: "#39445a", shirt: "#eef0f2", accent: "#c8ccd2" },
    s: { style: "casual", bg: "#e9e5db", jacket: "#d8d0bf", shirt: "#d8d0bf", accent: "#c4bca9" },
    r: { style: "odd", bg: "#e6e0d6", jacket: "#b3a18c", shirt: "#f7f3ea", accent: "#efe7d6" },
    e: { style: "odd", bg: "#e3ddd2", jacket: "#5d4a3a", shirt: "#efe7d6", accent: "#c29a33" },
    b: { style: "suit", bg: "#e0e4e0", jacket: "#cbb896", shirt: "#faf7f0", accent: "#6b5138" },
    h: { style: "suit", bg: "#e6dfd3", jacket: "#6b5138", shirt: "#efe7d6", accent: "#a4643f" },
    l: { style: "odd", bg: "#e2e0d5", jacket: "#6f7355", shirt: "#c29a33", accent: "#efe7d6" },
    x: { style: "casual", bg: "#e6e3dd", jacket: "#9a938a", shirt: "#9a938a", accent: "#847d74" },
    p: { style: "casual", bg: "#e0e2e4", jacket: "#5c6670", shirt: "#5c6670", accent: "#4a545e" },
    k: { style: "dinner", bg: "#e8e2d4", jacket: "#232324", shirt: "#faf7f0", accent: "#232324" },
    w: { style: "casual", bg: "#e9e4d6", jacket: "#9fb9cf", shirt: "#9fb9cf", accent: "#8aa5bc" },
    f: { style: "suit", bg: "#e4e2de", jacket: "#2b2b2e", shirt: "#f5f2ea", accent: "#9a9a98" },
    n: { style: "odd", bg: "#e5e0d4", jacket: "#a4643f", shirt: "#f7f3ea", accent: "#86b2d6" },
    d: { style: "suit", bg: "#e4e0d2", jacket: "#3f4a3f", shirt: "#f5f2ea", accent: "#6b5138" },
    y: { style: "odd", bg: "#e6e4de", jacket: "#8d8d85", shirt: "#f5f2ea", accent: "#f5f2ea" },
    z: { style: "odd", bg: "#e2e2d6", jacket: "#7a7f5e", shirt: "#efe7d6", accent: "#efe7d6" },
};

function shadeHex(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.max(0, Math.min(255, (n >> 16) + amt));
    var g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
    var b = Math.max(0, Math.min(255, (n & 255) + amt));
    return "#" + ("00000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
}

function getArchetypeAvatarSVG(key) {
    var cfg = ARCHETYPE_AVATARS[key];
    if (!cfg) cfg = { style: "odd", bg: "#e8e1da", jacket: "#8d8d85", shirt: "#f5f2ea", accent: "#efe7d6" };

    var jacketDark = shadeHex(cfg.jacket, -22);
    var svg = '<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
    svg += '<rect width="120" height="150" fill="' + cfg.bg + '"/>';

    // Neck + head (mannequin: no face, no hair — deliberately neutral)
    svg += '<rect x="54" y="34" width="12" height="12" fill="' + AVATAR_SKIN_SHADE + '"/>';
    svg += '<circle cx="60" cy="24" r="14" fill="' + AVATAR_SKIN + '"/>';

    // Torso silhouette (arms integrated, bust-cropped at the frame edge)
    svg += '<path d="M31,150 L31,84 C31,62 40,51 53,47 L60,53 L67,47 C80,51 89,62 89,84 L89,150 Z" fill="' +
        (cfg.style === "casual" ? cfg.shirt : cfg.jacket) + '"/>';

    if (cfg.style === "casual") {
        // Collar band + placket
        svg += '<path d="M52,46 L60,53 L68,46 L68,51 L60,58 L52,51 Z" fill="' + cfg.accent + '"/>';
        svg += '<rect x="59" y="56" width="2" height="16" fill="' + shadeHex(cfg.shirt, -18) + '"/>';
    } else {
        // Shirt V
        svg += '<path d="M51,47 L60,53 L69,47 L69,74 L60,80 L51,74 Z" fill="' + cfg.shirt + '"/>';
        // Lapels
        svg += '<path d="M51,47 L60,53 L60,80 L49,62 Z" fill="' + jacketDark + '"/>';
        svg += '<path d="M69,47 L60,53 L60,80 L71,62 Z" fill="' + jacketDark + '"/>';
        // Jacket closure line + buttons
        svg += '<rect x="59.4" y="80" width="1.2" height="70" fill="' + jacketDark + '"/>';
        svg += '<circle cx="60" cy="92" r="1.8" fill="' + jacketDark + '"/>';
        svg += '<circle cx="60" cy="104" r="1.8" fill="' + jacketDark + '"/>';

        if (cfg.style === "suit") {
            svg += '<path d="M57.5,56 L62.5,56 L61.5,80 L60,84 L58.5,80 Z" fill="' + cfg.accent + '"/>';
        } else if (cfg.style === "dinner") {
            svg += '<path d="M60,55 L52,51 L52,59 Z" fill="' + cfg.accent + '"/>';
            svg += '<path d="M60,55 L68,51 L68,59 Z" fill="' + cfg.accent + '"/>';
            svg += '<circle cx="60" cy="55" r="2" fill="' + cfg.accent + '"/>';
        }
        if (cfg.style === "odd" || cfg.style === "dinner") {
            // Pocket square, breast pocket
            svg += '<path d="M73,72 L81,72 L80,68 L77,70 L74,68 Z" fill="' + cfg.accent + '"/>';
            svg += '<rect x="73" y="72" width="8" height="2.4" fill="' + jacketDark + '"/>';
        }
    }

    svg += "</svg>";
    return svg;
}

window.getArchetypeAvatarSVG = getArchetypeAvatarSVG;
