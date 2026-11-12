const fs = require('fs');
const p = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/demo/reel-creator.html';
const html = fs.readFileSync(p, 'utf8');

const match = html.indexOf('function selectDailySlot');
if (match !== -1) {
  console.log(html.slice(match, match + 1200));
} else {
  console.log('selectDailySlot not found');
}
