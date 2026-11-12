// scripts/patch_email_template_sender.js
const fs = require('fs');
const path = require('path');

const filePath = path.resolve('website/cold-call-arena/index.html');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `    const callerName = activeCaller || 'Luke Hamilton';
    const myEmail = localStorage.getItem('vantorx_gmail_user') || 'luke@vantorxsolutions.com';`;

const replacementStr = `    const callerName = activeCaller || 'Luke Hamilton';
    const alias = localStorage.getItem('vantorx_sender_alias') || 'luke';
    const myEmail = alias === 'ava' ? 'ava@vantorxsolutions.com' : (alias === 'contact' ? 'contact@vantorxsolutions.com' : 'luke@vantorxsolutions.com');`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated email template sender logic in index.html!');
} else {
  console.log('Target string not found or already replaced.');
}
