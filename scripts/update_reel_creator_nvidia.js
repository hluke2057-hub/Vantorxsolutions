const fs = require('fs');
const path = require('path');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';

function updateReel2Page() {
  const p = path.join(root, 'website/demo/reel2.html');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VantorX — Reel #2: How Nvidia's CEO Cheated & The Voicemail Bleed (&lt;28s)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@700;800&family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #060911;
      --card-bg: #0d1322;
      --border: rgba(255, 255, 255, 0.12);
      --gold: #f59e0b;
      --gold-light: #fbbf24;
      --cyan: #38bdf8;
      --emerald: #10b981;
      --nvidia: #22c55e;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px 60px;
    }
    .header {
      text-align: center;
      max-width: 680px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.45);
      color: #86efac;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 12px;
    }
    h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(24px, 4vw, 36px);
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 8px;
    }
    h1 span {
      background: linear-gradient(135deg, #86efac, #22c55e, #fbbf24);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: var(--muted);
      font-size: 14px;
    }
    
    .reel-stage-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 28px;
      max-width: 1100px;
      width: 100%;
      margin: 0 auto;
    }
    
    .phone-mockup {
      width: 100%;
      max-width: 380px;
      aspect-ratio: 9 / 16;
      background: #000;
      border: 3px solid rgba(255, 255, 255, 0.18);
      border-radius: 36px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(34, 197, 94, 0.2);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      background: #000;
    }
    .phone-notch {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 110px;
      height: 22px;
      background: #000;
      border-radius: 999px;
      z-index: 10;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    
    .meta-sidebar {
      flex: 1;
      min-width: 320px;
      max-width: 520px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
    }
    .card-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .act-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .act-item {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      transition: all 0.2s;
    }
    .act-item.active {
      background: rgba(34, 197, 94, 0.14);
      border-color: rgba(34, 197, 94, 0.5);
    }
    .act-time {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 800;
      color: var(--nvidia);
      background: rgba(34, 197, 94, 0.15);
      padding: 3px 6px;
      border-radius: 6px;
      white-space: nowrap;
    }
    .act-name {
      font-size: 13px;
      font-weight: 700;
      color: #f1f5f9;
    }
    .act-desc {
      font-size: 12px;
      color: var(--muted);
      margin-top: 2px;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 13px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 800;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.18s;
      width: 100%;
    }
    .btn-green {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: #022c14;
      box-shadow: 0 8px 20px rgba(34, 197, 94, 0.35);
    }
    .btn-green:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(34, 197, 94, 0.5);
    }
    .btn-outline {
      background: rgba(255, 255, 255, 0.05);
      color: #f1f5f9;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .caption-box {
      background: #04070e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 12px;
      font-size: 12.5px;
      line-height: 1.5;
      color: #cbd5e1;
      max-height: 160px;
      overflow-y: auto;
      white-space: pre-wrap;
      font-family: inherit;
    }
    
    #toast {
      display: none;
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--emerald);
      color: #041f14;
      font-weight: 800;
      padding: 12px 20px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 9999;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="badge">⚡ Viral Hook &amp; Story Formula</div>
    <h1>Reel #2: <span>Nvidia's CEO Cheated</span></h1>
    <p class="subtitle">Hook (0-3s) • What Jensen Did (3-12s) • Nobody is Perfect (12-16s) • Promotion &amp; CTA (16-27s)</p>
  </div>

  <div class="reel-stage-container">
    <div class="phone-mockup">
      <div class="phone-notch"></div>
      <video id="reelVideo" src="video/vantorx-30s-reel-2.mp4?v=nvidia" controls playsinline preload="auto" poster="video/reel2_act1_hook.png"></video>
    </div>

    <div class="meta-sidebar">
      
      <div class="card" style="border-color: rgba(34, 197, 94, 0.4);">
        <div class="card-title" style="color: #4ade80;">📥 Post Ready Video</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="video/vantorx-30s-reel-2.mp4?v=nvidia" download="vantorx-nvidia-reel.mp4" class="btn btn-green">
            <span>⚡</span>
            <span>Download Reel #2 (.MP4 — 27.0s)</span>
          </a>
          <button type="button" class="btn btn-outline" onclick="copyCaption()">
            <span>📋</span>
            <span id="copyBtnText">Copy Instagram Caption + Tags</span>
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-title">🎬 4-Act Story Breakdown</div>
        <div class="act-list">
          <div class="act-item" id="act1">
            <span class="act-time">0:00 - 0:03</span>
            <div>
              <div class="act-name">Act 1: The Viral Hook</div>
              <div class="act-desc">"Nvidia's CEO cheated. Let me explain."</div>
            </div>
          </div>
          <div class="act-item" id="act2">
            <span class="act-time">0:03 - 0:12</span>
            <div>
              <div class="act-name">Act 2: The Deep Story (1995 Sega Rescue)</div>
              <div class="act-desc">"In 1995, Jensen Huang built a broken chip. Nvidia had thirty days of cash left. He went to Sega, confessed failure, and got five million anyway by pivoting to automation."</div>
            </div>
          </div>
          <div class="act-item" id="act3">
            <span class="act-time">0:12 - 0:16</span>
            <div>
              <div class="act-name">Act 3: The Reality Check (Nobody's Perfect)</div>
              <div class="act-desc">"Nobody is perfect. Neither is your business. You're losing eight grand a week to voicemail."</div>
            </div>
          </div>
          <div class="act-item" id="act4">
            <span class="act-time">0:16 - 0:27</span>
            <div>
              <div class="act-name">Act 4: The Promotion &amp; CTA</div>
              <div class="act-desc">"Meet AVA: our Voice AI that answers in one second and books jobs 24/7. Call (561) 813-8602 or comment AVA below."</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">📝 Optimized Instagram Caption</div>
        <div class="caption-box" id="captionText">Nvidia’s CEO cheated. Let me explain. 🧠

In 1995, Jensen Huang built the wrong chip. Nvidia had 30 days of cash left before total bankruptcy. Instead of quitting, he walked into Sega's boardroom, confessed they failed, and got $5M anyway by pivoting to ruthless automation.

Here’s the truth: Nobody is perfect. And neither is your business. 📉

Right now, your shop is losing $8,000 every week because calls hit voicemail while you’re on a ladder or under a sink.

You don’t need to be perfect — you just need an unfair advantage. ⚡

Meet AVA: Your 24/7 Voice AI Receptionist. 
✅ Answers on the 1st ring (under 1 second)
✅ Qualifies the job & emergency status
✅ Dispatches booking details straight to your truck

Test AVA live right now: (561) 813-8602 📞
Or drop "AVA" below and we’ll set up your shop's demo.

#contractor #hvac #roofing #plumbing #servicebusiness #contractorlife #smallbusinessowner #aiautomation #speedtolead #nvidia #businesslessons</div>
      </div>

      <div style="display:flex;gap:10px">
        <a href="reel-creator.html" class="btn btn-outline" style="font-size:12px;padding:10px">
          <span>🎬</span> <span>Open Full Reel Studio</span>
        </a>
        <a href="/instagram-package/" class="btn btn-outline" style="font-size:12px;padding:10px">
          <span>📱</span> <span>IG Highlights Kit</span>
        </a>
      </div>

    </div>
  </div>

  <div id="toast">Caption copied to clipboard!</div>

  <script>
    const video = document.getElementById('reelVideo');
    const acts = [
      { id: 'act1', start: 0, end: 2.61 },
      { id: 'act2', start: 2.61, end: 12.27 },
      { id: 'act3', start: 12.27, end: 16.39 },
      { id: 'act4', start: 16.39, end: 28 }
    ];

    video.addEventListener('timeupdate', () => {
      const cur = video.currentTime;
      acts.forEach(a => {
        const el = document.getElementById(a.id);
        if (el) {
          if (cur >= a.start && cur < a.end) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        }
      });
    });

    function copyCaption() {
      const text = document.getElementById('captionText').innerText;
      navigator.clipboard.writeText(text).then(() => {
        const t = document.getElementById('toast');
        t.style.display = 'block';
        document.getElementById('copyBtnText').textContent = '✅ Copied to Clipboard!';
        setTimeout(() => {
          t.style.display = 'none';
          document.getElementById('copyBtnText').textContent = 'Copy Instagram Caption + Tags';
        }, 2500);
      });
    }
  </script>
</body>
</html>
`;
  fs.writeFileSync(p, html, 'utf8');
  console.log('Updated website/demo/reel2.html');
}

function updateReelCreatorHtml() {
  const p = path.join(root, 'website/demo/reel-creator.html');
  let html = fs.readFileSync(p, 'utf8');

  // Update REEL_METADATA entry 2 with the Nvidia story & caption
  const oldMeta2Regex = /2:\s*\{[\s\S]*?caption:\s*`[\s\S]*?`\s*\}/;
  const newMeta2 = `2: {
      title: "Reel #2: How Nvidia's CEO Cheated & The $8,000 Bleed — 27.0s Viral Cut",
      videoSrc: "video/vantorx-30s-reel-2.mp4?v=nvidia",
      duration: "00:27",
      subTitle: "Nvidia's CEO Cheated · 1995 Sega Rescue · Nobody's Perfect · Ava Voice AI",
      caption: \`Nvidia’s CEO cheated. Let me explain. 🧠

In 1995, Jensen Huang built the wrong chip. Nvidia had 30 days of cash left before total bankruptcy. Instead of quitting, he walked into Sega's boardroom, confessed they failed, and got $5M anyway by pivoting to ruthless automation.

Here’s the truth: Nobody is perfect. And neither is your business. 📉

Right now, your shop is losing $8,000 every week because calls hit voicemail while you’re on a ladder or under a sink.

You don’t need to be perfect — you just need an unfair advantage. ⚡

Meet AVA: Your 24/7 Voice AI Receptionist. 
✅ Answers on the 1st ring (under 1 second)
✅ Qualifies the job & emergency status
✅ Dispatches booking details straight to your truck

Test AVA live right now: (561) 813-8602 📞
Or drop "AVA" below and we’ll set up your shop's demo.

#contractor #hvac #roofing #plumbing #servicebusiness #contractorlife #smallbusinessowner #aiautomation #speedtolead #nvidia #businesslessons\`
    }`;

  if (oldMeta2Regex.test(html)) {
    html = html.replace(oldMeta2Regex, newMeta2);
    console.log('Replaced REEL_METADATA[2] in reel-creator.html');
  }

  // Set default active reel to Reel 2 on page load
  html = html.replace(/let CURRENT_ACTIVE_REEL = 1;/, 'let CURRENT_ACTIVE_REEL = 2;');

  // Make the video tag point to the new video and display it
  html = html.replace(
    /<video id="masterMp4Player" src="[^"]*"/,
    '<video id="masterMp4Player" src="video/vantorx-30s-reel-2.mp4?v=nvidia"'
  );

  // Update download button
  html = html.replace(
    /href="video\/vantorx-30s-reel-2\.mp4[^"]*"/g,
    'href="video/vantorx-30s-reel-2.mp4?v=nvidia"'
  );

  // Call switchActiveReel(2) right after DOMContentLoaded so everything updates automatically on load
  const autoSwitchHook = `
  // Auto-load Reel #2 (Nvidia viral cut) as default
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { if (typeof switchActiveReel === 'function') switchActiveReel(2); }, 100);
  });
`;
  if (!html.includes('Auto-load Reel #2 (Nvidia viral cut) as default')) {
    html = html.replace('</script></body>', autoSwitchHook + '</script></body>');
  }

  fs.writeFileSync(p, html, 'utf8');
  console.log('Updated website/demo/reel-creator.html successfully!');
}

updateReel2Page();
updateReelCreatorHtml();

