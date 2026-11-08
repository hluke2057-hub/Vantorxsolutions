const fs = require('fs');
const html = fs.readFileSync('website/demo/reel-creator.html', 'utf8');

const sIdx = html.indexOf('<script>');
const eIdx = html.lastIndexOf('</script>');
const script = html.substring(sIdx + 8, eIdx);

const lines = script.split('\n');
console.log('Total lines in script:', lines.length);

// Binary search or line-by-line check
for (let i = 1; i <= lines.length; i++) {
  const chunk = lines.slice(0, i).join('\n');
  try {
    // Wrap in function to see where token error begins
    new Function(chunk + '\n}');
  } catch (err) {
    if (err.message.includes('Invalid or unexpected token') || err.message.includes('Unexpected identifier')) {
      console.log('Error near line', i, ':', err.message);
      console.log('Line content:', lines[i - 1]);
      console.log('Surrounding:');
      console.log(lines.slice(Math.max(0, i - 5), Math.min(lines.length, i + 5)).join('\n'));
      break;
    }
  }
}
