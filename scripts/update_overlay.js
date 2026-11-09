const fs = require('fs');
let html = fs.readFileSync('website/demo/reel-creator.html', 'utf8');

// Normalize CRLF to LF for reliable replacements
html = html.replace(/\r\n/g, '\n');

// 1. Taskless styling for .reel-play-overlay
const oldOverlayCss = `  /* Big Interactive Play Overlay over Canvas */
  .reel-play-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(5, 8, 15, 0.72);
    backdrop-filter: blur(5px);
    z-index: 12;
    cursor: pointer;
    transition: all 0.25s ease;
    user-select: none;
    text-align: center;
    padding: 24px;
    box-sizing: border-box;
  }
  .reel-play-overlay:hover .reel-play-circle {
    transform: scale(1.12);
    box-shadow: 0 0 35px #f59e0b, inset 0 0 15px rgba(245, 158, 11, 0.4);
    border-color: #fbbf24;
  }
  .reel-play-circle {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95));
    border: 3px solid #ffffff;
    box-shadow: 0 0 25px rgba(245, 158, 11, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 16px;
    transition: all 0.25s ease;
  }
  .reel-play-pulse-ring {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid #f59e0b;
    animation: pulseRing 1.8s infinite;
  }
  @keyframes pulseRing {
    0% { transform: scale(0.95); opacity: 0.9; }
    50% { transform: scale(1.2); opacity: 0.3; }
    100% { transform: scale(1.35); opacity: 0; }
  }
  .reel-play-triangle {
    font-size: 32px;
    color: #070a0f;
    margin-left: 5px;
  }
  .reel-play-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 20px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.04em;
    margin-bottom: 6px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
  }
  .reel-play-sub {
    font-size: 12.5px;
    color: #fbbf24;
    font-weight: 700;
    max-width: 300px;
    line-height: 1.45;
    margin-bottom: 14px;
  }
  .reel-play-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
  }`;

const newOverlayCss = `  /* Taskless Interactive Play Overlay - Zero Blur on Poster Card */
  .reel-play-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: transparent;
    backdrop-filter: none;
    z-index: 12;
    cursor: pointer;
    transition: all 0.25s ease;
    user-select: none;
    text-align: center;
    padding: 24px;
    box-sizing: border-box;
  }
  .reel-play-overlay.mid-pause {
    background: rgba(6, 3, 12, 0.65);
    backdrop-filter: blur(4px);
  }
  .reel-play-overlay:hover .reel-play-circle {
    transform: scale(1.12);
    box-shadow: 0 0 35px #c8ff00, 0 0 50px rgba(168, 85, 247, 0.5);
    border-color: #ffffff;
  }
  .reel-play-circle {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c8ff00, #a3e635);
    border: 3px solid #ffffff;
    box-shadow: 0 0 30px rgba(200, 255, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 14px;
    transition: all 0.25s ease;
  }
  .reel-play-pulse-ring {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid #a855f7;
    animation: pulseRing 1.8s infinite;
  }
  @keyframes pulseRing {
    0% { transform: scale(0.95); opacity: 0.9; }
    50% { transform: scale(1.25); opacity: 0.35; }
    100% { transform: scale(1.4); opacity: 0; }
  }
  .reel-play-triangle {
    font-size: 28px;
    color: #06030c;
    margin-left: 4px;
  }
  .reel-play-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 19px;
    font-weight: 900;
    font-style: italic;
    color: #ffffff;
    letter-spacing: 0.04em;
    margin-bottom: 6px;
    text-shadow: 0 2px 12px rgba(0,0,0,0.9);
  }
  .reel-play-sub {
    font-size: 12px;
    color: #c8ff00;
    font-weight: 700;
    max-width: 320px;
    line-height: 1.45;
    margin-bottom: 12px;
    text-shadow: 0 1px 8px rgba(0,0,0,0.8);
  }
  .reel-play-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(16, 8, 34, 0.85);
    border: 1px solid rgba(168, 85, 247, 0.4);
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    color: #e2e8f0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  }`;

if (html.includes(oldOverlayCss)) {
  html = html.replace(oldOverlayCss, newOverlayCss);
  console.log('PASS: Replaced overlay CSS');
} else {
  console.log('WARN: oldOverlayCss not found');
}

// 2. Add window.seekTo and support window.__manualTime in loop
const oldLoopTail = `  window.currentTime = currentTime;
  window.isPlaying = isPlaying;

  renderFrame(currentTime);
  animationFrameId = requestAnimationFrame(loop);`;

const newLoopTail = `  if (!isPlaying && typeof window.__manualTime === 'number') {
    currentTime = window.__manualTime;
    window.currentTime = currentTime;
    window.__manualTime = null;
  }

  window.currentTime = currentTime;
  window.isPlaying = isPlaying;
  window.seekTo = function(t) {
    currentTime = Math.max(0, Math.min(TOTAL_DURATION || 63, Number(t) || 0));
    window.currentTime = currentTime;
    resetSfxFlags();
    updateUI();
    renderFrame(currentTime);
  };

  renderFrame(currentTime);
  animationFrameId = requestAnimationFrame(loop);`;

if (html.includes(oldLoopTail)) {
  html = html.replace(oldLoopTail, newLoopTail);
  console.log('PASS: Added window.seekTo and __manualTime to loop');
} else {
  console.log('WARN: oldLoopTail not found');
}

// 3. Update updateUI overlay visibility
const oldOverlayToggle = `    const playOverlay = document.getElementById('reelPlayOverlay');
    if (playOverlay) {
      if (isPlaying && playOverlay.style.display !== 'none') playOverlay.style.display = 'none';
      else if (!isPlaying && playOverlay.style.display !== 'flex') playOverlay.style.display = 'flex';
    }`;

const newOverlayToggle = `    const playOverlay = document.getElementById('reelPlayOverlay');
    if (playOverlay) {
      if (isPlaying) {
        if (playOverlay.style.display !== 'none') playOverlay.style.display = 'none';
      } else {
        if (playOverlay.style.display !== 'flex') playOverlay.style.display = 'flex';
        const playCircle = playOverlay.querySelector('.reel-play-circle');
        const playTitle = playOverlay.querySelector('.reel-play-title');
        const playSub = playOverlay.querySelector('.reel-play-sub');
        const playBadge = playOverlay.querySelector('.reel-play-badge');
        if (currentTime <= 0.05) {
          playOverlay.classList.remove('mid-pause');
          if (playCircle) playCircle.style.display = 'none';
          if (playTitle) playTitle.style.display = 'none';
          if (playSub) playSub.style.display = 'none';
          if (playBadge) playBadge.style.display = 'none';
        } else {
          playOverlay.classList.add('mid-pause');
          if (playCircle) playCircle.style.display = 'flex';
          if (playTitle) playTitle.style.display = 'block';
          if (playSub) playSub.style.display = 'block';
          if (playBadge) playBadge.style.display = 'inline-flex';
        }
      }
    }`;

if (html.includes(oldOverlayToggle)) {
  html = html.replace(oldOverlayToggle, newOverlayToggle);
  console.log('PASS: Updated updateUI overlay logic');
} else {
  console.log('WARN: oldOverlayToggle not found');
}

fs.writeFileSync('website/demo/reel-creator.html', html, 'utf8');
console.log('DONE!');
