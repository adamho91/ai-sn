// Typewriter intro for info body + vertical sidebar text
'use strict';
var T = [
  { id: 'typewriter-info-body', delay: 650, ms: 24 },
  { id: 'typewriter-vertical', delay: 850, ms: 26, reserve: true },
];
function typeEl(c) {
  var el = document.getElementById(c.id);
  if (!el) return;
  var full = (el.innerText || el.textContent || '').replace(/\r/g, '');
  el.setAttribute('aria-label', full.trim());
  var live, i = 0;
  if (c.reserve) {
    el.style.position = 'relative';
    el.textContent = '';
    var ghost = document.createElement('span');
    ghost.setAttribute('aria-hidden', 'true');
    ghost.style.visibility = 'hidden';
    ghost.style.display = 'block';
    ghost.style.whiteSpace = 'pre-wrap';
    ghost.textContent = full;
    live = document.createElement('span');
    live.style.position = 'absolute';
    live.style.top = '0';
    live.style.left = '0';
    live.style.right = '0';
    live.style.whiteSpace = 'pre-wrap';
    el.appendChild(ghost);
    el.appendChild(live);
  } else {
    el.textContent = '';
    live = el;
  }
  function step() {
    if (i >= full.length) return;
    live.textContent = full.slice(0, ++i);
    setTimeout(step, c.ms);
  }
  setTimeout(step, c.delay);
}
function boot() {
  T.forEach(typeEl);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
