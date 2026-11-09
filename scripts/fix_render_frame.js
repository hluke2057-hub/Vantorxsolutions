const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'website', 'demo', 'reel-creator.html');
let html = fs.readFileSync(targetFile, 'utf8').replace(/\r\n/g, '\n');

const targetStr = `function renderDynamicAtmosphere(t, storyType) {
  // TryTaskless Signature Clean Midnight Navy Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#060913');
  grad.addColorStop(0.55, '#0b1220');
  grad.addColorStop(1, '#080d18');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

// STUDIO HERO POSTER CARD ON PAUSE / INITIAL LOAD (t === 0): Ensures canvas NEVER looks blank!`;

const replacementStr = `function renderDynamicAtmosphere(t, storyType) {
  // TryTaskless Signature Clean Midnight Navy Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#060913');
  grad.addColorStop(0.55, '#0b1220');
  grad.addColorStop(1, '#080d18');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function renderFrame(time) {
  window.renderFrame = renderFrame;

  if (!Number.isFinite(time) || isNaN(time) || time < 0) {
    time = 0;
  }
  time = Math.min(time, TOTAL_DURATION || 63);

  ctx.save();
  ctx.clearRect(0, 0, W, H);

  // Apply Camera Shake
  const shake = getCameraShake(time);
  ctx.translate(shake.x, shake.y);

  renderDynamicAtmosphere(time);

  // STUDIO HERO POSTER CARD ON PAUSE / INITIAL LOAD (t === 0): Ensures canvas NEVER looks blank!
  if (!isPlaying && time === 0) {
    renderStudioHeroPosterCard();
    ctx.restore();
    return;
  }

  // SFX Triggers calibrated to exact scene cuts
  if (isPlaying && !document.hidden) {
    if (time >= 0.2 && !playedSfxMap['laser']) { playSfx('laser'); playedSfxMap['laser'] = true; }
    if (time >= 18.0 && !playedSfxMap['subdrop']) { playSfx('subdrop'); playedSfxMap['subdrop'] = true; }
    if (time >= 22.5 && !playedSfxMap['phone']) { playSfx('phone_ring'); playedSfxMap['phone'] = true; }
    if (time >= 44.0 && !playedSfxMap['ios_ping']) { playSfx('ios_ping'); playedSfxMap['ios_ping'] = true; }
  }

  // TryTaskless Signature Scene Progression (1:1 with @trytaskless.ai viral reels)
  if (time < 7.2) {
    renderTasklessScene1_NightPhone(time);
  } else if (time < 12.8) {
    renderTasklessScene2_LasersUranus(time);
  } else if (time < 18.2) {
    renderTasklessScene3_CustomerWindow(time);
  } else if (time < 24.8) {
    renderTasklessScene4_Stat78Percent(time);
  } else if (time < 32.2) {
    renderTasklessScene5_TwoShopsComparison(time);
  } else if (time < 39.2) {
    renderTasklessScene6_ShopB_AvaReply(time);
  } else if (time < 47.2) {
    renderTasklessScene7_WorkflowNodes(time);
  } else if (time < 53.0) {
    renderTasklessScene8_TechDispatchAndDashboard(time);
  } else if (time < 58.5) {
    renderTasklessScene9_LiveDemoDialer(time);
  } else {
    renderTasklessScene10_TryTasklessCTA(time);
  }

  // TryTaskless Subtitles
  renderKineticSubtitles(time);

  // Subtle Cinematic Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}`;

if (html.includes(targetStr)) {
  html = html.replace(targetStr, replacementStr);
  console.log('PASS: Restored function renderFrame(time) wrapper');
} else {
  console.error('FAIL: targetStr not found');
  process.exit(1);
}

// Also check if there are duplicate scene switchers below
const dupIdx = html.indexOf('  // TryTaskless Signature Scene Progression');
const secondDupIdx = html.indexOf('  // TryTaskless Signature Scene Progression', dupIdx + 50);
if (secondDupIdx !== -1) {
  console.log('Found duplicate scene switchers at', secondDupIdx);
  // Remove the dangling lines up to renderKineticSubtitles
  const endDangling = html.indexOf('  // Word-by-Word Kinetic Caption Bar', secondDupIdx);
  if (endDangling !== -1) {
    html = html.slice(0, secondDupIdx) + html.slice(endDangling);
    console.log('PASS: Removed dangling duplicate scene switchers');
  }
}

fs.writeFileSync(targetFile, html, 'utf8');
console.log('REEL-CREATOR.HTML REPAIRED CLEANLY!');
