const fs = require('fs');

const auditPath = 'website/api/audit.js';
let content = fs.readFileSync(auditPath, 'utf8');

// 1. Remove buddy from line 78 & 119 mock checks
content = content.replace(
  'key.includes("marcus") || key.includes("jake") || key.includes("tyler") || key.includes("probe") || key.includes("buddy") || key.includes("test@") || key.includes("verify") ||\n                       nameLower.includes("marcus") || nameLower.includes("jake") || nameLower.includes("tyler") || nameLower.includes("probe") || nameLower.includes("buddy") ||',
  'key.includes("marcus") || key.includes("jake") || key.includes("tyler") || key.includes("probe") || key.includes("test@") || key.includes("verify") ||\n                       nameLower.includes("marcus") || nameLower.includes("jake") || nameLower.includes("tyler") || nameLower.includes("probe") ||'
);

content = content.replace(
  'key.includes("marcus") || key.includes("jake") || key.includes("tyler") || key.includes("probe") || key.includes("buddy") || key.includes("test@") || key.includes("verify") ||\n                              nameLower.includes("marcus") || nameLower.includes("jake") || nameLower.includes("tyler") || nameLower.includes("probe") || nameLower.includes("buddy") ||',
  'key.includes("marcus") || key.includes("jake") || key.includes("tyler") || key.includes("probe") || key.includes("test@") || key.includes("verify") ||\n                              nameLower.includes("marcus") || nameLower.includes("jake") || nameLower.includes("tyler") || nameLower.includes("probe") ||'
);

// 2. Remove buddy from handleRepSync mock check
content = content.replace(
  'if (keyCheck.includes("marcus") || keyCheck.includes("jake") || keyCheck.includes("tyler") || keyCheck.includes("probe") || keyCheck.includes("buddy")) {',
  'if (keyCheck.includes("marcus") || keyCheck.includes("jake") || keyCheck.includes("tyler") || keyCheck.includes("probe")) {'
);

// 3. Remove buddy2 from rep-roster filter
content = content.replace(
  'return !key.includes("marcus") && !key.includes("jake") && !key.includes("tyler") && !key.includes("probe") && !key.includes("buddy2");',
  'return !key.includes("marcus") && !key.includes("jake") && !key.includes("tyler") && !key.includes("probe");'
);

// 4. In getRoster(), add Buddy profile alongside Luke, Carter, Lucas, James
const buddyProfileCode = `
  // Ensure Buddy (Rep 2) profile is present with permanent Level 5 Certification Auto-Pass
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

if (!content.includes('hasBuddy')) {
  const jamesMarker = 'return uniqueReps;\n}';
  content = content.replace(jamesMarker, buddyProfileCode + '\n  return uniqueReps;\n}');
}

// 5. In handleRepSync, add buddy auto-pass
content = content.replace(
  'const isJames = (name + " " + (email || "") + " " + existing.id).toLowerCase().includes("james") || (email || "").toLowerCase().includes("jcmccullohs");\n  if (isCarter || isLucas || isJames) {',
  'const isJames = (name + " " + (email || "") + " " + existing.id).toLowerCase().includes("james") || (email || "").toLowerCase().includes("jcmccullohs");\n  const isBuddy = (name + " " + (email || "") + " " + existing.id).toLowerCase().includes("buddy");\n  if (isCarter || isLucas || isJames || isBuddy) {'
);

fs.writeFileSync(auditPath, content, 'utf8');
console.log('Successfully updated website/api/audit.js with Buddy support & unblocked filters!');
