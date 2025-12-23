// src/app/admin/users/page.tsx
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getRoleName, getRoleColor } from "@/lib/permissions";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import ChangeRoleButton from "@/components/admin/ChangeRoleButton";
import Image from 'next/image';
async function getUsers() {
  await dbConnect();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(users));
}

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await getUsers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-500">إدارة جميع المستخدمين والصلاحيات</p>
        </div>
        <Link
          href="/admin/users/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
        >
          <FaUserPlus className="w-4 h-4" />
          <span>إضافة مستخدم</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
            <option value="">جميع الأدوار</option>
            <option value="user">مستخدم</option>
            <option value="agent">وكيل عقاري</option>
            <option value="admin">مدير</option>
          </select>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
            <option value="">الحالة</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  المستخدم
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  البريد الإلكتروني
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  الدور
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  الحالة
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  تاريخ التسجيل
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user: any) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        {user.image ? (
                       <Image 
      src={user.image || "/default-avatar.png"} 
      alt={user.name || "User"}
      fill
      className="object-cover"
      sizes="40px"
    />
                        ) : (
                          <span className="text-emerald-600 font-semibold">
                            {user.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.phone || "-"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ChangeRoleButton
                        userId={user._id}
                        currentRole={user.role}
                      />
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaEdit className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}