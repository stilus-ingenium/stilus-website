# موقع القَلَم الاصطناعي — العام (Public Landing)

موقع تسويقي عام لـ **stilus-ingenium.com**، صفحة واحدة self-contained.

## المحتوى
- `index.html` — الصفحة الكاملة (hero · About · Products · Approach · Contact).
- `assets/` — اللوقو (SVG)، favicon، أيقونات، og-image.

## النشر (أي استضافة ساكنة)
الموقع ساكن بالكامل (HTML + CSS + صور). ارفع مجلد `public/` كما هو:

- **Netlify / Vercel / Cloudflare Pages:** اسحب المجلد أو اربط الريبو — لا build step.
- **GitHub Pages:** ادفع المحتوى لفرع `gh-pages` أو مجلد `/docs`.
- **استضافة عادية (cPanel/FTP):** ارفع محتوى `public/` إلى `public_html/`.

## ملاحظات
- الخطوط من Google Fonts (IBM Plex Sans Arabic + Manrope) عبر CDN — تحتاج إنترنت عند العرض. لتضمينها أوفلاين: نزّل woff2 وضعها في `assets/fonts/` مع `@font-face`.
- البريد: `dev@stilus-ingenium.com` (البريد الرسمي المعتمد).
- لا توجد أي وثائق داخلية أو بيانات شركاء/مالية في هذا الموقع — عام بالكامل وآمن للنشر.
