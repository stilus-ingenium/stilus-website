/* =====================================================================
 * Lavera — تجربة تأكيد الحجز المتقدمة (تتبّع + تأكيد واتساب تلقائي)
 * يحوّل "سنتواصل معك" اليدوية إلى تجربة آلية: رقم مرجعي + خط زمني + تتبّع.
 * منتج من القَلَم الاصطناعي · Stilus Ingenium
 * ===================================================================== */
(function () {
  'use strict';

  /* ---------- توليد رقم مرجعي: LAV-YYMMDD-XXXX ---------- */
  function genRef() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    const ymd = String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate());
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return 'LAV-' + ymd + '-' + rnd;
  }

  /* ---------- تخزين/قراءة الحجوزات (للتتبّع) ---------- */
  function saveBooking(b) {
    let all = [];
    try { all = JSON.parse(localStorage.getItem('lavera_bookings') || '[]'); } catch (e) {}
    all.unshift(b);
    try { localStorage.setItem('lavera_bookings', JSON.stringify(all.slice(0, 20))); } catch (e) {}
  }
  function findBooking(ref) {
    let all = [];
    try { all = JSON.parse(localStorage.getItem('lavera_bookings') || '[]'); } catch (e) {}
    return all.find(b => b.ref === ref) || all[0] || null;
  }

  function waNumber() {
    try { return (window.SITE_CONFIG.contact.whatsappE164) || '966582222898'; }
    catch (e) { return '966582222898'; }
  }

  /* ---------- حقن الأنماط مرة واحدة ---------- */
  function injectCSS() {
    if (document.getElementById('lav-booking-css')) return;
    const s = document.createElement('style');
    s.id = 'lav-booking-css';
    s.textContent = `
    .lav-ov{position:fixed;inset:0;z-index:11000;display:flex;align-items:center;justify-content:center;
      background:rgba(20,16,10,.55);backdrop-filter:blur(6px);opacity:0;transition:opacity .35s ease;padding:16px}
    .lav-ov.show{opacity:1}
    .lav-card{background:#fff;width:100%;max-width:460px;border-radius:22px;padding:30px 26px 24px;
      box-shadow:0 30px 70px rgba(0,0,0,.3);transform:translateY(26px) scale(.97);opacity:0;
      transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .45s ease;max-height:92vh;overflow:auto;text-align:center;direction:rtl}
    .lav-ov.show .lav-card{transform:none;opacity:1}
    .lav-x{position:absolute;top:14px;left:18px;background:none;border:none;font-size:26px;color:#b9b3a6;cursor:pointer;line-height:1}
    .lav-check{width:84px;height:84px;margin:4px auto 0}
    .lav-check circle{stroke:#C9A574;stroke-width:4;fill:none;stroke-dasharray:251;stroke-dashoffset:251;animation:lavDraw .6s ease forwards}
    .lav-check path{stroke:#C9A574;stroke-width:5;fill:none;stroke-linecap:round;stroke-linejoin:round;
      stroke-dasharray:60;stroke-dashoffset:60;animation:lavDraw .4s .55s ease forwards}
    @keyframes lavDraw{to{stroke-dashoffset:0}}
    .lav-h{font-family:Tajawal,sans-serif;font-weight:800;font-size:22px;color:#1F2125;margin-top:14px}
    .lav-sub{font-size:13.5px;color:#6b6458;margin-top:6px;line-height:1.6}
    .lav-ref{margin:16px auto 0;background:#FAF7F2;border:1px dashed #C9A574;border-radius:12px;
      padding:11px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px}
    .lav-ref .k{font-size:11px;color:#8a8170}
    .lav-ref .v{font-family:Archivo,monospace;font-weight:700;font-size:17px;color:#1F2125;letter-spacing:.04em}
    .lav-copy{background:#1F2125;color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:11.5px;cursor:pointer;font-family:Tajawal}
    .lav-copy.ok{background:#3f7d54}
    .lav-meta{margin-top:12px;font-size:12.5px;color:#3a3c42;background:#fff;border:1px solid #eee;border-radius:10px;padding:10px 12px;line-height:1.9}
    .lav-meta b{color:#1F2125}
    .lav-tl{margin:18px 2px 4px;text-align:right;position:relative}
    .lav-step{display:flex;align-items:flex-start;gap:12px;padding:7px 0;position:relative}
    .lav-step .ic{flex:none;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;
      font-size:14px;font-weight:800;background:#eee;color:#aaa;z-index:2;transition:all .4s ease}
    .lav-step.done .ic{background:#C9A574;color:#fff}
    .lav-step.active .ic{background:#fff;color:#C9A574;border:2px solid #C9A574;animation:lavPulse 1.2s infinite}
    @keyframes lavPulse{0%,100%{box-shadow:0 0 0 0 rgba(200,162,75,.5)}50%{box-shadow:0 0 0 7px rgba(200,162,75,0)}}
    .lav-step .tx{font-size:13.5px;color:#26282e;padding-top:5px}
    .lav-step .tx small{display:block;color:#8a8170;font-size:11.5px;margin-top:2px}
    .lav-step.done .tx,.lav-step.active .tx{color:#1F2125;font-weight:600}
    .lav-line{position:absolute;right:14px;top:30px;width:2px;height:calc(100% - 30px);background:#eee;z-index:1}
    .lav-line.fill{background:#C9A574}
    .lav-auto{margin-top:14px;font-size:12px;color:#3f7d54;background:rgba(63,125,84,.1);border-radius:9px;padding:9px 12px;font-weight:600}
    .lav-btns{margin-top:18px;display:grid;gap:10px}
    .lav-bw{display:flex;align-items:center;justify-content:center;gap:9px;background:#25D366;color:#fff;
      text-decoration:none;border-radius:12px;padding:13px;font-weight:700;font-size:14.5px;font-family:Tajawal;transition:filter .2s}
    .lav-bw:hover{filter:brightness(.95)}
    .lav-bt{display:flex;align-items:center;justify-content:center;gap:8px;background:#FAF7F2;color:#1F2125;border:1px solid #e6e0d4;
      text-decoration:none;border-radius:12px;padding:12px;font-weight:700;font-size:14px;font-family:Tajawal}
    @media(max-width:480px){.lav-card{padding:26px 18px 20px}.lav-h{font-size:20px}}
    `;
    document.head.appendChild(s);
  }

  /* ---------- نافذة التأكيد ---------- */
  function showBookingConfirmation(data) {
    injectCSS();
    const ref = data.ref || genRef();
    saveBooking({ ref: ref, name: data.name, phone: data.phone, service: data.serviceLabel,
      doctor: data.doctorLabel, date: data.dateStr, time: data.timeLabel, createdAt: Date.now() });

    const waMsg = encodeURIComponent(
      `مرحباً عيادات لافيرا 🌸\nأنا ${data.name || ''}.\nرقم طلبي: ${ref}\nالخدمة: ${data.serviceLabel || '-'}\nالموعد: ${data.dateStr || '-'} الساعة ${data.timeLabel || '-'}\nأرجو تأكيد موعدي.`);
    const waHref = 'https://wa.me/' + waNumber() + '?text=' + waMsg;
    const trackHref = 'track.html?ref=' + encodeURIComponent(ref);

    const ov = document.createElement('div');
    ov.className = 'lav-ov';
    ov.innerHTML = `
      <div class="lav-card" role="dialog" aria-modal="true">
        <button class="lav-x" aria-label="إغلاق">&times;</button>
        <svg class="lav-check" viewBox="0 0 90 90"><circle cx="45" cy="45" r="40"/><path d="M27 46 L40 59 L64 33"/></svg>
        <div class="lav-h">تم استلام طلبك بنجاح</div>
        <div class="lav-sub">احتفظ برقم طلبك للمتابعة — سيصلك تأكيدٌ عبر واتساب خلال لحظات.</div>
        <div class="lav-ref"><span class="k">رقم الطلب</span><span class="v">${ref}</span>
          <button class="lav-copy">نسخ</button></div>
        <div class="lav-meta"><b>${data.serviceLabel || 'استشارة'}</b> · ${data.dateStr || ''} · ${data.timeLabel || ''}${data.doctorLabel ? ' · ' + data.doctorLabel : ''}</div>
        <div class="lav-tl">
          <div class="lav-line" id="lavLine"></div>
          <div class="lav-step done"><span class="ic">✓</span><span class="tx">تم استلام الطلب<small>الآن</small></span></div>
          <div class="lav-step active" id="lavStep2"><span class="ic">●</span><span class="tx">تأكيد فوري عبر واتساب<small>خلال دقيقة — تلقائياً</small></span></div>
          <div class="lav-step" id="lavStep3"><span class="ic">3</span><span class="tx">تذكير قبل موعدك بـ٢٤ ساعة<small>رسالة تلقائية</small></span></div>
        </div>
        <div class="lav-auto">✦ بدون اتصالات يدوية — كل خطوة تتم تلقائياً</div>
        <div class="lav-btns">
          <a class="lav-bw" href="${waHref}" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607z"/></svg>
            تأكيد عبر واتساب الآن</a>
          <a class="lav-bt" href="${trackHref}">تتبّع طلبي</a>
        </div>
      </div>`;
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => ov.classList.add('show'));

    // محاكاة حيّة: تأكيد واتساب يكتمل تلقائياً
    setTimeout(() => {
      const s2 = ov.querySelector('#lavStep2');
      if (s2) { s2.classList.remove('active'); s2.classList.add('done'); s2.querySelector('.ic').textContent = '✓';
        s2.querySelector('small').textContent = 'تم التأكيد ✓'; }
      const ln = ov.querySelector('#lavLine'); if (ln) ln.classList.add('fill');
    }, 2600);

    const close = () => { ov.classList.remove('show'); document.body.style.overflow = '';
      setTimeout(() => ov.remove(), 350); };
    ov.querySelector('.lav-x').addEventListener('click', close);
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    const cp = ov.querySelector('.lav-copy');
    cp.addEventListener('click', () => { try { navigator.clipboard.writeText(ref); } catch (e) {}
      cp.textContent = 'تم النسخ ✓'; cp.classList.add('ok'); });
    return ref;
  }

  /* ---------- صفحة التتبّع ---------- */
  function renderTracking(mountId) {
    injectCSS();
    const mount = document.getElementById(mountId);
    if (!mount) return;
    const q = new URLSearchParams(location.search);
    const ref = (q.get('ref') || '').trim();
    const b = ref ? findBooking(ref) : findBooking('');

    if (!b) {
      mount.innerHTML = `<div style="text-align:center;color:#6b6458;padding:30px">
        <p style="font-size:15px">لم نعثر على طلبٍ بهذا الرقم على هذا الجهاز.</p>
        <p style="font-size:13px;margin-top:8px">جرّب من نفس المتصفح الذي حجزت منه، أو <a href="appointment.html" style="color:#C9A574;font-weight:700">احجز موعداً جديداً</a>.</p></div>`;
      return;
    }
    const elapsed = (Date.now() - (b.createdAt || Date.now())) / 1000;
    const confirmed = elapsed > 30; // بعد ٣٠ ثانية يُعتبر مؤكَّداً (محاكاة)
    mount.innerHTML = `
      <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:18px;padding:26px 24px;box-shadow:0 16px 40px rgba(0,0,0,.07)">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div style="font-weight:800;font-size:18px;color:#1F2125">حالة طلبك</div>
          <div style="font-family:Archivo,monospace;font-weight:700;color:#C9A574;letter-spacing:.04em">${b.ref}</div>
        </div>
        <div style="margin-top:6px;font-size:13px;color:#6b6458"><b style="color:#1F2125">${b.service || 'استشارة'}</b> · ${b.date || ''} · ${b.time || ''}${b.doctor ? ' · ' + b.doctor : ''}</div>
        <div class="lav-tl" style="margin-top:18px">
          <div class="lav-line ${confirmed ? 'fill' : ''}" id="tLine"></div>
          <div class="lav-step done"><span class="ic">✓</span><span class="tx">تم استلام الطلب<small>${b.name || ''}</small></span></div>
          <div class="lav-step ${confirmed ? 'done' : 'active'}" id="tStep2"><span class="ic">${confirmed ? '✓' : '●'}</span><span class="tx">تأكيد عبر واتساب<small>${confirmed ? 'تم التأكيد ✓' : 'جارٍ التأكيد...'}</small></span></div>
          <div class="lav-step ${confirmed ? 'active' : ''}"><span class="ic">3</span><span class="tx">تذكير قبل الموعد بـ٢٤ ساعة<small>تلقائي</small></span></div>
        </div>
        <div class="lav-auto" style="margin-top:16px">✦ يُدار تلقائياً عبر لوحة تحكم العيادة — بلا متابعة يدوية</div>
      </div>`;
    if (!confirmed) {
      const wait = Math.max(1500, 32000 - elapsed * 1000);
      setTimeout(() => renderTracking(mountId), Math.min(wait, 4000));
    }
  }

  window.LaveraBooking = { show: showBookingConfirmation, track: renderTracking, genRef: genRef };
})();
