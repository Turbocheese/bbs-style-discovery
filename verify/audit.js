// BBS Style Discovery — data health audit (metadata + topic_kind).
//
// The older docs referenced two "console audit scripts" that were never
// actually committed to the repo. This is their committed replacement.
//
// Usage (from the repo root, plain Node, no dependencies):
//   node verify/audit.js
//
// Targets: 0 missing metadata, 0 missing core fields, 0 missing or
// invalid topic_kind, total topics = 312.

// data.js's final line references `guideTree` bare, which in a browser
// resolves through window's global scope — so window must BE the global
// object here, not a plain stand-in.
global.window = global;
require("../data.js");
var guideTree = global.window.guideTree;

var VALID_KINDS = {
    garment: 1, garment_detail: 1, fabric: 1, fabric_reference: 1,
    wardrobe_strategy: 1, brand_philosophy: 1, guide: 1,
};

var topics = [];
(function walk(node, path) {
    if (!node || typeof node !== "object") return;
    if (node.type === "topic") {
        topics.push({ node: node, path: path.join(" > ") });
        return;
    }
    for (var k in node) {
        if (node[k] && typeof node[k] === "object") walk(node[k], path.concat(k));
    }
})(guideTree, []);

var missingMeta = [];
var missingCore = [];
var missingKind = [];
var invalidKind = [];

for (var i = 0; i < topics.length; i++) {
    var t = topics[i].node;
    if (!t.metadata || typeof t.metadata !== "object") {
        missingMeta.push(topics[i].path);
    } else {
        if (t.metadata.formality === undefined || t.metadata.versatility === undefined) {
            missingCore.push(topics[i].path);
        }
    }
    if (!t.topic_kind) missingKind.push(topics[i].path);
    else if (!VALID_KINDS[t.topic_kind]) invalidKind.push(topics[i].path + " (" + t.topic_kind + ")");
}

// ---- Cloth library ----
//
// The library asserts real mill facts, so it needs the same discipline
// as the guide. The load-bearing rule is the last one: an UNVERIFIED
// cloth must carry no composition, weight or bunch name. Without it,
// a plausible-looking invented figure eventually gets typed in beside
// genuinely researched data and nobody can tell which is which.
var CLOTH_LIBRARY = require("../cloth-data.js").CLOTH_LIBRARY;

var VALID_WEAVES = { plain: 1, twill: 1, hopsack: 1, flannel: 1, birdseye: 1, herringbone: 1 };
var VALID_PATTERNS = { none: 1, chalkstripe: 1, pinstripe: 1, windowpane: 1, glen: 1 };

function resolvePath(path) {
    var node = guideTree;
    for (var i = 0; i < path.length; i++) {
        if (!node.children || !node.children[path[i]]) return null;
        node = node.children[path[i]];
    }
    return node;
}

var clothDupKeys = [];
var clothBadMill = [];
var clothBadGuide = [];
var clothBadWeave = [];
var clothUnverifiedSpec = [];
var clothVerifiedNoSource = [];
var seenClothKeys = {};

for (var c = 0; c < CLOTH_LIBRARY.length; c++) {
    var cl = CLOTH_LIBRARY[c];
    if (seenClothKeys[cl.key]) clothDupKeys.push(cl.key);
    seenClothKeys[cl.key] = 1;

    if (!cl.millPath || !resolvePath(cl.millPath)) {
        clothBadMill.push(cl.key + " -> " + (cl.millPath || []).join(" > "));
    }
    if (cl.guidePath && !resolvePath(cl.guidePath)) {
        clothBadGuide.push(cl.key + " -> " + cl.guidePath.join(" > "));
    }
    if (!VALID_WEAVES[cl.weave] || !VALID_PATTERNS[cl.pattern]) {
        clothBadWeave.push(cl.key + " (" + cl.weave + " / " + cl.pattern + ")");
    }
    if (!cl.verified && (cl.composition || cl.weight || cl.bunch)) {
        clothUnverifiedSpec.push(cl.key);
    }
    if (cl.verified && !cl.source) clothVerifiedNoSource.push(cl.key);
}

// ---- Cloth Room link targets ----
//
// Every style option and Complete-the-Look slot links into the guide.
// A target that resolves to a GROUP rather than a topic opens a section
// listing instead of the article the client asked for, which is the
// same failure class the validator's key/position rule catches.
var visSrc = require("fs").readFileSync(__dirname + "/../fabric-visualiser.js", "utf8");
var linkTargets = [];
var linkRe = /topic:\s*(\[[^\]]*\])/g;
var lm;
while ((lm = linkRe.exec(visSrc))) {
    try { linkTargets.push(JSON.parse(lm[1].replace(/'/g, '"'))); } catch (e) { /* not a literal */ }
}

var badLinkTarget = [];
for (var lt = 0; lt < linkTargets.length; lt++) {
    var node = resolvePath(linkTargets[lt]);
    if (!node) badLinkTarget.push(linkTargets[lt].join(" > ") + " (does not resolve)");
    else if (node.type !== "topic") badLinkTarget.push(linkTargets[lt].join(" > ") + " (resolves to a group, not a topic)");
}

// ---- Mill pins ----
//
// The provenance tape renders a house's label, and printed the literal
// word "undefined" for a pin that had none.
//
// The rule is scoped to pins carrying a founding year, because those
// are the only ones the tape draws. Egyptian Cotton has short: "" ON
// PURPOSE — line 250 of mill-map.js uses it to suppress that origin's
// label on the chart — so a blanket "every pin needs a short" rule
// would be wrong and would push someone into changing working output.
var millSrc = require("fs").readFileSync(__dirname + "/../mill-map.js", "utf8");
var pinNoShort = [];
var pinNoGuide = [];
try {
    var sandbox = { window: {} };
    var pinsMatch = millSrc.match(/var MILL_MAP_PINS = \[[\s\S]*?\n\];/);
    if (pinsMatch) {
        var MILL_MAP_PINS;
        eval(pinsMatch[0]);
        for (var mp = 0; mp < MILL_MAP_PINS.length; mp++) {
            var pin = MILL_MAP_PINS[mp];
            if (pin.est && !pin.short && !pin.name) pinNoShort.push("(pin with est " + pin.est + " has no label at all)");
            if (pin.guidePath && !resolvePath(pin.guidePath)) {
                pinNoGuide.push((pin.name || "?") + " -> " + pin.guidePath.join(" > "));
            }
        }
    }
} catch (e) {
    pinNoShort.push("could not parse MILL_MAP_PINS: " + e.message);
}

function report(label, arr) {
    console.log((arr.length === 0 ? "  PASS  " : "  FAIL  ") + label + (arr.length ? " (" + arr.length + ")" : ""));
    arr.slice(0, 10).forEach(function (p) { console.log("          - " + p); });
}

console.log("Total topics scanned: " + topics.length + (topics.length === 312 ? "  (expected 312: PASS)" : "  (EXPECTED 312: FAIL)"));
report("no missing metadata objects", missingMeta);
report("no missing core fields (formality + versatility)", missingCore);
report("no missing topic_kind", missingKind);
report("no invalid topic_kind values", invalidKind);

var verifiedCount = CLOTH_LIBRARY.filter(function (x) { return x.verified; }).length;
console.log("\nCloths scanned: " + CLOTH_LIBRARY.length +
    "  (" + verifiedCount + " verified, " + (CLOTH_LIBRARY.length - verifiedCount) + " house-style)");
report("no duplicate cloth keys", clothDupKeys);
report("every cloth millPath resolves in Cloth Origins", clothBadMill);
report("every cloth guidePath resolves", clothBadGuide);
report("every weave and pattern is in the approved vocabulary", clothBadWeave);
report("no unverified cloth carries a spec field", clothUnverifiedSpec);
report("every verified cloth cites a source", clothVerifiedNoSource);
console.log("\nCloth Room link targets checked: " + linkTargets.length);
report("every link target resolves to a topic, not a group", badLinkTarget);
console.log("\nMill pins scanned: " + (typeof MILL_MAP_PINS !== "undefined" ? MILL_MAP_PINS.length : 0));
report("every dated mill pin has a label for the tape", pinNoShort);
report("every mill pin's guidePath resolves", pinNoGuide);

var failed = missingMeta.length + missingCore.length + missingKind.length + invalidKind.length + (topics.length === 312 ? 0 : 1) +
    clothDupKeys.length + clothBadMill.length + clothBadGuide.length + clothBadWeave.length +
    clothUnverifiedSpec.length + clothVerifiedNoSource.length + badLinkTarget.length +
    pinNoShort.length + pinNoGuide.length;
console.log(failed === 0 ? "\nAUDIT: ALL GREEN" : "\nAUDIT: FAILURES PRESENT");
process.exit(failed === 0 ? 0 : 1);
