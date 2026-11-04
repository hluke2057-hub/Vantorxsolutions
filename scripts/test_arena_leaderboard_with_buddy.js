const fs = require('fs');

const arenaHtml = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');

// Extract calculateLeaderboard function
const fnStart = arenaHtml.indexOf('window.calculateLeaderboard = function() {');
const fnEnd = arenaHtml.indexOf('window.renderLeaderboardUI = function() {');
const fnCode = arenaHtml.slice(fnStart, fnEnd);

// Setup simulation environment
const calls = JSON.parse(fs.readFileSync('data/lead_call_records.json', 'utf8'));

const simContext = {
  window: {
    CALL_RECORDS: calls
  },
  USER_PROFILES: {
    luke: { name: 'Luke (Founder)', role: 'Founder & Closer', avatar: '👑', isFounder: true },
    carter_mccauliss: { name: 'Carter McCauliss', role: 'Certified Closer', avatar: '⚔️', isFounder: false },
    lucas: { name: 'Lucas', role: 'Certified Closer', avatar: '🎯', isFounder: false },
    james_mccullohs: { name: 'James McCullohs', role: 'Certified Closer', avatar: '🛡️', isFounder: false },
    buddy: { name: 'Buddy (Closer)', role: 'Certified Closer', avatar: '🤝', isFounder: false }
  }
};

const runSimulation = new Function('window', 'USER_PROFILES', `
  ${fnCode}
  return window.calculateLeaderboard();
`);

const standings = runSimulation(simContext.window, simContext.USER_PROFILES);

console.log('=== LEADERBOARD STANDINGS WITH BUDDY ===');
standings.forEach(s => {
  console.log(`${s.rank}. ${s.medal} ${s.name} (${s.avatar}) | Points: ${s.points} | Calls: ${s.calls} | Demos: ${s.demos} | CB: ${s.callbacks} | NL: ${s.noLuck}`);
});
