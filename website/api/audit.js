const fs = require("fs");
const path = require("path");
const { supabaseRequest, jsonError, methodNotAllowed } = require("./_lib/supabase");
const { sendEmail } = require("./_lib/email");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const CANDIDATE_ROSTER_FILES = [
  path.join("/tmp", "rep_roster.json"),
  path.resolve(REPO_ROOT, "data", "rep_roster.json"),
  path.resolve(REPO_ROOT, "website", "data", "rep_roster.json"),
  path.resolve(__dirname, "..", "data", "rep_roster.json"),
  path.resolve(process.cwd(), "data", "rep_roster.json"),
  path.resolve(process.cwd(), "website", "data", "rep_roster.json"),
];
const ROSTER_FILES = Array.from(new Set(CANDIDATE_ROSTER_FILES.map(p => path.normalize(p))));

function getRoster() {
  for (const fp of ROSTER_FILES) {
    if (fs.existsSync(fp)) {
      try {
        const raw = fs.readFileSync(fp, "utf8");
        const parsed = JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
  }
  return [
    {
      id: "founder_luke",
      name: "Luke Hamilton",
      email: "luke@vantorxsolutions.com",
      role: "Founder & Master Closer",
      avatar: "👑",
      createdAt: "2026-10-20T12:00:00.000Z",
      lastActive: new Date().toISOString(),
      lastAction: "Live Combat Telemetry Monitoring",
      course: {
        completedUnits: ["1-1", "1-2", "1-3", "1-4", "1-5", "2-1", "2-2", "2-3", "2-4", "2-5", "3-1", "3-2", "3-3", "3-4", "3-5"],
        daysPassed: ["Day 1: Psychology & Objections", "Day 2: Leak Math & Pricing", "Day 3: Emergency Live Closes"],
        percent: 100,
        level: 5,
        xp: 1500,
        status: "🏆 Level 5 Certified"
      },
      game: {
        level: 5,
        xp: 1850,
        streak: 7,
        bossesDefeated: 8,
        bossList: ["Rick", "Karen", "Mike", "Dave", "Sal", "Brad", "Gary", "Vito"],
        totalDials: 42,
        dealsClosed: 18,
        bestGrade: "S",
        gold: 1420
      }
    }
  ];
}

function saveRoster(roster) {
  for (const fp of ROSTER_FILES) {
    try {
      const dir = path.dirname(fp);
      const isTmp = fp.startsWith("/tmp") || fp.startsWith("\\tmp");
      if (isTmp || fs.existsSync(dir)) {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fp, JSON.stringify(roster, null, 2), "utf8");
      }
    } catch (_) {}
  }
}

async function handleRepSync(req, res) {
  const body = req.body || {};
  const repData = body.rep || body;
  const milestone = body.milestone || "progress_update";
  const milestoneDetail = body.milestoneDetail || "";

  const name = typeof repData.name === "string" ? repData.name.trim() : "";
  const email = typeof repData.email === "string" ? repData.email.trim().toLowerCase() : "";
  const role = typeof repData.role === "string" ? repData.role.trim() : "Outbound Closer";
  const repId = repData.id || `rep_${Date.now().toString(36)}`;

  if (!name || name.length < 2) {
    return res.status(400).json({ ok: false, error: "Rep name is required." });
  }

  const roster = getRoster();
  let existing = roster.find(r => r.id === repId || (email && r.email && r.email.toLowerCase() === email));

  const nowIso = new Date().toISOString();
  if (!existing) {
    existing = {
      id: repId,
      name,
      email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@vantorxsolutions.com`,
      role,
      avatar: repData.avatar || "⚔️",
      createdAt: nowIso,
      lastActive: nowIso,
      lastAction: milestoneDetail || "Created Account & Started Training",
      course: repData.course || {
        completedUnits: [],
        daysPassed: [],
        percent: 0,
        level: 1,
        xp: 0,
        status: "Day 1 In Progress"
      },
      game: repData.game || {
        level: 1,
        xp: 0,
        streak: 0,
        bossesDefeated: 0,
        bossList: [],
        totalDials: 0,
        dealsClosed: 0,
        bestGrade: "None",
        gold: 0
      }
    };
    roster.push(existing);
  } else {
    existing.name = name || existing.name;
    if (email) existing.email = email;
    existing.role = role || existing.role;
    if (repData.avatar) existing.avatar = repData.avatar;
    existing.lastActive = nowIso;
    if (milestoneDetail) existing.lastAction = milestoneDetail;

    if (repData.course) {
      existing.course = { ...existing.course, ...repData.course };
    }
    if (repData.game) {
      existing.game = { ...existing.game, ...repData.game };
    }
  }

  saveRoster(roster);

  // Background cloud persistence & Supabase keepalive
  try {
    supabaseRequest("/rest/v1/audit_log", {
      method: "POST",
      body: {
        action: `rep_${milestone}`,
        entity_type: "sales_rep",
        entity_id: existing.id,
        payload: {
          name: existing.name,
          email: existing.email,
          role: existing.role,
          course: existing.course,
          game: existing.game,
          milestoneDetail: milestoneDetail || existing.lastAction,
          timestamp: nowIso
        }
      }
    }).catch(err => console.warn("[Supabase Rep Sync Log Warning]", err.message));
  } catch (_) {}

  // Background Milestone Alert Email to Luke
  if (milestone && milestone !== "silent_heartbeat") {
    let alertSubject = `👤 [Rep Progress] ${existing.name}: ${milestoneDetail || milestone}`;
    let alertBadge = "⚡ ACTIVITY UPDATE";
    let alertColor = "#c7a468";

    if (milestone === "account_created") {
      alertSubject = `🚨 [New Closer Hired] ${existing.name} (${existing.email}) joined as ${existing.role}`;
      alertBadge = "🎉 NEW TEAM MEMBER";
      alertColor = "#38bdf8";
    } else if (milestone === "certified") {
      alertSubject = `🏆 [REP CERTIFIED] ${existing.name} completed Closer Academy (Level 5)!`;
      alertBadge = "🏆 CERTIFIED CLOSER";
      alertColor = "#4ade80";
    } else if (milestone === "boss_defeated") {
      alertSubject = `⚔️ [Boss Defeated] ${existing.name} crushed ${milestoneDetail || "Contractor Boss"}!`;
      alertBadge = "🔥 COMBAT VICTORY";
      alertColor = "#f59e0b";
    } else if (milestone === "day_passed") {
      alertSubject = `🎓 [Course Milestone] ${existing.name} passed ${milestoneDetail || "Academy Exam"}!`;
      alertBadge = "📜 EXAM PASSED";
      alertColor = "#a855f7";
    } else if (milestone === "lesson_completed") {
      alertSubject = `📚 [Lesson Completed] ${existing.name} finished ${milestoneDetail || "Closer Academy Lesson"}!`;
      alertBadge = "📖 LESSON COMPLETED";
      alertColor = "#818cf8";
    } else if (milestone === "dials_logged") {
      alertSubject = `📞 [Call Telemetry] ${existing.name} logged live outbound calls!`;
      alertBadge = "📞 OUTBOUND DIALS";
      alertColor = "#38bdf8";
    }

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; padding: 22px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="background: #0b0f16; padding: 18px 24px; border-radius: 8px; margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 800; color: ${alertColor}; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">${alertBadge}</div>
          <h2 style="color: #ffffff; margin: 0; font-size: 21px;">${existing.name} · ${existing.role}</h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13.5px;">Accountability Tracker · ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET</p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">LATEST ACTIVITY:</div>
          <div style="font-size: 16px; font-weight: 700; color: #0f172a;">${milestoneDetail || existing.lastAction}</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14.5px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 150px;"><strong>Email:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;"><a href="mailto:${existing.email}" style="color: #2563eb; text-decoration: none;">${existing.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>🎓 Course Status:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #059669;">
              ${existing.course.status || "In Progress"} (${existing.course.percent || 0}% Complete · ${existing.course.xp || 0} XP)
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>⚔️ Video Game RPG:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">
              Level ${existing.game.level || 1} · ${existing.game.bossesDefeated || 0} Bosses Beaten · 🔥 ${existing.game.streak || 0} Streak (${existing.game.xp || 0} Combat XP)
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>📞 Total Dials:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">
              ${existing.game.totalDials || 0} Dials · ${existing.game.dealsClosed || 0} Deals Closed
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin-top: 24px;">
          <a href="https://www.vantorxsolutions.com/cold-call-arena/" style="display: inline-block; background: #c7a468; color: #0b0f16; font-weight: 700; padding: 11px 22px; border-radius: 6px; text-decoration: none; margin-right: 8px;">View Closer Academy</a>
          <a href="https://www.vantorxsolutions.com/cold-call-quest/" style="display: inline-block; background: #0f172a; color: #ffffff; font-weight: 600; padding: 11px 22px; border-radius: 6px; text-decoration: none;">View Cold Call RPG</a>
        </div>
      </div>
    `;

    sendEmail({
      to: ["hluke2057@gmail.com", "luke@vantorxsolutions.com"],
      subject: alertSubject,
      html: emailHtml,
    }).catch(err => console.warn("[Rep Sync Email Alert Failed]", err.message));
  }

  return res.status(200).json({
    ok: true,
    rep: existing,
    rosterCount: roster.length,
    message: "Rep progress synchronized successfully."
  });
}

async function handleRepDigest(req, res) {
  const roster = getRoster();
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const totalReps = roster.length;
  const certifiedReps = roster.filter(r => (r.course && r.course.percent >= 100) || (r.course && r.course.status && r.course.status.includes("Certified"))).length;
  const activeToday = roster.filter(r => r.lastActive && (now - new Date(r.lastActive).getTime()) <= oneDayMs).length;
  const totalBossesBeaten = roster.reduce((sum, r) => sum + (r.game && r.game.bossesDefeated ? r.game.bossesDefeated : 0), 0);

  const tableRows = roster.map((r, i) => {
    const isCert = (r.course && r.course.percent >= 100) || (r.course && r.course.status && r.course.status.includes("Certified"));
    const timeAgo = r.lastActive ? Math.round((now - new Date(r.lastActive).getTime()) / 3600000) : null;
    let activityText = timeAgo !== null ? (timeAgo < 1 ? "Just now" : `${timeAgo}h ago`) : "Never";
    let statusBadge = `<span style="background: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px;">🔥 Crushing It</span>`;

    if (timeAgo > 48 || timeAgo === null) {
      statusBadge = `<span style="background: #fee2e2; color: #991b1b; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px;">⚠️ Inactive</span>`;
    } else if (!isCert && (r.course?.percent || 0) < 40) {
      statusBadge = `<span style="background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px;">⚡ Learning</span>`;
    }

    return `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 13.5px;">
        <td style="padding: 12px 10px; font-weight: 700; color: #0f172a;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">${r.avatar || "👤"}</span>
            <div>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${r.name}</div>
              <div style="margin-top: 2px;">
                <span style="display: inline-block; font-size: 12px; color: #2563eb; font-weight: 700; background: #eff6ff; padding: 2px 6px; border-radius: 4px; border: 1px solid #bfdbfe;">
                  📧 ${r.email || "No email set"}
                </span>
              </div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${r.role || "Outbound Closer"}</div>
            </div>
          </div>
        </td>
        <td style="padding: 12px 10px;">
          <div style="font-weight: 700; color: ${isCert ? "#059669" : "#d97706"};">
            ${isCert ? "🏆 Level 5 Certified" : `${r.course?.percent || 0}% Complete`}
          </div>
          <div style="font-size: 11.5px; color: #64748b;">${r.course?.daysPassed?.length || 0}/3 Days Passed</div>
        </td>
        <td style="padding: 12px 10px;">
          <div style="font-weight: 700; color: #0f172a;">Lvl ${r.game?.level || 1} · ${r.game?.bossesDefeated || 0} Bosses</div>
          <div style="font-size: 11.5px; color: #64748b;">🔥 ${r.game?.streak || 0} Streak · ${r.game?.dealsClosed || 0} Deals</div>
        </td>
        <td style="padding: 12px 10px; font-size: 12.5px; color: #475569;">
          <div>${activityText}</div>
          <div style="font-size: 11px; color: #94a3b8; max-width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.lastAction || "Active"}</div>
        </td>
        <td style="padding: 12px 10px; text-align: right;">
          ${statusBadge}
        </td>
      </tr>
    `;
  }).join("");

  const digestHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 760px; margin: 0 auto; padding: 22px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="background: #0b0f16; padding: 20px 26px; border-radius: 8px; margin-bottom: 22px;">
        <div style="font-size: 11px; font-weight: 800; color: #c7a468; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">VANTORX EXECUTIVE ROSTER DIGEST</div>
        <h2 style="color: #ffffff; margin: 0; font-size: 22px;">📊 Team &amp; New Hire Accountability Leaderboard</h2>
        <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13.5px;">Live Telemetry on Course Progress &amp; Cold Call Combat · ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</p>
      </div>

      <!-- Quick Metrics Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">Total Reps</div>
          <div style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 2px;">${totalReps}</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">Level 5 Certified</div>
          <div style="font-size: 22px; font-weight: 800; color: #059669; margin-top: 2px;">${certifiedReps}</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">Active Today</div>
          <div style="font-size: 22px; font-weight: 800; color: #2563eb; margin-top: 2px;">${activeToday}</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">Bosses Beaten</div>
          <div style="font-size: 22px; font-weight: 800; color: #d97706; margin-top: 2px;">${totalBossesBeaten}</div>
        </div>
      </div>

      <!-- Leaderboard Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background: #f1f5f9; text-align: left; font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">
            <th style="padding: 10px;">Rep Profile</th>
            <th style="padding: 10px;">🎓 Course Progress</th>
            <th style="padding: 10px;">⚔️ RPG Combat</th>
            <th style="padding: 10px;">Activity</th>
            <th style="padding: 10px; text-align: right;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center;">
        <div style="font-size: 13.5px; font-weight: 600; color: #0f172a; margin-bottom: 10px;">Keep your sales team sharp and accountable:</div>
        <a href="https://www.vantorxsolutions.com/cold-call-arena/" style="display: inline-block; background: #c7a468; color: #0b0f16; font-weight: 700; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-right: 8px;">Open Closer Academy</a>
        <a href="https://www.vantorxsolutions.com/cold-call-quest/" style="display: inline-block; background: #0f172a; color: #ffffff; font-weight: 600; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Open Cold Call RPG</a>
      </div>
    </div>
  `;

  const sendRes = await sendEmail({
    to: ["hluke2057@gmail.com", "luke@vantorxsolutions.com"],
    subject: `📊 [VantorX Leaderboard] Team Telemetry: ${totalReps} Reps Tracked (${certifiedReps} Certified)`,
    html: digestHtml,
  });

  return res.status(200).json({
    ok: true,
    sentTo: ["hluke2057@gmail.com", "luke@vantorxsolutions.com"],
    repCount: totalReps,
    emailId: sendRes.id || null,
    message: "Team telemetry digest dispatched to founder inbox."
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const action = req.query?.action || req.body?.action || null;

  // 1. Rep Roster Ingestion & Progress Sync API
  if (action === "rep-roster") {
    const roster = getRoster();
    return res.status(200).json({ ok: true, roster });
  }

  if (action === "rep-sync") {
    return handleRepSync(req, res);
  }

  if (action === "rep-digest") {
    return handleRepDigest(req, res);
  }

  // 2. Standard Public Website Inbound Audit / Demo Request
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST", "GET"]);
  }

  try {
    const body = req.body || {};

    // Bot trap check
    if (body.website_confirm) {
      return res.status(200).json({ ok: true, message: "Request received." });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const business = typeof body.business === "string" ? body.business.trim() : "";
    const businessType = typeof body.businessType === "string" ? body.businessType.trim() : "";
    const challenge = typeof body.challenge === "string" ? body.challenge.trim() : "";
    const interests = Array.isArray(body.interests) ? body.interests.map(String) : [];

    if (!name || name.length < 2) {
      return res.status(400).json({ ok: false, error: "Please enter your name." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
    }

    const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    const formattedInterests = interests.length ? interests.join(", ") : "General Consultation / Discovery";

    // Dispatch Instant Lead Notification Email to Luke
    const ownerEmailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background: #0b0f16; padding: 16px 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #c7a468; margin: 0; font-size: 20px;">🚨 New Inbound Demo / Audit Request</h2>
          <p style="color: #9ca6b4; margin: 4px 0 0 0; font-size: 13px;">Received via VantorX Marketing Website (${timestamp} ET)</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 15px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px;"><strong>Contact Name:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Business Name:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${business || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Industry / Type:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${businessType || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Phone:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
              ${phone ? `<a href="tel:${phone}" style="color: #c7a468; font-weight: 600; text-decoration: none;">📞 ${phone} (Tap to Call)</a>` : '<span style="color: #94a3b8;">None provided</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Email:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
              <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Selected Packages:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">
              ${formattedInterests}
            </td>
          </tr>
        </table>

        ${challenge ? `
          <div style="background: #f8fafc; border-left: 4px solid #c7a468; padding: 14px 18px; margin-bottom: 24px; border-radius: 4px;">
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">Customer Challenge / Note:</p>
            <p style="margin: 0; font-size: 14px; color: #1e293b; font-style: italic;">"${challenge}"</p>
          </div>
        ` : ""}

        <div style="margin-top: 24px; text-align: center;">
          ${phone ? `<a href="tel:${phone}" style="display: inline-block; background: #c7a468; color: #14110a; font-weight: 700; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-right: 10px;">Call Lead Now</a>` : ""}
          <a href="mailto:${email}?subject=Regarding%20your%20VantorX%20demo%20request" style="display: inline-block; background: #0f172a; color: #ffffff; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Reply via Email</a>
        </div>
      </div>
    `;

    const emailPromises = [
      sendEmail({
        to: ["hluke2057@gmail.com", "luke@vantorxsolutions.com"],
        replyTo: `${name} <${email}>`,
        subject: `🚨 New VantorX Lead: ${name} (${business || "Local Business"})`,
        html: ownerEmailHtml,
      }),
      sendEmail({
        to: email,
        subject: "We received your demo request — VantorX Solutions",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0f172a; margin-bottom: 8px;">Hi ${name},</h2>
            <p>Thank you for reaching out to VantorX Solutions! We received your request regarding <strong>${business || "your business"}</strong>.</p>
            <p>We are reviewing your requested services (<strong>${formattedInterests}</strong>) and will follow up shortly to schedule your personalized walk-through.</p>
            
            <div style="background: #f8fafc; border-left: 4px solid #c7a468; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #475569;">
                <strong>Want to test our AI right now?</strong><br>
                You can call Ava, our 24/7 AI Receptionist, at <a href="tel:5618138602" style="color: #c7a468; font-weight: bold; text-decoration: none;">(561) 813-8602</a> to hear how she handles emergency calls and appointments in real time.
              </p>
            </div>

            <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
              Best regards,<br>
              <strong style="color: #0f172a;">Luke</strong><br>
              Founder, VantorX Solutions<br>
              <a href="https://www.vantorxsolutions.com" style="color: #c7a468;">vantorxsolutions.com</a> · (561) 813-8602
            </p>
          </div>
        `,
      }),
    ];

    const supabasePromise = supabaseRequest("/rest/v1/rpc/submit_public_inquiry", {
      method: "POST",
      body: JSON.stringify({
        inquiry_name: name,
        inquiry_email: email,
        inquiry_phone: phone || null,
        inquiry_business: business || null,
        inquiry_type: businessType || null,
        inquiry_interests: interests,
        inquiry_challenge: challenge || null,
      }),
    }).catch((err) => {
      console.warn("[VantorX Audit] Supabase RPC fallback:", err.message);
      return { ok: false, error: err.message };
    });

    await Promise.allSettled([...emailPromises, supabasePromise]);

    return res.status(200).json({
      ok: true,
      message: "Thanks — we've received your request and will be in touch shortly.",
    });
  } catch (err) {
    return jsonError(res, err);
  }
};
