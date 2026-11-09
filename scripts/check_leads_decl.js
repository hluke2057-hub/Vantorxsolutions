const fs = require('fs');

const content = fs.readFileSync('website/cold-call-arena/florida-no-website.html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('let LEADS = window.FLORIDA_100_NO_WEBSITE_LEADS;')) {
    console.log('Found LEADS declaration at line:', i + 1);
    console.log('Lines before:');
    console.log(lines.slice(Math.max(0, i - 10), i + 5).join('\n'));
    break;
  }
}
