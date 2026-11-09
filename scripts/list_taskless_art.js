const fs = require('fs');
const path = require('path');
const artDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

const files = fs.readdirSync(artDir).filter(f => f.startsWith('taskless_'));
files.forEach(f => {
  const stat = fs.statSync(path.join(artDir, f));
  console.log(f, stat.size, 'bytes');
});
