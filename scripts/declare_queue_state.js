// scripts/declare_queue_state.js
const fs = require('fs');
const htmlPath = 'website/cold-call-arena/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const targetStr = `  // Active Queue and Filter State Variables
  let currentBatch = 'today100';
  let currentLeadPage = 1;
  let leadPageSize = 50;
  let currentProductFilter = 'all';
  let currentStateFilter = 'all';
  let currentStatusFilter = 'all';
  let currentCallerFilter = 'all';
  let currentEmpFilter = 'all';
  let currentSort = 'empAsc';
  let leadSearchQuery = '';`;

const replacementStr = `  // Active Queue and Filter State Variables
  let currentBatch = 'today100';
  let currentLeadPage = 1;
  let leadPageSize = 50;
  let currentProductFilter = 'all';
  let currentStateFilter = 'all';
  let currentStatusFilter = 'all';
  let currentCallerFilter = 'all';
  let currentEmpFilter = 'all';
  let currentSort = 'empAsc';
  let leadSearchQuery = '';
  let currentLeadView = 'toCall'; // 'toCall' | 'callbacks' | 'calledHistory'
  window.currentLeadView = currentLeadView;

  window.switchLeadView = function(view) {
    currentLeadView = view;
    window.currentLeadView = view;
    currentLeadPage = 1;

    const btnToCall = document.getElementById('btnViewToCall');
    const btnCallbacks = document.getElementById('btnViewCallbacks');
    const btnCalled = document.getElementById('btnViewCalledHistory');

    [btnToCall, btnCallbacks, btnCalled].forEach(btn => {
      if (btn) {
        btn.classList.remove('active');
        btn.style.border = '1px solid var(--line)';
        btn.style.background = 'rgba(255,255,255,0.06)';
        btn.style.color = '#cbd5e1';
      }
    });

    if (view === 'toCall') {
      if (btnToCall) {
        btnToCall.classList.add('active');
        btnToCall.style.border = '1px solid #f59e0b';
        btnToCall.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)';
        btnToCall.style.color = '#070a0f';
      }
    } else if (view === 'callbacks') {
      if (btnCallbacks) {
        btnCallbacks.classList.add('active');
        btnCallbacks.style.border = '1px solid rgba(56,189,248,0.5)';
        btnCallbacks.style.background = 'rgba(56,189,248,0.2)';
        btnCallbacks.style.color = '#38bdf8';
      }
    } else if (view === 'calledHistory') {
      if (btnCalled) {
        btnCalled.classList.add('active');
        btnCalled.style.border = '1px solid rgba(52,211,153,0.5)';
        btnCalled.style.background = 'rgba(52,211,153,0.2)';
        btnCalled.style.color = '#6ee7b7';
      }
    }

    renderLeadsTable();
  };`;

const normalize = s => s.replace(/\r\n/g, '\n');
if (normalize(html).includes(normalize(targetStr))) {
  html = normalize(html).replace(normalize(targetStr), normalize(replacementStr));
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Successfully added currentLeadView and switchLeadView!');
} else {
  console.error('Target string not found!');
  process.exit(1);
}
