const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let raw = fs.readFileSync(targetFile, 'utf8');

const isCRLF = raw.includes('\r\n');
let html = raw.replace(/\r\n/g, '\n');

const targetStr = `window.switchTab = function(targetTabId) {
  try {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabBtns.forEach(b => {
      const isTarget = (b.dataset.tab === targetTabId) || (b.getAttribute('onclick') && b.getAttribute('onclick').includes(targetTabId));
      if (isTarget) b.classList.add('active');
      else b.classList.remove('active');
    });
    tabPanels.forEach(p => {
      if (p.id === targetTabId) p.classList.add('active');
      else p.classList.remove('active');
    });
    if (targetTabId === 'tabScript' && typeof window.setSplitView === 'function') {
      window.setSplitView('split');
    }
    if (targetTabId === 'tabNoWebsite' && typeof window.renderFloridaLeadsTable === 'function') {
      window.renderFloridaLeadsTable();
    }
    if ((targetTabId === 'tabLeaderboard' || targetTabId === 'tabLeads') && typeof window.renderLeaderboardUI === 'function') {
      window.renderLeaderboardUI();
    }
  } catch(e) {
    console.error('Error switching tab:', e);
  }
};`;

const replacementStr = targetStr + `\n
// Auto-switch tabs from URL hash (e.g., #tabNoWebsite or #nowebsite)
function checkUrlTabHash() {
  const hash = (window.location.hash || '').toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get('tab');

  if (hash === '#tabnowebsite' || hash === '#nowebsite' || hash === '#florida' || tabParam === 'tabNoWebsite') {
    window.switchTab('tabNoWebsite');
  } else if (hash === '#tableads' || hash === '#leads' || tabParam === 'tabLeads') {
    window.switchTab('tabLeads');
  } else if (hash === '#tableaderboard' || hash === '#leaderboard' || tabParam === 'tabLeaderboard') {
    window.switchTab('tabLeaderboard');
  } else if (hash === '#tabscript' || hash === '#script' || tabParam === 'tabScript') {
    window.switchTab('tabScript');
  } else if (hash === '#tabacademy' || hash === '#academy' || tabParam === 'tabAcademy') {
    window.switchTab('tabAcademy');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkUrlTabHash);
} else {
  setTimeout(checkUrlTabHash, 50);
}
window.addEventListener('hashchange', checkUrlTabHash);`;

if (html.includes(targetStr)) {
  html = html.replace(targetStr, replacementStr);
  console.log('✅ Injected checkUrlTabHash into cold-call-arena/index.html');
} else {
  console.log('⚠️ Could not find targetStr');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(targetFile, html, 'utf8');
console.log('🎉 Successfully saved cold-call-arena/index.html');
