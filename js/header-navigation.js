/* Close the native mobile <details> menu after navigation or dismissal. */
(() => {
  const menu = document.querySelector('.site-header .mobile-menu');
  if (!menu) return;
  const toggle = menu.querySelector('summary');
  const title = menu.querySelector('.mobile-menu-title');
  const close = () => { menu.open = false; };
  menu.addEventListener('toggle', () => {
    if (title) title.textContent = menu.open ? 'Lukk' : 'Meny';
  });
  menu.querySelectorAll('nav a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('pointerdown', event => {
    if (menu.open && !menu.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      close();
      toggle?.focus();
    }
  });
  const desktop = window.matchMedia('(min-width: 1101px)');
  desktop.addEventListener?.('change', event => { if (event.matches) close(); });
})();
