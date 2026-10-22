# PowerShell script to build the complete multi-product cold calling cockpit
$ErrorActionPreference = "Stop"

$leadsRaw = [System.IO.File]::ReadAllText("$PSScriptRoot/../data/normalized_lead_targets.json", [System.Text.Encoding]::UTF8)

$htmlTemplate = @'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VantorX — Cold Calling Cockpit, 250+ Nationwide Leads &amp; Sales RPG</title>
<meta name="description" content="Multi-product cold calling teleprompter, 250+ nationwide trade leads dispatcher with 25-daily automated rotation, call tracking, 45+ objection battlecards, and Cold Call Quest RPG.">
<meta name="version" content="2.2.0-daily-leads">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#070a0f;--bg2:#0f1522;--bg3:#151d2f;--line:rgba(255,255,255,0.08);--line2:rgba(255,255,255,0.14);
  --ink:#f1f5f9;--dim:#94a3b8;--faint:#64748b;
  --accent:#f59e0b;--accent2:#fbbf24;--accent-glow:rgba(245,158,11,0.22);
  --ok:#34d399;--err:#f87171;--blue:#38bdf8;--purple:#a855f7;
  --font-sans:'Inter',system-ui,sans-serif;--font-head:'Space Grotesk',sans-serif;--font-mono:'IBM Plex Mono',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:var(--font-sans);line-height:1.5;-webkit-font-smoothing:antialiased;min-height:100vh;padding-bottom:70px}
.wrap{max-width:1220px;margin:0 auto;padding:0 20px}

/* Top Header */
header{background:rgba(15,21,34,0.88);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);padding:14px 0;position:sticky;top:0;z-index:50}
.head-grid{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px}
.brand{font-family:var(--font-head);font-size:20px;font-weight:700;display:flex;align-items:center;gap:8px}
.brand span{color:var(--accent)}
.live-demo-pill{background:var(--bg3);border:1px solid rgba(245,158,11,0.3);padding:6px 14px;border-radius:999px;font-size:13px;font-weight:600;color:var(--accent2);display:inline-flex;align-items:center;gap:8px;cursor:pointer;transition:all 0.15s}
.live-demo-pill:hover{background:rgba(245,158,11,0.15);border-color:var(--accent)}

/* Navigation Tabs */
.tabs{display:flex;gap:8px;margin:16px 0 16px;border-bottom:1px solid var(--line);padding:10px 0;overflow-x:auto;position:sticky;top:58px;z-index:45;background:rgba(7,10,15,0.96);backdrop-filter:blur(14px)}
.tab-btn{background:none;border:none;color:var(--dim);font-family:var(--font-head);font-size:14.5px;font-weight:600;padding:8px 16px;border-radius:8px;cursor:pointer;transition:all 0.15s;white-space:nowrap}
.tab-btn.active{background:var(--accent-glow);color:var(--accent2);border:1px solid rgba(245,158,11,0.35)}
.tab-btn:hover:not(.active){color:var(--ink);background:var(--bg2)}

/* Tab Panels */
.tab-panel{display:none}
.tab-panel.active{display:block;animation:fadeIn 0.25s ease-out}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

/* Teleprompter Card */
.teleprompter{background:var(--bg2);border:1px solid var(--line2);border-radius:18px;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,0.4);position:relative}
.teleprompter::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--accent2),var(--accent))}
.script-section-header{display:flex;align-items:center;justify-content:space-between;margin:22px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--line)}
.script-section-header h3{font-family:var(--font-head);font-size:16.5px;font-weight:700;color:var(--accent2);display:flex;align-items:center;gap:8px}

.script-phase{margin-bottom:16px;background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:16px 20px}
.phase-tag{font-size:11.5px;font-family:var(--font-mono);font-weight:600;color:var(--accent2);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between}
.script-line{font-size:17.5px;font-weight:600;color:#ffffff;line-height:1.6}
.script-line em{color:var(--accent2);font-style:normal;background:rgba(245,158,11,0.12);padding:1px 6px;border-radius:4px}
.script-line strong{color:var(--blue);font-weight:700}
.delivery-tip{font-size:13px;color:var(--dim);margin-top:10px;display:flex;align-items:center;gap:6px}

/* Objection Accordions */
.obj-accordion{border:1px solid var(--line);border-radius:12px;background:var(--bg);margin-bottom:10px;overflow:hidden;transition:border-color 0.15s}
.obj-accordion:hover{border-color:rgba(245,158,11,0.3)}
.obj-acc-head{padding:13px 18px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;font-weight:600;font-size:15px;color:#fca5a5}
.obj-acc-head span.tag{font-size:11px;font-family:var(--font-mono);background:var(--bg2);color:var(--dim);padding:3px 8px;border-radius:4px}
.obj-acc-body{padding:0 18px 16px;display:none;font-size:15px;line-height:1.6;color:#ffffff;border-top:1px solid var(--line);padding-top:12px;background:var(--bg3)}
.obj-acc-body em{color:var(--accent2);font-style:normal}
.obj-acc-note{font-size:12.5px;color:var(--dim);margin-top:8px}

/* 📋 LEAD DISPATCHER & LEAK CALCULATOR TABLE (EXCEL STYLE) */
.lead-cockpit{background:var(--bg2);border:1px solid var(--line2);border-radius:18px;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,0.4);position:relative}

/* 📅 DAILY BATCH & DIAL QUOTA HUD */
.daily-batch-banner{background:linear-gradient(135deg,rgba(15,23,42,0.98),rgba(26,36,56,0.98));border:1.5px solid rgba(245,158,11,0.35);border-radius:14px;padding:16px 20px;margin-bottom:20px;box-shadow:0 10px 30px rgba(0,0,0,0.3)}
.batch-hud-grid{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.batch-title-area h3{font-family:var(--font-head);font-size:17.5px;font-weight:700;color:var(--accent2);display:flex;align-items:center;gap:8px}
.batch-subtitle{font-size:12.5px;color:var(--dim);margin-top:3px}
.batch-controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.custom-select{background:var(--bg);border:1px solid var(--line2);color:var(--ink);padding:8px 12px;border-radius:8px;font-family:var(--font-head);font-size:13px;font-weight:600;cursor:pointer;outline:none}
.custom-select:focus{border-color:var(--accent)}

/* 🎯 QUOTA & CALL PROGRESS TRACKER */
.quota-progress-card{margin-top:14px;padding-top:12px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.quota-meter-wrap{flex:1;min-width:240px}
.quota-meter-header{display:flex;justify-content:space-between;font-size:12px;font-family:var(--font-mono);color:var(--dim);margin-bottom:5px}
.quota-meter-header strong{color:#ffffff}
.quota-bar-track{height:8px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden;position:relative}
.quota-bar-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--accent2),var(--ok));border-radius:999px;transition:width 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:0 0 10px rgba(52,211,153,0.4)}
.quota-stats-chips{display:flex;gap:8px;flex-wrap:wrap}
.quota-chip{background:var(--bg);border:1px solid var(--line);padding:4px 10px;border-radius:6px;font-size:11.5px;font-family:var(--font-mono);display:flex;align-items:center;gap:6px}

/* 📞 CALL STATUS CHECKBOX & ROW HIGHLIGHTING */
.lead-status-box{display:flex;align-items:center;gap:8px}
.call-checkbox{appearance:none;-webkit-appearance:none;width:18px;height:18px;border:2px solid var(--dim);border-radius:4px;background:var(--bg);cursor:pointer;display:grid;place-content:center;transition:all 0.15s;flex-shrink:0}
.call-checkbox:checked{background:var(--ok);border-color:var(--ok)}
.call-checkbox:checked::before{content:'✓';color:#070a0f;font-size:13px;font-weight:900}
.call-checkbox:hover{border-color:var(--accent2)}
.status-badge{font-size:11px;font-family:var(--font-mono);font-weight:700;padding:2px 7px;border-radius:5px;display:inline-flex;align-items:center;gap:4px}
.status-badge-uncalled{background:rgba(148,163,184,0.12);color:var(--dim);border:1px solid rgba(148,163,184,0.25)}
.status-badge-called{background:rgba(52,211,153,0.15);color:#6ee7b7;border:1px solid rgba(52,211,153,0.4)}
.outcome-select{background:var(--bg2);border:1px solid var(--line);color:var(--ink);font-size:11.5px;border-radius:5px;padding:2px 6px;cursor:pointer;outline:none;max-width:145px}
.outcome-select:focus{border-color:var(--accent)}
.caller-tag{font-size:10px;color:var(--ok);font-family:var(--font-mono);margin-top:2px}
.btn-note{background:none;border:none;color:var(--dim);cursor:pointer;font-size:13px;padding:2px;transition:color 0.15s}
.btn-note:hover{color:var(--accent2)}
.excel-table tr.lead-row-called{background:rgba(52,211,153,0.04)}
.excel-table tr.lead-row-called:hover td{background:rgba(52,211,153,0.08)}
.excel-table tr.lead-row-called .lead-company-name{color:#94a3b8!important;text-decoration:line-through;text-decoration-color:rgba(52,211,153,0.6)}

.kpi-bar{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:20px}
.kpi-card{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:14px 16px}
.kpi-label{font-size:11px;font-family:var(--font-mono);color:var(--dim);text-transform:uppercase;margin-bottom:4px}
.kpi-val{font-size:20px;font-weight:800;color:#ffffff}
.kpi-sub{font-size:11.5px;color:var(--dim);margin-top:2px}

.lead-filter-bar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin:16px 0 20px}
.lead-search-box{flex:1;min-width:260px;position:relative}
.lead-search-input{width:100%;background:var(--bg);border:1px solid var(--line2);border-radius:10px;padding:10px 14px 10px 38px;color:var(--ink);font-size:13.5px}
.lead-search-input:focus{outline:none;border-color:var(--accent)}
.lead-search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--dim);font-size:14px;pointer-events:none}

.lead-pills{display:flex;gap:8px;flex-wrap:wrap}
.lead-pill-btn{background:var(--bg);border:1px solid var(--line);color:var(--dim);padding:7px 14px;border-radius:999px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s}
.lead-pill-btn:hover,.lead-pill-btn.active{background:rgba(245,158,11,0.15);border-color:var(--accent);color:var(--accent2)}

.excel-table-wrap{overflow-x:auto;overflow-y:auto;border:1px solid var(--line2);border-radius:14px;background:var(--bg);max-height:820px;position:relative}
.excel-table-wrap::-webkit-scrollbar{width:8px;height:8px}
.excel-table-wrap::-webkit-scrollbar-track{background:var(--bg2)}
.excel-table-wrap::-webkit-scrollbar-thumb{background:var(--line2);border-radius:4px}
.excel-table-wrap::-webkit-scrollbar-thumb:hover{background:var(--accent)}

.lead-pagination-bar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:12px 16px;background:var(--bg2);border:1px solid var(--line2);border-radius:12px;margin-bottom:12px}
.lead-page-info{font-size:12.5px;color:var(--dim);display:flex;align-items:center;gap:10px}
.lead-page-info strong{color:#ffffff}
.lead-page-nav{display:flex;align-items:center;gap:6px}
.btn-page-nav{background:var(--bg);border:1px solid var(--line);color:var(--ink);padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.15s}
.btn-page-nav:hover:not(:disabled){border-color:var(--accent);color:var(--accent2);background:rgba(245,158,11,0.12)}
.btn-page-nav:disabled{opacity:0.35;cursor:not-allowed}
.lead-size-selector{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dim)}
.btn-size-pill{background:var(--bg);border:1px solid var(--line);color:var(--dim);padding:4px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;transition:all 0.15s}
.btn-size-pill.active,.btn-size-pill:hover{background:rgba(245,158,11,0.22);border-color:var(--accent);color:var(--accent2)}
.btn-reset-filters{background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.35);color:#fca5a5;padding:5px 12px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.15s}
.btn-reset-filters:hover{background:rgba(239,68,68,0.3);border-color:rgba(239,68,68,0.6);color:#ffffff}
.search-scope-badge{font-size:11px;font-family:var(--font-mono);font-weight:700;background:rgba(56,189,248,0.15);border:1px solid rgba(56,189,248,0.35);color:#7dd3fc;padding:2px 8px;border-radius:4px;display:inline-block}

.excel-table{width:100%;border-collapse:collapse;font-size:13px;text-align:left;white-space:nowrap}
.excel-table th{background:var(--bg3);padding:12px 14px;font-family:var(--font-mono);font-size:11.5px;font-weight:700;color:var(--dim);border-bottom:1px solid var(--line2);position:sticky;top:0;z-index:10;text-transform:uppercase;letter-spacing:0.04em}
.excel-table td{padding:12px 14px;border-bottom:1px solid var(--line);vertical-align:middle}
.excel-table tr:hover td{background:rgba(245,158,11,0.06)}
.excel-table tr.selected td{background:rgba(245,158,11,0.14)}

.badge-leak{background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;padding:3px 8px;border-radius:6px;font-family:var(--font-mono);font-weight:700;font-size:11.5px;display:inline-block}
.badge-save{background:rgba(52,211,153,0.15);border:1px solid rgba(52,211,153,0.4);color:#6ee7b7;padding:3px 8px;border-radius:6px;font-family:var(--font-mono);font-weight:700;font-size:11.5px;display:inline-block}
.math-info-pill{font-size:10px;font-family:var(--font-mono);font-weight:700;background:rgba(245,158,11,0.18);border:1px solid rgba(245,158,11,0.45);color:var(--accent2);padding:2px 6px;border-radius:4px;cursor:pointer;margin-left:5px;vertical-align:middle;display:inline-block;transition:all 0.15s ease}
.math-info-pill:hover{background:var(--accent);color:#000000;box-shadow:0 0 8px rgba(245,158,11,0.4)}
.badge-prod{padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700;font-family:var(--font-mono);display:inline-block}
.badge-prod-ava{background:rgba(56,189,248,0.15);color:#7dd3fc;border:1px solid rgba(56,189,248,0.3)}
.badge-prod-website{background:rgba(168,85,247,0.15);color:#d8b4fe;border:1px solid rgba(168,85,247,0.3)}
.badge-prod-speed{background:rgba(245,158,11,0.15);color:#fde047;border:1px solid rgba(245,158,11,0.3)}
.badge-prod-aeo{background:rgba(52,211,153,0.15);color:#86efac;border:1px solid rgba(52,211,153,0.3)}
.badge-prod-bundle{background:linear-gradient(90deg,rgba(245,158,11,0.2),rgba(168,85,247,0.2));color:#fef08a;border:1px solid var(--accent)}

.btn-pitch-lead{background:linear-gradient(135deg,var(--accent2),var(--accent));color:#070a0f;font-weight:800;border:none;border-radius:6px;padding:6px 12px;font-size:11.5px;cursor:pointer;transition:transform 0.1s;display:inline-flex;align-items:center;gap:4px}
.btn-pitch-lead:hover{transform:scale(1.05);box-shadow:0 0 10px rgba(245,158,11,0.3)}

/* 🎯 ACTIVE DIAL LEAD BANNER (IN SCRIPT TAB) */
.active-lead-banner{background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.95));border:2px solid var(--accent);border-radius:14px;padding:16px 20px;margin-bottom:20px;box-shadow:0 10px 30px rgba(245,158,11,0.15)}
.active-lead-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--line)}
.active-lead-title{font-family:var(--font-head);font-size:17.5px;font-weight:700;color:#ffffff;display:flex;align-items:center;gap:10px}
.active-lead-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;font-size:13px}
.active-lead-cell{background:rgba(0,0,0,0.3);padding:10px 12px;border-radius:8px;border:1px solid var(--line)}
.active-lead-label{font-size:11px;font-family:var(--font-mono);color:var(--dim);text-transform:uppercase;margin-bottom:4px}
.active-lead-val{font-weight:700;color:#ffffff}
.active-lead-leak-quote{margin-top:12px;background:rgba(239,68,68,0.12);border-left:4px solid #ef4444;padding:10px 14px;border-radius:8px;font-size:14px;color:#fee2e2;line-height:1.5}
.active-lead-leak-quote strong{color:#ffffff}

/* 🔄 PRODUCT SWITCHER BAR IN SCRIPT TAB */
.product-switcher-bar{display:flex;gap:8px;margin-bottom:20px;overflow-x:auto;padding-bottom:6px;border-bottom:1px solid var(--line)}
.prod-switch-btn{background:var(--bg);border:1px solid var(--line2);color:var(--dim);padding:10px 18px;border-radius:10px;font-family:var(--font-head);font-size:13.5px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.15s;display:flex;align-items:center;gap:8px}
.prod-switch-btn:hover{color:var(--ink);border-color:var(--line)}
.prod-switch-btn.active{background:rgba(245,158,11,0.15);border-color:var(--accent);color:var(--accent2);box-shadow:0 0 14px rgba(245,158,11,0.2)}

.product-script-panel{display:none}
.product-script-panel.active{display:block;animation:fadeIn 0.25s ease-out}

/* RPG STYLING */
.rpg-cockpit{background:var(--bg2);border:1px solid var(--line2);border-radius:20px;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,0.5);position:relative}
.rpg-header{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
@media(max-width:768px){.rpg-header{grid-template-columns:1fr}}

.player-card{background:var(--bg3);border:2px solid var(--accent);border-radius:16px;padding:16px;position:relative;overflow:hidden}
.player-card::before{content:'';position:absolute;top:0;right:0;width:120px;height:120px;background:radial-gradient(circle,rgba(245,158,11,0.18),transparent 70%)}
.player-info{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.player-avatar{width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,var(--accent2),var(--accent));display:grid;place-items:center;font-size:24px;color:#070a0f;font-weight:800}
.player-name{font-family:var(--font-head);font-weight:700;font-size:17px}
.player-title{font-size:12px;color:var(--accent2);font-family:var(--font-mono)}

.stat-bar-wrap{margin-bottom:8px}
.stat-label{display:flex;justify-content:space-between;font-size:11.5px;font-family:var(--font-mono);color:var(--dim);margin-bottom:4px}
.bar-track{width:100%;height:10px;background:rgba(0,0,0,0.5);border-radius:999px;overflow:hidden;border:1px solid var(--line)}
.bar-fill-hp{height:100%;background:linear-gradient(90deg,#ef4444,#22c55e);width:100%;transition:width 0.3s ease}
.bar-fill-xp{height:100%;background:linear-gradient(90deg,#f59e0b,#fbbf24);width:0%;transition:width 0.3s ease}

.boss-card{background:var(--bg3);border:2px solid #ef4444;border-radius:16px;padding:16px;position:relative}
.boss-info{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.boss-avatar{width:48px;height:48px;border-radius:12px;background:#ef4444;display:grid;place-items:center;font-size:24px}
.boss-name{font-family:var(--font-head);font-weight:700;font-size:17px;color:#fca5a5}
.boss-title{font-size:12px;color:#f87171;font-family:var(--font-mono)}
.bar-fill-boss{height:100%;background:linear-gradient(90deg,#f87171,#ef4444);width:100%;transition:width 0.3s ease}

.impatience-banner{background:rgba(15,23,42,0.9);border:1px solid rgba(239,68,68,0.35);border-radius:14px;padding:12px 16px;margin-bottom:16px}
.impatience-top{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px;font-family:var(--font-mono);font-size:12px}
.impatience-title{display:flex;align-items:center;gap:8px;font-weight:700;color:var(--accent2)}
.impatience-digits{font-size:16px;font-weight:800;background:rgba(245,158,11,0.2);padding:2px 8px;border-radius:6px;color:#ffffff}
.impatience-digits.urgent{background:#ef4444;color:#ffffff;animation:pulseUrgent 0.6s infinite alternate}
@keyframes pulseUrgent{from{transform:scale(1)}to{transform:scale(1.08)}}
.impatience-warn{font-size:11.5px;color:var(--err)}
.impatience-track{width:100%;height:8px;background:rgba(0,0,0,0.6);border-radius:999px;overflow:hidden;border:1px solid var(--line)}
.impatience-fill{height:100%;background:linear-gradient(90deg,#22c55e,#f59e0b,#ef4444);width:100%;transition:width 1s linear}

.call-stages-bar{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:16px}
@media(max-width:768px){.call-stages-bar{grid-template-columns:1fr 1fr;gap:6px}}
.stage-step{background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:8px 10px;text-align:center;font-size:11.5px;font-weight:600;color:var(--dim);transition:all 0.2s}
.stage-step.active{background:rgba(245,158,11,0.14);border-color:var(--accent);color:var(--accent2);box-shadow:0 0 10px rgba(245,158,11,0.2)}
.stage-step.done{background:rgba(52,211,153,0.1);border-color:var(--ok);color:var(--ok)}
.stage-step .step-num{display:inline-block;width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,0.1);line-height:16px;font-size:10px;margin-right:4px}

.inventory-bar{background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.inv-title{font-size:12px;font-family:var(--font-mono);font-weight:700;color:var(--accent2);text-transform:uppercase;letter-spacing:0.06em}
.swords-rack{display:flex;gap:8px;flex-wrap:wrap}
.sword-slot{background:var(--bg2);border:1px solid var(--line2);border-radius:8px;padding:6px 12px;font-size:12px;display:flex;align-items:center;gap:6px;font-weight:600;color:var(--dim)}
.sword-slot.equipped{border-color:var(--accent);color:#ffffff;background:rgba(245,158,11,0.12);box-shadow:0 0 10px rgba(245,158,11,0.25)}
.sword-slot.locked{opacity:0.4;cursor:not-allowed}

.battle-arena{display:grid;grid-template-columns:270px 1fr;gap:16px}
@media(max-width:880px){.battle-arena{grid-template-columns:1fr}}

.dungeons-list{background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:14px}
.dungeon-item{background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:12px;margin-bottom:8px;cursor:pointer;transition:all 0.15s}
.dungeon-item:hover{border-color:var(--accent)}
.dungeon-item.active{background:rgba(245,158,11,0.1);border-color:var(--accent)}

.combat-terminal{background:var(--bg);border:1px solid var(--line2);border-radius:14px;display:flex;flex-direction:column;height:520px;overflow:hidden}
.terminal-head{background:var(--bg3);padding:10px 16px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;font-family:var(--font-mono);font-size:12px}
.combat-log{flex:1;padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;font-size:14px}
.log-row{padding:10px 14px;border-radius:10px;line-height:1.5}
.log-boss{background:rgba(239,68,68,0.12);border-left:4px solid #ef4444;color:#fee2e2}
.log-luke{background:rgba(245,158,11,0.12);border-left:4px solid var(--accent);color:#fef3c7}
.log-system{background:rgba(56,189,248,0.1);border-left:4px solid var(--blue);color:#e0f2fe;font-size:12.5px;font-family:var(--font-mono)}
.log-regen{background:rgba(239,68,68,0.18);border-left:4px solid #f87171;color:#fecaca;font-weight:600}
.log-victory{background:linear-gradient(90deg,rgba(52,211,153,0.25),transparent);border-left:5px solid var(--ok);color:#a7f3d0;font-weight:700}

.log-coach{background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.35);border-left:4px solid var(--purple);color:#f3e8ff}
.coach-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;font-family:var(--font-mono);font-size:12px}
.coach-title{display:flex;align-items:center;gap:6px;color:#d8b4fe;font-weight:700}
.coach-grade-badge{font-weight:800;padding:2px 8px;border-radius:4px;font-size:11.5px;letter-spacing:0.04em}
.grade-s{background:#10b981;color:#022c22;box-shadow:0 0 8px rgba(16,185,129,0.4)}
.grade-a{background:#38bdf8;color:#082f49}
.grade-b{background:#f59e0b;color:#451a03}
.grade-c{background:#f97316;color:#431407}
.grade-f{background:#ef4444;color:#ffffff;animation:pulseUrgent 0.8s infinite alternate}
.coach-critique{font-size:13.5px;margin-bottom:6px;color:#ffffff}
.coach-prescription{background:rgba(0,0,0,0.3);border-radius:6px;padding:6px 10px;font-size:12.5px;color:#fbcfe8;margin-bottom:6px}
.coach-impact{font-size:12px;font-family:var(--font-mono);color:#c084fc}

.coach-hint-drawer{background:rgba(15,23,42,0.95);border:1px solid var(--accent);border-radius:10px;padding:12px 14px;margin-bottom:10px}
.hint-header{display:flex;align-items:center;justify-content:space-between;font-family:var(--font-mono);font-size:11.5px;color:var(--accent2);margin-bottom:6px;font-weight:700}
.btn-close-hint{background:none;border:none;color:var(--dim);cursor:pointer;font-size:14px}
.hint-body{font-size:13px;line-height:1.5;color:#fef3c7}

.combat-actions{background:var(--bg3);border-top:1px solid var(--line);padding:12px 14px}
.verbal-combat-form{display:flex;gap:8px;align-items:center}
.btn-mic{background:var(--bg);border:1px solid var(--line2);color:var(--ink);padding:10px 12px;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.15s;white-space:nowrap}
.btn-mic:hover{border-color:var(--accent);color:var(--accent2)}
.btn-mic.recording{background:#ef4444;color:#ffffff;border-color:#ef4444;animation:pulseMic 0.8s infinite alternate}
@keyframes pulseMic{from{box-shadow:0 0 5px #ef4444}to{box-shadow:0 0 16px #ef4444}}
.verbal-input{flex:1;background:var(--bg);border:1px solid var(--line2);border-radius:8px;padding:11px 14px;color:var(--ink);font-size:14px}
.verbal-input:focus{outline:none;border-color:var(--accent)}
.btn-hint{background:var(--bg);border:1px solid rgba(245,158,11,0.4);color:var(--accent2);padding:10px 12px;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;white-space:nowrap}
.btn-hint:hover{background:rgba(245,158,11,0.15)}
.btn-send-rebuttal{background:linear-gradient(135deg,var(--accent2),var(--accent));color:#070a0f;font-weight:800;border:none;border-radius:8px;padding:11px 18px;cursor:pointer;font-size:13.5px;white-space:nowrap;transition:all 0.15s}
.btn-send-rebuttal:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(245,158,11,0.3)}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:700;font-size:14px;padding:10px 18px;border-radius:10px;cursor:pointer;text-decoration:none;border:none}
.btn-gold{background:linear-gradient(135deg,var(--accent2),var(--accent));color:#070a0f}
.btn-ghost{background:var(--bg3);color:var(--ink);border:1px solid var(--line2)}
.btn-sm{padding:7px 14px;font-size:12.5px}

.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:#1e293b;border:1px solid var(--accent);color:var(--ink);padding:10px 20px;border-radius:999px;font-size:13.5px;opacity:0;transition:all 0.25s;pointer-events:none;z-index:99}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

.level-up-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.9);background:var(--bg2);border:2px solid var(--accent);box-shadow:0 0 50px rgba(245,158,11,0.5);border-radius:20px;padding:32px 28px;text-align:center;max-width:440px;width:90%;z-index:100;opacity:0;pointer-events:none;transition:all 0.3s ease}
.level-up-modal.active{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}

/* 👤 User Profile Badge & Account Center */
.user-profile-badge{display:flex;align-items:center;gap:9px;background:var(--bg3);border:1.5px solid rgba(245,158,11,0.35);padding:5px 14px 5px 8px;border-radius:999px;cursor:pointer;transition:all 0.15s;user-select:none}
.user-profile-badge:hover{background:rgba(245,158,11,0.18);border-color:var(--accent)}
.user-avatar{width:26px;height:26px;border-radius:50%;background:rgba(245,158,11,0.25);display:flex;align-items:center;justify-content:center;font-size:14px}
.user-meta{display:flex;flex-direction:column;line-height:1.2}
.user-name{font-size:12.5px;font-weight:700;color:#ffffff}
.user-rank{font-size:10.5px;color:var(--accent2);font-family:var(--font-mono)}

/* 🔒 Modals & Overlays */
.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.78);backdrop-filter:blur(8px);z-index:110;display:none;align-items:center;justify-content:center;padding:20px}
.modal-overlay.active{display:flex}
.modal-box{background:var(--bg2);border:1.5px solid rgba(245,158,11,0.45);border-radius:20px;padding:28px;max-width:520px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.65);position:relative;animation:fadeIn 0.2s ease-out}

/* 🔒 Level 5 Lead Gating Card */
.leads-locked-card{background:linear-gradient(135deg,rgba(15,21,34,0.98),rgba(22,30,50,0.98));border:2px solid rgba(245,158,11,0.45);border-radius:18px;padding:48px 32px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.5);margin:20px 0}
.lock-shield-icon{font-size:56px;margin-bottom:12px;filter:drop-shadow(0 0 18px rgba(245,158,11,0.5))}
.leads-locked-card h2{font-size:24px;font-family:var(--font-head);color:#ffffff;margin-bottom:8px}
.lock-subtitle{font-size:14.5px;color:var(--dim);max-width:620px;margin:0 auto 24px;line-height:1.6}
.gate-progress-card{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:16px 20px;max-width:600px;margin:0 auto 24px;text-align:left}
.gate-progress-header{display:flex;justify-content:space-between;font-size:13px;font-family:var(--font-mono);color:var(--dim);margin-bottom:8px}
.gate-progress-track{height:10px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden}
.gate-progress-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--ok));border-radius:999px;transition:width 0.4s ease}
.gate-checklist{max-width:600px;margin:0 auto 28px;text-align:left;display:flex;flex-direction:column;gap:10px}
.gate-check-item{display:flex;align-items:center;gap:12px;background:var(--bg3);border:1px solid var(--line);padding:11px 16px;border-radius:8px;font-size:13.5px;color:#e2e8f0;transition:all 0.15s}
.gate-check-item.done{border-color:rgba(52,211,153,0.35);background:rgba(52,211,153,0.08);color:#6ee7b7}
.gate-actions{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}

/* 🎯 Daily Goals & First Sale Math Banner */
.daily-goals-banner{background:linear-gradient(135deg,rgba(18,24,38,0.98),rgba(28,36,58,0.98));border:1.5px solid rgba(56,189,248,0.35);border-radius:14px;padding:16px 22px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.goal-metric{display:flex;align-items:center;gap:12px}
.goal-metric-icon{font-size:28px}
.goal-metric-info div:first-child{font-size:11.5px;font-family:var(--font-mono);color:var(--dim);text-transform:uppercase}
.goal-metric-info div:last-child{font-size:17.5px;font-weight:700;color:#ffffff}
.goal-metric-info div:last-child span{color:var(--accent2)}

/* 🎓 VANTORX LMS COURSE PLAYER */
.lms-container{display:grid;grid-template-columns:310px 1fr;gap:20px;align-items:start}
@media(max-width:960px){.lms-container{grid-template-columns:1fr}}
.lms-sidebar{background:var(--bg2);border:1px solid var(--line);border-radius:14px;padding:16px;position:sticky;top:80px;max-height:calc(100vh - 100px);overflow-y:auto}
.lms-day-block{margin-bottom:16px;border-bottom:1px solid var(--line);padding-bottom:12px}
.lms-day-block:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.lms-day-hdr{font-size:11.5px;font-family:var(--font-mono);font-weight:700;color:var(--accent2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between}
.lms-nav-list{display:flex;flex-direction:column;gap:6px}
.lms-nav-item{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:8px;background:var(--bg);border:1px solid var(--line);color:var(--dim);font-size:12.5px;cursor:pointer;transition:all 0.15s;text-align:left;line-height:1.35}
.lms-nav-item:hover:not(.locked){border-color:var(--accent);color:#ffffff}
.lms-nav-item.active{background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(217,119,6,0.25));border-color:var(--accent);color:#ffffff;font-weight:600}
.lms-nav-item.completed{border-color:rgba(52,211,153,0.3);color:#6ee7b7}
.lms-nav-item.locked{opacity:0.45;cursor:not-allowed}
.lms-nav-icon{font-size:12px;margin-left:6px;flex-shrink:0}

/* LMS Stage */
.lms-stage{background:var(--bg2);border:1px solid var(--line);border-radius:14px;padding:26px;min-height:550px;display:flex;flex-direction:column}
.lms-lesson-view{display:none}
.lms-lesson-view.active{display:block}
.lms-view-head{border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.lms-breadcrumbs{font-size:12px;font-family:var(--font-mono);color:var(--dim)}
.lms-breadcrumbs span{color:var(--accent2);font-weight:600}
.lms-time-pill{font-size:11.5px;font-family:var(--font-mono);background:var(--bg);border:1px solid var(--line);padding:3px 10px;border-radius:999px;color:var(--accent2)}
.lms-view-title{font-size:22px;font-family:var(--font-head);font-weight:700;color:#ffffff;margin-top:6px}
.lms-text-block{font-size:14px;line-height:1.7;color:var(--ink);margin-bottom:18px}
.lms-text-block p{margin-bottom:12px}
.lms-script-box{background:var(--bg);border-left:3px solid var(--accent);padding:14px 18px;border-radius:0 10px 10px 0;margin:16px 0;font-size:14px;color:#f8fafc;line-height:1.6}
.lms-audio-bar{display:flex;align-items:center;justify-content:space-between;background:var(--bg);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:12px 18px;margin:16px 0;flex-wrap:wrap;gap:10px}
.lms-transcript-compare{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:18px 0}
@media(max-width:768px){.lms-transcript-compare{grid-template-columns:1fr}}
.lms-bad-call{background:rgba(248,113,113,0.06);border:1px solid rgba(248,113,113,0.3);border-radius:10px;padding:14px}
.lms-good-call{background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.3);border-radius:10px;padding:14px}
.lms-call-hdr{font-size:12px;font-weight:700;margin-bottom:8px;font-family:var(--font-mono);text-transform:uppercase}
.lms-bad-call .lms-call-hdr{color:#f87171}
.lms-good-call .lms-call-hdr{color:#34d399}
.lms-call-body{font-size:12.5px;color:#e2e8f0;line-height:1.55}

/* Flashcards */
.flashcard-drill-wrap{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:18px;margin:18px 0}
.flashcard-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:14px}
.fc-card{background:var(--bg2);border:1px solid var(--line);border-radius:10px;padding:14px;cursor:pointer;transition:all 0.15s;display:flex;flex-direction:column;justify-content:space-between}
.fc-card:hover{border-color:var(--accent)}
.fc-card.reviewed{border-color:rgba(52,211,153,0.4);background:rgba(16,36,32,0.4)}
.fc-cue{font-weight:700;color:#f87171;font-size:13px;margin-bottom:8px}
.fc-reveal-btn{background:var(--bg3);border:1px solid var(--line);color:var(--accent2);padding:4px 10px;border-radius:6px;font-size:11px;cursor:pointer;align-self:flex-start}
.fc-ans{display:none;font-size:12.5px;color:#e2e8f0;line-height:1.45;margin-top:8px;padding-top:8px;border-top:1px dashed var(--line)}
.fc-card.reviewed .fc-ans{display:block}

/* Lesson Bottom Action */
.lms-stage-footer{border-top:1px solid var(--line);padding-top:20px;margin-top:auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.lms-lock-screen{text-align:center;padding:50px 20px}
.lms-lock-icon{font-size:48px;margin-bottom:12px}
.lms-lock-title{font-size:20px;color:#ffffff;font-family:var(--font-head);font-weight:700;margin-bottom:8px}
.lms-lock-desc{font-size:14px;color:var(--dim);max-width:480px;margin:0 auto 20px}
.quiz-options{display:flex;flex-direction:column;gap:8px}
.quiz-opt-btn{background:var(--bg);border:1px solid var(--line);padding:10px 14px;border-radius:8px;text-align:left;color:var(--ink);font-size:13px;cursor:pointer;transition:all 0.15s;line-height:1.4}
.quiz-opt-btn:hover{border-color:var(--accent);background:var(--bg3)}
.quiz-opt-btn.correct{border-color:var(--ok);background:rgba(52,211,153,0.15);color:#6ee7b7;font-weight:600}
.quiz-opt-btn.wrong{border-color:var(--err);background:rgba(248,113,113,0.15);color:#fca5a5}
.exam-container{background:linear-gradient(180deg,var(--bg2),var(--bg3));border:1px solid var(--line);border-radius:14px;padding:24px;margin-top:20px}
.exam-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;border-bottom:1px solid var(--line);padding-bottom:12px;flex-wrap:wrap;gap:10px}
.exam-score-badge{font-size:13px;font-weight:700;padding:4px 12px;border-radius:8px;font-family:var(--font-mono)}

/* ⚔️ Prominent Caller Switcher / Login Banner */
.caller-bar{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(90deg,rgba(18,24,38,0.98),rgba(24,32,52,0.98));border:1px solid rgba(245,158,11,0.35);border-radius:12px;padding:10px 18px;margin-bottom:16px;flex-wrap:wrap;gap:12px;box-shadow:0 4px 16px rgba(0,0,0,0.3)}
.caller-bar-status{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.caller-badge-dot{width:9px;height:9px;background:var(--ok);border-radius:50%;box-shadow:0 0 8px var(--ok);display:inline-block;animation:pulse 2s infinite}
.caller-name-highlight{font-weight:700;color:#ffffff;font-size:14.5px}
.caller-level-pill{font-size:11.5px;font-family:var(--font-mono);background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);color:var(--accent2);padding:2px 8px;border-radius:999px}
.caller-bar-buttons{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.caller-switch-pill{background:var(--bg2);border:1px solid var(--line);color:var(--ink);font-size:12.5px;padding:6px 12px;border-radius:8px;cursor:pointer;transition:all 0.15s ease;font-weight:500}
.caller-switch-pill:hover{border-color:var(--accent);background:var(--bg3);color:#ffffff}
.caller-switch-pill.active{background:linear-gradient(135deg,rgba(245,158,11,0.25),rgba(217,119,6,0.3));border-color:var(--accent);color:#ffffff;font-weight:700;box-shadow:0 0 10px rgba(245,158,11,0.2)}
.caller-switch-pill.add-rep{background:rgba(56,189,248,0.12);border-color:rgba(56,189,248,0.35);color:#38bdf8}
.caller-switch-pill.add-rep:hover{background:rgba(56,189,248,0.25);border-color:#38bdf8;color:#ffffff}
</style>
</head>
<body>

<header>
  <div class="wrap head-grid">
    <div class="brand">
      <span>⚡</span> Vantor<b>X</b> Cold Calling Cockpit
    </div>
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <div class="user-profile-badge" id="userProfileBtn" onclick="openAccountModal()" title="Click to view stats or switch caller account">
        <span class="user-avatar" id="headerUserAvatar">👑</span>
        <div class="user-meta">
          <div class="user-name" id="headerUserName">Luke (Founder)</div>
          <div class="user-rank" id="headerUserRank">Lvl 5 · Mythic Closer</div>
        </div>
      </div>
      <div class="live-demo-pill" id="copyDemoPill" onclick="copyDemoNumber()" title="Click to copy demo number">
        <span>📞 Demo: (561) 813-8602</span> <span style="font-size:11px">📋</span>
      </div>
      <button class="btn btn-ghost btn-sm" id="voiceToggleBtn" onclick="toggleVoice()">🗣️ Voice: ON</button>
      <button class="btn btn-ghost btn-sm" id="soundToggleBtn" onclick="toggleSound()">🔊 Audio: ON</button>
    </div>
  </div>
</header>

<main class="wrap">
  <!-- ⚔️ PROMINENT CALLER LOGIN & REP SWITCHER BAR -->
  <div class="caller-bar" id="callerQuickBar">
    <div class="caller-bar-status">
      <span class="caller-badge-dot"></span>
      <span style="font-size:12px;color:var(--dim);text-transform:uppercase;letter-spacing:0.05em">Active Closer:</span>
      <span class="caller-name-highlight" id="callerBarCurrent">👑 Luke (Founder)</span>
      <span class="caller-level-pill" id="callerBarLevel">Lvl 5 · Unlocked 🔓</span>
    </div>
    <div class="caller-bar-buttons">
      <span style="font-size:12px;color:var(--dim)">Quick Switch:</span>
      <button type="button" class="caller-switch-pill active" id="quickPillLuke" onclick="quickSwitchCaller('luke')">👑 Luke (Founder)</button>
      <button type="button" class="caller-switch-pill" id="quickPillBuddy" onclick="quickSwitchCaller('buddy')">⚔️ Buddy (Rep 2)</button>
      <button type="button" class="caller-switch-pill add-rep" onclick="openAccountModal()">➕ Sign In / Add Rep</button>
    </div>
  </div>

  <div class="tabs">
    <button class="tab-btn active" type="button" id="tabBtnLeads" data-tab="tabLeads" onclick="switchTab('tabLeads')">📋 100-Lead Dial Queue (+25/Day)</button>
    <button class="tab-btn" type="button" id="tabBtnAcademy" data-tab="tabAcademy" onclick="switchTab('tabAcademy')">🎓 Closer Academy (Certification)</button>
    <button class="tab-btn" type="button" id="tabBtnScript" data-tab="tabScript" onclick="switchTab('tabScript')">📜 Multi-Product Teleprompter</button>
    <button class="tab-btn" type="button" id="tabBtnRPG" data-tab="tabRPG" onclick="switchTab('tabRPG')">🎮 Cold Call Quest (Sales RPG 2.0)</button>
    <button class="tab-btn" type="button" id="tabBtnObjections" data-tab="tabObjections" onclick="switchTab('tabObjections')">🛡️ 45+ Master Objection Library</button>
    <button class="tab-btn" type="button" id="tabBtnSimulationData" data-tab="tabSimulationData" onclick="switchTab('tabSimulationData')">📊 50-Call Simulation Logs</button>
  </div>

  <!-- TAB 0: 📋 LEAD DISPATCHER & LEAK CALCULATOR -->
  <div id="tabLeads" class="tab-panel active">
    <!-- 🔒 Level 5 Gating Card (Shown when locked) -->
    <div id="leadsLockedGate" class="leads-locked-card" style="display:none">
      <div class="lock-shield-icon">🔒</div>
      <h2>Nationwide Leads Dispatcher is Locked</h2>
      <p class="lock-subtitle">You must reach <strong>Level 5: Certified Closer (1,500 XP)</strong> and complete the 3-Day Closer Academy (~45–60 min/day) before unlocking live contractor phone numbers.</p>
      
      <div class="gate-progress-card">
        <div class="gate-progress-header">
          <span>Readiness Progress: <strong>Level <span id="gateCurLevel">1</span> of 5 (<span id="gateCurXp">0</span> / 1,500 XP)</strong></span>
          <span><strong id="gateCurPct">0%</strong></span>
        </div>
        <div class="gate-progress-track">
          <div class="gate-progress-fill" id="gateProgressFill" style="width:0%"></div>
        </div>
      </div>

      <div class="gate-checklist">
        <div class="gate-check-item" id="gateCheckDay1"><span class="gate-icon">⏳</span> <span><strong>Day 1:</strong> Trade Psychology, Tonality &amp; 45+ Objection Armor (+500 XP)</span></div>
        <div class="gate-check-item" id="gateCheckDay2"><span class="gate-icon">⏳</span> <span><strong>Day 2:</strong> The $8,000 Leak, Live Demo (561) 813-8602 &amp; Boss Sparring (+500 XP)</span></div>
        <div class="gate-check-item" id="gateCheckDay3"><span class="gate-icon">⏳</span> <span><strong>Day 3:</strong> High-Ticket Closing, 4-Boss Crucible &amp; Final Board Exam (+500 XP)</span></div>
      </div>

      <div class="gate-actions">
        <button class="btn btn-gold" type="button" onclick="switchTab('tabAcademy')">🎓 Enter 3-Day Closer Academy ➔</button>
        <button class="btn btn-ghost" type="button" onclick="switchTab('tabRPG')">⚔️ Spar with Boss in RPG ➔</button>
        <button class="btn btn-ghost btn-sm" type="button" id="btnFounderOverride" onclick="activateFounderBypass()" style="border:1px dashed var(--accent);color:var(--accent2);font-size:12px" title="Bypass for Luke/Admin">👑 Founder Instant Bypass</button>
      </div>
    </div>

    <!-- Leads Cockpit Container (Shown when unlocked) -->
    <div id="leadsTableContainer" class="lead-cockpit">
      <!-- 🎯 Daily Goals & First Sale Math Banner -->
      <div class="daily-goals-banner">
        <div class="goal-metric">
          <div class="goal-metric-icon">🎯</div>
          <div class="goal-metric-info">
            <div>Daily Outbound Dials</div>
            <div><span id="goalDialsDone">0</span> / 75 <small style="font-size:12px;color:var(--dim);font-weight:400">Dials</small></div>
          </div>
        </div>
        <div class="goal-metric">
          <div class="goal-metric-icon">⚔️</div>
          <div class="goal-metric-info">
            <div>Daily Sim Warm-Up</div>
            <div><span id="goalSimsDone">0</span> / 3 <small style="font-size:12px;color:var(--dim);font-weight:400">Bosses</small></div>
          </div>
        </div>
        <div class="goal-metric">
          <div class="goal-metric-icon">💰</div>
          <div class="goal-metric-info">
            <div>First Sale Math Formula</div>
            <div style="font-size:13px;font-weight:600;color:#e2e8f0">75 Dials ➔ 12-15 Pickups ➔ 2-3 Live Demos ➔ <span style="color:var(--ok)">1 Closed Deal ($1,694)</span></div>
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px">
        <div>
          <h2 style="font-size:22px;margin-bottom:4px;font-family:var(--font-head)">📋 Nationwide Trade Leads Dispatcher &amp; Leak Calculator (250+ Targets)</h2>
          <p style="color:var(--dim);font-size:14px">Starts with 100 primed high-ticket targets across FL, TX, CA, GA, NC, AZ, OH &amp; more. Unlocks +25 fresh leads every 24 hours, or add +25 on demand. Click any lead to copy phone, view revenue leak calculations, check off calls, and launch custom teleprompters.</p>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <button class="btn btn-gold btn-sm" id="exportLeadsCsvBtn">📥 Export Leads &amp; Call Logs CSV</button>
          <button class="btn btn-ghost btn-sm" id="resetCallsBtn" style="border:1px solid rgba(248,113,113,0.3);color:#fca5a5" title="Clear checked calls on this browser">🔄 Reset My Calls</button>
        </div>
      </div>

      <!-- 📅 Daily 100+ Lead Batch & Quota HUD -->
      <div class="daily-batch-banner">
        <div class="batch-hud-grid">
          <div class="batch-title-area">
            <h3><span>🎯</span> <span id="batchHeadingText">ACTIVE COLD CALL QUEUE: 100 TARGETS (+25 ADDED DAILY)</span></h3>
            <div class="batch-subtitle">
              <span id="todayDateDisplay">Wednesday, October 21, 2026</span> · Starts with 100 nationwide leads · +25 fresh leads added every 24h · Hit [⚡ Add +25 Leads Now] anytime!
            </div>
          </div>
          <div class="batch-controls">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-size:12px;color:var(--dim);font-family:var(--font-mono)">QUEUE:</span>
              <select id="batchSelect" class="custom-select">
                <option value="activeQueue" selected>⭐ Active Dial Queue (100 Leads · Starts 100 + Daily Growth)</option>
                <option value="todayFresh">⚡ Today's +25 Fresh Additions Only</option>
                <option value="all">🌐 All 250 Nationwide Leads</option>
                <option value="1">Batch 1: Florida Metro HVAC &amp; Roofing (25)</option>
                <option value="2">Batch 2: Florida Coastal &amp; Central (25)</option>
                <option value="3">Batch 3: Florida Commercial &amp; Specialty (25)</option>
                <option value="4">Batch 4: Florida &amp; Texas DFW (25)</option>
                <option value="5">Batch 5: Texas Metroplex &amp; Houston (25)</option>
                <option value="6">Batch 6: California LA &amp; Bay Area (25)</option>
                <option value="7">Batch 7: Georgia Atlanta &amp; Savannah (25)</option>
                <option value="8">Batch 8: North Carolina Carolinas (25)</option>
                <option value="9">Batch 9: Arizona Phoenix &amp; Tucson (25)</option>
                <option value="10">Batch 10: Ohio, Colorado &amp; Nevada (25)</option>
              </select>
            </div>
            <button class="btn btn-gold btn-sm" id="btnAdd25Leads" style="font-weight:700" title="Expand your active queue with +25 fresh leads immediately">⚡ Add +25 Leads Now</button>
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-size:12px;color:var(--dim);font-family:var(--font-mono)">REP:</span>
              <select id="callerSelect" class="custom-select" style="max-width:140px">
                <option value="Luke">Luke (Founder)</option>
                <option value="Buddy (Rep 2)">Buddy (Rep 2)</option>
                <option value="Sales Rep 3">Sales Rep 3</option>
                <option value="Guest Caller">Guest Caller</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Quota Progress Bar -->
        <div class="quota-progress-card">
          <div class="quota-meter-wrap">
            <div class="quota-meter-header">
              <span>🎯 DIAL QUOTA: <strong><span id="quotaCount">0</span> / <span id="quotaTotal">100</span> COMPLETED</strong></span>
              <span>PACING: <strong><span id="quotaPct">0%</span></strong></span>
            </div>
            <div class="quota-bar-track">
              <div class="quota-bar-fill" id="quotaBarFill" style="width:0%"></div>
            </div>
          </div>
          <div class="quota-stats-chips">
            <div class="quota-chip" id="chipUncalled" style="color:var(--dim)">⏳ 100 To Call</div>
            <div class="quota-chip" id="chipCalled" style="color:#6ee7b7">✓ 0 Called</div>
            <div class="quota-chip" id="chipDemos" style="color:var(--accent2)">🎉 0 Demos</div>
          </div>
        </div>
      </div>

      <!-- High-Level Leak KPIs -->
      <div class="kpi-bar">
        <div class="kpi-card">
          <div class="kpi-label">🎯 Active Targets In View</div>
          <div class="kpi-val" id="kpiTargetCount">25 Contractors</div>
          <div class="kpi-sub">Targeted high-ticket market</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">💸 Total Annual Leaks Detected</div>
          <div class="kpi-val" style="color:#f87171" id="kpiTotalLeak">$3,250,000 / yr</div>
          <div class="kpi-sub">Missed emergency calls &amp; slow response</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">📊 Average Leak per Business</div>
          <div class="kpi-val" style="color:var(--accent2)" id="kpiAvgLeak">$10,830 / mo</div>
          <div class="kpi-sub">$130,000 / yr in lost high-ticket jobs</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">🛡️ Average Net Savings</div>
          <div class="kpi-val" style="color:var(--ok)" id="kpiAvgSavings">+$126,412 / yr</div>
          <div class="kpi-sub">Net profit saved after VantorX setup</div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="lead-filter-bar">
        <div class="lead-search-box">
          <span class="lead-search-icon">🔍</span>
          <input type="text" class="lead-search-input" id="leadSearchInput" placeholder="Search contractor name, owner, city, state, trade, or leak..." autocomplete="off">
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <select id="stateFilterSelect" class="custom-select">
            <option value="all">All States</option>
            <option value="FL">FL (Florida - 80)</option>
            <option value="TX">TX (Texas - 45)</option>
            <option value="CA">CA (California - 30)</option>
            <option value="GA">GA (Georgia - 24)</option>
            <option value="NC">NC (North Carolina - 21)</option>
            <option value="AZ">AZ (Arizona - 18)</option>
            <option value="OH">OH (Ohio - 12)</option>
            <option value="CO">CO (Colorado - 10)</option>
            <option value="NV">NV (Nevada - 10)</option>
          </select>
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px">
        <!-- Call Status Filter Pills -->
        <div class="lead-pills">
          <button class="lead-pill-btn active" data-status-filter="all">All Status (<span id="countStatusAll">25</span>)</button>
          <button class="lead-pill-btn" data-status-filter="uncalled">⏳ Remaining To Call (<span id="countStatusUncalled">25</span>)</button>
          <button class="lead-pill-btn" data-status-filter="called">✅ Already Called (<span id="countStatusCalled">0</span>)</button>
        </div>

        <!-- Product Offer Pills -->
        <div class="lead-pills" id="leadProductFilters">
          <button class="lead-pill-btn active" data-lead-filter="all">All Offers (250)</button>
          <button class="lead-pill-btn" data-lead-filter="ava">🤖 Ava Voice (84)</button>
          <button class="lead-pill-btn" data-lead-filter="website">🌐 Custom Websites (34)</button>
          <button class="lead-pill-btn" data-lead-filter="speed">⚡ Speed-to-Lead (66)</button>
          <button class="lead-pill-btn" data-lead-filter="aeo">⭐ AEO &amp; Reviews (45)</button>
          <button class="lead-pill-btn" data-lead-filter="bundle">🚀 Full Bundle (21)</button>
        </div>
      </div>

      <!-- Pagination & View Controls Bar -->
      <div class="lead-pagination-bar" id="leadPaginationBar">
        <div class="lead-page-info">
          <span id="leadPageRangeText">Showing <strong>1–50</strong> of <strong>100</strong> active queue leads</span>
          <button class="btn-reset-filters" id="btnResetFilters" style="display:none" onclick="resetAllLeadFilters()" title="Reset all search queries and filters">🔄 Reset Filters</button>
        </div>
        <div class="lead-page-nav">
          <button class="btn-page-nav" id="btnPrevPage" onclick="changeLeadPage(-1)" disabled>◀ Prev</button>
          <span style="font-size:12px;font-family:var(--font-mono);color:var(--accent2);padding:0 6px" id="pageNumberIndicator">Page 1 / 2</span>
          <button class="btn-page-nav" id="btnNextPage" onclick="changeLeadPage(1)">Next ▶</button>
        </div>
        <div class="lead-size-selector">
          <span>Rows:</span>
          <button class="btn-size-pill" data-size="25" onclick="setLeadPageSize(25)">25</button>
          <button class="btn-size-pill active" data-size="50" onclick="setLeadPageSize(50)">50</button>
          <button class="btn-size-pill" data-size="100" onclick="setLeadPageSize(100)">100</button>
          <button class="btn-size-pill" data-size="all" onclick="setLeadPageSize('all')">All (250)</button>
        </div>
      </div>

      <!-- Excel Table Container -->
      <div class="excel-table-wrap">
        <table class="excel-table" id="leadExcelTable">
          <thead>
            <tr>
              <th style="min-width:130px">Call Status</th>
              <th>Contractor / Company</th>
              <th>Decision Maker</th>
              <th>City, State &amp; Trade</th>
              <th>Phone (Click to Dial)</th>
              <th>Primary Leak Detected</th>
              <th>Annual Leak ($) <span class="math-info-pill" onclick="openLeakMathModal()" title="View real-world trade ticket math">ℹ️ Math</span></th>
              <th>Net Saved ($) <span class="math-info-pill" onclick="openLeakMathModal()" title="View net profit formula">ℹ️ Math</span></th>
              <th>Recommended Offer</th>
              <th>Outcome &amp; Notes</th>
              <th style="text-align:right">Action</th>
            </tr>
          </thead>
          <tbody id="leadTableBody">
            <!-- Populated via JavaScript from 250 normalized targets -->
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- TAB: 🎓 CLOSER ACADEMY (FULL 3-DAY LMS COURSE PLAYER) -->
  <div id="tabAcademy" class="tab-panel">
    <div class="lead-cockpit" style="margin-bottom:18px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:12px">
        <div>
          <div style="font-size:12px;font-family:var(--font-mono);color:var(--accent2);text-transform:uppercase;letter-spacing:0.06em">Official VantorX Training &amp; Readiness LMS</div>
          <h2 style="font-size:24px;margin-top:2px;font-family:var(--font-head);color:#ffffff">🎓 Closer Academy: Road to Level 5 (License to Dial)</h2>
          <p style="color:var(--dim);font-size:13.5px;max-width:780px">High-Ticket Trade Closer Certification LMS. <strong>Linear progressive mastery:</strong> you must complete each lesson in sequence, practice the interactive flashcards, defeat contractor bosses in live combat, and pass all 3 certification exams to unlock live nationwide leads.</p>
        </div>
        <div style="background:var(--bg3);border:1px solid rgba(245,158,11,0.3);padding:10px 16px;border-radius:12px;text-align:right">
          <div style="font-size:11px;font-family:var(--font-mono);color:var(--dim);text-transform:uppercase">Course Certification Progress</div>
          <div style="font-size:18px;font-weight:700;color:var(--accent2)"><span id="academyDaysCount">0</span> / 3 Days Passed</div>
          <div style="font-size:11.5px;color:#6ee7b7;margin-top:2px" id="academyStatusText">🔒 Leads Locked (Reach Level 5)</div>
        </div>
      </div>

      <!-- Academy Readiness Progress Bar -->
      <div class="quota-meter-wrap" style="margin-top:8px">
        <div class="quota-meter-header">
          <span>ACADEMY XP: <strong><span id="academyXpText">0</span> / 1,500 XP (Level <span id="academyLevelText">1</span> of 5)</strong></span>
          <span>COMPLETION: <strong><span id="academyPctText">0%</span></strong></span>
        </div>
        <div class="quota-bar-track" style="height:10px">
          <div class="quota-bar-fill" id="academyBarFill" style="width:0%"></div>
        </div>
      </div>
    </div>

    <!-- 🎓 TWO-COLUMN LMS INTERFACE -->
    <div class="lms-container">
      <!-- LEFT COLUMN: SYLLABUS NAVIGATOR -->
      <div class="lms-sidebar">
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--dim);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.06em">COURSE SYLLABUS · LINEAR TRACK</div>

        <!-- DAY 1 BLOCK -->
        <div class="lms-day-block">
          <div class="lms-day-hdr">
            <span>📅 DAY 1: PSYCHOLOGY &amp; OBJECTIONS</span>
            <span id="navDay1Status" style="font-size:10.5px;color:var(--dim)">0/5 Done</span>
          </div>
          <div class="lms-nav-list">
            <button type="button" class="lms-nav-item active" id="navItem-1-1" onclick="selectLmsUnit('1-1')">
              <span>🧠 1.1: Contractor Psyche</span>
              <span class="lms-nav-icon" id="navIcon-1-1">▶</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-1-2" onclick="selectLmsUnit('1-2')">
              <span>🛡️ 1.2: Gatekeeper &amp; Owner Extraction</span>
              <span class="lms-nav-icon" id="navIcon-1-2">🔒</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-1-3" onclick="selectLmsUnit('1-3')">
              <span>🎯 1.3: Pre-Pitch Check &amp; 4-Sec Disarm</span>
              <span class="lms-nav-icon" id="navIcon-1-3">🔒</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-1-4" onclick="selectLmsUnit('1-4')">
              <span>⚡ 1.4: 10 Hardcore Objections</span>
              <span class="lms-nav-icon" id="navIcon-1-4">🔒</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-1-5" onclick="selectLmsUnit('1-5')">
              <span>📝 1.5: Day 1 Exam (8 Qs)</span>
              <span class="lms-nav-icon" id="navIcon-1-5">🔒</span>
            </button>
          </div>
        </div>

        <!-- DAY 2 BLOCK -->
        <div class="lms-day-block">
          <div class="lms-day-hdr">
            <span>📅 DAY 2: LEAK MATH &amp; DEMO DROP</span>
            <span id="navDay2Status" style="font-size:10.5px;color:var(--dim)">0/5 Done</span>
          </div>
          <div class="lms-nav-list">
            <button type="button" class="lms-nav-item locked" id="navItem-2-1" onclick="selectLmsUnit('2-1')">
              <span>💸 2.1: $8k Leak Economics</span>
              <span class="lms-nav-icon" id="navIcon-2-1">🔒</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-2-2" onclick="selectLmsUnit('2-2')">
              <span>🤖 2.2: Total Agreement Shield</span>
              <span class="lms-nav-icon" id="navIcon-2-2">🔒</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-2-3" onclick="selectLmsUnit('2-3')">
              <span>📞 2.3: Live Demo Drop</span>
              <span class="lms-nav-icon" id="navIcon-2-3">🔒</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-2-4" onclick="selectLmsUnit('2-4')">
              <span>⚔️ 2.4: RPG Sparring (2 Bosses)</span>
              <span class="lms-nav-icon" id="navIcon-2-4">🔒</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-2-5" onclick="selectLmsUnit('2-5')">
              <span>📝 2.5: Day 2 Exam (8 Qs)</span>
              <span class="lms-nav-icon" id="navIcon-2-5">🔒</span>
            </button>
          </div>
        </div>

        <!-- DAY 3 BLOCK -->
        <div class="lms-day-block">
          <div class="lms-day-hdr">
            <span>📅 DAY 3: CLOSING &amp; BOARD EXAM</span>
            <span id="navDay3Status" style="font-size:10.5px;color:var(--dim)">0/5 Done</span>
          </div>
          <div class="lms-nav-list">
            <button type="button" class="lms-nav-item locked" id="navItem-3-1" onclick="selectLmsUnit('3-1')">
              <span>🤝 3.1: High-Ticket Packaging</span>
              <span class="lms-nav-icon" id="navIcon-3-1">🔒</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-3-2" onclick="selectLmsUnit('3-2')">
              <span>🚀 3.2: 48-Hour Zero-Downtime</span>
              <span class="lms-nav-icon" id="navIcon-3-2">🔒</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-3-3" onclick="selectLmsUnit('3-3')">
              <span>🎼 3.3: 4-Min Call Symphony</span>
              <span class="lms-nav-icon" id="navIcon-3-3">🔒</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-3-4" onclick="selectLmsUnit('3-4')">
              <span>⚔️ 3.4: 4-Boss Crucible</span>
              <span class="lms-nav-icon" id="navIcon-3-4">🔒</span>
            </button>
            <button type="button" class="lms-nav-item locked" id="navItem-3-5" onclick="selectLmsUnit('3-5')">
              <span>🏆 3.5: Final Board Exam (15 Qs)</span>
              <span class="lms-nav-icon" id="navIcon-3-5">🔒</span>
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: MAIN STAGE CONTENT PLAYER -->
      <div class="lms-stage">
        <!-- UNIT 1.1 -->
        <div class="lms-lesson-view active" id="view-1-1">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 1 ➔ <span>Lesson 1.1: Contractor Mindset</span></div>
              <div class="lms-view-title">🧠 The 6 AM Job Site Reality &amp; Contractor Psyche</div>
            </div>
            <span class="lms-time-pill">⏱️ 15 Mins</span>
          </div>

          <div class="lms-text-block">
            <p>Trade business owners (roofers, HVAC techs, plumbers, electricians) live in an entirely different psychological reality than corporate executives. When you dial their phone at 9:30 AM or 1:45 PM, they are not sitting at a desk with a coffee. They are on job sites in 95-degree heat, managing temperamental crews, waiting for supply house orders, or guiding heavy equipment.</p>

            <div class="lms-audio-bar">
              <div>
                <strong style="color:var(--accent2);font-size:13.5px">🗣️ Audio Simulation: The Job Site Reality</strong>
                <div style="font-size:12px;color:var(--dim)">Hear what a Florida contractor actually sounds like when answering a cold call</div>
              </div>
              <button class="btn btn-gold btn-sm" type="button" onclick="playContractorAudioSimulation('roofer_busy')">🔊 Play Audio</button>
            </div>

            <div class="lms-transcript-compare">
              <div class="lms-bad-call">
                <div class="lms-call-hdr">❌ The Dead Telemarketer Opener (Hung up in 2.8s)</div>
                <div class="lms-call-body">
                  <strong>Roofer:</strong> "Yeah, who's this?"<br>
                  <strong>Rookie Rep:</strong> <em>"Hi sir! Good morning! Hope you're having an amazing day! My name is Jordan and I'm calling from VantorX Solutions to see if you have 5 minutes to discuss..."</em><br>
                  <strong>Roofer:</strong> *CLICK* (Immediate disconnect)
                </div>
              </div>
              <div class="lms-good-call">
                <div class="lms-call-hdr">✓ The Elite VantorX Closer (Earns Authority)</div>
                <div class="lms-call-body">
                  <strong>Roofer:</strong> "Yeah, who's this?"<br>
                  <strong>Elite Closer:</strong> <em>"Luke with VantorX. I know you weren't expecting my call — got 20 seconds or should I hang up?"</em><br>
                  <strong>Roofer:</strong> "Alright, you got 20 seconds. What is it?"
                </div>
              </div>
            </div>

            <p><strong>The Core Psychological Rule:</strong> You must speak in a calm, grounded, slow cadence. Your voice must drop in pitch at the end of sentences (downward inflection), signaling status and authority. Never apologize for calling. You are a trade operations specialist diagnosing lost revenue.</p>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 1 of 15 Complete</span>
            <button class="btn btn-gold" type="button" onclick="completeLmsUnit('1-1', '1-2')">✓ Mark Complete &amp; Continue to 1.2 ➔</button>
          </div>
        </div>

        <!-- UNIT 1.2 -->
        <div class="lms-lesson-view" id="view-1-2">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 1 ➔ <span>Lesson 1.2: Gatekeeper Disarmament &amp; Owner Extraction</span></div>
              <div class="lms-view-title">🛡️ Infiltrating the Front Office &amp; Extracting Owner Cell</div>
            </div>
            <span class="lms-time-pill">⏱️ 15 Mins</span>
          </div>

          <div class="lms-text-block">
            <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);padding:14px 18px;border-radius:10px;margin-bottom:18px">
              <strong style="color:#f87171;font-size:14px">🚨 The Iron Law of Trade Cold Calling: NEVER PITCH A GATEKEEPER</strong>
              <p style="font-size:12.5px;color:#e2e8f0;margin-top:6px;line-height:1.5">Receptionists, office dispatchers, customer service reps, and apprentices have <strong>zero budget authority</strong>. Their sole job is filtering out salespeople. If you start pitching Ava AI or software features to an office dispatcher, you have burned the lead. You must treat gatekeepers with casual peer respect, get to the owner, or extract the owner's direct cell phone immediately.</p>
            </div>

            <h4 style="color:#ffffff;font-size:15px;margin:16px 0 8px">1. The Subcontractor Peer Tonality</h4>
            <p>Rookie telemarketers sound eager, apologetic, and formal (<em>"Good morning ma'am! May I please speak with the person in charge of your marketing and phone systems?"</em>). This screams "solicitor" within 1.5 seconds. Elite closers speak with <strong>subcontractor peer tone</strong> — low vocal pitch, casual phrasing, first names only, as if they work with the owner every week.</p>

            <div class="lms-transcript-compare">
              <div class="lms-bad-call">
                <div class="lms-call-hdr">❌ The Telemarketer Trap (Immediate Wall)</div>
                <div class="lms-call-body">
                  <strong>Dispatcher:</strong> "Gulf Coast Plumbing, how can I direct your call?"<br>
                  <strong>Rookie Rep:</strong> "Hi there! I'm calling from VantorX Solutions to see if we can schedule a quick 15-minute software demonstration for the owner regarding after-hours calls..."<br>
                  <strong>Dispatcher:</strong> "We're not interested. Please remove us from your list." <em>*CLICK*</em>
                </div>
              </div>
              <div class="lms-good-call">
                <div class="lms-call-hdr">✓ Elite Closer Owner Extraction (Cell Captured)</div>
                <div class="lms-call-body">
                  <strong>Dispatcher:</strong> "Gulf Coast Plumbing, this is Karen."<br>
                  <strong>Elite Closer:</strong> "Hey Karen, is Mike around or is he out on a job site right now?"<br>
                  <strong>Dispatcher:</strong> "He's in the field all day. What is this regarding?"<br>
                  <strong>Elite Closer:</strong> "It's Luke — quick operational question about your weekend emergency call routing in Tampa. Does he check his cell or should I catch him at the shop around 4:30?"<br>
                  <strong>Dispatcher:</strong> "Try his cell, it's (813) 555-0192."
                </div>
              </div>
            </div>

            <div class="lms-audio-bar">
              <div>
                <strong style="color:var(--accent2);font-size:13.5px">🗣️ Audio Simulation: Gatekeeper Infiltration &amp; Cell Extraction</strong>
                <div style="font-size:12px;color:var(--dim)">Listen to the calm, authoritative subcontractor tonality that gets owner cell numbers</div>
              </div>
              <button class="btn btn-gold btn-sm" type="button" onclick="playContractorAudioSimulation('gatekeeper_extraction')">🔊 Play Audio</button>
            </div>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 2 of 15 Complete</span>
            <button class="btn btn-gold" type="button" onclick="completeLmsUnit('1-2', '1-3')">✓ Mark Complete &amp; Continue to 1.3 ➔</button>
          </div>
        </div>

        <!-- UNIT 1.3 -->
        <div class="lms-lesson-view" id="view-1-3">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 1 ➔ <span>Lesson 1.3: Pre-Pitch Check &amp; 4-Sec Disarm</span></div>
              <div class="lms-view-title">🎯 Owner Pre-Verification &amp; The 4-Second Disarm</div>
            </div>
            <span class="lms-time-pill">⏱️ 15 Mins</span>
          </div>

          <div class="lms-text-block">
            <h4 style="color:#ffffff;font-size:15px;margin-bottom:8px">1. The Mandatory Pre-Pitch Verification Gate</h4>
            <p>When you dial a direct mobile number from the queue, never assume the person who answers is the owner. In trade companies, cell phones are frequently answered by lead technicians, apprentices, or job foremen. <strong>Never run your pitch until you verify you are speaking with the license holder or business owner.</strong></p>

            <div class="lms-script-box">
              <strong>Exact Word-for-Word Owner Pre-Check:</strong><br>
              Prospect: <em>"Yeah, talk to me."</em><br>
              Closer: <strong>"Hey [Owner First Name]? [Your Name] from VantorX — you the owner or am I talking to the job foreman?"</strong><br><br>
              • <strong>If Owner answers:</strong> "Yeah, I own the place, what do you need?" ➔ <em>PROCEED TO DISARM.</em><br>
              • <strong>If Helper/Tech answers:</strong> "Dave's on a ladder right now, I'm his helper." ➔ <em>"Gotcha brother, won't interrupt you with tools in your hand. What's Dave's direct cell so I can catch him when he's down?"</em>
            </div>

            <h4 style="color:#ffffff;font-size:15px;margin:20px 0 8px">2. The 4-Second Disarm Formula</h4>
            <p>Once owner identity is locked, you have exactly 4 seconds before sales defense hardens. You must use downward inflection and deliver the disarm without hesitation:</p>

            <div class="lms-script-box" style="border-color:rgba(52,211,153,0.4);background:rgba(52,211,153,0.06)">
              <strong style="color:#34d399">The Master Disarm Formula:</strong><br>
              <strong>"[Your Name] with VantorX. I know you weren't expecting my call — got 20 seconds or should I hang up?"</strong>
            </div>

            <p style="margin-top:12px"><strong>The Psychology:</strong> By offering to hang up, you grant total autonomy. Telemarketers cling to the line desperately. When you offer to hang up, you subvert their expectation of a high-pressure sales pitch. 90% of contractors reply: <em>"Alright, 20 seconds. What do you got?"</em></p>

            <div class="lms-audio-bar">
              <div>
                <strong style="color:var(--accent2);font-size:13.5px">🗣️ Audio Simulation: Owner Pre-Check &amp; Disarm Delivery</strong>
                <div style="font-size:12px;color:var(--dim)">Hear the exact pacing, vocal weight, and pause before "or should I hang up?"</div>
              </div>
              <button class="btn btn-gold btn-sm" type="button" onclick="playContractorAudioSimulation('disarm_delivery')">🔊 Play Audio</button>
            </div>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 3 of 15 Complete</span>
            <button class="btn btn-gold" type="button" onclick="completeLmsUnit('1-3', '1-4')">✓ Mark Complete &amp; Continue to 1.4 ➔</button>
          </div>
        </div>

        <!-- UNIT 1.4 -->
        <div class="lms-lesson-view" id="view-1-4">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 1 ➔ <span>Lesson 1.4: 10 Objection Flashcards</span></div>
              <div class="lms-view-title">🛡️ 10 Knee-Jerk Objection Reflex Flashcards</div>
            </div>
            <span class="lms-time-pill">⏱️ 15 Mins</span>
          </div>

          <div class="lms-text-block">
            <p><strong>Interactive Mastery Drill:</strong> You cannot pass Day 1 without knowing these 10 objections cold. Click <strong>"Reveal Elite Rebuttal"</strong> on all 10 cards below. The completion button will unlock only after you have reviewed all 10 cards.</p>

            <div style="background:var(--bg);border:1px solid rgba(245,158,11,0.3);padding:10px 16px;border-radius:8px;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
              <span style="font-size:13px;color:var(--dim)">Drill Progress:</span>
              <strong style="color:var(--accent2);font-size:15px"><span id="lmsFcRevealedCount">0</span> / 10 Mastered</strong>
            </div>

            <div class="flashcard-grid">
              <div class="fc-card" id="fc-1">
                <div class="fc-cue">1. "Just email me some information."</div>
                <button class="fc-reveal-btn" type="button" onclick="revealLmsFlashcard(1)">Reveal Rebuttal ➔</button>
                <div class="fc-ans">"I can definitely send an email, but it'll get buried under 50 supply receipts. If I give you our live demo line right now, it takes 30 seconds on speaker — got a pen or your cell?"</div>
              </div>
              <div class="fc-card" id="fc-2">
                <div class="fc-cue">2. "Not interested / Take me off your list."</div>
                <button class="fc-reveal-btn" type="button" onclick="revealLmsFlashcard(2)">Reveal Rebuttal ➔</button>
                <div class="fc-ans">"I completely understand — you get 20 telemarketers a day. I'm not asking you to buy anything right now. I just have a 15-second question about your after-hours emergency calls..."</div>
              </div>
              <div class="fc-card" id="fc-3">
                <div class="fc-cue">3. "We're slammed / It's our busy season."</div>
                <button class="fc-reveal-btn" type="button" onclick="revealLmsFlashcard(3)">Reveal Rebuttal ➔</button>
                <div class="fc-ans">"That's exactly why I called. When your crews are running 100% full, that's when after-hours $8,000 emergency replacement calls slip to voicemail and call your competitor down the road."</div>
              </div>
              <div class="fc-card" id="fc-4">
                <div class="fc-cue">4. "I'm driving / On a job site right now."</div>
                <button class="fc-reveal-btn" type="button" onclick="revealLmsFlashcard(4)">Reveal Rebuttal ➔</button>
                <div class="fc-ans">"Understood Mike, keep your eyes on the road. I've got 15 seconds: we build emergency dispatch lines for trade contractors so you don't lose $8,000 weekend jobs while driving or on-site. I'll shoot a 30-second audio text to this cell with our live demo recording so you can tap it when you park. Wrapping up around 5 today?"</div>
              </div>
              <div class="fc-card" id="fc-5">
                <div class="fc-cue">5. "Call me back next month / after season."</div>
                <button class="fc-reveal-btn" type="button" onclick="revealLmsFlashcard(5)">Reveal Rebuttal ➔</button>
                <div class="fc-ans">"Happy to do that, but storm season and summer heat is happening right now. Missing one single weekend emergency job this week costs more than an entire year of Ava."</div>
              </div>
              <div class="fc-card" id="fc-6">
                <div class="fc-cue">6. "Karen: What company are you with &amp; regarding?"</div>
                <button class="fc-reveal-btn" type="button" onclick="revealLmsFlashcard(6)">Reveal Rebuttal ➔</button>
                <div class="fc-ans">"Hey Karen, it's Luke — quick operational question about your weekend emergency dispatch routing in [City]. Is the owner on a job site right now or in the office?"</div>
              </div>
              <div class="fc-card" id="fc-7">
                <div class="fc-cue">7. "Who gave you my cell phone number?"</div>
                <button class="fc-reveal-btn" type="button" onclick="revealLmsFlashcard(7)">Reveal Rebuttal ➔</button>
                <div class="fc-ans">"You're registered as the primary license holder with the state contractor registry. I only call trade business owners directly."</div>
              </div>
              <div class="fc-card" id="fc-8">
                <div class="fc-cue">8. "Bad economy / Tight budget right now."</div>
                <button class="fc-reveal-btn" type="button" onclick="revealLmsFlashcard(8)">Reveal Rebuttal ➔</button>
                <div class="fc-ans">"Totally get it. That's why there are zero long-term contracts. And in [Trade], a single $5,000 emergency replacement job covers the entire year on day one."</div>
              </div>
              <div class="fc-card" id="fc-9">
                <div class="fc-cue">9. "I do all my own calls on my cell phone."</div>
                <button class="fc-reveal-btn" type="button" onclick="revealLmsFlashcard(9)">Reveal Rebuttal ➔</button>
                <div class="fc-ans">"Respect that! But when you're in an attic or under a truck with tools in your hand at 6:30 PM, where does a new customer call go? If it hits voicemail, they tap the next guy on Google."</div>
              </div>
              <div class="fc-card" id="fc-10">
                <div class="fc-cue">10. "What is this about? Make it fast."</div>
                <button class="fc-reveal-btn" type="button" onclick="revealLmsFlashcard(10)">Reveal Rebuttal ➔</button>
                <div class="fc-ans">"Luke from VantorX. Got 20 seconds or should I hang up?"</div>
              </div>
            </div>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 4 of 15 Complete</span>
            <button class="btn btn-gold" id="btnCompleteUnit14" disabled type="button" onclick="completeLmsUnit('1-4', '1-5')">🔒 Review All 10 Cards to Unlock Exam ➔</button>
          </div>
        </div>

        <!-- UNIT 1.5 (DAY 1 EXAM) -->
        <div class="lms-lesson-view" id="view-1-5">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 1 ➔ <span>Lesson 1.5: Certification Exam</span></div>
              <div class="lms-view-title">📝 Day 1 Certification Exam (Contractor Mindset &amp; Objections)</div>
            </div>
            <span class="exam-score-badge" id="day1ExamBadge" style="background:rgba(245,158,11,0.15);color:var(--accent2);border:1px solid rgba(245,158,11,0.4)">Passing: 8 / 8 (100% Strict Mastery)</span>
          </div>

          <div class="lms-lock-screen" id="lockScreen15" style="display:none">
            <div class="lms-lock-icon">🔒</div>
            <div class="lms-lock-title">Day 1 Exam is Locked</div>
            <div class="lms-lock-desc">You must complete Lessons 1.1, 1.2, 1.3, and review all 10 Objection Flashcards in Lesson 1.4 before taking this exam.</div>
            <button class="btn btn-gold" type="button" onclick="selectLmsUnit('1-1')">Go to Lesson 1.1 ➔</button>
          </div>

          <div id="examBody15">
            <p style="color:var(--dim);font-size:13.5px;margin-bottom:16px">Score <strong>8 out of 8 (100% Mastery)</strong> to earn Day 1 Certification (+500 XP) and unlock Day 2. There are no softball questions. Each wrong option reflects a common amateur mistake that burns contractor leads.</p>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q1: You dial a direct cell number from the queue. A rough male voice answers: <em>"Yeah, talk to me."</em> What is your mandatory first reflex before speaking any part of your script?</div>
              <div class="quiz-options" data-day="1" data-q="1">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 1, 0, false)">A) Deliver the 4-second disarm immediately: "Luke from VantorX. Got 20 seconds or should I hang up?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 1, 1, true)">B) Verify owner identity: "Hey Mike? Luke with VantorX — you the owner or am I talking to the job foreman?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 1, 2, false)">C) Ask formal permission: "Hi, am I speaking with the primary executive decision maker for the company?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 1, 3, false)">D) Start pitching Ava's after-hours dispatch capabilities immediately before they can hang up.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q2: You call a roofing company's office line. A receptionist answers: <em>"Thanks for calling Gulf Coast Roofing, this is Sarah, how can I direct your call?"</em> How do you reach the owner without triggering a gatekeeper block?</div>
              <div class="quiz-options" data-day="1" data-q="2">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 2, 0, false)">A) "Hi Sarah, I'm calling from VantorX regarding your website and AI phone systems. Can I speak to the person in charge of technology?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 2, 1, true)">B) "Hey Sarah, is Mike around or is he out on a job site right now?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 2, 2, false)">C) "Sarah, tell Mike it's an urgent regulatory matter regarding his Florida state contractor license."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 2, 3, false)">D) "I need to speak to the owner right now about the thousands in emergency repair calls you're missing on weekends."</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q3: Sarah the Gatekeeper responds: <em>"Mike is in the field all day. What company are you with and what is this regarding so I can pass a message?"</em></div>
              <div class="quiz-options" data-day="1" data-q="3">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 3, 0, false)">A) "We provide automated AI receptionists that handle after-hours emergency calls for roofing contractors."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 3, 1, true)">B) "It's Luke — quick operational question about your weekend emergency call routing in Tampa. Does he check his cell or should I catch him at the shop around 4:30?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 3, 2, false)">C) "Tell him Luke called about an urgent business opportunity and have him call my cell number back."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 3, 3, false)">D) "Can you just give me his personal cell phone number so I don't have to bother you with technical questions?"</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q4: Contractor answers his cell while driving a work truck: <em>"Yeah, who's this? I'm driving right now."</em> What is the exact professional closer protocol?</div>
              <div class="quiz-options" data-day="1" data-q="4">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 4, 0, true)">A) "Understood Mike, keep your eyes on the road. I've got 15 seconds: we build emergency dispatch lines for trade contractors so you don't lose $8,000 weekend jobs while driving or on-site. I'll shoot a 30-second audio text to this cell with our live demo recording so you can tap it when you park. Wrapping up around 5 today?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 4, 1, false)">B) "Since you're on hands-free speaker right now, dial our live demo line (561) 813-8602 for 20 seconds and see what she sounds like on speaker."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 4, 2, false)">C) "Can you pull over to the side of the road for 2 minutes? This will save your company tens of thousands of dollars."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 4, 3, false)">D) "No problem at all, I'll send an email with our deck to your office and follow up next Tuesday."</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q5: A junior tech or apprentice answers the company truck cell: <em>"Superior HVAC, this is Jason."</em> What do you do?</div>
              <div class="quiz-options" data-day="1" data-q="5">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 5, 0, false)">A) Pitch Jason on how Ava will make his on-call night shifts easier so he advocates for you to the owner.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 5, 1, true)">B) "Hey Jason, Luke with VantorX. Is Dave in the truck with you or is he running another crew today?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 5, 2, false)">C) "Jason, please transfer me to whoever has authority to purchase communication software."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 5, 3, false)">D) Hang up immediately and place the lead on the callback queue for tomorrow.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q6: Why is <em>"I know you weren't expecting my call — got 20 seconds or should I hang up?"</em> mathematically superior to conventional rapport openers?</div>
              <div class="quiz-options" data-day="1" data-q="6">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 6, 0, false)">A) It catches them off-guard with aggressive reverse psychology so they feel socially trapped into listening.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 6, 1, false)">B) It lowers prospect status by showing the salesperson is dominant and doesn't care about their business.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 6, 2, true)">C) It acknowledges reality, demonstrates peer respect for their job site, and neutralizes sales defense by giving explicit autonomy to decline.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 6, 3, false)">D) It triggers an adrenaline-fueled fight-or-flight reflex that forces an immediate impulse agreement.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q7: Contractor demands aggressively: <em>"Who gave you my personal cell phone number? Is this a telemarketer?"</em></div>
              <div class="quiz-options" data-day="1" data-q="7">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 7, 0, true)">A) "You're registered as the primary license holder with the state contractor registry. I only call trade business owners directly — got 20 seconds or should I let you go?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 7, 1, false)">B) "Your number is publicly listed on Google Maps and Yelp, so it's fair game for anyone to call."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 7, 2, false)">C) "I apologize if I caught you at a bad time, our lead software scraped it from a public records database."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 7, 3, false)">D) "One of your mutual supply house partners in your county asked me to reach out to you directly."</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q8: After hearing your 20-second opener, the owner says: <em>"Just email me some information."</em> Why does agreeing immediately kill the deal?</div>
              <div class="quiz-options" data-day="1" data-q="8">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 8, 0, true)">A) Contractors receive 100+ invoices and supply quotes daily; general info emails get buried or sent to spam, converting a warm live conversation into a dead lead.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 8, 1, false)">B) Florida contractors are legally prohibited from reviewing commercial software solicitations via email.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 8, 2, false)">C) Emailing marketing collateral voids your commission under VantorX outbound policy.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(1, 8, 3, false)">D) It signals to the prospect that your software does not have a live phone demonstration.</button>
              </div>
            </div>
          </div>
        </div>

        <!-- UNIT 2.1 -->
        <div class="lms-lesson-view" id="view-2-1">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 2 ➔ <span>Lesson 2.1: Revenue Leak Economics</span></div>
              <div class="lms-view-title">💸 The $8,000 Revenue Leak &amp; Emergency Math</div>
            </div>
            <span class="lms-time-pill">⏱️ 15 Mins</span>
          </div>

          <div class="lms-text-block">
            <p>Never pitch "features". Contractors don't want software; they want to stop bleeding thousands of dollars on after-hours emergency calls. When a homeowner experiences an emergency (water leaking from a ceiling, AC blowing 90° air in July, overflowing toilet), their panic is at a 10 out of 10. They dial the first 3 contractors on Google Maps. <strong>The first company with a live, knowledgeable voice gets the $5,000 to $9,000 job.</strong></p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:16px 0">
              <div style="background:var(--bg);border:1px solid rgba(245,158,11,0.3);padding:14px;border-radius:10px">
                <div style="font-size:11px;color:var(--dim);text-transform:uppercase">Roofing Storm Damage</div>
                <div style="font-size:22px;font-weight:700;color:var(--accent2)">$8,500 Avg</div>
                <div style="font-size:11.5px;color:var(--dim);margin-top:4px">Drywall leaks, missing shingles, tarps</div>
              </div>
              <div style="background:var(--bg);border:1px solid rgba(245,158,11,0.3);padding:14px;border-radius:10px">
                <div style="font-size:11px;color:var(--dim);text-transform:uppercase">HVAC Compressor Blowout</div>
                <div style="font-size:22px;font-weight:700;color:var(--accent2)">$6,200 Avg</div>
                <div style="font-size:11.5px;color:var(--dim);margin-top:4px">System freeze-ups in Florida heat</div>
              </div>
              <div style="background:var(--bg);border:1px solid rgba(245,158,11,0.3);padding:14px;border-radius:10px">
                <div style="font-size:11px;color:var(--dim);text-transform:uppercase">Plumbing Slab Leak</div>
                <div style="font-size:22px;font-weight:700;color:var(--accent2)">$4,800 Avg</div>
                <div style="font-size:11.5px;color:var(--dim);margin-top:4px">Under-slab pipe rupture on Sunday night</div>
              </div>
            </div>

            <div class="lms-script-box">
              <strong>The Math That Closes Deals:</strong><br>
              "Missing just ONE single emergency replacement call every 60 days costs your business $51,000 a year. Ava costs $397 to $697 a month flat. That means capturing one single weekend call pays for Ava for the entire year on day one."
            </div>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 6 of 15 Complete</span>
            <button class="btn btn-gold" type="button" onclick="completeLmsUnit('2-1', '2-2')">✓ Mark Complete &amp; Continue to 2.2 ➔</button>
          </div>
        </div>

        <!-- UNIT 2.2 -->
        <div class="lms-lesson-view" id="view-2-2">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 2 ➔ <span>Lesson 2.2: Total Agreement Shield</span></div>
              <div class="lms-view-title">🤖 Total Agreement Shield vs. "I Hate AI / Robots"</div>
            </div>
            <span class="lms-time-pill">⏱️ 15 Mins</span>
          </div>

          <div class="lms-text-block">
            <p>Contractors hate AI because 99% of "AI bots" sound like Siri reading a dictionary. They also hate human answering services because answering services put callers on hold for 4 minutes, charge $2/min, misspell caller names, and don't know the difference between a capacitor and a compressor.</p>

            <div class="lms-script-box">
              <strong>The Total Agreement Shield Script:</strong><br>
              "I agree with you 100%! Most AI sounds like a broken microwave. That's why we trained Ava specifically on trade jargon. Punch in (561) 813-8602 right now — if she sounds fake or robotic, hang up on me and lose my number."
            </div>

            <p><strong>The Operational Contrast:</strong></p>
            <ul style="font-size:13.5px;color:#e2e8f0;line-height:1.65;padding-left:18px">
              <li><strong>Old Answering Service:</strong> 4-minute hold times, $2/min overage fees, notes emailed 2 hours late. Homeowner has already hired someone else.</li>
              <li><strong>Ava:</strong> Answers on Ring 1, triages the emergency, asks for the square footage/tonnage/leak location, and writes directly into their dispatch calendar.</li>
            </ul>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 7 of 15 Complete</span>
            <button class="btn btn-gold" type="button" onclick="completeLmsUnit('2-2', '2-3')">✓ Mark Complete &amp; Continue to 2.3 ➔</button>
          </div>
        </div>

        <!-- UNIT 2.3 -->
        <div class="lms-lesson-view" id="view-2-3">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 2 ➔ <span>Lesson 2.3: Live Demo Challenge Drop</span></div>
              <div class="lms-view-title">📞 The 60-Second Live Demo Challenge Drop</div>
            </div>
            <span class="lms-time-pill">⏱️ 12 Mins</span>
          </div>

          <div class="lms-text-block">
            <p>The single greatest weapon in the VantorX cold call arsenal is the <strong>Live Demo Line: (561) 813-8602</strong>. When a contractor hears Ava answer on the first ring, with authentic Florida trade inflection, 90% of objections vanish instantly.</p>

            <div class="lms-callout" style="border-left: 3px solid var(--accent); background: rgba(245,158,11,0.06); padding: 14px 18px; margin: 16px 0; border-radius: 6px;">
              <strong style="color:var(--accent); font-size:13.5px;">⚠️ CRITICAL COLD CALL REALITY — MOBILE VS. OFFICE LANDLINE:</strong>
              <p style="margin: 6px 0 0; font-size: 13px; line-height: 1.6; color: var(--fg);">
                <strong>90% of trade cold calls reach the owner on his personal mobile cell phone while he is driving or on-site.</strong><br>
                Never make the rookie mistake of telling an owner on his cell to <em>"punch in a number on speaker right now"</em> — he is literally talking to you on that very device. Instead, distinguish your delivery based on where he answered:
              </p>
            </div>

            <div class="lms-script-box" style="margin-bottom: 14px;">
              <strong style="color:var(--accent2);">Case A: Contractor Answered on Cell Phone (Standard Protocol):</strong><br>
              <em>"I just shot a direct text with our live dispatch line — <strong>(561) 813-8602</strong> — to this cell phone. When we hang up or when you park, tap it on speaker and hear Ava answer on ring one. Pretend you have an emergency $8,000 burst pipe. What time do you wrap your last call today so I can see what you thought?"</em>
            </div>

            <div class="lms-script-box" style="margin-bottom: 18px;">
              <strong style="color:var(--accent2);">Case B: Contractor Answered on Office Desk Phone / Landline:</strong><br>
              <em>"Pull your cell phone out of your pocket right now and dial our live demo line on speaker: <strong>(561) 813-8602</strong>. Pretend it's 8 PM on a Sunday. Listen to how fast she picks up and books a roof estimate while I stay on the line."</em>
            </div>

            <div class="lms-audio-bar">
              <div>
                <strong style="color:var(--accent2);font-size:13.5px">🗣️ Audio Simulation: Delivering the Demo Challenge</strong>
                <div style="font-size:12px;color:var(--dim)">Listen to how an elite closer drops (561) 813-8602 without hesitation</div>
              </div>
              <button class="btn btn-gold btn-sm" type="button" onclick="playContractorAudioSimulation('demo_challenge')">🔊 Play Audio</button>
            </div>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 8 of 15 Complete</span>
            <button class="btn btn-gold" type="button" onclick="completeLmsUnit('2-3', '2-4')">✓ Mark Complete &amp; Continue to 2.4 ➔</button>
          </div>
        </div>

        <!-- UNIT 2.4 -->
        <div class="lms-lesson-view" id="view-2-4">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 2 ➔ <span>Lesson 2.4: Cold Call Quest Sparring</span></div>
              <div class="lms-view-title">⚔️ Practical Sparring Requirement (Defeat 2 Bosses)</div>
            </div>
            <span class="lms-time-pill">⏱️ 15 Mins</span>
          </div>

          <div class="lms-text-block">
            <p>Theory means nothing without emotional resilience. You cannot pass Day 2 or unlock the Day 2 Exam until you prove you can bring at least <strong>2 contractor bosses to complete agreement</strong> in Cold Call Quest RPG under the 2-minute timer.</p>

            <div style="background:var(--bg);border:1px solid rgba(245,158,11,0.3);padding:16px 20px;border-radius:12px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin:20px 0">
              <div>
                <div style="font-size:13px;color:var(--dim)">Your Current Combat Record:</div>
                <div style="font-size:24px;font-weight:800;color:var(--accent2)"><span id="lmsBossCountD2">0</span> / 2 Bosses Defeated</div>
              </div>
              <button class="btn btn-gold" type="button" onclick="switchTab('tabRPG')">⚔️ Open Cold Call Quest &amp; Fight Bosses ➔</button>
            </div>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 9 of 15 Complete</span>
            <button class="btn btn-gold" id="btnCompleteUnit24" type="button" onclick="completeLmsUnit('2-4', '2-5')">✓ Verify Sparring &amp; Unlock Day 2 Exam ➔</button>
          </div>
        </div>

        <!-- UNIT 2.5 (DAY 2 EXAM) -->
        <div class="lms-lesson-view" id="view-2-5">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 2 ➔ <span>Lesson 2.5: Certification Exam</span></div>
              <div class="lms-view-title">📝 Day 2 Certification Exam (Revenue Leaks &amp; Hard Objections)</div>
            </div>
            <span class="exam-score-badge" id="day2ExamBadge" style="background:rgba(245,158,11,0.15);color:var(--accent2);border:1px solid rgba(245,158,11,0.4)">Passing: 8 / 8 (100% Strict Mastery + 2 Bosses)</span>
          </div>

          <div class="lms-lock-screen" id="lockScreen25" style="display:none">
            <div class="lms-lock-icon">🔒</div>
            <div class="lms-lock-title">Day 2 Exam is Locked</div>
            <div class="lms-lock-desc">You must complete Lessons 2.1, 2.2, 2.3, and defeat at least 2 Bosses in Cold Call Quest RPG in Lesson 2.4 before taking this exam.</div>
            <button class="btn btn-gold" type="button" onclick="selectLmsUnit('2-1')">Go to Lesson 2.1 ➔</button>
          </div>

          <div id="examBody25">
            <p style="color:var(--dim);font-size:13.5px;margin-bottom:16px">Score <strong>8 out of 8 (100% Mastery)</strong> and defeat at least 2 Bosses in RPG to earn Day 2 Certification (+500 XP) and unlock Day 3. Every option tests real trade closing psychology.</p>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q1: When a contractor insists: <em>"We don't need any software, our phones ring plenty during the day,"</em> what economic reality exposes their leak?</div>
              <div class="quiz-options" data-day="2" data-q="1">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 1, 0, false)">A) Daytime scheduled repair tickets carry low margins ($150–$350), whereas after-hours emergency calls (blown compressors, slab leaks, storm damage) average $5,000–$9,000 and 85% of callers hang up if they hit voicemail.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 1, 1, false)">B) Contractors are legally required by Florida trade statutes to maintain 24/7 human-equivalent dispatch coverage.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 1, 2, false)">C) Competitors who run AI will underbid their commercial service contracts by 40% within 12 months.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 1, 3, true)">D) "That's great for 9 to 5, but when an $8,000 emergency replacement calls at 8 PM or on Saturday, where does that call ring? If it hits voicemail, they tap the next contractor on Google and you lose thousands."</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q2: When an owner objects: <em>"We already pay an answering service $300 a month to pick up our phones after 5 PM,"</em> what is their fatal operational flaw?</div>
              <div class="quiz-options" data-day="2" data-q="2">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 2, 0, true)">A) Traditional call centers put emergency callers on hold for 3-5 minutes, charge per-minute overages, cannot diagnose trade technical emergencies, and cannot live-book into dispatch software like ServiceTitan.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 2, 1, false)">B) Third-party answering services are legally prohibited from handling trade customer information in Florida.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 2, 2, false)">C) Answering services require long-term 3-year commercial contracts that bankrupt smaller trade businesses.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 2, 3, false)">D) Answering services only employ automated IVR touch-tone menus that homeowners refuse to use.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q3: You are speaking with an owner who is at his office desk or shop. What is the exact sequence to execute the Live Demo Drop?</div>
              <div class="quiz-options" data-day="2" data-q="3">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 3, 0, false)">A) Email him a link to a YouTube video demonstrating Ava's voice capabilities while keeping him on the phone.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 3, 1, true)">B) Instruct him to put his phone on speaker, use his office line or cell to dial (561) 813-8602 right now, and roleplay an emergency caller with a water leak or blown AC for 20 seconds.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 3, 2, false)">C) Hang up immediately, promise to call him back in 15 minutes, and text him a prerecorded audio file.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 3, 3, false)">D) Play an audio clip through your computer microphone while talking over it to explain technical specifications.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q4: Owner snaps: <em>"I hate AI. Every robo-caller sounds like a broken microwave and my customers want real people."</em> How do you hold frame?</div>
              <div class="quiz-options" data-day="2" data-q="4">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 4, 0, false)">A) Disagree firmly and explain that OpenAI large language models have achieved human parity on benchmark tests.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 4, 1, true)">B) Total Agreement Shield: "I agree with you 100%! Most AI sounds awful. That's why we calibrated Ava specifically on Florida trade slang. Dial (561) 813-8602 on speaker right now — if she sounds robotic, hang up on me and lose my number."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 4, 2, false)">C) Offer a 50% discount on the setup fee to compensate for his skepticism about automated technology.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 4, 3, false)">D) Ask him to describe in detail the last bad experience he had with an automated telephone system.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q5: In the first 45 seconds, the contractor demands: <em>"Cut the sales crap — how much is this going to cost me?"</em> How do you respond?</div>
              <div class="quiz-options" data-day="2" data-q="5">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 5, 0, false)">A) Refuse to give any price until he commits to a full 45-minute technical screen-share demonstration.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 5, 1, false)">B) Quote $49/month to keep him on the phone, intending to reveal the $997 setup fee at the very end of the call.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 5, 2, true)">C) State the transparent flat range ($397 Starter or $697 Pro bundle), anchor it against an $8,000 emergency ticket ROI, and pivot back: "One captured emergency covers an entire year. But let's see if she even fits your call flow first."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 5, 3, false)">D) Ask him what his company's annual gross revenue was last year before quoting a price.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q6: Owner says: <em>"I need to run this past my business partner / wife before I spend any money."</em> What is the elite closer play?</div>
              <div class="quiz-options" data-day="2" data-q="6">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 6, 0, false)">A) Challenge his decision-making authority: "Are you not the primary owner who signs the checks for this company?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 6, 1, true)">B) Arm him with the demo tool instead of forcing him to explain software: "100%. Don't try to explain AI to them. Put your phone on speaker with them tonight and dial (561) 813-8602 for 20 seconds. Let Ava sell herself."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 6, 2, false)">C) Schedule a 3-way conference call 10 days out when both partners might have 45 minutes of free time.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 6, 3, false)">D) Offer to waive the setup fee if he signs an agreement before hanging up today.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q7: Contractor says: <em>"We're booked out 4 weeks solid, we can't take any more work right now."</em> What is the counter?</div>
              <div class="quiz-options" data-day="2" data-q="7">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 7, 0, false)">A) Suggest he hire more subcontractors or purchase additional work vans to expand his workforce.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 7, 1, true)">B) "Being booked out 4 weeks on standard maintenance is great, but when a homeowner with an $8,500 replacement emergency calls this Saturday at 9 PM, do you want that job or do you want your competitor down the road cashing that check?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 7, 2, false)">C) Apologize and place him on a 6-month callback calendar until his schedule slows down.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 7, 3, false)">D) Pitch him on Ava's appointment rescheduling features rather than emergency job capture.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q8: According to trade service analytics across HVAC, roofing, and plumbing contractors, what percentage of emergency after-hours callers hang up without leaving a voicemail when hitting an answering machine?</div>
              <div class="quiz-options" data-day="2" data-q="8">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 8, 0, false)">A) Less than 25% (most homeowners leave detailed voice recordings).</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 8, 1, false)">B) Roughly 50% (half leave voicemails, half wait until morning).</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 8, 2, true)">C) Over 85% (emergency callers are in panic mode and immediately tap the next business on Google Maps until a live voice answers).</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(2, 8, 3, false)">D) 100% (nobody has left a voicemail on a trade contractor's phone since 2018).</button>
              </div>
            </div>
          </div>
        </div>

        <!-- UNIT 3.1 -->
        <div class="lms-lesson-view" id="view-3-1">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 3 ➔ <span>Lesson 3.1: High-Ticket Packaging</span></div>
              <div class="lms-view-title">🤝 High-Ticket Packaging ($697 Pro vs. $397 Starter)</div>
            </div>
            <span class="lms-time-pill">⏱️ 15 Mins</span>
          </div>

          <div class="lms-text-block">
            <p>Always pitch the <strong>Pro Bundle ($697/month + $997 Setup)</strong> first. It gives contractors both phone call coverage and website speed-to-lead auto-texting. Only drop to the Starter tier if they are a 1-man operation on a strict budget.</p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin:16px 0">
              <div style="background:var(--bg);border:2px solid var(--accent);padding:18px;border-radius:12px;position:relative">
                <span style="position:absolute;top:10px;right:10px;background:var(--accent);color:#000;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px">RECOMMENDED DEFAULT</span>
                <div style="font-size:13px;color:var(--accent2);font-weight:700">OPTION 1: PRO BUNDLE</div>
                <div style="font-size:24px;font-weight:800;color:#ffffff;margin:4px 0">$697 / month</div>
                <div style="font-size:12px;color:var(--dim);margin-bottom:10px">+$997 Setup Fee (Voice Training + Knowledge Base)</div>
                <ul style="font-size:12.5px;color:#e2e8f0;padding-left:16px;line-height:1.55">
                  <li>24/7 AI Phone Receptionist (Ava)</li>
                  <li>Instant 5-Second Speed-to-Lead Website Auto-Texting</li>
                  <li>Direct Calendar Dispatch Integration</li>
                  <li>Zero Long-Term Contracts (Cancel Anytime)</li>
                </ul>
              </div>

              <div style="background:var(--bg);border:1px solid var(--line);padding:18px;border-radius:12px">
                <div style="font-size:13px;color:var(--dim);font-weight:700">OPTION 2: STARTER (FALLBACK)</div>
                <div style="font-size:24px;font-weight:800;color:#ffffff;margin:4px 0">$397 / month</div>
                <div style="font-size:12px;color:var(--dim);margin-bottom:10px">+$497 Setup Fee</div>
                <ul style="font-size:12.5px;color:#e2e8f0;padding-left:16px;line-height:1.55">
                  <li>After-Hours &amp; Overflow AI Voice Receptionist</li>
                  <li>SMS Dispatch Lead Notifications</li>
                  <li>Zero Long-Term Contracts</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 11 of 15 Complete</span>
            <button class="btn btn-gold" type="button" onclick="completeLmsUnit('3-1', '3-2')">✓ Mark Complete &amp; Continue to 3.2 ➔</button>
          </div>
        </div>

        <!-- UNIT 3.2 -->
        <div class="lms-lesson-view" id="view-3-2">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 3 ➔ <span>Lesson 3.2: 48-Hour Zero-Downtime Guarantee</span></div>
              <div class="lms-view-title">🚀 48-Hour Zero-Downtime Launch &amp; Call Forwarding (*71)</div>
            </div>
            <span class="lms-time-pill">⏱️ 10 Mins</span>
          </div>

          <div class="lms-text-block">
            <p>The #1 hesitation contractors have when signing up is: <em>"Are you going to mess up my current phone number or leave me without phones for a week?"</em> You must remove this fear in 15 seconds.</p>

            <div class="lms-script-box">
              <strong>The 48-Hour Zero-Downtime Guarantee Script:</strong><br>
              "We never port your numbers or touch your existing carrier. We set up simple conditional call forwarding (*71) so when your lines ring 4 times unanswered or after 5 PM, Ava picks up seamlessly. You have zero downtime and full control."
            </div>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 12 of 15 Complete</span>
            <button class="btn btn-gold" type="button" onclick="completeLmsUnit('3-2', '3-3')">✓ Mark Complete &amp; Continue to 3.3 ➔</button>
          </div>
        </div>

        <!-- UNIT 3.3 -->
        <div class="lms-lesson-view" id="view-3-3">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 3 ➔ <span>Lesson 3.3: 4-Min Call Symphony</span></div>
              <div class="lms-view-title">🎼 The Full Call Symphony (Open to Close in 4 Minutes)</div>
            </div>
            <span class="lms-time-pill">⏱️ 15 Mins</span>
          </div>

          <div class="lms-text-block">
            <p>Study the master 4-minute call symphony from first ring to credit card:</p>

            <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">
              <div style="background:var(--bg);border-left:3px solid var(--accent);padding:10px 14px;border-radius:0 8px 8px 0;font-size:13px">
                <strong style="color:var(--accent2)">0:00 – 0:15 (The Disarm):</strong> "Luke with VantorX. Got 20 seconds or should I hang up?"
              </div>
              <div style="background:var(--bg);border-left:3px solid var(--accent);padding:10px 14px;border-radius:0 8px 8px 0;font-size:13px">
                <strong style="color:var(--accent2)">0:15 – 0:45 (The Trade Leak Hook):</strong> "In [Trade], when an emergency call comes in at 8 PM on a Saturday, where does that ring right now?"
              </div>
              <div style="background:var(--bg);border-left:3px solid var(--accent);padding:10px 14px;border-radius:0 8px 8px 0;font-size:13px">
                <strong style="color:var(--accent2)">0:45 – 1:30 (The Live Demo Drop):</strong> "Punch in our live demo line right now on speaker: (561) 813-8602. Hear her for 20 seconds."
              </div>
              <div style="background:var(--bg);border-left:3px solid var(--accent);padding:10px 14px;border-radius:0 8px 8px 0;font-size:13px">
                <strong style="color:var(--accent2)">1:30 – 2:30 (The Objection Shield):</strong> Agree, pivot, and anchor the $397/$697 ROI against one single emergency job.
              </div>
              <div style="background:var(--bg);border-left:3px solid var(--ok);padding:10px 14px;border-radius:0 8px 8px 0;font-size:13px">
                <strong style="color:#6ee7b7">2:30 – 4:00 (The Close):</strong> "Should I send the setup link to your cell, or let's lock in 10 minutes on your calendar tomorrow morning?"
              </div>
            </div>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 13 of 15 Complete</span>
            <button class="btn btn-gold" type="button" onclick="completeLmsUnit('3-3', '3-4')">✓ Mark Complete &amp; Continue to 3.4 ➔</button>
          </div>
        </div>

        <!-- UNIT 3.4 -->
        <div class="lms-lesson-view" id="view-3-4">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 3 ➔ <span>Lesson 3.4: Boss Crucible</span></div>
              <div class="lms-view-title">⚔️ Grand Master Boss Crucible (All 4 Bosses Defeated)</div>
            </div>
            <span class="lms-time-pill">⏱️ 15 Mins</span>
          </div>

          <div class="lms-text-block">
            <p>Before earning your Level 5 License to Dial, you must prove you can defeat all 4 contractor dungeon bosses in Cold Call Quest (Rick the Roofer, Karen the Gatekeeper, Mike the Electrician, and Dave the Plumber):</p>

            <div style="background:var(--bg);border:1px solid rgba(245,158,11,0.3);padding:16px 20px;border-radius:12px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin:20px 0">
              <div>
                <div style="font-size:13px;color:var(--dim)">Total Crucible Bosses Defeated:</div>
                <div style="font-size:24px;font-weight:800;color:var(--accent2)"><span id="lmsBossCountD3">0</span> / 4 Bosses Defeated</div>
              </div>
              <button class="btn btn-gold" type="button" onclick="switchTab('tabRPG')">⚔️ Spar with Remaining Bosses ➔</button>
            </div>
          </div>

          <div class="lms-stage-footer">
            <span style="font-size:12.5px;color:var(--dim)">Step 14 of 15 Complete</span>
            <button class="btn btn-gold" id="btnCompleteUnit34" type="button" onclick="completeLmsUnit('3-4', '3-5')">✓ Verify Crucible &amp; Unlock Board Exam ➔</button>
          </div>
        </div>

        <!-- UNIT 3.5 (BOARD EXAM) -->
        <div class="lms-lesson-view" id="view-3-5">
          <div class="lms-view-head">
            <div>
              <div class="lms-breadcrumbs">Day 3 ➔ <span>Lesson 3.5: Final Board Exam</span></div>
              <div class="lms-view-title">🏆 Final Certification Board Exam (15 Comprehensive Scenarios)</div>
            </div>
            <span class="exam-score-badge" id="day3ExamBadge" style="background:rgba(245,158,11,0.15);color:var(--accent2);border:1px solid rgba(245,158,11,0.4)">Passing: 14 / 15 (93.3% Strict Mastery + 4 Bosses)</span>
          </div>

          <div class="lms-lock-screen" id="lockScreen35" style="display:none">
            <div class="lms-lock-icon">🔒</div>
            <div class="lms-lock-title">Final Board Exam is Locked</div>
            <div class="lms-lock-desc">You must complete Lessons 3.1, 3.2, 3.3, and defeat all 4 Bosses in Cold Call Quest RPG in Lesson 3.4 before taking this final certification exam.</div>
            <button class="btn btn-gold" type="button" onclick="selectLmsUnit('3-1')">Go to Lesson 3.1 ➔</button>
          </div>

          <div id="examBody35">
            <p style="color:var(--dim);font-size:13.5px;margin-bottom:16px">Score at least <strong>14 out of 15 (93.3% Strict Mastery)</strong> and defeat all 4 Crucible Bosses to earn Level 5 Certified Closer status and unlock the live lead dispatcher. Every question tests real closing mastery.</p>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q1: Which tier should you recommend first to any 2–10 truck trade contractor?</div>
              <div class="quiz-options" data-day="3" data-q="1">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 1, 0, false)">A) The $397 Starter Plan to reduce upfront sales friction and get them signed quickly without risk.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 1, 1, true)">B) The $697/mo Pro AI Receptionist + Speed-to-Lead bundle ($997 setup fee) because it captures after-hours phone calls and auto-texts web form leads within 5 seconds, stopping both major revenue leaks.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 1, 2, false)">C) A custom enterprise tier billed at $1,497/mo with mandatory dedicated VoIP server hosting.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 1, 3, false)">D) A 14-day free trial without a credit card to prove software performance before asking for payment.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q2: What is the exact launch timeline and operational impact you promise the contractor to eliminate fear of phone disruption?</div>
              <div class="quiz-options" data-day="3" data-q="2">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 2, 0, true)">A) 48 hours — custom trade calibration with zero phone downtime via simple conditional call forwarding (*71), without switching carriers or changing their existing business numbers.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 2, 1, false)">B) 3 to 4 business days involving a full porting transfer of their primary business lines to VantorX SIP servers.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 2, 2, false)">C) Immediate instant activation requiring the contractor to cancel their current cellular provider and install softphones.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 2, 3, false)">D) 2 weeks of developer coding to rebuild their CRM database architecture from scratch.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q3: A busy owner on a job site brushes you off: <em>"Send me an email with your pricing and deck so I can look over it later."</em> What is the elite counter-play?</div>
              <div class="quiz-options" data-day="3" data-q="3">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 3, 0, true)">A) "I can definitely send an email, Mike, but it'll get buried under 50 supply receipts. If I give you our live demo line right now, it takes 30 seconds on speaker to hear her — got your cell or a second phone handy?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 3, 1, false)">B) "Emailing sales decks is against our company policy because trade owners never open attachments."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 3, 2, false)">C) "I'll email the deck right away, and I will place a priority calendar hold on your calendar for tomorrow at 8 AM."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 3, 3, false)">D) "If I send the email, will you promise to sign the agreement by 5 PM today so we can begin onboarding?"</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q4: Gatekeeper Karen says: <em>"Mr. Davis doesn't have time to test demo phone numbers and he doesn't take unsolicited sales calls."</em> How do you pivot without burning the office?</div>
              <div class="quiz-options" data-day="3" data-q="4">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 4, 0, true)">A) "Karen, you're the office manager who handles dispatch when Mike is in the field. Dial (561) 813-8602 from your desk phone right now for 20 seconds. If Ava sounds like a robot or can't handle emergency triage, tell Mike I called and you rejected us."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 4, 1, false)">B) "Can you please give me Mr. Davis's direct mobile phone number so I don't have to take up any more of your time?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 4, 2, false)">C) "Tell Mr. Davis that his competitors are using artificial intelligence and his company will be obsolete within two years."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 4, 3, false)">D) "I understand Karen, please transfer me directly to your accounts payable department so I can verify billing."</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q5: Mike the Electrician challenges you: <em>"I'm a licensed master electrician. My customers want a real person who understands breaker amperage, not a computer."</em> What is your shield?</div>
              <div class="quiz-options" data-day="3" data-q="5">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 5, 0, true)">A) Total Agreement Shield: "I agree 100%! Most AI doesn't know the difference between 100A and 200A. That's why Ava was custom-trained on electrical triage. Dial (561) 813-8602 right now on speaker and test her terminology."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 5, 1, false)">B) Disagree and explain that generative neural networks possess more electrical engineering knowledge than human master tradesmen.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 5, 2, false)">C) Offer to remove all electrical jargon from the bot so it only collects the customer's name and telephone number.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 5, 3, false)">D) Ask Mike to provide a 50-page technical glossary so our engineering team can spend a month coding custom responses.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q6: Dave the Plumber objects: <em>"I bet there's a 12-month lock-in contract and hidden per-minute usage fees."</em> What is your exact response?</div>
              <div class="quiz-options" data-day="3" data-q="6">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 6, 0, true)">A) "Zero long-term contracts, cancel anytime. Flat monthly rate with no per-minute extortion. And one single water heater or slab leak covers almost the entire year."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 6, 1, false)">B) "There is a 12-month commitment, but it comes with a 100% money-back guarantee if we don't double your inbound revenue."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 6, 2, false)">C) "We charge standard metered cellular carrier fees of $0.18 per minute plus a nominal server maintenance retainer."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 6, 3, false)">D) "Contracts are standard across all SaaS platforms, but we can negotiate a 6-month trial if you pay upfront."</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q7: Why must an outbound closer NEVER say: <em>"I'm following up on an email I sent you earlier this week"</em>?</div>
              <div class="quiz-options" data-day="3" data-q="7">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 7, 0, true)">A) It instantly brands you as a weak telemarketer making excuses, destroys your peer status before you even speak, and gives them an immediate excuse to say 'I didn't get it, send it again.'</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 7, 1, false)">B) Federal FCC regulations classify cold email follow-up phone calls as commercial telephone harassment.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 7, 2, false)">C) Contractors always read their cold emails, so reminding them is redundant and annoying.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 7, 3, false)">D) It reveals that your automated email marketing software has poor inbox deliverability.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q8: When closing an owner at the end of a successful demo, which closing question maintains frame and moves directly to onboarding?</div>
              <div class="quiz-options" data-day="3" data-q="8">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 8, 0, false)">A) "Do you think you might be interested in purchasing this software system sometime this week?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 8, 1, true)">B) The Assumptive Choice Close: "Should I text the setup link to this cell, or let's lock in 10 minutes on your calendar tomorrow morning before your crews dispatch?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 8, 2, false)">C) "Can you read me the numbers on your company credit card right now so I can charge your setup fee?"</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 8, 3, false)">D) "Would you like me to send over our 12-page terms of service agreement for your attorney to review?"</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q9: A stubborn contractor insists: <em>"I never miss calls, I keep my phone on my belt 24/7."</em> What operational reality shatters this delusion?</div>
              <div class="quiz-options" data-day="3" data-q="9">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 9, 0, true)">A) When they are inside a 130°F attic, on a 2-story roof with power tools, or having dinner with family, emergency calls roll to voicemail where over 85% of high-ticket homeowners hang up and immediately call the next contractor on Google Maps.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 9, 1, false)">B) Cellular carriers in Florida frequently drop incoming calls in rural service zones without alerting the subscriber.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 9, 2, false)">C) Keeping a phone on your belt violates OSHA commercial job site safety standards for licensed trades.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 9, 3, false)">D) Contractors who answer calls on job sites are rated 40% lower on Google Reviews due to background noise.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q10: What is the speed-to-lead requirement for trade web form leads, and how does Ava execute it?</div>
              <div class="quiz-options" data-day="3" data-q="10">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 10, 0, false)">A) Responding within 24 hours via email quote maintains high professionalism and allows thorough job estimating.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 10, 1, true)">B) Contact within 5 minutes results in a 21x higher qualification rate; Ava auto-texts web form leads within 5 seconds with an interactive conversational booking prompt.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 10, 2, false)">C) Contacting web leads in under 30 minutes is sufficient for residential service contractors.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 10, 3, false)">D) Speed-to-lead only applies to commercial bidding opportunities, not residential repair requests.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q11: What is the daily dial benchmark required to guarantee 1 closed customer per week for an outbound trade rep?</div>
              <div class="quiz-options" data-day="3" data-q="11">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 11, 0, false)">A) 15–20 high-touch personalized dials per day with detailed pre-call website analysis.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 11, 1, true)">B) 75 targeted dials per day (75 dials ➔ 12–15 pickups ➔ 2–3 live demos ➔ 1 closed high-ticket deal).</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 11, 2, false)">C) 400 random automated robocalls per day using an overseas auto-dialer.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 11, 3, false)">D) 50 LinkedIn direct messages combined with 10 cold emails per day.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q12: If a commercial mechanical contractor says: <em>"We do all commercial HVAC, we don't do residential emergency repairs,"</em> what is the pivot?</div>
              <div class="quiz-options" data-day="3" data-q="12">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 12, 0, true)">A) "Commercial rooftop unit (RTU) failures and industrial chiller leaks are $15,000+ jobs. Facility managers and property directors expect instant 24/7 phone response or they immediately dial the next mechanical contractor on their emergency vendor list."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 12, 1, false)">B) "Ava is engineered exclusively for residential homeowners, so our Pro tier would not be suitable for your operations."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 12, 2, false)">C) "You should consider launching a residential division to capture high-margin weekend homeowner calls."</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 12, 3, false)">D) "Commercial facility managers always submit service tickets through online work order portals rather than calling."</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q13: If you stumble over a word or fumble your opener during a live call, what is the mandatory mental reflex?</div>
              <div class="quiz-options" data-day="3" data-q="13">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 13, 0, false)">A) Apologize immediately to the contractor for being nervous and ask if you can restart the conversation.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 13, 1, true)">B) Pause calmly for 1 second, lower your vocal pitch, hold frame without apologizing, and transition smoothly into the pain hook or demo challenge with complete authority.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 13, 2, false)">C) Speed up your speaking rate by 30% to finish the pitch before the prospect can notice your mistake.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 13, 3, false)">D) Hang up the call immediately, flag the lead as bad data, and move to the next contact.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q14: How does Ava handle customer service dispatching and appointment scheduling?</div>
              <div class="quiz-options" data-day="3" data-q="14">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 14, 0, true)">A) She qualifies their emergency issue, collects full name/address/trade problem, quotes the contractor's dispatch diagnostic fee, and writes the booking directly into ServiceTitan, Housecall Pro, or Google Calendar while sending an instant SMS summary to the on-call tech.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 14, 1, false)">B) She records a 3-minute voicemail and emails the audio file to the contractor's general inbox.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 14, 2, false)">C) She sends an automated link instructing the customer to fill out a 10-step online intake questionnaire.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 14, 3, false)">D) She transfers all callers directly to the contractor's personal cell phone regardless of the time of night.</button>
              </div>
            </div>

            <div class="mod-quiz-box">
              <div class="quiz-q-title">Q15: What is the primary mindset of a Top 1% VantorX Closer?</div>
              <div class="quiz-options" data-day="3" data-q="15">
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 15, 0, false)">A) A high-pressure software salesperson focused on closing transactions on the first call at all costs.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 15, 1, true)">B) An operational diagnostic peer who acts as a trusted revenue protector, diagnosing after-hours leaks and safeguarding trade owners from hemorrhaging $8,000 emergency jobs to local competitors.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 15, 2, false)">C) A telemarketer reading a rigid script word-for-word as fast as possible to beat the prospect's interruption reflex.</button>
                <button class="quiz-opt-btn" type="button" onclick="checkDayAnswer(3, 15, 3, false)">D) A customer support representative who answers questions passively and sends brochures upon request.</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- TAB 1: 📜 MULTI-PRODUCT SALES TELEPROMPTER -->
  <div id="tabScript" class="tab-panel">
    <div class="teleprompter">

      <!-- Active Dial Lead Banner -->
      <div class="active-lead-banner" id="activeLeadBanner">
        <div class="active-lead-header">
          <div class="active-lead-title">
            <span>🎯 ACTIVE TARGET:</span>
            <span id="activeLeadName" style="color:var(--accent2)">Palm Air Air Conditioning, Inc.</span>
            <span class="badge-prod badge-prod-ava" id="activeLeadProdBadge">🤖 Ava AI Voice</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span class="status-badge status-badge-uncalled" id="prompterStatusBadge">⏳ To Call</span>
            <button class="btn btn-ghost btn-sm" id="prompterToggleCallBtn" style="border:1px solid rgba(52,211,153,0.5);color:#6ee7b7">✓ Mark as Called</button>
            <a href="tel:5612031315" class="btn btn-gold btn-sm" id="activeLeadCallBtn">📞 Call (561) 203-1315</a>
            <button class="btn btn-ghost btn-sm" id="clearActiveLeadBtn">✕ Clear Lead</button>
          </div>
        </div>

        <div class="active-lead-grid">
          <div class="active-lead-cell">
            <div class="active-lead-label">Decision Maker</div>
            <div class="active-lead-val" id="activeLeadOwner">Everett Hill (Co-Founder &amp; Principal)</div>
          </div>
          <div class="active-lead-cell">
            <div class="active-lead-label">Location &amp; Trade</div>
            <div class="active-lead-val" id="activeLeadLocation">Boca Raton, FL · HVAC</div>
          </div>
          <div class="active-lead-cell">
            <div class="active-lead-label">Estimated Annual Leak <span class="math-info-pill" onclick="openLeakMathModal()" title="View formula">ℹ️ Math</span></div>
            <div class="active-lead-val" style="color:#fca5a5" id="activeLeadLoss">-$102,000 / year ($8,500/mo)</div>
            <div style="font-size:11px;color:var(--dim);margin-top:3px" id="activeLeadLeakBreakdown">1 AC replacement (~$8,500) + 2 repair calls/mo</div>
          </div>
          <div class="active-lead-cell">
            <div class="active-lead-label">Net Profit Saved with VantorX</div>
            <div class="active-lead-val" style="color:#6ee7b7" id="activeLeadSavings">+$93,636 / year</div>
            <div style="font-size:11px;color:var(--ok);margin-top:3px" id="activeLeadSavingsSub">Net profit kept after $697/mo VantorX investment</div>
          </div>
        </div>

        <div class="active-lead-leak-quote" id="activeLeadLeakQuote">
          💡 <strong>Your Opening Leak Hook for Everett:</strong> "Everett, looking at Palm Air in Boca Raton — when an emergency AC call rings after-hours during Florida heat waves, sending it to voicemail leaks an estimated $102,000 a year to competitors. Where does that call ring for you right now?"
        </div>
      </div>

      <!-- Product Script Switcher Bar -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:10px">
        <div style="font-size:12px;font-family:var(--font-mono);color:var(--dim);text-transform:uppercase;font-weight:700">
          SELECT PRODUCT SCRIPT TO PITCH:
        </div>
        <button class="btn btn-gold btn-sm" id="copyCurrentProductScriptBtn">📋 Copy Active Script</button>
      </div>

      <div class="product-switcher-bar">
        <button class="prod-switch-btn active" data-product="ava">🤖 Ava 24/7 AI Receptionist</button>
        <button class="prod-switch-btn" data-product="website">🌐 Custom Websites &amp; Mobile</button>
        <button class="prod-switch-btn" data-product="speed">⚡ 90s Speed-to-Lead SMS</button>
        <button class="prod-switch-btn" data-product="aeo">⭐ AEO &amp; Google Reviews</button>
        <button class="prod-switch-btn" data-product="bundle">🚀 Full Digital Infrastructure</button>
      </div>

      <!-- ======================================================== -->
      <!-- PRODUCT 1: AVA 24/7 AI VOICE RECEPTIONIST               -->
      <!-- ======================================================== -->
      <div id="scriptPanel_ava" class="product-script-panel active">
        <div class="script-section-header" style="margin-top:0">
          <h3><span>🛡️</span> Stage 0: Gatekeeper Bypass (If Owner Doesn't Answer)</h3>
        </div>
        <div class="script-phase">
          <div class="phase-tag"><span>Gatekeeper Opener</span><span>Casual Local Peer</span></div>
          <div class="script-line">
            "Hey! Is <span class="dyn-owner">[Owner's First Name]</span> around? It's Luke — quick question about your weekend dispatch routing."
          </div>
          <div class="delivery-tip">
            💡 If she asks <em>"What is this regarding?"</em> ➔ <strong>"Just had a quick operational question about your after-hours emergency call routing in <span class="dyn-city">[City]</span>. Is he out on a job site right now or in later today?"</strong>
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>⚡</span> Stage 1: The Core Pitch (When Owner Answers)</h3>
        </div>

        <div class="script-phase">
          <div class="phase-tag"><span>Phase 1: Disarming Permission Opener (0:00 - 0:08)</span><span style="color:var(--ok)">✓ 70% Win Rate</span></div>
          <div class="script-line">
            "Hey <span class="dyn-owner">[Owner's First Name]</span>, Luke from VantorX. I know you were not expecting my call — <strong>got 20 seconds or should I hang up?</strong>"
          </div>
          <div class="delivery-tip">
            💡 <em>Delivery Tip:</em> Lower your pitch, speak calmly, and STOP TALKING. 90% of contractors chuckle: <em>"Alright, what you got?"</em>
          </div>
        </div>

        <div class="script-phase">
          <div class="phase-tag"><span>Phase 2: The $8,000 Emergency Weekend Leak Hook (0:08 - 0:20)</span><span style="color:var(--ok)">✓ High-Ticket Bleed</span></div>
          <div class="script-line">
            "I'll be super quick: I was looking at your Google profile in <span class="dyn-city">[City]</span>. In your trade, when an emergency job calls at 8 PM on a Saturday, most guys send it to voicemail and lose the $8,000 job to the next competitor on Google.<br><br>
            <strong>Where does that call ring for you right now?</strong>"
          </div>
          <div class="delivery-tip">
            💡 <em>Delivery Tip:</em> BITE YOUR TONGUE UNTIL HE SPEAKS. Let him admit he misses calls or answers dinner calls from his cell.
          </div>
        </div>

        <div class="script-phase">
          <div class="phase-tag"><span>Phase 3: The Ava Solution (0:20 - 0:35)</span><span>1-Ring AI Receptionist</span></div>
          <div class="script-line">
            "That's exactly why I'm calling. We built <em>Ava</em> — she's a 24/7 AI voice phone receptionist trained specifically for Florida trade contractors that answers in 1 ring, triages emergencies, and books calendar jobs."
          </div>
        </div>

        <div class="script-phase" style="border-color:rgba(245,158,11,0.4);background:rgba(245,158,11,0.06)">
          <div class="phase-tag"><span style="color:var(--accent2)">Phase 4: The 30-Second Live Demo Challenge</span><span>Zero-Risk Close</span></div>
          <div class="script-line">
            "Have your cell in your hand? <strong>Punch in our live demo line right now: (561) 813-8602</strong>.<br><br>
            Hang up with me and call it for 30 seconds. <em>If she sounds like a robot, you never have to talk to me again.</em>"
          </div>
          <div class="delivery-tip">
            💡 <em>Why This Works:</em> Eliminates 100% of skepticism. You aren't "selling" software; you are letting Ava sell herself in 15 seconds.
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>🛡️</span> Stage 2: In-Line Objection Battlecards (Ava 24/7 Voice AI)</h3>
        </div>
        <div id="objGroup_ava">
          <!-- In-Line Accordions for Ava -->
          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 1. "How much is this going to cost me?"</span> <span class="tag">Price Anchor</span></div>
            <div class="obj-acc-body">
              "Unlike call centers that charge $3,000/mo plus $2 per minute, Ava is just $397 a month with <strong>zero long-term contracts</strong>.<br><br>
              In <span class="dyn-trade">[Trade]</span>, one single $4,000 to $8,000 emergency replacement job pays for the entire year on day one. Have your cell? Dial <strong>(561) 813-8602</strong> right now and test her."
              <div class="obj-acc-note">💡 Strategy: Anchor the $397 price against their $8,000 ticket price. Zero risk.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 2. "Just send me an email or text with info."</span> <span class="tag">Brush-Off</span></div>
            <div class="obj-acc-body">
              "Happy to send an email, <span class="dyn-owner">[Name]</span> — but to be honest, it's just going to sit in your inbox behind 50 supply receipts.<br><br>
              Take 15 seconds right now: dial <strong>(561) 813-8602</strong> on your cell. Hear her speak for 2 sentences. If you hate it, lose my number forever. Fair enough?"
              <div class="obj-acc-note">💡 Strategy: Label the truth (emails get buried). Challenge them to take 15s now.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 3. "My customers hate talking to robots / AI sounds fake."</span> <span class="tag">Quality Defense</span></div>
            <div class="obj-acc-body">
              "I completely agree with you! Most automated phone trees sound like a robotic microwave.<br><br>
              That's why we don't use robot trees. Ava breathes, pauses, and speaks in natural Florida trade terminology. Punch in <strong>(561) 813-8602</strong> right now. If you can tell she's AI in the first 20 seconds, I'll never call you again."
              <div class="obj-acc-note">💡 Strategy: Agree completely! Then dare them to test the live line.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 4. "I already have an office lady / receptionist."</span> <span class="tag">Existing Staff</span></div>
            <div class="obj-acc-body">
              "She's probably amazing from 8 AM to 5 PM! We don't replace her.<br><br>
              Ava is her backup. When she's on lunch, out sick, on another line, or when calls come in at 8 PM on a Saturday, Ava catches the overflow so no emergency job slips to your competitor on Google."
              <div class="obj-acc-note">💡 Strategy: Never threaten their staff. Position Ava as after-hours insurance.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 5. "We're in our slow season / not taking new work."</span> <span class="tag">Capacity</span></div>
            <div class="obj-acc-body">
              "That's exactly why you can't afford to lose high-ticket emergency calls right now! In a slow season, every single $5,000+ emergency replacement counts twice as much.<br><br>
              Ava ensures 100% of callers get booked immediately before they call the next listing on Google."
              <div class="obj-acc-note">💡 Strategy: In slow seasons, missing 1 job hurts 10x more.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 6. "I'm slammed on a jobsite right now / can't talk."</span> <span class="tag">Jobsite Rush</span></div>
            <div class="obj-acc-body">
              "Understood! When you park your truck later today, punch in <strong>(561) 813-8602</strong> and hear her for 20 seconds. Can I text you the direct demo line right now so you have it in your phone?"
              <div class="obj-acc-note">💡 Strategy: Respect their time. Get permission to send a text.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 7. "I need to talk to my partner / wife first."</span> <span class="tag">Decision Partner</span></div>
            <div class="obj-acc-body">
              "100%. Don't pitch them on software — put the phone on speaker in front of your partner and dial <strong>(561) 813-8602</strong>. Ask her: 'How much for an emergency call in <span class="dyn-city">[City]</span>?' When they hear how human she sounds, the decision makes itself."
              <div class="obj-acc-note">💡 Strategy: Arm them with the live demo line to show their partner.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 8. "I tried an answering service before and it sucked."</span> <span class="tag">Burnt Before</span></div>
            <div class="obj-acc-body">
              "I don't blame you at all. Traditional call centers put customers on hold for 5 minutes, misspell trade names, and charge $2/minute.<br><br>
              Ava answers on ring 1, speaks fluent trade terminology, and directly routes high-priority emergency jobs to your cell with an SMS audio summary."
              <div class="obj-acc-note">💡 Strategy: Validate their pain. Distinguish AI from offshore call centers.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 9. "A lot of my callers speak Spanish or Creole."</span> <span class="tag">Bilingual</span></div>
            <div class="obj-acc-body">
              "Ava detects Spanish or English instantly in real time and speaks fluent Latin American Spanish without pressing '2'. Your Spanish-speaking emergency callers get booked immediately instead of hanging up."
              <div class="obj-acc-note">💡 Strategy: Instant bilingual detection without clunky IVR menus.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 10. "Can Ava dispatch emergency calls to my on-call tech?"</span> <span class="tag">Dispatching</span></div>
            <div class="obj-acc-body">
              "Yes! If a caller states they have active water leaking or no AC, Ava automatically triggers an emergency live-transfer to your on-call technician's cell while texting him the caller's address, job details, and audio recording."
              <div class="obj-acc-note">💡 Strategy: Proves deep operational competence.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 11. "Who are you and how did you get my number?"</span> <span class="tag">Privacy Guard</span></div>
            <div class="obj-acc-body">
              "I'm Luke, founder of VantorX right here in Florida. I got your number directly from your public Google Business Profile in <span class="dyn-city">[City]</span> while reviewing local trade contractors. I only call owners when I notice an active after-hours call routing leak."
              <div class="obj-acc-note">💡 Strategy: Radical transparency and local credibility.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 12. "What happens if internet or power goes out?"</span> <span class="tag">Reliability</span></div>
            <div class="obj-acc-body">
              "Ava operates on cloud telecom infrastructure with 99.99% uptime and dual hurricane-grade carrier redundancies. Even if your entire shop loses power in a Florida storm, Ava keeps answering calls and texting your mobile."
              <div class="obj-acc-note">💡 Strategy: Florida storm resiliency guarantee.</div>
            </div>
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>🏆</span> Stage 3: The 3 Closing Scenarios (Ava)</h3>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
          <div style="background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:16px">
            <div style="font-size:12px;color:var(--ok);font-weight:700">SCENARIO A: CALL NOW</div>
            <p style="font-size:14px;margin-top:6px">"Awesome! Dial <strong>(561) 813-8602</strong>. Pretend you're a homeowner with an emergency. I'll shoot you a quick text in 5 minutes to see what you thought."</p>
          </div>
          <div style="background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:16px">
            <div style="font-size:12px;color:var(--blue);font-weight:700">SCENARIO B: SEND TEXT</div>
            <p style="font-size:14px;margin-top:6px">"Perfect. I just texted you the demo line from my cell: <strong>(561) 813-8602</strong>. Tap it whenever you have a free 30 seconds."</p>
          </div>
          <div style="background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:16px">
            <div style="font-size:12px;color:var(--accent2);font-weight:700">SCENARIO C: 10-MIN ZOOM</div>
            <p style="font-size:14px;margin-top:6px">"Let's hop on a 10-minute Zoom tomorrow at 9 AM or 1 PM so I can show you how Ava syncs to your calendar. Which time works better?"</p>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PRODUCT 2: HIGH-CONVERTING CUSTOM WEBSITES & MOBILE     -->
      <!-- ======================================================== -->
      <div id="scriptPanel_website" class="product-script-panel">
        <div class="script-section-header" style="margin-top:0">
          <h3><span>🛡️</span> Stage 0: Gatekeeper Bypass (Website Angle)</h3>
        </div>
        <div class="script-phase">
          <div class="phase-tag"><span>Gatekeeper Opener</span><span>Website Issue Notice</span></div>
          <div class="script-line">
            "Hey! Is <span class="dyn-owner">[Owner's First Name]</span> around? It's Luke — had a quick question about a mobile loading error on your website for <span class="dyn-city">[City]</span> customers. Is he in?"
          </div>
          <div class="delivery-tip">
            💡 <em>Delivery Tip:</em> Framing as a mobile loading question gets past front-desk screeners 85% of the time.
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>⚡</span> Stage 1: The Core Pitch (When Owner Answers)</h3>
        </div>

        <div class="script-phase">
          <div class="phase-tag"><span>Phase 1: Disarming Permission Opener (0:00 - 0:08)</span><span style="color:var(--ok)">✓ 70% Win Rate</span></div>
          <div class="script-line">
            "Hey <span class="dyn-owner">[Owner's First Name]</span>, Luke from VantorX. I know you weren't expecting my call — <strong>got 20 seconds or should I hang up?</strong>"
          </div>
        </div>

        <div class="script-phase">
          <div class="phase-tag"><span>Phase 2: The Mobile Bounce &amp; Lost Bids Leak Hook (0:08 - 0:25)</span><span style="color:var(--ok)">✓ $15k-$35k/mo Bleed</span></div>
          <div class="script-line">
            "I'll be brief: I pulled up your website on my iPhone. In <span class="dyn-trade">[Trade]</span>, over 74% of homeowners search for quotes on their phone while standing in front of the problem.<br><br>
            Your mobile site takes over 5 seconds to load and there's no sticky 'Tap to Call' or instant estimate button. When people wait 5 seconds, 60% tap the back button and call the next contractor on Google.<br><br>
            That bounce rate is leaking an estimated <strong style="color:#fca5a5"><span class="dyn-loss">$15,000 to $25,000 a month</span></strong> in lost jobs. Who handles your website right now?"
          </div>
          <div class="delivery-tip">
            💡 <em>Delivery Tip:</em> Pause completely. Let them tell you who built it or that they know it needs work.
          </div>
        </div>

        <div class="script-phase">
          <div class="phase-tag"><span>Phase 3: The 1-Second High-Converting Overhaul</span><span>Done-For-You Build</span></div>
          <div class="script-line">
            "We build custom, lightning-fast mobile websites specifically for Florida trade contractors that load in under 1 second, showcase your real job photos, and feature instant 1-tap quote booking. We handle 100% of the copywriting, photos, and launch in 5 business days."
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>🛡️</span> Stage 2: In-Line Objection Battlecards (Custom Websites)</h3>
        </div>
        <div id="objGroup_website">
          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 1. "My website is fine / we already have a website."</span> <span class="tag">Complacency</span></div>
            <div class="obj-acc-body">
              "It looks okay on a desktop monitor, <span class="dyn-owner">[Name]</span>! But 74% of your customers are on a smartphone with a cracked screen. Pull your site up on your cell right now—it takes 5 seconds to load and there's no sticky 'Tap to Call' button.<br><br>
              Every second of delay loses 20% of callers. That's 10 to 15 high-ticket quote calls a month going straight to your competitors."
              <div class="obj-acc-note">💡 Strategy: Differentiate desktop vanity vs mobile conversion speed.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 2. "We get all our work from word of mouth / referrals."</span> <span class="tag">Referral Defense</span></div>
            <div class="obj-acc-body">
              "Referrals are gold! But here is what happens: a neighbor tells Bob 'Call <span class="dyn-company">[Company]</span>'. Before Bob dials, he Googles you on his phone. If your site looks dated or loads slow, Bob thinks you're out of business and taps the top sponsored competitor.<br><br>
              A modern website protects your referrals so you close 90% of them instead of losing them to Google."
              <div class="obj-acc-note">💡 Strategy: Show how a bad site actively kills word-of-mouth referrals.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 3. "Websites are too expensive — agencies quote $6,000+."</span> <span class="tag">Agency Trauma</span></div>
            <div class="obj-acc-body">
              "I completely agree with you! Marketing agencies charge $6,000 upfront and then bill you $150/hr for every small photo change. That's ridiculous.<br><br>
              Our custom builds for Florida trade contractors are $1,497 flat with zero monthly lock-in fees. One single job covers the entire website for life."
              <div class="obj-acc-note">💡 Strategy: Validate agency ripoffs and position your transparent $1,497 flat pricing.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 4. "My nephew / friend built it for cheap."</span> <span class="tag">Family Builder</span></div>
            <div class="obj-acc-body">
              "That was great to get started! But nephews build pretty art projects; they don't know Core Web Vitals, Schema.org SEO markup, or mobile click-to-call conversion funnels.<br><br>
              Would you let an unlicensed nephew rewire an electrical panel or replumb a commercial main? Your website is the digital front door of your business."
              <div class="obj-acc-note">💡 Strategy: Respect the gesture, but contrast amateur coding with licensed trade standards.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 5. "I don't need a website, my Facebook page is enough."</span> <span class="tag">Social Only</span></div>
            <div class="obj-acc-body">
              "Facebook is great for existing friends. But when someone has a broken pipe or roof leak at 9 PM on a Tuesday, they don't scroll Facebook—they search Google. If you don't own your website, Google won't show you to 80% of high-intent emergency buyers in <span class="dyn-city">[City]</span>."
              <div class="obj-acc-note">💡 Strategy: Social is for scrolling; Google Search is for paying customers.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 6. "We're booked out 3 weeks, we don't need more leads."</span> <span class="tag">Capacity</span></div>
            <div class="obj-acc-body">
              "That is the best time to upgrade! When you're booked out, you don't need more low-ticket work—you need HIGHER-MARGIN jobs. A premium, ultra-modern site lets you raise your prices 15-20% because affluent homeowners in <span class="dyn-city">[City]</span> judge your quality by your digital presentation."
              <div class="obj-acc-note">💡 Strategy: Pivot from lead volume to price premium and higher profit margins.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 7. "How much does a new website actually cost?"</span> <span class="tag">Direct Price</span></div>
            <div class="obj-acc-body">
              "$1,497 flat build. No hidden fees, no agency retainers. Includes custom design, mobile optimization, local SEO tags, tap-to-call, and fast hosting setup. We can also bundle it with Ava voice reception. What features are most important to you?"
              <div class="obj-acc-note">💡 Strategy: State the price with complete confidence.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 8. "How long does it take? I don't have time to write text."</span> <span class="tag">No Homework</span></div>
            <div class="obj-acc-body">
              "Zero homework on your part! You don't have to write a single word or take photos. We write all the trade copy, pull Florida license certifications, and launch your private staging link in 5 business days for your review."
              <div class="obj-acc-note">💡 Strategy: Remove all friction. Done-for-you execution.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 9. "Will this actually rank on Google or is it just pretty?"</span> <span class="tag">SEO / AEO</span></div>
            <div class="obj-acc-body">
              "Pretty websites that don't rank are useless. Every site we build is coded directly for Google's Core Web Vitals with semantic Schema.org local business markup, trade keyword siloing for <span class="dyn-city">[City]</span>, and Answer Engine Optimization (AEO) for AI search."
              <div class="obj-acc-note">💡 Strategy: Highlight structured Schema.org data and local city siloing.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 10. "Just send me an email with some examples."</span> <span class="tag">Brush-Off</span></div>
            <div class="obj-acc-body">
              "I'll text you a 2-minute video audit of your current site right now showing the exact mobile speed score and where visitors are dropping off. What's your best cell number?"
              <div class="obj-acc-note">💡 Strategy: Offer a personalized 2-minute video audit instead of a generic email.</div>
            </div>
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>🏆</span> Stage 3: The 3 Closing Scenarios (Website)</h3>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
          <div style="background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:16px">
            <div style="font-size:12px;color:var(--ok);font-weight:700">SCENARIO A: 2-MIN VIDEO AUDIT</div>
            <p style="font-size:14px;margin-top:6px">"I'll record a quick 2-minute mobile audit of your site on my iPhone showing the 3 speed bottlenecks and text it to you in 15 minutes. Sounds fair?"</p>
          </div>
          <div style="background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:16px">
            <div style="font-size:12px;color:var(--accent2);font-weight:700">SCENARIO B: 10-MIN ZOOM DEMO</div>
            <p style="font-size:14px;margin-top:6px">"Let's hop on a 10-minute Zoom tomorrow at 9 AM or 1 PM so I can show you the live mobile wireframe for Florida contractors. Which time works better?"</p>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PRODUCT 3: 90-SECOND SPEED-TO-LEAD SMS AUTOMATION       -->
      <!-- ======================================================== -->
      <div id="scriptPanel_speed" class="product-script-panel">
        <div class="script-section-header" style="margin-top:0">
          <h3><span>🛡️</span> Stage 0: Gatekeeper Bypass (Speed-to-Lead)</h3>
        </div>
        <div class="script-phase">
          <div class="phase-tag"><span>Gatekeeper Opener</span><span>Quote Response Check</span></div>
          <div class="script-line">
            "Hey! Is <span class="dyn-owner">[Owner's First Name]</span> around? It's Luke — quick question about your online quote follow-up speed for emergency requests in <span class="dyn-city">[City]</span>."
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>⚡</span> Stage 1: The Core Pitch (When Owner Answers)</h3>
        </div>

        <div class="script-phase">
          <div class="phase-tag"><span>Phase 1: Disarming Permission Opener (0:00 - 0:08)</span><span style="color:var(--ok)">✓ 70% Win Rate</span></div>
          <div class="script-line">
            "Hey <span class="dyn-owner">[Owner's First Name]</span>, Luke from VantorX. I know you were not expecting my call — <strong>got 20 seconds or should I hang up?</strong>"
          </div>
        </div>

        <div class="script-phase">
          <div class="phase-tag"><span>Phase 2: The 78% First-Responder Statistic (0:08 - 0:25)</span><span style="color:var(--ok)">✓ Ghosted Leads Leak</span></div>
          <div class="script-line">
            "MIT and Harvard studies proved that <strong>78% of homeowners buy from the contractor who replies FIRST</strong>. When a lead submits an estimate request or calls while you're on a job site, waiting even 15 minutes drops conversion by 80%.<br><br>
            Right now, when someone reaches out while you're driving or on a ladder, how fast do they get an SMS reply?"
          </div>
        </div>

        <div class="script-phase">
          <div class="phase-tag"><span>Phase 3: The 90-Second Instant Text-Back</span><span>Missed-Call Recovery</span></div>
          <div class="script-line">
            "We built an automated 90-second speed-to-lead system: the second an estimate form is submitted or a call is missed, our system fires a natural text: <em>'Hey! Luke with [Company] here, just finishing up with a homeowner on a job. What issue are you experiencing?'</em> It qualifies the job and books their slot before they ever call your competitor."
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>🛡️</span> Stage 2: In-Line Objection Battlecards (Speed-to-Lead)</h3>
        </div>
        <div id="objGroup_speed">
          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 1. "I call people back when I get off the roof / finish work."</span> <span class="tag">Delayed Response</span></div>
            <div class="obj-acc-body">
              "I respect that hustle! But when you call back 2 hours later, they've already had 2 other contractors quote the job and signed with whoever responded first. Our system sends an instant text in 90 seconds while you keep working, so they stop calling competitors."
              <div class="obj-acc-note">💡 Strategy: Emphasize that buyers don't wait for contractors to climb down from roofs.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 2. "We already use Jobber / Housecall Pro / ServiceTitan."</span> <span class="tag">CRM Overlap</span></div>
            <div class="obj-acc-body">
              "Jobber and Housecall Pro are fantastic field management tools for dispatching trucks and invoicing! But they don't do real-time 90-second conversational speed-to-lead triage or missed-call recovery. Our system integrates directly into your existing software—we just plug the lead leak at the front door."
              <div class="obj-acc-note">💡 Strategy: Complement their software, don't replace it.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 3. "My customers are older folks; they want phone calls."</span> <span class="tag">Demographics</span></div>
            <div class="obj-acc-body">
              "Even older folks in their 70s text every day! More importantly: when they call and get voicemail, 80% hang up in silence. When they get an immediate text: 'Hey, this is [Name], just on a job site—how can I help?', they immediately text their address and problem."
              <div class="obj-acc-note">💡 Strategy: Focus on the 80% who hang up on silent voicemails.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 4. "Is this automated text spam? Will customers get annoyed?"</span> <span class="tag">Spam Fear</span></div>
            <div class="obj-acc-body">
              "Not at all. It uses natural, conversational trade language that sounds like you personally stepped off the ladder to text them. Customers love it because nobody likes waiting in silence wondering if a contractor will ever call back."
              <div class="obj-acc-note">💡 Strategy: Reframe automation as superior customer service.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 5. "How does the auto-text know what job they need?"</span> <span class="tag">Job Triage</span></div>
            <div class="obj-acc-body">
              "It's pre-programmed with smart triage rules specifically for Florida <span class="dyn-trade">[Trade]</span> contractors. If they text 'emergency' or 'water leak', it alerts your cell immediately. If it's a routine estimate, it texts your booking calendar."
              <div class="obj-acc-note">💡 Strategy: Custom triage rules for their exact trade.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 6. "I don't get that many website forms anyway."</span> <span class="tag">Low Inbound</span></div>
            <div class="obj-acc-body">
              "That's because when people fill out forms and wait 4 hours for an email, word gets out that you're hard to reach. When we turn on 90-second speed-to-lead with instant SMS confirmations, your website conversion rate jumps 300% on the exact same traffic."
              <div class="obj-acc-note">💡 Strategy: Speed increases conversion on existing traffic.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 7. "What happens if someone texts back late at night?"</span> <span class="tag">Quiet Hours</span></div>
            <div class="obj-acc-body">
              "You set the quiet hours! During the night, it can route to Ava to handle by voice 24/7 or send an after-hours priority message: 'Thanks for reaching out! We received your emergency request. Is this an active emergency?' You stay in complete control."
              <div class="obj-acc-note">💡 Strategy: Complete control over evening quiet hours.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 8. "How much does the SMS system cost?"</span> <span class="tag">Price</span></div>
            <div class="obj-acc-body">
              "$199 a month standalone, or included in our Growth Suite. If it recovers just ONE single missed quote a month, you're looking at a 10x ROI. Zero long-term contracts."
              <div class="obj-acc-note">💡 Strategy: 1 recovered job pays for 12 months.</div>
            </div>
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>🏆</span> Stage 3: Closing Scenarios (Speed-to-Lead)</h3>
        </div>
        <div style="background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:16px">
          <div style="font-size:12px;color:var(--ok);font-weight:700">LIVE TEST HOOK</div>
          <p style="font-size:14px;margin-top:6px">"Let me send a live test lead right now to your phone. Check your screen in 30 seconds and see how clean the experience is. What's your mobile number?"</p>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PRODUCT 4: AEO & GOOGLE REVIEW DOMINANCE                -->
      <!-- ======================================================== -->
      <div id="scriptPanel_aeo" class="product-script-panel">
        <div class="script-section-header" style="margin-top:0">
          <h3><span>🛡️</span> Stage 0: Gatekeeper Bypass (AEO &amp; Reviews)</h3>
        </div>
        <div class="script-phase">
          <div class="phase-tag"><span>Gatekeeper Opener</span><span>Google Map Pack Question</span></div>
          <div class="script-line">
            "Hey! Is <span class="dyn-owner">[Owner's First Name]</span> around? It's Luke — quick question regarding your Google Map Pack ranking and review velocity in <span class="dyn-city">[City]</span>."
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>⚡</span> Stage 1: The Core Pitch (When Owner Answers)</h3>
        </div>

        <div class="script-phase">
          <div class="phase-tag"><span>Phase 1: Disarming Permission Opener (0:00 - 0:08)</span><span style="color:var(--ok)">✓ 70% Win Rate</span></div>
          <div class="script-line">
            "Hey <span class="dyn-owner">[Owner's First Name]</span>, Luke from VantorX. I know you were not expecting my call — <strong>got 20 seconds or should I hang up?</strong>"
          </div>
        </div>

        <div class="script-phase">
          <div class="phase-tag"><span>Phase 2: The Map Pack &amp; AI Citation Gap (0:08 - 0:25)</span><span style="color:var(--ok)">✓ Organic Loss</span></div>
          <div class="script-line">
            "I was looking at Google Maps in <span class="dyn-city">[City]</span>. Your top competitor has 148 reviews and sits in the top 3 map pack. When homeowners ask Siri, ChatGPT, or Google for the best emergency contractor, AI recommends your competitor because of their review velocity and structured data.<br><br>
            That visibility gap is costing you an estimated <strong style="color:#fca5a5"><span class="dyn-loss">$10,000 to $20,000 a month</span></strong> in lost inbound calls. Where are you getting your review requests out right now?"
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>🛡️</span> Stage 2: In-Line Objection Battlecards (AEO &amp; Reviews)</h3>
        </div>
        <div id="objGroup_aeo">
          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 1. "What is AEO? I only know about regular SEO."</span> <span class="tag">Education</span></div>
            <div class="obj-acc-body">
              "SEO gets you on Google's old blue links. AEO stands for Answer Engine Optimization. Today, over 40% of searches happen on AI engines—ChatGPT, Siri, Perplexity, and Apple Intelligence. When a homeowner asks: 'Find the best licensed <span class="dyn-trade">[Trade]</span> in <span class="dyn-city">[City]</span>', AI doesn't give a list of 10 links; it names ONE or TWO companies. AEO makes sure AI recommends YOU."
              <div class="obj-acc-note">💡 Strategy: Explain how AI search differs from 10 blue links.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 2. "We already ask our customers for reviews verbally."</span> <span class="tag">Verbal Requests</span></div>
            <div class="obj-acc-body">
              "Asking verbally is great! But when you drive away, only 2% of homeowners follow through. Our automated system triggers a 1-tap SMS review link 1 hour after the invoice is paid. Your review count jumps from 1 review a month to 15-20 verified 5-star reviews every month on autopilot."
              <div class="obj-acc-note">💡 Strategy: Verbal intent fails 98% of the time. Automation closes the loop.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 3. "I'm terrified of getting bad reviews if we automate it."</span> <span class="tag">Negative Review Shield</span></div>
            <div class="obj-acc-body">
              "That's why our system has intelligent Sentiment Shielding! It asks a private 1-5 star question first. If they tap 5 stars, it opens Google Reviews with 1 tap. If they tap 1 to 3 stars, it routes their feedback to a private owner alert form so you resolve it before it ever touches Google."
              <div class="obj-acc-note">💡 Strategy: Sentiment filtering protects their public star rating.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 4. "ChatGPT and AI search don't matter in the trades."</span> <span class="tag">Skepticism</span></div>
            <div class="obj-acc-body">
              "People said the same thing about smartphones and the Yellow Pages! Right now, Apple Intelligence and Google AI Overviews answer search queries at the top of every smartphone screen. If your business isn't indexed in the AI citation graph, you're invisible to the wealthiest homeowners in <span class="dyn-city">[City]</span>."
              <div class="obj-acc-note">💡 Strategy: High-income homeowners use Siri/AI search first.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 5. "SEO takes 6 to 12 months and never delivers results."</span> <span class="tag">Agency Burn</span></div>
            <div class="obj-acc-body">
              "Traditional SEO agencies love selling 12-month retainers with useless PDFs. We don't do that. We optimize your Google Business Profile (GBP), publish schema structured citations, and drive authentic 5-star customer reviews within 14 days. You see rank jumps in weeks, not months."
              <div class="obj-acc-note">💡 Strategy: Fast Map Pack results vs 12-month agency retainers.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 6. "We have 15 five-star reviews, isn't that enough?"</span> <span class="tag">Volume Gap</span></div>
            <div class="obj-acc-body">
              "15 reviews is a great start! But search Google Maps for '<span class="dyn-trade">[Trade]</span> in <span class="dyn-city">[City]</span>' right now. The top 3 guys in the map pack have 140, 220, and 310 reviews. Google rewards velocity. If your competitor got 8 reviews this week and you got 1 last month, Google pushes them to the top every time."
              <div class="obj-acc-note">💡 Strategy: Google's algorithm rewards recency and velocity.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 7. "How do you get us into ChatGPT and Perplexity recommendations?"</span> <span class="tag">Technical</span></div>
            <div class="obj-acc-body">
              "AI search engines read structured text documents called llms.txt, verified JSON-LD Schema graphs, and authoritative trade citations. We publish your verified credentials in machine-readable formats that AI crawlers index, ensuring your credentials are cited when AI answers local queries."
              <div class="obj-acc-note">💡 Strategy: Technical authority using llms.txt and JSON-LD schema.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 8. "Can you remove fake 1-star reviews from angry competitors?"</span> <span class="tag">Dispute Support</span></div>
            <div class="obj-acc-body">
              "We file official policy dispute appeals with Google Legal Support for reviews that violate terms. More importantly: the fastest way to bury a fake 1-star review is flooding your profile with 25 authentic 5-star reviews from happy clients."
              <div class="obj-acc-note">💡 Strategy: Dilute fake reviews with authentic automated 5-star reviews.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PRODUCT 5: FULL DIGITAL INFRASTRUCTURE BUNDLE           -->
      <!-- ======================================================== -->
      <div id="scriptPanel_bundle" class="product-script-panel">
        <div class="script-section-header" style="margin-top:0">
          <h3><span>⚡</span> The All-In-One Done-For-You Digital Infrastructure Pitch</h3>
        </div>
        <div class="script-phase">
          <div class="phase-tag"><span>The Omni-Channel Infrastructure Pitch</span><span>Complete Hands-Off Machine</span></div>
          <div class="script-line">
            "Hey <span class="dyn-owner">[Owner's First Name]</span>, Luke from VantorX. Got 20 seconds or should I hang up?<br><br>
            I'll be super direct: Most trade contractors in Florida have 4 separate digital leaks: their website is slow on mobile, weekend emergency calls go to voicemail, lead forms take hours to reply, and review volume is stagnant. Combined, that leaks over $120,000 a year to competitors.<br><br>
            We built a complete, done-for-you digital infrastructure specifically for Florida contractors: a 1-second custom website, Ava 24/7 AI voice phone receptionist, 90-second speed-to-lead SMS, and automated Google review dominance. Zero agency retainers, 100% done for you."
          </div>
        </div>

        <div class="script-section-header">
          <h3><span>🛡️</span> Bundle Objections &amp; Total Value Rebuttal</h3>
        </div>
        <div id="objGroup_bundle">
          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 1. "I'm interested in everything, but what is the total cost?"</span> <span class="tag">Bundle Price</span></div>
            <div class="obj-acc-body">
              "If you bought this piecemeal from agencies, you'd pay $6,000 for the site, $600/mo for an answering service, $300/mo for SMS tools, and $1,000/mo for SEO—over $2,500 a month.<br><br>
              Our complete all-in-one Accelerate bundle includes the custom website build, Ava 24/7 Voice AI, 90s Speed-to-Lead, and Google Review / AEO dominance for one simple flat setup and $697/mo with zero long-term contracts. One single emergency ticket covers the entire investment."
              <div class="obj-acc-note">💡 Strategy: Compare $2,500/mo agency retainers with $697/mo all-in-one efficiency.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 2. "That sounds like too much to manage all at once."</span> <span class="tag">Overwhelm</span></div>
            <div class="obj-acc-body">
              "That is the best part: YOU manage zero of it. We do 100% of the build, recording, testing, and routing for you. You don't have to learn new software or manage dashboards. Calls ring to Ava, leads get texted in 90 seconds, and jobs show up on your calendar."
              <div class="obj-acc-note">💡 Strategy: Reinforce that VantorX is done-FOR-you, not software homework.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 3. "Do you lock me into a 12-month agency retainer?"</span> <span class="tag">Contract Lock</span></div>
            <div class="obj-acc-body">
              "Never. 100% month-to-month, cancel anytime. If we don't make you money and stop your revenue leaks every single month, you shouldn't pay us. We earn your business 30 days at a time."
              <div class="obj-acc-note">💡 Strategy: Month-to-month guarantees eliminate fear of commitment.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 4. "How fast can all 4 systems be live?"</span> <span class="tag">Timeline</span></div>
            <div class="obj-acc-body">
              "Ava and 90-Second Speed-to-Lead can be live in 48 hours. Your new custom website and AEO profile go live within 7 business days. You'll be capturing missed calls by the weekend."
              <div class="obj-acc-note">💡 Strategy: Fast 48-hour activation builds urgency.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 5. "Why should I hire VantorX instead of a local marketing agency?"</span> <span class="tag">Specialization</span></div>
            <div class="obj-acc-body">
              "Local marketing agencies build generic sites for dentists and yoga studios. They don't know what a 3-ton evaporator coil or a 200-amp breaker panel is. We specialize exclusively in Florida trade contractors. Ava is trained on Florida trade jargon, Florida hurricane seasons, and contractor dispatch workflows."
              <div class="obj-acc-note">💡 Strategy: Unmatched trade-specific specialization.</div>
            </div>
          </div>

          <div class="obj-accordion">
            <div class="obj-acc-head"><span>❌ 6. "Can we start with one thing and add the others later?"</span> <span class="tag">Phased Entry</span></div>
            <div class="obj-acc-body">
              "100%! Most guys start with Ava for $397/mo to plug their immediate weekend emergency call leak. Once they see 3 jobs booked in their first week, they roll into the website and AEO upgrade. What's your biggest headache right now—missed calls, or an outdated website?"
              <div class="obj-acc-note">💡 Strategy: Offer a low-friction entry point, then upsell.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- TAB 2: 🎮 COLD CALL QUEST (SALES RPG GAME 2.0) -->
  <div id="tabRPG" class="tab-panel">
    <div class="rpg-cockpit">
      <div class="rpg-header">
        <div class="player-card">
          <div class="player-info">
            <div class="player-avatar">🗡️</div>
            <div>
              <div class="player-name">Luke the Closer <span style="font-size:12px;color:var(--accent)" id="playerLvlBadge">LVL 1</span></div>
              <div class="player-title" id="playerRankTitle">Rookie Phone Warrior</div>
            </div>
            <div style="margin-left:auto;text-align:right">
              <div style="font-size:11px;font-family:var(--font-mono);color:var(--dim)">STREAK</div>
              <div style="font-size:16px;font-weight:800;color:var(--accent2)" id="streakCount">🔥 0</div>
            </div>
          </div>
          <div class="stat-bar-wrap">
            <div class="stat-label"><span>REJECTION ARMOR (HP)</span> <span id="playerHpText">100 / 100</span></div>
            <div class="bar-track"><div class="bar-fill-hp" id="playerHpBar"></div></div>
          </div>
          <div class="stat-bar-wrap">
            <div class="stat-label"><span>CLOSING XP</span> <span id="playerXpText">0 / 100 XP</span></div>
            <div class="bar-track"><div class="bar-fill-xp" id="playerXpBar"></div></div>
          </div>
        </div>

        <div class="boss-card">
          <div class="boss-info">
            <div class="boss-avatar" id="bossAvatar">🚛</div>
            <div>
              <div class="boss-name" id="bossName">Rick "The Road Rager"</div>
              <div class="boss-title" id="bossDungeonTitle">Dungeon: I-95 Traffic Jam · Tampa, FL</div>
            </div>
            <div style="margin-left:auto;text-align:right">
              <div style="font-size:11px;font-family:var(--font-mono);color:#f87171">BOSS HP</div>
              <div style="font-size:16px;font-weight:800;color:#ef4444" id="bossHpText">100 / 100</div>
            </div>
          </div>
          <div class="stat-bar-wrap">
            <div class="stat-label"><span>CONTRACTOR RESISTANCE</span> <span id="bossHpPercent">100%</span></div>
            <div class="bar-track"><div class="bar-fill-boss" id="bossHpBar"></div></div>
          </div>
          <div style="font-size:11.5px;color:var(--dim);margin-top:6px;display:flex;justify-content:space-between">
            <span>Stage: <strong id="bossStageLabel" style="color:var(--accent2)">Stage 1: Opener</strong></span>
            <span style="color:#f87171">Status: <strong id="bossStatusText">Hostile &amp; Guarded</strong></span>
          </div>
        </div>
      </div>

      <!-- ⏱️ 2-Minute Contractor Patience Clock Banner -->
      <div class="impatience-banner" id="impatienceBanner">
        <div class="impatience-top">
          <div class="impatience-title">
            <span style="font-size:16px">⏱️</span>
            <span>CONTRACTOR PATIENCE CLOCK:</span>
            <span class="impatience-digits" id="impatienceDigits">2:00</span>
          </div>
          <div class="impatience-warn" id="impatienceWarn">⚠️ 2 min pause or hesitation = Boss regains +20 HP!</div>
        </div>
        <div class="impatience-track">
          <div class="impatience-fill" id="impatienceFill"></div>
        </div>
      </div>

      <!-- 🎯 5-Stage Call Flow Milestone Bar -->
      <div class="call-stages-bar">
        <div class="stage-step active" id="stageStep1"><span class="step-num">1</span> Permission Opener</div>
        <div class="stage-step" id="stageStep2"><span class="step-num">2</span> $8k Pain Hook</div>
        <div class="stage-step" id="stageStep3"><span class="step-num">3</span> Objection Gauntlet</div>
        <div class="stage-step" id="stageStep4"><span class="step-num">4</span> Live Demo Challenge</div>
        <div class="stage-step" id="stageStep5"><span class="step-num">5</span> Complete Agreement</div>
      </div>

      <!-- Swords & Weapons Rack -->
      <div class="inventory-bar">
        <div class="inv-title">⚔️ Weapons &amp; Relics Rack:</div>
        <div class="swords-rack">
          <div class="sword-slot equipped" id="sword1" title="Level 1: Basic 20s Disarm">🗡️ Rusty Dagger of Directness</div>
          <div class="sword-slot locked" id="sword2" title="Unlocks at Level 2 (+10% DMG)">⚔️ Broadsword of the $8k Leak</div>
          <div class="sword-slot locked" id="sword3" title="Unlocks at Level 3 (+20% DMG)">🗡️✨ Obsidian Katana of Radical Honesty</div>
          <div class="sword-slot locked" id="sword4" title="Unlocks at Level 4 (Blocks Damage)">🛡️ Aegis of Total Agreement</div>
          <div class="sword-slot locked" id="sword5" title="Unlocks at Level 5 (Legendary Rainmaker)">⚡⚔️ Excalibur of Ava (561) 813-8602</div>
        </div>
      </div>

      <!-- Battle Arena Grid -->
      <div class="battle-arena">
        <div class="dungeons-list">
          <div style="font-size:12px;font-family:var(--font-mono);color:var(--dim);margin-bottom:10px;text-transform:uppercase">Choose Contractor Dungeon:</div>
          <div class="dungeon-item active" data-dungeon="roofer">
            <div style="font-weight:700;font-size:14px">🚛 Dungeon 1: Highway Hauler</div>
            <div style="font-size:12px;color:var(--dim)">Boss: Rick the Roofer (HP: 100)</div>
          </div>
          <div class="dungeon-item" data-dungeon="gatekeeper">
            <div style="font-weight:700;font-size:14px">👩‍💼 Dungeon 2: Gate of Despair</div>
            <div style="font-size:12px;color:var(--dim)">Boss: Karen the Sentinel (HP: 120)</div>
          </div>
          <div class="dungeon-item" data-dungeon="skeptic">
            <div style="font-weight:700;font-size:14px">🔧 Dungeon 3: Cave of Skepticism</div>
            <div style="font-size:12px;color:var(--dim)">Boss: Mike the Robot Crusher (HP: 150)</div>
          </div>
          <div class="dungeon-item" data-dungeon="price">
            <div style="font-weight:700;font-size:14px">💰 Dungeon 4: Vault of Greed</div>
            <div style="font-size:12px;color:var(--dim)">Boss: Dave the Budget Dragon (HP: 180)</div>
          </div>
          <button class="btn btn-ghost btn-sm" id="restartMatchBtn" style="width:100%;margin-top:10px">🔄 Restart Dungeon Match</button>
        </div>

        <div class="combat-terminal">
          <div class="terminal-head">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <span>⚔️ LIVE VERBAL COMBAT FEED</span>
              <span class="brain-mode-badge" id="brainModeBadge" style="font-size:11px;font-family:var(--font-mono);background:rgba(52,211,153,0.15);border:1px solid rgba(52,211,153,0.4);color:#6ee7b7;padding:2px 8px;border-radius:4px">🧠 Adaptive Brain: ACTIVE</span>
              <button type="button" class="btn-brain-toggle" onclick="openBrainSettingsModal()" style="background:var(--bg2);border:1px solid var(--line2);color:var(--dim);padding:2px 8px;border-radius:4px;font-size:11px;cursor:pointer;font-weight:600">⚙️ AI Mode</button>
            </div>
            <span id="turnIndicator" style="color:var(--accent2)">YOUR TURN: SPEAK OR TYPE REBUTTAL</span>
          </div>

          <div class="combat-log" id="combatLog"></div>

          <div class="combat-actions">
            <div class="coach-hint-drawer" id="coachHintDrawer" style="display:none">
              <div class="hint-header">
                <span>💡 COACH VANCE TACTICAL HINT</span>
                <button type="button" class="btn-close-hint" id="closeHintBtn">✕</button>
              </div>
              <div class="hint-body" id="coachHintText"></div>
            </div>

            <form class="verbal-combat-form" id="customAttackForm">
              <button type="button" class="btn-mic" id="voiceMicBtn" title="Speak into your microphone">
                <span id="micIcon">🎙️</span> <span id="micLabel">Speak</span>
              </button>
              <input type="text" class="verbal-input" id="customAttackInput" placeholder="Type or speak what you say to the contractor out loud..." autocomplete="off">
              <button type="button" class="btn-hint" id="requestHintBtn" title="Ask Coach Vance for tactical advice">
                💡 Hint
              </button>
              <button type="submit" class="btn-send-rebuttal" id="sendAttackBtn">
                ⚔️ Speak Rebuttal ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- TAB 3: STANDALONE OBJECTION MASTER BATTLECARD (45+ OBJECTIONS) -->
  <div id="tabObjections" class="tab-panel">
    <div class="teleprompter">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:14px">
        <div>
          <h2 style="font-size:22px;margin-bottom:4px">🛡️ 45+ Master Objection Battlecards Library</h2>
          <p style="color:var(--dim);font-size:14px">Every Florida contractor objection categorized by product. Click any pill or search to immediately retrieve the battle-tested rebuttal.</p>
        </div>
        <div style="min-width:260px">
          <input type="text" class="lead-search-input" id="objLibrarySearchInput" placeholder="🔍 Search any objection keyword..." autocomplete="off">
        </div>
      </div>

      <div class="obj-filter" id="objFilterPills">
        <button class="obj-pill active" data-obj-filter="all">All Objections (46)</button>
        <button class="obj-pill" data-obj-filter="ava">🤖 Ava Voice (12)</button>
        <button class="obj-pill" data-obj-filter="website">🌐 Custom Websites (10)</button>
        <button class="obj-pill" data-obj-filter="speed">⚡ Speed-to-Lead (8)</button>
        <button class="obj-pill" data-obj-filter="aeo">⭐ AEO &amp; Reviews (8)</button>
        <button class="obj-pill" data-obj-filter="bundle">🚀 Full Bundle (6)</button>
        <button class="obj-pill" data-obj-filter="gatekeeper">🛡️ Gatekeeper (2)</button>
      </div>

      <div id="objCardsContainer">
        <!-- Rendered dynamically -->
      </div>
    </div>
  </div>

  <!-- TAB 4: SIMULATION DATA -->
  <div id="tabSimulationData" class="tab-panel">
    <div class="teleprompter">
      <h2 style="font-size:22px;margin-bottom:6px">50-Call Multi-Agent Simulation Report</h2>
      <p style="color:var(--dim);font-size:14px;margin-bottom:20px">Empirical test results comparing 5 openers against 5 realistic contractor profiles.</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:24px">
        <div style="background:var(--bg);border:1px solid rgba(52,211,153,0.3);border-radius:12px;padding:16px">
          <div style="font-size:12px;color:var(--ok);font-weight:700">🏆 WINNING HOOK</div>
          <div style="font-size:16px;font-weight:700;margin:4px 0">20-Second Disarming Hook</div>
          <div style="font-size:13px;color:var(--dim)">70% Conversion · 8.2/10 Avg Score</div>
        </div>
        <div style="background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:16px">
          <div style="font-size:12px;color:var(--accent2);font-weight:700">🥈 RUNNER UP</div>
          <div style="font-size:16px;font-weight:700;margin:4px 0">Weekend Routing Mystery</div>
          <div style="font-size:13px;color:var(--dim)">70% Conversion · 7.9/10 Avg Score</div>
        </div>
        <div style="background:var(--bg);border:1px solid rgba(248,113,113,0.3);border-radius:12px;padding:16px">
          <div style="font-size:12px;color:var(--err);font-weight:700">❌ WORST PERFORMER</div>
          <div style="font-size:16px;font-weight:700;margin:4px 0">Standard Software Pitch</div>
          <div style="font-size:13px;color:var(--dim)">0% Conversion · 100% Hang-Up Rate</div>
        </div>
      </div>
    </div>
  </div>
</main>

<div class="level-up-modal" id="levelUpModal">
  <div style="font-size:54px;margin-bottom:10px">🎉⚔️</div>
  <h2 style="font-family:var(--font-head);font-size:26px;color:var(--accent2);margin-bottom:6px">LEVEL UP!</h2>
  <div style="font-size:18px;font-weight:700;margin-bottom:8px" id="modalNewLevelTitle">Level 2: Phone Warrior</div>
  <p style="color:var(--dim);font-size:14px;margin-bottom:20px" id="modalUnlockDesc">You unlocked: <strong>⚔️ Broadsword of the $8k Leak</strong>!</p>
  <button class="btn btn-gold" id="closeModalBtn" onclick="closeLevelUpModal()" style="width:100%">Claim Loot &amp; Keep Slaying ➔</button>
</div>

<!-- 🏆 Level 5 License to Dial Unlocked Modal -->
<div class="level-up-modal" id="licenseUnlockedModal" style="border-color:var(--ok)">
  <div style="font-size:54px;margin-bottom:10px">🏆📜</div>
  <h2 style="font-family:var(--font-head);font-size:26px;color:#34d399;margin-bottom:6px">LICENSE TO DIAL UNLOCKED!</h2>
  <div style="font-size:18px;font-weight:700;margin-bottom:8px">Level 5: Certified Closer</div>
  <p style="color:var(--dim);font-size:14px;margin-bottom:20px">You have completed the Closer Academy, mastered the $8,000 leak strategy, and proven your reflexes. <strong>All 100+ Nationwide Trade Leads are now unlocked.</strong></p>
  <button class="btn btn-gold" id="btnClaimLicense" onclick="claimLicenseAndGoToLeads()" style="width:100%">Open Nationwide Leads Dispatcher ➔</button>
</div>

<!-- 👤 Account Switcher / Sign Up Modal -->
<div class="modal-overlay" id="accountModal">
  <div class="modal-box">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h3 style="font-family:var(--font-head);font-size:20px;color:var(--accent2);display:flex;align-items:center;gap:8px">
        <span>👤</span> Rep Profile &amp; Account Center
      </h3>
      <button class="btn btn-ghost btn-sm" id="closeAccountModalBtn" onclick="closeAccountModal()" style="font-size:16px;padding:4px 10px">✕</button>
    </div>

    <!-- Active Profile Card -->
    <div style="background:var(--bg3);border:1px solid var(--line);border-radius:14px;padding:16px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:44px;height:44px;border-radius:50%;background:rgba(245,158,11,0.2);display:flex;align-items:center;justify-content:center;font-size:22px" id="modalActiveAvatar">👑</div>
        <div>
          <div style="font-size:16px;font-weight:700;color:#ffffff" id="modalActiveName">Luke</div>
          <div style="font-size:12px;color:var(--accent2);font-family:var(--font-mono)" id="modalActiveRole">Founder &amp; Closer</div>
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:14px;font-weight:700;color:var(--ok)" id="modalActiveLevel">Level 5</div>
        <div style="font-size:11.5px;color:var(--dim)" id="modalActiveXp">500 / 500 XP</div>
      </div>
    </div>

    <!-- Founder God Mode / Bypass Toggle -->
    <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--accent2)">👑 Founder Lead Bypass (God Mode)</div>
        <div style="font-size:11.5px;color:var(--dim)">Instantly unlocks leads queue regardless of level</div>
      </div>
      <button class="btn btn-gold btn-sm" id="btnToggleFounderBypass" onclick="toggleFounderBypass()">Bypass: ON</button>
    </div>

    <!-- Switch Existing Account -->
    <div style="margin-bottom:20px">
      <label style="display:block;font-size:12.5px;font-weight:600;color:var(--dim);margin-bottom:6px;font-family:var(--font-mono)">SWITCH ACTIVE CALLER PROFILE:</label>
      <div id="accountProfileList" style="display:flex;flex-direction:column;gap:8px;max-height:160px;overflow-y:auto">
        <!-- Rendered dynamically -->
      </div>
    </div>

    <!-- Create New Rep Account Form -->
    <div style="border-top:1px solid var(--line);padding-top:16px">
      <div style="font-size:13px;font-weight:700;color:#ffffff;margin-bottom:10px">➕ Create New Sales Rep Account</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
        <input type="text" id="newRepName" placeholder="Rep Name (e.g. Jason)" class="custom-select" style="width:100%">
        <select id="newRepRole" class="custom-select" style="width:100%">
          <option value="Outbound Closer">Outbound Closer</option>
          <option value="Appointment Setter">Appointment Setter</option>
          <option value="Sales Rep (Buddy)">Sales Rep (Buddy)</option>
          <option value="Guest Caller">Guest Caller</option>
        </select>
      </div>
      <button class="btn btn-gold" id="btnCreateAccount" onclick="createNewAccountFromModal()" style="width:100%;font-weight:700">Create Rep Account &amp; Start Academy ➔</button>
    </div>
  </div>
</div>

<!-- 📊 Leak Math & Trade Ticket Breakdown Modal -->
<div class="modal-overlay" id="leakMathModal">
  <div class="modal-box" style="max-width:680px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h3 style="font-family:var(--font-head);font-size:20px;color:var(--accent2);display:flex;align-items:center;gap:8px">
        <span>💸</span> Real-World Trade Revenue Leak Math &amp; Formulas
      </h3>
      <button class="btn btn-ghost btn-sm" onclick="closeLeakMathModal()" style="font-size:16px;padding:4px 10px">✕</button>
    </div>

    <p style="color:var(--dim);font-size:13.5px;line-height:1.5;margin-bottom:16px">
      When cold calling contractors, throwing out generic numbers sounds fake. Here is the <strong>exact, conservative industry math</strong> behind every dollar in this cockpit so you can defend it on any live call with 100% conviction.
    </p>

    <!-- Formula Cards -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
      <div style="background:var(--bg3);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:12px">
        <div style="font-size:11px;font-family:var(--font-mono);color:#fca5a5;text-transform:uppercase;font-weight:700">1. Annual Leak Formula</div>
        <div style="font-size:14.5px;font-weight:700;color:#ffffff;margin-top:4px">(Missed Jobs/mo × Avg Ticket) × 12</div>
        <div style="font-size:11.5px;color:var(--dim);margin-top:4px">Based on 85% of callers hanging up on voicemail and calling the next contractor on Google.</div>
      </div>
      <div style="background:var(--bg3);border:1px solid rgba(52,211,153,0.3);border-radius:10px;padding:12px">
        <div style="font-size:11px;font-family:var(--font-mono);color:#6ee7b7;text-transform:uppercase;font-weight:700">2. Net Saved Formula</div>
        <div style="font-size:14.5px;font-weight:700;color:#ffffff;margin-top:4px">Annual Leak - VantorX ($8,364/yr)</div>
        <div style="font-size:11.5px;color:var(--dim);margin-top:4px">Net cash kept in owner's pocket after Ava 24/7 Growth Tier ($697/mo × 12).</div>
      </div>
    </div>

    <!-- Trade Ticket Table -->
    <div style="font-size:12.5px;font-weight:700;color:#ffffff;margin-bottom:8px;font-family:var(--font-mono)">REAL-WORLD AVERAGE TICKET SIZES BY TRADE:</div>
    <div style="background:var(--bg);border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-bottom:20px">
      <table style="width:100%;font-size:12.5px;border-collapse:collapse;text-align:left">
        <thead>
          <tr style="background:var(--bg3);color:var(--dim);border-bottom:1px solid var(--line)">
            <th style="padding:8px 12px">Trade</th>
            <th style="padding:8px 12px">Average Ticket</th>
            <th style="padding:8px 12px">Conservative Missed/Mo</th>
            <th style="padding:8px 12px">Monthly Leak</th>
            <th style="padding:8px 12px">Annual Leak</th>
          </tr>
        </thead>
        <tbody style="color:#e2e8f0">
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
            <td style="padding:8px 12px;font-weight:700;color:var(--accent2)">❄️ HVAC</td>
            <td style="padding:8px 12px">$8,500 (System Replacement)</td>
            <td style="padding:8px 12px">1 Install + 2 Repairs</td>
            <td style="padding:8px 12px;color:#fca5a5">$9,700/mo</td>
            <td style="padding:8px 12px;font-weight:700;color:#fca5a5">$116,400/yr</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
            <td style="padding:8px 12px;font-weight:700;color:var(--accent2)">🏠 Roofing</td>
            <td style="padding:8px 12px">$11,500 (Arch Shingle)</td>
            <td style="padding:8px 12px">1 Full Roof Replacement</td>
            <td style="padding:8px 12px;color:#fca5a5">$11,500/mo</td>
            <td style="padding:8px 12px;font-weight:700;color:#fca5a5">$138,000/yr</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
            <td style="padding:8px 12px;font-weight:700;color:var(--accent2)">🔧 Plumbing</td>
            <td style="padding:8px 12px">$4,500 (Water Heater / Repipe)</td>
            <td style="padding:8px 12px">1 Major + 4 Emergency Drains</td>
            <td style="padding:8px 12px;color:#fca5a5">$8,500/mo</td>
            <td style="padding:8px 12px;font-weight:700;color:#fca5a5">$102,000/yr</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
            <td style="padding:8px 12px;font-weight:700;color:var(--accent2)">⚡ Electrical</td>
            <td style="padding:8px 12px">$3,800 (200A Panel Upgrade)</td>
            <td style="padding:8px 12px">1 Panel + 2 Emergency Calls</td>
            <td style="padding:8px 12px;color:#fca5a5">$7,000/mo</td>
            <td style="padding:8px 12px;font-weight:700;color:#fca5a5">$84,000/yr</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;font-weight:700;color:var(--accent2)">🌊 Restoration</td>
            <td style="padding:8px 12px">$14,500 (Flood / Water Claim)</td>
            <td style="padding:8px 12px">1 Claim Every 3 Weeks</td>
            <td style="padding:8px 12px;color:#fca5a5">$14,500/mo</td>
            <td style="padding:8px 12px;font-weight:700;color:#fca5a5">$174,000/yr</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- The 15-Second Rule of 1 Job Cold Call Script -->
    <div style="background:rgba(245,158,11,0.1);border-left:4px solid var(--accent);padding:14px;border-radius:8px">
      <div style="font-size:12.5px;font-weight:700;color:var(--accent2);margin-bottom:4px">🎯 The "Rule of 1 Job" Script Hook (Say This on the Call):</div>
      <div style="font-size:13px;color:#ffffff;line-height:1.5">
        <em>"Everett, even if you think $100k sounds crazy... what's your average ticket on ONE AC replacement? About $8,500, right? If Ava catches just <strong>ONE single job every 30 days</strong> that would have hit your voicemail while your techs were on a call... that ONE job pays for our entire service for the whole year and puts $93,000 net cash straight in your pocket. Am I exaggerating, or is that literally just one caught call?"</em>
      </div>
    </div>
  </div>
</div>

<!-- 🧠 Adaptive Brain / Live LLM Settings Modal -->
<div class="modal-overlay" id="brainSettingsModal">
  <div class="modal-box" style="max-width:540px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h3 style="font-family:var(--font-head);font-size:19px;color:var(--accent2);display:flex;align-items:center;gap:8px">
        <span>🧠</span> Contractor AI Brain Configuration
      </h3>
      <button class="btn btn-ghost btn-sm" onclick="closeBrainSettingsModal()" style="font-size:16px;padding:4px 10px">✕</button>
    </div>
    <p style="color:var(--dim);font-size:13px;line-height:1.5;margin-bottom:16px">
      Control how contractor bosses think, adapt, and banter during sparring matches.
    </p>

    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
      <label style="display:flex;align-items:flex-start;gap:12px;background:var(--bg3);border:1.5px solid var(--accent);border-radius:12px;padding:14px;cursor:pointer">
        <input type="radio" name="brainModeChoice" value="adaptive" id="radioBrainAdaptive" checked style="margin-top:3px">
        <div>
          <div style="font-weight:700;color:var(--accent2);font-size:14px">🧠 Built-in Adaptive Engine (Recommended)</div>
          <div style="font-size:12px;color:var(--dim);margin-top:2px">100% Free &amp; Zero-Lag. Understands 20+ sales intents, emotional tone, trade-specific objections, and gives dynamic non-scripted responses.</div>
        </div>
      </label>
      <label style="display:flex;align-items:flex-start;gap:12px;background:var(--bg3);border:1px solid var(--line2);border-radius:12px;padding:14px;cursor:pointer">
        <input type="radio" name="brainModeChoice" value="live_llm" id="radioBrainLLM" style="margin-top:3px">
        <div>
          <div style="font-weight:700;color:#ffffff;font-size:14px">⚡ Live LLM Brain Mode (Custom API Key)</div>
          <div style="font-size:12px;color:var(--dim);margin-top:2px">Connect your OpenAI (gpt-4o-mini) or Groq (llama-3.3-70b) API key for completely open-ended, infinite contractor banter.</div>
        </div>
      </label>
    </div>

    <div id="llmKeyConfigArea" style="display:none;background:var(--bg);border:1px solid var(--line2);border-radius:12px;padding:14px;margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;color:var(--accent2);margin-bottom:6px;font-family:var(--font-mono)">API PROVIDER:</div>
      <select id="llmProviderSelect" class="custom-select" style="width:100%;margin-bottom:12px">
        <option value="groq">⚡ Groq Cloud (llama-3.3-70b-versatile · Ultra Fast &amp; Free Tier)</option>
        <option value="openai">🤖 OpenAI (gpt-4o-mini · Fast &amp; Creative)</option>
      </select>
      <div style="font-size:12px;font-weight:700;color:var(--accent2);margin-bottom:6px;font-family:var(--font-mono)">YOUR API KEY:</div>
      <input type="password" id="llmApiKeyInput" placeholder="Paste gsk_... or sk-... key" style="width:100%;background:var(--bg2);border:1px solid var(--line2);color:var(--ink);padding:9px 12px;border-radius:8px;font-family:var(--font-mono);font-size:12.5px;outline:none">
      <div style="font-size:11px;color:var(--dim);margin-top:8px;line-height:1.4">
        🔒 Stored solely in your browser's private localStorage. Never transmitted to VantorX servers.
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:10px">
      <button class="btn btn-ghost btn-sm" onclick="closeBrainSettingsModal()">Cancel</button>
      <button class="btn btn-gold btn-sm" onclick="saveBrainSettings()">Save Settings</button>
    </div>
  </div>
</div>

<div class="toast" id="toast">Copied to clipboard!</div>

<script>
// ============================================================
// 🌐 GLOBAL BULLETPROOF HELPER FUNCTIONS & TAB SWITCHER
// ============================================================
window.switchTab = function(targetTabId) {
  try {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabBtns.forEach(b => {
      const isTarget = (b.dataset.tab === targetTabId) || (b.getAttribute('onclick') && b.getAttribute('onclick').includes(targetTabId));
      if (isTarget) b.classList.add('active');
      else b.classList.remove('active');
    });
    tabPanels.forEach(p => {
      if (p.id === targetTabId) p.classList.add('active');
      else p.classList.remove('active');
    });
  } catch(e) {
    console.error('Error switching tab:', e);
  }
};

window.showToast = function(msg) {
  try {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2200);
    }
  } catch(e) {}
};

window.copyDemoNumber = function() {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText('(561) 813-8602').then(() => {
        window.showToast('✓ (561) 813-8602 copied to clipboard!');
      }).catch(() => {
        window.showToast('Demo Number: (561) 813-8602');
      });
    } else {
      window.showToast('Demo Number: (561) 813-8602');
    }
  } catch(e) {
    window.showToast('Demo Number: (561) 813-8602');
  }
};

window.openAccountModal = function() {
  try {
    const modal = document.getElementById('accountModal');
    if (modal) {
      modal.classList.add('active');
      if (typeof window.renderAccountProfileList === 'function') {
        window.renderAccountProfileList();
      }
    }
  } catch(e) {
    console.error('Error opening account modal:', e);
  }
};

window.closeAccountModal = function() {
  try {
    const modal = document.getElementById('accountModal');
    if (modal) modal.classList.remove('active');
  } catch(e) {}
};

window.closeLevelUpModal = function() {
  try {
    const modal = document.getElementById('levelUpModal');
    if (modal) modal.classList.remove('active');
  } catch(e) {}
};

window.openLeakMathModal = function() {
  try {
    const modal = document.getElementById('leakMathModal');
    if (modal) modal.classList.add('active');
  } catch(e) {}
};

window.closeLeakMathModal = function() {
  try {
    const modal = document.getElementById('leakMathModal');
    if (modal) modal.classList.remove('active');
  } catch(e) {}
};

window.openBrainSettingsModal = function() {
  try {
    const modal = document.getElementById('brainSettingsModal');
    if (modal) modal.classList.add('active');
    const mode = localStorage.getItem('vantorx_rpg_brain_mode') || 'adaptive';
    const provider = localStorage.getItem('vantorx_rpg_llm_provider') || 'groq';
    const key = localStorage.getItem('vantorx_rpg_llm_key') || '';
    const rAdaptive = document.getElementById('radioBrainAdaptive');
    const rLLM = document.getElementById('radioBrainLLM');
    const configArea = document.getElementById('llmKeyConfigArea');
    const provSelect = document.getElementById('llmProviderSelect');
    const keyInput = document.getElementById('llmApiKeyInput');

    if (rAdaptive) rAdaptive.checked = (mode === 'adaptive');
    if (rLLM) rLLM.checked = (mode === 'live_llm');
    if (configArea) configArea.style.display = (mode === 'live_llm') ? 'block' : 'none';
    if (provSelect) provSelect.value = provider;
    if (keyInput) keyInput.value = key;

    if (rAdaptive && rLLM) {
      rAdaptive.onchange = () => { if (configArea) configArea.style.display = 'none'; };
      rLLM.onchange = () => { if (configArea) configArea.style.display = 'block'; };
    }
  } catch(e) {}
};

window.closeBrainSettingsModal = function() {
  try {
    const modal = document.getElementById('brainSettingsModal');
    if (modal) modal.classList.remove('active');
  } catch(e) {}
};

window.saveBrainSettings = function() {
  try {
    const rLLM = document.getElementById('radioBrainLLM');
    const mode = (rLLM && rLLM.checked) ? 'live_llm' : 'adaptive';
    const prov = document.getElementById('llmProviderSelect')?.value || 'groq';
    const key = document.getElementById('llmApiKeyInput')?.value.trim() || '';

    if (mode === 'live_llm' && !key) {
      alert('Please enter your API key to use Live LLM Brain Mode, or select Built-in Adaptive Engine.');
      return;
    }

    localStorage.setItem('vantorx_rpg_brain_mode', mode);
    localStorage.setItem('vantorx_rpg_llm_provider', prov);
    localStorage.setItem('vantorx_rpg_llm_key', key);

    const badge = document.getElementById('brainModeBadge');
    if (badge) {
      if (mode === 'live_llm') {
        badge.textContent = `⚡ Live LLM: ${prov.toUpperCase()}`;
        badge.style.background = 'rgba(245,158,11,0.2)';
        badge.style.borderColor = 'var(--accent)';
        badge.style.color = 'var(--accent2)';
      } else {
        badge.textContent = '🧠 Adaptive Brain: ACTIVE';
        badge.style.background = 'rgba(52,211,153,0.15)';
        badge.style.borderColor = 'rgba(52,211,153,0.4)';
        badge.style.color = '#6ee7b7';
      }
    }
    window.closeBrainSettingsModal();
    window.showToast(`✓ Brain Mode updated: ${mode === 'live_llm' ? 'Live ' + prov.toUpperCase() : 'Adaptive On-Device'}`);
  } catch(e) {
    console.warn(e);
  }
};

(function() {
  // Nationwide Targets Dataset
  const LEADS_DATA = __LEADS_JSON__;

  // Sound Engine (Lazy Loaded on User Interaction)
  let soundEnabled = true;
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      } catch(e) {
        console.warn('AudioContext unavailable or not supported:', e);
      }
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'slash') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'xp') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'levelup') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'square';
          o.frequency.setValueAtTime(freq, now + idx * 0.1);
          g.gain.setValueAtTime(0.25, now + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.15);
          o.start(now + idx * 0.1);
          o.stop(now + idx * 0.1 + 0.15);
        });
      }
    } catch(err) {
      console.warn('playSound audio error:', err);
    }
  }

  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.textContent = soundEnabled ? '🔊 Audio: ON' : '🔇 Audio: MUTED';
      soundBtn.style.color = soundEnabled ? 'var(--accent2)' : 'var(--dim)';
    });
  }

  // Tab Switching Listeners
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      if (target) window.switchTab(target);
    });
  });

  // Toast
  const toast = document.getElementById('toast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  document.getElementById('copyDemoPill').addEventListener('click', () => {
    navigator.clipboard.writeText('(561) 813-8602').then(() => showToast('✓ (561) 813-8602 copied!'));
  });

  // Accordions in All Panels
  document.querySelectorAll('.obj-acc-head').forEach(head => {
    head.addEventListener('click', () => {
      const body = head.nextElementSibling;
      const isOpen = body.style.display === 'block';
      body.style.display = isOpen ? 'none' : 'block';
      head.style.color = isOpen ? '#fca5a5' : 'var(--accent2)';
    });
  });

  // ============================================================
  // 👤 USER ACCOUNTS, CLOSER ACADEMY & LEVEL 5 GATING ENGINE
  // ============================================================
  const DEFAULT_PROFILES = {
    luke: {
      id: 'luke',
      name: 'Luke (Founder)',
      role: 'Founder & Closer',
      avatar: '👑',
      level: 5,
      xp: 1500,
      isFounder: true,
      founderBypass: true,
      completedUnits: ['1-1','1-2','1-3','1-4','1-5','2-1','2-2','2-3','2-4','2-5','3-1','3-2','3-3','3-4','3-5'],
      flashcardsRevealed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      daysPassed: [1, 2, 3],
      modulesPassed: [1, 2, 3, 4, 5],
      bossesDefeated: 5,
      dailyDials: 0,
      dailySims: 0
    },
    buddy: {
      id: 'buddy',
      name: 'Buddy (Rep 2)',
      role: 'Outbound Closer',
      avatar: '⚔️',
      level: 1,
      xp: 0,
      isFounder: false,
      founderBypass: false,
      completedUnits: [],
      flashcardsRevealed: [],
      daysPassed: [],
      modulesPassed: [],
      bossesDefeated: 0,
      dailyDials: 0,
      dailySims: 0
    }
  };

  let USER_PROFILES = {};
  try {
    USER_PROFILES = JSON.parse(localStorage.getItem('vantorx_user_profiles_v2')) || DEFAULT_PROFILES;
  } catch(e) {
    USER_PROFILES = DEFAULT_PROFILES;
  }
  if (!USER_PROFILES.luke) USER_PROFILES.luke = DEFAULT_PROFILES.luke;
  if (!USER_PROFILES.buddy) USER_PROFILES.buddy = DEFAULT_PROFILES.buddy;

  // Migration for existing saved profiles:
  Object.keys(USER_PROFILES).forEach(k => {
    const u = USER_PROFILES[k];
    if (!u.daysPassed) u.daysPassed = (u.isFounder || (u.modulesPassed && u.modulesPassed.length >= 5)) ? [1, 2, 3] : [];
    if (!u.completedUnits) {
      if (u.isFounder || (u.daysPassed && u.daysPassed.length >= 3)) {
        u.completedUnits = ['1-1','1-2','1-3','1-4','1-5','2-1','2-2','2-3','2-4','2-5','3-1','3-2','3-3','3-4','3-5'];
      } else {
        u.completedUnits = [];
      }
    }
    if (!u.flashcardsRevealed) {
      u.flashcardsRevealed = (u.isFounder || (u.daysPassed && u.daysPassed.includes(1))) ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [];
    }
    if (u.isFounder) { u.xp = 1500; u.level = 5; }
  });

  let activeUserId = localStorage.getItem('vantorx_active_user_id_v2') || 'luke';
  if (!USER_PROFILES[activeUserId]) activeUserId = 'luke';

  let activeCaller = localStorage.getItem('vantorx_active_caller') || 'Luke (Founder)';
  let callerSelectEl = null;

  function saveUserProfiles() {
    try {
      localStorage.setItem('vantorx_user_profiles_v2', JSON.stringify(USER_PROFILES));
      localStorage.setItem('vantorx_active_user_id_v2', activeUserId);
    } catch(e) {}
  }

  function getActiveUser() {
    return USER_PROFILES[activeUserId] || USER_PROFILES.luke;
  }

  function getRankTitle(lvl) {
    const titles = {
      1: 'Rookie Phone Warrior',
      2: 'Cold Call Paladin',
      3: 'Objection Slayer',
      4: 'Closing Centurion',
      5: 'Mythic Rainmaker'
    };
    return titles[lvl] || 'Closer';
  }

  function updateUserUI() {
    try {
      const user = getActiveUser();
      // 1. Header Badge
      const hAvatar = document.getElementById('headerUserAvatar');
      const hName = document.getElementById('headerUserName');
      const hRank = document.getElementById('headerUserRank');
      if (hAvatar) hAvatar.textContent = user.avatar || '👤';
      if (hName) hName.textContent = user.name;
      if (hRank) hRank.textContent = `Lvl ${user.level} · ${getRankTitle(user.level)}`;

      // 2. Caller Bar Update
      const barCurrent = document.getElementById('callerBarCurrent');
      const barLevel = document.getElementById('callerBarLevel');
      if (barCurrent) barCurrent.textContent = `${user.avatar || '👤'} ${user.name}`;
      if (barLevel) {
        const isUnlocked = user.level >= 5 || user.founderBypass === true;
        barLevel.textContent = `Lvl ${user.level} · ${isUnlocked ? 'Unlocked 🔓' : 'Academy Gated 🔒'}`;
        barLevel.style.color = isUnlocked ? 'var(--ok)' : 'var(--accent2)';
        barLevel.style.borderColor = isUnlocked ? 'rgba(52,211,153,0.4)' : 'rgba(245,158,11,0.4)';
      }

      const pillLuke = document.getElementById('quickPillLuke');
      const pillBuddy = document.getElementById('quickPillBuddy');
      if (pillLuke) pillLuke.classList.toggle('active', activeUserId === 'luke');
      if (pillBuddy) pillBuddy.classList.toggle('active', activeUserId === 'buddy');

      // 3. Caller Select in Leads Table
      callerSelectEl = callerSelectEl || document.getElementById('callerSelect');
      if (callerSelectEl) {
        let found = false;
        for (let i = 0; i < callerSelectEl.options.length; i++) {
          if (callerSelectEl.options[i].value === user.name) found = true;
        }
        if (!found) {
          const o = document.createElement('option');
          o.value = user.name;
          o.textContent = user.name;
          callerSelectEl.appendChild(o);
        }
        callerSelectEl.value = user.name;
      }
      activeCaller = user.name;
      try { localStorage.setItem('vantorx_active_caller', activeCaller); } catch(e) {}

      // 4. Modal Info
      const mAvatar = document.getElementById('modalActiveAvatar');
      const mName = document.getElementById('modalActiveName');
      const mRole = document.getElementById('modalActiveRole');
      const mLevel = document.getElementById('modalActiveLevel');
      const mXp = document.getElementById('modalActiveXp');
      if (mAvatar) mAvatar.textContent = user.avatar || '👤';
      if (mName) mName.textContent = user.name;
      if (mRole) mRole.textContent = user.role;
      if (mLevel) mLevel.textContent = `Level ${user.level} · ${getRankTitle(user.level)}`;
      if (mXp) mXp.textContent = `${user.xp} / 1,500 XP`;

      // 5. Founder bypass button
      const btnBypass = document.getElementById('btnToggleFounderBypass');
      if (btnBypass) {
        btnBypass.textContent = user.founderBypass ? 'Bypass: ON' : 'Bypass: OFF';
        btnBypass.className = user.founderBypass ? 'btn btn-gold btn-sm' : 'btn btn-ghost btn-sm';
      }

      // 6. Update components
      updateLeadGateVisibility();
      updateAcademyUI();
      updateDailyGoalsUI();
      renderAccountProfileList();
    } catch(err) {
      console.warn('updateUserUI error:', err);
    }
  }

  function updateLeadGateVisibility() {
    const user = getActiveUser();
    const isUnlocked = user.level >= 5 || user.founderBypass === true;
    const gateCard = document.getElementById('leadsLockedGate');
    const tableContainer = document.getElementById('leadsTableContainer');

    if (gateCard && tableContainer) {
      if (isUnlocked) {
        gateCard.style.display = 'none';
        tableContainer.style.display = 'block';
      } else {
        gateCard.style.display = 'block';
        tableContainer.style.display = 'none';

        const curLevel = document.getElementById('gateCurLevel');
        const curXp = document.getElementById('gateCurXp');
        const curPct = document.getElementById('gateCurPct');
        const barFill = document.getElementById('gateProgressFill');
        const pct = Math.min(100, Math.round((user.xp / 1500) * 100));

        if (curLevel) curLevel.textContent = user.level;
        if (curXp) curXp.textContent = user.xp;
        if (curPct) curPct.textContent = `${pct}%`;
        if (barFill) barFill.style.width = `${pct}%`;

        for (let d = 1; d <= 3; d++) {
          const item = document.getElementById(`gateCheckDay${d}`);
          if (item) {
            const isDone = user.daysPassed.includes(d);
            if (isDone) {
              item.classList.add('done');
              const icon = item.querySelector('.gate-icon');
              if (icon) icon.textContent = '✓';
            } else {
              item.classList.remove('done');
              const icon = item.querySelector('.gate-icon');
              if (icon) icon.textContent = '⏳';
            }
          }
        }
      }
    }
  }

  // ============================================================
  // 🎓 TWO-COLUMN LMS ENGINE & LINEAR MASTERY CONTROLLER
  // ============================================================
  const LMS_UNITS = [
    '1-1', '1-2', '1-3', '1-4', '1-5',
    '2-1', '2-2', '2-3', '2-4', '2-5',
    '3-1', '3-2', '3-3', '3-4', '3-5'
  ];

  let currentActiveLmsUnit = '1-1';

  function isUnitUnlocked(unitId, user) {
    if (!user) user = getActiveUser();
    if (user.founderBypass === true || user.isFounder === true) return true;
    if (unitId === '1-1') return true;

    const completed = user.completedUnits || [];
    const days = user.daysPassed || [];
    const bosses = user.bossesDefeated || 0;
    const cards = user.flashcardsRevealed || [];

    switch (unitId) {
      case '1-2': return completed.includes('1-1');
      case '1-3': return completed.includes('1-2');
      case '1-4': return completed.includes('1-3');
      case '1-5': return completed.includes('1-4') && cards.length >= 10;
      
      case '2-1': return days.includes(1);
      case '2-2': return completed.includes('2-1');
      case '2-3': return completed.includes('2-2');
      case '2-4': return completed.includes('2-3');
      case '2-5': return completed.includes('2-4') && bosses >= 2;

      case '3-1': return days.includes(2);
      case '3-2': return completed.includes('3-1');
      case '3-3': return completed.includes('3-2');
      case '3-4': return completed.includes('3-3');
      case '3-5': return completed.includes('3-4') && bosses >= 4;
      default: return false;
    }
  }

  function isUnitCompleted(unitId, user) {
    if (!user) user = getActiveUser();
    const completed = user.completedUnits || [];
    const days = user.daysPassed || [];

    if (unitId === '1-5') return days.includes(1);
    if (unitId === '2-5') return days.includes(2);
    if (unitId === '3-5') return days.includes(3);
    return completed.includes(unitId);
  }

  window.selectLmsUnit = function(unitId) {
    const user = getActiveUser();
    const unlocked = isUnitUnlocked(unitId, user);
    const isExam = ['1-5', '2-5', '3-5'].includes(unitId);

    if (!unlocked && !isExam) {
      playSound('slash');
      showToast(`🔒 Lesson ${unitId} is locked. Complete earlier lessons and prerequisites first!`);
      return;
    }

    currentActiveLmsUnit = unitId;

    // 1. Switch active view
    document.querySelectorAll('.lms-lesson-view').forEach(view => {
      view.classList.remove('active');
    });
    const targetView = document.getElementById('view-' + unitId);
    if (targetView) targetView.classList.add('active');

    // 2. Switch active sidebar item
    document.querySelectorAll('.lms-nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const targetNav = document.getElementById('navItem-' + unitId);
    if (targetNav) targetNav.classList.add('active');

    // 3. Scroll main stage to top
    const stage = document.querySelector('.lms-stage');
    if (stage) stage.scrollTop = 0;

    // 4. Update dynamic Academy UI
    updateAcademyUI();
  };

  window.completeLmsUnit = function(unitId, nextUnitId) {
    const user = getActiveUser();
    if (!user.completedUnits) user.completedUnits = [];

    // Verify prerequisites for specific gating units
    if (unitId === '1-4') {
      const cardCount = (user.flashcardsRevealed || []).length;
      if (!user.founderBypass && cardCount < 10) {
        playSound('slash');
        showToast('⚠️ You must review and flip all 10 objection flashcards before continuing!');
        return;
      }
    } else if (unitId === '2-4') {
      const bossCount = user.bossesDefeated || 0;
      if (!user.founderBypass && bossCount < 2) {
        playSound('slash');
        showToast('⚠️ You must defeat at least 2 contractor bosses in Cold Call Quest RPG first!');
        return;
      }
    } else if (unitId === '3-4') {
      const bossCount = user.bossesDefeated || 0;
      if (!user.founderBypass && bossCount < 4) {
        playSound('slash');
        showToast('⚠️ You must defeat all 4 contractor bosses in the Crucible first!');
        return;
      }
    }

    if (!user.completedUnits.includes(unitId)) {
      user.completedUnits.push(unitId);
      saveUserProfiles();
    }

    playSound('hit');
    showToast(`✓ Lesson ${unitId} Completed!`);
    updateAcademyUI();

    if (nextUnitId) {
      window.selectLmsUnit(nextUnitId);
    }
  };

  window.revealLmsFlashcard = function(idx) {
    const user = getActiveUser();
    if (!user.flashcardsRevealed) user.flashcardsRevealed = [];

    const card = document.getElementById('fc-' + idx);
    if (card) {
      card.classList.toggle('revealed');
    }

    if (!user.flashcardsRevealed.includes(idx)) {
      user.flashcardsRevealed.push(idx);
      saveUserProfiles();
    }

    const btn = card ? card.querySelector('.fc-reveal-btn') : null;
    if (btn) {
      btn.textContent = '✓ Mastered';
      btn.style.borderColor = '#34d399';
      btn.style.color = '#34d399';
    }

    updateAcademyUI();

    if (user.flashcardsRevealed.length >= 10) {
      playSound('hit');
      showToast('🎉 All 10 Objection Flashcards Mastered! Lesson 1.5 Exam Unlocked!');
    }
  };

  window.playContractorAudioSimulation = function(type) {
    if (!('speechSynthesis' in window)) {
      showToast('⚠️ Audio speech synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();

    let text = '';
    let pitch = 1.0;
    let rate = 1.0;

    if (type === 'roofer_busy') {
      text = "Yeah, who's this? I'm standing on a two-story roof in 95-degree heat with a nail gun in my hand. Make it fast.";
      pitch = 0.85;
      rate = 1.05;
    } else if (type === 'gatekeeper_extraction') {
      text = "Hey Sarah, Luke here — quick operational question regarding Mike's emergency call dispatch schedule in Tampa. Does he check his cell between jobs or should I catch him at the shop around 4:30?";
      pitch = 0.95;
      rate = 1.02;
    } else if (type === 'disarm_delivery') {
      text = "Luke from VantorX. Got 20 seconds or should I hang up? ... Look, I know you're on a job site, so I'll be blunt. Most roofers in Palm Beach lose between three and eight thousand a week on emergency calls that hit voicemail after 6 PM.";
      pitch = 0.95;
      rate = 1.05;
    } else if (type === 'demo_challenge') {
      text = "I just shot a direct text with our live demo line — 561-813-8602 — to this cell. Tap it on speaker when you park or step off the roof, and listen to Ava answer on ring one. What time do you wrap today so I can hear what you thought?";
      pitch = 0.95;
      rate = 1.0;
    } else {
      text = "VantorX Solutions closer simulation audio.";
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch;
    utterance.rate = rate;

    try {
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0];
      if (enVoice) utterance.voice = enVoice;
    } catch(e) {}

    showToast('🔊 Playing audio simulation...');
    window.speechSynthesis.speak(utterance);
  };

  function updateAcademyUI() {
    const user = getActiveUser();
    if (!user.completedUnits) user.completedUnits = [];
    if (!user.flashcardsRevealed) user.flashcardsRevealed = [];
    if (!user.daysPassed) user.daysPassed = [];

    const countEl = document.getElementById('academyDaysCount');
    const xpText = document.getElementById('academyXpText');
    const levelText = document.getElementById('academyLevelText');
    const pctText = document.getElementById('academyPctText');
    const barFill = document.getElementById('academyBarFill');
    const statusText = document.getElementById('academyStatusText');

    const passedDays = user.daysPassed.length;
    const pct = Math.min(100, Math.round((user.xp / 1500) * 100));

    if (countEl) countEl.textContent = passedDays;
    if (xpText) xpText.textContent = user.xp;
    if (levelText) levelText.textContent = user.level;
    if (pctText) pctText.textContent = `${pct}%`;
    if (barFill) barFill.style.width = `${pct}%`;

    if (statusText) {
      if (user.level >= 5 || user.founderBypass) {
        statusText.textContent = '🎉 Level 5 Certified · Leads Unlocked!';
        statusText.style.color = 'var(--ok)';
      } else {
        statusText.textContent = '🔒 Leads Locked (Reach Level 5)';
        statusText.style.color = 'var(--accent2)';
      }
    }

    // 1. Update 15 LMS Syllabus Navigation Items in Sidebar
    LMS_UNITS.forEach(u => {
      const navItem = document.getElementById('navItem-' + u);
      const navIcon = document.getElementById('navIcon-' + u);
      if (!navItem || !navIcon) return;

      const completed = isUnitCompleted(u, user);
      const unlocked = isUnitUnlocked(u, user);

      if (completed) {
        navItem.classList.remove('locked');
        navItem.classList.add('completed');
        navIcon.textContent = '✓';
        navIcon.style.color = '#34d399';
      } else if (unlocked) {
        navItem.classList.remove('locked', 'completed');
        navIcon.textContent = '▶';
        navIcon.style.color = 'var(--accent2)';
      } else {
        navItem.classList.add('locked');
        navItem.classList.remove('completed');
        navIcon.textContent = '🔒';
        navIcon.style.color = 'var(--dim)';
      }
    });

    // 2. Update Day Status Headers in Syllabus Sidebar
    const d1Units = ['1-1','1-2','1-3','1-4','1-5'];
    const d2Units = ['2-1','2-2','2-3','2-4','2-5'];
    const d3Units = ['3-1','3-2','3-3','3-4','3-5'];

    const d1Done = d1Units.filter(u => isUnitCompleted(u, user)).length;
    const d2Done = d2Units.filter(u => isUnitCompleted(u, user)).length;
    const d3Done = d3Units.filter(u => isUnitCompleted(u, user)).length;

    const navD1 = document.getElementById('navDay1Status');
    const navD2 = document.getElementById('navDay2Status');
    const navD3 = document.getElementById('navDay3Status');

    if (navD1) navD1.textContent = user.daysPassed.includes(1) ? '✓ Certified' : `${d1Done}/5 Done`;
    if (navD2) navD2.textContent = user.daysPassed.includes(2) ? '✓ Certified' : `${d2Done}/5 Done`;
    if (navD3) navD3.textContent = user.daysPassed.includes(3) ? '🏆 Level 5' : `${d3Done}/5 Done`;

    // 3. Update Lesson 1.4 Flashcard Drill UI
    const cardCount = user.flashcardsRevealed.length;
    const countEl14 = document.getElementById('fcMasteryCount');
    if (countEl14) countEl14.textContent = `${cardCount} / 10 Mastered`;

    for (let c = 1; c <= 10; c++) {
      const card = document.getElementById('fc-' + c);
      if (card && user.flashcardsRevealed.includes(c)) {
        card.classList.add('revealed');
        const btn = card.querySelector('.fc-reveal-btn');
        if (btn) {
          btn.textContent = '✓ Mastered';
          btn.style.borderColor = '#34d399';
          btn.style.color = '#34d399';
        }
      }
    }

    const btnUnit14 = document.getElementById('btnCompleteUnit14');
    if (btnUnit14) {
      if (cardCount >= 10 || user.founderBypass) {
        btnUnit14.disabled = false;
        btnUnit14.textContent = '✓ Complete Lesson 1.4 & Unlock Day 1 Exam ➔';
        btnUnit14.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      } else {
        btnUnit14.disabled = true;
        btnUnit14.textContent = `🔒 Review All 10 Cards (${cardCount}/10 Done) to Unlock Exam ➔`;
        btnUnit14.style.background = '';
      }
    }

    // 4. Update Lesson 2.4 & 3.4 Combat Counts & Buttons
    const bosses = user.bossesDefeated || 0;
    const bossD2El = document.getElementById('lmsBossCountD2');
    const bossD3El = document.getElementById('lmsBossCountD3');
    if (bossD2El) bossD2El.textContent = Math.min(2, bosses);
    if (bossD3El) bossD3El.textContent = Math.min(4, bosses);

    const btnUnit24 = document.getElementById('btnCompleteUnit24');
    if (btnUnit24) {
      if (bosses >= 2 || user.founderBypass) {
        btnUnit24.disabled = false;
        btnUnit24.textContent = '✓ Verify Sparring & Unlock Day 2 Exam ➔';
        btnUnit24.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      } else {
        btnUnit24.disabled = true;
        btnUnit24.textContent = `🔒 Defeat ${Math.max(0, 2 - bosses)} More Bosses in RPG to Unlock Exam ➔`;
        btnUnit24.style.background = '';
      }
    }

    const btnUnit34 = document.getElementById('btnCompleteUnit34');
    if (btnUnit34) {
      if (bosses >= 4 || user.founderBypass) {
        btnUnit34.disabled = false;
        btnUnit34.textContent = '✓ Verify Crucible & Unlock Board Exam ➔';
        btnUnit34.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      } else {
        btnUnit34.disabled = true;
        btnUnit34.textContent = `🔒 Defeat ${Math.max(0, 4 - bosses)} More Bosses in Crucible to Unlock Board Exam ➔`;
        btnUnit34.style.background = '';
      }
    }

    // 5. Exam Lock Screens vs Bodies
    const lock15 = document.getElementById('lockScreen15');
    const body15 = document.getElementById('examBody15');
    if (lock15 && body15) {
      const u15Unlocked = isUnitUnlocked('1-5', user);
      lock15.style.display = u15Unlocked ? 'none' : 'block';
      body15.style.display = u15Unlocked ? 'block' : 'none';
    }

    const lock25 = document.getElementById('lockScreen25');
    const body25 = document.getElementById('examBody25');
    if (lock25 && body25) {
      const u25Unlocked = isUnitUnlocked('2-5', user);
      lock25.style.display = u25Unlocked ? 'none' : 'block';
      body25.style.display = u25Unlocked ? 'block' : 'none';
    }

    const lock35 = document.getElementById('lockScreen35');
    const body35 = document.getElementById('examBody35');
    if (lock35 && body35) {
      const u35Unlocked = isUnitUnlocked('3-5', user);
      lock35.style.display = u35Unlocked ? 'none' : 'block';
      body35.style.display = u35Unlocked ? 'block' : 'none';
    }

    // 6. Exam Badges
    const b1 = document.getElementById('day1ExamBadge');
    const b2 = document.getElementById('day2ExamBadge');
    const b3 = document.getElementById('day3ExamBadge');
    if (b1 && user.daysPassed.includes(1)) {
      b1.textContent = '✓ Day 1 Certified (+500 XP)';
      b1.style.background = 'rgba(52,211,153,0.2)';
      b1.style.borderColor = 'rgba(52,211,153,0.4)';
      b1.style.color = '#34d399';
    }
    if (b2 && user.daysPassed.includes(2)) {
      b2.textContent = '✓ Day 2 Certified (+500 XP)';
      b2.style.background = 'rgba(52,211,153,0.2)';
      b2.style.borderColor = 'rgba(52,211,153,0.4)';
      b2.style.color = '#34d399';
    }
    if (b3 && user.daysPassed.includes(3)) {
      b3.textContent = '🏆 Board Certified Closer (+500 XP)';
      b3.style.background = 'rgba(52,211,153,0.2)';
      b3.style.borderColor = 'rgba(52,211,153,0.4)';
      b3.style.color = '#34d399';
    }
  }

  function updateDailyGoalsUI() {
    const user = getActiveUser();
    const gDials = document.getElementById('goalDialsDone');
    const gSims = document.getElementById('goalSimsDone');
    if (gDials) gDials.textContent = user.dailyDials || 0;
    if (gSims) gSims.textContent = user.dailySims || 0;
  }

  window.checkDayAnswer = function(dayNum, qNum, optIndex, isCorrect) {
    const user = getActiveUser();
    const qBox = document.querySelector(`.quiz-options[data-day="${dayNum}"][data-q="${qNum}"]`);
    if (!qBox) return;

    const btns = qBox.querySelectorAll('.quiz-opt-btn');
    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === optIndex) {
        if (isCorrect) {
          btn.classList.add('correct');
          playSound('hit');
          showToast('✓ Correct! Great conversational reflex.');
        } else {
          btn.classList.add('wrong');
          playSound('slash');
          showToast('❌ Incorrect response. Contractors will hang up!');
          setTimeout(() => {
            btns.forEach(b => {
              b.disabled = false;
              b.classList.remove('wrong', 'correct');
            });
          }, 1800);
        }
      }
    });

    if (!isCorrect) return;

    // Check completion for this day
    const dayQBoxes = document.querySelectorAll(`.quiz-options[data-day="${dayNum}"]`);
    let answeredCorrect = 0;
    dayQBoxes.forEach(box => {
      if (box.querySelector('.quiz-opt-btn.correct')) answeredCorrect++;
    });

    if (dayNum === 1 && answeredCorrect >= 8 && !user.daysPassed.includes(1)) {
      user.daysPassed.push(1);
      if (!user.completedUnits) user.completedUnits = [];
      if (!user.completedUnits.includes('1-5')) user.completedUnits.push('1-5');
      if (!user.completedUnits.includes('2-1')) user.completedUnits.push('2-1');
      user.xp = Math.min(1500, user.xp + 500);
      user.level = Math.min(5, Math.floor(user.xp / 300) + 1);
      playSound('levelup');
      showToast('🎉 Day 1 Certified! +500 XP Earned! Day 2 Unlocked!');
      saveUserProfiles();
      updateUserUI();
    } else if (dayNum === 2 && answeredCorrect >= 8) {
      if ((user.bossesDefeated || 0) < 2) {
        showToast('⚠️ Exam passed! Now defeat at least 2 Bosses in Cold Call Quest RPG to finish Day 2!');
      } else if (!user.daysPassed.includes(2)) {
        user.daysPassed.push(2);
        if (!user.completedUnits) user.completedUnits = [];
        if (!user.completedUnits.includes('2-5')) user.completedUnits.push('2-5');
        if (!user.completedUnits.includes('3-1')) user.completedUnits.push('3-1');
        user.xp = Math.min(1500, user.xp + 500);
        user.level = Math.min(5, Math.floor(user.xp / 300) + 1);
        playSound('levelup');
        showToast('🎉 Day 2 Certified! +500 XP Earned! Day 3 Unlocked!');
        saveUserProfiles();
        updateUserUI();
      }
    } else if (dayNum === 3 && answeredCorrect >= 14) {
      if ((user.bossesDefeated || 0) < 4) {
        showToast('⚠️ Board Exam passed! Now defeat all 4 Bosses in Cold Call Quest RPG to earn your License to Dial!');
      } else if (!user.daysPassed.includes(3)) {
        user.daysPassed.push(3);
        if (!user.completedUnits) user.completedUnits = [];
        if (!user.completedUnits.includes('3-5')) user.completedUnits.push('3-5');
        user.xp = 1500;
        user.level = 5;
        playSound('levelup');
        showToast('🏆 LEVEL 5 CERTIFIED CLOSER! Nationwide Leads Unlocked!');
        showLicenseUnlockedModal();
        saveUserProfiles();
        updateUserUI();
      }
    }
  };

  // Backwards compatibility alias
  window.checkQuizAnswer = function(modNum, qNum, optIndex, isCorrect) {
    window.checkDayAnswer(modNum <= 2 ? 1 : (modNum <= 4 ? 2 : 3), qNum, optIndex, isCorrect);
  };

  function recordBossDefeat(bossKey) {
    const user = getActiveUser();
    user.bossesDefeated = (user.bossesDefeated || 0) + 1;
    user.dailySims = (user.dailySims || 0) + 1;

    // Check Day 2 completion
    if (user.bossesDefeated >= 2 && !user.daysPassed.includes(2)) {
      const day2Boxes = document.querySelectorAll('.quiz-options[data-day="2"]');
      let day2Correct = 0;
      day2Boxes.forEach(b => { if (b.querySelector('.quiz-opt-btn.correct')) day2Correct++; });
      if (day2Correct >= 8) {
        user.daysPassed.push(2);
        if (!user.completedUnits) user.completedUnits = [];
        if (!user.completedUnits.includes('2-5')) user.completedUnits.push('2-5');
        if (!user.completedUnits.includes('3-1')) user.completedUnits.push('3-1');
        user.xp = Math.min(1500, user.xp + 500);
        user.level = Math.min(5, Math.floor(user.xp / 300) + 1);
        playSound('levelup');
        showToast('🎉 Day 2 Certified! 2 Bosses Slayed + Exam Passed! Day 3 Unlocked!');
      }
    }

    // Check Day 3 completion
    if (user.bossesDefeated >= 4 && !user.daysPassed.includes(3)) {
      const day3Boxes = document.querySelectorAll('.quiz-options[data-day="3"]');
      let day3Correct = 0;
      day3Boxes.forEach(b => { if (b.querySelector('.quiz-opt-btn.correct')) day3Correct++; });
      if (day3Correct >= 14) {
        user.daysPassed.push(3);
        if (!user.completedUnits) user.completedUnits = [];
        if (!user.completedUnits.includes('3-5')) user.completedUnits.push('3-5');
        user.xp = 1500;
        user.level = 5;
        playSound('levelup');
        showToast('🏆 LEVEL 5 CERTIFIED CLOSER! All 4 Bosses Defeated & Board Exam Passed!');
        showLicenseUnlockedModal();
      }
    }

    saveUserProfiles();
    updateUserUI();
  }

  function showLicenseUnlockedModal() {
    const modal = document.getElementById('licenseUnlockedModal');
    if (modal) {
      modal.classList.add('active');
      playSound('levelup');
    }
  }

  const btnClaimLicense = document.getElementById('btnClaimLicense');
  if (btnClaimLicense) {
    btnClaimLicense.addEventListener('click', () => {
      const modal = document.getElementById('licenseUnlockedModal');
      if (modal) modal.classList.remove('active');
      window.switchTab('tabLeads');
    });
  }

  const userProfileBtn = document.getElementById('userProfileBtn');
  const accountModal = document.getElementById('accountModal');
  const closeAccountModalBtn = document.getElementById('closeAccountModalBtn');

  if (userProfileBtn && accountModal) {
    userProfileBtn.addEventListener('click', () => {
      accountModal.classList.add('active');
      renderAccountProfileList();
    });
  }
  if (closeAccountModalBtn && accountModal) {
    closeAccountModalBtn.addEventListener('click', () => {
      accountModal.classList.remove('active');
    });
  }

  window.renderAccountProfileList = renderAccountProfileList;
  window.quickSwitchCaller = function(uid) {
    if (!USER_PROFILES[uid]) {
      activeUserId = 'luke';
    } else {
      activeUserId = uid;
    }
    if (window.selectLmsUnit) window.selectLmsUnit('1-1');
    saveUserProfiles();
    updateUserUI();
    renderLeadsTable();
    showToast(`✓ Switched caller account to: ${getActiveUser().name}`);
  };

  window.activateFounderBypass = function() {
    const user = getActiveUser();
    user.founderBypass = true;
    saveUserProfiles();
    updateUserUI();
    showToast('👑 Founder Bypass Activated! Leads Dispatcher Unlocked.');
  };

  window.toggleFounderBypass = function() {
    const user = getActiveUser();
    user.founderBypass = !user.founderBypass;
    saveUserProfiles();
    updateUserUI();
    showToast(`Founder Bypass: ${user.founderBypass ? 'ACTIVE (All Leads Unlocked)' : 'INACTIVE (Gated to Level 5)'}`);
  };

  window.claimLicenseAndGoToLeads = function() {
    const modal = document.getElementById('licenseUnlockedModal');
    if (modal) modal.classList.remove('active');
    window.switchTab('tabLeads');
  };

  window.createNewAccountFromModal = function() {
    const nameInput = document.getElementById('newRepName');
    const roleSelect = document.getElementById('newRepRole');
    const name = nameInput ? nameInput.value.trim() : '';
    const role = roleSelect ? roleSelect.value : 'Outbound Closer';

    if (!name) {
      showToast('Please enter a name for the new sales rep account.');
      return;
    }

    const uid = 'rep_' + Date.now().toString(36);
    const avatars = ['⚡', '⚔️', '🎯', '🔥', '🛡️', '🚀'];
    const chosenAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    USER_PROFILES[uid] = {
      id: uid,
      name: name,
      role: role,
      avatar: chosenAvatar,
      level: 1,
      xp: 0,
      isFounder: false,
      founderBypass: false,
      completedUnits: [],
      flashcardsRevealed: [],
      daysPassed: [],
      modulesPassed: [],
      bossesDefeated: 0,
      dailyDials: 0,
      dailySims: 0
    };

    activeUserId = uid;
    if (nameInput) nameInput.value = '';
    saveUserProfiles();
    if (window.selectLmsUnit) window.selectLmsUnit('1-1');
    updateUserUI();
    playSound('levelup');
    showToast(`✓ Account created for ${name}! Welcome to the Closer Academy.`);
    const accountModal = document.getElementById('accountModal');
    if (accountModal) accountModal.classList.remove('active');
    window.switchTab('tabAcademy');
  };

  const btnToggleFounderBypass = document.getElementById('btnToggleFounderBypass');
  if (btnToggleFounderBypass) {
    btnToggleFounderBypass.addEventListener('click', window.toggleFounderBypass);
  }

  const btnFounderOverride = document.getElementById('btnFounderOverride');
  if (btnFounderOverride) {
    btnFounderOverride.addEventListener('click', window.activateFounderBypass);
  }

  function renderAccountProfileList() {
    const list = document.getElementById('accountProfileList');
    if (!list) return;
    list.innerHTML = '';
    Object.keys(USER_PROFILES).forEach(uid => {
      const u = USER_PROFILES[uid];
      const isCur = uid === activeUserId;
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.background = isCur ? 'rgba(245,158,11,0.14)' : 'var(--bg)';
      row.style.border = isCur ? '1.5px solid var(--accent)' : '1px solid var(--line)';
      row.style.borderRadius = '8px';
      row.style.padding = '8px 12px';
      row.style.cursor = 'pointer';

      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:16px">${u.avatar || '👤'}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:#ffffff">${u.name} ${isCur ? '<span style="font-size:10px;color:var(--accent2)">(Active)</span>' : ''}</div>
            <div style="font-size:11px;color:var(--dim)">${u.role} · Level ${u.level} (${u.xp} XP)</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" style="font-size:11.5px;padding:4px 8px">${isCur ? '✓ Using' : 'Switch ➔'}</button>
      `;

      row.addEventListener('click', () => {
        window.quickSwitchCaller(uid);
        if (accountModal) accountModal.classList.remove('active');
      });

      list.appendChild(row);
    });
  }

  const btnCreateAccount = document.getElementById('btnCreateAccount');
  if (btnCreateAccount) {
    btnCreateAccount.addEventListener('click', window.createNewAccountFromModal);
  }

  // ============================================================
  // 📋 LEAD DISPATCHER, DAILY 25-LEAD ENGINE & CALL TRACKER
  // ============================================================
  let CALL_RECORDS = {};
  try {
    CALL_RECORDS = JSON.parse(localStorage.getItem('vantorx_lead_calls_v1')) || {};
  } catch(e) {
    CALL_RECORDS = {};
  }
  function saveCallRecords() {
    try {
      localStorage.setItem('vantorx_lead_calls_v1', JSON.stringify(CALL_RECORDS));
    } catch(e) {}
  }

  callerSelectEl = callerSelectEl || document.getElementById('callerSelect');
  if (callerSelectEl) {
    callerSelectEl.value = activeCaller;
    callerSelectEl.addEventListener('change', (e) => {
      activeCaller = e.target.value;
      localStorage.setItem('vantorx_active_caller', activeCaller);
      showToast(`Active caller set to: ${activeCaller}`);
    });
  }

  // Base Starting Queue: 100 leads, +25 daily auto growth, + manual additions
  const BASE_QUEUE_SIZE = 100;
  const LAUNCH_DATE = new Date('2026-10-21T00:00:00');
  const msPerDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const daysSinceLaunch = Math.max(0, Math.floor((now.getTime() - LAUNCH_DATE.getTime()) / msPerDay));
  const autoDailyAdditions = daysSinceLaunch * 25;

  let manualAdditions = 0;
  try {
    manualAdditions = parseInt(localStorage.getItem('vantorx_manual_lead_additions') || '0', 10);
  } catch(e) {
    manualAdditions = 0;
  }

  function getActiveQueueLimit() {
    return Math.min(LEADS_DATA.length, BASE_QUEUE_SIZE + autoDailyAdditions + manualAdditions);
  }

  function getTodayFreshRange() {
    const limit = getActiveQueueLimit();
    const start = Math.max(0, limit - 25);
    return { start, end: limit };
  }

  let currentBatch = 'activeQueue';
  let currentProductFilter = 'all';
  let currentStateFilter = 'all';
  let currentStatusFilter = 'all'; // 'all', 'uncalled', 'called'
  let leadSearchQuery = '';

  const todayDateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dateEl = document.getElementById('todayDateDisplay');
  if (dateEl) dateEl.textContent = todayDateStr;

  const leadTableBody = document.getElementById('leadTableBody');

  function updateBatchDropdownLabels() {
    const activeLimit = getActiveQueueLimit();
    const batchSel = document.getElementById('batchSelect');
    if (batchSel) {
      const optActive = batchSel.querySelector('option[value="activeQueue"]');
      if (optActive) optActive.textContent = `⭐ Active Dial Queue (${activeLimit} Leads · Starts 100 + Daily Growth)`;
    }
  }

  function updateBatchHeading() {
    const heading = document.getElementById('batchHeadingText');
    const activeLimit = getActiveQueueLimit();
    if (heading) {
      if (currentBatch === 'activeQueue') {
        heading.textContent = `ACTIVE COLD CALL QUEUE: ${activeLimit} TARGETS (+25 ADDED DAILY)`;
      } else if (currentBatch === 'todayFresh') {
        heading.textContent = `TODAY'S 25 FRESH UNLOCKED TARGETS`;
      } else if (currentBatch === 'all') {
        heading.textContent = `NATIONWIDE MASTER DIRECTORY (250 TARGETS)`;
      } else {
        heading.textContent = `BATCH #${currentBatch}: 25 NATIONWIDE TARGET LEADS`;
      }
    }
    updateBatchDropdownLabels();
  }

  function getProductBadgeHtml(prod) {
    const map = {
      ava: '<span class="badge-prod badge-prod-ava">🤖 Ava Voice</span>',
      website: '<span class="badge-prod badge-prod-website">🌐 Website</span>',
      speed: '<span class="badge-prod badge-prod-speed">⚡ Speed-to-Lead</span>',
      aeo: '<span class="badge-prod badge-prod-aeo">⭐ AEO &amp; Reviews</span>',
      bundle: '<span class="badge-prod badge-prod-bundle">🚀 Full Bundle</span>'
    };
    return map[prod] || map.ava;
  }

  function getTradeBreakdown(trade, monthlyLoss) {
    const t = (trade || '').toLowerCase();
    if (t.includes('hvac')) {
      return '1 AC replacement (~$8,500) + 2 repair calls/mo';
    } else if (t.includes('roof')) {
      return '1 full roof replacement (~$11,500)/mo';
    } else if (t.includes('plumb')) {
      return '1 water heater (~$4,500) + 4 pipe/drain calls/mo';
    } else if (t.includes('electr')) {
      return '1 200A panel upgrade (~$3,800) + 2 outage calls/mo';
    } else if (t.includes('restor')) {
      return '1 flood/water claim (~$14,500) every 3 weeks';
    } else if (t.includes('solar')) {
      return '1 residential battery/inverter job (~$11,000)/mo';
    }
    return '1 high-ticket job + 2 emergency calls/mo';
  }

  // Pagination State & Controls
  let leadPageSize = 50;
  let currentLeadPage = 1;

  window.setLeadPageSize = function(size) {
    leadPageSize = size;
    currentLeadPage = 1;
    document.querySelectorAll('.btn-size-pill').forEach(b => {
      b.classList.toggle('active', b.dataset.size === String(size));
    });
    renderLeadsTable();
  };

  window.changeLeadPage = function(delta) {
    currentLeadPage += delta;
    renderLeadsTable();
    const t = document.querySelector('.excel-table-wrap');
    if (t) t.scrollTop = 0;
  };

  window.resetAllLeadFilters = function() {
    currentStateFilter = 'all';
    currentProductFilter = 'all';
    currentStatusFilter = 'all';
    leadSearchQuery = '';
    currentLeadPage = 1;
    const sInp = document.getElementById('leadSearchInput');
    if (sInp) sInp.value = '';
    const sState = document.getElementById('stateFilterSelect');
    if (sState) sState.value = 'all';
    document.querySelectorAll('#leadProductFilters [data-lead-filter]').forEach(b => {
      b.classList.toggle('active', b.dataset.leadFilter === 'all');
    });
    document.querySelectorAll('[data-status-filter]').forEach(b => {
      b.classList.toggle('active', b.dataset.statusFilter === 'all');
    });
    renderLeadsTable();
    showToast('✓ Cleared all filters back to active queue.');
  };

  function renderLeadsTable() {
    leadTableBody.innerHTML = '';
    const q = leadSearchQuery.toLowerCase().trim();
    const activeLimit = getActiveQueueLimit();
    const freshRange = getTodayFreshRange();

    const hasSearch = q.length > 0;
    const hasStateFilter = currentStateFilter !== 'all';
    const hasProductFilter = currentProductFilter !== 'all';
    const hasStatusFilter = currentStatusFilter !== 'all';
    const isCustomFilter = hasSearch || hasStateFilter || hasProductFilter || hasStatusFilter;

    // Show or hide Reset Filters pill
    const btnReset = document.getElementById('btnResetFilters');
    if (btnReset) btnReset.style.display = isCustomFilter ? 'inline-flex' : 'none';

    // If user explicitly picked Batch 1..10 from the queue dropdown, constrain to that batch.
    // If they picked "Active Queue" or "Today Fresh" but are filtering by state/product/search, search across ALL 250 NATIONWIDE LEADS!
    const isNumberedBatch = (currentBatch !== 'activeQueue' && currentBatch !== 'todayFresh' && currentBatch !== 'all');

    const filtered = LEADS_DATA.filter((lead, index) => {
      // 1. Queue / Batch filter
      if (isNumberedBatch) {
        const batchNum = parseInt(currentBatch, 10);
        if (lead.batch !== batchNum) return false;
      } else if (!isCustomFilter) {
        if (currentBatch === 'activeQueue') {
          if (index >= activeLimit) return false;
        } else if (currentBatch === 'todayFresh') {
          if (index < freshRange.start || index >= freshRange.end) return false;
        }
      }
      // 2. State filter
      const leadState = lead.state || (lead.city.includes(', ') ? lead.city.split(', ')[1] : 'FL');
      if (currentStateFilter !== 'all' && leadState !== currentStateFilter) return false;
      // 3. Product filter
      if (currentProductFilter !== 'all' && lead.product !== currentProductFilter) return false;
      // 4. Call status filter
      const isCalled = !!(CALL_RECORDS[lead.id] && CALL_RECORDS[lead.id].called);
      if (currentStatusFilter === 'uncalled' && isCalled) return false;
      if (currentStatusFilter === 'called' && !isCalled) return false;
      // 5. Search query
      if (!q) return true;
      return (
        lead.company.toLowerCase().includes(q) ||
        lead.owner.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        leadState.toLowerCase().includes(q) ||
        lead.trade.toLowerCase().includes(q) ||
        lead.painPoint.toLowerCase().includes(q)
      );
    });

    const totalCount = filtered.length;
    const totalPages = (leadPageSize === 'all') ? 1 : Math.max(1, Math.ceil(totalCount / leadPageSize));
    if (currentLeadPage > totalPages) currentLeadPage = totalPages;
    if (currentLeadPage < 1) currentLeadPage = 1;

    // Update Pagination Display
    const rangeText = document.getElementById('leadPageRangeText');
    if (rangeText) {
      const scopeNote = (!isNumberedBatch && isCustomFilter) ? ' <span class="search-scope-badge">🌐 Nationwide Search</span>' : '';
      if (totalCount === 0) {
        rangeText.innerHTML = `Found <strong>0</strong> matching contractor targets${scopeNote}`;
      } else if (leadPageSize === 'all' || totalCount <= leadPageSize) {
        rangeText.innerHTML = `Showing all <strong>${totalCount}</strong> matching leads${scopeNote}`;
      } else {
        const startNum = (currentLeadPage - 1) * leadPageSize + 1;
        const endNum = Math.min(totalCount, currentLeadPage * leadPageSize);
        rangeText.innerHTML = `Showing <strong>${startNum}–${endNum}</strong> of <strong>${totalCount}</strong> leads${scopeNote}`;
      }
    }

    const pageNumEl = document.getElementById('pageNumberIndicator');
    if (pageNumEl) pageNumEl.textContent = `Page ${currentLeadPage} / ${totalPages}`;
    const btnPrev = document.getElementById('btnPrevPage');
    const btnNext = document.getElementById('btnNextPage');
    if (btnPrev) btnPrev.disabled = (currentLeadPage <= 1);
    if (btnNext) btnNext.disabled = (currentLeadPage >= totalPages);

    if (totalCount === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="11" style="text-align:center;padding:36px;color:var(--dim)">
        🔍 No contractor targets match your selected filters. 
        <button onclick="resetAllLeadFilters()" style="background:var(--accent);color:#070a0f;border:none;padding:6px 14px;border-radius:6px;font-weight:700;margin-left:10px;cursor:pointer">🔄 Reset Filters</button>
      </td>`;
      leadTableBody.appendChild(tr);
      updateQuotaHUD();
      return;
    }

    // Slice for active page view
    let displayed = [];
    if (leadPageSize === 'all') {
      displayed = filtered;
    } else {
      const start = (currentLeadPage - 1) * leadPageSize;
      displayed = filtered.slice(start, start + leadPageSize);
    }

    displayed.forEach(lead => {
      const isCalled = !!(CALL_RECORDS[lead.id] && CALL_RECORDS[lead.id].called);
      const rec = CALL_RECORDS[lead.id] || {};
      const leadState = lead.state || (lead.city.includes(', ') ? lead.city.split(', ')[1] : 'FL');
      const tr = document.createElement('tr');
      tr.id = `leadRow_${lead.id}`;
      if (isCalled) tr.classList.add('lead-row-called');

      tr.innerHTML = `
        <td>
          <div class="lead-status-box">
            <input type="checkbox" class="call-checkbox" data-id="${lead.id}" ${isCalled ? 'checked' : ''} title="Check off when called">
            <div>
              ${isCalled ? '<span class="status-badge status-badge-called">✓ Called</span>' : '<span class="status-badge status-badge-uncalled">⏳ To Call</span>'}
              ${isCalled && rec.caller ? `<div class="caller-tag">By ${rec.caller} · ${rec.timestamp || ''}</div>` : ''}
            </div>
          </div>
        </td>
        <td>
          <div class="lead-company-name" style="font-weight:700;color:#ffffff">${lead.company}</div>
          <div style="font-size:11px;color:var(--dim)">ID: ${lead.id} · Batch #${lead.batch}</div>
        </td>
        <td>
          <div style="font-weight:600;color:var(--accent2)">${lead.owner}</div>
          <div style="font-size:11.5px;color:var(--dim)">${lead.title}</div>
        </td>
        <td>
          <div>${lead.city}</div>
          <div style="font-size:11.5px;color:var(--dim)">${lead.trade} · <span style="color:var(--accent2);font-weight:700">${leadState}</span></div>
        </td>
        <td>
          <a href="tel:${lead.phone.replace(/[^0-9]/g, '')}" style="color:var(--blue);font-family:var(--font-mono);font-weight:700;text-decoration:none">${lead.phone}</a>
        </td>
        <td style="max-width:230px;overflow:hidden;text-overflow:ellipsis" title="${lead.painPoint}">
          <span style="font-size:12px;color:#e2e8f0">${lead.painPoint}</span>
        </td>
        <td>
          <span class="badge-leak" title="${getTradeBreakdown(lead.trade, lead.monthlyLoss)}">-$${lead.annualLoss.toLocaleString()}/yr</span>
          <div style="font-size:11px;color:var(--dim);margin-top:2px">$${lead.monthlyLoss.toLocaleString()}/mo</div>
        </td>
        <td>
          <span class="badge-save" title="Net profit kept after $697/mo VantorX Growth Tier">+$${Math.max(0, lead.annualLoss - 8364).toLocaleString()}/yr</span>
        </td>
        <td>
          ${getProductBadgeHtml(lead.product)}
        </td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <select class="outcome-select" data-id="${lead.id}">
              <option value="Left Voicemail" ${rec.outcome==='Left Voicemail'?'selected':''}>📞 Left Voicemail</option>
              <option value="Booked Demo" ${rec.outcome==='Booked Demo'?'selected':''}>🎉 Booked Demo</option>
              <option value="Callback Scheduled" ${rec.outcome==='Callback Scheduled'?'selected':''}>⏳ Callback</option>
              <option value="Not Interested" ${rec.outcome==='Not Interested'?'selected':''}>❌ Not Interested</option>
              <option value="Gatekeeper / No Answer" ${rec.outcome==='Gatekeeper / No Answer'?'selected':''}>🚫 Gatekeeper</option>
            </select>
            <button class="btn-note" data-id="${lead.id}" title="${rec.notes ? rec.notes : 'Click to add note'}">📝</button>
          </div>
          ${rec.notes ? `<div style="font-size:11px;color:var(--accent2);max-width:145px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px" title="${rec.notes}">"${rec.notes}"</div>` : ''}
        </td>
        <td style="text-align:right">
          <button class="btn-pitch-lead" data-id="${lead.id}">📞 Pitch Lead ➔</button>
        </td>
      `;
      leadTableBody.appendChild(tr);
    });

    // Wire Checkboxes
    document.querySelectorAll('.call-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = cb.dataset.id;
        if (cb.checked) {
          const lead = LEADS_DATA.find(l => l.id === id);
          const prevOutcome = CALL_RECORDS[id]?.outcome || 'Left Voicemail';
          const prevNotes = CALL_RECORDS[id]?.notes || '';
          CALL_RECORDS[id] = {
            called: true,
            caller: activeCaller,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            outcome: prevOutcome,
            notes: prevNotes
          };
          const u = getActiveUser();
          u.dailyDials = (u.dailyDials || 0) + 1;
          saveUserProfiles();
          updateDailyGoalsUI();
          showToast(`✓ Marked ${lead?.company || 'Lead'} as Called by ${activeCaller}!`);
        } else {
          if (CALL_RECORDS[id]) {
            CALL_RECORDS[id].called = false;
          }
          const u = getActiveUser();
          u.dailyDials = Math.max(0, (u.dailyDials || 1) - 1);
          saveUserProfiles();
          updateDailyGoalsUI();
          showToast('Unmarked call status.');
        }
        saveCallRecords();
        renderLeadsTable();
        updateQuotaHUD();
      });
    });

    // Wire Outcome Dropdowns
    document.querySelectorAll('.outcome-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.dataset.id;
        const outcome = sel.value;
        if (!CALL_RECORDS[id]) {
          CALL_RECORDS[id] = {
            called: true,
            caller: activeCaller,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            outcome: outcome,
            notes: ''
          };
        } else {
          CALL_RECORDS[id].called = true;
          CALL_RECORDS[id].outcome = outcome;
        }
        saveCallRecords();
        renderLeadsTable();
        updateQuotaHUD();
        showToast(`Outcome logged: ${outcome}`);
      });
    });

    // Wire Notes
    document.querySelectorAll('.btn-note').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const currentNote = CALL_RECORDS[id]?.notes || '';
        const lead = LEADS_DATA.find(l => l.id === id);
        const note = prompt(`Add a quick call note for ${lead?.company || 'this contractor'}:`, currentNote);
        if (note !== null) {
          if (!CALL_RECORDS[id]) {
            CALL_RECORDS[id] = { called: true, caller: activeCaller, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), outcome: 'Left Voicemail', notes: note.trim() };
          } else {
            CALL_RECORDS[id].notes = note.trim();
          }
          saveCallRecords();
          renderLeadsTable();
          showToast('✓ Note saved!');
        }
      });
    });

    // Wire Pitch Buttons
    document.querySelectorAll('.btn-pitch-lead').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        loadLeadIntoTeleprompter(btn.dataset.id);
      });
    });

    updateQuotaHUD();
  }

  function updateQuotaHUD() {
    const activeLimit = getActiveQueueLimit();
    const freshRange = getTodayFreshRange();

    let batchLeads = [];
    if (currentBatch === 'activeQueue') {
      batchLeads = LEADS_DATA.slice(0, activeLimit);
    } else if (currentBatch === 'todayFresh') {
      batchLeads = LEADS_DATA.slice(freshRange.start, freshRange.end);
    } else if (currentBatch === 'all') {
      batchLeads = LEADS_DATA;
    } else {
      const bNum = parseInt(currentBatch, 10);
      batchLeads = LEADS_DATA.filter(l => l.batch === bNum);
    }

    const totalInBatch = batchLeads.length;
    const calledInBatch = batchLeads.filter(l => CALL_RECORDS[l.id]?.called).length;
    const demosInBatch = batchLeads.filter(l => CALL_RECORDS[l.id]?.called && CALL_RECORDS[l.id]?.outcome === 'Booked Demo').length;
    const uncalledInBatch = Math.max(0, totalInBatch - calledInBatch);
    const pct = totalInBatch > 0 ? Math.round((calledInBatch / totalInBatch) * 100) : 0;

    const countEl = document.getElementById('quotaCount');
    const totalEl = document.getElementById('quotaTotal');
    const pctEl = document.getElementById('quotaPct');
    const barEl = document.getElementById('quotaBarFill');
    const chipU = document.getElementById('chipUncalled');
    const chipC = document.getElementById('chipCalled');
    const chipD = document.getElementById('chipDemos');

    if (countEl) countEl.textContent = calledInBatch;
    if (totalEl) totalEl.textContent = totalInBatch;
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;
    if (chipU) chipU.textContent = `⏳ ${uncalledInBatch} To Call`;
    if (chipC) chipC.textContent = `✓ ${calledInBatch} Called`;
    if (chipD) chipD.textContent = `🎉 ${demosInBatch} Demos`;

    const cAll = document.getElementById('countStatusAll');
    const cUnc = document.getElementById('countStatusUncalled');
    const cCal = document.getElementById('countStatusCalled');
    if (cAll) cAll.textContent = totalInBatch;
    if (cUnc) cUnc.textContent = uncalledInBatch;
    if (cCal) cCal.textContent = calledInBatch;

    // Update KPI Cards
    const kpiT = document.getElementById('kpiTargetCount');
    const kpiL = document.getElementById('kpiTotalLeak');
    const kpiA = document.getElementById('kpiAvgLeak');
    const kpiS = document.getElementById('kpiAvgSavings');

    if (kpiT) kpiT.textContent = `${totalInBatch} Contractors`;
    const totalLoss = batchLeads.reduce((acc, l) => acc + l.annualLoss, 0);
    if (kpiL) kpiL.textContent = `$${(totalLoss / 1000000).toFixed(2)}M / yr`;
    const avgLoss = totalInBatch > 0 ? Math.round(batchLeads.reduce((acc, l) => acc + l.monthlyLoss, 0) / totalInBatch) : 0;
    if (kpiA) kpiA.textContent = `$${avgLoss.toLocaleString()} / mo`;
    const avgSave = totalInBatch > 0 ? Math.round(batchLeads.reduce((acc, l) => acc + l.netSavings, 0) / totalInBatch) : 0;
    if (kpiS) kpiS.textContent = `+$${avgSave.toLocaleString()} / yr`;
  }

  // Batch Select Listener
  const batchSelectEl = document.getElementById('batchSelect');
  if (batchSelectEl) {
    batchSelectEl.addEventListener('change', (e) => {
      currentBatch = e.target.value;
      currentLeadPage = 1;
      updateBatchHeading();
      renderLeadsTable();
      updateQuotaHUD();
      showToast(`✓ Switched view: ${batchSelectEl.options[batchSelectEl.selectedIndex].text}`);
    });
  }

  // Add +25 Leads Button Listener
  const btnAdd25Leads = document.getElementById('btnAdd25Leads');
  if (btnAdd25Leads) {
    btnAdd25Leads.addEventListener('click', () => {
      const curLimit = getActiveQueueLimit();
      if (curLimit >= LEADS_DATA.length) {
        showToast('⭐ All 250 nationwide leads are already unlocked in your queue!');
        return;
      }
      manualAdditions += 25;
      try {
        localStorage.setItem('vantorx_manual_lead_additions', String(manualAdditions));
      } catch(e) {}
      const newLimit = getActiveQueueLimit();
      currentBatch = 'activeQueue';
      currentLeadPage = 1;
      if (batchSelectEl) batchSelectEl.value = 'activeQueue';
      updateBatchHeading();
      renderLeadsTable();
      updateQuotaHUD();
      playSound('levelup');
      showToast(`⚡ Unlocked +25 Fresh Leads! Active queue now: ${newLimit} targets.`);
    });
  }

  // State Filter Select Listener
  const stateFilterEl = document.getElementById('stateFilterSelect');
  if (stateFilterEl) {
    stateFilterEl.addEventListener('change', (e) => {
      currentStateFilter = e.target.value;
      currentLeadPage = 1;
      renderLeadsTable();
      showToast(`State filter: ${currentStateFilter.toUpperCase()}`);
    });
  }

  // Call Status Filter Pills Listener
  document.querySelectorAll('[data-status-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-status-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStatusFilter = btn.dataset.statusFilter;
      currentLeadPage = 1;
      renderLeadsTable();
    });
  });

  // Product Filter Pills Listener (Scoped to Leads Table)
  document.querySelectorAll('#leadProductFilters [data-lead-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#leadProductFilters [data-lead-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentProductFilter = btn.dataset.leadFilter;
      currentLeadPage = 1;
      renderLeadsTable();
    });
  });

  // Search Input Listener
  const searchInputEl = document.getElementById('leadSearchInput');
  if (searchInputEl) {
    searchInputEl.addEventListener('input', (e) => {
      leadSearchQuery = e.target.value;
      currentLeadPage = 1;
      renderLeadsTable();
    });
  }

  // Reset Calls Button Listener
  const resetCallsBtnEl = document.getElementById('resetCallsBtn');
  if (resetCallsBtnEl) {
    resetCallsBtnEl.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all checked calls and history for this browser?')) {
        CALL_RECORDS = {};
        saveCallRecords();
        renderLeadsTable();
        showToast('✓ Call tracker reset to zero.');
      }
    });
  }

  // Export CSV Listener
  document.getElementById('exportLeadsCsvBtn').addEventListener('click', () => {
    let csv = 'ID,Company,Owner,Title,City,State,Trade,Phone,Service,AnnualLeak,NetSavings,CallStatus,CalledBy,CallTimestamp,Outcome,Notes\n';
    LEADS_DATA.forEach(l => {
      const rec = CALL_RECORDS[l.id] || {};
      const status = rec.called ? 'Called' : 'Uncalled';
      const caller = rec.caller || '';
      const ts = rec.timestamp || '';
      const outcome = rec.outcome || '';
      const notes = (rec.notes || '').replace(/"/g, '""');
      const leadState = l.state || (l.city.includes(', ') ? l.city.split(', ')[1] : 'FL');
      csv += `"${l.id}","${l.company}","${l.owner}","${l.title}","${l.city}","${leadState}","${l.trade}","${l.phone}","${l.service}",${l.annualLoss},${l.netSavings},"${status}","${caller}","${ts}","${outcome}","${notes}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VantorX_Nationwide_Leads_250_with_Call_Logs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ 250 Leads with Call Logs exported to CSV!');
  });

  // ============================================================
  // 🎯 LOAD LEAD INTO MULTI-PRODUCT TELEPROMPTER
  // ============================================================
  let activeLead = LEADS_DATA[0];

  function updatePrompterCallStatus(leadId) {
    const rec = CALL_RECORDS[leadId];
    const statusBadge = document.getElementById('prompterStatusBadge');
    const toggleBtn = document.getElementById('prompterToggleCallBtn');
    if (!statusBadge || !toggleBtn) return;

    if (rec && rec.called) {
      statusBadge.className = 'status-badge status-badge-called';
      statusBadge.textContent = `✓ Called by ${rec.caller || 'Rep'} (${rec.outcome || 'Logged'})`;
      toggleBtn.textContent = '✕ Mark as Uncalled';
      toggleBtn.style.color = '#f87171';
      toggleBtn.style.borderColor = 'rgba(248,113,113,0.5)';
    } else {
      statusBadge.className = 'status-badge status-badge-uncalled';
      statusBadge.textContent = '⏳ To Call';
      toggleBtn.textContent = '✓ Mark as Called';
      toggleBtn.style.color = '#6ee7b7';
      toggleBtn.style.borderColor = 'rgba(52,211,153,0.5)';
    }
  }

  // In-prompter Mark as Called Button Listener
  const prompterToggleBtnEl = document.getElementById('prompterToggleCallBtn');
  if (prompterToggleBtnEl) {
    prompterToggleBtnEl.addEventListener('click', () => {
      if (!activeLead) return;
      const id = activeLead.id;
      const isCalled = !!(CALL_RECORDS[id] && CALL_RECORDS[id].called);
      if (isCalled) {
        CALL_RECORDS[id].called = false;
        showToast(`Unmarked ${activeLead.company} as called.`);
      } else {
        const prevOutcome = CALL_RECORDS[id]?.outcome || 'Left Voicemail';
        const prevNotes = CALL_RECORDS[id]?.notes || '';
        CALL_RECORDS[id] = {
          called: true,
          caller: activeCaller,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          outcome: prevOutcome,
          notes: prevNotes
        };
        showToast(`✓ Marked ${activeLead.company} as CALLED by ${activeCaller}!`);
      }
      saveCallRecords();
      updatePrompterCallStatus(activeLead.id);
      renderLeadsTable();
    });
  }

  function loadLeadIntoTeleprompter(leadId) {
    const lead = LEADS_DATA.find(l => l.id === leadId);
    if (!lead) return;
    activeLead = lead;

    // 1. Copy phone to clipboard
    navigator.clipboard.writeText(lead.phone);
    showToast(`✓ Copied ${lead.phone} — Loaded ${lead.company}!`);

    // 2. Update Banner
    document.getElementById('activeLeadName').textContent = lead.company;
    document.getElementById('activeLeadOwner').textContent = `${lead.owner} (${lead.title})`;
    const leadState = lead.state || (lead.city.includes(', ') ? lead.city.split(', ')[1] : 'FL');
    document.getElementById('activeLeadLocation').textContent = `${lead.city} · ${lead.trade}`;
    const netSaved = Math.max(0, lead.annualLoss - 8364);
    document.getElementById('activeLeadLoss').textContent = `-$${lead.annualLoss.toLocaleString()} / year ($${lead.monthlyLoss.toLocaleString()}/mo)`;
    document.getElementById('activeLeadSavings').textContent = `+$${netSaved.toLocaleString()} / year`;
    const bDown = document.getElementById('activeLeadLeakBreakdown');
    if (bDown) bDown.textContent = getTradeBreakdown(lead.trade, lead.monthlyLoss);
    document.getElementById('activeLeadCallBtn').href = `tel:${lead.phone.replace(/[^0-9]/g, '')}`;
    document.getElementById('activeLeadCallBtn').textContent = `📞 Call ${lead.phone}`;

    const prodNames = { ava: 'Ava 24/7 Voice', website: 'Custom Website', speed: 'Speed-to-Lead', aeo: 'AEO & Reviews', bundle: 'Full Bundle' };
    document.getElementById('activeLeadProdBadge').textContent = prodNames[lead.product] || 'VantorX';

    // 3. Dynamic Leak Hook
    let hook = `"${lead.owner}, looking at ${lead.company} in ${lead.city} — ${lead.painPoint.toLowerCase()} is leaking an estimated $${lead.annualLoss.toLocaleString()} a year to competitors. Where does that call ring for you right now?"`;
    if (lead.product === 'website') {
      hook = `"${lead.owner}, looking at ${lead.company}'s mobile site in ${lead.city} — with ${lead.painPoint.toLowerCase()}, that bounce rate is leaking an estimated $${lead.annualLoss.toLocaleString()} a year. Who handles your website right now?"`;
    } else if (lead.product === 'speed') {
      hook = `"${lead.owner}, 78% of homeowners in ${lead.city} hire the contractor who responds first. When you miss calls on a job site, that response delay is leaking an estimated $${lead.annualLoss.toLocaleString()} a year. How fast do new leads get an SMS right now?"`;
    }
    document.getElementById('activeLeadLeakQuote').innerHTML = `💡 <strong>Your Opening Leak Hook for ${lead.owner}:</strong> ${hook}`;

    // 4. Update Prompter Call Status Badge
    updatePrompterCallStatus(lead.id);

    // 5. Update all dynamic placeholders in scripts
    document.querySelectorAll('.dyn-owner').forEach(el => el.textContent = lead.owner);
    document.querySelectorAll('.dyn-company').forEach(el => el.textContent = lead.company);
    document.querySelectorAll('.dyn-city').forEach(el => el.textContent = lead.city);
    document.querySelectorAll('.dyn-trade').forEach(el => el.textContent = lead.trade);
    document.querySelectorAll('.dyn-loss').forEach(el => el.textContent = `$${lead.annualLoss.toLocaleString()}/yr ($${lead.monthlyLoss.toLocaleString()}/mo)`);

    // 6. Switch to Product Script
    switchProductScript(lead.product);

    // 7. Switch to Teleprompter Tab & Scroll
    switchTab('tabScript');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  // Clear Active Lead
  document.getElementById('clearActiveLeadBtn').addEventListener('click', () => {
    document.getElementById('activeLeadName').textContent = 'Generic Contractor Target';
    document.getElementById('activeLeadOwner').textContent = '[Owner Name]';
    document.getElementById('activeLeadLocation').textContent = '[City, State] · [Trade]';
    document.getElementById('activeLeadLoss').textContent = '-$96,000 / year';
    document.getElementById('activeLeadSavings').textContent = '+$92,412 / year';
    document.querySelectorAll('.dyn-owner').forEach(el => el.textContent = '[Owner]');
    document.querySelectorAll('.dyn-company').forEach(el => el.textContent = '[Company]');
    document.querySelectorAll('.dyn-city').forEach(el => el.textContent = '[City]');
    document.querySelectorAll('.dyn-trade').forEach(el => el.textContent = '[Trade]');
    const statusBadge = document.getElementById('prompterStatusBadge');
    if (statusBadge) {
      statusBadge.className = 'status-badge status-badge-uncalled';
      statusBadge.textContent = '⏳ To Call';
    }
    showToast('Reset to generic script placeholders.');
  });

  // Product Switcher
  const prodSwitchBtns = document.querySelectorAll('.prod-switch-btn');
  const prodScriptPanels = document.querySelectorAll('.product-script-panel');
  let currentActiveProduct = 'ava';

  function switchProductScript(prodKey) {
    currentActiveProduct = prodKey;
    prodSwitchBtns.forEach(btn => {
      if (btn.dataset.product === prodKey) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    prodScriptPanels.forEach(panel => {
      if (panel.id === `scriptPanel_${prodKey}`) panel.classList.add('active');
      else panel.classList.remove('active');
    });
  }

  prodSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => switchProductScript(btn.dataset.product));
  });

  // Copy Active Script
  document.getElementById('copyCurrentProductScriptBtn').addEventListener('click', () => {
    const activePanel = document.querySelector('.product-script-panel.active');
    if (activePanel) {
      navigator.clipboard.writeText(activePanel.innerText).then(() => {
        showToast('✓ Active product script & objections copied!');
      });
    }
  });

  // ============================================================
  // 🛡️ POPULATE TAB 4: 45+ MASTER OBJECTION BATTLECARDS LIBRARY
  // ============================================================
  const objCardsContainer = document.getElementById('objCardsContainer');

  function renderMasterObjectionCards(filterCategory = 'all', searchQuery = '') {
    objCardsContainer.innerHTML = '';
    const q = searchQuery.toLowerCase().trim();

    document.querySelectorAll('.obj-accordion').forEach(acc => {
      const parentPanel = acc.closest('.product-script-panel') || acc.closest('#objGroup_ava');
      let cat = 'ava';
      if (parentPanel) {
        if (parentPanel.id.includes('website')) cat = 'website';
        else if (parentPanel.id.includes('speed')) cat = 'speed';
        else if (parentPanel.id.includes('aeo')) cat = 'aeo';
        else if (parentPanel.id.includes('bundle')) cat = 'bundle';
      }

      if (filterCategory !== 'all' && filterCategory !== cat) return;

      const title = acc.querySelector('.obj-acc-head span').textContent;
      const body = acc.querySelector('.obj-acc-body').innerHTML;

      if (q && !title.toLowerCase().includes(q) && !body.toLowerCase().includes(q)) return;

      const card = document.createElement('div');
      card.className = 'obj-card';
      card.style.background = 'var(--bg2)';
      card.style.border = '1px solid var(--line2)';
      card.style.borderRadius = '16px';
      card.style.padding = '20px';
      card.style.marginBottom = '14px';

      card.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="font-size:16px;font-weight:700;color:#fca5a5">${title}</div>
          ${getProductBadgeHtml(cat)}
        </div>
        <div style="font-size:15px;font-weight:500;color:#ffffff;background:#070a0f;border:1px solid #1e293b;border-radius:12px;padding:14px 18px;line-height:1.6">
          ${body}
        </div>
      `;
      objCardsContainer.appendChild(card);
    });
  }

  // Objection Filter Pills (Scoped to Objection Library)
  document.querySelectorAll('#objFilterPills .obj-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#objFilterPills .obj-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderMasterObjectionCards(pill.dataset.objFilter, document.getElementById('objLibrarySearchInput').value);
    });
  });

  document.getElementById('objLibrarySearchInput').addEventListener('input', (e) => {
    const activePill = document.querySelector('#objFilterPills .obj-pill.active');
    const filter = activePill ? activePill.dataset.objFilter : 'all';
    renderMasterObjectionCards(filter, e.target.value);
  });

  // ============================================================
  // 🎮 RPG GAME ENGINE 2.0 (Cold Call Quest)
  // ============================================================
  let voiceEnabled = true;
  const voiceBtn = document.getElementById('voiceToggleBtn');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      voiceEnabled = !voiceEnabled;
      voiceBtn.textContent = voiceEnabled ? '🗣️ Voice: ON' : '🗣️ Voice: MUTED';
      voiceBtn.style.color = voiceEnabled ? 'var(--accent2)' : 'var(--dim)';
    });
  }

  function speakContractor(text, bossKey) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/\([^)]*\)/g, '').trim();
      if (!clean) return;
      const utt = new SpeechSynthesisUtterance(clean);
      if (bossKey === 'gatekeeper') {
        utt.pitch = 1.15;
        utt.rate = 1.0;
      } else if (bossKey === 'skeptic') {
        utt.pitch = 0.82;
        utt.rate = 0.98;
      } else if (bossKey === 'price') {
        utt.pitch = 0.95;
        utt.rate = 1.12;
      } else {
        utt.pitch = 0.86;
        utt.rate = 1.04;
      }
      window.speechSynthesis.speak(utt);
    } catch(e) {}
  }

  let player = {
    lvl: 1,
    title: 'Rookie Phone Warrior',
    hp: 100,
    maxHp: 100,
    xp: 0,
    nextLvlXp: 100,
    streak: 0,
    dmgMultiplier: 1.0
  };

  const ranks = [
    { lvl: 1, title: 'Rookie Phone Warrior', swordId: 'sword1', unlockName: '🗡️ Rusty Dagger of Directness', hpBonus: 0, mult: 1.0 },
    { lvl: 2, title: 'Cold Call Paladin', swordId: 'sword2', unlockName: '⚔️ Broadsword of the $8,000 Leak', hpBonus: 25, mult: 1.1 },
    { lvl: 3, title: 'Objection Slayer', swordId: 'sword3', unlockName: '🗡️✨ Obsidian Katana of Radical Honesty', hpBonus: 50, mult: 1.2 },
    { lvl: 4, title: 'Closing Centurion', swordId: 'sword4', unlockName: '🛡️ Aegis of Total Agreement', hpBonus: 75, mult: 1.3 },
    { lvl: 5, title: 'Mythic Rainmaker', swordId: 'sword5', unlockName: '⚡⚔️ Excalibur of Ava (561) 813-8602', hpBonus: 100, mult: 1.5 }
  ];

  const dungeons = {
    roofer: {
      key: 'roofer',
      name: 'Rick "The Road Rager"',
      title: 'Dungeon: I-95 Traffic Jam · Tampa, FL',
      avatar: '🚛',
      maxHp: 100,
      hp: 100,
      baseDmg: 18,
      status: 'Hostile & Guarded',
      intro: "(Heavy diesel engine & traffic horns) Yeah this is Rick. Make it quick man, I'm backing up a trailer on a job site.",
      dialogue: {
        stage1: "(Traffic honk) Make it quick man, I'm backing up a trailer on a job site. Who is this and what do you want?",
        stage2: "Look kid, I got 3 roofing crews out in Hillsborough County and my cell's on 24/7. I don't miss jobs.",
        stage3: "I'm slammed today, man. Just shoot me an email with your info and maybe I'll look at it Sunday night.",
        stage4: "I don't trust some robotic computer answering my roofing customers. They want a real human.",
        stage5: "Hah... alright, fine. What's the damn number? Let me hear how this Ava sounds.",
        victory: "Holy shit... she answered on the first ring and asked if it was shingle or metal tile. Alright Luke, you won me over. Shoot me a text with setup info."
      },
      hints: {
        stage1: 'Rick is impatient in traffic. Disarm him immediately: "Luke from VantorX. I know you weren\'t expecting my call — got 20 seconds or should I hang up?"',
        stage2: 'Expose the missed revenue: "In roofing, when an emergency leak calls at 8 PM on a Saturday, most guys send it to voicemail and lose an $8,000 job. Where does that call ring for you right now?"',
        stage3: 'Deflect the email brush-off: "Happy to send an email, but it\'ll get buried under 50 supply receipts. Take 15 seconds to dial our demo line right now."',
        stage4: 'Use the Total Agreement Shield: "I completely agree with you! Most AI sounds like a robot. Punch in (561) 813-8602 right now. If she sounds fake, hang up and lose my number."',
        stage5: 'Close the deal: "Punch in (561) 813-8602 right now, or let me text you the direct demo line."'
      }
    },
    gatekeeper: {
      key: 'gatekeeper',
      name: 'Karen "The Iron Gatekeeper"',
      title: 'Dungeon: The Front Desk Citadel · Orlando, FL',
      avatar: '👩‍💼',
      maxHp: 120,
      hp: 120,
      baseDmg: 20,
      status: 'Guarded Sentinel',
      intro: "Premier Mechanical, Karen speaking. The owner is unavailable. What company are you with and what is this regarding?",
      dialogue: {
        stage1: "He is tied up right now. What company are you with and what is this regarding?",
        stage2: "We don't take unsolicited sales calls. If you're selling marketing or software, I can take a message.",
        stage3: "We already have an answering service that picks up when we're closed, thanks.",
        stage4: "Mr. Davis doesn't have time to test demo phone numbers.",
        stage5: "Well... if it actually prevents missed weekend dispatch calls, I can put you on his calendar for tomorrow.",
        victory: "I'll transfer you directly to Mr. Davis's mobile right now, Luke. Hold on one second."
      },
      hints: {
        stage1: 'Use peer familiarity: "Hey Karen! Is the owner around? It\'s Luke — quick question about your weekend dispatch routing in Orlando."',
        stage2: 'Frame as operations, not sales: "Just had a quick operational question about your after-hours emergency call routing. Is he out on a job site right now or in later?"',
        stage3: 'Highlight the human answering service flaws: "Answering services put callers on hold for 5 minutes and charge $2/min. Ava answers in 1 ring and books calendar jobs instantly."',
        stage4: 'Challenge the test: "Punch in (561) 813-8602 right now on your desk phone. If Ava sounds like a robot, you can hang up on me forever."',
        stage5: 'Ask for the transfer: "Let\'s put 10 minutes on his calendar for tomorrow morning, or patch me through to his mobile."'
      }
    },
    skeptic: {
      key: 'skeptic',
      name: 'Mike "The Robot Crusher"',
      title: 'Dungeon: The Old-School Garage · West Palm, FL',
      avatar: '🔧',
      maxHp: 150,
      hp: 150,
      baseDmg: 24,
      status: 'Skeptical & Combative',
      intro: "Mike here. Look, if this is about AI software, don't waste your breath. Real humans only.",
      dialogue: {
        stage1: "Mike here. Don't sell me crap. Who are you?",
        stage2: "I've got 4 master electricians running calls all over Palm Beach. We're booked out 3 weeks. Why do I care?",
        stage3: "I despise AI. Every robo-caller sounds like a broken microwave. Real humans only.",
        stage4: "You really think a machine can handle an electrical panel emergency at midnight?",
        stage5: "Alright, you're confident. Give me the number. If it sounds fake, you're blocked.",
        victory: "Holy cow... that thing answered in one ring, asked for the panel amperage, and booked an emergency slot. Alright Luke, you proved your point. Let's do a demo."
      },
      hints: {
        stage1: 'Disarm his hostility: "Luke from VantorX. Got 20 seconds or should I hang up?"',
        stage2: 'Hit the emergency pain: "You\'re booked out 3 weeks on standard jobs, but when an $8,000 panel emergency rings at 8 PM on a Saturday, where does that call ring right now?"',
        stage3: 'Shield agreement: "I agree with you 100%! Most AI sounds awful. That\'s why we trained Ava specifically on trade jargon."',
        stage4: 'The Ava Demo Drop: "I just texted our live line (561) 813-8602 to your cell. Tap it on speaker when you park; if she sounds like a robot, you never have to talk to me again."',
        stage5: 'Lock the agreement: "I just texted (561) 813-8602 to your cell. Tap it on speaker when you wrap, or let\'s put 10 minutes on your calendar tomorrow morning."'
      }
    },
    price: {
      key: 'price',
      name: 'Dave "The Budget Dragon"',
      title: 'Dungeon: The P&L Treasury · Miami, FL',
      avatar: '💰',
      maxHp: 180,
      hp: 180,
      baseDmg: 28,
      status: 'Wallet Clenched',
      intro: "Dave speaking. I get 20 cold calls a day. Tell me what you're selling in 10 seconds or lose my number.",
      dialogue: {
        stage1: "Dave speaking. I get 20 sales calls a day. What do you want?",
        stage2: "I'm not looking to spend thousands of dollars on fancy tech right now. Economy is tight.",
        stage3: "Cut the fluff. How much is this thing gonna cost me every single month?",
        stage4: "I bet there's a 12-month lock-in contract and hidden fees.",
        stage5: "Zero long-term contracts and $397? And it pays for itself with one single emergency call?",
        victory: "Alright Luke, the math makes total sense. Text me your link right now, I'm locking this in before my competitor does."
      },
      hints: {
        stage1: 'Respect his timebox: "Luke from VantorX. Got 20 seconds or should I hang up?"',
        stage2: 'Anchor to revenue loss: "In Miami plumbing, when an $8,000 emergency water heater job calls at 8 PM on a Saturday, where does that call ring right now?"',
        stage3: 'Deliver the price anchor: "Zero long-term contracts, $397 a month flat. One single emergency job pays for the entire year."',
        stage4: 'Prove zero risk: "No long-term contracts, cancel anytime. Plus you test her free right now: (561) 813-8602."',
        stage5: 'Close on the ROI: "Text me your cell right now or dial (561) 813-8602 to test Ava."'
      }
    }
  };

  let currentDungeonKey = 'roofer';
  let currentBoss = Object.assign({}, dungeons.roofer);
  let currentStage = 1;
  let matchStarted = false;
  let matchHistory = [];
  let conversationMemory = {
    turns: 0,
    rapportUnlocked: false,
    painUnlocked: false,
    objectionUnlocked: false,
    demoUnlocked: false,
    agreementUnlocked: false,
    bossResistance: 100,
    bossMood: 'Hostile & Guarded'
  };
  const IMPATIENCE_MAX = 120; // 2 minutes conversational clock
  let impatienceRemaining = IMPATIENCE_MAX;
  let impatienceInterval = null;

  function formatImpatience(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  const playerHpBar = document.getElementById('playerHpBar');
  const playerHpText = document.getElementById('playerHpText');
  const playerXpBar = document.getElementById('playerXpBar');
  const playerXpText = document.getElementById('playerXpText');
  const playerLvlBadge = document.getElementById('playerLvlBadge');
  const playerRankTitle = document.getElementById('playerRankTitle');
  const streakCount = document.getElementById('streakCount');

  const bossAvatar = document.getElementById('bossAvatar');
  const bossName = document.getElementById('bossName');
  const bossDungeonTitle = document.getElementById('bossDungeonTitle');
  const bossHpBar = document.getElementById('bossHpBar');
  const bossHpText = document.getElementById('bossHpText');
  const bossHpPercent = document.getElementById('bossHpPercent');
  const bossStageLabel = document.getElementById('bossStageLabel');
  const bossStatusText = document.getElementById('bossStatusText');
  const combatLog = document.getElementById('combatLog');
  const turnIndicator = document.getElementById('turnIndicator');

  const impatienceDigits = document.getElementById('impatienceDigits');
  const impatienceFill = document.getElementById('impatienceFill');
  const impatienceWarn = document.getElementById('impatienceWarn');
  const sendAttackBtn = document.getElementById('sendAttackBtn');
  const customAttackInput = document.getElementById('customAttackInput');
  const coachHintDrawer = document.getElementById('coachHintDrawer');
  const coachHintText = document.getElementById('coachHintText');
  const requestHintBtn = document.getElementById('requestHintBtn');
  const closeHintBtn = document.getElementById('closeHintBtn');

  const stageSteps = [
    document.getElementById('stageStep1'),
    document.getElementById('stageStep2'),
    document.getElementById('stageStep3'),
    document.getElementById('stageStep4'),
    document.getElementById('stageStep5')
  ];

  function updateHUD() {
    const hpPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    playerHpBar.style.width = hpPct + '%';
    playerHpText.textContent = `${player.hp} / ${player.maxHp}`;
    if (hpPct < 30) playerHpBar.style.background = '#ef4444';
    else playerHpBar.style.background = 'linear-gradient(90deg, #ef4444, #22c55e)';

    const xpPct = Math.min(100, (player.xp / player.nextLvlXp) * 100);
    playerXpBar.style.width = xpPct + '%';
    playerXpText.textContent = `${player.xp} / ${player.nextLvlXp} XP`;

    playerLvlBadge.textContent = `LVL ${player.lvl}`;
    playerRankTitle.textContent = player.title;
    streakCount.textContent = `🔥 ${player.streak}`;

    const bPct = Math.max(0, Math.min(100, (currentBoss.hp / currentBoss.maxHp) * 100));
    bossHpBar.style.width = bPct + '%';
    bossHpText.textContent = `${Math.max(0, currentBoss.hp)} / ${currentBoss.maxHp}`;
    bossHpPercent.textContent = Math.round(bPct) + '%';

    if (stageSteps && stageSteps.length === 5) {
      stageSteps[0].classList.remove('active', 'done');
      stageSteps[1].classList.remove('active', 'done');
      stageSteps[2].classList.remove('active', 'done');
      stageSteps[3].classList.remove('active', 'done');
      stageSteps[4].classList.remove('active', 'done');

      if (conversationMemory.rapportUnlocked) stageSteps[0].classList.add('done');
      else stageSteps[0].classList.add('active');

      if (conversationMemory.painUnlocked) stageSteps[1].classList.add('done');
      else if (conversationMemory.rapportUnlocked) stageSteps[1].classList.add('active');

      if (conversationMemory.objectionUnlocked) stageSteps[2].classList.add('done');
      else if (conversationMemory.painUnlocked) stageSteps[2].classList.add('active');

      if (conversationMemory.demoUnlocked) stageSteps[3].classList.add('done');
      else if (conversationMemory.objectionUnlocked) stageSteps[3].classList.add('active');

      if (conversationMemory.agreementUnlocked) stageSteps[4].classList.add('done');
      else if (conversationMemory.demoUnlocked) stageSteps[4].classList.add('active');
    }

    let unlockedMilestones = 0;
    if (conversationMemory.rapportUnlocked) unlockedMilestones++;
    if (conversationMemory.painUnlocked) unlockedMilestones++;
    if (conversationMemory.objectionUnlocked) unlockedMilestones++;
    if (conversationMemory.demoUnlocked) unlockedMilestones++;
    if (conversationMemory.agreementUnlocked) unlockedMilestones++;

    bossStageLabel.textContent = `Milestones: ${unlockedMilestones} / 5 Done`;
    bossStatusText.textContent = currentBoss.status || 'Defensive';
  }

  function appendLog(html, type) {
    const row = document.createElement('div');
    row.className = `log-row log-${type}`;
    row.innerHTML = html;
    combatLog.appendChild(row);
    combatLog.scrollTop = combatLog.scrollHeight;
  }

  function startImpatienceTimer() {
    if (!matchStarted) return;
    if (impatienceInterval) clearInterval(impatienceInterval);
    if (impatienceWarn) {
      impatienceWarn.textContent = '⚠️ 2 min pause or hesitation = Boss regains +20 HP!';
      impatienceWarn.style.color = 'var(--err)';
    }
    impatienceRemaining = IMPATIENCE_MAX;
    impatienceDigits.textContent = formatImpatience(impatienceRemaining);
    impatienceDigits.classList.remove('urgent');
    impatienceFill.style.width = '100%';

    impatienceInterval = setInterval(() => {
      if (player.hp <= 0 || currentBoss.hp <= 0) {
        clearInterval(impatienceInterval);
        return;
      }

      impatienceRemaining--;
      impatienceDigits.textContent = formatImpatience(impatienceRemaining);
      impatienceFill.style.width = (impatienceRemaining / IMPATIENCE_MAX * 100) + '%';

      if (impatienceRemaining <= 15) {
        impatienceDigits.classList.add('urgent');
      }

      if (impatienceRemaining <= 0) {
        clearInterval(impatienceInterval);
        impatienceDigits.classList.remove('urgent');

        const regenAmount = 20;
        currentBoss.hp = Math.min(currentBoss.maxHp, currentBoss.hp + regenAmount);
        const playerDmg = 15;
        player.hp = Math.max(0, player.hp - playerDmg);

        playSound('hit');

        const impatientQuotes = [
          `"Hey Luke! You still there? I don't get paid to sit on the phone listening to dead air. I'm hanging up!"`,
          `"Look, I've got a crew waiting on me. If you don't have something to say, lose my number!"`,
          `"Hello? Are you still on the line? Man, stop wasting my time!"`
        ];
        const bark = impatientQuotes[Math.floor(Math.random() * impatientQuotes.length)];

        appendLog(`<strong>${currentBoss.name} shouts:</strong> ${bark}`, 'boss');
        appendLog(`⚠️ <strong>DEAD AIR PENALTY:</strong> 2-minute hesitation allowed contractor to regain composure! Boss <strong>regained +${regenAmount} HP</strong> (+${regenAmount} Resistance). You took <strong>${playerDmg} Rejection Damage</strong>!`, 'regen');

        appendLog(`
          <div class="coach-head">
            <span class="coach-title">🧑‍🏫 <strong>COACH VANCE WARNING</strong></span>
            <span class="coach-grade-badge grade-f">GRADE F · DEAD AIR</span>
          </div>
          <div class="coach-critique">Contractors are busy and impatient. 2 minutes of silence kills call momentum and triggers hang-up resistance. Keep your momentum!</div>
          <div class="coach-prescription">💡 <strong>Coach Tip:</strong> When stuck, ask for permission or state: <em>"Where does an $8k emergency call ring right now?"</em></div>
        `, 'coach');

        speakContractor(bark);
        updateHUD();

        if (player.hp <= 0) {
          playerKnockout();
        } else {
          startImpatienceTimer();
        }
      }
    }, 1000);
  }

  function pauseImpatienceTimer() {
    if (impatienceInterval) clearInterval(impatienceInterval);
  }

  function startDungeon(key) {
    pauseImpatienceTimer();
    matchStarted = false;
    currentDungeonKey = key;
    currentBoss = Object.assign({}, dungeons[key]);
    currentBoss.hp = currentBoss.maxHp;
    currentStage = 1;
    currentBoss.status = 'Hostile & Guarded';

    conversationMemory = {
      turns: 0,
      rapportUnlocked: false,
      painUnlocked: false,
      objectionUnlocked: false,
      demoUnlocked: false,
      agreementUnlocked: false,
      bossResistance: currentBoss.maxHp,
      bossMood: 'Hostile & Guarded'
    };
    matchHistory = [
      { role: 'assistant', content: currentBoss.dialogue.stage1 }
    ];

    bossAvatar.textContent = currentBoss.avatar;
    bossName.textContent = currentBoss.name;
    bossDungeonTitle.textContent = currentBoss.title;

    combatLog.innerHTML = '';
    appendLog(`⚔️ <strong>ENTERED ${currentBoss.title.toUpperCase()}</strong>`, 'system');
    appendLog(`<strong>${currentBoss.name}:</strong> "${currentBoss.dialogue.stage1}"`, 'boss');
    appendLog(`⏸️ <strong>READY TO ENGAGE:</strong> Game clock is paused. The match and 2-minute conversational clock will start when you send your first reply!`, 'system');
    turnIndicator.textContent = 'GAME PAUSED: SEND YOUR FIRST CHAT TO START';

    impatienceRemaining = IMPATIENCE_MAX;
    impatienceDigits.textContent = 'READY · 2:00';
    impatienceDigits.classList.remove('urgent');
    impatienceFill.style.width = '100%';
    if (impatienceWarn) {
      impatienceWarn.textContent = '⏸️ Game clock paused — starts when you send your first reply!';
      impatienceWarn.style.color = 'var(--accent2)';
    }

    if (sendAttackBtn) sendAttackBtn.innerHTML = '⚔️ Send First Reply ➔';
    if (customAttackInput) customAttackInput.placeholder = 'Send your first reply to start the game and begin the call...';

    speakContractor(currentBoss.dialogue.stage1, currentBoss.key);

    updateHUD();
  }

  function addXP(amount) {
    player.xp += amount;
    playSound('xp');
    appendLog(`✨ Gained <strong>+${amount} XP</strong>!`, 'system');

    if (player.xp >= player.nextLvlXp) {
      player.xp -= player.nextLvlXp;
      player.lvl++;
      player.nextLvlXp = Math.round(player.nextLvlXp * 1.5);

      const rank = ranks.find(r => r.lvl === player.lvl) || {
        title: 'Legendary Rainmaker',
        swordId: 'sword5',
        unlockName: '⚡ Mythic Staff',
        hpBonus: 100,
        mult: 1.5
      };
      player.title = rank.title;
      player.maxHp = 100 + rank.hpBonus;
      player.hp = player.maxHp;
      player.dmgMultiplier = rank.mult;

      const swordEl = document.getElementById(rank.swordId);
      if (swordEl) {
        swordEl.classList.remove('locked');
        swordEl.classList.add('equipped');
      }

      playSound('levelup');
      document.getElementById('modalNewLevelTitle').textContent = `Level ${player.lvl}: ${player.title}`;
      document.getElementById('modalUnlockDesc').innerHTML = `You unlocked: <strong>${rank.unlockName}</strong>! Rejection Armor increased to ${player.maxHp} HP (+${Math.round((rank.mult-1)*100)}% DMG).`;
      document.getElementById('levelUpModal').classList.add('active');
    }
    updateHUD();
  }

  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('levelUpModal').classList.remove('active');
  });

  requestHintBtn.addEventListener('click', () => {
    let hint = '';
    if (!conversationMemory.rapportUnlocked) {
      hint = currentBoss.hints.stage1 || 'Disarm with 20 seconds permission: "Luke from VantorX. Got 20 seconds or should I hang up?"';
    } else if (!conversationMemory.painUnlocked) {
      hint = currentBoss.hints.stage2 || 'Expose the after-hours leak: "Where does an $8,000 Saturday emergency call ring right now?"';
    } else if (!conversationMemory.objectionUnlocked) {
      hint = currentBoss.hints.stage3 || 'Use Total Agreement Shield: "I completely agree with you! Most AI sounds awful..."';
    } else if (!conversationMemory.demoUnlocked) {
      hint = currentBoss.hints.stage4 || 'Challenge them on the live line: "Punch in (561) 813-8602 right now on your phone."';
    } else {
      hint = currentBoss.hints.stage5 || 'Lock down agreement: "Should I text you the direct demo line or schedule 10 minutes tomorrow?"';
    }
    coachHintText.innerHTML = hint;
    coachHintDrawer.style.display = coachHintDrawer.style.display === 'none' ? 'block' : 'none';
  });

  closeHintBtn.addEventListener('click', () => {
    coachHintDrawer.style.display = 'none';
  });

  // Speech-to-Text
  const voiceMicBtn = document.getElementById('voiceMicBtn');
  const micIcon = document.getElementById('micIcon');
  const micLabel = document.getElementById('micLabel');
  let recognition = null;
  let isRecording = false;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isRecording = true;
      voiceMicBtn.classList.add('recording');
      micIcon.textContent = '⏹️';
      micLabel.textContent = 'Listening...';
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      customAttackInput.value = transcript;
    };

    recognition.onerror = () => stopRecording();
    recognition.onend = () => stopRecording();
  }

  function stopRecording() {
    isRecording = false;
    voiceMicBtn.classList.remove('recording');
    micIcon.textContent = '🎙️';
    micLabel.textContent = 'Speak';
  }

  voiceMicBtn.addEventListener('click', () => {
    if (!SpeechRecognition) {
      alert('Speech recognition is supported on Chrome & Edge. You can type your words in the box!');
      return;
    }
    if (isRecording) {
      recognition.stop();
      stopRecording();
    } else {
      customAttackInput.value = '';
      recognition.start();
    }
  });

  // ============================================================
  // 🧠 ADAPTIVE CONVERSATIONAL CONTRACTOR BRAIN ENGINE
  // ============================================================
  let activeBrainMode = localStorage.getItem('vantorx_rpg_brain_mode') || 'adaptive';
  let llmProvider = localStorage.getItem('vantorx_rpg_llm_provider') || 'groq';
  let llmApiKey = localStorage.getItem('vantorx_rpg_llm_key') || '';


  function parseSalesSpeech(text) {
    const t = text.toLowerCase().trim();
    return {
      t: t,
      greeting: /^(hey|hi|hello|good\s+morning|good\s+afternoon|howdy|what'?s\s+up|how\s+are\s+you|how's\s+it\s+going)/i.test(t),
      permission: /(20\s*sec|30\s*sec|quick\s*(question|sec|call|minute)|hang\s*up|expecting\s*my\s*call|won'?t\s*keep\s*you|catch\s*you\s*at\s*a\s*bad\s*time|bad\s*time|timebox)/i.test(t),
      identity: /(luke|vantorx|local\s*in|calling\s*out\s*of|florida|tampa|orlando|miami|palm\s*beach)/i.test(t),
      trade_mention: /(roof|shingle|tile|flat\s*roof|hvac|a\/?c|air\s*condition|plumb|water\s*heater|drain|pipe|electr|panel|breaker|amp|contractor|job\s*site|crew|trailer|tpo|slab\s*leak)/i.test(t),
      pain_missed_calls: /(miss|missed|voicemail|answering\s*machine|ring|after\s*hours|night|weekend|saturday|sunday|8\s*pm|9\s*pm|dinner|emergency|leak|flood|burst|outage|power\s*out)/i.test(t),
      pain_lost_competitor: /(competitor|next\s*(guy|contractor|roofer|plumber)|google|lost\s*(job|lead|money|revenue)|drywall|ceiling|panic)/i.test(t),
      dollar_anchor: /(8\,?000|8k|10\,?000|10k|5\,?000|5k|12\,?000|12k|15\,?000|15k|high\s*ticket|thousand|\$)/i.test(t),
      solution_ava: /(ava|ai|receptionist|voice\s*(agent|bot|assistant)|phone\s*system|first\s*ring|picks\s*up|answer|24\/7|dispatch|bilingual|triage)/i.test(t),
      agreement_shield: /(agree|completely\s*agree|100%|i\s*hear\s*you|makes\s*(total\s*)?sense|you'?re\s*right|fair\s*enough|understand|i'?d\s*feel\s*the\s*same|that'?s\s*(exactly\s*)?why)/i.test(t),
      demo_challenge: /(561[\s\-\.]*813[\s\-\.]*8602|813[\s\-\.]*8602|punch\s*in|dial|call\s*(it|her|this|the\s*number)|test\s*her|demo\s*line|listen\s*to\s*her|sounds?\s*like\s*a\s*robot|lose\s*my\s*number|speakerphone)/i.test(t),
      pricing_terms: /(397|697|299|price|cost|how\s*much|month|flat|no\s*contract|cancel\s*anytime|month\s*to\s*month|guarantee|pays?\s*for\s*itself|roi)/i.test(t),
      closing_action: /(text|shoot\s*me\s*a\s*text|send\s*a\s*text|link|calendar|book|schedule|tomorrow|zoom|morning|afternoon|patch\s*through|transfer|cell\s*number)/i.test(t),
      objection_answering_service: /(answering\s*service|front\s*desk|secretary|receptionist|wife\s*(answers|handles)|on\s*call)/i.test(t),
      objection_ai_doubt: /(robot|fake|automated|computer|siri|alexa|press\s*1|hate\s*ai|broken\s*microwave)/i.test(t),
      objection_busy: /(busy|slammed|on\s*a\s*job|email|send\s*an\s*email|send\s*info|driving)/i.test(t),
      hesitation: /^(uh|um|er|idk|i\s*don'?t\s*know|wait)/i.test(t) || t.length < 5,
      spam_pitch: /(buy|cheap\s*software|special\s*deal|special\s*promotion|pitch\s*you|are\s*you\s*the\s*decision\s*maker|do\s*you\s*have\s*15\s*minutes)/i.test(t),
      curiosity_question: /\?|what\s+do\s+you|how\s+do\s+you|where\s+do|who\s+handles|do\s+you\s+guys/i.test(t)
    };
  }

  function generateAdaptiveContractorReply(bossKey, userText, memory, intents) {
    const turns = memory.turns;

    if (bossKey === 'roofer') {
      if (intents.spam_pitch) {
        return "Look kid, I get 20 telemarketers a week calling my cell while I'm trying to work. I don't buy 'software promotions'. If you're a real human with a real service for roofing guys, tell me in plain English or lose my number.";
      }
      if (intents.hesitation) {
        return "Hey Luke, you still there? I don't get paid to sit here listening to dead air while I'm backing up a trailer. Speak up or I'm hanging up.";
      }
      if (intents.closing_action && memory.demoUnlocked) {
        return "Holy cow... she actually answered on the first ring and asked if I had active leaks in Hillsborough County. Alright Luke, you won me over. Shoot that text with the link to my cell right now.";
      }
      if (intents.demo_challenge) {
        return "(Sound of truck idling) Alright, smart guy. You're putting your money where your mouth is. I got my speakerphone on right now. 5-6-1... 8-1-3... 8-6-0-2. Ringing it now... let's see how this thing sounds.";
      }
      if (intents.pricing_terms) {
        return "Look, zero contracts and $397 a month is pocket change in roofing — one single $10,000 shingle replacement pays for the entire year. But I've been burned by marketing agencies before. How fast does this actually get set up?";
      }
      if (intents.objection_ai_doubt) {
        if (intents.agreement_shield) {
          return "Ha! At least you didn't bullshit me like the other sales reps. So you're saying she doesn't sound like Siri? What happens when an angry homeowner calls with water pouring into their kitchen?";
        }
        return "Don't tell me AI is great, kid. My customers in South Tampa are in their 50s and 60s. They hate automated press-1 menus. They want to talk to Rick, not a robot.";
      }
      if (intents.pain_lost_competitor || (intents.pain_missed_calls && intents.dollar_anchor)) {
        return "Damn it... you're not wrong about that. Homeowners panic when water is leaking through their drywall. If it hits my voicemail, they just tap the next roofer on Google. But what am I supposed to do, pay a full-time girl $4,000 a month to sit in my house at 9 PM on Saturday?";
      }
      if (intents.pain_missed_calls) {
        return "Look, my crews knock off at 5 PM. After that, my cell rings to voicemail while I'm eating dinner with my wife. When a thunderstorm rolls through Tampa at 8 PM on a Saturday, calls come in. Most folks leave a message if they really want an estimate... don't they?";
      }
      if (intents.trade_mention) {
        return "Yeah, we run architectural shingles, modified bitumen, and standing seam metal. 3 crews out today from Brandon to Clearwater. Why, what does that have to do with why you're calling my mobile?";
      }
      if (intents.permission) {
        return "Alright, Luke. I appreciate you not beating around the bush. You got 20 seconds before I have to guide this trailer into the supply yard. What's on your mind?";
      }
      if (intents.greeting && turns <= 1) {
        return "(Heavy diesel truck idling & horn honk) Sweating through my shirt in Tampa traffic, man. Who is this and what's going on?";
      }
      if (intents.curiosity_question) {
        return "My biggest headache? Finding reliable labor that shows up on Monday, and trying to return 15 missed calls while I'm standing on a 6/12 pitch roof in 95-degree heat. What's your solution?";
      }
      if (memory.bossResistance < 40) {
        return "Alright, Luke. You actually know how roofing works and you're not wasting my time. What's the next step? How do I hear this Ava thing?";
      } else if (memory.bossResistance < 70) {
        return "I hear you, man. But every tech guy who calls me promises the moon. How does this thing actually connect to my current cell phone?";
      }
      return "Alright, make your point. I got a trailer to unload in about 2 minutes. What do you have for roofing contractors?";
    }

    if (bossKey === 'gatekeeper') {
      if (intents.spam_pitch) {
        return "We do not accept unsolicited sales calls or vendor solicitations. If you'd like to leave your company website, I can pass it along, but Mr. Davis does not take cold calls.";
      }
      if (intents.closing_action && memory.demoUnlocked) {
        return "Mr. Davis has a 10-minute window open tomorrow at 9:15 AM before his team dispatch walk. I'll put you on his calendar, Luke. What email should I send the invite to?";
      }
      if (intents.demo_challenge) {
        return "I'm dialing it right now from our front desk desk phone... (561) 813-8602. Hold on one moment while I listen to the greeting.";
      }
      if (intents.objection_answering_service) {
        return "We used an answering service last summer and it was an absolute nightmare. They misspelled customer addresses and didn't know the difference between a blown capacitor and a compressor.";
      }
      if (intents.pain_missed_calls) {
        return "Well, after 6 PM our calls forward to whoever the on-call technician is. But when they're in an attic in 110-degree heat, they obviously can't answer the phone. That does cause dropped calls.";
      }
      if (intents.identity && intents.permission) {
        return "Good morning, Luke. What company did you say you were calling with? Mr. Davis is currently in a production meeting, but is this regarding our current dispatch software?";
      }
      if (intents.curiosity_question) {
        return "We have 14 technicians covering Orange and Seminole counties. We handle residential replacements and commercial rooftop units.";
      }
      if (memory.bossResistance < 50) {
        return "Honestly, if Ava can actually triage service calls and book directly onto our calendar without putting people on hold, Mr. Davis would want to see this.";
      }
      return "Mr. Davis is very protective of his schedule. If you can explain in 30 seconds how this helps our dispatching, I might be able to find 10 minutes for you.";
    }

    if (bossKey === 'skeptic') {
      if (intents.spam_pitch) {
        return "Stop right there, son. I'm a master electrician, not a software buyer. Don't give me rehearsed sales talk or I'm hanging up.";
      }
      if (intents.closing_action && memory.demoUnlocked) {
        return "I'll be damned... she answered on the first ring, asked if it was 200A residential or commercial, and scheduled an emergency slot. Alright Luke, you proved your point. Text me your info.";
      }
      if (intents.demo_challenge) {
        return "(Tools clanking) Alright, you're pretty cocky. I'm punching in (561) 813-8602 on speaker right now. If she stumbles or sounds like a GPS, you lose this number forever.";
      }
      if (intents.objection_ai_doubt) {
        if (intents.agreement_shield) {
          return "Ha! Finally, a tech guy who doesn't lie to my face. Yeah, most AI sounds like a broken microwave. So how did you train her on electrical terminology?";
        }
        return "Every AI I've ever heard sounds like a soulless computer. Homeowners with sparks flying out of their breaker panel want a real human being who understands amperage.";
      }
      if (intents.dollar_anchor || intents.pain_missed_calls) {
        return "Look, standard rewires we're booked out 3 weeks. But emergency panel burnouts or storm generator cutovers? Those are $4,000 to $8,000 cash jobs. Those hurt when they slip through the cracks.";
      }
      if (intents.permission) {
        return "Luke, is it? Look, I'm staring into an open 200-amp service panel right now. Tell me what you've got in 20 seconds, plain English.";
      }
      if (memory.bossResistance < 50) {
        return "Alright, I'm listening. If this thing actually knows how to ask about breaker sizes and doesn't sound like a robot, maybe it's worth testing.";
      }
      return "We've been in business in Palm Beach for 22 years without fancy software. Why do I need an AI answering my phone?";
    }

    if (bossKey === 'price') {
      if (intents.closing_action && memory.demoUnlocked) {
        return "Alright Luke, the math is undeniable. $397 with no contract pays for itself on the first water heater changeout. Shoot that link to my cell right now.";
      }
      if (intents.demo_challenge) {
        return "Let me call it right now while you're on the line. 5-6-1... 8-1-3... 8-6-0-2. Ringing now... let's see what she's got.";
      }
      if (intents.pricing_terms) {
        return "Wait, $397 a month flat with zero long-term contract? No setup fee extortion? If she books just one slab leak or water heater ($3,500), she pays for almost the whole year.";
      }
      if (intents.pain_missed_calls || intents.dollar_anchor) {
        return "Look, a slab leak or commercial drain backup is $5,000 to $12,000. When that calls at 11 PM on a Sunday and rings to voicemail, yeah, they call the 24/7 rooter guy down the street.";
      }
      if (intents.permission) {
        return "Alright, 20 seconds. What is it? No fluff, tell me how it puts cash in my pocket.";
      }
      if (memory.bossResistance < 50) {
        return "Look, I like that there's no 12-month lock-in contract. But how do I know she actually answers fast enough before they hang up?";
      }
      return "Dave here. I get 20 telemarketers a day. What's the price and what do you do?";
    }

    return "Alright, I hear you. But make it quick — how does this help my trade business today?";
  }

  function evaluateSalesTurn(userText, memory, currentBoss) {
    const intents = parseSalesSpeech(userText);
    memory.turns++;

    if (intents.hesitation) {
      return {
        grade: 'F',
        score: 20,
        critique: 'Fatal hesitation! Dead air or stutters make you sound inexperienced and trigger defensive contractor reflexes.',
        prescription: 'Speak with calm authority. Use: <em>"Luke from VantorX. Got 20 seconds or should I hang up?"</em>',
        damage: 0,
        xp: 0,
        healBoss: 15,
        counterDmg: 20,
        intents: intents,
        agreementAchieved: false
      };
    }

    if (intents.spam_pitch) {
      return {
        grade: 'F',
        score: 25,
        critique: 'Fatal telemarketer trap! Words like "buy", "software promotion", or "decision maker" instantly trigger sales defense.',
        prescription: 'Anchor to their missed emergency calls and lost revenue, never "buying software".',
        damage: 0,
        xp: 0,
        healBoss: 15,
        counterDmg: 20,
        intents: intents,
        agreementAchieved: false
      };
    }

    let score = 50;
    let damage = 18;
    let counterDmg = 0;
    let playerHeal = 0;
    let critique = '';
    let prescription = '';

    if (intents.permission || (intents.greeting && intents.identity)) {
      memory.rapportUnlocked = true;
      score += 25;
      damage += 15;
      critique = 'Excellent disarm! You respected the contractor\'s busy schedule and earned control of the call.';
      prescription = 'Now pivot straight to trade pain: <em>"When an emergency leak calls at 8 PM on a Saturday, where does that call ring right now?"</em>';
    }

    if (intents.pain_missed_calls || intents.dollar_anchor || intents.pain_lost_competitor) {
      memory.painUnlocked = true;
      score += 25;
      damage += 20;
      critique = 'Lethal trade pain hook! You highlighted missed after-hours calls and high-ticket lost revenue.';
      prescription = 'If he pushes back on robots, use the Total Agreement Shield: <em>"I completely agree with you! Most AI sounds fake..."</em>';
    }

    if (intents.agreement_shield) {
      memory.objectionUnlocked = true;
      score += 20;
      damage += 15;
      playerHeal += 15;
      critique = 'Masterful Total Agreement Shield! You validated his skepticism, instantly diffusing conversational tension.';
      prescription = 'Now deliver the live demo challenge: <em>"I just texted our live demo line (561) 813-8602 directly to your cell. Tap it on speaker the second you park to hear Ava answer on ring one."</em>';
    }

    if (intents.demo_challenge) {
      memory.demoUnlocked = true;
      score += 30;
      damage += 25;
      critique = 'Irresistible zero-risk challenge! You challenged him to catch Ava sounding robotic on (561) 813-8602.';
      prescription = 'Lock down the close: Offer to text him the link or schedule a 10-minute walkthrough tomorrow.';
    }

    if (intents.pricing_terms) {
      score += 15;
      damage += 10;
      critique = 'Clear price anchoring! Highlighting the $397 flat rate with zero long-term contracts removes financial hesitation.';
      prescription = 'Remind him that one single emergency repair pays for the entire year of Ava.';
    }

    if (intents.closing_action && (memory.demoUnlocked || memory.painUnlocked)) {
      memory.agreementUnlocked = true;
      score = 100;
      damage += 45;
      critique = '🏆 MASTER RAINMAKER CLOSE! You secured complete agreement with zero friction.';
      prescription = 'Call closed cleanly. Outstanding demonstration of conversational control!';
    }

    score = Math.min(100, score);
    let grade = 'C';
    if (score >= 90) grade = 'S';
    else if (score >= 80) grade = 'A';
    else if (score >= 65) grade = 'B';
    else if (score >= 45) grade = 'C';
    else grade = 'F';

    if (score < 60) {
      counterDmg = 12;
      if (!critique) critique = 'The contractor is still guarded. Anchor your statement to their trade and missed after-hours jobs.';
      if (!prescription) prescription = 'Ask directly: <em>"Where does an $8,000 Saturday emergency call ring right now?"</em>';
    }

    const isVictorious = (memory.agreementUnlocked || (memory.bossResistance - damage <= 0 && memory.demoUnlocked));

    return {
      grade: grade,
      score: score,
      critique: critique,
      prescription: prescription,
      damage: damage,
      xp: Math.round(damage * 1.2),
      healBoss: 0,
      counterDmg: counterDmg,
      playerHeal: playerHeal,
      intents: intents,
      agreementAchieved: isVictorious
    };
  }

  async function callLiveLLM(provider, apiKey, systemPrompt, conversationHistory) {
    const endpoint = (provider === 'groq') 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    const model = (provider === 'groq') ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-8)
    ];

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 120,
        temperature: 0.8
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content.trim();
  }

  async function executeTurn(userText) {
    if (player.hp <= 0 || currentBoss.hp <= 0) return;
    pauseImpatienceTimer();

    if (!matchStarted) {
      matchStarted = true;
      appendLog(`⚔️ <strong>CALL ENGAGED:</strong> Battle commenced! The 2-minute conversational clock is now active.`, 'system');
      if (sendAttackBtn) sendAttackBtn.innerHTML = '⚔️ Send Rebuttal ➔';
      if (customAttackInput) customAttackInput.placeholder = 'Type or speak what you say to the contractor out loud...';
    }

    appendLog(`<strong>Luke says:</strong> "${userText}"`, 'luke');
    if (coachHintDrawer) coachHintDrawer.style.display = 'none';

    // 1. Evaluate sales turn & update conversational memory
    const evalRes = evaluateSalesTurn(userText, conversationMemory, currentBoss);
    let finalDmg = Math.round(evalRes.damage * player.dmgMultiplier);

    // 2. Add to matchHistory for conversational context
    matchHistory.push({ role: 'user', content: userText });

    // 3. Render Coach Vance evaluation
    const gradeClass = `grade-${evalRes.grade.toLowerCase()}`;
    const coachHtml = `
      <div class="coach-head">
        <span class="coach-title">🧑‍🏫 <strong>COACH VANCE EVALUATION</strong></span>
        <span class="coach-grade-badge ${gradeClass}">GRADE ${evalRes.grade} · ${evalRes.score}/100</span>
      </div>
      <div class="coach-critique">${evalRes.critique}</div>
      <div class="coach-prescription">💡 <strong>Coach Prescription:</strong> ${evalRes.prescription}</div>
      <div class="coach-impact">⚡ Impact: ${finalDmg > 0 ? `Dealt <strong>${finalDmg} DMG</strong>` : '0 DMG'}${evalRes.healBoss ? ` · Boss Healed +${evalRes.healBoss} HP` : ''}${evalRes.playerHeal ? ` · Healed +${evalRes.playerHeal} HP` : ''}</div>
    `;
    appendLog(coachHtml, 'coach');

    // 4. Update player & boss HP
    if (evalRes.playerHeal) player.hp = Math.min(player.maxHp, player.hp + evalRes.playerHeal);
    if (evalRes.healBoss) currentBoss.hp = Math.min(currentBoss.maxHp, currentBoss.hp + evalRes.healBoss);
    if (finalDmg > 0) {
      playSound('slash');
      currentBoss.hp = Math.max(0, currentBoss.hp - finalDmg);
      conversationMemory.bossResistance = Math.max(0, conversationMemory.bossResistance - finalDmg);
    }
    if (evalRes.xp > 0) addXP(evalRes.xp);

    // Dynamic boss demeanor status
    if (evalRes.agreementAchieved || currentBoss.hp <= 0) {
      currentBoss.status = 'Ready to Close & Agree';
    } else if (conversationMemory.demoUnlocked) {
      currentBoss.status = 'Dialing Live Demo (561) 813-8602';
    } else if (conversationMemory.objectionUnlocked) {
      currentBoss.status = 'Intrigued & Softening';
    } else if (conversationMemory.painUnlocked) {
      currentBoss.status = 'Thinking About Lost Revenue';
    } else if (conversationMemory.rapportUnlocked) {
      currentBoss.status = 'Listening (Guarded)';
    }

    if (!evalRes.agreementAchieved && currentBoss.hp <= 0) {
      currentBoss.hp = 1;
      appendLog(`🛡️ <strong>STAGGERED:</strong> ${currentBoss.name} is on the verge of agreeing! Deliver the closing punch or challenge them to dial (561) 813-8602!`, 'system');
    }

    updateHUD();

    // 5. Check Complete Victory
    if (evalRes.agreementAchieved && (currentBoss.hp <= 0 || conversationMemory.demoUnlocked || conversationMemory.agreementUnlocked)) {
      currentBoss.hp = 0;
      updateHUD();
      player.streak++;
      playSound('levelup');
      matchStarted = false;
      pauseImpatienceTimer();
      if (impatienceDigits) impatienceDigits.textContent = 'VICTORY';

      const victoryText = currentBoss.dialogue.victory || "Alright Luke, you won me over. Shoot me a text with setup info.";
      appendLog(`<strong>${currentBoss.name}:</strong> "${victoryText}"`, 'boss');
      appendLog(`🏆 <strong>BOSS DEFEATED — COMPLETE AGREEMENT REACHED!</strong> ${currentBoss.name} agreed to test Ava on (561) 813-8602!`, 'victory');
      speakContractor(victoryText, currentBoss.key);

      turnIndicator.textContent = 'VICTORY! COMPLETE AGREEMENT REACHED.';
      recordBossDefeat(currentBoss.key);
      return;
    }

    // 6. Generate Adaptive Contractor Reply (Live LLM or Built-in Engine)
    turnIndicator.textContent = `${currentBoss.name.toUpperCase()} IS RESPONDING...`;

    const brainMode = localStorage.getItem('vantorx_rpg_brain_mode') || 'adaptive';
    const currentLlmProvider = localStorage.getItem('vantorx_rpg_llm_provider') || 'groq';
    const currentLlmKey = localStorage.getItem('vantorx_rpg_llm_key') || '';

    let contractorSpeech = '';

    if (brainMode === 'live_llm' && currentLlmKey) {
      try {
        const sysPrompt = `You are roleplaying as ${currentBoss.name}, a real-world contractor boss (${currentBoss.title}).
Status: ${currentBoss.status}.
Your personality: Tough, pragmatic, busy, hates fake sales pitches, cares about crew operations, missed revenue, and avoiding gimmicks.
The user is Luke Hamilton, founder of VantorX Solutions, cold-calling you to offer Ava, an AI phone receptionist ($397/mo flat, no contract) with a live demo line at (561) 813-8602.
Reply directly to what Luke just said in 1 to 3 punchy sentences. Stay in character as a blue-collar trades boss.
If Luke asks good trade questions or challenges you to dial (561) 813-8602, react realistically. If Luke says something robotic or generic, push back.
Do NOT break character. Do NOT output asterisks or action descriptors like *sighs*. Only output spoken dialogue.`;
        contractorSpeech = await callLiveLLM(currentLlmProvider, currentLlmKey, sysPrompt, matchHistory);
      } catch (err) {
        console.warn('Live LLM failed, falling back to adaptive brain:', err);
        contractorSpeech = generateAdaptiveContractorReply(currentBoss.key, userText, conversationMemory, evalRes.intents);
      }
    } else {
      contractorSpeech = generateAdaptiveContractorReply(currentBoss.key, userText, conversationMemory, evalRes.intents);
    }

    // Retaliation damage if turn was ineffective or spammy
    if (evalRes.counterDmg > 0) {
      playSound('hit');
      player.hp = Math.max(0, player.hp - evalRes.counterDmg);
      updateHUD();
      if (player.hp <= 0) {
        appendLog(`<strong>${currentBoss.name}:</strong> "${contractorSpeech}" <span style="color:var(--err);font-weight:700">(-${evalRes.counterDmg} HP)</span>`, 'boss');
        speakContractor(contractorSpeech, currentBoss.key);
        playerKnockout();
        return;
      }
    }

    setTimeout(() => {
      appendLog(`<strong>${currentBoss.name}:</strong> "${contractorSpeech}"${evalRes.counterDmg > 0 ? ` <span style="color:var(--err);font-size:12px">(-${evalRes.counterDmg} HP)</span>` : ''}`, 'boss');
      matchHistory.push({ role: 'assistant', content: contractorSpeech });
      speakContractor(contractorSpeech, currentBoss.key);
      turnIndicator.textContent = 'YOUR TURN: SPEAK OR TYPE REBUTTAL';
      startImpatienceTimer();
    }, 600);
  }

  function playerKnockout() {
    player.hp = 0;
    player.streak = 0;
    pauseImpatienceTimer();
    matchStarted = false;
    if (impatienceDigits) impatienceDigits.textContent = 'DEFEAT';
    updateHUD();
    appendLog(`💀 <strong>KNOCKED OUT!</strong> You took too much emotional rejection damage. Click 'Restart Dungeon Match' to try again!`, 'system');
    turnIndicator.textContent = 'DEFEAT. REST AND RETRY.';
  }

  document.querySelectorAll('.dungeon-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.dungeon-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      startDungeon(item.dataset.dungeon);
    });
  });

  const restartBtn = document.getElementById('restartMatchBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      player.hp = player.maxHp;
      startDungeon(currentDungeonKey);
    });
  }

  const customForm = document.getElementById('customAttackForm');
  if (customForm) {
    customForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('customAttackInput');
      const txt = input ? input.value.trim() : '';
      if (!txt || player.hp <= 0 || currentBoss.hp <= 0) return;
      executeTurn(txt);
      if (input) input.value = '';
    });
  }

  // Initialization
  try {
    const savedBrainMode = localStorage.getItem('vantorx_rpg_brain_mode') || 'adaptive';
    const savedLlmProv = localStorage.getItem('vantorx_rpg_llm_provider') || 'groq';
    const badge = document.getElementById('brainModeBadge');
    if (badge && savedBrainMode === 'live_llm') {
      badge.textContent = `⚡ Live LLM: ${savedLlmProv.toUpperCase()}`;
      badge.style.background = 'rgba(245,158,11,0.2)';
      badge.style.borderColor = 'var(--accent)';
      badge.style.color = 'var(--accent2)';
    }
  } catch(e) {}

  if (window.selectLmsUnit) window.selectLmsUnit('1-1');
  updateUserUI();
  updateBatchHeading();
  renderLeadsTable();
  renderMasterObjectionCards('all', '');
  startDungeon('roofer');
})();
</script>
</body>
</html>
'@

$html = $htmlTemplate.Replace('__LEADS_JSON__', $leadsRaw)

$utf8WithBom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText("$PSScriptRoot/../website/cold-call-arena/index.html", $html, $utf8WithBom)
Write-Host "Successfully generated multi-product Cold Calling Cockpit in website/cold-call-arena/index.html"
