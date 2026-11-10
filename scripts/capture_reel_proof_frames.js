const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/demo/reel-creator.html');
const brainDir = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0';

const testTimestamps = [
  { t: 3.5, name: 'proof_scene1_laser_speed_of_light.png', label: 'Scene 1: Laser Crowd & 186,000 mi/s' },
  { t: 9.5, name: 'proof_scene2_earth_moon_uranus_warp.png', label: 'Scene 2: Earth, Moon & Uranus 1.8B Miles' },
  { t: 15.0, name: 'proof_scene3_space_vs_contractor_contrast.png', label: 'Scene 3: Deep Space (3h) vs Contractor (27h)' },
  { t: 19.5, name: 'proof_scene4_homeowner_leak_emergency.png', label: 'Scene 4: Homeowner Ceiling Burst & Voicemail' },
  { t: 24.0, name: 'proof_scene5_78_percent_benchmark.png', label: 'Scene 5: 78% First Responder Rule' },
  { t: 28.0, name: 'proof_scene6a_bob_ladder_vibrating_phone.png', label: 'Scene 6a: Bob on 20ft Ladder & Phone Buzzing' },
  { t: 31.5, name: 'proof_scene6b_competitor_truck_cash_snatch.png', label: 'Scene 6b: Competitor Truck & Flying $8K Cash' },
  { t: 38.0, name: 'proof_scene7_ava_08s_waveform_dispatch.png', label: 'Scene 7: Ava 0.8s Voice AI & Tech Dispatch' },
  { t: 47.0, name: 'proof_scene8_revenue_waterfall_80k.png', label: 'Scene 8: +$80,000 / mo Protected Revenue' },
  { t: 54.0, name: 'proof_scene9_live_interactive_dialer.png', label: 'Scene 9: Live Dialer (561) 813-8602' },
  { t: 60.0, name: 'proof_scene10_taskless_comment_ava_endcard.png', label: 'Scene 10: Taskless End Card COMMENT "AVA"' }
];

async function capture() {
  console.log('Launching Edge for Reel Scene Proof Captures...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1100 });
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  for (const item of testTimestamps) {
    console.log(`Rendering t = ${item.t}s (${item.label})...`);
    await page.evaluate((time) => {
      if (typeof window.renderFrame === 'function') {
        window.renderFrame(time);
      }
    }, item.t);

    const canvasHandle = await page.$('#reelCanvas');
    const outPath = path.join(brainDir, item.name);
    await canvasHandle.screenshot({ path: outPath, type: 'png' });
    console.log(`Saved screenshot -> ${outPath}`);
  }

  await browser.close();
  console.log('All scene proof frames captured successfully!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
