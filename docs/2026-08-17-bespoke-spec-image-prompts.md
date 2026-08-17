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

### 6. (Lower priority) Double-breasted, flap pockets — `jacket-db-peak-flap`

Real double-breasted jackets are conventionally always peak-lapelled —
a DB with a notch lapel reads as an unusual, non-standard combination,
so this brief doesn't include a `jacket-db-notch-*` prompt at all. Skip
this one unless flap pockets on the DB specifically matter to you; the
existing `jacket-db.webp` already covers peak lapel + patch pockets.

```
Ghost-mannequin product photograph of a men's double-breasted sport
coat, front view, centred and symmetric, camera at chest height. Light
heather-grey wool flannel with visible cloth grain, no pattern. Peak
lapels, standard double-breasted width. Six-button front in a 2x3
arrangement, two buttons functional at the wrap, buttons dark
horn-effect. Two FLAP POCKETS at the hips — a rectangular flap of the
same cloth covers the pocket opening, edges pressed flat, no visible
pocket bag beneath. One welt breast pocket, no pocket square. Black
lining visible through the open front. The garment is shaped with
realistic chest, shoulder and sleeve volume as if worn by an invisible
body — NOT laid flat, NOT on a hanger, NOT on a visible mannequin or
dress form, no person visible. Pure flat white background, RGB 255 255
255, no shadow, no gradient, no visible horizon line. Soft even studio
lighting, no hard highlights. Portrait orientation, aspect ratio 4:5,
sharp focus edge to edge, commercial e-commerce product photography
style.
```

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
