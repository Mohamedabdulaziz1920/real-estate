import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';

// ⭐ أضف هذا السطر ⭐
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({
        success: true,
        count: 0,
      });
    }

    await dbConnect();

    const conversations = await Conversation.find({
      participants: session.user.id,
    });

    let totalUnread = 0;
    conversations.forEach((conv) => {
      const unread = conv.unreadCount?.get(session.user.id) || 0;
      totalUnread += unread;
    });

    return NextResponse.json({
      success: true,
      count: totalUnread,
    });
  } catch (error: any) {
    console.error('Get unread count error:', error);
    return NextResponse.json({
      success: true,
      count: 0,
    });
  }
}
