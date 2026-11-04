/* Vimeo background on retreat.html only.
   Keep the original local MP4 as a fallback without fetching it in parallel.
   A loaded iframe is not proof that a video is playing. */
(() => {
  'use strict';
  const frame = document.querySelector('.retreat-vimeo-frame');
  if (!frame) return;
  const fallback = frame.querySelector('video');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supplied = (frame.getAttribute('data-vimeo-url') || '').trim();
  if (reduceMotion) {
    frame.dataset.vimeoState = 'poster';
    return;
  }

  let iframe = null;
  let timer = null;
  let done = false;
  const cleanup = () => {
    if (timer) window.clearTimeout(timer);
    timer = null;
    window.removeEventListener('message', onMessage);
  };
  const playLocal = () => {
    if (done) return;
    done = true;
    cleanup();
    if (iframe) iframe.remove();
    frame.classList.remove('is-vimeo');
    frame.dataset.vimeoState = 'fallback';
    if (fallback) {
      fallback.preload = 'metadata';
      fallback.play().catch(() => {
        // Autoplay may be blocked (e.g. iOS Low Power Mode). Keep the poster.
        frame.dataset.vimeoState = 'poster';
      });
    }
  };
  const playing = () => {
    if (done) return;
    done = true;
    cleanup();
    frame.classList.add('is-vimeo');
    frame.dataset.vimeoState = 'playing';
    if (fallback) fallback.pause();
  };
  const subscribe = () => {
    if (!iframe?.contentWindow) return;
    ['playing', 'play', 'error'].forEach(eventName => {
      iframe.contentWindow.postMessage(JSON.stringify({method:'addEventListener',value:eventName}), 'https://player.vimeo.com');
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
  if (!supplied) { playLocal(); return; }
  let url;
  try { url = new URL(supplied); } catch { playLocal(); return; }
  if (url.protocol !== 'https:' || !['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(url.hostname)) {
    playLocal(); return;
  }
  const parts = url.pathname.split('/').filter(Boolean);
  const idIndex = parts.findIndex(part => /^\d+$/.test(part));
  if (idIndex < 0) { playLocal(); return; }
  const id = parts[idIndex];
  const hash = url.searchParams.get('h') ||
    (/^[a-f0-9]{8,}$/i.test(parts[idIndex + 1] || '') ? parts[idIndex + 1] : '');
  const params = new URLSearchParams({background:'1',autoplay:'1',muted:'1',loop:'1',autopause:'0',playsinline:'1',dnt:'1'});
  if (hash) params.set('h', hash);

  iframe = document.createElement('iframe');
  iframe.src = `https://player.vimeo.com/video/${id}?${params.toString()}`;
  iframe.title = 'Movementum Retreat – dekorativ bakgrunnsvideo';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.setAttribute('aria-hidden','true');
  iframe.setAttribute('tabindex','-1');
  iframe.setAttribute('loading','eager');
  frame.dataset.vimeoState = 'loading';
  window.addEventListener('message', onMessage);
  iframe.addEventListener('load', () => {
    // A loaded iframe can still show an error; wait for a playback event.
    iframe?.contentWindow?.postMessage(JSON.stringify({method:'ping'}),'https://player.vimeo.com');
    subscribe();
  }, {once:true});
  iframe.addEventListener('error',playLocal,{once:true});
  frame.appendChild(iframe);
  // If embed is blocked or autoplay is unavailable, use local MP4 (or its poster).
  timer = window.setTimeout(playLocal, 12000);
})();
