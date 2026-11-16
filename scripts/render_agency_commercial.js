// scripts/render_agency_commercial.js
// VantorX Solutions - High-Paced Agency Commercial (29.8s Master)
// 1080x1920 Vertical 9:16 format @ 30fps
// Fast-paced agency cuts every 2-3 seconds (11 distinct shots)
// Minimal, clean luxury typography - NO persistent banners, NO cheap templates, NO boxy subtitles

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\80451426-584a-4969-8d9c-573a8dd3a27d';

const audioPath = path.join(root, 'website/demo/audio/vantorx-agency-commercial-master.wav');
const tsJsonPath = path.join(root, 'website/demo/audio/vantorx-agency-timestamps.json');

const outCommercialMp4 = path.join(root, 'website/demo/video/vantorx-ai-receptionist-commercial.mp4');
const outReel2Mp4 = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const outSpeedMp4 = path.join(root, 'website/demo/video/vantorx-speed-to-lead-reel.mp4');
const artifactMp4 = path.join(ARTIFACT_DIR, 'vantorx-30s-reel-2.mp4');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = 29.8; // Exactly 29.8s under 30.0s max
const FPS = 30;
const W = 1080;
const H = 1920;
const totalFrames = Math.ceil(TOTAL_SEC * FPS);

console.log(`Setting up Agency Commercial Reel Pipeline: ${TOTAL_SEC}s (${totalFrames} frames @ 30fps)`);

// 11 Shots Image Sources
const shots = [
  'file:///' + path.join(root, 'website/demo/video/agency_shot01.jpg').replace(/\\/g, '/'),
  'file:///' + path.join(root, 'website/demo/video/agency_shot02.jpg').replace(/\\/g, '/'),
  'file:///' + path.join(root, 'website/demo/video/agency_shot03.jpg').replace(/\\/g, '/'),
  'file:///' + path.join(root, 'website/demo/video/agency_shot04.jpg').replace(/\\/g, '/'),
  'file:///' + path.join(root, 'website/demo/video/agency_shot05.jpg').replace(/\\/g, '/'),
  'file:///' + path.join(root, 'website/demo/video/hvac_scene3.jpg').replace(/\\/g, '/'),
  'file:///' + path.join(root, 'website/demo/video/rooftop_scene3.jpg').replace(/\\/g, '/'),
  'file:///' + path.join(root, 'website/demo/video/rooftop_scene5.jpg').replace(/\\/g, '/'),
  'file:///' + path.join(root, 'website/demo/video/hvac_scene4.jpg').replace(/\\/g, '/'),
  'file:///' + path.join(root, 'website/demo/video/hvac_scene5.jpg').replace(/\\/g, '/'),
];

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; overflow: hidden; width: 1080px; height: 1920px; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    canvas { width: 1080px; height: 1920px; image-rendering: -webkit-optimize-contrast; }
    img { display: none; }
  </style>
</head>
<body>
  ${shots.map((s, idx) => `<img id="img${idx}" src="${s}">`).join('\n  ')}
  <canvas id="c" width="1080" height="1920"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const WORDS = ${JSON.stringify(tsData.words)};
    const W = 1080, H = 1920;

    const IMAGES = [];
    for (let i = 0; i < ${shots.length}; i++) {
      IMAGES.push(document.getElementById('img' + i));
    }

    window.isLoaded = false;
    let loadedCount = 0;
    IMAGES.forEach(img => {
      if (img.complete && img.naturalWidth > 0) loadedCount++;
      else img.onload = () => { loadedCount++; if (loadedCount === IMAGES.length) window.isLoaded = true; };
    });
    if (loadedCount === IMAGES.length) window.isLoaded = true;

    // Shot Timeline: 11 Distinct Cuts (Pacing: 2.1s - 3.1s per cut)
    const SHOT_TIMINGS = [
      { start: 0.0,  end: 2.4,  imgIdx: 0, zoom: [1.00, 1.05], pan: [0, 0] },     // Shot 01: Contractor working
      { start: 2.4,  end: 4.5,  imgIdx: 1, zoom: [1.02, 1.08], pan: [0, 0], shake: true }, // Shot 02: Vibrating phone
      { start: 4.5,  end: 6.8,  imgIdx: 2, zoom: [1.00, 1.06], pan: [0, 15] },    // Shot 03: Frustrated homeowner
      { start: 6.8,  end: 9.2,  imgIdx: 3, zoom: [1.00, 1.05], pan: [0, 0] },     // Shot 04: AI answers in 0.2s
      { start: 9.2,  end: 11.5, imgIdx: 4, zoom: [1.00, 1.06], pan: [10, 0] },    // Shot 05: Customer talking naturally
      { start: 11.5, end: 13.8, imgIdx: 5, zoom: [1.04, 1.10], pan: [0, -10] },   // Shot 06: Live info capture & qualification
      { start: 13.8, end: 16.2, imgIdx: 6, zoom: [1.02, 1.07], pan: [0, 10] },    // Shot 07: Calendar dispatch locked
      { start: 16.2, end: 18.8, imgIdx: 7, zoom: [1.00, 1.05], pan: [-15, 0] },   // Shot 08: 24/7 suburban night exterior
      { start: 18.8, end: 21.4, imgIdx: 8, zoom: [1.02, 1.08], pan: [15, 0] },    // Shot 09: Owner smiling in cab
      { start: 21.4, end: 24.5, imgIdx: 9, zoom: [1.00, 1.07], pan: [0, -15] },   // Shot 10: Service van arriving
      { start: 24.5, end: 29.8, isEnding: true }                                    // Shot 11: Luxury Agency Finale
    ];

    window.renderFrame = function(t) {
      // Find current shot
      let curShot = SHOT_TIMINGS[SHOT_TIMINGS.length - 1];
      for (let i = 0; i < SHOT_TIMINGS.length; i++) {
        if (t >= SHOT_TIMINGS[i].start && t < SHOT_TIMINGS[i].end) {
          curShot = SHOT_TIMINGS[i];
          break;
        }
      }

      ctx.save();
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, W, H);

      const shotDuration = curShot.end - curShot.start;
      const shotProgress = Math.min(1, Math.max(0, (t - curShot.start) / shotDuration));

      if (!curShot.isEnding) {
        // Render Cinematic Image with Subtle Camera Move (Agency Push-in)
        let shakeX = 0, shakeY = 0;
        if (curShot.shake && t >= 2.5 && t <= 4.4) {
          shakeX = Math.sin(t * 85) * 5;
          shakeY = Math.cos(t * 95) * 4;
        }

        const z0 = curShot.zoom[0], z1 = curShot.zoom[1];
        const curZoom = z0 + (z1 - z0) * shotProgress;
        const curPanX = curShot.pan[0] * shotProgress + shakeX;
        const curPanY = curShot.pan[1] * shotProgress + shakeY;

        ctx.save();
        ctx.translate(W / 2 + curPanX, H / 2 + curPanY);
        ctx.scale(curZoom, curZoom);
        ctx.translate(-W / 2, -H / 2);

        const img = IMAGES[curShot.imgIdx];
        if (img && img.complete && img.naturalWidth > 0) {
          // Fill 1080x1920 keeping aspect ratio
          ctx.drawImage(img, -20, -20, W + 40, H + 40);
        }
        ctx.restore();

        // Cinematic 35mm Vignette & Contrast Grade
        const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, W * 0.85);
        vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vig.addColorStop(1, 'rgba(0, 0, 0, 0.58)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, W, H);

        // Subtle bottom gradient for subtitle readability (no harsh boxes)
        const subGrad = ctx.createLinearGradient(0, H - 380, 0, H);
        subGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        subGrad.addColorStop(1, 'rgba(0, 0, 0, 0.80)');
        ctx.fillStyle = subGrad;
        ctx.fillRect(0, H - 380, W, 380);

        // Shot transition subtle dip (only on cuts: 2 frames)
        const timeFromCut = t - curShot.start;
        if (timeFromCut < 0.08) {
          const cutFade = (1 - (timeFromCut / 0.08)) * 0.45;
          ctx.fillStyle = 'rgba(0, 0, 0, ' + cutFade + ')';
          ctx.fillRect(0, 0, W, H);
        }

      } else {
        // ==========================================
        // SHOT 11: LUXURY AGENCY FINALE (24.5s - 29.8s)
        // Clean, minimal typography per user prompt
        // ==========================================
        const bgGrad = ctx.createRadialGradient(W / 2, H * 0.48, 100, W / 2, H * 0.5, W * 0.95);
        bgGrad.addColorStop(0, '#0b1329');
        bgGrad.addColorStop(0.65, '#050814');
        bgGrad.addColorStop(1, '#020307');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Elegant ambient glow
        const glow = ctx.createRadialGradient(W / 2, H * 0.45, 20, W / 2, H * 0.45, 450);
        glow.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        // Entrance fade
        const fadeProgress = Math.min(1, Math.max(0, (t - 24.5) / 0.6));
        ctx.globalAlpha = fadeProgress;

        // Header: "STOP LOSING CUSTOMERS TO MISSED CALLS."
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.font = '700 28px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
        ctx.letterSpacing = '4px';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fillText('STOP LOSING CUSTOMERS TO MISSED CALLS', W / 2, H * 0.36);

        // Subhead: "Let AI Answer Every Call."
        ctx.font = '800 48px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 16;
        ctx.fillText('Let AI Answer Every Call.', W / 2, H * 0.42);

        // Luxury Brand Logo
        ctx.font = '900 76px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
        ctx.letterSpacing = '12px';
        ctx.fillStyle = '#38bdf8'; // Clean cyan luxury brand accent
        ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
        ctx.shadowBlur = 24;
        ctx.fillText('VANTORX', W / 2, H * 0.52);

        // Minimalist Website Link
        ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
        ctx.letterSpacing = '3px';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.shadowBlur = 0;
        ctx.fillText('vantorxsolutions.com', W / 2, H * 0.58);

        ctx.restore();
      }

      // ==========================================
      // MINIMAL, CLEAN TYPOGRAPHY (SUBTITLES)
      // Only during speech (0.0s - 24.5s)
      // No boxes, no banners, pure luxury commercial style
      // ==========================================
      if (t < 24.5) {
        let activeWordIdx = -1;
        for (let i = 0; i < WORDS.length; i++) {
          if (t >= WORDS[i].start && t <= WORDS[i].end + 0.12) {
            activeWordIdx = i;
            break;
          }
        }
        if (activeWordIdx === -1 && WORDS.length > 0) {
          for (let i = WORDS.length - 1; i >= 0; i--) {
            if (t >= WORDS[i].end && t <= WORDS[i].end + 0.4) {
              activeWordIdx = i;
              break;
            }
          }
        }

        if (activeWordIdx !== -1 && activeWordIdx < WORDS.length - 1) { // Don't show "VantorX" in subtitle since it appears on logo card
          const windowSize = 4;
          const startW = Math.max(0, activeWordIdx - 1);
          const endW = Math.min(WORDS.length - 1, startW + windowSize);
          const chunk = WORDS.slice(startW, endW);

          ctx.save();
          const subY = 1710;
          ctx.font = '800 42px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Measure full chunk width with clean spacing
          let totalChunkW = 0;
          const wordMetrics = chunk.map(w => {
            const clean = w.word.replace(/[.,?]/g, '').toUpperCase();
            const m = ctx.measureText(clean).width;
            totalChunkW += m + 16;
            return { word: clean, width: m, orig: w };
          });
          totalChunkW -= 16;

          let curX = W / 2 - totalChunkW / 2;
          wordMetrics.forEach(wm => {
            const isCurrent = (wm.orig === WORDS[activeWordIdx]);
            const wordCenter = curX + wm.width / 2;

            // Soft shadow behind text for readability over any background
            ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;

            if (isCurrent) {
              ctx.fillStyle = '#fef08a'; // Soft warm highlight
              ctx.fillText(wm.word, wordCenter, subY);
            } else {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
              ctx.fillText(wm.word, wordCenter, subY);
            }

            curX += wm.width + 16;
          });
          ctx.restore();
        }
      }

      ctx.restore();
    };
  </script>
</body>
</html>`;

const tempHtmlPath = path.join(root, 'website/demo/temp_agency_render.html');
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

async function render() {
  console.log('--- STARTING HIGH-PACED AGENCY COMMERCIAL VIDEO RENDER ---');
  console.log('Audio file:', audioPath, 'Exists:', fs.existsSync(audioPath));
  console.log('Total frames:', totalFrames);

  const ffmpegArgs = [
    '-f', 'image2pipe',
    '-framerate', String(FPS),
    '-i', '-',
    '-i', audioPath,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '19',
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
  console.log('All agency scene images successfully loaded in GPU context.');

  const batchSize = 60;
  let frameIdx = 0;
  const startTime = Date.now();

  console.log('Rendering frames with 11 agency cuts, ARRI color grade, and minimal typography...');

  while (frameIdx < totalFrames) {
    const curBatch = Math.min(batchSize, totalFrames - frameIdx);
    const startF = frameIdx;

    const base64Batch = await page.evaluate(async (start, count, frameRate) => {
      const results = [];
      const cvs = document.getElementById('c');
      for (let i = 0; i < count; i++) {
        const t = (start + i) / frameRate;
        window.renderFrame(t);
        const dataUrl = cvs.toDataURL('image/jpeg', 0.92);
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

  fs.copyFileSync(outCommercialMp4, artifactMp4);
  console.log('Copied to artifact dir:', artifactMp4);

  // Extract verification proof frames at key timestamps
  const proofFrames = [
    { name: 'agency_proof_frame_02s.jpg', time: '00:00:02.000' },
    { name: 'agency_proof_frame_04s.jpg', time: '00:00:04.000' },
    { name: 'agency_proof_frame_06s.jpg', time: '00:00:06.000' },
    { name: 'agency_proof_frame_08s.jpg', time: '00:00:08.500' },
    { name: 'agency_proof_frame_11s.jpg', time: '00:00:11.000' },
    { name: 'agency_proof_frame_13s.jpg', time: '00:00:13.000' },
    { name: 'agency_proof_frame_15s.jpg', time: '00:00:15.500' },
    { name: 'agency_proof_frame_18s.jpg', time: '00:00:18.000' },
    { name: 'agency_proof_frame_20s.jpg', time: '00:00:20.500' },
    { name: 'agency_proof_frame_23s.jpg', time: '00:00:23.000' },
    { name: 'agency_proof_frame_28s.jpg', time: '00:00:27.500' }
  ];

  for (const pf of proofFrames) {
    const proofPath = path.join(ARTIFACT_DIR, pf.name);
    const ffmpegProof = spawn(ffmpegPath, [
      '-ss', pf.time,
      '-i', outCommercialMp4,
      '-vframes', '1',
      '-q:v', '2',
      '-y',
      proofPath
    ]);
    await new Promise(r => ffmpegProof.on('close', r));
    console.log(`Saved proof frame (${pf.time}):`, pf.name);
  }

  console.log('\n--- AGENCY COMMERCIAL MASTERING COMPLETED SUCCESSFULLY ---');
}

render().catch(err => {
  console.error('Fatal render error:', err);
  process.exit(1);
});
