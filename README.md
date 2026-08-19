# AI Studio Network — Webflow embeds

Source for the halftone glitch background and related page scripts used on [ai-studio-network.webflow.io](https://ai-studio-network.webflow.io).

Hosted on GitHub: [github.com/adamho91/ai-sn](https://github.com/adamho91/ai-sn)

## Architecture (embed size cap workaround)

Webflow HtmlEmbeds have a character limit (~50k). The heavy JS does **not** live in the embed.

| Layer | Where | What |
|-------|--------|------|
| **Engine + typewriter** | GitHub → jsDelivr → site **Head** custom code | `dist/fal-glitch-engine.js`, `dist/fal-typewriter.js` |
| **Config + boot** | Webflow HtmlEmbed (thin, ~4k each) | `dist/desktop-embed.html`, `dist/mobile-embed.html` |

### Site head (Webflow → Custom Code → Head)

After `npm run build`, append the contents of `dist/site-head.html`:

```html
<script defer src="https://cdn.jsdelivr.net/gh/adamho91/ai-sn@main/dist/fal-glitch-engine.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/adamho91/ai-sn@main/dist/fal-typewriter.js"></script>
```

### HtmlEmbeds (Designer)

- **Desktop** — paste `dist/desktop-embed.html` into `glitch-code-embed hide-mobile`
- **Mobile** — paste `dist/mobile-embed.html` into `glitch-code-embed-mobile`

Thin embeds wait for `window.FalGlitchDustWebflow` then run the boot script.

## Structure

- `src/glitch-engine.js` — Fal Glitch Dust engine (`FalGlitchDustWebflow`)
- `src/embed-boot-desktop.js` — desktop mount (hidden below 480px)
- `src/embed-boot-mobile.js` — mobile mount (390×844, only below 480px)
- `src/typewriter-intro.js` — typewriter for info body + vertical sidebar
- `config/desktop.json` — 1920×1080 halftone config
- `config/mobile.json` — 390×844 mobile config
- `dist/fal-glitch-engine.js` — standalone engine bundle (GitHub/jsDelivr)
- `dist/fal-typewriter.js` — standalone typewriter bundle
- `dist/*-embed.html` — thin Webflow embed snippets

## Workflow

```bash
npm run build
git add -A && git commit -m "..." && git push   # jsDelivr picks up dist/*.js
python3 scripts/prepare-webflow-upload.py        # optional MCP payloads
```

Then update Webflow site head (if scripts changed) and paste/upload thin embed HTML.
