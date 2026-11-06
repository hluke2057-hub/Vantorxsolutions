const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace('“How much is a haircut?”', '“How much is a 16-SEER AC replacement?”');
content = content.replace('“Do you take walk-ins?”', '“Do you offer 24/7 emergency dispatch?”');
fs.writeFileSync('index.html', content, 'utf8');
console.log('Successfully updated index.html chat bubbles!');
