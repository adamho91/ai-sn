# AI Studio Network — Webflow embeds

Source for the halftone glitch background and related page scripts used on [ai-studio-network.webflow.io](https://ai-studio-network.webflow.io).

## Structure

- `src/glitch-engine.js` — Fal Glitch Dust engine (`FalGlitchDustWebflow`)
- `src/embed-boot-desktop.js` — desktop mount (hidden below 480px via JS + Webflow `hide-mobile` class)
- `src/embed-boot-mobile.js` — mobile mount (390×844 canvas, only runs below 480px)
- `src/typewriter-intro.js` — typewriter for info body + vertical sidebar (desktop embed only)
- `config/desktop.json` — 1920×1080 halftone config
- `config/mobile.json` — 390×844 mobile config (smaller `pixSize`, touch-friendly hover radius)
- `dist/*.html` — built Webflow HtmlEmbed snippets (paste into Designer)

## Build

```bash
npm run build
```

Copy `dist/desktop-embed.html` into the existing `glitch-code-embed` HtmlEmbed (class: `glitch-code-embed hide-mobile`).

Copy `dist/mobile-embed.html` into a second HtmlEmbed (class: `glitch-code-embed-mobile`, visible only on mobile portrait in Webflow).
