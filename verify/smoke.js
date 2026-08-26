// BBS Style Discovery — automated smoke test.
//
// This is the project's only automated safety net (no unit tests, no
// CI). Run it after any meaningful change, per CLAUDE.md's definition
// of done. It drives the real app in headless Chromium and fails on
// any console error, validator failure, or broken flow.
//
// Usage (from the repo root):
//   npx serve .                     # in one terminal (port 3000)
//   npm i --no-save playwright      # once per machine
//   node verify/smoke.js            # in another terminal
//
// Exit code 0 = all green. Non-zero = something broke; read the log.

var BASE = process.env.SMOKE_URL || "http://localhost:3000";
var { chromium } = require("playwright");

var failures = [];
function check(name, ok) {
    console.log((ok ? "  PASS  " : "  FAIL  ") + name);
    if (!ok) failures.push(name);
}

(async function () {
    var browser = await chromium.launch({ headless: true });
    var context = await browser.newContext({ viewport: { width: 800, height: 1000 } });
    var page = await context.newPage();
    var errors = [];
    var validated = false;
    page.on("pageerror", function (e) { errors.push("PAGEERROR: " + e.message); });
    page.on("console", function (m) {
        if (m.type() === "error") {
            var text = m.text();
            // Known Playwright/CDP artifact, not a production defect:
            // context.setOffline(true) does not reliably re-assert
            // navigator.onLine after a cross-navigation reload in headless
            // Chromium, so firebase-init.js's offline guard can still let
            // its one-shot health-check fetch through once per offline
            // reload here. On a real device the OS reports offline
            // correctly and the fetch never fires. Confirmed via
            // msg.location().url (the message text alone carries no URL) —
            // see .superpowers/sdd/2026-08-16-firebase-connection/
            // task-3-report.md for the investigation. Narrow match: a
            // net::ERR_INTERNET_DISCONNECTED or net::ERR_FAILED resource
            // failure whose location is specifically the Firestore
            // _health health-check endpoint — anything else still fails.
            var loc = null;
            try { loc = m.location(); } catch (e) { loc = null; }
            var isKnownOfflineArtifact =
                /net::ERR_(INTERNET_DISCONNECTED|FAILED)/.test(text) &&
                loc && typeof loc.url === "string" &&
                loc.url.indexOf("firestore.googleapis.com") !== -1 &&
                loc.url.indexOf("/documents/_health") !== -1;
            if (isKnownOfflineArtifact) {
                console.log("  (ignored, known offline-emulation artifact): " + text);
            } else {
                errors.push("CONSOLE: " + text);
            }
        }
        if (m.text().indexOf("VALIDATION PASSED") !== -1) validated = true;
    });
    page.on("response", function (r) {
        if (r.status() < 400) return;
        // Narrow, documented exclusion — same pattern as the console
        // allowlist above: a >=400 response from Firestore's own REST
        // endpoint (quota, outage, or a genuine rules regression) is
        // Firestore-side, not a repo defect the health-check fetch is
        // fire-and-forget (.catch-swallowed) so it never affects the app.
        // Still logged, just not treated as a smoke failure. Do not widen
        // this to any other origin.
        if (r.url().indexOf("firestore.googleapis.com") !== -1) {
            console.log("  (ignored, Firestore-side response): HTTP " + r.status() + ": " + r.url());
            return;
        }
        errors.push("HTTP " + r.status() + ": " + r.url());
    });

    // --- Load, validation, fonts ---
    await page.goto(BASE + "/?_=" + Date.now(), { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    check("app loads (welcome input present)", (await page.locator("#client-name-input").count()) > 0);
    check("guide tree validation passes", validated);
    check("Louize self-hosted font loads", await page.evaluate(function () { return document.fonts.check('600 24px "Louize"'); }));

    // --- Welcome -> home ---
    await page.locator("#client-name-input").fill("Smoke Test");
    await page.locator('[data-action="save-name"]').click();
    await page.waitForTimeout(500);
    check("home renders after name entry", (await page.locator(".home-card").count()) > 0);

    // --- Menu entries show measure moment and land ---
    async function entry(sel, expectSel, name) {
        await page.locator(sel).first().click();
        await page.waitForTimeout(250);
        var moment = (await page.locator(".measure-moment").count()) > 0;
        // Poll for the destination instead of a fixed sleep: heavier
        // views (Cloth Room renders weave/garment canvases) can slip
        // past a blind timeout under system load, which is what made
        // this specific check flaky historically. waitForSelector
        // resolves as soon as the element appears, so the fast case is
        // no slower and the slow case no longer false-fails.
        var landed = await page.waitForSelector(expectSel, { timeout: 5000 })
            .then(function () { return true; })
            .catch(function () { return false; });
        check(name + " (moment + lands)", moment && landed);
        await page.evaluate(function () { navigateHome(); });
        await page.waitForTimeout(400);
    }
    await entry('[data-action="guide"]', ".guide-list-item-v2, [data-nav]", "Guide entry");
    await entry('[data-action="lookbook"]', ".lookbook-item, .lookbook-shell, img", "Lookbook entry");
    await entry('[data-action="fabric-vis"]', ".vis-shell", "Cloth Room entry");

    // --- Style quiz full flow ---
    await page.locator('[data-action="discover"]').first().click();
    await page.waitForTimeout(1000);
    for (var i = 0; i < 7; i++) {
        await page.locator('[data-action="quiz-pick"]').first().click();
        await page.locator('[data-action="quiz-next"]').click().catch(function () {});
        await page.waitForTimeout(200);
    }
    await page.waitForTimeout(300);
    await page.locator('[data-action="onboard-focus"]').first().click();
    await page.waitForTimeout(200);
    await page.locator('[data-action="onboard-fit"]').first().click();
    await page.waitForTimeout(200);
    await page.locator('[data-action="onboard-palette"]').first().click();
    await page.waitForTimeout(200);
    await page.locator('[data-action="onboard-colour-use"]').first().click();
    await page.waitForTimeout(200);
    await page.locator('[data-action="onboard-submit"]').click();
    await page.waitForTimeout(1900); // measure moment
    check("style quiz reaches result", (await page.locator('[data-action="worksheet"]').count()) > 0);

    // --- QR share reveal draws a real (non-blank) code ---
    await page.locator('[data-action="share-qr"]').first().click();
    await page.waitForTimeout(300);
    var styleQrDrawn = await page.evaluate(function () {
        var c = document.querySelector(".qr-share-canvas");
        if (!c || !c.width) return false;
        var data = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
        for (var i = 0; i < data.length; i += 4) {
            if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) return true;
        }
        return false;
    });
    check("style result QR draws a non-blank code", styleQrDrawn);

    // --- Dossier export produces a real download ---
    var download = null;
    page.on("download", function (d) { download = d; });
    await page.locator('[data-action="export-dossier"]').first().click();
    await page.waitForTimeout(6000);
    check("client dossier PDF download fires", download !== null);

    // --- Worksheet ---
    await page.locator('[data-action="worksheet"]').first().click();
    await page.waitForTimeout(1500);
    check("worksheet renders", (await page.locator(".worksheet-shell").count()) > 0);

    // --- Colour quiz full flow ---
    await page.evaluate(function () { navigateHome(); });
    await page.waitForTimeout(400);
    await page.locator('[data-action="colour-direction"]').click();
    await page.waitForTimeout(1100);
    // Drive by the live question count so adding/removing colour questions
    // never leaves the quiz half-answered.
    var colourQCount = await page.evaluate(function () { return colourDirectionQuestions.length; });
    for (var c = 0; c < colourQCount; c++) {
        await page.locator('[data-action="colour-pick"], .arch-opt--colour').first().click();
        await page.waitForTimeout(150);
        await page.locator('[data-action="colour-next"]').click().catch(function () {});
        await page.waitForTimeout(250);
    }
    await page.waitForTimeout(1900);
    // Standalone colour result markup (this branch): .colour-result-shell wraps
    // the premium result; the descriptor is the single hero .colour-type-headline
    // and must NOT also appear as an .arch-result-persona reveal.
    check("colour quiz reaches result", (await page.locator(".colour-result-shell").count()) > 0);
    check(
        "colour result descriptor shows once (no duplicate persona reveal)",
        (await page.locator(".colour-result-shell .colour-type-headline").count()) === 1 &&
            (await page.locator(".colour-result-shell .arch-result-persona").count()) === 0
    );

    // --- QR share reveal on the colour result draws a real code too ---
    await page.locator('[data-action="share-qr"]').first().click();
    await page.waitForTimeout(300);
    var colourQrDrawn = await page.evaluate(function () {
        var c = document.querySelector(".qr-share-canvas");
        if (!c || !c.width) return false;
        var data = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
        for (var i = 0; i < data.length; i += 4) {
            if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) return true;
        }
        return false;
    });
    check("colour result QR draws a non-blank code", colourQrDrawn);

    // --- QR restore-on-boot: a scanned link lands on the right result,
    //     with no answers behind it, and no console/page errors. Each check
    //     below uses a genuinely fresh browser context (not just a new tab —
    //     a new tab in `context` still shares this session's localStorage,
    //     which would make `!savedSession` correctly, but unhelpfully for
    //     this test, block the restore branch entirely) to simulate the
    //     real scenario: a client's own phone, which has never saved a
    //     session here. ---
    var shareUrl = await page.evaluate(function () {
        return buildShareURL(appState.archetypeKey, appState.colourResultKey);
    });

    var restoreContext = await browser.newContext({ viewport: { width: 800, height: 1000 } });
    var restorePage = await restoreContext.newPage();
    var restoreErrors = [];
    restorePage.on("pageerror", function (e) { restoreErrors.push("PAGEERROR: " + e.message); });
    restorePage.on("console", function (m) { if (m.type() === "error") restoreErrors.push("CONSOLE: " + m.text()); });
    await restorePage.goto(shareUrl.replace(/^https?:\/\/[^/]+/, BASE), { waitUntil: "networkidle" });
    await restorePage.waitForTimeout(600);
    var restored = await restorePage.evaluate(function () {
        return { view: appState.view, journeyStage: appState.journeyStage };
    });
    check(
        "QR restore-on-boot lands on the unified result with no real answers",
        restored.view === "result" && restored.journeyStage === "done" && restoreErrors.length === 0
    );
    await restoreContext.close();

    // Invalid keys in the URL must degrade to the default view, never crash.
    // A second fresh context — the first one's restore already saved a
    // session to its own localStorage, which would block this check too.
    var invalidContext = await browser.newContext({ viewport: { width: 800, height: 1000 } });
    var invalidPage = await invalidContext.newPage();
    var invalidErrors = [];
    invalidPage.on("pageerror", function (e) { invalidErrors.push("PAGEERROR: " + e.message); });
    invalidPage.on("console", function (m) { if (m.type() === "error") invalidErrors.push("CONSOLE: " + m.text()); });
    await invalidPage.goto(BASE + "/?styleKey=NOPE&colourKey=NOPE", { waitUntil: "networkidle" });
    await invalidPage.waitForTimeout(600);
    var invalidRestoreView = await invalidPage.evaluate(function () { return appState.view; });
    check(
        "QR restore rejects an invalid key without crashing",
        invalidRestoreView !== "result" && invalidRestoreView !== "colour-result" && invalidErrors.length === 0
    );
    await invalidContext.close();

    // --- Guided journey ordering (colour-combined-journey branch):
    //     begin-journey -> Colour quiz FIRST -> auto-advances into Style ->
    //     one unified result. Colour and Style keep separate scoring; this
    //     only verifies the sequencing and the combined presentation. ---
    await page.evaluate(function () { navigateHome(); });
    await page.waitForTimeout(400);
    await page.locator('[data-action="begin-journey"]').first().click();
    await page.waitForTimeout(1000); // "Beginning your journey…" moment
    var journeyColourFirst =
        (await page.locator('[data-action="colour-next"]').count()) > 0 &&
        (await page.locator('[data-action="quiz-pick"]').count()) === 0;
    check("journey begins on Colour quiz (Colour-first ordering)", journeyColourFirst);
    // Complete the Colour leg.
    for (var jc = 0; jc < colourQCount; jc++) {
        await page.locator('[data-action="colour-pick"], .arch-opt--colour').first().click();
        await page.waitForTimeout(150);
        await page.locator('[data-action="colour-next"]').click().catch(function () {});
        await page.waitForTimeout(250);
    }
    await page.waitForTimeout(1900); // "Reading your colours…" moment + handoff
    // Colour hands straight off into Style — NOT the standalone colour result.
    var journeyAdvancedToStyle =
        (await page.locator('[data-action="quiz-pick"]').count()) > 0 &&
        (await page.locator(".colour-result-shell").count()) === 0;
    check("journey auto-advances Colour -> Style (skips standalone colour result)", journeyAdvancedToStyle);
    // Complete the Style leg.
    for (var jsq = 0; jsq < 7; jsq++) {
        await page.locator('[data-action="quiz-pick"]').first().click();
        await page.locator('[data-action="quiz-next"]').click().catch(function () {});
        await page.waitForTimeout(200);
    }
    await page.waitForTimeout(300);
    await page.locator('[data-action="onboard-focus"]').first().click();
    await page.waitForTimeout(150);
    await page.locator('[data-action="onboard-fit"]').first().click();
    await page.waitForTimeout(150);
    // Fix 1: mid-journey the Style onboarding must NOT ask palette / colour-use
    // (Colour already ran); it derives both from the colour result instead.
    check(
        "journey onboarding skips palette + colour-use questions",
        (await page.locator('[data-action="onboard-palette"]').count()) === 0 &&
            (await page.locator('[data-action="onboard-colour-use"]').count()) === 0
    );
    check(
        "journey onboarding derives valid palette + colour-use for scoring",
        await page.evaluate(function () {
            return !!appState.colourResultKey &&
                appState.selPalette !== "" && appState.selColourUse !== "";
        })
    );
    await page.locator('[data-action="onboard-submit"]').click();
    await page.waitForTimeout(1900); // "Taking your measurements…" moment
    // One unified result carrying archetype + colour together, cross-referenced.
    var unifiedOk =
        (await page.locator(".unified-result-shell").count()) > 0 &&
        (await page.locator(".unified-tie").count()) > 0 &&
        (await page.locator(".unified-colour-section").count()) > 0;
    check("journey ends on unified result (archetype + colour together)", unifiedOk);
    check(
        "unified result colour descriptor shows once",
        (await page.locator(".unified-colour-section .colour-type-headline").count()) === 1
    );

    // --- Cloth Room default-filters to the client's colours after the quiz
    //     (Fix 2). The journey above left a colour result set, so entering the
    //     Cloth Room should open filtered to the palette families; "Show all
    //     cloths" restores the full library. ---
    var TOTAL_CLOTHS = await page.evaluate(function () { return FABRIC_LIBRARY.length; });
    await page.evaluate(function () { navigateHome(); });
    await page.waitForTimeout(400);
    await page.locator('[data-action="fabric-vis"]').first().click();
    await page.waitForTimeout(900);
    var clothRoomFiltered = await page.evaluate(function () {
        return {
            colourFacet: getVisFilters().colour_family.length,
            shown: getFilteredCloths().length
        };
    });
    check(
        "Cloth Room opens filtered to client's palette families (with colour result)",
        clothRoomFiltered.colourFacet > 0 && clothRoomFiltered.shown < TOTAL_CLOTHS
    );
    check("Show all cloths control is visible", (await page.locator('[data-action="vis-filter-clear"]').count()) > 0);
    await page.locator('[data-action="vis-filter-clear"]').first().click();
    await page.waitForTimeout(400);
    var afterShowAll = await page.evaluate(function () { return getFilteredCloths().length; });
    check("Show all cloths restores the full library", afterShowAll === TOTAL_CLOTHS);

    // --- Offline (service worker; localhost counts as secure) ---
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    var swActive = await page.evaluate(async function () {
        if (!("serviceWorker" in navigator)) return false;
        var reg = await navigator.serviceWorker.ready;
        return !!reg.active;
    }).catch(function () { return false; });
    if (swActive) {
        await page.waitForTimeout(1500);
        await context.setOffline(true);
        await page.reload({ waitUntil: "domcontentloaded" }).catch(function () {});
        await page.waitForTimeout(1000);
        // The saved session restores the last view, so assert the app
        // booted (validator ran, view rendered), not any specific screen.
        var offlineBooted = await page.evaluate(function () {
            return typeof window.guideTree !== "undefined" &&
                document.getElementById("app").children.length > 0;
        }).catch(function () { return false; });
        check("offline boot via service worker", offlineBooted);
        await context.setOffline(false);
    } else {
        console.log("  SKIP  offline boot (no service worker on this origin)");
    }

    // --- Console must be clean throughout ---
    check("zero console/page errors across all flows", errors.length === 0);
    if (errors.length) console.log("errors:\n  " + errors.join("\n  "));

    await browser.close();
    console.log(failures.length === 0
        ? "\nSMOKE: ALL GREEN"
        : "\nSMOKE: " + failures.length + " FAILURE(S): " + failures.join("; "));
    process.exit(failures.length === 0 ? 0 : 1);
})().catch(function (e) {
    console.error("SMOKE HARNESS CRASHED:", e.message);
    process.exit(2);
});
