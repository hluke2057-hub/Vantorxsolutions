const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'website', 'demo', 'reel-creator.html');
let raw = fs.readFileSync(targetFile, 'utf8');

// Check line endings
const isCRLF = raw.includes('\r\n');
console.log('File uses CRLF:', isCRLF);

let html = raw.replace(/\r\n/g, '\n');
console.log('Original normalized length:', html.length);

// 1. Change const SCRIPT_CUES and const WORD_TIMESTAMPS to let
html = html.replace('const SCRIPT_CUES = [', 'let SCRIPT_CUES = [');
html = html.replace('const WORD_TIMESTAMPS = [', 'let WORD_TIMESTAMPS = [');

// 2. Add IDs to Right-Hand Control Panel Scene 1
if (html.includes('<div class="scene-name">🌌 Extended Story Hook: The Speed of Light Paradox</div>')) {
  html = html.replace(
    '<div class="scene-name">🌌 Extended Story Hook: The Speed of Light Paradox</div>',
    '<div class="scene-name" id="scene1TitleLabel">🌌 Extended Story Hook: The Speed of Light Paradox</div>'
  );
  html = html.replace(
    '<div class="scene-desc">186,000 mi/sec • Deep space laser vs. Contractor voicemail</div>',
    '<div class="scene-desc" id="scene1DescLabel">186,000 mi/sec • Deep space laser vs. Contractor voicemail</div>'
  );
  console.log('✅ Updated Scene 1 Panel IDs');
}

// 3. Dynamic atmosphere function
const dynamicAtmosphereCode = `// -------------------------------------------------------------
// DYNAMIC STORY ATMOSPHERE & BACKGROUND ENGINE (Zero Hardcoded Void)
// -------------------------------------------------------------
function renderDynamicAtmosphere(t, storyType) {
  switch (storyType) {
    case 'falcon_dive': {
      // High-speed storm sky gradient (charcoal slate to deep navy)
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#06101e');
      grad.addColorStop(0.5, '#0b1c33');
      grad.addColorStop(1, '#02060d');
      ctx.fillStyle = grad;
      ctx.fillRect(-20, -20, W + 40, H + 40);

      // 242 MPH Vertical Wind Dive Streaks
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 42; i++) {
        const sx = ((i * 37) % W);
        const sy = ((t * 900 + i * 95) % (H + 120)) - 60;
        const len = 40 + (i % 5) * 30;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx, sy + len);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
    case 'f1_pitstop': {
      // Race track tarmac dark graphite gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#14161d');
      grad.addColorStop(0.6, '#0d0f14');
      grad.addColorStop(1, '#050608');
      ctx.fillStyle = grad;
      ctx.fillRect(-20, -20, W + 40, H + 40);

      // Angled F1 track grid lines & red/white racing curbs
      ctx.save();
      const curbOffset = (t * 260) % 60;
      for (let y = -60; y < H + 60; y += 60) {
        ctx.fillStyle = ((Math.floor((y + curbOffset) / 60)) % 2 === 0) ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(8, y + curbOffset, 14, 28);
        ctx.fillRect(W - 22, y + curbOffset, 14, 28);
      }
      // Speed tarmac blur streaks
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 22; i++) {
        const x = (i * 29) % W;
        const y = ((t * 700 + i * 85) % H);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 35);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
    case 'brain_ai': {
      // Neural synapse cyber matrix
      const grad = ctx.createRadialGradient(W / 2, H * 0.4, 30, W / 2, H / 2, H * 0.85);
      grad.addColorStop(0, '#06172d');
      grad.addColorStop(0.6, '#020b17');
      grad.addColorStop(1, '#01040a');
      ctx.fillStyle = grad;
      ctx.fillRect(-20, -20, W + 40, H + 40);

      // Glowing neural node network
      ctx.save();
      const nodeCount = 18;
      const nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        const nx = ((i * 83 + Math.sin(t * 0.6 + i) * 35) % (W - 60)) + 30;
        const ny = ((i * 61 + Math.cos(t * 0.5 + i) * 30) % (H * 0.7)) + 60;
        nodes.push({ x: nx, y: ny });
      }
      // Connect nearby nodes with pulsing synapses
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      // Draw pulsing nodes
      for (const n of nodes) {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }
    case 'saturn_rocket': {
      // Apollo 11 Cape Canaveral midnight launch
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#150824');
      grad.addColorStop(0.6, '#0d0417');
      grad.addColorStop(1, '#05010a');
      ctx.fillStyle = grad;
      ctx.fillRect(-20, -20, W + 40, H + 40);

      // Rising rocket exhaust smoke & flame embers
      ctx.save();
      for (let i = 0; i < 35; i++) {
        const px = ((i * 31 + Math.sin(t * 2 + i) * 40) % W);
        const py = H - ((t * 280 + i * 45) % (H + 100));
        const sz = 2 + (i % 4) * 2;
        ctx.fillStyle = (i % 2 === 0) ? '#f59e0b' : '#ef4444';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }
    case 'lightning_strike': {
      // 1-Billion-Volt Electric Storm
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#160d2e');
      grad.addColorStop(0.6, '#0a0517');
      grad.addColorStop(1, '#020108');
      ctx.fillStyle = grad;
      ctx.fillRect(-20, -20, W + 40, H + 40);

      // Rain downpour
      ctx.save();
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.3)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 45; i++) {
        const rx = (i * 29) % W;
        const ry = (t * 750 + i * 65) % (H + 80) - 40;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 8, ry + 35);
        ctx.stroke();
      }
      // Electric storm horizon flash
      if (Math.sin(t * 14) > 0.88) {
        ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();
      break;
    }
    case 'niagara_torrent': {
      // 750,000 Gallons/Sec Rushing Water Torrent
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#04223d');
      grad.addColorStop(0.5, '#021629');
      grad.addColorStop(1, '#010811');
      ctx.fillStyle = grad;
      ctx.fillRect(-20, -20, W + 40, H + 40);

      // Hydraulic foaming water ribbons
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 30; i++) {
        const wx = (i * 35) % W;
        const wy = (t * 550 + i * 85) % (H + 100) - 50;
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.bezierCurveTo(wx + 15, wy + 20, wx - 15, wy + 40, wx, wy + 60);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
    default: {
      // Cosmic Light: Deep space void + warp stars
      const bgGrad = ctx.createRadialGradient(W / 2, H * 0.4, 40, W / 2, H / 2, H * 0.85);
      bgGrad.addColorStop(0, '#0a101f');
      bgGrad.addColorStop(0.5, '#04070d');
      bgGrad.addColorStop(1, '#010204');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(-20, -20, W + 40, H + 40);
      renderWarpStars(t);
      break;
    }
  }
}

function renderFrame(time) {`;

if (!html.includes('function renderDynamicAtmosphere')) {
  html = html.replace('function renderFrame(time) {', dynamicAtmosphereCode);
  console.log('✅ Added renderDynamicAtmosphere function');
}

// 4. In renderFrame, replace hardcoded cosmic background with renderDynamicAtmosphere
const oldRenderFrameBg = `  // Background Cosmic Void
  const bgGrad = ctx.createRadialGradient(W / 2, H * 0.4, 40, W / 2, H / 2, H * 0.85);
  bgGrad.addColorStop(0, '#0a101f');
  bgGrad.addColorStop(0.5, '#04070d');
  bgGrad.addColorStop(1, '#010204');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(-20, -20, W + 40, H + 40);

  // Render 3D Warp Stars
  renderWarpStars(time);`;

const newRenderFrameBg = `  // Dynamic Atmosphere matching the active story (Falcon, F1, Brain, Rocket, Lightning, Niagara, Cosmic)
  const activeStoryType = (window.ACTIVE_STORY && window.ACTIVE_STORY.storyType) ? window.ACTIVE_STORY.storyType : 'cosmic_light';
  renderDynamicAtmosphere(time, activeStoryType);`;

if (html.includes(oldRenderFrameBg)) {
  html = html.replace(oldRenderFrameBg, newRenderFrameBg);
  console.log('✅ Replaced renderFrame cosmic background with dynamic atmosphere');
} else {
  console.log('⚠️ Could not find exact oldRenderFrameBg block');
}

// 5. Update renderKineticSubtitles to read from active word timestamps
const oldSubtitlesStart = `function renderKineticSubtitles(t) {
  // Find current active word
  const activeIdx = WORD_TIMESTAMPS.findIndex(w => t >= w.start && t <= w.end);`;

const newSubtitlesStart = `function renderKineticSubtitles(t) {
  const activeWordList = (window.ACTIVE_WORD_TIMESTAMPS && window.ACTIVE_WORD_TIMESTAMPS.length > 0)
    ? window.ACTIVE_WORD_TIMESTAMPS
    : ((window.WORD_TIMESTAMPS && window.WORD_TIMESTAMPS.length > 0) ? window.WORD_TIMESTAMPS : WORD_TIMESTAMPS);

  // Find current active word
  const activeIdx = activeWordList.findIndex(w => t >= w.start && t <= w.end);`;

if (html.includes(oldSubtitlesStart)) {
  html = html.replace(oldSubtitlesStart, newSubtitlesStart);
  console.log('✅ Updated renderKineticSubtitles to use activeWordList');
} else {
  console.log('⚠️ Could not find exact oldSubtitlesStart');
}

// Replace remaining WORD_TIMESTAMPS inside renderKineticSubtitles
const oldClusterSlice = `    const prev = WORD_TIMESTAMPS.filter(w => w.end <= t).slice(-1)[0];
    if (prev && t - prev.end < 0.35) {
      activeWord = prev;
      targetIdx = WORD_TIMESTAMPS.indexOf(prev);
    }
  }

  if (targetIdx === -1) return; // silence

  // 3-word centered cluster window
  const windowSize = 3;
  const start = Math.max(0, Math.min(WORD_TIMESTAMPS.length - windowSize, targetIdx - 1));
  const cluster = WORD_TIMESTAMPS.slice(start, start + windowSize);`;

const newClusterSlice = `    const prev = activeWordList.filter(w => w.end <= t).slice(-1)[0];
    if (prev && t - prev.end < 0.35) {
      activeWord = prev;
      targetIdx = activeWordList.indexOf(prev);
    }
  }

  if (targetIdx === -1) return; // silence

  // 3-word centered cluster window
  const windowSize = 3;
  const start = Math.max(0, Math.min(activeWordList.length - windowSize, targetIdx - 1));
  const cluster = activeWordList.slice(start, start + windowSize);`;

if (html.includes(oldClusterSlice)) {
  html = html.replace(oldClusterSlice, newClusterSlice);
  console.log('✅ Updated cluster slicing to use activeWordList');
}

// 6. Update triggerAudioForCurrentTime to only play laser audio on cosmic_light, and use neural TTS for all other stories
const oldTriggerAudio = `function triggerAudioForCurrentTime() {
    // 1. If human studio audio is loaded (from ElevenLabs Adam, Mic, or Upload)
    if (uploadedAudioElement) {
      if (Math.abs(uploadedAudioElement.currentTime - currentTime) > 0.35) {
        uploadedAudioElement.currentTime = currentTime;
      }
      if (uploadedAudioElement.paused && isPlaying) {
        uploadedAudioElement.play().catch(e => {});
      }
      return;
    }

    // 2. Only use Browser Speech Synthesis if user explicitly clicked 'ai' (Browser TTS)
    if (currentVoiceMode === 'ai') {
      const cueIdx = SCRIPT_CUES.findIndex(c => currentTime >= c.start && currentTime <= c.end);
      if (cueIdx !== -1 && cueIdx !== lastSpokenCueIdx) {
        lastSpokenCueIdx = cueIdx;
        speakCueNeural(SCRIPT_CUES[cueIdx].text);
      } else if (cueIdx === -1) {
        lastSpokenCueIdx = -1;
      }
    }
  }`;

const newTriggerAudio = `function triggerAudioForCurrentTime() {
    const isCosmic = (window.ACTIVE_STORY && window.ACTIVE_STORY.storyType === 'cosmic_light');

    // 1. If human studio audio is loaded AND active story is cosmic_light
    if (isCosmic && uploadedAudioElement) {
      if (Math.abs(uploadedAudioElement.currentTime - currentTime) > 0.35) {
        uploadedAudioElement.currentTime = currentTime;
      }
      if (uploadedAudioElement.paused && isPlaying) {
        uploadedAudioElement.play().catch(e => {});
      }
      return;
    }

    // If non-cosmic, ensure uploadedAudioElement is paused so it never leaks laser audio!
    if (!isCosmic && uploadedAudioElement && !uploadedAudioElement.paused) {
      uploadedAudioElement.pause();
    }

    // 2. Browser Neural Speech Synthesis for dynamic stories
    const cues = (window.ACTIVE_SCRIPT_CUES && window.ACTIVE_SCRIPT_CUES.length > 0) ? window.ACTIVE_SCRIPT_CUES : (window.SCRIPT_CUES || SCRIPT_CUES);
    const cueIdx = cues.findIndex(c => currentTime >= c.start && currentTime <= c.end);
    if (cueIdx !== -1 && cueIdx !== lastSpokenCueIdx) {
      lastSpokenCueIdx = cueIdx;
      speakCueNeural(cues[cueIdx].text);
    } else if (cueIdx === -1) {
      lastSpokenCueIdx = -1;
    }
  }`;

if (html.includes(oldTriggerAudio)) {
  html = html.replace(oldTriggerAudio, newTriggerAudio);
  console.log('✅ Updated triggerAudioForCurrentTime for dynamic audio voiceover');
} else {
  console.log('⚠️ Could not find exact oldTriggerAudio block');
}

// 7. Update buildReelAssetsForProduct to set active cues, active word timestamps, and right panel cards
const oldBuildAssetsEnd = `  // Dynamic Word Timestamps
  window.WORD_TIMESTAMPS = generateTimestampsForNarration(narrationScript, 58.5);

  // Box 2 Instagram Caption`;

const newBuildAssetsEnd = `  // Dynamic Word Timestamps
  const dynamicWords = generateTimestampsForNarration(narrationScript, 58.5);
  window.ACTIVE_WORD_TIMESTAMPS = dynamicWords;
  window.WORD_TIMESTAMPS = dynamicWords;
  WORD_TIMESTAMPS = dynamicWords;

  // Dynamic Script Cues for Speech Synthesis
  window.ACTIVE_SCRIPT_CUES = [
    { start: 0.0, end: 18.0, text: hookScript },
    { start: 18.5, end: 32.5, text: problemScript },
    { start: 32.5, end: 47.5, text: solutionScript },
    { start: 47.5, end: 53.0, text: proofScript },
    { start: 53.0, end: 58.5, text: ctaScript }
  ];
  window.SCRIPT_CUES = window.ACTIVE_SCRIPT_CUES;
  SCRIPT_CUES = window.ACTIVE_SCRIPT_CUES;

  // Voice mode management: pause laser MP3 when non-cosmic
  if (prod.storyType !== 'cosmic_light') {
    if (uploadedAudioElement) {
      try { uploadedAudioElement.pause(); } catch(e) {}
    }
    currentVoiceMode = 'ai';
  } else {
    if (!uploadedAudioElement && typeof EMBEDDED_STUDIO_AUDIO !== 'undefined') {
      uploadedAudioElement = new Audio(EMBEDDED_STUDIO_AUDIO);
      bindAudioElementToMasterGraph(uploadedAudioElement);
    }
  }

  // Update Right-Panel Scene 1 card HUD
  const s1Title = document.getElementById('scene1TitleLabel');
  if (s1Title) s1Title.innerHTML = \`\${prod.emoji} Extended Hook: \${prod.storyTitle}\`;
  const s1Desc = document.getElementById('scene1DescLabel');
  if (s1Desc) s1Desc.innerHTML = \`\${prod.contrastLine1} · vs contractor callback delay\`;

  // Box 2 Instagram Caption`;

if (html.includes(oldBuildAssetsEnd)) {
  html = html.replace(oldBuildAssetsEnd, newBuildAssetsEnd);
  console.log('✅ Updated buildReelAssetsForProduct with dynamic cues, timestamps, and panel HUD');
} else {
  console.log('⚠️ Could not find exact oldBuildAssetsEnd block');
}

// Convert back to CRLF if needed
if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(targetFile, html, 'utf8');
console.log('🎉 Successfully saved updated reel-creator.html!');
