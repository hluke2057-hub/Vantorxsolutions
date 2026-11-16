// scripts/test_stick_snapshots.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scriptSrc = fs.readFileSync(path.join(root, 'scripts/render_stick_figure_story_reel.js'), 'utf8');

const startStr = 'const htmlContent = `';
const endStr = '`;\n\nconst tmpHtmlPath';
let html = scriptSrc.substring(scriptSrc.indexOf(startStr) + startStr.length, scriptSrc.indexOf(endStr));

const tsJsonPath = path.join(root, 'website/demo/audio/reel-nvidia-timestamps.json');
const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
html = html.replace('${JSON.stringify(tsData.words)}', JSON.stringify(tsData.words));

const tmpHtml = path.join(root, 'scripts/tmp_stick_test.html');
fs.writeFileSync(tmpHtml, html, 'utf8');

async function testScreenshots() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  page.on('console', msg => console.log('LOG:', msg.text()));
  await page.setViewport({ width: 1080, height: 1920 });
  await page.goto('file:///' + tmpHtml.replace(/\\/g, '/'), { waitUntil: 'load' });

  const testTimes = [
    { t: 4.0, name: 'preview_stick_act1_jensen.jpg' },
    { t: 25.0, name: 'preview_stick_act2_sega_check.jpg' },
    { t: 40.0, name: 'preview_stick_act3_bob_ladder.jpg' },
    { t: 55.0, name: 'preview_stick_act4_ava_dispatch.jpg' },
    { t: 68.0, name: 'preview_stick_act5_phone_cta.jpg' }
  ];

  for (const item of testTimes) {
    await page.evaluate((tm) => window.renderFrame(tm), item.t);
    const shotPath = path.join(root, 'website/demo/video', item.name);
    await page.screenshot({ path: shotPath, quality: 90, type: 'jpeg' });
    console.log(`Captured stick preview snapshot: ${shotPath}`);
  }

  await browser.close();
  try { fs.unlinkSync(tmpHtml); } catch (e) {}
  console.log('✅ All stick figure snapshots captured successfully!');
}

testScreenshots().catch(err => {
  console.error('Snapshot test failed:', err);
  process.exit(1);
});
