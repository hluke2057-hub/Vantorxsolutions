// scripts/render_hvac_commercial.js
// VantorX Solutions - HVAC Contractor AI Receptionist Commercial (34.18s Master)
// 1080x1920 Vertical 9:16 format @ 30fps

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\80451426-584a-4969-8d9c-573a8dd3a27d';

const audioPath = path.join(root, 'website/demo/audio/hvac-commercial-master.wav');
const tsJsonPath = path.join(root, 'website/demo/audio/hvac-commercial-timestamps.json');
const outCommercialMp4 = path.join(root, 'website/demo/video/vantorx-ai-receptionist-commercial.mp4');
const outReel2Mp4 = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const outSpeedMp4 = path.join(root, 'website/demo/video/vantorx-speed-to-lead-reel.mp4');
const artifactMp4 = path.join(ARTIFACT_DIR, 'vantorx-30s-reel-2.mp4');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = Number(tsData.duration || 34.18);
const FPS = 30;
const W = 1080;
const H = 1920;
const totalFrames = Math.ceil(TOTAL_SEC * FPS);

console.log(`Setting up HVAC Commercial Reel Pipeline: ${TOTAL_SEC}s (${tsData.words.length} words, ${totalFrames} frames)`);

// Scene image URLs (file:/// format for instant GPU texture loading)
const scene1 = 'file:///' + path.join(root, 'website/demo/video/hvac_scene1.jpg').replace(/\\/g, '/');
const scene2 = 'file:///' + path.join(root, 'website/demo/video/hvac_scene2.jpg').replace(/\\/g, '/');
const scene3 = 'file:///' + path.join(root, 'website/demo/video/hvac_scene3.jpg').replace(/\\/g, '/');
const scene4 = 'file:///' + path.join(root, 'website/demo/video/hvac_scene4.jpg').replace(/\\/g, '/');
const scene5 = 'file:///' + path.join(root, 'website/demo/video/hvac_scene5.jpg').replace(/\\/g, '/');

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; overflow: hidden; width: 1080px; height: 1920px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
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
      if (img.complete && img.naturalWidth > 0) loadedCount++;
      else img.onload = () => { loadedCount++; if (loadedCount === IMAGES.length) window.isLoaded = true; };
    });
    if (loadedCount === IMAGES.length) window.isLoaded = true;

    // Floating 3D Spark / Dust Particles
    const PARTICLES = [];
    for (let i = 0; i < 60; i++) {
      PARTICLES.push({
        x: (i * 12347) % W,
        y: (i * 31415) % H,
        speedX: 12 + (i % 5) * 8,
        speedY: -20 - (i % 7) * 12,
        r: 2.0 + (i % 4) * 1.8,
        color: (i % 3 === 0) ? '#00f0ff' : (i % 3 === 1) ? '#facc15' : 'rgba(255,255,255,0.7)'
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
      // Scene Timeline:
      // Scene 0: 0.0s - 7.8s (Technician on AC unit, Phone ringing in van)
      // Scene 1: 7.8s - 14.8s (Frustrated Homeowner, sweltering heat, voicemail)
      // Scene 2: 14.8s - 22.8s (AVA AI Voice Receptionist booking Sarah Jenkins)
      // Scene 3: 22.8s - 27.2s (Technician smiling in van, confirmed appointment at 3:00 PM)
      // Scene 4: 27.2s - 34.2s (Branded van arrives at customer's home, VantorX CTA)

      let sceneIdx = 0;
      let sceneStart = 0;
      let sceneEnd = 7.8;

      if (t < 7.8) {
        sceneIdx = 0; sceneStart = 0; sceneEnd = 7.8;
      } else if (t < 14.8) {
        sceneIdx = 1; sceneStart = 7.8; sceneEnd = 14.8;
      } else if (t < 22.8) {
        sceneIdx = 2; sceneStart = 14.8; sceneEnd = 22.8;
      } else if (t < 27.2) {
        sceneIdx = 3; sceneStart = 22.8; sceneEnd = 27.2;
      } else {
        sceneIdx = 4; sceneStart = 27.2; sceneEnd = 34.18;
      }

      const sceneProgress = Math.min(1, Math.max(0, (t - sceneStart) / (sceneEnd - sceneStart)));

      // Camera vibration / shake triggers:
      // Phone ring vibrations: ~5.2s - 7.4s in Scene 0
      let shakeX = 0, shakeY = 0;
      if (t >= 5.1 && t <= 7.4) {
        shakeX = Math.sin(t * 70) * 8;
        shakeY = Math.cos(t * 85) * 6;
      }

      // Smooth cinematic camera dolly & slow pan
      const camZoom = 1.04 + sceneProgress * 0.12;
      const camPanX = Math.sin(sceneProgress * Math.PI) * 18 + shakeX;
      const camPanY = Math.cos(sceneProgress * Math.PI * 0.8) * 12 + shakeY;
      const camRot = Math.sin(sceneProgress * Math.PI) * 0.008;

      ctx.save();
      ctx.translate(W / 2 + camPanX, H / 2 + camPanY);
      ctx.rotate(camRot);
      ctx.scale(camZoom, camZoom);
      ctx.translate(-W / 2, -H / 2);

      // Draw 3D Background Image
      const curImg = IMAGES[sceneIdx];
      if (curImg && curImg.complete && curImg.naturalWidth > 0) {
        // High quality scale to fill 1080x1920
        ctx.drawImage(curImg, -30, -30, W + 60, H + 60);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-60, -60, W + 120, H + 120);
      }

      // Atmospheric Lighting & Shimmer:
      if (sceneIdx === 0 || sceneIdx === 1) {
        // Warm summer sunlight / heat wave gradient
        const sunGrad = ctx.createRadialGradient(W * 0.8, H * 0.2, 50, W * 0.8, H * 0.2, 700);
        sunGrad.addColorStop(0, 'rgba(255, 180, 50, 0.22)');
        sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, W, H);
      } else if (sceneIdx === 2) {
        // High-tech AI cyber cyan aura around AVA
        const aiGrad = ctx.createRadialGradient(W * 0.5, H * 0.45, 60, W * 0.5, H * 0.45, 600);
        aiGrad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
        aiGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = aiGrad;
        ctx.fillRect(0, 0, W, H);
      } else if (sceneIdx === 3) {
        // Golden success sunlight in cab
        const goldGrad = ctx.createRadialGradient(W * 0.2, H * 0.3, 50, W * 0.2, H * 0.3, 650);
        goldGrad.addColorStop(0, 'rgba(34, 197, 94, 0.20)');
        goldGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = goldGrad;
        ctx.fillRect(0, 0, W, H);
      }

      // Subtle 3D floating air particles
      PARTICLES.forEach(p => {
        const px = ((p.x + t * p.speedX) % (W + 100) + (W + 100)) % (W + 100) - 50;
        const py = ((p.y + t * p.speedY) % (H + 100) + (H + 100)) % (H + 100) - 50;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cinematic Vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.38, W / 2, H / 2, W * 0.82);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      ctx.restore(); // Restore camera transformation

      // ==========================================
      // TOP BRANDING & CHAPTER STEPPER
      // ==========================================
      ctx.save();
      // Top header pill
      const topPillW = 420;
      const topPillH = 50;
      const topPillX = (W - topPillW) / 2;
      const topPillY = 65;
      drawRoundBox(ctx, topPillX, topPillY, topPillW, topPillH, 25, 'rgba(11, 19, 43, 0.88)', '#00f0ff', 2);

      ctx.font = '800 22px Arial, sans-serif';
      ctx.fillStyle = '#00f0ff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡ VANTORX AI VOICE RECEPTIONIST', W / 2, topPillY + topPillH / 2);

      // Chapter Dots & Labels
      const chapters = [
        '① THE MISSED CALL',
        '② LOST CUSTOMER',
        '③ AVA INSTANT ANSWER',
        '④ JOB CONFIRMED',
        '⑤ GROW YOUR BUSINESS'
      ];
      const curChap = chapters[sceneIdx];

      // Chapter badge below header
      drawRoundBox(ctx, (W - 380) / 2, 130, 380, 42, 21, 'rgba(0, 0, 0, 0.75)', 'rgba(255,255,255,0.2)', 1.5);
      ctx.font = '900 19px Arial, sans-serif';
      ctx.fillStyle = (sceneIdx === 1) ? '#f87171' : (sceneIdx === 2 || sceneIdx === 3) ? '#4ade80' : '#facc15';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(curChap, W / 2, 151);

      ctx.restore();

      // ==========================================
      // KINETIC WORD SUBTITLES (Hormozi / Commercial Style)
      // ==========================================
      // Find current active word
      let activeWordIdx = -1;
      for (let i = 0; i < WORDS.length; i++) {
        if (t >= WORDS[i].start && t <= WORDS[i].end + 0.15) {
          activeWordIdx = i;
          break;
        }
      }
      if (activeWordIdx === -1 && WORDS.length > 0) {
        // Find nearest past word
        for (let i = WORDS.length - 1; i >= 0; i--) {
          if (t >= WORDS[i].end && t <= WORDS[i].end + 0.5) {
            activeWordIdx = i;
            break;
          }
        }
      }

      if (activeWordIdx !== -1) {
        // Group 3-4 words for context
        const windowSize = 4;
        const startW = Math.max(0, activeWordIdx - 1);
        const endW = Math.min(WORDS.length, startW + windowSize);
        const chunk = WORDS.slice(startW, endW);

        ctx.save();
        const subBoxY = 1460;
        ctx.font = '900 48px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Measure full width
        let totalChunkW = 0;
        const wordMetrics = chunk.map(w => {
          const clean = w.word.toUpperCase();
          const m = ctx.measureText(clean).width;
          totalChunkW += m + 18;
          return { word: clean, width: m, orig: w };
        });
        totalChunkW -= 18;

        const subBgW = Math.min(W - 80, Math.max(380, totalChunkW + 60));
        const subBgH = 96;
        const subBgX = (W - subBgW) / 2;

        // Subtitle backdrop pill
        drawRoundBox(ctx, subBgX, subBoxY - 48, subBgW, subBgH, 24, 'rgba(0, 0, 0, 0.88)', '#00f0ff', 2.5);

        // Render words
        let curX = W / 2 - totalChunkW / 2;
        wordMetrics.forEach(wm => {
          const isCurrent = (wm.orig === WORDS[activeWordIdx]);
          const wordCenter = curX + wm.width / 2;

          ctx.font = isCurrent ? '900 52px Arial, sans-serif' : '800 46px Arial, sans-serif';
          
          // Shadow
          ctx.fillStyle = '#000000';
          ctx.fillText(wm.word, wordCenter + 2, subBoxY + 3);

          if (isCurrent) {
            ctx.fillStyle = '#facc15'; // Vibrant punch yellow
          } else {
            ctx.fillStyle = '#ffffff';
          }
          ctx.fillText(wm.word, wordCenter, subBoxY);

          curX += wm.width + 18;
        });
        ctx.restore();
      }

      // ==========================================
      // PERSISTENT BOTTOM CALL-TO-ACTION (CTA)
      // ==========================================
      ctx.save();
      const btmY = 1660;
      const btmW = 920;
      const btmH = 160;
      const btmX = (W - btmW) / 2;

      // Dark glass container with neon border
      drawRoundBox(ctx, btmX, btmY, btmW, btmH, 28, 'rgba(10, 16, 30, 0.92)', 'rgba(0, 240, 255, 0.6)', 3);

      // Pulse highlight in finale
      if (sceneIdx === 4) {
        const pulse = 0.5 + Math.sin(t * 8) * 0.5;
        drawRoundBox(ctx, btmX - 4, btmY - 4, btmW + 8, btmH + 8, 32, null, 'rgba(250, 204, 21, ' + (0.4 * pulse) + ')', 4);
      }

      ctx.font = '900 32px Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('NEVER MISS ANOTHER HIGH-VALUE JOB', W / 2, btmY + 22);

      // Phone pill + Comment AVA pill
      const pillW = 400;
      const pillH = 58;
      const pill1X = W / 2 - pillW - 15;
      const pill2X = W / 2 + 15;
      const pillsY = btmY + 76;

      // Phone Pill
      drawRoundBox(ctx, pill1X, pillsY, pillW, pillH, 16, '#22c55e', '#ffffff', 2);
      ctx.font = '900 24px Arial, sans-serif';
      ctx.fillStyle = '#062811';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📞 (561) 813-8602', pill1X + pillW / 2, pillsY + pillH / 2);

      // Comment AVA Pill
      drawRoundBox(ctx, pill2X, pillsY, pillW, pillH, 16, '#facc15', '#ffffff', 2);
      ctx.font = '900 24px Arial, sans-serif';
      ctx.fillStyle = '#1e1b04';
      ctx.fillText('💬 COMMENT "AVA"', pill2X + pillW / 2, pillsY + pillH / 2);

      ctx.restore();
    };
  </script>
</body>
</html>`;

const tempHtmlPath = path.join(root, 'website/demo/temp_commercial_render.html');
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

async function render() {
  console.log('--- STARTING HVAC COMMERCIAL VIDEO RENDER ---');
  console.log('Audio file:', audioPath, 'Exists:', fs.existsSync(audioPath));
  console.log('Total frames:', totalFrames);

  const ffmpegArgs = [
    '-f', 'image2pipe',
    '-framerate', String(FPS),
    '-i', '-',
    '-i', audioPath,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    '-movflags', '+faststart',
    '-y',
    outCommercialMp4
  ];

  console.log('Launching ffmpeg process...');
  const ffmpegProc = spawn(ffmpegPath, ffmpegArgs);

  ffmpegProc.stderr.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('frame=') || msg.includes('fps=') || msg.includes('Error')) {
      process.stdout.write('\r[FFMPEG] ' + msg.trim().slice(0, 100));
    }
  });

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files', '--disable-web-security']
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  page.setDefaultNavigationTimeout(0);

  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });

  // Wait for images to load
  await page.waitForFunction(() => window.isLoaded === true, { timeout: 15000 });
  console.log('All 5 3D scene images successfully loaded in GPU context.');

  const batchSize = 60;
  let frameIdx = 0;
  const startTime = Date.now();

  console.log('Rendering frames with 3D camera parallax, lighting, and kinetic captions...');

  while (frameIdx < totalFrames) {
    const curBatch = Math.min(batchSize, totalFrames - frameIdx);
    const startF = frameIdx;

    const base64Batch = await page.evaluate(async (start, count, frameRate) => {
      const results = [];
      const cvs = document.getElementById('c');
      for (let i = 0; i < count; i++) {
        const t = (start + i) / frameRate;
        window.renderFrame(t);
        const dataUrl = cvs.toDataURL('image/jpeg', 0.90);
        results.push(dataUrl.slice(23)); // strip 'data:image/jpeg;base64,'
      }
      return results;
    }, startF, curBatch, FPS);

    for (const b64 of base64Batch) {
      const buf = Buffer.from(b64, 'base64');
      const canWrite = ffmpegProc.stdin.write(buf);
      if (!canWrite) {
        await new Promise(r => ffmpegProc.stdin.once('drain', r));
      }
    }

    frameIdx += curBatch;
    const pct = ((frameIdx / totalFrames) * 100).toFixed(1);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    process.stdout.write(`\rRendered ${frameIdx}/${totalFrames} frames (${pct}%) in ${elapsed}s`);
  }

  ffmpegProc.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpegProc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error('FFMPEG exited with code ' + code));
    });
  });

  await browser.close();
  try { fs.unlinkSync(tempHtmlPath); } catch (e) {}

  console.log('\n\n--- VIDEO ENCODING COMPLETE ---');
  console.log('Generated master MP4:', outCommercialMp4);

  // Copy to all active distribution destinations
  fs.copyFileSync(outCommercialMp4, outReel2Mp4);
  console.log('Copied to:', outReel2Mp4);

  fs.copyFileSync(outCommercialMp4, outSpeedMp4);
  console.log('Copied to:', outSpeedMp4);

  if (fs.existsSync(ARTIFACT_DIR)) {
    fs.copyFileSync(outCommercialMp4, artifactMp4);
    console.log('Copied to brain artifacts:', artifactMp4);
  }

  const stats = fs.statSync(outCommercialMp4);
  console.log(`Final file size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

render().catch(err => {
  console.error('\nRender failed:', err);
  process.exit(1);
});
