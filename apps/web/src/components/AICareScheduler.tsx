import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Droplets, 
  Sun, 
  Scissors, 
  Leaf, 
  Zap,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import apiClient from '../lib/axios';

interface Plant {
  id: string;
  name: string;
  species?: string;
  location?: string;
  healthStatus?: string;
}

interface CareTask {
  id: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest-control' | 'light-adjustment';
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  dueDate: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  plantName: string;
  isCompleted: boolean;
  estimatedDuration: number; // in minutes
}

interface CareSchedule {
  plantId: string;
  plantName: string;
  tasks: CareTask[];
  nextDueDate: string;
  totalTasks: number;
  completedTasks: number;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  season: string;
}

const AICareScheduler: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [careSchedules, setCareSchedules] = useState<CareSchedule[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<CareTask | null>(null);
  const [newTask, setNewTask] = useState<Partial<CareTask>>({
    type: 'watering',
    frequency: 'weekly',
    priority: 'medium',
    estimatedDuration: 15,
    notes: ''
  });

  useEffect(() => {
    fetchPlants();
    fetchWeatherData();
  }, []);

  useEffect(() => {
    if (plants.length > 0) {
      setSelectedPlant(plants[0]);
    }
  }, [plants]);

  useEffect(() => {
    if (selectedPlant) {
      fetchCareSchedule(selectedPlant.id);
    }
  }, [selectedPlant]);

  const fetchPlants = async () => {
    try {
      const response = await apiClient.get('/api/v1/plants');
      setPlants(response.data);
    } catch (error) {
      console.error('Failed to fetch plants:', error);
    }
  };

  const fetchWeatherData = async () => {
    // Simulate weather data - in a real app, this would come from a weather API
    setWeatherData({
      temperature: 22 + Math.random() * 6,
      humidity: 45 + Math.random() * 20,
      precipitation: Math.random() * 10,
      season: getCurrentSeason()
    });
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  };

  const fetchCareSchedule = async (plantId: string) => {
    setLoading(true);
    try {
      // In a real app, this would fetch from the backend
      // For now, we'll generate a sample schedule
      const schedule = generateSampleSchedule(plantId);
      setCareSchedules(prev => {
        const filtered = prev.filter(s => s.plantId !== plantId);
        return [...filtered, schedule];
      });
    } catch (error) {
      console.error('Failed to fetch care schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleSchedule = (plantId: string): CareSchedule => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) throw new Error('Plant not found');

    const tasks: CareTask[] = [
      {
        id: '1',
        type: 'watering',
        frequency: 'weekly',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Water thoroughly until water drains from bottom',
        priority: 'high',
        plantName: plant.name,
        isCompleted: false,
        estimatedDuration: 10
      },
      {
        id: '2',
        type: 'fertilizing',
        frequency: 'monthly',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Use balanced liquid fertilizer',
        priority: 'medium',
        plantName: plant.name,
        isCompleted: false,
        estimatedDuration: 15
      },
      {
        id: '3',
        type: 'pruning',
        frequency: 'monthly',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Remove dead or yellowing leaves',
        priority: 'low',
        plantName: plant.name,
        isCompleted: false,
        estimatedDuration: 20
      }
    ];

    return {
      plantId,
      plantName: plant.name,
      tasks,
      nextDueDate: tasks[0].dueDate,
      totalTasks: tasks.length,
      completedTasks: 0
    };
  };

  const generateAISchedule = async () => {
    if (!selectedPlant) return;
    
    setGenerating(true);
    try {
      const response = await apiClient.post('/api/v1/ai/care-recommendations', {
        species: selectedPlant.species || selectedPlant.name,
        plantName: selectedPlant.name,
        location: selectedPlant.location,
        season: weatherData?.season
      });

      // Convert AI recommendations to care tasks
      const aiTasks = convertRecommendationsToTasks(response.data.recommendations, selectedPlant);
      
      const newSchedule: CareSchedule = {
        plantId: selectedPlant.id,
        plantName: selectedPlant.name,
        tasks: aiTasks,
        nextDueDate: aiTasks[0]?.dueDate || new Date().toISOString(),
        totalTasks: aiTasks.length,
        completedTasks: 0
      };

      setCareSchedules(prev => {
        const filtered = prev.filter(s => s.plantId !== selectedPlant.id);
        return [...filtered, newSchedule];
      });
    } catch (error) {
      console.error('Failed to generate AI schedule:', error);
    } finally {
      setGenerating(false);
    }
  };

  const convertRecommendationsToTasks = (recommendations: any, plant: Plant): CareTask[] => {
    const tasks: CareTask[] = [];
    let taskId = 1;

    // Parse watering recommendations
    if (recommendations.watering) {
      tasks.push({
        id: String(taskId++),
        type: 'watering',
        frequency: extractFrequency(recommendations.watering),
        dueDate: calculateNextDueDate('watering', extractFrequency(recommendations.watering)),
        notes: recommendations.watering,
        priority: 'high',
        plantName: plant.name,
        isCompleted: false,
        estimatedDuration: 10
      });
    }

    // Parse fertilization recommendations
    if (recommendations.fertilization) {
      tasks.push({
        id: String(taskId++),
        type: 'fertilizing',
        frequency: extractFrequency(recommendations.fertilization),
        dueDate: calculateNextDueDate('fertilizing', extractFrequency(recommendations.fertilization)),
        notes: recommendations.fertilization,
        priority: 'medium',
        plantName: plant.name,
        isCompleted: false,
        estimatedDuration: 15
      });
    }

    // Parse general tasks
    if (recommendations.tasks) {
      tasks.push({
        id: String(taskId++),
        type: 'pruning',
        frequency: 'monthly',
        dueDate: calculateNextDueDate('pruning', 'monthly'),
        notes: recommendations.tasks,
        priority: 'low',
        plantName: plant.name,
        isCompleted: false,
        estimatedDuration: 20
      });
    }

    return tasks;
  };

  const extractFrequency = (text: string): CareTask['frequency'] => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('daily')) return 'daily';
    if (lowerText.includes('weekly')) return 'weekly';
    if (lowerText.includes('bi-weekly') || lowerText.includes('biweekly')) return 'bi-weekly';
    if (lowerText.includes('monthly')) return 'monthly';
    if (lowerText.includes('quarterly')) return 'quarterly';
    return 'weekly'; // default
  };

  const calculateNextDueDate = (type: string, frequency: CareTask['frequency']): string => {
    const now = new Date();
    let daysToAdd = 0;

    switch (frequency) {
      case 'daily': daysToAdd = 1; break;
      case 'weekly': daysToAdd = 7; break;
      case 'bi-weekly': daysToAdd = 14; break;
      case 'monthly': daysToAdd = 30; break;
      case 'quarterly': daysToAdd = 90; break;
    }

    // Adjust based on task type and weather
    if (type === 'watering' && weatherData) {
      if (weatherData.precipitation > 5) daysToAdd += 2; // Skip watering if it's raining
      if (weatherData.temperature > 28) daysToAdd -= 1; // Water more frequently in hot weather
    }

    return new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
  };

  const toggleTaskCompletion = (plantId: string, taskId: string) => {
    setCareSchedules(prev => prev.map(schedule => {
      if (schedule.plantId === plantId) {
        const updatedTasks = schedule.tasks.map(task => 
          task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        );
        return {
          ...schedule,
          tasks: updatedTasks,
          completedTasks: updatedTasks.filter(t => t.isCompleted).length
        };
      }
      return schedule;
    }));
  };

  const addCustomTask = () => {
    if (!selectedPlant || !newTask.type) return;

    const task: CareTask = {
      id: Date.now().toString(),
      type: newTask.type as CareTask['type'],
      frequency: newTask.frequency as CareTask['frequency'],
      dueDate: newTask.dueDate || new Date().toISOString(),
      notes: newTask.notes || '',
      priority: newTask.priority as CareTask['priority'],
      plantName: selectedPlant.name,
      isCompleted: false,
      estimatedDuration: newTask.estimatedDuration || 15
    };

    setCareSchedules(prev => prev.map(schedule => {
      if (schedule.plantId === selectedPlant.id) {
        return {
          ...schedule,
          tasks: [...schedule.tasks, task],
          totalTasks: schedule.totalTasks + 1
        };
      }
      return schedule;
    }));

    setShowTaskModal(false);
    setNewTask({
      type: 'watering',
      frequency: 'weekly',
      priority: 'medium',
      estimatedDuration: 15,
      notes: ''
    });
  };

  const deleteTask = (plantId: string, taskId: string) => {
    setCareSchedules(prev => prev.map(schedule => {
      if (schedule.plantId === plantId) {
        const updatedTasks = schedule.tasks.filter(task => task.id !== taskId);
        return {
          ...schedule,
          tasks: updatedTasks,
          totalTasks: updatedTasks.length,
          completedTasks: updatedTasks.filter(t => t.isCompleted).length
        };
      }
      return schedule;
    }));
  };

  const getTaskIcon = (type: CareTask['type']) => {
    switch (type) {
      case 'watering': return Droplets;
      case 'fertilizing': return Leaf;
      case 'pruning': return Scissors;
      case 'repotting': return Zap;
      case 'pest-control': return AlertCircle;
      case 'light-adjustment': return Sun;
      default: return Calendar;
    }
  };

  const getPriorityColor = (priority: CareTask['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFrequencyColor = (frequency: CareTask['frequency']) => {
    switch (frequency) {
      case 'daily': return 'text-red-600 bg-red-100';
      case 'weekly': return 'text-orange-600 bg-orange-100';
      case 'bi-weekly': return 'text-yellow-600 bg-yellow-100';
      case 'monthly': return 'text-blue-600 bg-blue-100';
      case 'quarterly': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const currentSchedule = careSchedules.find(s => s.plantId === selectedPlant?.id);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Care Scheduler</h1>
        <p className="text-gray-600">Intelligent care scheduling based on plant needs and environmental conditions</p>
      </div>

      {/* Plant Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Plant
        </label>
        <select
          value={selectedPlant?.id || ''}
          onChange={(e) => {
            const plant = plants.find(p => p.id === e.target.value);
            setSelectedPlant(plant || null);
          }}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {plants.map(plant => (
            <option key={plant.id} value={plant.id}>
              {plant.name} {plant.species && `(${plant.species})`}
            </option>
          ))}
        </select>
      </div>

      {/* Weather Info */}
      {weatherData && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Weather Conditions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Temperature:</span> {weatherData.temperature.toFixed(1)}°C
            </div>
            <div>
              <span className="font-medium">Humidity:</span> {weatherData.humidity.toFixed(0)}%
            </div>
            <div>
              <span className="font-medium">Precipitation:</span> {weatherData.precipitation.toFixed(1)}mm
            </div>
            <div>
              <span className="font-medium">Season:</span> {weatherData.season}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Care Schedule for {selectedPlant?.name}
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={generateAISchedule}
            disabled={generating || !selectedPlant}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Generate AI Schedule
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Schedule Overview */}
      {currentSchedule && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{currentSchedule.totalTasks}</div>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentSchedule.completedTasks}</div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentSchedule.totalTasks - currentSchedule.completedTasks}
              </div>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((currentSchedule.completedTasks / currentSchedule.totalTasks) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Progress</p>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">Loading care schedule...</p>
        </div>
      ) : currentSchedule ? (
        <div className="space-y-4">
          {currentSchedule.tasks.map((task) => {
            const TaskIcon = getTaskIcon(task.type);
            const isOverdue = new Date(task.dueDate) < new Date() && !task.isCompleted;
            
            return (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${
                  task.isCompleted ? 'opacity-60' : ''
                } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleTaskCompletion(selectedPlant!.id, task.id)}
                      className={`p-2 rounded-full ${
                        task.isCompleted 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                      }`}
                    >
                      {task.isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-current rounded-full" />
                      )}
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <TaskIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <h3 className={`font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.type.charAt(0).toUpperCase() + task.type.slice(1).replace('-', ' ')}
                        </h3>
                        <p className="text-sm text-gray-600">{task.notes}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(task.frequency)}`}>
                        {task.frequency}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.estimatedDuration} min
                      </p>
                    </div>

                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setNewTask(task);
                          setShowTaskModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(selectedPlant!.id, task.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Care Schedule</h3>
          <p className="text-gray-500 mb-4">Generate an AI-powered care schedule for {selectedPlant?.name}</p>
          <button
            onClick={generateAISchedule}
            disabled={generating}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center mx-auto"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Generate Schedule
          </button>
        </div>
      )}

      {/* Add/Edit Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                <select
                  value={newTask.type || 'watering'}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value as CareTask['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="watering">Watering</option>
                  <option value="fertilizing">Fertilizing</option>
                  <option value="pruning">Pruning</option>
                  <option value="repotting">Repotting</option>
                  <option value="pest-control">Pest Control</option>
                  <option value="light-adjustment">Light Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  value={newTask.frequency || 'weekly'}
                  onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value as CareTask['frequency'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTask.priority || 'medium'}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as CareTask['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value).toISOString() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration (minutes)</label>
                <input
                  type="number"
                  value={newTask.estimatedDuration || 15}
                  onChange={(e) => setNewTask({ ...newTask, estimatedDuration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newTask.notes || ''}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-20"
                  placeholder="Additional notes or instructions..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTask(null);
                  setNewTask({
                    type: 'watering',
                    frequency: 'weekly',
                    priority: 'medium',
                    estimatedDuration: 15,
                    notes: ''
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={editingTask ? () => {
                  // Handle edit logic here
                  setShowTaskModal(false);
                  setEditingTask(null);
                } : addCustomTask}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICareScheduler;
