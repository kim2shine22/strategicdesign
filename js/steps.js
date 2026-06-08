/* steps.js — flower hover interactions, all 7 steps
   ─────────────────────────────────────────────────
   Each step has:
     id       → suffix for flower-hotspot--N, flower-glow--N, step-card--N
     labelId  → suffix for step-label--N (steps 2–4 share 'step-label--234')

   Hover any flower hotspot, its step label, OR its open defcard → activate.
   On re-hover the glitter burst replays.

   Steps 2–4 share one visual label (step-label--234). Keyboard focus on
   that label opens step 2's card (the group representative). Flowers 3 & 4
   are mouse / touch only.

   Positions of hotspot/glow/card divs for steps 2–7 are PLACEHOLDERS.
   Tune each in DevTools, then lock the values into style.css.
*/

(function () {
  'use strict';

  /* id = DOM suffix, labelId = which step-label to animate */
  var STEPS = [
    { id: '1', labelId: '1'   },
    { id: '2', labelId: '234' },  /* keyboard on label--234 shows card 2 */
    { id: '3', labelId: '234' },  /* mouse/touch only for card 3 */
    { id: '4', labelId: '234' },  /* mouse/touch only for card 4 */
    { id: '5', labelId: '5'   },
    { id: '6', labelId: '6'   },
    { id: '7', labelId: '7'   }
  ];

  function qs(sel) { return document.querySelector(sel); }

  var spineWrap = qs('.spine-wrap');

  /* Restart a CSS animation by forcing a layout flush */
  function restartAnim(el) {
    if (!el) return;
    el.classList.remove('is-active');
    void el.offsetWidth;
    el.classList.add('is-active');
  }

  /* Track which steps have already bound keyboard events to a shared label,
     so we don't stack duplicate handlers on step-label--234. */
  var labelKeyboardBound = {};

  STEPS.forEach(function (step) {
    var hotspot = qs('.flower-hotspot--' + step.id);
    var glow    = qs('.flower-glow--'    + step.id);
    var card    = qs('.step-card--'      + step.id);
    var label   = qs('.step-label--'     + step.labelId);

    /* activate: glitter burst + fade in card */
    function activate() {
      restartAnim(label);
      restartAnim(glow);
      if (card)      card.classList.add('is-active');
      if (spineWrap) spineWrap.classList.add('has-active-card');
    }

    function deactivate() {
      if (label)     label.classList.remove('is-active');
      if (glow)      glow.classList.remove('is-active');
      if (card)      card.classList.remove('is-active');
      if (spineWrap) spineWrap.classList.remove('has-active-card');
    }

    /* Mouse: hotspot, label, and open card are all entry points */
    [hotspot, card].forEach(function (el) {
      if (!el) return;
      el.addEventListener('mouseenter', activate);
      el.addEventListener('mouseleave', deactivate);
    });

    if (label) {
      label.addEventListener('mouseenter', activate);
      label.addEventListener('mouseleave', deactivate);
    }

    /* Keyboard: only bind once per unique labelId to avoid stacked handlers */
    if (label && !labelKeyboardBound[step.labelId]) {
      labelKeyboardBound[step.labelId] = true;

      label.addEventListener('focus', activate);
      label.addEventListener('blur',  deactivate);
      label.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          label.classList.contains('is-active') ? deactivate() : activate();
        }
      });
    }

    /* Global Escape closes any open card */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') deactivate();
    });
  });

}());
