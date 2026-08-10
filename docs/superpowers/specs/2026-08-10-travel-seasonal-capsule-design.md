# Travel & Seasonal Capsule — Design Spec

**Date:** 2026-08-10
**Status:** Approved for implementation planning

## Problem / Motivation

BBS clients dress for the tropics year-round — the app's own Outerwear topic
already frames itself as "a travel accommodation for a wardrobe built around
the tropics." Business travel to cooler climates is a real, recurring need,
but today it's covered by exactly one guide topic (Overcoat) and zero
worksheet content that answers the practical question a client actually has:
"what do I pack/wear."

This is the second of two features chosen in an earlier planning pass
(feature 1, the ensemble flat-lay polish, shipped in PR #9). The founder
deferred the choice of *how* to build it to this session; the approach below
was chosen over a content-only guide addition or a new standalone
trip-planner tool (see Alternatives Considered).

## Goal

Give every archetype a 4th worksheet outfit — **"Beyond the Tropics"** — a
cooler-climate capsule the client can check off alongside their existing
Business Anchor / Smart Climate / Transit Look outfits, using the worksheet's
existing infrastructure with zero new code.

## Approach

Extend `wardrobe-templates.js` only. No changes to `app.js`, `styles.css`, or
the `data.js` guide tree (new content links to two topics that already
exist).

For each of the 24 archetypes:

1. **One new item**, added to that archetype's `refinements[]` array:
   - `climate: ["temperate"]`
   - `tier: "enhancement"` (worksheet displays this as "Upgrade")
   - `id` follows that archetype's existing numbering convention (e.g.
     `t_r3` if `t_r1`/`t_r2` already exist)
   - `guide` links to whichever of the two existing topics fits the piece:
     `["outerwear", "overcoat"]` for structured coats, or
     `["colour_wardrobe", "layering_in_warm_climates"]` for knitwear/cardigan
     -style layers
   - Bespoke `item`, `mills` (where that archetype's existing items already
     carry a `mills` field), `paletteGuidance`, and `why` copy, matched to
     that archetype's established voice (compare the Craftsman's practical
     register against the Modern Architect's minimal one — each archetype's
     existing `why` copy already reads distinctly and the new copy must
     match its own)

2. **One new outfit**, appended to `outfits[]`:
   - `name: "Beyond the Tropics"` — identical across all 24 archetypes. This
     echoes the Outerwear topic's own framing, so the phrase becomes a
     recognizable thread running from guide content through to the
     worksheet.
   - `items`: the new temperate-tagged item's id, plus two of that
     archetype's existing `climate: ["all"]` item ids (typically a shirt and
     a trouser already defined in `foundation[]`) — reused by reference, not
     duplicated.
   - `context`: one bespoke sentence per archetype connecting the capsule to
     travel/cooler climates in that archetype's tone.

## Why this shape

- Reuses the worksheet's existing outfit-card rendering (`app.js`, the
  `outfitsHTML` loop around line 4900) — no new UI, no new state, no new
  onboarding question. The card is simply the 4th one the already-generic
  renderer draws from `wardrobeTemplates[archetype].outfits`.
- Reuses existing guide topics (Overcoat, Layering in Warm Climates) — no new
  `data.js` topic, no topic-count change, no `audit.js` change.
- `climate: ["temperate"]` matches vocabulary already in use elsewhere in the
  file (e.g. `z_r1`, `z_r2`, and two other existing items) — no new
  vocabulary invented.
- `tier: "enhancement"` (not foundation) — this is a situational, occasional
  piece, not core to daily tropical dressing. This matches how the one
  existing comparable item (`z_r1`, "Layering seasons") is already scored,
  and how the Overcoat topic itself is scored in `data.js`
  (`priority: "medium"`, `frequency: "seasonal"`).

## Alternatives considered

- **Content-only guide topics.** Lower effort, but text-only — no worksheet
  presence, so a client never sees it unless they browse Guide unprompted.
  Rejected: doesn't reach the client at the moment they're actually building
  their wardrobe (the worksheet).
- **New standalone trip-planner tool** (pick a destination climate/season,
  get a dynamically assembled capsule). Higher "wow" factor, but requires new
  state, a new view, and duplicates logic the worksheet's outfit system
  already provides. Rejected as scope creep against YAGNI — the worksheet
  mechanism already does this shape of work.

## Non-goals

- No new "do you travel?" onboarding question or conditional display — the
  capsule shows unconditionally per archetype, exactly like the existing 3
  outfits do.
- No new guide topics — reuses Overcoat and Layering in Warm Climates as-is.
- No app.js/CSS changes — the existing "Capsule" tag label
  (`app.js` `outfit-tag` span) is reused as-is for this 4th card too; it is
  not renamed or given a distinct badge.

## Rollout

- `wardrobe-templates.js` is listed in `sw.js`'s `PRECACHE` array without a
  `?v=` param, but per CLAUDE.md any cached-file change still requires a
  `CACHE_VERSION` bump. Bump it once, at the end, after all 24 archetypes are
  written (currently `bbs-v112` → `bbs-v113`).
- Pure data file, no functions — `node --check` is the only syntax gate.

## Verification

- `node --check wardrobe-templates.js`
- Load the app, open the worksheet for a spread of archetypes (a
  tropical-leaning one, a layering-leaning one, and the already-seasonal
  "Seasonal Purist" whose existing content this pattern was modeled on),
  confirm the "Beyond the Tropics" card renders, its guide links resolve to
  real topics, and its tier badge shows "Upgrade".
- `node verify/audit.js` (data.js is untouched by this work, but this is
  cheap insurance).
- Full `node verify/smoke.js` — the existing "worksheet renders" check
  already exercises the outfit-card loop generically, so it covers the new
  card without any test changes.

## Scope estimate

24 archetypes × (1 item + 1 outfit) ≈ 200–300 lines added to
`wardrobe-templates.js`. Homogeneous, content-only work — one implementation
task, no iterative engineering loop needed.
