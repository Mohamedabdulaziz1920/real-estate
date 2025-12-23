// src/app/map/page.tsx
'use client'; // ضروري مع Leaflet في Next.js 13+

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// استدعاء الخريطة بشكل ديناميكي لتجنب مشاكل الـ Server Side Rendering
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

export default function MapPage() {
  return (
    <div className="h-screen w-full">
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
      </MapContainer>
    </div>
  );
}