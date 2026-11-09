const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const startIdx = content.indexOf('const LEADS_DATA = [');
const endIdx = content.indexOf('];', startIdx);
const sampleBlock = content.slice(startIdx, startIdx + 1500);

console.log('Sample LEADS_DATA start:');
console.log(sampleBlock.slice(0, 1000));
