// Regenerates the MAP_COASTS block in mill-map.js from Natural Earth
// 50m land polygons (public domain, naturalearthdata.com).
//
// Usage:
//   curl -sL -o ne_50m_land.geojson https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson
//   node tools/make-coasts.js [tolerance] [minDiagonal]   # defaults 0.05 0.3
// then paste coasts-out.js over the MAP_COASTS array in mill-map.js.
// The geojson source is NOT vendored (1.6MB); fetch it when regenerating.
var fs = require("fs");
var gj = JSON.parse(fs.readFileSync(__dirname + "/ne_50m_land.geojson", "utf8"));
var LON_MIN = -12, LON_MAX = 34, LAT_MIN = 29, LAT_MAX = 61;

// Sutherland–Hodgman clip of a ring against the bbox
function clipRing(ring) {
  var edges = [
    function (p) { return p[0] >= LON_MIN; },
    function (p) { return p[0] <= LON_MAX; },
    function (p) { return p[1] >= LAT_MIN; },
    function (p) { return p[1] <= LAT_MAX; },
  ];
  var inter = [
    function (a, b) { var t = (LON_MIN - a[0]) / (b[0] - a[0]); return [LON_MIN, a[1] + t * (b[1] - a[1])]; },
    function (a, b) { var t = (LON_MAX - a[0]) / (b[0] - a[0]); return [LON_MAX, a[1] + t * (b[1] - a[1])]; },
    function (a, b) { var t = (LAT_MIN - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), LAT_MIN]; },
    function (a, b) { var t = (LAT_MAX - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), LAT_MAX]; },
  ];
  var out = ring;
  for (var e = 0; e < 4; e++) {
    var input = out;
    out = [];
    if (!input.length) break;
    for (var i = 0; i < input.length; i++) {
      var cur = input[i], prev = input[(i + input.length - 1) % input.length];
      var curIn = edges[e](cur), prevIn = edges[e](prev);
      if (curIn) {
        if (!prevIn) out.push(inter[e](prev, cur));
        out.push(cur);
      } else if (prevIn) {
        out.push(inter[e](prev, cur));
      }
    }
  }
  return out;
}

// Douglas–Peucker
function dp(points, tol) {
  if (points.length < 3) return points;
  function perp(p, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return Math.sqrt(Math.pow(p[0] - a[0], 2) + Math.pow(p[1] - a[1], 2));
    return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / len;
  }
  function rec(pts, first, last, keep) {
    var maxD = 0, idx = -1;
    for (var i = first + 1; i < last; i++) {
      var d = perp(pts[i], pts[first], pts[last]);
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol) {
      rec(pts, first, idx, keep);
      keep.push(idx);
      rec(pts, idx, last, keep);
    }
  }
  var keep = [0, points.length - 1];
  rec(points, 0, points.length - 1, keep);
  keep.sort(function (a, b) { return a - b; });
  var out = [];
  for (var k = 0; k < keep.length; k++) {
    if (k === 0 || keep[k] !== keep[k - 1]) out.push(points[keep[k]]);
  }
  return out;
}

function ringBBoxDiag(ring) {
  var minX = 999, maxX = -999, minY = 999, maxY = -999;
  for (var i = 0; i < ring.length; i++) {
    var p = ring[i];
    if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0];
    if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1];
  }
  return Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2));
}

var TOL = parseFloat(process.argv[2] || "0.055");
var MIN_DIAG = parseFloat(process.argv[3] || "0.32");

var rings = [];
gj.features.forEach(function (f) {
  var polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  polys.forEach(function (poly) {
    var outer = poly[0]; // outer ring only
    // quick reject
    var any = false;
    for (var i = 0; i < outer.length; i++) {
      var p = outer[i];
      if (p[0] >= LON_MIN && p[0] <= LON_MAX && p[1] >= LAT_MIN && p[1] <= LAT_MAX) { any = true; break; }
    }
    // also keep rings that fully contain the bbox (continent ring)
    if (!any) {
      // does the ring surround the bbox centre? cheap winding test
      var cx = (LON_MIN + LON_MAX) / 2, cy = (LAT_MIN + LAT_MAX) / 2, inside = false;
      for (var a = 0, b = outer.length - 1; a < outer.length; b = a++) {
        if ((outer[a][1] > cy) !== (outer[b][1] > cy) &&
            cx < (outer[b][0] - outer[a][0]) * (cy - outer[a][1]) / (outer[b][1] - outer[a][1]) + outer[a][0]) inside = !inside;
      }
      if (!inside) return;
    }
    var clipped = clipRing(outer);
    if (clipped.length < 4) return;
    var simple = dp(clipped, TOL);
    if (simple.length < 4) return;
    if (ringBBoxDiag(simple) < MIN_DIAG) return;
    rings.push(simple);
  });
});

var totalPts = 0;
var js = "var MAP_COASTS = [\n";
rings.forEach(function (r) {
  totalPts += r.length;
  js += "    [" + r.map(function (p) { return "[" + p[0].toFixed(2) + "," + p[1].toFixed(2) + "]"; }).join(",") + "],\n";
});
js += "];\n";
fs.writeFileSync(__dirname + "/coasts-out.js", js);
console.log("rings:", rings.length, "points:", totalPts, "bytes:", js.length);
