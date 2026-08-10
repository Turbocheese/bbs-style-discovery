# Ensemble flat-lay polish — design

## Problem
The Cloth Room's ensemble mode (`renderClothEnsemble`, fabric-visualiser.js)
already composites cloth into photographed garments via `garment-photo.js` —
the pieces themselves are not flat. But the *arrangement* is: a literal
two-column CSS flex grid (jacket left, vest+trousers stacked right, comment
in the source calls it "adaptive flat-lay"), so three garments render as a
spreadsheet rather than a styled scene. Founder feedback: "flat lay looks
boring." This spec covers two independently-scoped fixes, both reusing
patterns already proven elsewhere in this codebase:

1. **Editorial flat-lay restyle** — CSS-only, no new markup.
2. **Assembly reveal animation** — mirrors the existing `visSurpriseFlash`
   read-then-clear pattern (fabric-visualiser.js:631-632) for a new
   `ens.justAdded` flag.

A third option (compositing garments onto the faceless SVG busts from
`archetype-avatars.js` for a "worn outfit" look) was considered and rejected
for this pass — `garment-photo.js`'s compositor works against garment
photographs with masks, not silhouette outlines, so that would be new
rendering engineering, not a restyle. Out of scope here.

## 1. Editorial flat-lay restyle

**Target:** `styles.css`, the `.ds-stage` / `.ds-stage-left` /
`.ds-stage-right` / `.ds-garment` rules (currently styles.css:8617-8660 —
search for `.ds-stage {` to find the winning block, since earlier work this
session may have shifted line numbers).

**Current layout:** `.ds-stage` is a flex row; `.ds-stage-left` (jacket) and
`.ds-stage-right` (vest + trousers, flex column, `gap: 12px`) sit side by
side with `gap: 12px` between them. `.ds-garment` has no transform.

**Change:** give each garment type a fixed resting tilt and let the columns
overlap slightly, so pieces read as laid across each other on the tabletop
background `.ds-stage` already has, rather than boxed apart. All values are
small and directional (never enough to threaten legibility or touch
targets — the garment blocks stay full size, only rotated a few degrees):

```css
.ds-stage-right {
    margin-left: -16px;
}

.ds-garment--jacket {
    transform: rotate(-2deg);
    position: relative;
    z-index: 2;
}
.ds-garment--vest {
    transform: rotate(3deg);
}
.ds-garment--trousers {
    transform: rotate(-1deg);
    margin-top: -14px;
    position: relative;
    z-index: 1;
}

.ds-garment--jacket,
.ds-garment--vest,
.ds-garment--trousers {
    box-shadow: 0 10px 22px -8px rgba(17, 17, 16, 0.28);
}
```

`.ds-stage-left` and `.ds-stage-right` are flex siblings inside `.ds-stage`,
so the negative `margin-left` on the right column pulls it under the
jacket's right edge without any markup change — this is standard flex
sibling overlap, not a positioning hack. The per-garment `z-index` (jacket
above vest/trousers) makes the overlap read as depth. The added
`box-shadow` per garment (layered on top of `.ds-stage`'s own
`box-shadow: var(--shadow-warm)`) is what sells "laid on a surface" instead
of "cut out and pasted" — each piece now casts its own shadow onto the
tabletop.

**Active/tapped lift:** extend the existing `.ds-garment.active` rule (today
just `border-color` + `background`, styles.css ~8649-8652) to also level
and lift the active piece above its resting tilt, so it's still obvious
which garment you're editing once all three are rotated:

```css
.ds-garment.active {
    border-color: var(--bronze);
    background: rgba(255, 255, 255, 0.5);
    transform: translateY(-4px) rotate(0deg) scale(1.015);
    z-index: 3;
}
```

`.ds-garment.active` (specificity 0,2,0) already outranks the single-class
`.ds-garment--jacket` etc. (0,1,0) rules above without needing
`!important` — same reasoning as the rest of the stacked-override CSS in
this file, just confirmed here since this rule needs to *win* the transform
property specifically.

Add `transform` to `.ds-garment`'s existing transition list
(`transition: border-color 0.3s ease, background 0.3s ease;` →
also `transform 0.3s ease`) so entering/leaving the active state animates
smoothly. Reduced-motion is already covered for free by the existing global
rule (styles.css:7437-7443).

## 2. Assembly reveal animation

**Target:** `app.js` (the `vis-ens-add` action handler, ~6989-7008),
`fabric-visualiser.js` (`getVisEnsGarmentBlock` ~1653, `getVisEnsPlaceholderBlock`
~1639, `renderClothEnsemble` ~1762), `styles.css` (new keyframe).

**Pattern:** mirrors `visSurpriseFlash` exactly — a one-shot flag is set
before a render, read and consumed (cleared) during that same render pass,
so it never replays on subsequent unrelated renders (a style change or
cloth swap on a *different* garment must not re-trigger the entrance
animation on an already-settled piece).

**Step 1 — set the flag.** In `app.js`'s `vis-ens-add` handler, right before
the existing `localStorage.setItem(...)` / `render({ animate: false })`
call:

```javascript
ensAdd.justAdded = addGarment;
```

(`ensAdd` is already `getVisEnsembleState()` in that handler — no new
lookup needed.)

**Step 2 — apply the class.** Both `getVisEnsGarmentBlock(garment, ens)` and
`getVisEnsPlaceholderBlock(garment, ens)` already build a class string for
the outer `.ds-garment` div (`" ds-garment--" + garment + activeClass`).
Add one more conditional segment to each:

```javascript
(ens.justAdded === garment ? " ds-garment-enter" : "")
```

Both functions already receive `ens`, so this is a same-signature change —
no new parameters threaded through.

**Step 3 — consume the flag.** In `renderClothEnsemble`, after `stageInner`
is built (i.e. after every `getVisEnsGarmentBlock` call for the current
`ens.garments` has already run and read `ens.justAdded`), clear it:

```javascript
ens.justAdded = null;
```

This must happen after `stageInner` is assembled, not before — the class
lookups above depend on it still being set at that point.

**Step 4 — the animation.** New keyframe in styles.css (near `cardReveal`,
~7811):

```css
@keyframes dsGarmentEnter {
    from { opacity: 0; transform: translateY(-14px) scale(0.96); }
    to { opacity: 1; }
}
.ds-garment-enter {
    animation: dsGarmentEnter 0.5s var(--ease-out) both;
}
```

The `to` keyframe deliberately omits `transform` — per standard CSS
animation behavior, a property missing from one keyframe but present in
another resolves to the element's own underlying (non-animated) value at
that keyframe, which is the per-garment resting `rotate(...)` from Section
1. The net effect: the piece drops in scaled-down and unrotated, then
settles into its tilted resting position as it fades and grows to full
size — no separate rotation keyframe needed, and Section 1's per-garment
tilt values stay the single source of truth for resting rotation. This
relies on long-standing, universally-supported keyframe interpolation
behavior, not an experimental CSS feature.

Reduced-motion is already covered for free by the existing global rule.

## Testing

Following this project's ad hoc Playwright convention (`verify/smoke.js`
has no ensemble-mode coverage today, so a temporary check script is
appropriate here, same as the wow-factor-polish pass):

- Add a jacket via `vis-ens-add`; assert `.ds-garment--jacket` carries
  `ds-garment-enter` immediately after.
- Trigger a second, unrelated render (e.g. select a cloth for that jacket)
  and assert `ds-garment-enter` is gone — proves the one-shot consume
  works and the animation does not replay.
- Screenshot a fully-dressed 3-piece outfit and visually confirm the
  overlap/rotation/shadow reads as a styled arrangement, not a broken
  layout (garments still fully legible, no clipped edges against
  `.ds-stage`'s padding).
- `node verify/smoke.js` and `node verify/audit.js` must both stay green —
  this change touches no data, but ensemble mode is exercised indirectly
  by the existing smoke suite's Cloth Room checks.

## Out of scope

- The "worn on a bust" silhouette approach (Option C from brainstorming) —
  parked, would need new compositing logic in `garment-photo.js`.
- Any change to which cloths/styles are offered, or to the Design Spec PDF
  export — this spec is purely the on-screen arrangement and entrance
  motion.
