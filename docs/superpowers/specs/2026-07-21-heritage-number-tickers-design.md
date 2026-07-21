# Heritage Number Tickers — Design

**Date:** 2026-07-21
**Status:** Approved (design), pending implementation plan
**Sub-project 1 of 4** in the "21st.dev-inspired polish" series (tickers → reveal
text → cloth-shader attract → 3D coverflow). The other three are out of scope
here and get their own spec each.

## Goal

Add tasteful animated count-ups of the house's real scale — reinforcing
"considered and established" — in four places, and remove the distracting
drifting-tape background on the welcome page. Wow-factor, on-brand, truthful.

## The numbers (derived — single source of truth)

Computed from the cloth data so they stay accurate as the library grows:

| Stat | Source | Current value |
|------|--------|---------------|
| Cloths | `CLOTH_LIBRARY.length` | 102 |
| Mills | distinct `mill` values in `CLOTH_LIBRARY` | 34 |
| Years | `new Date().getFullYear() - 1767` (oldest mill founding) | 259 |

The Years figure carries a small caption **"since 1767"** so the number is
self-explanatory. This retires the old, unverifiable "358 years" on the
provenance tape (oldest mill in the collection is 1767).

## Components (vanilla JS, matching the existing app — no framework)

1. **`heritageStats()`** — returns `{ cloths, mills, years, since: 1767 }`,
   computed on call from `CLOTH_LIBRARY`. The only place the figures are
   derived; every placement reads from here.

2. **`countUp(el, target, opts)`** — animates the element's text from 0 to
   `target` with an ease-out curve over ~1.2s, integer steps, thousands
   separators. Honors `prefers-reduced-motion`: sets the final value
   immediately with no animation. Self-contained; no dependency on the
   placement.

3. **`renderHeritageStrip(variant)`** — returns the markup for the trio (large
   EB Garamond numeral + small-caps label + caption). `variant` selects layout:
   - `home` — a horizontal band across the home screen
   - `millmap` — sits with the Cloth Origins globe context
   - `provenance` — within the existing Provenance Chart moment
   - `result` — a restrained inline line on the quiz result page

4. **Reveal trigger** — an `IntersectionObserver` starts `countUp` on each strip
   the moment it enters the viewport, once per appearance (re-arms when the
   strip leaves and re-enters, so revisiting a screen re-animates). Works
   regardless of how a screen becomes visible (navigate vs scroll).

## Placements

**Mill Map / Cloth Origins only** (revised after review, 2026-07-21). The figures
are cloth-provenance, not brand-level, so they belong where cloth is the subject.
A home-screen strip was tried and removed; the quiz-result and separate
"provenance chart" placements were dropped (the provenance chart is part of the
Mill Map). The component still takes a `variant` so more cloth-context
placements (e.g. the Cloth Room) can reuse it later.

## Login-page cleanup

Remove the `welcome-tape` background (one of the earlier 21st.dev borrows):
- the `<canvas class="welcome-tape" id="welcome-tape">` element (app.js welcome
  render, ~line 3652)
- its requestAnimationFrame drift loop and any init/teardown
- the associated CSS (`.welcome-tape` and related keyframes) in styles.css

Verify the welcome page still renders clean with no dangling references or
console errors.

## Style

EB Garamond numerals, large and restrained; labels in small caps; caption
smaller and muted. Uses existing palette tokens. Responsive and touch-first for
the in-store iPad. No layout shift when the count settles (reserve width for the
final value).

## Accessibility

The final value is real text in the DOM (screen readers read the settled number,
not the intermediate frames). Reduced-motion shows the final value with no
animation.

## Verification

- `npm run smoke` — zero console errors, all screens render, offline boot intact
- Confirm each placement's ticker settles on the exact derived value (102 / 34 /
  259)
- Visual render of each of the four placements + the cleaned welcome page
- Cache-bust: bump `app.js` and `styles.css` `?v=` in `index.html`, and
  `CACHE_VERSION` in `sw.js`

## Out of scope

- The other three polish features (reveal text animation, cloth-shader attract
  screen, 3D coverflow) — separate specs.
- Any change to the underlying cloth/mill data.
