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
  FaStar,
  FaChevronDown
} from 'react-icons/fa';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

// ✅ دالة جلب العقارات المميزة
async function getFeaturedProperties() {
  try {
    await dbConnect();
    
    let properties = await Property.find({ 
      status: { $in: ['active', 'available'] },
      featured: true 
    })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();
    
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

// ✅ دالة جلب الإحصائيات
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
    return { total: 0, apartment: 0, villa: 0, land: 0, building: 0 };
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
    <main className="min-h-screen overflow-x-hidden" dir="rtl">
      {/* ===================== Hero Section ===================== */}
      <section className="relative min-h-[100svh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"
            alt="Hero Background"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full text-center text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight animate-fade-in">
              اعثر على منزل أحلامك
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              نوفر لك أفضل العقارات في المملكة العربية السعودية للبيع والإيجار
            </p>

            {/* ===================== Search Box ===================== */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl max-w-5xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Property Type Select */}
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-200 
                               text-gray-700 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 
                               focus:border-emerald-500 focus:outline-none transition-all duration-200
                               appearance-none cursor-pointer text-sm sm:text-base"
                  >
                    <option value="">نوع العقار</option>
                    <option value="apartment">شقة</option>
                    <option value="villa">فيلا</option>
                    <option value="land">أرض</option>
                    <option value="building">عمارة</option>
                  </select>
                  <FaChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Listing Type Select */}
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-200 
                               text-gray-700 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 
                               focus:border-emerald-500 focus:outline-none transition-all duration-200
                               appearance-none cursor-pointer text-sm sm:text-base"
                  >
                    <option value="">الغرض</option>
                    <option value="sale">للبيع</option>
                    <option value="rent">للإيجار</option>
                  </select>
                  <FaChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* City Select */}
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-200 
                               text-gray-700 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 
                               focus:border-emerald-500 focus:outline-none transition-all duration-200
                               appearance-none cursor-pointer text-sm sm:text-base"
                  >
                    <option value="">المدينة</option>
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة المكرمة">مكة المكرمة</option>
                    <option value="المدينة المنورة">المدينة المنورة</option>
                  </select>
                  <FaChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Search Button */}
                <Link
                  href="/properties"
                  className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 
                             bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                             text-white rounded-lg sm:rounded-xl font-medium 
                             transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                             shadow-lg shadow-emerald-600/30 text-sm sm:text-base"
                >
                  <FaSearch className="w-4 h-4" />
                  <span>بحث</span>
                </Link>
              </div>
            </div>

            {/* ===================== Stats ===================== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-12 mt-10 sm:mt-16 max-w-4xl mx-auto px-4">
              {[
                { number: stats.total > 0 ? `${stats.total}+` : '5000+', label: 'عقار متاح' },
                { number: '2000+', label: 'عميل سعيد' },
                { number: '100+', label: 'وكيل عقاري' },
                { number: '50+', label: 'مدينة' },
              ].map((stat, index) => (
                <div key={index} className="text-center p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-400 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-xs sm:text-sm lg:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* ===================== Property Types Section ===================== */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              تصفح حسب نوع العقار
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              اختر نوع العقار المناسب لاحتياجاتك
            </p>
          </div>

          {/* Property Types Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto">
            {[
              { icon: FaHome, label: 'شقق', count: stats.apartment, color: 'bg-blue-500', hoverColor: 'group-hover:bg-blue-600', href: '/properties?propertyType=apartment' },
              { icon: FaBuilding, label: 'فلل', count: stats.villa, color: 'bg-emerald-500', hoverColor: 'group-hover:bg-emerald-600', href: '/properties?propertyType=villa' },
              { icon: FaLandmark, label: 'أراضي', count: stats.land, color: 'bg-amber-500', hoverColor: 'group-hover:bg-amber-600', href: '/properties?propertyType=land' },
              { icon: FaBuilding, label: 'عمارات', count: stats.building, color: 'bg-purple-500', hoverColor: 'group-hover:bg-purple-600', href: '/properties?propertyType=building' },
            ].map((type, index) => (
              <Link
                key={index}
                href={type.href}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center 
                           hover:shadow-xl transition-all duration-300 group
                           border border-gray-100 hover:border-transparent"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${type.color} ${type.hoverColor}
                                rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 
                                group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <type.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
                  {type.label}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                  {type.count} عقار
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== Featured Properties Section ===================== */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
                {featuredProperties.some((p: any) => p.featured) ? 'عقارات مميزة' : 'أحدث العقارات'}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                أفضل العقارات المختارة لك
              </p>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 
                         border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white 
                         rounded-lg sm:rounded-xl font-medium transition-all duration-200
                         text-sm sm:text-base w-full sm:w-auto"
            >
              <span>عرض الكل</span>
              <FaArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Properties Grid or Empty State */}
          {featuredProperties.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl sm:rounded-2xl">
              <FaBuilding className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                لا توجد عقارات حالياً
              </h3>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">
                كن أول من يضيف عقار!
              </p>
              <Link
                href="/add-property"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 
                           text-white rounded-xl font-medium transition-colors text-sm sm:text-base"
              >
                إضافة عقار جديد
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredProperties.map((property: any) => (
                <article 
                  key={property._id} 
                  className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl 
                             transition-all duration-300 group overflow-hidden
                             border border-gray-100"
                >
                  {/* Property Image */}
                  <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                    <Image
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                      alt={property.titleAr || property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    
                    {/* Badges Container */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2">
                      <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold text-white
                                      ${property.listingType === 'sale' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                        {property.listingType === 'sale' ? 'للبيع' : 'للإيجار'}
                      </span>
                      <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-white/95 text-gray-700 shadow-sm">
                        {propertyTypeLabels[property.propertyType] || property.propertyType}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {property.featured && (
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                        <span className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-amber-500 text-white">
                          <FaStar className="w-3 h-3" />
                          <span className="hidden xs:inline">مميز</span>
                        </span>
                      </div>
                    )}

                    {/* Image Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Property Content */}
                  <div className="p-4 sm:p-5">
                    {/* Price */}
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-2">
                      {formatPrice(property.price, property.listingType)}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                      {property.titleAr || property.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <FaMapMarkerAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">
                        {property.location?.district}، {property.location?.city}
                      </span>
                    </div>

                    {/* Features Row */}
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                      {property.features?.bedrooms && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                          <FaBed className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <span className="text-xs sm:text-sm">{property.features.bedrooms} غرف</span>
                        </div>
                      )}
                      {property.features?.bathrooms && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                          <FaBath className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <span className="text-xs sm:text-sm">{property.features.bathrooms} حمام</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                        <FaRulerCombined className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <span className="text-xs sm:text-sm">{property.features?.area} م²</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Link
                      href={`/properties/${property._id}`}
                      className="mt-4 block w-full text-center py-2.5 sm:py-3 
                                 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                                 text-white rounded-lg sm:rounded-xl font-medium 
                                 transition-all duration-200 text-sm sm:text-base"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================== Why Choose Us Section ===================== */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              لماذا تختارنا؟
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              نقدم لك أفضل تجربة في البحث عن العقارات
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
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
                className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 
                           text-center text-white hover:bg-white/20 transition-all duration-300
                           border border-white/10"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl 
                                flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA Section ===================== */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            هل لديك عقار للبيع أو الإيجار؟
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            انضم إلى آلاف الملاك والوكلاء العقاريين وابدأ في عرض عقاراتك للملايين من الباحثين
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-lg mx-auto">
            <Link
              href="/add-property"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-700 
                         text-white rounded-xl font-medium text-base sm:text-lg 
                         transition-all duration-200 shadow-lg shadow-emerald-600/30
                         hover:shadow-xl hover:shadow-emerald-600/40"
            >
              أضف عقارك مجاناً
            </Link>
            <Link
              href="/contact"
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 hover:border-white 
                         hover:bg-white/10 text-white rounded-xl font-medium text-base sm:text-lg 
                         transition-all duration-200"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}