# BBS Archetype Image Prompt Pack

Prompts for generating one image per style archetype (24 in total), plus the
settings and drop-in instructions to wire them into BBS Style Discovery.

Generated from the live archetype data in `app.js` — each prompt uses that
archetype's real name, subtitle, tag set, garment class and palette colour, so
the images match what the app actually says about each one.

---

## 1. Recommended approach on Replicate

**Train a style LoRA on the BBS photography first, then generate all 24 through
it.** This is the recommendation, and it matters more than model choice.

The repo already contains four images from the real BBS editorial shoot
(`images/lookbook/`). They share a seamless tan canvas backdrop, a single soft
key light, a muted warm grade and a consistent crop. Training a small LoRA on
those and generating the archetypes through it means all 24 look like outtakes
from the same shoot rather than 24 unrelated AI images. That coherence is the
entire difference between "looks designed" and "looks generated".

| Step | Replicate model | Notes |
|---|---|---|
| Train the style | `ostris/flux-dev-lora-trainer` | Feed a zip of the 4 lookbook images. Trigger word `BBSSTYLE` (already used in every prompt below). 1000–1500 steps is plenty for a style LoRA. |
| Generate | `black-forest-labs/flux-dev` + your trained LoRA | Best quality-per-cost for this job. Strong prompt adherence on fabric, drape and colour. |
| Higher fidelity | `black-forest-labs/flux-1.1-pro` | Better skin and fabric micro-detail, no LoRA support — use only if you skip training. |
| Fast/cheap drafts | `black-forest-labs/flux-schnell` | Use to iterate on wording, then re-run finals on `flux-dev`. |

Model slugs move; check the current Replicate listing before running. If the
LoRA trainer has changed name, any FLUX-compatible style trainer works the same
way — what matters is the four reference images and the trigger word.

**If you skip training**, generate everything with `flux-1.1-pro` in a single
batch with a fixed seed and identical prompt skeleton (below). Coherence will be
noticeably weaker, but acceptable.

### The one thing that will go wrong

Faces. Twenty-four generated men on the same backdrop will read as
twenty-four different strangers, which looks like stock photography rather than
a considered set. Three ways out, in order of preference:

1. **Crop below the chin.** Change `Waist-up framing` to
   `framed from the shoulders down, head out of frame` in every prompt. This
   matches the existing faceless SVG avatars, sidesteps likeness questions
   entirely, and keeps attention on the tailoring — which is the actual subject.
2. **Keep one face consistent** by adding the same identity description to every
   prompt, or by using an image-to-image reference of a single generated face.
3. **Go non-photographic** — add `editorial fashion illustration, gouache and
   ink, flat colour` and drop the lighting sentence. Reads closer to the INFP
   quiz look you mentioned, and dodges the uncanny-face problem completely.

I would pick option 1. It is the most on-brand, and it is consistent with the
faceless mannequin avatars already in the app.

---

## 2. Global settings

| Setting | Value | Why |
|---|---|---|
| Aspect ratio | `4:5` | The gallery slot is `aspect-ratio: 4 / 5`. Anything else gets cropped by `object-fit: cover`. |
| Output format | `jpg`, quality ~85 | These get precached for offline use; keep each file under ~200KB. |
| Megapixels | `1` | Displayed at roughly 150–400px wide. Larger is wasted bytes. |
| Seed | Fix one seed, reuse for all 24 | Keeps lighting and framing consistent across the set. |
| LoRA scale | `0.8`–`1.0` | Lower if garments start looking identical to the training images. |

### Negative prompt

Not all FLUX endpoints accept a negative prompt. Where supported:

```text
logos, brand names, text, watermark, signature, busy background, studio equipment,
harsh flash, oversaturated colour, plastic skin, extra limbs, deformed hands,
cluttered props, mirror reflections, heavy vignette
```

### Prompt skeleton

Every prompt below follows this shape. Keep the order — FLUX weights the opening
clause most heavily:

```text
BBSSTYLE editorial menswear portrait. [subject + pose] against a seamless warm tan
canvas backdrop, wearing [garment]. Principal garment colour [hex].
[archetype name] — [subtitle]; [tags]. [lighting] [framing] [texture note]
```

---

## 3. The 24 prompts

### 01. The Riviera Minimalist
`v` · *Warm Ease* · Warm Weather, Relaxed, Light Palette, Effortless

> You look best in light, relaxed pieces that feel elegant without effort — soft structure, warm neutrals, and a wardrobe shaped by ease, sun, and movement.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing an unstructured odd jacket worn open over a fine knit or shirt, contrasting trousers. Principal garment colour #e4dbc8. Riviera Minimalist — warm ease; warm weather, relaxed, light palette, effortless. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/v.jpg`

---

### 02. The Occasion Modernist
`o` · *Polished Presence* · Occasion, Polished, Sharper Tailoring, Elevated

> You are at your best when dressing with intent — sharper tailoring, cleaner formality, and pieces that feel elevated enough for meaningful occasions.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a full two-piece tailored suit, jacket buttoned. Principal garment colour #3a3a3c. Occasion Modernist — polished presence; occasion, polished, sharper tailoring, elevated. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/o.jpg`

---

### 03. The Craftsman
`c` · *Built with Conviction* · Structured, Cloth-Led, Long-Term, Considered

> You value garments with integrity — strong cloth, thoughtful construction, and pieces that hold their shape and relevance over time.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing an unstructured odd jacket worn open over a fine knit or shirt, contrasting trousers. Principal garment colour #8a6a4f. Craftsman — built with conviction; structured, cloth-led, long-term, considered. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/c.jpg`

---

### 04. The Relaxed Modernist
`m` · *Ease with Polish* · Flexible, Smart Casual, Modern, Easy

> You dress best in pieces that feel clean, modern, and easy to wear — relaxed enough for real life, but always pulled together.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a soft collared overshirt or fine knit, no tailored jacket. Principal garment colour #a8ab97. Relaxed Modernist — ease with polish; flexible, smart casual, modern, easy. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/m.jpg`

---

### 05. The Traditionalist
`g` · *Timeless Menswear* · Classic, Balanced, Event Ready, Enduring

> You are most at home in classic menswear codes — balanced tailoring, reliable elegance, and pieces that feel appropriate across occasions.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a full two-piece tailored suit, jacket buttoned. Principal garment colour #2e3a52. Traditionalist — timeless menswear; classic, balanced, event ready, enduring. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/g.jpg`

---

### 06. The Quiet Classicist
`q` · *Understated Refinement* · Understated, Minimal, Refined, Quiet

> You prefer restraint over display — a wardrobe built on calm colours, clean lines, and quality that speaks softly rather than loudly.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a full two-piece tailored suit, jacket buttoned. Principal garment colour #6f6e6a. Quiet Classicist — understated refinement; understated, minimal, refined, quiet. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/q.jpg`

---

### 07. The Modern Architect
`a` · *Line and Precision* · Precise, Modern, Sharp, Intentional

> You are drawn to clarity in silhouette — strong shape, controlled detail, and garments that feel designed rather than merely styled.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a soft collared overshirt or fine knit, no tailored jacket. Principal garment colour #3c3c3e. Modern Architect — line and precision; precise, modern, sharp, intentional. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/a.jpg`

---

### 08. The Utilitarian
`u` · *Practical Elegance* · Practical, Versatile, Resilient, Useful

> You want a wardrobe that works hard — resilient, versatile, and composed enough to move across different settings without fuss.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a soft collared overshirt or fine knit, no tailored jacket. Principal garment colour #6f7355. Utilitarian — practical elegance; practical, versatile, resilient, useful. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/u.jpg`

---

### 09. The City Innovator
`t` · *Performance with Polish* · Performance, Travel Ready, Polished, Modern

> You want tailoring that performs in real life — breathable, resilient, and sharp enough to stay composed through long modern days.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing an unstructured odd jacket worn open over a fine knit or shirt, contrasting trousers. Principal garment colour #39445a. City Innovator — performance with polish; performance, travel ready, polished, modern. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/t.jpg`

---

### 10. The New Minimalist
`s` · *Relaxed Clarity* · Relaxed, Minimal, Light, Modern

> You dress best in modern casual pieces with clean restraint — soft jackets, easy silhouettes, and a wardrobe that feels light, calm, and current.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a soft collared overshirt or fine knit, no tailored jacket. Principal garment colour #d8d0bf. New Minimalist — relaxed clarity; relaxed, minimal, light, modern. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/s.jpg`

---

### 11. The Soft Classicist
`r` · *Effortless Elegance* · Soft, Textural, Elegant, Effortless

> You are at your best in soft tailoring, rich texture, and combinations that feel elegant without ever seeming too formal or too deliberate.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing an unstructured odd jacket worn open over a fine knit or shirt, contrasting trousers. Principal garment colour #b3a18c. Soft Classicist — effortless elegance; soft, textural, elegant, effortless. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/r.jpg`

---

### 12. The Contrast Curator
`e` · *Texture and Character* · Textural, Expressive, Layered, Distinct

> You enjoy wardrobes with nuance — mixing texture, pattern, and tonal contrast in a way that feels considered, fresh, and personal.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing an unstructured odd jacket worn open over a fine knit or shirt, contrasting trousers. Principal garment colour #5d4a3a. Contrast Curator — texture and character; textural, expressive, layered, distinct. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/e.jpg`

---

### 13. The Tropical Traditionalist
`b` · *Classic Codes, Tropical Weight* · Tropical, Classic, Breathable, Structured

> You dress best in classic tailoring adapted intelligently for heat — breathable suiting, cleaner structure, and timeless menswear forms refined for tropical life rather than borrowed unchanged from colder traditions.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a full two-piece tailored suit, jacket buttoned. Principal garment colour #cbb896. Tropical Traditionalist — classic codes, tropical weight; tropical, classic, breathable, structured. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/b.jpg`

---

### 14. The Heritage Modernist
`h` · *Tradition with Intention* · Heritage, Modern, Balanced, Refined

> You dress best in classic menswear codes refined for modern life — heritage references, balanced tailoring, and pieces that feel rooted in tradition but edited with enough clarity to remain current and relevant.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a full two-piece tailored suit, jacket buttoned. Principal garment colour #6b5138. Heritage Modernist — tradition with intention; heritage, modern, balanced, refined. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/h.jpg`

---

### 15. The Layering Specialist
`l` · *Depth Through Composition* · Layered, Adaptive, Textural, Seasonal

> You dress best through composition rather than statement — layering cloth, proportion, and colour with enough control that the wardrobe feels rich, adaptive, and seasonally intelligent without ever seeming overworked.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing an unstructured odd jacket worn open over a fine knit or shirt, contrasting trousers. Principal garment colour #6f7355. Layering Specialist — depth through composition; layered, adaptive, textural, seasonal. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/l.jpg`

---

### 16. The Texture Minimalist
`x` · *Tactile Restraint* · Minimal, Textural, Tonal, Refined

> You dress best in restrained wardrobes enriched by cloth character — tonal dressing, quiet palettes, and fabric surfaces that create depth through touch, weave, and subtle variation rather than obvious colour or pattern.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a soft collared overshirt or fine knit, no tailored jacket. Principal garment colour #9a938a. Texture Minimalist — tactile restraint; minimal, textural, tonal, refined. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/x.jpg`

---

### 17. The Performance Casual
`p` · *Technical Ease* · Performance, Casual, Relaxed, Useful

> You dress best in casual pieces that perform quietly — resilient fabrics, relaxed silhouettes, and a wardrobe built for movement, comfort, and repeat wear without looking overtly technical or overly athletic.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a soft collared overshirt or fine knit, no tailored jacket. Principal garment colour #5c6670. Performance Casual — technical ease; performance, casual, relaxed, useful. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/p.jpg`

---

### 18. The Occasion Maximalist
`k` · *Bold Celebration* · Occasion, Bold, Formal, Expressive

> You are at your best when occasion dressing carries real presence — stronger shape, richer colour, and pieces that feel elevated enough to mark the moment without losing elegance or control.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing black-tie evening tailoring, dinner jacket with a bow tie. Principal garment colour #232324. Occasion Maximalist — bold celebration; occasion, bold, formal, expressive. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/k.jpg`

---

### 19. The Coastal Modernist
`w` · *Sun, Salt, and Ease* · Coastal, Relaxed, Light, Warm Weather

> You dress best in warm-weather pieces that feel light, open, and naturally polished — relaxed tailoring, sun-washed tones, and a wardrobe shaped by air, movement, and a quieter kind of confidence.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a soft collared overshirt or fine knit, no tailored jacket. Principal garment colour #9fb9cf. Coastal Modernist — sun, salt, and ease; coastal, relaxed, light, warm weather. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/w.jpg`

---

### 20. The Urban Formalist
`f` · *City Sharp* · Urban, Sharp, Formal, Professional

> You dress best in sharper city tailoring — clean suiting, disciplined lines, and a wardrobe that feels polished, direct, and composed enough for professional life without becoming stiff or old-fashioned.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a full two-piece tailored suit, jacket buttoned. Principal garment colour #2b2b2e. Urban Formalist — city sharp; urban, sharp, formal, professional. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/f.jpg`

---

### 21. The Pattern Enthusiast
`n` · *Confident Variation* · Pattern, Expressive, Layered, Distinct

> You dress best when pattern is used with confidence and control — checks, stripes, and textured surfaces that add rhythm and individuality without tipping into excess.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing an unstructured odd jacket worn open over a fine knit or shirt, contrasting trousers. Principal garment colour #a4643f. Pattern Enthusiast — confident variation; pattern, expressive, layered, distinct. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/n.jpg`

---

### 22. The Neo-Traditionalist
`d` · *Modern Heritage* · Traditional, Updated, Balanced, Refined

> You dress best in traditional forms updated with clarity — classic tailoring, familiar menswear codes, and pieces that feel rooted in heritage but cut for present-day life rather than preserved unchanged.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing a full two-piece tailored suit, jacket buttoned. Principal garment colour #3f4a3f. Neo-Traditionalist — modern heritage; traditional, updated, balanced, refined. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/d.jpg`

---

### 23. The Quiet Modernist
`y` · *Understated Innovation* · Modern, Clean, Minimal, Understated

> You dress best in modern wardrobes that stay calm — clean silhouettes, minimal finishing, and pieces that feel current through proportion, line, and subtle innovation rather than obvious trend.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing an unstructured odd jacket worn open over a fine knit or shirt, contrasting trousers. Principal garment colour #8d8d85. Quiet Modernist — understated innovation; modern, clean, minimal, understated. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/y.jpg`

---

### 24. The Seasonal Purist
`z` · *Weather-Led Dressing* · Seasonal, Textural, Classic, Climate-Led

> You dress best when the wardrobe responds honestly to the season — lighter cloths in heat, richer textures in cooler months, and combinations that feel shaped by weather, atmosphere, and the rhythm of the year.

```text
BBSSTYLE editorial menswear portrait. A man standing three-quarters to camera against a seamless warm tan canvas backdrop, wearing an unstructured odd jacket worn open over a fine knit or shirt, contrasting trousers. Principal garment colour #7a7f5e. Seasonal Purist — weather-led dressing; seasonal, textural, classic, climate-led. Single soft directional key light from camera left, gentle shadow falloff on the backdrop, muted warm colour grade, shallow depth of field. Waist-up framing, calm neutral expression, hands relaxed. Fine garment texture and drape clearly visible.
```

Save as `images/archetypes/z.jpg`

---

## 4. Dropping them into the app

The app is already wired for this — no code changes needed.

**Step 1.** Save the 24 files as `images/archetypes/<key>.jpg`, using the key
given under each prompt (`v`, `o`, `c`, `m`, `g`, `q`, `a`, `u`, `t`, `s`, `r`,
`e`, `b`, `h`, `l`, `x`, `p`, `k`, `w`, `f`, `n`, `d`, `y`, `z`).

**Step 2.** In `app.js`, add a `galleryImage` line to each archetype in
`archetypeProfiles`:

```js
v: {
    key: "v",
    name: "The Riviera Minimalist",
    galleryImage: "images/archetypes/v.jpg",   // <- add this line
    ...
}
```

`getGalleryMarkHTML()` already prefers `galleryImage` over the SVG avatar over
the monogram, so each archetype switches to its photo the moment the line
exists. You can do them one at a time — any archetype without the line keeps its
current avatar, so a partial set degrades cleanly.

**Step 3.** Add the files to the service worker precache in `sw.js` so they work
offline, alongside the existing `images/lookbook/` entries:

```js
"./images/archetypes/v.jpg",
"./images/archetypes/o.jpg",
// ...all 24
```

**Step 4.** Bump the cache-busting trio, or the iPad will serve stale files:
`styles.css?v=N` and `app.js?v=N` in `index.html`, the matching `?v=` entries in
`sw.js`, and `CACHE_VERSION` in `sw.js`. All three, every time.

**Step 5.** Run `node verify/smoke.js`. It fails on any 4xx, so a mistyped
filename will surface immediately.

---

## 5. Where else images would help

Once the archetypes are done, the same house style covers:

- **The 8 colour profiles** — currently rendered as swatch ribbons. A tonal
  flat-lay per profile would lift the colour quiz result page considerably.
- **Guide topics** (`metadata.image_refs`) — 312 topics, almost all without
  imagery. These now render as tap-to-flip cards, so a photo is immediately
  useful. Start with the garment topics: jackets, trousers, shirts, shoes.
- **The Cloth Room** — the 13 fabric tiles are procedurally drawn in canvas.
  Photographed swatch macros would replace them one-for-one via each fabric's
  `drawTile`, and would be the single biggest realism upgrade in the app.

---

## 6. Honest caveats

- **Generated garments are not your garments.** These images illustrate a style
  direction; they do not depict real BBS stock. Keep them out of anything a
  customer could read as a product shot, and do not put prices near them.
- **Check every image before shipping it.** Generators routinely produce six
  fingers, melted buttons, lapels that change width mid-jacket, and jackets with
  three sleeves. At 24 images you will regenerate several.
- **Fabric detail is where these models are weakest.** Herringbone, glen check
  and birdseye tend to come out as mush at this resolution. If a specific weave
  matters, photograph it instead.
- **Faces are the risk.** See the note in section 1 — cropping below the chin
  removes the problem rather than managing it.
