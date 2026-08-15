# Archetype Gallery Guided Tour Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Take the Tour" button to the Archetype Gallery's grid/stacked listing that cycles through all 24 archetypes as a paced, cinematic flythrough, mirroring the Mill Map's "Take the Tour" globe tour.

**Architecture:** A new module-scope state object (`_archTourState`) and three functions (`startArchTour`, `advanceArchTour`, `stopArchTour`) live in app.js alongside the rest of the Gallery code. A full-screen overlay renders unconditionally inside `renderArchetypeGallery()`'s returned HTML (hidden by default via CSS), and `startArchTour()`/`stopArchTour()` toggle its visibility and populate its content by direct DOM update — `render()` never needs to know a tour is running. Pacing is a plain `setTimeout`, re-armed on every advance; there is no continuous rendering loop to hang a dwell timer off, unlike the Mill Map's globe.

**Tech Stack:** Vanilla ES5 JS (`var`, function declarations, string-concatenated HTML), vanilla CSS. No build step, no new files, no new dependencies.

## Global Constraints

- No new file — all code lives in app.js (with the rest of the Gallery) and styles.css, matching how the Mill Map tour lives in mill-map.js rather than a separate file.
- The tour never touches `appState` — no `appState.galleryKey`, no `appState.history`, no `localStorage` writes. State lives only in the module-scope `_archTourState`.
- Tour order is `Object.keys(archetypeProfiles)`, unmodified — no curation, no re-sequencing, all 24 stops.
- Dwell is `ARCH_TOUR_DWELL_MS = 4000` (same value the Mill Map tour uses), via `setTimeout`, not `requestAnimationFrame`.
- Per-stop content is exactly: the archetype's mark via `getGalleryMarkHTML(archetype, index, true)`, `archetype.name`, `archetype.sub`, and a counter formatted `("0" + (pos + 1)).slice(-2) + " / " + allKeys.length` (the same format `renderArchetypeDetail()` already uses). Nothing else — no tags, no core-principles copy.
- Entrance animation reuses the existing `cardReveal` keyframe (styles.css, `@keyframes cardReveal` at the top of the ARCHETYPE GALLERY section) — do not add a new keyframe. The sitewide `@media (prefers-reduced-motion: reduce)` rule (styles.css:2452) already collapses all `animation-duration`/`animation-delay` to near-zero, so no explicit reduced-motion branching is needed in JS for the entrance animation — this is the same mechanism the "Cloth Room — Surprise Me reveal" comment in styles.css documents for `.vis-surprise-reveal`. The dwell/advance timing is JS-driven `setTimeout` and is unaffected by CSS either way, so pacing stays identical under reduced motion automatically.
- `advanceArchTour()` is the single function both the dwell timeout and tap-to-skip call. It always clears any pending timeout before doing anything else (so a tap immediately before the timer would have fired cannot double-advance), then increments the index. If the new index is past the last stop, it calls `stopArchTour()` instead of advancing to a 25th slide or looping back to the first — this is a one-pass flythrough, not a loop.
- Tap-to-skip is a raw `pointerup` listener added to the slide content element (`#arch-tour-slide`) only while touring — added in `startArchTour()`, removed in `stopArchTour()` — per CLAUDE.md's documented exception for gestures that live outside the single delegated `data-action` handler. It is scoped to the slide content specifically, not the whole overlay, so it never competes with the Exit button.
- Start/Exit are wired as normal `data-action="arch-tour-start"` / `data-action="arch-tour-exit"` branches in the single delegated click handler in app.js (same pattern as `mill-tour-start` / `mill-tour-exit`).
- The "Take the Tour" button appears only on the Gallery's grid/stacked listing, never on the archetype detail page — satisfied automatically because the overlay and button markup are only added in `renderArchetypeGallery()`'s listing branch, not in `renderArchetypeDetail()`.
- Bump `app.js`'s `?v=` in index.html (currently `93` → `94`) and the matching entry in sw.js's `PRECACHE` array, plus `styles.css?v=` (currently `93` → `94`) in both places, plus `CACHE_VERSION` in sw.js (currently `"bbs-v116"` → `"bbs-v117"`).

---

## Task 1: Tour state, overlay markup, wiring, and styling

**Files:**
- Modify: `app.js:5806-5807` (insert new state/functions before `getGalleryMarkHTML`)
- Modify: `app.js:5845-5850` (insert "Take the Tour" button into the listing)
- Modify: `app.js:5877-5883` (insert overlay markup at the end of `renderArchetypeGallery()`)
- Modify: `app.js:6956-6961` (insert `arch-tour-start` / `arch-tour-exit` data-action branches)
- Modify: `styles.css:11408-11416` (insert new CSS block)

**Interfaces:**
- Consumes: `archetypeProfiles` (global object keyed by archetype key, each value has `.key`, `.name`, `.sub`), `getGalleryMarkHTML(archetype, index, large)` (existing function, app.js:5808).
- Produces: `startArchTour()`, `stopArchTour()`, `advanceArchTour()` — called from the delegated click handler and from the tap-to-skip listener. No other task depends on these beyond that wiring, all done in this task.

- [ ] **Step 1: Add the tour state and functions to app.js**

Insert this block between the end of `isLightHex()` (app.js:5806, the line reading `}`) and the start of `getGalleryMarkHTML` (app.js:5808):

```js
// ============================================
// ARCHETYPE GALLERY GUIDED TOUR — "Take the Tour" cycles through all 24
// archetypes as a paced flythrough, mirroring the Mill Map's globe tour
// (mill-map.js, startMillTour()). Entirely transient: state lives only
// in this module-scope var, never appState, so browsing away and back
// never finds a tour "resuming" and normal listing/detail navigation is
// unaffected. Pacing is a plain setTimeout rather than the globe's
// rAF-driven dwell — the Gallery has no continuous rendering loop to
// hang a timer off, so nothing here needs one just to pace four seconds.
// ============================================
var _archTourState = null;
var ARCH_TOUR_DWELL_MS = 4000;

function startArchTour() {
    var overlay = document.getElementById("arch-tour-overlay");
    var slide = document.getElementById("arch-tour-slide");
    if (!overlay || !slide) return;
    _archTourState = {
        active: true,
        order: Object.keys(archetypeProfiles),
        index: -1,
        timeoutId: null
    };
    overlay.classList.add("active");
    slide.addEventListener("pointerup", archTourSlideTap);
    advanceArchTour();
}

function stopArchTour() {
    var overlay = document.getElementById("arch-tour-overlay");
    var slide = document.getElementById("arch-tour-slide");
    if (_archTourState && _archTourState.timeoutId) clearTimeout(_archTourState.timeoutId);
    if (overlay) overlay.classList.remove("active");
    if (slide) slide.removeEventListener("pointerup", archTourSlideTap);
    _archTourState = null;
}

function archTourSlideTap() {
    advanceArchTour();
}

// Called by the dwell timeout and by tap-to-skip alike. Always clears
// any pending timeout first, so a tap immediately before the timer was
// due cannot cause a double-advance.
function advanceArchTour() {
    if (!_archTourState) return;
    if (_archTourState.timeoutId) clearTimeout(_archTourState.timeoutId);
    _archTourState.index++;
    if (_archTourState.index >= _archTourState.order.length) {
        stopArchTour();
        return;
    }
    var slide = document.getElementById("arch-tour-slide");
    if (!slide) { stopArchTour(); return; }
    var key = _archTourState.order[_archTourState.index];
    var archetype = archetypeProfiles[key];
    var counter = ("0" + (_archTourState.index + 1)).slice(-2) + " / " + _archTourState.order.length;
    slide.innerHTML =
        '<span class="arch-tour-counter">' + counter + "</span>" +
        getGalleryMarkHTML(archetype, _archTourState.index, true) +
        '<h2 class="arch-tour-name">' + archetype.name + "</h2>" +
        '<p class="arch-tour-sub">' + archetype.sub + "</p>";
    _archTourState.timeoutId = setTimeout(advanceArchTour, ARCH_TOUR_DWELL_MS);
}
```

- [ ] **Step 2: Verify syntax**

Run: `node --check app.js`
Expected: no output (exit code 0).

- [ ] **Step 3: Add the "Take the Tour" button to the listing**

In `renderArchetypeGallery()`, the view-toggle block currently reads (app.js:5845-5850):

```js
    html += '<div class="gallery-view-toggle" role="group" aria-label="Gallery layout">';
    html += '<button class="gallery-view-btn' + (stacked ? "" : " sel") + '" data-action="gallery-view" data-view="grid" aria-pressed="' + (!stacked) + '">Grid</button>';
    html += '<button class="gallery-view-btn' + (stacked ? " sel" : "") + '" data-action="gallery-view" data-view="stack" aria-pressed="' + stacked + '">Stacked</button>';
    html += "</div>";

    html += '<div class="' + (stacked ? "gallery-stack" : "gallery-grid") + '">';
```

Change it to insert the tour button between the view toggle and the grid/stack container:

```js
    html += '<div class="gallery-view-toggle" role="group" aria-label="Gallery layout">';
    html += '<button class="gallery-view-btn' + (stacked ? "" : " sel") + '" data-action="gallery-view" data-view="grid" aria-pressed="' + (!stacked) + '">Grid</button>';
    html += '<button class="gallery-view-btn' + (stacked ? " sel" : "") + '" data-action="gallery-view" data-view="stack" aria-pressed="' + stacked + '">Stacked</button>';
    html += "</div>";

    html += '<button class="gallery-tour-btn" type="button" data-action="arch-tour-start">Take the Tour</button>';

    html += '<div class="' + (stacked ? "gallery-stack" : "gallery-grid") + '">';
```

- [ ] **Step 4: Add the overlay markup at the end of `renderArchetypeGallery()`**

The end of the function currently reads (app.js:5877-5883):

```js
        html += "</div>";
    }
    html += "</div></div>";

    html += "</div>";
    return html;
}
```

Change it to insert the overlay before the final closing `</div>`:

```js
        html += "</div>";
    }
    html += "</div></div>";

    html += '<div class="arch-tour-overlay" id="arch-tour-overlay">' +
        '<div class="arch-tour-slide" id="arch-tour-slide"></div>' +
        '<div class="arch-tour-controls">' +
        '<button class="arch-tour-exit" type="button" data-action="arch-tour-exit">Exit Tour</button>' +
        "</div></div>";

    html += "</div>";
    return html;
}
```

- [ ] **Step 5: Verify syntax**

Run: `node --check app.js`
Expected: no output (exit code 0).

- [ ] **Step 6: Wire the data-action branches**

The delegated click handler currently has (app.js:6956-6961):

```js
    if (action === "gallery-view") {
        appState.galleryStacked = target.dataset.view === "stack";
        localStorage.setItem("bbs_session", JSON.stringify(appState));
        render({ animate: false });
    }
    if (action === "dd-toggle") {
```

Change it to add the two new branches:

```js
    if (action === "gallery-view") {
        appState.galleryStacked = target.dataset.view === "stack";
        localStorage.setItem("bbs_session", JSON.stringify(appState));
        render({ animate: false });
    }
    else if (action === "arch-tour-start") {
        startArchTour();
    }
    else if (action === "arch-tour-exit") {
        stopArchTour();
    }
    if (action === "dd-toggle") {
```

- [ ] **Step 7: Verify syntax**

Run: `node --check app.js`
Expected: no output (exit code 0).

- [ ] **Step 8: Add the CSS**

In styles.css, the gallery view-toggle block currently ends at line 11414 (`.gallery-view-btn:focus-visible { outline: 2px solid var(--bronze); outline-offset: 2px; }`) followed by a blank line and then `.gallery-stack {` at line 11416. Insert this new block between them:

```css
.gallery-tour-btn {
    display: block;
    width: max-content;
    margin: 0 auto 1.8rem;
}

/* Archetype Gallery guided tour — mirrors the Mill Map's "Take the Tour"
   (map-tour-* above, mill-map.js startMillTour()): a full-screen paced
   flythrough of all 24 marks, hidden by default and revealed by adding
   .active. z-index sits above the discovery panel (1000) and the toast
   layer (999) so the tour is never partially obscured. */
.arch-tour-overlay {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 2000;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    background: var(--bg);
    text-align: center;
    padding: 2rem;
}

.arch-tour-overlay.active {
    display: flex;
}

.arch-tour-slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    max-width: 26rem;
}

.arch-tour-slide > * {
    animation: cardReveal 0.5s var(--ease-out) both;
}
.arch-tour-slide > *:nth-child(1) { animation-delay: 0s; }
.arch-tour-slide > *:nth-child(2) { animation-delay: 0.08s; }
.arch-tour-slide > *:nth-child(3) { animation-delay: 0.16s; }
.arch-tour-slide > *:nth-child(4) { animation-delay: 0.24s; }

.arch-tour-counter {
    font-family: "Manrope", sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--bronze);
    font-variant-numeric: tabular-nums;
}

.arch-tour-name {
    margin: 0;
    font-family: "EB Garamond", Georgia, serif;
    font-size: 1.8rem;
    color: var(--text);
}

.arch-tour-sub {
    margin: 0;
    font-family: "Manrope", sans-serif;
    font-size: 0.85rem;
    color: var(--soft);
}

.arch-tour-controls {
    display: flex;
    justify-content: center;
}
```

- [ ] **Step 9: Manual verification**

Start a static server (`npx serve .` from the repo root) and open the app in a browser.

1. Navigate to the Archetype Gallery (Home → The Archetype Gallery, or whichever entry point the current build uses).
2. Confirm a "Take the Tour" button appears below the Grid/Stacked toggle, above the archetype cards.
3. Tap it. Confirm the overlay covers the full screen, showing the first archetype's mark, name, sub, and "01 / 24".
4. Wait ~4 seconds without touching anything. Confirm it auto-advances to "02 / 24" with a new mark/name/sub, and the content animates in (fades/slides up).
5. Tap anywhere on the slide content (not the Exit button). Confirm it advances immediately, without waiting for the remaining dwell time.
6. Tap Exit mid-tour. Confirm the overlay disappears and the Gallery listing (grid or stacked, whichever was active) is exactly as it was before the tour started.
7. Let a tour run all the way to "24 / 24" and past its dwell (or repeatedly tap-to-skip to get there quickly). Confirm it exits automatically after the 24th stop — no 25th slide, no loop back to stop 1.
8. Open DevTools → Application → Local Storage, note the `bbs_session` value, run a full tour start-to-finish, and re-check `bbs_session`. Confirm it is byte-for-byte unchanged (aside from anything else you were doing before starting the tour) — the tour must never write to `appState`.
9. Navigate to an individual archetype's detail page (tap a card, or use Next/Prev). Confirm no "Take the Tour" button appears there.
10. In DevTools, enable "Emulate CSS prefers-reduced-motion: reduce", reload, and repeat steps 2-4. Confirm the tour still advances every ~4 seconds (same pacing) but the slide-in animation is effectively instant (no visible fade/slide).
11. Check the browser console throughout — confirm no errors at any point in steps 2-10.

- [ ] **Step 10: Commit**

```bash
git add app.js styles.css
git commit -m "$(cat <<'EOF'
Add Archetype Gallery guided tour

Mirrors the Mill Map's "Take the Tour": a full-screen, paced flythrough
of all 24 archetypes with tap-to-skip and an Exit control. State is
transient (module-scope, never appState) and pacing is a plain
setTimeout re-armed on every advance — the Gallery has no continuous
render loop to hang a dwell timer off the way the globe does.
EOF
)"
```

---

## Task 2: Cache-busting and shipping checklist

**Files:**
- Modify: `index.html:18` (styles.css `?v=`)
- Modify: `index.html:351` (app.js `?v=`)
- Modify: `sw.js:9` (`CACHE_VERSION`)
- Modify: `sw.js:14` (styles.css precache entry)
- Modify: `sw.js:36` (app.js precache entry)

**Interfaces:**
- Consumes: nothing from Task 1's code — this task only bumps version strings and runs the project's existing verification scripts.
- Produces: nothing consumed by a later task; this is the final task.

- [ ] **Step 1: Bump index.html's cache-busting params**

In `index.html`, change:

```html
    <link rel="stylesheet" href="styles.css?v=93" />
```

to:

```html
    <link rel="stylesheet" href="styles.css?v=94" />
```

And change:

```html
    <script src="app.js?v=93"></script>
```

to:

```html
    <script src="app.js?v=94"></script>
```

- [ ] **Step 2: Bump sw.js's precache list and CACHE_VERSION**

In `sw.js`, change:

```js
var CACHE_VERSION = "bbs-v116";
```

to:

```js
var CACHE_VERSION = "bbs-v117";
```

Change:

```js
    "./styles.css?v=93",
```

to:

```js
    "./styles.css?v=94",
```

Change:

```js
    "./app.js?v=93",
```

to:

```js
    "./app.js?v=94",
```

- [ ] **Step 3: Verify syntax**

Run: `node --check sw.js`
Expected: no output (exit code 0).

- [ ] **Step 4: Run the data/structure audit**

Run: `node verify/audit.js`
Expected: exits clean (this task touches no data.js content or script load order, so this should be unaffected — it's a regression check).

- [ ] **Step 5: Run the smoke harness**

From the repo root:

```bash
npx serve .
```

In a second terminal (with the server still running):

```bash
npm i --no-save playwright
node verify/smoke.js
```

Expected: exits clean, no console errors, no 4xx/5xx responses. (`verify/smoke.js` does not have Gallery/tour-specific coverage — this run is the project's standard regression net per CLAUDE.md's Definition of Done, not new coverage for this feature. Manual verification of the tour itself happened in Task 1, Step 9.)

- [ ] **Step 6: Confirm the app loads offline with the new cache version**

With the dev server still running and the page loaded once (so the service worker installs), in DevTools → Application → Service Workers, confirm the active worker's cache key is `bbs-v117`. Toggle DevTools' "Offline" checkbox, reload the page, and confirm the app still loads and the Archetype Gallery (including the new tour button) still works.

- [ ] **Step 7: Commit**

```bash
git add index.html sw.js
git commit -m "$(cat <<'EOF'
Bump cache version for the Archetype Gallery tour

app.js and styles.css both changed; sw.js's precache list and
CACHE_VERSION must move in lockstep or the service worker serves a
stale app.js/styles.css pair.
EOF
)"
```

## Self-Review Notes

- **Spec coverage:** every section of the design doc maps to a step above — transient state (Task 1 Step 1), overlay markup + button placement (Task 1 Steps 3-4), dwell/tap-to-skip/last-stop behavior (Task 1 Step 1, matching the design doc's clarified pacing section), wiring (Task 1 Step 6), styling incl. reduced motion (Task 1 Step 8 + Global Constraints), cache bump (Task 2).
- **Placeholder scan:** no TBD/TODO; every step has literal code or literal shell commands.
- **Type consistency:** `_archTourState.order` / `.index` / `.timeoutId` are the only fields used, and every read of them matches how Step 1 defines them. `startArchTour`/`stopArchTour`/`advanceArchTour`/`archTourSlideTap` names are used identically everywhere they appear (state functions, delegated handler, pointerup listener).
- **No committed automated test exists for this feature** (mirrors the Mill Map tour precedent, which also has no smoke.js coverage) — Task 1 Step 9's manual/browser verification is the acceptance gate, and Task 2 Step 5 runs the project's existing regression net.
