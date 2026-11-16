const fs = require('fs');
const path = require('path');

// 1. Restore website/demo/reel2.html
let r2 = fs.readFileSync(path.resolve('website/demo/reel2.html'), 'utf8');
r2 = r2.replace(/High-Retention Fast-Hook Master Cut \(29\.7s\)/g, 'Extended Gradual Hook &amp; Non-Stop Motion Master Cut');
r2 = r2.replace(/Reel #2: <span>The \$8,000 Voicemail Bleed<\/span>/g, "Reel #2: <span>Nvidia's CEO Cheated</span>");
r2 = r2.replace(/Pattern Interrupt \(0-4\.3s\).*?AVA 24\/7 Voice AI Dispatch \(23\.2-29\.7s\)/g, 'Gradual Curiosity Hook (0-15.5s) • 1995 Sega Story (15.5-33.5s) • The -$8k Voicemail Bleed (33.5-46.1s) • AVA Voice AI &amp; 0.6s Site (46.1-75.1s)');
r2 = r2.replace(/vantorx-30s-voicemail-bleed-reel\.mp4/g, 'vantorx-nvidia-reel.mp4');
r2 = r2.replace(/Download Reel #2 \(\.MP4 — 29\.7s High-Retention Cut\)/g, 'Download Reel #2 (.MP4 — 75.1s Master Cut)');
r2 = r2.replace(/video\/vantorx-30s-reel-2\.mp4\?v=high_retention_29s/g, 'video/vantorx-30s-reel-2.mp4?v=cueva_master_75s');

const nvidiaCaption = `Did Nvidia build a $3 Trillion empire by playing by the book? 

Think again. 

The untold truth about how Nvidia actually survived... is that Jensen Huang cheated death.

In 1995, Nvidia was 30 days from total bankruptcy. Their flagship gaming chip was completely broken.

Instead of hiding behind PR, Jensen walked straight into Sega's boardroom, confessed they failed, and walked out with $5,000,000 anyway... by pivoting to ruthless automation. 

Here's the truth: Nobody is perfect. And neither is your business. 📉

Every single week, contractors lose $8,000 in emergency jobs while stuck on a ladder or asleep, because calls ring and die in voicemail.

Jensen had an unfair advantage. And now you do too. ⚡

Meet AVA: our 24/7 Voice AI Receptionist paired with a sub-second mobile website.
✅ Answers in 0.8 seconds on the 1st ring
✅ Qualifies emergency jobs & books calendar slots
✅ Dispatches client details straight to your truck

Don't play fair when your competitors are answering voicemail 3 hours late.

📞 Call (561) 813-8602 to test AVA live right now
💬 Or comment "AVA" below and we’ll install her for your shop.

#contractor #hvac #plumbing #roofing #electrician #bluecollar #servicebusiness #nvidia #jensenhuang #speedtolead #voiceai #aiautomation #smallbusinessowner`;

const r2ActList = `<div class="act-list">
          <div class="act-item" id="act1">
            <span class="act-time">0:00 - 0:15.5</span>
            <div>
              <div class="act-name">Act 1: The Gradual Curiosity Hook</div>
              <div class="act-desc">"Did Nvidia build a three trillion dollar empire by playing by the book? Think again. The untold truth about how Nvidia actually survived... is that Jensen Huang cheated. Let me explain."</div>
            </div>
          </div>
          <div class="act-item" id="act2">
            <span class="act-time">0:15.5 - 0:33.5</span>
            <div>
              <div class="act-name">Act 2: The Deep Story (1995 Sega Boardroom $5M Rescue)</div>
              <div class="act-desc">"In 1995, Nvidia was thirty days from total bankruptcy. Their chip was broken. Jensen walked into Sega's boardroom, confessed they failed, and walked out with five million dollars anyway... by pivoting to ruthless automation."</div>
            </div>
          </div>
          <div class="act-item" id="act3">
            <span class="act-time">0:33.5 - 0:46.1</span>
            <div>
              <div class="act-name">Act 3: The Reality Check (Attic Ladder &amp; -$8k Voicemail Bleed)</div>
              <div class="act-desc">"Here's the truth: Nobody is perfect. And neither is your business. You're losing eight thousand dollars every single week because emergency calls ring while you're on a ladder, and die in voicemail."</div>
            </div>
          </div>
          <div class="act-item" id="act4">
            <span class="act-time">0:46.1 - 1:15.1</span>
            <div>
              <div class="act-name">Act 4: Seamless Cut to AVA Voice AI &amp; Sub-Second Website</div>
              <div class="act-desc">"Jensen had an unfair advantage, and now you do too. Meet AVA: our 24/7 Voice AI Receptionist paired with a sub-second mobile website. She answers in 0.8s, qualifies jobs, and dispatches straight to your truck. Call (561) 813-8602 or comment AVA."</div>
            </div>
          </div>
        </div>`;

r2 = r2.replace(/<div class="act-list">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div class="card">\s*<div class="card-title">📝 High-Converting Instagram Caption/m, r2ActList + '\n      </div>\n\n      <div class="card">\n        <div class="card-title">📝 High-Converting Instagram Caption');
r2 = r2.replace(/<div class="caption-box" id="captionText">[\s\S]*?<\/div>/m, '<div class="caption-box" id="captionText">' + nvidiaCaption + '</div>');
r2 = r2.replace(/const acts = \[[\s\S]*?\];/m, `const acts = [
      { id: 'act1', start: 0, end: 15.48 },
      { id: 'act2', start: 15.48, end: 33.50 },
      { id: 'act3', start: 33.50, end: 46.14 },
      { id: 'act4', start: 46.14, end: 75.10 }
    ];`);

fs.writeFileSync(path.resolve('website/demo/reel2.html'), r2, 'utf8');
console.log('✅ reel2.html restored with full 75.1s Nvidia story');

// 2. Wire website/demo/reel-creator.html
let rc = fs.readFileSync(path.resolve('website/demo/reel-creator.html'), 'utf8');

rc = rc.replace(/High-Retention Reel #2 Video Ready \(HD 1080x1920 MP4\)/g, "Reel Video Ready: Nvidia's CEO Cheated (75.1s Cueva Cut)");
rc = rc.replace(/29\.7s High-Retention Fast-Hook Cut[\s\S]*?Algorithm Push/g, '75.1s Master Cut • 1995 Sega $5M Pre-Story ➔ The -$8k Voicemail Bleed ➔ AVA Voice AI 0.8s Dispatch • Authentic Illustrated 2D Animation');
rc = rc.replace(/Download 29\.7s High-Retention Reel \(MP4\)/g, 'Download Reel #2: Nvidia Master (75.1s MP4)');
rc = rc.replace(/Preview 29\.7s MP4 ↗/g, 'Preview Reel #2: Nvidia Master (75.1s) ↗');

// Update REEL_METADATA[2] caption
rc = rc.replace(/caption:\s*`Stop scrolling[\s\S]*?#smallbusinessowner`/m, 'caption: `' + nvidiaCaption + '`');
rc = rc.replace(/title:\s*"Reel #2: The \$8,000 Voicemail Bleed — 28\.9s High-Retention Fast Cut"/g, 'title: "Reel #2: How Nvidia\'s CEO Cheated & The $8,000 Bleed — 75.1s Master Cut"');
rc = rc.replace(/duration:\s*"00:29"/g, 'duration: "01:15"');
rc = rc.replace(/subTitle:\s*"Stop Scrolling[\s\S]*?Ava Voice AI"/g, 'subTitle: "Did Nvidia Play Fair? · Jensen Cheated Death · 1995 Sega $5M Rescue · -$8k Bleed · Ava Voice AI"');

// Make sure videos point to cueva_master_75s
rc = rc.replace(/vantorx-30s-reel-2\.mp4\?v=high_retention_29s/g, 'vantorx-30s-reel-2.mp4?v=cueva_master_75s');
rc = rc.replace(/vantorx-30s-voicemail-bleed-reel\.mp4/g, 'vantorx-nvidia-reel.mp4');

// Update total duration labels
rc = rc.replace(/const TOTAL_DURATION = \d+\.?\d*;/g, 'const TOTAL_DURATION = 75.1;');
rc = rc.replace(/<span id="totalDurationLabel">.*?<\/span>/g, '<span id="totalDurationLabel">01:15</span>');
rc = rc.replace(/<span id="currentSceneLabel">.*?<\/span>/g, '<span id="currentSceneLabel">Act 1: Did Nvidia Play Fair?</span>');

// Update Scenes list in reel-creator.html
const scenesListHtml = `<div class="scenes-grid" style="margin-top:8px">
        <div class="scene-card active" onclick="jumpToScene(0)">
          <div class="scene-idx">1</div>
          <div class="scene-meta">
            <div class="scene-name" id="scene1TitleLabel">① Act 1: The Gradual Curiosity Pre-Story Hook</div>
            <div class="scene-desc" id="scene1DescLabel">"Did Nvidia build a $3T empire playing by the book? Jensen Huang cheated death."</div>
          </div>
          <div class="scene-time">00:00</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(15.5)">
          <div class="scene-idx">2</div>
          <div class="scene-meta">
            <div class="scene-name">② Act 2: 1995 Sega Boardroom $5M Rescue</div>
            <div class="scene-desc">Nvidia 30 days from bankruptcy • Sega CEO $5M check &amp; ruthless automation pivot</div>
          </div>
          <div class="scene-time">00:15</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(33.5)">
          <div class="scene-idx">3</div>
          <div class="scene-meta">
            <div class="scene-name">③ Act 3: The Contractor Reality Check</div>
            <div class="scene-desc">Attic ladder in 130°F heat • Sarah's burst pipe • -$8,000 lost to dead voicemail</div>
          </div>
          <div class="scene-time">00:33</div>
        </div>
        <div class="scene-card" onclick="jumpToScene(46.1)">
          <div class="scene-idx">4</div>
          <div class="scene-meta">
            <div class="scene-name">④ Act 4: AVA Voice AI, 0.6s Site &amp; Live Dial</div>
            <div class="scene-desc">AVA answers in 0.8s • Texts dispatch to truck • Call (561) 813-8602 or comment AVA</div>
          </div>
          <div class="scene-time">00:46</div>
        </div>
      </div>`;

rc = rc.replace(/<div class="scenes-grid" style="margin-top:8px">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- Action Buttons -->/m, scenesListHtml + '\n    </div>\n\n\n    <!-- Action Buttons -->');

// Telemetry in switchActiveReel
rc = rc.replace(/mindLabel\.textContent = "🧠 ACTIVE REEL: THE \$8,000 VOICEMAIL BLEED \(29\.7s FAST CUT\)";/g, 'mindLabel.textContent = "🧠 ACTIVE REEL: NVIDIA\'S CEO CHEATED (75.1s CUEVA MASTER CUT)";');
rc = rc.replace(/prodTitle\.textContent = "⚡ The \$8,000 Voicemail Bleed & Ava Voice AI";/g, 'prodTitle.textContent = "⚡ How Jensen Huang Broke The Rules & Saved Nvidia";');
rc = rc.replace(/prodScen\.textContent = "Pattern Interrupt \(0-4\.3s\)[\s\S]*?\(561\) 813-8602";/g, 'prodScen.textContent = "Curiosity Pre-Story (0-15.5s) ➔ 1995 Sega $5M Rescue ➔ Nobody is Perfect (-$8k Bleed) ➔ AVA 24/7 Voice AI & 0.6s Site";');
rc = rc.replace(/dlBtn\.innerHTML = '<span>⚡<\/span> <span>Download Ready Video \(29\.7s High-Retention MP4\)<\/span>';/g, "dlBtn.innerHTML = '<span>⚡</span> <span>Download Reel #2: Nvidia Master (75.1s MP4)</span>';");

fs.writeFileSync(path.resolve('website/demo/reel-creator.html'), rc, 'utf8');
console.log('✅ reel-creator.html updated with full Nvidia pre-story and Cueva scenes');
