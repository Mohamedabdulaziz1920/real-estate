'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaArrowRight,
  FaPaperPlane,
  FaImage,
  FaPaperclip,
  FaSmile,
  FaEllipsisV,
  FaPhone,
  FaVideo,
  FaCheck,
  FaCheckDouble,
  FaSpinner,
  FaTimes,
  FaHandHoldingUsd,
} from 'react-icons/fa';
import { Conversation, Message, MessageUser, MessageProperty } from '@/types/messages';

interface ChatWindowProps {
  conversation: Conversation;
  currentUserId: string;
  onBack?: () => void;
}

export default function ChatWindow({
  conversation,
  currentUserId,
  onBack,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get the other participant
  const otherParticipant = conversation.participants.find(
    (p) => p._id !== currentUserId
  ) as MessageUser;

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${conversation._id}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversation._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation._id,
          receiverId: otherParticipant._id,
          content: newMessage.trim(),
          messageType: 'text',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  // Send offer
  const handleSendOffer = async () => {
    if (!offerAmount || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation._id,
          receiverId: otherParticipant._id,
          content: `عرض سعر: ${parseInt(offerAmount).toLocaleString('ar-SA')} ريال`,
          messageType: 'offer',
          offer: {
            amount: parseInt(offerAmount),
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.data]);
        setOfferAmount('');
        setShowOfferModal(false);
      }
    } catch (error) {
      console.error('Error sending offer:', error);
    } finally {
      setSending(false);
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date for message groups
  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'اليوم';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'أمس';
    }
    
    return messageDate.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';

    messages.forEach((message) => {
      const messageDate = formatDate(message.createdAt);
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: messageDate, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <FaArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              {otherParticipant?.image ? (
                <Image
                  src={otherParticipant.image}
                  alt={otherParticipant.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600 text-lg font-bold">
                  {otherParticipant?.name?.charAt(0)}
                </div>
              )}
            </div>
            {otherParticipant?.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {otherParticipant?.name}
            </h3>
            <p className="text-sm text-gray-500">
              {otherParticipant?.isOnline ? 'متصل الآن' : 'غير متصل'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaPhone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaVideo className="w-5 h-5 text-gray-600" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaEllipsisV className="w-5 h-5 text-gray-600" />
            </button>
            {showOptions && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-10">
                <button className="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors">
                  حظر المستخدم
                </button>
                <button className="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors">
                  الإبلاغ
                </button>
                <button className="w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors text-red-600">
                  حذف المحادثة
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Info (if exists) */}
      {conversation.property && (
        <Link
          href={`/properties/${conversation.property._id}`}
          className="flex items-center gap-4 p-3 bg-gray-50 border-b hover:bg-gray-100 transition-colors"
        >
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
            {conversation.property.images?.[0] && (
              <Image
                src={conversation.property.images[0]}
                alt={conversation.property.titleAr}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-800 truncate">
              {conversation.property.titleAr}
            </h4>
            <p className="text-sm text-gray-500">
              {conversation.property.location.district}، {conversation.property.location.city}
            </p>
            <p className="text-sm font-bold text-emerald-600">
              {conversation.property.price.toLocaleString('ar-SA')} ريال
            </p>
          </div>
        </Link>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg mb-2">لا توجد رسائل بعد</p>
            <p className="text-sm">ابدأ المحادثة الآن!</p>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date Separator */}
              <div className="flex items-center justify-center mb-4">
                <span className="px-4 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">
                  {group.date}
                </span>
              </div>

              {/* Messages */}
              <div className="space-y-3">
                {group.messages.map((message) => {
                  const isMine = message.sender._id === currentUserId;
                  
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isMine ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          isMine
                            ? 'bg-emerald-600 text-white rounded-2xl rounded-br-sm'
                            : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm'
                        }`}
                      >
                        {/* Offer Message */}
                        {message.messageType === 'offer' && message.offer && (
                          <div className={`p-3 border-b ${isMine ? 'border-emerald-500' : 'border-gray-100'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <FaHandHoldingUsd className={isMine ? 'text-emerald-200' : 'text-emerald-600'} />
                              <span className="font-medium">عرض سعر</span>
                            </div>
                            <p className="text-2xl font-bold">
                              {message.offer.amount.toLocaleString('ar-SA')} ريال
                            </p>
                            {message.offer.status === 'pending' && !isMine && (
                              <div className="flex gap-2 mt-3">
                                <button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">
                                  قبول
                                </button>
                                <button className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                                  رفض
                                </button>
                              </div>
                            )}
                            {message.offer.status !== 'pending' && (
                              <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                                message.offer.status === 'accepted' 
                                  ? 'bg-green-100 text-green-700'
                                  : message.offer.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {message.offer.status === 'accepted' && 'مقبول'}
                                {message.offer.status === 'rejected' && 'مرفوض'}
                                {message.offer.status === 'countered' && 'عرض مضاد'}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Text Content */}
                        <div className="px-4 py-2">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="px-4 pb-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="mt-2">
                                {attachment.type.startsWith('image/') ? (
                                  <Image
                                    src={attachment.url}
                                    alt={attachment.name}
                                    width={200}
                                    height={150}
                                    className="rounded-lg"
                                  />
                                ) : (
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg"
                                  >
                                    <FaPaperclip />
                                    <span className="text-sm">{attachment.name}</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Time & Status */}
                        <div className={`px-4 pb-2 flex items-center justify-end gap-1 ${
                          isMine ? 'text-emerald-200' : 'text-gray-400'
                        } text-xs`}>
                          <span>{formatTime(message.createdAt)}</span>
                          {isMine && (
                            message.isRead ? (
                              <FaCheckDouble className="text-blue-300" />
                            ) : message.isDelivered ? (
                              <FaCheckDouble />
                            ) : (
                              <FaCheck />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-end">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaPaperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaImage className="w-5 h-5" />
          </button>

          {conversation.property && (
            <button
              type="button"
              onClick={() => setShowOfferModal(true)}
              className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              title="إرسال عرض سعر"
            >
              <FaHandHoldingUsd className="w-5 h-5" />
            </button>
          )}

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaSmile className="w-5 h-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <FaSpinner className="w-5 h-5 animate-spin" />
            ) : (
              <FaPaperPlane className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">إرسال عرض سعر</h3>
              <button
                onClick={() => setShowOfferModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FaTimes />
              </button>
            </div>

            {conversation.property && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  {conversation.property.images?.[0] && (
                    <Image
                      src={conversation.property.images[0]}
                      alt={conversation.property.titleAr}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    {conversation.property.titleAr}
                  </h4>
                  <p className="text-sm text-emerald-600 font-bold">
                    السعر المطلوب: {conversation.property.price.toLocaleString('ar-SA')} ريال
                  </p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عرضك (ريال)
              </label>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="أدخل المبلغ"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSendOffer}
                disabled={!offerAmount || sending}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {sending ? 'جاري الإرسال...' : 'إرسال العرض'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}