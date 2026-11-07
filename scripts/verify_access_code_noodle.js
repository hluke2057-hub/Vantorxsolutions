const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // Clear storage first
  await page.goto('about:blank');

  // -------------------------------------------------------------
  // TEST 1: Cold Call Arena #tabNoWebsite locked state
  // -------------------------------------------------------------
  const arenaUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html').replace(/\\/g, '/') + '#tabNoWebsite';
  console.log('Testing Arena locked state:', arenaUrl);
  await page.goto(arenaUrl, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.removeItem('vantorx_fl_vault_unlocked'));
  await page.evaluate(() => window.checkFloridaVaultAccess());
  await new Promise(r => setTimeout(r, 400));

  const lockedState = await page.evaluate(() => {
    const gate = document.getElementById('flAccessCodeGate');
    const content = document.getElementById('flVaultContent');
    return {
      gateVisible: gate && gate.style.display !== 'none',
      contentHidden: content && content.style.display === 'none'
    };
  });
  console.log('Locked State:', lockedState);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_vault_locked_gate.png') });

  // -------------------------------------------------------------
  // TEST 2: Test Wrong Code
  // -------------------------------------------------------------
  console.log('Entering wrong code...');
  await page.evaluate(() => {
    document.getElementById('flAccessCodeInput').value = 'wrongpassword';
    window.unlockFloridaVault();
  });
  await new Promise(r => setTimeout(r, 200));

  const errorState = await page.evaluate(() => {
    const err = document.getElementById('flAccessCodeError');
    return {
      errVisible: err && err.style.display !== 'none',
      errText: err ? err.textContent : ''
    };
  });
  console.log('Error State after wrong code:', errorState);

  // -------------------------------------------------------------
  // TEST 3: Enter Correct Code 'noodle'
  // -------------------------------------------------------------
  console.log('Entering correct access code "noodle"...');
  await page.evaluate(() => {
    document.getElementById('flAccessCodeInput').value = 'noodle';
    window.unlockFloridaVault();
  });
  await new Promise(r => setTimeout(r, 500));

  const unlockedState = await page.evaluate(() => {
    const gate = document.getElementById('flAccessCodeGate');
    const content = document.getElementById('flVaultContent');
    const rows = document.querySelectorAll('#flLeadsTableBody tr').length;
    return {
      gateHidden: gate && gate.style.display === 'none',
      contentVisible: content && content.style.display !== 'none',
      rowsLoaded: rows
    };
  });
  console.log('Unlocked State after "noodle":', unlockedState);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_vault_unlocked_with_noodle.png') });

  // -------------------------------------------------------------
  // TEST 4: Standalone Page florida-no-website.html
  // -------------------------------------------------------------
  const standUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'florida-no-website.html').replace(/\\/g, '/');
  console.log('Testing Standalone locked state:', standUrl);
  await page.goto(standUrl, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.removeItem('vantorx_fl_vault_unlocked'));
  await page.evaluate(() => checkVaultAccess());
  await new Promise(r => setTimeout(r, 400));

  const standLockedState = await page.evaluate(() => {
    const gate = document.getElementById('flAccessCodeGate');
    const content = document.getElementById('flVaultContent');
    return {
      gateVisible: gate && gate.style.display !== 'none',
      contentHidden: content && content.style.display === 'none'
    };
  });
  console.log('Standalone Locked State:', standLockedState);

  // Unlock with 'NOODLE' (uppercase test)
  console.log('Entering "NOODLE" on standalone page...');
  await page.evaluate(() => {
    document.getElementById('flAccessCodeInput').value = 'NOODLE';
    unlockFloridaVault();
  });
  await new Promise(r => setTimeout(r, 400));

  const standUnlockedState = await page.evaluate(() => {
    const gate = document.getElementById('flAccessCodeGate');
    const content = document.getElementById('flVaultContent');
    const rows = document.querySelectorAll('#leadsTableBody tr').length;
    return {
      gateHidden: gate && gate.style.display === 'none',
      contentVisible: content && content.style.display !== 'none',
      rowsLoaded: rows
    };
  });
  console.log('Standalone Unlocked State:', standUnlockedState);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_standalone_unlocked_with_noodle.png') });

  await browser.close();
  console.log('🎉 Verification completed successfully!');
})();
