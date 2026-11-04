const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/demo/reel-creator.html');
const brainDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

const sampleTimes = [
  { t: 2.5, name: 'scene_01_laser_speed.png' },
  { t: 6.2, name: 'scene_02_moon_impact.png' },
  { t: 10.5, name: 'scene_03_deep_space_saturn.png' },
  { t: 15.5, name: 'scene_04_contractor_delay_glitch.png' },
  { t: 21.0, name: 'scene_05_stat_78_percent_slam.png' },
  { t: 24.5, name: 'scene_06_incoming_8500_call.png' },
  { t: 28.5, name: 'scene_07_on_ladder_missed_call.png' },
  { t: 34.0, name: 'scene_08_handed_to_competitor.png' },
  { t: 38.5, name: 'scene_09_meet_ava_voice_ai.png' },
  { t: 42.0, name: 'scene_10_live_triage_chat.png' },
  { t: 45.5, name: 'scene_11_tech_sms_dispatch.png' },
  { t: 49.0, name: 'scene_12_competitor_tab_closed.png' },
  { t: 52.5, name: 'scene_13_stop_dead_voicemails.png' },
  { t: 56.0, name: 'scene_14_dial_demo_line_now.png' },
  { t: 60.5, name: 'scene_15_instagram_comment_manychat.png' }
];

async function main() {
  console.log('Launching headless browser to inspect 15 dynamic scenes...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 540, height: 960, deviceScaleFactor: 1 });
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 600));

  for (const s of sampleTimes) {
    const base64 = await page.evaluate((timestamp) => {
      window.renderFrame(timestamp);
      const c = document.getElementById('reelCanvas');
      return c.toDataURL('image/png').slice(22);
    }, s.t);

    const buf = Buffer.from(base64, 'base64');
    const outPath = path.join(brainDir, s.name);
    fs.writeFileSync(outPath, buf);
    console.log(`[SAVED] ${s.name} at t=${s.t}s (${(buf.length / 1024).toFixed(1)} KB)`);
  }

  await browser.close();
  console.log('All 15 scene previews captured!');
}

main().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});
