'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import {
  FaSave,
  FaArrowRight,
  FaImage,
  FaTrash,
  FaHome,
  FaMapMarkerAlt,
  FaDollarSign,
  FaRulerCombined,
  FaCar,
  FaSwimmingPool,
  FaWifi,
  FaDumbbell,
  FaShieldAlt,
  FaTree,
  FaUtensils,
  FaBuilding, // استبدلنا FaElevator بـ FaBuilding
  FaSpinner,
  FaUpload,
  FaCheck,
} from 'react-icons/fa';

// Property interface
interface Property {
  _id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  propertyType: 'apartment' | 'villa' | 'land' | 'building' | 'office';
  listingType: 'sale' | 'rent';
  price: number;
  location: {
    address: string;
    addressAr: string;
    city: string;
    district: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: {
    area: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpaces?: number;
    yearBuilt?: number;
    furnished?: boolean;
  };
  amenities: string[];
  images: string[];
  virtualTour?: string;
  status: 'active' | 'pending' | 'sold' | 'rented';
  featured: boolean;
  views: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Demo data for testing
const demoProperty: Property = {
  _id: '1',
  title: 'Luxury Villa in Al Nargis',
  titleAr: 'فيلا فاخرة في حي النرجس',
  description: 'Beautiful luxury villa with modern design and premium finishes',
  descriptionAr: 'فيلا فاخرة جميلة بتصميم عصري وتشطيبات راقية',
  propertyType: 'villa',
  listingType: 'sale',
  price: 2500000,
  location: {
    address: 'Al Nargis District, North Riyadh',
    addressAr: 'حي النرجس، شمال الرياض',
    city: 'الرياض',
    district: 'النرجس',
    coordinates: {
      lat: 24.7136,
      lng: 46.6753,
    },
  },
  features: {
    area: 450,
    bedrooms: 5,
    bathrooms: 4,
    parkingSpaces: 2,
    yearBuilt: 2020,
    furnished: false,
  },
  amenities: ['pool', 'gym', 'garden', 'security', 'elevator', 'maid'],
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  ],
  virtualTour: 'https://example.com/tour',
  status: 'active',
  featured: true,
  views: 1250,
  createdBy: 'admin',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
};

const amenitiesList = [
  { id: 'pool', label: 'مسبح', icon: FaSwimmingPool },
  { id: 'gym', label: 'صالة رياضية', icon: FaDumbbell },
  { id: 'garden', label: 'حديقة', icon: FaTree },
  { id: 'security', label: 'أمن', icon: FaShieldAlt },
  { id: 'elevator', label: 'مصعد', icon: FaBuilding }, // استخدمنا FaBuilding بدلاً من FaElevator
  { id: 'parking', label: 'موقف سيارات', icon: FaCar },
  { id: 'wifi', label: 'واي فاي', icon: FaWifi },
  { id: 'kitchen', label: 'مطبخ مجهز', icon: FaUtensils },
  { id: 'maid', label: 'غرفة خادمة', icon: FaHome },
];

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<Property>(demoProperty);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In real app, fetch property by ID
        setProperty({ ...demoProperty, _id: propertyId });
      } catch (error) {
        console.error('Error loading property:', error);
        toast.error('فشل تحميل بيانات العقار');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('تم حفظ التغييرات بنجاح');
      router.push('/admin/properties');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('فشل حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      // Simulate image upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new images to property
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setProperty(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      
      toast.success('تم رفع الصور بنجاح');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('فشل رفع الصور');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle image deletion
  const handleDeleteImage = (index: number) => {
    setProperty(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.success('تم حذف الصورة');
  };

  // Handle amenity toggle
  const toggleAmenity = (amenityId: string) => {
    setProperty(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <FaArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">تحرير العقار</h1>
              <p className="text-gray-500 text-sm mt-1">معرف العقار: {propertyId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              property.status === 'active'
                ? 'bg-green-100 text-green-800'
                : property.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {property.status === 'active' && 'نشط'}
              {property.status === 'pending' && 'قيد المراجعة'}
              {property.status === 'sold' && 'مباع'}
              {property.status === 'rented' && 'مؤجر'}
            </span>
            {property.featured && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                مميز
              </span>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">المشاهدات</p>
            <p className="text-2xl font-bold text-gray-800">{property.views.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">تاريخ الإضافة</p>
            <p className="text-lg font-medium text-gray-800">
              {new Date(property.createdAt).toLocaleDateString('ar-SA')}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">آخر تحديث</p>
            <p className="text-lg font-medium text-gray-800">
              {new Date(property.updatedAt).toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaHome className="text-emerald-600" />
            المعلومات الأساسية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title English */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان (English)
              </label>
              <input
                type="text"
                value={property.title}
                onChange={(e) => setProperty({ ...property, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                dir="ltr"
                required
              />
            </div>

            {/* Title Arabic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان (عربي)
              </label>
              <input
                type="text"
                value={property.titleAr}
                onChange={(e) => setProperty({ ...property, titleAr: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع العقار
              </label>
              <select
                value={property.propertyType}
                onChange={(e) => setProperty({ ...property, propertyType: e.target.value as Property['propertyType'] })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
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
                نوع العرض
              </label>
              <select
                value={property.listingType}
                onChange={(e) => setProperty({ ...property, listingType: e.target.value as Property['listingType'] })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              >
                <option value="sale">للبيع</option>
                <option value="rent">للإيجار</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السعر (ريال)
              </label>
              <div className="relative">
                <FaDollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={property.price}
                  onChange={(e) => setProperty({ ...property, price: parseInt(e.target.value) || 0 })}
                  className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة
              </label>
              <select
                value={property.status}
                onChange={(e) => setProperty({ ...property, status: e.target.value as Property['status'] })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="active">نشط</option>
                <option value="pending">قيد المراجعة</option>
                <option value="sold">مباع</option>
                <option value="rented">مؤجر</option>
              </select>
            </div>
          </div>

          {/* Description English */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف (English)
            </label>
            <textarea
              value={property.description}
              onChange={(e) => setProperty({ ...property, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none h-32"
              dir="ltr"
              required
            />
          </div>

          {/* Description Arabic */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف (عربي)
            </label>
            <textarea
              value={property.descriptionAr}
              onChange={(e) => setProperty({ ...property, descriptionAr: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none h-32"
              required
            />
          </div>

          {/* Featured */}
          <div className="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={property.featured}
              onChange={(e) => setProperty({ ...property, featured: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              عقار مميز
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaMapMarkerAlt className="text-emerald-600" />
            الموقع
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدينة
              </label>
              <input
                type="text"
                value={property.location.city}
                onChange={(e) => setProperty({
                  ...property,
                  location: { ...property.location, city: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحي
              </label>
              <input
                type="text"
                value={property.location.district}
                onChange={(e) => setProperty({
                  ...property,
                  location: { ...property.location, district: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان (English)
              </label>
              <input
                type="text"
                value={property.location.address}
                onChange={(e) => setProperty({
                  ...property,
                  location: { ...property.location, address: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان (عربي)
              </label>
              <input
                type="text"
                value={property.location.addressAr}
                onChange={(e) => setProperty({
                  ...property,
                  location: { ...property.location, addressAr: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaRulerCombined className="text-emerald-600" />
            المواصفات
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المساحة (م²)
              </label>
              <input
                type="number"
                value={property.features.area}
                onChange={(e) => setProperty({
                  ...property,
                  features: { ...property.features, area: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            {property.propertyType !== 'land' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    غرف النوم
                  </label>
                  <input
                    type="number"
                    value={property.features.bedrooms || ''}
                    onChange={(e) => setProperty({
                      ...property,
                      features: { ...property.features, bedrooms: parseInt(e.target.value) || undefined }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحمامات
                  </label>
                  <input
                    type="number"
                    value={property.features.bathrooms || ''}
                    onChange={(e) => setProperty({
                      ...property,
                      features: { ...property.features, bathrooms: parseInt(e.target.value) || undefined }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مواقف السيارات
                  </label>
                  <input
                    type="number"
                    value={property.features.parkingSpaces || ''}
                    onChange={(e) => setProperty({
                      ...property,
                      features: { ...property.features, parkingSpaces: parseInt(e.target.value) || undefined }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنة البناء
                  </label>
                  <input
                    type="number"
                    value={property.features.yearBuilt || ''}
                    onChange={(e) => setProperty({
                      ...property,
                      features: { ...property.features, yearBuilt: parseInt(e.target.value) || undefined }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 mt-7">
                  <input
                    type="checkbox"
                    id="furnished"
                    checked={property.features.furnished || false}
                    onChange={(e) => setProperty({
                      ...property,
                      features: { ...property.features, furnished: e.target.checked }
                    })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="furnished" className="text-sm font-medium text-gray-700">
                    مؤثث
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Amenities */}
        {property.propertyType !== 'land' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">المميزات والمرافق</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    property.amenities.includes(amenity.id)
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <amenity.icon className="w-5 h-5" />
                  <span className="font-medium">{amenity.label}</span>
                  {property.amenities.includes(amenity.id) && (
                    <FaCheck className="w-4 h-4 mr-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaImage className="text-emerald-600" />
            الصور
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {property.images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`صورة ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
                {index === 0 && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded">
                    الرئيسية
                  </span>
                )}
              </div>
            ))}
            
            {/* Upload Button */}
            <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
              {uploadingImage ? (
                <FaSpinner className="w-6 h-6 text-emerald-600 animate-spin" />
              ) : (
                <>
                  <FaUpload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">رفع صور</span>
                </>
              )}
            </label>
          </div>

          {/* Virtual Tour */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط الجولة الافتراضية
            </label>
            <input
              type="url"
              value={property.virtualTour || ''}
              onChange={(e) => setProperty({ ...property, virtualTour: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="https://example.com/virtual-tour"
              dir="ltr"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {saving ? (
              <>
                <FaSpinner className="w-5 h-5 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <FaSave className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}