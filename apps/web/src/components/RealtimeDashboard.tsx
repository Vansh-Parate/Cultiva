import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, Clock, Users, Leaf } from 'lucide-react';
import { useRealtimeCareTasks } from '../hooks/useRealtimeCareTasks';
import { useRealtimePlantHealth } from '../hooks/useRealtimePlantHealth';
import { useRealtimeCommunity } from '../hooks/useRealtimeCommunity';
import { useRealtimeUpdates } from '../hooks/useRealtimeUpdates';

interface DashboardStats {
  totalPlants: number;
  tasksCompleted: number;
  healthAlerts: number;
  communityEngagement: number;
}

const RealtimeDashboard: React.FC = () => {
  const { tasks, getStats } = useRealtimeCareTasks();
  const { plantHealth, getAllHealth } = useRealtimePlantHealth();
  const { posts } = useRealtimeCommunity();
  const { connected } = useRealtimeUpdates();

  const [stats, setStats] = useState<DashboardStats>({
    totalPlants: 0,
    tasksCompleted: 0,
    healthAlerts: 0,
    communityEngagement: 0,
  });

  // Update stats
  useEffect(() => {
    const taskStats = getStats();
    const allHealth = getAllHealth();
    const healthAlerts = allHealth.filter((h) => h.status === 'critical' || h.status === 'warning').length;
    const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);

    setStats({
      totalPlants: allHealth.length || 0,
      tasksCompleted: taskStats.completed,
      healthAlerts: healthAlerts,
      communityEngagement: posts.length + totalLikes,
    });
  }, [tasks, plantHealth, posts, getStats, getAllHealth]);

  const taskStats = getStats();

  return (
    <div className="w-full space-y-6">
      {/* Connection Status */}
      {!connected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800">Real-time connection is being established...</span>
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Plants */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-900">Plants</h3>
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-700">{stats.totalPlants}</div>
          <p className="text-sm text-green-600 mt-2">Active plants in collection</p>
        </div>

        {/* Tasks Completed */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-900">Tasks Completed</h3>
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-700">{stats.tasksCompleted}</div>
          <p className="text-sm text-blue-600 mt-2">Out of {taskStats.total} total tasks</p>
        </div>

        {/* Health Alerts */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-red-900">Health Alerts</h3>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-700">{stats.healthAlerts}</div>
          <p className="text-sm text-red-600 mt-2">Plants needing attention</p>
        </div>

        {/* Community Engagement */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-900">Community</h3>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-700">{stats.communityEngagement}</div>
          <p className="text-sm text-purple-600 mt-2">Posts and interactions</p>
        </div>
      </div>

      {/* Task Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Task Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-blue-600">{taskStats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Due Today</div>
            <div className="text-2xl font-bold text-yellow-600">{taskStats.dueToday}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Overdue</div>
            <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Completion Rate
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-gray-900">
                {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">
                {taskStats.total - taskStats.completed} tasks pending
              </span>
            </div>
            <p className="text-sm text-yellow-700">
              Keep track of your plant care routine to ensure they stay healthy!
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Real-time Updates</span>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
            ></div>
            <span className="text-sm font-medium">{connected ? 'Connected' : 'Reconnecting...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeDashboard;
