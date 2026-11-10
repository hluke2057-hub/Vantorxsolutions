// ============================================================================
// VANTORX VIRAL REEL ENGINE — 1:1 TASKLESS STUDIO VISUAL IDENTITY
// Pure black void, minimalist technical schematics, HUD metrics, clean kinetic typography
// ============================================================================

function drawTasklessHUD(ctx, opts) {
  ctx.save();
  ctx.beginPath();

  // Top Left Metric
  if (opts.topStat) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 46px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(opts.topStat, 40, 52);

    if (opts.topStatUnit) {
      const statW = ctx.measureText(opts.topStat).width;
      ctx.font = '600 22px "Space Grotesk", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(' ' + opts.topStatUnit, 40 + statW, 70);
    }

    let subY = 106;
    ctx.font = '700 13px "Inter", "JetBrains Mono", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    if (opts.topSub1) {
      ctx.fillText(opts.topSub1.toUpperCase(), 42, subY);
      subY += 18;
    }
    if (opts.topSub2) {
      ctx.fillText(opts.topSub2.toUpperCase(), 42, subY);
    }
  }

  // Top Right Context Label
  if (opts.rightLabel) {
    ctx.font = '700 13px "Inter", "JetBrains Mono", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(opts.rightLabel.toUpperCase(), W - 40, 58);
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 1 (0.0s - 7.0s): Laser Crowd Hook
// Crowd of 2D flat vector silhouettes pointing green lasers up into space
// Foreground arm with green laser pointer emitting vibrant beam
// ----------------------------------------------------------------------------
function renderTasklessScene1_LaserCrowd(t) {
  ctx.save();
  ctx.beginPath();
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

  // Background Crowd of Minimalist Vector People
  const crowdCount = 18;
  for (let i = 0; i < crowdCount; i++) {
    const cx = 50 + (i % 6) * 85 + ((i * 17) % 30);
    const cy = H - 280 - Math.floor(i / 6) * 70;
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
  }

  // Foreground Giant Arm & Hand Holding Laser (Exact 1:1 match to Taskless frame_01.jpg!)
  ctx.save();
  const armSway = Math.sin(t * 1.8) * 4;
  const handBaseX = W * 0.38 + armSway;
  const handBaseY = H * 0.44;

  // Arm reaching up from bottom-left
  ctx.fillStyle = '#b7835b'; // Warm skin tone
  ctx.beginPath();
  ctx.moveTo(W * 0.10, H);
  ctx.lineTo(W * 0.24, H);
  ctx.lineTo(handBaseX + 32, handBaseY + 60);
  ctx.lineTo(handBaseX - 32, handBaseY + 60);
  ctx.closePath();
  ctx.fill();

  // Hand Palm & Fingers
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
  const glowPulse = 0.8 + 0.2 * Math.sin(t * 12);

  // Intense Emerald Glow Aura
  const emitterGlow = ctx.createRadialGradient(emitterX, emitterY, 2, emitterX, emitterY, 35);
  emitterGlow.addColorStop(0, 'rgba(74, 222, 128, 1)');
  emitterGlow.addColorStop(0.3, 'rgba(34, 197, 94, 0.7)');
  emitterGlow.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = emitterGlow;
  ctx.beginPath();
  ctx.arc(emitterX, emitterY, 35, 0, Math.PI * 2);
  ctx.fill();

  // Laser Beam shooting up-right towards top of screen (exact match to Taskless frame_01.jpg!)
  const beamTopX = W * 0.78;
  const beamTopY = 0;

  // Outer Glow Beam
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.35)';
  ctx.lineWidth = 14 * glowPulse;
  ctx.lineCap = 'round';
  ctx.moveTo(emitterX, emitterY);
  ctx.lineTo(beamTopX, beamTopY);
  ctx.stroke();
  ctx.closePath();

  // Inner Core Beam
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.moveTo(emitterX, emitterY);
  ctx.lineTo(beamTopX, beamTopY);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 2 (7.0s - 13.5s): Earth to Uranus Schematic
// 1:1 Match with Taskless frame_04.jpg!
// Pure pitch black. Glowing vector Earth at bottom-left, cyan Uranus at top-right.
// Concentric orbital rings, neon green laser corridor linking Earth to Uranus.
// ----------------------------------------------------------------------------
function renderTasklessScene2_EarthToUranus(t) {
  ctx.save();
  ctx.beginPath();
  // Pure Pitch Black
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  // HUD
  drawTasklessHUD(ctx, {
    topStat: '≈3 HOURS',
    topSub1: 'ONE WAY • DISTANCE VARIES',
    topSub2: 'SCHEMATIC • TIME COMPRESSED',
    rightLabel: 'EARTH ➔ URANUS'
  });

  const earthX = 85;
  const earthY = H - 260;
  const earthR = 42;

  const uranusX = W - 140;
  const uranusY = 240;
  const uranusR = 120;

  // Concentric Orbital Ring Waves around Uranus (Exact match to Taskless frame_04!)
  ctx.save();
  const ringCount = 8;
  for (let r = 0; r < ringCount; r++) {
    const radius = uranusR + 15 + r * 16;
    const ringAlpha = 0.08 + (r % 2 === 0 ? 0.06 : 0.02);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(103, 232, 249, ' + ringAlpha + ')';
    ctx.lineWidth = 1.0;
    ctx.arc(uranusX, uranusY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }
  ctx.restore();

  // Neon Green Laser Beam Corridor Linking Earth to Uranus
  ctx.save();
  const laserProgress = Math.min(1.0, (t - 7.0) / 1.5);

  const curBeamEndX = earthX + (uranusX - earthX) * laserProgress;
  const curBeamEndY = earthY + (uranusY - earthY) * laserProgress;

  // Tapered Laser Beam Outer Glow
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
  ctx.lineTo(curBeamEndX, curBeamEndY);
  ctx.stroke();
  ctx.closePath();

  // White Hot Beam Core
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 0;
  ctx.moveTo(earthX, earthY);
  ctx.lineTo(curBeamEndX, curBeamEndY);
  ctx.stroke();
  ctx.closePath();

  // Traveling Light Pulse Packet
  const pulseLoop = ((t - 7.0) * 1.4) % 1.0;
  const px = earthX + (uranusX - earthX) * pulseLoop;
  const py = earthY + (uranusY - earthY) * pulseLoop;
  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 16;
  ctx.arc(px, py, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  // Earth (Vector Sphere with Atmosphere Glow Ring)
  ctx.save();
  // Atmosphere Halo
  const earthGlow = ctx.createRadialGradient(earthX, earthY, earthR, earthX, earthY, earthR + 14);
  earthGlow.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
  earthGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.beginPath();
  ctx.fillStyle = earthGlow;
  ctx.arc(earthX, earthY, earthR + 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Earth Ocean Body
  const oceanGrad = ctx.createRadialGradient(earthX - earthR * 0.3, earthY - earthR * 0.3, 4, earthX, earthY, earthR);
  oceanGrad.addColorStop(0, '#1d4ed8');
  oceanGrad.addColorStop(0.7, '#1e3a8a');
  oceanGrad.addColorStop(1, '#0f172a');
  ctx.beginPath();
  ctx.fillStyle = oceanGrad;
  ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Vector Continents
  ctx.beginPath();
  ctx.fillStyle = '#10b981';
  ctx.ellipse(earthX - 6, earthY - 8, 14, 18, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.ellipse(earthX + 16, earthY + 10, 10, 12, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Moon Marker at 1.3s light travel distance
  const moonProg = 0.16;
  const moonX = earthX + (uranusX - earthX) * moonProg + 25;
  const moonY = earthY + (uranusY - earthY) * moonProg - 20;
  ctx.beginPath();
  ctx.fillStyle = '#e2e8f0';
  ctx.arc(moonX, moonY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  ctx.font = '700 11px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('MOON (1.3s)', moonX + 14, moonY);
  ctx.restore();

  // Uranus (Cyan Gas Giant Vector Sphere)
  ctx.save();
  // Soft outer gas glow
  const uranusGlow = ctx.createRadialGradient(uranusX, uranusY, uranusR, uranusX, uranusY, uranusR + 25);
  uranusGlow.addColorStop(0, 'rgba(103, 232, 249, 0.45)');
  uranusGlow.addColorStop(1, 'rgba(103, 232, 249, 0)');
  ctx.beginPath();
  ctx.fillStyle = uranusGlow;
  ctx.arc(uranusX, uranusY, uranusR + 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Gas Giant Body
  const uBodyGrad = ctx.createRadialGradient(uranusX - uranusR * 0.3, uranusY - uranusR * 0.3, 10, uranusX, uranusY, uranusR);
  uBodyGrad.addColorStop(0, '#cffafe');
  uBodyGrad.addColorStop(0.4, '#67e8f9');
  uBodyGrad.addColorStop(0.85, '#06b6d4');
  uBodyGrad.addColorStop(1, '#0e7490');
  ctx.beginPath();
  ctx.fillStyle = uBodyGrad;
  ctx.arc(uranusX, uranusY, uranusR, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 3 (13.5s - 16.5s): Giant Uranus Metric Close-Up
// 1:1 Match with Taskless frame_08.jpg!
// Pure pitch black. Giant glowing gas giant. Large metric "50,271 km"
// ----------------------------------------------------------------------------
function renderTasklessScene3_UranusCloseUp(t) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '50,271',
    topStatUnit: 'km',
    topSub1: 'EQUATORIAL DIAMETER',
    rightLabel: 'URANUS DIAMETER'
  });

  const uX = W / 2;
  const uY = H * 0.52;
  const uR = 210;

  // Faint concentric orbits
  for (let r = 1; r <= 6; r++) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(103, 232, 249, ' + (0.05 + r * 0.02) + ')';
    ctx.lineWidth = 1;
    ctx.arc(uX, uY, uR + r * 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }

  // Planet body
  const body = ctx.createRadialGradient(uX - 60, uY - 60, 20, uX, uY, uR);
  body.addColorStop(0, '#cffafe');
  body.addColorStop(0.35, '#67e8f9');
  body.addColorStop(0.75, '#22d3ee');
  body.addColorStop(1, '#0891b2');
  ctx.beginPath();
  ctx.fillStyle = body;
  ctx.arc(uX, uY, uR, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Atmospheric haze
  const haze = ctx.createRadialGradient(uX, uY, uR - 20, uX, uY, uR + 30);
  haze.addColorStop(0, 'rgba(103, 232, 249, 0)');
  haze.addColorStop(0.7, 'rgba(103, 232, 249, 0.35)');
  haze.addColorStop(1, 'rgba(103, 232, 249, 0)');
  ctx.fillStyle = haze;
  ctx.arc(uX, uY, uR + 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 4 (16.5s - 20.0s): Minimalist Clock Round Trip
// 1:1 Match with Taskless frame_12.jpg!
// Pure pitch black. Clean circular clock with 12 ticks and fast sweeping hands.
// ----------------------------------------------------------------------------
function renderTasklessScene4_RoundTripClock(t) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '≈6 HOURS',
    topSub1: 'OUTWARD + RETURN LIGHT TRIP',
    topSub2: 'SPEED OF LIGHT ROUND TRIP',
    rightLabel: 'OUTWARD + RETURN'
  });

  const clockX = W / 2;
  const clockY = H * 0.50;
  const clockR = 175;

  // Outer circle
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.arc(clockX, clockY, clockR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();

  // 12 Delicate Tick Marks
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const isMajor = (i % 3 === 0);
    const tickLen = isMajor ? 16 : 8;
    const x1 = clockX + Math.cos(angle) * (clockR - tickLen);
    const y1 = clockY + Math.sin(angle) * (clockR - tickLen);
    const x2 = clockX + Math.cos(angle) * clockR;
    const y2 = clockY + Math.sin(angle) * clockR;

    ctx.beginPath();
    ctx.strokeStyle = isMajor ? '#ffffff' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = isMajor ? 2.5 : 1.2;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  }

  // Fast Sweeping Clock Hands (showing 6 hours passage)
  const clockProgress = (t - 16.5) / 3.5;
  const hourAngle = clockProgress * Math.PI * 2 - Math.PI / 2;
  const minuteAngle = clockProgress * Math.PI * 24 - Math.PI / 2;

  // Minute Hand (Longer, thin white)
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(minuteAngle) * (clockR - 35), clockY + Math.sin(minuteAngle) * (clockR - 35));
  ctx.stroke();
  ctx.closePath();

  // Hour Hand (Shorter, cyan tinted)
  ctx.beginPath();
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 4.0;
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(hourAngle) * (clockR - 75), clockY + Math.sin(hourAngle) * (clockR - 75));
  ctx.stroke();
  ctx.closePath();

  // Center Pivot Dot
  ctx.beginPath();
  ctx.fillStyle = '#67e8f9';
  ctx.arc(clockX, clockY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Red Contrast Alert at t > 18.2s
  if (t > 18.2) {
    const alertAlpha = Math.min(1.0, (t - 18.2) / 0.5);
    ctx.fillStyle = 'rgba(239, 68, 68, ' + (alertAlpha * 0.9) + ')';
    ctx.font = '800 18px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('VS. AVERAGE CONTRACTOR: 48+ HOURS', clockX, clockY + clockR + 55);
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 5 (20.0s - 26.5s): The 78% Conversion Benchmark
// Giant bold 78% in golden amber with First Responder vs Lost Deal comparison
// ----------------------------------------------------------------------------
function renderTasklessScene5_Stat78Percent(t) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '78%',
    topSub1: 'WIN RATE OF 1ST RESPONDER',
    topSub2: 'SOURCE: LEAD RESPONSE AUDIT',
    rightLabel: 'LEAD CONVERSION'
  });

  const prog = Math.min(1.0, Math.max(0, (t - 20.0) / 1.0));
  const currentStat = Math.floor(prog * 78);

  // Giant Stat Center
  ctx.font = '900 120px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15'; // Amber gold
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(250, 204, 21, 0.45)';
  ctx.shadowBlur = 35;
  ctx.fillText(currentStat + '%', W / 2, H * 0.38);
  ctx.shadowBlur = 0;

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
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.closePath();

  // Green Progress Bar Fill
  const barProg = Math.min(1.0, Math.max(0, (t - 20.5) / 1.2));
  ctx.beginPath();
  ctx.fillStyle = '#22c55e';
  ctx.roundRect(laneX + 4, laneY + 4, (laneW - 8) * 0.78 * barProg, 56, 8);
  ctx.fill();
  ctx.closePath();

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
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
  ctx.roundRect(laneX + 4, lane2Y + 4, (laneW - 8) * 0.22, 56, 8);
  ctx.fill();
  ctx.closePath();

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
// SCENE 6 (26.5s - 34.0s): Sleek Dark UI Card — The Missed Lead
// 1:1 Match with Taskless frame_16.jpg!
// Dark card (#111217), NEW LEAD • WAITING, customer chat bubble, missed call risk
// ----------------------------------------------------------------------------
function renderTasklessScene6_ContractorPainLadder(t) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '8,000',
    topStatUnit: 'USD',
    topSub1: 'AVERAGE HVAC/PLUMBING TICKET',
    rightLabel: 'REVENUE AT RISK'
  });

  // Sleek Dark UI Card (Exact match to Taskless frame_16.jpg!)
  const cardX = 40;
  const cardY = 170;
  const cardW = W - 80;
  const cardH = 430;

  // Card Container
  ctx.beginPath();
  ctx.fillStyle = '#111217';
  ctx.roundRect(cardX, cardY, cardW, cardH, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.closePath();

  // Header inside card
  ctx.font = '700 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('NEW LEAD', cardX + 24, cardY + 28);

  // Amber Waiting Indicator
  const dotPulse = 0.5 + 0.5 * Math.sin(t * 6);
  ctx.beginPath();
  ctx.fillStyle = 'rgba(245, 158, 11, ' + dotPulse + ')';
  ctx.arc(cardX + cardW - 85, cardY + 34, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  ctx.font = '700 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('WAITING', cardX + cardW - 24, cardY + 28);

  // Incoming Customer Message Bubble
  const bubbleX = cardX + 24;
  const bubbleY = cardY + 68;
  const bubbleW = cardW - 48;
  const bubbleH = 88;

  ctx.beginPath();
  ctx.fillStyle = '#1e222d';
  ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 14);
  ctx.fill();
  ctx.closePath();

  ctx.font = '600 16px "Inter", sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Hi! Water is leaking through my ceiling,', bubbleX + 18, bubbleY + 22);
  ctx.fillText('can someone come give a quote today?', bubbleX + 18, bubbleY + 46);

  // Typing / Waiting Indicator (3 pulsing dots)
  const typingY = bubbleY + 110;
  const typingX = cardX + cardW - 110;
  ctx.beginPath();
  ctx.fillStyle = '#2a3142';
  ctx.roundRect(typingX, typingY, 86, 42, 21);
  ctx.fill();
  ctx.closePath();

  for (let d = 0; d < 3; d++) {
    const dotAlpha = 0.3 + 0.7 * Math.abs(Math.sin(t * 5 + d * 0.8));
    ctx.beginPath();
    ctx.fillStyle = 'rgba(163, 230, 53, ' + dotAlpha + ')';
    ctx.arc(typingX + 24 + d * 19, typingY + 21, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  // Red Alert Banner below: Missed Call Bleed
  const alertY = cardY + cardH - 115;
  ctx.beginPath();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
  ctx.roundRect(cardX + 20, alertY, cardW - 40, 75, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.stroke();
  ctx.closePath();

  ctx.font = '800 15px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('⚠️ UNANSWERED CALL HANDED TO COMPETITOR', cardX + cardW / 2, alertY + 18);

  ctx.font = '700 20px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('-$8,000.00 REVENUE BLEED', cardX + cardW / 2, alertY + 42);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 7 (34.0s - 43.0s): Ava Instant 0.8s Response & Autonomous Dispatch
// Dark card updates with Ava Voice AI badge, waveform, and technician dispatch
// ----------------------------------------------------------------------------
function renderTasklessScene7_AvaInstantReply(t) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '0.8s',
    topSub1: 'SPEED-TO-LEAD VOICE AI',
    topSub2: 'AUTONOMOUS CALL QUALIFICATION',
    rightLabel: 'AVA ➔ LIVE CALL'
  });

  const cardX = 40;
  const cardY = 160;
  const cardW = W - 80;
  const cardH = 460;

  ctx.beginPath();
  ctx.fillStyle = '#111217';
  ctx.roundRect(cardX, cardY, cardW, cardH, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.closePath();

  // Ava Status Header
  ctx.font = '800 13px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('⚡ AVA AUTONOMOUS VOICE AI', cardX + 24, cardY + 28);

  ctx.font = '700 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.textAlign = 'right';
  ctx.fillText('● ANSWERED IN 0.8s', cardX + cardW - 24, cardY + 28);

  // Holographic Audio Waveform
  const waveY = cardY + 80;
  const waveW = cardW - 48;
  const waveX = cardX + 24;

  ctx.beginPath();
  ctx.fillStyle = '#0a1622';
  ctx.roundRect(waveX, waveY, waveW, 60, 10);
  ctx.fill();
  ctx.closePath();

  const barCount = 32;
  const barW = (waveW - 40) / barCount;
  for (let b = 0; b < barCount; b++) {
    const waveH = 8 + 26 * Math.abs(Math.sin(t * 8 + b * 0.4));
    const bx = waveX + 20 + b * barW;
    const by = waveY + 30 - waveH / 2;

    const barGrad = ctx.createLinearGradient(0, by, 0, by + waveH);
    barGrad.addColorStop(0, '#38bdf8');
    barGrad.addColorStop(1, '#a3e635');
    ctx.beginPath();
    ctx.fillStyle = barGrad;
    ctx.roundRect(bx, by, barW - 3, waveH, 2);
    ctx.fill();
    ctx.closePath();
  }

  // Ava Spoken Bubble
  const avaBubbleY = cardY + 165;
  ctx.beginPath();
  ctx.fillStyle = '#1e293b';
  ctx.roundRect(cardX + 24, avaBubbleY, cardW - 48, 100, 14);
  ctx.fill();
  ctx.closePath();

  ctx.font = '600 15px "Inter", sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('"Thanks for calling! We have a technician', cardX + 42, avaBubbleY + 20);
  ctx.fillText('available at 2:00 PM today. I have booked', cardX + 42, avaBubbleY + 44);
  ctx.fillText('that on the schedule for you right now."', cardX + 42, avaBubbleY + 68);

  // Dispatch Confirmation Box
  const dispY = cardY + cardH - 120;
  ctx.beginPath();
  ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
  ctx.roundRect(cardX + 24, dispY, cardW - 48, 85, 12);
  ctx.fill();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.closePath();

  ctx.font = '800 15px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('✓ JOB BOOKED & CALENDAR SYNCED', cardX + 44, dispY + 22);

  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Dispatched to Technician Truck #2 Phone', cardX + 44, dispY + 48);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 8 (43.0s - 51.5s): Revenue Protection Schematic
// 10 incoming calls: Without AI (-$64,000) vs With Ava (+$80,000 protected)
// ----------------------------------------------------------------------------
function renderTasklessScene8_RevenueWaterfall(t) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '+$80,000',
    topSub1: 'MONTHLY PIPELINE PROTECTED',
    topSub2: '100% INBOUND CALL CAPTURE',
    rightLabel: 'REVENUE AUDIT'
  });

  const boxW = W - 80;
  const boxX = 40;

  // Top Card: Dead Voicemail Bleed
  const topY = 170;
  ctx.beginPath();
  ctx.fillStyle = '#111217';
  ctx.roundRect(boxX, topY, boxW, 140, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.closePath();

  ctx.font = '800 16px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('❌ WITHOUT AVA (MANUAL CALLBACKS)', boxX + 24, topY + 24);

  ctx.font = '600 14px "Inter", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('8 out of 10 emergency calls go to voicemail', boxX + 24, topY + 54);

  ctx.font = '800 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.fillText('-$64,000 LOST TO COMPETITORS', boxX + 24, topY + 92);

  // Bottom Card: Protected by VantorX Ava
  const botY = topY + 165;
  ctx.beginPath();
  ctx.fillStyle = '#111217';
  ctx.roundRect(boxX, botY, boxW, 150, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.closePath();

  ctx.font = '800 16px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#22c55e';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('⚡ WITH VANTORX SPEED-TO-LEAD', boxX + 24, botY + 24);

  ctx.font = '600 14px "Inter", sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('10 out of 10 answered in < 1 second', boxX + 24, botY + 54);

  ctx.font = '800 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('+$80,000 REVENUE RETAINED', boxX + 24, botY + 92);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 9 (51.5s - 56.5s): Live Interactive Demo Dialer
// Dial live demo number right now
// ----------------------------------------------------------------------------
function renderTasklessScene9_LiveDialerInteractive(t) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: 'LIVE DEMO',
    topSub1: 'HEAR AVA ANSWER YOUR CALL',
    rightLabel: 'TEST AVA NOW'
  });

  const cardX = 40;
  const cardY = 180;
  const cardW = W - 80;
  const cardH = 380;

  ctx.beginPath();
  ctx.fillStyle = '#111217';
  ctx.roundRect(cardX, cardY, cardW, cardH, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.closePath();

  ctx.font = '800 18px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('CALL OUR SHOP TEST LINE NOW:', W / 2, cardY + 36);

  // Phone Number Pill
  const numPillY = cardY + 80;
  ctx.beginPath();
  ctx.fillStyle = '#0f172a';
  ctx.roundRect(cardX + 25, numPillY, cardW - 50, 75, 14);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  ctx.font = '900 32px "Space Grotesk", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textBaseline = 'middle';
  ctx.fillText('(844) 328-8255', W / 2, numPillY + 38);

  // Pulse rings around phone icon
  const pulseR = 25 + 15 * Math.sin(t * 5);
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 2;
  ctx.arc(W / 2, cardY + 230, pulseR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = '#22c55e';
  ctx.arc(W / 2, cardY + 230, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  ctx.font = '900 20px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('📞', W / 2, cardY + 230);

  ctx.font = '700 15px "Inter", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textBaseline = 'top';
  ctx.fillText('Ava answers 24/7 in 0.8 seconds', W / 2, cardY + 295);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 10 (56.5s - 63.0s): The Taskless End Card
// 1:1 Match with Taskless frame_18.jpg!
// Pure black void. Brand icon [⚡] VantorX. Glowing lime button: DM "AVA" ➔
// Subtext: "We'll show you where your leads are slipping". Tracked domain: VANTORX.COM
// ----------------------------------------------------------------------------
function renderTasklessScene10_TasklessEndCard(t) {
  ctx.save();
  ctx.beginPath();
  // Pure Pitch Black
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  const centerX = W / 2;

  // 1. Brand Logo: [ ⚡ ] VantorX (Clean white rounded box + bold text)
  const logoY = H * 0.26;
  const iconSize = 44;
  const iconX = centerX - 110;

  // Rounded icon square
  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.roundRect(iconX, logoY - 22, iconSize, iconSize, 10);
  ctx.fill();
  ctx.closePath();

  // Lightning Bolt inside icon
  ctx.fillStyle = '#f97316'; // vibrant orange bolt
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡', iconX + iconSize / 2, logoY);

  // Brand Name
  ctx.font = '800 44px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('VantorX', iconX + iconSize + 16, logoY);

  // 2. Glowing Neon Lime Pill Button (Exact match to Taskless frame_18!)
  const btnY = H * 0.38;
  const btnW = 340;
  const btnH = 74;
  const btnX = centerX - btnW / 2;

  // Neon Glow Aura
  ctx.save();
  ctx.beginPath();
  ctx.shadowColor = 'rgba(163, 230, 53, 0.7)';
  ctx.shadowBlur = 32;
  ctx.fillStyle = '#a3e635'; // Taskless neon lime
  ctx.roundRect(btnX, btnY, btnW, btnH, 37);
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  // Button Text
  ctx.font = '900 26px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DM "AVA" ➔', centerX, btnY + btnH / 2);

  // 3. Subtext Below Button
  const subY = btnY + btnH + 45;
  ctx.font = '700 22px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText("We'll show you where", centerX, subY);
  ctx.fillText('your leads are slipping', centerX, subY + 30);

  // 4. Muted Tracking Domain
  ctx.font = '700 13px "JetBrains Mono", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('VANTORX.COM', centerX, H * 0.64);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// KINETIC CAPTIONS — 1:1 TASKLESS STUDIO TYPOGRAPHY
// Floating borderless bold sans-serif text floating over the black void
// White text with the currently spoken word highlighted in vivid amber gold (#facc15)
// ----------------------------------------------------------------------------
function renderKineticSubtitles(time) {
  const cue = (SCRIPT_CUES || window.SCRIPT_CUES || []).find(c => time >= c.start && time < c.end);
  if (!cue) return;

  const text = cue.text;
  const words = text.split(/\s+/);
  const duration = cue.end - cue.start;
  const progress = Math.min(1, Math.max(0, (time - cue.start) / duration));
  const activeWordIdx = Math.min(words.length - 1, Math.floor(progress * words.length));

  ctx.save();
  ctx.beginPath();

  // Floating at bottom: y = H - 140
  const subY = H - 140;

  // Display a clean window of 3-4 words for instant readable kinetic pacing
  const windowSize = 4;
  const startIdx = Math.max(0, Math.min(activeWordIdx - 1, words.length - windowSize));
  const displayWords = words.slice(startIdx, startIdx + windowSize);

  ctx.font = '800 36px "Inter", "Space Grotesk", -apple-system, sans-serif';
  ctx.textBaseline = 'middle';

  // Measure word positions
  const spaceW = ctx.measureText(' ').width;
  const wordWidths = displayWords.map(w => ctx.measureText(w).width);
  const totalW = wordWidths.reduce((a, b) => a + b, 0) + (displayWords.length - 1) * spaceW;
  let curX = (W - totalW) / 2;

  displayWords.forEach((word, idx) => {
    const globalIdx = startIdx + idx;
    const isActive = (globalIdx === activeWordIdx);

    ctx.save();
    // Drop shadow for crisp legibility over any background
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    if (isActive) {
      // Active spoken word in Taskless golden amber (#facc15 / #fbbf24)
      ctx.fillStyle = '#facc15';
      ctx.font = '900 38px "Inter", "Space Grotesk", sans-serif';
    } else {
      // Clean white text
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 36px "Inter", "Space Grotesk", sans-serif';
    }

    ctx.textAlign = 'left';
    ctx.fillText(word, curX, subY);
    ctx.restore();

    curX += wordWidths[idx] + spaceW;
  });

  ctx.restore();
}

// ----------------------------------------------------------------------------
// MASTER RENDER FRAME FUNCTION
// Pure black void, silky camera jib drift, scene progression, audio sync
// ----------------------------------------------------------------------------
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
  ctx.beginPath();

  // Gentle cinematic camera drift (smooth motorized jib glide)
  const driftX = Math.sin(time * 0.3) * 2.0;
  const driftY = Math.cos(time * 0.25) * 1.5;
  ctx.translate(driftX, driftY);

  // Dynamic Scene Progression Calibrated to Audio Timing
  if (time < 7.0) {
    renderTasklessScene1_LaserCrowd(time);
  } else if (time < 13.5) {
    renderTasklessScene2_EarthToUranus(time);
  } else if (time < 16.5) {
    renderTasklessScene3_UranusCloseUp(time);
  } else if (time < 20.0) {
    renderTasklessScene4_RoundTripClock(time);
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

  // Soft cinematic fade at scene cuts (0.18s ease)
  const sceneCuts = [7.0, 13.5, 16.5, 20.0, 26.5, 34.0, 43.0, 51.5, 56.5];
  let minCutDist = 999;
  for (let c = 0; c < sceneCuts.length; c++) {
    minCutDist = Math.min(minCutDist, Math.abs(time - sceneCuts[c]));
  }
  if (minCutDist < 0.18) {
    const fadeProg = 1 - (minCutDist / 0.18);
    const dipAlpha = Math.sin(fadeProg * (Math.PI / 2)) * 0.28;
    ctx.fillStyle = 'rgba(0, 0, 0, ' + dipAlpha + ')';
    ctx.fillRect(0, 0, W, H);
  }

  // Kinetic Floating Subtitles
  renderKineticSubtitles(time);

  ctx.restore();
}
