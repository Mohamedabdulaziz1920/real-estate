'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GeneralSettings {
  siteName: string;
  siteNameEn: string;
  siteDescription: string;
  siteDescriptionEn: string;
  logo: string;
  favicon: string;
  timezone: string;
  language: string;
  currency: string;
  maintenanceMode: boolean;
}

interface GeneralSettingsContextType {
  settings: GeneralSettings | null;
  isLoading: boolean;
}

const GeneralSettingsContext = createContext<GeneralSettingsContextType>({
  settings: null,
  isLoading: true,
});

export const useGeneralSettings = () => useContext(GeneralSettingsContext);

interface GeneralSettingsProviderProps {
  children: ReactNode;
}

export const GeneralSettingsProvider: React.FC<GeneralSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings/general');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          // استخدام إعدادات افتراضية
          setSettings({
            siteName: 'Real Estate',
            siteNameEn: 'Real Estate',
            siteDescription: 'موقع عقارات',
            siteDescriptionEn: 'Real Estate Platform',
            logo: '/logo.png',
            favicon: '/favicon.ico',
            timezone: 'UTC+3',
            language: 'ar',
            currency: 'SAR',
            maintenanceMode: false,
          });
        }
      } catch (error) {
        console.error('Error fetching general settings:', error);
        // إعدادات افتراضية عند الخطأ
        setSettings({
          siteName: 'Real Estate',
          siteNameEn: 'Real Estate',
          siteDescription: 'موقع عقارات',
          siteDescriptionEn: 'Real Estate Platform',
          logo: '/logo.png',
          favicon: '/favicon.ico',
          timezone: 'UTC+3',
          language: 'ar',
          currency: 'SAR',
          maintenanceMode: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <GeneralSettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </GeneralSettingsContext.Provider>
  );
};