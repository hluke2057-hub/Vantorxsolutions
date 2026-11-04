const fs = require('fs');
const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const lines = content.split('\n');
const targets = [
  'switchTab =',
  'function switchTab',
  'updateQuotaHUD',
  'updateUserUI',
  'renderTeamCallsTable',
  'renderLeadsTable',
  'selectCallLogOutcome',
  'saveCallLogModal',
  'calculateLeaderboard',
  'empCountSweet',
  'currentEmpFilter',
  'currentUser'
];

targets.forEach(t => {
  lines.forEach((line, idx) => {
    if (line.includes(t)) {
      console.log('Line ' + (idx + 1) + ': ' + line.trim().slice(0, 100));
    }
  });
});
