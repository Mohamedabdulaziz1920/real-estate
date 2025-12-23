// src/components/properties/PropertyCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { IProperty } from '@/types';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';

interface PropertyCardProps {
  property: IProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, listingType: string) => {
    const formatted = price.toLocaleString('ar-SA');
    return listingType === 'rent' 
      ? `${formatted} ريال/شهرياً` 
      : `${formatted} ريال`;
  };

  const propertyTypeLabels: Record<string, string> = {
    apartment: 'شقة',
    villa: 'فيلا',
    land: 'أرض',
    building: 'عمارة',
    office: 'مكتب',
  };

  return (
    <Link href={`/properties/${property._id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
        {/* صورة العقار */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={property.images?.[0] || 'https://via.placeholder.com/400x300'}
            alt={property.titleAr}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* الشارات */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
              property.listingType === 'sale' ? 'bg-emerald-500' : 'bg-blue-500'
            }`}>
              {property.listingType === 'sale' ? 'للبيع' : 'للإيجار'}
            </span>
            {property.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">
                مميز
              </span>
            )}
          </div>
          
          {/* نوع العقار */}
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
              {propertyTypeLabels[property.propertyType]}
            </span>
          </div>
        </div>
        
        {/* محتوى البطاقة */}
        <div className="p-5">
          {/* العنوان */}
          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {property.titleAr}
          </h3>
          
          {/* الموقع */}
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <FaMapMarkerAlt className="text-emerald-500 flex-shrink-0" />
            <span className="line-clamp-1">
              {property.location.district}، {property.location.city}
            </span>
          </div>
          
          {/* المميزات */}
          <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
            <div className="flex items-center gap-1">
              <FaRulerCombined className="text-gray-400" />
              <span>{property.features.area} م²</span>
            </div>
            {property.features.bedrooms && (
              <div className="flex items-center gap-1">
                <FaBed className="text-gray-400" />
                <span>{property.features.bedrooms}</span>
              </div>
            )}
            {property.features.bathrooms && (
              <div className="flex items-center gap-1">
                <FaBath className="text-gray-400" />
                <span>{property.features.bathrooms}</span>
              </div>
            )}
          </div>
          
          {/* السعر والمالك */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-xl font-bold text-emerald-600">
                {formatPrice(property.price, property.listingType)}
              </p>
            </div>
            
            {/* معلومات المالك إذا كانت موجودة */}
            {property.owner && typeof property.owner === 'object' && (
              <div className="text-xs text-gray-500">
                <p>بواسطة: {property.owner.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}