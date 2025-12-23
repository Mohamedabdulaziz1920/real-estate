import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// قالب البريد الأساسي
const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>عقاري</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🏠 عقاري</h1>
        <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 14px;">منصة العقارات الأولى</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 40px 30px;">
        ${content}
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; margin: 0; font-size: 12px;">
          © 2024 عقاري. جميع الحقوق محفوظة
        </p>
        <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 11px;">
          هذه الرسالة مرسلة تلقائياً، يرجى عدم الرد عليها
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// بريد التحقق
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

  const content = `
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">مرحباً ${name}! 👋</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      شكراً لتسجيلك في منصة عقاري. يرجى تأكيد بريدك الإلكتروني للبدء في استخدام حسابك.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 10px; font-weight: bold; font-size: 16px;">
        تأكيد البريد الإلكتروني
      </a>
    </div>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
      إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      أو انسخ هذا الرابط: <br>
      <a href="${verificationUrl}" style="color: #059669; word-break: break-all;">${verificationUrl}</a>
    </p>
  `;

  await transporter.sendMail({
    from: `"عقاري" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: '🔐 تأكيد البريد الإلكتروني - عقاري',
    html: emailTemplate(content),
  });
}

// بريد استعادة كلمة المرور
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  const content = `
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">مرحباً ${name}! 👋</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك. اضغط على الزر أدناه لإنشاء كلمة مرور جديدة.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 10px; font-weight: bold; font-size: 16px;">
        إعادة تعيين كلمة المرور
      </a>
    </div>
    <div style="background-color: #fef3c7; border-radius: 10px; padding: 15px; margin: 20px 0;">
      <p style="color: #92400e; font-size: 14px; margin: 0;">
        ⚠️ هذا الرابط صالح لمدة ساعة واحدة فقط
      </p>
    </div>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
      إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      أو انسخ هذا الرابط: <br>
      <a href="${resetUrl}" style="color: #059669; word-break: break-all;">${resetUrl}</a>
    </p>
  `;

  await transporter.sendMail({
    from: `"عقاري" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: '🔑 إعادة تعيين كلمة المرور - عقاري',
    html: emailTemplate(content),
  });
}

// بريد ترحيبي
export async function sendWelcomeEmail(email: string, name: string) {
  const content = `
    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">أهلاً بك في عقاري! 🎉</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      مرحباً ${name}، نحن سعداء بانضمامك إلى منصة عقاري - المنصة العقارية الأولى في المملكة.
    </p>
    <div style="background-color: #f0fdf4; border-radius: 10px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">ماذا يمكنك فعله الآن؟</h3>
      <ul style="color: #4b5563; font-size: 14px; line-height: 2; margin: 0; padding-right: 20px;">
        <li>تصفح آلاف العقارات المتاحة</li>
        <li>احفظ عقاراتك المفضلة</li>
        <li>تواصل مباشرة مع الملاك</li>
        <li>أضف عقاراتك للبيع أو الإيجار</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXTAUTH_URL}/properties" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 10px; font-weight: bold; font-size: 16px;">
        استكشف العقارات
      </a>
    </div>
  `;

  await transporter.sendMail({
    from: `"عقاري" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: '🏠 أهلاً بك في عقاري!',
    html: emailTemplate(content),
  });
}