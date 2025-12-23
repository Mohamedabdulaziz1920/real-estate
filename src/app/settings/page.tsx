'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaLock,
  FaBell,
  FaTrash,
  FaSpinner,
  FaCheck,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaUser,
  FaShieldAlt,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

type SettingsTab = 'password' | 'notifications' | 'danger';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newMessages: boolean;
  propertyUpdates: boolean;
  priceAlerts: boolean;
  newsletter: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState<SettingsTab>('password');
  const [loading, setLoading] = useState(false);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    newMessages: true,
    propertyUpdates: true,
    priceAlerts: true,
    newsletter: false,
  });
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  // Delete Account State
  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmation: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotificationSettings();
    }
  }, [status]);

  const fetchNotificationSettings = async () => {
    try {
      const res = await fetch('/api/user/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      toast.error('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('تم تغيير كلمة المرور بنجاح');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (key: keyof NotificationSettings) => {
    const newSettings = { ...notifications, [key]: !notifications[key] };
    setNotifications(newSettings);

    try {
      const res = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      const data = await res.json();

      if (!data.success) {
        // Revert on error
        setNotifications(notifications);
        toast.error('حدث خطأ');
      }
    } catch (error) {
      setNotifications(notifications);
      toast.error('حدث خطأ');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteData.confirmation !== 'DELETE') {
      toast.error('يرجى كتابة DELETE للتأكيد');
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deleteData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('تم حذف الحساب');
        await signOut({ callbackUrl: '/' });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setDeleting(false);
    }
  };

  const tabs = [
    { id: 'password', label: 'كلمة المرور', icon: FaLock },
    { id: 'notifications', label: 'الإشعارات', icon: FaBell },
    { id: 'danger', label: 'منطقة الخطر', icon: FaExclamationTriangle },
  ];

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
      </main>
    );
  }

  if (!session) {
    router.push('/auth/login?callbackUrl=/settings');
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/profile"
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <FaArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">الإعدادات</h1>
            <p className="text-gray-500">إدارة إعدادات حسابك</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    } ${tab.id === 'danger' ? 'text-red-600 hover:bg-red-50' : ''}`}
                  >
                    <tab.icon className={`w-5 h-5 ${
                      tab.id === 'danger' 
                        ? 'text-red-500' 
                        : activeTab === tab.id 
                          ? 'text-emerald-600' 
                          : 'text-gray-400'
                    }`} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <FaShieldAlt className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">تغيير كلمة المرور</h2>
                    <p className="text-gray-500 text-sm">تأكد من استخدام كلمة مرور قوية</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كلمة المرور الحالية
                    </label>
                    <div className="relative">
                      <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                        className="w-full pr-12 pl-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        minLength={6}
                        className="w-full pr-12 pl-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">6 أحرف على الأقل</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                        className="w-full pr-12 pl-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="w-5 h-5 animate-spin" />
                        <span>جاري الحفظ...</span>
                      </>
                    ) : (
                      <>
                        <FaCheck className="w-5 h-5" />
                        <span>تغيير كلمة المرور</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaBell className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">إعدادات الإشعارات</h2>
                    <p className="text-gray-500 text-sm">تحكم في الإشعارات التي تصلك</p>
                  </div>
                </div>

                {notificationsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="font-medium text-gray-800">إشعارات البريد الإلكتروني</h4>
                        <p className="text-sm text-gray-500">استلام الإشعارات عبر البريد</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('emailNotifications')}
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.emailNotifications ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            notifications.emailNotifications ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Push Notifications */}
                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="font-medium text-gray-800">إشعارات الدفع</h4>
                        <p className="text-sm text-gray-500">إشعارات المتصفح الفورية</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('pushNotifications')}
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.pushNotifications ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            notifications.pushNotifications ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* New Messages */}
                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="font-medium text-gray-800">الرسائل الجديدة</h4>
                        <p className="text-sm text-gray-500">إشعار عند استلام رسالة</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('newMessages')}
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.newMessages ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            notifications.newMessages ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Property Updates */}
                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="font-medium text-gray-800">تحديثات العقارات</h4>
                        <p className="text-sm text-gray-500">إشعار بتحديثات العقارات المفضلة</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('propertyUpdates')}
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.propertyUpdates ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            notifications.propertyUpdates ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Price Alerts */}
                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="font-medium text-gray-800">تنبيهات الأسعار</h4>
                        <p className="text-sm text-gray-500">إشعار عند تغير أسعار العقارات</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('priceAlerts')}
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.priceAlerts ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            notifications.priceAlerts ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Newsletter */}
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h4 className="font-medium text-gray-800">النشرة البريدية</h4>
                        <p className="text-sm text-gray-500">أخبار وعروض حصرية</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('newsletter')}
                        className={`relative w-14 h-7 rounded-full transition-colors ${
                          notifications.newsletter ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            notifications.newsletter ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-red-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-red-600">منطقة الخطر</h2>
                    <p className="text-gray-500 text-sm">إجراءات لا يمكن التراجع عنها</p>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="font-bold text-red-800 mb-2">حذف الحساب نهائياً</h3>
                  <p className="text-red-700 text-sm mb-4">
                    سيتم حذف جميع بياناتك وعقاراتك بشكل نهائي ولا يمكن استرجاعها.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                    <span>حذف حسابي</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">هل أنت متأكد؟</h3>
              <p className="text-gray-600 mt-2">
                سيتم حذف حسابك وجميع بياناتك نهائياً ولا يمكن استرجاعها.
              </p>
            </div>

            <div className="space-y-4">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={deleteData.password}
                  onChange={(e) => setDeleteData({ ...deleteData, password: e.target.value })}
                  placeholder="أدخل كلمة المرور"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Confirmation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اكتب DELETE للتأكيد
                </label>
                <input
                  type="text"
                  value={deleteData.confirmation}
                  onChange={(e) => setDeleteData({ ...deleteData, confirmation: e.target.value })}
                  placeholder="DELETE"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteData({ password: '', confirmation: '' });
                }}
                disabled={deleting}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteData.confirmation !== 'DELETE'}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <span>حذف الحساب</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}