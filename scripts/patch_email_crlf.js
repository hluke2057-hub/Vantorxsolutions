// scripts/patch_email_crlf.js
const fs = require('fs');
const path = require('path');
const file = path.resolve('website/cold-call-arena/index.html');
let content = fs.readFileSync(file, 'utf8');

const oldSnip = "const myEmail = localStorage.getItem('vantorx_gmail_user') || 'luke@vantorxsolutions.com';";
const newSnip = "const alias = localStorage.getItem('vantorx_sender_alias') || 'luke';\n    const myEmail = alias === 'ava' ? 'ava@vantorxsolutions.com' : (alias === 'contact' ? 'contact@vantorxsolutions.com' : 'luke@vantorxsolutions.com');";

if (content.includes(oldSnip)) {
  content = content.replace(oldSnip, newSnip);
  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ Successfully patched myEmail logic!');
} else {
  console.log('Old snippet not found:', oldSnip);
}
