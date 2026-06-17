/* =========================================================================
 * Lavera — Visuals 2050
 * Before/After slider · Testimonials seamless carousel · Reveal-on-scroll
 * كل دالة آمنة: تعمل فقط إذا وُجدت عناصرها.
 * ========================================================================= */
(function () {
  'use strict';

  /* ---------- 1) Before / After sliders ---------- */
  function initBeforeAfter() {
    document.querySelectorAll('.ba-slider').forEach(function (slider) {
      var before  = slider.querySelector('.ba-before');
      var divider = slider.querySelector('.ba-divider');
      var handle  = slider.querySelector('.ba-handle');
      if (!before || !divider || !handle) return;

      function setPos(pct) {
        pct = Math.max(0, Math.min(100, pct));
        // في RTL نعكس الاتجاه بصرياً ليبقى السحب طبيعياً
        before.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
        divider.style.insetInlineStart = pct + '%';
        handle.style.insetInlineStart  = pct + '%';
      }
      setPos(50);

      var dragging = false;
      function fromEvent(e) {
        var rect = slider.getBoundingClientRect();
        var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        var pct = (x / rect.width) * 100;
        if (document.documentElement.getAttribute('dir') === 'rtl') pct = 100 - pct;
        setPos(pct);
      }
      var down = function (e) { dragging = true; fromEvent(e); };
      var move = function (e) { if (dragging) { fromEvent(e); e.preventDefault(); } };
      var up   = function () { dragging = false; };
      slider.addEventListener('mousedown', down);
      slider.addEventListener('touchstart', down, { passive: true });
      window.addEventListener('mousemove', move, { passive: false });
      window.addEventListener('touchmove', move, { passive: false });
      window.addEventListener('mouseup', up);
      window.addEventListener('touchend', up);
    });
  }

  /* ---------- 2) Testimonials seamless carousel ---------- */
  function initCarousel() {
    document.querySelectorAll('.tcar-track').forEach(function (track) {
      if (track.dataset.cloned) return;
      track.dataset.cloned = '1';
      // نكرّر المحتوى مرة لعمل لوب سلس (animation تتحرك -50%)
      var html = track.innerHTML;
      track.innerHTML = html + html;
    });
  }

  /* ---------- 3) Reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    try { initBeforeAfter(); } catch (e) {}
    try { initCarousel(); } catch (e) {}
    try { initReveal(); } catch (e) {}
  });
})();
