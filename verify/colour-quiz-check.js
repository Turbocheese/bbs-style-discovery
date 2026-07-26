// Runnable check for the sharpened colour diagnostic (run: node verify/colour-quiz-check.js).
// Loads colour-direction.js as-is (plain browser globals, no DOM needed for the
// scoring path) and asserts that representative answer sets land on the expected
// profile + descriptor + chroma reason. Fails loudly if the four-variable read
// or the mapping regresses. No framework, no fixtures.

var fs = require("fs");
var path = require("path");

var src = fs.readFileSync(path.join(__dirname, "..", "colour-direction.js"), "utf8");
var ctx = {};
new Function(
    src +
    "\n;this.colourDirectionQuestions=colourDirectionQuestions;" +
    "this.scoreColourDirectionAnswers=scoreColourDirectionAnswers;" +
    "this.getColourDirectionProfileKey=getColourDirectionProfileKey;" +
    "this.getColourDescriptor=getColourDescriptor;" +
    "this.getColourReasons=getColourReasons;"
).call(ctx);

var questions = ctx.colourDirectionQuestions;

// Find the option index whose label (a) contains a substring — keeps the test
// robust to option reordering.
function pick(qid, labelSubstr) {
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].id !== qid) continue;
        for (var o = 0; o < questions[i].opts.length; o++) {
            if (questions[i].opts[o].a.toLowerCase().indexOf(labelSubstr.toLowerCase()) !== -1) {
                return o;
            }
        }
        throw new Error("no option matching '" + labelSubstr + "' in question '" + qid + "'");
    }
    throw new Error("no question with id '" + qid + "'");
}

function chromaReason(scores) {
    var reasons = ctx.getColourReasons(scores);
    for (var i = 0; i < reasons.length; i++) {
        if (reasons[i].k === "Clarity") return reasons[i].v;
    }
    return null;
}

var failures = 0;
function assert(name, cond) {
    if (cond) {
        console.log("  PASS  " + name);
    } else {
        console.log("  FAIL  " + name);
        failures++;
    }
}

// Case A: gold + deep + muted eyes + low hair/skin contrast -> a warm, soft profile.
var caseA = {
    skin_depth: pick("skin_depth", "Deep"),
    undertone: pick("undertone", "Warmer"),
    metal_tone: pick("metal_tone", "gold"),
    eye_clarity: pick("eye_clarity", "Soft"),
    hair_skin_contrast: pick("hair_skin_contrast", "A little"),
    contrast_preference: pick("contrast_preference", "Softer"),
    colour_comfort: pick("colour_comfort", "neutrals"),
};
var scoresA = ctx.scoreColourDirectionAnswers(caseA);
var keyA = ctx.getColourDirectionProfileKey(scoresA);
var descA = ctx.getColourDescriptor(scoresA);
console.log("Case A (gold/deep/muted/low-contrast): " + keyA + " | " + descA + " | Clarity=" + chromaReason(scoresA));
assert("A lands on a warm, soft profile", keyA === "soft_tonal_warmth" || keyA === "earth_led_balance");
assert("A descriptor reads Warm", descA.indexOf("Warm") !== -1);
assert("A chroma reason is Soft", chromaReason(scoresA) === "Soft");

// Case B: silver + clear eyes + strong hair/skin contrast -> a cool, clear profile.
var caseB = {
    skin_depth: pick("skin_depth", "Light-Medium"),
    undertone: pick("undertone", "Cooler"),
    metal_tone: pick("metal_tone", "silver"),
    eye_clarity: pick("eye_clarity", "Clear"),
    hair_skin_contrast: pick("hair_skin_contrast", "A lot"),
    contrast_preference: pick("contrast_preference", "Stronger"),
    colour_comfort: pick("colour_comfort", "open"),
};
var scoresB = ctx.scoreColourDirectionAnswers(caseB);
var keyB = ctx.getColourDirectionProfileKey(scoresB);
var descB = ctx.getColourDescriptor(scoresB);
console.log("Case B (silver/clear/high-contrast): " + keyB + " | " + descB + " | Clarity=" + chromaReason(scoresB));
assert("B lands on a cool, clear profile", keyB === "clean_cool_contrast");
assert("B descriptor reads Cool", descB.indexOf("Cool") !== -1);
assert("B chroma reason is Clear", chromaReason(scoresB) === "Clear");

// Independence guard: chroma must move on its own, not track contrast.
var clearOnly = ctx.scoreColourDirectionAnswers({ eye_clarity: pick("eye_clarity", "Clear") });
assert("clear eyes register chroma independently", clearOnly.clear > clearOnly.muted);
var reasons = ctx.getColourReasons(scoresA);
assert("result shows 3 or 4 plain reasons", reasons.length >= 3 && reasons.length <= 4);
assert("a Clarity (chroma) reason is present", chromaReason(scoresA) !== null);

if (failures) {
    console.log("\nCOLOUR-QUIZ-CHECK: " + failures + " FAILED");
    process.exit(1);
}
console.log("\nCOLOUR-QUIZ-CHECK: ALL-GREEN");
