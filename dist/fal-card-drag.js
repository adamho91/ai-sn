(function(){'use strict';
(function () {
  var CARD_SEL = '.ai-sn-container';
  var STAGE_SEL = '.div-block-5';
  var PAD = 12;
  var SNAP_MS = 420;
  var SNAP_EASE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  var STORAGE_KEY = 'ai-sn-card-quadrant';

  function init() {
    if (window.matchMedia('(max-width:479px)').matches) return;

    var card = document.querySelector(CARD_SEL);
    var stage = document.querySelector(STAGE_SEL);
    if (!card || !stage) return;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ai-sn-connector-svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:20;overflow:visible';
    var lines = [];
    for (var i = 0; i < 4; i++) {
      var lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      lineEl.setAttribute('stroke', '#c9c9c9');
      lineEl.setAttribute('stroke-width', '1');
      svg.appendChild(lineEl);
      lines.push(lineEl);
    }
    stage.appendChild(svg);

    card.style.touchAction = 'none';
    card.style.cursor = 'grab';
    card.style.userSelect = 'none';
    card.style.webkitUserSelect = 'none';

    var dragging = false;
    var offX = 0;
    var offY = 0;
    var currentQ = 0;

    function stageRect() {
      return stage.getBoundingClientRect();
    }

    function cardRect() {
      return card.getBoundingClientRect();
    }

    function setTransition(on) {
      card.style.transition = on
        ? 'left ' + SNAP_MS + 'ms ' + SNAP_EASE + ', top ' + SNAP_MS + 'ms ' + SNAP_EASE
        : 'none';
    }

    function setPos(x, y, animate) {
      setTransition(animate);
      card.style.left = x + 'px';
      card.style.top = y + 'px';
      card.style.right = 'auto';
      card.style.bottom = 'auto';
    }

    function quadrantPositions() {
      var sr = stageRect();
      var w = card.offsetWidth;
      var h = card.offsetHeight;
      return [
        { x: PAD, y: PAD },
        { x: sr.width - w - PAD, y: PAD },
        { x: PAD, y: sr.height - h - PAD },
        { x: sr.width - w - PAD, y: sr.height - h - PAD },
      ];
    }

    function nearestQuadrant(cx, cy) {
      var sr = stageRect();
      var qx = cx - sr.left < sr.width / 2 ? 0 : 1;
      var qy = cy - sr.top < sr.height / 2 ? 0 : 1;
      return qy * 2 + qx;
    }

    function snapToQuadrant(q, animate) {
      currentQ = q;
      var pos = quadrantPositions()[q];
      if (pos) setPos(pos.x, pos.y, animate !== false);
      try {
        sessionStorage.setItem(STORAGE_KEY, String(q));
      } catch (e) {}
      updateLines();
    }

    function allConnectorPairs() {
      var sr = stageRect();
      var cr = cardRect();
      var cardCorners = [
        { x: cr.left - sr.left, y: cr.top - sr.top },
        { x: cr.right - sr.left, y: cr.top - sr.top },
        { x: cr.left - sr.left, y: cr.bottom - sr.top },
        { x: cr.right - sr.left, y: cr.bottom - sr.top },
      ];
      var extCorners = [
        { x: 0, y: 0 },
        { x: sr.width, y: 0 },
        { x: 0, y: sr.height },
        { x: sr.width, y: sr.height },
      ];
      var pairs = [];
      for (var i = 0; i < 4; i++) {
        pairs.push({ from: cardCorners[i], to: extCorners[i] });
      }
      return pairs;
    }

    function updateLines() {
      var sr = stageRect();
      var pairs = allConnectorPairs();
      svg.setAttribute('viewBox', '0 0 ' + sr.width + ' ' + sr.height);
      for (var j = 0; j < lines.length; j++) {
        var pts = pairs[j];
        lines[j].setAttribute('x1', pts.from.x);
        lines[j].setAttribute('y1', pts.from.y);
        lines[j].setAttribute('x2', pts.to.x);
        lines[j].setAttribute('y2', pts.to.y);
      }
    }

    card.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true;
      card.setPointerCapture(e.pointerId);
      card.style.cursor = 'grabbing';
      setTransition(false);
      var cr = cardRect();
      var sr = stageRect();
      offX = e.clientX - cr.left;
      offY = e.clientY - cr.top;
      e.preventDefault();
    });

    card.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var sr = stageRect();
      var x = e.clientX - sr.left - offX;
      var y = e.clientY - sr.top - offY;
      var w = card.offsetWidth;
      var h = card.offsetHeight;
      x = Math.max(0, Math.min(sr.width - w, x));
      y = Math.max(0, Math.min(sr.height - h, y));
      setPos(x, y, false);
      currentQ = nearestQuadrant(x + w / 2 + sr.left, y + h / 2 + sr.top);
      updateLines();
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      card.style.cursor = 'grab';
      try {
        card.releasePointerCapture(e.pointerId);
      } catch (err) {}
      var cr = cardRect();
      snapToQuadrant(
        nearestQuadrant(cr.left + cr.width / 2, cr.top + cr.height / 2),
        true
      );
    }

    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', endDrag);

    card.addEventListener(
      'transitionend',
      function (e) {
        if (e.propertyName === 'left' || e.propertyName === 'top') updateLines();
      },
      true
    );

    window.addEventListener('resize', function () {
      snapToQuadrant(currentQ, false);
    });

    var saved = null;
    try {
      saved = sessionStorage.getItem(STORAGE_KEY);
    } catch (e2) {}
    snapToQuadrant(saved !== null ? parseInt(saved, 10) || 0 : 0, false);
    requestAnimationFrame(updateLines);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();})();
