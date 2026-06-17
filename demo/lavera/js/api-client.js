/* =========================================================================
 * Lavera Clinic — API Client (للـ Laravel Backend)
 * -------------------------------------------------------------------------
 * يستبدل Formspree بـ Laravel API عند توفر backend.
 * لو API غير متاح، يتراجع تلقائياً لـ Formspree (fallback).
 * =========================================================================
 */

(function () {
    'use strict';

    /* ------------------------- إعدادات الـ API ------------------------- */
    const API_BASE = window.API_BASE || (window.SITE_CONFIG && window.SITE_CONFIG.apiBase) || '';
    const HAS_BACKEND = !!API_BASE;

    /* لو فيه backend، استخدمه. لو لا، fallback لـ Formspree (script.js handlers الأصلية) */
    if (!HAS_BACKEND) {
        console.info('[ApiClient] لا backend مكوّن — استخدام Formspree الأصلي.');
        return;
    }

    console.info('[ApiClient] متصل بـ:', API_BASE);

    /* ------------------------- Helpers ------------------------- */
    function getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.content || '';
    }

    async function api(method, path, data = null) {
        const opts = {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        };
        const csrf = getCsrfToken();
        if (csrf) opts.headers['X-CSRF-TOKEN'] = csrf;
        if (data) opts.body = JSON.stringify(data);

        const res = await fetch(API_BASE + path, opts);
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            const err = new Error(json.message || 'API request failed');
            err.status = res.status;
            err.errors = json.errors;
            throw err;
        }
        return json;
    }

    /* ------------------------- Public API methods ------------------------- */
    window.ClinicApi = {
        async submitAppointment(formData) {
            return api('POST', '/v1/appointments', formData);
        },
        async submitMessage(formData) {
            return api('POST', '/v1/messages', formData);
        },
        async getServices() {
            return api('GET', '/v1/services');
        },
        async getDoctors() {
            return api('GET', '/v1/doctors');
        },
        async getGallery() {
            return api('GET', '/v1/gallery');
        },
        async getSettings() {
            return api('GET', '/v1/settings');
        },
        async getTestimonials() {
            return api('GET', '/v1/testimonials');
        },
    };

    /* ------------------------- استبدال handlers الأصلية ------------------------- */
    document.addEventListener('DOMContentLoaded', () => {
        const apptForm    = document.getElementById('appointmentForm');
        const contactForm = document.getElementById('contactForm');

        if (apptForm) {
            apptForm.removeEventListener('submit', window.handleAppointmentSubmit);
            apptForm.addEventListener('submit', handleApptApi);
        }
        if (contactForm) {
            contactForm.removeEventListener('submit', window.handleContactSubmit);
            contactForm.addEventListener('submit', handleContactApi);
        }
    });

    async function handleApptApi(e) {
        e.preventDefault();
        const form = e.target;
        const submit = form.querySelector('button[type="submit"]');
        const original = submit ? submit.textContent : '';
        if (submit) { submit.disabled = true; submit.textContent = 'جارٍ الإرسال...'; }

        try {
            const data = serializeForm(form);
            // honeypot — يجب أن يكون فارغ
            data.website = data.website || '';
            const res = await window.ClinicApi.submitAppointment(data);
            window.showNotification && window.showNotification(
                `تم استلام طلبك (${res.reference || ''}). سنتواصل معك قريباً.`,
                'success'
            );
            form.reset();
        } catch (err) {
            const msg = err.errors ? Object.values(err.errors).flat()[0] : (err.message || 'تعذّر الإرسال');
            window.showNotification && window.showNotification(msg, 'error');
        } finally {
            if (submit) { submit.disabled = false; submit.textContent = original; }
        }
    }

    async function handleContactApi(e) {
        e.preventDefault();
        const form = e.target;
        const submit = form.querySelector('button[type="submit"]');
        const original = submit ? submit.textContent : '';
        if (submit) { submit.disabled = true; submit.textContent = 'جارٍ الإرسال...'; }

        try {
            const data = serializeForm(form);
            data.website = data.website || '';
            await window.ClinicApi.submitMessage(data);
            window.showNotification && window.showNotification('تم إرسال رسالتك بنجاح', 'success');
            form.reset();
        } catch (err) {
            const msg = err.errors ? Object.values(err.errors).flat()[0] : (err.message || 'تعذّر الإرسال');
            window.showNotification && window.showNotification(msg, 'error');
        } finally {
            if (submit) { submit.disabled = false; submit.textContent = original; }
        }
    }

    function serializeForm(form) {
        const fd = new FormData(form);
        const obj = {};
        for (const [k, v] of fd.entries()) obj[k] = v;
        return obj;
    }
})();
