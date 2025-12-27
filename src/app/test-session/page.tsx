// src/app/test-session/page.tsx
import { auth } from "@/auth";

export default async function TestSessionPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">اختبار الجلسة</h1>
      
      {session ? (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-800 font-bold">✅ مسجل الدخول</p>
          <pre className="mt-4 bg-gray-800 text-white p-4 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-800 font-bold">❌ غير مسجل الدخول</p>
        </div>
      )}
    </div>
  );
}