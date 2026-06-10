/* steps.js — flowerspine step interactions
   ─────────────────────────────────────────
   DESKTOP: hover system on the flowerspine — hotspot/label/card
   hover fires the glitter burst, glow, and defcard popup for all
   7 steps. Unchanged behavior.

   MOBILE: the spine is hidden (CSS); the .steps-mobile list shows
   instead. Tapping a row (flower + label button) opens that step's
   defcard in the #step-modal popup. Backdrop / ✕ / Escape close it.
   ♿ focus trap + focus return, mirroring the QA transcript modal.
*/

(function () {
  'use strict';

  /* ════════════════ DESKTOP HOVER SYSTEM ════════════════ */

  var STEPS = [
    { id: '1', labelId: '1' },
    { id: '2', labelId: '2' },
    { id: '3', labelId: '3' },
    { id: '4', labelId: '4' },
    { id: '5', labelId: '5' },
    { id: '6', labelId: '6' },
    { id: '7', labelId: '7' }
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
     so we don't stack duplicate handlers. */
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

  /* ════════════════ MOBILE DEFCARD MODAL ════════════════ */

  var rows       = document.querySelectorAll('.step-mobile-row[data-defcard]');
  var modal      = document.getElementById('step-modal');
  var backdrop   = document.getElementById('step-modal-backdrop');
  var closeBtn   = document.getElementById('step-modal-close');
  var modalImg   = document.getElementById('step-modal-img');

  if (!modal || !modalImg || !rows.length) return;

  var lastFocused = null;

  function openStepModal(src, alt, trigger) {
    lastFocused = trigger || document.activeElement;
    modalImg.src = src;
    modalImg.alt = alt || 'Step definition';
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { closeBtn.focus(); }, 60);
  }

  function closeStepModal() {
    modal.setAttribute('hidden', '');
    modalImg.src = '';
    modalImg.alt = '';
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  rows.forEach(function (row) {
    /* <button> gives us click, tap, Enter, and Space for free */
    row.addEventListener('click', function () {
      openStepModal(row.dataset.defcard, row.getAttribute('aria-label'), row);
    });
  });

  /* Image error handling */
  modalImg.addEventListener('error', function () {
    if (!modalImg.src || modalImg.src.indexOf('.svg') === -1) return;
    console.error(
      '[steps.js] Failed to load defcard SVG.\n' +
      'Path attempted: ' + modalImg.src + '\n' +
      'Check: (1) file exists in assets/SVG/, (2) filename matches exactly, ' +
      '(3) file is committed and pushed to GitHub.'
    );
  });

  /* Close triggers */
  backdrop.addEventListener('click', closeStepModal);
  closeBtn.addEventListener('click', closeStepModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeStepModal();
  });

  /* Focus trap */
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = modal.querySelectorAll(
      'button, [href], [tabindex]:not([tabindex="-1"])'
    );
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

}());
