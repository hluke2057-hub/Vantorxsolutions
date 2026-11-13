const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'website', 'demo', 'pro-tech-presentation.html');
let html = fs.readFileSync(filePath, 'utf8');

const oldCards = `      <!-- Tier 1 -->
      <div class="price-card">
        <div class="price-tier">0.6s Mobile Website</div>
        <div class="price-amount">$997 <span>flat</span></div>
        <div class="price-sub">One-time build · No monthly tech fee</div>
        <div class="feature-list" style="gap:8px">
          <div style="font-size:12.5px;color:#cbd5e1">✅ Sub-second mobile conversion site</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ Miami 24/7 emergency dispatch funnel</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ Google Maps Core Web Vitals Grade A</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ Domain &amp; hosting configuration</div>
        </div>
      </div>

      <!-- Tier 2 (Featured) -->
      <div class="price-card featured">
        <div class="featured-pill">BEST VALUE FOR PRO-TECH</div>
        <div class="price-tier" style="color:var(--gold)">The Pro-Tech Growth Bundle</div>
        <div class="price-amount">$997 <span>setup</span> + $297<span>/mo</span></div>
        <div class="price-sub">Complete Website + Ava 24/7 Voice AI</div>
        <div class="feature-list" style="gap:8px">
          <div style="font-size:12.5px;color:#fff;font-weight:700">⭐ EVERYTHING IN WEBSITE TIER</div>
          <div style="font-size:12.5px;color:#fff">✅ 24/7/365 Ava Voice AI Phone Receptionist</div>
          <div style="font-size:12.5px;color:#fff">✅ Custom Miami HVAC diagnostic qualification</div>
          <div style="font-size:12.5px;color:#fff">✅ Instant SMS dispatch straight to Carlin's truck</div>
          <div style="font-size:12.5px;color:#fff">✅ 48-Hour Rapid Deployment Guarantee</div>
        </div>
      </div>

      <!-- Tier 3 -->
      <div class="price-card">
        <div class="price-tier">Ava Voice AI Only</div>
        <div class="price-amount">$397 <span>/mo</span></div>
        <div class="price-sub">Zero setup fee on 6-month agreement</div>
        <div class="feature-list" style="gap:8px">
          <div style="font-size:12.5px;color:#cbd5e1">✅ Connects to your existing business phone</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ 24/7 Call coverage &amp; rollover</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ Full SMS ticket dispatch</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ Unlimited inbound emergency minutes</div>
        </div>
      </div>`;

const newCards = `      <!-- Tier 1 -->
      <div class="price-card">
        <div class="price-tier">0.6s Mobile Website</div>
        <div class="price-amount">$799 <span>flat</span></div>
        <div class="price-sub">One-time build · Zero monthly lock-in</div>
        <div class="feature-list" style="gap:8px;margin-bottom:16px">
          <div style="font-size:12.5px;color:#cbd5e1">✅ Sub-second mobile conversion site</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ Miami 24/7 emergency dispatch funnel</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ Google Maps Core Web Vitals Grade A</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ Interactive Ballpark Estimator widget</div>
        </div>
        <a href="https://buy.stripe.com/bJe9AT9um17x3plbyggw004" target="_blank" rel="noopener" style="display:block;text-align:center;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:10px;border-radius:10px;font-weight:700;font-size:13px;text-decoration:none;transition:all .2s">Launch Website ($799) 💳</a>
      </div>

      <!-- Tier 2 (Featured) -->
      <div class="price-card featured">
        <div class="featured-pill">BEST VALUE FOR PRO-TECH</div>
        <div class="price-tier" style="color:var(--gold)">Accelerate — Growth Bundle</div>
        <div class="price-amount">$997 <span>setup</span> + $697<span>/mo</span></div>
        <div class="price-sub">Complete Website + Ava 24/7 Voice AI + AEO</div>
        <div class="feature-list" style="gap:8px;margin-bottom:16px">
          <div style="font-size:12.5px;color:#fff;font-weight:700">⭐ EVERYTHING IN WEBSITE TIER</div>
          <div style="font-size:12.5px;color:#fff">✅ 24/7/365 Ava Voice AI Phone Receptionist</div>
          <div style="font-size:12.5px;color:#fff">✅ Custom Miami HVAC diagnostic qualification</div>
          <div style="font-size:12.5px;color:#fff">✅ Instant SMS dispatch straight to Carlin's truck</div>
          <div style="font-size:12.5px;color:#fff">✅ LeadFlow CRM + 45s Speed-to-Lead Auto SMS</div>
        </div>
        <a href="https://buy.stripe.com/28EeVddKC7vVf830TCgw002" target="_blank" rel="noopener" style="display:block;text-align:center;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#070a10;padding:12px;border-radius:10px;font-weight:800;font-size:14px;text-decoration:none;box-shadow:0 0 20px rgba(245,158,11,0.4)">Lock In Growth Bundle &rarr;</a>
      </div>

      <!-- Tier 3 -->
      <div class="price-card">
        <div class="price-tier">Ava Voice AI Receptionist</div>
        <div class="price-amount">$397 <span>/mo</span></div>
        <div class="price-sub">+ $497 One-Time Implementation</div>
        <div class="feature-list" style="gap:8px;margin-bottom:16px">
          <div style="font-size:12.5px;color:#cbd5e1">✅ Connects to existing (561) business line</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ 24/7 Call coverage &amp; rollover in 1 ring</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ Full SMS ticket dispatch to technicians</div>
          <div style="font-size:12.5px;color:#cbd5e1">✅ Bilingual Spanish &amp; English support</div>
        </div>
        <a href="https://buy.stripe.com/00w00j4a2g2r9NJgSAgw005" target="_blank" rel="noopener" style="display:block;text-align:center;background:rgba(56,189,248,0.15);border:1px solid #38bdf8;color:#38bdf8;padding:10px;border-radius:10px;font-weight:700;font-size:13px;text-decoration:none">Deploy Ava AI ($397/mo) 💳</a>
      </div>`;

if (html.includes(oldCards)) {
  html = html.replace(oldCards, newCards);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('✅ pro-tech-presentation.html updated with live Stripe payment buttons!');
} else {
  console.log('❌ Could not match oldCards exactly.');
}
