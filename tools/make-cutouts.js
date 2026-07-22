// Cuts the flat cream field out of the archetype illustrations,
// leaving each figure on transparency (WebP with alpha, ~40KB each
// vs ~336KB as PNG).
//
// Usage: node tools/make-cutouts.js [keys] [width]   e.g. "v,k" 620
// Requires the app served at localhost:3000 (it uses a canvas in the
// browser to read pixels). Re-run if the source illustrations change.
// Flood-fills inward from the border rather than removing every
// cream-ish pixel, so cream garments (a linen suit on a cream ground)
// keep their fill — only background connected to the edge is cleared.
// Edge pixels get partial alpha so the cutout is not jagged.
const { chromium } = require("playwright");
const fs = require("fs");

const KEYS = "v,o,c,m,g,q,a,u,t,s,r,e,b,h,l,x,p,k,w,f,n,d,y,z".split(",");
const OUT = "C:/Users/ryanm/source/repos/bbs-style-discovery/images/archetypes/cutout/";

const EXTRACT = async ({ key, width }) => {
    const img = new Image();
    img.src = "images/archetypes/" + key + ".jpeg?x=" + Date.now();
    await img.decode();

    const W = width;
    const H = Math.round(W * img.naturalHeight / img.naturalWidth);
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.imageSmoothingQuality = "high";
    g.drawImage(img, 0, 0, W, H);

    const id = g.getImageData(0, 0, W, H);
    const d = id.data;

    // Background colour: median of the four corners
    const cornerIdx = [
        0,
        (W - 1) * 4,
        (H - 1) * W * 4,
        ((H - 1) * W + (W - 1)) * 4,
    ];
    const bg = [0, 1, 2].map(ch =>
        Math.round(cornerIdx.reduce((s, i) => s + d[i + ch], 0) / cornerIdx.length)
    );

    const NEAR = 46;   // fully background below this distance
    const FAR = 88;    // fully figure above this; between = partial alpha

    function dist(i) {
        const dr = d[i] - bg[0], dg = d[i + 1] - bg[1], db = d[i + 2] - bg[2];
        return Math.sqrt(dr * dr + dg * dg + db * db);
    }

    // Flood fill from every border pixel
    const seen = new Uint8Array(W * H);
    const stack = [];
    for (let x = 0; x < W; x++) { stack.push(x); stack.push((H - 1) * W + x); }
    for (let y = 0; y < H; y++) { stack.push(y * W); stack.push(y * W + W - 1); }

    while (stack.length) {
        const p = stack.pop();
        if (seen[p]) continue;
        const i = p * 4;
        const dd = dist(i);
        if (dd >= FAR) continue;          // hit the figure
        seen[p] = 1;
        // partial alpha in the transition band keeps the edge smooth
        d[i + 3] = dd <= NEAR ? 0 : Math.round(255 * (dd - NEAR) / (FAR - NEAR));
        const x = p % W, y = (p / W) | 0;
        if (x > 0) stack.push(p - 1);
        if (x < W - 1) stack.push(p + 1);
        if (y > 0) stack.push(p - W);
        if (y < H - 1) stack.push(p + W);
    }

    // Second pass: background pockets enclosed by the figure (between
    // the legs, under an arm) are unreachable from the border. Clear
    // connected regions that match the background closely AND are
    // small — a cream garment fill is both larger and further from the
    // background colour, so it survives.
    const MAX_POCKET = W * H * 0.06;
    const TIGHT = 34;
    const visited = new Uint8Array(W * H);
    for (let p0 = 0; p0 < W * H; p0++) {
        if (visited[p0] || seen[p0]) continue;
        if (d[p0 * 4 + 3] === 0) continue;
        if (dist(p0 * 4) > TIGHT) { visited[p0] = 1; continue; }
        // collect this connected region
        const region = [];
        const st = [p0];
        visited[p0] = 1;
        let touchesEdge = false;
        while (st.length) {
            const p = st.pop();
            region.push(p);
            const x = p % W, y = (p / W) | 0;
            if (x === 0 || y === 0 || x === W - 1 || y === H - 1) touchesEdge = true;
            const nb = [];
            if (x > 0) nb.push(p - 1);
            if (x < W - 1) nb.push(p + 1);
            if (y > 0) nb.push(p - W);
            if (y < H - 1) nb.push(p + W);
            for (const n of nb) {
                if (visited[n] || seen[n]) continue;
                if (dist(n * 4) > TIGHT) continue;
                visited[n] = 1;
                st.push(n);
            }
        }
        // MIN guards against speckling: isolated pixels inside a cream
        // garment that happen to match the background must not be punched out.
        if (!touchesEdge && region.length >= 60 && region.length < MAX_POCKET) {
            for (const p of region) d[p * 4 + 3] = 0;
        }
    }

    // Restore garment pixels the cut punched out. Cream and linen garments are
    // the exact colour of the ground (measured 5-28 units apart), so the flood
    // and its transition band eat transparent holes into them — the reported
    // "missing pixels" in the trousers and light shirts. Any not-fully-opaque
    // pixel that CANNOT be reached from the image border through other
    // not-fully-opaque pixels is an interior hole enclosed by the figure, not
    // real background, so restore it to opaque. The true ground and the gaps
    // between the legs survive because they connect out to the border.
    const SOLID = 210;
    const breached = new Uint8Array(W * H);
    const bst = [];
    function seed(p) { if (!breached[p] && d[p * 4 + 3] < SOLID) { breached[p] = 1; bst.push(p); } }
    for (let x = 0; x < W; x++) { seed(x); seed((H - 1) * W + x); }
    for (let y = 0; y < H; y++) { seed(y * W); seed(y * W + W - 1); }
    while (bst.length) {
        const p = bst.pop();
        const x = p % W, y = (p / W) | 0;
        if (x > 0) seed(p - 1);
        if (x < W - 1) seed(p + 1);
        if (y > 0) seed(p - W);
        if (y < H - 1) seed(p + W);
    }
    for (let p = 0; p < W * H; p++) {
        if (d[p * 4 + 3] < 255 && !breached[p]) d[p * 4 + 3] = 255;
    }

    g.putImageData(id, 0, 0);

    // Trim to the figure's bounding box so the art isn't swimming in
    // empty space, then pad slightly
    let minX = W, minY = H, maxX = 0, maxY = 0;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            if (d[(y * W + x) * 4 + 3] > 12) {
                if (x < minX) minX = x; if (x > maxX) maxX = x;
                if (y < minY) minY = y; if (y > maxY) maxY = y;
            }
        }
    }
    const pad = Math.round(W * 0.02);
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
    maxX = Math.min(W - 1, maxX + pad); maxY = Math.min(H - 1, maxY + pad);

    const t = document.createElement("canvas");
    t.width = maxX - minX + 1;
    t.height = maxY - minY + 1;
    t.getContext("2d").drawImage(c, minX, minY, t.width, t.height, 0, 0, t.width, t.height);

    return { url: t.toDataURL("image/webp", 0.9), w: t.width, h: t.height, bg: bg };
};

(async () => {
    const only = process.argv[2] ? process.argv[2].split(",") : KEYS;
    const width = parseInt(process.argv[3] || "620", 10);
    if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

    let total = 0;
    for (const k of only) {
        const r = await page.evaluate(EXTRACT, { key: k, width }).catch(e => ({ err: e.message }));
        if (r.err) { console.log(k, "FAILED", r.err); continue; }
        const buf = Buffer.from(r.url.split(",")[1], "base64");
        fs.writeFileSync(OUT + k + ".webp", buf);
        total += buf.length;
        console.log(k, r.w + "x" + r.h, Math.round(buf.length / 1024) + "KB", "bg rgb(" + r.bg.join(",") + ")");
    }
    console.log("total", Math.round(total / 1024) + "KB for", only.length, "images");
    await browser.close();
})();
