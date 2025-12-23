// src/components/admin/ChangeRoleButton.tsx
"use client";

import { useState } from "react";
import { FaUserCog } from "react-icons/fa";
import toast from "react-hot-toast";

interface ChangeRoleButtonProps {
  userId: string;
  currentRole: string;
}

export default function ChangeRoleButton({
  userId,
  currentRole,
}: ChangeRoleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangeRole = async (newRole: string) => {
    if (newRole === currentRole) {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ");
      }

      toast.success("تم تغيير الدور بنجاح");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
      >
        <FaUserCog className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border py-1 z-50">
            {["user", "agent", "admin"].map((role) => (
              <button
                key={role}
                onClick={() => handleChangeRole(role)}
                disabled={loading}
                className={`w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors ${
                  currentRole === role
                    ? "bg-emerald-50 text-emerald-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                {role === "user"
                  ? "مستخدم"
                  : role === "agent"
                  ? "وكيل عقاري"
                  : "مدير"}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}