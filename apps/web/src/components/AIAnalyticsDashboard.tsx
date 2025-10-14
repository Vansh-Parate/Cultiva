import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  Sun,
  Leaf,
  Brain,
  Loader2
} from 'lucide-react';
import apiClient from '../lib/axios';

interface Plant {
  id: string;
  name: string;
  species?: string;
  healthStatus?: string;
  createdAt: string;
}

interface CareTask {
  id: string;
  type: string;
  completedAt?: string;
  dueDate: string;
  isCompleted: boolean;
  plantName: string;
}

interface HealthLog {
  id: string;
  plantId: string;
  healthStatus: string;
  loggedAt: string;
  issuesNoted?: string;
}

interface AnalyticsData {
  totalPlants: number;
  healthyPlants: number;
  plantsWithIssues: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  averageHealthScore: number;
  careEfficiency: number;
  topPerformingPlants: Array<{
    name: string;
    healthScore: number;
    taskCompletion: number;
  }>;
  careTrends: Array<{
    date: string;
    completed: number;
    overdue: number;
  }>;
  plantGrowth: Array<{
    plantName: string;
    growthRate: number;
    healthImprovement: number;
  }>;
  aiInsights: Array<{
    type: 'success' | 'warning' | 'recommendation';
    title: string;
    description: string;
    action?: string;
  }>;
}

const AIAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'health' | 'care' | 'growth'>('health');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from the backend
      // For now, we'll generate sample analytics data
      const data = generateSampleAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleAnalytics = (): AnalyticsData => {
    return {
      totalPlants: 12,
      healthyPlants: 9,
      plantsWithIssues: 3,
      totalTasks: 48,
      completedTasks: 42,
      overdueTasks: 6,
      averageHealthScore: 85,
      careEfficiency: 87.5,
      topPerformingPlants: [
        { name: 'Monstera Deliciosa', healthScore: 95, taskCompletion: 100 },
        { name: 'Snake Plant', healthScore: 92, taskCompletion: 95 },
        { name: 'Pothos', healthScore: 88, taskCompletion: 90 },
        { name: 'Fiddle Leaf Fig', healthScore: 85, taskCompletion: 85 }
      ],
      careTrends: [
        { date: '2024-01-01', completed: 8, overdue: 2 },
        { date: '2024-01-02', completed: 12, overdue: 1 },
        { date: '2024-01-03', completed: 10, overdue: 3 },
        { date: '2024-01-04', completed: 15, overdue: 0 },
        { date: '2024-01-05', completed: 9, overdue: 4 },
        { date: '2024-01-06', completed: 11, overdue: 2 },
        { date: '2024-01-07', completed: 13, overdue: 1 }
      ],
      plantGrowth: [
        { plantName: 'Monstera Deliciosa', growthRate: 15, healthImprovement: 8 },
        { plantName: 'Snake Plant', growthRate: 5, healthImprovement: 12 },
        { plantName: 'Pothos', growthRate: 25, healthImprovement: 5 },
        { plantName: 'Fiddle Leaf Fig', growthRate: 10, healthImprovement: 15 }
      ],
      aiInsights: [
        {
          type: 'success',
          title: 'Excellent Care Consistency',
          description: 'Your care routine has improved plant health by 15% this month.',
          action: 'Keep up the great work!'
        },
        {
          type: 'warning',
          title: 'Watering Schedule Adjustment Needed',
          description: '3 plants are showing signs of overwatering. Consider reducing frequency.',
          action: 'Review watering schedule'
        },
        {
          type: 'recommendation',
          title: 'Optimal Repotting Time',
          description: 'Your Monstera and Pothos are ready for repotting to support continued growth.',
          action: 'Schedule repotting'
        },
        {
          type: 'success',
          title: 'AI Predictions Accurate',
          description: 'Growth predictions were 92% accurate, helping optimize care timing.',
          action: 'Continue using AI recommendations'
        }
      ]
    };
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'recommendation': return Target;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'recommendation': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-500">Start caring for your plants to see analytics insights.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Analytics Dashboard</h1>
        <p className="text-gray-600">Intelligent insights into your plant care performance</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? '7 Days' : 
               range === '30d' ? '30 Days' : 
               range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plants</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalPlants}</p>
            </div>
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4 flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              {analyticsData.healthyPlants} healthy
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Care Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.careEfficiency}%</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+5% this month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.completedTasks}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {analyticsData.overdueTasks} overdue
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Health Score</p>
              <p className={`text-2xl font-bold ${getHealthScoreColor(analyticsData.averageHealthScore)}`}>
                {analyticsData.averageHealthScore}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+3% this week</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center mb-6">
          <Brain className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">AI Insights & Recommendations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyticsData.aiInsights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${getInsightColor(insight.type)} mr-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    {insight.action && (
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        {insight.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performing Plants */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Plants</h2>
        
        <div className="space-y-4">
          {analyticsData.topPerformingPlants.map((plant, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-semibold">#{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{plant.name}</h3>
                  <p className="text-sm text-gray-600">
                    Health: {plant.healthScore}% • Tasks: {plant.taskCompletion}%
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{plant.healthScore}%</div>
                  <div className="text-xs text-gray-500">Health Score</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{plant.taskCompletion}%</div>
                  <div className="text-xs text-gray-500">Task Completion</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Care Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Care Trends</h2>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {analyticsData.careTrends.map((trend, index) => {
            const maxCompleted = Math.max(...analyticsData.careTrends.map(t => t.completed));
            const maxOverdue = Math.max(...analyticsData.careTrends.map(t => t.overdue));
            const completedHeight = (trend.completed / maxCompleted) * 200;
            const overdueHeight = (trend.overdue / maxOverdue) * 200;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex flex-col items-center space-y-1 mb-2">
                  <div 
                    className="w-8 bg-green-500 rounded-t"
                    style={{ height: `${completedHeight}px` }}
                    title={`${trend.completed} completed`}
                  />
                  <div 
                    className="w-8 bg-red-500 rounded-t"
                    style={{ height: `${overdueHeight}px` }}
                    title={`${trend.overdue} overdue`}
                  />
                </div>
                <div className="text-xs text-gray-500 transform -rotate-45 origin-left">
                  {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Completed Tasks</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Overdue Tasks</span>
          </div>
        </div>
      </div>

      {/* Growth Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Plant Growth Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analyticsData.plantGrowth.map((plant, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">{plant.plantName}</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Growth Rate</span>
                    <span className="font-medium">{plant.growthRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min(plant.growthRate, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Health Improvement</span>
                    <span className="font-medium">{plant.healthImprovement}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(plant.healthImprovement, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;



