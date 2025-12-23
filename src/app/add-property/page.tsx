// app/add-property/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import FormSteps from '@/components/properties/FormSteps';
import ImageUploader from '@/components/properties/ImageUploader';
import {
  FaMapMarkerAlt,
  FaArrowRight,
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaBuilding,
  FaCalendarAlt,
  FaParking,
  FaSwimmingPool,
  FaTree,
  FaSnowflake,
  FaShieldAlt,
  FaCouch,
  FaCheck,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// ✅ تحميل LocationPicker بشكل ديناميكي (بدون SSR)
const LocationPicker = dynamic(
  () => import('@/components/maps/LocationPicker'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[350px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-500">جاري تحميل الخريطة...</p>
        </div>
      </div>
    )
  }
);

const steps = [
  { id: 1, title: 'نوع العقار', icon: '🏠' },
  { id: 2, title: 'الموقع', icon: '📍' },
  { id: 3, title: 'التفاصيل', icon: '📋' },
  { id: 4, title: 'الصور', icon: '📸' },
  { id: 5, title: 'المعاينة', icon: '👁️' },
];

const propertyTypes = [
  { value: 'apartment', label: 'شقة', icon: '🏢', description: 'شقة سكنية في عمارة' },
  { value: 'villa', label: 'فيلا', icon: '🏡', description: 'فيلا مستقلة أو دوبلكس' },
  { value: 'land', label: 'أرض', icon: '🌍', description: 'أرض سكنية أو تجارية' },
  { value: 'building', label: 'عمارة', icon: '🏛️', description: 'عمارة سكنية أو تجارية' },
  { value: 'office', label: 'مكتب', icon: '🏬', description: 'مكتب تجاري' },
];

const cities = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة',
  'الدمام', 'الخبر', 'الظهران', 'أبها', 'تبوك', 'الطائف',
  'القطيف', 'الجبيل', 'حائل', 'نجران', 'جازان',
];

const features = [
  { key: 'parking', label: 'موقف سيارات', icon: FaParking },
  { key: 'pool', label: 'مسبح', icon: FaSwimmingPool },
  { key: 'garden', label: 'حديقة', icon: FaTree },
  { key: 'airConditioning', label: 'تكييف مركزي', icon: FaSnowflake },
  { key: 'security', label: 'حراسة أمنية', icon: FaShieldAlt },
  { key: 'elevator', label: 'مصعد', icon: FaBuilding },
  { key: 'furnished', label: 'مفروش', icon: FaCouch },
];

interface FormData {
  propertyType: string;
  listingType: 'sale' | 'rent';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: string;
  location: {
    city: string;
    district: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: {
    area: string;
    bedrooms: string;
    bathrooms: string;
    floors: string;
    yearBuilt: string;
    parking: boolean;
    pool: boolean;
    garden: boolean;
    airConditioning: boolean;
    security: boolean;
    elevator: boolean;
    furnished: boolean;
  };
  images: string[];
}

const initialFormData: FormData = {
  propertyType: '',
  listingType: 'sale',
  title: '',
  titleAr: '',
  description: '',
  descriptionAr: '',
  price: '',
  location: {
    city: '',
    district: '',
    address: '',
    coordinates: undefined,
  },
  features: {
    area: '',
    bedrooms: '',
    bathrooms: '',
    floors: '',
    yearBuilt: '',
    parking: false,
    pool: false,
    garden: false,
    airConditioning: false,
    security: false,
    elevator: false,
    furnished: false,
  },
  images: [],
};

export default function AddPropertyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // التحقق من تسجيل الدخول
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push('/auth/login?callbackUrl=/add-property');
    return null;
  }

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateLocation = (updates: Partial<FormData['location']>) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, ...updates },
    }));
  };

  const updateFeatures = (updates: Partial<FormData['features']>) => {
    setFormData((prev) => ({
      ...prev,
      features: { ...prev.features, ...updates },
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.propertyType) {
          toast.error('يرجى اختيار نوع العقار');
          return false;
        }
        return true;

      case 2:
        if (!formData.location.city) {
          toast.error('يرجى اختيار المدينة');
          return false;
        }
        if (!formData.location.district) {
          toast.error('يرجى إدخال الحي');
          return false;
        }
        return true;

      case 3:
        if (!formData.titleAr) {
          toast.error('يرجى إدخال عنوان العقار');
          return false;
        }
        if (!formData.price || parseInt(formData.price) <= 0) {
          toast.error('يرجى إدخال السعر');
          return false;
        }
        if (!formData.features.area || parseInt(formData.features.area) <= 0) {
          toast.error('يرجى إدخال المساحة');
          return false;
        }
        return true;

      case 4:
        if (formData.images.length === 0) {
          toast.error('يرجى إضافة صورة واحدة على الأقل');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

const handleSubmit = async (isDraft: boolean = false) => {
  // التحقق من الخطوات
  if (!isDraft && !validateStep(4)) return;

  if (isDraft) {
    setSavingDraft(true);
  } else {
    setLoading(true);
  }

  try {
    const propertyData = {
      propertyType: formData.propertyType,
      listingType: formData.listingType,
      title: formData.titleAr,
      titleAr: formData.titleAr,
      description: formData.descriptionAr,
      descriptionAr: formData.descriptionAr,
      price: parseInt(formData.price) || 0,
      location: {
        city: formData.location.city,
        district: formData.location.district,
        address: formData.location.address || '',
        coordinates: formData.location.coordinates,
      },
      features: {
        area: parseInt(formData.features.area) || 0,
        bedrooms: formData.features.bedrooms ? parseInt(formData.features.bedrooms) : undefined,
        bathrooms: formData.features.bathrooms ? parseInt(formData.features.bathrooms) : undefined,
        floors: formData.features.floors ? parseInt(formData.features.floors) : undefined,
        yearBuilt: formData.features.yearBuilt ? parseInt(formData.features.yearBuilt) : undefined,
        parking: formData.features.parking,
        pool: formData.features.pool,
        garden: formData.features.garden,
        airConditioning: formData.features.airConditioning,
        security: formData.features.security,
        elevator: formData.features.elevator,
        furnished: formData.features.furnished,
      },
      images: formData.images,
      status: isDraft ? 'draft' : 'available',
    };

    console.log('Sending property data:', propertyData);

    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData),
    });

    // ✅ التحقق من الاستجابة
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `خطأ في الخادم: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response:', data);

    if (data.success) {
      toast.success(isDraft ? 'تم حفظ المسودة' : 'تم نشر العقار بنجاح!');
      
      // ✅ تصحيح: استخدام property بدلاً من data
      const propertyId = data.property?._id;
      
      if (isDraft) {
        router.push('/my-properties?tab=drafts');
      } else if (propertyId) {
        router.push(`/properties/${propertyId}`);
      } else {
        router.push('/my-properties');
      }
    } else {
      // ✅ تصحيح: استخدام error بدلاً من message
      toast.error(data.error || 'حدث خطأ');
    }
    
  } catch (error: any) {
    console.error('Submit error:', error);
    toast.error(error.message || 'حدث خطأ في الاتصال');
  } finally {
    setLoading(false);
    setSavingDraft(false);
  }
};

  const formatPrice = (price: string) => {
    const num = parseInt(price.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('ar-SA');
  };

  const getPropertyTypeLabel = (type: string) => {
    return propertyTypes.find((t) => t.value === type)?.label || type;
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-4"
          >
            <FaArrowRight />
            <span>العودة للعقارات</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">إضافة عقار جديد</h1>
          <p className="text-gray-500 mt-2">أضف عقارك وابدأ في استقبال العروض</p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <FormSteps 
            steps={steps} 
            currentStep={currentStep}
            onStepClick={goToStep}
          />
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Step 1: Property Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">ما نوع العقار؟</h2>
                <p className="text-gray-500">اختر نوع العقار الذي تريد إضافته</p>
              </div>

              {/* Property Types Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateFormData({ propertyType: type.value })}
                    className={`p-6 rounded-2xl border-2 text-center transition-all ${
                      formData.propertyType === type.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-4xl mb-3 block">{type.icon}</span>
                    <span className="font-semibold text-gray-800 block">{type.label}</span>
                    <span className="text-sm text-gray-500">{type.description}</span>
                  </button>
                ))}
              </div>

              {/* Listing Type */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold text-gray-800 mb-4">الغرض من العقار</h3>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => updateFormData({ listingType: 'sale' })}
                    className={`flex-1 py-4 rounded-xl font-medium transition-all ${
                      formData.listingType === 'sale'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    للبيع
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFormData({ listingType: 'rent' })}
                    className={`flex-1 py-4 rounded-xl font-medium transition-all ${
                      formData.listingType === 'rent'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    للإيجار
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">موقع العقار</h2>
                <p className="text-gray-500">حدد موقع العقار بدقة</p>
              </div>

              {/* City & District */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.location.city}
                    onChange={(e) => updateLocation({ city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">اختر المدينة</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحي <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location.district}
                    onChange={(e) => updateLocation({ district: e.target.value })}
                    placeholder="مثال: حي النرجس"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان التفصيلي
                </label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => updateLocation({ address: e.target.value })}
                  placeholder="الشارع ورقم المبنى (اختياري)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* ✅ Map - Leaflet (بدون MapLoader) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حدد الموقع على الخريطة
                </label>
                <LocationPicker
                  initialLocation={formData.location.coordinates || null}
                  onLocationSelect={(location) => {
                    updateLocation({
                      address: location.address || formData.location.address,
                      coordinates: {
                        lat: location.lat,
                        lng: location.lng,
                      },
                    });
                  }}
                  height="350px"
                />
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">تفاصيل العقار</h2>
                <p className="text-gray-500">أضف معلومات تفصيلية عن العقار</p>
              </div>

              {/* Title & Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان العقار <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => updateFormData({ titleAr: e.target.value })}
                    placeholder="مثال: فيلا فاخرة في حي النرجس"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف العقار
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => updateFormData({ descriptionAr: e.target.value })}
                    rows={4}
                    placeholder="اكتب وصفاً تفصيلياً للعقار..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatPrice(formData.price)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      updateFormData({ price: value });
                    }}
                    placeholder="0"
                    className="w-full px-4 py-3 pr-4 pl-24 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {formData.listingType === 'rent' ? 'ريال/شهرياً' : 'ريال'}
                  </div>
                </div>
              </div>

              {/* Main Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المساحة (م²) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaRulerCombined className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={formData.features.area}
                      onChange={(e) => updateFeatures({ area: e.target.value })}
                      placeholder="0"
                      className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {formData.propertyType !== 'land' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        غرف النوم
                      </label>
                      <div className="relative">
                        <FaBed className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={formData.features.bedrooms}
                          onChange={(e) => updateFeatures({ bedrooms: e.target.value })}
                          placeholder="0"
                          min="0"
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الحمامات
                      </label>
                      <div className="relative">
                        <FaBath className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={formData.features.bathrooms}
                          onChange={(e) => updateFeatures({ bathrooms: e.target.value })}
                          placeholder="0"
                          min="0"
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الطوابق
                      </label>
                      <div className="relative">
                        <FaBuilding className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={formData.features.floors}
                          onChange={(e) => updateFeatures({ floors: e.target.value })}
                          placeholder="0"
                          min="0"
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Year Built */}
              {formData.propertyType !== 'land' && (
                <div className="max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنة البناء
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={formData.features.yearBuilt}
                      onChange={(e) => updateFeatures({ yearBuilt: e.target.value })}
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Additional Features */}
              {formData.propertyType !== 'land' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    مميزات إضافية
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {features.map((feature) => (
                      <button
                        key={feature.key}
                        type="button"
                        onClick={() =>
                          updateFeatures({
                            [feature.key]: !formData.features[feature.key as keyof typeof formData.features],
                          })
                        }
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          formData.features[feature.key as keyof typeof formData.features]
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <feature.icon className="w-5 h-5" />
                        <span className="font-medium">{feature.label}</span>
                        {formData.features[feature.key as keyof typeof formData.features] && (
                          <FaCheck className="w-4 h-4 mr-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Images */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">صور العقار</h2>
                <p className="text-gray-500">أضف صور واضحة وجذابة للعقار</p>
              </div>

              <ImageUploader
                images={formData.images}
                onChange={(images) => updateFormData({ images })}
                maxImages={10}
              />

              {/* Tips */}
              <div className="bg-amber-50 rounded-xl p-4">
                <h4 className="font-semibold text-amber-800 mb-2">💡 نصائح للصور</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• استخدم صور عالية الجودة وواضحة</li>
                  <li>• صور النهار أفضل من الليل</li>
                  <li>• أضف صور لجميع الغرف والمرافق</li>
                  <li>• الصورة الأولى ستظهر كصورة رئيسية</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 5: Preview */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">معاينة ونشر</h2>
                <p className="text-gray-500">راجع بيانات العقار قبل النشر</p>
              </div>

              {/* Preview Card */}
              <div className="border rounded-2xl overflow-hidden">
                {/* Images */}
                {formData.images.length > 0 && (
                  <div className="relative h-64">
                    <Image
                      src={formData.images[0]}
                      alt="صورة العقار"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                        formData.listingType === 'sale' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}>
                        {formData.listingType === 'sale' ? 'للبيع' : 'للإيجار'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-gray-700">
                        {getPropertyTypeLabel(formData.propertyType)}
                      </span>
                    </div>
                    {formData.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                        +{formData.images.length - 1} صور
                      </div>
                    )}
                  </div>
                )}

                {/* Details */}
                <div className="p-6">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">
                    {formatPrice(formData.price)} ريال
                    {formData.listingType === 'rent' && <span className="text-sm text-gray-500">/شهرياً</span>}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {formData.titleAr || 'عنوان العقار'}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <FaMapMarkerAlt className="text-emerald-500" />
                    <span>{formData.location.district}، {formData.location.city}</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t">
                    {formData.features.area && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaRulerCombined className="text-gray-400" />
                        <span>{formData.features.area} م²</span>
                      </div>
                    )}
                    {formData.features.bedrooms && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaBed className="text-gray-400" />
                        <span>{formData.features.bedrooms} غرف</span>
                      </div>
                    )}
                    {formData.features.bathrooms && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaBath className="text-gray-400" />
                        <span>{formData.features.bathrooms} حمام</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {formData.descriptionAr && (
                    <p className="text-gray-600 mt-4 pt-4 border-t">
                      {formData.descriptionAr}
                    </p>
                  )}

                  {/* Additional Features */}
                  {Object.entries(formData.features)
                    .filter(([key, value]) => typeof value === 'boolean' && value)
                    .length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                      {features
                        .filter((f) => formData.features[f.key as keyof typeof formData.features])
                        .map((f) => (
                          <span
                            key={f.key}
                            className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                          >
                            {f.label}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Table */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4">ملخص البيانات</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">نوع العقار:</span>
                    <span className="font-medium">{getPropertyTypeLabel(formData.propertyType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">الغرض:</span>
                    <span className="font-medium">{formData.listingType === 'sale' ? 'للبيع' : 'للإيجار'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المدينة:</span>
                    <span className="font-medium">{formData.location.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">الحي:</span>
                    <span className="font-medium">{formData.location.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">السعر:</span>
                    <span className="font-medium text-emerald-600">{formatPrice(formData.price)} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المساحة:</span>
                    <span className="font-medium">{formData.features.area} م²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">عدد الصور:</span>
                    <span className="font-medium">{formData.images.length}</span>
                  </div>
                  {formData.location.coordinates && (
                    <div className="flex justify-between col-span-2">
                      <span className="text-gray-500">الإحداثيات:</span>
                      <span className="font-medium text-xs">
                        {formData.location.coordinates.lat.toFixed(4)}, {formData.location.coordinates.lng.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <FaArrowRight />
                  <span>السابق</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Save as Draft */}
              {currentStep < 5 && (
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={savingDraft}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {savingDraft ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaSave className="w-4 h-4" />
                  )}
                  <span>حفظ كمسودة</span>
                </button>
              )}

              {/* Next / Submit */}
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  <span>التالي</span>
                  <FaArrowLeft />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="w-5 h-5 animate-spin" />
                      <span>جاري النشر...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-5 h-5" />
                      <span>نشر العقار</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}