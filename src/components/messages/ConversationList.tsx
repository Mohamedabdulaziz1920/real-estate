'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from '@/lib/utils';
import {
  FaSearch,
  FaEllipsisV,
  FaTrash,
  FaCheck,
  FaCheckDouble,
} from 'react-icons/fa';
// استيراد الأنواع من الملف المشترك - استخدم MessageUser بدلاً من User
import type { Conversation, MessageUser } from '@/types/messages';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  currentUserId: string;
  onSelect: (conversation: Conversation) => void;
  onDelete: (id: string) => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  currentUserId,
  onSelect,
  onDelete,
}: ConversationListProps) {
  const [search, setSearch] = useState('');
  const [menuId, setMenuId] = useState<string | null>(null);

  const getOtherParticipant = (participants: MessageUser[]) => {
    return participants.find((p) => p._id !== currentUserId) || participants[0];
  };

  const filteredConversations = conversations.filter((conv) => {
    const other = getOtherParticipant(conv.participants);
    return (
      other.name.toLowerCase().includes(search.toLowerCase()) ||
      conv.property?.titleAr.toLowerCase().includes(search.toLowerCase())
    );
  });

  const formatTime = (date: string | Date) => {
    // تحويل التاريخ إلى Date object إذا كان string
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في المحادثات..."
            className="w-full pr-12 pl-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>لا توجد محادثات</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const other = getOtherParticipant(conversation.participants);
            const isSelected = selectedId === conversation._id;
            const hasUnread = conversation.unreadCount > 0;
            const isMyMessage = conversation.lastMessage?.sender._id === currentUserId;

            return (
              <div
                key={conversation._id}
                className={`relative border-b border-gray-100 transition-colors group ${
                  isSelected ? 'bg-emerald-50' : 'hover:bg-gray-50'
                }`}
              >
                <button
                  onClick={() => onSelect(conversation)}
                  className="w-full p-4 flex items-start gap-3 text-right"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={other.image || '/images/default-avatar.png'}
                        alt={other.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    {hasUnread && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {other.name}
                      </h4>
                      <span className="text-xs text-gray-500 flex-shrink-0 mr-2">
                        {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>

                    {conversation.property && (
                      <p className="text-xs text-emerald-600 truncate mb-1">
                        {conversation.property.titleAr}
                      </p>
                    )}

                    {conversation.lastMessage && (
                      <div className="flex items-center gap-1">
                        {isMyMessage && (
                          <FaCheckDouble className={`w-3 h-3 flex-shrink-0 ${
                            hasUnread ? 'text-gray-400' : 'text-emerald-500'
                          }`} />
                        )}
                        <p className={`text-sm truncate ${
                          hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'
                        }`}>
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    )}
                  </div>
                </button>

                {/* Menu Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuId(menuId === conversation._id ? null : conversation._id);
                  }}
                  className="absolute top-4 left-4 p-2 hover:bg-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaEllipsisV className="w-4 h-4 text-gray-400" />
                </button>

                {/* Menu */}
                {menuId === conversation._id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuId(null)}
                    />
                    <div className="absolute top-12 left-4 bg-white rounded-xl shadow-lg border py-2 z-20 min-w-[120px]">
                      <button
                        onClick={() => {
                          onDelete(conversation._id);
                          setMenuId(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                      >
                        <FaTrash className="w-4 h-4" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}