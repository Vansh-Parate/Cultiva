import React, { useMemo } from 'react';
import { TrendingUp, Heart, Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface AnalyticsDashboardProps {
  plant: {
    id: string;
    name: string;
    species: string;
    healthStatus: string;
  };
  healthScore?: number;
  careHistory?: Array<{
    id: string;
    careType: string;
    completedAt: string;
    notes?: string;
  }>;
}

interface HealthMetric {
  label: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

const EnhancedAnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ plant, healthScore = 78, careHistory = [] }) => {
  const metrics = useMemo<HealthMetric[]>(() => {
    const lastMonth = careHistory.filter(c => {
      const date = new Date(c.completedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date > thirtyDaysAgo;
    });

    const waterings = lastMonth.filter(c => c.careType === 'watering').length;
    const fertilizations = lastMonth.filter(c => c.careType === 'fertilizing').length;
    const prunings = lastMonth.filter(c => c.careType === 'pruning').length;

    return [
      {
        label: 'Health Score',
        value: healthScore,
        unit: '%',
        icon: <Heart className="w-5 h-5" />,
        color: healthScore > 75 ? 'from-emerald-500 to-teal-600' : healthScore > 50 ? 'from-amber-500 to-orange-600' : 'from-red-500 to-rose-600',
        trend: healthScore > 70 ? 'up' : 'stable'
      },
      {
        label: 'Watering Frequency',
        value: waterings,
        unit: 'times/month',
        icon: <Zap className="w-5 h-5" />,
        color: 'from-blue-500 to-cyan-600',
        trend: waterings > 8 ? 'up' : 'stable'
      },
      {
        label: 'Fertilization',
        value: fertilizations,
        unit: 'times/month',
        icon: <Zap className="w-5 h-5" />,
        color: 'from-emerald-500 to-green-600',
        trend: fertilizations > 2 ? 'up' : 'stable'
      },
      {
        label: 'Total Care Acts',
        value: lastMonth.length,
        unit: 'actions',
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'from-purple-500 to-pink-600',
        trend: 'up'
      }
    ];
  }, [healthScore, careHistory]);

  const healthStatus = useMemo(() => {
    if (healthScore >= 80) return { status: 'Excellent', color: 'bg-emerald-100 text-emerald-800', icon: '✨' };
    if (healthScore >= 60) return { status: 'Good', color: 'bg-blue-100 text-blue-800', icon: '👍' };
    if (healthScore >= 40) return { status: 'Fair', color: 'bg-amber-100 text-amber-800', icon: '⚠️' };
    return { status: 'Poor', color: 'bg-red-100 text-red-800', icon: '🚨' };
  }, [healthScore]);

  const lastWatered = useMemo(() => {
    const lastWaterLog = careHistory.find(c => c.careType === 'watering');
    if (!lastWaterLog) return 'Never';
    const date = new Date(lastWaterLog.completedAt);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffHours < 48) return 'Yesterday';
    return `${Math.floor(diffHours / 24)} days ago`;
  }, [careHistory]);

  const careComplianceRate = useMemo(() => {
    if (careHistory.length === 0) return 0;
    const lastMonth = careHistory.filter(c => {
      const date = new Date(c.completedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date > thirtyDaysAgo;
    });
    return Math.min(100, Math.round((lastMonth.length / 15) * 100)); // Expecting ~15 care acts per month
  }, [careHistory]);

  return (
    <div className="w-full space-y-6">
      {/* Main Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plant Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{plant.name}</h2>
              <p className="text-gray-600">{plant.species}</p>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className={`px-4 py-2 rounded-full ${healthStatus.color} font-medium`}>
                <span className="mr-2">{healthStatus.icon}</span>
                {healthStatus.status}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">{healthScore}%</p>
                <p className="text-xs text-gray-500">Overall Health</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💧</span>
                <span className="text-xs font-medium text-gray-600">Last Watered</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{lastWatered}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📅</span>
                <span className="text-xs font-medium text-gray-600">Care Compliance</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{careComplianceRate}%</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌱</span>
                <span className="text-xs font-medium text-gray-600">Growth Stage</span>
              </div>
              <p className="text-sm font-bold text-gray-900">Thriving</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⏱️</span>
                <span className="text-xs font-medium text-gray-600">Care Schedule</span>
              </div>
              <p className="text-sm font-bold text-gray-900">On Track</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{metric.label}</p>
              </div>
              <div className={`text-gray-400`}>
                {metric.icon}
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-3xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                {metric.value}
              </span>
              {metric.unit && <span className="text-sm text-gray-600">{metric.unit}</span>}
            </div>

            {/* Mini progress bar */}
            {typeof metric.value === 'number' && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${metric.color}`}
                  style={{ width: `${Math.min(100, (metric.value / 100) * 100)}%` }}
                />
              </div>
            )}

            {metric.trend && (
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                {metric.trend === 'up' && '📈 Improving'}
                {metric.trend === 'down' && '📉 Declining'}
                {metric.trend === 'stable' && '➡️ Stable'}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Health Insights */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-xl border border-emerald-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-emerald-600" />
          Health Insights & Recommendations
        </h3>

        <div className="space-y-3">
          {healthScore >= 80 && (
            <div className="bg-white rounded-lg p-3 border-l-4 border-emerald-400">
              <p className="text-sm text-gray-700">
                <span className="font-medium">✨ Excellent Health:</span> Your plant is thriving! Continue with regular care and monitor for any changes.
              </p>
            </div>
          )}

          {healthScore >= 60 && healthScore < 80 && (
            <div className="bg-white rounded-lg p-3 border-l-4 border-blue-400">
              <p className="text-sm text-gray-700">
                <span className="font-medium">👍 Good Condition:</span> Your plant is doing well. Consider increasing watering frequency slightly if soil is drying too quickly.
              </p>
            </div>
          )}

          {healthScore >= 40 && healthScore < 60 && (
            <div className="bg-white rounded-lg p-3 border-l-4 border-amber-400">
              <p className="text-sm text-gray-700">
                <span className="font-medium">⚠️ Needs Attention:</span> Review watering schedule and light conditions. Consider fertilizing if not done recently.
              </p>
            </div>
          )}

          {healthScore < 40 && (
            <div className="bg-white rounded-lg p-3 border-l-4 border-red-400">
              <p className="text-sm text-gray-700">
                <span className="font-medium">🚨 Urgent Care Needed:</span> Check for pests, disease, or environmental stress. Adjust watering and light immediately.
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg p-3 border-l-4 border-purple-400">
            <p className="text-sm text-gray-700">
              <span className="font-medium">📊 Care Compliance:</span> You're maintaining <strong>{careComplianceRate}%</strong> compliance with recommended care. Keep up the consistent care routine!
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 border-l-4 border-pink-400">
            <p className="text-sm text-gray-700">
              <span className="font-medium">🎯 Next Steps:</span> Focus on maintaining consistent watering schedules and ensure adequate light exposure for optimal growth.
            </p>
          </div>
        </div>
      </div>

      {/* Care Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          Recent Care History
        </h3>

        {careHistory.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {careHistory.slice(-5).reverse().map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{entry.careType}</p>
                    {entry.notes && <p className="text-xs text-gray-500">{entry.notes}</p>}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(entry.completedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No care history recorded yet. Start documenting your plant care!</p>
        )}
      </div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
