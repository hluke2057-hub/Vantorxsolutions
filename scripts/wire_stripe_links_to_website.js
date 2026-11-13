const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'website', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Replace Essential tier button
const oldEssential = '<a class="btn btn-ghost select-tier-btn" href="#contact" data-tier="Essential Tier ($397/mo)" style="width:100%">Get Essential ($397/mo) &rarr;</a>';
const newEssential = `<div style="margin-top:auto;display:flex;flex-direction:column;gap:8px">
        <a class="btn btn-gold" href="https://buy.stripe.com/dRmeVd7meg2rf8331Kgw001" target="_blank" rel="noopener" style="width:100%;text-align:center">Instant Checkout ($397/mo) &rarr;</a>
        <a class="btn btn-ghost btn-sm select-tier-btn" href="#contact" data-tier="Essential Tier ($397/mo)" style="width:100%;text-align:center;font-size:12px">Or Book Demo Walkthrough</a>
      </div>`;

// Replace Accelerate tier button
const oldAccelerate = '<a class="btn btn-gold select-tier-btn" href="#contact" data-tier="Accelerate Tier ($697/mo)" style="width:100%">Get Accelerate ($697/mo) &rarr;</a>';
const newAccelerate = `<div style="margin-top:auto;display:flex;flex-direction:column;gap:8px">
        <a class="btn btn-gold" href="https://buy.stripe.com/28EeVddKC7vVf830TCgw002" target="_blank" rel="noopener" style="width:100%;text-align:center">Instant Checkout ($697/mo) &rarr;</a>
        <a class="btn btn-ghost btn-sm select-tier-btn" href="#contact" data-tier="Accelerate Tier ($697/mo)" style="width:100%;text-align:center;font-size:12px">Or Book Demo Walkthrough</a>
      </div>`;

// Replace Scale tier button
const oldScale = '<a class="btn btn-ghost select-tier-btn" href="#contact" data-tier="Scale Tier ($1,297/mo)" style="width:100%">Get Scale ($1,297/mo) &rarr;</a>';
const newScale = `<div style="margin-top:auto;display:flex;flex-direction:column;gap:8px">
        <a class="btn btn-cyan" href="https://buy.stripe.com/3cI4gzcGy2bB2lhfOwgw003" target="_blank" rel="noopener" style="width:100%;text-align:center">Instant Checkout ($1,297/mo) &rarr;</a>
        <a class="btn btn-ghost btn-sm select-tier-btn" href="#contact" data-tier="Scale Tier ($1,297/mo)" style="width:100%;text-align:center;font-size:12px">Or Book Demo Walkthrough</a>
      </div>`;

console.log('Essential found:', html.includes(oldEssential));
console.log('Accelerate found:', html.includes(oldAccelerate));
console.log('Scale found:', html.includes(oldScale));

html = html.replace(oldEssential, newEssential);
html = html.replace(oldAccelerate, newAccelerate);
html = html.replace(oldScale, newScale);

// Replace Standalone buttons
const oldWebBtn = '<a class="btn btn-ghost btn-sm select-tier-btn" href="#contact" data-tier="Custom Website Design ($799 flat)" style="font-size:12px;padding:5px 12px">Select Standalone</a>';
const newWebBtn = `<div style="display:flex;flex-direction:column;gap:6px;align-items:center">
        <a class="btn btn-gold btn-sm" href="https://buy.stripe.com/bJe9AT9um17x3plbyggw004" target="_blank" rel="noopener" style="font-size:12px;padding:5px 14px;width:100%">Instant Checkout 💳</a>
        <a class="select-tier-btn" href="#contact" data-tier="Custom Website Design ($799 flat)" style="font-size:11px;color:var(--dim);text-decoration:underline">or ask questions</a>
      </div>`;

const oldAvaBtn = '<a class="btn btn-ghost btn-sm select-tier-btn" href="#contact" data-tier="Essential Tier ($397/mo)" style="font-size:12px;padding:5px 12px">Select Standalone</a>';
const newAvaBtn = `<div style="display:flex;flex-direction:column;gap:6px;align-items:center">
        <a class="btn btn-gold btn-sm" href="https://buy.stripe.com/00w00j4a2g2r9NJgSAgw005" target="_blank" rel="noopener" style="font-size:12px;padding:5px 14px;width:100%">Instant Checkout 💳</a>
        <a class="select-tier-btn" href="#contact" data-tier="Essential Tier ($397/mo)" style="font-size:11px;color:var(--dim);text-decoration:underline">or ask questions</a>
      </div>`;

const oldAeoBtn = '<a class="btn btn-ghost btn-sm select-tier-btn" href="#contact" data-tier="AEO Engine ($297/mo + $297 setup)" style="font-size:12px;padding:5px 12px">Select Standalone</a>';
const newAeoBtn = `<div style="display:flex;flex-direction:column;gap:6px;align-items:center">
        <a class="btn btn-gold btn-sm" href="https://buy.stripe.com/dRm6oHeOGbMbe3Z6dWgw006" target="_blank" rel="noopener" style="font-size:12px;padding:5px 14px;width:100%">Instant Checkout 💳</a>
        <a class="select-tier-btn" href="#contact" data-tier="AEO Engine ($297/mo + $297 setup)" style="font-size:11px;color:var(--dim);text-decoration:underline">or ask questions</a>
      </div>`;

const oldCrmBtn = '<a class="btn btn-ghost btn-sm select-tier-btn" href="#contact" data-tier="LeadFlow CRM ($197/mo + $197 setup)" style="font-size:12px;padding:5px 12px">Select Standalone</a>';
const newCrmBtn = `<div style="display:flex;flex-direction:column;gap:6px;align-items:center">
        <a class="btn btn-gold btn-sm" href="https://buy.stripe.com/eVqeVd21UeYnaRN8m4gw007" target="_blank" rel="noopener" style="font-size:12px;padding:5px 14px;width:100%">Instant Checkout 💳</a>
        <a class="select-tier-btn" href="#contact" data-tier="LeadFlow CRM ($197/mo + $197 setup)" style="font-size:11px;color:var(--dim);text-decoration:underline">or ask questions</a>
      </div>`;

html = html.replace(oldWebBtn, newWebBtn);
html = html.replace(oldAvaBtn, newAvaBtn);
html = html.replace(oldAeoBtn, newAeoBtn);
html = html.replace(oldCrmBtn, newCrmBtn);

// Add Billing portal link and verified storefront to footer
const oldFooterCol = '<li><a href="/client-hub/" style="transition:color .2s;color:var(--ink)">🔐 Client Hub Portal</a></li>';
const newFooterCol = `<li><a href="/client-hub/" style="transition:color .2s;color:var(--ink)">🔐 Client Hub Portal</a></li>
          <li><a href="https://billing.stripe.com/p/login/bpc_1UbE8WHXorgFJlMsfuB4Mwr6" target="_blank" rel="noopener" style="transition:color .2s;color:var(--accent2)">💳 Manage Billing &amp; Invoices</a></li>
          <li><a href="https://stripe.com/@vantorxsolutions" target="_blank" rel="noopener" style="transition:color .2s;color:var(--gold)">🛒 Stripe Verified Storefront</a></li>`;

html = html.replace(oldFooterCol, newFooterCol);

fs.writeFileSync(filePath, html, 'utf8');
console.log('✅ website/index.html updated successfully with all 7 Stripe Payment Links & Billing Portal!');
