// scripts/test_mem_stable.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const scene1 = 'file:///' + path.join(root, 'website/demo/video/scene1_nvidia_3d.jpg').replace(/\\/g, '/');
const scene2 = 'file:///' + path.join(root, 'website/demo/video/scene2_sega_3d.jpg').replace(/\\/g, '/');
const scene3 = 'file:///' + path.join(root, 'website/demo/video/scene3_attic_3d.jpg').replace(/\\/g, '/');
const scene4 = 'file:///' + path.join(root, 'website/demo/video/scene4_ava_3d.jpg').replace(/\\/g, '/');
const scene5 = 'file:///' + path.join(root, 'website/demo/video/scene5_cta_3d.jpg').replace(/\\/g, '/');

const testHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background: #000; overflow: hidden; width: 1080px; height: 1920px; }
    canvas { width: 1080px; height: 1920px; }
    img { display: none; }
  </style>
</head>
<body>
  <img id="img0" src="${scene1}">
  <img id="img1" src="${scene2}">
  <img id="img2" src="${scene3}">
  <img id="img3" src="${scene4}">
  <img id="img4" src="${scene5}">
  <canvas id="c" width="1080" height="1920"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const IMAGES = [
      document.getElementById('img0'),
      document.getElementById('img1'),
      document.getElementById('img2'),
      document.getElementById('img3'),
      document.getElementById('img4')
    ];

    window.isLoaded = false;
    let loadedCount = 0;
    IMAGES.forEach(img => {
      if (img.complete) loadedCount++;
      else img.onload = () => { loadedCount++; if (loadedCount === IMAGES.length) window.isLoaded = true; };
    });
    if (loadedCount === IMAGES.length) window.isLoaded = true;

    window.renderFrame = function(t) {
      const idx = Math.floor(t % 5);
      const img = IMAGES[idx];
      ctx.drawImage(img, 0, 0, 1080, 1920);
      ctx.fillStyle = '#facc15';
      ctx.font = '900 60px Arial';
      ctx.fillText('FRAME T=' + t.toFixed(2), 100, 200);
    };
  </script>
</body>
</html>`;

const tmpPath = path.join(root, 'scripts/tmp_test_mem.html');
fs.writeFileSync(tmpPath, testHtml, 'utf8');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.goto('file:///' + tmpPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForFunction(() => window.isLoaded === true, { timeout: 10000 });

  console.log('Images loaded into DOM! Running 100 rapid screenshot test...');
  for (let i = 0; i < 100; i++) {
    await page.evaluate((t) => window.renderFrame(t), i * 0.1);
    await page.screenshot({ type: 'jpeg', quality: 80 });
    if (i % 25 === 0) process.stdout.write('.');
  }
  console.log('\n✅ 100 frame memory test passed without a hitch!');
  await browser.close();
  fs.unlinkSync(tmpPath);
})().catch(console.error);
