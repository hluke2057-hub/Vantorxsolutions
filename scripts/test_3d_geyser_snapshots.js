// scripts/test_3d_geyser_snapshots.js
// Verify 3D scenes, character rigs, lighting, and camera setups for "The $14,000 Midnight Geyser"

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
    body { margin: 0; background: #050508; overflow: hidden; width: 1080px; height: 1920px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
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
    renderer.toneMappingExposure = 1.15;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const overlayCanvas = document.getElementById('overlay');
    const overlayCtx = overlayCanvas.getContext('2d');

    // SCENES & CAMERAS
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060814);
    scene.fog = new THREE.FogExp2(0x060814, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    // ==========================================
    // 3D LIGHTING RIG
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x182035, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 10, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00d4ff, 2.2);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xff9944, 2.0, 15);
    warmFill.position.set(2, 3, 2);
    scene.add(warmFill);

    // ==========================================
    // 3D PROCEDURAL CHARACTER GENERATOR
    // ==========================================
    function createCharacter(type) {
      const group = new THREE.Group();

      // Materials
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.5, metalness: 0.05 });
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const mouthMat = new THREE.MeshBasicMaterial({ color: 0x661111 });

      let clothMat;
      if (type === 'homeowner') {
        clothMat = new THREE.MeshStandardMaterial({ color: 0x1a2b4c, roughness: 0.3, metalness: 0.2 }); // Navy silk
      } else if (type === 'plumber') {
        clothMat = new THREE.MeshStandardMaterial({ color: 0x243b55, roughness: 0.7, metalness: 0.1 }); // Work shirt
      } else {
        clothMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 }); // Cyber armor
      }

      // Head
      const headGeo = new THREE.SphereGeometry(0.38, 32, 32);
      headGeo.scale(1, 1.15, 1);
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.y = 1.9;
      head.castShadow = true;
      group.add(head);

      // Hair
      const hairMat = new THREE.MeshStandardMaterial({ 
        color: type === 'plumber' ? 0x4a3728 : (type === 'homeowner' ? 0x221a15 : 0x00f0ff),
        roughness: 0.8 
      });
      const hairGeo = new THREE.SphereGeometry(0.40, 24, 24);
      hairGeo.scale(1.02, 0.75, 1.05);
      const hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.set(0, 2.1, -0.05);
      group.add(hair);

      // Eyes
      [-0.12, 0.12].forEach(x => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeMat);
        eye.position.set(x, 1.95, 0.32);
        group.add(eye);

        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), pupilMat);
        pupil.position.set(x, 1.95, 0.38);
        group.add(pupil);
      });

      // Mouth (Open in Shock or Speaking)
      const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16), mouthMat);
      mouth.rotation.x = Math.PI / 2;
      mouth.position.set(0, 1.76, 0.35);
      group.add(mouth);

      // Torso / Jacket
      const torsoGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.85, 24);
      const torso = new THREE.Mesh(torsoGeo, clothMat);
      torso.position.y = 1.25;
      torso.castShadow = true;
      group.add(torso);

      // Orange Safety Vest if plumber
      if (type === 'plumber') {
        const vestGeo = new THREE.CylinderGeometry(0.34, 0.30, 0.7, 24);
        const vestMat = new THREE.MeshStandardMaterial({ color: 0xff5500, roughness: 0.4 });
        const vest = new THREE.Mesh(vestGeo, vestMat);
        vest.position.y = 1.3;
        group.add(vest);
      }

      // Cyber Visor if AVA
      if (type === 'ava') {
        const visorGeo = new THREE.TorusGeometry(0.38, 0.04, 16, 32, Math.PI * 0.8);
        const visorMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const visor = new THREE.Mesh(visorGeo, visorMat);
        visor.rotation.x = Math.PI / 2;
        visor.position.set(0, 1.96, 0.15);
        group.add(visor);
      }

      // Arms & Hands
      const armMat = skinMat;
      const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.65, 16);

      const leftArm = new THREE.Mesh(armGeo, clothMat);
      leftArm.position.set(-0.42, 1.2, 0);
      group.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, clothMat);
      rightArm.position.set(0.42, 1.2, 0);
      group.add(rightArm);

      // Legs
      const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.85, 16);
      const pantsMat = new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.8 });

      const leftLeg = new THREE.Mesh(legGeo, pantsMat);
      leftLeg.position.set(-0.16, 0.42, 0);
      leftLeg.castShadow = true;
      group.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, pantsMat);
      rightLeg.position.set(0.16, 0.42, 0);
      rightLeg.castShadow = true;
      group.add(rightLeg);

      return { group, head, leftArm, rightArm, mouth };
    }

    // ==========================================
    // 3D PROPS & SETS
    // ==========================================

    // Polished Floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x101522, 
      roughness: 0.15, 
      metalness: 0.5 
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Act 1: Exploding Copper Pipe
    const pipeGroup = new THREE.Group();
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.95, roughness: 0.18 });
    const brassJointMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.25 });

    const pipeMain = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.0, 24), pipeMat);
    pipeMain.rotation.z = Math.PI / 2;
    pipeGroup.add(pipeMain);

    const pipeElbow = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.09, 16, 32, Math.PI / 2), brassJointMat);
    pipeElbow.position.set(1.8, 0.2, 0);
    pipeGroup.add(pipeElbow);

    pipeGroup.position.set(0, 3.2, -1.0);
    scene.add(pipeGroup);

    // Water Spray Particle System (350 droplets)
    const waterParticleCount = 350;
    const waterGeo = new THREE.BufferGeometry();
    const waterPositions = new Float32Array(waterParticleCount * 3);
    const waterVelocities = [];

    for (let i = 0; i < waterParticleCount; i++) {
      waterPositions[i * 3 + 0] = (Math.random() - 0.5) * 0.1;
      waterPositions[i * 3 + 1] = 3.2;
      waterPositions[i * 3 + 2] = -1.0 + (Math.random() - 0.5) * 0.1;
      waterVelocities.push({
        x: (Math.random() - 0.5) * 1.8,
        y: -Math.random() * 4.5 - 1.5,
        z: Math.random() * 2.5 + 0.5
      });
    }
    waterGeo.setAttribute('position', new THREE.BufferAttribute(waterPositions, 3));
    const waterMat = new THREE.PointsMaterial({
      color: 0x88ddff,
      size: 0.08,
      transparent: true,
      opacity: 0.85
    });
    const waterSystem = new THREE.Points(waterGeo, waterMat);
    scene.add(waterSystem);

    // Act 3 Bed & Nightstand Props
    const bedGroup = new THREE.Group();
    const bedFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.6, 2.8),
      new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.7 })
    );
    bedFrame.position.set(-0.8, 0.3, -0.5);
    bedGroup.add(bedFrame);

    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.4, 2.6),
      new THREE.MeshStandardMaterial({ color: 0xeef2f7, roughness: 0.9 })
    );
    mattress.position.set(-0.8, 0.65, -0.5);
    bedGroup.add(mattress);

    const nightstand = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x2a1c14, roughness: 0.6 })
    );
    nightstand.position.set(0.9, 0.4, -0.5);
    bedGroup.add(nightstand);

    // Lamp
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 16), brassJointMat);
    lampStem.position.set(0.9, 0.95, -0.5);
    bedGroup.add(lampStem);
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.3, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0xfff5e6, roughness: 0.4, transparent: true, opacity: 0.9 }));
    lampShade.position.set(0.9, 1.25, -0.5);
    bedGroup.add(lampShade);

    bedGroup.position.set(0, 0, 10); // Placed in bedroom scene offset
    scene.add(bedGroup);

    // Characters Instances
    const homeowner = createCharacter('homeowner');
    homeowner.group.position.set(0, 0, 0);
    scene.add(homeowner.group);

    const plumber = createCharacter('plumber');
    plumber.group.position.set(-0.6, 0.65, 9.8);
    plumber.group.rotation.x = Math.PI / 2; // Lying in bed
    scene.add(plumber.group);

    const ava = createCharacter('ava');
    ava.group.position.set(0, 0, 20); // Placed in AVA cyber zone
    scene.add(ava.group);

    // Floating 3D Smartphone Model
    const phoneGroup = new THREE.Group();
    const phoneBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.96, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9, roughness: 0.2 })
    );
    phoneGroup.add(phoneBody);

    const phoneScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.44, 0.92),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    phoneScreen.position.z = 0.022;
    phoneGroup.add(phoneScreen);
    scene.add(phoneGroup);

    // ==========================================
    // RENDER FUNCTION FOR SNAPSHOTS & ANIMATION
    // ==========================================
    window.renderActSnapshot = function(actIndex) {
      overlayCtx.clearRect(0, 0, width, height);

      if (actIndex === 1) {
        // ACT 1: HOOK - GEEYSER EXPLOSION & PANICKED HOMEOWNER
        camera.position.set(0, 1.8, 3.4);
        camera.lookAt(0, 2.4, -0.5);

        // Homeowner pose (hands on cheeks, head back, mouth wide)
        homeowner.group.position.set(0, 0, 0.3);
        homeowner.leftArm.position.set(-0.35, 1.85, 0.2);
        homeowner.leftArm.rotation.set(-0.4, 0, 1.2);
        homeowner.rightArm.position.set(0.35, 1.85, 0.2);
        homeowner.rightArm.rotation.set(-0.4, 0, -1.2);
        homeowner.head.rotation.x = -0.25;

        phoneGroup.position.set(0, -10, 0); // Hide phone

        renderer.render(scene, camera);

        // Kinetic Overlay Title
        overlayCtx.fillStyle = '#ff2a5f';
        overlayCtx.font = '900 68px -apple-system, sans-serif';
        overlayCtx.textAlign = 'center';
        overlayCtx.shadowColor = 'rgba(255, 42, 95, 0.8)';
        overlayCtx.shadowBlur = 30;
        overlayCtx.fillText('2:14 AM EMERGENCY', width / 2, 280);

        overlayCtx.fillStyle = '#ffffff';
        overlayCtx.font = '900 86px -apple-system, sans-serif';
        overlayCtx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        overlayCtx.shadowBlur = 20;
        overlayCtx.fillText('$14,000 PIPE BURST', width / 2, 380);

        overlayCtx.font = '800 48px -apple-system, sans-serif';
        overlayCtx.fillStyle = '#00f0ff';
        overlayCtx.fillText('WHO ANSWERS THE 1ST RING?', width / 2, 450);
      }
      else if (actIndex === 2) {
        // ACT 2: HOMEOWNER DIALING TOP CONTRACTOR
        camera.position.set(0.4, 1.6, 1.8);
        camera.lookAt(0, 1.7, 0);

        homeowner.leftArm.position.set(-0.25, 1.45, 0.35);
        homeowner.leftArm.rotation.set(-0.6, 0.4, 0.3);
        homeowner.rightArm.position.set(0.1, 1.45, 0.4);
        homeowner.rightArm.rotation.set(-0.8, -0.4, -0.2);

        phoneGroup.position.set(0.05, 1.48, 0.55);
        phoneGroup.rotation.set(-0.3, 0.2, 0);

        renderer.render(scene, camera);

        // UI Call HUD
        overlayCtx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        overlayCtx.roundRect(width / 2 - 380, 220, 760, 220, 32);
        overlayCtx.fill();
        overlayCtx.strokeStyle = '#00f0ff';
        overlayCtx.lineWidth = 4;
        overlayCtx.stroke();

        overlayCtx.fillStyle = '#94a3b8';
        overlayCtx.font = '700 36px -apple-system, sans-serif';
        overlayCtx.textAlign = 'center';
        overlayCtx.fillText('DIALING TOP LOCAL CONTRACTOR...', width / 2, 290);

        overlayCtx.fillStyle = '#ffffff';
        overlayCtx.font = '900 62px -apple-system, sans-serif';
        overlayCtx.fillText("FRANK'S 24/7 PLUMBING", width / 2, 370);
      }
      else if (actIndex === 3) {
        // ACT 3: FRANK ASLEEP & PHONE TUMBLING TO VOICEMAIL
        camera.position.set(1.2, 1.6, 11.8);
        camera.lookAt(0.2, 0.8, 9.8);

        phoneGroup.position.set(0.85, 0.95, 9.5);
        phoneGroup.rotation.set(0.4, -0.3, 0.6);

        renderer.render(scene, camera);

        // Voicemail Tombstone Alert
        overlayCtx.fillStyle = '#ef4444';
        overlayCtx.font = '900 72px -apple-system, sans-serif';
        overlayCtx.textAlign = 'center';
        overlayCtx.shadowColor = 'rgba(239, 68, 68, 0.8)';
        overlayCtx.shadowBlur = 25;
        overlayCtx.fillText('MISSED CALL ➔ VOICEMAIL', width / 2, 280);

        overlayCtx.fillStyle = '#ffffff';
        overlayCtx.font = '800 46px -apple-system, sans-serif';
        overlayCtx.fillText('CONTRACTORS LOSE JOBS TO SLEEP', width / 2, 360);

        overlayCtx.fillStyle = '#f59e0b';
        overlayCtx.font = '900 64px -apple-system, sans-serif';
        overlayCtx.fillText('-$14,000 LOST TO COMPETITOR', width / 2, 440);
      }
      else if (actIndex === 4) {
        // ACT 4: AVA 3D AI COMMAND CENTER
        camera.position.set(0, 1.7, 22.8);
        camera.lookAt(0, 1.6, 20);

        ava.group.position.set(0, 0, 20);
        phoneGroup.position.set(0, -10, 0);

        renderer.render(scene, camera);

        // AVA Command Center HUD
        overlayCtx.fillStyle = 'rgba(10, 15, 30, 0.85)';
        overlayCtx.roundRect(width / 2 - 420, 220, 840, 280, 36);
        overlayCtx.fill();
        overlayCtx.strokeStyle = '#00f0ff';
        overlayCtx.lineWidth = 5;
        overlayCtx.stroke();

        overlayCtx.fillStyle = '#00f0ff';
        overlayCtx.font = '900 42px -apple-system, sans-serif';
        overlayCtx.textAlign = 'center';
        overlayCtx.fillText('⚡ MEET AVA: 24/7 VOICE AI', width / 2, 290);

        overlayCtx.fillStyle = '#10b981';
        overlayCtx.font = '900 64px -apple-system, sans-serif';
        overlayCtx.fillText('ANSWERED IN 0.8 SECONDS', width / 2, 370);

        overlayCtx.fillStyle = '#ffffff';
        overlayCtx.font = '700 38px -apple-system, sans-serif';
        overlayCtx.fillText('QUALIFIED • BOOKED • DISPATCHED', width / 2, 440);
      }
      else if (actIndex === 5) {
        // ACT 5 & 6: MORNING PAYOFF & LIVE CTA
        camera.position.set(0, 1.4, 2.2);
        camera.lookAt(0, 1.3, 0);

        // Big Hero Phone Display
        phoneGroup.position.set(0, 1.25, 0.6);
        phoneGroup.rotation.set(-0.05, 0, 0);
        phoneGroup.scale.set(1.5, 1.5, 1.5);

        renderer.render(scene, camera);

        // Call CTA Box
        overlayCtx.fillStyle = '#00f0ff';
        overlayCtx.font = '900 44px -apple-system, sans-serif';
        overlayCtx.textAlign = 'center';
        overlayCtx.shadowColor = '#00f0ff';
        overlayCtx.shadowBlur = 20;
        overlayCtx.fillText('TEST AVA LIVE RIGHT NOW', width / 2, 280);

        overlayCtx.fillStyle = '#ffffff';
        overlayCtx.font = '900 86px -apple-system, sans-serif';
        overlayCtx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        overlayCtx.shadowBlur = 25;
        overlayCtx.fillText('(561) 813-8602', width / 2, 380);

        overlayCtx.fillStyle = '#10b981';
        overlayCtx.font = '900 52px -apple-system, sans-serif';
        overlayCtx.fillText('OR COMMENT "AVA" BELOW', width / 2, 460);
      }
      return true;
    };
  </script>
</body>
</html>`;

(async () => {
  console.log('Testing 3D Geyser Scene snapshots in Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=angle',
      '--use-angle=d3d11',
      '--window-size=1080,1920'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.setContent(html);

  for (let act = 1; act <= 5; act++) {
    await page.evaluate((a) => window.renderActSnapshot(a), act);
    const snapPath = path.join(root, `website/demo/video/preview_geyser_act${act}.jpg`);
    await page.screenshot({ path: snapPath, type: 'jpeg', quality: 90 });
    console.log(`Saved snapshot Act ${act}: ${snapPath}`);
  }

  await browser.close();
  console.log('All 5 3D Snapshots rendered successfully!');
})().catch(err => {
  console.error('Snapshot test failed:', err);
  process.exit(1);
});
