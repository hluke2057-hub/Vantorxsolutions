const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('=== VERIFYING FLORIDA NO-WEBSITE PRIVATE VAULT: REAL LEADS + CALLBACK FEATURE ===');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  const errors = [];
  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('[BROWSER ERROR]:', err.message);
  });

  const filePath = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'florida-no-website.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // 1. Enter access code noodle
  console.log('Unlocking with access code noodle...');
  await page.type('#flAccessCodeInput', 'noodle');
  await page.click('#btnUnlockFloridaVault');
  await new Promise(r => setTimeout(r, 600));

  // 2. Verify leads rendered
  const visibleCount = await page.$eval('#visibleCount', el => el.textContent.trim());
  console.log('Visible leads count:', visibleCount);
  if (visibleCount !== '100') {
    throw new Error(`Expected 100 visible leads, got ${visibleCount}`);
  }

  // 3. Inspect first 5 leads in DOM
  const first5 = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#leadsTableBody tr')).slice(0, 5);
    return rows.map(r => ({
      company: r.querySelector('.company-name')?.textContent.trim(),
      phone: r.querySelector('.dial-btn')?.textContent.trim(),
      city: r.children[2]?.textContent.trim().replace(/\s+/g, ' '),
      trade: r.children[1]?.textContent.trim()
    }));
  });
  console.log('First 5 leads in DOM:', first5);

  // 4. Verify Callback option in select
  const hasCallbackFilter = await page.evaluate(() => {
    const opts = Array.from(document.querySelectorAll('#dispFilter option'));
    return opts.some(o => o.value === 'CALLBACK');
  });
  console.log('Has CALLBACK in dispFilter:', hasCallbackFilter);
  if (!hasCallbackFilter) throw new Error('dispFilter missing CALLBACK option');

  // 5. Open Callback Modal for lead 1
  console.log('Opening Callback Modal for first lead...');
  await page.evaluate(() => {
    window.openCallbackModal('fl_noweb_001');
  });
  await new Promise(r => setTimeout(r, 400));

  const isModalActive = await page.$eval('#callbackModal', el => el.classList.contains('active'));
  console.log('Is Callback Modal active:', isModalActive);
  if (!isModalActive) throw new Error('Callback Modal did not open');

  // 6. Test Quick Preset button: Tmrw 9:30 AM
  console.log('Clicking "Tmrw 9:30 AM" preset button...');
  await page.evaluate(() => {
    setCbPresetTomorrow(9, 30);
    document.getElementById('cbNotesInput').value = 'Owner John is on a job site until tomorrow morning. Call back at 9:30 AM sharp to review mobile estimate landing page.';
  });
  await new Promise(r => setTimeout(r, 300));

  const dtVal = await page.$eval('#cbDateTimeInput', el => el.value);
  console.log('Datetime input set to:', dtVal);

  // 7. Save Callback
  console.log('Saving callback from modal...');
  await page.evaluate(() => {
    saveCallbackFromModal();
  });
  await new Promise(r => setTimeout(r, 500));

  // 8. Verify row badge and KPI update
  const statCallbacks = await page.$eval('#statCallbacks', el => el.textContent.trim());
  console.log('KPI Callbacks Scheduled count:', statCallbacks);
  if (!statCallbacks.includes('1 Scheduled')) {
    throw new Error(`Expected "1 Scheduled", got "${statCallbacks}"`);
  }

  // 9. Filter to CALLBACK
  console.log('Filtering table by CALLBACK status...');
  await page.evaluate(() => {
    filterByCallback();
  });
  await new Promise(r => setTimeout(r, 400));

  const filteredCount = await page.$eval('#visibleCount', el => el.textContent.trim());
  console.log('Filtered visible count for callbacks:', filteredCount);
  if (filteredCount !== '1') {
    throw new Error(`Expected 1 callback lead visible, got ${filteredCount}`);
  }

  // 10. Capture screenshot of callback view
  const cbScreenshotPath = path.join(ARTIFACT_DIR, 'verified_florida_callback_scheduled.png');
  await page.screenshot({ path: cbScreenshotPath, fullPage: false });
  console.log('Saved screenshot:', cbScreenshotPath);

  // 11. Reset filter to ALL to see full table
  await page.select('#dispFilter', 'ALL');
  await page.evaluate(() => filterTable());
  await new Promise(r => setTimeout(r, 400));

  const resetCount = await page.$eval('#visibleCount', el => el.textContent.trim());
  console.log('Reset visible count (should be 100):', resetCount);

  const fullScreenshotPath = path.join(ARTIFACT_DIR, 'verified_florida_100_real_leads_table.png');
  await page.screenshot({ path: fullScreenshotPath, fullPage: false });
  console.log('Saved screenshot:', fullScreenshotPath);

  await browser.close();

  if (errors.length > 0) {
    console.error('Test completed with browser errors:', errors);
    process.exit(1);
  } else {
    console.log('=== ALL FLORIDA VAULT & CALLBACK TESTS PASSED WITH 0 ERRORS! ===');
  }
})();
