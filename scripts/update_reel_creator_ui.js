const fs = require('fs');

const reelPath = 'website/demo/reel-creator.html';
let content = fs.readFileSync(reelPath, 'utf8');

// 1. Fix totalDurationLabel 00:26 -> 00:59
content = content.replace(
  '<span id="totalDurationLabel">00:26</span>',
  '<span id="totalDurationLabel">00:59</span>'
);

// 2. Fix 26s in export button
content = content.replace(
  "exportBtn.innerHTML = '<span>⏳</span> Rendering Video &amp; Audio... (26s)';",
  "exportBtn.innerHTML = '<span>⏳</span> Rendering Video &amp; Audio... (59s)';"
);
content = content.replace(
  "exportBtn.innerHTML = '<span>⏳</span> Rendering Video & Audio... (26s)';",
  "exportBtn.innerHTML = '<span>⏳</span> Rendering Video & Audio... (59s)';"
);

// 3. Add Instant Download Banner right below <header>...</header>
const downloadBannerHtml = `
<div style="background:linear-gradient(135deg, rgba(245,158,11,0.18), rgba(16,185,129,0.18));border:1.5px solid rgba(245,158,11,0.5);border-radius:12px;padding:16px 20px;margin:18px auto 24px auto;max-width:1160px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;box-shadow:0 8px 32px rgba(0,0,0,0.5)">
  <div style="display:flex;align-items:center;gap:14px">
    <div style="font-size:36px">🎬</div>
    <div>
      <div style="font-size:16px;font-weight:800;color:#ffffff;display:flex;align-items:center;gap:8px">
        <span>Instagram Reel Video Ready (HD 1080x1920 MP4)</span>
        <span style="font-size:11px;background:#10b981;color:#041f14;font-weight:900;padding:2px 8px;border-radius:999px">RENDERED &amp; VERIFIED</span>
      </div>
      <div style="font-size:12.5px;color:#cbd5e1;margin-top:3px">
        59.3s duration • ElevenLabs Adam Master Voiceover • Lofi Beat • Subdrops &amp; Laser SFX • Ready to upload to Instagram, TikTok &amp; YouTube Shorts
      </div>
    </div>
  </div>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
    <a href="/demo/video/vantorx-speed-to-lead-reel.mp4" download="vantorx-speed-to-lead-reel.mp4" style="background:#f59e0b;color:#0b0f19;font-weight:800;font-size:13.5px;padding:11px 22px;border-radius:8px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(245,158,11,0.4);transition:transform 0.1s ease">
      <span>📥</span> <span>Download MP4 for Instagram (7.5 MB)</span>
    </a>
    <a href="/demo/video/vantorx-speed-to-lead-reel.mp4" target="_blank" style="color:#38bdf8;font-size:12.5px;text-decoration:none;font-weight:600;padding:9px 14px;border:1px solid rgba(56,189,248,0.4);border-radius:8px">
      Open Direct Video ↗
    </a>
  </div>
</div>
`;

if (!content.includes('Instagram Reel Video Ready')) {
  content = content.replace('</header>', '</header>\n' + downloadBannerHtml);
}

// 4. In actions-group, add the Download Ready MP4 button above Play & Preview
const actionDownloadBtn = `
      <a href="/demo/video/vantorx-speed-to-lead-reel.mp4" download="vantorx-speed-to-lead-reel.mp4" class="btn-primary" style="background:#f59e0b;color:#0b0f19;font-weight:800;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px;box-shadow:0 4px 16px rgba(245,158,11,0.35)">
        <span>📥</span> Download Ready MP4 Video (7.5 MB)
      </a>
`;

if (!content.includes('Download Ready MP4 Video')) {
  content = content.replace(
    '<button class="btn-primary" id="btnPlayPause" onclick="togglePlay()">',
    actionDownloadBtn + '      <button class="btn-primary" id="btnPlayPause" onclick="togglePlay()">'
  );
}

// 5. Add direct video player toggle tab in video stage overlay
const stageVideoToggle = `
      <div style="display:flex;gap:6px">
        <button id="btnViewCanvas" onclick="switchStageView('canvas')" style="background:rgba(245,158,11,0.9);color:#0b0f19;border:none;font-size:11px;font-weight:800;padding:3px 10px;border-radius:6px;cursor:pointer">Interactive Canvas</button>
        <button id="btnViewVideo" onclick="switchStageView('video')" style="background:rgba(255,255,255,0.15);color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-size:11px;font-weight:600;padding:3px 10px;border-radius:6px;cursor:pointer">🎬 Watch Master MP4</button>
      </div>
`;

if (!content.includes('switchStageView')) {
  content = content.replace(
    '<div class="stage-pill">9:16 VERTICAL REEL</div>',
    stageVideoToggle
  );

  // Add the <video> element right next to <canvas id="reelCanvas">
  const videoElementHtml = `
    <video id="masterMp4Player" src="/demo/video/vantorx-speed-to-lead-reel.mp4" controls playsinline preload="auto" style="display:none;width:100%;max-width:540px;height:auto;aspect-ratio:9/16;border-radius:12px;background:#000;box-shadow:0 12px 48px rgba(0,0,0,0.8)"></video>
`;
  content = content.replace(
    '<canvas id="reelCanvas" width="540" height="960"></canvas>',
    '<canvas id="reelCanvas" width="540" height="960"></canvas>\n' + videoElementHtml
  );

  // Add switchStageView function
  const switchFnCode = `
  window.switchStageView = function(view) {
    const canvasEl = document.getElementById('reelCanvas');
    const videoEl = document.getElementById('masterMp4Player');
    const btnC = document.getElementById('btnViewCanvas');
    const btnV = document.getElementById('btnViewVideo');
    if (view === 'video') {
      if (isPlaying) togglePlay();
      canvasEl.style.display = 'none';
      videoEl.style.display = 'block';
      videoEl.play().catch(() => {});
      btnV.style.background = 'rgba(245,158,11,0.9)';
      btnV.style.color = '#0b0f19';
      btnV.style.fontWeight = '800';
      btnC.style.background = 'rgba(255,255,255,0.15)';
      btnC.style.color = '#ffffff';
      btnC.style.fontWeight = '600';
    } else {
      videoEl.pause();
      videoEl.style.display = 'none';
      canvasEl.style.display = 'block';
      btnC.style.background = 'rgba(245,158,11,0.9)';
      btnC.style.color = '#0b0f19';
      btnC.style.fontWeight = '800';
      btnV.style.background = 'rgba(255,255,255,0.15)';
      btnV.style.color = '#ffffff';
      btnV.style.fontWeight = '600';
    }
  };
`;
  content = content.replace(
    'requestAnimationFrame(loop);',
    switchFnCode + '\n  requestAnimationFrame(loop);'
  );
}

fs.writeFileSync(reelPath, content, 'utf8');
console.log('Successfully updated website/demo/reel-creator.html with instant MP4 download & player!');
