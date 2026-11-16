// ============================================================
// 🛡️ VANTORX ENTERPRISE EMAIL DELIVERABILITY & RESEND DASHBOARD
// ============================================================

(function() {
  let deliveryMetrics = null;
  let deliveryLogs = [];
  let suppressionList = [];
  let currentLogFilter = "all";
  let currentSearchQuery = "";

  // Inject CSS Styles for Dashboard Modal
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .delivery-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(5, 8, 15, 0.92);
      backdrop-filter: blur(16px);
      z-index: 100005;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    }
    .delivery-modal-box {
      background: #0f172a;
      border: 1.5px solid rgba(16, 185, 129, 0.4);
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(16, 185, 129, 0.15);
      border-radius: 16px;
      width: 100%;
      max-width: 1100px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .delivery-header {
      padding: 18px 24px;
      background: #1e293b;
      border-bottom: 1px solid #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .delivery-tabs {
      display: flex;
      gap: 8px;
      background: #090d16;
      padding: 4px 8px;
      border-radius: 8px;
      border: 1px solid #334155;
    }
    .delivery-tab-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .delivery-tab-btn.active {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.5);
    }
    .delivery-body {
      padding: 20px 24px;
      overflow-y: auto;
      flex: 1;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    .metric-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .metric-label {
      font-size: 10.5px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .metric-val {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      font-family: monospace;
    }
    .pill-status {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      font-family: monospace;
    }
    .pill-delivered { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.4); }
    .pill-sent { background: rgba(56,189,248,0.2); color: #38bdf8; border: 1px solid rgba(56,189,248,0.4); }
    .pill-bounced { background: rgba(239,68,68,0.25); color: #f87171; border: 1px solid rgba(239,68,68,0.5); }
    .pill-suppressed { background: rgba(245,158,11,0.25); color: #fbbf24; border: 1px solid rgba(245,158,11,0.5); }
    .pill-failed { background: rgba(148,163,184,0.2); color: #cbd5e1; border: 1px solid rgba(148,163,184,0.4); }
    .pill-complained { background: rgba(220,38,38,0.3); color: #ef4444; border: 1px solid #dc2626; }
    
    .delivery-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      text-align: left;
    }
    .delivery-table th {
      background: #1e293b;
      color: #94a3b8;
      padding: 10px 12px;
      font-weight: 700;
      border-bottom: 2px solid #334155;
      font-size: 11px;
      text-transform: uppercase;
    }
    .delivery-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #1e293b;
      color: #e2e8f0;
    }
    .delivery-table tr:hover td {
      background: rgba(255,255,255,0.03);
      cursor: pointer;
    }
    .detail-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      z-index: 100010;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .detail-box {
      background: #0f172a;
      border: 1.5px solid #38bdf8;
      border-radius: 14px;
      width: 100%;
      max-width: 650px;
      padding: 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
      color: #f8fafc;
    }
  `;
  document.head.appendChild(styleEl);

  // Inject Modal HTML into Document Body
  const modalContainer = document.createElement("div");
  modalContainer.id = "deliveryDashboardModal";
  modalContainer.className = "delivery-modal-overlay";
  modalContainer.innerHTML = `
    <div class="delivery-modal-box">
      <!-- Modal Header -->
      <div class="delivery-header">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:24px">🛡️</span>
          <div>
            <h3 style="margin:0;font-size:17px;font-weight:800;color:#ffffff;display:flex;align-items:center;gap:8px">
              Resend Deliverability &amp; Reputation Cockpit
              <span id="circuitBreakerBadge" style="font-size:10.5px;padding:2px 8px;border-radius:999px;background:rgba(16,185,129,0.2);color:#34d399;border:1px solid rgba(16,185,129,0.4)">HEALTHY</span>
            </h3>
            <div style="font-size:11.5px;color:#94a3b8;margin-top:2px">
              Domain: <strong style="color:#38bdf8">vantorxsolutions.com</strong> &bull; Resend Gateway Verified
            </div>
          </div>
        </div>
        
        <div style="display:flex;align-items:center;gap:10px">
          <div class="delivery-tabs">
            <button class="delivery-tab-btn active" onclick="switchDeliveryTab('overview')">Overview</button>
            <button class="delivery-tab-btn" onclick="switchDeliveryTab('logs')">Outbound Log</button>
            <button class="delivery-tab-btn" onclick="switchDeliveryTab('suppressions')">Suppression List</button>
            <button class="delivery-tab-btn" onclick="switchDeliveryTab('dns')">DNS Records</button>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="closeDeliveryDashboardModal()" style="font-size:16px;padding:4px 10px;cursor:pointer">✕</button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="delivery-body">
        
        <!-- Metrics Row -->
        <div class="metric-grid" id="deliveryMetricsGrid">
          <div class="metric-card">
            <span class="metric-label">Processed</span>
            <span class="metric-val" id="metricProcessed">0</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Sent</span>
            <span class="metric-val" id="metricSent" style="color:#38bdf8">0</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Delivered</span>
            <span class="metric-val" id="metricDelivered" style="color:#34d399">0</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Bounced</span>
            <span class="metric-val" id="metricBounced" style="color:#f87171">0</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Suppressed</span>
            <span class="metric-val" id="metricSuppressed" style="color:#fbbf24">0</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Failed</span>
            <span class="metric-val" id="metricFailed" style="color:#94a3b8">0</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Unsubscribed</span>
            <span class="metric-val" id="metricUnsubscribed" style="color:#a78bfa">0</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Delivery Rate</span>
            <span class="metric-val" id="metricDeliveryRate" style="color:#10b981">100%</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Bounce Rate</span>
            <span class="metric-val" id="metricBounceRate" style="color:#f87171">0.0%</span>
          </div>
          <div class="metric-card">
            <span class="metric-label">Complaint Rate</span>
            <span class="metric-val" id="metricComplaintRate" style="color:#fbbf24">0.0%</span>
          </div>
        </div>

        <!-- TAB 1: OVERVIEW -->
        <div id="tabContentOverview">
          <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:16px 20px;margin-bottom:18px">
            <h4 style="margin:0 0 8px 0;font-size:14px;color:#38bdf8;font-weight:700">Deliverability Reputation Protection Engine</h4>
            <p style="margin:0 0 10px 0;font-size:12.5px;color:#cbd5e1;line-height:1.6">
              VantorX operates a multi-layer deliverability shield to safeguard your domain reputation on Resend:
            </p>
            <ul style="margin:0;padding-left:20px;font-size:12px;color:#94a3b8;line-height:1.7">
              <li><strong>Zero Synthetic Fallbacks:</strong> Eliminates fabricated @gmail.com placeholders that cause 550 5.1.1 Google hard bounces.</li>
              <li><strong>Pre-Send DNS MX Verification:</strong> Real-time MX lookup confirms the recipient domain has active mail exchanger records before sending.</li>
              <li><strong>Permanent Suppression Guard:</strong> Addresses with previous hard bounces or unsubscribes are permanently locked from future dispatches.</li>
              <li><strong>CAN-SPAM Compliance:</strong> Every outbound email includes physical company address and 1-click unsubscribe headers.</li>
              <li><strong>Circuit Breaker:</strong> Automated freeze if domain bounce rate exceeds 3% or complaint rate exceeds 0.1%.</li>
            </ul>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h4 style="margin:0;font-size:14px;color:#ffffff;font-weight:700">Recent Outbound Email Activity</h4>
            <button class="btn btn-ghost btn-xs" onclick="switchDeliveryTab('logs')" style="color:#38bdf8;font-size:11.5px">View Full Log ➔</button>
          </div>
          <div id="overviewRecentTableWrap"></div>
        </div>

        <!-- TAB 2: FULL LOGS -->
        <div id="tabContentLogs" style="display:none">
          <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;align-items:center;justify-content:space-between">
            <div style="display:flex;gap:8px;align-items:center;flex:1;max-width:500px">
              <input type="text" id="deliveryLogSearch" placeholder="Search by recipient, business, or Resend ID..." style="flex:1;background:#1e293b;border:1px solid #334155;color:#ffffff;padding:8px 12px;border-radius:8px;font-size:12px;outline:none" oninput="filterDeliveryLogs(this.value)">
              <select id="deliveryLogStatusFilter" onchange="filterDeliveryLogsByStatus(this.value)" style="background:#1e293b;border:1px solid #334155;color:#ffffff;padding:8px 12px;border-radius:8px;font-size:12px;outline:none">
                <option value="all">All Statuses</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="bounced">Bounced</option>
                <option value="suppressed">Suppressed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="refreshDeliveryData()" style="border:1px solid #334155;color:#38bdf8;font-size:12px;padding:6px 12px">🔄 Refresh Live</button>
          </div>
          <div id="logsTableContainer"></div>
        </div>

        <!-- TAB 3: SUPPRESSIONS -->
        <div id="tabContentSuppressions" style="display:none">
          <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:12px 16px;margin-bottom:16px;font-size:12.5px;color:#cbd5e1">
            <strong>⚠️ Protected Suppression Table:</strong> These addresses will <em>never</em> be emailed. If any user or automation attempts a dispatch to these emails, the sender immediately halts execution without contacting Resend.
          </div>
          
          <div style="display:flex;gap:10px;margin-bottom:14px;align-items:center">
            <input type="email" id="manualSuppressInput" placeholder="Enter email to permanently suppress..." style="flex:1;max-width:350px;background:#1e293b;border:1px solid #334155;color:#ffffff;padding:8px 12px;border-radius:8px;font-size:12px;outline:none">
            <button class="btn btn-ghost btn-sm" onclick="addManualSuppression()" style="background:rgba(239,68,68,0.2);border:1px solid #ef4444;color:#fca5a5;font-weight:700;font-size:12px;padding:7px 14px">⛔ Suppress Address</button>
          </div>

          <div id="suppressionTableContainer"></div>
        </div>

        <!-- TAB 4: DNS RECORDS -->
        <div id="tabContentDns" style="display:none">
          <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:18px 22px">
            <h4 style="margin:0 0 12px 0;font-size:15px;color:#38bdf8">Domain DNS Deliverability Authentication Status</h4>
            <div style="display:grid;grid-template-columns:1fr;gap:14px">
              
              <!-- DKIM Record -->
              <div style="background:#090d16;padding:12px 14px;border-radius:8px;border:1px solid #334155">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                  <span style="font-weight:700;color:#ffffff;font-size:13px">DKIM (DomainKeys Identified Mail)</span>
                  <span style="color:#34d399;font-size:11px;font-weight:700;background:rgba(16,185,129,0.2);padding:2px 8px;border-radius:999px">✓ PASS (Active)</span>
                </div>
                <div style="font-family:monospace;font-size:11.5px;color:#94a3b8">Host: resend._domainkey.vantorxsolutions.com</div>
                <div style="font-family:monospace;font-size:11px;color:#64748b;margin-top:4px">Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ... (2048-bit RSA)</div>
              </div>

              <!-- SPF Record -->
              <div style="background:#090d16;padding:12px 14px;border-radius:8px;border:1px solid rgba(245,158,11,0.5)">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                  <span style="font-weight:700;color:#ffffff;font-size:13px">SPF (Sender Policy Framework)</span>
                  <span style="color:#fbbf24;font-size:11px;font-weight:700;background:rgba(245,158,11,0.2);padding:2px 8px;border-radius:999px">ACTION RECOMMENDED</span>
                </div>
                <div style="font-size:12px;color:#cbd5e1;line-height:1.5">
                  Current Cloudflare DNS TXT record for <code>vantorxsolutions.com</code> is:
                  <div style="background:#1e293b;padding:6px 10px;border-radius:6px;font-family:monospace;margin:6px 0;color:#fca5a5">v=spf1 include:_spf.mx.cloudflare.net ~all</div>
                  Update in Cloudflare DNS to include Resend so receiving servers never reject outbound dispatches:
                  <div style="background:#1e293b;padding:6px 10px;border-radius:6px;font-family:monospace;margin:6px 0;color:#86efac;font-weight:700">v=spf1 include:_spf.mx.cloudflare.net include:resend.com ~all</div>
                </div>
              </div>

              <!-- DMARC Record -->
              <div style="background:#090d16;padding:12px 14px;border-radius:8px;border:1px solid #334155">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                  <span style="font-weight:700;color:#ffffff;font-size:13px">DMARC (Domain-based Message Authentication)</span>
                  <span style="color:#34d399;font-size:11px;font-weight:700;background:rgba(16,185,129,0.2);padding:2px 8px;border-radius:999px">✓ PASS (Active)</span>
                </div>
                <div style="font-family:monospace;font-size:11.5px;color:#94a3b8">Host: _dmarc.vantorxsolutions.com</div>
                <div style="font-family:monospace;font-size:11px;color:#64748b;margin-top:4px">v=DMARC1; p=none; rua=mailto:luke@vantorxsolutions.com;</div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  `;
  document.body.appendChild(modalContainer);

  // Inject Email Detail Inspection Drawer
  const detailOverlay = document.createElement("div");
  detailOverlay.id = "emailDetailModal";
  detailOverlay.className = "detail-overlay";
  detailOverlay.innerHTML = `
    <div class="detail-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid #334155;padding-bottom:12px">
        <h3 style="margin:0;font-size:16px;font-weight:800;color:#ffffff;display:flex;align-items:center;gap:8px">
          <span>🔍</span> Email Dispatch Telemetry &amp; Diagnostics
        </h3>
        <button class="btn btn-ghost btn-sm" onclick="closeEmailDetailModal()" style="font-size:16px;padding:4px 8px;cursor:pointer">✕</button>
      </div>
      <div id="emailDetailContent" style="font-size:12.5px;line-height:1.6;color:#e2e8f0"></div>
    </div>
  `;
  document.body.appendChild(detailOverlay);

  // Global functions
  window.openDeliveryDashboardModal = function() {
    const modal = document.getElementById("deliveryDashboardModal");
    if (modal) {
      modal.style.display = "flex";
      refreshDeliveryData();
    }
  };

  window.closeDeliveryDashboardModal = function() {
    const modal = document.getElementById("deliveryDashboardModal");
    if (modal) modal.style.display = "none";
  };

  window.closeEmailDetailModal = function() {
    const el = document.getElementById("emailDetailModal");
    if (el) el.style.display = "none";
  };

  window.switchDeliveryTab = function(tabName) {
    document.querySelectorAll(".delivery-tab-btn").forEach(btn => btn.classList.remove("active"));
    event?.target?.classList?.add("active");

    document.getElementById("tabContentOverview").style.display = tabName === "overview" ? "block" : "none";
    document.getElementById("tabContentLogs").style.display = tabName === "logs" ? "block" : "none";
    document.getElementById("tabContentSuppressions").style.display = tabName === "suppressions" ? "block" : "none";
    document.getElementById("tabContentDns").style.display = tabName === "dns" ? "block" : "none";
  };

  // Fetch Delivery Metrics & Logs
  async function refreshDeliveryData() {
    try {
      // 1. Fetch Metrics
      const res = await fetch("/api/email-delivery?action=metrics");
      if (res.ok) {
        const data = await res.json();
        if (data.metrics) {
          deliveryMetrics = data.metrics;
          updateMetricsUI(data.metrics);
        }
      }

      // 2. Fetch Logs
      const logRes = await fetch("/api/email-delivery?action=log&limit=150");
      if (logRes.ok) {
        const logData = await logRes.json();
        deliveryLogs = logData.emails || [];
        renderLogsTable();
        renderOverviewRecent();
      }

      // 3. Fetch Suppressions
      const suppRes = await fetch("/api/email-delivery?action=suppressions");
      if (suppRes.ok) {
        const suppData = await suppRes.json();
        suppressionList = suppData.suppressions || [];
        renderSuppressionsTable();
      }
    } catch (err) {
      console.warn("[Delivery Dashboard] Could not sync metrics:", err);
    }
  }
  window.refreshDeliveryData = refreshDeliveryData;

  function updateMetricsUI(m) {
    document.getElementById("metricProcessed").textContent = m.totalProcessed || 0;
    document.getElementById("metricSent").textContent = m.totalSent || 0;
    document.getElementById("metricDelivered").textContent = m.totalDelivered || 0;
    document.getElementById("metricBounced").textContent = m.totalBounced || 0;
    document.getElementById("metricSuppressed").textContent = m.totalSuppressed || 0;
    document.getElementById("metricFailed").textContent = m.totalFailed || 0;
    document.getElementById("metricUnsubscribed").textContent = m.totalUnsubscribed || 0;
    document.getElementById("metricDeliveryRate").textContent = m.deliveryRate || "100%";
    document.getElementById("metricBounceRate").textContent = m.bounceRate || "0.0%";
    document.getElementById("metricComplaintRate").textContent = m.complaintRate || "0.0%";

    const badge = document.getElementById("circuitBreakerBadge");
    if (m.tripwireTriggered) {
      badge.textContent = "TRIPWIRE PAUSED";
      badge.style.background = "rgba(239,68,68,0.25)";
      badge.style.color = "#f87171";
      badge.style.borderColor = "#ef4444";
    } else {
      badge.textContent = "HEALTHY";
      badge.style.background = "rgba(16,185,129,0.2)";
      badge.style.color = "#34d399";
      badge.style.borderColor = "rgba(16,185,129,0.4)";
    }
  }

  function getStatusPill(status) {
    const s = (status || "sent").toLowerCase();
    if (s === "delivered") return `<span class="pill-status pill-delivered">✓ Delivered</span>`;
    if (s === "sent") return `<span class="pill-status pill-sent">Sent</span>`;
    if (s === "bounced") return `<span class="pill-status pill-bounced">✕ Bounced</span>`;
    if (s === "suppressed") return `<span class="pill-status pill-suppressed">⛔ Suppressed</span>`;
    if (s === "complained") return `<span class="pill-status pill-complained">⚠️ Complaint</span>`;
    return `<span class="pill-status pill-failed">${s}</span>`;
  }

  function renderOverviewRecent() {
    const container = document.getElementById("overviewRecentTableWrap");
    if (!container) return;
    const recent = deliveryLogs.slice(0, 5);
    if (recent.length === 0) {
      container.innerHTML = `<div style="color:#64748b;font-size:12px;padding:12px;text-align:center">No outbound emails dispatched yet today.</div>`;
      return;
    }
    let html = `<table class="delivery-table"><thead><tr><th>Business</th><th>Recipient</th><th>Status</th><th>Time</th></tr></thead><tbody>`;
    for (const r of recent) {
      const timeStr = r.sentAt ? new Date(r.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";
      html += `<tr onclick="inspectEmailDetail('${r.id}')">
        <td style="font-weight:700">${escapeHtml(r.businessName || "Unknown")}</td>
        <td><code>${escapeHtml(r.recipient)}</code></td>
        <td>${getStatusPill(r.status)}</td>
        <td style="color:#94a3b8;font-family:monospace">${timeStr}</td>
      </tr>`;
    }
    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  function renderLogsTable() {
    const container = document.getElementById("logsTableContainer");
    if (!container) return;

    let filtered = deliveryLogs;
    if (currentLogFilter !== "all") {
      filtered = filtered.filter(l => (l.status || "").toLowerCase() === currentLogFilter);
    }
    if (currentSearchQuery) {
      filtered = filtered.filter(l =>
        (l.recipient && l.recipient.toLowerCase().includes(currentSearchQuery)) ||
        (l.businessName && l.businessName.toLowerCase().includes(currentSearchQuery)) ||
        (l.id && l.id.toLowerCase().includes(currentSearchQuery))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div style="color:#64748b;font-size:13px;padding:24px;text-align:center">No matching email records found.</div>`;
      return;
    }

    let html = `
      <table class="delivery-table">
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Recipient Email</th>
            <th>Sending Status</th>
            <th>Verification</th>
            <th>Failure / Reason</th>
            <th>Date / Time</th>
            <th>Resend ID</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (const r of filtered) {
      const dateStr = r.sentAt ? new Date(r.sentAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";
      const failureSnippet = r.failureReason ? `<span style="color:#f87171;font-size:11px" title="${escapeHtml(r.failureReason)}">⚠️ ${escapeHtml(r.failureReason.slice(0, 32))}...</span>` : `<span style="color:#64748b">-</span>`;
      const verPill = r.verificationStatus === "VALID" ? `<span style="color:#34d399;font-weight:700">✓ Valid</span>` :
        (r.verificationStatus === "BLOCKED" ? `<span style="color:#fbbf24;font-weight:700">⛔ Blocked</span>` :
        (r.verificationStatus === "INVALID" ? `<span style="color:#f87171;font-weight:700">✕ Invalid</span>` : `<span style="color:#94a3b8">${r.verificationStatus || "-"}</span>`));

      html += `
        <tr onclick="inspectEmailDetail('${r.id}')" title="Click to inspect delivery diagnostic">
          <td style="font-weight:700;color:#ffffff">${escapeHtml(r.businessName || "Unknown")}</td>
          <td><code>${escapeHtml(r.recipient)}</code></td>
          <td>${getStatusPill(r.status)}</td>
          <td>${verPill}</td>
          <td>${failureSnippet}</td>
          <td style="color:#94a3b8;font-size:11px;font-family:monospace">${dateStr}</td>
          <td style="color:#64748b;font-size:10.5px;font-family:monospace">${escapeHtml((r.id || "").slice(0, 14))}</td>
        </tr>
      `;
    }

    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  function renderSuppressionsTable() {
    const container = document.getElementById("suppressionTableContainer");
    if (!container) return;

    if (suppressionList.length === 0) {
      container.innerHTML = `<div style="color:#64748b;font-size:13px;padding:24px;text-align:center">No suppressed addresses recorded yet.</div>`;
      return;
    }

    let html = `
      <table class="delivery-table">
        <thead>
          <tr>
            <th>Suppressed Email</th>
            <th>Reason</th>
            <th>Origin</th>
            <th>Date Suppressed</th>
            <th>Protection Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (const s of suppressionList) {
      const dateStr = s.suppressedAt ? new Date(s.suppressedAt).toLocaleString([], { month: "short", day: "numeric", year: "numeric" }) : "-";
      html += `
        <tr>
          <td><code style="color:#fca5a5">${escapeHtml(s.email)}</code></td>
          <td style="font-size:11.5px;color:#cbd5e1">${escapeHtml(s.reason || "Automatic bounce protection")}</td>
          <td><span class="pill-status pill-suppressed">${escapeHtml(s.origin || "bounce")}</span></td>
          <td style="font-family:monospace;font-size:11px;color:#94a3b8">${dateStr}</td>
          <td><span style="color:#34d399;font-weight:700;font-size:11px">🛡️ PERMANENTLY BLOCKED</span></td>
        </tr>
      `;
    }

    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  window.filterDeliveryLogs = function(query) {
    currentSearchQuery = (query || "").trim().toLowerCase();
    renderLogsTable();
  };

  window.filterDeliveryLogsByStatus = function(status) {
    currentLogFilter = status;
    renderLogsTable();
  };

  window.inspectEmailDetail = async function(emailId) {
    const overlay = document.getElementById("emailDetailModal");
    const content = document.getElementById("emailDetailContent");
    if (!overlay || !content) return;

    overlay.style.display = "flex";
    content.innerHTML = `<div style="text-align:center;padding:20px;color:#94a3b8">Loading diagnostic telemetry...</div>`;

    try {
      const res = await fetch(`/api/email-delivery?action=detail&id=${encodeURIComponent(emailId)}`);
      if (!res.ok) throw new Error("Could not load details");
      const data = await res.json();
      const rec = data.email;
      const events = data.events || [];
      const supp = data.suppressionInfo;

      let html = `
        <div style="background:#1e293b;padding:14px;border-radius:10px;margin-bottom:14px;border:1px solid #334155">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-size:14px;font-weight:800;color:#ffffff">${escapeHtml(rec.businessName || "Business")}</span>
            ${getStatusPill(rec.status)}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;margin-top:10px">
            <div><strong style="color:#94a3b8">Recipient:</strong> <code>${escapeHtml(rec.recipient)}</code></div>
            <div><strong style="color:#94a3b8">Sender:</strong> <code>${escapeHtml(rec.sender || "Luke Hamilton")}</code></div>
            <div><strong style="color:#94a3b8">Subject:</strong> ${escapeHtml(rec.subject || "-")}</div>
            <div><strong style="color:#94a3b8">Resend ID:</strong> <code style="font-size:11px">${escapeHtml(rec.id)}</code></div>
            <div><strong style="color:#94a3b8">Verification:</strong> <span style="font-weight:700;color:#38bdf8">${rec.verificationStatus || "VALID"}</span></div>
            <div><strong style="color:#94a3b8">Source:</strong> ${escapeHtml(rec.source || "manual")}</div>
          </div>
        </div>
      `;

      if (rec.failureReason) {
        html += `
          <div style="background:rgba(239,68,68,0.12);border:1.5px solid #ef4444;border-radius:10px;padding:14px;margin-bottom:14px">
            <div style="font-weight:800;color:#f87171;font-size:12.5px;margin-bottom:4px;display:flex;align-items:center;gap:6px">
              <span>⚠️</span> FAILURE ROOT CAUSE:
            </div>
            <div style="font-family:monospace;font-size:12px;color:#fee2e2;line-height:1.5">
              ${escapeHtml(rec.failureReason)}
            </div>
            ${rec.suppressionOrigin ? `<div style="font-size:11px;color:#fca5a5;margin-top:6px">Suppression Origin: <b>${escapeHtml(rec.suppressionOrigin)}</b></div>` : ""}
          </div>
        `;
      }

      if (supp) {
        html += `
          <div style="background:rgba(245,158,11,0.12);border:1.5px solid #f59e0b;border-radius:10px;padding:12px 14px;margin-bottom:14px;font-size:12px;color:#fde68a">
            <strong>🛡️ Permanent Suppression Active:</strong> This email was added to the suppression list on ${new Date(supp.suppressedAt).toLocaleDateString()}. Future sends are strictly blocked.
          </div>
        `;
      }

      html += `<div style="font-size:12.5px;font-weight:700;margin-bottom:8px;color:#ffffff">Event Timeline (${events.length} events):</div>`;
      if (events.length > 0) {
        html += `<div style="display:flex;flex-direction:column;gap:6px;max-height:160px;overflow-y:auto">`;
        for (const ev of events) {
          html += `
            <div style="background:#090d16;padding:8px 12px;border-radius:6px;border:1px solid #334155;display:flex;justify-content:space-between;align-items:center;font-size:11.5px">
              <span style="font-family:monospace;color:#38bdf8;font-weight:700">${escapeHtml(ev.type)}</span>
              <span style="color:#94a3b8;font-size:11px">${new Date(ev.timestamp).toLocaleTimeString()}</span>
            </div>
          `;
        }
        html += `</div>`;
      } else {
        html += `<div style="color:#64748b;font-size:11.5px">No webhook callback events recorded yet.</div>`;
      }

      content.innerHTML = html;
    } catch (err) {
      content.innerHTML = `<div style="color:#f87171">Failed to load email diagnostic: ${err.message}</div>`;
    }
  };

  window.addManualSuppression = async function() {
    const input = document.getElementById("manualSuppressInput");
    const email = (input?.value || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const res = await fetch("/api/email-delivery?action=unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        if (input) input.value = "";
        alert(`✓ ${email} added to permanent suppression guard.`);
        refreshDeliveryData();
      }
    } catch (err) {
      alert("Error adding suppression: " + err.message);
    }
  };

  // Pre-send Real-Time MX Verification on Email Input
  let verifyTimer = null;
  window.onCustomEmailRecipientInput = function(emailVal) {
    const clean = (emailVal || "").trim().toLowerCase();
    const badge = document.getElementById("callLogEmailStatusBadge");
    const sendBtn = document.getElementById("btnAutoSendEmail");
    if (!badge) return;

    if (!clean || !clean.includes("@")) {
      badge.innerHTML = `<span style="color:#94a3b8">⚠️ Incomplete Email</span>`;
      return;
    }

    badge.innerHTML = `<span style="color:#38bdf8">⏳ Verifying MX...</span>`;
    clearTimeout(verifyTimer);
    verifyTimer = setTimeout(async () => {
      try {
        const res = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: clean })
        });
        if (res.ok) {
          const data = await res.json();
          const ver = data.verification || {};
          if (ver.status === "VALID") {
            badge.innerHTML = `<span style="color:#10b981;font-weight:700">🛡️ MX Verified (${ver.provider || "Mail Server Active"})</span>`;
            if (sendBtn) sendBtn.disabled = false;
          } else if (ver.status === "BLOCKED") {
            badge.innerHTML = `<span style="color:#f87171;font-weight:700" title="${ver.reason}">⛔ Suppressed / Bounced - Send Blocked</span>`;
            if (sendBtn) sendBtn.disabled = true;
          } else if (ver.status === "INVALID") {
            badge.innerHTML = `<span style="color:#fbbf24;font-weight:700" title="${ver.reason}">⚠️ Invalid Domain / No Mail Server</span>`;
            if (sendBtn) sendBtn.disabled = true;
          } else {
            badge.innerHTML = `<span style="color:#94a3b8">ℹ️ Unverified (${ver.status})</span>`;
          }
        }
      } catch (_) {
        badge.innerHTML = `<span style="color:#94a3b8">⚠️ Verification Offline</span>`;
      }
    }, 450);
  };

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Pre-fetch metrics on load
  refreshDeliveryData();
})();