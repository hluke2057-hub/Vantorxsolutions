const fs = require('fs');
const path = require('path');

const chunksPath = path.resolve(__dirname, '../website/demo/audio/caption_chunks.json');
const chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8'));

const engineCode = `// ============================================================================
// VANTORX VIRAL REEL ENGINE — CUEVA / TASKLESS STUDIO VISUAL IDENTITY
// 89.0s Extended Cosmic Hook (0-27.6s) + Full "Bob & Sarah" Story (27.6-64.8s) + Ava AI (64.8-89.0s)
// Pure black void, minimalist technical schematics, HUD metrics, crisp Cueva captions
// ZERO STILL FRAMES & ZERO SUBPATH BLEED
// ============================================================================

// Safe helper for rounded rectangles that ALWAYS begins a fresh path
function drawRoundBox(ctx, x, y, w, h, r, fillColor, strokeColor, lineW = 1.5) {
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
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineW;
    ctx.stroke();
  }
}

// ----------------------------------------------------------------------------
// HUD OVERLAY: Minimalist Clean Technical Telemetry
// ----------------------------------------------------------------------------
function drawTasklessHUD(ctx, opts) {
  ctx.save();

  if (opts.topStat) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 40px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(opts.topStat, 36, 42);

    if (opts.topStatUnit) {
      const statW = ctx.measureText(opts.topStat).width;
      ctx.font = '700 18px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(' ' + opts.topStatUnit, 36 + statW, 58);
    }

    let subY = 90;
    ctx.font = '700 11px "JetBrains Mono", "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    if (opts.topSub1) {
      ctx.fillText(opts.topSub1.toUpperCase(), 38, subY);
      subY += 16;
    }
    if (opts.topSub2) {
      ctx.fillText(opts.topSub2.toUpperCase(), 38, subY);
    }
  }

  if (opts.rightLabel) {
    ctx.font = '700 11px "JetBrains Mono", "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(opts.rightLabel.toUpperCase(), W - 36, 48);
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// ZERO STILL FRAMES: Ambient Floating Particle Field
// ----------------------------------------------------------------------------
function drawAmbientDustParticles(ctx, t) {
  ctx.save();
  for (let i = 0; i < 40; i++) {
    const speedX = 14 + (i % 7) * 5;
    const speedY = (8 + (i % 5) * 4) * (i % 2 === 0 ? 1 : -0.7);
    const px = ((i * 127.3 + t * speedX) % (W + 60)) - 30;
    const py = ((i * 193.7 + t * speedY) % (H + 60)) - 30;
    const pSize = 1.0 + (i % 3) * 0.8;
    const pAlpha = 0.08 + 0.14 * Math.sin(t * 2.2 + i * 0.8);

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
// SCENE 1 (0.0s - 8.0s): Laser Crowd Hook
// "If you point a single beam of laser light into the night sky, it fires into the dark at 186,000 miles per second."
// ----------------------------------------------------------------------------
function renderTasklessScene1_LaserCrowd(t) {
  ctx.save();

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#04090c');
  bg.addColorStop(0.5, '#091318');
  bg.addColorStop(1, '#020406');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '186,000',
    topStatUnit: 'MI/S',
    topSub1: 'SPEED OF LIGHT IN VACUUM',
    topSub2: 'PHOTON VELOCITY • NIGHT SKY',
    rightLabel: 'HOOK • 01'
  });

  // Crowd silhouettes pointing lasers
  const crowdCount = 18;
  for (let i = 0; i < crowdCount; i++) {
    const sway = Math.sin(t * 2.5 + i * 0.8) * 3;
    const cx = 48 + (i % 6) * 86 + ((i * 17) % 28) + sway * 0.5;
    const cy = H - 310 - Math.floor(i / 6) * 68 + Math.sin(t * 3.0 + i) * 2;
    const depth = 0.5 + Math.floor(i / 6) * 0.22;
    const alpha = 0.16 + depth * 0.32;

    ctx.fillStyle = 'rgba(203, 213, 225, ' + (alpha * 0.8) + ')';
    ctx.beginPath();
    ctx.arc(cx, cy - 22 * depth, 10 * depth, 0, Math.PI * 2);
    ctx.fill();

    drawRoundBox(ctx, cx - 12 * depth, cy - 10 * depth, 24 * depth, 42 * depth, 4, 'rgba(148, 163, 184, ' + alpha + ')', null);

    if (i % 3 === 0) {
      const beamJitter = Math.sin(t * 15 + i * 3) * 4;
      ctx.strokeStyle = 'rgba(74, 222, 128, ' + (alpha * 0.55) + ')';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx + 8 * depth, cy - 15 * depth);
      ctx.lineTo(cx + 80 + beamJitter, 0);
      ctx.stroke();
    }
  }

  // Foreground Hand Holding Laser Pointer
  ctx.save();
  const armSway = Math.sin(t * 2.0) * 5;
  const handBaseX = W * 0.38 + armSway;
  const handBaseY = H * 0.44 + Math.cos(t * 1.8) * 3;

  ctx.fillStyle = '#b7835b';
  ctx.beginPath();
  ctx.moveTo(W * 0.10, H - 150);
  ctx.lineTo(W * 0.24, H - 150);
  ctx.lineTo(handBaseX + 30, handBaseY + 55);
  ctx.lineTo(handBaseX - 30, handBaseY + 55);
  ctx.closePath();
  ctx.fill();

  drawRoundBox(ctx, handBaseX - 34, handBaseY - 18, 68, 66, 16, '#b7835b', null);

  for (let f = 0; f < 4; f++) {
    const fx = handBaseX - 24 + f * 16;
    const fy = handBaseY - 18 - 46 + (f === 1 ? -6 : f === 2 ? -4 : 0);
    drawRoundBox(ctx, fx, fy, 11, 54, 5, '#b7835b', null);
  }

  const deviceX = handBaseX + 26;
  const deviceY = handBaseY - 48;
  drawRoundBox(ctx, deviceX - 10, deviceY - 24, 20, 48, 6, '#1e293b', '#475569', 1.5);

  const emitterX = deviceX;
  const emitterY = deviceY - 26;
  const glowPulse = 0.8 + 0.2 * Math.sin(t * 14);

  const emitterGlow = ctx.createRadialGradient(emitterX, emitterY, 2, emitterX, emitterY, 42 * glowPulse);
  emitterGlow.addColorStop(0, 'rgba(74, 222, 128, 1)');
  emitterGlow.addColorStop(0.35, 'rgba(34, 197, 94, 0.7)');
  emitterGlow.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = emitterGlow;
  ctx.beginPath();
  ctx.arc(emitterX, emitterY, 42 * glowPulse, 0, Math.PI * 2);
  ctx.fill();

  const targetX = W * 0.84 + Math.sin(t * 6) * 6;
  const targetY = 0;

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.42)';
  ctx.lineWidth = 16 + Math.sin(t * 16) * 4;
  ctx.moveTo(emitterX, emitterY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 6;
  ctx.moveTo(emitterX, emitterY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.moveTo(emitterX, emitterY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

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
// SCENE 2 (8.0s - 21.0s): Deep Space Planetary Relay (Moon -> Mars -> Jupiter -> Uranus)
// "In just one second, it flashes past the Moon. In twelve minutes, it blazes past Mars.
//  In forty-three minutes, it tears past Jupiter, and in under three hours, it crosses
//  nearly two billion miles of freezing deep space to hit the rings of Uranus."
// ----------------------------------------------------------------------------
function renderTasklessScene2_EarthToUranus(t) {
  ctx.save();
  ctx.fillStyle = '#020408';
  ctx.fillRect(0, 0, W, H);

  // Dynamic HUD updates as the beam passes each planet!
  let curMilestone = 'MOON • 1.3 SEC';
  let curDist = '238,900 MILES';
  if (t >= 17.0) {
    curMilestone = 'URANUS • 2.8 HRS';
    curDist = '1.8 BILLION MILES';
  } else if (t >= 13.8) {
    curMilestone = 'JUPITER • 43 MIN';
    curDist = '484 MILLION MILES';
  } else if (t >= 11.2) {
    curMilestone = 'MARS • 12.5 MIN';
    curDist = '140 MILLION MILES';
  }

  drawTasklessHUD(ctx, {
    topStat: curMilestone,
    topSub1: 'INTERPLANETARY LASER RELAY • ' + curDist,
    topSub2: 'PHOTON BEAM TRAJECTORY',
    rightLabel: 'SOLAR SYSTEM'
  });

  // Diagonal trajectory nodes from bottom-left (Earth) to top-right (Uranus)
  const nodes = [
    { name: 'EARTH', timeLabel: '0.0s', x: 75,  y: 720, r: 30, color1: '#60a5fa', color2: '#1d4ed8', hitT: 8.0 },
    { name: 'MOON',  timeLabel: '1.3s', x: 145, y: 615, r: 12, color1: '#e2e8f0', color2: '#64748b', hitT: 9.0 },
    { name: 'MARS',  timeLabel: '12m',  x: 235, y: 495, r: 20, color1: '#fb923c', color2: '#b91c1c', hitT: 11.8 },
    { name: 'JUPITER', timeLabel: '43m', x: 340, y: 365, r: 38, color1: '#fcd34d', color2: '#b45309', hitT: 14.5 },
    { name: 'URANUS', timeLabel: '2.8h (2B MI)', x: 445, y: 215, r: 52, color1: '#a5f3fc', color2: '#0891b2', hitT: 19.8 }
  ];

  // Draw trajectory corridor line
  const startNode = nodes[0];
  const endNode = nodes[nodes.length - 1];

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.25)';
  ctx.lineWidth = 8;
  ctx.moveTo(startNode.x, startNode.y);
  ctx.lineTo(endNode.x, endNode.y);
  ctx.stroke();

  // Active laser progress along the planetary chain
  const beamProg = Math.min(1.0, Math.max(0.08, (t - 8.0) / 11.8));
  const beamEndX = startNode.x + (endNode.x - startNode.x) * beamProg;
  const beamEndY = startNode.y + (endNode.y - startNode.y) * beamProg;

  ctx.beginPath();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 5;
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 16;
  ctx.moveTo(startNode.x, startNode.y);
  ctx.lineTo(beamEndX, beamEndY);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.moveTo(startNode.x, startNode.y);
  ctx.lineTo(beamEndX, beamEndY);
  ctx.stroke();

  // Continuous photon packets racing along the active beam
  for (let p = 0; p < 5; p++) {
    const pFrac = ((t * 2.2 + p * 0.2) % 1.0) * beamProg;
    const px = startNode.x + (endNode.x - startNode.x) * pFrac;
    const py = startNode.y + (endNode.y - startNode.y) * pFrac;
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 12;
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Draw each planet & sonar shockwave when laser hits it
  nodes.forEach((n, idx) => {
    const isHit = (t >= n.hitT);
    ctx.save();

    // Expanding sonar rings when active
    if (isHit) {
      for (let r = 0; r < 3; r++) {
        const ripple = ((t * 28 + r * 18) % 54);
        const alpha = Math.max(0, 0.35 * (1 - ripple / 54));
        ctx.beginPath();
        ctx.strokeStyle = (idx === 4) ? 'rgba(103, 232, 249, ' + alpha + ')' : 'rgba(74, 222, 128, ' + alpha + ')';
        ctx.lineWidth = 1.5;
        ctx.arc(n.x, n.y, n.r + 4 + ripple, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Planet sphere
    const grad = ctx.createRadialGradient(n.x - n.r * 0.3, n.y - n.r * 0.3, 2, n.x, n.y, n.r);
    grad.addColorStop(0, n.color1);
    grad.addColorStop(1, n.color2);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();

    // Uranus tilted ring
    if (n.name === 'URANUS') {
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(-0.45);
      ctx.strokeStyle = 'rgba(165, 243, 252, 0.75)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, n.r * 1.55, n.r * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Planet label
    const labelOffset = (idx % 2 === 0) ? (n.r + 18) : -(n.r + 10);
    ctx.font = '800 13px "Space Grotesk", sans-serif';
    ctx.fillStyle = isHit ? '#ffffff' : 'rgba(255,255,255,0.45)';
    ctx.textAlign = 'center';
    ctx.fillText(n.name + ' • ' + n.timeLabel, n.x, n.y + labelOffset);

    ctx.restore();
  });

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 3 (21.0s - 27.6s): The Cosmic Speed Paradox vs Contractor Callback
// "Yet that two-billion-mile journey across the solar system is STILL faster than the average contractor calls back an emergency lead."
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

  const topCardY = 145;
  drawRoundBox(ctx, 36, topCardY, W - 72, 165, 16, '#0b151c', 'rgba(74, 222, 128, 0.4)', 1.5);

  ctx.font = '700 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('⚡ LASER TO URANUS (2,000,000,000 MILES)', 56, topCardY + 22);

  ctx.font = '900 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('2.8 HOURS', 56, topCardY + 50);

  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('Crosses the entire outer solar system in 168 minutes', 56, topCardY + 98);

  const pulseX = 56 + ((t * 240) % (W - 140));
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(pulseX, topCardY + 138, 5, 0, Math.PI * 2);
  ctx.fill();

  // VS Badge
  const vsY = topCardY + 195;
  const vsPulse = 1.0 + Math.sin(t * 8) * 0.08;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(W / 2, vsY, 24 * vsPulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '900 16px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', W / 2, vsY);

  // Bottom Card: Contractor Callback
  const botCardY = vsY + 38;
  drawRoundBox(ctx, 36, botCardY, W - 72, 235, 16, '#160c0e', 'rgba(239, 68, 68, 0.45)', 1.5);

  ctx.font = '700 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('⏳ AVERAGE CONTRACTOR CALLBACK TIME', 56, botCardY + 22);

  const clockX = 102;
  const clockY = botCardY + 115;
  const clockR = 44;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(clockX, clockY, clockR, 0, Math.PI * 2);
  ctx.stroke();

  const secAngle = t * 16;
  const minAngle = t * 2.5;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.sin(secAngle) * 34, clockY - Math.cos(secAngle) * 34);
  ctx.stroke();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.sin(minAngle) * 24, clockY - Math.cos(minAngle) * 24);
  ctx.stroke();

  ctx.font = '900 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  ctx.fillText('27.4 HOURS', clockX + clockR + 22, clockY - 32);

  ctx.font = '700 14px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('To call back an emergency homeowner', clockX + clockR + 22, clockY + 8);

  ctx.font = '700 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText('⚠️ 9.7X SLOWER THAN DEEP SPACE LIGHT', clockX + clockR + 22, clockY + 34);

  ctx.font = '700 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.textAlign = 'center';
  ctx.fillText('By the time you call back, your competitor already cashed the check.', W / 2, botCardY + 195);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 4 (27.6s - 36.8s): Meet Bob — 20ft Up a Ladder in a Scorching 130° Attic
// "Picture this. Meet Bob. Bob is a master contractor standing twenty feet up a ladder in a scorching attic, drenched in sweat with a wrench in his hand."
// ----------------------------------------------------------------------------
function renderTasklessScene4_MeetBobAtticLadder(t) {
  ctx.save();
  // Warm scorching attic dark crimson/amber tint at top
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#180a05');
  bg.addColorStop(0.5, '#0c0705');
  bg.addColorStop(1, '#020202');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '130°F',
    topStatUnit: 'ATTIC',
    topSub1: 'STORY • MEET CONTRACTOR BOB',
    topSub2: '20FT UP ALUMINUM LADDER • HANDS FULL',
    rightLabel: 'THE STORY • 01'
  });

  // Attic Rafters & Copper Refrigerant Line at Top
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(30, 185);
  ctx.lineTo(W - 30, 185);
  ctx.stroke();

  // Copper HVAC Pipe
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(60, 215);
  ctx.lineTo(W - 60, 215);
  ctx.stroke();

  // Rising Scorching Heat Waves in Attic
  for (let h = 0; h < 6; h++) {
    const hx = 80 + h * 75;
    const hyOffset = (t * 45 + h * 30) % 180;
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let wy = 0; wy < 60; wy += 10) {
      const wx = hx + Math.sin(t * 6 + wy * 0.15 + h) * 8;
      const curY = 420 - hyOffset - wy;
      if (wy === 0) ctx.moveTo(wx, curY);
      else ctx.lineTo(wx, curY);
    }
    ctx.stroke();
  }

  // 20ft Aluminum Extension Ladder Centered-Left
  const floorY = 740;
  const ladderBaseX = 190;
  const ladderTopX = 215 + Math.sin(t * 2.2) * 2;
  const ladderTopY = 230;

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(ladderBaseX - 18, floorY);
  ctx.lineTo(ladderTopX - 18, ladderTopY);
  ctx.moveTo(ladderBaseX + 18, floorY);
  ctx.lineTo(ladderTopX + 18, ladderTopY);
  ctx.stroke();

  ctx.lineWidth = 2.5;
  for (let r = 0; r <= 12; r++) {
    const frac = r / 12;
    const rx1 = (ladderBaseX - 18) + (ladderTopX - ladderBaseX) * frac;
    const ry = floorY + (ladderTopY - floorY) * frac;
    ctx.beginPath();
    ctx.moveTo(rx1, ry);
    ctx.lineTo(rx1 + 36, ry);
    ctx.stroke();
  }

  // Contractor Bob on Ladder Turning Wrench
  const bobX = ladderTopX;
  const bobY = ladderTopY + 52;
  const bobBreath = Math.sin(t * 4.5) * 2.5;

  // High-Vis Orange Vest Torso
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(bobX, bobY);
  ctx.lineTo(bobX, bobY + 60);
  ctx.stroke();

  // Head & Hard Hat
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(bobX, bobY - 22 + bobBreath, 17, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(bobX, bobY - 26 + bobBreath, 20, Math.PI, Math.PI * 2);
  ctx.fill();
  drawRoundBox(ctx, bobX - 24, bobY - 26 + bobBreath, 48, 6, 2, '#facc15', null);

  // Sweat droplets pouring off Bob's forehead
  ctx.fillStyle = '#38bdf8';
  for (let sw = 0; sw < 4; sw++) {
    const swProg = ((t * 2.2 + sw * 0.25) % 1.0);
    const swX = bobX + 20 + sw * 6 + swProg * 8;
    const swY = (bobY - 20) + swProg * 75;
    ctx.beginPath();
    ctx.arc(swX, swY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Legs on Rungs
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 5.5;
  ctx.beginPath();
  ctx.moveTo(bobX, bobY + 60);
  ctx.lineTo(bobX - 15, bobY + 115);
  ctx.moveTo(bobX, bobY + 60);
  ctx.lineTo(bobX + 15, bobY + 115);
  ctx.stroke();

  // Right Arm + Animated Wrench Torqueing the Copper Pipe
  const wrenchAngle = Math.sin(t * 5.0) * 0.35;
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(bobX + 5, bobY + 8);
  ctx.lineTo(bobX + 36, bobY - 28);
  ctx.stroke();

  ctx.save();
  ctx.translate(bobX + 36, bobY - 28);
  ctx.rotate(wrenchAngle);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(28, -28);
  ctx.stroke();
  ctx.restore();

  // Left Arm gripping ladder rail
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(bobX - 5, bobY + 10);
  ctx.lineTo(ladderTopX - 18, bobY + 26);
  ctx.stroke();

  // Story Character Dossier Card on Right
  const cardX = 285;
  const cardY = 310;
  drawRoundBox(ctx, cardX, cardY, 220, 175, 14, '#0f172a', 'rgba(249, 115, 22, 0.5)', 1.5);

  ctx.font = '800 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#fb923c';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('👷‍♂️ CONTRACTOR PROFILE', cardX + 16, cardY + 18);

  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('MASTER BOB', cardX + 16, cardY + 42);

  ctx.font = '600 12px "Inter", sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('• 20ft up aluminum ladder', cardX + 16, cardY + 80);
  ctx.fillText('• 130°F Florida attic heat', cardX + 16, cardY + 102);
  ctx.fillText('• Both hands locked on wrench', cardX + 16, cardY + 124);
  ctx.fillStyle = '#facc15';
  ctx.fillText('• Phone buried in pocket', cardX + 16, cardY + 146);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 5 (36.8s - 44.2s): Sarah's Burst Ceiling Pipe Emergency Across Town
// "Across town, a pipe bursts in Sarah's ceiling and water is pouring everywhere. Panicking, she grabs her phone and calls Bob first."
// ----------------------------------------------------------------------------
function renderTasklessScene5_SarahBurstPipe(t) {
  ctx.save();
  ctx.fillStyle = '#02060d';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: 'EMERGENCY',
    topSub1: "ACROSS TOWN • SARAH'S LIVING ROOM",
    topSub2: 'BURST CEILING PIPE • WATER FLOODING',
    rightLabel: 'THE STORY • 02'
  });

  const ceilingY = 165;
  const floorY = 720;

  // Ceiling & Floor
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(36, ceilingY);
  ctx.lineTo(W - 36, ceilingY);
  ctx.moveTo(36, floorY);
  ctx.lineTo(W - 36, floorY);
  ctx.stroke();

  // Burst Pipe on Ceiling
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(70, ceilingY - 8);
  ctx.lineTo(215, ceilingY - 8);
  ctx.lineTo(215, ceilingY + 28);
  ctx.stroke();

  // Pressurized Water Gushing & Flooding
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  for (let s = 0; s < 6; s++) {
    const sprayAngle = Math.PI / 2 + Math.sin(t * 22 + s * 1.1) * 0.48;
    const sprayLen = 28 + Math.sin(t * 16 + s * 2) * 14;
    ctx.beginPath();
    ctx.moveTo(215, ceilingY + 28);
    ctx.lineTo(215 + Math.cos(sprayAngle) * sprayLen, ceilingY + 28 + Math.sin(sprayAngle) * sprayLen);
    ctx.stroke();
  }

  ctx.fillStyle = '#38bdf8';
  for (let d = 0; d < 9; d++) {
    const dropProg = ((t * 3.0 + d * 0.11) % 1.0);
    const dropY = ceilingY + 34 + dropProg * (floorY - (ceilingY + 34));
    const dropX = 215 + Math.sin(dropProg * 8 + d) * 8;
    ctx.beginPath();
    ctx.arc(dropX, dropY, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bucket overflowing on floor
  const bucketX = 215;
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(bucketX - 30, floorY);
  ctx.lineTo(bucketX - 22, floorY - 46);
  ctx.lineTo(bucketX + 22, floorY - 46);
  ctx.lineTo(bucketX + 30, floorY);
  ctx.closePath();
  ctx.fill();

  // Rising water puddle across floor
  const puddleW = 120 + Math.sin(t * 5) * 15;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.beginPath();
  ctx.ellipse(bucketX, floorY, puddleW, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Homeowner Sarah Frantically Calling Bob
  const sarahX = 375 + Math.sin(t * 4) * 5;
  const sarahY = floorY - 115;

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(sarahX, sarahY - 50, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(sarahX, sarahY - 32);
  ctx.lineTo(sarahX, sarahY + 42);
  ctx.moveTo(sarahX, sarahY + 42);
  ctx.lineTo(sarahX - 18, floorY);
  ctx.moveTo(sarahX, sarahY + 42);
  ctx.lineTo(sarahX + 18, floorY);
  ctx.stroke();

  // Sarah holding phone to ear
  ctx.beginPath();
  ctx.moveTo(sarahX, sarahY - 16);
  ctx.lineTo(sarahX - 22, sarahY - 36);
  ctx.lineTo(sarahX - 14, sarahY - 50);
  ctx.stroke();

  // Other arm waving in panic
  const panicWave = Math.sin(t * 10) * 14;
  ctx.beginPath();
  ctx.moveTo(sarahX, sarahY - 16);
  ctx.lineTo(sarahX + 32, sarahY - 42 + panicWave);
  ctx.stroke();

  // Call Status Banner Above Sarah
  drawRoundBox(ctx, 270, 250, 234, 110, 14, '#0f172a', 'rgba(56, 189, 248, 0.6)', 1.5);
  ctx.font = '800 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('📲 SARAH CALLING BOB FIRST', 286, 268);

  ctx.font = '900 20px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText("BOB'S MASTER HVAC", 286, 292);

  ctx.font = '600 12px "Inter", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText('• Dialing #1 Google Result...', 286, 326);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 6 (44.2s - 51.4s): Bob's Phone Buzzing 3 Times & Dumping to Voicemail
// "Bob's phone buzzes in his pocket, once, twice, three times, and dumps straight to voicemail. Sarah doesn't leave a message,"
// ----------------------------------------------------------------------------
function renderTasklessScene6_PhoneBuzzToVoicemail(t) {
  ctx.save();
  ctx.fillStyle = '#040406';
  ctx.fillRect(0, 0, W, H);

  const isVoicemail = (t >= 48.3);

  drawTasklessHUD(ctx, {
    topStat: isVoicemail ? 'VOICEMAIL' : 'RINGING...',
    topSub1: "BOB'S POCKET PHONE • 20FT UP LADDER",
    topSub2: isVoicemail ? 'CALL DROPPED • ZERO MESSAGE LEFT' : 'BUZZING ONCE... TWICE... THREE TIMES',
    rightLabel: 'THE STORY • 03'
  });

  // Giant Smartphone Schematic in Center Vibrating Violently
  const vibeX = isVoicemail ? 0 : Math.sin(t * 55) * 6;
  const vibeY = isVoicemail ? 0 : Math.cos(t * 45) * 3;
  const phoneW = 240;
  const phoneH = 420;
  const phoneX = (W - phoneW) / 2 + vibeX;
  const phoneY = 175 + vibeY;

  // Concentric Buzz Shockwaves around Phone
  if (!isVoicemail) {
    for (let w = 1; w <= 3; w++) {
      const ringR = 130 + w * 28 + ((t * 60) % 25);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(250, 204, 21, ' + (0.45 - w * 0.1) + ')';
      ctx.lineWidth = 2;
      ctx.arc(W / 2, phoneY + phoneH / 2, ringR, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawRoundBox(ctx, phoneX, phoneY, phoneW, phoneH, 28, '#0f172a', isVoicemail ? '#ef4444' : '#facc15', 3);

  // Speaker Notch
  drawRoundBox(ctx, phoneX + phoneW / 2 - 30, phoneY + 14, 60, 6, 3, '#334155', null);

  // Caller Avatar Circle
  ctx.fillStyle = isVoicemail ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)';
  ctx.beginPath();
  ctx.arc(phoneX + phoneW / 2, phoneY + 95, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '32px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(isVoicemail ? '🔇' : '📲', phoneX + phoneW / 2, phoneY + 95);

  ctx.font = '800 18px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('HOMEOWNER SARAH', phoneX + phoneW / 2, phoneY + 160);

  ctx.font = '700 13px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('EMERGENCY PIPE & AC ($8,000)', phoneX + phoneW / 2, phoneY + 184);

  // 3 Buzz Indicators (Once, Twice, Three Times)
  const rings = [
    { label: 'BUZZ #1', active: t >= 44.4 },
    { label: 'BUZZ #2', active: t >= 45.6 },
    { label: 'BUZZ #3', active: t >= 46.6 }
  ];

  rings.forEach((rg, idx) => {
    const ry = phoneY + 218 + idx * 38;
    const bgCol = rg.active ? (isVoicemail ? 'rgba(239, 68, 68, 0.2)' : 'rgba(250, 204, 21, 0.2)') : '#1e293b';
    const borderCol = rg.active ? (isVoicemail ? '#ef4444' : '#facc15') : '#334155';
    drawRoundBox(ctx, phoneX + 24, ry, phoneW - 48, 30, 8, bgCol, borderCol, 1.5);

    ctx.font = '800 12px "JetBrains Mono", sans-serif';
    ctx.fillStyle = rg.active ? '#ffffff' : '#64748b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(rg.label + (rg.active ? ' • UNANSWERED' : ''), phoneX + phoneW / 2, ry + 15);
  });

  // Bottom Voicemail Graveyard Banner inside Phone
  const vmBg = isVoicemail ? '#ef4444' : '#1e293b';
  drawRoundBox(ctx, phoneX + 20, phoneY + 345, phoneW - 40, 52, 10, vmBg, null);
  ctx.font = '900 14px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(isVoicemail ? '❌ DUMPED TO VOICEMAIL' : '⏳ BOB CANNOT REACH PHONE', phoneX + phoneW / 2, phoneY + 363);
  ctx.font = '600 11px "Inter", sans-serif';
  ctx.fillText(isVoicemail ? 'Sarah hangs up immediately' : 'Hands locked on wrench in attic', phoneX + phoneW / 2, phoneY + 382);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 7 (51.4s - 57.5s): The 78% Conversion Benchmark
// "because 78% of homeowners hire the very first business that answers."
// ----------------------------------------------------------------------------
function renderTasklessScene7_Stat78Percent(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '78%',
    topSub1: 'WIN RATE OF 1ST RESPONDER',
    topSub2: 'HOMEOWNERS NEVER LEAVE VOICEMAILS',
    rightLabel: 'THE LAW • 04'
  });

  const prog = Math.min(1.0, Math.max(0, (t - 51.4) / 1.0));
  const currentStat = Math.floor(prog * 78);

  ctx.font = '900 116px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(250, 204, 21, 0.5)';
  ctx.shadowBlur = 32;
  ctx.fillText(currentStat + '%', W / 2, H * 0.35);
  ctx.shadowBlur = 0;

  ctx.font = '800 19px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('HIRE THE VERY FIRST SHOP THAT ANSWERS', W / 2, H * 0.45);

  const laneY = H * 0.54;
  const laneW = W - 72;
  const laneX = 36;

  // Lane 1: First Responder
  drawRoundBox(ctx, laneX, laneY, laneW, 64, 12, '#0f172a', 'rgba(34, 197, 94, 0.5)', 1.5);
  const barProg = Math.min(1.0, Math.max(0.1, (t - 51.8) / 1.2));
  drawRoundBox(ctx, laneX + 4, laneY + 4, (laneW - 8) * 0.78 * barProg, 56, 8, '#22c55e', null);

  ctx.font = '800 15px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡ ANSWERS ON RING 1', laneX + 16, laneY + 32);
  ctx.textAlign = 'right';
  ctx.fillText('WINS $8,000 JOB', laneX + laneW - 16, laneY + 32);

  // Lane 2: Bob's Voicemail
  const lane2Y = laneY + 84;
  drawRoundBox(ctx, laneX, lane2Y, laneW, 64, 12, '#160c0e', 'rgba(239, 68, 68, 0.45)', 1.5);
  drawRoundBox(ctx, laneX + 4, lane2Y + 4, (laneW - 8) * 0.22, 56, 8, 'rgba(239, 68, 68, 0.28)', null);

  ctx.font = '800 15px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText("🔇 BOB'S VOICEMAIL", laneX + 16, lane2Y + 32);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ef4444';
  ctx.fillText('$0 • LOST LEAD', laneX + laneW - 16, lane2Y + 32);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 8 (57.5s - 64.8s): Sarah Taps Next Contractor on Google & Competitor Steals $8,000 Check
// "Within ten seconds, she taps the next contractor on Google. That shop answers on ring one, rolls a truck, and collects an $8,000 check that had Bob's name written all over it."
// ----------------------------------------------------------------------------
function renderTasklessScene8_CompetitorStealsCheck(t) {
  ctx.save();
  ctx.fillStyle = '#030509';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '-$8,000',
    topStatUnit: 'LOST',
    topSub1: 'SARAH TAPS NEXT CONTRACTOR ON GOOGLE',
    topSub2: 'COMPETITOR ANSWERS RING 1 & ROLLS TRUCK',
    rightLabel: 'THE STORY • 05'
  });

  // Google Search Results Card at Top
  const searchY = 145;
  drawRoundBox(ctx, 36, searchY, W - 72, 165, 14, '#0f172a', '#334155', 1.5);

  // Row 1: Bob's Shop (Crossed out / Missed)
  drawRoundBox(ctx, 52, searchY + 18, W - 104, 56, 8, 'rgba(239, 68, 68, 0.12)', 'rgba(239, 68, 68, 0.4)', 1);
  ctx.font = '800 14px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText("1. Bob's Master HVAC & Plumbing", 68, searchY + 38);
  ctx.font = '700 11px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.fillText('❌ NO ANSWER (VOICEMAIL) — SKIPPED IN 10s', 68, searchY + 58);

  // Row 2: Competitor Shop (Tapped & Hired!)
  drawRoundBox(ctx, 52, searchY + 86, W - 104, 62, 8, 'rgba(34, 197, 94, 0.16)', '#22c55e', 1.5);
  ctx.font = '800 14px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('2. Apex Express Rival Contractors', 68, searchY + 106);
  ctx.font = '700 11px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('✅ ANSWERED ON RING 1 • TRUCK DISPATCHED', 68, searchY + 128);

  // Flying $8,000 Check with "BOB'S NAME" crossed out landing in Competitor Truck!
  const checkY = 355 + Math.sin(t * 6) * 6;
  drawRoundBox(ctx, 56, checkY, W - 112, 130, 14, '#062c19', '#22c55e', 2);

  ctx.font = '700 11px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#86efac';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('💵 HOMEOWNER REPLACEMENT CHECK #4092', 76, checkY + 16);

  ctx.font = '900 38px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('$8,000.00', 76, checkY + 40);

  // Pay to the order of: BOB crossed out -> COMPETITOR
  ctx.font = '700 13px "Inter", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.fillText("PAY TO: BOB'S HVAC", 76, checkY + 92);
  // Red strikethrough line over Bob's name
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(132, checkY + 99);
  ctx.lineTo(222, checkY + 99);
  ctx.stroke();

  ctx.font = '800 14px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText('➔ HANDED TO COMPETITOR!', 232, checkY + 91);

  // Competitor Truck Driving Across Street at Y = 665
  const streetY = 710;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(24, streetY);
  ctx.lineTo(W - 24, streetY);
  ctx.stroke();

  const truckProg = ((t - 57.5) / 7.3);
  const truckX = 60 + Math.min(1.0, Math.max(0, truckProg)) * 240;
  const truckY = streetY - 62;

  drawRoundBox(ctx, truckX, truckY, 155, 52, 8, '#1e293b', '#38bdf8', 1.5);
  drawRoundBox(ctx, truckX + 95, truckY - 14, 75, 66, 6, '#334155', '#475569', 1.5);

  ctx.font = '800 11px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.fillText('RIVAL #2 TRUCK', truckX + 12, truckY + 26);

  ctx.font = '900 14px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('+$8,000', truckX + 104, truckY + 22);

  // Wheels
  for (let w = 0; w < 2; w++) {
    const wx = truckX + 35 + w * 102;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(wx, streetY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(wx, streetY, 16, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 9 (64.8s - 76.2s): Ava 0.8s Autonomous Answer, Booking & SMS Dispatch to Bob
// "That is why we built Ava. She answers your phone in 0.8 seconds, calms the homeowner down, qualifies the job, books your calendar, and texts the dispatch straight to Bob's phone before the customer can even open another Google tab."
// ----------------------------------------------------------------------------
function renderTasklessScene9_AvaInstantReply(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '0.8s',
    topStatUnit: 'SPEED',
    topSub1: 'AVA 24/7 AUTONOMOUS VOICE AI',
    topSub2: 'ANSWERS • QUALIFIES • BOOKS • TEXTS BOB',
    rightLabel: 'AVA SOLUTION'
  });

  const orbX = W / 2;
  const orbY = 255;
  const orbR = 64;

  ctx.save();
  for (let r = 1; r <= 3; r++) {
    const ringRadius = orbR + r * 18;
    const ringAngle = (t * (0.9 / r)) % (Math.PI * 2);
    ctx.save();
    ctx.translate(orbX, orbY);
    ctx.rotate(ringAngle);
    ctx.strokeStyle = (r === 1) ? 'rgba(34, 197, 94, 0.45)' : 'rgba(103, 232, 249, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([12, 14]);
    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const coreGrad = ctx.createRadialGradient(orbX, orbY, 8, orbX, orbY, orbR);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.35, '#34d399');
  coreGrad.addColorStop(0.75, '#059669');
  coreGrad.addColorStop(1, 'rgba(5, 150, 105, 0.1)');
  ctx.fillStyle = coreGrad;
  ctx.shadowColor = 'rgba(52, 211, 153, 0.8)';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.font = '900 28px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AVA', orbX, orbY);
  ctx.restore();

  // 32-Band Reactive Audio Waveform
  const waveY = 385;
  const waveW = W - 96;
  const waveX = 48;
  const barCount = 32;
  const barW = (waveW / barCount) - 4;

  ctx.save();
  for (let b = 0; b < barCount; b++) {
    const bx = waveX + b * (barW + 4);
    const waveFreq = Math.abs(Math.sin(t * 12 + b * 0.4) * Math.cos(t * 7 + b * 0.2));
    const barH = 8 + waveFreq * 46;

    const barGrad = ctx.createLinearGradient(bx, waveY - barH / 2, bx, waveY + barH / 2);
    barGrad.addColorStop(0, '#67e8f9');
    barGrad.addColorStop(0.5, '#34d399');
    barGrad.addColorStop(1, '#059669');
    drawRoundBox(ctx, bx, waveY - barH / 2, barW, barH, 3, barGrad, null);
  }
  ctx.restore();

  // Compact Dispatch Card (Positioned cleanly above the caption zone: Y=440 to Y=660)
  const cardY = 440;
  const cardH = 215;
  drawRoundBox(ctx, 36, cardY, W - 72, cardH, 16, '#0f172a', 'rgba(52, 211, 153, 0.5)', 1.5);

  const items = [
    { icon: '⚡', title: 'ANSWERED IN 0.8 SECONDS', sub: 'Sarah calmed down & emergency qualified', color: '#34d399' },
    { icon: '📅', title: 'CALENDAR LOCKED ($8,000 JOB)', sub: "Booked onto Bob's afternoon schedule", color: '#67e8f9' },
    { icon: '📲', title: 'INSTANT SMS DISPATCH TO BOB', sub: "Texted straight to Bob's phone on ladder", color: '#facc15' }
  ];

  items.forEach((item, idx) => {
    const itemY = cardY + 20 + idx * 64;
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(item.icon, 56, itemY);

    ctx.font = '800 14px "Space Grotesk", sans-serif';
    ctx.fillStyle = item.color;
    ctx.fillText(item.title, 88, itemY + 2);

    ctx.font = '600 12px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.fillText(item.sub, 88, itemY + 22);
  });

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 10 (76.2s - 81.0s): Revenue Protection Waterfall
// "Stop handing $8,000 checks to your competitors."
// ----------------------------------------------------------------------------
function renderTasklessScene10_RevenueWaterfall(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: '+$80,000',
    topStatUnit: 'MO',
    topSub1: 'PROTECTED REVENUE CAPTURE',
    topSub2: '10 SAVED HIGH-TICKET JOBS / MONTH',
    rightLabel: 'ROI SCHEMATIC'
  });

  ctx.save();
  for (let d = 0; d < 26; d++) {
    const dx = 48 + (d * 19) % (W - 96);
    const dy = 150 + ((t * 160 + d * 45) % 520);
    const dAlpha = 0.18 + 0.45 * Math.sin(t * 3 + d);
    ctx.fillStyle = 'rgba(34, 197, 94, ' + dAlpha + ')';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.fillText('$', dx, dy);
  }
  ctx.restore();

  const countProg = Math.min(1.0, Math.max(0.1, (t - 76.2) / 1.4));
  const currentDollars = Math.floor(countProg * 80000);

  ctx.font = '900 66px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#22c55e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(34, 197, 94, 0.5)';
  ctx.shadowBlur = 28;
  ctx.fillText('+$' + currentDollars.toLocaleString(), W / 2, 340);
  ctx.shadowBlur = 0;

  ctx.font = '800 17px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('REVENUE KEPT IN YOUR SHOP EVERY MONTH', W / 2, 405);

  const boxY = 455;
  drawRoundBox(ctx, 36, boxY, W - 72, 180, 14, '#0f172a', 'rgba(34, 197, 94, 0.4)', 1.5);

  const metrics = [
    { label: 'AVERAGE EMERGENCY TICKET', val: '$8,000.00' },
    { label: 'MISSED CALLS CAPTURED / MO', val: '10 JOBS' },
    { label: 'AVA PICKUP SPEED', val: '0.8 SECONDS' }
  ];

  metrics.forEach((m, idx) => {
    const my = boxY + 32 + idx * 48;
    ctx.font = '700 12px "JetBrains Mono", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(m.label, 56, my);

    ctx.font = '800 16px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#4ade80';
    ctx.textAlign = 'right';
    ctx.fillText(m.val, W - 56, my);
  });

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 11 (81.0s - 85.2s): Live Interactive Demo Dialer
// "Call the live demo number on your screen right now to hear Ava answer live,"
// ----------------------------------------------------------------------------
function renderTasklessScene11_LiveDialerInteractive(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: 'LIVE DEMO',
    topSub1: '24/7 INTERACTIVE DIALER',
    topSub2: 'CALL AVA RIGHT NOW ON SCREEN',
    rightLabel: 'TEST AVA LIVE'
  });

  const btnX = W / 2;
  const btnY = 345;
  const btnR = 82;

  for (let r = 0; r < 4; r++) {
    const ringLoop = ((t * 45 + r * 28) % 115);
    const ringAlpha = Math.max(0, 0.5 * (1 - ringLoop / 115));
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(34, 197, 94, ' + ringAlpha + ')';
    ctx.lineWidth = 2.0;
    ctx.arc(btnX, btnY, btnR + ringLoop, 0, Math.PI * 2);
    ctx.stroke();
  }

  const btnGrad = ctx.createRadialGradient(btnX - 20, btnY - 20, 10, btnX, btnY, btnR);
  btnGrad.addColorStop(0, '#4ade80');
  btnGrad.addColorStop(0.7, '#22c55e');
  btnGrad.addColorStop(1, '#15803d');
  ctx.fillStyle = btnGrad;
  ctx.shadowColor = 'rgba(34, 197, 94, 0.7)';
  ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.arc(btnX, btnY, btnR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.save();
  ctx.translate(btnX, btnY - 8);
  ctx.rotate(Math.sin(t * 8) * 0.12);
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📞', 0, 0);
  ctx.restore();

  ctx.font = '800 16px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('CALL LIVE NOW', btnX, btnY + 42);

  const numCardY = 515;
  drawRoundBox(ctx, 36, numCardY, W - 72, 115, 16, '#0f172a', 'rgba(34, 197, 94, 0.55)', 2);

  ctx.font = '900 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('(561) 813-8602', W / 2, numCardY + 22);

  ctx.font = '700 13px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('• LIVE 24/7 • AVA ANSWERS IN 0.8s', W / 2, numCardY + 74);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 12 (85.2s - 89.0s): The Taskless End Card
// "or comment AVA below and we will DM you the free interactive link."
// ----------------------------------------------------------------------------
function renderTasklessScene12_TasklessEndCard(t) {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  drawTasklessHUD(ctx, {
    topStat: 'FREE LINK',
    topSub1: 'DIRECT RESPONSE ACCESS',
    topSub2: 'INSTANT AUTOMATED DM',
    rightLabel: 'VANTORX.COM'
  });

  const bannerY = 290;
  const borderPulse = 0.5 + 0.5 * Math.sin(t * 8);

  drawRoundBox(ctx, 36, bannerY, W - 72, 145, 20, '#17140b', 'rgba(250, 204, 21, ' + (0.5 + borderPulse * 0.5) + ')', 3);

  ctx.font = '700 14px "JetBrains Mono", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('DROP A COMMENT BELOW', W / 2, bannerY + 24);

  ctx.font = '900 50px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = 'rgba(250, 204, 21, 0.6)';
  ctx.shadowBlur = 20;
  ctx.fillText('COMMENT "AVA"', W / 2, bannerY + 54);
  ctx.shadowBlur = 0;

  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('We will instantly DM you the free interactive link', W / 2, bannerY + 114);

  const arrowY = bannerY + 185;
  const arrowBounce = Math.sin(t * 7) * 8;
  ctx.font = '38px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⬇️', W / 2, arrowY + arrowBounce);

  ctx.font = '800 20px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('VANTORX AUTOMATION', W / 2, 575);

  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('Speed to Lead AI Engine • (561) 813-8602', W / 2, 602);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// CUEVA-STYLE KINETIC CAPTIONS — EXACT ELEVENLABS WORD ALIGNMENT
// Positioned cleanly in dedicated lower-third zone (Y = H - 125 = 835),
// proportioned for 540x960 canvas (28px bold italic typography, zero overflow, zero overlap)
// ----------------------------------------------------------------------------
const CAPTION_CHUNKS = ${JSON.stringify(chunks)};

function renderPreciseCaptions(time) {
  const chunk = CAPTION_CHUNKS.find(c => time >= c.start && time <= c.end);
  if (!chunk) return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const subY = H - 125; // Dedicated clear zone (y = 835 on 960px canvas)
  const fontSpec = '900 italic 29px "Space Grotesk", "Inter", sans-serif';
  ctx.font = fontSpec;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  const spaceW = ctx.measureText(' ').width * 1.15;
  const wordWidths = chunk.words.map(w => ctx.measureText(w.rawWord).width);
  const totalTextW = wordWidths.reduce((a, b) => a + b, 0) + (chunk.words.length - 1) * spaceW;

  // Sleek soft dark backdrop pill (no gaudy yellow border, never overflows 540px canvas)
  const padX = 20;
  const padY = 12;
  const pillW = Math.min(W - 32, totalTextW + padX * 2);
  const pillH = 38 + padY;
  const pillX = (W - pillW) / 2;
  const pillY = subY - pillH / 2;

  drawRoundBox(ctx, pillX, pillY, pillW, pillH, 12, 'rgba(4, 7, 14, 0.84)', 'rgba(255, 255, 255, 0.10)', 1);

  let curX = (W - totalTextW) / 2;
  chunk.words.forEach((w, idx) => {
    const isSpoken = (time >= w.start && time <= w.end);
    const hasBeenSpoken = (time > w.end);

    ctx.save();
    ctx.font = fontSpec;

    // Crisp black outline for 100% legibility
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.strokeText(w.rawWord, curX, subY);

    if (isSpoken) {
      ctx.fillStyle = '#facc15'; // Electric amber gold highlight on active spoken word
      ctx.shadowColor = 'rgba(250, 204, 21, 0.65)';
      ctx.shadowBlur = 10;
    } else if (hasBeenSpoken) {
      ctx.fillStyle = '#ffffff';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
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

  ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 1.2);
  }

  const beamY = (time * 160) % (H + 300) - 150;
  const beamGrad = ctx.createLinearGradient(0, beamY - 100, 0, beamY + 100);
  beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  beamGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.03)');
  beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(0, beamY - 100, W, 200);

  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.38, W / 2, H / 2, H * 0.78);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(5, 7, 13, 0.40)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}

function renderFrame(time) {
  window.renderFrame = renderFrame;

  if (!Number.isFinite(time) || isNaN(time) || time < 0) {
    time = 0;
  }
  time = Math.min(time, TOTAL_DURATION || 89.0);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);
  ctx.beginPath();

  ctx.save();

  // Continuous organic camera motion (zero motionless frames!)
  const camZoom = 1.015 + Math.sin(time * 0.4) * 0.018 + ((time % 7.0) / 7.0) * 0.03;
  const camPanX = Math.sin(time * 0.7) * 4.5 + Math.cos(time * 1.2) * 2.0;
  const camPanY = Math.cos(time * 0.5) * 3.5 + Math.sin(time * 0.9) * 1.8;

  ctx.translate(W / 2, H / 2);
  ctx.scale(camZoom, camZoom);
  ctx.translate(-W / 2 + camPanX, -H / 2 + camPanY);

  // 12-SCENE PROGRESSION ALIGNED 1:1 TO THE 89.0s EXTENDED HOOK & BOB/SARAH STORY
  if (time < 8.0) {
    renderTasklessScene1_LaserCrowd(time);
  } else if (time < 21.0) {
    renderTasklessScene2_EarthToUranus(time);
  } else if (time < 27.6) {
    renderTasklessScene3_SpaceVsContractorContrast(time);
  } else if (time < 36.8) {
    renderTasklessScene4_MeetBobAtticLadder(time);
  } else if (time < 44.2) {
    renderTasklessScene5_SarahBurstPipe(time);
  } else if (time < 51.4) {
    renderTasklessScene6_PhoneBuzzToVoicemail(time);
  } else if (time < 57.5) {
    renderTasklessScene7_Stat78Percent(time);
  } else if (time < 64.8) {
    renderTasklessScene8_CompetitorStealsCheck(time);
  } else if (time < 76.2) {
    renderTasklessScene9_AvaInstantReply(time);
  } else if (time < 81.0) {
    renderTasklessScene10_RevenueWaterfall(time);
  } else if (time < 85.2) {
    renderTasklessScene11_LiveDialerInteractive(time);
  } else {
    renderTasklessScene12_TasklessEndCard(time);
  }

  drawAmbientDustParticles(ctx, time);

  // Smooth cinematic transition at scene cuts
  const sceneCuts = [8.0, 21.0, 27.6, 36.8, 44.2, 51.4, 57.5, 64.8, 76.2, 81.0, 85.2];
  let minCutDist = 999;
  for (let c = 0; c < sceneCuts.length; c++) {
    minCutDist = Math.min(minCutDist, Math.abs(time - sceneCuts[c]));
  }
  if (minCutDist < 0.15) {
    const fadeProg = 1 - (minCutDist / 0.15);
    const dipAlpha = Math.sin(fadeProg * (Math.PI / 2)) * 0.24;
    ctx.fillStyle = 'rgba(0, 0, 0, ' + dipAlpha + ')';
    ctx.fillRect(0, 0, W, H);
  }

  renderPreciseCaptions(time);
  renderCRTScanlines(time);

  ctx.restore();
}
`;

const outPath = path.resolve(__dirname, 'taskless_engine_code.js');
fs.writeFileSync(outPath, engineCode, 'utf8');
console.log('Successfully generated scripts/taskless_engine_code.js (' + engineCode.length + ' chars)');
