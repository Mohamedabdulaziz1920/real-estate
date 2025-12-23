import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';

// GET - جلب محادثة واحدة مع الرسائل
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    await dbConnect();

    const conversation = await Conversation.findOne({
      _id: id,
      participants: session.user.id,
    })
      .populate('participants', 'name email image phone')
      .populate('property', 'titleAr images price location listingType')
      .populate('messages.sender', 'name image');

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: 'المحادثة غير موجودة' },
        { status: 404 }
      );
    }

    // تحديث الرسائل كمقروءة
    let updated = false;
    conversation.messages.forEach((msg: any) => {
      if (msg.sender._id.toString() !== session.user.id && !msg.read) {
        msg.read = true;
        updated = true;
      }
    });

    if (updated) {
      conversation.unreadCount.set(session.user.id, 0);
      await conversation.save();
    }

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (error: any) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}

// POST - إرسال رسالة جديدة
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: 'الرسالة مطلوبة' },
        { status: 400 }
      );
    }

    await dbConnect();

    const conversation = await Conversation.findOne({
      _id: id,
      participants: session.user.id,
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: 'المحادثة غير موجودة' },
        { status: 404 }
      );
    }

    // إضافة الرسالة
    const newMessage = {
      sender: session.user.id,
      content: content.trim(),
      read: false,
      createdAt: new Date(),
    };

    conversation.messages.push(newMessage);

    conversation.lastMessage = {
      content: content.trim(),
      sender: session.user.id,
      createdAt: new Date(),
    };

    // تحديث عدد الرسائل غير المقروءة للطرف الآخر
    const otherParticipant = conversation.participants.find(
      (p: any) => p.toString() !== session.user.id
    );

    if (otherParticipant) {
      const currentUnread = conversation.unreadCount?.get(otherParticipant.toString()) || 0;
      conversation.unreadCount.set(otherParticipant.toString(), currentUnread + 1);
    }

    await conversation.save();

    // جلب الرسالة مع بيانات المرسل
    const populatedConversation = await Conversation.findById(id)
      .populate('messages.sender', 'name image');

    const sentMessage = populatedConversation?.messages[populatedConversation.messages.length - 1];

    return NextResponse.json({
      success: true,
      data: sentMessage,
      message: 'تم إرسال الرسالة',
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}

// DELETE - حذف المحادثة
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    await dbConnect();

    const conversation = await Conversation.findOneAndDelete({
      _id: id,
      participants: session.user.id,
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: 'المحادثة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف المحادثة',
    });
  } catch (error: any) {
    console.error('Delete conversation error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}