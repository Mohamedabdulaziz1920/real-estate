// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaHome, 
  FaBuilding, 
  FaLandmark, 
  FaSearch,
  FaHandshake,
  FaShieldAlt,
  FaHeadset,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaStar
} from 'react-icons/fa';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

// ✅ تعديل دالة جلب العقارات
async function getFeaturedProperties() {
  try {
    await dbConnect();
    
    // ✅ البحث عن العقارات المميزة أولاً
    let properties = await Property.find({ 
      status: { $in: ['active', 'available'] },  // ✅ قبول كلا الحالتين
      featured: true 
    })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();
    
    // ✅ إذا لم توجد عقارات مميزة، اجلب أحدث العقارات
    if (properties.length === 0) {
      properties = await Property.find({ 
        status: { $in: ['active', 'available'] }
      })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    }
    
    return JSON.parse(JSON.stringify(properties));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// ✅ دالة جلب إحصائيات العقارات
async function getPropertyStats() {
  try {
    await dbConnect();
    
    const [totalCount, apartmentCount, villaCount, landCount, buildingCount] = await Promise.all([
      Property.countDocuments({ status: { $in: ['active', 'available'] } }),
      Property.countDocuments({ status: { $in: ['active', 'available'] }, propertyType: 'apartment' }),
      Property.countDocuments({ status: { $in: ['active', 'available'] }, propertyType: 'villa' }),
      Property.countDocuments({ status: { $in: ['active', 'available'] }, propertyType: 'land' }),
      Property.countDocuments({ status: { $in: ['active', 'available'] }, propertyType: 'building' }),
    ]);
    
    return {
      total: totalCount,
      apartment: apartmentCount,
      villa: villaCount,
      land: landCount,
      building: buildingCount,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      total: 0,
      apartment: 0,
      villa: 0,
      land: 0,
      building: 0,
    };
  }
}

const propertyTypeLabels: Record<string, string> = {
  apartment: 'شقة',
  villa: 'فيلا',
  land: 'أرض',
  building: 'عمارة',
  office: 'مكتب',
};

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();
  const stats = await getPropertyStats();

  const formatPrice = (price: number, listingType: string) => {
    const formatted = price.toLocaleString('ar-SA');
    if (listingType === 'rent') {
      return `${formatted} ريال/سنوياً`;
    }
    return `${formatted} ريال`;
  };

  return (
    <main className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            اعثر على منزل أحلامك
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
            نوفر لك أفضل العقارات في المملكة العربية السعودية للبيع والإيجار
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-4">
              {/* Property Type */}
              <select className="flex-1 min-w-[150px] px-4 py-3 rounded-xl border border-gray-200 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                <option value="">نوع العقار</option>
                <option value="apartment">شقة</option>
                <option value="villa">فيلا</option>
                <option value="land">أرض</option>
                <option value="building">عمارة</option>
              </select>

              {/* Listing Type */}
              <select className="flex-1 min-w-[150px] px-4 py-3 rounded-xl border border-gray-200 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                <option value="">الغرض</option>
                <option value="sale">للبيع</option>
                <option value="rent">للإيجار</option>
              </select>

              {/* City */}
              <select className="flex-1 min-w-[150px] px-4 py-3 rounded-xl border border-gray-200 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                <option value="">المدينة</option>
                <option value="الرياض">الرياض</option>
                <option value="جدة">جدة</option>
                <option value="الدمام">الدمام</option>
                <option value="مكة المكرمة">مكة المكرمة</option>
              </select>

              {/* Search Button */}
              <Link
                href="/properties"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
              >
                <FaSearch />
                <span>بحث</span>
              </Link>
            </div>
          </div>

          {/* ✅ Stats من قاعدة البيانات */}
          <div className="flex flex-wrap justify-center gap-12 mt-16">
            {[
              { number: stats.total > 0 ? `${stats.total}+` : '5000+', label: 'عقار متاح' },
              { number: '2000+', label: 'عميل سعيد' },
              { number: '100+', label: 'وكيل عقاري' },
              { number: '50+', label: 'مدينة' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-emerald-400">
                  {stat.number}
                </div>
                <div className="text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              تصفح حسب نوع العقار
            </h2>
            <p className="text-gray-600 text-lg">
              اختر نوع العقار المناسب لاحتياجاتك
            </p>
          </div>

          {/* ✅ الأعداد من قاعدة البيانات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FaHome, label: 'شقق', count: stats.apartment, color: 'bg-blue-500', href: '/properties?propertyType=apartment' },
              { icon: FaBuilding, label: 'فلل', count: stats.villa, color: 'bg-emerald-500', href: '/properties?propertyType=villa' },
              { icon: FaLandmark, label: 'أراضي', count: stats.land, color: 'bg-amber-500', href: '/properties?propertyType=land' },
              { icon: FaBuilding, label: 'عمارات', count: stats.building, color: 'bg-purple-500', href: '/properties?propertyType=building' },
            ].map((type, index) => (
              <Link
                key={index}
                href={type.href}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <type.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {type.label}
                </h3>
                <p className="text-gray-500">
                  {type.count} عقار
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {featuredProperties.some((p: any) => p.featured) ? 'عقارات مميزة' : 'أحدث العقارات'}
              </h2>
              <p className="text-gray-600">
                أفضل العقارات المختارة لك
              </p>
            </div>
            <Link
              href="/properties"
              className="flex items-center gap-2 px-6 py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl font-medium transition-colors"
            >
              <span>عرض الكل</span>
              <FaArrowLeft />
            </Link>
          </div>

          {/* Check if we have properties */}
          {featuredProperties.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <FaBuilding className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                لا توجد عقارات حالياً
              </h3>
              <p className="text-gray-500 mb-6">
                كن أول من يضيف عقار!
              </p>
              <Link
                href="/add-property"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
              >
                إضافة عقار جديد
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property: any) => (
                <div key={property._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                      alt={property.titleAr || property.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                        property.listingType === 'sale' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}>
                        {property.listingType === 'sale' ? 'للبيع' : 'للإيجار'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-gray-700">
                        {propertyTypeLabels[property.propertyType] || property.propertyType}
                      </span>
                    </div>

                    {property.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-amber-500 text-white">
                          <FaStar className="w-3 h-3" />
                          مميز
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Price */}
                    <div className="text-2xl font-bold text-emerald-600 mb-2">
                      {formatPrice(property.price, property.listingType)}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                      {property.titleAr || property.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <FaMapMarkerAlt className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">
                        {property.location?.district}، {property.location?.city}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      {property.features?.bedrooms && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaBed className="w-5 h-5 text-gray-400" />
                          <span className="text-sm">{property.features.bedrooms} غرف</span>
                        </div>
                      )}
                      {property.features?.bathrooms && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaBath className="w-5 h-5 text-gray-400" />
                          <span className="text-sm">{property.features.bathrooms} حمام</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaRulerCombined className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">{property.features?.area} م²</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <Link
                      href={`/properties/${property._id}`}
                      className="mt-4 block w-full text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              لماذا تختارنا؟
            </h2>
            <p className="text-emerald-100 text-lg">
              نقدم لك أفضل تجربة في البحث عن العقارات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaHandshake,
                title: 'موثوقية عالية',
                description: 'جميع العقارات موثقة ومتحقق منها لضمان حقوقك',
              },
              {
                icon: FaShieldAlt,
                title: 'حماية كاملة',
                description: 'نضمن لك سلامة جميع المعاملات العقارية',
              },
              {
                icon: FaHeadset,
                title: 'دعم متواصل',
                description: 'فريق دعم متخصص على مدار الساعة لمساعدتك',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center text-white hover:bg-white/20 transition-colors"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-emerald-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            هل لديك عقار للبيع أو الإيجار؟
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف الملاك والوكلاء العقاريين وابدأ في عرض عقاراتك للملايين من الباحثين
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/add-property"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-lg transition-colors"
            >
              أضف عقارك مجاناً
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white/30 hover:border-white text-white rounded-xl font-medium text-lg transition-colors"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}