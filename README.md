# ��� عقاري - Real Estate Platform

منصة عقارات متكاملة بنيت باستخدام Next.js 15، TypeScript، NextAuth، وMongoDB.

## ✨ المميزات
- ��� نظام مصادقة متكامل (Credentials + Google)
- ��� لوحة تحكم إدارة متكاملة
- ���️ خرائط تفاعلية مع React Leaflet
- ��� تصميم متجاوب لجميع الأجهزة
- ��� إحصائيات وتقارير متقدمة

## ��� التقنيات
- Next.js 15 + TypeScript
- NextAuth.js للمصادقة
- MongoDB + Mongoose
- Tailwind CSS للتصميم
- Cloudinary للصور

## ⚡ التشغيل السريع
```bash
npm install
npm run dev



### **2. إضافة .env.example**
```bash
# أنشئ ملف .env.example للمتغيرات البيئية
cat > .env.example << 'EOF'
# MongoDB
MONGODB_URI=mongodb://localhost:27017/real-estate

# NextAuth Authentication
AUTH_SECRET=your-secret-key-here
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
