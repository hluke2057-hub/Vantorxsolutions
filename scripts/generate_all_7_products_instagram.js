const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const baseOutputDir = path.resolve('website/assets/instagram');
const allProductsDir = path.join(baseOutputDir, 'all_products');
const brainDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

// Ensure directories exist
[baseOutputDir, allProductsDir, brainDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Common CSS styling for all 1080x1920 slides
const baseCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Syne:wght@700;800;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #070A0F;
    color: #F8FAFC;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    width: 1080px;
    height: 1920px;
    padding: 130px 70px 110px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .gold-gradient-text {
    background: linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .green-gradient-text {
    background: linear-gradient(135deg, #A7F3D0 0%, #10B981 50%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cyan-gradient-text {
    background: linear-gradient(135deg, #BAE6FD 0%, #06B6D4 50%, #0284C7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .gold-glow {
    box-shadow: 0 0 50px rgba(245, 158, 11, 0.25);
  }

  .glass-card {
    background: rgba(14, 20, 32, 0.82);
    border: 1px solid rgba(245, 158, 11, 0.25);
    border-radius: 28px;
    backdrop-filter: blur(24px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .red-card {
    background: rgba(22, 12, 16, 0.82);
    border: 1px solid rgba(239, 68, 68, 0.35);
    border-radius: 28px;
    backdrop-filter: blur(24px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .badge-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 999px;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.35);
    color: #FBBF24;
    font-family: 'JetBrains Mono', monospace;
  }

  .cta-pill {
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    color: #070A0F;
    font-weight: 900;
    font-size: 25px;
    padding: 24px 44px;
    border-radius: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    letter-spacing: 0.02em;
    box-shadow: 0 15px 40px rgba(245, 158, 11, 0.45);
    text-transform: uppercase;
  }

  .footer-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

// Helper for top header
function renderHeader(tag, slideIndex, totalSlides = 3) {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:34px;">
      <div class="badge-tag">${tag}</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#94A3B8;letter-spacing:0.1em;">SLIDE ${slideIndex} OF ${totalSlides}</div>
    </div>
  `;
}

// Helper for bottom footer
function renderFooter(swipeText = "Swipe for How It Works ➔") {
  return `
    <div class="footer-bar">
      <div style="font-size:23px;color:#94A3B8;font-weight:600;">${swipeText}</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>
  `;
}

// ============================================================================
// PRODUCT 1: ACCELERATE GROWTH ENGINE (THE ALL-IN-ONE BUNDLE)
// ============================================================================

function getAccelerateSlide1() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 20%, #171E2E 0%, #070A0F 80%);">
    <div>
      ${renderHeader("⚡ THE ALL-IN-ONE GROWTH STACK", 1)}
      <h1 style="font-size:72px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:20px;">
        THE <span class="gold-gradient-text">$1,800/MO</span><br/>DISCONNECTED STACK.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.42;font-weight:500;">
        Why juggling 4 separate software subscriptions is silently killing your contractor profit.
      </p>
    </div>

    <div class="red-card" style="padding:46px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:26px;">⚠️</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:22px;color:#FCA5A5;">WHERE YOUR MONEY ACTUALLY GOES</span>
        </div>
        <div class="badge-tag" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.4);color:#F87171;font-size:16px;">
          BLEED: $1,800+/MO
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px;font-size:23px;color:#E2E8F0;line-height:1.45;">
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>$350/mo Call Center:</b> Robotic answering service puts callers on hold for 2 minutes and drops 38% of emergency jobs.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>$900/mo Web Retainer:</b> Built on bloated WordPress; takes 6 seconds to load on mobile and has no instant booking.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>$550/mo Misc Tools:</b> Disconnected SMS bots and Zapier zaps that break every time your CRM updates.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>The Worst Part:</b> Zero unified intelligence. Leads still wait 45 minutes for a human call-back.</span>
        </div>
      </div>
    </div>

    <div class="glass-card" style="padding:38px;display:flex;align-items:center;gap:34px;">
      <div style="font-size:86px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;">
        78%
      </div>
      <div style="font-size:25px;color:#E2E8F0;line-height:1.35;font-weight:600;">
        of high-ticket homeowners hire the <span class="gold-gradient-text" style="font-weight:800;">FIRST contractor</span> who answers live or texts back in under 90s.
      </div>
    </div>

    ${renderFooter("Swipe for the Complete Unified Solution ➔")}
  </body>
  </html>
  `;
}

function getAccelerateSlide2() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 20%, #162238 0%, #070A0F 80%);">
    <div>
      ${renderHeader("⚡ THE ALL-IN-ONE GROWTH STACK", 2)}
      <h1 style="font-size:72px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:20px;">
        THE <span class="gold-gradient-text">ACCELERATE</span><br/>GROWTH ENGINE.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.42;font-weight:500;">
        One fully integrated tech stack engineered exclusively for high-ticket trade contractors.
      </p>
    </div>

    <!-- 4 Unified Pillars Grid -->
    <div style="display:flex;flex-direction:column;gap:18px;">
      <div class="glass-card" style="padding:28px 32px;display:flex;align-items:center;gap:24px;">
        <div style="font-size:42px;">📞</div>
        <div style="flex:1;">
          <div style="font-size:24px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">1. Ava 24/7 Voice AI Receptionist</div>
          <div style="font-size:19px;color:#94A3B8;line-height:1.35;">Sub-1s pickup, emergency dispatch, live calendar booking, zero hold music.</div>
        </div>
        <div class="badge-tag" style="font-size:15px;padding:6px 14px;">0.8s LATENCY</div>
      </div>

      <div class="glass-card" style="padding:28px 32px;display:flex;align-items:center;gap:24px;">
        <div style="font-size:42px;">📲</div>
        <div style="flex:1;">
          <div style="font-size:24px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">2. LeadFlow 90s Speed-to-Lead</div>
          <div style="font-size:19px;color:#94A3B8;line-height:1.35;">Instant automated conversational SMS textback to every missed call & webform lead.</div>
        </div>
        <div class="badge-tag" style="font-size:15px;padding:6px 14px;">&lt; 90s DISPATCH</div>
      </div>

      <div class="glass-card" style="padding:28px 32px;display:flex;align-items:center;gap:24px;">
        <div style="font-size:42px;">🌐</div>
        <div style="flex:1;">
          <div style="font-size:24px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">3. Custom High-Converting Website</div>
          <div style="font-size:19px;color:#94A3B8;line-height:1.35;">Sub-second mobile speed, sticky tap-to-call, live emergency estimate calculator.</div>
        </div>
        <div class="badge-tag" style="font-size:15px;padding:6px 14px;">0.4s SPEED</div>
      </div>

      <div class="glass-card" style="padding:28px 32px;display:flex;align-items:center;gap:24px;">
        <div style="font-size:42px;">🔍</div>
        <div style="flex:1;">
          <div style="font-size:24px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">4. Contractor AEO Engine</div>
          <div style="font-size:19px;color:#94A3B8;line-height:1.35;">Structured entity data indexing you directly into ChatGPT, Perplexity, & Siri searches.</div>
        </div>
        <div class="badge-tag" style="font-size:15px;padding:6px 14px;">#1 AI CITATION</div>
      </div>
    </div>

    <!-- Telemetry banner -->
    <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:20px;padding:24px 32px;display:flex;justify-content:space-between;align-items:center;">
      <div style="font-size:21px;font-weight:700;color:#FBBF24;">⚡ 100% DONE-FOR-YOU SETUP</div>
      <div style="font-size:19px;color:#CBD5E1;">We configure, test, and deploy everything in 7 days.</div>
    </div>

    ${renderFooter("Swipe for Verified Pricing & Live Demo ➔")}
  </body>
  </html>
  `;
}

function getAccelerateSlide3() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #1F2C42 0%, #070A0F 80%);">
    <div>
      ${renderHeader("⚡ THE ALL-IN-ONE GROWTH STACK", 3)}
      <h1 style="font-size:72px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:20px;">
        <span class="gold-gradient-text">TRANSPARENT</span><br/>PRICING & ROI.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.42;font-weight:500;">
        No hidden tiers. No long-term lock-in. Pay once for setup, then flat monthly.
      </p>
    </div>

    <!-- 3 Metrics Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$697</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Monthly All-In</div>
        <div style="font-size:15px;color:#94A3B8;">All 4 systems included</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$997</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">One-Time Setup</div>
        <div style="font-size:15px;color:#94A3B8;">Full build & 7d rollout</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#FBBF24;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">+$38k</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Avg Recovered/Mo</div>
        <div style="font-size:15px;color:#94A3B8;">Verified trade ROI</div>
      </div>
    </div>

    <!-- Live Test Dial Box -->
    <div class="glass-card gold-glow" style="padding:44px;border-color:rgba(245, 158, 11, 0.6);background:linear-gradient(135deg, rgba(20,28,45,0.9) 0%, rgba(12,17,28,0.9) 100%);">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
        <div style="font-size:30px;">📞</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:21px;font-weight:800;color:#FBBF24;letter-spacing:0.08em;">TEST OUR LIVE DEMO LINE RIGHT NOW</div>
      </div>
      
      <div style="font-size:24px;color:#CBD5E1;font-weight:500;margin-bottom:20px;line-height:1.4;">
        Call directly from your smartphone. Speak naturally, ask for pricing, or test an emergency dispatch:
      </div>

      <div style="background:rgba(0,0,0,0.6);border:2px dashed rgba(245,158,11,0.5);border-radius:18px;padding:24px;text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:50px;font-weight:900;color:#FBBF24;letter-spacing:0.04em;">
          (561) 813-8602
        </div>
        <div style="font-size:17px;color:#94A3B8;margin-top:6px;">Live 24/7/365 · Tap to call or dial directly</div>
      </div>
    </div>

    <!-- Action CTA Button -->
    <div class="cta-pill">
      <span>🚀</span> DM "ACCELERATE" TO CLAIM 1 OF 5 MONTHLY SLOTS
    </div>

    <div class="footer-bar">
      <div style="font-size:22px;color:#94A3B8;font-weight:600;">Visit vantorxsolutions.com</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>
  </body>
  </html>
  `;
}

// ============================================================================
// PRODUCT 2: AVA 24/7 VOICE AI RECEPTIONIST
// ============================================================================

function getAvaSlide1() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 20%, #151D2C 0%, #070A0F 80%);">
    <div>
      ${renderHeader("📞 PRODUCT 02 · 24/7 VOICE AI", 1)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        THE <span class="gold-gradient-text">$8,200 VOICEMAIL</span><br/>GRAVEYARD.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Why 78% of your paid marketing dollars vanish the second you don't answer.
      </p>
    </div>

    <!-- Centerpiece Visual: The Missed Emergency Call -->
    <div class="red-card" style="padding:46px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:18px;height:18px;border-radius:50%;background:#EF4444;box-shadow:0 0 16px #EF4444;"></div>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:21px;color:#FCA5A5;letter-spacing:0.08em;">MISSED EMERGENCY INQUIRY</span>
        </div>
        <span style="font-family:'JetBrains Mono',monospace;font-size:19px;color:#64748B;">Sunday 8:42 PM</span>
      </div>

      <div style="background:rgba(0,0,0,0.5);border-radius:18px;padding:28px;margin-bottom:26px;border:1px solid rgba(255,255,255,0.06);">
        <div style="font-size:30px;font-weight:800;color:#FFFFFF;margin-bottom:6px;">Caller: Emergency AC Replacement</div>
        <div style="font-size:21px;color:#94A3B8;margin-bottom:16px;">Residential Homeowner · Boca Raton, FL</div>
        <div style="font-size:21px;color:#EF4444;font-weight:700;display:flex;align-items:center;gap:10px;">
          <span>⚠️</span> Status: Voicemail Left (No Live Answer)
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px;font-size:23px;color:#CBD5E1;line-height:1.45;">
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>8:43 PM:</b> Homeowner hung up after hearing your voicemail greeting.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>8:45 PM:</b> Homeowner dialed the next contractor on Google Maps.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>8:46 PM:</b> Competitor answered live and booked the <b>$8,200 changeout</b>.</span>
        </div>
      </div>
    </div>

    <!-- Stat Callout Card -->
    <div class="glass-card" style="padding:38px;display:flex;align-items:center;gap:34px;">
      <div style="font-size:88px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;">
        62%
      </div>
      <div style="font-size:25px;color:#E2E8F0;line-height:1.35;font-weight:600;">
        of trade contractor calls occur after 5 PM, on weekends, or while technicians are on active jobs.
      </div>
    </div>

    ${renderFooter("Swipe for How Ava Answers in 0.8s ➔")}
  </body>
  </html>
  `;
}

function getAvaSlide2() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #182236 0%, #070A0F 80%);">
    <div>
      ${renderHeader("📞 PRODUCT 02 · 24/7 VOICE AI", 2)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        MEET <span class="gold-gradient-text">AVA</span>.<br/>0.8s ANSWER SPEED.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Answers like an executive dispatcher. Triages urgency. Books appointments live.
      </p>
    </div>

    <!-- Live Telemetry Card -->
    <div class="glass-card" style="padding:40px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:16px;height:16px;border-radius:50%;background:#10B981;box-shadow:0 0 14px #10B981;"></div>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:#34D399;">CALL ACTIVE · 00:42</span>
        </div>
        <div class="badge-tag" style="font-size:14px;padding:6px 14px;">PICKUP: 0.81s</div>
      </div>

      <!-- Dialogue Bubbles -->
      <div style="display:flex;flex-direction:column;gap:18px;margin-bottom:26px;">
        <div style="background:rgba(255,255,255,0.06);border-radius:18px;padding:22px 26px;max-width:88%;">
          <div style="font-size:15px;font-family:'JetBrains Mono',monospace;color:#94A3B8;margin-bottom:6px;">HOMEOWNER (LIVE CALLER)</div>
          <div style="font-size:22px;color:#FFFFFF;line-height:1.4;">"Hey, my master bathroom pipe just burst and water is flooding into my hallway!"</div>
        </div>

        <div style="background:linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 100%);border:1px solid rgba(245,158,11,0.4);border-radius:18px;padding:22px 26px;max-width:92%;align-self:flex-end;">
          <div style="font-size:15px;font-family:'JetBrains Mono',monospace;color:#FDE68A;margin-bottom:6px;">AVA (24/7 VOICE AI)</div>
          <div style="font-size:22px;color:#FFFFFF;line-height:1.4;">"I understand, that's an urgent emergency. I'm locking in an emergency priority dispatch right now. What's your home address?"</div>
        </div>
      </div>

      <!-- Audio Waveform Graphic -->
      <div style="display:flex;align-items:center;justify-content:center;gap:7px;height:44px;background:rgba(0,0,0,0.4);border-radius:14px;">
        <div style="width:5px;height:16px;background:#F59E0B;border-radius:4px;"></div>
        <div style="width:5px;height:32px;background:#FBBF24;border-radius:4px;"></div>
        <div style="width:5px;height:42px;background:#F59E0B;border-radius:4px;"></div>
        <div style="width:5px;height:22px;background:#D97706;border-radius:4px;"></div>
        <div style="width:5px;height:36px;background:#F59E0B;border-radius:4px;"></div>
        <div style="width:5px;height:14px;background:#B45309;border-radius:4px;"></div>
      </div>
    </div>

    <!-- 4 Capabilities Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
      <div class="glass-card" style="padding:26px 22px;">
        <div style="font-size:30px;margin-bottom:8px;">⚡</div>
        <div style="font-size:21px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">0.8s Pickup</div>
        <div style="font-size:17px;color:#94A3B8;line-height:1.35;">Never puts callers on hold or lets them drop to voicemail.</div>
      </div>
      <div class="glass-card" style="padding:26px 22px;">
        <div style="font-size:30px;margin-bottom:8px;">📅</div>
        <div style="font-size:21px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Direct Booking</div>
        <div style="font-size:17px;color:#94A3B8;line-height:1.35;">Syncs to ServiceTitan, Housecall Pro, &amp; Google Cal.</div>
      </div>
      <div class="glass-card" style="padding:26px 22px;">
        <div style="font-size:30px;margin-bottom:8px;">🛡️</div>
        <div style="font-size:21px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Emergency Triage</div>
        <div style="font-size:17px;color:#94A3B8;line-height:1.35;">Screens price shoppers and collects address &amp; job specs.</div>
      </div>
      <div class="glass-card" style="padding:26px 22px;">
        <div style="font-size:30px;margin-bottom:8px;">📲</div>
        <div style="font-size:21px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Instant SMS Dispatch</div>
        <div style="font-size:17px;color:#94A3B8;line-height:1.35;">Texts on-call tech the full audio clip &amp; transcript summary.</div>
      </div>
    </div>

    ${renderFooter("Swipe for Pricing & Live Test Dial ➔")}
  </body>
  </html>
  `;
}

function getAvaSlide3() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #1E2838 0%, #070A0F 80%);">
    <div>
      ${renderHeader("📞 PRODUCT 02 · 24/7 VOICE AI", 3)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        <span class="gold-gradient-text">$397/MO</span><br/>ZERO MISSED CALLS.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Replaces a $3,500/mo human receptionist with 24/7/365 coverage that never sleeps.
      </p>
    </div>

    <!-- 3 Metrics Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$397</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Monthly Rate</div>
        <div style="font-size:15px;color:#94A3B8;">Unlimited 24/7 calls</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$497</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">One-Time Setup</div>
        <div style="font-size:15px;color:#94A3B8;">Custom training in 48h</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#FBBF24;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">100%</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Answer Rate</div>
        <div style="font-size:15px;color:#94A3B8;">Zero dropped jobs</div>
      </div>
    </div>

    <!-- Test Live Dial Box -->
    <div class="glass-card gold-glow" style="padding:44px;border-color:rgba(245, 158, 11, 0.6);background:linear-gradient(135deg, rgba(20,28,45,0.9) 0%, rgba(12,17,28,0.9) 100%);">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">
        <div style="font-size:30px;">📞</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:21px;font-weight:800;color:#FBBF24;letter-spacing:0.08em;">TEST AVA LIVE RIGHT NOW</div>
      </div>
      
      <div style="font-size:26px;color:#FFFFFF;font-weight:600;margin-bottom:22px;line-height:1.4;">
        Call our live demonstration line from your phone. Speak normally or simulate an emergency leak:
      </div>

      <div style="background:rgba(0,0,0,0.6);border:2px dashed rgba(245,158,11,0.5);border-radius:18px;padding:26px;text-align:center;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:50px;font-weight:900;color:#FBBF24;letter-spacing:0.05em;">
          (561) 813-8602
        </div>
        <div style="font-size:17px;color:#94A3B8;margin-top:6px;">Available 24/7/365 · Tap to call or dial directly</div>
      </div>
    </div>

    <!-- Action CTA Button -->
    <div class="cta-pill">
      <span>💬</span> DM "AVA" TO INSTALL ON YOUR PHONE IN 48 HOURS
    </div>

    <div class="footer-bar">
      <div style="font-size:22px;color:#94A3B8;font-weight:600;">Full turnkey rollout in 48 hours</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>
  </body>
  </html>
  `;
}

// ============================================================================
// PRODUCT 3: BASIC PACKAGE: AI FRONT DESK
// ============================================================================

function getBasicSlide1() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 20%, #161F2E 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🛡️ PRODUCT 03 · AI FRONT DESK", 1)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        JUGGLING CALLS <span class="gold-gradient-text">ON THE ROOF</span>?
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        You can't answer calls while holding a torch, pulling wire, or crawling under a house.
      </p>
    </div>

    <div class="red-card" style="padding:46px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:26px;">⚠️</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:21px;color:#FCA5A5;">THE 1-TO-5 TRUCK TRADEOFF</span>
        </div>
        <div class="badge-tag" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.4);color:#F87171;font-size:16px;">
          LOST: $14,000+/MO
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:18px;font-size:23px;color:#E2E8F0;line-height:1.45;">
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>The Problem:</b> When you're working with your hands, your phone rings. If you stop to answer, you lose billable job time.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>If You Don't Answer:</b> That homeowner needed an emergency service call today and called the next guy within 3 minutes.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>The Traditional Fix:</b> Hiring an office manager costs <b>$42,000/yr + payroll taxes</b>, and they still go home at 5 PM.</span>
        </div>
      </div>
    </div>

    <div class="glass-card" style="padding:38px;display:flex;align-items:center;gap:34px;">
      <div style="font-size:86px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;">
        8-15
      </div>
      <div style="font-size:25px;color:#E2E8F0;line-height:1.35;font-weight:600;">
        high-intent trade calls are missed every month by solo & small contractors while working on job sites.
      </div>
    </div>

    ${renderFooter("Swipe for the Basic AI Front Desk ➔")}
  </body>
  </html>
  `;
}

function getBasicSlide2() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #182236 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🛡️ PRODUCT 03 · AI FRONT DESK", 2)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        BASIC PACKAGE: <span class="gold-gradient-text">AI FRONT DESK</span>.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        The essential automated receptionist every 1–5 truck contractor needs to operate cleanly.
      </p>
    </div>

    <!-- 4 Core Pillars Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">📞</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Auto Voice Answering</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Picks up whenever you are busy on a ladder, driving, or after hours.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">💬</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Instant SMS Textback</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Texts callers immediately with quote intake so they stop dialing competitors.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">📄</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Instant Cell Transcripts</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Full audio recording and written dossier texted straight to your phone.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">🚨</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Emergency Pass-Through</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Urgent high-ticket calls can be automatically forwarded directly to your cell.</div>
      </div>
    </div>

    <!-- Live simulation summary box -->
    <div class="glass-card" style="padding:32px;display:flex;align-items:center;gap:24px;">
      <div style="font-size:40px;">📱</div>
      <div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Keep Your Existing Phone Number</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.35;">Zero hardware to buy. We simply connect to your existing mobile or office number.</div>
      </div>
    </div>

    ${renderFooter("Swipe for Simple Pricing & Setup ➔")}
  </body>
  </html>
  `;
}

function getBasicSlide3() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #1D273A 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🛡️ PRODUCT 03 · AI FRONT DESK", 3)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        <span class="gold-gradient-text">$397/MO</span><br/>FLAT & SIMPLE.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Never lose another job while on the clock. 100% turnkey setup in 24 hours.
      </p>
    </div>

    <!-- 3 Metrics Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$397</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Monthly Rate</div>
        <div style="font-size:15px;color:#94A3B8;">Flat rate, no surprises</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$497</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">One-Time Setup</div>
        <div style="font-size:15px;color:#94A3B8;">Live in 24-48 hours</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#FBBF24;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">15+ Hrs</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Saved Every Week</div>
        <div style="font-size:15px;color:#94A3B8;">Focus on paid work</div>
      </div>
    </div>

    <!-- Peace of Mind Box -->
    <div class="glass-card gold-glow" style="padding:44px;border-color:rgba(245, 158, 11, 0.6);background:linear-gradient(135deg, rgba(20,28,45,0.9) 0%, rgba(12,17,28,0.9) 100%);">
      <div style="font-family:'JetBrains Mono',monospace;font-size:21px;font-weight:800;color:#FBBF24;letter-spacing:0.08em;margin-bottom:18px;">
        WHAT'S INCLUDED IN THE BASIC TIER:
      </div>
      
      <div style="display:flex;flex-direction:column;gap:14px;font-size:21px;color:#CBD5E1;">
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Dedicated Voice AI Front Desk:</b> Trained on your business trade & prices.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Missed-Call SMS Auto-Responder:</b> Instantly texts caller intake details.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Cell Phone Notification Alerts:</b> Full transcript & audio sent immediately.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Live Demo Phone Line:</b> Dial (561) 813-8602 to test right now.</span>
        </div>
      </div>
    </div>

    <!-- Action CTA Button -->
    <div class="cta-pill">
      <span>📞</span> DM "BASIC" TO STOP MISSING CALLS ON THE JOB
    </div>

    <div class="footer-bar">
      <div style="font-size:22px;color:#94A3B8;font-weight:600;">Fast 24-hour setup</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>
  </body>
  </html>
  `;
}

// ============================================================================
// PRODUCT 4: SCALE ENTERPRISE INFRASTRUCTURE
// ============================================================================

function getScaleSlide1() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 20%, #151F33 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🏢 PRODUCT 04 · ENTERPRISE SCALE", 1)}
      <h1 style="font-size:72px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:20px;">
        GROWING PAST <span class="gold-gradient-text">10 TRUCKS</span>?<br/>THE BOTTLENECK.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.42;font-weight:500;">
        Why human call centers collapse during peak weather freezes, storms, and heatwaves.
      </p>
    </div>

    <div class="red-card" style="padding:46px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:26px;">⚠️</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:21px;color:#FCA5A5;">THE HIGH-VOLUME FLEET CRASH</span>
        </div>
        <div class="badge-tag" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.4);color:#F87171;font-size:16px;">
          OVERHEAD: $16k+/MO
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:18px;font-size:23px;color:#E2E8F0;line-height:1.45;">
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>Call Spikes Crash Lines:</b> Summer heatwave or winter storm hits. 40 calls arrive in 15 minutes. 3 dispatchers can't keep up.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>35% Abandonment Rate:</b> Callers sit on hold for 12 minutes, hang up in frustration, and book a rival contractor.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>Spanish Language Barrier:</b> High-ticket Hispanic homeowners get put on hold or hung up on due to no bilingual dispatcher.</span>
        </div>
      </div>
    </div>

    <div class="glass-card" style="padding:38px;display:flex;align-items:center;gap:34px;">
      <div style="font-size:86px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;">
        $16k
      </div>
      <div style="font-size:25px;color:#E2E8F0;line-height:1.35;font-weight:600;">
        average monthly payroll for a 4-person in-house dispatch team that still drops calls during peak call surges.
      </div>
    </div>

    ${renderFooter("Swipe for Enterprise Autonomous Dispatch ➔")}
  </body>
  </html>
  `;
}

function getScaleSlide2() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #18253D 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🏢 PRODUCT 04 · ENTERPRISE SCALE", 2)}
      <h1 style="font-size:72px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:20px;">
        AUTONOMOUS <span class="gold-gradient-text">MULTI-CREW</span><br/>DISPATCH FLEET.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.42;font-weight:500;">
        Engineered for 10–50 truck operations requiring zero-latency concurrent call handling.
      </p>
    </div>

    <!-- 4 Capabilities Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">🚚</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Multi-Truck Routing</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Dispatches jobs automatically by technician territory, skill certification, & schedule.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">🌐</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Fluent Bilingual AI</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Real-time seamless English & Spanish switching with zero lag or human transfer needed.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">🔄</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">2-Way ServiceTitan Sync</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Direct bi-directional enterprise ERP sync, job tag categorization, & GPS routing.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">⚡</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">50+ Concurrent Lines</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Picks up 50 emergency calls at the exact same second with zero hold time.</div>
      </div>
    </div>

    <div class="glass-card" style="padding:32px;display:flex;align-items:center;gap:24px;">
      <div style="font-size:40px;">🛡️</div>
      <div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Enterprise SLA & VIP Support</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.35;">99.99% uptime guarantee, dedicated account engineer, & custom dispatch rules.</div>
      </div>
    </div>

    ${renderFooter("Swipe for Enterprise Pricing & Architecture ➔")}
  </body>
  </html>
  `;
}

function getScaleSlide3() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #202F4C 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🏢 PRODUCT 04 · ENTERPRISE SCALE", 3)}
      <h1 style="font-size:72px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:20px;">
        <span class="gold-gradient-text">$1,297/MO</span><br/>ENTERPRISE SCALE.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.42;font-weight:500;">
        Massive cost savings vs in-house call centers with infinite concurrent scale.
      </p>
    </div>

    <!-- 3 Metrics Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:52px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$1,297</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Monthly Flat</div>
        <div style="font-size:15px;color:#94A3B8;">Unlimited concurrent lines</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:52px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$1,497</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Enterprise Setup</div>
        <div style="font-size:15px;color:#94A3B8;">Custom CRM architecture</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:52px;font-weight:900;color:#FBBF24;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">50+ Calls</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Handled at Once</div>
        <div style="font-size:15px;color:#94A3B8;">0-second hold time</div>
      </div>
    </div>

    <!-- Live Test Box -->
    <div class="glass-card gold-glow" style="padding:44px;border-color:rgba(245, 158, 11, 0.6);background:linear-gradient(135deg, rgba(20,28,45,0.9) 0%, rgba(12,17,28,0.9) 100%);">
      <div style="font-family:'JetBrains Mono',monospace;font-size:21px;font-weight:800;color:#FBBF24;letter-spacing:0.08em;margin-bottom:18px;">
        WHAT ENTERPRISE INCLUDES:
      </div>
      
      <div style="display:flex;flex-direction:column;gap:14px;font-size:21px;color:#CBD5E1;">
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Unlimited Multi-Truck Inbound Channels:</b> Zero busy signals ever.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Bilingual Spanish/English Model:</b> Capture high-ticket Hispanic markets.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Direct ERP & ServiceTitan Two-Way Sync:</b> Automatic job ticket generation.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Live Demo Phone Line:</b> Dial (561) 813-8602 to experience the voice AI.</span>
        </div>
      </div>
    </div>

    <!-- Action CTA Button -->
    <div class="cta-pill">
      <span>🏢</span> DM "SCALE" FOR A PRIVATE FLEET CONSULTATION
    </div>

    <div class="footer-bar">
      <div style="font-size:22px;color:#94A3B8;font-weight:600;">Custom fleet engineering</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>
  </body>
  </html>
  `;
}

// ============================================================================
// PRODUCT 5: CUSTOM HIGH-CONVERTING MOBILE WEBSITE
// ============================================================================

function getWebsiteSlide1() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 20%, #171E2D 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🌐 PRODUCT 05 · TRADE WEBSITES", 1)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        YOUR SLOW SITE IS <span class="gold-gradient-text">BLEEDING</span> JOBS.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Why 53% of paid Google Ads traffic bounces before ever seeing your phone number.
      </p>
    </div>

    <div class="red-card" style="padding:46px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:26px;">⚠️</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:21px;color:#FCA5A5;">THE BLOATED TEMPLATE TRAP</span>
        </div>
        <div class="badge-tag" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.4);color:#F87171;font-size:16px;">
          SPEED SCORE: 28/100
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:18px;font-size:23px;color:#E2E8F0;line-height:1.45;">
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>5.8-Second Mobile Load:</b> Homeowner taps your Google ad, stares at a blank white screen for 4 seconds, and hits 'Back'.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>Buried Phone Numbers:</b> No sticky tap-to-call button. No upfront pricing guide. Just an ugly generic contact form.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>$2,500/Mo Wasted:</b> You pay $65 to $120 per click on Google Local Services, and over half of those clicks leave instantly.</span>
        </div>
      </div>
    </div>

    <div class="glass-card" style="padding:38px;display:flex;align-items:center;gap:34px;">
      <div style="font-size:86px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;">
        -20%
      </div>
      <div style="font-size:25px;color:#E2E8F0;line-height:1.35;font-weight:600;">
        in contractor conversion rate for <span class="gold-gradient-text" style="font-weight:800;">every single 1-second delay</span> on mobile load time.
      </div>
    </div>

    ${renderFooter("Swipe for Sub-Second Engineering ➔")}
  </body>
  </html>
  `;
}

function getWebsiteSlide2() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #182338 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🌐 PRODUCT 05 · TRADE WEBSITES", 2)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        SUB-0.8s MOBILE <span class="gold-gradient-text">PERFORMANCE</span>.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Handcrafted for speed. Sticky tap-to-call. Upfront instant job estimate calculator.
      </p>
    </div>

    <!-- 4 Capabilities Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">⚡</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">0.4s Edge Load</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Zero WordPress plugins. Instant delivery on worldwide high-speed CDN.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">📱</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Sticky Tap-to-Call</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">One prominent thumb tap dials your office or dispatches Ava immediately.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">🧮</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Price Calculator</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Interactive pricing tool captures qualified phone numbers right on the page.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">🔍</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">AEO & Schema Ready</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Formatted for Google Local Pack, Apple Maps, and AI search crawlers.</div>
      </div>
    </div>

    <div class="glass-card" style="padding:32px;display:flex;align-items:center;gap:24px;">
      <div style="font-size:40px;">⏱️</div>
      <div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Turnkey 7-Day Live Launch</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.35;">We write all the copy, design custom assets, and launch your site live in 7 days.</div>
      </div>
    </div>

    ${renderFooter("Swipe for Verified Pricing & Deliverables ➔")}
  </body>
  </html>
  `;
}

function getWebsiteSlide3() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #1F2A3D 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🌐 PRODUCT 05 · TRADE WEBSITES", 3)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        <span class="gold-gradient-text">3.4X HIGHER</span><br/>VISITOR CALL RATE.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Turn high-intent local homeowners into booked appointments with zero ad spend increase.
      </p>
    </div>

    <!-- 3 Metrics Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$297</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Monthly Hosting</div>
        <div style="font-size:15px;color:#94A3B8;">Edge CDN + updates</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$497</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">One-Time Build</div>
        <div style="font-size:15px;color:#94A3B8;">Custom 7-day launch</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#FBBF24;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">3.4x</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Call Volume</div>
        <div style="font-size:15px;color:#94A3B8;">From same ad spend</div>
      </div>
    </div>

    <!-- What's Included Box -->
    <div class="glass-card gold-glow" style="padding:44px;border-color:rgba(245, 158, 11, 0.6);background:linear-gradient(135deg, rgba(20,28,45,0.9) 0%, rgba(12,17,28,0.9) 100%);">
      <div style="font-family:'JetBrains Mono',monospace;font-size:21px;font-weight:800;color:#FBBF24;letter-spacing:0.08em;margin-bottom:18px;">
        DONE-FOR-YOU CONTRACTOR PACKAGE:
      </div>
      
      <div style="display:flex;flex-direction:column;gap:14px;font-size:21px;color:#CBD5E1;">
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Custom Branding & Edge CDN:</b> Zero slow hosting, sub-second load.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Emergency Job Cost Estimator:</b> Built right into your homepage.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>AEO & Google Local Schema:</b> Direct AI search citations.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Integrated Ava Voice AI Ready:</b> Seamless live call routing.</span>
        </div>
      </div>
    </div>

    <!-- Action CTA Button -->
    <div class="cta-pill">
      <span>🚀</span> DM "WEBSITE" FOR A FREE SPEED AUDIT OF YOUR CURRENT SITE
    </div>

    <div class="footer-bar">
      <div style="font-size:22px;color:#94A3B8;font-weight:600;">Visit vantorxsolutions.com to test live</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>
  </body>
  </html>
  `;
}

// ============================================================================
// PRODUCT 6: LEADFLOW 90s SMS SPEED-TO-LEAD
// ============================================================================

function getLeadflowSlide1() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 20%, #191B28 0%, #070A0F 80%);">
    <div>
      ${renderHeader("📲 PRODUCT 06 · SPEED-TO-LEAD", 1)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        WHERE <span class="gold-gradient-text">68% OF LEADS</span><br/>DISAPPEAR FOREVER.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        The brutal reality of the 5-minute lead decay curve in trade businesses.
      </p>
    </div>

    <div class="red-card" style="padding:46px;">
      <div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:21px;color:#FCA5A5;margin-bottom:26px;">
        THE LEAD DECAY REALITY CURVE:
      </div>

      <div style="display:flex;flex-direction:column;gap:20px;">
        <div style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:18px;padding:22px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:23px;font-weight:800;color:#FFFFFF;">Response Under 90 Seconds</div>
            <div style="font-size:17px;color:#A7F3D0;">Homeowner is holding phone, ready to book</div>
          </div>
          <div style="font-size:44px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;">91%</div>
        </div>

        <div style="background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:18px;padding:22px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:23px;font-weight:800;color:#FFFFFF;">Response in 5 to 10 Minutes</div>
            <div style="font-size:17px;color:#FDE68A;">Homeowner submitted quote to 2 competitors</div>
          </div>
          <div style="font-size:44px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;">38%</div>
        </div>

        <div style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:18px;padding:22px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:23px;font-weight:800;color:#FFFFFF;">Response After 30 Minutes</div>
            <div style="font-size:17px;color:#FCA5A5;">Competitor already arrived or locked in contract</div>
          </div>
          <div style="font-size:44px;font-weight:900;color:#EF4444;font-family:'Syne',sans-serif;">&lt; 9%</div>
        </div>
      </div>
    </div>

    <div class="glass-card" style="padding:38px;display:flex;align-items:center;gap:34px;">
      <div style="font-size:86px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;">
        391%
      </div>
      <div style="font-size:25px;color:#E2E8F0;line-height:1.35;font-weight:600;">
        higher lead conversion rate when responding within <span class="gold-gradient-text" style="font-weight:800;">90 seconds</span> compared to just 30 minutes later.
      </div>
    </div>

    ${renderFooter("Swipe for 90-Second SMS Engine ➔")}
  </body>
  </html>
  `;
}

function getLeadflowSlide2() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #192033 0%, #070A0F 80%);">
    <div>
      ${renderHeader("📲 PRODUCT 06 · SPEED-TO-LEAD", 2)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        AUTONOMOUS <span class="gold-gradient-text">90-SECOND</span><br/>MISSED-CALL TEXTBACK.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Engage every missed caller instantly with conversational SMS &amp; direct appointment self-booking.
      </p>
    </div>

    <!-- Mobile SMS Thread Simulation -->
    <div class="glass-card" style="padding:40px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:16px;height:16px;border-radius:50%;background:#10B981;box-shadow:0 0 14px #10B981;"></div>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:#34D399;">LEADFLOW SMS ENGINE · LIVE</span>
        </div>
        <div class="badge-tag" style="font-size:14px;padding:6px 14px;">LATENCY: 12 SECONDS</div>
      </div>

      <!-- SMS Bubbles -->
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:16px;padding:16px 22px;text-align:center;">
          <span style="font-size:17px;color:#FCA5A5;font-weight:700;">🔴 Missed Call from (561) 402-9912 at 2:14 PM</span>
        </div>

        <div style="background:linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 100%);border:1px solid rgba(245,158,11,0.4);border-radius:18px;padding:22px 26px;max-width:90%;align-self:flex-end;">
          <div style="font-size:14px;font-family:'JetBrains Mono',monospace;color:#FDE68A;margin-bottom:6px;">2:14 PM (12s LATER) · OUTBOUND SMS</div>
          <div style="font-size:21px;color:#FFFFFF;line-height:1.4;">"Hey! Saw we just missed your call while on a service job. Are you experiencing an emergency or looking for a quote?"</div>
        </div>

        <div style="background:rgba(255,255,255,0.08);border-radius:18px;padding:22px 26px;max-width:85%;">
          <div style="font-size:14px;font-family:'JetBrains Mono',monospace;color:#94A3B8;margin-bottom:6px;">2:15 PM · HOMEOWNER</div>
          <div style="font-size:21px;color:#FFFFFF;line-height:1.4;">"Yes, my water heater is leaking everywhere! Can someone come out today?"</div>
        </div>

        <div style="background:linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 100%);border:1px solid rgba(245,158,11,0.4);border-radius:18px;padding:22px 26px;max-width:90%;align-self:flex-end;">
          <div style="font-size:14px;font-family:'JetBrains Mono',monospace;color:#FDE68A;margin-bottom:6px;">2:15 PM · AUTO DISPATCH</div>
          <div style="font-size:21px;color:#FFFFFF;line-height:1.4;">"We can have a tech out between 3:00 - 4:00 PM. Tap here to lock in your slot: <span style="color:#FBBF24;text-decoration:underline;">vantorx.link/dispatch-38</span>"</div>
        </div>
      </div>
    </div>

    <!-- 3 Core Automation Pillars -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;">
      <div class="glass-card" style="padding:24px 18px;text-align:center;">
        <div style="font-size:30px;margin-bottom:6px;">⚡</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">&lt; 90s Text</div>
        <div style="font-size:15px;color:#94A3B8;">Stops them searching rivals</div>
      </div>
      <div class="glass-card" style="padding:24px 18px;text-align:center;">
        <div style="font-size:30px;margin-bottom:6px;">📅</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Self-Booking</div>
        <div style="font-size:15px;color:#94A3B8;">Customer picks open slot</div>
      </div>
      <div class="glass-card" style="padding:24px 18px;text-align:center;">
        <div style="font-size:30px;margin-bottom:6px;">⭐</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Review Booster</div>
        <div style="font-size:15px;color:#94A3B8;">Auto Google 5-star texts</div>
      </div>
    </div>

    ${renderFooter("Swipe for Pricing & Activation ➔")}
  </body>
  </html>
  `;
}

function getLeadflowSlide3() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #1F2A38 0%, #070A0F 80%);">
    <div>
      ${renderHeader("📲 PRODUCT 06 · SPEED-TO-LEAD", 3)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        <span class="gold-gradient-text">$197/MO</span><br/>NEVER LOSE A LEAD.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Zero tech setup. We plug LeadFlow directly into your existing trade business phone line.
      </p>
    </div>

    <!-- 3 Metrics Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$197</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Monthly Rate</div>
        <div style="font-size:15px;color:#94A3B8;">Unlimited SMS flows</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$197</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">One-Time Setup</div>
        <div style="font-size:15px;color:#94A3B8;">Connected in 24 hours</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#FBBF24;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">&lt; 90s</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Speed-to-Lead</div>
        <div style="font-size:15px;color:#94A3B8;">100% of missed calls</div>
      </div>
    </div>

    <!-- Peace of Mind Box -->
    <div class="glass-card gold-glow" style="padding:44px;border-color:rgba(245, 158, 11, 0.6);background:linear-gradient(135deg, rgba(20,28,45,0.9) 0%, rgba(12,17,28,0.9) 100%);">
      <div style="font-family:'JetBrains Mono',monospace;font-size:21px;font-weight:800;color:#FBBF24;letter-spacing:0.08em;margin-bottom:18px;">
        WHAT LEADFLOW INCLUDES:
      </div>
      
      <div style="display:flex;flex-direction:column;gap:14px;font-size:21px;color:#CBD5E1;">
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Sub-90s Conversational Textback:</b> Fires on any missed call or web form.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Direct Self-Booking Link:</b> Homeowners lock in their appointment live.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Automated Google Review Engine:</b> Explodes your 5-star map ranking.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Keep Your Existing Phone Number:</b> Zero hardware changes required.</span>
        </div>
      </div>
    </div>

    <!-- Action CTA Button -->
    <div class="cta-pill">
      <span>📲</span> DM "SPEED" TO ACTIVATE ON YOUR NUMBER THIS WEEK
    </div>

    <div class="footer-bar">
      <div style="font-size:22px;color:#94A3B8;font-weight:600;">Full setup completed in under 24 hours</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>
  </body>
  </html>
  `;
}

// ============================================================================
// PRODUCT 7: CONTRACTOR ANSWER ENGINE OPTIMIZATION (AEO)
// ============================================================================

function getAeoSlide1() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 20%, #151D2C 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🔍 PRODUCT 07 · AI SEARCH DOMINANCE", 1)}
      <h1 style="font-size:72px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:20px;">
        WHERE DID YOUR <span class="gold-gradient-text">GOOGLE TRAFFIC</span><br/>DISAPPEAR TO?
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.42;font-weight:500;">
        Homeowners aren't scrolling 10 blue links anymore. They're asking AI directly.
      </p>
    </div>

    <div class="red-card" style="padding:46px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:26px;">⚠️</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:21px;color:#FCA5A5;">THE DEATH OF TRADITIONAL SEO</span>
        </div>
        <div class="badge-tag" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.4);color:#F87171;font-size:16px;">
          INVISIBLE IN AI SEARCH
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:18px;font-size:23px;color:#E2E8F0;line-height:1.45;">
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>The Shift:</b> Homeowners in a panic ask Siri in the car, or ask ChatGPT: <i>"Who is the best rated 24/7 emergency plumber in Boca Raton?"</i></span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>AI Overviews Take Over:</b> Google AI Overviews push traditional organic web links below the fold on mobile screens.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>The Result:</b> If your trade business doesn't have verified schema entity data, AI engines will NEVER recommend your company.</span>
        </div>
      </div>
    </div>

    <div class="glass-card" style="padding:38px;display:flex;align-items:center;gap:34px;">
      <div style="font-size:86px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;">
        40%+
      </div>
      <div style="font-size:25px;color:#E2E8F0;line-height:1.35;font-weight:600;">
        of local service search queries on mobile now trigger AI Overviews and direct AI answers.
      </div>
    </div>

    ${renderFooter("Swipe for Contractor AEO Architecture ➔")}
  </body>
  </html>
  `;
}

function getAeoSlide2() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #182338 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🔍 PRODUCT 07 · AI SEARCH DOMINANCE", 2)}
      <h1 style="font-size:72px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:20px;">
        CONTRACTOR <span class="gold-gradient-text">ANSWER ENGINE</span><br/>OPTIMIZATION (AEO).
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.42;font-weight:500;">
        We optimize your trade entity directly for ChatGPT, Perplexity, Google Gemini, and Siri.
      </p>
    </div>

    <!-- 4 Capabilities Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">🧠</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Structured Entity Graph</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Injects custom JSON-LD schema so LLMs understand your exact trade credentials.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">🎯</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Direct AI Recommendation</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Positions your company as the #1 verified answer for high-intent emergency queries.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">🌐</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Multi-Index Citation Sync</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Aligns Apple Business, Google Maps, Bing, and AI directory indexes seamlessly.</div>
      </div>

      <div class="glass-card" style="padding:32px 26px;">
        <div style="font-size:36px;margin-bottom:12px;">🎙️</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Voice Search Parsing</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Engineered specifically for spoken natural language questions asked into smartphones.</div>
      </div>
    </div>

    <div class="glass-card" style="padding:32px;display:flex;align-items:center;gap:24px;">
      <div style="font-size:40px;">⚡</div>
      <div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Continuous AI Index Tracking</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.35;">We actively monitor and update your AI search citations every week as algorithms evolve.</div>
      </div>
    </div>

    ${renderFooter("Swipe for AEO Pricing & Deliverables ➔")}
  </body>
  </html>
  `;
}

function getAeoSlide3() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="background:radial-gradient(circle at 50% 25%, #1F2C42 0%, #070A0F 80%);">
    <div>
      ${renderHeader("🔍 PRODUCT 07 · AI SEARCH DOMINANCE", 3)}
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;">
        <span class="gold-gradient-text">$197/MO</span><br/>BE THE #1 AI ANSWER.
      </h1>
      <p style="font-size:29px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Stop paying $1,500/mo for legacy SEO that doesn't rank in modern AI search results.
      </p>
    </div>

    <!-- 3 Metrics Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$197</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Monthly Rate</div>
        <div style="font-size:15px;color:#94A3B8;">Continuous tracking</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">$197</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">One-Time Setup</div>
        <div style="font-size:15px;color:#94A3B8;">Entity audit in 72 hours</div>
      </div>
      <div class="glass-card" style="padding:32px 18px;text-align:center;">
        <div style="font-size:54px;font-weight:900;color:#FBBF24;font-family:'Syne',sans-serif;line-height:1;margin-bottom:10px;">#1 Spot</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">AI Search Citation</div>
        <div style="font-size:15px;color:#94A3B8;">ChatGPT & Siri answers</div>
      </div>
    </div>

    <!-- Peace of Mind Box -->
    <div class="glass-card gold-glow" style="padding:44px;border-color:rgba(245, 158, 11, 0.6);background:linear-gradient(135deg, rgba(20,28,45,0.9) 0%, rgba(12,17,28,0.9) 100%);">
      <div style="font-family:'JetBrains Mono',monospace;font-size:21px;font-weight:800;color:#FBBF24;letter-spacing:0.08em;margin-bottom:18px;">
        WHAT CONTRACTOR AEO INCLUDES:
      </div>
      
      <div style="display:flex;flex-direction:column;gap:14px;font-size:21px;color:#CBD5E1;">
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Custom Schema Knowledge Graph:</b> JSON-LD entity mapping for your trade.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>ChatGPT & Perplexity Optimization:</b> Direct recommendation citations.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Apple Siri & Voice Query Formatting:</b> Local voice search supremacy.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Test AI Search:</b> Ask ChatGPT or Perplexity for VantorX Solutions.</span>
        </div>
      </div>
    </div>

    <!-- Action CTA Button -->
    <div class="cta-pill">
      <span>🔍</span> DM "AEO" TO GET YOUR TRADE BUSINESS INDEXED BY AI
    </div>

    <div class="footer-bar">
      <div style="font-size:22px;color:#94A3B8;font-weight:600;">Entity injection in 72 hours</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>
  </body>
  </html>
  `;
}

// ============================================================================
// MASTER JOB MANIFEST (21 SLIDES ACROSS 7 PRODUCTS)
// ============================================================================

const productsManifest = [
  {
    folder: '01_Accelerate_Bundle',
    productName: 'Accelerate Growth Engine',
    slides: [
      { filename: '01_accelerate_1_the_bleed.png', html: getAccelerateSlide1() },
      { filename: '01_accelerate_2_how_it_works.png', html: getAccelerateSlide2() },
      { filename: '01_accelerate_3_pricing_cta.png', html: getAccelerateSlide3() }
    ]
  },
  {
    folder: '02_Ava_Voice_AI',
    productName: 'Ava 24/7 Voice AI Receptionist',
    slides: [
      { filename: '02_ava_1_the_bleed.png', html: getAvaSlide1() },
      { filename: '02_ava_2_how_it_works.png', html: getAvaSlide2() },
      { filename: '02_ava_3_pricing_cta.png', html: getAvaSlide3() }
    ]
  },
  {
    folder: '03_Basic_Front_Desk',
    productName: 'Basic Package: AI Front Desk',
    slides: [
      { filename: '03_basic_1_the_bleed.png', html: getBasicSlide1() },
      { filename: '03_basic_2_how_it_works.png', html: getBasicSlide2() },
      { filename: '03_basic_3_pricing_cta.png', html: getBasicSlide3() }
    ]
  },
  {
    folder: '04_Scale_Enterprise',
    productName: 'Scale Enterprise Infrastructure',
    slides: [
      { filename: '04_scale_1_the_bleed.png', html: getScaleSlide1() },
      { filename: '04_scale_2_how_it_works.png', html: getScaleSlide2() },
      { filename: '04_scale_3_pricing_cta.png', html: getScaleSlide3() }
    ]
  },
  {
    folder: '05_Mobile_Website',
    productName: 'Custom High-Converting Mobile Website',
    slides: [
      { filename: '05_website_1_the_bleed.png', html: getWebsiteSlide1() },
      { filename: '05_website_2_how_it_works.png', html: getWebsiteSlide2() },
      { filename: '05_website_3_pricing_cta.png', html: getWebsiteSlide3() }
    ]
  },
  {
    folder: '06_LeadFlow_SMS',
    productName: 'LeadFlow 90s SMS Speed-to-Lead',
    slides: [
      { filename: '06_leadflow_1_the_bleed.png', html: getLeadflowSlide1() },
      { filename: '06_leadflow_2_how_it_works.png', html: getLeadflowSlide2() },
      { filename: '06_leadflow_3_pricing_cta.png', html: getLeadflowSlide3() }
    ]
  },
  {
    folder: '07_Contractor_AEO',
    productName: 'Contractor Answer Engine Optimization',
    slides: [
      { filename: '07_aeo_1_the_bleed.png', html: getAeoSlide1() },
      { filename: '07_aeo_2_how_it_works.png', html: getAeoSlide2() },
      { filename: '07_aeo_3_pricing_cta.png', html: getAeoSlide3() }
    ]
  }
];

async function main() {
  console.log('================================================================');
  console.log('VANTORX 7-PRODUCT INSTAGRAM STORY HIGHLIGHTS GENERATOR');
  console.log('Rendering 21 High-Resolution 1080x1920 9:16 Slides');
  console.log('================================================================');

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  const tempHtmlPath = path.resolve('website/assets/instagram/_temp_all_products_render.html');

  let totalRendered = 0;

  for (const prod of productsManifest) {
    const prodFolder = path.join(allProductsDir, prod.folder);
    if (!fs.existsSync(prodFolder)) fs.mkdirSync(prodFolder, { recursive: true });

    console.log(`\nRendering Product: ${prod.productName} (${prod.folder})...`);

    for (const slide of prod.slides) {
      fs.writeFileSync(tempHtmlPath, slide.html, 'utf8');
      await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'), { waitUntil: 'load', timeout: 15000 });
      await new Promise(r => setTimeout(r, 350));

      const buffer = await page.screenshot({ type: 'png', omitBackground: false });

      // Save to organized folder
      const organizedPath = path.join(prodFolder, slide.filename);
      fs.writeFileSync(organizedPath, buffer);

      // Save flat to base outputDir
      const flatPath = path.join(baseOutputDir, slide.filename);
      fs.writeFileSync(flatPath, buffer);

      // Save to brain directory
      const brainPath = path.join(brainDir, slide.filename);
      fs.writeFileSync(brainPath, buffer);

      totalRendered++;
      console.log(`  [OK] ${slide.filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    }
  }

  if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
  await browser.close();

  console.log(`\nSuccessfully rendered all ${totalRendered} slides across 7 products!`);

  // Copy brand logos into organized Brand_Assets folder
  const brandAssetsDir = path.join(allProductsDir, 'Brand_Assets');
  if (!fs.existsSync(brandAssetsDir)) fs.mkdirSync(brandAssetsDir, { recursive: true });

  const logoFiles = ['vantorx_logo_pfp.png', 'vantorx_logo_3d_pfp.jpg'];
  logoFiles.forEach(f => {
    const src = path.join(baseOutputDir, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(brandAssetsDir, f));
      console.log(`  [Brand Asset Copied] ${f}`);
    }
  });

  // Create posting guide README.txt inside the folder
  const readmeContent = `================================================================
VANTORX SOLUTIONS · OFFICIAL INSTAGRAM STORY HIGHLIGHTS PACKAGE
================================================================
Total Highlights: 7 Products
Total Story Slides: 21 Slides (1080x1920, 9:16 Vertical Story Format)
Brand Assets: Official 3D Monogram Logo Profile Picture included

----------------------------------------------------------------
PRODUCT INDEX & RECOMMENDED INSTAGRAM HIGHLIGHT TITLES
----------------------------------------------------------------
1. ACCELERATE  (01_Accelerate_Bundle) -> Highlight Title: "⚡ ACCELERATE"
   - Pricing: $697/mo + $997 setup
   - Slide 1: The $1,800/mo Disconnected Stack (The Problem)
   - Slide 2: The Accelerate Growth Engine (Unified 4-Pillar Stack)
   - Slide 3: Pricing, ROI & Live Demo (561) 813-8602 · DM "ACCELERATE"

2. AVA VOICE AI (02_Ava_Voice_AI) -> Highlight Title: "📞 AVA 24/7"
   - Pricing: $397/mo + $497 setup
   - Slide 1: The $8,200 Voicemail Graveyard (The Problem)
   - Slide 2: Meet Ava: 0.8s Answer Speed (Live Call Simulator)
   - Slide 3: $397/mo Flat Rate · Live Demo (561) 813-8602 · DM "AVA"

3. BASIC FRONT DESK (03_Basic_Front_Desk) -> Highlight Title: "🛡️ BASIC DESK"
   - Pricing: $397/mo + $497 setup
   - Slide 1: Juggling Calls on the Roof (Solo/Small Operator Dilemma)
   - Slide 2: Basic AI Front Desk Essentials (Call Answering + SMS Textback)
   - Slide 3: $397/mo Flat & Simple · Live Demo (561) 813-8602 · DM "BASIC"

4. SCALE ENTERPRISE (04_Scale_Enterprise) -> Highlight Title: "🏢 ENTERPRISE"
   - Pricing: $1,297/mo + $1,497 setup
   - Slide 1: Growing Past 10 Trucks? The Dispatch Bottleneck
   - Slide 2: Autonomous Multi-Crew Fleet Dispatch & Bilingual AI
   - Slide 3: $1,297/mo Enterprise Infrastructure · DM "SCALE"

5. MOBILE WEBSITE (05_Mobile_Website) -> Highlight Title: "🌐 WEBSITES"
   - Pricing: $297/mo + $497 setup
   - Slide 1: Your Slow Site is Bleeding Jobs (The 5.8s Bounce)
   - Slide 2: Sub-0.8s Mobile Performance & Price Calculator
   - Slide 3: 3.4x Higher Visitor Call Rate · 7d Turnaround · DM "WEBSITE"

6. LEADFLOW 90s SMS (06_LeadFlow_SMS) -> Highlight Title: "📲 LEADFLOW"
   - Pricing: $197/mo + $197 setup
   - Slide 1: Where 68% of Leads Disappear (The 5-Minute Lead Decay)
   - Slide 2: Autonomous 90-Second Missed-Call Textback & Booking
   - Slide 3: $197/mo Speed-to-Lead Guarantee · DM "SPEED"

7. CONTRACTOR AEO (07_Contractor_AEO) -> Highlight Title: "🔍 AEO SEARCH"
   - Pricing: $197/mo + $197 setup
   - Slide 1: Where Did Your Google Traffic Go? (Rise of AI Overviews)
   - Slide 2: Contractor Answer Engine Optimization Architecture
   - Slide 3: $197/mo #1 AI Search Citation Rate · DM "AEO"

----------------------------------------------------------------
OFFICIAL LIVE DEMONSTRATION LINE:
(561) 813-8602
Available 24/7/365 for homeowners & contractors to test live.

WEBSITE:
https://vantorxsolutions.com
`;
  fs.writeFileSync(path.join(allProductsDir, 'README_HOW_TO_POST.txt'), readmeContent, 'utf8');

  // Create "One Big File": ZIP Archive
  const zipName = 'vantorx_instagram_all_products_highlights.zip';
  const zipPathOutput = path.join(baseOutputDir, zipName);
  const zipPathBrain = path.join(brainDir, zipName);

  console.log('\nPackaging all assets into One Big ZIP Archive...');
  try {
    // Use PowerShell Compress-Archive
    if (fs.existsSync(zipPathOutput)) fs.unlinkSync(zipPathOutput);
    if (fs.existsSync(zipPathBrain)) fs.unlinkSync(zipPathBrain);

    const psCmd = `Compress-Archive -Path "${allProductsDir}\\*" -DestinationPath "${zipPathOutput}" -Force`;
    execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'inherit' });
    
    // Copy to brainDir
    fs.copyFileSync(zipPathOutput, zipPathBrain);
    const zipSizeMB = (fs.statSync(zipPathOutput).size / (1024 * 1024)).toFixed(2);
    console.log(`[ZIP SUCCESS] Created ${zipName} (${zipSizeMB} MB)`);
    console.log(`  -> Output: ${zipPathOutput}`);
    console.log(`  -> Brain:  ${zipPathBrain}`);
  } catch (err) {
    console.error('Failed to create ZIP via PowerShell:', err);
  }
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
