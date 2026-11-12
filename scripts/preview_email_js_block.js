// scripts/preview_email_js_block.js
const fs = require('fs');
const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const startIdx = content.indexOf('window.openGmailConnectModal = function()');
const endIdx = content.indexOf('window.copyCustomEmailBody = function()');

console.log('Block length:', endIdx - startIdx);
fs.writeFileSync('scripts/old_email_js_block.txt', content.slice(startIdx, endIdx), 'utf8');
console.log('Saved to scripts/old_email_js_block.txt');
