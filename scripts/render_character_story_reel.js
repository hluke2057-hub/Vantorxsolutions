// scripts/render_character_story_reel.js
// 100% Vector Motion Graphics Reel with 2D Illustrated Animated Figures (Bob & Sarah)
// 28.0s (840 frames @ 30 FPS) • Continuous Narration • Dynamic Gold Karaoke Captions

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const audioPath = path.join(root, 'website/demo/audio/vantorx-speed-master.wav');
const outMp4 = path.join(root, 'website/demo/video/vantorx-speed-to-lead-reel.mp4');
const outCommercial = path.join(root, 'website/demo/video/vantorx-ai-receptionist-commercial.mp4');
const outReel2 = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const artifactDir = 'C:/Users/hungr/.gemini/antigravity/brain/80451426-584a-4969-8d9c-573a8dd3a27d';

const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 28.0;
const totalFrames = Math.floor(FPS * DURATION);

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #050813; overflow: hidden; width: 1080px; height: 1920px; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif; }
    canvas { width: 1080px; height: 1920px; }
  </style>
</head>
<body>
  <canvas id="c" width="1080" height="1920"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const W = 1080, H = 1920;

    function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
    function easeOutBack(x) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
    function easeOutElastic(x) {
      const c4 = (2 * Math.PI) / 3;
      return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }

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

    // ----------------------------------------------------------------------------
    // PROMINENT 2D ILLUSTRATED VECTOR CHARACTER ENGINE
    // ----------------------------------------------------------------------------
    function draw2DCharacter(ctx, opts, t) {
      const {
        x,
        y,
        scale = 1.0,
        outfit = 'contractor', // 'contractor' | 'customer' | 'competitor'
        mood = 'smile', // 'smile' | 'talk' | 'panic' | 'worried'
        leftArmAngle = 0.25,
        rightArmAngle = -0.25,
        holdingItem = null // 'wrench' | 'phone' | 'cash'
      } = opts;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      const bob = Math.sin(t * 5.0 + x * 0.05) * 3.5;

      // Shoes
      ctx.fillStyle = (outfit === 'customer') ? '#e2e8f0' : '#0f172a';
      ctx.beginPath();
      ctx.ellipse(-26, -6, 20, 9, 0, 0, Math.PI * 2);
      ctx.ellipse(26, -6, 20, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Trousers
      ctx.fillStyle = (outfit === 'contractor') ? '#1e293b' : (outfit === 'competitor') ? '#1e3a8a' : '#334155';
      roundRect(ctx, -38, -105, 26, 98, 6, ctx.fillStyle, null);
      roundRect(ctx, 12, -105, 26, 98, 6, ctx.fillStyle, null);

      // Torso with breathing bob
      ctx.save();
      ctx.translate(0, bob);

      if (outfit === 'contractor') {
        // Blue work shirt
        roundRect(ctx, -48, -225, 96, 125, 16, '#1d4ed8', null);
        // Orange safety vest
        roundRect(ctx, -46, -223, 92, 120, 14, '#f97316', '#fb923c', 1.5);
        // Reflective yellow safety stripes
        ctx.fillStyle = '#fde047';
        ctx.fillRect(-46, -155, 92, 10);
        ctx.fillRect(-46, -130, 92, 10);
        ctx.fillRect(-30, -223, 12, 68);
        ctx.fillRect(18, -223, 12, 68);
      } else if (outfit === 'customer') {
        // Coral sweater (Sarah)
        roundRect(ctx, -48, -225, 96, 125, 18, '#f43f5e', null);
        roundRect(ctx, -48, -120, 96, 16, 6, '#e11d48', null);
      } else {
        // Competitor royal blue polo
        roundRect(ctx, -48, -225, 96, 125, 16, '#0284c7', '#38bdf8', 1.5);
      }

      // Arms & Hands
      const armCol = (outfit === 'contractor') ? '#1d4ed8' : (outfit === 'customer') ? '#f43f5e' : '#0284c7';
      [-1, 1].forEach(side => {
        const isRight = (side === 1);
        const shoulderX = side * 48;
        const shoulderY = -208;
        const angle = isRight ? rightArmAngle : leftArmAngle;

        ctx.save();
        ctx.translate(shoulderX, shoulderY);
        ctx.rotate(angle);

        roundRect(ctx, -12, 0, 24, 78, 11, armCol, null);

        // Peach Hand
        ctx.fillStyle = '#eab68c';
        ctx.beginPath();
        ctx.arc(0, 86, 14, 0, Math.PI * 2);
        ctx.fill();

        // Props
        if (isRight && holdingItem === 'phone') {
          ctx.save();
          ctx.translate(4, 82);
          ctx.rotate(-0.35);
          roundRect(ctx, -14, -36, 28, 54, 6, '#0f172a', '#38bdf8', 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(-10, -30, 20, 38);
          ctx.restore();
        } else if (isRight && holdingItem === 'wrench') {
          ctx.save();
          ctx.translate(4, 86);
          ctx.rotate(-0.5 + Math.sin(t * 8) * 0.35);
          roundRect(ctx, -6, -50, 12, 56, 4, '#cbd5e1', '#64748b', 1.5);
          ctx.beginPath();
          ctx.arc(0, -52, 13, 0.4, Math.PI * 2 - 0.4);
          ctx.lineWidth = 6;
          ctx.strokeStyle = '#cbd5e1';
          ctx.stroke();
          ctx.restore();
        } else if (isRight && holdingItem === 'cash') {
          ctx.save();
          ctx.translate(6, 86);
          roundRect(ctx, -16, -24, 32, 48, 4, '#10b981', '#34d399', 1.5);
          ctx.font = '900 16px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('$', -5, 4);
          ctx.restore();
        }

        ctx.restore();
      });

      // Head
      const headY = -278;
      ctx.fillStyle = '#eab68c';
      ctx.beginPath();
      ctx.arc(0, headY, 46, 0, Math.PI * 2);
      ctx.fill();

      // Forehead shadow
      ctx.fillStyle = 'rgba(180, 115, 70, 0.24)';
      ctx.beginPath();
      ctx.ellipse(0, headY - 18, 34, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes with pupil shines
      [-15, 15].forEach(ex => {
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(ex, headY - 4, 6.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex - 2, headY - 6, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Eyebrows
      ctx.strokeStyle = '#3f2314';
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      if (mood === 'panic' || mood === 'worried') {
        ctx.beginPath();
        ctx.moveTo(-24, headY - 13);
        ctx.lineTo(-8, headY - 20);
        ctx.moveTo(24, headY - 13);
        ctx.lineTo(8, headY - 20);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-23, headY - 17);
        ctx.lineTo(-8, headY - 16);
        ctx.moveTo(8, headY - 16);
        ctx.lineTo(23, headY - 17);
        ctx.stroke();
      }

      // Mouth
      ctx.strokeStyle = '#5c2814';
      ctx.fillStyle = '#5c2814';
      ctx.lineWidth = 4.0;
      if (mood === 'talk') {
        const talkOpen = 3 + Math.abs(Math.sin(t * 14)) * 7;
        ctx.beginPath();
        ctx.ellipse(0, headY + 15, 10, talkOpen, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (mood === 'panic') {
        const panicH = 7 + Math.abs(Math.sin(t * 10)) * 6;
        ctx.beginPath();
        ctx.ellipse(0, headY + 16, 12, panicH, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (mood === 'worried') {
        ctx.beginPath();
        ctx.ellipse(0, headY + 16, 9, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, headY + 8, 14, 0.2, Math.PI - 0.15);
        ctx.stroke();
      }

      // Hair / Hardhat
      if (outfit === 'contractor') {
        // Brown side hair
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(-38, headY - 10, 12, 0, Math.PI * 2);
        ctx.arc(38, headY - 10, 12, 0, Math.PI * 2);
        ctx.fill();
        // Yellow Hardhat
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, headY - 16, 48, Math.PI, Math.PI * 2);
        ctx.fill();
        roundRect(ctx, -56, headY - 20, 112, 11, 5, '#eab308', '#fef08a', 1.5);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(0, headY - 16, 36, Math.PI + 0.4, Math.PI + 1.1);
        ctx.stroke();
      } else if (outfit === 'customer') {
        // Auburn Hair
        ctx.fillStyle = '#9a3412';
        ctx.beginPath();
        ctx.arc(0, headY - 14, 48, Math.PI - 0.15, Math.PI * 2 + 0.15);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(16, headY - 40);
        ctx.lineTo(28, headY - 30);
        ctx.stroke();
      } else {
        // Competitor Slick Dark Hair
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(0, headY - 14, 48, Math.PI - 0.1, Math.PI * 2 + 0.1);
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();
    }

    // Floating particles
    const PARTICLES = [];
    for (let i = 0; i < 70; i++) {
      PARTICLES.push({
        x: (i * 1337) % W,
        y: (i * 7919) % H,
        vx: ((i % 5) - 2) * 12,
        vy: -20 - (i % 7) * 16,
        r: 1.5 + (i % 4) * 1.5,
        color: (i % 3 === 0) ? '#38bdf8' : (i % 3 === 1) ? '#10b981' : '#ffffff',
        alpha: 0.15 + (i % 5) * 0.12
      });
    }

    const CAPTIONS = [
      {
        start: 0.1, end: 4.9,
        words: ["78%", "OF", "BUYERS", "HIRE", "WHOEVER", "ANSWERS", "FIRST.", "EVERY", "MISSED", "CALL", "IS", "LOST", "REVENUE!"]
      },
      {
        start: 5.1, end: 9.9,
        words: ["WHEN", "YOU", "HIT", "VOICEMAIL,", "THEY", "HANG", "UP", "IN", "8", "SECONDS", "AND", "CALL", "YOUR", "COMPETITOR!"]
      },
      {
        start: 10.1, end: 14.8,
        words: ["VANTORX", "AI", "ANSWERS", "IN", "0.2", "SECONDS,", "PICKING", "UP", "BEFORE", "THE", "SECOND", "RING!"]
      },
      {
        start: 15.1, end: 19.9,
        words: ["IT", "QUALIFIES", "THE", "REPAIR,", "LOCKS", "THE", "CALENDAR,", "AND", "TEXTS", "THE", "DISPATCH", "ALERT!"]
      },
      {
        start: 20.1, end: 24.4,
        words: ["WHILE", "YOU", "FOCUS", "ON", "THE", "JOB,", "VANTORX", "STACKS", "YOUR", "SCHEDULE", "WITH", "REVENUE!"]
      },
      {
        start: 24.6, end: 27.8,
        words: ["OUT-ANSWER", "YOUR", "COMPETITION", "TODAY.", "VISIT", "VANTORXSOLUTIONS.COM"]
      }
    ];

    window.renderFrame = function(t) {
      ctx.save();

      // Screen Shake during intense rings or sonic boom
      let shakeX = 0, shakeY = 0;
      if ((t >= 1.0 && t <= 3.8 && (Math.floor(t * 4) % 2 === 0)) || (t >= 10.1 && t <= 10.8)) {
        shakeX = (Math.sin(t * 80) * 8);
        shakeY = (Math.cos(t * 70) * 8);
      }
      ctx.translate(shakeX, shakeY);

      // Deep Cyber Gradient Background
      const bgGrad = ctx.createRadialGradient(W / 2, H * 0.45, 120, W / 2, H * 0.5, W * 0.95);
      bgGrad.addColorStop(0, '#0c1630');
      bgGrad.addColorStop(0.55, '#060b1b');
      bgGrad.addColorStop(1, '#020409');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(-20, -20, W + 40, H + 40);

      // Cyber Grid
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const gridOffset = (t * 28) % 60;
      for (let x = 0; x <= W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = gridOffset; y <= H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.restore();

      // Particles
      PARTICLES.forEach(p => {
        const px = ((p.x + t * p.vx) % W + W) % W;
        const py = ((p.y + t * p.vy) % H + H) % H;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // ==============================================================
      // SCENE 1: THE HOOK — BOB ON THE JOB & RINGING INCOMING CALL (0.0s – 5.0s)
      // ==============================================================
      if (t < 5.0) {
        const prog = Math.min(1, t / 4.8);

        // Kinetic Hook Headline
        ctx.save();
        ctx.translate(W / 2, 220);
        ctx.textAlign = 'center';
        ctx.font = '900 56px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
        ctx.shadowBlur = 24;
        ctx.fillText('⚡ 78% OF HOMEOWNERS', 0, 0);
        ctx.font = '900 52px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowBlur = 20;
        ctx.fillText('HIRE WHOEVER ANSWERS FIRST', 0, 68);
        ctx.restore();

        // AC Unit with leaking steam/sparks
        ctx.save();
        ctx.translate(280, 1150);
        roundRect(ctx, -140, -180, 280, 240, 24, '#1e293b', '#64748b', 3);
        // Fan grill
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(0, -60, 60, 0, Math.PI * 2); ctx.stroke();
        // Steam puffs
        for (let s = 0; s < 4; s++) {
          const stProg = (t * 2 + s * 0.4) % 1;
          ctx.fillStyle = 'rgba(255, 255, 255, ' + (1 - stProg) * 0.5 + ')';
          ctx.beginPath();
          ctx.arc(-40 + Math.sin(t * 8 + s) * 20, -180 - stProg * 120, 14 + stProg * 25, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 2D Contractor Bob (Hero Size: scale 1.55) working hard with wrench!
        draw2DCharacter(ctx, {
          x: 640,
          y: 1220,
          scale: 1.55,
          outfit: 'contractor',
          mood: (t >= 1.5) ? 'panic' : 'talk',
          leftArmAngle: 0.4 + Math.sin(t * 10) * 0.3,
          rightArmAngle: -1.2 + Math.sin(t * 8) * 0.4,
          holdingItem: 'wrench'
        }, t);

        // Sweat drops flying from Bob's head
        if (t >= 1.5) {
          for (let sw = 0; sw < 3; sw++) {
            const swY = 820 + ((t * 120 + sw * 40) % 80);
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.ellipse(600 - sw * 20, swY, 5, 8, 0.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Violent Ringing Alert Phone Banner
        if (t >= 1.0) {
          const ringScale = 1 + Math.sin(t * 24) * 0.08;
          ctx.save();
          ctx.translate(W / 2, 450);
          ctx.scale(ringScale, ringScale);
          roundRect(ctx, -420, -70, 840, 140, 28, '#7f1d1d', '#ef4444', 3.5);

          ctx.font = '900 36px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 20;
          ctx.fillText('📞 INCOMING CALL: EMERGENCY REPAIR', 0, -12);
          ctx.font = '800 24px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#fca5a5';
          ctx.fillText('Bob is busy working... Phone ringing out to voicemail!', 0, 32);
          ctx.restore();
        }
      }

      // ==============================================================
      // SCENE 2: THE VOICEMAIL GRAVEYARD & COMPETITOR WINS (5.0s – 10.0s)
      // ==============================================================
      else if (t >= 5.0 && t < 10.0) {
        // Headline
        ctx.save();
        ctx.translate(W / 2, 220);
        ctx.textAlign = 'center';
        ctx.font = '900 54px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 24;
        ctx.fillText('WHEN YOUR CALL HITS VOICEMAIL...', 0, 0);
        ctx.font = '900 48px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('THEY HIRE YOUR COMPETITOR IN 8s', 0, 68);
        ctx.restore();

        // Left Side: Sarah Jenkins (Homeowner) holding phone, frowning, hot room
        draw2DCharacter(ctx, {
          x: 280,
          y: 1240,
          scale: 1.45,
          outfit: 'customer',
          mood: (t >= 7.0) ? 'worried' : 'talk',
          leftArmAngle: 0.2,
          rightArmAngle: -1.25,
          holdingItem: 'phone'
        }, t);

        // Sarah Speech Bubble: "Voicemail? Calling someone else!"
        ctx.save();
        ctx.translate(280, 720);
        roundRect(ctx, -190, -50, 380, 100, 20, '#0f172a', '#ef4444', 2.5);
        ctx.font = '800 22px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#fca5a5';
        ctx.textAlign = 'center';
        ctx.fillText(t < 7.0 ? '"Ringing... Ringing..."' : '"Voicemail?! Moving on!"', 0, -10);
        ctx.font = '700 18px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(t < 7.0 ? 'Hot living room (86°)' : 'Taps next guy on Google', 0, 22);
        ctx.restore();

        // Right Side: Smug Competitor with Cash Bag!
        if (t >= 6.5) {
          const compProg = Math.min(1, (t - 6.5) / 0.5);
          ctx.save();
          ctx.translate(800, 1240);
          ctx.scale(easeOutBack(compProg), easeOutBack(compProg));
          draw2DCharacter(ctx, {
            x: 0,
            y: 0,
            scale: 1.45,
            outfit: 'competitor',
            mood: 'smile',
            leftArmAngle: -0.6,
            rightArmAngle: -0.6,
            holdingItem: 'cash'
          }, t);

          // Cash Gained Pill
          roundRect(ctx, -140, -420, 280, 80, 20, '#064e3b', '#10b981', 3);
          ctx.font = '900 28px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.textAlign = 'center';
          ctx.fillText('+$4,500 JOB WON', 0, -374);
          ctx.restore();
        }
      }

      // ==============================================================
      // SCENE 3: VANTORX 0.2s INSTANT ANSWER (10.0s – 15.0s)
      // ==============================================================
      else if (t >= 10.0 && t < 15.0) {
        // Sonic Shockwave
        if (t < 11.2) {
          const waveR = (t - 10.0) * 1800;
          ctx.strokeStyle = 'rgba(56, 189, 248, ' + Math.max(0, 1 - (t - 10.0) / 1.2) + ')';
          ctx.lineWidth = 10;
          ctx.beginPath(); ctx.arc(W / 2, 750, waveR, 0, Math.PI * 2); ctx.stroke();
        }

        // Headline
        ctx.save();
        ctx.translate(W / 2, 220);
        ctx.textAlign = 'center';
        ctx.font = '900 56px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 28;
        ctx.fillText('VANTORX PICKS UP INSTANTLY', 0, 0);
        ctx.font = '900 52px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('ANSWERS IN 0.2 SECONDS', 0, 68);
        ctx.restore();

        // Speedometer Tachometer
        ctx.save();
        ctx.translate(380, 750);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 26;
        ctx.beginPath(); ctx.arc(0, 0, 180, Math.PI * 0.8, Math.PI * 2.2); ctx.stroke();

        const speedEase = easeOutElastic(Math.min(1, Math.max(0, (t - 10.2) / 0.6)));
        ctx.strokeStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 24;
        ctx.beginPath(); ctx.arc(0, 0, 180, Math.PI * 0.8, Math.PI * 0.8 + speedEase * (Math.PI * 1.4)); ctx.stroke();

        ctx.font = '900 84px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('0.2s', 0, -15);
        ctx.font = '800 20px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#34d399';
        ctx.fillText('⚡ FIRST RING PICKUP', 0, 45);
        ctx.restore();

        // Happy Bob on Right giving Thumbs Up!
        draw2DCharacter(ctx, {
          x: 820,
          y: 1220,
          scale: 1.45,
          outfit: 'contractor',
          mood: 'smile',
          leftArmAngle: -0.6,
          rightArmAngle: -0.5,
          holdingItem: null
        }, t);

        // Status Card
        ctx.save();
        ctx.translate(380, 1180);
        roundRect(ctx, -260, -90, 520, 180, 26, '#064e3b', '#10b981', 3);
        ctx.font = '900 26px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('✓ CALL ANSWERED 24/7', 0, -32);
        ctx.font = '700 20px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#34d399';
        ctx.fillText('While other shops sleep,', 0, 10);
        ctx.fillText('VantorX secures the job live.', 0, 42);
        ctx.restore();
      }

      // ==============================================================
      // SCENE 4: LIVE VOICE INTAKE & INSTANT CALENDAR LOCK (15.0s – 20.0s)
      // ==============================================================
      else if (t >= 15.0 && t < 20.0) {
        // Headline
        ctx.save();
        ctx.translate(W / 2, 220);
        ctx.textAlign = 'center';
        ctx.font = '900 56px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 24;
        ctx.fillText('QUALIFIES & LOCKS THE JOB', 0, 0);
        ctx.font = '700 24px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#34d399';
        ctx.letterSpacing = '3px';
        ctx.fillText('CALENDAR SYNCED • INSTANT SMS ALERT', 0, 58);
        ctx.restore();

        // Left Side: Sarah Jenkins talking happily to AI
        draw2DCharacter(ctx, {
          x: 230,
          y: 1240,
          scale: 1.35,
          outfit: 'customer',
          mood: 'talk',
          leftArmAngle: 0.2,
          rightArmAngle: -1.25,
          holdingItem: 'phone'
        }, t);

        // Live Voice Waveform above Sarah
        ctx.save();
        ctx.translate(230, 680);
        roundRect(ctx, -170, -60, 340, 120, 20, '#08142c', '#38bdf8', 2.5);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let wx = -140; wx <= 140; wx += 6) {
          const wy = Math.sin(wx * 0.1 + t * 16) * 22;
          if (wx === -140) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
        ctx.font = '800 16px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('Transcribing Live Call...', 0, 38);
        ctx.restore();

        // Right Side: Contractor Bob looking at his phone smiling
        draw2DCharacter(ctx, {
          x: 850,
          y: 1240,
          scale: 1.35,
          outfit: 'contractor',
          mood: 'smile',
          leftArmAngle: 0.25,
          rightArmAngle: -1.15,
          holdingItem: 'phone'
        }, t);

        // Center: Calendar Lock Card & Real-time SMS
        ctx.save();
        ctx.translate(540, 840);
        roundRect(ctx, -190, -180, 380, 360, 24, '#0c1630', '#10b981', 3);

        ctx.font = '900 22px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('📅 TODAY\\'S SCHEDULE', 0, -135);

        // Confirmed Slot
        roundRect(ctx, -165, -100, 330, 75, 16, '#064e3b', '#10b981', 2.5);
        ctx.font = '900 20px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#34d399';
        ctx.fillText('11:30 AM · LOCKED', 0, -68);
        ctx.font = '700 15px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Sarah Jenkins (Emergency AC)', 0, -42);

        // SMS Alert
        if (t >= 17.0) {
          const smsProg = Math.min(1, (t - 17.0) / 0.4);
          ctx.save();
          ctx.translate(0, 70);
          ctx.scale(easeOutBack(smsProg), easeOutBack(smsProg));
          roundRect(ctx, -165, -50, 330, 100, 18, '#08142c', '#38bdf8', 2.5);
          ctx.font = '800 16px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('💬 SMS NOTIFICATION', 0, -22);
          ctx.font = '700 16px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('New job booked: $450', 0, 6);
          ctx.fillText('Dispatched to Bob cell', 0, 28);
          ctx.restore();
        }
        ctx.restore();
      }

      // ==============================================================
      // SCENE 5: BOB WINS — CALENDAR STACKED & REVENUE SURGE (20.0s – 24.5s)
      // ==============================================================
      else if (t >= 20.0 && t < 24.5) {
        // Headline
        ctx.save();
        ctx.translate(W / 2, 220);
        ctx.textAlign = 'center';
        ctx.font = '900 56px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 28;
        ctx.fillText('OUT-ANSWER YOUR COMPETITION', 0, 0);
        ctx.font = '900 50px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('FILL YOUR SCHEDULE 24/7', 0, 68);
        ctx.restore();

        // 2D Contractor Bob (Center Hero: scale 1.6!) smiling triumphantly
        draw2DCharacter(ctx, {
          x: 540,
          y: 1220,
          scale: 1.6,
          outfit: 'contractor',
          mood: 'smile',
          leftArmAngle: -0.6,
          rightArmAngle: -0.6,
          holdingItem: 'wrench'
        }, t);

        // Cascading Confirmed Job Badges
        const badges = [
          { name: 'Sarah J. • +$450 AC Repair', x: 230, y: 550, delay: 20.2 },
          { name: 'Robert C. • +$2,800 Replacement', x: 840, y: 620, delay: 20.6 },
          { name: 'Mike M. • +$1,200 Duct Clean', x: 230, y: 780, delay: 21.0 }
        ];

        badges.forEach(b => {
          if (t >= b.delay) {
            const bProg = Math.min(1, (t - b.delay) / 0.4);
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.scale(easeOutBack(bProg), easeOutBack(bProg));
            roundRect(ctx, -190, -42, 380, 84, 20, '#064e3b', '#10b981', 2.5);
            ctx.font = '900 18px "SF Pro Display", sans-serif';
            ctx.fillStyle = '#34d399';
            ctx.textAlign = 'center';
            ctx.fillText('✓ CONFIRMED BOOKING', 0, -10);
            ctx.font = '800 19px "SF Pro Display", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(b.name, 0, 20);
            ctx.restore();
          }
        });

        // Revenue Growth Rocket Badge
        if (t >= 21.2) {
          ctx.save();
          ctx.translate(840, 850);
          roundRect(ctx, -180, -60, 360, 120, 24, '#08142c', '#38bdf8', 3);
          ctx.font = '900 38px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = 18;
          ctx.fillText('+$14,850', 0, -6);
          ctx.font = '800 18px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('CONFIRMED THIS WEEK', 0, 32);
          ctx.restore();
        }
      }

      // ==============================================================
      // SCENE 6: BRAND FINALE (24.5s – 28.0s)
      // ==============================================================
      else {
        const logoProg = Math.min(1, (t - 24.6) / 0.7);
        const logoScale = easeOutBack(logoProg);

        // Ambient Pulse
        const brandGrad = ctx.createRadialGradient(W / 2, H * 0.42, 50, W / 2, H * 0.45, W * 0.95);
        brandGrad.addColorStop(0, '#0c1d3d');
        brandGrad.addColorStop(0.5, '#060d1f');
        brandGrad.addColorStop(1, '#020409');
        ctx.fillStyle = brandGrad;
        ctx.fillRect(-20, -20, W + 40, H + 40);

        // VantorX Geometric Emblem
        ctx.save();
        ctx.translate(W / 2, H * 0.38);
        ctx.scale(logoScale, logoScale);

        // Rotating Hex Shield
        ctx.save();
        ctx.rotate(t * 0.25);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const a = (s / 6) * Math.PI * 2;
          const sx = Math.cos(a) * 150;
          const sy = Math.sin(a) * 150;
          if (s === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        // Inner V-Wing
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 40;
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

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Kinetic Brand Typography
        const textProg = Math.min(1, Math.max(0, (t - 24.8) / 0.5));
        ctx.save();
        ctx.translate(W / 2, H * 0.54);
        ctx.globalAlpha = textProg;
        ctx.textAlign = 'center';

        ctx.font = '900 86px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '14px';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowBlur = 28;
        ctx.fillText('VANTORX', 0, 0);

        ctx.font = '800 32px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '4px';
        ctx.fillStyle = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fillText('OUT-ANSWER YOUR COMPETITION.', 0, 68);

        ctx.font = '700 28px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '3px';
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.fillText('vantorxsolutions.com', 0, 134);
        ctx.restore();
      }

      // ==============================================================
      // CONTINUOUS DYNAMIC KARAOKE CAPTION BAR AT LOWER THIRD (y = 1690)
      // Every spoken word lights up in Neon Gold in real-time
      // ==============================================================
      const curCap = CAPTIONS.find(c => t >= c.start && t <= c.end + 0.15);
      if (curCap) {
        ctx.save();
        ctx.translate(W / 2, 1690);

        const capW = 960;
        const capH = 120;
        roundRect(ctx, -capW / 2, -capH / 2, capW, capH, 26, 'rgba(4, 9, 24, 0.94)', 'rgba(56, 189, 248, 0.85)', 2.5);

        ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
        ctx.shadowBlur = 16;

        const prog = Math.max(0, Math.min(0.999, (t - curCap.start) / (curCap.end - curCap.start)));
        const activeWordIdx = Math.floor(prog * curCap.words.length);

        ctx.font = '900 27px "SF Pro Display", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const totalWords = curCap.words.length;
        let line1Words = curCap.words;
        let line2Words = [];
        let mid = Math.ceil(totalWords / 2);
        if (totalWords > 6) {
          line1Words = curCap.words.slice(0, mid);
          line2Words = curCap.words.slice(mid);
        }

        function renderWordLine(lineWords, startIdx, lineY) {
          const spaceW = 12;
          const wordWidths = lineWords.map(w => ctx.measureText(w).width);
          const totalLineW = wordWidths.reduce((a, b) => a + b, 0) + (lineWords.length - 1) * spaceW;
          let drawX = -totalLineW / 2;

          lineWords.forEach((word, wIdx) => {
            const globalIdx = startIdx + wIdx;
            const isCurrent = (globalIdx === activeWordIdx);
            const isPast = (globalIdx < activeWordIdx);

            if (isCurrent) {
              ctx.fillStyle = '#facc15';
              ctx.shadowColor = '#facc15';
              ctx.shadowBlur = 18;
              ctx.fillText(word, drawX + wordWidths[wIdx] / 2, lineY);
            } else if (isPast) {
              ctx.fillStyle = '#38bdf8';
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.fillText(word, drawX + wordWidths[wIdx] / 2, lineY);
            } else {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.fillText(word, drawX + wordWidths[wIdx] / 2, lineY);
            }
            drawX += wordWidths[wIdx] + spaceW;
          });
        }

        if (line2Words.length > 0) {
          renderWordLine(line1Words, 0, -20);
          renderWordLine(line2Words, mid, 22);
        } else {
          renderWordLine(line1Words, 0, 0);
        }

        ctx.restore();
      }

      ctx.restore();
    };
  </script>
</body>
</html>`;

const tempHtmlPath = path.join(root, 'website/demo/temp_character_render.html');
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

async function render() {
  console.log('--- STARTING 2D CHARACTER STORY REEL RENDER ---');
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
    outMp4
  ];

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

  console.log('Rendering 840 continuous 2D character animation frames...');

  while (frameIdx < totalFrames) {
    const endFrame = Math.min(frameIdx + batchSize, totalFrames);

    const dataUris = await page.evaluate((startF, endF, fps) => {
      const uris = [];
      for (let f = startF; f < endF; f++) {
        const time = f / fps;
        window.renderFrame(time);
        uris.push(canvas.toDataURL('image/jpeg', 0.90));
      }
      return uris;
    }, frameIdx, endFrame, FPS);

    for (const uri of dataUris) {
      const base64Data = uri.replace(/^data:image\/jpeg;base64,/, '');
      const buf = Buffer.from(base64Data, 'base64');
      ffmpegProc.stdin.write(buf);
    }

    frameIdx = endFrame;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const pct = ((frameIdx / totalFrames) * 100).toFixed(1);
    console.log(`Rendered ${frameIdx}/${totalFrames} frames (${pct}%) in ${elapsed}s`);
  }

  ffmpegProc.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpegProc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('ffmpeg exited with code ' + code));
    });
  });

  await browser.close();

  // Copy to all demo targets
  fs.copyFileSync(outMp4, outCommercial);
  fs.copyFileSync(outMp4, outReel2);
  fs.copyFileSync(outMp4, path.join(artifactDir, 'vantorx-30s-reel-2.mp4'));

  // Extract Proof Frames with Characters
  const proofTimes = [
    { t: '00:00:02.500', name: 'speed_proof_scene1_timer_02s.jpg' },
    { t: '00:00:06.500', name: 'speed_proof_scene2_competitor_04s.jpg' },
    { t: '00:00:11.500', name: 'speed_proof_scene3_instant_08s.jpg' },
    { t: '00:00:16.000', name: 'speed_proof_scene4_qualify_13s.jpg' },
    { t: '00:00:18.500', name: 'speed_proof_scene4_calendar_16s.jpg' },
    { t: '00:00:22.000', name: 'speed_proof_scene5_growth_21s.jpg' },
    { t: '00:00:26.500', name: 'speed_proof_scene6_brand_26s.jpg' }
  ];

  for (const pf of proofTimes) {
    const dest = path.join(artifactDir, pf.name);
    const { spawnSync } = require('child_process');
    spawnSync(ffmpegPath, ['-ss', pf.t, '-i', outMp4, '-vframes', '1', '-q:v', '2', '-y', dest]);
    console.log(`Saved proof frame (${pf.t}): ${pf.name}`);
  }

  const posterPath = path.join(root, 'website/demo/video/speed_poster.jpg');
  const { spawnSync } = require('child_process');
  spawnSync(ffmpegPath, ['-ss', '00:00:02.500', '-i', outMp4, '-vframes', '1', '-q:v', '2', '-y', posterPath]);
  console.log('Saved speed poster:', posterPath);

  console.log('=== 2D CHARACTER STORY REEL RENDER COMPLETE ===');
}

render().catch(console.error);
