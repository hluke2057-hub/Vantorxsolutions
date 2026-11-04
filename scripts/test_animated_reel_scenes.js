const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/demo/reel-creator.html');

async function testFrames() {
  console.log('Testing reel animation frames in Edge...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });

  // Test rendering specific timepoints:
  // t = 4.0s (Scene 1: Orbit & Lasers)
  // t = 14.0s (Scene 1: Alarm & Anomaly)
  // t = 22.0s (Scene 2: Ringing Call)
  // t = 27.0s (Scene 2: Missed Voicemail Strobe)
  // t = 36.0s (Scene 3: Ava Orb & Voice Dialogue)
  // t = 52.0s (Scene 4: Logo & ManyChat CTA)
  const timepoints = [4.0, 14.0, 22.0, 27.0, 36.0, 52.0];
  
  for (const t of timepoints) {
    const res = await page.evaluate((time) => {
      try {
        if (typeof window.renderFrame === 'function') {
          window.renderFrame(time);
          return { ok: true };
        }
        return { ok: false, error: 'renderFrame not found' };
      } catch (err) {
        return { ok: false, error: err.message, stack: err.stack };
      }
    }, t);
    console.log(`Frame at t=${t}s:`, res);
  }

  await browser.close();
}

testFrames().catch(console.error);
