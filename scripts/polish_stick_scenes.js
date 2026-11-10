const fs = require('fs');
const path = require('path');

const targetHtml = path.resolve('website/demo/reel-creator.html');

// 1. Precise Story Layouts
const refinedScenesCode = `
// =========================================================================
// 🎬 10 NARRATION-MATCHED STICK FIGURE STORY SCENES (POLISHED & SPACED)
// =========================================================================

// --- SCENE 1: THE LASER SPEED HOOK (0.0s - 7.2s) ---
// Voiceover: "A single beam of laser light travels at 186,000 miles per second."
function renderTasklessScene1_NightPhone(t) {
  renderStoryPill('⚡ ACT 1: THE SPEED HOOK', '186,000 MILES PER SECOND');

  // Ground: Cartoon planet Earth curve at bottom
  ctx.save();
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(W / 2, H + 460, 700, 0, Math.PI * 2);
  ctx.fill();

  // Green continent patches on Earth
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.ellipse(W / 2 - 80, H - 130, 110, 45, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(W / 2 + 100, H - 120, 90, 38, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Stick figure standing on Earth holding laser pointer aiming up-right
  const charX = W / 2 - 80;
  const charY = H - 180;
  drawStickPerson(ctx, charX, charY, {
    scale: 1.15,
    facing: 1,
    expr: 'happy',
    pose: 'laser_pointer',
    color: '#ffffff'
  });

  // Neon Green Laser Beam originating EXACTLY from the laser pointer tip
  const beamStartX = charX + 54;
  const beamStartY = charY - 146;
  const beamProgress = Math.min(1, t / 1.4);
  const beamEndX = beamStartX + (W + 100) * beamProgress;
  const beamEndY = beamStartY - 380 * beamProgress;

  ctx.save();
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 28;
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 6;
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
  ctx.restore();

  // Big Bold Comic Headline Card
  ctx.save();
  const cardW = 420;
  const cardH = 110;
  const cardX = (W - cardW) / 2;
  const cardY = 110;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, 16, true, true);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('186,000', W / 2, cardY + 54);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('MILES PER SECOND', W / 2, cardY + 86);
  ctx.restore();
}

// --- SCENE 2: MOON IN 1.3s & DEEP SPACE (7.3s - 12.8s) ---
// Voiceover: "It can reach the moon in under three seconds, and cross nearly two billion miles of space in under three hours."
function renderTasklessScene2_LasersUranus(t) {
  renderStoryPill('🔭 ACT 1: INTERPLANETARY SPEED', 'EARTH TO MOON IN 1.3s');

  // Cute Cartoon Moon on Top Right with craters & smiling face!
  const moonX = W - 120;
  const moonY = 240;
  const moonR = 60;

  ctx.save();
  ctx.fillStyle = '#f8fafc';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Craters
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath(); ctx.arc(moonX - 20, moonY - 12, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 16, moonY + 18, 14, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 8, moonY - 22, 8, 0, Math.PI * 2); ctx.fill();

  // Cute Happy Face
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(moonX - 10, moonY + 2, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(moonX + 12, moonY + 2, 4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(moonX + 1, moonY + 12, 8, 0, Math.PI); ctx.stroke();
  ctx.restore();

  // Distant Saturn with cute ring on left
  ctx.save();
  const satX = 90; const satY = 380;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.arc(satX, satY, 24, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(satX, satY, 44, 9, -0.3, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  // Laser beam zooming all the way to Moon
  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.moveTo(80, H - 200);
  ctx.lineTo(moonX - 45, moonY + 30);
  ctx.stroke();
  ctx.restore();

  // Speech bubble tag: ⏱️ 1.3 SECONDS!
  drawSpeechBubble(ctx, moonX - 45, moonY - 45, '⏱️ 1.3 SECONDS!', {
    bg: '#ffffff',
    border: '#22c55e',
    textColor: '#15803d'
  });

  // Story Card
  const cardW = 420; const cardH = 100;
  const cardX = (W - cardW) / 2;
  const cardY = 100;
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

  // Leaky pipe dripping from ceiling
  drawLeakyPipe(ctx, W / 2 - 30, roomY + 20, t);

  // Panicked Homeowner Stick Figure standing in water puddle
  const homeX = W / 2 + 50;
  const homeY = roomY + 230;
  drawStickPerson(ctx, homeX, homeY, {
    scale: 1.1,
    facing: -1,
    expr: 'panic',
    pose: 'panic_phone',
    color: '#ffffff'
  });

  // Speech bubble from Homeowner: "HELP! CEILING LEAKING!"
  drawSpeechBubble(ctx, homeX - 40, homeY - 145, 'HELP! AC LEAKING! 😱', {
    bg: '#ffffff',
    border: '#ef4444',
    textColor: '#b91c1c'
  });

  // Clock on wall spinning
  const clockX = 90; const clockY = roomY + 70;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(clockX, clockY, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Spinning clock hands
  const handAngle = t * 6;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(clockX, clockY);
  ctx.lineTo(clockX + Math.cos(handAngle) * 18, clockY + Math.sin(handAngle) * 18);
  ctx.stroke();
  ctx.restore();

  // Harsh Truth Banner Card
  const cardW = 440; const cardH = 120;
  const cardX = (W - cardW) / 2;
  const cardY = H - 280;
  ctx.save();
  ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
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

// --- SCENE 4: THE 78% LAW (18.5s - 24.8s) ---
// Voiceover: "78% of homeowners hire the first business that answers the phone."
function renderTasklessScene4_Stat78Percent(t) {
  renderStoryPill('⚡ ACT 3: THE SPEED-TO-LEAD LAW', 'FIRST TO ANSWER WINS');

  // Big Bold Comic 78% Stamp
  const cardW = 440;
  const cardH = 260;
  const cardX = (W - cardW) / 2;
  const cardY = 120;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(200, 255, 0, 0.35)';
  ctx.shadowBlur = 24;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#c8ff00';
  ctx.font = '900 88px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('78%', W / 2, cardY + 105);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.fillText('OF HOMEOWNERS HIRE', W / 2, cardY + 155);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px "Space Grotesk", sans-serif';
  ctx.fillText('THE 1ST CONTRACTOR WHO ANSWERS', W / 2, cardY + 185);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px -apple-system, sans-serif';
  ctx.fillText('They do NOT wait for your voicemail.', W / 2, cardY + 225);
  ctx.restore();

  // Two cartoon stick figures at bottom:
  const g1X = W / 2 - 90;
  const g2X = W / 2 + 90;
  const gy = H - 200;

  drawStickPerson(ctx, g1X, gy, {
    scale: 1.0,
    facing: 1,
    expr: 'happy',
    pose: 'cheer',
    color: '#22c55e'
  });
  drawSpeechBubble(ctx, g1X, gy - 140, 'HIRED! 🏆', { bg: '#22c55e', border: '#ffffff', textColor: '#ffffff' });

  drawStickPerson(ctx, g2X, gy, {
    scale: 1.0,
    facing: -1,
    expr: 'sad',
    pose: 'sad_ladder',
    color: '#94a3b8'
  });
  drawSpeechBubble(ctx, g2X, gy - 140, 'Too late... 😢', { bg: '#1e293b', border: '#ef4444', textColor: '#fca5a5' });
}

// --- SCENE 5: CONTRACTOR ON LADDER & FLYING $8,000 (24.9s - 32.2s) ---
// Voiceover: "When you're on a ladder or eating dinner with family, every unanswered call is an $8,000 job handed to your competitor."
function renderTasklessScene5_TwoShopsComparison(t) {
  renderStoryPill('🪜 ACT 3: THE LADDER DILEMMA', 'MISSED CALL = -$8,000');

  const p = Math.min(1, Math.max(0, (t - 24.9) / 7.3));

  // Tall Ladder in Center-Left
  const ladX = 140;
  const ladY = 220;
  const ladH = 340;
  drawLadder(ctx, ladX, ladY, ladH);

  // Hardworking Contractor A on the ladder with sweat drops and wrench!
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

  // AC Condenser Unit on roof next to him
  ctx.fillStyle = '#334155';
  ctx.fillRect(ladX + 45, ladY + 30, 70, 80);
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(ladX + 80, ladY + 70, 24, 0, Math.PI * 2); ctx.fill();

  // His smartphone vibrating on the floor below
  const phoneX = ladX - 60;
  const phoneY = ladY + ladH;
  const buzz = Math.sin(t * 30) * 4;
  ctx.fillStyle = '#ef4444';
  roundRect(ctx, phoneX + buzz, phoneY - 26, 22, 38, 5, true, false);

  // Big Vibrating Call Bubble: "RING RING! 📞"
  drawSpeechBubble(ctx, phoneX - 10, phoneY - 50, 'RING! (( 📞 ))', {
    bg: '#ef4444',
    border: '#ffffff',
    textColor: '#ffffff'
  });

  // Flying Money Bag ($8,000) with wings flying across screen!
  const flyStartX = ladX + 30;
  const flyTargetX = W - 100;
  const curFlyX = flyStartX + (flyTargetX - flyStartX) * Math.min(1, p * 1.5);
  const curFlyY = ladY + 50 + Math.sin(t * 6) * 18;

  drawFlyingMoneyBag(ctx, curFlyX, curFlyY, t, '$8,000');

  // Competitor stick figure on far right waiting to catch the money!
  const compX = W - 90;
  const compY = ladY + ladH;
  drawStickPerson(ctx, compX, compY, {
    scale: 1.0,
    facing: -1,
    expr: 'happy',
    pose: 'cheer',
    color: '#22c55e'
  });
  drawSpeechBubble(ctx, compX, compY - 140, 'Thanks! 🤑', { bg: '#22c55e', border: '#ffffff', textColor: '#ffffff' });

  // Sad Contractor thought bubble
  drawSpeechBubble(ctx, ladX, conY - 150, "I can't reach it! 😭", {
    bg: '#ffffff',
    border: '#ef4444',
    textColor: '#b91c1c'
  });
}

// --- SCENE 6: ENTER AVA THE ROBOT (32.5s - 39.2s) ---
// Voiceover: "That's why we built Ava. She answers your shop's phone in 0.8 seconds and qualifies the caller."
function renderTasklessScene6_ShopB_AvaReply(t) {
  renderStoryPill('🤖 ACT 4: MEET AVA VOICE AI', 'ANSWERS IN 0.8 SECONDS');

  // Big Speed Badge at top: 0.8 SECONDS
  const badgeW = 380;
  const badgeH = 80;
  const badgeX = (W - badgeW) / 2;
  const badgeY = 110;
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

  // Ava the friendly robot placed in the center with plenty of space!
  const avaX = W / 2;
  const avaY = 440;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.25,
    t: t
  });

  // Speech Bubble from Ava: "Hi! VantorX Dispatch!"
  drawSpeechBubble(ctx, avaX, avaY - 170, '⚡ "Hi! How can we help?" 📞', {
    bg: '#ffffff',
    border: '#38bdf8',
    textColor: '#0284c7'
  });

  // Checklist below Ava
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

// --- SCENE 7: AUTO DISPATCH WORK VAN (39.3s - 47.2s) ---
// Voiceover: "She checks your schedule and dispatches the job to your technician's phone before the customer can open another Google tab."
function renderTasklessScene7_WorkflowNodes(t) {
  renderStoryPill('📲 ACT 4: INSTANT DISPATCH', 'TECH DISPATCHED IN 6 SECONDS');

  const p = Math.min(1, Math.max(0, (t - 39.3) / 7.9));

  // Calendar Card at top
  const calW = 380;
  const calH = 76;
  const calX = (W - calW) / 2;
  const calY = 110;
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

  // Work Van driving across screen from left to right!
  const vanStartX = -100;
  const vanEndX = W + 120;
  const vanX = vanStartX + (vanEndX - vanStartX) * Math.min(1, p * 1.3);
  const vanY = 480;

  drawWorkVan(ctx, vanX, vanY, t);

  // Speed bubble above van: "ON MY WAY! 🚗💨"
  drawSpeechBubble(ctx, vanX, vanY - 72, 'ON MY WAY! 🚗💨', {
    bg: '#38bdf8',
    border: '#ffffff',
    textColor: '#ffffff'
  });

  // Punchline Banner at bottom
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

  // Big Green Revenue Metric Card at Top
  const cardW = 440;
  const cardH = 120;
  const cardX = (W - cardW) / 2;
  const cardY = 110;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#c8ff00';
  ctx.lineWidth = 2.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 18, true, true);

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

  // Contractor sleeping in cozy bed on the left, perfectly placed on ground!
  const bedX = 140;
  const bedY = 520;
  drawBedWithContractor(ctx, bedX, bedY, t);

  // Ava on the right standing guard and stacking money!
  const avaX = W - 120;
  const avaY = 520;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.1,
    t: t
  });

  // Stack of Money Bags next to Ava!
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 20, t * 0.5, '$8k');
  drawFlyingMoneyBag(ctx, avaX - 45, avaY - 60, (t + 1) * 0.5, '$8k');
}

// --- SCENE 9: LIVE DEMO DIALER (53.1s - 58.5s) ---
// Voiceover: "Call the demo number on screen right now to hear Ava live..."
function renderTasklessScene9_LiveDemoDialer(t) {
  renderStoryPill('📞 ACT 5: TEST AVA LIVE RIGHT NOW', 'FLORIDA DEDICATED DEMO LINE');

  // Giant Friendly Clickable Phone Card at Top
  const cardW = 460;
  const cardH = 240;
  const cardX = (W - cardW) / 2;
  const cardY = 110;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PICK UP YOUR CELL & DIAL RIGHT NOW:', W / 2, cardY + 38);

  // Phone Number Pill
  const numW = cardW - 40;
  const numH = 80;
  const numX = cardX + 20;
  const numY = cardY + 58;
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

  // Ava pointing up at the phone number from below
  const avaX = W / 2;
  const avaY = 560;
  drawAvaRobot(ctx, avaX, avaY, {
    scale: 1.25,
    t: t
  });

  drawSpeechBubble(ctx, avaX + 80, avaY - 150, 'DIAL ME NOW! 📞', {
    bg: '#22c55e',
    border: '#ffffff',
    textColor: '#ffffff'
  });
}

// --- SCENE 10: VIRAL ACTION CARD (58.5s - 63.0s) ---
// Voiceover: "...or comment 'AVA' below for free instant access."
function renderTasklessScene10_TryTasklessCTA(t) {
  renderStoryPill('⚡ GET INSTANT ACCESS', 'VANTORX SOLUTIONS');

  const cardW = 460;
  const cardH = 500;
  const cardX = (W - cardW) / 2;
  const cardY = 110;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, 24, true, true);

  // Cute Ava robot icon at top
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

  // Bullets
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

  // Giant High-Contrast Action Button
  const btnW = cardW - 50;
  const btnH = 64;
  const btnX = cardX + 25;
  const btnY = cardY + 345;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, btnX, btnY, btnW, btnH, 32, true, false);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 18px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('COMMENT "AVA" ON THIS REEL', W / 2, btnY + 40);

  ctx.fillStyle = '#c8ff00';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('We\\'ll DM you the free instant setup blueprint.', W / 2, cardY + 440);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText('Or dial demo: (561) 813-8602', W / 2, cardY + 470);
  ctx.restore();
}

// --- INITIAL HERO POSTER CARD ON PAUSE / LOAD (t === 0) ---
function renderStudioHeroPosterCard(storyType) {
  renderTasklessScene1_NightPhone(1.2);
}
`;

// Replace in reel-creator.html
let html = fs.readFileSync(targetHtml, 'utf8');
const s1Idx = html.indexOf('function renderTasklessScene1_NightPhone');
const subIdx = html.indexOf('function renderKineticSubtitles');

if (s1Idx !== -1 && subIdx !== -1) {
  html = html.slice(0, s1Idx) + refinedScenesCode.trim() + '\n\n' + html.slice(subIdx);
  fs.writeFileSync(targetHtml, html, 'utf8');
  console.log('✓ Successfully applied refined, perfectly-spaced stick figure scenes!');
} else {
  console.error('Failed to locate target region');
}
