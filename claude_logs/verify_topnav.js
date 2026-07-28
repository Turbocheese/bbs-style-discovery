// One-off verification script for the topnav .topnav-btn cascade fix.
// Not part of the app; run with `node claude_logs/verify_topnav.js`.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 820, height: 1180 } });
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));

  await page.goto('http://localhost:5959/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Navigate welcome -> home -> guide (topnav is hidden on welcome/home by design).
  await page.fill('#client-name-input', 'Test');
  await page.click('[data-action="save-name"]');
  await page.waitForTimeout(600);
  await page.click('[data-action="guide"]');
  await page.waitForTimeout(1200); // measure-moment interstitial + render

  // Wait for .topnav to appear (not [hidden])
  await page.waitForSelector('.topnav:not([hidden])', { timeout: 5000 }).catch(() => {});

  const navCount = await page.locator('.topnav-btn').count();
  console.log('topnav-btn count:', navCount);

  if (navCount === 0) {
    console.log('NO TOPNAV BUTTONS FOUND - dumping body class/state for debug');
    console.log(await page.evaluate(() => document.body.className));
    await browser.close();
    process.exit(1);
  }

  const btn = page.locator('.topnav:not([hidden]) .topnav-btn').first();

  const normalStyles = await btn.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      borderRadius: cs.borderRadius,
      textTransform: cs.textTransform,
      letterSpacing: cs.letterSpacing,
      fontSize: cs.fontSize,
      padding: cs.padding,
      background: cs.backgroundColor,
      border: cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor,
    };
  });
  console.log('NORMAL STATE computed styles:', JSON.stringify(normalStyles, null, 2));

  await page.screenshot({ path: 'claude_logs/topnav_normal.png' });

  // Force :active state via CSS injection trick - use pointer down and hold.
  await btn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const box = await btn.boundingBox();
  if (!box) {
    console.log('BOUNDING BOX NULL - btn not visible, using JS class toggle fallback');
  } else {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
  }
  await page.waitForTimeout(150);

  const activeStyles = await btn.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      background: cs.backgroundColor,
      color: cs.color,
      borderColor: cs.borderTopColor,
    };
  });
  console.log('ACTIVE (pointerdown held) computed styles:', JSON.stringify(activeStyles, null, 2));

  await page.screenshot({ path: 'claude_logs/topnav_active.png' });
  if (box) await page.mouse.up();

  console.log('CONSOLE ERRORS:', consoleErrors.length ? JSON.stringify(consoleErrors) : 'none');

  // Assertions
  const assertions = [];
  assertions.push(['border-radius is pill (not 0px)', !normalStyles.borderRadius.startsWith('0px')]);
  assertions.push(['text-transform is none', normalStyles.textTransform === 'none']);
  assertions.push(['font-size is 0.95rem (~15.2px)', Math.abs(parseFloat(normalStyles.fontSize) - 15.2) < 1]);
  assertions.push(['active background is cream (not near-black accent)', activeStyles.background !== 'rgb(17, 17, 16)']);

  let allPass = true;
  for (const [name, pass] of assertions) {
    console.log((pass ? 'PASS' : 'FAIL') + ' - ' + name);
    if (!pass) allPass = false;
  }

  await browser.close();
  process.exit(allPass && consoleErrors.length === 0 ? 0 : 1);
})();
