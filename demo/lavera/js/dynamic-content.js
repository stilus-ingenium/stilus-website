/* =========================================================================
 *  Lavera — Dynamic Content (ربط الموقع بالـ Backend)
 *  -------------------------------------------------------------------------
 *  إذا توفّر window.API_BASE (محلي/إنتاج) يجلب الخدمات/الأطباء/الشهادات/المعرض
 *  من الـ API ويعرضها باللغة الحالية، ويعيد الرسم عند تبديل اللغة.
 *  fallback آمن: لو فشل أي طلب، يبقى المحتوى الثابت كما هو (لا يكسر شيئاً).
 * ========================================================================= */
(function () {
  'use strict';
  var API = window.API_BASE;
  if (!API) return; // لا backend → المحتوى الثابت يكفي

  function lang() { return (document.documentElement.getAttribute('lang') || 'ar'); }
  function L(obj) { if (!obj) return ''; return obj[lang()] || obj.ar || obj.en || ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]); }); }

  async function get(path) {
    var r = await fetch(API + path, { headers: { 'Accept': 'application/json' } });
    if (!r.ok) throw new Error(path + ' ' + r.status);
    var j = await r.json();
    return j.data || j;
  }

  var ICON = { laser:'zap', face:'syringe', botox:'syringe', filler:'droplet', glow:'sparkles', peel:'layers', skin:'sparkles', scar:'shield-check', thread:'scissors' };
  function svcIcon(k){ return ICON[k] || 'sparkles'; }

  function renderServices(list) {
    var grid = document.querySelector('.services-grid');
    if (!grid || !list.length) return;
    grid.innerHTML = list.map(function (s) {
      return '<div class="service-card">' +
        '<div class="service-icon"><i data-lucide="' + svcIcon(s.icon_key) + '"></i></div>' +
        '<h3 class="service-card-title">' + esc(L(s.name)) + '</h3>' +
        '<p class="service-card-description">' + esc(L(s.description)) + '</p>' +
        '<a href="/services" class="service-link"><span>' + (lang()==='ar'?'اكتشف المزيد':'Learn More') + '</span>' +
        '<i data-lucide="' + (lang()==='ar'?'arrow-left':'arrow-right') + '"></i></a>' +
      '</div>';
    }).join('');
  }

  function renderDoctors(list) {
    var grid = document.querySelector('.doctors-grid');
    if (!grid || !list.length) return;
    grid.innerHTML = list.map(function (d) {
      var tags = (d.languages || []).slice(0,2).map(function(t){ return '<span class="specialty-tag">'+esc(t)+'</span>'; }).join('');
      var yexp = d.years_experience ? (d.years_experience + '+ ' + (lang()==='ar'?'سنة خبرة':'yrs exp')) : '';
      return '<div class="doctor-card">' +
        '<div class="doctor-image"' + (d.avatar?(' style="background-image:linear-gradient(0deg,rgba(20,16,12,.1),rgba(20,16,12,.1)),url(\''+esc(d.avatar)+'\');background-size:cover;background-position:center"'):'') + '>' +
          '<div class="doctor-reveal"><p>' + esc(L(d.specialty)) + '</p>' +
          '<div class="doctor-social"><a href="/appointment" aria-label="book"><i data-lucide="calendar-check"></i></a><a href="tel:+966582222898" aria-label="call"><i data-lucide="phone"></i></a></div></div>' +
        '</div>' +
        '<div class="doctor-info"><h3 class="doctor-name">' + esc(L(d.name)) + '</h3>' +
        '<p class="doctor-specialty">' + esc(L(d.specialty)) + '</p>' +
        (yexp?'<p class="doctor-experience">' + esc(yexp) + '</p>':'') +
        '<div class="doctor-specialties">' + tags + '</div></div>' +
      '</div>';
    }).join('');
  }

  var STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26 6.9.6-5.22 4.52 1.56 6.74L12 17.27 5.86 20.12l1.56-6.74L2.2 8.86l6.9-.6z"/></svg>';
  function renderTestimonials(list) {
    var grid = document.querySelector('.testimonials-grid');
    if (!grid || !list.length) return;
    grid.innerHTML = list.slice(0, 6).map(function (t) {
      var stars = STAR.repeat(t.rating || 5);
      return '<div class="testimonial-card">' +
        '<div class="testimonial-stars">' + stars + '</div>' +
        '<p class="testimonial-text">"' + esc(L(t.body)).replace(/^"|"$/g,'') + '"</p>' +
        '<div class="testimonial-author"><div class="testimonial-avatar"></div>' +
        '<div><div class="testimonial-name">' + esc(t.author && t.author.name) + '</div>' +
        '<div class="testimonial-service">' + esc(t.author && t.author.title || '') + '</div></div></div>' +
      '</div>';
    }).join('');
  }

  function renderGallery(list) {
    var grid = document.querySelector('.gallery-grid');
    if (!grid || !list.length) return;
    grid.innerHTML = list.map(function (g) {
      var img = g.after_image || g.thumbnail || g.before_image || '';
      return '<div class="gallery-item"' + (img?(' style="background-image:url(\''+esc(img)+'\')"'):'') + ' onclick="openLightbox(\'' + esc(img) + '\')">' +
        '<div class="gallery-overlay"><span>' + esc(L(g.title) || L(g.caption)) + '</span></div></div>';
    }).join('');
  }

  function refreshIcons() { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); }

  var CACHE = {};
  async function loadAll() {
    var jobs = [
      ['services', renderServices], ['doctors', renderDoctors],
      ['testimonials', renderTestimonials], ['gallery', renderGallery]
    ];
    for (var i = 0; i < jobs.length; i++) {
      var key = jobs[i][0], fn = jobs[i][1];
      try {
        if (!CACHE[key]) CACHE[key] = await get('/v1/' + key);
        fn(CACHE[key]);
      } catch (e) { /* fallback: المحتوى الثابت يبقى */ }
    }
    refreshIcons();
  }

  function rerender() {
    if (CACHE.services) try { renderServices(CACHE.services); } catch(e){}
    if (CACHE.doctors) try { renderDoctors(CACHE.doctors); } catch(e){}
    if (CACHE.testimonials) try { renderTestimonials(CACHE.testimonials); } catch(e){}
    if (CACHE.gallery) try { renderGallery(CACHE.gallery); } catch(e){}
    refreshIcons();
  }

  function ready(fn){ if (document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(loadAll);
  document.addEventListener('languageChanged', rerender);
})();
