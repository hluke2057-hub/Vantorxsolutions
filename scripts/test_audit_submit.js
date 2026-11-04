const https = require('https');

const postData = JSON.stringify({
  name: 'Test Probe',
  email: 'probe@vantorxsolutions.com',
  phone: '555-0199',
  business: 'Test HVAC',
  businessType: 'hvac',
  challenge: 'Testing inquiry submission'
});

const req = https.request('https://www.vantorxsolutions.com/api/audit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', console.error);
req.write(postData);
req.end();
