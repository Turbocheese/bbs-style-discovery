# Cloth Room — Garment Art Reference Prompts

Reference imagery for redrawing the Cloth Room's garment silhouettes.

## What these are for

The Cloth Room dresses a garment by pouring a tiled cloth texture into an SVG
`clipPath` and laying grayscale shading over the top. The **silhouette path is
the clip mask**, so a weak silhouette makes all 102 cloths look weak. The
current shapes are the problem; the shading over them is broadly fine.

These prompts produce reference art to draw *from*. Even the SVG model's output
is a stylised multi-path illustration rather than the single clean outline the
clip mask needs, so the workflow is: generate → I study proportions and
landmarks → I hand-author the path.

## Which model

**Primary: [`recraft-ai/recraft-v3-svg`](https://replicate.com/recraft-ai/recraft-v3-svg)**
— genuinely outputs SVG, not raster. Best chance of geometry worth measuring
against. Use style `vector_illustration` or `line_art`.

**Secondary: `black-forest-labs/flux-1.1-pro`** — raster, but far better at
believable tailoring proportion and drape. Run both: Recraft for the outline,
Flux for judging where the waist suppression and shoulder line actually sit.

## Target proportions (important)

Generate at these aspect ratios so the reference maps onto the coordinate space
the artwork is being rebuilt in. Two of the three are currently wrong, which is
the root cause of the vest and trousers looking off.

| Garment | Ratio | Notes |
|---|---|---|
| Jacket | 4:5 portrait | current space is right |
| Vest | 4:5 portrait | currently landscape — wrong |
| Trousers | 2:3 portrait | currently square — wrong |

## Shared style clause

Append to every prompt:

> Technical fashion flat lay, garment photographed alone from directly above on
> a pure white seamless background, perfectly symmetrical, front view, centred
> in frame with even margin on all sides, garment laid completely flat with no
> folds or rumples, sleeves and legs fully extended, no body, no mannequin, no
> hanger, no hands, no props, no text, no logo, soft even lighting with no cast
> shadow, sharp edges, entire garment fully within the frame.

---

## 1. Jacket — single breasted, notch lapel

> A single breasted two button tailored suit jacket in mid grey wool. Natural
> soft shoulder with a slight roll, no padding. Clearly visible waist
> suppression so the jacket nips in at the waist and flares gently over the
> hip. Notch lapel of medium width rolling to the top button. Two flap hip
> pockets and a welted breast pocket. Sleeves fully extended straight down and
> ending level with the jacket hem, each with four cuff buttons. Hem slightly
> curved. Front edges meeting cleanly at the button.

## 2. Jacket — double breasted, peak lapel

> A six-on-two double breasted tailored suit jacket in mid grey wool. Peak
> lapel with the points sweeping up and outward toward the shoulder line. Two
> parallel columns of three buttons each, the wrap crossing generously to the
> left. Strong waist suppression. Patch hip pockets and a welted breast pocket.
> Sleeves fully extended straight down and ending level with the jacket hem.
> Hem straight and square.

## 3. Waistcoat — single breasted, five button

> A single breasted five button tailored waistcoat in mid grey wool, no lapel.
> Deep V neckline opening to the top button. Clearly defined armholes cut high
> and close. Two welted lower pockets. Body tapering in at the waist. Hem
> finishing in two distinct downward points below the bottom button. Notably
> taller than it is wide.

## 4. Waistcoat — double breasted with lapel

> A double breasted six button tailored waistcoat in mid grey wool with a shawl
> lapel framing the neckline. Two columns of three buttons with the wrap
> crossing to the left. Clearly defined high armholes. Two welted lower
> pockets. Straight hem with a single point. Notably taller than it is wide.

## 5. Trousers — flat front, plain hem

> A pair of flat front tailored wool trousers in mid grey, laid flat and fully
> extended to full length. Clearly visible waistband at the top with belt
> loops. Smooth flat front with no pleats. A sharp centre crease running the
> full length of each leg. Gentle taper from the thigh down to a clean plain
> hem. Full rise visible from waistband to crotch. Distinctly longer than wide.

## 6. Trousers — double pleat, turn-up

> A pair of double pleated tailored wool trousers in mid grey, laid flat and
> fully extended to full length. Wide waistband with side adjuster tabs and no
> belt loops. Two clearly visible forward-facing pleats falling from the
> waistband on each side. Fuller cut through the thigh, tapering to a turn-up
> cuff at the hem with a visible horizontal fold line. Sharp centre crease.
> Full rise visible. Distinctly longer than wide.

---

## Reading the results

What actually needs measuring off the reference, in priority order:

1. **Shoulder-to-hem against total width** — the current jacket is too wide for
   its length, which is most of why it reads as a cardigan.
2. **Where the waist sits** and how much it suppresses.
3. **Sleeve length relative to hem** — currently far too short.
4. **Armhole depth on the waistcoat** — currently absent entirely.
5. **Rise and taper on the trousers** — currently a rectangle.

Colour, cloth and lighting in the reference are irrelevant; the app supplies
all three. Only the outline and the landmark positions matter.
