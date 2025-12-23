import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: "معرف العقار مطلوب" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // 1. التأكد من تهيئة المصفوفة
    if (!user.favorites) {
      user.favorites = [];
    }

    // 2. استخدام علامة التعجب (!) لإجبار TypeScript على قبول القيمة
    // لأننا تأكدنا من وجودها في الخطوة 1
    const favoriteIndex = user.favorites!.indexOf(propertyId);
    
    let action: 'added' | 'removed';

    if (favoriteIndex > -1) {
      // العقار موجود، قم بإزالته (مع علامة !)
      user.favorites!.splice(favoriteIndex, 1);
      action = 'removed';
    } else {
      // العقار غير موجود، قم بإضافته (مع علامة !)
      user.favorites!.push(propertyId);
      action = 'added';
    }

    await user.save();

    return NextResponse.json({
      success: true,
      action,
      message: action === 'added' ? 'تمت الإضافة للمفضلة' : 'تم الحذف من المفضلة'
    });

  } catch (error) {
    console.error("Toggle favorite error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ favorites: [] });
    }

    await dbConnect();
    
    const user = await User.findById(session.user.id).populate('favorites');

    if (!user) {
      return NextResponse.json({ favorites: [] });
    }

    // استخدام قيمة افتراضية لتجنب الخطأ في GET أيضاً
    const favorites = user.favorites || [];

    return NextResponse.json({ 
      success: true, 
      data: favorites 
    });

  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}