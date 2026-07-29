// BBS Style Discovery — lookbook health check.
//
// Usage (from the repo root, plain Node, no dependencies):
//   node verify/lookbook.js
//
// Three ways a lookbook entry breaks without anything throwing:
//   1. The photograph is not vendored, so the tile hides itself (the img
//      onerror in renderLookbook) and the look silently disappears.
//   2. The photograph is vendored but missing from sw.js's PRECACHE, so it
//      works on the bench and is blank on the offline iPad.
//   3. guidePath points at a node that is not in the tree, so "Read: ..."
//      opens a blank page.

var fs = require("fs");
var path = require("path");

var ROOT = path.join(__dirname, "..");
global.window = global;
require(path.join(ROOT, "data.js"));
var guideTree = global.window.guideTree;

// lookbook.js is a browser global script, not a module: run it in the global
// scope (require() would hide `var lookbookData` inside a module wrapper).
require("vm").runInThisContext(fs.readFileSync(path.join(ROOT, "lookbook.js"), "utf8"));
var looks = global.lookbookData;

var precache = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");

function resolve(p) {
    var node = guideTree;
    for (var i = 0; i < p.length; i++) {
        if (!node.children || !node.children[p[i]]) return null;
        node = node.children[p[i]];
    }
    return node;
}

var fails = [];
var seenId = {};
for (var i = 0; i < looks.length; i++) {
    var look = looks[i];
    if (seenId[look.id]) fails.push(look.id + ": duplicate id");
    seenId[look.id] = 1;
    if (!fs.existsSync(path.join(ROOT, look.img))) fails.push(look.id + ": missing image " + look.img);
    if (precache.indexOf('"./' + look.img + '"') === -1) fails.push(look.id + ": " + look.img + " not in sw.js PRECACHE");
    var node = resolve(look.guidePath);
    if (!node) fails.push(look.id + ": guidePath does not resolve " + JSON.stringify(look.guidePath));
    else if (node.type !== "topic") fails.push(look.id + ": guidePath is a " + node.type + ", not a topic");
}

console.log(looks.length + " looks checked");
for (var f = 0; f < fails.length; f++) console.error("FAIL: " + fails[f]);
if (fails.length) process.exit(1);
console.log("PASS: images vendored, precached, and every guidePath resolves to a topic");
