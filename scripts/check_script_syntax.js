const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');

// Extract all scripts
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let scriptIdx = 0;

while ((m = scriptRegex.exec(html)) !== null) {
  scriptIdx++;
  const scriptContent = m[1];
  if (!scriptContent.trim()) continue;
  try {
    new vm.Script(scriptContent);
    console.log(`Script ${scriptIdx}: Syntax OK (${scriptContent.length} chars)`);
  } catch(e) {
    console.error(`Script ${scriptIdx} SYNTAX ERROR:`, e.message);
    const lines = scriptContent.split('\n');
    if (e.lineNumber || e.stack) {
      console.log('Error stack:', e.stack);
    }
  }
}
