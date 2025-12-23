'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (propertyId: string) => Promise<void>;
  removeFavorite: (propertyId: string) => Promise<void>;
  isFavorite: (propertyId: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [session]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      // ... منطق جلب المفضلة
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    favorites,
    addFavorite: async (propertyId: string) => { /* ... */ },
    removeFavorite: async (propertyId: string) => { /* ... */ },
    isFavorite: (propertyId: string) => favorites.includes(propertyId),
    isLoading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};