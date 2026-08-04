# Ensemble Flat-Lay Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Cloth Room's ensemble mode from a rigid two-column
flat-lay into an overlapping, tilted, shadowed arrangement that reads as
styled photography, and give each newly-added garment a settle-in reveal
animation instead of appearing instantly.

**Architecture:** CSS-only restyle of the existing `.ds-stage` / `.ds-garment`
rules in `styles.css` (Task 1), plus a one-shot `ens.justAdded` state flag
threaded through `app.js`'s `vis-ens-add` handler and
`fabric-visualiser.js`'s ensemble render path (Task 2), driving a new CSS
keyframe (Task 3). No markup changes, no new files.

**Tech Stack:** Vanilla CSS + vanilla JS (ES5, string-concatenated HTML).
No build step, no framework (CLAUDE.md's vanilla constraint). Testing is ad
hoc Playwright scripts run against `npx serve .` — this project has no
committed unit-test suite, only three named verify scripts (`smoke.js`,
`audit.js`, `drape.js`) for specific concerns, none of which cover
ensemble-mode CSS/animation detail.

## Global Constraints

- Vanilla JS/HTML/CSS, no build step, no framework, no runtime dependencies (CLAUDE.md).
- `styles.css` has stacked override layers; the *last* definition of a
  selector in file order wins. Before editing, always edit the winning
  (final) block, or append a new rule after all existing definitions of
  that selector (CLAUDE.md). Confirmed for this plan: `.ds-garment`,
  `.ds-garment--jacket/vest/trousers`, `.ds-garment.active`, `.ds-stage`,
  `.ds-stage-left`, `.ds-stage-right` each have exactly one property-bearing
  definition (styles.css:8617-8660) plus two later single-property
  additions (`.ds-stage { animation: ... }` at 8801, a padding/gap override
  inside a media query at 8805) that do not conflict with anything this
  plan adds — no override-layer collision.
- The global reduced-motion rule (`@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; } }`,
  styles.css:7437-7443) already applies to any new `transition` or
  `animation` property added anywhere in the file — no separate
  reduced-motion exemption is needed for this plan's CSS transition or
  keyframe.
- `.ds-garment.active` (specificity 0,2,0) already outranks the
  single-class `.ds-garment--jacket` / `--vest` / `--trousers` rules
  (0,1,0) without needing `!important` — confirmed before relying on it in
  Task 1.
- Any change to `styles.css` or `app.js` requires bumping `?v=` in
  `index.html` AND `sw.js`'s precache list, AND bumping `CACHE_VERSION` in
  `sw.js` (CLAUDE.md).
- Current versions (confirmed in index.html / sw.js before this plan was
  written): `styles.css?v=91`, `app.js?v=89`, `CACHE_VERSION = "bbs-v110"`.
- `node verify/smoke.js` (needs `npx serve .` running) and
  `node verify/audit.js` must both stay green — this is the project's only
  automated safety net (CLAUDE.md).
- `fabric-visualiser.js` is unversioned (no `?v=` param) but is precached
  by `sw.js` under `CACHE_VERSION` — bumping `CACHE_VERSION` alone
  invalidates it; it needs no entry change of its own.

---

### Task 1: Editorial flat-lay restyle

**Files:**
- Modify: `styles.css` (search for `.ds-stage {` to find the insertion
  point — earlier work in this session may have shifted line numbers from
  the ~8617 confirmed above)

**Interfaces:**
- Consumes: nothing
- Produces: nothing consumed by later tasks (Task 2/3 add a class name,
  `ds-garment-enter`, that does not collide with anything here)

- [ ] **Step 1: Write an ad hoc Playwright script confirming current (no-tilt) state**

Create `verify/tmp-ensemble-check.js` (temporary — deleted in Task 4's last
step, not committed):

```javascript
var { chromium } = require("playwright");
var BASE = process.env.SMOKE_URL || "http://localhost:3000";
(async function () {
    var browser = await chromium.launch({ headless: true });
    var page = await (await browser.newContext({ viewport: { width: 900, height: 1200 } })).newPage();
    await page.goto(BASE + "/?_=" + Date.now(), { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.locator("#client-name-input").fill("Ensemble Check");
    await page.locator('[data-action="save-name"]').click();
    await page.waitForTimeout(500);
    await page.locator('[data-action="fabric-vis"]').first().click();
    await page.waitForTimeout(1200);
    var toggle = page.locator('[data-action="vis-ensemble-toggle"]');
    if (await toggle.count()) { await toggle.click(); await page.waitForTimeout(300); }
    await page.locator('[data-action="vis-ens-add"][data-garment="jacket"]').click();
    await page.waitForTimeout(300);
    var before = await page.evaluate(function () {
        var jacket = document.querySelector(".ds-garment--jacket");
        var right = document.querySelector(".ds-stage-right");
        var cs = getComputedStyle(jacket);
        return { transform: cs.transform, boxShadow: cs.boxShadow, rightMarginLeft: right ? getComputedStyle(right).marginLeft : "no-right-column-yet" };
    });
    console.log("before:", JSON.stringify(before));
    await browser.close();
})();
```

- [ ] **Step 2: Run it and confirm no tilt/shadow/overlap exists yet**

Run (from repo root, with `npx serve .` already running on port 3000, or
set `SMOKE_URL` to whatever port it's on):

```bash
node verify/tmp-ensemble-check.js
```

Expected output — `transform` is `"none"` and `boxShadow` is `"none"`
because no rule sets them on `.ds-garment--jacket` yet; `rightMarginLeft`
is `"no-right-column-yet"` because only the jacket has been added, so
`.ds-stage-right` does not exist yet:

```json
before: {"transform":"none","boxShadow":"none","rightMarginLeft":"no-right-column-yet"}
```

- [ ] **Step 3: Add the editorial restyle CSS**

Find this exact block in `styles.css` (the `.ds-stage` / `.ds-stage-left` /
`.ds-stage-right` / `.ds-garment` / `.ds-garment.active` / per-garment
aspect-ratio rules):

```css
.ds-stage-left { flex: 1.35; min-width: 0; }

.ds-stage-right {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.ds-garment {
    position: relative;
    width: 100%;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 3px;
    transition: border-color 0.3s ease, background 0.3s ease;
    -webkit-tap-highlight-color: transparent;
}

    .ds-garment.active {
        border-color: var(--bronze);
        background: rgba(255, 255, 255, 0.5);
    }

.ds-garment--jacket { aspect-ratio: 440 / 540; }
/* These must match the SVG viewBoxes in fabric-visualiser.js — the clip
   paths use objectBoundingBox units, so a mismatch stretches the
   garment. The vest was 440/360 (landscape) and the trousers 440/440
   (square), which is why they read as a tombstone and a rectangle. */
.ds-garment--vest { aspect-ratio: 440 / 440; }
.ds-garment--trousers { aspect-ratio: 440 / 680; }
```

Replace it with (only the `margin-left` on `.ds-stage-right`, the
`transform`/`z-index`/`box-shadow` additions, the widened `transition`
list, and the new `.ds-garment.active` transform/z-index are new — the
`aspect-ratio` rules and their comment are unchanged, shown for placement
context):

```css
.ds-stage-left { flex: 1.35; min-width: 0; }

.ds-stage-right {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-left: -16px;
}

.ds-garment {
    position: relative;
    width: 100%;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 3px;
    transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
    -webkit-tap-highlight-color: transparent;
}

    .ds-garment.active {
        border-color: var(--bronze);
        background: rgba(255, 255, 255, 0.5);
        transform: translateY(-4px) rotate(0deg) scale(1.015);
        z-index: 3;
    }

.ds-garment--jacket { aspect-ratio: 440 / 540; transform: rotate(-2deg); position: relative; z-index: 2; }
/* These must match the SVG viewBoxes in fabric-visualiser.js — the clip
   paths use objectBoundingBox units, so a mismatch stretches the
   garment. The vest was 440/360 (landscape) and the trousers 440/440
   (square), which is why they read as a tombstone and a rectangle. */
.ds-garment--vest { aspect-ratio: 440 / 440; transform: rotate(3deg); }
.ds-garment--trousers { aspect-ratio: 440 / 680; transform: rotate(-1deg); margin-top: -14px; position: relative; z-index: 1; }

.ds-garment--jacket,
.ds-garment--vest,
.ds-garment--trousers {
    box-shadow: 0 10px 22px -8px rgba(17, 17, 16, 0.28);
}
```

- [ ] **Step 4: Re-run the check script and confirm tilt, shadow, and overlap**

```bash
node verify/tmp-ensemble-check.js
```

Expected: `transform` is a `matrix(...)` string (not `"none"` — the exact
matrix encodes `rotate(-2deg)`, no need to hand-decode it, just confirm it
changed), `boxShadow` is no longer `"none"`, and `rightMarginLeft` is
`"no-right-column-yet"` still (jacket alone has no right column) — this
step only proves the jacket itself picked up the new rules.

```json
before: {"transform":"matrix(0.999391,-0.034899,0.034899,0.999391,0,0)","boxShadow":"rgba(17, 17, 16, 0.28) 0px 10px 22px -8px","rightMarginLeft":"no-right-column-yet"}
```

(The exact `matrix(...)` numbers only need to differ from `"none"` — do
not hand-match them, floating point rendering can vary by engine.)

- [ ] **Step 5: Extend the script to add a vest and confirm the right-column overlap**

Add before `browser.close()`:

```javascript
    await page.locator('[data-action="vis-ens-add"][data-garment="vest"]').click();
    await page.waitForTimeout(300);
    var after = await page.evaluate(function () {
        var right = document.querySelector(".ds-stage-right");
        return { rightMarginLeft: right ? getComputedStyle(right).marginLeft : "still-missing" };
    });
    console.log("after vest added:", JSON.stringify(after));
```

Run again:

```bash
node verify/tmp-ensemble-check.js
```

Expected: `rightMarginLeft` is `"-16px"`.

- [ ] **Step 6: Confirm the active garment's lift wins over its resting tilt**

Add before `browser.close()` (the vest just added is already the active
garment — `vis-ens-add` sets `activeGarment` to whatever was just added):

```javascript
    var activeLift = await page.evaluate(function () {
        var vest = document.querySelector(".ds-garment--vest");
        return getComputedStyle(vest).transform;
    });
    console.log("active vest transform:", activeLift);
```

Run again:

```bash
node verify/tmp-ensemble-check.js
```

Expected: a `matrix(...)` string consistent with `translateY(-4px)
rotate(0deg) scale(1.015)` (no rotation component — the `.active` rule's
`rotate(0deg)` overrides `.ds-garment--vest`'s resting `rotate(3deg)`
because `.ds-garment.active` is a higher-specificity selector). Confirms
the `!important`-free override reasoning in Global Constraints holds in
the browser, not just on paper.

- [ ] **Step 7: Commit**

```bash
git add styles.css
git commit -m "Restyle the ensemble stage as an overlapping editorial flat-lay"
```

---

### Task 2: Assembly reveal — state plumbing

**Files:**
- Modify: `app.js` (the `vis-ens-add` action handler, search for
  `else if (action === "vis-ens-add")` — confirmed at ~6989-7008)
- Modify: `fabric-visualiser.js` (`getVisEnsPlaceholderBlock` at ~1639 and
  `renderClothEnsemble` at ~1762 — search for `function
  getVisEnsPlaceholderBlock` and `function renderClothEnsemble`)

**Interfaces:**
- Consumes: nothing
- Produces: a `ds-garment-enter` class on the just-added garment's
  `.ds-garment` element, present for exactly one render pass. Task 3's CSS
  keyframe targets this class name — it must match exactly.

**Why only `getVisEnsPlaceholderBlock` and not `getVisEnsGarmentBlock`:**
`vis-ens-add` never assigns a fabric to the newly-added garment — it only
sets `ens.activeGarment`. So at the moment `ens.justAdded` is set, that
garment's `fabricKey` never resolves yet, and `getVisEnsGarmentBlock`
(fabric-visualiser.js:1656) always delegates to
`getVisEnsPlaceholderBlock` for it. Adding the class check to
`getVisEnsGarmentBlock`'s photo/hand-drawn branches as well would be dead
code — those branches can never see `ens.justAdded === garment` true in
practice, since a garment stops being "just added" (the flag is cleared,
Step 4 below) before the client can pick a cloth for it. Only touch
`getVisEnsPlaceholderBlock`.

- [ ] **Step 1: Extend the check script to assert the class appears after add**

Add to `verify/tmp-ensemble-check.js`, before `browser.close()`:

```javascript
    await page.locator('[data-action="vis-ens-add"][data-garment="trousers"]').click();
    await page.waitForTimeout(200);
    var enterClass = await page.evaluate(function () {
        var trousers = document.querySelector(".ds-garment--trousers");
        return trousers ? trousers.className : "not-found";
    });
    console.log("trousers class right after add:", enterClass);
```

- [ ] **Step 2: Run it and confirm the class is absent (not implemented yet)**

```bash
node verify/tmp-ensemble-check.js
```

Expected: `trousers class right after add:` contains `ds-garment
ds-garment--trousers ds-garment--empty active` — no `ds-garment-enter`
anywhere in the string, since nothing sets it yet.

- [ ] **Step 3: Set the flag in the `vis-ens-add` handler**

Find this exact block in `app.js`:

```javascript
    else if (action === "vis-ens-add") {
        // Add a garment to the outfit and make it the active piece. It joins in
        // canonical order (jacket, vest, trousers) and starts as a blank slot —
        // no cloth until the client picks one.
        var addGarment = target.dataset.garment;
        if (!addGarment) return;
        var ensAdd = getVisEnsembleState();
        if (ensAdd.garments.indexOf(addGarment) === -1) {
            var ordered = [];
            for (var ai = 0; ai < VIS_ENS_GARMENTS.length; ai++) {
                if (ensAdd.garments.indexOf(VIS_ENS_GARMENTS[ai]) !== -1 || VIS_ENS_GARMENTS[ai] === addGarment) {
                    ordered.push(VIS_ENS_GARMENTS[ai]);
                }
            }
            ensAdd.garments = ordered;
        }
        ensAdd.activeGarment = addGarment;
        localStorage.setItem("bbs_session", JSON.stringify(appState));
        render({ animate: false });
    }
```

Replace it with (only the new `ensAdd.justAdded = addGarment;` line is
new):

```javascript
    else if (action === "vis-ens-add") {
        // Add a garment to the outfit and make it the active piece. It joins in
        // canonical order (jacket, vest, trousers) and starts as a blank slot —
        // no cloth until the client picks one.
        var addGarment = target.dataset.garment;
        if (!addGarment) return;
        var ensAdd = getVisEnsembleState();
        if (ensAdd.garments.indexOf(addGarment) === -1) {
            var ordered = [];
            for (var ai = 0; ai < VIS_ENS_GARMENTS.length; ai++) {
                if (ensAdd.garments.indexOf(VIS_ENS_GARMENTS[ai]) !== -1 || VIS_ENS_GARMENTS[ai] === addGarment) {
                    ordered.push(VIS_ENS_GARMENTS[ai]);
                }
            }
            ensAdd.garments = ordered;
        }
        ensAdd.activeGarment = addGarment;
        ensAdd.justAdded = addGarment;
        localStorage.setItem("bbs_session", JSON.stringify(appState));
        render({ animate: false });
    }
```

- [ ] **Step 4: Apply and consume the flag in `fabric-visualiser.js`**

Find this exact function:

```javascript
function getVisEnsPlaceholderBlock(garment, ens) {
    var activeClass = ens.activeGarment === garment ? " active" : "";
    var label = garment.charAt(0).toUpperCase() + garment.slice(1);
    return (
        '<div class="ds-garment ds-garment--' + garment + " ds-garment--empty" + activeClass + '" data-action="vis-ens-garment" data-garment="' + garment + '">' +
        '<div class="ds-garment-empty-inner">' +
        '<span class="ds-garment-empty-mark" aria-hidden="true"></span>' +
        '<span class="ds-garment-empty-hint">Choose a cloth</span>' +
        "</div>" +
        '<div class="ds-garment-label">' + label + "</div>" +
        "</div>"
    );
}
```

Replace it with (only the `enterClass` variable and its use in the outer
`<div>`'s class string are new):

```javascript
function getVisEnsPlaceholderBlock(garment, ens) {
    var activeClass = ens.activeGarment === garment ? " active" : "";
    var enterClass = ens.justAdded === garment ? " ds-garment-enter" : "";
    var label = garment.charAt(0).toUpperCase() + garment.slice(1);
    return (
        '<div class="ds-garment ds-garment--' + garment + " ds-garment--empty" + activeClass + enterClass + '" data-action="vis-ens-garment" data-garment="' + garment + '">' +
        '<div class="ds-garment-empty-inner">' +
        '<span class="ds-garment-empty-mark" aria-hidden="true"></span>' +
        '<span class="ds-garment-empty-hint">Choose a cloth</span>' +
        "</div>" +
        '<div class="ds-garment-label">' + label + "</div>" +
        "</div>"
    );
}
```

Then find this block in `renderClothEnsemble` (still in
`fabric-visualiser.js`):

```javascript
    var stageInner = "";
    if (ens.garments.indexOf("jacket") !== -1) {
        stageInner += '<div class="ds-stage-left">' + getVisEnsGarmentBlock("jacket", ens) + "</div>";
    }
    var rightBlocks = "";
    if (ens.garments.indexOf("vest") !== -1) rightBlocks += getVisEnsGarmentBlock("vest", ens);
    if (ens.garments.indexOf("trousers") !== -1) rightBlocks += getVisEnsGarmentBlock("trousers", ens);
    if (rightBlocks) stageInner += '<div class="ds-stage-right">' + rightBlocks + "</div>";
```

Replace it with (only the trailing `ens.justAdded = null;` line is new —
it must come after all three `getVisEnsGarmentBlock` calls above it, since
they are what reads the flag):

```javascript
    var stageInner = "";
    if (ens.garments.indexOf("jacket") !== -1) {
        stageInner += '<div class="ds-stage-left">' + getVisEnsGarmentBlock("jacket", ens) + "</div>";
    }
    var rightBlocks = "";
    if (ens.garments.indexOf("vest") !== -1) rightBlocks += getVisEnsGarmentBlock("vest", ens);
    if (ens.garments.indexOf("trousers") !== -1) rightBlocks += getVisEnsGarmentBlock("trousers", ens);
    if (rightBlocks) stageInner += '<div class="ds-stage-right">' + rightBlocks + "</div>";
    // Consumed once per render pass — a piece is only "just added" for the
    // render triggered by vis-ens-add itself, never for a later unrelated
    // render (a style change or a different garment being added).
    ens.justAdded = null;
```

- [ ] **Step 5: Re-run the script and confirm the class appears once**

```bash
node verify/tmp-ensemble-check.js
```

Expected: `trousers class right after add:` now contains
`ds-garment-enter` somewhere in the string (exact order among the other
classes does not matter).

- [ ] **Step 6: Confirm the class does NOT survive an unrelated render**

Trousers was the last garment added (Step 1 above), so it is
`ens.activeGarment` and its style menu (`style`: Flat Front / Double Pleat
/ Belt Loops) is what's on screen. Tapping "Double Pleat" calls `render()`
without going through `vis-ens-add`, which is exactly the unrelated-render
case this step needs. Add before `browser.close()`:

```javascript
    await page.locator('[data-action="vis-ens-style"][data-group="style"][data-value="double"]').click();
    await page.waitForTimeout(200);
    var afterUnrelated = await page.evaluate(function () {
        var trousers = document.querySelector(".ds-garment--trousers");
        return trousers ? trousers.className : "not-found";
    });
    console.log("trousers class after unrelated style tap:", afterUnrelated);
```

Run again:

```bash
node verify/tmp-ensemble-check.js
```

Expected: `trousers class after unrelated style tap:` does NOT contain
`ds-garment-enter`.

- [ ] **Step 7: Commit**

```bash
git add app.js fabric-visualiser.js
git commit -m "Add a one-shot reveal flag when a garment is added to the ensemble"
```

---

### Task 3: Assembly reveal — animation keyframe

**Files:**
- Modify: `styles.css` (search for `@keyframes cardReveal` — confirmed at
  ~7811 — to find a consistent place to add the new keyframe nearby)

**Interfaces:**
- Consumes: the `ds-garment-enter` class produced by Task 2
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Confirm no animation is attached to the class yet**

By this point `verify/tmp-ensemble-check.js` has accumulated jacket, vest,
and trousers from Tasks 1 and 2, so there is no "unused" garment key left
to add for a clean before/after animation check. Replace the whole script
with a fresh, minimal one — a clean page load, one garment added, one
check — rather than keep extending the accumulated script further:

```javascript
var { chromium } = require("playwright");
var BASE = process.env.SMOKE_URL || "http://localhost:3000";
(async function () {
    var browser = await chromium.launch({ headless: true });
    var page = await (await browser.newContext({ viewport: { width: 900, height: 1200 } })).newPage();
    await page.goto(BASE + "/?_=" + Date.now(), { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.locator("#client-name-input").fill("Reveal Check");
    await page.locator('[data-action="save-name"]').click();
    await page.waitForTimeout(500);
    await page.locator('[data-action="fabric-vis"]').first().click();
    await page.waitForTimeout(1200);
    var toggle = page.locator('[data-action="vis-ensemble-toggle"]');
    if (await toggle.count()) { await toggle.click(); await page.waitForTimeout(300); }
    await page.locator('[data-action="vis-ens-add"][data-garment="vest"]').click();
    await page.waitForTimeout(100);
    var anim = await page.evaluate(function () {
        var vest = document.querySelector(".ds-garment--vest");
        return vest ? getComputedStyle(vest).animationName : "not-found";
    });
    console.log("vest animation-name right after add:", anim);
    await browser.close();
})();
```

Run:

```bash
node verify/tmp-ensemble-check.js
```

Expected: `vest animation-name right after add: none` (the class is
applied by Task 2, but no keyframe targets it yet).

- [ ] **Step 2: Add the keyframe and its animation rule**

Find this exact block in `styles.css`:

```css
@keyframes cardReveal {
    from { opacity: 0; transform: translateY(26px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
```

Insert this new block immediately after it (the `cardReveal` block itself
is unchanged, shown for placement context):

```css
@keyframes cardReveal {
    from { opacity: 0; transform: translateY(26px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes dsGarmentEnter {
    from { opacity: 0; transform: translateY(-14px) scale(0.96); }
    to { opacity: 1; }
}
.ds-garment-enter {
    animation: dsGarmentEnter 0.5s var(--ease-out) both;
}
```

(The `to` keyframe deliberately omits `transform` — per standard CSS
keyframe interpolation, a property present in `from` but absent from `to`
resolves at `to` to the element's own underlying, non-animated value,
which is Task 1's per-garment resting `rotate(...)`. This is why Task 1
must land before this step — `.ds-garment-enter` reads Task 1's
`.ds-garment--vest` / `--jacket` / `--trousers` transform as its landing
position.)

- [ ] **Step 3: Re-run and confirm the animation is attached**

```bash
node verify/tmp-ensemble-check.js
```

Expected: `vest animation-name right after add: dsGarmentEnter`.

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "Animate a newly-added garment settling into its ensemble tilt"
```

---

### Task 4: Cache-bust, final verification, cleanup

**Files:**
- Modify: `index.html` (the `styles.css?v=` link tag and the `app.js?v=`
  script tag)
- Modify: `sw.js` (both precache list entries and `CACHE_VERSION`)
- Delete: `verify/tmp-ensemble-check.js` (the temporary ad hoc script from
  Task 1 — never committed, cleanup only)

**Interfaces:**
- Consumes: nothing
- Produces: nothing (final task)

- [ ] **Step 1: Bump the styles.css cache-bust version**

In `index.html`, change:

```html
    <link rel="stylesheet" href="styles.css?v=91" />
```

to:

```html
    <link rel="stylesheet" href="styles.css?v=92" />
```

- [ ] **Step 2: Bump the app.js cache-bust version**

In `index.html`, change:

```html
    <script src="app.js?v=89"></script>
```

to:

```html
    <script src="app.js?v=90"></script>
```

- [ ] **Step 3: Bump both entries in the service worker's precache list**

In `sw.js`, change:

```javascript
    "./styles.css?v=91",
```

to:

```javascript
    "./styles.css?v=92",
```

and change:

```javascript
    "./app.js?v=89",
```

to:

```javascript
    "./app.js?v=90",
```

- [ ] **Step 4: Bump `CACHE_VERSION`**

In `sw.js`, change:

```javascript
var CACHE_VERSION = "bbs-v110";
```

to:

```javascript
var CACHE_VERSION = "bbs-v111";
```

- [ ] **Step 5: Run the full verification suite**

With `npx serve .` running:

```bash
node verify/smoke.js
```

Expected: all `PASS`, ending in a clean exit (exit code 0). Note the
project's smoke suite has shown one-off timing flakiness on "Cloth Room
entry" before (unrelated to code changes) — if a single check fails, re-run
once before treating it as a real regression.

```bash
node verify/audit.js
```

Expected: `AUDIT: ALL GREEN` (this change is CSS/JS-only and touches no
data, so every audit check is unaffected — this run just confirms nothing
else regressed).

- [ ] **Step 6: Delete the temporary check script**

```bash
rm verify/tmp-ensemble-check.js
```

- [ ] **Step 7: Final commit**

```bash
git add index.html sw.js
git commit -m "Bump cache version for ensemble flat-lay polish"
```
