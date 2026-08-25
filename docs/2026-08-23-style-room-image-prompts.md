# Style Room expansion — new garment photo prompts (GPT Image 2)

Companion to `docs/2026-08-17-bespoke-spec-image-prompts.md` (same output
spec, same pipeline). That doc's prompts #1/#2/#3 already shipped; #4, #5,
and #6 were written but never generated. This doc carries those three
forward unchanged, adds the new gaps found while auditing what the
Bespoke Spec Configurator and Ensemble builder currently hide because no
photo exists, and adds the notch-lapel width correction.

**24 Aug 2026 — customisation moved to the Cloth Room's own single-cloth
screen, not just the Ensemble builder.** Every jacket/trousers spec
variant this doc produces (notch/peak lapel, patch/flap pocket, flat/
double/belt make, belt-loop/side-adjuster waistband) was previously
reachable only by opening the Ensemble builder's Bespoke Spec drawer —
a client browsing one garment at a time on the main Cloth Room screen
could never actually see `jacket-sb-notch-patch`, `jacket-db-peak-flap`,
or `trousers-double-sideAdjusters` regardless of how many of these
prompts got generated. `getVisCustomizeHTML()` in fabric-visualiser.js
now renders a Lapel/Pockets panel for the Jacket chip and a Make/
Waistband panel for the Trousers chip, directly on that screen (single
and compare mode both) — reusing `BESPOKE_SPEC_OPTIONS`/
`VIS_ENS_STYLE_OPTIONS` and `resolveGarmentKey` as-is, no new data. Vest/
Safari/Chore have no spec options defined, so they correctly show no
panel. This is why every asset below is worth generating even before a
matching Ensemble feature exists for it — the single-cloth screen alone
now makes it selectable.

## Output specs (same as the 08-17 doc, repeated for convenience)

- **Jackets & vests**: portrait, aspect ratio 4:5, ≥1600px long edge
  (existing assets are 1289×1600).
- **Trousers**: portrait, aspect ratio 2:3, ≥1600px long edge (existing
  assets are 1073×1600).
- Background **flat pure white, RGB 255 255 255**, no shadow, no gradient
  — `tools/build-garment-assets.js` flood-fills from the frame edge to key
  the background out; a tinted or shadowed ground breaks the mask.
- Ghost-mannequin: shaped with realistic body volume, no person, no
  mannequin, no hanger visible.
- **No brand labels, neck tags, or size labels visible anywhere**
  (founder direction, 24 Aug 2026). A flat-lay source photo often shows
  a woven label at the inside collar or waistband — this must not
  survive into the edit. Every "edit this exact photograph" prompt
  below that comes from a flat lay (Gurkha, both side-adjuster
  trousers, A2, Trucker, Teba) should have this checked on the result
  even where the prompt text doesn't call it out explicitly — worn-photo
  sources (Safari, Chore) are unaffected since the collar naturally
  hides the label already, confirmed on both shipped assets.
- Dark horn-effect buttons, black lining where the front opens — **SB/DB
  tailored jackets AND vests** (`jacket-sb`, `jacket-sb-peak-*`,
  `jacket-sb-notch-patch`, `jacket-db`, `jacket-db-peak-flap`,
  `vest-sb-none`, `vest-sb-shawl`). The compositor's multiply-blend
  trick relies on a near-black lining staying near-black under any
  cloth, which is why those keep it — confirmed correct as shipped, no
  action needed on the two vest assets (25 Aug 2026: an earlier version
  of this note wrongly said vests should be unlined too — corrected).
  **Unlined applies to casual jackets and trousers only** —
  tropical-climate house style: every casual jacket (Safari, Chore, A2,
  Trucker, Teba — see #9–13 for the exact wording) and every trouser.

## Priority order

1. **Notch lapel width fix** — corrects the app's current default photo.
2. **DB vest (both lapel options)** — unlocks the whole DB three-piece,
   biggest single gap.
3. **DB peak lapel, flap pockets** — retry of a rejected generation, prompt
   already written and unused.
4. **SB notch lapel, patch pockets** — the one missing SB combination.
5. **Gurkha trousers** — real make, currently absent from the picker
   entirely. Now an edit of a real BBS photo (#6, v7) rather than a
   from-scratch generation.
6. **Trouser waistband: side adjusters (flat + double-pleat)** — also
   now an edit of a real BBS photo (#7/#8, v3).
6b. **URGENT — real belt loops (flat + pleated)** — `trousers-belt`
   has never actually shown belt loops (it shows the same side-adjuster
   construction as the other two trousers, mislabelled since it was
   first generated). See #14/#15.
7. **Casual jackets** — Safari, Chore, A2, Trucker, and Teba are all
   SHIPPED; Jungle (#16) and Sahariana (#17) are next, genuinely new
   garment silhouettes, not lapel/pocket variants of the tailored
   jacket. The Style Room picker (24 Aug 2026) now has its own
   two-tier structure for this reason — Jacket / Casual Jacket /
   Waistcoat / Trousers at the top, and once "Casual Jacket" is active
   a second row picks which one (Safari / Chore / A2 / Trucker / Teba
   / Jungle / Sahariana). All seven are already registered in
   `VIS_SINGLE_GARMENTS` (fabric-visualiser.js) with `casual: true` —
   any without a photo yet shows a "coming soon" card and self-heals
   the moment its key joins `GARMENT_ASSET_KEYS`, no further picker
   code needed once each photo lands.

---

### 1. Notch lapel, widened — replaces the current `jacket-sb` base photo

**SHIPPED 25 Aug 2026** — the widened-notch photo itself landed earlier
(23 Aug); the `JACKET_SB_LAPELS` displacement retrace this section flags
as required follow-up landed 25 Aug, in two passes. Founder ran the
flat-colour-panel prompt (left lapel solid red, right solid purple,
collar solid green) against the exact shipped `jacket-sb` source photo
through an AI image editor; the result was aligned into the same
canonical-frame transform `tools/build-garment-assets.js` applies and
colour-thresholded into polygons (saved as `images/styleBuilder/jacket-
sb-notch-flatcolour-panels.png` for provenance).

First pass shipped lapels only (collar deliberately left unbent, on the
mistaken assumption that jacket-db's own "leave the collar unbent"
precedent applied here too) and reused the existing `octx.rotate()` +
`octx.scale()` context-transform technique every other lapel/sleeve
region already used. Founder caught two problems on inspection with a
2D windowpane check (a striped cloth can't reveal either): (1) the
collar **does** need its own bend — split into a left half (bends
right, opposite its adjoining lapel), a right half (bends left), and an
unbent flat middle plateau; (2) the rotated check pattern inside the
lapel clips rendered at a visibly larger, mismatched scale than the
surrounding body — confirmed real (not an antialiasing illusion) via a
4x-supersampled re-render that still showed it. Root cause: rotating
the offscreen CONTEXT before a pattern `fillRect` is a genuine Chromium/
Skia rasterisation defect — the tiling comes out inflated under a
rotated CTM even though a pure rotation should preserve pitch. Fixed by
routing the same rotation/scale matrix through `CanvasPattern.
setTransform()` instead, verified experimentally to produce correct,
matching pitch — this fix applies to `applyClothDisplacement()` itself,
so it also corrected the already-shipped peak lapel and jacket-db, not
just this trace.

Re-verified with both `fox_flannel_chalkstripe` and
`holland_sherry_windowpane_blue`: both lapels and the collar now bend
correctly (collar halves confirmed bending in opposite directions from
each other, matching the founder's own left/right/middle description),
grid pitch matches the body everywhere, no seam/kink at any clip edge.

**Third pass, same day** — founder flagged a third, unrelated problem
on the same screenshot: a hard-edged, pure-white gap between the sleeve
and torso, present with every displacement region removed entirely (so
not a code bug at all). Traced to the raw source photo itself: ghost-
mannequin volume stands the sleeve away from the body more than a worn
garment would, letting the white studio backdrop show through a gap —
confirmed via raw luminance (pegged 253-255 with a clean silhouette-
like boundary, nothing like a highlight's soft falloff) and confirmed
NOT a mask bug (the shipped alpha was fully opaque there too, because
the gap is an enclosed island the frame-edge flood fill in
`extractMask` can never reach — it only spreads through background
connected to the frame edge). A striped cloth hid this too (reads as
"extra-bright stripes"); a windowpane check showed it as a jarring,
pattern-less pale band with no grid lines at all.

Two hand-rolled per-row fixes were tried and both looked worse than the
gap itself, in two different ways: a two-anchor colour gradient healed
the blowout but had zero grain texture and combed horizontal banding
(each row's independent blend landing at a slightly different tone);
clone-shifting a same-width strip from clean fabric alongside it fixed
the texture but produced an obvious rectangular "sticker" with a
mismatched grain direction and a hard-cut bottom edge. Both abandoned.
A third attempt — `cv2.inpaint` (Telea) masked to just the hard-
saturated core, plus a grain texture tiled on top — closed the white
gap cleanly and shipped, but got rejected too: it left the natural dark
fold-shadow immediately surrounding the gap in place, and Telea's own
smoothing blurred/interrupted a striped test cloth's lines rather than
letting them run straight through. Founder's reference for "correct":
a screenshot of `jacket-sb-peak-patch`'s own sleeve/body seam — a
*different* source photo with no gap at all, stripes running
completely uninterrupted, nothing visible there whatsoever. That's the
bar: not "a healed gap," but "no gap ever existed."

A fourth attempt grew the mask past the blown core to also cover the
darkened valley leading into it (measured: column mean drops from ~154
to ~99 over roughly 250px before the blowout — a real fold, not photo
noise or an artifact of the mask), then a SOFT-FEATHERED paste
(Gaussian-blurred alpha, not a hard-cut box) of a same-size clean patch
of real, unshaded sleeve fabric. Shipped, and still rejected on sight
("what the fuck is this?") — a faint but real tonal seam remained
visible at normal viewing scale.

A fifth attempt switched to `cv2.seamlessClone` (`NORMAL_CLONE` —
Poisson blending, which solves for the transplanted patch's own
gradient to match its surroundings rather than matching pasted content
by eye). This one genuinely closed the seam with no visible trace —
and was STILL rejected, because every single one of these five attempts
was solving the wrong problem. The founder's actual, explicit direction
(after the fifth): **"I want there to be a GAP between the sleeves and
the body, there is NOT supposed to be any sort of fill."** The
`jacket-sb-peak-patch` screenshot held up as "correct" the whole time
wasn't showing seamless fabric — it was showing a real, deliberate
transparent gap: its own alpha channel is genuinely `0` right where
this whole saga was trying to paint fabric back in. A gap between
sleeve and torso is normal, expected garment-photography negative
space; every attempt above was fighting to erase the one thing that was
supposed to be there.

**Fixed correctly**: back on the original, untouched source photo (no
healed/cloned file needed — deleted `tools/heal-jacket-sb-sleeve-
gap.py` and the healed PNG, both now dead ends). The actual bug was
never the missing fabric, it was that this gap is an ENCLOSED ISLAND —
unlike `jacket-sb-peak-patch`'s version of the same gap, which happens
to connect through to the true background, this one doesn't reach the
frame edge, so the flood fill in `extractMask` could never carve it out
and it survived as opaque "garment," rendering as a jarring blown-white
patch instead of the clean transparent gap it should have been from the
start. `GAP_ISLAND_FIXES` in `tools/build-garment-assets.js` now
flood-fills from every background-coloured pixel inside a hand-measured
search box and punches that island out of the mask directly (same
`isBackgroundish` test `extractMask` itself uses), run right after
`extractMask` so the existing erosion/fringe-cleanup passes still smooth
its edge like any other silhouette boundary. Verified: the resulting
alpha channel matches `jacket-sb-peak-patch`'s own gap shape closely,
and compositing the render against a coloured background confirms the
gap is genuinely transparent, connecting to the true edge near the
shoulder the same way the reference does.

**Two follow-ups, same day.** First: the gap punch above only found and
fixed the LEFT side — the right sleeve/torso seam was still solid
fabric, missed simply because nobody searched for it. Added a mirrored
box (`{x:0.71,y:0.40,w:0.14,h:0.34}`) and confirmed the same fractional
coordinates land cleanly on a matching natural gap in `jacket-sb-notch-
patch`'s own source photo too (same widened-notch generation batch —
tried the exact same box against it rather than guessing new numbers,
and it worked first try). Both keys now get both sides.

Second: a fine pinstripe (`scabal_pinstripe_navy`, pitch 12) revealed
the plain body panel renders at the cloth's true, defined pitch (12,
measured) while `JACKET_SB_SLEEVES_V2`'s existing `strength: 0.74`
compresses the sleeves to pitch 9 — a mismatch invisible on every
bolder pattern used before. This "roundness" compression on sleeves is
long-standing convention across every garment in this file, not new;
the fine pinstripe just finally exposed it. Founder call: the sleeve's
compressed size is the one that reads correctly, so the body should
match it, not the reverse. Added `JACKET_SB_BODY_SCALE` — one box
spanning the whole canvas, angle 0 (unrotated, matching "anything that
isn't shaded points up"), `strength: 0.74` — positioned FIRST in
`jacket-sb`'s `DISPLACEMENT_REGIONS` entry so every later, more
specific region (lapel 0.82, collar 0.82, sleeve 0.74) still draws its
own distinct scale on top of it within its own clip, unchanged. Scoped
to `jacket-sb` only for now — the same body/sleeve mismatch likely
exists on every other garment too, but wasn't in scope of what was
asked. Re-measured: body and sleeve pitch both landed at 9px after the
fix (were 12 vs 9). No regression on `fox_flannel_chalkstripe` or
`holland_sherry_windowpane_blue`.

**Founder correction (23 Aug 2026): the shipped notch lapel reads too
narrow. Widen it to at least 4" (≈10cm) at its widest point** — still a
true notch (clean V where collar meets lapel), not a peak, just cut fuller
than the original 8.5cm generation.

This is the app's *default* look — every client who never opens the
Bespoke Spec drawer sees this photo. Regenerating it also means the hand-
traced `JACKET_SB_LAPELS` region in `garment-photo.js` will need retracing
(a wider lapel changes where a patterned cloth should bend) — flag that as
follow-up work once the new photo lands, not part of the image generation
itself.

```
Ghost-mannequin product photograph of a men's single-breasted sport
coat, front view, centred and symmetric, camera at chest height. Light
heather-grey wool flannel with visible cloth grain, no pattern. STANDARD
NOTCH LAPELS, cut generously full — the collar meets the lapel in a
clean V-shaped notch, wide and substantial, at least 10cm (4 inches)
across the lapel at its widest point, a classic full-cut look rather
than a slim modern lapel. Still a true notch, not a peak — the notch
gap itself stays a clean, moderate V, only the lapel body is wider.
Two-button front, buttons dark horn-effect, positioned mid-torso. Two
FLAP POCKETS at the hips — a rectangular flap of the same cloth covers
the pocket opening, edges pressed flat, no visible pocket bag beneath.
One welt breast pocket, no pocket square. Single centre back vent (not
visible from front). Black lining visible through the open front. The
garment is shaped with realistic chest, shoulder and sleeve volume as
if worn by an invisible body — NOT laid flat, NOT on a hanger, NOT on a
visible mannequin or dress form, no person visible. Pure flat white
background, RGB 255 255 255, no shadow, no gradient, no visible horizon
line. Soft even studio lighting, no hard highlights. Portrait
orientation, aspect ratio 4:5, sharp focus edge to edge, commercial
e-commerce product photography style.
```

### 2. Double-breasted vest, no lapel — `vest-db-none`

```
Ghost-mannequin product photograph of a men's double-breasted waistcoat
(vest), front view, centred and symmetric, camera at chest height.
Light heather-grey wool flannel with visible cloth grain, no pattern,
matching a tailored suit. DOUBLE-BREASTED FRONT — two parallel columns
of buttons, six buttons total in a 2x3 arrangement, all purely
decorative except the functioning wrap fastens off-centre beneath the
overlapping left panel. Buttons dark horn-effect. NO LAPEL — a plain
high V-neckline with no collar or lapel roll, clean cut straight from
the shoulder seam down to the notch of the V. Four welt pockets at the
waist, no flaps. Squared-off bottom edge (not the traditional pointed
waistcoat hem). Adjustable strap visible at the centre back hem, same
cloth. Black lining visible at the front edges. The garment is shaped
with realistic chest and torso volume as if worn by an invisible body —
NOT laid flat, NOT on a hanger, NOT on a visible mannequin or dress
form, no person visible, no shirt or jacket underneath. Pure flat white
background, RGB 255 255 255, no shadow, no gradient, no visible horizon
line. Soft even studio lighting, no hard highlights. Portrait
orientation, aspect ratio 4:5, sharp focus edge to edge, commercial
e-commerce product photography style.
```

### 3. Double-breasted vest, shawl lapel — `vest-db-shawl`

Same prompt as #2, with one substitution: replace *"NO LAPEL — a plain
high V-neckline with no collar or lapel roll, clean cut straight from
the shoulder seam down to the notch of the V"* with:

```
SHAWL LAPEL — a continuous rolled lapel with no notch or peak, curving
smoothly from the shoulder seam down around the neckline in one
unbroken line, meeting its mirror at a low V-point at the top button
```

### 4. Double-breasted, peak lapel, flap pockets — `jacket-db-peak-flap`

Unchanged from `docs/2026-08-17-bespoke-spec-image-prompts.md` #6 — written
and approved, never generated. The first attempt at this combination added
an unrequested ticket pocket; the prompt below already carries the negative
instruction that heads that off.

```
Ghost-mannequin product photograph of a men's double-breasted sport
coat, front view, centred and symmetric, camera at chest height. Light
heather-grey wool flannel with visible cloth grain, no pattern. Peak
lapels, standard double-breasted width. Six-button front in a 2x3
arrangement, two buttons functional at the wrap, buttons dark
horn-effect. Two FLAP POCKETS at the hips ONLY — a rectangular flap of
the same cloth covers each pocket opening, edges pressed flat, no
visible pocket bag beneath. Exactly two hip pockets total, one per
side. DO NOT add a ticket pocket (no second, smaller flap or pocket
above either hip pocket) — house style never uses one. One welt breast
pocket, no pocket square. Black lining visible through the open front.
The garment is shaped with realistic chest, shoulder and sleeve volume
as if worn by an invisible body — NOT laid flat, NOT on a hanger, NOT
on a visible mannequin or dress form, no person visible. Pure flat
white background, RGB 255 255 255, no shadow, no gradient, no visible
horizon line. Soft even studio lighting, no hard highlights. Portrait
orientation, aspect ratio 4:5, sharp focus edge to edge, commercial
e-commerce product photography style.
```

### 5. Single-breasted, notch lapel (widened), patch pockets — `jacket-sb-notch-patch`

Pairs the #1 lapel correction with patch pockets, so this combination
should be generated *after* #1 is finalised, matching its lapel width.

```
Ghost-mannequin product photograph of a men's single-breasted sport
coat, front view, centred and symmetric, camera at chest height. Light
heather-grey wool flannel with visible cloth grain, no pattern. STANDARD
NOTCH LAPELS, cut generously full — the collar meets the lapel in a
clean V-shaped notch, wide and substantial, at least 10cm (4 inches)
across the lapel at its widest point, a classic full-cut look rather
than a slim modern lapel. Still a true notch, not a peak. Two-button
front, buttons dark horn-effect, positioned mid-torso. Two ROUNDED
PATCH POCKETS at the hips — no flap, stitched border, curved bottom
corners, sewn on top of the fabric (not inset). One welt breast pocket,
no pocket square. Single centre back vent (not visible from front).
Black lining visible through the open front. The garment is shaped with
realistic chest, shoulder and sleeve volume as if worn by an invisible
body — NOT laid flat, NOT on a hanger, NOT on a visible mannequin or
dress form, no person visible. Pure flat white background, RGB 255 255
255, no shadow, no gradient, no visible horizon line. Soft even studio
lighting, no hard highlights. Portrait orientation, aspect ratio 4:5,
sharp focus edge to edge, commercial e-commerce product photography
style.
```

### 6. Gurkha trousers (single Gurkha) — `trousers-gurkha`

**v7 (23 Aug 2026) — pivot from generation to an edit of a real BBS
garment.** v2–v6 iterated a from-scratch text-to-image generation
through six rounds (strap count, waistband height, hardware type twice)
and it still read wrong every time — the same lesson this project
already learned the hard way on the peak lapel (see
`docs/2026-08-17-bespoke-spec-image-prompts.md` #8): editing an exact
real photo preserves cut and proportion far better than describing one
from zero. The founder supplied a real photo of an actual BBS double
Gurkha (`BBST2606004-1.jpg`) — correct wide straight leg, correct twin
pleats, correct turn-up cuffs, all already right; it just needs to
become a single Gurkha, ghost-mannequin, on white, in the house cloth
colour. This prompt edits that exact photo rather than generating
fresh. **Feed the actual source image in as the base for this edit —
don't run it as a text-only prompt**, the same rule as every other
edit-based prompt in this doc's companion.

If v7 still doesn't land (edit access unavailable, or the model still
gets the cut wrong), v6 below is kept as the from-scratch fallback —
try v7 first.

```
Edit this exact photograph. This is a real Benjamin Barker Studios
double Gurkha trouser, currently shown as a flat lay in black wool on a
grey background. Turn it into a single Gurkha, ghost-mannequin product
photograph for the catalogue — change only what's listed below, keep
everything else about the cut exactly as shown.

KEEP EXACTLY AS SHOWN, unchanged: the twin forward pleats on each leg,
the wide straight leg with no taper, the turn-up cuffs at the hem, the
overall leg length and proportions, the general shape and height of the
self-fabric waistband.

CHANGE:
1. Reshape from a flat lay into a GHOST-MANNEQUIN pose — the trousers
   filled with realistic hip and leg volume as if worn by an invisible
   body, standing, front view, centred and symmetric, camera at
   waist-to-ankle height, full length visible. Not laid flat, no person
   or mannequin visible.
2. Recolour the cloth from black to a LIGHT HEATHER-GREY WOOL FLANNEL,
   visible cloth grain, no pattern.
3. Change the waist closure from a DOUBLE Gurkha to a SINGLE Gurkha:
   remove the right-hip strap and buckle entirely so the right side of
   the waistband is plain, uninterrupted cloth. Keep only the left-hip
   tab, extended across the front to a RECTANGULAR PRONG BUCKLE (a
   metal frame with a single pin, antique-brass/gold-toned — the same
   mechanism as an ordinary belt, NOT rings, NOT a D-ring) mounted
   centrally at the front of the waistband. The tab has a short row of
   plain sewn fabric buttonholes (ordinary stitched slits, no metal
   grommet) for the prong to fasten through. The tab and buckle sit
   level and horizontal, flush with the waistband's own top and bottom
   edges — not sloping or drooping down.
4. If the waistband currently reads taller than about 2 inches (5cm),
   trim it down to that height — a modest extended waistband, not a
   tall corset-like band.
5. Change the background from grey to pure flat white, RGB 255 255
   255, no shadow, no gradient, no visible horizon line. Soft even
   studio lighting, no hard highlights.
6. UNLINED: if any lining is visible at the waistband opening, replace
   it with the same outer cloth — no dark or contrasting lining
   anywhere. Tropical-climate house style never lines a trouser.

Do not alter the fly, pocket construction, hem, pleats, or leg
silhouette beyond what's listed above. Portrait orientation, aspect
ratio 2:3, sharp focus edge to edge, commercial e-commerce product
photography style.
```

<details>
<summary>v6 — from-scratch generation fallback, if the edit approach above doesn't work</summary>

```
Ghost-mannequin product photograph of men's Gurkha trousers, front
view, centred and symmetric, camera at waist-to-ankle height, full
length visible. Light heather-grey wool flannel with visible cloth
grain, no pattern. SELF-FABRIC EXTENDED WAISTBAND, exactly 2 INCHES
(5cm) TALL — taller than a standard 1-inch trouser waistband, but only
modestly so, NOT a tall corset-like band. SINGLE GURKHA CLOSURE — ONE
wide tab of the same cloth extends from the left side of the waistband
across the front to a RECTANGULAR PRONG BUCKLE mounted CENTRALLY at the
front of the waistband, roughly on the trouser's own centre line. This
is the SAME mechanism as an ordinary belt buckle: a rectangular metal
frame (antique-brass/gold-toned) with a single pin/prong, and the
fabric tab has a short row of plain sewn fabric BUTTONHOLES — ordinary
stitched buttonhole slits, the same construction as a shirt buttonhole,
with NO metal grommet or eyelet ring around them — so the prong can
fasten through one of them to adjust the fit. NOT two rings, NOT a
D-ring, NOT a flat slider clasp, NOT metal eyelets — one prong, one
frame, plain stitched buttonhole slits on the strap. The tab lies level and horizontal,
flush with the waistband's top and bottom edges — it must NOT slope or
droop downward, and the buckle must NOT sit lower than the waistband
itself or down near the side seam. This is the ONLY closure at the
waist — do not add a second strap or a symmetric criss-cross.
NO belt loops anywhere. NO separate belt. Two wide forward-facing
pleats on each side of the fly, pressed sharp, continuing into a single
crease down the centre of each leg. STRAIGHT, GENEROUSLY WIDE LEG —
noticeably fuller through the thigh and down the leg than a slim modern
trouser, a classic full straight cut with no taper toward the ankle.
TURN-UP CUFFS at the hem, a clean folded band of the same cloth at the
bottom of each leg, proper full length breaking just at the shoe. Fly
fastens with a hidden button under a flat fabric fly front, no visible
waistband button. COMPLETELY UNLINED, INSIDE AND OUT — this is critical:
where the waistband opens at the centre front, the INSIDE of the
waistband and fly must be the exact same light heather-grey cloth as
the outside, with NO dark, black, or contrasting lining fabric visible
anywhere, including at the top opening edge. Tropical-climate house
style never lines a trouser. The garment is shaped with realistic hip
and leg volume as if worn by an invisible body — NOT laid flat, NOT on
a hanger, no person visible. Pure flat white background, RGB 255 255
255, no shadow, no gradient, no visible horizon line. Soft even studio
lighting, no hard highlights. Portrait orientation, aspect ratio 2:3
(taller and narrower than a jacket shot), sharp focus edge to edge,
commercial e-commerce product photography style.
```
</details>

### 8. Double forward-pleat trousers, side-adjuster waistband — `trousers-double-sideAdjusters`

**v3 (23 Aug 2026) — same pivot as Gurkha v7: edit a real BBS photo
instead of generating from scratch.** v1/v2 (below, kept as fallback)
were text-to-image and never generated. The founder supplied a real
photo of an actual BBS side-adjuster trouser with pleats
(`FA966792-0D96-43BD-8ADC-7C547AF13BB2.jpg`) — correct twin pleats,
correct wide straight leg, correct turn-up cuffs, and the exact
waistband construction already: an extended tab at EACH hip with a
small squared gold-toned buckle, plus a small button at the centre
front. This prompt edits that exact photo. **Feed the actual source
image in as the base — don't run this as text-only.**

```
Edit this exact photograph. This is a real Benjamin Barker Studios
trouser, currently shown as a flat lay in dark olive wool on a grey
background. Turn it into a ghost-mannequin product photograph for the
catalogue — change only what's listed below, keep everything else
about the cut exactly as shown.

KEEP EXACTLY AS SHOWN, unchanged: the twin forward pleats on each leg,
the wide straight leg with no taper, the turn-up cuffs at the hem, the
overall leg length and proportions, the extended self-fabric tab at
EACH hip with its small squared gold-toned buckle, the small button at
the centre front of the waistband.

CHANGE:
1. Reshape from a flat lay into a GHOST-MANNEQUIN pose — the trousers
   filled with realistic hip and leg volume as if worn by an invisible
   body, standing, front view, centred and symmetric, camera at
   waist-to-ankle height, full length visible. Not laid flat, no person
   or mannequin visible.
2. Recolour the cloth from dark olive to a LIGHT HEATHER-GREY WOOL
   FLANNEL, visible cloth grain, no pattern (matching the house's other
   product photography).
3. Change the background from grey to pure flat white, RGB 255 255
   255, no shadow, no gradient, no visible horizon line. Soft even
   studio lighting, no hard highlights.
4. UNLINED: if any lining is visible at the waistband opening, replace
   it with the same outer cloth — no dark or contrasting lining
   anywhere. Tropical-climate house style never lines a trouser.

Do not alter the fly, pocket construction, hem, pleats, waistband
tabs/buckles, or leg silhouette beyond what's listed above. Portrait
orientation, aspect ratio 2:3, sharp focus edge to edge, commercial
e-commerce product photography style.
```

### 7. Flat front trousers, side-adjuster waistband — `trousers-flat-sideAdjusters`

**v3 (23 Aug 2026) — same source photo as #8 above, with the pleats
edited out.** Run #8's edit first (or reuse its result as the base for
this one) — same instructions, plus this one substitution to the KEEP
list:

Replace *"the twin forward pleats on each leg"* with:

```
a FLAT FRONT instead of the pleats shown in the source photo — remove
both pleats entirely and press a single flat crease down the centre of
each leg. Keep the waistband, tabs, buckles, button, leg width, cuffs,
and length exactly as shown in the source.
```

<details>
<summary>v1/v2 — from-scratch generation fallback, if the edit approach above doesn't work</summary>

```
Ghost-mannequin product photograph of men's tailored trousers, front
view, centred and symmetric, camera at waist-to-ankle height, full
length visible. Light grey wool, flat front (no pleats), single crease
pressed down the centre of each leg, straight leg, no visible cuff.
EXTENDED SELF-FABRIC TAB AT EACH HIP — a pointed, V-shaped flap of the
same cloth extends upward from the top of the waistband at both the
left and right hip, matching the shape of a standard extended
waistband tab. Mounted on EACH tab, a small SQUARED METAL CINCH BUCKLE
(a rectangular metal frame with a centre bar, not a button, not a
D-ring) — a short strap of the same cloth threads back through its own
buckle to cinch the waist, symmetric on both sides. NO belt loops
anywhere on the waistband. Fly fastens with a hidden button, no visible
separate waistband button beyond the two buckles. A narrow fob-pocket
edge just visible at the right hip. UNLINED — no visible lining
anywhere, waistband interior is the same cloth as the outside, house
style is fully unlined trousers (tropical climate). The garment is
shaped with realistic hip and leg volume as if worn by an invisible
body — NOT laid flat, NOT on a hanger, no person visible. Pure flat
white background, RGB 255 255 255, no shadow, no gradient, no visible
horizon line. Soft even studio lighting, no hard highlights. Portrait
orientation, aspect ratio 2:3 (taller and narrower than a jacket shot),
sharp focus edge to edge, commercial e-commerce product photography
style.
```

For #8 (double-pleat) from this same fallback, substitute *"flat front
(no pleats), single crease"* with:

```
two forward-facing pleats on each side of the fly, pleats pressed
sharp and facing toward the pockets (not toward the fly), continuing
into a single crease pressed down the centre of each leg below the knee
```
</details>

### 9. Safari jacket — `jacket-safari`

**SHIPPED 24 Aug 2026** — the v2 generation below was clean and is now
in `GARMENT_ASSET_KEYS`/`SOURCES`, selectable from the Cloth Room's
"Safari Jacket" chip.

**v2, corrected against a real generation (founder feedback, 23 Aug
2026).** v1 (first version below this note) worked well overall — clean
ghost-mannequin, correct collar/pockets, correctly unlined per the
founder's own edit to that instruction — but the self-fabric belt
rendered as a full wrap-around strap with a squared buckle that visibly
pinched the waist, trench-coat style ("no sash, waist shouldn't look
cinched"). v2 drops the belt entirely rather than trying to describe a
non-cinching version of it — the reference photo has one, but house
style doesn't need to match that detail. Also folds in the founder's
own "unlined" correction to point 4, which the v1 prompt below still
had as "black lining" — kept here as a record of what the working
edit actually said, but v2 is the one to run next.

**Wiring note stands from v1** — first "casual jacket," a genuinely
different silhouette from the tailored SB/DB jackets, not a
lapel/pocket variant of them. See the wiring section below the prompt.

```
Edit this exact photograph. This is a real safari jacket worn by a
model, shown with a striped shirt underneath. Turn it into a
ghost-mannequin product photograph for the catalogue — change only
what's listed below, keep the jacket's own construction exactly as
shown.

KEEP EXACTLY AS SHOWN, unchanged: the shirt-style notched collar (a
flat, pointed collar with no tailored lapel roll or gorge seam), the
four box-pleated patch pockets with buttoned flaps (two smaller ones at
the chest, two larger ones at the hip, each with a centre box-pleat
that lets the pocket expand), the single-breasted button-front closure
and button spacing, the sleeve and shoulder construction, the overall
proportions and length.

CHANGE:
1. Remove the person entirely — no head, face, neck, arms, or skin
   visible. Remove the striped shirt underneath completely, including
   its collar peeking out at the neck.
2. Reshape into a GHOST-MANNEQUIN pose — the jacket filled with
   realistic chest, shoulder and sleeve volume as if worn by an
   invisible body, front view, centred and symmetric, camera at chest
   height, standing straight, arms hanging naturally at the sides (not
   the model's current arm position if it differs). Not laid flat, no
   mannequin or hanger visible.
3. REMOVE THE WAIST BELT ENTIRELY — no self-fabric strap, no buckle, no
   belt loops or tabs at the waist. The jacket falls straight from
   chest to hem with no cinch, gather, or pinch at the waist — a plain
   continuous body, the same width through the torso as at the chest,
   not a trench-coat silhouette.
4. Recolour the cloth from its current raw-linen colour to a LIGHT
   HEATHER-GREY WOOL FLANNEL, visible cloth grain, no pattern (matching
   the house's other product photography) — the pocket construction,
   pleats, and stitching detail should still read clearly through the
   new colour and texture.
5. UNLINED — wherever the front opens even slightly, the inside should
   read as the same outer cloth, not a contrasting lining. This is a
   lightweight warm-weather jacket; house style doesn't line it.
6. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the collar shape, pocket count/construction, button
placement, or silhouette beyond what's listed above (note: this now
includes removing the belt — that is a deliberate change from the
source photo, not an omission). Portrait orientation, aspect ratio 4:5,
sharp focus edge to edge, commercial e-commerce product photography
style.
```

<details>
<summary>v1 — first version, produced a good result except for the belt/waist cinch</summary>

```
Edit this exact photograph. This is a real safari jacket worn by a
model, shown with a striped shirt underneath. Turn it into a
ghost-mannequin product photograph for the catalogue — change only
what's listed below, keep the jacket's own construction exactly as
shown.

KEEP EXACTLY AS SHOWN, unchanged: the shirt-style notched collar (a
flat, pointed collar with no tailored lapel roll or gorge seam), the
four box-pleated patch pockets with buttoned flaps (two smaller ones at
the chest, two larger ones at the hip, each with a centre box-pleat
that lets the pocket expand), the single-breasted button-front closure
and button spacing, the self-fabric belt visible at the waist, the
sleeve and shoulder construction, the overall proportions and length.

CHANGE:
1. Remove the person entirely — no head, face, neck, arms, or skin
   visible. Remove the striped shirt underneath completely, including
   its collar peeking out at the neck.
2. Reshape into a GHOST-MANNEQUIN pose — the jacket filled with
   realistic chest, shoulder and sleeve volume as if worn by an
   invisible body, front view, centred and symmetric, camera at chest
   height, standing straight, arms hanging naturally at the sides (not
   the model's current arm position if it differs). Not laid flat, no
   mannequin or hanger visible.
3. Recolour the cloth from its current raw-linen colour to a LIGHT
   HEATHER-GREY WOOL FLANNEL, visible cloth grain, no pattern (matching
   the house's other product photography) — the pocket construction,
   pleats, and stitching detail should still read clearly through the
   new colour and texture.
4. Wherever the front opens even slightly, show black lining glimpsed
   beneath, the same convention as every other jacket in this
   catalogue (the compositor's cloth-recolouring trick needs a
   near-black lining to stay dark under any cloth).
5. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the collar shape, pocket count/construction, belt,
button placement, or silhouette beyond what's listed above. Portrait
orientation, aspect ratio 4:5, sharp focus edge to edge, commercial
e-commerce product photography style.
```
</details>

**Wiring done ahead of the photo (23 Aug 2026).** Casual jackets turned
out to belong to the Cloth Room's single-cloth picker
(`VIS_SINGLE_GARMENTS` in fabric-visualiser.js — the Style Room garment
picker, not the Ensemble builder's `VIS_ENS_STYLE_OPTIONS`), as their
own chips ("Safari Jacket", "Chore Jacket" — see #10 below), each
resolving through `resolveGarmentKey("jacket", { closure: "safari" })`
/ `{ closure: "chore" }`. Since neither photo exists yet, a new
`getVisGarmentHasPhoto()` check gates the stage: picking either chip
today shows a "photography is on its way" card instead of a
canvas that would 404 against a missing image, in both single and
compare mode. The moment `jacket-safari` (or `jacket-chore`) joins
`GARMENT_ASSET_KEYS` via the steps below, that check flips true
automatically and the real photo takes over — no picker code changes
needed at that point. No lapel retrace is needed for either — a shirt
collar or camp collar doesn't roll the way a notch/peak lapel does, so
`JACKET_SB_LAPELS`/`JACKET_DB_LAPELS` don't apply; a patterned cloth
simply won't bend specially at the collar (fine for a first pass, same
as any garment area with no traced displacement region).

### 10. Chore jacket — `jacket-chore`

**SHIPPED 24 Aug 2026** — first-attempt generation matched the brief
exactly, no correction round needed. In `GARMENT_ASSET_KEYS`/`SOURCES`,
selectable from the "Chore Jacket" chip.

**Second "casual jacket," same picker treatment as Safari (#9).**
Founder-supplied reference:
a camp collar (flatter, wider open collar than safari's, still no
tailored lapel roll), a SINGLE patch chest pocket (not two), two plain
patch pockets at the hip with no flap and no button, five-button
single-breasted front, cuffed sleeve ends. Also shown worn, on a warm
studio backdrop rather than white, so the edit strips the person out
the same way #9's does.

```
Edit this exact photograph. This is a real chore jacket worn by a
model over a sweater. Turn it into a ghost-mannequin product
photograph for the catalogue — change only what's listed below, keep
the jacket's own construction exactly as shown.

KEEP EXACTLY AS SHOWN, unchanged: the camp collar (a flat, wide, open
notched collar with no tailored lapel roll or gorge seam — flatter and
wider than a shirt collar), the single patch chest pocket on the
left, the two plain patch pockets at the hips (no flap, no button,
just an open patch pocket sewn on), the five-button single-breasted
front and button spacing, the turned-back cuffs at the sleeve ends,
the overall proportions and length.

CHANGE:
1. Remove the person entirely — no head, face, neck, arms, hands, or
   skin visible. Remove the sweater underneath completely, including
   any of it visible at the neck or cuffs.
2. Reshape into a GHOST-MANNEQUIN pose — the jacket filled with
   realistic chest, shoulder and sleeve volume as if worn by an
   invisible body, front view, centred and symmetric, camera at chest
   height, standing straight, arms hanging naturally at the sides. Not
   laid flat, no mannequin or hanger visible.
3. Recolour the cloth from its current beige slubbed-linen colour to a
   LIGHT HEATHER-GREY WOOL FLANNEL, visible cloth grain, no pattern
   (matching the house's other product photography) — the pocket
   construction and stitching detail should still read clearly through
   the new colour and texture.
4. Wherever the front opens even slightly, show black lining glimpsed
   beneath, the same convention as every other jacket in this
   catalogue.
5. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the collar shape, pocket count/construction, button
placement, cuffs, or silhouette beyond what's listed above. Portrait
orientation, aspect ratio 4:5, sharp focus edge to edge, commercial
e-commerce product photography style.
```

### 11. A2 flight jacket (blouson) — `jacket-a2`

**SHIPPED 24 Aug 2026** — first-attempt generation matched the brief,
no correction round needed. In `GARMENT_ASSET_KEYS`/`SOURCES`, selectable
from the Casual Jacket sub-picker's "A2 Flight Jacket" chip.

**Third "casual jacket."** Founder-supplied reference:
a real BBS flat lay, cream linen. Notched shirt-style collar (no lapel
roll), raglan sleeves (a diagonal seam runs from the collar straight to
the underarm, not a set-in shoulder seam), two chest-level flap pockets
each closed by its own small buttoned strap on the flap, concealed
button-front placket, and the two things that make this an A2/blouson
rather than a chore or safari cut: an ELASTICATED, GATHERED WAIST HEM
(the bottom band is ruched, not a plain straight hem) and elasticated
cuffs with their own adjustable buttoned strap tab. Cropped length,
ends at the waist. Same edit-a-real-photo approach as the rest of this
doc — the source is already a flat lay, not worn, so this edit is
simpler than Safari/Chore's (no person or shirt to strip out).

**Unlined — house style, all casual jackets (founder direction, 24 Aug
2026: tropical climate).**

```
Edit this exact photograph. This is a real A2-style flight jacket
(blouson), currently shown as a flat lay in cream linen. Turn it into a
ghost-mannequin product photograph for the catalogue — change only
what's listed below, keep the jacket's own construction exactly as
shown.

KEEP EXACTLY AS SHOWN, unchanged: the notched shirt-style collar (flat,
no tailored lapel roll or gorge seam), the RAGLAN SLEEVES (a diagonal
seam running from the collar straight down to the underarm on each
side — not a set-in shoulder seam, the sleeve and shoulder are one
continuous panel), the two chest-level flap pockets each with their own
small buttoned strap closing the flap, the concealed button-front
placket and button spacing, the ELASTICATED GATHERED HEM at the waist
(the bottom edge is visibly ruched/gathered, not a flat straight hem),
the elasticated cuffs each with their own small adjustable buttoned
strap tab, the cropped length ending at the waist.

CHANGE:
1. Reshape into a GHOST-MANNEQUIN pose — the jacket filled with
   realistic chest, shoulder and sleeve volume as if worn by an
   invisible body, front view, centred and symmetric, camera at chest
   height, standing straight, arms hanging naturally at the sides. Not
   laid flat, no mannequin or hanger visible. The gathered waist hem
   and cuffs should still read as gathered/elasticated on the
   dimensional body, not smoothed flat.
2. Recolour the cloth from its current cream linen colour to a LIGHT
   HEATHER-GREY WOOL FLANNEL, visible cloth grain, no pattern (matching
   the house's other product photography) — the pocket straps,
   gathered seams, and stitching detail should still read clearly
   through the new colour and texture.
3. UNLINED — wherever the front opens even slightly, the inside should
   read as the same outer cloth, not a contrasting lining. Tropical-
   climate house style doesn't line its casual jackets.
4. REMOVE ANY BRAND LABEL, NECK TAG, OR SIZE LABEL — the source photo
   may show a woven label sewn at the inside collar. It must not appear
   in the result; that area should read as plain cloth, the same as the
   rest of the inside collar.
5. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the collar shape, raglan seam, pocket construction,
elasticated hem/cuffs, button placement, or silhouette beyond what's
listed above. Portrait orientation, aspect ratio 4:5, sharp focus edge
to edge, commercial e-commerce product photography style.
```

### 12. Trucker jacket — `jacket-trucker`

**SHIPPED 24 Aug 2026** — matched the brief, no correction round
needed (including the brand-label removal — the source photo's
"BBS Edition Capsule" tag did not survive into the result). Selectable
from the Casual Jacket sub-picker's "Trucker Jacket" chip.

**Fourth "casual jacket."** Founder-supplied
reference: a real BBS flat lay, khaki twill. Classic Western trucker
construction: pointed shirt-style collar, a YOKE SEAM across the chest
(a V-shaped seam running from each shoulder down to the centre front,
the panel above it is a separate piece from the body below), two chest
flap pockets each closed by a single button (no strap, the button goes
straight through the flap), a full button-front placket (many small
buttons closely spaced down the front), SIDE-TAB WAIST ADJUSTERS (a
short tab with buttonholes at each side seam near the hem, used to
cinch the waist), and button cuffs. Cropped, fitted length ending at
the hip.

**Unlined — house style, all casual jackets.**

```
Edit this exact photograph. This is a real trucker jacket, currently
shown as a flat lay in khaki twill. Turn it into a ghost-mannequin
product photograph for the catalogue — change only what's listed below,
keep the jacket's own construction exactly as shown.

KEEP EXACTLY AS SHOWN, unchanged: the pointed shirt-style collar, the
YOKE SEAM across the chest (a V-shaped seam running from each shoulder
down to the centre front — a distinct upper chest panel stitched to the
body below it, the classic Western/trucker construction), the two chest
flap pockets each closed by a single button straight through the flap
(no strap), the full button-front placket with its close button
spacing, the SIDE-TAB WAIST ADJUSTERS (a short tab with buttonholes at
each side seam near the hem, used to cinch the waist), the button
cuffs, the cropped fitted length ending at the hip.

CHANGE:
1. Reshape into a GHOST-MANNEQUIN pose — the jacket filled with
   realistic chest, shoulder and sleeve volume as if worn by an
   invisible body, front view, centred and symmetric, camera at chest
   height, standing straight, arms hanging naturally at the sides. Not
   laid flat, no mannequin or hanger visible.
2. Recolour the cloth from its current khaki colour to a LIGHT
   HEATHER-GREY WOOL FLANNEL, visible cloth grain, no pattern (matching
   the house's other product photography) — the yoke seam, pocket
   flaps, and stitching detail should still read clearly through the
   new colour and texture.
3. UNLINED — wherever the front opens even slightly, the inside should
   read as the same outer cloth, not a contrasting lining. Tropical-
   climate house style doesn't line its casual jackets.
4. REMOVE THE BRAND LABEL — the source photo shows a woven "BBS Edition
   Capsule" tag sewn at the inside collar. It must not appear in the
   result; that area should read as plain cloth, the same as the rest
   of the inside collar.
5. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the collar shape, yoke seam, pocket construction, side-tab
adjusters, button placement, or silhouette beyond what's listed above.
Portrait orientation, aspect ratio 4:5, sharp focus edge to edge,
commercial e-commerce product photography style.
```

### 13. Teba jacket — `jacket-teba`

**SHIPPED 24 Aug 2026** — the stand/band collar generated correctly
(the detail flagged above as worth double-checking held up). Selectable
from the Casual Jacket sub-picker's "Teba Jacket" chip.

**Fifth "casual jacket."** Founder-supplied reference
(the house's own Teba, not the generic silhouette the name usually
implies — checked the actual photo rather than assuming): off-white
cotton, flat lay. A STAND/BAND COLLAR (a short upright mandarin-style
collar with no lapel or roll at all, closing with one button right at
the throat) — this is the detail most worth double-checking against the
generation, since it's the unusual one. Raglan sleeves (same diagonal
seam as the A2, not a set shoulder). Four patch pockets: two smaller
ones at the chest each with a single-button flap, two larger ones at
the hip each with a flap but no visible button. A four-button front
placket. Button cuffs.

**Unlined — house style, all casual jackets.**

```
Edit this exact photograph. This is a real Teba-style jacket, currently
shown as a flat lay in off-white cotton. Turn it into a ghost-mannequin
product photograph for the catalogue — change only what's listed below,
keep the jacket's own construction exactly as shown.

KEEP EXACTLY AS SHOWN, unchanged: the STAND/BAND COLLAR — a short
upright mandarin-style collar with NO lapel, NO roll, NO notch, closing
with a single button right at the throat (this is not a shirt collar or
a lapel — it stands straight up, does not fold open) — the RAGLAN
SLEEVES (a diagonal seam running from the collar straight down to the
underarm on each side, not a set-in shoulder seam), the four patch
pockets — two smaller pockets at the chest each with a single-button
flap, two larger pockets at the hip each with a flap but NO button —
the four-button front placket and its spacing, the button cuffs.

CHANGE:
1. Reshape into a GHOST-MANNEQUIN pose — the jacket filled with
   realistic chest, shoulder and sleeve volume as if worn by an
   invisible body, front view, centred and symmetric, camera at chest
   height, standing straight, arms hanging naturally at the sides. Not
   laid flat, no mannequin or hanger visible.
2. Recolour the cloth from its current off-white colour to a LIGHT
   HEATHER-GREY WOOL FLANNEL, visible cloth grain, no pattern (matching
   the house's other product photography) — the collar stand, raglan
   seams, pocket flaps, and stitching detail should still read clearly
   through the new colour and texture.
3. UNLINED — wherever the front opens even slightly, the inside should
   read as the same outer cloth, not a contrasting lining. Tropical-
   climate house style doesn't line its casual jackets.
4. REMOVE ANY BRAND LABEL, NECK TAG, OR SIZE LABEL — the source photo
   may show a woven label sewn at the inside collar. It must not appear
   in the result; that area should read as plain cloth, the same as the
   rest of the inside collar.
5. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the collar shape (it must stay a stand collar, not become
a lapel or shirt collar), raglan seams, pocket construction, button
placement, or silhouette beyond what's listed above. Portrait
orientation, aspect ratio 4:5, sharp focus edge to edge, commercial
e-commerce product photography style.
```

### 14. Flat front trousers, REAL belt loops — corrects `trousers-belt`

**v4, new source photo (founder, 25 Aug 2026)** — pivots from editing
BBS's own `trousers-belt.webp` (v1–v3, all superseded, collapsed below)
to editing a second Mr Porter reference the founder supplied directly
for this: a brown herringbone flat-front trouser that already has the
exact right waistband construction — narrow belt loops at the sides,
a small extended tab with a button at centre front (confirmed by direct
inspection: the same tab-and-button detail v3 was already describing
from the first Mr Porter reference, corroborated independently on a
second photo). Founder's own framing: "the only thing that needs
changing is colour and whether it has pleats or no pleats, and it can
be slightly wider cut" — this reference already has no pleats, so #14
only needs a recolour and a touch more width; #15 (next entry) needs
pleats added on top of that.

```
Edit this exact photograph. This is a real pair of tailored trousers in
brown herringbone wool. Keep the waistband construction, belt loops,
extended tab-and-button closure, leg silhouette, crease, hem, and
overall proportions exactly as shown — this cut and construction is
already correct.

CHANGE:
1. Recolour the cloth from brown herringbone to a LIGHT HEATHER-GREY
   WOOL FLANNEL, visible cloth grain, NO pattern (matching the house's
   other product photography) — the belt loops, tab, and stitching
   detail should still read clearly through the new colour and
   texture.
2. Cut the leg SLIGHTLY WIDER than shown — a touch more room through
   the thigh and down the leg, not a dramatic change, just fuller than
   this reference's slim modern fit.
3. UNLINED — the interior of the waistband is the same outer cloth, no
   dark or contrasting lining (tropical-climate house style — every
   trouser in this range is unlined).
4. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the belt loops, the extended tab-and-button closure, the
crease, cuffs, hem, or any other construction detail beyond the width
adjustment in point 2. Portrait orientation, aspect ratio 2:3, sharp
focus edge to edge, commercial e-commerce product photography style.
```

<details>
<summary>v1–v3 — earlier edits of BBS's own trousers-belt.webp source (superseded by v4 above, kept for the record)</summary>

v1 got the loops and flat waistband line right but wrongly suppressed
the centre-front tab. v2 was a follow-up edit against v1's own result,
adding the tab back without redoing the loops. v3 merged both into a
single pass against the original BBS source. v4 above moves to editing
a cleaner external reference instead, since it already has the whole
construction right and only needs colour/width changed.

```
Edit this exact photograph. This is a real pair of tailored trousers.
Change ONLY the waistband construction — keep the leg shape, any
pleats, the crease, the hem, and the overall proportions exactly as
shown.

CHANGE: Replace the current waistband tab-and-buckle closure with
GENUINE BELT LOOPS — narrow vertical fabric loops of the same cloth,
evenly spaced around the waistband (typically 5-7 loops: one at centre
back, two at the sides, two at the front near the fly), each loop
noticeably narrow — slightly narrower than a standard belt loop width,
a slim tailored loop rather than a wide casual one. The waistband
front itself is PLAIN and FLAT with no extended tab, no strap, no
buckle — it closes with a single small button or hook at the fly,
flush with the top of the waistband. NO side-adjuster tabs or straps
anywhere. Black interior waistband lining just visible inside the top
edge, unless the source shows unlined construction, in which case
match that instead.

Do not alter the leg width, pleats (or their absence), crease, cuffs,
hem, or any other part of the garment. Background stays pure flat
white. Portrait orientation, aspect ratio 2:3, sharp focus edge to
edge, commercial e-commerce product photography style.
```

v2 follow-up (ran against v1's `tmppvjsygoy.png` result):

```
Edit this exact photograph — a pair of trousers with belt loops already
correctly added. Keep everything as it is: the belt loops, the leg
shape, pleats, crease, hem, and overall proportions.

ADD ONE DETAIL: at the centre front of the waistband, where the button
currently sits flush with the main waistband line, add a SMALL POINTED
TAB — a narrow triangular extension of the same cloth rising slightly
ABOVE the main waistband line, with a small hook-and-eye closure at its
point. The existing button stays exactly where it is, on the main
waistband band just below this new tab — the tab and the button are
two separate closures stacked vertically at centre front, both visible
(the tab's hook above, the button below it). This is a classic
extended-waistband-tab detail, small and subtle — not a wide flap, just
a narrow pointed piece extending maybe 1-1.5cm above the main line.

Do not change the belt loops, leg, pleats, crease, hem, background, or
anything else. Portrait orientation, aspect ratio 2:3, sharp focus edge
to edge, commercial e-commerce product photography style.
```
</details>

### 15. Double forward-pleat trousers, REAL belt loops — new variant

**v2, same reference pivot as #14 (founder, 25 Aug 2026).** Same Mr
Porter photo as #14 — belt loops and the extended tab-and-button
closure already correct, no pleats in the reference itself. This
variant adds the one thing #14 doesn't: two forward pleats on each
leg, per the founder's framing that the only things to change here are
colour, pleats (add them, since the reference has none), and a
slightly wider cut.

```
Edit this exact photograph. This is a real pair of tailored trousers in
brown herringbone wool, flat front. Keep the waistband construction,
belt loops, extended tab-and-button closure, crease, hem, and overall
proportions exactly as shown — this construction is already correct.

CHANGE:
1. Add TWO FORWARD PLEATS on each leg, one on each side of the fly,
   pressed sharp and facing toward the pockets (not toward the fly),
   continuing into a single crease pressed down the centre of each leg
   below the knee. There are currently no pleats — add them without
   otherwise altering the front of the trouser.
2. Recolour the cloth from brown herringbone to a LIGHT HEATHER-GREY
   WOOL FLANNEL, visible cloth grain, NO pattern (matching the house's
   other product photography) — the belt loops, tab, and stitching
   detail should still read clearly through the new colour and
   texture.
3. Cut the leg SLIGHTLY WIDER than shown — a touch more room through
   the thigh and down the leg, not a dramatic change, just fuller than
   this reference's slim modern fit.
4. UNLINED — the interior of the waistband is the same outer cloth, no
   dark or contrasting lining (tropical-climate house style — every
   trouser in this range is unlined).
5. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the belt loops, the extended tab-and-button closure, the
hem, or any other construction detail beyond the pleats, colour, and
width adjustments above. Portrait orientation, aspect ratio 2:3, sharp
focus edge to edge, commercial e-commerce product photography style.
```

<details>
<summary>v1 — edited BBS's own trousers-double.webp source (superseded by v2 above, kept for the record)</summary>

```
Edit this exact photograph. This is a real pair of tailored trousers
with two forward pleats on each leg. Change ONLY the waistband
construction — keep the pleats, leg shape, crease, hem, and overall
proportions exactly as shown.

CHANGE: Replace the current waistband tab-and-buckle closure with
GENUINE BELT LOOPS — narrow vertical fabric loops of the same cloth,
evenly spaced around the waistband (typically 5-7 loops: one at centre
back, two at the sides, two at the front near the fly), each loop
noticeably narrow — slightly narrower than a standard belt loop width,
a slim tailored loop rather than a wide casual one. At the CENTRE
FRONT of the waistband, add a SMALL POINTED TAB — a narrow triangular
extension of the same cloth rising slightly (roughly 1-1.5cm) ABOVE
the main waistband line, closed with a small hook-and-eye at its
point. Just below this tab, on the main waistband band itself, a
single ordinary button — the tab's hook and the button are two
separate closures stacked vertically, both visible. Elsewhere the
waistband front is plain and flat — NO side-adjuster tabs or straps
at the hips, no buckle anywhere. UNLINED — the interior of the
waistband is the same outer cloth, no dark or contrasting lining
(tropical-climate house style — every trouser in this range is
unlined).

Do not alter the pleats, leg width, crease, cuffs, hem, or any other
part of the garment. Background stays pure flat white. Portrait
orientation, aspect ratio 2:3, sharp focus edge to edge, commercial
e-commerce product photography style.
```
</details>

**Wiring, once both land:** #14 replaces the existing
`trousers-belt.webp` in place (same key, `SOURCES["trousers-belt"]` in
`tools/build-garment-assets.js` just points at the new file — no other
code changes, it's already wired everywhere `trousers-belt` is used).
#15 is a genuinely new key — add `"trousers-beltPleat"` to `SOURCES`
and `GARMENT_ASSET_KEYS`, then add `{ key: "beltPleat", label: "Belt
Loops, Pleated" }` to `VIS_ENS_STYLE_OPTIONS.trousers.style` in
fabric-visualiser.js (same list `"gurkha"` was added to) so it's
selectable from the Trousers "Make" picker. Both need the leg/waistband
displacement region treatment from this session's audit — reuse
`TROUSER_LEGS`/`TROUSER_WAISTBAND` for #14 (same framing as
`trousers-flat`) and check #15 lines up with `trousers-double`'s own
coordinates before assuming it does.

### 16. Jungle jacket — `jacket-jungle`

**New 25 Aug 2026 — sixth "casual jacket," same picker treatment as
the other five.** Founder-supplied reference: a real BBS flat lay,
cream cotton twill. Notched shirt-style collar (no lapel roll, same
family as Safari's), four large box-pleated patch pockets with
buttoned flaps (two chest, two larger at the hip) — visually close to
Safari's pocket construction, but distinguished by a CONCEALED
button-front placket (only a single button visible peeking out at the
throat, the rest of the front closure hidden under a fly, unlike
Safari's visible button row) and NO waist belt. Two-button cuffs. The
source photo shows a visible "BBS Edition Capsule" woven neck label —
must be removed per the standing no-brand-label rule.

**Unlined — house style, all casual jackets.**

```
Edit this exact photograph. This is a real jungle jacket, currently
shown as a flat lay in cream cotton twill. Turn it into a
ghost-mannequin product photograph for the catalogue — change only
what's listed below, keep the jacket's own construction exactly as
shown.

KEEP EXACTLY AS SHOWN, unchanged: the notched shirt-style collar (flat,
no tailored lapel roll or gorge seam), the four box-pleated patch
pockets with buttoned flaps (two smaller ones at the chest, two larger
ones at the hip, each with a centre box-pleat that lets the pocket
expand), the CONCEALED button-front placket — only a single button
visible peeking out at the throat, the rest of the closure hidden
under a fly front, NOT a row of visible buttons down the body — the
two-button cuffs, the sleeve and shoulder construction, the overall
proportions and length.

CHANGE:
1. Reshape into a GHOST-MANNEQUIN pose — the jacket filled with
   realistic chest, shoulder and sleeve volume as if worn by an
   invisible body, front view, centred and symmetric, camera at chest
   height, standing straight, arms hanging naturally at the sides. Not
   laid flat, no mannequin or hanger visible.
2. Recolour the cloth from cream to a LIGHT HEATHER-GREY WOOL FLANNEL,
   visible cloth grain, no pattern (matching the house's other product
   photography) — the pocket construction, pleats, and stitching
   detail should still read clearly through the new colour and
   texture.
3. UNLINED — wherever the front opens even slightly, the inside should
   read as the same outer cloth, not a contrasting lining. Tropical-
   climate house style doesn't line its casual jackets.
4. REMOVE THE BRAND LABEL — the source photo shows a woven "BBS
   Edition Capsule" tag sewn at the inside collar. It must not appear
   in the result; that area should read as plain cloth, the same as
   the rest of the inside collar.
5. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the collar shape, pocket count/construction, the
concealed placket, cuffs, button placement, or silhouette beyond
what's listed above — in particular do not add a visible button row
or a waist belt. Portrait orientation, aspect ratio 4:5, sharp focus
edge to edge, commercial e-commerce product photography style.
```

### 17. Sahariana jacket — `jacket-sahariana`

**SHIPPED 25 Aug 2026** — matched the brief on the first generation
(pointed pocket flaps, stand collar, concealed placket, no belt, no
visible label all correct). Selectable from the Casual Jacket
sub-picker's "Sahariana Jacket" chip — all seven casual jackets are
now live.

**Seventh "casual jacket," same picker treatment as
the other six.** Founder-supplied reference: a real BBS flat lay,
dark olive-green linen twill. A STAND/MANDARIN COLLAR — similar family
to Teba's but its own distinct cut, upright with no lapel or roll,
closing with a small hidden throat closure right at the top (worth
comparing closely against Teba's when both are generated, since they
share the same collar family but are not identical garments). Fully
CONCEALED front placket — no buttons visible down the body at all,
the whole closure hidden under a fly, same principle as Jungle's
placket. Four patch pockets with flaps, all sharing a distinctive
POINTED/SCALLOPED FLAP BOTTOM — each flap comes to a shallow V-notch
at its lower edge rather than a straight or rounded hem, visibly
different from every other casual jacket's pocket shape in this range.
Plain straight hem, no belt. Plain cuffs, no visible button or tab.
The source photo shows a visible "BBS Edition Capsule" woven neck
label — must be removed per the standing no-brand-label rule.

**Unlined — house style, all casual jackets.**

```
Edit this exact photograph. This is a real sahariana jacket, currently
shown as a flat lay in dark olive-green linen twill. Turn it into a
ghost-mannequin product photograph for the catalogue — change only
what's listed below, keep the jacket's own construction exactly as
shown.

KEEP EXACTLY AS SHOWN, unchanged: the STAND/MANDARIN COLLAR — a short
upright collar with NO lapel, NO roll, NO notch, closing with a small
hidden closure right at the throat (it stands straight up, does not
fold open) — the FULLY CONCEALED front placket, no buttons visible
anywhere down the body, the entire closure hidden under a fly front —
the four patch pockets, each with a flap whose bottom edge comes to a
shallow POINTED V-NOTCH rather than a straight or rounded hem (this
pointed-flap shape is the garment's most distinctive detail — get it
exactly right) — the plain straight hem with no belt — the plain
cuffs with no visible button or tab — the sleeve and shoulder
construction, the overall proportions and length.

CHANGE:
1. Reshape into a GHOST-MANNEQUIN pose — the jacket filled with
   realistic chest, shoulder and sleeve volume as if worn by an
   invisible body, front view, centred and symmetric, camera at chest
   height, standing straight, arms hanging naturally at the sides. Not
   laid flat, no mannequin or hanger visible.
2. Recolour the cloth from dark olive-green to a LIGHT HEATHER-GREY
   WOOL FLANNEL, visible cloth grain, no pattern (matching the house's
   other product photography) — the pocket flaps' pointed shape, the
   collar stand, and the stitching detail should still read clearly
   through the new colour and texture.
3. UNLINED — wherever the front opens even slightly, the inside should
   read as the same outer cloth, not a contrasting lining. Tropical-
   climate house style doesn't line its casual jackets.
4. REMOVE THE BRAND LABEL — the source photo shows a woven "BBS
   Edition Capsule" tag sewn at the inside collar. It must not appear
   in the result; that area should read as plain cloth, the same as
   the rest of the inside collar.
5. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the collar shape (it must stay a stand collar, not
become a lapel or shirt collar), the concealed placket, the pointed
pocket flaps, cuffs, hem, or silhouette beyond what's listed above —
in particular do not add a visible button row, a belt, or round off
the pocket flaps' pointed bottom edge. Portrait orientation, aspect
ratio 4:5, sharp focus edge to edge, commercial e-commerce product
photography style.
```

## After generating: same pipeline as before, no new steps

1. Save each raw image into `images/styleBuilder/`.
2. Add an entry to `SOURCES` in `tools/build-garment-assets.js`:
   `"vest-db-none": "<your-filename>.png"` (etc., one line per asset).
3. Run `node tools/build-garment-assets.js` — produces the masked,
   luminance-normalised `.webp` in `images/garments/`.
4. Add the new key string to `GARMENT_ASSET_KEYS` in `garment-photo.js`.
   `resolveGarmentKey`'s self-healing lookup then picks it up
   automatically for any spec/style combination that matches — no other
   code changes needed for vests or trousers.
5. **Jackets only** (#1, #4, #5 above): the lapel needs hand-tracing —
   `JACKET_SB_LAPELS` for #1/#5 (both use the same widened notch shape,
   trace once and reuse for both), `JACKET_DB_LAPELS` for #4 needs
   checking against the new photo (may already line up if the peak shape
   matches the existing `jacket-db.webp` peak — verify before assuming a
   retrace is needed). Vests and trousers need no tracing — their overlay
   regions are proportional boxes, not hand-traced outlines.
