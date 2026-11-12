const fs = require('fs');
const p = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/demo/reel-creator.html';
let html = fs.readFileSync(p, 'utf8');

const target = '<!-- 🎬 PROMINENT PLAY/PAUSE OVERLAY OVER VIDEO STAGE -->';
const switcher = `<!-- 🎛️ REEL 1 vs REEL 2 PRIMARY SWITCHER -->
    <div style="background:linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95));border:1.5px solid rgba(245,158,11,0.5);border-radius:12px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;box-shadow:0 8px 24px rgba(0,0,0,0.6)">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:20px">🎬</span>
        <div>
          <div style="font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:800;color:#f8fafc;letter-spacing:0.04em;text-transform:uppercase">Choose Active Reel to Play:</div>
          <div style="font-size:11px;color:#94a3b8">Switch videos instantly on the canvas or open dedicated player</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button type="button" id="tabReel1" onclick="switchActiveReel(1)" style="background:rgba(245,158,11,0.25);border:1.5px solid #f59e0b;color:#fbbf24;font-size:12.5px;font-weight:800;padding:8px 14px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.18s">
          <span>🎬 Reel #1 (89s Story)</span>
        </button>
        <button type="button" id="tabReel2" onclick="switchActiveReel(2)" style="background:rgba(56,189,248,0.15);border:1.5px solid rgba(56,189,248,0.4);color:#7dd3fc;font-size:12.5px;font-weight:800;padding:8px 14px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.18s">
          <span>⚡ Reel #2 (&lt;30s Viral Cut)</span>
        </button>
        <a href="reel2.html" target="_blank" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.18);color:#e2e8f0;font-size:12px;font-weight:700;padding:8px 12px;border-radius:8px;text-decoration:none;display:inline-flex;align-items:center;gap:5px">
          <span>📱 Standalone Player ↗</span>
        </a>
      </div>
    </div>
    
    `;

if (html.includes(target) && !html.includes('<!-- 🎛️ REEL 1 vs REEL 2 PRIMARY SWITCHER -->')) {
  html = html.replace(target, switcher + target);
  fs.writeFileSync(p, html, 'utf8');
  console.log('Inserted Reel Switcher above play overlay successfully!');
} else {
  console.log('Already inserted or target not found');
}
