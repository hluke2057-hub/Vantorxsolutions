// scripts/render_stick_figure_story_reel.js
// VantorX Stick Figure Storytelling Reel: "Jensen Huang's Survival & The $8,000 Voicemail Bleed" (74.3s)
// - True Stick Figure Character Storytelling (Jensen Huang, Sega Bosses, Bob on Ladder, Sarah in Flood, Ava AI)
// - Walking cycles, arm gestures, sweat drops, moving mouths, props, actions matching EVERY line of script
// - Non-stop continuous visual motion (zero still frames)
// - Hollywood-grade cinematic audio mix (driving tension beat, 808 sub drops, whooshes, phone vibrations)
// - Hormozi-style kinetic captions in safe zone

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\80451426-584a-4969-8d9c-573a8dd3a27d';

const audioPath = path.join(root, 'website/demo/audio/reel-nvidia-master.wav');
const tsJsonPath = path.join(root, 'website/demo/audio/reel-nvidia-timestamps.json');
const outMp4Path = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const outNamedMp4 = path.join(root, 'website/demo/video/vantorx-nvidia-reel.mp4');
const outSpeedMp4 = path.join(root, 'website/demo/video/vantorx-speed-to-lead-reel.mp4');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = Number(tsData.duration || 74.303);
const FPS = 30;
const W = 1080;
const H = 1920;

console.log(`Starting Stick Figure Storytelling Reel Render: ${TOTAL_SEC}s (${tsData.words.length} words, ${Math.ceil(TOTAL_SEC * FPS)} frames)`);

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #070913; overflow: hidden; width: 1080px; height: 1920px; display: flex; align-items: center; justify-content: center; }
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

    // ==========================================
    // STICK FIGURE CHARACTER RENDERER
    // ==========================================
    function drawStickGuy(opts, t) {
      const {
        x, y, scale = 1.0,
        type = 'jensen', // 'jensen' | 'sega' | 'bob' | 'sarah' | 'ava'
        action = 'walk', // 'walk' | 'stand' | 'panic' | 'jump' | 'ladder' | 'type'
        facing = 1, // 1: right, -1: left
        walkCycle = 0,
        isTalking = false,
        headAngle = 0,
        holding = null // 'wrench' | 'check' | 'chip' | 'book' | 'phone'
      } = opts;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale * facing, scale);

      // Walking bounce & leg swing math
      let legAngle1 = 0, legAngle2 = 0, armAngle1 = 0, armAngle2 = 0;
      let bodyBob = 0;

      if (action === 'walk') {
        legAngle1 = Math.sin(walkCycle) * 0.55;
        legAngle2 = -legAngle1;
        armAngle1 = -legAngle1 * 0.8;
        armAngle2 = legAngle1 * 0.8;
        bodyBob = Math.abs(Math.sin(walkCycle * 2)) * 8;
      } else if (action === 'panic') {
        bodyBob = Math.sin(t * 22) * 5;
        armAngle1 = -2.2 + Math.sin(t * 18) * 0.3;
        armAngle2 = 2.2 - Math.sin(t * 18) * 0.3;
        legAngle1 = -0.2; legAngle2 = 0.2;
      } else if (action === 'jump') {
        bodyBob = -45 + Math.abs(Math.sin(t * 12)) * 30;
        armAngle1 = -2.4; armAngle2 = 2.4;
        legAngle1 = -0.4; legAngle2 = 0.4;
      } else if (action === 'ladder') {
        bodyBob = Math.sin(t * 6) * 4;
        legAngle1 = 0.3; legAngle2 = -0.4;
        armAngle1 = -1.2 + Math.sin(t * 8) * 0.2;
        armAngle2 = -0.6;
      } else if (action === 'type') {
        bodyBob = Math.sin(t * 14) * 2;
        armAngle1 = -1.1 + Math.sin(t * 24) * 0.2;
        armAngle2 = -0.9 - Math.sin(t * 24) * 0.2;
      } else {
        // Idle breathing
        bodyBob = Math.sin(t * 4) * 3;
        armAngle1 = 0.25; armAngle2 = -0.25;
      }

      ctx.translate(0, -bodyBob);

      // --- 1. LEGS (Thick stick style) ---
      const hipY = -90;
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      let legColor = '#ffffff';
      if (type === 'jensen') legColor = '#38bdf8';
      else if (type === 'bob') legColor = '#3b82f6';
      else if (type === 'sega') legColor = '#94a3b8';
      else if (type === 'sarah') legColor = '#ec4899';
      else if (type === 'ava') legColor = '#00f0ff';
      ctx.strokeStyle = legColor;

      // Leg 1 (Back)
      ctx.save();
      ctx.translate(-10, hipY);
      ctx.rotate(legAngle1);
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(-4, 52); ctx.lineTo(12, 92);
      ctx.stroke();
      // Foot
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(16, 92, 11, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Leg 2 (Front)
      ctx.save();
      ctx.translate(10, hipY);
      ctx.rotate(legAngle2);
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(4, 52); ctx.lineTo(18, 92);
      ctx.stroke();
      // Foot
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(22, 92, 11, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // --- 2. TORSO / BODY ---
      const neckY = -205;
      const spineY = (neckY + hipY) / 2;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(0, hipY);
      ctx.lineTo(0, neckY);
      ctx.stroke();

      // Character Clothes / Costumes
      if (type === 'jensen') {
        // Jensen's Black Leather Jacket with neon green zipper line
        drawRoundBox(ctx, -26, neckY + 12, 52, 105, 12, '#18181b', '#22c55e', 3);
        ctx.strokeStyle = '#a1a1aa';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, neckY + 22); ctx.lineTo(0, neckY + 112); ctx.stroke();
      } else if (type === 'bob') {
        // Bob's High-Vis Safety Vest
        drawRoundBox(ctx, -24, neckY + 12, 48, 102, 10, '#f97316', '#fbbf24', 3);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(-24, neckY + 45, 48, 10);
        ctx.fillRect(-24, neckY + 75, 48, 10);
      } else if (type === 'sega') {
        // Dark Executive Suit & Blue Tie
        drawRoundBox(ctx, -24, neckY + 12, 48, 102, 8, '#0f172a', '#38bdf8', 2.5);
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(0, neckY + 20); ctx.lineTo(-6, neckY + 70); ctx.lineTo(0, neckY + 85); ctx.lineTo(6, neckY + 70); ctx.closePath();
        ctx.fill();
      } else if (type === 'sarah') {
        // Casual Pink Hoodie
        drawRoundBox(ctx, -24, neckY + 12, 48, 102, 14, '#db2777', '#f472b6', 2.5);
      } else if (type === 'ava') {
        // High-Tech Cyber Suit with glowing circuit lines
        drawRoundBox(ctx, -24, neckY + 12, 48, 102, 12, '#082f49', '#00f0ff', 3);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, neckY + 60, 16, 0, Math.PI * 2);
        ctx.stroke();
      }

      // --- 3. ARMS ---
      const shoulderY = neckY + 22;

      // Arm 1 (Back)
      ctx.save();
      ctx.translate(-22, shoulderY);
      ctx.rotate(armAngle1);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(-12, 42); ctx.lineTo(-16, 82);
      ctx.stroke();
      ctx.restore();

      // Arm 2 (Front)
      ctx.save();
      ctx.translate(22, shoulderY);
      ctx.rotate(armAngle2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(14, 42); ctx.lineTo(26, 82);
      ctx.stroke();

      // Hand / Holding Prop
      const handX = 26, handY = 82;
      ctx.fillStyle = '#ffedd5';
      ctx.beginPath(); ctx.arc(handX, handY, 11, 0, Math.PI * 2); ctx.fill();

      // Handheld Props
      if (holding === 'wrench') {
        ctx.save();
        ctx.translate(handX, handY);
        ctx.rotate(0.4);
        drawRoundBox(ctx, -6, -42, 12, 54, 4, '#94a3b8', '#cbd5e1', 2);
        ctx.beginPath(); ctx.arc(0, -42, 15, 0.4, Math.PI * 2 - 0.4);
        ctx.lineWidth = 7; ctx.strokeStyle = '#e2e8f0'; ctx.stroke();
        ctx.restore();
      } else if (holding === 'check') {
        ctx.save();
        ctx.translate(handX + 10, handY);
        ctx.rotate(-0.2 + Math.sin(t * 8) * 0.08);
        drawRoundBox(ctx, -40, -60, 80, 50, 6, '#065f46', '#34d399', 3);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 15px Arial'; ctx.textAlign = 'center';
        ctx.fillText('$5,000,000', 0, -32);
        ctx.font = '800 9px Arial'; ctx.fillStyle = '#a7f3d0';
        ctx.fillText('SEGA RESCUE', 0, -18);
        ctx.restore();
      } else if (holding === 'chip') {
        ctx.save();
        ctx.translate(handX, handY - 10);
        drawRoundBox(ctx, -20, -20, 40, 40, 6, '#15803d', '#4ade80', 2.5);
        ctx.fillStyle = '#ffffff'; ctx.font = '900 10px Arial'; ctx.textAlign = 'center'; ctx.fillText('NV1', 0, 4);
        ctx.restore();
      } else if (holding === 'book') {
        ctx.save();
        ctx.translate(handX + 6, handY);
        ctx.rotate(0.3);
        drawRoundBox(ctx, -22, -38, 44, 48, 4, '#1e293b', '#f59e0b', 2);
        ctx.fillStyle = '#facc15'; ctx.font = '900 9px Arial'; ctx.textAlign = 'center'; ctx.fillText('RULE', 0, -22); ctx.fillText('BOOK', 0, -10);
        ctx.restore();
      } else if (holding === 'phone') {
        ctx.save();
        ctx.translate(handX, handY - 10);
        drawRoundBox(ctx, -14, -28, 28, 52, 6, '#020617', '#38bdf8', 2);
        ctx.fillStyle = '#22c55e'; ctx.font = '900 14px Arial'; ctx.textAlign = 'center'; ctx.fillText('📞', 0, 0);
        ctx.restore();
      }

      ctx.restore(); // Restore front arm

      // --- 4. HEAD (Big expressive stick figure head) ---
      const headY = neckY - 48;
      ctx.save();
      ctx.translate(0, headY);
      ctx.rotate(headAngle);

      // Head Base (Warm expressive skin tone circle)
      ctx.fillStyle = '#ffedd5';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, 44, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eyes
      const blink = (Math.sin(t * 3.5 + x) > 0.94);
      [-14, 14].forEach(ex => {
        if (blink) {
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.moveTo(ex - 7, -2); ctx.lineTo(ex + 7, -2); ctx.stroke();
        } else {
          ctx.fillStyle = '#0f172a';
          ctx.beginPath(); ctx.arc(ex, -2, 5.5, 0, Math.PI * 2); ctx.fill();
          // Pupil shine
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(ex - 1.5, -4, 2.0, 0, Math.PI * 2); ctx.fill();
        }
      });

      // Glasses for Jensen
      if (type === 'jensen') {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        drawRoundBox(ctx, -26, -12, 22, 18, 4, 'rgba(56, 189, 248, 0.2)', '#38bdf8', 2.5);
        drawRoundBox(ctx, 4, -12, 22, 18, 4, 'rgba(56, 189, 248, 0.2)', '#38bdf8', 2.5);
        ctx.beginPath(); ctx.moveTo(-4, -3); ctx.lineTo(4, -3); ctx.stroke();

        // Silver Hair Puffs
        ctx.fillStyle = '#94a3b8';
        [
          { cx: -28, cy: -34, r: 16 }, { cx: -12, cy: -46, r: 18 },
          { cx: 12, cy: -46, r: 18 }, { cx: 28, cy: -34, r: 16 },
          { cx: 0, cy: -38, r: 17 }
        ].forEach(p => {
          ctx.beginPath(); ctx.arc(p.cx, p.cy, p.r, 0, Math.PI * 2); ctx.fill();
        });
      } else if (type === 'bob') {
        // Hardhat
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.arc(0, -18, 46, Math.PI, Math.PI * 2); ctx.fill();
        drawRoundBox(ctx, -52, -22, 104, 12, 5, '#eab308', '#fef08a', 2);
      } else if (type === 'ava') {
        // Futuristic Cyber Headset & Glowing Visor
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(0, -6, 36, Math.PI * 0.9, Math.PI * 2.1); ctx.stroke();
        // Headset mic
        ctx.beginPath(); ctx.moveTo(-34, -4); ctx.lineTo(-14, 18); ctx.stroke();
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath(); ctx.arc(-14, 18, 5, 0, Math.PI * 2); ctx.fill();
      } else if (type === 'sarah') {
        // Brown Hair Ponytail
        ctx.fillStyle = '#78350f';
        ctx.beginPath(); ctx.arc(0, -16, 44, Math.PI * 0.9, Math.PI * 2.1); ctx.fill();
        ctx.beginPath(); ctx.arc(-38, -12, 16, 0, Math.PI * 2); ctx.fill();
      } else if (type === 'sega') {
        // Dark Neat Hair
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(0, -16, 44, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
      }

      // Mouth
      ctx.strokeStyle = '#7c2d12';
      ctx.fillStyle = '#7c2d12';
      ctx.lineWidth = 3.5;
      if (isTalking) {
        const mOpen = 4 + Math.abs(Math.sin(t * 16)) * 8;
        ctx.beginPath(); ctx.ellipse(0, 16, 9, mOpen, 0, 0, Math.PI * 2); ctx.fill();
      } else if (action === 'panic') {
        const mOpen = 10 + Math.abs(Math.sin(t * 12)) * 6;
        ctx.beginPath(); ctx.ellipse(0, 18, 12, mOpen, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(0, 12, 12, 0.2, Math.PI - 0.2); ctx.stroke();
      }

      // Sweat Drops when panicking
      if (action === 'panic' || (type === 'bob' && action === 'ladder')) {
        const swY = -12 + (t * 80) % 60;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(36, swY, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(36, swY - 7); ctx.lineTo(32, swY + 1); ctx.lineTo(40, swY + 1); ctx.closePath(); ctx.fill();
      }

      ctx.restore(); // Restore head
      ctx.restore(); // Restore main
    }

    // ==========================================
    // STORYBOARD PROP & ENVIRONMENT BUILDERS
    // ==========================================

    // Ladder for Bob
    function drawLadder(ctx, x, y, h) {
      ctx.save();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 8;
      // Rails
      ctx.beginPath(); ctx.moveTo(x - 24, y); ctx.lineTo(x - 24, y + h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 24, y); ctx.lineTo(x + 24, y + h); ctx.stroke();
      // Rungs
      ctx.lineWidth = 6;
      for (let ry = y + 20; ry < y + h - 10; ry += 40) {
        ctx.beginPath(); ctx.moveTo(x - 24, ry); ctx.lineTo(x + 24, ry); ctx.stroke();
      }
      ctx.restore();
    }

    // Sega Boardroom Table
    function drawTable(ctx, x, y, w, h) {
      drawRoundBox(ctx, x - w / 2, y, w, h, 14, '#3b1d11', '#5a2e1d', 4);
      // Wood reflection
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(x - w / 2 + 10, y + 6, w - 20, 14);
    }

    // Flooded House Water Spray for Sarah
    function drawWaterSpray(ctx, pipeX, pipeY, t) {
      ctx.save();
      // Broken Pipe
      drawRoundBox(ctx, pipeX - 60, pipeY - 14, 60, 28, 6, '#b45309', '#f59e0b', 3);
      // High-pressure water jets
      for (let i = 0; i < 9; i++) {
        const ang = -0.3 + (i / 9) * 0.9 + Math.sin(t * 12 + i) * 0.15;
        const speed = 180 + (i % 3) * 60;
        const len = 90 + Math.sin(t * 20 + i) * 35;
        ctx.strokeStyle = (i % 2 === 0) ? '#38bdf8' : '#bae6fd';
        ctx.lineWidth = 4 + (i % 3) * 2;
        ctx.beginPath();
        ctx.moveTo(pipeX, pipeY);
        ctx.lineTo(pipeX + Math.cos(ang) * len, pipeY + Math.sin(ang) * len + 25);
        ctx.stroke();
      }
      // Water puddle rising on floor
      const puddleH = 45 + Math.sin(t * 8) * 6;
      drawRoundBox(ctx, -100, 1450, W + 200, puddleH, 18, 'rgba(56, 189, 248, 0.65)', '#7dd3fc', 3);
      ctx.restore();
    }

    // Vibrating Smartphone
    function drawVibratingPhone(ctx, x, y, t, isMissed = false) {
      ctx.save();
      const vibX = Math.sin(t * 45) * 6;
      const vibY = Math.cos(t * 55) * 6;
      ctx.translate(x + vibX, y + vibY);

      // Warning shockwave rings
      const pulse = (t * 8) % 1;
      ctx.strokeStyle = isMissed ? 'rgba(239, 68, 68, ' + (1 - pulse) + ')' : 'rgba(34, 197, 94, ' + (1 - pulse) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 70 + pulse * 60, 0, Math.PI * 2);
      ctx.stroke();

      // Phone Body
      drawRoundBox(ctx, -45, -80, 90, 160, 16, '#0f172a', isMissed ? '#ef4444' : '#22c55e', 4);
      // Screen
      drawRoundBox(ctx, -38, -68, 76, 136, 10, isMissed ? '#450a0a' : '#042f1a', null);

      ctx.textAlign = 'center';
      if (isMissed) {
        ctx.font = '900 24px Arial'; ctx.fillStyle = '#ef4444'; ctx.fillText('💀', 0, -18);
        ctx.font = '900 13px Arial'; ctx.fillText('MISSED', 0, 10);
        ctx.font = '800 10px Arial'; ctx.fillStyle = '#fca5a5'; ctx.fillText('VOICEMAIL', 0, 26);
      } else {
        ctx.font = '900 26px Arial'; ctx.fillStyle = '#22c55e'; ctx.fillText('📞', 0, -18);
        ctx.font = '900 13px Arial'; ctx.fillText('SARAH', 0, 8);
        ctx.font = '900 14px Arial'; ctx.fillStyle = '#facc15'; ctx.fillText('$8,000', 0, 26);
      }
      ctx.restore();
    }

    // ==========================================
    // MASTER SCENE RENDERER (0s - 74.3s)
    // ==========================================
    window.renderFrame = function(t) {
      // Clear Screen
      ctx.fillStyle = '#070a14';
      ctx.fillRect(0, 0, W, H);

      // Camera shake / impact triggers
      let shakeX = 0, shakeY = 0, flashAlpha = 0;
      const impacts = [0.0, 5.15, 12.0, 15.5, 21.2, 27.5, 33.8, 38.2, 46.3, 51.2, 58.0, 64.2, 70.6];
      impacts.forEach(trig => {
        const diff = t - trig;
        if (diff >= 0 && diff < 0.38) {
          const decay = 1 - (diff / 0.38);
          shakeX += Math.sin(diff * 52) * 20 * decay;
          shakeY += Math.cos(diff * 64) * 16 * decay;
          if (diff < 0.12) flashAlpha = Math.max(flashAlpha, (1 - diff / 0.12) * 0.28);
        }
      });

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Studio Stage Floor
      const floorY = 1420;
      const floorGrad = ctx.createLinearGradient(0, floorY, 0, H);
      floorGrad.addColorStop(0, '#0c1222');
      floorGrad.addColorStop(1, '#03050a');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, floorY, W, H - floorY);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();

      // Top Stepper (① NVIDIA ② SEGA ③ THE BLEED ④ AVA)
      const curAct = (t < 15.2) ? 1 : (t < 33.5) ? 2 : (t < 46.5) ? 3 : 4;
      const actTitles = ['① NVIDIA $3T EMPIRE', '② 1995 SEGA RESCUE', '③ -$8,000 VOICEMAIL BLEED', '④ AVA 24/7 VOICE AI'];

      ctx.save();
      const stepY = 135;
      const spacing = 80;
      const startX = W / 2 - (spacing * 1.5);
      for (let i = 1; i <= 4; i++) {
        const cx = startX + (i - 1) * spacing;
        const isCurrent = (i === curAct);
        const isPast = (i < curAct);

        ctx.beginPath();
        ctx.arc(cx, stepY, isCurrent ? 24 : 20, 0, Math.PI * 2);
        if (isCurrent) {
          ctx.fillStyle = '#facc15'; ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.5; ctx.stroke();
          ctx.font = '900 22px Arial'; ctx.fillStyle = '#090d16'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(String(i), cx, stepY + 1);
        } else if (isPast) {
          ctx.fillStyle = '#22c55e'; ctx.fill();
          ctx.font = '900 20px Arial'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('✓', cx, stepY + 1);
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; ctx.fill();
          ctx.font = '800 18px Arial'; ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(String(i), cx, stepY + 1);
        }
      }

      ctx.font = '900 24px Arial';
      ctx.fillStyle = (curAct === 3) ? '#ef4444' : '#facc15';
      ctx.textAlign = 'center';
      ctx.fillText(actTitles[curAct - 1], W / 2, stepY + 54);
      ctx.restore();

      // ==========================================
      // ACT 1: 0.0s – 15.2s (Nvidia $3T Question & Cheated Death)
      // ==========================================
      if (t < 15.2) {
        // Jensen walking onto stage and interacting with props
        const jensenWalk = t * 6;
        let jensenX = 220 + Math.min(320, t * 75);
        let jAction = 'walk';
        let jHolding = 'book';

        if (t >= 4.5 && t < 10.0) {
          jAction = 'stand';
          jHolding = null;
        } else if (t >= 10.0) {
          jAction = 'jump';
          jHolding = 'chip';
        }

        // Draw $3 Trillion Monument Banner
        drawRoundBox(ctx, W / 2 - 270, 240, 540, 100, 20, 'rgba(15, 23, 42, 0.94)', '#22c55e', 3.5);
        ctx.fillStyle = '#ffffff'; ctx.font = '900 42px Arial'; ctx.textAlign = 'center';
        ctx.fillText('$3,000,000,000,000', W / 2, 290);
        ctx.font = '800 17px Arial'; ctx.fillStyle = '#86efac';
        ctx.fillText('NVIDIA MARKET CAP · BY PLAYING BY THE BOOK?', W / 2, 322);

        // Tossed Rulebook in Trash Can if past 4.0s
        if (t >= 4.0) {
          // Trash can at x = 200
          drawRoundBox(ctx, 160, floorY - 95, 60, 95, 8, '#334155', '#64748b', 3);
          ctx.fillStyle = '#facc15'; ctx.font = '900 14px Arial'; ctx.textAlign = 'center';
          ctx.fillText('TRASH', 190, floorY - 45);
          // Book sticking out
          drawRoundBox(ctx, 172, floorY - 120, 36, 40, 4, '#1e293b', '#ef4444', 2);
          ctx.fillStyle = '#ef4444'; ctx.font = '900 9px Arial'; ctx.fillText('RULES', 190, floorY - 96);
        }

        // "HE CHEATED DEATH" Stamp
        if (t >= 10.5) {
          drawRoundBox(ctx, W / 2 - 260, 400, 520, 85, 18, 'rgba(239, 68, 68, 0.92)', '#fee2e2', 3.5);
          ctx.fillStyle = '#ffffff'; ctx.font = '900 36px Arial'; ctx.textAlign = 'center';
          ctx.fillText('⚠️ HE CHEATED DEATH', W / 2, 452);
        }

        // Draw Stick Jensen
        drawStickGuy({
          x: jensenX, y: floorY, scale: 1.6,
          type: 'jensen',
          action: jAction,
          walkCycle: jensenWalk,
          isTalking: true,
          holding: jHolding
        }, t);
      }

      // ==========================================
      // ACT 2: 15.2s – 33.5s (1995 Sega Boardroom $5M Rescue & Automation)
      // ==========================================
      else if (t < 33.5) {
        const timeInAct = t - 15.2;

        if (timeInAct < 6.5) {
          // 15.2s - 21.7s: 1995 Bankruptcy & Broken Chip Panic
          drawRoundBox(ctx, W / 2 - 260, 240, 520, 95, 18, 'rgba(45, 10, 15, 0.94)', '#ef4444', 3.5);
          ctx.fillStyle = '#ffffff'; ctx.font = '900 38px Arial'; ctx.textAlign = 'center';
          ctx.fillText('🚨 1995: 30 DAYS TO ZERO', W / 2, 290);
          ctx.font = '800 17px Arial'; ctx.fillStyle = '#fca5a5';
          ctx.fillText('Flagship NV1 gaming chip completely broken', W / 2, 320);

          // Smoking broken chip on pedestal
          drawRoundBox(ctx, W / 2 - 40, floorY - 140, 80, 140, 10, '#1e293b', '#475569', 3);
          drawRoundBox(ctx, W / 2 - 35, floorY - 195, 70, 55, 8, '#7f1d1d', '#ef4444', 3);
          ctx.fillStyle = '#fca5a5'; ctx.font = '900 13px Arial'; ctx.textAlign = 'center'; ctx.fillText('BROKEN', W / 2, floorY - 162);
          // Smoke puffs
          for (let s = 0; s < 4; s++) {
            const smY = floorY - 210 - ((t * 50 + s * 30) % 120);
            const smX = W / 2 + Math.sin(t * 8 + s) * 18;
            ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
            ctx.beginPath(); ctx.arc(smX, smY, 14 + s * 4, 0, Math.PI * 2); ctx.fill();
          }

          // Panicking Jensen holding his head
          drawStickGuy({
            x: 280, y: floorY, scale: 1.6,
            type: 'jensen',
            action: 'panic',
            walkCycle: t * 10,
            isTalking: true,
            holding: null
          }, t);
        } else if (timeInAct < 14.0) {
          // 21.7s - 29.2s: Sega Boardroom Table & $5,000,000 Check
          drawRoundBox(ctx, W / 2 - 260, 240, 520, 95, 18, 'rgba(6, 78, 59, 0.94)', '#34d399', 3.5);
          ctx.fillStyle = '#ffffff'; ctx.font = '900 38px Arial'; ctx.textAlign = 'center';
          ctx.fillText('🤝 SEGA BOARDROOM $5M', W / 2, 290);
          ctx.font = '800 17px Arial'; ctx.fillStyle = '#a7f3d0';
          ctx.fillText('Jensen confessed failure ➔ walked out with cash', W / 2, 320);

          // Long Mahogany Table
          drawTable(ctx, W / 2, floorY - 100, 560, 100);

          // Two Sega Bosses on the right side of table
          drawStickGuy({
            x: W / 2 + 130, y: floorY, scale: 1.5,
            type: 'sega', action: 'stand', facing: -1, isTalking: false
          }, t);
          drawStickGuy({
            x: W / 2 + 220, y: floorY, scale: 1.5,
            type: 'sega', action: 'stand', facing: -1, isTalking: false
          }, t);

          // Jensen on the left holding the giant $5,000,000 Check!
          drawStickGuy({
            x: W / 2 - 160, y: floorY, scale: 1.6,
            type: 'jensen', action: (timeInAct >= 10.5) ? 'jump' : 'stand',
            facing: 1, isTalking: true, holding: 'check'
          }, t);
        } else {
          // 29.2s - 33.5s: Ruthless Automation
          drawRoundBox(ctx, W / 2 - 260, 240, 520, 95, 18, 'rgba(15, 23, 42, 0.94)', '#00f0ff', 3.5);
          ctx.fillStyle = '#ffffff'; ctx.font = '900 38px Arial'; ctx.textAlign = 'center';
          ctx.fillText('⚡ RUTHLESS AUTOMATION', W / 2, 290);
          ctx.font = '800 17px Arial'; ctx.fillStyle = '#38bdf8';
          ctx.fillText('Pivoted from manual bottleneck to software', W / 2, 320);

          // Automation Gears on stage
          for (let g = 0; g < 3; g++) {
            const gx = W / 2 + (g - 1) * 140;
            const gy = floorY - 180;
            ctx.save();
            ctx.translate(gx, gy);
            ctx.rotate(t * (g % 2 === 0 ? 3 : -3));
            ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(0, 0, 48, 0, Math.PI * 2); ctx.stroke();
            for (let teeth = 0; teeth < 8; teeth++) {
              ctx.rotate(Math.PI / 4);
              ctx.fillStyle = '#00f0ff';
              ctx.fillRect(-6, -56, 12, 16);
            }
            ctx.restore();
          }

          drawStickGuy({
            x: 240, y: floorY, scale: 1.6,
            type: 'jensen', action: 'walk', walkCycle: t * 8, isTalking: true, holding: 'chip'
          }, t);
        }
      }

      // ==========================================
      // ACT 3: 33.5s – 46.5s (Contractor Attic, Sarah's Flooded House & -$8,000 Cash Bleed)
      // ==========================================
      else if (t < 46.5) {
        const timeInAct = t - 33.5;
        const isMissed = (timeInAct >= 4.5);

        drawRoundBox(ctx, W / 2 - 260, 240, 520, 95, 18, 'rgba(45, 10, 15, 0.94)', '#ef4444', 3.5);
        ctx.fillStyle = '#ffffff'; ctx.font = '900 38px Arial'; ctx.textAlign = 'center';
        ctx.fillText(isMissed ? '-$8,000 LOST TO VOICEMAIL' : '🚨 EMERGENCY CALL RINGING', W / 2, 290);
        ctx.font = '800 17px Arial'; ctx.fillStyle = '#fca5a5';
        ctx.fillText(isMissed ? 'Sarah hung up and called competitor #2' : 'Bob is stuck 15ft up ladder in 130°F heat', W / 2, 320);

        // Split Divider line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W / 2, 360); ctx.lineTo(W / 2, floorY); ctx.stroke();

        // --- RIGHT SIDE: Homeowner Sarah & Flooded House ---
        ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
        ctx.fillRect(W / 2 + 10, 360, W / 2 - 20, floorY - 360);
        ctx.fillStyle = '#f472b6'; ctx.font = '900 20px Arial'; ctx.textAlign = 'center';
        ctx.fillText('SARAH · FLOODED LIVING ROOM', W * 0.75, 400);

        drawWaterSpray(ctx, W - 80, 850, t);
        drawStickGuy({
          x: W * 0.72, y: floorY, scale: 1.5,
          type: 'sarah', action: 'panic', walkCycle: t * 12, isTalking: true, holding: 'phone'
        }, t);

        // --- LEFT SIDE: Contractor Bob on Attic Ladder ---
        ctx.fillStyle = 'rgba(249, 115, 22, 0.12)';
        ctx.fillRect(10, 360, W / 2 - 20, floorY - 360);
        ctx.fillStyle = '#fb923c'; ctx.font = '900 20px Arial'; ctx.textAlign = 'center';
        ctx.fillText('BOB · 130°F ATTIC LADDER', W * 0.25, 400);

        // Tall Ladder
        drawLadder(ctx, W * 0.25, 520, 900);

        // Bob up on ladder
        drawStickGuy({
          x: W * 0.25, y: 780, scale: 1.4,
          type: 'bob', action: 'ladder', walkCycle: t * 4, isTalking: true, holding: 'wrench'
        }, t);

        // Bob's phone vibrating at the bottom of the ladder
        drawVibratingPhone(ctx, W * 0.25 + 90, floorY - 80, t, isMissed);

        // If missed, $100 dollar bills flying away into red void
        if (isMissed) {
          for (let b = 0; b < 12; b++) {
            const bx = W * 0.25 + 90 + Math.sin(t * 3 + b) * 160 + (b % 3) * 30;
            const by = floorY - 140 - ((t * 90 + b * 45) % 380);
            drawRoundBox(ctx, bx - 25, by - 14, 50, 28, 4, '#15803d', '#ef4444', 2.5);
            ctx.fillStyle = '#ffffff'; ctx.font = '900 12px Arial'; ctx.textAlign = 'center';
            ctx.fillText('$100', bx, by + 4);
          }
        }
      }

      // ==========================================
      // ACT 4: 46.5s – 64.0s (AVA 24/7 Voice AI & 0.8s Instant Dispatch)
      // ==========================================
      else if (t < 64.0) {
        const timeInAct = t - 46.5;

        drawRoundBox(ctx, W / 2 - 270, 240, 540, 95, 18, 'rgba(8, 47, 73, 0.94)', '#00f0ff', 3.5);
        ctx.fillStyle = '#ffffff'; ctx.font = '900 38px Arial'; ctx.textAlign = 'center';
        ctx.fillText('⚡ MEET AVA: 24/7 VOICE AI', W / 2, 290);
        ctx.font = '800 17px Arial'; ctx.fillStyle = '#38bdf8';
        ctx.fillText('Answers in 0.8s · Qualifies Emergency · Dispatches to Truck', W / 2, 320);

        // 0.8s Speedometer Stopwatch Badge
        drawRoundBox(ctx, W / 2 - 120, 370, 240, 75, 16, '#0f172a', '#22c55e', 3.5);
        ctx.fillStyle = '#22c55e'; ctx.font = '900 38px Arial'; ctx.textAlign = 'center';
        ctx.fillText('0.8s', W / 2, 420);
        ctx.font = '800 12px Arial'; ctx.fillStyle = '#86efac';
        ctx.fillText('1ST RING ANSWER', W / 2, 438);

        // AVA standing center stage typing on holographic keyboard
        drawStickGuy({
          x: 340, y: floorY, scale: 1.6,
          type: 'ava', action: 'type', walkCycle: t * 14, isTalking: true, holding: null
        }, t);

        // Holographic Dispatch Cards flying from AVA to Bob
        const cards = [
          { title: '⚡ 0.8s 1ST RING ANSWER', sub: 'Instant Voice AI Pickup', col: '#00f0ff', y: 520 },
          { title: '🎯 JOB QUALIFIED: $8,000', sub: 'Calendar Slot Confirmed', col: '#22c55e', y: 640 },
          { title: '🚚 DISPATCHED TO TRUCK', sub: 'SMS straight to technician', col: '#facc15', y: 760 }
        ];

        cards.forEach((c, idx) => {
          if (timeInAct >= idx * 4.0) {
            drawRoundBox(ctx, 480, c.y, 480, 85, 14, 'rgba(15, 23, 42, 0.92)', c.col, 3);
            ctx.fillStyle = '#ffffff'; ctx.font = '900 20px Arial'; ctx.textAlign = 'left';
            ctx.fillText(c.title, 505, c.y + 36);
            ctx.font = '700 14px Arial'; ctx.fillStyle = '#94a3b8';
            ctx.fillText(c.sub, 505, c.y + 64);
          }
        });

        // Happy Bob in his work truck on the right
        // Draw Truck outline
        drawRoundBox(ctx, 720, floorY - 260, 280, 180, 18, '#1e293b', '#3b82f6', 4);
        drawRoundBox(ctx, 740, floorY - 240, 110, 80, 8, '#38bdf8', null); // Windshield
        // Wheels
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(770, floorY - 70, 36, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(930, floorY - 70, 36, 0, Math.PI * 2); ctx.fill();

        // Bob giving thumbs up inside truck
        drawStickGuy({
          x: 790, y: floorY - 110, scale: 1.1,
          type: 'bob', action: 'stand', walkCycle: 0, isTalking: false, holding: 'phone'
        }, t);
      }

      // ==========================================
      // ACT 5: 64.0s – 74.3s (Live Call Challenge & Comment AVA)
      // ==========================================
      else {
        // Giant Phone with Dialer
        drawRoundBox(ctx, W / 2 - 270, 240, 540, 95, 18, 'rgba(10, 15, 29, 0.96)', '#38bdf8', 3.5);
        ctx.fillStyle = '#ffffff'; ctx.font = '900 36px Arial'; ctx.textAlign = 'center';
        ctx.fillText('📞 TEST AVA LIVE RIGHT NOW', W / 2, 290);
        ctx.font = '800 17px Arial'; ctx.fillStyle = '#7dd3fc';
        ctx.fillText('Hear her answer on the 1st ring in 0.8s', W / 2, 320);

        // Giant Phone Card
        drawRoundBox(ctx, W / 2 - 280, 380, 560, 340, 26, 'rgba(15, 23, 42, 0.96)', '#22c55e', 4);

        // Dialed Phone Number
        ctx.fillStyle = '#ffffff'; ctx.font = '900 58px Arial'; ctx.textAlign = 'center';
        ctx.fillText('(561) 813-8602', W / 2, 480);

        // Green Call Button
        const pulse = 1 + Math.sin(t * 8) * 0.04;
        ctx.save();
        ctx.translate(W / 2, 570);
        ctx.scale(pulse, pulse);
        drawRoundBox(ctx, -190, -35, 380, 70, 18, '#22c55e', '#86efac', 3);
        ctx.fillStyle = '#052e16'; ctx.font = '900 26px Arial';
        ctx.fillText('DIAL (561) 813-8602', 0, 9);
        ctx.restore();

        // Comment AVA Banner
        drawRoundBox(ctx, W / 2 - 260, 780, 520, 90, 18, 'rgba(250, 204, 21, 0.2)', '#facc15', 3.5);
        ctx.fillStyle = '#facc15'; ctx.font = '900 32px Arial'; ctx.textAlign = 'center';
        ctx.fillText('💬 OR COMMENT "AVA" BELOW', W / 2, 836);

        // AVA and Bob celebrating on stage together
        drawStickGuy({
          x: 280, y: floorY, scale: 1.6,
          type: 'ava', action: 'jump', walkCycle: t * 10, isTalking: true, holding: 'phone'
        }, t);

        drawStickGuy({
          x: 800, y: floorY, scale: 1.6,
          type: 'bob', action: 'jump', walkCycle: t * 10, isTalking: false, holding: 'check'
        }, t);
      }

      // ==========================================
      // KINETIC HORMOZI CAPTIONS (Safe lower-third at Y=1620)
      // ==========================================
      const activeWordIdx = WORDS.findIndex(w => t >= w.start && t <= w.end);
      let targetIdx = activeWordIdx;
      if (targetIdx === -1) {
        for (let i = WORDS.length - 1; i >= 0; i--) {
          if (t >= WORDS[i].end) { targetIdx = Math.min(i, WORDS.length - 1); break; }
        }
      }
      if (targetIdx === -1) targetIdx = 0;

      const chunkStart = Math.max(0, targetIdx - 1);
      const chunkWords = WORDS.slice(chunkStart, chunkStart + 3);

      ctx.save();
      const capY = 1620;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let totalWidth = 0;
      ctx.font = '900 62px Arial';
      const wordMetrics = chunkWords.map(cw => {
        const txt = cw.word.toUpperCase();
        const m = ctx.measureText(txt);
        totalWidth += m.width + 30;
        return { txt, width: m.width, isCurrent: (cw.start <= t && cw.end >= t) };
      });

      const pillW = Math.min(W - 80, totalWidth + 90);
      drawRoundBox(ctx, W / 2 - pillW / 2, capY - 58, pillW, 116, 26, 'rgba(4, 8, 18, 0.92)', 'rgba(56, 189, 248, 0.45)', 2.5);

      let startWordX = W / 2 - totalWidth / 2;
      wordMetrics.forEach((wm) => {
        const curWordX = startWordX + wm.width / 2;
        ctx.save();
        ctx.translate(curWordX, capY);

        if (wm.isCurrent) {
          const pop = 1 + Math.sin(t * 20) * 0.1;
          ctx.scale(pop, pop);

          ctx.font = '900 72px Arial';
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 24;
          ctx.fillText(wm.txt, 3, 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(wm.txt, 0, 0);
        } else {
          ctx.font = '900 58px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.shadowBlur = 0;
          ctx.fillText(wm.txt, 0, 0);
        }

        ctx.restore();
        startWordX += wm.width + 30;
      });

      ctx.restore();

      // White Impact Flash on Key Punchlines
      if (flashAlpha > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, ' + flashAlpha + ')';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      ctx.restore(); // Restore camera shake
    };
  </script>
</body>
</html>`;

const tmpHtmlPath = path.join(root, 'scripts/tmp_stick_reel.html');
fs.writeFileSync(tmpHtmlPath, htmlContent, 'utf8');

async function renderVideo() {
  const userDataDir = path.join(root, '.cache/edge_profile_stick');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    userDataDir: userDataDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--allow-file-access-from-files',
      '--disable-web-security',
      '--disable-gpu-shader-disk-cache',
      '--disable-gpu-program-cache'
    ]
  });

  const page = await browser.newPage();
  page.on('pageerror', err => console.error('BROWSER PAGE ERROR:', err.message, err.stack));
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
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
  let stdinClosed = false;
  ff.stdin.on('error', () => { stdinClosed = true; });

  const startTime = Date.now();
  for (let f = 0; f < totalFrames; f++) {
    if (stdinClosed) break;
    const t = f / FPS;
    await page.evaluate((tm) => window.renderFrame(tm), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 85 });
    if (stdinClosed) break;
    try {
      if (!ff.stdin.write(buf)) {
        await new Promise(res => ff.stdin.once('drain', res));
      }
    } catch (e) {
      break;
    }
    if (f % 60 === 0 || f === totalFrames - 1) {
      const pct = ((f / totalFrames) * 100).toFixed(0);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stdout.write(`\r[STICK FIGURE RENDER] Frame ${f}/${totalFrames} (${pct}%) — ${elapsed}s elapsed`);
    }
  }

  try { ff.stdin.end(); } catch (e) {}
  await new Promise((resolve, reject) => {
    ff.on('close', code => code === 0 ? resolve() : reject(new Error(ffErr)));
  });

  await browser.close();
  try { fs.unlinkSync(tmpHtmlPath); } catch (e) {}
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

  fs.copyFileSync(outMp4Path, outNamedMp4);
  fs.copyFileSync(outMp4Path, outSpeedMp4);
  try {
    fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-30s-reel-2.mp4'));
    fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-nvidia-reel.mp4'));
  } catch (e) {
    console.log('Artifact copy skipped:', e.message);
  }

  const sz = (fs.statSync(outMp4Path).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ Stick Figure Storytelling Reel Rendered: ${outMp4Path} (${sz} MB)`);
}

renderVideo().catch(err => {
  console.error('\nRender error:', err);
  process.exit(1);
});
