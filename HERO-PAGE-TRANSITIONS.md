# Movementum – hero heights and transitions

Based on the latest corrected project `Movementum-Header-Smooth-Fixed.zip`.

- CSS file: `css/hero-page-transition.css`
- JavaScript fallback: `js/page-navigation.js`
- Both `index.html` and `retreat.html` reference the shared files.
- On desktop, both heroes use `clamp(730px, 54vw, 820px)`.
- On tablets, both use a stacked image/video layout and keep the film landscape.
- On phones, both photo/video windows use a near-square 1.1:1 aspect ratio.
- Page transitions use cross-document View Transitions on same-origin navigation, with a small opacity fallback.
- `prefers-reduced-motion` disables the transition.

Open both pages through the same Live Server origin, for example `http://127.0.0.1:5500/index.html`. Cross-document transitions do not work when opening HTML as local `file://` URLs in some browsers.

No text, videos, photographs, or other sections were changed.
