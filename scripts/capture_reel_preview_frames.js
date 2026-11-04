const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/demo/reel-creator.html');
const brainDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

async function capture() {
  console.log('Capturing preview frames from Edge...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1200 });
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 800));

  const timepoints = [
    { t: 4.5, name: 'reel_frame_hook_laser.png' },
    { t: 14.5, name: 'reel_frame_hook_alarm.png' },
    { t: 26.5, name: 'reel_frame_missed_call.png' },
    { t: 38.0, name: 'reel_frame_ava_voice.png' },
    { t: 53.0, name: 'reel_frame_cta.png' }
  ];

  for (const item of timepoints) {
    const dataUrl = await page.evaluate((time) => {
      window.renderFrame(time);
      const cvs = document.getElementById('reelCanvas');
      return cvs.toDataURL('image/png');
    }, item.t);

    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const outPath = path.join(brainDir, item.name);
    fs.writeFileSync(outPath, base64Data, 'base64');
    console.log(`Saved: ${item.name} (${fs.statSync(outPath).size} bytes)`);
  }

  await browser.close();
  console.log('All preview frames saved successfully!');
}

capture().catch(console.error);
