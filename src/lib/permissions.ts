// src/lib/permissions.ts
import { UserRole } from "@/types/next-auth";

// تعريف الصلاحيات لكل دور
export const PERMISSIONS = {
  // المستخدم العادي
  user: [
    "view:properties",
    "create:property",
    "edit:own-property",
    "delete:own-property",
    "view:own-profile",
    "edit:own-profile",
    "add:favorites",
    "send:messages",
  ],
  
  // الوكيل العقاري
  agent: [
    "view:properties",
    "create:property",
    "edit:own-property",
    "delete:own-property",
    "view:own-profile",
    "edit:own-profile",
    "add:favorites",
    "send:messages",
    "view:analytics",
    "feature:property",
    "view:leads",
  ],
  
  // المدير
  admin: [
    "view:properties",
    "create:property",
    "edit:any-property",
    "delete:any-property",
    "view:own-profile",
    "edit:own-profile",
    "add:favorites",
    "send:messages",
    "view:analytics",
    "feature:property",
    "view:leads",
    "view:dashboard",
    "manage:users",
    "manage:properties",
    "manage:categories",
    "manage:settings",
    "view:reports",
    "manage:roles",
  ],
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS][number];

// التحقق من الصلاحية
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return PERMISSIONS[role]?.includes(permission as any) || false;
}

// التحقق من أن المستخدم أدمن
export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}

// التحقق من أن المستخدم وكيل أو أدمن
export function isAgentOrAdmin(role: UserRole): boolean {
  return role === "agent" || role === "admin";
}

// الحصول على اسم الدور بالعربية
export function getRoleName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    user: "مستخدم",
    agent: "وكيل عقاري",
    admin: "مدير",
  };
  return roleNames[role] || "مستخدم";
}

// الحصول على لون الدور
export function getRoleColor(role: UserRole): string {
  const roleColors: Record<UserRole, string> = {
    user: "bg-gray-100 text-gray-700",
    agent: "bg-blue-100 text-blue-700",
    admin: "bg-red-100 text-red-700",
  };
  return roleColors[role] || "bg-gray-100 text-gray-700";
}