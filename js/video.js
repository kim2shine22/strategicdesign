/* video.js — TV popup player
   - Hover TV → screen glows (CSS handles this)
   - Click TV or badge → modal opens, video plays on loop
   - Click backdrop or ✕ or Escape → modal closes, video stops
   ♿ Focus is trapped in modal while open; returns to TV on close
*/

(function () {
  'use strict';

  /* -------------------------------------------------------
     CONFIGURATION
     Paste your YouTube video ID here when ready.
     Example: if URL is youtube.com/watch?v=abc123, ID = abc123
  ------------------------------------------------------- */
  var VIDEO_ID = 'PASTE_VIDEO_ID_HERE';

  /* YouTube embed URL — loop=1 requires playlist param with same ID */
  function buildEmbedURL () {
    return 'https://www.youtube.com/embed/' + VIDEO_ID
      + '?autoplay=1&loop=1&playlist=' + VIDEO_ID
      + '&rel=0&modestbranding=1&color=white';
  }

  /* -------------------------------------------------------
     Elements
  ------------------------------------------------------- */
  var tvUnit    = document.getElementById('tv-unit');
  var modal     = document.getElementById('video-modal');
  var backdrop  = document.getElementById('modal-backdrop');
  var closeBtn  = document.getElementById('modal-close');
  var iframe    = document.getElementById('video-iframe');

  if (!tvUnit || !modal || !iframe) return;

  /* -------------------------------------------------------
     Open modal
  ------------------------------------------------------- */
  function openModal () {
    iframe.src = buildEmbedURL();
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    /* Move focus to close button */
    setTimeout(function () { closeBtn.focus(); }, 50);
  }

  /* -------------------------------------------------------
     Close modal — stop video by clearing src
  ------------------------------------------------------- */
  function closeModal () {
    iframe.src = '';
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';

    /* Return focus to TV */
    tvUnit.focus();
  }

  /* -------------------------------------------------------
     Event listeners
  ------------------------------------------------------- */

  /* Click TV (wrapper, screen, or badge) → open */
  tvUnit.addEventListener('click', openModal);

  /* Enter/Space on TV for keyboard users */
  tvUnit.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  });

  /* Click backdrop → close */
  backdrop.addEventListener('click', closeModal);

  /* Click ✕ → close */
  closeBtn.addEventListener('click', closeModal);

  /* Escape → close */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  /* -------------------------------------------------------
     Focus trap — keep Tab inside modal while open
  ------------------------------------------------------- */
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

}());
