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
  await page.setViewport({ width: 1400, height: 1000 });

  // 1. Test standalone florida-no-website.html
  const standaloneUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'florida-no-website.html').replace(/\\/g, '/');
  console.log('Testing Standalone Page:', standaloneUrl);
  await page.goto(standaloneUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 600));

  const rowCount = await page.evaluate(() => {
    return document.querySelectorAll('#leadsTableBody tr').length;
  });
  console.log('Standalone page rows loaded:', rowCount);

  // Click on "Preview Mockup" on row 1
  await page.evaluate(() => {
    const btn = document.querySelector('.btn-preview-mockup');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_standalone_florida_mockup.png') });

  // 2. Test cold-call-arena/index.html#tabNoWebsite with clean localStorage
  await page.evaluate(() => localStorage.clear());
  const arenaHashUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html').replace(/\\/g, '/') + '#tabNoWebsite';
  console.log('Testing Arena Hash URL with clean storage:', arenaHashUrl);
  await page.goto(arenaHashUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 800));

  const isModalActive = await page.evaluate(() => {
    const modal = document.getElementById('signInGateModal');
    return modal && modal.classList.contains('active');
  });

  const isTabActive = await page.evaluate(() => {
    const tab = document.getElementById('tabNoWebsite');
    return tab && tab.classList.contains('active');
  });

  console.log(`Arena Hash -> Sign-in Modal Active: ${isModalActive}, Tab Active: ${isTabActive}`);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_arena_hash_unlocked.png') });

  await browser.close();
  console.log('Done!');
})();
