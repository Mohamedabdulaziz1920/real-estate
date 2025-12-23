'use client';

// 1. إضافة useCallback إلى الاستيراد
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaSpinner,
  FaStar,
  FaSearch,
  FaFilter,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

interface Property {
  _id: string;
  titleAr: string;
  price: number;
  propertyType: string;
  listingType: string;
  status: string;
  featured: boolean;
  views: number;
  images: string[];
  location: {
    city: string;
    district: string;
  };
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  // 2. تغليف الدالة بـ useCallback وإضافة الاعتماديات (Dependencies)
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('propertyType', typeFilter);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      
      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProperties(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter, pagination.page, pagination.limit]);

  // 3. تحديث مصفوفة الاعتماديات في useEffect
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العقار؟')) return;
    
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProperties(properties.filter(p => p._id !== id));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`هل أنت متأكد من حذف ${selectedProperties.length} عقار؟`)) return;
    
    try {
      await Promise.all(
        selectedProperties.map(id =>
          fetch(`/api/properties/${id}`, { method: 'DELETE' })
        )
      );
      setProperties(properties.filter(p => !selectedProperties.includes(p._id)));
      setSelectedProperties([]);
      fetchProperties(); // يتم استدعاؤها هنا أيضاً
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties(properties.map(p => 
          p._id === id ? { ...p, featured: !featured } : p
        ));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties(properties.map(p => 
          p._id === id ? { ...p, status } : p
        ));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleSelectProperty = (id: string) => {
    setSelectedProperties(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map(p => p._id));
    }
  };

  const propertyTypeLabels: Record<string, string> = {
    apartment: 'شقة',
    villa: 'فيلا',
    land: 'أرض',
    building: 'عمارة',
    office: 'مكتب',
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    available: { label: 'متاح', color: 'bg-green-100 text-green-700' },
    sold: { label: 'مباع', color: 'bg-red-100 text-red-700' },
    rented: { label: 'مؤجر', color: 'bg-blue-100 text-blue-700' },
    pending: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700' },
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">إدارة العقارات</h1>
          <p className="text-gray-500">{pagination.total} عقار</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <FaFileExport />
            <span>تصدير</span>
          </button>
          <Link
            href="/admin/properties/add"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            <FaPlus />
            <span>إضافة عقار</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في العقارات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-12 pl-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">جميع الحالات</option>
            <option value="available">متاح</option>
            <option value="sold">مباع</option>
            <option value="rented">مؤجر</option>
            <option value="pending">قيد المراجعة</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">جميع الأنواع</option>
            <option value="apartment">شقة</option>
            <option value="villa">فيلا</option>
            <option value="land">أرض</option>
            <option value="building">عمارة</option>
            <option value="office">مكتب</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedProperties.length > 0 && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <span className="text-gray-600">
              تم تحديد {selectedProperties.length} عقار
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <FaTrash />
              <span>حذف المحدد</span>
            </button>
          </div>
        )}
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">لا توجد عقارات</p>
            <Link
              href="/admin/properties/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl"
            >
              <FaPlus />
              <span>إضافة عقار</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-right px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProperties.length === properties.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">العقار</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">النوع</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">السعر</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">الحالة</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">المشاهدات</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">التاريخ</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {properties.map((property) => (
                    <tr key={property._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProperties.includes(property._id)}
                          onChange={() => toggleSelectProperty(property._id)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200'}
                              alt={property.titleAr}
                              fill
                              className="object-cover"
                            />
                            {property.featured && (
                              <div className="absolute top-1 right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                <FaStar className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-gray-800 truncate max-w-[200px]">
                              {property.titleAr}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {property.location.district}، {property.location.city}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-800">
                            {propertyTypeLabels[property.propertyType]}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full w-fit ${
                            property.listingType === 'sale' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {property.listingType === 'sale' ? 'للبيع' : 'للإيجار'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-600">
                          {property.price.toLocaleString('ar-SA')} ريال
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={property.status}
                          onChange={(e) => updateStatus(property._id, e.target.value)}
                          className={`text-xs px-3 py-1.5 rounded-full border-0 cursor-pointer ${
                            statusLabels[property.status]?.color || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <option value="available">متاح</option>
                          <option value="sold">مباع</option>
                          <option value="rented">مؤجر</option>
                          <option value="pending">قيد المراجعة</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <FaEye />
                          <span>{property.views}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {formatDate(property.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFeatured(property._id, property.featured)}
                            className={`p-2 rounded-lg transition-colors ${
                              property.featured 
                                ? 'bg-amber-100 text-amber-600' 
                                : 'bg-gray-100 text-gray-400 hover:text-amber-600'
                            }`}
                            title={property.featured ? 'إزالة من المميز' : 'إضافة للمميز'}
                          >
                            <FaStar />
                          </button>
                          <Link
                            href={`/properties/${property._id}`}
                            target="_blank"
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="معاينة"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            href={`/admin/properties/${property._id}/edit`}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="تعديل"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(property._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="حذف"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-500">
                  عرض {(pagination.page - 1) * pagination.limit + 1} إلى{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} من{' '}
                  {pagination.total} عقار
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight />
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-emerald-600 text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}