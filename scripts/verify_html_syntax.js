const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');

// Extract script tags
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;
let errors = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  scriptIndex++;
  const scriptContent = match[1];
  // Skip external scripts with src attribute
  if (!scriptContent.trim()) continue;

  try {
    new vm.Script(scriptContent, { filename: `inline_script_${scriptIndex}.js` });
    console.log(`Script ${scriptIndex}: Syntax OK (${scriptContent.length} chars)`);
  } catch (e) {
    errors++;
    console.error(`Script ${scriptIndex} ERROR:`, e.message);
    if (e.stack) {
      const lines = e.stack.split('\n').slice(0, 5).join('\n');
      console.error(lines);
    }
  }
}

if (errors === 0) {
  console.log('ALL INLINE SCRIPTS PASSED SYNTAX CHECK!');
} else {
  console.error(`FAILED: ${errors} scripts had syntax errors.`);
  process.exit(1);
}
