'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// إصلاح أيقونات Leaflet
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedPosition?: [number, number] | null;
  height?: string;
  interactive?: boolean;
}

export default function MapComponent({
  center = [24.7136, 46.6753],
  zoom = 13,
  onLocationSelect,
  selectedPosition = null,
  height = '400px',
  interactive = true,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fixLeafletIcons();
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    // إذا كانت الخريطة موجودة، لا تنشئها مرة أخرى
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
      return;
    }

    // إنشاء الخريطة
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      scrollWheelZoom: interactive,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
    });

    // إضافة طبقة الخريطة
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // إضافة marker إذا كان هناك موقع محدد
    if (selectedPosition) {
      markerRef.current = L.marker(selectedPosition).addTo(map);
    }

    // التعامل مع النقر على الخريطة
    if (onLocationSelect && interactive) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        // إزالة الـ marker القديم
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // إضافة marker جديد
        markerRef.current = L.marker([lat, lng]).addTo(map);

        onLocationSelect(lat, lng);
      });
    }

    mapRef.current = map;

    // تنظيف عند إزالة المكون
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient]);

  // تحديث المركز عند تغييره
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // تحديث الـ marker عند تغيير الموقع المحدد
  useEffect(() => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    if (selectedPosition) {
      markerRef.current = L.marker(selectedPosition).addTo(mapRef.current);
    }
  }, [selectedPosition]);

  if (!isClient) {
    return (
      <div
        style={{ height, width: '100%' }}
        className="bg-gray-100 animate-pulse rounded-lg flex items-center justify-center"
      >
        <span className="text-gray-500">جاري تحميل الخريطة...</span>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%', borderRadius: '0.5rem' }}
    />
  );
}