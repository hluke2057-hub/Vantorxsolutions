// scripts/render_missed_dinner_reel.js
// ELITE 3D VIRAL REELS CREATION ENGINE — GROUNDED DIRECTION
// Reel: "The Missed Dinner" (38.8s, 1080x1920 9:16 Vertical @ 30 FPS)
// Single Continuous Environment · Exactly 2 Characters · Intimate Camera Choreography · Subtle Acoustic Score

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');
const { spawn } = require('child_process');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const audioWavPath = path.join(root, 'website/demo/audio/missed-dinner-master.wav');
const tsJsonPath = path.join(root, 'website/demo/audio/missed-dinner-timestamps.json');
const outVideoPath = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const threeCode = fs.readFileSync(path.join(root, 'website/demo/js/three.min.js'), 'utf8');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const FPS = 30;
const DURATION_SEC = Number(tsData.duration || 38.267) + 0.6; // ~38.8s
const TOTAL_FRAMES = Math.ceil(DURATION_SEC * FPS);

console.log(`Starting Grounded 3D Reel Render: ${DURATION_SEC.toFixed(2)}s (${TOTAL_FRAMES} frames @ ${FPS} FPS)`);

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
    const wordTimestamps = ${JSON.stringify(tsData.words)};

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const overlayCanvas = document.getElementById('overlay');
    const ctx2d = overlayCanvas.getContext('2d');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c14);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);

    // ==========================================
    // WARM LIGHTING RIG
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x221a28, 1.2);
    scene.add(ambientLight);

    const pendantLight = new THREE.PointLight(0xffb366, 2.8, 12, 1.5);
    pendantLight.position.set(0, 3.2, 0);
    pendantLight.castShadow = true;
    scene.add(pendantLight);

    const candleLight = new THREE.PointLight(0xff7722, 1.8, 4, 2);
    candleLight.position.set(0, 1.18, 0);
    scene.add(candleLight);

    const windowRim = new THREE.DirectionalLight(0x406090, 1.4);
    windowRim.position.set(-5, 4, -4);
    scene.add(windowRim);

    // ==========================================
    // DINING ROOM ENVIRONMENT
    // ==========================================
    const tableTop = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 0.08, 48),
      new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.35, metalness: 0.15 })
    );
    tableTop.position.set(0, 0.96, 0);
    tableTop.receiveShadow = true;
    scene.add(tableTop);

    const tableBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.45, 0.96, 24),
      new THREE.MeshStandardMaterial({ color: 0x241712, roughness: 0.6 })
    );
    tableBase.position.set(0, 0.48, 0);
    scene.add(tableBase);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x18120e, roughness: 0.6, metalness: 0.1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 10),
      new THREE.MeshStandardMaterial({ color: 0x1a1520, roughness: 0.9 })
    );
    backWall.position.set(0, 5, -5);
    scene.add(backWall);

    // ==========================================
    // CUPCAKE & CANDLE
    // ==========================================
    const cupcakeGroup = new THREE.Group();

    const liner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.10, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.8 })
    );
    cupcakeGroup.add(liner);

    const icing = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x3d2116, roughness: 0.4 })
    );
    icing.position.y = 0.08;
    cupcakeGroup.add(icing);

    const candleStick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.18, 16),
      new THREE.MeshStandardMaterial({ color: 0xff6699, roughness: 0.3 })
    );
    candleStick.position.y = 0.22;
    cupcakeGroup.add(candleStick);

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
    // SMARTPHONE
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

    const phoneGlow = new THREE.PointLight(0x00f0ff, 0.0, 1.2);
    phoneGlow.position.set(0, 0.08, 0);
    phoneGroup.add(phoneGlow);

    phoneGroup.position.set(0.42, 1.01, 0.45);
    phoneGroup.rotation.y = -0.25;
    scene.add(phoneGroup);

    // ==========================================
    // CHARACTERS: MARCUS & LILY
    // ==========================================
    function createMarcus() {
      const g = new THREE.Group();
      const skin = new THREE.MeshStandardMaterial({ color: 0xdfab8c, roughness: 0.55 });
      const shirt = new THREE.MeshStandardMaterial({ color: 0x1b2838, roughness: 0.7 });
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x2c1f18, roughness: 0.8 });

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), skin);
      head.scale.set(0.95, 1.15, 0.95);
      head.position.y = 1.95;
      g.add(head);

      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.29, 20, 20), hairMat);
      hair.scale.set(0.98, 0.7, 1.0);
      hair.position.set(0, 2.12, -0.04);
      g.add(hair);

      [-0.09, 0.09].forEach(x => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        eye.position.set(x, 1.98, 0.24);
        g.add(eye);
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), new THREE.MeshBasicMaterial({ color: 0x221100 }));
        pupil.position.set(x, 1.98, 0.27);
        g.add(pupil);
      });

      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.25, 0.8, 20), shirt);
      torso.position.y = 1.35;
      g.add(torso);

      const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.6, 16), shirt);
      leftArm.position.set(-0.35, 1.3, 0.2);
      leftArm.rotation.set(0.8, 0, 0.3);
      g.add(leftArm);

      const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.6, 16), shirt);
      rightArm.position.set(0.35, 1.3, 0.2);
      rightArm.rotation.set(0.8, 0, -0.3);
      g.add(rightArm);

      g.position.set(0, 0, 1.15);
      g.rotation.y = Math.PI;
      return { group: g, head, leftArm, rightArm, torso };
    }

    function createLily() {
      const g = new THREE.Group();
      const skin = new THREE.MeshStandardMaterial({ color: 0xf2c4a8, roughness: 0.5 });
      const sweater = new THREE.MeshStandardMaterial({ color: 0xd9597b, roughness: 0.8 });
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x4a2a18, roughness: 0.8 });

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), skin);
      head.position.y = 1.55;
      g.add(head);

      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.23, 20, 20), hairMat);
      hair.scale.set(1.02, 0.8, 1.05);
      hair.position.set(0, 1.68, -0.04);
      g.add(hair);

      [-0.24, 0.24].forEach(x => {
        const pt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.3, 12), hairMat);
        pt.position.set(x, 1.5, -0.1);
        pt.rotation.z = x > 0 ? -0.4 : 0.4;
        g.add(pt);
      });

      [-0.07, 0.07].forEach(x => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        eye.position.set(x, 1.57, 0.19);
        g.add(eye);
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), new THREE.MeshBasicMaterial({ color: 0x1a0f05 }));
        pupil.position.set(x, 1.57, 0.22);
        g.add(pupil);
      });

      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.18, 0.6, 20), sweater);
      torso.position.y = 1.15;
      g.add(torso);

      g.position.set(0, 0, -1.05);
      return { group: g, head };
    }

    const marcus = createMarcus();
    scene.add(marcus.group);

    const lily = createLily();
    scene.add(lily.group);

    // ==========================================
    // FRAME UPDATE & COMPOSITING ENGINE
    // ==========================================
    window.renderFrameAtTime = function(t) {
      // Flame gentle flicker
      if (t < 16.5) {
        flame.visible = true;
        flame.scale.y = 1.8 + Math.sin(t * 15.0) * 0.25;
        candleLight.intensity = 1.8 + Math.sin(t * 12.0) * 0.2;
      } else {
        flame.visible = false;
        candleLight.intensity = 0.2;
      }

      // ------------------------------------------
      // SCENE 1: THE BIRTHDAY MOMENT (0s to 4.5s)
      // ------------------------------------------
      if (t < 4.5) {
        const p = t / 4.5;
        // Slow intimate push past Marcus's shoulder towards Lily & Cupcake
        camera.position.set(0.38 - p * 0.05, 1.52 - p * 0.04, 1.05 - p * 0.15);
        camera.lookAt(0, 1.25, -0.7);

        phoneGlow.intensity = 0;
        phoneScreen.material.color.setHex(0x111625);

        // Lily slight joyful head bob
        lily.head.rotation.y = Math.sin(t * 3.0) * 0.08;
        marcus.head.rotation.set(0, 0, 0);
      }
      // ------------------------------------------
      // SCENE 2: THE DILEMMA (4.5s to 14.8s)
      // ------------------------------------------
      else if (t < 14.8) {
        const p = (t - 4.5) / 10.3;
        // Camera pans down to the vibrating phone on the table
        camera.position.set(0.44 + Math.sin(p * 2.0) * 0.04, 1.38 - Math.min(0.08, p * 0.15), 0.70 - p * 0.05);
        camera.lookAt(0.42, 1.01, 0.45);

        // Phone vibrates during audio buzz (5.2 - 8.5s)
        let phShiftX = 0;
        let phShiftZ = 0;
        if ((t > 5.1 && t < 6.2) || (t > 6.9 && t < 8.0)) {
          phShiftX = Math.sin(t * 45.0) * 0.006;
          phShiftZ = Math.cos(t * 45.0) * 0.006;
        }
        phoneGroup.position.set(0.42 + phShiftX, 1.01, 0.45 + phShiftZ);

        phoneGlow.intensity = 2.0;
        phoneScreen.material.color.setHex(0x00f0ff);

        // Marcus head subtly turns down towards phone
        marcus.head.rotation.x = -0.25;
      }
      // ------------------------------------------
      // SCENE 3: THE SILENT ASSISTANT (14.8s to 24.5s)
      // ------------------------------------------
      else if (t < 24.5) {
        const p = (t - 14.8) / 9.7;
        camera.position.set(0.38 + p * 0.02, 1.28, 0.58 - p * 0.04);
        camera.lookAt(0.36, 1.04, 0.38);

        phoneGroup.position.set(0.42, 1.01, 0.45);
        phoneGlow.intensity = 1.8;
        phoneScreen.material.color.setHex(0x10b981); // Green connected

        // Lily blows candle (16.5s)
        if (t >= 16.0 && t <= 17.5) {
          lily.head.position.y = 1.55 - 0.06;
        } else {
          lily.head.position.y = 1.55;
        }
      }
      // ------------------------------------------
      // SCENE 4: THE CONFIRMATION (24.5s to 30.5s)
      // ------------------------------------------
      else if (t < 30.5) {
        const p = (t - 24.5) / 6.0;
        // Smooth tilt up to Marcus's face showing genuine relief
        camera.position.set(0, 1.45 + p * 0.05, 0.25 + p * 0.08);
        camera.lookAt(0, 1.75, 1.15);

        marcus.head.rotation.x = -0.10 + Math.sin(t * 1.5) * 0.02; // Nodding gently with relief
      }
      // ------------------------------------------
      // SCENE 5: THE CLEAN LIVE CTA (30.5s to 38.8s)
      // ------------------------------------------
      else {
        camera.position.set(0, 1.4, 0.1);
        camera.lookAt(0, 1.3, -1.0);
      }

      // RENDER THREE.JS WEBGL SCENE
      renderer.render(scene, camera);

      // COMPOSITE THREE.JS WEBGL ONTO 2D OVERLAY CANVAS
      ctx2d.clearRect(0, 0, width, height);
      ctx2d.drawImage(renderer.domElement, 0, 0);

      // SCENE OVERLAY GRAPHICS (Minimal, tasteful, uncluttered)
      if (t < 4.5) {
        ctx2d.fillStyle = 'rgba(255, 230, 200, 0.95)';
        ctx2d.font = '800 50px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.fillText('14 HOURS ON ROOFS TODAY', width / 2, 280);

        ctx2d.fillStyle = 'rgba(255, 180, 100, 0.9)';
        ctx2d.font = '700 38px -apple-system, sans-serif';
        ctx2d.fillText('JUST TO BE HOME FOR THIS MOMENT', width / 2, 345);
      } else if (t < 14.8) {
        ctx2d.fillStyle = 'rgba(12, 17, 28, 0.92)';
        ctx2d.roundRect(width / 2 - 380, 230, 760, 210, 28);
        ctx2d.fill();
        ctx2d.strokeStyle = 'rgba(0, 240, 255, 0.6)';
        ctx2d.lineWidth = 3;
        ctx2d.stroke();

        ctx2d.fillStyle = '#ef4444';
        ctx2d.font = '800 32px -apple-system, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.fillText('INCOMING EMERGENCY CALL', width / 2, 290);

        ctx2d.fillStyle = '#ffffff';
        ctx2d.font = '900 54px -apple-system, sans-serif';
        ctx2d.fillText('$8,000 ROOFTOP REPLACEMENT', width / 2, 360);

        ctx2d.fillStyle = '#94a3b8';
        ctx2d.font = '600 30px -apple-system, sans-serif';
        ctx2d.fillText('ANSWER AND LEAVE? OR IGNORE AND LOSE IT?', width / 2, 410);
      } else if (t < 24.5) {
        ctx2d.fillStyle = 'rgba(10, 16, 26, 0.92)';
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
        ctx2d.font = '900 50px -apple-system, sans-serif';
        ctx2d.fillText('HANDLING CALL WITH EMPATHY', width / 2, 355);

        ctx2d.fillStyle = '#38bdf8';
        ctx2d.font = '700 32px -apple-system, sans-serif';
        ctx2d.fillText('MARCUS NEVER LEFT THE TABLE', width / 2, 405);
      } else if (t < 30.5) {
        ctx2d.fillStyle = 'rgba(10, 18, 30, 0.92)';
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
      } else {
        // SCENE 5 CLEAN CTA
        ctx2d.fillStyle = 'rgba(8, 11, 20, 0.88)';
        ctx2d.fillRect(0, 0, width, height);

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

      // KINETIC WORD-BY-WORD SUBTITLES
      const activeWord = wordTimestamps.find(w => t >= w.start && t <= w.end);
      if (activeWord && t < 30.5) {
        const curIdx = wordTimestamps.indexOf(activeWord);
        const startIdx = Math.max(0, curIdx - 2);
        const endIdx = Math.min(wordTimestamps.length, curIdx + 3);
        const snippet = wordTimestamps.slice(startIdx, endIdx);

        ctx2d.save();
        ctx2d.font = '900 50px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.textBaseline = 'middle';

        const textStr = snippet.map(w => w.word).join(' ');
        const textWidth = ctx2d.measureText(textStr).width;

        ctx2d.fillStyle = 'rgba(5, 8, 18, 0.88)';
        ctx2d.roundRect(width / 2 - textWidth / 2 - 36, 1620, textWidth + 72, 92, 26);
        ctx2d.fill();
        ctx2d.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx2d.lineWidth = 2;
        ctx2d.stroke();

        let curX = width / 2 - textWidth / 2;
        ctx2d.textAlign = 'left';
        snippet.forEach(w => {
          const wWidth = ctx2d.measureText(w.word + ' ').width;
          if (w === activeWord) {
            ctx2d.fillStyle = '#38bdf8';
            ctx2d.shadowColor = '#38bdf8';
            ctx2d.shadowBlur = 16;
          } else {
            ctx2d.fillStyle = '#ffffff';
            ctx2d.shadowBlur = 0;
          }
          ctx2d.fillText(w.word, curX, 1666);
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
  console.log('Launching 3D renderer for "The Missed Dinner"...');
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
      console.log(`[MISSED DINNER RENDER] Frame ${f}/${TOTAL_FRAMES} (${pct}%) — ${elapsed}s elapsed`);
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
  console.log(`✅ "The Missed Dinner" Master Successfully Rendered: ${outVideoPath} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
})().catch(err => {
  console.error('Render failed:', err);
  process.exit(1);
});
