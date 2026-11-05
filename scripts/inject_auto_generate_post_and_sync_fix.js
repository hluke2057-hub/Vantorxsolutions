// scripts/inject_auto_generate_post_and_sync_fix.js
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('website/demo/reel-creator.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log('Original reel-creator.html length:', content.length);

// 1. CSS STYLES FOR AUTO-GENERATE POST STUDIO & TIMING CALIBRATION
const newStyles = `
  /* ----------------------------------------------------------- */
  /* 💡 AUTO-GENERATE VIRAL POST STUDIO (IDEA -> PROMPT -> VIDEO) */
  /* ----------------------------------------------------------- */
  .auto-post-card {
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(7, 10, 15, 0.98));
    border: 1.5px solid rgba(245, 158, 11, 0.45);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7), 0 0 24px rgba(245, 158, 11, 0.12);
    border-radius: 16px;
    padding: 24px;
    margin: 18px auto 26px auto;
    max-width: 1160px;
    position: relative;
    overflow: hidden;
  }
  .auto-post-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #f59e0b, #10b981, #38bdf8, #f59e0b);
    background-size: 300% 100%;
    animation: gradientFlow 6s linear infinite;
  }
  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    100% { background-position: 300% 50%; }
  }

  .auto-post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .auto-post-title {
    font-size: 19px;
    font-weight: 900;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: -0.02em;
  }
  .auto-post-title span.glow {
    color: #f59e0b;
    text-shadow: 0 0 18px rgba(245, 158, 11, 0.5);
  }
  .auto-post-tag {
    font-size: 11px;
    font-weight: 800;
    background: rgba(245, 158, 11, 0.18);
    border: 1px solid rgba(245, 158, 11, 0.4);
    color: #f59e0b;
    padding: 4px 10px;
    border-radius: 999px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .idea-input-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .idea-presets-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
  .preset-pill {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #cbd5e1;
    font-size: 11.5px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .preset-pill:hover {
    background: rgba(245, 158, 11, 0.18);
    border-color: rgba(245, 158, 11, 0.5);
    color: #ffffff;
    transform: translateY(-1px);
  }
  .preset-pill.active {
    background: rgba(245, 158, 11, 0.25);
    border-color: #f59e0b;
    color: #f59e0b;
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.25);
  }

  .idea-textarea {
    width: 100%;
    background: #090e17;
    border: 1.5px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    color: #ffffff;
    padding: 12px 14px;
    font-size: 13.5px;
    line-height: 1.5;
    font-family: inherit;
    resize: vertical;
    min-height: 72px;
    transition: border-color 0.2s ease;
  }
  .idea-textarea:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 16px rgba(245, 158, 11, 0.25);
  }

  .btn-generate-prompt {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #0b0f19;
    border: none;
    border-radius: 9px;
    padding: 11px 22px;
    font-size: 13.5px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.35);
  }
  .btn-generate-prompt:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(245, 158, 11, 0.5);
  }

  /* Step 2: Structured Prompt & Storyboard Box */
  .prompt-workbench {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px dashed rgba(255, 255, 255, 0.12);
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 18px;
  }
  @media (max-width: 900px) {
    .prompt-workbench { grid-template-columns: 1fr; }
  }

  .prompt-editor-card {
    background: #06090f;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .prompt-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 700;
    color: #cbd5e1;
  }
  .prompt-textarea {
    width: 100%;
    background: #04060a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #38bdf8;
    padding: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    line-height: 1.55;
    resize: vertical;
    min-height: 240px;
  }
  .prompt-textarea:focus {
    outline: none;
    border-color: #38bdf8;
  }

  .btn-generate-video-action {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
    border: none;
    border-radius: 9px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 18px rgba(16, 185, 129, 0.4);
    width: 100%;
  }
  .btn-generate-video-action:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(16, 185, 129, 0.55);
  }

  /* Step 3: Instagram Post Package Card */
  .post-deliverables-card {
    background: #090e17;
    border: 1px solid rgba(56, 189, 248, 0.3);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .deliverables-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 700;
    color: #38bdf8;
  }
  .ig-caption-box {
    background: #04070e;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 12px;
    font-size: 12px;
    color: #e2e8f0;
    line-height: 1.5;
    white-space: pre-wrap;
    max-height: 200px;
    overflow-y: auto;
  }
  .btn-copy-caption {
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.4);
    color: #38bdf8;
    padding: 8px 14px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.15s ease;
  }
  .btn-copy-caption:hover {
    background: rgba(56, 189, 248, 0.28);
  }

  /* Audio-Subtitle Sync Calibration */
  .sync-calibration-card {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(245, 158, 11, 0.25);
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
  }
  .btn-micro {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #cbd5e1;
    font-size: 10.5px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-micro:hover, .btn-micro.active {
    background: rgba(245, 158, 11, 0.25);
    border-color: #f59e0b;
    color: #f59e0b;
  }
`;

// Inject CSS styles right before </style>
content = content.replace('</style>', newStyles + '\n</style>');

// 2. HTML MARKUP FOR AUTO-GENERATE POST STUDIO
const autoPostHtml = `
<!-- ============================================================== -->
<!-- 💡 AUTO-GENERATE VIRAL POST STUDIO (IDEA -> PROMPT -> VIDEO)    -->
<!-- ============================================================== -->
<div class="auto-post-card" id="autoPostStudio">
  <div class="auto-post-header">
    <div class="auto-post-title">
      <span>💡</span>
      <span>Auto-Generate Viral Post:</span>
      <span class="glow">Idea ➔ Prompt ➔ Video Engine</span>
    </div>
    <div class="auto-post-tag">Taskless AI High-Retention Workflow</div>
  </div>

  <!-- Step 1: Idea Input -->
  <div class="idea-input-section">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <span style="font-size:13px;font-weight:700;color:#cbd5e1">1. Enter Any Contractor Idea or Click a High-Converting Preset:</span>
      <span style="font-size:11.5px;color:#94a3b8">Florida High-Ticket Trade Scenarios</span>
    </div>

    <!-- Quick Preset Pills -->
    <div class="idea-presets-row">
      <button type="button" class="preset-pill active" onclick="applyTradePreset('hvac')">
        <span>❄️</span> <span>HVAC Summer Heatwave ($9,200)</span>
      </button>
      <button type="button" class="preset-pill" onclick="applyTradePreset('plumbing')">
        <span>🚰</span> <span>Sunday Sewer Backup ($8,500)</span>
      </button>
      <button type="button" class="preset-pill" onclick="applyTradePreset('roofing')">
        <span>🏠</span> <span>Hurricane Hail Shingle Leak ($14,000)</span>
      </button>
      <button type="button" class="preset-pill" onclick="applyTradePreset('electrical')">
        <span>⚡</span> <span>Solo Electrician $6K Panel Upgrade</span>
      </button>
      <button type="button" class="preset-pill" onclick="applyTradePreset('speed')">
        <span>⏱️</span> <span>90-Second Speed-to-Lead Stat</span>
      </button>
    </div>

    <textarea id="postIdeaInput" class="idea-textarea" placeholder="Describe any contractor situation or business offer (e.g. AC compressor dies on a 95-degree Sunday, homeowner calls 3 HVAC shops and gets 2 voicemails. Ava answers for Titan Air in 0.8s, qualifies the emergency, checks schedule, and dispatches tech via SMS)...">Florida summer 98-degree heatwave. Homeowner's AC blows out on a Sunday afternoon. They call 3 local HVAC contractors. Two go straight to dead voicemails. Ava answers for Titan Air in 0.8 seconds, books a $9,200 full system replacement, and dispatches the lead to the technician's phone in 24 seconds.</textarea>

    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:4px">
      <button type="button" class="btn-generate-prompt" id="btnGeneratePrompt" onclick="generateViralPromptFromIdea()">
        <span>⚡</span> <span>Step 1: Generate Structured Viral Prompt</span>
      </button>
      <span style="font-size:12px;color:#94a3b8">Generates 5-part storyboard prompt + formatted narration script</span>
    </div>
  </div>

  <!-- Step 2 & 3: Structured Prompt Review & Clean Post Output -->
  <div class="prompt-workbench" id="promptWorkbench" style="display:none">
    
    <!-- Left: Structured Prompt & Narration Script -->
    <div class="prompt-editor-card">
      <div class="prompt-editor-header">
        <span style="color:#f59e0b;font-weight:800">📝 2. Review &amp; Edit Viral Prompt:</span>
        <span id="promptWordStats" style="font-family:monospace;font-size:11px;color:#94a3b8">158 words • ~59s video</span>
      </div>

      <textarea id="structuredPromptOutput" class="prompt-textarea" placeholder="Your structured storyboard prompt will appear here..."></textarea>

      <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;font-weight:700;color:#cbd5e1">🎙️ Narration Script (Audio Track):</span>
          <button type="button" onclick="copyVoiceoverScript()" style="background:transparent;border:none;color:#38bdf8;font-size:11px;cursor:pointer;font-weight:700">📋 Copy Script</button>
        </div>
        <div id="cleanScriptPreview" style="font-size:12px;color:#94a3b8;background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;max-height:90px;overflow-y:auto;line-height:1.45"></div>
      </div>

      <button type="button" class="btn-generate-video-action" id="btnGenerateVideo" onclick="generateVideoFromPrompt()">
        <span>🎬</span> <span>Step 2: Generate Video From This Prompt</span>
      </button>
    </div>

    <!-- Right: Complete Ready-to-Post Instagram Deliverables -->
    <div class="post-deliverables-card" id="postDeliverablesCard">
      <div class="deliverables-header">
        <span style="color:#10b981;font-weight:800;display:flex;align-items:center;gap:6px">
          <span>📱</span> <span>3. Ready-to-Post Instagram Deliverable</span>
        </span>
        <span style="font-size:11px;background:#10b981;color:#041f14;padding:2px 8px;border-radius:999px;font-weight:800">READY</span>
      </div>

      <div>
        <div style="font-size:11.5px;color:#94a3b8;margin-bottom:6px">Caption &amp; DM Funnel Trigger:</div>
        <div class="ig-caption-box" id="igCaptionText">Generating your optimized caption...</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px">
        <button type="button" class="btn-copy-caption" id="btnCopyCaption" onclick="copyInstagramCaption()">
          <span>📋</span> <span id="copyCaptionBtnText">Copy Instagram Caption + Hashtags</span>
        </button>

        <div style="display:flex;gap:8px">
          <a href="video/vantorx-speed-to-lead-reel.mp4" download="vantorx-speed-to-lead-reel.mp4" id="btnDownloadPostMp4" style="flex:1;background:#f59e0b;color:#0b0f19;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:800;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px">
            <span>📥</span> <span>Download Video (.mp4)</span>
          </a>
          <button type="button" onclick="downloadCurrentAudio()" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#ffffff;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">
            <span>🎵</span> Audio
          </button>
        </div>
      </div>

      <div id="videoGenStatusMsg" style="font-size:12px;padding:8px 10px;border-radius:8px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#10b981;display:none">
        ✅ <strong>Video Generated &amp; Synced!</strong> Playing on canvas now.
      </div>
    </div>

  </div>
</div>
`;

// Inject the Auto-Generate Post card right before <div class="studio-layout">
content = content.replace('<div class="studio-layout">', autoPostHtml + '\n<div class="studio-layout">');

// 3. ADD AUDIO-SUBTITLE SYNC CALIBRATION SLIDER TO THE TIMELINE PANEL
const syncCalibrationHtml = `
      <!-- Audio-Subtitle Timing Calibration Controls -->
      <div class="sync-calibration-card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:12px;font-weight:700;color:#cbd5e1;display:flex;align-items:center;gap:6px">
            <span>🎚️</span> <span>TTS &amp; Voice Sync Calibration:</span>
          </span>
          <span id="syncOffsetVal" style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#f59e0b;font-weight:800">0ms (Exact Lock)</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:10px;color:#94a3b8">-200ms (Early)</span>
          <input type="range" id="audioSyncSlider" min="-200" max="200" step="10" value="0" oninput="setAudioSyncOffset(this.value)" style="flex:1;accent-color:#f59e0b;cursor:pointer">
          <span style="font-size:10px;color:#94a3b8">+200ms (Late)</span>
        </div>
        <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">
          <button type="button" class="btn-micro" onclick="setAudioSyncOffset(-80)">-80ms</button>
          <button type="button" class="btn-micro" onclick="setAudioSyncOffset(-40)">-40ms</button>
          <button type="button" class="btn-micro active" id="btnSyncZero" onclick="setAudioSyncOffset(0)">0ms (Default)</button>
          <button type="button" class="btn-micro" onclick="setAudioSyncOffset(40)">+40ms</button>
          <button type="button" class="btn-micro" onclick="setAudioSyncOffset(80)">+80ms</button>
        </div>
      </div>
`;

// Inject into timeline-bar-container
content = content.replace('</div>\n    </div>\n\n    <!-- Audio & Voice Production Engine -->', '</div>\n' + syncCalibrationHtml + '    </div>\n\n    <!-- Audio & Voice Production Engine -->');

console.log('Successfully injected CSS, Auto-Generate Post card, and Sync Calibration controls.');

fs.writeFileSync(targetPath, content, 'utf8');
