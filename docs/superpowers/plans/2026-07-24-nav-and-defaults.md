# Nav & Defaults Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the BBS kiosk a persistent top Back/Home bar, a back-to-top button on long pages, a neutral-on-open Cloth Room, and no dead-end screens — all within the existing vanilla-JS app.

**Architecture:** App-shell chrome (`#topnav`, `#back-to-top`) lives as siblings of `#app` in `index.html`, shown/hidden by `render()` via a new `syncTopNav()` helper and a one-time passive scroll listener. Both buttons reuse the single delegated `data-action` click handler — no new click listeners. The Cloth Room's single-cloth entry renders a neutral "ghost" garment (a new `renderGarmentGhost()` mirroring `renderGarmentPhoto()` with a flat fill) until the first swatch tap.

**Tech Stack:** Vanilla ES5 JS (var, function declarations, string concatenation), CSS (layered, append-at-end), no build step. Verification: `node --check`, `node verify/smoke.js` (Playwright), manual iPad-viewport checks.

## Global Constraints

Copied verbatim from `CLAUDE.md` / the spec — every task's requirements include these:

- ES5 style only: `var`, function declarations, string concatenation. No `let`/`const`, arrow functions, template literals, classes, or modules. 4-space indent, double quotes in app.js/fabric-visualiser.js.
- **Exactly one** delegated `click` handler on `document.body`. Add interactions as new `data-action` branches. Never attach a second `click` listener. (Scroll/pointer listeners are allowed.)
- Any button that is a card/label/chrome/pill control carries **`.btn-bare`** to escape the `button:hover` invert trap; solid fills need `!important` to survive the maison-layer `button { background: transparent !important }` reset.
- Touch-first: ≥44px targets on coarse pointers, `touch-action: manipulation`, visible `:active` press state (cream flash, never white-on-white). All motion respects `prefers-reduced-motion`.
- styles.css: the **last** definition of a selector wins; do not add new `!important` layers when editing the winning block works — or append a new clearly-commented section at the end of the file.
- **Cache busting:** when `app.js` or `styles.css` change, bump their `?v=N` in `index.html`, bump the matching `?v=` entries in `sw.js`'s precache list, and bump `CACHE_VERSION` in `sw.js`.
- British English copy. No em-dashes in UI chrome strings.
- Definition of done: `node --check` on every touched `.js`; validator passes with zero console errors on load; `node verify/smoke.js` green.

---

## File Structure

- `index.html` — add `#topnav` and `#back-to-top` shell elements (siblings of `#app`); bump `?v=` for app.js + styles.css.
- `app.js` — add `syncTopNav()`, `scrollAppToTop()`, `armBackToTop()`; add `scroll-top` action branch; call `syncTopNav()` in both `render()` inject paths; remove generic bottom `.nav-buttons` clusters; reconcile screen-specific nav in the audit.
- `garment-photo.js` — add `renderGarmentGhost(canvas, garmentKey)`.
- `fabric-visualiser.js` — neutral entry in `renderFabricVisualiser()`; ghost branch in `applyGarmentPhotos()`; clear-neutral in `visApplyFabric()`; remove its 3 bottom `.nav-buttons` clusters.
- `lookbook.js`, `mill-map.js` — remove bottom `.nav-buttons` clusters.
- `styles.css` — append a new section: `#topnav`, `#back-to-top`, Cloth Room ghost/prompt; bump `?v=`.
- `sw.js` — bump `CACHE_VERSION` and `?v=` precache entries.
- `CHANGELOG.md` — add entry.

---

## Task 1: Persistent top nav bar

**Files:**
- Modify: `index.html` (after `#app-backdrop`, before `#app`, ~line 321)
- Modify: `app.js` (add helper near `syncFabVisibility`; call in `render()` at ~6053 and ~6085; add `scroll-top` is Task 2 — not here)
- Modify: `styles.css` (append new section at end)

**Interfaces:**
- Produces: `syncTopNav()` — reads `appState.view`, toggles `#topnav [hidden]` and `body.has-topnav`. Called by `render()`.
- Consumes: existing `navigateBack()`, `navigateHome()`, and the delegated handler branches `action === "back"` / `"home"` (app.js:6267-6268).

- [ ] **Step 1: Add the shell markup**

In `index.html`, change the App Root block (currently):
```html
    <canvas id="app-backdrop" aria-hidden="true"></canvas>
    <div id="app" role="main"></div>
```
to:
```html
    <canvas id="app-backdrop" aria-hidden="true"></canvas>
    <nav id="topnav" class="topnav" aria-label="Primary navigation" hidden>
        <button class="topnav-btn btn-bare" data-action="back">&larr; Back</button>
        <button class="topnav-btn btn-bare" data-action="home">Home</button>
    </nav>
    <div id="app" role="main"></div>
```

- [ ] **Step 2: Add `syncTopNav()` in app.js**

Add this function immediately above `function syncFabVisibility` (find it with grep `function syncFabVisibility`):
```javascript
// Persistent top nav: visible on every view except welcome/home, where
// there is nowhere to go up or back from the top of the app.
function syncTopNav() {
    var nav = document.getElementById("topnav");
    if (!nav) return;
    var hide = appState.view === "welcome" || appState.view === "home";
    nav.hidden = hide;
    document.body.classList.toggle("has-topnav", !hide);
}
```

- [ ] **Step 3: Call `syncTopNav()` from both render inject paths**

In `render()`, both places that call `syncFabVisibility();` (the non-animate path ~6056 and the animated path ~6088), add `syncTopNav();` on the line directly after each `syncFabVisibility();`.

- [ ] **Step 4: Add styles**

Append to the very end of `styles.css`:
```css
/* ============================================================
   Persistent top navigation (2026-07 nav & defaults)
   ============================================================ */
.topnav {
    position: sticky;
    top: 0;
    z-index: 400;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem 0.9rem;
    background: color-mix(in srgb, var(--bg, #eae5dd) 88%, transparent);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    border-bottom: 1px solid color-mix(in srgb, var(--ink, #111110) 10%, transparent);
}
.topnav[hidden] { display: none; }
.topnav-btn {
    min-height: 44px;
    padding: 0.4rem 1rem;
    font: inherit;
    font-family: var(--font-ui, Manrope, system-ui, sans-serif);
    font-size: 0.95rem;
    color: var(--ink, #111110);
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--ink, #111110) 18%, transparent);
    border-radius: 999px;
    touch-action: manipulation;
    cursor: pointer;
}
.topnav-btn:active { background: var(--bg, #eae5dd); }
@media (prefers-reduced-motion: reduce) {
    .topnav { -webkit-backdrop-filter: none; backdrop-filter: none; }
}
```
Note: if `color-mix` is not already used in this file, substitute a flat token (`var(--bg)` / `rgba(17,17,16,.1)`) to match the file's existing idiom — grep `color-mix` in styles.css first.

- [ ] **Step 5: Syntax check**

Run: `node --check app.js`
Expected: no output (exit 0).

- [ ] **Step 6: Verify in a browser**

Run: `npx serve .` (in the repo root), then open the served URL. Manually confirm:
- Welcome and Home: no top bar.
- Enter The Guide / The Cloth Room / any section: top bar visible at the top, pinned on scroll.
- Tap **Back**: returns to the previous view. Tap **Home**: returns to home and the bar disappears.
- No console errors.

- [ ] **Step 7: Commit**

```bash
git add index.html app.js styles.css
git commit -m "Add persistent top Back/Home nav bar"
```

---

## Task 2: Back-to-top button

**Files:**
- Modify: `index.html` (add `#back-to-top` after `#app`)
- Modify: `app.js` (add `scrollAppToTop()`, `armBackToTop()`, `scroll-top` action branch; arm the listener once)
- Modify: `styles.css` (append)

**Interfaces:**
- Consumes: `#back-to-top` element; `appState.view`.
- Produces: `scrollAppToTop()`; `armBackToTop()` (idempotent, attaches one passive scroll listener). Action `scroll-top` in the delegated handler.

- [ ] **Step 1: Add the button markup**

In `index.html`, immediately AFTER `<div id="app" role="main"></div>` add:
```html
    <button id="back-to-top" class="back-to-top btn-bare" data-action="scroll-top" aria-label="Back to top" hidden>&uarr; Top</button>
```

- [ ] **Step 2: Add scroll helpers in app.js**

Add directly below `syncTopNav()` from Task 1:
```javascript
function scrollAppToTop() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    } catch (e) {
        window.scrollTo(0, 0);
    }
}

// One passive scroll listener (never a click listener). Shows the
// back-to-top button once the page is scrolled and a top nav is present.
var _backToTopArmed = false;
function armBackToTop() {
    if (_backToTopArmed) return;
    _backToTopArmed = true;
    window.addEventListener("scroll", function () {
        var btn = document.getElementById("back-to-top");
        if (!btn) return;
        var navVisible = !(appState.view === "welcome" || appState.view === "home");
        btn.hidden = !(navVisible && window.pageYOffset > 400);
    }, { passive: true });
}
```

- [ ] **Step 3: Arm the listener and reset the button per view**

In `syncTopNav()` (Task 1), add before the closing brace so the button resets on every view change:
```javascript
    var btn = document.getElementById("back-to-top");
    if (btn) btn.hidden = true;
    armBackToTop();
```

- [ ] **Step 4: Add the `scroll-top` action branch**

In the delegated handler, directly after the `else if (action === "home") { navigateHome(); }` line (app.js:6268), add:
```javascript
    else if (action === "scroll-top") { scrollAppToTop(); }
```

- [ ] **Step 5: Add styles**

Append to the end of `styles.css`:
```css
/* Back-to-top: bottom-LEFT so it never collides with the discovery FAB
   (which floats bottom-right). */
.back-to-top {
    position: fixed;
    left: 1rem;
    bottom: 1rem;
    z-index: 390;
    min-height: 44px;
    padding: 0.5rem 1rem;
    font-family: var(--font-ui, Manrope, system-ui, sans-serif);
    font-size: 0.9rem;
    color: var(--ink, #111110);
    background: var(--surface, #fff) !important;
    border: 1px solid color-mix(in srgb, var(--ink, #111110) 18%, transparent);
    border-radius: 999px;
    box-shadow: 0 2px 10px rgba(17, 17, 16, 0.14);
    touch-action: manipulation;
    cursor: pointer;
}
.back-to-top[hidden] { display: none; }
.back-to-top:active { background: var(--bg, #eae5dd) !important; }
```

- [ ] **Step 6: Syntax check**

Run: `node --check app.js`
Expected: no output.

- [ ] **Step 7: Verify in a browser**

With `npx serve .` running, open a long view (e.g. a Guide topic or the Cloth Room), scroll down > 400px: the **↑ Top** button appears bottom-left, does not overlap the discovery FAB (bottom-right). Tap it: scrolls to the top where the nav bar sits. Scroll back to top: button hides. With OS "reduce motion" on, the scroll is instant. No console errors.

**Note:** if the button never appears, the app may scroll an inner container rather than the window. In that case, change the listener target and `scrollAppToTop()` to that container (grep for `overflow: auto`/`overflow-y` on the app wrapper). Confirm which element scrolls before finalising.

- [ ] **Step 8: Commit**

```bash
git add index.html app.js styles.css
git commit -m "Add back-to-top button for long pages"
```

---

## Task 3: Remove generic bottom nav clusters

**Files:**
- Modify: `app.js` (lines ~5250, ~5323, ~5532, ~5652)
- Modify: `fabric-visualiser.js` (lines 574, 646, 1643)
- Modify: `lookbook.js` (lines 268-269)
- Modify: `mill-map.js` (line 1017)

**Interfaces:** none produced. These are pure deletions; the top nav (Task 1) is the replacement escape route. Do NOT touch the archetype/onboarding/result/colour buttons (`arch-btn-*`, `colour-back`, `arch-restart`) or the worksheet empty-state CTA — those are handled in Task 5.

- [ ] **Step 1: Remove the four generic clusters in app.js**

Delete these exact fragments (each is one line in a concatenation; also remove the trailing `+` glue so the string still concatenates):

app.js ~5250 (renderGuideHome):
```javascript
        '<div class="nav-buttons"><button data-action="home">Home</button></div>' +
```
app.js ~5323 (renderGroup):
```javascript
        '<div class="nav-buttons"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
```
app.js ~5532 (renderTopic):
```javascript
        '<div class="nav-buttons" style="margin-top: 3rem;"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
```
app.js ~5652 (renderArchetypeGallery):
```javascript
    html += '<div class="gallery-nav"><button data-action="home">Home</button></div>';
```
For each: verify the surrounding concatenation still ends validly (the line before an interior removal must still be followed by its next `+ "..."` fragment; the final fragment of a return must end the string cleanly).

- [ ] **Step 2: Remove the three clusters in fabric-visualiser.js**

Delete this exact line at 574, 646, and 1643 (three occurrences), each with its trailing glue:
```javascript
        '<div class="nav-buttons"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
```

- [ ] **Step 3: Remove the lookbook cluster**

In `lookbook.js`, remove the nav-buttons wrapper (line 268) and the Home button it contains (line 269) — grep `nav-buttons` in lookbook.js and delete the whole `<div class="nav-buttons" ...>...</div>` construction (both the opening `html += '<div class="nav-buttons" ...';` and the following `html += '<button data-action="home">Back to Home</button>';` plus its closing `</div>` append).

- [ ] **Step 4: Remove the mill-map cluster**

In `mill-map.js` line 1017, delete:
```javascript
        '<div class="nav-buttons"><button data-action="back">Back</button><button data-action="home">Home</button></div>' +
```

- [ ] **Step 5: Syntax check all touched files**

Run: `node --check app.js && node --check fabric-visualiser.js && node --check lookbook.js && node --check mill-map.js`
Expected: no output (a broken concatenation throws here).

- [ ] **Step 6: Confirm no generic clusters remain**

Run (Grep tool or): search for `class="nav-buttons"` across `*.js`.
Expected: only the worksheet empty-state at app.js:4637 remains (kept intentionally, addressed in Task 5). No others.

- [ ] **Step 7: Verify in a browser**

With `npx serve .`, open The Guide (list + a topic), the Archetype Gallery, the Cloth Room (single/compare/ensemble), the Lookbook, and the Mill Map. Confirm: no bottom Back/Home buttons; the top nav is the escape on each; no layout gap where they were; no console errors.

- [ ] **Step 8: Commit**

```bash
git add app.js fabric-visualiser.js lookbook.js mill-map.js
git commit -m "Remove redundant bottom Back/Home clusters (top nav replaces them)"
```

---

## Task 4: Cloth Room opens neutral (ghost garment)

**Files:**
- Modify: `garment-photo.js` (add `renderGarmentGhost` after line 253)
- Modify: `fabric-visualiser.js` (`renderFabricVisualiser` 544-576; `applyGarmentPhotos` ~1537-1544; `visApplyFabric` 791-808)
- Modify: `styles.css` (append ghost/prompt styles)

**Interfaces:**
- Produces: `window.renderGarmentGhost(canvas, garmentKey)` — draws the garment silhouette in a neutral fill (no cloth).
- Consumes: existing `garmentImages`, `loadGarmentImage`, `renderGarmentPhoto`, `fabricResolves`, `getVisSwatchesHTML`, `visApplyFabric`.

- [ ] **Step 1: Add `renderGarmentGhost` in garment-photo.js**

Immediately after `window.renderGarmentPhoto = renderGarmentPhoto;` (line 255), add:
```javascript
// Neutral "ghost" of a garment: the same photo pipeline as renderGarmentPhoto
// but with a flat cloth-free fill, so the Cloth Room can show the bare shape
// before the client has chosen a cloth. Keeps the drape multiply + alpha clip
// so it reads as a garment, not a slab.
function renderGarmentGhost(canvas, garmentKey) {
    var img = garmentImages[garmentKey];
    if (!img) { loadGarmentImage(garmentKey, function () {
        renderGarmentGhost(canvas, garmentKey);
    }); return false; }

    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Flat neutral fill (a step off the cream background so the shape reads).
    ctx.fillStyle = "#d7d1c7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Multiply the drape for form.
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Clip to the garment's alpha.
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "source-over";
    return true;
}
window.renderGarmentGhost = renderGarmentGhost;
```

- [ ] **Step 2: Render the neutral entry state**

In `renderFabricVisualiser()` (fabric-visualiser.js:544), after the two `fabricResolves` guards (line 549) and before `var activeKey = ...` (line 550), add:
```javascript
    var hasSelection = fabricResolves(appState.visFabricKey);
```
Then replace the single-cloth `return (...)` block (lines 555-576). Change the stage/canvas/info to branch on `hasSelection`. Specifically:

Replace the stage line (561-563):
```javascript
        '<div class="vis-stage vis-stage--photo">' +
        '<canvas class="vis-jacket-canvas" id="vis-jacket-canvas" width="644" height="800"' +
        ' data-garment-key="jacket-sb" data-cloth="' + activeKey + '"></canvas>' +
        "</div>" +
```
with:
```javascript
        '<div class="vis-stage vis-stage--photo' + (hasSelection ? "" : " vis-stage--empty") + '">' +
        '<canvas class="vis-jacket-canvas" id="vis-jacket-canvas" width="644" height="800"' +
        ' data-garment-key="jacket-sb" data-ghost="' + (hasSelection ? "0" : "1") + '" data-cloth="' + (hasSelection ? activeKey : "") + '"></canvas>' +
        (hasSelection ? "" : '<p class="vis-ghost-prompt">Pick a cloth to see it come to life.</p>') +
        "</div>" +
```
Replace the lead copy (559) so it guides when empty:
```javascript
        '<p class="vis-lead">Select a cloth from the bunch. The garment re-renders instantly, the way it would leave the workshop.</p>' +
```
with:
```javascript
        '<p class="vis-lead">' + (hasSelection ? "Select a cloth from the bunch. The garment re-renders instantly, the way it would leave the workshop." : "Filter the bunch and tap a cloth. The jacket dresses itself the moment you choose.") + "</p>" +
```
Update the swatch tray call (565) so nothing is pre-selected when empty:
```javascript
        '<div class="vis-swatch-tray">' + getVisSwatchesHTML(recommended, activeKey, null) + "</div>" +
```
with:
```javascript
        '<div class="vis-swatch-tray">' + getVisSwatchesHTML(recommended, hasSelection ? activeKey : null, null) + "</div>" +
```
Update the info + cloth-study block (571-572) to render only when a cloth is chosen:
```javascript
        '<div class="vis-info" id="vis-info">' + getFabricInfoHTML(fabric) + "</div>" +
        (typeof getClothStudyHTML === "function" ? getClothStudyHTML(fabric) : "") +
```
with:
```javascript
        '<div class="vis-info" id="vis-info">' + (hasSelection ? getFabricInfoHTML(fabric) : "") + "</div>" +
        (hasSelection && typeof getClothStudyHTML === "function" ? getClothStudyHTML(fabric) : "") +
```

- [ ] **Step 3: Ghost-render the empty canvas in `applyGarmentPhotos`**

Find `applyGarmentPhotos` (fabric-visualiser.js ~1537). Its loop body currently is:
```javascript
        var key = c.getAttribute("data-garment-key");
        var cloth = c.getAttribute("data-cloth");
        if (key && cloth) renderGarmentPhoto(c, key, cloth);
```
Replace the `if` line with:
```javascript
        if (key && cloth) renderGarmentPhoto(c, key, cloth);
        else if (key && c.getAttribute("data-ghost") === "1" && typeof renderGarmentGhost === "function") renderGarmentGhost(c, key);
```

- [ ] **Step 4: Clear the neutral state on first swatch tap**

`visApplyFabric(key)` (fabric-visualiser.js:791) does a partial update and must also drop the empty-state marker and prompt. Add at the top of the function body (right after `function visApplyFabric(key) {`):
```javascript
    var stage = document.querySelector(".vis-stage--empty");
    if (stage) {
        stage.classList.remove("vis-stage--empty");
        var prompt = stage.querySelector(".vis-ghost-prompt");
        if (prompt) prompt.parentNode.removeChild(prompt);
    }
```
Also, inside `visApplyFabric`, the canvas must lose its ghost flag so a later repaint dresses it. After `canvas.setAttribute("data-cloth", key);` (line 794) add:
```javascript
        canvas.setAttribute("data-ghost", "0");
```

- [ ] **Step 5: Add ghost/prompt styles**

Append to the end of `styles.css`:
```css
/* Cloth Room neutral entry (2026-07). The ghost garment is drawn on the
   canvas; this just floats the invitation over the empty stage. */
.vis-stage--empty { position: relative; }
.vis-ghost-prompt {
    position: absolute;
    left: 50%;
    bottom: 8%;
    transform: translateX(-50%);
    margin: 0;
    padding: 0.5rem 1rem;
    font-family: var(--font-ui, Manrope, system-ui, sans-serif);
    font-size: 0.95rem;
    color: var(--ink, #111110);
    background: color-mix(in srgb, var(--surface, #fff) 82%, transparent);
    border-radius: 999px;
    text-align: center;
    pointer-events: none;
}
```

- [ ] **Step 6: Syntax check**

Run: `node --check garment-photo.js && node --check fabric-visualiser.js`
Expected: no output.

- [ ] **Step 7: Verify in a browser**

With `npx serve .`, open The Cloth Room fresh (clear localStorage first via the app's double-tap-logo reset, or DevTools → clear `bbs_session`). Confirm:
- The jacket shows as a neutral ghost silhouette (not a cloth, not blank), with the prompt "Pick a cloth to see it come to life."
- No cloth swatch is marked selected; the info card and cloth-study block are absent.
- Tap a swatch: the jacket dresses in that cloth, the prompt disappears, the info + study appear.
- Reload the page: the chosen cloth persists (no reset to ghost).
- Compare and Ensemble modes still open dressed as before (unchanged).
- No console errors.

- [ ] **Step 8: Commit**

```bash
git add garment-photo.js fabric-visualiser.js styles.css
git commit -m "Cloth Room opens neutral with a ghost garment until first pick"
```

---

## Task 5: Dead-end audit + reconcile screen nav

**Files:**
- Modify: `app.js` (only where the audit finds a fix is needed — candidates below)
- Create: findings noted in the commit message / PR body

**Interfaces:** none. This task verifies every view is escapable and reconciles screen-specific nav now that a global top bar exists.

- [ ] **Step 1: Walk every view for an escape route**

With `npx serve .` and the top nav live, visit every `case` in the `render()` switch (grep `case "` in the `render` function) and every feature view: welcome, home, discover (quiz), onboarding, result, worksheet, guide (home/group/topic), archetype gallery + detail, colour direction (quiz + result), cloth room (single/compare/ensemble), lookbook, mill map. For each, confirm there is a visible way back (top nav Back/Home, or a contextual button). Record any screen with no escape.

- [ ] **Step 2: Reconcile now-redundant screen nav**

Inspect these screen-specific controls and decide keep vs remove (a global top Back/Home now exists):
- `arch-btn-back` / `arch-btn-home` on onboarding (app.js:3983-3986) and result (app.js:4358).
- `colour-back` / `home` on the colour result (app.js:7227-7230). **Keep `colour-back`** — it is colour-quiz-specific stepping, not generic Back — but the adjacent generic `home` button is now redundant; remove that one button only.
- `arch-restart` "Back to Home" on the colour flow (app.js:7101) and "Start Over" (app.js:4624) — these are semantic CTAs (restart), **keep**.
- Worksheet empty-state (app.js:4637) — the `Back to Home` here is the screen's only CTA; **keep** (harmless with top nav; it is a call-to-action, not chrome).

Rule of thumb: remove a button only if it duplicates the global Back/Home with identical behaviour; keep anything with distinct semantics (restart, colour-back, complete-the-quiz CTA). Make the minimal removals decided above, preserving valid concatenation and `.btn-bare` on any button left in place.

- [ ] **Step 3: Syntax check**

Run: `node --check app.js`
Expected: no output.

- [ ] **Step 4: Verify**

Re-walk the views from Step 1. Confirm: no dead-ends; no screen shows two identical Back or two identical Home controls; quiz Back still steps to the previous question; result Back still goes to onboarding; colour-back still steps within the colour quiz. No console errors.

- [ ] **Step 5: Commit (with findings in the message)**

```bash
git add app.js
git commit -m "Dead-end audit: reconcile screen nav with global top bar

Findings: <one line per view checked and its escape route; note any removals>"
```

---

## Task 6: Cache bump, changelog, full smoke

**Files:**
- Modify: `index.html` (`app.js?v=`, `styles.css?v=`)
- Modify: `sw.js` (`CACHE_VERSION`, `?v=` precache entries)
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Bump versions**

In `index.html`, increment `N` in `app.js?v=N` and `styles.css?v=N`. In `sw.js`, increment `CACHE_VERSION` (e.g. `bbs-v77` → `bbs-v78`) and update the matching `app.js?v=` / `styles.css?v=` entries in the precache list to the same numbers. Grep `?v=` in both files to catch every occurrence.

- [ ] **Step 2: Update the changelog**

Add a dated entry to `CHANGELOG.md` summarising: persistent top Back/Home bar; back-to-top button; bottom nav clusters removed; Cloth Room opens neutral (ghost garment); dead-end audit.

- [ ] **Step 3: Run the full smoke harness**

Run (see `verify/smoke.js` header for setup — `npx serve .` in one shell, then):
```
npm i --no-save playwright
node verify/smoke.js
```
Expected: all checks pass (load + validator, all menu entries, both quizzes to result, worksheet, dossier export, offline boot); exits 0 with no console error or 4xx/5xx reported.

- [ ] **Step 4: Confirm cache correctness**

Grep `?v=` in `index.html` and `sw.js`; confirm the `app.js` and `styles.css` version numbers match across both files and `CACHE_VERSION` was bumped.

- [ ] **Step 5: Commit**

```bash
git add index.html sw.js CHANGELOG.md
git commit -m "Bump cache version and changelog for nav & defaults"
```

- [ ] **Step 6: Final review before merge**

Confirm `node verify/smoke.js` is green and the branch is ready. Do NOT merge to `master` or push without the founder's go-ahead (GitHub Pages serves `master` live).

---

## Self-Review

**Spec coverage:**
- Spec Part A (top nav) → Task 1. ✓
- Spec Part B (back-to-top, remove bottom nav) → Task 2 (button) + Task 3 (removal). ✓
- Spec Part C (Cloth Room neutral / ghost) → Task 4. ✓
- Spec Part D (dead-end audit) → Task 5. ✓
- Spec verification/cache-busting/changelog → Task 6 + per-task `node --check` and browser checks. ✓

**Type/name consistency:** `syncTopNav`, `scrollAppToTop`, `armBackToTop`, `renderGarmentGhost`, `visApplyFabric`, `applyGarmentPhotos`, `data-ghost`, `vis-stage--empty`, `vis-ghost-prompt`, action `scroll-top` — used consistently across tasks. `renderGarmentGhost` is defined in Task 4 Step 1 and consumed in Steps 3-4. ✓

**Placeholder scan:** no TBD/TODO; every code step shows real code; verification steps give exact commands and expected results. The two spec-flagged "confirm in browser" notes (which element scrolls; ghost visual) are attached to concrete default implementations plus a fallback, not left open. ✓
