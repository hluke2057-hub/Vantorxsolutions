/**
 * VantorX Solutions — LeadFlow Automated SMS Outreach Engine
 * 
 * Objective:
 * Powers direct, high-converting 1-to-1 SMS outreach to verified trade contractor owners.
 * Integrates directly with Twilio API (or Safe Simulation Mode when credentials pending).
 * Embeds custom Mystery Shopper leak audit links and direct Ava test line (561) 813-8602.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const AUDITS_FILE = path.join(REPO_ROOT, 'data', 'mystery_shopper_audits.json');
const SMS_QUEUE_FILE = path.join(REPO_ROOT, 'data', 'leadflow_sms_queue.json');
const WEB_SMS_QUEUE_FILE = path.join(REPO_ROOT, 'website', 'data', 'leadflow_sms_queue.json');

// Twilio Credential Resolution: Environment -> .env
let TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || null;
let TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || null;
let TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || null;

if ((!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) && fs.existsSync(path.join(REPO_ROOT, '.env'))) {
  try {
    const envContent = fs.readFileSync(path.join(REPO_ROOT, '.env'), 'utf8');
    const sidMatch = envContent.match(/TWILIO_ACCOUNT_SID\s*=\s*([^\r\n]+)/);
    const tokenMatch = envContent.match(/TWILIO_AUTH_TOKEN\s*=\s*([^\r\n]+)/);
    const phoneMatch = envContent.match(/TWILIO_PHONE_NUMBER\s*=\s*([^\r\n]+)/);
    if (sidMatch && sidMatch[1]) TWILIO_ACCOUNT_SID = sidMatch[1].trim();
    if (tokenMatch && tokenMatch[1]) TWILIO_AUTH_TOKEN = tokenMatch[1].trim();
    if (phoneMatch && phoneMatch[1]) TWILIO_PHONE_NUMBER = phoneMatch[1].trim();
  } catch (_) {}
}

const DEMO_PHONE = process.env.DEMO_PHONE || "(561) 813-8602";

function readJsonSafe(filePath, defaultVal = []) {
  if (!fs.existsSync(filePath)) return defaultVal;
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
    return JSON.parse(content);
  } catch (err) {
    return defaultVal;
  }
}

function writeJsonSafe(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Normalizes phone numbers to standard E.164 (+1XXXXXXXXXX) format.
 */
function normalizeToE164(phoneStr) {
  if (!phoneStr) return null;
  const digits = phoneStr.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

/**
 * Dispatches an SMS via Twilio API or simulation.
 */
async function sendSms({ to, body, leadId, company }) {
  const e164To = normalizeToE164(to);
  if (!e164To) {
    console.warn(`[LeadFlow SMS] Invalid recipient phone format for ${company}: "${to}"`);
    return { ok: false, error: "Invalid phone number format" };
  }

  // Live Twilio Dispatch Branch
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
    try {
      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
      const authHeader = "Basic " + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
      const params = new URLSearchParams();
      params.append("To", e164To);
      params.append("From", TWILIO_PHONE_NUMBER);
      params.append("Body", body);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(`[Twilio Error] SMS failed for ${company} (${e164To}):`, data.message || data);
        return { ok: false, error: data.message || "Twilio error" };
      }

      return { ok: true, id: data.sid, provider: "twilio_live" };
    } catch (err) {
      console.error(`[Twilio Exception] SMS error for ${company}:`, err.message);
      return { ok: false, error: err.message };
    }
  }

  // Safe Verified Simulation Branch
  const simId = `sim_sms_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return { ok: true, id: simId, provider: "simulation_staged" };
}

/**
 * Runs the LeadFlow SMS Batch Dispatcher.
 */
async function runLeadflowSmsEngine(batchSize = 10) {
  console.log("==========================================================");
  console.log("  VANTORX SOLUTIONS — LEADFLOW AUTOMATED SMS OUTREACH     ");
  console.log("==========================================================");

  const isLive = Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER);
  console.log(`Provider Mode:      ${isLive ? "TWILIO LIVE OUTREACH ACTIVE" : "SAFE VERIFIED SIMULATION MODE"}`);
  if (!isLive) {
    console.log(`[Config Note] Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env for physical dispatch.\n`);
  }

  const audits = readJsonSafe(AUDITS_FILE, []);
  if (!audits.length) {
    console.warn("No mystery shopper audits available to dispatch SMS.");
    return { dispatched: 0, queue: [] };
  }

  const existingQueue = readJsonSafe(SMS_QUEUE_FILE, []);
  const sentLeadIds = new Set(existingQueue.map(item => item.leadId));

  const eligibleAudits = audits.filter(a => !sentLeadIds.has(a.leadId) && a.phone);
  console.log(`Eligible Targets:   ${eligibleAudits.length} contractor owners ready for SMS`);
  console.log(`Dispatch Batch:     Taking next ${Math.min(batchSize, eligibleAudits.length)} targets\n`);

  const currentBatch = eligibleAudits.slice(0, batchSize);
  const newlyDispatched = [];

  for (let i = 0; i < currentBatch.length; i++) {
    const target = currentBatch[i];
    const messageBody = target.smsPitch || `Hey ${target.owner || "there"}, noticed ${target.company}'s emergency line missed after-hours callers. Check your 2-min diagnostic: ${target.auditUrl} or test Ava at ${DEMO_PHONE} - Luke, VantorX`;

    console.log(`[SMS #${i + 1}/${currentBatch.length}] To: ${target.company} (${target.owner || "Owner"}) · ${target.phone}`);
    console.log(`   Message: "${messageBody}"`);

    const result = await sendSms({
      to: target.phone,
      body: messageBody,
      leadId: target.leadId,
      company: target.company
    });

    if (result.ok) {
      console.log(`   ✅ DISPATCHED (${result.provider}) ID: ${result.id}\n`);
      const record = {
        id: result.id,
        leadId: target.leadId,
        company: target.company,
        owner: target.owner,
        phone: target.phone,
        e164Phone: normalizeToE164(target.phone),
        city: target.city,
        trade: target.trade,
        message: messageBody,
        provider: result.provider,
        status: isLive ? "delivered" : "staged_simulation",
        monthlyBleed: target.monthlyBleed,
        dispatchedAt: new Date().toISOString()
      };
      existingQueue.push(record);
      newlyDispatched.push(record);
    } else {
      console.log(`   ⚠️ Skipped: ${result.error}\n`);
    }
  }

  // Save updated SMS queue
  writeJsonSafe(SMS_QUEUE_FILE, existingQueue);
  writeJsonSafe(WEB_SMS_QUEUE_FILE, existingQueue);

  console.log(`📊 Total SMS Logged to Date: ${existingQueue.length}`);
  console.log(`🚀 Newly Dispatched Today:   ${newlyDispatched.length}\n`);

  return {
    dispatchedCount: newlyDispatched.length,
    totalLogged: existingQueue.length,
    batch: newlyDispatched,
    isLive
  };
}

if (require.main === module) {
  runLeadflowSmsEngine(5);
}

module.exports = {
  runLeadflowSmsEngine,
  sendSms,
  normalizeToE164
};
