'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaCamera,
  FaSpinner,
  FaHome,
  FaHeart,
  FaEye,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaCog,
  FaTrash,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  image?: string;
  role: string;
  createdAt: string;
  emailVerified?: string;
}

interface Stats {
  propertiesCount: number;
  favoritesCount: number;
  totalViews: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats>({ propertiesCount: 0, favoritesCount: 0, totalViews: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();

      if (data.success) {
        setUser(data.data.user);
        setStats(data.data.stats);
        setFormData({
          name: data.data.user.name || '',
          phone: data.data.user.phone || '',
          bio: data.data.user.bio || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.data);
        setEditing(false);
        toast.success('تم تحديث البيانات بنجاح');
        
        // تحديث الجلسة
        await update({ name: formData.name });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      toast.error('يجب اختيار صورة');
      return;
    }

    // التحقق من حجم الملف
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 2MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setUser((prev) => prev ? { ...prev, image: data.image } : null);
        toast.success('تم تحديث الصورة بنجاح');
        
        // تحديث الجلسة
        await update({ image: data.image });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('حدث خطأ في رفع الصورة');
    } finally {
      setUploadingImage(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      user: 'مستخدم',
      agent: 'وكيل عقاري',
      admin: 'مدير',
    };
    return roles[role] || role;
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
      </main>
    );
  }

  if (!session) {
    router.push('/auth/login?callbackUrl=/profile');
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">الملف الشخصي</h1>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-white rounded-xl transition-colors"
          >
            <FaCog className="w-5 h-5" />
            <span>الإعدادات</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-600" />

          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4">
              <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                {uploadingImage ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
                  </div>
                ) : (
                  <Image
                    src={user?.image || '/images/default-avatar.png'}
                    alt={user?.name || 'User'}
                    fill
                    className="object-cover"
                  />
                )}
                
                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <FaCamera className="w-8 h-8 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name & Role */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {getRoleName(user?.role || 'user')}
                  </span>
                  {user?.emailVerified && (
                    <span className="flex items-center gap-1 text-emerald-600 text-sm">
                      <FaCheck className="w-4 h-4" />
                      موثق
                    </span>
                  )}
                </div>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>تعديل</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    <FaTimes className="w-4 h-4" />
                    <span>إلغاء</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <FaSpinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <FaCheck className="w-4 h-4" />
                    )}
                    <span>حفظ</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaHome className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.propertiesCount}</div>
            <div className="text-gray-500 text-sm">عقار</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaHeart className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.favoritesCount}</div>
            <div className="text-gray-500 text-sm">مفضلة</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaEye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalViews}</div>
            <div className="text-gray-500 text-sm">مشاهدة</div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">البيانات الشخصية</h3>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                الاسم الكامل
              </label>
              {editing ? (
                <div className="relative">
                  <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
              ) : (
                <p className="text-gray-800 text-lg">{user?.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                البريد الإلكتروني
              </label>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400" />
                <p className="text-gray-800">{user?.email}</p>
                {user?.emailVerified && (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                    موثق
                  </span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                رقم الجوال
              </label>
              {editing ? (
                <div className="relative">
                  <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="05xxxxxxxx"
                    className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    dir="ltr"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400" />
                  <p className="text-gray-800" dir="ltr">
                    {user?.phone || 'لم يتم إضافة رقم'}
                  </p>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                نبذة عني
              </label>
              {editing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  placeholder="اكتب نبذة مختصرة عنك..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                />
              ) : (
                <p className="text-gray-800">
                  {user?.bio || 'لم تتم إضافة نبذة'}
                </p>
              )}
            </div>

            {/* Join Date */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                تاريخ الانضمام
              </label>
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-gray-400" />
                <p className="text-gray-800">{user?.createdAt && formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link
            href="/my-properties"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FaHome className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">عقاراتي</h4>
              <p className="text-sm text-gray-500">إدارة عقاراتك</p>
            </div>
          </Link>

          <Link
            href="/favorites"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FaHeart className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">المفضلة</h4>
              <p className="text-sm text-gray-500">العقارات المحفوظة</p>
            </div>
          </Link>

          <Link
            href="/settings"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FaCog className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">الإعدادات</h4>
              <p className="text-sm text-gray-500">إعدادات الحساب</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}