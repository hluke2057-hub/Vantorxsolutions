// scripts/patch_reel_captions_and_crt.js
const fs = require('fs');
const path = require('path');

const chunksFile = path.resolve('website/demo/audio/caption_chunks.json');
const engineFile = path.resolve('scripts/taskless_engine_code.js');
const targetHtml = path.resolve('website/demo/reel-creator.html');

const captionChunks = JSON.parse(fs.readFileSync(chunksFile, 'utf8'));
let code = fs.readFileSync(engineFile, 'utf8');

// Embed chunks directly at top of caption section
const chunksStr = `const CAPTION_CHUNKS = ${JSON.stringify(captionChunks)};`;

const newCaptionAndCrtCode = `
// ----------------------------------------------------------------------------
// PRECISE KINETIC CAPTIONS — EXACT AUDIO WORD ALIGNED (NO RUBBER BAND JITTER)
// ----------------------------------------------------------------------------
${chunksStr}

function renderPreciseCaptions(time) {
  const chunk = CAPTION_CHUNKS.find(c => time >= c.start && time < c.end);
  if (!chunk) return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Anchored to screen coordinates for rock-solid stability

  const subY = H - 180;
  ctx.font = '900 42px "Space Grotesk", "Inter", sans-serif';
  ctx.textBaseline = 'middle';

  const spaceW = ctx.measureText(' ').width;
  const wordWidths = chunk.words.map(w => ctx.measureText(w.rawWord).width);
  const totalTextW = wordWidths.reduce((a, b) => a + b, 0) + (chunk.words.length - 1) * spaceW;

  // Background pill
  const padX = 26;
  const padY = 14;
  const pillW = totalTextW + padX * 2;
  const pillH = 58 + padY;
  const pillX = (W - pillW) / 2;
  const pillY = subY - pillH / 2;
  const radius = 16;

  // High-Contrast Frosted Dark Glass Pill
  ctx.fillStyle = 'rgba(7, 10, 18, 0.88)';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, radius);
  ctx.fill();

  ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, radius);
  ctx.stroke();

  // Draw Words with Millisecond Highlight Precision
  let curX = pillX + padX;
  chunk.words.forEach((w, idx) => {
    const isSpoken = (time >= w.start && time < w.end);
    const hasBeenSpoken = (time >= w.end);

    ctx.save();
    if (isSpoken) {
      // Currently spoken word: Electric amber gold with soft glow
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = 'rgba(250, 204, 21, 0.7)';
      ctx.shadowBlur = 12;
      ctx.font = '900 43px "Space Grotesk", "Inter", sans-serif';
    } else if (hasBeenSpoken) {
      // Already spoken in phrase: Soft amber-white
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 6;
      ctx.font = '900 42px "Space Grotesk", "Inter", sans-serif';
    } else {
      // Upcoming in phrase: Clean crisp white
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 6;
      ctx.font = '900 42px "Space Grotesk", "Inter", sans-serif';
    }

    ctx.fillText(w.rawWord, curX, subY);
    ctx.restore();

    curX += wordWidths[idx] + spaceW;
  });

  ctx.restore();
}

// ----------------------------------------------------------------------------
// CUEVA-GRADE CRT SCANLINES & ANALOG RETRO SHADER
// ----------------------------------------------------------------------------
function renderCRTScanlines(time) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // 1. Fine Horizontal Scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 1.5);
  }

  // 2. Slow Vertical Beam Refresh Sweep
  const beamY = (time * 160) % (H + 300) - 150;
  const beamGrad = ctx.createLinearGradient(0, beamY - 100, 0, beamY + 100);
  beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  beamGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.035)');
  beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(0, beamY - 100, W, 200);

  // 3. Subtle CRT Vignette Curve
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.38, W / 2, H / 2, H * 0.78);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(5, 7, 13, 0.42)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}
`;

// Locate renderKineticSubtitles in taskless_engine_code.js
const subStart = code.indexOf('function renderKineticSubtitles(time) {');
const subEnd = code.indexOf('function renderFrame(time) {');

if (subStart === -1 || subEnd === -1) {
  console.error('Could not locate renderKineticSubtitles markers in taskless_engine_code.js', { subStart, subEnd });
  process.exit(1);
}

// Replace subtitle function with new precise captions and CRT scanlines
code = code.slice(0, subStart) + newCaptionAndCrtCode + '\n\n' + code.slice(subEnd);

// In renderFrame, replace renderKineticSubtitles(time) with renderPreciseCaptions(time) and renderCRTScanlines(time)
code = code.replace(
  'renderKineticSubtitles(time);',
  'renderPreciseCaptions(time);\n  renderCRTScanlines(time);'
);

fs.writeFileSync(engineFile, code, 'utf8');
console.log('✓ Successfully patched scripts/taskless_engine_code.js with Precise Captions & CRT Scanlines!');

// Now inject into website/demo/reel-creator.html
let html = fs.readFileSync(targetHtml, 'utf8');
const startMarker = 'window.WORD_TIMESTAMPS = WORD_TIMESTAMPS;';
const endMarker = '// Animation Loop: Bound Directly to Hardware Audio Clock';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not locate markers in reel-creator.html', { startIdx, endIdx });
  process.exit(1);
}

const replaceStart = startIdx + startMarker.length;
const updatedHtml = html.slice(0, replaceStart) + '\n\n' + code + '\n\n' + html.slice(endIdx);
fs.writeFileSync(targetHtml, updatedHtml, 'utf8');
console.log('✓ Successfully injected updated engine into website/demo/reel-creator.html!');
console.log('New reel-creator.html size:', (updatedHtml.length / 1024).toFixed(1), 'KB');
