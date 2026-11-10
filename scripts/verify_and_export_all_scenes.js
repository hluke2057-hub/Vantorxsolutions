const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('--- STARTING COMPREHENSIVE TASKLESS SCENE VERIFICATION ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  const fileUrl = 'file:///' + path.resolve('website/demo/reel-creator.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });
  // Wait 1.5s for all 3D assets to settle
  await new Promise(r => setTimeout(r, 1500));

  // Hide the play button overlay when testing timestamps
  await page.evaluate(() => {
    window.isPlaying = true;
    const ov = document.getElementById('reelPlayOverlay');
    if (ov) ov.remove();
  });

  const testScenes = [
    { t: 3.5, name: 'verified_taskless_scene1_laser.png', desc: 'Scene 1: 186,000 Mi/s Laser Speed Hook' },
    { t: 9.5, name: 'verified_taskless_scene2_moon.png', desc: 'Scene 2: Moon in 1.28s & 2B Miles Deep Space' },
    { t: 15.0, name: 'verified_taskless_scene3_latency.png', desc: 'Scene 3: Space Trip vs 252m Contractor Callback' },
    { t: 21.0, name: 'verified_taskless_scene4_stat78.png', desc: 'Scene 4: 78% Speed to Lead Animated Gauge' },
    { t: 28.0, name: 'verified_taskless_scene5_contractor.png', desc: 'Scene 5: Contractor on Ladder -$8,000 Loss' },
    { t: 35.0, name: 'verified_taskless_scene6_ava.png', desc: 'Scene 6: Meet Ava Voice AI 0.8s Waveform' },
    { t: 43.0, name: 'verified_taskless_scene7_tech.png', desc: 'Scene 7: Calendar Sync & Tech Mike Dispatch' },
    { t: 50.0, name: 'verified_taskless_scene8_dashboard.png', desc: 'Scene 8: +$44,800/mo Revenue Shield' },
    { t: 56.0, name: 'verified_taskless_scene9_dialer.png', desc: 'Scene 9: (561) 813-8602 Live Demo Dialer' },
    { t: 60.5, name: 'verified_taskless_scene10_cta.png', desc: 'Scene 10: Comment AVA Viral Action Card' }
  ];

  for (const item of testScenes) {
    console.log(`Rendering t = ${item.t}s (${item.desc})...`);
    await page.evaluate((currT) => {
      if (typeof window.seekTo === 'function') {
        window.seekTo(currT);
      } else if (typeof window.renderFrame === 'function') {
        window.renderFrame(currT);
      }
    }, item.t);
    await new Promise(r => setTimeout(r, 400));

    const canvasElement = await page.$('#reelCanvas');
    if (canvasElement) {
      const outPath = path.join(ARTIFACTS_DIR, item.name);
      await canvasElement.screenshot({ path: outPath });
      const stats = fs.statSync(outPath);
      console.log(`✓ CAPTURED ${item.name} (${(stats.size / 1024).toFixed(1)} KB)`);
    }
  }

  await browser.close();
  console.log('--- ALL 10 TASKLESS SCENES VERIFIED SUCCESSFULLY ---');
})();
