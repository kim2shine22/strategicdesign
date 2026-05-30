/* steps.js — step hover interactions
   Pilot: Step 1 only. Extend by adding entries to STEPS array.

   On hover enter: single glitter burst fires on label + flower glow.
   On hover leave: everything clears.
   On re-hover: burst replays (force-reflow restarts the animation).
   Card stays open while mouse is on it.
*/

(function () {
  'use strict';

  var STEPS = [
    { id: '1' }
    /* { id: '234' }, { id: '5' }, { id: '6' }, { id: '7' } */
  ];

  function qs(selector) {
    return document.querySelector(selector);
  }

  /* Force CSS animation to restart by removing class, flushing layout, re-adding */
  function restartAnimation(el) {
    if (!el) return;
    el.classList.remove('is-active');
    void el.offsetWidth; /* flush — tells browser to recalculate before next line */
    el.classList.add('is-active');
  }

  STEPS.forEach(function (step) {
    var label   = qs('.step-label--'    + step.id);
    var hotspot = qs('.flower-hotspot--' + step.id);
    var card    = qs('.step-card--'     + step.id);
    var glow    = qs('.flower-glow--'   + step.id);

    if (!label) return;

    function activate() {
      /* Restart burst animations fresh each hover */
      restartAnimation(label);
      restartAnimation(glow);
      /* Card just fades in — no restart needed */
      if (card) card.classList.add('is-active');
    }

    function deactivate() {
      if (label) label.classList.remove('is-active');
      if (glow)  glow.classList.remove('is-active');
      if (card)  card.classList.remove('is-active');
    }

    [label, hotspot].forEach(function (el) {
      if (!el) return;
      el.addEventListener('mouseenter', activate);
      el.addEventListener('mouseleave', deactivate);
    });

    /* Card staying open while moused over */
    if (card) {
      card.addEventListener('mouseenter', function () {
        if (card) card.classList.add('is-active');
      });
      card.addEventListener('mouseleave', deactivate);
    }

    /* Keyboard access */
    label.addEventListener('focus', activate);
    label.addEventListener('blur',  deactivate);
    label.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        label.classList.contains('is-active') ? deactivate() : activate();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') deactivate();
    });
  });

}());
