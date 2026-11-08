const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html');
let html = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n for clean matching
const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

console.log('Normalized line endings. Checking targets...');

// 1. ADD QUICK STORYLINE SELECTOR CHIPS ABOVE STAGE TOP TOOLBAR
if (!html.includes('id="chipStory0"')) {
  const target = `<div class="stage-top-toolbar" style="display:flex;justify-content:space-between;align-items:center;width:100%;max-width:360px;margin-bottom:12px;padding:0 2px">`;
  const chipBar = `<!-- 🎬 Direct Storyline Selector Toolbar (7 Unique Non-Laser Stories) -->
    <div class="story-quick-tabs" style="display:flex;gap:5px;width:100%;max-width:360px;margin-bottom:8px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch;scrollbar-width:thin">
      <button class="btn-story-chip active" id="chipStory0" onclick="switchStoryline(0)" title="Ava Voice AI · Speed of Light & Saturn" style="background:rgba(245,158,11,0.2);color:#fbbf24;border:1px solid #f59e0b;border-radius:20px;padding:4px 9px;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.2s">⚡ 1. Light & Saturn</button>
      <button class="btn-story-chip" id="chipStory1" onclick="switchStoryline(1)" title="90s SMS · Falcon 242 MPH Dive" style="background:rgba(30,41,59,0.8);color:#94a3b8;border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:4px 9px;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.2s">🦅 2. Falcon 242 MPH</button>
      <button class="btn-story-chip" id="chipStory2" onclick="switchStoryline(2)" title="Mobile Website · F1 1.8s Pitstop" style="background:rgba(30,41,59,0.8);color:#94a3b8;border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:4px 9px;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.2s">🏎️ 3. F1 Pitstop</button>
      <button class="btn-story-chip" id="chipStory3" onclick="switchStoryline(3)" title="AEO & AI Search · 86B Brain Neurons" style="background:rgba(30,41,59,0.8);color:#94a3b8;border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:4px 9px;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.2s">🧠 4. Brain AI</button>
      <button class="btn-story-chip" id="chipStory4" onclick="switchStoryline(4)" title="Revenue Engine · Apollo 11 Moon Lander" style="background:rgba(30,41,59,0.8);color:#94a3b8;border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:4px 9px;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.2s">🚀 5. Apollo 11</button>
      <button class="btn-story-chip" id="chipStory5" onclick="switchStoryline(5)" title="Ava Voice AI · 1B Volts Lightning" style="background:rgba(30,41,59,0.8);color:#94a3b8;border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:4px 9px;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.2s">⚡ 6. 1B Volts</button>
      <button class="btn-story-chip" id="chipStory6" onclick="switchStoryline(6)" title="90s SMS · Niagara 750k Gallons" style="background:rgba(30,41,59,0.8);color:#94a3b8;border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:4px 9px;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.2s">🌊 7. Niagara Torrent</button>
    </div>\n    `;
  if (html.includes(target)) {
    html = html.replace(target, chipBar + target);
    console.log('✓ Injected 7-storyline chip bar');
  } else {
    console.warn('Could not find target for chip bar');
  }
}

// 2. ADD MASTER VOICE TOGGLE CHECKBOX IN AUDIO CONTROLS
if (!html.includes('id="chkEnableVoice"')) {
  const target = `<input type="checkbox" id="chkEnableMusic" checked>`;
  const voiceToggle = `<label style="display:flex;align-items:center;gap:6px;cursor:pointer" title="Enable browser neural voice (Muted by default to prevent unexpected sounds)">
          <input type="checkbox" id="chkEnableVoice">
          <span style="color:#38bdf8;font-weight:700">🗣️ AI Voice (Muted Default)</span>
        </label>\n        `;
  if (html.includes(target)) {
    html = html.replace(target, voiceToggle + target);
    console.log('✓ Added chkEnableVoice checkbox');
  }
}

// 3. SECURE SFX IN renderFrame
if (html.includes("if (time >= 0.2 && !playedSfxMap['laser'])")) {
  html = html.replace(
    /if \(time >= 0\.2 && !playedSfxMap\['laser'\]\) \{ playSfx\('laser'\); playedSfxMap\['laser'\] = true; \}\s*if \(time >= 18\.0 && !playedSfxMap\['subdrop'\]\) \{ playSfx\('subdrop'\); playedSfxMap\['subdrop'\] = true; \}\s*if \(time >= 22\.5 && !playedSfxMap\['phone'\]\) \{ playSfx\('phone_ring'\); playedSfxMap\['phone'\] = true; \}\s*if \(time >= 44\.0 && !playedSfxMap\['ios_ping'\]\) \{ playSfx\('ios_ping'\); playedSfxMap\['ios_ping'] = true; \}/,
    `// SFX Triggers: ONLY when actively playing AND tab is visible!
  if (isPlaying && !document.hidden) {
    if (time >= 0.2 && !playedSfxMap['laser']) { playSfx('laser'); playedSfxMap['laser'] = true; }
    if (time >= 18.0 && !playedSfxMap['subdrop']) { playSfx('subdrop'); playedSfxMap['subdrop'] = true; }
    if (time >= 22.5 && !playedSfxMap['phone']) { playSfx('phone_ring'); playedSfxMap['phone'] = true; }
    if (time >= 44.0 && !playedSfxMap['ios_ping']) { playSfx('ios_ping'); playedSfxMap['ios_ping'] = true; }
  }`
  );
  console.log('✓ Secured SFX triggers in renderFrame');
}

// 4. BULLETPROOF NaN PROTECTION & HERO POSTER IN renderFrame
if (!html.includes('renderStudioHeroPosterCard(activeStoryType)')) {
  const rfTarget = `function renderFrame(time) {
  window.renderFrame = renderFrame;
  ctx.save();
  ctx.clearRect(0, 0, W, H);

  // Apply Camera Shake
  const shake = getCameraShake(time);
  ctx.translate(shake.x, shake.y);

  // Dynamic Atmosphere matching the active story (Falcon, F1, Brain, Rocket, Lightning, Niagara, Cosmic)
  const activeStoryType = (window.ACTIVE_STORY && window.ACTIVE_STORY.storyType) ? window.ACTIVE_STORY.storyType : 'cosmic_light';
  renderDynamicAtmosphere(time, activeStoryType);`;

  const rfReplacement = `function renderFrame(time) {
  window.renderFrame = renderFrame;

  // Strict NaN & Finite Number Guard: Prevents canvas from rendering empty stars!
  if (!Number.isFinite(time) || isNaN(time) || time < 0) {
    time = 0;
  }
  time = Math.min(time, TOTAL_DURATION || 63);

  ctx.save();
  ctx.clearRect(0, 0, W, H);

  // Apply Camera Shake
  const shake = getCameraShake(time);
  ctx.translate(shake.x, shake.y);

  // Dynamic Atmosphere matching the active story (Falcon, F1, Brain, Rocket, Lightning, Niagara, Cosmic)
  const activeStoryType = (window.ACTIVE_STORY && window.ACTIVE_STORY.storyType) ? window.ACTIVE_STORY.storyType : 'cosmic_light';
  renderDynamicAtmosphere(time, activeStoryType);

  // STUDIO HERO POSTER CARD ON PAUSE / INITIAL LOAD (t === 0): Ensures canvas NEVER looks blank!
  if (!isPlaying && time === 0) {
    renderStudioHeroPosterCard(activeStoryType);
    ctx.restore();
    return;
  }`;

  if (html.includes(rfTarget)) {
    html = html.replace(rfTarget, rfReplacement);
    console.log('✓ Added NaN protection and renderStudioHeroPosterCard call to renderFrame');
  } else {
    console.warn('Could not find rfTarget');
  }
}

// 5. FIX loop(timestamp) NaN HANDLING
if (html.includes("if (uploadedAudioElement && !uploadedAudioElement.paused) {")) {
  const oldLoopBlock = `    if (uploadedAudioElement && !uploadedAudioElement.paused) {
      // MASTER AUDIO CLOCK: Slaved directly to audio hardware crystal clock!
      const targetT = uploadedAudioElement.currentTime + audioSyncOffset;
      currentTime = Math.max(0, targetT);

      if (currentTime >= TOTAL_DURATION || uploadedAudioElement.ended) {
        currentTime = 0;
        uploadedAudioElement.currentTime = 0;
        resetSfxFlags();
      }
    } else {
      // Fallback clock when no audio is playing
      currentTime += delta;
      if (currentTime >= TOTAL_DURATION) {
        currentTime = 0;
        resetSfxFlags();
      }
    }`;

  const newLoopBlock = `    if (uploadedAudioElement && !uploadedAudioElement.paused && Number.isFinite(uploadedAudioElement.currentTime)) {
      // MASTER AUDIO CLOCK: Slaved directly to audio hardware crystal clock!
      const targetT = uploadedAudioElement.currentTime + (Number.isFinite(audioSyncOffset) ? audioSyncOffset : 0);
      currentTime = (Number.isFinite(targetT) && targetT >= 0) ? targetT : 0;

      if (currentTime >= TOTAL_DURATION || uploadedAudioElement.ended) {
        currentTime = 0;
        try { uploadedAudioElement.currentTime = 0; } catch(_) {}
        resetSfxFlags();
      }
    } else {
      // Fallback clock: Guarantees animation always plays smoothly without audio dependency!
      const safeDelta = (Number.isFinite(delta) && delta > 0 && delta < 0.2) ? delta : 0.016;
      currentTime = (Number.isFinite(currentTime) && currentTime >= 0) ? (currentTime + safeDelta) : 0;
      if (currentTime >= TOTAL_DURATION) {
        currentTime = 0;
        resetSfxFlags();
      }
    }`;

  if (html.includes(oldLoopBlock)) {
    html = html.replace(oldLoopBlock, newLoopBlock);
    console.log('✓ Secured loop clock');
  } else {
    console.warn('Could not find oldLoopBlock');
  }
}

// 6. FIX triggerAudioForCurrentTime
if (html.includes("function triggerAudioForCurrentTime() {\n    const isCosmic = (window.ACTIVE_STORY && window.ACTIVE_STORY.storyType === 'cosmic_light');")) {
  html = html.replace(
    "function triggerAudioForCurrentTime() {\n    const isCosmic = (window.ACTIVE_STORY && window.ACTIVE_STORY.storyType === 'cosmic_light');",
    `function triggerAudioForCurrentTime() {
    // STRICT SILENCE GUARD: Never trigger audio if paused or tab is in background!
    if (!isPlaying || document.hidden) return;

    const chkVoice = document.getElementById('chkEnableVoice');
    const isVoiceAllowed = (chkVoice && chkVoice.checked);

    const isCosmic = (window.ACTIVE_STORY && window.ACTIVE_STORY.storyType === 'cosmic_light');`
  );
  console.log('✓ Added silence guards to triggerAudioForCurrentTime');
}

// 7. ENSURE speakCueNeural CHECKS isPlaying & chkEnableVoice
if (html.includes("function speakCueNeural(text) {\n    if (!('speechSynthesis' in window)) return;")) {
  html = html.replace(
    "function speakCueNeural(text) {\n    if (!('speechSynthesis' in window)) return;",
    `function speakCueNeural(text) {
    if (!isPlaying || document.hidden) return;
    const chkVoice = document.getElementById('chkEnableVoice');
    if (chkVoice && !chkVoice.checked) return;
    if (!('speechSynthesis' in window)) return;`
  );
  console.log('✓ Added guards to speakCueNeural');
}

// 8. UPDATE selectDailySlot MULTI-PRODUCT ROTATION
if (html.includes("window.selectDailySlot = function(slot) {")) {
  const oldSlotIndex = html.indexOf("window.selectDailySlot = function(slot) {");
  const endSlotIndex = html.indexOf("// Initialize Box 2 and Mind State on load", oldSlotIndex);
  if (oldSlotIndex !== -1 && endSlotIndex !== -1) {
    const newSelectDailySlotCode = `window.selectDailySlot = function(slot) {
    const btnMorning = document.getElementById('btnMorningSlot');
    const btnEvening = document.getElementById('btnEveningSlot');
    const playSub = document.getElementById('reelPlayStorySub');

    if (slot === 'morning') {
      if (btnMorning) {
        btnMorning.className = 'btn-slot-drop active';
        btnMorning.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.12))';
        btnMorning.style.borderColor = '#f59e0b';
        btnMorning.style.color = '#fbbf24';
        btnMorning.style.boxShadow = '0 0 16px rgba(245, 158, 11, 0.25)';
      }
      if (btnEvening) {
        btnEvening.className = 'btn-slot-drop';
        btnEvening.style.background = 'rgba(30, 41, 59, 0.8)';
        btnEvening.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        btnEvening.style.color = '#94a3b8';
        btnEvening.style.boxShadow = 'none';
      }

      // Drop #1: Morning (9:00 AM) - Ava 24/7 Voice AI Phone Receptionist
      // Hook & Story: Speed of Light & The Ladder Dilemma ($9,200 Save) / 1B Volts
      const morningIndices = [0, 5]; // Ava stories
      window._morningSubIndex = (typeof window._morningSubIndex === 'undefined') ? 0 : ((window._morningSubIndex + 1) % morningIndices.length);
      const targetIndex = morningIndices[window._morningSubIndex];
      window.switchStoryline(targetIndex);

      if (playSub) {
        playSub.textContent = 'Speed of Light & The Ladder Dilemma · Ava Voice AI ($9,200 Save)';
      }

      // Scroll to video stage
      const stage = document.querySelector('.video-stage');
      if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } else {
      if (btnEvening) {
        btnEvening.className = 'btn-slot-drop active';
        btnEvening.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(56, 189, 248, 0.12))';
        btnEvening.style.borderColor = '#38bdf8';
        btnEvening.style.color = '#38bdf8';
        btnEvening.style.boxShadow = '0 0 16px rgba(56, 189, 248, 0.25)';
      }
      if (btnMorning) {
        btnMorning.className = 'btn-slot-drop';
        btnMorning.style.background = 'rgba(30, 41, 59, 0.8)';
        btnMorning.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        btnMorning.style.color = '#94a3b8';
        btnMorning.style.boxShadow = 'none';
      }

      // Drop #2: Evening (5:00 PM) - 90-Second SMS Speed-to-Lead & Product Rotation
      // Hook & Story: Peregrine Falcon 242 MPH Dive & Cash Thief ($14,000 Save) / F1 Pitstop / Niagara
      const eveningIndices = [1, 2, 3, 4, 6]; // 90s SMS, Mobile Web, Brain AI, Apollo, Niagara
      window._eveningSubIndex = (typeof window._eveningSubIndex === 'undefined') ? 0 : ((window._eveningSubIndex + 1) % eveningIndices.length);
      const targetIndex = eveningIndices[window._eveningSubIndex];
      window.switchStoryline(targetIndex);

      if (playSub) {
        playSub.textContent = 'Peregrine Falcon 242 MPH Dive & Cash Thief · 90s SMS ($14k Save)';
      }

      // Scroll to video stage
      const stage = document.querySelector('.video-stage');
      if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };\n\n`;

    html = html.slice(0, oldSlotIndex) + newSelectDailySlotCode + html.slice(endSlotIndex);
    console.log('✓ Successfully replaced selectDailySlot block');
  }
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Updated reel-creator.html successfully! Final size:', html.length, 'bytes');
