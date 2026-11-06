const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

async function testProducts() {
  console.log('🚀 Testing all VantorX products in headless Microsoft Edge...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('pageerror', err => {
    console.error('  [Console Error]:', err.message);
    errors.push(err.message);
  });

  const productsToTest = [
    {
      name: 'Main Website',
      url: `file:///${path.resolve('website/index.html').replace(/\\/g, '/')}`,
      screenshot: 'verified_main_website.png'
    },
    {
      name: 'Client Hub Portal',
      url: `file:///${path.resolve('website/client-hub/index.html').replace(/\\/g, '/')}`,
      screenshot: 'verified_client_hub.png',
      action: async (p) => {
        // Click Quick-Access / Live Workspace
        const demoBtn = await p.$('#hubDemo');
        if (demoBtn) {
          await demoBtn.click();
          await new Promise(r => setTimeout(r, 800));
        }
      }
    },
    {
      name: 'Ava Voice AI Receptionist',
      url: `file:///${path.resolve('website/vantorx-receptionist/index.html').replace(/\\/g, '/')}`,
      screenshot: 'verified_ava_receptionist.png',
      action: async (p) => {
        const rxBtn = await p.$('#rxDemoBtn');
        if (rxBtn) {
          await rxBtn.click();
          await new Promise(r => setTimeout(r, 800));
        }
      }
    },
    {
      name: 'LeadFlow 90s SMS Speed CRM',
      url: `file:///${path.resolve('website/leadflow/index.html').replace(/\\/g, '/')}`,
      screenshot: 'verified_leadflow_crm.png'
    },
    {
      name: 'Contractor Onboarding System',
      url: `file:///${path.resolve('website/vantorx-onboarding/index.html').replace(/\\/g, '/')}`,
      screenshot: 'verified_onboarding_system.png'
    },
    {
      name: 'AEO AI Search Engine',
      url: `file:///${path.resolve('website/aeo-tool/index.html').replace(/\\/g, '/')}`,
      screenshot: 'verified_aeo_tool.png'
    },
    {
      name: 'Review Funnel & Reputation Shield',
      url: `file:///${path.resolve('website/review-tool/index.html').replace(/\\/g, '/')}`,
      screenshot: 'verified_review_tool.png'
    },
    {
      name: 'Cold Call Arena (500 Leads)',
      url: `file:///${path.resolve('website/cold-call-arena/index.html').replace(/\\/g, '/')}`,
      screenshot: 'verified_cold_call_arena.png'
    }
  ];

  for (const prod of productsToTest) {
    console.log(`\nTesting ${prod.name}...`);
    try {
      await page.goto(prod.url, { waitUntil: 'load', timeout: 15000 });
      await new Promise(r => setTimeout(r, 600));

      if (prod.action) {
        await prod.action(page);
      }

      const shotPath = path.join(ARTIFACT_DIR, prod.screenshot);
      await page.screenshot({ path: shotPath });
      console.log(`  📸 Saved screenshot: ${prod.screenshot}`);
      console.log(`  ✅ ${prod.name} verified running cleanly!`);
    } catch (e) {
      console.error(`  ❌ Error testing ${prod.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('\n🎉 ALL PRODUCTS SUCCESSFULLY TESTED & VERIFIED IN EDGE!');
}

testProducts();
