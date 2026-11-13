// scripts/render_cueva_nvidia_reel.js
// Renders VantorX Reel #2: "Nvidia's CEO Cheated" (29.2s — Strictly < 30s)
// Features an Extended Gradual Hook (0s - 7.0s) + 1995 Sega Story + Contractor Bleed + Ava Promotion
// Uses the EXACT Cueva 2D Character & Studio Room Engine from Reel #1:
// - Authentic Cueva illustrated characters (peach heads, specular eyes, outfits, hair, breathing, articulated limbs)
// - Jensen Huang in black leather jacket with glasses & glowing GPU
// - Japanese Sega Executive in boardroom with $5M contract document
// - Attic Contractor on ladder with hardhat, high-vis vest, wrench, and missed call alert
// - Neon Holographic Ava Voice AI with pulsing neural rings & SMS dispatch card
// - Rich Cueva Studio Backdrops (paneling, spotlight, horizon line, 1-4 stepper)
// - Boxless Hormozi Kinetic Captions
// - Clean ElevenLabs voiceover + tactile foley SFX (NO background music)

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
const TOTAL_SEC = 29.2; // Strictly under 30 seconds!
const FPS = 30;
const W = 1080;
const H = 1920;

console.log(`Starting High-Fidelity Cueva Reel Render: ${TOTAL_SEC}s (${tsData.words.length} words, ${Math.ceil(TOTAL_SEC * FPS)} frames)`);

// Build HTML bundle with all Cueva visual rendering functions
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

    // Authentic Cueva Studio Room Backdrop with Stepper & Horizon
    function drawCuevaRoom(wallTop, wallBot, floorColor, activeStep, t, topTag) {
      ctx.save();
      const bg = ctx.createLinearGradient(0, 0, 0, H * 0.77);
      bg.addColorStop(0, wallTop);
      bg.addColorStop(1, wallBot);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H * 0.77);

      // Studio vertical wall paneling texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      for (let x = 0; x < W; x += 72) {
        ctx.fillRect(x, 0, 28, H * 0.77);
      }

      // Ambient center spotlight
      const spot = ctx.createRadialGradient(W / 2, H * 0.38, 40, W / 2, H * 0.38, 640);
      spot.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, W, H * 0.77);

      // Dark stage floor (Bottom 23% where captions float cleanly)
      const floorGrad = ctx.createLinearGradient(0, H * 0.77, 0, H);
      floorGrad.addColorStop(0, floorColor || '#090612');
      floorGrad.addColorStop(1, '#020105');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, H * 0.77, W, H * 0.23);

      // Crisp stage floor horizon molding line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.77);
      ctx.lineTo(W, H * 0.77);
      ctx.stroke();

      // Top Progress Stepper (① ② ③ ④)
      const stepY = 135;
      const spacing = 72;
      const startX = W / 2 - (spacing * 1.5);

      // Ambient golden glow behind active stepper pills
      const glowCenterX = startX + ((activeStep - 1) * spacing);
      const stepGlow = ctx.createRadialGradient(glowCenterX, stepY, 10, glowCenterX, stepY, 140);
      stepGlow.addColorStop(0, 'rgba(250, 204, 21, 0.35)');
      stepGlow.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = stepGlow;
      ctx.beginPath();
      ctx.arc(glowCenterX, stepY, 140, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 1; i <= 4; i++) {
        const cx = startX + (i - 1) * spacing;
        const isLit = i <= activeStep;
        const isCurrent = i === activeStep;
        const r = isCurrent ? (26 + Math.sin(t * 6) * 2) : 24;

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
        ctx.font = '900 24px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#facc15';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(topTag.toUpperCase(), W / 2, stepY + 44);
      }

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
      ctx.scale(scale * 1.85, scale * 1.85); // Scale up to 1080x1920

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
          drawRoundBox(ctx, -24, -48, 48, 48, 8, '#15803d', '#4ade80', 3);
          ctx.font = '900 13px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('GPU', 0, -24);
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
          drawRoundBox(ctx, -30, -50, 60, 45, 6, '#10b981', '#34d399', 3);
          ctx.font = '900 14px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#041f14';
          ctx.textAlign = 'center';
          ctx.fillText('$5M', 0, -26);
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

      // 6. Eyes with specular shine dots
      [-15, 15].forEach(ex => {
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(ex, headY - 4, 5.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex - 1.8, headY - 6, 2.0, 0, Math.PI * 2);
        ctx.fill();
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

      // Act Transitions calibrated to exact ElevenLabs timestamps:
      // Act 1 (Gradual Hook): 0.0s - 7.0s
      // Act 2 (Sega Rescue):  7.0s - 14.36s
      // Act 3 (Nobody Perfect): 14.36s - 18.62s
      // Act 4 (AVA Voice AI): 18.62s - 29.2s

      if (t < 7.0) {
        // ============================================================
        // ACT 1: GRADUAL HOOK (0s - 7.0s)
        // 0s - 3.4s: "Think Nvidia built a three-trillion-dollar empire playing fair?"
        // 3.4s - 5.0s: "Think again. Nvidia's CEO cheated."
        // 5.0s - 7.0s: "Let me explain."
        // ============================================================
        drawCuevaRoom('#3b0764', '#0f021c', '#06010b', 1, t, "01 · THE HOOK • THE $3 TRILLION SECRET");

        if (t < 3.4) {
          // Part 1: The Intriguing Question
          const pulse = 1 + Math.sin(t * 6) * 0.02;
          ctx.save();
          ctx.translate(W / 2, 420);
          ctx.scale(pulse, pulse);

          drawRoundBox(ctx, -440, -140, 880, 270, 28, 'rgba(56, 189, 248, 0.15)', '#38bdf8', 4);
          ctx.font = '900 32px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#7dd3fc';
          ctx.textAlign = 'center';
          ctx.fillText('THE $3,000,000,000,000 QUESTION', 0, -75);

          ctx.font = '900 68px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText("DID NVIDIA PLAY FAIR?", 0, 5);

          ctx.font = '800 32px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('HOW DID THEY BECOME #1 IN THE WORLD?', 0, 75);
          ctx.restore();

        } else {
          // Part 2: The Bombshell Twist ("Think again. Nvidia's CEO cheated.")
          const pulse = 1 + Math.sin(t * 9) * 0.025;
          ctx.save();
          ctx.translate(W / 2, 420);
          ctx.scale(pulse, pulse);

          drawRoundBox(ctx, -430, -145, 860, 280, 28, 'rgba(244, 63, 94, 0.22)', '#f43f5e', 5);
          ctx.font = '900 34px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#fca5a5';
          ctx.textAlign = 'center';
          ctx.fillText('THINK AGAIN · THE UNTOLD STORY', 0, -78);

          ctx.font = '900 84px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText("NVIDIA'S CEO", 0, 8);

          ctx.font = '900 114px "Segoe UI", Arial, sans-serif';
          ctx.fillStyle = '#f43f5e';
          ctx.fillText('CHEATED.', 0, 108);
          ctx.restore();
        }

        // Jensen Huang on Center Stage holding GPU
        drawCuevaChar({
          x: W / 2,
          y: H * 0.77,
          scale: 1.0,
          outfit: 'jensen',
          hair: 'silver_jensen',
          mood: t < 3.4 ? 'smile' : 'talk',
          leftArmAngle: 0.25,
          rightArmAngle: -1.05 + Math.sin(t * 5) * 0.08,
          holdingItem: 'gpu'
        }, t);

      } else if (t < 14.36) {
        // ============================================================
        // ACT 2: THE DEPTH — 1995 SEGA BOARDROOM $5M RESCUE (7.0s - 14.4s)
        // "In 1995, Jensen Huang built a broken chip, confessed to Sega,
        //  and got five million by pivoting to automation."
        // ============================================================
        drawCuevaRoom('#064e3b', '#022c22', '#02140f', 2, t, "02 · WHAT JENSEN DID • SEGA $5M PIVOT");

        // Status HUD Card
        drawRoundBox(ctx, 120, 240, 840, 230, 24, 'rgba(34, 197, 94, 0.16)', '#22c55e', 4);
        ctx.font = '900 30px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#86efac';
        ctx.textAlign = 'center';
        ctx.fillText('1995 · NV1 CHIP FAILED COMPLETELY', W / 2, 300);

        ctx.font = '900 70px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('30 DAYS TO BANKRUPTCY', W / 2, 380);

        ctx.font = '800 32px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#22c55e';
        ctx.fillText('WALKED INTO SEGA & CONFESSED', W / 2, 435);

        // $5,000,000 Rescue Bridge Pill
        drawRoundBox(ctx, 280, 500, 520, 90, 20, 'rgba(16, 185, 129, 0.25)', '#10b981', 4);
        ctx.font = '900 46px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#34d399';
        ctx.textAlign = 'center';
        ctx.fillText('+$5,000,000 RESCUE', W / 2, 550);
        ctx.font = '700 22px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#a7f3d0';
        ctx.fillText('PIVOTED TO RUTHLESS AUTOMATION', W / 2, 578);

        // Jensen Huang on Left talking passionately
        drawCuevaChar({
          x: 290,
          y: H * 0.77,
          scale: 0.95,
          outfit: 'jensen',
          hair: 'silver_jensen',
          mood: 'talk',
          leftArmAngle: 0.15,
          rightArmAngle: -0.9 + Math.sin(t * 6) * 0.1,
          holdingItem: null
        }, t);

        // Sega Executive Boss on Right holding the $5M funding contract
        drawCuevaChar({
          x: 790,
          y: H * 0.77,
          scale: 0.95,
          outfit: 'sega',
          hair: 'slick_dark',
          mood: 'smile',
          leftArmAngle: 0.85,
          rightArmAngle: -0.2,
          holdingItem: 'contract'
        }, t);

      } else if (t < 18.62) {
        // ============================================================
        // ACT 3: NOBODY'S PERFECT & NEITHER IS YOUR BUSINESS (14.4s - 18.6s)
        // "Nobody is perfect. Neither is your business.
        //  You're losing eight grand a week to voicemail."
        // ============================================================
        drawCuevaRoom('#451a03', '#1c0a00', '#0a0401', 3, t, "03 · THE REALITY • NOBODY'S PERFECT");

        // Bold Message Header
        ctx.font = '900 80px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.fillText("NOBODY'S PERFECT.", W / 2, 285);

        ctx.font = '900 50px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('NEITHER IS YOUR BUSINESS.', W / 2, 355);

        // $8,000 Voicemail Graveyard Card
        drawRoundBox(ctx, 140, 410, 800, 230, 24, 'rgba(244, 63, 94, 0.18)', '#f43f5e', 4);
        ctx.font = '800 30px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#fca5a5';
        ctx.textAlign = 'center';
        ctx.fillText('VOICEMAIL GRAVEYARD', W / 2, 465);

        ctx.font = '900 96px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('-$8,000 / WEEK', W / 2, 560);

        ctx.font = '800 28px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#f43f5e';
        ctx.fillText('LOST WHILE YOU ARE ON A LADDER', W / 2, 615);

        // Attic Ladder behind Contractor
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 130, 680); ctx.lineTo(W / 2 - 130, H * 0.77);
        ctx.moveTo(W / 2 + 130, 680); ctx.lineTo(W / 2 + 130, H * 0.77);
        ctx.stroke();
        ctx.lineWidth = 8;
        for (let r = 720; r <= 1400; r += 75) {
          ctx.beginPath(); ctx.moveTo(W / 2 - 130, r); ctx.lineTo(W / 2 + 130, r); ctx.stroke();
        }
        ctx.restore();

        // Bob the Contractor with Hardhat, Vest, and Wrench (Panicked!)
        drawCuevaChar({
          x: W / 2,
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
        drawRoundBox(ctx, W / 2 + 150 + buzz, 980, 240, 70, 16, '#ef4444', '#fecaca', 3);
        ctx.font = '900 26px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('MISSED CALL ✕', W / 2 + 270 + buzz, 1024);

      } else {
        // ============================================================
        // ACT 4: THE UNFAIR ADVANTAGE — MEET AVA 24/7 VOICE AI (18.6s - 29.2s)
        // "Meet AVA: our Voice AI that answers instantly and books jobs 24/7.
        //  Call (561) 813-8602 or comment AVA."
        // ============================================================
        drawCuevaRoom('#1e1b4b', '#064e3b', '#02120e', 4, t, '04 · THE UNFAIR ADVANTAGE • MEET AVA');

        // Neon AI Hologram Brain (From beloved Scene 9)
        const holoX = 720, holoY = 460;

        // Concentric glowing rings
        for (let r = 0; r < 3; r++) {
          const rad = 140 + r * 38 + Math.sin(t * 5 + r) * 8;
          ctx.strokeStyle = 'rgba(244, 114, 182, ' + (0.35 - r * 0.08) + ')';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(holoX, holoY, rad, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Glowing Neon Head Silhouette Outline
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#f472b6';
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(holoX, holoY - 15, 115, -Math.PI * 0.85, Math.PI * 0.45);
        ctx.lineTo(holoX + 50, holoY + 130);
        ctx.lineTo(holoX - 50, holoY + 130);
        ctx.lineTo(holoX - 60, holoY + 75);
        ctx.lineTo(holoX - 105, holoY + 70);
        ctx.closePath();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Glowing Neural Brain
        ctx.fillStyle = '#fb7185';
        const brainLobes = [
          { dx: -30, dy: -30, r: 38 },
          { dx: 25,  dy: -30, r: 38 },
          { dx: -38, dy: 6,   r: 32 },
          { dx: 34,  dy: 6,   r: 32 },
          { dx: 0,   dy: -10, r: 36 }
        ];
        brainLobes.forEach(l => {
          ctx.beginPath(); ctx.arc(holoX + l.dx, holoY + l.dy, l.r, 0, Math.PI * 2); ctx.fill();
        });

        // Floating Action Badge: ⚡ AVA AI • 0.8s ANSWER
        drawRoundBox(ctx, holoX - 160, holoY - 175, 320, 52, 14, '#065f46', '#4ade80', 3);
        ctx.font = '900 24px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#4ade80';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ AVA AI • 0.8s ANSWER', holoX, holoY - 140);

        // Instant SMS Dispatch Card
        const smsY = 660;
        drawRoundBox(ctx, 480, smsY, 520, 210, 24, '#0f172a', '#38bdf8', 3.5);
        ctx.font = '800 20px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.fillText('📲 INSTANT DISPATCH TO YOUR PHONE:', 515, smsY + 42);

        ctx.font = '900 26px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('✅ Sarah Jenkins — Pipe Burst', 515, smsY + 84);
        ctx.font = '700 22px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('📍 Emergency Qualified • Job Booked', 515, smsY + 120);

        ctx.font = '900 34px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#4ade80';
        ctx.fillText('💰 +$8,000 SECURED 24/7', 515, smsY + 175);

        // Cueva Presenter on Left pointing to Ava
        drawCuevaChar({
          x: 230,
          y: H * 0.77,
          scale: 0.95,
          outfit: 'suit',
          hair: 'curly_gold',
          mood: 'talk',
          leftArmAngle: 0.2,
          rightArmAngle: -1.2 + Math.sin(t * 4) * 0.08,
          holdingItem: null
        }, t);

        // Top Big Promotion Header
        drawRoundBox(ctx, 100, 240, 880, 110, 22, 'rgba(56, 189, 248, 0.15)', '#38bdf8', 3);
        ctx.font = '900 48px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('NEVER MISS AN $8,000 JOB AGAIN', W / 2, 312);

        // Live Dial Call to Action at Bottom
        const ctaY = 1180;
        drawRoundBox(ctx, 100, ctaY, 880, 190, 28, 'rgba(52, 211, 153, 0.18)', '#34d399', 4);
        ctx.font = '900 72px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('📞 (561) 813-8602', W / 2, ctaY + 85);
        ctx.font = '900 34px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#facc15';
        ctx.fillText('TEST AVA LIVE RIGHT NOW · OR COMMENT "AVA"', W / 2, ctaY + 145);
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

      // Display sliding 3-word phrase window
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
      wordMetrics.forEach((wm, idx) => {
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
    '-preset', 'fast',
    '-crf', '19',
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
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
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
