/* =====================================================================
   بوّابة المستثمر — كل ما بعد الإرسال يحدث هنا، بلا تواصل بشري:
   ?a=verify  تأكيد البريد
   ?a=nda     قراءة اتفاقية عدم الإفصاح وتوقيعها
   ?a=room    غرفة البيانات + حاسبة النسبة التقديرية + «أنا مستعد»
   وفي كل وضع: سحب الطلب وحذف البيانات بضغطة.
   ===================================================================== */
(function () {
  'use strict';
  var LANG = document.documentElement.lang === 'en' ? 'en' : 'ar';
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var API = LOCAL ? 'http://127.0.0.1:8787/api/invest' : '/api/invest';
  var q = new URLSearchParams(location.search), A = q.get('a'), TOK = q.get('t') || '';
  // الرمز لا يبقى في شريط العنوان ولا في سجل المتصفح بعد قراءته
  if (TOK && history.replaceState) history.replaceState(null, '', location.pathname + '?a=' + encodeURIComponent(A || ''));

  var T = {
    ar: {
      loading: 'جارٍ التحميل', cur: 'ريال',
      err: { invalid_link: 'هذا الرابط غير صالح أو استُبدل برابط أحدث.', expired: 'انتهت صلاحية هذا الرابط.', already_signed: 'وقّعت هذه الاتفاقية من قبل. افتح غرفة بياناتك من الرابط الذي وصلك بالبريد.',
        stake_cap: 'المبلغ يتجاوز الحد الأقصى لحصة المستثمر الواحد في مسارك.',
        round_full: 'المتاح في جولة مسارك الحالية أقل من هذا المبلغ. جرّب مبلغاً أقل، وإن لم يناسبك فسنشعرك بالجولة القادمة.',
        name_mismatch: 'الاسم المكتوب لا يطابق الاسم المسجّل في طلبك. اكتبه كما كتبته في الطلب.', invalid: 'البيانات غير مكتملة.', network: 'تعذّر الاتصال. أعد المحاولة.', server: 'حدث خطأ غير متوقع. أعد المحاولة بعد قليل.' },
      verifiedT: 'تأكّد طلبك', verifiedP: 'دخل طلبك المراجعة. يصلك القرار على بريدك خلال ١٥ يوماً، ولا يلزمك أي إجراء حتى ذلك الحين.',
      alreadyP: 'طلبك مؤكَّد من قبل، وهو في مسار المراجعة.',
      ndaT: 'اتفاقية عدم الإفصاح', ndaP: 'اقرأ النص كاملاً. التوقيع يكون بكتابة اسمك كما في طلبك وتأكيد الموافقة، ويُعدّ توقيعاً إلكترونياً ملزماً.',
      typeName: 'اكتب اسمك الكامل للتوقيع', agree: 'قرأت الاتفاقية وأوافق عليها، وأقرّ بأن كتابة اسمي هنا توقيع إلكتروني ملزم لي.', sign: 'توقيع الاتفاقية',
      roomT: 'غرفة البيانات', hello: 'أهلاً ', tier: 'الشريحة', track: 'المسار', company: 'الشركة الأم', sector: 'قطاع', open: 'فتح',
      docsT: 'ملفات مسارك', noDocs: 'تُضاف ملفات مسارك قريباً، ويصلك إشعار بذلك. يمكنك العودة إلى هذا الرابط في أي وقت خلال صلاحيته.',
      calcT: 'حاسبة النسبة التقديرية', calcP: 'غيّر المبلغ لترى ما يعادله تقديرياً من الحصة، وفق نطاق التقييم الحالي لمسارك.',
      calcIn: 'المبلغ (ريال)', between: 'تقديرياً بين ', and: ' و', of: ' من ',
      calcNote: 'تقدير استرشادي غير ملزم. النسبة النهائية تحدّدها الاتفاقية النظامية وتقييم الجولة عند الإغلاق.',
      readyT: 'هل أنت مستعد للمضي؟', readyP: 'هذه الخطوة الوحيدة التي تنقل طلبك إلى المرحلة التالية: إعداد العقود النظامية. لا تضغطها إلا وأنت جادّ في المبلغ.',
      readyAmt: 'المبلغ الذي تؤكّده (ريال)', readyNote: 'ملاحظة (اختيارية)', readyAck: 'أؤكّد استعدادي للمضي بهذا المبلغ، وأفهم أن الخطوة التالية عقود نظامية، ولا يُدفع أي مبلغ قبل توقيعها.',
      capNote: 'الحد الأقصى لحصة المستثمر الواحد {p}٪، أي ما لا يزيد على {a} ريال في مسارك.',
      readyBtn: 'أنا مستعد', readyDone: 'سُجّل استعدادك. الخطوة التالية تصلك على بريدك عند جاهزية العقود النظامية.', expires: 'صلاحية الغرفة حتى ',
      forget: 'سحب طلبي وحذف بياناتي', forgetQ: 'سيُسحب طلبك وتُحذف بياناتك ومستندك نهائياً. متأكد؟', forgotT: 'حُذفت بياناتك', forgotP: 'سُحب طلبك وحُذفت بياناتك كما طلبت.',
      ref: 'الرقم المرجعي', back: 'العودة إلى صفحة المستثمرين',
      tiers: { community: 'مجتمع القلم', angel: 'شريك ملائكي', strategic: 'شريك استراتيجي', institutional: 'مستثمر مؤسسي' },
      sectors: { arts: 'الفن والمناسبات', contracting: 'المقاولات والحوكمة الميدانية', hr: 'الموارد البشرية والحضور', retail: 'التجزئة والتجارة', lifestyle: 'نمط الحياة والعافية', enterprise: 'حلول البرمجيات للمنشآت' }
    },
    en: {
      loading: 'Loading', cur: 'SAR',
      err: { invalid_link: 'This link is invalid or has been replaced by a newer one.', expired: 'This link has expired.', already_signed: 'You have already signed this agreement. Open your data room from the link in your email.',
        stake_cap: 'The amount exceeds the maximum single-investor stake on your track.',
        round_full: 'What remains in the current round on your track is less than this amount. Try a lower amount; otherwise we will notify you of the next round.',
        name_mismatch: 'The typed name does not match the name on your request. Type it exactly as in your request.', invalid: 'Some details are missing.', network: 'Could not connect. Please try again.', server: 'Something unexpected happened. Please try again shortly.' },
      verifiedT: 'Your request is confirmed', verifiedP: 'Your request is now in review. The decision will reach your email within 15 days; nothing is needed from you until then.',
      alreadyP: 'Your request was already confirmed and is in review.',
      ndaT: 'Non-Disclosure Agreement', ndaP: 'Read the full text. You sign by typing your name exactly as in your request and confirming consent; this is a binding electronic signature.',
      typeName: 'Type your full name to sign', agree: 'I have read and agree to this Agreement, and acknowledge that typing my name here is my binding electronic signature.', sign: 'Sign the agreement',
      roomT: 'Data room', hello: 'Welcome, ', tier: 'Tier', track: 'Track', company: 'Parent company', sector: 'Sector', open: 'Open',
      docsT: 'Your track files', noDocs: 'Your track files will be added soon and you will be notified. You can return to this link any time while it is valid.',
      calcT: 'Indicative stake calculator', calcP: 'Change the amount to see the indicative equivalent stake, based on the current valuation range for your track.',
      calcIn: 'Amount (SAR)', between: 'Indicatively between ', and: ' and ', of: ' of ',
      calcNote: 'Indicative and non-binding. The final stake is set by the legal agreement and the round valuation at closing.',
      readyT: 'Are you ready to proceed?', readyP: 'This is the only step that moves your request forward: preparing the legal agreements. Press it only if you are committed to the amount.',
      readyAmt: 'Amount you confirm (SAR)', readyNote: 'Note (optional)', readyAck: 'I confirm I am ready to proceed with this amount, and understand the next step is the legal agreements, with no payment before they are signed.',
      capNote: 'The maximum single-investor stake is {p}%, i.e. no more than SAR {a} on your track.',
      readyBtn: 'I am ready', readyDone: 'Your readiness is recorded. The next step reaches your email when the legal agreements are prepared.', expires: 'Room valid until ',
      forget: 'Withdraw my request and delete my data', forgetQ: 'Your request will be withdrawn and your data and document permanently deleted. Are you sure?', forgotT: 'Your data was deleted', forgotP: 'Your request was withdrawn and your data deleted, as you asked.',
      ref: 'Reference', back: 'Back to the investors page',
      tiers: { community: 'Stilus Community', angel: 'Angel partner', strategic: 'Strategic partner', institutional: 'Institutional investor' },
      sectors: { arts: 'Arts & events', contracting: 'Contracting & field governance', hr: 'HR & attendance', retail: 'Retail & commerce', lifestyle: 'Lifestyle & wellbeing', enterprise: 'Enterprise software' }
    }
  }[LANG];

  var box = document.getElementById('portal');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function pct(x) { return (x < 0.01 ? x.toFixed(4) : x < 1 ? x.toFixed(3) : x.toFixed(2)) + '%'; }
  function show(html) { box.innerHTML = html; }
  function msg(title, p, ok) {
    show('<div class="thanks on"><div class="seal-ok"' + (ok ? '' : ' style="background:#f1eee7;color:#6f6a60"') + '><svg class="ic" viewBox="0 0 24 24">' +
      (ok ? '<polyline points="20 6 9 17 4 12"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>') +
      '</svg></div><h3>' + esc(title) + '</h3><p>' + p + '</p>' + backLink() + '</div>');
  }
  function backLink() { return '<p style="margin-top:28px"><a class="note-link" href="../">' + T.back + '</a></p>'; }
  function errOf(code) { return T.err[code] || T.err.server; }
  function call(method, path, body) {
    return fetch(API + path, method === 'GET' ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); }, function () { return { ok: false, error: 'network' }; });
  }
  function forgetBtn() {
    return '<p style="margin-top:34px;text-align:center"><button type="button" class="btn ghost" id="forget" style="font-size:13.5px;padding:10px 20px">' + T.forget + '</button></p>';
  }
  function wireForget() {
    var b = document.getElementById('forget'); if (!b) return;
    b.addEventListener('click', function () {
      if (!confirm(T.forgetQ)) return;
      b.disabled = true;
      call('POST', '/forget', { t: TOK }).then(function (r) { r.ok ? msg(T.forgotT, T.forgotP, true) : (alert(errOf(r.error)), b.disabled = false); });
    });
  }

  if (!TOK || ['verify', 'nda', 'room'].indexOf(A) < 0) { msg(T.err.invalid_link, '', false); return; }
  show('<p style="text-align:center;color:var(--muted)">' + T.loading + '</p>');

  /* ---------- تأكيد البريد ---------- */
  if (A === 'verify') {
    call('GET', '/verify?t=' + encodeURIComponent(TOK)).then(function (r) {
      if (!r.ok) return msg(errOf(r.error), '', false);
      msg(T.verifiedT, (r.already ? T.alreadyP : T.verifiedP) + '<br><span class="ref">' + esc(r.ref) + '</span>', true);
      box.insertAdjacentHTML('beforeend', forgetBtn()); wireForget();
    });
  }

  /* ---------- اتفاقية عدم الإفصاح ---------- */
  if (A === 'nda') {
    call('GET', '/nda?t=' + encodeURIComponent(TOK)).then(function (r) {
      if (!r.ok) return msg(errOf(r.error), '', false);
      show('<legend>' + T.ndaT + '</legend><p class="lg-sub">' + T.ndaP + '</p>' +
        '<div class="nda-text" tabindex="0">' + esc(r.text) + '</div>' +
        '<form id="sign" class="grid" style="margin-top:22px" novalidate>' +
        '<div class="f full"><label for="sname">' + T.typeName + '</label><input type="text" id="sname" autocomplete="off" maxlength="120"></div>' +
        '<label class="ack full"><input type="checkbox" id="sagree"><span>' + T.agree + '</span></label>' +
        '<div class="full"><div class="form-alert" id="salert"></div><button class="btn" id="sbtn" disabled>' + T.sign + '</button></div></form>' + forgetBtn());
      wireForget();
      var name = document.getElementById('sname'), ag = document.getElementById('sagree'), btn = document.getElementById('sbtn'), al = document.getElementById('salert');
      function sync() { btn.disabled = !(ag.checked && name.value.trim().length >= 3); }
      name.addEventListener('input', sync); ag.addEventListener('change', sync);
      document.getElementById('sign').addEventListener('submit', function (e) {
        e.preventDefault(); btn.disabled = true; al.classList.remove('on');
        call('POST', '/nda', { t: TOK, name: name.value, agree: ag.checked }).then(function (res) {
          if (res.ok) { location.replace(location.pathname + '?a=room&t=' + encodeURIComponent(res.room)); return; }
          al.textContent = errOf(res.error); al.classList.add('on'); sync();
        });
      });
    });
  }

  /* ---------- غرفة البيانات ---------- */
  if (A === 'room') {
    call('GET', '/room?t=' + encodeURIComponent(TOK)).then(function (r) {
      if (!r.ok) return msg(errOf(r.error), '', false);
      var trackTxt = r.track === 'company' ? T.company : T.sector + ': ' + r.sectors.map(function (s) { return T.sectors[s]; }).join('، ');
      var docs = r.docs.length ? '<ul class="docs">' + r.docs.map(function (d) {
        return '<li><svg class="ic" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span>' + esc(d.title) +
          '</span><a class="note-link" target="_blank" rel="noopener" href="' + API + '/room/doc?t=' + encodeURIComponent(TOK) + '&id=' + d.id + '">' + T.open + '</a></li>';
      }).join('') + '</ul>' : '<p class="hint">' + T.noDocs + '</p>';
      var vals = r.valuations || [];
      var calc = vals.length ? '<div class="room-sec"><h3>' + T.calcT + '</h3><p class="hint">' + T.calcP + '</p>' +
        '<div class="f" style="max-width:340px;margin-top:14px"><label for="camt">' + T.calcIn + '</label><div class="amount"><input type="text" id="camt" inputmode="numeric" value="' + fmt(r.ready_amount || r.amount) + '"><span class="cur">' + T.cur + '</span></div></div>' +
        '<div id="cout" class="calc-out"></div><p class="hint">' + T.calcNote + '</p></div>' : '';
      var ready = r.ready ? '<div class="room-sec done"><h3>' + T.readyT + '</h3><p>' + T.readyDone + '</p></div>' :
        '<div class="room-sec"><h3>' + T.readyT + '</h3><p class="hint">' + T.readyP + '</p><form id="rf" class="grid" style="margin-top:14px" novalidate>' +
        (r.cap ? '<p class="hint full">' + T.capNote.replace('{p}', r.pct).replace('{a}', fmt(r.cap)) + '</p>' : '') +
        '<div class="f"><label for="ramt">' + T.readyAmt + '</label><div class="amount"><input type="text" id="ramt" inputmode="numeric" value="' + fmt(r.amount) + '"><span class="cur">' + T.cur + '</span></div></div>' +
        '<div class="f full"><label for="rnote">' + T.readyNote + '</label><textarea id="rnote" maxlength="600"></textarea></div>' +
        '<label class="ack full"><input type="checkbox" id="rack"><span>' + T.readyAck + '</span></label>' +
        '<div class="full"><div class="form-alert" id="ralert"></div><button class="btn" id="rbtn" disabled>' + T.readyBtn + '</button></div></form></div>';
      show('<legend>' + T.roomT + '</legend><p class="lg-sub">' + T.hello + esc(r.name) + '</p>' +
        '<div class="room-meta"><div><span>' + T.ref + '</span><b class="lat">' + esc(r.ref) + '</b></div><div><span>' + T.tier + '</span><b>' + T.tiers[r.tier] + '</b></div><div><span>' + T.track + '</span><b>' + esc(trackTxt) + '</b></div></div>' +
        '<div class="room-sec"><h3>' + T.docsT + '</h3>' + docs + '</div>' + calc + ready +
        '<p class="hint" style="text-align:center;margin-top:18px">' + T.expires + new Date(r.expires).toLocaleDateString(LANG === 'en' ? 'en-GB' : 'ar-SA-u-ca-gregory-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }) + '</p>' + forgetBtn());
      wireForget();

      function num(v) { return parseInt(String(v).replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).replace(/[^\d]/g, ''), 10) || 0; }
      if (vals.length) {
        var ci = document.getElementById('camt'), co = document.getElementById('cout');
        var calcRun = function () {
          var a = num(ci.value); ci.value = a ? fmt(a) : '';
          co.innerHTML = a ? vals.map(function (v) {
            var hi = a / (v.low + a) * 100, lo = a / (v.high + a) * 100;
            var scope = v.scope === 'company' ? T.company : T.sectors[v.scope.slice(7)];
            return '<div class="calc-row"><b class="lat">' + pct(lo) + ' – ' + pct(hi) + '</b><span>' + T.of + esc(scope) + '</span></div>';
          }).join('') : '';
        };
        ci.addEventListener('input', calcRun); calcRun();
      }
      var rf = document.getElementById('rf');
      if (rf) {
        var ra = document.getElementById('ramt'), rk = document.getElementById('rack'), rb = document.getElementById('rbtn'), ral = document.getElementById('ralert');
        var rs = function () { var a = num(ra.value); rb.disabled = !(rk.checked && a >= 500 && a <= (r.cap || 1000000000)); };
        ra.addEventListener('input', function () { var a = num(ra.value); ra.value = a ? fmt(a) : ''; rs(); });
        rk.addEventListener('change', rs);
        rf.addEventListener('submit', function (e) {
          e.preventDefault(); rb.disabled = true;
          call('POST', '/room/ready', { t: TOK, amount: num(ra.value), note: document.getElementById('rnote').value }).then(function (res) {
            if (res.ok) { rf.parentNode.classList.add('done'); rf.parentNode.innerHTML = '<h3>' + T.readyT + '</h3><p>' + T.readyDone + '</p>'; return; }
            ral.textContent = errOf(res.error); ral.classList.add('on'); rs();
          });
        });
      }
    });
  }
})();
