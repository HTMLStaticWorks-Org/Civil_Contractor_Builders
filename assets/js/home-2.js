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
