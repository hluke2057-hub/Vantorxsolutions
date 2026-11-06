const fs = require('fs');
const lines = fs.readFileSync('website/demo/reel-creator.html', 'utf8').split('\n');
console.log(lines.slice(2850, 2920).join('\n'));
