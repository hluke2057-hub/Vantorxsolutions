// ============================================================================
// VANTORX VIRAL REEL ENGINE — AUTHENTIC CUEVA ILLUSTRATED STUDIO ENGINE
// 89.0s Extended Hook (0-27.6s) + Full "Bob & Sarah" Story (27.6-64.8s) + Ava AI (64.8-89.0s)
// Rich Colored Studio Backdrops, Top 1-5 Stepper, Expressive 2D Characters,
// Tactile Machines (Speedometer, Balance Scale, Fishing Hook, Hologram, Typewriter),
// and Boxless Cueva Kinetic Captions with CRT Scanline Shader.
// ============================================================================

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
// CUEVA STUDIO ROOM BACKDROP + STAGE FLOOR + TOP ① ② ③ ④ ⑤ PROGRESS STEPPER
// ----------------------------------------------------------------------------
function drawCuevaRoom(ctx, wallTop, wallBot, floorColor, activeStep, t, topTag) {
  ctx.save();
  const bg = ctx.createLinearGradient(0, 0, 0, H * 0.77);
  bg.addColorStop(0, wallTop);
  bg.addColorStop(1, wallBot);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H * 0.77);

  // Subtle vertical studio wall paneling texture (like Cueva's crimson/teal rooms)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.018)';
  for (let x = 0; x < W; x += 36) {
    ctx.fillRect(x, 0, 14, H * 0.77);
  }

  // Soft ambient center studio spotlight
  const spot = ctx.createRadialGradient(W / 2, H * 0.38, 20, W / 2, H * 0.38, 320);
  spot.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
  spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = spot;
  ctx.fillRect(0, 0, W, H * 0.77);

  // Dark Stage Floor (Bottom 23% where captions float cleanly with zero clutter!)
  const floorGrad = ctx.createLinearGradient(0, H * 0.77, 0, H);
  floorGrad.addColorStop(0, floorColor || '#090612');
  floorGrad.addColorStop(1, '#020105');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, H * 0.77, W, H * 0.23);

  // Crisp stage floor horizon molding line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.77);
  ctx.lineTo(W, H * 0.77);
  ctx.stroke();

  // Cueva Top Progress Stepper Circles: ① ② ③ ④ ⑤ (Matches cueva_frame_06, 08, 09, 12)
  const stepY = 92;
  const spacing = 36;
  const startX = W / 2 - (spacing * 2);

  // Golden ambient glow behind active stepper pills
  const glowCount = Math.max(1, Math.min(5, activeStep));
  const glowCenterX = startX + ((glowCount - 1) * spacing) / 2;
  const stepGlow = ctx.createRadialGradient(glowCenterX, stepY, 4, glowCenterX, stepY, 85);
  stepGlow.addColorStop(0, 'rgba(250, 204, 21, 0.35)');
  stepGlow.addColorStop(1, 'rgba(250, 204, 21, 0)');
  ctx.fillStyle = stepGlow;
  ctx.beginPath();
  ctx.arc(glowCenterX, stepY, 85, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 1; i <= 5; i++) {
    const cx = startX + (i - 1) * spacing;
    const isLit = i <= activeStep;
    const isCurrent = i === activeStep;
    const r = isCurrent ? (13.5 + Math.sin(t * 6) * 1.0) : 12.5;

    ctx.beginPath();
    ctx.arc(cx, stepY, r, 0, Math.PI * 2);
    if (isLit) {
      ctx.fillStyle = '#facc15';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();

      ctx.font = '900 13px "Montserrat", "Space Grotesk", sans-serif';
      ctx.fillStyle = '#090d16';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i), cx, stepY + 0.5);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fill();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.stroke();
    }
  }

  if (topTag) {
    ctx.font = '800 11px "JetBrains Mono", "Space Grotesk", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(topTag.toUpperCase(), W / 2, stepY + 22);
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// CUEVA 2D ILLUSTRATED CHARACTER RENDERER (Matches cueva_frame_01, 02, 09)
// Full expressive face, eyes with specular shine, eyebrows, talking mouth,
// sculpted hair/hardhat, suit jacket / sweater / high-vis vest, hands & shoes!
// ----------------------------------------------------------------------------
function drawCuevaCharacter(ctx, opts, t) {
  const {
    x,
    y, // Foot level Y (typically H * 0.77 = 739)
    scale = 1.0,
    outfit = 'suit', // 'suit' | 'contractor' | 'sweater_blue' | 'sweater_coral'
    hair = 'curly_gold', // 'curly_gold' | 'hardhat' | 'auburn' | 'slick_dark'
    mood = 'smile', // 'smile' | 'talk' | 'panic' | 'worried' | 'smirk'
    leftArmAngle = 0.25,
    rightArmAngle = -0.25,
    holdingItem = null // 'wrench' | 'phone' | 'check' | 'pointer'
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const bob = Math.sin(t * 4.5 + x * 0.02) * 2.5;

  // 1. Shoes on stage floor
  ctx.fillStyle = (outfit === 'sweater_blue' || outfit === 'sweater_coral') ? '#e2e8f0' : '#111827';
  ctx.beginPath();
  ctx.ellipse(-26, -6, 20, 9, 0, 0, Math.PI * 2);
  ctx.ellipse(26, -6, 20, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Legs / Trousers
  ctx.fillStyle = (outfit === 'contractor') ? '#1e293b' : '#1f2937';
  drawRoundBox(ctx, -38, -105, 26, 98, 6, ctx.fillStyle, null);
  drawRoundBox(ctx, 12, -105, 26, 98, 6, ctx.fillStyle, null);

  // 3. Torso (with breathing motion)
  ctx.save();
  ctx.translate(0, bob);

  if (outfit === 'suit') {
    // Charcoal blazer body
    drawRoundBox(ctx, -48, -225, 96, 125, 16, '#27272a', '#3f3f46', 1.5);
    // Light blue dress shirt V-insert
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.moveTo(-22, -225);
    ctx.lineTo(22, -225);
    ctx.lineTo(0, -165);
    ctx.closePath();
    ctx.fill();
    // White collar points
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-24, -226);
    ctx.lineTo(-6, -226);
    ctx.lineTo(-16, -208);
    ctx.closePath();
    ctx.moveTo(24, -226);
    ctx.lineTo(6, -226);
    ctx.lineTo(16, -208);
    ctx.closePath();
    ctx.fill();
    // 3 Suit Buttons
    ctx.fillStyle = '#9ca3af';
    [-150, -132, -114].forEach(by => {
      ctx.beginPath();
      ctx.arc(0, by, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (outfit === 'contractor') {
    // Blue work shirt base
    drawRoundBox(ctx, -48, -225, 96, 125, 16, '#1d4ed8', null);
    // High-vis orange safety vest over shirt
    drawRoundBox(ctx, -46, -223, 92, 120, 14, '#f97316', '#fb923c', 1.5);
    // Reflective yellow/silver safety stripes
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-46, -155, 92, 10);
    ctx.fillRect(-46, -130, 92, 10);
    ctx.fillRect(-30, -223, 12, 68);
    ctx.fillRect(18, -223, 12, 68);
  } else {
    const sweaterCol = (outfit === 'sweater_coral') ? '#f43f5e' : '#2563eb';
    const trimCol = (outfit === 'sweater_coral') ? '#e11d48' : '#1d4ed8';
    drawRoundBox(ctx, -48, -225, 96, 125, 18, sweaterCol, null);
    drawRoundBox(ctx, -48, -120, 96, 16, 6, trimCol, null);
  }

  // 4. Articulated Left & Right Arms + Round Cueva Hands
  const armCol = (outfit === 'suit') ? '#27272a' : (outfit === 'contractor') ? '#1d4ed8' : (outfit === 'sweater_coral') ? '#f43f5e' : '#2563eb';
  [-1, 1].forEach(side => {
    const isRight = side === 1;
    const shoulderX = side * 48;
    const shoulderY = -208;
    const angle = isRight ? rightArmAngle : leftArmAngle;

    ctx.save();
    ctx.translate(shoulderX, shoulderY);
    ctx.rotate(angle);

    // Sleeve
    drawRoundBox(ctx, -12, 0, 24, 78, 11, armCol, null);
    // White shirt cuff on suit
    if (outfit === 'suit') {
      drawRoundBox(ctx, -11, 70, 22, 8, 3, '#ffffff', null);
    }
    // Round Peach Hand
    ctx.fillStyle = '#eab68c';
    ctx.beginPath();
    ctx.arc(0, 86, 14, 0, Math.PI * 2);
    ctx.fill();

    // Optional held item in right hand
    if (isRight && holdingItem === 'wrench') {
      ctx.save();
      ctx.translate(4, 86);
      ctx.rotate(-0.6 + Math.sin(t * 7) * 0.25);
      drawRoundBox(ctx, -5, -45, 10, 48, 4, '#cbd5e1', '#64748b', 1.5);
      ctx.beginPath();
      ctx.arc(0, -48, 12, 0.4, Math.PI * 2 - 0.4);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();
      ctx.restore();
    } else if (isRight && holdingItem === 'phone') {
      ctx.save();
      ctx.translate(6, 86);
      ctx.rotate(-0.3);
      drawRoundBox(ctx, -12, -32, 24, 42, 5, '#0f172a', '#38bdf8', 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-8, -26, 16, 28);
      ctx.restore();
    }

    ctx.restore();
  });

  // 5. Head (Large expressive Cueva round head)
  const headY = -278;
  ctx.fillStyle = '#eab68c';
  ctx.beginPath();
  ctx.arc(0, headY, 46, 0, Math.PI * 2);
  ctx.fill();

  // Subtle warm forehead shadow under hair
  ctx.fillStyle = 'rgba(180, 115, 70, 0.28)';
  ctx.beginPath();
  ctx.ellipse(0, headY - 18, 34, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // 6. Eyes with Cueva white specular shine
  [-15, 15].forEach(ex => {
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(ex, headY - 4, 5.8, 0, Math.PI * 2);
    ctx.fill();
    // White pupil shine dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex - 1.8, headY - 6, 2.0, 0, Math.PI * 2);
    ctx.fill();
  });

  // 7. Expressive Eyebrows
  ctx.strokeStyle = '#3f2314';
  ctx.lineWidth = 4.2;
  ctx.lineCap = 'round';
  if (mood === 'panic' || mood === 'worried') {
    ctx.beginPath();
    ctx.moveTo(-24, headY - 14);
    ctx.lineTo(-8, headY - 20);
    ctx.moveTo(24, headY - 14);
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

  // 8. Expressive Mouth
  ctx.strokeStyle = '#5c2814';
  ctx.fillStyle = '#5c2814';
  ctx.lineWidth = 4.0;
  if (mood === 'panic') {
    const openH = 8 + Math.abs(Math.sin(t * 10)) * 5;
    ctx.beginPath();
    ctx.ellipse(0, headY + 16, 11, openH, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (mood === 'worried') {
    ctx.beginPath();
    ctx.ellipse(0, headY + 16, 9, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (mood === 'talk') {
    const talkOpen = 3 + Math.abs(Math.sin(t * 14)) * 6;
    ctx.beginPath();
    ctx.ellipse(0, headY + 15, 10, talkOpen, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Signature Cueva confident warm smile
    ctx.beginPath();
    ctx.arc(0, headY + 8, 14, 0.2, Math.PI - 0.15);
    ctx.stroke();
  }

  // 9. Hair / Hardhat
  if (hair === 'curly_gold') {
    // Signature Cueva fluffy golden-brown curly hair (Matches cueva_frame_01, 02, 09)
    ctx.fillStyle = '#b4823e';
    const puffs = [
      { cx: -32, cy: headY - 22, r: 20 },
      { cx: -16, cy: headY - 40, r: 24 },
      { cx: 8,   cy: headY - 42, r: 25 },
      { cx: 30,  cy: headY - 24, r: 21 },
      { cx: -38, cy: headY - 4,  r: 16 },
      { cx: 38,  cy: headY - 4,  r: 16 },
      { cx: 0,   cy: headY - 28, r: 22 }
    ];
    puffs.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.cx, p.cy, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    // White glossy hair highlight pill
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(-24, headY - 34);
    ctx.lineTo(-14, headY - 42);
    ctx.stroke();
  } else if (hair === 'hardhat') {
    // Brown hair sides
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(-38, headY - 10, 12, 0, Math.PI * 2);
    ctx.arc(38, headY - 10, 12, 0, Math.PI * 2);
    ctx.fill();
    // Yellow Contractor Safety Hardhat
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, headY - 16, 48, Math.PI, Math.PI * 2);
    ctx.fill();
    drawRoundBox(ctx, -56, headY - 20, 112, 11, 5, '#eab308', '#fef08a', 1.5);
    // White glossy shine on hardhat dome
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(0, headY - 16, 36, Math.PI + 0.4, Math.PI + 1.1);
    ctx.stroke();
  } else if (hair === 'auburn') {
    // Smooth sculpted auburn hair (Matches cueva_frame_02 right character)
    ctx.fillStyle = '#9a3412';
    ctx.beginPath();
    ctx.arc(0, headY - 14, 48, Math.PI - 0.15, Math.PI * 2 + 0.15);
    ctx.fill();
    // White glossy highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(16, headY - 40);
    ctx.lineTo(28, headY - 30);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, headY - 14, 47, Math.PI - 0.1, Math.PI * 2 + 0.1);
    ctx.fill();
  }

  ctx.restore();
  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 1 (0.0s - 8.0s): Cueva Presenter & The 186,000 MI/S Photon Transmitter
// "If you point a single beam of laser light into the night sky, it fires into the dark at 186,000 miles per second."
// ----------------------------------------------------------------------------
function renderTasklessScene1_LaserCrowd(t) {
  const story = window.ACTIVE_STORY || {};
  const topLabel = (story.storyType && story.storyType !== 'cosmic_light')
    ? (story.storyTitle || 'SPEED-TO-LEAD HOOK')
    : 'THE SPEED OF LIGHT PARADOX • 186,000 MI/S';

  drawCuevaRoom(ctx, '#1e1b4b', '#0f0a2c', '#070510', 1, t, topLabel);

  ctx.save();
  // Starfield observatory window on upper right
  const winX = 215, winY = 150, winW = 285, winH = 290;
  drawRoundBox(ctx, winX, winY, winW, winH, 22, '#040711', '#38bdf8', 2.5);

  // Twinkling stars inside observatory viewport
  for (let i = 0; i < 24; i++) {
    const sx = winX + 20 + ((i * 53) % (winW - 40));
    const sy = winY + 20 + ((i * 71) % (winH - 40));
    const sAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t * 3 + i));
    ctx.fillStyle = 'rgba(255, 255, 255, ' + sAlpha + ')';
    ctx.beginPath();
    ctx.arc(sx, sy, (i % 3 === 0) ? 2.2 : 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Big Cueva Telemetry Badge inside Observatory Window
  drawRoundBox(ctx, winX + 18, winY + 18, winW - 36, 76, 12, 'rgba(15, 23, 42, 0.9)', 'rgba(56, 189, 248, 0.5)', 1.5);
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(story.statNumber && story.storyType !== 'cosmic_light' ? story.statNumber : '186,000 MI/S', winX + winW / 2, winY + 26);

  ctx.font = '800 11px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('PHOTON VELOCITY IN DEEP SPACE', winX + winW / 2, winY + 66);

  // Tripod & Photon Cannon Emitter (like Cueva's projector in cueva_frame_09!)
  const emitterX = 210, emitterY = 485;
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(emitterX, emitterY);
  ctx.lineTo(emitterX - 38, H * 0.77);
  ctx.moveTo(emitterX, emitterY);
  ctx.lineTo(emitterX + 38, H * 0.77);
  ctx.moveTo(emitterX, emitterY);
  ctx.lineTo(emitterX, H * 0.77);
  ctx.stroke();

  // Laser Beam firing from cannon through observatory window
  const beamEndX = winX + winW - 22;
  const beamEndY = winY + 115 + Math.sin(t * 5) * 8;

  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
  ctx.lineWidth = 26 + Math.sin(t * 14) * 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(emitterX + 20, emitterY - 20);
  ctx.lineTo(beamEndX, beamEndY);
  ctx.stroke();

  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 8;
  ctx.shadowColor = '#4ade80';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(emitterX + 20, emitterY - 20);
  ctx.lineTo(beamEndX, beamEndY);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(emitterX + 20, emitterY - 20);
  ctx.lineTo(beamEndX, beamEndY);
  ctx.stroke();

  // Pulsing photon orbs racing up the beam
  for (let p = 0; p < 5; p++) {
    const prog = ((t * 2.4 + p * 0.2) % 1.0);
    const px = (emitterX + 20) + (beamEndX - (emitterX + 20)) * prog;
    const py = (emitterY - 20) + (beamEndY - (emitterY - 20)) * prog;
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(px, py, 5.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Cannon Barrel
  ctx.save();
  ctx.translate(emitterX, emitterY);
  ctx.rotate(-0.62);
  drawRoundBox(ctx, -28, -18, 68, 36, 10, '#334155', '#94a3b8', 2);
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(40, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Cueva Presenter Character on Left operating the Photon Cannon
  drawCuevaCharacter(ctx, {
    x: 112,
    y: H * 0.77,
    scale: 0.95,
    outfit: 'suit',
    hair: 'curly_gold',
    mood: 'talk',
    leftArmAngle: 0.18,
    rightArmAngle: -0.85 + Math.sin(t * 3) * 0.06
  }, t);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 2 (8.0s - 21.0s): Cueva Interplanetary Relay & Analog Speedometer Machine
// "In just one second, it flashes past the Moon. In twelve minutes, it blazes past Mars.
//  In forty-three minutes, it tears past Jupiter, and in under three hours, it crosses
//  nearly two billion miles of freezing deep space to hit the rings of Uranus."
// ----------------------------------------------------------------------------
function renderTasklessScene2_EarthToUranus(t) {
  drawCuevaRoom(ctx, '#19103b', '#090518', '#05030d', 1, t, '2,000,000,000 MILE SOLAR RELAY');

  ctx.save();
  // Determine active planet milestone
  let activeIdx = 0; // 0=Moon, 1=Mars, 2=Jupiter, 3=Uranus
  let statusTitle = 'MOON • 1.3 SECONDS';
  let distText = '238,900 MILES TRAVELED';
  if (t >= 17.0) {
    activeIdx = 3;
    statusTitle = 'URANUS • 2.8 HOURS';
    distText = '1,800,000,000 MILES TRAVELED';
  } else if (t >= 13.8) {
    activeIdx = 2;
    statusTitle = 'JUPITER • 43 MINUTES';
    distText = '484,000,000 MILES TRAVELED';
  } else if (t >= 11.0) {
    activeIdx = 1;
    statusTitle = 'MARS • 12 MINUTES';
    distText = '140,000,000 MILES TRAVELED';
  }

  // Top Planetary Relay Track (4 Detailed Planets with Rings & Glow)
  const planets = [
    { name: 'MOON',    time: '1.3s', x: 82,  y: 215, r: 18, c1: '#f1f5f9', c2: '#64748b' },
    { name: 'MARS',    time: '12m',  x: 195, y: 215, r: 24, c1: '#fb923c', c2: '#b91c1c' },
    { name: 'JUPITER', time: '43m',  x: 320, y: 215, r: 34, c1: '#fde68a', c2: '#b45309' },
    { name: 'URANUS',  time: '2.8h', x: 452, y: 215, r: 38, c1: '#67e8f9', c2: '#0e7490', ringed: true }
  ];

  // Laser beam connecting planets
  const beamProgress = Math.min(1, Math.max(0.05, (t - 8.0) / 11.5));
  const beamCurrX = 82 + (452 - 82) * beamProgress;

  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(82, 215);
  ctx.lineTo(452, 215);
  ctx.stroke();

  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 6;
  ctx.shadowColor = '#4ade80';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(82, 215);
  ctx.lineTo(beamCurrX, 215);
  ctx.stroke();
  ctx.shadowBlur = 0;

  planets.forEach((p, idx) => {
    const lit = idx <= activeIdx;
    if (lit) {
      const ringR = p.r + 8 + ((t * 25) % 18);
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
      ctx.stroke();
    }

    const pg = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, 2, p.x, p.y, p.r);
    pg.addColorStop(0, p.c1);
    pg.addColorStop(1, p.c2);
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    if (p.ringed) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(-0.4);
      ctx.strokeStyle = '#a5f3fc';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r * 1.5, p.r * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.font = '800 12px "Space Grotesk", sans-serif';
    ctx.fillStyle = lit ? '#facc15' : 'rgba(255,255,255,0.45)';
    ctx.textAlign = 'center';
    ctx.fillText(p.name + ' (' + p.time + ')', p.x, p.y + p.r + 20);
  });

  // Cueva Tactile Machine in Center (Directly inspired by cueva_frame_03 "MIND READER" machine!)
  const machX = 95, machY = 295, machW = 350, machH = 385;
  drawRoundBox(ctx, machX, machY, machW, machH, 24, '#272f40', '#eab308', 3.5);

  // Analog Gauge Dial Circle
  const dialX = W / 2, dialY = machY + 110, dialR = 82;
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(dialX, dialY, dialR, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ca8a04';
  ctx.stroke();

  // Green & Cyan Speed Arcs inside dial
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(dialX, dialY, dialR - 18, Math.PI * 0.85, Math.PI * 1.5);
  ctx.stroke();

  ctx.strokeStyle = '#06b6d4';
  ctx.beginPath();
  ctx.arc(dialX, dialY, dialR - 18, Math.PI * 1.5, Math.PI * 2.15);
  ctx.stroke();

  // Sweeping Red Needle
  const needleAngle = -Math.PI * 0.6 + beamProgress * (Math.PI * 1.2) + Math.sin(t * 18) * 0.04;
  ctx.save();
  ctx.translate(dialX, dialY);
  ctx.rotate(needleAngle);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.lineTo(0, -(dialR - 16));
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(dialX, dialY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Black Label Plaque on Machine
  drawRoundBox(ctx, machX + 20, machY + 210, machW - 40, 52, 10, '#090d16', null);
  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(statusTitle, W / 2, machY + 236);

  // 4 Glowing Cueva Glass Indicator Bulbs
  const bulbColors = ['#4ade80', '#fb923c', '#facc15', '#38bdf8'];
  for (let b = 0; b < 4; b++) {
    const bx = machX + 62 + b * 75;
    const by = machY + 305;
    const isLit = b <= activeIdx;

    ctx.beginPath();
    ctx.arc(bx, by, 17, 0, Math.PI * 2);
    if (isLit) {
      ctx.fillStyle = bulbColors[b];
      ctx.shadowColor = bulbColors[b];
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fill();
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // White specular dot on bulb
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(bx - 5, by - 5, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.font = '800 13px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.fillText(distText, W / 2, machY + 355);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 3 (21.0s - 27.6s): Cueva Golden Balance Scale (Matches cueva_frame_08!)
// "Yet that two-billion-mile journey across the solar system is STILL faster than the average contractor calls back an emergency lead."
// ----------------------------------------------------------------------------
function renderTasklessScene3_SpaceVsContractorContrast(t) {
  drawCuevaRoom(ctx, '#b45309', '#451a03', '#1c0a02', 2, t, 'THE RESPONSE TIME PARADOX');

  ctx.save();
  const baseX = W / 2;
  const baseY = H * 0.77;

  // Heavy Wooden/Brass Scale Base on Stage Floor
  drawRoundBox(ctx, baseX - 115, baseY - 38, 230, 38, 8, '#78350f', '#facc15', 2);
  drawRoundBox(ctx, baseX - 85, baseY - 32, 65, 8, 4, '#ffffff', null);

  // Central Golden Pillar
  drawRoundBox(ctx, baseX - 14, 210, 28, baseY - 248, 4, '#eab308', '#ca8a04', 2);

  // Scale Tilt Angle (Tilts heavily to the right under the 27.4 HR Contractor Delay anvil!)
  const tiltProgress = Math.min(1, (t - 21.0) / 1.4);
  const tiltAngle = 0.24 * tiltProgress + Math.sin(t * 5) * 0.02;

  ctx.save();
  ctx.translate(baseX, 225);
  ctx.rotate(tiltAngle);

  // Horizontal Scale Beam
  drawRoundBox(ctx, -195, -10, 390, 20, 8, '#facc15', '#ca8a04', 2);

  // Left Pan (High up - Light & Fast: 2.8 HRS TO URANUS)
  ctx.save();
  ctx.translate(-165, 0);
  ctx.rotate(-tiltAngle); // Keep pan level
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(-48, 120);
  ctx.moveTo(0, 0); ctx.lineTo(48, 120);
  ctx.stroke();

  // Glowing 2.8 HR Space Laser Badge on Left Pan
  drawRoundBox(ctx, -72, 48, 144, 72, 12, '#064e3b', '#4ade80', 2.5);
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.textAlign = 'center';
  ctx.fillText('2.8 HRS', 0, 78);
  ctx.font = '700 11px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('LASER TO URANUS', 0, 102);

  // Golden Pan Tray
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(0, 120, 62, 0, Math.PI);
  ctx.fill();
  ctx.restore();

  // Right Pan (Weighed down heavy - 27.4 HRS CONTRACTOR CALLBACK)
  ctx.save();
  ctx.translate(165, 0);
  ctx.rotate(-tiltAngle);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(-48, 120);
  ctx.moveTo(0, 0); ctx.lineTo(48, 120);
  ctx.stroke();

  // Heavy Red Contractor Delay Anvil on Right Pan
  drawRoundBox(ctx, -82, 34, 164, 86, 12, '#7f1d1d', '#f87171', 2.5);
  ctx.font = '900 26px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.textAlign = 'center';
  ctx.fillText('27.4 HRS', 0, 68);
  ctx.font = '800 11px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CONTRACTOR CALLBACK', 0, 92);
  ctx.fillStyle = '#facc15';
  ctx.fillText('9.7X SLOWER!', 0, 108);

  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(0, 120, 62, 0, Math.PI);
  ctx.fill();
  ctx.restore();

  ctx.restore();
  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 4 (27.6s - 36.8s): Meet Contractor Bob — Full Cueva Character on Ladder
// "Picture this. Meet Bob. Bob is a master contractor standing twenty feet up a ladder in a scorching attic, drenched in sweat with a wrench in his hand."
// ----------------------------------------------------------------------------
function renderTasklessScene4_MeetBobAtticLadder(t) {
  drawCuevaRoom(ctx, '#7f1d1d', '#2a0707', '#120303', 2, t, 'STORY • MEET CONTRACTOR BOB');

  ctx.save();
  // Overhead Attic Copper HVAC Pipe & Air Handler Unit
  drawRoundBox(ctx, 45, 165, W - 90, 56, 10, '#334155', '#64748b', 2);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(30, 221, W - 60, 16);

  // Rising Scorching Heat Wave Lines
  for (let h = 0; h < 6; h++) {
    const hx = 75 + h * 78;
    const hyOff = (t * 50 + h * 28) % 160;
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let wy = 0; wy < 65; wy += 10) {
      const wx = hx + Math.sin(t * 7 + wy * 0.15 + h) * 9;
      const curY = 440 - hyOff - wy;
      if (wy === 0) ctx.moveTo(wx, curY);
      else ctx.lineTo(wx, curY);
    }
    ctx.stroke();
  }

  // Aluminum Extension Ladder
  const ladX = 165;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(ladX - 38, H * 0.77);
  ctx.lineTo(ladX - 28, 225);
  ctx.moveTo(ladX + 38, H * 0.77);
  ctx.lineTo(ladX + 28, 225);
  ctx.stroke();

  ctx.lineWidth = 4;
  for (let r = 0; r < 9; r++) {
    const ry = 265 + r * 54;
    ctx.beginPath();
    ctx.moveTo(ladX - 34, ry);
    ctx.lineTo(ladX + 34, ry);
    ctx.stroke();
  }

  // Full Cueva Illustrated Contractor Bob standing on ladder with hardhat, vest & wrench!
  drawCuevaCharacter(ctx, {
    x: ladX,
    y: 535,
    scale: 0.92,
    outfit: 'contractor',
    hair: 'hardhat',
    mood: 'worried',
    leftArmAngle: 0.35,
    rightArmAngle: -2.1 + Math.sin(t * 6) * 0.22,
    holdingItem: 'wrench'
  }, t);

  // Animated Sweat Droplets flying off Bob's forehead
  ctx.fillStyle = '#38bdf8';
  for (let s = 0; s < 4; s++) {
    const prog = ((t * 2.4 + s * 0.25) % 1.0);
    const sx = ladX + 42 + s * 8 + prog * 18;
    const sy = 265 + prog * 85;
    ctx.beginPath();
    ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cueva Character Dossier Plaque on Right
  const cardX = 278, cardY = 285, cardW = 228, cardH = 215;
  drawRoundBox(ctx, cardX, cardY, cardW, cardH, 18, '#1e293b', '#f97316', 2.5);
  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'left';
  ctx.fillText('MEET BOB', cardX + 20, cardY + 42);

  ctx.font = '700 13px "Inter", sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('• Master HVAC/Plumbing Pro', cardX + 20, cardY + 78);
  ctx.fillText('• 20ft up an attic ladder', cardX + 20, cardY + 106);
  ctx.fillText('• 130°F heat, wrench in hand', cardX + 20, cardY + 134);

  drawRoundBox(ctx, cardX + 18, cardY + 156, cardW - 36, 38, 8, 'rgba(239, 68, 68, 0.2)', '#ef4444', 1.5);
  ctx.font = '800 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.textAlign = 'center';
  ctx.fillText('HANDS FULL • CANNOT ANSWER', cardX + cardW / 2, cardY + 180);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 5 (36.8s - 44.2s): Homeowner Sarah's Burst Ceiling Pipe Emergency
// "Across town, a pipe bursts in Sarah's ceiling and water is pouring everywhere.
//  Panicking, she grabs her phone and calls Bob first."
// ----------------------------------------------------------------------------
function renderTasklessScene5_SarahBurstPipe(t) {
  drawCuevaRoom(ctx, '#0e7490', '#062430', '#041821', 3, t, 'EMERGENCY • SARAH CALLS BOB FIRST');

  ctx.save();
  // Ruptured Ceiling Pipe at Top Center
  const pipeX = 215, pipeY = 165;
  drawRoundBox(ctx, 40, pipeY, W - 80, 22, 6, '#475569', '#94a3b8', 2);

  // Gushing Water Waterfall & Droplets from Pipe Rupture
  const waterGrad = ctx.createLinearGradient(pipeX, pipeY + 22, pipeX, H * 0.77);
  waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
  waterGrad.addColorStop(1, 'rgba(14, 165, 233, 0.25)');
  ctx.fillStyle = waterGrad;
  ctx.beginPath();
  ctx.moveTo(pipeX - 18, pipeY + 22);
  ctx.lineTo(pipeX + 18, pipeY + 22);
  ctx.lineTo(pipeX + 68 + Math.sin(t * 10) * 8, H * 0.77);
  ctx.lineTo(pipeX - 68 - Math.sin(t * 10) * 8, H * 0.77);
  ctx.closePath();
  ctx.fill();

  // Animated Water Splash Droplets
  ctx.fillStyle = '#7dd3fc';
  for (let d = 0; d < 18; d++) {
    const prog = ((t * 2.2 + d * 0.13) % 1.0);
    const side = (d % 2 === 0) ? 1 : -1;
    const dx = pipeX + side * (15 + (d % 5) * 18) * prog;
    const dy = (pipeY + 25) + prog * (H * 0.77 - pipeY - 30);
    ctx.beginPath();
    ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rising Flood Water Pool on Stage Floor
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.beginPath();
  ctx.ellipse(pipeX, H * 0.77, 150 + Math.sin(t * 6) * 12, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Panicked Homeowner Sarah (Full Cueva Illustrated Character calling Bob!)
  drawCuevaCharacter(ctx, {
    x: 375,
    y: H * 0.77,
    scale: 0.96,
    outfit: 'sweater_coral',
    hair: 'auburn',
    mood: 'panic',
    leftArmAngle: 0.75 + Math.sin(t * 12) * 0.2,
    rightArmAngle: -1.65,
    holdingItem: 'phone'
  }, t);

  // Calling Bob Callout Bubble
  drawRoundBox(ctx, 42, 255, 225, 115, 16, '#0f172a', '#38bdf8', 2.5);
  ctx.font = '800 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.fillText('📲 DIALING #1 ON GOOGLE:', 60, 286);
  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText("BOB'S PLUMBING", 60, 316);
  ctx.font = '700 13px "Inter", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.fillText(' Value: $8,000 Emergency', 60, 346);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 6 (44.2s - 51.4s): Cueva Call Detector Machine & Voicemail Dump
// "Bob's phone buzzes in his pocket, once, twice, three times, and dumps straight to voicemail."
// ----------------------------------------------------------------------------
function renderTasklessScene6_PhoneBuzzToVoicemail(t) {
  drawCuevaRoom(ctx, '#7f1d1d', '#280505', '#110202', 3, t, 'RING 1... RING 2... RING 3 -> VOICEMAIL');

  ctx.save();
  const isVoicemail = t >= 48.2;
  const ringCount = t < 45.6 ? 1 : (t < 47.0 ? 2 : 3);

  // Cueva Analog Call Meter Machine (Matches cueva_frame_03!)
  const machX = 85, machY = 185, machW = 370, machH = 490;
  const shakeX = (!isVoicemail) ? Math.sin(t * 48) * 5 : 0;
  ctx.translate(shakeX, 0);

  drawRoundBox(ctx, machX, machY, machW, machH, 26, '#1f2937', isVoicemail ? '#ef4444' : '#facc15', 3.5);

  // Big Dial Gauge at Top of Machine
  const dialX = W / 2, dialY = machY + 125, dialR = 88;
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(dialX, dialY, dialR, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = isVoicemail ? '#ef4444' : '#ca8a04';
  ctx.stroke();

  // Green -> Amber -> Red Danger Zones
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(dialX, dialY, dialR - 18, Math.PI * 0.85, Math.PI * 1.3);
  ctx.stroke();

  ctx.strokeStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(dialX, dialY, dialR - 18, Math.PI * 1.3, Math.PI * 1.75);
  ctx.stroke();

  ctx.strokeStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(dialX, dialY, dialR - 18, Math.PI * 1.75, Math.PI * 2.15);
  ctx.stroke();

  // Needle pinning into Red Voicemail zone
  const needleTarget = isVoicemail ? 0.95 : (ringCount * 0.25);
  const needleAngle = -Math.PI * 0.6 + needleTarget * (Math.PI * 1.25);
  ctx.save();
  ctx.translate(dialX, dialY);
  ctx.rotate(needleAngle);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 5.5;
  ctx.beginPath();
  ctx.moveTo(0, 12);
  ctx.lineTo(0, -(dialR - 16));
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(dialX, dialY, 11, 0, Math.PI * 2);
  ctx.fill();

  // Machine Center Plaque
  drawRoundBox(ctx, machX + 24, machY + 235, machW - 48, 60, 12, '#090d16', null);
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = isVoicemail ? '#ef4444' : '#facc15';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(isVoicemail ? '❌ DUMPED TO VOICEMAIL' : ('📳 BUZZING POCKET • RING #' + ringCount), W / 2, machY + 265);

  // 3 Ring Bulbs + 4th Voicemail Bulb
  const labels = ['ONCE', 'TWICE', '3 TIMES', 'DEAD VM'];
  for (let b = 0; b < 4; b++) {
    const bx = machX + 58 + b * 84;
    const by = machY + 348;
    const active = (b < 3 && ringCount > b) || (b === 3 && isVoicemail);
    const col = (b === 3) ? '#ef4444' : '#facc15';

    ctx.beginPath();
    ctx.arc(bx, by, 20, 0, Math.PI * 2);
    ctx.fillStyle = active ? col : '#111827';
    if (active) {
      ctx.shadowColor = col;
      ctx.shadowBlur = 18;
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = '800 11px "JetBrains Mono", sans-serif';
    ctx.fillStyle = active ? '#ffffff' : '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText(labels[b], bx, by + 34);
  }

  // Bottom Status Banner
  drawRoundBox(ctx, machX + 24, machY + 410, machW - 48, 52, 10, 'rgba(239, 68, 68, 0.18)', '#ef4444', 1.5);
  ctx.font = '800 15px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#fca5a5';
  ctx.textAlign = 'center';
  ctx.fillText(isVoicemail ? 'HOMEOWNER HANGS UP IMMEDIATELY' : 'BOB IS STILL 20FT UP THE LADDER...', W / 2, machY + 440);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 7 (51.4s - 57.5s): Cueva Underwater Fishing Hook Metaphor (Matches cueva_frame_06!)
// "Sarah doesn't leave a message, because 78% of homeowners hire the very first business that answers.
//  Within ten seconds, she taps the next contractor on Google."
// ----------------------------------------------------------------------------
function renderTasklessScene7_Stat78Percent(t) {
  drawCuevaRoom(ctx, '#0f766e', '#042f2e', '#021c1b', 3, t, 'THE 78% SPEED-TO-LEAD LAW');

  ctx.save();
  // Warm golden sunlight header at top (just like cueva_frame_06!)
  ctx.fillStyle = '#d97706';
  ctx.fillRect(0, 0, W, 54);

  // Floating underwater bubbles
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2;
  for (let b = 0; b < 10; b++) {
    const bx = 55 + (b * 48) % (W - 80);
    const by = 650 - ((t * 45 + b * 62) % 520);
    ctx.beginPath();
    ctx.arc(bx, by, 6 + (b % 3) * 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Fishing Line & J-Hook dropping from top center
  const hookX = W / 2;
  const hookY = 335 + Math.sin(t * 3.5) * 10;

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(hookX, 54);
  ctx.lineTo(hookX, hookY - 35);
  ctx.stroke();

  // Silver J-Hook
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(hookX, hookY - 40);
  ctx.lineTo(hookX, hookY - 8);
  ctx.arc(hookX - 16, hookY - 8, 16, 0, Math.PI);
  ctx.stroke();

  // White Tilted Sign on Hook: "78% HIRE FIRST TO ANSWER" (Matches cueva_frame_06 "YOUR WORK?" sign!)
  ctx.save();
  ctx.translate(hookX, hookY + 36);
  ctx.rotate(-0.04);
  drawRoundBox(ctx, -155, -34, 310, 68, 22, '#ffffff', '#0f172a', 2);
  ctx.font = '900 24px "Montserrat", "Space Grotesk", sans-serif';
  ctx.fillStyle = '#090d16';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('78% HIRE FIRST ANSWER', 0, -4);
  ctx.font = '800 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#0d9488';
  ctx.fillText('$8,000 EMERGENCY LEAD', 0, 18);
  ctx.restore();

  // Left Pink Fish (BOB'S VOICEMAIL - Swimming Away Left)
  const pinkX = 145 - Math.sin(t * 2) * 12;
  const pinkY = 435;
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.ellipse(pinkX, pinkY, 64, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(pinkX - 58, pinkY);
  ctx.lineTo(pinkX - 88, pinkY - 24);
  ctx.lineTo(pinkX - 88, pinkY + 24);
  ctx.closePath();
  ctx.fill();

  ctx.font = '900 14px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('VOICEMAIL (0%)', pinkX, pinkY + 48);

  // Right Neon Lime Fish (NEXT SHOP ON GOOGLE - Swimming Up to Hook!)
  const limeX = 355 + Math.cos(t * 3) * 8;
  const limeY = 485;
  ctx.fillStyle = '#a3e635';
  ctx.beginPath();
  ctx.ellipse(limeX, limeY, 72, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(limeX + 66, limeY);
  ctx.lineTo(limeX + 98, limeY - 26);
  ctx.lineTo(limeX + 98, limeY + 26);
  ctx.closePath();
  ctx.fill();
  // Fish Eye
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.arc(limeX - 42, limeY - 6, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '900 15px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#fde047';
  ctx.textAlign = 'center';
  ctx.fillText('NEXT ON GOOGLE (WINS $8K)', limeX, limeY + 52);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 8 (57.5s - 64.8s): Competitor Answers Ring 1 & Cashes Bob's $8,000 Check
// "That shop answers on ring one, rolls a truck, and collects an $8,000 check that had Bob's name written all over it."
// ----------------------------------------------------------------------------
function renderTasklessScene8_CompetitorStealsCheck(t) {
  drawCuevaRoom(ctx, '#3b0764', '#140324', '#08010f', 4, t, "COMPETITOR CASHES BOB'S $8,000 CHECK");

  ctx.save();
  // Giant $8,000 Cashier's Check Centerpiece
  const chkX = 48, chkY = 175, chkW = W - 96, chkH = 195;
  drawRoundBox(ctx, chkX, chkY, chkW, chkH, 18, '#064e3b', '#4ade80', 3);

  ctx.font = '800 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#a7f3d0';
  ctx.textAlign = 'left';
  ctx.fillText('EMERGENCY PLUMBING & WATER PAYOUT', chkX + 24, chkY + 32);

  ctx.font = '900 54px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('$8,000.00', chkX + 24, chkY + 95);

  // Pay to the order of: BOB'S PLUMBING (Crossed out in red!) -> COMPETITOR #2
  ctx.font = '800 16px "Space Grotesk", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText("PAY TO: BOB'S CONTRACTING", chkX + 24, chkY + 138);

  // Red strike-through line over Bob's name
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(chkX + 95, chkY + 133);
  ctx.lineTo(chkX + 295, chkY + 133);
  ctx.stroke();

  ctx.font = '900 17px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText('➔ PAID TO: COMPETITOR (RING #1)', chkX + 24, chkY + 168);

  // Left: Sad Contractor Bob Empty-Handed
  drawCuevaCharacter(ctx, {
    x: 138,
    y: H * 0.77,
    scale: 0.90,
    outfit: 'contractor',
    hair: 'hardhat',
    mood: 'worried',
    leftArmAngle: 0.4,
    rightArmAngle: -0.4
  }, t);

  // Right: Smirking Competitor in Blue Sweater celebrating
  drawCuevaCharacter(ctx, {
    x: 395,
    y: H * 0.77,
    scale: 0.90,
    outfit: 'sweater_blue',
    hair: 'slick_dark',
    mood: 'smile',
    leftArmAngle: 2.3 + Math.sin(t * 8) * 0.15,
    rightArmAngle: -2.3 - Math.sin(t * 8) * 0.15
  }, t);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 9 (64.8s - 76.2s): Meet Ava 24/7 Voice AI Hologram (Matches cueva_frame_01!)
// "That is why we built Ava. She answers your phone in 0.8 seconds, calms the homeowner down,
//  qualifies the job, books your calendar, and texts the dispatch straight to Bob's phone
//  before the customer can even open another Google tab."
// ----------------------------------------------------------------------------
function renderTasklessScene9_AvaInstantReply(t) {
  drawCuevaRoom(ctx, '#1e1b4b', '#064e3b', '#031c16', 4, t, 'SOLUTION • AVA 24/7 VOICE AI (0.8s PICKUP)');

  ctx.save();
  // Cueva Neon AI Brain & Head Hologram on Right (Directly matches cueva_frame_01.png!)
  const holoX = 335, holoY = 315;

  // Pulsing Concentric Neural Rings
  for (let r = 0; r < 3; r++) {
    const rad = 95 + r * 28 + Math.sin(t * 5 + r) * 6;
    ctx.strokeStyle = 'rgba(244, 114, 182, ' + (0.35 - r * 0.08) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(holoX, holoY, rad, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Glowing Neon Pink/Cyan Head Silhouette Outline
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 4.5;
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(holoX, holoY - 10, 82, -Math.PI * 0.85, Math.PI * 0.45);
  ctx.lineTo(holoX + 35, holoY + 95);
  ctx.lineTo(holoX - 35, holoY + 95);
  ctx.lineTo(holoX - 42, holoY + 55);
  ctx.lineTo(holoX - 75, holoY + 50);
  ctx.closePath();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Glowing Pink Neural Brain Inside Head
  ctx.fillStyle = '#fb7185';
  const brainLobes = [
    { dx: -22, dy: -22, r: 28 },
    { dx: 18,  dy: -22, r: 28 },
    { dx: -28, dy: 4,   r: 24 },
    { dx: 24,  dy: 4,   r: 24 },
    { dx: 0,   dy: -8,  r: 26 }
  ];
  brainLobes.forEach(l => {
    ctx.beginPath();
    ctx.arc(holoX + l.dx, holoY + l.dy, l.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Floating Cueva Action Icons around Ava Brain (Phone, Calendar, SMS Dispatch)
  drawRoundBox(ctx, holoX - 88, holoY - 125, 176, 36, 10, '#065f46', '#4ade80', 2);
  ctx.font = '900 15px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ AVA AI • 0.8s ANSWER', holoX, holoY - 102);

  // Instant SMS Dispatch Card below Hologram
  const smsY = 445;
  drawRoundBox(ctx, 210, smsY, 295, 145, 16, '#0f172a', '#38bdf8', 2.5);
  ctx.font = '800 12px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.fillText('📲 INSTANT SMS TO BOB (24s):', 228, smsY + 28);

  ctx.font = '800 15px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('✅ Sarah Jenkins — Pipe Burst', 228, smsY + 56);
  ctx.fillText('📍 Calendar Booked • Tech Dispatched', 228, smsY + 82);

  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('💰 +$8,000 JOB LOCKED IN', 228, smsY + 118);

  // Cueva Presenter on Left pointing to Ava Hologram (Matches cueva_frame_01!)
  drawCuevaCharacter(ctx, {
    x: 105,
    y: H * 0.77,
    scale: 0.94,
    outfit: 'suit',
    hair: 'curly_gold',
    mood: 'talk',
    leftArmAngle: 0.2,
    rightArmAngle: -1.15 + Math.sin(t * 4) * 0.08
  }, t);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 10 (76.2s - 81.0s): Stop Handing $8,000 Checks to Competitors
// "Stop handing $8,000 checks to your competitors."
// ----------------------------------------------------------------------------
function renderTasklessScene10_RevenueWaterfall(t) {
  drawCuevaRoom(ctx, '#065f46', '#022c22', '#011712', 5, t, '100% REVENUE CAPTURED BY YOUR SHOP');

  ctx.save();
  // 3 Stacked Captured Check Cards
  const checks = [
    { y: 165, title: 'EMERGENCY PIPE BURST (SARAH)', amt: '+$8,000', tag: 'CAPTURED IN 0.8s' },
    { y: 268, title: 'SUNDAY AC COMPRESSOR FAILURE', amt: '+$9,200', tag: 'BOOKED ON CALENDAR' },
    { y: 371, title: 'AFTER-HOURS MAIN PANEL SURGE', amt: '+$7,400', tag: 'DISPATCHED VIA SMS' }
  ];

  checks.forEach((c, idx) => {
    const hoverX = Math.sin(t * 4 + idx) * 4;
    drawRoundBox(ctx, 44 + hoverX, c.y, W - 88, 86, 16, '#0f172a', '#4ade80', 2.5);

    ctx.font = '800 13px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(c.title, 66 + hoverX, c.y + 32);

    ctx.font = '700 11px "JetBrains Mono", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('⚡ ' + c.tag, 66 + hoverX, c.y + 58);

    ctx.font = '900 28px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#4ade80';
    ctx.textAlign = 'right';
    ctx.fillText(c.amt, W - 66 + hoverX, c.y + 52);
  });

  // Happy Contractor Bob at Bottom Center celebrating
  drawCuevaCharacter(ctx, {
    x: W / 2,
    y: H * 0.77,
    scale: 0.82,
    outfit: 'contractor',
    hair: 'hardhat',
    mood: 'smile',
    leftArmAngle: 2.2 + Math.sin(t * 7) * 0.15,
    rightArmAngle: -2.2 - Math.sin(t * 7) * 0.15
  }, t);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 11 (81.0s - 85.2s): Live Interactive Demo Dialer
// "Call the live demo number on your screen right now to hear Ava answer live,"
// ----------------------------------------------------------------------------
function renderTasklessScene11_LiveDialerInteractive(t) {
  drawCuevaRoom(ctx, '#1e3a8a', '#09132c', '#040917', 5, t, 'TEST AVA LIVE ON YOUR PHONE RIGHT NOW');

  ctx.save();
  const btnX = W / 2, btnY = 285, btnR = 72;

  for (let r = 0; r < 3; r++) {
    const loopR = ((t * 42 + r * 28) % 90);
    const alpha = Math.max(0, 0.55 * (1 - loopR / 90));
    ctx.strokeStyle = 'rgba(74, 222, 128, ' + alpha + ')';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(btnX, btnY, btnR + loopR, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#22c55e';
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 28;
  ctx.beginPath();
  ctx.arc(btnX, btnY, btnR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.font = '44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📞', btnX, btnY - 6);

  ctx.font = '900 14px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CALL LIVE DEMO', btnX, btnY + 34);

  // Giant Phone Number Plaque
  drawRoundBox(ctx, 36, 405, W - 72, 118, 18, '#0f172a', '#facc15', 3);
  ctx.font = '900 38px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'center';
  ctx.fillText('(561) 813-8602', W / 2, 452);

  ctx.font = '800 13px "JetBrains Mono", sans-serif';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('• LIVE 24/7 • HEAR AVA ANSWER IN 0.8s', W / 2, 492);

  // Cueva Presenter at Bottom Left pointing up to number
  drawCuevaCharacter(ctx, {
    x: 110,
    y: H * 0.77,
    scale: 0.76,
    outfit: 'suit',
    hair: 'curly_gold',
    mood: 'smile',
    leftArmAngle: 0.2,
    rightArmAngle: -1.9
  }, t);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// SCENE 12 (85.2s - 89.0s): Iconic Cueva Typewriter End Card (Matches cueva_frame_12!)
// "or comment AVA below and we will DM you the free interactive link."
// ----------------------------------------------------------------------------
function renderTasklessScene12_TasklessEndCard(t) {
  drawCuevaRoom(ctx, '#1d4ed8', '#0b132b', '#050914', 5, t, 'VANTORX AUTOMATION • INSTANT DM ACCESS');

  ctx.save();
  const story = window.ACTIVE_STORY || {};
  const kw = story.keyword || 'AVA';

  // Cream Paper Sheet Rising Out of Cueva Typewriter (Directly matches cueva_frame_12.png!)
  const paperX = 48, paperY = 148, paperW = W - 96, paperH = 385;
  drawRoundBox(ctx, paperX, paperY, paperW, paperH, 6, '#fef9c3', '#ca8a04', 2);

  // Horizontal Ruled Paper Lines
  ctx.strokeStyle = 'rgba(180, 140, 60, 0.18)';
  ctx.lineWidth = 1;
  for (let ly = paperY + 24; ly < paperY + paperH - 12; ly += 14) {
    ctx.beginPath();
    ctx.moveTo(paperX + 12, ly);
    ctx.lineTo(paperX + paperW - 12, ly);
    ctx.stroke();
  }

  // Bold Black Typewriter Headline on Cream Paper
  ctx.font = '900 32px "Montserrat", "Space Grotesk", sans-serif';
  ctx.fillStyle = '#090d16';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('DROP A COMMENT:', paperX + 28, paperY + 38);

  // Highlighted Keyword Box on Paper
  drawRoundBox(ctx, paperX + 28, paperY + 92, paperW - 56, 86, 14, '#090d16', '#facc15', 3);
  ctx.font = '900 44px "Montserrat", "Space Grotesk", sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'center';
  ctx.fillText('COMMENT "' + kw + '"', W / 2, paperY + 114);

  // Solid Black Divider Bar (Matches cueva_frame_12!)
  ctx.fillStyle = '#090d16';
  ctx.fillRect(paperX + 28, paperY + 206, paperW - 56, 7);

  ctx.font = '800 17px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#1e293b';
  ctx.textAlign = 'center';
  ctx.fillText('WE WILL INSTANTLY DM YOUR FREE', W / 2, paperY + 232);
  ctx.fillText('INTERACTIVE DEMO LINK IN 2 SECONDS', W / 2, paperY + 258);

  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#0d9488';
  ctx.fillText('📞 LIVE DEMO: (561) 813-8602', W / 2, paperY + 302);

  // Tactile Dark Cueva Typewriter Base & Round Silver Keys at Bottom (Matches cueva_frame_12!)
  const twY = 505;
  drawRoundBox(ctx, 18, twY, W - 36, 225, 18, '#1e293b', '#475569', 3);
  drawRoundBox(ctx, 28, twY + 52, W - 56, 165, 12, '#0f172a', null);

  // 3 Rows of Round Silver Typewriter Keys (Animated key presses!)
  const activeKey = Math.floor(t * 12) % 18;
  let kIdx = 0;
  for (let row = 0; row < 3; row++) {
    const cols = (row === 1) ? 6 : 7;
    const startKx = (row === 1) ? 88 : 64;
    const ky = twY + 84 + row * 42;
    for (let col = 0; col < cols; col++) {
      const kx = startKx + col * 68;
      const isPressed = (kIdx === activeKey);
      ctx.fillStyle = isPressed ? '#facc15' : '#cbd5e1';
      ctx.beginPath();
      ctx.arc(kx, ky + (isPressed ? 3 : 0), 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#475569';
      ctx.stroke();
      kIdx++;
    }
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// BOXLESS CUEVA KINETIC CAPTIONS — EXACT ELEVENLABS WORD ALIGNMENT
// Floating cleanly over the dark stage floor (Y = H * 0.84 = 806) with a soft
// radial shadow glow, ZERO rectangle boxes, ZERO 1-word flashes, ZERO blinking!
// ----------------------------------------------------------------------------
const CAPTION_CHUNKS = [{"id":1,"start":0,"end":0.489,"color":"#ff6b4a","text":"If you point","words":[{"word":"If","rawWord":"If","start":0,"end":0.104},{"word":"you","rawWord":"you","start":0.139,"end":0.209},{"word":"point","rawWord":"point","start":0.279,"end":0.464}]},{"id":2,"start":0.499,"end":1.151,"color":"#38bdf8","text":"a single beam","words":[{"word":"a","rawWord":"a","start":0.499,"end":0.522},{"word":"single","rawWord":"single","start":0.592,"end":0.882},{"word":"beam","rawWord":"beam","start":0.917,"end":1.115}]},{"id":3,"start":1.161,"end":1.778,"color":"#facc15","text":"of laser light","words":[{"word":"of","rawWord":"of","start":1.161,"end":1.219},{"word":"laser","rawWord":"laser","start":1.277,"end":1.533},{"word":"light","rawWord":"light","start":1.579,"end":1.753}]},{"id":4,"start":1.788,"end":2.277,"color":"#c084fc","text":"into the night","words":[{"word":"into","rawWord":"into","start":1.788,"end":1.916},{"word":"the","rawWord":"the","start":1.962,"end":2.032},{"word":"night","rawWord":"night","start":2.078,"end":2.252}]},{"id":5,"start":2.287,"end":3.67,"color":"#4ade80","text":"sky, it fires","words":[{"word":"sky","rawWord":"sky,","start":2.287,"end":2.821},{"word":"it","rawWord":"it","start":3.1,"end":3.204},{"word":"fires","rawWord":"fires","start":3.262,"end":3.646}]},{"id":6,"start":3.68,"end":4.239,"color":"#ff6b4a","text":"into the dark","words":[{"word":"into","rawWord":"into","start":3.68,"end":3.796},{"word":"the","rawWord":"the","start":3.855,"end":3.924},{"word":"dark","rawWord":"dark","start":3.971,"end":4.214}]},{"id":7,"start":4.249,"end":6.225,"color":"#38bdf8","text":"at 186,000 miles","words":[{"word":"at","rawWord":"at","start":4.249,"end":4.319},{"word":"186000","rawWord":"186,000","start":4.4,"end":5.817},{"word":"miles","rawWord":"miles","start":5.875,"end":6.188}]},{"id":8,"start":6.235,"end":7.153,"color":"#facc15","text":"per second.","words":[{"word":"per","rawWord":"per","start":6.235,"end":6.339},{"word":"second.","rawWord":"second.","start":6.374,"end":6.792}]},{"id":9,"start":7.163,"end":7.745,"color":"#c084fc","text":"In just one","words":[{"word":"In","rawWord":"In","start":7.163,"end":7.268},{"word":"just","rawWord":"just","start":7.303,"end":7.442},{"word":"one","rawWord":"one","start":7.5,"end":7.709}]},{"id":10,"start":7.755,"end":8.686,"color":"#4ade80","text":"second, it flashes","words":[{"word":"second","rawWord":"second,","start":7.755,"end":8.069},{"word":"it","rawWord":"it","start":8.092,"end":8.162},{"word":"flashes","rawWord":"flashes","start":8.22,"end":8.638}]},{"id":11,"start":8.696,"end":9.917,"color":"#ff6b4a","text":"past the Moon.","words":[{"word":"past","rawWord":"past","start":8.696,"end":8.951},{"word":"the","rawWord":"the","start":8.986,"end":9.056},{"word":"Moon.","rawWord":"Moon.","start":9.091,"end":9.497}]},{"id":12,"start":9.927,"end":10.927,"color":"#38bdf8","text":"In twelve minutes,","words":[{"word":"In","rawWord":"In","start":9.927,"end":10.043},{"word":"twelve","rawWord":"twelve","start":10.078,"end":10.379},{"word":"minutes","rawWord":"minutes,","start":10.414,"end":10.763}]},{"id":13,"start":10.937,"end":11.867,"color":"#facc15","text":"it blazes past","words":[{"word":"it","rawWord":"it","start":10.937,"end":11.03},{"word":"blazes","rawWord":"blazes","start":11.064,"end":11.471},{"word":"past","rawWord":"past","start":11.529,"end":11.808}]},{"id":14,"start":11.877,"end":12.761,"color":"#c084fc","text":"Mars.","words":[{"word":"Mars.","rawWord":"Mars.","start":11.877,"end":12.4}]},{"id":15,"start":12.771,"end":13.318,"color":"#4ade80","text":"In forty-three","words":[{"word":"In","rawWord":"In","start":12.771,"end":12.876},{"word":"fortythree","rawWord":"forty-three","start":12.922,"end":13.294}]},{"id":16,"start":13.328,"end":14.201,"color":"#ff6b4a","text":"minutes, it tears","words":[{"word":"minutes","rawWord":"minutes,","start":13.328,"end":13.688},{"word":"it","rawWord":"it","start":13.816,"end":13.921},{"word":"tears","rawWord":"tears","start":13.955,"end":14.164}]},{"id":17,"start":14.211,"end":14.979,"color":"#38bdf8","text":"past Jupiter,","words":[{"word":"past","rawWord":"past","start":14.211,"end":14.431},{"word":"Jupiter","rawWord":"Jupiter,","start":14.466,"end":14.884}]},{"id":18,"start":14.989,"end":15.431,"color":"#facc15","text":"and in under","words":[{"word":"and","rawWord":"and","start":14.989,"end":15.105},{"word":"in","rawWord":"in","start":15.151,"end":15.209},{"word":"under","rawWord":"under","start":15.244,"end":15.407}]},{"id":19,"start":15.441,"end":16.163,"color":"#c084fc","text":"three hours,","words":[{"word":"three","rawWord":"three","start":15.441,"end":15.616},{"word":"hours","rawWord":"hours,","start":15.65,"end":16.022}]},{"id":20,"start":16.173,"end":16.906,"color":"#4ade80","text":"it crosses nearly","words":[{"word":"it","rawWord":"it","start":16.173,"end":16.266},{"word":"crosses","rawWord":"crosses","start":16.301,"end":16.614},{"word":"nearly","rawWord":"nearly","start":16.649,"end":16.869}]},{"id":21,"start":16.916,"end":17.928,"color":"#ff6b4a","text":"two billion miles","words":[{"word":"two","rawWord":"two","start":16.916,"end":17.055},{"word":"billion","rawWord":"billion","start":17.148,"end":17.508},{"word":"miles","rawWord":"miles","start":17.566,"end":17.891}]},{"id":22,"start":17.938,"end":18.705,"color":"#38bdf8","text":"of freezing deep","words":[{"word":"of","rawWord":"of","start":17.938,"end":18.007},{"word":"freezing","rawWord":"freezing","start":18.054,"end":18.46},{"word":"deep","rawWord":"deep","start":18.518,"end":18.681}]},{"id":23,"start":18.715,"end":19.483,"color":"#facc15","text":"space to hit","words":[{"word":"space","rawWord":"space","start":18.715,"end":19.099},{"word":"to","rawWord":"to","start":19.203,"end":19.296},{"word":"hit","rawWord":"hit","start":19.354,"end":19.459}]},{"id":24,"start":19.493,"end":20.099,"color":"#c084fc","text":"the rings of","words":[{"word":"the","rawWord":"the","start":19.493,"end":19.563},{"word":"rings","rawWord":"rings","start":19.609,"end":19.923},{"word":"of","rawWord":"of","start":19.969,"end":20.039}]},{"id":25,"start":20.109,"end":21.109,"color":"#4ade80","text":"Uranus.","words":[{"word":"Uranus.","rawWord":"Uranus.","start":20.109,"end":20.608}]},{"id":26,"start":21.119,"end":21.48,"color":"#ff6b4a","text":"Yet that","words":[{"word":"Yet","rawWord":"Yet","start":21.119,"end":21.27},{"word":"that","rawWord":"that","start":21.304,"end":21.455}]},{"id":27,"start":21.49,"end":22.444,"color":"#38bdf8","text":"two-billion-mile","words":[{"word":"twobillionmile","rawWord":"two-billion-mile","start":21.49,"end":22.396}]},{"id":28,"start":22.454,"end":23.129,"color":"#facc15","text":"journey across the","words":[{"word":"journey","rawWord":"journey","start":22.454,"end":22.698},{"word":"across","rawWord":"across","start":22.733,"end":23},{"word":"the","rawWord":"the","start":23.035,"end":23.104}]},{"id":29,"start":23.139,"end":23.93,"color":"#c084fc","text":"solar system","words":[{"word":"solar","rawWord":"solar","start":23.139,"end":23.394},{"word":"system","rawWord":"system","start":23.441,"end":23.708}]},{"id":30,"start":23.94,"end":24.871,"color":"#4ade80","text":"is STILL faster","words":[{"word":"is","rawWord":"is","start":23.94,"end":24.103},{"word":"STILL","rawWord":"STILL","start":24.149,"end":24.393},{"word":"faster","rawWord":"faster","start":24.463,"end":24.846}]},{"id":31,"start":24.881,"end":25.474,"color":"#ff6b4a","text":"than the average","words":[{"word":"than","rawWord":"than","start":24.881,"end":24.997},{"word":"the","rawWord":"the","start":25.031,"end":25.101},{"word":"average","rawWord":"average","start":25.159,"end":25.449}]},{"id":32,"start":25.484,"end":26.299,"color":"#38bdf8","text":"contractor calls","words":[{"word":"contractor","rawWord":"contractor","start":25.484,"end":25.972},{"word":"calls","rawWord":"calls","start":26.018,"end":26.262}]},{"id":33,"start":26.309,"end":27.03,"color":"#facc15","text":"back an emergency","words":[{"word":"back","rawWord":"back","start":26.309,"end":26.459},{"word":"an","rawWord":"an","start":26.494,"end":26.552},{"word":"emergency","rawWord":"emergency","start":26.587,"end":26.97}]},{"id":34,"start":27.04,"end":27.738,"color":"#c084fc","text":"lead.","words":[{"word":"lead.","rawWord":"lead.","start":27.04,"end":27.47}]},{"id":35,"start":27.748,"end":28.702,"color":"#4ade80","text":"Picture this.","words":[{"word":"Picture","rawWord":"Picture","start":27.748,"end":28.027},{"word":"this.","rawWord":"this.","start":28.05,"end":28.433}]},{"id":36,"start":28.712,"end":29.828,"color":"#ff6b4a","text":"Meet Bob.","words":[{"word":"Meet","rawWord":"Meet","start":28.712,"end":28.909},{"word":"Bob.","rawWord":"Bob.","start":28.956,"end":29.466}]},{"id":37,"start":29.838,"end":30.316,"color":"#38bdf8","text":"Bob is a","words":[{"word":"Bob","rawWord":"Bob","start":29.838,"end":30.07},{"word":"is","rawWord":"is","start":30.117,"end":30.186},{"word":"a","rawWord":"a","start":30.221,"end":30.256}]},{"id":38,"start":30.326,"end":31.21,"color":"#facc15","text":"master contractor","words":[{"word":"master","rawWord":"master","start":30.326,"end":30.627},{"word":"contractor","rawWord":"contractor","start":30.685,"end":31.185}]},{"id":39,"start":31.22,"end":31.836,"color":"#c084fc","text":"standing twenty","words":[{"word":"standing","rawWord":"standing","start":31.22,"end":31.521},{"word":"twenty","rawWord":"twenty","start":31.568,"end":31.8}]},{"id":40,"start":31.846,"end":32.289,"color":"#4ade80","text":"feet up a","words":[{"word":"feet","rawWord":"feet","start":31.846,"end":32.009},{"word":"up","rawWord":"up","start":32.055,"end":32.16},{"word":"a","rawWord":"a","start":32.206,"end":32.241}]},{"id":41,"start":32.299,"end":32.742,"color":"#ff6b4a","text":"ladder in a","words":[{"word":"ladder","rawWord":"ladder","start":32.299,"end":32.543},{"word":"in","rawWord":"in","start":32.578,"end":32.636},{"word":"a","rawWord":"a","start":32.671,"end":32.694}]},{"id":42,"start":32.752,"end":33.706,"color":"#38bdf8","text":"scorching attic,","words":[{"word":"scorching","rawWord":"scorching","start":32.752,"end":33.112},{"word":"attic","rawWord":"attic,","start":33.17,"end":33.542}]},{"id":43,"start":33.716,"end":34.646,"color":"#facc15","text":"drenched in sweat","words":[{"word":"drenched","rawWord":"drenched","start":33.716,"end":34.099},{"word":"in","rawWord":"in","start":34.134,"end":34.203},{"word":"sweat","rawWord":"sweat","start":34.296,"end":34.61}]},{"id":44,"start":34.656,"end":35.18,"color":"#c084fc","text":"with a wrench","words":[{"word":"with","rawWord":"with","start":34.656,"end":34.784},{"word":"a","rawWord":"a","start":34.819,"end":34.842},{"word":"wrench","rawWord":"wrench","start":34.888,"end":35.155}]},{"id":45,"start":35.19,"end":36.028,"color":"#4ade80","text":"in his hand.","words":[{"word":"in","rawWord":"in","start":35.19,"end":35.26},{"word":"his","rawWord":"his","start":35.295,"end":35.376},{"word":"hand.","rawWord":"hand.","start":35.422,"end":35.805}]},{"id":46,"start":36.038,"end":36.864,"color":"#ff6b4a","text":"Across town,","words":[{"word":"Across","rawWord":"Across","start":36.038,"end":36.328},{"word":"town","rawWord":"town,","start":36.374,"end":36.781}]},{"id":47,"start":36.874,"end":37.746,"color":"#38bdf8","text":"a pipe bursts","words":[{"word":"a","rawWord":"a","start":36.874,"end":36.932},{"word":"pipe","rawWord":"pipe","start":37.001,"end":37.257},{"word":"bursts","rawWord":"bursts","start":37.326,"end":37.71}]},{"id":48,"start":37.756,"end":38.64,"color":"#facc15","text":"in Sarah's ceiling","words":[{"word":"in","rawWord":"in","start":37.756,"end":37.826},{"word":"Sarah's","rawWord":"Sarah's","start":37.884,"end":38.162},{"word":"ceiling","rawWord":"ceiling","start":38.197,"end":38.499}]},{"id":49,"start":38.65,"end":39.383,"color":"#c084fc","text":"and water is","words":[{"word":"and","rawWord":"and","start":38.65,"end":38.789},{"word":"water","rawWord":"water","start":38.882,"end":39.196},{"word":"is","rawWord":"is","start":39.254,"end":39.323}]},{"id":50,"start":39.393,"end":40.776,"color":"#4ade80","text":"pouring everywhere.","words":[{"word":"pouring","rawWord":"pouring","start":39.393,"end":39.753},{"word":"everywhere.","rawWord":"everywhere.","start":39.811,"end":40.415}]},{"id":51,"start":40.786,"end":41.6,"color":"#ff6b4a","text":"Panicking, she","words":[{"word":"Panicking","rawWord":"Panicking,","start":40.786,"end":41.367},{"word":"she","rawWord":"she","start":41.471,"end":41.576}]},{"id":52,"start":41.61,"end":42.286,"color":"#38bdf8","text":"grabs her phone","words":[{"word":"grabs","rawWord":"grabs","start":41.61,"end":41.831},{"word":"her","rawWord":"her","start":41.855,"end":41.924},{"word":"phone","rawWord":"phone","start":41.959,"end":42.261}]},{"id":53,"start":42.296,"end":42.936,"color":"#facc15","text":"and calls Bob","words":[{"word":"and","rawWord":"and","start":42.296,"end":42.365},{"word":"calls","rawWord":"calls","start":42.412,"end":42.656},{"word":"Bob","rawWord":"Bob","start":42.702,"end":42.888}]},{"id":54,"start":42.946,"end":43.958,"color":"#c084fc","text":"first.","words":[{"word":"first.","rawWord":"first.","start":42.946,"end":43.376}]},{"id":55,"start":43.968,"end":45.037,"color":"#4ade80","text":"Bob's phone buzzes","words":[{"word":"Bob's","rawWord":"Bob's","start":43.968,"end":44.27},{"word":"phone","rawWord":"phone","start":44.304,"end":44.595},{"word":"buzzes","rawWord":"buzzes","start":44.641,"end":45.001}]},{"id":56,"start":45.047,"end":45.827,"color":"#ff6b4a","text":"in his pocket,","words":[{"word":"in","rawWord":"in","start":45.047,"end":45.105},{"word":"his","rawWord":"his","start":45.14,"end":45.233},{"word":"pocket","rawWord":"pocket,","start":45.268,"end":45.663}]},{"id":57,"start":45.837,"end":47.174,"color":"#38bdf8","text":"once, twice,","words":[{"word":"once","rawWord":"once,","start":45.837,"end":46.301},{"word":"twice","rawWord":"twice,","start":46.475,"end":47.009}]},{"id":58,"start":47.184,"end":48.079,"color":"#facc15","text":"three times,","words":[{"word":"three","rawWord":"three","start":47.184,"end":47.416},{"word":"times","rawWord":"times,","start":47.451,"end":47.938}]},{"id":59,"start":48.089,"end":48.845,"color":"#c084fc","text":"and dumps straight","words":[{"word":"and","rawWord":"and","start":48.089,"end":48.229},{"word":"dumps","rawWord":"dumps","start":48.287,"end":48.496},{"word":"straight","rawWord":"straight","start":48.554,"end":48.821}]},{"id":60,"start":48.855,"end":49.948,"color":"#4ade80","text":"to voicemail.","words":[{"word":"to","rawWord":"to","start":48.855,"end":48.902},{"word":"voicemail.","rawWord":"voicemail.","start":48.948,"end":49.529}]},{"id":61,"start":49.958,"end":50.517,"color":"#ff6b4a","text":"Sarah doesn't","words":[{"word":"Sarah","rawWord":"Sarah","start":49.958,"end":50.214},{"word":"doesn't","rawWord":"doesn't","start":50.249,"end":50.492}]},{"id":62,"start":50.527,"end":51.376,"color":"#38bdf8","text":"leave a message,","words":[{"word":"leave","rawWord":"leave","start":50.527,"end":50.69},{"word":"a","rawWord":"a","start":50.725,"end":50.748},{"word":"message","rawWord":"message,","start":50.794,"end":51.259}]},{"id":63,"start":51.386,"end":52.572,"color":"#facc15","text":"because 78% of","words":[{"word":"because","rawWord":"because","start":51.386,"end":51.63},{"word":"78%","rawWord":"78%","start":51.677,"end":52.42},{"word":"of","rawWord":"of","start":52.489,"end":52.536}]},{"id":64,"start":52.582,"end":53.257,"color":"#c084fc","text":"homeowners hire","words":[{"word":"homeowners","rawWord":"homeowners","start":52.582,"end":53.023},{"word":"hire","rawWord":"hire","start":53.058,"end":53.232}]},{"id":65,"start":53.267,"end":53.861,"color":"#4ade80","text":"the very first","words":[{"word":"the","rawWord":"the","start":53.267,"end":53.337},{"word":"very","rawWord":"very","start":53.395,"end":53.569},{"word":"first","rawWord":"first","start":53.627,"end":53.825}]},{"id":66,"start":53.871,"end":54.372,"color":"#ff6b4a","text":"business that","words":[{"word":"business","rawWord":"business","start":53.871,"end":54.184},{"word":"that","rawWord":"that","start":54.219,"end":54.335}]},{"id":67,"start":54.382,"end":55.173,"color":"#38bdf8","text":"answers.","words":[{"word":"answers.","rawWord":"answers.","start":54.382,"end":54.904}]},{"id":68,"start":55.183,"end":55.742,"color":"#facc15","text":"Within ten","words":[{"word":"Within","rawWord":"Within","start":55.183,"end":55.438},{"word":"ten","rawWord":"ten","start":55.496,"end":55.671}]},{"id":69,"start":55.752,"end":56.799,"color":"#c084fc","text":"seconds, she taps","words":[{"word":"seconds","rawWord":"seconds,","start":55.752,"end":56.228},{"word":"she","rawWord":"she","start":56.402,"end":56.507},{"word":"taps","rawWord":"taps","start":56.553,"end":56.774}]},{"id":70,"start":56.809,"end":57.135,"color":"#4ade80","text":"the next","words":[{"word":"the","rawWord":"the","start":56.809,"end":56.878},{"word":"next","rawWord":"next","start":56.913,"end":57.087}]},{"id":71,"start":57.145,"end":58.853,"color":"#ff6b4a","text":"contractor on Google.","words":[{"word":"contractor","rawWord":"contractor","start":57.145,"end":57.668},{"word":"on","rawWord":"on","start":57.714,"end":57.784},{"word":"Google.","rawWord":"Google.","start":57.83,"end":58.271}]},{"id":72,"start":58.863,"end":59.643,"color":"#38bdf8","text":"That shop answers","words":[{"word":"That","rawWord":"That","start":58.863,"end":59.026},{"word":"shop","rawWord":"shop","start":59.072,"end":59.27},{"word":"answers","rawWord":"answers","start":59.328,"end":59.607}]},{"id":73,"start":59.653,"end":60.56,"color":"#facc15","text":"on ring one,","words":[{"word":"on","rawWord":"on","start":59.653,"end":59.746},{"word":"ring","rawWord":"ring","start":59.804,"end":59.966},{"word":"one","rawWord":"one,","start":60.036,"end":60.419}]},{"id":74,"start":60.57,"end":61.419,"color":"#c084fc","text":"rolls a truck,","words":[{"word":"rolls","rawWord":"rolls","start":60.57,"end":60.826},{"word":"a","rawWord":"a","start":60.86,"end":60.884},{"word":"truck","rawWord":"truck,","start":60.918,"end":61.302}]},{"id":75,"start":61.429,"end":61.919,"color":"#4ade80","text":"and collects an","words":[{"word":"and","rawWord":"and","start":61.429,"end":61.534},{"word":"collects","rawWord":"collects","start":61.58,"end":61.836},{"word":"an","rawWord":"an","start":61.859,"end":61.905}]},{"id":76,"start":61.929,"end":63.033,"color":"#ff6b4a","text":"$8,000 check that","words":[{"word":"$8000","rawWord":"$8,000","start":61.929,"end":62.579},{"word":"check","rawWord":"check","start":62.625,"end":62.834},{"word":"that","rawWord":"that","start":62.881,"end":62.997}]},{"id":77,"start":63.043,"end":63.718,"color":"#38bdf8","text":"had Bob's name","words":[{"word":"had","rawWord":"had","start":63.043,"end":63.148},{"word":"Bob's","rawWord":"Bob's","start":63.194,"end":63.449},{"word":"name","rawWord":"name","start":63.496,"end":63.693}]},{"id":78,"start":63.728,"end":64.415,"color":"#facc15","text":"written all over","words":[{"word":"written","rawWord":"written","start":63.728,"end":63.972},{"word":"all","rawWord":"all","start":64.018,"end":64.158},{"word":"over","rawWord":"over","start":64.204,"end":64.367}]},{"id":79,"start":64.425,"end":65.227,"color":"#c084fc","text":"it.","words":[{"word":"it.","rawWord":"it.","start":64.425,"end":64.727}]},{"id":80,"start":65.237,"end":65.785,"color":"#4ade80","text":"That is why","words":[{"word":"That","rawWord":"That","start":65.237,"end":65.423},{"word":"is","rawWord":"is","start":65.458,"end":65.516},{"word":"why","rawWord":"why","start":65.562,"end":65.737}]},{"id":81,"start":65.795,"end":67.097,"color":"#ff6b4a","text":"we built Ava.","words":[{"word":"we","rawWord":"we","start":65.795,"end":65.888},{"word":"built","rawWord":"built","start":65.934,"end":66.131},{"word":"Ava.","rawWord":"Ava.","start":66.201,"end":66.677}]},{"id":82,"start":67.107,"end":67.7,"color":"#38bdf8","text":"She answers your","words":[{"word":"She","rawWord":"She","start":67.107,"end":67.223},{"word":"answers","rawWord":"answers","start":67.281,"end":67.525},{"word":"your","rawWord":"your","start":67.559,"end":67.675}]},{"id":83,"start":67.71,"end":69.186,"color":"#facc15","text":"phone in 0.8","words":[{"word":"phone","rawWord":"phone","start":67.71,"end":67.977},{"word":"in","rawWord":"in","start":68.012,"end":68.082},{"word":"0.8","rawWord":"0.8","start":68.175,"end":69.138}]},{"id":84,"start":69.196,"end":70.371,"color":"#c084fc","text":"seconds, calms the","words":[{"word":"seconds","rawWord":"seconds,","start":69.196,"end":69.684},{"word":"calms","rawWord":"calms","start":69.858,"end":70.23},{"word":"the","rawWord":"the","start":70.264,"end":70.334}]},{"id":85,"start":70.381,"end":71.322,"color":"#4ade80","text":"homeowner down,","words":[{"word":"homeowner","rawWord":"homeowner","start":70.381,"end":70.775},{"word":"down","rawWord":"down,","start":70.822,"end":71.205}]},{"id":86,"start":71.332,"end":72.611,"color":"#ff6b4a","text":"qualifies the job,","words":[{"word":"qualifies","rawWord":"qualifies","start":71.332,"end":71.808},{"word":"the","rawWord":"the","start":71.843,"end":71.925},{"word":"job","rawWord":"job,","start":71.959,"end":72.412}]},{"id":87,"start":72.621,"end":72.959,"color":"#38bdf8","text":"books your","words":[{"word":"books","rawWord":"books","start":72.621,"end":72.818},{"word":"your","rawWord":"your","start":72.842,"end":72.935}]},{"id":88,"start":72.969,"end":73.761,"color":"#facc15","text":"calendar, and","words":[{"word":"calendar","rawWord":"calendar,","start":72.969,"end":73.445},{"word":"and","rawWord":"and","start":73.573,"end":73.712}]},{"id":89,"start":73.771,"end":74.875,"color":"#c084fc","text":"texts the dispatch","words":[{"word":"texts","rawWord":"texts","start":73.771,"end":74.2},{"word":"the","rawWord":"the","start":74.27,"end":74.363},{"word":"dispatch","rawWord":"dispatch","start":74.397,"end":74.792}]},{"id":90,"start":74.885,"end":75.537,"color":"#4ade80","text":"straight to Bob's","words":[{"word":"straight","rawWord":"straight","start":74.885,"end":75.164},{"word":"to","rawWord":"to","start":75.199,"end":75.245},{"word":"Bob's","rawWord":"Bob's","start":75.291,"end":75.524}]},{"id":91,"start":75.547,"end":76.106,"color":"#ff6b4a","text":"phone before the","words":[{"word":"phone","rawWord":"phone","start":75.547,"end":75.756},{"word":"before","rawWord":"before","start":75.791,"end":75.976},{"word":"the","rawWord":"the","start":76.011,"end":76.081}]},{"id":92,"start":76.116,"end":76.721,"color":"#38bdf8","text":"customer can even","words":[{"word":"customer","rawWord":"customer","start":76.116,"end":76.394},{"word":"can","rawWord":"can","start":76.429,"end":76.534},{"word":"even","rawWord":"even","start":76.569,"end":76.696}]},{"id":93,"start":76.731,"end":77.151,"color":"#facc15","text":"open another","words":[{"word":"open","rawWord":"open","start":76.731,"end":76.882},{"word":"another","rawWord":"another","start":76.917,"end":77.126}]},{"id":94,"start":77.161,"end":78.335,"color":"#c084fc","text":"Google tab.","words":[{"word":"Google","rawWord":"Google","start":77.161,"end":77.404},{"word":"tab.","rawWord":"tab.","start":77.428,"end":77.834}]},{"id":95,"start":78.345,"end":78.915,"color":"#4ade80","text":"Stop handing","words":[{"word":"Stop","rawWord":"Stop","start":78.345,"end":78.565},{"word":"handing","rawWord":"handing","start":78.612,"end":78.879}]},{"id":96,"start":78.925,"end":79.995,"color":"#ff6b4a","text":"$8,000 checks to","words":[{"word":"$8000","rawWord":"$8,000","start":78.925,"end":79.622},{"word":"checks","rawWord":"checks","start":79.657,"end":79.877},{"word":"to","rawWord":"to","start":79.912,"end":79.959}]},{"id":97,"start":80.005,"end":81.086,"color":"#38bdf8","text":"your competitors.","words":[{"word":"your","rawWord":"your","start":80.005,"end":80.121},{"word":"competitors.","rawWord":"competitors.","start":80.156,"end":80.771}]},{"id":98,"start":81.096,"end":81.655,"color":"#facc15","text":"Call the live","words":[{"word":"Call","rawWord":"Call","start":81.096,"end":81.271},{"word":"the","rawWord":"the","start":81.317,"end":81.387},{"word":"live","rawWord":"live","start":81.421,"end":81.63}]},{"id":99,"start":81.665,"end":82.317,"color":"#c084fc","text":"demo number on","words":[{"word":"demo","rawWord":"demo","start":81.665,"end":81.909},{"word":"number","rawWord":"number","start":81.967,"end":82.165},{"word":"on","rawWord":"on","start":82.223,"end":82.292}]},{"id":100,"start":82.327,"end":83.002,"color":"#4ade80","text":"your screen right","words":[{"word":"your","rawWord":"your","start":82.327,"end":82.443},{"word":"screen","rawWord":"screen","start":82.478,"end":82.71},{"word":"right","rawWord":"right","start":82.78,"end":82.966}]},{"id":101,"start":83.012,"end":83.629,"color":"#ff6b4a","text":"now to hear","words":[{"word":"now","rawWord":"now","start":83.012,"end":83.233},{"word":"to","rawWord":"to","start":83.314,"end":83.384},{"word":"hear","rawWord":"hear","start":83.442,"end":83.581}]},{"id":102,"start":83.639,"end":84.918,"color":"#38bdf8","text":"Ava answer live,","words":[{"word":"Ava","rawWord":"Ava","start":83.639,"end":83.813},{"word":"answer","rawWord":"answer","start":83.859,"end":84.092},{"word":"live","rawWord":"live,","start":84.15,"end":84.649}]},{"id":103,"start":84.928,"end":86.079,"color":"#facc15","text":"or comment AVA","words":[{"word":"or","rawWord":"or","start":84.928,"end":85.183},{"word":"comment","rawWord":"comment","start":85.392,"end":85.717},{"word":"AVA","rawWord":"AVA","start":85.764,"end":86.042}]},{"id":104,"start":86.089,"end":86.671,"color":"#c084fc","text":"below and we","words":[{"word":"below","rawWord":"below","start":86.089,"end":86.367},{"word":"and","rawWord":"and","start":86.425,"end":86.53},{"word":"we","rawWord":"we","start":86.576,"end":86.646}]},{"id":105,"start":86.681,"end":87.263,"color":"#4ade80","text":"will DM you","words":[{"word":"will","rawWord":"will","start":86.681,"end":86.808},{"word":"DM","rawWord":"DM","start":86.855,"end":87.075},{"word":"you","rawWord":"you","start":87.133,"end":87.226}]},{"id":106,"start":87.273,"end":87.553,"color":"#ff6b4a","text":"the free","words":[{"word":"the","rawWord":"the","start":87.273,"end":87.342},{"word":"free","rawWord":"free","start":87.377,"end":87.528}]},{"id":107,"start":87.563,"end":88.909,"color":"#38bdf8","text":"interactive link.","words":[{"word":"interactive","rawWord":"interactive","start":87.563,"end":87.981},{"word":"link.","rawWord":"link.","start":88.016,"end":88.469}]}];

function buildDynamicChunksFromWords(wordsArr) {
  if (!wordsArr || !wordsArr.length) return CAPTION_CHUNKS;
  const colors = ['#ff6b4a', '#38bdf8', '#facc15', '#c084fc', '#4ade80'];
  const out = [];
  for (let i = 0; i < wordsArr.length; i += 3) {
    const slice = wordsArr.slice(i, i + 3).map(w => ({
      word: w.word,
      rawWord: w.word,
      start: w.start,
      end: w.end
    }));
    const nextStart = wordsArr[i + 3] ? wordsArr[i + 3].start : (slice[slice.length - 1].end + 0.4);
    out.push({
      id: out.length + 1,
      start: slice[0].start,
      end: nextStart,
      color: colors[out.length % colors.length],
      words: slice
    });
  }
  return out;
}

function renderPreciseCaptions(time) {
  const story = window.ACTIVE_STORY || {};
  const chunks = (story.storyType && story.storyType !== 'cosmic_light' && window.ACTIVE_WORD_TIMESTAMPS)
    ? buildDynamicChunksFromWords(window.ACTIVE_WORD_TIMESTAMPS)
    : CAPTION_CHUNKS;

  let chunk = chunks.find(c => time >= c.start && time <= c.end);
  if (!chunk && time < 0.25 && chunks.length > 0) {
    chunk = chunks[0];
  }
  if (!chunk) return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const subY = H - 142; // Sits cleanly in the dark Cueva stage floor (y = 818 on 960px canvas)
  const fontSpec = '900 italic 35px "Montserrat", "Space Grotesk", "Inter", sans-serif';
  ctx.font = fontSpec;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  const spaceW = ctx.measureText(' ').width * 1.18;
  const wordWidths = chunk.words.map(w => ctx.measureText(w.rawWord).width);
  const totalTextW = wordWidths.reduce((a, b) => a + b, 0) + (chunk.words.length - 1) * spaceW;

  // Soft Diffused Radial Dark Shadow Glow behind words (NO bordered pill box — matches Cueva 100%!)
  const glowGrad = ctx.createRadialGradient(W / 2, subY, 12, W / 2, subY, Math.max(160, totalTextW * 0.72));
  glowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.78)');
  glowGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.42)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, subY - 58, W, 116);

  // Determine active word index (closest or currently spoken word)
  let activeWordIdx = chunk.words.findIndex(w => time >= w.start && time <= w.end);
  if (activeWordIdx === -1) {
    // If between words inside the chunk, keep the most recently spoken word highlighted
    for (let i = chunk.words.length - 1; i >= 0; i--) {
      if (time >= chunk.words[i].start) {
        activeWordIdx = i;
        break;
      }
    }
    if (activeWordIdx === -1) activeWordIdx = 0;
  }

  let curX = (W - totalTextW) / 2;
  chunk.words.forEach((w, idx) => {
    const isCurrent = (idx === activeWordIdx);

    ctx.save();
    ctx.font = fontSpec;

    // Deep Cueva drop shadow + crisp dark stroke
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 6.0;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.strokeText(w.rawWord, curX, subY);

    if (isCurrent) {
      ctx.fillStyle = chunk.color || '#ff6b4a'; // Vibrant Cueva Coral / Cyan / Gold highlight
      ctx.shadowColor = chunk.color || '#ff6b4a';
      ctx.shadowBlur = 16;
    } else {
      ctx.fillStyle = '#ffffff';
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

  // Crisp horizontal analog CRT scanlines across entire frame (Matches cueva_frame_01..12)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 1.4);
  }

  const beamY = (time * 140) % (H + 300) - 150;
  const beamGrad = ctx.createLinearGradient(0, beamY - 100, 0, beamY + 100);
  beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  beamGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.025)');
  beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(0, beamY - 100, W, 200);

  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.36, W / 2, H / 2, H * 0.78);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(3, 4, 10, 0.44)');
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
  ctx.fillStyle = '#090612';
  ctx.fillRect(0, 0, W, H);
  ctx.beginPath();

  ctx.save();

  // Gentle organic Cueva camera breathing
  const camZoom = 1.012 + Math.sin(time * 0.45) * 0.012;
  const camPanX = Math.sin(time * 0.65) * 3.0;
  const camPanY = Math.cos(time * 0.5) * 2.5;

  ctx.translate(W / 2, H / 2);
  ctx.scale(camZoom, camZoom);
  ctx.translate(-W / 2 + camPanX, -H / 2 + camPanY);

  // 12-SCENE CUEVA STORY PROGRESSION ALIGNED 1:1 TO THE 89.0s AUDIO
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

  // Smooth Cueva transition dip at scene cuts
  const sceneCuts = [8.0, 21.0, 27.6, 36.8, 44.2, 51.4, 57.5, 64.8, 76.2, 81.0, 85.2];
  let minCutDist = 999;
  for (let c = 0; c < sceneCuts.length; c++) {
    minCutDist = Math.min(minCutDist, Math.abs(time - sceneCuts[c]));
  }
  if (minCutDist < 0.14) {
    const fadeProg = 1 - (minCutDist / 0.14);
    const dipAlpha = Math.sin(fadeProg * (Math.PI / 2)) * 0.28;
    ctx.fillStyle = 'rgba(0, 0, 0, ' + dipAlpha + ')';
    ctx.fillRect(0, 0, W, H);
  }

  renderPreciseCaptions(time);
  renderCRTScanlines(time);

  ctx.restore();
}
