/* =========================================================================
 * Lavera Clinic — Site Configuration
 * -------------------------------------------------------------------------
 * هذا الملف هو "المصدر الواحد للحقيقة" لكل بيانات العيادة الظاهرة في الموقع.
 * لاستنساخ الموقع لعميل جديد:
 *   1) انسخ المجلد كاملاً.
 *   2) عدّل القيم في هذا الملف فقط (CLINIC, CONTACT, SERVICES, ...).
 *   3) انشر — لا تحتاج تعديل HTML.
 * =========================================================================
 */

window.SITE_CONFIG = {
    /* الهوية الأساسية */
    clinic: {
        nameAr: 'عيادات لافيرا',
        nameEn: 'Lavera Clinics',
        tagline_ar: 'جلدية · تجميل · ليزر',
        tagline_en: 'Dermatology · Cosmetics · Laser',
        established: 2018,
        domain: 'laveraclinic.sa', // بدائل: laveraa.com (الموقع الحالي للعميل)
        logoText: { primary: 'Lavera', secondary: 'Clinic' }
    },

    /* بيانات التواصل (مأخوذة من المصادر الرسمية لعيادات لافيرا — laveraa.co + Google Maps + Instagram) */
    contact: {
        phone:        '+966582222898',     // الرقم الرسمي في فوتر laveraa.co
        phoneDisplay: '+966 58 222 2898',  // للعرض
        whatsappE164: '966582222898',      // لـ wa.me/
        email:        'info@laveraa.co',
        addressShort_ar: 'فرع اليرموك، الرياض',
        addressShort_en: 'Al-Yarmuk Branch, Riyadh',
        addressFull_ar:  'مخرج ٩ · طريق الصحابة · حي اليرموك · الرياض · المملكة العربية السعودية',
        addressFull_en:  'Exit 9 · Al-Sahaba Road · Al-Yarmuk · Riyadh · KSA',
        mapsUrl: 'https://maps.app.goo.gl/CVhtrFU77GRkPFrY6',
        geo: { lat: 24.8200, lng: 46.6900 }, // تقريبي — يُستبدل بإحداثيات Maps الفعلية
        branches: [
            { name_ar: 'فرع اليرموك',  name_en: 'Al-Yarmuk Branch',  address_ar: 'مخرج 9 · طريق الصحابة · اليرموك · الرياض' },
            { name_ar: 'فرع الملقا',  name_en: 'Al-Malqa Branch',   address_ar: 'حي الملقا · الرياض' }
        ]
    },

    /* ساعات العمل */
    hours: {
        ar: 'السبت – الخميس: ١٠ صباحاً – ١٠ مساءً · الجمعة: ٣ عصراً – ١٠ مساءً',
        en: 'Saturday – Thursday: 10 AM – 10 PM · Friday: 3 PM – 10 PM',
        structured: [
            { days: ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'], opens: '10:00', closes: '22:00' },
            { days: ['Friday'], opens: '15:00', closes: '22:00' }
        ]
    },

    /* وسائل التواصل الاجتماعي */
    social: {
        instagram: 'https://www.instagram.com/laveraclinics/',
        snapchat:  'https://www.snapchat.com/@laveraclinics',
        tiktok:    'https://www.tiktok.com/@laveraclinics',
        twitter:   '',
        youtube:   ''
    },

    /* نظام الألوان (تعديل واحد يغيّر الموقع كاملاً) */
    theme: {
        primary:   '#C9A574',  // الذهبي الفاخر
        secondary: '#1A1A1A',  // الأسود الراقي
        accent:    '#F5E6D3',  // الكريم الخفيف
        background:'#FFFFFF'
    },

    /* الإحصائيات (Hero stats) — أرقام لافيرا الرسمية من الموقع */
    stats: {
        branches:  { value: '٢',        label_ar: 'فروع',       label_en: 'Branches' },
        doctors:   { value: '٤٠+',      label_ar: 'طبيب',       label_en: 'Doctors' },
        patients:  { value: '٢٥٬٠٠٠+',  label_ar: 'عميل',       label_en: 'Clients' },
        satisfaction: { value: '٩٨٪',  label_ar: 'معدل الرضا', label_en: 'Satisfaction' }
    },

    /* الخدمات الست المعتمدة من laveraa.co */
    services: [
        { key: 's1', icon: 'laser', name_ar: 'إزالة الشعر بالليزر', name_en: 'Laser Hair Removal',   desc_ar: 'تقنيات ليزر متقدمة للتخلص النهائي من الشعر الزائد بأمان وفعالية', desc_en: 'Advanced laser tech for safe, effective permanent removal.' },
        { key: 's2', icon: 'face',  name_ar: 'حقن البوتوكس',          name_en: 'Botox Injections',    desc_ar: 'حقن البوتوكس بالتقنية الكورية لشد الوجه بمظهر طبيعي بدون مبالغة',  desc_en: 'Korean-tech Botox for natural face lifting without overdone results.' },
        { key: 's3', icon: 'filler',name_ar: 'الفيلر',                name_en: 'Dermal Filler',       desc_ar: 'فيلر فاخر لمعالجة التجاعيد ونحت الوجه بنتائج فورية وطبيعية', desc_en: 'Premium filler for wrinkles and facial sculpting with natural results.' },
        { key: 's4', icon: 'glow',  name_ar: 'إبر النضارة',           name_en: 'Glow Injections',     desc_ar: 'إبر نضارة لإشراق طبيعي وترطيب عميق وحيوية مستمرة للبشرة', desc_en: 'Glow injections for radiance, deep hydration and sustained vitality.' },
        { key: 's5', icon: 'peel',  name_ar: 'التقشير الكيميائي',    name_en: 'Chemical Peeling',    desc_ar: 'تقشير كيميائي متقدم لتجديد البشرة وتوحيد لونها وتحسين ملمسها', desc_en: 'Advanced peeling for skin renewal and even tone.' },
        { key: 's6', icon: 'laser', name_ar: 'الفراكشنال ليزر',      name_en: 'Fractional Laser',    desc_ar: 'فراكشنال ليزر لعلاج آثار حب الشباب والندبات وتجديد البشرة العميق', desc_en: 'Fractional laser for acne scars and deep skin renewal.' }
    ],

    /* الأطباء — مقتبسة من laveraa.co/doctors.aspx (للـ demo فقط، تُستبدل بصور رسمية بعد التوقيع) */
    doctors: [
        {
            name_ar: 'د. يمنى الخزرجي',
            name_en: 'Dr. Yomna Al-Khazraji',
            specialty_ar: 'أخصائية الجلدية والتجميل والليزر',
            specialty_en: 'Dermatology, Cosmetics & Laser Specialist',
            years: '12+',
            tags: ['البوتوكس', 'الفيلر', 'الليزر'],
            image: ''
        },
        {
            name_ar: 'د. ايرينا',
            name_en: 'Dr. Irina',
            specialty_ar: 'طبيبة الجلدية الروسية — أخصائية الجلدية والتجميل والليزر',
            specialty_en: 'Russian Dermatologist — Cosmetics & Laser Specialist',
            years: '15+',
            tags: ['تجديد البشرة', 'الليزر'],
            image: ''
        },
        {
            name_ar: 'د. هبه عبدالعزيز',
            name_en: 'Dr. Heba Abdulaziz',
            specialty_ar: 'أخصائية الجلدية والتجميل والليزر',
            specialty_en: 'Dermatology, Cosmetics & Laser Specialist',
            years: '10+',
            tags: ['علاج حب الشباب', 'الأمراض الجلدية'],
            image: ''
        }
    ],

    /* وسائل الدفع المقبولة (إشارة ثقة للعميل) */
    payments: ['Mada', 'Visa', 'Mastercard', 'Tamara', 'Tabby', 'Apple Pay'],

    /* Formspree integration (الطرف الخلفي المؤقت قبل Laravel) */
    forms: {
        appointmentId: 'xykvqjjk',
        contactId:     'xykvqjjk',
        endpoint: function(id){ return 'https://formspree.io/f/' + id; }
    },

    /* الـ Attribution في الفوتر (Stilus Ingenium branding) */
    builtBy: {
        name: 'Stilus Ingenium',
        url:  'https://stilus-ingenium.com',
        showInFooter: true
    },

    /* ----------------------------------------------------------------
     * Backend Integration (Laravel API)
     * ----------------------------------------------------------------
     * إذا تركتها '' → الموقع يستخدم Formspree (الحالة الافتراضية)
     * إذا ضبطتها → الموقع يستخدم Laravel API تلقائياً
     * مثال: 'https://api.laveraclinic.sa/api'
     * ---------------------------------------------------------------- */
    apiBase: ''
};

// Window-level alias لـ api-client.js
window.API_BASE = window.SITE_CONFIG.apiBase || (function () {
    // ربط ذكي: على localhost → Laravel API المحلي · على الإنتاج → Formspree/المضبوط
    var h = location.hostname;
    if (h === 'localhost' || h === '127.0.0.1') return 'http://127.0.0.1:8000/api';
    return '';
})();

/* ==========================================================================
 *  تطبيق CONFIG على الصفحة (يُنفّذ تلقائياً بعد DOMContentLoaded)
 *  - يستبدل أرقام التليفون، الواتس، الإيميل، العنوان، الساعات، Schema.org
 *  - لا يلمس النصوص الثابتة المترجَمة (متروكة لـ translations في script.js)
 * ========================================================================== */
(function applyConfig(){
    if (!window.SITE_CONFIG) return;
    const C = window.SITE_CONFIG;

    function rewriteWhenReady(){
        // 1) كل روابط الواتساب
        document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
            a.href = 'https://wa.me/' + C.contact.whatsappE164;
        });

        // 2) كل روابط tel:
        document.querySelectorAll('a[href^="tel:"]').forEach(a => {
            a.href = 'tel:' + C.contact.phone;
            // لو فيه نص الرقم نفسه، حدّثه
            if (/^\+?\d[\d\s\-]+$/.test(a.textContent.trim())) {
                a.textContent = C.contact.phoneDisplay;
            }
        });

        // 3) كل روابط mailto:
        document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
            a.href = 'mailto:' + C.contact.email;
            if (a.textContent.includes('@')) a.textContent = C.contact.email;
        });

        // 3.5) Social links في الفوتر — استبدال href="#" بـ الروابط الفعلية
        // الترتيب في HTML: Instagram → Twitter/X → Snapchat → WhatsApp
        const socialMap = [C.social.instagram, C.social.twitter, C.social.snapchat, C.social.tiktok];
        document.querySelectorAll('.footer-social .social-link[href="#"]').forEach((a, i) => {
            const url = socialMap[i];
            if (url) {
                a.href = url;
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener noreferrer');
            } else {
                // لو ما فيه URL، خبّي الزر بدل ما يظهر مكسور
                a.style.display = 'none';
            }
        });

        // 4) عناصر بـ data-config
        document.querySelectorAll('[data-config]').forEach(el => {
            const path = el.getAttribute('data-config');
            const val  = getByPath(C, path);
            if (val !== undefined && val !== null) {
                if (el.tagName === 'A' && path.includes('Url')) el.href = val;
                else el.textContent = val;
            }
        });

        // 5) Schema.org — حدّث الـ JSON-LD لو موجود
        const ldScript = document.querySelector('script[type="application/ld+json"]');
        if (ldScript) {
            try {
                const obj = JSON.parse(ldScript.textContent);
                obj.name        = C.clinic.nameAr;
                obj.alternateName = C.clinic.nameEn;
                obj.telephone   = C.contact.phone;
                obj.url         = 'https://' + C.clinic.domain + '/';
                obj.address     = obj.address || { "@type": "PostalAddress" };
                obj.address.addressLocality = 'الرياض';
                obj.address.addressRegion   = 'الرياض';
                obj.address.addressCountry  = 'SA';
                obj.address.streetAddress   = C.contact.addressShort_ar;
                obj.geo = { "@type": "GeoCoordinates", latitude: C.contact.geo.lat, longitude: C.contact.geo.lng };
                obj.sameAs = Object.values(C.social).filter(Boolean);
                obj.openingHoursSpecification = C.hours.structured.map(h => ({
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: h.days, opens: h.opens, closes: h.closes
                }));
                obj.paymentAccepted = C.payments.join(', ');
                ldScript.textContent = JSON.stringify(obj);
            } catch (e) { /* ignore */ }
        }

        // 6) Open Graph + Canonical URLs
        var ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', 'https://' + C.clinic.domain + '/');
        var canon = document.querySelector('link[rel="canonical"]');
        if (canon) canon.setAttribute('href', 'https://' + C.clinic.domain + '/');
    }

    function getByPath(obj, path) {
        return path.split('.').reduce(function (o, k) { return (o || {})[k]; }, obj);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', rewriteWhenReady);
    } else {
        rewriteWhenReady();
    }
})();
