import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarTask {
  id: string;
  date: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest-control';
  plantName: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface CareCalendarMonthViewProps {
  tasks?: CalendarTask[];
  onDateClick?: (date: Date) => void;
}

const CareCalendarMonthView: React.FC<CareCalendarMonthViewProps> = ({
  tasks = [],
  onDateClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(t => t.date.split('T')[0] === dateStr);
  };

  const getTaskColor = (priority: string, completed: boolean) => {
    if (completed) return 'bg-emerald-200';
    switch (priority) {
      case 'high': return 'bg-red-400';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-blue-400';
      default: return 'bg-slate-300';
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="mb-4 rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-sm font-semibold text-slate-900">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

        {/* Calendar days */}
        {days.map(day => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayTasks = getTasksForDate(date);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <button
              key={day}
              onClick={() => onDateClick?.(date)}
              className={`aspect-square p-1 rounded-lg border transition-all flex flex-col items-start justify-start text-xs ${
                isToday
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-emerald-300'
              }`}
            >
              <span className={`font-medium ${isToday ? 'text-emerald-600' : 'text-slate-700'}`}>
                {day}
              </span>
              <div className="flex flex-wrap gap-0.5 mt-0.5 w-full">
                {dayTasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    className={`h-1.5 w-1.5 rounded-full ${getTaskColor(task.priority, task.completed)}`}
                    title={task.plantName}
                  />
                ))}
                {dayTasks.length > 3 && (
                  <span className="text-[0.6rem] text-slate-500">+{dayTasks.length - 3}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-400"></div>
          <span className="text-slate-600">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
          <span className="text-slate-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
          <span className="text-slate-600">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-200"></div>
          <span className="text-slate-600">Completed</span>
        </div>
      </div>
    </div>
  );
};

export default CareCalendarMonthView;
