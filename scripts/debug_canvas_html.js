const fs = require('fs');
const content = fs.readFileSync('website/demo/reel-creator.html', 'utf8');
const idx = content.indexOf('<canvas id="reelCanvas"');
console.log('--- 1000 CHARS BEFORE CANVAS ---');
console.log(content.slice(Math.max(0, idx - 1000), idx));
