import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Sun, 
  Snowflake, 
  Leaf, 
  Droplets, 
  Thermometer, 
  Wind,
  Cloud,
  CloudRain,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Brain,
  Target,
  TrendingUp,
  Clock,
  Lightbulb,
  Zap
} from 'lucide-react';
import apiClient from '../lib/axios';

interface Plant {
  id: string;
  name: string;
  species?: string;
  location?: string;
  healthStatus?: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  uvIndex: number;
  condition: string;
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
  }>;
}

interface SeasonalTask {
  id: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'protection' | 'harvesting';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  weatherDependent: boolean;
  estimatedDuration: number;
  materials: string[];
  tips: string[];
}

interface SeasonalPlan {
  currentSeason: string;
  nextSeason: string;
  seasonTransition: string;
  weatherData: WeatherData;
  currentTasks: SeasonalTask[];
  upcomingTasks: SeasonalTask[];
  weatherAlerts: Array<{
    type: 'warning' | 'info' | 'alert';
    title: string;
    description: string;
    action: string;
  }>;
  plantSpecificAdvice: Array<{
    plantName: string;
    advice: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  seasonalTips: string[];
  preparationTasks: Array<{
    task: string;
    deadline: string;
    importance: 'low' | 'medium' | 'high';
  }>;
}

const AISeasonalPlanner: React.FC<{ plant: Plant }> = ({ plant }) => {
  const [seasonalPlan, setSeasonalPlan] = useState<SeasonalPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'current' | 'upcoming' | 'preparation'>('current');
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);

  useEffect(() => {
    if (plant) {
      generateSeasonalPlan();
    }
  }, [plant]);

  const generateSeasonalPlan = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/ai/seasonal-planner', {
        plantName: plant.name,
        species: plant.species,
        location: plant.location
      });

      setSeasonalPlan(response.data.plan);
    } catch (error) {
      console.error('Failed to generate seasonal plan:', error);
      // Generate mock data for demonstration
      generateMockSeasonalPlan();
    } finally {
      setLoading(false);
    }
  };

  const generateMockSeasonalPlan = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentSeason = getCurrentSeason(currentMonth);
    const nextSeason = getNextSeason(currentSeason);

    const mockPlan: SeasonalPlan = {
      currentSeason,
      nextSeason,
      seasonTransition: `${nextSeason} begins in ${getDaysUntilNextSeason(currentMonth)} days`,
      weatherData: {
        temperature: 22 + Math.random() * 8,
        humidity: 45 + Math.random() * 25,
        precipitation: Math.random() * 15,
        windSpeed: 5 + Math.random() * 10,
        uvIndex: 3 + Math.random() * 7,
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        forecast: generateMockForecast()
      },
      currentTasks: [
        {
          id: '1',
          type: 'watering',
          title: 'Adjust Watering Schedule',
          description: 'Reduce watering frequency as temperatures cool down',
          priority: 'high',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          weatherDependent: true,
          estimatedDuration: 30,
          materials: ['Watering can', 'Moisture meter'],
          tips: ['Check soil moisture before watering', 'Water in the morning', 'Avoid overwatering']
        },
        {
          id: '2',
          type: 'protection',
          title: 'Prepare for Frost Protection',
          description: 'Set up frost protection for sensitive plants',
          priority: 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          weatherDependent: true,
          estimatedDuration: 60,
          materials: ['Frost cloth', 'Stakes', 'Mulch'],
          tips: ['Cover plants before sunset', 'Remove covers in the morning', 'Add extra mulch around base']
        }
      ],
      upcomingTasks: [
        {
          id: '3',
          type: 'pruning',
          title: 'Winter Pruning',
          description: 'Prune dormant plants for better spring growth',
          priority: 'medium',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          weatherDependent: false,
          estimatedDuration: 90,
          materials: ['Pruning shears', 'Gloves', 'Disinfectant'],
          tips: ['Prune on dry days', 'Make clean cuts', 'Disinfect tools between plants']
        }
      ],
      weatherAlerts: [
        {
          type: 'warning',
          title: 'Frost Warning',
          description: 'Temperatures expected to drop below freezing tonight',
          action: 'Cover sensitive plants and bring potted plants indoors'
        },
        {
          type: 'info',
          title: 'High Humidity',
          description: 'Humidity levels above 80% - watch for fungal issues',
          action: 'Improve air circulation and avoid overhead watering'
        }
      ],
      plantSpecificAdvice: [
        {
          plantName: plant.name,
          advice: 'This plant is sensitive to cold temperatures and should be protected when temperatures drop below 50°F',
          priority: 'high'
        }
      ],
      seasonalTips: [
        'Start reducing fertilizer applications',
        'Begin collecting fallen leaves for compost',
        'Check plant supports and stakes',
        'Plan next season\'s garden layout'
      ],
      preparationTasks: [
        {
          task: 'Order seeds for next season',
          deadline: 'End of current month',
          importance: 'medium'
        },
        {
          task: 'Clean and store garden tools',
          deadline: 'Before first frost',
          importance: 'high'
        }
      ]
    };
    setSeasonalPlan(mockPlan);
  };

  const getCurrentSeason = (month: number): string => {
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  };

  const getNextSeason = (currentSeason: string): string => {
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
    const currentIndex = seasons.indexOf(currentSeason);
    return seasons[(currentIndex + 1) % seasons.length];
  };

  const getDaysUntilNextSeason = (month: number): number => {
    const nextSeasonMonths = {
      'Spring': 2, 'Summer': 5, 'Fall': 8, 'Winter': 11
    };
    const currentSeason = getCurrentSeason(month);
    const nextSeason = getNextSeason(currentSeason);
    const nextMonth = nextSeasonMonths[nextSeason as keyof typeof nextSeasonMonths];
    
    if (nextMonth > month) {
      return (nextMonth - month) * 30;
    } else {
      return ((12 - month) + nextMonth) * 30;
    }
  };

  const generateMockForecast = () => {
    const forecast = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      forecast.push({
        date: date.toISOString(),
        high: 20 + Math.random() * 15,
        low: 10 + Math.random() * 10,
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        precipitation: Math.random() * 10
      });
    }
    return forecast;
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return Sun;
      case 'partly cloudy': return Cloud;
      case 'cloudy': return Cloud;
      case 'rainy': return CloudRain;
      case 'snowy': return Snowflake;
      default: return Sun;
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'watering': return Droplets;
      case 'fertilizing': return Leaf;
      case 'pruning': return Target;
      case 'repotting': return Zap;
      case 'protection': return AlertTriangle;
      case 'harvesting': return CheckCircle;
      default: return Calendar;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'alert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!plant) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Select a plant to view seasonal care plan</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Generating seasonal plan...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Seasonal Care Planner</h2>
        <p className="text-gray-600">Weather-aware seasonal care for {plant.name}</p>
      </div>

      {seasonalPlan && (
        <div className="space-y-6">
          {/* Season Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Current Season: {seasonalPlan.currentSeason}</h3>
                <p className="text-gray-600">{seasonalPlan.seasonTransition}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{seasonalPlan.weatherData.temperature.toFixed(0)}°C</div>
                <div className="text-sm text-gray-600">{seasonalPlan.weatherData.condition}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <Droplets className="h-4 w-4 text-blue-600 mr-2" />
                <span>Humidity: {seasonalPlan.weatherData.humidity.toFixed(0)}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="h-4 w-4 text-gray-600 mr-2" />
                <span>Wind: {seasonalPlan.weatherData.windSpeed.toFixed(0)} mph</span>
              </div>
              <div className="flex items-center">
                <CloudRain className="h-4 w-4 text-blue-600 mr-2" />
                <span>Rain: {seasonalPlan.weatherData.precipitation.toFixed(1)}mm</span>
              </div>
              <div className="flex items-center">
                <Sun className="h-4 w-4 text-yellow-600 mr-2" />
                <span>UV: {seasonalPlan.weatherData.uvIndex.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Weather Alerts */}
          {seasonalPlan.weatherAlerts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Alerts</h3>
              <div className="space-y-3">
                {seasonalPlan.weatherAlerts.map((alert, index) => {
                  const AlertIcon = alert.type === 'warning' ? AlertTriangle : 
                                  alert.type === 'alert' ? AlertTriangle : CheckCircle;
                  return (
                    <div key={index} className={`border-l-4 border-l-${alert.type === 'warning' ? 'yellow' : alert.type === 'alert' ? 'red' : 'blue'}-500 bg-${alert.type === 'warning' ? 'yellow' : alert.type === 'alert' ? 'red' : 'blue'}-50 p-4 rounded-r-lg`}>
                      <div className="flex items-start">
                        <AlertIcon className="h-5 w-5 text-gray-600 mr-3 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <p className="text-sm text-gray-700 mt-1">{alert.description}</p>
                          <p className="text-sm text-blue-600 mt-2 font-medium">{alert.action}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Task Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex space-x-4 mb-6">
              {[
                { id: 'current', label: 'Current Tasks', count: seasonalPlan.currentTasks.length },
                { id: 'upcoming', label: 'Upcoming Tasks', count: seasonalPlan.upcomingTasks.length },
                { id: 'preparation', label: 'Preparation', count: seasonalPlan.preparationTasks.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTimeframe(tab.id as any)}
                  className={`px-4 py-2 rounded-md font-medium ${
                    selectedTimeframe === tab.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Current Tasks */}
            {selectedTimeframe === 'current' && (
              <div className="space-y-4">
                {seasonalPlan.currentTasks.map((task) => {
                  const TaskIcon = getTaskIcon(task.type);
                  return (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <TaskIcon className="h-5 w-5 text-gray-600 mr-3 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="font-medium text-gray-900">{task.title}</h4>
                              <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority} priority
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{task.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-1">Materials Needed:</h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {task.materials.map((material, index) => (
                                    <li key={index}>• {material}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-1">Tips:</h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {task.tips.map((tip, index) => (
                                    <li key={index}>• {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                          <div>{task.estimatedDuration} min</div>
                          {task.weatherDependent && (
                            <div className="text-blue-600">Weather dependent</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upcoming Tasks */}
            {selectedTimeframe === 'upcoming' && (
              <div className="space-y-4">
                {seasonalPlan.upcomingTasks.map((task) => {
                  const TaskIcon = getTaskIcon(task.type);
                  return (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <TaskIcon className="h-5 w-5 text-gray-600 mr-3 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className="font-medium text-gray-900">{task.title}</h4>
                              <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority} priority
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{task.description}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                          <div>{task.estimatedDuration} min</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Preparation Tasks */}
            {selectedTimeframe === 'preparation' && (
              <div className="space-y-4">
                {seasonalPlan.preparationTasks.map((task, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">{task.task}</h4>
                          <p className="text-sm text-gray-600">Deadline: {task.deadline}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.importance)}`}>
                        {task.importance} importance
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weather Forecast */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">7-Day Weather Forecast</h3>
              <button
                onClick={() => setShowWeatherDetails(!showWeatherDetails)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {showWeatherDetails ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {seasonalPlan.weatherData.forecast.map((day, index) => {
                const WeatherIcon = getWeatherIcon(day.condition);
                return (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <WeatherIcon className="h-6 w-6 mx-auto text-gray-600 mb-2" />
                    <div className="text-lg font-bold text-gray-900">{day.high.toFixed(0)}°</div>
                    <div className="text-sm text-gray-600">{day.low.toFixed(0)}°</div>
                    <div className="text-xs text-gray-500 mt-1">{day.condition}</div>
                    {day.precipitation > 0 && (
                      <div className="text-xs text-blue-600 mt-1">
                        {day.precipitation.toFixed(1)}mm
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plant-Specific Advice */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plant-Specific Advice</h3>
            <div className="space-y-3">
              {seasonalPlan.plantSpecificAdvice.map((advice, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Brain className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="font-medium text-gray-900">{advice.plantName}</h4>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(advice.priority)}`}>
                          {advice.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{advice.advice}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seasonal Tips */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seasonalPlan.seasonalTips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <Lightbulb className="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISeasonalPlanner;
