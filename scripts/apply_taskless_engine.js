const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('website/demo/reel-creator.html');
const codeFile = path.resolve('scripts/taskless_engine_code.js');

let html = fs.readFileSync(targetFile, 'utf8');
const newEngineCode = fs.readFileSync(codeFile, 'utf8');

const startMarker = 'function renderFrame(time) {';
const endMarker = '// Animation Loop: Bound Directly to Hardware Audio Clock';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('ERROR: Could not locate markers in reel-creator.html', { startIdx, endIdx });
  process.exit(1);
}

const updatedHtml = html.slice(0, startIdx) + newEngineCode + '\n\n' + html.slice(endIdx);
fs.writeFileSync(targetFile, updatedHtml, 'utf8');
console.log('Successfully injected Taskless 1:1 Engine into reel-creator.html!');
console.log('New file size:', updatedHtml.length);
