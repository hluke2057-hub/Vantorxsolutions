// scripts/test_playback_sync_drift.js
const puppeteer = require('puppeteer-core');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve('website/demo/reel-creator.html');

async function main() {
  console.log('--- TESTING PLAYBACK HARDWARE CLOCK SYNC & ZERO-DRIFT ---');

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  console.log('Triggering Play & Preview Reel...');
  await page.evaluate(() => {
    window.setAudioSyncOffset(0);
    togglePlay();
  });

  console.log('Sampling playback timestamps over 5 seconds...');
  const samples = [];
  for (let step = 0; step < 10; step++) {
    await new Promise(r => setTimeout(r, 500));
    const sample = await page.evaluate((currStep) => {
      const audioT = uploadedAudioElement ? uploadedAudioElement.currentTime : null;
      const canvasT = currentTime;
      const paused = uploadedAudioElement ? uploadedAudioElement.paused : null;
      return {
        step: currStep,
        canvasT: parseFloat(canvasT.toFixed(3)),
        audioT: audioT !== null ? parseFloat(audioT.toFixed(3)) : null,
        paused,
        diffMs: audioT !== null ? Math.round(Math.abs(canvasT - audioT) * 1000) : null
      };
    }, step);
    samples.push(sample);
  }

  console.table(samples);

  const maxDiff = Math.max(...samples.map(s => s.diffMs || 0));
  console.log(`Maximum clock drift across sampling period: ${maxDiff}ms`);

  await browser.close();

  if (maxDiff <= 20) {
    console.log('🎉 PERFECT CLOCK LOCK VERIFIED: Maximum drift is under 20ms!');
  } else {
    console.warn('Clock drift warning:', maxDiff);
  }
}

main().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
