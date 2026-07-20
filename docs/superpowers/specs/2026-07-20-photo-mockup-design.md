# Photographic Garment Mockup — Design

Date: 20 July 2026
Status: approved, ready for planning

## Background

Benchmarked against [Officine Paladino](https://styling.officinepaladino.com/) and
[Collaro](https://collaro.co/). Both render a *photograph* of a garment and pour the
selected cloth into it. The Cloth Room renders a hand-authored SVG silhouette with
hand-drawn gradient shading. The silhouettes were measured and corrected against
photographic references on 20 July (`bee0653`) and are now proportionally accurate,
but they remain drawings — the drape is invented, not observed.

The founder has asked for the Paladino/Collaro look.

## The technique

A garment photographed in **plain mid-grey** carries its drape entirely in its
luminance: the shadow under a lapel, the dark in a sleeve fold, the light on a
pleat. Grey is chosen because it has no colour of its own to contaminate the cloth
multiplied through it.

So the photograph is not the artwork. **The photograph's luminance is the artwork.**

This maps directly onto the layer stack the Cloth Room already runs:

| Layer | Today | After |
|---|---|---|
| Shape | SVG `clipPath`, hand-authored path | alpha mask derived from the photo |
| Light and drape | hand-drawn gradients, `mix-blend-mode: multiply` | photo luminance, same blend mode |
| Cloth | `weave-engine.js` 96×96 tile | unchanged |

`styles.css:6581` and `styles.css:8565` already carry the multiply layers. The
compositing model is not new work; the inputs to it are.

## Scope

**House cut only.** Five photographs, already generated and in
`images/styleBuilder/`:

| Garment | File (to be renamed) | Confirmed details |
|---|---|---|
| SB jacket | `…n6bvdyx5p9…jpeg` | notch lapel, patch hip pockets, barchetta breast, open quarters |
| DB jacket | `…sc2p8y639x…jpeg` | 6×2 peak lapel, jetted hip pockets, barchetta breast, straight hem |
| Waistcoat | `…vac0q9x4w1…jpeg` | 5 button, no lapel, high armholes, two hem points |
| Pleated trousers | `…788cczn1bs…jpeg` | double forward pleat, side adjusters, turn-up, no belt loops |
| Flat-front trousers | `…wjzaqxyajx…jpeg` | flat front, plain hem, no belt loops |

Style options that change a silhouette (SB↔DB, pleat↔flat, turn-up↔plain) resolve to
one of these five photographs. Options with no photograph are removed from
`VIS_ENS_STYLE_OPTIONS`, not silently ignored.

## Non-goals

- Per-option photography (rejected: 40–60 assets, and any mismatch in pose or light
  makes the garment jump when an option is toggled).
- Replacing the drawn silhouettes elsewhere in the app. The guide's flip cards and
  the Split keep using cloth tiles.
- Tinting buttons to the selected cloth. **Buttons stay horn-brown** — decided
  20 July. It is honest to what the studio would actually make; Collaro's tinting
  is slicker but fictional.
- Real BBS photography. These are generated placeholders. The masks and displacement
  maps are authored per garment panel and largely survive a later swap to real
  photographs, so this work is not thrown away when photography happens.

## Architecture

Four artefacts per garment, built once, then static.

### 1. Alpha mask

Flood-fill inward from the frame edge. **Not** a luminance threshold — every one of
the five photographs carries a soft cast shadow on the white ground, and a threshold
reads that shadow as garment and pulls a grey halo into the mask.

Output: 1-bit mask, garment vs. not-garment.

### 2. Hole map

Regions inside the silhouette that are *not cloth* and must keep their original
pixels:

| Region | Garments |
|---|---|
| Buttons | all five |
| Buttonholes | both jackets, waistcoat |
| Waistband lining (cream strip) | both trousers |
| Body lining in the V | waistcoat |
| Lining at the front opening | SB jacket |
| Adjuster buckles (metal) | pleated trousers |

Without this, cloth pours over horn buttons and turns metal buckles into flannel.

### 3. Luminance map

The garment's grey normalised to a mid-luminance range. Carries drape only. Colour
is discarded — it is the one thing the photograph must not contribute.

### 4. Displacement field

A per-panel vector field so a chalkstripe bends around form rather than running
rigid across it. Straight multiply is adequate for plain and heavily textured cloths
but visibly false on the ~half of the library carrying a pattern overlay.

Because the garments are laid **flat**, curvature is confined to four regions per
garment rather than the whole panel:

- lapel roll
- sleeve cylinders
- pleat folds
- turn-up

This is materially less hand-authoring than a worn-garment field would need.

## Render path

1. Cloth tile from `weave-engine.js` (unchanged).
2. Displace at the four regions.
3. Multiply the luminance map over it.
4. Clip to the alpha mask.
5. Composite the hole map on top at original pixels.

## Risks

- **Mask quality at the edges.** Soft-focus garment edges against white will
  feather. A hard 1-bit mask may show a white fringe. Mitigation: erode the mask
  by 1–2px and accept a marginally tighter silhouette.
- **Displacement authoring is subjective.** There is no measurement that says a
  field is correct. Verification is visual, against a chalkstripe and a windowpane
  specifically, since those expose error fastest.
- **Asset weight.** Five photographs plus derived maps, against an app that
  currently ships no raster garment art. Budget and measure before committing;
  the app is used in-store on iPad and is precached by `sw.js`.

## Verification

Per the project's definition of done:

- `verify/audit.js` and `verify/smoke.js` green.
- Cache triple-bump: `index.html` `?v=`, `sw.js` precache entries, `sw.js`
  `CACHE_VERSION` (currently `styles.css?v=56`, `fabric-visualiser.js?v=8`,
  `bbs-v42`).
- **Effect, not intent.** The recurring failure mode on this project has been
  checks that confirm a feature was wired rather than that it renders — five
  instances to date. Verification here must read pixels out of the composited
  canvas, not assert that a mask file loaded.
- Specifically: render a chalkstripe on the SB jacket and confirm stripe curvature
  at the lapel differs from stripe curvature at the hem. If they match, the
  displacement field is not being applied.
