// scripts/test_3d_snapshots.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tsJsonPath = path.join(root, 'website/demo/audio/reel-nvidia-timestamps.json');
const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));

// Read render_nvidia_3d_reel.js and extract htmlContent dynamically
const scriptSrc = fs.readFileSync(path.join(root, 'scripts/render_nvidia_3d_reel.js'), 'utf8');

// We can just require the htmlContent generation by evaluating the script setup
const startStr = 'const htmlContent = `';
const endStr = '`;\n\nconst tmpHtmlPath';
const htmlTemplate = scriptSrc.substring(scriptSrc.indexOf(startStr) + startStr.length, scriptSrc.indexOf(endStr));

// Interpolate WORDS
const html = htmlTemplate.replace('${JSON.stringify(tsData.words)}', JSON.stringify(tsData.words));
const tmpHtml = path.join(root, 'scripts/test_preview.html');
fs.writeFileSync(tmpHtml, html, 'utf8');

async function testScreenshots() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto('file:///' + tmpHtml.replace(/\\/g, '/'), { waitUntil: 'load' });

  const testTimes = [
    { t: 4.0, name: 'preview_3d_act1_chip.jpg' },
    { t: 24.0, name: 'preview_3d_act2_sega_check.jpg' },
    { t: 39.0, name: 'preview_3d_act3_phone_bleed.jpg' },
    { t: 55.0, name: 'preview_3d_act4_ava_reactor.jpg' },
    { t: 69.0, name: 'preview_3d_act4_call_cta.jpg' }
  ];

  for (const item of testTimes) {
    await page.evaluate((tm) => window.renderFrame(tm), item.t);
    const shotPath = path.join(root, 'website/demo/video', item.name);
    await page.screenshot({ path: shotPath, quality: 90, type: 'jpeg' });
    console.log(`Captured preview snapshot: ${shotPath}`);
  }

  await browser.close();
  try { fs.unlinkSync(tmpHtml); } catch (e) {}
  console.log('✅ All test snapshots captured successfully!');
}

testScreenshots().catch(err => {
  console.error('Snapshot test failed:', err);
  process.exit(1);
});
