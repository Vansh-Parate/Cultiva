import React from 'react';
import { Check, GripVertical } from 'lucide-react';

interface TimelineTask {
  id: string;
  plantName: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest-control';
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

interface TaskTimelineViewProps {
  tasks?: TimelineTask[];
  onTaskComplete?: (id: string) => void;
  onTaskDragStart?: (id: string) => void;
  getTaskIcon?: (type: string) => React.ReactNode;
}

const TaskTimelineView: React.FC<TaskTimelineViewProps> = ({
  tasks = [],
  onTaskComplete,
  onTaskDragStart,
  getTaskIcon
}) => {
  const getTaskGroups = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const overdue: TimelineTask[] = [];
    const today: TimelineTask[] = [];
    const upcoming: TimelineTask[] = [];

    tasks.forEach(task => {
      if (task.completed) return;

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < now) {
        overdue.push(task);
      } else if (dueDate.getTime() === now.getTime()) {
        today.push(task);
      } else {
        upcoming.push(task);
      }
    });

    return { overdue, today, upcoming };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-blue-300 bg-blue-50';
      default: return 'border-slate-200 bg-white';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const { overdue, today, upcoming } = getTaskGroups();

  const renderTaskGroup = (title: string, groupTasks: TimelineTask[], badgeColor: string) => {
    if (groupTasks.length === 0) return null;

    return (
      <div key={title} className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${badgeColor}`}>
            {title} ({groupTasks.length})
          </span>
        </div>

        <div className="space-y-2">
          {groupTasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={() => onTaskDragStart?.(task.id)}
              className={`flex items-start gap-3 p-3 rounded-lg border ${getPriorityColor(task.priority)} hover:shadow-md transition-all cursor-grab active:cursor-grabbing`}
            >
              {/* Drag Handle */}
              <GripVertical className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />

              {/* Checkbox */}
              <button
                onClick={() => onTaskComplete?.(task.id)}
                className="flex-shrink-0 w-5 h-5 rounded border-2 border-slate-300 hover:border-emerald-600 flex items-center justify-center transition-all mt-0.5"
              >
                <Check className="h-3 w-3 text-emerald-600 hidden" />
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-1">
                    {getTaskIcon?.(task.type) && (
                      <div className="w-4 h-4 flex-shrink-0 text-slate-600">
                        {getTaskIcon(task.type)}
                      </div>
                    )}
                    <h4 className="text-sm font-medium text-slate-900">{task.plantName}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>

                {task.notes && (
                  <p className="text-xs text-slate-600 mb-2 line-clamp-2">{task.notes}</p>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="capitalize">{task.type}</span>
                  <span>•</span>
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              </div>

              {/* Complete Button */}
              <button
                onClick={() => onTaskComplete?.(task.id)}
                className="flex-shrink-0 px-2 py-1 rounded text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Done
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-4 rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Task Timeline</h3>

      {renderTaskGroup('Overdue', overdue, 'bg-red-100 text-red-700 border border-red-200')}
      {renderTaskGroup('Today', today, 'bg-emerald-100 text-emerald-700 border border-emerald-200')}
      {renderTaskGroup('Upcoming', upcoming, 'bg-blue-100 text-blue-700 border border-blue-200')}

      {[overdue, today, upcoming].every(g => g.length === 0) && (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500">No pending tasks. Great job!</p>
        </div>
      )}
    </div>
  );
};

export default TaskTimelineView;
