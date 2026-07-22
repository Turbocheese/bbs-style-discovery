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
    function handleOf(cloth) {
        var weave = (cloth.weave || ""), wt = (cloth.weight_class || "");
        if (weave === "flannel") return { stiff: 2, grav: 0.23, damp: 0.96, breeze: 0.07, label: "Soft, full drape" };
        if (wt === "heavy") return { stiff: 4, grav: 0.14, damp: 0.92, breeze: 0.024, label: "Crisp, structured" };
        if (wt === "light") return { stiff: 2, grav: 0.2, damp: 0.95, breeze: 0.06, label: "Light, fluid drape" };
        return { stiff: 3, grav: 0.18, damp: 0.94, breeze: 0.04, label: "Balanced drape" };
    }

    function fit(cv, h) {
        var dpr = Math.min(2, window.devicePixelRatio || 1);
        var w = cv.clientWidth || cv.parentNode.clientWidth || 320;
        cv.width = Math.max(1, Math.round(w * dpr)); cv.height = Math.max(1, Math.round(h * dpr));
        var ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx: ctx, w: w, h: h };
    }

    // ---- Markup ----
    function getClothStudyHTML(cloth) {
        if (!cloth) return "";
        var key = cloth.key, handle = handleOf(cloth);
        return (
            '<div class="cstudy" id="cstudy" data-cloth="' + key + '">' +
            '<div class="cstudy-eyebrow">Study the cloth</div>' +
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
    function startDrape(cv, cloth) {
        var handle = handleOf(cloth), base = hexRGB(cloth.ground || "#4a4d55");
        var d, ctx, W, H, COLS = 20, ROWS = 12, pts, cons, spacing, ox, oy, t = 0, drag = null, dragx = 0, dragy = 0;
        function build() {
            d = fit(cv, 220); ctx = d.ctx; W = d.w; H = d.h;
            spacing = Math.min((W * 0.74) / (COLS - 1), (H * 0.72) / (ROWS - 1));
            ox = (W - spacing * (COLS - 1)) / 2; oy = H * 0.13; pts = []; cons = [];
            for (var j = 0; j < ROWS; j++) for (var i = 0; i < COLS; i++) {
                var x = ox + i * spacing, y = oy + j * spacing;
                pts.push({ x: x, y: y, px: x, py: y, pin: j === 0 });
            }
            function link(a, b) { cons.push({ a: a, b: b, len: Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y) }); }
            for (var j2 = 0; j2 < ROWS; j2++) for (var i2 = 0; i2 < COLS; i2++) {
                var id = j2 * COLS + i2;
                if (i2 < COLS - 1) link(id, id + 1);
                if (j2 < ROWS - 1) link(id, id + COLS);
            }
        }
        function sim() {
            t += 0.016;
            for (var k = 0; k < pts.length; k++) {
                var p = pts[k]; if (p.pin) continue;
                var colI = k % COLS, br = (Math.sin(t * 0.9 + colI * 0.6) + 0.5 * Math.sin(t * 1.9 + colI * 0.27)) * handle.breeze;
                var vx = (p.x - p.px) * handle.damp, vy = (p.y - p.py) * handle.damp;
                p.px = p.x; p.py = p.y; p.x += vx + br; p.y += vy + handle.grav;
            }
            for (var it = 0; it < handle.stiff; it++) for (var c = 0; c < cons.length; c++) {
                var a = pts[cons[c].a], b = pts[cons[c].b], dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy) || 0.001;
                var diff = (cons[c].len - dist) / dist * 0.5, offx = dx * diff, offy = dy * diff;
                if (!a.pin) { a.x -= offx; a.y -= offy; } if (!b.pin) { b.x += offx; b.y += offy; }
            }
            if (drag != null) { var dp = pts[drag]; dp.x = dragx; dp.y = dragy; dp.px = dragx; dp.py = dragy; }
        }
        function col(l) { return "rgb(" + clampByte(base[0] * l) + "," + clampByte(base[1] * l) + "," + clampByte(base[2] * l) + ")"; }
        function colLum(i) {
            var s = 0, cnt = 0;
            for (var j = 0; j < ROWS; j++) { var idx = j * COLS + i; if (i > 0) { s += Math.abs(pts[idx].x - pts[idx - 1].x); cnt++; } if (i < COLS - 1) { s += Math.abs(pts[idx + 1].x - pts[idx].x); cnt++; } }
            var ratio = (s / cnt) / spacing; return Math.max(0.46, Math.min(1.16, 0.56 + ratio * 0.5));
        }
        function colX(i) { var s = 0; for (var j = 0; j < ROWS; j++) s += pts[j * COLS + i].x; return s / ROWS; }
        function draw() {
            ctx.clearRect(0, 0, W, H);
            var topY = pts[0].y, botY = topY, i, j;
            for (var m = 0; m < COLS; m++) botY = Math.max(botY, pts[(ROWS - 1) * COLS + m].y);
            ctx.beginPath();
            for (i = 0; i < COLS; i++) { var p = pts[i]; if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }
            for (j = 1; j < ROWS; j++) { var pr = pts[j * COLS + COLS - 1]; ctx.lineTo(pr.x, pr.y); }
            for (i = COLS - 2; i >= 0; i--) { var pb = pts[(ROWS - 1) * COLS + i]; ctx.lineTo(pb.x, pb.y); }
            for (j = ROWS - 2; j >= 1; j--) { var pl = pts[j * COLS]; ctx.lineTo(pl.x, pl.y); }
            ctx.closePath();
            var minx = colX(0), maxx = colX(COLS - 1); if (maxx <= minx) maxx = minx + 1;
            var g = ctx.createLinearGradient(minx, 0, maxx, 0), last = -1;
            for (i = 0; i < COLS; i++) { var tt = Math.max(0, Math.min(1, (colX(i) - minx) / (maxx - minx))); if (tt <= last) tt = last + 0.0001; last = tt; g.addColorStop(Math.min(1, tt), col(colLum(i))); }
            ctx.fillStyle = g; ctx.fill();
            ctx.globalCompositeOperation = "source-atop";
            var vg = ctx.createLinearGradient(0, topY, 0, botY);
            vg.addColorStop(0, "rgba(255,252,244,0.06)"); vg.addColorStop(1, "rgba(18,14,9,0.13)");
            ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
            ctx.globalCompositeOperation = "source-over";
            var bx = pts[0].x, bw = pts[COLS - 1].x - pts[0].x, by = pts[0].y;
            ctx.fillStyle = "#2a251e"; ctx.fillRect(bx - 6, by - 9, bw + 12, 11);
            ctx.fillStyle = "rgba(255,255,255,0.10)"; ctx.fillRect(bx - 6, by - 9, bw + 12, 2);
        }
        function loop() { sim(); draw(); _raf.drape = requestAnimationFrame(loop); }
        function grab(e) {
            var r = cv.getBoundingClientRect(), gx = e.clientX - r.left, gy = e.clientY - r.top, best = -1, bd = 42 * 42;
            for (var k = 0; k < pts.length; k++) { if (pts[k].pin) continue; var dd = (pts[k].x - gx) * (pts[k].x - gx) + (pts[k].y - gy) * (pts[k].y - gy); if (dd < bd) { bd = dd; best = k; } }
            if (best >= 0) { drag = best; dragx = gx; dragy = gy; }
        }
        cv.addEventListener("pointerdown", function (e) { grab(e); try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
        cv.addEventListener("pointermove", function (e) { if (drag == null) return; var r = cv.getBoundingClientRect(); dragx = e.clientX - r.left; dragy = e.clientY - r.top; });
        cv.addEventListener("pointerup", function () { drag = null; });
        cv.addEventListener("pointercancel", function () { drag = null; });
        build();
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) { for (var s = 0; s < 140; s++) sim(); draw(); } else loop();
    }

    // ---- 2. The Sheen swatch, with a loupe toggle ----
    function startSheen(cv, cloth, btn, cap) {
        var base = hexRGB(cloth.ground || "#4a4d55"), lus = lustreOf(cloth), warp = shift(base, 34), weft = shift(base, -30);
        var d, ctx, W, H, lightx = 0.5, loupe = false, mx = 0, my = 0, LR = 52, Z = 4.2;
        function size() { d = fit(cv, 220); ctx = d.ctx; W = d.w; H = d.h; mx = W / 2; my = H / 2; }
        size();
        function weaveTile(g, pitch) {
            var cols = Math.ceil(W / pitch) + 2, rows = Math.ceil(H / pitch) + 2, i, j;
            g.fillStyle = shift(base, -22); g.fillRect(0, 0, W, H);
            for (i = 0; i < cols; i++) { var x = i * pitch, gr = g.createLinearGradient(x, 0, x + pitch, 0); gr.addColorStop(0, shift(base, -14)); gr.addColorStop(0.42, warp); gr.addColorStop(0.5, shift(base, 58)); gr.addColorStop(0.58, warp); gr.addColorStop(1, shift(base, -14)); g.fillStyle = gr; g.fillRect(x + 0.35, 0, pitch - 0.7, H); }
            for (j = 0; j < rows; j++) { var y = j * pitch; for (i = 0; i < cols; i++) { if (((i + j) % 4) >= 2) continue; var x2 = i * pitch, wg = g.createLinearGradient(0, y, 0, y + pitch); wg.addColorStop(0, shift(weft, -16)); wg.addColorStop(0.42, weft); wg.addColorStop(0.5, shift(weft, 40)); wg.addColorStop(0.58, weft); wg.addColorStop(1, shift(weft, -16)); g.fillStyle = wg; g.fillRect(x2 + 0.35, y + 0.35, pitch - 0.7, pitch - 0.7); } }
        }
        function drawSheen() {
            weaveTile(ctx, 5);
            ctx.globalCompositeOperation = "screen";
            if (lus > 0.2) { var v = ctx.createLinearGradient(0, 0, 0, H); v.addColorStop(0, "rgba(255,248,230,0.1)"); v.addColorStop(0.6, "rgba(255,248,230,0.01)"); v.addColorStop(1, "rgba(255,248,230,0.06)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); }
            var lx = lightx * W, g = ctx.createLinearGradient(lx - W * 0.55, 0, lx + W * 0.55, 0);
            g.addColorStop(0, "rgba(255,248,230,0)"); g.addColorStop(0.5, "rgba(255,248,230," + lus + ")"); g.addColorStop(1, "rgba(255,248,230,0)");
            ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = "source-over";
        }
        function drawLoupe() {
            weaveTile(ctx, 6);
            ctx.save(); ctx.beginPath(); ctx.arc(mx, my, LR, 0, 7); ctx.clip();
            ctx.translate(mx, my); ctx.scale(Z, Z); ctx.translate(-mx, -my); weaveTile(ctx, 6); ctx.restore();
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
            if (nameEl) nameEl.textContent = cloth.name;
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
})();
