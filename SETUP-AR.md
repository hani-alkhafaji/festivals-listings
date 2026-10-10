# موقع الفيستيفالات الأوروبية — دليل كامل (مشروع منفصل)

المجلد على جهازك:

`C:\Users\forked\europe-festival-listings`

**لا Firebase** — فقط GitHub + Vercel + Google Sheets.

---

## 1) فتح المشروع في VS Code

1. **File → Open Folder**
2. اختر: `C:\Users\forked\europe-festival-listings`
3. Terminal → `npm install` ثم `npm run dev`
4. افتح http://localhost:3000

---

## 2) تعديل العنوان وإنستغرام

ملف: `data/site.json` → حقل `headline`

---

## 3) نشر فيستيفال يدوياً (بدون طلبات)

**طريقة أ:** عدّل `data/festivals.json` + صور في `public/festivals/`

**طريقة ب (بعد ربط Google Sheet):** تبويب **Published Festivals** (انظر §6)

---

## 4) GitHub (مستودع جديد منفصل)

```powershell
cd C:\Users\forked\europe-festival-listings
git init
git add .
git commit -m "Initial festival listings site"
git branch -M main
git remote add origin https://github.com/YOUR_USER/europe-festival-listings.git
git push -u origin main
```

---

## 5) Vercel

1. vercel.com → Import → المستودع **europe-festival-listings**
2. Root Directory: `./`
3. Deploy
4. رابط مجاني: `https://europe-festival-listings.vercel.app`

### دومين مجاني من Vercel (بدون شراء)

- **Settings → Domains** → يمكنك تغيير اسم المشروع ليصبح الرابط أوضح
- أو استخدم **`.vercel.app`** فقط (مجاني)
- شراء دومين `.com` **اختياري** وليس مطلوباً

---

## 6) Google Sheets

### إنشاء الشيت

1. Google Sheet جديد
2. تبويب **Festival Requests** (الصف 1 = العناوين كما في `google-apps-script/Code.gs`)
3. تبويب **Published Festivals** (عناوين الأعمدة في نفس الملف)

### Apps Script

1. Extensions → Apps Script → الصق `google-apps-script/Code.gs`
2. Deploy → Web app → **Anyone**
3. انسخ الرابط

### Vercel

Settings → Environment Variables:

- `GAS_WEB_APP_URL` = رابط Web App

**Redeploy** بعد إضافة المتغير.

### طلبات الزوار

قائمة **Submit your festival** → تُحفظ في **Festival Requests** (€49 يدوياً بالبريد).

### نشر حدث على الموقع

بعد الدفع، أضف صفاً في **Published Festivals**. الموقع يقرأها تلقائياً.

---

## 7) Cursor → VS Code → GitHub

1. المشروع جاهز في `europe-festival-listings`
2. افتحه في VS Code
3. عدّل و `git push`
4. Vercel يحدّث الموقع

---

## 8) قائمة البرجر

- **All festivals**
- **Submit your festival** → Google Sheet
- **Publisher notes** → تعليمات لك
