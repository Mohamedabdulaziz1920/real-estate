// src/components/layout/Footer.tsx
import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">ع</span>
              </div>
              <span className="text-xl font-bold">عقاري</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              منصة عقارية رائدة في المملكة العربية السعودية نساعدك في العثور على
              منزل أحلامك بكل سهولة.
            </p>
            <div className="flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaWhatsapp].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/properties", label: "العقارات" },
                { href: "/add-property", label: "أضف عقارك" },
                { href: "/about", label: "من نحن" },
                { href: "/contact", label: "تواصل معنا" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">أنواع العقارات</h3>
            <ul className="space-y-2">
              {[
                { href: "/properties?type=apartment", label: "شقق" },
                { href: "/properties?type=villa", label: "فلل" },
                { href: "/properties?type=land", label: "أراضي" },
                { href: "/properties?type=building", label: "عمارات" },
                { href: "/properties?type=office", label: "مكاتب" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <FaMapMarkerAlt className="w-5 h-5 text-emerald-500" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaPhone className="w-5 h-5 text-emerald-500" />
                <span dir="ltr">+966 50 000 0000</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="w-5 h-5 text-emerald-500" />
                <span>info@aqari.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} عقاري. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              الشروط والأحكام
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              سياسة الخصوصية
            </Link>
          </div>
        </div>
         {/* Developer Credit */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <Link
              href="https://mohammed-almalgami.com/"
              className="
                inline-flex items-center gap-2
                text-sm text-gray-500
                hover:text-primary transition-colors
                group
              "
            >
              <span>تصميم وبرمجة :</span>
              <span className="text-gray-400 group-hover:text-primary font-medium">
                محمد الملجمي
              </span>
            </Link>
          </div>
   
      </div>
    </footer>
  );
}