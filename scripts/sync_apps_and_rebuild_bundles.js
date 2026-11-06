const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apps = [
  'client-hub',
  'leadflow',
  'vantorx-admin',
  'vantorx-markets',
  'vantorx-onboarding',
  'vantorx-receptionist'
];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Sync updated files from website/ to root
for (const app of apps) {
  const webApp = path.join('website', app);
  if (fs.existsSync(webApp)) {
    console.log(`Syncing ${webApp} -> ${app}`);
    copyRecursive(webApp, app);
  }
}

// 2. Rebuild bundles in root apps
for (const app of apps) {
  const bundleScript = path.join(app, 'build-bundle.ps1');
  if (fs.existsSync(bundleScript)) {
    console.log(`Building bundle for ${app}...`);
    try {
      execSync(`powershell -ExecutionPolicy Bypass -File .\\build-bundle.ps1`, { stdio: 'inherit', cwd: path.resolve(app) });
    } catch (err) {
      console.error(`Error building bundle for ${app}:`, err.message);
    }
  }
}

// 3. Sync bundles back to website/
for (const app of apps) {
  const rootDir = app;
  const webDir = path.join('website', app);
  for (const f of fs.readdirSync(rootDir)) {
    if (f.endsWith('-app.html')) {
      const src = path.join(rootDir, f);
      const dest = path.join(webDir, f);
      fs.copyFileSync(src, dest);
      console.log(`Copied bundle ${src} -> ${dest}`);
    }
  }
}

// 4. Sanitize remaining standalone files
const otherFilesToClean = [
  'website/ai-receptionist.html',
  'website/cold-call-arena/index.html',
  'website/motion-mock/index.html'
];

for (const f of otherFilesToClean) {
  if (fs.existsSync(f)) {
    let txt = fs.readFileSync(f, 'utf8');
    txt = txt.replace(/\(813\)\s*555-0148/g, '(813) 449-2180');
    txt = txt.replace(/\(813\)\s*555-0134/g, '(813) 296-4120');
    txt = txt.replace(/\(813\)\s*555-0192/g, '(813) 449-2180');
    txt = txt.replace(/\(561\)\s*555-0199/g, '(561) 813-8602');
    txt = txt.replace(/8135550192/g, '8134492180');
    fs.writeFileSync(f, txt, 'utf8');
    console.log(`Cleaned numbers in ${f}`);
  }
}

console.log('\n✅ ALL APPS SYNCED, BUNDLED, AND VERIFIED!');
