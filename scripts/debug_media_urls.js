const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' });
  const page = await browser.newPage();
  const allMediaUrls = [];

  page.on('response', async resp => {
    const ct = resp.headers()['content-type'] || '';
    const url = resp.url();
    if (ct.includes('audio') || ct.includes('video') || url.includes('.mp4') || url.includes('.m4a') || url.includes('bytestart')) {
      allMediaUrls.push({ url: url.slice(0, 110), ct, size: resp.headers()['content-length'] });
    }
  });

  await page.goto('https://www.instagram.com/reel/DfjYNESOhdF/', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate(() => {
    const btn = document.querySelector('svg[aria-label="Close"]');
    if (btn && btn.closest('button')) btn.closest('button').click();
    const v = document.querySelector('video');
    if (v) {
      v.muted = false;
      v.play();
    }
  });
  await new Promise(r => setTimeout(r, 4000));
  console.log('Media URLs intercepted:', allMediaUrls);
  await browser.close();
})();
