# Typografi og FAQ – endringer

Basert på det opplastede prosjektet `movementum(6).zip`.

- Cormorant Garamond er lagt til via Google Fonts på `index.html` og `retreat.html`. Nettforbindelse er nødvendig for å hente fonten; Garamond/Georgia brukes som reserve.
- Dekorative tekster bruker nå Cormorant Garamond via `--font-editorial`: den hvite tekststripen (`.top-note-track`), kort introduksjon i `.wrapper-narrow h2`, sitatdelen `.interlude p`, `.hero-path`, `.product-note` og billedtekst i `.life-story-photo`.
- Vanlig brødtekst og navigasjon bruker fortsatt DM Sans.
- FAQ har en kort åpne-/lukkeanimasjon (290 ms), inkludert en myk rotasjon av pluss-ikonet. `<details>`/`<summary>` er beholdt for tastaturnavigasjon.
- Ny JavaScript-fil: `js/retreat-faq.js`. Alle eksisterende videoer, foto, parallax og øvrige HTML-seksjoner er bevart.
- Hvis systemet ber om redusert bevegelse, endres FAQ umiddelbart uten animasjon.
