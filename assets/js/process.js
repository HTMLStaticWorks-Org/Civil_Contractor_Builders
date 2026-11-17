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
