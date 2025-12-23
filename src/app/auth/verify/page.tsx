'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaEnvelope, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage('تم تأكيد البريد الإلكتروني بنجاح!');
      } else {
        setStatus('error');
        setMessage(data.message || 'رمز التحقق غير صالح');
      }
    } catch (error) {
      setStatus('error');
      setMessage('حدث خطأ، يرجى المحاولة لاحقاً');
    }
  };

  if (status === 'loading') {
    return (
      <div className="text-center">
        <FaSpinner className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">جاري التحقق...</h1>
        <p className="text-gray-500">يرجى الانتظار</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">تم التأكيد! 🎉</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link
          href="/auth/login"
          className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaTimesCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">فشل التحقق</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link
          href="/auth/register"
          className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
        >
          المحاولة مرة أخرى
        </Link>
      </div>
    );
  }

  // Pending - waiting for email verification
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FaEnvelope className="w-10 h-10 text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">تحقق من بريدك الإلكتروني 📧</h1>
      <p className="text-gray-600 mb-2">
        أرسلنا رابط التحقق إلى
      </p>
      {email && (
        <p className="font-medium text-gray-800 mb-6">{email}</p>
      )}
      <p className="text-sm text-gray-500 mb-6">
        لم تستلم الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها
      </p>
      <div className="space-y-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
        >
          إعادة إرسال رابط التحقق
        </button>
        <Link
          href="/auth/login"
          className="block w-full py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <span className="text-white text-3xl font-bold">ع</span>
            </div>
            <span className="text-3xl font-bold text-gray-800">عقاري</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8">
          <Suspense fallback={<div className="text-center"><FaSpinner className="w-8 h-8 animate-spin mx-auto" /></div>}>
            <VerifyContent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}