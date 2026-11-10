const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });
  
  const fileUrl = 'file:///' + path.resolve('C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/demo/reel-creator.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  const testTimes = [
    { t: 3.5, name: 'scene1_3_5s' },
    { t: 9.5, name: 'scene2_9_5s' },
    { t: 15.0, name: 'scene3_15_0s' },
    { t: 21.0, name: 'scene4_21_0s' },
    { t: 28.0, name: 'scene5_28_0s' },
    { t: 35.0, name: 'scene6_35_0s' },
    { t: 43.0, name: 'scene7_43_0s' },
    { t: 50.0, name: 'scene8_50_0s' },
    { t: 56.0, name: 'scene9_56_0s' },
    { t: 60.5, name: 'scene10_60_5s' }
  ];

  for (const item of testTimes) {
    await page.evaluate((currT) => {
      if (window.renderFrame) {
        window.renderFrame(currT);
      }
    }, item.t);
    await new Promise(r => setTimeout(r, 120));

    const canvasElement = await page.$('#reelCanvas');
    if (canvasElement) {
      const outPath = path.join(ARTIFACTS_DIR, 'current_' + item.name + '.png');
      await canvasElement.screenshot({ path: outPath });
      console.log('Saved frame:', item.name);
    }
  }

  await browser.close();
  console.log('All frames captured successfully.');
})();
