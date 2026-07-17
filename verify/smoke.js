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
        if (m.type() === "error") errors.push("CONSOLE: " + m.text());
        if (m.text().indexOf("VALIDATION PASSED") !== -1) validated = true;
    });
    page.on("response", function (r) {
        if (r.status() >= 400) errors.push("HTTP " + r.status() + ": " + r.url());
    });

    // --- Load, validation, fonts ---
    await page.goto(BASE + "/?_=" + Date.now(), { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    check("app loads (welcome input present)", (await page.locator("#client-name-input").count()) > 0);
    check("guide tree validation passes", validated);
    check("EB Garamond self-hosted font loads", await page.evaluate(function () { return document.fonts.check('600 24px "EB Garamond"'); }));

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
        await page.waitForTimeout(900);
        var landed = (await page.locator(expectSel).count()) > 0;
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
    for (var c = 0; c < 5; c++) {
        await page.locator('[data-action="colour-pick"], .arch-opt--colour').first().click();
        await page.waitForTimeout(150);
        await page.locator('[data-action="colour-next"]').click().catch(function () {});
        await page.waitForTimeout(250);
    }
    await page.waitForTimeout(1900);
    check("colour quiz reaches result", (await page.locator(".colour-hero-palette, .arch-card-persona").count()) > 0);

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
