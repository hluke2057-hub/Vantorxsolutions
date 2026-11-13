// scripts/render_cueva_nvidia_reel.js
// VantorX Viral Reel: "Nvidia's CEO Cheated" (75.1s Master Cut)
// - Slow, gradual curiosity hook (0s - 15.5s)
// - 1995 Sega $5M story & ruthless automation (15.5s - 33.5s)
// - Reality check: -$8k/wk Voicemail Graveyard (33.5s - 46.1s)
// - Seamless cut to AVA Voice AI + Sub-Second Mobile Website + Live CTA (46.1s - 75.1s)
// - Non-stop continuous camera motion (dollies, pans, punch-ins, rumble kicks)
// - Zero static standing, continuous cutaways, 45 floating ambient particles, 18+ tactile Foley SFX

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

const audioPath = path.join(root, 'website/demo/audio/reel-nvidia-master.wav');
const tsJsonPath = path.join(root, 'website/demo/audio/reel-nvidia-timestamps.json');
const outMp4Path = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const outNamedMp4 = path.join(root, 'website/demo/video/vantorx-nvidia-reel.mp4');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = 75.1; // Full 75.1s master audio duration
const FPS = 30;
const W = 1080;
const H = 1920;

console.log(`Starting High-Fidelity 75s Cueva Reel Render: ${TOTAL_SEC}s (${tsData.words.length} words, ${Math.ceil(TOTAL_SEC * FPS)} frames)`);

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; width: 1080px; height: 1920px; }
    canvas { width: 1080px; height: 1920px; image-rendering: -webkit-optimize-contrast; }
  </style>
</head>
<body>
  <canvas id="c" width="1080" height="1920"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const WORDS = ${JSON.stringify(tsData.words)};
    const W = 1080, H = 1920;

    // Deterministic ambient floating particles (45 particles)
    const PARTICLES = [];
    for (let i = 0; i < 45; i++) {
      PARTICLES.push({
        baseX: (i * 12347) % W,
        baseY: (i * 31415) % H,
        speedX: 12 + (i % 5) * 8,
        speedY: -18 - (i % 7) * 9,
        r: 2.5 + (i % 4) * 2,
        color: (i % 3 === 0) ? 'rgba(250, 204, 21, 0.45)' : (i % 3 === 1) ? 'rgba(56, 189, 248, 0.35)' : 'rgba(74, 222, 128, 0.4)'
      });
    }

    // Helper: Rounded Rectangle
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

    // Camera rumble / screen-shake impulses calculated from exact SFX hits
    function getCameraTransform(t) {
      // Base continuous slow cinematic dolly push
      let scale = 1.0 + Math.sin(t * 0.28) * 0.035;
      let offsetX = Math.cos(t * 0.42) * 14;
      let offsetY = Math.sin(t * 0.35) * 10;
      let rot = Math.sin(t * 0.25) * 0.004;

      // Rumble impulse triggers
      const triggers = [0.0, 5.13, 12.06, 15.48, 20.0, 27.36, 34.25, 38.02, 44.59, 46.14, 50.67, 58.72, 66.28];
      triggers.forEach(trig => {
        const diff = t - trig;
        if (diff >= 0 && diff < 0.45) {
          const decay = 1 - (diff / 0.45);
          const freq = 42;
          offsetX += Math.sin(diff * freq) * 18 * decay;
          offsetY += Math.cos(diff * freq * 1.3) * 16 * decay;
          scale += Math.sin(diff * freq * 0.8) * 0.04 * decay;
        }
      });

      // Dramatic Punch-Ins on Key Moments
      // 1. "Nvidia's CEO Cheated" (11.5s - 13.5s)
      if (t >= 11.5 && t <= 13.5) {
        scale += 0.08;
      }
      // 2. "$5,000,000 RESCUE" (27.0s - 29.5s)
      if (t >= 27.0 && t <= 29.5) {
        scale += 0.07;
      }
      // 3. "-$8,000 VOICEMAIL BLEED" (38.0s - 45.0s)
      if (t >= 38.0 && t <= 45.0) {
        scale += 0.05;
      }
      // 4. "MEET AVA VOICE AI" (50.5s - 56.0s)
      if (t >= 50.5 && t <= 56.0) {
        scale += 0.06;
      }
      // 5. "CALL (561) 813-8602 NOW" (66.0s - 75.1s)
      if (t >= 66.0) {
        scale += 0.04;
      }

      return { scale, offsetX, offsetY, rot };
    }

    // Authentic Cueva Studio Room Backdrop with Stepper & Horizon
    function drawCuevaRoom(wallTop, wallBot, floorColor, activeStep, t, topTag) {
      ctx.save();
      const bg = ctx.createLinearGradient(0, 0, 0, H * 0.77);
      bg.addColorStop(0, wallTop);
      bg.addColorStop(1, wallBot);
      ctx.fillStyle = bg;
      ctx.fillRect(-100, -100, W + 200, H * 0.77 + 100);

      // Studio vertical wall paneling texture with subtle horizontal drift
      const panelDrift = (Math.sin(t * 0.3) * 12);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.028)';
      for (let x = -72; x < W + 72; x += 72) {
        ctx.fillRect(x + panelDrift, 0, 28, H * 0.77);
      }

      // Moving studio ambient center spotlight
      const spotX = W / 2 + Math.sin(t * 0.5) * 60;
      const spotY = H * 0.38 + Math.cos(t * 0.4) * 40;
      const spot = ctx.createRadialGradient(spotX, spotY, 50, spotX, spotY, 680);
      spot.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
      spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, W, H * 0.77);

      // Dark stage floor (Bottom 23% where captions float cleanly)
      const floorGrad = ctx.createLinearGradient(0, H * 0.77, 0, H);
      floorGrad.addColorStop(0, floorColor || '#090612');
      floorGrad.addColorStop(1, '#020105');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(-100, H * 0.77, W + 200, H * 0.23 + 100);

      // Crisp stage floor horizon molding line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-100, H * 0.77);
      ctx.lineTo(W + 100, H * 0.77);
      ctx.stroke();

      // Top Progress Stepper (① ② ③ ④)
      const stepY = 135;
      const spacing = 76;
      const startX = W / 2 - (spacing * 1.5);

      // Ambient golden glow behind active stepper pills
      const glowCenterX = startX + ((activeStep - 1) * spacing);
      const stepGlow = ctx.createRadialGradient(glowCenterX, stepY, 10, glowCenterX, stepY, 150);
      stepGlow.addColorStop(0, 'rgba(250, 204, 21, 0.4)');
      stepGlow.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = stepGlow;
      ctx.beginPath();
      ctx.arc(glowCenterX, stepY, 150, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 1; i <= 4; i++) {
        const cx = startX + (i - 1) * spacing;
        const isLit = i <= activeStep;
        const isCurrent = i === activeStep;
        const r = isCurrent ? (26 + Math.sin(t * 6) * 2.5) : 24;

        ctx.beginPath();
        ctx.arc(cx, stepY, r, 0, Math.PI * 2);
        if (isLit) {
          ctx.fillStyle = '#facc15';
          ctx.fill();
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#fef08a';
          ctx.stroke();

          ctx.font = '900 24px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#090d16';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(i), cx, stepY + 1);
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.stroke();

          ctx.font = '800 22px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(i), cx, stepY + 1);
        }
      }

      if (topTag) {
        ctx.font = '900 23px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#facc15';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(topTag.toUpperCase(), W / 2, stepY + 44);
      }

      ctx.restore();
    }

    // Draw ambient floating dust & light particles
    function drawParticles(t) {
      ctx.save();
      PARTICLES.forEach(p => {
        const curX = (p.baseX + t * p.speedX) % (W + 80) - 40;
        const curY = ((p.baseY + t * p.speedY) % (H * 0.77 + 80) + (H * 0.77 + 80)) % (H * 0.77 + 80) - 40;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(curX, curY, p.r + Math.sin(t * 4 + p.baseX) * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // Authentic Cueva 2D Character Renderer
    function drawCuevaChar(opts, t) {
      const {
        x,
        y,
        scale = 1.0,
        outfit = 'suit', // 'suit' | 'contractor' | 'jensen' | 'sega'
        hair = 'curly_gold', // 'curly_gold' | 'hardhat' | 'silver_jensen' | 'slick_dark'
        mood = 'smile', // 'smile' | 'talk' | 'panic' | 'worried' | 'smirk'
        leftArmAngle = 0.25,
        rightArmAngle = -0.25,
        holdingItem = null // 'gpu' | 'wrench' | 'contract' | 'phone'
      } = opts;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale * 1.85, scale * 1.85);

      const bob = Math.sin(t * 4.5 + x * 0.02) * 2.5;

      // 1. Shoes on stage floor
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.ellipse(-26, -6, 20, 9, 0, 0, Math.PI * 2);
      ctx.ellipse(26, -6, 20, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Legs / Trousers
      ctx.fillStyle = (outfit === 'contractor') ? '#1e293b' : (outfit === 'jensen') ? '#020617' : '#1f2937';
      drawRoundBox(ctx, -38, -105, 26, 98, 6, ctx.fillStyle, null);
      drawRoundBox(ctx, 12, -105, 26, 98, 6, ctx.fillStyle, null);

      // 3. Torso with breathing bob
      ctx.save();
      ctx.translate(0, bob);

      if (outfit === 'jensen') {
        // Jensen's Black Leather Jacket with zipper line
        drawRoundBox(ctx, -50, -225, 100, 125, 16, '#09090b', '#22c55e', 2.5);
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.moveTo(-22, -225); ctx.lineTo(22, -225); ctx.lineTo(0, -170); ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#a1a1aa';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, -170); ctx.lineTo(0, -105); ctx.stroke();
      } else if (outfit === 'contractor') {
        drawRoundBox(ctx, -48, -225, 96, 125, 16, '#1d4ed8', null);
        drawRoundBox(ctx, -46, -223, 92, 120, 14, '#f97316', '#fb923c', 2);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(-46, -155, 92, 10);
        ctx.fillRect(-46, -130, 92, 10);
        ctx.fillRect(-30, -223, 12, 68);
        ctx.fillRect(18, -223, 12, 68);
      } else if (outfit === 'sega') {
        drawRoundBox(ctx, -48, -225, 96, 125, 16, '#18181b', '#27272a', 2);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(-20, -225); ctx.lineTo(20, -225); ctx.lineTo(0, -165); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath(); ctx.moveTo(-6, -215); ctx.lineTo(6, -215); ctx.lineTo(10, -130); ctx.lineTo(0, -115); ctx.lineTo(-10, -130); ctx.closePath(); ctx.fill();
      } else {
        drawRoundBox(ctx, -48, -225, 96, 125, 16, '#27272a', '#3f3f46', 2);
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath(); ctx.moveTo(-22, -225); ctx.lineTo(22, -225); ctx.lineTo(0, -165); ctx.closePath(); ctx.fill();
      }

      // 4. Arms & Hands
      const armCol = (outfit === 'jensen') ? '#09090b' : (outfit === 'contractor') ? '#1d4ed8' : '#18181b';
      [-1, 1].forEach(side => {
        const isRight = side === 1;
        const shoulderX = side * 48;
        const shoulderY = -208;
        const angle = isRight ? rightArmAngle : leftArmAngle;

        ctx.save();
        ctx.translate(shoulderX, shoulderY);
        ctx.rotate(angle);

        drawRoundBox(ctx, -12, 0, 24, 78, 11, armCol, null);

        // Round Peach Hand
        ctx.fillStyle = '#eab68c';
        ctx.beginPath();
        ctx.arc(0, 86, 14, 0, Math.PI * 2);
        ctx.fill();

        // Handheld props
        if (isRight && holdingItem === 'gpu') {
          ctx.save();
          ctx.translate(6, 88);
          // 3D glowing GPU circuit board with pulsing fan
          drawRoundBox(ctx, -26, -50, 52, 52, 10, '#15803d', '#4ade80', 3.5);
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, -24, 16, 0, Math.PI * 2);
          ctx.stroke();
          // Spinning fan blades
          const fanRot = t * 15;
          ctx.save();
          ctx.translate(0, -24);
          ctx.rotate(fanRot);
          for (let b = 0; b < 4; b++) {
            ctx.rotate(Math.PI / 2);
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(-2, -14, 4, 12);
          }
          ctx.restore();
          ctx.font = '900 12px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('GPU', 0, -2);
          ctx.restore();
        } else if (isRight && holdingItem === 'wrench') {
          ctx.save();
          ctx.translate(4, 86);
          ctx.rotate(-0.5 + Math.sin(t * 7) * 0.2);
          drawRoundBox(ctx, -5, -45, 10, 48, 4, '#cbd5e1', '#64748b', 2);
          ctx.beginPath();
          ctx.arc(0, -48, 12, 0.4, Math.PI * 2 - 0.4);
          ctx.lineWidth = 6;
          ctx.strokeStyle = '#cbd5e1';
          ctx.stroke();
          ctx.restore();
        } else if (isRight && holdingItem === 'contract') {
          ctx.save();
          ctx.translate(10, 80);
          drawRoundBox(ctx, -32, -54, 64, 48, 6, '#10b981', '#34d399', 3);
          ctx.font = '900 15px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#041f14';
          ctx.textAlign = 'center';
          ctx.fillText('$5M', 0, -32);
          ctx.font = '800 9px "Segoe UI", Arial, sans-serif';
          ctx.fillText('CONTRACT', 0, -18);
          ctx.restore();
        }

        ctx.restore();
      });

      // 5. Head (Large expressive Cueva round head)
      const headY = -278;
      ctx.fillStyle = '#eab68c';
      ctx.beginPath();
      ctx.arc(0, headY, 46, 0, Math.PI * 2);
      ctx.fill();

      // Forehead shadow
      ctx.fillStyle = 'rgba(180, 115, 70, 0.28)';
      ctx.beginPath();
      ctx.ellipse(0, headY - 18, 34, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // 6. Eyes with specular shine dots & blinking
      const blink = Math.sin(t * 3.5 + x) > 0.96;
      [-15, 15].forEach(ex => {
        if (blink) {
          ctx.strokeStyle = '#111827';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(ex - 7, headY - 4);
          ctx.lineTo(ex + 7, headY - 4);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#111827';
          ctx.beginPath();
          ctx.arc(ex, headY - 4, 5.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ex - 1.8, headY - 6, 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Jensen's Glasses
      if (hair === 'silver_jensen') {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        drawRoundBox(ctx, -26, headY - 14, 22, 18, 4, 'rgba(56, 189, 248, 0.15)', '#38bdf8', 3);
        drawRoundBox(ctx, 4, headY - 14, 22, 18, 4, 'rgba(56, 189, 248, 0.15)', '#38bdf8', 3);
        ctx.beginPath(); ctx.moveTo(-4, headY - 5); ctx.lineTo(4, headY - 5); ctx.stroke();
      }

      // 7. Eyebrows
      ctx.strokeStyle = '#3f2314';
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      if (mood === 'panic' || mood === 'worried') {
        ctx.beginPath();
        ctx.moveTo(-24, headY - 14); ctx.lineTo(-8, headY - 20);
        ctx.moveTo(24, headY - 14); ctx.lineTo(8, headY - 20);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-23, headY - 17); ctx.lineTo(-8, headY - 16);
        ctx.moveTo(8, headY - 16); ctx.lineTo(23, headY - 17);
        ctx.stroke();
      }

      // 8. Mouth
      ctx.strokeStyle = '#5c2814';
      ctx.fillStyle = '#5c2814';
      ctx.lineWidth = 4.0;
      if (mood === 'panic') {
        const openH = 8 + Math.abs(Math.sin(t * 10)) * 5;
        ctx.beginPath();
        ctx.ellipse(0, headY + 16, 11, openH, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (mood === 'talk') {
        const talkOpen = 3 + Math.abs(Math.sin(t * 14)) * 6;
        ctx.beginPath();
        ctx.ellipse(0, headY + 15, 10, talkOpen, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, headY + 8, 14, 0.2, Math.PI - 0.15);
        ctx.stroke();
      }

      // 9. Hair / Headwear
      if (hair === 'silver_jensen') {
        ctx.fillStyle = '#94a3b8';
        const puffs = [
          { cx: -32, cy: headY - 22, r: 20 },
          { cx: -16, cy: headY - 40, r: 24 },
          { cx: 8,   cy: headY - 42, r: 25 },
          { cx: 30,  cy: headY - 24, r: 21 },
          { cx: -38, cy: headY - 4,  r: 16 },
          { cx: 38,  cy: headY - 4,  r: 16 },
          { cx: 0,   cy: headY - 28, r: 22 }
        ];
        puffs.forEach(p => {
          ctx.beginPath(); ctx.arc(p.cx, p.cy, p.r, 0, Math.PI * 2); ctx.fill();
        });
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(-24, headY - 34); ctx.lineTo(-14, headY - 42); ctx.stroke();
      } else if (hair === 'hardhat') {
        ctx.fillStyle = '#78350f';
        ctx.beginPath(); ctx.arc(-38, headY - 10, 12, 0, Math.PI * 2); ctx.arc(38, headY - 10, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.arc(0, headY - 16, 48, Math.PI, Math.PI * 2); ctx.fill();
        drawRoundBox(ctx, -56, headY - 20, 112, 11, 5, '#eab308', '#fef08a', 1.5);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.arc(0, headY - 16, 36, Math.PI + 0.4, Math.PI + 1.1); ctx.stroke();
      } else if (hair === 'slick_dark') {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(0, headY - 14, 48, Math.PI - 0.15, Math.PI * 2 + 0.15); ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(12, headY - 38); ctx.lineTo(24, headY - 30); ctx.stroke();
      } else {
        ctx.fillStyle = '#b4823e';
        const puffs = [
          { cx: -32, cy: headY - 22, r: 20 },
          { cx: -16, cy: headY - 40, r: 24 },
          { cx: 8,   cy: headY - 42, r: 25 },
          { cx: 30,  cy: headY - 24, r: 21 },
          { cx: -38, cy: headY - 4,  r: 16 },
          { cx: 38,  cy: headY - 4,  r: 16 },
          { cx: 0,   cy: headY - 28, r: 22 }
        ];
        puffs.forEach(p => {
          ctx.beginPath(); ctx.arc(p.cx, p.cy, p.r, 0, Math.PI * 2); ctx.fill();
        });
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(-24, headY - 34); ctx.lineTo(-14, headY - 42); ctx.stroke();
      }

      ctx.restore();
      ctx.restore();
    }

    // Render Master Frame at Time T
    window.renderFrame = function(t) {
      ctx.clearRect(0, 0, W, H);

      // 1. Get Camera Transforms for continuous movement
      const cam = getCameraTransform(t);
      ctx.save();
      ctx.translate(W / 2 + cam.offsetX, H / 2 + cam.offsetY);
      ctx.rotate(cam.rot);
      ctx.scale(cam.scale, cam.scale);
      ctx.translate(-W / 2, -H / 2);

      // ============================================================
      // SCENE TIMELINE (Calibrated to ElevenLabs Timestamps):
      // Act 1 (Gradual Hook): 0.0s - 15.48s
      //   1A (0.0s - 5.13s): $3 Trillion Empire Counter & Globe
      //   1B (5.13s - 6.77s): "Think Again" Camera Push
      //   1C (6.77s - 12.65s): Jensen Huang Cheated Death & Glowing GPU
      //   1D (12.65s - 15.48s): "Let Me Explain" Blueprint Expansion
      // Act 2 (1995 Sega Deep Story): 15.48s - 33.50s
      //   2A (15.48s - 20.36s): 30 Days to Bankruptcy CRT Terminal
      //   2B (20.36s - 29.65s): Tokyo Boardroom & $5M Sega Rescue Contract
      //   2C (29.65s - 33.50s): Pivoting to Ruthless Automation Circuit
      // Act 3 (The Reality Check / Bleed): 33.50s - 46.14s
      //   3A (33.50s - 38.02s): "Nobody is Perfect" Reality Check
      //   3B (38.02s - 46.14s): Attic Ladder & -$8k/wk Voicemail Graveyard
      // Act 4 (Seamless Cut to AVA & Products): 46.14s - 75.10s
      //   4A (46.14s - 50.67s): The Unfair Advantage Matrix
      //   4B (50.67s - 58.72s): Meet AVA Voice AI & Sub-Second Mobile Website
      //   4C (58.72s - 66.28s): 0.8s Answer & Direct Truck Dispatch SMS
      //   4D (66.28s - 75.10s): High-Voltage Live Dialer CTA (561) 813-8602
      // ============================================================

      if (t < 15.48) {
        // ==========================================
        // ACT 1: GRADUAL CURIOSITY HOOK (0s - 15.5s)
        // ==========================================
        drawCuevaRoom('#3b0764', '#0f021c', '#06010b', 1, t, "01 · THE HOOK • THE $3 TRILLION SECRET");
        drawParticles(t);

        if (t < 5.13) {
          // 1A: The $3 Trillion Empire Question
          const empireVal = Math.min(3000000000000, Math.floor((t / 3.5) * 3000000000000));
          const formattedVal = '$' + empireVal.toLocaleString();

          // Rotating 3D Globe Wireframe
          const globeY = 480;
          ctx.save();
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(W / 2, globeY, 150, 0, Math.PI * 2);
          ctx.stroke();

          // Rotating longitude lines
          for (let l = -2; l <= 2; l++) {
            const rotShift = (t * 1.5 + l * 0.8) % Math.PI;
            ctx.beginPath();
            ctx.ellipse(W / 2, globeY, Math.max(0.1, Math.abs(150 * Math.cos(rotShift))), 150, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          // Latitude rings
          for (let lat = -100; lat <= 100; lat += 60) {
            const rad = Math.sqrt(Math.max(1, 150 * 150 - lat * lat));
            ctx.beginPath();
            ctx.ellipse(W / 2, globeY + lat, rad, Math.max(0.1, rad * 0.25), 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();

          // Big Counter Card
          drawRoundBox(ctx, 100, 210, 880, 160, 24, 'rgba(56, 189, 248, 0.16)', '#38bdf8', 4);
          ctx.font = '900 30px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#7dd3fc';
          ctx.textAlign = 'center';
          ctx.fillText('NVIDIA MARKET CAP', W / 2, 260);

          ctx.font = '900 68px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#facc15';
          ctx.fillText(formattedVal, W / 2, 335);

          // Cueva Presenter walking onto stage from left
          const walkProgress = Math.min(1.0, t / 2.0);
          const presX = -100 + walkProgress * (W / 2 + 100);
          drawCuevaChar({
            x: presX,
            y: H * 0.77,
            scale: 1.0,
            outfit: 'suit',
            hair: 'curly_gold',
            mood: 'talk',
            leftArmAngle: 0.35 + Math.sin(t * 5) * 0.15,
            rightArmAngle: -0.8 + Math.cos(t * 5) * 0.15,
            holdingItem: null
          }, t);

        } else if (t < 6.77) {
          // 1B: "Think Again" Camera Push
          const pulse = 1 + Math.sin(t * 12) * 0.03;
          ctx.save();
          ctx.translate(W / 2, 420);
          ctx.scale(pulse, pulse);

          drawRoundBox(ctx, -430, -145, 860, 290, 28, 'rgba(244, 63, 94, 0.25)', '#f43f5e', 5);
          ctx.font = '900 34px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#fca5a5';
          ctx.textAlign = 'center';
          ctx.fillText('THE UNTOLD TRUTH', 0, -78);

          ctx.font = '900 110px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('THINK AGAIN.', 0, 30);

          ctx.font = '900 38px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#f43f5e';
          ctx.fillText('HOW DID THEY ACTUALLY SURVIVE?', 0, 105);
          ctx.restore();

          drawCuevaChar({
            x: W / 2,
            y: H * 0.77,
            scale: 1.0,
            outfit: 'suit',
            hair: 'curly_gold',
            mood: 'talk',
            leftArmAngle: 0.7,
            rightArmAngle: -0.7,
            holdingItem: null
          }, t);

        } else if (t < 12.65) {
          // 1C: "Jensen Huang Cheated Death"
          drawRoundBox(ctx, 100, 210, 880, 270, 28, 'rgba(244, 63, 94, 0.25)', '#f43f5e', 5);
          ctx.font = '900 34px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#fca5a5';
          ctx.textAlign = 'center';
          ctx.fillText('CONFIDENTIAL SILICON VALLEY HISTORY', W / 2, 270);

          ctx.font = '900 82px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText("JENSEN HUANG", W / 2, 355);

          ctx.font = '900 110px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#f43f5e';
          ctx.fillText('CHEATED DEATH.', W / 2, 455);

          // Jensen Huang on Center Stage holding glowing NV1 GPU
          drawCuevaChar({
            x: W / 2,
            y: H * 0.77,
            scale: 1.0,
            outfit: 'jensen',
            hair: 'silver_jensen',
            mood: 'talk',
            leftArmAngle: 0.25,
            rightArmAngle: -1.05 + Math.sin(t * 6) * 0.08,
            holdingItem: 'gpu'
          }, t);

          // Snapping electrical arcs around GPU
          ctx.strokeStyle = '#4ade80';
          ctx.lineWidth = 3;
          for (let arc = 0; arc < 4; arc++) {
            const arcAngle = t * 12 + arc * (Math.PI / 2);
            const gx = W / 2 + 130 + Math.cos(arcAngle) * 45;
            const gy = H * 0.77 - 220 + Math.sin(arcAngle) * 45;
            ctx.beginPath();
            ctx.moveTo(W / 2 + 130, H * 0.77 - 220);
            ctx.lineTo(gx, gy);
            ctx.stroke();
          }

        } else {
          // 1D: "Let Me Explain" (12.65s - 15.48s)
          drawRoundBox(ctx, 120, 230, 840, 200, 24, 'rgba(56, 189, 248, 0.2)', '#38bdf8', 4);
          ctx.font = '900 76px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'center';
          ctx.fillText('LET ME EXPLAIN.', W / 2, 320);

          ctx.font = '800 32px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('WHAT HAPPENED IN 1995...', W / 2, 385);

          // Holographic blueprint schematic between Jensen and Presenter
          drawRoundBox(ctx, 320, 470, 440, 240, 16, 'rgba(15, 23, 42, 0.85)', '#0ea5e9', 3);
          ctx.fillStyle = 'rgba(14, 165, 233, 0.3)';
          for (let g = 340; g <= 740; g += 40) {
            ctx.fillRect(g, 490, 2, 200);
          }
          ctx.font = '900 24px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('NV1 MICROPROCESSOR BLUEPRINT', 540, 530);
          ctx.font = '900 42px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ef4444';
          ctx.fillText('ARCHITECTURAL FLAW', 540, 610);

          drawCuevaChar({
            x: 240,
            y: H * 0.77,
            scale: 0.95,
            outfit: 'suit',
            hair: 'curly_gold',
            mood: 'talk',
            leftArmAngle: 0.3,
            rightArmAngle: -0.9,
            holdingItem: null
          }, t);

          drawCuevaChar({
            x: 840,
            y: H * 0.77,
            scale: 0.95,
            outfit: 'jensen',
            hair: 'silver_jensen',
            mood: 'smirk',
            leftArmAngle: 0.8,
            rightArmAngle: -0.3,
            holdingItem: 'gpu'
          }, t);
        }

      } else if (t < 33.50) {
        // ==========================================
        // ACT 2: 1995 SEGA $5M STORY (15.5s - 33.5s)
        // ==========================================
        drawCuevaRoom('#064e3b', '#022c22', '#02140f', 2, t, "02 · THE DEEP STORY • 1995 SEGA PIVOT");
        drawParticles(t);

        if (t < 20.36) {
          // 2A: 30 Days to Total Bankruptcy CRT Terminal
          drawRoundBox(ctx, 100, 220, 880, 420, 24, '#090d16', '#ef4444', 4);
          ctx.font = '900 32px "Courier New", monospace';
          ctx.fillStyle = '#f87171';
          ctx.textAlign = 'center';
          ctx.fillText('SYSTEM ALERT · 1995 NVIDIA CASH RESERVES', W / 2, 280);

          // Digital Countdown Clock
          const daysLeft = Math.max(1, 30 - Math.floor((t - 15.48) * 5.8));
          ctx.font = '900 110px "Courier New", monospace';
          ctx.fillStyle = '#ef4444';
          ctx.fillText(String(daysLeft) + ' DAYS', W / 2, 395);

          ctx.font = '800 36px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#fca5a5';
          ctx.fillText('TO TOTAL BANKRUPTCY', W / 2, 455);

          // Draining Cash Bar
          const cashPct = Math.max(0.04, 1.0 - ((t - 15.48) / 4.88));
          drawRoundBox(ctx, 160, 500, 760, 45, 12, '#18181b', '#3f3f46', 2);
          drawRoundBox(ctx, 160, 500, 760 * cashPct, 45, 12, '#ef4444', null);

          ctx.font = '900 24px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('CASH RUNWAY DRAINING: ' + Math.round(cashPct * 100) + '%', W / 2, 595);

          // Jensen looking worried on stage
          drawCuevaChar({
            x: W / 2,
            y: H * 0.77,
            scale: 1.0,
            outfit: 'jensen',
            hair: 'silver_jensen',
            mood: 'worried',
            leftArmAngle: 0.45,
            rightArmAngle: -0.45,
            holdingItem: null
          }, t);

        } else if (t < 29.65) {
          // 2B: Sega Tokyo Boardroom $5M Rescue
          // Sega Boardroom Table
          ctx.save();
          const tableGrad = ctx.createLinearGradient(0, H * 0.62, 0, H * 0.78);
          tableGrad.addColorStop(0, '#78350f');
          tableGrad.addColorStop(1, '#451a03');
          ctx.fillStyle = tableGrad;
          ctx.beginPath();
          ctx.moveTo(120, H * 0.74);
          ctx.lineTo(960, H * 0.74);
          ctx.lineTo(1040, H * 0.78);
          ctx.lineTo(40, H * 0.78);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 4;
          ctx.stroke();
          ctx.restore();

          // $5M Sega Rescue Card
          drawRoundBox(ctx, 100, 220, 880, 240, 24, 'rgba(16, 185, 129, 0.22)', '#10b981', 4);
          ctx.font = '900 32px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#6ee7b7';
          ctx.textAlign = 'center';
          ctx.fillText('TOKYO · SEGA HEADQUARTERS', W / 2, 280);

          ctx.font = '900 86px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.fillText('+$5,000,000 RESCUE', W / 2, 370);

          ctx.font = '800 32px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('CONFESSED FAILURE · WON THE CONTRACT', W / 2, 425);

          // Signed Contract sliding across table with green wax seal
          const contractSlide = Math.min(1.0, (t - 20.36) / 2.5);
          const cX = 700 - contractSlide * 220;
          drawRoundBox(ctx, cX - 90, 520, 180, 120, 10, '#ffffff', '#10b981', 3);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(cX - 70, 545, 140, 6);
          ctx.fillRect(cX - 70, 565, 120, 6);
          ctx.fillRect(cX - 70, 585, 100, 6);
          // Wax seal
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(cX + 55, 605, 18, 0, Math.PI * 2);
          ctx.fill();

          // Jensen on Left negotiating
          drawCuevaChar({
            x: 270,
            y: H * 0.77,
            scale: 0.95,
            outfit: 'jensen',
            hair: 'silver_jensen',
            mood: 'talk',
            leftArmAngle: 0.15,
            rightArmAngle: -0.95 + Math.sin(t * 6) * 0.1,
            holdingItem: null
          }, t);

          // Sega Executive on Right holding contract
          drawCuevaChar({
            x: 810,
            y: H * 0.77,
            scale: 0.95,
            outfit: 'sega',
            hair: 'slick_dark',
            mood: 'smile',
            leftArmAngle: 0.85,
            rightArmAngle: -0.2,
            holdingItem: 'contract'
          }, t);

        } else {
          // 2C: Pivoting to Ruthless Automation (29.65s - 33.50s)
          drawRoundBox(ctx, 100, 220, 880, 230, 24, 'rgba(34, 197, 94, 0.22)', '#22c55e', 4);
          ctx.font = '900 32px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#86efac';
          ctx.textAlign = 'center';
          ctx.fillText('THE NVIDIA TURNING POINT', W / 2, 280);

          ctx.font = '900 68px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('RUTHLESS AUTOMATION', W / 2, 360);

          ctx.font = '800 30px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#4ade80';
          ctx.fillText('SIMULATED EVERYTHING BEFORE BUILDING', W / 2, 415);

          // Rotating Automation Gear & Circuit Grid
          const gearAngle = t * 3;
          ctx.save();
          ctx.translate(W / 2, 600);
          ctx.rotate(gearAngle);
          ctx.strokeStyle = '#4ade80';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(0, 0, 70, 0, Math.PI * 2);
          ctx.stroke();
          for (let cog = 0; cog < 8; cog++) {
            ctx.rotate(Math.PI / 4);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(-12, -90, 24, 25);
          }
          ctx.restore();

          drawCuevaChar({
            x: W / 2,
            y: H * 0.77,
            scale: 1.0,
            outfit: 'jensen',
            hair: 'silver_jensen',
            mood: 'smile',
            leftArmAngle: 0.6,
            rightArmAngle: -0.6,
            holdingItem: 'gpu'
          }, t);
        }

      } else if (t < 46.14) {
        // ==========================================
        // ACT 3: REALITY CHECK / BLEED (33.5s - 46.1s)
        // ==========================================
        drawCuevaRoom('#451a03', '#1c0a00', '#0a0401', 3, t, "03 · THE REALITY • NOBODY'S PERFECT");

        // Rain particle system for attic storm atmosphere
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 2.5;
        for (let r = 0; r < 40; r++) {
          const rx = (r * 73 + t * 450) % (W + 100) - 50;
          const ry = (r * 127 + t * 780) % (H * 0.77);
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 8, ry + 24);
          ctx.stroke();
        }
        ctx.restore();

        if (t < 38.02) {
          // 3A: "Nobody is Perfect. Neither is Your Business."
          ctx.font = '900 76px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#fbbf24';
          ctx.textAlign = 'center';
          ctx.fillText("NOBODY'S PERFECT.", W / 2, 280);

          ctx.font = '900 52px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('NEITHER IS YOUR BUSINESS.', W / 2, 355);

          drawRoundBox(ctx, 120, 420, 840, 180, 24, 'rgba(239, 68, 68, 0.2)', '#ef4444', 4);
          ctx.font = '800 32px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#fca5a5';
          ctx.fillText('REALITY CHECK FOR CONTRACTORS', W / 2, 480);
          ctx.font = '900 58px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#f87171';
          ctx.fillText('YOU CANNOT BE IN TWO PLACES', W / 2, 555);

          drawCuevaChar({
            x: W / 2,
            y: H * 0.77,
            scale: 1.0,
            outfit: 'suit',
            hair: 'curly_gold',
            mood: 'talk',
            leftArmAngle: 0.5,
            rightArmAngle: -0.5,
            holdingItem: null
          }, t);

        } else {
          // 3B: Attic Ladder Sway & -$8,000 Voicemail Graveyard
          drawRoundBox(ctx, 120, 220, 840, 240, 24, 'rgba(244, 63, 94, 0.22)', '#f43f5e', 5);
          ctx.font = '800 30px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#fca5a5';
          ctx.textAlign = 'center';
          ctx.fillText('VOICEMAIL GRAVEYARD', W / 2, 275);

          ctx.font = '900 96px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('-$8,000 / WEEK', W / 2, 370);

          ctx.font = '800 28px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#f43f5e';
          ctx.fillText('LOST WHILE YOU ARE ON A LADDER', W / 2, 425);

          // Swaying Attic Wooden Ladder behind Bob
          const ladderSway = Math.sin(t * 3.5) * 8;
          ctx.save();
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.moveTo(W / 2 - 130 + ladderSway, 520); ctx.lineTo(W / 2 - 130, H * 0.77);
          ctx.moveTo(W / 2 + 130 + ladderSway, 520); ctx.lineTo(W / 2 + 130, H * 0.77);
          ctx.stroke();
          ctx.lineWidth = 8;
          for (let r = 560; r <= 1400; r += 75) {
            ctx.beginPath(); ctx.moveTo(W / 2 - 130 + ladderSway, r); ctx.lineTo(W / 2 + 130 + ladderSway, r); ctx.stroke();
          }
          ctx.restore();

          // Bob the Contractor with Hardhat, Vest, and Wrench (Panicked!)
          drawCuevaChar({
            x: W / 2 + ladderSway * 0.5,
            y: H * 0.77,
            scale: 0.95,
            outfit: 'contractor',
            hair: 'hardhat',
            mood: 'panic',
            leftArmAngle: 0.7,
            rightArmAngle: -0.9,
            holdingItem: 'wrench'
          }, t);

          // Red Buzzing Phone Notification Alert
          const buzz = Math.sin(t * 26) * 12;
          drawRoundBox(ctx, W / 2 + 150 + buzz, 960, 260, 75, 16, '#ef4444', '#fecaca', 3);
          ctx.font = '900 28px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('MISSED CALL ✕', W / 2 + 280 + buzz, 1008);

          // Broken glass cracks on Voicemail card
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(W / 2, 370); ctx.lineTo(W / 2 + 50, 320);
          ctx.moveTo(W / 2, 370); ctx.lineTo(W / 2 - 60, 390);
          ctx.moveTo(W / 2, 370); ctx.lineTo(W / 2 + 30, 420);
          ctx.stroke();
        }

      } else {
        // ==========================================
        // ACT 4: SEAMLESS CUT TO AVA & PRODUCTS (46.1s - 75.1s)
        // ==========================================
        drawCuevaRoom('#1e1b4b', '#064e3b', '#02120e', 4, t, '04 · THE UNFAIR ADVANTAGE • MEET AVA');
        drawParticles(t);

        if (t < 50.67) {
          // 4A: "Jensen Had an Unfair Advantage, Now You Do Too"
          drawRoundBox(ctx, 100, 220, 880, 240, 24, 'rgba(56, 189, 248, 0.22)', '#38bdf8', 4);
          ctx.font = '900 32px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#7dd3fc';
          ctx.textAlign = 'center';
          ctx.fillText('THE LEVEL PLAYING FIELD IS A LIE', W / 2, 280);

          ctx.font = '900 70px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('YOUR UNFAIR ADVANTAGE', W / 2, 365);

          ctx.font = '800 32px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.fillText('AUTOMATE YOUR FRONT OFFICE 24/7', W / 2, 420);

          // Glowing cyan cyber core in center stage
          const corePulse = 1 + Math.sin(t * 8) * 0.12;
          ctx.save();
          ctx.translate(W / 2, 620);
          ctx.scale(corePulse, corePulse);
          const coreGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 90);
          coreGrad.addColorStop(0, '#38bdf8');
          coreGrad.addColorStop(0.6, '#0284c7');
          coreGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 90, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          drawCuevaChar({
            x: W / 2,
            y: H * 0.77,
            scale: 1.0,
            outfit: 'suit',
            hair: 'curly_gold',
            mood: 'smile',
            leftArmAngle: 0.6,
            rightArmAngle: -0.6,
            holdingItem: null
          }, t);

        } else if (t < 58.72) {
          // 4B: Meet AVA Voice AI & Sub-Second Mobile Website
          // Top Big Promotion Header
          drawRoundBox(ctx, 100, 210, 880, 100, 20, 'rgba(56, 189, 248, 0.18)', '#38bdf8', 3);
          ctx.font = '900 46px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('MEET AVA · 24/7 VOICE AI RECEPTIONIST', W / 2, 275);

          // Neon AI Hologram Brain on Left
          const holoX = 340, holoY = 480;
          for (let r = 0; r < 3; r++) {
            const rad = 110 + r * 30 + Math.sin(t * 5 + r) * 6;
            ctx.strokeStyle = 'rgba(244, 114, 182, ' + (0.35 - r * 0.08) + ')';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(holoX, holoY, rad, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Glowing Neon Head Silhouette
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 5;
          ctx.shadowColor = '#f472b6';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(holoX, holoY - 10, 90, -Math.PI * 0.85, Math.PI * 0.45);
          ctx.lineTo(holoX + 40, holoY + 100);
          ctx.lineTo(holoX - 40, holoY + 100);
          ctx.lineTo(holoX - 48, holoY + 60);
          ctx.lineTo(holoX - 82, holoY + 55);
          ctx.closePath();
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Glowing Brain Lobes
          ctx.fillStyle = '#fb7185';
          const lobes = [
            { dx: -24, dy: -24, r: 28 },
            { dx: 20,  dy: -24, r: 28 },
            { dx: -30, dy: 6,   r: 24 },
            { dx: 26,  dy: 6,   r: 24 },
            { dx: 0,   dy: -8,  r: 28 }
          ];
          lobes.forEach(l => {
            ctx.beginPath(); ctx.arc(holoX + l.dx, holoY + l.dy, l.r, 0, Math.PI * 2); ctx.fill();
          });

          // Floating Badge: ⚡ 0.8s ANSWER
          drawRoundBox(ctx, holoX - 140, holoY - 145, 280, 45, 12, '#065f46', '#4ade80', 2.5);
          ctx.font = '900 20px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#4ade80';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ AVA AI • 0.8s ANSWER', holoX, holoY - 116);

          // Ultra-Fast Mobile Website Mockup on Right
          const phoneX = 740, phoneY = 480;
          drawRoundBox(ctx, phoneX - 160, phoneY - 170, 320, 360, 28, '#0f172a', '#38bdf8', 4);
          // Phone notch & top bar
          ctx.fillStyle = '#020617';
          drawRoundBox(ctx, phoneX - 60, phoneY - 165, 120, 18, 9, '#020617', null);
          // 0.6s Speed Badge
          drawRoundBox(ctx, phoneX - 130, phoneY - 120, 260, 48, 12, 'rgba(52, 211, 153, 0.25)', '#34d399', 2);
          ctx.font = '900 22px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.fillText('⚡ 0.6s LOAD SPEED', phoneX, phoneY - 88);

          // Simulated Website Content inside Phone
          drawRoundBox(ctx, phoneX - 130, phoneY - 55, 260, 110, 14, '#1e293b', null);
          ctx.font = '900 20px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('PRO-TECH AIR SERVICES', phoneX, phoneY - 25);
          ctx.font = '700 15px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('24/7 HVAC Emergency Booking', phoneX, phoneY);

          // 100/100 Google Lighthouse Score
          drawRoundBox(ctx, phoneX - 110, phoneY + 70, 220, 42, 10, '#065f46', '#4ade80', 2);
          ctx.font = '900 20px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#4ade80';
          ctx.fillText('SCORE: 100/100 MOBILE', phoneX, phoneY + 97);

          // Cueva Presenter in Center pointing to both
          drawCuevaChar({
            x: W / 2,
            y: H * 0.77,
            scale: 0.95,
            outfit: 'suit',
            hair: 'curly_gold',
            mood: 'talk',
            leftArmAngle: 0.8,
            rightArmAngle: -0.8,
            holdingItem: null
          }, t);

        } else if (t < 66.28) {
          // 4C: 0.8s Answer & Direct Truck Dispatch SMS
          drawRoundBox(ctx, 100, 210, 880, 100, 20, 'rgba(56, 189, 248, 0.18)', '#38bdf8', 3);
          ctx.font = '900 44px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('QUALIFIES LEADS & DISPATCHES TO YOUR TRUCK', W / 2, 275);

          // Incoming SMS Dispatch Card (Sliding down)
          const smsSlide = Math.min(1.0, (t - 58.72) / 1.5);
          const smsY = 340 + smsSlide * 60;
          drawRoundBox(ctx, 140, smsY, 800, 260, 24, '#0f172a', '#38bdf8', 4);

          ctx.font = '800 24px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'left';
          ctx.fillText('📲 INSTANT DISPATCH TO YOUR PHONE:', 180, smsY + 48);

          ctx.font = '900 32px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('✅ Carlin Oates — AC Compressor Failure', 180, smsY + 100);

          ctx.font = '700 26px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText('📍 Miami, FL • Qualified • Slot Booked: Today 2 PM', 180, smsY + 145);

          ctx.font = '900 42px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#4ade80';
          ctx.fillText('💰 +$8,000 JOB SECURED 24/7', 180, smsY + 215);

          // Cueva Presenter on stage
          drawCuevaChar({
            x: W / 2,
            y: H * 0.77,
            scale: 1.0,
            outfit: 'suit',
            hair: 'curly_gold',
            mood: 'smile',
            leftArmAngle: 0.35,
            rightArmAngle: -0.9 + Math.sin(t * 4) * 0.08,
            holdingItem: null
          }, t);

        } else {
          // 4D: High-Voltage CTA (66.28s - 75.10s)
          // Top Big Promotion Header
          drawRoundBox(ctx, 100, 210, 880, 110, 22, 'rgba(56, 189, 248, 0.18)', '#38bdf8', 3);
          ctx.font = '900 50px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('NEVER MISS AN $8,000 JOB AGAIN', W / 2, 280);

          // Pulsing Dial Box
          const ctaPulse = 1 + Math.sin(t * 7) * 0.03;
          ctx.save();
          ctx.translate(W / 2, 490);
          ctx.scale(ctaPulse, ctaPulse);

          drawRoundBox(ctx, -440, -120, 880, 240, 28, 'rgba(52, 211, 153, 0.25)', '#34d399', 5);
          ctx.font = '900 84px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('📞 (561) 813-8602', 0, -10);

          ctx.font = '900 36px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#facc15';
          ctx.fillText('TEST AVA LIVE RIGHT NOW', 0, 65);
          ctx.restore();

          // Bottom Comment Pill
          drawRoundBox(ctx, 160, 680, 760, 85, 22, 'rgba(244, 63, 94, 0.25)', '#f43f5e', 4);
          ctx.font = '900 38px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('OR COMMENT "AVA" BELOW', W / 2, 735);

          drawCuevaChar({
            x: W / 2,
            y: H * 0.77,
            scale: 0.95,
            outfit: 'suit',
            hair: 'curly_gold',
            mood: 'talk',
            leftArmAngle: 0.6,
            rightArmAngle: -0.6,
            holdingItem: null
          }, t);
        }
      }

      // ============================================================
      // HORMOZI-STYLE KINETIC CAPTIONS ON STAGE FLOOR (Y = 1580 - 1800)
      // ============================================================
      const activeWordIdx = WORDS.findIndex(w => t >= w.start && t <= w.end);
      let targetIdx = activeWordIdx;
      if (targetIdx === -1) {
        for (let i = WORDS.length - 1; i >= 0; i--) {
          if (t >= WORDS[i].end) { targetIdx = Math.min(i, WORDS.length - 1); break; }
        }
      }
      if (targetIdx === -1) targetIdx = 0;

      // Sliding 3-word phrase window
      const chunkStart = Math.max(0, targetIdx - 1);
      const chunkWords = WORDS.slice(chunkStart, chunkStart + 3);

      ctx.save();
      const capY = 1680;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let totalWidth = 0;
      ctx.font = '900 58px "Segoe UI", Arial, sans-serif';
      const wordMetrics = chunkWords.map(cw => {
        const txt = cw.word.toUpperCase();
        const m = ctx.measureText(txt);
        totalWidth += m.width + 28;
        return { txt, width: m.width, isCurrent: (cw.start <= t && cw.end >= t) };
      });

      let startWordX = W / 2 - totalWidth / 2;
      wordMetrics.forEach((wm) => {
        const curWordX = startWordX + wm.width / 2;
        ctx.save();
        ctx.translate(curWordX, capY);

        if (wm.isCurrent) {
          const pop = 1 + Math.sin(t * 18) * 0.08;
          ctx.scale(pop, pop);

          // Yellow/Green kinetic glow highlight
          ctx.font = '900 68px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 20;
          ctx.fillText(wm.txt, 0, 0);
        } else {
          ctx.font = '900 56px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 0;
          ctx.fillText(wm.txt, 0, 0);
        }

        ctx.restore();
        startWordX += wm.width + 28;
      });

      ctx.restore();
      ctx.restore(); // Restore camera transform
    };
  </script>
</body>
</html>`;

const tmpHtmlPath = path.join(root, 'scripts/tmp_cueva_nvidia.html');
fs.writeFileSync(tmpHtmlPath, htmlContent, 'utf8');

async function renderVideo() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto('file:///' + tmpHtmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });

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

  const startTime = Date.now();
  for (let f = 0; f < totalFrames; f++) {
    const t = f / FPS;
    await page.evaluate((tm) => window.renderFrame(tm), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) {
      await new Promise(res => ff.stdin.once('drain', res));
    }
    if (f % 60 === 0 || f === totalFrames - 1) {
      const pct = ((f / totalFrames) * 100).toFixed(0);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stdout.write(`\r[RENDER] Frame ${f}/${totalFrames} (${pct}%) — ${elapsed}s elapsed`);
    }
  }

  ff.stdin.end();
  await new Promise((resolve, reject) => {
    ff.on('close', code => code === 0 ? resolve() : reject(new Error(ffErr)));
  });

  await browser.close();
  try { fs.unlinkSync(tmpHtmlPath); } catch (e) {}

  // Duplicate to outNamedMp4 and Artifact Directory
  fs.copyFileSync(outMp4Path, outNamedMp4);
  fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-30s-reel-2.mp4'));
  fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-nvidia-reel.mp4'));

  const sz = (fs.statSync(outMp4Path).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ High-Fidelity Cueva Nvidia Reel Rendered: ${outMp4Path} (${sz} MB)`);
}

renderVideo().catch(err => {
  console.error('\nRender error:', err);
  process.exit(1);
});
