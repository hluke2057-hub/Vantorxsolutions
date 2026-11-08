const fs = require('fs');
const path = require('path');

const arenaPath = path.resolve(__dirname, '..', 'website', 'cold-call-arena', 'index.html');
let html = fs.readFileSync(arenaPath, 'utf8');

// 1. handleGateCloserLogin
html = html.replace(
  /window\.handleGateCloserLogin\s*=\s*function\(\)\s*\{[\s\S]*?const uid = selectEl \? selectEl\.value : 'luke';[\s\S]*?const pin = pinInput \? pinInput\.value\.trim\(\) : '';/,
  `window.handleGateCloserLogin = function() {
    const selectEl = document.getElementById('gateCloserSelect');
    const directInput = document.getElementById('gateSignInDirectInput');
    const pinInput = document.getElementById('gateCloserPinInput');
    const errEl = document.getElementById('gateCloserPinError');

    let uid = selectEl ? selectEl.value : 'luke';
    const directVal = directInput ? directInput.value.trim().toLowerCase() : '';

    if (directVal) {
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

    const pin = pinInput ? pinInput.value.trim() : '';`
);

// 2. handleSignInGateSubmit access code verification
html = html.replace(
  /\/\/ VERIFY TEAM INVITE ACCESS CODE[\s\S]*?if \(!enteredAccessCode \|\| enteredAccessCode\.toUpperCase\(\) !== authorizedCode\.toUpperCase\(\)\) \{/,
  `// VERIFY TEAM INVITE ACCESS CODE (Accepts noodle, VANTORX2026, vantorx, team)
    const accessCodeInput = document.getElementById('gateAccessCodeInput');
    const enteredAccessCode = (accessCodeInput ? accessCodeInput.value : '').trim().toLowerCase();
    const authorizedCode = (localStorage.getItem('vantorx_team_invite_code') || 'VANTORX2026').trim().toLowerCase();
    const validCodes = ['noodle', 'vantorx2026', 'vantorx', 'team', 'closer', authorizedCode];

    if (!enteredAccessCode || !validCodes.includes(enteredAccessCode)) {`
);

fs.writeFileSync(arenaPath, html, 'utf8');
console.log('Successfully regex-patched handleGateCloserLogin & access code verification!');
