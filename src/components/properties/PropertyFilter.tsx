'use client';

import { useState } from 'react';
import { PropertyFilters } from '@/types';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

interface PropertyFilterProps {
  onFilter: (filters: PropertyFilters) => void;
  initialFilters?: PropertyFilters;
}

const cities = [
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام',
  'الخبر',
  'الظهران',
  'أبها',
  'تبوك',
  'الطائف',
];

export default function PropertyFilter({ onFilter, initialFilters }: PropertyFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters || {});

  const handleChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Quick Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Property Type */}
        <div className="flex gap-2">
          {[
            { value: 'apartment', label: 'شقة' },
            { value: 'villa', label: 'فيلا' },
            { value: 'land', label: 'أرض' },
            { value: 'building', label: 'عمارة' },
            { value: 'office', label: 'مكتب' },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => handleChange('propertyType', 
                filters.propertyType === type.value ? undefined : type.value
              )}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filters.propertyType === type.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Listing Type */}
        <div className="flex gap-2">
          <button
            onClick={() => handleChange('listingType',
              filters.listingType === 'sale' ? undefined : 'sale'
            )}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filters.listingType === 'sale'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            للبيع
          </button>
          <button
            onClick={() => handleChange('listingType',
              filters.listingType === 'rent' ? undefined : 'rent'
            )}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filters.listingType === 'rent'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            للإيجار
          </button>
        </div>

        {/* More Filters Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors mr-auto"
        >
          <FaFilter />
          <span>فلاتر متقدمة</span>
        </button>
      </div>

      {/* Advanced Filters */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدينة
              </label>
              <select
                value={filters.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">جميع المدن</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السعر من
              </label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', parseInt(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السعر إلى
              </label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', parseInt(e.target.value))}
                placeholder="غير محدد"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عدد الغرف
              </label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleChange('bedrooms', parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">أي عدد</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} غرف
                  </option>
                ))}
              </select>
            </div>

            {/* Min Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المساحة من (م²)
              </label>
              <input
                type="number"
                value={filters.minArea || ''}
                onChange={(e) => handleChange('minArea', parseInt(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Max Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المساحة إلى (م²)
              </label>
              <input
                type="number"
                value={filters.maxArea || ''}
                onChange={(e) => handleChange('maxArea', parseInt(e.target.value))}
                placeholder="غير محدد"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عدد الحمامات
              </label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => handleChange('bathrooms', parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">أي عدد</option>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} حمامات
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 pt-6 border-t">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
            >
              <FaSearch />
              <span>بحث</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              <FaTimes />
              <span>إعادة تعيين</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}