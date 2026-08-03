# Provenance Ribbon polish — design

## Problem
The Provenance Ribbon (the marquee of mill houses drifting past on the Mill
Map) was described at ship time as a "quiet brass-ruled ribbon" replacing an
older draggable tape blade. Two things have drifted since:

1. **A real bug.** `.pmarq-house` sets `border: none; padding: 0.7rem 0.2rem`
   with no `!important`, so the base `button {}` reset in styles.css (which
   sets `border: 1px solid var(--line-strong) !important` and
   `padding: 15px 28px !important`) wins at rest — confirmed via computed
   styles in a live page (`border: "1px solid rgba(17, 17, 16, 0.18)"`,
   `padding: "15px 28px"`). Every ribbon entry renders as a boxed pill with
   heavy padding instead of the intended plain, tightly-spaced marquee text.
   `.btn-bare` (already applied) only opts the element out of the *hover*
   invert — it does nothing for the base rule, which has no
   `:not(.btn-bare)` exception.
2. **Dead CSS.** `.ptape-scroll`, `.ptape-rail`, `.ptape-blade`, `.ptape-tick`,
   `.ptape-year`, `.ptape-house`, `.ptape-stem`, `.ptape-label` (plus their
   hover/focus/active states, ~100 lines) are leftover styles for the old
   draggable tape blade the Ribbon replaced. Nothing in mill-map.js's markup
   references them any more — `.ptape-block`, `.ptape-head`, `.ptape-title`,
   `.ptape-lead` are the only survivors still in use, as the section's
   wrapper/heading.

Separately, the Ribbon has never actually been *ruled* — its top/bottom edge
is a plain 1px solid border, not the ticked/ruled line its own description
implies. The app already has an established ticked-track visual language
(the worksheet progress bar's `repeating-linear-gradient` tick pattern,
1px lines every 10px) that this can reuse rather than invent a new one.

Kinetic Titles was reviewed in the same pass and found to have no equivalent
gap — the word-stagger + single foil sweep is a clean, already-fixed
implementation, and reference-site research (21st.dev's marquee gallery,
GSAP-style reveal patterns) confirmed the current restrained, text-only
approach is the right register for this brand. It is explicitly out of scope
for this pass — left untouched.

## Fix 1 — the cascade bug
Add `!important` to `.pmarq-house`'s `border`, `padding`, and `background`,
matching the exact precedent `.map-globe-pin` already uses for the identical
base-`button{}` collision (styles.css:10834-10855, one of the five
components CLAUDE.md's "button:hover trap" note names as having hit this
class of bug before).

## Fix 2 — remove dead CSS
Delete the eight unused `.ptape-*` selectors and their state variants.
Keep `.ptape-block` / `.ptape-head` / `.ptape-title` / `.ptape-lead` — still
live, still referenced in mill-map.js.

## Enhancement 1 — ticked rule lines
Replace `.pmarq`'s plain `border-top` / `border-bottom` with the same
`repeating-linear-gradient` tick pattern used on `.worksheet-progress-bar`,
rendered in a bronze tone rather than the worksheet's ivory/dark, so the
Ribbon sits between two literal ruled lines instead of a flat rule.

## Enhancement 2 — tick dividers between entries
A thin bronze tick between each `.pmarq-house` entry, via a `::before`
pseudo-element (not `border-left` — that would fight Fix 1's
`border: none !important` on the same element), replacing or supplementing
the current `gap: 2.2rem` spacing on `.pmarq-track`, echoing measurement
marks as the ribbon drifts.

## Non-goals
- Decade markers / major-tick-at-each-decade (considered as approach 3,
  parked — real added complexity for an element that's deliberately ambient,
  not a primary reading surface).
- Any change to Kinetic Titles — reviewed, no gap found, left as-is.
- Any change to the marquee's scroll speed, pause-on-hover behaviour, or
  edge-fade mask — all already correct.

## Testing / deploy checklist
- Playwright before/after screenshot of the Ribbon.
- Confirm computed styles on `.pmarq-house` show `border: none` and the
  intended `0.7rem 0.2rem` padding after the fix.
- `node verify/smoke.js` — all green (CSS-only change, but confirms no
  regression elsewhere).
- `node verify/audit.js` — all green (script-order check unaffected, CSS-only
  change).
- Bump `styles.css?v=` in index.html + sw.js precache list + `CACHE_VERSION`
  in sw.js.
