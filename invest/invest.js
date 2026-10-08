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
    termsVersion: '2026-10-07',
    maxBytes: 10 * 1024 * 1024,
    min: 500, max: 100000000
  };

  var T = {
    ar: {
      choose: 'اختر', next: 'التالي', send: 'أرسل الطلب', sending: 'جارٍ الإرسال', uploading: 'جارٍ رفع المستند',
      tiers: { community: 'مجتمع القلم', angel: 'شريك ملائكي', strategic: 'شريك استراتيجي', institutional: 'مستثمر مؤسسي' },
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
        upload: 'وصلت بياناتك، لكن تعذّر رفع المستند. اضغط «أرسل الطلب» مرة أخرى لإعادة رفعه وحده.',
        expired: 'انتهت مهلة رفع المستند. حدّث الصفحة وأعد الإرسال.'
      },
      countries: [['SA','السعودية'],['AE','الإمارات'],['KW','الكويت'],['QA','قطر'],['BH','البحرين'],['OM','عُمان'],
        ['YE','اليمن'],['EG','مصر'],['JO','الأردن'],['IQ','العراق'],['SD','السودان'],['MA','المغرب'],['TR','تركيا'],
        ['GB','المملكة المتحدة'],['US','الولايات المتحدة'],['OTHER','أخرى']]
    },
    en: {
      choose: 'Select', next: 'Next', send: 'Submit', sending: 'Submitting', uploading: 'Uploading document',
      tiers: { community: 'Stilus Community', angel: 'Angel partner', strategic: 'Strategic partner', institutional: 'Institutional investor' },
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
        upload: 'Your details arrived, but the document upload failed. Press Submit again to retry the upload only.',
        expired: 'The upload window expired. Refresh the page and submit again.'
      },
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

  /* ---------- القوائم ---------- */
  $$('select[data-countries]').forEach(function (sel) {
    sel.innerHTML = '<option value="">' + T.choose + '</option>' +
      T.countries.map(function (c) { return '<option value="' + c[0] + '">' + c[1] + '</option>'; }).join('');
  });

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
  var VALS = [], liveBox = $('#livecalc'), liveNote = $('#livenote');
  function pct(x) { return (x < 0.01 ? x.toFixed(4) : x < 1 ? x.toFixed(3) : x.toFixed(2)) + '%'; }
  function renderEstimate() {
    var n = parseAmount(amountIn.value), track = val('track'), secs = vals('sectors');
    var want = track === 'sector' ? secs.map(function (x) { return 'sector:' + x; }) : ['company'];
    var rows = VALS.filter(function (v) { return want.indexOf(v.scope) > -1; });
    var on = !!tierOf(n) && rows.length > 0;
    liveBox.hidden = liveNote.hidden = !on;
    if (!on) { liveBox.innerHTML = ''; return; }
    liveBox.innerHTML = '<span class="calc-lbl">' + T.estLbl + '</span>' + rows.map(function (v) {
      var lo = n / (v.high + n) * 100, hi = n / (v.low + n) * 100;
      var name = v.scope === 'company' ? T.company : T.sectorNames[v.scope.slice(7)];
      return '<div class="calc-row"><b class="lat">' + pct(lo) + ' – ' + pct(hi) + '</b><span>' + T.of + name + '</span></div>';
    }).join('');
  }
  fetch(CFG.api + '/estimate').then(function (r) { return r.json(); }).then(function (r) {
    if (r && r.ok && r.rows) { VALS = r.rows; renderEstimate(); }
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
    if (e.target.name === 'track') syncTrack(tierOf(parseAmount(amountIn.value)));
    if (e.target.name === 'track' || e.target.name === 'sectors') renderEstimate();
    var f = e.target.closest('.f'); if (f) f.classList.remove('bad');
  });
  form.addEventListener('input', function (e) { var f = e.target.closest('.f'); if (f) f.classList.remove('bad'); });

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
    amount: function () { return !!tierOf(parseAmount(amountIn.value)); },
    track: function () { return !!val('track'); },
    sectors: function () { return vals('sectors').length > 0; },
    horizon: function () { return !!val('horizon'); },
    contribution: function () { return vals('contribution').length > 0; },
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
        if (window.turnstile && tsId !== null) window.turnstile.reset(tsId);
        busy(false);
      });
  }
})();
