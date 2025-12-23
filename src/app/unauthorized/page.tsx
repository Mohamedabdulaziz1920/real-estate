// src/app/unauthorized/page.tsx
import Link from "next/link";
import { FaLock, FaHome } from "react-icons/fa";
import BackButton from "@/components/ui/BackButton";

export default function UnauthorizedPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
      dir="rtl"
    >
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <FaLock className="w-16 h-16 text-red-500" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
            403
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          غير مصرح لك بالوصول
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          عذراً، ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة.
          <br />
          إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع المسؤول.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-200"
          >
            <FaHome className="w-5 h-5" />
            <span>الصفحة الرئيسية</span>
          </Link>

          <BackButton />
        </div>

        {/* Contact */}
        <p className="mt-8 text-sm text-gray-500">
          هل تحتاج مساعدة؟{" "}
          <Link href="/contact" className="text-emerald-600 hover:underline">
            تواصل معنا
          </Link>
        </p>
      </div>
    </main>
  );
}