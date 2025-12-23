// src/app/api/properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User"; // ✅ أضف هذا السطر - حل المشكلة الرئيسية!

// GET - جلب العقارات
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const sortOptions: any = {};
    
    // Handle nested sorting (e.g., features.area)
    if (sortBy.includes(".")) {
      sortOptions[sortBy] = sortOrder;
    } else {
      sortOptions[sortBy] = sortOrder;
    }
    
    // Build filter
    const filter: any = { status: "available" };
    
    // Property Type Filter
    const propertyType = searchParams.get("propertyType");
    if (propertyType && propertyType !== "all") {
      filter.propertyType = propertyType;
    }
    
    // Listing Type Filter
    const listingType = searchParams.get("listingType");
    if (listingType && listingType !== "all") {
      filter.listingType = listingType;
    }
    
    // City Filter
    const city = searchParams.get("city");
    if (city && city !== "all") {
      filter["location.city"] = city;
    }
    
    // District Filter
    const district = searchParams.get("district");
    if (district) {
      filter["location.district"] = district;
    }
    
    // Price Range Filter
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    // Area Range Filter
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    if (minArea || maxArea) {
      filter["features.area"] = {};
      if (minArea) filter["features.area"].$gte = parseInt(minArea);
      if (maxArea) filter["features.area"].$lte = parseInt(maxArea);
    }
    
    // Bedrooms Filter
    const bedrooms = searchParams.get("bedrooms");
    if (bedrooms && bedrooms !== "all") {
      if (bedrooms === "5+") {
        filter["features.bedrooms"] = { $gte: 5 };
      } else {
        filter["features.bedrooms"] = parseInt(bedrooms);
      }
    }
    
    // Bathrooms Filter
    const bathrooms = searchParams.get("bathrooms");
    if (bathrooms && bathrooms !== "all") {
      if (bathrooms === "4+") {
        filter["features.bathrooms"] = { $gte: 4 };
      } else {
        filter["features.bathrooms"] = parseInt(bathrooms);
      }
    }
    
    // Features Filters (furnished, parking, etc.)
    const features = [
      "furnished",
      "parking",
      "garden",
      "pool",
      "elevator",
      "security",
      "airConditioning"
    ];
    
    features.forEach(feature => {
      const value = searchParams.get(feature);
      if (value === "true") {
        filter[`features.${feature}`] = true;
      }
    });
    
    // Featured Filter
    const featured = searchParams.get("featured");
    if (featured === "true") {
      filter.featured = true;
    }

    console.log("Filter:", filter); // للتشخيص
    console.log("Sort:", sortOptions); // للتشخيص

    // جلب العقارات مع معلومات المالك
    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("owner", "name email phone image") // ✅ سيعمل الآن بعد استيراد User
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: properties, // ✅ تغيير من properties إلى data
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "خطأ في جلب العقارات",
        details: error.toString() 
      },
      { status: 500 }
    );
  }
}

// POST - إضافة عقار جديد
export async function POST(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    console.log("Received property data:", JSON.stringify(body, null, 2));

    // التحقق من الحقول المطلوبة
    const requiredFields = ["titleAr", "price", "propertyType", "listingType"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `الحقول التالية مطلوبة: ${missingFields.join(", ")}` 
        },
        { status: 400 }
      );
    }

    // التحقق من الموقع
    if (!body.location?.city || !body.location?.district) {
      return NextResponse.json(
        { success: false, error: "المدينة والحي مطلوبان" },
        { status: 400 }
      );
    }

    // التحقق من المساحة
    if (!body.features?.area) {
      return NextResponse.json(
        { success: false, error: "المساحة مطلوبة" },
        { status: 400 }
      );
    }

    // إنشاء العقار
    const propertyData = {
      title: body.title || body.titleAr,
      titleAr: body.titleAr,
      description: body.description || body.descriptionAr || "",
      descriptionAr: body.descriptionAr || "",
      price: Number(body.price),
      propertyType: body.propertyType,
      listingType: body.listingType,
      status: "available",
      location: {
        city: body.location.city,
        district: body.location.district,
        address: body.location.address || "",
        coordinates: body.location.coordinates || undefined,
      },
      features: {
        area: Number(body.features.area),
        bedrooms: body.features.bedrooms ? Number(body.features.bedrooms) : undefined,
        bathrooms: body.features.bathrooms ? Number(body.features.bathrooms) : undefined,
        floors: body.features.floors ? Number(body.features.floors) : undefined,
        yearBuilt: body.features.yearBuilt ? Number(body.features.yearBuilt) : undefined,
        furnished: Boolean(body.features.furnished),
        parking: Boolean(body.features.parking),
        garden: Boolean(body.features.garden),
        pool: Boolean(body.features.pool),
        elevator: Boolean(body.features.elevator),
        security: Boolean(body.features.security),
        airConditioning: Boolean(body.features.airConditioning),
      },
      images: body.images || [],
      video: body.video || undefined,
      owner: session.user.id,
      agent: body.agent || undefined,
      featured: false,
      views: 0,
    };

    console.log("Creating property with data:", JSON.stringify(propertyData, null, 2));

    const property = await Property.create(propertyData);
    
    // جلب العقار مع معلومات المالك
    const populatedProperty = await Property.findById(property._id)
      .populate("owner", "name email phone image") // ✅ سيعمل الآن
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "تم إضافة العقار بنجاح",
        data: populatedProperty, // ✅ إرجاع العقار كاملاً مع معلومات المالك
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating property:", error);

    // معالجة أخطاء Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { success: false, error: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}