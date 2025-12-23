'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'الرئيسية', href: '/' },
    { name: 'العقارات', href: '/properties' },
    { name: 'للبيع', href: '/properties?listingType=sale' },
    { name: 'للإيجار', href: '/properties?listingType=rent' },
    { name: 'من نحن', href: '/about' },
    { name: 'اتصل بنا', href: '/contact' },
  ];

  return (
    <header style={{
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <nav style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px',
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#059669',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>ع</span>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>عقاري</span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{
            display: 'none',
            gap: '2rem',
          }} className="desktop-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  fontWeight: '500',
                  color: pathname === item.href ? '#059669' : '#4b5563',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '1rem',
          }} className="desktop-actions">
            <Link
              href="/add-property"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ecfdf5',
                color: '#047857',
                borderRadius: '12px',
                fontWeight: '500',
                textDecoration: 'none',
              }}
            >
              <span>+</span>
              <span>أضف عقار</span>
            </Link>
            <Link
              href="/auth/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.5rem',
                backgroundColor: '#059669',
                color: 'white',
                borderRadius: '12px',
                fontWeight: '500',
                textDecoration: 'none',
              }}
            >
              تسجيل الدخول
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              padding: '0.5rem',
              color: '#4b5563',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'block',
            }}
            className="mobile-menu-btn"
          >
            {isOpen ? (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div style={{
            padding: '1rem 0',
            borderTop: '1px solid #e5e7eb',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontWeight: '500',
                    padding: '0.5rem 0',
                    color: pathname === item.href ? '#059669' : '#4b5563',
                    textDecoration: 'none',
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <Link
                  href="/add-property"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    borderRadius: '12px',
                    fontWeight: '500',
                    textDecoration: 'none',
                  }}
                >
                  أضف عقار
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: '#059669',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: '500',
                    textDecoration: 'none',
                  }}
                >
                  تسجيل الدخول
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}