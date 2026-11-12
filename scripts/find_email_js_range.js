// scripts/find_email_js_range.js
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const startIdx = content.indexOf('window.openGmailConnectModal = function()');
const endIdx = content.indexOf('window.copyCustomEmailBody = function()');

console.log('startIdx:', startIdx);
console.log('endIdx:', endIdx);
console.log('Snippet:\n', content.slice(startIdx, startIdx + 400));
