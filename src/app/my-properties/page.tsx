import { Suspense } from 'react';
import MyPropertiesContent from './MyPropertiesContent';
import { FaSpinner } from 'react-icons/fa';

// مكون التحميل
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin" />
    </div>
  );
}

// الصفحة الرئيسية
export default function MyPropertiesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MyPropertiesContent />
    </Suspense>
  );
}