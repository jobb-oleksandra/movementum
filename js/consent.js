/* Samtykke til informasjonskapsler og innhold fra tredjeparter (Vimeo).
   Nødvendig lagring (selve samtykkevalget) krever ikke samtykke.
   Vimeo-videoen lastes først når besøkende har valgt «Godta alle»;
   ellers vises den lokale MP4-videoen fra eget domene.

   API:  window.MovementumConsent.has('media')  -> true/false
         window.MovementumConsent.open()        -> åpner innstillingene igjen
   Hendelse: document 'movementum:consent' med detail = { media: boolean } */
(() => {
  'use strict';
  const KEY = 'movementum-consent';
  const VERSION = 1;
  const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // spør på nytt etter 12 måneder

  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!value || value.v !== VERSION || typeof value.media !== 'boolean') return null;
      if (Date.now() - Date.parse(value.date) > MAX_AGE_MS) return null;
      return value;
    } catch (_) { return null; }
  };

  let state = read();

  const save = media => {
    const withdrawn = Boolean(state?.media) && !media;
    state = {v: VERSION, media, date: new Date().toISOString()};
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
    // Already-loaded Vimeo players are removed by reloading the page.
    if (withdrawn) { location.reload(); return; }
    document.dispatchEvent(new CustomEvent('movementum:consent', {detail: {media}}));
  };

  let banner = null;
  let lastFocus = null;

  const close = () => {
    if (!banner) return;
    banner.hidden = true;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  };

  const build = () => {
    banner = document.createElement('section');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-labelledby', 'consent-title');
    banner.innerHTML = `
      <div class="consent-inner">
        <div class="consent-text">
          <h2 id="consent-title">Informasjonskapsler og video</h2>
          <p>Vi bruker kun nødvendig lagring for å huske valget ditt. Med ditt samtykke viser vi
          videoer fra Vimeo, som kan sette informasjonskapsler og motta IP-adressen din.
          Les mer i <a href="personvern.html">personvernerklæringen</a>.</p>
        </div>
        <div class="consent-actions">
          <button type="button" class="consent-button" data-consent="reject">Kun nødvendige</button>
          <button type="button" class="consent-button" data-consent="accept">Godta alle</button>
        </div>
      </div>`;
    banner.addEventListener('click', event => {
      const choice = event.target.closest?.('[data-consent]')?.dataset.consent;
      if (!choice) return;
      save(choice === 'accept');
      close();
    });
    banner.addEventListener('keydown', event => {
      if (event.key === 'Escape' && state) close();
    });
    // Først i dokumentet, så tastaturbrukere når valget med en gang (WCAG 2.4.3).
    document.body.prepend(banner);
  };

  const open = () => {
    lastFocus = document.activeElement;
    if (!banner) build();
    banner.hidden = false;
    banner.querySelector('[data-consent="accept"]').focus({preventScroll: true});
  };

  window.MovementumConsent = {
    has: category => Boolean(state && state[category]),
    decided: () => Boolean(state),
    open
  };

  const init = () => {
    document.querySelectorAll('[data-consent-open]').forEach(el => {
      el.addEventListener('click', event => { event.preventDefault(); open(); });
    });
    if (!state) {
      build();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
