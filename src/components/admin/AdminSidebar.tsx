// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaTags,
  FaEnvelope,
  FaBell,
  FaFileAlt,
} from "react-icons/fa";
import { signOut } from "next-auth/react";

const menuItems = [
  {
    title: "الرئيسية",
    items: [
      { href: "/admin", icon: FaHome, label: "لوحة التحكم" },
      { href: "/admin/analytics", icon: FaChartBar, label: "الإحصائيات" },
    ],
  },
  {
    title: "إدارة المحتوى",
    items: [
      { href: "/admin/properties", icon: FaBuilding, label: "العقارات" },
      { href: "/admin/categories", icon: FaTags, label: "التصنيفات" },
      { href: "/admin/users", icon: FaUsers, label: "المستخدمين" },
    ],
  },
  {
    title: "التواصل",
    items: [
      { href: "/admin/messages", icon: FaEnvelope, label: "الرسائل" },
      { href: "/admin/notifications", icon: FaBell, label: "الإشعارات" },
    ],
  },
  {
    title: "التقارير",
    items: [
      { href: "/admin/reports", icon: FaFileAlt, label: "التقارير" },
    ],
  },
  {
    title: "الإعدادات",
    items: [
      { href: "/admin/settings", icon: FaCog, label: "الإعدادات" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:right-0 bg-gray-900 text-white">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <span className="text-xl font-bold">ع</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">عقاري</h1>
            <p className="text-xs text-gray-400">لوحة التحكم</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1 px-3">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                          isActive
                            ? "bg-emerald-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}