# QR results share — design

## Problem
The only way a client leaves with their result today is `Share to Phone`
(`navigator.share()`, app.js:6683), which opens the **kiosk iPad's own**
share sheet — the client has to text/email/AirDrop themselves through the
store's device and accounts. `CLAUDE.md` already flags QR sharing as a
deferred feature ("QR-code sharing was deferred until hosting existed;
hosting now exists... do not build it without the founder asking") — this
spec is that green light.

## Feature
A "Scan to Take With You" QR option next to `Share to Phone` on the style
result and colour result screens. The client scans with their own phone's
camera — no interaction with the kiosk's accounts needed — and lands on the
same app (GitHub Pages), pre-loaded with their result.

## What the QR encodes
Query params on the site root, whichever result keys currently exist:
```
?styleKey=<archetypeKey>&colourKey=<colourResultKey>
```
No client name, no worksheet checklist, no Cloth Room selections — just the
two diagnostic result keys. This keeps the payload under ~100 characters, so
the QR renders at a low density and stays reliably scannable off a screen
under normal store lighting. Richer state (worksheet, ensemble cloths) is
explicitly out of scope for this round — see Non-goals.

## Restore-on-load
Hooks in immediately after `appState` is loaded from `localStorage`
(app.js:3326-3335) — a client's own phone has no saved session, so this
branch only ever fires on a fresh device, never mid-session on the kiosk
itself:

```javascript
var shareParams = new URLSearchParams(location.search);
var sharedStyleKey = shareParams.get("styleKey");
var sharedColourKey = shareParams.get("colourKey");
if (sharedStyleKey || sharedColourKey) {
    appState = getFreshState();
    if (sharedStyleKey) appState.archetypeKey = sharedStyleKey;
    if (sharedColourKey) appState.colourResultKey = sharedColourKey;
    if (sharedStyleKey && sharedColourKey) {
        appState.inJourney = true;
        appState.journeyStage = "done";
        appState.view = "result";
    } else if (sharedStyleKey) {
        appState.view = "result";
    } else {
        appState.view = "colour-result";
    }
}
```

When both keys are present, `journeyStage = "done"` routes into the
**existing unified-result rendering** (`renderResult()`'s `isUnified` branch,
app.js:4634) that already folds the colour result into the style card under
"This Is You" — no new combined view needs to be built.

`renderResult()` already null-guards every quiz-derived fact (the "Your
Profile" facts grid, climate/palette notes, tags) rather than assuming they
exist, so a restore carrying only the two result keys renders cleanly with
those sections simply omitted, not broken or blank.

## UI placement
No new modal — the app has no existing popup pattern (checked; the closest
analogue, `.discovery-panel`, is a full-height slide-out, too heavy here).
Instead: a new `data-action="share-qr"` button added to the existing
`.arch-staff-actions` row on both `renderResult()` (app.js:4763-4768) and
`renderColourDirectionResult()` (app.js:7400-7405), next to `Share to Phone`.
Tapping it toggles an inline reveal below the row — a small card containing
a canvas the QR draws into, plus the caption "Scan with your phone's camera
to save your results."

## State and wiring
New `appState.showShareQR` boolean, added to `getFreshState()` alongside
`openFilterDD` (same kind of transient UI-toggle field, not a result value).
One new `data-action="share-qr"` branch in the single delegated click
handler (app.js, alongside `share-native`/`save-card`) that flips
`appState.showShareQR` and calls `render()` — no export helpers involved,
this is a pure UI toggle. Set back to `false` whenever `result` or
`colour-result` is freshly entered (quiz restart, `navigate()` into either
view) so it never reopens already-expanded from a prior visit.

## Drawing the QR
New `initShareQR()`, following the exact pattern already used by
`initHeritageStrips()`: a guarded call added to both `render()` branches
(app.js:6246 and 6279):
```javascript
if (typeof initShareQR === "function") initShareQR();
```
`initShareQR()` finds any `.qr-share-canvas` element just inserted by
`innerHTML`, builds the share URL from whichever of `appState.archetypeKey`
/ `appState.colourResultKey` are set, and draws the QR into it via the
vendored generator.

## New file + dependency
`share-qr.js` — own file (matches "conceptually separate feature gets its
own file"), holding `buildShareURL()`, `initShareQR()`, and nothing else.
Loaded after `app.js` in index.html's script order, since it reads the
global `appState`.

One new vendored dependency: `vendor/qrcode.min.js`
(`soldair/node-qrcode`'s browser build, MIT licensed) — chosen over
`davidshimjs/qrcodejs` because it draws directly to a `<canvas>` via
`QRCode.toCanvas(canvas, text, callback)`, needing no wrapper code. Follows
the existing vendoring convention (`html2canvas.min.js`, `jspdf.umd.min.js`,
`cobe.js`) — no CDN, works offline. `initShareQR()` keeps the same
`typeof QRCode === "undefined"` guard-and-degrade convention used for
`html2canvas`/`jspdf` elsewhere, so a failed/missing vendor file hides the
QR button rather than throwing.

## Non-goals
- No worksheet checklist or Cloth Room/ensemble state in the payload —
  fast-follow if this proves useful, not this round.
- No client name in the URL (kept out of the query string on principle —
  nothing personally identifying travels in a scannable code).
- No changes to the existing PDF/PNG export paths — this is additive,
  sitting beside `Share to Phone` / `Export Client Dossier`, not replacing
  them.
- No new modal/overlay component — inline reveal only, per UI placement
  above.

## Testing / deploy checklist
- `node --check` on `share-qr.js` and `app.js`.
- Manual: scan the generated QR from a second device, confirm it lands on
  the correct result screen (style-only, colour-only, and unified) with the
  right content, no stray "take the other quiz" cross-prompts on the unified
  path.
- Confirm a restore with only one key set still renders cleanly (no errors
  from the missing quiz-answer-derived fields).
- Confirm the kiosk's own in-progress session is untouched by this — the
  restore branch must only run standalone, on first boot before any session
  exists in that browser's `localStorage`.
- Reduced-motion: inline reveal should respect the project's global
  reduced-motion rules (styles.css:7437-7443) — no bespoke exemption.
- Bump `share-qr.js`, `app.js`, `styles.css` `?v=` in index.html + sw.js
  precache list, plus `CACHE_VERSION` in sw.js. Add `vendor/qrcode.min.js`
  to the precache list (new file).
- Run `node verify/smoke.js`.
