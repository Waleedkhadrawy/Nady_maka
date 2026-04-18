# دليل اختبار المشروع (Makkah Yard)

## المتطلبات
- XAMPP: تشغيل MySQL على `127.0.0.1:3306`
- استيراد قاعدة البيانات: افتح `http://localhost/phpmyadmin` ثم Import واختر ملف `database.txt`
- إعداد البيئة في `.env`:
  - `PORT=3001`
  - `REACT_APP_API_BASE_URL=http://localhost:3001`
  - `MYSQL_HOST=127.0.0.1`
  - `MYSQL_PORT=3306`
  - `MYSQL_USER=root`
  - `MYSQL_PASSWORD=` (فارغة عادةً)
  - `MYSQL_DB=makkah_yard`
- تثبيت الاعتمادات: `npm install`

## التشغيل
- الباك‑إند: `npm run server` ثم تأكد من ظهور `MySQL pool ready` و`Server listening on port 3001`
- الفرونت: `set PORT=3000 && npm start` ثم افتح `http://localhost:3000`

## ملخص التنفيذ الحالي
- دخول الإدمن: `POST /api/auth/login` مع تحقق `bcrypt` عند وجود بصمة، وتعطيل الاعتماد الاحتياطي في الإنتاج.
- دخول الأعضاء: `POST /api/member-auth/register` و`POST /api/member-auth/login` مع `bcrypt` و`JWT` بدور `member`.
- عضويات وباقات:
  - CRUD للباقات: `GET/POST/PUT/DELETE /api/membership-packages` مع `segment` (`adult|junior|sub`).
  - إضافة عضوية للعضو إداريًا: `POST /api/members/:id/memberships` و`POST /api/members/:id/memberships/checkout` تربط الدفع وتحسب تاريخ الانتهاء من يوم الدفع.
  - المسار العام للدفع: `POST /api/payments/checkout` ينشئ `customer/member/membership/payment` عند الحاجة.
- ملف البروفايل (العضو): قراءة/تعديل بيانات، إدارة الأعضاء الفرعيين، وشراء عضويات أساسي/فرعي مع تحققات `segment` (الفرعيون يرون باقات `sub` فقط، والأساسي وفق العمر `adult/junior`).
- أنشطة ومدربين: CRUD، جداول النشاط، ربط المدرب، تسجيل أعضاء مع التحقق من السعة والتكرار.
- فعاليات: CRUD وتسجيل الأعضاء مع التحقق من السعة.
- حجوزات: نموذج عام للحجز وواجهة إدارة الحجوزات.
- الاستبيان وخدمة العملاء: نماذج عامة إلى `POST /api/surveys` و`POST /api/contact`.
- الإعدادات: قراءة/حفظ `GET/PUT /api/settings`.
- التقارير: `GET /api/reports` يعيد ملخصًا عبر الجداول الرئيسية.
- المدفوعات (لوحة الإدارة): قراءة مع فلاتر وترقيم: `GET /api/payments?from&to&q&status&method&sort&order&page&limit` يعيد `{ items, summary, page, limit, total }`.
- تحسينات الأمن: محدد معدل (`rateLimiter`) لمسارات حساسة، والتحقق من الحقول (`requireFields`)، قائمة سماح CORS عبر `CORS_ORIGINS`، ومعالج أخطاء مركزي، وتحذير عند غياب `JWT_SECRET` في الإنتاج.

## المتبقي للتجهيز للإنتاج
- أمان وصلاحيات: ضبط `JWT_SECRET` في الإنتاج، ضمان تخزين كلمات مرور الإدمن كبصمة `bcrypt` فقط، تضييق `CORS_ORIGINS` لنطاقات محددة، توسيع محدد المعدل وإضافة سجلات منظمة (logger) وتوحيد رسائل الأخطاء.
- تحسين الواجهة: ترقيم/فلاتر في قوائم الأعضاء/الأنشطة/المدربين/الفعاليات/الحجوزات، ومؤشرات تحميل ورسائل نجاح/فشل موحدة في صفحات البروفايل.
- التقارير: تصدير CSV وفلاتر زمنية متقدمة.
- النشر والإعدادات: إعداد `.env.production`، بناء الإنتاج `npm run build`، وتهيئة تشغيل (PM2/Docker) خلف HTTPS، واستراتيجية نسخ احتياطي لقاعدة البيانات، وتكاملات اختيارية (بريد/واتساب) للتأكيدات.

## دخول الإدمن
- واجهة: افتح `http://localhost:3000/admin/login`
- بيانات الدخول: استخدم بيانات الإدمن الموجودة في قاعدة البيانات لديك (لا ترفع أي بيانات حساسة إلى GitHub).
- API: `POST /api/auth/login` مع `{ "username":"<admin_username>", "password":"<admin_password>" }`

## عضوية عامة (تدفق الدفع)
- افتح `http://localhost:3000/membership` واختر تاريخ الميلاد ليتم فلترة الباقات (`adult/junior`).
- انتقل إلى `Checkout` واضغط الدفع؛ يُستدعى `POST /api/payments/checkout` وتُحسب المدة من تاريخ الدفع.
- تأكد من ظهور رسالة النجاح مع `joinDate/expiryDate`.
- تحقق من إنشاء السجلات في DB: `members`, `memberships`, `payments`.
- نموذج دفع تجريبي (يُستخدم تلقائياً من الواجهة):
  - user: `{ username, email, phone, gender, dob }`
  - membership: `{ value, label }` (القيمة من قائمة الباقات)
  - partner اختياري: `{ name, email, birthDate, phone }`

## باقات العضوية (API)
- `GET /api/membership-packages` يعيد جميع الباقات.
- `GET /api/membership-packages?segment=adult|junior|sub` للتصفية.

## إدارة الأعضاء (لوحة التحكم)
- افتح `http://localhost:3000/admin/members`.
- أضف عضوًا أساسيًا مع `dob`، ثم افتح قسم العضويات واختر باقة مناسبة.
- أضف عضوًا فرعيًا؛ اختر العضو الأساسي من القائمة عند النوع الفرعي.
- غيّر حالة العضوية عبر الأزرار: تفعيل/تجميد/إنهاء (يستدعي `PUT /api/memberships/:id/status`).
- اعرض مدفوعات العضوية (يستدعي `GET /api/memberships/:id/payments`).
- أمثلة بيانات إضافة عضو:
  - أساسي: `{ name, email, phone, gender, dob, type:'primary' }`
  - فرعي: `{ name, email, phone, gender, dob, type:'sub', parent_member_id, relation }`
- مثال إضافة عضوية لعضو: `POST /api/members/:id/memberships` مع `{ package_code, join_date? }` (يُحسب الانتهاء تلقائياً).

## إدارة العملاء
- افتح `http://localhost:3000/admin/customers`.
- جرّب إضافة/تعديل/حذف عميل؛ تتصل بـ `GET/POST/PUT/DELETE /api/customers`.
- مثال إضافة عميل: `{ name, email, phone, membershipType?, notes? }`.

## الأنشطة والمدربين
- الأنشطة: `http://localhost:3000/admin/activities`.
  - إنشاء/تحديث/حذف نشاط (CRUD).
  - حفظ جدول النشاط: `POST /api/activities/:id/schedules` مع مصفوفة `{ day_of_week(0-6), start_time(HH:MM:SS), end_time }`.
  - ربط مدرب: `POST /api/activities/:id/trainers/:trainerId`.
  - تسجيل عضو: `POST /api/activities/:id/enroll` مع `{ member_id }` ويتحقق من السعة والتكرار.
- المدربون: `http://localhost:3000/admin/trainers` (CRUD).
- أمثلة بيانات نشاط: `{ name, category, age_group, duration_minutes, price, currency, capacity, image, status }`.

## الفعاليات
- `http://localhost:3000/admin/events`.
- إنشاء/تعديل/حذف فعالية (CRUD).
- تسجيل عضو: `POST /api/events/:id/register` مع `{ member_id }` ويتأكد من السعة.
- مثال فعالية: `{ title, description, date(YYYY-MM-DD), time(HH:MM:SS), location, category, registration_fee, currency, max_participants, status }`.

## الحجوزات
- صفحة عامة: `http://localhost:3000/booking` لإرسال نموذج الحجز (`POST /api/bookings`).
- لوحة التحكم: `http://localhost:3000/admin/bookings` لعرض قائمة الحجوزات (`GET /api/bookings`).
- مثال حجز: `{ member_id?, activity_id?, event_id?, date(YYYY-MM-DD), time(HH:MM:SS), notes }`.

## الاستبيان وخدمة العملاء
- الاستبيان: `http://localhost:3000/survey` يرسل إلى `POST /api/surveys` مع بيانات النموذج.
- خدمة العملاء: `http://localhost:3000/customer-service` يرسل إلى `POST /api/contact` مع `{ name, email, phone, subject, message }`.

## الإعدادات
- `http://localhost:3000/admin/settings`.
- قراءة: `GET /api/settings`، حفظ: `PUT /api/settings` مع `{ site_name, site_name_en, description, description_en, contact_phone, contact_email, address, address_en, social_media{}, working_hours{} }`.

## التقارير
- `http://localhost:3000/admin/reports`.
- مصدر البيانات: `GET /api/reports` يعيد ملخص الأعضاء، العضويات، الأنشطة، المدربين، الفعاليات، الحجوزات، المدفوعات (عدد ومجموع).

## إدارة المدفوعات
- `http://localhost:3000/admin/payments`.
- قراءة: `GET /api/payments` وتدعم المعاملات: `from,to,q,status,method,sort,order,page,limit`.
- الاستجابة: `{ items, summary, page, limit, total }`.
- يعرض عدد العمليات ومجموع المبالغ مع فلاتر تاريخ/بحث/حالة/طريقة وترقيم الصفحات.
- عناصر المدفوعات: `{ id, membership_id, amount, currency, method, status, ref, paid_at }`.

## تسلسل اختبار شامل خطوة‑بـ‑خطوة
1) إعداد قاعدة البيانات واستيراد `database.txt` عبر phpMyAdmin.
2) تعديل `.env` كما في المتطلبات ثم تشغيل الباك‑إند (`npm run server`) والفرونت (`set PORT=3000 && npm start`).
3) دخول الإدمن:
   - واجهة: `/admin/login` باستخدام `mahmoud_akl` / `01115727564tt`.
   - API: تأكيد `POST /api/auth/login` يرجع JWT.
4) اختبار الباقات:
   - `GET /api/membership-packages` و`?segment=adult` و`?segment=junior` و`?segment=sub`.
5) تدفق العضوية العامة مع الدفع:
   - عبر `/membership` → `/checkout` اضغط الدفع.
   - تحقق من إنشاء سجلات `members`, `memberships`, `payments` وظهور `joinDate/expiryDate` في الواجهة.
6) إدارة الأعضاء:
   - أضف عضو أساسي مع `dob` ثم أضف عضوية مناسبة.
   - أضف عضو فرعي مرتبط بعضو أساسي ثم أضف له عضوية فرعية.
   - جرّب تغيير حالة العضوية (تفعيل/تجميد/إنهاء).
   - اعرض مدفوعات العضويات.
7) إدارة العملاء:
   - أضف/عدّل/احذف عميل من `/admin/customers` وتحقق من التحديث.
8) الأنشطة والمدربين:
   - أنشئ نشاط ثم احفظ له جدولاً.
   - أنشئ مدرب وربطه بالنشاط.
   - سجّل عضو في النشاط، وتأكد من منع التسجيل المكرر والتحقق من السعة.
9) الفعاليات:
   - أنشئ فعالية وسجّل عضو فيها وتأكّد من قيود السعة.
10) الحجوزات:
    - أرسل نموذج حجز من `/booking` وتحقق ظهوره في `/admin/bookings`.
11) الاستبيان وخدمة العملاء:
    - أرسل نماذج من `/survey` و`/customer-service` وتحقق من استجابات API.
12) الإعدادات:
    - حرّر الإعدادات من `/admin/settings` ثم أكد القراءة من `GET /api/settings`.
13) التقارير:
    - افتح `/admin/reports` وتحقق من الأرقام المعروضة.
14) المدفوعات:
    - افتح `/admin/payments` واستخدم فلاتر التاريخ/البحث/الحالة/الطريقة، واختبر الترقيم (`page/limit`)، وتحقق من الملخص (`count/sum`) والقائمة والإجمالي (`total`).

## ملاحظات تقنية
- الترميز: يستخدم `utf8mb4` لدعم العربية في قاعدة MySQL.
- التطوير: تم ضبط `proxy` في `package.json` إلى `http://localhost:3001`.
- إن ظهرت أحرف `?` في سطر الأوامر فهذا من أداة العرض؛ الواجهة تعرض العربية بشكل صحيح.


## ملاحظات تقنية
- الترميز: يستخدم `utf8mb4` لدعم العربية في قاعدة MySQL
- التطوير: تم ضبط `proxy` في `package.json` إلى `http://localhost:3001`
- MONGODB_URI: غير مستخدم فعلياً؛ النظام يعمل على MySQL، تظهر رسالة Placeholder فقط للتوافق
- تأكد أن MySQL يعمل وأن بيانات `.env` صحيحة

## قائمة نقاط الـ API (اختصار)
- Auth: `POST /api/auth/login`
- Packages: `GET /api/membership-packages` (+ `segment`)
- Members: `GET/POST/PUT/DELETE /api/members`
  - Query (GET): `q,type,status,sort,order,page,limit`
- Member Memberships: `GET /api/members/:id/memberships`, `POST /api/members/:id/memberships`
- Membership Status: `PUT /api/memberships/:id/status`
- Membership Payments: `GET /api/memberships/:id/payments`
- Payments: `POST /api/payments/checkout`, `GET /api/payments?from&to&q&status&method&sort&order&page&limit`
- Customers: `GET/POST/PUT/DELETE /api/customers`
- Activities: `GET/POST/PUT/DELETE /api/activities`
  - Query (GET): `q,category,age_group,status,sort,order,page,limit`
- Activity Schedules: `POST /api/activities/:id/schedules`
- Activity Trainers: `POST /api/activities/:id/trainers/:trainerId`
- Activity Enroll: `POST /api/activities/:id/enroll`
- Events: `GET/POST/PUT/DELETE /api/events`, Register: `POST /api/events/:id/register`
  - Query (GET): `q,status,category,from,to,sort,order,page,limit`
- Bookings: `GET/POST /api/bookings`
  - Query (GET): `q,status,from,to,sort,order,page,limit`
- Surveys: `POST /api/surveys`
- Contact: `POST /api/contact`
- Settings: `GET/PUT /api/settings`
- Reports: `GET /api/reports`
  - Export CSV: `GET /api/reports/export?type=summary|memberships|members|payments|activities|trainers|events|bookings` (+ فلاتر النوع)
    - summary: صف واحد يحتوي المجاميع العامة
    - memberships: جميع العضويات مع الحقول الأساسية
    - payments: `from,to,q,status,method`
    - members: `q,member_type,status`
    - activities: `q,category,age_group,status`
    - trainers: `q,status`
    - events: `q,status,category,from,to`
    - bookings: `q,status,from,to`

## اختبار سريع عبر المتصفح
- `http://localhost:3000/admin/login` → دخول
- `http://localhost:3000/membership` → اختيار باقة حسب العمر
- `http://localhost:3000/checkout` → دفع وإنشاء عضوية
- `http://localhost:3000/admin/members` → إدارة عضويات وحالات ومدفوعات
- `http://localhost:3000/admin/activities` → جداول وربط مدربين
- `http://localhost:3000/admin/events` → إدارة الفعاليات
- `http://localhost:3000/admin/bookings` → عرض الحجوزات
- `http://localhost:3000/survey` و`/customer-service` → إرسال نماذج
- `http://localhost:3000/admin/settings` و`/admin/reports` و`/admin/payments`

## تقرير التنفيذ الشامل (خريطة واضحة)
- البنية العامة:
  - الباك‑إند: Express + MySQL (نمط المستودعات في `server/repositories/*`، مسارات في `server/routes/*`، وسيط JWT وادوار).
  - الفرونت: React بصفحات عامة ولوحة إدارة (`src/pages/*`, `src/dashboard/pages/*`).
- الأمن والمصادقة:
  - إدمن: `POST /api/auth/login` مع تحقق آمن بـ bcrypt؛ الاعتماد الاحتياطي معطل في الإنتاج.
  - عضو: `POST /api/member-auth/register` و`/login` مع bcrypt وJWT بدور `member`.
  - CORS: ضبط عبر `CORS_ORIGINS`؛ معالج أخطاء مركزي.
- العضويات والباقات:
  - CRUD للباقات مع `segment` (`adult|junior|sub`).
  - حساب `expiry_date` من تاريخ الدفع لكل إضافة عضوية (عام أو إداري).
  - قواعد العمل: الفرعي يرى باقات `sub` فقط؛ الأساسي يحدد `adult/junior` وفق `dob`.
- الصفحات الإدارية مع ترقيم وفلاتر:
  - الأعضاء، الأنشطة، المدربين، الفعاليات، الحجوزات، المدفوعات.
  - كل قائمة تدعم معلمات الاستعلام وواجهة فلاتر وترقيم.
- الأنشطة والمدربين:
  - جداول النشاط، ربط مدرب، تسجيل عضو مع منع التكرار والتحقق من السعة.
- الفعاليات:
  - تسجيل أعضاء مع التحقق من السعة.
- الحجوزات:
  - نموذج عام وإدارة قائمة الحجوزات بالفلاتر.
- المدفوعات:
  - قراءة مع فلاتر وترقيم وملخص إجمالي.
- التقارير:
  - ملخص عام `GET /api/reports`.
  - تصدير CSV عبر `GET /api/reports/export?type=summary|memberships|members|payments|activities|trainers|events|bookings`.

## دليل اختبار شامل خطوة‑بخطوة (جاهز للمراجعين)
1) الإعداد وتشغيل:
  - استورد قاعدة البيانات من `database.txt` عبر phpMyAdmin.
  - أنشئ ملف `.env` كما في قسم المتطلبات (تأكد من `PORT=3001`, و`REACT_APP_API_BASE_URL`).
  - شغّل الباك‑إند: `npm run server` وتحقق من `MySQL pool ready` و`Server listening on port 3001`.
  - شغّل الفرونت: `set PORT=3000 && npm start` وافتح `http://localhost:3000`.
2) دخول الإدمن:
  - واجهة: افتح `/admin/login` وأدخل: المستخدم `mahmoud_akl`، كلمة المرور `01115727564tt`.
  - API: نفّذ `POST /api/auth/login` وتأكد من الحصول على JWT.
3) الباقات والعضوية العامة (الموقع العام):
  - افتح `/membership`، حدّد تاريخ الميلاد لتصفية الباقات (`adult/junior`).
  - انتقل إلى `/checkout` واضغط دفع؛ يتم استدعاء `POST /api/payments/checkout` وإنشاء سجلات `members/memberships/payments`.
  - تأكد من ظهور `joinDate/expiryDate` في رسالة النجاح.
4) بروفايل العضو:
  - تسجيل: `POST /api/member-auth/register` ثم دخول: `POST /api/member-auth/login`.
  - افتح `/profile` للتحقق من البيانات؛ أنشئ عضوًا فرعيًا وأضف له عضوية (سترى فقط باقات `sub`).
  - أضف عضوية للعضو الأساسي؛ ستظهر الباقات وفق العمر تلقائيًا.
5) إدارة الأعضاء (لوحة الإدارة):
  - افتح `/admin/members`؛ أضف عضوًا أساسيًا ثم حرّر بياناته.
  - استخدم قسم العضويات لإضافة عضوية عبر Checkout الإداري (`POST /api/members/:id/memberships/checkout`).
  - جرّب تغيير حالة العضوية (تفعيل/تجميد/إنهاء) ومراجعة مدفوعاتها.
  - استخدم الفلاتر والبحث والترقيم (حقول أعلى الجدول) للتحقق من عمل معلمات الاستعلام.
6) الأنشطة والمدربين:
  - أنشئ نشاطًا من `/admin/activities`، ثم احفظ جدول النشاط (`POST /api/activities/:id/schedules`).
  - أنشئ مدربًا من `/admin/trainers` واربطه بالنشاط (`POST /api/activities/:id/trainers/:trainerId`).
  - سجّل عضوًا في النشاط (`POST /api/activities/:id/enroll`) وتأكد من منع التكرار والتحقق من السعة.
  - استخدم الفلاتر والترقيم في قوائم الأنشطة والمدربين.
7) الفعاليات:
  - أنشئ فعالية من `/admin/events`، ثم سجّل عضوًا فيها (`POST /api/events/:id/register`) وتأكد من قيود السعة.
  - اختبر فلاتر الفئة/الحالة/النطاق الزمني والترقيم في قائمة الفعاليات.
8) الحجوزات:
  - أرسل نموذجًا عامًّا من `/booking` (سيُحوّل إلى `POST /api/bookings`).
  - راجع `/admin/bookings` مع الفلاتر والترقيم (بحث/حالة/تاريخ) وتحقق من ظهور الحجز.
9) المدفوعات:
  - افتح `/admin/payments` واستخدم فلاتر التاريخ/البحث/الحالة/الطريقة مع الترقيم؛ تحقق من الملخص (`count/sum`) والإجمالي (`total`).
  - جرّب تصدير CSV للمدفوعات من صفحة التقارير أو عبر `GET /api/reports/export?type=payments&from=YYYY-MM-DD&to=YYYY-MM-DD`.
10) التقارير:
  - افتح `/admin/reports` لمشاهدة ملخص النظام.
  - صدّر CSV للملخص: `GET /api/reports/export?type=summary`.
  - صدّر عضويات مفصلة: `GET /api/reports/export?type=memberships`.
  - استخدم “تصدير سريع” في صفحة التقارير لاستخراج CSV للكيانات الرئيسية.
11) الإعدادات:
  - عدّل الإعدادات من `/admin/settings` ثم تحقق القراءة من `GET /api/settings`.
12) الاستبيان وخدمة العملاء:
  - أرسل نماذج من `/survey` و`/customer-service` وتحقق من استجابة `POST /api/surveys` و`POST /api/contact`.
13) إدارة العملاء:
  - من `/admin/customers` نفّذ CRUD وتحقق من الاستجابة.

## نصائح وإعدادات الإنتاج
- مفاتيح البيئة:
  - اضبط `JWT_SECRET` في الإنتاج، وضبط `CORS_ORIGINS` لنطاقاتك فقط.
  - تأكد أن كلمات مرور الإدمن مخزّنة ببصمة `bcrypt` في جدول `admins`.
- الأداء:
  - استخدم معلمات الترقيم والفلاتر في الصفحات الإدارية عند التعامل مع قواعد بيانات كبيرة.
- النشر:
  - استخدم `npm run build` للواجهة، وشغّل الباك‑إند خلف HTTPS (PM2/Docker)، وأعد استراتيجية نسخ احتياطي لـ MySQL.

## النشر على Render + GitHub (لينك نهائي)
1) ارفع المشروع على GitHub:
   - أنشئ Repository جديد.
   - ارفع محتوى مجلد المشروع `M_Y` فقط.
   - تأكد أن `.env` غير مرفوع (موجود في `.gitignore`).

2) اربط المشروع مع Render:
   - ادخل [Render](https://render.com/) ثم `New +` -> `Blueprint`.
   - اختر نفس Repository.
   - سيقرأ Render ملف `render.yaml` تلقائيًا.

3) أضف متغيرات البيئة في Render (Environment):
   - `JWT_SECRET`
   - `CORS_ORIGINS` (مثال: `https://<your-service>.onrender.com`)
   - `SUPABASE_CONNECTION_STRING` (أو `DATABASE_URL`)
   - أي متغيرات إضافية تحتاجها من `.env.example`.

4) بعد أول Deploy:
   - اللينك النهائي سيكون بالشكل:
     - `https://<your-service-name>.onrender.com`
   - الواجهة والـAPI سيعملان من نفس الرابط (الـAPI تحت `/api/*`).
#   N a d y _ m a k a  
 #   N a d y _ m a k a  
 