// scripts/fix_textarea_regex_trap.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../website/demo/reel-creator.html');
let content = fs.readFileSync(filePath, 'utf8');

// Clean up the accidental '<textarea id="postIdeaInput"4k)</span>'
content = content.replace(
  /<textarea id="postIdeaInput"4k\)\s*<\/span>/,
  '<span>Roof Storm ($14k)</span>'
);

// Check if there are duplicate textareas
const textareaMatches = content.match(/<textarea id="postIdeaInput"[\s\S]*?<\/textarea>/g);
console.log('Textarea count found:', textareaMatches ? textareaMatches.length : 0);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Cleaned up regex trap');
