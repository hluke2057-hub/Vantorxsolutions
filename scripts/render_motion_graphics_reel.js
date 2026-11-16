// scripts/render_motion_graphics_reel.js
// VantorX Solutions - 100% Vector & 2.5D Animated Motion Graphics Reel (28.0s)
// 1080x1920 Vertical (9:16) @ 30fps = 840 frames
// ZERO live action, ZERO still photos, ZERO humans - 100% continuous illustrated motion graphics

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\80451426-584a-4969-8d9c-573a8dd3a27d';

const audioPath = path.join(root, 'website/demo/audio/vantorx-motion-master.wav');
const outCommercialMp4 = path.join(root, 'website/demo/video/vantorx-ai-receptionist-commercial.mp4');
const outReel2Mp4 = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const outMotionMp4 = path.join(root, 'website/demo/video/vantorx-motion-graphics-reel.mp4');
const artifactMp4 = path.join(ARTIFACT_DIR, 'vantorx-30s-reel-2.mp4');

const TOTAL_SEC = 28.0;
const FPS = 30;
const W = 1080;
const H = 1920;
const totalFrames = Math.ceil(TOTAL_SEC * FPS);

console.log(`Setting up Motion Graphics Reel Pipeline: ${TOTAL_SEC}s (${totalFrames} frames @ 30fps)`);

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #050813; overflow: hidden; width: 1080px; height: 1920px; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif; }
    canvas { width: 1080px; height: 1920px; image-rendering: -webkit-optimize-contrast; }
  </style>
</head>
<body>
  <canvas id="c" width="1080" height="1920"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const W = 1080, H = 1920;

    // Easing helpers
    function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
    function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    function easeOutBack(x) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
    function easeOutElastic(x) {
      const c4 = (2 * Math.PI) / 3;
      return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }

    // Helper: Rounded Rectangle
    function roundRect(ctx, x, y, w, h, r, fill, stroke, strokeW = 2) {
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, r);
      } else {
        const rad = typeof r === 'number' ? r : 12;
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
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = strokeW; ctx.stroke(); }
    }

    // Helper: Phone Icon
    function drawPhoneIcon(ctx, x, y, size, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
      ctx.fill();
      // Receiver silhouette inside
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size * 0.14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.22, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.stroke();
      ctx.restore();
    }

    // Particle Background System (80 continuous cyber floating nodes)
    const PARTICLES = [];
    for (let i = 0; i < 80; i++) {
      PARTICLES.push({
        x: (i * 1337) % W,
        y: (i * 7331) % H,
        vx: ((i % 5) - 2) * 12,
        vy: -20 - (i % 7) * 15,
        r: 1.5 + (i % 4) * 1.5,
        color: (i % 3 === 0) ? '#38bdf8' : (i % 3 === 1) ? '#818cf8' : '#ffffff',
        alpha: 0.15 + (i % 5) * 0.12
      });
    }

    // Master Render Frame
    window.renderFrame = function(t) {
      ctx.save();

      // ==========================================
      // CONTINUOUS TECH BACKGROUND (0.0s - 28.0s)
      // Obsidian gradient + Isometric Tech Grid + Drifting Cyber Particles
      // ==========================================
      const bgGrad = ctx.createRadialGradient(W / 2, H * 0.45, 100, W / 2, H * 0.5, W * 0.95);
      bgGrad.addColorStop(0, '#0c1630');
      bgGrad.addColorStop(0.55, '#060a17');
      bgGrad.addColorStop(1, '#02040a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Subtle Cyber Grid with continuous vertical glide
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const gridOffset = (t * 24) % 60;
      for (let x = 0; x <= W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = gridOffset; y <= H; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();

      // Floating particles
      PARTICLES.forEach(p => {
        const px = ((p.x + t * p.vx) % W + W) % W;
        const py = ((p.y + t * p.vy) % H + H) % H;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // ==============================================================
      // SCENE 1 — THE HOOK (0.0s – 3.0s)
      // Rapid Phone Fly-in, Explosion of Calls, Rapid Counter (1, 2, 5, 10), Shake
      // ==============================================================
      if (t >= 0.0 && t < 3.2) {
        const p1 = Math.min(1, Math.max(0, t / 0.7)); // Fly-in
        const phoneBounce = easeOutElastic(p1);
        const phoneY = 2200 - (2200 - 920) * phoneBounce;

        // Violent vibration shake from 0.7s to 3.0s
        let shakeX = 0, shakeY = 0;
        if (t >= 0.65) {
          shakeX = Math.sin(t * 85) * 10;
          shakeY = Math.cos(t * 110) * 8;
        }

        // Draw 2.5D Illustrated Smartphone
        ctx.save();
        ctx.translate(W / 2 + shakeX, phoneY + shakeY);

        // Phone Shadow
        roundRect(ctx, -210, -410, 420, 820, 52, 'rgba(0, 0, 0, 0.65)', null);

        // Phone Body (Glossy Space Gray + Cyan Rim)
        roundRect(ctx, -200, -400, 400, 800, 48, '#0b1120', 'rgba(56, 189, 248, 0.75)', 4);

        // Screen Bezel & Display
        roundRect(ctx, -180, -380, 360, 760, 36, '#030712', 'rgba(255, 255, 255, 0.1)', 1.5);

        // Dynamic Island / Notch
        roundRect(ctx, -60, -365, 120, 26, 13, '#000000', 'rgba(255, 255, 255, 0.15)', 1);

        // Inside Phone: Shocking Red Incoming Call Screen
        const pulse = Math.sin(t * 18) * 0.5 + 0.5;
        const screenGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 280);
        screenGrad.addColorStop(0, 'rgba(239, 68, 68, ' + (0.35 + pulse * 0.2) + ')');
        screenGrad.addColorStop(1, 'rgba(3, 7, 18, 0.9)');
        roundRect(ctx, -170, -340, 340, 680, 24, screenGrad, null);

        // Central Vibrating Ringing Icon
        drawPhoneIcon(ctx, 0, -40, 110 + pulse * 14, '#ef4444');

        // Missed Call Counter: 1, 2, 5, 10
        let missedCount = 1;
        if (t > 1.1) missedCount = 2;
        if (t > 1.8) missedCount = 5;
        if (t > 2.4) missedCount = 10;

        // Big Red Counter Badge
        roundRect(ctx, -90, 80, 180, 56, 28, '#ef4444', '#ffffff', 3);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 32px "SF Pro Display", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(missedCount + ' MISSED', 0, 108);

        ctx.font = '700 20px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#f87171';
        ctx.fillText('NO ANSWER...', 0, 175);

        ctx.restore();

        // Exploding Call Notifications around phone (staggered bursts)
        if (t >= 0.8) {
          const notifs = [
            { angle: -0.85, dist: 380, name: 'Customer (561) 555-0192', time: 'Just now' },
            { angle: 0.85,  dist: 380, name: 'Homeowner · Voicemail',  time: 'Just now' },
            { angle: -2.3,  dist: 410, name: 'Missed Call · Service',   time: '1m ago' },
            { angle: 2.3,   dist: 410, name: 'New Client · Abandoned', time: '2m ago' }
          ];

          notifs.forEach((n, idx) => {
            const delay = 0.8 + idx * 0.25;
            if (t >= delay) {
              const notifProg = Math.min(1, (t - delay) / 0.4);
              const notifScale = easeOutBack(notifProg);
              const curDist = n.dist * (0.6 + 0.4 * notifScale);
              const nx = W / 2 + Math.cos(n.angle) * curDist;
              const ny = 920 + Math.sin(n.angle) * curDist;

              ctx.save();
              ctx.translate(nx, ny);
              ctx.scale(notifScale, notifScale);

              // Notification Pill with Red Accent
              roundRect(ctx, -170, -36, 340, 72, 20, 'rgba(15, 23, 42, 0.95)', '#ef4444', 2.5);

              // Phone icon
              drawPhoneIcon(ctx, -130, 0, 42, '#ef4444');

              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.font = '800 18px "SF Pro Display", sans-serif';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(n.name, -95, -10);

              ctx.font = '600 14px "SF Pro Display", sans-serif';
              ctx.fillStyle = '#f87171';
              ctx.fillText('❌ Missed Call • ' + n.time, -95, 14);

              ctx.restore();
            }
          });
        }

        // Kinetic Headline: "HOW MANY CUSTOMERS ARE YOU MISSING?"
        const headProg = Math.min(1, Math.max(0, (t - 0.2) / 0.6));
        const headScale = easeOutBack(headProg);
        ctx.save();
        ctx.translate(W / 2, 240);
        ctx.scale(headScale, headScale);
        ctx.textAlign = 'center';

        ctx.font = '800 28px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '4px';
        ctx.fillStyle = '#f87171';
        ctx.fillText('CRITICAL PROBLEM', 0, -50);

        ctx.font = '900 52px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
        ctx.shadowBlur = 24;
        ctx.fillText('HOW MANY CUSTOMERS', 0, 10);
        ctx.fillText('ARE YOU MISSING?', 0, 72);
        ctx.restore();
      }

      // ==============================================================
      // SCENE 2 — THE PROBLEM (3.0s – 7.0s)
      // Calls moving toward phone, popping/disappearing, lost customer ghost icons, revenue drops
      // Display: "MISSED CALLS = LOST OPPORTUNITIES"
      // ==============================================================
      else if (t >= 3.0 && t < 7.2) {
        const s2Prog = (t - 3.0) / 4.0;

        // Headline: "MISSED CALLS = LOST OPPORTUNITIES"
        const headProg = Math.min(1, (t - 3.0) / 0.5);
        ctx.save();
        ctx.translate(W / 2, 220);
        ctx.scale(easeOutBack(headProg), easeOutBack(headProg));
        ctx.textAlign = 'center';

        ctx.font = '900 52px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
        ctx.shadowBlur = 28;
        ctx.fillText('MISSED CALLS =', 0, 0);

        ctx.font = '900 56px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('LOST OPPORTUNITIES', 0, 68);
        ctx.restore();

        // Central Phone with Busy Signal / Dropped Calls
        ctx.save();
        ctx.translate(W / 2, 880);
        roundRect(ctx, -160, -320, 320, 640, 42, '#080d1a', 'rgba(239, 68, 68, 0.6)', 3);
        roundRect(ctx, -140, -300, 280, 600, 30, '#03060f', 'rgba(255, 255, 255, 0.08)', 1);

        // Pulsing Red Warning Radar inside phone
        const radarR = (t * 120) % 180;
        ctx.strokeStyle = 'rgba(239, 68, 68, ' + (1 - radarR / 180) * 0.8 + ')';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, -30, radarR, 0, Math.PI * 2);
        ctx.stroke();

        drawPhoneIcon(ctx, 0, -30, 80, '#ef4444');

        ctx.font = '800 24px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#f87171';
        ctx.textAlign = 'center';
        ctx.fillText('LINE BUSY', 0, 70);
        ctx.font = '600 18px "SF Pro Display", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText('Hanging up...', 0, 105);
        ctx.restore();

        // 4 Incoming Calls that move inward, FAIL, and turn into drifting Lost Customer Ghost Icons
        const callTrajectories = [
          { startT: 3.2, endT: 4.8, x0: 120,  y0: 550, xFail: 360, yFail: 780,  name: 'Sarah (HVAC)' },
          { startT: 3.8, endT: 5.4, x0: 960,  y0: 600, xFail: 720, yFail: 820,  name: 'David (Roofing)' },
          { startT: 4.5, endT: 6.2, x0: 100,  y0: 1200, xFail: 350, yFail: 980, name: 'Mike (Emergency)' },
          { startT: 5.1, endT: 6.9, x0: 980,  y0: 1250, xFail: 730, yFail: 960, name: 'Emma (Quote)' }
        ];

        callTrajectories.forEach(ct => {
          if (t >= ct.startT) {
            const life = (t - ct.startT) / (ct.endT - ct.startT);
            if (life <= 0.45) {
              // Moving inward as incoming call
              const inP = life / 0.45;
              const cx = ct.x0 + (ct.xFail - ct.x0) * inP;
              const cy = ct.y0 + (ct.yFail - ct.y0) * inP;

              ctx.save();
              ctx.translate(cx, cy);
              roundRect(ctx, -120, -28, 240, 56, 18, '#1e293b', '#38bdf8', 2);
              drawPhoneIcon(ctx, -90, 0, 32, '#38bdf8');
              ctx.fillStyle = '#ffffff';
              ctx.font = '700 16px "SF Pro Display", sans-serif';
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.fillText(ct.name, -65, 0);
              ctx.restore();
            } else {
              // Popped / Transformed into LOST CUSTOMER GHOST drifting away
              const outP = (life - 0.45) / 0.55;
              const driftY = ct.yFail - outP * 160;
              const driftX = ct.xFail + (ct.xFail > 540 ? outP * 180 : -outP * 180);
              const alpha = Math.max(0, 1 - outP);

              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.translate(driftX, driftY);

              roundRect(ctx, -140, -32, 280, 64, 18, 'rgba(15, 23, 42, 0.9)', '#f43f5e', 2);

              // Lost Customer Icon (Silhouette with down arrow)
              ctx.fillStyle = '#f43f5e';
              ctx.beginPath();
              ctx.arc(-105, -5, 14, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(-105, 18, 20, Math.PI, Math.PI * 2);
              ctx.fill();

              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.font = '800 16px "SF Pro Display", sans-serif';
              ctx.fillStyle = '#fda4af';
              ctx.fillText('LOST CUSTOMER ↘', -75, -8);
              ctx.font = '600 13px "SF Pro Display", sans-serif';
              ctx.fillStyle = 'rgba(255,255,255,0.7)';
              ctx.fillText('Went to competitor', -75, 14);
              ctx.restore();
            }
          }
        });

        // Animated Dropping Opportunity Meter
        ctx.save();
        ctx.translate(W / 2, 1480);
        roundRect(ctx, -380, -60, 760, 140, 24, '#0b1329', 'rgba(239, 68, 68, 0.4)', 2);

        ctx.font = '800 20px "SF Pro Display", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'left';
        ctx.fillText('REVENUE POTENTIAL', -340, -20);

        // Red dropping bar
        const dropBarW = Math.max(80, 680 * (1 - s2Prog * 0.75));
        roundRect(ctx, -340, 10, 680, 28, 14, '#1e293b', null);
        roundRect(ctx, -340, 10, dropBarW, 28, 14, '#ef4444', null);

        ctx.font = '900 22px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#f87171';
        ctx.textAlign = 'right';
        ctx.fillText('DROPPING...', 340, -20);
        ctx.restore();
      }

      // ==============================================================
      // SCENE 3 — INTRODUCE THE SOLUTION (7.0s – 11.0s)
      // Screen transforms, Glowing AI phone assembles from geometric plates,
      // Sound wave enters phone, Green answered indicator springs out.
      // Display: "MEET YOUR AI RECEPTIONIST"
      // ==============================================================
      else if (t >= 7.0 && t < 11.2) {
        const s3Prog = Math.min(1, Math.max(0, (t - 7.0) / 4.0));

        // Expanding Blue Shockwave at 7.0s
        if (t < 8.2) {
          const waveR = (t - 7.0) * 1400;
          ctx.strokeStyle = 'rgba(56, 189, 248, ' + Math.max(0, 1 - (t - 7.0) / 1.2) * 0.8 + ')';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(W / 2, 880, waveR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Headline: "MEET YOUR AI RECEPTIONIST"
        const headProg = Math.min(1, (t - 7.2) / 0.6);
        ctx.save();
        ctx.translate(W / 2, 220);
        ctx.scale(easeOutBack(headProg), easeOutBack(headProg));
        ctx.textAlign = 'center';

        ctx.font = '800 28px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '6px';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('THE SOLUTION', 0, -45);

        ctx.font = '900 56px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowBlur = 32;
        ctx.fillText('MEET YOUR', 0, 15);
        ctx.fillText('AI RECEPTIONIST', 0, 78);
        ctx.restore();

        // Assemble phone from geometric shards (7.0s - 7.8s)
        const assembleProg = Math.min(1, Math.max(0, (t - 7.0) / 0.8));
        const assembleEase = easeOutCubic(assembleProg);

        const shardOffset = (1 - assembleEase) * 400;

        ctx.save();
        ctx.translate(W / 2, 920);

        // Shard Top-Left & Bottom-Right snapping together
        roundRect(ctx, -210 - shardOffset, -410 - shardOffset, 420, 820, 52, 'rgba(0, 0, 0, 0.7)', null);
        roundRect(ctx, -200 + shardOffset * 0.5, -400 + shardOffset * 0.5, 400, 800, 48, '#0b162c', '#38bdf8', 4);
        roundRect(ctx, -180, -380, 360, 760, 36, '#020617', 'rgba(56, 189, 248, 0.3)', 2);

        // Glowing AI Core inside Phone
        const aiGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, 240);
        aiGlow.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        aiGlow.addColorStop(0.7, 'rgba(129, 140, 248, 0.15)');
        aiGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = aiGlow;
        ctx.fillRect(-170, -370, 340, 740);

        // Animated Sound Wave entering phone (7.8s - 11.0s)
        if (t >= 7.6) {
          ctx.save();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 18;

          ctx.beginPath();
          for (let wx = -140; wx <= 140; wx += 4) {
            const waveY = Math.sin(wx * 0.08 + t * 14) * 28 * Math.sin((wx + 140) / 280 * Math.PI);
            if (wx === -140) ctx.moveTo(wx, waveY);
            else ctx.lineTo(wx, waveY);
          }
          ctx.stroke();

          // Second harmonic wave (purple)
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let wx = -140; wx <= 140; wx += 4) {
            const waveY = Math.sin(wx * 0.12 - t * 18) * 18 * Math.sin((wx + 140) / 280 * Math.PI);
            if (wx === -140) ctx.moveTo(wx, waveY);
            else ctx.lineTo(wx, waveY);
          }
          ctx.stroke();
          ctx.restore();
        }

        // Green Answered Call Badge (8.2s onwards)
        if (t >= 8.2) {
          const badgeProg = Math.min(1, (t - 8.2) / 0.5);
          const badgeScale = easeOutBack(badgeProg);
          ctx.save();
          ctx.translate(0, 180);
          ctx.scale(badgeScale, badgeScale);

          roundRect(ctx, -140, -40, 280, 80, 26, '#064e3b', '#10b981', 3);
          // Checkmark circle
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(-95, 0, 24, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(-103, -1);
          ctx.lineTo(-97, 6);
          ctx.lineTo(-87, -6);
          ctx.stroke();

          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.font = '900 20px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('CALL ANSWERED', -60, -10);

          ctx.font = '700 16px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.fillText('⚡ 0.2s Instant Pickup', -60, 14);

          ctx.restore();
        }

        ctx.restore();
      }

      // ==============================================================
      // SCENE 4 — SHOW WHAT IT DOES (11.0s – 19.0s)
      // 4 Fast Animated Feature Demonstrations:
      // 1. (11-13s): ANSWERS EVERY CALL
      // 2. (13-15s): VOICE WAVEFORM / NATURAL SPEECH
      // 3. (15-17s): CAPTURES LEADS (Animated Contact Card)
      // 4. (17-19s): BOOKS APPOINTMENTS & AVAILABLE 24/7 (Calendar + Clock)
      // ==============================================================
      else if (t >= 11.0 && t < 19.2) {

        // Sub-feature 1: ANSWERS EVERY CALL (11.0s – 13.0s)
        if (t < 13.0) {
          const featP = (t - 11.0) / 2.0;

          // Kinetic Title Badge
          ctx.save();
          ctx.translate(W / 2, 240);
          ctx.textAlign = 'center';
          ctx.font = '900 54px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 24;
          ctx.fillText('ANSWERS EVERY CALL', 0, 0);

          ctx.font = '700 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.letterSpacing = '3px';
          ctx.fillText('0.2s ZERO WAIT TIME • 100% PICKUP RATE', 0, 48);
          ctx.restore();

          // Central Hero: Connected Call Interface
          ctx.save();
          ctx.translate(W / 2, 920);
          roundRect(ctx, -200, -360, 400, 720, 44, '#09132b', '#10b981', 3.5);
          roundRect(ctx, -180, -340, 360, 680, 32, '#030816', 'rgba(255,255,255,0.08)', 1);

          // Pulsing Emerald Radar Waves
          const pulseR = (t * 80) % 160;
          ctx.strokeStyle = 'rgba(16, 185, 129, ' + (1 - pulseR / 160) + ')';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, -90, pulseR, 0, Math.PI * 2);
          ctx.stroke();

          drawPhoneIcon(ctx, 0, -90, 100, '#10b981');

          ctx.font = '800 26px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('Connected with AI', 0, 20);

          ctx.font = '600 20px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.fillText('Call in progress... 00:' + String(Math.floor((t - 11.0) * 12)).padStart(2, '0'), 0, 58);

          // Audio VU Spectrum Meters bouncing inside phone
          for (let b = 0; b < 16; b++) {
            const barH = 15 + Math.sin(t * 16 + b * 0.8) * 35 + Math.cos(t * 22 + b) * 20;
            const barX = -120 + b * 16;
            roundRect(ctx, barX, 140 - barH / 2, 10, barH, 5, '#38bdf8', null);
          }

          ctx.restore();
        }

        // Sub-feature 2: NATURAL CONVERSATION WAVEFORM (13.0s – 15.0s)
        else if (t < 15.0) {
          ctx.save();
          ctx.translate(W / 2, 240);
          ctx.textAlign = 'center';
          ctx.font = '900 54px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 24;
          ctx.fillText('NATURAL SPEECH', 0, 0);

          ctx.font = '700 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#c084fc';
          ctx.letterSpacing = '3px';
          ctx.fillText('HUMAN-LIKE VOICE • QUALIFIES EVERY NEED', 0, 48);
          ctx.restore();

          // Full-width Floating AI Audio Waveform & Speech Bubbles
          ctx.save();
          ctx.translate(W / 2, 900);

          // Card Container
          roundRect(ctx, -400, -320, 800, 640, 36, '#0b142d', 'rgba(168, 85, 247, 0.6)', 3);

          // Customer Dialogue Bubble
          roundRect(ctx, -340, -250, 480, 110, 22, '#1e293b', 'rgba(255,255,255,0.15)', 1.5);
          ctx.textAlign = 'left';
          ctx.font = '700 16px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('CUSTOMER', -310, -215);
          ctx.font = '800 20px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('"Hi, my AC stopped blowing cold air!"', -310, -180);

          // AI Receptionist Dialogue Bubble
          roundRect(ctx, -140, -100, 480, 120, 22, '#064e3b', '#10b981', 2);
          ctx.font = '700 16px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.fillText('VANTORX AI', -110, -65);
          ctx.font = '800 20px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('"I can help with that! We can dispatch', -110, -30);
          ctx.fillText('a technician today at 2:30 PM."', -110, -2);

          // Live Animated Waveform at bottom
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 5;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          for (let wx = -340; wx <= 340; wx += 6) {
            const wy = 190 + Math.sin(wx * 0.05 + t * 20) * 36 * Math.sin((wx + 340) / 680 * Math.PI);
            if (wx === -340) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();

          ctx.restore();
        }

        // Sub-feature 3: CAPTURES LEADS (15.0s – 17.0s)
        else if (t < 17.0) {
          const leadProg = Math.min(1, (t - 15.0) / 0.5);

          ctx.save();
          ctx.translate(W / 2, 240);
          ctx.textAlign = 'center';
          ctx.font = '900 54px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 24;
          ctx.fillText('CAPTURES LEADS', 0, 0);

          ctx.font = '700 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.letterSpacing = '3px';
          ctx.fillText('AUTOMATIC INTAKE • QUALIFIED DETAILS', 0, 48);
          ctx.restore();

          // High-Tech Animated CRM Contact Card
          ctx.save();
          ctx.translate(W / 2, 920);
          ctx.scale(easeOutBack(leadProg), easeOutBack(leadProg));

          roundRect(ctx, -380, -340, 760, 680, 36, '#0b162e', '#38bdf8', 3);

          // Header Bar
          roundRect(ctx, -340, -300, 680, 70, 18, 'rgba(56, 189, 248, 0.15)', 'rgba(56, 189, 248, 0.4)', 1.5);
          ctx.font = '900 24px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'left';
          ctx.fillText('✓ NEW QUALIFIED LEAD DISPATCHED', -310, -255);

          // Field 1: Customer Name
          const f1Prog = Math.min(1, Math.max(0, (t - 15.2) / 0.3));
          roundRect(ctx, -340, -200, 680, 95, 18, '#131e3a', 'rgba(255,255,255,0.1)', 1);
          ctx.font = '600 16px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('CUSTOMER NAME', -310, -170);
          ctx.font = '800 24px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('Sarah Jenkins', -310, -135);

          // Field 2: Phone Number
          const f2Prog = Math.min(1, Math.max(0, (t - 15.6) / 0.3));
          roundRect(ctx, -340, -85, 680, 95, 18, '#131e3a', 'rgba(255,255,255,0.1)', 1);
          ctx.font = '600 16px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('PHONE NUMBER', -310, -55);
          ctx.font = '800 24px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('(561) 555-0192', -310, -20);

          // Field 3: Service Request
          const f3Prog = Math.min(1, Math.max(0, (t - 16.0) / 0.3));
          roundRect(ctx, -340, 30, 680, 95, 18, '#131e3a', 'rgba(255,255,255,0.1)', 1);
          ctx.font = '600 16px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('SERVICE REQUIRED', -310, 60);
          ctx.font = '800 24px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#fbbf24';
          ctx.fillText('Emergency AC Repair (High Priority)', -310, 95);

          // Green Confirmed Banner at bottom
          roundRect(ctx, -340, 160, 680, 90, 20, '#064e3b', '#10b981', 2);
          ctx.font = '900 24px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ SYNCED TO YOUR SCHEDULE INSTANTLY', 0, 215);

          ctx.restore();
        }

        // Sub-feature 4: BOOKS APPOINTMENTS & AVAILABLE 24/7 (17.0s – 19.0s)
        else {
          const calProg = Math.min(1, (t - 17.0) / 0.5);

          ctx.save();
          ctx.translate(W / 2, 240);
          ctx.textAlign = 'center';
          ctx.font = '900 54px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 24;
          ctx.fillText('BOOKS APPOINTMENTS', 0, 0);

          ctx.font = '700 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.letterSpacing = '3px';
          ctx.fillText('AVAILABLE 24/7/365 • DIRECT CALENDAR SYNC', 0, 48);
          ctx.restore();

          // Calendar Grid + Spinning 24/7 Clock
          ctx.save();
          ctx.translate(W / 2, 920);

          // Calendar Panel
          roundRect(ctx, -380, -340, 760, 680, 36, '#0b162e', '#10b981', 3);

          // Top Header: Date
          roundRect(ctx, -340, -300, 680, 70, 18, '#131e3a', null);
          ctx.font = '800 24px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.fillText('📅 TODAY\\'S DISPATCH SCHEDULE', -300, -255);

          // Calendar slots
          const slots = [
            { time: '10:00 AM', status: 'Completed', color: '#64748b' },
            { time: '01:00 PM', status: 'Completed', color: '#64748b' },
            { time: '02:30 PM', status: '✓ BOOKED BY VANTORX AI', color: '#10b981', highlight: true },
            { time: '04:30 PM', status: 'Available Slot', color: '#38bdf8' }
          ];

          slots.forEach((sl, idx) => {
            const sy = -200 + idx * 85;
            if (sl.highlight) {
              // Pulsing green highlight
              const pulseG = Math.sin(t * 12) * 0.3 + 0.7;
              roundRect(ctx, -340, sy, 680, 72, 16, '#064e3b', 'rgba(16, 185, 129, ' + pulseG + ')', 3);
            } else {
              roundRect(ctx, -340, sy, 680, 72, 16, '#101a33', 'rgba(255,255,255,0.06)', 1);
            }

            ctx.font = '800 22px "SF Pro Display", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.fillText(sl.time, -310, sy + 44);

            ctx.font = sl.highlight ? '900 20px "SF Pro Display", sans-serif' : '600 18px "SF Pro Display", sans-serif';
            ctx.fillStyle = sl.color;
            ctx.textAlign = 'right';
            ctx.fillText(sl.status, 310, sy + 44);
          });

          // Clock Rotating Badge (24/7 indication)
          ctx.save();
          ctx.translate(0, 220);
          roundRect(ctx, -240, -45, 480, 90, 26, '#020617', '#38bdf8', 2.5);

          // Rotating clock hands
          ctx.save();
          ctx.translate(-160, 0);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, 26, 0, Math.PI * 2);
          ctx.stroke();

          const hourAngle = t * 6;
          const minAngle = t * 72;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(hourAngle) * 14, Math.sin(hourAngle) * 14);
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(minAngle) * 20, Math.sin(minAngle) * 20);
          ctx.stroke();
          ctx.restore();

          ctx.textAlign = 'left';
          ctx.font = '900 24px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('ALWAYS WORKING 24/7', -110, -6);
          ctx.font = '600 18px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('Nights • Weekends • Holidays', -110, 22);

          ctx.restore();

          ctx.restore();
        }
      }

      // ==============================================================
      // SCENE 5 — THE RESULT (19.0s – 24.0s)
      // Missed Call Counter drops to Zero (0), Cascading Booked Cards, Upward Growth Graph
      // Display: "NEVER MISS AN OPPORTUNITY AGAIN."
      // ==============================================================
      else if (t >= 19.0 && t < 24.2) {
        const s5Prog = (t - 19.0) / 5.0;

        // Headline: "NEVER MISS AN OPPORTUNITY AGAIN."
        const headProg = Math.min(1, (t - 19.0) / 0.6);
        ctx.save();
        ctx.translate(W / 2, 220);
        ctx.scale(easeOutBack(headProg), easeOutBack(headProg));
        ctx.textAlign = 'center';

        ctx.font = '900 52px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = 'rgba(16, 185, 129, 0.7)';
        ctx.shadowBlur = 28;
        ctx.fillText('NEVER MISS AN', 0, 0);

        ctx.font = '900 56px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('OPPORTUNITY AGAIN', 0, 68);
        ctx.restore();

        // Counter: Missed Calls -> 0 (ZERO)
        ctx.save();
        ctx.translate(W / 2, 420);
        roundRect(ctx, -260, -45, 520, 90, 26, '#064e3b', '#10b981', 3);
        ctx.textAlign = 'center';
        ctx.font = '900 36px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('MISSED CALLS: 0', 0, 10);
        ctx.restore();

        // 3 Cascading Booked Job Cards (Waterfalling into view)
        const bookedCards = [
          { name: 'Sarah J. • AC Repair',     slot: '2:30 PM', delay: 19.4 },
          { name: 'Robert M. • System Check', slot: '4:15 PM', delay: 19.8 },
          { name: 'David K. • Emergency Fan', slot: 'Tomorrow 9AM', delay: 20.2 }
        ];

        bookedCards.forEach((bc, idx) => {
          if (t >= bc.delay) {
            const cardProg = Math.min(1, (t - bc.delay) / 0.4);
            const cardY = 560 + idx * 80 + (1 - easeOutBack(cardProg)) * 60;

            ctx.save();
            ctx.translate(W / 2, cardY);
            roundRect(ctx, -360, -32, 720, 64, 18, '#0b162e', '#10b981', 2);

            // Green Check icon
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(-315, 0, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-321, -1);
            ctx.lineTo(-316, 4);
            ctx.lineTo(-308, -5);
            ctx.stroke();

            ctx.font = '800 20px "SF Pro Display", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(bc.name, -280, 0);

            ctx.font = '700 18px "SF Pro Display", sans-serif';
            ctx.fillStyle = '#34d399';
            ctx.textAlign = 'right';
            ctx.fillText('✓ Confirmed (' + bc.slot + ')', 320, 0);

            ctx.restore();
          }
        });

        // Upward Trajectory Graph (Pure clean vector curve, no fake currency figures)
        ctx.save();
        ctx.translate(W / 2, 1280);
        roundRect(ctx, -400, -260, 800, 520, 36, '#081024', 'rgba(56, 189, 248, 0.4)', 2);

        ctx.font = '800 24px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.fillText('📈 CAPTURED BUSINESS GROWTH', -350, -200);

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let gy = -140; gy <= 160; gy += 60) {
          ctx.beginPath();
          ctx.moveTo(-350, gy);
          ctx.lineTo(350, gy);
          ctx.stroke();
        }

        // Animated Upward Exponential Line Curve
        const graphProg = Math.min(1, Math.max(0, (t - 20.2) / 3.2));
        const pts = [
          { x: -350, y: 150 },
          { x: -220, y: 120 },
          { x: -90,  y: 60 },
          { x: 50,   y: -40 },
          { x: 200,  y: -130 },
          { x: 340,  y: -190 }
        ];

        // Draw Area under curve
        ctx.beginPath();
        ctx.moveTo(pts[0].x, 180);
        const curMaxX = -350 + (340 - (-350)) * graphProg;

        pts.forEach((pt, pIdx) => {
          if (pIdx === 0) ctx.lineTo(pt.x, pt.y);
          else if (pt.x <= curMaxX) {
            ctx.lineTo(pt.x, pt.y);
          } else {
            const prev = pts[pIdx - 1];
            const frac = (curMaxX - prev.x) / (pt.x - prev.x);
            const interpY = prev.y + (pt.y - prev.y) * frac;
            ctx.lineTo(curMaxX, interpY);
          }
        });
        ctx.lineTo(curMaxX, 180);
        ctx.closePath();
        const areaGrad = ctx.createLinearGradient(0, -200, 0, 180);
        areaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        areaGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
        ctx.fillStyle = areaGrad;
        ctx.fill();

        // Stroke line
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 22;
        ctx.beginPath();
        pts.forEach((pt, pIdx) => {
          if (pIdx === 0) ctx.moveTo(pt.x, pt.y);
          else if (pt.x <= curMaxX) ctx.lineTo(pt.x, pt.y);
          else {
            const prev = pts[pIdx - 1];
            const frac = (curMaxX - prev.x) / (pt.x - prev.x);
            const interpY = prev.y + (pt.y - prev.y) * frac;
            ctx.lineTo(curMaxX, interpY);
          }
        });
        ctx.stroke();

        // Tip glowing head circle
        if (graphProg > 0) {
          const lastPt = pts[pts.length - 1];
          const tipX = -350 + (340 - (-350)) * graphProg;
          // Approximate Y
          let tipY = 150;
          for (let pIdx = 1; pIdx < pts.length; pIdx++) {
            if (tipX <= pts[pIdx].x) {
              const prev = pts[pIdx - 1];
              const frac = (tipX - prev.x) / (pts[pIdx].x - prev.x);
              tipY = prev.y + (pts[pIdx].y - prev.y) * frac;
              break;
            }
          }

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(tipX, tipY, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 18, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      // ==============================================================
      // SCENE 6 — BRAND REVEAL (24.0s – 28.0s)
      // All elements collapse inward into center vortex,
      // Luxury glowing VantorX brand mark,
      // "VANTORX" · "YOUR BUSINESS. ALWAYS ANSWERED." · "vantorxsolutions.com"
      // ==============================================================
      else if (t >= 24.0) {
        const s6Prog = Math.min(1, Math.max(0, (t - 24.0) / 3.8));
        const logoProg = Math.min(1, (t - 24.2) / 0.8);
        const logoScale = easeOutBack(logoProg);

        // Background Radial Pulse
        const brandGrad = ctx.createRadialGradient(W / 2, H * 0.48, 50, W / 2, H * 0.5, W * 0.95);
        brandGrad.addColorStop(0, '#0c1d3d');
        brandGrad.addColorStop(0.5, '#060d1f');
        brandGrad.addColorStop(1, '#020409');
        ctx.fillStyle = brandGrad;
        ctx.fillRect(0, 0, W, H);

        // Ambient Volumetric Holographic Ring
        const ringProg = (t * 2) % (Math.PI * 2);
        ctx.save();
        ctx.translate(W / 2, H * 0.42);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 220 + Math.sin(t * 4) * 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Central VantorX Geometric Illustrated Emblem
        ctx.save();
        ctx.translate(W / 2, H * 0.42);
        ctx.scale(logoScale, logoScale);

        // Outer Hex Shield
        ctx.save();
        ctx.rotate(t * 0.25);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const a = (s / 6) * Math.PI * 2;
          const sx = Math.cos(a) * 140;
          const sy = Math.sin(a) * 140;
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        // Inner V-Wing / Neural Core (Illustrated VantorX Vector)
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 35;
        const vGrad = ctx.createLinearGradient(-80, -80, 80, 80);
        vGrad.addColorStop(0, '#00f0ff');
        vGrad.addColorStop(0.5, '#38bdf8');
        vGrad.addColorStop(1, '#818cf8');
        ctx.fillStyle = vGrad;

        ctx.beginPath();
        ctx.moveTo(-70, -60);
        ctx.lineTo(-25, -60);
        ctx.lineTo(0, 15);
        ctx.lineTo(25, -60);
        ctx.lineTo(70, -60);
        ctx.lineTo(15, 65);
        ctx.lineTo(-15, 65);
        ctx.closePath();
        ctx.fill();

        // Central AI Core Spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Clean Kinetic Typography: "VANTORX"
        const textProg = Math.min(1, Math.max(0, (t - 24.5) / 0.6));
        ctx.save();
        ctx.translate(W / 2, H * 0.56);
        ctx.globalAlpha = textProg;
        ctx.textAlign = 'center';

        // Logo Brand Name
        ctx.font = '900 84px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '14px';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowBlur = 28;
        ctx.fillText('VANTORX', 0, 0);

        // Tagline: "YOUR BUSINESS. ALWAYS ANSWERED."
        ctx.font = '800 32px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '4px';
        ctx.fillStyle = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fillText('YOUR BUSINESS. ALWAYS ANSWERED.', 0, 65);

        // Minimalist Website Link
        ctx.font = '600 26px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '3px';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.shadowBlur = 0;
        ctx.fillText('vantorxsolutions.com', 0, 130);

        // Subtle frame brackets on corners (luxury UI finish)
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2.5;
        // Top-left bracket
        ctx.beginPath();
        ctx.moveTo(80, 140);
        ctx.lineTo(80, 80);
        ctx.lineTo(140, 80);
        ctx.stroke();
        // Top-right bracket
        ctx.beginPath();
        ctx.moveTo(W - 80, 140);
        ctx.lineTo(W - 80, 80);
        ctx.lineTo(W - 140, 80);
        ctx.stroke();
        // Bottom-left bracket
        ctx.beginPath();
        ctx.moveTo(80, H - 140);
        ctx.lineTo(80, H - 80);
        ctx.lineTo(140, H - 80);
        ctx.stroke();
        // Bottom-right bracket
        ctx.beginPath();
        ctx.moveTo(W - 80, H - 140);
        ctx.lineTo(W - 80, H - 80);
        ctx.lineTo(W - 140, H - 80);
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();
    };
  </script>
</body>
</html>`;

const tempHtmlPath = path.join(root, 'website/demo/temp_motion_render.html');
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

async function render() {
  console.log('--- STARTING 100% ANIMATED MOTION GRAPHICS VIDEO RENDER ---');
  console.log('Audio file:', audioPath, 'Exists:', fs.existsSync(audioPath));
  console.log('Total frames:', totalFrames);

  const ffmpegArgs = [
    '-f', 'image2pipe',
    '-framerate', String(FPS),
    '-i', '-',
    '-i', audioPath,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    '-movflags', '+faststart',
    '-y',
    outCommercialMp4
  ];

  console.log('Launching ffmpeg process...');
  const ffmpegProc = spawn(ffmpegPath, ffmpegArgs);

  ffmpegProc.stderr.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('frame=') || msg.includes('fps=') || msg.includes('Error')) {
      process.stdout.write('\r[FFMPEG] ' + msg.trim().slice(0, 100));
    }
  });

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files', '--disable-web-security']
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  page.setDefaultNavigationTimeout(0);

  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });

  const batchSize = 60;
  let frameIdx = 0;
  const startTime = Date.now();

  console.log('Rendering 840 continuous vector animation frames...');

  while (frameIdx < totalFrames) {
    const curBatch = Math.min(batchSize, totalFrames - frameIdx);
    const startF = frameIdx;

    const base64Batch = await page.evaluate(async (start, count, frameRate) => {
      const results = [];
      const cvs = document.getElementById('c');
      for (let i = 0; i < count; i++) {
        const t = (start + i) / frameRate;
        window.renderFrame(t);
        const dataUrl = cvs.toDataURL('image/jpeg', 0.95);
        results.push(dataUrl.slice(23)); // strip 'data:image/jpeg;base64,'
      }
      return results;
    }, startF, curBatch, FPS);

    for (const b64 of base64Batch) {
      const buf = Buffer.from(b64, 'base64');
      const canWrite = ffmpegProc.stdin.write(buf);
      if (!canWrite) {
        await new Promise(r => ffmpegProc.stdin.once('drain', r));
      }
    }

    frameIdx += curBatch;
    const pct = ((frameIdx / totalFrames) * 100).toFixed(1);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    process.stdout.write(`\rRendered ${frameIdx}/${totalFrames} frames (${pct}%) in ${elapsed}s`);
  }

  ffmpegProc.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpegProc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error('FFMPEG exited with code ' + code));
    });
  });

  await browser.close();
  try { fs.unlinkSync(tempHtmlPath); } catch (e) {}

  console.log('\n\n--- MOTION GRAPHICS VIDEO ENCODING COMPLETE ---');
  console.log('Generated master MP4:', outCommercialMp4);

  // Copy to all active distribution destinations
  fs.copyFileSync(outCommercialMp4, outReel2Mp4);
  console.log('Copied to:', outReel2Mp4);

  fs.copyFileSync(outCommercialMp4, outMotionMp4);
  console.log('Copied to:', outMotionMp4);

  fs.copyFileSync(outCommercialMp4, artifactMp4);
  console.log('Copied to artifact dir:', artifactMp4);

  // Extract verification proof frames at each scene's peak
  const proofFrames = [
    { name: 'motion_proof_scene1_hook_02s.jpg', time: '00:00:02.000' },
    { name: 'motion_proof_scene2_problem_05s.jpg', time: '00:00:05.200' },
    { name: 'motion_proof_scene3_solution_09s.jpg', time: '00:00:09.500' },
    { name: 'motion_proof_scene4_answers_12s.jpg', time: '00:00:12.200' },
    { name: 'motion_proof_scene4_waveform_14s.jpg', time: '00:00:14.200' },
    { name: 'motion_proof_scene4_leads_16s.jpg', time: '00:00:16.200' },
    { name: 'motion_proof_scene4_calendar_18s.jpg', time: '00:00:18.200' },
    { name: 'motion_proof_scene5_result_22s.jpg', time: '00:00:22.000' },
    { name: 'motion_proof_scene6_brand_26s.jpg', time: '00:00:26.500' }
  ];

  for (const pf of proofFrames) {
    const proofPath = path.join(ARTIFACT_DIR, pf.name);
    const ffmpegProof = spawn(ffmpegPath, [
      '-ss', pf.time,
      '-i', outCommercialMp4,
      '-vframes', '1',
      '-q:v', '2',
      '-y',
      proofPath
    ]);
    await new Promise(r => ffmpegProof.on('close', r));
    console.log(`Saved proof frame (${pf.time}):`, pf.name);
  }

  // Also save a representative motion poster
  const posterPath = path.join(root, 'website/demo/video/motion_poster.jpg');
  const ffmpegPoster = spawn(ffmpegPath, [
    '-ss', '00:00:09.500',
    '-i', outCommercialMp4,
    '-vframes', '1',
    '-q:v', '2',
    '-y',
    posterPath
  ]);
  await new Promise(r => ffmpegPoster.on('close', r));
  console.log('Saved motion poster:', posterPath);

  console.log('\n--- MOTION GRAPHICS COMMERCIAL MASTERING COMPLETED SUCCESSFULLY ---');
}

render().catch(err => {
  console.error('Fatal render error:', err);
  process.exit(1);
});
