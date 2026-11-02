/* Parallax movement for the TWO existing .retreat-photo-break sections.
   Never changes their photos, order, dimensions or surrounding sections. */
(() => {
  'use strict';
  const sections = Array.from(document.querySelectorAll('.retreat-page .retreat-photo-break'));
  if (!sections.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 759px)');
  const tablet = window.matchMedia('(max-width: 1100px)');
  let raf = 0;

  function update() {
    raf = 0;
    const enabled = !reduceMotion.matches;
    const viewport = window.innerHeight;
    // Noticeable, but restrained travel. The extra image height in CSS
    // always exceeds this total range, so no empty edges are revealed.
    const range = mobile.matches ? 160 : (tablet.matches ? 240 : 300);
    for (const section of sections) {
      const image = section.querySelector('img');
      if (!image) continue;
      section.classList.toggle('is-parallax', enabled);
      if (!enabled) {
        section.style.removeProperty('--retreat-image-shift');
        continue;
      }
      const bounds = section.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > viewport) continue;
      const progress = Math.min(1, Math.max(0, (viewport - bounds.top) / (viewport + bounds.height)));
      const offset = (progress - 0.5) * range;
      section.style.setProperty('--retreat-image-shift', `${offset.toFixed(1)}px`);
    }
  }

  function schedule() { if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduceMotion.addEventListener('change', schedule);
  mobile.addEventListener('change', schedule);
  tablet.addEventListener('change', schedule);
  update();
})();
