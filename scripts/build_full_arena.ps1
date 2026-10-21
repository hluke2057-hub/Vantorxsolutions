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

.excel-table-wrap{overflow-x:auto;border:1px solid var(--line2);border-radius:14px;background:var(--bg);max-height:560px}
.excel-table{width:100%;border-collapse:collapse;font-size:13px;text-align:left;white-space:nowrap}
.excel-table th{background:var(--bg3);padding:12px 14px;font-family:var(--font-mono);font-size:11.5px;font-weight:700;color:var(--dim);border-bottom:1px solid var(--line2);position:sticky;top:0;z-index:10;text-transform:uppercase;letter-spacing:0.04em}
.excel-table td{padding:12px 14px;border-bottom:1px solid var(--line);vertical-align:middle}
.excel-table tr:hover td{background:rgba(245,158,11,0.06)}
.excel-table tr.selected td{background:rgba(245,158,11,0.14)}

.badge-leak{background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;padding:3px 8px;border-radius:6px;font-family:var(--font-mono);font-weight:700;font-size:11.5px;display:inline-block}
.badge-save{background:rgba(52,211,153,0.15);border:1px solid rgba(52,211,153,0.4);color:#6ee7b7;padding:3px 8px;border-radius:6px;font-family:var(--font-mono);font-weight:700;font-size:11.5px;display:inline-block}
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
</style>
</head>
<body>

<header>
  <div class="wrap head-grid">
    <div class="brand">
      <span>⚡</span> Vantor<b>X</b> Cold Calling Cockpit
    </div>
    <div style="display:flex;align-items:center;gap:10px">
      <div class="live-demo-pill" id="copyDemoPill" title="Click to copy demo number">
        <span>📞 Demo: (561) 813-8602</span> <span style="font-size:11px">📋</span>
      </div>
      <button class="btn btn-ghost btn-sm" id="voiceToggleBtn">🗣️ Voice: ON</button>
      <button class="btn btn-ghost btn-sm" id="soundToggleBtn">🔊 Audio: ON</button>
    </div>
  </div>
</header>

<main class="wrap">
  <div class="tabs">
    <button class="tab-btn active" type="button" id="tabBtnLeads" data-tab="tabLeads" onclick="switchTab('tabLeads')">📋 100-Lead Dial Queue (+25/Day)</button>
    <button class="tab-btn" type="button" id="tabBtnScript" data-tab="tabScript" onclick="switchTab('tabScript')">📜 Multi-Product Teleprompter</button>
    <button class="tab-btn" type="button" id="tabBtnRPG" data-tab="tabRPG" onclick="switchTab('tabRPG')">🎮 Cold Call Quest (Sales RPG 2.0)</button>
    <button class="tab-btn" type="button" id="tabBtnObjections" data-tab="tabObjections" onclick="switchTab('tabObjections')">🛡️ 45+ Master Objection Library</button>
    <button class="tab-btn" type="button" id="tabBtnSimulationData" data-tab="tabSimulationData" onclick="switchTab('tabSimulationData')">📊 50-Call Simulation Logs</button>
  </div>

  <!-- TAB 0: 📋 LEAD DISPATCHER & LEAK CALCULATOR -->
  <div id="tabLeads" class="tab-panel active">
    <div class="lead-cockpit">
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
        <div class="lead-pills">
          <button class="lead-pill-btn active" data-filter="all">All Offers</button>
          <button class="lead-pill-btn" data-filter="ava">🤖 Ava Voice</button>
          <button class="lead-pill-btn" data-filter="website">🌐 Websites</button>
          <button class="lead-pill-btn" data-filter="speed">⚡ Speed-to-Lead</button>
          <button class="lead-pill-btn" data-filter="aeo">⭐ AEO &amp; Reviews</button>
          <button class="lead-pill-btn" data-filter="bundle">🚀 Full Bundle</button>
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
              <th>Annual Leak ($)</th>
              <th>Net Saved ($)</th>
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
            <div class="active-lead-label">Estimated Annual Leak</div>
            <div class="active-lead-val" style="color:#fca5a5" id="activeLeadLoss">-$102,000 / year ($8,500/mo)</div>
          </div>
          <div class="active-lead-cell">
            <div class="active-lead-label">Net Profit Saved with VantorX</div>
            <div class="active-lead-val" style="color:#6ee7b7" id="activeLeadSavings">+$98,412 / year</div>
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
            <span>⚔️ LIVE VERBAL COMBAT FEED</span>
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
        <button class="obj-pill active" data-filter="all">All Objections (46)</button>
        <button class="obj-pill" data-filter="ava">🤖 Ava Voice (12)</button>
        <button class="obj-pill" data-filter="website">🌐 Custom Websites (10)</button>
        <button class="obj-pill" data-filter="speed">⚡ Speed-to-Lead (8)</button>
        <button class="obj-pill" data-filter="aeo">⭐ AEO &amp; Reviews (8)</button>
        <button class="obj-pill" data-filter="bundle">🚀 Full Bundle (6)</button>
        <button class="obj-pill" data-filter="gatekeeper">🛡️ Gatekeeper (2)</button>
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
  <button class="btn btn-gold" id="closeModalBtn" style="width:100%">Claim Loot &amp; Keep Slaying ➔</button>
</div>

<div class="toast" id="toast">Copied to clipboard!</div>

<script>
// ============================================================
// 🌐 GLOBAL BULLETPROOF TAB SWITCHER
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

  let activeCaller = localStorage.getItem('vantorx_active_caller') || 'Luke';
  const callerSelectEl = document.getElementById('callerSelect');
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

  function renderLeadsTable() {
    leadTableBody.innerHTML = '';
    const q = leadSearchQuery.toLowerCase().trim();
    const activeLimit = getActiveQueueLimit();
    const freshRange = getTodayFreshRange();

    const filtered = LEADS_DATA.filter((lead, index) => {
      // 1. Queue / Batch filter
      if (currentBatch === 'activeQueue') {
        if (index >= activeLimit) return false;
      } else if (currentBatch === 'todayFresh') {
        if (index < freshRange.start || index >= freshRange.end) return false;
      } else if (currentBatch === 'all') {
        // all leads included
      } else {
        const batchNum = parseInt(currentBatch, 10);
        if (lead.batch !== batchNum) return false;
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

    if (filtered.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="11" style="text-align:center;padding:32px;color:var(--dim)">
        🔍 No contractor targets match your selected filters. Try switching batches or resetting filters.
      </td>`;
      leadTableBody.appendChild(tr);
      updateQuotaHUD();
      return;
    }

    filtered.forEach(lead => {
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
          <span class="badge-leak">-$${lead.annualLoss.toLocaleString()}/yr</span>
          <div style="font-size:11px;color:var(--dim);margin-top:2px">$${lead.monthlyLoss.toLocaleString()}/mo</div>
        </td>
        <td>
          <span class="badge-save">+$${lead.netSavings.toLocaleString()}/yr</span>
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
          showToast(`✓ Marked ${lead?.company || 'Lead'} as Called by ${activeCaller}!`);
        } else {
          if (CALL_RECORDS[id]) {
            CALL_RECORDS[id].called = false;
          }
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
      renderLeadsTable();
    });
  });

  // Product Filter Pills Listener
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentProductFilter = btn.dataset.filter;
      renderLeadsTable();
    });
  });

  // Search Input Listener
  const searchInputEl = document.getElementById('leadSearchInput');
  if (searchInputEl) {
    searchInputEl.addEventListener('input', (e) => {
      leadSearchQuery = e.target.value;
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
    document.getElementById('activeLeadLoss').textContent = `-$${lead.annualLoss.toLocaleString()} / year ($${lead.monthlyLoss.toLocaleString()}/mo)`;
    document.getElementById('activeLeadSavings').textContent = `+$${lead.netSavings.toLocaleString()} / year`;
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

  // Objection Filter Pills
  document.querySelectorAll('#objFilterPills .obj-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#objFilterPills .obj-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderMasterObjectionCards(pill.dataset.filter, document.getElementById('objLibrarySearchInput').value);
    });
  });

  document.getElementById('objLibrarySearchInput').addEventListener('input', (e) => {
    const activePill = document.querySelector('#objFilterPills .obj-pill.active');
    const filter = activePill ? activePill.dataset.filter : 'all';
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

  function speakContractor(text) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/\([^)]*\)/g, '').trim();
      if (!clean) return;
      const utt = new SpeechSynthesisUtterance(clean);
      utt.pitch = 0.88;
      utt.rate = 1.05;
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
        stage4: 'The Ava Challenge: "Have your cell in your hand? Punch in our live demo line right now: (561) 813-8602. If she sounds like a robot, you never have to talk to me again."',
        stage5: 'Lock the agreement: "Dial (561) 813-8602 right now for 30 seconds, or let me text you the direct line."'
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

    stageSteps.forEach((step, idx) => {
      const stepIdx = idx + 1;
      step.classList.remove('active', 'done');
      if (stepIdx < currentStage) step.classList.add('done');
      else if (stepIdx === currentStage) step.classList.add('active');
    });

    const stageNames = ['1: Opener', '2: $8k Pain Hook', '3: Objection Gauntlet', '4: Demo Challenge', '5: Complete Agreement'];
    bossStageLabel.textContent = `Stage ${stageNames[currentStage - 1] || '5'}`;
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

    speakContractor(currentBoss.dialogue.stage1);

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
    coachHintText.innerHTML = currentBoss.hints['stage' + currentStage] || 'Keep the conversation centered on after-hours emergency calls and the live demo line.';
    coachHintDrawer.style.display = coachHintDrawer.style.display === 'none' ? 'block' : 'none';
  });

  closeHintBtn.addEventListener('click', () => {
    coachHintDrawer.style.display = 'none';
  });

  // Speech-to-Text
  const voiceMicBtn = document.getElementById('voiceMicBtn');
  const customAttackInput = document.getElementById('customAttackInput');
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

  // Coach Vance Linguistic Brain
  function evaluateSalesTurn(text, stage, bossKey) {
    const t = text.toLowerCase().trim();

    if (t.length < 5 || t === 'idk' || t === 'i don\'t know' || t.startsWith('uh') || t.startsWith('um')) {
      return {
        grade: 'F',
        score: 15,
        critique: 'Fatal hesitation! Dead air or stutters make you sound inexperienced and trigger defensive contractor reflexes.',
        prescription: 'Speak with calm authority. Use: <em>"Luke from VantorX. Got 20 seconds or should I hang up?"</em>',
        damage: 0,
        xp: 0,
        healBoss: 25,
        counterDmg: 25,
        advanceStage: false,
        agreementAchieved: false
      };
    }

    const spamWords = ['buy', 'cheap software', 'special deal', 'special promotion', 'sell you', 'pitch you', 'are you the decision maker', 'do you have 15 minutes'];
    for (const w of spamWords) {
      if (t.includes(w)) {
        return {
          grade: 'F',
          score: 20,
          critique: `Fatal sales trap! Mentioning "${w}" flags you as a telemarketer instantly. Contractors hate software pitches.`,
          prescription: 'Anchor to their missed emergency jobs, never "software" or "buying". Ask: <em>"Where does an $8k Saturday emergency call ring right now?"</em>',
          damage: 0,
          xp: 0,
          healBoss: 20,
          counterDmg: 22,
          advanceStage: false,
          agreementAchieved: false
        };
      }
    }

    if (stage === 1) {
      const hasPermission = t.includes('20 second') || t.includes('hang up') || t.includes('expecting') || t.includes('quick question');
      const hasIdentity = t.includes('luke') || t.includes('vantorx') || t.includes('routing') || t.includes('around');

      if (hasPermission && hasIdentity) {
        return {
          grade: 'S',
          score: 96,
          critique: 'Flawless pattern interrupt! You disarmed hostility and gave the contractor total control of the conversation.',
          prescription: 'Next beat: <em>"In your trade, when an emergency job calls at 8 PM on a Saturday, where does that call ring right now?"</em>',
          damage: 32,
          xp: 35,
          healBoss: 0,
          counterDmg: 0,
          advanceStage: true,
          nextStageDialogue: dungeons[bossKey].dialogue.stage2,
          agreementAchieved: false
        };
      } else if (hasPermission || hasIdentity) {
        return {
          grade: 'A',
          score: 82,
          critique: 'Good opening rhythm. You got his attention without sounding pushy.',
          prescription: 'Make sure to explicitly state: <em>"Got 20 seconds or should I hang up?"</em> to maximize permission.',
          damage: 22,
          xp: 25,
          healBoss: 0,
          counterDmg: 8,
          advanceStage: true,
          nextStageDialogue: dungeons[bossKey].dialogue.stage2,
          agreementAchieved: false
        };
      } else {
        return {
          grade: 'C',
          score: 50,
          critique: 'Weak opener. You didn\'t ask for permission or set a clear time boundary.',
          prescription: 'Try: <em>"Hey [Name], Luke from VantorX. I know you weren\'t expecting my call — got 20 seconds or should I hang up?"</em>',
          damage: 8,
          xp: 5,
          healBoss: 5,
          counterDmg: 16,
          advanceStage: false,
          agreementAchieved: false
        };
      }
    } else if (stage === 2) {
      const hasPainDollars = t.includes('8000') || t.includes('8,000') || t.includes('8k') || t.includes('emergency') || t.includes('saturday') || t.includes('weekend');
      const hasRingQuestion = t.includes('where does that call ring') || t.includes('ring') || t.includes('voicemail') || t.includes('competitor') || t.includes('missed');

      if (hasPainDollars && hasRingQuestion) {
        return {
          grade: 'S',
          score: 98,
          critique: 'Master-level pain anchor! You highlighted high-ticket lost revenue ($8,000) and forced him to evaluate his current phone setup.',
          prescription: 'Next beat: Acknowledge his objection with the Total Agreement Shield.',
          damage: 35,
          xp: 40,
          healBoss: 0,
          counterDmg: 0,
          advanceStage: true,
          nextStageDialogue: dungeons[bossKey].dialogue.stage3,
          agreementAchieved: false
        };
      } else if (hasPainDollars || hasRingQuestion) {
        return {
          grade: 'A',
          score: 80,
          critique: 'Solid hook. You touched on missed calls, but anchoring the exact $8,000 Saturday emergency job hits much harder.',
          prescription: 'Include: <em>"...most guys send it to voicemail and lose the $8,000 job to the next competitor. Where does that call ring right now?"</em>',
          damage: 24,
          xp: 25,
          healBoss: 0,
          counterDmg: 10,
          advanceStage: true,
          nextStageDialogue: dungeons[bossKey].dialogue.stage3,
          agreementAchieved: false
        };
      } else {
        return {
          grade: 'C',
          score: 45,
          critique: 'You drifted away from the pain. Contractors only care about stopping revenue leaks, not vague benefits.',
          prescription: 'Ask him directly: <em>"When an emergency calls at 8 PM on a Saturday, where does that call ring right now?"</em>',
          damage: 10,
          xp: 5,
          healBoss: 10,
          counterDmg: 18,
          advanceStage: false,
          agreementAchieved: false
        };
      }
    } else if (stage === 3) {
      const hasAgreement = t.includes('agree') || t.includes('completely agree') || t.includes('makes sense') || t.includes('hear you') || t.includes('fair') || t.includes('100%');
      const hasObjectionCounter = t.includes('buried') || t.includes('receipt') || t.includes('after-hours') || t.includes('weekend') || t.includes('397') || t.includes('299') || t.includes('697') || t.includes('contract') || t.includes('done for you') || t.includes('15 second');

      if (hasAgreement && hasObjectionCounter) {
        return {
          grade: 'S',
          score: 96,
          critique: 'Textbook Total Agreement Shield! You validated his objection, removed all tension, and pivoted straight to the solution.',
          prescription: 'Next beat: Deliver the live 30-second Ava test challenge to (561) 813-8602.',
          damage: 32,
          xp: 35,
          healBoss: 0,
          counterDmg: 0,
          playerHeal: 15,
          advanceStage: true,
          nextStageDialogue: dungeons[bossKey].dialogue.stage4,
          agreementAchieved: false
        };
      } else if (hasAgreement || hasObjectionCounter) {
        return {
          grade: 'A',
          score: 82,
          critique: 'Good deflection. You addressed the objection without sounding argumentative.',
          prescription: 'Always start with: <em>"I completely agree with you..."</em> before giving your explanation.',
          damage: 22,
          xp: 20,
          healBoss: 0,
          counterDmg: 10,
          advanceStage: true,
          nextStageDialogue: dungeons[bossKey].dialogue.stage4,
          agreementAchieved: false
        };
      } else {
        return {
          grade: 'B',
          score: 65,
          critique: 'Average rebuttal. You didn\'t use the Total Agreement Shield to soften the pushback.',
          prescription: 'Agree first, then bridge: <em>"I agree with you! That\'s why we do 100% of it for you."</em>',
          damage: 14,
          xp: 10,
          healBoss: 0,
          counterDmg: 14,
          advanceStage: false,
          agreementAchieved: false
        };
      }
    } else if (stage === 4) {
      const hasPhone = t.includes('(561) 813-8602') || t.includes('561-813-8602') || t.includes('5618138602') || t.includes('813-8602');
      const hasChallenge = t.includes('punch in') || t.includes('call it') || t.includes('cell') || t.includes('robot') || t.includes('lose my number') || t.includes('30 second') || t.includes('test');

      if (hasPhone && hasChallenge) {
        return {
          grade: 'S',
          score: 99,
          critique: 'Irresistible zero-risk challenge! You challenged him to catch her sounding robotic on (561) 813-8602.',
          prescription: 'Final beat: Lock down the complete agreement (Live dial handoff or calendar booking).',
          damage: 35,
          xp: 40,
          healBoss: 0,
          counterDmg: 0,
          advanceStage: true,
          nextStageDialogue: dungeons[bossKey].dialogue.stage5,
          agreementAchieved: false
        };
      } else if (hasPhone || hasChallenge) {
        return {
          grade: 'A',
          score: 84,
          critique: 'Good push to the demo. Make sure to emphasize the phone number (561) 813-8602 directly.',
          prescription: 'Use: <em>"Have your cell in your hand? Punch in our live demo line right now: (561) 813-8602."</em>',
          damage: 25,
          xp: 25,
          healBoss: 0,
          counterDmg: 8,
          advanceStage: true,
          nextStageDialogue: dungeons[bossKey].dialogue.stage5,
          agreementAchieved: false
        };
      } else {
        return {
          grade: 'C',
          score: 55,
          critique: 'You explained the demo instead of putting the phone in his hands.',
          prescription: 'Don\'t explain Ava — challenge him to dial (561) 813-8602 for 30 seconds right now.',
          damage: 10,
          xp: 5,
          healBoss: 5,
          counterDmg: 16,
          advanceStage: false,
          agreementAchieved: false
        };
      }
    } else {
      const hasClosingAsk = t.includes('text') || t.includes('punch') || t.includes('dial') || t.includes('zoom') || t.includes('calendar') || t.includes('tomorrow') || t.includes('which time') || t.includes('transfer');

      if (hasClosingAsk) {
        return {
          grade: 'S',
          score: 100,
          critique: '🏆 MASTER RAINMAKER CLOSE! You secured complete agreement with zero resistance. The contractor agreed to test Ava.',
          prescription: 'You closed the call cleanly. Great job holding frame from opening to exit!',
          damage: 100,
          xp: 150,
          healBoss: 0,
          counterDmg: 0,
          advanceStage: false,
          nextStageDialogue: dungeons[bossKey].dialogue.victory,
          agreementAchieved: true
        };
      } else {
        return {
          grade: 'B',
          score: 70,
          critique: 'Almost closed! Give him the direct option: dial right now or text him the demo number.',
          prescription: 'Say: <em>"Hang up with me and dial (561) 813-8602 right now, or can I text you the link?"</em>',
          damage: 15,
          xp: 15,
          healBoss: 0,
          counterDmg: 10,
          advanceStage: false,
          agreementAchieved: false
        };
      }
    }
  }

  function executeTurn(userText) {
    if (player.hp <= 0 || currentBoss.hp <= 0) return;
    pauseImpatienceTimer();

    if (!matchStarted) {
      matchStarted = true;
      appendLog(`⚔️ <strong>CALL ENGAGED:</strong> Battle commenced! The 2-minute conversational clock is now active.`, 'system');
      if (sendAttackBtn) sendAttackBtn.innerHTML = '⚔️ Send Rebuttal ➔';
      if (customAttackInput) customAttackInput.placeholder = 'Type or speak what you say to the contractor out loud...';
    }

    appendLog(`<strong>Luke says:</strong> "${userText}"`, 'luke');
    coachHintDrawer.style.display = 'none';

    const evalRes = evaluateSalesTurn(userText, currentStage, currentBoss.key);
    let finalDmg = Math.round(evalRes.damage * player.dmgMultiplier);

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

    if (evalRes.playerHeal) player.hp = Math.min(player.maxHp, player.hp + evalRes.playerHeal);
    if (evalRes.healBoss) currentBoss.hp = Math.min(currentBoss.maxHp, currentBoss.hp + evalRes.healBoss);
    if (finalDmg > 0) {
      playSound('slash');
      currentBoss.hp -= finalDmg;
    }
    if (evalRes.xp > 0) addXP(evalRes.xp);

    if (!evalRes.agreementAchieved && currentBoss.hp <= 0) {
      currentBoss.hp = 1;
      appendLog(`🛡️ <strong>STAGGERED:</strong> ${currentBoss.name} has 1 HP left, but won't agree until you close the deal in Stage 5!`, 'system');
    }

    updateHUD();

    if (evalRes.agreementAchieved && currentBoss.hp <= 0) {
      currentBoss.hp = 0;
      updateHUD();
      player.streak++;
      playSound('levelup');
      matchStarted = false;
      pauseImpatienceTimer();
      if (impatienceDigits) impatienceDigits.textContent = 'VICTORY';

      appendLog(`<strong>${currentBoss.name}:</strong> "${currentBoss.dialogue.victory}"`, 'boss');
      appendLog(`🏆 <strong>BOSS DEFEATED — COMPLETE AGREEMENT REACHED!</strong> ${currentBoss.name} agreed to test Ava on (561) 813-8602!`, 'victory');
      speakContractor(currentBoss.dialogue.victory);

      turnIndicator.textContent = 'VICTORY! COMPLETE AGREEMENT REACHED.';
      return;
    }

    if (evalRes.advanceStage) {
      currentStage++;
      const stageStatuses = ['Hostile & Guarded', 'Skeptical & Listening', 'Defensive on Objections', 'Challenged on Demo', 'Ready to Agree'];
      currentBoss.status = stageStatuses[currentStage - 1] || 'Ready to Agree';
      updateHUD();

      turnIndicator.textContent = 'CONTRACTOR IS RESPONDING...';
      setTimeout(() => {
        const nextSpeech = evalRes.nextStageDialogue || currentBoss.dialogue['stage' + currentStage];
        appendLog(`<strong>${currentBoss.name}:</strong> "${nextSpeech}"`, 'boss');
        speakContractor(nextSpeech);
        turnIndicator.textContent = 'YOUR TURN: SPEAK OR TYPE REBUTTAL';
        startImpatienceTimer();
      }, 700);
    } else {
      turnIndicator.textContent = 'CONTRACTOR IS RETALIATING...';
      setTimeout(() => {
        let bossDmg = evalRes.counterDmg || currentBoss.baseDmg;
        playSound('hit');
        player.hp = Math.max(0, player.hp - bossDmg);

        const pushbacks = [
          `"You're not answering my question, kid." (-${bossDmg} HP)`,
          `"Sounds like a canned sales pitch." (-${bossDmg} HP)`,
          `"I don't have time for games today." (-${bossDmg} HP)`
        ];
        const retort = pushbacks[Math.floor(Math.random() * pushbacks.length)];
        appendLog(`<strong>${currentBoss.name}:</strong> ${retort}`, 'boss');
        speakContractor(retort);

        updateHUD();

        if (player.hp <= 0) {
          playerKnockout();
        } else {
          turnIndicator.textContent = 'YOUR TURN: SPEAK OR TYPE REBUTTAL';
          startImpatienceTimer();
        }
      }, 700);
    }
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

  document.getElementById('restartMatchBtn').addEventListener('click', () => {
    player.hp = player.maxHp;
    startDungeon(currentDungeonKey);
  });

  document.getElementById('customAttackForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('customAttackInput');
    const txt = input.value.trim();
    if (!txt || player.hp <= 0 || currentBoss.hp <= 0) return;
    executeTurn(txt);
    input.value = '';
  });

  // Initialization
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
