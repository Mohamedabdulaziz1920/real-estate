'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FaSearch,
  FaSpinner,
  FaInbox,
  FaArchive,
  FaStar,
  FaEllipsisV,
  FaCircle,
  FaCheckDouble,
} from 'react-icons/fa';
import ChatWindow from '@/components/messages/ChatWindow';
import { Conversation, Message } from '@/types/messages';

// Demo data for testing
const demoConversations: Conversation[] = [
  {
    _id: '1',
    participants: [
      {
        _id: 'user1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        isOnline: true,
      },
      {
        _id: 'user2',
        name: 'محمد علي',
        email: 'mohamed@example.com',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        isOnline: false,
        lastSeen: new Date(Date.now() - 3600000),
      },
    ],
    property: {
      _id: 'prop1',
      title: 'Luxury Villa',
      titleAr: 'فيلا فاخرة للبيع',
      price: 2500000,
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'],
      location: {
        city: 'الرياض',
        district: 'النرجس',
      },
      propertyType: 'villa',
      listingType: 'sale',
    },
    lastMessage: {
      _id: 'msg1',
      conversationId: '1',
      sender: {
        _id: 'user2',
        name: 'محمد علي',
        email: 'mohamed@example.com',
      },
      receiver: {
        _id: 'user1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
      },
      content: 'مرحباً، هل العقار لا يزال متاحاً؟',
      messageType: 'text',
      isRead: false,
      isDelivered: true,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date(Date.now() - 1800000),
    },
    unreadCount: 2,
    isArchived: false,
    isPinned: true,
    isMuted: false,
    isBlocked: false,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 1800000),
  },
  {
    _id: '2',
    participants: [
      {
        _id: 'user1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        isOnline: true,
      },
      {
        _id: 'user3',
        name: 'خالد العمري',
        email: 'khaled@example.com',
        isOnline: true,
      },
    ],
    property: {
      _id: 'prop2',
      title: 'Modern Apartment',
      titleAr: 'شقة حديثة للإيجار',
      price: 45000,
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'],
      location: {
        city: 'جدة',
        district: 'الروضة',
      },
      propertyType: 'apartment',
      listingType: 'rent',
    },
    lastMessage: {
      _id: 'msg2',
      conversationId: '2',
      sender: {
        _id: 'user1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
      },
      receiver: {
        _id: 'user3',
        name: 'خالد العمري',
        email: 'khaled@example.com',
      },
      content: 'شكراً لتواصلك، يمكننا ترتيب موعد للمعاينة',
      messageType: 'text',
      isRead: true,
      isDelivered: true,
      isDeleted: false,
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 7200000),
    },
    unreadCount: 0,
    isArchived: false,
    isPinned: false,
    isMuted: false,
    isBlocked: false,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 7200000),
  },
];

type TabType = 'all' | 'unread' | 'archived';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>(demoConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Use demo user for testing
  const currentUserId = session?.user?.id || 'user1';

  // Filter conversations based on tab and search
  const filteredConversations = conversations.filter((conv) => {
    // Tab filter
    if (activeTab === 'unread' && conv.unreadCount === 0) return false;
    if (activeTab === 'archived' && !conv.isArchived) return false;
    if (activeTab === 'all' && conv.isArchived) return false;

    // Search filter
    if (search) {
      const otherParticipant = conv.participants.find((p) => p._id !== currentUserId);
      const searchLower = search.toLowerCase();
      return (
        otherParticipant?.name.toLowerCase().includes(searchLower) ||
        conv.property?.titleAr.toLowerCase().includes(searchLower) ||
        conv.lastMessage?.content.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Sort: pinned first, then by date
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Format time
  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} د`;
    if (diffHours < 24) return `منذ ${diffHours} س`;
    if (diffDays < 7) return `منذ ${diffDays} ي`;
    return messageDate.toLocaleDateString('ar-SA');
  };

  // Get other participant
  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find((p) => p._id !== currentUserId);
  };

  // Handle conversation selection
  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    // Mark as read
    if (conv.unreadCount > 0) {
      setConversations(
        conversations.map((c) =>
          c._id === conv._id ? { ...c, unreadCount: 0 } : c
        )
      );
    }
  };

  // Calculate total unread
  const totalUnread = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  return (
    <main className="min-h-screen bg-gray-100" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex h-[calc(100vh-120px)]">
            {/* Conversations List */}
            <div
              className={`w-full lg:w-96 border-l flex flex-col ${
                selectedConversation ? 'hidden lg:flex' : 'flex'
              }`}
            >
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-800">الرسائل</h1>
                  {totalUnread > 0 && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      {totalUnread} جديدة
                    </span>
                  )}
                </div>

                {/* Search */}
                <div className="relative">
                  <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في المحادثات..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pr-12 pl-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b">
                {[
                  { id: 'all' as TabType, label: 'الكل', icon: FaInbox },
                  { id: 'unread' as TabType, label: 'غير مقروءة', icon: FaCircle },
                  { id: 'archived' as TabType, label: 'الأرشيف', icon: FaArchive },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className={`w-3 h-3 ${tab.id === 'unread' ? 'text-emerald-500' : ''}`} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
                  </div>
                ) : sortedConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <FaInbox className="w-12 h-12 mb-4 text-gray-300" />
                    <p>لا توجد محادثات</p>
                  </div>
                ) : (
                  sortedConversations.map((conv) => {
                    const otherParticipant = getOtherParticipant(conv);
                    const isSelected = selectedConversation?._id === conv._id;

                    return (
                      <button
                        key={conv._id}
                        onClick={() => handleSelectConversation(conv)}
                        className={`w-full p-4 flex gap-3 hover:bg-gray-50 transition-colors border-b ${
                          isSelected ? 'bg-emerald-50' : ''
                        } ${conv.isPinned ? 'bg-amber-50/50' : ''}`}
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                            {otherParticipant?.image ? (
                              <Image
                                src={otherParticipant.image}
                                alt={otherParticipant.name}
                                width={56}
                                height={56}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600 text-xl font-bold">
                                {otherParticipant?.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                          {otherParticipant?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-right">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {conv.isPinned && (
                                <FaStar className="w-3 h-3 text-amber-500" />
                              )}
                              <h3 className="font-semibold text-gray-800 truncate">
                                {otherParticipant?.name}
                              </h3>
                            </div>
                            <span className="text-xs text-gray-500">
                              {conv.lastMessage && formatTime(conv.lastMessage.createdAt)}
                            </span>
                          </div>

                          {conv.property && (
                            <p className="text-xs text-emerald-600 truncate mb-1">
                              {conv.property.titleAr}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate flex-1">
                              {conv.lastMessage?.sender._id === currentUserId && (
                                <FaCheckDouble className={`inline ml-1 w-3 h-3 ${
                                  conv.lastMessage?.isRead ? 'text-blue-500' : 'text-gray-400'
                                }`} />
                              )}
                              {conv.lastMessage?.content}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="ml-2 w-5 h-5 flex items-center justify-center bg-emerald-600 text-white text-xs rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div
              className={`flex-1 ${
                selectedConversation ? 'flex' : 'hidden lg:flex'
              } flex-col`}
            >
              {!selectedConversation ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <FaInbox className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    اختر محادثة
                  </h3>
                  <p className="text-gray-500">
                    حدد محادثة من القائمة لبدء المراسلة
                  </p>
                </div>
              ) : (
                <ChatWindow
                  conversation={selectedConversation}
                  currentUserId={currentUserId}
                  onBack={() => setSelectedConversation(null)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}