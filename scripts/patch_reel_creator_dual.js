const fs = require('fs');
const p = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/demo/reel-creator.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Add Reel Switcher right above the Video Stage
const oldVideoHeader = `<div class="studio-workspace">
  <div class="video-stage">
    <div class="stage-header">
      <div class="stage-title">
        <span class="live-pulse"></span>
        <span>🎬 Viral Reel Stage (1080×1920 • 9:16)</span>
      </div>`;

const newVideoHeader = `<div class="studio-workspace">
  <div class="video-stage">
    
    <!-- 🎛️ REEL 1 vs REEL 2 PRIMARY SWITCHER -->
    <div style="background:linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95));border:1.5px solid rgba(245,158,11,0.5);border-radius:12px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;box-shadow:0 8px 24px rgba(0,0,0,0.6)">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:18px">🎬</span>
        <span style="font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:800;color:#f8fafc;letter-spacing:0.04em;text-transform:uppercase">Active Reel:</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button type="button" id="tabReel1" onclick="switchActiveReel(1)" style="background:rgba(245,158,11,0.2);border:1.5px solid #f59e0b;color:#fbbf24;font-size:12.5px;font-weight:800;padding:7px 14px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.18s">
          <span>🎬 Reel #1 (89s Story)</span>
        </button>
        <button type="button" id="tabReel2" onclick="switchActiveReel(2)" style="background:rgba(56,189,248,0.15);border:1.5px solid rgba(56,189,248,0.4);color:#7dd3fc;font-size:12.5px;font-weight:800;padding:7px 14px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.18s">
          <span>⚡ Reel #2 (&lt;30s Viral Cut)</span>
        </button>
        <a href="reel2.html" target="_blank" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.18);color:#e2e8f0;font-size:12px;font-weight:700;padding:7px 12px;border-radius:8px;text-decoration:none;display:inline-flex;align-items:center;gap:5px">
          <span>📱 Standalone Player ↗</span>
        </a>
      </div>
    </div>

    <div class="stage-header">
      <div class="stage-title">
        <span class="live-pulse"></span>
        <span id="activeReelStageTitle">🎬 Viral Reel Stage — Reel #1 (1080×1920 • 9:16)</span>
      </div>`;

if (html.includes(oldVideoHeader)) {
  html = html.replace(oldVideoHeader, newVideoHeader);
  console.log('Replaced video stage header with Reel Switcher!');
} else {
  console.log('Could not find exact oldVideoHeader string, searching alternatives...');
}

// 2. Add switchActiveReel script logic
const switchLogic = `
  // ==============================================================
  // 🎬 REEL 1 vs REEL 2 DUAL-MODE ENGINE
  // ==============================================================
  let CURRENT_ACTIVE_REEL = 1;
  const REEL_METADATA = {
    1: {
      title: "Reel #1: Speed to Lead (The Bleed) — 89s Story",
      videoSrc: "video/vantorx-speed-to-lead-reel.mp4?v=8912",
      duration: "01:29",
      subTitle: "Speed of Light & The Ladder Dilemma · Ava Voice AI ($9,200 Save)",
      caption: \`Every contractor has lived this exact nightmare: 

You're on a 28-foot extension ladder in 95-degree heat, sweat pouring into your eyes, both hands on a drill. Your pocket buzzes. 

It's an emergency homeowner call. A $9,200 full system replacement. 

You can't answer. You let it go to voicemail. 

By the time you climb down, drink water, and call back 42 minutes later... they've already hired your competitor. 📉

78% of homeowners hire whoever answers FIRST. 

Meet Ava — your 24/7 autonomous Voice AI phone receptionist. Ava answers on the 1st ring (under 1 second), books appointments directly into your schedule, and texts the job details straight to your truck. 

Zero lost calls. Zero lost revenue.

Call our live demo line right now to hear Ava answer in 0.8s: (561) 813-8602 📞
Or comment "AVA" below and we'll audit your shop's speed-to-lead.

#contractor #hvac #roofing #plumbing #servicebusiness #contractorlife #smallbusinessowner #aiautomation #homeimprovement #speedtolead\`
    },
    2: {
      title: "Reel #2: The 30-Second Contractor Hook — 29.7s Viral Cut",
      videoSrc: "video/vantorx-30s-reel-2.mp4?v=3002",
      duration: "00:29",
      subTitle: "Stop scrolling! 78% Speed Rule & Friday 7 PM AC Emergency (<30s)",
      caption: \`Stop losing $8,000 jobs to voicemail. 📉

78% of homeowners hire the first contractor who picks up the phone. When you're on a ladder or under a sink, you can't answer — so they call your competitor.

Meet AVA: Your 24/7 Voice AI Receptionist. 
✅ Answers on the 1st ring (under 1 second)
✅ Qualifies the job & emergency status
✅ Dispatches booking details straight to your phone

Test AVA right now live: (561) 813-8602 📞
Or drop "AVA" below and we’ll set up your shop's demo.

#contractor #hvac #roofing #plumbing #servicebusiness #contractorlife #smallbusinessowner #aiautomation #homeimprovement #speedtolead\`
    }
  };

  function switchActiveReel(reelNum) {
    CURRENT_ACTIVE_REEL = reelNum;
    const meta = REEL_METADATA[reelNum];
    if (!meta) return;

    // 1. Update Buttons
    const tab1 = document.getElementById('tabReel1');
    const tab2 = document.getElementById('tabReel2');
    const slotMorn = document.getElementById('btnMorningSlot');
    const slotEve = document.getElementById('btnEveningSlot');

    if (reelNum === 1) {
      if (tab1) { tab1.style.background = 'rgba(245,158,11,0.3)'; tab1.style.borderColor = '#f59e0b'; tab1.style.color = '#fbbf24'; }
      if (tab2) { tab2.style.background = 'rgba(30,41,59,0.7)'; tab2.style.borderColor = 'rgba(255,255,255,0.15)'; tab2.style.color = '#94a3b8'; }
      if (slotMorn) slotMorn.classList.add('active');
      if (slotEve) slotEve.classList.remove('active');
    } else {
      if (tab2) { tab2.style.background = 'linear-gradient(135deg,rgba(56,189,248,0.3),rgba(14,165,233,0.3))'; tab2.style.borderColor = '#38bdf8'; tab2.style.color = '#7dd3fc'; }
      if (tab1) { tab1.style.background = 'rgba(30,41,59,0.7)'; tab1.style.borderColor = 'rgba(255,255,255,0.15)'; tab1.style.color = '#94a3b8'; }
      if (slotEve) slotEve.classList.add('active');
      if (slotMorn) slotMorn.classList.remove('active');
    }

    // 2. Update Stage Titles & Labels
    const stageTitle = document.getElementById('activeReelStageTitle');
    if (stageTitle) stageTitle.textContent = meta.title;

    const sub = document.getElementById('reelPlayStorySub');
    if (sub) sub.textContent = meta.subTitle;

    const dur = document.getElementById('totalDurationLabel');
    if (dur) dur.textContent = meta.duration;

    // 3. Update Video Player
    const masterVideo = document.getElementById('masterMp4Player');
    const canvas = document.getElementById('reelCanvas');
    if (masterVideo) {
      const wasPlaying = !masterVideo.paused;
      masterVideo.pause();
      masterVideo.src = meta.videoSrc;
      masterVideo.load();
      masterVideo.style.display = 'block';
      if (canvas) canvas.style.display = 'none';
      const playOverlay = document.getElementById('reelPlayOverlay');
      if (playOverlay) playOverlay.style.display = 'none';
      if (wasPlaying) masterVideo.play().catch(() => {});
    }

    // 4. Update Caption Box
    const captionEl = document.getElementById('igCaptionText');
    if (captionEl) captionEl.innerText = meta.caption;

    // 5. Update Download Button
    const dlBtn = document.getElementById('btnDownloadPostMp4');
    if (dlBtn) {
      dlBtn.href = meta.videoSrc;
      dlBtn.download = reelNum === 1 ? 'vantorx-speed-to-lead-reel.mp4' : 'vantorx-30s-reel-2.mp4';
      dlBtn.innerHTML = '<span>📥</span> <span>Download ' + (reelNum === 1 ? 'Reel #1 (89s MP4)' : 'Reel #2 (<30s MP4)') + '</span>';
    }
  }

  function selectDailySlot(slot) {
    if (slot === 'morning') switchActiveReel(1);
    else switchActiveReel(2);
  }
`;

// Append script before closing </body>
html = html.replace('</body>', `<script>${switchLogic}</script></body>`);
fs.writeFileSync(p, html, 'utf8');
console.log('Successfully patched reel-creator.html with dual-reel switching logic!');
