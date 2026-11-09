const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('--- CAPTURING FRAMES DIRECTLY FROM LIVE REEL PLAYER ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  const reelsToCapture = [
    { name: 'uranus_reel', url: 'https://www.instagram.com/trytaskless.ai/reel/DfER2bzxQJj/', times: [1.0, 3.5, 7.0, 11.0, 15.0] },
    { name: '11pm_night_reel', url: 'https://www.instagram.com/trytaskless.ai/reel/DfVJ5ZHNWLl/', times: [1.0, 3.0, 6.0, 9.0, 12.0] },
    { name: 'friday_money_reel', url: 'https://www.instagram.com/trytaskless.ai/reel/De0XsE4tDt8/', times: [1.0, 3.0, 6.0, 9.0] }
  ];

  for (const r of reelsToCapture) {
    console.log(`Loading reel: ${r.name} (${r.url})...`);
    try {
      await page.goto(r.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(res => setTimeout(res, 2000));

      // Dismiss dialogs
      await page.evaluate(() => {
        document.querySelectorAll('div[role="dialog"], div[role="presentation"]').forEach(d => d.remove());
      });

      const video = await page.$('video');
      if (!video) {
        console.log(`No video element found for ${r.name}`);
        continue;
      }

      for (let i = 0; i < r.times.length; i++) {
        const t = r.times[i];
        await page.evaluate((time) => {
          const v = document.querySelector('video');
          if (v) {
            v.currentTime = time;
            v.pause();
          }
        }, t);
        await new Promise(res => setTimeout(res, 800));

        const filename = `${r.name}_t${t}s.png`;
        await video.screenshot({ path: path.join(ARTIFACTS_DIR, filename) });
        console.log(`Captured ${filename}`);
      }
    } catch(e) {
      console.log(`Failed on ${r.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('ALL FRAMES CAPTURED SUCCESSFULLY!');
})();
