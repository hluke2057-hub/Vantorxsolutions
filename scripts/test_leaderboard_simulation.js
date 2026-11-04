const fs = require('fs');
const path = require('path');

// Simulate a team with calls
const USER_PROFILES = {
  luke: { id: 'luke', name: 'Luke (Founder)', role: 'Founder & Closer', avatar: '👑', isFounder: true },
  carter_mccauliss: { id: 'carter_mccauliss', name: 'Carter McCauliss', role: 'Certified Closer', avatar: '⚔️', isFounder: false },
  lucas: { id: 'lucas', name: 'Lucas', role: 'Certified Closer', avatar: '🎯', isFounder: false },
  james_mccullohs: { id: 'james_mccullohs', name: 'James McCullohs', role: 'Certified Closer', avatar: '⚔️', isFounder: false }
};

// Simulate call records:
// Carter: 5 calls (2 Demos, 1 Callback, 2 No Luck)
// Lucas: 8 calls (1 Demo, 3 Callbacks, 4 No Luck)
// Luke: 12 calls (0 Demos, 4 Callbacks, 8 No Luck)
// James: 2 calls (0 Demos, 0 Callbacks, 2 No Luck)
const CALL_RECORDS = {
  // Carter
  c1: { called: true, caller: 'Carter McCauliss', outcome: 'Success' }, // 1 + 10 = 11
  c2: { called: true, caller: 'Carter McCauliss', outcome: 'Success' }, // 1 + 10 = 11
  c3: { called: true, caller: 'Carter McCauliss', outcome: 'Call Back' }, // 1 + 0.5 = 1.5
  c4: { called: true, caller: 'Carter McCauliss', outcome: 'No Luck' }, // 1 + 0 = 1.0
  c5: { called: true, caller: 'Carter McCauliss', outcome: 'No Luck' }, // 1 + 0 = 1.0
  // Carter total: 5 calls, 2 demos, 1 callback, 2 no luck. Points = (5*1) + (2*10) + (1*0.5) = 25.5 pts

  // Lucas
  l1: { called: true, caller: 'Lucas', outcome: 'Success' }, // 11
  l2: { called: true, caller: 'Lucas', outcome: 'Call Back' }, // 1.5
  l3: { called: true, caller: 'Lucas', outcome: 'Call Back' }, // 1.5
  l4: { called: true, caller: 'Lucas', outcome: 'Call Back' }, // 1.5
  l5: { called: true, caller: 'Lucas', outcome: 'No Luck' }, // 1
  l6: { called: true, caller: 'Lucas', outcome: 'No Luck' }, // 1
  l7: { called: true, caller: 'Lucas', outcome: 'No Luck' }, // 1
  l8: { called: true, caller: 'Lucas', outcome: 'No Luck' }, // 1
  // Lucas total: 8 calls, 1 demo, 3 callbacks, 4 no luck. Points = (8*1) + (1*10) + (3*0.5) = 19.5 pts

  // Luke
  u1: { called: true, caller: 'Luke (Founder)', outcome: 'Call Back' },
  u2: { called: true, caller: 'Luke (Founder)', outcome: 'Call Back' },
  u3: { called: true, caller: 'Luke (Founder)', outcome: 'Call Back' },
  u4: { called: true, caller: 'Luke (Founder)', outcome: 'Call Back' },
  u5: { called: true, caller: 'Luke (Founder)', outcome: 'No Luck' },
  u6: { called: true, caller: 'Luke (Founder)', outcome: 'No Luck' },
  u7: { called: true, caller: 'Luke (Founder)', outcome: 'No Luck' },
  u8: { called: true, caller: 'Luke (Founder)', outcome: 'No Luck' },
  u9: { called: true, caller: 'Luke (Founder)', outcome: 'No Luck' },
  u10: { called: true, caller: 'Luke (Founder)', outcome: 'No Luck' },
  u11: { called: true, caller: 'Luke (Founder)', outcome: 'No Luck' },
  u12: { called: true, caller: 'Luke (Founder)', outcome: 'No Luck' },
  // Luke total: 12 calls, 0 demos, 4 callbacks, 8 no luck. Points = (12*1) + (0*10) + (4*0.5) = 14.0 pts

  // James
  j1: { called: true, caller: 'James McCullohs', outcome: 'No Luck' },
  j2: { called: true, caller: 'James McCullohs', outcome: 'No Luck' }
  // James total: 2 calls, 0 demos, 0 callbacks, 2 no luck. Points = (2*1) = 2.0 pts
};

function calculateLeaderboardSim(profiles, callsObj) {
  const closerMap = {};
  Object.keys(profiles).forEach(k => {
    const u = profiles[k];
    closerMap[k] = {
      id: k,
      name: u.name || k,
      role: u.role || 'Outbound Closer',
      avatar: u.avatar || '⚔️',
      calls: 0,
      demos: 0,
      callbacks: 0,
      noLuck: 0,
      points: 0.0
    };
  });

  for (const [id, rec] of Object.entries(callsObj)) {
    if (!rec || !rec.called) continue;
    const callerStr = (rec.caller || '').toLowerCase();
    let assignedId = null;

    if (callerStr.includes('carter')) assignedId = 'carter_mccauliss';
    else if (callerStr.includes('lucas')) assignedId = 'lucas';
    else if (callerStr.includes('luke')) assignedId = 'luke';
    else if (callerStr.includes('james')) assignedId = 'james_mccullohs';

    if (assignedId && closerMap[assignedId]) {
      const c = closerMap[assignedId];
      c.calls += 1;
      if (rec.outcome === 'Success' || rec.outcome === 'Booked Demo') c.demos += 1;
      else if (rec.outcome === 'Call Back' || rec.outcome === 'Callback Scheduled') c.callbacks += 1;
      else c.noLuck += 1;
    }
  }

  const list = Object.values(closerMap).map(c => {
    const pts = (c.calls * 1.0) + (c.demos * 10.0) + (c.callbacks * 0.5);
    c.points = parseFloat(pts.toFixed(1));
    return c;
  });

  list.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.calls !== a.calls) return b.calls - a.calls;
    return b.demos - a.demos;
  });

  list.forEach((c, idx) => {
    c.rank = idx + 1;
    if (idx === 0) { c.medal = '🥇'; c.medalTier = 'Gold'; }
    else if (idx === 1) { c.medal = '🥈'; c.medalTier = 'Silver'; }
    else if (idx === 2) { c.medal = '🥉'; c.medalTier = 'Bronze'; }
    else { c.medal = `#${idx + 1}`; c.medalTier = 'Contender'; }
  });

  return list;
}

const leaderboard = calculateLeaderboardSim(USER_PROFILES, CALL_RECORDS);
console.log('--- LEADERBOARD SIMULATION RESULTS ---');
leaderboard.forEach(r => {
  console.log(`${r.medal} Rank ${r.rank} [${r.medalTier}]: ${r.name} -> Points: ${r.points} | Total Calls: ${r.calls} (Demos: ${r.demos}, Callbacks: ${r.callbacks}, No Luck: ${r.noLuck})`);
});

// Assertions
if (leaderboard[0].id === 'carter_mccauliss' && leaderboard[0].points === 25.5 && leaderboard[0].medal === '🥇') {
  console.log('✅ Gold Leader correctly assigned to Carter McCauliss (25.5 pts)');
} else {
  console.error('❌ Gold Leader failed');
}

if (leaderboard[1].id === 'lucas' && leaderboard[1].points === 19.5 && leaderboard[1].medal === '🥈') {
  console.log('✅ Silver Podium correctly assigned to Lucas (19.5 pts)');
} else {
  console.error('❌ Silver Podium failed');
}

if (leaderboard[2].id === 'luke' && leaderboard[2].points === 14.0 && leaderboard[2].medal === '🥉') {
  console.log('✅ Bronze Podium correctly assigned to Luke (14.0 pts)');
} else {
  console.error('❌ Bronze Podium failed');
}

if (leaderboard[3].id === 'james_mccullohs' && leaderboard[3].points === 2.0) {
  console.log('✅ Rank #4 correctly assigned to James McCullohs (2.0 pts)');
} else {
  console.error('❌ Rank 4 failed');
}
