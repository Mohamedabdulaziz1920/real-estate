import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'لم يتم اختيار صورة' },
        { status: 400 }
      );
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'يجب اختيار صورة' },
        { status: 400 }
      );
    }

    // التحقق من حجم الملف (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'حجم الصورة يجب أن يكون أقل من 2MB' },
        { status: 400 }
      );
    }

    // تحويل الملف إلى base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // رفع إلى Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'real-estate/avatars',
      resource_type: 'image',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { format: 'webp' },
      ],
    });

    await dbConnect();

    // تحديث صورة المستخدم
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { image: result.secure_url },
      { new: true }
    ).select('image');

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الصورة بنجاح',
      image: result.secure_url,
    });
  } catch (error: any) {
    console.error('Upload avatar error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في رفع الصورة' },
      { status: 500 }
    );
  }
}

// حذف الصورة
export async function DELETE() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    await dbConnect();

    await User.findByIdAndUpdate(session.user.id, {
      image: '/images/default-avatar.png',
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الصورة',
    });
  } catch (error: any) {
    console.error('Delete avatar error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}