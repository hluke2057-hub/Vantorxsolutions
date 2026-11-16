// scripts/test_cinematic_snapshots.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Require render_cinematic_3d_story_reel.js html setup
const scriptSrc = fs.readFileSync(path.join(root, 'scripts/render_cinematic_3d_story_reel.js'), 'utf8');
const startStr = 'const htmlContent = `';
const endStr = '`;\n\nconst tmpHtmlPath';
const htmlTemplate = scriptSrc.substring(scriptSrc.indexOf(startStr) + startStr.length, scriptSrc.indexOf(endStr));

const tsJsonPath = path.join(root, 'website/demo/audio/reel-nvidia-timestamps.json');
const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));

// Helper to encode image to base64 data URI
function getImgDataUri(p) {
  if (fs.existsSync(p)) {
    const ext = path.extname(p).replace('.', '') || 'jpeg';
    return `data:image/${ext};base64,${fs.readFileSync(p).toString('base64')}`;
  }
  return null;
}

const sceneImages = [
  path.join(root, 'website/demo/video/scene1_nvidia_3d.jpg'),
  path.join(root, 'website/demo/video/scene2_sega_3d.jpg'),
  path.join(root, 'website/demo/video/scene3_attic_3d.jpg'),
  path.join(root, 'website/demo/video/scene4_ava_3d.jpg'),
  path.join(root, 'website/demo/video/scene5_cta_3d.jpg')
];

let html = htmlTemplate.replace('${JSON.stringify(tsData.words)}', JSON.stringify(tsData.words));
html = html.replace('${sceneImages.map(p => JSON.stringify(getImgDataUri(p))).join(\',\n      \')}', sceneImages.map(p => JSON.stringify(getImgDataUri(p))).join(',\n      '));

const tmpHtml = path.join(root, 'scripts/tmp_cinematic_test.html');
fs.writeFileSync(tmpHtml, html, 'utf8');

async function testScreenshots() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  page.on('console', msg => console.log('LOG:', msg.text()));
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto('file:///' + tmpHtml.replace(/\\/g, '/'), { waitUntil: 'load' });

  const testTimes = [
    { t: 4.0, name: 'preview_cinematic_act1.jpg' },
    { t: 24.0, name: 'preview_cinematic_act2.jpg' },
    { t: 40.0, name: 'preview_cinematic_act3.jpg' },
    { t: 55.0, name: 'preview_cinematic_act4.jpg' },
    { t: 69.0, name: 'preview_cinematic_act5.jpg' }
  ];

  for (const item of testTimes) {
    await page.evaluate((tm) => window.renderFrame(tm), item.t);
    const shotPath = path.join(root, 'website/demo/video', item.name);
    await page.screenshot({ path: shotPath, quality: 90, type: 'jpeg' });
    console.log(`Captured cinematic snapshot: ${shotPath}`);
  }

  await browser.close();
  try { fs.unlinkSync(tmpHtml); } catch (e) {}
  console.log('✅ All cinematic snapshots captured successfully!');
}

testScreenshots().catch(err => {
  console.error('Snapshot test failed:', err);
  process.exit(1);
});
