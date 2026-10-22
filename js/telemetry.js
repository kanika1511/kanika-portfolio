/**
 * Live Interactive Simulators:
 * 1. ReachInbox Queue Telemetry Real-time SVG Graph & Worker Controls
 * 2. MeetMe Pre-Flight Hardware Check (Microphone VU meter, camera simulator, blur toggle)
 * Author: Kanika Sangwan
 */

document.addEventListener('DOMContentLoaded', () => {
  initReachInboxTelemetry();
  initMeetMeHardwareCheck();
});

/* ==========================================================================
   REACHINBOX LIVE TELEMETRY SIMULATOR
   ========================================================================== */
function initReachInboxTelemetry() {
  const chartSvg = document.getElementById('telemetry-svg-chart');
  const countActive = document.getElementById('tele-active-count');
  const countDelayed = document.getElementById('tele-delayed-count');
  const countFailed = document.getElementById('tele-failed-count');
  const btnBurst = document.getElementById('btn-tele-burst');
  const btnReset = document.getElementById('btn-tele-reset');

  if (!chartSvg) return;

  let points = [35, 42, 38, 55, 48, 62, 58, 70, 65, 80, 75, 85, 90, 84, 95];
  let activeWorkers = 1420;
  let delayedJobs = 48;
  let failedJobs = 2;
  let isBursting = false;

  function renderChart() {
    const width = 380;
    const height = 110;
    const maxVal = Math.max(...points, 120);
    const minVal = 0;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - minVal) / (maxVal - minVal)) * (height - 18) - 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathD = `M ${coords.join(' L ')}`;
    const areaD = `M 0,${height} L ${coords.join(' L ')} L ${width},${height} Z`;

    chartSvg.innerHTML = `
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.45" />
          <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#chartGrad)" />
      <path d="${pathD}" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${coords[coords.length - 1].split(',')[0]}" cy="${coords[coords.length - 1].split(',')[1]}" r="4" fill="#10b981" />
    `;
  }

  // Periodic subtle tick for live feeling
  setInterval(() => {
    if (!isBursting) {
      const last = points[points.length - 1];
      const delta = (Math.random() - 0.48) * 12;
      const nextVal = Math.max(30, Math.min(105, last + delta));
      points.shift();
      points.push(nextVal);
      renderChart();

      if (countActive) countActive.textContent = (activeWorkers + Math.floor(Math.random() * 20 - 10)).toLocaleString();
    }
  }, 1600);

  if (btnBurst) {
    btnBurst.addEventListener('click', () => {
      if (window.soundSystem) window.soundSystem.playPop();
      isBursting = true;
      btnBurst.textContent = '⚡ Bursting...';
      btnBurst.disabled = true;

      // Spike simulation
      points = [45, 60, 95, 140, 185, 230, 210, 190, 160, 130, 105, 90, 85];
      activeWorkers = 5480;
      delayedJobs = 184;
      failedJobs = 6;

      if (countActive) countActive.textContent = '5,480';
      if (countDelayed) countDelayed.textContent = '184';
      if (countFailed) countFailed.textContent = '6';
      renderChart();

      if (window.showToast) window.showToast('Simulated 10,000 batch emails queued with Redis BullMQ!');

      setTimeout(() => {
        isBursting = false;
        btnBurst.textContent = '⚡ Simulate Burst (10k)';
        btnBurst.disabled = false;
      }, 3500);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (window.soundSystem) window.soundSystem.playClick();
      points = [35, 42, 38, 55, 48, 62, 58, 70, 65, 80, 75, 85, 90, 84, 95];
      activeWorkers = 1420;
      delayedJobs = 12;
      failedJobs = 0;
      if (countActive) countActive.textContent = '1,420';
      if (countDelayed) countDelayed.textContent = '12';
      if (countFailed) countFailed.textContent = '0';
      renderChart();
      if (window.showToast) window.showToast('Telemetry queue stabilized & retries flushed.');
    });
  }

  renderChart();
}

/* ==========================================================================
   MEETME PRE-FLIGHT HARDWARE CHECK
   ========================================================================== */
function initMeetMeHardwareCheck() {
  const micBars = document.querySelectorAll('.mic-bar');
  const btnToggleMic = document.getElementById('btn-test-mic');
  const btnToggleCam = document.getElementById('btn-test-cam');
  const btnToggleBlur = document.getElementById('btn-test-blur');
  const camVideoSim = document.getElementById('cam-sim-video');
  const btnTestSound = document.getElementById('btn-test-audio-out');

  let micActive = true;
  let camActive = true;
  let blurActive = false;

  // VU meter animation loop
  setInterval(() => {
    if (!micActive || micBars.length === 0) {
      micBars.forEach(b => {
        b.style.height = '6px';
        b.classList.remove('active');
      });
      return;
    }

    // Dynamic wave
    const baseEnergy = Math.random();
    micBars.forEach((bar, idx) => {
      const factor = Math.sin(idx * 0.4 + Date.now() * 0.005) * 0.5 + 0.5;
      const height = Math.floor(6 + factor * 22 * baseEnergy);
      bar.style.height = `${height}px`;
      if (height > 14) {
        bar.classList.add('active');
      } else {
        bar.classList.remove('active');
      }
    });
  }, 100);

  if (btnToggleMic) {
    btnToggleMic.addEventListener('click', () => {
      if (window.soundSystem) window.soundSystem.playClick();
      micActive = !micActive;
      btnToggleMic.innerHTML = micActive 
        ? '<span>🎙️ Mic: ON</span>' 
        : '<span style="color: var(--accent-rose);">🔇 Mic: OFF</span>';
      if (window.showToast) window.showToast(`Microphone input ${micActive ? 'Active' : 'Muted'}`);
    });
  }

  if (btnToggleCam && camVideoSim) {
    btnToggleCam.addEventListener('click', () => {
      if (window.soundSystem) window.soundSystem.playClick();
      camActive = !camActive;
      if (camActive) {
        camVideoSim.style.opacity = '1';
        btnToggleCam.innerHTML = '<span>📹 Camera: ON</span>';
      } else {
        camVideoSim.style.opacity = '0.05';
        btnToggleCam.innerHTML = '<span style="color: var(--accent-rose);">🚫 Camera: OFF</span>';
      }
      if (window.showToast) window.showToast(`Camera feed ${camActive ? 'Activated' : 'Disabled'}`);
    });
  }

  if (btnToggleBlur && camVideoSim) {
    btnToggleBlur.addEventListener('click', () => {
      if (window.soundSystem) window.soundSystem.playPop();
      blurActive = !blurActive;
      camVideoSim.style.filter = blurActive ? 'blur(16px)' : 'none';
      btnToggleBlur.textContent = blurActive ? '✨ Background Blur: ON' : '✨ Background Blur: OFF';
      if (window.showToast) window.showToast(`Background Blur ${blurActive ? 'Enabled (GPU Shaders)' : 'Disabled'}`);
    });
  }

  if (btnTestSound) {
    btnTestSound.addEventListener('click', () => {
      if (window.soundSystem) {
        window.soundSystem.playSuccess();
        if (window.showToast) window.showToast('Playing stereo audio output verification chime...');
      }
    });
  }
}
