/* cases.js — case study card scroll-in
   ─────────────────────────────────────
   Cards start offset toward the outer edges (.case-from-left /
   .case-from-right, set in CSS). When a card first scrolls into
   view, .is-in is added and the observer releases it — the card
   slides to rest ONCE and never moves again.

   Fallback: if IntersectionObserver is unavailable (very old
   browsers), all cards are shown immediately with no animation.
*/

(function () {
  'use strict';

  var cards = document.querySelectorAll('.case-from-left, .case-from-right');
  if (!cards.length) return;

  /* No observer support → show everything, skip animation */
  if (!('IntersectionObserver' in window)) {
    cards.forEach(function (card) { card.classList.add('is-in'); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);  /* one-shot — never moves again */
        }
      });
    },
    {
      threshold: 0.15,          /* fire when 15% of the card is visible */
      rootMargin: '0px 0px -40px 0px'  /* slight bottom inset so cards are
                                          genuinely on screen when they slide */
    }
  );

  cards.forEach(function (card) { observer.observe(card); });

}());
