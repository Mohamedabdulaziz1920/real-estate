// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// ✅ أضف هذه الإعدادات الجديدة في الأعلى
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // ✅ تغيير من 'file' إلى 'files' للتوافق مع ImageUploader
    const files = formData.getAll('files') as File[];

    // إذا لم توجد ملفات متعددة، جرب الملف المفرد (للتوافق مع الاستخدامات الأخرى)
    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File;
      if (singleFile) {
        // معالجة ملف واحد (للتوافق مع الكود القديم)
        const bytes = await singleFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataURI = `data:${singleFile.type};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'real-estate',
        });

        return NextResponse.json({
          success: true,
          url: result.secure_url,
          publicId: result.public_id,
          // ✅ أضف images للتوافق مع ImageUploader
          images: [result.secure_url],
          message: 'تم رفع الصورة بنجاح',
        });
      }

      return NextResponse.json(
        { success: false, message: 'لم يتم اختيار أي صور' },
        { status: 400 }
      );
    }

    const uploadedImages: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        // التحقق من نوع الملف
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name}: نوع الملف غير مدعوم`);
          continue;
        }

        // التحقق من حجم الملف (5MB)
        if (file.size > 5 * 1024 * 1024) {
          errors.push(`${file.name}: حجم الصورة يجب أن يكون أقل من 5MB`);
          continue;
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'real-estate',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' }, // تحديد الحجم الأقصى
            { quality: 'auto' }, // ضغط تلقائي
            { fetch_format: 'auto' }, // تحويل تلقائي للصيغة
          ],
        });

        uploadedImages.push(result.secure_url);
      } catch (uploadError: unknown) {
        console.error(`Error uploading ${file.name}:`, uploadError);
        errors.push(`${file.name}: فشل في الرفع`);
      }
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: errors.length > 0 ? errors.join(', ') : 'فشل في رفع جميع الصور' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `تم رفع ${uploadedImages.length} صورة بنجاح${errors.length > 0 ? ` (${errors.length} فشلت)` : ''}`,
      images: uploadedImages,
    });

  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'حدث خطأ في رفع الصور';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// ❌ احذف هذا الكود القديم تماماً:
// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '50mb',
//     },
//   },
// };