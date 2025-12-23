// src/app/properties/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import User from '@/models/User'; // ✅ أضف هذا السطر المهم جداً
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEye,
  FaPhone,
  FaWhatsapp,
  FaParking,
  FaSwimmingPool,
  FaTree,
  FaSnowflake,
  FaShieldAlt,
  FaBuilding,
  FaArrowRight,
  FaShare,
  FaHeart,
  FaEnvelope,
} from 'react-icons/fa';

async function getProperty(id: string) {
  try {
    await dbConnect();
    
    // ✅ تأكد من تسجيل User Model
    console.log('User model registered:', !!mongoose.models.User);
    
    // التحقق من صحة الـ ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId:", id);
      return null;
    }

    const property = await Property.findById(id)
      .populate({
        path: 'owner',
        model: User, // ✅ حدد الموديل صراحة
        select: 'name email phone image'
      })
      .lean();
    
    if (!property) {
      console.log("Property not found:", id);
      return null;
    }
    
    // زيادة عداد المشاهدات
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } });
    
    return JSON.parse(JSON.stringify(property));
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const propertyTypeLabels: Record<string, string> = {
    apartment: 'شقة',
    villa: 'فيلا',
    land: 'أرض',
    building: 'عمارة',
    office: 'مكتب',
  };

  const listingTypeLabels: Record<string, string> = {
    sale: 'للبيع',
    rent: 'للإيجار',
  };

  const formatPrice = (price: number, listingType: string) => {
    const formatted = price.toLocaleString('ar-SA');
    if (listingType === 'rent') {
      return `${formatted} ريال/شهرياً`;
    }
    return `${formatted} ريال`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const featuresList = [
    { key: 'parking', label: 'موقف سيارات', icon: FaParking },
    { key: 'pool', label: 'مسبح', icon: FaSwimmingPool },
    { key: 'garden', label: 'حديقة', icon: FaTree },
    { key: 'airConditioning', label: 'تكييف', icon: FaSnowflake },
    { key: 'security', label: 'حراسة أمنية', icon: FaShieldAlt },
    { key: 'elevator', label: 'مصعد', icon: FaBuilding },
  ];

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <FaArrowRight />
            <span>العودة للعقارات</span>
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                alt={property.titleAr}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <button className="p-3 rounded-full bg-white/90 hover:bg-white transition-colors">
                  <FaHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                </button>
                <button className="p-3 rounded-full bg-white/90 hover:bg-white transition-colors">
                  <FaShare className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Secondary Images */}
            <div className="grid grid-cols-2 gap-4">
              {property.images?.slice(1, 5).map((image: string, index: number) => (
                <div key={index} className="relative h-[190px] md:h-[240px] rounded-2xl overflow-hidden">
                  <Image
                    src={image}
                    alt={`${property.titleAr} - ${index + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
              {(!property.images || property.images.length <= 1) && (
                <div className="col-span-2 h-[240px] rounded-2xl bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-400">لا توجد صور إضافية</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white ${
                      property.listingType === 'sale' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}>
                      {listingTypeLabels[property.listingType]}
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                      {propertyTypeLabels[property.propertyType]}
                    </span>
                    {property.featured && (
                      <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-amber-500 text-white">
                        مميز
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {property.titleAr}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500">
                    <FaMapMarkerAlt className="text-emerald-500" />
                    <span>
                      {property.location?.district}، {property.location?.city}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-emerald-600">
                    {formatPrice(property.price, property.listingType)}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <FaEye />
                      {property.views || 0} مشاهدة
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {formatDate(property.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <FaRulerCombined className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {property.features?.area}
                  </div>
                  <div className="text-sm text-gray-500">متر مربع</div>
                </div>
                {property.features?.bedrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <FaBed className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">
                      {property.features.bedrooms}
                    </div>
                    <div className="text-sm text-gray-500">غرف نوم</div>
                  </div>
                )}
                {property.features?.bathrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <FaBath className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">
                      {property.features.bathrooms}
                    </div>
                    <div className="text-sm text-gray-500">حمامات</div>
                  </div>
                )}
                {property.features?.floors && (
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <FaBuilding className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">
                      {property.features.floors}
                    </div>
                    <div className="text-sm text-gray-500">طوابق</div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {property.descriptionAr && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">الوصف</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.descriptionAr}
                </p>
              </div>
            )}

            {/* Features */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">المميزات</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {featuresList.map(
                  (feature) =>
                    property.features?.[feature.key] && (
                      <div
                        key={feature.key}
                        className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl"
                      >
                        <feature.icon className="w-6 h-6 text-emerald-600" />
                        <span className="font-medium text-gray-700">
                          {feature.label}
                        </span>
                      </div>
                    )
                )}
                {property.features?.furnished && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                    <span className="font-medium text-gray-700">✓ مفروش</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">الموقع</h2>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <FaMapMarkerAlt className="text-emerald-500" />
                <span>
                  {property.location?.address ||
                    `${property.location?.district}، ${property.location?.city}`}
                </span>
              </div>
              <div className="h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaMapMarkerAlt className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium">{property.location?.city}</p>
                  <p className="text-sm">{property.location?.district}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-600">
                    {property.agent?.name?.charAt(0) || property.owner?.name?.charAt(0) || 'م'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {property.agent?.name || property.owner?.name || 'المالك'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {property.agent ? 'وكيل عقاري' : 'مالك العقار'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${property.agent?.phone || property.owner?.phone || ''}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                >
                  <FaPhone />
                  <span>اتصال</span>
                </a>
                <a
                  href={`https://wa.me/${(property.agent?.phone || property.owner?.phone || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                >
                  <FaWhatsapp />
                  <span>واتساب</span>
                </a>
                <a
                  href={`mailto:${property.agent?.email || property.owner?.email || ''}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  <FaEnvelope />
                  <span>البريد الإلكتروني</span>
                </a>
              </div>

              <div className="mt-6 pt-6 border-t">
                <button className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl font-medium transition-colors">
                  <FaHeart />
                  <span>إضافة للمفضلة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}