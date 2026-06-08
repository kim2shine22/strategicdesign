/* qa.js — Q&A transcript popup + flower hover burst
   ─────────────────────────────────────────────────
   Flower hover  → silver Tinkerbell burst (same animation as flowerspine blooms)
   Card click    → modal opens with corresponding qXtranscript.svg
   Backdrop / ✕ / Escape → closes modal
   ♿ focus trap, focus return, keyboard open/close

   Mobile: tap flower or card → same click handler opens modal.
   The ::before glow approach was removed — the burst animation uses
   filter:drop-shadow on the flower img itself, so it follows the
   flower's alpha channel and never bleeds onto the card text.
*/

(function () {
  'use strict';

  /* ── Elements ─────────────────────────────────── */
  var cards    = document.querySelectorAll('.qa-card-wrap[data-transcript]');
  var modal    = document.getElementById('qa-modal');
  var backdrop = document.getElementById('qa-modal-backdrop');
  var closeBtn = document.getElementById('qa-modal-close');
  var modalImg = document.getElementById('qa-modal-img');

  if (!modal || !modalImg || !cards.length) return;

  var lastFocused = null;

  /* ── Flower silver burst (restart-on-every-hover) ── */
  function burstFlower(flower) {
    if (!flower) return;
    flower.classList.remove('is-hovering');
    void flower.offsetWidth;          /* flush layout to restart CSS animation */
    flower.classList.add('is-hovering');
  }

  /* ── Modal open / close ───────────────────────── */
  function openModal(src, alt) {
    lastFocused = document.activeElement;
    modalImg.src = src;
    modalImg.alt = alt || 'Transcript';
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { closeBtn.focus(); }, 60);
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    modalImg.src = '';
    modalImg.alt = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  /* ── Wire each card ───────────────────────────── */
  cards.forEach(function (card) {
    var flower = card.querySelector('.qa-flower');

    /* Flower hover — burst animation, desktop only (touch devices skip hover) */
    if (flower) {
      card.addEventListener('mouseenter', function () { burstFlower(flower); });
      card.addEventListener('mouseleave', function () {
        flower.classList.remove('is-hovering');
      });
    }

    /* Click / tap anywhere on card → open modal */
    card.addEventListener('click', function () {
      lastFocused = card;
      openModal(card.dataset.transcript, card.dataset.transcriptAlt);
    });

    /* Keyboard open */
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lastFocused = card;
        openModal(card.dataset.transcript, card.dataset.transcriptAlt);
      }
    });
  });

  /* ── Image error handling ─────────────────────── */
  modalImg.addEventListener('error', function () {
    console.error(
      '[qa.js] Failed to load transcript SVG.\n' +
      'Path attempted: ' + modalImg.src + '\n' +
      'Check: (1) file exists in assets/SVG/, (2) filename matches exactly, ' +
      '(3) file is committed and pushed to GitHub.'
    );
  });

  /* ── Close triggers ───────────────────────────── */
  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });

  /* ── Focus trap ───────────────────────────────── */
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
