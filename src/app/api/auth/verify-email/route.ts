import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'رمز التحقق مطلوب' },
        { status: 400 }
      );
    }

    // البحث عن المستخدم باستخدام الرمز
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'رمز التحقق غير صالح' },
        { status: 400 }
      );
    }

    // تحديث حالة المستخدم
    user.emailVerified = new Date();
    user.verificationToken = undefined; // لن يظهر خطأ هنا إذا تم تحديث User.ts
    user.isActive = true; // تفعيل الحساب

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'تم تأكيد البريد الإلكتروني بنجاح',
    });
  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ، يرجى المحاولة لاحقاً' },
      { status: 500 }
    );
  }
}