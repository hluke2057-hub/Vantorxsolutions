const https = require('https');

https.get('https://www.vantorxsolutions.com/cold-call-arena/index.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Deployed length:', data.length);
    console.log('Contains batch11_:', data.includes('batch11_'));
    console.log('Contains Buddy (Closer):', data.includes('Buddy (Closer)'));
    console.log('Contains uploadAllCallsToCloud:', data.includes('uploadAllCallsToCloud'));
    console.log('Contains calculateLeaderboard:', data.includes('calculateLeaderboard'));
    console.log('Contains teamLogBadgeBuddy:', data.includes('teamLogBadgeBuddy'));
    console.log('Contains countCalledBuddy:', data.includes('countCalledBuddy'));
  });
}).on('error', console.error);
