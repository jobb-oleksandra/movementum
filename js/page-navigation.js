/* Subtle navigation fallback for browsers without cross-document View Transitions.
   Native View Transitions on supported browsers take precedence. */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof document.startViewTransition === 'function') return;

  const html = document.documentElement;
  html.classList.add('page-transition-fallback');

  try {
    if (sessionStorage.getItem('movementum-page-navigation') === '1') {
      sessionStorage.removeItem('movementum-page-navigation');
      html.classList.add('page-transition-enter');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        html.classList.remove('page-transition-enter');
      }));
    }
  } catch (_) { /* private browsing may restrict sessionStorage */ }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

    const target = new URL(link.href, window.location.href);
    if (target.origin !== location.origin || target.pathname === location.pathname ||
        !/(?:^|\/)(?:index|retreat)\.html$/i.test(target.pathname)) return;

    event.preventDefault();
    html.classList.add('page-transition-leave');
    try { sessionStorage.setItem('movementum-page-navigation', '1'); } catch (_) {}
    window.setTimeout(() => window.location.assign(link.href), 105);
  });

  window.addEventListener('pageshow', event => {
    if (event.persisted) html.classList.remove('page-transition-leave');
  });
})();
