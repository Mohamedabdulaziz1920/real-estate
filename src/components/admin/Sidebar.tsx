'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaUserTie,
  FaChartBar,
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaBell,
  FaComments,
  FaFileAlt,
} from 'react-icons/fa';
import { signOut } from 'next-auth/react';

const menuItems = [
  { href: '/admin', label: 'الرئيسية', icon: FaHome },
  { href: '/admin/properties', label: 'العقارات', icon: FaBuilding },
  { href: '/admin/users', label: 'المستخدمين', icon: FaUsers },
  { href: '/admin/agents', label: 'الوكلاء', icon: FaUserTie },
  { href: '/admin/reports', label: 'التقارير', icon: FaChartBar },
  { href: '/admin/messages', label: 'الرسائل', icon: FaComments },
  { href: '/admin/pages', label: 'الصفحات', icon: FaFileAlt },
  { href: '/admin/settings', label: 'الإعدادات', icon: FaCog },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-emerald-600 text-white rounded-xl shadow-lg"
      >
        {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">ع</span>
            </div>
            <div>
              <span className="text-xl font-bold">عقاري</span>
              <span className="block text-xs text-gray-400">لوحة التحكم</span>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-colors mb-2"
          >
            <FaHome className="w-5 h-5" />
            <span>الموقع الرئيسي</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-xl transition-colors w-full"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}