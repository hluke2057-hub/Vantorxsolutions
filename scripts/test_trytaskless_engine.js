// Standalone Canvas Render Engine for TryTaskless.ai Visual Rebuild
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

// We create an HTML test harness with canvas 540x960
const harnessHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin:0; background:#070a12; display:flex; align-items:center; justify-content:center; height:100vh; overflow:hidden; font-family:-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', sans-serif; }
    canvas { width:540px; height:960px; box-shadow:0 20px 60px rgba(0,0,0,0.85); border-radius:18px; }
  </style>
</head>
<body>
  <canvas id="c" width="540" height="960"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const W = 540;
    const H = 960;

    function roundRect(ctx, x, y, w, h, r, fill, stroke) {
      if (typeof r === 'number') r = {tl: r, tr: r, br: r, bl: r};
      ctx.beginPath();
      ctx.moveTo(x + r.tl, y);
      ctx.lineTo(x + w - r.tr, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
      ctx.lineTo(x + w, y + h - r.br);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
      ctx.lineTo(x + r.bl, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
      ctx.lineTo(x, y + r.tl);
      ctx.quadraticCurveTo(x, y, x + r.tl, y);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }

    // --- TASKLESS VECTOR ATMOSPHERE & BACKGROUND ---
    function renderTasklessAtmosphere(ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#060913');
      grad.addColorStop(0.55, '#0b1220');
      grad.addColorStop(1, '#080d18');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    // --- SCENE 1 & POSTER: THE 11:04 PM BEDSIDE IPHONE HOOK ---
    function renderScene1_NightPhoneHook(t) {
      renderTasklessAtmosphere(ctx);

      // 1. Moonlight 4-Pane Window on Wall
      const winX = 48; const winY = 80; const winW = 190; const winH = 220;
      ctx.save();
      // Room wall soft shadow
      ctx.fillStyle = '#080e1a';
      ctx.fillRect(winX - 6, winY - 6, winW + 12, winH + 12);

      // Window panes (deep night blue sky outside)
      const skyGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
      skyGrad.addColorStop(0, '#0f1c30');
      skyGrad.addColorStop(1, '#09101d');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(winX, winY, winW, winH);

      // Soft Moon in Window
      ctx.save();
      ctx.fillStyle = '#f1f5f9';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(winX + 130, winY + 60, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Distant city buildings in window
      ctx.fillStyle = '#050a12';
      ctx.fillRect(winX + 10, winY + 160, 35, 60);
      ctx.fillRect(winX + 55, winY + 140, 45, 80);
      ctx.fillRect(winX + 110, winY + 170, 30, 50);
      ctx.fillRect(winX + 148, winY + 150, 38, 70);

      // Tiny yellow building windows
      ctx.fillStyle = 'rgba(234, 179, 8, 0.65)';
      ctx.fillRect(winX + 18, winY + 172, 4, 4);
      ctx.fillRect(winX + 28, winY + 185, 4, 4);
      ctx.fillRect(winX + 65, winY + 152, 4, 4);
      ctx.fillRect(winX + 82, winY + 168, 4, 4);
      ctx.fillRect(winX + 120, winY + 180, 4, 4);
      ctx.fillRect(winX + 160, winY + 165, 4, 4);

      // Window mullions (cross divider)
      ctx.strokeStyle = '#050912';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(winX + winW / 2, winY);
      ctx.lineTo(winX + winW / 2, winY + winH);
      ctx.moveTo(winX, winY + winH / 2);
      ctx.lineTo(winX + winW, winY + winH / 2);
      ctx.stroke();
      ctx.restore();

      // 2. Bedside Table Base
      const tableY = 480;
      const tableGrad = ctx.createLinearGradient(0, tableY, 0, H);
      tableGrad.addColorStop(0, '#0a101d');
      tableGrad.addColorStop(1, '#05080e');
      ctx.fillStyle = tableGrad;
      ctx.fillRect(0, tableY, W, H - tableY);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, tableY);
      ctx.lineTo(W, tableY);
      ctx.stroke();

      // 3. Vector iPhone Chassis
      const phoneW = 270;
      const phoneH = 500;
      const phoneX = (W - phoneW) / 2 + 30;
      const phoneY = 240;

      // Phone Drop Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 36;
      ctx.shadowOffsetY = 16;
      ctx.fillStyle = '#0f172a';
      roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 38, true, false);
      ctx.restore();

      // Phone Bezel / Screen
      ctx.fillStyle = '#0b0f19';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 38, true, true);

      // Dynamic Island Pill
      ctx.fillStyle = '#020408';
      roundRect(ctx, phoneX + (phoneW - 74) / 2, phoneY + 14, 74, 20, 10, true, false);

      // Lock Screen Date & Clock
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Friday, October 30', phoneX + phoneW / 2, phoneY + 68);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '300 64px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
      ctx.fillText('11:04', phoneX + phoneW / 2, phoneY + 135);

      // 4. Spring Notification Drop (Animated)
      const notifW = phoneW - 28;
      const notifH = 100;
      const notifX = phoneX + 14;
      const notifTargetY = phoneY + 168;

      // Smooth drop in
      const dropProgress = Math.min(1, Math.max(0, (t - 0.6) / 0.8));
      const notifY = phoneY + 130 + (notifTargetY - (phoneY + 130)) * dropProgress;

      if (dropProgress > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(30, 41, 59, 0.92)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 6;
        roundRect(ctx, notifX, notifY, notifW, notifH, 18, true, true);

        // Green Message Icon
        ctx.fillStyle = '#22c55e';
        roundRect(ctx, notifX + 14, notifY + 14, 22, 22, 6, true, false);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💬', notifX + 25, notifY + 29);

        // Header
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 10px -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('MESSAGES', notifX + 44, notifY + 24);

        ctx.fillStyle = '#64748b';
        ctx.font = '10px -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('now', notifX + notifW - 14, notifY + 24);

        // Sender
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12.5px -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('New Customer', notifX + 14, notifY + 52);

        // Message Preview
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '400 11.5px -apple-system, sans-serif';
        ctx.fillText('Hi! Our AC is leaking water everywhere.', notifX + 14, notifY + 70);
        ctx.fillText('Are you free tomorrow? Need quote ASAP 🙏', notifX + 14, notifY + 86);
        ctx.restore();

        // Red Notification Badge "1" on Corner
        ctx.save();
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(phoneX + phoneW - 8, phoneY + 8, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('1', phoneX + phoneW - 8, phoneY + 13);
        ctx.restore();
      }

      // Bottom Signature Headline Pill
      ctx.save();
      const pillW = 460;
      const pillH = 64;
      const pillX = (W - pillW) / 2;
      const pillY = H - 150;
      ctx.fillStyle = 'rgba(11, 18, 32, 0.88)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      roundRect(ctx, pillX, pillY, pillW, pillH, 16, true, true);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 15px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('YOU LOST A CUSTOMER LAST NIGHT.', W / 2, pillY + 28);
      ctx.fillStyle = '#a3e635';
      ctx.font = '600 13px -apple-system, sans-serif';
      ctx.fillText('YOU JUST DON\\'T KNOW IT YET.', W / 2, pillY + 48);
      ctx.restore();
    }

    // --- SCENE 2: CITY SKYLINE & WINDOW SILHOUETTE ---
    function renderScene2_CustomerWindowSilhouette(t) {
      renderTasklessAtmosphere(ctx);

      // Night City Skyline Background
      const numBldgs = 12;
      for (let i = 0; i < numBldgs; i++) {
        const bx = i * 46 - 10;
        const bh = 220 + ((i * 37) % 180);
        const by = H - 320 - bh;
        ctx.fillStyle = i % 2 === 0 ? '#0a101e' : '#0e1628';
        ctx.fillRect(bx, by, 50, bh + 320);

        // Windows in background buildings
        ctx.fillStyle = 'rgba(202, 138, 4, 0.35)';
        for (let row = 0; row < bh / 28; row++) {
          if ((row + i) % 3 === 0) ctx.fillRect(bx + 10, by + row * 26 + 10, 8, 12);
          if ((row * 2 + i) % 5 === 0) ctx.fillRect(bx + 28, by + row * 26 + 10, 8, 12);
        }
      }

      // The Center Illuminated Warm Apartment Window
      const winW = 160;
      const winH = 220;
      const winX = (W - winW) / 2;
      const winY = 320;

      // Warm Amber Glow
      ctx.save();
      ctx.shadowColor = 'rgba(234, 179, 8, 0.4)';
      ctx.shadowBlur = 30;
      const winGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
      winGrad.addColorStop(0, '#ca8a04');
      winGrad.addColorStop(1, '#854d0e');
      ctx.fillStyle = winGrad;
      roundRect(ctx, winX, winY, winW, winH, 10, true, false);
      ctx.restore();

      // Window Frame Divider
      ctx.strokeStyle = '#050811';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(winX + winW / 2, winY);
      ctx.lineTo(winX + winW / 2, winY + winH);
      ctx.stroke();

      // Silhouette of Person Standing Inside Window
      ctx.fillStyle = '#070b14';
      // Head
      ctx.beginPath();
      ctx.arc(winX + winW / 2, winY + 95, 24, 0, Math.PI * 2);
      ctx.fill();
      // Torso / Shoulders
      ctx.beginPath();
      ctx.moveTo(winX + winW / 2 - 34, winY + winH);
      ctx.lineTo(winX + winW / 2 - 28, winY + 130);
      ctx.quadraticCurveTo(winX + winW / 2, winY + 120, winX + winW / 2 + 28, winY + 130);
      ctx.lineTo(winX + winW / 2 + 34, winY + winH);
      ctx.closePath();
      ctx.fill();

      // Glowing phone held by silhouette
      ctx.fillStyle = '#60a5fa';
      ctx.shadowColor = '#60a5fa';
      ctx.shadowBlur = 14;
      ctx.fillRect(winX + winW / 2 + 12, winY + 135, 12, 20);
      ctx.shadowBlur = 0;

      // Blue iMessage Speech Bubble Floating Above Window
      const bubbleW = 240;
      const bubbleH = 46;
      const bubbleX = (W - bubbleW) / 2;
      const bubbleY = winY - 60;
      ctx.fillStyle = '#2563eb';
      ctx.shadowColor = 'rgba(37, 99, 235, 0.45)';
      ctx.shadowBlur = 14;
      roundRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 16, true, false);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Need a quote for tomorrow 🙏', W / 2, bubbleY + 27);

      // Top Digital Clock (Like TryTaskless Reel!)
      ctx.save();
      const clockW = 220; const clockH = 60;
      const clockX = (W - clockW) / 2;
      const clockY = 120;
      ctx.fillStyle = 'rgba(10, 16, 28, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      roundRect(ctx, clockX, clockY, clockW, clockH, 14, true, true);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '700 36px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('11:04 PM', W / 2, clockY + 44);
      ctx.restore();

      // Lower Third Subtitle
      ctx.fillStyle = '#f8fafc';
      ctx.font = '500 24px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('someone tried to hire you.', W / 2, H - 140);
    }

    // --- SCENE 3: 8 BILLION LASERS AT URANUS HOOK (247K VIRAL REEL) ---
    function renderScene3_LasersAtUranus(t) {
      renderTasklessAtmosphere(ctx);

      // Distant cyan planet Uranus with atmospheric glow ring
      const uranusX = W - 110;
      const uranusY = 240;
      const uranusR = 54;

      ctx.save();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 32;
      ctx.beginPath();
      ctx.arc(uranusX, uranusY, uranusR + 12, 0, Math.PI * 2);
      ctx.fill();

      // Planet Sphere
      const pGrad = ctx.createRadialGradient(uranusX - 15, uranusY - 15, 8, uranusX, uranusY, uranusR);
      pGrad.addColorStop(0, '#a5f3fc');
      pGrad.addColorStop(0.5, '#38bdf8');
      pGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(uranusX, uranusY, uranusR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Small Earth in bottom left
      const earthX = 80; const earthY = 460; const earthR = 24;
      ctx.save();
      const eGrad = ctx.createRadialGradient(earthX - 6, earthY - 6, 4, earthX, earthY, earthR);
      eGrad.addColorStop(0, '#67e8f9');
      eGrad.addColorStop(0.6, '#0284c7');
      eGrad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = eGrad;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Laser Beam from Earth to Uranus
      ctx.save();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(earthX, earthY);
      ctx.lineTo(uranusX, uranusY);
      ctx.stroke();
      ctx.restore();

      // Flat crowd of vector figures at bottom pointing lasers up
      const crowdY = H - 280;
      ctx.fillStyle = '#050810';
      ctx.fillRect(0, crowdY, W, H - crowdY);

      // Draw 9 minimalist figures in front row
      for (let i = 0; i < 9; i++) {
        const fx = 35 + i * 56;
        const fy = crowdY + 40;
        ctx.fillStyle = i % 2 === 0 ? '#1e293b' : '#334155';
        // Head
        ctx.beginPath();
        ctx.arc(fx, fy - 18, 12, 0, Math.PI * 2);
        ctx.fill();
        // Torso
        ctx.fillRect(fx - 14, fy - 6, 28, 60);

        // Raised Arm holding laser
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(fx + 6, fy);
        ctx.lineTo(fx + 12, fy - 36);
        ctx.stroke();

        // Laser pointer dot & beam shooting up
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(fx + 10, fy - 38, 4, 4);

        // Thin green laser trail upward
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(fx + 12, fy - 38);
        ctx.lineTo(fx + 12 + (i - 4) * 8, 0);
        ctx.stroke();
      }

      // Schematic Overlay Card (Top)
      ctx.save();
      const cardW = 320; const cardH = 80;
      const cardX = (W - cardW) / 2;
      const cardY = 70;
      ctx.fillStyle = 'rgba(10, 16, 28, 0.88)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      roundRect(ctx, cardX, cardY, cardW, cardH, 14, true, true);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 22px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('≈ 3 HOURS', W / 2, cardY + 34);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText('EARTH → URANUS · TIME COMPRESSED', W / 2, cardY + 54);
      ctx.fillStyle = '#a3e635';
      ctx.fillText('6 HOURS ROUND TRIP', W / 2, cardY + 68);
      ctx.restore();

      // Lower Subtitle
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 22px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('just to reach Uranus.', W / 2, H - 100);
    }

    // --- SCENE 4: BUSINESS A VS BUSINESS B STOREFRONTS ---
    function renderScene4_BusinessA_vs_BusinessB(t) {
      renderTasklessAtmosphere(ctx);

      const storeW = 210;
      const storeH = 340;
      const storeY = 280;
      const storeAX = 40;
      const storeBX = 290;

      // Top Header
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SAME MESSAGE · 11:04 PM', W / 2, 90);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 24px -apple-system, sans-serif';
      ctx.fillText('TWO DIFFERENT SHOPS', W / 2, 125);

      // --- STORE A: SHOP A (YOU) ---
      ctx.fillStyle = '#0f172a';
      roundRect(ctx, storeAX, storeY, storeW, storeH, 12, true, false);

      // Awning (Red & Black Stripes)
      for (let s = 0; s < 7; s++) {
        ctx.fillStyle = s % 2 === 0 ? '#dc2626' : '#1e293b';
        ctx.fillRect(storeAX + s * (storeW / 7), storeY, storeW / 7, 34);
      }

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SHOP A (YOU)', storeAX + storeW / 2, storeY + 62);

      // Dark Closed Window
      ctx.fillStyle = '#060a12';
      ctx.fillRect(storeAX + 16, storeY + 84, storeW - 32, 140);

      // Hanging CLOSED Sign
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      roundRect(ctx, storeAX + (storeW - 90) / 2, storeY + 130, 90, 34, 6, true, true);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('CLOSED', storeAX + storeW / 2, storeY + 152);

      // Status Tag Below Shop A
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px -apple-system, sans-serif';
      ctx.fillText('Message sits unread', storeAX + storeW / 2, storeY + 250);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 13px -apple-system, sans-serif';
      ctx.fillText('❌ LOST $9,200 JOB', storeAX + storeW / 2, storeY + 276);

      // --- STORE B: SHOP B (AVA AI) ---
      ctx.fillStyle = '#0f172a';
      roundRect(ctx, storeBX, storeY, storeW, storeH, 12, true, false);

      // Awning (Green & Black Stripes)
      for (let s = 0; s < 7; s++) {
        ctx.fillStyle = s % 2 === 0 ? '#16a34a' : '#1e293b';
        ctx.fillRect(storeBX + s * (storeW / 7), storeY, storeW / 7, 34);
      }

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SHOP B (AVA AI)', storeBX + storeW / 2, storeY + 62);

      // Illuminated Window
      ctx.fillStyle = '#062016';
      ctx.fillRect(storeBX + 16, storeY + 84, storeW - 32, 140);

      // Ava 24/7 Active Badge
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      roundRect(ctx, storeBX + (storeW - 130) / 2, storeY + 130, 130, 34, 6, true, true);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('⚡ REPLIED IN 8s', storeBX + storeW / 2, storeY + 152);

      // Status Tag Below Shop B
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px -apple-system, sans-serif';
      ctx.fillText('Dispatched While Asleep', storeBX + storeW / 2, storeY + 250);
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 13px -apple-system, sans-serif';
      ctx.fillText('✓ WON $9,200 JOB', storeBX + storeW / 2, storeY + 276);

      // Lower Subtitle
      ctx.fillStyle = '#f8fafc';
      ctx.font = '500 22px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('in two different businesses.', W / 2, H - 120);
    }

    // --- SCENE 5: AUTOMATION WORKFLOW NODE TREE (EXACT TRYTASKLESS.AI) ---
    function renderScene5_WorkflowNodeTree(t) {
      renderTasklessAtmosphere(ctx);

      // Header
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('AUTOMATION OF THE WEEK', W / 2, 70);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 24px -apple-system, sans-serif';
      ctx.fillText('AVA AI BOOKING WORKFLOW', W / 2, 105);

      // Node Tree Container
      const treeW = W - 60;
      const treeH = 620;
      const treeX = 30;
      const treeY = 140;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      roundRect(ctx, treeX, treeY, treeW, treeH, 20, true, true);

      // Nodes definitions
      const nodes = [
        { label: 'New Lead Trigger (Call / SMS)', sub: 'Homeowner emergency call', icon: '⚡', color: '#38bdf8' },
        { label: 'Ava Voice AI Intent Check', sub: 'Answers in 0.8s & qualifies leak', icon: '🤖', color: '#a855f7' },
        { label: 'Instant SMS & Booking Window', sub: 'Sent quote link in 8 seconds', icon: '💬', color: '#22c55e' },
        { label: 'Google Calendar / Jobber Sync', sub: 'Tomorrow 8:00 AM slot confirmed', icon: '📅', color: '#eab308' },
        { label: 'Technician Cell Dispatched', sub: 'Address & scope sent to mobile', icon: '📱', color: '#f97316' }
      ];

      const startY = treeY + 36;
      const stepY = 110;

      for (let i = 0; i < nodes.length; i++) {
        const ny = startY + i * stepY;
        const nw = treeW - 40;
        const nx = treeX + 20;

        // Connecting vertical lines
        if (i < nodes.length - 1) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(W / 2, ny + 54);
          ctx.lineTo(W / 2, ny + stepY);
          ctx.stroke();

          // Animated pulse dot traveling down
          const pulseT = ((t * 1.5 + i * 0.4) % 1);
          ctx.fillStyle = nodes[i].color;
          ctx.beginPath();
          ctx.arc(W / 2, ny + 54 + (stepY - 54) * pulseT, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node Card
        ctx.fillStyle = '#0b1120';
        ctx.strokeStyle = nodes[i].color;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = nodes[i].color;
        ctx.shadowBlur = 10;
        roundRect(ctx, nx, ny, nw, 54, 12, true, true);
        ctx.shadowBlur = 0;

        // Node Icon
        ctx.fillStyle = nodes[i].color;
        roundRect(ctx, nx + 12, ny + 11, 32, 32, 8, true, false);
        ctx.fillStyle = '#060a12';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(nodes[i].icon, nx + 28, ny + 33);

        // Node Text
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(nodes[i].label, nx + 56, ny + 25);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '400 11.5px -apple-system, sans-serif';
        ctx.fillText(nodes[i].sub, nx + 56, ny + 43);
      }

      // Lower Subtitle
      ctx.fillStyle = '#f8fafc';
      ctx.font = '500 22px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('while the owner was asleep.', W / 2, H - 100);
    }

    // --- SCENE 6: TASKLESS SIGNATURE CTA CARD ---
    function renderScene6_SignatureCTA(t) {
      renderTasklessAtmosphere(ctx);

      const cardW = W - 60;
      const cardH = 580;
      const cardX = 30;
      const cardY = 150;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      roundRect(ctx, cardX, cardY, cardW, cardH, 24, true, true);

      // Circular Black Badge with White Lightning Bolt (The Real TryTaskless Icon!)
      const badgeR = 48;
      const badgeX = W / 2;
      const badgeY = cardY + 84;
      ctx.fillStyle = '#020408';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Bold Lightning Bolt
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', badgeX, badgeY + 16);

      // Brand Title
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 30px -apple-system, sans-serif';
      ctx.fillText('VantorX', W / 2, cardY + 180);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 14px -apple-system, sans-serif';
      ctx.fillText('Autonomous Field Service Automations', W / 2, cardY + 206);

      // Divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cardX + 40, cardY + 230);
      ctx.lineTo(cardX + cardW - 40, cardY + 230);
      ctx.stroke();

      // Value Props
      const bullets = [
        '✓ Answers shop phone in zero-point-eight seconds',
        '✓ Instant text-back & emergency quote booking',
        '✓ Dispatches tech cell with full scope & address',
        '✓ Stops high-ticket leads slipping to competitors'
      ];
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 13px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      for (let i = 0; i < bullets.length; i++) {
        ctx.fillText(bullets[i], cardX + 36, cardY + 270 + i * 32);
      }

      // Action Button Pill (TryTaskless Style)
      const btnW = cardW - 60;
      const btnH = 54;
      const btnX = cardX + 30;
      const btnY = cardY + 420;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.25)';
      ctx.shadowBlur = 18;
      roundRect(ctx, btnX, btnY, btnW, btnH, 27, true, false);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#060a12';
      ctx.font = 'bold 15px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('COMMENT "AVA" ON THIS REEL', W / 2, btnY + 33);

      // Live Demo Phone Number
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.fillText('Or dial live demo → (561) 813-8602', W / 2, cardY + 520);
    }

    window.renderFrameTest = function(sceneIdx, t) {
      ctx.clearRect(0, 0, W, H);
      switch(sceneIdx) {
        case 1: renderScene1_NightPhoneHook(t); break;
        case 2: renderScene2_CustomerWindowSilhouette(t); break;
        case 3: renderScene3_LasersAtUranus(t); break;
        case 4: renderScene4_BusinessA_vs_BusinessB(t); break;
        case 5: renderScene5_WorkflowNodeTree(t); break;
        case 6: renderScene6_SignatureCTA(t); break;
      }
    };
  </script>
</body>
</html>
`;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.setContent(harnessHtml);
  await new Promise(r => setTimeout(r, 1000));

  const scenes = [
    { idx: 1, t: 1.5, file: 'test_taskless_scene1_night_iphone.png' },
    { idx: 2, t: 3.0, file: 'test_taskless_scene2_window_silhouette.png' },
    { idx: 3, t: 2.0, file: 'test_taskless_scene3_lasers_uranus.png' },
    { idx: 4, t: 2.0, file: 'test_taskless_scene4_business_comparison.png' },
    { idx: 5, t: 1.5, file: 'test_taskless_scene5_workflow_nodes.png' },
    { idx: 6, t: 1.0, file: 'test_taskless_scene6_signature_cta.png' }
  ];

  for (const s of scenes) {
    await page.evaluate((idx, time) => {
      window.renderFrameTest(idx, time);
    }, s.idx, s.t);
    await new Promise(r => setTimeout(r, 400));

    const canvas = await page.$('canvas');
    if (canvas) {
      await canvas.screenshot({ path: path.join(ARTIFACTS_DIR, s.file) });
      console.log(`PASS: Rendered ${s.file}`);
    }
  }

  await browser.close();
  console.log('ALL TEST SCENES RENDERED!');
})();
