'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSpinner,
  FaHome,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Property {
  _id: string;
  titleAr: string;
  price: number;
  listingType: 'sale' | 'rent';
  propertyType: string;
  status: string;
  location: {
    city: string;
    district: string;
  };
  features: {
    area: number;
    bedrooms?: number;
  };
  images: string[];
  views: number;
  createdAt: string;
}

export default function MyPropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: authStatus } = useSession();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProperties = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      let url = `/api/properties?owner=${session.user.id}`;
      
      if (activeTab === 'drafts') {
        url += '&status=draft';
      } else if (activeTab === 'active') {
        url += '&status=available';
      } else if (activeTab === 'sold') {
        url += '&status=sold,rented';
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setProperties(data.data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [session, activeTab]);

  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user?.id) {
      fetchProperties();
    }
  }, [authStatus, session, fetchProperties]);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        toast.success('تم حذف العقار بنجاح');
        setProperties((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(data.message || 'حدث خطأ في الحذف');
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setDeleting(false);
      setDeleteModal(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            <FaCheckCircle className="w-3 h-3" />
            نشط
          </span>
        );
      case 'draft':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            <FaClock className="w-3 h-3" />
            مسودة
          </span>
        );
      case 'sold':
      case 'rented':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <FaCheckCircle className="w-3 h-3" />
            {status === 'sold' ? 'تم البيع' : 'تم التأجير'}
          </span>
        );
      default:
        return null;
    }
  };

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push('/auth/login?callbackUrl=/my-properties');
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">عقاراتي</h1>
            <p className="text-gray-500 mt-1">إدارة العقارات المضافة</p>
          </div>
          <Link
            href="/add-property"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            <FaPlus />
            <span>إضافة عقار</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'active', label: 'النشطة' },
            { id: 'drafts', label: 'المسودات' },
            { id: 'sold', label: 'المباعة/المؤجرة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Properties List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <FaHome className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد عقارات
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'drafts'
                ? 'لا توجد مسودات محفوظة'
                : 'لم تقم بإضافة أي عقارات بعد'}
            </p>
            <Link
              href="/add-property"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              <FaPlus />
              <span>أضف عقارك الأول</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                    <Image
                      src={property.images[0] || '/images/placeholder.jpg'}
                      alt={property.titleAr}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(property.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {property.titleAr}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          {property.location.district}، {property.location.city}
                        </p>
                        <p className="text-emerald-600 font-bold text-lg">
                          {property.price.toLocaleString('ar-SA')} ريال
                          {property.listingType === 'rent' && (
                            <span className="text-sm text-gray-500 font-normal">/شهرياً</span>
                          )}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="text-left">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <FaEye className="w-4 h-4" />
                          <span>{property.views} مشاهدة</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(property.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
                      <span>{property.features.area} م²</span>
                      {property.features.bedrooms && (
                        <span>{property.features.bedrooms} غرف</span>
                      )}
                      <span className="px-2 py-0.5 bg-gray-100 rounded">
                        {property.listingType === 'sale' ? 'للبيع' : 'للإيجار'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <Link
                        href={`/properties/${property._id}`}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>عرض</span>
                      </Link>
                      <Link
                        href={`/edit-property/${property._id}`}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaEdit className="w-4 h-4" />
                        <span>تعديل</span>
                      </Link>
                      <button
                        onClick={() => setDeleteModal(property._id)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">حذف العقار</h3>
                <p className="text-gray-600 mb-6">
                  هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal(null)}
                    disabled={deleting}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => handleDelete(deleteModal)}
                    disabled={deleting}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <FaSpinner className="w-4 h-4 animate-spin" />
                        <span>جاري الحذف...</span>
                      </>
                    ) : (
                      <span>نعم، احذف</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}