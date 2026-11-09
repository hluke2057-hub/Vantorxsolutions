const fs = require('fs');

const content = fs.readFileSync('website/cold-call-arena/florida-no-website.html', 'utf8');
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.lastIndexOf('</script>');
const code = content.substring(scriptStart + 8, scriptEnd);

try {
  new Function(code);
  console.log('🎉 FULL SCRIPT SYNTAX IS 100% VALID AND COMPILING WITH ZERO ERRORS!');
} catch (e) {
  console.error('Syntax error in full script:', e.message);
}
