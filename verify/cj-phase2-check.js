// Colour x Style journey — Phase 2 check.
//
// Asserts that the client's colour palette re-ranks the Cloth Room's
// recommended cloths (getRecommendedFabricKeys):
//   - a warm colour result floats warm-family cloths (brown/tan/green/cream)
//     to the front;
//   - a cool colour result floats cool-family cloths (navy/charcoal/grey);
//   - clearing the colour result restores the original order;
//   - the reordering is a stable partition (same cloths, nothing dropped or
//     duplicated).
//
// Drives the REAL app so all globals (archetypeProfiles, CLOTH_LIBRARY,
// colourDirectionProfiles, getRecommendedFabricKeys) are the shipped ones.
// It sets appState directly rather than clicking through both quizzes — the
// unit under test is the recommendation function, not the quiz UI.
//
// Usage:
//   npx serve .                    # port 3000
//   npm i --no-save playwright     # once
//   node verify/cj-phase2-check.js
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

    var WARM = ["brown", "tan", "green", "cream"];
    var COOL = ["navy", "charcoal", "grey"];

    var result = await page.evaluate(function (families) {
        function famOf(key) { return getFabricByKey(key).colour_family; }
        function leadingFamiliesIn(keys, set) {
            // How many of the recommended cloths, from the front, are in `set`.
            var n = 0;
            for (var i = 0; i < keys.length; i++) {
                if (set.indexOf(famOf(keys[i])) !== -1) n++; else break;
            }
            return n;
        }
        function multiset(keys) {
            var m = {};
            for (var i = 0; i < keys.length; i++) m[keys[i]] = (m[keys[i]] || 0) + 1;
            return m;
        }
        function sameMultiset(a, b) {
            var ma = multiset(a), mb = multiset(b), k;
            for (k in ma) if (ma[k] !== mb[k]) return false;
            for (k in mb) if (ma[k] !== mb[k]) return false;
            return true;
        }
        function countInSet(keys, set) {
            var n = 0;
            for (var i = 0; i < keys.length; i++) if (set.indexOf(famOf(keys[i])) !== -1) n++;
            return n;
        }

        // Pick the archetype whose baseline recommendations span the most
        // colour families AND contain at least one warm and one cool cloth,
        // so the reorder has something to actually do.
        var bestKey = null, bestScore = -1, bestBase = null;
        appState.colourResultKey = null;
        for (var ak in archetypeProfiles) {
            appState.archetypeKey = ak;
            var base = getRecommendedFabricKeys();
            if (base.length < 4) continue;
            var warmN = countInSet(base, families.WARM);
            var coolN = countInSet(base, families.COOL);
            if (warmN < 1 || coolN < 1) continue;
            var fams = {};
            for (var i = 0; i < base.length; i++) fams[famOf(base[i])] = 1;
            var score = Object.keys(fams).length;
            if (score > bestScore) { bestScore = score; bestKey = ak; bestBase = base.slice(); }
        }
        if (!bestKey) return { ok: false, reason: "no suitable archetype found" };

        appState.archetypeKey = bestKey;

        // Whole leading run in the profile's own palette? (the boost floats
        // exactly the palette-matching cloths, so the tail must be the
        // non-matching ones — a clean stable partition).
        function leadAllInProfile(keys, profileFams) {
            for (var i = 0; i < keys.length; i++) {
                var inPal = profileFams.indexOf(famOf(keys[i])) !== -1;
                if (i > 0 && inPal && profileFams.indexOf(famOf(keys[i - 1])) === -1) return false;
            }
            return true;
        }
        // First index of any cloth whose family is in `set`.
        function firstIdxInSet(keys, set) {
            for (var i = 0; i < keys.length; i++) if (set.indexOf(famOf(keys[i])) !== -1) return i;
            return -1;
        }

        var warmProfileFams = colourDirectionProfiles.soft_tonal_warmth.colourFamilies;
        var coolProfileFams = colourDirectionProfiles.clean_cool_contrast.colourFamilies;

        // Baseline (no colour result).
        appState.colourResultKey = null;
        var baseline = getRecommendedFabricKeys();

        // Warm colour result.
        appState.colourResultKey = "soft_tonal_warmth";
        var warm = getRecommendedFabricKeys();

        // Cool colour result.
        appState.colourResultKey = "clean_cool_contrast";
        var cool = getRecommendedFabricKeys();

        // Cleared — must restore original order exactly.
        appState.colourResultKey = null;
        var cleared = getRecommendedFabricKeys();

        // Warm-exclusive (tan/brown/green) vs cool-exclusive (navy/charcoal/grey)
        // families are the true discriminators — blue/cream sit in both palettes.
        var warmOnly = ["tan", "brown", "green"];
        var coolOnly = ["navy", "charcoal", "grey"];

        return {
            ok: true,
            archetype: bestKey,
            baseline: baseline,
            baselineFams: baseline.map(famOf),
            warmFams: warm.map(famOf),
            coolFams: cool.map(famOf),
            // Warm result: its top cloth is in the warm palette, and the whole
            // leading run is palette-matching.
            warmTopInPalette: warmProfileFams.indexOf(warm.map(famOf)[0]) !== -1,
            warmLeadClean: leadAllInProfile(warm, warmProfileFams),
            coolTopInPalette: coolProfileFams.indexOf(cool.map(famOf)[0]) !== -1,
            coolLeadClean: leadAllInProfile(cool, coolProfileFams),
            // Discriminator: a warm-only cloth ranks earlier under warm than
            // under cool; a cool-only cloth ranks earlier under cool than warm.
            warmFloatsWarm: firstIdxInSet(warm, warmOnly) < firstIdxInSet(cool, warmOnly),
            coolFloatsCool: firstIdxInSet(cool, coolOnly) < firstIdxInSet(warm, coolOnly),
            hasWarmOnly: firstIdxInSet(baseline, warmOnly) !== -1,
            hasCoolOnly: firstIdxInSet(baseline, coolOnly) !== -1,
            permWarm: sameMultiset(baseline, warm),
            permCool: sameMultiset(baseline, cool),
            differ: warm.join(",") !== cool.join(","),
            restored: baseline.join(",") === cleared.join(",")
        };
    }, { WARM: WARM, COOL: COOL });

    if (!result.ok) {
        check("found an archetype with a warm+cool cloth spread", false);
    } else {
        console.log("  archetype under test: " + result.archetype);
        console.log("  baseline families: " + result.baselineFams.join(" "));
        console.log("  warm-result families: " + result.warmFams.join(" "));
        console.log("  cool-result families: " + result.coolFams.join(" "));

        // Warm: top cloth is in the warm palette, and the leading run is a
        // clean palette-matching partition.
        check("warm result: top recommended cloth is in the warm palette", result.warmTopInPalette);
        check("warm result: palette-matching cloths lead cleanly (stable partition)", result.warmLeadClean);
        check("warm result: a warm-only cloth (tan/brown/green) ranks ahead of where cool puts it",
            result.hasWarmOnly && result.warmFloatsWarm);

        // Cool: symmetric.
        check("cool result: top recommended cloth is in the cool palette", result.coolTopInPalette);
        check("cool result: palette-matching cloths lead cleanly (stable partition)", result.coolLeadClean);
        check("cool result: a cool-only cloth (navy/charcoal/grey) ranks ahead of where warm puts it",
            result.hasCoolOnly && result.coolFloatsCool);

        // Stable partition — nothing dropped or duplicated.
        check("warm result is a permutation of baseline (no key dropped/duplicated)", result.permWarm);
        check("cool result is a permutation of baseline (no key dropped/duplicated)", result.permCool);

        // Warm and cool must genuinely differ (proves the palette drives it).
        check("warm and cool orderings differ", result.differ);

        // Clearing restores the original order exactly (graceful degrade).
        check("clearing the colour result restores the original order", result.restored);
    }

    check("zero console/page errors", errors.length === 0);
    if (errors.length) errors.forEach(function (e) { console.log("    " + e); });

    await browser.close();
    console.log(failures.length ? "\nFAILED: " + failures.join("; ") : "\nALL-GREEN");
    process.exit(failures.length ? 1 : 0);
})();
