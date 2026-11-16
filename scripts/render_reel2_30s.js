// scripts/render_reel2_30s.js
// Builds VantorX Reel #2 (<30s) with ELITE 3D KINETIC MOTION GRAPHICS:
// - Zero static dead frames (continuous camera drift, particles, and laser scanning)
// - 3D Isometric Smartphone Mockup rotating and vibrating with incoming emergency call
// - Chromatic Aberration & Glitch on -$8,000 Voicemail Explosion
// - 78% Neon Speedometer Arc & 3D Split Cards (Your Shop vs Competitor)
// - Ava Cybernetic Visor & Dancing Audio Waveform HUD with 0.38s Latency
// - Hormozi / Vox kinetic typography with spring scale pops & neon glows

const fs = require('fs');
const path = require('path');
const { execFileSync, spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\80451426-584a-4969-8d9c-573a8dd3a27d';

const dryVoicePath = path.resolve('website/demo/audio/reel2-30s-voiceover-dry.mp3');
const tsJsonPath = path.resolve('website/demo/audio/reel2-30s-timestamps.json');
const outWavPath = path.resolve('website/demo/audio/reel2-30s-master.wav');
const outMp3Path = path.resolve('website/demo/audio/reel2-30s-master.mp3');
const outMp4Path = path.resolve('website/demo/video/vantorx-30s-reel-2.mp4');
const speedToLeadPath = path.resolve('website/demo/video/vantorx-speed-to-lead-reel.mp4');

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
  const html = `<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800;900&family=Inter:wght@700;800;900&family=JetBrains+Mono:wght@700;800&display=swap" rel="stylesheet">
  <style>*{margin:0;padding:0;box-sizing:border-box}body{background:#04060c;overflow:hidden;font-family:'Space Grotesk',sans-serif}</style></head>
  <body><canvas id="c" width="1080" height="1920"></canvas>
  <script>
  const WORDS = ${JSON.stringify(tsData.words)};
  const W = 1080, H = 1920;
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  const PARTICLES = [];
  for (let i = 0; i < 90; i++) {
    PARTICLES.push({
      x: (i * 97) % W,
      y: (i * 131) % H,
      vx: ((i % 5) - 2) * 22,
      vy: -35 - (i % 7) * 18,
      r: 1.5 + (i % 4) * 1.8,
      alpha: 0.25 + (i % 5) * 0.15,
      color: (i % 3 === 0) ? '#00f0ff' : ((i % 3 === 1) ? '#ffb800' : '#ff2e54')
    });
  }

  const CHUNKS = [];
  for (let i = 0; i < WORDS.length; i += 3) {
    const slice = WORDS.slice(i, i + 3);
    CHUNKS.push({
      start: slice[0].start,
      end: slice[slice.length - 1].end + 0.25,
      words: slice
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  function draw3DPhone(ctx, cx, cy, rotY, tiltX, scale, opts = {}) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const cosY = Math.cos(rotY);
    ctx.transform(cosY, tiltX * 0.2, 0, 1, 0, 0);

    const pw = 420, ph = 840, pr = 54;

    ctx.shadowColor = opts.glowColor || 'rgba(0, 240, 255, 0.45)';
    ctx.shadowBlur = 45;
    ctx.fillStyle = '#0b0f19';
    roundRect(ctx, -pw/2 - 6, -ph/2 - 6, pw + 12, ph + 12, pr + 4);
    ctx.fill();
    ctx.shadowBlur = 0;

    const metalGrad = ctx.createLinearGradient(-pw/2, -ph/2, pw/2, ph/2);
    metalGrad.addColorStop(0, '#334155');
    metalGrad.addColorStop(0.5, '#0f172a');
    metalGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = metalGrad;
    roundRect(ctx, -pw/2, -ph/2, pw, ph, pr);
    ctx.fill();

    ctx.strokeStyle = opts.rimColor || '#00f0ff';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    const bw = pw - 24, bh = ph - 24, br = pr - 8;
    ctx.fillStyle = opts.screenBg || '#030712';
    roundRect(ctx, -bw/2, -bh/2, bw, bh, br);
    ctx.fill();

    ctx.save();
    ctx.clip();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1.5;
    for (let gx = -bw/2; gx < bw/2; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, -bh/2); ctx.lineTo(gx, bh/2); ctx.stroke(); }
    for (let gy = -bh/2; gy < bh/2; gy += 40) { ctx.beginPath(); ctx.moveTo(-bw/2, gy); ctx.lineTo(bw/2, gy); ctx.stroke(); }

    ctx.fillStyle = '#000000';
    roundRect(ctx, -65, -bh/2 + 16, 130, 32, 16);
    ctx.fill();

    if (opts.type === 'call_alert') {
      const ringPulse = (Math.sin(opts.time * 12) + 1) * 0.5;
      
      ctx.strokeStyle = 'rgba(255, 46, 84, ' + (0.8 - ringPulse * 0.6) + ')';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, -90, 80 + ringPulse * 60, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 46, 84, 0.18)';
      ctx.strokeStyle = '#ff2e54';
      ctx.lineWidth = 3;
      roundRect(ctx, -bw/2 + 24, -200, bw - 48, 220, 24);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#ff2e54';
      ctx.font = '800 22px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🚨 MISSED CALL RECORDED', 0, -155);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px "Space Grotesk", sans-serif';
      ctx.fillText('EMERGENCY LEAK', 0, -105);

      ctx.fillStyle = '#fca5a5';
      ctx.font = '700 24px "Inter", sans-serif';
      ctx.fillText('Dumped to Voicemail', 0, -65);
      ctx.fillText('LOST REVENUE: -$8,000', 0, -25);

      ctx.fillStyle = 'rgba(255, 184, 0, 0.2)';
      ctx.strokeStyle = '#ffb800';
      roundRect(ctx, -bw/2 + 24, 70, bw - 48, 120, 20);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffb800';
      ctx.font = '800 20px "JetBrains Mono", monospace';
      ctx.fillText('87% CALLERS HANG UP', 0, 115);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px "Inter", sans-serif';
      ctx.fillText('Tapping Competitor...', 0, 155);

    } else if (opts.type === 'ava_active') {
      const time = opts.time;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      roundRect(ctx, -140, -180, 280, 130, 28);
      ctx.fill(); ctx.stroke();

      const visorGlow = ctx.createLinearGradient(-120, 0, 120, 0);
      visorGlow.addColorStop(0, '#0070f3');
      visorGlow.addColorStop(0.5, '#00f0ff');
      visorGlow.addColorStop(1, '#00ff85');
      ctx.fillStyle = visorGlow;
      roundRect(ctx, -110, -125, 220, 18, 9);
      ctx.fill();

      ctx.fillStyle = '#00ff85';
      for (let w = -7; w <= 7; w++) {
        const barH = 20 + Math.abs(Math.sin(time * 14 + w * 0.8)) * 80;
        roundRect(ctx, w * 18 - 5, 20 - barH/2, 10, barH, 5);
        ctx.fill();
      }

      ctx.fillStyle = 'rgba(0, 255, 133, 0.18)';
      ctx.strokeStyle = '#00ff85';
      ctx.lineWidth = 2.5;
      roundRect(ctx, -120, 130, 240, 54, 27);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#00ff85';
      ctx.font = '900 24px "JetBrains Mono", monospace';
      ctx.fillText('⚡ 0.38s INSTANT ANSWER', 0, 165);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 26px "Space Grotesk", sans-serif';
      ctx.fillText('DISPATCH LOCKED ON CALENDAR', 0, 235);
    }

    const glareX = -pw + ((opts.time * 280) % (pw * 2.5));
    const glareGrad = ctx.createLinearGradient(glareX, -ph/2, glareX + 160, ph/2);
    glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    glareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
    glareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glareGrad;
    ctx.fillRect(-bw/2, -bh/2, bw, bh);

    ctx.restore();
    ctx.restore();
  }

  window.renderAtTime = function(t) {
    ctx.clearRect(0, 0, W, H);

    let shakeX = 0, shakeY = 0;
    const shakePoints = [0.0, 4.28, 6.84, 14.64, 17.80, 23.20];
    for (const sp of shakePoints) {
      if (t >= sp && t <= sp + 0.35) {
        const decay = 1 - (t - sp) / 0.35;
        shakeX = (Math.sin(t * 70) * 16) * decay;
        shakeY = (Math.cos(t * 85) * 16) * decay;
        break;
      }
    }

    const camZoom = 1.0 + Math.sin(t * 1.8) * 0.025;
    const camRot = Math.sin(t * 1.4) * 0.015;

    ctx.save();
    ctx.translate(W/2 + shakeX, H/2 + shakeY);
    ctx.rotate(camRot);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-W/2, -H/2);

    const bgRad = ctx.createRadialGradient(W/2, H*0.45, 100, W/2, H/2, H*0.85);
    bgRad.addColorStop(0, '#0a1024');
    bgRad.addColorStop(0.5, '#050813');
    bgRad.addColorStop(1, '#020308');
    ctx.fillStyle = bgRad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
    ctx.lineWidth = 2;
    for (let x = -200; x <= W + 200; x += 110) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(W/2 + (x - W/2) * 1.6, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += 120) {
      const pY = (y + (t * 70) % 120);
      ctx.beginPath();
      ctx.moveTo(0, pY);
      ctx.lineTo(W, pY);
      ctx.stroke();
    }

    for (let i = 0; i < PARTICLES.length; i++) {
      const p = PARTICLES[i];
      const py = (p.y + p.vy * t) % H;
      const actualY = py < 0 ? py + H : py;
      const px = (p.x + p.vx * t + Math.sin(t * 2 + i) * 35) % W;
      const actualX = px < 0 ? px + W : px;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(t * 4 + i));
      ctx.beginPath();
      ctx.arc(actualX, actualY, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    const scanY = (t * 540) % (H + 200) - 100;
    const laserGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
    laserGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
    laserGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.35)');
    laserGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = laserGrad;
    ctx.fillRect(0, scanY - 30, W, 60);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(W, scanY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    let hudTag = 'VOICEMAIL BLEED CRIME SCENE', hudCol = '#ff2e54';
    if (t >= 23.2) { hudTag = 'LIVE SPEAKERPHONE CHALLENGE · DIAL NOW'; hudCol = '#00ff85'; }
    else if (t >= 14.6) { hudTag = '24/7 VOICE AI DISPATCH · UNDER 0.4s'; hudCol = '#00f0ff'; }
    else if (t >= 5.6) { hudTag = 'THE 78% LOCAL CONTRACTOR LAW'; hudCol = '#ffb800'; }

    ctx.fillStyle = 'rgba(11, 15, 25, 0.85)';
    ctx.strokeStyle = hudCol;
    ctx.lineWidth = 3;
    roundRect(ctx, W/2 - 270, 90, 540, 68, 34);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = hudCol;
    ctx.font = '900 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(hudTag, W/2, 124);

    if (t < 5.6) {
      const phoneVibe = Math.sin(t * 36) * 12;
      const phoneRotY = Math.sin(t * 2.5) * 0.18;
      draw3DPhone(ctx, W/2 + phoneVibe, 720, phoneRotY, 0.1, 1.15, {
        time: t,
        type: 'call_alert',
        rimColor: '#ff2e54',
        glowColor: 'rgba(255, 46, 84, 0.6)'
      });

      const popT = Math.max(0, t - 3.17);
      const scalePop = popT > 0 ? (1.0 + Math.max(0, 0.35 * Math.exp(-popT * 5))) : 1.0;

      ctx.save();
      ctx.translate(W/2, 1260);
      ctx.scale(scalePop, scalePop);

      ctx.fillStyle = 'rgba(255, 46, 84, 0.18)';
      ctx.strokeStyle = '#ff2e54';
      ctx.lineWidth = 5;
      roundRect(ctx, -440, -120, 880, 240, 32);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#00f0ff';
      ctx.font = '900 132px "Space Grotesk", sans-serif';
      ctx.fillText('-$8,000', -4, 26);
      ctx.fillStyle = '#ff2e54';
      ctx.fillText('-$8,000', 4, 30);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('-$8,000', 0, 28);

      ctx.fillStyle = '#fca5a5';
      ctx.font = '800 32px "Inter", sans-serif';
      ctx.fillText('LOST EVERY MISSED EMERGENCY CALL', 0, 88);
      ctx.restore();

    } else if (t < 14.6) {
      const dt = t - 5.6;
      const dialRadius = 200;
      ctx.save();
      ctx.translate(W/2, 540);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 26;
      ctx.beginPath();
      ctx.arc(0, 0, dialRadius, Math.PI * 0.75, Math.PI * 2.25);
      ctx.stroke();

      const arcProgress = Math.min(0.78, dt * 0.45);
      const endAngle = Math.PI * 0.75 + (Math.PI * 1.5) * (arcProgress / 1.0);
      const arcGrad = ctx.createLinearGradient(-dialRadius, 0, dialRadius, 0);
      arcGrad.addColorStop(0, '#ffb800');
      arcGrad.addColorStop(1, '#00ff85');
      ctx.strokeStyle = arcGrad;
      ctx.lineWidth = 26;
      ctx.shadowColor = '#ffb800';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(0, 0, dialRadius, Math.PI * 0.75, endAngle);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 148px "Space Grotesk", sans-serif';
      ctx.fillText('78%', 0, 30);
      ctx.fillStyle = '#ffb800';
      ctx.font = '800 28px "JetBrains Mono", monospace';
      ctx.fillText('HIRE THE 1st CONTRACTOR WHO PICKS UP', 0, 95);
      ctx.restore();

      const cardSlide = Math.min(1, dt * 1.8);
      const cardY1 = 860, cardY2 = 1040;

      ctx.save();
      ctx.translate(W/2 + (1 - cardSlide) * -300, cardY1);
      ctx.fillStyle = 'rgba(255, 46, 84, 0.16)';
      ctx.strokeStyle = '#ff2e54';
      ctx.lineWidth = 4;
      roundRect(ctx, -450, -65, 900, 130, 24);
      ctx.fill(); ctx.stroke();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 36px "Space Grotesk", sans-serif';
      ctx.fillText('❌ YOUR SHOP: VOICEMAIL', -400, -10);
      ctx.fillStyle = '#fca5a5';
      ctx.font = '700 28px "Inter", sans-serif';
      ctx.fillText('87% hang up & call competitor', -400, 34);
      ctx.restore();

      ctx.save();
      ctx.translate(W/2 + (1 - cardSlide) * 300, cardY2);
      ctx.fillStyle = 'rgba(0, 255, 133, 0.16)';
      ctx.strokeStyle = '#00ff85';
      ctx.lineWidth = 4;
      roundRect(ctx, -450, -65, 900, 130, 24);
      ctx.fill(); ctx.stroke();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 36px "Space Grotesk", sans-serif';
      ctx.fillText('✅ COMPETITOR: ANSWERED LIVE', -400, -10);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '700 28px "Inter", sans-serif';
      ctx.fillText('Took the $8,000 check that had your name on it', -400, 34);
      ctx.restore();

    } else if (t < 23.2) {
      const dt = t - 14.6;
      const rotY = Math.sin(t * 2.2) * 0.14;
      draw3DPhone(ctx, W/2, 680, rotY, -0.05, 1.12, {
        time: t,
        type: 'ava_active',
        rimColor: '#00f0ff',
        glowColor: 'rgba(0, 240, 255, 0.6)'
      });

      const smsPop = Math.min(1, Math.max(0, (dt - 2.2) * 2.5));
      if (smsPop > 0) {
        ctx.save();
        ctx.translate(W/2, 1200);
        ctx.scale(smsPop, smsPop);

        ctx.shadowColor = '#00ff85';
        ctx.shadowBlur = 35;
        ctx.fillStyle = 'rgba(11, 23, 20, 0.94)';
        ctx.strokeStyle = '#00ff85';
        ctx.lineWidth = 5;
        roundRect(ctx, -440, -110, 880, 220, 30);
        ctx.fill(); ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.textAlign = 'left';
        ctx.fillStyle = '#00ff85';
        ctx.font = '900 26px "JetBrains Mono", monospace';
        ctx.fillText('📱 DISPATCH SENT TO YOUR CREW IN 24s', -390, -50);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 42px "Space Grotesk", sans-serif';
        ctx.fillText('$8,000 AC SYSTEM REPAIR BOOKED', -390, 8);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '700 28px "Inter", sans-serif';
        ctx.fillText('Diagnostic Quoted · On-Call Tech Carlos Locked In', -390, 58);
        ctx.restore();
      }

    } else {
      const pulse = 1.0 + Math.sin(t * 6) * 0.035;

      ctx.save();
      ctx.translate(W/2, 620);
      ctx.scale(pulse, pulse);

      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 50;
      ctx.fillStyle = 'rgba(8, 14, 28, 0.92)';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 6;
      roundRect(ctx, -460, -180, 920, 360, 36);
      ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#00ff85';
      ctx.font = '900 32px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('📞 TEST AVA LIVE ON SPEAKERPHONE', 0, -95);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 108px "Space Grotesk", sans-serif';
      ctx.fillText('(561) 813-8602', 0, 20);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '800 30px "Inter", sans-serif';
      ctx.fillText('Answers in 0.4s · Speaks Spanish · Zero Lock-In', 0, 110);
      ctx.restore();

      const btnBounce = 1.0 + Math.sin(t * 8) * 0.05;
      ctx.save();
      ctx.translate(W/2, 1080);
      ctx.scale(btnBounce, btnBounce);

      ctx.shadowColor = '#ffb800';
      ctx.shadowBlur = 40;
      ctx.fillStyle = '#ffb800';
      roundRect(ctx, -380, -60, 760, 120, 28);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#080c16';
      ctx.font = '900 52px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('COMMENT "AVA" BELOW', 0, 16);
      ctx.restore();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '800 32px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('For the 48-Hour Zero-Friction Contractor Rollout', W/2, 1240);
    }

    const activeChunk = CHUNKS.find(c => t >= c.start - 0.05 && t <= c.end) || CHUNKS[CHUNKS.length - 1];
    if (activeChunk && t <= WORDS[WORDS.length - 1].end + 0.6) {
      ctx.save();
      ctx.translate(W/2, 1530);

      ctx.fillStyle = 'rgba(6, 10, 20, 0.88)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 3;
      roundRect(ctx, -480, -80, 960, 160, 30);
      ctx.fill(); ctx.stroke();

      ctx.font = '900 68px "Space Grotesk", sans-serif';
      const wordsUp = activeChunk.words.map(w => ({
        txt: w.word.toUpperCase(),
        start: w.start,
        end: w.end,
        isActive: (t >= w.start && t <= w.end + 0.12)
      }));

      const widths = wordsUp.map(w => ctx.measureText(w.txt + ' ').width);
      const totalW = widths.reduce((a, b) => a + b, 0);
      let curX = -totalW / 2;

      wordsUp.forEach((w, idx) => {
        ctx.textAlign = 'left';

        let scale = 1.0;
        if (w.isActive) {
          const wordElapsed = Math.max(0, t - w.start);
          scale = 1.0 + Math.max(0, 0.28 * Math.exp(-wordElapsed * 10));
        }

        ctx.save();
        ctx.translate(curX + widths[idx] / 2, 22);
        ctx.scale(scale, scale);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 14;
        ctx.strokeText(w.txt, -widths[idx] / 2, 0);

        if (w.isActive) {
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 25;
          ctx.fillStyle = '#00f0ff';
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
        }
        ctx.fillText(w.txt, -widths[idx] / 2, 0);
        ctx.restore();

        curX += widths[idx];
      });
      ctx.restore();
    }

    ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.font = '800 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('VANTORX SOLUTIONS // VANTORXSOLUTIONS.COM', W/2, 1820);

    ctx.restore();
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
  console.log(`Rendering ${totalFrames} frames @ ${fps}fps with High-Octane 3D Motion Graphics (${TOTAL_SEC}s)...`);

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
  fs.copyFileSync(outMp4Path, speedToLeadPath);
  try { fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-30s-reel-2.mp4')); } catch (e) {}
  console.log(`✅ High-Octane 3D Reel MP4 Rendered: ${outMp4Path} (${(fs.statSync(outMp4Path).size / (1024 * 1024)).toFixed(2)} MB)`);
}

(async () => {
  await renderAudioMaster();
  await renderVideo();
})();
