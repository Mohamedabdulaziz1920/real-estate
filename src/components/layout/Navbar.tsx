"use client";

import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  
  // استخدام إعدادات الموقع
  const { settings, isLoading } = useGeneralSettings();

  // تأثير التمرير لتغيير مظهر الـ Navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // لا تعرض الـ Navbar في صفحات الأدمن
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: FaHome },
    { href: "/properties", label: "العقارات", icon: FaBuilding },
    { href: "/properties?listingType=sale", label: "للبيع" },
    { href: "/properties?listingType=rent", label: "للإيجار" },
    { href: "/add-property", label: "أضف عقارك", icon: FaPlus, highlight: true },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // جلب الشعار من الإعدادات أو استخدام الشعار الافتراضي
  const logoUrl = settings?.logo || "/logo.png";
  const siteName = settings?.siteName || "عقاري";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg" 
        : "bg-white border-b border-gray-100"
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
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
          <div className="hidden lg:flex items-center gap-1 mx-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-emerald-50 text-emerald-600"
                    : link.highlight
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
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
                  aria-expanded={userMenuOpen}
                  aria-label="قائمة المستخدم"
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
                  <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div 
                      className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-50 animate-in slide-in-from-top-2 duration-200"
                      role="menu"
                    >
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
                            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 font-medium transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                            role="menuitem"
                          >
                            <FaUserShield className="w-4 h-4" />
                            <span>لوحة التحكم</span>
                          </Link>
                          <hr className="my-2 border-gray-100" />
                        </>
                      )}

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <FaUser className="w-4 h-4" />
                        <span>الملف الشخصي</span>
                      </Link>
                      <Link
                        href="/my-properties"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <FaBuilding className="w-4 h-4" />
                        <span>عقاراتي</span>
                      </Link>
                      <Link
                        href="/favorites"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <FaHeart className="w-4 h-4" />
                        <span>المفضلة</span>
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full transition-colors text-right"
                        role="menuitem"
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
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileMenuOpen}
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
          <div className="lg:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-emerald-50 text-emerald-600"
                      : link.highlight
                      ? "bg-emerald-500 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
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
                      className="flex items-center gap-3 px-4 py-3 text-red-600 bg-red-50 rounded-xl font-medium transition-colors"
                    >
                      <FaUserShield className="w-5 h-5" />
                      <span>لوحة التحكم</span>
                    </Link>
                  )}
                  
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">
                      {session.user?.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <FaUser className="w-5 h-5" />
                    <span>الملف الشخصي</span>
                  </Link>
                  <Link
                    href="/my-properties"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <FaBuilding className="w-5 h-5" />
                    <span>عقاراتي</span>
                  </Link>
                  <Link
                    href="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <FaHeart className="w-5 h-5" />
                    <span>المفضلة</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors text-right"
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
                    className="py-2.5 text-center border border-gray-200 text-gray-700 rounded-xl font-medium transition-colors hover:bg-gray-50"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center bg-emerald-600 text-white rounded-xl font-medium transition-colors hover:bg-emerald-700"
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