/* resume.js — resume card LinkedIn popup
   ────────────────────────────────────────
   The entire resumecard.svg is a button. Clicking anywhere on it
   opens the LinkedIn confirmation modal — same pattern as the
   LinkedIn overlay on the contact page.
   ♿ Focus return on close, Escape to dismiss, focus trap
*/

(function () {
  'use strict';

  var cardBtn  = document.getElementById('resume-card-trigger');
  var modal    = document.getElementById('linkedin-modal');
  var backdrop = document.getElementById('linkedin-backdrop');
  var stayBtn  = document.getElementById('linkedin-stay');
  var goBtn    = document.getElementById('linkedin-go');

  if (!cardBtn || !modal) return;

  /* ── Open / close ──────────────────────────────────── */
  function openModal() {
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { if (stayBtn) stayBtn.focus(); }, 60);
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    cardBtn.focus();
  }

  /* ── Triggers ──────────────────────────────────────── */
  cardBtn.addEventListener('click', openModal);

  /* Clicking "Visit LinkedIn" closes the modal; the <a> then navigates */
  if (goBtn) {
    goBtn.addEventListener('click', closeModal);
  }

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (stayBtn)  stayBtn.addEventListener('click',  closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });

  /* ── Focus trap ────────────────────────────────────── */
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
