// scripts/patch_sync_calibration_html.js
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('website/demo/reel-creator.html');
let content = fs.readFileSync(targetPath, 'utf8');

const targetStr = `<div class="progress-track" id="progressTrack">
          <div class="progress-fill" id="progressFill"></div>
        </div>
      </div>
    </div>`;

const targetNormalized = /<div class="progress-track" id="progressTrack">\r?\n\s*<div class="progress-fill" id="progressFill"><\/div>\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*<\/div>/;

const replacement = `<div class="progress-track" id="progressTrack">
          <div class="progress-fill" id="progressFill"></div>
        </div>

        <!-- Audio-Subtitle Timing Calibration Controls -->
        <div class="sync-calibration-card" style="margin-top:12px;background:rgba(0,0,0,0.3);border:1px solid rgba(245,158,11,0.25);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:8px">
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
      </div>
    </div>`;

if (!targetNormalized.test(content)) {
  console.log('Trying simpler match...');
  const idx = content.indexOf('<div class="progress-fill" id="progressFill"></div>');
  if (idx !== -1) {
    const endTrack = content.indexOf('</div>', idx);
    const endContainer = content.indexOf('</div>', endTrack + 6);
    const before = content.slice(0, endContainer);
    const after = content.slice(endContainer);

    content = before + `
        <!-- Audio-Subtitle Timing Calibration Controls -->
        <div class="sync-calibration-card" style="margin-top:12px;background:rgba(0,0,0,0.3);border:1px solid rgba(245,158,11,0.25);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:8px">
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
        </div>` + after;

    fs.writeFileSync(targetPath, content, 'utf8');
    console.log('✓ Successfully injected sync-calibration-card.');
    process.exit(0);
  }
  console.error('Could not find progress track');
  process.exit(1);
}

content = content.replace(targetNormalized, replacement);
fs.writeFileSync(targetPath, content, 'utf8');
console.log('✓ Successfully replaced target with sync-calibration-card.');
