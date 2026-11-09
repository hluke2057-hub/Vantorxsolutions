const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'website', 'demo', 'reel-creator.html');
let html = fs.readFileSync(targetFile, 'utf8');

// 1. Normalize line endings
html = html.replace(/\r\n/g, '\n');

// 2. Update renderDynamicAtmosphere to TryTaskless minimalist dark navy/slate
const oldAtmosphereStart = 'function renderDynamicAtmosphere(t, storyType) {';
const oldAtmosphereEnd = '// STUDIO HERO POSTER CARD ON PAUSE / INITIAL LOAD';

const idxAtmoStart = html.indexOf(oldAtmosphereStart);
const idxAtmoEnd = html.indexOf(oldAtmosphereEnd);

if (idxAtmoStart === -1 || idxAtmoEnd === -1) {
  console.error('ERROR: Could not find renderDynamicAtmosphere boundaries');
  process.exit(1);
}

const newAtmosphereCode = `function renderDynamicAtmosphere(t, storyType) {
  // TryTaskless Signature Clean Midnight Navy Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#060913');
  grad.addColorStop(0.55, '#0b1220');
  grad.addColorStop(1, '#080d18');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

`;

html = html.slice(0, idxAtmoStart) + newAtmosphereCode + html.slice(idxAtmoEnd);
console.log('PASS: Replaced renderDynamicAtmosphere');

// 3. Update the Scene switchers inside renderFrame(time)
const oldSceneSwitchStart = '  // 15 Fast-Paced Scene Switches (Every 3.0 - 4.5 seconds)';
const oldSceneSwitchEnd = '  // Word-by-Word Kinetic Caption Bar (Alex Hormozi Style)';

const idxSwitchStart = html.indexOf(oldSceneSwitchStart);
const idxSwitchEnd = html.indexOf(oldSceneSwitchEnd);

if (idxSwitchStart === -1 || idxSwitchEnd === -1) {
  console.error('ERROR: Could not find scene switcher boundaries');
  process.exit(1);
}

const newSceneSwitchCode = `  // TryTaskless Signature Scene Progression (1:1 with @trytaskless.ai viral reels)
  if (time < 7.2) {
    renderTasklessScene1_NightPhone(time);
  } else if (time < 12.8) {
    renderTasklessScene2_LasersUranus(time);
  } else if (time < 18.2) {
    renderTasklessScene3_CustomerWindow(time);
  } else if (time < 24.8) {
    renderTasklessScene4_Stat78Percent(time);
  } else if (time < 32.2) {
    renderTasklessScene5_TwoShopsComparison(time);
  } else if (time < 39.2) {
    renderTasklessScene6_ShopB_AvaReply(time);
  } else if (time < 47.2) {
    renderTasklessScene7_WorkflowNodes(time);
  } else if (time < 53.0) {
    renderTasklessScene8_TechDispatchAndDashboard(time);
  } else if (time < 58.5) {
    renderTasklessScene9_LiveDemoDialer(time);
  } else {
    renderTasklessScene10_TryTasklessCTA(time);
  }

`;

html = html.slice(0, idxSwitchStart) + newSceneSwitchCode + html.slice(idxSwitchEnd);
console.log('PASS: Replaced scene switchers in renderFrame');

// 4. Replace Scenes 5 to 15 and poster card functions with TryTaskless Vector Engine
const oldScenesStart = '// SCENES 5 TO 15: CINEMATIC HOLLYWOOD PROBLEM, MECHANISM & CTA';
const oldScenesEnd = '// Animation Loop: Bound Directly to Hardware Audio Clock for Zero Timing Drift';

const idxScenesStart = html.indexOf(oldScenesStart);
const idxScenesEnd = html.indexOf(oldScenesEnd);

if (idxScenesStart === -1 || idxScenesEnd === -1) {
  console.error('ERROR: Could not find old scenes boundaries');
  process.exit(1);
}

const newScenesCode = `// =============================================================
// 🎬 TRYTASKLESS.AI SIGNATURE 2D VECTOR ANIMATION ENGINE
// 100% Match to @trytaskless.ai: Kurzgesagt / Vox Minimalist Flat Aesthetic
// =============================================================

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

// Top Category Badge
function renderTasklessTopPill(label) {
  ctx.save();
  const pillW = Math.min(W - 48, label.length * 8.5 + 40);
  const pillH = 32;
  const pillX = (W - pillW) / 2;
  const pillY = 32;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  roundRect(ctx, pillX, pillY, pillW, pillH, 16, true, true);

  ctx.fillStyle = '#a3e635';
  ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label.toUpperCase(), W / 2, pillY + 20);
  ctx.restore();
}

// --- SCENE 1: THE 11:04 PM BEDSIDE IPHONE HOOK (0.0s - 7.2s) ---
function renderTasklessScene1_NightPhone(t) {
  renderTasklessTopPill('⚡ SPEED TO LEAD · EMERGENCY DISPATCH');

  // 1. Moonlight 4-Pane Window on Wall
  const winX = 48; const winY = 86; const winW = 190; const winH = 220;
  ctx.save();
  ctx.fillStyle = '#080e1a';
  ctx.fillRect(winX - 6, winY - 6, winW + 12, winH + 12);

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

  // Yellow building lights
  ctx.fillStyle = 'rgba(234, 179, 8, 0.65)';
  ctx.fillRect(winX + 18, winY + 172, 4, 4);
  ctx.fillRect(winX + 28, winY + 185, 4, 4);
  ctx.fillRect(winX + 65, winY + 152, 4, 4);
  ctx.fillRect(winX + 82, winY + 168, 4, 4);
  ctx.fillRect(winX + 120, winY + 180, 4, 4);
  ctx.fillRect(winX + 160, winY + 165, 4, 4);

  // Window mullions
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

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#0f172a';
  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 38, true, false);
  ctx.restore();

  ctx.fillStyle = '#0b0f19';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 38, true, true);

  // Dynamic Island Pill
  ctx.fillStyle = '#020408';
  roundRect(ctx, phoneX + (phoneW - 74) / 2, phoneY + 14, 74, 20, 10, true, false);

  // Clock
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Friday, October 30', phoneX + phoneW / 2, phoneY + 68);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '300 64px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
  ctx.fillText('11:04', phoneX + phoneW / 2, phoneY + 135);

  // 4. Spring Notification Drop
  const notifW = phoneW - 28;
  const notifH = 100;
  const notifX = phoneX + 14;
  const notifTargetY = phoneY + 168;

  const dropProgress = Math.min(1, Math.max(0, (t - 0.4) / 0.8));
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

    ctx.fillStyle = '#22c55e';
    roundRect(ctx, notifX + 14, notifY + 14, 22, 22, 6, true, false);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💬', notifX + 25, notifY + 29);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('MESSAGES', notifX + 44, notifY + 24);

    ctx.fillStyle = '#64748b';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('now', notifX + notifW - 14, notifY + 24);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12.5px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('New Customer', notifX + 14, notifY + 52);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '400 11.5px -apple-system, sans-serif';
    ctx.fillText('Hi! Our AC is leaking water everywhere.', notifX + 14, notifY + 70);
    ctx.fillText('Are you free tomorrow? Need quote ASAP 🙏', notifX + 14, notifY + 86);
    ctx.restore();

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

// --- SCENE 2: 8 BILLION LASERS AT URANUS HOOK (7.2s - 12.8s) ---
function renderTasklessScene2_LasersUranus(t) {
  renderTasklessTopPill('🔭 6 HOURS ROUND TRIP · SPEED OF LIGHT');

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

  const pGrad = ctx.createRadialGradient(uranusX - 15, uranusY - 15, 8, uranusX, uranusY, uranusR);
  pGrad.addColorStop(0, '#a5f3fc');
  pGrad.addColorStop(0.5, '#38bdf8');
  pGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = pGrad;
  ctx.beginPath();
  ctx.arc(uranusX, uranusY, uranusR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

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

  // Green Laser Beam
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

  // Crowd of vector figures at bottom pointing lasers up
  const crowdY = H - 280;
  ctx.fillStyle = '#050810';
  ctx.fillRect(0, crowdY, W, H - crowdY);

  for (let i = 0; i < 9; i++) {
    const fx = 35 + i * 56;
    const fy = crowdY + 40;
    ctx.fillStyle = i % 2 === 0 ? '#1e293b' : '#334155';
    ctx.beginPath();
    ctx.arc(fx, fy - 18, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(fx - 14, fy - 6, 28, 60);

    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(fx + 6, fy);
    ctx.lineTo(fx + 12, fy - 36);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(fx + 10, fy - 38, 4, 4);

    ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(fx + 12, fy - 38);
    ctx.lineTo(fx + 12 + (i - 4) * 8, 0);
    ctx.stroke();
  }

  // Schematic Card
  ctx.save();
  const cardW = 340; const cardH = 84;
  const cardX = (W - cardW) / 2;
  const cardY = 80;
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
  ctx.fillText('6 HOURS ROUND TRIP', W / 2, cardY + 70);
  ctx.restore();
}

// --- SCENE 3: CITY SKYLINE & AMBER WINDOW SILHOUETTE (12.8s - 18.2s) ---
function renderTasklessScene3_CustomerWindow(t) {
  renderTasklessTopPill('🌙 AFTER-HOURS HOMEOWNER EMERGENCY');

  const numBldgs = 12;
  for (let i = 0; i < numBldgs; i++) {
    const bx = i * 46 - 10;
    const bh = 220 + ((i * 37) % 180);
    const by = H - 320 - bh;
    ctx.fillStyle = i % 2 === 0 ? '#0a101e' : '#0e1628';
    ctx.fillRect(bx, by, 50, bh + 320);

    ctx.fillStyle = 'rgba(202, 138, 4, 0.35)';
    for (let row = 0; row < bh / 28; row++) {
      if ((row + i) % 3 === 0) ctx.fillRect(bx + 10, by + row * 26 + 10, 8, 12);
      if ((row * 2 + i) % 5 === 0) ctx.fillRect(bx + 28, by + row * 26 + 10, 8, 12);
    }
  }

  // The Center Amber Window
  const winW = 160;
  const winH = 220;
  const winX = (W - winW) / 2;
  const winY = 320;

  ctx.save();
  ctx.shadowColor = 'rgba(234, 179, 8, 0.4)';
  ctx.shadowBlur = 30;
  const winGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
  winGrad.addColorStop(0, '#ca8a04');
  winGrad.addColorStop(1, '#854d0e');
  ctx.fillStyle = winGrad;
  roundRect(ctx, winX, winY, winW, winH, 10, true, false);
  ctx.restore();

  ctx.strokeStyle = '#050811';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(winX + winW / 2, winY);
  ctx.lineTo(winX + winW / 2, winY + winH);
  ctx.stroke();

  // Silhouette
  ctx.fillStyle = '#070b14';
  ctx.beginPath();
  ctx.arc(winX + winW / 2, winY + 95, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(winX + winW / 2 - 34, winY + winH);
  ctx.lineTo(winX + winW / 2 - 28, winY + 130);
  ctx.quadraticCurveTo(winX + winW / 2, winY + 120, winX + winW / 2 + 28, winY + 130);
  ctx.lineTo(winX + winW / 2 + 34, winY + winH);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(winX + winW / 2 + 12, winY + 135, 12, 20);

  // iMessage Bubble
  const bubbleW = 250;
  const bubbleH = 46;
  const bubbleX = (W - bubbleW) / 2;
  const bubbleY = winY - 60;
  ctx.fillStyle = '#2563eb';
  ctx.shadowColor = 'rgba(37, 99, 235, 0.45)';
  ctx.shadowBlur = 14;
  roundRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 16, true, false);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12.5px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Need emergency quote ASAP 🙏', W / 2, bubbleY + 27);

  // Top Clock
  const clockW = 220; const clockH = 60;
  const clockX = (W - clockW) / 2;
  const clockY = 120;
  ctx.fillStyle = 'rgba(10, 16, 28, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  roundRect(ctx, clockX, clockY, clockW, clockH, 14, true, true);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 36px "JetBrains Mono", monospace';
  ctx.fillText('11:04 PM', W / 2, clockY + 44);
}

// --- SCENE 4: THE SPEED-TO-LEAD 78% STAT (18.2s - 24.8s) ---
function renderTasklessScene4_Stat78Percent(t) {
  renderTasklessTopPill('⚡ THE SPEED-TO-LEAD LAW: 78% RULE');

  const cardW = W - 60;
  const cardH = 520;
  const cardX = 30;
  const cardY = 160;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  roundRect(ctx, cardX, cardY, cardW, cardH, 22, true, true);

  // 78% Stat in TryTaskless Muted Lime
  ctx.fillStyle = '#a3e635';
  ctx.font = 'bold 112px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('78%', W / 2, cardY + 160);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 22px -apple-system, sans-serif';
  ctx.fillText('OF HOMEOWNERS HIRE', W / 2, cardY + 225);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px -apple-system, sans-serif';
  ctx.fillText('THE 1ST CONTRACTOR WHO ANSWERS', W / 2, cardY + 260);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 14px -apple-system, sans-serif';
  ctx.fillText('When you miss the call, they tap', W / 2, cardY + 330);
  ctx.fillText('the next contractor on Google in under 15 seconds.', W / 2, cardY + 355);

  // Alert Tag
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.2;
  roundRect(ctx, cardX + 30, cardY + 410, cardW - 60, 48, 12, true, true);

  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('EVERY DEAD VOICEMAIL IS A LOST $9,200 JOB', W / 2, cardY + 440);
}

// --- SCENE 5: TWO DIFFERENT SHOPS COMPARISON (24.8s - 32.2s) ---
function renderTasklessScene5_TwoShopsComparison(t) {
  renderTasklessTopPill('🏪 SIDE-BY-SIDE AFTER-HOURS AUDIT');

  const storeW = 210;
  const storeH = 340;
  const storeY = 280;
  const storeAX = 40;
  const storeBX = 290;

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SAME MESSAGE · 11:04 PM', W / 2, 90);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 24px -apple-system, sans-serif';
  ctx.fillText('TWO DIFFERENT SHOPS', W / 2, 125);

  // SHOP A
  ctx.fillStyle = '#0f172a';
  roundRect(ctx, storeAX, storeY, storeW, storeH, 12, true, false);

  for (let s = 0; s < 7; s++) {
    ctx.fillStyle = s % 2 === 0 ? '#dc2626' : '#1e293b';
    ctx.fillRect(storeAX + s * (storeW / 7), storeY, storeW / 7, 34);
  }

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SHOP A (YOU)', storeAX + storeW / 2, storeY + 62);

  ctx.fillStyle = '#060a12';
  ctx.fillRect(storeAX + 16, storeY + 84, storeW - 32, 140);

  ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  roundRect(ctx, storeAX + (storeW - 90) / 2, storeY + 130, 90, 34, 6, true, true);
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('CLOSED', storeAX + storeW / 2, storeY + 152);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillText('Message sits unread', storeAX + storeW / 2, storeY + 250);
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('❌ LOST $9,200 JOB', storeAX + storeW / 2, storeY + 276);

  // SHOP B
  ctx.fillStyle = '#0f172a';
  roundRect(ctx, storeBX, storeY, storeW, storeH, 12, true, false);

  for (let s = 0; s < 7; s++) {
    ctx.fillStyle = s % 2 === 0 ? '#16a34a' : '#1e293b';
    ctx.fillRect(storeBX + s * (storeW / 7), storeY, storeW / 7, 34);
  }

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SHOP B (AVA AI)', storeBX + storeW / 2, storeY + 62);

  ctx.fillStyle = '#062016';
  ctx.fillRect(storeBX + 16, storeY + 84, storeW - 32, 140);

  ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.5;
  roundRect(ctx, storeBX + (storeW - 130) / 2, storeY + 130, 130, 34, 6, true, true);
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('⚡ REPLIED IN 8s', storeBX + storeW / 2, storeY + 152);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillText('Dispatched While Asleep', storeBX + storeW / 2, storeY + 250);
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('✓ WON $9,200 JOB', storeBX + storeW / 2, storeY + 276);
}

// --- SCENE 6: SHOP B REPLIES IN 8 SECONDS (32.2s - 39.2s) ---
function renderTasklessScene6_ShopB_AvaReply(t) {
  renderTasklessTopPill('🤖 AVA 24/7 AUTONOMOUS RECEPTIONIST');

  const phoneW = 340;
  const phoneH = 560;
  const phoneX = (W - phoneW) / 2;
  const phoneY = 140;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 32;
  ctx.fillStyle = '#0f172a';
  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 32, true, false);
  ctx.restore();

  ctx.fillStyle = '#0b0f19';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 32, true, true);

  // Header Bar
  ctx.fillStyle = '#1e293b';
  roundRect(ctx, phoneX + 16, phoneY + 24, phoneW - 32, 54, 14, true, false);

  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(phoneX + 44, phoneY + 51, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#060a12';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🤖', phoneX + 44, phoneY + 55);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Ava Voice AI · 24/7 Dispatch', phoneX + 66, phoneY + 46);

  ctx.fillStyle = '#22c55e';
  ctx.font = '600 11px -apple-system, sans-serif';
  ctx.fillText('● Active · Replied in 8 seconds', phoneX + 66, phoneY + 62);

  // Incoming Message (Customer)
  const b1Y = phoneY + 110;
  ctx.fillStyle = '#1e293b';
  roundRect(ctx, phoneX + 20, b1Y, 260, 52, 14, true, false);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '400 12px -apple-system, sans-serif';
  ctx.fillText('Hi! Our AC unit is leaking water.', phoneX + 32, b1Y + 22);
  ctx.fillText('Can someone come tomorrow?', phoneX + 32, b1Y + 38);

  // Ava AI Instant Response
  const b2Y = phoneY + 185;
  ctx.fillStyle = '#1e3a5f';
  roundRect(ctx, phoneX + 50, b2Y, 270, 84, 14, true, false);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '400 11.5px -apple-system, sans-serif';
  ctx.fillText('Hi John! This is Ava with VantorX.', phoneX + 62, b2Y + 22);
  ctx.fillText('I\\'ve reserved tomorrow 8:00 AM for you.', phoneX + 62, b2Y + 38);
  ctx.fillText('Tap here to confirm: vantorx.com/book', phoneX + 62, b2Y + 54);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('✓ Quote sent in 8 seconds', phoneX + 62, b2Y + 72);

  // Customer Confirmation
  const b3Y = phoneY + 295;
  ctx.fillStyle = '#1e293b';
  roundRect(ctx, phoneX + 20, b3Y, 240, 48, 14, true, false);
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 12px -apple-system, sans-serif';
  ctx.fillText('Confirmed! Thank you so much! 🙏', phoneX + 32, b3Y + 28);

  // Status Banner
  const statY = phoneY + 380;
  ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.2;
  roundRect(ctx, phoneX + 20, statY, phoneW - 40, 56, 12, true, true);

  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 14px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓ $9,200 JOB BOOKED WHILE ASLEEP', phoneX + phoneW / 2, statY + 33);
}

// --- SCENE 7: AUTOMATION OF THE WEEK WORKFLOW NODE TREE (39.2s - 47.2s) ---
function renderTasklessScene7_WorkflowNodes(t) {
  renderTasklessTopPill('⚡ AUTOMATION OF THE WEEK · WORKFLOW TREE');

  const treeW = W - 60;
  const treeH = 580;
  const treeX = 30;
  const treeY = 120;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  roundRect(ctx, treeX, treeY, treeW, treeH, 20, true, true);

  const nodes = [
    { label: 'New Lead Trigger (Call / SMS)', sub: 'Homeowner emergency call', icon: '⚡', color: '#38bdf8' },
    { label: 'Ava Voice AI Intent Check', sub: 'Answers in 0.8s & qualifies leak', icon: '🤖', color: '#a855f7' },
    { label: 'Instant SMS & Booking Window', sub: 'Sent quote link in 8 seconds', icon: '💬', color: '#22c55e' },
    { label: 'Google Calendar / Jobber Sync', sub: 'Tomorrow 8:00 AM slot confirmed', icon: '📅', color: '#eab308' },
    { label: 'Technician Cell Dispatched', sub: 'Address & scope sent to mobile', icon: '📱', color: '#f97316' }
  ];

  const startY = treeY + 30;
  const stepY = 104;

  for (let i = 0; i < nodes.length; i++) {
    const ny = startY + i * stepY;
    const nw = treeW - 40;
    const nx = treeX + 20;

    if (i < nodes.length - 1) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2, ny + 50);
      ctx.lineTo(W / 2, ny + stepY);
      ctx.stroke();

      const pulseT = ((t * 1.5 + i * 0.4) % 1);
      ctx.fillStyle = nodes[i].color;
      ctx.beginPath();
      ctx.arc(W / 2, ny + 50 + (stepY - 50) * pulseT, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#0b1120';
    ctx.strokeStyle = nodes[i].color;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = nodes[i].color;
    ctx.shadowBlur = 10;
    roundRect(ctx, nx, ny, nw, 50, 12, true, true);
    ctx.shadowBlur = 0;

    ctx.fillStyle = nodes[i].color;
    roundRect(ctx, nx + 10, ny + 10, 30, 30, 8, true, false);
    ctx.fillStyle = '#060a12';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(nodes[i].icon, nx + 25, ny + 30);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12.5px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(nodes[i].label, nx + 52, ny + 23);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 11px -apple-system, sans-serif';
    ctx.fillText(nodes[i].sub, nx + 52, ny + 40);
  }
}

// --- SCENE 8: TECHNICIAN DISPATCH & REVENUE DASHBOARD (47.2s - 53.0s) ---
function renderTasklessScene8_TechDispatchAndDashboard(t) {
  renderTasklessTopPill('📱 MOBILE DISPATCH & REVENUE RECOVERY');

  const cardW = W - 60;
  const cardH = 260;
  const cardX = 30;
  const cardY = 110;

  // Technician SMS Card
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 18, true, true);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('✓ SMS DISPATCHED · JOB #2841', cardX + 24, cardY + 36);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 17px -apple-system, sans-serif';
  ctx.fillText('Customer: John Miller', cardX + 24, cardY + 70);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('📍 Address: 142 Elm Street, Oakville', cardX + 24, cardY + 98);
  ctx.fillText('🔧 Issue: AC Compressor Leak ($9,200 Scope)', cardX + 24, cardY + 124);
  ctx.fillText('📅 Arrival: Tomorrow 8:00 AM · Pre-Qualified', cardX + 24, cardY + 150);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillText('STATUS: DISPATCH NOTIFIED · TECH CONFIRMED', cardX + 24, cardY + 195);

  // Revenue Dashboard Card
  const dashY = cardY + cardH + 24;
  const dashH = 240;
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  roundRect(ctx, cardX, dashY, cardW, dashH, 18, true, true);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillText('MONTHLY REVENUE RECOVERED', cardX + 24, dashY + 34);

  ctx.fillStyle = '#a3e635';
  ctx.font = 'bold 44px -apple-system, sans-serif';
  ctx.fillText('+$44,800', cardX + 24, dashY + 86);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('14 After-Hours Emergency Leads Saved / Month', cardX + 24, dashY + 125);
  ctx.fillText('Zero Software Change · Works With Your Existing Tools', cardX + 24, dashY + 150);
}

// --- SCENE 9: LIVE DEMO DIALER (53.0s - 58.5s) ---
function renderTasklessScene9_LiveDemoDialer(t) {
  renderTasklessTopPill('📞 TRY LIVE INTERACTIVE AI DEMO');

  const cardW = W - 60;
  const cardH = 500;
  const cardX = 30;
  const cardY = 160;

  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1;
  roundRect(ctx, cardX, cardY, cardW, cardH, 22, true, true);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TEST AVA LIVE ON YOUR CELL RIGHT NOW', W / 2, cardY + 60);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 24px -apple-system, sans-serif';
  ctx.fillText('DIAL AVA VOICE AI DEMO', W / 2, cardY + 105);

  // Phone Number Pill
  const numW = cardW - 40;
  const numH = 80;
  const numX = cardX + 20;
  const numY = cardY + 150;

  ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  roundRect(ctx, numX, numY, numW, numH, 18, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px "JetBrains Mono", monospace';
  ctx.fillText('(561) 813-8602', W / 2, numY + 52);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 14px -apple-system, sans-serif';
  ctx.fillText('Call now to hear Ava answer in 0.8 seconds,', W / 2, cardY + 280);
  ctx.fillText('triage emergency plumbing/HVAC requests,', W / 2, cardY + 305);
  ctx.fillText('and dispatch a simulated job.', W / 2, cardY + 330);

  ctx.fillStyle = '#a3e635';
  ctx.font = '600 14px -apple-system, sans-serif';
  ctx.fillText('Available 24 Hours A Day · 7 Days A Week', W / 2, cardY + 410);
}

// --- SCENE 10: TRYTASKLESS SIGNATURE CTA CARD (58.5s - 63.0s) ---
function renderTasklessScene10_TryTasklessCTA(t) {
  renderTasklessTopPill('⚡ AUTOMATE YOUR FIELD SERVICE WORKFLOW');

  const cardW = W - 60;
  const cardH = 580;
  const cardX = 30;
  const cardY = 150;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  roundRect(ctx, cardX, cardY, cardW, cardH, 24, true, true);

  // Circular Badge with White Lightning Bolt
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

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡', badgeX, badgeY + 16);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 30px -apple-system, sans-serif';
  ctx.fillText('VantorX', W / 2, cardY + 180);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 14px -apple-system, sans-serif';
  ctx.fillText('Autonomous Field Service Automations', W / 2, cardY + 206);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 40, cardY + 230);
  ctx.lineTo(cardX + cardW - 40, cardY + 230);
  ctx.stroke();

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

  // White Action Button
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

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText('Or dial live demo → (561) 813-8602', W / 2, cardY + 520);
}

// --- INITIAL HERO POSTER CARD ON PAUSE / LOAD (t === 0) ---
function renderStudioHeroPosterCard(storyType) {
  renderTasklessScene1_NightPhone(1.2);
}

// --- TRYTASKLESS SUBTITLE SYSTEM ---
function renderKineticSubtitles(time) {
  const cue = (window.SCRIPT_CUES || []).find(c => time >= c.start && time <= c.end);
  if (!cue || !cue.text) return;

  ctx.save();
  const boxW = W - 48;
  const boxH = 56;
  const boxX = (W - boxW) / 2;
  const boxY = H - 96;

  ctx.fillStyle = 'rgba(8, 14, 26, 0.88)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  roundRect(ctx, boxX, boxY, boxW, boxH, 16, true, true);

  const words = cue.text.split(' ');
  const totalWords = words.length;
  const duration = Math.max(0.1, cue.end - cue.start);
  const elapsed = Math.max(0, time - cue.start);
  const activeWordIdx = Math.min(totalWords - 1, Math.floor((elapsed / duration) * totalWords));

  // Render centered caption with active word highlight
  ctx.font = '600 17px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#cbd5e1';

  // If text is long, truncate or show window of words
  let displayWords = words;
  let highlightWord = words[activeWordIdx];

  if (totalWords > 9) {
    const startW = Math.max(0, Math.min(totalWords - 9, activeWordIdx - 4));
    displayWords = words.slice(startW, startW + 9);
  }

  const lineStr = displayWords.join(' ');
  ctx.fillText(lineStr, W / 2, boxY + 34);

  ctx.restore();
}

`;

html = html.slice(0, idxScenesStart) + newScenesCode + html.slice(idxScenesEnd);
console.log('PASS: Replaced scenes 5-15, poster card, and subtitles with TryTaskless engine');

fs.writeFileSync(targetFile, html, 'utf8');
console.log('REEL-CREATOR.HTML SUCCESSFULLY UPGRADED TO TRYTASKLESS.AI ENGINE!');
