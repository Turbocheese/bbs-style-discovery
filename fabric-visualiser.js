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

// getFabricByKey always returns a cloth (falling back to the first), so it
// cannot answer "does this key still exist". A session persisted before the
// 14->102 cloth rename can hold a key that no longer resolves (e.g. the old
// "hopsack"); renderGarmentPhoto then finds no cloth via findCloth(), clears
// the canvas and returns — leaving the garment blank, which reads on the
// cream sheet as a bare white/cream shape. This is the honest existence test.
function fabricResolves(key) {
    if (!key) return false;
    for (var i = 0; i < FABRIC_LIBRARY.length; i++) {
        if (FABRIC_LIBRARY[i].key === key) return true;
    }
    return false;
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
    // Phase 2 (Colour x Style journey): when the client has a colour result,
    // float cloths whose colour_family is in the profile's palette to the
    // front. Stable partition — matches keep their relative order, non-matches
    // keep theirs, so nothing is dropped or duplicated. With no colour result
    // the list is returned unchanged (graceful degrade).
    if (appState.colourResultKey && typeof getColourDirectionProfileData === "function") {
        var families = getColourDirectionProfileData(appState.colourResultKey).colourFamilies;
        if (families && families.length) {
            var matched = [], rest = [];
            for (var k = 0; k < keys.length; k++) {
                var fam = getFabricByKey(keys[k]).colour_family;
                if (families.indexOf(fam) !== -1) matched.push(keys[k]);
                else rest.push(keys[k]);
            }
            keys = matched.concat(rest);
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

// Reverse of WEAVE_TOPICS/PATTERN_TOPICS: given a guidePath (e.g. a
// Lookbook look's own guidePath), find which Cloth Room facet+value it
// names, if any. Derived from the same two maps, not new data -- a look
// whose guidePath points at a garment-style topic ("safari",
// "double_breasted", etc, the majority of them) simply has no match,
// which is the correct "no guessing at fabric identity" behaviour.
function getFacetForGuidePath(path) {
    if (!path || !path.length) return null;
    var joined = path.join("/");
    for (var w in WEAVE_TOPICS) {
        if (WEAVE_TOPICS.hasOwnProperty(w) && WEAVE_TOPICS[w].join("/") === joined) {
            return { facet: "weave", value: w };
        }
    }
    for (var p in PATTERN_TOPICS) {
        if (PATTERN_TOPICS.hasOwnProperty(p) && PATTERN_TOPICS[p].join("/") === joined) {
            return { facet: "pattern", value: p };
        }
    }
    return null;
}

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

// Fix 2: entering the Cloth Room with a colour result, default the Colour
// facet to the client's palette families (the profile's colourFamilies) so
// the room opens on their colours. Called once per entry (from the fabric-vis
// action), never per render, so the user's later filter edits stand. The
// "Show all cloths" affordance in the filter bar (vis-filter-clear) restores
// the full library. No colour result -> no-op, so behaviour is unchanged.
function applyClothRoomColourDefault() {
    if (!appState.colourResultKey || typeof getColourDirectionProfileData !== "function") return;
    var data = getColourDirectionProfileData(appState.colourResultKey);
    var families = data && data.colourFamilies;
    if (!families || !families.length) return;
    // Only default to families that actually exist as cloth colour_family
    // values, so the facet never selects a value that matches nothing.
    var present = {};
    for (var i = 0; i < FABRIC_LIBRARY.length; i++) {
        if (FABRIC_LIBRARY[i].colour_family) present[FABRIC_LIBRARY[i].colour_family] = true;
    }
    var sel = [];
    for (var f = 0; f < families.length; f++) {
        if (present[families[f]] && sel.indexOf(families[f]) === -1) sel.push(families[f]);
    }
    if (!sel.length) return;
    getVisFilters().colour_family = sel;
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

// How many cloths would be visible if this one value were selected on
// this facet, given whatever's already active on every OTHER facet
// (this facet's own current selection doesn't gate itself — the point is
// "what would picking this option get you", not "what does it get you
// combined with siblings in the same group", which OR-within-a-facet
// already makes redundant). Reuses the same OR-within/AND-across logic
// getFilteredCloths() already applies, just scoped to one candidate value.
function countClothsForFacetValue(facetKey, value) {
    var filters = getVisFilters();
    var n = 0;
    for (var i = 0; i < FABRIC_LIBRARY.length; i++) {
        var cloth = FABRIC_LIBRARY[i];
        if (getClothFacetValue(cloth, facetKey) !== value) continue;
        var keep = true;
        for (var f = 0; f < VIS_FACETS.length; f++) {
            var otherFacet = VIS_FACETS[f].key;
            if (otherFacet === facetKey) continue;
            var chosen = filters[otherFacet];
            if (!chosen.length) continue;
            if (chosen.indexOf(getClothFacetValue(cloth, otherFacet)) === -1) { keep = false; break; }
        }
        if (keep) n++;
    }
    return n;
}

// Cloth Room — Surprise Me. Picks `count` distinct cloths from `cloths`,
// preferring ones not in `excludeKeys` so a tap always changes what's
// showing. Falls back to the full pool if excluding leaves too few to
// fill `count`, and pads by repeating the last pick if `cloths` itself
// has fewer than `count` entries (e.g. a facet filtered down to one).
function pickRandomKeys(cloths, count, excludeKeys) {
    var pool = [];
    for (var i = 0; i < cloths.length; i++) {
        if (excludeKeys.indexOf(cloths[i].key) === -1) pool.push(cloths[i]);
    }
    if (pool.length < count) pool = cloths.slice();
    var picks = [];
    while (picks.length < count && pool.length) {
        picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0].key);
    }
    while (picks.length < count && picks.length) picks.push(picks[picks.length - 1]);
    return picks;
}

// Ensemble coordination: one garment (chosen at random) may get any
// cloth from the filtered pool; the other two are restricted to
// plain-pattern cloths (pattern === "none") so a loud pattern never
// doubles up across the outfit. Falls back to the full pool for the
// quiet slots if the current filter has no plain cloths at all.
function pickSurpriseEnsemble(pool) {
    var feature = VIS_ENS_GARMENTS[Math.floor(Math.random() * VIS_ENS_GARMENTS.length)];
    var featureKey = pickRandomKeys(pool, 1, [])[0];
    var quietPool = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].pattern === "none") quietPool.push(pool[i]);
    }
    if (!quietPool.length) quietPool = pool;
    var quietKeys = pickRandomKeys(quietPool, 2, [featureKey]);
    var fabrics = {};
    var qi = 0;
    for (var g = 0; g < VIS_ENS_GARMENTS.length; g++) {
        var garment = VIS_ENS_GARMENTS[g];
        fabrics[garment] = garment === feature ? featureKey : quietKeys[qi++];
    }
    return { fabrics: fabrics, feature: feature };
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
    var useDD = typeof getDropdownHTML === "function";

    var ddsHTML = "";
    for (var f = 0; f < VIS_FACETS.length; f++) {
        var facet = VIS_FACETS[f];
        // Values are collected from the library rather than hardcoded,
        // so a facet can never offer an option that matches nothing.
        var values = [];
        for (var i = 0; i < FABRIC_LIBRARY.length; i++) {
            var v = getClothFacetValue(FABRIC_LIBRARY[i], facet.key);
            if (v && values.indexOf(v) === -1) values.push(v);
        }
        values.sort();
        var chosen = filters[facet.key];

        var opts = getDropdownOptHTML("vis-filter-facet-clear", 'data-facet="' + facet.key + '"',
            chosen.length === 0, "Any " + facet.label.toLowerCase());
        for (var c = 0; c < values.length; c++) {
            var on = chosen.indexOf(values[c]) !== -1;
            var optCount = countClothsForFacetValue(facet.key, values[c]);
            opts += getDropdownOptHTML("vis-filter",
                'data-facet="' + facet.key + '" data-value="' + values[c] + '"',
                on, facetValueLabel(facet.key, values[c]) + " (" + optCount + ")");
        }
        var valText = chosen.length === 0 ? "Any" :
            (chosen.length === 1 ? facetValueLabel(facet.key, chosen[0]) : chosen.length + " chosen");
        ddsHTML += getDropdownHTML("vis-" + facet.key, facet.label, valText, chosen.length, opts);
    }

    return (
        '<div class="vis-filter-dd-bar">' +
        '<div class="filter-dd-row">' + ddsHTML + "</div>" +
        '<div class="filter-dd-meta">' +
        '<span class="filter-dd-count" id="vis-filter-count-text" role="status">' +
        shown + " of " + FABRIC_LIBRARY.length + " cloths</span>" +
        (active ? '<button class="filter-dd-clear btn-bare" data-action="vis-filter-clear">' +
            (appState.colourResultKey ? "Show all cloths" : "Clear all") + "</button>" : "") +
        "</div>" +
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
        // .btn-bare opts the card out of the global button:hover chrome invert
        // (button:hover:not(.btn-bare) { background: var(--accent) }), which
        // otherwise paints the whole card near-black on hover — turning a pale
        // cloth into a black box. See the "button:hover trap" note in CLAUDE.md.
        var cls = "vis-swatch btn-bare";
        if (recommended.indexOf(f.key) !== -1) cls += " reco";
        if (f.key === selKey) cls += " sel";
        else if (altKey && f.key === altKey) cls += " sel-alt";
        swatchesHTML +=
            '<button class="' + cls + '" data-action="vis-pick-fabric" data-fabric="' + f.key + '" aria-label="' + f.name + '" title="' + f.name + '">' +
            '<span class="vis-swatch-cloth" style="background-image:url(' + getFabricTile(f.key) + ')"></span>' +
            '<span class="vis-swatch-label">' +
            '<span class="vis-swatch-n">' + f.name + "</span>" +
            '<span class="vis-swatch-m">' + (f.mill || "") + "</span>" +
            "</span>" +
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

// Garment types offered in the Cloth Room's single-cloth and compare
// views. Each resolves to its base (no-spec-variant) photo through
// resolveGarmentKey — the same self-healing lookup the Ensemble builder
// already uses — so a future photo shoot never needs this list touched,
// only GARMENT_ASSET_KEYS in garment-photo.js.
// `dressesLead` fits "Filter the bunch... ___"; `compareLead` fits
// "___, two cloths" — trousers is plural-only ("dress themselves", "a
// pair of"), so neither can be composed from a single shared noun.
// `garment` is the category resolveGarmentKey's first argument expects
// ("jacket"/"vest"/"trousers") — Safari and Chore are both cut of
// "jacket" with a closure resolveGarmentKey has never seen before
// (only "sb"/"db" existed until now), NOT a new top-level category, so
// `key` (this picker's own identity) and `garment` diverge for them.
var VIS_SINGLE_GARMENTS = [
    { key: "jacket", garment: "jacket", label: "Jacket", dressesLead: "The jacket dresses itself the moment you choose.", compareLead: "One jacket", style: { closure: "sb" } },
    { key: "vest", garment: "vest", label: "Waistcoat", dressesLead: "The waistcoat dresses itself the moment you choose.", compareLead: "One waistcoat", style: { closure: "sb", lapel: "none" } },
    { key: "trousers", garment: "trousers", label: "Trousers", dressesLead: "The trousers dress themselves the moment you choose.", compareLead: "A pair of trousers", style: { style: "flat" } },
    // Casual jackets (23 Aug 2026) — photos not generated yet, so these
    // resolve to a key absent from GARMENT_ASSET_KEYS today. getVisGarmentHasPhoto
    // gates the stage on that and shows a "coming soon" card instead of a
    // broken canvas; self-heals the moment each photo lands and joins
    // GARMENT_ASSET_KEYS, same as every other self-healing key in this file.
    { key: "safari", garment: "jacket", label: "Safari Jacket", dressesLead: "The safari jacket dresses itself the moment you choose.", compareLead: "One safari jacket", style: { closure: "safari" } },
    { key: "chore", garment: "jacket", label: "Chore Jacket", dressesLead: "The chore jacket dresses itself the moment you choose.", compareLead: "One chore jacket", style: { closure: "chore" } }
];

function getVisGarmentEntry(garmentKey) {
    for (var i = 0; i < VIS_SINGLE_GARMENTS.length; i++) {
        if (VIS_SINGLE_GARMENTS[i].key === garmentKey) return VIS_SINGLE_GARMENTS[i];
    }
    return VIS_SINGLE_GARMENTS[0];
}

// Falls back to "jacket" for any persisted value that predates this
// feature (undefined) or no longer matches an offered garment.
function getVisGarmentKey() {
    var g = appState.visGarmentKey;
    for (var i = 0; i < VIS_SINGLE_GARMENTS.length; i++) {
        if (VIS_SINGLE_GARMENTS[i].key === g) return g;
    }
    return "jacket";
}

function getVisSingleGarmentPhotoKey(garmentKey) {
    var entry = getVisGarmentEntry(garmentKey);
    var key = typeof resolveGarmentKey === "function" ? resolveGarmentKey(entry.garment, entry.style) : null;
    return key || "jacket-sb";
}

// False until the photo actually lands in GARMENT_ASSET_KEYS — lets the
// stage show a "coming soon" card instead of trying to paint a canvas
// with an image that 404s.
function getVisGarmentHasPhoto(garmentKey) {
    var photoKey = getVisSingleGarmentPhotoKey(garmentKey);
    return typeof GARMENT_ASSET_KEYS !== "undefined" && GARMENT_ASSET_KEYS.indexOf(photoKey) !== -1;
}

function getVisGarmentComingSoonHTML(garmentEntry) {
    return (
        '<div class="vis-stage-invite vis-stage-invite--soon">' +
        '<span class="vis-stage-invite-mark" aria-hidden="true"></span>' +
        '<p class="vis-ghost-prompt">' + garmentEntry.label + " photography is on its way — check back soon.</p>" +
        "</div>"
    );
}

// Trousers are 2:3 (1073x1600); every other garment shot is 4:5
// (1289x1600) — same split the Ensemble builder already keys off.
function getVisGarmentCanvasWidth(garmentKey) {
    return garmentKey === "trousers" ? 1073 : 1289;
}

function getVisGarmentPickerHTML() {
    var active = getVisGarmentKey();
    var html = '<div class="vis-garment-picker">';
    for (var i = 0; i < VIS_SINGLE_GARMENTS.length; i++) {
        var g = VIS_SINGLE_GARMENTS[i];
        html += '<button class="vis-garment-chip' + (g.key === active ? " sel" : "") + '" type="button"' +
            ' data-action="vis-garment-pick" data-garment="' + g.key + '">' + g.label + "</button>";
    }
    html += "</div>";
    return html;
}

function renderFabricVisualiser() {
    var recommended = getRecommendedFabricKeys();
    var surpriseFlash = !!appState.visSurpriseFlash;
    appState.visSurpriseFlash = false;
    // Drop any persisted cloth key that no longer resolves, so a stale session
    // never dresses the single-cloth or compare garment in a blank cream shape.
    if (!fabricResolves(appState.visFabricKey)) appState.visFabricKey = null;
    if (appState.visFabricKeyB && !fabricResolves(appState.visFabricKeyB)) appState.visFabricKeyB = null;
    var hasSelection = fabricResolves(appState.visFabricKey);
    var activeKey = appState.visFabricKey || (recommended.length ? recommended[0] : FABRIC_LIBRARY[0].key);
    if (appState.visEnsemble) return renderClothEnsemble(recommended, surpriseFlash);
    if (appState.visCompare) return renderClothCompare(activeKey, recommended, surpriseFlash);
    var fabric = getFabricByKey(activeKey);
    var garmentKey = getVisGarmentKey();
    var garmentEntry = getVisGarmentEntry(garmentKey);
    var garmentPhotoKey = getVisSingleGarmentPhotoKey(garmentKey);
    var garmentCanvasW = getVisGarmentCanvasWidth(garmentKey);
    var garmentHasPhoto = getVisGarmentHasPhoto(garmentKey);

    return (
        '<div class="vis-shell' + (surpriseFlash ? " vis-surprise-reveal" : "") + '">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
        '<h1 class="vis-title">' + (typeof getKineticTitleHTML === "function" ? getKineticTitleHTML("See It In Cloth") : "See It In Cloth") + "</h1>" +
        '<p class="vis-lead">' + (hasSelection ? "Select a cloth from the bunch. The garment re-renders instantly, the way it would leave the workshop." : "Filter the bunch and tap a cloth. " + garmentEntry.dressesLead) + "</p>" +
        getVisGarmentPickerHTML() +
        '<div class="vis-stage vis-stage--photo' + (hasSelection && garmentHasPhoto ? "" : " vis-stage--empty") + '">' +
        // Fully blank until a cloth is chosen: no garment is rendered on entry
        // (no ghost silhouette), just the invitation. The canvas is inserted on
        // the first swatch tap by visApplyFabric, which then dresses it.
        // A garment with no photo yet (Safari/Chore before their shoot lands)
        // shows the same "coming soon" card regardless of cloth selection —
        // there's nothing to dress it with.
        (!garmentHasPhoto
            ? getVisGarmentComingSoonHTML(garmentEntry)
            : hasSelection
            ? '<canvas class="vis-jacket-canvas" id="vis-jacket-canvas" width="' + garmentCanvasW + '" height="1600"' +
              ' data-garment-key="' + garmentPhotoKey + '" data-cloth="' + activeKey + '"></canvas>'
            : '<div class="vis-stage-invite">' +
              '<span class="vis-stage-invite-mark" aria-hidden="true"></span>' +
              '<p class="vis-ghost-prompt">Pick a cloth to see it come to life.</p>' +
              "</div>") +
        "</div>" +
        '<div class="vis-mode-toggles">' +
        '<button class="vis-mode-toggle" data-action="vis-compare-toggle">Compare two cloths &rarr;</button>' +
        '<button class="vis-mode-toggle" data-action="vis-ensemble-toggle">Design an ensemble &rarr;</button>' +
        '<button class="vis-mode-toggle vis-surprise-btn" data-action="vis-surprise-me">Surprise Me</button>' +
        "</div>" +
        getVisFilterBarHTML() +
        '<div class="vis-swatch-tray">' + getVisSwatchesHTML(recommended, hasSelection ? activeKey : null, null) + "</div>" +
        getVisRecoStripHTML(recommended) +
        '<div class="vis-info" id="vis-info">' + (hasSelection ? getFabricInfoHTML(fabric) : "") + "</div>" +
        (hasSelection && typeof getClothStudyHTML === "function" ? getClothStudyHTML(fabric) : "") +
        "</div>"
    );
}

function getVisSplitPct() {
    var v = appState.visSplitPct;
    if (typeof v !== "number" || isNaN(v)) v = 50;
    return Math.max(4, Math.min(96, v));
}

function getVisSplitLayerHTML(side, key, pct, garmentPhotoKey, garmentCanvasW) {
    // Layer A is clipped from the right edge back to the divider. The clip
    // lives on this wrapper, so a photographed jacket canvas inside it is
    // revealed by the drag exactly as the old fabric layer was.
    var clip = side === "a" ? ' style="clip-path:inset(0 ' + (100 - pct) + '% 0 0)"' : "";
    return (
        '<div class="vis-split-layer vis-split-layer--' + side + '" id="vis-split-layer-' + side + '"' + clip + ">" +
        '<canvas class="vis-jacket-canvas vis-split-canvas" id="vis-split-canvas-' + side + '" width="' + garmentCanvasW + '" height="1600"' +
        ' data-garment-key="' + garmentPhotoKey + '" data-cloth="' + key + '"></canvas>' +
        "</div>"
    );
}

function renderClothCompare(aKey, recommended, surpriseFlash) {
    var bKey = appState.visFabricKeyB || visDefaultCompareKey(aKey);
    var side = appState.visCompareSide === "b" ? "b" : "a";
    var selKey = side === "a" ? aKey : bKey;
    var altKey = side === "a" ? bKey : aKey;
    var pct = getVisSplitPct();
    var garmentKey = getVisGarmentKey();
    var garmentEntry = getVisGarmentEntry(garmentKey);
    var garmentPhotoKey = getVisSingleGarmentPhotoKey(garmentKey);
    var garmentCanvasW = getVisGarmentCanvasWidth(garmentKey);
    var garmentHasPhoto = getVisGarmentHasPhoto(garmentKey);

    var a = getFabricByKey(aKey);
    var b = getFabricByKey(bKey);

    return (
        '<div class="vis-shell' + (surpriseFlash ? " vis-surprise-reveal" : "") + '">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
        "<h1 class=\"vis-title\">Two Cloths, One Decision</h1>" +
        '<p class="vis-lead">' + garmentEntry.compareLead + ', two cloths. Drag the chalk line across to see where each one takes it.</p>' +
        getVisGarmentPickerHTML() +

        (!garmentHasPhoto
            ? '<div class="vis-stage vis-stage--photo">' + getVisGarmentComingSoonHTML(garmentEntry) + "</div>"
            : '<div class="vis-split-stage" id="vis-split-stage">' +
              getVisSplitLayerHTML("b", bKey, pct, garmentPhotoKey, garmentCanvasW) +
              getVisSplitLayerHTML("a", aKey, pct, garmentPhotoKey, garmentCanvasW) +
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
              '<button class="vis-split-side btn-bare' + (side === "a" ? " sel" : "") + '" data-action="vis-side" data-side="a">' +
              '<span class="vis-split-side-tag">Left</span>' +
              '<span class="vis-split-side-name">' + a.name + "</span>" +
              "</button>" +
              '<button class="vis-split-side btn-bare' + (side === "b" ? " sel" : "") + '" data-action="vis-side" data-side="b">' +
              '<span class="vis-split-side-tag">Right</span>' +
              '<span class="vis-split-side-name">' + b.name + "</span>" +
              "</button>" +
              "</div>") +

        '<button class="vis-mode-toggle" data-action="vis-compare-toggle">&larr; Back to one cloth</button>' +
        '<button class="vis-mode-toggle vis-surprise-btn" data-action="vis-surprise-me">Surprise Me</button>' +
        getVisFilterBarHTML() +
        '<div class="vis-swatch-tray">' + getVisSwatchesHTML(recommended, selKey, altKey) + "</div>" +
        getVisRecoStripHTML(recommended) +
        '<div class="vis-info vis-info--cmp" id="vis-info-' + side + '">' +
        getFabricInfoHTML(side === "a" ? a : b) + "</div>" +
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
    // A "coming soon" garment (no photo yet) has nothing to dress — the
    // stage already shows that card regardless of cloth selection, and
    // there's no #vis-jacket-canvas for this fast-path DOM patch to touch.
    if (!getVisGarmentHasPhoto(getVisGarmentKey())) return;
    var stage = document.querySelector(".vis-stage--empty");
    if (stage) {
        stage.classList.remove("vis-stage--empty");
        // Blank entry: the stage held only the invitation (no canvas). Clear it
        // and build the jacket canvas now, so the first tap dresses a real garment.
        var invite = stage.querySelector(".vis-stage-invite");
        if (invite) invite.parentNode.removeChild(invite);
        if (!document.getElementById("vis-jacket-canvas")) {
            var garmentKey = getVisGarmentKey();
            var fresh = document.createElement("canvas");
            fresh.className = "vis-jacket-canvas";
            fresh.id = "vis-jacket-canvas";
            fresh.width = getVisGarmentCanvasWidth(garmentKey);
            fresh.height = 1600;
            fresh.setAttribute("data-garment-key", getVisSingleGarmentPhotoKey(garmentKey));
            stage.appendChild(fresh);
        }
    }
    var canvas = document.getElementById("vis-jacket-canvas");
    if (canvas && typeof renderGarmentPhoto === "function") {
        canvas.setAttribute("data-cloth", key);
        renderGarmentPhoto(canvas, canvas.getAttribute("data-garment-key"), key, appState.visLighting || "daylight");
    }
    var info = document.getElementById("vis-info");
    if (info) info.innerHTML = getFabricInfoHTML(getFabricByKey(key));
    // Rebuild the cloth-study tools for the newly selected cloth (this is a
    // partial update, so the study block below the info card must be refreshed
    // in step — it re-initialises its drape/sheen/pairing off the new key).
    // On the neutral entry (no cloth chosen yet) the cstudy block was never
    // rendered at all, so there is nothing to swap on the first tap — insert
    // it fresh right after the info card instead.
    var study = document.getElementById("cstudy");
    if (study && typeof getClothStudyHTML === "function") {
        study.outerHTML = getClothStudyHTML(getFabricByKey(key));
        if (typeof initClothStudy === "function") initClothStudy();
    } else if (!study && info && typeof getClothStudyHTML === "function") {
        info.insertAdjacentHTML("afterend", getClothStudyHTML(getFabricByKey(key)));
        if (typeof initClothStudy === "function") initClothStudy();
    }
    visSyncSwatchMarks(key, null);
}

// Compare mode: dress one side. Call after appState is updated.
function visApplyCompareFabric(side, key) {
    var canvas = document.getElementById("vis-split-canvas-" + side);
    if (canvas && typeof renderGarmentPhoto === "function") {
        canvas.setAttribute("data-cloth", key);
        renderGarmentPhoto(canvas, canvas.getAttribute("data-garment-key"), key, appState.visLighting || "daylight");
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

// Is `value` a currently-offered key for a garment's style group? Used to
// scrub a persisted option that has since been retired from the menu (e.g. the
// dropped single-pleat trouser) back to a default, before it resolves to a
// garment photo that no longer exists.
function ensStyleValueAllowed(garment, group, value) {
    var groups = VIS_ENS_STYLE_OPTIONS[garment];
    if (!groups || !groups[group]) return false;
    var opts = groups[group];
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].key === value) return true;
    }
    return false;
}

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

// ---- Bespoke Spec Configurator (2026-08-17) ----
// Deliberately separate from VIS_ENS_STYLE_OPTIONS/VIS_ENS_STYLE_DEFAULTS
// above, not folded into them. Task 8 (21 July) removed jacket lapel/
// pocket and trouser waistband from that menu specifically because no
// garment photograph varied with them at the time — see that block's own
// comment. This is fundamentally still an ORDER SPEC first (a real
// tailor's fitting form captures exactly this kind of construction detail
// in writing, independent of what a stock photo shows), not a guarantee
// of a visual change — but as of the photography added this session,
// jacket lapelStyle and pockets DO now have real photo variants for some
// combinations (see resolveGarmentKey in garment-photo.js), and the
// Compare toggle on each group (getBespokeCompareStripHTML below) shows
// exactly which combinations currently have a distinct photo vs. which
// still fall back to the base look. Trouser pleat/waistband have no
// variant photos yet — see docs/2026-08-17-bespoke-spec-image-prompts.md.
var BESPOKE_SPEC_OPTIONS = {
    jacket: {
        lapelStyle: [
            { key: "notch", label: "Standard Notch", detail: "8.5cm lapel width", topic: ["tailoring", "jackets", "details", "lapels", "notch_lapel"] },
            { key: "peak", label: "Wide Peak", detail: "9.5cm lapel width", topic: ["tailoring", "jackets", "details", "lapels", "peak_lapel"] }
        ],
        pockets: [
            { key: "patch", label: "Neapolitan Patch", detail: "Casual", topic: ["tailoring", "jackets", "details", "pocket_styles", "patch_pockets"] },
            { key: "flap", label: "Classic Flap", detail: "Corporate", topic: ["tailoring", "jackets", "details", "pocket_styles", "flap_pockets"] }
        ]
    },
    trousers: {
        pleat: [
            { key: "flat", label: "Flat Front", detail: "", topic: ["tailoring", "trousers", "configuration", "pleats", "flat_front"] },
            { key: "single", label: "Single Forward Pleat", detail: "", topic: ["tailoring", "trousers", "configuration", "pleats", "single_pleats"] },
            { key: "double", label: "Double Forward Pleat", detail: "", topic: ["tailoring", "trousers", "configuration", "pleats", "double_pleats"] }
        ],
        waistband: [
            { key: "beltLoops", label: "Standard Belt Loops", detail: "", topic: ["tailoring", "trousers", "configuration", "waistbands", "belt_loops"] },
            { key: "sideAdjusters", label: "Extended Waistband", detail: "Side adjusters", topic: ["tailoring", "trousers", "configuration", "waistbands", "side_adjusters"] }
        ]
    }
};

var BESPOKE_SPEC_DEFAULTS = {
    jacket: { lapelStyle: "notch", pockets: "flap" },
    trousers: { pleat: "flat", waistband: "beltLoops" }
};

function ensSpecValueAllowed(garment, group, value) {
    var groups = BESPOKE_SPEC_OPTIONS[garment];
    if (!groups || !groups[group]) return false;
    var opts = groups[group];
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].key === value) return true;
    }
    return false;
}

// Same lookup-the-label-back approach as visEnsStyleNote, for the Spec
// Card and the Design Spec PDF/Firestore payload.
function bespokeSpecOptionFor(garment, group, value) {
    var groups = BESPOKE_SPEC_OPTIONS[garment];
    if (!groups || !groups[group]) return null;
    var opts = groups[group];
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].key === value) return opts[i];
    }
    return null;
}

// ---- Bespoke Spec Configurator: drawer markup ----
// Global to the outfit (not scoped to ens.activeGarment the way "Style
// It" is) — this is one order form covering every included garment that
// has spec options, not a per-piece control.
function getBespokeSpecGroupHTML(garment, groupKey, groupLabel, current, ens) {
    var opts = BESPOKE_SPEC_OPTIONS[garment][groupKey];
    var compareKey = garment + ":" + groupKey;
    var comparing = appState.bespokeCompareKey === compareKey;
    var canCompare = fabricResolves(ens.fabrics[garment]) && opts.length > 1;
    var html =
        '<div class="ds-bespoke-group">' +
        '<div class="ds-bespoke-group-head">' +
        '<div class="ds-bespoke-group-label">' + groupLabel + "</div>" +
        (canCompare
            ? '<button class="ds-bespoke-compare-toggle btn-bare' + (comparing ? " sel" : "") +
              '" type="button" data-action="bespoke-compare-toggle" data-garment="' + garment +
              '" data-group="' + groupKey + '" aria-pressed="' + (comparing ? "true" : "false") + '">' +
              (comparing ? "Hide compare" : "Compare") + "</button>"
            : "") +
        "</div>" +
        '<div class="ds-bespoke-opts">';
    for (var i = 0; i < opts.length; i++) {
        var sel = opts[i].key === current;
        html +=
            '<button class="ds-bespoke-opt btn-bare' + (sel ? " sel" : "") +
            '" type="button" data-action="bespoke-spec-select" data-garment="' + garment +
            '" data-group="' + groupKey + '" data-value="' + opts[i].key +
            '" aria-pressed="' + (sel ? "true" : "false") + '">' +
            '<span class="ds-bespoke-opt-label">' + opts[i].label + "</span>" +
            (opts[i].detail ? '<span class="ds-bespoke-opt-detail">' + opts[i].detail + "</span>" : "") +
            "</button>";
    }
    html += "</div>";
    if (comparing) html += getBespokeCompareStripHTML(garment, groupKey, ens);
    html += "</div>";
    return html;
}

// The side-by-side comparison strip: one small canvas per option in this
// group, cloth held fixed, every OTHER spec field held at its current
// value — only groupKey varies between panels, so what changes on screen
// is exactly what the client is choosing between. Each canvas carries the
// same [data-garment-key][data-cloth] contract as every other photographed
// garment canvas in this app, so startVisEnsPhotos() paints these for
// free — no separate paint call needed here.
function getBespokeCompareStripHTML(garment, groupKey, ens) {
    var opts = BESPOKE_SPEC_OPTIONS[garment][groupKey];
    var clothKey = ens.fabrics[garment];
    var baseStyle = ens.style[garment] || {};
    var baseSpec = ens.spec[garment] || {};
    var w = garment === "trousers" ? 1073 : 1289;
    var html = '<div class="ds-bespoke-compare-strip">';
    for (var i = 0; i < opts.length; i++) {
        var panelSpec = {};
        for (var k in baseSpec) { if (baseSpec.hasOwnProperty(k)) panelSpec[k] = baseSpec[k]; }
        panelSpec[groupKey] = opts[i].key;
        var key = typeof resolveGarmentKey === "function" ? resolveGarmentKey(garment, baseStyle, panelSpec) : null;
        if (!key) continue;
        var sel = opts[i].key === baseSpec[groupKey];
        html +=
            '<div class="ds-bespoke-compare-panel' + (sel ? " sel" : "") + '">' +
            '<canvas class="ds-bespoke-compare-canvas" width="' + w + '" height="1600"' +
            ' data-garment-key="' + key + '" data-cloth="' + clothKey + '"></canvas>' +
            '<button class="ds-bespoke-compare-pick btn-bare" type="button" data-action="bespoke-spec-select"' +
            ' data-garment="' + garment + '" data-group="' + groupKey + '" data-value="' + opts[i].key + '">' +
            (sel ? "Selected — " : "Use ") + opts[i].label +
            "</button>" +
            "</div>";
    }
    html += "</div>";
    return html;
}

function getBespokeSpecDrawerHTML(ens) {
    var hasJacket = ens.garments.indexOf("jacket") !== -1;
    var hasTrousers = ens.garments.indexOf("trousers") !== -1;
    if (!hasJacket && !hasTrousers) return "";

    var open = !!appState.bespokeDrawerOpen;
    var groupsHTML = "";
    if (hasJacket) {
        groupsHTML += getBespokeSpecGroupHTML("jacket", "lapelStyle", "Jacket — Lapel", ens.spec.jacket.lapelStyle, ens);
        groupsHTML += getBespokeSpecGroupHTML("jacket", "pockets", "Jacket — Pockets", ens.spec.jacket.pockets, ens);
    }
    if (hasTrousers) {
        groupsHTML += getBespokeSpecGroupHTML("trousers", "pleat", "Trousers — Pleat", ens.spec.trousers.pleat, ens);
        groupsHTML += getBespokeSpecGroupHTML("trousers", "waistband", "Trousers — Waistband", ens.spec.trousers.waistband, ens);
    }

    return (
        '<div class="ds-section ds-bespoke-section">' +
        '<button class="ds-bespoke-toggle btn-bare" type="button" data-action="bespoke-drawer-toggle" aria-expanded="' + (open ? "true" : "false") + '" aria-controls="ds-bespoke-drawer">' +
        '<span class="ds-bespoke-toggle-label">Bespoke Spec</span>' +
        '<span class="ds-bespoke-toggle-hint">Construction details for the tailor — tap Compare to see a choice on the garment</span>' +
        '<span class="ds-bespoke-toggle-chevron" aria-hidden="true"></span>' +
        "</button>" +
        '<div class="ds-bespoke-drawer' + (open ? " open" : "") + '" id="ds-bespoke-drawer">' +
        '<div class="ds-bespoke-drawer-inner">' + groupsHTML + "</div>" +
        "</div>" +
        "</div>"
    );
}

// ---- Bespoke Spec Card: the showroom-floor summary ----
// Lives next to Export Design Spec / Share to Phone in the Ensemble's own
// results area — see the design conversation this was scoped from: the
// quiz result screens and this Ensemble/Outfit Builder are two currently-
// unconnected flows, so a card that depends on Bespoke Spec state belongs
// where that state actually lives, not bolted onto an unrelated screen.
function bespokeSpecCardRow(label, garment, spec, groupKeys) {
    var parts = [];
    for (var i = 0; i < groupKeys.length; i++) {
        var opt = bespokeSpecOptionFor(garment, groupKeys[i], spec[groupKeys[i]]);
        if (opt) parts.push(opt.label + (opt.detail ? " (" + opt.detail + ")" : ""));
    }
    return (
        '<div class="ds-bespoke-spec-row">' +
        '<span class="ds-bespoke-spec-row-label">' + label + "</span>" +
        '<span class="ds-bespoke-spec-row-value">' + parts.join(", ") + "</span>" +
        "</div>"
    );
}

function getBespokeSpecCardHTML(ens) {
    var hasJacket = ens.garments.indexOf("jacket") !== -1;
    var hasTrousers = ens.garments.indexOf("trousers") !== -1;
    if (!hasJacket && !hasTrousers) return "";

    var rows = "";
    if (hasJacket) rows += bespokeSpecCardRow("Jacket", "jacket", ens.spec.jacket, ["lapelStyle", "pockets"]);
    if (hasTrousers) rows += bespokeSpecCardRow("Trousers", "trousers", ens.spec.trousers, ["pleat", "waistband"]);

    // idle: no save attempted yet this session. pending: a save is in
    // flight or queued offline. synced: the write is confirmed live in
    // Firestore (see saveCustomConfiguration's onSynced in client-profile.js).
    var syncState = ens.lastConfigSynced === true ? "synced" : ens.lastConfigId ? "pending" : "idle";
    var syncLabel = syncState === "synced" ? "Configuration Synced" : syncState === "pending" ? "Syncing…" : "Not yet saved";

    return (
        '<div class="ds-bespoke-spec-card" id="ds-bespoke-spec-card">' +
        '<div class="ds-bespoke-spec-eyebrow">Bespoke Spec</div>' +
        '<div class="ds-bespoke-spec-rows">' + rows + "</div>" +
        '<div class="ds-bespoke-spec-sync ds-bespoke-spec-sync--' + syncState + '" id="ds-bespoke-spec-sync">' +
        '<span class="ds-bespoke-spec-sync-dot" aria-hidden="true"></span>' +
        '<span class="ds-bespoke-spec-sync-label">' + syncLabel + "</span>" +
        (ens.lastConfigId ? '<span class="ds-bespoke-spec-sync-id">' + ens.lastConfigId + "</span>" : "") +
        "</div>" +
        "</div>"
    );
}

// Partial update after a save's onSynced fires, or after a spec option
// changes — swaps just this card, not a full render(). A no-op if the
// client has since left the ensemble view (card no longer mounted).
function updateBespokeSpecCard() {
    var existing = document.getElementById("ds-bespoke-spec-card");
    if (!existing) return;
    existing.outerHTML = getBespokeSpecCardHTML(getVisEnsembleState());
}

// Called from exportEnsembleSpec()/shareEnsemble() — both count as "the
// client is taking this design away" for the purposes of the brief's
// "when the client saves their outfit" trigger. Fire-and-forget: never
// blocks the actual PDF/share path, and a client with no jacket or
// trousers in the outfit (nothing Bespoke Spec covers) triggers nothing.
function triggerCustomConfigSave() {
    if (typeof saveCustomConfiguration !== "function") return;
    var ens = getVisEnsembleState();
    var selections = {};
    if (ens.garments.indexOf("jacket") !== -1) selections.jacket = ens.spec.jacket;
    if (ens.garments.indexOf("trousers") !== -1) selections.trousers = ens.spec.trousers;
    if (!selections.jacket && !selections.trousers) return;

    ens.lastConfigId = saveCustomConfiguration(selections, function (ok) {
        ens.lastConfigSynced = ok;
        localStorage.setItem("bbs_session", JSON.stringify(appState));
        updateBespokeSpecCard();
    });
    ens.lastConfigSynced = false;
    localStorage.setItem("bbs_session", JSON.stringify(appState));
    updateBespokeSpecCard();
}

function getVisEnsembleState() {
    // Build-your-own outfit: a fresh session starts EMPTY. The client adds
    // garments (jacket / vest / trousers) one at a time and dresses each. The
    // included set is `garments` (a subset of VIS_ENS_GARMENTS, in that order);
    // `fabrics[g]` is present only once a cloth is chosen for g (absent = an
    // empty placeholder slot); `activeGarment` is the piece being edited (a
    // member of `garments`, or null when the outfit is empty).
    if (!appState.visEnsembleState || typeof appState.visEnsembleState !== "object") {
        appState.visEnsembleState = {
            garments: [],
            activeGarment: null,
            fabrics: {},
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

    // Fill any missing garment or option from defaults, so a state saved
    // before an option existed still renders — and, crucially, reset any saved
    // option whose value is no longer offered. Trousers dropped the single-pleat
    // and Gurkha makes; a session persisted with style.trousers.style = "single"
    // resolves to a "trousers-single" photo that no longer exists, dropping the
    // garment onto the hand-drawn fallback — which has no trouser clip or shading
    // and renders as a bare white/cream shape (the reported trouser bug).
    for (var garment in VIS_ENS_STYLE_DEFAULTS) {
        if (!VIS_ENS_STYLE_DEFAULTS.hasOwnProperty(garment)) continue;
        if (!ens.style[garment] || typeof ens.style[garment] !== "object") ens.style[garment] = {};
        for (var opt in VIS_ENS_STYLE_DEFAULTS[garment]) {
            if (!VIS_ENS_STYLE_DEFAULTS[garment].hasOwnProperty(opt)) continue;
            var cur = ens.style[garment][opt];
            // A menu-driven option must hold one of its currently-offered values;
            // an option with no menu (a fixed detail) only needs to be present.
            var menu = VIS_ENS_STYLE_OPTIONS[garment] && VIS_ENS_STYLE_OPTIONS[garment][opt];
            var valid = cur && (!menu || ensStyleValueAllowed(garment, opt, cur));
            if (!valid) ens.style[garment][opt] = VIS_ENS_STYLE_DEFAULTS[garment][opt];
        }
    }

    // Same backfill shape as style above, for the Bespoke Spec
    // Configurator's own (photo-independent) selections.
    if (!ens.spec || typeof ens.spec !== "object") ens.spec = {};
    for (var specGarment in BESPOKE_SPEC_DEFAULTS) {
        if (!BESPOKE_SPEC_DEFAULTS.hasOwnProperty(specGarment)) continue;
        if (!ens.spec[specGarment] || typeof ens.spec[specGarment] !== "object") ens.spec[specGarment] = {};
        for (var specOpt in BESPOKE_SPEC_DEFAULTS[specGarment]) {
            if (!BESPOKE_SPEC_DEFAULTS[specGarment].hasOwnProperty(specOpt)) continue;
            var specCur = ens.spec[specGarment][specOpt];
            if (!specCur || !ensSpecValueAllowed(specGarment, specOpt, specCur)) {
                ens.spec[specGarment][specOpt] = BESPOKE_SPEC_DEFAULTS[specGarment][specOpt];
            }
        }
    }

    if (!ens.fabrics || typeof ens.fabrics !== "object") ens.fabrics = {};

    // Migration to build-your-own: a pre-change session had no `garments` list
    // but always carried a cloth for all three garments (jacket / vest /
    // trousers). Derive the included set from the fabrics it had, so a returning
    // session keeps exactly the outfit it was showing.
    if (!Array.isArray(ens.garments)) {
        var derived = [];
        for (var gi = 0; gi < VIS_ENS_GARMENTS.length; gi++) {
            var gg = VIS_ENS_GARMENTS[gi];
            if (ens.fabrics.hasOwnProperty(gg) && ens.fabrics[gg]) derived.push(gg);
        }
        ens.garments = derived;
    }

    // Sanitise the included set: only known garments, no duplicates, canonical
    // order (jacket, vest, trousers) regardless of how it was persisted.
    var clean = [];
    for (var ci = 0; ci < VIS_ENS_GARMENTS.length; ci++) {
        if (ens.garments.indexOf(VIS_ENS_GARMENTS[ci]) !== -1) clean.push(VIS_ENS_GARMENTS[ci]);
    }
    ens.garments = clean;

    // Validate persisted cloth keys. A key saved before the 14->102 cloth
    // rename may no longer resolve; renderGarmentPhoto then leaves that
    // garment's canvas blank (the old trouser bug). For an INCLUDED garment,
    // reset an unresolvable key to a sensible default so it still dresses; drop
    // any stray fabric for a garment that is not included. A garment with no
    // fabric entry at all is a deliberate empty slot and is left untouched.
    var recoKeys = getRecommendedFabricKeys();
    var fabricDefaults = {
        jacket: recoKeys.length ? recoKeys[0] : FABRIC_LIBRARY[0].key,
        vest: "solbiati_wool_silk_linen",
        trousers: "fox_flannel_mid_grey"
    };
    for (var fk in ens.fabrics) {
        if (!ens.fabrics.hasOwnProperty(fk)) continue;
        if (ens.garments.indexOf(fk) === -1) { delete ens.fabrics[fk]; continue; }
        if (ens.fabrics[fk] && !fabricResolves(ens.fabrics[fk])) {
            ens.fabrics[fk] = fabricResolves(fabricDefaults[fk]) ? fabricDefaults[fk] : FABRIC_LIBRARY[0].key;
        }
    }

    // The active garment must be one that is actually included (or null when
    // the outfit is empty), so the swatch tray and style menu always target a
    // real slot.
    if (!ens.activeGarment || ens.garments.indexOf(ens.activeGarment) === -1) {
        ens.activeGarment = ens.garments.length ? ens.garments[0] : null;
    }
    return ens;
}

// The cloth that "Complete the Look" and the register read from: the first
// dressed garment in the outfit (jacket first). null when nothing is dressed.
function ensLeadFabricKey(ens) {
    for (var i = 0; i < ens.garments.length; i++) {
        var k = ens.fabrics[ens.garments[i]];
        if (fabricResolves(k)) return k;
    }
    return null;
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
        { slot: "Belt", label: "Dress Belt", note: "Narrow, smooth leather, matched to the shoe.", topic: ["accessories", "belts", "dress_belt"] },
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
    // Read the register off the lead cloth (first dressed garment). In a
    // build-your-own outfit the jacket may not be included, so this no longer
    // assumes ens.fabrics.jacket exists.
    var leadKey = ensLeadFabricKey(ens);
    if (!leadKey) return "";
    var jacketCloth = getFabricByKey(leadKey);
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

// An included garment with no cloth chosen yet: a quiet, on-brand empty slot
// that holds the garment's footprint and invites a choice. No canvas is drawn
// until a cloth is picked (build-your-own: a piece stays blank until dressed).
function getVisEnsPlaceholderBlock(garment, ens) {
    var activeClass = ens.activeGarment === garment ? " active" : "";
    var enterClass = ens.justAdded === garment ? " ds-garment-enter" : "";
    var label = garment.charAt(0).toUpperCase() + garment.slice(1);
    return (
        '<div class="ds-garment ds-garment--' + garment + " ds-garment--empty" + activeClass + enterClass + '" data-action="vis-ens-garment" data-garment="' + garment + '">' +
        '<div class="ds-garment-empty-inner">' +
        '<span class="ds-garment-empty-mark" aria-hidden="true"></span>' +
        '<span class="ds-garment-empty-hint">Choose a cloth</span>' +
        "</div>" +
        '<div class="ds-garment-label">' + label + "</div>" +
        "</div>"
    );
}

function getVisEnsGarmentBlock(garment, ens) {
    var fabricKey = ens.fabrics[garment];
    // Blank slot until a cloth is chosen for this piece.
    if (!fabricResolves(fabricKey)) return getVisEnsPlaceholderBlock(garment, ens);
    var style = ens.style[garment] || {};
    var spec = ens.spec && ens.spec[garment];
    var activeClass = ens.activeGarment === garment ? " active" : "";
    var label = garment.charAt(0).toUpperCase() + garment.slice(1);

    // Photo path: the garment is drawn by compositing the selected cloth
    // into a photographed grey mockup (garment-photo.js). The actual pixels
    // are painted after the DOM lands, by startVisEnsPhotos(). `spec` lets
    // resolveGarmentKey prefer a Bespoke Spec photo variant when one
    // exists, falling back to the plain style-only key otherwise.
    var photoKey = typeof resolveGarmentKey === "function" ? resolveGarmentKey(garment, style, spec) : null;
    var hasPhoto = photoKey && typeof GARMENT_ASSET_KEYS !== "undefined" &&
        GARMENT_ASSET_KEYS.indexOf(photoKey) !== -1;

    // Trousers always have a photograph — the hand-drawn fallback below only
    // covers a jacket or vest (there is no trouser clip or shading). If a
    // trouser style ever resolves to a missing asset, dress it in the default
    // make rather than dropping it onto that fallback, which renders blank.
    if (garment === "trousers" && !hasPhoto && typeof resolveGarmentKey === "function") {
        photoKey = resolveGarmentKey("trousers", { style: VIS_ENS_STYLE_DEFAULTS.trousers.style });
        hasPhoto = typeof GARMENT_ASSET_KEYS !== "undefined" &&
            GARMENT_ASSET_KEYS.indexOf(photoKey) !== -1;
    }

    if (hasPhoto) {
        // Buffer matches the asset's native size so renderGarmentPhoto
        // draws it 1:1. Trousers are 1073x1600, everything else 1289x1600.
        var w = garment === "trousers" ? 1073 : 1289;
        return (
            '<div class="ds-garment ds-garment--' + garment + " has-photo" + activeClass + '" data-action="vis-ens-garment" data-garment="' + garment + '">' +
            '<canvas class="ds-garment-canvas" id="vis-ens-canvas-' + garment + '" width="' + w + '" height="1600"' +
            ' data-garment-key="' + photoKey + '" data-cloth="' + fabricKey + '"></canvas>' +
            getEnsHotspotsHTML(garment) +
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

// ---- Neapolitan Detail Hotspots ----
// Three fixed points (fractions of the garment's own photographed frame,
// same coordinate convention DISPLACEMENT_REGIONS uses in garment-photo.js)
// calling out construction details that don't change with the cloth or the
// closure/style chosen, so the positions are constants rather than derived
// from the active style. Content lives here rather than in a topic page —
// this is about how BBS makes the garment, not a guide entry a client
// would search for on their own.
var ENS_HOTSPOTS = {
    "jacket-shoulder": {
        title: "Spalla Camicia",
        body: "The shoulder is set the way a shirtsleeve is — no wadding, no roped crown, just the cloth gathered soft onto the armhole. It ripples slightly rather than sitting flat: the hallmark of a hand-set sleeve, not a machine one."
    },
    "jacket-lapel": {
        title: "3-Roll-2 Lapel",
        body: "Cut for three buttons but rolled to the second, so the top button sits hidden under the roll rather than fastened. The lapel line reads longer and softer than a true two-button cut, without losing the third button's balance."
    },
    "trouser-waistband": {
        title: "Side Adjusters",
        body: "No belt — a strap and buckle at each hip take up the waist instead, so nothing interrupts the line at the front. An extended waistband tab and a balanced rise keep the trouser sitting clean without one."
    }
};

function getEnsHotspotsHTML(garment) {
    if (garment === "jacket") {
        return (
            '<button class="ds-hotspot ds-hotspot--shoulder btn-bare" type="button" data-action="vis-ens-hotspot" data-hotspot="jacket-shoulder" aria-label="Spalla Camicia shoulder detail"><span class="ds-hotspot-dot" aria-hidden="true"></span></button>' +
            '<button class="ds-hotspot ds-hotspot--lapel btn-bare" type="button" data-action="vis-ens-hotspot" data-hotspot="jacket-lapel" aria-label="3-roll-2 lapel detail"><span class="ds-hotspot-dot" aria-hidden="true"></span></button>'
        );
    }
    if (garment === "trousers") {
        return '<button class="ds-hotspot ds-hotspot--waistband btn-bare" type="button" data-action="vis-ens-hotspot" data-hotspot="trouser-waistband" aria-label="Side adjuster waistband detail"><span class="ds-hotspot-dot" aria-hidden="true"></span></button>';
    }
    return "";
}

// Card + backdrop are created once, imperatively, and appended straight to
// document.body — the one deliberate exception to this app's render()
// string-concatenation-into-#app.innerHTML convention, for a genuine reason:
// #app itself carries a `both`-fill view-transition animation
// (#app:not(.is-transitioning) { animation: viewFadeIn ... both }, see
// styles.css) whose final keyframe still sets `transform: translateY(0)`.
// CSS makes ANY element with a non-none computed transform — including that
// identity one — the containing block for its position:fixed descendants,
// so a card living anywhere inside #app's own HTML can never be genuinely
// centred on the viewport; it renders relative to #app's (often much
// taller, scrolled-off-screen) box instead. Living on document.body, which
// carries no such animation, sidesteps that entirely.
var _ensHotspotEls = null;

function ensureEnsHotspotCard() {
    if (_ensHotspotEls) return _ensHotspotEls;
    var backdrop = document.createElement("div");
    backdrop.className = "ds-hotspot-backdrop";
    backdrop.id = "ds-hotspot-backdrop";
    backdrop.setAttribute("data-action", "vis-ens-hotspot-close");
    backdrop.hidden = true;

    var card = document.createElement("div");
    card.className = "ds-hotspot-card";
    card.id = "ds-hotspot-card";
    card.hidden = true;
    card.innerHTML =
        '<button class="ds-hotspot-close btn-bare" type="button" data-action="vis-ens-hotspot-close" aria-label="Close">&times;</button>' +
        '<div class="ds-hotspot-card-title" id="ds-hotspot-card-title"></div>' +
        '<p class="ds-hotspot-card-body" id="ds-hotspot-card-body"></p>';

    document.body.appendChild(backdrop);
    document.body.appendChild(card);
    _ensHotspotEls = { backdrop: backdrop, card: card };
    return _ensHotspotEls;
}

function showEnsHotspot(id) {
    var info = ENS_HOTSPOTS[id];
    if (!info) return;
    var els = ensureEnsHotspotCard();
    document.getElementById("ds-hotspot-card-title").textContent = info.title;
    document.getElementById("ds-hotspot-card-body").textContent = info.body;
    els.backdrop.hidden = false;
    els.card.hidden = false;
    // Force a layout flush before adding the class that starts the fade,
    // or hidden->visible and the opacity transition both land in the same
    // frame and it just snaps in instead of fading.
    requestAnimationFrame(function () {
        els.backdrop.classList.add("show");
        els.card.classList.add("show");
    });
}
window.showEnsHotspot = showEnsHotspot;

function hideEnsHotspot() {
    if (!_ensHotspotEls) return;
    var els = _ensHotspotEls;
    els.card.classList.remove("show");
    els.backdrop.classList.remove("show");
    setTimeout(function () {
        if (!els.card.classList.contains("show")) { els.card.hidden = true; els.backdrop.hidden = true; }
    }, 220);
}
window.hideEnsHotspot = hideEnsHotspot;

// Recomputes and re-sets a garment canvas's data-garment-key from current
// style+spec state. startVisEnsPhotos() below only REPAINTS using
// whatever key is already sitting on the canvas — it does not re-derive
// it — so a partial update that changes which photo SHOULD show (a
// Bespoke Spec option, in particular) has to call this first, or the
// repaint just redraws the same photo the spec change was supposed to
// replace. Full renders don't need this: getVisEnsGarmentBlock already
// computes a fresh key into the HTML string every time.
function refreshEnsGarmentPhotoKey(garment) {
    var canvas = document.getElementById("vis-ens-canvas-" + garment);
    if (!canvas || typeof resolveGarmentKey !== "function") return;
    var ens = getVisEnsembleState();
    var style = ens.style[garment] || {};
    var spec = ens.spec && ens.spec[garment];
    var key = resolveGarmentKey(garment, style, spec);
    if (key) canvas.setAttribute("data-garment-key", key);
}
window.refreshEnsGarmentPhotoKey = refreshEnsGarmentPhotoKey;

// Paints every photographed garment canvas currently in the DOM — the
// ensemble stage, the single-cloth view, and both sides of the Split all
// use the same [data-garment-key] canvas contract. Called from the app
// render hook after innerHTML is set. renderGarmentPhoto self-retries
// while its asset loads, so a cold first paint fills in a frame or two later.
function startVisEnsPhotos() {
    // The hotspot modal lives on document.body (see ensureEnsHotspotCard's
    // header comment), outside the innerHTML this render just replaced, so
    // nothing else clears it when the client leaves the ensemble view —
    // this hook already runs after every render regardless of view, so it
    // is where that cleanup belongs.
    if (_ensHotspotEls && !document.getElementById("vis-ens-stage")) {
        _ensHotspotEls.backdrop.classList.remove("show");
        _ensHotspotEls.backdrop.hidden = true;
        _ensHotspotEls.card.classList.remove("show");
        _ensHotspotEls.card.hidden = true;
    }
    if (typeof renderGarmentPhoto !== "function") return;
    var canvases = document.querySelectorAll("canvas[data-garment-key]");
    for (var i = 0; i < canvases.length; i++) {
        var c = canvases[i];
        var key = c.getAttribute("data-garment-key");
        var cloth = c.getAttribute("data-cloth");
        if (key && cloth) renderGarmentPhoto(c, key, cloth, appState.visLighting || "daylight");
    }
}
window.startVisEnsPhotos = startVisEnsPhotos;

// The outfit builder's piece bar: one control that adds, removes, and switches
// between garments. An included garment shows a select chip (sets the active
// piece) paired with a remove control; a garment not yet in the outfit shows an
// "add" chip. Everything carries .btn-bare to opt out of the button:hover /
// button-reset cascade traps (see CLAUDE.md); the selected fill is applied with
// !important in styles.css for the same reason.
function getVisEnsPiecesHTML(ens) {
    var html = '<div class="ds-pieces">';
    for (var i = 0; i < VIS_ENS_GARMENTS.length; i++) {
        var g = VIS_ENS_GARMENTS[i];
        var label = g.charAt(0).toUpperCase() + g.slice(1);
        if (ens.garments.indexOf(g) !== -1) {
            var sel = ens.activeGarment === g;
            html +=
                '<div class="ds-piece' + (sel ? " sel" : "") + '">' +
                '<button class="ds-piece-select btn-bare' + (sel ? " sel" : "") + '" data-action="vis-ens-garment" data-garment="' + g + '" aria-pressed="' + (sel ? "true" : "false") + '">' + label + "</button>" +
                '<button class="ds-piece-remove btn-bare" data-action="vis-ens-remove" data-garment="' + g + '" aria-label="Remove ' + label + '">&times;</button>' +
                "</div>";
        } else {
            html +=
                '<button class="ds-piece-add btn-bare" data-action="vis-ens-add" data-garment="' + g + '">' +
                '<span class="ds-piece-add-plus" aria-hidden="true">+</span>' + label +
                "</button>";
        }
    }
    html += "</div>";
    return html;
}

function renderClothEnsemble(recommended, surpriseFlash) {
    var ens = getVisEnsembleState();
    var piecesHTML = getVisEnsPiecesHTML(ens);

    // Empty outfit: nothing added yet. Show the invitation and the piece bar
    // (three "add" chips) and stop — no swatch tray, style menu or export until
    // there is a garment to dress.
    if (!ens.garments.length) {
        return (
            '<div class="vis-shell ds-shell' + (surpriseFlash ? " vis-surprise-reveal" : "") + '">' +
            '<div class="vis-eyebrow">The Cloth Room</div>' +
            "<h1 class=\"vis-title\">Design an Ensemble</h1>" +
            '<p class="vis-lead">Build the outfit piece by piece. Add a garment, choose its cloth, then shape it.</p>' +
            '<div class="ds-stage ds-stage--vacant" id="vis-ens-stage">' +
            '<div class="ds-stage-empty">' +
            '<span class="ds-stage-empty-mark" aria-hidden="true"></span>' +
            '<h2 class="ds-stage-empty-title">Your outfit is empty</h2>' +
            '<p class="ds-stage-empty-note">Add a jacket, a vest, or trousers to begin.</p>' +
            "</div>" +
            "</div>" +
            piecesHTML +
            '<button class="vis-mode-toggle" data-action="vis-ensemble-toggle">&larr; Back to one cloth</button>' +
        '<button class="vis-mode-toggle vis-surprise-btn" data-action="vis-surprise-me">Surprise Me</button>' +
            "</div>"
        );
    }

    var activeKey = ens.activeGarment ? ens.fabrics[ens.activeGarment] : null;
    var activeFabric = fabricResolves(activeKey) ? getFabricByKey(activeKey) : null;
    var dressed = !!ensLeadFabricKey(ens);

    // Adaptive flat-lay: the jacket (if included) takes the wider left column;
    // vest and trousers stack in the right column. Any subset renders cleanly —
    // reusing the existing two-column CSS rather than a new grid.
    var stageInner = "";
    if (ens.garments.indexOf("jacket") !== -1) {
        stageInner += '<div class="ds-stage-left">' + getVisEnsGarmentBlock("jacket", ens) + "</div>";
    }
    var rightBlocks = "";
    if (ens.garments.indexOf("vest") !== -1) rightBlocks += getVisEnsGarmentBlock("vest", ens);
    if (ens.garments.indexOf("trousers") !== -1) rightBlocks += getVisEnsGarmentBlock("trousers", ens);
    if (rightBlocks) stageInner += '<div class="ds-stage-right">' + rightBlocks + "</div>";
    // One-shot reveal flag: it has now been read by getVisEnsGarmentBlock ->
    // getVisEnsPlaceholderBlock for this render pass, so clear it immediately —
    // otherwise it would keep tagging the same garment as "just added" on every
    // later render (style taps, other garment adds) until something overwrote it.
    ens.justAdded = null;

    // The 117-cloth wall used to run straight on from the piece chips
    // with no break, and straight into the style menu after it with no
    // break either — one long undifferentiated scroll. A named section
    // (reusing the "Complete the Look" divider language below) also
    // says which garment a swatch tap will dress, which the chip row
    // alone (an active/inactive colour change) does not say clearly
    // once it has scrolled off screen.
    var activeGarmentLabel = ens.activeGarment
        ? ens.activeGarment.charAt(0).toUpperCase() + ens.activeGarment.slice(1)
        : "";

    var swatchesHTML =
        '<div class="ds-section">' +
        '<div class="ds-section-label">Choose a Cloth' + (activeGarmentLabel ? " — " + activeGarmentLabel : "") + "</div>" +
        getVisFilterBarHTML() +
        '<div class="vis-swatch-tray ds-swatch-tray">' +
        getVisSwatchesHTML(recommended, fabricResolves(activeKey) ? activeKey : null, null) +
        "</div>" +
        "</div>";

    // The menu follows whichever garment is active, so every garment
    // now has detailing rather than the jacket alone.
    var styleHTML = "";
    var garmentOpts = VIS_ENS_STYLE_OPTIONS[ens.activeGarment];
    var garmentStyle = ens.style[ens.activeGarment] || {};
    if (garmentOpts) {
        styleHTML =
            '<div class="ds-section">' +
            '<div class="ds-section-label">Style It' + (activeGarmentLabel ? " — " + activeGarmentLabel : "") + "</div>" +
            '<div class="ds-style-menu">';
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
        styleHTML += "</div>";
    }

    return (
        '<div class="vis-shell ds-shell' + (surpriseFlash ? " vis-surprise-reveal" : "") + '">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
        "<h1 class=\"vis-title\">Design an Ensemble</h1>" +
        '<p class="vis-lead">Assign a cloth to each garment, shape it, and take the finished design to your fitting.</p>' +
        '<div class="ds-stage" id="vis-ens-stage">' + stageInner + "</div>" +
        piecesHTML +
        '<button class="vis-mode-toggle" data-action="vis-ensemble-toggle">&larr; Back to one cloth</button>' +
        '<button class="vis-mode-toggle vis-surprise-btn" data-action="vis-surprise-me">Surprise Me</button>' +
        styleHTML +
        swatchesHTML +
        getVisRecoStripHTML(recommended) +
        '<div class="ds-selected-cloth" id="vis-ens-selected">' + getVisEnsSelectedHTML(activeFabric) + "</div>" +
        getCompleteTheLookHTML(ens) +
        getBespokeSpecDrawerHTML(ens) +
        getBespokeSpecCardHTML(ens) +
        (dressed
            ? '<div class="ds-actions">' +
              '<button class="arch-btn-fill" data-action="vis-ens-export">Export Design Spec</button>' +
              '<button class="arch-btn-stroke" data-action="vis-ens-share">Share to Phone</button>' +
              '<button class="arch-btn-stroke" data-action="vis-ens-save-profile">Save to My Profile</button>' +
              "</div>"
            : "") +
        "</div>"
    );
}

function getVisEnsSelectedHTML(fabric) {
    // The active garment may be a blank slot (no cloth chosen yet) — invite a
    // choice rather than naming a cloth that was never picked.
    if (!fabric) {
        return '<span class="ds-selected-empty">Tap a cloth below to dress this piece.</span>';
    }
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
    if (!ens.activeGarment) return;
    ens.fabrics[ens.activeGarment] = fabricKey;
    // Photo garments repaint their canvas with the new cloth; a drawn
    // fallback garment (no photo yet) just swaps its tiled background.
    var canvas = document.getElementById("vis-ens-canvas-" + ens.activeGarment);
    if (canvas && typeof renderGarmentPhoto === "function") {
        canvas.setAttribute("data-cloth", fabricKey);
        renderGarmentPhoto(canvas, canvas.getAttribute("data-garment-key"), fabricKey, appState.visLighting || "daylight");
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
    if (typeof triggerCustomConfigSave === "function") triggerCustomConfigSave();
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
        // Only the garments actually included AND dressed appear in the spec —
        // a build-your-own outfit exports whatever the client chose, in canonical
        // order, and never lists a piece with no cloth chosen.
        ens.garments.filter(function (g) { return fabricResolves(ens.fabrics[g]); }).map(garmentRow).join("") +
        '<div style="' + eyebrow + ' text-align:center; margin-top:50px;">Bring this specification to your fitting &mdash; benjaminbarkerstudios.com</div>';

    var liveStage = document.getElementById("vis-ens-stage");
    if (liveStage) {
        var stageClone = liveStage.cloneNode(true);
        stageClone.removeAttribute("id");
        stageClone.style.width = "540px";
        stageClone.style.maxWidth = "540px";
        stageClone.style.margin = "0";
        // Strip any empty placeholder slots so the spec's flat-lay shows only
        // dressed garments, matching the rows below it.
        var vacants = stageClone.querySelectorAll(".ds-garment--empty");
        for (var vi = 0; vi < vacants.length; vi++) {
            if (vacants[vi].parentNode) vacants[vi].parentNode.removeChild(vacants[vi]);
        }
        var slot = page.querySelector(".ds-spec-stage-slot");
        if (slot) slot.appendChild(stageClone);
    }

    var container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.appendChild(page);
    document.body.appendChild(container);

    // cloneNode (both mine above, and html2canvas's own internal clone that
    // it renders from) copies markup, never a canvas's drawn pixels — the
    // drawing buffer lives outside the DOM, on whatever context the
    // ORIGINAL element claimed (2d or webgl). First attempt at this fix
    // pre-painted the canvases in MY clone above, which measurably worked
    // right up until html2canvas cloned the tree AGAIN internally and threw
    // that away — the PDF still came out with a blank jacket card. The
    // actual fix has to run inside html2canvas's own onclone hook, which
    // fires on ITS clone (the one it actually rasterizes), after that
    // clone exists — this is exactly what onclone is for, and
    // renderElementToCanvas already threads an onclone option through to
    // html2canvas, it just wasn't being used anywhere yet. Matched by
    // position (both queries walk the DOM in the same order), same as the
    // first attempt — this works for both the WebGL mesh and the ordinary
    // photo path, confirmed both were affected.
    renderElementToCanvas(page, {
        backgroundColor: "#faf8f3",
        onclone: function (clonedDoc) {
            var liveCanvases = document.querySelectorAll("#vis-ens-stage canvas");
            var cloneCanvases = clonedDoc.querySelectorAll(".ds-spec-stage-slot canvas");
            for (var ci = 0; ci < cloneCanvases.length && ci < liveCanvases.length; ci++) {
                try {
                    var cctx = cloneCanvases[ci].getContext("2d");
                    if (cctx) cctx.drawImage(liveCanvases[ci], 0, 0, cloneCanvases[ci].width, cloneCanvases[ci].height);
                } catch (e) {
                    console.error("Design spec export: could not copy a garment canvas into html2canvas's clone", e);
                }
            }
        }
    })
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
    if (typeof triggerCustomConfigSave === "function") triggerCustomConfigSave();
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
