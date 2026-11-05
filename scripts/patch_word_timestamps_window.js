// scripts/patch_word_timestamps_window.js
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('website/demo/reel-creator.html');
let content = fs.readFileSync(targetPath, 'utf8');

content = content.replace(
  '"duration": 0.627\r\n  }\r\n];',
  '"duration": 0.627\r\n  }\r\n];\r\nwindow.WORD_TIMESTAMPS = WORD_TIMESTAMPS;'
);
if (!content.includes('window.WORD_TIMESTAMPS = WORD_TIMESTAMPS;')) {
  content = content.replace(
    '"duration": 0.627\n  }\n];',
    '"duration": 0.627\n  }\n];\nwindow.WORD_TIMESTAMPS = WORD_TIMESTAMPS;'
  );
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✓ Attached WORD_TIMESTAMPS to window.');
