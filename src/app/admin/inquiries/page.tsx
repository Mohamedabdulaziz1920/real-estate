'use client';

// 1. إضافة useCallback للاستيراد
import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  ChevronRight,
  MessageSquare,
  X,
  Send,
  Eye,
  Reply
} from 'lucide-react';

// نوع البيانات للاستفسار
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  repliedAt?: string;
  reply?: string;
}

interface Stats {
  total: number;
  new: number;
  read: number;
  replied: number;
  closed: number;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    closed: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });

  // 2. تغليف دالة جلب الاستفسارات بـ useCallback
  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filters.status,
        priority: filters.priority,
        search: filters.search
      });
      
      const response = await fetch(`/api/admin/inquiries?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setInquiries(data.data);
        setFilteredInquiries(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]); // الاعتمادية هي filters

  // 3. إضافة الدالة إلى مصفوفة الاعتماديات
  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // تحديث حالة الاستفسار
  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (response.ok) {
        fetchInquiries();
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  // إرسال الرد
  const sendReply = async () => {
    if (!selectedInquiry || !replyText) return;
    
    try {
      const response = await fetch('/api/admin/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedInquiry.id,
          reply: replyText
        })
      });
      
      if (response.ok) {
        setShowReplyModal(false);
        setReplyText('');
        setSelectedInquiry(null);
        fetchInquiries();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  // حذف استفسار
  const deleteInquiry = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الاستفسار؟')) return;
    
    try {
      const response = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchInquiries();
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  // عرض التفاصيل
  const viewDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    if (inquiry.status === 'new') {
      updateInquiryStatus(inquiry.id, 'read');
    }
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على لون الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* العنوان والإحصائيات */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">إدارة الاستفسارات</h1>
          
          {/* بطاقات الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">الإجمالي</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-blue-50 rounded-lg shadow p-4">
              <div className="text-sm text-blue-600">جديد</div>
              <div className="text-2xl font-bold text-blue-900">{stats.new}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow p-4">
              <div className="text-sm text-yellow-600">مقروء</div>
              <div className="text-2xl font-bold text-yellow-900">{stats.read}</div>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4">
              <div className="text-sm text-green-600">تم الرد</div>
              <div className="text-2xl font-bold text-green-900">{stats.replied}</div>
            </div>
            <div className="bg-gray-100 rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">مغلق</div>
              <div className="text-2xl font-bold text-gray-900">{stats.closed}</div>
            </div>
          </div>

          {/* شريط البحث والفلاتر */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="البحث في الاستفسارات..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">جميع الحالات</option>
              <option value="new">جديد</option>
              <option value="read">مقروء</option>
              <option value="replied">تم الرد</option>
              <option value="closed">مغلق</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="all">جميع الأولويات</option>
              <option value="high">عالية</option>
              <option value="medium">متوسطة</option>
              <option value="low">منخفضة</option>
            </select>
          </div>
        </div>

        {/* قائمة الاستفسارات */}
        <div className="bg-white rounded-lg shadow">
          {filteredInquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد استفسارات
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => viewDetails(inquiry)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status === 'new' ? 'جديد' :
                           inquiry.status === 'read' ? 'مقروء' :
                           inquiry.status === 'replied' ? 'تم الرد' : 'مغلق'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                          {inquiry.priority === 'high' ? 'عالية' :
                           inquiry.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-800 mb-1">{inquiry.subject}</h4>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{inquiry.message}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {inquiry.email}
                        </span>
                        {inquiry.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {inquiry.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(inquiry.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-gray-400 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* نافذة تفاصيل الاستفسار */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">تفاصيل الاستفسار</h2>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                {/* معلومات المرسل */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">معلومات المرسل</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-500 text-sm">الاسم:</span>
                      <p className="font-medium">{selectedInquiry.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">البريد الإلكتروني:</span>
                      <p className="font-medium">{selectedInquiry.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">الهاتف:</span>
                      <p className="font-medium">{selectedInquiry.phone || 'غير محدد'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">التاريخ:</span>
                      <p className="font-medium">{formatDate(selectedInquiry.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                {/* تفاصيل الاستفسار */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">الاستفسار</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">{selectedInquiry.subject}</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>
                </div>
                
                {/* العقار المرتبط */}
                {selectedInquiry.propertyTitle && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">العقار المرتبط</h3>
                    <p className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                      {selectedInquiry.propertyTitle}
                    </p>
                  </div>
                )}
                
                {/* الرد السابق */}
                {selectedInquiry.reply && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">الرد</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-green-800 whitespace-pre-wrap">{selectedInquiry.reply}</p>
                      <p className="text-sm text-green-600 mt-2">
                        تم الرد: {formatDate(selectedInquiry.repliedAt!)}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* الإجراءات */}
                <div className="flex gap-3">
                  {selectedInquiry.status !== 'replied' && (
                    <button
                      onClick={() => {
                        setShowReplyModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Reply className="h-4 w-4" />
                      رد على الاستفسار
                    </button>
                  )}
                  
                  {selectedInquiry.status !== 'closed' && (
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'closed')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      إغلاق الاستفسار
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteInquiry(selectedInquiry.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* نافذة الرد */}
        {showReplyModal && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-xl w-full">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">الرد على الاستفسار</h2>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyText('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نص الرد
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="اكتب ردك هنا..."
                  />
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyText('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={sendReply}
                    disabled={!replyText.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    إرسال الرد
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}