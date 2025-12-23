'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaBan,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaEnvelope,
  FaEnvelopeOpen,
  FaArchive,
  FaSpinner,
  FaDownload,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Types
interface MessageData {
  _id: string;
  conversationId: string;
  participants: {
    sender: {
      _id: string;
      name: string;
      email: string;
      image?: string;
    };
    receiver: {
      _id: string;
      name: string;
      email: string;
      image?: string;
    };
  };
  property: {
    _id: string;
    title: string;
    titleAr: string;
    price: number;
    propertyType: string;
    location: {
      city: string;
      district: string;
    };
  };
  content: string;
  messageType: 'text' | 'inquiry' | 'offer' | 'complaint';
  status: 'pending' | 'read' | 'replied' | 'archived' | 'spam';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isRead: boolean;
  isSpam: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Demo data
const demoMessages: MessageData[] = [
  {
    _id: '1',
    conversationId: 'conv1',
    participants: {
      sender: {
        _id: 'user1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      },
      receiver: {
        _id: 'admin1',
        name: 'الإدارة',
        email: 'admin@example.com',
      },
    },
    property: {
      _id: 'prop1',
      title: 'Luxury Villa',
      titleAr: 'فيلا فاخرة في النرجس',
      price: 2500000,
      propertyType: 'villa',
      location: {
        city: 'الرياض',
        district: 'النرجس',
      },
    },
    content: 'أريد الاستفسار عن هذا العقار، هل يمكنني معاينته؟',
    messageType: 'inquiry',
    status: 'pending',
    priority: 'normal',
    isRead: false,
    isSpam: false,
    isDeleted: false,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    _id: '2',
    conversationId: 'conv2',
    participants: {
      sender: {
        _id: 'user2',
        name: 'محمد علي',
        email: 'mohamed@example.com',
      },
      receiver: {
        _id: 'admin1',
        name: 'الإدارة',
        email: 'admin@example.com',
      },
    },
    property: {
      _id: 'prop2',
      title: 'Modern Apartment',
      titleAr: 'شقة حديثة للإيجار',
      price: 45000,
      propertyType: 'apartment',
      location: {
        city: 'جدة',
        district: 'الروضة',
      },
    },
    content: 'لدي شكوى بخصوص أحد الوكلاء، لم يرد على اتصالاتي',
    messageType: 'complaint',
    status: 'pending',
    priority: 'high',
    isRead: false,
    isSpam: false,
    isDeleted: false,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 7200000),
  },
  {
    _id: '3',
    conversationId: 'conv3',
    participants: {
      sender: {
        _id: 'user3',
        name: 'خالد العمري',
        email: 'khaled@example.com',
      },
      receiver: {
        _id: 'admin1',
        name: 'الإدارة',
        email: 'admin@example.com',
      },
    },
    property: {
      _id: 'prop3',
      title: 'Commercial Building',
      titleAr: 'عمارة تجارية للبيع',
      price: 8000000,
      propertyType: 'building',
      location: {
        city: 'الدمام',
        district: 'الفيصلية',
      },
    },
    content: 'أود تقديم عرض على هذا العقار بمبلغ 7,500,000 ريال',
    messageType: 'offer',
    status: 'read',
    priority: 'urgent',
    isRead: true,
    isSpam: false,
    isDeleted: false,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageData[]>(demoMessages);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [loading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Statistics
  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.isRead).length,
    pending: messages.filter(m => m.status === 'pending').length,
    urgent: messages.filter(m => m.priority === 'urgent').length,
    spam: messages.filter(m => m.isSpam).length,
  };

  // Filter and sort messages using useMemo
  const filteredMessages = useMemo(() => {
    let filtered = [...messages];

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (msg) =>
          msg.participants.sender.name.toLowerCase().includes(search.toLowerCase()) ||
          msg.participants.sender.email.toLowerCase().includes(search.toLowerCase()) ||
          msg.content.toLowerCase().includes(search.toLowerCase()) ||
          msg.property.titleAr.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((msg) => msg.status === filterStatus);
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((msg) => msg.messageType === filterType);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter((msg) => msg.priority === filterPriority);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default:
          return 0;
      }
    });

    return filtered;
  }, [messages, search, filterStatus, filterType, filterPriority, sortBy]);

  // Handle actions
  const handleMarkAsRead = (ids: string[]) => {
    setMessages(
      messages.map((msg) =>
        ids.includes(msg._id) ? { ...msg, isRead: true, status: 'read' as const } : msg
      )
    );
    toast.success('تم وضع علامة مقروء');
  };

  const handleMarkAsSpam = (ids: string[]) => {
    setMessages(
      messages.map((msg) =>
        ids.includes(msg._id) ? { ...msg, isSpam: true, status: 'spam' as const } : msg
      )
    );
    toast.success('تم تحديد كرسالة مزعجة');
  };

  const handleDelete = (ids: string[]) => {
    setMessages(messages.filter((msg) => !ids.includes(msg._id)));
    setSelectedMessages([]);
    toast.success('تم حذف الرسائل');
  };

  const handleArchive = (ids: string[]) => {
    setMessages(
      messages.map((msg) =>
        ids.includes(msg._id) ? { ...msg, status: 'archived' as const } : msg
      )
    );
    toast.success('تم الأرشفة');
  };

  const handleView = (messageId: string) => {
    // يمكن إضافة modal أو redirect لعرض التفاصيل
    toast.success(`عرض الرسالة: ${messageId}`);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ar-SA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge
  const getStatusBadge = (status: MessageData['status']) => {
    const badges: Record<MessageData['status'], { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'قيد الانتظار' },
      read: { color: 'bg-blue-100 text-blue-800', label: 'مقروءة' },
      replied: { color: 'bg-green-100 text-green-800', label: 'تم الرد' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'مؤرشفة' },
      spam: { color: 'bg-red-100 text-red-800', label: 'مزعجة' },
    };
    return badges[status];
  };

  // Get priority badge
  const getPriorityBadge = (priority: MessageData['priority']) => {
    const badges: Record<MessageData['priority'], { color: string; icon: typeof FaClock }> = {
      low: { color: 'bg-gray-100 text-gray-600', icon: FaClock },
      normal: { color: 'bg-blue-100 text-blue-600', icon: FaCheckCircle },
      high: { color: 'bg-orange-100 text-orange-600', icon: FaExclamationTriangle },
      urgent: { color: 'bg-red-100 text-red-600', icon: FaExclamationTriangle },
    };
    return badges[priority];
  };

  // Get message type icon
  const getTypeIcon = (type: MessageData['messageType']) => {
    const icons: Record<MessageData['messageType'], typeof FaEnvelope> = {
      text: FaEnvelope,
      inquiry: FaSearch,
      offer: FaCheckCircle,
      complaint: FaExclamationTriangle,
    };
    return icons[type];
  };

  return (
    <div className="p-6" dir="rtl">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">إدارة الرسائل</h1>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'إجمالي الرسائل', value: stats.total, icon: FaEnvelope, color: 'bg-blue-100 text-blue-600' },
            { label: 'غير مقروءة', value: stats.unread, icon: FaEnvelopeOpen, color: 'bg-yellow-100 text-yellow-600' },
            { label: 'قيد الانتظار', value: stats.pending, icon: FaClock, color: 'bg-orange-100 text-orange-600' },
            { label: 'عاجلة', value: stats.urgent, icon: FaExclamationTriangle, color: 'bg-red-100 text-red-600' },
            { label: 'مزعجة', value: stats.spam, icon: FaBan, color: 'bg-gray-100 text-gray-600' },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color} p-1 rounded`} />
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px] relative">
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الرسائل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="read">مقروءة</option>
            <option value="replied">تم الرد</option>
            <option value="archived">مؤرشفة</option>
            <option value="spam">مزعجة</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">جميع الأنواع</option>
            <option value="inquiry">استفسار</option>
            <option value="offer">عرض</option>
            <option value="complaint">شكوى</option>
            <option value="text">عام</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">جميع الأولويات</option>
            <option value="urgent">عاجل</option>
            <option value="high">عالي</option>
            <option value="normal">عادي</option>
            <option value="low">منخفض</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="newest">الأحدث</option>
            <option value="oldest">الأقدم</option>
            <option value="priority">الأولوية</option>
          </select>

          {/* Export Button */}
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <FaDownload className="w-4 h-4" />
            <span>تصدير</span>
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedMessages.length > 0 && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg flex items-center justify-between">
            <span className="text-emerald-700">
              تم تحديد {selectedMessages.length} رسالة
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleMarkAsRead(selectedMessages)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                علامة مقروء
              </button>
              <button
                onClick={() => handleArchive(selectedMessages)}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                أرشفة
              </button>
              <button
                onClick={() => handleMarkAsSpam(selectedMessages)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                مزعجة
              </button>
              <button
                onClick={() => handleDelete(selectedMessages)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                حذف
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <FaEnvelope className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد رسائل</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-right">
                    <input
                      type="checkbox"
                      checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMessages(filteredMessages.map((m) => m._id));
                        } else {
                          setSelectedMessages([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="p-4 text-right text-sm font-medium text-gray-700">المرسل</th>
                  <th className="p-4 text-right text-sm font-medium text-gray-700">العقار</th>
                  <th className="p-4 text-right text-sm font-medium text-gray-700">المحتوى</th>
                  <th className="p-4 text-right text-sm font-medium text-gray-700">النوع</th>
                  <th className="p-4 text-right text-sm font-medium text-gray-700">الحالة</th>
                  <th className="p-4 text-right text-sm font-medium text-gray-700">الأولوية</th>
                  <th className="p-4 text-right text-sm font-medium text-gray-700">التاريخ</th>
                  <th className="p-4 text-right text-sm font-medium text-gray-700">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message) => {
                  const StatusBadge = getStatusBadge(message.status);
                  const PriorityBadge = getPriorityBadge(message.priority);
                  const TypeIcon = getTypeIcon(message.messageType);

                  return (
                    <tr
                      key={message._id}
                      className={`border-b hover:bg-gray-50 ${
                        !message.isRead ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(message._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMessages([...selectedMessages, message._id]);
                            } else {
                              setSelectedMessages(
                                selectedMessages.filter((id) => id !== message._id)
                              );
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                            {message.participants.sender.image ? (
                              <Image
                                src={message.participants.sender.image}
                                alt={message.participants.sender.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600 font-bold">
                                {message.participants.sender.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {message.participants.sender.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {message.participants.sender.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-800 line-clamp-1">
                          {message.property.titleAr}
                        </p>
                        <p className="text-xs text-gray-500">
                          {message.property.location.city}، {message.property.location.district}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                          {message.content}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {message.messageType === 'inquiry' && 'استفسار'}
                            {message.messageType === 'offer' && 'عرض'}
                            {message.messageType === 'complaint' && 'شكوى'}
                            {message.messageType === 'text' && 'عام'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${StatusBadge.color}`}
                        >
                          {StatusBadge.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <PriorityBadge.icon
                            className={`w-4 h-4 ${PriorityBadge.color} p-0.5 rounded`}
                          />
                          <span className={`text-xs font-medium ${PriorityBadge.color} px-2 py-1 rounded`}>
                            {message.priority === 'urgent' && 'عاجل'}
                            {message.priority === 'high' && 'عالي'}
                            {message.priority === 'normal' && 'عادي'}
                            {message.priority === 'low' && 'منخفض'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {formatDate(message.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(message._id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="عرض"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMarkAsRead([message._id])}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="علامة مقروء"
                          >
                            <FaCheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleArchive([message._id])}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            title="أرشفة"
                          >
                            <FaArchive className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete([message._id])}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="حذف"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}