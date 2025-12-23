'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface FavoritesContextType {
  favorites: string[];
  isLoading: boolean;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<void>;
  removeFavorite: (propertyId: string) => Promise<void>;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'guest_favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getLocalFavorites = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveLocalFavorites = (favs: string[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favs));
    } catch (error) {
      console.error('Error saving local favorites:', error);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      
      if (status === 'loading') return;

      if (session?.user) {
        try {
          const res = await fetch('/api/favorites/check');
          const data = await res.json();
          
          if (data.success) {
            setFavorites(data.favorites || []);
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      } else {
        const localFavorites = getLocalFavorites();
        setFavorites(localFavorites);
      }
      
      setIsLoading(false);
    };

    fetchFavorites();
  }, [session, status]);

  const isFavorite = useCallback((propertyId: string): boolean => {
    return favorites.includes(propertyId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (propertyId: string) => {
    if (session?.user) {
      try {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId }),
        });

        const data = await res.json();

        if (data.success) {
          setFavorites(data.favorites || []);
        }
      } catch (error) {
        console.error('Toggle favorite error:', error);
      }
    } else {
      const currentFavorites = getLocalFavorites();
      const index = currentFavorites.indexOf(propertyId);
      
      if (index > -1) {
        currentFavorites.splice(index, 1);
      } else {
        currentFavorites.push(propertyId);
      }
      
      saveLocalFavorites(currentFavorites);
      setFavorites(currentFavorites);
    }
  }, [session]);

  const removeFavorite = useCallback(async (propertyId: string) => {
    if (session?.user) {
      try {
        await fetch(`/api/favorites?propertyId=${propertyId}`, {
          method: 'DELETE',
        });
        setFavorites(prev => prev.filter(id => id !== propertyId));
      } catch (error) {
        console.error('Remove favorite error:', error);
      }
    } else {
      const currentFavorites = getLocalFavorites().filter(id => id !== propertyId);
      saveLocalFavorites(currentFavorites);
      setFavorites(currentFavorites);
    }
  }, [session]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}