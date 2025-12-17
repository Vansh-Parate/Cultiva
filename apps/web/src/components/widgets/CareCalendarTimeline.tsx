import React from 'react';
import { Droplet, Leaf, Scissors, Sprout, Bug, Calendar } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest-control';
  plantName: string;
  completed?: boolean;
}

interface CareCalendarTimelineProps {
  events?: TimelineEvent[];
  upcomingDays?: number;
}

const CareCalendarTimeline: React.FC<CareCalendarTimelineProps> = ({
  events = [],
  upcomingDays = 7
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'watering': return Droplet;
      case 'fertilizing': return Leaf;
      case 'pruning': return Scissors;
      case 'repotting': return Sprout;
      case 'pest-control': return Bug;
      default: return Calendar;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'watering': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'fertilizing': return 'text-green-600 bg-green-50 border-green-100';
      case 'pruning': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'repotting': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'pest-control': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcomingEvents = sortedEvents.filter(e => {
    const eventDate = new Date(e.date);
    const daysFromNow = Math.floor((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysFromNow <= upcomingDays && daysFromNow >= 0;
  });

  return (
    <div className="mb-4 rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Upcoming Tasks</h3>

      {upcomingEvents.length === 0 ? (
        <div className="text-center py-6">
          <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No upcoming tasks in the next {upcomingDays} days</p>
        </div>
      ) : (
        <div className="space-y-2">
          {upcomingEvents.map((event) => {
            const Icon = getIcon(event.type);
            const colors = getColor(event.type);
            return (
              <div
                key={event.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${colors} ${event.completed ? 'opacity-60' : ''}`}
              >
                <div className="flex-shrink-0 p-1.5 rounded bg-current bg-opacity-10">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-slate-900">{event.plantName}</p>
                    <span className="text-xs font-medium flex-shrink-0">{formatDate(event.date)}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{getLabel(event.type)}</p>
                </div>
                {event.completed && (
                  <div className="flex-shrink-0 px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                    <span className="text-xs font-medium">Done</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CareCalendarTimeline;
