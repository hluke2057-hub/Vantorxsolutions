// scripts/render_3d_geyser_reel.js
// ELITE 3D VIRAL REELS CREATION ENGINE
// Reel #3: "The $14,000 Midnight Geyser" (41.5s, 1080x1920 9:16 Vertical @ 30 FPS)
// Full 3D Characters, PBR Materials, Dynamic Camera Splines, Water Particle Physics, Layered Hollywood Audio Master

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');
const { spawn } = require('child_process');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const audioWavPath = path.join(root, 'website/demo/audio/geyser-master.wav');
const tsJsonPath = path.join(root, 'website/demo/audio/geyser-timestamps.json');
const outVideoPath = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const threeCode = fs.readFileSync(path.join(root, 'website/demo/js/three.min.js'), 'utf8');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const FPS = 30;
const DURATION_SEC = Number(tsData.duration || 41.378) + 0.5; // ~41.9s
const TOTAL_FRAMES = Math.ceil(DURATION_SEC * FPS);

console.log(`Starting Elite 3D Reel Render: ${DURATION_SEC.toFixed(2)}s (${TOTAL_FRAMES} frames @ ${FPS} FPS)`);

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
    const wordTimestamps = ${JSON.stringify(tsData.words)};

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const overlayCanvas = document.getElementById('overlay');
    const ctx2d = overlayCanvas.getContext('2d');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060814);
    scene.fog = new THREE.FogExp2(0x060814, 0.032);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);

    // ==========================================
    // LIGHTING RIG
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x182035, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 10, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00d4ff, 2.5);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xff9944, 2.2, 18);
    warmFill.position.set(2, 3, 2);
    scene.add(warmFill);

    // ==========================================
    // CHARACTER FACTORY
    // ==========================================
    function createCharacter(type) {
      const group = new THREE.Group();
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.5, metalness: 0.05 });
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const mouthMat = new THREE.MeshBasicMaterial({ color: 0x661111 });

      let clothMat;
      if (type === 'homeowner') {
        clothMat = new THREE.MeshStandardMaterial({ color: 0x1a2b4c, roughness: 0.3, metalness: 0.2 });
      } else if (type === 'plumber') {
        clothMat = new THREE.MeshStandardMaterial({ color: 0x243b55, roughness: 0.7, metalness: 0.1 });
      } else {
        clothMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
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
      const eyes = [];
      [-0.12, 0.12].forEach(x => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeMat);
        eye.position.set(x, 1.95, 0.32);
        group.add(eye);
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), pupilMat);
        pupil.position.set(x, 1.95, 0.38);
        group.add(pupil);
        eyes.push(eye);
      });

      // Mouth
      const mouthGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16);
      const mouth = new THREE.Mesh(mouthGeo, mouthMat);
      mouth.rotation.x = Math.PI / 2;
      mouth.position.set(0, 1.76, 0.35);
      group.add(mouth);

      // Torso
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.85, 24), clothMat);
      torso.position.y = 1.25;
      torso.castShadow = true;
      group.add(torso);

      if (type === 'plumber') {
        const vest = new THREE.Mesh(
          new THREE.CylinderGeometry(0.34, 0.30, 0.7, 24),
          new THREE.MeshStandardMaterial({ color: 0xff5500, roughness: 0.4 })
        );
        vest.position.y = 1.3;
        group.add(vest);
      }

      if (type === 'ava') {
        const visor = new THREE.Mesh(
          new THREE.TorusGeometry(0.38, 0.04, 16, 32, Math.PI * 0.8),
          new THREE.MeshBasicMaterial({ color: 0x00f0ff })
        );
        visor.rotation.x = Math.PI / 2;
        visor.position.set(0, 1.96, 0.15);
        group.add(visor);
      }

      // Arms
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

      return { group, head, leftArm, rightArm, leftLeg, rightLeg, mouth, eyes, torso };
    }

    // ==========================================
    // PROPS & SCENERY
    // ==========================================
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0x101522, roughness: 0.15, metalness: 0.5 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Exploding Pipe (Act 1)
    const pipeGroup = new THREE.Group();
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.95, roughness: 0.18 });
    const brassJointMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.25 });
    const pipeMain = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.0, 24), pipeMat);
    pipeMain.rotation.z = Math.PI / 2;
    pipeGroup.add(pipeMain);

    const pipeElbow = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.09, 16, 32, Math.PI / 2), brassJointMat);
    pipeElbow.position.set(1.8, 0.2, 0);
    pipeGroup.add(pipeElbow);
    pipeGroup.position.set(0, 3.4, -1.0);
    scene.add(pipeGroup);

    // Water Spray Particle System (400 droplets)
    const waterParticleCount = 400;
    const waterGeo = new THREE.BufferGeometry();
    const waterPositions = new Float32Array(waterParticleCount * 3);
    const waterVelocities = [];

    for (let i = 0; i < waterParticleCount; i++) {
      waterPositions[i * 3 + 0] = (Math.random() - 0.5) * 0.15;
      waterPositions[i * 3 + 1] = 3.4;
      waterPositions[i * 3 + 2] = -1.0 + (Math.random() - 0.5) * 0.15;
      waterVelocities.push({
        x: (Math.random() - 0.5) * 2.2,
        y: -Math.random() * 5.0 - 2.0,
        z: Math.random() * 2.8 + 0.4
      });
    }
    waterGeo.setAttribute('position', new THREE.BufferAttribute(waterPositions, 3));
    const waterMat = new THREE.PointsMaterial({
      color: 0x99eeff,
      size: 0.09,
      transparent: true,
      opacity: 0.9
    });
    const waterSystem = new THREE.Points(waterGeo, waterMat);
    scene.add(waterSystem);

    // Bedroom Props (Act 3)
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

    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 16), brassJointMat);
    lampStem.position.set(0.9, 0.95, -0.5);
    bedGroup.add(lampStem);
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.3, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0xfff5e6, roughness: 0.4, transparent: true, opacity: 0.9 }));
    lampShade.position.set(0.9, 1.25, -0.5);
    bedGroup.add(lampShade);

    bedGroup.position.set(0, 0, 10);
    scene.add(bedGroup);

    // Floating 3D Smartphone Model
    const phoneGroup = new THREE.Group();
    const phoneBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 1.04, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.95, roughness: 0.15 })
    );
    phoneGroup.add(phoneBody);

    const phoneScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.48, 0.98),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    phoneScreen.position.z = 0.022;
    phoneGroup.add(phoneScreen);
    scene.add(phoneGroup);

    // Characters Instances
    const homeowner = createCharacter('homeowner');
    scene.add(homeowner.group);

    const plumber = createCharacter('plumber');
    scene.add(plumber.group);

    const ava = createCharacter('ava');
    ava.group.position.set(0, 0, 20);
    scene.add(ava.group);

    // ==========================================
    // FRAME UPDATE & COMPOSITING ENGINE
    // ==========================================
    window.renderFrameAtTime = function(t) {
      // 1. Water Particles Physics Update
      const pos = waterGeo.attributes.position.array;
      for (let i = 0; i < waterParticleCount; i++) {
        const vel = waterVelocities[i];
        pos[i * 3 + 0] += vel.x * 0.033;
        pos[i * 3 + 1] += vel.y * 0.033;
        pos[i * 3 + 2] += vel.z * 0.033;

        if (pos[i * 3 + 1] < 0.05) {
          pos[i * 3 + 0] = (Math.random() - 0.5) * 0.15;
          pos[i * 3 + 1] = 3.4;
          pos[i * 3 + 2] = -1.0 + (Math.random() - 0.5) * 0.15;
        }
      }
      waterGeo.attributes.position.needsUpdate = true;

      // ------------------------------------------
      // ACT 1: HOOK (0s to 5.5s) - PIPE BURST & HOMEOWNER PANIC
      // ------------------------------------------
      if (t < 5.5) {
        const p = t / 5.5;
        camera.position.set(Math.sin(p * 2.0) * 0.4, 2.6 - p * 0.8, 3.2 - p * 0.6);
        camera.lookAt(0, 2.0, 0);

        homeowner.group.position.set(0, 0, 0.2);
        homeowner.group.rotation.set(0, Math.sin(t * 4.0) * 0.1, 0);
        homeowner.head.rotation.x = -0.3 + Math.sin(t * 8.0) * 0.08;
        homeowner.leftArm.position.set(-0.35, 1.85, 0.2);
        homeowner.leftArm.rotation.set(-0.4 + Math.sin(t * 6.0) * 0.1, 0, 1.2);
        homeowner.rightArm.position.set(0.35, 1.85, 0.2);
        homeowner.rightArm.rotation.set(-0.4 - Math.sin(t * 6.0) * 0.1, 0, -1.2);

        pipeGroup.position.set(0, 3.4, -1.0);
        waterSystem.position.set(0, 0, 0);
        bedGroup.position.set(0, -20, 0);
        plumber.group.position.set(0, -20, 0);
        ava.group.position.set(0, -20, 0);
        phoneGroup.position.set(0, -10, 0);
      }
      // ------------------------------------------
      // ACT 2: DIALING THE TOP CONTRACTOR (5.5s to 9.5s)
      // ------------------------------------------
      else if (t < 9.5) {
        const p = (t - 5.5) / 4.0;
        camera.position.set(0.35, 1.6, 1.7 - p * 0.2);
        camera.lookAt(0, 1.65, 0.2);

        homeowner.group.position.set(0, 0, 0.2);
        homeowner.head.rotation.set(0.2, 0, 0);
        homeowner.leftArm.position.set(-0.25, 1.45, 0.35);
        homeowner.leftArm.rotation.set(-0.6, 0.3, 0.3);
        homeowner.rightArm.position.set(0.12, 1.45, 0.4);
        homeowner.rightArm.rotation.set(-0.8, -0.4, -0.2);

        phoneGroup.position.set(0.06, 1.48, 0.55);
        phoneGroup.rotation.set(-0.35, 0.2, 0);

        pipeGroup.position.set(0, 3.4, -1.0);
        waterSystem.position.set(0, 0, 0);
        bedGroup.position.set(0, -20, 0);
        plumber.group.position.set(0, -20, 0);
        ava.group.position.set(0, -20, 0);
      }
      // ------------------------------------------
      // ACT 3: FRANK ASLEEP & PHONE TUMBLING TO VOICEMAIL (9.5s to 17.5s)
      // ------------------------------------------
      else if (t < 17.5) {
        const p = (t - 9.5) / 8.0;
        camera.position.set(1.3 - p * 0.3, 1.6, 11.8 - p * 0.4);
        camera.lookAt(0.2, 0.8, 9.8);

        homeowner.group.position.set(0, -20, 0);
        pipeGroup.position.set(0, -20, 0);
        waterSystem.position.set(0, -20, 0);
        bedGroup.position.set(0, 0, 10);
        ava.group.position.set(0, -20, 0);

        plumber.group.position.set(-0.6, 0.65 + Math.sin(t * 3.0) * 0.03, 9.8);
        plumber.group.rotation.x = Math.PI / 2;

        let phY = 0.95;
        let phX = 0.85;
        let phRotZ = 0;
        if (t > 11.0 && t < 13.5) {
          phX += Math.sin(t * 40.0) * 0.02;
          phY += Math.cos(t * 40.0) * 0.01;
        } else if (t >= 13.5) {
          const fallProgress = Math.min(1.0, (t - 13.5) / 1.2);
          phY = 0.95 - fallProgress * 0.7;
          phX = 0.85 + fallProgress * 0.3;
          phRotZ = fallProgress * 3.0;
        }
        phoneGroup.position.set(phX, phY, 9.5);
        phoneGroup.rotation.set(0.4, -0.3, phRotZ);
      }
      // ------------------------------------------
      // ACT 3b: COMPETITOR STAMP (17.5s to 25.5s)
      // ------------------------------------------
      else if (t < 25.5) {
        const p = (t - 17.5) / 8.0;
        camera.position.set(0, 1.5, 5.0 - p * 1.5);
        camera.lookAt(0, 1.2, 0);

        homeowner.group.position.set(0, -20, 0);
        plumber.group.position.set(0, -20, 0);
        bedGroup.position.set(0, -20, 0);
        ava.group.position.set(0, -20, 0);
        phoneGroup.position.set(0, -10, 0);
      }
      // ------------------------------------------
      // ACT 4: MEET AVA - 24/7 VOICE AI (25.5s to 34.5s)
      // ------------------------------------------
      else if (t < 34.5) {
        const p = (t - 25.5) / 9.0;
        camera.position.set(Math.sin(p * 3.14) * 0.6, 1.7, 23.0 - p * 0.8);
        camera.lookAt(0, 1.6, 20);

        homeowner.group.position.set(0, -20, 0);
        plumber.group.position.set(0, -20, 0);
        bedGroup.position.set(0, -20, 0);
        phoneGroup.position.set(0, -10, 0);

        ava.group.position.set(0, 0, 20);
        ava.head.rotation.y = Math.sin(t * 3.0) * 0.15;
        ava.mouth.scale.set(1, 1 + Math.sin(t * 12.0) * 0.5, 1);
      }
      // ------------------------------------------
      // ACT 5 & 6: MORNING PAYOFF & LIVE CTA (34.5s to 42.0s)
      // ------------------------------------------
      else {
        const p = (t - 34.5) / 7.5;
        camera.position.set(0, 1.35, 2.1 - p * 0.1);
        camera.lookAt(0, 1.25, 0.5);

        homeowner.group.position.set(0, -20, 0);
        bedGroup.position.set(0, -20, 0);
        ava.group.position.set(0, -20, 0);

        // Plumber Frank standing proud in morning sun
        plumber.group.position.set(0.65, 0, 0.3);
        plumber.group.rotation.set(0, -0.4, 0);
        plumber.head.rotation.set(0, 0, 0);
        plumber.rightArm.position.set(0.35, 1.45, 0.2); // Holding coffee mug
        plumber.rightArm.rotation.set(-0.8, 0, 0);

        // Rotating hero phone
        phoneGroup.position.set(-0.25, 1.22, 0.7);
        phoneGroup.rotation.set(-0.04, Math.sin(t * 2.0) * 0.08, 0);
        phoneGroup.scale.set(1.4, 1.4, 1.4);
      }

      // RENDER THREE.JS WEBGL SCENE
      renderer.render(scene, camera);

      // COMPOSITE THREE.JS CANVAS ONTO 2D OVERLAY CANVAS
      ctx2d.clearRect(0, 0, width, height);
      ctx2d.drawImage(renderer.domElement, 0, 0);

      // DRAW DYNAMIC HUD & TITLES
      if (t < 5.5) {
        ctx2d.fillStyle = '#ff2a5f';
        ctx2d.font = '900 68px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.shadowColor = 'rgba(255, 42, 95, 0.85)';
        ctx2d.shadowBlur = 30;
        ctx2d.fillText('2:14 AM DISASTER', width / 2, 280);

        ctx2d.fillStyle = '#ffffff';
        ctx2d.font = '900 86px -apple-system, sans-serif';
        ctx2d.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx2d.shadowBlur = 25;
        ctx2d.fillText('$14,000 PIPE BURST', width / 2, 380);

        ctx2d.fillStyle = '#00f0ff';
        ctx2d.font = '800 46px -apple-system, sans-serif';
        ctx2d.fillText('WHO GETS THE CHECK?', width / 2, 455);
      } else if (t < 9.5) {
        ctx2d.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx2d.roundRect(width / 2 - 380, 220, 760, 220, 32);
        ctx2d.fill();
        ctx2d.strokeStyle = '#00f0ff';
        ctx2d.lineWidth = 4;
        ctx2d.stroke();

        ctx2d.fillStyle = '#94a3b8';
        ctx2d.font = '700 36px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.fillText('DIALING LOCAL MASTER CONTRACTOR...', width / 2, 290);

        ctx2d.fillStyle = '#ffffff';
        ctx2d.font = '900 62px -apple-system, sans-serif';
        ctx2d.fillText("FRANK'S 24/7 SERVICE", width / 2, 370);
      } else if (t < 17.5) {
        ctx2d.fillStyle = '#ef4444';
        ctx2d.font = '900 70px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.shadowColor = 'rgba(239, 68, 68, 0.85)';
        ctx2d.shadowBlur = 28;
        ctx2d.fillText('CALL SENT TO VOICEMAIL', width / 2, 280);

        ctx2d.fillStyle = '#ffffff';
        ctx2d.font = '800 44px -apple-system, sans-serif';
        ctx2d.fillText('CONTRACTORS LOSE JOBS TO SLEEP', width / 2, 360);

        ctx2d.fillStyle = '#f59e0b';
        ctx2d.font = '900 62px -apple-system, sans-serif';
        ctx2d.fillText('-$14,000 BLEEDING AWAY', width / 2, 440);
      } else if (t < 25.5) {
        ctx2d.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx2d.roundRect(width / 2 - 380, 240, 760, 260, 32);
        ctx2d.fill();
        ctx2d.strokeStyle = '#ef4444';
        ctx2d.lineWidth = 5;
        ctx2d.stroke();

        ctx2d.fillStyle = '#94a3b8';
        ctx2d.font = '700 36px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.fillText('10 SECONDS LATER...', width / 2, 310);

        ctx2d.fillStyle = '#ef4444';
        ctx2d.font = '900 64px -apple-system, sans-serif';
        ctx2d.fillText('RIVAL TOOK THE $14,000 JOB', width / 2, 390);

        ctx2d.fillStyle = '#ffffff';
        ctx2d.font = '800 42px -apple-system, sans-serif';
        ctx2d.fillText('BECAUSE THEY ANSWERED 1ST', width / 2, 460);
      } else if (t < 34.5) {
        ctx2d.fillStyle = 'rgba(10, 15, 30, 0.88)';
        ctx2d.roundRect(width / 2 - 420, 210, 840, 300, 36);
        ctx2d.fill();
        ctx2d.strokeStyle = '#00f0ff';
        ctx2d.lineWidth = 5;
        ctx2d.stroke();

        ctx2d.fillStyle = '#00f0ff';
        ctx2d.font = '900 44px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.shadowColor = '#00f0ff';
        ctx2d.shadowBlur = 20;
        ctx2d.fillText('⚡ MEET AVA: 24/7 VOICE AI', width / 2, 280);

        ctx2d.fillStyle = '#10b981';
        ctx2d.font = '900 68px -apple-system, sans-serif';
        ctx2d.shadowColor = 'rgba(16, 185, 129, 0.8)';
        ctx2d.fillText('ANSWERS IN 0.8 SECONDS', width / 2, 365);

        ctx2d.fillStyle = '#ffffff';
        ctx2d.font = '800 38px -apple-system, sans-serif';
        ctx2d.fillText('QUALIFIES • BOOKS • DISPATCHES', width / 2, 445);
      } else {
        ctx2d.fillStyle = '#00f0ff';
        ctx2d.font = '900 42px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.shadowColor = '#00f0ff';
        ctx2d.shadowBlur = 22;
        ctx2d.fillText('TEST AVA LIVE RIGHT NOW', width / 2, 270);

        ctx2d.fillStyle = '#ffffff';
        ctx2d.font = '900 88px -apple-system, sans-serif';
        ctx2d.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx2d.shadowBlur = 30;
        ctx2d.fillText('(561) 813-8602', width / 2, 380);

        ctx2d.fillStyle = '#10b981';
        ctx2d.font = '900 52px -apple-system, sans-serif';
        ctx2d.fillText('OR COMMENT "AVA" BELOW', width / 2, 465);
      }

      // KINETIC WORD-BY-WORD SUBTITLES
      const activeWord = wordTimestamps.find(w => t >= w.start && t <= w.end);
      if (activeWord) {
        const curIdx = wordTimestamps.indexOf(activeWord);
        const startIdx = Math.max(0, curIdx - 2);
        const endIdx = Math.min(wordTimestamps.length, curIdx + 3);
        const snippet = wordTimestamps.slice(startIdx, endIdx);

        ctx2d.save();
        ctx2d.font = '900 54px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.textBaseline = 'middle';

        const textStr = snippet.map(w => w.word).join(' ');
        const textWidth = ctx2d.measureText(textStr).width;

        ctx2d.fillStyle = 'rgba(5, 8, 18, 0.88)';
        ctx2d.roundRect(width / 2 - textWidth / 2 - 40, 1620, textWidth + 80, 100, 28);
        ctx2d.fill();
        ctx2d.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx2d.lineWidth = 3;
        ctx2d.stroke();

        let curX = width / 2 - textWidth / 2;
        ctx2d.textAlign = 'left';
        snippet.forEach(w => {
          const wWidth = ctx2d.measureText(w.word + ' ').width;
          if (w === activeWord) {
            ctx2d.fillStyle = '#00f0ff';
            ctx2d.shadowColor = '#00f0ff';
            ctx2d.shadowBlur = 18;
          } else {
            ctx2d.fillStyle = '#ffffff';
            ctx2d.shadowBlur = 0;
          }
          ctx2d.fillText(w.word, curX, 1670);
          curX += wWidth;
        });
        ctx2d.restore();
      }

      return overlayCanvas.toDataURL('image/jpeg', 0.88);
    };
  </script>
</body>
</html>`;

(async () => {
  console.log('Launching hardware-accelerated 3D renderer for Geyser Reel...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=angle',
      '--use-angle=d3d11',
      '--disable-gpu-shader-disk-cache',
      '--disable-gpu-program-cache',
      '--window-size=1080,1920'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.setContent(html);

  console.log(`Piping frames into ffmpeg -> ${outVideoPath}...`);
  const ff = spawn(ffmpegPath, [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-framerate', String(FPS),
    '-i', '-',
    '-i', audioWavPath,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '256k',
    '-shortest',
    outVideoPath
  ]);

  let stdinClosed = false;
  ff.stdin.on('error', () => { stdinClosed = true; });
  ff.stderr.on('data', () => {});

  const startTime = Date.now();
  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const t = f / FPS;
    const dataUrl = await page.evaluate((curT) => window.renderFrameAtTime(curT), t);
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    if (!stdinClosed && ff.stdin.writable) {
      ff.stdin.write(buffer);
    }

    if (f % 60 === 0 || f === TOTAL_FRAMES - 1) {
      const pct = Math.round((f / TOTAL_FRAMES) * 100);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[ELITE 3D RENDER] Frame ${f}/${TOTAL_FRAMES} (${pct}%) — ${elapsed}s elapsed`);
    }
  }

  if (!stdinClosed) {
    ff.stdin.end();
  }

  await new Promise((resolve, reject) => {
    ff.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  await browser.close();
  const stats = fs.statSync(outVideoPath);
  console.log(`✅ Elite 3D Reel Successfully Rendered: ${outVideoPath} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
})().catch(err => {
  console.error('Render failed:', err);
  process.exit(1);
});
