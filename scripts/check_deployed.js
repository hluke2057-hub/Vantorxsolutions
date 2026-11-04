const https = require('https');

https.get('https://www.vantorxsolutions.com/cold-call-arena/index.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Deployed length:', data.length);
    console.log('Contains syncCallRecordToCloud:', data.includes('syncCallRecordToCloud'));
    console.log('Contains fetchTeamCallsFromCloud:', data.includes('fetchTeamCallsFromCloud'));
    console.log('Contains calculateLeaderboard:', data.includes('calculateLeaderboard'));
    console.log('Contains tabTeamCalls:', data.includes('tabTeamCalls'));
    console.log('Contains Batch 11:', data.includes('fl_sw_11_'));
    const matches = data.match(/"id":\s*"fl_/g);
    console.log('Total LEADS count:', matches ? matches.length : 0);
  });
}).on('error', (e) => console.error(e));
