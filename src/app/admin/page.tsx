// src/app/admin/page.tsx
import { auth } from "@/auth";
import {
  FaUsers,
  FaBuilding,
  FaEye,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaClock,
} from "react-icons/fa";
import Link from "next/link";

// Stats Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  change?: string;
  changeType?: "up" | "down";
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              changeType === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {changeType === "up" ? <FaArrowUp /> : <FaArrowDown />}
            {change}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-500">{title}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const session = await auth();

  // يمكنك جلب الإحصائيات الحقيقية من قاعدة البيانات
  const stats = {
    users: 1250,
    properties: 348,
    views: 25890,
    revenue: "152,000",
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-l from-emerald-600 to-emerald-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          مرحباً، {session?.user?.name} 👋
        </h1>
        <p className="text-emerald-100">
          إليك نظرة عامة على أداء منصتك اليوم
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المستخدمين"
          value={stats.users.toLocaleString()}
          icon={FaUsers}
          change="+12%"
          changeType="up"
          color="bg-blue-500"
        />
        <StatCard
          title="العقارات المنشورة"
          value={stats.properties}
          icon={FaBuilding}
          change="+8%"
          changeType="up"
          color="bg-emerald-500"
        />
        <StatCard
          title="المشاهدات"
          value={stats.views.toLocaleString()}
          icon={FaEye}
          change="+24%"
          changeType="up"
          color="bg-purple-500"
        />
        <StatCard
          title="الإيرادات (ريال)"
          value={stats.revenue}
          icon={FaDollarSign}
          change="-3%"
          changeType="down"
          color="bg-amber-500"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { href: "/admin/users", label: "إدارة المستخدمين", icon: FaUsers, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
              { href: "/admin/properties", label: "إدارة العقارات", icon: FaBuilding, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
              { href: "/admin/reports", label: "التقارير", icon: FaEye, color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
              { href: "/admin/settings", label: "الإعدادات", icon: FaClock, color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${action.color}`}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">آخر النشاطات</h2>
          <div className="space-y-4">
            {[
              { text: "مستخدم جديد سجل في المنصة", time: "منذ 5 دقائق", type: "user" },
              { text: "تم إضافة عقار جديد للمراجعة", time: "منذ 15 دقيقة", type: "property" },
              { text: "تم تفعيل حساب وكيل عقاري", time: "منذ ساعة", type: "agent" },
              { text: "تم حذف عقار مخالف", time: "منذ ساعتين", type: "delete" },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "user"
                      ? "bg-blue-500"
                      : activity.type === "property"
                      ? "bg-emerald-500"
                      : activity.type === "agent"
                      ? "bg-purple-500"
                      : "bg-red-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}