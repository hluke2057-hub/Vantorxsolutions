const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 });
  const url = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  const diag = await page.evaluate(() => {
    const overlay = document.getElementById('reelPlayOverlay');
    if (!overlay) return { exists: false };
    const rect = overlay.getBoundingClientRect();
    const style = window.getComputedStyle(overlay);
    const circle = overlay.querySelector('.reel-play-circle');
    const title = overlay.querySelector('.reel-play-title');
    return {
      exists: true,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      zIndex: style.zIndex,
      rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      circleRect: circle ? circle.getBoundingClientRect() : null,
      titleText: title ? title.textContent : null,
      titleStyleColor: title ? window.getComputedStyle(title).color : null
    };
  });

  console.log('OVERLAY DIAGNOSTIC:', JSON.stringify(diag, null, 2));
  await browser.close();
})();
