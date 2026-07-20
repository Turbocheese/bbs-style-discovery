# Cloth Room — Garment Art Reference Prompts

Reference imagery for redrawing the Cloth Room's garment silhouettes.

## What these are for

The Cloth Room dresses a garment by pouring a tiled cloth texture into an SVG
`clipPath` and laying grayscale shading over the top. The **silhouette path is
the clip mask**, so a weak silhouette makes all 102 cloths look weak. The
current shapes are the problem; the shading over them is broadly fine.

These prompts produce reference art to draw *from*. Even the SVG model's output
is a stylised multi-path illustration rather than the single clean outline the
clip mask needs, so the workflow is: generate → measure proportions and
landmarks → hand-author the path.

## The house cut

Everything here is **soft Neapolitan tailoring**, not English structure. That
distinction is the whole point of the artwork — a stiff, padded, narrow-lapel
silhouette would misrepresent what BBS actually cuts. The vocabulary that
matters:

- **Spalla camicia** — the "shirt shoulder". The sleeve is set into the armhole
  the way a shirt sleeve is, with visible gathering (*grinze*) puckering along
  the sleevehead. No padding, no rope. The shoulder line follows the body and
  falls away naturally rather than sitting square.
- **Wide lapels with belly** — roughly 9–10cm at the widest, with a *pronounced
  convex curve* along the outer edge (the "belly") rather than a straight line.
  High gorge.
- **Three-roll-two** — three buttons, but the lapel rolls softly over the top
  one so it lands at the middle button. The roll is soft and unpressed.
- **Barchetta** — the breast pocket is boat-shaped, curving upward at both ends.
  Not a straight welt.
- **Patch pockets** — rounded, applied on top of the cloth, often slightly
  angled. Sometimes with a flap.
- **Open quarters** — the front edges curve away from each other below the
  fastening button rather than running straight down.
- **Shorter length** and a **high armhole** with a relatively slim sleeve.
- **High-rise trousers**, forward-facing pleats, side adjusters rather than belt
  loops, a fuller thigh and a gentle taper.

## Which model

**Use a raster model, not an SVG one.** The SVG output was never the
requirement — the path is hand-authored either way, so all the generator
has to do is produce an accurate picture to MEASURE. Insisting on
`recraft-ai/recraft-v3-svg` cost three rounds: it is an illustration
model with weak prompt adherence, and it kept returning double-breasted
lapelled waistcoats, garments on figures, front-and-back pairs, and
hallucinated callout labels ("High Faft Fow") because it pattern-matches
to "annotated fashion spec sheet".

Ranked for this job:

| Model | Why |
|---|---|
| `google/nano-banana-pro` | Strongest prompt adherence. Produced both usable references first try. |
| `qwen/qwen-image` | Does exactly what is asked regardless of prompt complexity. |
| `black-forest-labs/flux-1.1-pro` | Safe fallback, leads Flux on adherence. |

Two phrasings matter more than the model:

- **Do not say "technical flat sketch" or "CAD drawing".** That is what
  pulls these models toward annotated spec-sheet illustrations with
  invented labels. Say **"photographed flat on a plain white background,
  shot straight down from above"** — it describes the same view without
  the trigger.
- **State absences as plain facts inside sentences**, not as a list of
  prohibitions. "A wide waistband with a small buckled adjuster tab on
  each hip, and no belt, no belt loops and no buckle at the front" works;
  "no belt" as a bare negative gets ignored.

A photograph beats a line drawing here. It is likelier to show a real
menswear cut, and proportion measures off it just as well.

## Target proportions (important)

Generate at these ratios so the reference maps onto the coordinate space the
artwork is being rebuilt in. Two of the three are currently wrong, which is the
root cause of the vest and trousers looking off.

| Garment | Ratio | Notes |
|---|---|---|
| Jacket | 4:5 portrait | current space is right |
| Vest | 4:5 portrait | currently landscape — wrong |
| Trousers | 2:3 portrait | currently square — wrong |

## Shared style clause

Append to every prompt:

> Technical fashion flat lay, garment photographed alone from directly above on
> a pure white seamless background, perfectly symmetrical, front view, centred
> in frame with even margin on all sides, garment laid completely flat, sleeves
> and legs fully extended, no body, no mannequin, no hanger, no hands, no props,
> no text, no logo, soft even lighting with no cast shadow, crisp edges, entire
> garment fully within the frame.

---

## 1. Jacket — single breasted, three-roll-two, notch lapel

> A soft unstructured Neapolitan single breasted sports jacket in mid grey wool,
> three-roll-two button stance where the lapel rolls softly over the top button
> and lands at the middle button. Very wide notch lapels roughly 10cm at the
> widest with a pronounced convex belly curving outward along the lapel edge,
> and a high gorge. Spalla camicia shirt shoulder: completely unpadded, natural
> and sloping, following the body line, with visible soft gathering and
> puckering where the sleevehead meets the high armhole. Barchetta breast
> pocket, boat shaped and curving upward at both ends. Two rounded patch hip
> pockets applied on the surface of the cloth. Open quarters with the front
> edges curving away from each other below the fastening button. Gentle waist
> shaping, no stiffness. Relatively short length. Sleeves fully extended
> straight down, slim, ending level with the jacket hem, with four working cuff
> buttons.

## 2. Jacket — double breasted, wide peak lapel

> A soft unstructured Neapolitan double breasted six-on-two jacket in mid grey
> wool. Very wide peak lapels roughly 10cm at the widest with strongly upswept
> points reaching toward the shoulder line and a pronounced convex belly along
> the lapel edge. Spalla camicia shirt shoulder: unpadded, natural and sloping,
> with visible soft gathering at the sleevehead and a high armhole. Two parallel
> columns of three buttons with a generous wrap crossing to the left. Barchetta
> breast pocket, boat shaped and curving upward. Two rounded patch hip pockets.
> Clean waist shaping with soft drape rather than sharp structure. Straight hem.
> Sleeves fully extended straight down ending level with the hem.

## 3. Waistcoat — single breasted, five button

> A soft tailored Italian waistcoat in mid grey wool, single breasted with five
> buttons and no lapel. Deep V neckline opening to the top button. High, close,
> clearly defined armholes. Two welted lower pockets set at a slight angle. Body
> shaped in at the waist with a soft unstiffened front. Hem finishing in two
> distinct downward points below the bottom button. Distinctly taller than it is
> wide.

## 4. Waistcoat — double breasted, shawl lapel

> A soft tailored Italian double breasted waistcoat in mid grey wool with a
> generous unbroken shawl lapel framing the neckline in one continuous curve,
> no notch and no peak. Two columns of three buttons with the wrap crossing to
> the left. High, close, clearly defined armholes. Two welted lower pockets.
> Straight hem with a single point. Distinctly taller than it is wide.

## 5. Trousers — flat front, high rise, plain hem

> A pair of high-rise soft tailored Italian trousers in mid grey wool, laid flat
> and fully extended to full length. Notably high rise with a long distance from
> the waistband down to the crotch. Wide waistband sitting at the natural waist
> with an extended tab closure and no belt loops. Completely flat front with no
> pleats. Sharp centre crease running the full length of each leg. Full through
> the thigh, tapering gently to a clean plain hem. Distinctly longer than wide.

## 6. Trousers — double pleat, high rise, turn-up

> A pair of high-rise double pleated soft tailored Italian trousers in mid grey
> wool, laid flat and fully extended to full length. Notably high rise. Wide
> waistband at the natural waist with side adjuster tabs on both hips and no
> belt loops. Two deep forward-facing pleats falling from the waistband on each
> side and opening toward the centre. Generous fullness through the thigh
> tapering gently to a turn-up cuff with a clearly visible horizontal fold line.
> Sharp centre crease running the full length. Distinctly longer than wide.

---

## Reading the results

What actually needs measuring off the reference, in priority order:

1. **Shoulder-to-hem against total width** — the current jacket is too wide for
   its length, which is most of why it reads as a cardigan.
2. **Shoulder slope and where the sleevehead sits.** This is the single detail
   that separates a Neapolitan jacket from an English one, and the current
   artwork has a flat square shoulder — the opposite of spalla camicia.
3. **Lapel width and belly.** Currently far too narrow and drawn as a straight
   edge with no convex curve.
4. **Sleeve length relative to hem** — currently far too short.
5. **Armhole depth on the waistcoat** — currently absent entirely.
6. **Rise and taper on the trousers** — currently a rectangle with no rise.

Colour, cloth and lighting in the reference are irrelevant; the app supplies all
three. Only the outline and the landmark positions matter.
