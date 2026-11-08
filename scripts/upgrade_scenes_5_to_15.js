const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetFile = path.join(__dirname, '..', 'website', 'demo', 'reel-creator.html');
let raw = fs.readFileSync(targetFile, 'utf8');
const isCRLF = raw.includes('\r\n');
let html = raw.replace(/\r\n/g, '\n');

const scene5Start = 'function renderScene5_Stat78PercentSlam(t) {';
const scenesEnd = 'function renderKineticSubtitles(t) {';

const idxStart = html.indexOf(scene5Start);
const idxEnd = html.indexOf(scenesEnd);

console.log('Scene 5 starts at:', idxStart, 'ends at:', idxEnd);

const upgradedScenes = `// -------------------------------------------------------------
// SCENE 5 (18.00s - 22.50s): 78% Stat Slam & 3D Gold Shockwave
// -------------------------------------------------------------
function renderScene5_Stat78PercentSlam(t) {
  const relT = t - 18.0;
  renderTopPill('⚡ THE SPEED-TO-LEAD LAW: 78% CLOSING RULE');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();

  // Impact Earthquake Shockwave Rings
  const wave = (relT * 3.5) % 1;
  ctx.strokeStyle = 'rgba(239, 68, 68, ' + (1 - wave) + ')';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy + 20, 40 + wave * 220, 0, Math.PI * 2);
  ctx.stroke();

  // Massive 78% Slam Counter with Spring Scale Pop
  const popScale = Math.min(1.0, relT * 3.5);
  ctx.save();
  ctx.translate(cx, cy - 25);
  ctx.scale(popScale, popScale);

  ctx.fillStyle = '#ef4444'; ctx.font = '900 110px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 40;
  ctx.fillText('78%', 0, 0);

  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4;
  ctx.strokeText('78%', 0, 0);
  ctx.restore();

  // Gold Coin / Cash Stack Slam at Bottom
  for (let c = 0; c < 6; c++) {
    const coinX = cx - 120 + c * 48;
    const coinY = cy + 70 + Math.sin(relT * 8 + c) * 4;
    ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.ellipse(coinX, coinY, 18, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2; ctx.stroke();
  }

  // Brutal Truth Subtitle Banner
  ctx.fillStyle = '#ffffff'; ctx.font = '900 24px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('OF HOMEOWNERS HIRE', cx, cy + 125);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 21px JetBrains Mono';
  ctx.fillText('THE 1ST CONTRACTOR WHO ANSWERS', cx, cy + 160);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 6 (22.50s - 26.80s): Living Room Ceiling Leak & Panicked Homeowner
// -------------------------------------------------------------
function renderScene6_IncomingEmergencyCall(t) {
  const relT = t - 22.5;
  renderTopPill('🚨 INCOMING HIGH-TICKET EMERGENCY CALL');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();

  // House Ceiling Cross-Section Beam
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 16;
  ctx.beginPath(); ctx.moveTo(cx - 160, cy - 145); ctx.lineTo(cx + 160, cy - 145); ctx.stroke();

  // Water Burst Droplets Pouring Down
  ctx.fillStyle = '#38bdf8'; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 18;
  for (let i = 0; i < 9; i++) {
    const dropY = cy - 130 + ((relT * 140 + i * 26) % 160);
    const dropX = cx - 50 + (i - 4) * 16;
    ctx.beginPath();
    ctx.arc(dropX, dropY, 5.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Water Puddle on Floor with Expanding Wave Rings
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 115, 140, 16, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Panicked Homeowner Stickman with Vibrating Phone
  drawStickFigure(ctx, cx, cy + 25, {
    pose: 'panicked_phone',
    expression: 'worried',
    color: '#ffffff',
    scale: 1.55,
    anim: relT
  });

  // Callout Quote Dialogue Bubble
  ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
  roundRect(ctx, cx - 180, cy + 130, 360, 68, 14, true, true);

  ctx.fillStyle = '#ffffff'; ctx.font = '800 17px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('"Water is pouring through my ceiling!"', cx, cy + 158);
  ctx.fillStyle = '#38bdf8'; ctx.font = '800 13px JetBrains Mono';
  ctx.fillText('DIALING CONTRACTOR SHOP PHONE...', cx, cy + 182);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 7 (26.80s - 31.00s): Contractor On The Ladder Trapped
// -------------------------------------------------------------
function renderScene7_OnTheLadderNoAnswer(t) {
  const relT = t - 26.8;
  renderTopPill('🪜 ON A LADDER · CANNOT REACH THE PHONE');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();

  // Heavy-Duty 14-Rung Extension Ladder
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(cx - 50, cy - 170); ctx.lineTo(cx - 50, cy + 150);
  ctx.moveTo(cx + 50, cy - 170); ctx.lineTo(cx + 50, cy + 150);
  for (let y = cy - 150; y <= cy + 130; y += 42) {
    ctx.moveTo(cx - 50, y); ctx.lineTo(cx + 50, y);
  }
  ctx.stroke();

  // Contractor Balancing With Hard Hat & Wrench
  drawStickFigure(ctx, cx, cy + 22, {
    pose: 'ladder_climb',
    headProp: 'hard_hat',
    expression: 'worried',
    color: '#f8fafc',
    scale: 1.55,
    anim: relT
  });

  // Flashing Red Alert Callout
  ctx.fillStyle = '#ef4444'; ctx.font = '900 28px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 24;
  ctx.fillText('PHONE RINGING IN POCKET!', cx, cy - 185);
  ctx.fillStyle = '#ffffff'; ctx.font = '700 17px Inter';
  ctx.fillText('Hands full · If you drop wrench, you fall', cx, cy - 155);

  ctx.fillStyle = '#fbbf24'; ctx.font = '800 16px monospace';
  ctx.fillText('6 RINGS ➔ ROLLS TO VOICEMAIL GRAVEYARD', cx, cy + 195);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 8 (31.00s - 35.50s): Competitor Van & Flying Cash
// -------------------------------------------------------------
function renderScene8_HandedToCompetitorBurn(t) {
  const relT = t - 31.0;
  const burnTicket = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.ticket) ? window.ACTIVE_SCENARIO.ticket : '$9,200';
  renderTopPill('💸 ' + burnTicket + ' JOB HANDED TO YOUR COMPETITOR');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();

  // Competitor Service Van Driving Across Bottom
  const vanX = cx - 180 + (relT * 95) % 360;
  ctx.fillStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 20;
  roundRect(ctx, vanX - 70, cy + 90, 140, 60, 12, true, false);
  ctx.fillStyle = '#0f172a'; // Van Windows
  roundRect(ctx, vanX + 15, cy + 95, 45, 26, 6, true, false);
  // Wheels
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(vanX - 40, cy + 150, 16, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(vanX + 40, cy + 150, 16, 0, Math.PI * 2); ctx.fill();

  // Sprinted Runner with Money Sack
  drawStickFigure(ctx, cx, cy + 10, {
    pose: 'run_cash',
    expression: 'happy',
    color: '#ef4444',
    scale: 1.55,
    anim: relT
  });

  ctx.fillStyle = '#ef4444'; ctx.font = '900 36px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 25;
  ctx.fillText('COMPETITOR ANSWERED 1ST', cx, cy - 145);

  ctx.fillStyle = '#fbbf24'; ctx.font = '800 24px JetBrains Mono';
  ctx.fillText('CONTRACT SIGNED: ' + burnTicket, cx, cy - 110);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 9 (35.50s - 40.00s): Meet Ava Heroine & Voice Waveform
// -------------------------------------------------------------
function renderScene9_MeetAvaReveal(t) {
  const relT = t - 35.5;
  renderTopPill('⚡ MEET AVA: 24/7 AI PHONE RECEPTIONIST');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();

  // Holographic Spinning Voice Waveform Sphere
  const waveRadius = 135;
  for (let bar = 0; bar < 28; bar++) {
    const angle = (bar / 28) * Math.PI * 2 + relT * 1.5;
    const barH = 15 + Math.sin(relT * 10 + bar * 1.8) * 25;
    const bx1 = cx + Math.cos(angle) * waveRadius;
    const by1 = cy - 25 + Math.sin(angle) * (waveRadius * 0.65);
    const bx2 = cx + Math.cos(angle) * (waveRadius + barH);
    const by2 = cy - 25 + Math.sin(angle) * ((waveRadius + barH) * 0.65);

    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3.5;
    ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.moveTo(bx1, by1); ctx.lineTo(bx2, by2); ctx.stroke();
  }

  // Ava Heroine Stickman with Illuminated Headset
  drawStickFigure(ctx, cx, cy + 20, {
    pose: 'ava_dispatch',
    headProp: 'headset',
    expression: 'happy',
    color: '#fbbf24',
    glow: '#f59e0b',
    scale: 1.65,
    anim: relT
  });

  ctx.fillStyle = '#34d399'; ctx.font = '900 38px Space Grotesk'; ctx.textAlign = 'center';
  ctx.shadowColor = '#10b981'; ctx.shadowBlur = 25;
  ctx.fillText('ANSWERS IN 0.8 SECONDS', cx, cy - 165);

  ctx.fillStyle = '#ffffff'; ctx.font = '800 18px Inter';
  ctx.fillText('1-Ring Pickup · Zero Voicemails · Auto-Dispatches Tech', cx, cy + 185);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 10 (40.00s - 44.00s): Conversational Triage Glass Card
// -------------------------------------------------------------
function renderScene10_ConversationalTriage(t) {
  renderTopPill('🛡️ AUTONOMOUS CALL TRIAGE & CRM CHECK');
  const cx = W / 2;

  const cardW = 460;
  const cardH = 320;
  const cardX = (W - cardW) / 2;
  const cardY = 175;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; ctx.shadowBlur = 30;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20, true, true);

  // Status Bar
  ctx.fillStyle = '#10b981';
  ctx.beginPath(); ctx.arc(cardX + 28, cardY + 28, 6, 0, Math.PI * 2); ctx.fill();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#34d399'; ctx.font = '800 12px JetBrains Mono';
  ctx.fillText('CALL ACTIVE · LATENCY: 0.81s · SERVICE TITAN SYNC', cardX + 44, cardY + 32);

  // Dialogue 1: Homeowner
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  roundRect(ctx, cardX + 20, cardY + 55, cardW - 40, 80, 12, true, false);
  ctx.fillStyle = '#94a3b8'; ctx.font = '700 11px JetBrains Mono';
  ctx.fillText('CALLER (HOMEOWNER)', cardX + 34, cardY + 76);
  ctx.fillStyle = '#ffffff'; ctx.font = '600 14px Inter';
  ctx.fillText('"My water heater burst and is flooding into my hall!"', cardX + 34, cardY + 102);

  // Dialogue 2: Ava
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, cardX + 20, cardY + 155, cardW - 40, 95, 12, true, true);
  ctx.fillStyle = '#fbbf24'; ctx.font = '800 11px JetBrains Mono';
  ctx.fillText('AVA (24/7 VOICE AI)', cardX + 34, cardY + 176);
  ctx.fillStyle = '#ffffff'; ctx.font = '600 14px Inter';
  ctx.fillText('I understand, that is urgent. Locking in priority', cardX + 34, cardY + 202);
  ctx.fillText('dispatch now. What is your address?', cardX + 34, cardY + 224);

  // Triage checklist
  ctx.fillStyle = '#10b981'; ctx.font = '800 12px JetBrains Mono';
  ctx.fillText('✓ EMERGENCY VERIFIED · ✓ SCHEDULE CHECKED · ✓ DISPATCH SENT', cardX + 24, cardY + 295);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 11 (44.00s - 47.80s): Tech SMS Dispatch Push Notification
// -------------------------------------------------------------
function renderScene11_TechSmsDispatch(t) {
  renderTopPill('📲 24-SECOND SMS TECH DISPATCH');
  const cx = W / 2;

  ctx.save();

  // Glowing iOS Push Notification Banner
  const notifW = 460;
  const notifH = 140;
  const notifX = (W - notifW) / 2;
  const notifY = 180;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#10b981'; ctx.shadowBlur = 30;
  roundRect(ctx, notifX, notifY, notifW, notifH, 18, true, true);

  // Header row
  ctx.textAlign = 'left';
  ctx.fillStyle = '#10b981'; ctx.font = '900 12px JetBrains Mono';
  ctx.fillText('💬 MESSAGES · NOW · VANTORX AI DISPATCH', notifX + 22, notifY + 30);

  ctx.fillStyle = '#fbbf24'; ctx.font = '800 15px Space Grotesk';
  ctx.fillText('🚨 HIGH-TICKET JOB QUALIFIED & DISPATCHED', notifX + 22, notifY + 60);

  ctx.fillStyle = '#ffffff'; ctx.font = '600 13px Inter';
  ctx.fillText('Customer: Mark S. · Lennox 4-Ton Emergency Replacement', notifX + 22, notifY + 85);
  ctx.fillText('Address: 4820 Bay Shore Blvd · Assigned to Tech Dave', notifX + 22, notifY + 110);

  // Technician Thumbs Up Character
  drawStickFigure(ctx, cx, 470, {
    pose: 'ava_dispatch',
    headProp: 'hard_hat',
    expression: 'happy',
    color: '#34d399',
    glow: '#10b981',
    scale: 1.5,
    anim: t
  });

  ctx.fillStyle = '#ffffff'; ctx.font = '800 20px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('Technician Notified in 24 Seconds', cx, 580);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 12 (47.80s - 50.80s): Competitor Tab Closed
// -------------------------------------------------------------
function renderScene12_CompetitorTabClosed(t) {
  renderTopPill('🔒 COMPETITOR TAB CLOSED BEFORE IT OPENS');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();

  // Browser Window Mockup Slammed with Giant Green Stamp
  const bW = 440; const bH = 220;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
  roundRect(ctx, cx - bW / 2, cy - 90, bW, bH, 16, true, true);

  // Browser Search Bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  roundRect(ctx, cx - bW / 2 + 16, cy - 75, bW - 32, 36, 8, true, false);
  ctx.fillStyle = '#94a3b8'; ctx.font = '700 12px JetBrains Mono'; ctx.textAlign = 'left';
  ctx.fillText('google.com/search?q=emergency+contractor', cx - bW / 2 + 30, cy - 52);

  // Big Green "JOB SECURED" Stamp
  ctx.save();
  ctx.translate(cx, cy + 15);
  ctx.rotate(-0.15);
  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 5;
  ctx.shadowColor = '#10b981'; ctx.shadowBlur = 30;
  roundRect(ctx, -160, -35, 320, 70, 12, true, true);

  ctx.fillStyle = '#34d399'; ctx.font = '900 36px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('JOB SECURED ✓', 0, 12);
  ctx.restore();

  ctx.fillStyle = '#ffffff'; ctx.font = '800 22px Inter'; ctx.textAlign = 'center';
  ctx.fillText('Customer Closed Before Competitor Checks Voicemail', cx, cy + 180);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 13 (50.80s - 54.00s): Stop Bleeding Dashboard
// -------------------------------------------------------------
function renderScene13_StopBleedingDashboard(t) {
  renderTopPill('📊 VANTORX CONTRACTOR REVENUE COCKPIT');
  const cx = W / 2;

  ctx.save();
  const dW = 460; const dH = 260;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 2;
  roundRect(ctx, cx - dW / 2, 180, dW, dH, 18, true, true);

  // 3 Metrics
  const metrics = [
    { label: 'MISSED CALLS', val: '0', col: '#10b981' },
    { label: 'SPEED-TO-LEAD', val: '0.8s', col: '#38bdf8' },
    { label: 'JOBS SAVED', val: '$38.4k', col: '#fbbf24' }
  ];

  for (let m = 0; m < metrics.length; m++) {
    const mx = cx - 145 + m * 145;
    ctx.textAlign = 'center';
    ctx.fillStyle = metrics[m].col;
    ctx.font = '900 34px Space Grotesk';
    ctx.shadowColor = metrics[m].col; ctx.shadowBlur = 20;
    ctx.fillText(metrics[m].val, mx, 260);

    ctx.fillStyle = '#94a3b8'; ctx.font = '800 11px JetBrains Mono';
    ctx.shadowBlur = 0;
    ctx.fillText(metrics[m].label, mx, 290);
  }

  ctx.fillStyle = '#ffffff'; ctx.font = '800 22px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('Stop Bleeding Thousands on Dead Voicemails', cx, 495);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 14 (54.00s - 58.20s): Live Demo Call (561) 813-8602
// -------------------------------------------------------------
function renderScene14_DialDemoLineLive(t) {
  renderTopPill('📞 TEST OUR LIVE DEMO LINE RIGHT NOW');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();

  // Pulsing Green Live Phone Pickup Button
  const pulse = (t * 4) % 1;
  ctx.strokeStyle = 'rgba(16, 185, 129, ' + (1 - pulse) + ')';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx, cy - 35, 75 + pulse * 60, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.shadowColor = '#10b981'; ctx.shadowBlur = 35;
  ctx.beginPath(); ctx.arc(cx, cy - 35, 70, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#0b111e'; ctx.font = '900 52px Inter'; ctx.textAlign = 'center';
  ctx.fillText('📞', cx, cy - 18);

  // Big Glowing Florida Phone Number
  ctx.fillStyle = '#ffffff'; ctx.font = '900 48px JetBrains Mono';
  ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 25;
  ctx.fillText('(561) 813-8602', cx, cy + 95);

  ctx.fillStyle = '#fbbf24'; ctx.font = '800 22px Space Grotesk';
  ctx.fillText('HEAR AVA ANSWER LIVE IN 0.8s', cx, cy + 138);

  ctx.fillStyle = '#38bdf8'; ctx.font = '700 16px Inter';
  ctx.fillText('Free interactive test · Available 24/7', cx, cy + 175);
  ctx.restore();
}

// -------------------------------------------------------------
// SCENE 15 (58.20s - 59.50s): Instagram Comment Ad Trap
// -------------------------------------------------------------
function renderScene15_InstagramCommentManyChat(t) {
  const keyword = (window.ACTIVE_SCENARIO && window.ACTIVE_SCENARIO.keyword) ? window.ACTIVE_SCENARIO.keyword : 'AVA';
  renderTopPill('💬 COMMENT "' + keyword + '" ON THIS REEL');
  const cx = W / 2; const cy = H * 0.38;

  ctx.save();

  // Floating Instagram Hearts Rising Up
  for (let h = 0; h < 6; h++) {
    const hx = W - 70 + Math.sin(t * 6 + h) * 15;
    const hy = cy + 120 - ((t * 90 + h * 45) % 240);
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e'; ctx.shadowBlur = 15;
    ctx.font = '32px Inter'; ctx.textAlign = 'center';
    ctx.fillText('❤️', hx, hy);
  }

  // Giant Comment Action Card
  const cW = 460; const cH = 200;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
  ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 35;
  roundRect(ctx, cx - cW / 2, cy - 80, cW, cH, 20, true, true);

  ctx.fillStyle = '#ffffff'; ctx.font = '900 24px Space Grotesk'; ctx.textAlign = 'center';
  ctx.fillText('WANT THE INTERACTIVE DEMO LINK?', cx, cy - 35);

  ctx.fillStyle = '#fbbf24'; ctx.font = '900 48px JetBrains Mono';
  ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 30;
  ctx.fillText('COMMENT "' + keyword + '"', cx, cy + 25);

  ctx.fillStyle = '#34d399'; ctx.font = '800 18px Inter';
  ctx.fillText('🚀 We will DM you the live link instantly!', cx, cy + 75);
  ctx.restore();
}
`;

const oldScenesBlock = html.substring(idxStart, idxEnd);
html = html.replace(oldScenesBlock, () => upgradedScenes + '\n\n');
console.log('✅ Replaced Scenes 5 through 15 with Studio-Grade Animation Engine');

// Verify syntax in memory before saving!
const scriptStartIdx = html.indexOf('<script>');
const scriptEndIdx = html.lastIndexOf('</script>');
const scriptCode = html.substring(scriptStartIdx + 8, scriptEndIdx);

try {
  new vm.Script(scriptCode, { filename: 'test-compile.js' });
  console.log('🎉 Syntax check passed! Script is 100% valid!');
} catch (err) {
  console.error('❌ Compilation error:', err.message);
  process.exit(1);
}

if (isCRLF) html = html.replace(/\n/g, '\r\n');
fs.writeFileSync(targetFile, html, 'utf8');
console.log('🎉 Successfully saved upgraded reel-creator.html! Total length:', html.length);
