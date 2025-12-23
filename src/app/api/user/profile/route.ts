import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET - جلب بيانات المستخدم
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

    const user = await User.findById(session.user.id)
      .select('-password -resetPasswordToken -resetPasswordExpires -verificationToken')
      .populate('favorites', 'titleAr images price location')
      .populate('properties', 'titleAr images price status views');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // إحصائيات المستخدم
    const stats = {
      propertiesCount: user.properties?.length || 0,
      favoritesCount: user.favorites?.length || 0,
      totalViews: user.properties?.reduce((acc: number, p: any) => acc + (p.views || 0), 0) || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        user,
        stats,
      },
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}

// PUT - تحديث بيانات المستخدم
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const { name, phone, bio } = await request.json();

    // التحقق من البيانات
    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, message: 'الاسم يجب أن يكون حرفين على الأقل' },
        { status: 400 }
      );
    }

    if (phone && !/^05\d{8}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'رقم الجوال غير صالح' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { 
        name, 
        phone: phone || undefined,
        bio: bio || undefined,
      },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      data: user,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ' },
      { status: 500 }
    );
  }
}