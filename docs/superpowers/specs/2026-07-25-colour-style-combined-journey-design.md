# Colour × Style Combined Journey — Design Spec

**Date:** 2026-07-25
**Workstream:** 2 of the July-2026 batch (Colour Analysis rework + combined journey)
**Status:** Approved for planning (design approved via interactive concept)
**Concept artifact:** the combined-journey/unified-result mockup (Colour→Style→You, two example clients)

## Overview

Rework the Colour Direction experience and stitch it together with Style Direction into a single guided journey. Colour comes **first** (the visual hook) and produces a **client-simple** result; Style builds on it; both resolve into **one unified "This Is You"** result. The client's colour palette then drives what they're shown downstream — the Cloth Room's recommended cloths and the wardrobe worksheet.

The colour *content* is already strong and menswear-specific (each profile carries `bestColours`, `strongNeutrals`, `accentColours`, `contrast`, `matching`, `fabricFinish`, `hardware`, `pattern`, `strategy`). This rework is about **presentation and architecture**, not adding Diploma depth: distil that dense, consultation-style content into something a client grasps in seconds, reorder the flow, and let the palette propagate.

## Goals

1. A client finishes the colour step understanding, in plain language, **what their colours are and how to wear them** — no season/theory jargon on screen.
2. Colour → Style → **one unified result** the client reads as a single identity.
3. The client's palette visibly shapes the **Cloth Room recommendations** and **worksheet**.
4. The whole thing looks **premium and bespoke** — like serious craft, not a template.

## Non-goals

- Not merging the two quizzes. They keep **separate question sets and separate scoring**; only the *result presentation* combines. (`CLAUDE.md`: "Style and Colour are separate quizzes — never merge.")
- Not surfacing the 12/16-season systems, undertone theory, or draping method to the client. The four-variable read (undertone · value/depth · chroma · contrast) still runs under the hood via the existing scoring; it is never shown as jargon.
- Not a framework rewrite (see `docs/framework-spike-findings.md` — stay vanilla).
- No new quiz for colour — the existing `colourDirectionQuestions` and scoring stay; only their ordering, result, and downstream use change.

## Product decisions (resolved)

- **Headline voice:** plain descriptor as the headline (e.g. "Warm & Soft"), the evocative profile name as a subtitle (e.g. "Soft Tonal Warmth"). Descriptor derived from the profile's dominant variables (undertone + depth, with contrast in the reasons).
- **Combined result, separate quizzes:** the unified result screen shows colour type + palette + archetype together; the underlying `scoreColourDirectionAnswers()` and the style archetype scoring remain independent code paths.
- **Colour first:** the guided journey runs Colour → Style. (Each remains independently launchable from the menu for staff/returning use — see Flow.)
- **Phased delivery** (below) so value ships early and the big integration is de-risked.

## The client-simple colour result (design)

Replaces the current dense colour result with a distilled, scannable layout. Sections, in order:

1. **Type headline** — micro-label "YOUR COLOUR TYPE", the plain descriptor as the serif headline, the profile `name` as subtitle, and the profile `desc` as one supporting line.
2. **Three plain reasons** — Undertone / Depth / Contrast, each a short value ("Warm", "Medium", "Soft") + one everyday sentence. Derived from the profile's variables (not shown as scores).
3. **Palette, split by role** — `strongNeutrals` under "Neutrals — your foundation (suits, coats, trousers)" and `accentColours` under "Accents — closer to the face (shirts, knits, ties)". Large named swatches (name + hex).
4. **How to wear it, in 3 moves** — distilled from the profile's rich fields into three cards:
   - *Suits & coats → your neutrals* (from `strongNeutrals`)
   - *Shirts → near your face* (calm neutrals + a touch of accent)
   - *Ties, knits & metal → where to play* (from `accentColours` + `hardware` distilled to a one-liner)
   Each card shows a small row of its colours.
5. **Two supporting cards** — *Fabric finish* (from `fabricFinish`, one sentence) and *Keep it tonal / Sharp separation* (from `contrastArchitecture`/`strategy`, one sentence).
6. **Archetype tie-in** — "Paired with your style: The [Archetype]" linking to the style result, presented as one identity.

The full profile depth remains available (e.g. an optional "the full read" expansion) but is never the default surface. Copy is British English, warm, non-clinical.

## Flow / journey architecture

- **Guided journey (primary):** entering the journey runs Colour first (its existing questions + measure moment), then transitions into Style (onboarding + style questions), then renders the **unified result**. The colour result content is shown as part of the unified result rather than as a separate terminal screen when in the combined flow.
- **Separate entry preserved:** Colour Direction and Style Direction remain launchable individually from the home menu (staff demos, returning clients) — in that case each shows its own result as today, plus a prompt to complete the other for the full picture.
- **State:** the journey order and cross-links use `appState` (`quizAnswersById` for style, the colour scoring output / selected palette key for colour). Add explicit state for the colour profile key and journey position in `getFreshState()`. Honor the kiosk invariants (idle attract-reset, double-tap-logo reset, session persistence, no auto-advance, tap-answer→tap-Next).
- **Never-merge boundary:** two independent scoring functions; the unified result is a *presentation* that reads both. Do not create a combined scoring model.

## Palette drives everything (phased)

**Phase 1 — Reorder + unified result + simplified colour output.**
Deliver the combined journey (Colour→Style→unified result) and the client-simple colour result design above. No downstream data changes yet. This is the independently valuable core.

**Phase 2 — Palette → Cloth Room recommendations.**
The client's palette re-ranks/filters `getRecommendedFabricKeys()` so the Cloth Room's recommended bunches favour cloths matching the client's neutrals/accents. Requires a mapping from palette colours to cloth colour metadata (the cloth library already has a `colour` facet used by `VIS_FACETS`). Degrade gracefully when no colour result exists (current behaviour).

**Phase 3 — Worksheet tinted to palette.**
The wardrobe worksheet's foundation pieces are presented in the client's neutral palette (swatch cues on checklist items), so the checklist speaks in the client's colours. Falls back to the neutral default when no colour result exists.

Each phase is a separate implementation plan; Phase 1 must ship working on its own.

## Design quality bar

The founder's explicit requirement: the result must look **premium and bespoke**. Within the app's hard constraints (vanilla ES5, no build, light-only theme, self-hosted EB Garamond + Manrope, the tape-measure signature, offline), implementation should:

- Draw on the founder's reference libraries for calibre — 21st.dev, Aceternity UI, Refero, Mobbin, Godly, 10px — for layout, spacing, and interaction polish (see the `design-reference-sites` memory). Adapt, don't copy; keep it on-brand and light.
- Use the `frontend-design` (and/or `ui-ux-pro-max`) skill during build for typographic hierarchy, considered motion, and distinctiveness — avoid templated defaults.
- Lean on the brand-exact tokens in `styles.css` `:root` (ink `#111110`, cream `#eae5dd`, taupe `#a4a19c`, bronze `#9a7b4f`) and the EB Garamond/Manrope pairing. Palette-as-hero: the client's colours are the visual centrepiece.
- Respect `prefers-reduced-motion`; touch-first (≥44px, `:active` states, 16px+ inputs); the single delegated `data-action` click handler; and the `button:hover` / `button:active` cascade traps (`.btn-bare` + targeted `!important`).

## Architecture & integration points (existing code)

- `colour-direction.js` — `colourDirectionQuestions` (unchanged), the profile objects (`soft_tonal_warmth`, `clean_cool_contrast`, `earth_led_balance`, … with the rich fields), `scoreColourDirectionAnswers()`. The descriptor/reasons derive from the profile + its variables.
- `app.js` — `renderColourDirection()` / `renderColourDirectionResult()` (colour quiz + result), `renderOnboarding()` / `renderDiscover()` / `renderResult()` (style), the `render()` switch router, `getFreshState()`, the delegated handler, the measure-moment.
- `fabric-visualiser.js` — `getRecommendedFabricKeys()` (Phase 2 hook).
- `wardrobe-templates.js` + worksheet render (Phase 3 hook).
- New state fields go in `getFreshState()` first; views are string-concatenation `case`s in `render()`.

## Verification (definition of done, per CLAUDE.md)

1. `node --check` on every touched `.js`.
2. App loads, validator passes, **zero console errors** on load and through the full journey.
3. `node verify/smoke.js` green (it covers both quizzes to result, worksheet, dossier export, offline boot) — extend the Playwright coverage for the new journey ordering and unified result.
4. Manual iPad-viewport check: colour-first journey; client-simple result reads clearly; palette propagates (Phase 2/3); premium look holds; reduced-motion respected.
5. Cache-busting: bump `?v=` for touched app.js/feature-JS + styles.css in `index.html` and `sw.js`, and `CACHE_VERSION`.
6. If `data.js`/metadata touched (not expected): run `node verify/audit.js`.

## Rollout

Phase 1 as its own branch → PR/merge to `master` (GitHub Pages live) after the founder's go-ahead. Phases 2 and 3 as follow-on branches. Update `CHANGELOG.md` each phase.
