# Archetype Gallery guided tour — design

## Problem
The Archetype Gallery (`renderArchetypeGallery()`, app.js) already lets a
client or staff member browse all 24 archetypes — a grid/stacked listing
plus a detail page with prev/next navigation — but nothing shows off the
full range as a directed, cinematic moment the way the Mill Map's "Take the
Tour" does for the 38 mill houses. This mirrors that pattern rather than
inventing a new one.

## Feature
A "Take the Tour" button on the Gallery's grid/stacked listing (not shown
on the detail page). Tapping it cycles through all 24 archetypes in their
existing data order, holding on each with a portrait, name, sub and a
counter, then returns control to the listing.

## Scope: all 24, no curation
Unlike the Mill Map tour, there's no natural sort axis for style
archetypes the way founding year ordered the mills — so this tours all 24
in the order `Object.keys(archetypeProfiles)` already returns (the same
order the grid/stacked views use), no curation or re-sequencing needed.

## Architecture — transient state, no `appState` involvement
Mirrors `mill-map.js`'s `_tourState` precedent exactly: a new module-scope
`_archTourState` (`active`, `order`, `index`) lives in app.js, alongside
the rest of the Gallery code (the Gallery has never had its own file, so
the tour doesn't get one either). The tour never touches
`appState.galleryKey` or `appState.history` — starting and advancing
through it does not count as "navigating" in the app's normal sense.

**Overlay markup** renders unconditionally inside `renderArchetypeGallery()`'s
returned HTML (a `.arch-tour-overlay`, hidden via CSS by default), so it
exists in the DOM the moment the Gallery loads. `startArchTour()` reveals
it (adds an `.active` class) and populates each stop's content via direct
DOM updates (`textContent`/`innerHTML` on child elements) — not through
`render()`, which is exactly how the transient-state requirement above is
satisfied: `render()` never needs to know a tour is running.

**Dwell timing — `setTimeout`, not the Mill Map's RAF-driven dwell.** The
Mill Map tour drives its ~4s dwell from a per-frame check
(`Date.now() >= dwellUntil`) inside the globe's *already-running*
`requestAnimationFrame` loop (`_globeRAF` — needed anyway for the idle
spin and camera easing). The Gallery has no continuous rendering surface
and no reason to start one just to match that mechanism — a plain
`setTimeout(advanceArchTour, ARCH_TOUR_DWELL_MS)`, re-armed on every
advance, does the identical job with no added machinery. Constant:
`ARCH_TOUR_DWELL_MS = 4000` (same value the Mill Map tour uses).

## Per-stop content
Deliberately terse, matching the Mill Map dossier card's discipline (it
shows coordinates/name/place/blurb/founding year — not the full mill
topic page):
- The archetype's existing portrait/avatar mark at large size, reusing
  `getGalleryMarkHTML(archetype, index, true)` as-is (the same call
  `renderArchetypeDetail()` already makes for its hero).
- Name (`archetype.name`) and sub (`archetype.sub`).
- A "01/24" counter, reusing the exact formatting
  `renderArchetypeDetail()` already computes:
  `("0" + (pos + 1)).slice(-2) + " / " + allKeys.length`.
- Nothing else — no tags, no core-principles copy. This is a paced
  flythrough, not the detail page; a client wanting more taps the
  archetype from the grid afterward.

Entrance per stop reuses the existing `cardReveal` keyframe
(styles.css:7811) — the same one Surprise Me and the Mill Map tour's own
dossier card both already reuse, not a new animation.

## Pacing & controls
- ~4s dwell per stop (`ARCH_TOUR_DWELL_MS`), then auto-advance.
  `advanceArchTour()` is the single function both the dwell timeout and
  tap-to-skip call; it always clears any pending timeout before doing
  anything else, so a tap immediately before the timer would have fired
  cannot cause a double-advance.
- **Last stop:** on completing the 24th stop's dwell (or a tap-to-skip on
  it), `advanceArchTour()` calls `stopArchTour()` instead of advancing to
  a 25th slide or looping back to the first — the tour is a one-pass
  flythrough, not a loop.
- **Tap-anywhere-on-the-slide skips ahead immediately.** A raw
  `pointerup` listener added to the slide content element only while
  touring (added in `startArchTour()`, removed in `stopArchTour()`) —
  mirrors the Mill Map's tap-to-skip, which similarly lives outside the
  single delegated body handler (CLAUDE.md's documented exception for
  gestures that must distinguish a tap from a drag/other interaction;
  this case has no drag to distinguish from, but keeping the mechanism
  consistent with the established precedent is simpler than inventing a
  second wiring style for the same conceptual gesture). Scoped to the
  slide content specifically (not the whole overlay), so it never
  competes with the Exit button.
- **Exit control** is always visible while touring, wired as a normal
  `data-action="arch-tour-exit"` branch in the single delegated handler
  (it's a plain button tap, not a gesture needing to distinguish from
  anything else — no reason to special-case it the way tap-to-skip is).
- `prefers-reduced-motion`: skip the `cardReveal` entrance animation
  (content still changes, just without the animated slide-in) but keep
  the same dwell-and-advance pacing — matching the project's existing
  reduced-motion convention of removing animation, not removing the
  feature's behavior.

## Wiring
- `data-action="arch-tour-start"` — new branch in the single delegated
  click handler, calling `startArchTour()`.
- `data-action="arch-tour-exit"` — new branch, calling `stopArchTour()`.
- Tap-to-skip is the one raw `pointerup` listener described above,
  attached/detached around the tour's lifetime, not a `data-action`.

## Non-goals
- No sound (consistent with every other tour/reveal moment in this app).
- No curation, re-sequencing, or "highlight reel" subset — all 24, in
  existing order.
- No persistence of which archetypes were seen, no `appState` changes at
  all.
- No changes to the existing grid/stacked toggle or detail-page prev/next
  browsing — purely additive, and the tour button does not appear on the
  detail page.
- No new file — the tour's code lives in app.js with the rest of the
  Gallery, matching how the Mill Map tour lives in mill-map.js rather than
  a separate file.

## Testing / deploy checklist
- `node --check` on app.js.
- Manual + Playwright: tour starts only on tap (never auto-plays on
  Gallery load), visits all 24 stops in the same order the grid shows,
  tap-to-skip advances immediately, Exit works mid-tour, reduced motion
  keeps advancing on the same schedule with no animated entrance, tour
  button does not appear on the archetype detail page.
- Confirm the tour never writes to `appState` — inspect `localStorage`'s
  `bbs_session` before/after a full tour run and confirm it is
  byte-identical (aside from whatever the client was doing before
  starting the tour).
- Bump `app.js`'s `?v=` in index.html + sw.js precache list, plus
  `CACHE_VERSION` in sw.js. Bump `styles.css?v=` too if the overlay's
  CSS is added there (it will be).
- Run `node verify/smoke.js` and `node verify/audit.js`.
