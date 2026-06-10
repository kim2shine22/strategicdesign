/* cases.js — case study card scroll-in
   ─────────────────────────────────────
   Cards slide in from the outer edges (.case-from-left /
   .case-from-right) the first time they scroll into view,
   then never move again.

   Safety: the hidden starting state in CSS is scoped to
   body.js-anim, which is only added here. If this script is
   missing or fails, the boxes simply render visible — the
   section can never appear blank.
*/

(function () {
  'use strict';

  var cards = document.querySelectorAll('.case-from-left, .case-from-right');
  if (!cards.length) return;

  /* No observer support → leave cards visible, skip animation */
  if (!('IntersectionObserver' in window)) return;

  /* Confirm JS is live — this activates the hidden starting state */
  document.body.classList.add('js-anim');

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
