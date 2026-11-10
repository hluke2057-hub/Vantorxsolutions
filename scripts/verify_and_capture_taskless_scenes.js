const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';
const htmlPath = path.resolve('website/demo/reel-creator.html');

const testTimes = [
  { t: 3.5, name: 'taskless_scene1_laser_crowd.png' },
  { t: 9.5, name: 'taskless_scene2_earth_to_uranus.png' },
  { t: 15.0, name: 'taskless_scene3_uranus_metric.png' },
  { t: 18.0, name: 'taskless_scene4_clock_roundtrip.png' },
  { t: 23.0, name: 'taskless_scene5_78percent_stat.png' },
  { t: 30.0, name: 'taskless_scene6_dark_ui_missed_lead.png' },
  { t: 38.0, name: 'taskless_scene7_ava_instant_reply.png' },
  { t: 47.0, name: 'taskless_scene8_revenue_waterfall.png' },
  { t: 54.0, name: 'taskless_scene9_live_dialer.png' },
  { t: 60.0, name: 'taskless_scene10_taskless_end_card.png' }
];

(async () => {
  console.log('Launching headless browser to verify Taskless engine...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') console.error('[PAGE ERROR]', msg.text());
  });
  page.on('pageerror', err => console.error('[UNCAUGHT ERROR]', err.message));

  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1500));

  console.log('Verifying renderFrame and capturing screenshots...');

  for (const item of testTimes) {
    const dataUrl = await page.evaluate((t) => {
      const cvs = document.getElementById('reelCanvas');
      if (typeof window.renderFrame === 'function') {
        window.renderFrame(t);
      }
      return cvs.toDataURL('image/png');
    }, item.t);

    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const outPath = path.join(artDir, item.name);
    fs.writeFileSync(outPath, base64Data, 'base64');
    console.log(`Rendered frame t=${item.t}s ➔ ${item.name} (${base64Data.length} b64 bytes)`);
  }

  await browser.close();
  console.log('All verification frames captured successfully!');
})();
