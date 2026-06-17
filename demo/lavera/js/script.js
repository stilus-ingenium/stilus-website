// =====================================================================
// CONFIG: Replace FORMSPREE_ID with the ID from your Formspree form.
// 1) Sign up free at https://formspree.io  (use dev@stilus-ingenium.com)
// 2) Create a new form → copy the form ID (looks like "xyzabcde")
// 3) Replace the placeholder below in both APPOINTMENT_ENDPOINT and CONTACT_ENDPOINT
// =====================================================================
const FORMSPREE_APPOINTMENT_ID = 'xykvqjjk';   // Lavera Clinic — Appointments (Formspree)
const FORMSPREE_CONTACT_ID     = 'xykvqjjk';   // same form; _subject differentiates incoming emails

const APPOINTMENT_ENDPOINT = `https://formspree.io/f/${FORMSPREE_APPOINTMENT_ID}`;
const CONTACT_ENDPOINT     = `https://formspree.io/f/${FORMSPREE_CONTACT_ID}`;

// (نظام الترجمة انتقل إلى js/i18n.js + js/lang/*.js — أنظف وأقابل للتوسّع)

// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.nav-container');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Validation (for appointment and contact forms)
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Phone Number Formatting (Saudi Arabia)
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.startsWith('966')) {
        value = value.substring(3);
    } else if (value.startsWith('0')) {
        value = value.substring(1);
    }

    if (value.length > 9) {
        value = value.substring(0, 9);
    }

    input.value = value;
}

// Appointment Form Handler — Formspree integration
async function handleAppointmentSubmit(e) {
    e.preventDefault();

    if (!validateForm('appointmentForm')) {
        showNotification('الرجاء ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    const formEl  = e.target;
    const submit  = formEl.querySelector('button[type="submit"]');
    const original = submit ? submit.textContent : '';
    if (submit) { submit.disabled = true; submit.textContent = 'جارٍ الإرسال...'; }

    // جمع بيانات الطلب (النصوص العربية من القوائم) لعرضها في التأكيد والتتبّع
    const sel = id => { const el = formEl.querySelector(`[name="${id}"]`); if (!el) return '';
        return el.tagName === 'SELECT' && el.selectedOptions[0] ? el.selectedOptions[0].textContent.trim() : el.value.trim(); };
    const ref = (window.LaveraBooking && window.LaveraBooking.genRef) ? window.LaveraBooking.genRef() : ('LAV-' + Date.now());
    const booking = {
        ref, name: sel('name'), phone: sel('phone'),
        serviceLabel: sel('service'), doctorLabel: (sel('doctor') && !/اختر/.test(sel('doctor'))) ? sel('doctor') : '',
        dateStr: sel('date'), timeLabel: sel('time')
    };

    const formData = new FormData(formEl);
    formData.append('_subject', 'حجز موعد جديد — Lavera Clinic');
    formData.append('reference', ref);

    // أرسل في الخلفية (Formspree/Laravel) دون تعطيل تجربة التأكيد
    try {
        fetch(APPOINTMENT_ENDPOINT, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } }).catch(() => {});
    } catch (err) {}

    // تجربة التأكيد المتقدمة (تتبّع + تأكيد واتساب تلقائي)
    if (window.LaveraBooking && window.LaveraBooking.show) {
        window.LaveraBooking.show(booking);
        formEl.reset();
    } else {
        showNotification('تم إرسال طلبك بنجاح! رقم طلبك: ' + ref, 'success');
        formEl.reset();
    }
    if (submit) { submit.disabled = false; submit.textContent = original; }
}

// Contact Form Handler — Formspree integration
async function handleContactSubmit(e) {
    e.preventDefault();

    if (!validateForm('contactForm')) {
        showNotification('الرجاء ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    const formEl  = e.target;
    const submit  = formEl.querySelector('button[type="submit"]');
    const original = submit ? submit.textContent : '';
    if (submit) { submit.disabled = true; submit.textContent = 'جارٍ الإرسال...'; }

    const formData = new FormData(formEl);
    formData.append('_subject', 'رسالة جديدة من نموذج التواصل — Lavera Clinic');

    try {
        const res = await fetch(CONTACT_ENDPOINT, {
            method:  'POST',
            body:    formData,
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
            showNotification('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت', 'success');
            formEl.reset();
        } else {
            showNotification('تعذّر الإرسال — حاول مجدداً أو تواصل عبر واتساب', 'error');
        }
    } catch (err) {
        showNotification('تعذّر الاتصال بالخادم — تحقق من الإنترنت', 'error');
    } finally {
        if (submit) { submit.disabled = false; submit.textContent = original; }
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Gallery Lightbox
function openLightbox(imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay" onclick="closeLightbox()"></div>
        <div class="lightbox-content">
            <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
            <img src="${imageSrc}" alt="Gallery Image">
        </div>
    `;

    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
    }
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements on page load
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements
    const animateElements = document.querySelectorAll('.service-card, .doctor-card, .testimonial-card, .why-feature');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Attach form handlers
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Phone number inputs
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }

    .lightbox-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
    }

    .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        z-index: 1;
    }

    .lightbox-content img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 12px;
    }

    .lightbox-close {
        position: absolute;
        top: -50px;
        right: 0;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }

    .lightbox-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);
