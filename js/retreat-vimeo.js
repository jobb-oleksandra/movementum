/* Vimeo background integration for Movementum Retreat.
   Set data-vimeo-url on .retreat-vimeo-frame in retreat.html to the Vimeo
   video's URL (e.g. https://vimeo.com/<video-id> or the unlisted share link).
   No guessed video IDs. Until configured, the existing local MP4 is the fallback. */
(() => {
  'use strict';
  const frame = document.querySelector('.retreat-vimeo-frame');
  if (!frame) return;
  const supplied = (frame.dataset.vimeoUrl || '').trim();
  if (!supplied) return;
  let url;
  try { url = new URL(supplied); } catch { return; }
  if (!['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(url.hostname)) return;
  const match = url.pathname.match(/(?:\/video)?\/(\d+)(?:\/|$)/);
  if (!match) return;
  const params = new URLSearchParams();
  const privacy = url.searchParams.get('h') || (url.pathname.match(/\/\d+\/([a-f0-9]{8,})/i)||[])[1];
  if (privacy) params.set('h', privacy);
  params.set('background','1');
  params.set('autopause','0');
  params.set('dnt','1');
  params.set('playsinline','1');
  const iframe = document.createElement('iframe');
  iframe.src = `https://player.vimeo.com/video/${match[1]}?${params.toString()}`;
  iframe.title = 'Movementum Retreat – bakgrunnsvideo';
  iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('tabindex', '-1');
  iframe.setAttribute('loading','eager');
  frame.appendChild(iframe);
  frame.classList.add('is-vimeo');
  const fallback = frame.querySelector('video');
  if (fallback) fallback.pause();
})();
