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

var failed = missingMeta.length + missingCore.length + missingKind.length + invalidKind.length + (topics.length === 312 ? 0 : 1) +
    clothDupKeys.length + clothBadMill.length + clothBadGuide.length + clothBadWeave.length +
    clothUnverifiedSpec.length + clothVerifiedNoSource.length;
console.log(failed === 0 ? "\nAUDIT: ALL GREEN" : "\nAUDIT: FAILURES PRESENT");
process.exit(failed === 0 ? 0 : 1);
