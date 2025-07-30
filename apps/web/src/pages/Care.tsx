import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, Filter, Search } from 'lucide-react';
import axios from 'axios';

interface CareTask {
  id: string;
  plantName: string;
  plantId: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest-control';
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  dueDate: string;
  completed: boolean;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

const Care = () => {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    plantName: '',
    type: 'watering' as CareTask['type'],
    frequency: 'weekly' as CareTask['frequency'],
    dueDate: '',
    notes: '',
    priority: 'medium' as CareTask['priority']
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/care-tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      // For demo purposes, create some sample tasks
      setTasks([
        {
          id: '1',
          plantName: 'Aloe Vera',
          plantId: '1',
          type: 'watering',
          frequency: 'weekly',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          notes: 'Water sparingly, allow soil to dry',
          priority: 'medium'
        },
        {
          id: '2',
          plantName: 'Snake Plant',
          plantId: '2',
          type: 'fertilizing',
          frequency: 'monthly',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          notes: 'Use balanced fertilizer',
          priority: 'low'
        },
        {
          id: '3',
          plantName: 'Peace Lily',
          plantId: '3',
          type: 'watering',
          frequency: 'weekly',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          notes: 'Keep soil consistently moist',
          priority: 'high'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/v1/care-tasks/${taskId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      ));
    } catch (err) {
      console.error('Failed to complete task:', err);
      // For demo, update locally
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      ));
    }
  };

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/v1/care-tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, response.data]);
      setShowAddModal(false);
      setNewTask({
        plantName: '',
        type: 'watering',
        frequency: 'weekly',
        dueDate: '',
        notes: '',
        priority: 'medium'
      });
    } catch (err) {
      console.error('Failed to add task:', err);
      // For demo, add locally
      const newTaskItem: CareTask = {
        id: Date.now().toString(),
        plantId: 'demo',
        ...newTask,
        completed: false
      };
      setTasks([...tasks, newTaskItem]);
      setShowAddModal(false);
      setNewTask({
        plantName: '',
        type: 'watering',
        frequency: 'weekly',
        dueDate: '',
        notes: '',
        priority: 'medium'
      });
    }
  };

  const getTaskIcon = (type: CareTask['type']) => {
    switch (type) {
      case 'watering': return '💧';
      case 'fertilizing': return '🌱';
      case 'pruning': return '✂️';
      case 'repotting': return '🪴';
      case 'pest-control': return '🦗';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority: CareTask['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDueStatus = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600 bg-red-50' };
    if (diffDays === 0) return { text: 'Due Today', color: 'text-orange-600 bg-orange-50' };
    if (diffDays <= 2) return { text: `Due in ${diffDays} days`, color: 'text-yellow-600 bg-yellow-50' };
    return { text: `Due in ${diffDays} days`, color: 'text-green-600 bg-green-50' };
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && !task.completed) || 
      (filter === 'completed' && task.completed);
    const matchesSearch = task.plantName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full flex bg-[#f7faf7]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-green-600">Loading care tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#f7faf7]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Plant Care</h1>
              <p className="text-gray-600">Manage your plant care tasks and schedules</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all hover:shadow-md ${
                  task.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTaskIcon(task.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{task.plantName}</h3>
                      <p className="text-sm text-gray-600 capitalize">{task.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.completed && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDueStatus(task.dueDate).color}`}>
                      {getDueStatus(task.dueDate).text}
                    </span>
                  </div>

                  {task.notes && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {task.notes}
                    </p>
                  )}

                  {!task.completed && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No tasks found</h3>
              <p className="text-gray-500">Create your first care task to get started</p>
            </div>
          )}
        </div>

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Add Care Task</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plant Name</label>
                  <input
                    type="text"
                    value={newTask.plantName}
                    onChange={(e) => setNewTask({...newTask, plantName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter plant name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({...newTask, type: e.target.value as CareTask['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="watering">Watering</option>
                    <option value="fertilizing">Fertilizing</option>
                    <option value="pruning">Pruning</option>
                    <option value="repotting">Repotting</option>
                    <option value="pest-control">Pest Control</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={newTask.frequency}
                    onChange={(e) => setNewTask({...newTask, frequency: e.target.value as CareTask['frequency']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as CareTask['priority']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newTask.notes}
                    onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Add any notes or instructions..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddTask}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Care; 