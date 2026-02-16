// js/main.js
// Shared utilities: hamburger toggle + lazy image observer

(function () {
  // hamburger toggler for nav
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('show');
      btn.setAttribute('aria-expanded', nav.classList.contains('show') ? 'true' : 'false');
    });
  }

  // Lazy load images (images must have data-src attribute)
  const lazyObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        if (src) { img.src = src; img.removeAttribute('data-src'); }
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' }) : null;

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[data-src]').forEach(img => {
      if (lazyObserver) lazyObserver.observe(img);
      else img.src = img.dataset.src;
    });
  });
})();
