/**
 * Interactive Design System Sandbox & WCAG Contrast Calculator
 * Author: Kanika Sangwan
 */

document.addEventListener('DOMContentLoaded', () => {
  initContrastCalculator();
  initComponentSandbox();
  initTokenCopier();
  initSandboxTabs();
});

/* --- Sandbox Navigation Tabs --- */
function initSandboxTabs() {
  const tabs = document.querySelectorAll('.sandbox-tab-btn');
  const panels = document.querySelectorAll('.sandbox-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (window.soundSystem) window.soundSystem.playClick();
      const targetId = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* --- WCAG Contrast Ratio Calculator --- */
function initContrastCalculator() {
  const fgColorInput = document.getElementById('fg-color-picker');
  const fgHexInput = document.getElementById('fg-hex-input');
  const bgColorInput = document.getElementById('bg-color-picker');
  const bgHexInput = document.getElementById('bg-hex-input');

  const previewCard = document.getElementById('contrast-preview-card');
  const scoreDisplay = document.getElementById('contrast-score-val');
  const badgeNormalAA = document.getElementById('badge-normal-aa');
  const badgeNormalAAA = document.getElementById('badge-normal-aaa');
  const badgeLargeAA = document.getElementById('badge-large-aa');
  const badgeUiAA = document.getElementById('badge-ui-aa');

  if (!fgColorInput || !bgColorInput || !scoreDisplay) return;

  function updateContrast() {
    const fg = fgColorInput.value;
    const bg = bgColorInput.value;

    fgHexInput.value = fg.toUpperCase();
    bgHexInput.value = bg.toUpperCase();

    // Update preview card styles
    if (previewCard) {
      previewCard.style.backgroundColor = bg;
      previewCard.style.color = fg;
      previewCard.style.borderColor = fg + '33';
    }

    const ratio = calculateContrastRatio(fg, bg);
    scoreDisplay.textContent = `${ratio.toFixed(2)}:1`;

    // Normal Text AA (>= 4.5:1)
    updateBadge(badgeNormalAA, ratio >= 4.5, 'Normal Text AA (4.5:1)');

    // Normal Text AAA (>= 7.0:1)
    updateBadge(badgeNormalAAA, ratio >= 7.0, 'Normal Text AAA (7:1)');

    // Large Text AA (>= 3.0:1)
    updateBadge(badgeLargeAA, ratio >= 3.0, 'Large Text AA (3:1)');

    // UI Components (>= 3.0:1)
    updateBadge(badgeUiAA, ratio >= 3.0, 'UI Controls AA (3:1)');
  }

  function updateBadge(el, isPass, label) {
    if (!el) return;
    el.className = `wcag-badge ${isPass ? 'pass' : 'fail'}`;
    el.textContent = `${isPass ? '✓ PASS' : '✗ FAIL'}: ${label}`;
  }

  fgColorInput.addEventListener('input', () => {
    updateContrast();
  });

  bgColorInput.addEventListener('input', () => {
    updateContrast();
  });

  fgHexInput.addEventListener('change', () => {
    if (/^#[0-9A-F]{6}$/i.test(fgHexInput.value)) {
      fgColorInput.value = fgHexInput.value;
      updateContrast();
    }
  });

  bgHexInput.addEventListener('change', () => {
    if (/^#[0-9A-F]{6}$/i.test(bgHexInput.value)) {
      bgColorInput.value = bgHexInput.value;
      updateContrast();
    }
  });

  // Run on initial load
  updateContrast();
}

// Convert Hex to relative luminance using WCAG formula
function getLuminance(hex) {
  let c = hex.substring(1);
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const rgb = [
    parseInt(c.substr(0, 2), 16) / 255,
    parseInt(c.substr(2, 2), 16) / 255,
    parseInt(c.substr(4, 2), 16) / 255
  ];

  const linearRGB = rgb.map(val => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * linearRGB[0] + 0.7152 * linearRGB[1] + 0.0722 * linearRGB[2];
}

function calculateContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/* --- Interactive Component Sandbox --- */
function initComponentSandbox() {
  const radiusSlider = document.getElementById('sandbox-radius-slider');
  const radiusVal = document.getElementById('sandbox-radius-val');
  const demoTargetBox = document.getElementById('sandbox-demo-surface');

  if (radiusSlider && demoTargetBox) {
    radiusSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      if (radiusVal) radiusVal.textContent = `${val}px`;
      demoTargetBox.style.borderRadius = `${val}px`;
      demoTargetBox.querySelectorAll('button').forEach(btn => {
        btn.style.borderRadius = `${val}px`;
      });
    });
  }

  // Elevation depth slider
  const elevationSlider = document.getElementById('sandbox-elevation-slider');
  const elevationVal = document.getElementById('sandbox-elevation-val');

  if (elevationSlider && demoTargetBox) {
    elevationSlider.addEventListener('input', (e) => {
      const level = parseInt(e.target.value, 10);
      if (elevationVal) elevationVal.textContent = `Level ${level}`;

      const shadows = [
        'none',
        '0 2px 4px rgba(0,0,0,0.2)',
        '0 6px 16px rgba(0,0,0,0.3)',
        '0 12px 32px rgba(0,0,0,0.4)',
        '0 20px 48px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.25)'
      ];
      demoTargetBox.style.boxShadow = shadows[level] || shadows[2];
    });
  }

  // Interactive Button Feedback in Sandbox
  const sandboxTestBtns = document.querySelectorAll('.sandbox-test-btn');
  sandboxTestBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.soundSystem) window.soundSystem.playPop();
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>✓ Done</span>';
      btn.style.borderColor = 'var(--accent-emerald)';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.borderColor = '';
      }, 1200);
    });
  });
}

/* --- Token Copier --- */
function initTokenCopier() {
  const chips = document.querySelectorAll('.token-copy-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const token = chip.getAttribute('data-token');
      if (!token) return;

      navigator.clipboard.writeText(`var(${token})`).then(() => {
        if (window.soundSystem) window.soundSystem.playSuccess();
        showToast(`Copied ${token} to clipboard!`);
      }).catch(() => {
        showToast(`Token: ${token}`);
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color: var(--accent-emerald); font-weight: bold;">✦</span> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

window.showToast = showToast;
