const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const q = JSON.parse(fs.readFileSync(path.join(root, 'data/verified_targets_queue.json'), 'utf8'));

console.log('Queue total:', q.length);
const sources = {};
q.forEach(item => {
  const s = item.emailSource || 'none';
  sources[s] = (sources[s] || 0) + 1;
});
console.log('Email sources in queue:', sources);

const statusBySource = {};
q.forEach(item => {
  const k = `${item.emailSource || 'none'} -> ${item.status}`;
  statusBySource[k] = (statusBySource[k] || 0) + 1;
});
console.log('Status by source:');
console.log(statusBySource);
