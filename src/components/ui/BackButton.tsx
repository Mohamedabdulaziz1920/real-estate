// src/components/ui/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
    >
      <FaArrowRight className="w-5 h-5" />
      <span>العودة للخلف</span>
    </button>
  );
}