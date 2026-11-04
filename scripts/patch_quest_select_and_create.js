const fs = require('fs');
const path = require('path');

const questPath = path.join(__dirname, '..', 'website', 'cold-call-quest', 'index.html');
let q = fs.readFileSync(questPath, 'utf8');

const oldBlockStart = '  function selectActiveQuestRep(id, profile) {';
const oldBlockEnd = '  function recalcPlayerStats() {';

const idxStart = q.indexOf(oldBlockStart);
const idxEnd = q.indexOf(oldBlockEnd);

if (idxStart === -1 || idxEnd === -1) {
  console.error('Cannot locate selectActiveQuestRep / recalcPlayerStats bounds');
  process.exit(1);
}

const newBlock = `  function selectActiveQuestRep(id, profile) {
    const curId = localStorage.getItem('vantorx_active_user_id_v2');
    if (id === curId) return;

    window.promptQuestCloserAuth(id, () => {
      window.loginAsQuestRep(id, 'verified');
      if (typeof closeRepModal === 'function') closeRepModal();
      renderQuestRepList();
    });
  }
  window.selectActiveQuestRep = selectActiveQuestRep;

  window.createNewQuestRep = function() {
    const nameInput = document.getElementById('questNewRepName');
    const emailInput = document.getElementById('questNewRepEmail');
    const roleSelect = document.getElementById('questNewRepRole');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const role = roleSelect ? roleSelect.value : 'Outbound Closer';

    if (!name) {
      showToast('Please enter the sales rep full name.');
      return;
    }
    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.');
      return;
    }

    const nameLower = name.toLowerCase();
    const emailLower = email.toLowerCase();

    if (nameLower.includes('carter') || emailLower.includes('carter')) {
      showToast('Carter McCauliss account already exists. Please switch using his PIN (2026).');
      return;
    }
    if (nameLower.includes('lucas') || emailLower.includes('lucas')) {
      showToast('Lucas account already exists. Please switch using his PIN (3030).');
      return;
    }
    if (nameLower.includes('luke') || emailLower.includes('luke')) {
      showToast('Founder account already exists. Please switch using founder PIN (7777).');
      return;
    }

    const uid = 'rep_' + Date.now().toString(36);
    let profiles = {};
    try {
      profiles = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2') || '{}');
    } catch(e){}

    const avatars = ['⚡', '⚔️', '🎯', '🔥', '🛡️', '🚀'];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    profiles[uid] = {
      id: uid,
      name,
      email,
      role,
      pin: '1234',
      avatar,
      level: 1,
      xp: 0,
      completedUnits: [],
      daysPassed: [],
      bossesDefeated: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      lastAction: 'Joined Sales Team · Cold Call RPG'
    };

    localStorage.setItem('vantorx_user_profiles_v2', JSON.stringify(profiles));
    localStorage.setItem('vantorx_active_user_id_v2', uid);

    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';

    window.loginAsQuestRep(uid, 'verified');
    syncQuestToCloud('account_created', \`New sales closer registered: \${name} (\${email}) as \${role} (PIN secured)\`, profiles[uid]);
    showToast(\`✓ Closer account created for \${name}! Added to Luke's roster.\`);
    if (typeof closeRepModal === 'function') closeRepModal();
  };

`;

q = q.substring(0, idxStart) + newBlock + q.substring(idxEnd);
fs.writeFileSync(questPath, q, 'utf8');
console.log('✓ Successfully patched selectActiveQuestRep and createNewQuestRep in quest!');
