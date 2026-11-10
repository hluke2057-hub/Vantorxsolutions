// =========================================================================
// 🎬 10 NARRATION-MATCHED STICK FIGURE STORY SCENES (SILKY SMOOTH & CLEAN)
// Smooth continuous motion, fluid kinematics, organic easing, and zero jitter
// =========================================================================

// --- SCENE 1: THE LASER SPEED HOOK (0.0s - 7.2s) ---
// Voiceover: "A single beam of laser light travels at 186,000 miles per second."
function renderTasklessScene1_NightPhone(t) {
  renderStoryPill('⚡ ACT 1: THE SPEED HOOK', '186,000 MILES PER SECOND');

  // Ground: Cartoon planet Earth curve with smooth slow rotation
  ctx.save();
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(W / 2, H + 460, 700, 0, Math.PI * 2);
  ctx.fill();

  // Continents smoothly gliding across horizon
  const earthShift = (t * 8) % 360;
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.ellipse(W / 2 - 120 + earthShift, H - 130, 90, 42, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(W / 2 + 140 + earthShift, H - 120, 80, 36, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(W / 2 - 380 + earthShift, H - 125, 95, 40, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Stick figure smoothly enters with natural ease-out (t < 1.0s), then aims laser!
  const sprintIn = Math.min(1, t / 1.0);
  // Cubic ease-out for smooth landing
  const sprintEase = 1 - Math.pow(1 - sprintIn, 3);
  const charX = -60 + (W / 2 - 20) * sprintEase;
  const charY = H - 180;
  const isRunning = t < 1.0;

  drawStickPerson(ctx, charX, charY, {
    scale: 1.15,
    facing: 1,
    expr: 'happy',
    pose: isRunning ? 'run' : 'laser_pointer',
    color: '#ffffff',
    talking: t >= 1.2,
    t: t
  });

  // Soft dust puff upon arrival (t ≈ 1.0s)
  if (t >= 0.9 && t <= 1.5) {
    const skidProg = (t - 0.9) / 0.6;
    const skidAlpha = Math.sin(skidProg * Math.PI) * 0.6;
    ctx.fillStyle = 'rgba(226, 232, 240, ' + skidAlpha + ')';
    ctx.beginPath(); ctx.arc(charX - 25, charY, 6 + skidProg * 8, 0, Math.PI * 2); ctx.fill();
  }

  // Neon Green Laser Beam with smooth glowing beam & traveling light pulses
  if (t >= 1.0) {
    const beamStartX = charX + 54;
    const beamStartY = charY - 146;
    const beamProgress = Math.min(1, (t - 1.0) / 0.7);
    const beamEase = 1 - Math.pow(1 - beamProgress, 2);
    const beamEndX = beamStartX + (W + 200) * beamEase;
    const beamEndY = beamStartY - 480 * beamEase;

    ctx.save();
    // Glowing laser beam
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 24;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 5.5 + Math.sin(t * 6) * 0.8;
    ctx.beginPath();
    ctx.moveTo(beamStartX, beamStartY);
    ctx.lineTo(beamEndX, beamEndY);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(beamStartX, beamStartY);
    ctx.lineTo(beamEndX, beamEndY);
    ctx.stroke();

    // Soft muzzle glow
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(beamStartX, beamStartY, 7 + Math.sin(t * 8) * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Traveling light pulses along the beam
    const pulseCount = 3;
    for (let p = 0; p < pulseCount; p++) {
      const pulseT = ((t * 1.6 + p / pulseCount) % 1.0);
      const px = beamStartX + (beamEndX - beamStartX) * pulseT;
      const py = beamStartY + (beamEndY - beamStartY) * pulseT;
      const pulseAlpha = Math.sin(pulseT * Math.PI);
      ctx.fillStyle = 'rgba(200, 255, 0, ' + pulseAlpha + ')';
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Comic Headline Card with smooth, gentle float
  ctx.save();
  const floatCard = Math.sin(t * 1.8) * 3;
  const cardW = 420;
  const cardH = 110;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + floatCard;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(34, 197, 94, 0.3)';
  ctx.shadowBlur = 18;
  roundRect(ctx, cardX, cardY, cardW, cardH, 16, true, true);
  ctx.shadowBlur = 0;

  // Smooth odometer count up
  const counterVal = Math.min(186000, Math.floor(Math.min(1, t / 2.0) * 186000));
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(counterVal.toLocaleString(), W / 2, cardY + 54);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('⚡ MILES PER SECOND ⚡', W / 2, cardY + 86);
  ctx.restore();
}

// --- SCENE 2: MOON IN 1.3s & DEEP SPACE (7.3s - 12.8s) ---
// Voiceover: "It can reach the moon in under three seconds, and cross nearly two billion miles of space in under three hours."
function renderTasklessScene2_LasersUranus(t) {
  renderStoryPill('🔭 ACT 1: INTERPLANETARY SPEED', 'EARTH TO MOON IN 1.3s');

  // Moon with gentle, soothing float (NO rapid bouncing)
  const moonBounce = Math.sin(t * 1.8) * 5;
  const moonX = W - 125;
  const moonY = 240 + moonBounce;
  const moonR = 64;

  ctx.save();
  ctx.fillStyle = '#f8fafc';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.35)';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Craters
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath(); ctx.arc(moonX - 22, moonY - 14, 13, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 18, moonY + 20, 15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 9, moonY - 24, 9, 0, Math.PI * 2); ctx.fill();

  // Gentle Blinking Face
  const isBlink = (t % 3.2) < 0.14;
  ctx.fillStyle = '#1e293b';
  if (isBlink) {
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(moonX - 16, moonY); ctx.lineTo(moonX - 4, moonY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(moonX + 6, moonY); ctx.lineTo(moonX + 18, moonY); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(moonX - 10, moonY, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(moonX + 12, moonY, 4.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(moonX + 1, moonY + 12, 10, 0, Math.PI); ctx.stroke();

  // Pink Cheeks
  ctx.fillStyle = 'rgba(244, 114, 182, 0.5)';
  ctx.beginPath(); ctx.arc(moonX - 18, moonY + 10, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 20, moonY + 10, 6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Shooting Star gliding smoothly across space
  const cometCycle = ((t * 0.45) % 1.0);
  const cometX = -50 + cometCycle * (W + 200);
  const cometY = 150 + cometCycle * 60;
  ctx.save();
  const cometGrad = ctx.createLinearGradient(cometX - 70, cometY - 20, cometX, cometY);
  cometGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  cometGrad.addColorStop(1, 'rgba(200, 255, 0, 0.7)');
  ctx.strokeStyle = cometGrad;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(cometX - 70, cometY - 20);
  ctx.lineTo(cometX, cometY);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(cometX, cometY, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Saturn with tilted rings
  ctx.save();
  const satX = 90; const satY = 380 + Math.sin(t * 1.6) * 4;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.arc(satX, satY, 24, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.ellipse(satX, satY, 44, 9, -0.3, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // Smooth Laser Beam to Moon
  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.moveTo(80, H - 200);
  ctx.lineTo(moonX - 45, moonY + 25);
  ctx.stroke();

  // Gentle impact glow on Moon
  const sparkR = 10 + Math.sin(t * 6) * 3;
  ctx.fillStyle = 'rgba(200, 255, 0, 0.85)';
  ctx.beginPath();
  ctx.arc(moonX - 45, moonY + 25, sparkR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Speech bubble tag
  drawSpeechBubble(ctx, moonX - 45, moonY - 45, '⏱️ 1.3 SECONDS!', {
    bg: '#ffffff',
    border: '#22c55e',
    textColor: '#15803d',
    t: t
  });

  // Story Card
  const cardW = 420; const cardH = 100;
  const cardX = (W - cardW) / 2;
  const cardY = 100 + Math.sin(t * 1.5) * 2.5;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, 16, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('2 BILLION MILES', W / 2, cardY + 40);

  ctx.fillStyle = '#c8ff00';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('IN UNDER 3.0 HOURS FLAT', W / 2, cardY + 72);
  ctx.restore();
}

// --- SCENE 3: THE LEAKY PIPE & 4-HOUR DELAY (12.9s - 18.2s) ---
// Voiceover: "Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead."
function renderTasklessScene3_CustomerWindow(t) {
  renderStoryPill('💧 ACT 2: THE HOMEOWNER EMERGENCY', 'WATER LEAKING EVERYWHERE');

  const roomY = 220;
  drawLeakyPipe(ctx, W / 2 - 30, roomY + 20, t);

  // Homeowner paces smoothly with realistic stride (t * 1.8 rad/s, not frantic)
  const paceX = Math.sin(t * 1.8) * 50;
  const homeX = W / 2 + 50 + paceX;
  const homeY = roomY + 230;
  const homeFacing = Math.cos(t * 1.8) >= 0 ? 1 : -1;

  drawStickPerson(ctx, homeX, homeY, {
    scale: 1.1,
    facing: homeFacing,
    expr: 'panic',
    pose: 'panic_phone',
    color: '#ffffff',
    talking: true,
    t: t
  });

  drawSpeechBubble(ctx, homeX - 30 * homeFacing, homeY - 145, 'HELP! CEILING LEAKING! 😱', {
    bg: '#ffffff',
    border: '#ef4444',
    textColor: '#b91c1c',
    t: t
  });

  // Wall Clock with smooth sweep second hand & gentle pendulum
  const clockX = 90; const clockY = roomY + 70;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(clockX, clockY, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Smooth continuous sweep hand
  const handAngle = t * 4.5;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(handAngle) * 18, clockY + Math.sin(handAngle) * 18);
  ctx.stroke();

  // Pendulum
  const pendAngle = Math.sin(t * 3.0) * 0.3;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY + 30);
  ctx.lineTo(clockX + Math.sin(pendAngle) * 35, clockY + 30 + Math.cos(pendAngle) * 35);
  ctx.stroke();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(clockX + Math.sin(pendAngle) * 35, clockY + 30 + Math.cos(pendAngle) * 35, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Banner Card with gentle breathing pulse
  const cardW = 440; const cardH = 120;
  const cardX = (W - cardW) / 2;
  const cardY = H - 280 + Math.sin(t * 1.5) * 2.5;
  ctx.save();
  const alertPulse = 0.16 + 0.06 * Math.sin(t * 3);
  ctx.fillStyle = 'rgba(239, 68, 68, ' + alertPulse + ')';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 16, true, true);

  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('AVERAGE CONTRACTOR CALLBACK TIME:', W / 2, cardY + 36);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.fillText('4.2 HOURS (OR NEVER)', W / 2, cardY + 76);

  ctx.fillStyle = '#fca5a5';
  ctx.font = '500 12px -apple-system, sans-serif';
  ctx.fillText('Space travel is literally faster than returning a lead.', W / 2, cardY + 102);
  ctx.restore();
}

// --- SCENE 4: THE 78% RACE TRACK (18.5s - 24.8s) ---
// Voiceover: "78% of homeowners hire the first business that answers the phone."
function renderTasklessScene4_Stat78Percent(t) {
  renderStoryPill('⚡ ACT 3: THE SPEED-TO-LEAD LAW', 'FIRST TO ANSWER WINS');

  const cardW = 440;
  const cardH = 240;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + Math.sin(t * 1.8) * 3;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(200, 255, 0, 0.3)';
  ctx.shadowBlur = 22;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 86px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('78%', W / 2, cardY + 98);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.fillText('OF HOMEOWNERS HIRE', W / 2, cardY + 148);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px "Space Grotesk", sans-serif';
  ctx.fillText('THE 1ST CONTRACTOR WHO ANSWERS', W / 2, cardY + 178);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('They do NOT wait for your voicemail.', W / 2, cardY + 212);
  ctx.restore();

  const gy = H - 200;

  // Contractor 1 smoothly sprints across screen with cubic ease
  const run1Progress = Math.min(1, (t - 18.5) / 5.5);
  const runEase = 1 - Math.pow(1 - run1Progress, 2);
  const g1X = 60 + runEase * 320;

  drawStickPerson(ctx, g1X, gy, {
    scale: 1.05,
    facing: 1,
    expr: 'happy',
    pose: 'run',
    color: '#22c55e',
    t: t
  });
  drawSpeechBubble(ctx, g1X, gy - 140, 'HIRED! 🏆', { bg: '#22c55e', border: '#ffffff', textColor: '#ffffff', t: t });

  // Finish Ribbon
  ctx.save();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(380, gy - 150);
  ctx.lineTo(380, gy);
  ctx.stroke();
  const flutter = Math.sin(t * 6) * 6;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(380, gy - 140);
  ctx.lineTo(430 + flutter, gy - 125);
  ctx.lineTo(380, gy - 110);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Contractor 2 dragging heavy voicemail weight slowly
  const g2X = 80 + Math.min(110, runEase * 80);
  drawStickPerson(ctx, g2X, gy, {
    scale: 0.95,
    facing: 1,
    expr: 'sad',
    pose: 'drag_heavy',
    color: '#94a3b8',
    t: t
  });

  ctx.save();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(g2X - 10, gy);
  ctx.lineTo(g2X - 45, gy);
  ctx.stroke();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(g2X - 55, gy - 8, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 9px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VOICEMAIL', g2X - 55, gy - 26);
  ctx.restore();
}

// --- SCENE 5: CONTRACTOR ON LADDER & FLYING $8,000 (24.9s - 32.2s) ---
// Voiceover: "When you're on a ladder or eating dinner with family, every unanswered call is an $8,000 job handed to your competitor."
function renderTasklessScene5_TwoShopsComparison(t) {
  renderStoryPill('🪜 ACT 3: THE LADDER DILEMMA', 'MISSED CALL = -$8,000');

  const p = Math.min(1, Math.max(0, (t - 24.9) / 7.3));

  const ladX = 140;
  const ladY = 220;
  const ladH = 340;
  drawLadder(ctx, ladX, ladY, ladH, t);

  const conY = ladY + 80;
  drawStickPerson(ctx, ladX, conY, {
    scale: 1.05,
    facing: 1,
    expr: 'sweat',
    hat: 'hardhat',
    vest: true,
    pose: 'ladder_work',
    t: t
  });

  // AC Condenser Unit
  ctx.fillStyle = '#334155';
  ctx.fillRect(ladX + 45, ladY + 30, 70, 80);
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(ladX + 80, ladY + 70, 24, 0, Math.PI * 2); ctx.fill();

  // Smartphone on ground ringing gently with smooth expanding rings
  const phoneX = ladX - 60;
  const phoneY = ladY + ladH;
  const hopY = Math.abs(Math.sin(t * 6)) * 6; // Gentle clean hop

  ctx.save();
  ctx.translate(phoneX, phoneY - hopY);
  ctx.fillStyle = '#ef4444';
  roundRect(ctx, -11, -19, 22, 38, 5, true, false);

  const ringCycle = (t * 1.4) % 1.0;
  const ringR = ringCycle * 40;
  const ringA = Math.sin(ringCycle * Math.PI) * 0.7;
  ctx.strokeStyle = 'rgba(239, 68, 68, ' + ringA + ')';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, ringR, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  drawSpeechBubble(ctx, phoneX - 10, phoneY - 45, 'RING! (( 📞 ))', {
    bg: '#ef4444',
    border: '#ffffff',
    textColor: '#ffffff',
    t: t
  });

  // Flying Money Bag soaring smoothly across screen like a bird
  const flyStartX = ladX + 30;
  const flyTargetX = W - 100;
  const flightEase = 0.5 - 0.5 * Math.cos(Math.min(1, p * 1.25) * Math.PI);
  const curFlyX = flyStartX + (flyTargetX - flyStartX) * flightEase;
  const curFlyY = ladY + 50 + Math.sin(t * 3.5) * 16;

  drawFlyingMoneyBag(ctx, curFlyX, curFlyY, t, '$8,000');

  const compX = W - 90;
  const compY = ladY + ladH;
  drawStickPerson(ctx, compX, compY, {
    scale: 1.0,
    facing: -1,
    expr: 'happy',
    pose: 'jump_cheer',
    color: '#22c55e',
    t: t
  });
  drawSpeechBubble(ctx, compX, compY - 140, 'Thanks! 🤑', { bg: '#22c55e', border: '#ffffff', textColor: '#ffffff', t: t });

  drawSpeechBubble(ctx, ladX, conY - 150, "I can't reach it! 😭", {
    bg: '#ffffff',
    border: '#ef4444',
    textColor: '#b91c1c',
    t: t
  });
}

// --- SCENE 6: ENTER AVA THE ROBOT (32.5s - 39.2s) ---
// Voiceover: "That's why we built Ava. She answers your shop's phone in 0.8 seconds and qualifies the caller."
function renderTasklessScene6_ShopB_AvaReply(t) {
  renderStoryPill('🤖 ACT 4: MEET AVA VOICE AI', 'ANSWERS IN 0.8 SECONDS');

  const badgeW = 380;
  const badgeH = 80;
  const badgeX = (W - badgeW) / 2;
  const badgeY = 110 + Math.sin(t * 1.8) * 2.5;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 16, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SPEED TO LEAD BENCHMARK:', W / 2, badgeY + 28);

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.fillText('ANSWERS IN 0.8s ⚡', W / 2, badgeY + 62);
  ctx.restore();

  const avaX = W / 2;
  const avaY = 440;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.3,
    t: t
  });

  drawSpeechBubble(ctx, avaX, avaY - 180, '⚡ "Hi! How can we help?" 📞', {
    bg: '#ffffff',
    border: '#38bdf8',
    textColor: '#0284c7',
    t: t
  });

  const checkY = H - 260;
  const checkW = 440;
  const checkX = (W - checkW) / 2;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, checkX, checkY, checkW, 110, 14, true, true);

  ctx.font = 'bold 13.5px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#22c55e';
  ctx.fillText('✓ Answers in 0.8s · Never misses a ring', checkX + 24, checkY + 34);
  ctx.fillText('✓ Qualifies emergency leak & customer address', checkX + 24, checkY + 64);
  ctx.fillText('✓ Books calendar slot directly into your CRM', checkX + 24, checkY + 94);
  ctx.restore();
}

// --- SCENE 7: AUTO DISPATCH WORK VAN PARALLAX (39.3s - 47.2s) ---
// Voiceover: "She checks your schedule and dispatches the job to your technician's phone before the customer can open another Google tab."
function renderTasklessScene7_WorkflowNodes(t) {
  renderStoryPill('📲 ACT 4: INSTANT DISPATCH', 'TECH DISPATCHED IN 6 SECONDS');

  const p = Math.min(1, Math.max(0, (t - 39.3) / 7.9));

  const calW = 380;
  const calH = 76;
  const calX = (W - calW) / 2;
  const calY = 110 + Math.sin(t * 1.8) * 2.5;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  roundRect(ctx, calX, calY, calW, calH, 14, true, true);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('📅 SCHEDULE AUTO-BOOKED', W / 2, calY + 30);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "Space Grotesk", sans-serif';
  ctx.fillText('Tomorrow 8:00 AM Locked ✓', W / 2, calY + 56);
  ctx.restore();

  const vanY = 480;

  // Background building silhouettes scrolling smoothly at 45 px/s
  const bldgShift = (t * 45) % 240;
  ctx.fillStyle = '#0f172a';
  for (let b = -1; b < 4; b++) {
    const bx = b * 240 - bldgShift;
    ctx.fillRect(bx, vanY - 140, 90, 140);
    ctx.fillRect(bx + 110, vanY - 90, 70, 90);
    ctx.fillRect(bx + 190, vanY - 120, 45, 120);
  }

  // Asphalt Road surface
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, vanY + 12, W, 70);

  // Dashed Road Stripes moving at a clean, smooth cruising speed (220 px/s, no strobe!)
  const stripeShift = (t * 220) % 90;
  ctx.fillStyle = '#facc15';
  for (let s = -1; s < 8; s++) {
    ctx.fillRect(s * 90 - stripeShift, vanY + 42, 45, 8);
  }

  // Work Van driving with smooth ease
  const vanStartX = -100;
  const vanEndX = W + 120;
  const vanX = vanStartX + (vanEndX - vanStartX) * Math.min(1, p * 1.25);

  drawWorkVan(ctx, vanX, vanY, t);

  drawSpeechBubble(ctx, vanX, vanY - 72, 'ON MY WAY! 🚗💨', {
    bg: '#38bdf8',
    border: '#ffffff',
    textColor: '#ffffff',
    t: t
  });

  const banW = 440;
  const banH = 70;
  const banX = (W - banW) / 2;
  const banY = H - 260;
  ctx.save();
  ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.5;
  roundRect(ctx, banX, banY, banW, banH, 14, true, true);

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 17px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BEFORE TAB CLOSE', W / 2, banY + 30);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('Customer never even had time to call Shop B.', W / 2, banY + 52);
  ctx.restore();
}

// --- SCENE 8: SLEEPING PEACEFULLY WHILE AVA STACKS CASH (47.5s - 53.0s) ---
// Voiceover: "Stop bleeding thousands on dead voicemails."
function renderTasklessScene8_TechDispatchAndDashboard(t) {
  renderStoryPill('🛡️ ACT 5: STOP BLEEDING REVENUE', '+$44,800 BOOKED WHILE ASLEEP');

  const cardW = 440;
  const cardH = 120;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + Math.sin(t * 1.8) * 2.5;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(200, 255, 0, 0.3)';
  ctx.shadowBlur = 20;
  roundRect(ctx, cardX, cardY, cardW, cardH, 18, true, true);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MONTHLY RECOVERED REVENUE:', W / 2, cardY + 34);

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 48px "Space Grotesk", sans-serif';
  ctx.fillText('+$44,800', W / 2, cardY + 82);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 12px -apple-system, sans-serif';
  ctx.fillText('✓ 14 AFTER-HOURS JOBS SAVED THIS MONTH', W / 2, cardY + 104);
  ctx.restore();

  const bedX = 140;
  const bedY = 520;
  drawBedWithContractor(ctx, bedX, bedY, t);

  const avaX = W - 120;
  const avaY = 520;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.15,
    t: t
  });

  // Stack of Money Bags
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 20, t * 0.4, '$8k');
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 60, (t + 1) * 0.4, '$8k');
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 100, (t + 2) * 0.4, '$8k');

  // Smooth floating point rewards
  for (let b = 0; b < 2; b++) {
    const bCycle = (t * 0.5 + b * 0.5) % 1.0;
    const bY = avaY - 70 - bCycle * 45;
    const bX = avaX - 45 + Math.sin(t * 1.5 + b) * 8;
    const bA = Math.sin(bCycle * Math.PI) * 0.9;
    ctx.fillStyle = 'rgba(200, 255, 0, ' + bA + ')';
    ctx.font = 'bold 14px "Space Grotesk", sans-serif';
    ctx.fillText('+$8,000 ✓', bX, bY);
  }
}

// --- SCENE 9: LIVE DEMO DIALER WITH PULSING RADAR WAVES (53.1s - 58.5s) ---
// Voiceover: "Call the demo number on screen right now to hear Ava live..."
function renderTasklessScene9_LiveDemoDialer(t) {
  renderStoryPill('📞 ACT 5: TEST AVA LIVE RIGHT NOW', 'FLORIDA DEDICATED DEMO LINE');

  const cardW = 460;
  const cardH = 240;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + Math.sin(t * 1.8) * 2.5;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
  ctx.shadowBlur = 22;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PICK UP YOUR CELL & DIAL RIGHT NOW:', W / 2, cardY + 38);

  const numW = cardW - 40;
  const numH = 80;
  const numX = cardX + 20;
  const numY = cardY + 58;

  // Smooth expanding radar ping
  const pingCycle = (t * 0.8) % 1.0;
  const pingR = pingCycle * 60;
  const pingA = Math.sin(pingCycle * Math.PI) * 0.6;
  ctx.strokeStyle = 'rgba(56, 189, 248, ' + pingA + ')';
  ctx.lineWidth = 1.8;
  roundRect(ctx, numX - pingR * 0.25, numY - pingR * 0.18, numW + pingR * 0.5, numH + pingR * 0.36, 18, false, true);

  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  roundRect(ctx, numX, numY, numW, numH, 16, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px "JetBrains Mono", monospace';
  ctx.fillText('(561) 813-8602', W / 2, numY + 48);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('● ONLINE 24/7 · ANSWERS IN 0.8 SECONDS', W / 2, numY + 70);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('Experience real AI voice triage on your own phone.', W / 2, cardY + 175);
  ctx.fillText('No sales pitch — just instant live technology.', W / 2, cardY + 202);
  ctx.restore();

  // Smooth bouncing arrow pointing directly to the number
  const arrowBounce = Math.sin(t * 4.0) * 8;
  ctx.save();
  ctx.fillStyle = '#c8ff00';
  ctx.shadowColor = '#c8ff00';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(W / 2, cardY - 20 + arrowBounce);
  ctx.lineTo(W / 2 - 14, cardY - 38 + arrowBounce);
  ctx.lineTo(W / 2 + 14, cardY - 38 + arrowBounce);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const avaX = W / 2;
  const avaY = 560;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.25,
    t: t
  });

  drawSpeechBubble(ctx, avaX + 80, avaY - 150, 'DIAL ME NOW! 📞', {
    bg: '#22c55e',
    border: '#ffffff',
    textColor: '#ffffff',
    t: t
  });
}

// --- SCENE 10: VIRAL ACTION CARD WITH FLOATING HEARTS & CONFETTI (58.5s - 63.0s) ---
// Voiceover: "...or comment 'AVA' below for free instant access."
function renderTasklessScene10_TryTasklessCTA(t) {
  renderStoryPill('⚡ GET INSTANT ACCESS', 'VANTORX SOLUTIONS');

  // Smooth floating Instagram Emojis
  const emojis = ['❤️', '🔥', '🚀', '⚡', '👏'];
  for (let em = 0; em < 6; em++) {
    const emCycle = (t * 0.35 + em * 0.16) % 1.0;
    const emY = H - emCycle * 320;
    const emX = 70 + (em * 70) % (W - 140) + Math.sin(t * 1.5 + em) * 14;
    const emAlpha = Math.sin(emCycle * Math.PI) * 0.85;
    ctx.save();
    ctx.globalAlpha = emAlpha;
    ctx.font = '22px -apple-system, sans-serif';
    ctx.fillText(emojis[em % emojis.length], emX, emY);
    ctx.restore();
  }

  // Smooth drifting confetti
  for (let c = 0; c < 14; c++) {
    const cCycle = (t * 0.6 + c * 0.12) % 1.0;
    const cY = cCycle * 400;
    const cX = (c * 38) % W + Math.sin(t * 2.0 + c) * 16;
    const cRot = t * 3 + c;
    const cColor = c % 3 === 0 ? '#c8ff00' : (c % 3 === 1 ? '#38bdf8' : '#f43f5e');
    const cAlpha = Math.sin(cCycle * Math.PI) * 0.8;
    ctx.save();
    ctx.globalAlpha = cAlpha;
    ctx.translate(cX, cY);
    ctx.rotate(cRot);
    ctx.fillStyle = cColor;
    ctx.fillRect(-3.5, -5.5, 7, 11);
    ctx.restore();
  }

  const cardW = 460;
  const cardH = 500;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + Math.sin(t * 1.8) * 2.5;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 24, true, true);

  drawAvaRobot(ctx, W / 2, cardY + 130, {
    scale: 0.9,
    t: t
  });

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VantorX AI', W / 2, cardY + 175);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 14px -apple-system, sans-serif';
  ctx.fillText('The 24/7 Trade Dispatcher', W / 2, cardY + 202);

  const bullets = [
    '✓ Never miss another high-ticket emergency call',
    '✓ Answers in 0.8s and dispatches your techs',
    '✓ Zero software change · Keeps your number'
  ];
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'left';
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillText(bullets[i], cardX + 36, cardY + 245 + i * 28);
  }

  const btnW = cardW - 50;
  const btnH = 64;
  const btnPulse = 1.0 + Math.sin(t * 3.5) * 0.02;

  ctx.save();
  ctx.translate(W / 2, cardY + 345 + btnH / 2);
  ctx.scale(btnPulse, btnPulse);
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, -btnW / 2, -btnH / 2, btnW, btnH, 32, true, false);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 18px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('COMMENT "AVA" ON THIS REEL', 0, 7);
  ctx.restore();

  ctx.fillStyle = '#c8ff00';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("We'll DM you the free instant setup blueprint.", W / 2, cardY + 440);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText('Or dial demo: (561) 813-8602', W / 2, cardY + 470);
  ctx.restore();
}
