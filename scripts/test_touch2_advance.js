const fs = require('fs');
const path = require('path');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const qPath = path.join(root, 'data/verified_targets_queue.json');
const queue = JSON.parse(fs.readFileSync(qPath, 'utf8'));

const now = Date.now();
const twoDaysMs = 48 * 60 * 60 * 1000;
let eligibleTouch2 = 0;

queue.forEach(item => {
  if (item.status === 'sent' && item.sentAt) {
    const age = now - new Date(item.sentAt).getTime();
    if (age >= twoDaysMs && (item.touch || 1) === 1) {
      eligibleTouch2++;
    }
  }
});

console.log('Total sent items:', queue.filter(t => t.status === 'sent').length);
console.log('Eligible to advance to Touch 2 (>48h):', eligibleTouch2);
console.log('Current pending items:', queue.filter(t => t.status === 'pending').length);
