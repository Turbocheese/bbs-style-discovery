const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 820, height: 1180 } });
  await page.goto('http://localhost:5959/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  console.log('view before:', await page.evaluate(() => window.appState && appState.view));

  await page.fill('#client-name-input', 'Test');
  await page.click('[data-action="save-name"]');
  await page.waitForTimeout(600);
  console.log('view after save-name:', await page.evaluate(() => window.appState && appState.view));

  await page.click('[data-action="guide"]');
  await page.waitForTimeout(1200); // measure moment ~650ms + buffer
  console.log('view after guide click:', await page.evaluate(() => window.appState && appState.view));
  console.log('topnav hidden attr:', await page.evaluate(() => { var n = document.getElementById('topnav'); return n ? n.hidden : 'NO NAV'; }));
  await browser.close();
})();
