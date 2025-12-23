// src/app/admin/layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // التحقق من الجلسة
  const session = await auth();

  // إذا لم يكن مسجل الدخول
  if (!session) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  // إذا لم يكن أدمن
  if (session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  // تمرير بيانات المستخدم للـ Client Component
  return (
    <AdminLayoutClient user={session.user}>
      {children}
    </AdminLayoutClient>
  );
}