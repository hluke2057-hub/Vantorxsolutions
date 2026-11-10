const { resolveEmployeeIntel } = require('./verified_employee_directory.js');
console.log('Quality Air test:', resolveEmployeeIntel('Quality Air Conditioning Company', 'HVAC'));
console.log('Del-Air test:', resolveEmployeeIntel('Del-Air Heating, Air Conditioning & Plumbing', 'HVAC'));
console.log('Erica Plumbing test:', resolveEmployeeIntel("Erica's Plumbing, Air Conditioning & Restoration", 'Plumbing'));
console.log('Copperhead Plumbing test:', resolveEmployeeIntel('Copperhead Plumbing LLC', 'Plumbing'));
console.log('Sansone test:', resolveEmployeeIntel('Sansone Air Conditioning, Electrical & Plumbing', 'HVAC'));
