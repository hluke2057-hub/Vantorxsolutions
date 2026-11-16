// scripts/test_three_render.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const threePath = path.join(root, 'node_modules/three/build/three.min.js');
const threeCode = fs.readFileSync(threePath, 'utf8');

const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background: #000; overflow: hidden; width: 1080px; height: 1920px; }
    canvas { width: 1080px; height: 1920px; }
  </style>
  <script>${threeCode}</script>
</head>
<body>
  <div id="container"></div>
  <script>
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1080 / 1920, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Try WebGLRenderer with preserveDrawingBuffer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setSize(1080, 1920);
      document.getElementById('container').appendChild(renderer.domElement);
    } catch(e) {
      console.error('WebGL failed:', e.message);
    }

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.2, metalness: 0.8 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x222244, 1));

    window.renderFrame = function(t) {
      cube.rotation.x = t;
      cube.rotation.y = t * 1.5;
      renderer.render(scene, camera);
    };
  </script>
</body>
</html>`;

const tmpHtml = path.join(root, 'scripts/tmp_three_test.html');
fs.writeFileSync(tmpHtml, html, 'utf8');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=d3d11', '--enable-webgl']
  });

  const page = await browser.newPage();
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  page.on('console', msg => console.log('LOG:', msg.text()));
  await page.setViewport({ width: 1080, height: 1920 });
  await page.goto('file:///' + tmpHtml.replace(/\\/g, '/'), { waitUntil: 'load' });

  await page.evaluate(() => window.renderFrame(1.0));
  const shotPath = path.join(root, 'website/demo/video/test_three_shot.jpg');
  await page.screenshot({ path: shotPath, quality: 90 });
  console.log('Saved test three shot:', shotPath);

  await browser.close();
  fs.unlinkSync(tmpHtml);
})().catch(console.error);
