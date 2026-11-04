const https = require('https');

// Test if we can call any RPCs or check schema
const postData = JSON.stringify({});

const req = https.request('https://www.vantorxsolutions.com/api/audit?action=scan-emails', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('scan-emails response:', body.slice(0, 500));
  });
});
req.on('error', console.error);
req.end();
