// scripts/apply_reel_playback_fixes.js
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'website', 'demo', 'reel-creator.html');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize to LF for matching and replace with CRLF
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Target block from resetSfxFlags to end of updateUI
const oldBlock = `function resetSfxFlags() {
  playedLaserSfx = false;
  playedSubdropSfx = false;
  playedPhoneSfx = false;
  playedIosPingSfx = false;
}

function togglePlay() {
  initAudioGraph();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  isPlaying = !isPlaying;
  window.isPlaying = isPlaying;
  window.currentTime = currentTime;
  const btn = document.getElementById('btnPlayPause');
  const playOverlay = document.getElementById('reelPlayOverlay');
  const recText = document.getElementById('recText');
  const recPill = document.getElementById('recStatusPill');

  if (isPlaying) {
    if (btn) btn.innerHTML = '<span>⏸️</span> Pause Reel';
    if (playOverlay) playOverlay.style.display = 'none';
    if (recText) recText.textContent = 'PLAYING';
    if (recPill) {
      recPill.style.color = '#10b981';
      recPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    }
    startBackgroundBeat();
    triggerAudioForCurrentTime();
  } else {
    if (btn) btn.innerHTML = '<span>▶️</span> Play &amp; Preview Reel';
    if (playOverlay) playOverlay.style.display = 'flex';
    if (recText) recText.textContent = 'READY';
    if (recPill) {
      recPill.style.color = '#ef4444';
      recPill.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    }
    stopBackgroundBeat();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (uploadedAudioElement) uploadedAudioElement.pause();
  }
}

window.switchStageView = function(view) {
  const canvasEl = document.getElementById('reelCanvas');
  const videoEl = document.getElementById('masterMp4Player');
  const btnC = document.getElementById('btnViewCanvas');
  const btnV = document.getElementById('btnViewVideo');
  if (view === 'video') {
    if (isPlaying) togglePlay();
    if (canvasEl) canvasEl.style.display = 'none';
    if (videoEl) {
      videoEl.style.display = 'block';
      videoEl.play().catch(() => {});
    }
    if (btnV) {
      btnV.style.background = 'rgba(245,158,11,0.9)';
      btnV.style.color = '#0b0f19';
      btnV.style.fontWeight = '800';
    }
    if (btnC) {
      btnC.style.background = 'rgba(255,255,255,0.15)';
      btnC.style.color = '#ffffff';
      btnC.style.fontWeight = '600';
    }
  } else {
    if (videoEl) {
      videoEl.pause();
      videoEl.style.display = 'none';
    }
    if (canvasEl) canvasEl.style.display = 'block';
    if (btnC) {
      btnC.style.background = 'rgba(245,158,11,0.9)';
      btnC.style.color = '#0b0f19';
      btnC.style.fontWeight = '800';
    }
    if (btnV) {
      btnV.style.background = 'rgba(255,255,255,0.15)';
      btnV.style.color = '#ffffff';
      btnV.style.fontWeight = '600';
    }
  }
};

  function jumpToScene(targetTime) {
    currentTime = targetTime;
    if (uploadedAudioElement) {
      try { uploadedAudioElement.currentTime = targetTime; } catch(e) {}
    }
    resetSfxFlags();
    updateUI();
    renderFrame(currentTime);
    if (isPlaying) triggerAudioForCurrentTime();
  }

  function updateUI() {
    const pct = (currentTime / TOTAL_DURATION) * 100;
    document.getElementById('progressFill').style.width = pct + '%';

    const curSec = Math.floor(currentTime);
    document.getElementById('currentTimeLabel').textContent = '00:' + (curSec < 10 ? '0' : '') + curSec;

    const cards = document.querySelectorAll('.scene-card');
    cards.forEach(c => c.classList.remove('active'));
    if (currentTime < 18.5) cards[0].classList.add('active');
    else if (currentTime < 32.5) cards[1].classList.add('active');
    else if (currentTime < 47.5) cards[2].classList.add('active');
    else cards[3].classList.add('active');


    const playOverlay = document.getElementById('reelPlayOverlay');
    if (playOverlay) {
      if (isPlaying) {
        if (playOverlay.style.display !== 'none') playOverlay.style.display = 'none';
      } else {
        if (playOverlay.style.display !== 'flex') playOverlay.style.display = 'flex';
        const playCircle = playOverlay.querySelector('.reel-play-circle');
        const playTitle = playOverlay.querySelector('.reel-play-title');
        const playSub = playOverlay.querySelector('.reel-play-sub');
        const playBadge = playOverlay.querySelector('.reel-play-badge');
        if (currentTime <= 0.05) {
          playOverlay.classList.remove('mid-pause');
          if (playCircle) playCircle.style.display = 'none';
          if (playTitle) playTitle.style.display = 'none';
          if (playSub) playSub.style.display = 'none';
          if (playBadge) playBadge.style.display = 'none';
        } else {
          playOverlay.classList.add('mid-pause');
          if (playCircle) playCircle.style.display = 'flex';
          if (playTitle) playTitle.style.display = 'block';
          if (playSub) playSub.style.display = 'block';
          if (playBadge) playBadge.style.display = 'inline-flex';
        }
      }
    }

    // Update Mic Teleprompter
    const cue = SCRIPT_CUES.find(c => currentTime >= c.start && currentTime <= c.end);
    if (cue) {
      document.getElementById('micTeleprompter').textContent = \`"\${cue.text}"\`;
    }
  }`;

const newBlock = `function resetSfxFlags() {
  playedLaserSfx = false;
  playedSubdropSfx = false;
  playedPhoneSfx = false;
  playedIosPingSfx = false;
}

function togglePlay() {
  const videoEl = document.getElementById('masterMp4Player');
  const isVideoView = videoEl && videoEl.style.display === 'block';

  if (isVideoView) {
    if (videoEl.paused) {
      videoEl.play().catch(e => console.warn('Video play blocked:', e));
    } else {
      videoEl.pause();
    }
    return;
  }

  initAudioGraph();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  isPlaying = !isPlaying;
  window.isPlaying = isPlaying;
  window.currentTime = currentTime;
  const btn = document.getElementById('btnPlayPause');
  const playOverlay = document.getElementById('reelPlayOverlay');
  const recText = document.getElementById('recText');
  const recPill = document.getElementById('recStatusPill');

  if (isPlaying) {
    if (btn) btn.innerHTML = '<span>⏸️</span> Pause Reel';
    if (playOverlay) playOverlay.style.display = 'none';
    if (recText) recText.textContent = 'PLAYING';
    if (recPill) {
      recPill.style.color = '#10b981';
      recPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    }
    startBackgroundBeat();
    triggerAudioForCurrentTime();
  } else {
    if (btn) btn.innerHTML = '<span>▶️</span> Play &amp; Preview Reel (With Studio Audio)';
    if (playOverlay) playOverlay.style.display = 'flex';
    if (recText) recText.textContent = 'READY';
    if (recPill) {
      recPill.style.color = '#ef4444';
      recPill.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    }
    stopBackgroundBeat();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (uploadedAudioElement) uploadedAudioElement.pause();
  }
}

window.switchStageView = function(view) {
  const canvasEl = document.getElementById('reelCanvas');
  const videoEl = document.getElementById('masterMp4Player');
  const btnC = document.getElementById('btnViewCanvas');
  const btnV = document.getElementById('btnViewVideo');
  const playOverlay = document.getElementById('reelPlayOverlay');
  const btnPlay = document.getElementById('btnPlayPause');

  if (view === 'video') {
    if (isPlaying) {
      togglePlay();
    }
    if (canvasEl) canvasEl.style.display = 'none';
    if (playOverlay) playOverlay.style.display = 'none';
    if (videoEl) {
      videoEl.style.display = 'block';
      videoEl.currentTime = currentTime || 0;
      videoEl.play().catch(e => console.log('Autoplay deferred:', e));
      if (btnPlay) {
        btnPlay.innerHTML = videoEl.paused ? '<span>▶️</span> Play Master MP4' : '<span>⏸️</span> Pause Master MP4';
      }
    }
    if (btnV) {
      btnV.style.background = 'rgba(245,158,11,0.9)';
      btnV.style.color = '#0b0f19';
      btnV.style.fontWeight = '800';
    }
    if (btnC) {
      btnC.style.background = 'rgba(255,255,255,0.15)';
      btnC.style.color = '#ffffff';
      btnC.style.fontWeight = '600';
    }
  } else {
    if (videoEl) {
      currentTime = videoEl.currentTime || 0;
      videoEl.pause();
      videoEl.style.display = 'none';
    }
    if (canvasEl) canvasEl.style.display = 'block';
    if (!isPlaying && playOverlay) {
      playOverlay.style.display = 'flex';
    }
    if (btnPlay) {
      btnPlay.innerHTML = isPlaying ? '<span>⏸️</span> Pause Reel' : '<span>▶️</span> Play &amp; Preview Reel (With Studio Audio)';
    }
    if (btnC) {
      btnC.style.background = 'rgba(245,158,11,0.9)';
      btnC.style.color = '#0b0f19';
      btnC.style.fontWeight = '800';
    }
    if (btnV) {
      btnV.style.background = 'rgba(255,255,255,0.15)';
      btnV.style.color = '#ffffff';
      btnV.style.fontWeight = '600';
    }
  }
};

  function jumpToScene(targetTime) {
    currentTime = targetTime;
    const videoEl = document.getElementById('masterMp4Player');
    if (videoEl && videoEl.style.display === 'block') {
      try { videoEl.currentTime = targetTime; } catch(e) {}
    }
    if (uploadedAudioElement) {
      try { uploadedAudioElement.currentTime = targetTime; } catch(e) {}
    }
    resetSfxFlags();
    updateUI();
    renderFrame(currentTime);
    if (isPlaying) triggerAudioForCurrentTime();
  }

  function updateUI() {
    const videoEl = document.getElementById('masterMp4Player');
    const isVideoView = videoEl && videoEl.style.display === 'block';

    const pct = (currentTime / TOTAL_DURATION) * 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = pct + '%';

    const curSec = Math.floor(currentTime);
    const label = document.getElementById('currentTimeLabel');
    if (label) label.textContent = '00:' + (curSec < 10 ? '0' : '') + curSec;

    const cards = document.querySelectorAll('.scene-card');
    cards.forEach(c => c.classList.remove('active'));
    if (currentTime < 18.5 && cards[0]) cards[0].classList.add('active');
    else if (currentTime < 32.5 && cards[1]) cards[1].classList.add('active');
    else if (currentTime < 47.5 && cards[2]) cards[2].classList.add('active');
    else if (cards[3]) cards[3].classList.add('active');

    const playOverlay = document.getElementById('reelPlayOverlay');
    if (playOverlay) {
      if (isPlaying || isVideoView) {
        if (playOverlay.style.display !== 'none') playOverlay.style.display = 'none';
      } else {
        if (playOverlay.style.display !== 'flex') playOverlay.style.display = 'flex';
        const playCircle = playOverlay.querySelector('.reel-play-circle');
        const playTitle = playOverlay.querySelector('.reel-play-title');
        const playSub = playOverlay.querySelector('.reel-play-sub');
        const playBadge = playOverlay.querySelector('.reel-play-badge');
        if (playCircle) playCircle.style.display = 'flex';
        if (playTitle) playTitle.style.display = 'block';
        if (playSub) playSub.style.display = 'block';
        if (playBadge) playBadge.style.display = 'inline-flex';
        if (currentTime <= 0.05) {
          playOverlay.classList.remove('mid-pause');
        } else {
          playOverlay.classList.add('mid-pause');
        }
      }
    }

    // Update Mic Teleprompter
    const cues = (window.ACTIVE_SCRIPT_CUES && window.ACTIVE_SCRIPT_CUES.length > 0) ? window.ACTIVE_SCRIPT_CUES : (window.SCRIPT_CUES || SCRIPT_CUES);
    const cue = cues ? cues.find(c => currentTime >= c.start && currentTime <= c.end) : null;
    if (cue) {
      const mic = document.getElementById('micTeleprompter');
      if (mic) mic.textContent = \`"\${cue.text}"\`;
    }
  }`;

if (!content.includes(oldBlock)) {
  console.error('ERROR: oldBlock not found in content!');
  process.exit(1);
}

content = content.replace(oldBlock, newBlock);
console.log('Successfully replaced playback functions.');

// 2. Add video event listeners and scrubber update
const oldScrubber = `  // Scrubber Click
  document.getElementById('progressTrack').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    currentTime = pos * TOTAL_DURATION;
    resetSfxFlags();
    updateUI();
    renderFrame(currentTime);
  });`;

const newScrubber = `  // Scrubber Click
  document.getElementById('progressTrack').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    currentTime = pos * TOTAL_DURATION;
    const videoEl = document.getElementById('masterMp4Player');
    if (videoEl && videoEl.style.display === 'block') {
      try { videoEl.currentTime = currentTime; } catch(e) {}
    }
    if (uploadedAudioElement) {
      try { uploadedAudioElement.currentTime = currentTime; } catch(e) {}
    }
    resetSfxFlags();
    updateUI();
    renderFrame(currentTime);
  });

  // Master MP4 video listeners for seamless UI sync
  const masterVideo = document.getElementById('masterMp4Player');
  if (masterVideo) {
    masterVideo.addEventListener('play', () => {
      const btn = document.getElementById('btnPlayPause');
      if (btn) btn.innerHTML = '<span>⏸️</span> Pause Master MP4';
      const recText = document.getElementById('recText');
      const recPill = document.getElementById('recStatusPill');
      if (recText) recText.textContent = 'PLAYING MP4';
      if (recPill) {
        recPill.style.color = '#10b981';
        recPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      }
    });
    masterVideo.addEventListener('pause', () => {
      const btn = document.getElementById('btnPlayPause');
      if (btn) btn.innerHTML = '<span>▶️</span> Play Master MP4';
      const recText = document.getElementById('recText');
      const recPill = document.getElementById('recStatusPill');
      if (recText) recText.textContent = 'READY';
      if (recPill) {
        recPill.style.color = '#ef4444';
        recPill.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      }
    });
    masterVideo.addEventListener('timeupdate', () => {
      if (masterVideo.style.display === 'block') {
        currentTime = masterVideo.currentTime || 0;
        const dur = masterVideo.duration || TOTAL_DURATION || 63;
        const pct = (currentTime / dur) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) progressFill.style.width = pct + '%';
        const curSec = Math.floor(currentTime);
        const label = document.getElementById('currentTimeLabel');
        if (label) label.textContent = '00:' + (curSec < 10 ? '0' : '') + curSec;

        const cards = document.querySelectorAll('.scene-card');
        cards.forEach(c => c.classList.remove('active'));
        if (currentTime < 18.5 && cards[0]) cards[0].classList.add('active');
        else if (currentTime < 32.5 && cards[1]) cards[1].classList.add('active');
        else if (currentTime < 47.5 && cards[2]) cards[2].classList.add('active');
        else if (cards[3]) cards[3].classList.add('active');
      }
    });
  }`;

if (content.includes(oldScrubber)) {
  content = content.replace(oldScrubber, newScrubber);
  console.log('Successfully upgraded scrubber and masterVideo listeners.');
} else {
  console.warn('WARNING: oldScrubber not matched.');
}

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Saved patched reel-creator.html.');
