# Provenance Ribbon Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix a real CSS cascade bug that turns the Provenance Ribbon's marquee entries into boxed pills instead of quiet marquee text, remove ~100 lines of dead CSS from the tape blade it replaced, and add two small ticked-line flourishes that make the ribbon genuinely "brass-ruled" as it was always described.

**Architecture:** CSS-only change, one file (`styles.css`), plus the two cache-busting files (`index.html`, `sw.js`) every styles.css change requires per CLAUDE.md. No JS or markup changes — `mill-map.js`'s existing `.pmarq-house` / `.pmarq` / `.pmarq-track` markup is already correct; only its styling changes.

**Tech Stack:** Vanilla CSS. No build step, no framework (per CLAUDE.md's vanilla constraint). Testing is ad hoc Playwright scripts run against `npx serve .` — this project has no committed unit-test suite, only three named verify scripts (`smoke.js`, `audit.js`, `drape.js`) for specific concerns none of which cover CSS visual detail, so per-task checks here follow the same ad hoc-script convention already used earlier in this session for the Mill Map tour and Loupe fix, not a new permanent test file.

## Global Constraints

- Vanilla JS/HTML/CSS, no build step, no framework, no runtime dependencies (CLAUDE.md).
- `styles.css` has stacked override layers; the *last* definition of a selector in file order wins. Before editing, always edit the winning (final) block (CLAUDE.md).
- The `button:hover` trap: a bare `button { ... !important }` reset outranks any single class, including one with `!important`, because it's an element+pseudo-class selector at (0,1,1) vs. a class at (0,1,0). Confirmed here to also apply to the *base* (non-hover) `button {}` rule, which has no `.btn-bare` exception. The established fix, already used by `.map-globe-pin` (styles.css:10834-10855), is to add `!important` to the colliding properties on the specific component (CLAUDE.md).
- `--bronze: #8a6d43` is the current brand bronze token (the older `#9a7b4f` failed AA contrast and was superseded — use the CSS variable, never the old literal).
- Any change to `styles.css` requires bumping `?v=` in `index.html` AND `sw.js`'s precache list, AND bumping `CACHE_VERSION` in `sw.js` (CLAUDE.md).
- `node verify/smoke.js` (needs `npx serve .` running) and `node verify/audit.js` must both stay green — this is the project's only automated safety net (CLAUDE.md).

---

### Task 1: Fix the `.pmarq-house` cascade bug

**Files:**
- Modify: `styles.css` (the `.pmarq-house` rule, currently at line 11955 in the "MILL MAP GUIDED TOUR" section's neighbor — search for `.pmarq-house {` to find its current position, since earlier tasks in this session may have shifted line numbers)

**Interfaces:**
- Consumes: nothing (pure CSS, no JS/markup dependency)
- Produces: nothing consumed by later tasks — Task 3's `.pmarq-house::before` addition is independent and can be added to the same rule block or immediately after it

- [ ] **Step 1: Write an ad hoc Playwright script confirming the bug is present**

Create `verify/tmp-ribbon-check.js` (temporary — deleted in Task 4's last step, not committed):

```javascript
var { chromium } = require("playwright");
var BASE = process.env.SMOKE_URL || "http://localhost:3000";
(async function () {
    var browser = await chromium.launch({ headless: true });
    var page = await (await browser.newContext({ viewport: { width: 900, height: 1400 } })).newPage();
    await page.goto(BASE + "/?_=" + Date.now(), { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.locator("#client-name-input").fill("Ribbon Check");
    await page.locator('[data-action="save-name"]').click();
    await page.waitForTimeout(500);
    await page.locator('[data-action="mill-map"]').first().click();
    await page.waitForTimeout(1500);
    var result = await page.evaluate(function () {
        var el = document.querySelector(".pmarq-house");
        var cs = getComputedStyle(el);
        return { border: cs.border, padding: cs.padding };
    });
    console.log(JSON.stringify(result, null, 2));
    await browser.close();
})();
```

- [ ] **Step 2: Run it and confirm the bug reproduces**

Run (from repo root, with `npx serve .` already running on port 3000, or set `SMOKE_URL` to whatever port it's on):

```bash
node verify/tmp-ribbon-check.js
```

Expected output showing the bug — the base `button {}` reset winning over `.pmarq-house`'s intended `border: none; padding: 0.7rem 0.2rem`:

```json
{
  "border": "1px solid rgba(17, 17, 16, 0.18)",
  "padding": "15px 28px"
}
```

- [ ] **Step 3: Fix `.pmarq-house`**

Find this exact block in `styles.css`:

```css
.pmarq-house {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.7rem 0.2rem;
    background: none;
    border: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}
```

Replace it with (adding `!important` to the three colliding properties, matching the exact precedent `.map-globe-pin` already uses for this identical collision):

```css
.pmarq-house {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.7rem 0.2rem !important;
    background: none !important;
    border: none !important;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}
```

- [ ] **Step 4: Re-run the check script and confirm the fix**

```bash
node verify/tmp-ribbon-check.js
```

Expected:

```json
{
  "border": "none",
  "padding": "11.2px 3.2px"
}
```

(Padding renders as `11.2px 3.2px` — the pixel equivalent of `0.7rem 0.2rem` at the default 16px root font size. `border: "none"` confirms the `!important` override won.)

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "Fix Provenance Ribbon cascade bug turning marquee text into boxed pills"
```

---

### Task 2: Remove dead tape-blade CSS

**Files:**
- Modify: `styles.css` (delete unused selectors between `.ptape-lead` and the `THE SPLIT` section comment)

**Interfaces:**
- Consumes: nothing
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Confirm which `.ptape-*` selectors are actually dead**

```bash
grep -n "ptape-scroll\|ptape-rail\|ptape-blade\|ptape-tick\|ptape-year\|ptape-house\|ptape-stem\|ptape-label" mill-map.js app.js fabric-visualiser.js
```

Expected: no output (zero matches) — confirming these eight selectors and their state variants have no markup reference anywhere, unlike `.ptape-block`, `.ptape-head`, `.ptape-title`, `.ptape-lead`, which `mill-map.js` still generates and must be kept.

- [ ] **Step 2: Delete the dead block**

Find this exact block in `styles.css` (it runs from the comment right after `.ptape-lead` through the last `.ptape-house:hover .ptape-label` rule, immediately before the `THE SPLIT` section comment):

```css
/* The blade scrolls horizontally; only this element does, so the page
   itself never scrolls sideways. */
.ptape-scroll {
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    padding: 0 0 6px;
}

.ptape-rail {
    position: relative;
    height: 210px;
    margin: 0 40px;
}

.ptape-blade {
    position: absolute;
    left: 0;
    right: 0;
    top: 105px;
    height: 2px;
    background: var(--bronze);
    opacity: 0.35;
}

.ptape-tick {
    position: absolute;
    top: 105px;
    width: 1px;
    height: 7px;
    background: var(--line-strong);
}

.ptape-tick.major { height: 14px; background: var(--bronze); opacity: 0.55; }

.ptape-year {
    position: absolute;
    top: 122px;
    transform: translateX(-50%);
    font-family: "Manrope", sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    color: var(--soft);
    font-variant-numeric: tabular-nums;
}

/* Houses alternate above and below the blade, which keeps close
   founding years from colliding without moving any of them. */
.ptape-house {
    position: absolute;
    justify-content: flex-start;
    display: flex !important;
    flex-direction: column;
    align-items: center;
    padding: 0 !important;
    min-height: 44px !important;
    border: 0 !important;
    background: transparent !important;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transform: translateX(-50%);
}

/* Four lanes: two above the blade, two below. Each label sits at a
   different depth so dense decades stay readable. */
.ptape-house.lane0 { bottom: 105px; height: 92px; flex-direction: column-reverse; }
.ptape-house.lane1 { bottom: 105px; height: 52px; flex-direction: column-reverse; }
.ptape-house.lane2 { top: 107px; height: 52px; }
.ptape-house.lane3 { top: 107px; height: 92px; }

.ptape-stem {
    flex: 1 1 auto;
    width: 1px;
    background: var(--line-strong);
}

.ptape-label {
    display: block;
    white-space: nowrap;
    font-family: "Manrope", sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    color: var(--text);
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 5px 8px;
}

.ptape-label em {
    display: block;
    font-style: normal;
    font-variant-numeric: tabular-nums;
    color: var(--bronze);
    letter-spacing: 0.14em;
}

.ptape-house:active .ptape-label { border-color: var(--line-strong); }
.ptape-house:hover .ptape-label { background: var(--surface) !important; border-color: var(--line-strong); }
.ptape-house:focus-visible { outline: 2px solid var(--bronze); outline-offset: 3px; }

/* A bare `button:hover` in this file sets a dark background, and a
   pseudo-class selector outranks a single class — so a tape marker
   turned into a solid black box under the pointer. Exactly the bug
   already fixed on the look cards; this is the same shape. */
.ptape-house:hover,
.ptape-house:focus,
.ptape-house:active {
    background: transparent !important;
}

.ptape-house:hover .ptape-label {
    border-color: var(--line-strong);
    background: var(--surface) !important;
    color: var(--text) !important;
}
```

Delete the entire block above. Leave `.ptape-block`, `.ptape-head`, `.ptape-title`, `.ptape-lead` (immediately before it) and the `THE SPLIT` section (immediately after it) untouched.

- [ ] **Step 3: Confirm the deletion didn't break anything**

```bash
grep -c "ptape-scroll\|ptape-rail\|ptape-blade\|ptape-tick\|ptape-year\|ptape-house\|ptape-stem\|ptape-label" styles.css
```

Expected: `0`

```bash
grep -c "ptape-block\|ptape-head\|ptape-title\|ptape-lead" styles.css
```

Expected: `4` (one rule each, still present)

- [ ] **Step 4: Visually confirm no regression**

With `npx serve .` running, load the Mill Map in a browser (or reuse the Playwright screenshot pattern from Task 1) and confirm the "N Years of Weaving" heading and lead paragraph above the ribbon still render — they use `.ptape-block`/`.ptape-head`/`.ptape-title`/`.ptape-lead`, which were not touched.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "Remove dead tape-blade CSS superseded by the Provenance Ribbon"
```

---

### Task 3: Ticked rule lines and tick dividers

**Files:**
- Modify: `styles.css` (the `.pmarq` rule and `.pmarq-house` rule)

**Interfaces:**
- Consumes: `.pmarq-house`'s fixed state from Task 1 (the `!important` additions must already be in place — this task adds a new `::before` to the same selector, it does not touch the properties Task 1 fixed)
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Replace `.pmarq`'s plain border with ticked rule lines**

Find this exact block in `styles.css`:

```css
.pmarq {
    position: relative;
    margin-top: 1.4rem;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    overflow: hidden;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
}
```

Replace it with (reusing the same `repeating-linear-gradient` tick technique as `.worksheet-progress-bar`, in bronze rather than the worksheet's ivory/dark, as two independent 1px background layers anchored to the top and bottom edges instead of a plain solid border):

```css
.pmarq {
    position: relative;
    margin-top: 1.4rem;
    overflow: hidden;
    background-image:
        repeating-linear-gradient(90deg, rgba(138, 109, 67, 0.4) 0, rgba(138, 109, 67, 0.4) 1px, transparent 1px, transparent 10px),
        repeating-linear-gradient(90deg, rgba(138, 109, 67, 0.4) 0, rgba(138, 109, 67, 0.4) 1px, transparent 1px, transparent 10px);
    background-repeat: no-repeat;
    background-position: top left, bottom left;
    background-size: 100% 1px, 100% 1px;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
}
```

- [ ] **Step 2: Add a tick divider before each ribbon entry**

Find `.pmarq-house` again (now carrying Task 1's `!important` fixes) and add a new rule immediately after its closing brace:

```css
.pmarq-house::before {
    content: "";
    display: inline-block;
    width: 1px;
    height: 12px;
    margin-right: 0.5rem;
    background: rgba(138, 109, 67, 0.4);
    vertical-align: middle;
}
```

- [ ] **Step 3: Visually confirm both changes**

With `npx serve .` running:

```bash
node verify/tmp-ribbon-check.js
```

Extend the script's `page.evaluate` block (or check manually in a browser) to confirm `.pmarq`'s computed `background-image` is no longer `"none"` and that `.pmarq-house`'s `::before` pseudo-element has non-zero width. A quick manual check: open the Mill Map, scroll to the ribbon, and visually confirm a thin ticked line runs along the top and bottom of the strip, and a small tick mark separates each house entry.

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "Add ticked rule lines and entry dividers to the Provenance Ribbon"
```

---

### Task 4: Cache-bust, final verification, cleanup

**Files:**
- Modify: `index.html` (the `styles.css?v=` link tag)
- Modify: `sw.js` (the precache list entry and `CACHE_VERSION`)
- Delete: `verify/tmp-ribbon-check.js` (the temporary ad hoc script from Task 1 — never committed, cleanup only)

**Interfaces:**
- Consumes: nothing
- Produces: nothing (final task)

- [ ] **Step 1: Bump the styles.css cache-bust version**

In `index.html`, change:

```html
    <link rel="stylesheet" href="styles.css?v=88" />
```

to:

```html
    <link rel="stylesheet" href="styles.css?v=89" />
```

- [ ] **Step 2: Bump the same version in the service worker's precache list**

In `sw.js`, change:

```javascript
    "./styles.css?v=88",
```

to:

```javascript
    "./styles.css?v=89",
```

- [ ] **Step 3: Bump `CACHE_VERSION`**

In `sw.js`, change:

```javascript
var CACHE_VERSION = "bbs-v106";
```

to:

```javascript
var CACHE_VERSION = "bbs-v107";
```

- [ ] **Step 4: Run the full verification suite**

With `npx serve .` running:

```bash
node verify/smoke.js
```

Expected: all `PASS`, ending in a clean exit (exit code 0).

```bash
node verify/audit.js
```

Expected: `AUDIT: ALL GREEN` (this change is CSS-only, so the script-tag-order check and every other audit check are unaffected — this run just confirms nothing else regressed).

- [ ] **Step 5: Delete the temporary check script**

```bash
rm verify/tmp-ribbon-check.js
```

- [ ] **Step 6: Final commit**

```bash
git add index.html sw.js
git commit -m "Bump cache version for Provenance Ribbon polish"
```
