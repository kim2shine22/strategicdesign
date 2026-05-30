/* steps.js — step hover interactions
   Pilot: Step 1. Extend STEPS array as defcards are produced.

   Any hover entry point (label, flower hotspot, OR defcard) triggers:
   - Silver glitter burst on the step label
   - Silver-white light burst on the corresponding flower
   - Defcard fades in
   - spine-wrap elevates above methodology text

   On re-hover: burst replays (void offsetWidth restarts CSS animation).
*/

(function () {
  'use strict';

  var STEPS = [
    { id: '1' }
    /* { id: '234' }, { id: '5' }, { id: '6' }, { id: '7' } */
  ];

  function qs(sel) { return document.querySelector(sel); }

  var spineWrap = qs('.spine-wrap');

  /* Restart a CSS animation by flushing layout between class removes/adds */
  function restartAnim(el) {
    if (!el) return;
    el.classList.remove('is-active');
    void el.offsetWidth;
    el.classList.add('is-active');
  }

  STEPS.forEach(function (step) {
    var label   = qs('.step-label--'    + step.id);
    var hotspot = qs('.flower-hotspot--' + step.id);
    var card    = qs('.step-card--'     + step.id);
    var glow    = qs('.flower-glow--'   + step.id);

    if (!label) return;

    function activate() {
      /* Restart glitter burst on every hover entry */
      restartAnim(label);
      restartAnim(glow);
      /* Card fades in */
      if (card) card.classList.add('is-active');
      /* Elevate spine-wrap above methodology text */
      if (spineWrap) spineWrap.classList.add('has-active-card');
    }

    function deactivate() {
      if (label)     label.classList.remove('is-active');
      if (glow)      glow.classList.remove('is-active');
      if (card)      card.classList.remove('is-active');
      if (spineWrap) spineWrap.classList.remove('has-active-card');
    }

    /* All three entry points trigger full activate */
    [label, hotspot, card].forEach(function (el) {
      if (!el) return;
      el.addEventListener('mouseenter', activate);
      el.addEventListener('mouseleave', deactivate);
    });

    /* Keyboard */
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
