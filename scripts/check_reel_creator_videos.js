const fs = require('fs');
const p = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/website/demo/reel-creator.html';
const html = fs.readFileSync(p, 'utf8');

const videoTags = html.match(/<video[^>]*>[\s\S]*?<\/video>/gi) || [];
console.log('Video tags found:', videoTags.length);
videoTags.forEach((v, idx) => {
  console.log(`Video #${idx + 1}:`, v.slice(0, 300));
});

const mp4Links = html.match(/href="[^"]*\.mp4[^"]*"/gi) || [];
console.log('MP4 href links:', mp4Links);
