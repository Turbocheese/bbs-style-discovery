# Bespoke Spec Configurator — new garment photo prompts

For generating photo variants that make the Bespoke Spec Configurator's
lapel/pocket/waistband choices visible in the Cloth Room, not just on the
spec card. Written for Nano Banana Pro (or any similar image model) —
each prompt is self-contained and specific on purpose, since a vague
prompt on this style of shot tends to drift (wrong pose, visible model,
off-white background) and burns a generation.

## What the existing photos actually look like (verified against the shipped assets)

Checked `images/garments/jacket-sb.webp`, `jacket-db.webp`, and
`trousers-flat.webp` directly rather than guessing:

- **Ghost-mannequin product shot**: garment filled out with body-shape
  volume (chest, shoulder, sleeve drape) as if worn, but no person,
  mannequin, hanger, or hook visible anywhere in frame.
- **Pure white background**, no gradient, no cast shadow, no visible
  seam/horizon line.
- **Straight-on, centred, symmetric** — camera at chest height, garment
  filling the frame with a small even margin on all sides.
- **Soft, even studio lighting** — no hard specular highlights, no
  visible light source.
- Fabric reads as a **light heather-grey wool flannel/twill**, visible
  cloth grain, no pattern.
- **Black or near-black horn-effect buttons**, black lining visible
  through the open front (this app's compositor relies on that dark
  lining — see `garment-photo.js`'s header comment on why a near-black
  lining stays near-black under any cloth via multiply blend).
- Both existing jackets show **rounded patch-style hip pockets** (no
  flap visible) despite `VIS_ENS_STYLE_DEFAULTS.jacket.pockets` in the
  code saying `"flap"` — worth knowing before you generate anything,
  since it means the *current* stock look doesn't actually match its own
  coded default. Not something this brief fixes; flagging it so a new
  "flap pockets" generation doesn't look like a mistake by comparison.
- `trousers-flat.webp` shows a **front extended waistband tab with a
  button** (V-shaped tab at each hip, no belt loops visible at all) —
  not plain belt loops either. Also worth knowing going in.

## Output specs (match these exactly)

- **Jackets**: portrait, aspect ratio ≈ 4:5 (existing assets are
  1289×1600 after processing). Ask for at least 1600px on the long edge.
- **Trousers**: portrait, aspect ratio ≈ 2:3, taller/narrower than the
  jacket shots (existing assets are 1073×1600).
- Background must be **flat pure white** (RGB 255,255,255) — the build
  pipeline (`tools/build-garment-assets.js`) flood-fills inward from the
  frame edge to key the background out, and a shadow or tinted ground
  breaks that mask cleanly (two of the seven existing sources needed a
  manual white-normalisation pass to fix exactly this).

## Status (2026-08-17)

Prompts #1, #2, #3 generated and shipped — see commit `c0e6ece`. #2
(notch+flap) became the new `jacket-sb` base photo itself (it matches
the app's coded default exactly); #1 and #3 are wired in as
spec-driven variants. #6 (DB) was generated but **rejected** — it came
out with a ticket pocket (a small extra pocket above the main hip
pocket) that house style doesn't do. #6 below is the corrected retry.
#4/#5 (trousers) still not attempted — see the note on #4.

**#7 (pinstripe calibration reference) superseded — see #8.** It fixed
the worst of the peak lapel's bend but the founder still called it
visibly wrong after landing (commit `f003895`); a stripe-kink is an
indirect signal and had misidentified which point was even the peak
tip. Left here for the method-comparison, not as current guidance.

**#8 (flat-colour panel edit) done and current** — the founder generated
it via Qwen-Image-Edit-Plus (not Nano Banana Pro — the founder's own
call after #7 kept coming back wrong; Qwen's image-editing mode turned
out to preserve pose far better: fitting its silhouette against the
real `jacket-sb-peak-flap.png` gave well under a 1%-of-frame residual,
against ~3-5% for #7's fresh-generation reference). `JACKET_SB_PEAK_LAPELS`
in `garment-photo.js` is now traced from the exact red/blue-vs-grey
pixel boundary (thresholded, Douglas-Peucker simplified) rather than
inferred from where a printed stripe happens to bend — this is now the
most precise trace in the file, more so than the original hand-traced
notch/DB outlines. Verified in-app against `fox_flannel_chalkstripe`
on the peak lapel — clean chevron bend, no seam artifact. If the notch
or DB traces ever need revisiting, redo them the same way (prompt in
#8) rather than falling back to #7's method.

## Priority list

Ordered by how much visual difference each one actually buys. The
Bespoke Spec drawer already lets a client pick any of these combinations
today — they just don't change the photo yet. You don't need all of
these to ship something useful; even #1 alone unlocks the highest-value
case (peak lapel is the most visually distinctive of the four spec
options).

### 1. Wide Peak lapel, patch pockets (single-breasted) — `jacket-sb-peak-patch`

```
Ghost-mannequin product photograph of a men's single-breasted sport
coat, front view, centred and symmetric, camera at chest height. Light
heather-grey wool flannel with visible cloth grain, no pattern. WIDE
PEAK LAPELS (not notch) — the lapel's outer edge points upward and
outward toward the shoulder in a sharp peak, wider than a standard
notch lapel, roughly 9.5cm at its widest. Two-button front, buttons
dark horn-effect, positioned mid-torso. Two ROUNDED PATCH POCKETS at
the hips — no flap, stitched border, curved bottom corners, sewn on top
of the fabric (not inset). One welt breast pocket, no pocket square.
Single centre back vent (not visible from front, garment hangs
naturally). Black lining visible through the open front. The garment is
shaped with realistic chest, shoulder and sleeve volume as if worn by
an invisible body — NOT laid flat, NOT on a hanger, NOT on a visible
mannequin or dress form, no person visible. Pure flat white background,
RGB 255 255 255, no shadow, no gradient, no visible horizon line. Soft
even studio lighting, no hard highlights. Portrait orientation, aspect
ratio 4:5, sharp focus edge to edge, commercial e-commerce product
photography style.
```

### 2. Standard Notch lapel, Classic Flap pockets — `jacket-sb-notch-flap`

**Before generating this one**: this exact combination is the app's
*coded default* (`VIS_ENS_STYLE_DEFAULTS.jacket = { lapelStyle: "notch",
pockets: "flap" }`). If you add this asset to `GARMENT_ASSET_KEYS`, it
silently becomes the new baseline look for every client who never opens
the Bespoke Spec drawer — not just an option someone has to pick. Decide
that deliberately, not by accident.

```
Ghost-mannequin product photograph of a men's single-breasted sport
coat, front view, centred and symmetric, camera at chest height. Light
heather-grey wool flannel with visible cloth grain, no pattern.
STANDARD NOTCH LAPELS — the collar meets the lapel in a clean V-shaped
notch, moderate width, roughly 8.5cm. Two-button front, buttons dark
horn-effect, positioned mid-torso. Two FLAP POCKETS at the hips — a
rectangular flap of the same cloth covers the pocket opening, edges
pressed flat, no visible pocket bag beneath. One welt breast pocket, no
pocket square. Single centre back vent (not visible from front). Black
lining visible through the open front. The garment is shaped with
realistic chest, shoulder and sleeve volume as if worn by an invisible
body — NOT laid flat, NOT on a hanger, NOT on a visible mannequin or
dress form, no person visible. Pure flat white background, RGB 255 255
255, no shadow, no gradient, no visible horizon line. Soft even studio
lighting, no hard highlights. Portrait orientation, aspect ratio 4:5,
sharp focus edge to edge, commercial e-commerce product photography
style.
```

### 3. Wide Peak lapel, Classic Flap pockets — `jacket-sb-peak-flap`

```
Ghost-mannequin product photograph of a men's single-breasted sport
coat, front view, centred and symmetric, camera at chest height. Light
heather-grey wool flannel with visible cloth grain, no pattern. WIDE
PEAK LAPELS (not notch) — the lapel's outer edge points upward and
outward toward the shoulder in a sharp peak, wider than a standard
notch lapel, roughly 9.5cm at its widest. Two-button front, buttons
dark horn-effect, positioned mid-torso. Two FLAP POCKETS at the hips —
a rectangular flap of the same cloth covers the pocket opening, edges
pressed flat, no visible pocket bag beneath. One welt breast pocket, no
pocket square. Single centre back vent (not visible from front). Black
lining visible through the open front. The garment is shaped with
realistic chest, shoulder and sleeve volume as if worn by an invisible
body — NOT laid flat, NOT on a hanger, NOT on a visible mannequin or
dress form, no person visible. Pure flat white background, RGB 255 255
255, no shadow, no gradient, no visible horizon line. Soft even studio
lighting, no hard highlights. Portrait orientation, aspect ratio 4:5,
sharp focus edge to edge, commercial e-commerce product photography
style.
```

### 4. Flat front trousers, side-adjuster waistband — `trousers-flat-sideAdjusters`

```
Ghost-mannequin product photograph of men's tailored trousers, front
view, centred and symmetric, camera at waist-to-ankle height, full
length visible. Light grey wool, flat front (no pleats), single crease
pressed down the centre of each leg, straight leg, no visible cuff.
SIDE-ADJUSTER WAISTBAND — at each hip, a short strap of the same cloth
with a small metal buckle, sewn into the waistband seam and angled
back toward the side seam, used to cinch the waist instead of a belt.
NO belt loops anywhere on the waistband. NO front extended tab or
buttoned closure tab at the fly front — waistband front is plain and
clean, fly fastens with a hidden button, no visible waistband button. A
narrow fob-pocket edge just visible at the right hip. Black interior
waistband lining just visible inside the top edge. The garment is
shaped with realistic hip and leg volume as if worn by an invisible
body — NOT laid flat, NOT on a hanger, no person visible. Pure flat
white background, RGB 255 255 255, no shadow, no gradient, no visible
horizon line. Soft even studio lighting, no hard highlights. Portrait
orientation, aspect ratio 2:3 (taller and narrower than a jacket shot),
sharp focus edge to edge, commercial e-commerce product photography
style.
```

### 5. Double forward-pleat trousers, side-adjuster waistband — `trousers-double-sideAdjusters`

Same prompt as #4, with one substitution: replace *"flat front (no
pleats), single crease"* with:

```
two forward-facing pleats on each side of the fly, pleats pressed
sharp and facing toward the pockets (not toward the fly), continuing
into a single crease pressed down the centre of each leg below the
knee
```

### 6. RETRY — Double-breasted, flap pockets, no ticket pocket — `jacket-db-peak-flap`

Real double-breasted jackets are conventionally always peak-lapelled —
a DB with a notch lapel reads as an unusual, non-standard combination,
so this brief doesn't include a `jacket-db-notch-*` prompt at all; the
existing `jacket-db.webp` already covers peak lapel + patch pockets.

The first attempt at this one added an unrequested ticket pocket (a
second, smaller flap stacked above the right hip pocket) — the prompt
below adds an explicit negative instruction to head that off, since the
first prompt didn't think to rule it out.

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

### 7. Calibration reference — pinstripe on Wide Peak, NOT a shipped asset

This one doesn't go through `tools/build-garment-assets.js` and never
becomes a `GARMENT_ASSET_KEYS` entry — it's a one-off reference image
for retracing the lapel/sleeve bend regions (see the pipeline section
below: `JACKET_SB_LAPELS` in `garment-photo.js` is a hand-traced
outline, and it was traced against the OLD notch-lapel photo, so it no
longer lines up with the new peak-lapel one). A bold, real pinstripe
printed on the actual peak-lapel cut shows exactly how a straight line
bends at this specific lapel roll and sleeve head — the same kind of
reference the original notch lapel was traced from (see that file's
comment on the founder's hand-drawn trace).

Send me the result directly rather than dropping it in the photos
folder — I'll use it to eyeball new trace coordinates, not build an
asset from it.

```
Ghost-mannequin product photograph of a men's single-breasted sport
coat, front view, centred and symmetric, camera at chest height. Bold
charcoal-grey chalk-stripe flannel — wide, high-contrast white
pinstripes spaced about 2cm apart, running perfectly vertical on a flat
plane, so their bend is clearly visible wherever the cloth curves.
WIDE PEAK LAPELS (not notch) — the lapel's outer edge points upward and
outward toward the shoulder in a sharp peak, roughly 9.5cm at its
widest — the stripes must visibly bend and compress along the lapel's
roll line and again at the peak's point, not run straight through it.
Two-button front, buttons dark horn-effect. Two FLAP POCKETS at the
hips. One welt breast pocket. Black lining visible through the open
front. The garment is shaped with realistic chest, shoulder and sleeve
volume as if worn by an invisible body — the stripes should also show
their bend wrapping around the sleeve head at the shoulder seam. NOT
laid flat, NOT on a hanger, no person visible. Pure flat white
background, RGB 255 255 255, no shadow, no gradient. Soft even studio
lighting, no hard highlights, sharp enough focus that individual
stripes are crisp even where they bend. Portrait orientation, aspect
ratio 4:5.
```

### 8. Panel-colour calibration — NOT a shipped asset, replaces #7's approach

The pinstripe method (#7) required finding where a stripe bends, then
inferring a polygon from that — even done programmatically (automated
kink-detection plus a fitted affine, commit `f003895`) it still read
wrong in the running app. A flat colour fill per pattern piece removes
the inference entirely: the seam becomes an exact pixel boundary
between two colours, so the trace can be extracted by direct
thresholding instead of estimated from indirect signals.

**Critical: this must be an EDIT of the exact existing photo, not a
fresh generation.** A new text-to-image pass gives a different pose
every time (this is what made #7 need a calibration transform between
two non-identical photos). Feed the actual file
(`images/styleBuilder/jacket-sb-peak-flap.png`, or whichever variant)
into Nano Banana Pro as the base image and ask it to edit that image,
not describe a new one — same pose, same crop, same proportions,
pixel-identical except the two recoloured panels.

```
Edit this exact photograph. Keep everything pixel-identical — same
pose, same crop, same proportions, same garment shape — except for two
changes: fill the LEFT lapel (the fabric piece bounded by the front
roll line and the gorge seam where it meets the collar, on the
image-left side) with a single flat, matte, solid RED (#FF0000) — no
shading, no texture, no gradient, a hard clean-edged fill that stops
exactly at the seam line. Fill the RIGHT lapel (the mirror piece,
image-right side) with a single flat, matte, solid BLUE (#0000FF), same
hard clean edge at its seam. Do not recolour the collar, body, sleeves,
pockets, buttons, or lining — leave those as the original cloth texture
and colour. Background stays pure white. Do not alter pose, crop, or
any other detail.
```

Run this once per jacket photo that needs its lapel trace verified —
`jacket-sb-peak-flap.png` is the priority (currently wrong in the app),
but the same prompt against `jacket-sb-notch-flap-v2.png` and
`jacket-db-peak-flap.png`/`jacket-db.png` would let the notch and DB
traces get the same exact-boundary treatment instead of staying on the
older hand-trace-by-eye method — worth doing for consistency even
though those aren't reported as visibly wrong today.

Optional bonus, same photo, additional instruction if you want the
sleeve regions upgraded from plain rotated boxes to a real traced clip
too: *"Also fill the left sleeve with flat solid ORANGE (#FF8800) and
the right sleeve with flat solid GREEN (#00CC00), same hard-edge rule,
same exclusions."* Not required — sleeves haven't been reported as
visibly wrong.

Send the result directly rather than dropping it in
`images/styleBuilder/incoming/` — same as #7, this is a reference for
retracing, never a shipped asset.

### 9. Collar panel-colour — third colour, adds the gorge seam boundary #8 didn't capture

#8 only asked for two colours (the two lapels) and told the model to
stop at "the gorge seam where it meets the collar" — but nothing
marked where that seam actually is, so the model extended the lapel
colour straight up through the collar too. The trace built from that
(committed) is accurate for the lapel's outer edge, but has no real
data on where the collar itself starts — the founder's own eye is
catching a seam that might genuinely be there and isn't represented in
the code at all.

**Edit the already-generated red/blue file, don't start over.** Feed
in the successful result from #8
(`replicate-prediction-5j4267qpwxrp60d02dnaebgv3c.png`, the one
already used to trace the current lapel clip) as the base image and
ask for one additional change on top of it — this keeps the lapel
boundaries exactly as already measured and verified, and only adds the
missing third colour, rather than risking a fresh generation drifting
the pose or the lapel edges from what's already committed.

```
Edit this exact photograph — it already has the left lapel filled
solid red and the right lapel filled solid blue with hard clean edges.
Keep those two fills and the pose exactly as they are. Add one more
change: this jacket has a genuine separate piece of cloth for the
collar — the upper collar, the piece that wraps around the back of the
neck, physically cut and sewn on as its own pattern piece, distinct
from the lapel/front panel. It is stitched to the lapel at the gorge
seam: a real diagonal seam line running from near the back-of-neck
notch out to the corner where each lapel's peak point begins. Fill
ONLY that collar piece — the part wrapping the neck, on BOTH sides,
not the lapels below it — with a single flat, matte, solid YELLOW
(#FFFF00), hard clean edges, no shading, no gradient, no texture. The
yellow must stop exactly at the gorge seam on both sides and must NOT
extend down into the red or blue lapel fill below it — the collar and
each lapel are three separate pieces of cloth stitched together at
real seams, not one continuous surface, and the fill boundaries must
show exactly where those seams are. If you are not confident exactly
where the gorge seam sits, follow the actual weave/stitching detail
visible in the photograph rather than guessing a generic line. Do not
change the red, the blue, the body, sleeves, pockets, buttons, lining,
pose, or background in any way.
```

If the model still bleeds yellow into the lapels or vice versa, that
result is itself useful information (it may mean this cut genuinely
doesn't have a strong visible seam there, same conclusion the pixel-diff
experiment already pointed toward) — send whatever comes back rather
than re-prompting blind; a clean fail is data too.

Same rule as #7/#8: send the result directly, don't drop it in
`images/styleBuilder/incoming/` — this is a trace reference, never a
shipped asset.

## After generating: the pipeline these need to go through

Dropping a PNG into `images/garments/` is **not** enough — the existing
assets all went through `tools/build-garment-assets.js` (masking,
edge erosion, luminance normalisation), and jackets additionally need
their lapel/sleeve regions hand-traced.

1. Save the raw generated image into `images/styleBuilder/` (match the
   naming convention already there — see `SOURCES` in
   `tools/build-garment-assets.js`).
2. Add an entry to that same `SOURCES` map: `"jacket-sb-peak-patch":
   "<your-filename>.png"` (or whatever key you generated).
3. Run the CLI: `node tools/build-garment-assets.js` — this produces
   the masked, luminance-normalised `.webp` in `images/garments/`.
4. Add the new key string to `GARMENT_ASSET_KEYS` in `garment-photo.js`.
   At that point `resolveGarmentKey`'s self-healing lookup (added this
   session) picks it up automatically — no other code changes needed.
5. **Jacket variants only, and this is the real remaining effort**: the
   lapel and sleeve bend regions (`JACKET_SB_LAPELS`, `JACKET_DB_LAPELS`,
   `JACKET_SLEEVES` in `garment-photo.js`) are hand-traced coordinates
   calibrated against the *exact* outline of `jacket-sb.webp` /
   `jacket-db.webp` specifically — see that file's extensive comments on
   how the founder traced the real lapel roll-line by hand. A peak lapel
   is a different shape than a notch lapel, so the existing trace will
   not line up with a new peak-lapel photo — a patterned cloth (stripe,
   check) would bend at the wrong place at the collar. Either retrace
   the new photo's lapel outline the same way, or accept that patterned
   cloths look slightly off at the lapel on the new variant until that's
   done (plain and lightly-textured cloths, which is most of the
   library, would look fine regardless). Trousers don't have this
   problem — `TROUSER_LEGS`/`TROUSER_WAISTBAND` are proportional boxes,
   not traced outlines, so a new trouser photo needs no retracing.
