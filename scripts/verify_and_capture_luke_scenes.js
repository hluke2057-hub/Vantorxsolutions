// scripts/verify_and_capture_luke_scenes.js
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/fitness/reel.html');
const outDir = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0';

const scenesToTest = [
  { t: 3.0, name: 'luke_scene1_junk_vs_failure.png', label: 'Scene 1: Junk Volume vs Failure' },
  { t: 9.5, name: 'luke_scene2_155_vs_180_proof.png', label: 'Scene 2: 155 vs 180 Transformation Proof' },
  { t: 17.5, name: 'luke_scene3_golden_law_overload.png', label: 'Scene 3: The Golden Law Curve' },
  { t: 25.0, name: 'luke_scene4_48min_split.png', label: 'Scene 4: 48-Min Clock & Push/Pull/Legs' },
  { t: 34.0, name: 'luke_scene5_3d_delts_recruitment.png', label: 'Scene 5: 3D Delts & 100% Recruitment' },
  { t: 42.0, name: 'luke_scene6_surgical_logbook.png', label: 'Scene 6: Surgical Logbook Tracker' },
  { t: 50.0, name: 'luke_scene7_full_physique_dm.png', label: 'Scene 7: Full Physique DM Notification' },
  { t: 58.0, name: 'luke_scene8_taskless_cta_endcard.png', label: 'Scene 8: 1:1 Taskless Signature CTA' }
];

(async () => {
  console.log('--- VERIFYING LUKE HAMILTON TASKLESS REEL SCENES ---');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  // Wait a moment for fonts & images to settle
  await new Promise(r => setTimeout(r, 1000));

  for (const scene of scenesToTest) {
    console.log(`Rendering ${scene.label} at t=${scene.t}s...`);
    await page.evaluate((time) => {
      window.renderFrame(time);
    }, scene.t);

    const canvasHandle = await page.$('#reelCanvas');
    const outPath = path.join(outDir, scene.name);
    await canvasHandle.screenshot({ path: outPath });
    console.log(`✓ Saved screenshot: ${outPath}`);
  }

  await browser.close();
  console.log('--- ALL SCENES CAPTURED SUCCESSFULLY ---');
})();
