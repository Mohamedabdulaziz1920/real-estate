'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  FaCog,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaSnapchat,
  FaTiktok,
  FaWhatsapp,
  FaSave,
  FaUpload,
  FaBell,
  FaShieldAlt,
  FaPalette,
  FaSearch,
  FaServer,
  FaKey,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaDatabase,
  FaTrash,
  FaDownload,
} from 'react-icons/fa';

// Settings Tabs
const tabs = [
  { id: 'general', label: 'عام', icon: FaCog },
  { id: 'contact', label: 'التواصل', icon: FaPhone },
  { id: 'social', label: 'التواصل الاجتماعي', icon: FaGlobe },
  { id: 'email', label: 'البريد الإلكتروني', icon: FaEnvelope },
  { id: 'seo', label: 'SEO', icon: FaSearch },
  { id: 'notifications', label: 'الإشعارات', icon: FaBell },
  { id: 'security', label: 'الأمان', icon: FaShieldAlt },
  { id: 'appearance', label: 'المظهر', icon: FaPalette },
  { id: 'backup', label: 'النسخ الاحتياطي', icon: FaDatabase },
];

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

interface ContactSettings {
  email: string;
  supportEmail: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  workingHours: string;
  googleMapsUrl: string;
}

interface SocialSettings {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  snapchat: string;
  tiktok: string;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  fromName: string;
  fromEmail: string;
}

interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
  robotsTxt: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  newPropertyAlert: boolean;
  newUserAlert: boolean;
  newInquiryAlert: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAttempts: number;
  sessionTimeout: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  forcePasswordChange: number;
  ipWhitelist: string;
}

interface AppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkMode: boolean;
  rtlMode: boolean;
  showFeaturedFirst: boolean;
  propertiesPerPage: number;
  showMap: boolean;
  showAgentInfo: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'عقاري',
    siteNameEn: 'Aqari',
    siteDescription: 'أفضل موقع للبحث عن العقارات في المملكة العربية السعودية',
    siteDescriptionEn: 'Best real estate platform in Saudi Arabia',
    logo: '',
    favicon: '',
    timezone: 'Asia/Riyadh',
    language: 'ar',
    currency: 'SAR',
    maintenanceMode: false,
  });

  // Contact Settings State
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    email: 'info@aqari.com',
    supportEmail: 'support@aqari.com',
    phone: '+966 50 123 4567',
    whatsapp: '+966501234567',
    address: 'شارع الملك فهد، برج المملكة',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    postalCode: '12345',
    workingHours: 'الأحد - الخميس: 9 صباحاً - 6 مساءً',
    googleMapsUrl: '',
  });

  // Social Settings State
  const [socialSettings, setSocialSettings] = useState<SocialSettings>({
    facebook: 'https://facebook.com/aqari',
    twitter: 'https://twitter.com/aqari',
    instagram: 'https://instagram.com/aqari',
    linkedin: 'https://linkedin.com/company/aqari',
    youtube: '',
    snapchat: '',
    tiktok: '',
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpSecure: true,
    fromName: 'عقاري',
    fromEmail: 'noreply@aqari.com',
  });

  // SEO Settings State
  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    metaTitle: 'عقاري - أفضل موقع عقارات في السعودية',
    metaDescription: 'ابحث عن شقق، فلل، أراضي للبيع والإيجار في جميع مدن المملكة',
    metaKeywords: 'عقارات، شقق للبيع، فلل للإيجار، أراضي، عقارات السعودية',
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    robotsTxt: 'User-agent: *\nAllow: /',
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newPropertyAlert: true,
    newUserAlert: true,
    newInquiryAlert: true,
    weeklyReport: true,
    monthlyReport: false,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginAttempts: 5,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    forcePasswordChange: 90,
    ipWhitelist: '',
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    primaryColor: '#059669',
    secondaryColor: '#1f2937',
    accentColor: '#f59e0b',
    darkMode: false,
    rtlMode: true,
    showFeaturedFirst: true,
    propertiesPerPage: 12,
    showMap: true,
    showAgentInfo: true,
  });

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would save to your API
      // const res = await fetch('/api/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     general: generalSettings,
      //     contact: contactSettings,
      //     social: socialSettings,
      //     email: emailSettings,
      //     seo: seoSettings,
      //     notifications: notificationSettings,
      //     security: securitySettings,
      //     appearance: appearanceSettings,
      //   }),
      // });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setError('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGeneralSettings({ ...generalSettings, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const testEmailConnection = async () => {
    // Simulate testing email connection
    alert('جاري اختبار الاتصال...');
  };

  const ToggleSwitch = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: () => void;
  }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-emerald-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-1' : 'translate-x-6'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">الإعدادات</h1>
          <p className="text-gray-500">إدارة إعدادات الموقع</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : saved ? (
            <>
              <FaCheck />
              <span>تم الحفظ</span>
            </>
          ) : (
            <>
              <FaSave />
              <span>حفظ التغييرات</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl flex items-center gap-3">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 text-green-600 px-6 py-4 rounded-xl flex items-center gap-3">
          <FaCheck />
          <span>تم حفظ الإعدادات بنجاح</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-right ${
                    activeTab === tab.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaCog className="text-emerald-600" />
                الإعدادات العامة
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Site Name Arabic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الموقع (عربي)
                  </label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, siteName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Site Name English */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الموقع (إنجليزي)
                  </label>
                  <input
                    type="text"
                    value={generalSettings.siteNameEn}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, siteNameEn: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                {/* Site Description Arabic */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف الموقع (عربي)
                  </label>
                  <textarea
                    value={generalSettings.siteDescription}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المنطقة الزمنية
                  </label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, timezone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                    <option value="Asia/Dubai">دبي (GMT+4)</option>
                    <option value="Asia/Kuwait">الكويت (GMT+3)</option>
                    <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اللغة الافتراضية
                  </label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, language: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العملة
                  </label>
                  <select
                    value={generalSettings.currency}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, currency: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                    <option value="KWD">دينار كويتي (KWD)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                  </select>
                </div>

                {/* Logo Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شعار الموقع
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                      {generalSettings.logo ? (
                        <Image
                          src={generalSettings.logo}
                          alt="Logo"
                          width={128}
                          height={128}
                          className="object-contain"
                        />
                      ) : (
                        <FaUpload className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                          <FaUpload />
                          <span>رفع شعار جديد</span>
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG حتى 2MB - الأبعاد المفضلة: 200x60
                      </p>
                    </div>
                  </div>
                </div>

                {/* Maintenance Mode */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FaExclamationTriangle className="text-amber-500" />
                      <div>
                        <h4 className="font-medium text-gray-800">وضع الصيانة</h4>
                        <p className="text-sm text-gray-500">
                          عند التفعيل، سيظهر للزوار صفحة صيانة
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={generalSettings.maintenanceMode}
                      onChange={() =>
                        setGeneralSettings({
                          ...generalSettings,
                          maintenanceMode: !generalSettings.maintenanceMode,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Settings */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaPhone className="text-emerald-600" />
                معلومات التواصل
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني الرئيسي
                  </label>
                  <input
                    type="email"
                    value={contactSettings.email}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بريد الدعم الفني
                  </label>
                  <input
                    type="email"
                    value={contactSettings.supportEmail}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, supportEmail: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={contactSettings.phone}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الواتساب
                  </label>
                  <input
                    type="tel"
                    value={contactSettings.whatsapp}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, whatsapp: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={contactSettings.address}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, address: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة
                  </label>
                  <input
                    type="text"
                    value={contactSettings.city}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, city: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرمز البريدي
                  </label>
                  <input
                    type="text"
                    value={contactSettings.postalCode}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, postalCode: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ساعات العمل
                  </label>
                  <input
                    type="text"
                    value={contactSettings.workingHours}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, workingHours: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط خرائط جوجل
                  </label>
                  <input
                    type="url"
                    value={contactSettings.googleMapsUrl}
                    onChange={(e) =>
                      setContactSettings({ ...contactSettings, googleMapsUrl: e.target.value })
                    }
                    placeholder="https://maps.google.com/..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Media Settings */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaGlobe className="text-emerald-600" />
                وسائل التواصل الاجتماعي
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'facebook', label: 'فيسبوك', icon: FaFacebookF, color: 'bg-blue-600' },
                  { key: 'twitter', label: 'تويتر', icon: FaTwitter, color: 'bg-sky-500' },
                  { key: 'instagram', label: 'انستغرام', icon: FaInstagram, color: 'bg-pink-600' },
                  { key: 'linkedin', label: 'لينكد إن', icon: FaLinkedinIn, color: 'bg-blue-700' },
                  { key: 'youtube', label: 'يوتيوب', icon: FaYoutube, color: 'bg-red-600' },
                  { key: 'snapchat', label: 'سناب شات', icon: FaSnapchat, color: 'bg-yellow-400' },
                  { key: 'tiktok', label: 'تيك توك', icon: FaTiktok, color: 'bg-black' },
                ].map((social) => (
                  <div key={social.key} className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 ${social.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <social.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {social.label}
                      </label>
                      <input
                        type="url"
                        value={socialSettings[social.key as keyof SocialSettings]}
                        onChange={(e) =>
                          setSocialSettings({ ...socialSettings, [social.key]: e.target.value })
                        }
                        placeholder={`https://${social.key}.com/...`}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        dir="ltr"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaEnvelope className="text-emerald-600" />
                إعدادات البريد الإلكتروني (SMTP)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    خادم SMTP
                  </label>
                  <input
                    type="text"
                    value={emailSettings.smtpHost}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, smtpHost: e.target.value })
                    }
                    placeholder="smtp.gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المنفذ (Port)
                  </label>
                  <input
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) })
                    }
                    placeholder="587"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    value={emailSettings.smtpUser}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, smtpUser: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المرسل
                  </label>
                  <input
                    type="text"
                    value={emailSettings.fromName}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, fromName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بريد المرسل
                  </label>
                  <input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) =>
                      setEmailSettings({ ...emailSettings, fromEmail: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-800">اتصال آمن (SSL/TLS)</h4>
                      <p className="text-sm text-gray-500">تفعيل التشفير للاتصال</p>
                    </div>
                    <ToggleSwitch
                      enabled={emailSettings.smtpSecure}
                      onChange={() =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpSecure: !emailSettings.smtpSecure,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={testEmailConnection}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <FaServer />
                    <span>اختبار الاتصال</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaSearch className="text-emerald-600" />
                إعدادات SEO
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان الصفحة الرئيسية (Meta Title)
                  </label>
                  <input
                    type="text"
                    value={seoSettings.metaTitle}
                    onChange={(e) =>
                      setSeoSettings({ ...seoSettings, metaTitle: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {seoSettings.metaTitle.length}/60 حرف
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف الموقع (Meta Description)
                  </label>
                  <textarea
                    value={seoSettings.metaDescription}
                    onChange={(e) =>
                      setSeoSettings({ ...seoSettings, metaDescription: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {seoSettings.metaDescription.length}/160 حرف
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكلمات المفتاحية (Meta Keywords)
                  </label>
                  <input
                    type="text"
                    value={seoSettings.metaKeywords}
                    onChange={(e) =>
                      setSeoSettings({ ...seoSettings, metaKeywords: e.target.value })
                    }
                    placeholder="كلمة1، كلمة2، كلمة3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={seoSettings.googleAnalyticsId}
                      onChange={(e) =>
                        setSeoSettings({ ...seoSettings, googleAnalyticsId: e.target.value })
                      }
                      placeholder="UA-XXXXXXXXX-X أو G-XXXXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Tag Manager ID
                    </label>
                    <input
                      type="text"
                      value={seoSettings.googleTagManagerId}
                      onChange={(e) =>
                        setSeoSettings({ ...seoSettings, googleTagManagerId: e.target.value })
                      }
                      placeholder="GTM-XXXXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      value={seoSettings.facebookPixelId}
                      onChange={(e) =>
                        setSeoSettings({ ...seoSettings, facebookPixelId: e.target.value })
                      }
                      placeholder="XXXXXXXXXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملف Robots.txt
                  </label>
                  <textarea
                    value={seoSettings.robotsTxt}
                    onChange={(e) =>
                      setSeoSettings({ ...seoSettings, robotsTxt: e.target.value })
                    }
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm resize-none"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaBell className="text-emerald-600" />
                إعدادات الإشعارات
              </h2>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">قنوات الإشعارات</h3>
                
                {[
                  { key: 'emailNotifications', label: 'إشعارات البريد الإلكتروني', desc: 'استلام إشعارات عبر البريد' },
                  { key: 'smsNotifications', label: 'إشعارات SMS', desc: 'استلام إشعارات عبر الرسائل القصيرة' },
                  { key: 'pushNotifications', label: 'إشعارات المتصفح', desc: 'استلام إشعارات فورية في المتصفح' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.label}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <ToggleSwitch
                      enabled={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                      onChange={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: !notificationSettings[item.key as keyof NotificationSettings],
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium text-gray-700">أنواع الإشعارات</h3>
                
                {[
                  { key: 'newPropertyAlert', label: 'عقار جديد', desc: 'عند إضافة عقار جديد' },
                  { key: 'newUserAlert', label: 'مستخدم جديد', desc: 'عند تسجيل مستخدم جديد' },
                  { key: 'newInquiryAlert', label: 'استفسار جديد', desc: 'عند استلام استفسار جديد' },
                  { key: 'weeklyReport', label: 'تقرير أسبوعي', desc: 'استلام تقرير أسبوعي' },
                  { key: 'monthlyReport', label: 'تقرير شهري', desc: 'استلام تقرير شهري' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.label}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <ToggleSwitch
                      enabled={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                      onChange={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: !notificationSettings[item.key as keyof NotificationSettings],
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaShieldAlt className="text-emerald-600" />
                إعدادات الأمان
              </h2>

              <div className="space-y-6">
                {/* Two Factor Auth */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-800">التحقق الثنائي (2FA)</h4>
                    <p className="text-sm text-gray-500">تفعيل التحقق الثنائي للمديرين</p>
                  </div>
                  <ToggleSwitch
                    enabled={securitySettings.twoFactorAuth}
                    onChange={() =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: !securitySettings.twoFactorAuth,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      محاولات تسجيل الدخول المسموحة
                    </label>
                    <input
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          loginAttempts: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مهلة انتهاء الجلسة (دقائق)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: parseInt(e.target.value),
                        })
                      }
                      min="5"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحد الأدنى لكلمة المرور
                    </label>
                    <input
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordMinLength: parseInt(e.target.value),
                        })
                      }
                      min="6"
                      max="32"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تغيير كلمة المرور كل (يوم)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.forcePasswordChange}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          forcePasswordChange: parseInt(e.target.value),
                        })
                      }
                      min="0"
                      placeholder="0 = معطل"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700">تتطلب رموز خاصة (!@#$)</span>
                    <ToggleSwitch
                      enabled={securitySettings.requireSpecialChars}
                      onChange={() =>
                        setSecuritySettings({
                          ...securitySettings,
                          requireSpecialChars: !securitySettings.requireSpecialChars,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700">تتطلب أرقام</span>
                    <ToggleSwitch
                      enabled={securitySettings.requireNumbers}
                      onChange={() =>
                        setSecuritySettings({
                          ...securitySettings,
                          requireNumbers: !securitySettings.requireNumbers,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    قائمة IP المسموحة (اختياري)
                  </label>
                  <textarea
                    value={securitySettings.ipWhitelist}
                    onChange={(e) =>
                      setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })
                    }
                    rows={3}
                    placeholder="192.168.1.1&#10;10.0.0.1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm resize-none"
                    dir="ltr"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    عنوان IP واحد في كل سطر. اتركه فارغاً للسماح لجميع العناوين.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaPalette className="text-emerald-600" />
                إعدادات المظهر
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اللون الأساسي
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          primaryColor: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اللون الثانوي
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={appearanceSettings.secondaryColor}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={appearanceSettings.secondaryColor}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          secondaryColor: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    لون التمييز
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={appearanceSettings.accentColor}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          accentColor: e.target.value,
                        })
                      }
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={appearanceSettings.accentColor}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          accentColor: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد العقارات في الصفحة
                </label>
                <select
                  value={appearanceSettings.propertiesPerPage}
                  onChange={(e) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      propertiesPerPage: parseInt(e.target.value),
                    })
                  }
                  className="w-full md:w-48 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value={6}>6 عقارات</option>
                  <option value={9}>9 عقارات</option>
                  <option value={12}>12 عقار</option>
                  <option value={18}>18 عقار</option>
                  <option value={24}>24 عقار</option>
                </select>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'darkMode', label: 'الوضع الداكن', desc: 'تفعيل المظهر الداكن' },
                  { key: 'rtlMode', label: 'اتجاه RTL', desc: 'تفعيل اتجاه اليمين لليسار' },
                  { key: 'showFeaturedFirst', label: 'العقارات المميزة أولاً', desc: 'عرض العقارات المميزة في المقدمة' },
                  { key: 'showMap', label: 'إظهار الخريطة', desc: 'عرض الخريطة في صفحة العقار' },
                  { key: 'showAgentInfo', label: 'إظهار معلومات الوكيل', desc: 'عرض معلومات الوكيل العقاري' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.label}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <ToggleSwitch
                      enabled={appearanceSettings[item.key as keyof AppearanceSettings] as boolean}
                      onChange={() =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          [item.key]: !appearanceSettings[item.key as keyof AppearanceSettings],
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Backup Settings */}
          {activeTab === 'backup' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaDatabase className="text-emerald-600" />
                النسخ الاحتياطي
              </h2>

              {/* Export Section */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-medium text-gray-800 mb-4">تصدير البيانات</h3>
                <p className="text-gray-600 mb-4">
                  قم بتصدير جميع بيانات الموقع كملف JSON للحفظ الاحتياطي
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                    <FaDownload />
                    <span>تصدير العقارات</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                    <FaDownload />
                    <span>تصدير المستخدمين</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                    <FaDownload />
                    <span>تصدير كل شيء</span>
                  </button>
                </div>
              </div>

              {/* Import Section */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-medium text-gray-800 mb-4">استيراد البيانات</h3>
                <p className="text-gray-600 mb-4">
                  استعادة البيانات من ملف نسخة احتياطية سابقة
                </p>
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors">
                    <FaUpload />
                    <span>اختر ملف للاستيراد</span>
                  </span>
                  <input type="file" accept=".json" className="hidden" />
                </label>
              </div>

              {/* Danger Zone */}
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <h3 className="text-lg font-medium text-red-800 mb-4">منطقة الخطر</h3>
                <p className="text-red-600 mb-4">
                  هذه الإجراءات لا يمكن التراجع عنها. كن حذراً!
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
                    <FaTrash />
                    <span>حذف جميع العقارات</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
                    <FaTrash />
                    <span>إعادة تعيين الإعدادات</span>
                  </button>
                </div>
              </div>

              {/* Backup History */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">سجل النسخ الاحتياطية</h3>
                <div className="space-y-3">
                  {[
                    { date: '2024-01-15 14:30', size: '2.5 MB', type: 'تلقائي' },
                    { date: '2024-01-14 14:30', size: '2.4 MB', type: 'تلقائي' },
                    { date: '2024-01-13 10:15', size: '2.3 MB', type: 'يدوي' },
                  ].map((backup, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{backup.date}</p>
                        <p className="text-sm text-gray-500">
                          {backup.size} • {backup.type}
                        </p>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FaDownload />
                        <span>تحميل</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}