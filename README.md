# منصة إقامة — Iqama Hotel Booking Platform 🏨🇸🇩

منصة إلكترونية متكاملة لاستعراض وحجز الفنادق في السودان (الخرطوم، بورتسودان، أمدرمان)، تشتمل على واجهة أمامية عصرية متوافقة مع الهواتف الذكية (Frontend) وواجهة برمجية قوية مبنية بإطار العمل Laravel (Backend API).

---

## 🚀 طريقة الرفع السريع على Render (أقل من 5 دقائق)

تم إعداد المشروع بالكامل ليعمل على **Render** إما كخدمة واحدة مدمجة مجانية (تخدم الـ Backend والـ Frontend معاً دون مشاكل CORS) أو كخدمات منفصلة.

### الطريقة الأولى: الرفع المباشر كخدمة ويب (Docker Web Service) — الأسهل والموصى بها

1. سجّل دخولك إلى حسابك على [Render.com](https://render.com).
2. اضغط على زر **New +** ثم اختر **Web Service**.
3. اربط حساب GitHub واختر المستودع: `https://github.com/ZuhairAhmed0/hotel-booking`.
4. سيقرأ Render ملف `Dockerfile` تلقائياً من المستودع.
5. في إعدادات الخدمة (Settings):
   - **Name**: `iqama-hotel-booking` (أو أي اسم تفضله)
   - **Region**: Frankfurt (أو الأقرب لك)
   - **Instance Type**: Free
6. أضف متغيرات البيئة التالية في قسم **Environment Variables**:
   - `APP_ENV`: `production`
   - `APP_DEBUG`: `false`
   - `DB_CONNECTION`: `sqlite`
   - `LOG_CHANNEL`: `stderr`
   - `APP_KEY`: اضغط على Generate أو ضع مفتاحك (إذا لم تحدده، سيتم توليده تلقائياً عند أول تشغيل).
7. اضغط على **Deploy Web Service**.
8. بعد اكتمال البناء (Build Success):
   - ستظهر لك الرابط المباشر، مثل: `https://iqama-hotel-booking.onrender.com`.
   - بمجرد الدخول ستجد الموقع بالكامل يعمل مباشرة، وقاعدة البيانات تم ترحيلها وملؤها بالبيانات تلقائياً!

---

### الطريقة الثانية: استخدام Render Blueprint (`render.yaml`)

1. من لوحة تحكم Render، اضغط على **Blueprints**.
2. اختر مستودع `hotel-booking`.
3. سيتعرّف Render تلقائياً على ملف `render.yaml` المرفق مع المشروع ويقوم بإنشاء الخدمة وتعيين كافة المتغيرات بضغطة زر واحدة.

---

## 🛠️ المميزات المجهزة في هذا الإصدار لـ Render

1. **قاعدة بيانات جاهزة تلقائياً (Auto-Migrate & Auto-Seed)**:
   - عند تشغيل الحاوية لأول مرة يتم إنشاء قاعدة بيانات SQLite تلقائياً وتطبيق التهجيرات (Migrations).
   - يتم ملء النظام ببيانات واقعية لفنادق الخرطوم وبورتسودان وأمدرمان (فندق كورنثيا، القراند هوتيل، السلام روتانا، مارينا بورتسودان، بوغنفيل، قصر الضيافة، إلخ) مع الغرف والأسعار والصور.
2. **اكتشاف تلقائي لرابط الـ API**:
   - ملف `api-config.js` يتعرف تلقائياً على النطاق المنشور عليه (Domain) ويرسل الطلبات إليه مباشرة، دون الحاجة لتعديل يدوي.
3. **دعم PostgreSQL على Render**:
   - إذا رغبت في ربط قاعدة بيانات Render PostgreSQL المجانية، فقط اربط الـ Database وستعمل تلقائياً بفضل دعم متغير `DATABASE_URL`.
4. **تجاوز مشاكل CORS**:
   - تم ضبط إعدادات `cors.php` في Laravel للسماح بالطلبات بشكل آمن من أي واجهة أمامية.
5. **توافق كامل بين نماذج الواجهة والـ Backend**:
   - تم توحيد أسماء الحقول لطلب الحجز (`customer_name` / `full_name`، `customer_phone` / `phone_number`، `check_in` / `arrive_date`، إلخ) لتفادي أي أخطاء التحقق (Validation Errors).

---

## 💻 التشغيل محلياً (Local Development)

### 1. تشغيل الـ Backend (Laravel):
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
سيعمل السيرفر على: `http://127.0.0.1:8000`.

### 2. تشغيل الـ Frontend:
يمكنك ببساطة فتح مجلد `frontend`:
- إما بفتح `frontend/index.html` في المتصفح، أو عبر Live Server.
- أو عبر Node:
```bash
cd frontend
npx serve . -l 3000
```
سيتصل الـ Frontend تلقائياً بـ `http://127.0.0.1:8000/api`.

---

## 📡 مسارات الواجهة البرمجية (API Endpoints)

| المسار | الطريقة | الوصف |
|--------|---------|-------|
| `/api/hotels` | `GET` | عرض جميع الفنادق المتاحة مع الغرف |
| `/api/hotels/{id}` | `GET` | عرض تفاصيل فندق محدد |
| `/api/hotels/{id}/rooms` | `GET` | عرض غرف فندق محدد |
| `/api/bookings` | `POST` | إنشاء حجز جديد والتحقق من التوفر |
| `/api/bookings` | `GET` | استعراض الحجوزات |
| `/api/bookings/{id}/status` | `PUT` | تحديث حالة الحجز (قبول/رفض) |
| `/health` | `GET` | فحص جاهزية الخادم (Health Check) |
