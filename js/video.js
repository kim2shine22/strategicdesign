/* video.js — TV popup player
   - Hover TV (desktop) → screen glows (CSS handles this)
   - Click/tap TV (desktop) OR mobile media block → modal opens, self-hosted video plays WITH sound
   - Click backdrop or ✕ or Escape → modal closes
   ♿ Focus trapped in modal; returns to whichever trigger opened it

   The hero previews (desktop TV screen + mobile stacked video) stay MUTED —
   that is the only state browsers allow for autoplay. The modal video has no
   muted attribute, so it plays with sound; the opening click is the user
   gesture browsers require to permit audio. If a browser still blocks audio
   autoplay, the modal video has native controls as a fallback.
*/

(function () {
  'use strict';

  var VIDEO_SRC = 'assets/video/hero-film-1.mp4';

  var tvUnit       = document.getElementById('tv-unit');         /* desktop TV */
  var tvUnitMobile = document.getElementById('tv-unit-mobile');  /* mobile media block */
  var modal        = document.getElementById('video-modal');
  var backdrop     = document.getElementById('modal-backdrop');
  var closeBtn     = document.getElementById('modal-close');
  var modalVideo   = document.getElementById('modal-video');

  /* Need the modal + video + at least one trigger to do anything */
  if (!modal || !modalVideo || (!tvUnit && !tvUnitMobile)) return;

  var lastTrigger = null;  /* remember which element opened the modal, for focus return */

  function openModal (trigger) {
    lastTrigger = trigger || document.activeElement;
    modalVideo.src = VIDEO_SRC;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    modalVideo.load();
    var playPromise = modalVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () { /* autoplay blocked — user presses play via controls */ });
    }
    setTimeout(function () { closeBtn.focus(); }, 50);
  }

  function closeModal () {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  }

  /* Wire a trigger element (desktop TV or mobile media) to open the modal */
  function wireTrigger (el) {
    if (!el) return;
    el.addEventListener('click', function () { openModal(el); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(el);
      }
    });
  }

  wireTrigger(tvUnit);
  wireTrigger(tvUnitMobile);

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video[controls]'
    );
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

}());
