import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

// GET - جلب جميع العقارات للإدارة
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 403 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const propertyType = searchParams.get('propertyType') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { titleAr: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.district': { $regex: search, $options: 'i' } },
      ];
    }

    if (status) filter.status = status;
    if (propertyType) filter.propertyType = propertyType;

    const skip = (page - 1) * limit;

    const properties = await Property.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('owner', 'name email phone');

    const total = await Property.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin properties error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}

// PUT - تحديث حالة العقار
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 403 }
      );
    }

    const { propertyId, updates } = await request.json();

    await dbConnect();

    const property = await Property.findByIdAndUpdate(
      propertyId,
      updates,
      { new: true }
    );

    if (!property) {
      return NextResponse.json(
        { success: false, message: 'العقار غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم التحديث بنجاح',
      data: property,
    });
  } catch (error: any) {
    console.error('Admin update property error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}

// DELETE - حذف عقارات
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 403 }
      );
    }

    const { propertyIds } = await request.json();

    await dbConnect();

    await Property.deleteMany({ _id: { $in: propertyIds } });

    return NextResponse.json({
      success: true,
      message: `تم حذف ${propertyIds.length} عقار`,
    });
  } catch (error: any) {
    console.error('Admin delete properties error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}