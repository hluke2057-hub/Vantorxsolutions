const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const zipPath = 'C:\\Users\\hungr\\.gemini\\antigravity\\scratch\\Vantorxsolutions\\website\\instagram-package\\VantorX_Instagram_Highlights_Complete_Package.zip';

// Test unzipping with tar or powershell script file
const testDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\scratch\\Vantorxsolutions\\test_unzip';
if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

try {
  const output = execSync(`tar -tf "${zipPath}"`, { encoding: 'utf8' });
  console.log('Tar listing from zip:');
  console.log(output);
} catch (err) {
  console.error('Tar error:', err.message);
}
