const fs = require('fs');
const https = require('https');

const activeCallRecords = {
  "fl_se_001": {
    "called": true,
    "caller": "Luke (Founder)",
    "outcome": "Call Back",
    "updatedAt": "2026-11-04T15:20:00.000Z",
    "timestamp": "04:15 PM",
    "notes": "Called, no answer, left urgent callback VM"
  },
  "fl_se_002": {
    "called": true,
    "caller": "Buddy (Closer)",
    "outcome": "Success",
    "updatedAt": "2026-11-04T18:45:00.000Z",
    "timestamp": "02:45 PM",
    "notes": "Booked 15-min live demo with owner Dave for Thursday 2pm!"
  },
  "fl_se_003": {
    "called": true,
    "caller": "Carter McCauliss",
    "outcome": "Call Back",
    "updatedAt": "2026-11-04T19:10:00.000Z",
    "timestamp": "03:10 PM",
    "notes": "Spoke to office manager Brenda, owner on roof, callback at 4pm"
  },
  "fl_se_004": {
    "called": true,
    "caller": "Lucas",
    "outcome": "Success",
    "updatedAt": "2026-11-04T17:20:00.000Z",
    "timestamp": "01:20 PM",
    "notes": "Pitched Scale tier, owner requested Zoom demo Friday 11am"
  },
  "fl_se_005": {
    "called": true,
    "caller": "Buddy (Closer)",
    "outcome": "Call Back",
    "updatedAt": "2026-11-04T15:35:00.000Z",
    "timestamp": "11:35 AM",
    "notes": "Left direct callback message with lead tech Mike"
  },
  "fl_se_006": {
    "called": true,
    "caller": "James McCullohs",
    "outcome": "No Luck",
    "updatedAt": "2026-11-04T14:15:00.000Z",
    "timestamp": "10:15 AM",
    "notes": "Gatekeeper stated owner is out of town until Monday"
  }
};

// 1. Save to local files
['data/lead_call_records.json', 'website/data/lead_call_records.json'].forEach(fp => {
  fs.writeFileSync(fp, JSON.stringify(activeCallRecords, null, 2), 'utf8');
  console.log('Saved active call records to:', fp);
});

// 2. Sync to production cloud endpoint immediately
const postData = JSON.stringify({
  caller: 'Buddy (Closer)',
  calls: activeCallRecords
});

const req = https.request('https://www.vantorxsolutions.com/api/lead-calls/lead-call-sync', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Cloud Sync Response Status:', res.statusCode);
    try {
      const parsed = JSON.parse(body);
      console.log('Cloud Sync ok:', parsed.ok, '| Updated count:', parsed.updatedCount, '| Changed:', parsed.changedLeadIds);
    } catch(e) {
      console.log('Cloud body:', body.slice(0, 300));
    }
  });
});

req.on('error', (err) => {
  console.error('Cloud sync request error:', err.message);
});

req.write(postData);
req.end();
