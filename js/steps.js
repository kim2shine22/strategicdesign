/* steps.js — flowerspine step interactions
   ─────────────────────────────────────────
   DESKTOP: Click system on the flowerspine.
   Hover over hotspot or label → glow fires (visual affordance only, no popup).
   Click hotspot or label → defcard popup opens.
   Click again, click outside, or Escape → popup closes.
   Only one card open at a time.

   MOBILE: spine is hidden (CSS); .steps-mobile list shows instead.
   Tap a row → defcard opens in #step-modal popup.
   Backdrop / ✕ / Escape close it.
   ♿ focus trap + focus return, mirroring the QA transcript modal.
*/

(function () {
  'use strict';

  /* ════════════════ DESKTOP CLICK SYSTEM ════════════════ */

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

  var spineWrap  = qs('.spine-wrap');
  var activeStep = null; /* tracks which step card is currently open */

  /* Restart a CSS animation by forcing a layout flush */
  function restartAnim(el) {
    if (!el) return;
    el.classList.remove('is-active');
    void el.offsetWidth;
    el.classList.add('is-active');
  }

  /* Close whichever card is currently open */
  function closeActive() {
    if (!activeStep) return;
    var s = activeStep;
    if (s.card)  s.card.classList.remove('is-active');
    if (s.label) s.label.classList.remove('is-active');
    if (s.glow)  s.glow.classList.remove('is-active');
    if (spineWrap) spineWrap.classList.remove('has-active-card');
    activeStep = null;
  }

  /* Open a step's defcard, closing any previously open one first */
  function openStep(step) {
    if (activeStep && activeStep !== step) closeActive();
    if (step.card) step.card.classList.add('is-active');
    if (spineWrap) spineWrap.classList.add('has-active-card');
    activeStep = step;
  }

  var labelKeyboardBound = {};

  STEPS.forEach(function (step) {
    var hotspot = qs('.flower-hotspot--' + step.id);
    var glow    = qs('.flower-glow--'    + step.id);
    var card    = qs('.step-card--'      + step.id);
    var label   = qs('.step-label--'     + step.labelId);

    /* Store refs so closeActive() can reach them */
    step.hotspot = hotspot;
    step.glow    = glow;
    step.card    = card;
    step.label   = label;

    /* ── Hover: glow only, no popup ──────────────────────
       Fires the glitter/glow animation as a visual cue that
       the element is clickable, but does NOT open the card. */
    [hotspot, label].forEach(function (el) {
      if (!el) return;
      el.addEventListener('mouseenter', function () {
        restartAnim(label);
        restartAnim(glow);
      });
      el.addEventListener('mouseleave', function () {
        /* Keep glow lit if this step's card is already open */
        if (card && card.classList.contains('is-active')) return;
        if (label) label.classList.remove('is-active');
        if (glow)  glow.classList.remove('is-active');
      });
    });

    /* ── Click: toggle defcard popup ─────────────────────
       First click opens; second click (or click-outside) closes. */
    function handleClick(e) {
      e.stopPropagation(); /* prevent document click from immediately closing */
      if (card && card.classList.contains('is-active')) {
        closeActive();
      } else {
        openStep(step);
        restartAnim(label);
        restartAnim(glow);
      }
    }

    if (hotspot) hotspot.addEventListener('click', handleClick);
    if (label)   label.addEventListener('click',   handleClick);

    /* Prevent clicks inside the open card from bubbling to document */
    if (card) {
      card.addEventListener('click', function (e) { e.stopPropagation(); });
    }

    /* ── Keyboard ─────────────────────────────────────── */
    if (label && !labelKeyboardBound[step.labelId]) {
      labelKeyboardBound[step.labelId] = true;

      label.addEventListener('focus', function () {
        restartAnim(label);
        restartAnim(glow);
      });
      label.addEventListener('blur', function () {
        if (card && card.classList.contains('is-active')) return;
        if (label) label.classList.remove('is-active');
        if (glow)  glow.classList.remove('is-active');
      });
      label.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      });
    }
  });

  /* Click anywhere outside the spine → close active card */
  document.addEventListener('click', function () {
    closeActive();
  });

  /* Escape → close active card */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeActive();
  });


  /* ════════════════ MOBILE DEFCARD MODAL ════════════════ */

  var rows     = document.querySelectorAll('.step-mobile-row[data-defcard]');
  var modal    = document.getElementById('step-modal');
  var backdrop = document.getElementById('step-modal-backdrop');
  var closeBtn = document.getElementById('step-modal-close');
  var modalImg = document.getElementById('step-modal-img');

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
    row.addEventListener('click', function () {
      openStepModal(row.dataset.defcard, row.getAttribute('aria-label'), row);
    });
  });

  modalImg.addEventListener('error', function () {
    if (!modalImg.src || modalImg.src.indexOf('.svg') === -1) return;
    console.error(
      '[steps.js] Failed to load defcard SVG.\n' +
      'Path attempted: ' + modalImg.src + '\n' +
      'Check: (1) file exists in assets/SVG/, (2) filename matches exactly, ' +
      '(3) file is committed and pushed to GitHub.'
    );
  });

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
