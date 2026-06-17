/* =========================================================================
 *  Lavera — i18n Engine  (نظام ترجمة احترافي قابل للتوسّع)
 *  -------------------------------------------------------------------------
 *  • المفتاح = النص العربي الأصلي (source-text / msgid مثل gettext).
 *  • إضافة لغة: أنشئ js/lang/<code>.js يستدعي LaveraI18n.register(code, label, {..})
 *    ثم اربطه قبل هذا الملف. المحرّك يبني زر/قائمة التبديل تلقائياً.
 *  • RTL تلقائي للغات العربية/العبرية/الفارسية/الأردية.
 *  • أنماط ذكية احتياطية: "نص / Text" · "X - قبل وبعد" · "N+ سنة خبرة".
 *  • الـ API:  LaveraI18n.set('en') · .toggle() · .current() · .languages()
 * ========================================================================= */
(function () {
    'use strict';

    var STORAGE_KEY = 'lavera_lang';
    var DEFAULT_LANG = 'ar';
    var RTL = { ar: 1, he: 1, fa: 1, ur: 1 };

    var registry = {};   // code -> { label, dict }
    var order = [];      // ترتيب التسجيل

    /* -------- تسجيل لغة (تستدعيه ملفات js/lang/*.js) -------- */
    function register(code, label, dict) {
        if (registry[code]) {
            // دمج — يسمح بتقسيم حزمة اللغة عبر عدة استدعاءات/ملفات
            var d = dict || {};
            for (var k in d) registry[code].dict[k] = d[k];
            if (label) registry[code].label = label;
        } else {
            registry[code] = { label: label || code.toUpperCase(), dict: dict || {} };
            if (order.indexOf(code) === -1) order.push(code);
        }
        window.__LAVERA_REV = null; // أعد بناء الخريطة العكسية عند الحاجة
    }

    /* -------- ترجمة نص واحد (قاموس ثم أنماط ذكية) -------- */
    function translate(src, dict, code) {
        if (dict[src] !== undefined) return dict[src];
        var isAr = (code === DEFAULT_LANG);
        // نمط ثنائي اللغة "عربي / English" → الجزء المطابق للّغة الحالية
        if (src.indexOf(' / ') > -1) {
            var parts = src.split(' / ');
            for (var i = 0; i < parts.length; i++) {
                var hasAr = /[؀-ۿ]/.test(parts[i]), hasLat = /[A-Za-z]/.test(parts[i]);
                if (isAr && hasAr) return parts[i].trim();
                if (!isAr && hasLat && !hasAr) return parts[i].trim();
            }
        }
        if (isAr) return src; // العربية = المصدر، لا أنماط
        // أنماط الإنجليزية فقط
        var m = src.match(/^(.*) - قبل وبعد$/);
        if (m) { var pre = dict[m[1].trim()] || m[1].trim(); return pre + ' - Before & After'; }
        var e = src.match(/^(\d+)\+?\s*سنة خبرة$/);
        if (e) return e[1] + '+ yrs experience';
        return src;
    }

    /* -------- التقاط النصوص الأصلية (مرّة لكل عنصر) -------- */
    function captureSources(root) {
        var all = (root || document.body).querySelectorAll('*');
        for (var i = 0; i < all.length; i++) {
            var el = all[i], tag = el.tagName;
            if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'SVG' || tag === 'I' || tag === 'svg') continue;
            if (el.classList && el.classList.contains('lang-toggle')) continue;
            // عنصر ورقي (نص فقط)
            if (el.children.length === 0 && el.dataset.i18nSrc === undefined) {
                var t = el.textContent.trim();
                if (t && /[؀-ۿ]/.test(t)) el.dataset.i18nSrc = t;
            }
            // placeholder
            if ((tag === 'INPUT' || tag === 'TEXTAREA') && el.dataset.i18nPh === undefined) {
                var ph = (el.getAttribute('placeholder') || '').trim();
                if (ph && /[؀-ۿ]/.test(ph)) el.dataset.i18nPh = ph;
            }
        }
        if (document.title && document.documentElement.dataset.i18nTitle === undefined
            && /[؀-ۿ]/.test(document.title)) {
            document.documentElement.dataset.i18nTitle = document.title.trim();
        }
    }

    /* -------- تطبيق لغة -------- */
    function set(code) {
        if (!registry[code]) code = DEFAULT_LANG;
        captureSources();
        var dict = registry[code].dict;
        var html = document.documentElement;

        html.setAttribute('lang', code);
        html.setAttribute('dir', RTL[code] ? 'rtl' : 'ltr');
        html.style.fontFamily = RTL[code] ? '' : "'Inter', 'Tajawal', system-ui, sans-serif";

        // النصوص
        document.querySelectorAll('[data-i18n-src]').forEach(function (el) {
            el.textContent = translate(el.dataset.i18nSrc, dict, code);
        });
        // الـ placeholders
        document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
            el.setAttribute('placeholder', translate(el.dataset.i18nPh, dict, code));
        });
        // عنوان الصفحة
        if (html.dataset.i18nTitle) document.title = translate(html.dataset.i18nTitle, dict, code);

        // أزرار التبديل تعرض اللغة التالية
        var next = order[(order.indexOf(code) + 1) % order.length];
        document.querySelectorAll('.lang-toggle').forEach(function (b) {
            b.textContent = registry[next] ? registry[next].label : next.toUpperCase();
            b.setAttribute('aria-label', 'Switch language');
        });

        try { localStorage.setItem(STORAGE_KEY, code); } catch (ex) {}
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: code } }));
    }

    function toggle() {
        var cur = current();
        set(order[(order.indexOf(cur) + 1) % (order.length || 1)]);
    }
    function current() { return document.documentElement.getAttribute('lang') || DEFAULT_LANG; }

    /* -------- API عام -------- */
    window.LaveraI18n = {
        register: register, set: set, toggle: toggle, current: current,
        languages: function () { return order.slice(); },
        label: function (c) { return registry[c] ? registry[c].label : c; }
    };
    // توافق مع أزرار onclick="toggleLanguage()" القديمة
    window.toggleLanguage = toggle;

    /* -------- الإقلاع -------- */
    function init() {
        captureSources();                       // التقاط المصدر العربي أولاً
        var saved = DEFAULT_LANG;
        try { saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; } catch (ex) {}
        set(saved);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

    // إعادة الالتقاط/التطبيق بعد تحميل المحتوى الديناميكي (enhancements: sticky CTA/trust)
    window.addEventListener('load', function () { set(current()); });
})();
