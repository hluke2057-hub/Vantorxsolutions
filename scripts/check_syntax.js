const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];

console.log('Found scripts:', scripts.length);
scripts.forEach((s, idx) => {
  try {
    new vm.Script(s[1], { filename: `script_${idx}.js` });
    console.log(`Script ${idx}: OK`);
  } catch(e) {
    console.log(`Script ${idx} FAILED:`, e.message);
    const lineNum = e.stack.match(/script_\d+\.js:(\d+)/);
    if (lineNum) {
      const ln = parseInt(lineNum[1], 10);
      const lines = s[1].split('\n');
      console.log('Error context:');
      for (let i = Math.max(0, ln - 4); i < Math.min(lines.length, ln + 3); i++) {
        console.log(`${i + 1}: ${lines[i]}`);
      }
    }
  }
});
