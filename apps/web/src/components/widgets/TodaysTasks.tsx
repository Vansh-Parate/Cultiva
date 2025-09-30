import React, { useMemo } from 'react'

type CareTask = {
  id: string;
  plantName: string;
  type: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
};

type Props = {
  tasks: CareTask[];
  onComplete: (id: string) => Promise<void> | void;
  onBulkComplete?: (ids: string[]) => Promise<void> | void;
  onSnooze?: (id: string, days?: number) => Promise<void> | void;
};

const Section: React.FC<{ title: string; list: CareTask[]; onBulk?: () => void; onComplete: (id: string) => void; onSnooze?: (id: string, d?: number) => void; }> = ({ title, list, onBulk, onComplete, onSnooze }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {list.length > 0 && onBulk && (
        <button onClick={onBulk} className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700">Mark all done</button>
      )}
    </div>
    {list.length === 0 ? (
      <div className="text-sm text-gray-500">Nothing here</div>
    ) : (
      <ul className="space-y-2">
        {list.map(t => (
          <li key={t.id} className="flex items-center justify-between rounded border border-gray-200 p-3">
            <div>
              <div className="text-sm font-medium text-gray-900">{t.plantName}</div>
              <div className="text-xs text-gray-600 capitalize">{t.type}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onComplete(t.id)} className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700">Complete</button>
              {onSnooze && <button onClick={() => onSnooze(t.id, 1)} className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50">Snooze 1d</button>}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const TodaysTasks: React.FC<Props> = ({ tasks, onComplete, onBulkComplete, onSnooze }) => {
  const { today, overdue } = useMemo(() => {
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);
    const isToday = (d: Date) => d >= start && d <= end;
    const todayList: CareTask[] = [];
    const overdueList: CareTask[] = [];
    tasks.forEach(t => {
      if (t.completed) return;
      const due = new Date(t.dueDate);
      if (due < start) overdueList.push(t);
      else if (isToday(due)) todayList.push(t);
    });
    return { today: todayList, overdue: overdueList };
  }, [tasks]);

  const bulkComplete = (list: CareTask[]) => {
    if (!onBulkComplete) return;
    const ids = list.map(t => t.id);
    onBulkComplete(ids);
  };

  const snooze = (id: string, days = 1) => onSnooze?.(id, days);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Section title="Overdue" list={overdue} onBulk={onBulkComplete ? () => bulkComplete(overdue) : undefined} onComplete={id => onComplete(id)} onSnooze={snooze} />
      <Section title="Due Today" list={today} onBulk={onBulkComplete ? () => bulkComplete(today) : undefined} onComplete={id => onComplete(id)} onSnooze={snooze} />
    </div>
  )
}

export default TodaysTasks
