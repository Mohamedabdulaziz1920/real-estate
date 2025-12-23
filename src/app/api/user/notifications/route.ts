import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET - جلب إعدادات الإشعارات
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select('notificationSettings');

    const settings = user?.notificationSettings || {
      emailNotifications: true,
      pushNotifications: true,
      newMessages: true,
      propertyUpdates: true,
      priceAlerts: true,
      newsletter: false,
    };

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error('Get notification settings error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}

// PUT - تحديث إعدادات الإشعارات
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const settings = await request.json();

    await dbConnect();

    await User.findByIdAndUpdate(session.user.id, {
      notificationSettings: settings,
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث إعدادات الإشعارات',
    });
  } catch (error: any) {
    console.error('Update notification settings error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}