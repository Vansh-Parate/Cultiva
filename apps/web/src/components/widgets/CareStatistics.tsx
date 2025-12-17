import React from 'react';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface CareStatisticsProps {
  totalTasks?: number;
  completedTasks?: number;
  overdueTasks?: number;
  completionRate?: number;
}

const CareStatistics: React.FC<CareStatisticsProps> = ({
  totalTasks = 15,
  completedTasks = 9,
  overdueTasks = 2,
  completionRate = 60
}) => {
  const stats = [
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      label: 'Pending',
      value: totalTasks - completedTasks,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    }
  ];

  return (
    <div className="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`rounded-lg border ${stat.borderColor} ${stat.bgColor} p-3 shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${stat.color}`} />
              <p className="text-xs font-medium text-slate-600">{stat.label}</p>
            </div>
            <p className={`text-xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CareStatistics;
