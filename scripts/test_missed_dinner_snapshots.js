// scripts/test_missed_dinner_snapshots.js
// Visual verification of the 5 scenes for "The Missed Dinner"

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const threeCode = fs.readFileSync(path.join(root, 'website/demo/js/three.min.js'), 'utf8');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #08090d; overflow: hidden; width: 1080px; height: 1920px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    #canvas-container { position: absolute; top: 0; left: 0; width: 1080px; height: 1920px; }
    #overlay { position: absolute; top: 0; left: 0; width: 1080px; height: 1920px; pointer-events: none; }
  </style>
  <script>${threeCode}</script>
</head>
<body>
  <div id="canvas-container"></div>
  <canvas id="overlay" width="1080" height="1920"></canvas>
  <script>
    const width = 1080;
    const height = 1920;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const overlayCanvas = document.getElementById('overlay');
    const ctx2d = overlayCanvas.getContext('2d');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c14);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);

    // ==========================================
    // WARM DINING ROOM LIGHTING RIG
    // ==========================================
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0x221a28, 1.2);
    scene.add(ambientLight);

    // Warm overhead dining pendant light (amber warmth)
    const pendantLight = new THREE.PointLight(0xffb366, 2.8, 12, 1.5);
    pendantLight.position.set(0, 3.2, 0);
    pendantLight.castShadow = true;
    scene.add(pendantLight);

    // Candle point light (intimate warm glow on the table)
    const candleLight = new THREE.PointLight(0xff7722, 1.8, 4, 2);
    candleLight.position.set(0, 1.18, 0);
    scene.add(candleLight);

    // Soft cool rim light from dining room window
    const windowRim = new THREE.DirectionalLight(0x406090, 1.4);
    windowRim.position.set(-5, 4, -4);
    scene.add(windowRim);

    // ==========================================
    // ENVIRONMENT: DINING ROOM & WOOD TABLE
    // ==========================================
    // Walnut Table
    const tableTop = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 0.08, 48),
      new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.35, metalness: 0.15 })
    );
    tableTop.position.set(0, 0.96, 0);
    tableTop.receiveShadow = true;
    scene.add(tableTop);

    // Table Base Pedestal
    const tableBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.45, 0.96, 24),
      new THREE.MeshStandardMaterial({ color: 0x241712, roughness: 0.6 })
    );
    tableBase.position.set(0, 0.48, 0);
    scene.add(tableBase);

    // Hardwood Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x18120e, roughness: 0.6, metalness: 0.1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Dining Room Back Wall (Soft warm wallpaper)
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 10),
      new THREE.MeshStandardMaterial({ color: 0x1a1520, roughness: 0.9 })
    );
    backWall.position.set(0, 5, -5);
    scene.add(backWall);

    // ==========================================
    // PROPS: CUPCAKE & CANDLE
    // ==========================================
    const cupcakeGroup = new THREE.Group();

    // Cupcake Base (paper liner)
    const liner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.10, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.8 })
    );
    cupcakeGroup.add(liner);

    // Chocolate Icing Swirl
    const icing = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x3d2116, roughness: 0.4 })
    );
    icing.position.y = 0.08;
    cupcakeGroup.add(icing);

    // Candle
    const candleStick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.18, 16),
      new THREE.MeshStandardMaterial({ color: 0xff6699, roughness: 0.3 })
    );
    candleStick.position.y = 0.22;
    cupcakeGroup.add(candleStick);

    // Flame
    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffcc33 })
    );
    flame.scale.set(0.7, 1.8, 0.7);
    flame.position.y = 0.34;
    cupcakeGroup.add(flame);

    cupcakeGroup.position.set(0, 1.0, 0);
    scene.add(cupcakeGroup);

    // ==========================================
    // PROP: MARCUS'S WORK SMARTPHONE
    // ==========================================
    const phoneGroup = new THREE.Group();
    const phoneBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.018, 0.52),
      new THREE.MeshStandardMaterial({ color: 0x1c1d22, metalness: 0.9, roughness: 0.2 })
    );
    phoneGroup.add(phoneBody);

    const phoneScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.49),
      new THREE.MeshBasicMaterial({ color: 0x111625 })
    );
    phoneScreen.rotation.x = -Math.PI / 2;
    phoneScreen.position.y = 0.01;
    phoneGroup.add(phoneScreen);

    // Screen Glow Light (casts realistic glow on table wood)
    const phoneGlow = new THREE.PointLight(0x00f0ff, 0.0, 1.2);
    phoneGlow.position.set(0, 0.08, 0);
    phoneGroup.add(phoneGlow);

    phoneGroup.position.set(0.42, 1.01, 0.45);
    phoneGroup.rotation.y = -0.25;
    scene.add(phoneGroup);

    // ==========================================
    // CHARACTERS: MARCUS (DAD) & LILY (DAUGHTER)
    // ==========================================
    function createMarcus() {
      const g = new THREE.Group();
      const skin = new THREE.MeshStandardMaterial({ color: 0xdfab8c, roughness: 0.55 });
      const shirt = new THREE.MeshStandardMaterial({ color: 0x1b2838, roughness: 0.7 }); // Navy work shirt
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x2c1f18, roughness: 0.8 });

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), skin);
      head.scale.set(0.95, 1.15, 0.95);
      head.position.y = 1.95;
      g.add(head);

      // Hair
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.29, 20, 20), hairMat);
      hair.scale.set(0.98, 0.7, 1.0);
      hair.position.set(0, 2.12, -0.04);
      g.add(hair);

      // Eyes
      [-0.09, 0.09].forEach(x => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        eye.position.set(x, 1.98, 0.24);
        g.add(eye);
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), new THREE.MeshBasicMaterial({ color: 0x221100 }));
        pupil.position.set(x, 1.98, 0.27);
        g.add(pupil);
      });

      // Torso in work shirt
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.25, 0.8, 20), shirt);
      torso.position.y = 1.35;
      g.add(torso);

      // Shoulders & Arms resting on table
      const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.6, 16), shirt);
      leftArm.position.set(-0.35, 1.3, 0.2);
      leftArm.rotation.set(0.8, 0, 0.3);
      g.add(leftArm);

      const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.6, 16), shirt);
      rightArm.position.set(0.35, 1.3, 0.2);
      rightArm.rotation.set(0.8, 0, -0.3);
      g.add(rightArm);

      g.position.set(0, 0, 1.15); // Sitting across table
      g.rotation.y = Math.PI; // Facing into table
      return { group: g, head, leftArm, rightArm, torso };
    }

    function createLily() {
      const g = new THREE.Group();
      const skin = new THREE.MeshStandardMaterial({ color: 0xf2c4a8, roughness: 0.5 });
      const sweater = new THREE.MeshStandardMaterial({ color: 0xd9597b, roughness: 0.8 }); // Pink sweater
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x4a2a18, roughness: 0.8 });

      // Child Head (slightly rounder)
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), skin);
      head.position.y = 1.55;
      g.add(head);

      // Pigtails Hair
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.23, 20, 20), hairMat);
      hair.scale.set(1.02, 0.8, 1.05);
      hair.position.set(0, 1.68, -0.04);
      g.add(hair);

      // Two side pigtails
      [-0.24, 0.24].forEach(x => {
        const pt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.3, 12), hairMat);
        pt.position.set(x, 1.5, -0.1);
        pt.rotation.z = x > 0 ? -0.4 : 0.4;
        g.add(pt);
      });

      // Eyes
      [-0.07, 0.07].forEach(x => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        eye.position.set(x, 1.57, 0.19);
        g.add(eye);
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), new THREE.MeshBasicMaterial({ color: 0x1a0f05 }));
        pupil.position.set(x, 1.57, 0.22);
        g.add(pupil);
      });

      // Torso in pink sweater
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.18, 0.6, 20), sweater);
      torso.position.y = 1.15;
      g.add(torso);

      g.position.set(0, 0, -1.05); // Sitting opposite Marcus
      return { group: g, head, flame };
    }

    const marcus = createMarcus();
    scene.add(marcus.group);

    const lily = createLily();
    scene.add(lily.group);

    // ==========================================
    // RENDER ACT SNAPSHOT
    // ==========================================
    window.renderSceneSnapshot = function(sceneNum) {
      if (sceneNum === 1) {
        // SCENE 1: THE BIRTHDAY MOMENT (Intimate push past Marcus to Lily & Cupcake)
        camera.position.set(0.35, 1.5, 0.95);
        camera.lookAt(0, 1.25, -0.8);

        phoneGlow.intensity = 0;
        phoneScreen.material.color.setHex(0x111625);
        flame.visible = true;
        candleLight.intensity = 1.8;

        renderer.render(scene, camera);

        ctx2d.clearRect(0, 0, width, height);
        ctx2d.drawImage(renderer.domElement, 0, 0);

        // Warm, tasteful story title
        ctx2d.fillStyle = 'rgba(255, 230, 200, 0.95)';
        ctx2d.font = '800 52px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.fillText('14 HOURS ON ROOFS TODAY', width / 2, 280);

        ctx2d.fillStyle = 'rgba(255, 180, 100, 0.9)';
        ctx2d.font = '700 40px -apple-system, sans-serif';
        ctx2d.fillText('JUST TO BE HOME FOR THIS MOMENT', width / 2, 345);
      }
      else if (sceneNum === 2) {
        // SCENE 2: THE DILEMMA (Phone lights up on the table, emergency call)
        camera.position.set(0.48, 1.35, 0.65);
        camera.lookAt(0.42, 1.01, 0.45);

        phoneGlow.intensity = 2.2;
        phoneScreen.material.color.setHex(0x00f0ff);
        flame.visible = true;

        renderer.render(scene, camera);

        ctx2d.clearRect(0, 0, width, height);
        ctx2d.drawImage(renderer.domElement, 0, 0);

        // Clean Incoming Call Banner
        ctx2d.fillStyle = 'rgba(12, 17, 28, 0.9)';
        ctx2d.roundRect(width / 2 - 380, 230, 760, 210, 28);
        ctx2d.fill();
        ctx2d.strokeStyle = 'rgba(0, 240, 255, 0.6)';
        ctx2d.lineWidth = 3;
        ctx2d.stroke();

        ctx2d.fillStyle = '#ef4444';
        ctx2d.font = '800 34px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.fillText('INCOMING EMERGENCY CALL', width / 2, 290);

        ctx2d.fillStyle = '#ffffff';
        ctx2d.font = '900 56px -apple-system, sans-serif';
        ctx2d.fillText('$8,000 ROOFTOP REPLACEMENT', width / 2, 360);

        ctx2d.fillStyle = '#94a3b8';
        ctx2d.font = '600 30px -apple-system, sans-serif';
        ctx2d.fillText('ANSWER AND LEAVE? OR IGNORE AND LOSE IT?', width / 2, 410);
      }
      else if (sceneNum === 3) {
        // SCENE 3: THE SILENT ASSISTANT (AVA answers in 0.8s, Lily blows candle)
        camera.position.set(0.38, 1.28, 0.58);
        camera.lookAt(0.35, 1.05, 0.35);

        phoneGlow.intensity = 1.8;
        phoneScreen.material.color.setHex(0x10b981);
        flame.visible = false; // Candle blown out!
        candleLight.intensity = 0.3;

        renderer.render(scene, camera);

        ctx2d.clearRect(0, 0, width, height);
        ctx2d.drawImage(renderer.domElement, 0, 0);

        // AVA Connected Pill
        ctx2d.fillStyle = 'rgba(10, 16, 26, 0.9)';
        ctx2d.roundRect(width / 2 - 380, 230, 760, 200, 28);
        ctx2d.fill();
        ctx2d.strokeStyle = 'rgba(16, 185, 129, 0.7)';
        ctx2d.lineWidth = 3;
        ctx2d.stroke();

        ctx2d.fillStyle = '#10b981';
        ctx2d.font = '800 34px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.fillText('⚡ AVA CONNECTED (0.8s)', width / 2, 290);

        ctx2d.fillStyle = '#ffffff';
        ctx2d.font = '900 52px -apple-system, sans-serif';
        ctx2d.fillText('HANDLING CALL WITH EMPATHY', width / 2, 355);

        ctx2d.fillStyle = '#38bdf8';
        ctx2d.font = '700 32px -apple-system, sans-serif';
        ctx2d.fillText('MARCUS NEVER LEFT THE TABLE', width / 2, 405);
      }
      else if (sceneNum === 4) {
        // SCENE 4: THE CONFIRMATION (Tilt up to Marcus's relief)
        camera.position.set(0, 1.5, 0.2);
        camera.lookAt(0, 1.7, 1.15); // Looking up at Marcus

        marcus.head.rotation.x = -0.15; // Looking down at table warmly

        renderer.render(scene, camera);

        ctx2d.clearRect(0, 0, width, height);
        ctx2d.drawImage(renderer.domElement, 0, 0);

        // Confirmation Card
        ctx2d.fillStyle = 'rgba(10, 18, 30, 0.9)';
        ctx2d.roundRect(width / 2 - 380, 240, 760, 190, 28);
        ctx2d.fill();
        ctx2d.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx2d.lineWidth = 3;
        ctx2d.stroke();

        ctx2d.fillStyle = '#38bdf8';
        ctx2d.font = '800 32px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.fillText('JOB DISPATCHED • $8,000 SECURED', width / 2, 300);

        ctx2d.fillStyle = '#ffffff';
        ctx2d.font = '900 54px -apple-system, sans-serif';
        ctx2d.fillText('YOU NEVER LEFT THE TABLE', width / 2, 370);
      }
      else if (sceneNum === 5) {
        // SCENE 5: THE CLEAN LIVE CTA
        camera.position.set(0, 1.4, 0.1);
        camera.lookAt(0, 1.3, -1.0);

        renderer.render(scene, camera);

        ctx2d.clearRect(0, 0, width, height);
        // Soft dark blur over the room
        ctx2d.fillStyle = 'rgba(8, 11, 20, 0.88)';
        ctx2d.fillRect(0, 0, width, height);

        // Elegant minimal card
        ctx2d.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx2d.roundRect(width / 2 - 420, height / 2 - 280, 840, 560, 36);
        ctx2d.fill();
        ctx2d.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx2d.lineWidth = 2;
        ctx2d.stroke();

        ctx2d.fillStyle = '#38bdf8';
        ctx2d.font = '800 38px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.fillText('TEST AVA LIVE RIGHT NOW', width / 2, height / 2 - 180);

        ctx2d.fillStyle = '#ffffff';
        ctx2d.font = '900 84px -apple-system, sans-serif';
        ctx2d.fillText('(561) 813-8602', width / 2, height / 2 - 70);

        ctx2d.fillStyle = '#94a3b8';
        ctx2d.font = '600 34px -apple-system, sans-serif';
        ctx2d.fillText('Answers in 0.8s • Books slots • Dispatches to you', width / 2, height / 2 + 10);

        // Button pill
        ctx2d.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx2d.roundRect(width / 2 - 320, height / 2 + 70, 640, 100, 24);
        ctx2d.fill();
        ctx2d.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx2d.lineWidth = 2;
        ctx2d.stroke();

        ctx2d.fillStyle = '#38bdf8';
        ctx2d.font = '800 42px -apple-system, sans-serif';
        ctx2d.fillText('COMMENT "AVA" BELOW', width / 2, height / 2 + 135);
      }
      return true;
    };
  </script>
</body>
</html>`;

(async () => {
  console.log('Rendering 5 Scene Snapshots for "The Missed Dinner"...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=d3d11', '--window-size=1080,1920']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.setContent(html);

  for (let s = 1; s <= 5; s++) {
    await page.evaluate((n) => window.renderSceneSnapshot(n), s);
    const snapPath = path.join(root, `website/demo/video/preview_dinner_scene${s}.jpg`);
    await page.screenshot({ path: snapPath, type: 'jpeg', quality: 90 });
    console.log(`Saved snapshot Scene ${s}: ${snapPath}`);
  }

  await browser.close();
  console.log('All 5 Missed Dinner snapshots saved successfully!');
})().catch(err => {
  console.error('Snapshot test failed:', err);
  process.exit(1);
});
