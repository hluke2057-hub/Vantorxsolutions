// scripts/fix_fonts.js
const fs = require('fs');
let src = fs.readFileSync('scripts/render_nvidia_3d_reel.js', 'utf8');

// Replace any broken font strings like "px "Segoe UI", Arial, sans-serif"
src = src.split('"Segoe UI", Arial, sans-serif').join("'Segoe UI', Arial, sans-serif");
src = src.split('\\"Segoe UI\\", Arial, sans-serif').join("'Segoe UI', Arial, sans-serif");

// Also check if any font assignments have syntax issues
// e.g. ctx.font = "900 " + Math.round(...) + 'px \'Segoe UI\', Arial, sans-serif';
fs.writeFileSync('scripts/render_nvidia_3d_reel.js', src, 'utf8');
console.log('Fixed font strings in scripts/render_nvidia_3d_reel.js');
