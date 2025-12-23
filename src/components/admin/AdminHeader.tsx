// src/components/admin/AdminHeader.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaHome,
  FaUsers,
  FaBuilding,
  FaChartBar,
} from "react-icons/fa";
import Image from 'next/image';
interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
    const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <FaBars className="w-6 h-6 text-gray-600" />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="بحث..."
                className="w-full pr-10 pl-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <FaBell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}  // استخدم image بدلاً من avatar
                      alt={session.user.name || "المستخدم"}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  ) : (
                    <FaUser className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.name?.split(" ")[0]}
                </span>
              </button>

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
                    </div>
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <FaUser className="w-4 h-4" />
                      <span>الملف الشخصي</span>
                    </Link>
                    <Link
                      href="/admin/settings"
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
                      onClick={() => signOut({ callbackUrl: "/" })}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-gray-900 text-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <span className="font-bold text-lg">القائمة</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {[
                { href: "/admin", icon: FaHome, label: "لوحة التحكم" },
                { href: "/admin/users", icon: FaUsers, label: "المستخدمين" },
                { href: "/admin/properties", icon: FaBuilding, label: "العقارات" },
                { href: "/admin/analytics", icon: FaChartBar, label: "الإحصائيات" },
                { href: "/admin/settings", icon: FaCog, label: "الإعدادات" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}