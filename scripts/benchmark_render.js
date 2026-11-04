const puppeteer = require('puppeteer-core');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const htmlPath = path.resolve('website/demo/reel-creator.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });

  console.log('Testing 60 frames render speed in browser context...');
  const t0 = Date.now();
  const framesCount = await page.evaluate(async () => {
    const fps = 30;
    const count = 60;
    const results = [];
    for (let i = 0; i < count; i++) {
      const t = i / fps;
      window.renderFrame(t);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      results.push(dataUrl.length);
    }
    return results.length;
  });
  const t1 = Date.now();
  console.log(`Rendered ${framesCount} frames in ${(t1 - t0)}ms (${(framesCount / ((t1 - t0)/1000)).toFixed(1)} fps)`);

  await browser.close();
}

test().catch(console.error);
