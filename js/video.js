/* video.js — TV popup player
   - Hover TV → screen glows (CSS handles this)
   - Click TV → modal opens, self-hosted video plays
   - Click backdrop or ✕ or Escape → modal closes
   ♿ Focus trapped in modal; returns to TV on close
*/

(function () {
  'use strict';

  var VIDEO_SRC = 'assets/video/hero-film-1.mp4';

  var tvUnit     = document.getElementById('tv-unit');
  var modal      = document.getElementById('video-modal');
  var backdrop   = document.getElementById('modal-backdrop');
  var closeBtn   = document.getElementById('modal-close');
  var modalVideo = document.getElementById('modal-video');

  if (!tvUnit || !modal || !modalVideo) return;

  function openModal () {
    modalVideo.src = VIDEO_SRC;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    modalVideo.load();
    var playPromise = modalVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () { /* autoplay blocked — user can press play */ });
    }
    setTimeout(function () { closeBtn.focus(); }, 50);
  }

  function closeModal () {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    tvUnit.focus();
  }

  tvUnit.addEventListener('click', openModal);

  tvUnit.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  });

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
