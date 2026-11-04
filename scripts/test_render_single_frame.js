const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function test() {
  console.log('Launching Edge...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  const htmlPath = path.resolve('website/demo/reel-creator.html');
  console.log('Navigating to:', htmlPath);
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });

  // Test rendering frame at t = 2.0s
  await page.evaluate(() => {
    window.renderFrame(2.0);
  });

  const canvasEl = await page.$('#reelCanvas');
  const buffer = await canvasEl.screenshot({ type: 'png' });
  const outPath = 'website/demo/test_frame.png';
  fs.writeFileSync(outPath, buffer);
  console.log('Saved test frame to:', outPath, 'size:', buffer.length);

  await browser.close();
}

test().catch(console.error);
