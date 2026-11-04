const fs = require('fs');

const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');

function showSection(name, startPattern, length = 1500) {
  const idx = content.indexOf(startPattern);
  console.log(`\n=== SECTION: ${name} ===`);
  if (idx !== -1) {
    console.log(content.slice(idx, idx + length));
  } else {
    console.log('NOT FOUND: ' + startPattern);
  }
}

showSection('filterTeamCallLogs & renderTeamCallLogsTab', 'window.filterTeamCallLogs = function');
showSection('calculateLeaderboard', 'function calculateLeaderboard');
showSection('renderLeaderboardTab', 'function renderLeaderboardTab');
