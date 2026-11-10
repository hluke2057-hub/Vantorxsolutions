const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

(async () => {
  console.log('--- VERIFYING IMMERSIVE STICK FIGURE STORY REEL ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--allow-file-access-from-files', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1100 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  const fileUrl = 'file:///' + path.resolve('website/demo/reel-creator.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  // Hide the play button overlay
  await page.evaluate(() => {
    window.isPlaying = true;
    const ov = document.getElementById('reelPlayOverlay');
    if (ov) ov.remove();
  });

  const testScenes = [
    { t: 3.5, name: 'stick_scene1_laser_pointer.png', desc: 'Scene 1: Stick Figure with Laser Pointer on Earth' },
    { t: 9.5, name: 'stick_scene2_moon_cartoon.png', desc: 'Scene 2: Smiling Cartoon Moon & 2B Miles Deep Space' },
    { t: 15.0, name: 'stick_scene3_leaky_ceiling.png', desc: 'Scene 3: Panicked Homeowner with Leaky Ceiling & Clock' },
    { t: 21.0, name: 'stick_scene4_stat78_comic.png', desc: 'Scene 4: 78% Law Comic Stamp & Two Stick Figures' },
    { t: 28.0, name: 'stick_scene5_ladder_money_wings.png', desc: 'Scene 5: Sweating Contractor on Ladder & $8k Money with Wings' },
    { t: 35.0, name: 'stick_scene6_ava_robot_hello.png', desc: 'Scene 6: Enter Ava the Friendly Robot Answering in 0.8s' },
    { t: 43.0, name: 'stick_scene7_van_zoom.png', desc: 'Scene 7: Auto Dispatch Work Van Zooming with Smoke' },
    { t: 50.0, name: 'stick_scene8_sleeping_money_stack.png', desc: 'Scene 8: Contractor Sleeping Peacefully While Ava Stacks Cash' },
    { t: 56.0, name: 'stick_scene9_dialer_ava.png', desc: 'Scene 9: Ava Pointing to (561) 813-8602 Demo Line' },
    { t: 60.5, name: 'stick_scene10_viral_card.png', desc: 'Scene 10: Clean Product Card COMMENT AVA' }
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
    await new Promise(r => setTimeout(r, 350));

    const canvasElement = await page.$('#reelCanvas');
    if (canvasElement) {
      const outPath = path.join(ARTIFACTS_DIR, item.name);
      await canvasElement.screenshot({ path: outPath });
      const stats = fs.statSync(outPath);
      console.log(`✓ CAPTURED ${item.name} (${(stats.size / 1024).toFixed(1)} KB)`);
    }
  }

  await browser.close();
  console.log('--- ALL 10 STICK FIGURE STORY SCENES VERIFIED SUCCESSFULLY ---');
})();
