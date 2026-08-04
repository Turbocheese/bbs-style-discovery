# Wow-Factor Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three small, independently-scoped visual refinements — a hover
shimmer on the Mill Map's "Take the Tour" button, a subtle paper-grain
texture on two result-reveal card surfaces, and a warmer bronze retint of
the welcome screen's ambient shader — each reusing an established pattern
already proven elsewhere in this codebase rather than introducing new
visual vocabulary.

**Architecture:** Two CSS-only additions (`styles.css`) plus one small
numeric change to an existing WebGL fragment shader string
(`attract-shader.js`), plus the cache-busting files every `styles.css` /
versioned-JS change requires per CLAUDE.md. No markup or JS logic changes
beyond the shader's colour constant.

**Tech Stack:** Vanilla CSS + a hand-written GLSL fragment shader string
embedded in vanilla JS. No build step, no framework (CLAUDE.md's vanilla
constraint). Testing is ad hoc Playwright scripts run against `npx serve .`
— this project has no committed unit-test suite, only three named verify
scripts (`smoke.js`, `audit.js`, `drape.js`) for specific concerns, none of
which cover CSS/shader visual detail.

## Global Constraints

- Vanilla JS/HTML/CSS, no build step, no framework, no runtime dependencies (CLAUDE.md).
- `styles.css` has stacked override layers; the *last* definition of a
  selector in file order wins. Before editing, always edit the winning
  (final) block, or append a new rule after all existing definitions of
  that selector (CLAUDE.md).
- The global reduced-motion rule (`@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; } }`,
  styles.css:7437-7443) already applies to any new `transition` or
  `animation` property added anywhere in the file — no separate
  reduced-motion exemption is needed for Task 1's CSS transition.
- Any change to `styles.css` requires bumping `?v=` in `index.html` AND
  `sw.js`'s precache list, AND bumping `CACHE_VERSION` in `sw.js`. The same
  applies to `attract-shader.js`, which already carries its own `?v=`
  param (CLAUDE.md).
- Current versions (confirmed in index.html / sw.js before this plan was
  written): `styles.css?v=90`, `attract-shader.js?v=2`,
  `CACHE_VERSION = "bbs-v109"`.
- `node verify/smoke.js` (needs `npx serve .` running) and
  `node verify/audit.js` must both stay green — this is the project's only
  automated safety net (CLAUDE.md).

---

### Task 1: Hover shimmer sweep on `.map-tour-start`

**Files:**
- Modify: `styles.css` (add a new rule block; no existing `.map-tour-start`
  base rule exists to edit — search for `.map-tour-controls {` to find the
  insertion point, since earlier work in this session may have shifted
  line numbers)

**Interfaces:**
- Consumes: nothing
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Write an ad hoc Playwright script confirming current (no-shimmer) state**

Create `verify/tmp-wow-check.js` (temporary — deleted in Task 4's last
step, not committed):

```javascript
var { chromium } = require("playwright");
var BASE = process.env.SMOKE_URL || "http://localhost:3000";
(async function () {
    var browser = await chromium.launch({ headless: true });
    var page = await (await browser.newContext({ viewport: { width: 900, height: 1200 } })).newPage();
    await page.goto(BASE + "/?_=" + Date.now(), { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.locator("#client-name-input").fill("Wow Check");
    await page.locator('[data-action="save-name"]').click();
    await page.waitForTimeout(500);
    await page.locator('[data-action="mill-map"]').first().click();
    await page.waitForTimeout(1200);
    var before = await page.evaluate(function () {
        var btn = document.querySelector(".map-tour-start");
        var cs = getComputedStyle(btn, "::after");
        return { content: cs.content, position: cs.position };
    });
    console.log("before:", JSON.stringify(before));
    await browser.close();
})();
```

- [ ] **Step 2: Run it and confirm no `::after` shimmer exists yet**

Run (from repo root, with `npx serve .` already running on port 3000, or
set `SMOKE_URL` to whatever port it's on):

```bash
node verify/tmp-wow-check.js
```

Expected output — `content` is `"none"` because no `::after` rule targets
`.map-tour-start` yet:

```json
before: {"content":"none","position":"static"}
```

- [ ] **Step 3: Add the shimmer CSS**

Find `.map-tour-controls {` in `styles.css` and insert this new block
immediately before it:

```css
.map-tour-start {
    position: relative;
    overflow: hidden;
}
.map-tour-start::after {
    content: "";
    position: absolute;
    top: 0;
    left: -60%;
    width: 40%;
    height: 100%;
    background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.35), transparent);
    transform: skewX(-20deg);
    transition: left 0.6s ease;
    pointer-events: none;
}
.map-tour-start:hover::after {
    left: 130%;
}

.map-tour-controls {
    display: flex;
    justify-content: center;
    gap: 10px;
}
```

(Only the two new `.map-tour-start` rules and the `.map-tour-start::after`
rule are new — `.map-tour-controls` itself is shown for placement context
and should be left exactly as it already is.)

- [ ] **Step 4: Re-run the check script and confirm the shimmer exists**

```bash
node verify/tmp-wow-check.js
```

Expected:

```json
before: {"content":"\"\"","position":"absolute"}
```

- [ ] **Step 5: Confirm the hover transition actually moves `left`**

Extend the script (or run a quick one-off) to hover the button and read
the computed `left` before and after:

```javascript
// add before browser.close():
var btn = page.locator(".map-tour-start");
var beforeHover = await btn.evaluate(function (el) { return getComputedStyle(el, "::after").left; });
await btn.hover();
await page.waitForTimeout(700);
var afterHover = await btn.evaluate(function (el) { return getComputedStyle(el, "::after").left; });
console.log("left before hover:", beforeHover, "| after hover:", afterHover);
```

Expected: two different pixel values (the `::after`'s `left` animates from
its `-60%`-derived value toward its `130%`-derived value on hover).

- [ ] **Step 6: Commit**

```bash
git add styles.css
git commit -m "Add hover shimmer sweep to the Mill Map tour button"
```

---

### Task 2: Paper grain on the result card and Mill Map dossier

**Files:**
- Modify: `styles.css` (two new `::before` rules)

**Interfaces:**
- Consumes: nothing
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Add the paper-grain CSS**

Find `.arch-style-card {` in `styles.css`:

```css
.arch-style-card {
    background: #050505;
    color: #f3efe9;
    padding: 1.8rem;
    position: relative;
    overflow: hidden;
}
```

Leave that block untouched, but add this new rule immediately after it
(both target selectors combined, since they share identical grain CSS):

```css
.arch-style-card::before,
.map-tour-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.035;
    mix-blend-mode: multiply;
    pointer-events: none;
}
```

Neither target element needs a `position` fix — `.arch-style-card` already
has `position: relative` (in the block above) and `.map-tour-card` already
has `position: absolute` (styles.css, search for `.map-tour-card {`) — both
already establish the containing block the new `::before`'s `inset: 0`
needs.

- [ ] **Step 2: Confirm both grain overlays exist via computed style**

With `npx serve .` running, extend `verify/tmp-wow-check.js` (or run a
fresh one-off) to check both surfaces. The Mill Map dossier only exists
after starting the tour, and the result card only exists after finishing
the style quiz — check whichever is faster to reach in this app for a
smoke check, or check both if time allows:

```javascript
var grain = await page.evaluate(function () {
    var el = document.querySelector(".map-tour-card");
    if (!el) return null;
    var cs = getComputedStyle(el, "::before");
    return { opacity: cs.opacity, blend: cs.mixBlendMode, hasImage: cs.backgroundImage !== "none" };
});
console.log("grain:", JSON.stringify(grain));
```

Expected: `{"opacity":"0.035","blend":"multiply","hasImage":true}`.

- [ ] **Step 3: Visually confirm the grain is genuinely subtle, not a visible pattern**

Take a Playwright screenshot of `.map-tour-card` (during a running Mill
Map tour) and/or `.arch-style-card` (after finishing the style quiz) and
look at it directly — 0.035 opacity should read as a faint texture, not an
obvious dotted or checkered pattern. If it reads as too strong or too
weak, adjust the `opacity` value in Step 1 and re-check — this is a
design judgement call, not a fixed pass/fail number.

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "Add paper-grain texture to the result card and Mill Map dossier"
```

---

### Task 3: Bronze retint of the welcome screen shader

**Files:**
- Modify: `attract-shader.js` (one colour constant in the GLSL fragment
  shader string)

**Interfaces:**
- Consumes: nothing
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Find and confirm the current colour stop**

```bash
grep -n "vec3 shade=" attract-shader.js
```

Expected: a line containing `vec3 shade=vec3(0.836,0.793,0.716);` — if the
values differ from this, stop and report NEEDS_CONTEXT rather than
guessing which line is the right one to change (the file only has one
`shade` declaration, so this should be unambiguous).

- [ ] **Step 2: Make the change**

Find this exact line in `attract-shader.js` (inside the `FRAG` array, one
of the joined GLSL source strings):

```javascript
        " vec3 shade=vec3(0.836,0.793,0.716);",
```

Replace it with:

```javascript
        " vec3 shade=vec3(0.847,0.775,0.678);",
```

Do not change the adjacent `vec3 base=...` line, the `mix()` call below
it, or anything else in the shader — this is a single numeric substitution.

- [ ] **Step 3: Syntax-check**

```bash
node --check attract-shader.js
```

Expected: no output (clean exit).

- [ ] **Step 4: Visually confirm the welcome screen still reads as pale ambient ground**

With `npx serve .` running, load the app fresh (welcome screen, before
entering a name) and take a Playwright screenshot. Compare by eye against
the pre-change appearance (or just judge the fresh screenshot on its own
merits): the drifting haze behind the "BBS" wordmark should look a little
warmer/more golden than plain grey-cream, but must NOT look like a visible
colour change, a gradient banner, or anything that competes with the
foreground type for attention. If it reads as too strong, the fix is to
move the three `shade` values proportionally back toward the original
`(0.836,0.793,0.716)` — halve the delta on each channel and re-check.

- [ ] **Step 5: Commit**

```bash
git add attract-shader.js
git commit -m "Warm the welcome screen shader's colour stop toward bronze"
```

---

### Task 4: Cache-bust, final verification, cleanup

**Files:**
- Modify: `index.html` (the `styles.css?v=` link tag and the
  `attract-shader.js?v=` script tag)
- Modify: `sw.js` (both precache list entries and `CACHE_VERSION`)
- Delete: `verify/tmp-wow-check.js` (the temporary ad hoc script from
  Task 1 — never committed, cleanup only)

**Interfaces:**
- Consumes: nothing
- Produces: nothing (final task)

- [ ] **Step 1: Bump the styles.css cache-bust version**

In `index.html`, change:

```html
    <link rel="stylesheet" href="styles.css?v=90" />
```

to:

```html
    <link rel="stylesheet" href="styles.css?v=91" />
```

- [ ] **Step 2: Bump the attract-shader.js cache-bust version**

In `index.html`, change:

```html
    <script src="attract-shader.js?v=2"></script>
```

to:

```html
    <script src="attract-shader.js?v=3"></script>
```

- [ ] **Step 3: Bump both entries in the service worker's precache list**

In `sw.js`, change:

```javascript
    "./styles.css?v=90",
```

to:

```javascript
    "./styles.css?v=91",
```

and change:

```javascript
    "./attract-shader.js?v=2",
```

to:

```javascript
    "./attract-shader.js?v=3",
```

- [ ] **Step 4: Bump `CACHE_VERSION`**

In `sw.js`, change:

```javascript
var CACHE_VERSION = "bbs-v109";
```

to:

```javascript
var CACHE_VERSION = "bbs-v110";
```

- [ ] **Step 5: Run the full verification suite**

With `npx serve .` running:

```bash
node verify/smoke.js
```

Expected: all `PASS`, ending in a clean exit (exit code 0).

```bash
node verify/audit.js
```

Expected: `AUDIT: ALL GREEN` (this change is CSS/shader-only, so every
audit check is unaffected — this run just confirms nothing else regressed).

- [ ] **Step 6: Delete the temporary check script**

```bash
rm verify/tmp-wow-check.js
```

- [ ] **Step 7: Final commit**

```bash
git add index.html sw.js
git commit -m "Bump cache version for wow-factor polish"
```
