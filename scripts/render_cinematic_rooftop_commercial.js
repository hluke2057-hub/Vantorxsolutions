// scripts/render_cinematic_rooftop_commercial.js
// ELITE 3D VIRAL COMMERCIAL: "The 130°F Rooftop Mirage"
// High-End 3D Animated Commercial (Unreal Engine 5 / Pixar Aesthetic)
// Dynamic Camera Parallax, Heat Shimmer Shaders, Real Foley & Acoustic Score

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');
const { spawn } = require('child_process');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const audioWavPath = path.join(root, 'website/demo/audio/rooftop-master.wav');
const tsJsonPath = path.join(root, 'website/demo/audio/rooftop-timestamps.json');
const outVideoPath = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const FPS = 30;
const DURATION_SEC = Number(tsData.duration || 43.096) + 0.6; // ~43.7s
const TOTAL_FRAMES = Math.ceil(DURATION_SEC * FPS);

console.log(`Starting Cinematic 3D Commercial Render: ${DURATION_SEC.toFixed(2)}s (${TOTAL_FRAMES} frames @ ${FPS} FPS)`);

// Read 5 3D Scene Images as base64
const img1B64 = fs.readFileSync(path.join(root, 'website/demo/video/rooftop_scene1.jpg')).toString('base64');
const img2B64 = fs.readFileSync(path.join(root, 'website/demo/video/rooftop_scene2.jpg')).toString('base64');
const img3B64 = fs.readFileSync(path.join(root, 'website/demo/video/rooftop_scene3.jpg')).toString('base64');
const img4B64 = fs.readFileSync(path.join(root, 'website/demo/video/rooftop_scene4.jpg')).toString('base64');
const img5B64 = fs.readFileSync(path.join(root, 'website/demo/video/rooftop_scene5.jpg')).toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #000; overflow: hidden; width: 1080px; height: 1920px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    canvas { width: 1080px; height: 1920px; display: block; }
  </style>
</head>
<body>
  <canvas id="c" width="1080" height="1920"></canvas>
  <script>
    const width = 1080;
    const height = 1920;
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const wordTimestamps = ${JSON.stringify(tsData.words)};

    // Load Image Elements
    const img1 = new Image(); img1.src = 'data:image/jpeg;base64,${img1B64}';
    const img2 = new Image(); img2.src = 'data:image/jpeg;base64,${img2B64}';
    const img3 = new Image(); img3.src = 'data:image/jpeg;base64,${img3B64}';
    const img4 = new Image(); img4.src = 'data:image/jpeg;base64,${img4B64}';
    const img5 = new Image(); img5.src = 'data:image/jpeg;base64,${img5B64}';

    window.imagesLoaded = false;
    let loadedCount = 0;
    [img1, img2, img3, img4, img5].forEach(im => {
      im.onload = () => {
        loadedCount++;
        if (loadedCount === 5) window.imagesLoaded = true;
      };
    });

    window.renderFrameAtTime = function(t) {
      ctx.clearRect(0, 0, width, height);

      // Determine active scene based on narrative beats
      // Scene 1: 0.0s - 6.5s (Hook: 130°F on roof, heavy compressor)
      // Scene 2: 6.5s - 17.0s (The Dilemma: phone vibrating, frantic homeowner)
      // Scene 3: 17.0s - 27.5s (The Solution: AVA Voice AI connects in 0.8s)
      // Scene 4: 27.5s - 34.5s (The Payoff: Job finished, relief, $5,200 confirmed)
      // Scene 5: 34.5s - 43.7s (The CTA: Call (561) 813-8602, comment AVA)

      let activeImg, p, titleLine1, titleLine2;

      if (t < 6.5) {
        // SCENE 1: THE ROOFTOP HOOK
        activeImg = img1;
        p = t / 6.5;

        // Cinematic Dolly-in & Subtle Pan
        const scale = 1.0 + p * 0.08;
        const shiftX = Math.sin(p * Math.PI) * 15;
        const shiftY = p * -25;

        ctx.save();
        ctx.translate(width / 2 + shiftX, height / 2 + shiftY);
        ctx.scale(scale, scale);
        ctx.drawImage(activeImg, -width / 2, -height / 2, width, height);

        // Heat shimmer wave distortion overlay on bottom third
        const shimmerAlpha = 0.06 + Math.sin(t * 8.0) * 0.03;
        ctx.fillStyle = 'rgba(255, 230, 180, ' + shimmerAlpha + ')';
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.restore();

        titleLine1 = '130°F ON THIS ROOF';
        titleLine2 = 'HANDS LOCKED ON A 200 LB COMPRESSOR';
      }
      else if (t < 17.0) {
        // SCENE 2: THE DILEMMA
        activeImg = img2;
        p = (t - 6.5) / 10.5;

        const scale = 1.0 + p * 0.07;
        let shakeX = 0;
        let shakeY = 0;

        // Synchronize camera shake with phone vibration (6.8s - 10.5s)
        if ((t > 6.8 && t < 7.6) || (t > 8.6 && t < 9.4)) {
          shakeX = Math.sin(t * 60.0) * 4.5;
          shakeY = Math.cos(t * 60.0) * 3.5;
        }

        ctx.save();
        ctx.translate(width / 2 + shakeX, height / 2 + shakeY);
        ctx.scale(scale, scale);
        ctx.drawImage(activeImg, -width / 2, -height / 2, width, height);
        ctx.restore();

        titleLine1 = 'INCOMING EMERGENCY CALL';
        titleLine2 = 'IF YOU LET GO IT DROPS. IF YOU MISS IT SHE CALLS A RIVAL.';
      }
      else if (t < 27.5) {
        // SCENE 3: THE AVA SOLUTION
        activeImg = img3;
        p = (t - 17.0) / 10.5;

        const scale = 1.0 + p * 0.06;
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(scale, scale);
        ctx.drawImage(activeImg, -width / 2, -height / 2, width, height);

        // Dynamic glowing audio waveform rings on phone screen
        const pulse = Math.sin(t * 6.0) * 0.5 + 0.5;
        ctx.strokeStyle = 'rgba(0, 240, 255, ' + (0.4 + pulse * 0.4) + ')';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 180, 70 + pulse * 35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        titleLine1 = '⚡ AVA CONNECTED (0.8s)';
        titleLine2 = 'CALM HUMAN EMPATHY • AUTOMATIC DISPATCH';
      }
      else if (t < 34.5) {
        // SCENE 4: THE PAYOFF
        activeImg = img4;
        p = (t - 27.5) / 7.0;

        const scale = 1.0 + p * 0.06;
        const shiftY = p * -18;

        ctx.save();
        ctx.translate(width / 2, height / 2 + shiftY);
        ctx.scale(scale, scale);
        ctx.drawImage(activeImg, -width / 2, -height / 2, width, height);
        ctx.restore();

        // Slide down clean dispatch confirmation pill
        const bannerSlide = Math.min(1.0, (t - 27.5) / 0.8);
        const bannerY = -120 + bannerSlide * 350;

        ctx.save();
        ctx.fillStyle = 'rgba(12, 22, 36, 0.92)';
        ctx.roundRect(width / 2 - 380, bannerY, 760, 140, 24);
        ctx.fill();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = '800 30px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✓ EMERGENCY DISPATCH CONFIRMED', width / 2, bannerY + 52);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 44px -apple-system, sans-serif';
        ctx.fillText('$5,200 JOB ON YOUR CALENDAR', width / 2, bannerY + 104);
        ctx.restore();

        titleLine1 = 'YOU NEVER LEFT THE JOB';
        titleLine2 = 'THE REVENUE IS ALREADY SECURED';
      }
      else {
        // SCENE 5: THE LIVE CTA
        activeImg = img5;
        p = (t - 34.5) / 9.2;

        const scale = 1.0 + p * 0.05;
        const rot = Math.sin(p * Math.PI) * 0.015;

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(rot);
        ctx.scale(scale, scale);
        ctx.drawImage(activeImg, -width / 2, -height / 2, width, height);
        ctx.restore();

        // Elegant bottom CTA card
        ctx.save();
        ctx.fillStyle = 'rgba(10, 16, 28, 0.92)';
        ctx.roundRect(width / 2 - 400, 1220, 800, 360, 32);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 32px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TEST AVA LIVE RIGHT NOW', width / 2, 1285);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 76px -apple-system, sans-serif';
        ctx.fillText('(561) 813-8602', width / 2, 1375);

        // Button
        ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
        ctx.roundRect(width / 2 - 320, 1425, 640, 90, 20);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 36px -apple-system, sans-serif';
        ctx.fillText('COMMENT "AVA" BELOW', width / 2, 1482);
        ctx.restore();

        titleLine1 = '';
        titleLine2 = '';
      }

      // UPPER TITLE OVERLAY (Clean, broadcast advertising typography)
      if (titleLine1 && t < 34.5) {
        ctx.save();
        // Subtle dark translucent gradient backing on top for extreme legibility
        const topGrad = ctx.createLinearGradient(0, 0, 0, 420);
        topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
        topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, width, 420);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 56px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 18;
        ctx.fillText(titleLine1, width / 2, 240);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 34px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(titleLine2, width / 2, 305);
        ctx.restore();
      }

      // KINETIC WORD-BY-WORD SUBTITLES
      const activeWord = wordTimestamps.find(w => t >= w.start && t <= w.end);
      if (activeWord && t < 34.5) {
        const curIdx = wordTimestamps.indexOf(activeWord);
        const startIdx = Math.max(0, curIdx - 2);
        const endIdx = Math.min(wordTimestamps.length, curIdx + 3);
        const snippet = wordTimestamps.slice(startIdx, endIdx);

        ctx.save();
        ctx.font = '900 48px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textStr = snippet.map(w => w.word).join(' ');
        const textWidth = ctx.measureText(textStr).width;

        // Subtle dark pill
        ctx.fillStyle = 'rgba(10, 14, 24, 0.88)';
        ctx.roundRect(width / 2 - textWidth / 2 - 32, 1640, textWidth + 64, 86, 24);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        let curX = width / 2 - textWidth / 2;
        ctx.textAlign = 'left';
        snippet.forEach(w => {
          const wWidth = ctx.measureText(w.word + ' ').width;
          if (w === activeWord) {
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 14;
          } else {
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 0;
          }
          ctx.fillText(w.word, curX, 1683);
          curX += wWidth;
        });
        ctx.restore();
      }

      return canvas.toDataURL('image/jpeg', 0.90);
    };
  </script>
</body>
</html>`;

(async () => {
  console.log('Launching browser to render Cinematic Commercial...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1080,1920'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.setContent(html);

  // Wait for all 5 images to finish loading
  await page.waitForFunction(() => window.imagesLoaded === true, { timeout: 15000 });
  console.log('All 5 3D Scene master plates loaded into canvas context.');

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
      console.log(`[CINEMATIC 3D RENDER] Frame ${f}/${TOTAL_FRAMES} (${pct}%) — ${elapsed}s elapsed`);
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
  console.log(`✅ Cinematic 3D Commercial Rendered: ${outVideoPath} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
})().catch(err => {
  console.error('Render failed:', err);
  process.exit(1);
});
