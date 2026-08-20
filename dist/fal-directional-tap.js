(function(){'use strict';
(function () {
  var PIECE_SEL = '#ai-sn-external';
  var TAP_PX = 8;

  function nearestDirection(clientX, clientY, rect) {
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var dx = clientX - cx;
    var dy = clientY - cy;
    if (Math.abs(dx) < TAP_PX && Math.abs(dy) < TAP_PX) return null;
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'd' : 'a';
    return dy > 0 ? 's' : 'w';
  }

  function init() {
    var piece = document.querySelector(PIECE_SEL);
    if (!piece) return;

    var tapStart = null;

    piece.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      tapStart = { x: e.clientX, y: e.clientY, id: e.pointerId };
    });

    piece.addEventListener('pointerup', function (e) {
      if (!tapStart || e.pointerId !== tapStart.id) return;
      if (window.__aiSnCardDidDrag) {
        window.__aiSnCardDidDrag = false;
        tapStart = null;
        return;
      }
      var dx = e.clientX - tapStart.x;
      var dy = e.clientY - tapStart.y;
      tapStart = null;
      if (dx * dx + dy * dy > TAP_PX * TAP_PX) return;

      var dir = nearestDirection(e.clientX, e.clientY, piece.getBoundingClientRect());
      if (!dir || !window.FalGlitchDustWebflow) return;
      window.FalGlitchDustWebflow.shiftNodes(dir);
      e.preventDefault();
    });

    piece.addEventListener('pointercancel', function () {
      tapStart = null;
    });
  }

  function boot() {
    if (!window.FalGlitchDustWebflow) {
      setTimeout(boot, 30);
      return;
    }
    init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();})();
