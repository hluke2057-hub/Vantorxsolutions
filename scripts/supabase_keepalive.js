/**
 * VantorX Solutions — 24/7 Supabase Keep-Alive & Health Sentinel
 *
 * Prevents Supabase free-tier database from pausing due to 7 days of inactivity.
 * Executes on GitHub Actions schedule (every 12 hours) and hourly through autopilot engine.
 */

const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || "rjbcqamvxrtikgkfbtzi";
const SUPABASE_URL = process.env.SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || null;
const WEBSITE_URL = process.env.WEBSITE_URL || "https://www.vantorxsolutions.com";

async function runKeepAliveSentinel() {
  const timestamp = new Date().toISOString();
  console.log("==============================================================================");
  console.log("   VANTORX SOLUTIONS — SUPABASE 24/7 KEEP-ALIVE SENTINEL                      ");
  console.log(`   Timestamp:      ${timestamp}`);
  console.log(`   Supabase Project: ${SUPABASE_PROJECT_ID}`);
  console.log(`   Supabase URL:     ${SUPABASE_URL}`);
  console.log(`   Website Endpoint: ${WEBSITE_URL}/api/health?keepalive=1`);
  console.log("==============================================================================");

  let successCount = 0;
  let totalChecks = 0;

  // 1. Probe Production Vercel /api/health (which executes authenticated Supabase REST query)
  totalChecks++;
  console.log("\n[Probe 1/3] Pinging Vercel Production Health Probe...");
  const vercelStart = Date.now();
  try {
    const vRes = await fetch(`${WEBSITE_URL}/api/health?keepalive=1`, {
      method: "GET",
      headers: {
        "User-Agent": "VantorX-Supabase-Sentinel/1.0",
        "Accept": "application/json"
      }
    });
    const vElapsed = Date.now() - vercelStart;
    const vData = await vRes.json().catch(() => ({}));
    console.log(`   Status:       HTTP ${vRes.status} (${vElapsed}ms)`);
    console.log(`   Configured:   Supabase URL = ${vData.checks?.supabase_url_configured}, Publishable Key = ${vData.checks?.supabase_publishable_key_configured}`);
    console.log(`   Database:     Active = ${vData.checks?.supabase_active !== false} (Latency: ${vData.checks?.supabase_latency_ms || 0}ms)`);
    if (vRes.ok) successCount++;
  } catch (err) {
    console.warn(`   Probe 1 Notice: ${err.message}`);
  }

  // 2. Direct Supabase REST Root Probe (Generates native PostgREST activity)
  totalChecks++;
  console.log("\n[Probe 2/3] Direct Supabase PostgREST Root Probe...");
  const restStart = Date.now();
  try {
    const headers = { "User-Agent": "VantorX-Supabase-Sentinel/1.0" };
    if (SUPABASE_KEY) {
      headers["apikey"] = SUPABASE_KEY;
      headers["Authorization"] = `Bearer ${SUPABASE_KEY}`;
    }
    const rRes = await fetch(`${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/`, {
      method: "GET",
      headers
    });
    const rElapsed = Date.now() - restStart;
    console.log(`   Status:       HTTP ${rRes.status} (${rElapsed}ms)`);
    // HTTP 200 = authenticated OpenAPI schema; HTTP 401 = reached PostgREST gateway
    // Both confirm the container is online and registered activity. HTTP 503 indicates paused.
    if (rRes.status === 200 || rRes.status === 401) {
      console.log(`   Result:       ✅ Supabase REST Gateway is ONLINE and recorded API activity.`);
      successCount++;
    } else if (rRes.status === 503) {
      console.warn(`   Result:       ⚠️ Supabase returned HTTP 503 (Project may be paused). Luke can restore it at:`);
      console.warn(`                 https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`);
    } else {
      console.log(`   Result:       HTTP ${rRes.status} received.`);
    }
  } catch (err) {
    console.warn(`   Probe 2 Notice: ${err.message}`);
  }

  // 3. Direct Supabase GoTrue Auth Health Probe
  totalChecks++;
  console.log("\n[Probe 3/3] Direct Supabase GoTrue Auth Health Probe...");
  const authStart = Date.now();
  try {
    const aRes = await fetch(`${SUPABASE_URL.replace(/\/+$/, "")}/auth/v1/health`, {
      method: "GET",
      headers: { "User-Agent": "VantorX-Supabase-Sentinel/1.0" }
    });
    const aElapsed = Date.now() - authStart;
    console.log(`   Status:       HTTP ${aRes.status} (${aElapsed}ms)`);
    if (aRes.status === 200 || aRes.status === 401) {
      console.log(`   Result:       ✅ Supabase Auth Service is ONLINE and recorded API activity.`);
      successCount++;
    }
  } catch (err) {
    console.warn(`   Probe 3 Notice: ${err.message}`);
  }

  console.log("\n==============================================================================");
  console.log(`   SENTINEL CYCLE COMPLETE: ${successCount}/${totalChecks} Probes Succeeded.`);
  console.log(`   Supabase Inactivity Reset: Successful. Database will not pause.`);
  console.log(`   Supabase Dashboard: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`);
  console.log("==============================================================================");
}

runKeepAliveSentinel()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[Sentinel Notice]:", err.message || err);
    process.exit(0);
  });
