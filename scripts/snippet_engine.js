// 🎨 IMMERSIVE STICK FIGURE STORY ANIMATION ENGINE (SILKY SMOOTH & CLEAN)
// Smooth motion, fluid kinematics, organic easing, soft particle physics, zero jitter
// =========================================================================

// --- 42 CONTINUOUS LIVING AMBIENT PARTICLES (SILKY SMOOTH DRIFT) ---
const AMBIENT_PARTICLES = Array.from({ length: 42 }, (_, i) => ({
  x: Math.random() * 540,
  y: Math.random() * 960,
  vx: (Math.random() - 0.5) * 0.35, // Gentle, relaxing drift
  vy: -0.25 - Math.random() * 0.45,
  size: 1.5 + Math.random() * 2.0,
  alpha: 0.18 + Math.random() * 0.35,
  color: i % 4 === 0 ? '#38bdf8' : (i % 4 === 1 ? '#c8ff00' : (i % 4 === 2 ? '#a855f7' : '#ffffff')),
  pulseSpeed: 1.2 + Math.random() * 1.8
}));

// --- LIVING DARK CANVAS BACKGROUND WITH CONTINUOUS SMOOTH PARTICLES ---
function renderDynamicAtmosphere(t, storyType) {
  // Deep clean midnight chalkboard navy with very gentle gradient breathing
  const shiftY = Math.sin(t * 0.25) * 20;
  const grad = ctx.createLinearGradient(0, -shiftY, 0, H + shiftY);
  grad.addColorStop(0, '#090d16');
  grad.addColorStop(0.5, '#0d1322');
  grad.addColorStop(1, '#080c14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Smooth floating ambient particle drift (organic & non-distracting)
  ctx.save();
  for (let i = 0; i < AMBIENT_PARTICLES.length; i++) {
    const p = AMBIENT_PARTICLES[i];
    p.y += p.vy;
    p.x += p.vx + Math.sin(t * 0.8 + i) * 0.15;
    if (p.y < -10) p.y = H + 10;
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;

    // Smooth sinusoidal alpha pulsing (no abrupt blinking)
    const pulse = 0.6 + 0.4 * Math.sin(t * p.pulseSpeed + i);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha * pulse;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Clean floor ground line with gentle ambient sheen
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, H - 180);
  ctx.lineTo(W, H - 180);
  ctx.stroke();

  // Smooth floor light glide
  const scanX = (t * 70) % (W + 240) - 120;
  const scanGrad = ctx.createLinearGradient(scanX - 70, 0, scanX + 70, 0);
  scanGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  scanGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.18)');
  scanGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.strokeStyle = scanGrad;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(scanX - 70, H - 180);
  ctx.lineTo(scanX + 70, H - 180);
  ctx.stroke();
  ctx.restore();
}

// --- EXPRESSIVE STICK FIGURE CHARACTER DRAWING ROUTINE 3.0 (BUTTERY SMOOTH) ---
function drawStickPerson(ctx, x, y, opts) {
  opts = opts || {};
  const t = opts.t || 0;
  ctx.save();

  // Gentle, organic breathing & idle squash-and-stretch (NO rapid jitter)
  const breath = Math.sin(t * 2.8) * 2.0;
  const squashY = 1.0 + Math.sin(t * 2.8) * 0.015;
  const squashX = 1.0 - Math.sin(t * 2.8) * 0.012;

  ctx.translate(x, y + breath);

  const scale = opts.scale || 1.0;
  const facing = opts.facing || 1; // 1 = right, -1 = left
  ctx.scale(facing * scale * squashX, scale * squashY);

  const color = opts.color || '#ffffff';
  ctx.strokeStyle = color;
  ctx.lineWidth = opts.lineWidth || 4.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const headRadius = 22;
  const headY = -120;
  const neckY = -98;
  const hipY = -35;
  const footY = 0;

  // 1. HEAD
  ctx.fillStyle = opts.headFill || '#0d1322';
  ctx.beginPath();
  ctx.arc(0, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Natural Blinking: smooth 0.15s blink every 3.5s
  const blinkCycle = t % 3.5;
  const isBlink = blinkCycle < 0.14;

  // 2. FACIAL EXPRESSIONS (CLEAN & EXPRESSIVE)
  const expr = opts.expr || 'happy';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (isBlink && expr !== 'sleep') {
    // Soft closed eyes
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-9, headY - 2); ctx.lineTo(-3, headY - 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3, headY - 2); ctx.lineTo(9, headY - 2); ctx.stroke();
  } else if (expr === 'happy') {
    // Smiling eyes ^ ^
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(-7, headY - 2, 4, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(7, headY - 2, 4, Math.PI, 0); ctx.stroke();

    // Natural talking mouth
    const mouthOpen = opts.talking ? Math.abs(Math.sin(t * 7)) * 4.5 : 0;
    if (mouthOpen > 1.2) {
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.ellipse(0, headY + 6, 5.5, mouthOpen, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, headY + 5, 7.5, 0, Math.PI);
      ctx.stroke();
    }
  } else if (expr === 'panic' || expr === 'shock') {
    // Wide shocked eyes O O with very subtle breathing
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(-7, headY - 2, 5.5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(7, headY - 2, 5.5, 0, Math.PI * 2); ctx.stroke();

    // Open gasping mouth
    const mouthSize = 6 + Math.sin(t * 5) * 1.2;
    ctx.beginPath(); ctx.arc(0, headY + 8, mouthSize, 0, Math.PI * 2); ctx.stroke();

    // Smooth floating sweat droplets with parabolic fade
    for (let sw = 0; sw < 2; sw++) {
      const swT = (t * 2.2 + sw * 0.7) % 1.5;
      const swProg = swT / 1.5;
      const swDist = swProg * 26;
      const swX = 14 + swDist * 0.8;
      const swY = headY - 10 + swDist * 0.5;
      const swAlpha = Math.sin(swProg * Math.PI); // Smooth fade in and out!
      ctx.fillStyle = 'rgba(56, 189, 248, ' + (swAlpha * 0.85) + ')';
      ctx.beginPath();
      ctx.arc(swX, swY, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (expr === 'sweat') {
    // Stressed eyebrows
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-10, headY - 4); ctx.lineTo(-4, headY - 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4, headY - 2); ctx.lineTo(10, headY - 4); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, headY + 6, 6.5, 0, Math.PI); ctx.stroke();

    // Smooth teardrop sweat arc
    for (let sw = 0; sw < 2; sw++) {
      const swT = (t * 2.0 + sw * 0.8) % 1.6;
      const swProg = swT / 1.6;
      const swX = 16 + swProg * 20;
      const swY = headY - 8 + swProg * 16;
      const swAlpha = Math.sin(swProg * Math.PI);
      ctx.fillStyle = 'rgba(56, 189, 248, ' + (swAlpha * 0.85) + ')';
      ctx.beginPath();
      ctx.arc(swX, swY, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (expr === 'sad') {
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(-7, headY - 2, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(7, headY - 2, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, headY + 12, 7.5, Math.PI, 0); ctx.stroke();
  } else if (expr === 'sleep') {
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-10, headY); ctx.lineTo(-4, headY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(4, headY); ctx.lineTo(10, headY); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, headY + 6, 5.5, 0, Math.PI); ctx.stroke();
  }

  // 3. HARD HAT (Contractor)
  if (opts.hat === 'hardhat') {
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, headY - 14, headRadius + 2, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(-headRadius - 8, headY - 14, (headRadius + 8) * 2, 6, 3);
    ctx.fill();
    ctx.stroke();
  } else if (opts.hat === 'nightcap') {
    const capSway = Math.sin(t * 1.8) * 4;
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(-headRadius, headY - 12);
    ctx.quadraticCurveTo(0, headY - 48, 30 + capSway, headY - 40);
    ctx.lineTo(headRadius, headY - 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(32 + capSway, headY - 40, 6, 0, Math.PI * 2); ctx.fill();
  }

  // 4. TORSO (Spine)
  ctx.strokeStyle = color;
  ctx.lineWidth = opts.lineWidth || 4.2;
  ctx.beginPath();
  ctx.moveTo(0, neckY);
  ctx.lineTo(0, hipY);
  ctx.stroke();

  // Safety Vest
  if (opts.vest) {
    ctx.fillStyle = '#a3e635';
    ctx.fillRect(-10, neckY + 8, 20, hipY - neckY - 14);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-10, neckY + 22, 20, 6);
  }

  // 5. ARMS & LEGS WITH FLUID, SMOOTH LOCOMOTION
  const pose = opts.pose || 'stand';

  if (pose === 'run' || pose === 'sprint') {
    // Smooth athletic sprint at natural 8.5 rad/s (NO frantic blender blur)
    const runFreq = 8.5;
    const leg1 = Math.sin(t * runFreq) * 28;
    const leg2 = Math.sin(t * runFreq + Math.PI) * 28;
    const arm1 = Math.sin(t * runFreq + Math.PI) * 22;
    const arm2 = Math.sin(t * runFreq) * 22;

    ctx.rotate(0.10); // Natural athletic forward lean

    // Pumping arms
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-arm1, neckY + 28); ctx.lineTo(-arm1 * 1.25, hipY + 8);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(arm2, neckY + 28); ctx.lineTo(arm2 * 1.25, hipY - 8);
    ctx.stroke();

    // Striding legs
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(leg1 * 0.65, hipY + 24); ctx.lineTo(leg1, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(leg2 * 0.65, hipY + 24); ctx.lineTo(leg2, footY);
    ctx.stroke();

    // Soft puff behind heel
    const puffCycle = (t * 4.2) % 1;
    const puffAlpha = Math.sin(puffCycle * Math.PI) * 0.6;
    ctx.fillStyle = 'rgba(226, 232, 240, ' + puffAlpha + ')';
    ctx.beginPath();
    ctx.arc(-22 - puffCycle * 16, footY - puffCycle * 6, 3 + puffCycle * 5, 0, Math.PI * 2);
    ctx.fill();
  } else if (pose === 'walk' || pose === 'pace') {
    // Smooth fluid walk at 4.8 rad/s
    const walkFreq = 4.8;
    const leg1 = Math.sin(t * walkFreq) * 18;
    const leg2 = Math.sin(t * walkFreq + Math.PI) * 18;
    const arm1 = Math.sin(t * walkFreq + Math.PI) * 14;
    const arm2 = Math.sin(t * walkFreq) * 14;

    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-arm1, neckY + 28); ctx.lineTo(-arm1 * 1.15, hipY + 8);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(arm2, neckY + 28); ctx.lineTo(arm2 * 1.15, hipY + 8);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(leg1 * 0.55, hipY + 20); ctx.lineTo(leg1, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(leg2 * 0.55, hipY + 20); ctx.lineTo(leg2, footY);
    ctx.stroke();
  } else if (pose === 'ladder_work') {
    // Deliberate wrenching with smooth, natural cadence
    const wrenchAnim = Math.sin(t * 3.8) * 8;
    const balanceTilt = Math.sin(t * 2.2) * 0.025;
    ctx.rotate(balanceTilt);

    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-24, neckY - 10); ctx.lineTo(-32, neckY - 35);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(26, neckY - 8 + wrenchAnim); ctx.lineTo(44, neckY - 26 + wrenchAnim);
    ctx.stroke();

    // Wrench
    ctx.save();
    ctx.fillStyle = '#94a3b8';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.fillRect(38, neckY - 40 + wrenchAnim, 10, 24);
    ctx.fillRect(34, neckY - 44 + wrenchAnim, 18, 8);
    if (Math.sin(t * 3.8) > 0.8) {
      ctx.fillStyle = '#fde047';
      ctx.beginPath(); ctx.arc(43, neckY - 46 + wrenchAnim, 3.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    // Steady feet on ladder
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-18, hipY + 35); ctx.lineTo(-14, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(18, hipY + 30); ctx.lineTo(14, footY - 12);
    ctx.stroke();
  } else if (pose === 'panic_phone') {
    // Smooth pacing with phone to ear
    const phoneSway = Math.sin(t * 3.2) * 1.5;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-24, neckY); ctx.lineTo(-18, headY + 5 + phoneSway);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(24, neckY); ctx.lineTo(18, headY + 5);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    roundRect(ctx, -28, headY - 5 + phoneSway, 10, 18, 3, true, false);

    // Natural pacing footsteps
    const paceStep = Math.sin(t * 4.5) * 10;
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-16 + paceStep, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(16 - paceStep, footY);
    ctx.stroke();
  } else if (pose === 'laser_pointer') {
    // Smooth, deliberate aim tracking
    const aimWobble = Math.sin(t * 1.8) * 4;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(28, neckY - 12 + aimWobble); ctx.lineTo(50, neckY - 28 + aimWobble);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-18, neckY + 10); ctx.lineTo(-6, hipY);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    roundRect(ctx, 46, neckY - 34 + aimWobble, 18, 8, 3, true, false);

    // Confident standing legs with gentle breath
    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-20, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(20, footY);
    ctx.stroke();
  } else if (pose === 'cheer' || pose === 'jump_cheer') {
    // Smooth, celebratory jump
    const jump = Math.abs(Math.sin(t * 3.5)) * 16;
    const wave1 = Math.sin(t * 4.5) * 10;
    const wave2 = Math.cos(t * 4.5) * 10;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-28, neckY - 25); ctx.lineTo(-38 + wave1, neckY - 50);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(28, neckY - 25); ctx.lineTo(38 + wave2, neckY - 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-18, footY - jump);
    ctx.moveTo(0, hipY); ctx.lineTo(18, footY - jump);
    ctx.stroke();
  } else if (pose === 'drag_heavy') {
    // Heavy, slow trudging
    const step = Math.sin(t * 2.5) * 10;
    ctx.rotate(-0.12);
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-20, neckY + 34); ctx.lineTo(-26, hipY + 15);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(12, neckY + 34); ctx.lineTo(16, hipY + 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-16 + step, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(16 - step, footY);
    ctx.stroke();
  } else if (pose === 'sad_ladder') {
    const sigh = Math.sin(t * 1.8) * 2.5;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-18, neckY + 38 + sigh); ctx.lineTo(-12, hipY + 15);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(18, neckY + 38 + sigh); ctx.lineTo(12, hipY + 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-16, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(16, footY);
    ctx.stroke();
  } else {
    // Default stand with gentle weight shift
    const weightShift = Math.sin(t * 2.0) * 1.5;
    ctx.beginPath();
    ctx.moveTo(0, neckY + 12); ctx.lineTo(-22, neckY + 30); ctx.lineTo(-18, hipY + 10);
    ctx.moveTo(0, neckY + 12); ctx.lineTo(22, neckY + 30); ctx.lineTo(18, hipY + 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, hipY); ctx.lineTo(-18 + weightShift, footY);
    ctx.moveTo(0, hipY); ctx.lineTo(18 - weightShift, footY);
    ctx.stroke();
  }

  ctx.restore();
}

// --- CUTE AVA ROBOT 3.0 (SILKY HOVER & GLOWING HOLOGRAPHICS) ---
function drawAvaRobot(ctx, x, y, opts) {
  opts = opts || {};
  const t = opts.t || 0;
  ctx.save();

  // Floaty, luxurious antigravity hover (smooth 2.0 rad/s)
  const hoverY = Math.sin(t * 2.0) * 8;
  const hoverTilt = Math.sin(t * 1.5) * 0.025;

  ctx.translate(x, y + hoverY);
  ctx.rotate(hoverTilt);

  const scale = opts.scale || 1.0;
  ctx.scale(scale, scale);

  const headRadius = 24;
  const headY = -120;
  const neckY = -96;
  const hipY = -35;
  const footY = 0;

  ctx.save();
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 20;

  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  roundRect(ctx, -headRadius - 4, headY - headRadius, (headRadius + 4) * 2, headRadius * 2 + 4, 16, true, true);
  ctx.restore();

  // Soft ion thruster glow (breathes smoothly, NO strobe)
  const flameH = 14 + Math.sin(t * 6) * 3;
  [-14, 14].forEach(fx => {
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(fx - 5, footY);
    ctx.lineTo(fx + 5, footY);
    ctx.lineTo(fx, footY + flameH);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c8ff00';
    ctx.beginPath();
    ctx.moveTo(fx - 2.5, footY);
    ctx.lineTo(fx + 2.5, footY);
    ctx.lineTo(fx, footY + flameH * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Antenna with soft star
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, headY - headRadius);
  ctx.lineTo(0, headY - headRadius - 16);
  ctx.stroke();

  // Smooth expanding radio wave
  const sigCycle = (t * 0.8) % 1.0;
  const sigR = sigCycle * 32;
  const sigA = Math.sin(sigCycle * Math.PI) * 0.7; // Smooth fade in and out!
  ctx.strokeStyle = 'rgba(56, 189, 248, ' + sigA + ')';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, headY - headRadius - 18, sigR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#c8ff00';
  ctx.shadowColor = '#c8ff00';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, headY - headRadius - 18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Headset
  ctx.fillStyle = '#a855f7';
  roundRect(ctx, -headRadius - 8, headY - 8, 8, 16, 4, true, false);
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-headRadius - 4, headY);
  ctx.quadraticCurveTo(-12, headY + 18, 6, headY + 14);
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.arc(8, headY + 14, 3.5, 0, Math.PI * 2); ctx.fill();

  // Concentric voice rings
  const micCycle = (t * 1.2) % 1.0;
  const micR = micCycle * 22;
  const micA = Math.sin(micCycle * Math.PI) * 0.7;
  ctx.strokeStyle = 'rgba(56, 189, 248, ' + micA + ')';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(8, headY + 14, micR, -0.6, 0.6);
  ctx.stroke();

  // Digital face with smooth transitions
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  const emoteCycle = Math.floor(t * 0.8) % 3;
  let emote = '^ ‿ ^';
  if (emoteCycle === 1) emote = '⚡ ‿ ⚡';
  else if (emoteCycle === 2) emote = '◕ ‿ ◕';
  ctx.fillText(emote, 0, headY + 6);

  // Torso
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, neckY);
  ctx.lineTo(0, hipY);
  ctx.stroke();

  // Heart badge
  const badgePulse = 1.0 + Math.sin(t * 4) * 0.05;
  ctx.save();
  ctx.scale(badgePulse, badgePulse);
  ctx.fillStyle = '#a855f7';
  roundRect(ctx, -14, neckY + 12, 28, 20, 6, true, false);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AVA', 0, neckY + 26);
  ctx.restore();

  // Smooth typing motion
  const typeMotion = Math.sin(t * 8) * 3;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, neckY + 10);
  ctx.lineTo(24, neckY + 4 + typeMotion);
  ctx.lineTo(16, neckY + 24 + typeMotion);
  ctx.moveTo(0, neckY + 10);
  ctx.lineTo(-24, neckY + 12);
  ctx.lineTo(-12, neckY + 30);
  ctx.stroke();

  // Tablet
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 1.5;
  roundRect(ctx, -32, neckY + 22, 34, 22, 4, true, true);

  // Holographic beam
  ctx.save();
  const holoGrad = ctx.createLinearGradient(0, neckY + 20, 0, neckY - 55);
  holoGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
  holoGrad.addColorStop(1, 'rgba(200, 255, 0, 0)');
  ctx.fillStyle = holoGrad;
  ctx.beginPath();
  ctx.moveTo(-28, neckY + 22);
  ctx.lineTo(0, neckY + 22);
  ctx.lineTo(16, neckY - 45);
  ctx.lineTo(-42, neckY - 45);
  ctx.closePath();
  ctx.fill();

  // Smooth rising data particles
  for (let dp = 0; dp < 3; dp++) {
    const dpCycle = (t * 0.9 + dp * 0.33) % 1.0;
    const dpY = neckY + 20 - dpCycle * 45;
    const dpX = -14 + Math.sin(t * 2 + dp) * 8;
    const dpAlpha = Math.sin(dpCycle * Math.PI);
    ctx.fillStyle = 'rgba(200, 255, 0, ' + dpAlpha + ')';
    ctx.fillRect(dpX, dpY, 3, 3);
  }
  ctx.restore();

  // Hovering Legs
  ctx.beginPath();
  ctx.moveTo(0, hipY); ctx.lineTo(-14, hipY + 18); ctx.lineTo(-14, footY);
  ctx.moveTo(0, hipY); ctx.lineTo(14, hipY + 18); ctx.lineTo(14, footY);
  ctx.stroke();

  ctx.restore();
}

// --- PROPS & STORY HELPERS WITH CLEAN, FLUID MOTION ---

function drawLadder(ctx, x, y, h, t) {
  ctx.save();
  const sway = Math.sin((t || 0) * 2.2) * 0.02; // Very gentle creak
  ctx.translate(x, y + h);
  ctx.rotate(sway);
  ctx.translate(-x, -(y + h));

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  const w = 48;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y + h);
  ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h);

  const numRungs = Math.floor(h / 32);
  for (let i = 1; i < numRungs; i++) {
    const ry = y + i * 32;
    ctx.moveTo(x - w / 2, ry);
    ctx.lineTo(x + w / 2, ry);
  }
  ctx.stroke();
  ctx.restore();
}

function drawLeakyPipe(ctx, x, y, t) {
  ctx.save();
  // Solid sturdy iron pipe
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 80, y, 160, 18);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x - 12, y - 4, 24, 26);

  const floorY = y + 210;

  // Single realistic water drip falling with parabolic gravity
  const dropCycle = (t * 1.5) % 1.0;
  // Parabolic easing (t^2) simulates real falling gravity!
  const dropProgress = dropCycle * dropCycle;
  const dropY = y + 26 + dropProgress * (floorY - (y + 26));

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(x, dropY, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Soft expanding splash on contact
  if (dropCycle > 0.82) {
    const splashProg = (dropCycle - 0.82) / 0.18;
    const splashR = splashProg * 18;
    const splashAlpha = Math.sin(splashProg * Math.PI);
    ctx.strokeStyle = 'rgba(56, 189, 248, ' + splashAlpha + ')';
    ctx.lineWidth = 1.8;
    for (let a = 0; a < 4; a++) {
      const ang = (Math.PI / 5) * (a + 1) + Math.PI;
      const spX = x + Math.cos(ang) * splashR;
      const spY = floorY + Math.sin(ang) * splashR * 0.45;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(spX, spY, 2.2, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Puddle with smooth breathing ripples
  const puddleW = 50 + Math.sin(t * 2.5) * 4;
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x, floorY, puddleW, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Smooth expanding ripple
  const ripCycle = (t * 1.2) % 1.0;
  const ripR = ripCycle * 45 + 8;
  const ripAlpha = Math.sin(ripCycle * Math.PI) * 0.5;
  ctx.strokeStyle = 'rgba(56, 189, 248, ' + ripAlpha + ')';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, floorY, ripR * 1.35, ripR * 0.38, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawFlyingMoneyBag(ctx, x, y, t, amount) {
  ctx.save();
  // Smooth soaring glide like a bird
  const swoopY = Math.sin(t * 3.5) * 12;
  ctx.translate(x, y + swoopY);

  const flap = Math.sin(t * 8) * 0.35; // Elegant flap cadence

  // Gentle floating dollar trail
  for (let dt = 1; dt <= 2; dt++) {
    const trailCycle = (t * 1.8 + dt * 0.5) % 1.0;
    const trX = -32 - trailCycle * 42;
    const trY = Math.sin(t * 2.5 + dt) * 12 + trailCycle * 10;
    const trAlpha = Math.sin(trailCycle * Math.PI) * 0.75;
    ctx.fillStyle = 'rgba(34, 197, 94, ' + trAlpha + ')';
    ctx.font = 'bold 13px "Space Grotesk", sans-serif';
    ctx.fillText('$', trX, trY);
  }

  // Wings
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.save();
  ctx.rotate(flap);
  ctx.beginPath(); ctx.ellipse(-26, -10, 22, 9, -0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.rotate(-flap);
  ctx.beginPath(); ctx.ellipse(26, -10, 22, 9, 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();

  // Bag
  const bagSquash = 1.0 + Math.sin(t * 4) * 0.03;
  ctx.scale(1 / bagSquash, bagSquash);
  ctx.fillStyle = '#22c55e';
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 8, 22, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#16a34a';
  ctx.fillRect(-8, -18, 16, 8);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(amount || '$8,000', 0, 12);

  ctx.restore();
}

function drawWorkVan(ctx, x, y, t) {
  ctx.save();
  // Smooth highway suspension glide
  const bounceY = Math.sin(t * 7) * 1.8;
  ctx.translate(x, y + bounceY);

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  roundRect(ctx, -80, -45, 160, 45, 10, true, true);

  ctx.fillStyle = '#38bdf8';
  roundRect(ctx, 40, -40, 35, 24, 6, true, false);

  drawLadder(ctx, 0, -62, 22, t);

  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ VantorX DISPATCH', -10, -20);

  // Wheels rotating at clean highway speed (no strobing)
  const wheelSpin = t * 14;
  [-45, 45].forEach(wx => {
    ctx.save();
    ctx.translate(wx, 5);
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.rotate(wheelSpin);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(7, 0); ctx.moveTo(0, -7); ctx.lineTo(0, 7); ctx.stroke();
    ctx.restore();
  });

  // Smooth expanding exhaust clouds
  for (let s = 0; s < 2; s++) {
    const puffCycle = ((t * 1.8 + s * 0.5) % 1.0);
    const puffAlpha = Math.sin(puffCycle * Math.PI) * 0.55;
    ctx.fillStyle = 'rgba(203, 213, 225, ' + puffAlpha + ')';
    ctx.beginPath();
    ctx.arc(-95 - puffCycle * 45, -5 - puffCycle * 14, 8 + puffCycle * 12, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawBedWithContractor(ctx, x, y, t) {
  ctx.save();
  const snoreBreath = Math.sin(t * 1.8) * 2.5;
  ctx.translate(x, y);

  ctx.fillStyle = '#92400e';
  roundRect(ctx, -90, -70, 18, 70, 4, true, false);
  ctx.fillStyle = '#78350f';
  roundRect(ctx, 75, -40, 14, 40, 4, true, false);

  ctx.fillStyle = '#1e3a8a';
  roundRect(ctx, -75, -35 + snoreBreath * 0.5, 150, 35 - snoreBreath * 0.5, 8, true, false);

  ctx.fillStyle = '#f8fafc';
  roundRect(ctx, -68, -48, 36, 18, 8, true, false);

  drawStickPerson(ctx, -50, -32 + snoreBreath * 0.3, {
    scale: 0.85,
    expr: 'sleep',
    hat: 'nightcap',
    t: t
  });

  // Soft drifting Zzz bubbles
  for (let z = 0; z < 3; z++) {
    const zCycle = (t * 0.7 + z * 0.33) % 1.0;
    const zY = -60 - zCycle * 50;
    const zX = -40 + Math.sin(t * 1.5 + z) * 10 + zCycle * 16;
    const zAlpha = Math.sin(zCycle * Math.PI) * 0.8;
    ctx.fillStyle = 'rgba(147, 197, 253, ' + zAlpha + ')';
    ctx.font = 'bold ' + (14 + z * 4) + 'px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Z', zX, zY);
  }

  ctx.restore();
}

function drawSpeechBubble(ctx, x, y, text, opts) {
  opts = opts || {};
  const t = opts.t || 0;
  ctx.save();
  const floatY = Math.sin(t * 2.2) * 2.5;
  ctx.translate(0, floatY);

  ctx.font = opts.font || 'bold 14px "Space Grotesk", sans-serif';
  const textW = ctx.measureText(text).width;
  const bubbleW = textW + 32;
  const bubbleH = 42;
  const bx = x - bubbleW / 2;
  const by = y - bubbleH;

  ctx.fillStyle = opts.bg || '#ffffff';
  ctx.strokeStyle = opts.border || '#38bdf8';
  ctx.lineWidth = 2;
  ctx.shadowColor = opts.shadow || 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 8;
  roundRect(ctx, bx, by, bubbleW, bubbleH, 14, true, true);
  ctx.shadowBlur = 0;

  ctx.fillStyle = opts.bg || '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x - 8, by + bubbleH);
  ctx.lineTo(x, by + bubbleH + 10);
  ctx.lineTo(x + 8, by + bubbleH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = opts.textColor || '#0f172a';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, by + 26);
  ctx.restore();
}

function renderStoryPill(badge, text) {
  ctx.save();
  const pillW = 420;
  const pillH = 42;
  const pillX = (W - pillW) / 2;
  const pillY = 46;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, pillX, pillY, pillW, pillH, 21, true, true);

  ctx.font = 'bold 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(badge + ' · ' + text, W / 2, pillY + 26);
  ctx.restore();
}
