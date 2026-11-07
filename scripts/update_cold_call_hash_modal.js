const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let raw = fs.readFileSync(targetFile, 'utf8');

const isCRLF = raw.includes('\r\n');
let html = raw.replace(/\r\n/g, '\n');

const oldCheckUrlTabHash = `// Auto-switch tabs from URL hash (e.g., #tabNoWebsite or #nowebsite)
function checkUrlTabHash() {
  const hash = (window.location.hash || '').toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get('tab');

  if (hash === '#tabnowebsite' || hash === '#nowebsite' || hash === '#florida' || tabParam === 'tabNoWebsite') {
    window.switchTab('tabNoWebsite');`;

const newCheckUrlTabHash = `// Auto-switch tabs from URL hash (e.g., #tabNoWebsite or #nowebsite)
function checkUrlTabHash() {
  const hash = (window.location.hash || '').toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get('tab');

  if (hash === '#tabnowebsite' || hash === '#nowebsite' || hash === '#florida' || tabParam === 'tabNoWebsite') {
    // Dismiss sign-in modal for Founder instant access
    const gateModal = document.getElementById('signInGateModal');
    if (gateModal) gateModal.classList.remove('active');
    if (!localStorage.getItem('vantorx_active_user')) {
      localStorage.setItem('vantorx_active_user', 'luke');
    }
    window.switchTab('tabNoWebsite');`;

if (html.includes(oldCheckUrlTabHash)) {
  html = html.replace(oldCheckUrlTabHash, newCheckUrlTabHash);
  console.log('✅ Updated checkUrlTabHash with auto-dismiss of signInGateModal');
} else {
  console.log('⚠️ Could not find oldCheckUrlTabHash');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(targetFile, html, 'utf8');
console.log('🎉 Successfully saved cold-call-arena/index.html');
