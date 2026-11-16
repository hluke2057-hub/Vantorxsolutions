// scripts/test_render_frame_preview.js
// Renders sample frames of the high-octane 3D motion graphics engine to verify visual quality.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tsJsonPath = path.resolve('website/demo/audio/reel2-30s-timestamps.json');
const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));

// Build HTML engine
function buildMotionHtml() {
  return `<!DOCTYPE html><html><head>
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

  // Pre-seed 90 floating cyber particles
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

  // Group into stable 2-3 word chunks
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

  // Draw 3D Isometric Smartphone Mockup
  function draw3DPhone(ctx, cx, cy, rotY, tiltX, scale, opts = {}) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Simulated 3D isometric skew & perspective
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    ctx.transform(cosY, tiltX * 0.2, 0, 1, 0, 0);

    const pw = 420, ph = 840, pr = 54;

    // Glowing rim / drop shadow
    ctx.shadowColor = opts.glowColor || 'rgba(0, 240, 255, 0.45)';
    ctx.shadowBlur = 45;
    ctx.fillStyle = '#0b0f19';
    roundRect(ctx, -pw/2 - 6, -ph/2 - 6, pw + 12, ph + 12, pr + 4);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Titanium Outer Chassis with metallic gradient
    const metalGrad = ctx.createLinearGradient(-pw/2, -ph/2, pw/2, ph/2);
    metalGrad.addColorStop(0, '#334155');
    metalGrad.addColorStop(0.5, '#0f172a');
    metalGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = metalGrad;
    roundRect(ctx, -pw/2, -ph/2, pw, ph, pr);
    ctx.fill();

    // Electric Accent Rim
    ctx.strokeStyle = opts.rimColor || '#00f0ff';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Glass Screen Bezel
    const bw = pw - 24, bh = ph - 24, br = pr - 8;
    ctx.fillStyle = opts.screenBg || '#030712';
    roundRect(ctx, -bw/2, -bh/2, bw, bh, br);
    ctx.fill();

    // Clip screen contents
    ctx.save();
    ctx.clip();

    // Screen dynamic grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1.5;
    for (let gx = -bw/2; gx < bw/2; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, -bh/2); ctx.lineTo(gx, bh/2); ctx.stroke(); }
    for (let gy = -bh/2; gy < bh/2; gy += 40) { ctx.beginPath(); ctx.moveTo(-bw/2, gy); ctx.lineTo(bw/2, gy); ctx.stroke(); }

    // Dynamic notch / Dynamic island
    ctx.fillStyle = '#000000';
    roundRect(ctx, -65, -bh/2 + 16, 130, 32, 16);
    ctx.fill();

    // Custom Screen Contents
    if (opts.type === 'call_alert') {
      // Vibrating incoming call card
      const ringPulse = (Math.sin(opts.time * 12) + 1) * 0.5;
      
      // Radar rings
      ctx.strokeStyle = 'rgba(255, 46, 84, ' + (0.8 - ringPulse * 0.6) + ')';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, -90, 80 + ringPulse * 60, 0, Math.PI * 2);
      ctx.stroke();

      // Flashing alert card
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

      // Hanging up & calling competitor animation
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
      // Ava 24/7 Voice AI Screen
      const time = opts.time;
      // Ava Optic Visor center
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      roundRect(ctx, -140, -180, 280, 130, 28);
      ctx.fill(); ctx.stroke();

      // Glowing Android Visor Line
      const visorGlow = ctx.createLinearGradient(-120, 0, 120, 0);
      visorGlow.addColorStop(0, '#0070f3');
      visorGlow.addColorStop(0.5, '#00f0ff');
      visorGlow.addColorStop(1, '#00ff85');
      ctx.fillStyle = visorGlow;
      roundRect(ctx, -110, -125, 220, 18, 9);
      ctx.fill();

      // Dancing Audio Waveforms
      ctx.fillStyle = '#00ff85';
      for (let w = -7; w <= 7; w++) {
        const barH = 20 + Math.abs(Math.sin(time * 14 + w * 0.8)) * 80;
        roundRect(ctx, w * 18 - 5, 20 - barH/2, 10, barH, 5);
        ctx.fill();
      }

      // Latency Dial Badge
      ctx.fillStyle = 'rgba(0, 255, 133, 0.18)';
      ctx.strokeStyle = '#00ff85';
      ctx.lineWidth = 2.5;
      roundRect(ctx, -120, 130, 240, 54, 27);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#00ff85';
      ctx.font = '900 24px "JetBrains Mono", monospace';
      ctx.fillText('⚡ 0.38s INSTANT ANSWER', 0, 165);

      // Booked status
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 26px "Space Grotesk", sans-serif';
      ctx.fillText('DISPATCH LOCKED ON CALENDAR', 0, 235);
    }

    // Glass Reflection Shader Sweep
    const glareX = -pw + ((opts.time * 280) % (pw * 2.5));
    const glareGrad = ctx.createLinearGradient(glareX, -ph/2, glareX + 160, ph/2);
    glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    glareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
    glareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glareGrad;
    ctx.fillRect(-bw/2, -bh/2, bw, bh);

    ctx.restore(); // Restore clip
    ctx.restore(); // Restore phone transform
  }

  // Main Render Frame
  window.renderAtTime = function(t) {
    ctx.clearRect(0, 0, W, H);

    // 1. Camera shake on hard-hitting timestamps
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

    // Camera Drift & Zoom
    const camZoom = 1.0 + Math.sin(t * 1.8) * 0.025;
    const camRot = Math.sin(t * 1.4) * 0.015;

    ctx.save();
    ctx.translate(W/2 + shakeX, H/2 + shakeY);
    ctx.rotate(camRot);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-W/2, -H/2);

    // Background Gradient with pulsing depth
    const bgRad = ctx.createRadialGradient(W/2, H*0.45, 100, W/2, H/2, H*0.85);
    bgRad.addColorStop(0, '#0a1024');
    bgRad.addColorStop(0.5, '#050813');
    bgRad.addColorStop(1, '#020308');
    ctx.fillStyle = bgRad;
    ctx.fillRect(0, 0, W, H);

    // Perspective Cyber Grid Lines (floor & ceiling)
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

    // Floating Cyber Particles with constant velocity
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

    // Laser Scanner Line sweeping vertically
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

    // TOP CYBERNETIC HUD BANNER
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

    // ==============================================================
    // ACT SPECIFIC DYNAMIC 3D ANIMATIONS (ZERO STILL FRAMES)
    // ==============================================================
    if (t < 5.6) {
      // ------------------------------------------------------------
      // ACT 1 (0.0s - 5.6s): THE $8,000 VOICEMAIL EXPLOSION & 3D PHONE
      // ------------------------------------------------------------
      // 3D Vibrating Phone
      const phoneVibe = Math.sin(t * 36) * 12;
      const phoneRotY = Math.sin(t * 2.5) * 0.18;
      draw3DPhone(ctx, W/2 + phoneVibe, 720, phoneRotY, 0.1, 1.15, {
        time: t,
        type: 'call_alert',
        rimColor: '#ff2e54',
        glowColor: 'rgba(255, 46, 84, 0.6)'
      });

      // Giant Exploding -$8,000 Headline with Chromatic Aberration
      const popT = Math.max(0, t - 3.17);
      const scalePop = popT > 0 ? (1.0 + Math.max(0, 0.35 * Math.exp(-popT * 5))) : 1.0;

      ctx.save();
      ctx.translate(W/2, 1260);
      ctx.scale(scalePop, scalePop);

      // Warning hazard box
      ctx.fillStyle = 'rgba(255, 46, 84, 0.18)';
      ctx.strokeStyle = '#ff2e54';
      ctx.lineWidth = 5;
      roundRect(ctx, -440, -120, 880, 240, 32);
      ctx.fill(); ctx.stroke();

      // Red / Cyan Glitch Offset
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
      // ------------------------------------------------------------
      // ACT 2 (5.6s - 14.6s): 78% DIGITAL SPEEDOMETER & COMPETITOR STEAL
      // ------------------------------------------------------------
      const dt = t - 5.6;
      // Giant Glowing 78% Speedometer Arc
      const dialRadius = 200;
      ctx.save();
      ctx.translate(W/2, 540);

      // Background Track
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 26;
      ctx.beginPath();
      ctx.arc(0, 0, dialRadius, Math.PI * 0.75, Math.PI * 2.25);
      ctx.stroke();

      // Active Animated Arc (Eased to 78%)
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

      // Center Big Number
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 148px "Space Grotesk", sans-serif';
      ctx.fillText('78%', 0, 30);
      ctx.fillStyle = '#ffb800';
      ctx.font = '800 28px "JetBrains Mono", monospace';
      ctx.fillText('HIRE THE 1st CONTRACTOR WHO PICKS UP', 0, 95);
      ctx.restore();

      // Split Cards in 3D Perspective: Your Shop vs Competitor
      const cardSlide = Math.min(1, dt * 1.8);
      const cardY1 = 860, cardY2 = 1040;

      // Card 1: Your Shop (Bleeding)
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

      // Card 2: Competitor (Taking Check)
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
      // ------------------------------------------------------------
      // ACT 3 (14.6s - 23.2s): AVA VOICE AI HOLOGRAPHIC COCKPIT & SMS DISPATCH
      // ------------------------------------------------------------
      const dt = t - 14.6;
      // Floating 3D Phone with Ava Visor on screen
      const rotY = Math.sin(t * 2.2) * 0.14;
      draw3DPhone(ctx, W/2, 680, rotY, -0.05, 1.12, {
        time: t,
        type: 'ava_active',
        rimColor: '#00f0ff',
        glowColor: 'rgba(0, 240, 255, 0.6)'
      });

      // Holographic Dispatch Bubble sliding forward with 3D Pop
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
      // ------------------------------------------------------------
      // ACT 4 (23.2s - 29.7s): MASSIVE LIVE CALL (561) 813-8602 & COMMENT CTA
      // ------------------------------------------------------------
      const dt = t - 23.2;
      // Pulse size
      const pulse = 1.0 + Math.sin(t * 6) * 0.035;

      ctx.save();
      ctx.translate(W/2, 620);
      ctx.scale(pulse, pulse);

      // Neon Phone Card
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

      // Bouncing Comment Button
      const btnBounce = 1.0 + Math.sin(t * 8) * 0.05;
      ctx.save();
      ctx.translate(W/2, 1080);
      ctx.scale(btnBounce, btnBounce);

      ctx.shadowColor = '#ffb800';
      ctx.shadowBlur = 40;
      ctx.fillStyle = 'linear-gradient(135deg, #ffb800, #ff8400)';
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

    // ==============================================================
    // HORMOZI / VOX ULTRA-POLISHED KINETIC CAPTIONS (LOWER THIRD)
    // ==============================================================
    const activeChunk = CHUNKS.find(c => t >= c.start - 0.05 && t <= c.end) || CHUNKS[CHUNKS.length - 1];
    if (activeChunk && t <= WORDS[WORDS.length - 1].end + 0.6) {
      const activeWord = activeChunk.words.find(w => t >= w.start && t <= w.end + 0.12);

      ctx.save();
      ctx.translate(W/2, 1530);

      // Glowing Backdrop Pill for Captions
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

        // Spring scale pop on active word
        let scale = 1.0;
        if (w.isActive) {
          const wordElapsed = Math.max(0, t - w.start);
          scale = 1.0 + Math.max(0, 0.28 * Math.exp(-wordElapsed * 10));
        }

        ctx.save();
        ctx.translate(curX + widths[idx] / 2, 22);
        ctx.scale(scale, scale);

        // Heavy Drop Shadow
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

    // Brand Watermark Bottom
    ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.font = '800 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('VANTORX SOLUTIONS // VANTORXSOLUTIONS.COM', W/2, 1820);

    ctx.restore(); // Restore camera shake & transform
  };
  </script></body></html>`;
}

async function run() {
  const htmlFile = path.resolve('scripts/tmp_motion_preview.html');
  fs.writeFileSync(htmlFile, buildMotionHtml(), 'utf8');

  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto('file:///' + htmlFile.replace(/\\/g, '/'), { waitUntil: 'load' });

  const testTimes = [2.2, 8.5, 18.2, 25.0];
  for (const tm of testTimes) {
    await page.evaluate((t) => window.renderAtTime(t), tm);
    const outPng = path.resolve(`scripts/preview_frame_${tm.toFixed(1)}s.png`);
    await page.screenshot({ path: outPng, type: 'png' });
    console.log(`Saved preview frame: ${outPng}`);
  }

  await browser.close();
  try { fs.unlinkSync(htmlFile); } catch (e) {}
}

run().catch(console.error);
