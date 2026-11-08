const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200 });

  const arenaUrl = 'file:///' + path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html').replace(/\\/g, '/');
  await page.goto(arenaUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  // Bypass sign-in gate
  await page.evaluate(() => {
    localStorage.setItem('vantorx_active_user_id_v2', 'carter_mccauliss');
    window.closeSignInGate();
    window.switchTab('tabScript');
  });
  await new Promise(r => setTimeout(r, 600));

  // Scroll to dual script toggle bar
  await page.evaluate(() => {
    const el = document.querySelector('.dual-script-toggle-bar');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_scrolled_dual_script_body.png') });
  await browser.close();
  console.log('Scrolled dual script captured!');
})();
