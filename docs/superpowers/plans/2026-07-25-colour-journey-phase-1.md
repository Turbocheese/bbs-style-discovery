# Colour × Style Combined Journey — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorder the guided experience so Colour comes first, redesign the Colour result to be client-simple, and combine Colour + Style into one unified "This Is You" result — all in the existing vanilla-JS app.

**Architecture:** No framework. Two quizzes stay mechanically separate (own questions, own scoring); only the *result presentation* combines. A journey flag in `appState` drives Colour → Style → unified result; individual quiz launches are preserved. Colour content is distilled from the existing rich profile data, not re-authored.

**Tech Stack:** Vanilla ES5 (var, function declarations, string concatenation), CSS (append-at-end, layered), no build. Verification: `node --check`, `node verify/smoke.js` (Playwright), Playwright DOM/computed-style checks. Visual craft: the `frontend-design` skill, using the approved concept artifact as the reference.

## Altitude note (read first)

This phase is design-heavy and the founder's explicit bar is "premium, like it took thousands of hours." Tasks specify **behavior, data, state, structure, and acceptance criteria** precisely. The **visual execution** (exact spacing, motion, refined type) is delegated to the `frontend-design` skill with the approved concept as the north star — the plan does not dictate every CSS rule, because over-specifying would undercut the design quality the founder is asking for. "No placeholders" still holds: every requirement is concrete; only pixel-craft is delegated, and each task names what must be true for acceptance.

## Global Constraints

Copied from `CLAUDE.md` / the design spec — every task includes these:

- ES5 only: `var`, function declarations, string concatenation. No `let`/`const`/arrow/template-literals/classes/modules. 4-space indent, double quotes in app.js.
- **Two quizzes never merge:** keep `scoreColourDirectionAnswers()` (colour) and the style archetype scoring as independent code paths. The unified result is presentation only — do not build a combined scoring model.
- EXACTLY ONE delegated `click` handler on `document.body` (dispatches `data-action`). New interactions = new `data-action` branches. Never add a second click listener.
- Cascade traps: any new styled `button` needs `.btn-bare` + targeted `!important` vs the unscoped `button { ...!important }` and `@media(hover:none) button:active { background: var(--accent) !important }` (`--accent` = near-black `#111110`).
- Touch-first: ≥44px targets, `touch-action: manipulation`, visible `:active`, 16px+ inputs. All motion respects `prefers-reduced-motion`.
- Light-only theme. Brand tokens in `styles.css` `:root`: ink `#111110`, cream `#eae5dd`, taupe `#a4a19c`, bronze `#9a7b4f`. Self-hosted EB Garamond (serif) + Manrope (UI). The tape-measure motif is the app's signature.
- `.colour-hero-swatch` bands must NOT get `border-radius: 50%` (distends into ellipses — shipped once).
- Kiosk invariants preserved: idle attract-reset, double-tap-logo reset, session persistence, tap-answer→tap-Next (no auto-advance), the measure-moment interstitial.
- New `appState` fields go in `getFreshState()` first. Views are string-concat `case`s in the `render()` switch.
- British English, warm/non-clinical copy; em-dashes allowed in editorial copy, not UI chrome.
- Cache-busting: on any change to app.js / colour-direction.js / styles.css, bump their `?v=` in `index.html` and `sw.js`, and bump `CACHE_VERSION` — **deferred to Task 6** (do not bump mid-phase).
- No unit-test framework by design; `node verify/smoke.js` is the automated net.

---

## File Structure

- `app.js` — journey state + ordering (`getFreshState`, a `begin-journey` action, journey transition hooks in the colour/style result paths, a home CTA); the rewritten `renderColourDirectionResult()`; the unified-result presentation; a shared colour-result content helper.
- `colour-direction.js` — pure derivation helpers `getColourDescriptor(scores)` and `getColourReasons(scores)`; distillation helpers that map a profile to the "3 moves" + 2 cards.
- `styles.css` — appended premium styling for the new colour result + unified result.
- `index.html` / `sw.js` / `CHANGELOG.md` — cache bump + changelog (Task 6).

---

## Task 1: Journey state + Colour-first ordering

**Files:**
- Modify: `app.js` — `getFreshState()` (~3283); the delegated handler (add `begin-journey`); `navigateColourDirection()` (~7146) and the style result transition (`navigateDiscover` ~3392 / where `view` becomes `result`); `renderHome()` (add a primary CTA).

**Interfaces:**
- Produces: `appState.inJourney` (boolean) and `appState.journeyStage` ("colour" | "style" | "done" | null); `navigateJourney()` (starts the combined flow at Colour); the rule "when `inJourney` and colour completes → go to Style; when `inJourney` and style completes → unified result."
- Consumes: existing `navigateColourDirection()`, `navigateDiscover()`, `scoreColourDirectionAnswers`, the `render()` router.

- [ ] **Step 1: Add journey state**

In `getFreshState()` add (after `colourResultKey: null,`):
```javascript
        inJourney: false,
        journeyStage: null,
```

- [ ] **Step 2: Add `navigateJourney()`**

Add near `navigateColourDirection()`:
```javascript
// The guided journey: Colour first, then Style, then one unified result.
// The two quizzes keep their own state and scoring; this only sequences them.
function navigateJourney() {
    appState.inJourney = true;
    appState.journeyStage = "colour";
    // Start the colour quiz fresh (mirror navigateColourDirection's fresh-start).
    appState.colourStep = 0;
    appState.colourAnswersById = {};
    appState.colourResultKey = null;
    appState.view = "colour-direction";
    render({ animate: true });
}
```

- [ ] **Step 3: Wire the `begin-journey` action**

In the delegated click handler, add a branch (near the `colour-direction` action at ~6288):
```javascript
    else if (action === "begin-journey") { runMeasureMoment("Beginning your journey…", navigateJourney, 650); }
```

- [ ] **Step 4: Advance Colour → Style when in the journey**

Find where the colour result view is shown after the last colour answer (the colour quiz's advance/finish path that sets `view = "colour-result"`; trace from `renderColourDirection` / the colour answer handler). At the point the colour result key is first set on quiz completion, branch:
```javascript
    if (appState.inJourney && appState.journeyStage === "colour") {
        appState.journeyStage = "style";
        // Hand off to the Style quiz fresh-start.
        navigateDiscover();
        return;
    }
```
(Place this so it fires only on journey completion of colour, not when revisiting an existing colour result. Verify the exact hook site during implementation and state it in the report.)

- [ ] **Step 5: Show the unified result when the journey's Style completes**

At the style completion point (where `view` becomes `"result"` after archetype is set), if `appState.inJourney && appState.journeyStage === "style"`, set `appState.journeyStage = "done"` before rendering the result. The `result` view will render the unified presentation (Task 4) when `journeyStage === "done"`.

- [ ] **Step 6: Add the home CTA**

In `renderHome()`, add a primary call-to-action button `data-action="begin-journey"` (copy e.g. "Begin your discovery"), positioned as the lead action above the existing individual entries. Individual Colour and Style launches remain available (staff/returning clients). Button carries `.btn-bare` if styled as a card; solid fills use `!important` per the cascade trap.

- [ ] **Step 7: Syntax check**

Run: `node --check app.js`
Expected: clean.

- [ ] **Step 8: Verify the flow**

`npx serve .` + Playwright (`npm i --no-save playwright`): clear localStorage; tap "Begin your discovery" → the Colour quiz renders first; answer through to colour completion → the app advances into the Style quiz (onboarding/discover), NOT a terminal colour result; complete Style → the result view renders with `journeyStage === "done"`. Separately, confirm the individual Colour and Style menu launches still work and end on their own results (`inJourney` false). Zero console errors.

- [ ] **Step 9: Commit**

```bash
git add app.js
git commit -m "Journey ordering: Colour first, then Style, then unified result"
```

---

## Task 2: Colour descriptor + plain-reason helpers

**Files:**
- Modify: `colour-direction.js` — add `getColourDescriptor(scores)` and `getColourReasons(scores)` near the scoring function (`scoreColourDirectionAnswers` ~965).

**Interfaces:**
- Produces:
  - `getColourDescriptor(scores)` → a plain descriptor string, e.g. `"Warm & Deep"`, `"Cool & Light"`, `"Balanced"`.
  - `getColourReasons(scores)` → an array of exactly 3 objects `{ k: "Undertone"|"Depth"|"Contrast", v: <short value>, d: <one plain sentence> }`.
- Consumes: the object returned by `scoreColourDirectionAnswers()`. **First action:** read that function to confirm the exact score keys (observed: `light/medium/deep`, `warm/cool/neutral/olive`, `softContrast/strongContrast`, `colourOpen/neutralLean`). Derive from those keys; if a key differs, adapt and note it.

- [ ] **Step 1: Implement the helpers**

```javascript
// Plain-language read of a colouring for client-facing copy. Derives from the
// same score tallies scoreColourDirectionAnswers produces; the four-variable
// model stays under the hood — the client only ever sees these words.
function getColourDescriptor(scores) {
    var s = scores || {};
    // Undertone: pick the dominant of warm/cool/neutral/olive.
    var undertone = "Balanced";
    var uWarm = s.warm || 0, uCool = s.cool || 0, uNeut = s.neutral || 0, uOlive = s.olive || 0;
    var uMax = Math.max(uWarm, uCool, uNeut, uOlive);
    if (uMax > 0 && uMax === uWarm) undertone = "Warm";
    else if (uMax > 0 && uMax === uCool) undertone = "Cool";
    else if (uMax > 0 && uMax === uOlive) undertone = "Olive";
    else undertone = "Balanced";
    // Depth: pick the dominant of light/medium/deep.
    var depth = "Medium";
    var dL = s.light || 0, dM = s.medium || 0, dD = s.deep || 0;
    var dMax = Math.max(dL, dM, dD);
    if (dMax > 0 && dMax === dD) depth = "Deep";
    else if (dMax > 0 && dMax === dL) depth = "Light";
    else depth = "Medium";
    if (undertone === "Balanced") return depth === "Medium" ? "Balanced" : "Balanced & " + depth;
    return undertone + " & " + depth;
}

function getColourReasons(scores) {
    var s = scores || {};
    // Undertone reason.
    var uWarm = s.warm || 0, uCool = s.cool || 0, uOlive = s.olive || 0;
    var uMax = Math.max(uWarm, uCool, uOlive, s.neutral || 0);
    var undertone = { k: "Undertone", v: "Balanced",
        d: "You carry both warm and cool well — lean on whichever a cloth leads with." };
    if (uMax > 0 && uMax === uWarm) undertone = { k: "Undertone", v: "Warm",
        d: "Gold and earth tones bring you to life; icy shades drain you." };
    else if (uMax > 0 && uMax === uCool) undertone = { k: "Undertone", v: "Cool",
        d: "Clear blues, greys and silver suit you; heavy warm tones muddy you." };
    else if (uMax > 0 && uMax === uOlive) undertone = { k: "Undertone", v: "Olive",
        d: "Grounded, greened tones flatter you more than clean warm or cool." };
    // Depth reason.
    var dL = s.light || 0, dM = s.medium || 0, dD = s.deep || 0;
    var dMax = Math.max(dL, dM, dD);
    var depth = { k: "Depth", v: "Medium",
        d: "Mid-depth shades sit most naturally on you." };
    if (dMax > 0 && dMax === dD) depth = { k: "Depth", v: "Deep",
        d: "Rich, grounded shades suit you better than pale or washed-out ones." };
    else if (dMax > 0 && dMax === dL) depth = { k: "Depth", v: "Light",
        d: "Softer, lighter shades flatter you more than very dark ones." };
    // Contrast reason.
    var soft = s.softContrast || 0, strong = s.strongContrast || 0;
    var contrast = strong > soft
        ? { k: "Contrast", v: "Crisp",
            d: "You carry sharp light-dark pairings with natural authority." }
        : { k: "Contrast", v: "Soft",
            d: "Tonal, blended outfits flatter you more than stark separation." };
    return [undertone, depth, contrast];
}
```
Expose them if the file uses `window.` exports for cross-file calls (match how `scoreColourDirectionAnswers` is referenced from app.js — if app.js calls it as a bare global, these are globals too; no `window.` needed).

- [ ] **Step 2: Syntax check**

Run: `node --check colour-direction.js`
Expected: clean.

- [ ] **Step 3: Verify behavior**

`npx serve .` + Playwright: in-page, call `getColourDescriptor` and `getColourReasons` with three representative score objects and assert:
- warm-dominant + deep + softContrast → descriptor `"Warm & Deep"`; reasons[0].v `"Warm"`, reasons[1].v `"Deep"`, reasons[2].v `"Soft"`.
- cool-dominant + light + strongContrast → `"Cool & Light"`; `"Cool"`, `"Light"`, `"Crisp"`.
- all-zero/neutral → descriptor `"Balanced"`; 3 reasons returned with non-empty `d`.
State the assertion outputs in the report.

- [ ] **Step 4: Commit**

```bash
git add colour-direction.js
git commit -m "Add plain-language colour descriptor + reason helpers"
```

---

## Task 3: Client-simple Colour result

**Files:**
- Modify: `app.js` — rewrite `renderColourDirectionResult()` (~6895) body; add a shared helper `getColourResultContentHTML(resultKey, scores, profile)` that Task 4 will reuse.
- Modify: `colour-direction.js` — optional small distillation helper mapping a profile to the 3 "how to wear it" moves (or build inline from `strongNeutrals`/`accentColours`/`hardware`).

**Interfaces:**
- Consumes: `scoreColourDirectionAnswers`, `getColourDirectionProfileKey`, `getColourDirectionProfileData`, `getColourDescriptor`, `getColourReasons` (Task 2), `getColourExploreLinks`, `isLightHex`.
- Produces: `getColourResultContentHTML(...)` returning the inner result HTML (headline, reasons, palette, how-to, cards, links) as a string — the single source of truth for colour result content, reused by the standalone colour-result view and the unified result (Task 4).

- [ ] **Step 1: Build the shared content helper**

Refactor the colour result body into `getColourResultContentHTML(resultKey, scores, profile)`. It renders, in order:
1. **Type header** — micro-label "YOUR COLOUR TYPE", `getColourDescriptor(scores)` as the serif headline, `profile.name` as subtitle, `profile.desc` as one line.
2. **Three reasons** — from `getColourReasons(scores)` (Undertone/Depth/Contrast).
3. **Palette split** — `profile.strongNeutrals` under "Neutrals — your foundation (suits, coats, trousers)"; `profile.accentColours` under "Accents — closer to the face (shirts, knits, ties)". Named swatches. Preserve the `isLightHex` label-contrast handling from the current code. Do NOT apply `border-radius: 50%` to hero swatch bands.
4. **How to wear it, 3 moves** — cards built from:
   - Suits & coats → `strongNeutrals`
   - Shirts → the lighter/calmer `strongNeutrals` + one accent
   - Ties, knits & metal → `accentColours` + a one-line distillation of `profile.hardware.desc`
   Each card shows its colour dots.
5. **Two cards** — Fabric finish (`profile.fabricFinish` distilled to one sentence) and a contrast card (`profile.contrastArchitecture` or `profile.strategy` distilled to one sentence).
6. **Explore links** — keep the existing `getColourExploreLinks(resultKey)` cards.

The current dense five-icon layout (`fabricFinish`/`contrastArchitecture`/`hardware`/`pattern`/`strategy` each as a full section) is REPLACED by the distilled moves + 2 cards. The full text remains available behind an optional "the full read" expansion (a `data-action` toggle or a `<details>`-style block) but is not the default surface.

- [ ] **Step 2: Rewrite `renderColourDirectionResult()` to use the helper**

```javascript
function renderColourDirectionResult() {
    var scores = scoreColourDirectionAnswers(appState.colourAnswersById);
    var resultKey = getColourDirectionProfileKey(scores);
    var profile = getColourDirectionProfileData(resultKey);
    appState.colourResultKey = resultKey;

    return (
        '<div class="colour-result-shell">' +
        getColourResultContentHTML(resultKey, scores, profile) +
        // In the journey, this screen is skipped in favour of the unified result;
        // reached standalone, offer to complete the Style quiz for the full picture.
        (appState.inJourney ? "" : getColourResultCrossPromptHTML()) +
        "</div>"
    );
}
```
Add `getColourResultCrossPromptHTML()` returning a small "Complete the Style quiz to see your full identity" CTA (`data-action` to launch style). Keep it minimal.

- [ ] **Step 3: Syntax check**

Run: `node --check app.js`
Expected: clean.

- [ ] **Step 4: Verify the result**

`npx serve .` + Playwright: complete the colour quiz standalone. Assert the result shows: the descriptor headline + `profile.name` subtitle; exactly 3 reason tiles; a Neutrals group and an Accents group with named swatches; exactly 3 "how to wear it" cards; the two supporting cards; the explore links; and that the old five separate icon-sections are gone. No `border-radius: 50%` on `.colour-hero-swatch`. Zero console errors.

- [ ] **Step 5: Commit**

```bash
git add app.js colour-direction.js
git commit -m "Redesign Colour result: client-simple type, reasons, palette, how-to"
```

---

## Task 4: Unified result (Colour + Style as one identity)

**Files:**
- Modify: `app.js` — `renderResult()` (~4424): when `appState.journeyStage === "done"` (or both colour + style are complete), render the unified presentation.

**Interfaces:**
- Consumes: `renderResult`'s existing archetype rendering; `getColourResultContentHTML` (Task 3); `appState.colourResultKey`, `scoreColourDirectionAnswers`, the profile helpers, `appState.archetypeKey`.
- Produces: a unified result that reads as one identity — archetype + colour type + palette + how-to together, cross-referenced.

- [ ] **Step 1: Render the unified result**

In `renderResult()`, when the journey is complete (`appState.journeyStage === "done"` and `appState.colourResultKey`), compose one screen that presents:
- The archetype result (existing content) as the identity headline.
- A "Your colours" section rendered via `getColourResultContentHTML(...)` (reuse — do not duplicate the colour layout).
- A one-line tie between them (e.g. "The [Archetype], dressed in your [descriptor] palette").
Keep the existing standalone style-result path unchanged when not in a completed journey.

- [ ] **Step 2: Syntax check**

Run: `node --check app.js`
Expected: clean.

- [ ] **Step 3: Verify**

`npx serve .` + Playwright: run the full journey (begin-journey → colour → style). Assert the final screen shows the archetype AND the colour type + palette + how-to together on one result, cross-referenced. Confirm a standalone Style-only result (no colour completed) still renders as before. Zero console errors.

- [ ] **Step 4: Commit**

```bash
git add app.js
git commit -m "Unified result: archetype + colour palette as one identity"
```

---

## Task 5: Premium styling pass

**Files:**
- Modify: `styles.css` — append a clearly-commented block for the new colour result + unified result.

**REQUIRED SUB-SKILL:** Use `frontend-design` for this task. Reference the approved concept artifact for layout/rhythm/interaction; adapt (don't copy) the calibre of the founder's reference libraries (21st.dev, Aceternity, Refero, Mobbin, Godly, 10px). Stay on-brand: light theme, cream/ink/bronze tokens, EB Garamond + Manrope, tape-measure signature, palette-as-hero.

- [ ] **Step 1: Style the result**

Append styling for: the type header (serif headline + bronze micro-label + subtitle), the 3 reason tiles, the palette split with named swatches, the 3 how-to cards with colour dots, the 2 supporting cards, and the unified-result composition. Use brand tokens; considered spacing and hierarchy; premium but not busy. Motion (e.g. a gentle reveal) must respect `prefers-reduced-motion`. Any new `button` carries `.btn-bare` and targeted `!important` per the cascade traps. Do not add `border-radius: 50%` to `.colour-hero-swatch`.

- [ ] **Step 2: Verify look + traps**

`npx serve .` + Playwright: screenshot the colour result and the unified result at iPad width. Computed-style check any new buttons: pill/intended shape wins (not the square uppercase reset), and `:active` is not the near-black accent. Confirm reduced-motion disables the reveal. Confirm no horizontal body scroll. Zero console errors.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "Premium styling for the client-simple Colour and unified result"
```

---

## Task 6: Cache bump + smoke + changelog

**Files:**
- Modify: `index.html`, `sw.js`, `CHANGELOG.md`.

- [ ] **Step 1: Bump versions**

Grep `?v=` in `index.html` and `sw.js` for `app.js`, `colour-direction.js`, and `styles.css`; increment each by 1 in BOTH files so they match; bump `CACHE_VERSION` in `sw.js` (e.g. `bbs-v78`→`bbs-v79`). Confirm the numbers match across both files.

- [ ] **Step 2: Changelog**

Add a dated `CHANGELOG.md` entry: Colour-first guided journey, client-simple Colour result, unified Colour + Style result.

- [ ] **Step 3: Full smoke**

`npx serve .`, `npm i --no-save playwright`, then `node verify/smoke.js`. Must be all-green, exit 0, no console errors/4xx-5xx. Extend the harness (or drive Playwright) to cover the new journey ordering (begin-journey → colour → style → unified result) and confirm the individual quiz launches still resolve. Paste the summary.

- [ ] **Step 4: Commit**

```bash
git add index.html sw.js CHANGELOG.md
git commit -m "Bump cache version and changelog for Colour journey phase 1"
```

- [ ] **Step 5: Final check before merge**

Confirm `node verify/smoke.js` green; branch `colour-combined-journey` ready. Do NOT merge/push without founder go-ahead (GitHub Pages serves `master` live).

---

## Self-Review

**Spec coverage (Phase 1 scope):**
- Colour-first ordering + combined journey → Task 1. ✓
- Client-simple result (descriptor + reasons + palette split + how-to + cards) → Tasks 2 (derivation) + 3 (render). ✓
- Unified Colour + Style result → Task 4. ✓
- Premium design bar → Task 5 (frontend-design + concept reference). ✓
- Never-merge boundary → enforced in Global Constraints + Task 1 (separate scoring; presentation-only combine). ✓
- Verification/cache/changelog → Task 6 + per-task `node --check` + Playwright. ✓
- Phase 2 (Cloth Room recos) and Phase 3 (worksheet tint) are explicitly OUT OF SCOPE here (separate plans).

**Type/name consistency:** `getColourDescriptor`, `getColourReasons`, `getColourResultContentHTML`, `getColourResultCrossPromptHTML`, `navigateJourney`, `inJourney`, `journeyStage`, action `begin-journey` — used consistently across tasks. Task 3's `getColourResultContentHTML` is defined in Task 3 and reused in Task 4.

**Placeholder scan:** derivation helpers and the result structure are concrete; visual pixel-craft is deliberately delegated to `frontend-design` per the altitude note, with named acceptance criteria per task. The two "confirm the exact hook site / score keys during implementation" notes are honest code-in-hand confirmations of existing-code shapes, each with a stated default, not open requirements.
