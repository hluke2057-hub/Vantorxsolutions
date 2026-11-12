// scripts/render_nvidia_reel.js
// Renders VantorX Viral Reel: "Nvidia's CEO Cheated" (<28s):
// Hook -> Story -> Nobody's Perfect -> AVA Promotion & CTA
// Visuals: Cueva stick-figure animation (Jensen Huang, Sega boardroom, Contractor on ladder, AVA AI)
// Audio: Clean ElevenLabs Voiceover + Tactile SFX (sub-hits, glitch blips, funding chime, AVA chime, SMS ding)

const fs = require('fs');
const path = require('path');
const { execFileSync, spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

const dryVoicePath = path.join(root, 'website/demo/audio/reel-nvidia-voiceover-dry.mp3');
const tsJsonPath = path.join(root, 'website/demo/audio/reel-nvidia-timestamps.json');
const outWavPath = path.join(root, 'website/demo/audio/reel-nvidia-master.wav');
const outMp3Path = path.join(root, 'website/demo/audio/reel-nvidia-master.mp3');
const outMp4Path = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const outNamedMp4 = path.join(root, 'website/demo/video/vantorx-nvidia-reel.mp4');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = Math.min(28.0, Math.ceil((tsData.duration + 0.8) * 10) / 10);
console.log(`Reel Target Duration: ${TOTAL_SEC}s (${tsData.words.length} spoken words)`);

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

    // Voice EQ
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

    // Tactile Foley SFX chain
    const sfxGain = ctx.createGain();
    sfxGain.gain.setValueAtTime(0.65, 0);
    sfxGain.connect(limiter);

    function subHit(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(130, t);
      o.frequency.exponentialRampToValueAtTime(32, t + 0.38);
      g.gain.setValueAtTime(0.75, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.46);
    }

    function glitchBlip(t, f = 1450) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 0.4, t + 0.08);
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.1);
    }

    function cashChime(t) {
      [784, 988, 1175, 1568].forEach((freq, idx) => {
        const st = t + idx * 0.04;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, st);
        g.gain.setValueAtTime(0.3, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.4);
        o.connect(g); g.connect(sfxGain); o.start(st); o.stop(st + 0.42);
      });
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

    // Trigger SFX at exact spoken moments
    subHit(0.05); // Hook boom
    glitchBlip(1.15, 1600); // "cheated"
    subHit(2.6); // "Let me explain"
    glitchBlip(6.0, 900); // "broken chip"
    subHit(7.2); // "thirty days"
    cashChime(10.5); // "got five million anyway"
    glitchBlip(12.2, 1400); // "automation"
    subHit(14.0); // "Nobody is perfect"
    glitchBlip(15.8, 800); // "voicemail"
    avaChime(17.2); // "Meet AVA"
    smsDing(21.4); // "books jobs"
    avaChime(23.0); // "Call"

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
  console.log('Audio master rendered successfully:', outMp3Path);
}

async function renderVideo() {
  // Act transitions:
  // Act 1: 0 -> 2.61s
  // Act 2: 2.61s -> 12.27s (Sega story)
  // Act 3: 12.27s -> 16.39s (Nobody is perfect & Contractor)
  // Act 4: 16.39s -> End (AVA Voice AI Promotion)
  const ACT2 = 2.61;
  const ACT3 = 12.27;
  const ACT4 = 16.39;

  const html = `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:#02040a;overflow:hidden}</style></head>
  <body><canvas id="c" width="1080" height="1920"></canvas>
  <script>
  const WORDS = ${JSON.stringify(tsData.words)};
  const ACT2 = ${ACT2};
  const ACT3 = ${ACT3};
  const ACT4 = ${ACT4};
  const W = 1080, H = 1920;
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  // Group into stable 2-3 word caption chunks
  const CHUNKS = [];
  for (let i = 0; i < WORDS.length; i += 3) {
    const slice = WORDS.slice(i, i + 3);
    CHUNKS.push({
      start: slice[0].start,
      end: slice[slice.length - 1].end + 0.15,
      words: slice
    });
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  // Draw Jensen Huang stick figure with black leather jacket & green chip
  function drawJensen(x, y, scale = 1.0, pose = 'talking') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Head
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -110, 32, 0, Math.PI * 2);
    ctx.stroke();

    // Glasses
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.strokeRect(-22, -116, 18, 12);
    ctx.strokeRect(4, -116, 18, 12);
    ctx.beginPath(); ctx.moveTo(-4, -110); ctx.lineTo(4, -110); ctx.stroke();

    // Leather jacket torso (dark charcoal with neon trim)
    ctx.lineWidth = 10;
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#22c55e'; // Nvidia neon green
    roundRect(-24, -78, 48, 108, 12);
    ctx.fill(); ctx.stroke();

    // Arms
    ctx.strokeStyle = '#ffffff';
    if (pose === 'chip') {
      // Left arm holding green chip up
      ctx.beginPath();
      ctx.moveTo(-20, -56); ctx.lineTo(-65, -85); ctx.lineTo(-75, -120);
      ctx.stroke();

      // Glowing Nvidia chip in hand
      ctx.fillStyle = '#22c55e';
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 4;
      roundRect(-95, -145, 40, 40, 8);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#052e16';
      ctx.font = '900 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GPU', -75, -122);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 10;

      // Right arm gesturing
      ctx.beginPath();
      ctx.moveTo(20, -56); ctx.lineTo(55, -20); ctx.lineTo(75, -45);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-20, -56); ctx.lineTo(-55, -15);
      ctx.moveTo(20, -56); ctx.lineTo(55, -15);
      ctx.stroke();
    }

    // Legs
    ctx.beginPath();
    ctx.moveTo(-12, 30); ctx.lineTo(-24, 120);
    ctx.moveTo(12, 30); ctx.lineTo(24, 120);
    ctx.stroke();

    ctx.restore();
  }

  // Draw Sega Boardroom Executive stick figure
  function drawSegaBoss(x, y, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#94a3b8';

    // Head
    ctx.beginPath(); ctx.arc(0, -110, 30, 0, Math.PI * 2); ctx.stroke();

    // Tie
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath(); ctx.moveTo(0, -78); ctx.lineTo(0, -30); ctx.stroke();

    // Torso
    ctx.strokeStyle = '#64748b';
    ctx.beginPath(); ctx.moveTo(0, -78); ctx.lineTo(0, 32); ctx.stroke();

    // Arm holding out funding check/contract
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(0, -56); ctx.lineTo(-45, -30); ctx.lineTo(-75, -30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -56); ctx.lineTo(35, 10); ctx.stroke();

    // $5M contract document
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    roundRect(-125, -50, 48, 36, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#041f14';
    ctx.font = '900 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('$5M', -101, -28);

    // Legs
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(0, 32); ctx.lineTo(-20, 115); ctx.moveTo(0, 32); ctx.lineTo(20, 115); ctx.stroke();

    ctx.restore();
  }

  // Draw Contractor on ladder stick figure
  function drawContractor(x, y, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffffff';

    // Head & Hardhat
    ctx.beginPath(); ctx.arc(0, -110, 32, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(0, -120, 34, Math.PI, 0); ctx.stroke();
    ctx.strokeStyle = '#ffffff';

    // Torso
    ctx.beginPath(); ctx.moveTo(0, -78); ctx.lineTo(0, 32); ctx.stroke();

    // Arms up holding tools
    ctx.beginPath(); ctx.moveTo(0, -56); ctx.lineTo(-50, -90);
    ctx.moveTo(0, -56); ctx.lineTo(50, -90); ctx.stroke();

    // Legs on ladder rungs
    ctx.beginPath(); ctx.moveTo(0, 32); ctx.lineTo(-28, 120);
    ctx.moveTo(0, 32); ctx.lineTo(28, 120); ctx.stroke();

    // Ladder rungs behind
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 8;
    for (let r = -60; r <= 160; r += 45) {
      ctx.beginPath(); ctx.moveTo(-60, r); ctx.lineTo(60, r); ctx.stroke();
    }

    ctx.restore();
  }

  // Draw AVA AI Cybernetic Agent
  function drawAvaAgent(x, y, scale = 1.0, t = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#38bdf8';

    // Glowing Halo Ring
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(0, -150, 42, 14, 0, 0, Math.PI * 2); ctx.stroke();

    // Head with cyber visor
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(0, -110, 32, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    roundRect(-24, -118, 48, 14, 6);
    ctx.fill();

    // Headset
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, -110, 36, -Math.PI*0.5, Math.PI*0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(34, -100); ctx.lineTo(44, -92); ctx.stroke();

    // Cyber Torso
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(0, -78); ctx.lineTo(0, 32); ctx.stroke();

    // Arms conducting audio waves
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(0, -56); ctx.lineTo(-58, -45); ctx.lineTo(-80, -70);
    ctx.moveTo(0, -56); ctx.lineTo(58, -45); ctx.lineTo(80, -70); ctx.stroke();

    // Legs
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath(); ctx.moveTo(0, 32); ctx.lineTo(-24, 120);
    ctx.moveTo(0, 32); ctx.lineTo(24, 120); ctx.stroke();

    ctx.restore();
  }

  window.renderAtTime = function(t) {
    ctx.clearRect(0, 0, W, H);

    // Deep obsidian background with subtle radial glow
    const g = ctx.createRadialGradient(W/2, H*0.42, 80, W/2, H/2, H*0.85);
    g.addColorStop(0, '#0c1322');
    g.addColorStop(0.55, '#050811');
    g.addColorStop(1, '#020306');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.lineWidth = 2;
    for (let x = 0; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Act Indicator Pill at top
    let actLabel = '01 · THE HOOK', actColor = '#f43f5e';
    if (t >= ACT4) { actLabel = '04 · THE UNFAIR ADVANTAGE'; actColor = '#34d399'; }
    else if (t >= ACT3) { actLabel = '03 · NOBODY IS PERFECT'; actColor = '#fbbf24'; }
    else if (t >= ACT2) { actLabel = '02 · WHAT JENSEN DID'; actColor = '#22c55e'; }

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = actColor;
    ctx.lineWidth = 3;
    roundRect(W/2 - 230, 110, 460, 62, 31);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = actColor;
    ctx.font = '800 24px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(actLabel, W/2, 142);

    // ==============================================================
    // MAIN SCENE ARTWORK (Y = 240..1200)
    // ==============================================================

    if (t < ACT2) {
      // ------------------------------------------------------------
      // ACT 1: THE HOOK — NVIDIA'S CEO CHEATED
      // ------------------------------------------------------------
      const pulse = 1 + Math.sin(t * 8) * 0.03;
      ctx.save();
      ctx.translate(W/2, 480);
      ctx.scale(pulse, pulse);

      // Alert container
      ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 6;
      roundRect(-420, -160, 840, 310, 32);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#fca5a5';
      ctx.font = '800 30px "Segoe UI", Arial, sans-serif';
      ctx.fillText('THE $3 TRILLION SECRET', 0, -96);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 82px "Segoe UI", Arial, sans-serif';
      ctx.fillText("NVIDIA'S CEO", 0, -10);

      ctx.fillStyle = '#f43f5e';
      ctx.font = '900 102px "Segoe UI", Arial, sans-serif';
      ctx.fillText('CHEATED.', 0, 92);
      ctx.restore();

      // Jensen Huang holding green GPU chip
      drawJensen(W/2, 1020, 1.45, 'chip');

    } else if (t < ACT3) {
      // ------------------------------------------------------------
      // ACT 2: THE DEPTH — 1995 SEGA BOARDROOM PIVOT
      // ------------------------------------------------------------
      const dt = t - ACT2;

      // Status HUD Banner
      ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      roundRect(100, 270, 880, 240, 24);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#86efac';
      ctx.font = '800 30px "Segoe UI", Arial, sans-serif';
      ctx.fillText('1995 · NV1 CHIP FAILED COMPLETELY', W/2, 330);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 64px "Segoe UI", Arial, sans-serif';
      ctx.fillText('30 DAYS TO BANKRUPTCY', W/2, 410);

      ctx.fillStyle = '#22c55e';
      ctx.font = '800 30px "Segoe UI", Arial, sans-serif';
      ctx.fillText('HE BROKE THE RULES & PIVOTED', W/2, 470);

      // Boardroom negotiation interaction
      // Jensen on left, Sega boss on right
      drawJensen(320, 890, 1.15, 'talking');
      drawSegaBoss(760, 890, 1.15);

      // Glowing $5M Bridge
      ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      roundRect(260, 1070, 560, 95, 20);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#34d399';
      ctx.font = '900 42px "Segoe UI", Arial, sans-serif';
      ctx.fillText('+$5,000,000 RESCUE', W/2, 1118);
      ctx.font = '700 24px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#a7f3d0';
      ctx.fillText('PIVOTED TO FULL AUTOMATION', W/2, 1150);

    } else if (t < ACT4) {
      // ------------------------------------------------------------
      // ACT 3: NOBODY'S PERFECT & NEITHER IS YOUR BUSINESS
      // ------------------------------------------------------------
      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 82px "Segoe UI", Arial, sans-serif';
      ctx.fillText("NOBODY'S PERFECT.", W/2, 360);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '800 46px "Segoe UI", Arial, sans-serif';
      ctx.fillText('NEITHER IS YOUR BUSINESS.', W/2, 440);

      // Contractor Voicemail Graveyard Card
      ctx.fillStyle = 'rgba(244, 63, 94, 0.14)';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 5;
      roundRect(120, 520, 840, 230, 24);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#fca5a5';
      ctx.font = '800 28px "Segoe UI", Arial, sans-serif';
      ctx.fillText('THE SILENT REVENUE KILLER', W/2, 575);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 88px "Segoe UI", Arial, sans-serif';
      ctx.fillText('-$8,000 / WEEK', W/2, 660);

      ctx.fillStyle = '#f43f5e';
      ctx.font = '800 28px "Segoe UI", Arial, sans-serif';
      ctx.fillText('LOST WHEN CALLS HIT VOICEMAIL', W/2, 715);

      // Contractor on ladder working with buzzing phone
      drawContractor(W/2, 1020, 1.25);

      // Buzzing phone notification
      const buzz = Math.sin(t * 24) * 8;
      ctx.fillStyle = '#ef4444';
      roundRect(W/2 + 75 + buzz, 840, 160, 48, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 18px "Segoe UI", Arial, sans-serif';
      ctx.fillText('MISSED CALL ✕', W/2 + 155 + buzz, 870);

    } else {
      // ------------------------------------------------------------
      // ACT 4: THE UNFAIR ADVANTAGE — MEET AVA
      // ------------------------------------------------------------
      ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 5;
      roundRect(100, 260, 880, 210, 26);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = '800 32px "Segoe UI", Arial, sans-serif';
      ctx.fillText('YOUR UNFAIR ADVANTAGE', W/2, 320);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 70px "Segoe UI", Arial, sans-serif';
      ctx.fillText('MEET AVA · 24/7 VOICE AI', W/2, 395);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = '700 28px "Segoe UI", Arial, sans-serif';
      ctx.fillText('ANSWERS ON 1ST RING · BOOKS JOBS 24/7', W/2, 442);

      // AVA Cybernetic Agent in center
      drawAvaAgent(W/2, 690, 1.15, t);

      // Soundwave visualization
      for (let i = -10; i <= 10; i++) {
        const amp = 24 + Math.abs(Math.sin(t * 11 + i * 0.65)) * 60;
        ctx.fillStyle = '#38bdf8';
        roundRect(W/2 + i * 28 - 7, 860 - amp/2, 14, amp, 7);
        ctx.fill();
      }

      // Live CTA Box
      const pulseCta = 1 + Math.sin(t * 7) * 0.025;
      ctx.save();
      ctx.translate(W/2, 1070);
      ctx.scale(pulseCta, pulseCta);

      ctx.fillStyle = 'linear-gradient(135deg, #f59e0b, #d97706)';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 5;
      roundRect(-420, -90, 840, 180, 24);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 48px "Segoe UI", Arial, sans-serif';
      ctx.fillText('CALL LIVE: (561) 813-8602', 0, -25);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 32px "Segoe UI", Arial, sans-serif';
      ctx.fillText('OR COMMENT "AVA" BELOW', 0, 35);
      ctx.restore();
    }

    // ==============================================================
    // KINETIC CAPTIONS HUD (Y = 1270..1760)
    // ==============================================================
    ctx.fillStyle = 'rgba(6, 11, 22, 0.94)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 3;
    roundRect(80, 1340, 920, 360, 28);
    ctx.fill(); ctx.stroke();

    // Active Chunk
    const activeChunk = CHUNKS.find(c => t >= c.start && t < c.end) || CHUNKS[CHUNKS.length - 1];
    if (activeChunk) {
      const activeWord = activeChunk.words.find(w => t >= w.start && t <= w.end);

      ctx.font = '900 58px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const fullChunkText = activeChunk.words.map(w => w.word).join(' ');
      
      // Render text with highlighted active word in gold
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(fullChunkText, W/2, 1500);

      if (activeWord) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '900 68px "Segoe UI", Arial, sans-serif';
        ctx.fillText(activeWord.word, W/2, 1600);
      }
    }

    // Watermark at bottom
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '800 24px "Space Grotesk", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VANTORX SOLUTIONS · SPEED-TO-LEAD AI', W/2, 1850);
  };
  </script></body></html>`;

  console.log('Rendering 30fps frames with Puppeteer...');
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.setContent(html);

  const fps = 30;
  const totalFrames = Math.ceil(TOTAL_SEC * fps);

  // Spawn ffmpeg child process to pipe raw PNG/video frames
  const ffmpeg = spawn(ffmpegPath, [
    '-y',
    '-f', 'image2pipe',
    '-r', String(fps),
    '-vcodec', 'png',
    '-i', '-',
    '-i', outWavPath,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'fast',
    '-crf', '20',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    outMp4Path
  ]);

  ffmpeg.stderr.on('data', d => {
    // console.log(d.toString());
  });

  const startTime = Date.now();
  for (let frame = 0; frame < totalFrames; frame++) {
    const t = frame / fps;
    await page.evaluate(time => window.renderAtTime(time), t);
    const buf = await page.screenshot({ type: 'png' });
    ffmpeg.stdin.write(buf);

    if (frame % 90 === 0 || frame === totalFrames - 1) {
      const pct = ((frame / totalFrames) * 100).toFixed(0);
      console.log(`Frame ${frame}/${totalFrames} (${pct}%) @ ${t.toFixed(1)}s`);
    }
  }

  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  await browser.close();
  console.log(`Video rendered successfully in ${((Date.now() - startTime) / 1000).toFixed(1)}s: ${outMp4Path}`);

  // Copy to named archive and brain directory
  fs.copyFileSync(outMp4Path, outNamedMp4);
  fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-30s-reel-2.mp4'));
  fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-nvidia-reel.mp4'));
  console.log('Copied to artifacts and named files.');
}

async function run() {
  await renderAudioMaster();
  await renderVideo();
}

run().catch(err => {
  console.error('Render error:', err);
  process.exit(1);
});
