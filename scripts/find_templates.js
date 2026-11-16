// scripts/find_templates.js
const fs = require('fs');
const src = fs.readFileSync('scripts/render_cinematic_3d_story_reel.js', 'utf8');
const lines = src.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('${') && !l.includes('JSON.stringify') && !l.includes('sceneImages.map') && idx > 50 && idx < 320) {
    console.log((idx+1) + ': ' + l.trim());
  }
});
