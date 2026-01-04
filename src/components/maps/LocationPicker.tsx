'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';

// تحميل ديناميكي بدون SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-500">جاري تحميل الخريطة...</span>
    </div>
  ),
});

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
}

export default function LocationPicker({
  onLocationChange,
  initialLat = 24.7136,
  initialLng = 46.6753,
  height = '400px',
}: LocationPickerProps) {
  const [coordinates, setCoordinates] = useState({
    lat: initialLat,
    lng: initialLng,
  });
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      const data = await response.json();
      return data.display_name || '';
    } catch (error) {
      console.error('Error fetching address:', error);
      return '';
    }
  };

  const handleLocationSelect = useCallback(
    async (lat: number, lng: number) => {
      setCoordinates({ lat, lng });
      setIsLoading(true);

      const newAddress = await fetchAddress(lat, lng);
      setAddress(newAddress);
      onLocationChange(lat, lng, newAddress);

      setIsLoading(false);
    },
    [onLocationChange]
  );

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationSelect(position.coords.latitude, position.coords.longitude);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('لم نتمكن من الحصول على موقعك الحالي');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* زر الموقع الحالي */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGettingLocation ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>جاري تحديد الموقع...</span>
            </>
          ) : (
            <>
              <span>📍</span>
              <span>موقعي الحالي</span>
            </>
          )}
        </button>
      </div>

      {/* الخريطة */}
      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        <MapComponent
          center={[coordinates.lat, coordinates.lng]}
          zoom={15}
          onLocationSelect={handleLocationSelect}
          selectedPosition={[coordinates.lat, coordinates.lng]}
          height={height}
          interactive={true}
        />
      </div>

      {/* الإحداثيات */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            خط العرض (Latitude)
          </label>
          <input
            type="text"
            value={coordinates.lat.toFixed(6)}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            خط الطول (Longitude)
          </label>
          <input
            type="text"
            value={coordinates.lng.toFixed(6)}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>
      </div>

      {/* العنوان */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>جاري جلب العنوان...</span>
        </div>
      )}

      {address && !isLoading && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            العنوان
          </label>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
            {address}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        💡 انقر على الخريطة لتحديد الموقع أو استخدم زر &quot;موقعي الحالي&quot;
      </p>
    </div>
  );
}