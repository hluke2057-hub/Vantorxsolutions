const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve('website/assets/instagram');
const assetsDir = path.resolve('website/assets');
const brainDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// -------------------------------------------------------------
// HTML & CSS Templates
// -------------------------------------------------------------

const baseCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Syne:wght@700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #070A0F;
    color: #F8FAFC;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  .gold-gradient-text {
    background: linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .gold-glow {
    box-shadow: 0 0 50px rgba(245, 158, 11, 0.25);
  }

  .glass-card {
    background: rgba(14, 20, 32, 0.78);
    border: 1px solid rgba(245, 158, 11, 0.22);
    border-radius: 28px;
    backdrop-filter: blur(24px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
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
    font-size: 26px;
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
`;

// 1. Profile Picture: VantorX Official Logo (1080x1080)
function getLogoPfpHtml() {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      ${baseCss}
      .pfp-canvas {
        width: 1080px;
        height: 1080px;
        position: relative;
        background: radial-gradient(circle at 50% 48%, #141E30 0%, #070A0F 70%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      /* Subtle grid background */
      .grid-bg {
        position: absolute;
        inset: 0;
        background-image: 
          linear-gradient(rgba(245, 158, 11, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245, 158, 11, 0.04) 1px, transparent 1px);
        background-size: 40px 40px;
        mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 80%);
      }
      /* Central Glowing Ambient Aura */
      .ambient-glow {
        position: absolute;
        width: 650px;
        height: 650px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.08) 45%, transparent 70%);
        filter: blur(40px);
      }
      /* Outer circular crop boundary reference (invisible in final but guarantees safe-zone) */
      .safe-zone {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .logo-emblem {
        width: 360px;
        height: 360px;
        filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 45px rgba(245, 158, 11, 0.45));
        margin-bottom: 28px;
      }
      .brand-title {
        font-family: 'Syne', sans-serif;
        font-size: 82px;
        font-weight: 800;
        letter-spacing: 0.16em;
        color: #FFFFFF;
        text-shadow: 0 4px 20px rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }
      .brand-title .gold-x {
        background: linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .sub-pill {
        font-family: 'JetBrains Mono', monospace;
        font-size: 20px;
        font-weight: 800;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: #FBBF24;
        background: rgba(245, 158, 11, 0.12);
        border: 1.5px solid rgba(245, 158, 11, 0.38);
        padding: 8px 28px;
        border-radius: 999px;
      }
    </style>
  </head>
  <body>
    <div class="pfp-canvas">
      <div class="grid-bg"></div>
      <div class="ambient-glow"></div>
      
      <div class="safe-zone">
        <!-- High-End Luxury Geometric VX Monogram Shield -->
        <svg class="logo-emblem" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFF2A3"/>
              <stop offset="35%" stop-color="#F59E0B"/>
              <stop offset="70%" stop-color="#D97706"/>
              <stop offset="100%" stop-color="#92400E"/>
            </linearGradient>
            <linearGradient id="goldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FDE68A"/>
              <stop offset="50%" stop-color="#F59E0B"/>
              <stop offset="100%" stop-color="#B45309"/>
            </linearGradient>
            <linearGradient id="shieldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.9"/>
              <stop offset="50%" stop-color="#D97706" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#F59E0B" stop-opacity="0.8"/>
            </linearGradient>
            <linearGradient id="titaniumDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1E293B"/>
              <stop offset="50%" stop-color="#0F172A"/>
              <stop offset="100%" stop-color="#090D16"/>
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          <!-- Outer Hexagonal Cybernetic Shield -->
          <polygon points="100,10 180,55 180,145 100,190 20,145 20,55" fill="url(#titaniumDark)" stroke="url(#shieldRim)" stroke-width="4.5"/>
          <polygon points="100,22 168,61 168,139 100,178 32,139 32,61" fill="none" stroke="rgba(245, 158, 11, 0.25)" stroke-width="1.5" stroke-dasharray="6,4"/>

          <!-- Iconic Stylized 3D 'VX' Monogram -->
          <!-- The 'V' Wing Left -->
          <polygon points="48,65 72,65 100,132 82,132" fill="url(#goldGrad1)"/>
          <!-- The 'V' Wing Right -->
          <polygon points="152,65 128,65 100,132 118,132" fill="url(#goldGrad2)"/>
          
          <!-- The Intersecting Dynamic 'X' Strike -->
          <polygon points="62,142 80,142 142,60 124,60" fill="url(#goldGrad1)" opacity="0.95"/>
          
          <!-- Glowing Center Nucleus Prism -->
          <circle cx="100" cy="100" r="7" fill="#FFF2A3" filter="url(#neonGlow)"/>
        </svg>

        <div class="brand-title">VANTOR<span class="gold-x">X</span></div>
        <div class="sub-pill">SOLUTIONS</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

// -------------------------------------------------------------
// HIGHLIGHTS: AVA 24/7 VOICE AI (SLIDES 1, 2, 3)
// -------------------------------------------------------------

function getAvaSlide1Html() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="width:1080px;height:1920px;position:relative;background:radial-gradient(circle at 50% 20%, #151D2C 0%, #070A0F 80%);padding:140px 70px 120px;display:flex;flex-direction:column;justify-content:space-between;">
    
    <!-- Top Header -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;">
        <div class="badge-tag">⚡ PRODUCT 01 · VOICE AI</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#94A3B8;letter-spacing:0.1em;">SLIDE 1 OF 3</div>
      </div>
      
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:24px;">
        THE <span class="gold-gradient-text">$8,200 VOICEMAIL</span><br/>GRAVEYARD.
      </h1>
      <p style="font-size:30px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Why 78% of your paid marketing dollars vanish the second you don't answer.
      </p>
    </div>

    <!-- Centerpiece Visual: The Missed Emergency Call -->
    <div class="glass-card" style="padding:48px;border-color:rgba(239, 68, 68, 0.4);background:rgba(20, 10, 15, 0.75);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:30px;">
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="width:20px;height:20px;border-radius:50%;background:#EF4444;box-shadow:0 0 16px #EF4444;"></div>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:22px;color:#FCA5A5;letter-spacing:0.08em;">MISSED EMERGENCY INQUIRY</span>
        </div>
        <span style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#64748B;">Sunday 8:42 PM</span>
      </div>

      <div style="background:rgba(0,0,0,0.5);border-radius:20px;padding:32px;margin-bottom:28px;border:1px solid rgba(255,255,255,0.06);">
        <div style="font-size:32px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">Caller: Emergency AC Replacement</div>
        <div style="font-size:22px;color:#94A3B8;margin-bottom:18px;">Residential Homeowner · Boca Raton, FL</div>
        <div style="font-size:22px;color:#EF4444;font-weight:700;display:flex;align-items:center;gap:10px;">
          <span>⚠️</span> Status: Voicemail Left (No Answer)
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:18px;font-size:24px;color:#CBD5E1;line-height:1.5;">
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>8:43 PM:</b> Caller hung up after hearing your voicemail greeting.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>8:45 PM:</b> Caller phoned the next contractor on Google Maps.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>8:46 PM:</b> Competitor answered live and booked the <b>$8,200 install</b>.</span>
        </div>
      </div>
    </div>

    <!-- Stat Callout Card -->
    <div class="glass-card" style="padding:40px;display:flex;align-items:center;gap:36px;">
      <div style="font-size:92px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;">
        78%
      </div>
      <div style="font-size:26px;color:#E2E8F0;line-height:1.35;font-weight:600;">
        of homeowners hire the <span class="gold-gradient-text" style="font-weight:800;">FIRST contractor</span> who picks up the phone live.
      </div>
    </div>

    <!-- Bottom Indicator -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:24px;color:#94A3B8;font-weight:600;">Swipe for How Ava Fixes This ➔</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>

  </body>
  </html>
  `;
}

function getAvaSlide2Html() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="width:1080px;height:1920px;position:relative;background:radial-gradient(circle at 50% 25%, #182236 0%, #070A0F 80%);padding:140px 70px 120px;display:flex;flex-direction:column;justify-content:space-between;">
    
    <!-- Top Header -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;">
        <div class="badge-tag">⚡ PRODUCT 01 · VOICE AI</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#94A3B8;letter-spacing:0.1em;">SLIDE 2 OF 3</div>
      </div>
      
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:24px;">
        MEET <span class="gold-gradient-text">AVA</span>.<br/>0.8s ANSWER SPEED.
      </h1>
      <p style="font-size:30px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Answers like an executive receptionist. Books jobs into your calendar. Dispatches techs via SMS.
      </p>
    </div>

    <!-- Live Telemetry Simulator Card -->
    <div class="glass-card" style="padding:44px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:16px;height:16px;border-radius:50%;background:#10B981;box-shadow:0 0 14px #10B981;"></div>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:#34D399;">CALL ACTIVE · 00:38</span>
        </div>
        <div class="badge-tag" style="font-size:14px;padding:6px 14px;">LATENCY: 0.81s</div>
      </div>

      <!-- Dialogue Bubbles -->
      <div style="display:flex;flex-direction:column;gap:20px;margin-bottom:28px;">
        <div style="background:rgba(255,255,255,0.06);border-radius:20px;padding:24px 28px;max-width:85%;">
          <div style="font-size:16px;font-family:'JetBrains Mono',monospace;color:#94A3B8;margin-bottom:6px;">HOMEOWNER (LIVE)</div>
          <div style="font-size:24px;color:#FFFFFF;line-height:1.4;">"Hey, my master bathroom pipe just burst and water is flooding into the hall!"</div>
        </div>

        <div style="background:linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 100%);border:1px solid rgba(245,158,11,0.4);border-radius:20px;padding:24px 28px;max-width:90%;align-self:flex-end;">
          <div style="font-size:16px;font-family:'JetBrains Mono',monospace;color:#FDE68A;margin-bottom:6px;">AVA (VOICE AI)</div>
          <div style="font-size:24px;color:#FFFFFF;line-height:1.4;">"I understand, that's an urgent leak. I'm locking in an emergency priority dispatch right now. What's your home address?"</div>
        </div>
      </div>

      <!-- Live Audio Waveform Graphic -->
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;height:48px;background:rgba(0,0,0,0.4);border-radius:14px;">
        <div style="width:6px;height:18px;background:#F59E0B;border-radius:4px;"></div>
        <div style="width:6px;height:34px;background:#FBBF24;border-radius:4px;"></div>
        <div style="width:6px;height:44px;background:#F59E0B;border-radius:4px;"></div>
        <div style="width:6px;height:24px;background:#D97706;border-radius:4px;"></div>
        <div style="width:6px;height:38px;background:#F59E0B;border-radius:4px;"></div>
        <div style="width:6px;height:16px;background:#B45309;border-radius:4px;"></div>
      </div>
    </div>

    <!-- 4 Capabilities Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:28px 24px;">
        <div style="font-size:32px;margin-bottom:10px;">⚡</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:6px;">0.8s Pickup</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Never puts a caller on hold or sends them to voicemail.</div>
      </div>
      <div class="glass-card" style="padding:28px 24px;">
        <div style="font-size:32px;margin-bottom:10px;">📅</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:6px;">Direct Booking</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Syncs to ServiceTitan, Housecall Pro, &amp; Google Cal.</div>
      </div>
      <div class="glass-card" style="padding:28px 24px;">
        <div style="font-size:32px;margin-bottom:10px;">🛡️</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:6px;">Lead Triage</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Screens tire-kickers and collects job specs &amp; address.</div>
      </div>
      <div class="glass-card" style="padding:28px 24px;">
        <div style="font-size:32px;margin-bottom:10px;">📲</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:6px;">SMS Dispatch</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Texts on-call tech the full audio clip &amp; transcript summary.</div>
      </div>
    </div>

    <!-- Bottom Indicator -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:24px;color:#94A3B8;font-weight:600;">Swipe for Proof &amp; Live Dial Number ➔</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>

  </body>
  </html>
  `;
}

function getAvaSlide3Html() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="width:1080px;height:1920px;position:relative;background:radial-gradient(circle at 50% 25%, #1E2838 0%, #070A0F 80%);padding:140px 70px 120px;display:flex;flex-direction:column;justify-content:space-between;">
    
    <!-- Top Header -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;">
        <div class="badge-tag">⚡ PRODUCT 01 · VOICE AI</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#94A3B8;letter-spacing:0.1em;">SLIDE 3 OF 3</div>
      </div>
      
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:24px;">
        <span class="gold-gradient-text">+18 BOOKED JOBS</span><br/>EVERY MONTH.
      </h1>
      <p style="font-size:30px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Real verified performance metrics across active trade contractor deployments.
      </p>
    </div>

    <!-- 3 Metrics Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 20px;text-align:center;">
        <div style="font-size:62px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;line-height:1;margin-bottom:12px;">100%</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Calls Answered</div>
        <div style="font-size:15px;color:#94A3B8;">Zero dropped calls</div>
      </div>
      <div class="glass-card" style="padding:32px 20px;text-align:center;">
        <div style="font-size:62px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;margin-bottom:12px;">0.8s</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Pickup Speed</div>
        <div style="font-size:15px;color:#94A3B8;">On the first ring</div>
      </div>
      <div class="glass-card" style="padding:32px 20px;text-align:center;">
        <div style="font-size:62px;font-weight:900;color:#FBBF24;font-family:'Syne',sans-serif;line-height:1;margin-bottom:12px;">+$24k</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Recovered / Mo</div>
        <div style="font-size:15px;color:#94A3B8;">Average trade ROI</div>
      </div>
    </div>

    <!-- Test Live Dial Box -->
    <div class="glass-card gold-glow" style="padding:48px;border-color:rgba(245, 158, 11, 0.6);background:linear-gradient(135deg, rgba(20,28,45,0.9) 0%, rgba(12,17,28,0.9) 100%);">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
        <div style="font-size:32px;">📞</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:800;color:#FBBF24;letter-spacing:0.08em;">TEST AVA LIVE RIGHT NOW</div>
      </div>
      
      <div style="font-size:28px;color:#FFFFFF;font-weight:600;margin-bottom:24px;line-height:1.4;">
        Call our live demonstration line from your phone. Speak normally, ask questions, or simulate an emergency leak:
      </div>

      <div style="background:rgba(0,0,0,0.6);border:2px dashed rgba(245,158,11,0.5);border-radius:20px;padding:28px;text-align:center;margin-bottom:20px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:52px;font-weight:900;color:#FBBF24;letter-spacing:0.05em;">
          (561) 813-8602
        </div>
        <div style="font-size:18px;color:#94A3B8;margin-top:6px;">Available 24/7/365 · Tap to call or dial directly</div>
      </div>
    </div>

    <!-- Action CTA Button -->
    <div class="cta-pill">
      <span>💬</span> DM US "AVA" TO INSTALL ON YOUR PHONE
    </div>

    <!-- Bottom Indicator -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:22px;color:#94A3B8;font-weight:600;">Done-for-you setup in 24 hours</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>

  </body>
  </html>
  `;
}

// -------------------------------------------------------------
// HIGHLIGHTS: HIGH-CONVERTING WEBSITES (SLIDES 1, 2, 3)
// -------------------------------------------------------------

function getWebSlide1Html() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="width:1080px;height:1920px;position:relative;background:radial-gradient(circle at 50% 20%, #171E2D 0%, #070A0F 80%);padding:140px 70px 120px;display:flex;flex-direction:column;justify-content:space-between;">
    
    <!-- Top Header -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;">
        <div class="badge-tag">🌐 PRODUCT 02 · TRADE WEBSITES</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#94A3B8;letter-spacing:0.1em;">SLIDE 1 OF 3</div>
      </div>
      
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:24px;">
        YOUR SLOW SITE IS <span class="gold-gradient-text">BLEEDING</span> JOBS.
      </h1>
      <p style="font-size:30px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Why 60% of paid Google Ads traffic bounces before ever seeing your phone number.
      </p>
    </div>

    <!-- Red Breakdown Card -->
    <div class="glass-card" style="padding:48px;border-color:rgba(239, 68, 68, 0.35);background:rgba(22, 12, 16, 0.75);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:26px;">⚠️</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:22px;color:#FCA5A5;">THE BLOATED TEMPLATE TRAP</span>
        </div>
        <div class="badge-tag" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.4);color:#F87171;font-size:16px;">
          SPEED SCORE: 28/100
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:22px;font-size:24px;color:#E2E8F0;line-height:1.45;">
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>5.8-Second Mobile Load:</b> Homeowner taps your Google ad, sees a white blank screen, and hits "Back" immediately.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>Buried Phone Numbers:</b> No instant tap-to-call bar. No online instant estimates. Just a broken contact form.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="color:#EF4444;font-weight:900;">✕</span>
          <span><b>$2,500/Month Wasted:</b> You're paying \$45 to \$120 per click on Google Ads, and half of them leave before it loads.</span>
        </div>
      </div>
    </div>

    <!-- Large Impact Stat -->
    <div class="glass-card" style="padding:40px;display:flex;align-items:center;gap:36px;">
      <div style="font-size:88px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;">
        -20%
      </div>
      <div style="font-size:26px;color:#E2E8F0;line-height:1.35;font-weight:600;">
        in contractor conversion rate for <span class="gold-gradient-text" style="font-weight:800;">every 1-second delay</span> on mobile load time.
      </div>
    </div>

    <!-- Bottom Indicator -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:24px;color:#94A3B8;font-weight:600;">Swipe for How VantorX Builds Speed ➔</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>

  </body>
  </html>
  `;
}

function getWebSlide2Html() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="width:1080px;height:1920px;position:relative;background:radial-gradient(circle at 50% 25%, #182236 0%, #070A0F 80%);padding:140px 70px 120px;display:flex;flex-direction:column;justify-content:space-between;">
    
    <!-- Top Header -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;">
        <div class="badge-tag">🌐 PRODUCT 02 · TRADE WEBSITES</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#94A3B8;letter-spacing:0.1em;">SLIDE 2 OF 3</div>
      </div>
      
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:24px;">
        CORE WEB VITALS <span class="gold-gradient-text">100/100</span>.<br/>SUB-SECOND SPEED.
      </h1>
      <p style="font-size:30px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Zero bloated WordPress plugins. Hand-crafted static architecture that loads instantly on any phone.
      </p>
    </div>

    <!-- Performance Telemetry Card -->
    <div class="glass-card" style="padding:44px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
        <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:#FBBF24;">GOOGLE PAGESPEED BENCHMARK</span>
        <div class="badge-tag" style="background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.4);color:#34D399;font-size:16px;">
          PERFORMANCE: 100/100
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
        <div style="background:rgba(0,0,0,0.4);border-radius:18px;padding:24px;border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:16px;color:#94A3B8;font-family:'JetBrains Mono',monospace;margin-bottom:6px;">FIRST CONTENTFUL PAINT</div>
          <div style="font-size:42px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;">0.42s</div>
          <div style="font-size:15px;color:#34D399;">99th percentile speed</div>
        </div>
        <div style="background:rgba(0,0,0,0.4);border-radius:18px;padding:24px;border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:16px;color:#94A3B8;font-family:'JetBrains Mono',monospace;margin-bottom:6px;">CUMULATIVE LAYOUT SHIFT</div>
          <div style="font-size:42px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;">0.00</div>
          <div style="font-size:15px;color:#34D399;">Rock-solid stability</div>
        </div>
      </div>
    </div>

    <!-- 4 Core Web Capabilities Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:28px 24px;">
        <div style="font-size:32px;margin-bottom:10px;">🧮</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:6px;">Price Calculator</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Homeowners get instant emergency price estimates in 2 clicks.</div>
      </div>
      <div class="glass-card" style="padding:28px 24px;">
        <div style="font-size:32px;margin-bottom:10px;">🤖</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:6px;">AEO AI Schema</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">Engineered for ChatGPT, Google AI Overviews &amp; Perplexity search.</div>
      </div>
      <div class="glass-card" style="padding:28px 24px;">
        <div style="font-size:32px;margin-bottom:10px;">📱</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:6px;">Sticky Call Bar</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">1-tap direct dialing that follows mobile visitors on every scroll.</div>
      </div>
      <div class="glass-card" style="padding:28px 24px;">
        <div style="font-size:32px;margin-bottom:10px;">⚡</div>
        <div style="font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:6px;">Zero Maintenance</div>
        <div style="font-size:18px;color:#94A3B8;line-height:1.4;">No plugin updates to break. Fully hosted &amp; managed by VantorX.</div>
      </div>
    </div>

    <!-- Bottom Indicator -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:24px;color:#94A3B8;font-weight:600;">Swipe for Conversion Proof &amp; Offer ➔</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>

  </body>
  </html>
  `;
}

function getWebSlide3Html() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="width:1080px;height:1920px;position:relative;background:radial-gradient(circle at 50% 25%, #1F2A3D 0%, #070A0F 80%);padding:140px 70px 120px;display:flex;flex-direction:column;justify-content:space-between;">
    
    <!-- Top Header -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;">
        <div class="badge-tag">🌐 PRODUCT 02 · TRADE WEBSITES</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#94A3B8;letter-spacing:0.1em;">SLIDE 3 OF 3</div>
      </div>
      
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:24px;">
        <span class="gold-gradient-text">3.4X HIGHER</span><br/>VISITOR CALL RATE.
      </h1>
      <p style="font-size:30px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Turn high-intent local homeowners into booked appointments with zero ad spend increase.
      </p>
    </div>

    <!-- 3 Metrics Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 20px;text-align:center;">
        <div style="font-size:56px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;line-height:1;margin-bottom:12px;">3.4x</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Call Volume</div>
        <div style="font-size:15px;color:#94A3B8;">From same ad spend</div>
      </div>
      <div class="glass-card" style="padding:32px 20px;text-align:center;">
        <div style="font-size:56px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;margin-bottom:12px;">0.4s</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Load Speed</div>
        <div style="font-size:15px;color:#94A3B8;">Sub-second mobile</div>
      </div>
      <div class="glass-card" style="padding:32px 20px;text-align:center;">
        <div style="font-size:56px;font-weight:900;color:#FBBF24;font-family:'Syne',sans-serif;line-height:1;margin-bottom:12px;">7 Days</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Turnaround</div>
        <div style="font-size:15px;color:#94A3B8;">Kickoff to live site</div>
      </div>
    </div>

    <!-- What's Included Box -->
    <div class="glass-card gold-glow" style="padding:44px;border-color:rgba(245, 158, 11, 0.6);background:linear-gradient(135deg, rgba(20,28,45,0.9) 0%, rgba(12,17,28,0.9) 100%);">
      <div style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:800;color:#FBBF24;letter-spacing:0.08em;margin-bottom:20px;">
        DONE-FOR-YOU CONTRACTOR PACKAGE:
      </div>
      
      <div style="display:flex;flex-direction:column;gap:16px;font-size:22px;color:#CBD5E1;">
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Custom Branding &amp; High-Speed CDN:</b> Zero slow hosting fees.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Emergency Job Price Calculator:</b> Built right into your homepage.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>AEO &amp; Google AI Search Schema:</b> Direct AI search citations.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Integrated Ava Voice AI Ready:</b> Seamless live call routing.</span>
        </div>
      </div>
    </div>

    <!-- Action CTA Button -->
    <div class="cta-pill">
      <span>🚀</span> DM US "WEBSITE" FOR A FREE REDESIGN MOCKUP
    </div>

    <!-- Bottom Indicator -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:22px;color:#94A3B8;font-weight:600;">Visit vantorxsolutions.com to test live</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>

  </body>
  </html>
  `;
}

// -------------------------------------------------------------
// HIGHLIGHTS: LEADFLOW CRM & SPEED-TO-LEAD (SLIDES 1, 2, 3)
// -------------------------------------------------------------

function getLeadflowSlide1Html() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="width:1080px;height:1920px;position:relative;background:radial-gradient(circle at 50% 20%, #191B28 0%, #070A0F 80%);padding:140px 70px 120px;display:flex;flex-direction:column;justify-content:space-between;">
    
    <!-- Top Header -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;">
        <div class="badge-tag">📲 PRODUCT 03 · LEADFLOW CRM</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#94A3B8;letter-spacing:0.1em;">SLIDE 1 OF 3</div>
      </div>
      
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:24px;">
        WHERE <span class="gold-gradient-text">68% OF LEADS</span><br/>DISAPPEAR FOREVER.
      </h1>
      <p style="font-size:30px;color:#94A3B8;line-height:1.45;font-weight:500;">
        The brutal reality of the 5-minute lead decay curve in trade businesses.
      </p>
    </div>

    <!-- Problem Graphic Card -->
    <div class="glass-card" style="padding:48px;border-color:rgba(239, 68, 68, 0.35);background:rgba(22, 12, 16, 0.75);">
      <div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:22px;color:#FCA5A5;margin-bottom:28px;">
        THE LEAD DECAY REALITY:
      </div>

      <div style="display:flex;flex-direction:column;gap:24px;">
        <div style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:18px;padding:24px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:24px;font-weight:800;color:#FFFFFF;">Response in 0 – 3 Minutes</div>
            <div style="font-size:18px;color:#A7F3D0;">Homeowner is holding phone, ready to book</div>
          </div>
          <div style="font-size:42px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;">91%</div>
        </div>

        <div style="background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:18px;padding:24px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:24px;font-weight:800;color:#FFFFFF;">Response in 15 – 30 Minutes</div>
            <div style="font-size:18px;color:#FDE68A;">Browsing competitors on Google</div>
          </div>
          <div style="font-size:42px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;">42%</div>
        </div>

        <div style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:18px;padding:24px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:24px;font-weight:800;color:#FFFFFF;">Response in 1 – 3 Hours</div>
            <div style="font-size:18px;color:#FCA5A5;">Job already awarded to another shop</div>
          </div>
          <div style="font-size:42px;font-weight:900;color:#EF4444;font-family:'Syne',sans-serif;">&lt;8%</div>
        </div>
      </div>
    </div>

    <!-- Takeaway Quote Card -->
    <div class="glass-card" style="padding:40px;">
      <div style="font-size:28px;color:#E2E8F0;line-height:1.45;font-weight:600;">
        "You're in a crawlspace, on a ladder, or driving between jobs. You physically cannot call back in 3 minutes. <span class="gold-gradient-text" style="font-weight:800;">LeadFlow automates it 100%.</span>"
      </div>
    </div>

    <!-- Bottom Indicator -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:24px;color:#94A3B8;font-weight:600;">Swipe for The 3-Second Engine ➔</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>

  </body>
  </html>
  `;
}

function getLeadflowSlide2Html() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="width:1080px;height:1920px;position:relative;background:radial-gradient(circle at 50% 25%, #182236 0%, #070A0F 80%);padding:140px 70px 120px;display:flex;flex-direction:column;justify-content:space-between;">
    
    <!-- Top Header -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;">
        <div class="badge-tag">📲 PRODUCT 03 · LEADFLOW CRM</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#94A3B8;letter-spacing:0.1em;">SLIDE 2 OF 3</div>
      </div>
      
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:24px;">
        AUTONOMOUS <span class="gold-gradient-text">3-SECOND</span><br/>MISSED-CALL TEXTBACK.
      </h1>
      <p style="font-size:30px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Engage every missed caller instantly with conversational SMS &amp; direct appointment self-booking.
      </p>
    </div>

    <!-- Mobile SMS Thread Simulation -->
    <div class="glass-card" style="padding:44px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:16px;height:16px;border-radius:50%;background:#10B981;box-shadow:0 0 14px #10B981;"></div>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:#34D399;">LEADFLOW SMS ENGINE · LIVE</span>
        </div>
        <div class="badge-tag" style="font-size:14px;padding:6px 14px;">SPEED: 2.8 SECONDS</div>
      </div>

      <!-- SMS Bubbles -->
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:18px;padding:18px 24px;text-align:center;">
          <span style="font-size:18px;color:#FCA5A5;font-weight:700;">🔴 Missed Call from (561) 402-9912 at 2:14 PM</span>
        </div>

        <div style="background:linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 100%);border:1px solid rgba(245,158,11,0.4);border-radius:20px;padding:24px 28px;max-width:90%;align-self:flex-end;">
          <div style="font-size:15px;font-family:'JetBrains Mono',monospace;color:#FDE68A;margin-bottom:6px;">2:14 PM (3s LATER) · OUTBOUND SMS</div>
          <div style="font-size:22px;color:#FFFFFF;line-height:1.4;">"Hey! Saw we just missed your call while on a service job. Are you experiencing an emergency or looking for a quote?"</div>
        </div>

        <div style="background:rgba(255,255,255,0.08);border-radius:20px;padding:24px 28px;max-width:85%;">
          <div style="font-size:15px;font-family:'JetBrains Mono',monospace;color:#94A3B8;margin-bottom:6px;">2:15 PM · HOMEOWNER</div>
          <div style="font-size:22px;color:#FFFFFF;line-height:1.4;">"Yes, my water heater is leaking everywhere! Can someone come out today?"</div>
        </div>

        <div style="background:linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 100%);border:1px solid rgba(245,158,11,0.4);border-radius:20px;padding:24px 28px;max-width:90%;align-self:flex-end;">
          <div style="font-size:15px;font-family:'JetBrains Mono',monospace;color:#FDE68A;margin-bottom:6px;">2:15 PM · AUTO DISPATCH</div>
          <div style="font-size:22px;color:#FFFFFF;line-height:1.4;">"We can have a tech out between 3:00 - 4:00 PM. Tap here to lock in your slot: <span style="color:#FBBF24;text-decoration:underline;">vantorx.link/dispatch-38</span>"</div>
        </div>
      </div>
    </div>

    <!-- 3 Core Automation Pillars -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;">
      <div class="glass-card" style="padding:24px 18px;text-align:center;">
        <div style="font-size:32px;margin-bottom:8px;">⚡</div>
        <div style="font-size:19px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">3-Second SMS</div>
        <div style="font-size:15px;color:#94A3B8;">Stops them searching competitors</div>
      </div>
      <div class="glass-card" style="padding:24px 18px;text-align:center;">
        <div style="font-size:32px;margin-bottom:8px;">📅</div>
        <div style="font-size:19px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Self-Booking</div>
        <div style="font-size:15px;color:#94A3B8;">Customer picks open slot</div>
      </div>
      <div class="glass-card" style="padding:24px 18px;text-align:center;">
        <div style="font-size:32px;margin-bottom:8px;">⭐</div>
        <div style="font-size:19px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Review Booster</div>
        <div style="font-size:15px;color:#94A3B8;">Auto Google 5-star texts</div>
      </div>
    </div>

    <!-- Bottom Indicator -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:24px;color:#94A3B8;font-weight:600;">Swipe for Annual Revenue Recovered ➔</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>

  </body>
  </html>
  `;
}

function getLeadflowSlide3Html() {
  return `
  <!DOCTYPE html>
  <html>
  <head><style>${baseCss}</style></head>
  <body style="width:1080px;height:1920px;position:relative;background:radial-gradient(circle at 50% 25%, #1F2A38 0%, #070A0F 80%);padding:140px 70px 120px;display:flex;flex-direction:column;justify-content:space-between;">
    
    <!-- Top Header -->
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:36px;">
        <div class="badge-tag">📲 PRODUCT 03 · LEADFLOW CRM</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;color:#94A3B8;letter-spacing:0.1em;">SLIDE 3 OF 3</div>
      </div>
      
      <h1 style="font-size:74px;font-weight:900;line-height:1.08;letter-spacing:-0.03em;margin-bottom:24px;">
        RECLAIM <span class="gold-gradient-text">+$126,000/YR</span><br/>IN LOST JOBS.
      </h1>
      <p style="font-size:30px;color:#94A3B8;line-height:1.45;font-weight:500;">
        Zero tech setup. We plug LeadFlow directly into your existing trade business phone line.
      </p>
    </div>

    <!-- 3 Metrics Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
      <div class="glass-card" style="padding:32px 20px;text-align:center;">
        <div style="font-size:56px;font-weight:900;color:#10B981;font-family:'Syne',sans-serif;line-height:1;margin-bottom:12px;">3s</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Response Time</div>
        <div style="font-size:15px;color:#94A3B8;">Automatic SMS</div>
      </div>
      <div class="glass-card" style="padding:32px 20px;text-align:center;">
        <div style="font-size:56px;font-weight:900;color:#F59E0B;font-family:'Syne',sans-serif;line-height:1;margin-bottom:12px;">68%</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Recovered Leads</div>
        <div style="font-size:15px;color:#94A3B8;">Converted to booked jobs</div>
      </div>
      <div class="glass-card" style="padding:32px 20px;text-align:center;">
        <div style="font-size:56px;font-weight:900;color:#FBBF24;font-family:'Syne',sans-serif;line-height:1;margin-bottom:12px;">+42</div>
        <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Reviews / 60d</div>
        <div style="font-size:15px;color:#94A3B8;">5-Star Google ratings</div>
      </div>
    </div>

    <!-- Peace of Mind Box -->
    <div class="glass-card gold-glow" style="padding:44px;border-color:rgba(245, 158, 11, 0.6);background:linear-gradient(135deg, rgba(20,28,45,0.9) 0%, rgba(12,17,28,0.9) 100%);">
      <div style="font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:800;color:#FBBF24;letter-spacing:0.08em;margin-bottom:20px;">
        AUTOPILOT OPERATIONS:
      </div>
      
      <div style="display:flex;flex-direction:column;gap:16px;font-size:22px;color:#CBD5E1;">
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Runs Silently 24/7/365:</b> Never takes a sick day, holiday, or break.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Keep Your Existing Phone Number:</b> Zero hardware changes required.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Automated Review Engine:</b> Explodes your Google Local Pack ranking.</span>
        </div>
        <div style="display:flex;gap:14px;align-items:center;">
          <span style="color:#10B981;font-weight:900;font-size:24px;">✓</span>
          <span><b>Zero Tech Skills Needed:</b> 100% managed by the VantorX team.</span>
        </div>
      </div>
    </div>

    <!-- Action CTA Button -->
    <div class="cta-pill">
      <span>📲</span> DM US "LEADFLOW" TO ACTIVATE ON YOUR NUMBER
    </div>

    <!-- Bottom Indicator -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:22px;color:#94A3B8;font-weight:600;">Full setup completed in under 48 hours</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:26px;color:#FFFFFF;">VANTOR<span style="color:#F59E0B;">X</span></div>
    </div>

  </body>
  </html>
  `;
}

// -------------------------------------------------------------
// RENDERING PIPELINE
// -------------------------------------------------------------

async function main() {
  console.log('Launching headless browser via Edge...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();

  const jobs = [
    // 1. Logo Profile Picture
    {
      name: 'vantorx_logo_pfp.png',
      width: 1080,
      height: 1080,
      html: getLogoPfpHtml(),
      targetPaths: [
        path.join(assetsDir, 'vantorx_logo_pfp.png'),
        path.join(outputDir, 'vantorx_logo_pfp.png'),
        path.join(brainDir, 'vantorx_logo_pfp.png')
      ]
    },
    // Product 1: Ava 24/7 Voice AI
    {
      name: 'highlight_ava_1_problem.png',
      width: 1080,
      height: 1920,
      html: getAvaSlide1Html(),
      targetPaths: [
        path.join(outputDir, 'highlight_ava_1_problem.png'),
        path.join(brainDir, 'highlight_ava_1_problem.png')
      ]
    },
    {
      name: 'highlight_ava_2_how_it_works.png',
      width: 1080,
      height: 1920,
      html: getAvaSlide2Html(),
      targetPaths: [
        path.join(outputDir, 'highlight_ava_2_how_it_works.png'),
        path.join(brainDir, 'highlight_ava_2_how_it_works.png')
      ]
    },
    {
      name: 'highlight_ava_3_proof_cta.png',
      width: 1080,
      height: 1920,
      html: getAvaSlide3Html(),
      targetPaths: [
        path.join(outputDir, 'highlight_ava_3_proof_cta.png'),
        path.join(brainDir, 'highlight_ava_3_proof_cta.png')
      ]
    },
    // Product 2: High-Converting Trade Websites
    {
      name: 'highlight_web_1_problem.png',
      width: 1080,
      height: 1920,
      html: getWebSlide1Html(),
      targetPaths: [
        path.join(outputDir, 'highlight_web_1_problem.png'),
        path.join(brainDir, 'highlight_web_1_problem.png')
      ]
    },
    {
      name: 'highlight_web_2_how_it_works.png',
      width: 1080,
      height: 1920,
      html: getWebSlide2Html(),
      targetPaths: [
        path.join(outputDir, 'highlight_web_2_how_it_works.png'),
        path.join(brainDir, 'highlight_web_2_how_it_works.png')
      ]
    },
    {
      name: 'highlight_web_3_proof_cta.png',
      width: 1080,
      height: 1920,
      html: getWebSlide3Html(),
      targetPaths: [
        path.join(outputDir, 'highlight_web_3_proof_cta.png'),
        path.join(brainDir, 'highlight_web_3_proof_cta.png')
      ]
    },
    // Product 3: LeadFlow CRM & Speed-to-Lead
    {
      name: 'highlight_leadflow_1_problem.png',
      width: 1080,
      height: 1920,
      html: getLeadflowSlide1Html(),
      targetPaths: [
        path.join(outputDir, 'highlight_leadflow_1_problem.png'),
        path.join(brainDir, 'highlight_leadflow_1_problem.png')
      ]
    },
    {
      name: 'highlight_leadflow_2_how_it_works.png',
      width: 1080,
      height: 1920,
      html: getLeadflowSlide2Html(),
      targetPaths: [
        path.join(outputDir, 'highlight_leadflow_2_how_it_works.png'),
        path.join(brainDir, 'highlight_leadflow_2_how_it_works.png')
      ]
    },
    {
      name: 'highlight_leadflow_3_proof_cta.png',
      width: 1080,
      height: 1920,
      html: getLeadflowSlide3Html(),
      targetPaths: [
        path.join(outputDir, 'highlight_leadflow_3_proof_cta.png'),
        path.join(brainDir, 'highlight_leadflow_3_proof_cta.png')
      ]
    }
  ];

  const tempHtmlPath = path.resolve('website/assets/instagram/_temp_render.html');

  for (const job of jobs) {
    console.log(`Rendering ${job.name} (${job.width}x${job.height})...`);
    await page.setViewport({ width: job.width, height: job.height, deviceScaleFactor: 1 });
    
    fs.writeFileSync(tempHtmlPath, job.html, 'utf8');
    await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'), { waitUntil: 'load', timeout: 15000 });
    
    // Quick settle delay for styles and fonts
    await new Promise(r => setTimeout(r, 400));

    const buffer = await page.screenshot({ type: 'png', omitBackground: false });

    for (const targetPath of job.targetPaths) {
      fs.writeFileSync(targetPath, buffer);
      console.log(` -> Saved to: ${targetPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    }
  }

  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  await browser.close();
  console.log('All 10 assets rendered successfully!');
}

main().catch(err => {
  console.error('Fatal render error:', err);
  process.exit(1);
});
