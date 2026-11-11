const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const highlightsDir = path.resolve('website/instagram-package/highlights');
const brainDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

[highlightsDir, brainDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const baseCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=JetBrains+Mono:wght@600;700;800&family=Syne:wght@800;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #060911;
    color: #F8FAFC;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    width: 1080px;
    height: 1920px;
    padding: 150px 76px 135px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .gold-text {
    background: linear-gradient(135deg, #FDE68A 0%, #F59E0B 55%, #D97706 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .emerald-text {
    background: linear-gradient(135deg, #A7F3D0 0%, #10B981 55%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .cyan-text {
    background: linear-gradient(135deg, #BAE6FD 0%, #38BDF8 55%, #0284C7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .card {
    background: rgba(13, 19, 33, 0.88);
    border: 1.5px solid rgba(255, 255, 255, 0.12);
    border-radius: 32px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    padding: 42px 44px;
  }
  .card-gold {
    border-color: rgba(245, 158, 11, 0.45);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 45px rgba(245, 158, 11, 0.14);
  }
  .card-emerald {
    border-color: rgba(16, 185, 129, 0.45);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 45px rgba(16, 185, 129, 0.14);
  }
  .card-cyan {
    border-color: rgba(56, 189, 248, 0.45);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 45px rgba(56, 189, 248, 0.14);
  }
  .card-red {
    background: rgba(26, 12, 18, 0.88);
    border-color: rgba(239, 68, 68, 0.45);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 45px rgba(239, 68, 68, 0.12);
  }

  .pill-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 26px;
    border-radius: 999px;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
  }

  .bullet-row {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 26px 32px;
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 24px;
  }
  .bullet-icon {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 900;
    flex-shrink: 0;
  }

  .cta-bar {
    padding: 30px 44px;
    border-radius: 26px;
    font-size: 28px;
    font-weight: 900;
    text-align: center;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

function buildSlide({
  categoryBadge,
  accentColor = '#F59E0B', // gold: #F59E0B, emerald: #10B981, cyan: #38BDF8
  slideNum,
  headlineHtml,
  subheadline,
  heroStat,
  heroStatLabel,
  bullets,
  ctaText,
  footerHint = 'Swipe Next ➔'
}) {
  const accentRgba = accentColor === '#10B981'
    ? 'rgba(16, 185, 129, 0.16)'
    : accentColor === '#38BDF8'
      ? 'rgba(56, 189, 248, 0.16)'
      : 'rgba(245, 158, 11, 0.16)';

  const accentBorder = accentColor === '#10B981'
    ? 'rgba(16, 185, 129, 0.45)'
    : accentColor === '#38BDF8'
      ? 'rgba(56, 189, 248, 0.45)'
      : 'rgba(245, 158, 11, 0.45)';

  const cardClass = accentColor === '#10B981'
    ? 'card card-emerald'
    : accentColor === '#38BDF8'
      ? 'card card-cyan'
      : 'card card-gold';

  const bulletsHtml = bullets.map(b => `
    <div class="bullet-row">
      <div class="bullet-icon" style="background:${accentRgba};border:1.5px solid ${accentBorder};color:${accentColor};">
        ${b.icon}
      </div>
      <div style="flex:1;">
        <div style="font-size:30px;font-weight:800;color:#FFFFFF;margin-bottom:6px;line-height:1.2;">${b.title}</div>
        <div style="font-size:24px;color:#CBD5E1;font-weight:500;line-height:1.35;">${b.desc}</div>
      </div>
    </div>
  `).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background: radial-gradient(circle at 50% 18%, #131D31 0%, #060911 78%);">
    <!-- Top Header -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:42px;">
        <div class="pill-badge" style="background:${accentRgba};border:1.5px solid ${accentBorder};color:${accentColor};">
          ${categoryBadge}
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;color:#94A3B8;letter-spacing:0.12em;">
          ${slideNum} / 3
        </div>
      </div>

      <h1 style="font-size:76px;font-weight:900;line-height:1.06;letter-spacing:-0.03em;margin-bottom:24px;">
        ${headlineHtml}
      </h1>
      <p style="font-size:32px;color:#94A3B8;line-height:1.38;font-weight:600;">
        ${subheadline}
      </p>
    </div>

    <!-- Center Hero Stat Box -->
    <div class="${cardClass}" style="display:flex;align-items:center;justify-content:space-between;gap:32px;padding:38px 46px;">
      <div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:800;color:${accentColor};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">
          ${heroStat.tag}
        </div>
        <div style="font-size:30px;font-weight:800;color:#F8FAFC;line-height:1.25;">
          ${heroStatLabel}
        </div>
      </div>
      <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:66px;font-weight:900;letter-spacing:-0.03em;color:${accentColor};line-height:1;flex-shrink:0;text-align:right;">
        ${heroStat.value}
      </div>
    </div>

    <!-- 3 Clean Scannable Points -->
    <div style="display:flex;flex-direction:column;gap:22px;">
      ${bulletsHtml}
    </div>

    <!-- Bottom CTA & Brand Footer -->
    <div>
      <div class="cta-bar" style="background:${accentColor};color:#060911;box-shadow:0 18px 45px ${accentRgba};margin-bottom:34px;">
        ${ctaText}
      </div>
      <div class="footer">
        <div style="font-size:24px;color:#94A3B8;font-weight:700;">${footerHint}</div>
        <div style="font-family:'Syne',sans-serif;font-weight:900;font-size:30px;color:#FFFFFF;letter-spacing:0.02em;">
          VANTOR<span style="color:${accentColor};">X</span>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

const slides = [
  // =========================================================================
  // HIGHLIGHT 1: OUR PACKAGES (3 PICTURES - ONE FOR EACH PACKAGE)
  // =========================================================================
  {
    filename: 'insta_highlight_01_packages_1_basic.png',
    category: '01_Packages',
    html: buildSlide({
      categoryBadge: '📦 PACKAGE 01 · BASIC TIER',
      accentColor: '#38BDF8',
      slideNum: 1,
      headlineHtml: 'BASIC: <span class="cyan-text">AI FRONT DESK</span>.',
      subheadline: 'Built for 1–5 truck contractors who miss calls while working on the job site.',
      heroStat: { tag: 'FLAT MONTHLY INVESTMENT', value: '$397/mo' },
      heroStatLabel: 'Never lose a job to voicemail again (+ $497 one-time setup).',
      bullets: [
        { icon: '📞', title: '24/7 AI Call Answering', desc: 'Answers every call in 0.8 seconds when you are on a ladder or after hours.' },
        { icon: '💬', title: 'Instant Missed-Call Textback', desc: 'Texts callers immediately to lock in their job details before they call a competitor.' },
        { icon: '📲', title: 'Instant Cell Summaries', desc: 'Sends full call audio and written job summaries straight to your cell phone.' }
      ],
      ctaText: '⚡ PERFECT FOR 1–5 TRUCK SHOPS · SWIPE FOR TIER 2',
      footerHint: 'Package 1 of 3 · Swipe Next ➔'
    })
  },
  {
    filename: 'insta_highlight_02_packages_2_accelerate.png',
    category: '01_Packages',
    html: buildSlide({
      categoryBadge: '📦 PACKAGE 02 · MOST POPULAR',
      accentColor: '#F59E0B',
      slideNum: 2,
      headlineHtml: 'ACCELERATE: <span class="gold-text">FULL STACK</span>.',
      subheadline: 'Our complete 4-pillar growth system that captures, qualifies, and books jobs 24/7.',
      heroStat: { tag: 'ALL 4 SYSTEMS INCLUDED', value: '$697/mo' },
      heroStatLabel: 'Replaces $1,800+/mo in disconnected agencies (+ $997 setup).',
      bullets: [
        { icon: '🤖', title: 'Ava 24/7 Voice AI + LeadFlow SMS', desc: '0.8s voice dispatch + 90-second automated SMS follow-up on every lead.' },
        { icon: '🌐', title: 'Custom 0.4s High-Converting Website', desc: 'Mobile-first contractor site with 1-tap emergency call & instant quote funnel.' },
        { icon: '🔍', title: 'Contractor AEO Search Engine', desc: 'Ranks your shop #1 when homeowners ask ChatGPT, Siri, & Google AI.' }
      ],
      ctaText: '🔥 MOST POPULAR GROWTH STACK · SWIPE FOR TIER 3',
      footerHint: 'Package 2 of 3 · Swipe Next ➔'
    })
  },
  {
    filename: 'insta_highlight_03_packages_3_scale.png',
    category: '01_Packages',
    html: buildSlide({
      categoryBadge: '📦 PACKAGE 03 · ENTERPRISE',
      accentColor: '#10B981',
      slideNum: 3,
      headlineHtml: 'SCALE: <span class="emerald-text">MULTI-CREW FLEET</span>.',
      subheadline: 'Enterprise autonomous dispatch built for high-volume 10 to 50+ truck operations.',
      heroStat: { tag: 'UNLIMITED CONCURRENT LINES', value: '$1,297/mo' },
      heroStatLabel: 'Answers 50+ storm/heatwave calls at once with 0s hold time.',
      bullets: [
        { icon: '🚚', title: 'Multi-Truck Territory Routing', desc: 'Automatically dispatches techs by zip code, trade certification, and live capacity.' },
        { icon: '🌎', title: 'Fluent English & Spanish Voice AI', desc: 'Switches languages mid-sentence seamlessly to book every homeowner.' },
        { icon: '🔄', title: '2-Way ServiceTitan & Housecall Sync', desc: 'Direct bi-directional CRM integration + dedicated VantorX account engineer.' }
      ],
      ctaText: '📲 DM "PACKAGES" TO PICK YOUR TIER',
      footerHint: 'Call Live Demo: (561) 813-8602'
    })
  },

  // =========================================================================
  // HIGHLIGHT 2: AVA VOICE AI (3 PICTURES)
  // =========================================================================
  {
    filename: 'insta_highlight_04_ava_1_problem.png',
    category: '02_AVA_Voice_AI',
    html: buildSlide({
      categoryBadge: '🎙️ AVA 24/7 VOICE AI',
      accentColor: '#F59E0B',
      slideNum: 1,
      headlineHtml: 'VOICEMAIL IS <span class="gold-text">KILLING</span> YOUR JOBS.',
      subheadline: 'When a pipe bursts or AC dies, homeowners do not leave voicemails—they call the next shop.',
      heroStat: { tag: 'HOMEOWNER BUYING BEHAVIOR', value: '78%' },
      heroStatLabel: 'Hire the FIRST contractor who answers the phone live.',
      bullets: [
        { icon: '❌', title: 'Every Missed Call = $1,500–$8,000 Lost', desc: 'Missing just 2 emergency calls a week costs your business $150,000+ a year.' },
        { icon: '⏳', title: 'Call Centers Put Leads on Hold', desc: 'Homeowners hang up after 45 seconds of hold music and dial your competitor.' },
        { icon: '⚡', title: 'Ava Answers Live in 0.8 Seconds', desc: 'Zero rings missed. Zero hold time. Nights, weekends, and holidays 24/7/365.' }
      ],
      ctaText: '⚡ SEE HOW AVA BOOKS JOBS ➔',
      footerHint: 'Ava 1 of 3 · Swipe Next ➔'
    })
  },
  {
    filename: 'insta_highlight_05_ava_2_how_it_works.png',
    category: '02_AVA_Voice_AI',
    html: buildSlide({
      categoryBadge: '🎙️ AVA 24/7 VOICE AI',
      accentColor: '#10B981',
      slideNum: 2,
      headlineHtml: 'HOW <span class="emerald-text">AVA</span> WORKS IN 3 STEPS.',
      subheadline: 'Natural human-sounding voice AI trained specifically on HVAC, Plumbing, Roofing & Electrical.',
      heroStat: { tag: 'PICKUP TO DISPATCH SPEED', value: '0.8s' },
      heroStatLabel: 'Instant live answer, qualification, and calendar booking.',
      bullets: [
        { icon: '1️⃣', title: 'Picks Up Live in 0.8 Seconds', desc: 'Greets callers in a warm, natural voice branded to your company name.' },
        { icon: '2️⃣', title: 'Qualifies Issue & Books Calendar', desc: 'Asks the right trade questions, checks your live slots, and locks in the appointment.' },
        { icon: '3️⃣', title: 'Texts Your Techs in 5 Seconds', desc: 'Sends homeowner name, address, issue summary, and map link straight to your crew.' }
      ],
      ctaText: '📞 TEST AVA LIVE ON SLIDE 3 ➔',
      footerHint: 'Ava 2 of 3 · Swipe Next ➔'
    })
  },
  {
    filename: 'insta_highlight_06_ava_3_live_demo.png',
    category: '02_AVA_Voice_AI',
    html: buildSlide({
      categoryBadge: '🎙️ AVA 24/7 VOICE AI',
      accentColor: '#F59E0B',
      slideNum: 3,
      headlineHtml: 'TEST <span class="gold-text">AVA LIVE</span> RIGHT NOW.',
      subheadline: 'Pretend you have a burst pipe or broken AC and see how fast Ava books your job.',
      heroStat: { tag: '24/7 LIVE DEMO HOTLINE', value: '561-813-8602' },
      heroStatLabel: 'Call right now or deploy Ava on your existing phone number in 48h.',
      bullets: [
        { icon: '💰', title: '$397/mo Flat Rate (No Per-Minute Fees)', desc: ' Costs 90% less than a $42,000/yr full-time office receptionist.' },
        { icon: '📱', title: 'Keep Your Current Business Number', desc: 'Works seamlessly with your existing cell or office line—no new hardware.' },
        { icon: '📈', title: '+$38,000/mo Average Recovered Revenue', desc: 'Captures the after-hours and on-the-job calls you used to miss.' }
      ],
      ctaText: '📲 CALL (561) 813-8602 OR DM "AVA"',
      footerHint: 'Live 24/7 Demo Line Ready'
    })
  },

  // =========================================================================
  // HIGHLIGHT 3: CUSTOM WEBSITE DESIGN (3 PICTURES)
  // =========================================================================
  {
    filename: 'insta_highlight_07_website_1_problem.png',
    category: '03_Custom_Website',
    html: buildSlide({
      categoryBadge: '🌐 CUSTOM WEBSITE DESIGN',
      accentColor: '#38BDF8',
      slideNum: 1,
      headlineHtml: 'SLOW WEBSITES <span class="cyan-text">BLEED LEADS</span>.',
      subheadline: '84% of homeowners search for contractors on their phone during an urgent repair.',
      heroStat: { tag: 'MOBILE BOUNCE RATE', value: '60%+' },
      heroStatLabel: 'Of homeowners leave if your website takes over 3 seconds to load.',
      bullets: [
        { icon: '🐌', title: 'Generic WordPress Sites Take 5.8s', desc: 'Bloated templates freeze on mobile, sending impatient callers back to Google.' },
        { icon: '🔍', title: 'Buried Phone Numbers & Dead Forms', desc: 'Homeowners will not pinch-and-zoom or fill out a 12-box contact form.' },
        { icon: '💸', title: 'Wasted Ad & Google Maps Traffic', desc: 'Every click you earn is wasted if your site fails to convert visitors into calls.' }
      ],
      ctaText: '⚡ SEE OUR 0.4s CONTRACTOR SITES ➔',
      footerHint: 'Websites 1 of 3 · Swipe Next ➔'
    })
  },
  {
    filename: 'insta_highlight_08_website_2_features.png',
    category: '03_Custom_Website',
    html: buildSlide({
      categoryBadge: '🌐 CUSTOM WEBSITE DESIGN',
      accentColor: '#10B981',
      slideNum: 2,
      headlineHtml: 'ENGINEERED TO <span class="emerald-text">CONVERT</span>.',
      subheadline: 'Custom-coded, mobile-first contractor websites built to turn visitors into booked jobs.',
      heroStat: { tag: 'VERIFIED MOBILE LOAD SPEED', value: '0.4s' },
      heroStatLabel: 'Loads 10x faster than industry average on iPhone & Android.',
      bullets: [
        { icon: '📲', title: 'Sticky 1-Tap Emergency Call Bar', desc: 'Thumb-friendly call and text buttons stays locked on screen as homeowners scroll.' },
        { icon: '🧮', title: 'Interactive 30-Second Quote Funnel', desc: 'Captures homeowner name, phone, and project scope in 3 quick taps.' },
        { icon: '⭐', title: 'Verified Google Reviews & Trust Badges', desc: 'Showcases your real 5-star reviews, licenses, and local work photos upfront.' }
      ],
      ctaText: '🚀 SEE RESULTS & PRICING ON SLIDE 3 ➔',
      footerHint: 'Websites 2 of 3 · Swipe Next ➔'
    })
  },
  {
    filename: 'insta_highlight_09_website_3_results.png',
    category: '03_Custom_Website',
    html: buildSlide({
      categoryBadge: '🌐 CUSTOM WEBSITE DESIGN',
      accentColor: '#38BDF8',
      slideNum: 3,
      headlineHtml: '<span class="cyan-text">3.4X MORE</span> BOOKED CALLS.',
      subheadline: 'Done-for-you design, copywriting, hosting, and AI lead capture launched in 7 days.',
      heroStat: { tag: 'STANDALONE OR IN ACCELERATE', value: '$297/mo' },
      heroStatLabel: 'Full custom build ($497 setup) or included free in Accelerate.',
      bullets: [
        { icon: '🛠️', title: '100% Built for the Trades', desc: 'Custom tailored for HVAC, Plumbing, Roofing, Electrical, and Remodeling.' },
        { icon: '🔗', title: 'Pre-Wired with Ava & LeadFlow SMS', desc: 'Every quote form triggers an instant 90-second SMS textback automatically.' },
        { icon: '⚡', title: '7-Day Turnkey Launch', desc: 'We handle domain, edge hosting, SSL security, and unlimited monthly edits.' }
      ],
      ctaText: '📲 DM "WEB" FOR A FREE WEBSITE AUDIT',
      footerHint: 'vantorxsolutions.com'
    })
  },

  // =========================================================================
  // HIGHLIGHT 4: AEO ENGINE (3 PICTURES)
  // =========================================================================
  {
    filename: 'insta_highlight_10_aeo_1_what_is_aeo.png',
    category: '04_AEO_Engine',
    html: buildSlide({
      categoryBadge: '🔍 CONTRACTOR AEO ENGINE',
      accentColor: '#F59E0B',
      slideNum: 1,
      headlineHtml: 'WHAT IS <span class="gold-text">AEO</span> SEARCH?',
      subheadline: 'Answer Engine Optimization—how contractors rank #1 on ChatGPT, Siri, & Google AI.',
      heroStat: { tag: 'LOCAL SEARCH SHIFT', value: '40%+' },
      heroStatLabel: 'Of local service searches now trigger AI answers instead of old links.',
      bullets: [
        { icon: '🤖', title: 'Homeowners Ask AI Who to Hire', desc: '"Hey Siri, who is the best emergency plumber near me?" gives 1 answer—not 10 links.' },
        { icon: '📉', title: 'Old-School SEO Is Fading Fast', desc: 'Traditional blog posts no longer put you at the top of Google AI Overviews.' },
        { icon: '🏆', title: 'AEO Makes You the #1 AI Recommendation', desc: 'We structure your company data so AI engines trust and recommend you first.' }
      ],
      ctaText: '⚡ SEE HOW THE AEO ENGINE WORKS ➔',
      footerHint: 'AEO Engine 1 of 3 · Swipe Next ➔'
    })
  },
  {
    filename: 'insta_highlight_11_aeo_2_how_it_works.png',
    category: '04_AEO_Engine',
    html: buildSlide({
      categoryBadge: '🔍 CONTRACTOR AEO ENGINE',
      accentColor: '#38BDF8',
      slideNum: 2,
      headlineHtml: 'HOW OUR <span class="cyan-text">AEO ENGINE</span> WORKS.',
      subheadline: 'We feed AI search engines the exact verified data they need to cite your business #1.',
      heroStat: { tag: 'VERIFIED DIRECTORY SYNC', value: '50+ Sites' },
      heroStatLabel: 'Synced across Google, Apple Maps, Bing, & AI training indexes.',
      bullets: [
        { icon: '🧠', title: 'Machine-Readable JSON-LD Schema', desc: 'Embeds your trade services, zip codes, licenses, and pricing directly for LLMs.' },
        { icon: '📍', title: '50+ Entity & Map Citation Sync', desc: 'Locks in 100% consistent business data across Google Maps 3-Pack & Apple Siri.' },
        { icon: '⭐', title: 'Automated 5-Star Review Velocity', desc: 'Texts happy customers after every job to build fresh Google reviews weekly.' }
      ],
      ctaText: '🥇 SEE AEO RESULTS & PRICING ➔',
      footerHint: 'AEO Engine 2 of 3 · Swipe Next ➔'
    })
  },
  {
    filename: 'insta_highlight_12_aeo_3_dominate.png',
    category: '04_AEO_Engine',
    html: buildSlide({
      categoryBadge: '🔍 CONTRACTOR AEO ENGINE',
      accentColor: '#10B981',
      slideNum: 3,
      headlineHtml: 'OWN THE <span class="emerald-text">#1 AI ANSWER</span>.',
      subheadline: 'Stop paying $1,500/mo for outdated SEO. Dominate modern AI & Google Maps search.',
      heroStat: { tag: 'STANDALONE OR IN ACCELERATE', value: '$197/mo' },
      heroStatLabel: 'Full AEO indexing ($197 setup) or included free in Accelerate.',
      bullets: [
        { icon: '🥇', title: 'Recommended by ChatGPT & Perplexity', desc: 'Become the top cited contractor when homeowners ask AI for local pros.' },
        { icon: '🗺️', title: 'Google Maps 3-Pack Authority', desc: 'Drives high-intent local calls without paying $80+ per click on Google Ads.' },
        { icon: '📊', title: '72-Hour Entity Deployment', desc: 'We audit, code, and deploy your complete AI search graph in 3 days.' }
      ],
      ctaText: '📲 DM "RANK" FOR A FREE AI SEARCH SCAN',
      footerHint: 'vantorxsolutions.com'
    })
  },

  // =========================================================================
  // HIGHLIGHT 5: LEAD FLOW (3 PICTURES)
  // =========================================================================
  {
    filename: 'insta_highlight_13_leadflow_1_90s_rule.png',
    category: '05_Lead_Flow',
    html: buildSlide({
      categoryBadge: '📲 LEADFLOW 90s SPEED-TO-LEAD',
      accentColor: '#10B981',
      slideNum: 1,
      headlineHtml: 'THE <span class="emerald-text">90-SECOND</span> RULE.',
      subheadline: 'Homeowners request quotes from 3 contractors at once. Speed wins the job every time.',
      heroStat: { tag: 'CONVERSION BOOST UNDER 90s', value: '+391%' },
      heroStatLabel: 'Higher close rate when you text a lead back within 90 seconds.',
      bullets: [
        { icon: '⏱️', title: 'Wait 5 Minutes = Lead Goes Cold', desc: 'After 5 minutes without a reply, your odds of booking that homeowner drop by 80%.' },
        { icon: '📵', title: 'You Cannot Text While on a Ladder', desc: 'Contractors lose thousands weekly because web forms sit unread in email inboxes.' },
        { icon: '⚡', title: 'LeadFlow Replies in Under 24 Seconds', desc: 'Starts a real 2-way SMS conversation with every lead the moment they reach out.' }
      ],
      ctaText: '⚡ SEE HOW LEADFLOW WORKS ➔',
      footerHint: 'LeadFlow 1 of 3 · Swipe Next ➔'
    })
  },
  {
    filename: 'insta_highlight_14_leadflow_2_how_it_works.png',
    category: '05_Lead_Flow',
    html: buildSlide({
      categoryBadge: '📲 LEADFLOW 90s SPEED-TO-LEAD',
      accentColor: '#F59E0B',
      slideNum: 2,
      headlineHtml: 'HOW <span class="gold-text">LEADFLOW</span> WORKS.',
      subheadline: 'Automated 2-way SMS that captures, qualifies, and follows up until the job is booked.',
      heroStat: { tag: 'AVERAGE SMS RESPONSE TIME', value: '24 Sec' },
      heroStatLabel: 'Instant 2-way text dispatch on every form, missed call, & ad lead.',
      bullets: [
        { icon: '💬', title: 'Instant 2-Way SMS Qualification', desc: 'Texts every web form and missed call immediately to gather job details & photos.' },
        { icon: '🔄', title: 'Automated Estimate Follow-Up', desc: 'Follows up on open quotes automatically on Day 1, Day 3, and Day 7 to close more jobs.' },
        { icon: '📅', title: 'Direct Calendar Booking Link', desc: 'Drops confirmed appointments straight onto your dispatch calendar.' }
      ],
      ctaText: '🚀 SEE RESULTS & PRICING ON SLIDE 3 ➔',
      footerHint: 'LeadFlow 2 of 3 · Swipe Next ➔'
    })
  },
  {
    filename: 'insta_highlight_15_leadflow_3_zero_leaks.png',
    category: '05_Lead_Flow',
    html: buildSlide({
      categoryBadge: '📲 LEADFLOW 90s SPEED-TO-LEAD',
      accentColor: '#10B981',
      slideNum: 3,
      headlineHtml: '<span class="emerald-text">ZERO LEADS</span> LEFT BEHIND.',
      subheadline: 'Every call, text, web form, and message unified into one automated pipeline.',
      heroStat: { tag: 'STANDALONE OR IN ACCELERATE', value: '$197/mo' },
      heroStatLabel: 'Full LeadFlow SMS engine ($197 setup) or included in Accelerate.',
      bullets: [
        { icon: '📥', title: 'One Unified Mobile Inbox', desc: 'See every customer text, call summary, and quote status from one app on your phone.' },
        { icon: '⭐', title: 'Auto 5-Star Google Review Requests', desc: 'Texts customers a 1-tap Google review link the moment you mark a job complete.' },
        { icon: '💰', title: '1 Closed Job Pays for a Full Year', desc: 'Recovering just one $2,500 job pays for LeadFlow for the entire year.' }
      ],
      ctaText: '📲 DM "SPEED" TO AUTOMATE YOUR LEADS',
      footerHint: 'Call Live Demo: (561) 813-8602'
    })
  }
];

async function run() {
  console.log('Rendering 15 Clean Professional Instagram Highlight Pictures (1080x1920)...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  const tempHtml = path.join(highlightsDir, '_temp_highlight_slide.html');

  for (const s of slides) {
    const catDir = path.join(highlightsDir, s.category);
    if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });

    fs.writeFileSync(tempHtml, s.html, 'utf8');
    await page.goto('file:///' + tempHtml.replace(/\\/g, '/'), { waitUntil: 'load', timeout: 15000 });
    await new Promise(r => setTimeout(r, 300));

    const buf = await page.screenshot({ type: 'png', omitBackground: false });

    // Save to category folder, flat highlights folder, and brain artifact folder
    fs.writeFileSync(path.join(catDir, s.filename), buf);
    fs.writeFileSync(path.join(highlightsDir, s.filename), buf);
    fs.writeFileSync(path.join(brainDir, s.filename), buf);

    console.log(`  [OK] ${s.filename} (${(buf.length / 1024).toFixed(1)} KB)`);
  }

  if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
  await browser.close();
  console.log('All 15 Instagram Highlight PNGs rendered and synced!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
