// src/app/api/seed/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const sampleProperties = [
  {
    title: 'Luxury Villa in Riyadh',
    titleAr: 'فيلا فاخرة في الرياض',
    description: 'Beautiful luxury villa with modern amenities',
    descriptionAr: 'فيلا فاخرة وجميلة مع جميع وسائل الراحة الحديثة، تتميز بتصميم عصري وموقع متميز في حي النرجس',
    price: 2500000,
    propertyType: 'villa',
    listingType: 'sale',
    status: 'available', // ✅ صحيح
    location: {
      city: 'الرياض',
      district: 'النرجس',
      address: 'شارع الأمير محمد بن سلمان',
    },
    features: {
      area: 500,
      bedrooms: 5,
      bathrooms: 4,
      floors: 2,
      yearBuilt: 2022,
      furnished: true,
      parking: true,
      garden: true,
      pool: true,
      security: true,
      airConditioning: true,
    },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
    agent: {
      name: 'أحمد محمد',
      phone: '+966501234567',
      email: 'ahmed@realestate.com',
    },
    views: 150,
    featured: true,
  },
  {
    title: 'Modern Apartment in Jeddah',
    titleAr: 'شقة عصرية في جدة',
    description: 'Spacious apartment with sea view',
    descriptionAr: 'شقة واسعة بإطلالة بحرية رائعة، قريبة من جميع الخدمات والمرافق',
    price: 8000,
    propertyType: 'apartment',
    listingType: 'rent',
    status: 'available',
    location: {
      city: 'جدة',
      district: 'الحمراء',
      address: 'شارع الكورنيش',
    },
    features: {
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      furnished: true,
      parking: true,
      elevator: true,
      security: true,
      airConditioning: true,
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    agent: {
      name: 'سارة أحمد',
      phone: '+966507654321',
      email: 'sara@realestate.com',
    },
    views: 89,
    featured: true,
  },
  {
    title: 'Commercial Land in Dammam',
    titleAr: 'أرض تجارية في الدمام',
    description: 'Prime location commercial land',
    descriptionAr: 'أرض تجارية بموقع استراتيجي مميز على الشارع الرئيسي',
    price: 5000000,
    propertyType: 'land',
    listingType: 'sale',
    status: 'available',
    location: {
      city: 'الدمام',
      district: 'الفيصلية',
      address: 'طريق الملك فهد',
    },
    features: {
      area: 1000,
    },
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    ],
    agent: {
      name: 'خالد العمري',
      phone: '+966509876543',
      email: 'khaled@realestate.com',
    },
    views: 234,
    featured: false,
  },
  {
    title: 'Furnished Apartment for Rent',
    titleAr: 'شقة مفروشة للإيجار',
    description: 'Fully furnished apartment in prime location',
    descriptionAr: 'شقة مفروشة بالكامل في موقع مميز قريب من المولات والمطاعم',
    price: 5500,
    propertyType: 'apartment',
    listingType: 'rent',
    status: 'available',
    location: {
      city: 'الرياض',
      district: 'العليا',
      address: 'شارع التحلية',
    },
    features: {
      area: 120,
      bedrooms: 2,
      bathrooms: 2,
      furnished: true,
      parking: true,
      elevator: true,
      airConditioning: true,
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    ],
    agent: {
      name: 'نورة السعيد',
      phone: '+966505551234',
      email: 'noura@realestate.com',
    },
    views: 67,
    featured: true,
  },
  {
    title: 'Residential Building for Sale',
    titleAr: 'عمارة سكنية للبيع',
    description: 'Residential building with 8 apartments',
    descriptionAr: 'عمارة سكنية تحتوي على 8 شقق بدخل سنوي ممتاز',
    price: 4500000,
    propertyType: 'building',
    listingType: 'sale',
    status: 'available',
    location: {
      city: 'مكة المكرمة',
      district: 'العزيزية',
      address: 'شارع إبراهيم الخليل',
    },
    features: {
      area: 800,
      floors: 4,
      parking: true,
      elevator: true,
      security: true,
    },
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    ],
    agent: {
      name: 'محمد الشريف',
      phone: '+966502223344',
      email: 'mohammed@realestate.com',
    },
    views: 45,
    featured: false,
  },
  {
    title: 'Luxury Villa with Pool',
    titleAr: 'فيلا فاخرة مع مسبح',
    description: 'Stunning villa with private pool and garden',
    descriptionAr: 'فيلا مذهلة مع مسبح خاص وحديقة واسعة ومجلس خارجي',
    price: 15000,
    propertyType: 'villa',
    listingType: 'rent',
    status: 'available',
    location: {
      city: 'جدة',
      district: 'أبحر الشمالية',
      address: 'شارع الأمير سلطان',
    },
    features: {
      area: 600,
      bedrooms: 6,
      bathrooms: 5,
      floors: 2,
      furnished: true,
      parking: true,
      garden: true,
      pool: true,
      security: true,
      airConditioning: true,
    },
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
    agent: {
      name: 'فهد القحطاني',
      phone: '+966508889999',
      email: 'fahad@realestate.com',
    },
    views: 312,
    featured: true,
  },
];

export async function GET() {
  try {
    await dbConnect();
    console.log("✅ Database connected");

    // 1. البحث عن مستخدم موجود أو إنشاء مستخدم أدمن
    let owner = await User.findOne({});
    
    if (!owner) {
      console.log("📝 Creating admin user...");
      const hashedPassword = await bcrypt.hash("admin123456", 12);
      
      owner = await User.create({
        name: "مدير النظام",
        email: "admin@aqari.com",
        password: hashedPassword,
        phone: "0500000000",
        role: "admin",
        isActive: true,
      });
      
      console.log("✅ Admin user created:", owner.email);
    } else {
      console.log("✅ Found existing user:", owner.email);
    }

    // 2. حذف العقارات القديمة
    await Property.deleteMany({});
    console.log("🗑️ Old properties deleted");

    // 3. إضافة owner لكل عقار
    const propertiesWithOwner = sampleProperties.map((prop) => ({
      ...prop,
      owner: owner._id,
    }));

    // 4. إضافة العقارات الجديدة
    const properties = await Property.insertMany(propertiesWithOwner);
    console.log(`✅ ${properties.length} properties created`);

    return NextResponse.json({
      success: true,
      message: `تم إضافة ${properties.length} عقار بنجاح`,
      count: properties.length,
      admin: {
        email: owner.email,
        password: owner.email === "admin@aqari.com" ? "admin123456" : "كلمة المرور الخاصة بك",
        note: "استخدم هذه البيانات لتسجيل الدخول"
      }
    });
  } catch (error: any) {
    console.error("❌ Seed error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: error.errors ? Object.keys(error.errors) : null
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await dbConnect();
    await Property.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: "تم حذف جميع العقارات"
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}