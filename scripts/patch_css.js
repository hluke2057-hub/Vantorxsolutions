const fs = require('fs');
let html = fs.readFileSync('website/demo/reel-creator.html', 'utf8');

const targetStart = '  /* Big Interactive Play Overlay over Canvas */';
const targetEnd = '/* Studio Workspace */';

const idxStart = html.indexOf(targetStart);
const idxEnd = html.indexOf(targetEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  const replacement = `  /* Taskless Interactive Play Overlay - Zero Blur on Poster Card */
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
    background: rgba(6, 3, 12, 0.72);
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
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    color: #e2e8f0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  }

`;
  html = html.slice(0, idxStart) + replacement + html.slice(idxEnd);
  fs.writeFileSync('website/demo/reel-creator.html', html, 'utf8');
  console.log('SUCCESS: Replaced overlay CSS perfectly!');
} else {
  console.log('FAIL: Markers not found', { idxStart, idxEnd });
}
