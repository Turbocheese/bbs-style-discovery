# Mill Map Guided Tour — design

## Problem
The Cloth Origins globe is drag-to-explore only. It never shows off the app's best material — 40 real, storied houses — as a directed narrative. Nothing in the app currently delivers a "wow" moment purely through motion and history.

## Feature
A "Take the Tour" button on the globe view. Tapping it flies the camera through 8 curated houses in chronological order, holding on each with a dossier-style overlay card (coordinates, name, place, founding year, existing blurb), then returns control to free drag.

## Curated stops (chronological, verified via WebSearch 2026-08-02/03)
Pin keys from `MILL_MAP_PINS`, in order:

1. `vbc` — Vitale Barberis Canonico, Biella — 1663
2. `fox` — Fox Brothers, Somerset — 1772
3. `holland_sherry` — Holland & Sherry, Savile Row — 1836
4. `solbiati` — Solbiati, Lombardy — 1874 (currently missing `est` in the data — added as part of this build, sourced from solbiati.it's own history page)
5. `loro_piana` — Loro Piana, Biella — 1924
6. `drago` — Drago, Biella — 1973 (also currently missing `est` — added as part of this build)
7. `officine_paladino` — Officine Paladino, Singapore — 2017
8. `hellard` — Maison Hellard, SW France — 2021 (closing stop)

## Camera math (derived from the existing projection, not new)
`mill-map.js`'s own marker-projection formula (used today for pin placement, ~line 808) resolves to: a house at `(latDeg, lonDeg)` sits dead centre, facing the viewer, when
```
targetPhi = -(lonDeg * Math.PI / 180) - GLOBE_PHI_OFFSET
targetTheta = latDeg * Math.PI / 180
```
This is derived, not guessed — it falls out of the existing `x/y/z` projection when solved for `x=0, y=0`. No new calibration needed.

## Staging — "targeting computer," not slideshow
- **Reticle:** a dashed ring fixed at the stage's visual centre (CSS only, no per-frame projection needed — the camera always centres the current stop exactly there by construction). Visible only while `.map-globe-block` carries a `mill-touring` class.
- **Camera pan:** phi/theta ease from current to target over ~900ms, then hold. `prefers-reduced-motion` skips the ease and jumps straight there — same pattern already used for the idle spin (`mill-map.js:728-729`), not a new exemption.
- **Dossier card:** appears after the pan lands. Order: coordinates tick in (`45.72°N, 8.03°E`), then house name, then place, then the existing `pin.blurb`, then founding year via `countUp()` (`heritage.js`, already global) if `pin.est` exists — omitted, not fabricated, for any stop without one (none, after this build's two additions).
- **Pacing:** ~4s dwell per stop. Tap anywhere on the globe stage advances immediately. An Exit control (shown only while touring) ends the tour and returns to free drag.
- Card reveal reuses the existing `cardReveal` keyframe (same one Surprise Me's reveal uses) — not a new animation.

## State
No `appState` involvement — the tour is transient page state, like `phi`/`theta` themselves already are. New module-scope vars in `mill-map.js` alongside the existing `_globeHandle`/`_globeRAF`: a `_tourState` holding the current stop index and animation target. Idle spin and drag-to-turn are suspended for the duration (mirrors the existing "first touch kills idle spin for good" rule already in the file) and restored on exit.

## Wiring
- `data-action="mill-tour-start"` / `"mill-tour-exit"` — two new branches in the single delegated click handler in app.js, calling `startMillTour()` / `stopMillTour()` (new functions in mill-map.js).
- Tap-to-skip is a raw pointer gesture on the existing globe stage listeners (`mill-map.js:934-968`), not a `data-action` — consistent with how drag-to-turn already lives outside the delegated handler (CLAUDE.md's hard rule permits `pointerdown` outside it).
- `tick()`'s per-frame loop gets one new branch: while touring, ease phi/theta toward the tour target instead of idle-spinning; region-pin drag/tap-select is suppressed for the duration.

## Non-goals
- No flight-path trail connecting visited stops. It's a real nice-to-have but needs per-frame re-projection of every prior stop's position and adds real risk for a first pass. The reticle + brisk pans + dossier card already carry the "targeting computer" feel without it. Flagged for later, not built now.
- No new mill research beyond the 8 stops' founding years (verified this session). The other 32 houses are explicitly KIV'd (separate task).
- No sound.
- Tour only runs on the 3D globe, not the flat Provenance Chart (per earlier decision).

## Data change
Add real, sourced `est` years to two existing pins in `mill-map.js`:
- `solbiati`: `est: 1874`
- `drago`: `est: 1973`

## Testing / deploy checklist
- `node --check` on mill-map.js and app.js.
- Manual + Playwright: tour starts only on tap (never auto-plays), visits all 8 stops in order, camera lands centred on each (spot-check via `appState`-free evaluate of the globe's internal phi/theta against the target formula), Exit works mid-tour, tap-to-skip works, reduced motion jumps instantly with no missing stops.
- Bump `mill-map.js`, `app.js`, `styles.css` `?v=` in index.html + sw.js, plus `CACHE_VERSION`.
- Run `node verify/smoke.js`.
