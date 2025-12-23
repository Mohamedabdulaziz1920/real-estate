'use client';

// 1. استيراد useCallback
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

interface Property {
  _id: string;
  titleAr: string;
  price: number;
  listingType: string;
  images: string[];
  location: {
    city: string;
    district: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: {
    area: number;
  };
}

interface NearbyPropertiesProps {
  currentPropertyId: string;
  coordinates: { lat: number; lng: number };
  city: string;
  maxDistance?: number; // in km
  limit?: number;
}

// 2. نقل دالة الحساب خارج المكون لأنها لا تعتمد على الـ State
// هذا يمنع إعادة إنشائها ويحل مشكلة الاعتماديات الخاصة بها
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function NearbyProperties({
  currentPropertyId,
  coordinates,
  city,
  maxDistance = 5,
  limit = 4,
}: NearbyPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. تغليف دالة الجلب بـ useCallback وإضافة جميع المتغيرات المستخدمة للاعتماديات
  const fetchNearbyProperties = useCallback(async () => {
    try {
      // جلب عقارات نفس المدينة
      const res = await fetch(`/api/properties?city=${city}&limit=20`);
      const data = await res.json();

      if (data.success) {
        // حساب المسافة وفلترة العقارات
        const nearbyProps = data.data
          .filter((p: Property) => {
            if (p._id === currentPropertyId) return false;
            if (!p.location.coordinates?.lat || !p.location.coordinates?.lng) return false;

            // استخدام الدالة الخارجية
            const distance = calculateDistance(
              coordinates.lat,
              coordinates.lng,
              p.location.coordinates.lat,
              p.location.coordinates.lng
            );

            return distance <= maxDistance;
          })
          .slice(0, limit);

        setProperties(nearbyProps);
      }
    } catch (error) {
      console.error('Error fetching nearby properties:', error);
    } finally {
      setLoading(false);
    }
  }, [city, coordinates, currentPropertyId, maxDistance, limit]); // إضافة الاعتماديات

  // 4. تحديث useEffect
  useEffect(() => {
    fetchNearbyProperties();
  }, [fetchNearbyProperties]);

  const formatPrice = (price: number, listingType: string) => {
    const formatted = price.toLocaleString('ar-SA');
    return listingType === 'rent' ? `${formatted} ر.س/شهرياً` : `${formatted} ر.س`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FaSpinner className="w-6 h-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaMapMarkerAlt className="text-emerald-600" />
        عقارات قريبة
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {properties.map((property) => (
          <Link
            key={property._id}
            href={`/properties/${property._id}`}
            className="group"
          >
            <div className="relative h-32 rounded-xl overflow-hidden mb-2">
              <Image
                src={property.images?.[0] || '/images/placeholder.jpg'}
                alt={property.titleAr}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${
                    property.listingType === 'sale' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                >
                  {property.listingType === 'sale' ? 'للبيع' : 'للإيجار'}
                </span>
              </div>
            </div>
            <p className="font-bold text-emerald-600 text-sm">
              {formatPrice(property.price, property.listingType)}
            </p>
            <p className="text-gray-800 text-sm truncate">{property.titleAr}</p>
            <p className="text-gray-500 text-xs truncate">
              {property.location.district}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}