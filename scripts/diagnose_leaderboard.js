const fs = require('fs');

const content = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');

const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('leaderboard') && (l.includes('function') || l.includes('render') || l.includes('tabLeaderboard') || l.includes('score') || l.includes('podium'))) {
    console.log((i+1) + ': ' + l.trim());
  }
});
