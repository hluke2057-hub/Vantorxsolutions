const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fullMasterAudio = path.resolve('website/demo/audio/reel-audio-full-master.wav');
const audioPath = fs.existsSync(fullMasterAudio) ? fullMasterAudio : path.resolve('website/demo/audio/reel-voiceover-master.mp3');
const outDir = path.resolve('website/demo/video');
const outMp4 = path.join(outDir, 'vantorx-speed-to-lead-reel.mp4');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function render() {
  console.log('--- STARTING VIRAL REEL MP4 RENDERER ---');
  console.log('Audio file:', audioPath, 'Exists:', fs.existsSync(audioPath));
  console.log('Output file:', outMp4);

  const fps = 30;
  const duration = 63.0;
  const totalFrames = Math.ceil(duration * fps);
  console.log(`Total frames to render: ${totalFrames} (${duration}s at ${fps} FPS)`);

  // Launch ffmpeg process
  const ffmpegArgs = [
    '-f', 'image2pipe',
    '-framerate', String(fps),
    '-i', '-',
    '-i', audioPath,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '21',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    '-movflags', '+faststart',
    '-y',
    outMp4
  ];

  console.log('Spawning ffmpeg process...');
  const ffmpegProc = spawn(ffmpegPath, ffmpegArgs);

  ffmpegProc.stderr.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('frame=') || msg.includes('fps=') || msg.includes('Error')) {
      process.stdout.write('\r[FFMPEG] ' + msg.trim().slice(0, 100));
    }
  });

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  page.setDefaultNavigationTimeout(0);

  const htmlPath = path.resolve('website/demo/reel-creator.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  // Render in batches of 30 frames
  const batchSize = 30;
  let frameIdx = 0;
  const startTime = Date.now();

  console.log('\nRendering frames from canvas...');

  while (frameIdx < totalFrames) {
    const curBatch = Math.min(batchSize, totalFrames - frameIdx);
    const startF = frameIdx;

    const base64Batch = await page.evaluate(async (start, count, frameRate) => {
      const results = [];
      const cvs = document.getElementById('reelCanvas');
      for (let i = 0; i < count; i++) {
        const t = (start + i) / frameRate;
        if (typeof window.renderFrame === 'function') {
          window.renderFrame(t);
        }
        const dataUrl = cvs.toDataURL('image/jpeg', 0.88);
        results.push(dataUrl.slice(23)); // strip 'data:image/jpeg;base64,'
      }
      return results;
    }, startF, curBatch, fps);

    for (const b64 of base64Batch) {
      const buf = Buffer.from(b64, 'base64');
      const canWrite = ffmpegProc.stdin.write(buf);
      if (!canWrite) {
        await new Promise(r => ffmpegProc.stdin.once('drain', r));
      }
    }

    frameIdx += curBatch;
    const elapsed = (Date.now() - startTime) / 1000;
    const pct = ((frameIdx / totalFrames) * 100).toFixed(1);
    const speed = (frameIdx / elapsed).toFixed(1);
    process.stdout.write(`\r[PROGRESS] Rendered ${frameIdx}/${totalFrames} frames (${pct}%) @ ${speed} fps`);
  }

  console.log('\nAll frames sent to ffmpeg. Finalizing MP4 stream...');
  ffmpegProc.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpegProc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('ffmpeg exited with code ' + code));
    });
    ffmpegProc.on('error', reject);
  });

  await browser.close();

  const stat = fs.statSync(outMp4);
  console.log(`\n🎉 SUCCESS! Rendered master MP4: ${outMp4} (${(stat.size / (1024*1024)).toFixed(2)} MB)`);

  const brainMp4 = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0/vantorx-speed-to-lead-reel.mp4';
  try {
    fs.copyFileSync(outMp4, brainMp4);
    console.log(`Synced to Artifact Directory: ${brainMp4}`);
  } catch (err) {
    console.warn('Artifact copy warning:', err.message);
  }
}

render().catch(err => {
  console.error('\nRender failed:', err);
  process.exit(1);
});
