const fs = require('fs');
const q = JSON.parse(fs.readFileSync('data/verified_targets_queue.json', 'utf8'));

console.log('Total in verified_targets_queue.json:', q.length);
const sources = {};
q.forEach(item => {
  const s = item.emailSource || 'none';
  sources[s] = (sources[s] || 0) + 1;
});
console.log('Email sources:', sources);

const statuses = {};
q.forEach(item => {
  const s = item.status || 'none';
  statuses[s] = (statuses[s] || 0) + 1;
});
console.log('Statuses:', statuses);

const withWeb = q.filter(x => x.website);
console.log('Items with website in queue:', withWeb.length);
