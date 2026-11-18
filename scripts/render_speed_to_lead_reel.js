// scripts/render_speed_to_lead_reel.js
// VantorX Solutions - Speed To Lead 100% Vector Motion Graphics Reel (28.0s)
// 1080x1920 Vertical (9:16) @ 30fps = 840 frames
// Continuous 2D/2.5D vector motion graphics, zero live humans, zero still photos

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\80451426-584a-4969-8d9c-573a8dd3a27d';

const audioPath = path.join(root, 'website/demo/audio/vantorx-speed-master.wav');
const outSpeedMp4 = path.join(root, 'website/demo/video/vantorx-speed-to-lead-reel.mp4');
const outCommercialMp4 = path.join(root, 'website/demo/video/vantorx-ai-receptionist-commercial.mp4');
const outReel2Mp4 = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const artifactMp4 = path.join(ARTIFACT_DIR, 'vantorx-30s-reel-2.mp4');

const TOTAL_SEC = 28.0;
const FPS = 30;
const W = 1080;
const H = 1920;
const totalFrames = Math.ceil(TOTAL_SEC * FPS);

console.log(`Setting up Speed-To-Lead Reel Pipeline: ${TOTAL_SEC}s (${totalFrames} frames @ 30fps)`);

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

    // Helper: Phone Receiver Icon
    function drawPhoneIcon(ctx, x, y, size, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size * 0.14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.22, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.stroke();
      ctx.restore();
    }

    // Continuous Floating Cyber Particles
    const PARTICLES = [];
    for (let i = 0; i < 75; i++) {
      PARTICLES.push({
        x: (i * 1423) % W,
        y: (i * 8191) % H,
        vx: ((i % 5) - 2) * 14,
        vy: -25 - (i % 7) * 18,
        r: 1.5 + (i % 4) * 1.5,
        color: (i % 3 === 0) ? '#38bdf8' : (i % 3 === 1) ? '#10b981' : '#ffffff',
        alpha: 0.15 + (i % 5) * 0.12
      });
    }

    // Master Render Frame Function
    window.renderFrame = function(t) {
      ctx.save();

      // ==========================================
      // CONTINUOUS TECH BACKGROUND (0.0s - 28.0s)
      // Deep Space Blue Gradient + Vertical Grid Flow + Floating Cyber Nodes
      // ==========================================
      const bgGrad = ctx.createRadialGradient(W / 2, H * 0.45, 120, W / 2, H * 0.5, W * 0.95);
      bgGrad.addColorStop(0, '#0d1838');
      bgGrad.addColorStop(0.55, '#060b1b');
      bgGrad.addColorStop(1, '#020409');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Cyber Grid
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const gridOffset = (t * 28) % 60;
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

      // Floating Particles
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
      // SCENE 1 — THE SPEED HOOK (0.0s – 3.0s)
      // Giant Digital Stopwatch Ticking Down, 78% First-Responder Stat
      // Kinetic Headline: "SPEED TO LEAD IS EVERYTHING"
      // ==============================================================
      if (t >= 0.0 && t < 3.2) {
        const s1Prog = Math.min(1, Math.max(0, t / 3.0));

        // Kinetic Headline
        const headProg = Math.min(1, (t - 0.2) / 0.5);
        ctx.save();
        ctx.translate(W / 2, 240);
        ctx.scale(easeOutBack(headProg), easeOutBack(headProg));
        ctx.textAlign = 'center';

        ctx.font = '800 26px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '5px';
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('⚡ CRUCIAL FACTOR', 0, -48);

        ctx.font = '900 56px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowBlur = 28;
        ctx.fillText('SPEED TO LEAD', 0, 15);
        ctx.fillText('IS EVERYTHING', 0, 78);
        ctx.restore();

        // Giant Circular Countdown Gauge
        ctx.save();
        ctx.translate(W / 2, 780);

        // Outer Glow Ring
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(0, 0, 180, 0, Math.PI * 2);
        ctx.stroke();

        // Ticking Arc
        const timeFraction = Math.max(0, 1 - (t / 3.0));
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 14;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, 0, 180, -Math.PI / 2, -Math.PI / 2 + (1 - timeFraction) * Math.PI * 2);
        ctx.stroke();

        // Inner Digital Timer: 05:00 counting down rapidly
        const msLeft = Math.max(0, Math.floor((1 - (t / 3.0)) * 300));
        const mins = String(Math.floor(msLeft / 60)).padStart(2, '0');
        const secs = String(msLeft % 60).padStart(2, '0');

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 74px "SF Pro Display", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(mins + ':' + secs, 0, -10);

        ctx.font = '700 20px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#f87171';
        ctx.letterSpacing = '3px';
        ctx.fillText('LEAD DECAY TIMER', 0, 48);

        ctx.restore();

        // Massive Statistic Card: 78% of customers buy from the first responder
        if (t >= 0.8) {
          const statProg = Math.min(1, (t - 0.8) / 0.5);
          ctx.save();
          ctx.translate(W / 2, 1260);
          ctx.scale(easeOutBack(statProg), easeOutBack(statProg));

          roundRect(ctx, -380, -120, 760, 240, 32, '#0c1630', '#38bdf8', 3);

          ctx.font = '900 86px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'center';
          ctx.fillText('78%', 0, -25);

          ctx.font = '800 28px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('OF CUSTOMERS HIRE', 0, 40);
          ctx.font = '800 28px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.fillText('WHOEVER ANSWERS FIRST', 0, 80);

          ctx.restore();
        }
      }

      // ==============================================================
      // SCENE 2 — THE COMPETITOR FAILS (3.0s – 6.8s)
      // Competitor Phone Rings Endlessly -> Voicemail -> Customer Moves On
      // Headline: "IF YOU DON'T ANSWER, THEY CALL THE NEXT GUY"
      // ==============================================================
      else if (t >= 3.0 && t < 7.0) {
        const s2Prog = (t - 3.0) / 4.0;

        // Headline
        const headProg = Math.min(1, (t - 3.0) / 0.5);
        ctx.save();
        ctx.translate(W / 2, 240);
        ctx.scale(easeOutBack(headProg), easeOutBack(headProg));
        ctx.textAlign = 'center';

        ctx.font = '900 52px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
        ctx.shadowBlur = 24;
        ctx.fillText('COMPETITOR STATUS:', 0, 0);

        ctx.font = '900 54px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('VOICEMAIL GRAVEYARD', 0, 68);
        ctx.restore();

        // Competitor Phone ringing endlessly
        ctx.save();
        ctx.translate(W / 2, 780);
        roundRect(ctx, -170, -320, 340, 640, 44, '#080d1a', 'rgba(239, 68, 68, 0.6)', 3);
        roundRect(ctx, -150, -300, 300, 600, 32, '#03060f', null);

        // Ringing cycles
        const rings = Math.min(5, Math.floor((t - 3.0) * 1.5) + 1);
        drawPhoneIcon(ctx, 0, -80, 85, '#ef4444');

        ctx.textAlign = 'center';
        ctx.font = '800 28px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Ringing... (' + rings + ')', 0, 15);

        // At 4.5s -> Voicemail Reached
        if (t >= 4.5) {
          roundRect(ctx, -130, 60, 260, 60, 18, '#ef4444', null);
          ctx.font = '900 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('VOICEMAIL REACHED', 0, 95);

          ctx.font = '600 18px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#f87171';
          ctx.fillText('Customer hanging up...', 0, 150);
        }
        ctx.restore();

        // Animated "Customer Back to Google" Card
        if (t >= 5.0) {
          const cardProg = Math.min(1, (t - 5.0) / 0.5);
          ctx.save();
          ctx.translate(W / 2, 1340);
          ctx.scale(easeOutBack(cardProg), easeOutBack(cardProg));

          roundRect(ctx, -380, -90, 760, 180, 26, '#0f172a', '#f43f5e', 2.5);

          ctx.textAlign = 'left';
          ctx.font = '800 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#f43f5e';
          ctx.fillText('❌ LOST IN 8 SECONDS', -340, -45);

          ctx.font = '700 26px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('Homeowner tapped the next contractor', -340, -5);
          ctx.font = '600 20px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('Your competitor gets the $4,500 emergency job.', -340, 35);

          ctx.restore();
        }
      }

      // ==============================================================
      // SCENE 3 — VANTORX 0.2s INSTANT ANSWER (6.8s – 11.0s)
      // Sonic Boom, High-Speed Tachometer Snaps into Green,
      // Headline: "VANTORX ANSWERS IN 0.2 SECONDS"
      // ==============================================================
      else if (t >= 6.8 && t < 11.2) {
        const s3Prog = (t - 6.8) / 4.2;

        // Expanding Cyan Sonic Shockwave
        if (t < 7.8) {
          const waveR = (t - 6.8) * 1600;
          ctx.strokeStyle = 'rgba(56, 189, 248, ' + Math.max(0, 1 - (t - 6.8) / 1.0) + ')';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.arc(W / 2, 820, waveR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Headline
        const headProg = Math.min(1, (t - 7.0) / 0.5);
        ctx.save();
        ctx.translate(W / 2, 240);
        ctx.scale(easeOutBack(headProg), easeOutBack(headProg));
        ctx.textAlign = 'center';

        ctx.font = '800 26px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '5px';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('INSTANT SPEED TO LEAD', 0, -48);

        ctx.font = '900 56px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowBlur = 28;
        ctx.fillText('VANTORX ANSWERS', 0, 15);
        ctx.fillText('IN 0.2 SECONDS', 0, 78);
        ctx.restore();

        // Speedometer / Speed Gauge (Needle snaps into green)
        ctx.save();
        ctx.translate(W / 2, 820);

        // Speedometer Arc
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 28;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, 0, 220, Math.PI * 0.8, Math.PI * 2.2);
        ctx.stroke();

        // Active Emerald Arc
        const speedFrac = Math.min(1, Math.max(0, (t - 7.2) / 0.6));
        const speedEase = easeOutElastic(speedFrac);
        ctx.strokeStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(0, 0, 220, Math.PI * 0.8, Math.PI * 0.8 + speedEase * (Math.PI * 1.4));
        ctx.stroke();

        // Big "0.2s" Display in Center
        ctx.font = '900 96px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('0.2s', 0, -20);

        ctx.font = '800 24px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#34d399';
        ctx.fillText('⚡ FIRST RING PICKUP', 0, 50);

        ctx.restore();

        // Status Card: "CALL CONNECTED AUTOMATICALLY"
        if (t >= 8.2) {
          const cardProg = Math.min(1, (t - 8.2) / 0.4);
          ctx.save();
          ctx.translate(W / 2, 1340);
          ctx.scale(easeOutBack(cardProg), easeOutBack(cardProg));

          roundRect(ctx, -380, -90, 760, 180, 26, '#064e3b', '#10b981', 3);

          ctx.textAlign = 'left';
          ctx.font = '900 26px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('✓ CALL CONNECTED BEFORE RING 2', -340, -35);

          ctx.font = '700 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.fillText('While other shops drop to voicemail,', -340, 8);
          ctx.fillText('your AI is already booking the appointment.', -340, 42);

          ctx.restore();
        }
      }

      // ==============================================================
      // SCENE 4 — REAL-TIME QUALIFICATION & DISPATCH (11.0s – 18.0s)
      // Live Voice Waveform, Contact Lead Card, Calendar Slot Locked, SMS Dispatch
      // Headline: "QUALIFIES & BOOKS 24/7"
      // ==============================================================
      else if (t >= 11.0 && t < 18.2) {

        // Sub-phase A: Audio Waveform & CRM Card (11.0s – 14.5s)
        if (t < 14.5) {
          ctx.save();
          ctx.translate(W / 2, 240);
          ctx.textAlign = 'center';
          ctx.font = '900 54px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 24;
          ctx.fillText('QUALIFIES CALLERS', 0, 0);

          ctx.font = '700 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.letterSpacing = '3px';
          ctx.fillText('AI GATHERS ALL REPAIR DETAILS LIVE', 0, 48);
          ctx.restore();

          // Live Animated Waveform Box
          ctx.save();
          ctx.translate(W / 2, 540);
          roundRect(ctx, -380, -90, 760, 180, 26, '#08142c', '#38bdf8', 2);

          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          for (let wx = -340; wx <= 340; wx += 6) {
            const wy = Math.sin(wx * 0.06 + t * 18) * 32 * Math.sin((wx + 340) / 680 * Math.PI);
            if (wx === -340) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();

          ctx.font = '700 18px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('Transcribing: "AC stopped cooling, master bedroom is 84°"', 0, 52);
          ctx.restore();

          // Animated Contact Card (Sarah Jenkins)
          ctx.save();
          ctx.translate(W / 2, 1080);
          roundRect(ctx, -380, -220, 760, 440, 32, '#0c1630', '#10b981', 3);

          roundRect(ctx, -340, -180, 680, 65, 16, 'rgba(16, 185, 129, 0.15)', null);
          ctx.font = '800 24px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.textAlign = 'left';
          ctx.fillText('✓ EMERGENCY LEAD QUALIFIED', -310, -140);

          // Details
          const leadRows = [
            { label: 'CLIENT', val: 'Sarah Jenkins (Homeowner)' },
            { label: 'SERVICE', val: 'Emergency AC Diagnostic & Repair' },
            { label: 'PRIORITY', val: 'HIGH • Dispatch Immediately' }
          ];

          leadRows.forEach((r, idx) => {
            const ry = -90 + idx * 75;
            roundRect(ctx, -340, ry, 680, 65, 14, '#131f3d', null);
            ctx.font = '600 15px "SF Pro Display", sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(r.label, -310, ry + 26);
            ctx.font = '800 20px "SF Pro Display", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(r.val, -310, ry + 50);
          });
          ctx.restore();
        }

        // Sub-phase B: Calendar Booking & Instant SMS Dispatch (14.5s – 18.0s)
        else {
          ctx.save();
          ctx.translate(W / 2, 240);
          ctx.textAlign = 'center';
          ctx.font = '900 54px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 24;
          ctx.fillText('LOCKS THE APPOINTMENT', 0, 0);

          ctx.font = '700 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#34d399';
          ctx.letterSpacing = '3px';
          ctx.fillText('CALENDAR SYNCED • SMS SENT TO YOUR PHONE', 0, 48);
          ctx.restore();

          // Calendar Card
          ctx.save();
          ctx.translate(W / 2, 680);
          roundRect(ctx, -380, -220, 760, 440, 32, '#0c1630', '#10b981', 3);

          roundRect(ctx, -340, -180, 680, 60, 14, '#131f3d', null);
          ctx.font = '800 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.fillText('📅 TODAY\\'S SCHEDULE', -300, -142);

          const timeSlots = [
            { t: '09:00 AM', status: 'Completed Job', color: '#64748b' },
            { t: '11:30 AM', status: '✓ BOOKED BY VANTORX (Sarah J.)', color: '#10b981', active: true },
            { t: '02:00 PM', status: 'Available Slot', color: '#38bdf8' }
          ];

          timeSlots.forEach((slot, idx) => {
            const sy = -100 + idx * 80;
            if (slot.active) {
              const pulseG = Math.sin(t * 12) * 0.3 + 0.7;
              roundRect(ctx, -340, sy, 680, 68, 16, '#064e3b', 'rgba(16, 185, 129, ' + pulseG + ')', 2.5);
            } else {
              roundRect(ctx, -340, sy, 680, 68, 16, '#101a33', null);
            }
            ctx.font = '800 20px "SF Pro Display", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(slot.t, -310, sy + 42);
            ctx.font = slot.active ? '900 18px "SF Pro Display", sans-serif' : '600 16px "SF Pro Display", sans-serif';
            ctx.fillStyle = slot.color;
            ctx.textAlign = 'right';
            ctx.fillText(slot.status, 310, sy + 42);
            ctx.textAlign = 'left';
          });
          ctx.restore();

          // Real-time SMS Notification to Owner
          if (t >= 15.2) {
            const smsProg = Math.min(1, (t - 15.2) / 0.4);
            ctx.save();
            ctx.translate(W / 2, 1260);
            ctx.scale(easeOutBack(smsProg), easeOutBack(smsProg));

            roundRect(ctx, -380, -90, 760, 180, 26, '#08142c', '#38bdf8', 3);

            ctx.font = '800 20px "SF Pro Display", sans-serif';
            ctx.fillStyle = '#38bdf8';
            ctx.fillText('💬 SMS NOTIFICATION · VANTORX AI', -340, -45);

            ctx.font = '700 24px "SF Pro Display", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('"New job booked for 11:30 AM today:', -340, -8);
            ctx.fillText('Sarah Jenkins • $450 Diagnostic + Repair"', -340, 28);
            ctx.restore();
          }
        }
      }

      // ==============================================================
      // SCENE 5 — OUT-ANSWER YOUR COMPETITION (18.0s – 23.8s)
      // Upward Growth Spline Curve, 100% Booked Calendar,
      // Headline: "OUT-ANSWER YOUR COMPETITION"
      // ==============================================================
      else if (t >= 18.0 && t < 24.0) {
        const s5Prog = (t - 18.0) / 5.8;

        // Headline
        const headProg = Math.min(1, (t - 18.0) / 0.5);
        ctx.save();
        ctx.translate(W / 2, 240);
        ctx.scale(easeOutBack(headProg), easeOutBack(headProg));
        ctx.textAlign = 'center';

        ctx.font = '900 52px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = 'rgba(16, 185, 129, 0.7)';
        ctx.shadowBlur = 28;
        ctx.fillText('OUT-ANSWER', 0, 0);

        ctx.font = '900 56px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('YOUR COMPETITION', 0, 68);
        ctx.restore();

        // 3 Stacked Confirmed Bookings Cards
        const bookedDecks = [
          { name: 'Sarah J. • AC Emergency', time: '11:30 AM', delay: 18.3 },
          { name: 'Robert C. • System Quote', time: '02:00 PM', delay: 18.7 },
          { name: 'Michael M. • Duct Repair', time: '04:30 PM', delay: 19.1 }
        ];

        bookedDecks.forEach((card, idx) => {
          if (t >= card.delay) {
            const cProg = Math.min(1, (t - card.delay) / 0.4);
            const cy = 420 + idx * 80 + (1 - easeOutBack(cProg)) * 50;

            ctx.save();
            ctx.translate(W / 2, cy);
            roundRect(ctx, -360, -32, 720, 64, 18, '#0b162e', '#10b981', 2);

            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(-315, 0, 16, 0, Math.PI * 2);
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
            ctx.fillText(card.name, -280, 0);

            ctx.font = '700 18px "SF Pro Display", sans-serif';
            ctx.fillStyle = '#34d399';
            ctx.textAlign = 'right';
            ctx.fillText('✓ Confirmed (' + card.time + ')', 320, 0);
            ctx.restore();
          }
        });

        // Upward Growth Spline Graph
        ctx.save();
        ctx.translate(W / 2, 1180);
        roundRect(ctx, -400, -280, 800, 560, 36, '#081024', 'rgba(56, 189, 248, 0.4)', 2);

        ctx.font = '800 24px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.fillText('📈 SPEED-TO-LEAD REVENUE GROWTH', -350, -220);

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let gy = -160; gy <= 160; gy += 60) {
          ctx.beginPath();
          ctx.moveTo(-350, gy);
          ctx.lineTo(350, gy);
          ctx.stroke();
        }

        // Exponential Curve Points
        const graphProg = Math.min(1, Math.max(0, (t - 19.2) / 3.4));
        const pts = [
          { x: -350, y: 150 },
          { x: -220, y: 120 },
          { x: -90,  y: 60 },
          { x: 50,   y: -50 },
          { x: 190,  y: -140 },
          { x: 340,  y: -200 }
        ];

        const curMaxX = -350 + (340 - (-350)) * graphProg;

        // Area Fill
        ctx.beginPath();
        ctx.moveTo(pts[0].x, 180);
        pts.forEach((pt, pIdx) => {
          if (pIdx === 0) ctx.lineTo(pt.x, pt.y);
          else if (pt.x <= curMaxX) ctx.lineTo(pt.x, pt.y);
          else {
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

        // Stroke Line
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 24;
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

        // Tip glowing head
        if (graphProg > 0) {
          const tipX = curMaxX;
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
      // SCENE 6 — BRAND REVEAL (23.8s – 28.0s)
      // Gravitational Vortex Collapse into Glowing VantorX Geometric Emblem
      // "VANTORX" · "YOUR BUSINESS. ALWAYS ANSWERED." · "vantorxsolutions.com"
      // ==============================================================
      else if (t >= 23.8) {
        const logoProg = Math.min(1, (t - 24.0) / 0.8);
        const logoScale = easeOutBack(logoProg);

        // Ambient Pulse
        const brandGrad = ctx.createRadialGradient(W / 2, H * 0.48, 50, W / 2, H * 0.5, W * 0.95);
        brandGrad.addColorStop(0, '#0c1d3d');
        brandGrad.addColorStop(0.5, '#060d1f');
        brandGrad.addColorStop(1, '#020409');
        ctx.fillStyle = brandGrad;
        ctx.fillRect(0, 0, W, H);

        // Holographic Ring
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

        // Inner V-Wing (VantorX Vector)
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

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Kinetic Typography
        const textProg = Math.min(1, Math.max(0, (t - 24.3) / 0.6));
        ctx.save();
        ctx.translate(W / 2, H * 0.56);
        ctx.globalAlpha = textProg;
        ctx.textAlign = 'center';

        ctx.font = '900 84px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '14px';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowBlur = 28;
        ctx.fillText('VANTORX', 0, 0);

        ctx.font = '800 32px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '4px';
        ctx.fillStyle = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fillText('OUT-ANSWER YOUR COMPETITION.', 0, 65);

        ctx.font = '600 26px "SF Pro Display", sans-serif';
        ctx.letterSpacing = '3px';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.shadowBlur = 0;
        ctx.fillText('vantorxsolutions.com', 0, 130);

        // Corner Cyber Brackets
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2.5;
        // Top-left
        ctx.beginPath(); ctx.moveTo(80, 140); ctx.lineTo(80, 80); ctx.lineTo(140, 80); ctx.stroke();
        // Top-right
        ctx.beginPath(); ctx.moveTo(W - 80, 140); ctx.lineTo(W - 80, 80); ctx.lineTo(W - 140, 80); ctx.stroke();
        // Bottom-left
        ctx.beginPath(); ctx.moveTo(80, H - 140); ctx.lineTo(80, H - 80); ctx.lineTo(140, H - 80); ctx.stroke();
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(W - 80, H - 140); ctx.lineTo(W - 80, H - 80); ctx.lineTo(W - 140, H - 80); ctx.stroke();

        ctx.restore();
      }

      ctx.restore();
    };
  </script>
</body>
</html>`;

const tempHtmlPath = path.join(root, 'website/demo/temp_speed_render.html');
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

async function render() {
  console.log('--- STARTING SPEED-TO-LEAD MOTION GRAPHICS VIDEO RENDER ---');
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
    outSpeedMp4
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

  console.log('Rendering 840 continuous speed-to-lead vector animation frames...');

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

  console.log('\n\n--- SPEED-TO-LEAD VIDEO ENCODING COMPLETE ---');
  console.log('Generated master MP4:', outSpeedMp4);

  // Sync to commercial & distribution outputs
  fs.copyFileSync(outSpeedMp4, outCommercialMp4);
  console.log('Copied to:', outCommercialMp4);

  fs.copyFileSync(outSpeedMp4, outReel2Mp4);
  console.log('Copied to:', outReel2Mp4);

  fs.copyFileSync(outSpeedMp4, artifactMp4);
  console.log('Copied to artifact dir:', artifactMp4);

  // Extract proof frames
  const proofFrames = [
    { name: 'speed_proof_scene1_timer_02s.jpg', time: '00:00:02.000' },
    { name: 'speed_proof_scene2_competitor_04s.jpg', time: '00:00:04.500' },
    { name: 'speed_proof_scene3_instant_08s.jpg', time: '00:00:08.500' },
    { name: 'speed_proof_scene4_qualify_13s.jpg', time: '00:00:13.000' },
    { name: 'speed_proof_scene4_calendar_16s.jpg', time: '00:00:16.500' },
    { name: 'speed_proof_scene5_growth_21s.jpg', time: '00:00:21.000' },
    { name: 'speed_proof_scene6_brand_26s.jpg', time: '00:00:26.500' }
  ];

  for (const pf of proofFrames) {
    const proofPath = path.join(ARTIFACT_DIR, pf.name);
    const ffmpegProof = spawn(ffmpegPath, [
      '-ss', pf.time,
      '-i', outSpeedMp4,
      '-vframes', '1',
      '-q:v', '2',
      '-y',
      proofPath
    ]);
    await new Promise(r => ffmpegProof.on('close', r));
    console.log(`Saved proof frame (${pf.time}):`, pf.name);
  }

  // Representative Poster
  const posterPath = path.join(root, 'website/demo/video/speed_poster.jpg');
  const ffmpegPoster = spawn(ffmpegPath, [
    '-ss', '00:00:08.500',
    '-i', outSpeedMp4,
    '-vframes', '1',
    '-q:v', '2',
    '-y',
    posterPath
  ]);
  await new Promise(r => ffmpegPoster.on('close', r));
  console.log('Saved speed poster:', posterPath);

  console.log('\n--- SPEED TO LEAD REEL COMPLETED SUCCESSFULLY ---');
}

render().catch(err => {
  console.error('Fatal render error:', err);
  process.exit(1);
});
