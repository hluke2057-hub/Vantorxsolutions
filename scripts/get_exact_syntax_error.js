const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('website/demo/reel-creator.html', 'utf8');
const sIdx = html.indexOf('<script>');
const eIdx = html.lastIndexOf('</script>');
const script = html.substring(sIdx + 8, eIdx);

try {
  new vm.Script(script, { filename: 'reel-script.js' });
  console.log('Script is valid!');
} catch (err) {
  console.error('Error:', err.message);
  console.error(err.stack.split('\n').slice(0, 5).join('\n'));
}
