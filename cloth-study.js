// ============================================
// CLOTH STUDY — interactive tools for the selected cloth in the Cloth Room.
// Four ways to read a cloth, all driven off the real cloth record (ground
// colour, weave, composition) and the currently selected key:
//   - The Drape: a hanging panel (verlet cloth) whose behaviour follows the
//     cloth's weight/weave — crisp worsted vs soft flannel.
//   - The Sheen: tilt a light across a swatch; a loupe TOGGLE swaps the same
//     swatch to a magnifier that resolves the weave to its threads.
//   - The Pairing Web: the cloths this one sits well beside, tap to switch to.
// One delegated pointer path per tool (no click listeners — the app keeps its
// single delegated click handler). initClothStudy() runs from the render hook.
// ============================================

(function () {
    var _raf = { drape: 0 };

    function hexRGB(hex) {
        hex = String(hex || "#808080").replace("#", "");
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
    }
    function clampByte(v) { return Math.max(0, Math.min(255, v | 0)); }
    function shift(c, m) { return "rgb(" + clampByte(c[0] + m) + "," + clampByte(c[1] + m) + "," + clampByte(c[2] + m) + ")"; }

    // Physical character inferred from the cloth record.
    function lustreOf(cloth) {
        var comp = (cloth.composition || "").toLowerCase(), weave = (cloth.weave || "");
        if (/mohair|silk|kid/.test(comp)) return 0.32;
        if (weave === "flannel") return 0.08;
        if (/fresco/.test((cloth.bunch || "").toLowerCase()) || /high.?twist/.test(comp)) return 0.24;
        return 0.15;
    }
    // gather = how much wider the cloth is than the bar it hangs from, which is
    // what decides fold depth; folds = radians of the seed wave per column, so
    // a light cloth breaks into more, finer folds than a heavy one.
    function handleOf(cloth) {
        var weave = (cloth.weave || ""), wt = (cloth.weight_class || "");
        if (weave === "flannel") return { stiff: 2, grav: 0.23, damp: 0.96, breeze: 0.07, gather: 0.66, folds: 0.62, label: "Soft, full drape" };
        if (wt === "heavy") return { stiff: 4, grav: 0.14, damp: 0.92, breeze: 0.024, gather: 0.77, folds: 0.46, label: "Crisp, structured" };
        if (wt === "light") return { stiff: 2, grav: 0.2, damp: 0.95, breeze: 0.06, gather: 0.62, folds: 0.78, label: "Light, fluid drape" };
        return { stiff: 3, grav: 0.18, damp: 0.94, breeze: 0.04, gather: 0.70, folds: 0.60, label: "Balanced drape" };
    }

    function fit(cv, h) {
        var dpr = Math.min(2, window.devicePixelRatio || 1);
        var w = cv.clientWidth || cv.parentNode.clientWidth || 320;
        cv.width = Math.max(1, Math.round(w * dpr)); cv.height = Math.max(1, Math.round(h * dpr));
        var ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx: ctx, w: w, h: h };
    }

    // The cloth's REAL weave tile — the exact 96px texture the Cloth Room
    // dresses its garment in (drawClothTile reads cloth.weave + cloth.overlay).
    // Used as a repeating pattern so the drape, sheen and loupe show the actual
    // cloth, not a stand-in twill.
    function tileCanvasFor(cloth, size) {
        size = size || 96;
        var c = document.createElement("canvas"); c.width = size; c.height = size;
        var g = c.getContext("2d");
        // Rendering the weave at a larger size (scaled context) keeps it crisp
        // when the loupe magnifies it, rather than blowing up the 96px tile.
        if (size !== 96) g.scale(size / 96, size / 96);
        try { if (typeof drawClothTile !== "function") throw 0; drawClothTile(g, cloth); }
        catch (e) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = cloth.ground || "#555"; g.fillRect(0, 0, size, size); }
        return c;
    }

    // ---- The Atelier Lighting Rig ----
    // A room-wide setting (persisted on appState, not per-cloth) discovered
    // here but consumed by fabric-visualiser.js's photographed garment
    // canvas via garment-photo.js's applyLightingRig — see that file's
    // header comment for the compositing technique. "daylight" is the
    // untouched baseline render, so a session saved before this feature
    // existed (appState.visLighting undefined) degrades to it for free.
    var CSTUDY_LIGHTING_MODES = [
        { id: "daylight", label: "Daylight", caption: "Atelier Daylight" },
        { id: "warm", label: "Warm Spotlight", caption: "Warm Showroom Spotlight" },
        { id: "sunlight", label: "Direct Sun", caption: "Direct Sunlight" }
    ];

    function getCstudyLightingHTML() {
        var active = (typeof appState !== "undefined" && appState.visLighting) || "daylight";
        var html = '<div class="cstudy-lighting" role="group" aria-label="Lighting">';
        for (var i = 0; i < CSTUDY_LIGHTING_MODES.length; i++) {
            var m = CSTUDY_LIGHTING_MODES[i], on = m.id === active;
            html += '<button class="cstudy-light-btn btn-bare' + (on ? " sel" : "") +
                '" type="button" data-action="cstudy-lighting" data-mode="' + m.id +
                '" aria-pressed="' + (on ? "true" : "false") + '">' + m.label + "</button>";
        }
        html += "</div>" +
            '<p class="cstudy-lighting-cap" id="cstudy-lighting-cap">' +
            (CSTUDY_LIGHTING_MODES.filter(function (m) { return m.id === active; })[0] || CSTUDY_LIGHTING_MODES[0]).caption +
            "</p>";
        return html;
    }

    // Partial DOM update after a lighting button is tapped — same pattern as
    // visApplyFabric's swatch swap: touch only what changed, no full render().
    function updateCstudyLightingUI(mode) {
        var group = document.querySelector(".cstudy-lighting");
        if (group) {
            var btns = group.querySelectorAll(".cstudy-light-btn");
            for (var i = 0; i < btns.length; i++) {
                var on = btns[i].getAttribute("data-mode") === mode;
                btns[i].classList.toggle("sel", on);
                btns[i].setAttribute("aria-pressed", on ? "true" : "false");
            }
        }
        var cap = document.getElementById("cstudy-lighting-cap");
        if (cap) {
            var found = null;
            for (var j = 0; j < CSTUDY_LIGHTING_MODES.length; j++) {
                if (CSTUDY_LIGHTING_MODES[j].id === mode) { found = CSTUDY_LIGHTING_MODES[j]; break; }
            }
            cap.textContent = found ? found.caption : "";
        }
    }

    // ---- Markup ----
    function getClothStudyHTML(cloth) {
        if (!cloth) return "";
        var key = cloth.key, handle = handleOf(cloth);
        return (
            '<div class="cstudy" id="cstudy" data-cloth="' + key + '">' +
            '<div class="cstudy-eyebrow">Study the cloth</div>' +
            getCstudyLightingHTML() +
            '<div class="cstudy-grid">' +
            '<figure class="cstudy-cell">' +
            '<canvas class="cstudy-canvas" id="cstudy-drape" height="220" data-cloth="' + key + '"></canvas>' +
            '<figcaption>The drape<span>' + handle.label + '</span></figcaption>' +
            "</figure>" +
            '<figure class="cstudy-cell">' +
            '<canvas class="cstudy-canvas" id="cstudy-sheen" height="220" data-cloth="' + key + '"></canvas>' +
            '<button class="cstudy-loupe-btn btn-bare" id="cstudy-loupe-btn" type="button" aria-pressed="false">Loupe</button>' +
            '<figcaption>Tilt to the light<span id="cstudy-sheen-cap">Drag across &middot; Loupe to inspect</span></figcaption>' +
            "</figure>" +
            "</div>" +
            '<div class="cstudy-pair">' +
            '<div class="cstudy-pair-head">Sits well beside <em id="cstudy-pair-name">&nbsp;</em></div>' +
            '<canvas class="cstudy-canvas" id="cstudy-web" height="200" data-cloth="' + key + '"></canvas>' +
            "</div>" +
            "</div>"
        );
    }

    // ---- 1. The Drape ----
    // The panel is GATHERED on its bar: the cloth is wider than the bar it hangs
    // from (handle.gather), so the surplus has nowhere to go but out of the
    // plane, and folds form by buckling the way a real curtain does. That means
    // the points carry a z and the constraints are solved in 3D. Two things
    // follow from it that the old flat, side-to-side version could not do:
    // shading comes off the true surface normal, so a fold has a lit face and a
    // shaded face rather than reading as symmetric corrugation; and the weave is
    // drawn per column strip, compressed by how far that strip has turned away,
    // so a chalkstripe bends around the fold instead of lying on top of it.
    function startDrape(cv, cloth) {
        var handle = handleOf(cloth), base = hexRGB(cloth.ground || "#4a4d55");
        var lustre = lustreOf(cloth), tile = tileCanvasFor(cloth), pattern = null;
        // 10 rows, not 12: the cell size is capped by the canvas height, and a
        // gathered panel needs bigger cells to still fill the frame's width.
        var d, ctx, W, H, COLS = 20, ROWS = 10, pts, cons, spacing, step, ox, oy, cx, t = 0, drag = null, dragx = 0, dragy = 0;
        // Light from the upper left and in front (screen y runs down, +z is
        // toward the viewer). FOCAL gives a slight perspective so a fold that
        // turns away also narrows, not only darkens.
        var LX = -0.42, LY = -0.50, LZ = 0.76, FOCAL = 760;
        // Fold placement is seeded from the cloth key, not Math.random, so a
        // cloth hangs the same way every time you open it.
        function keyPhase(k) {
            var h = 0; k = String(k || "");
            for (var i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) % 10007;
            return (h / 10007) * Math.PI * 2;
        }
        function build() {
            d = fit(cv, 220); ctx = d.ctx; W = d.w; H = d.h; pattern = ctx.createPattern(tile, "repeat");
            spacing = Math.min((W * 0.80) / ((COLS - 1) * handle.gather), (H * 0.74) / (ROWS - 1));
            step = spacing * handle.gather;
            ox = (W - step * (COLS - 1)) / 2; oy = H * 0.14; cx = W / 2; pts = []; cons = [];
            var phase = keyPhase(cloth.key);
            for (var j = 0; j < ROWS; j++) for (var i = 0; i < COLS; i++) {
                var x = ox + i * step, y = oy + j * spacing;
                // Seed the buckle. Without an out-of-plane nudge the surplus
                // width has no reason to fold forward rather than flap sideways,
                // and sideways is exactly the flat look this replaced.
                var z = j === 0 ? 0 : Math.sin(i * handle.folds + phase) * spacing * 0.9 * Math.min(1, j / 2);
                pts.push({ x: x, y: y, z: z, px: x, py: y, pz: z, sx: x, sy: y, pin: j === 0 });
            }
            function link(a, b, len, k) { cons.push({ a: a, b: b, len: len, k: k || 1 }); }
            var diag = spacing * Math.SQRT2;
            for (var j2 = 0; j2 < ROWS; j2++) for (var i2 = 0; i2 < COLS; i2++) {
                var id = j2 * COLS + i2;
                // Horizontal rest length is the MATERIAL width, not the gathered
                // spacing the points were laid out at. That difference is the
                // whole mechanism — remove it and the panel hangs flat.
                if (i2 < COLS - 1) link(id, id + 1, spacing);
                if (j2 < ROWS - 1) link(id, id + COLS, spacing);
                // Diagonals give the mesh shear resistance. Without them the
                // surplus width simply splays the panel outwards — the cheapest
                // way out — and the buckle relaxes away within a second no
                // matter how deep it is seeded. Weak (k) because real cloth
                // shears easily; strong enough that folding is the cheaper path.
                if (i2 < COLS - 1 && j2 < ROWS - 1) {
                    link(id, id + COLS + 1, diag, 0.35);
                    link(id + 1, id + COLS, diag, 0.35);
                }
            }
        }
        function sim() {
            t += 0.016;
            for (var k = 0; k < pts.length; k++) {
                var p = pts[k]; if (p.pin) continue;
                var colI = k % COLS, br = (Math.sin(t * 0.9 + colI * 0.6) + 0.5 * Math.sin(t * 1.9 + colI * 0.27)) * handle.breeze;
                var vx = (p.x - p.px) * handle.damp, vy = (p.y - p.py) * handle.damp, vz = (p.z - p.pz) * handle.damp;
                p.px = p.x; p.py = p.y; p.pz = p.z;
                // The breeze pushes the panel toward and away from the viewer,
                // which deepens and slackens the folds; pushing it sideways only
                // slides the whole thing across the frame.
                p.x += vx; p.y += vy + handle.grav; p.z += vz + br;
            }
            for (var it = 0; it < handle.stiff; it++) for (var c = 0; c < cons.length; c++) {
                var a = pts[cons[c].a], b = pts[cons[c].b];
                var dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
                var dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
                var diff = (cons[c].len - dist) / dist * 0.5 * cons[c].k;
                var offx = dx * diff, offy = dy * diff, offz = dz * diff;
                if (!a.pin) { a.x -= offx; a.y -= offy; a.z -= offz; }
                if (!b.pin) { b.x += offx; b.y += offy; b.z += offz; }
            }
            if (drag != null) { var dp = pts[drag]; dp.x = dragx; dp.y = dragy; dp.px = dragx; dp.py = dragy; }
        }
        function project() {
            for (var k = 0; k < pts.length; k++) {
                var p = pts[k], s = FOCAL / (FOCAL - p.z);
                p.sx = cx + (p.x - cx) * s; p.sy = oy + (p.y - oy) * s;
            }
        }
        function normalAt(i, j) {
            var l = pts[j * COLS + (i > 0 ? i - 1 : 0)], r = pts[j * COLS + (i < COLS - 1 ? i + 1 : COLS - 1)];
            var u = pts[(j > 0 ? j - 1 : 0) * COLS + i], w = pts[(j < ROWS - 1 ? j + 1 : ROWS - 1) * COLS + i];
            var ax = r.x - l.x, ay = r.y - l.y, az = r.z - l.z;
            var bx = w.x - u.x, by = w.y - u.y, bz = w.z - u.z;
            var nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
            var len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            return [nx / len, ny / len, nz / len];
        }
        // Lambert diffuse plus a Blinn specular scaled by the cloth's own lustre,
        // so mohair throws a highlight along a fold and flannel does not. Cloth
        // facing straight at the viewer lands on lum 1.0, i.e. untouched weave.
        function colShade(i) {
            var a = normalAt(i, Math.round(ROWS * 0.3)), b = normalAt(i, Math.round(ROWS * 0.7));
            var nx = (a[0] + b[0]) / 2, ny = (a[1] + b[1]) / 2, nz = (a[2] + b[2]) / 2;
            var len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1; nx /= len; ny /= len; nz /= len;
            var dif = nx * LX + ny * LY + nz * LZ; if (dif < 0) dif = 0;
            var hl = Math.sqrt(LX * LX + LY * LY + (LZ + 1) * (LZ + 1));
            var sp = (nx * LX + ny * LY + nz * (LZ + 1)) / hl; if (sp < 0) sp = 0;
            // 0.40 + 0.79 * dif is chosen so cloth square to the viewer lands on
            // exactly 1.0 (untouched weave) and a face turned away bottoms out
            // near 0.40. A narrower range read as flat on plain cloths, where
            // there is no stripe to show the fold for you.
            return { lum: 0.40 + 0.79 * dif, spec: Math.min(0.34, Math.pow(sp, 26) * lustre * 1.6) };
        }
        function colX(i) { var s = 0; for (var j = 0; j < ROWS; j++) s += pts[j * COLS + i].sx; return s / ROWS; }
        function colZ(i) { var s = 0; for (var j = 0; j < ROWS; j++) s += pts[j * COLS + i].z + pts[j * COLS + i + 1].z; return s / (ROWS * 2); }
        // The silhouette, drawn as a curve rather than as the mesh polygon. The
        // hem is 20 straight segments between column points, and a fold that
        // hangs lower than its neighbour turns that into a visible sawtooth —
        // the panel looks torn along the bottom. Curving through the same
        // points costs nothing and the hem swags instead.
        function outline() {
            var i, j, p;
            ctx.beginPath();
            for (i = 0; i < COLS; i++) { p = pts[i]; if (i === 0) ctx.moveTo(p.sx, p.sy); else ctx.lineTo(p.sx, p.sy); }
            for (j = 1; j < ROWS; j++) { p = pts[j * COLS + COLS - 1]; ctx.lineTo(p.sx, p.sy); }
            // The hem only. Curving through the bottom points instead of
            // joining them with 19 straight segments is what stops a fold
            // hanging lower than its neighbour reading as a sawtooth — the
            // panel looked torn along the bottom. The corners and the two
            // selvedges stay straight: curving those rounded the whole
            // silhouette into a pillow.
            var hem = (ROWS - 1) * COLS;
            for (i = COLS - 2; i >= 1; i--) {
                var c = pts[hem + i], nx = pts[hem + i - 1];
                ctx.quadraticCurveTo(c.sx, c.sy, (c.sx + nx.sx) / 2, (c.sy + nx.sy) / 2);
            }
            p = pts[hem]; ctx.lineTo(p.sx, p.sy);
            for (j = ROWS - 2; j >= 1; j--) { p = pts[j * COLS]; ctx.lineTo(p.sx, p.sy); }
            ctx.closePath();
        }
        function draw() {
            ctx.clearRect(0, 0, W, H);
            project();
            var i, j, p, topY = pts[0].sy, botY = topY;
            for (i = 0; i < COLS; i++) botY = Math.max(botY, pts[(ROWS - 1) * COLS + i].sy);
            // 1. The real weave, mapped onto the mesh a quad at a time. Ground
            //    colour goes down first so the antialiased quad edges composite
            //    against cloth rather than against nothing, which would leave
            //    hairline seams along every cell.
            var solid = "rgb(" + base[0] + "," + base[1] + "," + base[2] + ")";
            outline(); ctx.fillStyle = solid; ctx.fill();
            // Quads are straight-edged, so without this they poke past the
            // curved hem and put the sawtooth straight back.
            ctx.save(); outline(); ctx.clip();
            // Back to front. A fold nearer the viewer projects wider and hangs
            // lower, so it overlaps its neighbours; drawn left to right the
            // farther column paints over it and the hem gains a hard step.
            var order = [];
            for (i = 0; i < COLS - 1; i++) order.push(i);
            order.sort(function (a, b) { return colZ(a) - colZ(b); });
            for (var ci = 0; ci < order.length; ci++) for (j = 0, i = order[ci]; j < ROWS - 1; j++) {
                var tl = pts[j * COLS + i], tr = pts[j * COLS + i + 1];
                var bl = pts[(j + 1) * COLS + i], br = pts[(j + 1) * COLS + i + 1];
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(tl.sx, tl.sy); ctx.lineTo(tr.sx, tr.sy); ctx.lineTo(br.sx, br.sy); ctx.lineTo(bl.sx, bl.sy);
                ctx.closePath(); ctx.clip();
                // Affine mapping the cell's material square onto TL, TR, BL. A
                // canvas transform cannot bend into the trapezoid the fourth
                // corner implies, so this runs per quad rather than per column:
                // across one cell the error is sub-pixel, but across a whole
                // column it stretched the weave into pale wedges at the edges.
                // The material origin (i, j) * spacing is kept, so the pattern
                // carries across cell seams instead of restarting in each one.
                ctx.transform((tr.sx - tl.sx) / spacing, (tr.sy - tl.sy) / spacing,
                    (bl.sx - tl.sx) / spacing, (bl.sy - tl.sy) / spacing, tl.sx, tl.sy);
                ctx.translate(-i * spacing, -j * spacing);
                ctx.fillStyle = pattern || solid;
                ctx.fillRect(i * spacing - 2, j * spacing - 2, spacing + 4, spacing + 4);
                ctx.restore();
            }
            ctx.restore();
            // 2. Fold shading, multiplied over the weave so folds read as shadow
            //    without hiding the texture (grey <= 1 only darkens).
            var minx = colX(0), maxx = colX(COLS - 1); if (maxx <= minx) maxx = minx + 1;
            var g = ctx.createLinearGradient(minx, 0, maxx, 0);
            var sg = ctx.createLinearGradient(minx, 0, maxx, 0), last = -1, shades = [];
            for (i = 0; i < COLS; i++) {
                var sh = colShade(i); shades.push(sh);
                var tt = Math.max(0, Math.min(1, (colX(i) - minx) / (maxx - minx)));
                if (tt <= last) tt = last + 0.0001; last = tt; tt = Math.min(1, tt);
                var vv = clampByte(Math.min(1, sh.lum) * 255);
                g.addColorStop(tt, "rgb(" + vv + "," + vv + "," + vv + ")");
                sg.addColorStop(tt, "rgba(255,251,242," + sh.spec.toFixed(3) + ")");
            }
            outline();
            ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = g; ctx.fill();
            // 3. The specular ribbon, and a gentle top-light / bottom-shadow
            //    form, both confined to the cloth already drawn.
            ctx.globalCompositeOperation = "source-atop";
            ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
            var vg = ctx.createLinearGradient(0, topY, 0, botY);
            vg.addColorStop(0, "rgba(255,252,244,0.05)"); vg.addColorStop(1, "rgba(18,14,9,0.17)");
            ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
            ctx.globalCompositeOperation = "source-over";
            // The rod spans the cloth's widest point, not the pinned row: a
            // gathered panel splays wider than the heading, and a rod that
            // stopped at the pins would read as cloth hung off the end of it.
            var bx = pts[0].sx, bxr = bx;
            for (i = 0; i < pts.length; i++) { if (pts[i].sx < bx) bx = pts[i].sx; if (pts[i].sx > bxr) bxr = pts[i].sx; }
            var by = pts[0].sy;
            ctx.fillStyle = "#2a251e"; ctx.fillRect(bx - 8, by - 9, (bxr - bx) + 16, 11);
            ctx.fillStyle = "rgba(255,255,255,0.10)"; ctx.fillRect(bx - 8, by - 9, (bxr - bx) + 16, 2);
        }
        function loop() { sim(); draw(); _raf.drape = requestAnimationFrame(loop); }
        function grab(e) {
            var r = cv.getBoundingClientRect(), gx = e.clientX - r.left, gy = e.clientY - r.top, best = -1, bd = 42 * 42;
            // Hit-test against the PROJECTED position — that is where the finger
            // sees the cloth, and a fold near the viewer sits off its own x.
            for (var k = 0; k < pts.length; k++) { if (pts[k].pin) continue; var dd = (pts[k].sx - gx) * (pts[k].sx - gx) + (pts[k].sy - gy) * (pts[k].sy - gy); if (dd < bd) { bd = dd; best = k; } }
            if (best >= 0) { drag = best; dragx = gx; dragy = gy; }
        }
        cv.addEventListener("pointerdown", function (e) { grab(e); try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
        cv.addEventListener("pointermove", function (e) { if (drag == null) return; var r = cv.getBoundingClientRect(); dragx = e.clientX - r.left; dragy = e.clientY - r.top; });
        cv.addEventListener("pointerup", function () { drag = null; });
        cv.addEventListener("pointercancel", function () { drag = null; });
        build();
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // A gathered panel needs longer than a flat one to buckle and settle, so
        // the still frame is taken well after the folds have formed.
        if (reduce) { for (var s = 0; s < 260; s++) sim(); draw(); } else loop();
    }

    // ---- 2. The Sheen swatch, with a loupe toggle ----
    function startSheen(cv, cloth, btn, cap) {
        var lus = lustreOf(cloth), tile = tileCanvasFor(cloth), Z = 3.4;
        // Feeding the loupe from the same 96px tile, blown up by canvas
        // scale, blurs fine detail (pinstripe, herringbone, glen) since
        // there's no more real pixel data past 96px. tileCanvasFor(cloth,
        // size) redraws the weave fresh at any size, so the loupe instead
        // draws from a genuinely higher-resolution tile and only needs the
        // remaining Z/LOUPE_OVERSAMPLE of magnification on top of that.
        var LOUPE_OVERSAMPLE = 4;
        var d, ctx, W, H, pattern, hqPattern, lightx = 0.5, loupe = false, mx = 0, my = 0, LR = 52;
        function size() { d = fit(cv, 220); ctx = d.ctx; W = d.w; H = d.h; mx = W / 2; my = H / 2; pattern = ctx.createPattern(tile, "repeat"); }
        size();
        function fillWeave() { ctx.fillStyle = pattern || (cloth.ground || "#555"); ctx.fillRect(0, 0, W, H); }
        function drawSheen() {
            fillWeave();
            ctx.globalCompositeOperation = "screen";
            if (lus > 0.2) { var v = ctx.createLinearGradient(0, 0, 0, H); v.addColorStop(0, "rgba(255,248,230,0.1)"); v.addColorStop(0.6, "rgba(255,248,230,0.01)"); v.addColorStop(1, "rgba(255,248,230,0.06)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); }
            var lx = lightx * W, g = ctx.createLinearGradient(lx - W * 0.55, 0, lx + W * 0.55, 0);
            g.addColorStop(0, "rgba(255,248,230,0)"); g.addColorStop(0.5, "rgba(255,248,230," + lus + ")"); g.addColorStop(1, "rgba(255,248,230,0)");
            ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = "source-over";
        }
        function drawLoupe() {
            fillWeave();
            ctx.save(); ctx.beginPath(); ctx.arc(mx, my, LR, 0, 7); ctx.clip();
            // a smooth optical magnification of the real weave — moving the
            // loupe reveals different parts of the actual cloth
            ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
            if (!hqPattern) hqPattern = ctx.createPattern(tileCanvasFor(cloth, 96 * LOUPE_OVERSAMPLE), "repeat");
            var loupeZ = Z / LOUPE_OVERSAMPLE;
            ctx.translate(mx, my); ctx.scale(loupeZ, loupeZ); ctx.translate(-mx, -my);
            ctx.fillStyle = hqPattern; ctx.fillRect(0, 0, W, H);
            ctx.restore();
            ctx.beginPath(); ctx.arc(mx, my, LR, 0, 7); ctx.lineWidth = 3.5; ctx.strokeStyle = "rgba(154,122,62,0.95)"; ctx.stroke();
            ctx.beginPath(); ctx.arc(mx, my, LR - 2, 0, 7); ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.stroke();
            var hl = ctx.createRadialGradient(mx - LR * 0.4, my - LR * 0.4, 2, mx, my, LR); hl.addColorStop(0, "rgba(255,255,255,0.13)"); hl.addColorStop(0.55, "rgba(255,255,255,0)"); ctx.fillStyle = hl; ctx.beginPath(); ctx.arc(mx, my, LR, 0, 7); ctx.fill();
        }
        function draw() { ctx.clearRect(0, 0, W, H); if (loupe) drawLoupe(); else drawSheen(); }
        draw();
        cv.addEventListener("pointermove", function (e) {
            var r = cv.getBoundingClientRect();
            if (loupe) { mx = Math.max(LR, Math.min(W - LR, e.clientX - r.left)); my = Math.max(LR, Math.min(H - LR, e.clientY - r.top)); }
            else lightx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
            draw();
        });
        cv.addEventListener("pointerdown", function (e) { var r = cv.getBoundingClientRect(); if (loupe) { mx = Math.max(LR, Math.min(W - LR, e.clientX - r.left)); my = Math.max(LR, Math.min(H - LR, e.clientY - r.top)); } else lightx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); draw(); });
        if (btn) btn.addEventListener("click", function () { loupe = !loupe; btn.setAttribute("aria-pressed", loupe ? "true" : "false"); if (cap) cap.textContent = loupe ? "Move to inspect the weave" : "Drag across · Loupe to inspect"; draw(); });
    }

    // ---- 3. The Pairing Web ----
    var PAIR_FAMILIES = {
        navy: ["grey", "charcoal", "tan", "cream", "brown"], charcoal: ["navy", "blue", "burgundy", "cream", "tan"],
        grey: ["navy", "blue", "brown", "burgundy", "green"], black: ["grey", "charcoal", "cream"],
        brown: ["cream", "blue", "tan", "green", "grey"], tan: ["navy", "brown", "green", "blue"],
        cream: ["navy", "brown", "charcoal", "green", "tan"], green: ["tan", "brown", "cream", "grey"],
        blue: ["grey", "brown", "tan", "charcoal"], burgundy: ["grey", "charcoal", "navy"], white: ["navy", "charcoal", "grey"]
    };
    function pairsFor(cloth) {
        if (typeof FABRIC_LIBRARY === "undefined") return [];
        var fams = PAIR_FAMILIES[cloth.colour_family] || ["navy", "grey", "brown"], out = [], seen = {};
        for (var f = 0; f < fams.length && out.length < 5; f++) {
            for (var i = 0; i < FABRIC_LIBRARY.length; i++) {
                var c = FABRIC_LIBRARY[i];
                if (c.key === cloth.key || seen[c.colour_family] || c.colour_family !== fams[f]) continue;
                out.push(c); seen[c.colour_family] = 1; break;
            }
        }
        return out;
    }
    function startWeb(cv, cloth, nameEl) {
        var d = fit(cv, 200), ctx = d.ctx, W = d.w, H = d.h;
        var pairs = pairsFor(cloth), anim = 0, raf = 0;
        function layout() { d = fit(cv, 200); ctx = d.ctx; W = d.w; H = d.h; var cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.34; for (var i = 0; i < pairs.length; i++) { var a = -Math.PI / 2 + (pairs.length === 1 ? 0.6 : i / Math.max(1, pairs.length - 1) - 0.5) * 2.2; pairs[i]._x = cx + Math.cos(a) * R; pairs[i]._y = cy + Math.sin(Math.abs(a) * 0.9) * R * 0.62 + R * 0.15; } window.__cwCx = cx; window.__cwCy = cy; }
        function draw() {
            ctx.clearRect(0, 0, W, H);
            var cx = window.__cwCx, cy = window.__cwCy;
            for (var k = 0; k < pairs.length; k++) { var o = pairs[k], mx = cx + (o._x - cx) * anim, my = cy + (o._y - cy) * anim; ctx.strokeStyle = "rgba(154,122,62," + (0.25 + 0.35 * anim) + ")"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(mx, my); ctx.stroke(); }
            for (var i = 0; i < pairs.length; i++) { var p = pairs[i], mx2 = cx + (p._x - cx) * anim, my2 = cy + (p._y - cy) * anim; ctx.globalAlpha = 0.35 + 0.65 * anim; ctx.beginPath(); ctx.arc(mx2, my2, 16, 0, 7); ctx.fillStyle = p.ground || "#888"; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = "rgba(154,122,62,0.55)"; ctx.stroke(); ctx.globalAlpha = 1; }
            ctx.beginPath(); ctx.arc(cx, cy, 24, 0, 7); ctx.fillStyle = cloth.ground || "#555"; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = "#715825"; ctx.stroke();
            if (nameEl) nameEl.textContent = pairs.length ? pairs[0].name : cloth.name;
        }
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        layout();
        function run() { anim = reduce ? 1 : 0; cancelAnimationFrame(raf); (function step() { anim = Math.min(1, anim + 0.08); draw(); if (anim < 1 && !reduce) raf = requestAnimationFrame(step); })(); }
        run();
        cv.addEventListener("pointerdown", function (e) {
            var r = cv.getBoundingClientRect(), gx = e.clientX - r.left, gy = e.clientY - r.top;
            for (var i = 0; i < pairs.length; i++) { if (Math.hypot(pairs[i]._x - gx, pairs[i]._y - gy) < 18) { appState.visFabricKey = pairs[i].key; if (typeof render === "function") render(); break; } }
        });
    }

    // ---- Wire-up from the render hook ----
    function initClothStudy() {
        var root = document.getElementById("cstudy");
        // Left the Cloth Room (or this render has no study): stop the drape loop
        // so it does not keep animating a detached canvas.
        if (!root) { cancelAnimationFrame(_raf.drape); return; }
        if (root.getAttribute("data-wired") === "1") return;
        root.setAttribute("data-wired", "1");
        if (typeof getFabricByKey !== "function") return;
        var cloth = getFabricByKey(root.getAttribute("data-cloth")); if (!cloth) return;
        cancelAnimationFrame(_raf.drape);
        var dc = document.getElementById("cstudy-drape"); if (dc) startDrape(dc, cloth);
        var sc = document.getElementById("cstudy-sheen"); if (sc) startSheen(sc, cloth, document.getElementById("cstudy-loupe-btn"), document.getElementById("cstudy-sheen-cap"));
        var wc = document.getElementById("cstudy-web"); if (wc) startWeb(wc, cloth, document.getElementById("cstudy-pair-name"));
    }

    window.getClothStudyHTML = getClothStudyHTML;
    window.initClothStudy = initClothStudy;
    window.updateCstudyLightingUI = updateCstudyLightingUI;
})();
