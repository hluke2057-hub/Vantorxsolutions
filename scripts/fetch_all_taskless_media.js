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

  let count = 0;
  page.on('response', async (res) => {
    const url = res.url();
    const contentType = res.headers()['content-type'] || '';
    if (url.includes('.mp4') || contentType.includes('video') || contentType.includes('audio')) {
      const idx = count++;
      try {
        const buf = await res.buffer();
        const dest = path.join(artDir, `taskless_stream_${idx}.mp4`);
        fs.writeFileSync(dest, buf);
        console.log(`Saved stream ${idx}: ${buf.length} bytes, type: ${contentType}`);
      } catch (err) {
        // ignore range errors
      }
    }
  });

  const u = 'https://www.instagram.com/reel/DfER2bzxQJj/';
  console.log('Opening:', u);
  await page.goto(u, { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 6000));
  await browser.close();
  console.log('Finished capturing streams.');
})();
