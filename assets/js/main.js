/* ==========================================================================
   STRUCTURA BUILDERS — Shared Global JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initColorTheme();
  initDirectionTheme();
  initStickyHeader();
  initMobileNav();
  initScrollReveal();
  initBeforeAfterSliders();
  initFoldingPanels();
  initServicesSubnav();
  initBackToTop();
});

/**
 * Light / Dark Color Theme Toggle
 */
function initColorTheme() {
  const STORAGE_KEY = 'structura_theme';
  const saved = localStorage.getItem(STORAGE_KEY);
  const initialTheme = saved === 'dark' ? 'dark' : 'light';

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars';
      }
    });
  };

  applyTheme(initialTheme);

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
}

/**
 * RTL / LTR Theme Toggle & Bootstrap RTL Stylesheet Sync
 */
function initDirectionTheme() {
  const STORAGE_KEY = 'structura_dir';
  const params = new URLSearchParams(window.location.search);
  const urlDir = params.get('dir');
  const savedDir = localStorage.getItem(STORAGE_KEY);
  const initialDir = (urlDir === 'rtl' || urlDir === 'ltr')
    ? urlDir
    : (savedDir === 'rtl' ? 'rtl' : 'ltr');

  const applyDirection = (dir) => {
    const isRtl = dir === 'rtl';
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);

    // Swap Bootstrap 5 CSS between LTR and RTL builds
    const bsLink = document.querySelector('link[href*="bootstrap"][href$=".min.css"]');
    if (bsLink) {
      const currentHref = bsLink.getAttribute('href');
      const targetHref = isRtl
        ? currentHref.replace('bootstrap.min.css', 'bootstrap.rtl.min.css')
        : currentHref.replace('bootstrap.rtl.min.css', 'bootstrap.min.css');
      if (targetHref !== currentHref) {
        bsLink.setAttribute('href', targetHref);
      }
    }

    document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', isRtl ? 'true' : 'false');
      const labelEl = btn.querySelector('.rtl-label');
      if (labelEl) {
        labelEl.textContent = isRtl ? 'LTR' : 'RTL';
      }
      btn.setAttribute('title', isRtl ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
    });
  };

  applyDirection(initialDir);

  document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
      applyDirection(current === 'rtl' ? 'ltr' : 'rtl');
    });
  });
}

/**
 * Sticky Header Shadow on Scroll
 */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const updateHeader = () => {
    if (window.scrollY > 18) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/**
 * Responsive Mobile Navigation Drawer
 */
function initMobileNav() {
  const openBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');

  if (!openBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.classList.add('nav-open');
    openBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    if (closeBtn) closeBtn.focus();
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    openBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  };

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Close on link selection
  const navLinks = drawer.querySelectorAll('a');
  navLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
      openBtn.focus();
    }
  });
}

/**
 * Scroll-Triggered Reveal Animations
 */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/**
 * Interactive Before & After Comparison Sliders (Mouse + Touch + Keyboard)
 */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('[data-ba-slider]');
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const beforeWrap = slider.querySelector('.ba-before-wrap');
    const divider = slider.querySelector('.ba-divider');
    const handle = slider.querySelector('.ba-handle');
    if (!beforeWrap || !divider) return;

    let currentPct = 50;
    let isDragging = false;

    const setPosition = (pct) => {
      const clamped = Math.max(4, Math.min(96, pct));
      currentPct = clamped;
      beforeWrap.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      divider.style.left = `${clamped}%`;
      if (handle) {
        handle.setAttribute('aria-valuenow', Math.round(clamped));
      }
    };

    const updateFromClientX = (clientX) => {
      const rect = slider.getBoundingClientRect();
      if (!rect.width) return;
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setPosition(pct);
    };

    const onPointerDown = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromClientX(clientX);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromClientX(clientX);
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    slider.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    slider.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    if (handle) {
      handle.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setPosition(currentPct - 4);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setPosition(currentPct + 4);
        }
      });
    }

    setPosition(50);
  });
}

/**
 * Interactive Horizontal/Vertical Folding Panels
 */
function initFoldingPanels() {
  const stages = document.querySelectorAll('[data-folding-stage]');
  if (!stages.length) return;

  stages.forEach((stage) => {
    const panels = Array.from(stage.querySelectorAll('[data-folding-panel]'));
    if (!panels.length) return;

    const expandPanel = (target) => {
      panels.forEach((p) => p.classList.toggle('is-expanded', p === target));
    };

    panels.forEach((panel) => {
      panel.addEventListener('click', () => expandPanel(panel));
      panel.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 992) expandPanel(panel);
      });
      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          expandPanel(panel);
        }
      });
    });
  });
}

/**
 * Sticky Services Sub-Navigation Scroll-Spy
 */
function initServicesSubnav() {
  const subnav = document.getElementById('servicesSubnav');
  if (!subnav) return;

  const links = Array.from(subnav.querySelectorAll('.services-subnav-link'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const isMatch = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-28% 0px -55% 0px', threshold: 0.05 }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/**
 * Floating Back to Top Icon Button (visible across all sections on scroll)
 */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle('is-visible', window.scrollY > 280);
  };

  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
