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
  initJourneyAutoPulse();
});

function initJourneyAutoPulse() {
  const steps = document.querySelectorAll('.h2-journey-grid .h2-journey-step');
  if (!steps.length) return;
  let activeIdx = 0;
  let timer = null;

  const setActive = (idx) => {
    steps.forEach((step, i) => {
      step.classList.toggle('is-active', i === idx);
    });
  };

  const startCycle = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      activeIdx = (activeIdx + 1) % steps.length;
      setActive(activeIdx);
    }, 2600);
  };

  steps.forEach((step, idx) => {
    step.addEventListener('mouseenter', () => {
      if (timer) clearInterval(timer);
      activeIdx = idx;
      setActive(idx);
    });
    step.addEventListener('mouseleave', startCycle);
  });

  setActive(0);
  startCycle();
}

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

/* ==========================================================================
   MERGED FROM: home.js
   ========================================================================== */
(function () {
/* ==========================================================================
   HOME PAGE (index.html) — Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStatCounters();
  initFeaturedProjectModal();
  initTestimonialCarousel();
});

/**
 * Animated Statistics Counters (smoothly counts up from 0 whenever section enters view)
 */
function initStatCounters() {
  const statsSection = document.querySelector('.stats-strip');
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    if (el._counterRaf) {
      cancelAnimationFrame(el._counterRaf);
    }

    const duration = 1800;
    const startTime = performance.now();
    el.textContent = '0';

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        el._counterRaf = requestAnimationFrame(step);
      } else {
        el.textContent = target;
        el._counterRaf = null;
      }
    };

    el._counterRaf = requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window) || !statsSection) {
    counters.forEach(animateCounter);
    return;
  }

  let hasAnimatedVisible = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedVisible) {
          hasAnimatedVisible = true;
          counters.forEach(animateCounter);
        } else if (!entry.isIntersecting && hasAnimatedVisible) {
          hasAnimatedVisible = false;
          counters.forEach((el) => {
            if (el._counterRaf) cancelAnimationFrame(el._counterRaf);
            el.textContent = '0';
          });
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(statsSection);
}

/**
 * Featured Project Detail Modal
 */
function initFeaturedProjectModal() {
  const modalEl = document.getElementById('homeProjectModal');
  if (!modalEl || typeof bootstrap === 'undefined') return;

  const modal = new bootstrap.Modal(modalEl);
  const titleEl = document.getElementById('homeModalTitle');
  const catEl = document.getElementById('homeModalCategory');
  const locEl = document.getElementById('homeModalLocation');
  const imgEl = document.getElementById('homeModalImage');
  const descEl = document.getElementById('homeModalDesc');

  const triggers = document.querySelectorAll('[data-project-modal]');
  triggers.forEach((card) => {
    const openDetails = () => {
      if (titleEl) titleEl.textContent = card.dataset.title || '';
      if (catEl) catEl.textContent = card.dataset.category || '';
      if (locEl) locEl.textContent = card.dataset.location || '';
      if (imgEl) {
        imgEl.src = card.dataset.image || '';
        imgEl.alt = card.dataset.title || 'Project view';
      }
      if (descEl) descEl.textContent = card.dataset.desc || '';
      modal.show();
    };

    card.addEventListener('click', openDetails);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetails();
      }
    });
  });
}

/**
 * Testimonial Carousel
 */
function initTestimonialCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (!slides.length) return;

  let current = 0;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => showSlide(current - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(current + 1));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });

  showSlide(0);
}

})();

/* ==========================================================================
   MERGED FROM: home-2.js
   ========================================================================== */
(function () {
/* ==========================================================================
   HOME 2 PAGE (home-2.html) — Horizontal Gallery Controls
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHorizontalExpertiseGallery();
  initDisciplineSwitcher();
});

function initDisciplineSwitcher() {
  const tabs = Array.from(document.querySelectorAll('[data-h2-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-h2-panel]'));
  if (!tabs.length || !panels.length) return;

  const activateTab = (targetId) => {
    tabs.forEach((tab) => {
      const isMatch = tab.dataset.h2Tab === targetId;
      tab.classList.toggle('is-active', isMatch);
      tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      const isMatch = panel.dataset.h2Panel === targetId;
      panel.classList.toggle('is-active', isMatch);
      panel.hidden = !isMatch;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.h2Tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = tabs[(index + 1) % tabs.length];
        next.focus();
        activateTab(next.dataset.h2Tab);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = tabs[(index - 1 + tabs.length) % tabs.length];
        prev.focus();
        activateTab(prev.dataset.h2Tab);
      }
    });
  });
}

function initHorizontalExpertiseGallery() {
  const track = document.getElementById('expertiseTrack');
  const prevBtn = document.getElementById('expertisePrev');
  const nextBtn = document.getElementById('expertiseNext');

  if (!track || !prevBtn || !nextBtn) return;

  const getScrollStep = () => {
    const firstPanel = track.querySelector('.h2-expertise-panel');
    return firstPanel ? firstPanel.offsetWidth + 24 : 380;
  };

  prevBtn.addEventListener('click', () => {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    track.scrollBy({ left: isRtl ? getScrollStep() : -getScrollStep(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    track.scrollBy({ left: isRtl ? -getScrollStep() : getScrollStep(), behavior: 'smooth' });
  });
}

})();

/* ==========================================================================
   MERGED FROM: process.js
   ========================================================================== */
(function () {
/* ==========================================================================
   STRUCTURA BUILDERS — Engineering & Process Page Interactions
   ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // 1. Vertical Tab Portfolio Switcher
    const tabButtons = document.querySelectorAll("[data-vtab-target]");
    const tabPanels = document.querySelectorAll("[data-vtab-panel]");

    if (tabButtons.length && tabPanels.length) {
      tabButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const target = btn.getAttribute("data-vtab-target");

          tabButtons.forEach(function (b) {
            const isMatch = b === btn;
            b.classList.toggle("is-active", isMatch);
            b.setAttribute("aria-selected", isMatch ? "true" : "false");
          });

          tabPanels.forEach(function (panel) {
            const isMatch = panel.getAttribute("data-vtab-panel") === target;
            panel.classList.toggle("is-active", isMatch);
          });
        });
      });
    }

    // 2. Scroll-Driven Vertical Center-Line Timeline Animation
    const timeline = document.getElementById("vTimeline");
    const progressLine = document.getElementById("vTimelineProgress");
    const timelineItems = document.querySelectorAll(".vtimeline-item");

    if (timeline && progressLine && timelineItems.length) {
      let ticking = false;

      function updateTimelineProgress() {
        ticking = false;
        const rect = timeline.getBoundingClientRect();
        const triggerY = window.innerHeight * 0.65;
        const total = rect.height;
        const passed = triggerY - rect.top;
        const ratio = Math.max(0, Math.min(1, passed / Math.max(1, total)));

        progressLine.style.height = (ratio * 100).toFixed(2) + "%";

        timelineItems.forEach(function (item) {
          const itemRect = item.getBoundingClientRect();
          const nodeMid = itemRect.top + itemRect.height * 0.5;
          item.classList.toggle("is-reached", nodeMid <= triggerY);
        });
      }

      function onScrollOrResize() {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateTimelineProgress);
        }
      }

      window.addEventListener("scroll", onScrollOrResize, { passive: true });
      window.addEventListener("resize", onScrollOrResize, { passive: true });
      updateTimelineProgress();
    }

    // 4. Interactive Orbital Quality & Machinery Hub
    const orbitNodes = document.querySelectorAll("[data-orbit-node]");
    const hubKicker = document.getElementById("orbitHubKicker");
    const hubMetric = document.getElementById("orbitHubMetric");
    const hubTitle = document.getElementById("orbitHubTitle");
    const hubDesc = document.getElementById("orbitHubDesc");

    if (orbitNodes.length && hubMetric && hubTitle && hubDesc) {
      orbitNodes.forEach(function (node) {
        function selectOrbitNode() {
          orbitNodes.forEach(function (n) {
            n.classList.toggle("is-active", n === node);
          });
          if (hubKicker) hubKicker.textContent = node.getAttribute("data-kicker") || "";
          hubMetric.textContent = node.getAttribute("data-metric") || "";
          hubTitle.textContent = node.getAttribute("data-title") || "";
          hubDesc.textContent = node.getAttribute("data-desc") || "";
        }

        node.addEventListener("mouseenter", selectOrbitNode);
        node.addEventListener("click", selectOrbitNode);
        node.addEventListener("focusin", selectOrbitNode);
      });
    }

    // 4. 3D Layered Coverflow Showcase
    const cfSlides = document.querySelectorAll("[data-cf-slide]");
    const cfDots = document.querySelectorAll("[data-cf-dot]");
    const cfPrevBtn = document.getElementById("cfPrevBtn");
    const cfNextBtn = document.getElementById("cfNextBtn");
    const cfKicker = document.getElementById("cfKicker");
    const cfTitle = document.getElementById("cfTitle");
    const cfDesc = document.getElementById("cfDesc");
    const cfLink = document.getElementById("cfLink");
    const cfCtaText = document.getElementById("cfCtaText");

    if (cfSlides.length) {
      let current = 0;
      const total = cfSlides.length;

      function renderCoverflow() {
        cfSlides.forEach(function (slide, idx) {
          slide.classList.remove("is-active", "is-prev", "is-next", "is-far-prev", "is-far-next");
          const diff = (idx - current + total) % total;

          if (diff === 0) slide.classList.add("is-active");
          else if (diff === 1) slide.classList.add("is-next");
          else if (diff === total - 1) slide.classList.add("is-prev");
          else if (diff === 2) slide.classList.add("is-far-next");
          else if (diff === total - 2) slide.classList.add("is-far-prev");
        });

        cfDots.forEach(function (dot, idx) {
          dot.classList.toggle("is-active", idx === current);
        });

        const activeSlide = cfSlides[current];
        if (activeSlide && cfTitle && cfDesc) {
          if (cfKicker) cfKicker.textContent = activeSlide.getAttribute("data-kicker") || "";
          cfTitle.textContent = activeSlide.getAttribute("data-title") || "";
          cfDesc.textContent = activeSlide.getAttribute("data-desc") || "";
          if (cfLink) cfLink.setAttribute("href", activeSlide.getAttribute("data-href") || "#");
          if (cfCtaText) cfCtaText.textContent = activeSlide.getAttribute("data-cta") || "Explore";
        }
      }

      cfSlides.forEach(function (slide, idx) {
        slide.addEventListener("click", function () {
          if (idx !== current) {
            current = idx;
            renderCoverflow();
          }
        });
      });

      cfDots.forEach(function (dot, idx) {
        dot.addEventListener("click", function () {
          current = idx;
          renderCoverflow();
        });
      });

      if (cfPrevBtn) {
        cfPrevBtn.addEventListener("click", function () {
          current = (current - 1 + total) % total;
          renderCoverflow();
        });
      }

      if (cfNextBtn) {
        cfNextBtn.addEventListener("click", function () {
          current = (current + 1) % total;
          renderCoverflow();
        });
      }

      renderCoverflow();
    }
  });
})();

})();

/* ==========================================================================
   MERGED FROM: projects.js
   ========================================================================== */
(function () {
/* ==========================================================================
   PROJECTS PAGE (projects.html) — Category Filters, Modal & Lightbox
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProjectFilters();
  initProjectDetailModal();
  initProjectLightbox();
});

/**
 * Category Filtering
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('.project-card');
  const countEl = document.getElementById('visibleProjectCount');

  if (!filterBtns.length || !cards.length) return;

  const applyFilter = (category) => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardCat = card.dataset.category || '';
      const matches = category === 'all' || cardCat === category;
      card.classList.toggle('is-hidden', !matches);
      card.classList.remove('is-filtering-in');
      if (matches) {
        visibleCount += 1;
        void card.offsetWidth;
        card.classList.add('is-filtering-in');
      }
    });

    if (countEl) {
      countEl.textContent = `${visibleCount} Project${visibleCount === 1 ? '' : 's'} Shown`;
    }
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      applyFilter(btn.dataset.filter || 'all');
    });
  });

  applyFilter('all');
}

/**
 * Project Detail Modal
 */
function initProjectDetailModal() {
  const modalEl = document.getElementById('projectDetailModal');
  if (!modalEl || typeof bootstrap === 'undefined') return;

  const modal = new bootstrap.Modal(modalEl);
  const titleEl = document.getElementById('projModalTitle');
  const catEl = document.getElementById('projModalCategory');
  const locEl = document.getElementById('projModalLocation');
  const imgEl = document.getElementById('projModalImage');
  const descEl = document.getElementById('projModalDesc');
  const scopeEl = document.getElementById('projModalScope');

  const triggers = document.querySelectorAll('[data-open-detail]');
  triggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const source = btn.closest('[data-project-item]') || btn;
      if (titleEl) titleEl.textContent = source.dataset.title || '';
      if (catEl) catEl.textContent = source.dataset.categoryLabel || source.dataset.category || '';
      if (locEl) locEl.textContent = source.dataset.location || '';
      if (imgEl) {
        imgEl.src = source.dataset.image || '';
        imgEl.alt = source.dataset.title || 'Project details';
      }
      if (descEl) descEl.textContent = source.dataset.desc || '';
      if (scopeEl) scopeEl.textContent = source.dataset.scope || 'Civil, Structural & Finishing Works';
      modal.show();
    });
  });
}

/**
 * Lightbox Viewer with Prev/Next & Escape Support
 */
function initProjectLightbox() {
  const backdrop = document.getElementById('projectLightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbMeta = document.getElementById('lightboxMeta');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!backdrop || !lbImg) return;

  let activeItems = [];
  let currentIndex = 0;

  const getVisibleItems = () => {
    return Array.from(document.querySelectorAll('.project-card:not(.is-hidden)'));
  };

  const renderItem = (index) => {
    if (!activeItems.length) return;
    currentIndex = (index + activeItems.length) % activeItems.length;
    const item = activeItems[currentIndex];
    lbImg.src = item.dataset.image || '';
    lbImg.alt = item.dataset.title || 'Project photograph';
    if (lbTitle) lbTitle.textContent = item.dataset.title || '';
    if (lbMeta) {
      const cat = item.dataset.categoryLabel || '';
      const loc = item.dataset.location || '';
      lbMeta.textContent = `${cat} • ${loc} (${currentIndex + 1} / ${activeItems.length})`;
    }
  };

  const openLightbox = (card) => {
    activeItems = getVisibleItems();
    const idx = activeItems.indexOf(card);
    currentIndex = idx >= 0 ? idx : 0;
    renderItem(currentIndex);
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (closeBtn) closeBtn.focus();
  };

  const closeLightbox = () => {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  document.querySelectorAll('[data-open-lightbox]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      if (card) openLightbox(card);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => renderItem(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => renderItem(currentIndex + 1));

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!backdrop.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      renderItem(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      renderItem(currentIndex + 1);
    }
  });
}

})();

/* ==========================================================================
   MERGED FROM: contact.js
   ========================================================================== */
(function () {
/* ==========================================================================
   CONTACT US PAGE (contact.html) — Quotation Form Validation (Frontend Demo)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initQuoteFormValidation();
});

function initQuoteFormValidation() {
  const form = document.getElementById('quoteRequestForm');
  if (!form) return;

  const submitBtn = document.getElementById('quoteSubmitBtn');
  const feedbackBox = document.getElementById('quoteFormFeedback');

  const validators = {
    fullName: (val) => val.trim().length >= 2,
    phoneNumber: (val) => {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    },
    emailAddress: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    projectType: (val) => val.trim() !== '',
    projectLocation: (val) => val.trim().length >= 2,
    projectMessage: (val) => val.trim().length >= 10,
  };

  const validateField = (field) => {
    const fn = validators[field.id];
    if (!fn) return true;
    const isValid = fn(field.value);
    field.classList.toggle('is-invalid', !isValid);
    field.setAttribute('aria-invalid', !isValid ? 'true' : 'false');
    return isValid;
  };

  // Live validation on blur/input
  Object.keys(validators).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      if (el.classList.contains('is-invalid')) {
        validateField(el);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    let firstInvalid = null;

    Object.keys(validators).forEach((id) => {
      const el = document.getElementById(id);
      if (el && !validateField(el)) {
        allValid = false;
        if (!firstInvalid) firstInvalid = el;
      }
    });

    if (!allValid) {
      if (firstInvalid) firstInvalid.focus();
      if (feedbackBox) {
        feedbackBox.className = 'alert alert-danger mt-4';
        feedbackBox.textContent = 'Please review and complete the highlighted required fields before submitting.';
      }
      return;
    }

    // Structured payload ready for future backend integration (e.g., fetch(form.dataset.endpoint))
    const payload = Object.fromEntries(new FormData(form).entries());

    // Loading state
    const originalHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Validating Request...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
      }

      if (feedbackBox) {
        feedbackBox.className = 'alert alert-success mt-4';
        feedbackBox.innerHTML = `
          <strong>Thank you, ${escapeHtml(payload.fullName || 'Client')}!</strong> Your quotation request for
          <strong>${escapeHtml(payload.projectType || 'Construction')}</strong> at
          <strong>${escapeHtml(payload.projectLocation || 'your site')}</strong> has been submitted.
          <span class="d-block small mt-1">Our civil engineering desk will review your requirements and reach out within 1 business day.</span>
        `;
      }

      form.reset();
      Object.keys(validators).forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove('is-invalid');
          el.setAttribute('aria-invalid', 'false');
        }
      });
    }, 650);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

})();
