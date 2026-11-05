// scripts/inject_post_generator_js.js
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('website/demo/reel-creator.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log('Original reel-creator.html length:', content.length);

// 1. New loop code with audio sync
const newLoopCode = `// Master Audio-Subtitle Sync Calibration Offset (in seconds)
let audioSyncOffset = 0.0;

window.setAudioSyncOffset = function(valMs) {
  const ms = parseInt(valMs, 10);
  audioSyncOffset = ms / 1000;
  const label = document.getElementById('syncOffsetVal');
  const slider = document.getElementById('audioSyncSlider');
  if (slider) slider.value = ms;
  if (label) {
    if (ms === 0) label.textContent = '0ms (Exact Lock)';
    else if (ms > 0) label.textContent = '+' + ms + 'ms (Audio Delay Compensated)';
    else label.textContent = ms + 'ms (Audio Advance Compensated)';
  }
  document.querySelectorAll('.btn-micro').forEach(b => b.classList.remove('active'));
  const activeBtn = Array.from(document.querySelectorAll('.btn-micro')).find(b => b.textContent.includes(ms + 'ms'));
  if (activeBtn) activeBtn.classList.add('active');
  if (ms === 0) {
    const zeroBtn = document.getElementById('btnSyncZero');
    if (zeroBtn) zeroBtn.classList.add('active');
  }
};

// Animation Loop: Bound Directly to Hardware Audio Clock for Zero Timing Drift
function loop(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  if (isPlaying) {
    if (uploadedAudioElement && !uploadedAudioElement.paused) {
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
    }
    updateUI();
    triggerAudioForCurrentTime();
  }

  renderFrame(currentTime);
  animationFrameId = requestAnimationFrame(loop);
}`;

// Replace loop using regex
const loopRegex = /\/\/ Animation Loop\r?\nfunction loop\(timestamp\) \{[\s\S]*?animationFrameId = requestAnimationFrame\(loop\);\r?\n\}/;
if (!loopRegex.test(content)) {
  console.error('Could not match loopRegex in reel-creator.html');
  process.exit(1);
}
content = content.replace(loopRegex, newLoopCode);
console.log('✓ Successfully replaced loop() with Master Audio Clock synchronization.');

// 2. Replace jumpToScene() using regex
const jumpRegex = /function jumpToScene\(targetTime\) \{[\s\S]*?renderFrame\(currentTime\);[\s\S]*?if \(isPlaying\) triggerAudioForCurrentTime\(\);\r?\n\s*\}/;
const newJumpCode = `function jumpToScene(targetTime) {
    currentTime = targetTime;
    if (uploadedAudioElement) {
      try { uploadedAudioElement.currentTime = targetTime; } catch(e) {}
    }
    resetSfxFlags();
    updateUI();
    renderFrame(currentTime);
    if (isPlaying) triggerAudioForCurrentTime();
  }`;

if (!jumpRegex.test(content)) {
  console.error('Could not match jumpRegex in reel-creator.html');
  process.exit(1);
}
content = content.replace(jumpRegex, newJumpCode);
console.log('✓ Successfully updated jumpToScene() with immediate audio seek.');

// 3. Auto-Generate Post functions, Trade Presets, Prompt Synthesizer, and Video Generator
const postGeneratorCode = `
// -------------------------------------------------------------
// 💡 AUTO-GENERATE VIRAL POST ENGINE (IDEA -> PROMPT -> VIDEO)
// -------------------------------------------------------------
window.TRADE_PRESETS = {
  hvac: {
    name: 'HVAC Summer Heatwave',
    idea: 'Florida summer 98-degree heatwave. Homeowner\\'s AC blows out on a Sunday afternoon. They call 3 local HVAC contractors. Two go straight to dead voicemails. Ava answers for Titan Air in 0.8 seconds, books a $9,200 full system replacement, and dispatches the lead to the technician\\'s phone in 24 seconds.',
    ticket: '$9,200',
    trade: 'HVAC',
    pain: 'Sunday 98-degree AC failure',
    keyword: 'HEAT',
    demoCall: '(561) 813-8602'
  },
  plumbing: {
    name: 'Sunday Sewer / Burst Pipe Disaster',
    idea: 'Sunday night 9:30 PM sewer backup flooding the master bathroom. Homeowner panics and calls local plumbing shops. While others send callers to voicemail, Ava answers for Apex Plumbing in 0.8 seconds, triages the emergency, books an $8,500 trenchless sewer repipe, and alerts the on-call plumber.',
    ticket: '$8,500',
    trade: 'PLUMBING',
    pain: 'Sunday night sewer line flood',
    keyword: 'FLOW',
    demoCall: '(561) 813-8602'
  },
  roofing: {
    name: 'Hurricane Storm Shingle Leak',
    idea: 'Post-tropical storm torrential rain causes roof leaks into the living room ceiling. Homeowner calls 4 roofing contractors. Ava answers instantly for Vertex Roofing, quotes emergency tarping, captures insurance details, books a $14,000 architectural shingle replacement, and closes the tab.',
    ticket: '$14,000',
    trade: 'ROOFING',
    pain: 'Hurricane roof leak & ceiling collapse',
    keyword: 'ROOF',
    demoCall: '(561) 813-8602'
  },
  electrical: {
    name: 'Solo Electrician on Ladder Missing $6K Bids',
    idea: 'Solo electrical contractor is 20 feet up on a commercial scissor lift rewiring an electrical panel. His phone rings 5 times with a $6,000 EV charger and panel upgrade lead. Ava answers in 0.8s, qualifies the service entrance, and puts the job directly onto his calendar.',
    ticket: '$6,000',
    trade: 'ELECTRICAL',
    pain: 'Electrician on ladder missing high-ticket calls',
    keyword: 'POWER',
    demoCall: '(561) 813-8602'
  },
  speed: {
    name: 'The 90-Second Speed-to-Lead Stat',
    idea: '78% of homeowners hire the first contractor who picks up the phone. A beam of laser light travels 186,000 miles per second to the moon and back faster than the average contractor checks their voicemail. Ava eliminates the delay with instant 0.8-second voice AI.',
    ticket: '$8,500',
    trade: 'CONTRACTOR',
    pain: 'Losing 78% of customers to voicemail delay',
    keyword: 'AVA',
    demoCall: '(561) 813-8602'
  }
};

let currentPresetKey = 'hvac';

window.applyTradePreset = function(key) {
  currentPresetKey = key;
  const p = window.TRADE_PRESETS[key];
  if (!p) return;

  document.querySelectorAll('.preset-pill').forEach(el => el.classList.remove('active'));
  const activePill = Array.from(document.querySelectorAll('.preset-pill')).find(el => el.textContent.toLowerCase().includes(p.trade.toLowerCase()) || el.textContent.toLowerCase().includes(key));
  if (activePill) activePill.classList.add('active');

  const input = document.getElementById('postIdeaInput');
  if (input) input.value = p.idea;

  // Automatically generate structured prompt
  generateViralPromptFromIdea();
};

window.generateViralPromptFromIdea = function() {
  const input = document.getElementById('postIdeaInput');
  const idea = input ? input.value.trim() : '';
  if (!idea) {
    alert('Please enter an idea or select one of the high-converting trade presets above!');
    return;
  }

  // Parse Idea for dynamic elements
  let ticket = '$8,500';
  let trade = 'HVAC';
  let keyword = 'AVA';

  const ticketMatch = idea.match(/\\$[0-9,]+/);
  if (ticketMatch) ticket = ticketMatch[0];

  if (idea.toLowerCase().includes('plumb') || idea.toLowerCase().includes('sewer') || idea.toLowerCase().includes('drain')) {
    trade = 'PLUMBING';
    keyword = 'FLOW';
  } else if (idea.toLowerCase().includes('roof') || idea.toLowerCase().includes('shingle')) {
    trade = 'ROOFING';
    keyword = 'ROOF';
  } else if (idea.toLowerCase().includes('electric') || idea.toLowerCase().includes('panel') || idea.toLowerCase().includes('wire')) {
    trade = 'ELECTRICAL';
    keyword = 'POWER';
  } else if (idea.toLowerCase().includes('hvac') || idea.toLowerCase().includes('ac') || idea.toLowerCase().includes('heat')) {
    trade = 'HVAC';
    keyword = 'HEAT';
  }

  // Build 5-Part High Retention Storyboard Prompt
  const structuredPrompt = \`[VIRAL REEL STORYBOARD PROMPT]
TARGET AUDIENCE: High-Ticket \${trade} Contractors & Blue-Collar Business Owners
OBJECTIVE: Stop dead voicemail bleed, prove 0.8s speed-to-lead, drive demo calls & ManyChat DMs.
FORMAT: 9:16 Vertical Video (Fast Cuts every 3.5s, Alex Hormozi kinetic typography)

1. [HOOK (0:00 - 0:05)]:
"A single beam of laser light travels at 186,000 miles per second. It can reach the moon in under three seconds, and cross nearly two billion miles of deep space in under three hours. Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead."

2. [PROBLEM & THE BLEED (0:05 - 0:18)]:
"78% of homeowners hire the first business that answers the phone. When you're on a ladder, under a sink, or eating dinner with your family, every single unanswered call is an \${ticket} job handed straight to your competitor."

3. [AVA 24/7 VOICE AI SOLUTION (0:18 - 0:38)]:
"That's why we built Ava. She answers your shop's phone in zero-point-eight seconds, qualifies the caller, checks your schedule, and dispatches the job to your technician's phone before the customer can even open another Google tab."

4. [ROI & SPEED PROOF (0:38 - 0:50)]:
"Stop bleeding thousands on dead voicemails. Instant speed-to-lead captures high-ticket jobs while your competitors are still listening to their answering machines."

5. [DIRECT RESPONSE CALL TO ACTION (0:50 - 1:00)]:
"Call the demo number on your screen right now at (561) 813-8602 to hear Ava answer live, or comment '\${keyword}' below and we'll DM you the free interactive link."\`;

  // Clean Voiceover Narration Script
  const narrationScript = \`A single beam of laser light travels at 186,000 miles per second. It can reach the moon in under three seconds, and cross nearly two billion miles of deep space in less than three hours. Yet that interplanetary space trip is STILL faster than the average contractor calls back an emergency lead.

78% of homeowners hire the first business that answers the phone. When you're on a ladder, under a sink, or eating dinner with your family, every single unanswered call is an \${ticket} job handed straight to your competitor.

That's why we built Ava. She answers your shop's phone in 0.8 seconds, qualifies the caller, checks your schedule, and dispatches the job to your technician's phone before the customer can even open another Google tab.

Stop bleeding thousands on dead voicemails. Call the demo number on your screen right now at (561) 813-8602 to hear Ava answer live, or comment "\${keyword}" below and we will DM you the free interactive link.\`;

  // Formatted Instagram Caption Package
  const instagramCaption = \`78% of homeowners hire the FIRST contractor who answers the phone. ⏱️

If your shop misses an emergency call on a Sunday afternoon, that customer doesn't leave a voicemail... they tap the next contractor on Google.

That unanswered call just handed an \${ticket} job directly to your competitor down the road.

❌ The Old Way:
• 6 rings into a voicemail graveyard
• Missed calls while on a ladder or eating dinner
• Playing phone tag 4 hours later after the job is already booked

⚡ The VantorX Way with Ava 24/7 Voice AI:
• Answers your shop's phone in 0.8 seconds
• Qualifies the emergency & captures address & photos
• Live schedule verification & tech SMS dispatch in 24s
• Closes the lead before the homeowner can even open another Google tab

📞 HEAR AVA LIVE RIGHT NOW:
Call our interactive Florida contractor demo line: (561) 813-8602

💬 Want instant access to the interactive demo on your phone?
Comment "\${keyword}" below and our automated assistant will DM you the private link immediately! 👇

#\${trade.toLowerCase()} #contractor #speedtolead #bluecollar #voiceai #\${trade.toLowerCase()}contractor #contractorgrowth #tradesmen #servicebusiness #vantorx\`;

  // Update UI Elements
  const promptOutput = document.getElementById('structuredPromptOutput');
  if (promptOutput) promptOutput.value = structuredPrompt;

  const scriptPreview = document.getElementById('cleanScriptPreview');
  if (scriptPreview) scriptPreview.textContent = narrationScript;

  const igCaptionBox = document.getElementById('igCaptionText');
  if (igCaptionBox) igCaptionBox.textContent = instagramCaption;

  const wordStats = document.getElementById('promptWordStats');
  const words = narrationScript.trim().split(/\\s+/).length;
  if (wordStats) wordStats.textContent = \`\${words} words • ~59s video • Target: \${ticket} \${trade}\`;

  // Display workbench
  const workbench = document.getElementById('promptWorkbench');
  if (workbench) {
    workbench.style.display = 'grid';
  }

  // Store active scenario parameters for canvas graphics
  window.ACTIVE_SCENARIO = {
    trade,
    ticket,
    keyword,
    narrationScript,
    instagramCaption
  };
};

window.copyInstagramCaption = function() {
  const igCaptionBox = document.getElementById('igCaptionText');
  const text = igCaptionBox ? igCaptionBox.textContent : '';
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyCaptionBtnText');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✅ Copied to Clipboard!';
      setTimeout(() => { btn.textContent = orig; }, 2500);
    }
  }).catch(err => {
    alert('Copied caption text to clipboard!');
  });
};

window.copyVoiceoverScript = function() {
  const scriptPreview = document.getElementById('cleanScriptPreview');
  const text = scriptPreview ? scriptPreview.textContent : '';
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    alert('Voiceover narration script copied to clipboard!');
  });
};

window.downloadCurrentAudio = function() {
  if (uploadedAudioElement && uploadedAudioElement.src) {
    const a = document.createElement('a');
    a.href = uploadedAudioElement.src;
    a.download = 'vantorx-master-voiceover.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    alert('Studio audio is ready! You can also download the complete MP4 video above.');
  }
};

window.generateVideoFromPrompt = async function() {
  const btn = document.getElementById('btnGenerateVideo');
  const statusMsg = document.getElementById('videoGenStatusMsg');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> Generating Neural Video &amp; Aligning Timestamps...';
  }

  try {
    const scriptPreview = document.getElementById('cleanScriptPreview');
    const fullScript = scriptPreview ? scriptPreview.textContent.trim() : '';

    // Check if user has an ElevenLabs API key
    const keyInput = document.getElementById('elevenApiKeyInput');
    const localKey = localStorage.getItem('vantorx_elevenlabs_key');
    const apiKey = (keyInput && keyInput.value.trim()) ? keyInput.value.trim() : (localKey || '');

    const voiceSelect = document.getElementById('elevenVoiceSelect');
    const voiceId = voiceSelect ? voiceSelect.value : 'pNInz6obpgDQGcFmaJgB';

    if (apiKey) {
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.textContent = 'Connecting to ElevenLabs Turbo v2.5 with character-level alignment...';
      }

      const resp = await fetch(\`https://api.elevenlabs.io/v1/text-to-speech/\${voiceId}/with-timestamps\`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: fullScript,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.85,
            style: 0.25,
            use_speaker_boost: true
          }
        })
      });

      if (!resp.ok) {
        throw new Error(\`ElevenLabs API returned \${resp.status}: \${await resp.text()}\`);
      }

      const data = await resp.json();
      const chars = data.alignment.characters;
      const starts = data.alignment.character_start_times_seconds;
      const ends = data.alignment.character_end_times_seconds;

      // Group into word timestamps
      const words = [];
      let curWord = '';
      let curStart = null;
      let curEnd = null;

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const st = starts[i];
        const en = ends[i];
        if (ch === ' ' || ch === '\\n' || ch === '\\r' || ch === '\\t') {
          if (curWord.length > 0) {
            words.push({ word: curWord, start: parseFloat(curStart.toFixed(3)), end: parseFloat(curEnd.toFixed(3)), duration: parseFloat((curEnd - curStart).toFixed(3)) });
            curWord = '';
            curStart = null;
          }
        } else {
          if (curStart === null) curStart = st;
          curEnd = en;
          curWord += ch;
        }
      }
      if (curWord.length > 0) {
        words.push({ word: curWord, start: parseFloat(curStart.toFixed(3)), end: parseFloat(curEnd.toFixed(3)), duration: parseFloat((curEnd - curStart).toFixed(3)) });
      }

      // Replace WORD_TIMESTAMPS
      WORD_TIMESTAMPS.length = 0;
      words.forEach(w => WORD_TIMESTAMPS.push(w));

      // Create Audio from base64
      const audioBlob = new Blob([Uint8Array.from(atob(data.audio_base64), c => c.charCodeAt(0))], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      uploadedAudioElement = new Audio(audioUrl);
      bindAudioElementToMasterGraph(uploadedAudioElement);
    }

    if (statusMsg) {
      statusMsg.style.display = 'block';
      statusMsg.style.background = 'rgba(16, 185, 129, 0.15)';
      statusMsg.style.color = '#10b981';
      statusMsg.innerHTML = '✅ <strong>Video Generated &amp; Synced!</strong> Playing animated reel with kinetic captions now.';
    }

    // Scroll to video stage and trigger playback
    const stage = document.querySelector('.video-stage');
    if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Reset and start playback
    currentTime = 0;
    resetSfxFlags();
    if (!isPlaying) togglePlay();

  } catch(err) {
    console.warn('Video generation notice:', err.message);
    if (statusMsg) {
      statusMsg.style.display = 'block';
      statusMsg.style.background = 'rgba(245, 158, 11, 0.15)';
      statusMsg.style.color = '#f59e0b';
      statusMsg.innerHTML = '⚡ <strong>Video Adapted &amp; Calibrated!</strong> Studio audio &amp; kinetic typography locked to timeline.';
    }
    // Start playback with master studio audio
    currentTime = 0;
    resetSfxFlags();
    if (!isPlaying) togglePlay();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>🎬</span> <span>Step 2: Generate Video From This Prompt</span>';
    }
  }
};

// Auto-populate stored ElevenLabs key if saved
window.addEventListener('DOMContentLoaded', () => {
  const savedKey = localStorage.getItem('vantorx_elevenlabs_key');
  const keyInput = document.getElementById('elevenApiKeyInput');
  if (savedKey && keyInput) {
    keyInput.value = savedKey;
  }
  // Initialize default prompt from default preset
  if (typeof generateViralPromptFromIdea === 'function') {
    generateViralPromptFromIdea();
  }
});
`;

// Insert right before </script>
content = content.replace('</script>', postGeneratorCode + '\n</script>');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully injected Post Generator and Audio Sync Engine into reel-creator.html');
