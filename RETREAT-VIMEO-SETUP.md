# Vimeo – Movementum Retreat

Videoen i `retreat.html` er klargjort for Vimeo. I prosjektet er det **ikke** funnet noen publisert Vimeo-ID eller embed-URL til Hjemmesidevideo. Derfor er det ikke lagt inn en tilfeldig Vimeo-video.

1. Last opp `assets/video/hjemmesidevideo-retreat.mp4` til Vimeo (egen konto).
2. Kopier videoens delingslenke, for eksempel `https://vimeo.com/123456789`. Hvis videoen er *Unlisted*, kopier hele lenken inkludert hash.
3. Åpne `retreat.html`, finn `class="retreat-vimeo-frame" data-vimeo-url=""` og lim lenken mellom anførselstegnene.
4. Lagre filen og åpne `retreat.html` i nettleseren. Vimeo spilles automatisk uten lyd og i loop, uten spillerkontroller (`background=1`).
5. Forsikre deg om at videoen tillater embedding på ditt domene i Vimeo-innstillingene.

Før denne URL-en settes, spilles den eksisterende lokale MP4-en som en midlertidig forhåndsvisning. Når Vimeo er konfigurert, skjules den lokale spilleren automatisk.

Det er ikke gjort endringer i `index.html`, `css/styles.css` eller de to eksisterende parallax-seksjonene.
