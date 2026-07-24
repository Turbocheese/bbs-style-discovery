# Nav & Defaults — Design Spec

**Date:** 2026-07-24
**Workstream:** 1 of the July-2026 feature batch (nav + defaults quick wins)
**Status:** Approved for planning

## Overview

Four small, low-risk UX fixes to the BBS Style Discovery kiosk app, all inside the
existing vanilla-JS architecture (no framework, no build step, string-concatenation
views, single `render()` router, one delegated click handler). No changes to script
load order, quiz logic, exports, or data.

## Goals

1. A client (or staff) can always leave any screen without scrolling — a persistent
   Back/Home control is visible at the top of every applicable view.
2. Long pages offer a fast way back up to that control.
3. The Cloth Room opens neutral, inviting the client to filter and choose rather than
   presenting a pre-dressed garment.
4. No screen can strand a client with no way out.

## Non-goals

- No framework migration (tracked separately as a spike).
- No change to quiz flow, worksheet, exports, cloth data, or the guide tree.
- No new loading screens (deeper nav stays instant per `CLAUDE.md`).

## Part A — Persistent top nav bar

**Current state:** each view appends its own bottom `<div class="nav-buttons">` with
`data-action="back"` / `data-action="home"` buttons. These route to `navigateBack()`
and `navigateHome()`, which already handle the history stack (`appState.history`),
quiz-step back-stepping, and the result→onboarding special case. The controls work;
they are just at the bottom, forcing a scroll.

**Change:** introduce one sticky top bar as a **sibling element above `#app`** in
`index.html` (e.g. `<div id="topnav">`), styled sticky/fixed to the top of the
viewport. It contains a **Back** and a **Home** button, both carrying the existing
`data-action="back"` / `data-action="home"` attributes so they flow through the single
delegated handler — **no new click listener** (hard rule in `CLAUDE.md`).

- Visibility is driven from `render()` (same place `is-home` / `is-welcome` classes are
  toggled). The bar is **hidden on `welcome` and `home`** (nowhere to go up/back from
  the top of the app), shown on every other view. Implement via a body/root class
  toggle (e.g. `has-topnav`) or direct style on `#topnav`, consistent with how
  `syncFabVisibility()` already gates chrome.
- Buttons carry **`.btn-bare`** to opt out of the `button:hover` invert trap, and any
  solid fill uses `!important` to survive the maison-layer `button { background:
  transparent !important }` reset (both documented in `CLAUDE.md`).
- Touch-first: ≥44px targets, visible `:active` press state, `touch-action:
  manipulation`. Uses brand tokens (ink/cream/bronze); may adopt the tape/bronze
  micro-label language for the eyebrow if it reads well, but stays minimal.
- Respects `prefers-reduced-motion` for any show/hide transition.

## Part B — "Back to top" button (replaces bottom nav)

**Change:** remove the bottom `.nav-buttons` Back/Home cluster from every view that
renders one (in `app.js`, `fabric-visualiser.js`, `lookbook.js`, `mill-map.js`, and
the guide/gallery/worksheet/colour views). Replace with a single floating **"↑ Top"**
button that:

- Appears **only after the user scrolls down** past a threshold (~400px) on a
  scrollable view, and is hidden at the top and on non-scrolling views.
- On tap, scrolls the app to the top — where Back/Home now live — using smooth
  scrolling, or an **instant jump when `prefers-reduced-motion`** is set.
- Is positioned to **not collide with the discovery FAB**. The FAB floats bottom-right
  (`body.has-fab` adds bottom padding); the Top button sits **bottom-left**. It must
  also clear the `body.has-fab` padding logic so neither control overlaps content.
- The scroll listener is a passive `scroll` listener (allowed — the one-handler rule is
  about `click`; idle-reset already uses non-click listeners), added once and guarded
  so it is not attached repeatedly across renders.

**Open implementation note:** confirm whether the app scrolls the window or an inner
`#app` container; wire the scroll listener and `scrollTo` to whichever actually scrolls.
Verify during implementation.

## Part C — Cloth Room opens neutral

**Current state:** `renderFabricVisualiser()` (fabric-visualiser.js:544) computes
`activeKey = appState.visFabricKey || recommended[0] || FABRIC_LIBRARY[0].key`, so the
garment is **always** dressed on entry.

**Change:** when no cloth has been chosen this session (`appState.visFabricKey` is
null), open in a **neutral state**:

- The jacket canvas renders as a **bare "ghost" silhouette** (undressed shape), with a
  clear prompt: **"Pick a cloth to see it come to life."**
- Filters and the swatch tray render as today, ready for use.
- The **first swatch tap dresses the garment** exactly as the current flow does; from
  then on the session behaves as before.
- Introduce/confirm a state distinction between "nothing selected yet" and a resolved
  key. Do **not** silently backfill `visFabricKey` with `recommended[0]` on entry.
- Compare and Ensemble sub-modes are out of scope for the neutral-entry change; they
  keep their current defaults. Only the single-cloth entry opens neutral.

The ghost render approach (how the canvas draws an undressed silhouette) is a small
implementation detail to settle against `weave-engine.js` / the garment canvas during
the build — either a neutral placeholder fill or skipping the cloth draw and showing
the bare garment outline. Deterministic, no `Math.random`.

## Part D — Dead-end audit

Enumerate every `case` in the `render()` switch plus the feature-file views, and for
each confirm there is a reachable route back (top nav covers most by construction).
Special attention to: `renderWorksheet()` empty state, result/dossier screens, colour
result, archetype detail/gallery, mill-map district views, and any error/guard states.

- Fix clear dead-ends (usually: ensure the top nav shows, or add a contextual action).
- Flag anything ambiguous (where the "right" back target is a product decision) to the
  founder rather than guessing.
- Output a short findings list in the implementation plan / PR description.

## Architecture & conventions

- ES5 style throughout (`var`, function declarations, string concatenation) — match the
  codebase, do not modernize.
- New state fields (if any) go in `getFreshState()` first.
- Conceptually the top nav + back-to-top are app-shell chrome; their render/visibility
  helpers live in `app.js` alongside `syncFabVisibility()`.

## Verification (definition of done)

1. `node --check` on every `.js` file touched.
2. App loads with validator passing, **zero console errors** on load and during the
   flows touched.
3. `node verify/smoke.js` green (load + validator, all menu entries, both quizzes,
   worksheet, dossier export, offline boot).
4. Manual check on an iPad-width viewport: top nav visible and functional on every
   non-welcome/home view; Back/Home behave correctly (including mid-quiz Back =
   previous question, result→onboarding); back-to-top appears on scroll, jumps to top,
   does not collide with the FAB; Cloth Room opens neutral with the ghost prompt, first
   tap dresses it.
5. **Cache busting:** bump `app.js?v=`, `styles.css?v=` in `index.html`, the matching
   `?v=` entries and `CACHE_VERSION` in `sw.js`.
6. No new `click` listeners; `.btn-bare` on card/label/chrome buttons; no new
   `!important` cascade layers where editing the winning block suffices.
7. Reduced-motion respected for the new transitions.

## Rollout

Single commit/PR to `master` (GitHub Pages serves `master`). Run the smoke harness
before pushing. Update `CHANGELOG.md`.
