import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, Filter, Search, Droplet, Sun, Scissors, Leaf, Thermometer, Sparkles } from 'lucide-react';
import apiClient from "../lib/axios";
import { useWeather } from "../hooks/useWeather";

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

interface Plant {
  id: string;
  name: string;
  species: string;
  photoUrl: string;
  healthStatus: string;
  lastWatered?: string;
  careHistory?: CareLog[];
}

interface CareLog {
  id: string;
  careType: string;
  completedAt: string;
  notes?: string;
}

interface CareRecommendations {
  watering?: string;
  light?: string;
  temperature?: string;
  fertilization?: string;
  tasks?: string;
  seasonal?: string;
  general?: string;
}

const Care = () => {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [careRecommendations, setCareRecommendations] = useState<Record<string, CareRecommendations>>({});
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [newTask, setNewTask] = useState({
    plantName: '',
    type: 'watering' as CareTask['type'],
    frequency: 'weekly' as CareTask['frequency'],
    dueDate: '',
    notes: '',
    priority: 'medium' as CareTask['priority']
  });

  // Get real weather data
  const { weather: liveWeather } = useWeather();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch plants and tasks in parallel
      const [plantsRes, tasksRes] = await Promise.all([
        apiClient.get('/api/v1/plants'),
        apiClient.get('/api/v1/care-tasks')
      ]);

      const mappedPlants = plantsRes.data.map((plant: { 
        id: string; 
        name: string; 
        species?: { commonName: string }; 
        speciesId?: string; 
        images?: Array<{ url: string }>; 
        healthStatus?: string; 
        lastWatered?: string; 
        careLogs?: CareLog[] 
      }) => ({
        id: plant.id,
        name: plant.name,
        species: plant.species?.commonName || plant.speciesId || '',
        photoUrl: plant.images?.[0]?.url || '/placeholder-plant.png',
        healthStatus: plant.healthStatus || 'Good',
        lastWatered: plant.lastWatered,
        careHistory: plant.careLogs || []
      }));

      setPlants(mappedPlants);
      setTasks(tasksRes.data);

      // Generate care recommendations for each plant
      await generateCareRecommendations(mappedPlants);

    } catch (err) {
      console.error('Failed to fetch data:', err);
      // Fallback to demo data
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

  // Generate care recommendations using Gemini API
  const generateCareRecommendations = async (plants: Plant[]) => {
    setLoadingRecommendations(true);
    try {
      for (const plant of plants) {
        if (plant.species && !careRecommendations[plant.id]) {
          const recommendations = await getCareRecommendationsFromGemini(plant.species, plant.name);
          setCareRecommendations(prev => ({ ...prev, [plant.id]: recommendations }));
        }
      }
    } catch (err) {
      console.error('Failed to generate care recommendations:', err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const getCareRecommendationsFromGemini = async (species: string, plantName: string): Promise<CareRecommendations | null> => {
    try {
      const prompt = `Provide care recommendations for ${plantName} (${species}) based on current conditions. Include:
      1. Watering schedule and amount
      2. Light requirements
      3. Temperature preferences
      4. Fertilization needs
      5. Common care tasks and frequency
      6. Seasonal care adjustments
      
      Format as a JSON object with keys: watering, light, temperature, fertilization, tasks, seasonal.`;
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + import.meta.env.VITE_GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      
      const data = await response.json();
      const recommendationsText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      try {
        return JSON.parse(recommendationsText);
      } catch {
        return { general: recommendationsText };
      }
    } catch (err) {
      console.error('Gemini API error:', err);
      return null;
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await apiClient.patch(`/api/v1/care-tasks/${taskId}/complete`);
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
      const response = await apiClient.post('/api/v1/care-tasks', newTask);
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

  const handleRecordCareAction = async (plantId: string, careType: string, notes?: string) => {
    try {
      await apiClient.post(`/api/v1/plants/${plantId}/care`, {
        careType,
        notes
      });
      
      // Refresh data
      fetchData();
    } catch (err) {
      console.error('Failed to record care action:', err);
    }
  };

  const getTaskIcon = (type: CareTask['type']) => {
    switch (type) {
      case 'watering': return <Droplet className="w-5 h-5" />;
      case 'fertilizing': return <Sun className="w-5 h-5" />;
      case 'pruning': return <Scissors className="w-5 h-5" />;
      case 'repotting': return <Leaf className="w-5 h-5" />;
      case 'pest-control': return <AlertCircle className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: CareTask['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueStatus = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', color: 'text-red-600', bg: 'bg-red-50' };
    if (diffDays === 0) return { status: 'due today', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (diffDays <= 2) return { status: `due in ${diffDays} days`, color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: `due in ${diffDays} days`, color: 'text-green-600', bg: 'bg-green-50' };
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
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto ml-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Plant Care</h1>
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

          {/* Weather & Care Tips */}
          {liveWeather && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-green-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Thermometer className="w-6 h-6 text-blue-600" />
                Weather-Based Care Tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Thermometer className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{liveWeather.temperature?.toFixed(1)}°C</div>
                    <div className="text-sm text-blue-600">Temperature</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Droplet className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-900">{liveWeather.humidity}%</div>
                    <div className="text-sm text-green-600">Humidity</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                  <Sparkles className="w-8 h-8 text-yellow-600" />
                  <div>
                    <div className="text-lg font-semibold text-yellow-900">
                      {liveWeather.temperature && liveWeather.temperature > 25 
                        ? 'Extra watering needed'
                        : liveWeather.humidity && liveWeather.humidity > 70
                          ? 'Reduce watering'
                          : 'Perfect conditions'
                      }
                    </div>
                    <div className="text-sm text-yellow-600">Care Tip</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plant Care Recommendations */}
          {plants.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-green-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                AI Care Recommendations
              </h2>
              {loadingRecommendations ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plants.slice(0, 6).map(plant => {
                    const recommendations = careRecommendations[plant.id];
                    return (
                      <div key={plant.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={plant.photoUrl} 
                            alt={plant.name} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{plant.name}</div>
                            <div className="text-sm text-gray-600">{plant.species}</div>
                          </div>
                        </div>
                        {recommendations ? (
                          <div className="space-y-2">
                            {recommendations.watering && (
                              <div className="flex items-center gap-2 text-sm">
                                <Droplet className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-700">{recommendations.watering}</span>
                              </div>
                            )}
                            {recommendations.light && (
                              <div className="flex items-center gap-2 text-sm">
                                <Sun className="w-4 h-4 text-yellow-600" />
                                <span className="text-gray-700">{recommendations.light}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">Loading recommendations...</div>
                        )}
                        <button
                          onClick={() => handleRecordCareAction(plant.id, 'watering', 'Watered based on AI recommendation')}
                          className="mt-3 w-full px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          Mark as Watered
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-5 h-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Care Tasks</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => {
                  const dueStatus = getDueStatus(task.dueDate);
                  return (
                    <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getTaskIcon(task.type)}
                            <div>
                              <div className="font-semibold text-gray-900">{task.plantName}</div>
                              <div className="text-sm text-gray-600 capitalize">{task.type}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm ${dueStatus.color}`}>{dueStatus.status}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!task.completed ? (
                            <button
                              onClick={() => handleCompleteTask(task.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              Complete
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {task.notes && (
                        <div className="mt-3 text-sm text-gray-600">
                          {task.notes}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No tasks found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Care Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plant Name</label>
                <input
                  type="text"
                  value={newTask.plantName}
                  onChange={(e) => setNewTask({ ...newTask, plantName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                <select
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value as CareTask['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value as CareTask['frequency'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as CareTask['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddTask}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Care; 