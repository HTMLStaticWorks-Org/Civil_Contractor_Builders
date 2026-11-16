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
