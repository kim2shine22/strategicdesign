/* nav.js — mobile navigation toggle */

(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav    = document.querySelector('.primary-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });

}());
