# Surprise Me Shuffle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Surprise Me" button to all three Cloth Room modes (single, compare, ensemble) that plays the app's measure-moment beat then reveals a random cloth pick, with ensemble mode always producing a full coordinated 3-piece look.

**Architecture:** No new state shape, no new view. A pure helper in fabric-visualiser.js picks cloth key(s) from the currently facet-filtered pool; the existing single delegated click handler in app.js applies them to the existing `appState` fields and calls the existing `render()`. A one-shot transient flag triggers a CSS reveal animation that reuses the project's existing `cardReveal` keyframe.

**Tech Stack:** Vanilla ES5 JS, string-concat HTML, CSS keyframes. No new dependencies.

## Global Constraints

- ES5 style: `var`, function declarations, string concatenation — no `let`/`const`/arrow functions/template literals (CLAUDE.md).
- All click handling goes through the single delegated `document.body` handler in app.js via `data-action` — never a second listener.
- Any file this plan touches that is cache-busted (`app.js`, `fabric-visualiser.js`, `styles.css`) must have its `?v=` bumped in `index.html` and `sw.js`, plus `sw.js`'s `CACHE_VERSION` bumped once, in the final task.
- Current versions confirmed in the worktree: `styles.css?v=86`, `app.js?v=87`, `fabric-visualiser.js?v=25`, `CACHE_VERSION = "bbs-v104"`.
- No unit test framework exists in this codebase (CLAUDE.md: "no unit tests, no CI"). Verification in this plan uses `node --check` for syntax and a manual Playwright pass against `npx serve .` at the end, per the project's actual Definition of Done — not invented unit tests.
- Copy: playful "wow" framing, no consultation language, no em-dashes in UI chrome strings (CLAUDE.md).

---

### Task 1: Random-pick helpers in fabric-visualiser.js

**Files:**
- Modify: `fabric-visualiser.js` (add two new functions near `getFilteredCloths`, after line 392)

**Interfaces:**
- Produces: `pickRandomKeys(cloths, count, excludeKeys)` → `string[]` of length `count` (cloth keys), `pickSurpriseEnsemble(pool)` → `{ fabrics: {jacket, vest, trousers}, feature: string }`
- Consumes: nothing new — cloth objects have `.key` and `.pattern` fields (cloth-data.js header), `VIS_ENS_GARMENTS` (existing global, `["jacket", "vest", "trousers"]`)

- [ ] **Step 1: Add the helpers**

Insert immediately after the closing `}` of `getFilteredCloths()` (currently ends at line 392, right before `function facetValueLabel`):

```javascript
// Cloth Room — Surprise Me. Picks `count` distinct cloths from `cloths`,
// preferring ones not in `excludeKeys` so a tap always changes what's
// showing. Falls back to the full pool if excluding leaves too few to
// fill `count`, and pads by repeating the last pick if `cloths` itself
// has fewer than `count` entries (e.g. a facet filtered down to one).
function pickRandomKeys(cloths, count, excludeKeys) {
    var pool = [];
    for (var i = 0; i < cloths.length; i++) {
        if (excludeKeys.indexOf(cloths[i].key) === -1) pool.push(cloths[i]);
    }
    if (pool.length < count) pool = cloths.slice();
    var picks = [];
    while (picks.length < count && pool.length) {
        picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0].key);
    }
    while (picks.length < count && picks.length) picks.push(picks[picks.length - 1]);
    return picks;
}

// Ensemble coordination: one garment (chosen at random) may get any
// cloth from the filtered pool; the other two are restricted to
// plain-pattern cloths (pattern === "none") so a loud pattern never
// doubles up across the outfit. Falls back to the full pool for the
// quiet slots if the current filter has no plain cloths at all.
function pickSurpriseEnsemble(pool) {
    var feature = VIS_ENS_GARMENTS[Math.floor(Math.random() * VIS_ENS_GARMENTS.length)];
    var featureKey = pickRandomKeys(pool, 1, [])[0];
    var quietPool = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].pattern === "none") quietPool.push(pool[i]);
    }
    if (!quietPool.length) quietPool = pool;
    var quietKeys = pickRandomKeys(quietPool, 2, [featureKey]);
    var fabrics = {};
    var qi = 0;
    for (var g = 0; g < VIS_ENS_GARMENTS.length; g++) {
        var garment = VIS_ENS_GARMENTS[g];
        fabrics[garment] = garment === feature ? featureKey : quietKeys[qi++];
    }
    return { fabrics: fabrics, feature: feature };
}
```

- [ ] **Step 2: Syntax check**

Run: `node --check fabric-visualiser.js`
Expected: no output (exit 0).

- [ ] **Step 3: Commit**

```bash
git add fabric-visualiser.js
git commit -m "Add Surprise Me pool-selection helpers to Cloth Room"
```

---

### Task 2: Wire the `vis-surprise-me` action in app.js

**Files:**
- Modify: `app.js:6943-6949` (insert a new `else if` branch between the existing `vis-ensemble-toggle` and `vis-ens-garment` branches)

**Interfaces:**
- Consumes: `pickRandomKeys`, `pickSurpriseEnsemble`, `getFilteredCloths`, `getVisEnsembleState`, `VIS_ENS_GARMENTS` (Task 1 and existing fabric-visualiser.js), `runMeasureMoment(label, done, ms)` (existing, app.js:3574), `render(options)` (existing, app.js:6157)
- Produces: `data-action="vis-surprise-me"` now handled

- [ ] **Step 1: Insert the handler**

Find this exact block (app.js, inside the delegated click handler):

```javascript
    else if (action === "vis-ensemble-toggle") {
        appState.visEnsemble = !appState.visEnsemble;
        if (appState.visEnsemble) appState.visCompare = false;
        localStorage.setItem("bbs_session", JSON.stringify(appState));
        render({ animate: true });
    }
    else if (action === "vis-ens-garment") {
```

Replace it with:

```javascript
    else if (action === "vis-ensemble-toggle") {
        appState.visEnsemble = !appState.visEnsemble;
        if (appState.visEnsemble) appState.visCompare = false;
        localStorage.setItem("bbs_session", JSON.stringify(appState));
        render({ animate: true });
    }
    else if (action === "vis-surprise-me") {
        var surprisePool = getFilteredCloths();
        if (!surprisePool.length) return;
        if (appState.visEnsemble) {
            var ensSurprise = getVisEnsembleState();
            var surprise = pickSurpriseEnsemble(surprisePool);
            ensSurprise.garments = VIS_ENS_GARMENTS.slice();
            ensSurprise.fabrics = surprise.fabrics;
            ensSurprise.activeGarment = surprise.feature;
        } else if (appState.visCompare) {
            var cmpCurrent = [];
            if (appState.visFabricKey) cmpCurrent.push(appState.visFabricKey);
            if (appState.visFabricKeyB) cmpCurrent.push(appState.visFabricKeyB);
            var cmpPicks = pickRandomKeys(surprisePool, 2, cmpCurrent);
            appState.visFabricKey = cmpPicks[0];
            appState.visFabricKeyB = cmpPicks[1];
        } else {
            var singleCurrent = appState.visFabricKey ? [appState.visFabricKey] : [];
            appState.visFabricKey = pickRandomKeys(surprisePool, 1, singleCurrent)[0];
        }
        appState.visSurpriseFlash = true;
        localStorage.setItem("bbs_session", JSON.stringify(appState));
        runMeasureMoment("Styling you a look…", function () { render({ animate: true }); }, 1500);
    }
    else if (action === "vis-ens-garment") {
```

- [ ] **Step 2: Syntax check**

Run: `node --check app.js`
Expected: no output (exit 0).

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "Handle vis-surprise-me action for Cloth Room shuffle"
```

---

### Task 3: Add the Surprise Me buttons and thread the reveal flag through rendering

**Files:**
- Modify: `fabric-visualiser.js` — `renderFabricVisualiser()` (~line 587), `renderClothCompare()` (~line 648), `renderClothEnsemble()` (~line 1716), plus the four toolbar locations identified below.

**Interfaces:**
- Consumes: `appState.visSurpriseFlash` (set by Task 2)
- Produces: `renderClothCompare(aKey, recommended, surpriseFlash)`, `renderClothEnsemble(recommended, surpriseFlash)` — signatures change, both callers updated in this task

- [ ] **Step 1: Read and clear the flash flag in `renderFabricVisualiser`, thread it down**

Find:
```javascript
function renderFabricVisualiser() {
    var recommended = getRecommendedFabricKeys();
```

Replace with:
```javascript
function renderFabricVisualiser() {
    var recommended = getRecommendedFabricKeys();
    var surpriseFlash = !!appState.visSurpriseFlash;
    appState.visSurpriseFlash = false;
```

Find:
```javascript
    if (appState.visEnsemble) return renderClothEnsemble(recommended);
    if (appState.visCompare) return renderClothCompare(activeKey, recommended);
```

Replace with:
```javascript
    if (appState.visEnsemble) return renderClothEnsemble(recommended, surpriseFlash);
    if (appState.visCompare) return renderClothCompare(activeKey, recommended, surpriseFlash);
```

Find (single-cloth mode's shell open):
```javascript
    return (
        '<div class="vis-shell">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
```

Replace with:
```javascript
    return (
        '<div class="vis-shell' + (surpriseFlash ? " vis-surprise-reveal" : "") + '">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
```

- [ ] **Step 2: Add the single-mode Surprise Me button**

Find:
```javascript
        '<div class="vis-mode-toggles">' +
        '<button class="vis-mode-toggle" data-action="vis-compare-toggle">Compare two cloths &rarr;</button>' +
        '<button class="vis-mode-toggle" data-action="vis-ensemble-toggle">Design an ensemble &rarr;</button>' +
        "</div>" +
```

Replace with:
```javascript
        '<div class="vis-mode-toggles">' +
        '<button class="vis-mode-toggle" data-action="vis-compare-toggle">Compare two cloths &rarr;</button>' +
        '<button class="vis-mode-toggle" data-action="vis-ensemble-toggle">Design an ensemble &rarr;</button>' +
        '<button class="vis-mode-toggle vis-surprise-btn" data-action="vis-surprise-me">Surprise Me</button>' +
        "</div>" +
```

- [ ] **Step 3: Thread the flag through `renderClothCompare` and add its button**

Find:
```javascript
function renderClothCompare(aKey, recommended) {
```
Replace with:
```javascript
function renderClothCompare(aKey, recommended, surpriseFlash) {
```

Find:
```javascript
    return (
        '<div class="vis-shell">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
        "<h1 class=\"vis-title\">Two Cloths, One Decision</h1>" +
```
Replace with:
```javascript
    return (
        '<div class="vis-shell' + (surpriseFlash ? " vis-surprise-reveal" : "") + '">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
        "<h1 class=\"vis-title\">Two Cloths, One Decision</h1>" +
```

Find:
```javascript
        '<button class="vis-mode-toggle" data-action="vis-compare-toggle">&larr; Back to one cloth</button>' +
        getVisFilterBarHTML() +
        '<div class="vis-swatch-tray">' + getVisSwatchesHTML(recommended, selKey, altKey) + "</div>" +
```
Replace with:
```javascript
        '<button class="vis-mode-toggle" data-action="vis-compare-toggle">&larr; Back to one cloth</button>' +
        '<button class="vis-mode-toggle vis-surprise-btn" data-action="vis-surprise-me">Surprise Me</button>' +
        getVisFilterBarHTML() +
        '<div class="vis-swatch-tray">' + getVisSwatchesHTML(recommended, selKey, altKey) + "</div>" +
```

- [ ] **Step 4: Thread the flag through `renderClothEnsemble` and add its button in both the empty and dressed states**

Find:
```javascript
function renderClothEnsemble(recommended) {
```
Replace with:
```javascript
function renderClothEnsemble(recommended, surpriseFlash) {
```

Find (empty-outfit branch):
```javascript
    if (!ens.garments.length) {
        return (
            '<div class="vis-shell ds-shell">' +
```
Replace with:
```javascript
    if (!ens.garments.length) {
        return (
            '<div class="vis-shell ds-shell' + (surpriseFlash ? " vis-surprise-reveal" : "") + '">' +
```

Find (dressed branch):
```javascript
    return (
        '<div class="vis-shell ds-shell">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
        "<h1 class=\"vis-title\">Design an Ensemble</h1>" +
```
Replace with:
```javascript
    return (
        '<div class="vis-shell ds-shell' + (surpriseFlash ? " vis-surprise-reveal" : "") + '">' +
        '<div class="vis-eyebrow">The Cloth Room</div>' +
        "<h1 class=\"vis-title\">Design an Ensemble</h1>" +
```

Find (this exact string appears twice — once in the empty-outfit branch, once in the dressed branch; both should get the Surprise Me button, so use a project-wide replace within this file for this one line):
```javascript
        '<button class="vis-mode-toggle" data-action="vis-ensemble-toggle">&larr; Back to one cloth</button>' +
```
Replace **both occurrences** with:
```javascript
        '<button class="vis-mode-toggle" data-action="vis-ensemble-toggle">&larr; Back to one cloth</button>' +
        '<button class="vis-mode-toggle vis-surprise-btn" data-action="vis-surprise-me">Surprise Me</button>' +
```

- [ ] **Step 5: Syntax check**

Run: `node --check fabric-visualiser.js`
Expected: no output (exit 0).

- [ ] **Step 6: Commit**

```bash
git add fabric-visualiser.js
git commit -m "Add Surprise Me button to all three Cloth Room modes"
```

---

### Task 4: Reveal animation CSS

**Files:**
- Modify: `styles.css` (add a new rule immediately after the existing `cardReveal` keyframe block, ~line 7806)

**Interfaces:**
- Consumes: existing `@keyframes cardReveal` (styles.css:7799-7802), existing `--ease-out` token, existing global `prefers-reduced-motion` kill rule (styles.css:7437-7443, already sets `animation-duration: 0.01ms !important` on `*` — no separate reduced-motion handling needed here)

- [ ] **Step 1: Add the rule**

Find:
```css
.arch-card-wrap {
    animation: cardReveal 0.8s var(--ease-out) 0.35s both;
}
```

Insert immediately after it:
```css
/* Cloth Room — Surprise Me reveal. Reuses cardReveal; the global
   prefers-reduced-motion rule above already neutralises this. */
.vis-surprise-reveal .vis-stage,
.vis-surprise-reveal .vis-split-stage,
.vis-surprise-reveal .vis-swatch-tray,
.vis-surprise-reveal .ds-stage {
    animation: cardReveal 0.6s var(--ease-out) both;
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "Add reveal animation for Cloth Room Surprise Me"
```

---

### Task 5: Cache-bust bump

**Files:**
- Modify: `index.html:18` (`styles.css?v=86` → `?v=87`), `index.html:349` (`app.js?v=87` → `?v=88`), `index.html:342` (`fabric-visualiser.js?v=25` → `?v=26`)
- Modify: `sw.js:14` (`./styles.css?v=86` → `?v=87`), `sw.js:34` (`./app.js?v=87` → `?v=88`), `sw.js:27` (`./fabric-visualiser.js?v=25` → `?v=26`), `sw.js:9` (`CACHE_VERSION = "bbs-v104"` → `"bbs-v105"`)

- [ ] **Step 1: Bump all six values listed above** (three in `index.html`, three plus `CACHE_VERSION` in `sw.js` — the values must match exactly between the two files or the service worker serves stale assets).

- [ ] **Step 2: Commit**

```bash
git add index.html sw.js
git commit -m "Bump cache version for Surprise Me changes"
```

---

### Task 6: Manual verification and final smoke run

**Files:** none (verification only)

- [ ] **Step 1: Serve and open the app**

Run: `npx serve .` (or the project's usual static server), open the Cloth Room.

- [ ] **Step 2: Single-cloth mode**

Tap Surprise Me. Confirm: measure-moment interstitial plays ("Styling you a look…"), a new cloth appears, tapping again never re-shows the same cloth twice in a row.

- [ ] **Step 3: Compare mode**

Switch to Compare, tap Surprise Me. Confirm: both sides get new, distinct cloths.

- [ ] **Step 4: Ensemble mode, empty outfit**

Reset session (double-tap logo) or clear `visEnsembleState`, enter ensemble mode with nothing added, tap Surprise Me. Confirm: all three garments (jacket, vest, trousers) appear dressed, at most one shows a patterned cloth (chalkstripe/pinstripe/windowpane/glen/houndstooth), the other two are plain.

- [ ] **Step 5: Ensemble mode, partially dressed**

Add one garment manually, dress it, then tap Surprise Me. Confirm: outfit still ends up fully dressed (three garments), coordination rule still holds.

- [ ] **Step 6: Reduced motion**

Enable "reduce motion" in OS/browser settings, repeat step 2. Confirm: cloth still changes, no visible animation glitch (the interstitial itself still plays, matching every other `runMeasureMoment` call in the app — this is existing, unchanged behavior).

- [ ] **Step 7: Regression pass**

Run: `node verify/smoke.js`
Expected: all checks pass, no console errors, no 4xx/5xx.

- [ ] **Step 8: Final commit if any fixes were needed during verification**

```bash
git add -A
git commit -m "Fix issues found in Surprise Me manual verification"
```
(Skip this step if verification passed with no changes needed.)
