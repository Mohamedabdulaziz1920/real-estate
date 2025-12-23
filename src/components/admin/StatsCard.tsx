import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  color: 'emerald' | 'blue' | 'amber' | 'red' | 'purple';
}

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-100',
    icon: 'text-emerald-600',
  },
  blue: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
  },
  amber: {
    bg: 'bg-amber-100',
    icon: 'text-amber-600',
  },
  red: {
    bg: 'bg-red-100',
    icon: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
  },
};

export default function StatCard({ title, value, icon, change, color }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">
            {typeof value === 'number' ? value.toLocaleString('ar-SA') : value}
          </p>
          {change && (
            <p className={`text-sm mt-2 ${change.type === 'increase' ? 'text-emerald-600' : 'text-red-600'}`}>
              {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}%
              <span className="text-gray-500 mr-1">من الشهر الماضي</span>
            </p>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${colors.bg}`}>
          <div className={colors.icon}>{icon}</div>
        </div>
      </div>
    </div>
  );
}