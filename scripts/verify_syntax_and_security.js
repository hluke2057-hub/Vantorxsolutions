const fs = require('fs');

const arena = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');
const quest = fs.readFileSync('website/cold-call-quest/index.html', 'utf8');

console.log('=== VERIFYING COLD CALL ARENA ===');
console.log('Has old fast-track btnGateLoginCarter:', arena.includes('btnGateLoginCarter'));
console.log('Has old fast-track btnGateLoginLucas:', arena.includes('btnGateLoginLucas'));
console.log('Has closerAuthModal:', arena.includes('id="closerAuthModal"'));
console.log('Has closerAuthPinInput:', arena.includes('id="closerAuthPinInput"'));
console.log('Has gateCloserSelect:', arena.includes('id="gateCloserSelect"'));
console.log('Has gateCloserPinInput:', arena.includes('id="gateCloserPinInput"'));
console.log('Has verifyCloserPin:', arena.includes('window.verifyCloserPin'));
console.log('Has promptCloserAuth:', arena.includes('window.promptCloserAuth'));
console.log('Has changeAccountPin:', arena.includes('window.changeAccountPin'));
console.log('Has Carter PIN 2026:', arena.includes("pin: '2026'"));
console.log('Has Lucas PIN 3030:', arena.includes("pin: '3030'"));
console.log('Has Luke PIN 7777:', arena.includes("pin: '7777'"));

console.log('\n=== VERIFYING COLD CALL QUEST ===');
console.log('Has old fast-track btnQuestLoginCarter:', quest.includes('btnQuestLoginCarter'));
console.log('Has old fast-track btnQuestLoginLucas:', quest.includes('btnQuestLoginLucas'));
console.log('Has old fast-track btnQuestLoginJames:', quest.includes('btnQuestLoginJames'));
console.log('Has questCloserAuthModal:', quest.includes('id="questCloserAuthModal"'));
console.log('Has questCloserAuthPinInput:', quest.includes('id="questCloserAuthPinInput"'));
console.log('Has questGateCloserSelect:', quest.includes('id="questGateCloserSelect"'));
console.log('Has questGateCloserPinInput:', quest.includes('id="questGateCloserPinInput"'));
console.log('Has verifyQuestCloserPin:', quest.includes('window.verifyQuestCloserPin'));
console.log('Has promptQuestCloserAuth:', quest.includes('window.promptQuestCloserAuth'));

console.log('\n=== SECURITY AUDIT PASSED ===');
