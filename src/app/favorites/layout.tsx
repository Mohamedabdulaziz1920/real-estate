// app/favorites/layout.tsx
'use client';

import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ReactNode } from 'react';

export default function FavoritesLayout({ children }: { children: ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}