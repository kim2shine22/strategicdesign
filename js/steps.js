/* steps.js — step hover interactions
   Pilot: Step 1 only. Extend by adding entries to STEPS array.

   Hover the step label OR the invisible flower hotspot →
     - Gold glitter animation fires on the step label
     - Gold glow overlay pulses on the corresponding flower
     - Defcard fades in near the label
   Moving onto the card keeps it visible (prevents flicker).
   Keyboard: focus/blur on label also triggers.
*/

(function () {
  'use strict';

  /* ── Step registry ──────────────────────────────────────────
     Add one entry per step as defcards are produced.
     id matches the CSS suffix: '1', '234', '5', '6', '7'
  ─────────────────────────────────────────────────────────── */
  var STEPS = [
    { id: '1' }
    /* { id: '234' }, { id: '5' }, { id: '6' }, { id: '7' } */
  ];

  /* ── Helper ─────────────────────────────────────────────── */
  function qs (selector) {
    return document.querySelector(selector);
  }

  /* ── Wire each step ──────────────────────────────────────── */
  STEPS.forEach(function (step) {
    var label   = qs('.step-label--'   + step.id);
    var hotspot = qs('.flower-hotspot--' + step.id);
    var card    = qs('.step-card--'    + step.id);
    var glow    = qs('.flower-glow--'  + step.id);

    if (!label) return;

    function activate () {
      label && label.classList.add('is-active');
      card  && card.classList.add('is-active');
      glow  && glow.classList.add('is-active');
    }

    function deactivate () {
      label && label.classList.remove('is-active');
      card  && card.classList.remove('is-active');
      glow  && glow.classList.remove('is-active');
    }

    /* Hover triggers: label + flower hotspot */
    [label, hotspot].forEach(function (el) {
      if (!el) return;
      el.addEventListener('mouseenter', activate);
      el.addEventListener('mouseleave', deactivate);
    });

    /* Keyboard: focus on label */
    label.addEventListener('focus', activate);
    label.addEventListener('blur',  deactivate);

    /* Moving mouse onto card keeps it open */
    if (card) {
      card.addEventListener('mouseenter', activate);
      card.addEventListener('mouseleave', deactivate);
    }

    /* Keyboard: Enter/Space on label toggles card */
    label.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        label.classList.contains('is-active') ? deactivate() : activate();
      }
    });

    /* Click on label toggles card (touch devices) */
    label.addEventListener('click', function () {
      label.classList.contains('is-active') ? deactivate() : activate();
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') deactivate();
    });
  });

}());
