import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface UrgentTasksBadgeProps {
  overdueTasks?: number;
  dueTodayTasks?: number;
  onClick?: () => void;
}

const UrgentTasksBadge: React.FC<UrgentTasksBadgeProps> = ({
  overdueTasks = 0,
  dueTodayTasks = 0,
  onClick
}) => {
  const hasUrgent = overdueTasks > 0 || dueTodayTasks > 0;

  if (!hasUrgent) {
    return null;
  }

  return (
    <div
      onClick={onClick}
      className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 cursor-pointer hover:bg-amber-100 transition-colors"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-900 mb-1">Attention Needed!</h3>
          <div className="space-y-1">
            {overdueTasks > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-800">
                <AlertTriangle className="h-3 w-3" />
                <span>{overdueTasks} overdue task{overdueTasks !== 1 ? 's' : ''}</span>
              </div>
            )}
            {dueTodayTasks > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-800">
                <Clock className="h-3 w-3" />
                <span>{dueTodayTasks} task{dueTodayTasks !== 1 ? 's' : ''} due today</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrgentTasksBadge;
