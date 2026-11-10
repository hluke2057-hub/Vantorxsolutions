const fs = require('fs');
const path = require('path');

const targetHtml = path.resolve('website/demo/reel-creator.html');
console.log('Target file:', targetHtml);

let content = fs.readFileSync(targetHtml, 'utf8');

// 1. ASSET PRELOADER EXPANSION
const assetPreloader = `
  // 🚀 TASKLESS AI 3D ASSETS ENGINE (Preloaded for 60 FPS Cinematic Canvas)
  const TASKLESS_ASSETS = {
    laser: new Image(),
    moon: new Image(),
    contractor: new Image(),
    hud78: new Image(),
    ava: new Image(),
    tech: new Image(),
    bot: new Image(),
    dashboard: new Image(),
    phone: new Image(),
    logo: new Image(),
    cta: new Image()
  };
  TASKLESS_ASSETS.laser.src = 'assets/taskless/laser_warp_space.jpg';
  TASKLESS_ASSETS.moon.src = 'assets/taskless/moon_trajectory.jpg';
  TASKLESS_ASSETS.contractor.src = 'assets/taskless/contractor_missed_call.jpg';
  TASKLESS_ASSETS.hud78.src = 'assets/taskless/speed_78pct_hud.jpg';
  TASKLESS_ASSETS.ava.src = 'assets/taskless/ava_3d_android.jpg';
  TASKLESS_ASSETS.tech.src = 'assets/taskless/cyber_technician.jpg';
  TASKLESS_ASSETS.bot.src = 'assets/taskless/bot_security_shield.jpg';
  TASKLESS_ASSETS.dashboard.src = 'assets/dashboard_3d.jpg';
  TASKLESS_ASSETS.phone.src = 'assets/iphone_ava_3d.jpg';
  TASKLESS_ASSETS.logo.src = 'assets/vantorx_logo.png';
  TASKLESS_ASSETS.cta.src = 'assets/cta_card.png';

  // Helper: Draw Cinematic Background with Smooth Camera Push-In Zoom & Pan
  function drawCinematicBackground(ctx, img, progress, opts) {
    opts = opts || {};
    const zoomSpeed = opts.zoomSpeed !== undefined ? opts.zoomSpeed : 0.08;
    const zoom = 1.0 + (progress || 0) * zoomSpeed;
    const panY = ((progress || 0) - 0.5) * (opts.panY || 18);

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-W / 2, -H / 2 + panY);

    if (img && img.complete && img.naturalWidth > 0) {
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = W / H;
      let dw, dh, dx, dy;
      if (imgRatio > canvasRatio) {
        dh = H + 40;
        dw = dh * imgRatio;
        dx = (W - dw) / 2;
        dy = -20;
      } else {
        dw = W + 40;
        dh = dw / imgRatio;
        dx = -20;
        dy = (H - dh) / 2;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#06030c');
      bg.addColorStop(0.5, '#0e061c');
      bg.addColorStop(1, '#050209');
      ctx.fillStyle = bg;
      ctx.fillRect(-20, -20, W + 40, H + 40);
    }

    // High-Contrast Cinematic Obsidian Overlay
    const overlayAlpha = opts.overlayAlpha !== undefined ? opts.overlayAlpha : 0.42;
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, \`rgba(4, 2, 8, \${overlayAlpha * 0.7})\`);
    grad.addColorStop(0.5, \`rgba(6, 3, 14, \${overlayAlpha})\`);
    grad.addColorStop(1, \`rgba(4, 2, 8, \${overlayAlpha * 1.25})\`);
    ctx.fillStyle = grad;
    ctx.fillRect(-40, -40, W + 80, H + 80);

    ctx.restore();
  }

  // Helper: Draw Glassmorphic Sci-Fi HUD Card
  function drawGlassCard(ctx, x, y, w, h, opts) {
    opts = opts || {};
    ctx.save();
    const r = opts.radius || 18;
    const bgGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    bgGrad.addColorStop(0, opts.bg0 || 'rgba(12, 7, 24, 0.88)');
    bgGrad.addColorStop(1, opts.bg1 || 'rgba(6, 3, 14, 0.94)');
    ctx.fillStyle = bgGrad;
    if (opts.glowColor) {
      ctx.shadowColor = opts.glowColor;
      ctx.shadowBlur = opts.glowBlur || 22;
    }
    roundRect(ctx, x, y, w, h, r, true, false);
    ctx.shadowBlur = 0;

    // Glowing Border
    ctx.strokeStyle = opts.borderColor || 'rgba(168, 85, 247, 0.45)';
    ctx.lineWidth = opts.borderWidth || 1.5;
    roundRect(ctx, x, y, w, h, r, false, true);

    // High-tech Corner Reticles [ + ]
    if (opts.showCorners !== false) {
      const cLen = 10;
      ctx.strokeStyle = opts.cornerColor || opts.borderColor || '#38bdf8';
      ctx.lineWidth = 2;
      // Top-Left
      ctx.beginPath(); ctx.moveTo(x + 4, y + 4 + cLen); ctx.lineTo(x + 4, y + 4); ctx.lineTo(x + 4 + cLen, y + 4); ctx.stroke();
      // Top-Right
      ctx.beginPath(); ctx.moveTo(x + w - 4 - cLen, y + 4); ctx.lineTo(x + w - 4, y + 4); ctx.lineTo(x + w - 4, y + 4 + cLen); ctx.stroke();
      // Bottom-Left
      ctx.beginPath(); ctx.moveTo(x + 4, y + h - 4 - cLen); ctx.lineTo(x + 4, y + h - 4); ctx.lineTo(x + 4 + cLen, y + h - 4); ctx.stroke();
      // Bottom-Right
      ctx.beginPath(); ctx.moveTo(x + w - 4 - cLen, y + h - 4); ctx.lineTo(x + w - 4, y + h - 4); ctx.lineTo(x + w - 4, y + h - 4 - cLen); ctx.stroke();
    }
    ctx.restore();
  }

  // Helper: Draw Animated Audio Spectrum Equalizer
  function drawAudioSpectrum(ctx, x, y, w, h, t, opts) {
    opts = opts || {};
    const bars = opts.bars || 22;
    const barW = (w - (bars - 1) * 3) / bars;
    const color = opts.color || '#38bdf8';
    ctx.save();
    for (let i = 0; i < bars; i++) {
      const wave = Math.sin(t * 14 + i * 0.45) * 0.5 + 0.5;
      const wave2 = Math.cos(t * 9 + i * 0.8) * 0.3 + 0.5;
      const barH = Math.max(4, h * (wave * 0.65 + wave2 * 0.35));
      const bx = x + i * (barW + 3);
      const by = y + (h - barH) / 2;

      const grad = ctx.createLinearGradient(bx, by, bx, by + barH);
      grad.addColorStop(0, color);
      grad.addColorStop(1, opts.color2 || '#a855f7');
      ctx.fillStyle = grad;
      roundRect(ctx, bx, by, barW, barH, 2, true, false);
    }
    ctx.restore();
  }

  // Helper: Draw Taskless 3D Avatar in Glowing Portal
  function drawTasklessAvatar(ctx, img, x, y, w, h, opts) {
    opts = opts || {};
    if (!img || !img.complete || img.naturalWidth === 0) return;
    ctx.save();
    const r = opts.radius || 24;

    // Glowing Outer Orbital Rings
    if (opts.orbitalRings) {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const ringR = Math.max(w, h) / 2 + 16;
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 18]);
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, (opts.rot || 0), (opts.rot || 0) + Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([8, 14]);
      ctx.beginPath();
      ctx.arc(cx, cy, ringR + 10, -(opts.rot || 0) * 1.3, -(opts.rot || 0) * 1.3 + Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.beginPath();
    roundRect(ctx, x, y, w, h, r, false, false);
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = opts.borderColor || 'rgba(168, 85, 247, 0.8)';
    ctx.lineWidth = opts.borderWidth || 2.5;
    ctx.shadowColor = opts.shadowColor || 'rgba(168, 85, 247, 0.7)';
    ctx.shadowBlur = opts.shadowBlur || 24;
    roundRect(ctx, x, y, w, h, r, false, true);
    ctx.restore();
  }
`;

// Replace existing TASKLESS_ASSETS & helpers block
const oldPreloaderRegex = /\/\/ 🚀 TASKLESS AI 3D CHARACTER ASSETS[\s\S]*?function renderDynamicAtmosphere\(t, storyType\) \{/;
if (oldPreloaderRegex.test(content)) {
  content = content.replace(oldPreloaderRegex, assetPreloader + '\nfunction renderDynamicAtmosphere(t, storyType) {');
  console.log('✓ Injected comprehensive TASKLESS_ASSETS preloader and cinematic helpers');
} else {
  console.warn('Could not match oldPreloaderRegex');
}

// 2. BUILD THE 10 CINEMATIC SCENES WITH HIGH PRODUCTION VALUE
const cinematicScenesCode = `
// =========================================================================
// 🎬 CINEMATIC TASKLESS.AI MOTION GRAPHICS ENGINE (100% NARRATION-MATCHED)
// =========================================================================

// --- SCENE 1: SPEED OF LIGHT LASER HOOK (0.0s - 7.2s) ---
// Narration: "A single beam of laser light travels at 186,000 miles per second."
function renderTasklessScene1_NightPhone(t) {
  const p = Math.min(1, Math.max(0, t / 7.2));
  drawCinematicBackground(ctx, TASKLESS_ASSETS.laser, p, { overlayAlpha: 0.32, zoomSpeed: 0.1 });
  renderTasklessTopPill('⚡ SPEED OF LIGHT · 186,000 MILES/SEC');

  // Pulsing High-Energy Laser Beam Core through screen
  const beamY = 480;
  ctx.save();
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 40;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, beamY);
  ctx.lineTo(W, beamY);
  ctx.stroke();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(0, beamY);
  ctx.lineTo(W, beamY);
  ctx.stroke();
  ctx.restore();

  // Floating High-Tech Telemetry HUD Card
  const cardW = W - 60;
  const cardH = 260;
  const cardX = 30;
  const cardY = 120;
  drawGlassCard(ctx, cardX, cardY, cardW, cardH, {
    borderColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    cornerColor: '#38bdf8'
  });

  ctx.save();
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('PHOTON ACCELERATION · CONSTANT (C)', cardX + 24, cardY + 38);

  // Big 186,000 Miles/Sec Typographic Readout
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 52px "Space Grotesk", sans-serif';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 16;
  ctx.fillText('186,000', cardX + 24, cardY + 102);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText('MILES / SECOND', cardX + 24, cardY + 132);

  // Tachometer Speed Bar Filling Smoothly
  const barW = cardW - 48;
  const barH = 16;
  const barX = cardX + 24;
  const barY = cardY + 160;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  roundRect(ctx, barX, barY, barW, barH, 8, true, false);

  const fillW = barW * Math.min(1, p * 1.4);
  const barGrad = ctx.createLinearGradient(barX, barY, barX + fillW, barY);
  barGrad.addColorStop(0, '#38bdf8');
  barGrad.addColorStop(1, '#a855f7');
  ctx.fillStyle = barGrad;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 14;
  roundRect(ctx, barX, barY, fillW, barH, 8, true, false);
  ctx.shadowBlur = 0;

  // Particle spark at tip of progress bar
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(barX + fillW, barY + barH / 2, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px -apple-system, sans-serif';
  ctx.fillText('FASTEST VELOCITY IN THE KNOWN UNIVERSE', cardX + 24, cardY + 215);
  ctx.restore();

  // Secondary Bottom HUD Telemetry
  const card2Y = 560;
  const card2H = 140;
  drawGlassCard(ctx, cardX, card2Y, cardW, card2H, {
    borderColor: 'rgba(168, 85, 247, 0.5)',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    cornerColor: '#a855f7'
  });

  ctx.save();
  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('TRANSMISSION LATENCY', cardX + 24, card2Y + 36);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 26px "Space Grotesk", sans-serif';
  ctx.fillText('0.000003 SECONDS', cardX + 24, card2Y + 76);

  ctx.fillStyle = '#34d399';
  ctx.font = '600 12px -apple-system, sans-serif';
  ctx.fillText('✓ INSTANTANEOUS ORBITAL BURST', cardX + 24, card2Y + 106);
  ctx.restore();
}

// --- SCENE 2: MOON IN 3 SECONDS & INTERPLANETARY SPACE (7.3s - 12.8s) ---
// Narration: "It can reach the moon in under three seconds, and cross nearly two billion miles of space in under three hours."
function renderTasklessScene2_LasersUranus(t) {
  const p = Math.min(1, Math.max(0, (t - 7.3) / 5.5));
  drawCinematicBackground(ctx, TASKLESS_ASSETS.moon, p, { overlayAlpha: 0.35, zoomSpeed: 0.08 });
  renderTasklessTopPill('🔭 LUNAR & INTERPLANETARY TELEMETRY');

  // Animated Curved Laser Trajectory to Moon
  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 18;
  ctx.setLineDash([12, 10]);
  ctx.lineDashOffset = -t * 40;
  ctx.beginPath();
  ctx.moveTo(80, H - 240);
  ctx.quadraticCurveTo(W / 2 + 60, 480, W - 120, 240);
  ctx.stroke();
  ctx.restore();

  // Floating Moon Reticle Target Lock
  const mx = W - 120;
  const my = 240;
  ctx.save();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(mx, my, 48, 0, Math.PI * 2);
  ctx.stroke();

  // Rotating Tick Crosshairs
  ctx.translate(mx, my);
  ctx.rotate(t * 0.8);
  ctx.beginPath();
  ctx.moveTo(-56, 0); ctx.lineTo(-44, 0);
  ctx.moveTo(44, 0); ctx.lineTo(56, 0);
  ctx.moveTo(0, -56); ctx.lineTo(0, -44);
  ctx.moveTo(0, 44); ctx.lineTo(0, 56);
  ctx.stroke();
  ctx.restore();

  // Main Card: Moon in 1.3 Seconds
  const cardW = W - 60;
  const cardX = 30;
  const cardY = 110;
  const cardH = 210;
  drawGlassCard(ctx, cardX, cardY, cardW, cardH, {
    borderColor: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    cornerColor: '#22c55e'
  });

  ctx.save();
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('TARGET LOCK: LUNAR SURFACE · 238,900 MILES', cardX + 24, cardY + 38);

  const moonTimer = Math.min(1.28, (p * 1.28)).toFixed(2);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 56px "Space Grotesk", sans-serif';
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 16;
  ctx.fillText(\`\${moonTimer}s\`, cardX + 24, cardY + 106);

  ctx.fillStyle = '#a3e635';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('EARTH → MOON TRAVEL TIME', cardX + 24, cardY + 138);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 12px -apple-system, sans-serif';
  ctx.fillText('Photons cross lunar orbit in under three seconds.', cardX + 24, cardY + 175);
  ctx.restore();

  // Secondary Card: 2 Billion Miles in 3 Hours
  const card2Y = 340;
  const card2H = 180;
  drawGlassCard(ctx, cardX, card2Y, cardW, card2H, {
    borderColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    cornerColor: '#38bdf8'
  });

  ctx.save();
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('DEEP SPACE TRAJECTORY · TIME COMPRESSED', cardX + 24, card2Y + 36);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 38px "Space Grotesk", sans-serif';
  ctx.fillText('2,000,000,000 MI', cardX + 24, card2Y + 84);

  ctx.fillStyle = '#c8ff00';
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText('COMPLETED IN < 3.0 HOURS', cardX + 24, card2Y + 118);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px -apple-system, sans-serif';
  ctx.fillText('Interplanetary corridor traversed faster than a voicemail.', cardX + 24, card2Y + 148);
  ctx.restore();
}

// --- SCENE 3: INTERPLANETARY SPEED VS CONTRACTOR DELAY (12.9s - 18.2s) ---
// Narration: "Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead."
function renderTasklessScene3_CustomerWindow(t) {
  const p = Math.min(1, Math.max(0, (t - 12.9) / 5.3));
  renderDynamicAtmosphere(t);
  renderTasklessTopPill('⚠️ THE AFTER-HOURS LATENCY CRIME');

  // Comparison Grid
  const cardW = W - 60;
  const cardX = 30;
  const cardY = 110;
  const cardH = 500;
  drawGlassCard(ctx, cardX, cardY, cardW, cardH, {
    borderColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    cornerColor: '#ef4444'
  });

  ctx.save();
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SPEED BENCHMARK AUDIT · LIGHT VS HUMANS', W / 2, cardY + 36);

  // BAR 1: Laser Space Beam (Green)
  const bar1Y = cardY + 60;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  roundRect(ctx, cardX + 20, bar1Y, cardW - 40, 76, 12, true, false);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🚀 2 BILLION MILES ACROSS SOLAR SYSTEM', cardX + 36, bar1Y + 28);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px "JetBrains Mono", monospace';
  ctx.fillText('3.0 HOURS FLAT', cardX + 36, bar1Y + 58);
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('✓ INSTANT', cardX + cardW - 36, bar1Y + 48);

  // VS Divider
  ctx.fillStyle = '#94a3b8';
  ctx.font = '900 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VS', W / 2, cardY + 162);

  // BAR 2: Contractor Callback Time (Red)
  const bar2Y = cardY + 180;
  ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  roundRect(ctx, cardX + 20, bar2Y, cardW - 40, 96, 12, true, true);

  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('⚠️ AVERAGE CONTRACTOR EMERGENCY CALLBACK', cardX + 36, bar2Y + 28);
  ctx.fillStyle = '#ef4444';
  ctx.font = '900 26px "JetBrains Mono", monospace';
  ctx.fillText('4.2 HOURS (OR NEVER)', cardX + 36, bar2Y + 60);
  ctx.fillStyle = '#fca5a5';
  ctx.font = '500 12px -apple-system, sans-serif';
  ctx.fillText('252 minutes of dead voicemail silence', cardX + 36, bar2Y + 82);

  // Impact Alert Box
  const alertY = cardY + 300;
  ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
  roundRect(ctx, cardX + 20, alertY, cardW - 40, 150, 14, true, false);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 20px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('THE HARSH REALITY:', W / 2, alertY + 38);

  ctx.fillStyle = '#fca5a5';
  ctx.font = '500 14px -apple-system, sans-serif';
  ctx.fillText('Space travel is faster than you calling', W / 2, alertY + 70);
  ctx.fillText('back an emergency lead.', W / 2, alertY + 92);

  ctx.fillStyle = '#c8ff00';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('THEY CALLED YOUR COMPETITOR.', W / 2, alertY + 126);
  ctx.restore();
}

// --- SCENE 4: 78% SPEED-TO-LEAD LAW (18.5s - 24.8s) ---
// Narration: "78% of homeowners hire the first business that answers the phone."
function renderTasklessScene4_Stat78Percent(t) {
  const p = Math.min(1, Math.max(0, (t - 18.5) / 6.3));
  drawCinematicBackground(ctx, TASKLESS_ASSETS.hud78, p, { overlayAlpha: 0.35, zoomSpeed: 0.07 });
  renderTasklessTopPill('⚡ THE SPEED-TO-LEAD LAW: 78% RULE');

  // Big Central Holographic 78% Gauge
  const cx = W / 2;
  const cy = 290;
  const r = 95;

  ctx.save();
  // Outer Track
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Animated Electric Cyber-Lime Arc
  const targetArc = 0.78 * Math.PI * 2;
  const curArc = targetArc * Math.min(1, p * 1.3);
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 14;
  ctx.shadowColor = '#c8ff00';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + curArc);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 78% Typography inside circle
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 78px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#c8ff00';
  ctx.shadowBlur = 18;
  ctx.fillText('78%', cx, cy + 28);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Headline Card
  const cardW = W - 60;
  const cardX = 30;
  const cardY = 425;
  const cardH = 240;
  drawGlassCard(ctx, cardX, cardY, cardW, cardH, {
    borderColor: '#c8ff00',
    glowColor: 'rgba(200, 255, 0, 0.35)',
    cornerColor: '#c8ff00'
  });

  ctx.save();
  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OF HOMEOWNERS HIRE', W / 2, cardY + 44);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.fillText('THE 1ST CONTRACTOR WHO ANSWERS', W / 2, cardY + 76);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 13.5px -apple-system, sans-serif';
  ctx.fillText('When you miss the call, they tap the next', W / 2, cardY + 120);
  ctx.fillText('contractor on Google in under 15 seconds.', W / 2, cardY + 142);

  // Alert Tag
  ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.2;
  roundRect(ctx, cardX + 24, cardY + 170, cardW - 48, 46, 10, true, true);

  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.fillText('EVERY DEAD VOICEMAIL = LOST $8,000 JOB', W / 2, cardY + 198);
  ctx.restore();
}

// --- SCENE 5: CONTRACTOR ON LADDER / $8,000 HANDED OVER (24.9s - 32.2s) ---
// Narration: "When you're on a ladder or eating dinner with family, every unanswered call is an $8,000 job handed to your competitor."
function renderTasklessScene5_TwoShopsComparison(t) {
  const p = Math.min(1, Math.max(0, (t - 24.9) / 7.3));
  drawCinematicBackground(ctx, TASKLESS_ASSETS.contractor, p, { overlayAlpha: 0.38, zoomSpeed: 0.08 });
  renderTasklessTopPill('📉 REVENUE LEAK AUDIT · -$8,000 / CALL');

  // Floating Emergency Missed Call Banner
  const cardW = W - 60;
  const cardX = 30;
  const cardY = 120;
  const cardH = 260;
  drawGlassCard(ctx, cardX, cardY, cardW, cardH, {
    borderColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    cornerColor: '#ef4444'
  });

  ctx.save();
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('INCOMING EMERGENCY CALL · UNANSWERED', cardX + 24, cardY + 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 28px "Space Grotesk", sans-serif';
  ctx.fillText('Emergency AC Install', cardX + 24, cardY + 76);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('Homeowner: "Water leaking ceiling, need quote ASAP"', cardX + 24, cardY + 104);

  // Revenue Lost Tag
  const lossY = cardY + 130;
  ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  roundRect(ctx, cardX + 20, lossY, cardW - 40, 96, 12, true, true);

  ctx.fillStyle = '#fca5a5';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('❌ SENT TO VOICEMAIL → CALLED COMPETITOR', cardX + 36, lossY + 28);

  ctx.fillStyle = '#ef4444';
  ctx.font = '900 36px "Space Grotesk", sans-serif';
  ctx.fillText('-$8,000 REVENUE', cardX + 36, lossY + 68);
  ctx.restore();

  // Bottom Reality Callout
  const botY = 420;
  const botH = 180;
  drawGlassCard(ctx, cardX, botY, cardW, botH, {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    glowColor: 'rgba(0, 0, 0, 0.5)'
  });

  ctx.save();
  ctx.fillStyle = '#c8ff00';
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('🪜 ON A LADDER OR WITH FAMILY?', W / 2, botY + 44);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 20px "Space Grotesk", sans-serif';
  ctx.fillText('You can\\'t answer in 0.8s manually.', W / 2, botY + 80);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 13.5px -apple-system, sans-serif';
  ctx.fillText('Every unanswered call goes straight to the', W / 2, botY + 115);
  ctx.fillText('next company on the Google Maps 3-Pack.', W / 2, botY + 138);
  ctx.restore();
}

// --- SCENE 6: MEET AVA VOICE AI (32.5s - 39.2s) ---
// Narration: "That's why we built Ava. She answers your shop's phone in 0.8 seconds and qualifies the caller."
function renderTasklessScene6_ShopB_AvaReply(t) {
  const p = Math.min(1, Math.max(0, (t - 32.5) / 6.7));
  renderDynamicAtmosphere(t);
  renderTasklessTopPill('🤖 MEET AVA · 0.8s AUTONOMOUS VOICE AI');

  // Center 3D Ava Avatar with Rotating Cyber Orbital Rings
  const avaW = 200;
  const avaH = 200;
  const avaX = (W - avaW) / 2;
  const avaY = 110;
  drawTasklessAvatar(ctx, TASKLESS_ASSETS.ava, avaX, avaY, avaW, avaH, {
    radius: 32,
    orbitalRings: true,
    rot: t * 1.2,
    borderColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowBlur: 28
  });

  // Animated Audio Spectrum directly beneath Ava
  drawAudioSpectrum(ctx, avaX - 20, avaY + avaH + 20, avaW + 40, 28, t, {
    color: '#38bdf8',
    color2: '#a855f7',
    bars: 24
  });

  // Telemetry Feature Card
  const cardW = W - 60;
  const cardX = 30;
  const cardY = 380;
  const cardH = 280;
  drawGlassCard(ctx, cardX, cardY, cardW, cardH, {
    borderColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    cornerColor: '#38bdf8'
  });

  ctx.save();
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('AVA VOICE AI · 24/7 AUTONOMOUS RECEPTIONIST', cardX + 24, cardY + 36);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px "Space Grotesk", sans-serif';
  ctx.fillText('0.8s RESPONSE', cardX + 24, cardY + 80);

  ctx.fillStyle = '#c8ff00';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.fillText('⚡ FASTER THAN A SINGLE PHONE RING', cardX + 24, cardY + 106);

  // 3 Checkmark bullets
  const bullets = [
    '✓ Answers instantly & qualifies emergency scope',
    '✓ Verifies customer address & water/HVAC issue',
    '✓ Quotes pricing guidelines & locks schedule'
  ];
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 13.5px -apple-system, sans-serif';
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillText(bullets[i], cardX + 24, cardY + 148 + i * 36);
  }
  ctx.restore();
}

// --- SCENE 7: INSTANT SCHEDULE & TECH DISPATCH (39.3s - 47.2s) ---
// Narration: "She checks your schedule and dispatches the job to your technician's phone before the customer can open another Google tab."
function renderTasklessScene7_WorkflowNodes(t) {
  const p = Math.min(1, Math.max(0, (t - 39.3) / 7.9));
  drawCinematicBackground(ctx, TASKLESS_ASSETS.tech, p, { overlayAlpha: 0.45, zoomSpeed: 0.08 });
  renderTasklessTopPill('📲 INSTANT SCHEDULE & TECH DISPATCH');

  // Dispatch Flow Card
  const cardW = W - 60;
  const cardX = 30;
  const cardY = 120;
  const cardH = 500;
  drawGlassCard(ctx, cardX, cardY, cardW, cardH, {
    borderColor: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    cornerColor: '#22c55e'
  });

  ctx.save();
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('AUTONOMOUS DISPATCH PIPELINE · 6.2s TOTAL', cardX + 24, cardY + 36);

  // Step 1: Calendar Sync
  const s1Y = cardY + 60;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  roundRect(ctx, cardX + 20, s1Y, cardW - 40, 80, 12, true, false);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('📅 STEP 1: GOOGLE CALENDAR SYNC', cardX + 36, s1Y + 28);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.fillText('Tomorrow 8:00 AM Slot Reserved ✓', cardX + 36, s1Y + 54);

  // Step 2: Push to Tech
  const s2Y = cardY + 155;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  roundRect(ctx, cardX + 20, s2Y, cardW - 40, 80, 12, true, false);
  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('📱 STEP 2: DISPATCH PUSH TO TECH CELL', cardX + 36, s2Y + 28);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.fillText('Work Order #4910 Sent to Tech Mike ✓', cardX + 36, s2Y + 54);

  // Step 3: Scope & Address
  const s3Y = cardY + 250;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  roundRect(ctx, cardX + 20, s3Y, cardW - 40, 80, 12, true, false);
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('📍 STEP 3: SCOPE & GPS ROUTE ATTACHED', cardX + 36, s3Y + 28);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.fillText('AC Condenser Leak · Est: $3,400 - $8,000 ✓', cardX + 36, s3Y + 54);

  // Bottom Speed Law
  const speedBoxY = cardY + 355;
  ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.2;
  roundRect(ctx, cardX + 20, speedBoxY, cardW - 40, 110, 12, true, true);

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 18px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BEFORE TAB CLOSE', W / 2, speedBoxY + 36);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('The homeowner never had time to open', W / 2, speedBoxY + 64);
  ctx.fillText('another tab or call a competitor.', W / 2, speedBoxY + 86);
  ctx.restore();
}

// --- SCENE 8: REVENUE LEAK SEALED DASHBOARD (47.5s - 53.0s) ---
// Narration: "Stop bleeding thousands on dead voicemails."
function renderTasklessScene8_TechDispatchAndDashboard(t) {
  const p = Math.min(1, Math.max(0, (t - 47.5) / 5.5));
  renderDynamicAtmosphere(t);
  renderTasklessTopPill('🛡️ REVENUE LEAK SEALED · +$44,800/MO');

  // Top Security Shield Bot Icon
  const botW = 140;
  const botH = 140;
  const botX = (W - botW) / 2;
  const botY = 110;
  drawTasklessAvatar(ctx, TASKLESS_ASSETS.bot, botX, botY, botW, botH, {
    radius: 24,
    borderColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowBlur: 22
  });

  // Main Recovered Revenue Dashboard Card
  const cardW = W - 60;
  const cardX = 30;
  const cardY = 270;
  const cardH = 360;
  drawGlassCard(ctx, cardX, cardY, cardW, cardH, {
    borderColor: '#c8ff00',
    glowColor: 'rgba(200, 255, 0, 0.35)',
    cornerColor: '#c8ff00'
  });

  ctx.save();
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('VANTORX AFTER-HOURS REVENUE AUDIT', cardX + 24, cardY + 36);

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 58px "Space Grotesk", sans-serif';
  ctx.shadowColor = '#c8ff00';
  ctx.shadowBlur = 18;
  ctx.fillText('+$44,800', cardX + 24, cardY + 102);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.fillText('MONTHLY RECOVERED REVENUE', cardX + 24, cardY + 130);

  // Metric Rows
  const rows = [
    { label: 'After-Hours Emergency Calls Captured', val: '14 Jobs / Mo' },
    { label: 'Average Ticket Value Closed', val: '$3,200' },
    { label: 'Voicemail Graveyard Defeated', val: '100% Capture' },
    { label: 'Software Setup Delay', val: 'Zero Changes' }
  ];

  ctx.font = '500 13px -apple-system, sans-serif';
  for (let i = 0; i < rows.length; i++) {
    const ry = cardY + 175 + i * 36;
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText(rows[i].label, cardX + 24, ry);
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'right';
    ctx.fillText(rows[i].val, cardX + cardW - 24, ry);
  }
  ctx.restore();
}

// --- SCENE 9: LIVE DEMO INTERACTIVE DIALER (53.1s - 58.5s) ---
// Narration: "Call the demo number on screen right now to hear Ava live..."
function renderTasklessScene9_LiveDemoDialer(t) {
  const p = Math.min(1, Math.max(0, (t - 53.1) / 5.4));
  drawCinematicBackground(ctx, TASKLESS_ASSETS.phone, p, { overlayAlpha: 0.45, zoomSpeed: 0.08 });
  renderTasklessTopPill('📞 LIVE 24/7 INTERACTIVE AI TEST LINE');

  const cardW = W - 60;
  const cardX = 30;
  const cardY = 120;
  const cardH = 500;
  drawGlassCard(ctx, cardX, cardY, cardW, cardH, {
    borderColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    cornerColor: '#38bdf8'
  });

  ctx.save();
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TEST AVA LIVE ON YOUR CELL RIGHT NOW', W / 2, cardY + 44);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 28px "Space Grotesk", sans-serif';
  ctx.fillText('DIAL AVA VOICE AI DEMO', W / 2, cardY + 86);

  // Phone Number Pill (Massive & Clickable Look)
  const numW = cardW - 40;
  const numH = 96;
  const numX = cardX + 20;
  const numY = cardY + 125;

  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 24;
  roundRect(ctx, numX, numY, numW, numH, 20, true, true);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px "JetBrains Mono", monospace';
  ctx.fillText('(561) 813-8602', W / 2, numY + 54);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('● ONLINE 24/7 · LIVE REAL-TIME DISPATCHER', W / 2, numY + 80);

  // Audio Equalizer Waveform inside dialer
  drawAudioSpectrum(ctx, numX + 20, cardY + 245, numW - 40, 36, t, {
    color: '#38bdf8',
    color2: '#c8ff00',
    bars: 28
  });

  // What Happens When You Call
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 13.5px -apple-system, sans-serif';
  ctx.fillText('Pick up your phone right now to hear Ava:', W / 2, cardY + 325);

  const bullets = [
    '• Answer in 0.8 seconds with realistic human cadence',
    '• Triage emergency AC, plumbing, or roofing requests',
    '• Dispatch a live simulated calendar appointment'
  ];
  ctx.textAlign = 'left';
  ctx.font = '400 12.5px -apple-system, sans-serif';
  ctx.fillStyle = '#94a3b8';
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillText(bullets[i], cardX + 36, cardY + 360 + i * 26);
  }

  ctx.fillStyle = '#c8ff00';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('FLORIDA DEDICATED DEMO LINE', W / 2, cardY + 460);
  ctx.restore();
}

// --- SCENE 10: TRYTASKLESS SIGNATURE CTA CARD (58.5s - 63.0s) ---
// Narration: "...or comment 'AVA' below for free instant access."
function renderTasklessScene10_TryTasklessCTA(t) {
  const p = Math.min(1, Math.max(0, (t - 58.5) / 4.5));
  renderDynamicAtmosphere(t);
  renderTasklessTopPill('⚡ GET INSTANT SETUP ACCESS');

  const cardW = W - 60;
  const cardX = 30;
  const cardY = 110;
  const cardH = 580;
  drawGlassCard(ctx, cardX, cardY, cardW, cardH, {
    borderColor: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.3)',
    cornerColor: '#38bdf8'
  });

  // Circular Badge with Neon Lightning Bolt
  const badgeR = 48;
  const badgeX = W / 2;
  const badgeY = cardY + 80;

  ctx.save();
  ctx.fillStyle = '#06030c';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡', badgeX, badgeY + 15);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.fillText('VantorX AI', W / 2, cardY + 172);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13.5px -apple-system, sans-serif';
  ctx.fillText('Autonomous Field Service Automations', W / 2, cardY + 198);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 40, cardY + 224);
  ctx.lineTo(cardX + cardW - 40, cardY + 224);
  ctx.stroke();

  const bullets = [
    '✓ Answers shop phone in 0.8 seconds 24/7',
    '✓ Instant text-back & emergency quote booking',
    '✓ Dispatches tech cell with full scope & address',
    '✓ Stops high-ticket leads slipping to competitors'
  ];
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillText(bullets[i], cardX + 36, cardY + 260 + i * 32);
  }

  // Giant High-Contrast White Action Button
  const btnW = cardW - 50;
  const btnH = 64;
  const btnX = cardX + 25;
  const btnY = cardY + 405;

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 22;
  roundRect(ctx, btnX, btnY, btnW, btnH, 32, true, false);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#06030c';
  ctx.font = '900 17px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('COMMENT "AVA" ON THIS REEL', W / 2, btnY + 39);

  ctx.fillStyle = '#c8ff00';
  ctx.font = '600 12.5px -apple-system, sans-serif';
  ctx.fillText('We\\'ll DM you the free instant setup blueprint.', W / 2, cardY + 500);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText('Or dial live demo → (561) 813-8602', W / 2, cardY + 535);
  ctx.restore();
}

// --- INITIAL HERO POSTER CARD ON PAUSE / LOAD (t === 0) ---
function renderStudioHeroPosterCard(storyType) {
  renderTasklessScene1_NightPhone(1.2);
}
`;

// Replace old Taskless scenes (from line 4271 to 5115)
const oldSceneRegex = /\/\/ --- SCENE 1: THE 11:04 PM BEDSIDE IPHONE HOOK[\s\S]*?function renderStudioHeroPosterCard\(storyType\) \{[\s\S]*?\}/;
if (oldSceneRegex.test(content)) {
  content = content.replace(oldSceneRegex, cinematicScenesCode.trim());
  console.log('✓ Successfully replaced all 10 scenes with Narration-Matched Cinematic Engine');
} else {
  console.warn('Could not match oldSceneRegex - checking fallback index search');
  const s1Idx = content.indexOf('function renderTasklessScene1_NightPhone');
  const heroEndIdx = content.indexOf('function renderKineticSubtitles');
  if (s1Idx !== -1 && heroEndIdx !== -1) {
    content = content.slice(0, s1Idx) + cinematicScenesCode.trim() + '\n\n' + content.slice(heroEndIdx);
    console.log('✓ Replaced scenes using index slicing!');
  } else {
    console.error('FAILED TO LOCATE TARGET SCENES REGION!');
    process.exit(1);
  }
}

// 3. UPGRADE KINETIC CAPTIONS WITH FROSTED BACKDROP PILL & MULTI-COLOR HIGHLIGHTS
const kineticCaptionsUpgraded = `
// --- TRYTASKLESS SIGNATURE KINETIC CAPTION SYSTEM (VIVID WORD-LEVEL POP) ---
function renderKineticSubtitles(time) {
  const cue = (SUBTITLES || []).find(c => time >= c.start && time < c.end);
  if (!cue) return;

  const text = cue.text;
  const words = text.split(/\\s+/);
  const duration = cue.end - cue.start;
  const progress = Math.min(1, Math.max(0, (time - cue.start) / duration));
  const activeWordIdx = Math.min(words.length - 1, Math.floor(progress * words.length));

  ctx.save();
  const pillW = Math.min(W - 40, 480);
  const pillH = 72;
  const pillX = (W - pillW) / 2;
  const pillY = H - 150;

  // Frosted Obsidian Pill Backdrop
  ctx.fillStyle = 'rgba(6, 3, 14, 0.9)';
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 18;
  roundRect(ctx, pillX, pillY, pillW, pillH, 18, true, true);
  ctx.shadowBlur = 0;

  // Compute 2-3 word window around active word for high retention
  const windowSize = 4;
  const startIdx = Math.max(0, Math.min(activeWordIdx - 1, words.length - windowSize));
  const displayWords = words.slice(startIdx, startIdx + windowSize);

  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';

  let fullStr = displayWords.join(' ').toUpperCase();
  // Highlight keywords
  const isKey = (w) => /186,000|MOON|THREE|TWO|BILLION|FASTER|78%|LADDER|DINNER|\\$8,000|AVA|0\\.8|SECONDS|DISPATCH|BLEEDING|DEMO|AVA|FREE/i.test(w);

  // Measure word positions
  const wordWidths = displayWords.map(w => ctx.measureText(w.toUpperCase() + ' ').width);
  const totalW = wordWidths.reduce((a, b) => a + b, 0);
  let curX = (W - totalW) / 2;

  displayWords.forEach((word, idx) => {
    const globalIdx = startIdx + idx;
    const isActive = globalIdx === activeWordIdx;
    const wText = word.toUpperCase();
    const wWidth = wordWidths[idx];

    ctx.save();
    if (isActive) {
      ctx.fillStyle = isKey(wText) ? '#c8ff00' : '#38bdf8';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 14;
      ctx.font = '900 24px "Space Grotesk", sans-serif';
    } else {
      ctx.fillStyle = isKey(wText) ? '#fde047' : '#f8fafc';
      ctx.font = '900 21px "Space Grotesk", sans-serif';
    }
    ctx.textAlign = 'left';
    ctx.fillText(wText, curX, pillY + 44);
    ctx.restore();

    curX += wWidth;
  });

  ctx.restore();
}
`;

const oldSubRegex = /\/\/ --- TRYTASKLESS SUBTITLE SYSTEM ---[\s\S]*?function renderKineticSubtitles\(time\) \{[\s\S]*?\n\}/;
if (oldSubRegex.test(content)) {
  content = content.replace(oldSubRegex, kineticCaptionsUpgraded.trim());
  console.log('✓ Successfully upgraded kinetic caption engine');
} else {
  console.warn('Could not match oldSubRegex');
}

fs.writeFileSync(targetHtml, content, 'utf8');
console.log('Successfully written updated reel-creator.html!');
