'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';
import { useFavorites } from '@/contexts/FavoritesContext';

interface FavoriteButtonProps {
  propertyId: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function FavoriteButton({
  propertyId,
  size = 'md',
  showText = false,
  className = '',
}: FavoriteButtonProps) {
  const router = useRouter();
  const { status } = useSession();
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);

  const favorite = isFavorite(propertyId);

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // السماح للزوار بإضافة للمفضلة (سيتم حفظها محلياً)
    // ولكن يمكنك تفعيل هذا الشرط إذا أردت إجبارهم على تسجيل الدخول
    // if (status !== 'authenticated') {
    //   router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    //   return;
    // }

    setIsToggling(true);
    await toggleFavorite(propertyId);
    setIsToggling(false);
  };

  if (isLoading) {
    return (
      <button
        disabled
        className={`${sizeClasses[size]} rounded-full bg-white/90 ${className}`}
      >
        <FaSpinner className={`${iconSizes[size]} text-gray-400 animate-spin`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isToggling}
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-white/90 
        hover:bg-white 
        transition-all 
        duration-200
        hover:scale-110
        active:scale-95
        disabled:opacity-50
        ${showText ? 'flex items-center gap-2 px-4' : ''}
        ${className}
      `}
      title={favorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
    >
      {isToggling ? (
        <FaSpinner className={`${iconSizes[size]} text-gray-400 animate-spin`} />
      ) : favorite ? (
        <FaHeart className={`${iconSizes[size]} text-red-500`} />
      ) : (
        <FaRegHeart className={`${iconSizes[size]} text-gray-600 hover:text-red-500`} />
      )}
      {showText && (
        <span className={`font-medium ${favorite ? 'text-red-500' : 'text-gray-600'}`}>
          {favorite ? 'في المفضلة' : 'أضف للمفضلة'}
        </span>
      )}
    </button>
  );
}