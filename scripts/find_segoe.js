// scripts/find_segoe.js
const fs = require('fs');
const html = fs.readFileSync('scripts/debug.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('Segoe')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});
