import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth'; // استخدم auth بدلاً من getServerSession
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import User from '@/models/User';

// GET - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const property = await Property.findById(id)
      .populate('owner', 'name email phone image');

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Increment views
    property.views += 1;
    await property.save();

    return NextResponse.json({ success: true, data: property });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // استخدم auth() بدلاً من getServerSession
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { id } = await params;

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, message: 'العقار غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من ملكية العقار
    if (property.owner.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بتعديل هذا العقار' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ 
      success: true, 
      data: updatedProperty,
      message: 'تم تحديث العقار بنجاح'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // استخدم auth() بدلاً من getServerSession
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, message: 'العقار غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من ملكية العقار
    if (property.owner.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بحذف هذا العقار' },
        { status: 403 }
      );
    }

    await Property.findByIdAndDelete(id);

    // إزالة العقار من قائمة عقارات المستخدم
    await User.findByIdAndUpdate(session.user.id, {
      $pull: { properties: id },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف العقار بنجاح',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}