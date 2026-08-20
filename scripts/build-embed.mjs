#!/usr/bin/env node
/**
 * Build Webflow embeds + GitHub-hosted JS bundles.
 *
 * Heavy JS lives in dist/*.js (served via jsDelivr from github.com/adamho91/ai-sn).
 * Webflow HtmlEmbeds stay small: wrapper div + JSON config + boot loader only.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/adamho91/ai-sn@main/dist';

function read(rel) {
  return readFileSync(join(root, rel), 'utf8').trim();
}

function stripLeadingComment(src) {
  return src.replace(/^\/\/[^\n]*\n/, '').trim();
}

function wrapBoot(bootSrc) {
  const boot = stripLeadingComment(bootSrc);
  return [
    '(function(){',
    'function run(){',
    boot,
    '}',
    'function wait(){',
    'if(window.FalGlitchDustWebflow){run();return;}',
    'setTimeout(wait,30);',
    '}',
    'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",wait);',
    'else wait();',
    '})();',
  ].join('');
}

function buildThinEmbed({ wrapId, dataId, configFile, bootFile }) {
  const cfg = JSON.stringify(JSON.parse(read(configFile)));
  const boot = wrapBoot(read(bootFile));

  return [
    '<!-- fal Glitch Dust — thin embed (engine loaded from GitHub via site head) -->',
    `<div id="${wrapId}" class="fal-maxi-embed" style="position:absolute;inset:0;overflow:hidden;line-height:0;"></div>`,
    `<script type="application/json" id="${dataId}">${cfg}</script>`,
    `<script>${boot}</script>`,
    '',
  ].join('\n');
}

mkdirSync(join(root, 'dist'), { recursive: true });

// Standalone bundles for GitHub / jsDelivr
const engine = stripLeadingComment(read('src/glitch-engine.js'));
writeFileSync(join(root, 'dist/fal-glitch-engine.js'), engine + '\n');

const typewriter = stripLeadingComment(read('src/typewriter-intro.js'));
writeFileSync(
  join(root, 'dist/fal-typewriter.js'),
  `(function(){${typewriter}})();\n`
);

const cardDrag = stripLeadingComment(read('src/card-drag-connector.js'));
writeFileSync(
  join(root, 'dist/fal-card-drag.js'),
  `(function(){${cardDrag}})();\n`
);

// Site head snippet (paste or deploy via Webflow custom code)
const siteHead = `<!-- fal glitch + typewriter + card drag (github.com/adamho91/ai-sn) -->
<script defer src="${CDN_BASE}/fal-glitch-engine.js"></script>
<script defer src="${CDN_BASE}/fal-typewriter.js"></script>
<script defer src="${CDN_BASE}/fal-card-drag.js"></script>
`;
writeFileSync(join(root, 'dist/site-head.html'), siteHead);

const desktop = buildThinEmbed({
  wrapId: 'falwrap_falh1ua4li04',
  dataId: 'faldata_falh1ua4li04',
  configFile: 'config/desktop.json',
  bootFile: 'src/embed-boot-desktop.js',
});

const mobile = buildThinEmbed({
  wrapId: 'falwrap_falmobile01',
  dataId: 'faldata_falmobile01',
  configFile: 'config/mobile.json',
  bootFile: 'src/embed-boot-mobile.js',
});

writeFileSync(join(root, 'dist/desktop-embed.html'), desktop);
writeFileSync(join(root, 'dist/mobile-embed.html'), mobile);

console.log('Built dist/fal-glitch-engine.js (' + engine.length + ' chars)');
console.log('Built dist/fal-typewriter.js (' + typewriter.length + ' chars)');
console.log('Built dist/fal-card-drag.js (' + cardDrag.length + ' chars)');
console.log('Built dist/desktop-embed.html (' + desktop.length + ' chars)');
console.log('Built dist/mobile-embed.html (' + mobile.length + ' chars)');
console.log('CDN base:', CDN_BASE);
