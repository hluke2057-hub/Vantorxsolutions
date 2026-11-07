const fs = require('fs');
const html = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const idx = html.indexOf('<div id="tabNoWebsite"');
console.log(html.substring(idx, idx + 1000));
