const fs = require('fs');
const p = 'website/demo/reel-creator.html';
let h = fs.readFileSync(p, 'utf8');
if (!h.includes('vantorx-30s-reel-2.mp4')) {
  h = h.replace(
    /<a href="video\/vantorx-speed-to-lead-reel\.mp4\?v=8912" download="vantorx-speed-to-lead-reel\.mp4"[\s\S]*?<\/a>\s*<a href="video\/vantorx-speed-to-lead-reel\.mp4\?v=8912" target="_blank"[\s\S]*?<\/a>/,
    `<a href="video/vantorx-speed-to-lead-reel.mp4?v=8912" download="vantorx-speed-to-lead-reel.mp4" style="background:#f59e0b;color:#0b0f19;font-weight:800;font-size:13.5px;padding:11px 22px;border-radius:8px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(245,158,11,0.4)"><span>📥</span> <span>Download Reel #1 (89s MP4)</span></a>
    <a href="video/vantorx-30s-reel-2.mp4?v=3001" download="vantorx-30s-reel-2.mp4" style="background:linear-gradient(135deg,#38bdf8,#0ea5e9);color:#04121d;font-weight:800;font-size:13.5px;padding:11px 20px;border-radius:8px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(56,189,248,0.4)"><span>⚡</span> <span>Download NEW Reel #2 (&lt;30s MP4)</span></a>
    <a href="video/vantorx-30s-reel-2.mp4?v=3001" target="_blank" style="color:#7dd3fc;font-size:12.5px;text-decoration:none;font-weight:600;padding:9px 14px;border:1px solid rgba(56,189,248,0.4);border-radius:8px">Preview Reel #2 (29.7s) ↗</a>`
  );
  h = h.replace(
    /<span>📦<\/span>\s*<span>Download All 15 IG Pictures \(\.ZIP\)<\/span>/,
    '<span>📦</span> <span>Download IG Highlights + 8 Clean Covers (.ZIP)</span>'
  );
  h = h.replace(
    /📱 Open 15 IG Pictures Gallery ↗/,
    '📱 Open Clean Covers &amp; Highlights ↗'
  );
  fs.writeFileSync(p, h, 'utf8');
  console.log('Successfully wired Reel #2 + 8 Clean Covers links in reel-creator.html!');
} else {
  console.log('reel-creator.html already has Reel #2 links.');
}
