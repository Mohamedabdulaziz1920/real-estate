import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Property from '@/models/Property';

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const { password, confirmation } = await request.json();

    if (confirmation !== 'DELETE') {
      return NextResponse.json(
        { success: false, message: 'يرجى كتابة DELETE للتأكيد' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من كلمة المرور للحسابات غير Google
    if (user.password) {
      if (!password) {
        return NextResponse.json(
          { success: false, message: 'كلمة المرور مطلوبة' },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'كلمة المرور غير صحيحة' },
          { status: 400 }
        );
      }
    }

    // حذف عقارات المستخدم
    await Property.deleteMany({ owner: session.user.id });

    // حذف المستخدم
    await User.findByIdAndDelete(session.user.id);

    return NextResponse.json({
      success: true,
      message: 'تم حذف الحساب بنجاح',
    });
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}