const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('Verifying Multi-Engine Email Finder & UI Integration...');
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
  await page.goto(arenaUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  // Bypass sign-in
  await page.evaluate(() => {
    localStorage.setItem('vantorx_active_user_id_v2', 'carter_mccauliss');
    window.closeSignInGate();
    window.switchTab('tabScript');
  });
  await new Promise(r => setTimeout(r, 800));

  // Verify 5-Engine toolbar in active lead banner
  const hBtn = await page.$('#btnHunterSearch');
  const aBtn = await page.$('#btnApolloSearch');
  const sBtn = await page.$('#btnSnovSearch');
  const rBtn = await page.$('#btnRocketReachSearch');
  const cBtn = await page.$('#btnContactOutSearch');

  if (hBtn && aBtn && sBtn && rBtn && cBtn) {
    console.log('PASS: All 5 Email Finder buttons (Hunter, Apollo, Snov, RocketReach, ContactOut) verified in banner!');
  } else {
    console.error('FAIL: Missing enrichment buttons in teleprompter!');
  }

  // Test opening the enrichment modal
  await page.evaluate(() => {
    if (typeof window.openEnrichmentModal === 'function') {
      window.openEnrichmentModal();
    }
  });
  await new Promise(r => setTimeout(r, 500));

  const modalActive = await page.evaluate(() => {
    const m = document.getElementById('enrichmentModal');
    return m && m.classList.contains('active');
  });
  console.log('Enrichment modal open test:', modalActive ? 'PASS' : 'FAIL');

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_email_enrichment_suite.png') });

  await browser.close();
  console.log('Verification completed successfully!');
})();
