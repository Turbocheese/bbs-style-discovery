// Colour x Style journey — Phase 3 check.
//
// Asserts that the wardrobe worksheet's Foundation Pieces section is tinted to
// the client's neutral palette when a colour result exists, and is unchanged
// when it does not:
//   - WITH a colour result: the Foundation section shows a "your neutrals"
//     swatch cue whose swatches carry exactly the profile's strongNeutrals hexes;
//   - WITHOUT a colour result: no cue, and the worksheet HTML is otherwise
//     identical (graceful degrade);
//   - the checklist still toggles (wardrobeChecklist state) in the real DOM.
//
// Drives the REAL app so all globals (archetypeProfiles, colourDirectionProfiles,
// renderWorksheet, render) are the shipped ones.
//
// Usage:
//   npx serve .                    # port 3000
//   npm i --no-save playwright     # once
//   node verify/cj-phase3-check.js
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

    var COLOUR_KEY = "soft_tonal_warmth";

    // ---- Static render assertion (with vs without a colour result) ----
    var staticResult = await page.evaluate(function (colourKey) {
        var ak = Object.keys(archetypeProfiles)[0];
        appState.archetypeKey = ak;
        appState.wardrobeChecklist = {};

        // WITHOUT a colour result.
        appState.colourResultKey = null;
        var without = renderWorksheet();

        // WITH a colour result.
        appState.colourResultKey = colourKey;
        var withCue = renderWorksheet();

        var neutrals = getColourDirectionProfileData(colourKey).strongNeutrals || [];
        var hexes = neutrals.map(function (n) { return n.hex; });

        // Every neutral hex must appear inside the cue block.
        var cueMatch = withCue.match(/<div class="worksheet-neutrals-cue"[\s\S]*?<\/div><\/div>/);
        var cueBlock = cueMatch ? cueMatch[0] : "";
        var allHexPresent = hexes.length > 0 && hexes.every(function (h) {
            return cueBlock.indexOf(h) !== -1;
        });

        // Removing the cue block from the "with" render must yield the "without"
        // render exactly — proves the ONLY change is the cue (graceful degrade).
        var withCueStripped = withCue.replace(cueBlock, "");

        return {
            archetype: ak,
            withoutHasCue: without.indexOf("worksheet-neutrals-cue") !== -1,
            withHasCue: withCue.indexOf("worksheet-neutrals-cue") !== -1,
            neutralCount: hexes.length,
            allHexPresent: allHexPresent,
            cueIsOnlyDiff: withCueStripped === without
        };
    }, COLOUR_KEY);

    console.log("  archetype under test: " + staticResult.archetype);
    console.log("  strongNeutrals swatches: " + staticResult.neutralCount);

    check("WITHOUT a colour result: worksheet shows NO neutrals cue", !staticResult.withoutHasCue);
    check("WITH a colour result: worksheet shows the neutrals cue", staticResult.withHasCue);
    check("cue swatches carry exactly the profile's strongNeutrals hexes", staticResult.allHexPresent);
    check("the cue is the ONLY difference (worksheet otherwise unchanged)", staticResult.cueIsOnlyDiff);

    // ---- Live DOM: cue is visible and checklist still toggles ----
    var live = await page.evaluate(function (colourKey) {
        var ak = Object.keys(archetypeProfiles)[0];
        appState.archetypeKey = ak;
        appState.wardrobeChecklist = {};
        appState.colourResultKey = colourKey;
        appState.view = "worksheet";
        render({ animate: false });

        var cueEl = document.querySelector(".worksheet-neutrals-cue");
        var swatches = document.querySelectorAll(".worksheet-neutral-swatch");
        var firstCheck = document.querySelector('.worksheet-item-check[data-action="toggle-item"]');
        return {
            cuePresent: !!cueEl,
            swatchCount: swatches.length,
            firstItemId: firstCheck ? firstCheck.getAttribute("data-item-id") : null
        };
    }, COLOUR_KEY);

    check("live DOM: neutrals cue is rendered on the worksheet", live.cuePresent);
    check("live DOM: cue renders one swatch per neutral", live.swatchCount === staticResult.neutralCount);

    // Toggle the first checklist item by clicking it, verify state flips.
    var toggled = false;
    if (live.firstItemId) {
        var sel = '.worksheet-item-check[data-item-id="' + live.firstItemId + '"]';
        await page.click(sel);
        toggled = await page.evaluate(function (id) {
            return !!(appState.wardrobeChecklist[id] && appState.wardrobeChecklist[id].checked);
        }, live.firstItemId);
    }
    check("checklist still toggles (wardrobeChecklist updates on click)", toggled);

    check("zero console/page errors", errors.length === 0);
    if (errors.length) errors.forEach(function (e) { console.log("    " + e); });

    await browser.close();
    console.log(failures.length ? "\nFAILED: " + failures.join("; ") : "\nALL-GREEN");
    process.exit(failures.length ? 1 : 0);
})();
