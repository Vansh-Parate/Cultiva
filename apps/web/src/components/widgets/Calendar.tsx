import React, { useEffect, useMemo, useState } from 'react';
import apiClient from '../../lib/axios';

type CareTask = {
  id: string;
  plantName: string;
  type: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
};

type CalendarProps = {
  onCreateTask?: (date: Date) => void;
};

function startOfMonth(date: Date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0,0,0,0);
  return d;
}

function endOfMonth(date: Date) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23,59,59,999);
  return d;
}

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

const Calendar: React.FC<CalendarProps> = ({ onCreateTask }) => {
  const [current, setCurrent] = useState(new Date());
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const monthLabel = current.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  });

  const gridDates = useMemo(() => {
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    const startWeekday = start.getDay(); // 0 Sun ... 6 Sat
    const firstGrid = addDays(start, -startWeekday);
    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) cells.push(addDays(firstGrid, i));
    return { cells, start, end };
  }, [current]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const startISO = gridDates.start.toISOString();
        const endISO = gridDates.end.toISOString();
        const res = await apiClient.get('/api/v1/care-tasks', {
          params: { start: startISO, end: endISO }
        });
        setTasks(res.data || []);
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [gridDates.start, gridDates.end]);

  const createTask = async (date: Date) => {
    if (onCreateTask) return onCreateTask(date);
    const plantName = window.prompt('Plant name');
    if (!plantName) return;
    const type = window.prompt('Task type (watering, fertilizing, pruning, repotting, pest-control)') || 'watering';
    const due = new Date(date);
    due.setHours(9, 0, 0, 0);
    setCreating(true);
    try {
      await apiClient.post('/api/v1/care-tasks', {
        plantName,
        type,
        frequency: 'weekly',
        dueDate: due.toISOString(),
        priority: 'medium',
      });
      // Refresh tasks
      const res = await apiClient.get('/api/v1/care-tasks', {
        params: { start: gridDates.start.toISOString(), end: gridDates.end.toISOString() }
      });
      setTasks(res.data || []);
    } finally {
      setCreating(false);
    }
  };

  const tasksByDay = useMemo(() => {
    const map = new Map<string, CareTask[]>();
    tasks.forEach(t => {
      const d = new Date(t.dueDate);
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      const list = map.get(key) || [];
      list.push(t);
      map.set(key, list);
    });
    return map;
  }, [tasks]);

  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-teal-100">Care calendar</h2>
        <div className="inline-flex items-center gap-2">
          <button onClick={() => setCurrent(new Date())} className="text-xs text-slate-300 hover:text-teal-300">Today</button>
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-900 px-3 py-1 text-xs text-slate-200">
            {monthLabel}
          </div>
          <div className="inline-flex">
            <button onClick={() => setCurrent(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="rounded-l-full border border-slate-700/60 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:border-slate-600">‹</button>
            <button onClick={() => setCurrent(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="rounded-r-full border border-slate-700/60 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:border-slate-600">›</button>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {gridDates.cells.map((date) => {
          const isCurrentMonth = date.getMonth() === current.getMonth();
          const dayKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
          const dayTasks = tasksByDay.get(dayKey) || [];
          const today = isSameDay(date, new Date());
          const dotColor = (t: CareTask) => {
            const lower = t.type.toLowerCase();
            if (lower.includes('water')) return 'bg-teal-400';
            if (lower.includes('fert')) return 'bg-amber-300';
            return 'bg-rose-300';
          };
          return (
            <button
              key={dayKey}
              onClick={() => createTask(date)}
              className={`relative h-16 rounded-lg border text-left px-2 py-1 transition-colors ${
                isCurrentMonth ? 'border-slate-800 bg-slate-900/40' : 'border-slate-900/60 bg-slate-950/20'
              } ${today ? 'ring-1 ring-teal-600/40' : ''}`}
            >
              <div className={`text-[11px] ${isCurrentMonth ? 'text-slate-300' : 'text-slate-600'}`}>{date.getDate()}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {loading || creating ? (
                  <span className="h-1.5 w-6 rounded-full bg-slate-800" />
                ) : (
                  dayTasks.slice(0, 3).map(t => (
                    <span key={t.id} title={`${t.type} · ${t.plantName}`} className={`h-1.5 w-1.5 rounded-full ${dotColor(t)}`} />
                  ))
                )}
              </div>
              {dayTasks.length > 3 && (
                <span className="absolute bottom-1 right-1 text-[10px] text-slate-500">+{dayTasks.length - 3}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;


