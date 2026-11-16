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
