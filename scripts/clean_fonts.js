// scripts/clean_fonts.js
const fs = require('fs');
let src = fs.readFileSync('scripts/render_nvidia_3d_reel.js', 'utf8');

src = src.split("'Segoe UI', Arial, sans-serif").join('Arial, sans-serif');
src = src.split('"Segoe UI", Arial, sans-serif').join('Arial, sans-serif');
src = src.split('\'Segoe UI\', Arial, sans-serif').join('Arial, sans-serif');
src = src.split('\\"Segoe UI\\", Arial, sans-serif').join('Arial, sans-serif');

fs.writeFileSync('scripts/render_nvidia_3d_reel.js', src, 'utf8');
console.log('Cleaned all font strings to Arial, sans-serif');
