// components/maps/LocationPicker.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { FaMapMarkerAlt, FaSearch, FaSpinner } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  initialLocation?: Location | null;
  onLocationSelect: (location: Location) => void;
  height?: string;
}

const defaultCenter = { lat: 24.7136, lng: 46.6753 };

function ClickHandler({ onLocationSelect }: { onLocationSelect: (loc: Location) => void }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      let address = '';
      
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
        );
        const data = await res.json();
        address = data.display_name || '';
      } catch (err) {
        console.log('Could not get address');
      }
      
      onLocationSelect({ lat, lng, address });
    },
  });
  return null;
}

export default function LocationPicker({
  initialLocation,
  onLocationSelect,
  height = '400px',
}: LocationPickerProps) {
  const [marker, setMarker] = useState<Location | null>(initialLocation || null);
  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  const handleSelect = (location: Location) => {
    setMarker(location);
    onLocationSelect(location);
  };

  const search = async () => {
    if (!searchValue.trim()) return;
    setSearching(true);
    
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}&countrycodes=sa&accept-language=ar&limit=5`
      );
      setResults(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const selectResult = (r: any) => {
    const loc = { lat: parseFloat(r.lat), lng: parseFloat(r.lon), address: r.display_name };
    setMarker(loc);
    onLocationSelect(loc);
    setResults([]);
    setSearchValue(r.display_name);
    mapRef.current?.setView([loc.lat, loc.lng], 15);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder="ابحث عن موقع..."
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="button"
            onClick={search}
            disabled={searching}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
          >
            {searching ? <FaSpinner className="animate-spin" /> : 'بحث'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="absolute z-[1000] w-full mt-2 bg-white rounded-xl shadow-lg border max-h-60 overflow-y-auto">
            {results.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectResult(r)}
                className="w-full px-4 py-3 text-right hover:bg-gray-50 border-b last:border-0"
              >
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="w-4 h-4 text-emerald-500 mt-1" />
                  <span className="text-sm text-gray-700 line-clamp-2">{r.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height }}>
        <MapContainer
          center={[marker?.lat || defaultCenter.lat, marker?.lng || defaultCenter.lng]}
          zoom={marker ? 15 : 10}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onLocationSelect={handleSelect} />
          {marker && (
            <Marker
              position={[marker.lat, marker.lng]}
              icon={icon}
              draggable
              eventHandlers={{
                dragend: async (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  let address = '';
                  try {
                    const res = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
                    );
                    address = (await res.json()).display_name || '';
                  } catch {}
                  handleSelect({ lat, lng, address });
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Selected Location */}
      {marker && (
        <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
          <FaMapMarkerAlt className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <p className="font-medium text-emerald-800">الموقع المحدد</p>
            {marker.address && <p className="text-sm text-emerald-600 mt-1">{marker.address}</p>}
            <p className="text-xs text-emerald-500 mt-1">
              {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}