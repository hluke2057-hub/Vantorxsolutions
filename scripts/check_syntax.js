// scripts/check_syntax.js
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('scripts/debug.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.log('No script found');
  process.exit(1);
}

const jsCode = scriptMatch[1];
try {
  new vm.Script(jsCode);
  console.log('Script syntax is valid!');
} catch (e) {
  console.error('Syntax error in script:');
  console.error(e);
}
