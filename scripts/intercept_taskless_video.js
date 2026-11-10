const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  let saved = false;

  page.on('response', async (res) => {
    const url = res.url();
    const contentType = res.headers()['content-type'] || '';
    if ((url.includes('.mp4') || contentType.includes('video/mp4')) && !saved) {
      saved = true;
      console.log('Intercepted video response:', url);
      try {
        const buffer = await res.buffer();
        const dest = path.join(artDir, 'taskless_uranus_reel.mp4');
        fs.writeFileSync(dest, buffer);
        console.log('Saved taskless_uranus_reel.mp4, size:', buffer.length, 'bytes');
      } catch (err) {
        console.error('Error saving video buffer:', err.message);
      }
    }
  });

  const u = 'https://www.instagram.com/reel/DfER2bzxQJj/';
  console.log('Navigating to:', u);
  await page.goto(u, { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 6000));

  await browser.close();
  console.log('Done intercepting.');
})();
