// scripts/find_templates.js
const fs = require('fs');
const src = fs.readFileSync('scripts/render_nvidia_3d_reel.js', 'utf8');
const lines = src.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('${') && !l.includes('JSON.stringify') && idx > 41) {
    console.log((idx+1) + ': ' + l.trim());
  }
});
