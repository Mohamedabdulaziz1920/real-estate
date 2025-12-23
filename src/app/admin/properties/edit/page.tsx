'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
// الأنواع
interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

interface PropertyData {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  type: string;
  status: string;
  purpose: 'sale' | 'rent';
  price: number;
  priceType?: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  yearBuilt?: number;
  address: string;
  city: string;
  district: string;
  latitude?: number;
  longitude?: number;
  features: string[];
  amenities: string[];
  images: PropertyImage[];
  virtualTourUrl?: string;
  videoUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  ownerName?: string;
  ownerPhone?: string;
}

interface PropertyHistory {
  id: string;
  action: string;
  changes: Record<string, { old: string | number; new: string | number }>;
  userId: string;
  userName: string;
  timestamp: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// مكون TabPanel
function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ paddingTop: 24 }}>
      {value === index && children}
    </div>
  );
}

// الخيارات الثابتة
const propertyTypes = [
  { value: 'apartment', label: 'شقة' },
  { value: 'villa', label: 'فيلا' },
  { value: 'house', label: 'منزل' },
  { value: 'land', label: 'أرض' },
  { value: 'commercial', label: 'تجاري' },
  { value: 'office', label: 'مكتب' },
  { value: 'warehouse', label: 'مستودع' },
  { value: 'building', label: 'مبنى' },
];

const propertyStatuses = [
  { value: 'available', label: 'متاح', color: '#4caf50' },
  { value: 'sold', label: 'مباع', color: '#f44336' },
  { value: 'rented', label: 'مؤجر', color: '#ff9800' },
  { value: 'pending', label: 'قيد المراجعة', color: '#2196f3' },
  { value: 'reserved', label: 'محجوز', color: '#9c27b0' },
];

const cities = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام',
  'الخبر', 'الظهران', 'الأحساء', 'القطيف', 'الطائف',
  'تبوك', 'بريدة', 'خميس مشيط', 'أبها', 'نجران',
];

const allFeatures = [
  'موقف سيارات', 'مسبح', 'حديقة', 'مصعد', 'أمن 24 ساعة',
  'تكييف مركزي', 'شرفة', 'غرفة خادمة', 'غرفة سائق', 'مطبخ مجهز',
  'خزائن حائط', 'إطلالة بحرية', 'إطلالة على الحديقة', 'قريب من المسجد',
  'قريب من المدارس', 'قريب من المستشفى', 'واجهة شمالية', 'واجهة جنوبية',
];

const allAmenities = [
  'إنترنت', 'تلفزيون', 'غسالة', 'ثلاجة', 'فرن', 'مايكروويف',
  'سخان مياه', 'نظام إنذار', 'كاميرات مراقبة', 'صالة رياضية',
  'ساونا', 'جاكوزي', 'ملعب أطفال', 'قاعة اجتماعات',
];

// الأنماط
const styles = {
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  breadcrumbs: {
    marginBottom: '16px',
    fontSize: '14px',
  },
  breadcrumbLink: {
    color: '#666',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerRight: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  chip: {
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500',
  },
  warningChip: {
    backgroundColor: '#fff3e0',
    color: '#e65100',
  },
  tabs: {
    display: 'flex',
    gap: '0',
    borderBottom: '2px solid #e0e0e0',
    marginBottom: '24px',
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
  },
  activeTab: {
    color: '#1976d2',
    borderBottomColor: '#1976d2',
  },
  paper: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '24px',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  divider: {
    borderTop: '1px solid #e0e0e0',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gap: '16px',
  },
  grid2: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  },
  grid3: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  },
  grid4: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '14px',
    color: '#333',
  },
  required: {
    color: '#f44336',
    marginLeft: '4px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box' as const,
  },
  inputError: {
    borderColor: '#f44336',
  },
  textarea: {
    minHeight: '120px',
    resize: 'vertical' as const,
  },
  select: {
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left 12px center',
    paddingLeft: '36px',
  },
  errorText: {
    color: '#f44336',
    fontSize: '12px',
    marginTop: '4px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
  },
  primaryButton: {
    backgroundColor: '#1976d2',
    color: '#fff',
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    border: '1px solid #1976d2',
    color: '#1976d2',
  },
  iconButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
  },
  dropzone: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginBottom: '24px',
  },
  dropzoneActive: {
    borderColor: '#1976d2',
    backgroundColor: '#e3f2fd',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  imageCard: {
    position: 'relative' as const,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
  },
  imageActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    backgroundColor: '#f5f5f5',
  },
  primaryBadge: {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    backgroundColor: '#1976d2',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statsBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  statsLabel: {
    color: '#666',
    fontSize: '14px',
  },
  statsValue: {
    fontWeight: '600',
    fontSize: '14px',
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  switch: {
    width: '50px',
    height: '26px',
    borderRadius: '13px',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  switchActive: {
    backgroundColor: '#4caf50',
  },
  switchInactive: {
    backgroundColor: '#ccc',
  },
  switchKnob: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    position: 'absolute' as const,
    top: '2px',
    transition: 'left 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  dialog: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  dialogContent: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  dialogTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '24px',
  },
  snackbar: {
    position: 'fixed' as const,
    bottom: '24px',
    left: '24px',
    padding: '12px 24px',
    borderRadius: '8px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 1001,
    animation: 'slideIn 0.3s ease',
  },
  snackbarSuccess: {
    backgroundColor: '#4caf50',
  },
  snackbarError: {
    backgroundColor: '#f44336',
  },
  snackbarWarning: {
    backgroundColor: '#ff9800',
  },
  featuresContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  featureChip: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
  },
  featureChipActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
    color: '#1976d2',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1976d2',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '24px',
  },
  historyItem: {
    padding: '16px',
    marginBottom: '8px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    borderRight: '4px solid #1976d2',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#999',
  },
  mapPlaceholder: {
    height: '400px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
  },
};

// أيقونات SVG
const Icons = {
  ArrowBack: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  ),
  Save: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
    </svg>
  ),
  Delete: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  ),
  Upload: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="#999">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
    </svg>
  ),
  Image: () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="#ccc">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
    </svg>
  ),
  Star: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffc107">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  ),
  StarBorder: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
    </svg>
  ),
  Location: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  ),
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  Description: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
    </svg>
  ),
  Visibility: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  ),
  History: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
    </svg>
  ),
  Restore: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 3c-4.97 0-9 4.03-9 9H1l4 3.99L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  ),
};

export default function EditPropertyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id');

  // الحالات
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' });
  const [isDragActive, setIsDragActive] = useState(false);
  
  // بيانات العقار
  const [originalData, setOriginalData] = useState<PropertyData | null>(null);
  const [formData, setFormData] = useState<PropertyData>({
    id: '',
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    type: 'apartment',
    status: 'available',
    purpose: 'sale',
    price: 0,
    priceType: '',
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    floors: 1,
    yearBuilt: new Date().getFullYear(),
    address: '',
    city: '',
    district: '',
    latitude: undefined,
    longitude: undefined,
    features: [],
    amenities: [],
    images: [],
    virtualTourUrl: '',
    videoUrl: '',
    isActive: true,
    isFeatured: false,
    views: 0,
    createdAt: '',
    updatedAt: '',
    ownerId: '',
    ownerName: '',
    ownerPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [history, setHistory] = useState<PropertyHistory[]>([]);

  // جلب بيانات العقار
  const fetchPropertyData = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: PropertyData = {
        id: propertyId!,
        title: 'فيلا فاخرة في حي النرجس',
        titleEn: 'Luxury Villa in Al-Narjis',
        description: 'فيلا فاخرة مع حديقة خاصة ومسبح، تتكون من 5 غرف نوم و6 حمامات.',
        descriptionEn: 'Luxury villa with private garden and pool.',
        type: 'villa',
        status: 'available',
        purpose: 'sale',
        price: 2500000,
        priceType: 'fixed',
        area: 450,
        bedrooms: 5,
        bathrooms: 6,
        floors: 2,
        yearBuilt: 2022,
        address: 'شارع الأمير محمد بن سلمان',
        city: 'الرياض',
        district: 'النرجس',
        latitude: 24.7136,
        longitude: 46.6753,
        features: ['موقف سيارات', 'مسبح', 'حديقة', 'مصعد', 'أمن 24 ساعة'],
        amenities: ['إنترنت', 'تكييف مركزي', 'كاميرات مراقبة'],
        images: [
          { id: '1', url: '/images/property1.jpg', isPrimary: true, order: 0 },
          { id: '2', url: '/images/property2.jpg', isPrimary: false, order: 1 },
          { id: '3', url: '/images/property3.jpg', isPrimary: false, order: 2 },
        ],
        virtualTourUrl: 'https://example.com/tour',
        videoUrl: '',
        isActive: true,
        isFeatured: true,
        views: 1250,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:45:00Z',
        ownerId: 'owner1',
        ownerName: 'أحمد محمد',
        ownerPhone: '+966501234567',
      };

      setFormData(mockData);
      setOriginalData(mockData);
    } catch {
      setSnackbar({ open: true, message: 'حدث خطأ في جلب البيانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  const fetchPropertyHistory = useCallback(async () => {
    try {
      const mockHistory: PropertyHistory[] = [
        {
          id: '1',
          action: 'تعديل السعر',
          changes: { price: { old: 2200000, new: 2500000 } },
          userId: 'admin1',
          userName: 'المشرف',
          timestamp: '2024-01-20T14:45:00Z',
        },
        {
          id: '2',
          action: 'إضافة صور',
          changes: { images: { old: 2, new: 3 } },
          userId: 'admin1',
          userName: 'المشرف',
          timestamp: '2024-01-18T10:30:00Z',
        },
      ];
      setHistory(mockHistory);
    } catch {
      console.error('Error fetching history');
    }
  }, []);

  useEffect(() => {
    if (propertyId) {
      fetchPropertyData();
      fetchPropertyHistory();
    } else {
      setLoading(false);
    }
  }, [propertyId, fetchPropertyData, fetchPropertyHistory]);

  // تتبع التغييرات
  useEffect(() => {
    if (originalData) {
      const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
      setHasChanges(changed);
    }
  }, [formData, originalData]);

  // معالجة تغيير الحقول
  const handleChange = (field: keyof PropertyData, value: PropertyData[keyof PropertyData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'عنوان العقار مطلوب';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'وصف العقار مطلوب';
    }
    if (formData.price <= 0) {
      newErrors.price = 'السعر يجب أن يكون أكبر من صفر';
    }
    if (formData.area <= 0) {
      newErrors.area = 'المساحة يجب أن تكون أكبر من صفر';
    }
    if (!formData.city) {
      newErrors.city = 'المدينة مطلوبة';
    }
    if (!formData.district.trim()) {
      newErrors.district = 'الحي مطلوب';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // حفظ التغييرات
  const handleSave = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'يرجى تصحيح الأخطاء أولاً', severity: 'error' });
      return;
    }

    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      setOriginalData(formData);
      setHasChanges(false);
      setSnackbar({ open: true, message: 'تم حفظ التغييرات بنجاح', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'حدث خطأ في حفظ البيانات', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // رفع الصور
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newImages: PropertyImage[] = files.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        isPrimary: formData.images.length === 0 && index === 0,
        order: formData.images.length + index,
      }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));

      setSnackbar({ open: true, message: `تم رفع ${files.length} صورة`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'حدث خطأ في رفع الصور', severity: 'error' });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newImages: PropertyImage[] = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        isPrimary: formData.images.length === 0 && index === 0,
        order: formData.images.length + index,
      }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));

      setSnackbar({ open: true, message: `تم رفع ${files.length} صورة`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'حدث خطأ في رفع الصور', severity: 'error' });
    } finally {
      setUploadingImages(false);
    }
  };

  // حذف صورة
  const handleDeleteImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId),
    }));
  };

  // تعيين صورة رئيسية
  const handleSetPrimaryImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isPrimary: img.id === imageId,
      })),
    }));
  };

  // تبديل الميزة
  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  // تبديل المرفق
  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // استعادة البيانات الأصلية
  const handleRestore = () => {
    if (originalData) {
      setFormData(originalData);
      setHasChanges(false);
    }
  };

  // العودة للخلف
  const handleBack = () => {
    if (hasChanges) {
      setShowDiscardDialog(true);
    } else {
      router.push('/admin/properties');
    }
  };

  // عرض التحميل
  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>جاري تحميل البيانات...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // إذا لم يتم العثور على العقار
  if (!propertyId) {
    return (
      <div style={{ ...styles.container, textAlign: 'center' }}>
        <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#c62828', margin: 0 }}>لم يتم تحديد العقار المطلوب تعديله</p>
        </div>
        <button
          onClick={() => router.push('/admin/properties')}
          style={{ ...styles.button, ...styles.primaryButton }}
        >
          <Icons.ArrowBack />
          العودة لقائمة العقارات
        </button>
      </div>
    );
  }

  const tabs = [
    { label: 'المعلومات الأساسية', icon: <Icons.Home /> },
    { label: 'الصور والوسائط', icon: <Icons.Image /> },
    { label: 'الموقع', icon: <Icons.Location /> },
    { label: 'الإعدادات', icon: <Icons.Settings /> },
  ];

  return (
    <div style={styles.container}>
      {/* شريط التنقل */}
      <div style={styles.breadcrumbs}>
        <span style={styles.breadcrumbLink} onClick={() => router.push('/admin')}>لوحة التحكم</span>
        {' / '}
        <span style={styles.breadcrumbLink} onClick={() => router.push('/admin/properties')}>العقارات</span>
        {' / '}
        <span>تعديل العقار</span>
      </div>

      {/* العنوان وأزرار الإجراءات */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={handleBack} style={styles.iconButton}>
            <Icons.ArrowBack />
          </button>
          <h1 style={styles.title}>تعديل العقار</h1>
          {hasChanges && (
            <span style={{ ...styles.chip, ...styles.warningChip }}>
              تغييرات غير محفوظة
            </span>
          )}
        </div>

        <div style={styles.headerRight}>
          <button onClick={() => setShowHistoryDialog(true)} style={styles.iconButton} title="سجل التغييرات">
            <Icons.History />
          </button>
          <button onClick={handleRestore} style={styles.iconButton} disabled={!hasChanges} title="استعادة">
            <Icons.Restore />
          </button>
          <button
            onClick={() => window.open(`/properties/${propertyId}`, '_blank')}
            style={{ ...styles.button, ...styles.outlinedButton }}
          >
            <Icons.Visibility />
            معاينة
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              opacity: saving || !hasChanges ? 0.6 : 1,
            }}
          >
            {saving ? (
              <div style={{ ...styles.spinner, width: '20px', height: '20px', borderWidth: '2px' }} />
            ) : (
              <Icons.Save />
            )}
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>

      {/* التبويبات */}
      <div style={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              ...styles.tab,
              ...(activeTab === index ? styles.activeTab : {}),
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* المعلومات الأساسية */}
      <TabPanel value={activeTab} index={0}>
        <div style={styles.mainGrid}>
          <div>
            <div style={styles.paper}>
              <h3 style={styles.sectionTitle}>
                <Icons.Description />
                تفاصيل العقار
              </h3>
              <div style={styles.divider} />

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  عنوان العقار (عربي)<span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  style={{ ...styles.input, ...(errors.title ? styles.inputError : {}) }}
                />
                {errors.title && <p style={styles.errorText}>{errors.title}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>عنوان العقار (إنجليزي)</label>
                <input
                  type="text"
                  value={formData.titleEn || ''}
                  onChange={(e) => handleChange('titleEn', e.target.value)}
                  style={styles.input}
                  dir="ltr"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  وصف العقار (عربي)<span style={styles.required}>*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  style={{ ...styles.input, ...styles.textarea, ...(errors.description ? styles.inputError : {}) }}
                />
                {errors.description && <p style={styles.errorText}>{errors.description}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>وصف العقار (إنجليزي)</label>
                <textarea
                  value={formData.descriptionEn || ''}
                  onChange={(e) => handleChange('descriptionEn', e.target.value)}
                  style={{ ...styles.input, ...styles.textarea }}
                  dir="ltr"
                />
              </div>

              <div style={{ ...styles.grid, ...styles.grid2 }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>نوع العقار</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    style={{ ...styles.input, ...styles.select }}
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>الحالة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    style={{ ...styles.input, ...styles.select }}
                  >
                    {propertyStatuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>الغرض</label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => handleChange('purpose', e.target.value as 'sale' | 'rent')}
                    style={{ ...styles.input, ...styles.select }}
                  >
                    <option value="sale">للبيع</option>
                    <option value="rent">للإيجار</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    السعر (ر.س)<span style={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange('price', Number(e.target.value))}
                    style={{ ...styles.input, ...(errors.price ? styles.inputError : {}) }}
                  />
                  {errors.price && <p style={styles.errorText}>{errors.price}</p>}
                </div>
              </div>

              <div style={{ ...styles.grid, ...styles.grid4 }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    المساحة (م²)<span style={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleChange('area', Number(e.target.value))}
                    style={{ ...styles.input, ...(errors.area ? styles.inputError : {}) }}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>غرف النوم</label>
                  <input
                    type="number"
                    value={formData.bedrooms || 0}
                    onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>الحمامات</label>
                  <input
                    type="number"
                    value={formData.bathrooms || 0}
                    onChange={(e) => handleChange('bathrooms', Number(e.target.value))}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>الطوابق</label>
                  <input
                    type="number"
                    value={formData.floors || 1}
                    onChange={(e) => handleChange('floors', Number(e.target.value))}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* المميزات */}
            <div style={styles.paper}>
              <h3 style={styles.sectionTitle}>المميزات</h3>
              <div style={styles.divider} />
              <div style={styles.featuresContainer}>
                {allFeatures.map(feature => (
                  <button
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    style={{
                      ...styles.featureChip,
                      ...(formData.features.includes(feature) ? styles.featureChipActive : {}),
                    }}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            {/* المرافق */}
            <div style={styles.paper}>
              <h3 style={styles.sectionTitle}>المرافق</h3>
              <div style={styles.divider} />
              <div style={styles.featuresContainer}>
                {allAmenities.map(amenity => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    style={{
                      ...styles.featureChip,
                      ...(formData.amenities.includes(amenity) ? styles.featureChipActive : {}),
                    }}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* الشريط الجانبي */}
          <div>
            <div style={styles.paper}>
              <h3 style={styles.sectionTitle}>معلومات المالك</h3>
              <div style={styles.divider} />
              <div style={styles.formGroup}>
                <label style={styles.label}>اسم المالك</label>
                <input
                  type="text"
                  value={formData.ownerName || ''}
                  onChange={(e) => handleChange('ownerName', e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>رقم الهاتف</label>
                <input
                  type="text"
                  value={formData.ownerPhone || ''}
                  onChange={(e) => handleChange('ownerPhone', e.target.value)}
                  style={styles.input}
                  dir="ltr"
                />
              </div>
            </div>

            <div style={styles.paper}>
              <h3 style={styles.sectionTitle}>الإحصائيات</h3>
              <div style={styles.divider} />
              <div style={styles.statsBox}>
                <span style={styles.statsLabel}>المشاهدات:</span>
                <span style={styles.statsValue}>{formData.views.toLocaleString()}</span>
              </div>
              <div style={styles.statsBox}>
                <span style={styles.statsLabel}>تاريخ الإنشاء:</span>
                <span style={styles.statsValue}>{new Date(formData.createdAt).toLocaleDateString('ar-SA')}</span>
              </div>
              <div style={styles.statsBox}>
                <span style={styles.statsLabel}>آخر تحديث:</span>
                <span style={styles.statsValue}>{new Date(formData.updatedAt).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>

      {/* الصور والوسائط */}
      <TabPanel value={activeTab} index={1}>
        <div style={styles.paper}>
          <h3 style={styles.sectionTitle}>صور العقار</h3>
          <div style={styles.divider} />

          {/* منطقة رفع الصور */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
            style={{
              ...styles.dropzone,
              ...(isDragActive ? styles.dropzoneActive : {}),
            }}
          >
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            {uploadingImages ? (
              <div style={styles.spinner} />
            ) : (
              <>
                <Icons.Upload />
                <h4>{isDragActive ? 'أفلت الصور هنا' : 'اسحب وأفلت الصور أو انقر للاختيار'}</h4>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  الحد الأقصى لحجم الصورة: 5 ميجابايت | الصيغ المدعومة: JPG, PNG, WebP
                </p>
              </>
            )}
          </div>

          {/* عرض الصور */}
          {formData.images.length > 0 ? (
            <div style={styles.imageGrid}>
             {formData.images.map((image, index) => (
                <div key={image.id} style={styles.imageCard}>
                  {image.isPrimary && (
                    <div style={styles.primaryBadge}>
                      <Icons.Star />
                      رئيسية
                    </div>
                  )}
                  <Image 
    src={image.url}
    alt={`Property image ${index + 1}`}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 400px"
  />
                  <div style={styles.imageActions}>
                    <button
                      onClick={() => handleSetPrimaryImage(image.id)}
                      style={styles.iconButton}
                      title={image.isPrimary ? 'الصورة الرئيسية' : 'تعيين كرئيسية'}
                    >
                      {image.isPrimary ? <Icons.Star /> : <Icons.StarBorder />}
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      style={{ ...styles.iconButton, color: '#f44336' }}
                      title="حذف الصورة"
                    >
                      <Icons.Delete />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <Icons.Image />
              <p>لا توجد صور</p>
            </div>
          )}

          {/* روابط الوسائط */}
          <div style={{ marginTop: '32px' }}>
            <h3 style={styles.sectionTitle}>روابط الوسائط</h3>
            <div style={{ ...styles.grid, ...styles.grid2 }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>رابط الجولة الافتراضية</label>
                <input
                  type="url"
                  value={formData.virtualTourUrl || ''}
                  onChange={(e) => handleChange('virtualTourUrl', e.target.value)}
                  placeholder="https://example.com/virtual-tour"
                  style={styles.input}
                  dir="ltr"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>رابط الفيديو</label>
                <input
                  type="url"
                  value={formData.videoUrl || ''}
                  onChange={(e) => handleChange('videoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  style={styles.input}
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </div>
      </TabPanel>

      {/* الموقع */}
      <TabPanel value={activeTab} index={2}>
        <div style={styles.paper}>
          <h3 style={styles.sectionTitle}>
            <Icons.Location />
            موقع العقار
          </h3>
          <div style={styles.divider} />

          <div style={{ ...styles.grid, ...styles.grid2 }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                المدينة<span style={styles.required}>*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                style={{ ...styles.input, ...styles.select, ...(errors.city ? styles.inputError : {}) }}
              >
                <option value="">اختر المدينة</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && <p style={styles.errorText}>{errors.city}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                الحي<span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                style={{ ...styles.input, ...(errors.district ? styles.inputError : {}) }}
              />
              {errors.district && <p style={styles.errorText}>{errors.district}</p>}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              العنوان التفصيلي<span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              style={{ ...styles.input, ...(errors.address ? styles.inputError : {}) }}
            />
            {errors.address && <p style={styles.errorText}>{errors.address}</p>}
          </div>

          <div style={{ ...styles.grid, ...styles.grid2 }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>خط العرض (Latitude)</label>
              <input
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) => handleChange('latitude', e.target.value ? Number(e.target.value) : undefined)}
                style={styles.input}
                dir="ltr"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>خط الطول (Longitude)</label>
              <input
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => handleChange('longitude', e.target.value ? Number(e.target.value) : undefined)}
                style={styles.input}
                dir="ltr"
              />
            </div>
          </div>

          <div style={styles.mapPlaceholder}>
            <Icons.Location />
            <p>الخريطة ستظهر هنا</p>
          </div>
        </div>
      </TabPanel>

      {/* الإعدادات المتقدمة */}
      <TabPanel value={activeTab} index={3}>
        <div style={styles.paper}>
          <h3 style={styles.sectionTitle}>
            <Icons.Settings />
            الإعدادات المتقدمة
          </h3>
          <div style={styles.divider} />

          <div style={styles.switchContainer}>
            <div
              onClick={() => handleChange('isActive', !formData.isActive)}
              style={{
                ...styles.switch,
                ...(formData.isActive ? styles.switchActive : styles.switchInactive),
              }}
            >
              <div style={{ ...styles.switchKnob, left: formData.isActive ? '26px' : '2px' }} />
            </div>
            <div>
              <strong>تفعيل العقار</strong>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
                العقارات النشطة تظهر في نتائج البحث والصفحة الرئيسية
              </p>
            </div>
          </div>

          <div style={styles.switchContainer}>
            <div
              onClick={() => handleChange('isFeatured', !formData.isFeatured)}
              style={{
                ...styles.switch,
                ...(formData.isFeatured ? { ...styles.switchActive, backgroundColor: '#ff9800' } : styles.switchInactive),
              }}
            >
              <div style={{ ...styles.switchKnob, left: formData.isFeatured ? '26px' : '2px' }} />
            </div>
            <div>
              <strong>عقار مميز</strong>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
                العقارات المميزة تظهر في قسم العقارات المميزة
              </p>
            </div>
          </div>
        </div>
      </TabPanel>

      {/* مربع حوار تجاهل التغييرات */}
      {showDiscardDialog && (
        <div style={styles.dialog} onClick={() => setShowDiscardDialog(false)}>
          <div style={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.dialogTitle}>تجاهل التغييرات؟</h3>
            <p>لديك تغييرات غير محفوظة. هل تريد تجاهلها والعودة؟</p>
            <div style={styles.dialogActions}>
              <button
                onClick={() => setShowDiscardDialog(false)}
                style={{ ...styles.button, backgroundColor: '#f5f5f5', color: '#333' }}
              >
                إلغاء
              </button>
              <button
                onClick={() => router.push('/admin/properties')}
                style={{ ...styles.button, backgroundColor: '#f44336', color: '#fff' }}
              >
                تجاهل والعودة
              </button>
              <button
                onClick={async () => {
                  await handleSave();
                  router.push('/admin/properties');
                }}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                حفظ والعودة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مربع حوار السجل */}
      {showHistoryDialog && (
        <div style={styles.dialog} onClick={() => setShowHistoryDialog(false)}>
          <div style={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={styles.dialogTitle}>سجل التغييرات</h3>
              <button onClick={() => setShowHistoryDialog(false)} style={styles.iconButton}>
                <Icons.Close />
              </button>
            </div>
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} style={styles.historyItem}>
                  <strong>{item.action}</strong>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                    بواسطة: {item.userName}
                  </p>
                  <small style={{ color: '#999' }}>
                    {new Date(item.timestamp).toLocaleString('ar-SA')}
                  </small>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#999' }}>لا يوجد سجل تغييرات</p>
            )}
          </div>
        </div>
      )}

      {/* الإشعارات */}
      {snackbar.open && (
        <div
          style={{
            ...styles.snackbar,
            ...(snackbar.severity === 'success' ? styles.snackbarSuccess :
                snackbar.severity === 'error' ? styles.snackbarError : styles.snackbarWarning),
          }}
        >
          {snackbar.message}
          <button
            onClick={() => setSnackbar({ ...snackbar, open: false })}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginRight: '8px' }}
          >
            <Icons.Close />
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #1976d2;
        }
        button:hover:not(:disabled) {
          opacity: 0.9;
        }
        @media (max-width: 768px) {
          .mainGrid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}