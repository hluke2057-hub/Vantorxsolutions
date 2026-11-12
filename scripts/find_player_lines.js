const fs = require('fs');
const p = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/demo/reel-creator.html';
const lines = fs.readFileSync(p, 'utf8').split('\n');
lines.forEach((l, idx) => {
  if (l.includes('masterMp4Player') || l.includes('reelCanvas') || l.includes('playReel(') || l.includes('btnPlayMasterMp4') || l.includes('id="playerSection"') || l.includes('id="phonePreview"')) {
    console.log((idx + 1) + ': ' + l.trim());
  }
});
