const fs = require('fs');

let html = fs.readFileSync('website/cold-call-arena/florida-no-website.html', 'utf8');
if (html.includes(']];\r\nlet LEADS = window.FLORIDA_100_NO_WEBSITE_LEADS;')) {
  html = html.replace(']];\r\nlet LEADS = window.FLORIDA_100_NO_WEBSITE_LEADS;', '];\r\nlet LEADS = window.FLORIDA_100_NO_WEBSITE_LEADS;');
  fs.writeFileSync('website/cold-call-arena/florida-no-website.html', html, 'utf8');
  console.log('Fixed double bracket in CRLF!');
} else if (html.includes(']];\nlet LEADS = window.FLORIDA_100_NO_WEBSITE_LEADS;')) {
  html = html.replace(']];\nlet LEADS = window.FLORIDA_100_NO_WEBSITE_LEADS;', '];\nlet LEADS = window.FLORIDA_100_NO_WEBSITE_LEADS;');
  fs.writeFileSync('website/cold-call-arena/florida-no-website.html', html, 'utf8');
  console.log('Fixed double bracket in LF!');
} else {
  console.log('Pattern not found, inspecting...');
}
