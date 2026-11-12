const fs = require('fs');
const cache = JSON.parse(fs.readFileSync('data/sunbiz_dbpr_registry_cache.json', 'utf8'));

console.log('Total entries in sunbiz_dbpr_registry_cache.json:', Array.isArray(cache) ? cache.length : Object.keys(cache).length);
const sample = Array.isArray(cache) ? cache.slice(0, 5) : Object.values(cache).slice(0, 5);
console.log('Sample entries:');
sample.forEach(s => console.log(JSON.stringify(s, null, 2)));
