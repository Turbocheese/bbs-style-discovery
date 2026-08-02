# Surprise Me shuffle — design

## Problem
Cloth Room requires a client to tap through swatches one at a time. No quick, playful "just show me something" moment — the kiosk's "wow" framing has no equivalent in this view.

## Feature
A "Surprise Me" button in the Cloth Room toolbar, present in all three mutually-exclusive modes (single cloth, compare, ensemble). One tap plays a short measure-moment beat, then swaps in a random cloth selection with a small reveal animation.

## Scope
- Single mode: 1 random cloth.
- Compare mode: 2 random cloths (independent of each other).
- Ensemble mode: 3 random cloths (jacket/vest/trousers), coordinated so at most one garment gets a "loud" pattern (see Coordination below).

## Pool selection
Random pick draws from the **currently active facet-filtered list** (`VIS_FACETS` region chips already narrow the swatch grid on screen) — a client who filtered to e.g. British mills should stay within that filter when surprised. Excludes whichever cloth is currently shown for that slot, so a tap always visibly changes something.

## Coordination (ensemble only)
"Loud" = a cloth whose weave overlay is not `"none"` (chalkstripe, pinstripe, windowpane, glen, houndstooth). "Quiet" = overlay `"none"` (plain/twill/hopsack/flannel/birdseye/herringbone grounds with no overlay).
1. Randomly choose one garment slot (jacket/vest/trousers) to be the "feature" — it may get any cloth from the filtered pool.
2. The other two slots draw only from the quiet subset of the filtered pool.
3. If the quiet subset is empty for the current filter (e.g. a facet that only contains patterned cloths), fall back to the full filtered pool for those slots rather than showing nothing.

## Motion
Tap plays `runMeasureMoment("Styling you a look…", <callback>, 1500)` (existing loading interstitial, reused as-is — no new loading UI). On completion, the new swatch(es) animate into place (short scale/slide-in) using the project's existing motion tokens (`--ease-out`, `--dur-*`), not new bespoke timing values.

`prefers-reduced-motion`: skip both the measure-moment beat and the reveal animation — pick and swap instantly. This matches the project's existing global reduced-motion kill rules; it is not a new exemption.

## State and wiring
No new `appState` shape. The button sets cloth key(s) through the same code paths a manual swatch tap already uses (single cloth field / `visCompare` cloths / `visEnsemble` per-garment cloths), then calls the existing `renderFabricVisualiser()`.

- One new pure helper, `pickSurpriseCloths(mode, filteredPool, currentSelection)`, colocated in fabric-visualiser.js, returns the new key(s) without touching state or the DOM.
- One new `data-action="visSurpriseMe"` branch in the single delegated `document.body` click handler (per project's one-handler rule) — reads current mode/filter/selection from `appState`, calls the helper, applies the result, triggers the measure moment and re-render.
- Button styled as a normal toolbar button (not a card/pin/label/swatch), so no `.btn-bare` needed.

## Non-goals
- No new persisted state or history of past surprises.
- No weighting/curation beyond the loud/quiet split above — a plain random pick within those pools.
- No sound.
- No changes to single-cloth study or drape panels — Cloth Room only.

## Testing / deploy checklist
- `node --check` on fabric-visualiser.js (and app.js if the click-handler branch lands there instead — confirm actual handler location during implementation).
- Manual check in all three modes: tap swaps cloth(s), never repeats the currently-shown cloth, ensemble never doubles a loud pattern.
- Reduced-motion check: swap is instant, no interstitial, no animation.
- Bump `?v=` for fabric-visualiser.js (and styles.css if new CSS is added) in index.html, plus matching entries and `CACHE_VERSION` in sw.js.
- Run `node verify/smoke.js`.
