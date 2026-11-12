const fs = require('fs');
const p = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/demo/reel-creator.html';
const html = fs.readFileSync(p, 'utf8');

const idx = html.indexOf('studio-workspace');
if (idx !== -1) {
  console.log('Found studio-workspace at index', idx);
  console.log(html.slice(idx - 50, idx + 400));
} else {
  console.log('studio-workspace not found');
}
