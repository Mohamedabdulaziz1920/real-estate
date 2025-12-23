'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
// الأنماط
const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  breadcrumbs: {
    marginBottom: '16px',
    fontSize: '14px',
    color: '#666',
  },
  breadcrumbLink: {
    color: '#1976d2',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    gap: '8px',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '24px',
  },
  paper: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#1976d2',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '0 auto 16px',
  },
  avatarImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
  },
  userInfo: {
    textAlign: 'center' as const,
    marginBottom: '24px',
  },
  userName: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  userEmail: {
    color: '#666',
    marginBottom: '8px',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
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
    boxSizing: 'border-box' as const,
  },
  inputError: {
    borderColor: '#f44336',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  errorText: {
    color: '#f44336',
    fontSize: '12px',
    marginTop: '4px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
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
  dangerButton: {
    backgroundColor: '#f44336',
    color: '#fff',
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    color: '#333',
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
  },
  statsBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
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
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  activityItem: {
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    display: 'flex',
    gap: '12px',
  },
  activityIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    margin: 0,
    fontSize: '14px',
  },
  activityTime: {
    fontSize: '12px',
    color: '#999',
  },
  tabs: {
    display: 'flex',
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
    transition: 'all 0.3s',
  },
  activeTab: {
    color: '#1976d2',
    borderBottomColor: '#1976d2',
  },
  propertiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
  },
  propertyCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover' as const,
    backgroundColor: '#e0e0e0',
  },
  propertyInfo: {
    padding: '12px',
  },
  propertyTitle: {
    fontWeight: '600',
    marginBottom: '4px',
    fontSize: '14px',
  },
  propertyPrice: {
    color: '#1976d2',
    fontWeight: 'bold',
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
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
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
    zIndex: 1001,
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  switch: {
    width: '50px',
    height: '26px',
    borderRadius: '13px',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'background-color 0.3s',
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
  Edit: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  ),
  User: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  ),
  Email: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  ),
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
    </svg>
  ),
  Activity: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
    </svg>
  ),
  Security: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
    </svg>
  ),
  Block: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  ),
};

// أنواع البيانات
interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'agent' | 'user';
  status: 'active' | 'inactive' | 'blocked';
  avatar?: string;
  address?: string;
  city?: string;
  bio?: string;
  createdAt: string;
  lastLogin: string;
  propertiesCount: number;
  viewsCount: number;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface Activity {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

interface Property {
  id: string;
  title: string;
  price: number;
  image?: string;
  status: string;
}

const roles = [
  { value: 'admin', label: 'مدير', color: '#9c27b0' },
  { value: 'agent', label: 'وكيل عقاري', color: '#1976d2' },
  { value: 'user', label: 'مستخدم', color: '#4caf50' },
];

const statuses = [
  { value: 'active', label: 'نشط', color: '#4caf50' },
  { value: 'inactive', label: 'غير نشط', color: '#ff9800' },
  { value: 'blocked', label: 'محظور', color: '#f44336' },
];

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [activities, setActivities] = useState<Activity[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // جلب بيانات المستخدم
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: UserData = {
        id: userId,
        name: 'أحمد محمد العلي',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        role: 'agent',
        status: 'active',
        avatar: '',
        address: 'شارع الملك فهد',
        city: 'الرياض',
        bio: 'وكيل عقاري معتمد مع خبرة 10 سنوات في السوق العقاري السعودي.',
        createdAt: '2023-06-15T10:30:00Z',
        lastLogin: '2024-01-20T14:45:00Z',
        propertiesCount: 25,
        viewsCount: 15420,
        emailVerified: true,
        phoneVerified: true,
      };

      const mockActivities: Activity[] = [
        { id: '1', action: 'تسجيل دخول', timestamp: '2024-01-20T14:45:00Z' },
        { id: '2', action: 'إضافة عقار جديد', timestamp: '2024-01-19T10:30:00Z', details: 'فيلا في حي النرجس' },
        { id: '3', action: 'تعديل بيانات الحساب', timestamp: '2024-01-18T09:15:00Z' },
        { id: '4', action: 'حذف عقار', timestamp: '2024-01-17T16:20:00Z' },
      ];

      const mockProperties: Property[] = [
        { id: '1', title: 'فيلا فاخرة في النرجس', price: 2500000, status: 'available' },
        { id: '2', title: 'شقة في حي الملقا', price: 850000, status: 'sold' },
        { id: '3', title: 'أرض تجارية', price: 5000000, status: 'available' },
      ];

      setUser(mockUser);
      setFormData(mockUser);
      setActivities(mockActivities);
      setProperties(mockProperties);
    } catch {
      setSnackbar({ open: true, message: 'حدث خطأ في جلب البيانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // معالجة تغيير الحقول
  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // حفظ التغييرات
  const handleSave = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'يرجى تصحيح الأخطاء', severity: 'error' });
      return;
    }

    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUser(prev => prev ? { ...prev, ...formData } : null);
      setSnackbar({ open: true, message: 'تم حفظ التغييرات بنجاح', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'حدث خطأ في الحفظ', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // حذف المستخدم
  const handleDelete = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSnackbar({ open: true, message: 'تم حذف المستخدم', severity: 'success' });
      router.push('/admin/users');
    } catch {
      setSnackbar({ open: true, message: 'حدث خطأ', severity: 'error' });
    }
  };

  // حظر/إلغاء حظر المستخدم
  const handleToggleBlock = async () => {
    try {
      const newStatus = user?.status === 'blocked' ? 'active' : 'blocked';
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(prev => prev ? { ...prev, status: newStatus } : null);
      setFormData(prev => ({ ...prev, status: newStatus }));
      setShowBlockDialog(false);
      setSnackbar({
        open: true,
        message: newStatus === 'blocked' ? 'تم حظر المستخدم' : 'تم إلغاء حظر المستخدم',
        severity: 'success'
      });
    } catch {
      setSnackbar({ open: true, message: 'حدث خطأ', severity: 'error' });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.value === role) || roles[2];
  };

  const getStatusInfo = (status: string) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>جاري تحميل بيانات المستخدم...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ ...styles.container, textAlign: 'center' }}>
        <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
          <p style={{ color: '#c62828' }}>لم يتم العثور على المستخدم</p>
        </div>
        <button
          onClick={() => router.push('/admin/users')}
          style={{ ...styles.button, ...styles.primaryButton, marginTop: '16px' }}
        >
          العودة لقائمة المستخدمين
        </button>
      </div>
    );
  }

  const roleInfo = getRoleInfo(user.role);
  const statusInfo = getStatusInfo(user.status);

  return (
    <div style={styles.container}>
      {/* شريط التنقل */}
      <div style={styles.breadcrumbs}>
        <span style={styles.breadcrumbLink} onClick={() => router.push('/admin')}>
          لوحة التحكم
        </span>
        {' / '}
        <span style={styles.breadcrumbLink} onClick={() => router.push('/admin/users')}>
          المستخدمين
        </span>
        {' / '}
        <span>{user.name}</span>
      </div>

      {/* العنوان */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => router.push('/admin/users')} style={styles.iconButton}>
            <Icons.ArrowBack />
          </button>
          <h1 style={styles.title}>تفاصيل المستخدم</h1>
        </div>
        <div style={styles.headerRight}>
          <button
            onClick={() => setShowBlockDialog(true)}
            style={{
              ...styles.button,
              ...styles.outlinedButton,
              color: user.status === 'blocked' ? '#4caf50' : '#f44336',
            }}
          >
            <Icons.Block />
            {user.status === 'blocked' ? 'إلغاء الحظر' : 'حظر'}
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            style={{ ...styles.button, ...styles.dangerButton }}
          >
            <Icons.Delete />
            حذف
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? (
              <div style={{ ...styles.spinner, width: '20px', height: '20px', borderWidth: '2px' }} />
            ) : (
              <Icons.Save />
            )}
            حفظ التغييرات
          </button>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* المحتوى الرئيسي */}
        <div>
          {/* التبويبات */}
          <div style={styles.tabs}>
            {['المعلومات الأساسية', 'العقارات', 'سجل النشاط', 'الأمان'].map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                style={{
                  ...styles.tab,
                  ...(activeTab === index ? styles.activeTab : {}),
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* المعلومات الأساسية */}
          {activeTab === 0 && (
            <div style={styles.paper}>
              <h3 style={styles.sectionTitle}>
                <Icons.User />
                البيانات الشخصية
              </h3>
              <div style={styles.divider} />

              <div style={styles.grid2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    الاسم الكامل<span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                  />
                  {errors.name && <p style={styles.errorText}>{errors.name}</p>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    البريد الإلكتروني<span style={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
                    dir="ltr"
                  />
                  {errors.email && <p style={styles.errorText}>{errors.email}</p>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    رقم الهاتف<span style={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
                    dir="ltr"
                  />
                  {errors.phone && <p style={styles.errorText}>{errors.phone}</p>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>الصلاحية</label>
                  <select
                    value={formData.role || 'user'}
                    onChange={(e) => handleChange('role', e.target.value)}
                    style={styles.select}
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>المدينة</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>العنوان</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>نبذة تعريفية</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* العقارات */}
          {activeTab === 1 && (
            <div style={styles.paper}>
              <h3 style={styles.sectionTitle}>
                <Icons.Home />
                عقارات المستخدم ({properties.length})
              </h3>
              <div style={styles.divider} />

              {properties.length > 0 ? (
                <div style={styles.propertiesGrid}>
                  {properties.map(property => (
                    <div key={property.id} style={styles.propertyCard}>
                      <div style={styles.propertyImage}>
                        <div style={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999',
                        }}>
                          <Icons.Home />
                        </div>
                      </div>
                      <div style={styles.propertyInfo}>
                        <p style={styles.propertyTitle}>{property.title}</p>
                        <p style={styles.propertyPrice}>
                          {property.price.toLocaleString()} ر.س
                        </p>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: property.status === 'available' ? '#e8f5e9' : '#ffebee',
                          color: property.status === 'available' ? '#4caf50' : '#f44336',
                        }}>
                          {property.status === 'available' ? 'متاح' : 'مباع'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999' }}>لا توجد عقارات</p>
              )}
            </div>
          )}

          {/* سجل النشاط */}
          {activeTab === 2 && (
            <div style={styles.paper}>
              <h3 style={styles.sectionTitle}>
                <Icons.Activity />
                سجل النشاط
              </h3>
              <div style={styles.divider} />

              <ul style={styles.activityList}>
                {activities.map(activity => (
                  <li key={activity.id} style={styles.activityItem}>
                    <div style={styles.activityIcon}>
                      <Icons.Activity />
                    </div>
                    <div style={styles.activityContent}>
                      <p style={styles.activityText}>
                        <strong>{activity.action}</strong>
                        {activity.details && ` - ${activity.details}`}
                      </p>
                      <span style={styles.activityTime}>
                        {new Date(activity.timestamp).toLocaleString('ar-SA')}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* الأمان */}
          {activeTab === 3 && (
            <div style={styles.paper}>
              <h3 style={styles.sectionTitle}>
                <Icons.Security />
                إعدادات الأمان
              </h3>
              <div style={styles.divider} />

              <div style={styles.switchContainer}>
                <div>
                  <strong>البريد الإلكتروني موثق</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
                    {user.email}
                  </p>
                </div>
                <span style={{
                  ...styles.badge,
                  backgroundColor: user.emailVerified ? '#e8f5e9' : '#fff3e0',
                  color: user.emailVerified ? '#4caf50' : '#ff9800',
                }}>
                  {user.emailVerified ? 'موثق' : 'غير موثق'}
                </span>
              </div>

              <div style={styles.switchContainer}>
                <div>
                  <strong>رقم الهاتف موثق</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
                    {user.phone}
                  </p>
                </div>
                <span style={{
                  ...styles.badge,
                  backgroundColor: user.phoneVerified ? '#e8f5e9' : '#fff3e0',
                  color: user.phoneVerified ? '#4caf50' : '#ff9800',
                }}>
                  {user.phoneVerified ? 'موثق' : 'غير موثق'}
                </span>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button style={{ ...styles.button, ...styles.outlinedButton }}>
                  إعادة تعيين كلمة المرور
                </button>
              </div>
            </div>
          )}
        </div>

        {/* الشريط الجانبي */}
        <div>
          <div style={styles.paper}>
            <div style={styles.userInfo}>
              {user.avatar ? (
                <Image 
    src={user.avatar || "/default-avatar.png"} 
    alt={user.name || "User"}
    fill
    className="object-cover"
    sizes="96px"
  />
              ) : (
                <div style={styles.avatar}>{getInitials(user.name)}</div>
              )}
              <h3 style={styles.userName}>{user.name}</h3>
              <p style={styles.userEmail}>{user.email}</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <span style={{
                  ...styles.badge,
                  backgroundColor: `${roleInfo.color}20`,
                  color: roleInfo.color,
                }}>
                  {roleInfo.label}
                </span>
                <span style={{
                  ...styles.badge,
                  backgroundColor: `${statusInfo.color}20`,
                  color: statusInfo.color,
                }}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          <div style={styles.paper}>
            <h3 style={styles.sectionTitle}>الإحصائيات</h3>
            <div style={styles.divider} />

            <div style={styles.statsBox}>
              <span style={styles.statsLabel}>العقارات</span>
              <span style={styles.statsValue}>{user.propertiesCount}</span>
            </div>
            <div style={styles.statsBox}>
              <span style={styles.statsLabel}>المشاهدات</span>
              <span style={styles.statsValue}>{user.viewsCount.toLocaleString()}</span>
            </div>
            <div style={styles.statsBox}>
              <span style={styles.statsLabel}>تاريخ التسجيل</span>
              <span style={styles.statsValue}>
                {new Date(user.createdAt).toLocaleDateString('ar-SA')}
              </span>
            </div>
            <div style={{ ...styles.statsBox, borderBottom: 'none' }}>
              <span style={styles.statsLabel}>آخر دخول</span>
              <span style={styles.statsValue}>
                {new Date(user.lastLogin).toLocaleDateString('ar-SA')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* مربع حوار الحذف */}
      {showDeleteDialog && (
        <div style={styles.dialog} onClick={() => setShowDeleteDialog(false)}>
          <div style={styles.dialogContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.dialogTitle}>حذف المستخدم</h3>
            <p>هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div style={styles.dialogActions}>
              <button
                onClick={() => setShowDeleteDialog(false)}
                style={{ ...styles.button, ...styles.outlinedButton }}
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                style={{ ...styles.button, ...styles.dangerButton }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مربع حوار الحظر */}
      {showBlockDialog && (
        <div style={styles.dialog} onClick={() => setShowBlockDialog(false)}>
          <div style={styles.dialogContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.dialogTitle}>
              {user.status === 'blocked' ? 'إلغاء حظر المستخدم' : 'حظر المستخدم'}
            </h3>
            <p>
              {user.status === 'blocked'
                ? 'هل تريد إلغاء حظر هذا المستخدم؟'
                : 'هل أنت متأكد من حظر هذا المستخدم؟'}
            </p>
            <div style={styles.dialogActions}>
              <button
                onClick={() => setShowBlockDialog(false)}
                style={{ ...styles.button, ...styles.outlinedButton }}
              >
                إلغاء
              </button>
              <button
                onClick={handleToggleBlock}
                style={{
                  ...styles.button,
                  backgroundColor: user.status === 'blocked' ? '#4caf50' : '#f44336',
                  color: '#fff',
                }}
              >
                {user.status === 'blocked' ? 'إلغاء الحظر' : 'حظر'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الإشعارات */}
      {snackbar.open && (
        <div style={{
          ...styles.snackbar,
          backgroundColor: snackbar.severity === 'success' ? '#4caf50' : '#f44336',
        }}>
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
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #1976d2;
        }
        button:hover:not(:disabled) {
          opacity: 0.9;
        }
        @media (max-width: 900px) {
          .mainGrid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}