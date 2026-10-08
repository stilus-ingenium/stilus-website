/* =====================================================================
   صفحة المستثمرين — السلوك (مشترك بين العربية والإنجليزية)
   كل نصٍّ يراه المستخدم في القاموس T أدناه، لا في الكود.
   والتحقق هنا للراحة فقط — الحَكَم هو الخادم (invest-api)، ويعيد كل فحص.
   ===================================================================== */
(function () {
  'use strict';
  var LANG = document.documentElement.lang === 'en' ? 'en' : 'ar';
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:';
  var CFG = {
    api: LOCAL ? 'http://127.0.0.1:8787/api/invest' : '/api/invest',
    // مفتاح Turnstile العلني (ليس سراً). محلياً: مفتاح الاختبار الرسمي من Cloudflare الذي ينجح دائماً.
    turnstile: LOCAL ? '1x00000000000000000000AA' : '0x4AAAAAAFQVCRXO8ppptRE3',
    termsVersion: '2026-10-08',
    maxBytes: 10 * 1024 * 1024,
    min: 500, max: 1000000000 // «١٠ ملايين فأكثر»: المليار حدٌّ تقنيّ فقط، ويطابق الخادم
  };

  var T = {
    ar: {
      choose: 'اختر', noMatch: 'لا نتيجة. جرّب اسماً آخر أو اختر «أخرى».', next: 'التالي', send: 'أرسل الطلب', sending: 'جارٍ الإرسال', uploading: 'جارٍ رفع المستند',
      tiers: { community: 'مجتمع القلم', angel: 'شريك ملائكي', strategic: 'شريك استراتيجي', institutional: 'مستثمر مؤسسي' },
      foreignMin: 'لغير مواطني دول الخليج الحدّ الأدنى ٣٠٠ ألف ريال، لأن دخول الشريك الأجنبي يتطلب تسجيلاً نظامياً برسوم سنوية تُحمَّل على حصته.',
      capMsg: 'عند الالتزام لا تتجاوز حصة المستثمر الواحد {p}٪، أي {a} ريال في هذا المسار. ولك إبداء اهتمامك بأي مبلغ.',
      agreeAll: 'أوافق على الكل', agreedAll: 'وافقت على الكل',
      tierLbl: 'الشريحة:', estLbl: 'حصتك التقديرية', of: 'من ', company: 'الشركة الأم',
      sectorNames: { arts: 'قطاع الفن والمناسبات', contracting: 'قطاع المقاولات والحوكمة الميدانية', hr: 'قطاع الموارد البشرية والحضور', retail: 'قطاع التجزئة والتجارة', lifestyle: 'قطاع نمط الحياة والعافية', enterprise: 'قطاع حلول البرمجيات للمنشآت' },
      instHint: 'شريحة المستثمر المؤسسي على مستوى الشركة الأم حصراً.',
      communityProof: 'لشريحة مجتمع القلم: كشف حساب أو صورة رصيد حديثة تكفي.',
      fileBad: 'الملف يجب أن يكون PDF أو صورة، وحجمه حتى ١٠ ميغابايت.',
      fileOk: 'تم إرفاق: ',
      tsWait: 'أكمل التحقق الأمني أعلاه ثم أرسل.',
      errors: {
        network: 'تعذّر الاتصال بالخادم. تحقّق من اتصالك وأعد المحاولة.',
        rate: 'وصل من شبكتك عدد كبير من الطلبات. أعد المحاولة بعد ساعة.',
        captcha: 'لم ينجح التحقق الأمني. أعد المحاولة.',
        invalid: 'بعض البيانات غير مكتملة أو غير صحيحة. راجع الخطوات.',
        duplicate: 'لدينا طلب قائم بهذا البريد. أكّده من الرسالة التي وصلتك، أو انتظر قرار المراجعة.',
        server: 'حدث خطأ غير متوقع. أعد المحاولة بعد قليل.',
        too_large: 'المستند أكبر من ١٠ ميغابايت.',
        stake_cap: 'المبلغ يتجاوز الحد الأقصى لحصة المستثمر الواحد في هذا المسار. خفّض المبلغ وأعد الإرسال.',
        upload: 'وصلت بياناتك، لكن تعذّر رفع المستند. اضغط «أرسل الطلب» مرة أخرى لإعادة رفعه وحده.',
        expired: 'انتهت مهلة رفع المستند. حدّث الصفحة وأعد الإرسال.'
      },
      other: 'أخرى',
      // احتياط للمتصفحات القديمة بلا Intl.DisplayNames — وإلا فأسماء كل الدول تأتي من المتصفح بلغة الزائر
      countries: [['SA','السعودية'],['AE','الإمارات'],['KW','الكويت'],['QA','قطر'],['BH','البحرين'],['OM','عُمان'],
        ['YE','اليمن'],['EG','مصر'],['JO','الأردن'],['IQ','العراق'],['SD','السودان'],['MA','المغرب'],['TR','تركيا'],
        ['GB','المملكة المتحدة'],['US','الولايات المتحدة'],['OTHER','أخرى']]
    },
    en: {
      choose: 'Select', noMatch: 'No match. Try another name or choose “Other”.', next: 'Next', send: 'Submit', sending: 'Submitting', uploading: 'Uploading document',
      tiers: { community: 'Stilus Community', angel: 'Angel partner', strategic: 'Strategic partner', institutional: 'Institutional investor' },
      foreignMin: 'For non-GCC nationals the minimum is SAR 300,000: a foreign partner requires a regulatory registration with annual fees charged to their share.',
      capMsg: 'At commitment a single investor holds at most {p}%, i.e. SAR {a} on this track. You may express interest at any amount.',
      agreeAll: 'I agree to all', agreedAll: 'All agreed',
      tierLbl: 'Tier:', estLbl: 'Your indicative stake', of: 'of ', company: 'the parent company',
      sectorNames: { arts: 'the arts & events sector', contracting: 'the contracting & field governance sector', hr: 'the HR & attendance sector', retail: 'the retail & commerce sector', lifestyle: 'the lifestyle & wellbeing sector', enterprise: 'the enterprise software sector' },
      instHint: 'The institutional tier is available at parent-company level only.',
      communityProof: 'For the Community tier, a recent statement or balance screenshot is enough.',
      fileBad: 'The file must be a PDF or an image, up to 10 MB.',
      fileOk: 'Attached: ',
      tsWait: 'Complete the security check above, then submit.',
      errors: {
        network: 'We could not reach the server. Check your connection and try again.',
        rate: 'Too many requests from your network. Please try again in an hour.',
        captcha: 'The security check did not pass. Please try again.',
        invalid: 'Some details are missing or invalid. Please review the steps.',
        duplicate: 'We already have an open request for this email. Confirm it from the message we sent, or await the review decision.',
        server: 'Something unexpected happened. Please try again shortly.',
        too_large: 'The document is larger than 10 MB.',
        stake_cap: 'The amount exceeds the maximum single-investor stake for this track. Lower it and submit again.',
        upload: 'Your details arrived, but the document upload failed. Press Submit again to retry the upload only.',
        expired: 'The upload window expired. Refresh the page and submit again.'
      },
      other: 'Other',
      countries: [['SA','Saudi Arabia'],['AE','United Arab Emirates'],['KW','Kuwait'],['QA','Qatar'],['BH','Bahrain'],['OM','Oman'],
        ['YE','Yemen'],['EG','Egypt'],['JO','Jordan'],['IQ','Iraq'],['SD','Sudan'],['MA','Morocco'],['TR','Türkiye'],
        ['GB','United Kingdom'],['US','United States'],['OTHER','Other']]
    }
  }[LANG];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- الهيكل العام: شريط التنقّل والظهور التدريجي ---------- */
  var nav = $('.nav');
  addEventListener('scroll', function () { nav.classList.toggle('scrolled', scrollY > 10); }, { passive: true });
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .1 }) : null;
  $$('.rv').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });
  var burger = $('.burger'), links = $('.links');
  function setMenu(open) { links.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); }
  burger.setAttribute('aria-expanded', 'false');
  burger.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
  $$('.links a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  var form = $('#eoi');
  if (!form) return;

  /* ---------- قائمتا الدول: كل دول العالم مع بحث ----------
     الرموز نسخة مطابقة لـ COUNTRIES في invest-api/src/util.js (الاختبار يفرض التطابق).
     الأسماء من المتصفح بلغة الزائر، والبحث بالعربية والإنجليزية والرمز معاً.
     الـ select الأصلي يبقى مصدر القيمة (للنموذج والتحقق)، والحقل فوقه للبحث فقط. */
  var CODES = 'AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
  var GCC_FIRST = ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'];
  function regionNames(l) { try { return new Intl.DisplayNames([l], { type: 'region' }); } catch (e) { return null; } }
  var DN = { ar: regionNames('ar'), en: regionNames('en') }, FALLBACK = {};
  T.countries.forEach(function (c) { FALLBACK[c[0]] = c[1]; });
  function cname(code, l) {
    if (code === 'PS') return l === 'en' ? 'Palestine' : 'فلسطين';
    var n = DN[l] && DN[l].of(code);
    return n && n !== code ? n : (l === LANG && FALLBACK[code]) || code;
  }
  function norm(x) {
    return String(x || '').toLowerCase().replace(/[\u064B-\u0652\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
      .replace(/(^|\s)ال/g, '$1').replace(/\s+/g, ' ').trim();
  }
  var COUNTRY_LIST = (function () {
    var all = CODES.map(function (c) {
      var name = cname(c, LANG), other = cname(c, LANG === 'ar' ? 'en' : 'ar');
      return { code: c, name: name, hay: norm(name) + '|' + norm(other) + '|' + c.toLowerCase() };
    });
    var top = GCC_FIRST.map(function (c) { return all.filter(function (x) { return x.code === c; })[0]; });
    var rest = all.filter(function (x) { return GCC_FIRST.indexOf(x.code) < 0; })
      .sort(function (a, b) { return a.name.localeCompare(b.name, LANG); });
    return top.concat(rest, [{ code: 'OTHER', name: T.other, hay: norm(T.other) + '|other|اخري' }]);
  })();
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  $$('select[data-countries]').forEach(function (sel) {
    sel.innerHTML = '<option value="">' + T.choose + '</option>' +
      COUNTRY_LIST.map(function (c) { return '<option value="' + c.code + '">' + esc(c.name) + '</option>'; }).join('');
    combo(sel);
  });

  function combo(sel) {
    var box = document.createElement('div'), inp = document.createElement('input'), list = document.createElement('ul');
    box.className = 'cbx';
    inp.type = 'text'; inp.id = sel.id + '_q'; inp.className = 'cbx-in'; inp.autocomplete = 'off'; inp.spellcheck = false;
    inp.placeholder = T.choose;
    inp.setAttribute('role', 'combobox'); inp.setAttribute('aria-autocomplete', 'list');
    inp.setAttribute('aria-expanded', 'false'); inp.setAttribute('aria-controls', sel.id + '_list');
    list.id = sel.id + '_list'; list.className = 'cbx-list'; list.setAttribute('role', 'listbox'); list.hidden = true;
    box.innerHTML = '<svg class="ic cbx-chev" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
    box.insertBefore(inp, box.firstChild); box.appendChild(list);
    sel.parentNode.insertBefore(box, sel); sel.hidden = true; sel.tabIndex = -1;
    var lab = form.querySelector('label[for="' + sel.id + '"]'); if (lab) lab.htmlFor = inp.id;

    var shown = [], act = -1;
    function nameOf(code) { var c = COUNTRY_LIST.filter(function (x) { return x.code === code; })[0]; return c ? c.name : ''; }
    function render(q) {
      var n = norm(q);
      shown = !n ? COUNTRY_LIST : COUNTRY_LIST.filter(function (c) { return c.hay.indexOf(n) > -1; })
        .sort(function (a, b) { return (a.hay.indexOf(n) === 0 ? 0 : 1) - (b.hay.indexOf(n) === 0 ? 0 : 1); });
      list.innerHTML = shown.length ? shown.map(function (c, i) {
        return '<li role="option" id="' + sel.id + '_o' + i + '" data-i="' + i + '" aria-selected="' + (c.code === sel.value) + '">' + esc(c.name) + '</li>';
      }).join('') : '<li class="none" aria-disabled="true">' + T.noMatch + '</li>';
      var cur = -1; shown.forEach(function (c, i) { if (c.code === sel.value) cur = i; });
      move(n ? 0 : cur, true);
    }
    function move(i, center) {
      var lis = list.querySelectorAll('[role=option]');
      if (act > -1 && lis[act]) lis[act].classList.remove('act');
      act = shown.length ? Math.max(-1, Math.min(i, shown.length - 1)) : -1;
      if (act > -1) {
        lis[act].classList.add('act'); inp.setAttribute('aria-activedescendant', lis[act].id);
        lis[act].scrollIntoView({ block: center ? 'center' : 'nearest' });
      } else inp.removeAttribute('aria-activedescendant');
    }
    function open(q) { if (list.hidden) { list.hidden = false; box.classList.add('open'); inp.setAttribute('aria-expanded', 'true'); } render(q); }
    function close() {
      list.hidden = true; box.classList.remove('open'); inp.setAttribute('aria-expanded', 'false');
      inp.removeAttribute('aria-activedescendant'); inp.value = nameOf(sel.value);
    }
    function pick(c) { sel.value = c.code; sel.dispatchEvent(new Event('change', { bubbles: true })); close(); }
    inp.addEventListener('focus', function () { inp.select(); });
    inp.addEventListener('click', function () { if (list.hidden) { inp.select(); open(''); } });
    inp.addEventListener('input', function () { open(inp.value); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (list.hidden) return open('');
        move(act + (e.key === 'ArrowDown' ? 1 : -1));
      } else if (e.key === 'Enter') {
        if (!list.hidden) { e.preventDefault(); if (act > -1) pick(shown[act]); }
      } else if (e.key === 'Escape') {
        if (!list.hidden) { e.stopPropagation(); close(); }
      } else if (e.key === 'Tab') {
        if (!list.hidden && act > -1 && inp.value && inp.value !== nameOf(sel.value)) pick(shown[act]);
        else if (!list.hidden) close();
      }
    });
    list.addEventListener('mousedown', function (e) { e.preventDefault(); });
    list.addEventListener('click', function (e) { var li = e.target.closest('[data-i]'); if (li) pick(shown[+li.dataset.i]); });
    inp.addEventListener('blur', function () { if (!list.hidden) close(); });
    sel.addEventListener('change', function () { if (list.hidden) inp.value = nameOf(sel.value); });
  }

  /* ---------- المبلغ والشريحة ---------- */
  var DIG = { '٠':0,'١':1,'٢':2,'٣':3,'٤':4,'٥':5,'٦':6,'٧':7,'٨':8,'٩':9,'۰':0,'۱':1,'۲':2,'۳':3,'۴':4,'۵':5,'۶':6,'۷':7,'۸':8,'۹':9 };
  function parseAmount(v) {
    var s = String(v || '').replace(/[٠-٩۰-۹]/g, function (d) { return DIG[d]; }).replace(/[^\d]/g, '');
    return s ? parseInt(s, 10) : NaN;
  }
  function tierOf(n) {
    if (!(n >= CFG.min && n <= CFG.max)) return null;
    if (n < 50000) return 'community';
    if (n < 1000000) return 'angel';
    if (n < 10000000) return 'strategic';
    return 'institutional';
  }
  var amountIn = $('#amount'), tierchip = $('#tierchip');
  // غير الخليجي: حدّ أدنى ٣٠٠ ألف ريال (قرار محمد ٨ أكتوبر، خُفّض من مليون ليتّسع له سقف الشركة الأم)
  // ورسوم تسجيل وزارة الاستثمار السنوية تُحمَّل على حصته
  var GCC = ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'], FOREIGN_MIN = 300000;
  function isForeign() { var n = $('#nationality').value; return !!n && GCC.indexOf(n) < 0; }
  var amountErr = amountIn.closest('.f').querySelector('.err'), amountErrDefault = amountErr.textContent;
  function syncForeignHint() {
    var h = $('#foreignhint'); if (!h) return;
    h.textContent = isForeign() ? T.foreignMin : ''; h.hidden = !isForeign();
  }
  function onAmount() {
    var n = parseAmount(amountIn.value);
    if (!isNaN(n)) amountIn.value = n.toLocaleString('en-US');
    var t = tierOf(n);
    tierchip.innerHTML = t ? '<span>' + T.tierLbl + '</span><b>' + T.tiers[t] + '</b>' : '';
    syncTrack(t);
    syncProofHint(t);
    renderEstimate();
  }

  /* ---------- الحاسبة اللحظية بجانب المبلغ ----------
     لا تظهر إلا للمسارات التي فعّل الملّاك ظهورها علناً من اللوحة. */
  var VALS = [], MAXSTAKE = 15, liveBox = $('#livecalc'), liveNote = $('#livenote');
  // سقف حصة المستثمر الواحد: أقصى مبلغ = أدنى تقييم × س ÷ (١ − س)، ومجموع سقوف القطاعات المختارة
  function currentCap() {
    var track = val('track'), secs = vals('sectors');
    var want = track === 'sector' ? secs.map(function (x) { return 'sector:' + x; }) : ['company'];
    if (!want.length) return null;
    var p = MAXSTAKE / 100, total = 0;
    for (var i = 0; i < want.length; i++) {
      var v = VALS.filter(function (x) { return x.scope === want[i]; })[0];
      if (!v) return null;
      total += Math.floor(v.low * p / (1 - p));
    }
    return total;
  }
  function capText(cap) { return T.capMsg.replace('{p}', MAXSTAKE).replace('{a}', cap.toLocaleString('en-US')); }
  function pct(x) { return (x < 0.01 ? x.toFixed(4) : x < 1 ? x.toFixed(3) : x.toFixed(2)) + '%'; }
  function renderEstimate() {
    var n = parseAmount(amountIn.value), track = val('track'), secs = vals('sectors');
    var want = track === 'sector' ? secs.map(function (x) { return 'sector:' + x; }) : ['company'];
    var rows = VALS.filter(function (v) { return want.indexOf(v.scope) > -1; });
    var on = !!tierOf(n) && rows.length > 0;
    liveBox.hidden = liveNote.hidden = !on;
    if (!on) { liveBox.innerHTML = ''; return; }
    var cap = currentCap();
    if (cap !== null && n > cap) { liveBox.innerHTML = '<span class="calc-lbl">' + T.estLbl + '</span><div class="calc-row"><span>' + capText(cap) + '</span></div>'; return; }
    liveBox.innerHTML = '<span class="calc-lbl">' + T.estLbl + '</span>' + rows.map(function (v) {
      var lo = n / (v.high + n) * 100, hi = n / (v.low + n) * 100;
      var name = v.scope === 'company' ? T.company : T.sectorNames[v.scope.slice(7)];
      return '<div class="calc-row"><b class="lat">' + pct(lo) + ' – ' + pct(hi) + '</b><span>' + T.of + name + '</span></div>';
    }).join('');
  }
  fetch(CFG.api + '/estimate').then(function (r) { return r.json(); }).then(function (r) {
    if (r && r.ok && r.rows) { VALS = r.rows; MAXSTAKE = r.max_stake || 15; renderEstimate(); }
  }).catch(function () {});
  amountIn.addEventListener('input', onAmount);

  /* ---------- الحقول الشرطية ---------- */
  function val(name) { var el = form.querySelector('[name="' + name + '"]:checked'); return el ? el.value : ''; }
  function vals(name) { return $$('[name="' + name + '"]:checked', form).map(function (e) { return e.value; }); }
  function showWhen(key, on) { $$('[data-when="' + key + '"]', form).forEach(function (el) { el.hidden = !on; }); }
  function syncEntity() { var t = val('investor_type'); showWhen('entity', !!t && t !== 'individual'); }
  function syncTrack(tier) {
    var sectorRadio = form.querySelector('[name="track"][value="sector"]');
    var inst = tier === 'institutional';
    sectorRadio.disabled = inst;
    if (inst && sectorRadio.checked) { sectorRadio.checked = false; form.querySelector('[name="track"][value="company"]').checked = true; }
    $('#trackhint').textContent = inst ? T.instHint : '';
    showWhen('sector', val('track') === 'sector');
  }
  function syncProofHint(tier) { $('#proofsub').dataset.extra = tier === 'community' ? T.communityProof : ''; }
  form.addEventListener('change', function (e) {
    if (e.target.name === 'investor_type') syncEntity();
    if (e.target.name === 'nationality') syncForeignHint();
    if (e.target.name === 'track') syncTrack(tierOf(parseAmount(amountIn.value)));
    if (e.target.name === 'track' || e.target.name === 'sectors') renderEstimate();
    var f = e.target.closest('.f'); if (f) f.classList.remove('bad');
  });
  form.addEventListener('input', function (e) { var f = e.target.closest('.f'); if (f) f.classList.remove('bad'); });

  /* ---------- «أوافق على الكل»: ضغطة واحدة للإقرارات الخمسة، وضغطة ثانية تلغيها ---------- */
  var ackAll = $('#ackall'), ackBoxes = $$('.acks input[type=checkbox]', form);
  function syncAckAll() {
    var all = ackBoxes.every(function (c) { return c.checked; });
    ackAll.setAttribute('aria-pressed', String(all));
    ackAll.querySelector('span').textContent = all ? T.agreedAll : T.agreeAll;
    if (all) ackAll.closest('.f').classList.remove('bad');
  }
  if (ackAll) {
    ackAll.addEventListener('click', function () {
      var to = !ackBoxes.every(function (c) { return c.checked; });
      ackBoxes.forEach(function (c) { c.checked = to; });
      syncAckAll();
    });
    ackBoxes.forEach(function (c) { c.addEventListener('change', syncAckAll); });
  }

  /* ---------- الملف ---------- */
  var fileIn = $('#proof'), drop = $('#drop'), dropt = $('#dropt'), dropDefault = dropt.textContent;
  var OK_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
  function fileValid(f) { return f && OK_TYPES.indexOf(f.type) > -1 && f.size > 0 && f.size <= CFG.maxBytes; }
  function onFile() {
    var f = fileIn.files[0], box = drop.closest('.f');
    if (!f) { drop.classList.remove('has'); dropt.textContent = dropDefault; return; }
    if (!fileValid(f)) { fileIn.value = ''; drop.classList.remove('has'); dropt.textContent = dropDefault;
      $('#prooferr').textContent = T.fileBad; box.classList.add('bad'); return; }
    box.classList.remove('bad'); drop.classList.add('has'); dropt.textContent = T.fileOk + f.name;
  }
  fileIn.addEventListener('change', onFile);
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files.length) {
      var dt = new DataTransfer(); dt.items.add(e.dataTransfer.files[0]); fileIn.files = dt.files; onFile();
    }
  });

  /* ---------- التحقق لكل خطوة ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, PHONE = /^\+?[0-9\s\-()]{8,20}$/;
  var RULES = {
    investor_type: function () { return !!val('investor_type'); },
    full_name: function () { return $('#full_name').value.trim().length >= 3; },
    entity_name: function () { return $('#entity_name').value.trim().length >= 2; },
    nationality: function () { return !!$('#nationality').value; },
    residence: function () { return !!$('#residence').value; },
    qualified: function () { return !!val('qualified'); },
    amount: function () {
      var n = parseAmount(amountIn.value);
      if (tierOf(n) && isForeign() && n < FOREIGN_MIN) { amountErr.textContent = T.foreignMin; return false; }
      // سقف المستثمر الواحد لا يمنع إبداء الاهتمام (قرار محمد ٨ أكتوبر): يُفرض عند «أنا مستعد» وحده
      amountErr.textContent = amountErrDefault;
      return !!tierOf(n);
    },
    track: function () { return !!val('track'); },
    sectors: function () { return vals('sectors').length > 0; },
    horizon: function () { return !!val('horizon'); },
    source_of_funds: function () { return !!$('#source_of_funds').value; },
    proof_type: function () { return !!val('proof_type'); },
    proof: function () { return fileValid(fileIn.files[0]); },
    email: function () { return EMAIL.test($('#email').value.trim()); },
    phone: function () { var p = $('#phone').value.trim(); return PHONE.test(p) && p.replace(/\D/g, '').length >= 8; },
    acks: function () { return ['ack_eoi', 'ack_nda', 'ack_aml', 'ack_privacy', 'ack_terms'].every(function (n) { return form.querySelector('[name="' + n + '"]').checked; }); }
  };
  function validateStep(fs) {
    var first = null;
    $$('[data-req]', fs).forEach(function (box) {
      if (box.hidden) { box.classList.remove('bad'); return; }
      var ok = RULES[box.dataset.req]();
      box.classList.toggle('bad', !ok);
      if (!ok && !first) first = box;
    });
    if (first) { var i = first.querySelector('input:not([type=hidden]),select,textarea'); first.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (i && i.type !== 'file') i.focus({ preventScroll: true }); }
    return !first;
  }

  /* ---------- الخطوات ---------- */
  var sets = $$('fieldset', form), stepsUi = $$('.steps li', form), cur = 0;
  var back = $('#back'), next = $('#next'), alertBox = $('#alert'), tsId = null;
  var nextHtml = next.innerHTML;
  function showAlert(msg) { alertBox.textContent = msg || ''; alertBox.classList.toggle('on', !!msg); }
  function go(i) {
    sets[cur].classList.remove('on'); cur = i; sets[cur].classList.add('on');
    stepsUi.forEach(function (li, k) { li.classList.toggle('on', k === cur); li.classList.toggle('done', k < cur); });
    back.hidden = cur === 0;
    next.innerHTML = cur === sets.length - 1 ? T.send : nextHtml;
    if (cur === 2) { var x = $('#proofsub'); x.dataset.base = x.dataset.base || x.textContent;
      x.textContent = x.dataset.base + (x.dataset.extra ? ' ' + x.dataset.extra : ''); }
    if (cur === sets.length - 1) renderTurnstile();
    showAlert('');
    form.closest('.glass').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  back.addEventListener('click', function () { if (cur > 0) go(cur - 1); });
  next.addEventListener('click', function () {
    if (!validateStep(sets[cur])) return;
    if (cur < sets.length - 1) go(cur + 1); else submit();
  });

  function renderTurnstile() {
    if (tsId !== null || !window.turnstile) { if (!window.turnstile) setTimeout(renderTurnstile, 400); return; }
    tsId = window.turnstile.render('#ts', { sitekey: CFG.turnstile, language: LANG, theme: 'light' });
  }

  /* ---------- الإرسال: البيانات أولاً، ثم المستند تدفّقاً ----------
     خطوتان لأن الخادم المجاني يقطع أي طلب ثقيل على المعالج؛ والمستند يمرّ دون أن يُفكّ.
     وإن فشل الرفع وحده، يُعاد رفعه دون إعادة إرسال البيانات (نحتفظ برمز الرفع). */
  var pending = null; // { ref, upload } بعد نجاح الخطوة الأولى
  function finish(ref) {
    form.hidden = true;
    $('#refno').textContent = ref;
    $('#thanks').classList.add('on');
    $('#thanks').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function busy(on, label) {
    next.disabled = back.disabled = on;
    next.innerHTML = on ? '<span class="spin"></span> ' + label : T.send;
  }
  function jsonOf(r) { return r.json().catch(function () { return { ok: false, error: 'server' }; }); }
  function uploadProof() {
    var f = fileIn.files[0];
    busy(true, T.uploading);
    return fetch(CFG.api + '/proof?t=' + encodeURIComponent(pending.upload) + '&name=' + encodeURIComponent(f.name), {
      method: 'PUT', body: f, headers: { 'content-type': f.type || 'application/octet-stream' }
    }).then(jsonOf, function () { return { ok: false, error: 'upload' }; }).then(function (res) {
      if (res && res.ok) return finish(pending.ref);
      var code = res && res.error;
      if (code === 'invalid_link' || code === 'expired') { pending = null; code = 'expired'; }
      else if (code !== 'too_large') code = 'upload';
      showAlert(T.errors[code]); busy(false);
    });
  }
  function submit() {
    // تحقق نهائي من كل الخطوات، فقد يعود المستخدم ويعدّل
    for (var k = 0; k < sets.length; k++) { if (!validateStep(sets[k])) { if (k !== cur) go(k); return; } }
    showAlert('');
    if (pending) return uploadProof(); // البيانات وصلت من قبل — المستند وحده

    var token = window.turnstile && tsId !== null ? window.turnstile.getResponse(tsId) : '';
    if (!token) { showAlert(T.tsWait); return; }
    var fd = new FormData(form);
    fd.delete('proof');
    fd.delete('cf-turnstile-response');
    fd.set('amount', String(parseAmount(amountIn.value)));
    fd.set('lang', LANG);
    fd.set('terms_version', CFG.termsVersion);
    fd.set('cf_turnstile', token);

    busy(true, T.sending);
    fetch(CFG.api + '/submit', { method: 'POST', body: fd })
      .then(jsonOf, function () { return { ok: false, error: 'network' }; })
      .then(function (res) {
        if (res && res.ok) { pending = { ref: res.ref, upload: res.upload }; return uploadProof(); }
        showAlert(T.errors[res && res.error] || T.errors.server);
        if (res && res.error === 'stake_cap') { go(1); amountIn.closest('.f').classList.add('bad'); amountErr.textContent = T.errors.stake_cap; }
        if (window.turnstile && tsId !== null) window.turnstile.reset(tsId);
        busy(false);
      });
  }
})();
