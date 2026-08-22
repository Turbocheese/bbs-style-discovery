// ============================================
// GARMENT MESH — real 3D rendering for the peak-lapel jacket (Phase 1).
//
// Why this file exists: garment-photo.js's DISPLACEMENT_REGIONS approach
// (rotate+scale a flat pattern inside hand-traced 2D clip polygons) hit its
// ceiling on the peak lapel's collar/gorge seam — five independent AI
// panel-colour generations across two models never found a genuine seam to
// trace, and a forced 52-degree rotation difference was barely visible in
// that band. A real 3D mesh sidesteps the whole class of problem: there is
// no seam to argue about because there is no second rotated region, just
// one continuous surface with the fold built into its geometry.
//
// This does NOT touch the photo-compositing path in garment-photo.js at
// all. GARMENT_MESH_KEYS below opts in only the peak lapel jacket; every
// other garment keeps rendering exactly as it did before. See
// renderGarmentPhoto's dispatch in garment-photo.js.
//
// DISABLED (August 2026): after several rounds of tuning this still read
// as visibly synthetic ("flat piece") rather than photographic, and the
// real-photo pattern approach explored afterward hit its own hard wall
// (see docs/2026-08-22-pattern-photo-realism-prompts.md and
// garment-photo.js's PATTERN_PHOTO_KEYS comment). The founder asked to
// revert to the known-good 2D DISPLACEMENT_REGIONS path rather than keep
// iterating. This file and vendor/three.min.js are no longer loaded
// (removed from index.html/sw.js) — GARMENT_MESH_KEYS below is dead code
// while that's true, kept only as a record of what was tried. Re-add the
// two `<script>` tags to bring this back if a future attempt picks the
// mesh approach back up.
//
// Load order: this file loads AFTER garment-photo.js (needs
// JACKET_SB_PEAK_LAPELS / JACKET_SB_PEAK_TIPS as already-defined globals —
// reusing the exact boundary data traced from the founder's flat-colour
// panel edit this session, not a second copy of it) and after
// vendor/three.min.js. garment-photo.js's renderGarmentPhoto references
// GARMENT_MESH_KEYS/renderGarmentMesh3D from this file at CALL time, not
// parse time, so the later load position is safe — same pattern this
// codebase already uses for share-qr.js/client-profile.js.
// ============================================

var GARMENT_MESH_KEYS = ["jacket-sb-peak-patch", "jacket-sb-peak-flap"];

// ---- Silhouette envelope ----
// Real measured top/bottom boundary of jacket-sb-peak-flap.png (background-
// threshold scan, same technique used earlier this session to verify the
// Qwen panel edit's pose match), sampled every 2% of frame width. This is
// what gives the mesh its actual shoulder taper and hem line instead of a
// guessed trapezoid.
var MESH_SILHOUETTE = [
    { x: 0.10, top: 0.5530, bot: 0.8694 }, { x: 0.12, top: 0.3602, bot: 0.8707 },
    { x: 0.14, top: 0.2561, bot: 0.8711 }, { x: 0.16, top: 0.1962, bot: 0.8711 },
    { x: 0.18, top: 0.1606, bot: 0.8707 }, { x: 0.20, top: 0.1515, bot: 0.8689 },
    { x: 0.22, top: 0.1441, bot: 0.9106 }, { x: 0.24, top: 0.1376, bot: 0.9240 },
    { x: 0.26, top: 0.1311, bot: 0.9323 }, { x: 0.28, top: 0.1246, bot: 0.9375 },
    { x: 0.30, top: 0.1176, bot: 0.9410 }, { x: 0.32, top: 0.1111, bot: 0.9440 },
    { x: 0.34, top: 0.1046, bot: 0.9466 }, { x: 0.36, top: 0.0955, bot: 0.9484 },
    { x: 0.38, top: 0.0838, bot: 0.9475 }, { x: 0.40, top: 0.0660, bot: 0.9401 },
    { x: 0.42, top: 0.0538, bot: 0.9384 }, { x: 0.44, top: 0.0516, bot: 0.9379 },
    { x: 0.46, top: 0.0503, bot: 0.9379 }, { x: 0.48, top: 0.0499, bot: 0.9379 },
    { x: 0.50, top: 0.0499, bot: 0.9379 }, { x: 0.52, top: 0.0499, bot: 0.9375 },
    { x: 0.54, top: 0.0503, bot: 0.9375 }, { x: 0.56, top: 0.0512, bot: 0.9379 },
    { x: 0.58, top: 0.0538, bot: 0.9379 }, { x: 0.60, top: 0.0660, bot: 0.9405 },
    { x: 0.62, top: 0.0833, bot: 0.9479 }, { x: 0.64, top: 0.0951, bot: 0.9488 },
    { x: 0.66, top: 0.1042, bot: 0.9470 }, { x: 0.68, top: 0.1111, bot: 0.9444 },
    { x: 0.70, top: 0.1176, bot: 0.9414 }, { x: 0.72, top: 0.1241, bot: 0.9375 },
    { x: 0.74, top: 0.1311, bot: 0.9323 }, { x: 0.76, top: 0.1376, bot: 0.9249 },
    { x: 0.78, top: 0.1441, bot: 0.9115 }, { x: 0.80, top: 0.1510, bot: 0.8685 },
    { x: 0.82, top: 0.1602, bot: 0.8707 }, { x: 0.84, top: 0.1949, bot: 0.8711 },
    { x: 0.86, top: 0.2543, bot: 0.8711 }, { x: 0.88, top: 0.3559, bot: 0.8707 },
    { x: 0.90, top: 0.5477, bot: 0.8698 }
];

function meshSilhouetteAt(fx) {
    var pts = MESH_SILHOUETTE;
    if (fx <= pts[0].x) return pts[0];
    if (fx >= pts[pts.length - 1].x) return pts[pts.length - 1];
    for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1];
        if (fx >= a.x && fx <= b.x) {
            var t = (fx - a.x) / (b.x - a.x);
            return { top: a.top + (b.top - a.top) * t, bot: a.bot + (b.bot - a.bot) * t };
        }
    }
    return pts[pts.length - 1];
}

// ---- Point-in-polygon / edge-distance, for reading the lapel fold out of
// the already-traced clip polygons (JACKET_SB_PEAK_LAPELS/_TIPS globals) ----
function pointInPoly(x, y, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        var xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y;
        var hit = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (hit) inside = !inside;
    }
    return inside;
}
function distToSegment(x, y, ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay;
    var len2 = dx * dx + dy * dy;
    var t = len2 > 0 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2)) : 0;
    var px = ax + t * dx, py = ay + t * dy;
    return Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
}
function distToPolyEdge(x, y, poly) {
    var best = Infinity;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        var d = distToSegment(x, y, poly[i].x, poly[i].y, poly[j].x, poly[j].y);
        if (d < best) best = d;
    }
    return best;
}

// The traced lapel/tip clip polygons are ~9 straight-line points each —
// exact where they were measured, but a straight-segment boundary facets
// visibly at sharp corners (the peak tip especially, where several short
// segments meet at a steep angle). Catmull-Rom through the same points,
// closed as a loop, keeps every original vertex exactly where it was
// measured while filling in a smooth curve between them, so the fold
// boundary and crease line read as curved rather than blocky. Run once per
// polygon at mesh-build time and cached, not recomputed per vertex.
function catmullRom(p0, p1, p2, p3, t) {
    var t2 = t * t, t3 = t2 * t;
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
function smoothPolygonClosed(poly, segmentsPerEdge) {
    var n = poly.length;
    if (n < 3) return poly;
    var out = [];
    for (var i = 0; i < n; i++) {
        var p0 = poly[(i - 1 + n) % n], p1 = poly[i], p2 = poly[(i + 1) % n], p3 = poly[(i + 2) % n];
        for (var s = 0; s < segmentsPerEdge; s++) {
            var t = s / segmentsPerEdge;
            out.push({
                x: catmullRom(p0.x, p1.x, p2.x, p3.x, t),
                y: catmullRom(p0.y, p1.y, p2.y, p3.y, t)
            });
        }
    }
    return out;
}
var _smoothedPolyCache = null; // WeakMap-style lookup keyed by the original array reference
function smoothedClip(poly) {
    if (!poly) return poly;
    if (!_smoothedPolyCache) _smoothedPolyCache = (typeof WeakMap !== "undefined") ? new WeakMap() : null;
    if (_smoothedPolyCache && _smoothedPolyCache.has(poly)) return _smoothedPolyCache.get(poly);
    var smoothed = smoothPolygonClosed(poly, 8);
    if (_smoothedPolyCache) _smoothedPolyCache.set(poly, smoothed);
    return smoothed;
}

// Depth at a fractional canvas point: 0 on the flat body, rising smoothly
// toward the interior of the lapel (the roll pushing the fabric toward the
// viewer), rising further inside the peak-tip sub-zone (the sharp corner
// this session spent so long on). Not a physics simulation and not claimed
// to be metrically exact.
//
// Raised sharply from the original 0.052/0.030 (informed by trig off the
// measured angle differences, ~2.5% of the frame height) after the
// founder looked at the actual live render and called it correctly: it
// read as flat regardless of how much shading/AO/lighting sat on top of
// it, because the underlying geometry barely had any depth to shade.
// Lighting and occlusion can sell a fold that's really there; they can't
// invent volume that isn't. This is now a deliberately stylized depth for
// visual conviction on an in-store demo, not a metrically accurate one —
// consistent with this app's own stated framing of the visualiser as a
// "wow"-factor experience, not a measurement tool.
var LAPEL_FOLD_DEPTH = 0.15;    // roughly canvas-width-fraction units — was 0.052
var TIP_FOLD_DEPTH = 0.09;      // additional depth inside the peak-tip zone — was 0.030
// Tightened from 0.045 — the wider value let the pattern read as softened/
// blurred well before it actually reached the roll line, since the fold's
// z-depth (and so the texture's apparent compression) was ramping up too
// gradually. A crisper ramp keeps the pattern reading sharp right up to the
// bend, matching how a pressed seam actually behaves rather than a slow taper.
var FOLD_EDGE_SOFTEN = 0.030;

function foldDepthAt(fx, fy) {
    var lapels = (typeof JACKET_SB_PEAK_LAPELS !== "undefined") ? JACKET_SB_PEAK_LAPELS : [];
    var tips = (typeof JACKET_SB_PEAK_TIPS !== "undefined") ? JACKET_SB_PEAK_TIPS : [];
    var depth = 0;
    for (var i = 0; i < lapels.length; i++) {
        var clip = smoothedClip(lapels[i].clip);
        if (!clip || !pointInPoly(fx, fy, clip)) continue;
        var edge = distToPolyEdge(fx, fy, clip);
        var t = Math.max(0, Math.min(1, edge / FOLD_EDGE_SOFTEN));
        // smoothstep, so the fold rises off the seam rather than kinking
        var s = t * t * (3 - 2 * t);
        depth = Math.max(depth, s * LAPEL_FOLD_DEPTH);
    }
    for (var j = 0; j < tips.length; j++) {
        var tclip = smoothedClip(tips[j].clip);
        if (!tclip || !pointInPoly(fx, fy, tclip)) continue;
        var tedge = distToPolyEdge(fx, fy, tclip);
        var tt = Math.max(0, Math.min(1, tedge / (FOLD_EDGE_SOFTEN * 0.7)));
        var ts = tt * tt * (3 - 2 * tt);
        depth += ts * TIP_FOLD_DEPTH;
    }
    return depth;
}

// ---- The chest opening (where the jacket falls open over the shirt/lining,
// not fabric at all) ----
// The first render pass had no concept of this — the whole silhouette was
// treated as one continuous sheet of cloth, so what should read as a dark
// open front just read as more (badly shaded) fabric, and the garment
// looked like a rounded blob instead of a jacket. Both lapel clip polygons
// already trace this edge implicitly: each one's point list runs down the
// OUTER visible edge (collar to peak to roll line) and then closes back up
// via a straight run to the shared bottom point (0.4866, 0.5449) — that
// closing run *is* the front/button edge, i.e. the inner boundary of the
// opening. Left uses its own top-inner point; right's is explicit in its
// own clip list (see JACKET_SB_PEAK_LAPELS in garment-photo.js).
var OPENING_TOP_Y = 0.0510;
var OPENING_BOTTOM_Y = 0.5449;
var OPENING_LEFT_TOP_X = 0.4499, OPENING_RIGHT_TOP_X = 0.5503, OPENING_BOTTOM_X = 0.4866;

function openingBoundsAt(fy) {
    if (fy < OPENING_TOP_Y || fy > OPENING_BOTTOM_Y) return null;
    var t = (fy - OPENING_TOP_Y) / (OPENING_BOTTOM_Y - OPENING_TOP_Y);
    return {
        left: OPENING_LEFT_TOP_X + (OPENING_BOTTOM_X - OPENING_LEFT_TOP_X) * t,
        right: OPENING_RIGHT_TOP_X + (OPENING_BOTTOM_X - OPENING_RIGHT_TOP_X) * t
    };
}
function smoothstep(edge0, edge1, x) {
    var t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}
// Signed distance from the nearer opening edge (positive = inside, toward
// the centre) run through a smoothstep with a fixed real-world-scale
// margin, NOT a hard fx>left && fx<right test. A binary inside/outside
// test sampled on any finite grid staircases along a diagonal line no
// matter how fine the grid — this softens the transition across a fixed
// band instead, so the edge reads as a clean diagonal at any resolution.
var OPENING_EDGE_MARGIN = 0.012;
function openingDepthT(fx, fy) {
    var b = openingBoundsAt(fy);
    if (!b) return 0;
    var half = (b.right - b.left) / 2;
    if (half <= 0) return 0;
    var mid = (b.left + b.right) / 2;
    var distIn = half - Math.abs(fx - mid); // >0 inside, <0 outside
    return smoothstep(-OPENING_EDGE_MARGIN, OPENING_EDGE_MARGIN, distIn);
}
var OPENING_RECESS = 0.09; // raised alongside the lapel depth above, same reasoning
var LINING_COLOR = [0.05, 0.05, 0.06];
var FABRIC_COLOR = [1, 1, 1];

// ---- Seam lines ----
// Smooth shading alone reads as a rounded blob, not tailoring — real
// garments have crisp pressed edges at every seam. These darken the vertex
// colour near a seam line rather than cutting real geometry there (a
// visible crease without an actual fold keeps the surface simple to
// compute normals on, and reads correctly under any of the three lights).
function seamLineAt(dist, width, strength) {
    // 1 right on the line, falling to 0 by `width` away — squared falloff
    // reads as a crisper pressed line than a linear one.
    var t = Math.max(0, 1 - dist / width);
    return t * t * strength;
}
var SEAM_WIDTH = 0.006;
var SEAM_STRENGTH = 0.55;
// The shoulder/sleeve seam needs a wider band than the lapel crease — at
// SEAM_WIDTH it was under two grid columns wide (MESH_COLS spans ~0.0051
// per column) and never cleared the visibility threshold in testing.
var SLEEVE_SEAM_WIDTH = 0.022;
var SLEEVE_SEAM_STRENGTH = 0.6;

// Shoulder/sleeve seams: approximate straight segments at the shoulder
// point the silhouette scan already located (~x 0.20/0.80, where the
// silhouette's outward growth rate visibly changes — see the silhouette
// analysis earlier this session), running from the collar down to
// roughly where the underarm would be.
var SLEEVE_SEAM_LEFT_X = 0.205, SLEEVE_SEAM_RIGHT_X = 0.795;
var SLEEVE_SEAM_Y0 = 0.09, SLEEVE_SEAM_Y1 = 0.46;

// Gorge seam (collar sewn to lapel) — unlike every other line in this file,
// this one is NOT backed by measurement. Five separate AI panel-colour
// generations across two models never found a visible boundary here in the
// actual reference photo, and a forced-rotation test showed the difference
// barely reads even at extreme angles — see this session's history. What's
// different in a real mesh: a peak lapel genuinely does have this as a
// separate cut piece in real tailoring construction, whether or not this
// specific photo happens to show it, so a plausible construction line is
// defensible here in a way that forcing a pattern-colour fracture wasn't.
// Endpoints are the two already-traced vertices nearest where a gorge seam
// conventionally runs (collar-back corner to the point on the lapel's own
// boundary just before the peak-tip's sharp acceleration begins) — chosen
// from existing trace data, not newly estimated.
var GORGE_SEAM_WIDTH = 0.009;
var GORGE_SEAM_STRENGTH = 0.5; // still lighter than the roll-line crease's 0.55 — a construction guess, not a measured edge — but enough to read as a real indentation rather than a hint
var GORGE_LEFT = [{ x: 0.4499, y: 0.0510 }, { x: 0.3440, y: 0.1051 }];
var GORGE_RIGHT = [{ x: 0.5503, y: 0.0510 }, { x: 0.6529, y: 0.1026 }];

function seamDarkenAt(fx, fy, lapels, tips) {
    var darken = 0;
    darken = Math.max(darken, seamLineAt(distToSegment(fx, fy, GORGE_LEFT[0].x, GORGE_LEFT[0].y, GORGE_LEFT[1].x, GORGE_LEFT[1].y), GORGE_SEAM_WIDTH, GORGE_SEAM_STRENGTH));
    darken = Math.max(darken, seamLineAt(distToSegment(fx, fy, GORGE_RIGHT[0].x, GORGE_RIGHT[0].y, GORGE_RIGHT[1].x, GORGE_RIGHT[1].y), GORGE_SEAM_WIDTH, GORGE_SEAM_STRENGTH));
    // Lapel roll-line + peak-tip crease: trace the exact already-measured
    // boundary, not a guess.
    for (var i = 0; i < lapels.length; i++) {
        if (!lapels[i].clip) continue;
        darken = Math.max(darken, seamLineAt(distToPolyEdge(fx, fy, smoothedClip(lapels[i].clip)), SEAM_WIDTH, SEAM_STRENGTH));
    }
    for (var j = 0; j < tips.length; j++) {
        if (!tips[j].clip) continue;
        darken = Math.max(darken, seamLineAt(distToPolyEdge(fx, fy, smoothedClip(tips[j].clip)), SEAM_WIDTH, SEAM_STRENGTH));
    }
    // Shoulder/sleeve seams
    if (fy >= SLEEVE_SEAM_Y0 && fy <= SLEEVE_SEAM_Y1) {
        darken = Math.max(darken, seamLineAt(Math.abs(fx - SLEEVE_SEAM_LEFT_X), SLEEVE_SEAM_WIDTH, SLEEVE_SEAM_STRENGTH));
        darken = Math.max(darken, seamLineAt(Math.abs(fx - SLEEVE_SEAM_RIGHT_X), SLEEVE_SEAM_WIDTH, SLEEVE_SEAM_STRENGTH));
    }
    darken = Math.max(darken, contactAOAt(fx, fy, lapels, tips));
    return darken;
}

// ---- Contact shadow / ambient occlusion ----
// The genuinely well-targeted half of the "perspective camera" request:
// the lapel overhangs the body fabric right beside it (positive fold depth
// on one side of the boundary, zero on the other), and a real overhang
// casts a soft contact shadow onto the surface just below it — that's a
// legitimate, standard way to sell a raised edge, and unlike a close
// perspective camera it doesn't fight the flat-on product-photography look
// the rest of this app's photography already commits to (see the AI photo
// briefs' own "camera at chest height," not a wide-angle close-up).
// Applies OUTSIDE each lapel/tip polygon only, fading with distance — the
// inside already has its own crease line from seamDarkenAt above.
var AO_BAND = 0.028;
var AO_STRENGTH = 0.30;
function contactAOAt(fx, fy, lapels, tips) {
    var ao = 0;
    for (var i = 0; i < lapels.length; i++) {
        var clip = smoothedClip(lapels[i].clip);
        if (!clip || pointInPoly(fx, fy, clip)) continue; // inside already has the crease line
        ao = Math.max(ao, seamLineAt(distToPolyEdge(fx, fy, clip), AO_BAND, AO_STRENGTH));
    }
    for (var j = 0; j < tips.length; j++) {
        var tclip = smoothedClip(tips[j].clip);
        if (!tclip || pointInPoly(fx, fy, tclip)) continue;
        ao = Math.max(ao, seamLineAt(distToPolyEdge(fx, fy, tclip), AO_BAND, AO_STRENGTH));
    }
    return ao;
}

// ---- Build the geometry ----
// One continuous grid over the jacket front (body + lapel + collar as one
// surface, no seam between them — that continuity is the entire point) plus
// two simple sleeve strips. Resolution is a static one-time cost (this is
// not resimulated per frame like cloth-study's drape), so it can afford to
// be fine enough to read as smooth rather than faceted.
// High enough that the diagonal opening edge and the lapel fold's own
// boundary don't visibly stair-step — this is a one-time static build, not
// resimulated per frame, so the cost is negligible on any GPU this app
// targets.
var MESH_COLS = 160, MESH_ROWS = 190;
var MESH_X0 = 0.095, MESH_X1 = 0.905;
var MESH_ASPECT = 1600 / 1289; // canvas height/width this trace was measured against

function buildJacketGeometry() {
    var positions = [];
    var uvs = [];
    var colors = [];
    var indices = [];

    // Rows must share ONE fy per row index across every column — sampling
    // each column's own [top,bot] independently (the first pass's bug)
    // means row r lands at a different actual height in each column, so
    // neighbouring columns' "same row" quads connect mismatched heights.
    // That's what produced the jagged notch partway down the opening.
    // Fix: sample fy from the GLOBAL top/bottom span, shared by every
    // column, and clamp each vertex to its OWN column's silhouette at the
    // edges — vertices pile up along the true per-column boundary instead
    // of drifting off it.
    var globalTop = Infinity, globalBot = -Infinity;
    for (var gi = 0; gi < MESH_SILHOUETTE.length; gi++) {
        if (MESH_SILHOUETTE[gi].top < globalTop) globalTop = MESH_SILHOUETTE[gi].top;
        if (MESH_SILHOUETTE[gi].bot > globalBot) globalBot = MESH_SILHOUETTE[gi].bot;
    }
    var lapels = (typeof JACKET_SB_PEAK_LAPELS !== "undefined") ? JACKET_SB_PEAK_LAPELS : [];
    var tips = (typeof JACKET_SB_PEAK_TIPS !== "undefined") ? JACKET_SB_PEAK_TIPS : [];

    for (var r = 0; r < MESH_ROWS; r++) {
        var rt = r / (MESH_ROWS - 1);
        var globalFy = globalTop + (globalBot - globalTop) * rt;
        for (var c = 0; c < MESH_COLS; c++) {
            var ct = c / (MESH_COLS - 1);
            var fx = MESH_X0 + (MESH_X1 - MESH_X0) * ct;
            var sil = meshSilhouetteAt(fx);
            var fy = Math.max(sil.top, Math.min(sil.bot, globalFy));

            // Blend continuously by openT (0 = fabric, 1 = deep inside the
            // opening) rather than branching on it — a hard switch between
            // two depth/colour formulas would recreate exactly the kind of
            // per-vertex snap that staircases on a grid, just in depth and
            // colour instead of position.
            var openT = openingDepthT(fx, fy);
            var foldD = foldDepthAt(fx, fy);
            var depth = foldD + (-OPENING_RECESS - foldD) * openT;
            var seam = openT > 0.5 ? 0 : seamDarkenAt(fx, fy, lapels, tips);
            var colorAt = [
                FABRIC_COLOR[0] + (LINING_COLOR[0] - FABRIC_COLOR[0]) * openT,
                FABRIC_COLOR[1] + (LINING_COLOR[1] - FABRIC_COLOR[1]) * openT,
                FABRIC_COLOR[2] + (LINING_COLOR[2] - FABRIC_COLOR[2]) * openT
            ];
            colorAt[0] *= (1 - seam); colorAt[1] *= (1 - seam); colorAt[2] *= (1 - seam);
            // World space: x centred at 0, y up-positive (canvas is
            // y-down), scaled by the real canvas aspect so the mesh isn't
            // stretched relative to the trace it was built from.
            var wx = (fx - 0.5) * 2;
            var wy = -(fy - 0.5) * 2 * MESH_ASPECT;
            var wz = depth;
            positions.push(wx, wy, wz);
            uvs.push(fx, 1 - fy);
            colors.push(colorAt[0], colorAt[1], colorAt[2]);
        }
    }
    for (var r2 = 0; r2 < MESH_ROWS - 1; r2++) {
        for (var c2 = 0; c2 < MESH_COLS - 1; c2++) {
            var i0 = r2 * MESH_COLS + c2;
            var i1 = i0 + 1;
            var i2 = i0 + MESH_COLS;
            var i3 = i2 + 1;
            indices.push(i0, i2, i1, i1, i2, i3);
        }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
}

// ---- Cloth texture: the exact same tile every other render path uses ----
function buildClothTexture(cloth) {
    // Power-of-2 size (not a straight 96x4 oversample) — mipmapping, which
    // is what actually fixes the stripe aliasing, needs POT dimensions to
    // work reliably on a WebGL1 fallback context; WebGL2 doesn't require
    // it but there's no quality cost to keeping it POT either way.
    var size = 512;
    var tile = document.createElement("canvas");
    tile.width = size; tile.height = size;
    var tctx = tile.getContext("2d");
    tctx.scale(size / 96, size / 96);
    drawClothTile(tctx, cloth);
    var tex = new THREE.CanvasTexture(tile);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    // Repeat density matches clothTileScale's intent in garment-photo.js —
    // the weave was authored against a 644px-wide reference frame.
    var repeat = 1289 / 96;
    tex.repeat.set(repeat, repeat * MESH_ASPECT);
    // The actual fix for high-contrast stripes aliasing: this is texture
    // minification moiré (a fine repeating pattern viewed at a size smaller
    // than its native resolution), not a pixel-ratio problem — the canvas
    // here is already rendered at full physical resolution (see the
    // renderer setup below), and MSAA (antialias:true) only smooths
    // geometry edges, not texture sampling. Mipmaps + anisotropic filtering
    // is the correct fix for this specific symptom.
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
}

// ---- Lighting rigs, ported from garment-photo.js's LIGHTING_RIGS intent ----
// HemisphereLight (sky colour above, ground colour below, blended by each
// point's own surface normal) in place of a flat AmbientLight — a single
// flat ambient term lights every face equally regardless of which way it
// turns, which is exactly why the fold read shallow/flat before. Hemisphere
// still isn't a cast shadow (no shadow-map pass — see the render function's
// comment on why that's deliberately out of scope here), but it's what
// actually gives the "studio" gradient depth along the roll line: a fold
// facing up toward the key light reads brighter, one facing down toward the
// (implicit) floor reads darker, on top of the direct light's own falloff.
function buildLights(mode) {
    var group = new THREE.Group();
    // Balance shifted toward the key light and away from the hemisphere
    // term (roughly the same total energy, redistributed) — a bigger gap
    // between the lit and shaded side of the fold is what actually reads
    // as volume; a flatter balance was correct exposure but under-sold the
    // curve. Ratio of key:hemisphere widened on all three rigs, not just
    // daylight, so the fold reads consistently under every lighting mode.
    if (mode === "warm") {
        group.add(new THREE.HemisphereLight(0xffd9a0, 0x3a2f22, 0.45));
        var warmKey = new THREE.DirectionalLight(0xffeecd, 1.0);
        warmKey.position.set(-0.3, 0.6, 1.4);
        group.add(warmKey);
    } else if (mode === "sunlight") {
        group.add(new THREE.HemisphereLight(0xeaf0ff, 0x14151a, 0.28));
        var sunKey = new THREE.DirectionalLight(0xfffef9, 1.25);
        sunKey.position.set(-0.8, 0.7, 1.1);
        group.add(sunKey);
        var sunFill = new THREE.DirectionalLight(0x16181e, 0.16);
        sunFill.position.set(0.6, -0.4, 0.6);
        group.add(sunFill);
    } else {
        // daylight — the baseline, still soft and even but with more of the
        // gap between hemisphere and key light than the original pass had
        group.add(new THREE.HemisphereLight(0xffffff, 0xd9d2c2, 0.5));
        var dayKey = new THREE.DirectionalLight(0xffffff, 0.82);
        dayKey.position.set(-0.4, 0.5, 1.2);
        group.add(dayKey);
        var dayFill = new THREE.DirectionalLight(0xffffff, 0.22);
        dayFill.position.set(0.5, -0.2, 0.8);
        group.add(dayFill);
    }
    return group;
}

// ---- Cached geometry (same for every cloth/lighting — only the texture and
// lights change) ----
var _meshGeometryCache = null;
function jacketGeometry() {
    if (!_meshGeometryCache) _meshGeometryCache = buildJacketGeometry();
    return _meshGeometryCache;
}

// ---- Buttons ----
// Two-button front, dark horn-effect — matches the real photo assets'
// description ("buttons dark horn-effect, positioned mid-torso"). Simple
// flattened spheres rather than a texture, since these read fine as
// geometry at this scale and pick up the scene's own lighting for free
// (a highlight moves across them correctly under the sunlight rig).
var BUTTON_POSITIONS = [
    { x: 0.5051, y: 0.548 },
    { x: 0.5051, y: 0.665 }
];
var BUTTON_RADIUS = 0.014;
var _buttonGeoCache = null;
function buildButtons() {
    var group = new THREE.Group();
    if (!_buttonGeoCache) _buttonGeoCache = new THREE.SphereGeometry(BUTTON_RADIUS, 16, 12);
    var mat = new THREE.MeshPhongMaterial({ color: 0x1c1712, shininess: 70, specular: 0x554433 });
    for (var i = 0; i < BUTTON_POSITIONS.length; i++) {
        var p = BUTTON_POSITIONS[i];
        var wx = (p.x - 0.5) * 2;
        var wy = -(p.y - 0.5) * 2 * MESH_ASPECT;
        var wz = foldDepthAt(p.x, p.y) + BUTTON_RADIUS * 0.6;
        var btn = new THREE.Mesh(_buttonGeoCache, mat);
        btn.position.set(wx, wy, wz);
        btn.scale.z = 0.5; // pressed flatter than a full sphere, closer to a real button's profile
        group.add(btn);
    }
    return group;
}

// Tracks the single most recent renderer + the canvas it's bound to — NOT
// a plain-object cache keyed by the canvas element. A plain object coerces
// an object key to a string (every HTMLCanvasElement stringifies to the
// same "[object HTMLCanvasElement]"), so `{}[canvas]` collides for every
// canvas regardless of which one it actually is. That bug shipped in the
// first version of this file: fabric-visualiser.js rebuilds the DOM (and
// so the canvas element) on every render(), so the SECOND cloth a client
// picked would silently reuse the FIRST render's renderer — still bound to
// the first, now-detached canvas — and the visible (new) canvas never got
// drawn to at all. Confirmed directly: switching cloths 3 times in one
// session left the jacket blank from the second switch on, with no error,
// no lost-context flag, nothing — `renderer.render()` was succeeding, just
// against the wrong element. Fix: compare canvas identity directly (a
// simple `===`, which plain-object string coercion can't do), and dispose
// the old renderer when the canvas has actually changed — this also
// closes a second, related problem the caching was trying (and failing)
// to solve: without disposal, every cloth switch would have created a
// brand new WebGL context and never freed the old one, eventually hitting
// the browser's per-page context limit.
var _meshRenderer = null;
var _meshRendererCanvas = null;

function renderGarmentMesh3D(canvas, garmentKey, clothKey, lightingMode) {
    if (typeof THREE === "undefined") return false;
    var cloth = (typeof findCloth === "function") ? findCloth(clothKey) : null;
    if (!cloth) return false;

    try {
        if (_meshRendererCanvas !== canvas) {
            if (_meshRenderer) {
                try { _meshRenderer.dispose(); } catch (disposeErr) { /* best effort */ }
            }
            _meshRenderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
                // Exports (PDF/PNG) go through html2canvas reading the
                // canvas's current pixels — without this the WebGL buffer
                // can already be cleared by the time html2canvas captures
                // it, and the export comes out blank.
                preserveDrawingBuffer: true
            });
            _meshRendererCanvas = canvas;
        }
    } catch (e) {
        console.error("garment-mesh: WebGL context creation failed, falling back to photo path", e);
        _meshRenderer = null;
        _meshRendererCanvas = null;
        return false;
    }
    var renderer = _meshRenderer;

    try {
        renderer.setSize(canvas.width, canvas.height, false);
        renderer.setClearColor(0x000000, 0);

        var scene = new THREE.Scene();
        scene.add(buildLights(lightingMode));

        var texture = buildClothTexture(cloth);
        // Anisotropic filtering needs a live renderer to query the
        // hardware's max supported level — this is the other half of the
        // stripe-aliasing fix alongside the mipmapping set in
        // buildClothTexture, and specifically helps where the fold turns
        // the surface away from face-on, which is exactly where oblique
        // texture sampling aliases worst.
        try { texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); } catch (e) {}
        // Standard (PBR) over Phong — Phong's shininess/specular model
        // reads as plastic because it doesn't model microfacet roughness at
        // all, it just narrows/widens one shiny highlight. Real worsted/
        // flannel scatters light diffusely with only a whisper of sheen,
        // which is what roughness this high plus zero metalness actually
        // produces. cloth-study.js's own lustreOf() tops out around 0.32
        // for silk/mohair and 0.08 for flannel — 0.85 roughness sits at the
        // matte end of that same range, appropriate for a wool suiting.
        var material = new THREE.MeshStandardMaterial({
            map: texture, vertexColors: true, roughness: 0.9, metalness: 0
        });
        var mesh = new THREE.Mesh(jacketGeometry(), material);
        scene.add(mesh);
        scene.add(buildButtons());

        var aspect = canvas.width / canvas.height;
        // Perspective, at the founder's explicit call — see this session's
        // history for the foreshortening argument against it (fold depth
        // is ~2.5% of frame height, orthographic is the standard choice
        // for flat-on product photography). FOV kept moderate/"tight"
        // rather than wide: a wide, close FOV is what produces dramatic
        // foreshortening, but it also bends straight lines near the frame
        // edges in a way that would look wrong next to this app's own
        // flat-on AI garment photography. Distance computed so the frame
        // height matches the previous orthographic view (viewH below),
        // so this is a like-for-like comparison, not also a reframe.
        var VIEW_H = 2.05;
        var PERSPECTIVE_FOV = 32;
        var fovRad = PERSPECTIVE_FOV * Math.PI / 180;
        var camDist = (VIEW_H / 2) / Math.tan(fovRad / 2);
        var camera = new THREE.PerspectiveCamera(PERSPECTIVE_FOV, aspect, 0.1, camDist * 3);
        camera.position.set(0, 0, camDist);
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        return true;
    } catch (e) {
        console.error("garment-mesh: render failed, falling back to photo path", e);
        return false;
    }
}

window.GARMENT_MESH_KEYS = GARMENT_MESH_KEYS;
window.renderGarmentMesh3D = renderGarmentMesh3D;
