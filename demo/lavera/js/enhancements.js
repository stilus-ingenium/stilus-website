/* =========================================================================
 * Lavera — Quality Enhancements
 * تحسينات الجودة لرفع الموقع لمستوى "بيرفكت" + Lighthouse 90+
 * - Scroll progress bar
 * - Lazy loading للصور
 * - Counter animation للإحصائيات
 * - Sticky mobile CTA
 * - Trust badges
 * - Reveal animations محسّنة
 * ========================================================================= */
(function() {
    'use strict';

    /* ----------------------------- 1) Scroll Progress Bar */
    function initScrollProgress() {
        const bar = document.createElement('div');
        bar.id = 'scroll-progress';
        bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0;background:linear-gradient(90deg,#C9A574,#A88553);z-index:9999;transition:width 0.1s ease-out;pointer-events:none;';
        document.body.appendChild(bar);
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            bar.style.width = Math.min(scrolled, 100) + '%';
        }, { passive: true });
    }

    /* ----------------------------- 2) Lazy loading للصور */
    function initLazyImages() {
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.setAttribute('loading', 'lazy');
            img.setAttribute('decoding', 'async');
        });
    }

    /* ----------------------------- 3) Counter Animation للإحصائيات */
    function initCounters() {
        const numerals = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
        function toArabicNumeral(n){ return String(n).replace(/[0-9]/g, d => numerals[+d]); }

        const stats = document.querySelectorAll('.stat-number');
        if (!stats.length) return;

        const animateOne = (el) => {
            const raw = el.textContent.trim();
            // استخراج الرقم فقط (سواء عربي أو لاتيني)
            let numStr = raw.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
            numStr = numStr.replace(/[^0-9]/g, '');
            if (!numStr) return;
            const target = parseInt(numStr, 10);
            const suffix = /[+%٪]$/.test(raw) ? raw.slice(-1) : '';
            const prefix = ''; // لا نضيف بادئة
            const useArabic = /[٠-٩]/.test(raw);

            let current = 0;
            const stepMs = 16;
            const totalMs = 1200;
            const steps   = totalMs / stepMs;
            const step    = target / steps;

            const tick = () => {
                current += step;
                if (current >= target) {
                    current = target;
                    const formatted = current >= 1000 ? current.toLocaleString('en-US').replace(/,/g, '٬') : current;
                    el.textContent = (useArabic ? toArabicNumeral(formatted).replace(/٬/g,'٬') : formatted) + suffix;
                    return;
                }
                const v = Math.floor(current);
                const formatted = v >= 1000 ? v.toLocaleString('en-US').replace(/,/g, '٬') : v;
                el.textContent = (useArabic ? toArabicNumeral(formatted).replace(/٬/g,'٬') : formatted) + suffix;
                requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animateOne(e.target);
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(s => io.observe(s));
    }

    /* ----------------------------- 4) Sticky Mobile CTA Bar */
    function initStickyMobileCTA() {
        // لا تظهر في صفحة الحجز
        if (location.pathname.includes('appointment')) return;

        const bar = document.createElement('div');
        bar.className = 'sticky-mobile-cta';
        const phone = (window.SITE_CONFIG && window.SITE_CONFIG.contact.phone) || '+966582222898';
        const wa    = (window.SITE_CONFIG && window.SITE_CONFIG.contact.whatsappE164) || '966582222898';
        bar.innerHTML = `
            <a href="/appointment" class="sticky-cta-btn primary">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                احجز موعد
            </a>
            <a href="tel:${phone}" class="sticky-cta-btn secondary">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                اتصل
            </a>
            <a href="https://wa.me/${wa}?text=السلام%20عليكم%2C%20أرغب%20بحجز%20موعد" class="sticky-cta-btn whatsapp">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>
                واتساب
            </a>
        `;
        document.body.appendChild(bar);
    }

    /* ----------------------------- 5) Trust Badges Bar (وسائل دفع) */
    function initTrustBadges() {
        if (!window.SITE_CONFIG || !window.SITE_CONFIG.payments) return;
        const footer = document.querySelector('.footer .container-custom');
        if (!footer) return;
        if (document.querySelector('.trust-badges')) return; // لا تكرّر

        const div = document.createElement('div');
        div.className = 'trust-badges';
        div.innerHTML = `
            <div class="trust-badges-title">وسائل الدفع المقبولة</div>
            <div class="trust-badges-list">
                ${window.SITE_CONFIG.payments.map(p => `<span class="trust-badge">${p}</span>`).join('')}
            </div>
        `;
        const footerBottom = footer.querySelector('.footer-bottom');
        if (footerBottom) footer.insertBefore(div, footerBottom);
        else footer.appendChild(div);
    }

    /* ----------------------------- 6) Reveal animations محسّنة */
    function initRevealAnimations() {
        // إظهار آمن: لا نخفي المحتوى أبداً. حركة دخول لطيفة عبر CSS على التحميل.
        // لو فشلت الحركة لأي سبب، المحتوى يبقى ظاهراً (opacity:1 افتراضياً).
        var sel = '.section-header, .service-card, .why-feature, .doctor-card, .testimonial-card, .ba-slider, .footer-col';
        document.querySelectorAll(sel).forEach(function (el, i) {
            if (el.classList.contains('la-reveal')) return;
            el.style.setProperty('--la-delay', (Math.min(i % 6, 5) * 0.07) + 's');
            el.classList.add('la-reveal');
        });
    }

    /* ----------------------------- 7) Preconnect لـ Unsplash لتسريع تحميل الصور */
    function addPreconnect() {
        ['https://fonts.gstatic.com', 'https://cdn.tailwindcss.com'].forEach(url => {
            if (document.querySelector(`link[rel="preconnect"][href="${url}"]`)) return;
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            link.crossOrigin = '';
            document.head.appendChild(link);
        });
    }

    /* ----------------------------- 8) إصلاح ARIA + accessibility */
    function fixAccessibility() {
        // اضف aria-label لروابط الأيقونات بدون نص
        document.querySelectorAll('.social-link:not([aria-label])').forEach(a => {
            const svg = a.querySelector('svg');
            if (svg) a.setAttribute('aria-label', 'social link');
        });
        // اضف title للروابط الخارجية
        document.querySelectorAll('a[target="_blank"]:not([rel])').forEach(a => {
            a.setAttribute('rel', 'noopener noreferrer');
        });
    }

    /* ----------------------------- التشغيل */
    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(() => {
        try { addPreconnect(); } catch(e){}
        try { initScrollProgress(); } catch(e){}
        try { initLazyImages(); } catch(e){}
        try { initCounters(); } catch(e){}
        try { initStickyMobileCTA(); } catch(e){}
        try { initTrustBadges(); } catch(e){}
        try { initRevealAnimations(); } catch(e){}
        try { fixAccessibility(); } catch(e){}
    });
})();
