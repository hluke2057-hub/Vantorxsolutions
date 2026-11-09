const fs = require('fs');

const content = fs.readFileSync('website/cold-call-arena/florida-no-website.html', 'utf8');
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.lastIndexOf('</script>');
const code = content.substring(scriptStart + 8, scriptEnd);

const lines = code.split('\n');
console.log('Total script lines:', lines.length);

for (let i = 1; i <= lines.length; i++) {
  try {
    new Function(lines.slice(0, i).join('\n'));
  } catch(err) {
    if (!err.message.includes('Unexpected end of input')) {
      console.log('Error at script line:', i);
      console.log('Line content:', lines[i-1]);
      console.log('Prev 3 lines:', lines.slice(Math.max(0, i-4), i-1));
      console.log('Next 3 lines:', lines.slice(i, i+3));
      console.log('Error message:', err.message);
      break;
    }
  }
}
