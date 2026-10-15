/**
 * Autonomous Business Auditor & Cold Outreach Generator
 * 
 * Target: Scans local businesses, analyzes their service vulnerabilities 
 * (e.g. no 24/7 emergency response, slow phone response, missing online booking),
 * and drafts hyper-personalized cold outreach emails.
 */

const SAMPLE_LEADS = [
  {
    businessName: "Apex Emergency Roofing",
    ownerName: "Mike",
    email: "mike@apexroofingdemo.com",
    city: "Miami, FL",
    trade: "Roofing",
    detectedProblem: "No after-hours phone coverage. Weekend emergency calls go straight to generic voicemail.",
    estimatedMissedRevenue: "$4,500/mo"
  },
  {
    businessName: "Comfort Zone HVAC",
    ownerName: "David",
    email: "david@comfortzonehvacdemo.com",
    city: "Tampa, FL",
    trade: "HVAC",
    detectedProblem: "Google reviews mention 2-day delay in returning calls for emergency AC repair.",
    estimatedMissedRevenue: "$6,200/mo"
  },
  {
    businessName: "Precision Plumbing Pros",
    ownerName: "Sarah",
    email: "sarah@precisionplumbingdemo.com",
    city: "Orlando, FL",
    trade: "Plumbing",
    detectedProblem: "No 24/7 live dispatch; website has a broken static contact form with no instant booking.",
    estimatedMissedRevenue: "$3,800/mo"
  }
];

function generatePersonalizedEmail(lead, demoPhoneNumber = "[YOUR-AVA-DEMO-NUMBER]") {
  return `Subject: Quick question regarding ${lead.businessName}'s after-hours calls

Hi ${lead.ownerName},

I was looking at ${lead.businessName} in ${lead.city} and noticed something that's likely costing you jobs: ${lead.detectedProblem}

In the ${lead.trade.toLowerCase()} business, when a homeowner has an emergency, they call the next company on Google if nobody picks up within 3 rings. For most companies your size, that's roughly ${lead.estimatedMissedRevenue} walking out the door every month.

We built Ava — an AI receptionist trained specifically for ${lead.trade.toLowerCase()} contractors. She:
• Answers in 1 ring 24/7/365 (never sick, never misses a call).
• Greet callers, qualifies the job, and books directly into your calendar.
• Immediately texts your tech if it's an urgent emergency.

You can test her right now from your cell phone:
👉 Dial our live test line: ${demoPhoneNumber}

Hear how natural she sounds. If you'd like to put her on your lines this week, reply to this email or book 10 minutes at https://www.vantorxsolutions.com

Best,
Luke
Founder, VantorX Solutions
luke@vantorxsolutions.com
https://www.vantorxsolutions.com`;
}

function runAuditBatch() {
  console.log("=== VANTORX AUTONOMOUS AUDITOR ENGINE ===");
  console.log(`Audited ${SAMPLE_LEADS.length} local businesses...\n`);

  SAMPLE_LEADS.forEach((lead, i) => {
    console.log(`[Lead #${i + 1}] ${lead.businessName} (${lead.trade} - ${lead.city})`);
    console.log(`Detected Issue: ${lead.detectedProblem}`);
    console.log("--- Generated Cold Email ---");
    console.log(generatePersonalizedEmail(lead));
    console.log("\n" + "=".repeat(60) + "\n");
  });
}

if (require.main === module) {
  runAuditBatch();
}

module.exports = { generatePersonalizedEmail, SAMPLE_LEADS };
