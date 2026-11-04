const fs = require('fs');

let arena = fs.readFileSync('website/cold-call-arena/index.html', 'utf8');

// Normalize CRLF to LF for reliable replacements
let isCRLF = arena.includes('\r\n');
let norm = arena.replace(/\r\n/g, '\n');

// 1. Luke in DEFAULT_PROFILES
const lukeOld = `    luke: {
      id: 'luke',
      name: 'Luke (Founder)',
      role: 'Founder & Closer',`;

const lukeNew = `    luke: {
      id: 'luke',
      name: 'Luke (Founder)',
      pin: '7777',
      passcode: 'vantorx2026',
      role: 'Founder & Closer',`;

// 2. Carter in DEFAULT_PROFILES
const carterOld = `    carter_mccauliss: {
      id: 'carter_mccauliss',
      name: 'Carter McCauliss',
      email: 'cartermccauliss@gmail.com',
      role: 'Certified Closer & Phone Warrior',`;

const carterNew = `    carter_mccauliss: {
      id: 'carter_mccauliss',
      name: 'Carter McCauliss',
      email: 'cartermccauliss@gmail.com',
      pin: '2026',
      passcode: 'carter2026',
      role: 'Certified Closer & Phone Warrior',`;

// 3. Lucas in DEFAULT_PROFILES
const lucasOld = `    lucas: {
      id: 'lucas',
      name: 'Lucas',
      email: 'lucas@vantorxsolutions.com',
      phone: '(330) 322-1452',
      role: 'Certified Closer & Phone Warrior',`;

const lucasNew = `    lucas: {
      id: 'lucas',
      name: 'Lucas',
      email: 'lucas@vantorxsolutions.com',
      phone: '(330) 322-1452',
      pin: '3030',
      passcode: 'lucas2026',
      role: 'Certified Closer & Phone Warrior',`;

// 4. Migration block
const migOld = `  if (!USER_PROFILES.luke) USER_PROFILES.luke = DEFAULT_PROFILES.luke;
  if (!USER_PROFILES.carter_mccauliss) USER_PROFILES.carter_mccauliss = DEFAULT_PROFILES.carter_mccauliss;
  if (!USER_PROFILES.lucas) USER_PROFILES.lucas = DEFAULT_PROFILES.lucas;`;

const migNew = `  if (!USER_PROFILES.luke) USER_PROFILES.luke = DEFAULT_PROFILES.luke;
  if (!USER_PROFILES.carter_mccauliss) USER_PROFILES.carter_mccauliss = DEFAULT_PROFILES.carter_mccauliss;
  if (!USER_PROFILES.lucas) USER_PROFILES.lucas = DEFAULT_PROFILES.lucas;

  // Ensure security PINs exist on all core profiles
  if (USER_PROFILES.luke) {
    USER_PROFILES.luke.pin = USER_PROFILES.luke.pin || '7777';
    USER_PROFILES.luke.passcode = USER_PROFILES.luke.passcode || 'vantorx2026';
  }
  if (USER_PROFILES.carter_mccauliss) {
    USER_PROFILES.carter_mccauliss.pin = USER_PROFILES.carter_mccauliss.pin || '2026';
    USER_PROFILES.carter_mccauliss.passcode = USER_PROFILES.carter_mccauliss.passcode || 'carter2026';
  }
  if (USER_PROFILES.lucas) {
    USER_PROFILES.lucas.pin = USER_PROFILES.lucas.pin || '3030';
    USER_PROFILES.lucas.passcode = USER_PROFILES.lucas.passcode || 'lucas2026';
  }
  Object.keys(USER_PROFILES).forEach(k => {
    if (!USER_PROFILES[k].pin) {
      USER_PROFILES[k].pin = '1234';
    }
  });`;

console.log('Replacing luke...');
norm = norm.replace(lukeOld, lukeNew);

console.log('Replacing carter...');
norm = norm.replace(carterOld, carterNew);

console.log('Replacing lucas...');
norm = norm.replace(lucasOld, lucasNew);

console.log('Replacing migration block...');
norm = norm.replace(migOld, migNew);

if (isCRLF) {
  norm = norm.replace(/\n/g, '\r\n');
}

fs.writeFileSync('website/cold-call-arena/index.html', norm, 'utf8');
console.log('✓ Successfully patched arena DEFAULT_PROFILES with PINs!');
