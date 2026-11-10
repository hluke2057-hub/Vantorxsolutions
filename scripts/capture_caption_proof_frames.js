// scripts/capture_caption_proof_frames.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('Capturing proof frames for new Captions & CRT Scanlines...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  const htmlUrl = 'file:///' + path.resolve('website/demo/reel-creator.html').replace(/\\/g, '/');
  await page.goto(htmlUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  const testTimes = [
    { time: 1.25, name: 'proof_frame_01_laser_caption_crt.png' },
    { time: 28.5, name: 'proof_frame_02_bob_ladder_buzz_crt.png' },
    { time: 34.8, name: 'proof_frame_03_ava_chime_crt.png' },
    { time: 44.5, name: 'proof_frame_04_sms_tech_dispatch_crt.png' },
    { time: 50.0, name: 'proof_frame_05_revenue_waterfall_crt.png' }
  ];

  for (const item of testTimes) {
    const base64Img = await page.evaluate((t) => {
      const cvs = document.getElementById('reelCanvas');
      if (typeof window.renderFrame === 'function') {
        window.renderFrame(t);
      }
      return cvs.toDataURL('image/png').slice(22);
    }, item.time);

    const outPath = path.join(ARTIFACT_DIR, item.name);
    fs.writeFileSync(outPath, Buffer.from(base64Img, 'base64'));
    console.log(`✓ Proof frame captured at ${item.time}s: ${outPath}`);
  }

  await browser.close();
  console.log('Finished capturing proof frames!');
})();
