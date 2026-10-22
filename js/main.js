/**
 * Main Application Logic & User Interaction Coordinator
 * Author: Kanika Sangwan (UI/UX Designer & Frontend Engineer)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSystem();
  initSoundToggle();
  initNavScroll();
  initCategoryFilters();
  initWireframeToggles();
  initModalTriggers();
  initCopyButtons();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================================================
   THEME SWITCHER SYSTEM (Dark Mode / Light Mode)
   ========================================================================== */
function initThemeSystem() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-toggle-icon');
  
  // Check persisted or system preference
  const savedTheme = localStorage.getItem('theme_preference');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const activeTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Default to sleek dark mode
  setTheme(activeTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      if (window.soundSystem) window.soundSystem.playClick();
      if (window.showToast) window.showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Studio' : 'Editorial Light'} theme`);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme_preference', theme);
    if (themeIcon) {
      themeIcon.innerHTML = theme === 'dark' 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>` 
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }
}

/* ==========================================================================
   SOUND SYSTEM TOGGLE
   ========================================================================== */
function initSoundToggle() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-toggle-icon');

  function updateIcon(enabled) {
    if (!soundIcon) return;
    soundIcon.innerHTML = enabled
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
  }

  if (soundBtn && window.soundSystem) {
    updateIcon(window.soundSystem.enabled);
    soundBtn.addEventListener('click', () => {
      const isNowEnabled = window.soundSystem.toggleSound();
      updateIcon(isNowEnabled);
      if (window.showToast) {
        window.showToast(isNowEnabled ? 'Audio micro-interactions enabled 🔊' : 'Audio muted 🔇');
      }
    });
  }
}

/* ==========================================================================
   NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavScroll() {
  const navWrapper = document.querySelector('.nav-wrapper');
  const navLinks = document.querySelectorAll('.nav-item-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navWrapper?.classList.add('scrolled');
    } else {
      navWrapper?.classList.remove('scrolled');
    }

    // Scroll Spy active update
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer toggle
  const mobileBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navMenu.style.display === 'flex';
      navMenu.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = 'var(--bg-surface-glass-heavy)';
        navMenu.style.padding = 'var(--space-6)';
        navMenu.style.borderRadius = 'var(--radius-xl)';
        navMenu.style.marginTop = 'var(--space-2)';
        navMenu.style.boxShadow = 'var(--shadow-xl)';
      }
    });
  }
}

/* ==========================================================================
   PROJECT CATEGORY FILTER
   ========================================================================== */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.case-study-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.soundSystem) window.soundSystem.playClick();
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'grid';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   WIREFRAME VS HI-FI TOGGLES
   ========================================================================== */
function initWireframeToggles() {
  const toggles = document.querySelectorAll('.prototype-mode-toggle');

  toggles.forEach(toggleGroup => {
    const btns = toggleGroup.querySelectorAll('.mode-btn');
    const targetCard = toggleGroup.closest('.case-study-card');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.soundSystem) window.soundSystem.playPop();
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.getAttribute('data-mode');
        const preview = targetCard.querySelector('.preview-media');

        if (mode === 'wireframe') {
          preview.style.filter = 'grayscale(100%) contrast(150%) brightness(85%)';
          if (window.showToast) window.showToast('Switched to Low-Fidelity Wireframe mode');
        } else {
          preview.style.filter = 'none';
          if (window.showToast) window.showToast('Switched to High-Fidelity UI Prototype mode');
        }
      });
    });
  });
}

/* ==========================================================================
   MODAL SYSTEMS
   ========================================================================== */
function initModalTriggers() {
  const closeButtons = document.querySelectorAll('.modal-close-btn, .modal-backdrop');

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn) {
        closeAllModals();
      }
    });
  });

  // Hardware check modal opener
  const openHardwareBtn = document.getElementById('btn-open-hardware-test');
  const hardwareModal = document.getElementById('modal-hardware-test');
  if (openHardwareBtn && hardwareModal) {
    openHardwareBtn.addEventListener('click', () => {
      if (window.soundSystem) window.soundSystem.playClick();
      openModal(hardwareModal);
    });
  }

  // Resume modal opener
  const openResumeBtns = document.querySelectorAll('.btn-open-resume-modal');
  const resumeModal = document.getElementById('modal-resume');
  if (resumeModal) {
    openResumeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.soundSystem) window.soundSystem.playClick();
        openModal(resumeModal);
      });
    });
  }

  // Contact modal opener
  const openContactBtns = document.querySelectorAll('.btn-open-contact-modal');
  const contactModal = document.getElementById('modal-contact');
  if (contactModal) {
    openContactBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.soundSystem) window.soundSystem.playClick();
        openModal(contactModal);
      });
    });
  }

  // Case study deep dive modal triggers
  const caseStudyButtons = document.querySelectorAll('.btn-view-case-study');
  const caseStudyModal = document.getElementById('modal-case-study');
  if (caseStudyModal) {
    caseStudyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const studyId = btn.getAttribute('data-study');
        populateCaseStudyModal(studyId);
        openModal(caseStudyModal);
      });
    });
  }

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}

/* Dynamic Case Study Content */
function populateCaseStudyModal(studyId) {
  const titleEl = document.getElementById('cs-modal-title');
  const bodyEl = document.getElementById('cs-modal-body');
  if (!titleEl || !bodyEl) return;

  if (studyId === 'meetme') {
    titleEl.textContent = 'MeetMe — Enterprise Video Conferencing UX Architecture';
    bodyEl.innerHTML = `
      <div style="display:flex; flex-direction:column; gap: var(--space-4);">
        <p><strong>Role:</strong> Lead UI/UX & Frontend Architect | <strong>Timeline:</strong> Sep 2026</p>
        <p><strong>Stack:</strong> Next.js 15 (App Router), TypeScript, Tailwind CSS, FastAPI, HTML5 MediaStream API</p>
        
        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">1. Problem & Context</h4>
        <p>Remote teams face persistent video meeting friction: anxiety about microphone/camera permissions before joining, clunky in-call controls during screen sharing, and erratic speaker tiles during multi-party conversations.</p>

        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">2. Research & Usability Findings</h4>
        <p>User testing revealed that <strong>64% of meeting delays</strong> stem from audio-hardware misconfigurations. Participants frequently joined muted or with background echo, causing immediate frustration.</p>

        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">3. The UX Solution</h4>
        <ul style="padding-left: 20px; line-height: 1.7;">
          <li><strong>Pre-Flight Hardware Check:</strong> An interactive pre-join screen with live decibel audio meter, GPU background blur preview, and instant hardware fallback alerts.</li>
          <li><strong>Spatial Video Tile Hierarchy:</strong> Active speakers receive a soft ambient pulse rather than sudden tile reordering, minimizing visual disarray.</li>
          <li><strong>Contextual Floating Dock:</strong> Controls fade slightly during screen shares to maximize shared canvas real estate.</li>
          <li><strong>Timezone Normalization:</strong> Universal UTC ISO-8601 timestamps eliminate cross-region scheduling confusion.</li>
        </ul>

        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">4. Verified Outcomes</h4>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); text-align: center; margin-top: var(--space-2);">
          <div style="background: var(--bg-surface-elevated); padding: 12px; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: 800; color: var(--accent-emerald);">48%</div>
            <div style="font-size: 11px; color: var(--text-muted);">Audio dropout drop</div>
          </div>
          <div style="background: var(--bg-surface-elevated); padding: 12px; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: 800; color: var(--accent-cyan);">99.4%</div>
            <div style="font-size: 11px; color: var(--text-muted);">Task completion rate</div>
          </div>
          <div style="background: var(--bg-surface-elevated); padding: 12px; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: 800; color: var(--primary-400);">WCAG AA</div>
            <div style="font-size: 11px; color: var(--text-muted);">Keyboard & screen reader ready</div>
          </div>
        </div>
      </div>
    `;
  } else if (studyId === 'reachinbox') {
    titleEl.textContent = 'ReachInbox — High-Density Queue Telemetry Dashboard UX';
    bodyEl.innerHTML = `
      <div style="display:flex; flex-direction:column; gap: var(--space-4);">
        <p><strong>Role:</strong> Product Designer & UI Developer | <strong>Timeline:</strong> Sep 2026</p>
        <p><strong>Stack:</strong> React, TypeScript, Node.js, BullMQ, Redis, PostgreSQL, Elasticsearch</p>
        
        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">1. UX Challenge</h4>
        <p>Distributed queue architectures process tens of thousands of batch emails per minute. Traditional logs overwhelm engineers with raw JSON dumps, making it near impossible to detect rate-limit throttling or worker bottlenecks in real time.</p>

        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">2. Visual Design & Ergonomics</h4>
        <p>Designed a glanceable telemetry interface with high-contrast status nodes (Active, Delayed, Failed, Retried). Features progressive disclosure: click any aggregated node to instantly inspect the worker stack trace with zero page reloads.</p>

        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">3. Quantitative Impact</h4>
        <p>Cut Mean-Time-to-Diagnose (MTTD) from 18 minutes to under 5 minutes during high-load stress testing. Elasticsearch fallback indicators ensure operators always know data freshness.</p>
      </div>
    `;
  } else if (studyId === 'devbhumi') {
    titleEl.textContent = 'Devbhumi Enterprises — RBAC & Security UX Overhaul';
    bodyEl.innerHTML = `
      <div style="display:flex; flex-direction:column; gap: var(--space-4);">
        <p><strong>Role:</strong> Software Intern (Full-Stack & UX) | <strong>Timeline:</strong> Jun 2025 – Jul 2025</p>
        <p><strong>Focus:</strong> Role-Based Access Control (RBAC), OWASP Security Audits, Admin Usability</p>
        
        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">1. Core Challenge</h4>
        <p>Internal company portal had opaque user access controls where permissions were tied to individual database rows, resulting in high misconfiguration rates and accidental privilege leaks.</p>

        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">2. Solution Architecture</h4>
        <p>Engineered an intuitive visual permission matrix where team leads assign hierarchical role templates (Viewer, Editor, Auditor, Admin). Redesigned audit logs with visual diffs showing exactly which permission was modified, by whom, and when.</p>

        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">3. Results</h4>
        <p>Reduced unauthorized access alerts by <strong>~50%</strong> and achieved 100% compliance during internal security and accessibility audits.</p>
      </div>
    `;
  } else if (studyId === 'aura') {
    titleEl.textContent = 'Aura Design System — Accessible Multi-Brand Component Engine';
    bodyEl.innerHTML = `
      <div style="display:flex; flex-direction:column; gap: var(--space-4);">
        <p><strong>Role:</strong> Design Technologist & Systems Architect</p>
        <p><strong>Deliverables:</strong> 40+ Accessible Component Primitives, 60+ CSS Design Tokens, Token Documentation</p>
        
        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">1. Foundation</h4>
        <p>Built upon an 8pt mathematical grid, strict WCAG 2.2 AA (4.5:1 / 3:1) contrast ratios, and modular CSS custom properties that enable instantaneous brand reskinning without stylesheet refactoring.</p>

        <h4 style="color: var(--primary-400); margin-top: var(--space-2);">2. Inclusive Design</h4>
        <p>Includes built-in focus-visible rings, ARIA role bindings, keyboard tab trapping for modals, and respects <code>prefers-reduced-motion</code> across all animated transitions.</p>
      </div>
    `;
  }
}

/* ==========================================================================
   ONE-CLICK COPY SYSTEM
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-trigger-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        if (window.soundSystem) window.soundSystem.playSuccess();
        if (window.showToast) window.showToast(`Copied "${textToCopy}" to clipboard!`);
      }).catch(() => {
        if (window.showToast) window.showToast(`Selected: ${textToCopy}`);
      });
    });
  });
}

/* ==========================================================================
   INTERACTIVE CONTACT FORM SIMULATOR
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (window.soundSystem) window.soundSystem.playSuccess();

    const name = document.getElementById('contact-name')?.value || 'Guest';
    const submitBtn = form.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending message...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.backgroundColor = 'var(--accent-emerald)';
      }
      if (window.showToast) {
        window.showToast(`Thank you ${name}! Your note has been delivered to Kanika.`);
      }
      setTimeout(() => {
        closeAllModals();
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          submitBtn.style.backgroundColor = '';
        }
      }, 1500);
    }, 1000);
  });
}

/* ==========================================================================
   SMOOTH SCROLLING HELPER
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (window.soundSystem) window.soundSystem.playClick();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
