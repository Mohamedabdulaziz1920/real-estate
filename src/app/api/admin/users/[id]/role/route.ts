import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(
  request: NextRequest,
  // التعديل هنا: تحديد النوع كـ Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // التحقق من أن المستخدم مدير
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "غير مصرح لك بهذا الإجراء" },
        { status: 403 }
      );
    }

    // التعديل هنا: يجب انتظار الـ params للحصول على id
    const { id } = await params;
    const { role } = await request.json();

    // التحقق من الدور
    if (!["user", "agent", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "دور غير صالح" },
        { status: 400 }
      );
    }

    await dbConnect();

    // منع المدير من تغيير دوره الخاص
    if (id === session.user.id && role !== "admin") {
      return NextResponse.json(
        { error: "لا يمكنك تغيير دورك الخاص" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم تغيير الدور بنجاح",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Change role error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}