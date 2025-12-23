// src/lib/seedData.ts
import dbConnect from "./mongodb";
import Property from "@/models/Property";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const sampleProperties = [
  {
    titleAr: "فيلا فاخرة في حي النرجس",
    descriptionAr: "فيلا فاخرة بتصميم عصري، تتميز بموقع استراتيجي في حي النرجس. تحتوي على حديقة خاصة ومسبح ومواقف سيارات متعددة.",
    propertyType: "villa",
    listingType: "sale",
    price: 2500000,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    location: { city: "الرياض", district: "النرجس" },
    features: {
      area: 450,
      bedrooms: 5,
      bathrooms: 4,
      parking: true,
      pool: true,
      garden: true,
      airConditioning: true,
      security: true,
    },
    featured: true,
  },
  {
    titleAr: "شقة حديثة للإيجار في الروضة",
    descriptionAr: "شقة عصرية بتشطيبات فاخرة، قريبة من جميع الخدمات والمرافق. مناسبة للعائلات الصغيرة.",
    propertyType: "apartment",
    listingType: "rent",
    price: 45000,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ],
    location: { city: "جدة", district: "الروضة" },
    features: {
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      parking: true,
      airConditioning: true,
      elevator: true,
    },
    featured: true,
  },
  {
    titleAr: "أرض تجارية مميزة في العليا",
    descriptionAr: "أرض تجارية بموقع استراتيجي على شارع رئيسي، مناسبة للمشاريع التجارية والاستثمارية.",
    propertyType: "land",
    listingType: "sale",
    price: 5000000,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    ],
    location: { city: "الرياض", district: "العليا" },
    features: { area: 1000 },
    featured: true,
  },
  {
    titleAr: "عمارة سكنية للاستثمار",
    descriptionAr: "عمارة سكنية مكونة من 10 شقق، دخل ثابت ومستأجرين ملتزمين. فرصة استثمارية ممتازة.",
    propertyType: "building",
    listingType: "sale",
    price: 8000000,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    ],
    location: { city: "الدمام", district: "الفيصلية" },
    features: {
      area: 2000,
      bedrooms: 20,
      bathrooms: 20,
      floors: 4,
      elevator: true,
      parking: true,
    },
    featured: true,
  },
  {
    titleAr: "شقة عصرية بإطلالة بحرية",
    descriptionAr: "شقة فاخرة بإطلالة مباشرة على البحر، تشطيبات عالية الجودة ومرافق متكاملة.",
    propertyType: "apartment",
    listingType: "rent",
    price: 65000,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    location: { city: "جدة", district: "الكورنيش" },
    features: {
      area: 220,
      bedrooms: 4,
      bathrooms: 3,
      parking: true,
      airConditioning: true,
      security: true,
      elevator: true,
    },
    featured: true,
  },
  {
    titleAr: "فيلا مودرن مع مسبح خاص",
    descriptionAr: "فيلا حديثة بتصميم معماري فريد، تضم مسبحاً خاصاً وحديقة كبيرة. في أفضل أحياء الرياض.",
    propertyType: "villa",
    listingType: "sale",
    price: 3500000,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ],
    location: { city: "الرياض", district: "حطين" },
    features: {
      area: 600,
      bedrooms: 6,
      bathrooms: 5,
      floors: 2,
      parking: true,
      pool: true,
      garden: true,
      airConditioning: true,
      security: true,
    },
    featured: true,
  },
];

export async function seedProperties() {
  try {
    await dbConnect();
    console.log("✅ Database connected");

    // البحث عن مستخدم موجود أو إنشاء واحد جديد
    let owner = await User.findOne({});
    
    if (!owner) {
      console.log("📝 Creating default admin user...");
      
      // إنشاء مستخدم افتراضي
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

    // التحقق من وجود عقارات
    const existingCount = await Property.countDocuments();
    
    if (existingCount > 0) {
      console.log(`ℹ️ Already have ${existingCount} properties`);
      return { 
        success: true, 
        message: `يوجد بالفعل ${existingCount} عقارات في قاعدة البيانات`,
        count: existingCount,
        user: { email: owner.email, role: owner.role }
      };
    }

    // إضافة المالك لكل عقار
    const propertiesWithOwner = sampleProperties.map((prop) => ({
      ...prop,
      owner: owner._id,
      status: "active",
      views: Math.floor(Math.random() * 500) + 50,
    }));

    // إدراج العقارات
    const result = await Property.insertMany(propertiesWithOwner);
    console.log(`✅ Seeded ${result.length} properties`);

    return { 
      success: true, 
      message: `تم إضافة ${result.length} عقارات بنجاح`,
      count: result.length,
      user: { 
        email: owner.email, 
        role: owner.role,
        note: "يمكنك تسجيل الدخول بـ admin@aqari.com وكلمة المرور: admin123456"
      }
    };
  } catch (error: any) {
    console.error("❌ Seed error:", error);
    return { 
      success: false, 
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : null
    };
  }
}

// دالة لحذف جميع البيانات (للتطوير فقط)
export async function clearAllData() {
  try {
    await dbConnect();
    
    await Property.deleteMany({});
    console.log("✅ All properties deleted");
    
    return { success: true, message: "تم حذف جميع العقارات" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}