import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface RecurringSchedule {
  id: string;
  plantName: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest-control';
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  interval: number;
  nextDueDate: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
}

interface RecurringTaskManagerProps {
  schedules?: RecurringSchedule[];
  onAddSchedule?: (schedule: Omit<RecurringSchedule, 'id'>) => void;
  onDeleteSchedule?: (id: string) => void;
  onToggleSchedule?: (id: string) => void;
}

const RecurringTaskManager: React.FC<RecurringTaskManagerProps> = ({
  schedules = [],
  onAddSchedule,
  onDeleteSchedule,
  onToggleSchedule
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    plantName: '',
    type: 'watering' as RecurringSchedule['type'],
    frequency: 'weekly' as RecurringSchedule['frequency'],
    interval: 1,
    priority: 'medium' as RecurringSchedule['priority']
  });

  const handleAddSchedule = () => {
    if (formData.plantName.trim()) {
      onAddSchedule?.({
        ...formData,
        nextDueDate: new Date().toISOString(),
        isActive: true
      });
      setFormData({
        plantName: '',
        type: 'watering',
        frequency: 'weekly',
        interval: 1,
        priority: 'medium'
      });
      setShowForm(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getFrequencyLabel = (freq: string, interval: number) => {
    const labels: Record<string, string> = {
      'daily': 'Daily',
      'weekly': `Every ${interval} week${interval > 1 ? 's' : ''}`,
      'bi-weekly': 'Every 2 weeks',
      'monthly': `Every ${interval} month${interval > 1 ? 's' : ''}`,
      'quarterly': 'Every 3 months'
    };
    return labels[freq] || freq;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const activeSchedules = schedules.filter(s => s.isActive);
  const inactiveSchedules = schedules.filter(s => !s.isActive);

  return (
    <div className="mb-4 rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Recurring Schedules</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
          title="Add new schedule"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add Schedule Form */}
      {showForm && (
        <div className="mb-4 p-3 border border-slate-200 rounded-lg bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Plant name"
              value={formData.plantName}
              onChange={(e) => setFormData({ ...formData, plantName: e.target.value })}
              className="px-3 py-2 rounded border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as RecurringSchedule['type'] })}
              className="px-3 py-2 rounded border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="watering">Watering</option>
              <option value="fertilizing">Fertilizing</option>
              <option value="pruning">Pruning</option>
              <option value="repotting">Repotting</option>
              <option value="pest-control">Pest Control</option>
            </select>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RecurringSchedule['frequency'] })}
              className="px-3 py-2 rounded border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as RecurringSchedule['priority'] })}
              className="px-3 py-2 rounded border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded text-xs font-medium border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Cancel
            </button>
            <button
              onClick={handleAddSchedule}
              className="px-3 py-1.5 rounded text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1"
            >
              <Save className="h-3 w-3" />
              Create
            </button>
          </div>
        </div>
      )}

      {/* Active Schedules */}
      {activeSchedules.length > 0 && (
        <div className="space-y-2 mb-4">
          {activeSchedules.map(schedule => (
            <div
              key={schedule.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-emerald-200 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">{schedule.plantName}</h4>
                    <p className="text-xs text-slate-600 capitalize">{schedule.type.replace('-', ' ')}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getPriorityColor(schedule.priority)}`}>
                    {schedule.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{getFrequencyLabel(schedule.frequency, schedule.interval)}</span>
                  <span>•</span>
                  <span>Next due: {formatDate(schedule.nextDueDate)}</span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => onToggleSchedule?.(schedule.id)}
                  className="p-1.5 rounded text-xs border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Deactivate schedule"
                >
                  <X className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onDeleteSchedule?.(schedule.id)}
                  className="p-1.5 rounded text-xs border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete schedule"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inactive Schedules - Collapsed */}
      {inactiveSchedules.length > 0 && (
        <details className="cursor-pointer">
          <summary className="text-xs font-medium text-slate-600 hover:text-slate-900 py-2">
            Inactive Schedules ({inactiveSchedules.length})
          </summary>
          <div className="space-y-2 mt-2">
            {inactiveSchedules.map(schedule => (
              <div
                key={schedule.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 opacity-60"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-slate-600">{schedule.plantName}</h4>
                  <p className="text-xs text-slate-500 capitalize">{schedule.type.replace('-', ' ')}</p>
                </div>
                <button
                  onClick={() => onToggleSchedule?.(schedule.id)}
                  className="px-2 py-1 rounded text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex-shrink-0"
                >
                  Activate
                </button>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Empty State */}
      {schedules.length === 0 && !showForm && (
        <div className="text-center py-6">
          <p className="text-xs text-slate-500">No recurring schedules yet</p>
          <p className="text-xs text-slate-400 mt-1">Create one to automate care tasks</p>
        </div>
      )}
    </div>
  );
};

export default RecurringTaskManager;
