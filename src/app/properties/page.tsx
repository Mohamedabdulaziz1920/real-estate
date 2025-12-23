'use client';

// 1. إضافة useCallback
import { useState, useEffect, useCallback } from 'react';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilter from '@/components/properties/PropertyFilter';
import { IProperty, PropertyFilters } from '@/types';
import { FaSpinner, FaSort } from 'react-icons/fa';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<PropertyFilters>({});

  // 2. استخدام useCallback لتثبيت الدالة
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
      
      // Add pagination and sorting
      params.append('page', String(pagination.page));
      params.append('limit', String(pagination.limit));
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProperties(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit, sortBy, sortOrder]); // إضافة الاعتماديات التي تستخدمها الدالة

  // 3. تحديث useEffect للاعتماد على fetchProperties
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilter = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [field, order] = value.split('-');
    setSortBy(field);
    setSortOrder(order as 'asc' | 'desc');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            تصفح العقارات
          </h1>
          <p className="text-gray-600">
            {pagination.total} عقار متاح
          </p>
        </div>

        {/* Filter */}
        <PropertyFilter onFilter={handleFilter} initialFilters={filters} />

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <FaSort className="text-gray-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSort}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="createdAt-desc">الأحدث أولاً</option>
              <option value="createdAt-asc">الأقدم أولاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="features.area-asc">المساحة: من الأصغر للأكبر</option>
              <option value="features.area-desc">المساحة: من الأكبر للأصغر</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد عقارات مطابقة
            </h3>
            <p className="text-gray-500">
              حاول تعديل معايير البحث
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPagination((prev) => ({ ...prev, page }))}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  pagination.page === page
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </main>
  );
}