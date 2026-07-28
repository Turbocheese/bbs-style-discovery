// Colour x Style journey — Phase 4 check.
//
// Asserts the two integration fixes wired for the guided journey:
//
//   Fix 1 — the Style onboarding, once a colour result exists, does NOT ask
//   the palette / colour-use questions and instead DERIVES selPalette +
//   selColourUse from the colour profile, so archetype scoring still gets
//   valid values. Standalone Style (no colour result) still asks both.
//
//   Fix 2 — the Cloth Room, entered with a colour result, default-filters the
//   library to the client's palette colour_family values; "Show all"
//   (vis-filter-clear) restores the full library. With no colour result it
//   opens showing all cloths (unchanged).
//
// Drives the REAL app so every global is the shipped one. It sets appState
// directly rather than clicking the quizzes — the units under test are the
// derive + default-filter helpers, not the quiz UI.
//
// Usage:
//   npx serve .                    # port 3000
//   npm i --no-save playwright     # once
//   node verify/cj-phase4-check.js
// Exit 0 = all green.

var BASE = process.env.SMOKE_URL || "http://localhost:3000";
var { chromium } = require("playwright");

var failures = [];
function check(name, ok) {
    console.log((ok ? "  PASS  " : "  FAIL  ") + name);
    if (!ok) failures.push(name);
}

(async function () {
    var browser = await chromium.launch({ headless: true });
    var page = await browser.newPage();
    var errors = [];
    page.on("pageerror", function (e) { errors.push("PAGEERROR: " + e.message); });
    page.on("console", function (m) { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });

    await page.goto(BASE + "/?_=" + Date.now(), { waitUntil: "networkidle" });

    var result = await page.evaluate(function () {
        var out = { profiles: {}, standalone: {}, clothRoom: {} };

        // ---- Fix 1: every colour profile derives valid style values, and
        //      the onboarding render omits the palette/colour-use questions. ----
        var STYLE_PALETTES = [
            "Riviera Light", "Earth & Olive", "Navy & Stone", "Soft Neutrals",
            "City Greys", "Heritage Browns", "Deep Colour", "Expressive Colour"
        ];
        var STYLE_COLOUR_USE = ["Mostly neutrals", "One accent colour", "More playful colour"];

        appState.selFocus = "Everyday Essentials";
        appState.selFit = "Classic Structure";
        appState.clientName = "Check";

        var allDeriveValid = true, allSkip = true;
        for (var key in colourDirectionProfiles) {
            appState.colourResultKey = key;
            appState.selPalette = "";
            appState.selColourUse = "";
            var html = renderOnboarding(); // side-effect: sets derived values
            var okPalette = STYLE_PALETTES.indexOf(appState.selPalette) !== -1;
            var okUse = STYLE_COLOUR_USE.indexOf(appState.selColourUse) !== -1;
            var skips = html.indexOf('data-action="onboard-palette"') === -1 &&
                html.indexOf('data-action="onboard-colour-use"') === -1;
            out.profiles[key] = {
                palette: appState.selPalette, colourUse: appState.selColourUse,
                okPalette: okPalette, okUse: okUse, skips: skips
            };
            if (!okPalette || !okUse) allDeriveValid = false;
            if (!skips) allSkip = false;
        }
        out.allDeriveValid = allDeriveValid;
        out.allSkip = allSkip;

        // Standalone Style (no colour result) STILL asks both questions.
        appState.colourResultKey = null;
        appState.selPalette = "";
        appState.selColourUse = "";
        var standaloneHtml = renderOnboarding();
        out.standalone.asksPalette = standaloneHtml.indexOf('data-action="onboard-palette"') !== -1;
        out.standalone.asksUse = standaloneHtml.indexOf('data-action="onboard-colour-use"') !== -1;
        out.standalone.leftBlank = appState.selPalette === "" && appState.selColourUse === "";

        // ---- Fix 2: Cloth Room default-filter. ----
        var TOTAL = FABRIC_LIBRARY.length;
        out.clothRoom.total = TOTAL;

        // No colour result -> opens showing everything.
        appState.colourResultKey = null;
        appState.visFilters = null; // fresh
        applyClothRoomColourDefault();
        out.clothRoom.noResultShown = getFilteredCloths().length;
        out.clothRoom.noResultFacet = getVisFilters().colour_family.length;

        // With a colour result -> default-filtered to the palette families.
        appState.colourResultKey = "soft_tonal_warmth";
        appState.visFilters = null; // fresh entry
        applyClothRoomColourDefault();
        var fams = getColourDirectionProfileData("soft_tonal_warmth").colourFamilies;
        var facet = getVisFilters().colour_family;
        var shown = getFilteredCloths().length;
        out.clothRoom.resultFacet = facet.length;
        out.clothRoom.resultShown = shown;
        // Every defaulted family belongs to the profile's palette.
        var facetInPalette = true;
        for (var i = 0; i < facet.length; i++) if (fams.indexOf(facet[i]) === -1) facetInPalette = false;
        out.clothRoom.facetInPalette = facetInPalette;

        // "Show all" (vis-filter-clear) restores the full library.
        clearVisFilters();
        out.clothRoom.afterShowAll = getFilteredCloths().length;

        return out;
    });

    // ---- Fix 1 assertions ----
    for (var k in result.profiles) {
        var p = result.profiles[k];
        console.log("  " + k + " -> " + p.palette + " / " + p.colourUse);
    }
    check("every colour profile derives a valid Style palette + colour-use", result.allDeriveValid);
    check("in-journey onboarding omits the palette + colour-use questions", result.allSkip);
    check("standalone Style (no colour result) still asks palette", result.standalone.asksPalette);
    check("standalone Style (no colour result) still asks colour-use", result.standalone.asksUse);
    check("standalone Style does not auto-fill palette/colour-use", result.standalone.leftBlank);

    // ---- Fix 2 assertions ----
    console.log("  cloths total: " + result.clothRoom.total +
        " | no-result shown: " + result.clothRoom.noResultShown +
        " | with-result shown: " + result.clothRoom.resultShown);
    check("no colour result: Cloth Room opens at full library, no colour facet applied",
        result.clothRoom.noResultShown === result.clothRoom.total && result.clothRoom.noResultFacet === 0);
    check("with colour result: Cloth Room default-filters the colour facet",
        result.clothRoom.resultFacet > 0);
    check("with colour result: default facet is a subset of the profile's palette families",
        result.clothRoom.facetInPalette);
    check("with colour result: fewer cloths shown than the full library",
        result.clothRoom.resultShown < result.clothRoom.total);
    check("Show all restores the full library",
        result.clothRoom.afterShowAll === result.clothRoom.total);

    check("zero console/page errors", errors.length === 0);
    if (errors.length) errors.forEach(function (e) { console.log("    " + e); });

    await browser.close();
    console.log(failures.length ? "\nFAILED: " + failures.join("; ") : "\nALL-GREEN");
    process.exit(failures.length ? 1 : 0);
})();
