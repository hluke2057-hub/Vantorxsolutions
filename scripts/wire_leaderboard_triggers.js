const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../website/cold-call-arena/index.html');
let html = fs.readFileSync(targetPath, 'utf8');

const isCRLF = html.includes('\r\n');
const EOL = isCRLF ? '\r\n' : '\n';

// 1. switchTab hook
const oldSwitchTab = `    tabPanels.forEach(p => {
      if (p.id === targetTabId) p.classList.add('active');
      else p.classList.remove('active');
    });`.split('\n').join(EOL);

const newSwitchTab = `    tabPanels.forEach(p => {
      if (p.id === targetTabId) p.classList.add('active');
      else p.classList.remove('active');
    });
    if ((targetTabId === 'tabLeaderboard' || targetTabId === 'tabLeads') && typeof window.renderLeaderboardUI === 'function') {
      window.renderLeaderboardUI();
    }`.split('\n').join(EOL);

if (html.includes(oldSwitchTab)) {
  html = html.replace(oldSwitchTab, newSwitchTab);
  console.log('1. Added renderLeaderboardUI trigger to switchTab');
} else {
  console.log('1. Could not locate oldSwitchTab');
}

// 2. openAccountModal hook
const oldOpenAccount = `    if (typeof window.renderAccountProfileList === 'function') {
      window.renderAccountProfileList();
    }`.split('\n').join(EOL);

const newOpenAccount = `    if (typeof window.renderAccountProfileList === 'function') {
      window.renderAccountProfileList();
    }
    if (typeof window.renderLeaderboardUI === 'function') {
      window.renderLeaderboardUI();
    }`.split('\n').join(EOL);

if (html.includes(oldOpenAccount)) {
  html = html.replace(oldOpenAccount, newOpenAccount);
  console.log('2. Added renderLeaderboardUI trigger to openAccountModal');
} else {
  console.log('2. Could not locate oldOpenAccount');
}

// 3. Page initialization trigger at end of script
const initAnchor = `updateUserUI();
    renderLeadsTable();`.split('\n').join(EOL);

const newInitAnchor = `updateUserUI();
    renderLeadsTable();
    if (typeof window.renderLeaderboardUI === 'function') {
      window.renderLeaderboardUI();
    }`.split('\n').join(EOL);

if (html.includes(initAnchor)) {
  html = html.replace(initAnchor, newInitAnchor);
  console.log('3. Added renderLeaderboardUI trigger to initial script startup');
} else {
  console.log('3. Could not locate initAnchor');
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Done wire_leaderboard_triggers.js!');
