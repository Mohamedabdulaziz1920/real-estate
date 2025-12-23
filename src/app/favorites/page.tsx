'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/contexts/FavoritesContext';
import PropertyCard from '@/components/properties/PropertyCard';
import {
  FaHeart,
  FaSpinner,
  FaTrash,
  FaHome,
  FaSignInAlt,
  FaExclamationCircle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Property {
  _id: string;
  titleAr: string;
  price: number;
  listingType: 'sale' | 'rent';
  propertyType: string;
  location: {
    city: string;
    district: string;
  };
  features: {
    area: number;
    bedrooms?: number;
    bathrooms?: number;
  };
  images: string[];
  views: number;
  featured: boolean;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const { favorites, removeFavorite, isLoading: favoritesLoading } = useFavorites();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [clearingAll, setClearingAll] = useState(false);

  useEffect(() => {
    const fetchFavoriteProperties = async () => {
      if (favoritesLoading) return;
      
      setLoading(true);

      if (favorites.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        // جلب تفاصيل العقارات
        const propertyPromises = favorites.map(async (id) => {
          try {
            const res = await fetch(`/api/properties/${id}`);
            const data = await res.json();
            return data.success ? data.data : null;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(propertyPromises);
        setProperties(results.filter(Boolean));
      } catch (error) {
        console.error('Error fetching favorite properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProperties();
  }, [favorites, favoritesLoading]);

  const handleRemove = async (propertyId: string) => {
    await removeFavorite(propertyId);
    setProperties(prev => prev.filter(p => p._id !== propertyId));
  };

  const handleClearAll = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع العقارات من المفضلة؟')) return;
    
    setClearingAll(true);
    
    try {
      for (const property of properties) {
        await removeFavorite(property._id);
      }
      setProperties([]);
      toast.success('تم مسح المفضلة');
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setClearingAll(false);
    }
  };

  // شاشة التحميل
  if (authStatus === 'loading' || favoritesLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل المفضلة...</p>
        </div>
      </main>
    );
  }

  // رسالة للزوار غير المسجلين
  const showGuestMessage = !session && favorites.length > 0;

  return (
    <main className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaHeart className="text-red-500" />
              المفضلة
            </h1>
            <p className="text-gray-500 mt-1">
              {properties.length} عقار محفوظ
            </p>
          </div>

          {properties.length > 0 && (
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  شبكة
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  قائمة
                </button>
              </div>

              {/* Clear All Button */}
              <button
                onClick={handleClearAll}
                disabled={clearingAll}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                {clearingAll ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <FaTrash className="w-4 h-4" />
                )}
                <span>مسح الكل</span>
              </button>
            </div>
          )}
        </div>

        {/* Guest Warning */}
        {showGuestMessage && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <FaExclamationCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium">المفضلة محفوظة مؤقتاً</p>
              <p className="text-amber-700 text-sm mt-1">
                سجل دخولك لحفظ المفضلة بشكل دائم ومزامنتها على جميع أجهزتك
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-amber-800 hover:text-amber-900"
              >
                <FaSignInAlt />
                تسجيل الدخول
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              لا توجد عقارات في المفضلة
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              ابدأ بتصفح العقارات وأضف ما يعجبك إلى المفضلة للوصول إليها بسهولة لاحقاً
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              <FaHome />
              <span>تصفح العقارات</span>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property as any} />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0">
                    <Link href={`/properties/${property._id}`}>
                      <Image
                        src={property.images?.[0] || '/images/placeholder.jpg'}
                        alt={property.titleAr}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                        property.listingType === 'sale' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}>
                        {property.listingType === 'sale' ? 'للبيع' : 'للإيجار'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link href={`/properties/${property._id}`}>
                          <h3 className="text-lg font-semibold text-gray-800 hover:text-emerald-600 transition-colors mb-2">
                            {property.titleAr}
                          </h3>
                        </Link>
                        <p className="text-gray-500 text-sm mb-3">
                          {property.location.district}، {property.location.city}
                        </p>
                        <p className="text-xl font-bold text-emerald-600">
                          {property.price.toLocaleString('ar-SA')} ريال
                          {property.listingType === 'rent' && (
                            <span className="text-sm text-gray-500 font-normal">/شهرياً</span>
                          )}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(property._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="إزالة من المفضلة"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
                      <span>{property.features.area} م²</span>
                      {property.features.bedrooms && (
                        <span>{property.features.bedrooms} غرف نوم</span>
                      )}
                      {property.features.bathrooms && (
                        <span>{property.features.bathrooms} حمام</span>
                      )}
                    </div>

                    {/* Action */}
                    <div className="mt-4">
                      <Link
                        href={`/properties/${property._id}`}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                      >
                        عرض التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Login CTA for guests */}
        {!session && properties.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">احفظ مفضلتك للأبد!</h3>
            <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
              سجل دخولك الآن لحفظ المفضلة بشكل دائم ومزامنتها على جميع أجهزتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="px-8 py-3 bg-white text-emerald-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/auth/register"
                className="px-8 py-3 bg-emerald-800 text-white rounded-xl font-medium hover:bg-emerald-900 transition-colors"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}