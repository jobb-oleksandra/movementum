/* Vimeo backgrounds on retreat hero and homepage teaser.
   Pick the edit by the actual video box, not by the device name.
   Keep the local MP4/poster available until Vimeo confirms playback. */
(() => {
  'use strict';
  const SQUARE_MAX_RATIO = 1.35;
  const SWITCH_DELAY = 150;

  const embedUrl = supplied => {
    let url;
    try { url = new URL(supplied); } catch { return null; }
    if (url.protocol !== 'https:' || !['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(url.hostname)) return null;
    const parts = url.pathname.split('/').filter(Boolean);
    const idIndex = parts.findIndex(part => /^\d+$/.test(part));
    if (idIndex < 0) return null;
    const hash = url.searchParams.get('h') ||
      (/^[a-f0-9]{8,}$/i.test(parts[idIndex + 1] || '') ? parts[idIndex + 1] : '');
    const params = new URLSearchParams({background:'1', autoplay:'1', muted:'1', loop:'1', autopause:'0', playsinline:'1', dnt:'1'});
    if (hash) params.set('h', hash);
    return `https://player.vimeo.com/video/${parts[idIndex]}?${params.toString()}`;
  };

  document.querySelectorAll('.retreat-vimeo-frame').forEach(frame => {
    const fallback = frame.querySelector('video');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      frame.dataset.vimeoState = 'poster';
      return;
    }
    const sources = {
      wide: {url: embedUrl(frame.getAttribute('data-vimeo-url')), ratio: 16 / 9},
      square: {url: embedUrl(frame.getAttribute('data-vimeo-square-url')), ratio: 1}
    };
    const isHomepage = frame.classList.contains('home-retreat-video');
    let iframe = null;
    let playbackTimer = null;
    let switchTimer = null;
    let currentFormat = null;
    let done = false;
    let box = {width: frame.clientWidth, height: frame.clientHeight};

    const selectedFormat = () => sources.square.url && box.height > 0 &&
      box.width / box.height <= SQUARE_MAX_RATIO ? 'square' : 'wide';

    const updateHomepageCover = () => {
      if (!iframe || !isHomepage || box.width < 1 || box.height < 1) return;
      // Keep the working fixed viewport + overscan approach. Only its native
      // aspect ratio changes: 1920x1080 for wide, 1080x1080 for square.
      const scale = Math.max(box.width / iframe.offsetWidth, box.height / iframe.offsetHeight) * 1.12;
      if (Number.isFinite(scale)) iframe.style.setProperty('--home-video-scale', String(scale));
    };
    const cleanupPlayback = () => {
      window.clearTimeout(playbackTimer);
      playbackTimer = null;
      window.removeEventListener('message', onMessage);
    };
    const playLocal = () => {
      if (done) return;
      done = true;
      cleanupPlayback();
      iframe?.remove();
      iframe = null;
      frame.classList.remove('is-vimeo');
      frame.dataset.vimeoState = 'fallback';
      if (fallback) {
        fallback.preload = 'metadata';
        fallback.play().catch(() => {
          if (!iframe) frame.dataset.vimeoState = 'poster';
        });
      }
    };
    const playing = () => {
      if (done) return;
      done = true;
      cleanupPlayback();
      frame.classList.add('is-vimeo');
      frame.dataset.vimeoState = 'playing';
      fallback?.pause();
    };
    const subscribe = () => {
      if (!iframe?.contentWindow) return;
      ['playing', 'play', 'error'].forEach(eventName => {
        iframe.contentWindow.postMessage(JSON.stringify({method:'addEventListener', value:eventName}), 'https://player.vimeo.com');
      });
    };
    function onMessage(event) {
      if (event.origin !== 'https://player.vimeo.com' || event.source !== iframe?.contentWindow) return;
      let data = event.data;
      try { if (typeof data === 'string') data = JSON.parse(data); } catch { return; }
      if (!data || typeof data !== 'object') return;
      if (data.event === 'error') { playLocal(); return; }
      if (data.event === 'ready' || data.method === 'ping') { subscribe(); return; }
      if (data.event === 'playing' || data.event === 'play') playing();
    }
    const loadFormat = format => {
      cleanupPlayback();
      iframe?.remove();
      iframe = null;
      fallback?.pause();
      frame.classList.remove('is-vimeo');
      currentFormat = format;
      frame.dataset.vimeoFormat = format;
      done = false;
      const source = sources[format];
      if (!source.url) { playLocal(); return; }

      const player = document.createElement('iframe');
      iframe = player;
      player.src = source.url;
      player.title = 'Movementum Retreat – dekorativ bakgrunnsvideo';
      player.allow = 'autoplay; fullscreen; picture-in-picture';
      player.setAttribute('aria-hidden', 'true');
      player.setAttribute('tabindex', '-1');
      player.setAttribute('loading', frame.hasAttribute('data-vimeo-lazy') ? 'lazy' : 'eager');
      player.style.setProperty('--vimeo-player-width', `${1080 * source.ratio}px`);
      player.style.setProperty('--vimeo-cover-width', `${100 * source.ratio}cqh`);
      player.style.setProperty('--vimeo-cover-height', `${100 / source.ratio}cqw`);
      frame.dataset.vimeoState = 'loading';
      window.addEventListener('message', onMessage);
      player.addEventListener('load', () => {
        if (iframe !== player || done) return;
        player.contentWindow?.postMessage(JSON.stringify({method:'ping'}), 'https://player.vimeo.com');
        subscribe();
      }, {once:true});
      player.addEventListener('error', () => {
        if (iframe === player) playLocal();
      }, {once:true});
      frame.appendChild(player);
      updateHomepageCover();
      playbackTimer = window.setTimeout(() => {
        if (iframe === player) playLocal();
      }, 12000);
    };
    const onResize = entries => {
      const measured = entries?.[0]?.contentRect;
      box = measured || {width: frame.clientWidth, height: frame.clientHeight};
      if (box.width < 1 || box.height < 1) return;
      updateHomepageCover();
      window.clearTimeout(switchTimer);
      switchTimer = null;
      if (selectedFormat() === currentFormat) return;
      // Let a resize/orientation change settle, then replace only if the
      // format changed. Ordinary size updates never restart the same edit.
      switchTimer = window.setTimeout(() => {
        switchTimer = null;
        const format = selectedFormat();
        if (format !== currentFormat) loadFormat(format);
      }, SWITCH_DELAY);
    };
    const start = () => {
      box = {width: frame.clientWidth, height: frame.clientHeight};
      loadFormat(selectedFormat());
      if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(onResize);
        observer.observe(frame);
      } else {
        window.addEventListener('resize', onResize, {passive:true});
      }
    };
    if (frame.hasAttribute('data-vimeo-lazy') && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); start(); }
      }, {rootMargin: '250px'});
      observer.observe(frame);
    } else {
      start();
    }
  });
})();
