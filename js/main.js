(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const loader = document.getElementById("page-loader");
  const progress = document.getElementById("scroll-progress");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.addEventListener("load", () => {
    setTimeout(() => {
      if (loader) loader.classList.add("loaded");
      document.body.classList.remove("page-loading");
    }, 300);
  });

  function updateProgress() {
    if (!progress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  if (!prefersReduced && "IntersectionObserver" in window) {
    const revealItems = document.querySelectorAll("[data-animate]");
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    document.querySelectorAll("[data-animate]").forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  // Animated numeric counters for metrics
  function animateNumber(el, target) {
    const start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const suffix = (el.textContent || "").replace(/[^\d+]/g, "");
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const val = Math.round(start + (target - start) * (t));
      el.textContent = String(val) + (el.dataset.suffix || "");
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!prefersReduced && "IntersectionObserver" in window) {
    const counters = document.querySelectorAll('.metric-value');
    const counterObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          const match = text.match(/(\d+)/);
          if (match) {
            const num = parseInt(match[1], 10);
            const suffix = text.replace(match[1], '');
            el.dataset.suffix = suffix;
            animateNumber(el, num);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });
    counters.forEach(c => counterObs.observe(c));
  }
})();
