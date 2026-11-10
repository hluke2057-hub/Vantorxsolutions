function renderFrame(time) {
  window.renderFrame = renderFrame;

  if (!Number.isFinite(time) || isNaN(time) || time < 0) {
    time = 0;
  }
  time = Math.min(time, TOTAL_DURATION || 63);

  ctx.save();
  ctx.clearRect(0, 0, W, H);

  // Apply 124 BPM Heartbeat Zoom & Continuous Smooth Cinematic Camera Drift
  // Guarantees that literally EVERY SINGLE PIXEL on screen has continuous motion!
  const beat = (time * 124 / 60) * Math.PI * 2;
  const breatheZoom = 1.0 + 0.012 * Math.sin(beat);
  const driftX = Math.sin(time * 0.8) * 6;
  const driftY = Math.cos(time * 0.6) * 4;

  ctx.translate(W / 2 + driftX, H / 2 + driftY);
  ctx.scale(breatheZoom, breatheZoom);
  ctx.translate(-W / 2, -H / 2);

  // Apply Camera Shake if active
  const shake = getCameraShake(time);
  ctx.translate(shake.x, shake.y);

  renderDynamicAtmosphere(time);

  // STUDIO HERO POSTER CARD ON PAUSE / INITIAL LOAD (t === 0)
  if (!isPlaying && time === 0) {
    renderStudioHeroPosterCard();
    ctx.restore();
    return;
  }

  // SFX Triggers calibrated to exact story moments
  if (isPlaying && !document.hidden) {
    if (time >= 0.3 && !playedSfxMap['laser']) { playSfx('laser'); playedSfxMap['laser'] = true; }
    if (time >= 13.2 && !playedSfxMap['drip']) { playSfx('water_drip'); playedSfxMap['drip'] = true; }
    if (time >= 15.0 && !playedSfxMap['phone1']) { playSfx('phone_ring'); playedSfxMap['phone1'] = true; }
    if (time >= 25.2 && !playedSfxMap['phone2']) { playSfx('phone_ring'); playedSfxMap['phone2'] = true; }
    if (time >= 28.5 && !playedSfxMap['whoosh']) { playSfx('whoosh'); playedSfxMap['whoosh'] = true; }
    if (time >= 33.0 && !playedSfxMap['ava']) { playSfx('ava_chime'); playedSfxMap['ava'] = true; }
    if (time >= 41.5 && !playedSfxMap['van']) { playSfx('van_zoom'); playedSfxMap['van'] = true; }
    if (time >= 48.0 && !playedSfxMap['chaching']) { playSfx('chaching'); playedSfxMap['chaching'] = true; }
  }

  // Continuous Dynamic Scene Progression
  if (time < 7.2) {
    renderTasklessScene1_NightPhone(time);
  } else if (time < 12.8) {
    renderTasklessScene2_LasersUranus(time);
  } else if (time < 18.2) {
    renderTasklessScene3_CustomerWindow(time);
  } else if (time < 24.8) {
    renderTasklessScene4_Stat78Percent(time);
  } else if (time < 32.2) {
    renderTasklessScene5_TwoShopsComparison(time);
  } else if (time < 39.2) {
    renderTasklessScene6_ShopB_AvaReply(time);
  } else if (time < 47.2) {
    renderTasklessScene7_WorkflowNodes(time);
  } else if (time < 53.0) {
    renderTasklessScene8_TechDispatchAndDashboard(time);
  } else if (time < 58.5) {
    renderTasklessScene9_LiveDemoDialer(time);
  } else {
    renderTasklessScene10_TryTasklessCTA(time);
  }

  // Kinetic Subtitles
  renderKineticSubtitles(time);

  // Subtle Cinematic Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}
