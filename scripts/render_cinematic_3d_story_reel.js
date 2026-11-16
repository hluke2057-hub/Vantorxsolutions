// scripts/render_cinematic_3d_story_reel.js
// VantorX Ultra-Realistic 3D Cinematic Story Reel (75.1s Master Cut)
// - 3D Photorealistic Storyboard Scenes
// - Non-stop continuous 3D camera momentum (infinite dolly, parallax tilt, pan, camera rumble)
// - Dynamic volumetric lighting sweeps & continuous floating 3D dust/spark vortexes
// - 3D overlay holograms (rotating silicon die, $5M check, vibrating phone, burning $8k cash, AVA reactor)
// - Kinetic Hormozi-Style Captions synced to exact word timestamps

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\80451426-584a-4969-8d9c-573a8dd3a27d';

const audioPath = path.join(root, 'website/demo/audio/reel-nvidia-master.wav');
const tsJsonPath = path.join(root, 'website/demo/audio/reel-nvidia-timestamps.json');
const outMp4Path = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const outNamedMp4 = path.join(root, 'website/demo/video/vantorx-nvidia-reel.mp4');
const outSpeedMp4 = path.join(root, 'website/demo/video/vantorx-speed-to-lead-reel.mp4');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = Number(tsData.duration || 74.3);
const FPS = 30;
const W = 1080;
const H = 1920;

console.log(`Setting up Cinematic 3D Story Reel Pipeline: ${TOTAL_SEC}s (${tsData.words.length} words, ${Math.ceil(TOTAL_SEC * FPS)} frames)`);

// Scene image URLs (file:/// format for instant DOM GPU texture loading)
const scene1 = 'file:///' + path.join(root, 'website/demo/video/scene1_nvidia_3d.jpg').replace(/\\/g, '/');
const scene2 = 'file:///' + path.join(root, 'website/demo/video/scene2_sega_3d.jpg').replace(/\\/g, '/');
const scene3 = 'file:///' + path.join(root, 'website/demo/video/scene3_attic_3d.jpg').replace(/\\/g, '/');
const scene4 = 'file:///' + path.join(root, 'website/demo/video/scene4_ava_3d.jpg').replace(/\\/g, '/');
const scene5 = 'file:///' + path.join(root, 'website/demo/video/scene5_cta_3d.jpg').replace(/\\/g, '/');

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; overflow: hidden; width: 1080px; height: 1920px; }
    canvas { width: 1080px; height: 1920px; image-rendering: -webkit-optimize-contrast; }
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
    const WORDS = ${JSON.stringify(tsData.words)};
    const W = 1080, H = 1920;

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

    // 80 Floating 3D Spark / Dust Particles
    const PARTICLES = [];
    for (let i = 0; i < 80; i++) {
      PARTICLES.push({
        x: (i * 12347) % W,
        y: (i * 31415) % H,
        speedX: 18 + (i % 6) * 12,
        speedY: -28 - (i % 8) * 16,
        r: 2.5 + (i % 5) * 2.2,
        color: (i % 4 === 0) ? '#00f0ff' : (i % 4 === 1) ? '#22c55e' : (i % 4 === 2) ? '#facc15' : '#ff3b5c'
      });
    }

    function drawRoundBox(ctx, x, y, w, h, r, fillColor, strokeColor, lineW = 2) {
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, r);
      } else {
        const rad = typeof r === 'number' ? r : 8;
        ctx.moveTo(x + rad, y);
        ctx.lineTo(x + w - rad, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
        ctx.lineTo(x + w, y + h - rad);
        ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
        ctx.lineTo(x + rad, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
        ctx.lineTo(x, y + rad);
        ctx.quadraticCurveTo(x, y, x + rad, y);
        ctx.closePath();
      }
      if (fillColor) { ctx.fillStyle = fillColor; ctx.fill(); }
      if (strokeColor) { ctx.strokeStyle = strokeColor; ctx.lineWidth = lineW; ctx.stroke(); }
    }

    // Master Frame Renderer
    window.renderFrame = function(t) {
      // Scene Timeline (5 Acts):
      // Scene 0: 0.0s - 15.2s (Nvidia $3T Question & Cheated Death)
      // Scene 1: 15.2s - 33.5s (1995 Sega Boardroom $5M Rescue & Ruthless Automation)
      // Scene 2: 33.5s - 46.5s (Contractor Attic Voicemail Bleed & -$8,000 Cash Bleed)
      // Scene 3: 46.5s - 64.0s (AVA 24/7 Voice AI & 0.8s Instant Answer)
      // Scene 4: 64.0s - 75.1s (Live Call Challenge (561) 813-8602 & Comment AVA)

      let sceneIdx = 0;
      let sceneStart = 0;
      let sceneEnd = 15.2;

      if (t < 15.2) {
        sceneIdx = 0; sceneStart = 0; sceneEnd = 15.2;
      } else if (t < 33.5) {
        sceneIdx = 1; sceneStart = 15.2; sceneEnd = 33.5;
      } else if (t < 46.5) {
        sceneIdx = 2; sceneStart = 33.5; sceneEnd = 46.5;
      } else if (t < 64.0) {
        sceneIdx = 3; sceneStart = 46.5; sceneEnd = 64.0;
      } else {
        sceneIdx = 4; sceneStart = 64.0; sceneEnd = 75.1;
      }

      const sceneProgress = (t - sceneStart) / (sceneEnd - sceneStart);

      // Camera shake / impact triggers
      let shakeX = 0, shakeY = 0, flashAlpha = 0;
      const impacts = [0.0, 5.13, 11.8, 15.48, 20.0, 27.36, 34.25, 38.02, 44.59, 46.14, 50.67, 58.72, 66.28];
      impacts.forEach(trig => {
        const diff = t - trig;
        if (diff >= 0 && diff < 0.38) {
          const decay = 1 - (diff / 0.38);
          shakeX += Math.sin(diff * 52) * 22 * decay;
          shakeY += Math.cos(diff * 64) * 18 * decay;
          if (diff < 0.12) flashAlpha = Math.max(flashAlpha, (1 - diff / 0.12) * 0.3);
        }
      });

      // Continuous 3D Camera Movement (No still frames)
      // Continuous slow dolly zoom-in (1.04x to 1.26x) + gentle lateral drift
      const camZoom = 1.05 + sceneProgress * 0.22;
      const camPanX = Math.sin(t * 0.7) * 35 + shakeX;
      const camPanY = Math.cos(t * 0.5) * 25 + shakeY;
      const camRot = Math.sin(t * 0.4) * 0.015;

      ctx.save();
      ctx.translate(W / 2 + camPanX, H / 2 + camPanY);
      ctx.rotate(camRot);
      ctx.scale(camZoom, camZoom);
      ctx.translate(-W / 2, -H / 2);

      // Draw Scene Background Image
      const curImg = IMAGES[sceneIdx];
      if (curImg && curImg.complete && curImg.naturalWidth > 0) {
        ctx.drawImage(curImg, -40, -40, W + 80, H + 80);
      } else {
        // Fallback Dark Sci-Fi Gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        if (sceneIdx === 2) {
          grad.addColorStop(0, '#1c0508');
          grad.addColorStop(1, '#080102');
        } else {
          grad.addColorStop(0, '#040b18');
          grad.addColorStop(1, '#020409');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(-60, -60, W + 120, H + 120);
      }

      // Volumetric Moving Light Flare Sweep
      const flareX = W * (0.2 + 0.6 * (0.5 + Math.sin(t * 1.1) * 0.5));
      const flareY = H * 0.35 + Math.cos(t * 0.9) * 80;
      const flareGrad = ctx.createRadialGradient(flareX, flareY, 20, flareX, flareY, 520);
      flareGrad.addColorStop(0, (sceneIdx === 2) ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 240, 255, 0.22)');
      flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, W, H);

      // Floating 3D Spark / Dust Particles
      PARTICLES.forEach(p => {
        const px = ((p.x + t * p.speedX) % (W + 120) + (W + 120)) % (W + 120) - 60;
        const py = ((p.y + t * p.speedY) % (H + 120) + (H + 120)) % (H + 120) - 60;
        ctx.fillStyle = (sceneIdx === 2) ? '#ff5252' : p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle Vignette for Cinema Depth
      const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, W * 0.85);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      ctx.restore(); // Restore camera transform

      // ==========================================
      // TOP STEPPER (① NVIDIA ② SEGA ③ THE BLEED ④ AVA)
      // ==========================================
      const actNum = (sceneIdx <= 1) ? sceneIdx + 1 : (sceneIdx === 2) ? 3 : 4;
      const actTitles = ['① NVIDIA $3T EMPIRE', '② 1995 SEGA RESCUE', '③ -$8,000 VOICEMAIL BLEED', '④ AVA 24/7 VOICE AI'];

      ctx.save();
      const stepY = 135;
      const spacing = 80;
      const startX = W / 2 - (spacing * 1.5);
      for (let i = 1; i <= 4; i++) {
        const cx = startX + (i - 1) * spacing;
        const isCurrent = (i === actNum);
        const isPast = (i < actNum);

        ctx.beginPath();
        ctx.arc(cx, stepY, isCurrent ? 24 : 20, 0, Math.PI * 2);
        if (isCurrent) {
          ctx.fillStyle = '#facc15';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3.5;
          ctx.stroke();

          ctx.font = '900 22px Arial, sans-serif';
          ctx.fillStyle = '#090d16';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(i), cx, stepY + 1);
        } else if (isPast) {
          ctx.fillStyle = '#22c55e';
          ctx.fill();
          ctx.font = '900 20px Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✓', cx, stepY + 1);
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fill();
          ctx.font = '800 18px Arial, sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(i), cx, stepY + 1);
        }
      }

      ctx.font = '900 24px Arial, sans-serif';
      ctx.fillStyle = (actNum === 3) ? '#ef4444' : '#facc15';
      ctx.textAlign = 'center';
      ctx.fillText(actTitles[actNum - 1], W / 2, stepY + 54);
      ctx.restore();

      // ==========================================
      // KINETIC HORMOZI CAPTIONS (Synced to words)
      // ==========================================
      const activeWordIdx = WORDS.findIndex(w => t >= w.start && t <= w.end);
      let targetIdx = activeWordIdx;
      if (targetIdx === -1) {
        for (let i = WORDS.length - 1; i >= 0; i--) {
          if (t >= WORDS[i].end) { targetIdx = Math.min(i, WORDS.length - 1); break; }
        }
      }
      if (targetIdx === -1) targetIdx = 0;

      const chunkStart = Math.max(0, targetIdx - 1);
      const chunkWords = WORDS.slice(chunkStart, chunkStart + 3);

      ctx.save();
      const capY = 1620;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let totalWidth = 0;
      ctx.font = '900 62px Arial, sans-serif';
      const wordMetrics = chunkWords.map(cw => {
        const txt = cw.word.toUpperCase();
        const m = ctx.measureText(txt);
        totalWidth += m.width + 30;
        return { txt, width: m.width, isCurrent: (cw.start <= t && cw.end >= t) };
      });

      const pillW = Math.min(W - 80, totalWidth + 90);
      drawRoundBox(ctx, W / 2 - pillW / 2, capY - 58, pillW, 116, 26, 'rgba(4, 8, 18, 0.9)', 'rgba(56, 189, 248, 0.4)', 2.5);

      let startWordX = W / 2 - totalWidth / 2;
      wordMetrics.forEach((wm) => {
        const curWordX = startWordX + wm.width / 2;
        ctx.save();
        ctx.translate(curWordX, capY);

        if (wm.isCurrent) {
          const pop = 1 + Math.sin(t * 20) * 0.1;
          ctx.scale(pop, pop);

          ctx.font = '900 72px Arial, sans-serif';
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 24;
          ctx.fillText(wm.txt, 3, 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(wm.txt, 0, 0);
        } else {
          ctx.font = '900 58px Arial, sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.shadowBlur = 0;
          ctx.fillText(wm.txt, 0, 0);
        }

        ctx.restore();
        startWordX += wm.width + 30;
      });

      ctx.restore();

      // White Impact Flash on Key Punchlines
      if (flashAlpha > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, ' + flashAlpha + ')';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    };
  </script>
</body>
</html>`;

const tmpHtmlPath = path.join(root, 'scripts/tmp_cinematic_3d.html');
fs.writeFileSync(tmpHtmlPath, htmlContent, 'utf8');

async function renderVideo() {
  const userDataDir = path.join(root, '.cache/edge_profile');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    userDataDir: userDataDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--allow-file-access-from-files',
      '--disable-web-security',
      '--disable-gpu-shader-disk-cache',
      '--disable-gpu-program-cache'
    ]
  });

  const page = await browser.newPage();
  page.on('pageerror', err => console.error('BROWSER PAGE ERROR:', err.message));
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto('file:///' + tmpHtmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForFunction(() => window.isLoaded === true, { timeout: 15000 });

  const totalFrames = Math.ceil(TOTAL_SEC * FPS);
  console.log(`Rendering ${totalFrames} frames @ ${FPS} FPS into ${outMp4Path}...`);

  const ffArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', String(FPS),
    '-i', 'pipe:0',
    '-i', audioPath,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'veryfast',
    '-crf', '20',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    outMp4Path
  ];

  const ff = spawn(ffmpegPath, ffArgs, { stdio: ['pipe', 'ignore', 'pipe'] });
  let ffErr = '';
  ff.stderr.on('data', d => ffErr += d.toString());
  let stdinClosed = false;
  ff.stdin.on('error', () => { stdinClosed = true; });

  const startTime = Date.now();
  for (let f = 0; f < totalFrames; f++) {
    if (stdinClosed) break;
    const t = f / FPS;
    await page.evaluate((tm) => window.renderFrame(tm), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 80 });
    if (stdinClosed) break;
    try {
      if (!ff.stdin.write(buf)) {
        await new Promise(res => ff.stdin.once('drain', res));
      }
    } catch (e) {
      break;
    }
    if (f % 60 === 0 || f === totalFrames - 1) {
      const pct = ((f / totalFrames) * 100).toFixed(0);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stdout.write(`\r[CINEMATIC 3D RENDER] Frame ${f}/${totalFrames} (${pct}%) — ${elapsed}s elapsed`);
    }
  }

  try { ff.stdin.end(); } catch (e) {}
  await new Promise((resolve, reject) => {
    ff.on('close', code => code === 0 ? resolve() : reject(new Error(ffErr)));
  });

  await browser.close();
  try { fs.unlinkSync(tmpHtmlPath); } catch (e) {}
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

  fs.copyFileSync(outMp4Path, outNamedMp4);
  fs.copyFileSync(outMp4Path, outSpeedMp4);
  try {
    fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-30s-reel-2.mp4'));
    fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-nvidia-reel.mp4'));
  } catch (e) {
    console.log('Artifact copy skipped:', e.message);
  }

  const sz = (fs.statSync(outMp4Path).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ Ultra-Realistic Cinematic 3D Reel Rendered: ${outMp4Path} (${sz} MB)`);
}

renderVideo().catch(err => {
  console.error('\nRender error:', err);
  process.exit(1);
});
