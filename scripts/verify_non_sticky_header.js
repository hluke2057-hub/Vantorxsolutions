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

  const url = 'file:///' + path.resolve(__dirname, '..', 'website', 'index.html').replace(/\\/g, '/');
  console.log('Testing:', url);
  await page.goto(url, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 600));

  // Check header position style at scroll 0
  const headerStyle = await page.evaluate(() => {
    const h = document.querySelector('header');
    const cs = window.getComputedStyle(h);
    const rect = h.getBoundingClientRect();
    return {
      position: cs.position,
      topStyle: cs.top,
      rectTop: rect.top,
      rectHeight: rect.height
    };
  });
  console.log('Header at top (scroll 0):', headerStyle);

  // Take screenshot at top
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_header_at_top.png') });

  // Scroll down by 800px
  console.log('Scrolling down by 800px...');
  await page.evaluate(() => {
    window.scrollTo(0, 800);
  });
  await new Promise(r => setTimeout(r, 400));

  // Check header rect when scrolled
  const headerScrolledStyle = await page.evaluate(() => {
    const h = document.querySelector('header');
    const cs = window.getComputedStyle(h);
    const rect = h.getBoundingClientRect();
    return {
      position: cs.position,
      scrollY: window.scrollY,
      rectTop: rect.top,
      rectBottom: rect.bottom,
      isVisibleInViewport: (rect.bottom > 0 && rect.top < window.innerHeight)
    };
  });
  console.log('Header after scrolling 800px:', headerScrolledStyle);

  // Take screenshot after scrolling
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'verified_header_scrolled_away.png') });

  await browser.close();
  console.log('Done verification!');
})();
