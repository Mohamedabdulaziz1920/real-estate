import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // تأكد من مسار الاستيراد الصحيح
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { isFavorite: false, favorites: [] },
        { status: 200 } // نعيد 200 مع false للمستخدم غير المسجل
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

    // === التعديل هنا ===
    // استخدام (?.) لتجنب الخطأ إذا كان favorites غير موجود، واستخدام (|| []) كقيمة افتراضية
    const favoritesList = user.favorites || []; 
    const favorites = favoritesList.map((id: any) => id.toString());
    // =================

    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get("propertyId");

    if (propertyId) {
      const isFavorite = favorites.includes(propertyId);
      return NextResponse.json({ isFavorite });
    }

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Check favorites error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}