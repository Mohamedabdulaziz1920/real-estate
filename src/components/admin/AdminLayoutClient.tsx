// src/components/admin/AdminLayoutClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaChartBar,
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaTags,
  FaEnvelope,
  FaFileAlt,
  FaChevronDown,
  FaUserShield,
} from "react-icons/fa";
import Image from 'next/image';
interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

const menuItems = [
  {
    title: "الرئيسية",
    items: [
      { icon: FaChartBar, label: "لوحة التحكم", href: "/admin" },
    ],
  },
  {
    title: "إدارة المحتوى",
    items: [
      { icon: FaBuilding, label: "العقارات", href: "/admin/properties" },
      { icon: FaTags, label: "التصنيفات", href: "/admin/categories" },
      { icon: FaUsers, label: "المستخدمين", href: "/admin/users" },
    ],
  },
  {
    title: "التواصل",
    items: [
      { icon: FaEnvelope, label: "الرسائل", href: "/admin/messages" },
    ],
  },
  {
    title: "التقارير",
    items: [
      { icon: FaFileAlt, label: "التقارير", href: "/admin/reports" },
    ],
  },
  {
    title: "النظام",
    items: [
      { icon: FaCog, label: "الإعدادات", href: "/admin/settings" },
    ],
  },
];

export default function AdminLayoutClient({
  children,
  user,
}: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full bg-gray-900 text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${
          mobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaUserShield className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <span className="text-lg font-bold">عقاري</span>
                <p className="text-xs text-gray-400">لوحة التحكم</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map((section) => (
            <div key={section.title}>
              {sidebarOpen && (
                <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                        title={!sidebarOpen ? item.label : undefined}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-colors"
            title={!sidebarOpen ? "العودة للموقع" : undefined}
          >
            <FaHome className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>العودة للموقع</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-xl transition-colors w-full mt-2"
            title={!sidebarOpen ? "تسجيل الخروج" : undefined}
          >
            <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:mr-64" : "lg:mr-20"
        }`}
      >
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <FaBars className="w-6 h-6" />
              </button>

              {/* Toggle Sidebar */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <FaBars className="w-5 h-5" />
              </button>

              {/* Search */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="بحث..."
                    className="w-64 pr-10 pl-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                    {user.image ? (
                <Image 
    src={user.image || "/default-avatar.png"} 
    alt={user.name || "User"}
    fill
    className="object-cover"
    sizes="32px"
  />
                    ) : (
                      <span className="text-emerald-700 font-semibold">
                        {user.name?.charAt(0) || "م"}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {user.name || "مدير النظام"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <FaChevronDown className="w-3 h-3 text-gray-400 hidden md:block" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                        <span className="inline-flex mt-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          مدير النظام
                        </span>
                      </div>
                      <Link
                        href="/admin/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <FaUsers className="w-4 h-4" />
                        <span>الملف الشخصي</span>
                      </Link>
                      <Link
                        href="/admin/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <FaCog className="w-4 h-4" />
                        <span>الإعدادات</span>
                      </Link>
                      <hr className="my-2" />
                      <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <FaHome className="w-4 h-4" />
                        <span>الموقع الرئيسي</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}