/** Subtle FAQ expansion with height animation; no library dependency. */
(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 290;
  const easing = 'cubic-bezier(0.22, 0.72, 0.24, 1)';

  document.querySelectorAll('.retreat-faq details').forEach((details) => {
    const summary = details.querySelector('summary');
    const panel = details.querySelector('.retreat-faq-answer');
    if (!summary || !panel || !panel.animate) return;

    let animation = null;
    let desiredOpen = details.open;

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      desiredOpen = !desiredOpen;

      if (prefersReducedMotion.matches) {
        if (animation) animation.cancel();
        details.open = desiredOpen;
        panel.style.height = '';
        panel.style.opacity = '';
        return;
      }

      // Preserve the current visible height even if the user rapidly toggles.
      const startingHeight = details.open ? panel.getBoundingClientRect().height : 0;
      if (animation) animation.cancel();
      if (!details.open) details.open = true;
      panel.style.height = `${startingHeight}px`;
      panel.style.overflow = 'hidden';

      const targetHeight = desiredOpen ? panel.scrollHeight : 0;
      animation = panel.animate(
        [
          { height: `${startingHeight}px`, opacity: desiredOpen ? 0.3 : 1 },
          { height: `${targetHeight}px`, opacity: desiredOpen ? 1 : 0.3 }
        ],
        { duration, easing }
      );
      const current = animation;
      current.onfinish = () => {
        if (animation !== current) return;
        if (!desiredOpen) details.open = false;
        panel.style.height = '';
        panel.style.opacity = '';
        panel.style.overflow = '';
        animation = null;
      };
    });
  });
})();
