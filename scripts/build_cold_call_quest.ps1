# ============================================================
# ⚔️ BUILD COLD CALL QUEST: STANDALONE SALES RPG 4.0
# Generates website/cold-call-quest/index.html with UTF-8 BOM
# Features Adaptive Brain 4.0 with Conversational State Machine
# ============================================================

$questHtml = @'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VantorX — Cold Call Quest 4.0 (Standalone Sales RPG &amp; Armory)</title>
<meta name="description" content="Master trade contractor cold calling in a full-fledged RPG. 8 Contractor Bosses, Conversational Brain 4.0, Swords & Armor Armory, Level 1-10 Progression, and Tactical Health Regain.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#070a0f;--bg2:#0f1522;--bg3:#151d2f;--card-bg:rgba(15,21,34,0.92);
  --line:rgba(255,255,255,0.08);--line2:rgba(255,255,255,0.16);
  --ink:#f1f5f9;--dim:#94a3b8;--faint:#64748b;
  --accent:#f59e0b;--accent2:#fbbf24;--accent-glow:rgba(245,158,11,0.25);
  --ok:#34d399;--ok-glow:rgba(52,211,153,0.3);
  --err:#f87171;--err-glow:rgba(248,113,113,0.3);
  --blue:#38bdf8;--purple:#a855f7;--gold:#eab308;
  --font-sans:'Inter',system-ui,sans-serif;--font-head:'Space Grotesk',sans-serif;--font-mono:'IBM Plex Mono',monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:var(--font-sans);line-height:1.5;-webkit-font-smoothing:antialiased;min-height:100vh;padding-bottom:60px}
.wrap{max-width:1300px;margin:0 auto;padding:0 20px}

/* Top Sticky HUD */
header{background:rgba(15,21,34,0.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);padding:12px 0;position:sticky;top:0;z-index:60}
.hud-grid{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.brand{font-family:var(--font-head);font-size:20px;font-weight:800;display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink)}
.brand span{color:var(--accent)}
.brand .badge{background:var(--accent-glow);color:var(--accent2);border:1px solid rgba(245,158,11,0.4);font-size:11px;padding:2px 8px;border-radius:6px;font-family:var(--font-mono);font-weight:700}

.hud-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.hud-btn{background:var(--bg3);border:1px solid var(--line2);color:var(--ink);padding:7px 14px;border-radius:8px;font-family:var(--font-head);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s;text-decoration:none}
.hud-btn:hover{background:rgba(245,158,11,0.15);border-color:var(--accent);color:var(--accent2)}
.hud-btn.gold{background:linear-gradient(135deg,#f59e0b,#d97706);color:#070a0f;font-weight:800;border:none}
.hud-btn.gold:hover{background:linear-gradient(135deg,#fbbf24,#f59e0b);box-shadow:0 0 15px var(--accent-glow)}

/* Master Player Status Bar */
.master-player-bar{background:linear-gradient(135deg,rgba(15,21,34,0.98),rgba(21,29,47,0.98));border:1px solid var(--line2);border-radius:16px;padding:16px 22px;margin:20px 0;box-shadow:0 15px 35px rgba(0,0,0,0.4);display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center}
@media(max-width:900px){.master-player-bar{grid-template-columns:1fr}}

.player-avatar-card{display:flex;align-items:center;gap:14px}
.avatar-frame{width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,rgba(245,158,11,0.25),rgba(15,21,34,0.9));border:2px solid var(--accent);display:grid;place-content:center;font-size:26px;box-shadow:0 0 20px var(--accent-glow);position:relative}
.avatar-frame .lvl-tag{position:absolute;bottom:-6px;right:-6px;background:var(--accent);color:#070a0f;font-family:var(--font-mono);font-size:10px;font-weight:900;padding:1px 5px;border-radius:4px}
.player-meta h2{font-family:var(--font-head);font-size:18px;font-weight:800;display:flex;align-items:center;gap:8px}
.player-meta .rank-title{font-size:12.5px;color:var(--accent2);font-weight:600}
.player-meta .equip-summary{font-size:11.5px;color:var(--dim);font-family:var(--font-mono);margin-top:2px}

.vitals-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:600px){.vitals-grid{grid-template-columns:1fr}}
.vital-box{background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:10px 14px}
.vital-header{display:flex;align-items:center;justify-content:space-between;font-size:11.5px;font-family:var(--font-mono);margin-bottom:6px}
.bar-track{height:9px;background:rgba(255,255,255,0.06);border-radius:999px;overflow:hidden;position:relative}
.bar-fill-hp{height:100%;background:linear-gradient(90deg,#ef4444,#10b981);border-radius:999px;transition:width 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:0 0 10px rgba(16,185,129,0.3)}
.bar-fill-xp{height:100%;background:linear-gradient(90deg,#8b5cf6,#38bdf8);border-radius:999px;transition:width 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:0 0 10px rgba(56,189,248,0.4)}

.wallet-badge{background:var(--bg);border:1px solid rgba(245,158,11,0.3);padding:10px 16px;border-radius:12px;text-align:center;min-width:130px}
.wallet-badge .gold-val{font-size:20px;font-weight:800;color:var(--accent2);font-family:var(--font-head)}
.wallet-badge .gold-lbl{font-size:11px;color:var(--dim);font-family:var(--font-mono);text-transform:uppercase}

/* Layout Grid: 8 Boss Gauntlet Sidebar + Battle Arena */
.arena-layout{display:grid;grid-template-columns:360px 1fr;gap:24px}
@media(max-width:1050px){.arena-layout{grid-template-columns:1fr}}

/* Boss Gauntlet Sidebar */
.boss-sidebar{background:var(--card-bg);border:1px solid var(--line2);border-radius:18px;padding:20px;box-shadow:0 20px 40px rgba(0,0,0,0.35);max-height:850px;display:flex;flex-direction:column}
.sidebar-title{font-family:var(--font-head);font-size:16px;font-weight:800;color:var(--accent2);display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--line)}
.boss-list{overflow-y:auto;flex:1;padding-right:4px;display:flex;flex-direction:column;gap:10px}
.boss-card-btn{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:12px 14px;cursor:pointer;transition:all 0.15s;text-align:left;position:relative;display:flex;align-items:center;gap:12px}
.boss-card-btn:hover{border-color:rgba(245,158,11,0.4);background:rgba(245,158,11,0.05);transform:translateX(2px)}
.boss-card-btn.active{border-color:var(--accent);background:linear-gradient(90deg,rgba(245,158,11,0.18),rgba(15,21,34,0.95));box-shadow:0 0 18px var(--accent-glow)}
.boss-card-btn.defeated{border-color:rgba(52,211,153,0.3);background:rgba(52,211,153,0.04)}
.boss-avatar{width:44px;height:44px;border-radius:10px;background:var(--bg3);border:1px solid var(--line2);display:grid;place-content:center;font-size:22px;flex-shrink:0}
.boss-meta h4{font-family:var(--font-head);font-size:14px;font-weight:700;color:#ffffff;display:flex;align-items:center;gap:6px}
.boss-meta p{font-size:11.5px;color:var(--dim);margin-top:2px}
.boss-hp-tag{font-size:11px;font-family:var(--font-mono);font-weight:700;margin-top:4px;display:flex;align-items:center;gap:6px}
.boss-status-badge{margin-left:auto;font-size:11px;font-family:var(--font-mono);font-weight:700;padding:2px 7px;border-radius:4px}
.status-cleared{background:rgba(52,211,153,0.15);color:var(--ok);border:1px solid rgba(52,211,153,0.3)}
.status-locked{background:rgba(100,116,139,0.15);color:var(--faint);border:1px solid var(--line)}
.status-ready{background:var(--accent-glow);color:var(--accent2);border:1px solid rgba(245,158,11,0.4)}

/* Main Battle Arena */
.battle-arena{background:var(--card-bg);border:1px solid var(--line2);border-radius:18px;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,0.4);position:relative;display:flex;flex-direction:column;gap:18px}
.battle-arena::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--accent2),#ef4444);border-radius:18px 18px 0 0}

/* Active Boss Stage Header */
.active-boss-hud{background:linear-gradient(135deg,rgba(26,36,56,0.9),rgba(15,21,34,0.95));border:1px solid var(--line2);border-radius:14px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.active-boss-info{display:flex;align-items:center;gap:16px}
.active-boss-portrait{width:64px;height:64px;border-radius:14px;background:var(--bg);border:2px solid var(--err);display:grid;place-content:center;font-size:32px;box-shadow:0 0 20px var(--err-glow)}
.active-boss-title h3{font-family:var(--font-head);font-size:19px;font-weight:800;color:#ffffff;display:flex;align-items:center;gap:8px}
.active-boss-title p{font-size:13px;color:var(--dim);margin-top:2px}
.active-boss-badges{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
.badge-pill{font-size:11px;font-family:var(--font-mono);background:var(--bg);border:1px solid var(--line2);padding:2px 8px;border-radius:4px;color:var(--accent2)}

.active-boss-hp-box{min-width:240px;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:12px 16px}
.boss-hp-header{display:flex;justify-content:space-between;font-size:12px;font-family:var(--font-mono);font-weight:700;color:var(--dim);margin-bottom:6px}
.boss-hp-track{height:10px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden}
.boss-hp-fill{height:100%;width:100%;background:linear-gradient(90deg,#ef4444,#f59e0b);border-radius:999px;transition:width 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:0 0 12px var(--err-glow)}

/* Combat Terminal / Dialogue Log */
.combat-terminal{background:#040609;border:1px solid var(--line2);border-radius:14px;height:340px;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px;font-family:var(--font-sans);box-shadow:inset 0 4px 20px rgba(0,0,0,0.7)}
.log-entry{padding:10px 14px;border-radius:10px;font-size:14px;line-height:1.55;animation:fadeIn 0.2s ease-out}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.log-boss{background:rgba(239,68,68,0.1);border-left:3px solid var(--err);color:#fca5a5}
.log-boss strong{color:#ffffff}
.log-player{background:rgba(56,189,248,0.1);border-left:3px solid var(--blue);color:#e0f2fe;align-self:flex-end;max-width:90%}
.log-player strong{color:#ffffff}
.log-system{background:rgba(245,158,11,0.1);border-left:3px solid var(--accent);color:var(--accent2);font-family:var(--font-mono);font-size:12.5px}
.log-heal{background:rgba(52,211,153,0.12);border-left:3px solid var(--ok);color:#a7f3d0;font-weight:600}
.log-crit{background:linear-gradient(90deg,rgba(245,158,11,0.2),rgba(239,68,68,0.2));border:1px solid var(--accent);color:#fef08a;font-weight:700}

/* Tactical Quick-Strike Dock */
.tactical-dock{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
@media(max-width:800px){.tactical-dock{grid-template-columns:1fr 1fr}}
@media(max-width:500px){.tactical-dock{grid-template-columns:1fr}}

.strike-card{background:var(--bg);border:1px solid var(--line2);border-radius:10px;padding:12px;cursor:pointer;transition:all 0.15s;text-align:left}
.strike-card:hover{border-color:var(--accent);background:rgba(245,158,11,0.08);transform:translateY(-2px)}
.strike-card .strike-tag{font-size:10.5px;font-family:var(--font-mono);font-weight:700;color:var(--accent2);text-transform:uppercase;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between}
.strike-card .strike-text{font-size:12px;color:var(--ink);line-height:1.4}
.strike-card.heal-action{border-color:rgba(52,211,153,0.4);background:rgba(52,211,153,0.05)}
.strike-card.heal-action:hover{border-color:var(--ok);background:rgba(52,211,153,0.12)}
.strike-card.heal-action .strike-tag{color:var(--ok)}
.strike-card:disabled{opacity:0.4;cursor:not-allowed;transform:none}
.strike-card.pulse-card{border-color:var(--accent)!important;background:rgba(245,158,11,0.12)!important;box-shadow:0 0 14px var(--accent-glow);animation:cardGlow 1.8s infinite alternate}
@keyframes cardGlow{from{box-shadow:0 0 6px var(--accent-glow);border-color:rgba(245,158,11,0.6)}to{box-shadow:0 0 20px var(--accent-glow);border-color:var(--accent2)}}
.speaker-anim{animation:speakerPulse 0.45s infinite alternate}
@keyframes speakerPulse{from{transform:scale(1)}to{transform:scale(1.12);filter:drop-shadow(0 0 14px var(--accent))}}

/* Custom Speech / Rebuttal Input Dock */
.input-dock{display:flex;gap:10px;align-items:center}
.custom-input{flex:1;background:var(--bg);border:1.5px solid var(--line2);color:#ffffff;padding:14px 18px;border-radius:12px;font-size:15px;font-family:var(--font-sans);outline:none;transition:border-color 0.15s}
.custom-input:focus{border-color:var(--accent);box-shadow:0 0 15px var(--accent-glow)}
.custom-input::placeholder{color:var(--faint)}

.dock-btn{padding:14px 22px;border-radius:12px;font-family:var(--font-head);font-size:14.5px;font-weight:800;cursor:pointer;border:none;display:inline-flex;align-items:center;gap:8px;transition:all 0.15s}
.dock-btn.send{background:linear-gradient(135deg,#f59e0b,#d97706);color:#070a0f}
.dock-btn.send:hover{background:linear-gradient(135deg,#fbbf24,#f59e0b);box-shadow:0 0 20px var(--accent-glow)}
.dock-btn.mic{background:var(--bg3);border:1.5px solid var(--line2);color:var(--ink)}
.dock-btn.mic:hover{border-color:var(--accent);color:var(--accent2)}
.dock-btn.mic.listening{background:rgba(239,68,68,0.2);border-color:var(--err);color:var(--err);animation:pulseMic 1s infinite alternate}
@keyframes pulseMic{from{box-shadow:0 0 5px var(--err)}to{box-shadow:0 0 20px var(--err)}}

/* Coach Prescription Area */
.coach-box{background:rgba(21,29,47,0.7);border:1px solid var(--line);border-radius:10px;padding:10px 14px;font-size:12.5px;color:var(--dim);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.coach-box strong{color:var(--accent2)}

/* Modals (Armory, Level Up, Victory) */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);z-index:100;display:none;place-content:center;padding:20px}
.modal-overlay.open{display:grid;animation:modalIn 0.2s ease-out}
@keyframes modalIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
.modal-card{background:var(--bg2);border:1.5px solid var(--line2);border-radius:20px;max-width:960px;width:100%;max-height:90vh;overflow-y:auto;padding:28px;box-shadow:0 25px 60px rgba(0,0,0,0.6);position:relative}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid var(--line);margin-bottom:20px}
.modal-header h2{font-family:var(--font-head);font-size:22px;font-weight:800;color:var(--accent2);display:flex;align-items:center;gap:10px}
.modal-close{background:none;border:none;color:var(--dim);font-size:24px;cursor:pointer;padding:4px 8px}
.modal-close:hover{color:#ffffff}

/* Armory Items Grid */
.armory-section-title{font-family:var(--font-head);font-size:16px;font-weight:700;color:var(--accent);margin:16px 0 10px;display:flex;align-items:center;gap:8px}
.armory-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media(max-width:850px){.armory-grid{grid-template-columns:1fr 1fr}}
@media(max-width:550px){.armory-grid{grid-template-columns:1fr}}

.gear-card{background:var(--bg);border:1.5px solid var(--line);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:10px;position:relative;transition:all 0.15s}
.gear-card:hover{border-color:rgba(245,158,11,0.4);transform:translateY(-2px)}
.gear-card.equipped{border-color:var(--ok);background:rgba(52,211,153,0.06);box-shadow:0 0 15px rgba(52,211,153,0.2)}
.gear-card.locked{opacity:0.5;filter:grayscale(0.6)}
.gear-top{display:flex;align-items:center;gap:12px}
.gear-icon{width:46px;height:46px;border-radius:10px;background:var(--bg3);border:1px solid var(--line2);display:grid;place-content:center;font-size:24px}
.gear-meta h4{font-family:var(--font-head);font-size:15px;font-weight:700;color:#ffffff}
.gear-meta .stat-boost{font-size:12px;font-family:var(--font-mono);font-weight:700;color:var(--ok)}
.gear-desc{font-size:12px;color:var(--dim);line-height:1.45}
.gear-passive{font-size:11.5px;color:var(--accent2);background:rgba(245,158,11,0.08);border-radius:6px;padding:6px 8px}
.gear-btn{margin-top:auto;width:100%;padding:8px 12px;border-radius:8px;font-family:var(--font-head);font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all 0.15s}
.gear-btn.equip{background:linear-gradient(135deg,#f59e0b,#d97706);color:#070a0f}
.gear-btn.equip:hover{background:linear-gradient(135deg,#fbbf24,#f59e0b)}
.gear-btn.equipped-badge{background:rgba(52,211,153,0.2);color:var(--ok);border:1px solid var(--ok);cursor:default}
.gear-btn.locked-btn{background:var(--bg3);color:var(--faint);cursor:not-allowed}

/* FX Canvas for Confetti & Particles */
#fxCanvas{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:99999}

/* Screen / Arena Shake & Flash */
@keyframes shakeArena{
  0%{transform:translate(0,0) rotate(0deg)}
  15%{transform:translate(-5px,3px) rotate(-0.5deg)}
  30%{transform:translate(5px,-4px) rotate(0.5deg)}
  45%{transform:translate(-4px,-2px) rotate(-0.3deg)}
  60%{transform:translate(4px,2px) rotate(0.3deg)}
  75%{transform:translate(-2px,1px) rotate(-0.1deg)}
  100%{transform:translate(0,0) rotate(0deg)}
}
.shake-arena{animation:shakeArena 0.35s cubic-bezier(0.36,0.07,0.19,0.97) both}

@keyframes flashCrit{
  0%{opacity:0}
  30%{opacity:0.45}
  100%{opacity:0}
}
.crit-flash-overlay{position:absolute;inset:0;border-radius:18px;background:radial-gradient(circle,rgba(245,158,11,0.5),rgba(239,68,68,0.25),transparent);pointer-events:none;animation:flashCrit 0.45s ease-out forwards;z-index:15}

/* Floating Combat Numbers */
@keyframes floatNumberUp{
  0%{opacity:0;transform:translate(-50%,0) scale(0.5)}
  18%{opacity:1;transform:translate(-50%,-15px) scale(1.3)}
  70%{opacity:1;transform:translate(-50%,-45px) scale(1.05)}
  100%{opacity:0;transform:translate(-50%,-75px) scale(0.85)}
}
.floating-number{position:absolute;pointer-events:none;font-family:var(--font-head);font-weight:900;z-index:60;animation:floatNumberUp 1.05s cubic-bezier(0.22,1,0.36,1) forwards;text-shadow:0 3px 12px rgba(0,0,0,0.9),0 0 16px currentColor;letter-spacing:0.05em;white-space:nowrap}
.floating-crit{color:#fef08a;font-size:26px;text-shadow:0 0 25px #f59e0b,0 0 40px #ef4444}
.floating-damage{color:#fb923c;font-size:20px}
.floating-heal{color:#34d399;font-size:20px;text-shadow:0 0 15px rgba(52,211,153,0.6)}
.floating-deflect{color:#38bdf8;font-size:18px}
.floating-combo{color:#f43f5e;font-size:24px;text-shadow:0 0 25px rgba(244,63,94,0.7)}
.floating-execute{color:#c084fc;font-size:26px;text-shadow:0 0 30px rgba(192,132,252,0.8)}

/* Combo Fire Streak Badge */
.streak-badge{font-size:12px;font-family:var(--font-mono);font-weight:800;padding:3px 8px;border-radius:6px;transition:all 0.25s ease;display:inline-flex;align-items:center;gap:4px}
.streak-on-fire{background:linear-gradient(135deg,rgba(245,158,11,0.3),rgba(239,68,68,0.3));border:1px solid var(--accent);color:#fef08a !important;box-shadow:0 0 18px rgba(245,158,11,0.6);animation:firePulse 1.2s infinite alternate}
@keyframes firePulse{
  from{transform:scale(1);box-shadow:0 0 10px rgba(245,158,11,0.4)}
  to{transform:scale(1.08);box-shadow:0 0 25px rgba(239,68,68,0.7)}
}

/* Execute Threshold Indicator */
.execute-threshold{border-color:#c084fc !important;box-shadow:0 0 25px rgba(192,132,252,0.6) !important;animation:executePulse 0.9s infinite alternate}
@keyframes executePulse{
  from{border-color:#a855f7;box-shadow:0 0 12px rgba(168,85,247,0.4)}
  to{border-color:#f43f5e;box-shadow:0 0 30px rgba(244,63,94,0.7)}
}

/* Bouncing Mystery Loot Chest */
@keyframes chestBounce{
  0%,100%{transform:translateY(0) scale(1)}
  50%{transform:translateY(-10px) scale(1.08)}
}
.bouncing-chest{animation:chestBounce 1.5s infinite ease-in-out;filter:drop-shadow(0 0 25px rgba(245,158,11,0.7))}
@keyframes chestShake{
  0%{transform:rotate(0deg) scale(1)}
  20%{transform:rotate(-12deg) scale(1.15)}
  40%{transform:rotate(12deg) scale(1.2)}
  60%{transform:rotate(-10deg) scale(1.25)}
  80%{transform:rotate(10deg) scale(1.3)}
  100%{transform:rotate(0deg) scale(1.35)}
}
.chest-cracking{animation:chestShake 0.65s cubic-bezier(0.36,0.07,0.19,0.97) forwards}

@keyframes zoomIn{
  from{opacity:0;transform:scale(0.85)}
  to{opacity:1;transform:scale(1)}
}
</style>
</head>
<body>
<canvas id="fxCanvas"></canvas>

<!-- TOP STICKY HUD -->
<header>
  <div class="wrap">
    <div class="hud-grid">
      <a href="index.html" class="brand">
        <span>⚔️ VANTORX: COLD CALL QUEST</span>
        <span class="badge">DOPAMINE 5.0</span>
      </a>

      <div class="hud-actions">
        <div style="display:inline-flex;align-items:center;gap:6px;background:var(--bg3);border:1px solid rgba(245,158,11,0.3);padding:6px 14px;border-radius:10px;font-family:var(--font-mono);font-size:12px;color:var(--accent2)">
          <span>🏆 Deals Won:</span> <strong id="sessionDealsWon" style="color:#ffffff;font-size:13px">0 / 8</strong>
        </div>
        <button class="hud-btn" id="voiceToggleBtn" onclick="toggleVoice()">🗣️ Voice: OFF (Click to Enable)</button>
        <button class="hud-btn" id="soundToggleBtn" onclick="toggleSound()">🔊 SFX: ON</button>
        <button class="hud-btn gold" onclick="openArmoryModal()">🛡️ Armory (Swords &amp; Armor)</button>
        <a href="../cold-call-arena/index.html" class="hud-btn" style="border-color:rgba(56,189,248,0.4);color:var(--blue)">📋 Lead Dispatcher &amp; Cockpit ➔</a>
      </div>
    </div>
  </div>
</header>

<main class="wrap">

  <!-- MASTER PLAYER STATUS BAR -->
  <div class="master-player-bar">
    <div class="player-avatar-card">
      <div class="avatar-frame">
        <span id="playerAvatarIcon">🗡️</span>
        <span class="lvl-tag" id="playerLvlTag">LVL 1</span>
      </div>
      <div class="player-meta">
        <h2 id="playerNameHeader">Luke the Closer <span class="streak-badge" id="streakHeader">🔥 0 Streak</span></h2>
        <div class="rank-title" id="playerRankHeader">Novice Dialer</div>
        <div class="equip-summary" id="playerEquipSummary">⚔️ Lead Gavel · 🛡️ Denim Workshirt</div>
      </div>
    </div>

    <div class="vitals-grid">
      <div class="vital-box">
        <div class="vital-header">
          <span style="color:var(--err);font-weight:700">❤️ REJECTION ARMOR (HP)</span>
          <span id="hpDigits" style="color:#ffffff;font-weight:800">100 / 100</span>
        </div>
        <div class="bar-track"><div class="bar-fill-hp" id="hpBarFill" style="width:100%"></div></div>
      </div>
      <div class="vital-box">
        <div class="vital-header">
          <span style="color:var(--blue);font-weight:700">⭐ CLOSING XP</span>
          <span id="xpDigits" style="color:#ffffff;font-weight:800">0 / 150 XP (0%)</span>
        </div>
        <div class="bar-track"><div class="bar-fill-xp" id="xpBarFill" style="width:0%"></div></div>
      </div>
    </div>

    <div class="wallet-badge">
      <div class="gold-val" id="goldDigits">💰 0 GP</div>
      <div class="gold-lbl">Earned in Combat</div>
    </div>
  </div>

  <!-- ARENA LAYOUT: 8 BOSS GAUNTLET + BATTLE ARENA -->
  <div class="arena-layout">

    <!-- BOSS GAUNTLET SIDEBAR (8 CONTRACTORS) -->
    <aside class="boss-sidebar">
      <div class="sidebar-title">
        <span>⚔️ 8 CONTRACTOR DUNGEONS</span>
        <span style="font-size:12px;font-family:var(--font-mono);color:var(--accent)" id="clearedBossRatio">0 / 8 Cleared</span>
      </div>
      <div class="boss-list" id="bossListContainer">
        <!-- Rendered dynamically via JS -->
      </div>
    </aside>

    <!-- BATTLE ARENA -->
    <section class="battle-arena">

      <!-- ACTIVE BOSS STAGE HUD -->
      <div class="active-boss-hud">
        <div class="active-boss-info">
          <div class="active-boss-portrait" id="activeBossPortrait">🔨</div>
          <div class="active-boss-title">
            <h3 id="activeBossName">Rick "The Road Rager"</h3>
            <p id="activeBossSub">Tampa Commercial Roofing Owner · Impatient / Driving</p>
            <div class="active-boss-badges" id="activeBossBadges">
              <span class="badge-pill">Roofing</span>
              <span class="badge-pill">Tampa FL</span>
              <span class="badge-pill">Tier 1</span>
            </div>
          </div>
        </div>

        <div class="active-boss-hp-box">
          <div class="boss-hp-header">
            <span>CONTRACTOR SKEPTICISM (HP)</span>
            <span id="bossHpDigits">100 / 100</span>
          </div>
          <div class="boss-hp-track">
            <div class="boss-hp-fill" id="bossHpFill" style="width:100%"></div>
          </div>
        </div>
      </div>

      <!-- COMBAT TERMINAL / DIALOGUE LOG -->
      <div class="combat-terminal" id="combatLog">
        <!-- Log entries appear here -->
      </div>

      <!-- COACH PRESCRIPTION BAR -->
      <div class="coach-box">
        <span id="coachPrescription">💡 <strong>Closer Coach:</strong> Acknowledge his situation before dropping the $8,000 emergency leak hook.</span>
        <span id="turnIndicatorBadge" style="font-family:var(--font-mono);font-size:11.5px;color:var(--accent2);font-weight:700">YOUR TURN: SPEAK OR STRIKE</span>
      </div>

      <!-- TACTICAL QUICK-STRIKE DOCK (INCLUDES HEALTH REGAIN) -->
      <div class="tactical-dock" id="tacticalDock">
        <button class="strike-card" type="button" onclick="executeQuickStrike('permission')">
          <div class="strike-tag">⚡ Permission Opener <span>+Crit</span></div>
          <div class="strike-text">"Hey Rick, I know you're in the field — you got 30 seconds before you hang up?"</div>
        </button>

        <button class="strike-card" type="button" onclick="executeQuickStrike('leak')">
          <div class="strike-tag">🎯 $8,000 Leak Hook <span>+Bleed</span></div>
          <div class="strike-text">"Where does an emergency $8,000 leak call ring when you're 3 stories up?"</div>
        </button>

        <button class="strike-card" type="button" onclick="executeQuickStrike('demo')">
          <div class="strike-tag">🛡️ Test Ava Live <span>(561) 813-8602</span></div>
          <div class="strike-text">"Don't take my word for it. Dial (561) 813-8602 right now from your truck."</div>
        </button>

        <button class="strike-card heal-action" type="button" id="breatherBtn" onclick="executeTakeABreather()">
          <div class="strike-tag">☕ Take a Breather <span id="breatherCooldownText">+30 HP</span></div>
          <div class="strike-text">Take a tactical breath, calibrate vocal pitch, and restore +30 HP (2T CD).</div>
        </button>
      </div>

      <!-- CUSTOM SPEECH / REBUTTAL INPUT DOCK -->
      <div class="input-dock">
        <button class="dock-btn mic" id="micBtn" type="button" onclick="toggleSpeechRecognition()" title="Speak with microphone">
          🎙️ <span id="micLabel">Speak</span>
        </button>
        <input type="text" class="custom-input" id="playerCustomInput" placeholder="Speak into mic or type your custom rebuttal here..." onkeydown="handleInputKey(event)">
        <button class="dock-btn send" id="sendBtn" type="button" onclick="submitRebuttal()">
          ⚔️ Attack Rebuttal ➔
        </button>
      </div>

    </section>

  </div>

</main>

<!-- ARMORY MODAL (SWORDS & ARMOR) -->
<div class="modal-overlay" id="armoryModal">
  <div class="modal-card">
    <div class="modal-header">
      <h2>🛡️ VANTORX ARMORY — SWORDS &amp; ARMOR</h2>
      <button class="modal-close" onclick="closeArmoryModal()">✕</button>
    </div>

    <p style="color:var(--dim);font-size:13.5px;margin-bottom:16px">
      Equip your Cold Caller with legendary weapons and defensive gear. Weapons boost objection penetration and critical strikes; armor shields you against contractor rejection damage and restores health.
    </p>

    <!-- WEAPONS SECTION -->
    <div class="armory-section-title">⚔️ OFFENSIVE SWORDS &amp; WEAPONS</div>
    <div class="armory-grid" id="weaponsGrid">
      <!-- Injected via JS -->
    </div>

    <!-- ARMOR SECTION -->
    <div class="armory-section-title" style="margin-top:24px">🛡️ DEFENSIVE SUITS &amp; SHIELDS</div>
    <div class="armory-grid" id="armorGrid">
      <!-- Injected via JS -->
    </div>

    <!-- RELICS SECTION -->
    <div class="armory-section-title" style="margin-top:24px">🏆 CONTRACTOR RELICS &amp; PERKS</div>
    <div class="armory-grid" id="relicsGrid">
      <!-- Injected via JS -->
    </div>
  </div>
</div>

<!-- LEVEL UP CELEBRATION MODAL -->
<div class="modal-overlay" id="levelUpModal">
  <div class="modal-card" style="max-width:540px;text-align:center">
    <div style="font-size:54px;margin-bottom:10px">🎉</div>
    <h2 style="font-family:var(--font-head);font-size:26px;color:var(--accent2);margin-bottom:6px" id="levelUpTitle">LEVEL UP!</h2>
    <div style="font-size:16px;color:#ffffff;font-weight:700;margin-bottom:14px" id="levelUpRank">Appointment Slayer (Level 5)</div>
    <p style="color:var(--dim);font-size:14px;line-height:1.5;margin-bottom:20px" id="levelUpDesc">
      Your cold call authority has expanded! Max HP increased and higher tier weapons are unlocked in the Armory.
    </p>
    <button class="hud-btn gold" style="width:100%;padding:12px;font-size:15px;justify-content:center" onclick="closeLevelUpModal()">
      ⚔️ Continue The Gauntlet ➔
    </button>
  </div>
</div>

<!-- CALL TERMINATED / DEFEAT MODAL -->
<div class="modal-overlay" id="defeatModal">
  <div class="modal-card" style="max-width:540px;text-align:center;border-color:rgba(239,68,68,0.7);box-shadow:0 0 50px rgba(239,68,68,0.3)">
    <div style="font-size:56px;margin-bottom:8px">📵💀</div>
    <div style="font-size:12px;font-family:var(--font-mono);font-weight:700;color:#ef4444;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">CALL DISCONNECTED · CONTRACTOR HUNG UP</div>
    <h2 style="font-family:var(--font-head);font-size:26px;color:#ffffff;margin-bottom:8px" id="defeatTitle">YOU GOT HUNG UP ON!</h2>
    <div style="font-size:14.5px;color:#fca5a5;font-weight:700;margin-bottom:16px;font-style:italic" id="defeatBossBark">
      "Stop wasting my time with generic telemarketer pitch crap. Lose my number!"
    </div>
    
    <div style="background:var(--bg3);border:1px solid rgba(239,68,68,0.35);border-radius:12px;padding:16px;text-align:left;margin-bottom:20px">
      <div style="font-size:12px;font-weight:700;color:#ef4444;margin-bottom:4px;font-family:var(--font-mono)">❌ FATAL MISTAKE:</div>
      <div style="font-size:13.5px;color:#ffffff;line-height:1.5;margin-bottom:12px" id="defeatMistakeDesc">
        Sounded like an amateur script-reading telemarketer without establishing trade pain or asking permission.
      </div>
      <div style="font-size:12px;font-weight:700;color:var(--accent2);margin-bottom:4px;font-family:var(--font-mono)">💡 COACH VANCE CLOSING REMEDY:</div>
      <div style="font-size:13px;color:var(--dim);line-height:1.5" id="defeatRemedyDesc">
        Next time, lead with the 20-second permission opener, agree with his skepticism first, and quote the $397 flat rate with zero long-term contracts.
      </div>
    </div>

    <button class="hud-btn gold" style="width:100%;padding:14px;font-size:16px;justify-content:center;box-shadow:0 0 25px rgba(245,158,11,0.4)" onclick="redialAfterDefeat()">
      🔄 Redial Contractor &amp; Try Again ➔
    </button>
  </div>
</div>

<!-- MYSTERY LOOT DROP MODAL (DOPAMINE REWARD) -->
<div class="modal-overlay" id="lootModal">
  <div class="modal-card" style="max-width:540px;text-align:center;border-color:rgba(245,158,11,0.8);box-shadow:0 0 60px rgba(245,158,11,0.35);background:radial-gradient(circle at 50% 20%, rgba(245,158,11,0.18), rgba(15,21,34,0.98))">
    <div style="font-size:12px;font-family:var(--font-mono);font-weight:800;color:var(--accent2);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px">CONTRACT SIGNED · VICTORY SPOILS</div>
    <h2 style="font-family:var(--font-head);font-size:26px;color:#ffffff;margin-bottom:8px" id="lootBossName">CONTRACTOR AGREED TO WALKTHROUGH!</h2>
    <div style="font-size:14px;color:#94a3b8;margin-bottom:20px" id="lootSubtitle">You broke through the contractor's skepticism and secured the demo. Crack your mystery loot chest!</div>

    <!-- Loot Chest Interactive Graphic -->
    <div id="chestContainer" style="cursor:pointer;padding:15px;margin-bottom:16px;user-select:none" onclick="crackLootChest()">
      <div id="chestIcon" style="font-size:80px;display:inline-block;transition:transform 0.2s" class="bouncing-chest">🎁</div>
      <div id="chestPrompt" style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--accent2);margin-top:8px">✨ CLICK TO CRACK LOOT CHEST ✨</div>
    </div>

    <!-- Loot Revealed Container (Hidden until cracked) -->
    <div id="lootRewardsBox" style="display:none;background:var(--bg3);border:1px solid rgba(245,158,11,0.35);border-radius:14px;padding:18px;text-align:left;margin-bottom:20px;animation:zoomIn 0.3s ease-out">
      <div style="font-size:12px;font-weight:700;color:var(--accent2);margin-bottom:10px;font-family:var(--font-mono)">🎉 VICTORY BOUNTY UNLOCKED:</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg);padding:10px 14px;border-radius:10px;border:1px solid var(--line)">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:24px">💰</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:#ffffff">Contractor Retainer Bounty</div>
              <div style="font-size:11.5px;color:var(--dim)">Instant cash commission</div>
            </div>
          </div>
          <div style="font-size:18px;font-weight:800;color:var(--accent2);font-family:var(--font-head)" id="lootGoldAmount">+250 GP</div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg);padding:10px 14px;border-radius:10px;border:1px solid var(--line)">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:24px">⭐</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:#ffffff">Closer Mastery Experience</div>
              <div style="font-size:11.5px;color:var(--dim)">Progress towards next rank</div>
            </div>
          </div>
          <div style="font-size:18px;font-weight:800;color:var(--blue);font-family:var(--font-head)" id="lootXpAmount">+350 XP</div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg);padding:10px 14px;border-radius:10px;border:1px solid rgba(168,85,247,0.3)" id="lootRelicRow">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:24px" id="lootRelicIcon">⚡</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:#d8b4fe" id="lootRelicName">Titanium Earbuds</div>
              <div style="font-size:11.5px;color:var(--dim)" id="lootRelicDesc">+15 Max HP permanent base pool</div>
            </div>
          </div>
          <div style="font-size:11px;font-weight:700;color:var(--purple);font-family:var(--font-mono);background:rgba(168,85,247,0.15);padding:3px 8px;border-radius:4px" id="lootRelicTag">RARE RELIC</div>
        </div>
      </div>
    </div>

    <button id="lootClaimBtn" class="hud-btn gold" style="display:none;width:100%;padding:14px;font-size:16px;justify-content:center;box-shadow:0 0 25px rgba(245,158,11,0.4)" onclick="claimLootAndAdvance()">
      ⚔️ Claim Spoils &amp; Battle Next Boss ➔
    </button>
  </div>
</div>

<script>
// ============================================================
// 🎮 STANDALONE COLD CALL QUEST 5.0 JAVASCRIPT ENGINE
// ============================================================

(function() {
  'use strict';

  // 1. SOUND & VOICE STATE (Defaults to OFF to prevent unprompted autoplay)
  let voiceEnabled = false;
  let sfxEnabled = true;
  let audioCtx = null;

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch(e){}
  }

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSynth(type, param) {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'slash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'crit') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'heal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'level') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(392, now);
        osc.frequency.setValueAtTime(523.25, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        osc.frequency.setValueAtTime(783.99, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'hangup') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.setValueAtTime(620, now + 0.12);
        osc.frequency.setValueAtTime(480, now + 0.24);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.36);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === 'cash') {
        // High register arcade chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.38);
        osc.start(now);
        osc.stop(now + 0.38);
      } else if (type === 'combo') {
        // Pentatonic ascending note based on streak level
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
        const noteIdx = Math.min(scale.length - 1, Math.max(0, (param || 1) - 1));
        const freq = scale[noteIdx];
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'execute') {
        // Thunderous execute bass drop
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'victory') {
        // Fanfare triumphant arpeggio
        osc.type = 'square';
        osc.frequency.setValueAtTime(261.63, now);
        osc.frequency.setValueAtTime(329.63, now + 0.1);
        osc.frequency.setValueAtTime(392.00, now + 0.2);
        osc.frequency.setValueAtTime(523.25, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'chest') {
        // Mysterious chest cracking rumble to shimmer
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);
        osc.frequency.setValueAtTime(880, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch(e) {
      console.warn('Synth error:', e);
    }
  }

  // 1b. CONFETTI & VISUAL JUICE SYSTEM
  let confettiParticles = [];
  let confettiAnimRunning = false;

  function initConfettiCanvas() {
    const canvas = document.getElementById('fxCanvas');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      const c = document.getElementById('fxCanvas');
      if (c) {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
      }
    });
  }

  function fireConfetti(count = 80) {
    const canvas = document.getElementById('fxCanvas');
    if (!canvas) return;
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#ef4444', '#fbbf24', '#38bdf8'];
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.35 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        life: 1.0,
        decay: Math.random() * 0.015 + 0.01
      });
    }
    if (!confettiAnimRunning) {
      confettiAnimRunning = true;
      requestAnimationFrame(animateConfetti);
    }
  }

  function animateConfetti() {
    const canvas = document.getElementById('fxCanvas');
    if (!canvas) {
      confettiAnimRunning = false;
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.vx *= 0.98;
      p.rotation += p.vRot;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > canvas.height + 20) {
        confettiParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }

    if (confettiParticles.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiAnimRunning = false;
    }
  }

  function spawnFloatingNumber(text, type = 'damage') {
    const container = document.querySelector('.terminal-card') || document.body;
    if (!container) return;
    const el = document.createElement('div');
    el.className = `floating-number floating-${type}`;
    el.textContent = text;
    const offsetLeft = 45 + (Math.random() * 20 - 10);
    const offsetTop = 28 + (Math.random() * 14 - 7);
    el.style.left = `${offsetLeft}%`;
    el.style.top = `${offsetTop}%`;
    container.style.position = 'relative';
    container.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1100);
  }

  function triggerArenaShake(isCrit = false) {
    const arena = document.querySelector('.arena-grid');
    if (arena) {
      arena.classList.remove('shake-arena');
      void arena.offsetWidth;
      arena.classList.add('shake-arena');
      setTimeout(() => arena.classList.remove('shake-arena'), 550);
    }
    if (isCrit) {
      let flash = document.querySelector('.crit-flash-overlay');
      if (!flash) {
        flash = document.createElement('div');
        flash.className = 'crit-flash-overlay';
        document.body.appendChild(flash);
      }
      flash.classList.remove('active');
      void flash.offsetWidth;
      flash.classList.add('active');
      setTimeout(() => flash.classList.remove('active'), 450);
    }
  }

  window._activeUtts = [];
  function speakContractor(text, bossKey) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      window._activeUtts = [];
      const clean = text.replace(/\([^)]*\)/g, '').replace(/\*\[[^\]]*\]\*/g, '').replace(/https?:\/\/\S+/g, '').trim();
      if (!clean) return;
      const utt = new SpeechSynthesisUtterance(clean);
      window._activeUtts.push(utt);
      utt.onstart = () => {
        const p = document.getElementById('activeBossPortrait');
        if (p) p.classList.add('speaker-anim');
      };
      utt.onend = () => {
        window._activeUtts = window._activeUtts.filter(u => u !== utt);
        const p = document.getElementById('activeBossPortrait');
        if (p) p.classList.remove('speaker-anim');
      };
      utt.onerror = () => {
        window._activeUtts = window._activeUtts.filter(u => u !== utt);
        const p = document.getElementById('activeBossPortrait');
        if (p) p.classList.remove('speaker-anim');
      };
      if (bossKey === 'gatekeeper') {
        utt.pitch = 1.15; utt.rate = 1.0;
      } else if (bossKey === 'skeptic') {
        utt.pitch = 0.82; utt.rate = 0.98;
      } else if (bossKey === 'price') {
        utt.pitch = 0.95; utt.rate = 1.12;
      } else if (bossKey === 'vito') {
        utt.pitch = 0.8; utt.rate = 0.95;
      } else {
        utt.pitch = 0.88; utt.rate = 1.02;
      }
      window.speechSynthesis.speak(utt);
    } catch(e){}
  }

  window.toggleVoice = function() {
    voiceEnabled = !voiceEnabled;
    const btn = document.getElementById('voiceToggleBtn');
    if (btn) {
      btn.textContent = voiceEnabled ? '🗣️ Voice: ON' : '🗣️ Voice: OFF (Click to Enable)';
      btn.style.color = voiceEnabled ? 'var(--accent2)' : 'var(--dim)';
    }
    if (!voiceEnabled && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch(e){}
    }
  };

  window.toggleSound = function() {
    sfxEnabled = !sfxEnabled;
    const btn = document.getElementById('soundToggleBtn');
    if (btn) {
      btn.textContent = sfxEnabled ? '🔊 SFX: ON' : '🔇 SFX: MUTED';
      btn.style.color = sfxEnabled ? 'var(--ink)' : 'var(--dim)';
    }
  };

  // 2. PLAYER DATA & ARMORY DEFINITIONS
  const WEAPONS = [
    { id: 'gavel', name: 'Lead Gavel', icon: '🔨', lvl: 1, cost: 0, dmgBonus: 0, desc: 'Standard rookie dialer tool. Simple and reliable.', passiveName: 'First Call Courage', passiveDesc: 'Baseline cold calling attack.' },
    { id: 'blade', name: 'Iron Rebuttal Shortsword', icon: '🗡️', lvl: 2, cost: 100, dmgBonus: 15, desc: 'Honed with early objection battlecards.', passiveName: 'Permission Slice', passiveDesc: '20% chance to land +25 extra Critical Hit damage on permission openers.' },
    { id: 'cleaver', name: 'Trade-Pain Cleaver', icon: '🪓', lvl: 4, cost: 250, dmgBonus: 30, desc: 'Forged from missed call contractor agony.', passiveName: 'Revenue Bleed', passiveDesc: 'Applying trade math inflicts +10 bleeding damage over 2 consecutive turns.' },
    { id: 'rapier', name: 'Carrier *71 Rapier', icon: '🤺', lvl: 6, cost: 450, dmgBonus: 45, desc: 'Direct carrier-level precision with zero ring delay.', passiveName: 'Zero-Ring Piercing', passiveDesc: 'Penetrates boss armor; boss counterattack damage is reduced by 15%.' },
    { id: 'scythe', name: 'Total Agreement Scythe', icon: '🌾', lvl: 8, cost: 750, dmgBonus: 65, desc: 'Reaps contractor skepticism by validating their anger.', passiveName: 'Skepticism Reaper', passiveDesc: 'Validating boss objections doubles your attack damage on the following turn.' },
    { id: 'excalibur', name: 'Mythic Rainmaker Excalibur', icon: '👑', lvl: 10, cost: 1200, dmgBonus: 100, desc: 'Legendary blade held only by master agency closers.', passiveName: 'Live Transfer Stun', passiveDesc: '35% chance to instantly stun the boss into booking an immediate demo test!' }
  ];

  const ARMORS = [
    { id: 'workshirt', name: 'Rookie Denim Workshirt', icon: '👕', lvl: 1, cost: 0, maxHp: 100, dmgReduct: 0, desc: 'Clean denim workshirt. Provides baseline protection against cold call hang-ups.', passiveName: 'Fresh Start', passiveDesc: '100 Max HP base pool.' },
    { id: 'vest', name: 'Heavy Tradesman Vest', icon: '🦺', lvl: 2, cost: 100, maxHp: 115, dmgReduct: 10, desc: 'Reinforced utility pockets for notes and scripts.', passiveName: 'Field Toughness', passiveDesc: '115 Max HP, absorbs 10% rejection damage.' },
    { id: 'plate', name: 'Steel-Toed Plate Carrier', icon: '🛡️', lvl: 4, cost: 250, maxHp: 135, dmgReduct: 20, desc: 'Heavy protection against rude contractor barks.', passiveName: 'Hang-up Deflection', passiveDesc: '135 Max HP, absorbs 20% damage, 15% chance to deflect boss counter to 0.' },
    { id: 'aegis', name: 'Titan Agreement Aegis', icon: '🔰', lvl: 6, cost: 450, maxHp: 160, dmgReduct: 30, desc: 'Absorbs extreme frustration and transforms it into rapport.', passiveName: 'Tone Dampener', passiveDesc: '160 Max HP, absorbs 30% damage, cuts impatience timer penalties by 50%.' },
    { id: 'cuirass', name: 'Diamond Frame Cuirass', icon: '💎', lvl: 8, cost: 750, maxHp: 190, dmgReduct: 40, desc: 'Impenetrable reputation armor tested across 1,000 live dials.', passiveName: 'Reputation Bastion', passiveDesc: '190 Max HP, absorbs 40% damage, heals +10 HP on Grade A/S rebuttals.' },
    { id: 'cloak', name: 'Obsidian Rainmaker Cloak', icon: '🥋', lvl: 10, cost: 1200, maxHp: 230, dmgReduct: 50, desc: 'Mythic woven shroud that makes contractor rejections bounce off harmlessly.', passiveName: 'Contractor Whisperer', passiveDesc: '230 Max HP, 50% rejection damage reduction, +5 HP auto-regen every combat turn.' }
  ];

  const RANKS = [
    { lvl: 1, title: 'Novice Dialer', xpReq: 150 },
    { lvl: 2, title: 'Lead Qualifier', xpReq: 300 },
    { lvl: 3, title: 'Objection Dodger', xpReq: 500 },
    { lvl: 4, title: 'Pipeline Builder', xpReq: 750 },
    { lvl: 5, title: 'Appointment Slayer', xpReq: 1050 },
    { lvl: 6, title: 'Leak Hunter', xpReq: 1400 },
    { lvl: 7, title: 'Closer Apprentice', xpReq: 1850 },
    { lvl: 8, title: 'Enterprise Negotiator', xpReq: 2400 },
    { lvl: 9, title: 'Master Pitchman', xpReq: 3100 },
    { lvl: 10, title: 'Mythic Rainmaker', xpReq: 4000 }
  ];

  const TRADE_RELICS = [
    { id: 'earbuds', name: 'Titanium Hands-Free Earbuds', icon: '🎧', desc: '+20 Max HP permanent base pool', perk: '+20 Max HP' },
    { id: 'battlecard', name: 'Laminated Objection Battlecard', icon: '📜', desc: '+10% Objection Damage on all weapons', perk: '+10% Damage' },
    { id: 'simcard', name: 'Florida Carrier 5G SIM', icon: '📶', desc: '+15% Critical Hit Chance on permission & trade math', perk: '+15% Crit' },
    { id: 'thermos', name: 'Contractor Thermos', icon: '☕', desc: 'Reduces Take A Breather cooldown to 1 turn', perk: '1-Turn Breather' },
    { id: 'rolodex', name: 'Rolodex of Master Tradesmen', icon: '📇', desc: '+25% Gold commissions from closed contracts', perk: '+25% Gold' },
    { id: 'aviators', name: 'Rainmaker Aviator Sunglasses', icon: '🕶️', desc: '+20% Mastery XP from all closed contracts', perk: '+20% XP' }
  ];

  // 3. 8 CONTRACTOR BOSS GAUNTLET DEFINITIONS
  const BOSSES = [
    {
      key: 'roofer',
      name: 'Rick "The Road Rager"',
      title: 'Tampa Commercial Roofing Owner',
      trade: 'Roofing',
      company: 'Tampa Apex Commercial Roofing',
      location: 'Tampa, FL',
      portrait: '🔨',
      hp: 100,
      maxHp: 100,
      tier: 'Tier 1',
      badges: ['Roofing', 'Tampa FL', '100 HP'],
      ticket: '$8,000 to $12,000',
      currentSetup: 'My cell phone forwards to my wife when I am up on a ladder, and half the time she is busy with the kids so calls hit voicemail.',
      avgLeak: 'A standard shingle or tile replacement job',
      dialogue: {
        stage1: "VantorX? Never heard of ya. I'm three stories up on a roof in Tampa with a nail gun in 95-degree heat. What the hell do you want?",
        victory: "Alright Luke, you won me over. Shoot me a text with Ava's setup info.",
        defeat: "I don't have time for this amateur nonsense while my crews are sweating on a 12-pitch roof in Tampa heat. Lose my number! *[SLAMS RECEIVER]*"
      }
    },
    {
      key: 'gatekeeper',
      name: 'Karen "The Iron Gatekeeper"',
      title: 'Orlando HVAC Premier Gatekeeper',
      trade: 'HVAC Dispatch',
      company: 'Orlando Premier Air Solutions',
      location: 'Winter Park, FL',
      portrait: '📋',
      hp: 120,
      maxHp: 120,
      tier: 'Tier 1',
      badges: ['HVAC Gatekeeper', 'Orlando FL', '120 HP'],
      ticket: '$7,000 to $10,000',
      currentSetup: 'Daytime calls hit my front desk, but after 5 PM and on weekends it forwards to an offshore answering service that constantly botches customer names and notes.',
      avgLeak: 'A full emergency AC changeout',
      dialogue: {
        stage1: "Gary is out in the field and doesn't take unscheduled vendor calls. Send your marketing brochure to info@orlandopremiac.com.",
        victory: "Okay Luke, I'll put Gary directly on the phone for 5 minutes. That $8k leak stat got my attention.",
        defeat: "Mr. Hamilton, you are wasting our emergency dispatch line. I am placing your company on our vendor blacklist. *[CLICK]*"
      }
    },
    {
      key: 'skeptic',
      name: 'Mike "The Robot Crusher"',
      title: 'West Palm Beach Master Electrician',
      trade: 'Electrical',
      company: 'Mike\'s Master Commercial Electric',
      location: 'West Palm Beach, FL',
      portrait: '⚡',
      hp: 150,
      maxHp: 150,
      tier: 'Tier 2',
      badges: ['Electrician', 'West Palm FL', '150 HP'],
      ticket: '$4,000 to $8,000',
      currentSetup: 'I am inside 480-volt commercial electrical panels with insulated rubber gloves. I physically cannot touch a phone, so emergency calls roll to voicemail and hire someone else.',
      avgLeak: 'An emergency panel upgrade or commercial generator install',
      dialogue: {
        stage1: "Hold on. Is this a damn robot? I swear to God if another tech bro sends an AI bot to waste my morning, I'm smashing this phone.",
        victory: "Damn, I just dialed (561) 813-8602... Ava answered in half a second and booked a test panel. Let's do this.",
        defeat: "Another fast-talking pitch clown who dodges simple questions. Don't call my cell again. *[CLICK]*"
      }
    },
    {
      key: 'price',
      name: 'Dave "The Budget Dragon"',
      title: 'Miami Luxury Plumbing & Trenchless',
      trade: 'Plumbing',
      company: 'Brickell Trenchless Plumbing Pros',
      location: 'Miami / Brickell, FL',
      portrait: '🔧',
      hp: 180,
      maxHp: 180,
      tier: 'Tier 2',
      badges: ['Plumbing', 'Miami FL', '180 HP'],
      ticket: '$5,000 to $9,000',
      currentSetup: 'I pay an answering service in Coral Gables $1,400 a month and they still miss calls and send me scribbled messages three hours late.',
      avgLeak: 'An emergency sewer line trenchless repipe',
      dialogue: {
        stage1: "Look, I don't care how fancy it is. I got burned for $3,000 by some marketing clown last year. How much is this going to bleed out of my account?",
        victory: "Fair enough. $300 a month pays for itself if it catches even one emergency repipe while I'm sleeping. Send the contract.",
        defeat: "I knew it -- another snake oil telemarketer trying to bleed my business account. Lose my number. *[CLICK]*"
      }
    },
    {
      key: 'sal',
      name: 'Sal "The Storm Chaser"',
      title: 'Fort Myers Restoration King',
      trade: 'Water Mitigation',
      company: 'Gulf Coast 24/7 Flood Mitigation',
      location: 'Fort Myers, FL',
      portrait: '🌊',
      hp: 210,
      maxHp: 210,
      tier: 'Tier 3',
      badges: ['Restoration', 'Fort Myers FL', '210 HP'],
      ticket: '$10,000 to $25,000',
      currentSetup: 'During storm season my phone gets 40 calls a night between midnight and 5 AM. We drop calls because standard phone lines can only take one caller at a time.',
      avgLeak: 'A category-3 black water flood dryout',
      dialogue: {
        stage1: "Kid, hurricane season starts soon. When a tropical depression hits, I get 40 flooded calls between midnight and 5 AM. How does your little toy handle 10 panicked homeowners at the same second without crashing?",
        victory: "Wait, Ava can handle 10 calls simultaneously with zero busy signals? That alone saves my entire storm season. Set up my Carrier *71 rollover now.",
        defeat: "I got 10 flooded basements waiting on sump pumps and you're wasting my phone battery. Call terminated. *[CLICK]*"
      }
    },
    {
      key: 'brad',
      name: 'Brad "The Angi Addict"',
      title: 'Jacksonville Residential AC & Heating',
      trade: 'Residential HVAC',
      company: 'Jacksonville Air Champions',
      location: 'Jacksonville, FL',
      portrait: '❄️',
      hp: 240,
      maxHp: 240,
      tier: 'Tier 3',
      badges: ['AC / HVAC', 'Jacksonville FL', '240 HP'],
      ticket: '$8,000 to $11,000',
      currentSetup: 'I buy shared leads on Angi and Thumbtack for $90 each, but by the time I call them back, three other HVAC contractors already quoted them.',
      avgLeak: 'A complete heat pump and ductwork replacement',
      dialogue: {
        stage1: "I already spend $1,800 a month on Angi and Thumbtack. My phone rings plenty. Why would I change anything when HomeAdvisor gives me all my jobs?",
        victory: "You're dead right about Angi selling that same replacement lead to 4 other contractors. I lost three $9k changeouts last month because of that. Hook up Ava to my inbound lines.",
        defeat: "I'm sticking with Angi and my yellow pad. Stop calling my personal mobile line. *[CLICK]*"
      }
    },
    {
      key: 'gary',
      name: 'Gary "The Yellow Pad Veteran"',
      title: 'Ocala Septic & Excavation Veteran',
      trade: 'Septic & Excavation',
      company: 'Marion County Septic & Dirt',
      location: 'Ocala / Marion County, FL',
      portrait: '🚜',
      hp: 270,
      maxHp: 270,
      tier: 'Tier 4',
      badges: ['Septic / Dirt', 'Ocala FL', '270 HP'],
      ticket: '$4,500 to $8,500',
      currentSetup: 'I write every customer name and tank location on this yellow legal pad in my truck. When I am on the backhoe, I cannot answer.',
      avgLeak: 'A complete drainfield excavation and tank pump',
      dialogue: {
        stage1: "I've been in the dirt since 1986. I don't use 'apps', I don't have a computer, and I write every job on this yellow legal pad. You're talking Chinese to me, son.",
        victory: "So Ava just acts like a polite southern girl answering my office phone, and texts my flip phone the address? Hell, even I can handle that. Let's try it for 30 days.",
        defeat: "I don't know who taught you how to talk to working folks, son, but don't dial this number again. *[CLICK]*"
      }
    },
    {
      key: 'vito',
      name: 'Vito "The Enterprise Titan"',
      title: 'Texas & Florida Fleet President',
      trade: 'Commercial Mechanical Fleet',
      company: 'Sunbelt Fleet Mechanical Systems',
      location: 'Dallas / Houston / Orlando',
      portrait: '🏢',
      hp: 350,
      maxHp: 350,
      tier: 'Tier 5 RAID BOSS',
      badges: ['42 Trucks', 'Enterprise Fleet', '350 HP RAID BOSS'],
      ticket: '$15,000 to $50,000',
      currentSetup: 'We have 42 vans and an internal dispatch team in Houston, but after-hours rollover to our third-party call center costs a fortune and does not integrate into ServiceTitan.',
      avgLeak: 'A commercial chiller or supermarket refrigeration contract',
      dialogue: {
        stage1: "I run 42 service vans across Texas and Florida with an internal dispatch center in Houston. Unless your AI does bilingual Spanish rollover, connects to ServiceTitan via webhook, and does Carrier *71 without rewiring my PBX, don't waste my breath. Convince me.",
        victory: "Impressive. You know enterprise dispatch math, Carrier *71 rollover logic, and ServiceTitan webhooks cold. I want Ava tested on my 12 Orlando vans starting Monday morning.",
        defeat: "You are completely out of your league. My executive team does not entertain amateur cold call pitches. Call terminated. *[CLICK]*"
      }
    }
  ];

  // 4. PERSISTENT PLAYER STATE
  let player = {
    name: 'Luke the Closer',
    lvl: 1,
    xp: 0,
    nextLvlXp: 150,
    hp: 100,
    maxHp: 100,
    gold: 0,
    equippedWeapon: 'gavel',
    equippedArmor: 'workshirt',
    unlockedWeapons: ['gavel'],
    unlockedArmors: ['workshirt'],
    unlockedRelics: [],
    dealsClosedCount: 0,
    defeatedBosses: [],
    streak: 0,
    breatherCooldown: 0,
    bleedTurns: 0,
    skepticismReaperActive: false
  };

  let pendingLoot = null;

  function loadSavedPlayer() {
    try {
      const saved = localStorage.getItem('vantorx_cold_call_quest_save_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        player = Object.assign(player, parsed);
        if (!Array.isArray(player.unlockedRelics)) player.unlockedRelics = [];
        if (typeof player.dealsClosedCount !== 'number') player.dealsClosedCount = player.defeatedBosses ? player.defeatedBosses.length : 0;
      }
    } catch(e){}
    recalcPlayerStats();
  }

  function savePlayer() {
    try {
      localStorage.setItem('vantorx_cold_call_quest_save_v3', JSON.stringify(player));
    } catch(e){}
  }

  function recalcPlayerStats() {
    const armor = ARMORS.find(a => a.id === player.equippedArmor) || ARMORS[0];
    let baseHp = armor.maxHp;
    if (player.unlockedRelics && player.unlockedRelics.includes('earbuds')) {
      baseHp += 20;
    }
    player.maxHp = baseHp;
    if (player.hp > player.maxHp) player.hp = player.maxHp;
    if (player.hp <= 0) player.hp = player.maxHp;
  }

  // 5. CURRENT MATCH STATE & CONVERSATIONAL MEMORY
  let currentBossIndex = 0;
  let currentBoss = BOSSES[0];
  let bossHp = 100;
  let matchHistory = [];
  let speechRec = null;
  let isListening = false;

  let matchMemory = {
    turns: 0,
    stage: 'opener', // opener -> pain -> mechanism -> price -> proof -> carrier -> close -> victory
    lastBossQuestion: 'who_are_you',
    answeredQuestions: new Set(),
    usedReplies: new Set(),
    topicsCovered: {},
    demoUnlocked: false,
    priceCovered: false,
    carrierCovered: false,
    mechanismCovered: false,
    consecutiveHesitation: 0,
    dodgedCount: 0
  };
  window.player = player;
  window.matchMemory = matchMemory;
  Object.defineProperty(window, 'bossHp', {
    get() { return bossHp; },
    set(v) { bossHp = v; },
    configurable: true
  });
  Object.defineProperty(window, 'currentBossIndex', {
    get() { return currentBossIndex; },
    set(v) { currentBossIndex = v; },
    configurable: true
  });
  Object.defineProperty(window, 'currentBoss', {
    get() { return currentBoss; },
    set(v) { currentBoss = v; },
    configurable: true
  });
  window.BOSSES = BOSSES;
  window.TRADE_RELICS = TRADE_RELICS;

  function resetMatchMemory() {
    matchMemory = {
      turns: 0,
      stage: 'opener',
      lastBossQuestion: 'who_are_you',
      answeredQuestions: new Set(),
      usedReplies: new Set(),
      topicsCovered: {},
      demoUnlocked: false,
      priceCovered: false,
      carrierCovered: false,
      mechanismCovered: false,
      consecutiveHesitation: 0,
      dodgedCount: 0
    };
    window.matchMemory = matchMemory;
  }

  // 6. UI UPDATE HELPERS
  function updateHUD() {
    const hpDigits = document.getElementById('hpDigits');
    const hpBar = document.getElementById('hpBarFill');
    const xpDigits = document.getElementById('xpDigits');
    const xpBar = document.getElementById('xpBarFill');
    const goldDigits = document.getElementById('goldDigits');
    const playerLvlTag = document.getElementById('playerLvlTag');
    const playerRankHeader = document.getElementById('playerRankHeader');
    const streakHeader = document.getElementById('streakHeader');
    const playerEquipSummary = document.getElementById('playerEquipSummary');
    const sessionDealsWon = document.getElementById('sessionDealsWon');

    const hpPct = Math.max(0, Math.min(100, Math.round((player.hp / player.maxHp) * 100)));
    const xpPct = Math.max(0, Math.min(100, Math.round((player.xp / player.nextLvlXp) * 100)));

    if (hpDigits) hpDigits.textContent = `${player.hp} / ${player.maxHp}`;
    if (hpBar) hpBar.style.width = `${hpPct}%`;
    if (xpDigits) xpDigits.textContent = `${player.xp} / ${player.nextLvlXp} XP (${xpPct}%)`;
    if (xpBar) xpBar.style.width = `${xpPct}%`;
    if (goldDigits) goldDigits.textContent = `💰 ${player.gold} GP`;
    if (playerLvlTag) playerLvlTag.textContent = `LVL ${player.lvl}`;

    // Streak Multiplier & Flame Visual
    if (streakHeader) {
      if (player.streak >= 2) {
        streakHeader.classList.add('streak-on-fire');
        const mult = (1 + Math.min(1.0, player.streak * 0.2)).toFixed(1);
        streakHeader.innerHTML = `🔥 ${player.streak} Streak <span style="font-size:11px;opacity:0.9">(${mult}x Loot)</span>`;
      } else {
        streakHeader.classList.remove('streak-on-fire');
        streakHeader.textContent = `🔥 ${player.streak} Streak`;
      }
    }

    if (sessionDealsWon) {
      sessionDealsWon.textContent = `${player.dealsClosedCount || player.defeatedBosses.length} / 8`;
    }

    const rankObj = RANKS.find(r => r.lvl === player.lvl) || RANKS[0];
    if (playerRankHeader) playerRankHeader.textContent = rankObj.title;

    const curW = WEAPONS.find(w => w.id === player.equippedWeapon) || WEAPONS[0];
    const curA = ARMORS.find(a => a.id === player.equippedArmor) || ARMORS[0];
    const relicCount = (player.unlockedRelics || []).length;
    if (playerEquipSummary) {
      playerEquipSummary.textContent = `${curW.icon} ${curW.name} · ${curA.icon} ${curA.name}${relicCount > 0 ? ` · 🏆 ${relicCount} Relics` : ''}`;
    }

    const bossHpDigits = document.getElementById('bossHpDigits');
    const bossHpFill = document.getElementById('bossHpFill');
    const bHpPct = Math.max(0, Math.min(100, Math.round((bossHp / currentBoss.maxHp) * 100)));
    if (bossHpDigits) bossHpDigits.textContent = `${bossHp} / ${currentBoss.maxHp}`;
    if (bossHpFill) bossHpFill.style.width = `${bHpPct}%`;

    // Execute Threshold Highlight (<35% Boss HP)
    const bossHud = document.querySelector('.active-boss-hud');
    if (bossHud) {
      if (bossHp > 0 && bossHp <= currentBoss.maxHp * 0.35) {
        bossHud.classList.add('execute-threshold');
      } else {
        bossHud.classList.remove('execute-threshold');
      }
    }

    const cleared = document.getElementById('clearedBossRatio');
    if (cleared) cleared.textContent = `${player.defeatedBosses.length} / 8 Cleared`;

    const breatherBtn = document.getElementById('breatherBtn');
    const breatherText = document.getElementById('breatherCooldownText');
    if (breatherBtn && breatherText) {
      if (player.breatherCooldown > 0) {
        breatherBtn.disabled = true;
        breatherText.textContent = `(${player.breatherCooldown}T Cooldown)`;
      } else {
        breatherBtn.disabled = false;
        breatherText.textContent = `+30 HP (Ready)`;
      }
    }

    // Dynamic Closer Coach Prescription & Turn Status
    const coachEl = document.getElementById('coachPrescription');
    const turnBadge = document.getElementById('turnIndicatorBadge');
    if (coachEl) {
      const stage = (matchMemory && matchMemory.stage) || 'intro';
      const lastQ = (matchMemory && matchMemory.lastBossQuestion) || '';
      if (bossHp > 0 && bossHp <= currentBoss.maxHp * 0.35) {
        coachEl.innerHTML = `⚡ <strong>Closer Coach:</strong> BOSS IN EXECUTE RANGE (&lt;35% HP)! Propose the 4:30 PM walkthrough close for +50 Overkill bonus!`;
      } else if (stage === 'price' || lastQ === 'how_much_does_it_cost') {
        coachEl.innerHTML = `💰 <strong>Closer Coach:</strong> Contractor asked about cost! Quote $397/mo flat with zero contracts — never dodge price questions!`;
      } else if (stage === 'proof' || lastQ === 'proof_demo_line') {
        coachEl.innerHTML = `📱 <strong>Closer Coach:</strong> Contractor wants proof! Tell him to dial (561) 813-8602 right now from his truck on speaker!`;
      } else if (stage === 'carrier' || lastQ === 'carrier_rollover_setup') {
        coachEl.innerHTML = `📶 <strong>Closer Coach:</strong> Contractor is worried about his phones! Explain Carrier *71 conditional rollover (keep existing number).`;
      } else if (stage === 'close' || lastQ === 'meeting_time_close' || stage === 'victory') {
        coachEl.innerHTML = `📅 <strong>Closer Coach:</strong> He's ready! Lock in a 10-minute Zoom walkthrough tomorrow at 4:30 PM!`;
      } else if (stage === 'pain') {
        coachEl.innerHTML = `🎯 <strong>Closer Coach:</strong> Acknowledge his trade pain before dropping the $8,000 emergency leak hook.`;
      } else {
        coachEl.innerHTML = `💡 <strong>Closer Coach:</strong> Ask for 30 seconds before dropping the $8,000 emergency leak hook.`;
      }
    }
    if (turnBadge) {
      turnBadge.textContent = 'YOUR TURN: CLICK BATTLECARD OR SPEAK';
    }

    renderTacticalDock();
  }

  function renderTacticalDock() {
    const dock = document.getElementById('tacticalDock');
    if (!dock) return;
    const stage = (matchMemory && matchMemory.stage) || 'intro';
    const lastQ = (matchMemory && matchMemory.lastBossQuestion) || '';
    const bossFirst = (currentBoss.name || 'Contractor').split(' ')[0];

    const cdText = player.breatherCooldown > 0 ? `(${player.breatherCooldown}T Cooldown)` : `+30 HP (Ready)`;
    const cdDisabled = player.breatherCooldown > 0 ? 'disabled' : '';
    const breatherCard = `
      <button class="strike-card heal-action" type="button" id="breatherBtn" ${cdDisabled} onclick="executeTakeABreather()">
        <div class="strike-tag">☕ Take a Breather <span id="breatherCooldownText">${cdText}</span></div>
        <div class="strike-text">Take a tactical breath, calibrate vocal pitch, and restore +30 HP.</div>
      </button>
    `;

    let cards = [];
    if (stage === 'intro' || stage === 'pain') {
      cards = [
        { type: 'permission', tag: '⚡ 30s Permission Opener', bonus: '+Crit', text: `"Hey ${bossFirst}, I know you're in the field — you got 30 seconds before you hang up?"` },
        { type: 'leak', tag: '🎯 $8,000 Leak Hook', bonus: '+Bleed', text: `"Where does an emergency $8,000 leak call ring when you're 3 stories up?"` },
        { type: 'demo', tag: '🛡️ Test Ava Live', bonus: '(561) 813-8602', text: `"Don't take my word for it. Dial (561) 813-8602 right now from your truck."` }
      ];
    } else if (stage === 'price' || lastQ === 'how_much_does_it_cost') {
      cards = [
        { type: 'price', tag: '💰 $397/mo Flat Pricing', bonus: '🔥 Direct Answer', text: `"It is a flat 300 a month with zero setup fee and zero contract. One shingle repair pays for the entire year."`, pulse: true },
        { type: 'leak', tag: '🎯 $8,000 Loss Math', bonus: '+Bleed', text: `"Missing just 2-3 emergency calls a week costs you roughly $8,000 in lost jobs."` },
        { type: 'demo', tag: '📱 Dial (561) 813-8602 Live', bonus: 'Proof', text: `"Dial our live Florida demo line right now on (561) 813-8602 from your truck and hear Ava."` }
      ];
    } else if (stage === 'proof' || lastQ === 'proof_demo_line') {
      cards = [
        { type: 'demo', tag: '🛡️ Test Ava Live (561) 813-8602', bonus: '🔥 Proof Line', text: `"Dial our live Florida demo line right now on (561) 813-8602 from your truck and hear how natural Ava sounds."`, pulse: true },
        { type: 'defuse', tag: '🛡️ Total Agreement Defuse', bonus: '+18 HP', text: `"You are 100% right. Every contractor has been burned by telemarketers, which is why we do zero contracts."` },
        { type: 'price', tag: '💰 $397/mo Flat Rate', bonus: 'No Contract', text: `"It is a flat 300 a month with zero setup fee and zero contract. One shingle repair pays for the year."` }
      ];
    } else if (stage === 'carrier' || lastQ === 'carrier_rollover_setup') {
      cards = [
        { type: 'carrier', tag: '📶 Carrier *71 Rollover', bonus: '🔥 No Porting', text: `"We hook it up via Carrier *71 conditional call forwarding so your company number stays with your provider."`, pulse: true },
        { type: 'demo', tag: '📱 (561) 813-8602 Demo', bonus: 'Proof', text: `"Dial our live Florida test line on (561) 813-8602 right now from your truck."` },
        { type: 'close', tag: '📅 4:30 PM Tomorrow Walkthrough', bonus: 'Close', text: `"Let's do a quick 10-minute walkthrough tomorrow afternoon at 4:30 PM."` }
      ];
    } else {
      cards = [
        { type: 'close', tag: '📅 4:30 PM Tomorrow Walkthrough', bonus: '🔥 Lock-in', text: `"Let's do a quick 10-minute walkthrough tomorrow afternoon at 4:30 PM."`, pulse: true },
        { type: 'execute', tag: '⚡ Execute Finisher', bonus: '+50 Overkill', text: `"Let's do a 10-minute walkthrough tomorrow at 4:30 PM and plug that $8,000 leak together."`, pulse: true },
        { type: 'carrier', tag: '📶 Carrier *71 Rollover', bonus: 'Setup', text: `"We hook it up via Carrier *71 conditional call forwarding so your company number stays with your provider."` }
      ];
    }

    const cardsHtml = cards.map(c => `
      <button class="strike-card ${c.pulse ? 'pulse-card' : ''}" type="button" onclick="executeQuickStrike('${c.type}')">
        <div class="strike-tag">${c.tag} <span>${c.bonus}</span></div>
        <div class="strike-text">${c.text}</div>
      </button>
    `).join('');

    dock.innerHTML = cardsHtml + breatherCard;
  }

  function appendLog(msg, type) {
    const terminal = document.getElementById('combatLog');
    if (!terminal) return;
    const div = document.createElement('div');
    div.className = `log-entry log-${type}`;
    div.innerHTML = msg;
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
  }

  function renderBossGauntletList() {
    const container = document.getElementById('bossListContainer');
    if (!container) return;
    container.innerHTML = '';

    BOSSES.forEach((b, idx) => {
      const isDefeated = player.defeatedBosses.includes(b.key);
      const isActive = idx === currentBossIndex;
      const btn = document.createElement('div');
      btn.className = `boss-card-btn ${isActive ? 'active' : ''} ${isDefeated ? 'defeated' : ''}`;
      btn.onclick = () => selectBoss(idx);

      btn.innerHTML = `
        <div class="boss-avatar">${b.portrait}</div>
        <div class="boss-meta">
          <h4>${b.name}</h4>
          <p>${b.title}</p>
          <div class="boss-hp-tag">
            <span style="color:${isDefeated ? 'var(--ok)' : 'var(--err)'}">❤️ ${isDefeated ? 'DEFEATED' : b.hp + ' HP'}</span>
            <span style="color:var(--faint)">· ${b.tier}</span>
          </div>
        </div>
        <div class="boss-status-badge ${isDefeated ? 'status-cleared' : (isActive ? 'status-ready' : 'status-locked')}">
          ${isDefeated ? '✓ CLEARED' : (isActive ? '⚔️ READY' : 'STAGE ' + (idx + 1))}
        </div>
      `;
      container.appendChild(btn);
    });
  }

  function selectBoss(idx) {
    const modal = document.getElementById('defeatModal');
    if (modal) modal.classList.remove('open');
    const lootModal = document.getElementById('lootModal');
    if (lootModal) lootModal.classList.remove('open');

    const input = document.getElementById('playerCustomInput');
    const sendBtn = document.getElementById('sendBtn');
    if (input) {
      input.disabled = false;
      input.placeholder = `Speak or type your pitch to ${BOSSES[idx].name}...`;
      input.value = '';
    }
    if (sendBtn) sendBtn.disabled = false;

    currentBossIndex = idx;
    currentBoss = BOSSES[idx];
    bossHp = currentBoss.maxHp;
    resetMatchMemory();
    matchHistory = [];

    const portrait = document.getElementById('activeBossPortrait');
    const nameEl = document.getElementById('activeBossName');
    const subEl = document.getElementById('activeBossSub');
    const badgesEl = document.getElementById('activeBossBadges');

    if (portrait) portrait.textContent = currentBoss.portrait;
    if (nameEl) nameEl.textContent = currentBoss.name;
    if (subEl) subEl.textContent = `${currentBoss.title} · ${currentBoss.trade}`;
    if (badgesEl) {
      badgesEl.innerHTML = currentBoss.badges.map(b => `<span class="badge-pill">${b}</span>`).join('');
    }

    renderBossGauntletList();
    updateHUD();

    const terminal = document.getElementById('combatLog');
    if (terminal) terminal.innerHTML = '';

    appendLog(`⚔️ <strong>ENTERED STAGE ${idx + 1}:</strong> Confronting ${currentBoss.name} (${currentBoss.trade})!`, 'system');
    appendLog(`<strong>${currentBoss.name}:</strong> "${currentBoss.dialogue.stage1}"`, 'boss');
    matchHistory.push({ role: 'assistant', content: currentBoss.dialogue.stage1 });

    if (voiceEnabled) {
      speakContractor(currentBoss.dialogue.stage1, currentBoss.key);
    }
  }

  // 7. HEALTH REGAIN MECHANICS
  window.executeTakeABreather = function() {
    const input = document.getElementById('playerCustomInput');
    if (!input || input.disabled || player.breatherCooldown > 0) return;
    const healAmount = 30;
    const oldHp = player.hp;
    player.hp = Math.min(player.maxHp, player.hp + healAmount);
    const healed = player.hp - oldHp;
    const maxCd = (player.unlockedRelics && player.unlockedRelics.includes('thermos')) ? 1 : 2;
    player.breatherCooldown = maxCd;

    playSynth('heal');
    spawnFloatingNumber(`+${healed} HP BREATHER`, 'heal');
    appendLog(`☕ <strong>TAKE A BREATHER (+${healed} HP)!</strong> Luke took a tactical sip of coffee, relaxed his vocal tone, and recovered <strong>+${healed} HP</strong> (HP: ${player.hp}/${player.maxHp}).`, 'heal');
    updateHUD();
    savePlayer();
  };

  // 8. ADAPTIVE CONVERSATIONAL BRAIN 5.0 (Stateful, Fatal Signals & Anti-Repetitive)

  function analyzeSpeech(rawText, memory, currentBoss) {
    const t = (rawText || '').trim();
    const low = t.toLowerCase();

    // FATAL SIGNALS (Saying the Wrong Stuff):
    const isFatalRude = /\b(shut\s*up|idiot|stupid|fuck|bitch|asshole|bullshit|dumbass|moron|loser|piece\s*of\s*shit|scam(mer)?|fraud|hate\s*you|screw\s*you|go\s*to\s*hell)\b/i.test(low);
    const isFatalSpam = /\b(synerg(y|ies|istic)|paradigm|cutting\s*edge\s*digital|transform\s*your\s*business|bespoke\s*solutions|scale\s*your\s*agency|marketing\s*funnel|sales\s*deck|powerpoint|b2b\s*solutions|partnership\s*opportunity|special\s*promotion\s*today|pitch\s*you|software\s*demo\s*presentation)\b/i.test(low);
    const isFatalPrice = /\b(5000|10000|5,000|10,000|20,000|100,000|million)\b/i.test(low) || /\b(very\s*expensive|costs\s*a\s*lot|thousands\s*of\s*dollars\s*a\s*month)\b/i.test(low) || /\b(100%\s*free\s*forever|costs\s*nothing|completely\s*free)\b/i.test(low);

    const has20Sec = /(20|30)\s*(sec|second)/i.test(low);
    const hasHangUp = /hang\s*up|catch\s*you|bad\s*time|busy/i.test(low);
    const hasPermission = has20Sec || hasHangUp || /quick\s*(question|sec|call|minute)/i.test(low);
    
    const hasAgreement = /hear\s*you|agree|100%|completely|understand|you're\s*right|fair\s*enough|totally|makes\s*sense/i.test(low);
    
    const hasLeakHook = /leak|missed\s*call|emergency|after\s*hours|after\s*5|weekend|night|dinner|at\s*8\s*pm|sleeping|voicemail|next\s*(guy|contractor|roofer|plumber)/i.test(low);
    const hasDollarMath = /\$?\s*([0-9]+,?([0-9]{3})*)\s*(k|thousand|dollar|bucks)?/i.test(low) || /8,?000|12,?000|6,?000|9,?000|300|397|1,?200/i.test(low);
    
    const hasAvaMechanism = /ava|ai|receptionist|phone|call|instant|one\s*ring|first\s*ring|text|notify|dispatch|answers\s*(24\/7|automatically|live)|qualif|calendar|schedule/i.test(low);
    
    const hasDemoNumber = /(561)\s*813-8602|813-8602|5618138602|live\s*demo|test\s*number|dial\s*(this|it|her)/i.test(low);
    const hasSoundHuman = /sound|human|robot|robotic|delay|latency|natural|real\s*person|cadence|accent/i.test(low);
    
    const hasCarrier71 = /\*71|star\s*71|carrier|conditional\s*forwarding|conditional\s*call\s*forwarding|forward|rollover|port|switch|verizon|at&t|att|t-mobile|existing\s*number|keep\s*your\s*number/i.test(low);
    
    const hasPricingAnswer = /300|397|299|400|\$?\s*\d+|dollar|bucks|month|cheap|cost|investment|setup\s*fee|zero\s*contract|no\s*contract|cancel\s*anytime|month-to-month|flat\s*rate|flat|roi|pays\s*for\s*itself/i.test(low);
    
    const hasTimeProposal = /tomorrow|4:30|morning|afternoon|10\s*min|walkthrough|meeting|calendar|invite|zoom|screen\s*share|schedule|book|call\s*you/i.test(low);

    const isUserAskingQuestion = /\?|who\s*answers|what\s*happens|how\s*many|where\s*does|do\s*you\s*get|what\s*do\s*you\s*do/i.test(low);
    const asksWhoAnswers = /who\s*answers|where\s*does\s*(that|the)\s*call\s*go|what\s*happens\s*to\s*calls|how\s*do\s*you\s*handle/i.test(low);
    const asksHowMuchLost = /how\s*much\s*(do\s*you\s*lose|is\s*a\s*job|is\s*an\s*average)|ticket\s*size|worth/i.test(low);

    const isRepeatingPermission = memory.topicsCovered['permission'] && hasPermission && !hasLeakHook && !hasAvaMechanism && !hasPricingAnswer && !hasDemoNumber;
    const isRepeatingDemo = memory.topicsCovered['demo'] && hasDemoNumber && !hasCarrier71 && !hasTimeProposal;
    const isRepeatingPrice = memory.topicsCovered['price'] && hasPricingAnswer && !hasDemoNumber && !hasCarrier71 && !hasTimeProposal;
    const isRepeatingMechanism = memory.topicsCovered['mechanism'] && hasAvaMechanism && !hasPricingAnswer && !hasDemoNumber && !hasCarrier71 && !hasTimeProposal;

    const isHesitant = low.length < 4 || /^(uh|um|hello\??|can\s*you\s*hear\s*me\??|are\s*you\s*there\??|wait|hold\s*on)$/i.test(low);

    // Evasion / Dodging when contractor explicitly asked a direct question:
    let isDodgingQuestion = false;
    if (memory.lastBossQuestion === 'how_much_does_it_cost' && !hasPricingAnswer && !hasDollarMath) {
      isDodgingQuestion = true;
    }
    if (memory.lastBossQuestion === 'proof_demo_line' && !hasDemoNumber && !hasSoundHuman && !hasAgreement) {
      isDodgingQuestion = true;
    }
    if (memory.lastBossQuestion === 'carrier_rollover_setup' && !hasCarrier71 && !hasAgreement) {
      isDodgingQuestion = true;
    }
    if (memory.lastBossQuestion === 'meeting_time_close' && !hasTimeProposal && !hasAgreement) {
      isDodgingQuestion = true;
    }

    return {
      raw: t,
      low: low,
      isFatalRude,
      isFatalSpam,
      isFatalPrice,
      isDodgingQuestion,
      hasPermission,
      hasAgreement,
      hasLeakHook,
      hasDollarMath,
      hasAvaMechanism,
      hasDemoNumber,
      hasSoundHuman,
      hasCarrier71,
      hasPricingAnswer,
      hasTimeProposal,
      isUserAskingQuestion,
      asksWhoAnswers,
      asksHowMuchLost,
      isRepeatingPermission,
      isRepeatingDemo,
      isRepeatingPrice,
      isRepeatingMechanism,
      isHesitant
    };
  }

  function pickUnique(memory, pool, tag) {
    if (!Array.isArray(pool)) pool = [pool];
    const fresh = pool.filter(text => !memory.usedReplies.has(text));
    const chosen = (fresh.length > 0) ? fresh[Math.floor(Math.random() * fresh.length)] : pool[0];
    memory.usedReplies.add(chosen);
    return chosen;
  }

  function generateContractorTurn(analysis, memory, boss) {
    memory.turns++;

    // 0. FATAL SIGNALS (Immediate Contractor Reaction to Wrong Stuff)
    if (analysis.isFatalRude) {
      return pickUnique(memory, [
        `(Snarls into phone) Who the hell do you think you're talking to? Don't you ever dial my business number again, you clown. *[SLAMS PHONE DOWN]*`,
        `You got some mouth on you for someone calling MY cell phone uninvited. Take a hike and lose my number. *[CLICK - CALL TERMINATED]*`
      ], 'fatal_rude');
    }

    if (analysis.isFatalSpam) {
      return pickUnique(memory, [
        `(Heavy sigh) Stop right there. I get 15 spam telemarketers a day reading script buzzwords. I work with my hands, kid. Lose my number. *[CLICK]*`,
        `Synergies? Digital solutions? Man, I'm spraying poly on a hot roof. Talk like a real human being or get off my phone. *[CLICK]*`
      ], 'fatal_spam');
    }

    if (analysis.isFatalPrice) {
      return pickUnique(memory, [
        `(Scoffs into receiver) Thousands of dollars a month? Are you out of your mind? I'm a contractor, not Wall Street. Get off my phone. *[CLICK]*`,
        `Nobody gives away high-end voice AI for free, son. Cut the scam pitch and tell me the real price or I'm hanging up. *[CLICK]*`
      ], 'fatal_price');
    }

    if (analysis.isDodgingQuestion && (memory.dodgedCount || 0) >= 2) {
      return pickUnique(memory, [
        `I asked you twice for a straight answer and you're dodging me like a slick used car salesman. Call terminated. *[CLICK]*`,
        `You refuse to give me the actual numbers. I don't do business with evasive salespeople. Goodbye. *[CLICK]*`
      ], 'fatal_dodge');
    }

    if (analysis.isHesitant && (memory.consecutiveHesitation || 0) >= 2) {
      return pickUnique(memory, [
        `I don't have time to sit here in 95-degree heat waiting for you to figure out what you're saying. Call someone else. *[CLICK]*`,
        `Dead air again? I'm backing up a trailer, man. Goodbye. *[CLICK]*`
      ], 'fatal_hesitation');
    }

    // Single Dodge Warnings (Contractor notices evasion):
    if (analysis.isDodgingQuestion && memory.lastBossQuestion === 'how_much_does_it_cost') {
      return pickUnique(memory, [
        `Hold on Luke -- I asked you a direct question: how much does this cost per month? Don't dodge me, give me the actual number.`,
        `Wait a second, Luke. Cut through the pitch and answer me: what is the monthly investment?`
      ], 'dodge_price_warning');
    }

    if (analysis.isDodgingQuestion && memory.lastBossQuestion === 'proof_demo_line') {
      return pickUnique(memory, [
        `You dodged my question, Luke. What number can I dial from my truck right now on speaker to hear Ava's voice?`,
        `Answer my question first: how do I hear her live before we talk about anything else?`
      ], 'dodge_demo_warning');
    }

    if (analysis.isDodgingQuestion && memory.lastBossQuestion === 'carrier_rollover_setup') {
      return pickUnique(memory, [
        `You dodged my question about my phone number, Luke. Do I have to switch carriers or port my number? Tell me how it hooks up.`,
        `Answer me straight: how does this connect to my existing company lines without messing up my phones?`
      ], 'dodge_carrier_warning');
    }

    if (analysis.isDodgingQuestion && memory.lastBossQuestion === 'meeting_time_close') {
      return pickUnique(memory, [
        `I asked you for a specific time tomorrow, Luke. What time works for this walkthrough?`,
        `Give me a time tomorrow afternoon or let's wrap this up.`
      ], 'dodge_close_warning');
    }

    // 1. REPETITION HANDLING
    if (analysis.isRepeatingPermission) {
      return pickUnique(memory, [
        `Luke, you already asked me for 20 seconds and I gave it to you! Stop asking for permission and tell me what you actually do!`,
        `I already said I'm listening, man. Get to the point before I have to climb up this ladder.`
      ], 'repetition_permission');
    }

    if (analysis.isRepeatingMechanism) {
      return pickUnique(memory, [
        `You already told me she answers in one ring, Luke! I heard you. What I asked is: how much does this cost per month?`,
        `I understand she texts my cell. Cut to the bottom line: what's the monthly investment?`
      ], 'repetition_mechanism');
    }

    if (analysis.isRepeatingPrice) {
      return pickUnique(memory, [
        `I already know she's $300 a month, man. What I want to know is does she sound like a robot? Give me the test line.`,
        `You already gave me the price, Luke! How do I hear her voice before I agree to anything?`
      ], 'repetition_price');
    }

    if (analysis.isRepeatingDemo) {
      return pickUnique(memory, [
        `Yeah Luke, I already wrote down (561) 813-8602! What I asked was: when are we doing this quick meeting?`,
        `I got the demo number on my dash right now. Tell me what time tomorrow you want to do this walkthrough.`
      ], 'repetition_demo');
    }

    // 2. HESITATION / FIRST WARNING
    if (analysis.isHesitant) {
      return pickUnique(memory, [
        `Hey, you still there? I don't get paid to sit here listening to static while my truck is idling. Speak up or I'm hanging up.`,
        `Hello? Did your cell cut out or what? Talk to me or lose my number.`,
        `I can barely hear you over this engine, man. What's this call about?`
      ], 'hesitation');
    }

    // 3. QUESTIONS ASKED BY USER TO BOSS
    if (analysis.asksWhoAnswers) {
      memory.topicsCovered['asked_current_setup'] = true;
      memory.lastBossQuestion = 'explain_solution_ava';
      return pickUnique(memory, [
        `Right now? ${boss.currentSetup} So yeah, calls slip through the cracks. Why? What does your company do about that?`,
        `Honestly, if I'm busy with tools in my hands, it goes straight to voicemail and the customer calls the next guy on Google. What are you getting at?`
      ], 'answer_who_answers');
    }

    if (analysis.asksHowMuchLost) {
      memory.topicsCovered['asked_ticket'] = true;
      memory.lastBossQuestion = 'explain_solution_ava';
      return pickUnique(memory, [
        `In my trade? ${boss.avgLeak || 'A standard job'} runs around ${boss.ticket}. Losing even one a week hurts like hell. What's your angle?`,
        `Average ticket is ${boss.ticket}. Missing one emergency call is a massive chunk of profit. Tell me how you fix that.`
      ], 'answer_ticket');
    }

    // 4. DIALOGUE STATE ADVANCEMENT (Forward-Only State Machine)

    // STAGE 1: Opener -> Pain
    if (memory.lastBossQuestion === 'who_are_you') {
      if (analysis.hasPermission || analysis.hasAgreement || analysis.hasLeakHook) {
        memory.stage = 'pain';
        memory.lastBossQuestion = 'explain_solution_ava';
        memory.topicsCovered['permission'] = true;
        if (analysis.hasLeakHook) memory.topicsCovered['leak'] = true;

        if (boss.key === 'roofer') {
          return pickUnique(memory, [
            `(Nail gun stops) Fair point, kid. Honestly? When I'm up on a 12-pitch roof spraying poly, calls go straight to voicemail. By the time I climb down at 5 PM, they've hired someone else. But what are you proposing? What does your setup actually do?`,
            `(Heavy diesel truck idles) Ha, you're not wrong about that. If an $8k emergency leak call rings while I'm tying off shingles, I can't grab it. But I'm not hiring a full-time receptionist for $3k a month. How does your tool catch those calls?`
          ], 'roofer_pain_ack');
        } else if (boss.key === 'gatekeeper') {
          return pickUnique(memory, [
            `(Typing pauses) Honestly... thank you for recognizing that. Gary is out turning wrenches and I handle 40 incoming dispatch calls a day. After 5 PM, our answering service is a complete disaster. They lost two $9k AC changeouts last Friday. How does your system fix after-hours calls?`,
            `(Audible sigh) You're dead right about after-hours. When our technicians are stuck in a 115-degree attic on a Saturday, they can't answer. Callers hang up and hire the next company. What is your software?`
          ], 'gatekeeper_pain_ack');
        } else if (boss.key === 'skeptic') {
          return pickUnique(memory, [
            `(Wire strippers snap) Look, when I'm inside a 480-volt commercial electrical panel with insulated rubber gloves, I physically cannot touch a phone. So emergency calls roll to voicemail and hire the next guy. But hold on -- how does your setup catch calls without me touching a screen?`,
            `(Generator hums) You hit a nerve there. Lost an $8k generator install last week because I was running conduit. But tell me the truth: are you trying to sell me some computerized AI gimmick?`
          ], 'skeptic_pain_ack');
        } else if (boss.key === 'price') {
          return pickUnique(memory, [
            `(Pipe wrench clangs) Yeah, emergency sewer backups happen at 11 PM and by 11:05 PM they've hired another Miami plumber. But look, I got burned by a marketing clown for $3,000 last year. What does this Ava thing actually do?`,
            `(Scoffs into receiver) Missing emergency repipes hurts, obviously. But I'm not getting trapped in another $2,500 retainer. What is this tool?`
          ], 'price_pain_ack');
        } else if (boss.key === 'sal') {
          return pickUnique(memory, [
            `(Industrial pumps roaring) You're preaching to the choir, kid. During hurricane season, Cape Coral floods and my phone gets 50 calls between midnight and 4 AM. But single phone lines can only take one caller at a time! How does your tool handle 10 panicked homeowners at the same second?`,
            `(Water sloshing) Lost three $15k flood mitigations last tropical storm because the line was busy. How does your software handle high-volume storm call spikes?`
          ], 'sal_pain_ack');
        } else if (boss.key === 'brad') {
          return pickUnique(memory, [
            `(Condenser fan spins) Look, I already spend $1,800 a month on Angi and HomeAdvisor. My phone rings enough. How does your software capture exclusive callers before Angi sells them to 4 competitors?`,
            `(Gulp of sweet tea) Angi brings me jobs every week, but shared leads are cutthroat. How does Ava get me calls directly from Google?`
          ], 'brad_pain_ack');
        } else if (boss.key === 'gary') {
          return pickUnique(memory, [
            `(Diesel excavator purrs) I've been pumping septic tanks in Marion County for 38 years. I write every job on this yellow legal pad in my truck. I don't use 'apps' and I don't have a computer. How could I even use your service?`,
            `(Slow southern drawl) When I'm 6 feet deep in the dirt on a backhoe, I can't answer. But I don't do computers or technology. You're talking Chinese to an old timer, son.`
          ], 'gary_pain_ack');
        } else if (boss.key === 'vito') {
          return pickUnique(memory, [
            `(Mahogany desk creaks) We run 42 service vans across Texas and Florida with an internal dispatch center in Houston. Unless your AI integrates directly with ServiceTitan, handles bilingual Spanish dispatch, and works over Carrier *71 without rewiring my PBX, you're out of your league. Convince me.`,
            `(Deep authoritative breath) I have 14 commercial mechanical vans in Orlando alone. Most AI phone tools crash under enterprise call volume. What makes you think you can handle 200 calls a day?`
          ], 'vito_pain_ack');
        }
      }
    }

    // STAGE 2: Mechanism / Ava Features Reaction -> Advances to Price
    if (analysis.hasAvaMechanism && !memory.mechanismCovered) {
      memory.mechanismCovered = true;
      memory.topicsCovered['mechanism'] = true;
      memory.stage = 'price';
      memory.lastBossQuestion = 'how_much_does_it_cost';

      if (boss.key === 'roofer') {
        return pickUnique(memory, [
          `(Nail gun clicks) Wait, she answers in one ring, books directly into my schedule, and texts my cell so I don't have to check voicemails between jobs? That saves hours on ladders. But cut the fluff: how much is this going to cost me per month?`,
          `(Rooftop wind blowing) Direct calendar booking and instant SMS job dispatch? That would keep homeowners from calling my competitor. But what's the monthly damage to my bank account?`
        ], 'roofer_mech_ack');
      } else if (boss.key === 'gatekeeper') {
        return pickUnique(memory, [
          `(Keyboard clatter stops) She texts the customer name, address, and equipment symptoms directly to our on-call tech? That eliminates our offshore answering service errors completely. What is the monthly rate?`,
          `(Sigh of relief) Instant SMS dispatch and zero hold time? Our technicians could actually respond immediately. What do you charge for this monthly?`
        ], 'gatekeeper_mech_ack');
      } else if (boss.key === 'skeptic') {
        return pickUnique(memory, [
          `(Strips copper wire) She asks the homeowner for panel amperage and breaker trip details and texts me? That's actually useful. How much does this service run every month?`,
          `(Generator hum) So she actually collects trade details and texts my phone instead of making them leave a voicemail? Alright, what's this cost?`
        ], 'skeptic_mech_ack');
      } else if (boss.key === 'price') {
        return pickUnique(memory, [
          `(Pipe wrench tightens) She pre-qualifies trenchless repipes and books emergency slots? Alright, you got my attention. How much does it cost? Give me the bottom line dollar amount.`,
          `(Taps clipboard) Automatic intake and calendar booking without an offshore call center? Cut to the chase: how much is the monthly retainer?`
        ], 'price_mech_ack');
      } else if (boss.key === 'sal') {
        return pickUnique(memory, [
          `(Pump humming) Infinite simultaneous call concurrency so nobody gets a busy signal during a storm? Kid, that saves $50k in flood claims. What's the monthly investment?`,
          `(Water sloshing) Ten callers at the exact same second with zero busy signals? What does that cost per month?`
        ], 'sal_mech_ack');
      } else if (boss.key === 'brad') {
        return pickUnique(memory, [
          `(AC fan spins) She answers inbound calls from my Google profile before they ever tap an Angi ad? That pays for itself. How much do you charge per month?`,
          `Exclusive inbound conversion with instant missed-call text back? That beats shared leads. What's the cost?`
        ], 'brad_mech_ack');
      } else if (boss.key === 'gary') {
        return pickUnique(memory, [
          `(Chuckles) She just talks polite like a real southern girl and sends a simple text to my flip phone with the tank size? Hell, I don't even need a computer for that. How much do I owe you every month?`,
          `Simple text dispatch to my flip phone with name and address? That's clean. What's the price, son?`
        ], 'gary_mech_ack');
      } else if (boss.key === 'vito') {
        return pickUnique(memory, [
          `(Authoritative breath) Instant dispatch webhook to our Houston CRM with bilingual intake? That's enterprise-grade. What is your monthly van tier pricing?`,
          `ServiceTitan API sync with sub-second call transfer? What is the enterprise pricing structure?`
        ], 'vito_mech_ack');
      }
    }

    // STAGE 3: Pricing Reaction -> Demands Proof / Demo Line
    if (analysis.hasPricingAnswer && !memory.priceCovered) {
      memory.priceCovered = true;
      memory.topicsCovered['price'] = true;
      memory.stage = 'proof';
      memory.lastBossQuestion = 'proof_demo_line';

      return pickUnique(memory, [
        `Wait, $300 a month with zero setup fee and no contract? Honestly, that's pocket change -- one ${boss.avgLeak || 'emergency job'} pays for the entire year. But hold on: does this Ava thing sound like a robot? Florida homeowners with an emergency want a real person, not an automated machine. How do I hear her?`,
        `$397 a month and no long-term contracts? That's actually fair compared to the $1,400 answering services charge. But how do I know she doesn't sound computerized with that awkward 2-second delay? What's the number to test her?`
      ], 'price_reaction');
    }

    // STAGE 4: Live Demo Test Line (561) 813-8602 Reaction -> Asks About Carrier Setup
    if ((analysis.hasDemoNumber || (analysis.hasSoundHuman && analysis.hasAgreement)) && !memory.demoUnlocked) {
      memory.demoUnlocked = true;
      memory.topicsCovered['demo'] = true;
      memory.stage = 'carrier';
      memory.lastBossQuestion = 'carrier_rollover_setup';

      return pickUnique(memory, [
        `(Truck door thuds shut) 'If she sounds robotic, you can never talk to me again.' I respect that bet, Luke. I just tapped (561) 813-8602 into my cell... (Pause) Holy cow... she answered on the first ring, asked if I had active emergencies in ${boss.location}, and sounded like a real girl sitting in an office. Okay Luke, that's legitimately impressive. But how do I hook this up without switching carriers?`,
        `(Pulls over to shoulder) Alright, smart guy, putting your reputation on the line. Dialing (561) 813-8602 right now on speaker... (Pause) Damn. Zero latency and she actually knew my trade. Alright, you proved she sounds human. But how hard is this to hook up to my company line?`
      ], 'demo_live_reaction');
    }

    // STAGE 5: Carrier *71 Rollover Reaction -> Asks for Walkthrough / Close
    if (analysis.hasCarrier71 && !memory.carrierCovered) {
      memory.carrierCovered = true;
      memory.topicsCovered['carrier'] = true;
      memory.stage = 'close';
      memory.lastBossQuestion = 'meeting_time_close';

      return pickUnique(memory, [
        `(Air brake hiss) Star-7-1 conditional forwarding? So my business line stays with my carrier, and it only rolls over when my phone rings 3 times or after hours? That eliminates a massive headache. Alright Luke, what's the next step? When can we do a quick walkthrough?`,
        `(Tools clanking) Conditional rollover with *71? That's clean as hell. I was worried you were gonna try to port my company number like these other marketing clowns. Alright, you've got my attention. What time tomorrow works for a quick demo?`
      ], 'carrier_reaction');
    }

    // STAGE 6: Meeting Time Proposal / Final Close -> VICTORY!
    if (analysis.hasTimeProposal || (memory.demoUnlocked && memory.carrierCovered)) {
      memory.stage = 'victory';
      memory.lastBossQuestion = 'completed';

      return pickUnique(memory, [
        `Tomorrow at 4:30 PM works perfect -- I'll be wrapped up on the job site by then. Shoot the calendar invite and setup link to my cell right now. You earned this one, Luke.`,
        `Fair deal, Luke. That's a no-bullshit offer. I've got 10 minutes tomorrow afternoon right after we pack up our tools. Send that text to my cell and I'll see you tomorrow.`
      ], 'victory_close');
    }

    // SPECIAL BOSS-SPECIFIC BRANCHES:
    if (boss.key === 'brad' && (analysis.low.includes('angi') || analysis.low.includes('shared') || analysis.low.includes('exclusive') || analysis.low.includes('90') || analysis.hasLeakHook)) {
      memory.lastBossQuestion = 'how_much_does_it_cost';
      return pickUnique(memory, [
        `Man, you're dead right about Angi selling the same AC replacement lead to 4 competitors. I lost three $9k changeouts last month because two other guys called them while I was driving! How much does this Ava setup cost compared to Angi?`,
        `Damn... that shared lead bloodbath is too real. I paid $90 for a lead yesterday and the homeowner said four contractors already blew up their phone. How does Ava capture exclusive calls from my own Google profile?`
      ], 'brad_angi_reaction');
    }

    if (boss.key === 'gary' && (analysis.low.includes('yellow pad') || analysis.low.includes('text') || analysis.low.includes('flip phone') || analysis.low.includes('computer') || analysis.low.includes('simple') || analysis.low.includes('sms'))) {
      memory.lastBossQuestion = 'proof_demo_line';
      return pickUnique(memory, [
        `(Chuckles in southern drawl) Well son, I appreciate you not trying to sell me some high-tech silicon valley nonsense. If Ava just acts like a polite southern receptionist and texts my flip phone the address and tank size, that actually solves my headache. Does she sound natural or like a machine?`,
        `So she just answers my office line and texts my flip phone the customer name, address, and emergency level? Hell, even an old timer like me can handle that. But how do I hear what she sounds like?`
      ], 'gary_pad_reaction');
    }

    if (boss.key === 'sal' && (analysis.low.includes('concurrent') || analysis.low.includes('simultaneous') || analysis.low.includes('flood') || analysis.low.includes('storm') || analysis.low.includes('lines') || analysis.low.includes('busy'))) {
      memory.lastBossQuestion = 'proof_demo_line';
      return pickUnique(memory, [
        `(Dehumidifier roar fades) Infinite simultaneous call concurrency? That means 10 flooded homeowners can call at 2 AM and nobody gets a busy signal? Kid, that alone saves my entire hurricane season. But do insurance callers think she's a real person?`,
        `Handling 10 emergency flood calls at the exact same second with zero busy signals? That would have saved me $40,000 during the last tropical depression. Prove to me she doesn't sound like a computerized phone tree.`
      ], 'sal_concurrency_reaction');
    }

    if (boss.key === 'vito' && (analysis.low.includes('servicetitan') || analysis.low.includes('spanish') || analysis.low.includes('bilingual') || analysis.low.includes('webhook') || analysis.low.includes('enterprise') || analysis.low.includes('fleet'))) {
      memory.lastBossQuestion = 'meeting_time_close';
      return pickUnique(memory, [
        `Alright Luke. You know enterprise dispatch math, Carrier *71 conditional forwarding, and ServiceTitan CRM webhooks cold. That's rare for an outbound agency. I want a pilot on my 12 Orlando commercial mechanical vans starting next week. When are you sending the scope of work?`,
        `Impressive. You actually understand high-volume dispatch and Carrier *71 without touching our Houston PBX. Let's do a 15-minute executive demo with my VP of operations tomorrow afternoon. What time are you open?`
      ], 'vito_enterprise_reaction');
    }

    // STAGE-PRESERVING IN-CHARACTER PROMPTS (Never regresses!):
    if (memory.lastBossQuestion === 'how_much_does_it_cost') {
      return pickUnique(memory, [
        `I hear what you're saying, Luke, but I need the bottom line number. How many dollars a month is this? Give me the price.`,
        `Don't dance around the cost, kid. How much does Ava run per month? What's the investment?`
      ], 'prompt_price');
    }

    if (memory.lastBossQuestion === 'proof_demo_line') {
      return pickUnique(memory, [
        `Talk is cheap, Luke. Every salesperson says their software sounds human. What is the phone number I can dial right now on speaker to hear her voice?`,
        `Give me the live demo number. If she sounds like a real person, we'll talk business. What's the test line?`
      ], 'prompt_demo');
    }

    if (memory.lastBossQuestion === 'carrier_rollover_setup') {
      return pickUnique(memory, [
        `I'm not signing anything until I know what happens to my company phone number. Do I have to switch carriers or port my number? Tell me how it connects.`,
        `How does this Ava tool actually connect to my business line without messing up my phones? Give me the setup details.`
      ], 'prompt_carrier');
    }

    if (memory.lastBossQuestion === 'meeting_time_close') {
      return pickUnique(memory, [
        `I'm ready for the walkthrough, Luke. Give me a specific time tomorrow afternoon and let's get it on the calendar.`,
        `What time tomorrow can you walk me through the backend? Name a time.`
      ], 'prompt_close');
    }

    // General trade context fallback (Only on turn 1 if off-topic)
    return pickUnique(memory, [
      `Look Luke, I'm out in ${boss.location} dealing with ${boss.trade.toLowerCase()} jobs right now. Tell me the bottom line: how does this stop me from losing ${boss.avgLeak || 'jobs'} when my crews are working?`,
      `I'm listening, Luke, but make it plain English -- when a high-dollar ${boss.trade.toLowerCase()} customer calls after hours, how does Ava turn that into money in my bank account?`
    ], 'general_trade_context');
  }

  function evaluateTurn(userInput) {
    const curWeapon = WEAPONS.find(w => w.id === player.equippedWeapon) || WEAPONS[0];
    const curArmor = ARMORS.find(a => a.id === player.equippedArmor) || ARMORS[0];

    const analysis = analyzeSpeech(userInput, matchMemory, currentBoss);

    // Track consecutive hesitations and dodging in matchMemory
    if (analysis.isHesitant) {
      matchMemory.consecutiveHesitation = (matchMemory.consecutiveHesitation || 0) + 1;
    } else {
      matchMemory.consecutiveHesitation = 0;
    }

    if (analysis.isDodgingQuestion) {
      matchMemory.dodgedCount = (matchMemory.dodgedCount || 0) + 1;
    } else if (analysis.hasPricingAnswer || analysis.hasDemoNumber || analysis.hasCarrier71) {
      matchMemory.dodgedCount = 0;
    }

    let damage = 24;
    let grade = 'B';
    let feedback = '';
    let counterDmg = 8;
    let isCrit = false;
    let agreementHeal = 0;

    let isHangup = false;
    let hangupReason = '';
    let defeatMistake = '';
    let defeatRemedy = '';

    // 1. FATAL STRIKES & BLUNDERS (Instant Defeat / Rejection Disconnect)
    if (analysis.isFatalRude) {
      grade = 'F';
      damage = 0;
      counterDmg = 100;
      isHangup = true;
      hangupReason = 'Contractor Disrespect / Aggression';
      defeatMistake = 'Insulted, cursed at, or attacked the business owner on their active business line.';
      defeatRemedy = 'Contractors have zero tolerance for disrespect. Lead with extreme deference and use the Total Agreement Shield: "You are 100% right."';
      feedback = '🚨 FATAL BLUNDER: Hostility detected! Contractor hung up immediately.';
    } else if (analysis.isFatalSpam) {
      grade = 'F';
      damage = 0;
      counterDmg = 100;
      isHangup = true;
      hangupReason = 'Corporate Buzzword Telemarketer Spam';
      defeatMistake = 'Used corporate marketing buzzwords ("synergies", "omnichannel pipeline", "sales deck") that scream telemarketer spam to a blue-collar tradesman.';
      defeatRemedy = 'Contractors work with their hands. Speak plain job site English: missed calls, lost $8,000 emergency jobs, and instant SMS dispatch.';
      feedback = '🚨 FATAL BLUNDER: Corporate buzzword pitch trap! Contractor slammed the phone down.';
    } else if (analysis.isFatalPrice) {
      grade = 'F';
      damage = 0;
      counterDmg = 100;
      isHangup = true;
      hangupReason = 'Absurd / Scam Pricing Trap';
      defeatMistake = 'Quoted unrealistic enterprise fees ($5,000 - $10,000/mo) or claimed enterprise AI receptionist service is "100% free".';
      defeatRemedy = 'Tradesmen immediately recognize free as a scam or thousands as price gouging. Quote $397/mo flat with zero contracts and zero setup fee.';
      feedback = '🚨 FATAL BLUNDER: Quoted absurd/scam pricing! Contractor hung up.';
    } else if (analysis.isDodgingQuestion && (matchMemory.dodgedCount || 0) >= 2) {
      grade = 'F';
      damage = 0;
      counterDmg = 100;
      isHangup = true;
      hangupReason = 'Evasive Sales Rep / Dodged Contractor Question Twice';
      defeatMistake = 'Dodged the contractor\'s direct question twice in a row instead of giving a straight answer.';
      defeatRemedy = 'Never dodge pricing or proof questions. When a contractor asks "how much?", answer directly ($397/mo flat) before asking for a walkthrough.';
      feedback = '🚨 FATAL BLUNDER: Dodged contractor questions twice! Contractor terminated call.';
    } else if (analysis.isHesitant && (matchMemory.consecutiveHesitation || 0) >= 2) {
      grade = 'F';
      damage = 0;
      counterDmg = 100;
      isHangup = true;
      hangupReason = 'Dead Air & Freezing on the Phone';
      defeatMistake = 'Left awkward dead air and stuttered ("uh", "um", empty text) two turns in a row while contractor was waiting.';
      defeatRemedy = 'Contractors have zero patience for awkward pauses while working on job sites. Maintain vocal momentum and keep sentences punchy.';
      feedback = '🚨 FATAL BLUNDER: Dead air twice in a row! Contractor hung up.';
    } else if (analysis.isDodgingQuestion) {
      grade = 'D';
      damage = 6;
      counterDmg = 25;
      feedback = '⚠️ CONTRACTOR NOTICED DODGING: They asked a direct question. Answer it immediately or they will hang up!';
    } else if (analysis.isHesitant) {
      grade = 'D';
      damage = 4;
      counterDmg = 20;
      feedback = '⚠️ HESITATION WARNING: Stuttering or dead air on a business line. Contractor is losing patience!';
    } else {
      // 2. NORMAL ADAPTIVE BRAIN EVALUATION
      if (analysis.hasAgreement) {
        agreementHeal = 18;
        player.hp = Math.min(player.maxHp, player.hp + agreementHeal);
        feedback += ` [Defused Tension: +${agreementHeal} HP]`;
      }

      if ((analysis.hasPermission || analysis.hasAgreement) && (analysis.hasLeakHook || analysis.hasDollarMath) && (analysis.hasDemoNumber || analysis.hasCarrier71 || analysis.hasPricingAnswer)) {
        grade = 'S';
        damage = 45;
        counterDmg = 0;
        feedback = '🔥 MASTERFUL REBUTTAL! Fully addressed the contractor\'s concern, anchored trade math, and delivered proof!';
      } else if (analysis.hasDemoNumber || analysis.hasCarrier71 || analysis.hasPricingAnswer || analysis.hasTimeProposal) {
        grade = 'A';
        damage = 34;
        counterDmg = 4;
        feedback = '✨ EXCELLENT! Direct, substantive answer with zero fluff.';
      } else if (analysis.hasLeakHook || analysis.hasPermission || analysis.hasAgreement || analysis.hasAvaMechanism || analysis.isUserAskingQuestion) {
        grade = 'B';
        damage = 22;
        counterDmg = 8;
        feedback = 'Solid move. Kept the conversation moving forward without triggering skepticism.';
      } else {
        grade = 'C';
        damage = 12;
        counterDmg = 16;
        feedback = 'A bit vague. Anchor directly to their missed call revenue.';
      }
    }

    // 3. WEAPON & ARMOR & RELIC MODIFIERS
    if (grade !== 'F') {
      damage = Math.round(damage * (1 + curWeapon.dmgBonus / 100));

      if (player.unlockedRelics && player.unlockedRelics.includes('battlecard')) {
        damage = Math.round(damage * 1.10);
      }

      let critChance = 0.35;
      if (player.unlockedRelics && player.unlockedRelics.includes('simcard')) {
        critChance += 0.15;
      }

      if (curWeapon.id === 'blade' && analysis.hasPermission && Math.random() < critChance) {
        isCrit = true;
        damage += 25;
        feedback += ' ⚔️ CRITICAL HIT! Permission Slice triggered!';
      } else if (player.unlockedRelics && player.unlockedRelics.includes('simcard') && (analysis.hasPermission || analysis.hasLeakHook) && Math.random() < 0.2) {
        isCrit = true;
        damage += 20;
        feedback += ' 📶 5G CARRIER CRIT! Instant connection bonus!';
      }

      // Execute Finisher Overkill (<35% Boss HP)
      if (bossHp > 0 && bossHp <= currentBoss.maxHp * 0.35 && (analysis.hasTimeProposal || (analysis.hasDemoNumber && analysis.hasCarrier71))) {
        damage += 50;
        isCrit = true;
        feedback += ' ⚡ EXECUTE FINISHER OVERKILL (+50 DMG)!';
      }

      if (curWeapon.id === 'scythe' && player.skepticismReaperActive) {
        damage = Math.round(damage * 2.0);
        feedback += ' 🌾 SKEPTICISM REAPER: 2X DAMAGE!';
        player.skepticismReaperActive = false;
      }
      if (curWeapon.id === 'scythe' && analysis.hasAgreement) {
        player.skepticismReaperActive = true;
      }

      counterDmg = Math.round(counterDmg * (1 - curArmor.dmgReduct / 100));

      if (curArmor.id === 'plate' && Math.random() < 0.2) {
        counterDmg = 0;
        feedback += ' 🛡️ DEFLECTED! Steel plate deflected contractor counterattack!';
      }

      if (curArmor.id === 'cuirass' && (grade === 'S' || grade === 'A')) {
        player.hp = Math.min(player.maxHp, player.hp + 10);
        feedback += ' [Reputation Bastion: +10 HP]';
      }

      if (curArmor.id === 'cloak') {
        player.hp = Math.min(player.maxHp, player.hp + 5);
        feedback += ' [Obsidian Regen: +5 HP]';
      }

      if (curWeapon.id === 'cleaver' && analysis.hasLeakHook) {
        player.bleedTurns = 2;
      }
    }

    // Check if counter-damage drops player HP to 0
    if (player.hp - counterDmg <= 0 && !isHangup) {
      isHangup = true;
      hangupReason = 'Emotional Rejection Armor Depleted';
      defeatMistake = 'Contractor objections broke through your armor after multiple weak or off-target rebuttals.';
      defeatRemedy = 'Equip higher tier armor (Steel Plate / Reputation Bastion) in the Armory and use the +18 HP Total Agreement defuse ("You are 100% right").';
    }

    // Generate Adaptive Contractor Reply
    let contractorReply = generateContractorTurn(analysis, matchMemory, currentBoss);

    if (player.hp - counterDmg <= 0 && !contractorReply.includes('*[')) {
      contractorReply = currentBoss.dialogue.defeat || contractorReply;
    }

    return {
      grade,
      damage,
      counterDmg,
      feedback,
      contractorReply,
      isCrit,
      agreementHeal,
      isHangup,
      hangupReason,
      defeatMistake,
      defeatRemedy
    };
  }

  // 9. TURN EXECUTION
  window.executeQuickStrike = function(strikeType) {
    const input = document.getElementById('playerCustomInput');
    if (!input || input.disabled) return;
    const bossFirst = (currentBoss.name || 'Contractor').split(' ')[0];
    let text = '';
    if (strikeType === 'permission') {
      text = `Hey ${bossFirst}, I know you're busy in the field — you got 30 seconds before you hang up on me?`;
    } else if (strikeType === 'leak') {
      text = `Where does an emergency $8,000 replacement call go right now when you're on a job or asleep at 8 PM?`;
    } else if (strikeType === 'mechanism') {
      text = `Ava answers in one ring on the first ring, qualifies the emergency job, and texts your cell phone immediately.`;
    } else if (strikeType === 'price') {
      text = `It is a flat 300 a month with zero setup fee and zero contract. One shingle repair pays for the entire year.`;
    } else if (strikeType === 'demo') {
      text = `Don't take my word for it. Dial our live Florida test line on (561) 813-8602 right now from your truck and hear Ava with zero delay.`;
    } else if (strikeType === 'carrier') {
      text = `We hook it up via Carrier *71 conditional call forwarding so your company number stays with your provider.`;
    } else if (strikeType === 'close') {
      text = `Let's do a quick 10-minute walkthrough tomorrow afternoon at 4:30 PM.`;
    } else if (strikeType === 'defuse') {
      text = `You are 100% right. Every contractor has been burned by telemarketers, which is why we do zero contracts.`;
    } else if (strikeType === 'execute') {
      text = `Let's do a 10-minute walkthrough tomorrow at 4:30 PM and plug that $8,000 leak together.`;
    } else {
      text = strikeType;
    }
    input.value = text;
    submitRebuttal();
  };

  window.handleInputKey = function(e) {
    if (e.key === 'Enter') {
      submitRebuttal();
    }
  };

  window.submitRebuttal = function() {
    const input = document.getElementById('playerCustomInput');
    const sendBtn = document.getElementById('sendBtn');
    const userText = input ? input.value.trim() : '';
    if (!userText) return;
    if (input) input.value = '';

    appendLog(`<strong>Luke:</strong> "${userText}"`, 'player');
    matchHistory.push({ role: 'user', content: userText });

    if (player.breatherCooldown > 0) player.breatherCooldown--;

    const evalRes = evaluateTurn(userText);

    bossHp = Math.max(0, bossHp - evalRes.damage);

    // Floating Numbers & Audio Juice
    if (evalRes.damage >= 50 && evalRes.feedback.includes('EXECUTE')) {
      playSynth('execute');
      triggerArenaShake(true);
      spawnFloatingNumber('⚡ +50 EXECUTE OVERKILL!', 'execute');
    } else if (evalRes.isCrit) {
      playSynth('crit');
      triggerArenaShake(true);
      spawnFloatingNumber(`⚔️ CRIT -${evalRes.damage}!`, 'crit');
    } else if (evalRes.damage > 0) {
      playSynth('slash');
      spawnFloatingNumber(`-${evalRes.damage} DMG`, 'damage');
    }

    if (evalRes.agreementHeal > 0) {
      spawnFloatingNumber(`+${evalRes.agreementHeal} HP DEFUSED`, 'heal');
    }

    if (player.bleedTurns > 0 && bossHp > 0) {
      const bleedDmg = 10;
      bossHp = Math.max(0, bossHp - bleedDmg);
      player.bleedTurns--;
      spawnFloatingNumber(`🩸 -${bleedDmg} BLEED`, 'damage');
      appendLog(`🩸 <strong>REVENUE BLEED:</strong> Missed call revenue leak dealt <strong>+${bleedDmg} Bleed Damage</strong> to ${currentBoss.name}!`, 'crit');
    }

    if (evalRes.grade === 'S' || evalRes.grade === 'A') {
      player.streak++;
      playSynth('combo', player.streak);
      spawnFloatingNumber(`🔥 ${player.streak}X COMBO!`, 'combo');
      if (player.streak % 2 === 0) {
        const comboHeal = 20;
        player.hp = Math.min(player.maxHp, player.hp + comboHeal);
        playSynth('heal');
        spawnFloatingNumber(`+${comboHeal} HP FLOW`, 'heal');
        appendLog(`🔥 <strong>FLOW STATE COMBO (${player.streak}X STREAK)!</strong> Smooth cadence recovered <strong>+${comboHeal} HP</strong>!`, 'heal');
      }
    } else {
      player.streak = 0;
    }

    if (evalRes.counterDmg > 0) {
      player.hp = Math.max(0, player.hp - evalRes.counterDmg);
      playSynth('hit');
      spawnFloatingNumber(`-${evalRes.counterDmg} HP`, 'deflect');
    }

    appendLog(`🎯 <strong>TURN GRADE: [${evalRes.grade}]</strong> Dealt <strong>${evalRes.damage} DMG</strong> to ${currentBoss.name}.${evalRes.counterDmg > 0 ? ` Contractor counterattacked for <span style="color:var(--err)">-${evalRes.counterDmg} HP</span>.` : ''} ${evalRes.feedback}`, 'system');

    updateHUD();

    if (evalRes.isHangup || player.hp <= 0) {
      handlePlayerKnockout(evalRes);
      return;
    }

    if (bossHp <= 0 || matchMemory.stage === 'victory') {
      handleBossDefeat();
      return;
    }

    setTimeout(() => {
      appendLog(`<strong>${currentBoss.name}:</strong> "${evalRes.contractorReply}"`, 'boss');
      matchHistory.push({ role: 'assistant', content: evalRes.contractorReply });
      if (voiceEnabled) {
        speakContractor(evalRes.contractorReply, currentBoss.key);
      }
    }, 450);

    savePlayer();
  };

  function handleBossDefeat() {
    playSynth('victory');
    triggerArenaShake(false);
    fireConfetti(85);

    const streakMult = 1 + Math.min(1.0, player.streak * 0.2);
    const relicGoldMult = (player.unlockedRelics && player.unlockedRelics.includes('rolodex')) ? 1.25 : 1.0;
    const relicXpMult = (player.unlockedRelics && player.unlockedRelics.includes('aviators')) ? 1.20 : 1.0;

    const baseExp = 150 + currentBossIndex * 50;
    const baseGold = 80 + currentBossIndex * 35;

    const xpReward = Math.round(baseExp * streakMult * relicXpMult);
    const goldReward = Math.round(baseGold * streakMult * relicGoldMult);

    const isFirstWin = !player.defeatedBosses.includes(currentBoss.key);
    if (isFirstWin) {
      player.defeatedBosses.push(currentBoss.key);
    }
    player.dealsClosedCount = (player.dealsClosedCount || 0) + 1;

    // Roll unearned relic (guaranteed on first boss defeat)
    let rolledRelic = null;
    const unearnedRelics = TRADE_RELICS.filter(r => !(player.unlockedRelics || []).includes(r.id));
    if (unearnedRelics.length > 0) {
      if (isFirstWin || (player.unlockedRelics || []).length === 0 || Math.random() < 0.8) {
        rolledRelic = unearnedRelics[Math.floor(Math.random() * unearnedRelics.length)];
      }
    }

    pendingLoot = {
      xp: xpReward,
      gold: goldReward,
      relic: rolledRelic,
      boss: currentBoss
    };

    appendLog(`<strong>${currentBoss.name}:</strong> "${currentBoss.dialogue.victory}"`, 'boss');
    appendLog(`🏆 <strong>VICTORY! ${currentBoss.name} AGREED TO TEST AVA!</strong> Earned <strong>+${xpReward} XP</strong> and <strong>+${goldReward} GP</strong> (${streakMult.toFixed(1)}x Streak Multiplier)!`, 'crit');

    if (voiceEnabled) {
      speakContractor(currentBoss.dialogue.victory, currentBoss.key);
    }

    renderBossGauntletList();
    updateHUD();

    // Open Mystery Loot Modal immediately for instant dopamine feedback
    openLootModal();

    savePlayer();
  }

  function openLootModal() {
    const modal = document.getElementById('lootModal');
    const bossNameEl = document.getElementById('lootBossName');
    const chestContainer = document.getElementById('chestContainer');
    const chestIcon = document.getElementById('chestIcon');
    const chestPrompt = document.getElementById('chestPrompt');
    const rewardsBox = document.getElementById('lootRewardsBox');
    const claimBtn = document.getElementById('lootClaimBtn');

    if (bossNameEl) bossNameEl.textContent = `${currentBoss.name.toUpperCase()} AGREED TO WALKTHROUGH!`;
    if (chestContainer) chestContainer.style.display = 'block';
    if (chestIcon) {
      chestIcon.className = 'bouncing-chest';
      chestIcon.textContent = '🎁';
    }
    if (chestPrompt) chestPrompt.textContent = '✨ CLICK TO CRACK LOOT CHEST ✨';
    if (rewardsBox) rewardsBox.style.display = 'none';
    if (claimBtn) claimBtn.style.display = 'none';

    if (modal) modal.classList.add('open');
  }

  window.crackLootChest = function(instant = false) {
    const chestIcon = document.getElementById('chestIcon');
    const chestPrompt = document.getElementById('chestPrompt');
    if (chestIcon) {
      chestIcon.className = 'chest-cracking';
    }
    if (chestPrompt) chestPrompt.textContent = '✨ CRACKING CHEST... ✨';
    playSynth('chest');

    const revealSpoils = () => {
      playSynth('cash');
      fireConfetti(110);

      const chestContainer = document.getElementById('chestContainer');
      const rewardsBox = document.getElementById('lootRewardsBox');
      const claimBtn = document.getElementById('lootClaimBtn');
      const goldEl = document.getElementById('lootGoldAmount');
      const xpEl = document.getElementById('lootXpAmount');
      const relicRow = document.getElementById('lootRelicRow');
      const relicIcon = document.getElementById('lootRelicIcon');
      const relicName = document.getElementById('lootRelicName');
      const relicDesc = document.getElementById('lootRelicDesc');

      if (chestContainer) chestContainer.style.display = 'none';

      if (pendingLoot) {
        player.gold += pendingLoot.gold;
        player.xp += pendingLoot.xp;

        if (goldEl) goldEl.textContent = `+${pendingLoot.gold} GP`;
        if (xpEl) xpEl.textContent = `+${pendingLoot.xp} XP`;

        if (pendingLoot.relic) {
          if (!player.unlockedRelics) player.unlockedRelics = [];
          if (!player.unlockedRelics.includes(pendingLoot.relic.id)) {
            player.unlockedRelics.push(pendingLoot.relic.id);
          }
          if (relicRow) relicRow.style.display = 'flex';
          if (relicIcon) relicIcon.textContent = pendingLoot.relic.icon;
          if (relicName) relicName.textContent = pendingLoot.relic.name;
          if (relicDesc) relicDesc.textContent = pendingLoot.relic.desc;
          appendLog(`🎁 <strong>RELIC FOUND:</strong> Unlocked <strong>${pendingLoot.relic.name}</strong> (${pendingLoot.relic.desc})!`, 'heal');
        } else {
          if (relicRow) relicRow.style.display = 'none';
        }
      }

      if (rewardsBox) rewardsBox.style.display = 'block';
      if (claimBtn) claimBtn.style.display = 'inline-flex';

      recalcPlayerStats();
      checkLevelUp();
      updateHUD();
      savePlayer();
    };

    if (instant) {
      revealSpoils();
    } else {
      setTimeout(revealSpoils, 650);
    }
  };

  window.claimLootAndAdvance = function() {
    const modal = document.getElementById('lootModal');
    if (modal) modal.classList.remove('open');

    let nextIdx = (currentBossIndex + 1) % BOSSES.length;
    for (let i = 0; i < BOSSES.length; i++) {
      const idx = (currentBossIndex + 1 + i) % BOSSES.length;
      if (!player.defeatedBosses.includes(BOSSES[idx].key)) {
        nextIdx = idx;
        break;
      }
    }
    selectBoss(nextIdx);
  };

  function handlePlayerKnockout(evalRes) {
    playSynth('hangup');

    const input = document.getElementById('playerCustomInput');
    const sendBtn = document.getElementById('sendBtn');
    if (input) {
      input.disabled = true;
      input.placeholder = '📵 CALL DISCONNECTED. Click Redial to try again...';
    }
    if (sendBtn) sendBtn.disabled = true;

    const reply = (evalRes && evalRes.contractorReply)
      ? evalRes.contractorReply
      : (currentBoss.dialogue && currentBoss.dialogue.defeat
          ? currentBoss.dialogue.defeat
          : `Lose my number and stop calling my business! *[CLICK]*`);

    appendLog(`<strong>${currentBoss.name}:</strong> "${reply}"`, 'boss');
    appendLog(`📵 <strong>CALL TERMINATED!</strong> ${currentBoss.name} hung up on you.`, 'system');

    if (voiceEnabled) {
      speakContractor(reply, currentBoss.key);
    }

    // Populate Defeat Modal
    const modal = document.getElementById('defeatModal');
    const title = document.getElementById('defeatTitle');
    const bossBark = document.getElementById('defeatBossBark');
    const mistakeDesc = document.getElementById('defeatMistakeDesc');
    const remedyDesc = document.getElementById('defeatRemedyDesc');

    if (title) {
      title.textContent = (evalRes && evalRes.hangupReason)
        ? `LOST CALL: ${evalRes.hangupReason.toUpperCase()}`
        : `${currentBoss.name.toUpperCase()} HUNG UP!`;
    }
    if (bossBark) {
      bossBark.textContent = `"${reply}"`;
    }
    if (mistakeDesc) {
      mistakeDesc.textContent = (evalRes && evalRes.defeatMistake)
        ? evalRes.defeatMistake
        : 'Contractor objection counter-damage broke through your armor.';
    }
    if (remedyDesc) {
      remedyDesc.textContent = (evalRes && evalRes.defeatRemedy)
        ? evalRes.defeatRemedy
        : 'Next time, lead with the 20-second permission opener, agree with his skepticism first, and quote the $397 flat rate with zero long-term contracts.';
    }

    if (modal) modal.classList.add('open');

    savePlayer();
  }

  window.redialAfterDefeat = function() {
    const modal = document.getElementById('defeatModal');
    if (modal) modal.classList.remove('open');

    // Restore player HP and reset fight state
    player.hp = player.maxHp;
    player.streak = 0;
    bossHp = currentBoss.maxHp;
    resetMatchMemory();

    // Re-enable text input and send button
    const input = document.getElementById('playerCustomInput');
    const sendBtn = document.getElementById('sendBtn');
    if (input) {
      input.disabled = false;
      input.placeholder = `Speak or type your pitch to ${currentBoss.name}...`;
      input.value = '';
    }
    if (sendBtn) sendBtn.disabled = false;

    // Clear log and re-dial
    const terminal = document.getElementById('combatLog');
    if (terminal) terminal.innerHTML = '';

    appendLog(`📞 <strong>REDIALING:</strong> Connecting to ${currentBoss.name} (${currentBoss.company}) in ${currentBoss.location}...`, 'system');

    setTimeout(() => {
      const opener = currentBoss.dialogue.stage1 || currentBoss.dialogue.opener;
      appendLog(`<strong>${currentBoss.name}:</strong> "${opener}"`, 'boss');
      if (voiceEnabled) {
        speakContractor(opener, currentBoss.key);
      }
      if (input) input.focus();
    }, 450);

    updateHUD();
    savePlayer();
  };

  function checkLevelUp() {
    if (player.xp >= player.nextLvlXp && player.lvl < 10) {
      player.xp -= player.nextLvlXp;
      player.lvl++;
      const nextRank = RANKS.find(r => r.lvl === player.lvl);
      if (nextRank) {
        player.nextLvlXp = nextRank.xpReq;
      } else {
        player.nextLvlXp = Math.round(player.nextLvlXp * 1.5);
      }

      WEAPONS.forEach(w => {
        if (player.lvl >= w.lvl && !player.unlockedWeapons.includes(w.id)) {
          player.unlockedWeapons.push(w.id);
        }
      });
      ARMORS.forEach(a => {
        if (player.lvl >= a.lvl && !player.unlockedArmors.includes(a.id)) {
          player.unlockedArmors.push(a.id);
        }
      });

      recalcPlayerStats();
      showLevelUpModal(player.lvl);
    }
  }

  function showLevelUpModal(lvl) {
    const rankObj = RANKS.find(r => r.lvl === lvl) || RANKS[0];
    const modal = document.getElementById('levelUpModal');
    const title = document.getElementById('levelUpTitle');
    const rank = document.getElementById('levelUpRank');
    const desc = document.getElementById('levelUpDesc');

    if (title) title.textContent = `LEVEL UP! LEVEL ${lvl}`;
    if (rank) rank.textContent = rankObj.title;
    if (desc) desc.textContent = `Your cold call objection mastery is expanding! Max HP increased and higher tier weapons are unlocked in the Armory.`;
    if (modal) modal.classList.add('open');
  }

  window.closeLevelUpModal = function() {
    const modal = document.getElementById('levelUpModal');
    if (modal) modal.classList.remove('open');
  };

  // 10. ARMORY MODAL (SWORDS & ARMOR)
  window.openArmoryModal = function() {
    renderArmory();
    const modal = document.getElementById('armoryModal');
    if (modal) modal.classList.add('open');
  };

  window.closeArmoryModal = function() {
    const modal = document.getElementById('armoryModal');
    if (modal) modal.classList.remove('open');
  };

  function renderArmory() {
    const wGrid = document.getElementById('weaponsGrid');
    const aGrid = document.getElementById('armorGrid');
    if (!wGrid || !aGrid) return;

    wGrid.innerHTML = WEAPONS.map(w => {
      const isEquipped = player.equippedWeapon === w.id;
      const isUnlocked = player.unlockedWeapons.includes(w.id);
      return `
        <div class="gear-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}">
          <div class="gear-top">
            <div class="gear-icon">${w.icon}</div>
            <div class="gear-meta">
              <h4>${w.name}</h4>
              <div class="stat-boost">+${w.dmgBonus}% Objection Damage</div>
            </div>
          </div>
          <p class="gear-desc">${w.desc}</p>
          <div class="gear-passive"><strong>Perk: ${w.passiveName}</strong> — ${w.passiveDesc}</div>
          <button class="gear-btn ${isEquipped ? 'equipped-badge' : (isUnlocked ? 'equip' : 'locked-btn')}"
            ${!isUnlocked || isEquipped ? 'disabled' : ''} onclick="equipWeapon('${w.id}')">
            ${isEquipped ? '✓ EQUIPPED' : (isUnlocked ? '⚔️ Equip Weapon' : '🔒 Unlocks at Level ' + w.lvl)}
          </button>
        </div>
      `;
    }).join('');

    aGrid.innerHTML = ARMORS.map(a => {
      const isEquipped = player.equippedArmor === a.id;
      const isUnlocked = player.unlockedArmors.includes(a.id);
      return `
        <div class="gear-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}">
          <div class="gear-top">
            <div class="gear-icon">${a.icon}</div>
            <div class="gear-meta">
              <h4>${a.name}</h4>
              <div class="stat-boost">${a.maxHp} Max HP · ${a.dmgReduct}% Absorb</div>
            </div>
          </div>
          <p class="gear-desc">${a.desc}</p>
          <div class="gear-passive"><strong>Perk: ${a.passiveName}</strong> — ${a.passiveDesc}</div>
          <button class="gear-btn ${isEquipped ? 'equipped-badge' : (isUnlocked ? 'equip' : 'locked-btn')}"
            ${!isUnlocked || isEquipped ? 'disabled' : ''} onclick="equipArmor('${a.id}')">
            ${isEquipped ? '✓ EQUIPPED' : (isUnlocked ? '🛡️ Equip Armor' : '🔒 Unlocks at Level ' + a.lvl)}
          </button>
        </div>
      `;
    }).join('');

    const rGrid = document.getElementById('relicsGrid');
    if (rGrid) {
      rGrid.innerHTML = TRADE_RELICS.map(r => {
        const isUnlocked = (player.unlockedRelics || []).includes(r.id);
        return `
          <div class="gear-card ${isUnlocked ? 'equipped' : 'locked'}">
            <div class="gear-top">
              <div class="gear-icon">${r.icon}</div>
              <div class="gear-meta">
                <h4>${r.name}</h4>
                <div class="stat-boost" style="color:var(--purple)">${r.perk}</div>
              </div>
            </div>
            <p class="gear-desc">${r.desc}</p>
            <div class="gear-passive"><strong>Status:</strong> ${isUnlocked ? '✓ Permanent Passive Active' : '🔒 Drop from Mystery Loot Chests'}</div>
          </div>
        `;
      }).join('');
    }
  }

  window.equipWeapon = function(weaponId) {
    if (!player.unlockedWeapons.includes(weaponId)) return;
    player.equippedWeapon = weaponId;
    playSynth('slash');
    savePlayer();
    updateHUD();
    renderArmory();
  };

  window.equipArmor = function(armorId) {
    if (!player.unlockedArmors.includes(armorId)) return;
    player.equippedArmor = armorId;
    recalcPlayerStats();
    playSynth('heal');
    savePlayer();
    updateHUD();
    renderArmory();
  };

  // 11. SPEECH-TO-TEXT MICROPHONE INPUT
  window.toggleSpeechRecognition = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const micBtn = document.getElementById('micBtn');
    const micLabel = document.getElementById('micLabel');

    if (isListening && speechRec) {
      speechRec.stop();
      isListening = false;
      if (micBtn) micBtn.classList.remove('listening');
      if (micLabel) micLabel.textContent = 'Speak';
      return;
    }

    try {
      speechRec = new SpeechRecognition();
      speechRec.continuous = false;
      speechRec.interimResults = false;
      speechRec.lang = 'en-US';

      speechRec.onstart = () => {
        isListening = true;
        if (micBtn) micBtn.classList.add('listening');
        if (micLabel) micLabel.textContent = 'Listening...';
      };

      speechRec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        const input = document.getElementById('playerCustomInput');
        if (input) input.value = transcript;
        submitRebuttal();
      };

      speechRec.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        isListening = false;
        if (micBtn) micBtn.classList.remove('listening');
        if (micLabel) micLabel.textContent = 'Speak';
      };

      speechRec.onend = () => {
        isListening = false;
        if (micBtn) micBtn.classList.remove('listening');
        if (micLabel) micLabel.textContent = 'Speak';
      };

      speechRec.start();
    } catch(e) {
      console.warn('SpeechRec start failed:', e);
    }
  };

  // Attach helpers to window for UI and testing
  window.selectBoss = selectBoss;
  window.updateHUD = updateHUD;
  window.evaluateTurn = evaluateTurn;
  window.handleBossDefeat = handleBossDefeat;
  window.renderArmory = renderArmory;

  // INITIALIZATION ON PAGE LOAD
  loadSavedPlayer();
  initConfettiCanvas();
  selectBoss(0);
  updateHUD();

})();
</script>
</body>
</html>
'@

$outPath = "$PSScriptRoot/../website/cold-call-quest/index.html"
$outDir = Split-Path $outPath -Parent
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($outPath, $questHtml, $utf8Bom)
Write-Host "Successfully generated Standalone Cold Call Quest in $outPath"
