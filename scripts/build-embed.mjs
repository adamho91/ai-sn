#!/usr/bin/env node
/**
 * Build Webflow HtmlEmbed snippets from src/ + config/.
 * Output: dist/desktop-embed.html, dist/mobile-embed.html
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function read(rel) {
  return readFileSync(join(root, rel), 'utf8').trim();
}

function buildEmbed({ name, wrapId, dataId, configFile, bootFile, includeTypewriter }) {
  const cfg = JSON.stringify(JSON.parse(read(configFile)));
  const engine = read('src/glitch-engine.js').replace(/^\/\/[^\n]*\n/, '');
  const boot = read(bootFile).replace(/^\/\/[^\n]*\n/, '');
  const typewriter = includeTypewriter ? read('src/typewriter-intro.js') : '';

  const scriptParts = [
    "(function(){'use strict';",
    engine,
    boot,
    typewriter ? `;(function(){${typewriter}})();` : '',
    '})();',
  ].filter(Boolean);

  return [
    '<!-- fal Glitch Dust Maxi (cover · respects padding) — paste into Webflow HtmlEmbed -->',
    `<div id="${wrapId}" class="fal-maxi-embed" style="position:absolute;inset:0;overflow:hidden;line-height:0;"></div>`,
    `<script type="application/json" id="${dataId}">${cfg}</script>`,
    `<script>${scriptParts.join('')}</script>`,
    '',
  ].join('\n');
}

mkdirSync(join(root, 'dist'), { recursive: true });

const desktop = buildEmbed({
  name: 'desktop',
  wrapId: 'falwrap_falh1ua4li04',
  dataId: 'faldata_falh1ua4li04',
  configFile: 'config/desktop.json',
  bootFile: 'src/embed-boot-desktop.js',
  includeTypewriter: true,
});

const mobile = buildEmbed({
  name: 'mobile',
  wrapId: 'falwrap_falmobile01',
  dataId: 'faldata_falmobile01',
  configFile: 'config/mobile.json',
  bootFile: 'src/embed-boot-mobile.js',
  includeTypewriter: false,
});

writeFileSync(join(root, 'dist/desktop-embed.html'), desktop);
writeFileSync(join(root, 'dist/mobile-embed.html'), mobile);

console.log('Built dist/desktop-embed.html (' + desktop.length + ' chars)');
console.log('Built dist/mobile-embed.html (' + mobile.length + ' chars)');
