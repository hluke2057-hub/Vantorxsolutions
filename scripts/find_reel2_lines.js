const fs = require('fs');
const p = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/demo/reel-creator.html';
const lines = fs.readFileSync(p, 'utf8').split('\n');
lines.forEach((l, idx) => {
  if (l.toLowerCase().includes('reel-2') || l.toLowerCase().includes('reel #2') || l.toLowerCase().includes('30s')) {
    console.log(`${idx + 1}: ${l.trim()}`);
  }
});
