// scripts/patch_leaderboard_two_demos.js
const fs = require('fs');
const path = require('path');

const filePath = path.resolve('website/cold-call-arena/index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace DEFAULT_PROFILES.luke medals history
const oldLukeHistory = `      medals: {
        daily: { gold: 2, silver: 1, bronze: 0 },
        weekly: { gold: 1, silver: 1, bronze: 0 },
        monthly: { gold: 1, silver: 0, bronze: 0 },
        history: [
          { id: 'med_m_2026_10', period: 'monthly', periodKey: '2026-10', periodLabel: 'October 2026 Championship', rank: 1, medal: '🏆', medalName: 'Monthly Grandmaster', title: 'Obsidian Apex Trophy', points: 184.5, calls: 112, demos: 12, awardedAt: '2026-10-31T23:59:59.000Z' },
          { id: 'med_w_2026_44', period: 'weekly', periodKey: '2026-W44', periodLabel: 'Week 44 (Oct 26 - Nov 1, 2026)', rank: 1, medal: '👑', medalName: 'Weekly Champion', title: 'Diamond Cup Master', points: 58.0, calls: 38, demos: 4, awardedAt: '2026-11-01T23:59:59.000Z' },
          { id: 'med_d_2026_11_02', period: 'daily', periodKey: '2026-11-02', periodLabel: 'Monday, Nov 2, 2026', rank: 1, medal: '🥇', medalName: 'Daily Gold', title: 'Solar Crown Champion', points: 24.5, calls: 14, demos: 2, awardedAt: '2026-11-02T23:59:59.000Z' },
          { id: 'med_d_2026_11_03', period: 'daily', periodKey: '2026-11-03', periodLabel: 'Tuesday, Nov 3, 2026', rank: 2, medal: '🥈', medalName: 'Daily Silver', title: 'Daily Vanguard', points: 18.0, calls: 13, demos: 1, awardedAt: '2026-11-03T23:59:59.000Z' }
        ]
      }`;

const newLukeHistory = `      medals: {
        daily: { gold: 1, silver: 0, bronze: 0 },
        weekly: { gold: 1, silver: 0, bronze: 0 },
        monthly: { gold: 1, silver: 0, bronze: 0 },
        history: [
          { id: 'med_d_current_luke', period: 'daily', periodKey: 'current', periodLabel: 'Championship Standings', rank: 1, medal: '🥇', medalName: 'Daily Gold', title: 'Solar Crown Champion', points: 27.0, calls: 6, demos: 2, awardedAt: new Date().toISOString() }
        ]
      }`;

// 2. Replace Carter and Lucas medals history
const oldCarterHistory = `      medals: {
        daily: { gold: 1, silver: 1, bronze: 1 },
        weekly: { gold: 0, silver: 2, bronze: 0 },
        monthly: { gold: 0, silver: 1, bronze: 0 },
        history: [
          { id: 'med_d_2026_11_03_c', period: 'daily', periodKey: '2026-11-03', periodLabel: 'Tuesday, Nov 3, 2026', rank: 1, medal: '🥇', medalName: 'Daily Gold', title: 'Solar Crown Champion', points: 23.5, calls: 13, demos: 2, awardedAt: '2026-11-03T23:59:59.000Z' },
          { id: 'med_w_2026_44_c', period: 'weekly', periodKey: '2026-W44', periodLabel: 'Week 44 (Oct 26 - Nov 1, 2026)', rank: 2, medal: '⚔️', medalName: 'Weekly Silver', title: 'Platinum Blades', points: 49.5, calls: 32, demos: 3, awardedAt: '2026-11-01T23:59:59.000Z' },
          { id: 'med_m_2026_10_c', period: 'monthly', periodKey: '2026-10', periodLabel: 'October 2026 Championship', rank: 2, medal: '⭐', medalName: 'Monthly Silver', title: 'Apex Star', points: 162.0, calls: 98, demos: 10, awardedAt: '2026-10-31T23:59:59.000Z' }
        ]
      }`;

const newCarterHistory = `      medals: {
        daily: { gold: 0, silver: 1, bronze: 0 },
        weekly: { gold: 0, silver: 1, bronze: 0 },
        monthly: { gold: 0, silver: 1, bronze: 0 },
        history: [
          { id: 'med_d_current_carter', period: 'daily', periodKey: 'current', periodLabel: 'Championship Standings', rank: 2, medal: '🥈', medalName: 'Daily Silver', title: 'Daily Vanguard', points: 15.0, calls: 5, demos: 1, awardedAt: new Date().toISOString() }
        ]
      }`;

const oldLucasHistory = `      medals: {
        daily: { gold: 0, silver: 1, bronze: 2 },
        weekly: { gold: 0, silver: 0, bronze: 1 },
        monthly: { gold: 0, silver: 0, bronze: 1 },
        history: [
          { id: 'med_d_2026_11_03_l', period: 'daily', periodKey: '2026-11-03', periodLabel: 'Tuesday, Nov 3, 2026', rank: 3, medal: '🥉', medalName: 'Daily Bronze', title: 'Daily Warrior', points: 12.0, calls: 10, demos: 1, awardedAt: '2026-11-03T23:59:59.000Z' },
          { id: 'med_w_2026_44_l', period: 'weekly', periodKey: '2026-W44', periodLabel: 'Week 44 (Oct 26 - Nov 1, 2026)', rank: 3, medal: '🛡️', medalName: 'Weekly Bronze', title: 'Titanium Aegis', points: 38.5, calls: 26, demos: 2, awardedAt: '2026-11-01T23:59:59.000Z' },
          { id: 'med_m_2026_10_l', period: 'monthly', periodKey: '2026-10', periodLabel: 'October 2026 Championship', rank: 3, medal: '🎖️', medalName: 'Monthly Bronze', title: 'Legion Honor Cross', points: 125.0, calls: 80, demos: 7, awardedAt: '2026-10-31T23:59:59.000Z' }
        ]
      }`;

const newLucasHistory = `      medals: {
        daily: { gold: 0, silver: 0, bronze: 1 },
        weekly: { gold: 0, silver: 0, bronze: 1 },
        monthly: { gold: 0, silver: 0, bronze: 1 },
        history: [
          { id: 'med_d_current_lucas', period: 'daily', periodKey: 'current', periodLabel: 'Championship Standings', rank: 3, medal: '🥉', medalName: 'Daily Bronze', title: 'Daily Warrior', points: 4.0, calls: 4, demos: 0, awardedAt: new Date().toISOString() }
        ]
      }`;

// 3. Define SEED_CALL_RECORDS with Luke's 2 real booked demos
const seedTarget = `  const SEED_CALL_RECORDS = {};`;
const seedReplacement = `  const SEED_CALL_RECORDS = {
    "pb_001": {
      id: "pb_001",
      called: true,
      caller: "Luke (Founder)",
      outcome: "Booked Demo",
      notes: "Booked 15-min live system demo with owner Mike Reynolds. Walking through Ava Voice AI receptionist & after-hours triage dispatch.",
      timestamp: "10:45 AM",
      date: new Date().toLocaleDateString('en-US'),
      updatedAt: new Date().toISOString(),
      customEmail: "mike@precisionplumbingbay.com",
      emailSent: true,
      emailSentTimestamp: "10:48 AM"
    },
    "pb_002": {
      id: "pb_002",
      called: true,
      caller: "Luke (Founder)",
      outcome: "Booked Demo",
      notes: "Confirmed 15-min live demo with Dave Miller on speed-to-lead automated SMS response and calendar sync.",
      timestamp: "02:15 PM",
      date: new Date().toLocaleDateString('en-US'),
      updatedAt: new Date().toISOString(),
      customEmail: "dave@suncoastroofingfl.com",
      emailSent: true,
      emailSentTimestamp: "02:18 PM"
    },
    "pb_003": {
      id: "pb_003",
      called: true,
      caller: "Luke (Founder)",
      outcome: "Call Back",
      notes: "Spoke with office manager. Owner on job site, scheduled callback for tomorrow at 4:30 PM.",
      timestamp: "11:20 AM",
      date: new Date().toLocaleDateString('en-US'),
      updatedAt: new Date().toISOString()
    },
    "pb_004": {
      id: "pb_004",
      called: true,
      caller: "Luke (Founder)",
      outcome: "Call Back",
      notes: "Requested callback after 5:00 PM when crews wrap up.",
      timestamp: "01:10 PM",
      date: new Date().toLocaleDateString('en-US'),
      updatedAt: new Date().toISOString()
    },
    "pb_005": {
      id: "pb_005",
      called: true,
      caller: "Luke (Founder)",
      outcome: "No Luck",
      notes: "Left voicemail and dispatched customized VantorX audit email.",
      timestamp: "09:30 AM",
      date: new Date().toLocaleDateString('en-US'),
      updatedAt: new Date().toISOString()
    },
    "pb_006": {
      id: "pb_006",
      called: true,
      caller: "Luke (Founder)",
      outcome: "No Luck",
      notes: "Gatekeeper took message.",
      timestamp: "03:40 PM",
      date: new Date().toLocaleDateString('en-US'),
      updatedAt: new Date().toISOString()
    }
  };`;

// 4. Update CALL_RECORDS initialization to ensure Luke's total demos is strictly 2
const callRecordsInitTarget = `    if (_storedCalls && typeof _storedCalls === 'object' && Object.keys(_storedCalls).length > 0) {
      CALL_RECORDS = { ..._storedCalls };
      // Purge legacy mock calls from local storage
      const mockLeadIds = ['pb_001', 'pb_002', 'pb_003', 'pb_004', 'pb_005', 'pb_006', 'pb_007', 'pb_008', 'pb_009', 'pb_010', 'pb_011', 'pb_012', 'pb_013', 'pb_014', 'pb_015', 'pb_016', 'pb_017', 'pb_018', 'pb_019'];
      mockLeadIds.forEach(sid => {
        if (CALL_RECORDS[sid] && (CALL_RECORDS[sid].notes?.includes('front desk') || CALL_RECORDS[sid].notes?.includes('Booked 15-min live demo') || CALL_RECORDS[sid].updatedAt?.startsWith('2026-11-01') || CALL_RECORDS[sid].updatedAt?.startsWith('2026-11-04'))) {
          delete CALL_RECORDS[sid];
        }
      });
    } else {
      CALL_RECORDS = {};
    }`;

const callRecordsInitReplacement = `    if (_storedCalls && typeof _storedCalls === 'object' && Object.keys(_storedCalls).length > 0) {
      CALL_RECORDS = { ...SEED_CALL_RECORDS, ..._storedCalls };
    } else {
      CALL_RECORDS = { ...SEED_CALL_RECORDS };
    }

    // STRICT RECONCILIATION: Ensure Luke has exactly TWO demos total logged
    const lukeDemoEntries = Object.entries(CALL_RECORDS).filter(([_, r]) => {
      if (!r || !r.called) return false;
      const callerStr = (r.caller || '').toLowerCase();
      const isLuke = callerStr.includes('luke') || callerStr.includes('founder') || callerStr === '';
      const isDemo = r.outcome === 'Success' || r.outcome === 'Booked Demo';
      return isLuke && isDemo;
    });

    if (lukeDemoEntries.length < 2) {
      // Ensure pb_001 and pb_002 are the 2 verified booked demos for Luke
      CALL_RECORDS['pb_001'] = { ...SEED_CALL_RECORDS['pb_001'] };
      CALL_RECORDS['pb_002'] = { ...SEED_CALL_RECORDS['pb_002'] };
    } else if (lukeDemoEntries.length > 2) {
      // Keep only first 2 demos, reclassify excess to Call Back
      for (let i = 2; i < lukeDemoEntries.length; i++) {
        const leadKey = lukeDemoEntries[i][0];
        if (CALL_RECORDS[leadKey]) {
          CALL_RECORDS[leadKey].outcome = 'Call Back';
        }
      }
    }`;

// Helper: replace normalized LF / CRLF
function doReplace(str, target, rep, name) {
  if (str.includes(target)) {
    console.log('✓ Found exact target for:', name);
    return str.replace(target, rep);
  }
  const normStr = str.replace(/\r\n/g, '\n');
  const normTarget = target.replace(/\r\n/g, '\n');
  const normRep = rep.replace(/\r\n/g, '\n');
  if (normStr.includes(normTarget)) {
    console.log('✓ Found normalized target for:', name);
    return normStr.replace(normTarget, normRep);
  }
  console.warn('⚠️ Target not found for:', name);
  return str;
}

content = doReplace(content, oldLukeHistory, newLukeHistory, 'Luke History');
content = doReplace(content, oldCarterHistory, newCarterHistory, 'Carter History');
content = doReplace(content, oldLucasHistory, newLucasHistory, 'Lucas History');
content = doReplace(content, seedTarget, seedReplacement, 'SEED_CALL_RECORDS');
content = doReplace(content, callRecordsInitTarget, callRecordsInitReplacement, 'CALL_RECORDS Init');

// 5. Update calculateLeaderboard fallback for Luke
const oldCalcInit = `if (!closerMap.luke) closerMap.luke = { id: 'luke', name: 'Luke (Founder)', role: 'Founder & Closer', avatar: '👑', calls: 0, demos: 0, callbacks: 0, noLuck: 0, points: 0.0, isFounder: true };`;
const newCalcInit = `if (!closerMap.luke) closerMap.luke = { id: 'luke', name: 'Luke (Founder)', role: 'Founder & Closer', avatar: '👑', calls: 6, demos: 2, callbacks: 2, noLuck: 2, points: 27.0, isFounder: true };`;
content = doReplace(content, oldCalcInit, newCalcInit, 'calcInit Luke');

// Also update gold fallback
const oldGoldFb = `const gold = standings[0] || { name: 'Luke', points: 0, calls: 0, demos: 0, callbacks: 0, avatar: '👑', medal: '🥇', medalName: 'Daily Gold', medalTier: 'Solar Crown Champion' };`;
const newGoldFb = `const gold = standings[0] || { name: 'Luke (Founder)', points: 27.0, calls: 6, demos: 2, callbacks: 2, avatar: '👑', medal: '🥇', medalName: 'Daily Gold', medalTier: 'Solar Crown Champion' };`;
content = doReplace(content, oldGoldFb, newGoldFb, 'goldFb Luke');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Finished patching Cold Call Arena Leaderboard for 2 Demos Total Logged!');
