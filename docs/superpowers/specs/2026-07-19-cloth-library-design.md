# Cloth Library and Filtering — Design

Date: 19 July 2026
Status: approved, ready for implementation

## Background

Benchmarked against three competitor tools:

- **[Officine Paladino Style Tool](https://styling.officinepaladino.com/)** — jacket/vest/trousers,
  each fabric-swappable; SB/DB and lapel toggles; layer hide/show; image download and
  email share. Runs on the iDesigniBuy configurator platform.
- **[Collaro](https://collaro.co/)** — a full made-to-measure *ordering* configurator
  (jacket, trousers, shirt, shorts) with deep detail options and a measurement profile.
- **[SuitSupply Look Builder](https://suitsupply.com/en-us/lookbuilder)** — outfit
  composition from real stocked products, including a separates mode, with add-to-cart.

**The Cloth Room's ensemble mode already matches Paladino's tool structurally** — same three
garment layers, per-garment cloth swapping, jacket closure/lapel/pocket options, PDF and PNG
export. This work therefore closes specific gaps rather than building a styling tool.

Four gaps were identified. Three were accepted, decomposed into three specs, to be built in
this order:

1. **Cloth library depth and filtering** — this spec.
2. Vest and trouser detailing (Collaro's signature strength).
3. Look composition (the SuitSupply layer).

Multiple viewing angles was considered and dropped: heaviest work, no decision-making value.

## Problem

The library holds **14 cloths across 13 mills**. Paladino filters hundreds. There is no
filtering in the Cloth Room because 14 cloths do not need any.

Worse, each cloth carries a **hand-written canvas drawing function**. The `fresco` entry alone
is 14 lines of bespoke drawing code. Scaling to 100+ cloths this way means 100+ bespoke
functions and roughly 1,500 lines of near-duplicate drawing logic — and "add a cloth"
stays a coding task forever instead of becoming data entry.

## Goals

- Grow the library to ~100 cloths.
- Make cloth tiles data-driven, not hand-coded.
- Add filtering that earns its place at that volume.
- Assert nothing about a cloth that cannot be verified.

## Non-goals

- Vest and trouser detailing (spec 2).
- Look composition (spec 3).
- Multiple viewing angles (dropped).
- Product linking and SKUs (blocked on founder input, unchanged).

## Architecture

Three layers, currently tangled into one file.

### `cloth-data.js` — pure data, no functions

One record per cloth:

```js
{
    key: "fox_1772_classic_black",
    name: "1772 Flannel, Classic Black",
    mill: "Fox Brothers",
    bunch: "1772 Flannel",
    composition: "Merino Lambswool / Cashmere",
    weight: "370 g",
    weave: "flannel",
    pattern: "plain",
    colour_family: "charcoal",
    character: "...",
    guidePath: "cloth_origins>england>fox_brothers",
    verified: true,
    source: "https://foxflannel.com/products/ff26-1772-flannel-classic-black"
}
```

### `weave-engine.js` — renders a tile from a record

Six weave grounds — plain, twill, hopsack, flannel, birdseye, herringbone — crossed with five
overlays — none, chalkstripe, pinstripe, windowpane, glen. No cloth-specific code anywhere.
A cloth's visual identity comes from its ground colour, overlay colour, and overlay pitch.

### `fabric-visualiser.js` — keeps the Cloth Room UI

Loses the data and the drawing code. This file has grown too large to reason about in one
pass; the split is in scope because it is the direct cause of the scaling problem, not a
refactor undertaken for its own sake.

## The `verified` flag

The accuracy mechanism, and the reason this library can be trusted next to the mill tree.

Research established that verifiable cloth data is richer than first assumed: Fox publishes a
full online cloth catalogue with individual references and weights, and VBC publishes
collections by fineness with weight ranges. The realistic verified share is **60–80 cloths**,
with the house-style remainder a minority.

- `verified: true` — real bunch entry. Shows the bunch name and exact spec, carries a `source`.
- `verified: false` — built to the mill's documented house style. Shows mill and character
  only. **Carries no composition or weight figure at all**, rather than a plausible guess.

`verify/audit.js` enforces that an unverified cloth carries no spec field, so the distinction
cannot erode silently as the library grows.

## Filtering

Facets are drawn from what the data actually supports: **Mill · Weave · Pattern · Colour ·
Weight**.

Filter chips sit above the swatch tray, reusing the Mill Map's existing region-chip pattern so
the interaction is a language already present in the app. Multi-select within a facet, AND
across facets, with a live result count and a clear-all.

At 100 cloths on an iPad the tray must stay scannable, so on narrow layouts the chips collapse
to a single "Filter" button carrying an active-filter count.

## Data flow

Cloth records are static, so tiles generate once on first paint and cache by key in the
existing tile cache — the engine costs nothing per cloth swap. Filtering is a plain array
filter over ~100 records; no index is warranted at this size.

## Connection to existing systems

Every cloth's `mill` must resolve to a real node in Cloth Origins, enforced by the audit.

This is what makes the library worth more than Paladino's, whose cloths link nowhere: tapping
a cloth can reach its mill's page, its region on the Mill Map, and its weave topic in the
guide. It also **narrows the 239-topic reachability gap** identified in the guide overhaul,
since fabric and mill topics become reachable from the Cloth Room rather than by browsing alone.

## Verification

`verify/audit.js` gains:

- every cloth's `guidePath` resolves to a real topic
- every `mill` matches a Cloth Origins node
- no unverified cloth carries a spec field
- every `weave` and `pattern` value is in the approved vocabulary

`verify/smoke.js` gains a Cloth Room filter pass.

The weave engine gets one self-check asserting every weave × overlay combination renders a
non-blank, non-uniform tile.

## Risks

- **Research volume.** ~100 cloths is a large research job and mill data quality varies. The
  `verified` flag contains this risk rather than eliminating it.
- **Visual fidelity.** A parameterised engine may not capture a distinctive cloth as precisely
  as bespoke drawing code. Accepted; a hand-written override path remains possible for a hero
  cloth if one genuinely needs it.
- **Tray usability at 100 cloths.** Mitigated by filtering, but needs measuring on a real iPad
  viewport, not assumed.
