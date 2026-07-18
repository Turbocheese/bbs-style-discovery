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

function report(label, arr) {
    console.log((arr.length === 0 ? "  PASS  " : "  FAIL  ") + label + (arr.length ? " (" + arr.length + ")" : ""));
    arr.slice(0, 10).forEach(function (p) { console.log("          - " + p); });
}

console.log("Total topics scanned: " + topics.length + (topics.length === 312 ? "  (expected 312: PASS)" : "  (EXPECTED 312: FAIL)"));
report("no missing metadata objects", missingMeta);
report("no missing core fields (formality + versatility)", missingCore);
report("no missing topic_kind", missingKind);
report("no invalid topic_kind values", invalidKind);

var failed = missingMeta.length + missingCore.length + missingKind.length + invalidKind.length + (topics.length === 312 ? 0 : 1);
console.log(failed === 0 ? "\nAUDIT: ALL GREEN" : "\nAUDIT: FAILURES PRESENT");
process.exit(failed === 0 ? 0 : 1);
