const fs = require("fs");
const path = require("path");
const { supabaseRequest } = require("./_lib/supabase");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const CANDIDATE_CALL_FILES = [
  path.join("/tmp", "lead_call_records.json"),
  path.resolve(REPO_ROOT, "data", "lead_call_records.json"),
  path.resolve(REPO_ROOT, "website", "data", "lead_call_records.json"),
  path.resolve(__dirname, "..", "data", "lead_call_records.json"),
  path.resolve(process.cwd(), "data", "lead_call_records.json"),
  path.resolve(process.cwd(), "website", "data", "lead_call_records.json"),
];
const CALL_FILES = Array.from(new Set(CANDIDATE_CALL_FILES.map(p => path.normalize(p))));

async function getLeadCallRecords() {
  const merged = {};

  // 1. Read from local storage / disk
  for (const fp of CALL_FILES) {
    try {
      if (fs.existsSync(fp)) {
        const raw = fs.readFileSync(fp, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          Object.assign(merged, parsed);
        }
      }
    } catch (_) {}
  }

  // 2. Read from Supabase audit_log
  try {
    const logs = await supabaseRequest(
      "/rest/v1/audit_log?entity_type=eq.lead_call&select=details,created_at&order=created_at.asc&limit=1000"
    );
    if (Array.isArray(logs)) {
      for (const log of logs) {
        if (!log.details) continue;
        const details = typeof log.details === "string" ? JSON.parse(log.details) : log.details;
        if (details && details.leadId) {
          const id = String(details.leadId);
          merged[id] = {
            ...(merged[id] || {}),
            ...details,
            called: true,
            updatedAt: log.created_at || details.updatedAt || new Date().toISOString()
          };
        }
      }
    }
  } catch (_) {}

  return merged;
}

async function saveLeadCallRecords(records) {
  for (const fp of CALL_FILES) {
    try {
      const dir = path.dirname(fp);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(fp, JSON.stringify(records, null, 2), "utf-8");
    } catch (_) {}
  }
}

module.exports = async function handler(req, res) {
  // Set CORS headers so private tabs & local file links work seamlessly
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const calls = await getLeadCallRecords();
      return res.status(200).json({ ok: true, calls });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  if (req.method === "POST") {
    try {
      let body = req.body;
      if (typeof body === "string") {
        try { body = JSON.parse(body); } catch (_) { body = {}; }
      }
      body = body || {};

      const caller = typeof body.caller === "string" ? body.caller.trim() : "Outbound Closer";
      const nowIso = new Date().toISOString();
      const masterCalls = await getLeadCallRecords();
      const changedRecords = [];

      // Single call update
      if (body.leadId && body.call) {
        const id = String(body.leadId);
        masterCalls[id] = {
          ...(masterCalls[id] || {}),
          ...body.call,
          caller: body.call.caller || caller,
          called: true,
          updatedAt: nowIso
        };
        changedRecords.push({ leadId: id, ...masterCalls[id] });
      }

      // Batch call update
      if (body.calls && typeof body.calls === "object") {
        for (const [id, callData] of Object.entries(body.calls)) {
          if (callData && typeof callData === "object") {
            const sid = String(id);
            masterCalls[sid] = {
              ...(masterCalls[sid] || {}),
              ...callData,
              caller: callData.caller || caller,
              called: true,
              updatedAt: nowIso
            };
            changedRecords.push({ leadId: sid, ...masterCalls[sid] });
          }
        }
      }

      await saveLeadCallRecords(masterCalls);

      // Persist to Supabase audit_log asynchronously
      for (const rec of changedRecords) {
        try {
          await supabaseRequest("/rest/v1/audit_log", {
            method: "POST",
            body: JSON.stringify({
              action: "lead_call.logged",
              entity_type: "lead_call",
              details: rec,
              created_at: nowIso
            })
          });
        } catch (_) {}
      }

      return res.status(200).json({
        ok: true,
        message: `Synced ${changedRecords.length} call records across team`,
        calls: masterCalls
      });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
};
