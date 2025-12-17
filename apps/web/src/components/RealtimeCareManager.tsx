import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, Trash2, Repeat2, Loader } from 'lucide-react';
import { useRealtimeCareTasks } from '../hooks/useRealtimeCareTasks';

interface RealtimeCareManagerProps {
  showStats?: boolean;
  maxItems?: number;
  autoRefresh?: boolean;
}

const RealtimeCareManager: React.FC<RealtimeCareManagerProps> = ({
  showStats = true,
  maxItems = 10,
  autoRefresh = true,
}) => {
  const {
    tasks,
    loading,
    completeTask,
    snoozeTask,
    deleteTask,
    createTask,
    getStats,
  } = useRealtimeCareTasks();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('pending');
  const stats = getStats();

  const filteredTasks = tasks
    .filter((task) => {
      if (filterStatus === 'all') return true;
      return filterStatus === 'completed' ? task.completed : !task.completed;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, maxItems);

  const handleCompleteTask = async (taskId: string) => {
    await completeTask(taskId);
  };

  const handleSnoozeTask = async (taskId: string) => {
    await snoozeTask(taskId, 1);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const getStatusIcon = (completed: boolean, dueDate: Date) => {
    if (completed) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (new Date(dueDate) < new Date()) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return <Clock className="w-5 h-5 text-yellow-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Care Tasks</h2>
          <div className="flex items-center gap-2">
            {loading && <Loader className="w-5 h-5 animate-spin text-blue-500" />}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          </div>
        </div>

        {/* Stats */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Overdue</div>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Due Today</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.dueToday}</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="p-6 border-b flex gap-2">
        {(['all', 'pending', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="divide-y">
        {filteredTasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {loading ? 'Loading tasks...' : 'No tasks found'}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-gray-50 transition flex items-center gap-4">
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {getStatusIcon(task.completed, task.dueDate)}
              </div>

              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.plantName}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{task.type}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                {task.notes && <p className="text-sm text-gray-600 mt-1">{task.notes}</p>}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex gap-2">
                {!task.completed && (
                  <>
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      title="Mark as complete"
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleSnoozeTask(task.id)}
                      title="Snooze for 1 day"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <Repeat2 className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  title="Delete task"
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (taskData) => {
            await createTask(taskData);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (task: any) => Promise<void>;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    plantName: '',
    type: 'watering',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate({
      ...formData,
      dueDate: new Date(formData.dueDate),
      frequency: 'weekly', // Default frequency
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Create New Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plant Name</label>
            <input
              type="text"
              required
              value={formData.plantName}
              onChange={(e) => setFormData({ ...formData, plantName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Monstera Deliciosa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="watering">Watering</option>
                <option value="fertilizing">Fertilizing</option>
                <option value="pruning">Pruning</option>
                <option value="pest-control">Pest Control</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RealtimeCareManager;
