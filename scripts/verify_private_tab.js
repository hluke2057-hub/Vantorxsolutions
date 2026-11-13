const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

async function verifyPrivate() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.toString()));

  const url = 'file:///' + path.join(root, 'website/cold-call-arena/index.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'load' });

  // 1. Verify tab button text
  const tabBtnText = await page.$eval('#tabBtnNoWebsite', el => el.innerText.trim());
  console.log('Tab button text:', tabBtnText);

  // 2. Click private tab
  await page.click('#tabBtnNoWebsite');
  await new Promise(r => setTimeout(r, 400));

  // 3. Unlock with 'noodle' if locked
  const isGateVisible = await page.evaluate(() => {
    const gate = document.getElementById('flAccessCodeGate');
    return gate && gate.style.display !== 'none';
  });

  if (isGateVisible) {
    console.log('Gate is visible, unlocking with noodle...');
    await page.type('#flAccessCodeInput', 'noodle');
    await page.click('#btnUnlockFloridaVault');
    await new Promise(r => setTimeout(r, 600));
  } else {
    console.log('Gate is already unlocked.');
  }

  // 4. Verify total leads count
  const leadCount = await page.evaluate(() => window.INTERNATIONAL_150_LEADS.length);
  console.log('Total leads loaded in window.INTERNATIONAL_150_LEADS:', leadCount);

  // 5. Test Night Grind Filter
  await page.evaluate(() => {
    if (typeof window.filterIntlNightGrind === 'function') {
      window.filterIntlNightGrind();
    }
  });
  await new Promise(r => setTimeout(r, 600));

  const nightGrindRowCount = await page.evaluate(() => document.querySelectorAll('#intlLeadsTableBody tr').length);
  console.log('Night Grind filtered table rows:', nightGrindRowCount);

  // 6. Check World Clocks for Perth and Singapore
  const perthClock = await page.$eval('#clockPerth', el => el.innerText).catch(() => 'N/A');
  const sgClock = await page.$eval('#clockSg', el => el.innerText).catch(() => 'N/A');
  console.log('Perth Clock (AWST):', perthClock);
  console.log('Singapore Clock (SGT):', sgClock);

  // Take screenshot of Private workbench with Night Grind filter active
  const screenPath = path.join(ARTIFACT_DIR, 'verified_private_tab_night_grind.png');
  await page.screenshot({ path: screenPath, fullPage: false });
  console.log('Saved verification screenshot:', screenPath);

  await browser.close();

  if (errors.length > 0) {
    console.error('Console errors:', errors);
    process.exit(1);
  } else {
    console.log('✅ Private Workbench & Night Grind verification PASSED cleanly with 0 console errors!');
  }
}

verifyPrivate().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
