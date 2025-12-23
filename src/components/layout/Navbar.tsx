"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBuilding,
  FaPlus,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaHeart,
  FaCog,
  FaUserShield,
} from "react-icons/fa";

// استيراد الهوك الخاص بالإعدادات
import { useGeneralSettings } from "@/contexts/GeneralSettingsContext";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // استخدام إعدادات الموقع
  const { settings, isLoading } = useGeneralSettings();

  // لا تعرض الـ Navbar في صفحات الأدمن
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: FaHome },
    { href: "/properties", label: "العقارات", icon: FaBuilding },
    { href: "/add-property", label: "أضف عقارك", icon: FaPlus },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // جلب الشعار من الإعدادات أو استخدام الشعار الافتراضي
  const logoUrl = settings?.logo || "/logo.png";
  const siteName = settings?.siteName || "عقاري";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              {!isLoading && settings?.logo ? (
                <div className="relative w-8 h-8">
                  <Image
                    src={logoUrl}
                    alt={siteName}
                    fill
                    className="object-contain"
                    sizes="32px"
                    priority
                  />
                </div>
              ) : (
                <span className="text-white text-xl font-bold">ع</span>
              )}
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              {siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
                    {session.user?.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={session.user.image}
                          alt={session.user?.name || "المستخدم"}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      </div>
                    ) : (
                      <FaUser className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-700 block text-sm">
                      {session.user?.name?.split(" ")[0]}
                    </span>
                    {session.user?.role === "admin" && (
                      <span className="text-xs text-red-500">مدير</span>
                    )}
                  </div>
                  <FaChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="font-medium text-gray-900">
                          {session.user?.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>

                      {/* رابط لوحة التحكم للأدمن */}
                      {session.user?.role === "admin" && (
                        <>
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 font-medium"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FaUserShield className="w-4 h-4" />
                            <span>لوحة التحكم</span>
                          </Link>
                          <hr className="my-2" />
                        </>
                      )}

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaUser className="w-4 h-4" />
                        <span>الملف الشخصي</span>
                      </Link>
                      <Link
                        href="/my-properties"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaBuilding className="w-4 h-4" />
                        <span>عقاراتي</span>
                      </Link>
                      <Link
                        href="/favorites"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaHeart className="w-4 h-4" />
                        <span>المفضلة</span>
                      </Link>
                      <hr className="my-2" />
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
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <FaTimes className="w-6 h-6 text-gray-600" />
            ) : (
              <FaBars className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                    isActive(link.href)
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              {session ? (
                <div className="space-y-1">
                  {/* رابط لوحة التحكم للأدمن في الموبايل */}
                  {session.user?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 bg-red-50 rounded-xl font-medium"
                    >
                      <FaUserShield className="w-5 h-5" />
                      <span>لوحة التحكم</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl"
                  >
                    <FaUser className="w-5 h-5" />
                    <span>الملف الشخصي</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full"
                  >
                    <FaSignOutAlt className="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-4">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center border border-gray-200 text-gray-700 rounded-xl font-medium"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center bg-emerald-600 text-white rounded-xl font-medium"
                  >
                    إنشاء حساب
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}