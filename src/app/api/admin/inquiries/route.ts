import { NextRequest, NextResponse } from 'next/server';

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

// بيانات تجريبية
const mockInquiries: Inquiry[] = [
  {
    id: '1',
    name: 'محمد أحمد',
    email: 'mohamed@example.com',
    phone: '+966501234567',
    subject: 'استفسار عن فيلا في حي النرجس',
    message: 'أرغب في معرفة المزيد من التفاصيل عن هذه الفيلا، هل يمكن ترتيب زيارة؟',
    propertyId: '1',
    propertyTitle: 'فيلا فاخرة في حي النرجس',
    status: 'new',
    priority: 'high',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    name: 'سارة علي',
    email: 'sara@example.com',
    phone: '+966502345678',
    subject: 'استفسار عن طرق الدفع',
    message: 'ما هي طرق الدفع المتاحة؟ وهل يوجد تمويل عقاري؟',
    propertyId: '2',
    propertyTitle: 'شقة في حي الملقا',
    status: 'read',
    priority: 'medium',
    createdAt: '2024-01-19T14:20:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
  },
  {
    id: '3',
    name: 'خالد عمر',
    email: 'khaled@example.com',
    phone: '+966503456789',
    subject: 'طلب معاينة عقار',
    message: 'أرغب في معاينة العقار يوم السبت القادم إن أمكن.',
    propertyId: '3',
    propertyTitle: 'أرض تجارية في حي العليا',
    status: 'replied',
    priority: 'low',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-18T11:30:00Z',
    repliedAt: '2024-01-18T11:30:00Z',
    reply: 'شكراً لتواصلك، تم تحديد موعد المعاينة يوم السبت الساعة 10 صباحاً.',
  },
];

// GET - جلب جميع الاستفسارات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // استخراج معايير الفلترة
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredInquiries = [...mockInquiries];

    // تطبيق الفلاتر
    if (status && status !== 'all') {
      filteredInquiries = filteredInquiries.filter(inq => inq.status === status);
    }

    if (priority && priority !== 'all') {
      filteredInquiries = filteredInquiries.filter(inq => inq.priority === priority);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredInquiries = filteredInquiries.filter(inq =>
        inq.name.toLowerCase().includes(searchLower) ||
        inq.email.toLowerCase().includes(searchLower) ||
        inq.subject.toLowerCase().includes(searchLower) ||
        inq.message.toLowerCase().includes(searchLower)
      );
    }

    // حساب الإجماليات
    const total = filteredInquiries.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // تطبيق الصفحات
    const paginatedInquiries = filteredInquiries.slice(startIndex, endIndex);

    // إحصائيات
    const stats = {
      total: mockInquiries.length,
      new: mockInquiries.filter(i => i.status === 'new').length,
      read: mockInquiries.filter(i => i.status === 'read').length,
      replied: mockInquiries.filter(i => i.status === 'replied').length,
      closed: mockInquiries.filter(i => i.status === 'closed').length,
    };

    return NextResponse.json({
      success: true,
      data: paginatedInquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب الاستفسارات' },
      { status: 500 }
    );
  }
}

// POST - إنشاء استفسار جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // التحقق من البيانات المطلوبة
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    // إنشاء استفسار جديد
    const newInquiry: Inquiry = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      subject,
      message,
      propertyId: body.propertyId,
      propertyTitle: body.propertyTitle,
      status: 'new',
      priority: body.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // في الواقع، سيتم حفظ البيانات في قاعدة البيانات
    mockInquiries.unshift(newInquiry);

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الاستفسار بنجاح',
      data: newInquiry,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إرسال الاستفسار' },
      { status: 500 }
    );
  }
}

// PUT - تحديث استفسار (الحالة أو الرد)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, reply, priority } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الاستفسار مطلوب' },
        { status: 400 }
      );
    }

    // البحث عن الاستفسار
    const inquiryIndex = mockInquiries.findIndex(inq => inq.id === id);
    
    if (inquiryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'الاستفسار غير موجود' },
        { status: 404 }
      );
    }

    // تحديث البيانات
    const updatedInquiry = { ...mockInquiries[inquiryIndex] };
    
    if (status) {
      updatedInquiry.status = status;
    }
    
    if (priority) {
      updatedInquiry.priority = priority;
    }
    
    if (reply) {
      updatedInquiry.reply = reply;
      updatedInquiry.repliedAt = new Date().toISOString();
      updatedInquiry.status = 'replied';
    }
    
    updatedInquiry.updatedAt = new Date().toISOString();
    
    mockInquiries[inquiryIndex] = updatedInquiry;

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الاستفسار بنجاح',
      data: updatedInquiry,
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث الاستفسار' },
      { status: 500 }
    );
  }
}

// DELETE - حذف استفسار
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الاستفسار مطلوب' },
        { status: 400 }
      );
    }

    // البحث عن الاستفسار
    const inquiryIndex = mockInquiries.findIndex(inq => inq.id === id);
    
    if (inquiryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'الاستفسار غير موجود' },
        { status: 404 }
      );
    }

    // حذف الاستفسار
    mockInquiries.splice(inquiryIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'تم حذف الاستفسار بنجاح',
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في حذف الاستفسار' },
      { status: 500 }
    );
  }
}