const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../website/demo/reel-creator.html');
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/<span>Roof Storm \(\s*<span>Roof Storm \(\$14k\)<\/span>/g, '<span>Roof Storm ($14k)</span>');
fs.writeFileSync(file, c, 'utf8');
console.log('Fixed Roof button text');
