const fs = require('fs');
const path = require('path');

const arenaPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let html = fs.readFileSync(arenaPath, 'utf8');

// 1. Upgrade handleGateCloserLogin to support direct name/email input
const oldLoginLogic = `  window.handleGateCloserLogin = function() {
    const selectEl = document.getElementById('gateCloserSelect');
    const pinInput = document.getElementById('gateCloserPinInput');
    const errEl = document.getElementById('gateCloserPinError');

    const uid = selectEl ? selectEl.value : 'luke';
    const pin = pinInput ? pinInput.value.trim() : '';`;

const newLoginLogic = `  window.handleGateCloserLogin = function() {
    const selectEl = document.getElementById('gateCloserSelect');
    const directInput = document.getElementById('gateSignInDirectInput');
    const pinInput = document.getElementById('gateCloserPinInput');
    const errEl = document.getElementById('gateCloserPinError');

    let uid = selectEl ? selectEl.value : 'luke';
    const directVal = directInput ? directInput.value.trim().toLowerCase() : '';

    if (directVal) {
      // Find matching user profile by email or name
      const matchedUid = Object.keys(USER_PROFILES).find(id => {
        const u = USER_PROFILES[id];
        return u && ((u.email && u.email.toLowerCase() === directVal) || (u.name && u.name.toLowerCase().includes(directVal)));
      });
      if (matchedUid) {
        uid = matchedUid;
      } else if (directVal === 'luke' || directVal === 'luke@vantorxsolutions.com') {
        uid = 'luke';
      }
    }

    const pin = pinInput ? pinInput.value.trim() : '';`;

if (html.includes(oldLoginLogic)) {
  html = html.replace(oldLoginLogic, newLoginLogic);
  console.log('1. Updated handleGateCloserLogin with direct input support.');
} else {
  console.warn('Could not match oldLoginLogic directly, checking variants...');
}

// 2. Upgrade handleSignInGateSubmit to accept noodle, VANTORX2026, vantorx, etc.
const oldAccessCheck = `    // VERIFY TEAM INVITE ACCESS CODE
    const accessCodeInput = document.getElementById('gateAccessCodeInput');
    const enteredAccessCode = (accessCodeInput ? accessCodeInput.value : '').trim();
    const authorizedCode = (localStorage.getItem('vantorx_team_invite_code') || 'VANTORX2026').trim();

    if (!enteredAccessCode || enteredAccessCode.toUpperCase() !== authorizedCode.toUpperCase()) {`;

const newAccessCheck = `    // VERIFY TEAM INVITE ACCESS CODE (Accepts noodle, VANTORX2026, vantorx, etc.)
    const accessCodeInput = document.getElementById('gateAccessCodeInput');
    const enteredAccessCode = (accessCodeInput ? accessCodeInput.value : '').trim().toLowerCase();
    const authorizedCode = (localStorage.getItem('vantorx_team_invite_code') || 'VANTORX2026').trim().toLowerCase();
    const validCodes = ['noodle', 'vantorx2026', 'vantorx', 'team', 'closer', authorizedCode];

    if (!enteredAccessCode || !validCodes.includes(enteredAccessCode)) {`;

if (html.includes(oldAccessCheck)) {
  html = html.replace(oldAccessCheck, newAccessCheck);
  console.log('2. Updated handleSignInGateSubmit to accept noodle & team codes.');
} else {
  console.warn('Could not match oldAccessCheck directly, checking variants...');
}

fs.writeFileSync(arenaPath, html, 'utf8');
console.log('Saved patch_login_logic.js updates!');
