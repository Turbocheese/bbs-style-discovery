// ============================================
// BBS FABRIC VISUALISER — "The Cloth Room"
// Layered 2D technique: tiled fabric texture under a
// grayscale-shaded garment SVG (multiply blend).
// Tiles are rendered procedurally from each cloth's weave
// parameters by weave-engine.js; swap getFabricTile for a
// photographed swatch when photography lands.
// ============================================

// Cloth records live in cloth-data.js and tiles are rendered by
// weave-engine.js. FABRIC_LIBRARY is kept as the name the rest of
// this file and app.js already use, so the split did not ripple.
var FABRIC_LIBRARY = CLOTH_LIBRARY;

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
    // Matched on the cloth's guidePath, not its key. The original 14
    // cloths were keyed after their guide topic ("hopsack", "fresco"),
    // so comparing keys happened to work; with 100+ cloths named after
    // real bunches it silently returns nothing. The guide path is what
    // actually expresses "this cloth is that fabric".
    var keys = [];
    for (var i = 0; i < profile.exploreNext.length; i++) {
        var path = profile.exploreNext[i];
        if (path.length !== 3 || path[0] !== "fabrics" || path[1] !== "suiting") continue;
        for (var j = 0; j < FABRIC_LIBRARY.length; j++) {
            var gp = FABRIC_LIBRARY[j].guidePath;
            if (gp && gp.length === 3 && gp[2] === path[2]) keys.push(FABRIC_LIBRARY[j].key);
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
    // A hand-written drawTile still wins if a cloth ever needs one the
    // weave engine cannot express; none currently do.
    if (typeof fabric.drawTile === "function") fabric.drawTile(c.getContext("2d"));
    else drawClothTile(c.getContext("2d"), fabric);
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
    // Shares DS_JACKET_BODY with ensemble mode. It used to carry its own
    // near-duplicate path, so the two views drifted and the single-cloth
    // jacket kept the old cardigan silhouette after the ensemble one was
    // redrawn. One path, one jacket.
    var body = DS_JACKET_BODY;

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
// The second cloth in the split should CONTRAST with the first. Taking
// the next entry in the library gave two near-identical darks, so the
// divider appeared to do nothing on arrival — the feature looked broken
// when it was working perfectly.
function visDefaultCompareKey(aKey) {
    var a = getFabricByKey(aKey);

    // Measured on actual lightness, not on the colour_family label.
    // "black" and "charcoal" are different families but nearly the same
    // cloth to look at, so a name comparison still opened the split on
    // two near-identical darks.
    function lum(c) {
        var h = String(c.ground || "#808080").replace("#", "");
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }
    var aLum = lum(a);

    // A recommended cloth wins if it is clearly different to look at.
    var recommended = getRecommendedFabricKeys();
    for (var i = 0; i < recommended.length; i++) {
        var rc = getFabricByKey(recommended[i]);
        if (rc && rc.key !== aKey && Math.abs(lum(rc) - aLum) > 55) return rc.key;
    }

    // Otherwise the most visually distant cloth in the library.
    var best = null, bestGap = -1;
    for (var j = 0; j < FABRIC_LIBRARY.length; j++) {
        var c = FABRIC_LIBRARY[j];
        if (c.key === aKey) continue;
        var gap = Math.abs(lum(c) - aLum);
        if (gap > bestGap) { bestGap = gap; best = c; }
    }
    return best ? best.key : (FABRIC_LIBRARY[0].key === aKey ? FABRIC_LIBRARY[1].key : FABRIC_LIBRARY[0].key);
}

function getVisRecoStripHTML(recommended) {
    if (!recommended.length || typeof archetypeProfiles === "undefined") return "";
    return (
        '<div class="vis-reco-strip">Marked cloths are recommended for <em>' +
        archetypeProfiles[appState.archetypeKey].name +
        "</em></div>"
    );
}

// ============================================
// FILTERING
//
// At 100+ cloths the tray stops being scannable, so it needs facets.
// Mill is deliberately NOT a facet: 34 houses is far too many chips
// for an iPad, so cloths filter by region — derived from millPath, so
// it can never disagree with Cloth Origins — and the mill name stays
// on the cloth itself where it belongs.
// ============================================

var VIS_FACETS = [
    { key: "region", label: "Region" },
    { key: "weave", label: "Weave" },
    { key: "pattern", label: "Pattern" },
    { key: "colour_family", label: "Colour" },
    { key: "weight_class", label: "Weight" }
];

// A cloth's weave and pattern are themselves guide topics, sitting in
// fabrics > suiting > pattern_and_texture. Linking them means the cloth
// card can answer "what is a birdseye?" at the point the client is
// looking at one — and it is what makes that whole sub-tree reachable
// without browsing.
var WEAVE_TOPICS = {
    plain: ["fabrics", "suiting", "pattern_and_texture", "plain_weave"],
    twill: ["fabrics", "suiting", "pattern_and_texture", "herringbone"],
    hopsack: ["fabrics", "suiting", "hopsack"],
    flannel: ["fabrics", "suiting", "worsted_wool"],
    birdseye: ["fabrics", "suiting", "pattern_and_texture", "birdseye"],
    herringbone: ["fabrics", "suiting", "pattern_and_texture", "herringbone"]
};

var PATTERN_TOPICS = {
    chalkstripe: ["fabrics", "suiting", "pattern_and_texture", "chalkstripe"],
    pinstripe: ["fabrics", "suiting", "pattern_and_texture", "pinstripe"],
    windowpane: ["fabrics", "suiting", "pattern_and_texture", "windowpane"],
    glen: ["fabrics", "suiting", "pattern_and_texture", "glen_check"]
};

var WEAVE_TOPIC_LABELS = {
    plain: "Plain Weave", twill: "Twill", hopsack: "Hopsack",
    flannel: "Flannel", birdseye: "Birdseye", herringbone: "Herringbone"
};

var VIS_REGION_LABELS = {
    english: "England",
    italian: "Italy",
    french: "France",
    scottish: "Scotland",
    irish: "Ireland",
    singaporean: "Singapore"
};

function getClothRegion(cloth) {
    return cloth.millPath && cloth.millPath.length > 2 ? cloth.millPath[2] : "";
}

function getClothFacetValue(cloth, facetKey) {
    return facetKey === "region" ? getClothRegion(cloth) : cloth[facetKey];
}

function getVisFilters() {
    if (!appState.visFilters || typeof appState.visFilters !== "object") {
        appState.visFilters = {};
    }
    for (var i = 0; i < VIS_FACETS.length; i++) {
        var k = VIS_FACETS[i].key;
        if (!appState.visFilters[k]) appState.visFilters[k] = [];
    }
    return appState.visFilters;
}

function toggleVisFilter(facet, value) {
    var filters = getVisFilters();
    if (!filters[facet]) return;
    var at = filters[facet].indexOf(value);
    if (at === -1) filters[facet].push(value);
    else filters[facet].splice(at, 1);
}

function clearVisFilters() {
    var filters = getVisFilters();
    for (var i = 0; i < VIS_FACETS.length; i++) filters[VIS_FACETS[i].key] = [];
}

function countActiveVisFilters() {
    var filters = getVisFilters();
    var n = 0;
    for (var i = 0; i < VIS_FACETS.length; i++) n += filters[VIS_FACETS[i].key].length;
    return n;
}

// OR within a facet, AND across facets — the behaviour people expect
// from faceted search, and the only combination where adding a chip
// inside one group widens rather than narrows.
function getFilteredCloths() {
    var filters = getVisFilters();
    var out = [];
    for (var i = 0; i < FABRIC_LIBRARY.length; i++) {
        var cloth = FABRIC_LIBRARY[i];
        var keep = true;
        for (var f = 0; f < VIS_FACETS.length; f++) {
            var facet = VIS_FACETS[f].key;
            var chosen = filters[facet];
            if (!chosen.length) continue;
            if (chosen.indexOf(getClothFacetValue(cloth, facet)) === -1) {
                keep = false;
                break;
            }
        }
        if (keep) out.push(cloth);
    }
    return out;
}

function facetValueLabel(facetKey, value) {
    if (facetKey === "region") return VIS_REGION_LABELS[value] || value;
    // "Plain" is a weave. An unpatterned cloth is "Solid" — labelling
    // both the same put a PLAIN chip in two adjacent groups meaning two
    // different things.
    if (value === "none") return "Solid";
    return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}

function getVisFilterBarHTML() {
    var filters = getVisFilters();
    var active = countActiveVisFilters();
    var shown = getFilteredCloths().length;

    var groupsHTML = "";
    for (var f = 0; f < VIS_FACETS.length; f++) {
        var facet = VIS_FACETS[f];
        // Values are collected from the library rather than hardcoded,
        // so a facet can never offer a chip that matches nothing.
        var values = [];
        for (var i = 0; i < FABRIC_LIBRARY.length; i++) {
            var v = getClothFacetValue(FABRIC_LIBRARY[i], facet.key);
            if (v && values.indexOf(v) === -1) values.push(v);
        }
        values.sort();

        var chipsHTML = "";
        for (var c = 0; c < values.length; c++) {
            var on = filters[facet.key].indexOf(values[c]) !== -1;
            chipsHTML +=
                '<button class="vis-filter-chip' + (on ? " on" : "") + '"' +
                ' data-action="vis-filter" data-facet="' + facet.key + '" data-value="' + values[c] + '"' +
                ' aria-pressed="' + (on ? "true" : "false") + '">' +
                facetValueLabel(facet.key, values[c]) +
                "</button>";
        }
        groupsHTML +=
            '<div class="vis-filter-group">' +
            '<span class="vis-filter-group-label">' + facet.label + "</span>" +
            '<div class="vis-filter-chips">' + chipsHTML + "</div>" +
            "</div>";
    }

    return (
        '<div class="vis-filter-bar' + (active ? " has-active" : "") + '">' +
        '<div class="vis-filter-head">' +
        '<button class="vis-filter-toggle" data-action="vis-filter-toggle" aria-expanded="' +
        (appState.visFiltersOpen ? "true" : "false") + '">Filter' +
        (active ? ' <span class="vis-filter-count">' + active + "</span>" : "") +
        "</button>" +
        '<span class="vis-filter-result" role="status">' + shown + " of " + FABRIC_LIBRARY.length + " cloths</span>" +
        (active ? '<button class="vis-filter-clear" data-action="vis-filter-clear">Clear</button>' : "") +
        "</div>" +
        '<div class="vis-filter-groups' + (appState.visFiltersOpen ? " open" : "") + '">' + groupsHTML + "</div>" +
        "</div>"
    );
}

// selKey gets the accent ring; altKey (compare mode: the cloth dressed
// on the other side) gets a quiet one.
function getVisSwatchesHTML(recommended, selKey, altKey) {
    var swatchesHTML = "";
    var shown = getFilteredCloths();
    if (!shown.length) {
        return '<p class="vis-swatch-empty">No cloths match those filters.</p>';
    }
    for (var i = 0; i < shown.length; i++) {
        var f = shown[i];
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

// The cloth selector, as a 3D coverflow of the *filtered* cloths. Filter to
// narrow the bunch, then drag/swipe through the subset; the centre cloth is
// the selection and the garment re-renders in it live (visApplyFabric). A
// scrubber of tiny swatches jumps straight to any cloth in the set.
function getVisCoverflowHTML(shown, selKey, recommended) {
    if (!shown.length) return '<p class="vis-swatch-empty">No cloths match those filters.</p>';
    var cards = "", dots = "";
    for (var i = 0; i < shown.length; i++) {
        var f = shown[i];
        var reco = recommended.indexOf(f.key) !== -1;
        cards +=
            '<div class="vis-cf-card' + (f.key === selKey ? " is-active" : "") + '" data-fabric="' + f.key + '" role="button" tabindex="-1" aria-label="' + f.name + '">' +
            '<span class="vis-cf-cloth" style="background-image:url(' + getFabricTile(f.key) + ')"></span>' +
            '<span class="vis-cf-sheen" aria-hidden="true"></span>' +
            (reco ? '<span class="vis-cf-reco">For you</span>' : "") +
            '<span class="vis-cf-plate"><span class="vis-cf-n">' + f.name + '</span>' +
            '<span class="vis-cf-m">' + (f.mill || "") + '</span></span>' +
            "</div>";
        dots += '<button class="vis-cf-dot' + (f.key === selKey ? " on" : "") + '" data-cf-jump="' + i +
            '" style="background-image:url(' + getFabricTile(f.key) + ')" title="' + f.name + '" aria-label="' + f.name + '"></button>';
    }
    return (
        '<div class="vis-cf" data-vis-coverflow>' +
        '<div class="vis-cf-count">' + shown.length + " cloth" + (shown.length === 1 ? "" : "s") + " in the bunch</div>" +
        '<div class="vis-cf-stage" id="vis-cf-stage" tabindex="0" aria-label="Cloth coverflow — drag to browse">' +
        '<div class="vis-cf-deck" id="vis-cf-deck">' + cards + "</div></div>" +
        '<div class="vis-cf-scrub" id="vis-cf-scrub" aria-label="Jump to a cloth">' + dots + "</div>" +
        '<p class="vis-cf-hint">Drag or swipe &middot; tap a swatch to jump</p>' +
        "</div>"
    );
}

function startVisCoverflow() {
    var stage = document.getElementById("vis-cf-stage");
    var deck = document.getElementById("vis-cf-deck");
    if (!stage || !deck || deck._cfInit) return;
    deck._cfInit = true;
    var cards = Array.prototype.slice.call(deck.querySelectorAll(".vis-cf-card"));
    if (!cards.length) return;
    var scrub = document.getElementById("vis-cf-scrub");
    var dots = scrub ? Array.prototype.slice.call(scrub.querySelectorAll(".vis-cf-dot")) : [];
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var keys = cards.map(function (c) { return c.getAttribute("data-fabric"); });
    var GAP = Math.min(172, Math.max(118, stage.clientWidth * 0.24));

    var pos = keys.indexOf(appState.visFabricKey);
    if (pos < 0) pos = 0;

    function layout(anim) {
        var ci = Math.max(0, Math.min(keys.length - 1, Math.round(pos)));
        for (var i = 0; i < cards.length; i++) {
            var d = i - pos, ad = Math.abs(d), c = cards[i];
            if (reduce) {
                c.style.transform = "translateX(" + (d * GAP) + "px) scale(" + (1 - Math.min(ad, 1) * 0.2) + ")";
            } else {
                var cl = Math.max(-1, Math.min(1, d));
                c.style.transform = "translateX(" + (d * GAP) + "px) translateZ(" + (-Math.min(ad, 3) * 150) +
                    "px) rotateY(" + (-cl * 50) + "deg) scale(" + (1 - Math.min(ad, 1) * 0.16) + ")";
            }
            c.style.transition = (anim && !reduce) ? "transform .5s cubic-bezier(.22,.7,.26,1),opacity .5s" : "";
            c.style.opacity = String(Math.max(0, 1 - Math.min(ad, 3.2) / 3.2 * 0.72));
            c.style.zIndex = String(300 - Math.round(ad * 10));
            c.classList.toggle("is-active", i === ci);
        }
        for (var j = 0; j < dots.length; j++) dots[j].classList.toggle("on", j === ci);
        if (anim && dots[ci] && dots[ci].scrollIntoView) dots[ci].scrollIntoView({ inline: "center", block: "nearest" });
    }
    function select(i) {
        pos = Math.max(0, Math.min(keys.length - 1, i));
        layout(true);
        var key = keys[Math.round(pos)];
        if (key && key !== appState.visFabricKey) {
            appState.visFabricKey = key;
            try { localStorage.setItem("bbs_session", JSON.stringify(appState)); } catch (e) {}
            if (typeof visApplyFabric === "function") visApplyFabric(key);
        }
    }

    var drag = false, sx = 0, sp = 0, moved = false;
    function onMove(e) {
        if (!drag) return;
        var dx = e.clientX - sx;
        if (Math.abs(dx) > 4) moved = true;
        pos = Math.max(-0.45, Math.min(keys.length - 0.55, sp - dx / GAP));
        layout(false);
    }
    function onUp() {
        if (!drag) return;
        drag = false;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        select(Math.round(pos));
    }
    stage.addEventListener("pointerdown", function (e) {
        drag = true; moved = false; sx = e.clientX; sp = pos;
        for (var i = 0; i < cards.length; i++) cards[i].style.transition = "";
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    });
    cards.forEach(function (c, i) { c.addEventListener("click", function () { if (!moved) select(i); }); });
    dots.forEach(function (d, i) { d.addEventListener("click", function () { select(i); }); });
    stage.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { e.preventDefault(); select(Math.round(pos) - 1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); select(Math.round(pos) + 1); }
    });
    layout(false);
}
window.startVisCoverflow = startVisCoverflow;

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
        '<div class="vis-stage vis-stage--photo">' +
        '<canvas class="vis-jacket-canvas" id="vis-jacket-canvas" width="644" height="800"' +
        ' data-garment-key="jacket-sb" data-cloth="' + activeKey + '"></canvas>' +
        "</div>" +
        getVisFilterBarHTML() +
        getVisCoverflowHTML(getFilteredCloths(), activeKey, recommended) +
        '<div class="vis-mode-toggles">' +
        '<button class="vis-mode-toggle" data-action="vis-compare-toggle">Compare two cloths &rarr;</button>' +
        '<button class="vis-mode-toggle" data-action="vis-ensemble-toggle">Design an ensemble &rarr;</button>' +
        "</div>" +
        '<div class="vis-info" id="vis-info">' + getFabricInfoHTML(fabric) + "</div>" +
        '<div class="vis-footnote">Garments shown as photographed mockups dressed in generated cloth previews.</div>' +
        '<div class="nav-buttons"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
        "</div>"
    );
}

function getVisSplitPct() {
    var v = appState.visSplitPct;
    if (typeof v !== "number" || isNaN(v)) v = 50;
    return Math.max(4, Math.min(96, v));
}

function getVisSplitLayerHTML(side, key, pct) {
    // Layer A is clipped from the right edge back to the divider. The clip
    // lives on this wrapper, so a photographed jacket canvas inside it is
    // revealed by the drag exactly as the old fabric layer was.
    var clip = side === "a" ? ' style="clip-path:inset(0 ' + (100 - pct) + '% 0 0)"' : "";
    return (
        '<div class="vis-split-layer vis-split-layer--' + side + '" id="vis-split-layer-' + side + '"' + clip + ">" +
        '<canvas class="vis-jacket-canvas vis-split-canvas" id="vis-split-canvas-' + side + '" width="644" height="800"' +
        ' data-garment-key="jacket-sb" data-cloth="' + key + '"></canvas>' +
        "</div>"
    );
}

function renderClothCompare(aKey, recommended) {
    var bKey = appState.visFabricKeyB || visDefaultCompareKey(aKey);
    var side = appState.visCompareSide === "b" ? "b" : "a";
    var selKey = side === "a" ? aKey : bKey;
    var altKey = side === "a" ? bKey : aKey;
    var pct = getVisSplitPct();

    var a = getFabricByKey(aKey);
    var b = getFabricByKey(bKey);

    return (
        '<div class="vis-shell">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
        "<h1 class=\"vis-title\">Two Cloths, One Decision</h1>" +
        '<p class="vis-lead">One jacket, two cloths. Drag the chalk line across to see where each one takes it.</p>' +

        '<div class="vis-split-stage" id="vis-split-stage">' +
        getVisSplitLayerHTML("b", bKey, pct) +
        getVisSplitLayerHTML("a", aKey, pct) +
        // The chalk line: a soft tailor's mark, not a UI slider.
        '<div class="vis-split-line" id="vis-split-line" style="left:' + pct + '%">' +
        '<span class="vis-split-chalk"></span>' +
        '<span class="vis-split-grip" aria-hidden="true"></span>' +
        "</div>" +
        // Keyboard route to the same control, since dragging is not one.
        '<input class="vis-split-range" id="vis-split-range" type="range" min="4" max="96" value="' + pct + '"' +
        ' aria-label="Reveal more of the left or right cloth">' +
        "</div>" +

        // Which side the next swatch tap dresses.
        '<div class="vis-split-sides">' +
        '<button class="vis-split-side' + (side === "a" ? " sel" : "") + '" data-action="vis-side" data-side="a">' +
        '<span class="vis-split-side-tag">Left</span>' +
        '<span class="vis-split-side-name">' + a.name + "</span>" +
        "</button>" +
        '<button class="vis-split-side' + (side === "b" ? " sel" : "") + '" data-action="vis-side" data-side="b">' +
        '<span class="vis-split-side-tag">Right</span>' +
        '<span class="vis-split-side-name">' + b.name + "</span>" +
        "</button>" +
        "</div>" +

        getVisFilterBarHTML() +
        '<div class="vis-swatch-tray">' + getVisSwatchesHTML(recommended, selKey, altKey) + "</div>" +
        getVisRecoStripHTML(recommended) +
        '<div class="vis-info vis-info--cmp" id="vis-info-' + side + '">' +
        getFabricInfoHTML(side === "a" ? a : b) + "</div>" +
        '<button class="vis-mode-toggle" data-action="vis-compare-toggle">&larr; Back to one cloth</button>' +
        '<div class="vis-footnote">Garments shown as photographed mockups dressed in generated cloth previews.</div>' +
        '<div class="nav-buttons"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
        "</div>"
    );
}

// Drag handling lives here rather than in the delegated click handler:
// this is a continuous gesture, not a tap.
function startVisSplitDrag() {
    var stage = document.getElementById("vis-split-stage");
    var line = document.getElementById("vis-split-line");
    var layerA = document.getElementById("vis-split-layer-a");
    var range = document.getElementById("vis-split-range");
    if (!stage || !line || !layerA) return;

    function setPct(pct, persist) {
        pct = Math.max(4, Math.min(96, pct));
        appState.visSplitPct = pct;
        line.style.left = pct + "%";
        layerA.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
        if (range && range.value != pct) range.value = pct;
        if (persist) localStorage.setItem("bbs_session", JSON.stringify(appState));
    }

    function pctFromEvent(e) {
        var r = stage.getBoundingClientRect();
        return ((e.clientX - r.left) / r.width) * 100;
    }

    var dragging = false;
    stage.addEventListener("pointerdown", function (e) {
        // Ignore presses that begin on the range input; it drives itself.
        if (e.target === range) return;
        dragging = true;
        setPct(pctFromEvent(e), false);
        try { stage.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
    });
    stage.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        setPct(pctFromEvent(e), false);
    });
    ["pointerup", "pointercancel"].forEach(function (evt) {
        stage.addEventListener(evt, function () {
            if (!dragging) return;
            dragging = false;
            setPct(getVisSplitPct(), true);
        });
    });

    if (range) {
        range.addEventListener("input", function () { setPct(Number(range.value), false); });
        range.addEventListener("change", function () { setPct(Number(range.value), true); });
    }
}

function getFabricInfoHTML(fabric) {
    // The mill name taps through to its marker on the Mill Map.
    var millSpec =
        typeof getMillPinByName === "function" && getMillPinByName(fabric.mill)
            ? '<button class="vis-spec vis-spec-link" data-action="mill-map-focus" data-mill="' + fabric.mill + '">' + fabric.mill + "</button>"
            : '<span class="vis-spec">' + fabric.mill + "</span>";
    // Specs are built from what the cloth actually has. House-style
    // cloths carry no composition or weight by design (see cloth-data.js),
    // and printing those straight would have rendered "undefined" on 83
    // of 102 cloths.
    var specs = [millSpec];
    if (fabric.bunch && fabric.bunch !== fabric.name) specs.push('<span class="vis-spec">' + fabric.bunch + "</span>");
    if (fabric.composition) specs.push('<span class="vis-spec">' + fabric.composition + "</span>");
    if (fabric.weight) specs.push('<span class="vis-spec">' + fabric.weight + "</span>");

    // Every cloth resolves somewhere: its weave topic if it has one,
    // otherwise its mill's page in Cloth Origins.
    var linkPath = fabric.guidePath || fabric.millPath;
    var linkLabel = fabric.guidePath ? "Read about this cloth" : "Read about this mill";

    // Weave and pattern each link to their own guide entry.
    var weaveReads = [];
    if (WEAVE_TOPICS[fabric.weave]) {
        weaveReads.push(
            '<button class="ds-read-link" data-action="result-link" data-path=\'' +
            JSON.stringify(WEAVE_TOPICS[fabric.weave]) + "'>" +
            (WEAVE_TOPIC_LABELS[fabric.weave] || fabric.weave) + "</button>"
        );
    }
    if (fabric.pattern && PATTERN_TOPICS[fabric.pattern]) {
        weaveReads.push(
            '<button class="ds-read-link" data-action="result-link" data-path=\'' +
            JSON.stringify(PATTERN_TOPICS[fabric.pattern]) + "'>" +
            facetValueLabel("pattern", fabric.pattern) + "</button>"
        );
    }

    return (
        '<div class="vis-info-head">' +
        '<h2 class="vis-fabric-name">' + fabric.name + "</h2>" +
        '<div class="vis-fabric-specs">' +
        specs.join('<span class="vis-spec-divider"></span>') +
        "</div>" +
        "</div>" +
        '<p class="vis-fabric-character">' + fabric.character + "</p>" +
        (weaveReads.length
            ? '<div class="ds-read-row"><span class="ds-read-label">Read about</span>' + weaveReads.join("") + "</div>"
            : "") +
        (linkPath
            ? '<button class="vis-guide-link" data-action="result-link" data-path=\'' +
              JSON.stringify(linkPath) + "'>" + linkLabel + " &rarr;</button>"
            : "")
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

// Partial DOM update on swatch tap — repaint the jacket canvas with the
// new cloth instead of re-rendering the whole view.
function visApplyFabric(key) {
    var canvas = document.getElementById("vis-jacket-canvas");
    if (canvas && typeof renderGarmentPhoto === "function") {
        canvas.setAttribute("data-cloth", key);
        renderGarmentPhoto(canvas, canvas.getAttribute("data-garment-key"), key);
    }
    var info = document.getElementById("vis-info");
    if (info) info.innerHTML = getFabricInfoHTML(getFabricByKey(key));
    visSyncSwatchMarks(key, null);
}

// Compare mode: dress one side. Call after appState is updated.
function visApplyCompareFabric(side, key) {
    var canvas = document.getElementById("vis-split-canvas-" + side);
    if (canvas && typeof renderGarmentPhoto === "function") {
        canvas.setAttribute("data-cloth", key);
        renderGarmentPhoto(canvas, canvas.getAttribute("data-garment-key"), key);
    }
    // The info card follows the side being dressed, and the side button
    // carries the cloth's name so both halves stay labelled.
    var info = document.getElementById("vis-info-" + side) || document.querySelector(".vis-info--cmp");
    if (info) {
        info.id = "vis-info-" + side;
        info.innerHTML = getFabricInfoHTML(getFabricByKey(key));
    }
    var btn = document.querySelector('.vis-split-side[data-side="' + side + '"] .vis-split-side-name');
    if (btn) btn.textContent = getFabricByKey(key).name;
    var otherKey = side === "a" ? appState.visFabricKeyB : appState.visFabricKey;
    visSyncSwatchMarks(key, otherKey);
}

// Compare mode: switch which side the next swatch tap dresses.
function visSetCompareSide(side) {
    var sides = document.querySelectorAll(".vis-split-side");
    for (var i = 0; i < sides.length; i++) {
        var isActive = sides[i].getAttribute("data-side") === side;
        sides[i].className = "vis-split-side" + (isActive ? " sel" : "");
        sides[i].setAttribute("aria-pressed", isActive ? "true" : "false");
    }
    var selKey = side === "a" ? appState.visFabricKey : appState.visFabricKeyB;
    var altKey = side === "a" ? appState.visFabricKeyB : appState.visFabricKey;
    visSyncSwatchMarks(selKey, altKey);
}

// ============================================
// ENSEMBLE GARMENT ART (redesigned parametric SVG)
// ============================================

// Jacket, 440x540.
//
// The old path merged the sleeves into the body, which is why it read
// as a cardigan: with no gap at the armpit there is nothing to tell the
// eye where the sleeve ends and the body begins. The sleeves now angle
// outward, leaving a clear V notch at each armpit — the thing that
// makes a flat-lay read as tailoring.
//
// Cut is Neapolitan: the shoulder SLOPES away from the neck rather than
// sitting square, and the sleeves run the full length to the hem.
// Proportions measured off a generated technical flat: the reference
// runs about 1:1.9 width to height. The first pass here was 1:1.34 —
// too short and too wide, which is the other half of why the old art
// read as a cardigan. Now 288 wide against 458 tall, roughly 1:1.6.
// The cuff sits just above the hem, as it does on the reference.
var DS_JACKET_BODY =
    "M220 40 " +
    "C207 40 197 43 191 48 " +
    // soft sloping shoulder out to the shoulder point
    "C160 56 132 66 112 84 " +
    // sleeve outer edge, angling away from the body
    "C102 124 90 250 80 366 " +
    "C78 402 76 430 76 446 " +
    "C88 458 106 462 118 458 " +
    // sleeve inner edge back up to the armpit
    "C124 420 132 356 140 300 " +
    "C148 248 156 208 162 186 " +
    // body: armpit down through the waist, flaring to the hem
    "C157 224 153 262 152 300 " +
    "C151 356 152 434 158 502 " +
    "C190 508 250 508 282 502 " +
    "C288 434 289 356 288 300 " +
    "C287 262 283 224 278 186 " +
    // right sleeve, mirrored
    "C284 208 292 248 300 300 " +
    "C308 356 316 420 322 458 " +
    "C334 462 352 458 364 446 " +
    "C364 430 362 402 360 366 " +
    "C350 250 338 124 328 84 " +
    "C308 66 280 56 249 48 " +
    "C243 43 233 40 220 40 Z";

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

// Waistcoat, drawn in a 440x560 PORTRAIT space. It was previously
// authored in 440x360 — landscape — which is why it read as a
// tombstone: a waistcoat wider than it is tall cannot look right
// however carefully the curves are placed.
//
// The silhouette now carries the three things it was missing entirely:
// shoulder straps, concave armholes cut high and close, and a deep V.
// Waistcoat, drawn in a 440x440 space.
//
// Two corrections here, and the second was my own overshoot. The
// original artwork had no shoulder straps, no armholes and no V — it
// was a rounded shield, which is why it read as a tombstone. Fixing
// that, I first stretched the box to 440x560, which gave a body
// roughly 1:2.6 and made it read as a dress instead. A waistcoat is
// nearer 1:1.6, so the garment is now WIDER relative to its box rather
// than taller: chest spans 110-330 against a 356-tall body.
// Measured off a photograph of a real single-breasted waistcoat.
// The shoulders were the big error: mine spanned 91% of the garment's
// own width near the top where the real one spans 60%. A waistcoat is
// narrow across the shoulders, scoops at the armhole, then carries its
// full width through the body. Overall 1:1.38, against the photo's 1.37.
var DS_VEST_TOP =
    "M200 38 " +
    // narrow across the shoulder, then sloping out to the shoulder point
    "C186 40 176 43 168 48 " +
    "C150 56 134 64 125 74 " +
    // armhole: a shallow scoop, not a deep pinch
    "C128 100 130 126 130 150 " +
    // below the armpit the body opens to its full width and holds it
    "C120 176 100 196 92 216 " +
    "C89 260 89 300 90 330 ";

var DS_VEST_HEM = {
    // The classic waistcoat hem: two points flanking the CENTRE front,
    // with a shallow V between them, and the side seams finishing
    // higher. The points sat out at the side seams before, which is not
    // where a waistcoat points — that read as a bell.
    points: "C130 358 154 374 174 396 " +
            "C192 376 208 362 220 354 " +
            "C232 362 248 376 266 396 " +
            "C286 374 310 358 350 330 ",
    // Straight across, as worn under a double-breasted jacket where
    // points would show below the wrap.
    straight: "L90 352 L350 352 L350 330 "
};

var DS_VEST_BOTTOM =
    "C328 290 332 250 330 200 " +
    "C328 190 316 175 300 150 " +
    "C302 118 312 84 322 54 " +
    "C300 42 262 38 240 36 " +
    // the V neckline, cut to just above the top button
    "C237 70 230 104 220 132 " +
    "C210 104 203 70 200 36 Z";

function dsVestBody(style) {
    return DS_VEST_TOP + (DS_VEST_HEM[style.hem] || DS_VEST_HEM.points) + DS_VEST_BOTTOM;
}

function getDSVestShadingSVG(style) {
    style = style || VIS_ENS_STYLE_DEFAULTS.vest;
    var DS_VEST_BODY = dsVestBody(style);
    var isDB = style.closure === "db";
    var isShawl = style.lapel === "shawl";

    // Buttons: one column centred on the front edge, or two columns
    // flanking it for a double-breasted wrap.
    // Buttons run from just under the V down toward the hem points.
    var buttons = "";
    var rows = isDB ? [206, 240, 274, 308] : [196, 226, 256, 286, 316];
    for (var r = 0; r < rows.length; r++) {
        if (isDB) {
            buttons += '<circle cx="196" cy="' + rows[r] + '" r="5" fill="#4c4c4c"/>';
            buttons += '<circle cx="244" cy="' + rows[r] + '" r="5" fill="#4c4c4c"/>';
        } else {
            buttons += '<circle cx="220" cy="' + rows[r] + '" r="5" fill="#4c4c4c"/>';
        }
    }

    // A shawl lapel is an unbroken roll framing the neckline — no
    // notch, no peak, which is what distinguishes it on a waistcoat.
    var lapel = isShawl
        ? '<path d="M200 36 C188 62 184 108 192 150 L204 140 L214 136 L202 146 C196 108 198 66 210 42 Z" fill="#c9c9c9" opacity="0.85"/>' +
          '<path d="M240 36 C252 62 256 108 248 150 L236 140 L226 136 L238 146 C244 108 242 66 230 42 Z" fill="#bdbdbd" opacity="0.85"/>' +
          '<path d="M200 36 C188 62 184 108 192 150 L204 140" stroke="#7e7e7e" stroke-width="1.5" fill="none" opacity="0.6"/>' +
          '<path d="M240 36 C252 62 256 108 248 150 L236 140" stroke="#7e7e7e" stroke-width="1.5" fill="none" opacity="0.6"/>'
        : "";

    // The point shadows only exist when there are points to shade.
    var hemShadow = style.hem === "straight"
        ? ""
        : '<path d="M92 336 L174 396 L186 380 L104 330 Z" fill="#8a8a8a" opacity="0.22"/>' +
          '<path d="M348 336 L266 396 L254 380 L336 330 Z" fill="#8a8a8a" opacity="0.22"/>';

    return (
        '<svg class="ds-shading" viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
        "<defs>" +
        '<clipPath id="ds-clip-vest" clipPathUnits="objectBoundingBox"><path transform="scale(0.00227273 0.00227273)" d="' + DS_VEST_BODY + '"/></clipPath>' +
        '<linearGradient id="ds-vest-body" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#9d9d9d"/><stop offset="0.22" stop-color="#ededed"/>' +
        '<stop offset="0.5" stop-color="#fbfbfb"/><stop offset="0.78" stop-color="#e6e6e6"/>' +
        '<stop offset="1" stop-color="#979797"/>' +
        "</linearGradient>" +
        "</defs>" +
        '<g clip-path="url(#ds-clip-vest)">' +
        '<rect width="440" height="440" fill="url(#ds-vest-body)"/>' +
        // armhole shadows, following the concave armhole
        '<path d="M125 74 C128 100 130 126 130 150 C138 124 138 96 136 76 Z" fill="#8f8f8f" opacity="0.4"/>' +
        '<path d="M315 74 C312 100 310 126 310 150 C302 124 302 96 304 76 Z" fill="#868686" opacity="0.4"/>' +
        // side drape
        '<path d="M104 226 C99 268 99 302 104 336" stroke="#ababab" stroke-width="7" fill="none" opacity="0.3"/>' +
        '<path d="M336 226 C341 268 341 302 336 336" stroke="#ababab" stroke-width="7" fill="none" opacity="0.3"/>' +
        // front edges running down toward the hem
        '<path d="M212 140 L214 350" stroke="#828282" stroke-width="1.8" fill="none" opacity="0.5"/>' +
        '<path d="M228 140 L226 350" stroke="#909090" stroke-width="1.4" fill="none" opacity="0.4"/>' +
        // welt pockets, set at a slight angle
        '<path d="M112 276 L182 283 L181 295 L112 288 Z" fill="#8a8a8a" opacity="0.6"/>' +
        '<path d="M258 283 L328 276 L328 288 L259 295 Z" fill="#8a8a8a" opacity="0.6"/>' +
        lapel +
        buttons +
        hemShadow +
        "</g>" +
        '<path d="' + DS_VEST_BODY + '" fill="none" stroke="#4a443a" stroke-width="1.6" opacity="0.55"/>' +
        "</svg>"
    );
}

// Opaque shirt in the vest V
function getDSVestShirtSVG() {
    return (
        '<svg class="ds-overlay" viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
        // Fills the V, so it tracks the neckline in DS_VEST_BOTTOM.
        '<path d="M220 30 L200 38 C203 70 210 104 220 132 C230 104 237 70 240 38 Z" fill="#f8f5ef"/>' +
        '<path d="M220 32 L200 38 L214 56 L220 40 Z" fill="#eceae2"/>' +
        '<path d="M220 32 L240 38 L226 56 L220 40 Z" fill="#e4e2da"/>' +
        '<path d="M207 70 C211 98 216 118 220 132 L217 96 Z" fill="#cfcabe" opacity="0.5"/>' +
        '<path d="M233 70 C229 98 224 118 220 132 L223 96 Z" fill="#cfcabe" opacity="0.5"/>' +
        "</svg>"
    );
}

// ============================================
// CLOTH ROOM — ENSEMBLE MODE ("Design an outfit")
// Third mode alongside single-cloth and compare
// (toggled by appState.visEnsemble). A full three-piece:
// jacket, vest, and trousers, each cloth-swappable from
// the bunch, and each with its own style options — jacket
// (closure), vest (closure / lapel), trousers (style). Each
// combination composites the cloth into a photograph
// (garment-photo.js); jacket and vest keep a hand-drawn SVG
// fallback for any shape whose photo is not yet built.
// ============================================

var VIS_ENS_GARMENTS = ["jacket", "vest", "trousers"];

// Style options are per-garment. The jacket had these to itself; the
// vest and trousers were fixed artwork, which left the ensemble
// lopsided — trouser detailing in particular is what a client actually
// gets asked about in a fitting.
// Every option carries `topic`: the path to the guide entry that
// explains it. These are not decorative cross-links — each option in
// this menu IS a topic in the guide, and before this they were among
// the entries no client could ever reach without browsing the tree.
// Linking them makes the guide answer the question the option raises
// at the moment it is raised.
//
// Task 8 (founder, 21 July): reduced to only the options a garment
// photograph can distinguish — jacket lapel/pockets and vest/trouser
// hem and trouser waistband are removed here because no photograph
// varies with them (or, for the jacket, they are correlated with
// closure in the photographs and cannot vary independently). Those
// detail topics remain reachable as their own nodes in the guide, so
// removing them from this picker orphans nothing. See
// resolveGarmentKey() in garment-photo.js, which maps what remains
// straight onto a photograph.
var VIS_ENS_STYLE_OPTIONS = {
    jacket: {
        closure: [
            { key: "sb", label: "Single Breasted", topic: ["tailoring", "jackets", "styles", "single_breasted_jacket"] },
            { key: "db", label: "Double Breasted", topic: ["tailoring", "jackets", "styles", "double_breasted_jacket"] }
        ]
    },
    vest: {
        // Double-breasted vests are a real make but have no photograph yet,
        // so the db closure is hidden here until its image lands (the
        // resolver and button map still know it — see garment-photo.js).
        closure: [
            { key: "sb", label: "Single Breasted", topic: ["tailoring", "vests", "configuration", "single_breasted"] }
        ],
        lapel: [
            { key: "none", label: "No Lapel", topic: ["tailoring", "vests", "proportion_cut", "opening_depth"] },
            { key: "shawl", label: "Shawl Lapel", topic: ["tailoring", "jackets", "details", "lapels", "shawl_lapel"] }
        ]
    },
    trousers: {
        // One selector per trouser make; each resolves straight to a
        // photograph via resolveGarmentKey ("trousers-" + style). Extensible
        // — new makes (e.g. Gurkha) join here the moment their photo lands.
        style: [
            { key: "flat", label: "Flat Front", topic: ["tailoring", "trousers", "configuration", "pleats", "flat_front"] },
            { key: "double", label: "Double Pleat", topic: ["tailoring", "trousers", "configuration", "pleats", "double_pleats"] },
            { key: "belt", label: "Belt Loops", topic: ["tailoring", "trousers", "configuration", "pleats", "flat_front"] }
        ]
    }
};

// Turns a garment's chosen options into a readable line ("Single
// Breasted, Notch Lapel, Flap Pockets") by looking the labels back up,
// so the Design Spec PDF and the on-screen summary stay in step with
// the option list without anyone maintaining a second copy of it.
function visEnsStyleNote(garment, style) {
    var groups = VIS_ENS_STYLE_OPTIONS[garment];
    if (!groups || !style) return "";
    var parts = [];
    for (var groupKey in groups) {
        if (!groups.hasOwnProperty(groupKey)) continue;
        var opts = groups[groupKey];
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].key === style[groupKey]) {
                // "No Lapel" and "Plain Hem" are the absence of a
                // feature — listing them adds noise to the spec.
                if (opts[i].key !== "none" && opts[i].key !== "plain") parts.push(opts[i].label);
                break;
            }
        }
    }
    return parts.join(", ");
}

var VIS_ENS_STYLE_DEFAULTS = {
    jacket: { closure: "sb", lapel: "notch", pockets: "flap" },
    vest: { closure: "sb", lapel: "none", hem: "points" },
    trousers: { style: "flat" }
};

function getVisEnsembleState() {
    if (!appState.visEnsembleState || typeof appState.visEnsembleState !== "object") {
        var recos = getRecommendedFabricKeys();
        appState.visEnsembleState = {
            activeGarment: "jacket",
            fabrics: {
                jacket: recos.length ? recos[0] : FABRIC_LIBRARY[0].key,
                vest: "solbiati_wool_silk_linen",
                trousers: "fox_flannel_mid_grey"
            },
            style: {}
        };
    }

    var ens = appState.visEnsembleState;

    // Migration: style used to be a flat jacket-only object, and a
    // returning iPad has one persisted in localStorage. A flat object
    // is detected by its jacket keys sitting at the top level.
    if (ens.style && (ens.style.pockets || ens.style.lapel === "notch" || ens.style.lapel === "peak") && !ens.style.jacket) {
        ens.style = { jacket: { closure: ens.style.closure, lapel: ens.style.lapel, pockets: ens.style.pockets } };
    }
    if (!ens.style || typeof ens.style !== "object") ens.style = {};

    // Fill any missing garment or option from defaults, so a state
    // saved before an option existed still renders.
    for (var garment in VIS_ENS_STYLE_DEFAULTS) {
        if (!VIS_ENS_STYLE_DEFAULTS.hasOwnProperty(garment)) continue;
        if (!ens.style[garment] || typeof ens.style[garment] !== "object") ens.style[garment] = {};
        for (var opt in VIS_ENS_STYLE_DEFAULTS[garment]) {
            if (!VIS_ENS_STYLE_DEFAULTS[garment].hasOwnProperty(opt)) continue;
            if (!ens.style[garment][opt]) ens.style[garment][opt] = VIS_ENS_STYLE_DEFAULTS[garment][opt];
        }
    }
    return ens;
}

// ============================================
// COMPLETE THE LOOK
//
// The third mode SuitSupply's Look Builder occupies — composing a whole
// outfit rather than a garment. Theirs is built on stocked products;
// this one is illustrated, because BBS product linking is still parked
// on confirmed SKUs and photography.
//
// The register is derived from the jacket cloth actually chosen, not a
// fixed list, so changing the cloth changes the recommendation. Every
// slot links to its guide entry — which is also how the accessories
// section of the guide stopped being unreachable.
// ============================================

function getLookRegister(cloth) {
    if (!cloth) return "business";
    var linenish = cloth.weave === "plain" && (cloth.colour_family === "cream" || cloth.colour_family === "tan");
    if (cloth.weight_class === "light" && (linenish || cloth.weave === "hopsack")) return "warm";
    if (cloth.weave === "herringbone" || cloth.weave === "flannel" ||
        cloth.colour_family === "brown" || cloth.colour_family === "green" || cloth.colour_family === "tan") {
        return "country";
    }
    if (cloth.pattern === "none" &&
        (cloth.colour_family === "charcoal" || cloth.colour_family === "navy" || cloth.colour_family === "black")) {
        return "business";
    }
    return "business";
}

var LOOK_SLOTS = {
    business: [
        { slot: "Tie", label: "Grenadine Silk", note: "Textured enough to sit against a plain worsted without going flat.", topic: ["accessories", "ties", "grenadine_tie"] },
        { slot: "Pocket Square", label: "White Linen", note: "The one square that never argues with anything.", topic: ["accessories", "pocket_squares", "white_pocket_square"] },
        { slot: "Belt", label: "Dress Belt", note: "Slim, smooth leather, matched to the shoe.", topic: ["accessories", "belts", "dress_belt"] },
        { slot: "Shoes", label: "Oxford", note: "Closed lacing is the formal end of the range.", topic: ["accessories", "shoes", "dress_shoes", "oxford_shoe"] }
    ],
    country: [
        { slot: "Tie", label: "Wool Tie", note: "Matte and substantial — it belongs with texture, not against it.", topic: ["accessories", "ties", "wool_tie"] },
        { slot: "Pocket Square", label: "Linen Square", note: "A softer fold for a softer cloth.", topic: ["accessories", "pocket_squares", "linen_pocket_square"] },
        { slot: "Belt", label: "Suede Belt", note: "Suede reads as considered rather than corporate.", topic: ["accessories", "belts", "suede_belt"] },
        { slot: "Shoes", label: "Derby", note: "Open lacing, more room, more at ease.", topic: ["accessories", "shoes", "dress_shoes", "derby_shoe"] }
    ],
    warm: [
        { slot: "Tie", label: "Linen Tie", note: "Or none at all — a warm-weather cloth carries an open collar well.", topic: ["accessories", "ties", "linen_tie"] },
        { slot: "Pocket Square", label: "Cotton Square", note: "Light, dry, and unbothered by humidity.", topic: ["accessories", "pocket_squares", "cotton_pocket_square"] },
        { slot: "Belt", label: "Woven Belt", note: "Or side adjusters and skip the belt entirely.", topic: ["accessories", "belts", "woven_belt"] },
        { slot: "Shoes", label: "Penny Loafer", note: "The tropical default, and the easiest shoe to wear all day.", topic: ["accessories", "shoes", "loafers", "penny_loafer"] }
    ]
};

// Small line-drawn marks rather than photographs, matching the garment
// art's register.
var LOOK_ICONS = {
    Tie: '<svg viewBox="0 0 40 60" aria-hidden="true"><path d="M20 4 L14 12 L20 18 L26 12 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M20 18 L13 40 L20 54 L27 40 Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    "Pocket Square": '<svg viewBox="0 0 40 60" aria-hidden="true"><path d="M8 40 L20 16 L32 40 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 40 L32 40" stroke="currentColor" stroke-width="1.6"/></svg>',
    Belt: '<svg viewBox="0 0 40 60" aria-hidden="true"><path d="M4 26 L36 26 L36 34 L4 34 Z" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="16" y="23" width="11" height="14" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    // Side profile with a visible heel, toe cap and laced vamp — the
    // first attempt was a single soft curve and read as a hill.
    Shoes: '<svg viewBox="0 0 40 60" aria-hidden="true">' +
        '<path d="M4 40 L4 34 C4 31 6 29 10 28 L18 26 C21 25 23 26 26 29 L32 34 C35 36 36 38 36 40 Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M4 40 L36 40 L36 43 L4 43 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
        '<path d="M26 29 C24 32 22 34 18 35" fill="none" stroke="currentColor" stroke-width="1.3"/>' +
        '<path d="M12 28 L14 32 M16 27 L18 31" stroke="currentColor" stroke-width="1.1"/>' +
        "</svg>"
};

function getCompleteTheLookHTML(ens) {
    var jacketCloth = getFabricByKey(ens.fabrics.jacket);
    var register = getLookRegister(jacketCloth);
    var slots = LOOK_SLOTS[register] || LOOK_SLOTS.business;

    var registerNote = {
        business: "Read from a plain dark worsted — the formal end of the range.",
        country: "Read from a textured or earth-toned cloth — softer, less corporate.",
        warm: "Read from a light, open cloth — built for heat."
    }[register];

    var cards = "";
    for (var i = 0; i < slots.length; i++) {
        var s = slots[i];
        cards +=
            '<button class="look-card" data-action="result-link" data-path=\'' + JSON.stringify(s.topic) + "'>" +
            '<span class="look-card-icon">' + (LOOK_ICONS[s.slot] || "") + "</span>" +
            '<span class="look-card-slot">' + s.slot + "</span>" +
            '<span class="look-card-label">' + s.label + "</span>" +
            '<span class="look-card-note">' + s.note + "</span>" +
            "</button>";
    }

    return (
        '<div class="look-block">' +
        '<div class="look-head">' +
        '<h2 class="look-title">Complete the Look</h2>' +
        '<p class="look-lead">' + registerNote + "</p>" +
        "</div>" +
        '<div class="look-grid">' + cards + "</div>" +
        "</div>"
    );
}

function getVisEnsGarmentBlock(garment, ens) {
    var fabricKey = ens.fabrics[garment];
    var style = ens.style[garment] || {};
    var activeClass = ens.activeGarment === garment ? " active" : "";
    var label = garment.charAt(0).toUpperCase() + garment.slice(1);

    // Photo path: the garment is drawn by compositing the selected cloth
    // into a photographed grey mockup (garment-photo.js). The actual pixels
    // are painted after the DOM lands, by startVisEnsPhotos().
    var photoKey = typeof resolveGarmentKey === "function" ? resolveGarmentKey(garment, style) : null;
    var hasPhoto = photoKey && typeof GARMENT_ASSET_KEYS !== "undefined" &&
        GARMENT_ASSET_KEYS.indexOf(photoKey) !== -1;

    if (hasPhoto) {
        // Buffer matches the asset's native size so renderGarmentPhoto
        // draws it 1:1. Trousers are 537x800, everything else 644x800.
        var w = garment === "trousers" ? 537 : 644;
        return (
            '<div class="ds-garment ds-garment--' + garment + " has-photo" + activeClass + '" data-action="vis-ens-garment" data-garment="' + garment + '">' +
            '<canvas class="ds-garment-canvas" id="vis-ens-canvas-' + garment + '" width="' + w + '" height="800"' +
            ' data-garment-key="' + photoKey + '" data-cloth="' + fabricKey + '"></canvas>' +
            '<div class="ds-garment-label">' + label + "</div>" +
            "</div>"
        );
    }

    // Fallback: the hand-drawn silhouette, for a jacket or vest shape whose
    // photograph is not yet generated (e.g. a double-breasted vest before
    // its image lands). Self-heals — the moment the asset joins
    // GARMENT_ASSET_KEYS, the photo path above takes over.
    // Trousers always have a photograph, so only jacket and vest can reach
    // this hand-drawn fallback.
    var shading = "";
    var shirtOverlay = "";
    if (garment === "jacket") {
        shading = getDSJacketShadingSVG(style);
        shirtOverlay = getDSJacketShirtSVG(style);
    } else if (garment === "vest") {
        shading = getDSVestShadingSVG(style);
        shirtOverlay = getDSVestShirtSVG();
    }
    return (
        '<div class="ds-garment ds-garment--' + garment + activeClass + '" data-action="vis-ens-garment" data-garment="' + garment + '">' +
        '<div class="ds-fabric-layer" id="vis-ens-fabric-' + garment + '" style="background-image:url(' + getFabricTile(fabricKey) + ');clip-path:url(#ds-clip-' + garment + ')"></div>' +
        shirtOverlay +
        shading +
        '<div class="ds-garment-label">' + label + "</div>" +
        "</div>"
    );
}

// Paints every photographed garment canvas currently in the DOM — the
// ensemble stage, the single-cloth view, and both sides of the Split all
// use the same [data-garment-key] canvas contract. Called from the app
// render hook after innerHTML is set. renderGarmentPhoto self-retries
// while its asset loads, so a cold first paint fills in a frame or two later.
function startVisEnsPhotos() {
    if (typeof renderGarmentPhoto !== "function") return;
    var canvases = document.querySelectorAll("canvas[data-garment-key]");
    for (var i = 0; i < canvases.length; i++) {
        var c = canvases[i];
        var key = c.getAttribute("data-garment-key");
        var cloth = c.getAttribute("data-cloth");
        if (key && cloth) renderGarmentPhoto(c, key, cloth);
    }
}
window.startVisEnsPhotos = startVisEnsPhotos;

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
        getVisFilterBarHTML() +
        '<div class="vis-swatch-tray ds-swatch-tray">' +
        getVisSwatchesHTML(recommended, ens.fabrics[ens.activeGarment], null) +
        "</div>";

    // The menu follows whichever garment is active, so every garment
    // now has detailing rather than the jacket alone.
    var styleHTML = "";
    var garmentOpts = VIS_ENS_STYLE_OPTIONS[ens.activeGarment];
    var garmentStyle = ens.style[ens.activeGarment] || {};
    if (garmentOpts) {
        styleHTML = '<div class="ds-style-menu">';
        for (var groupKey in garmentOpts) {
            if (!garmentOpts.hasOwnProperty(groupKey)) continue;
            var opts = garmentOpts[groupKey];
            styleHTML += '<div class="ds-style-group">';
            for (var o = 0; o < opts.length; o++) {
                var isSel = garmentStyle[groupKey] === opts[o].key;
                styleHTML +=
                    '<button class="ds-style-opt' + (isSel ? " sel" : "") + '" data-action="vis-ens-style" data-group="' + groupKey + '" data-value="' + opts[o].key + '"' +
                    ' aria-pressed="' + (isSel ? "true" : "false") + '">' +
                    opts[o].label +
                    "</button>";
            }
            styleHTML += "</div>";
        }
        styleHTML += "</div>";

        // A "read about" row for the current selections. This is where
        // the guide meets the fitting: the client has just chosen a
        // jetted pocket, so the entry explaining jetted pockets is one
        // tap away rather than five levels down a tree.
        var reads = [];
        for (var rg in garmentOpts) {
            if (!garmentOpts.hasOwnProperty(rg)) continue;
            var rOpts = garmentOpts[rg];
            for (var ro = 0; ro < rOpts.length; ro++) {
                if (rOpts[ro].key === garmentStyle[rg] && rOpts[ro].topic) {
                    reads.push(
                        '<button class="ds-read-link" data-action="result-link" data-path=\'' +
                        JSON.stringify(rOpts[ro].topic) + "'>" + rOpts[ro].label + "</button>"
                    );
                    break;
                }
            }
        }
        if (reads.length) {
            styleHTML +=
                '<div class="ds-read-row">' +
                '<span class="ds-read-label">Read about</span>' +
                reads.join("") +
                "</div>";
        }
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
        getCompleteTheLookHTML(ens) +
        '<div class="ds-actions">' +
        '<button class="arch-btn-fill" data-action="vis-ens-export">Export Design Spec</button>' +
        '<button class="arch-btn-stroke" data-action="vis-ens-share">Share to Phone</button>' +
        "</div>" +
        '<button class="vis-mode-toggle" data-action="vis-ensemble-toggle">&larr; Back to one cloth</button>' +
        '<div class="vis-footnote">Garments shown as photographed mockups dressed in generated cloth previews.</div>' +
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
    // Photo garments repaint their canvas with the new cloth; a drawn
    // fallback garment (no photo yet) just swaps its tiled background.
    var canvas = document.getElementById("vis-ens-canvas-" + ens.activeGarment);
    if (canvas && typeof renderGarmentPhoto === "function") {
        canvas.setAttribute("data-cloth", fabricKey);
        renderGarmentPhoto(canvas, canvas.getAttribute("data-garment-key"), fabricKey);
    } else {
        var layer = document.getElementById("vis-ens-fabric-" + ens.activeGarment);
        if (layer) layer.style.backgroundImage = "url(" + getFabricTile(fabricKey) + ")";
    }
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
        // Built from the option labels themselves rather than a
        // hand-written sentence per garment, so a new option appears in
        // the spec automatically instead of being silently omitted.
        var styleNote = visEnsStyleNote(garment, ens.style[garment]);
        return (
            '<div style="padding:20px 0; border-bottom:1px solid #ddd5c8;">' +
            '<div style="' + eyebrow + ' margin-bottom:6px;">' + garment + "</div>" +
            '<div style="' + serif + ' font-size:24px; font-style:italic; margin-bottom:4px;">' + f.name + "</div>" +
            // Same rule as the info card: only print specs the cloth
            // actually carries, so the exported PDF never claims a
            // composition or weight that was never researched.
            '<div style="font-size:12px; color:#6b6155;">' +
            [f.mill, f.composition, f.weight, styleNote]
                .filter(function (part) { return !!part; })
                .join(" &nbsp;&middot;&nbsp; ") +
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
