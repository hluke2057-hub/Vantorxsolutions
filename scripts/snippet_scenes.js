// =========================================================================
// 🎬 10 NARRATION-MATCHED STICK FIGURE STORY SCENES (CONTINUOUS KINETIC ACTION)
// Zero still frames: continuous locomotion, particle bursts, physics, and animations
// =========================================================================

// --- SCENE 1: THE LASER SPEED HOOK (0.0s - 7.2s) ---
// Voiceover: "A single beam of laser light travels at 186,000 miles per second."
function renderTasklessScene1_NightPhone(t) {
  renderStoryPill('⚡ ACT 1: THE SPEED HOOK', '186,000 MILES PER SECOND');

  // Ground: Cartoon planet Earth curve at bottom with continuous rotation!
  ctx.save();
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(W / 2, H + 460, 700, 0, Math.PI * 2);
  ctx.fill();

  // Continents smoothly moving across horizon
  const earthShift = (t * 18) % 360;
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

  // Stick figure sprints in from left edge (t < 0.9s), then whips out laser pointer!
  const sprintIn = Math.min(1, t / 0.9);
  const charX = -60 + (W / 2 - 20) * sprintIn;
  const charY = H - 180;
  const isRunning = t < 0.9;

  drawStickPerson(ctx, charX, charY, {
    scale: 1.15,
    facing: 1,
    expr: 'happy',
    pose: isRunning ? 'run' : 'laser_pointer',
    color: '#ffffff',
    talking: t >= 1.0,
    t: t
  });

  // Skidding dust puffs when stopping at t ≈ 0.9s
  if (t >= 0.8 && t <= 1.4) {
    const skidT = (t - 0.8) / 0.6;
    ctx.fillStyle = 'rgba(226, 232, 240, ' + (1 - skidT) + ')';
    ctx.beginPath(); ctx.arc(charX - 25, charY, 6 + skidT * 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(charX - 45, charY, 4 + skidT * 8, 0, Math.PI * 2); ctx.fill();
  }

  // Neon Green Laser Beam with traveling energy pulses and muzzle flare!
  if (t >= 0.9) {
    const beamStartX = charX + 54;
    const beamStartY = charY - 146;
    const beamProgress = Math.min(1, (t - 0.9) / 0.8);
    const beamEndX = beamStartX + (W + 200) * beamProgress;
    const beamEndY = beamStartY - 480 * beamProgress;

    ctx.save();
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 28;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 6 + Math.sin(t * 30) * 1.5;
    ctx.beginPath();
    ctx.moveTo(beamStartX, beamStartY);
    ctx.lineTo(beamEndX, beamEndY);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(beamStartX, beamStartY);
    ctx.lineTo(beamEndX, beamEndY);
    ctx.stroke();

    // Muzzle Flare spark at pointer tip
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(beamStartX, beamStartY, 8 + Math.sin(t * 40) * 3, 0, Math.PI * 2);
    ctx.fill();

    // Traveling photon pulses along the beam
    const pulseCount = 4;
    for (let p = 0; p < pulseCount; p++) {
      const pulseT = ((t * 3.5 + p / pulseCount) % 1.0);
      const px = beamStartX + (beamEndX - beamStartX) * pulseT;
      const py = beamStartY + (beamEndY - beamStartY) * pulseT;
      ctx.fillStyle = '#c8ff00';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Big Bold Comic Headline Card with floating hover and animated odometer
  ctx.save();
  const floatCard = Math.sin(t * 4) * 4;
  const cardW = 420;
  const cardH = 110;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + floatCard;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(34, 197, 94, 0.4)';
  ctx.shadowBlur = 20;
  roundRect(ctx, cardX, cardY, cardW, cardH, 16, true, true);
  ctx.shadowBlur = 0;

  const counterVal = Math.min(186000, Math.floor(t * 186000 / 2.0));
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

  const moonBounce = Math.sin(t * 6) * 8;
  const moonX = W - 125;
  const moonY = 240 + moonBounce;
  const moonR = 64;

  ctx.save();
  ctx.fillStyle = '#f8fafc';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 28;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath(); ctx.arc(moonX - 22, moonY - 14, 13, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 18, moonY + 20, 15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 9, moonY - 24, 9, 0, Math.PI * 2); ctx.fill();

  const isBlink = (t % 2.5) < 0.12;
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

  ctx.fillStyle = 'rgba(244, 114, 182, 0.6)';
  ctx.beginPath(); ctx.arc(moonX - 18, moonY + 10, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 20, moonY + 10, 6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Passing Cartoon Comet / Shooting Star streaking through space!
  const cometX = ((t * 300) % (W + 300)) - 100;
  const cometY = 160 + Math.sin(t * 2) * 40;
  ctx.save();
  const cometGrad = ctx.createLinearGradient(cometX - 80, cometY + 20, cometX, cometY);
  cometGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  cometGrad.addColorStop(1, 'rgba(200, 255, 0, 0.8)');
  ctx.strokeStyle = cometGrad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cometX - 80, cometY + 20);
  ctx.lineTo(cometX, cometY);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(cometX, cometY, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Distant Saturn with spinning tilted rings
  ctx.save();
  const satX = 90; const satY = 380 + Math.sin(t * 3) * 6;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.arc(satX, satY, 24, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(satX, satY, 44 + Math.sin(t * 4) * 2, 9, -0.3, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // Pulsing Laser beam zooming to Moon with traveling energy packets
  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5 + Math.sin(t * 24) * 1.5;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.moveTo(80, H - 200);
  ctx.lineTo(moonX - 45, moonY + 25);
  ctx.stroke();

  const sparkR = 12 + Math.sin(t * 30) * 8;
  ctx.fillStyle = '#c8ff00';
  ctx.beginPath();
  ctx.arc(moonX - 45, moonY + 25, sparkR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawSpeechBubble(ctx, moonX - 45, moonY - 45, '⏱️ 1.3 SECONDS!', {
    bg: '#ffffff',
    border: '#22c55e',
    textColor: '#15803d',
    t: t
  });

  const cardW = 420; const cardH = 100;
  const cardX = (W - cardW) / 2;
  const cardY = 100 + Math.sin(t * 3) * 3;
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

  const paceX = Math.sin(t * 4.5) * 65;
  const homeX = W / 2 + 50 + paceX;
  const homeY = roomY + 230;
  const homeFacing = paceX >= 0 ? 1 : -1;

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

  const clockX = 90; const clockY = roomY + 70;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(clockX, clockY, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  const handAngle = t * 14;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(handAngle) * 18, clockY + Math.sin(handAngle) * 18);
  ctx.stroke();

  const pendAngle = Math.sin(t * 6) * 0.4;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY + 30);
  ctx.lineTo(clockX + Math.sin(pendAngle) * 35, clockY + 30 + Math.cos(pendAngle) * 35);
  ctx.stroke();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(clockX + Math.sin(pendAngle) * 35, clockY + 30 + Math.cos(pendAngle) * 35, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const cardW = 440; const cardH = 120;
  const cardX = (W - cardW) / 2;
  const cardY = H - 280 + Math.sin(t * 3) * 3;
  ctx.save();
  const alertPulse = 0.15 + 0.1 * Math.sin(t * 8);
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
  const cardY = 110 + Math.sin(t * 4) * 4;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(200, 255, 0, 0.4)';
  ctx.shadowBlur = 28;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);
  ctx.shadowBlur = 0;

  for (let e = 0; e < 3; e++) {
    const arcX = cardX + Math.random() * cardW;
    ctx.strokeStyle = '#c8ff00';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(arcX, cardY);
    ctx.lineTo(arcX + (Math.random() - 0.5) * 20, cardY - 10);
    ctx.stroke();
  }

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

  const run1Progress = Math.min(1, (t - 18.5) / 5.5);
  const g1X = 60 + run1Progress * 320;

  drawStickPerson(ctx, g1X, gy, {
    scale: 1.05,
    facing: 1,
    expr: 'happy',
    pose: 'run',
    color: '#22c55e',
    t: t
  });
  drawSpeechBubble(ctx, g1X, gy - 140, 'HIRED! 🏆', { bg: '#22c55e', border: '#ffffff', textColor: '#ffffff', t: t });

  ctx.save();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(380, gy - 150);
  ctx.lineTo(380, gy);
  ctx.stroke();
  const flutter = Math.sin(t * 14) * 8;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(380, gy - 140);
  ctx.lineTo(430 + flutter, gy - 125);
  ctx.lineTo(380, gy - 110);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const g2X = 80 + Math.min(120, run1Progress * 100);
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

  const acVibe = Math.sin(t * 30) * 1.5;
  ctx.fillStyle = '#334155';
  ctx.fillRect(ladX + 45 + acVibe, ladY + 30, 70, 80);
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(ladX + 80 + acVibe, ladY + 70, 24, 0, Math.PI * 2); ctx.fill();

  const phoneX = ladX - 60;
  const phoneY = ladY + ladH;
  const hopY = Math.abs(Math.sin(t * 18)) * 14;
  const phoneRot = Math.sin(t * 24) * 0.2;

  ctx.save();
  ctx.translate(phoneX, phoneY - hopY);
  ctx.rotate(phoneRot);
  ctx.fillStyle = '#ef4444';
  roundRect(ctx, -11, -19, 22, 38, 5, true, false);

  const ringR = (t * 40) % 50;
  const ringA = Math.max(0, 1 - ringR / 50);
  ctx.strokeStyle = 'rgba(239, 68, 68, ' + ringA + ')';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, ringR, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  drawSpeechBubble(ctx, phoneX - 10, phoneY - 50, 'RING! (( 📞 ))', {
    bg: '#ef4444',
    border: '#ffffff',
    textColor: '#ffffff',
    t: t
  });

  const flyStartX = ladX + 30;
  const flyTargetX = W - 100;
  const curFlyX = flyStartX + (flyTargetX - flyStartX) * Math.min(1, p * 1.4);
  const curFlyY = ladY + 50 + Math.sin(t * 7) * 25;

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
  const badgeY = 110 + Math.sin(t * 4) * 3;
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
  const calY = 110 + Math.sin(t * 4) * 3;
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

  // Background building silhouettes scrolling left at 80 px/s
  const bldgShift = (t * 80) % 240;
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

  // White Dashed Road Stripes rushing past at 500 px/s!
  const stripeShift = (t * 500) % 90;
  ctx.fillStyle = '#facc15';
  for (let s = -1; s < 8; s++) {
    ctx.fillRect(s * 90 - stripeShift, vanY + 42, 45, 8);
  }

  const vanStartX = -100;
  const vanEndX = W + 120;
  const vanX = vanStartX + (vanEndX - vanStartX) * Math.min(1, p * 1.3);

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
  const cardY = 110 + Math.sin(t * 4) * 3;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(200, 255, 0, 0.35)';
  ctx.shadowBlur = 24;
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

  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 20, t * 0.5, '$8k');
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 60, (t + 1) * 0.5, '$8k');
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 100, (t + 2) * 0.5, '$8k');

  for (let b = 0; b < 2; b++) {
    const bT = (t * 0.8 + b * 0.6) % 1.5;
    const bY = avaY - 80 - bT * 40;
    const bX = avaX - 45 + Math.sin(t * 4 + b) * 10;
    const bA = Math.max(0, 1 - bT / 1.5);
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
  const cardY = 110 + Math.sin(t * 4) * 3;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
  ctx.shadowBlur = 24;
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

  const pingR = (t * 50) % 90;
  const pingA = Math.max(0, 1 - pingR / 90);
  ctx.strokeStyle = 'rgba(56, 189, 248, ' + pingA + ')';
  ctx.lineWidth = 2;
  roundRect(ctx, numX - pingR * 0.3, numY - pingR * 0.2, numW + pingR * 0.6, numH + pingR * 0.4, 18, false, true);

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

  const arrowBounce = Math.sin(t * 12) * 12;
  ctx.save();
  ctx.fillStyle = '#c8ff00';
  ctx.shadowColor = '#c8ff00';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(W / 2, cardY - 20 + arrowBounce);
  ctx.lineTo(W / 2 - 14, cardY - 40 + arrowBounce);
  ctx.lineTo(W / 2 + 14, cardY - 40 + arrowBounce);
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

  const emojis = ['❤️', '🔥', '🚀', '⚡', '👏'];
  for (let em = 0; em < 8; em++) {
    const emT = (t * 0.8 + em * 0.45) % 3.0;
    const emY = H - emT * 280;
    const emX = 60 + (em * 65) % (W - 120) + Math.sin(t * 4 + em) * 16;
    const emAlpha = Math.max(0, 1 - emT / 3.0);
    ctx.save();
    ctx.globalAlpha = emAlpha;
    ctx.font = '22px -apple-system, sans-serif';
    ctx.fillText(emojis[em % emojis.length], emX, emY);
    ctx.restore();
  }

  for (let c = 0; c < 16; c++) {
    const cT = (t * 1.5 + c * 0.3) % 2.5;
    const cY = cT * 380;
    const cX = (c * 35) % W + Math.sin(t * 6 + c) * 20;
    const cRot = t * 8 + c;
    const cColor = c % 3 === 0 ? '#c8ff00' : (c % 3 === 1 ? '#38bdf8' : '#f43f5e');
    ctx.save();
    ctx.translate(cX, cY);
    ctx.rotate(cRot);
    ctx.fillStyle = cColor;
    ctx.fillRect(-4, -6, 8, 12);
    ctx.restore();
  }

  const cardW = 460;
  const cardH = 500;
  const cardX = (W - cardW) / 2;
  const cardY = 110 + Math.sin(t * 4) * 3;

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
  const btnPulse = 1.0 + Math.sin(t * 8) * 0.03;

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
