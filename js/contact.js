/* contact.js — contact page interactions
   ────────────────────────────────────────
   Email overlay  → copies address to clipboard; brief "Copied!" tooltip
   LinkedIn overlay → opens confirmation modal; user chooses stay or visit
   ♿ Focus return on modal close, Escape to dismiss, focus trap
*/

(function () {
  'use strict';

  var EMAIL = 'kim@kmatthewsdesign.com';

  /* ── Elements ──────────────────────────────────────── */
  var emailBtn    = document.querySelector('.contact-overlay--email');
  var linkedinBtn = document.querySelector('.contact-overlay--linkedin');
  var copyFeedback = emailBtn ? emailBtn.querySelector('.copy-feedback') : null;

  var modal       = document.getElementById('linkedin-modal');
  var backdrop    = document.getElementById('linkedin-backdrop');
  var stayBtn     = document.getElementById('linkedin-stay');
  var goBtn       = document.getElementById('linkedin-go');

  /* ── Email — copy to clipboard ──────────────────────── */
  if (emailBtn) {
    emailBtn.addEventListener('click', function () {
      var copied = function () {
        if (!copyFeedback) return;
        copyFeedback.textContent = 'Copied!';
        copyFeedback.classList.add('is-visible');
        setTimeout(function () {
          copyFeedback.classList.remove('is-visible');
          setTimeout(function () { copyFeedback.textContent = ''; }, 200);
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(copied).catch(fallbackCopy);
      } else {
        fallbackCopy();
        copied();
      }
    });
  }

  function fallbackCopy() {
    var ta = document.createElement('textarea');
    ta.value = EMAIL;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* silent */ }
    document.body.removeChild(ta);
  }

  /* ── LinkedIn — confirmation modal ─────────────────── */
  if (linkedinBtn && modal) {
    linkedinBtn.addEventListener('click', openModal);
  }

  function openModal() {
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { if (stayBtn) stayBtn.focus(); }, 60);
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (linkedinBtn) linkedinBtn.focus();
  }

  /* Clicking "Visit LinkedIn" closes modal then lets the <a> navigate */
  if (goBtn) {
    goBtn.addEventListener('click', function () {
      closeModal();
    });
  }

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (stayBtn)  stayBtn.addEventListener('click',  closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  /* Focus trap inside modal */
  if (modal) {
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
  }

}());
