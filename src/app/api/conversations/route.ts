import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';
import Property from '@/models/Property';

// GET - جلب جميع المحادثات
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

    const conversations = await Conversation.find({
      participants: session.user.id,
    })
      .populate('participants', 'name email image')
      .populate('property', 'titleAr images price location')
      .populate('lastMessage.sender', 'name')
      .sort({ 'lastMessage.createdAt': -1, updatedAt: -1 });

    // حساب عدد الرسائل غير المقروءة لكل محادثة
    const conversationsWithUnread = conversations.map((conv) => {
      const unread = conv.unreadCount?.get(session.user.id) || 0;
      return {
        ...conv.toObject(),
        unreadCount: unread,
      };
    });

    return NextResponse.json({
      success: true,
      data: conversationsWithUnread,
    });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}

// POST - إنشاء محادثة جديدة أو الحصول على موجودة
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const { recipientId, propertyId, message } = await request.json();

    if (!recipientId) {
      return NextResponse.json(
        { success: false, message: 'معرف المستلم مطلوب' },
        { status: 400 }
      );
    }

    if (recipientId === session.user.id) {
      return NextResponse.json(
        { success: false, message: 'لا يمكنك مراسلة نفسك' },
        { status: 400 }
      );
    }

    await dbConnect();

    // التحقق من وجود المستلم
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // البحث عن محادثة موجودة
    let conversation = await Conversation.findOne({
      participants: { $all: [session.user.id, recipientId] },
      ...(propertyId ? { property: propertyId } : {}),
    });

    if (!conversation) {
      // إنشاء محادثة جديدة
      conversation = new Conversation({
        participants: [session.user.id, recipientId],
        property: propertyId || null,
        messages: [],
        unreadCount: new Map(),
      });
    }

    // إضافة الرسالة إذا وجدت
    if (message && message.trim()) {
      conversation.messages.push({
        sender: session.user.id,
        content: message.trim(),
        read: false,
      });

      conversation.lastMessage = {
        content: message.trim(),
        sender: session.user.id,
        createdAt: new Date(),
      };

      // تحديث عدد الرسائل غير المقروءة
      const currentUnread = conversation.unreadCount?.get(recipientId) || 0;
      conversation.unreadCount.set(recipientId, currentUnread + 1);
    }

    await conversation.save();

    // جلب المحادثة مع البيانات المرتبطة
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name email image')
      .populate('property', 'titleAr images price location');

    return NextResponse.json({
      success: true,
      data: populatedConversation,
      message: message ? 'تم إرسال الرسالة' : 'تم إنشاء المحادثة',
    });
  } catch (error: any) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}