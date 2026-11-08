const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('--- VERIFYING TASKLESS REEL ENGINE UPGRADE ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 });

  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  const url = 'file:///' + path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const stage = await page.$('.video-stage-column');

  // Test snapshots at key timestamps
  const snapshots = [
    { t: 0, file: 'taskless_verified_poster_card.png', desc: 'Hero Poster with 3D Ava Avatar' },
    { t: 19.5, file: 'taskless_verified_scene5_78pct.png', desc: 'Scene 5: 78% Slam in Electric Lime' },
    { t: 24.5, file: 'taskless_verified_scene6_call.png', desc: 'Scene 6: Incoming $9,200 Call' },
    { t: 28.5, file: 'taskless_verified_scene7_tech.png', desc: 'Scene 7: 3D Cyber Technician on Ladder' },
    { t: 38.5, file: 'taskless_verified_scene9_ava_reveal.png', desc: 'Scene 9: Meet Ava AI Reveal 3D' },
    { t: 45.0, file: 'taskless_verified_scene11_shield_bot.png', desc: 'Scene 11: 3D Security Shield Bot' },
    { t: 59.5, file: 'taskless_verified_scene15_cta.png', desc: 'Scene 15: Comment AVA Taskless CTA' }
  ];

  for (const s of snapshots) {
    console.log(`Rendering t = ${s.t}s (${s.desc})...`);
    await page.evaluate((timeVal) => {
      window.seekTo(timeVal);
      const ov = document.getElementById('reelPlayOverlay');
      if (ov && timeVal > 0) {
        ov.style.display = 'none';
      }
    }, s.t);
    await new Promise(r => setTimeout(r, 400));

    if (stage) {
      await stage.screenshot({ path: path.join(ARTIFACTS_DIR, s.file) });
      console.log(`PASS: Captured ${s.file}`);
    }
  }

  await browser.close();
  console.log('TASKLESS REEL ENGINE VERIFICATION COMPLETE!');
})();
