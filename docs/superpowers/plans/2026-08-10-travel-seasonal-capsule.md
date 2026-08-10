# Travel & Seasonal Capsule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every archetype in the wardrobe worksheet a 4th outfit, "Beyond
the Tropics" — a cooler-climate capsule for business travel — using the
worksheet's existing outfit-card system, with zero new UI code.

**Architecture:** Pure content addition to `wardrobe-templates.js`. Each of
the 24 archetypes gets one new item appended to its `refinements[]` array and
one new outfit appended to its `outfits[]` array, referencing that new item
plus two items the archetype already has. No changes to `app.js`,
`styles.css`, or `data.js`.

**Tech Stack:** Vanilla JS data file (ES5 object literals). No functions, no
build step.

## Global Constraints

- Every new item's `climate` field MUST be `["all"]`, never `["temperate"]`
  or any single specific climate. `filterItemsByClimate()`
  (`wardrobe-templates.js:2827`) hides items whose `climate` array doesn't
  contain the client's `selClimate` answer or `"all"`, and the outfit-card
  renderer (`app.js:4901-4907`) silently drops any outfit item id that gets
  filtered out — a wrong tag fails silently, not loudly. See the design spec
  (`docs/superpowers/specs/2026-08-10-travel-seasonal-capsule-design.md`) for
  the full explanation.
- Every new outfit's `name` field is exactly `"Beyond the Tropics"` — the
  same string across all 24 archetypes.
- Every new refinement item's `tier` is `"enhancement"`.
- Every new refinement item's `guide` links to one of two existing topics
  only: `["outerwear", "overcoat"]` or
  `["colour_wardrobe", "layering_in_warm_climates"]`. No new `data.js` topics.
- New item `id`s follow each archetype's existing `<letter>_r<n>` numbering,
  continuing from its highest existing refinement id.
- `paletteGuidance` on every new item uses a single `all` key (matches the
  majority convention already in the file) — do not invent new palette
  family names.
- No `mills` field on new items unless noted below (most existing items in
  this file already omit it; only add where specified).
- 4-space indentation, double quotes, trailing commas — match the
  surrounding file exactly (ES5 object-literal style, no arrow functions, no
  template literals — this file has neither, keep it that way).

---

## Task 1: Archetypes 1–6 (t, q, w, c, m, g)

**Files:**
- Modify: `wardrobe-templates.js` (archetypes `t`, `q`, `w`, `c`, `m`, `g` —
  currently lines 6–705, but insert relative to each archetype's own
  `refinements[]`/`outfits[]` closing bracket, not by absolute line number,
  since earlier insertions in this same task shift later line numbers)

**Interfaces:**
- Consumes: nothing new — reads the existing per-archetype object shape
  already used by `t_r1`, `t_r2`, `t_r3`, etc.
- Produces: for each archetype, one new refinement item id
  (`t_r4`, `q_r3`, `w_r3`, `c_r3`, `m_r3`, `g_r3`) and one new outfit named
  `"Beyond the Tropics"`. Later tasks don't depend on these — each archetype
  is independent — but Task 5's verification step exercises all of them.

- [ ] **Step 1: Add `t_r4` to `t`'s `refinements[]`**

Find `t`'s `refinements` array (currently ends with the `t_r3` "Leather
accessories" item, `wardrobe-templates.js:128-139`). Insert this new object
immediately after the `t_r3` entry's closing `},` and before the array's
closing `],`:

```javascript
            {
                id: "t_r4",
                item: "Packable travel overcoat",
                priority: 9,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy — works with your entire capsule" },
                },
                why: "For business trips beyond the tropics, an unlined wool overcoat folds flat in a carry-on and unpacks crease-free.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 2: Add the "Beyond the Tropics" outfit to `t`'s `outfits[]`**

Find `t`'s `outfits` array (currently ends with "The Transit Look",
`wardrobe-templates.js:20-24`). Insert immediately after its closing `},`
and before the array's closing `],`:

```javascript
            {
                name: "Beyond the Tropics",
                items: ["t_r4", "t_f2", "t_f5"],
                context: "Cooler-climate business trips — layer the overcoat over your existing shirt and trouser foundation.",
            },
```

- [ ] **Step 3: Add `q_r3` to `q`'s `refinements[]`**

After the `q_r2` entry (`wardrobe-templates.js:243-254`):

```javascript
            {
                id: "q_r3",
                item: "Minimal wool topcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal — no pattern, no distraction" },
                },
                why: "Restraint travels. A single unadorned topcoat covers every cooler-climate trip without adding a new colour to think about.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 4: Add the outfit to `q`'s `outfits[]`**

After "The Modern Gallery" (`wardrobe-templates.js:156-160`):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["q_r3", "q_f3", "q_f2"],
                context: "For travel beyond your tropical baseline — the topcoat over your existing white shirt and stone trouser.",
            },
```

- [ ] **Step 5: Add `w_r3` to `w`'s `refinements[]`**

After `w_r2` (`wardrobe-templates.js:357-368`):

```javascript
            {
                id: "w_r3",
                item: "Unlined wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#687383", note: "Slate — the one cool tone in an otherwise warm wardrobe" },
                },
                why: "Your wardrobe is built for heat, so this is the one piece bought purely for the trips that take you elsewhere.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 6: Add the outfit to `w`'s `outfits[]`**

After "The Layered Breeze" (`wardrobe-templates.js:271-275`):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["w_r3", "w_f3", "w_f2"],
                context: "The cooler-climate exception to a coastal wardrobe — worn only away from home.",
            },
```

- [ ] **Step 7: Add `c_r3` to `c`'s `refinements[]`**

After `c_r2` (`wardrobe-templates.js:479-490`):

```javascript
            {
                id: "c_r3",
                item: "Waxed cotton field coat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#3B2A22", note: "Dark brown — ages like your leather goods" },
                },
                why: "Built to be worn hard and to develop character rather than be replaced — the same longevity logic as your shoes, applied to outerwear.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 8: Add the outfit to `c`'s `outfits[]`**

After "The Structured Casual" (`wardrobe-templates.js:385-389`):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["c_r3", "c_f4", "c_f3"],
                context: "Cooler-climate travel, dressed with the same weight and honesty as the rest of your wardrobe.",
            },
```

- [ ] **Step 9: Add `m_r3` to `m`'s `refinements[]`**

After `m_r2` "Drawstring tailored trousers" (`wardrobe-templates.js:587-598`):

```javascript
            {
                id: "m_r3",
                item: "Unstructured wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#5D718A", note: "Soft blue-grey" },
                },
                why: "Unstructured construction means it packs like the rest of your travel pieces — no stiffness, no bulk.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 10: Add the outfit to `m`'s `outfits[]`**

After "The Seamless Transit" (`wardrobe-templates.js:507-511`):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["m_r3", "m_f3", "m_f2"],
                context: "Cooler climates on the same trips your Seamless Transit outfit already covers.",
            },
```

- [ ] **Step 11: Add `g_r3` to `g`'s `refinements[]`**

After `g_r2` "White linen pocket squares" (`wardrobe-templates.js:694-703`):

```javascript
            {
                id: "g_r3",
                item: "Chesterfield overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy — the traditional choice" },
                },
                why: "The Chesterfield is the correct coat, not merely a warm one — velvet collar, fly front, exactly as tradition specifies.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 12: Add the outfit to `g`'s `outfits[]`**

After "The Ceremony" (`wardrobe-templates.js:615-619`):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["g_r3", "g_f1", "g_f3"],
                context: "For the business trips that take a traditionalist beyond the tropics — the Chesterfield over your suit.",
            },
```

- [ ] **Step 13: Verify syntax**

Run: `node --check wardrobe-templates.js`
Expected: no output, exit code 0.

- [ ] **Step 14: Commit**

```bash
git add wardrobe-templates.js
git commit -m "Add Beyond the Tropics travel capsule for 6 archetypes (t, q, w, c, m, g)"
```

---

## Task 2: Archetypes 7–12 (a, u, s, r, e, b)

**Files:**
- Modify: `wardrobe-templates.js` (archetypes `a`, `u`, `s`, `r`, `e`, `b`)

**Interfaces:**
- Consumes: nothing from Task 1 — independent archetype blocks.
- Produces: new refinement ids `a_r3`, `s_r3`, `r_r3`, `e_r3`, `b_r3`, plus a
  new outfit per archetype. Archetype `u` is a special case (see Step 3):
  it already has a climate-mistagged item this task fixes and reuses instead
  of creating a new one.

- [ ] **Step 1: Add `a_r3` to `a`'s `refinements[]`**

After `a_r2` "Geometric accessories" (find the entry following `a_r1`
"Double-breasted jacket" in `a`'s `refinements` array):

```javascript
            {
                id: "a_r3",
                item: "Minimal wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#1E1E1E", note: "Black — uninterrupted line" },
                },
                why: "Clean-seamed, unbelted, no superfluous hardware — the coat obeys the same rules as everything else you own.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 2: Add the outfit to `a`'s `outfits[]`**

After "The Clean Casual" (the third existing outfit in `a`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["a_r3", "a_f4", "a_f3"],
                context: "Cooler-climate travel without breaking your monochrome discipline.",
            },
```

- [ ] **Step 3: Fix `u_r2`'s climate tag and reuse it (no new item needed)**

`u` already has an item that is conceptually identical to what every other
archetype in this task is getting new: `u_r2`, "Packable weather layers"
(`wardrobe-templates.js:914-925`). It's currently tagged
`climate: ["temperate"]`, which per the Global Constraints section makes it
invisible to Tropical/Warm & Dry/Indoor Climate clients — the same bug this
whole plan exists to avoid introducing. Fix it in place rather than adding a
near-duplicate item:

Find:
```javascript
                id: "u_r2",
                item: "Packable weather layers",
                priority: 7,
                tier: "foundation",
                climate: ["temperate"],
```

Replace with:
```javascript
                id: "u_r2",
                item: "Packable weather layers",
                priority: 7,
                tier: "foundation",
                climate: ["all"],
```

(Leave every other field on `u_r2` — `paletteGuidance`, `why`, `guide` —
unchanged.)

- [ ] **Step 4: Add the outfit to `u`'s `outfits[]`**

After "The Resilient Suit" (the third existing outfit in `u`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["u_r2", "u_f3", "u_f4"],
                context: "Your existing packable weather layer, formalized here as the anchor of a dedicated capsule for cooler-climate legs of a trip.",
            },
```

- [ ] **Step 5: Add `s_r3` to `s`'s `refinements[]`**

After `s_r2` "Elevated t-shirts" (find the entry following `s_r1` "Tonal
palette anchors" in `s`'s `refinements` array):

```javascript
            {
                id: "s_r3",
                item: "Minimal wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#B8B8B3", note: "Soft grey — stays inside your gradient" },
                },
                why: "One more shade in the grey-to-black gradient you already build from, just heavier.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 6: Add the outfit to `s`'s `outfits[]`**

After "The Soft Structure" (the third existing outfit in `s`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["s_r3", "s_f3", "s_f2"],
                context: "Cooler climates, dressed in the same tonal restraint as everywhere else.",
            },
```

- [ ] **Step 7: Add `r_r3` to `r`'s `refinements[]`**

After `r_r2` "Textural layering pieces" (`wardrobe-templates.js:1141-1152`):

```javascript
            {
                id: "r_r3",
                item: "Soft unstructured overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#684C39", note: "Rich autumnal brown" },
                },
                why: "Unpadded shoulders and a soft drape carry through even in your one heavyweight piece.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 8: Add the outfit to `r`'s `outfits[]`**

After "The Effortless Weekend" (the third existing outfit in `r`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["r_r3", "r_f4", "r_f3"],
                context: "Autumn and winter travel, draped as softly as the rest of your wardrobe.",
            },
```

- [ ] **Step 9: Add `e_r3` to `e`'s `refinements[]`**

After `e_r2` "Expressive colour accents" (find the entry following `e_r1`
"Wool-silk-linen blends" in `e`'s `refinements` array):

```javascript
            {
                id: "e_r3",
                item: "Textured wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#B45C39", note: "Rust — one more textured contrast" },
                },
                why: "A heavily textured coat gives you one more surface to play pattern and contrast against once you're somewhere cold enough to need it.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 10: Add the outfit to `e`'s `outfits[]`**

After "The Complex Layer" (the third existing outfit in `e`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["e_r3", "e_f2", "e_f3"],
                context: "The one cold-climate trip a year — still an opportunity for contrast, not a reason to go quiet.",
            },
```

- [ ] **Step 11: Add `b_r3` to `b`'s `refinements[]`**

After `b_r2` "Classic ties for warm climates" (`wardrobe-templates.js:1367-1375`):

```javascript
            {
                id: "b_r3",
                item: "Wool overcoat for cooler climates",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy — matches your tropical suiting" },
                },
                why: "The one piece your tropical wardrobe doesn't need at home, but every business trip beyond it does.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 12: Add the outfit to `b`'s `outfits[]`**

`b` currently has only one outfit ("The Heatwave Executive" /
"The Colonial Club" / "The Breathable Classic" — confirm the exact final
entry by reading the array before inserting). Add after the last existing
outfit entry:

```javascript
            {
                name: "Beyond the Tropics",
                items: ["b_r3", "b_f4", "b_f3"],
                context: "Beyond the tropics you dress for daily — business travel to a cooler climate.",
            },
```

- [ ] **Step 13: Verify syntax**

Run: `node --check wardrobe-templates.js`
Expected: no output, exit code 0.

- [ ] **Step 14: Commit**

```bash
git add wardrobe-templates.js
git commit -m "Add Beyond the Tropics travel capsule for 6 archetypes (a, u, s, r, e, b)"
```

---

## Task 3: Archetypes 13–18 (h, l, x, p, k, f)

**Files:**
- Modify: `wardrobe-templates.js` (archetypes `h`, `l`, `x`, `p`, `k`, `f`)

**Interfaces:**
- Consumes: nothing from Tasks 1–2 — independent archetype blocks.
- Produces: new refinement ids `h_r3`, `l_r3`, `x_r3`, `k_r3`, `f_r3`, plus a
  new outfit per archetype. Archetype `p` is a special case (see Step 7),
  same pattern as `u` in Task 2: check an existing item before creating a
  new one.

- [ ] **Step 1: Add `h_r3` to `h`'s `refinements[]`**

After `h_r2` "Heritage colour palette" (find the entry following `h_r1`
"Half-canvas construction" in `h`'s `refinements` array):

```javascript
            {
                id: "h_r3",
                item: "Modern-cut wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy or charcoal" },
                },
                why: "Traditional coat, updated cut — the same formula as your suit.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 2: Add the outfit to `h`'s `outfits[]`**

After "The Architectural Heirloom" (the third existing outfit in `h`'s
`outfits` array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["h_r3", "h_f1", "h_f4"],
                context: "Familiar codes, cooler climate.",
            },
```

- [ ] **Step 3: Add `l_r3` to `l`'s `refinements[]`**

After `l_r2` "Transitional outerwear" (find the entry following `l_r1` in
`l`'s `refinements` array — read the array first to confirm `l_r2`'s exact
closing position, since this section of the file has previously shown
compression artifacts when read in bulk):

```javascript
            {
                id: "l_r3",
                item: "Wool overcoat, built to layer under",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#687383", note: "Slate — layers over everything in your knitwear collection" },
                },
                why: "Cut generously enough to sit over your existing knitwear collection rather than replacing it — one more layer, not a substitute for the others.",
                guide: ["colour_wardrobe", "layering_in_warm_climates"],
            },
```

- [ ] **Step 4: Add the outfit to `l`'s `outfits[]`**

After "The Quiet Contrast" / the third existing outfit in `l`'s `outfits`
array (`l`'s outfits are named "The Tactile Monochrome", "The Quiet
Contrast", "The Tonal Anchor" — verify against the file before inserting,
since `l` and `x` are adjacent and easy to conflate):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["l_r3", "l_f4", "l_f2"],
                context: "Where your layering system actually gets tested — somewhere cold enough to need every piece.",
            },
```

- [ ] **Step 5: Add `x_r3` to `x`'s `refinements[]`**

After `x_r2` "Texture over colour strategy" (find the entry following
`x_r1` "Summer tweed for texture" in `x`'s `refinements` array):

```javascript
            {
                id: "x_r3",
                item: "Textured wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal or stone — texture, not colour, does the work" },
                },
                why: "Heavier cloth, same restraint — the coat reads through texture alone, exactly like the rest of your wardrobe.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 6: Add the outfit to `x`'s `outfits[]`**

After "The Tonal Anchor" (the third existing outfit in `x`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["x_r3", "x_f4", "x_f3"],
                context: "Cooler-climate travel without introducing a single new colour.",
            },
```

- [ ] **Step 7: Check `p_r2`'s climate tag before deciding how to proceed**

`p` already has an item named "Travel-ready outerwear" (`p_r2`). Read its
current `climate` field:

Run: `grep -n "p_r2" -A 10 wardrobe-templates.js` (or open the file and find
the `p_r2` entry directly — it sits in `p`'s `refinements` array, after
`p_r1` "High-twist fabrics").

- If `p_r2`'s `climate` is already `["all"]`: leave it unchanged and reuse
  it directly in Step 8 below (skip creating a new item).
- If `p_r2`'s `climate` is anything else (e.g. `["temperate"]` or a specific
  climate list): change it to `["all"]` in place, following the exact same
  pattern as `u_r2` in Task 2 Step 3 — edit only the `climate` field, leave
  every other field on `p_r2` untouched — then reuse it in Step 8.

Either way, `p` does **not** get a brand-new refinement item — "Travel-ready
outerwear" already covers the same concept and creating a second, near-
identical item would duplicate content for no reason.

- [ ] **Step 8: Add the outfit to `p`'s `outfits[]`**

After "The Technical Weekend" (the third existing outfit in `p`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["p_r2", "p_f2", "p_f3"],
                context: "Your existing travel-ready outerwear, formalized here as the anchor of a dedicated cooler-climate capsule.",
            },
```

- [ ] **Step 9: Add `k_r3` to `k`'s `refinements[]`**

After `k`'s existing refinements entries ("Peak lapel jacket",
"Wedding/event pieces" — insert after the last one):

```javascript
            {
                id: "k_r3",
                item: "Formal wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#1E1E1E", note: "Black — works over the dinner suit too" },
                },
                why: "Winter galas and weddings call for a coat as considered as the suit underneath it — this is that coat.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 10: Add the outfit to `k`'s `outfits[]`**

After "The Wedding Standard" (the third existing outfit in `k`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["k_r3", "k_f3", "k_f1"],
                context: "Cold-weather weddings and evening events beyond the tropics.",
            },
```

- [ ] **Step 11: Add `f_r3` to `f`'s `refinements[]`**

After `f`'s existing refinements entries ("Navy core wardrobe",
"City-appropriate accessories" — insert after the last one):

```javascript
            {
                id: "f_r3",
                item: "Structured wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy — the core wardrobe colour, one size up" },
                },
                why: "Same sharp shoulder line as your suit, sized to go over it.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 12: Add the outfit to `f`'s `outfits[]`**

After "The City Stride" (the third existing outfit in `f`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["f_r3", "f_f4", "f_f3"],
                context: "Business travel beyond the city's own climate.",
            },
```

- [ ] **Step 13: Verify syntax**

Run: `node --check wardrobe-templates.js`
Expected: no output, exit code 0.

- [ ] **Step 14: Commit**

```bash
git add wardrobe-templates.js
git commit -m "Add Beyond the Tropics travel capsule for 6 archetypes (h, l, x, p, k, f)"
```

---

## Task 4: Archetypes 19–24 (n, d, y, z, v, o)

**Files:**
- Modify: `wardrobe-templates.js` (archetypes `n`, `d`, `y`, `z`, `v`, `o`)

**Interfaces:**
- Consumes: nothing from Tasks 1–3 — independent archetype blocks.
- Produces: new refinement ids `n_r3`, `d_r3`, `y_r3`, `z_r3`, `v_r3`, `o_r3`,
  plus a new outfit per archetype. This is the last content task — Task 5
  depends on all 24 archetypes (this task plus Tasks 1–3) being complete.

- [ ] **Step 1: Add `n_r3` to `n`'s `refinements[]`**

After `n`'s existing refinements entries ("Texture and pattern guide",
"Hopsack or textured fabrics" — insert after the last one):

```javascript
            {
                id: "n_r3",
                item: "Textured wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#666A42", note: "Olive/brown check — one more pattern to mix" },
                },
                why: "A checked or herringbone overcoat gives cold-weather travel the same pattern-mixing opportunity as the rest of your wardrobe.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 2: Add the outfit to `n`'s `outfits[]`**

After "The Textured Base" (the third existing outfit in `n`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["n_r3", "n_f2", "n_f3"],
                context: "Beyond the tropics — still no reason to default to plain.",
            },
```

- [ ] **Step 3: Add `d_r3` to `d`'s `refinements[]`**

After `d`'s existing refinements entries ("Tropical tailoring",
"Lighter heritage fabrics" — insert after the last one):

```javascript
            {
                id: "d_r3",
                item: "Classic wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#243B5A", note: "Navy" },
                },
                why: "A traditional silhouette, cut clean rather than heritage-heavy — same balance as the rest of your wardrobe.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 4: Add the outfit to `d`'s `outfits[]`**

After "The Climate Classic" (the third existing outfit in `d`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["d_r3", "d_f4", "d_f3"],
                context: "Cooler-climate travel, updated classic style.",
            },
```

- [ ] **Step 5: Add `y_r3` to `y`'s `refinements[]`**

After `y`'s existing refinements entries ("Tonal wardrobe building",
"Quiet palette anchors" — insert after the last one):

```javascript
            {
                id: "y_r3",
                item: "Minimal wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal" },
                },
                why: "One coat, no embellishment — quiet in exactly the way the rest of your wardrobe is quiet.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 6: Add the outfit to `y`'s `outfits[]`**

After "The Quiet Wardrobe" (the third existing outfit in `y`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["y_r3", "y_f4", "y_f3"],
                context: "Cooler-climate travel without disrupting your tonal wardrobe.",
            },
```

- [ ] **Step 7: Add `z_r3` to `z`'s `refinements[]`**

After `z_r2` "Worsted for temperate" (`wardrobe-templates.js:2508-2520`):

```javascript
            {
                id: "z_r3",
                item: "Travel overcoat for climates beyond your own rotation",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#4A4A4A", note: "Charcoal — sits outside your seasonal palette work by design" },
                },
                why: "Your wardrobe is already built for genuine seasons at home. This is the one piece for the seasons you visit but don't live in.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 8: Add the outfit to `z`'s `outfits[]`**

After "The Transitional Layer" (`wardrobe-templates.js:2417-2421`):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["z_r3", "z_f1", "z_f2"],
                context: "Beyond your own seasonal rotation — travel to a climate colder than anything you dress for at home.",
            },
```

- [ ] **Step 9: Add `v_r3` to `v`'s `refinements[]`**

After `v`'s existing refinements entries ("Light-weight knits",
"Soft canvas weekend bag" — insert after the last one):

```javascript
            {
                id: "v_r3",
                item: "Unlined wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#687383", note: "Slate — the single cool note" },
                },
                why: "Everything else in your wardrobe is built for warmth and ease; this is the deliberate exception, bought for the trips that call for it.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 10: Add the outfit to `v`'s `outfits[]`**

After "The Light Layer" (the third existing outfit in `v`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["v_r3", "v_f4", "v_f3"],
                context: "The rare cold-climate trip, dressed with the same minimalism as the Riviera.",
            },
```

- [ ] **Step 11: Add `o_r3` to `o`'s `refinements[]`**

After `o`'s existing refinements entries ("Peak lapel details",
"Wool-silk blend suit" — insert after the last one):

```javascript
            {
                id: "o_r3",
                item: "Sharp wool overcoat",
                priority: 8,
                tier: "enhancement",
                climate: ["all"],
                paletteGuidance: {
                    all: { color: "#1E1E1E", note: "Black — matches your evening suiting" },
                },
                why: "Cut as sharp as your double-breasted blazer, built for cold-weather events rather than daily wear.",
                guide: ["outerwear", "overcoat"],
            },
```

- [ ] **Step 12: Add the outfit to `o`'s `outfits[]`**

After "The Silk Blend" (the third existing outfit in `o`'s `outfits`
array):

```javascript
            {
                name: "Beyond the Tropics",
                items: ["o_r3", "o_f3", "o_f1"],
                context: "Cold-climate galas and events beyond the tropics.",
            },
```

- [ ] **Step 13: Verify syntax**

Run: `node --check wardrobe-templates.js`
Expected: no output, exit code 0.

- [ ] **Step 14: Verify every new id is unique and every new outfit resolves**

Run this one-off check (no permanent test file needed — this is a data
file with no existing test harness for it):

```bash
node -e "
var fs = require('fs');
var src = fs.readFileSync('wardrobe-templates.js', 'utf8');
src = src.replace('var wardrobeTemplates', 'global.wardrobeTemplates');
src = src.replace(/^function filterItemsByClimate[\s\S]*$/m, '');
eval(src);
var archetypes = Object.keys(wardrobeTemplates);
var seen = {};
var errors = [];
archetypes.forEach(function (key) {
    var t = wardrobeTemplates[key];
    var allIds = [].concat(t.foundation || [], t.refinements || []).map(function (i) { return i.id; });
    allIds.forEach(function (id) {
        if (seen[id]) errors.push('DUPLICATE ID: ' + id);
        seen[id] = true;
    });
    var travelOutfit = (t.outfits || []).filter(function (o) { return o.name === 'Beyond the Tropics'; });
    if (travelOutfit.length !== 1) {
        errors.push(key + ': expected exactly 1 Beyond the Tropics outfit, found ' + travelOutfit.length);
        return;
    }
    travelOutfit[0].items.forEach(function (id) {
        if (allIds.indexOf(id) === -1) errors.push(key + ': outfit references unknown id ' + id);
    });
});
if (archetypes.length !== 24) errors.push('Expected 24 archetypes, found ' + archetypes.length);
if (errors.length) {
    console.log('FAIL');
    errors.forEach(function (e) { console.log(' - ' + e); });
    process.exit(1);
} else {
    console.log('PASS: 24 archetypes, all Beyond the Tropics outfits resolve, no duplicate ids');
}
"
```

Expected: `PASS: 24 archetypes, all Beyond the Tropics outfits resolve, no duplicate ids`

If it fails, fix the reported archetype's entries before continuing — a
typo'd id reference here is exactly the silent-failure mode the Global
Constraints section warns about (the app won't error, the item will just
vanish from the card).

- [ ] **Step 15: Commit**

```bash
git add wardrobe-templates.js
git commit -m "Add Beyond the Tropics travel capsule for remaining 6 archetypes (n, d, y, z, v, o)"
```

---

## Task 5: Cache-bust and final verification

**Files:**
- Modify: `sw.js:9` (`CACHE_VERSION`)

**Interfaces:**
- Consumes: all 24 "Beyond the Tropics" outfits from Tasks 1–4.
- Produces: nothing further downstream — this is the last task.

- [ ] **Step 1: Bump `CACHE_VERSION` in `sw.js`**

`wardrobe-templates.js` is listed in `sw.js`'s `PRECACHE` array without a
`?v=` param (`sw.js:21`, `"./wardrobe-templates.js",`), so per CLAUDE.md any
change to it still requires a `CACHE_VERSION` bump — the service worker
precaches by exact URL and won't know the file changed otherwise.

Find in `sw.js`:
```javascript
var CACHE_VERSION = "bbs-v112";
```

Replace with:
```javascript
var CACHE_VERSION = "bbs-v113";
```

- [ ] **Step 2: Verify syntax**

Run: `node --check sw.js`
Expected: no output, exit code 0.

- [ ] **Step 3: Start a local server**

Run: `npx serve .` (or reuse a server already running for this worktree)

- [ ] **Step 4: Load the app and spot-check three archetypes in the worksheet**

Using a browser (or Playwright), complete the style quiz to reach an
archetype whose key is one of `w` (Coastal Modernist — a warm-climate-heavy
archetype, the case most likely to have been broken by a wrong climate tag),
`l` (Layering Specialist — the archetype whose voice this capsule fits most
naturally), and `z` (Seasonal Purist — already has other climate-tagged
items, good regression check). For each:

- Open the worksheet.
- Confirm a 4th outfit card titled "Beyond the Tropics" renders in the
  "Signature Combinations" section, with exactly 3 items listed (not 2 — a
  missing 3rd item means an id typo or a wrong climate tag slipped through).
- Confirm the new refinement item appears in the "Refinements" checklist
  section below, with an "Upgrade" tier badge (not "Essential" or
  "Luxury").
- Click "View in Guide" on the new item and confirm it navigates to either
  the Overcoat topic or the Layering in Warm Climates topic (not a blank
  page — a blank page means the `guide` path array doesn't resolve).

Since the worksheet's archetype is quiz-driven, use the double-tap-logo
session reset between checks to get a clean run, and pick different climate
quiz answers (Tropical, then Temperate) across runs to confirm the outfit
card still shows exactly 3 items regardless of which climate the client
selected — this is the specific regression this plan's Global Constraints
section exists to prevent.

- [ ] **Step 5: Run the full data audit**

Run: `node verify/audit.js`
Expected: exits clean (this plan doesn't touch `data.js`, but this is cheap
insurance against an unrelated regression).

- [ ] **Step 6: Run the full smoke suite**

Run: `node verify/smoke.js` (against the server started in Step 3; set
`SMOKE_URL` if not on port 3000)
Expected: all checks pass, including "worksheet renders" — that check
already exercises the outfit-card loop generically, so it covers all 24 new
cards without any test changes. If "Cloth Room entry (moment + lands)" is
the only failure, re-run once — this plan's own history has this test
flaking on a cold server unrelated to any code change; a second run passing
confirms it.

- [ ] **Step 7: Commit**

```bash
git add sw.js
git commit -m "Bump cache version for travel and seasonal capsule"
```
