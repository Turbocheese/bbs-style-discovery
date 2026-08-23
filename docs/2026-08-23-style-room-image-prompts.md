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
- Dark horn-effect buttons, black lining where the front opens (the
  compositor's multiply-blend trick relies on a near-black lining staying
  near-black under any cloth) — **tailored garments only.** Every casual
  jacket (Safari, Chore, A2, Trucker, Teba) is UNLINED instead, same
  tropical-climate reasoning as the unlined trousers — see each of
  their prompts (#9–13) for the exact wording.

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
7. **Casual jackets** — Safari and Chore SHIPPED 24 Aug; A2, Trucker,
   and Teba are next (#11–13), genuinely new garment silhouettes, not
   lapel/pocket variants of the tailored jacket. The Style Room picker
   (24 Aug 2026) now has its own two-tier structure for this reason —
   Jacket / Casual Jacket / Waistcoat / Trousers at the top, and once
   "Casual Jacket" is active a second row picks which one (Safari /
   Chore / A2 / Trucker / Teba). All five are already registered in
   `VIS_SINGLE_GARMENTS` (fabric-visualiser.js) with `casual: true` —
   any without a photo yet shows a "coming soon" card and self-heals
   the moment its key joins `GARMENT_ASSET_KEYS`, no further picker
   code needed once each photo lands.

---

### 1. Notch lapel, widened — replaces the current `jacket-sb` base photo

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

**New 24 Aug 2026 — third "casual jacket."** Founder-supplied reference:
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
4. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the collar shape, raglan seam, pocket construction,
elasticated hem/cuffs, button placement, or silhouette beyond what's
listed above. Portrait orientation, aspect ratio 4:5, sharp focus edge
to edge, commercial e-commerce product photography style.
```

### 12. Trucker jacket — `jacket-trucker`

**New 24 Aug 2026 — fourth "casual jacket."** Founder-supplied
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
4. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the collar shape, yoke seam, pocket construction, side-tab
adjusters, button placement, or silhouette beyond what's listed above.
Portrait orientation, aspect ratio 4:5, sharp focus edge to edge,
commercial e-commerce product photography style.
```

### 13. Teba jacket — `jacket-teba`

**New 24 Aug 2026 — fifth "casual jacket."** Founder-supplied reference
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
4. Change the background to pure flat white, RGB 255 255 255, no
   shadow, no gradient, no visible horizon line. Soft even studio
   lighting, no hard highlights.

Do not alter the collar shape (it must stay a stand collar, not become
a lapel or shirt collar), raglan seams, pocket construction, button
placement, or silhouette beyond what's listed above. Portrait
orientation, aspect ratio 4:5, sharp focus edge to edge, commercial
e-commerce product photography style.
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
