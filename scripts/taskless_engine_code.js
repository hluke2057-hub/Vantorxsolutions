// ============================================================================
// VANTORX VIRAL REEL ENGINE — 1:1 TASKLESS STUDIO VISUAL IDENTITY (EXTENDED HOOK)
// Pure black void, minimalist technical schematics, HUD metrics, clean kinetic typography
// ZERO STILL FRAMES: Continuous organic camera motion, ambient dust particles, dynamic kinematics
// ============================================================================

// Global polyfill for roundRect
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'undefined') r = 0;
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
    this.beginPath();
    this.moveTo(x + r.tl, y);
    this.lineTo(x + w - r.tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    this.lineTo(x + w, y + h - r.br);
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    this.lineTo(x + r.bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    this.lineTo(x, y + r.tl);
    this.quadraticCurveTo(x, y, x + r.tl, y);
    this.closePath();
    return this;
  };
}

// ----------------------------------------------------------------------------
// HUD OVERLAY: Minimalist Clean Technical Telemetry
// ----------------------------------------------------------------------------
function drawTasklessHUD(ctx, opts) {
  ctx.save();

  // Top Left Metric
  if (opts.topStat) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 44px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(opts.topStat, 40, 50);

    if (opts.topStatUnit) {
      const statW = ctx.measureText(opts.topStat).width;
      ctx.font = '600 20px "Space Grotesk", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(' ' + opts.topStatUnit, 40 + statW, 68);
    }

    let subY = 102;
    ctx.font = '700 12px "Inter", "JetBrains Mono", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    if (opts.topSub1) {
      ctx.fillText(opts.topSub1.toUpperCase(), 42, subY);
      subY += 17;
    }
    if (opts.topSub2) {
      ctx.fillText(opts.topSub2.toUpperCase(), 42, subY);
    }
  }

  // Top Right Context Label
  if (opts.rightLabel) {
    ctx.font = '700 12px "Inter", "JetBrains Mono", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(opts.rightLabel.toUpperCase(), W - 40, 56);
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// ZERO STILL FRAMES: Ambient Floating Particle Field (45 motes across canvas)
// ----------------------------------------------------------------------------
function drawAmbientDustParticles(ctx, t) {
  ctx.save();
  for (let i = 0; i < 45; i++) {
    const speedX = 14 + (i % 7) * 5;
    const speedY = (8 + (i % 5) * 4) * (i % 2 === 0 ? 1 : -0.7);
    const px = ((i * 127.3 + t * speedX) % (W + 60)) - 30;
    const py = ((i * 193.7 + t * speedY) % (H + 60)) - 30;
    const pSize = 1.0 + (i % 3) * 0.9;
    const pAlpha = 0.10 + 0.18 * Math.sin(t * 2.2 + i * 0.8);
    
    ctx.fillStyle = (i % 3 === 0) ? 'rgba(103, 232, 249, ' + pAlpha + ')' :
                    (i % 3 === 1) ? 'rgba(74, 222, 128, ' + pAlpha + ')' :
                                    'rgba(250, 204, 21, ' + (pAlpha * 0.8) + ')';
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 1 (0.0s - 7.2s): Laser Crowd Hook
// Crowd of 2D flat vector silhouettes pointing green lasers up into space
// Foreground arm with green laser pointer emitting vibrant pulsing beam
// ----------------------------------------------------------------------------
function renderTasklessScene1_LaserCrowd(t) {
  ctx.save();
  
  // Very subtle deep teal-to-black atmosphere gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#060d10');
  bg.addColorStop(0.5, '#0b1417');
  bg.addColorStop(1, '#020507');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // HUD
  drawTasklessHUD(ctx, {
    topStat: '186,000',
    topStatUnit: 'mi/s',
    topSub1: 'SPEED OF LIGHT IN VACUUM',
    topSub2: 'SCHEMATIC • 1 FRAME = 1 SEC',
    rightLabel: 'PHOTON VELOCITY'
  });

  // Background Crowd of Minimalist Vector People with subtle breathing/sway
  const crowdCount = 18;
  for (let i = 0; i < crowdCount; i++) {
    const sway = Math.sin(t * 2.5 + i * 0.8) * 3;
    const cx = 50 + (i % 6) * 85 + ((i * 17) % 30) + sway * 0.5;
    const cy = H - 280 - Math.floor(i / 6) * 70 + Math.sin(t * 3.0 + i) * 2;
    const depth = 0.5 + Math.floor(i / 6) * 0.22;
    const alpha = 0.18 + depth * 0.35;

    // Head
    ctx.fillStyle = 'rgba(203, 213, 225, ' + (alpha * 0.8) + ')';
    ctx.beginPath();
    ctx.arc(cx, cy - 22 * depth, 11 * depth, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = 'rgba(148, 163, 184, ' + alpha + ')';
    ctx.beginPath();
    ctx.roundRect(cx - 13 * depth, cy - 10 * depth, 26 * depth, 45 * depth, 4);
    ctx.fill();

    // Small laser pointer beams from crowd
    if (i % 3 === 0) {
      const beamJitter = Math.sin(t * 15 + i * 3) * 4;
      ctx.strokeStyle = 'rgba(74, 222, 128, ' + (alpha * 0.6) + ')';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx + 8 * depth, cy - 15 * depth);
      ctx.lineTo(cx + 80 + beamJitter, 0);
      ctx.stroke();
    }
  }

  // Foreground Giant Arm & Hand Holding Laser
  ctx.save();
  const armSway = Math.sin(t * 2.0) * 5;
  const handBaseX = W * 0.38 + armSway;
  const handBaseY = H * 0.44 + Math.cos(t * 1.8) * 3;

  // Arm reaching up from bottom-left
  ctx.fillStyle = '#b7835b'; // Warm skin tone
  ctx.beginPath();
  ctx.moveTo(W * 0.10, H);
  ctx.lineTo(W * 0.24, H);
  ctx.lineTo(handBaseX + 32, handBaseY + 60);
  ctx.lineTo(handBaseX - 32, handBaseY + 60);
  ctx.closePath();
  ctx.fill();

  // Hand Palm
  ctx.beginPath();
  ctx.roundRect(handBaseX - 35, handBaseY - 20, 70, 70, 16);
  ctx.fill();

  // 4 Fingers pointing up
  const fingerW = 12;
  const fingerH = 50;
  for (let f = 0; f < 4; f++) {
    const fx = handBaseX - 25 + f * 17;
    const fy = handBaseY - 20 - fingerH + (f === 1 ? -6 : f === 2 ? -4 : 0);
    ctx.beginPath();
    ctx.roundRect(fx, fy, fingerW, fingerH + 10, 6);
    ctx.fill();
  }

  // Laser Pointer Device in Hand
  const deviceX = handBaseX + 28;
  const deviceY = handBaseY - 50;
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(deviceX - 10, deviceY - 24, 20, 48, 6);
  ctx.fill();

  // Laser Emitter Glowing Dot
  const emitterX = deviceX;
  const emitterY = deviceY - 26;
  const glowPulse = 0.8 + 0.2 * Math.sin(t * 14);

  // Intense Emerald Glow Aura
  const emitterGlow = ctx.createRadialGradient(emitterX, emitterY, 2, emitterX, emitterY, 40 * glowPulse);
  emitterGlow.addColorStop(0, 'rgba(74, 222, 128, 1)');
  emitterGlow.addColorStop(0.3, 'rgba(34, 197, 94, 0.7)');
  emitterGlow.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = emitterGlow;
  ctx.beginPath();
  ctx.arc(emitterX, emitterY, 40 * glowPulse, 0, Math.PI * 2);
  ctx.fill();

  // Laser Beam shooting up-right towards top of screen
  const targetX = W * 0.84 + Math.sin(t * 6) * 6;
  const targetY = 0;

  // Outer Emerald Glow
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
  ctx.lineWidth = 16 + Math.sin(t * 16) * 4;
  ctx.moveTo(emitterX, emitterY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  // Mid Beam
  ctx.beginPath();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 6;
  ctx.moveTo(emitterX, emitterY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  // White Hot Beam Core
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.moveTo(emitterX, emitterY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  // Traveling Light Pulses along beam
  for (let p = 0; p < 4; p++) {
    const pulseProg = ((t * 2.8 + p * 0.25) % 1.0);
    const px = emitterX + (targetX - emitterX) * pulseProg;
    const py = emitterY + (targetY - emitterY) * pulseProg;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 2 (7.2s - 13.2s): Earth to Moon to Uranus Schematic
// Pure pitch black. Glowing vector Earth with rotating continents at bottom-left,
// Moon at 1.3s flash, cyan Uranus at top-right with continuous expanding sonar rings.
// ----------------------------------------------------------------------------
function renderTasklessScene2_EarthToUranus(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  // HUD
  drawTasklessHUD(ctx, {
    topStat: '≈3 HOURS',
    topSub1: 'ONE WAY • 1.8 BILLION MILES',
    topSub2: 'SCHEMATIC • SPEED OF LIGHT',
    rightLabel: 'EARTH ➔ URANUS'
  });

  const earthX = 90;
  const earthY = H - 260;
  const earthR = 44;

  const moonX = 175;
  const moonY = H - 330;
  const moonR = 14;

  const uranusX = W - 130;
  const uranusY = 230;
  const uranusR = 115;

  // Concentric Orbital Ring Waves around Uranus with continuous outward ripple
  ctx.save();
  const ringCount = 8;
  for (let r = 0; r < ringCount; r++) {
    const ripple = (t * 22 + r * 18) % 140;
    const radius = uranusR + 10 + ripple;
    const ringAlpha = Math.max(0, 0.22 * (1 - ripple / 140));
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(103, 232, 249, ' + ringAlpha + ')';
    ctx.lineWidth = 1.2;
    ctx.arc(uranusX, uranusY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Neon Green Laser Beam Corridor Linking Earth to Uranus
  const beamGrad = ctx.createLinearGradient(earthX, earthY, uranusX, uranusY);
  beamGrad.addColorStop(0, 'rgba(74, 222, 128, 0.9)');
  beamGrad.addColorStop(0.8, 'rgba(34, 197, 94, 0.7)');
  beamGrad.addColorStop(1, 'rgba(103, 232, 249, 0.9)');

  ctx.beginPath();
  ctx.strokeStyle = beamGrad;
  ctx.lineWidth = 6;
  ctx.shadowColor = 'rgba(74, 222, 128, 0.8)';
  ctx.shadowBlur = 18;
  ctx.moveTo(earthX, earthY);
  ctx.lineTo(uranusX, uranusY);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // White Hot Beam Core
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.moveTo(earthX, earthY);
  ctx.lineTo(uranusX, uranusY);
  ctx.stroke();

  // Continuous Traveling Light Pulse Packets (Continuous motion!)
  for (let p = 0; p < 5; p++) {
    const pulseLoop = ((t * 1.8 + p * 0.2) % 1.0);
    const px = earthX + (uranusX - earthX) * pulseLoop;
    const py = earthY + (uranusY - earthY) * pulseLoop;
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(103, 232, 249, 1)';
    ctx.shadowBlur = 14;
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Earth: Glowing blue sphere with rotating continents
  ctx.save();
  const earthGrad = ctx.createRadialGradient(earthX - 10, earthY - 10, 5, earthX, earthY, earthR);
  earthGrad.addColorStop(0, '#60a5fa');
  earthGrad.addColorStop(0.6, '#2563eb');
  earthGrad.addColorStop(1, '#1d4ed8');
  ctx.fillStyle = earthGrad;
  ctx.beginPath();
  ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
  ctx.fill();

  // Rotating longitude curves on Earth
  ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)';
  ctx.lineWidth = 1.5;
  for (let l = -2; l <= 2; l++) {
    const rotOffset = Math.sin(t * 1.2 + l * 0.6) * 16;
    ctx.beginPath();
    ctx.ellipse(earthX + rotOffset, earthY, Math.abs(rotOffset) + 6, earthR - 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.font = '700 13px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('EARTH', earthX, earthY + earthR + 24);
  ctx.restore();

  // Moon: 1.3s light speed landmark
  ctx.save();
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '700 11px "JetBrains Mono", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.textAlign = 'left';
  ctx.fillText('MOON (1.3s)', moonX + moonR + 8, moonY + 4);
  ctx.restore();

  // Uranus: Cyan gas giant with cloud bands
  ctx.save();
  const uranusGrad = ctx.createRadialGradient(uranusX - 35, uranusY - 35, 10, uranusX, uranusY, uranusR);
  uranusGrad.addColorStop(0, '#cffafe');
  uranusGrad.addColorStop(0.4, '#67e8f9');
  uranusGrad.addColorStop(0.8, '#06b6d4');
  uranusGrad.addColorStop(1, '#0891b2');
  ctx.fillStyle = uranusGrad;
  ctx.beginPath();
  ctx.arc(uranusX, uranusY, uranusR, 0, Math.PI * 2);
  ctx.fill();

  // Rotating atmospheric cloud stripes on Uranus
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2.0;
  for (let b = -3; b <= 3; b++) {
    const bandY = uranusY + b * 22 + Math.sin(t * 2.0 + b) * 3;
    const bandW = Math.sqrt(Math.max(0, uranusR * uranusR - Math.pow(bandY - uranusY, 2)));
    ctx.beginPath();
    ctx.moveTo(uranusX - bandW, bandY);
    ctx.lineTo(uranusX + bandW, bandY);
    ctx.stroke();
  }

  ctx.font = '800 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('URANUS', uranusX, uranusY + uranusR + 32);

  ctx.font = '600 13px "JetBrains Mono", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText('1.8 BILLION MILES (2.8 HRS)', uranusX, uranusY + uranusR + 52);
  ctx.restore();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 3 (13.2s - 17.5s): The Contrast Paradox — Space Speed vs Earth Contractor
// "Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead."
// Split comparison: Light crossing deep space in 3 hrs vs Contractor phone sitting dead 27+ hrs
// ----------------------------------------------------------------------------
function renderTasklessScene3_SpaceVsContractorContrast(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '9X SLOWER',
    topSub1: 'CONTRACTOR RESPONSE GAP',
    topSub2: 'SPEED OF LIGHT VS LOCAL TRADE',
    rightLabel: 'PARADOX AUDIT'
  });

  // Top Card: Interplanetary Light Speed
  const topCardY = 150;
  ctx.save();
  ctx.fillStyle = '#0b1318';
  ctx.roundRect(40, topCardY, W - 80, 160, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Top Card Header
  ctx.font = '700 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.textAlign = 'left';
  ctx.fillText('⚡ DEEP SPACE SPEED OF LIGHT', 60, topCardY + 30);

  ctx.font = '800 32px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('2.8 HOURS', 60, topCardY + 70);

  ctx.font = '600 14px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText('Crosses 1,800,000,000 miles to Uranus', 60, topCardY + 98);

  // Fast racing photon indicator inside card
  const pulseX = 60 + ((t * 220) % (W - 160));
  ctx.fillStyle = '#4ade80';
  ctx.shadowColor = '#4ade80';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(pulseX, topCardY + 130, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // Center VS Circle with pulsing shockwave
  const vsY = topCardY + 195;
  const vsPulse = 1.0 + Math.sin(t * 8) * 0.08;
  ctx.save();
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(W / 2, vsY, 26 * vsPulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.font = '900 18px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', W / 2, vsY);
  ctx.restore();

  // Bottom Card: Average Contractor Response
  const botCardY = vsY + 45;
  ctx.save();
  ctx.fillStyle = '#140c0e';
  ctx.roundRect(40, botCardY, W - 80, 250, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = '700 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('⏳ AVERAGE TRADE CONTRACTOR CALLBACK', 60, botCardY + 24);

  // Spinning analog clock + digital counter
  const clockX = 105;
  const clockY = botCardY + 120;
  const clockR = 48;

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(clockX, clockY, clockR, 0, Math.PI * 2);
  ctx.stroke();

  // Spinning clock hands (continuous rapid motion!)
  const secAngle = t * 18;
  const minAngle = t * 2.5;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.sin(secAngle) * 36, clockY - Math.cos(secAngle) * 36);
  ctx.stroke();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.sin(minAngle) * 26, clockY - Math.cos(minAngle) * 26);
  ctx.stroke();
  ctx.restore();

  // Big Stat Text
  ctx.font = '800 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  ctx.fillText('27.4 HOURS', clockX + clockR + 24, clockY - 32);

  ctx.font = '700 14px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText('To call back an emergency lead', clockX + clockR + 24, clockY + 6);

  ctx.font = '600 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText('⚠️ 9X SLOWER THAN LIGHT SPEED', clockX + clockR + 24, clockY + 30);

  // Spiderweb / Inactive warning at bottom
  ctx.font = '700 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.textAlign = 'center';
  ctx.fillText('By the time you reply, the lead is already gone.', W / 2, botCardY + 210);

  ctx.restore();
  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 4 (17.5s - 22.0s): Stick Figure Homeowner Emergency Dilemma
// A stick figure homeowner at home with a burst ceiling pipe pouring water!
// Water splashing into bucket, homeowner frantically dialing, call drops to voicemail.
// ----------------------------------------------------------------------------
function renderTasklessScene4_HomeownerEmergency(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: 'CRITICAL',
    topSub1: 'ACTIVE CEILING WATER LEAK',
    topSub2: 'RESIDENTIAL EMERGENCY',
    rightLabel: 'HOMEOWNER CALLING'
  });

  const ceilingY = 160;
  const floorY = H - 240;

  // Ceiling line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, ceilingY);
  ctx.lineTo(W - 40, ceilingY);
  ctx.stroke();

  // Cracked Pipe on Ceiling
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(80, ceilingY - 10);
  ctx.lineTo(240, ceilingY - 10);
  ctx.lineTo(240, ceilingY + 30);
  ctx.stroke();

  // Burst Crack with water spray
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  for (let s = 0; s < 5; s++) {
    const sprayAngle = Math.PI / 2 + Math.sin(t * 20 + s) * 0.4;
    const sprayLen = 25 + Math.sin(t * 15 + s * 2) * 12;
    ctx.beginPath();
    ctx.moveTo(240, ceilingY + 30);
    ctx.lineTo(240 + Math.cos(sprayAngle) * sprayLen, ceilingY + 30 + Math.sin(sprayAngle) * sprayLen);
    ctx.stroke();
  }

  // Water Droplets actively falling from ceiling to bucket
  ctx.fillStyle = '#38bdf8';
  for (let d = 0; d < 7; d++) {
    const dropProg = ((t * 2.8 + d * 0.16) % 1.0);
    const dropY = ceilingY + 35 + dropProg * (floorY - (ceilingY + 35));
    const dropX = 240 + Math.sin(dropProg * 6) * 4;
    ctx.beginPath();
    ctx.arc(dropX, dropY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bucket on Floor catching water
  const bucketX = 240;
  const bucketY = floorY;
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(bucketX - 30, bucketY);
  ctx.lineTo(bucketX - 22, bucketY - 45);
  ctx.lineTo(bucketX + 22, bucketY - 45);
  ctx.lineTo(bucketX + 30, bucketY);
  ctx.closePath();
  ctx.fill();

  // Water Splash Ripple in bucket
  const splashRipple = (t * 40) % 25;
  ctx.strokeStyle = 'rgba(56, 189, 248, ' + (1 - splashRipple / 25) + ')';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(bucketX, bucketY - 45, splashRipple, splashRipple * 0.4, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Floor line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, floorY);
  ctx.lineTo(W - 40, floorY);
  ctx.stroke();

  // Stick Figure Homeowner
  const humanX = 380 + Math.sin(t * 2.5) * 6;
  const humanY = floorY - 110;

  // Head
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.arc(humanX, humanY - 50, 18, 0, Math.PI * 2);
  ctx.fill();

  // Torso
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(humanX, humanY - 32);
  ctx.lineTo(humanX, humanY + 40);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(humanX, humanY + 40);
  ctx.lineTo(humanX - 18, floorY);
  ctx.moveTo(humanX, humanY + 40);
  ctx.lineTo(humanX + 18, floorY);
  ctx.stroke();

  // Left Arm holding phone to ear
  ctx.beginPath();
  ctx.moveTo(humanX, humanY - 15);
  ctx.lineTo(humanX - 18, humanY - 35);
  ctx.lineTo(humanX - 12, humanY - 48);
  ctx.stroke();

  // Phone in hand with red "NO ANSWER" alert
  const phoneX = humanX - 12;
  const phoneY = humanY - 48;
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(phoneX - 6, phoneY - 12, 12, 24, 3);
  ctx.fill();

  // Radiating soundwaves from phone
  for (let w = 1; w <= 3; w++) {
    const waveR = 12 + w * 10 + Math.sin(t * 12) * 4;
    ctx.strokeStyle = 'rgba(239, 68, 68, ' + (0.8 - w * 0.2) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(phoneX, phoneY, waveR, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
  }

  // Right Arm throwing hands up in frustration
  const armFrustrate = Math.sin(t * 6) * 10;
  ctx.beginPath();
  ctx.moveTo(humanX, humanY - 15);
  ctx.lineTo(humanX + 28, humanY - 35 + armFrustrate);
  ctx.stroke();

  // Floating Status Card: Call Dropped to Voicemail
  const callCardY = floorY + 30;
  ctx.fillStyle = '#181112';
  ctx.roundRect(40, callCardY, W - 80, 80, 14);
  ctx.fill();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = '800 16px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('📞 CALL SENT TO VOICEMAIL (CONTRACTOR #1)', W / 2, callCardY + 18);

  ctx.font = '700 13px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Homeowner immediately taps Contractor #2...', W / 2, callCardY + 44);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 5 (22.0s - 26.5s): The 78% Conversion Benchmark
// Giant bold 78% with sweeping gold sheen and 2-lane animated comparison
// ----------------------------------------------------------------------------
function renderTasklessScene5_Stat78Percent(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '78%',
    topSub1: 'WIN RATE OF 1ST RESPONDER',
    topSub2: 'SOURCE: LEAD RESPONSE AUDIT',
    rightLabel: 'LEAD CONVERSION'
  });

  const prog = Math.min(1.0, Math.max(0, (t - 22.0) / 1.0));
  const currentStat = Math.floor(prog * 78);

  // Giant Stat Center with Shimmering Sweep
  ctx.font = '900 120px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15'; // Amber gold
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(250, 204, 21, 0.5)';
  ctx.shadowBlur = 35 + Math.sin(t * 8) * 10;
  ctx.fillText(currentStat + '%', W / 2, H * 0.38);
  ctx.shadowBlur = 0;

  // Luminous highlight sweeping across text
  const sweepX = (W / 2 - 160) + ((t * 260) % 320);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.arc(sweepX, H * 0.38, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '700 20px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('BUY FROM THE FIRST RESPONDER', W / 2, H * 0.47);

  // Two Lane Comparison Graphic
  const laneY = H * 0.58;
  const laneW = W - 80;
  const laneX = 40;

  // Lane 1: First Responder (< 60s)
  ctx.beginPath();
  ctx.fillStyle = '#111319';
  ctx.roundRect(laneX, laneY, laneW, 64, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Green Progress Bar Fill with animated forward chevrons
  const barProg = Math.min(1.0, Math.max(0, (t - 22.5) / 1.2));
  ctx.beginPath();
  ctx.fillStyle = '#22c55e';
  ctx.roundRect(laneX + 4, laneY + 4, (laneW - 8) * 0.78 * barProg, 56, 8);
  ctx.fill();

  // Chevrons animated inside green bar
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2.5;
  for (let c = 0; c < 6; c++) {
    const chevX = laneX + 20 + c * 40 + ((t * 60) % 40);
    if (chevX < laneX + (laneW - 8) * 0.78 * barProg - 20) {
      ctx.beginPath();
      ctx.moveTo(chevX - 6, laneY + 22);
      ctx.lineTo(chevX, laneY + 32);
      ctx.lineTo(chevX - 6, laneY + 42);
      ctx.stroke();
    }
  }

  ctx.font = '800 16px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡ 1ST RESPONDER (<60s)', laneX + 18, laneY + 32);
  ctx.textAlign = 'right';
  ctx.fillText('CLOSED JOB • $8,000', laneX + laneW - 18, laneY + 32);

  // Lane 2: Hours Later (Voicemail)
  const lane2Y = laneY + 84;
  ctx.beginPath();
  ctx.fillStyle = '#111319';
  ctx.roundRect(laneX, lane2Y, laneW, 64, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
  ctx.roundRect(laneX + 4, lane2Y + 4, (laneW - 8) * 0.22, 56, 8);
  ctx.fill();

  ctx.font = '800 16px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('⏳ CALLED BACK 3 HRS LATER', laneX + 18, lane2Y + 32);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ef4444';
  ctx.fillText('LOST TO COMPETITOR', laneX + laneW - 18, lane2Y + 32);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 6 (26.5s - 34.0s): Bob on 20ft Ladder & The Competitor Cash Snatch
// "When you're on a ladder or eating dinner with family, every unanswered call is an $8,000 job handed to your competitor."
// Bob on ladder turning wrench, sweating, pocket phone buzzing.
// 60s timer expires -> Competitor truck zooms across bottom -> $8,000 cash packet flies into truck bed!
// ----------------------------------------------------------------------------
function renderTasklessScene6_ContractorPainLadder(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '8,000',
    topStatUnit: 'USD',
    topSub1: 'AVERAGE HVAC/PLUMBING TICKET',
    rightLabel: 'REVENUE AT RISK'
  });

  const streetY = H - 180;
  const ladderBaseX = 140;
  const ladderTopX = 175 + Math.sin(t * 2.0) * 2; // subtle ladder sway
  const ladderTopY = 280;

  // The 20ft Extension Ladder (Aluminum side rails & rungs)
  ctx.save();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4;

  // Left rail
  ctx.beginPath();
  ctx.moveTo(ladderBaseX - 16, streetY);
  ctx.lineTo(ladderTopX - 16, ladderTopY);
  ctx.stroke();

  // Right rail
  ctx.beginPath();
  ctx.moveTo(ladderBaseX + 16, streetY);
  ctx.lineTo(ladderTopX + 16, ladderTopY);
  ctx.stroke();

  // Rungs
  const rungCount = 12;
  ctx.lineWidth = 2.5;
  for (let r = 0; r <= rungCount; r++) {
    const frac = r / rungCount;
    const rx1 = (ladderBaseX - 16) + (ladderTopX - ladderBaseX) * frac;
    const ry = streetY + (ladderTopY - streetY) * frac;
    const rx2 = rx1 + 32;
    ctx.beginPath();
    ctx.moveTo(rx1, ry);
    ctx.lineTo(rx2, ry);
    ctx.stroke();
  }
  ctx.restore();

  // Overhead Industrial Pipe Bob is repairing
  ctx.save();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(60, ladderTopY - 30);
  ctx.lineTo(320, ladderTopY - 30);
  ctx.stroke();

  // Water leaking from pipe joint
  ctx.fillStyle = '#38bdf8';
  for (let w = 0; w < 3; w++) {
    const dripY = (ladderTopY - 20) + ((t * 140 + w * 40) % 110);
    ctx.beginPath();
    ctx.arc(210, dripY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Stick Figure Contractor Bob high on ladder
  const bobX = ladderTopX;
  const bobY = ladderTopY + 45;
  const bobBreath = Math.sin(t * 4.0) * 2.5;

  ctx.save();
  // Bob Torso with Orange Safety Vest
  ctx.strokeStyle = '#f97316'; // High-vis orange vest
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(bobX, bobY);
  ctx.lineTo(bobX, bobY + 55);
  ctx.stroke();

  // Reflective Silver Stripe on Vest
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(bobX - 6, bobY + 28);
  ctx.lineTo(bobX + 6, bobY + 28);
  ctx.stroke();

  // Bob Head
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(bobX, bobY - 20 + bobBreath, 16, 0, Math.PI * 2);
  ctx.fill();

  // Yellow Construction Hard Hat
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(bobX, bobY - 24 + bobBreath, 19, Math.PI, Math.PI * 2);
  ctx.fill();
  // Hard hat brim
  ctx.beginPath();
  ctx.roundRect(bobX - 22, bobY - 24 + bobBreath, 44, 6, 2);
  ctx.fill();

  // Sweat Droplets flying from Bob's forehead (continuous struggle!)
  ctx.fillStyle = '#38bdf8';
  for (let sw = 0; sw < 3; sw++) {
    const swY = (bobY - 18) + ((t * 120 + sw * 35) % 65);
    const swX = bobX + 18 + sw * 5;
    ctx.beginPath();
    ctx.arc(swX, swY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bob Legs planted on ladder rungs
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(bobX, bobY + 55);
  ctx.lineTo(bobX - 14, bobY + 105);
  ctx.moveTo(bobX, bobY + 55);
  ctx.lineTo(bobX + 14, bobY + 105);
  ctx.stroke();

  // Right Arm holding wrench to pipe
  const wrenchAngle = Math.sin(t * 3.5) * 0.25;
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(bobX + 4, bobY + 10);
  ctx.lineTo(bobX + 32, bobY - 15);
  ctx.stroke();

  // Wrench tool
  ctx.save();
  ctx.translate(bobX + 32, bobY - 15);
  ctx.rotate(wrenchAngle);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(20, -18);
  ctx.stroke();
  ctx.restore();

  // Left Arm balancing on ladder rail
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(bobX - 4, bobY + 10);
  ctx.lineTo(ladderTopX - 16, bobY + 25);
  ctx.stroke();

  // Bob's Pocket Phone: FURIOUS VIBRATION
  const phoneVibeX = bobX - 8 + Math.sin(t * 50) * 3.5;
  const phoneVibeY = bobY + 40;
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.roundRect(phoneVibeX - 5, phoneVibeY - 10, 10, 20, 2);
  ctx.fill();

  // Radiating vibrating rings from pocket
  for (let vr = 1; vr <= 3; vr++) {
    const vrRadius = 8 + vr * 10 + Math.sin(t * 16) * 4;
    ctx.strokeStyle = 'rgba(74, 222, 128, ' + (0.7 - vr * 0.18) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(phoneVibeX, phoneVibeY, vrRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Floating Incoming Lead Card above Bob
  const leadCardX = W - 250;
  const leadCardY = 240;
  ctx.save();
  ctx.fillStyle = '#111318';
  ctx.roundRect(leadCardX, leadCardY, 210, 105, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = '700 11px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'left';
  ctx.fillText('⚠️ INCOMING EMERGENCY JOB', leadCardX + 12, leadCardY + 22);

  ctx.font = '800 20px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('$8,000.00', leadCardX + 12, leadCardY + 52);

  // Expiring countdown bar
  const countdownProg = Math.max(0, 1 - (t - 26.5) / 4.0);
  ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
  ctx.roundRect(leadCardX + 12, leadCardY + 68, 186, 8, 4);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.roundRect(leadCardX + 12, leadCardY + 68, 186 * countdownProg, 8, 4);
  ctx.fill();

  ctx.font = '600 11px "Inter", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText(countdownProg > 0 ? 'RINGING... CANNOT REACH PHONE' : '❌ CALL MISSED • LOST', leadCardX + 12, leadCardY + 94);
  ctx.restore();

  // Street Level Line at bottom
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, streetY);
  ctx.lineTo(W - 20, streetY);
  ctx.stroke();

  // Competitor Truck driving across bottom (appears at t >= 28.5)
  const truckStartT = 28.5;
  const truckProg = Math.min(1.2, Math.max(0, (t - truckStartT) / 5.0));
  const truckX = -200 + truckProg * (W + 350);
  const truckY = streetY - 55;

  ctx.save();
  // Truck Body / Cab
  ctx.fillStyle = '#1e293b';
  ctx.roundRect(truckX, truckY, 140, 50, 6);
  ctx.fill();

  // Truck Bed
  ctx.fillStyle = '#334155';
  ctx.roundRect(truckX + 80, truckY - 15, 75, 65, 4);
  ctx.fill();

  // Competitor Decal on Door
  ctx.font = '700 9px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.fillText('COMPETITOR TRUCK', truckX + 8, truckY + 28);

  // Rotating Truck Wheels
  const wheelRotate = t * 20;
  for (let w = 0; w < 2; w++) {
    const wx = truckX + 30 + w * 95;
    const wy = streetY;
    ctx.save();
    ctx.translate(wx, wy);
    ctx.rotate(wheelRotate);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.stroke();
    // Wheel Spokes
    ctx.beginPath();
    ctx.moveTo(-16, 0); ctx.lineTo(16, 0);
    ctx.moveTo(0, -16); ctx.lineTo(0, 16);
    ctx.stroke();
    ctx.restore();
  }

  // Exhaust Smoke Puffs from Truck
  ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
  for (let sm = 0; sm < 4; sm++) {
    const smX = truckX - 10 - sm * 18 - ((t * 40) % 20);
    const smY = streetY - 18 - sm * 4;
    const smR = 8 + sm * 4;
    ctx.beginPath();
    ctx.arc(smX, smY, smR, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // The $8,000 Flying Cash Bag (flies in arc from Bob to truck at t >= 29.5)
  if (t >= 29.5) {
    const cashProg = Math.min(1.0, (t - 29.5) / 2.8);
    const cashStartX = bobX;
    const cashStartY = bobY + 40;
    const cashEndX = truckX + 110;
    const cashEndY = streetY - 25;

    // Parabolic arc path
    const curCashX = cashStartX + (cashEndX - cashStartX) * cashProg;
    const arcHeight = 120 * Math.sin(cashProg * Math.PI);
    const curCashY = cashStartY + (cashEndY - cashStartY) * cashProg - arcHeight;

    ctx.save();
    ctx.translate(curCashX, curCashY);
    ctx.rotate(Math.sin(t * 12) * 0.3);

    // Glowing Green Money Bag / Cash Packet
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.roundRect(-24, -16, 48, 32, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = '900 16px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$8K', 0, 0);

    // Sparkle particles trailing behind flying money
    ctx.fillStyle = '#facc15';
    for (let sp = 0; sp < 4; sp++) {
      const spX = -28 - sp * 14;
      const spY = Math.sin(t * 15 + sp) * 8;
      ctx.beginPath();
      ctx.arc(spX, spY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Red Bleed Alert Banner
    const alertY = H - 90;
    ctx.save();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.roundRect(40, alertY, W - 80, 55, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '800 15px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚠️ -$8,000.00 REVENUE HANDED TO COMPETITOR', W / 2, alertY + 27);
    ctx.restore();
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 7 (34.0s - 43.0s): Ava Instant 0.8s Response & Autonomous Dispatch
// "That's why we built Ava. She answers your shop's phone in 0.8 seconds and qualifies the caller..."
// Sleek cybernetic transformation! 32-band dancing audio waveform, instant dispatch notification.
// ----------------------------------------------------------------------------
function renderTasklessScene7_AvaInstantReply(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '0.8s',
    topStatUnit: 'SPEED',
    topSub1: 'AVA 24/7 AUTONOMOUS VOICE AI',
    topSub2: 'ZERO MISSED CALLS • INSTANT DISPATCH',
    rightLabel: 'SYSTEM ACTIVATED'
  });

  // Center Holographic Ava AI Orb
  const orbX = W / 2;
  const orbY = H * 0.32;
  const orbR = 75;

  ctx.save();
  // Concentric rotating telemetry rings around Ava Orb
  for (let r = 1; r <= 3; r++) {
    const ringRadius = orbR + r * 22;
    const ringAngle = (t * (0.8 / r)) % (Math.PI * 2);
    ctx.save();
    ctx.translate(orbX, orbY);
    ctx.rotate(ringAngle);
    ctx.strokeStyle = (r === 1) ? 'rgba(34, 197, 94, 0.4)' : 'rgba(103, 232, 249, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([12, 16]);
    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Glowing Core Gradient
  const coreGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, orbR);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.3, '#34d399');
  coreGrad.addColorStop(0.7, '#059669');
  coreGrad.addColorStop(1, 'rgba(5, 150, 105, 0.1)');
  ctx.fillStyle = coreGrad;
  ctx.shadowColor = 'rgba(52, 211, 153, 0.8)';
  ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Center Ava AI Symbol
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AVA', orbX, orbY);
  ctx.restore();

  // 32-Band Reactive Dancing Audio Waveform
  const waveY = H * 0.48;
  const waveW = W - 100;
  const waveX = 50;
  const barCount = 32;
  const barW = (waveW / barCount) - 4;

  ctx.save();
  for (let b = 0; b < barCount; b++) {
    const bx = waveX + b * (barW + 4);
    const waveFreq = Math.abs(Math.sin(t * 12 + b * 0.4) * Math.cos(t * 7 + b * 0.2));
    const barH = 10 + waveFreq * 55;

    const barGrad = ctx.createLinearGradient(bx, waveY - barH / 2, bx, waveY + barH / 2);
    barGrad.addColorStop(0, '#67e8f9');
    barGrad.addColorStop(0.5, '#34d399');
    barGrad.addColorStop(1, '#059669');
    ctx.fillStyle = barGrad;

    ctx.beginPath();
    ctx.roundRect(bx, waveY - barH / 2, barW, barH, 3);
    ctx.fill();
  }
  ctx.restore();

  // Dark Dispatch Notification Card sliding in from bottom
  const cardProg = Math.min(1.0, (t - 34.0) / 0.8);
  const cardY = H * 0.56 + (1 - cardProg) * 40;
  const cardW = W - 80;
  const cardH = 220;

  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.roundRect(40, cardY, cardW, cardH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'rgba(52, 211, 153, 0.2)';
  ctx.shadowBlur = 20;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Dispatch Items
  const items = [
    { icon: '⚡', title: 'CALL ANSWERED IN 0.8 SECONDS', sub: 'Zero hold time • Caller qualified', color: '#34d399' },
    { icon: '📅', title: 'SCHEDULE AUDITED & BOOKED', sub: 'Today @ 2:30 PM • Slot locked in CRM', color: '#67e8f9' },
    { icon: '📲', title: 'DISPATCH SMS SENT TO TECH 1', sub: 'Bob received client notes & map link', color: '#facc15' }
  ];

  items.forEach((item, idx) => {
    const itemY = cardY + 22 + idx * 62;
    // Status Icon
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(item.icon, 58, itemY);

    // Title
    ctx.font = '800 14px "Space Grotesk", sans-serif';
    ctx.fillStyle = item.color;
    ctx.fillText(item.title, 88, itemY + 2);

    // Subtitle
    ctx.font = '600 12px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fillText(item.sub, 88, itemY + 22);
  });
  ctx.restore();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 8 (43.0s - 51.5s): Revenue Protection Waterfall
// "Stop bleeding thousands on dead voicemails."
// Dynamic financial schematic: +$80,000 / mo retained revenue waterfall
// ----------------------------------------------------------------------------
function renderTasklessScene8_RevenueWaterfall(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '+$80,000',
    topStatUnit: 'MO',
    topSub1: 'PROTECTED REVENUE CAPTURE',
    topSub2: '10 SAVED HIGH-TICKET JOBS',
    rightLabel: 'FINANCIAL SCHEMATIC'
  });

  // Animated Cascading Green Dollar Particles
  ctx.save();
  ctx.fillStyle = '#22c55e';
  for (let d = 0; d < 30; d++) {
    const dx = 50 + (d * 17) % (W - 100);
    const dy = 160 + ((t * 180 + d * 45) % (H - 320));
    const dAlpha = 0.2 + 0.6 * Math.sin(t * 3 + d);
    ctx.fillStyle = 'rgba(34, 197, 94, ' + dAlpha + ')';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.fillText('$', dx, dy);
  }
  ctx.restore();

  // Giant Retention Metric Center
  const countProg = Math.min(1.0, (t - 43.0) / 1.5);
  const currentDollars = Math.floor(countProg * 80000);

  ctx.font = '900 68px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#22c55e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(34, 197, 94, 0.5)';
  ctx.shadowBlur = 30;
  ctx.fillText('+$' + currentDollars.toLocaleString(), W / 2, H * 0.40);
  ctx.shadowBlur = 0;

  ctx.font = '700 18px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('NET REVENUE RETAINED / MONTH', W / 2, H * 0.47);

  // ROI Telemetry Box
  const boxY = H * 0.54;
  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.roundRect(40, boxY, W - 80, 180, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const metrics = [
    { label: 'AVERAGE HVAC/PLUMBING TICKET', val: '$8,000.00' },
    { label: 'MISSED CALLS CONVERTED / MO', val: '10 JOBS' },
    { label: 'DISPATCH LAG TIME', val: '0.8 SECONDS' }
  ];

  metrics.forEach((m, idx) => {
    const my = boxY + 28 + idx * 48;
    ctx.font = '700 12px "JetBrains Mono", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'left';
    ctx.fillText(m.label, 60, my);

    ctx.font = '800 16px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(m.val, W - 60, my);
  });
  ctx.restore();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 9 (51.5s - 56.5s): Live Interactive Demo Dialer
// "Call the demo number on screen right now to hear Ava live..."
// Pulsing emerald phone dialer with expanding radiant sonar rings
// ----------------------------------------------------------------------------
function renderTasklessScene9_LiveDialerInteractive(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: 'LIVE DEMO',
    topSub1: '24/7 INTERACTIVE DIALER',
    topSub2: 'CALL AVA RIGHT NOW ON SCREEN',
    rightLabel: 'TEST AVA LIVE'
  });

  // Center Call Button with Radiant Expanding Rings
  const btnX = W / 2;
  const btnY = H * 0.42;
  const btnR = 90;

  // Concentric radiant rings expanding continuously
  for (let r = 0; r < 4; r++) {
    const ringLoop = ((t * 45 + r * 30) % 130);
    const ringAlpha = Math.max(0, 0.5 * (1 - ringLoop / 130));
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(34, 197, 94, ' + ringAlpha + ')';
    ctx.lineWidth = 2.0;
    ctx.arc(btnX, btnY, btnR + ringLoop, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Giant Emerald Dialer Button
  const btnGrad = ctx.createRadialGradient(btnX - 25, btnY - 25, 10, btnX, btnY, btnR);
  btnGrad.addColorStop(0, '#4ade80');
  btnGrad.addColorStop(0.7, '#22c55e');
  btnGrad.addColorStop(1, '#15803d');
  ctx.fillStyle = btnGrad;
  ctx.shadowColor = 'rgba(34, 197, 94, 0.7)';
  ctx.shadowBlur = 40;
  ctx.beginPath();
  ctx.arc(btnX, btnY, btnR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Phone Icon (Rocking gently)
  ctx.save();
  ctx.translate(btnX, btnY - 10);
  ctx.rotate(Math.sin(t * 8) * 0.12);
  ctx.font = '54px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📞', 0, 0);
  ctx.restore();

  ctx.font = '800 18px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('TAP TO DIAL', btnX, btnY + 45);

  // Phone Number Banner
  const numCardY = H * 0.62;
  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.roundRect(40, numCardY, W - 80, 110, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = '900 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('(561) 813-8602', W / 2, numCardY + 22);

  ctx.font = '700 13px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('• READY • AVA ANSWERS IN 0.8s', W / 2, numCardY + 72);
  ctx.restore();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 10 (56.5s - 63.0s): The Taskless End Card
// "...or comment 'AVA' below for free instant access."
// Giant bold COMMENT "AVA" banner with pulsing golden border and bouncing arrows
// ----------------------------------------------------------------------------
function renderTasklessScene10_TasklessEndCard(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: 'FREE DEMO',
    topSub1: 'DIRECT RESPONSE ACCESS',
    topSub2: 'AUTOMATED DIRECT MESSAGE',
    rightLabel: 'VANTORX.COM'
  });

  // Giant Comment Banner with Pulsing Golden Border
  const bannerY = H * 0.36;
  const borderPulse = 0.5 + 0.5 * Math.sin(t * 8);

  ctx.save();
  ctx.fillStyle = '#17140b';
  ctx.roundRect(40, bannerY, W - 80, 140, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(250, 204, 21, ' + (0.5 + borderPulse * 0.5) + ')';
  ctx.lineWidth = 3;
  ctx.shadowColor = 'rgba(250, 204, 21, 0.4)';
  ctx.shadowBlur = 25;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.font = '700 14px "JetBrains Mono", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('DROP A COMMENT BELOW', W / 2, bannerY + 24);

  // Giant Golden Word
  ctx.font = '900 52px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = 'rgba(250, 204, 21, 0.6)';
  ctx.shadowBlur = 20;
  ctx.fillText('COMMENT "AVA"', W / 2, bannerY + 54);
  ctx.shadowBlur = 0;

  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('We will instantly DM you the interactive link', W / 2, bannerY + 112);
  ctx.restore();

  // Bouncing Golden Chevron Arrows pointing downward
  const arrowY = bannerY + 185;
  const arrowBounce = Math.sin(t * 7) * 8;
  ctx.save();
  ctx.fillStyle = '#facc15';
  ctx.font = '40px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⬇️', W / 2, arrowY + arrowBounce);
  ctx.restore();

  // Official Brand Seal
  ctx.font = '800 20px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('VANTORX AUTOMATION', W / 2, H - 160);

  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('Speed to Lead AI Engine • Built for Trade Contractors', W / 2, H - 132);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// KINETIC CAPTIONS — HORMOZI / TASKLESS STYLE TYPOGRAPHY
// Active spoken word highlighted in vivid amber gold (#facc15) with dynamic spring bounce
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// PRECISE KINETIC CAPTIONS — EXACT AUDIO WORD ALIGNED (NO RUBBER BAND JITTER)
// ----------------------------------------------------------------------------
const CAPTION_CHUNKS = [{"id":1,"start":0,"end":0.917,"text":"A single beam","words":[{"word":"A","rawWord":"A","start":0,"end":0.081},{"word":"single","rawWord":"single","start":0.163,"end":0.546},{"word":"beam","rawWord":"beam","start":0.604,"end":0.859}]},{"id":2,"start":0.917,"end":1.73,"text":"of laser light","words":[{"word":"of","rawWord":"of","start":0.917,"end":0.975},{"word":"laser","rawWord":"laser","start":1.068,"end":1.405},{"word":"light","rawWord":"light","start":1.463,"end":1.695}]},{"id":3,"start":1.73,"end":4.029,"text":"travels at 186,000","words":[{"word":"travels","rawWord":"travels","start":1.73,"end":2.136},{"word":"at","rawWord":"at","start":2.171,"end":2.241},{"word":"186000","rawWord":"186,000","start":2.31,"end":3.959}]},{"id":4,"start":4.029,"end":5.397,"text":"miles per second.","words":[{"word":"miles","rawWord":"miles","start":4.029,"end":4.4},{"word":"per","rawWord":"per","start":4.47,"end":4.574},{"word":"second","rawWord":"second.","start":4.621,"end":5.097}]},{"id":5,"start":5.538,"end":6.084,"text":"It can reach","words":[{"word":"It","rawWord":"It","start":5.538,"end":5.654},{"word":"can","rawWord":"can","start":5.689,"end":5.793},{"word":"reach","rawWord":"reach","start":5.84,"end":6.026}]},{"id":6,"start":6.084,"end":6.641,"text":"the moon in","words":[{"word":"the","rawWord":"the","start":6.084,"end":6.153},{"word":"moon","rawWord":"moon","start":6.2,"end":6.455},{"word":"in","rawWord":"in","start":6.513,"end":6.583}]},{"id":7,"start":6.641,"end":7.883,"text":"under three seconds,","words":[{"word":"under","rawWord":"under","start":6.641,"end":6.838},{"word":"three","rawWord":"three","start":6.896,"end":7.14},{"word":"seconds","rawWord":"seconds,","start":7.198,"end":7.709}]},{"id":8,"start":7.883,"end":8.707,"text":"and cross nearly","words":[{"word":"and","rawWord":"and","start":7.883,"end":8.022},{"word":"cross","rawWord":"cross","start":8.069,"end":8.336},{"word":"nearly","rawWord":"nearly","start":8.394,"end":8.649}]},{"id":9,"start":8.707,"end":10.008,"text":"two billion miles","words":[{"word":"two","rawWord":"two","start":8.707,"end":8.916},{"word":"billion","rawWord":"billion","start":9.067,"end":9.509},{"word":"miles","rawWord":"miles","start":9.567,"end":9.961}]},{"id":10,"start":10.008,"end":10.89,"text":"of deep space","words":[{"word":"of","rawWord":"of","start":10.008,"end":10.066},{"word":"deep","rawWord":"deep","start":10.136,"end":10.356},{"word":"space","rawWord":"space","start":10.426,"end":10.844}]},{"id":11,"start":10.89,"end":11.517,"text":"in less than","words":[{"word":"in","rawWord":"in","start":10.89,"end":10.96},{"word":"less","rawWord":"less","start":11.03,"end":11.215},{"word":"than","rawWord":"than","start":11.262,"end":11.424}]},{"id":12,"start":11.517,"end":12.967,"text":"three hours.","words":[{"word":"three","rawWord":"three","start":11.517,"end":11.854},{"word":"hours","rawWord":"hours.","start":11.912,"end":12.667}]},{"id":13,"start":13.27,"end":14.71,"text":"Yet that interplanetary","words":[{"word":"Yet","rawWord":"Yet","start":13.27,"end":13.444},{"word":"that","rawWord":"that","start":13.491,"end":13.677},{"word":"interplanetary","rawWord":"interplanetary","start":13.746,"end":14.64}]},{"id":14,"start":14.71,"end":15.523,"text":"space trip is","words":[{"word":"space","rawWord":"space","start":14.71,"end":15.047},{"word":"trip","rawWord":"trip","start":15.081,"end":15.29},{"word":"is","rawWord":"is","start":15.36,"end":15.453}]},{"id":15,"start":15.523,"end":16.742,"text":"STILL faster than","words":[{"word":"STILL","rawWord":"STILL","start":15.523,"end":15.917},{"word":"faster","rawWord":"faster","start":16.033,"end":16.521},{"word":"than","rawWord":"than","start":16.579,"end":16.707}]},{"id":16,"start":16.742,"end":18.379,"text":"the average contractor","words":[{"word":"the","rawWord":"the","start":16.742,"end":16.811},{"word":"average","rawWord":"average","start":16.893,"end":17.311},{"word":"contractor","rawWord":"contractor","start":17.357,"end":18.1}]},{"id":17,"start":18.379,"end":19.18,"text":"calls back an","words":[{"word":"calls","rawWord":"calls","start":18.379,"end":18.692},{"word":"back","rawWord":"back","start":18.762,"end":19.006},{"word":"an","rawWord":"an","start":19.064,"end":19.133}]},{"id":18,"start":19.18,"end":20.594,"text":"emergency lead.","words":[{"word":"emergency","rawWord":"emergency","start":19.18,"end":19.737},{"word":"lead","rawWord":"lead.","start":19.807,"end":20.294}]},{"id":19,"start":21.246,"end":23.15,"text":"78% of homeowners","words":[{"word":"78%","rawWord":"78%","start":21.246,"end":22.361},{"word":"of","rawWord":"of","start":22.477,"end":22.523},{"word":"homeowners","rawWord":"homeowners","start":22.581,"end":23.092}]},{"id":20,"start":23.15,"end":23.94,"text":"hire the first","words":[{"word":"hire","rawWord":"hire","start":23.15,"end":23.406},{"word":"the","rawWord":"the","start":23.441,"end":23.51},{"word":"first","rawWord":"first","start":23.568,"end":23.87}]},{"id":21,"start":23.94,"end":24.996,"text":"business that answers","words":[{"word":"business","rawWord":"business","start":23.94,"end":24.358},{"word":"that","rawWord":"that","start":24.393,"end":24.532},{"word":"answers","rawWord":"answers","start":24.59,"end":24.95}]},{"id":22,"start":24.996,"end":25.993,"text":"the phone.","words":[{"word":"the","rawWord":"the","start":24.996,"end":25.066},{"word":"phone","rawWord":"phone.","start":25.112,"end":25.693}]},{"id":23,"start":26.204,"end":26.726,"text":"When you are","words":[{"word":"When","rawWord":"When","start":26.204,"end":26.378},{"word":"you","rawWord":"you","start":26.413,"end":26.494},{"word":"are","rawWord":"are","start":26.552,"end":26.68}]},{"id":24,"start":26.726,"end":27.492,"text":"on a ladder,","words":[{"word":"on","rawWord":"on","start":26.726,"end":26.819},{"word":"a","rawWord":"a","start":26.866,"end":26.9},{"word":"ladder","rawWord":"ladder,","start":26.97,"end":27.411}]},{"id":25,"start":27.492,"end":28.306,"text":"under a sink,","words":[{"word":"under","rawWord":"under","start":27.492,"end":27.725},{"word":"a","rawWord":"a","start":27.783,"end":27.818},{"word":"sink","rawWord":"sink,","start":27.899,"end":28.259}]},{"id":26,"start":28.306,"end":29.072,"text":"or eating dinner","words":[{"word":"or","rawWord":"or","start":28.306,"end":28.433},{"word":"eating","rawWord":"eating","start":28.503,"end":28.747},{"word":"dinner","rawWord":"dinner","start":28.805,"end":29.025}]},{"id":27,"start":29.072,"end":30.314,"text":"with your family,","words":[{"word":"with","rawWord":"with","start":29.072,"end":29.2},{"word":"your","rawWord":"your","start":29.234,"end":29.351},{"word":"family","rawWord":"family,","start":29.409,"end":30.07}]},{"id":28,"start":30.314,"end":32.079,"text":"every single unanswered","words":[{"word":"every","rawWord":"every","start":30.314,"end":30.697},{"word":"single","rawWord":"single","start":30.813,"end":31.289},{"word":"unanswered","rawWord":"unanswered","start":31.371,"end":32.032}]},{"id":29,"start":32.079,"end":32.752,"text":"call is an","words":[{"word":"call","rawWord":"call","start":32.079,"end":32.416},{"word":"is","rawWord":"is","start":32.508,"end":32.613},{"word":"an","rawWord":"an","start":32.648,"end":32.717}]},{"id":30,"start":32.752,"end":33.832,"text":"$8,000","words":[{"word":"$8000","rawWord":"$8,000","start":32.752,"end":33.774}]},{"id":31,"start":33.832,"end":35.167,"text":"job handed straight","words":[{"word":"job","rawWord":"job","start":33.832,"end":34.169},{"word":"handed","rawWord":"handed","start":34.262,"end":34.633},{"word":"straight","rawWord":"straight","start":34.726,"end":35.121}]},{"id":32,"start":35.167,"end":36.57,"text":"to your competitor.","words":[{"word":"to","rawWord":"to","start":35.167,"end":35.248},{"word":"your","rawWord":"your","start":35.33,"end":35.504},{"word":"competitor","rawWord":"competitor.","start":35.562,"end":36.27}]},{"id":33,"start":36.711,"end":37.501,"text":"That is why","words":[{"word":"That","rawWord":"That","start":36.711,"end":37.001},{"word":"is","rawWord":"is","start":37.06,"end":37.152},{"word":"why","rawWord":"why","start":37.21,"end":37.431}]},{"id":34,"start":37.501,"end":38.73,"text":"we built Ava.","words":[{"word":"we","rawWord":"we","start":37.501,"end":37.605},{"word":"built","rawWord":"built","start":37.663,"end":37.884},{"word":"Ava","rawWord":"Ava.","start":37.954,"end":38.43}]},{"id":35,"start":38.871,"end":39.718,"text":"She answers your","words":[{"word":"She","rawWord":"She","start":38.871,"end":39.056},{"word":"answers","rawWord":"answers","start":39.149,"end":39.498},{"word":"your","rawWord":"your","start":39.544,"end":39.672}]},{"id":36,"start":39.718,"end":40.601,"text":"shop phone in","words":[{"word":"shop","rawWord":"shop","start":39.718,"end":39.962},{"word":"phone","rawWord":"phone","start":40.008,"end":40.322},{"word":"in","rawWord":"in","start":40.38,"end":40.519}]},{"id":37,"start":40.601,"end":41.541,"text":"0.8","words":[{"word":"08","rawWord":"0.8","start":40.601,"end":41.46}]},{"id":38,"start":41.541,"end":42.284,"text":"seconds,","words":[{"word":"seconds","rawWord":"seconds,","start":41.541,"end":42.11}]},{"id":39,"start":42.284,"end":43.747,"text":"qualifies the caller,","words":[{"word":"qualifies","rawWord":"qualifies","start":42.284,"end":42.923},{"word":"the","rawWord":"the","start":42.981,"end":43.05},{"word":"caller","rawWord":"caller,","start":43.097,"end":43.596}]},{"id":40,"start":43.747,"end":44.931,"text":"checks your schedule,","words":[{"word":"checks","rawWord":"checks","start":43.747,"end":44.037},{"word":"your","rawWord":"your","start":44.072,"end":44.188},{"word":"schedule","rawWord":"schedule,","start":44.223,"end":44.815}]},{"id":41,"start":44.931,"end":45.883,"text":"and dispatches the","words":[{"word":"and","rawWord":"and","start":44.931,"end":45.082},{"word":"dispatches","rawWord":"dispatches","start":45.14,"end":45.697},{"word":"the","rawWord":"the","start":45.755,"end":45.825}]},{"id":42,"start":45.883,"end":46.487,"text":"job to your","words":[{"word":"job","rawWord":"job","start":45.883,"end":46.139},{"word":"to","rawWord":"to","start":46.197,"end":46.243},{"word":"your","rawWord":"your","start":46.313,"end":46.44}]},{"id":43,"start":46.487,"end":47.671,"text":"technician phone before","words":[{"word":"technician","rawWord":"technician","start":46.487,"end":46.998},{"word":"phone","rawWord":"phone","start":47.056,"end":47.323},{"word":"before","rawWord":"before","start":47.358,"end":47.636}]},{"id":44,"start":47.671,"end":48.426,"text":"the customer can","words":[{"word":"the","rawWord":"the","start":47.671,"end":47.741},{"word":"customer","rawWord":"customer","start":47.787,"end":48.182},{"word":"can","rawWord":"can","start":48.24,"end":48.356}]},{"id":45,"start":48.426,"end":49.447,"text":"even open another","words":[{"word":"even","rawWord":"even","start":48.426,"end":48.646},{"word":"open","rawWord":"open","start":48.728,"end":49.018},{"word":"another","rawWord":"another","start":49.076,"end":49.378}]},{"id":46,"start":49.447,"end":50.641,"text":"Google tab.","words":[{"word":"Google","rawWord":"Google","start":49.447,"end":49.784},{"word":"tab","rawWord":"tab.","start":49.819,"end":50.341}]},{"id":47,"start":50.724,"end":52.094,"text":"Stop bleeding thousands","words":[{"word":"Stop","rawWord":"Stop","start":50.724,"end":51.026},{"word":"bleeding","rawWord":"bleeding","start":51.084,"end":51.444},{"word":"thousands","rawWord":"thousands","start":51.514,"end":52.048}]},{"id":48,"start":52.094,"end":53.741,"text":"on dead voicemails.","words":[{"word":"on","rawWord":"on","start":52.094,"end":52.199},{"word":"dead","rawWord":"dead","start":52.268,"end":52.466},{"word":"voicemails","rawWord":"voicemails.","start":52.524,"end":53.441}]},{"id":49,"start":54.045,"end":54.811,"text":"Call the demo","words":[{"word":"Call","rawWord":"Call","start":54.045,"end":54.277},{"word":"the","rawWord":"the","start":54.347,"end":54.416},{"word":"demo","rawWord":"demo","start":54.463,"end":54.741}]},{"id":50,"start":54.811,"end":55.38,"text":"number on your","words":[{"word":"number","rawWord":"number","start":54.811,"end":55.055},{"word":"on","rawWord":"on","start":55.124,"end":55.194},{"word":"your","rawWord":"your","start":55.24,"end":55.357}]},{"id":51,"start":55.38,"end":56.262,"text":"screen right now","words":[{"word":"screen","rawWord":"screen","start":55.38,"end":55.67},{"word":"right","rawWord":"right","start":55.74,"end":55.949},{"word":"now","rawWord":"now","start":56.007,"end":56.192}]},{"id":52,"start":56.262,"end":57.052,"text":"to hear Ava","words":[{"word":"to","rawWord":"to","start":56.262,"end":56.32},{"word":"hear","rawWord":"hear","start":56.378,"end":56.564},{"word":"Ava","rawWord":"Ava","start":56.645,"end":56.982}]},{"id":53,"start":57.052,"end":58.362,"text":"answer live,","words":[{"word":"answer","rawWord":"answer","start":57.052,"end":57.365},{"word":"live","rawWord":"live,","start":57.458,"end":58.062}]},{"id":54,"start":58.387,"end":59.571,"text":"or comment AVA","words":[{"word":"or","rawWord":"or","start":58.387,"end":58.526},{"word":"comment","rawWord":"comment","start":58.584,"end":58.99},{"word":"AVA","rawWord":"AVA","start":59.049,"end":59.49}]},{"id":55,"start":59.571,"end":60.604,"text":"below and we","words":[{"word":"below","rawWord":"below","start":59.571,"end":59.943},{"word":"and","rawWord":"and","start":60.268,"end":60.43},{"word":"we","rawWord":"we","start":60.488,"end":60.569}]},{"id":56,"start":60.604,"end":61.312,"text":"will DM you","words":[{"word":"will","rawWord":"will","start":60.604,"end":60.755},{"word":"DM","rawWord":"DM","start":60.802,"end":61.069},{"word":"you","rawWord":"you","start":61.15,"end":61.231}]},{"id":57,"start":61.312,"end":62.299,"text":"the free interactive","words":[{"word":"the","rawWord":"the","start":61.312,"end":61.382},{"word":"free","rawWord":"free","start":61.44,"end":61.661},{"word":"interactive","rawWord":"interactive","start":61.719,"end":62.265}]},{"id":58,"start":62.299,"end":63.426,"text":"link.","words":[{"word":"link","rawWord":"link.","start":62.299,"end":62.926}]}];

function renderPreciseCaptions(time) {
  const chunk = CAPTION_CHUNKS.find(c => time >= c.start && time < c.end);
  if (!chunk) return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Anchored to screen coordinates for rock-solid stability

  const subY = H - 180;
  ctx.font = '900 42px "Space Grotesk", "Inter", sans-serif';
  ctx.textBaseline = 'middle';

  const spaceW = ctx.measureText(' ').width;
  const wordWidths = chunk.words.map(w => ctx.measureText(w.rawWord).width);
  const totalTextW = wordWidths.reduce((a, b) => a + b, 0) + (chunk.words.length - 1) * spaceW;

  // Background pill
  const padX = 26;
  const padY = 14;
  const pillW = totalTextW + padX * 2;
  const pillH = 58 + padY;
  const pillX = (W - pillW) / 2;
  const pillY = subY - pillH / 2;
  const radius = 16;

  // High-Contrast Frosted Dark Glass Pill
  ctx.fillStyle = 'rgba(7, 10, 18, 0.88)';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, radius);
  ctx.fill();

  ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, radius);
  ctx.stroke();

  // Draw Words with Millisecond Highlight Precision
  let curX = pillX + padX;
  chunk.words.forEach((w, idx) => {
    const isSpoken = (time >= w.start && time < w.end);
    const hasBeenSpoken = (time >= w.end);

    ctx.save();
    if (isSpoken) {
      // Currently spoken word: Electric amber gold with soft glow
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = 'rgba(250, 204, 21, 0.7)';
      ctx.shadowBlur = 12;
      ctx.font = '900 43px "Space Grotesk", "Inter", sans-serif';
    } else if (hasBeenSpoken) {
      // Already spoken in phrase: Soft amber-white
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 6;
      ctx.font = '900 42px "Space Grotesk", "Inter", sans-serif';
    } else {
      // Upcoming in phrase: Clean crisp white
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 6;
      ctx.font = '900 42px "Space Grotesk", "Inter", sans-serif';
    }

    ctx.fillText(w.rawWord, curX, subY);
    ctx.restore();

    curX += wordWidths[idx] + spaceW;
  });

  ctx.restore();
}

// ----------------------------------------------------------------------------
// CUEVA-GRADE CRT SCANLINES & ANALOG RETRO SHADER
// ----------------------------------------------------------------------------
function renderCRTScanlines(time) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // 1. Fine Horizontal Scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 1.5);
  }

  // 2. Slow Vertical Beam Refresh Sweep
  const beamY = (time * 160) % (H + 300) - 150;
  const beamGrad = ctx.createLinearGradient(0, beamY - 100, 0, beamY + 100);
  beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  beamGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.035)');
  beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(0, beamY - 100, W, 200);

  // 3. Subtle CRT Vignette Curve
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.38, W / 2, H / 2, H * 0.78);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(5, 7, 13, 0.42)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}


function renderFrame(time) {
  window.renderFrame = renderFrame;

  if (!Number.isFinite(time) || isNaN(time) || time < 0) {
    time = 0;
  }
  time = Math.min(time, TOTAL_DURATION || 63);

  // GUARANTEED MATRIX & BUFFER RESET (ZERO LEAK / ZERO ACCUMULATION)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  ctx.save();

  // CONTINUOUS DYNAMIC CAMERA: Slow organic push-in + motorized jib glide
  // Guarantees zero motionless frames anywhere in the video!
  const camZoom = 1.015 + Math.sin(time * 0.4) * 0.02 + ((time % 7.0) / 7.0) * 0.035;
  const camPanX = Math.sin(time * 0.7) * 5.0 + Math.cos(time * 1.2) * 2.5;
  const camPanY = Math.cos(time * 0.5) * 4.0 + Math.sin(time * 0.9) * 2.0;

  ctx.translate(W / 2, H / 2);
  ctx.scale(camZoom, camZoom);
  ctx.translate(-W / 2 + camPanX, -H / 2 + camPanY);

  // EXTENDED STORY HOOK (0.0s - 34.0s) & COMPLETE SCENE PROGRESSION
  if (time < 7.2) {
    renderTasklessScene1_LaserCrowd(time);
  } else if (time < 13.2) {
    renderTasklessScene2_EarthToUranus(time);
  } else if (time < 17.5) {
    renderTasklessScene3_SpaceVsContractorContrast(time);
  } else if (time < 22.0) {
    renderTasklessScene4_HomeownerEmergency(time);
  } else if (time < 26.5) {
    renderTasklessScene5_Stat78Percent(time);
  } else if (time < 34.0) {
    renderTasklessScene6_ContractorPainLadder(time);
  } else if (time < 43.0) {
    renderTasklessScene7_AvaInstantReply(time);
  } else if (time < 51.5) {
    renderTasklessScene8_RevenueWaterfall(time);
  } else if (time < 56.5) {
    renderTasklessScene9_LiveDialerInteractive(time);
  } else {
    renderTasklessScene10_TasklessEndCard(time);
  }

  // Floating Ambient Space Particles across all scenes
  drawAmbientDustParticles(ctx, time);

  // Soft cinematic fade at scene cuts (0.16s ease)
  const sceneCuts = [7.2, 13.2, 17.5, 22.0, 26.5, 34.0, 43.0, 51.5, 56.5];
  let minCutDist = 999;
  for (let c = 0; c < sceneCuts.length; c++) {
    minCutDist = Math.min(minCutDist, Math.abs(time - sceneCuts[c]));
  }
  if (minCutDist < 0.16) {
    const fadeProg = 1 - (minCutDist / 0.16);
    const dipAlpha = Math.sin(fadeProg * (Math.PI / 2)) * 0.25;
    ctx.fillStyle = 'rgba(0, 0, 0, ' + dipAlpha + ')';
    ctx.fillRect(0, 0, W, H);
  }

  // Hormozi Style Kinetic Subtitles with spring bounce
  renderPreciseCaptions(time);
  renderCRTScanlines(time);

  ctx.restore();
}
