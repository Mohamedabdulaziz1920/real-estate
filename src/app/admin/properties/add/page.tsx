'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FaSave, 
  FaTimes, 
  FaUpload, 
  FaTrash,
  FaSpinner,
  FaMapMarkerAlt
} from 'react-icons/fa';

interface PropertyForm {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  propertyType: string;
  listingType: string;
  status: string;
  location: {
    city: string;
    district: string;
    address: string;
  };
  features: {
    area: number;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    yearBuilt: number;
    furnished: boolean;
    parking: boolean;
    garden: boolean;
    pool: boolean;
    elevator: boolean;
    security: boolean;
    airConditioning: boolean;
  };
  images: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
  };
  featured: boolean;
}

const initialForm: PropertyForm = {
  title: '',
  titleAr: '',
  description: '',
  descriptionAr: '',
  price: 0,
  propertyType: 'apartment',
  listingType: 'sale',
  status: 'available',
  location: {
    city: '',
    district: '',
    address: '',
  },
  features: {
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    floors: 1,
    yearBuilt: new Date().getFullYear(),
    furnished: false,
    parking: false,
    garden: false,
    pool: false,
    elevator: false,
    security: false,
    airConditioning: false,
  },
  images: [],
  agent: {
    name: '',
    phone: '',
    email: '',
  },
  featured: false,
};

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
  'بريدة',
  'خميس مشيط',
  'حائل',
  'نجران',
  'جازان',
];

export default function AddPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState<PropertyForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PropertyForm] as object),
          [child]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
        },
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
      }));
    }

    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          newImages.push(data.url);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.titleAr) newErrors.titleAr = 'العنوان بالعربية مطلوب';
    if (!form.descriptionAr) newErrors.descriptionAr = 'الوصف بالعربية مطلوب';
    if (form.price <= 0) newErrors.price = 'السعر مطلوب';
    if (!form.location.city) newErrors['location.city'] = 'المدينة مطلوبة';
    if (!form.location.district) newErrors['location.district'] = 'الحي مطلوب';
    if (form.features.area <= 0) newErrors['features.area'] = 'المساحة مطلوبة';
    if (form.images.length === 0) newErrors.images = 'يجب إضافة صورة واحدة على الأقل';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      // Switch to tab with first error
      const firstError = Object.keys(errors)[0];
      if (firstError.includes('location') || firstError.includes('features')) {
        setActiveTab('details');
      } else if (firstError === 'images') {
        setActiveTab('media');
      } else {
        setActiveTab('basic');
      }
      return;
    }

    setLoading(true);
    try {
      // Set title from Arabic if not provided
      const submitForm = {
        ...form,
        title: form.title || form.titleAr,
        description: form.description || form.descriptionAr,
        owner: '507f1f77bcf86cd799439011', // Temporary - should come from auth
      };

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitForm),
      });

      const data = await res.json();
      
      if (data.success) {
        router.push('/admin/properties');
      } else {
        setErrors({ submit: data.error || 'حدث خطأ أثناء إضافة العقار' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'حدث خطأ أثناء إضافة العقار' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'المعلومات الأساسية' },
    { id: 'details', label: 'التفاصيل والموقع' },
    { id: 'features', label: 'المميزات' },
    { id: 'media', label: 'الصور' },
    { id: 'agent', label: 'معلومات الوكيل' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">إضافة عقار جديد</h1>
          <p className="text-gray-500">أضف تفاصيل العقار الجديد</p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <FaTimes />
          <span>إلغاء</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm mb-6">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">المعلومات الأساسية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Arabic */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان بالعربية <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="titleAr"
                  value={form.titleAr}
                  onChange={handleChange}
                  placeholder="مثال: شقة فاخرة للبيع في حي النرجس"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.titleAr ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                />
                {errors.titleAr && (
                  <p className="text-red-500 text-sm mt-1">{errors.titleAr}</p>
                )}
              </div>

              {/* Title English */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان بالإنجليزية (اختياري)
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Luxury apartment for sale in Al Narjis"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  dir="ltr"
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع العقار <span className="text-red-500">*</span>
                </label>
                <select
                  name="propertyType"
                  value={form.propertyType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="apartment">شقة</option>
                  <option value="villa">فيلا</option>
                  <option value="land">أرض</option>
                  <option value="building">عمارة</option>
                  <option value="office">مكتب</option>
                </select>
              </div>

              {/* Listing Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الإعلان <span className="text-red-500">*</span>
                </label>
                <select
                  name="listingType"
                  value={form.listingType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="sale">للبيع</option>
                  <option value="rent">للإيجار</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر (ريال) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price || ''}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.price ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="available">متاح</option>
                  <option value="pending">قيد المراجعة</option>
                  <option value="sold">مباع</option>
                  <option value="rented">مؤجر</option>
                </select>
              </div>

              {/* Description Arabic */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف بالعربية <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="descriptionAr"
                  value={form.descriptionAr}
                  onChange={handleChange}
                  rows={5}
                  placeholder="أدخل وصفاً تفصيلياً للعقار..."
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.descriptionAr ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none`}
                />
                {errors.descriptionAr && (
                  <p className="text-red-500 text-sm mt-1">{errors.descriptionAr}</p>
                )}
              </div>

              {/* Featured */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">عقار مميز</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Details & Location Tab */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">التفاصيل والموقع</h2>
            
            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-500" />
                الموقع
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="location.city"
                    value={form.location.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors['location.city'] ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  >
                    <option value="">اختر المدينة</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors['location.city'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['location.city']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحي <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location.district"
                    value={form.location.district}
                    onChange={handleChange}
                    placeholder="مثال: حي النرجس"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors['location.district'] ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  />
                  {errors['location.district'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['location.district']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان التفصيلي
                  </label>
                  <input
                    type="text"
                    name="location.address"
                    value={form.location.address}
                    onChange={handleChange}
                    placeholder="مثال: شارع الملك فهد"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-700">تفاصيل العقار</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المساحة (م²) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="features.area"
                    value={form.features.area || ''}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors['features.area'] ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  />
                  {errors['features.area'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['features.area']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الغرف
                  </label>
                  <input
                    type="number"
                    name="features.bedrooms"
                    value={form.features.bedrooms || ''}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الحمامات
                  </label>
                  <input
                    type="number"
                    name="features.bathrooms"
                    value={form.features.bathrooms || ''}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الطوابق
                  </label>
                  <input
                    type="number"
                    name="features.floors"
                    value={form.features.floors || ''}
                    onChange={handleChange}
                    placeholder="1"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنة البناء
                  </label>
                  <input
                    type="number"
                    name="features.yearBuilt"
                    value={form.features.yearBuilt || ''}
                    onChange={handleChange}
                    placeholder={new Date().getFullYear().toString()}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">المميزات</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'features.furnished', label: 'مفروش' },
                { name: 'features.parking', label: 'موقف سيارات' },
                { name: 'features.garden', label: 'حديقة' },
                { name: 'features.pool', label: 'مسبح' },
                { name: 'features.elevator', label: 'مصعد' },
                { name: 'features.security', label: 'حراسة أمنية' },
                { name: 'features.airConditioning', label: 'تكييف مركزي' },
              ].map((feature) => (
                <label
                  key={feature.name}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors"
                >
                  <input
                    type="checkbox"
                    name={feature.name}
                    checked={(form.features as any)[feature.name.split('.')[1]]}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">{feature.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">الصور</h2>
            
            {/* Upload Area */}
            <div className="mb-6">
              <label
                htmlFor="images"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                  errors.images ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-500 bg-gray-50 hover:bg-emerald-50'
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <FaSpinner className="w-10 h-10 text-emerald-500 animate-spin mb-2" />
                    <span className="text-gray-500">جاري الرفع...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FaUpload className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-gray-500">اضغط لرفع الصور أو اسحبها هنا</span>
                    <span className="text-sm text-gray-400 mt-1">PNG, JPG حتى 5MB</span>
                  </div>
                )}
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {errors.images && (
                <p className="text-red-500 text-sm mt-2">{errors.images}</p>
              )}
            </div>

            {/* Images Grid */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {form.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={image}
                        alt={`Property image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 right-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-lg">
                        الرئيسية
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Demo Images for Testing */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500 mb-4">أو اختر صور تجريبية:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
                  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
                ].map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setForm(prev => ({
                      ...prev,
                      images: [...prev.images, url],
                    }))}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-emerald-500 transition-colors"
                  >
                    <Image
                      src={url}
                      alt={`Demo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Agent Tab */}
        {activeTab === 'agent' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">معلومات الوكيل</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الوكيل
                </label>
                <input
                  type="text"
                  name="agent.name"
                  value={form.agent.name}
                  onChange={handleChange}
                  placeholder="مثال: أحمد محمد"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="agent.phone"
                  value={form.agent.phone}
                  onChange={handleChange}
                  placeholder="05xxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="agent.email"
                  value={form.agent.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl mt-6">
            {errors.submit}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>حفظ العقار</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}