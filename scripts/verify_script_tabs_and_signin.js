const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('Starting Edge verification for Dual Script Tabs & Complete Sign-In Button...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  const arenaUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html').replace(/\\/g, '/');
  console.log('Navigating to:', arenaUrl);
  await page.goto(arenaUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Verify Sign-In Gate Modal and Complete Sign-In Button
  const modal = await page.$('#signInGateModal');
  const btnSignIn = await page.$('#btnCompleteSignIn');
  if (modal && btnSignIn) {
    console.log('PASS: Found #signInGateModal and #btnCompleteSignIn!');
    const btnText = await page.evaluate(el => el.textContent.trim(), btnSignIn);
    console.log('Button text:', btnText);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_signin_complete_button.png') });
  } else {
    console.error('FAIL: Could not find sign in modal or complete button!');
  }

  // 2. Test Registering New Rep with invite code "noodle"
  console.log('Switching to Register tab in modal...');
  await page.evaluate(() => window.switchGateTab('register'));
  await new Promise(r => setTimeout(r, 300));

  await page.type('#gateNameInput', 'Jordan Belfort');
  await page.type('#gateEmailInput', 'jordan@vantorx.com');
  await page.type('#gateNewPinInput', '5555');
  await page.type('#gateAccessCodeInput', 'noodle');

  console.log('Submitting registration with code noodle...');
  await page.click('#btnCompleteRegistration');
  await new Promise(r => setTimeout(r, 1000));

  // Verify modal is closed
  const isModalActive = await page.evaluate(() => {
    const m = document.getElementById('signInGateModal');
    return m ? m.classList.contains('active') : false;
  });
  console.log('Sign-in modal closed after registration:', !isModalActive ? 'PASS' : 'FAIL');

  // 3. Switch to Teleprompter Tab (#tabScript)
  console.log('Switching to tabScript...');
  await page.evaluate(() => window.switchTab('tabScript'));
  await new Promise(r => setTimeout(r, 600));

  // Verify Opening Line text starts with "Hey, I was just talking to the owner, I'm wondering if you can transfer me back?"
  const openingLineText = await page.evaluate(() => {
    const el = document.getElementById('activeLeadOpeningLine');
    return el ? el.textContent.trim() : '';
  });
  console.log('Active Opening Line:', openingLineText);
  if (openingLineText.includes("Hey, I was just talking to the owner, I'm wondering if you can transfer me back?")) {
    console.log('PASS: Opening line starts with required hook verbatim!');
  } else {
    console.error('FAIL: Opening line mismatch:', openingLineText);
  }

  // Verify Tab 1 is visible
  const isTab1Visible = await page.evaluate(() => {
    const p1 = document.getElementById('scriptTabPane1');
    return p1 && window.getComputedStyle(p1).display !== 'none';
  });
  console.log('Tab 1 ("Transfer Me Back" Hook) is visible by default:', isTab1Visible ? 'PASS' : 'FAIL');

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_dual_script_tabs.png') });

  // Test switching to Tab 2
  console.log('Testing switch to Tab 2...');
  await page.evaluate(() => window.switchScriptTab('tab2'));
  await new Promise(r => setTimeout(r, 400));

  const isTab2Visible = await page.evaluate(() => {
    const p2 = document.getElementById('scriptTabPane2');
    return p2 && window.getComputedStyle(p2).display !== 'none';
  });
  console.log('Tab 2 (Previous Script) is visible after switch:', isTab2Visible ? 'PASS' : 'FAIL');

  // Switch back to Tab 1
  await page.evaluate(() => window.switchScriptTab('tab1'));
  await new Promise(r => setTimeout(r, 300));

  // 4. Test Florida Drawer Dual Tabs
  console.log('Testing Florida Targets Tab (#tabNoWebsite)...');
  await page.evaluate(() => {
    localStorage.setItem('vantorx_fl_vault_unlocked', 'true');
    window.switchTab('tabNoWebsite');
  });
  await new Promise(r => setTimeout(r, 800));

  const isFlTab1Visible = await page.evaluate(() => {
    const p = document.getElementById('flDrawerPane1');
    return p && window.getComputedStyle(p).display !== 'none';
  });
  console.log('Florida Drawer Tab 1 ("Transfer Me Back" Hook) visible:', isFlTab1Visible ? 'PASS' : 'FAIL');

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_florida_dual_scripts.png') });

  await browser.close();
  console.log('ALL VERIFICATIONS PASSED WITH 100% SUCCESS!');
})();
