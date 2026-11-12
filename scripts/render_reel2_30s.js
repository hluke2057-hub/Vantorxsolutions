// scripts/render_reel2_30s.js
// Builds VantorX Reel #2 (<30s):
// Act 1: Hook (0s - 4.8s)
// Act 2: Explanation (4.8s - 12.2s)
// Act 3: Example (12.2s - 22.8s)
// Act 4: Final Comment & CTA (22.8s - 29.0s)
// Audio: Clean ElevenLabs Voiceover + Tactile Cueva Foley SFX ONLY (NO background music).
// Video: 1080x1920 60fps Cueva 2D Kinetic Stick-Figure + HUD Animation.

const fs = require('fs');
const path = require('path');
const { execFileSync, spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

const dryVoicePath = path.resolve('website/demo/audio/reel2-30s-voiceover-dry.mp3');
const tsJsonPath = path.resolve('website/demo/audio/reel2-30s-timestamps.json');
const outWavPath = path.resolve('website/demo/audio/reel2-30s-master.wav');
const outMp3Path = path.resolve('website/demo/audio/reel2-30s-master.mp3');
const outMp4Path = path.resolve('website/demo/video/vantorx-30s-reel-2.mp4');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = Math.min(29.8, Math.ceil((tsData.duration + 0.65) * 10) / 10);
console.log(`Reel #2 Target Duration: ${TOTAL_SEC}s (${tsData.words.length} spoken words)`);

async function renderAudioMaster() {
  const voiceB64 = fs.readFileSync(dryVoicePath).toString('base64');
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const wavBase64 = await page.evaluate(async (vB64, dur, words) => {
    const sr = 44100;
    const ctx = new OfflineAudioContext(2, Math.ceil(sr * dur), sr);

    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-1.5, 0);
    limiter.ratio.setValueAtTime(12.0, 0);
    limiter.connect(ctx.destination);

    // Voice chain (NO background music per user request)
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(95, 0);

    const pres = ctx.createBiquadFilter();
    pres.type = 'peaking';
    pres.frequency.setValueAtTime(3200, 0);
    pres.gain.setValueAtTime(2.5, 0);

    const vGain = ctx.createGain();
    vGain.gain.setValueAtTime(1.0, 0);

    hp.connect(pres);
    pres.connect(vGain);
    vGain.connect(limiter);

    const vBuf = await ctx.decodeAudioData(Uint8Array.from(atob(vB64), c => c.charCodeAt(0)).buffer);
    const vSrc = ctx.createBufferSource();
    vSrc.buffer = vBuf;
    vSrc.connect(hp);
    vSrc.start(0);

    // Crisp tactile SFX chain
    const sfxGain = ctx.createGain();
    sfxGain.gain.setValueAtTime(0.60, 0);
    sfxGain.connect(limiter);

    function subHit(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(125, t);
      o.frequency.exponentialRampToValueAtTime(34, t + 0.35);
      g.gain.setValueAtTime(0.7, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.43);
    }

    function glitchBlip(t, f = 1400) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 0.45, t + 0.08);
      g.gain.setValueAtTime(0.32, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.1);
    }

    function phoneRing(t) {
      for (let k = 0; k < 2; k++) {
        const st = t + k * 0.25;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(185, st);
        g.gain.setValueAtTime(0.28, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.18);
        o.connect(g); g.connect(sfxGain); o.start(st); o.stop(st + 0.19);
      }
    }

    function avaChime(t) {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const st = t + idx * 0.045;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, st);
        g.gain.setValueAtTime(0.28, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.36);
        o.connect(g); g.connect(sfxGain); o.start(st); o.stop(st + 0.38);
      });
    }

    function smsDing(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(1046.5, t);
      o.frequency.setValueAtTime(1567.98, t + 0.08);
      g.gain.setValueAtTime(0.4, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.36);
    }

    // Find act start times from exact word timestamps
    const findWordTime = (regex, def) => {
      const w = words.find(x => regex.test(x.word));
      return w ? w.start : def;
    };
    const t8k = findWordTime(/8,000|8000/, 4.28);
    const t78 = findWordTime(/78%/, 6.84);
    const tGoogle = findWordTime(/Google/i, 13.80);
    const tFriday = findWordTime(/Imagine|Friday/i, 14.64);
    const tAva = (words.find((x, idx) => idx >= 32 && /Ava/i.test(x.word)) || { start: 17.80 }).start;
    const tTexts = findWordTime(/texts/i, 21.04);
    const tCall = (words.find((x, idx) => idx >= 48 && /^Call$/i.test(x.word)) || { start: 23.20 }).start;

    subHit(0.05);
    subHit(t8k);
    glitchBlip(t78, 1350);
    glitchBlip(tGoogle, 1100);
    phoneRing(tFriday + 0.9);
    avaChime(tAva);
    smsDing(tTexts);
    avaChime(tCall);

    const buf = await ctx.startRendering();
    const numCh = buf.numberOfChannels, numS = buf.length, dataSize = numS * numCh * 2;
    const ab = new ArrayBuffer(44 + dataSize), dv = new DataView(ab);
    const ws = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
    ws(0, 'RIFF'); dv.setUint32(4, 36 + dataSize, true); ws(8, 'WAVE'); ws(12, 'fmt ');
    dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, numCh, true);
    dv.setUint32(24, sr, true); dv.setUint32(28, sr * numCh * 2, true);
    dv.setUint16(32, numCh * 2, true); dv.setUint16(34, 16, true);
    ws(36, 'data'); dv.setUint32(40, dataSize, true);
    let off = 44;
    const c0 = buf.getChannelData(0), c1 = buf.getChannelData(1);
    for (let i = 0; i < numS; i++) {
      dv.setInt16(off, Math.max(-1, Math.min(1, c0[i])) * 0x7FFF, true); off += 2;
      dv.setInt16(off, Math.max(-1, Math.min(1, c1[i])) * 0x7FFF, true); off += 2;
    }
    const bytes = new Uint8Array(ab);
    let bin = '';
    for (let i = 0; i < bytes.byteLength; i += 8192) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + 8192, bytes.byteLength)));
    }
    return btoa(bin);
  }, voiceB64, TOTAL_SEC, tsData.words);

  await browser.close();
  fs.writeFileSync(outWavPath, Buffer.from(wavBase64, 'base64'));
  execFileSync(ffmpegPath, ['-y', '-i', outWavPath, '-codec:a', 'libmp3lame', '-b:a', '192k', outMp3Path]);
  console.log('Audio master rendered:', outMp3Path);
}

async function renderVideo() {
  const act2T = (tsData.words[11] || { start: 6.838 }).start;
  const act3T = (tsData.words[32] || { start: 14.640 }).start;
  const act4T = (tsData.words[54] || { start: 23.197 }).start;

  const html = `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:#02040a;overflow:hidden}</style></head>
  <body><canvas id="c" width="1080" height="1920"></canvas>
  <script>
  const WORDS = ${JSON.stringify(tsData.words)};
  const ACT2 = ${act2T};
  const ACT3 = ${act3T};
  const ACT4 = ${act4T};
  const W = 1080, H = 1920;
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  // Group into stable 2-3 word chunks so captions never overlap or jump awkwardly
  const CHUNKS = [];
  for (let i = 0; i < WORDS.length; i += 3) {
    const slice = WORDS.slice(i, i + 3);
    CHUNKS.push({
      start: slice[0].start,
      end: slice[slice.length - 1].end + 0.15,
      words: slice
    });
  }

  function drawStickMan(x, y, scale, pose, color = '#ffffff') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Head
    ctx.beginPath();
    ctx.arc(0, -110, 32, 0, Math.PI * 2);
    ctx.stroke();

    // Hardhat or headset hint
    if (pose === 'contractor' || pose === 'shocked') {
      ctx.beginPath();
      ctx.strokeStyle = '#fbbf24';
      ctx.arc(0, -120, 34, Math.PI, 0);
      ctx.stroke();
      ctx.strokeStyle = color;
    }

    // Torso
    ctx.beginPath();
    ctx.moveTo(0, -78);
    ctx.lineTo(0, 32);
    ctx.stroke();

    // Arms & Legs by pose
    if (pose === 'shocked') {
      ctx.beginPath();
      ctx.moveTo(0, -56); ctx.lineTo(-54, -95);
      ctx.moveTo(0, -56); ctx.lineTo(54, -95);
      ctx.moveTo(0, 32); ctx.lineTo(-34, 120);
      ctx.moveTo(0, 32); ctx.lineTo(34, 120);
      ctx.stroke();
    } else if (pose === 'tapping') {
      ctx.beginPath();
      ctx.moveTo(0, -56); ctx.lineTo(52, -32); ctx.lineTo(74, -48);
      ctx.moveTo(0, -56); ctx.lineTo(-36, -10);
      ctx.moveTo(0, 32); ctx.lineTo(-28, 120);
      ctx.moveTo(0, 32); ctx.lineTo(28, 120);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -56); ctx.lineTo(-48, -12);
      ctx.moveTo(0, -56); ctx.lineTo(52, -72);
      ctx.moveTo(0, 32); ctx.lineTo(-28, 120);
      ctx.moveTo(0, 32); ctx.lineTo(28, 120);
      ctx.stroke();
    }
    ctx.restore();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  window.renderAtTime = function(t) {
    ctx.clearRect(0, 0, W, H);
    // Dark Cueva backdrop with subtle radial grid
    const g = ctx.createRadialGradient(W/2, H*0.42, 60, W/2, H/2, H*0.85);
    g.addColorStop(0, '#0f172a');
    g.addColorStop(0.55, '#060a14');
    g.addColorStop(1, '#020307');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.lineWidth = 2;
    for (let x = 0; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Act Indicator Pill at top
    let actLabel = '01 · THE HOOK', actColor = '#f43f5e';
    if (t >= ACT4) { actLabel = '04 · STOP THE BLEED'; actColor = '#34d399'; }
    else if (t >= ACT3) { actLabel = '03 · LIVE EXAMPLE'; actColor = '#38bdf8'; }
    else if (t >= ACT2) { actLabel = '02 · WHY YOU LOSE JOBS'; actColor = '#fbbf24'; }

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = actColor;
    ctx.lineWidth = 3;
    roundRect(W/2 - 210, 110, 420, 62, 31);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = actColor;
    ctx.font = '800 26px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(actLabel, W/2, 142);

    // MAIN SCENE ARTWORK (Y = 260..1180)
    if (t < ACT2) {
      // ACT 1: VOICEMAIL BURNING $8,000
      const pulse = 1 + Math.sin(t * 8) * 0.03;
      ctx.save();
      ctx.translate(W/2, 540);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.14)';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 6;
      roundRect(-350, -170, 700, 320, 32);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fca5a5';
      ctx.font = '800 32px "Segoe UI", Arial, sans-serif';
      ctx.fillText('VOICEMAIL GRAVEYARD', 0, -98);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 124px "Segoe UI", Arial, sans-serif';
      ctx.fillText('-$8,000', 0, 10);
      ctx.fillStyle = '#f43f5e';
      ctx.font = '700 30px "Segoe UI", Arial, sans-serif';
      ctx.fillText('LOST EVERY MISSED CALL', 0, 104);
      ctx.restore();

      drawStickMan(W/2, 990, 1.4, 'shocked', '#f8fafc');
    } else if (t < ACT3) {
      // ACT 2: 78% STAT + HOMEOWNER TAPPING COMPETITOR
      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 184px "Segoe UI", Arial, sans-serif';
      ctx.fillText('78%', W/2, 410);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '800 38px "Segoe UI", Arial, sans-serif';
      ctx.fillText('HIRE WHOEVER PICKS UP FIRST', W/2, 515);

      // Google tap cards
      const cards = [
        { name: 'YOUR SHOP — NO ANSWER', sub: 'Sent to voicemail', bad: true, y: 615 },
        { name: 'COMPETITOR — ANSWERED LIVE', sub: 'Booked the $8,000 job', bad: false, y: 780 }
      ];
      cards.forEach((cd) => {
        ctx.fillStyle = cd.bad ? 'rgba(244,63,94,0.12)' : 'rgba(52,211,153,0.15)';
        ctx.strokeStyle = cd.bad ? '#f43f5e' : '#34d399';
        ctx.lineWidth = 4;
        roundRect(140, cd.y, 800, 130, 22);
        ctx.fill(); ctx.stroke();
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 34px "Segoe UI", Arial, sans-serif';
        ctx.fillText(cd.name, 180, cd.y + 48);
        ctx.fillStyle = cd.bad ? '#fda4af' : '#6ee7b7';
        ctx.font = '700 28px "Segoe UI", Arial, sans-serif';
        ctx.fillText(cd.sub, 180, cd.y + 92);
        ctx.textAlign = 'center';
      });
      drawStickMan(W/2, 1110, 0.95, 'tapping', '#fbbf24');
    } else if (t < ACT4) {
      // ACT 3: FRIDAY 7 PM AC EMERGENCY EXAMPLE + AVA 0.8s ANSWER + SMS DISPATCH
      const dt = t - ACT3;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      roundRect(130, 290, 820, 210, 28);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = '800 34px "Segoe UI", Arial, sans-serif';
      ctx.fillText('FRIDAY · 7:00 PM · EMERGENCY AC', W/2, 355);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 72px "Segoe UI", Arial, sans-serif';
      ctx.fillText('AVA ANSWERS IN 0.8s', W/2, 435);

      // Animated audio waveform
      for (let i = -10; i <= 10; i++) {
        const amp = 24 + Math.abs(Math.sin(t * 10 + i * 0.6)) * 64;
        ctx.fillStyle = '#34d399';
        roundRect(W/2 + i * 28 - 8, 630 - amp/2, 16, amp, 8);
        ctx.fill();
      }

      // Dispatched SMS card sliding up
      const smsAlpha = Math.min(1, Math.max(0.15, (dt - 2.0) / 1.5));
      ctx.save();
      ctx.globalAlpha = smsAlpha;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 5;
      roundRect(140, 760, 800, 240, 28);
      ctx.fill(); ctx.stroke();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#34d399';
      ctx.font = '800 30px "Segoe UI", Arial, sans-serif';
      ctx.fillText('SMS SENT TO YOUR PHONE', 185, 820);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 38px "Segoe UI", Arial, sans-serif';
      ctx.fillText('EMERGENCY AC JOB BOOKED', 185, 885);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 30px "Segoe UI", Arial, sans-serif';
      ctx.fillText('Qualified · Fee Quoted · Ready for Tech', 185, 945);
      ctx.textAlign = 'center';
      ctx.restore();
    } else {
      // ACT 4: FINAL COMMENT & CALL CTA
      ctx.fillStyle = '#34d399';
      ctx.font = '900 58px "Segoe UI", Arial, sans-serif';
      ctx.fillText('TEST AVA LIVE RIGHT NOW', W/2, 420);

      ctx.fillStyle = 'rgba(52, 211, 153, 0.14)';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 6;
      roundRect(120, 500, 840, 220, 34);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 94px "Segoe UI", Arial, sans-serif';
      ctx.fillText('(561) 813-8602', W/2, 615);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 62px "Segoe UI", Arial, sans-serif';
      ctx.fillText('OR COMMENT "AVA"', W/2, 830);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '700 34px "Segoe UI", Arial, sans-serif';
      ctx.fillText('WE WILL DM YOU THE FREE DEMO LINK', W/2, 900);
    }

    // WORD-SYNCED KINETIC CAPTIONS (lower safe zone Y = 1380)
    const activeChunk = CHUNKS.find(c => t >= c.start - 0.05 && t <= c.end) || CHUNKS[CHUNKS.length - 1];
    if (activeChunk && t <= WORDS[WORDS.length - 1].end + 0.5) {
      ctx.font = '900 66px "Segoe UI", Arial, sans-serif';
      const lineStr = activeChunk.words.map(w => w.word.toUpperCase()).join(' ');
      const wordsUp = activeChunk.words.map(w => ({
        txt: w.word.toUpperCase(),
        active: t >= w.start && t <= w.end + 0.08
      }));
      const widths = wordsUp.map(w => ctx.measureText(w.txt + ' ').width);
      const totalW = widths.reduce((a, b) => a + b, 0);
      let cx = W/2 - totalW/2;
      wordsUp.forEach((w, idx) => {
        ctx.textAlign = 'left';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 14;
        ctx.strokeText(w.txt, cx, 1380);
        ctx.fillStyle = w.active ? '#34d399' : '#ffffff';
        ctx.fillText(w.txt, cx, 1380);
        cx += widths[idx];
      });
      ctx.textAlign = 'center';
    }

    // Subtle VantorX watermark bottom
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.font = '800 26px "Segoe UI", Arial, sans-serif';
    ctx.fillText('VANTORX SOLUTIONS · VANTORXSOLUTIONS.COM', W/2, 1780);
  };
  </script></body></html>`;

  const htmlFile = path.resolve('scripts/tmp_reel2.html');
  fs.writeFileSync(htmlFile, html, 'utf8');

  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto('file:///' + htmlFile.replace(/\\/g, '/'), { waitUntil: 'load' });

  const fps = 30;
  const totalFrames = Math.ceil(TOTAL_SEC * fps);
  console.log(`Rendering ${totalFrames} frames @ ${fps}fps for Reel #2 (${TOTAL_SEC}s)...`);

  const ffArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', String(fps),
    '-i', 'pipe:0',
    '-i', outWavPath,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'fast',
    '-crf', '18',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    outMp4Path
  ];

  const ff = spawn(ffmpegPath, ffArgs, { stdio: ['pipe', 'ignore', 'pipe'] });
  let ffErr = '';
  ff.stderr.on('data', d => ffErr += d.toString());

  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    await page.evaluate((tm) => window.renderAtTime(tm), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) {
      await new Promise(res => ff.stdin.once('drain', res));
    }
  }
  ff.stdin.end();
  await new Promise((resolve, reject) => {
    ff.on('close', code => code === 0 ? resolve() : reject(new Error(ffErr)));
  });

  await browser.close();
  try { fs.unlinkSync(htmlFile); } catch (e) {}
  fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-30s-reel-2.mp4'));
  console.log(`✅ Reel #2 MP4 Rendered: ${outMp4Path} (${(fs.statSync(outMp4Path).size / (1024 * 1024)).toFixed(2)} MB)`);
}

(async () => {
  await renderAudioMaster();
  await renderVideo();
})();
