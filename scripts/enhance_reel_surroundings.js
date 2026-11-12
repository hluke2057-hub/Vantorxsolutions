const fs = require('fs');
const path = require('path');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const p = path.join(root, 'website/demo/reel-creator.html');
let html = fs.readFileSync(p, 'utf8');

// Patch switchActiveReel to also update Box 1 (Hero Mind Card) & Telemetry Log
const oldSwitchLogic = `    // 5. Update Download Button
    const dlBtn = document.getElementById('btnDownloadPostMp4');
    if (dlBtn) {
      dlBtn.href = meta.videoSrc;
      dlBtn.download = reelNum === 1 ? 'vantorx-speed-to-lead-reel.mp4' : 'vantorx-30s-reel-2.mp4';
      dlBtn.innerHTML = '<span>📥</span> <span>Download ' + (reelNum === 1 ? 'Reel #1 (89s MP4)' : 'Reel #2 (<30s MP4)') + '</span>';
    }
  }`;

const newSwitchLogic = `    // 5. Update Download Button
    const dlBtn = document.getElementById('btnDownloadPostMp4');
    if (dlBtn) {
      dlBtn.href = meta.videoSrc;
      dlBtn.download = reelNum === 1 ? 'vantorx-speed-to-lead-reel.mp4' : 'vantorx-nvidia-reel.mp4';
      dlBtn.innerHTML = '<span>📥</span> <span>Download ' + (reelNum === 1 ? 'Reel #1 (89s MP4)' : 'Reel #2: Nvidia Viral (<28s MP4)') + '</span>';
    }

    // 6. Update Surroundings: Box 1 Story Explanations & Telemetry
    const mindLabel = document.getElementById('giantBtnMindLabel');
    const prodTitle = document.getElementById('giantNextProductTitle');
    const prodScen = document.getElementById('giantNextProductScenario');
    const heroEmoji = document.getElementById('giantHeroEmoji');

    if (reelNum === 2) {
      if (mindLabel) mindLabel.textContent = "🧠 ACTIVE REEL: NVIDIA'S CEO CHEATED (<28s)";
      if (prodTitle) prodTitle.textContent = "⚡ How Jensen Huang Broke The Rules & Saved Nvidia";
      if (prodScen) prodScen.textContent = "1995 Sega $5M Rescue ➔ Nobody is Perfect ➔ AVA 24/7 Voice AI Promotion";
      if (heroEmoji) heroEmoji.textContent = "🧠";
      
      const step1 = document.getElementById('renderStep1');
      const step2 = document.getElementById('renderStep2');
      const step3 = document.getElementById('renderStep3');
      const step4 = document.getElementById('renderStep4');
      const step5 = document.getElementById('renderStep5');
      if (step1) step1.innerHTML = "🎣 Act 1: <strong>'Nvidia\\'s CEO cheated. Let me explain.'</strong> (0s - 3s)";
      if (step2) step2.innerHTML = "🏛️ Act 2: <strong>1995 Sega Boardroom $5M Rescue & Automation Pivot</strong> (3s - 12s)";
      if (step3) step3.innerHTML = "📉 Act 3: <strong>'Nobody\\'s perfect. Your shop loses $8,000 to voicemail.'</strong> (12s - 16s)";
      if (step4) step4.innerHTML = "⚡ Act 4: <strong>Meet AVA: 24/7 Voice AI Answers in 0.8s & Books Jobs</strong> (16s - 27s)";
      if (step5) step5.innerHTML = "✨ Rendered: <strong>1080×1920 30 FPS Cueva Animation + Tactile SFX Ready</strong>";
    } else {
      if (mindLabel) mindLabel.textContent = "🧠 BUTTON MIND: CYCLING 5 PRODUCTS";
      if (prodTitle) prodTitle.textContent = "📞 Ava 24/7 Voice AI Phone Receptionist";
      if (prodScen) prodScen.textContent = "Sunday 98° Heatwave AC Emergency · $9,200 System Save";
      if (heroEmoji) heroEmoji.textContent = "⚡";
      
      const step1 = document.getElementById('renderStep1');
      const step2 = document.getElementById('renderStep2');
      const step3 = document.getElementById('renderStep3');
      const step4 = document.getElementById('renderStep4');
      const step5 = document.getElementById('renderStep5');
      if (step1) step1.innerHTML = "🧠 Step 1: Synthesizing script & high-converting hook...";
      if (step2) step2.innerHTML = "🎙️ Step 2: Calibrating voiceover & millisecond timestamps...";
      if (step3) step3.innerHTML = "🎬 Step 3: Rendering 15 motion scenes & 3D warp FX...";
      if (step4) step4.innerHTML = "⚡ Step 4: Baking Hormozi kinetic typography & captions...";
      if (step5) step5.innerHTML = "✨ Step 5: Finalizing 9:16 master reel & audio sync...";
    }
  }`;

if (html.includes(oldSwitchLogic)) {
  html = html.replace(oldSwitchLogic, newSwitchLogic);
  fs.writeFileSync(p, html, 'utf8');
  console.log('Successfully enhanced switchActiveReel with surrounding explanations in reel-creator.html!');
} else {
  console.log('Could not find oldSwitchLogic to replace.');
}
