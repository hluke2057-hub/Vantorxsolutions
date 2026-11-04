const fs = require('fs');

const auditPath = 'website/api/audit.js';
let content = fs.readFileSync(auditPath, 'utf8');

// Replace all occurrences of "buddy" in mock persona checks
content = content.replace(/\|\|\s*key\.includes\("buddy"\)/g, '');
content = content.replace(/\|\|\s*nameLower\.includes\("buddy"\)/g, '');
content = content.replace(/\|\|\s*keyCheck\.includes\("buddy"\)/g, '');
content = content.replace(/&&\s*!key\.includes\("buddy2"\)/g, '');
content = content.replace(/key\.includes\("buddy"\)\s*\|\|/g, '');
content = content.replace(/nameLower\.includes\("buddy"\)\s*\|\|/g, '');

// In getRoster(), add Buddy profile if not already present
if (!content.includes('id: "buddy",') && !content.includes("id: 'buddy',")) {
  const insertTarget = 'return uniqueReps;';
  const buddyCode = `  // Ensure Buddy profile is present with Level 5 Auto-Pass
  const hasBuddy = uniqueReps.some(r => r.id === "buddy" || r.id === "buddy2" || (r.name && r.name.toLowerCase().includes("buddy")));
  if (!hasBuddy) {
    uniqueReps.push({
      id: "buddy",
      name: "Buddy (Closer)",
      email: "buddy@vantorxsolutions.com",
      role: "Certified Closer & Phone Warrior",
      avatar: "🤝",
      createdAt: "2026-10-21T14:00:00.000Z",
      lastActive: new Date().toISOString(),
      lastAction: "🏆 Level 5 Certified Closer · Buddy Auto-Pass Active",
      course: {
        completedUnits: ["1-1", "1-2", "1-3", "1-4", "1-5", "2-1", "2-2", "2-3", "2-4", "2-5", "3-1", "3-2", "3-3", "3-4", "3-5"],
        daysPassed: ["Day 1: Psychology & Objections", "Day 2: Leak Math & Pricing", "Day 3: Emergency Live Closes"],
        percent: 100,
        level: 5,
        xp: 1850,
        status: "🏆 Level 5 Certified"
      },
      game: {
        level: 5,
        xp: 1850,
        streak: 5,
        bossesDefeated: 8,
        bossList: ["Rick", "Karen", "Mike", "Dave", "Sal", "Brad", "Gary", "Vito"],
        totalDials: 30,
        dealsClosed: 12,
        bestGrade: "S",
        gold: 1100
      }
    });
  }

  `;
  content = content.replace(insertTarget, buddyCode + insertTarget);
}

// In handleRepSync auto-pass check:
if (!content.includes('const isBuddy')) {
  content = content.replace(
    'const isJames = (name + " " + (email || "") + " " + existing.id).toLowerCase().includes("james") || (email || "").toLowerCase().includes("jcmccullohs");',
    'const isJames = (name + " " + (email || "") + " " + existing.id).toLowerCase().includes("james") || (email || "").toLowerCase().includes("jcmccullohs");\n  const isBuddy = (name + " " + (email || "") + " " + existing.id).toLowerCase().includes("buddy");'
  );
  content = content.replace(
    'if (isCarter || isLucas || isJames) {',
    'if (isCarter || isLucas || isJames || isBuddy) {'
  );
}

fs.writeFileSync(auditPath, content, 'utf8');
console.log('Finished updating audit.js cleanly.');
