import React from 'react';
import { Droplet, Leaf, Scissors, Sprout, Bug, Calendar } from 'lucide-react';

interface CareLog {
  id: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest-control';
  date: string;
  notes?: string;
}

interface PlantCareHistoryProps {
  plantName?: string;
  history?: CareLog[];
}

const PlantCareHistory: React.FC<PlantCareHistoryProps> = ({
  plantName = 'Plant',
  history = []
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'watering': return Droplet;
      case 'fertilizing': return Leaf;
      case 'pruning': return Scissors;
      case 'repotting': return Sprout;
      case 'pest-control': return Bug;
      default: return Calendar;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'watering': return 'text-blue-600 bg-blue-50';
      case 'fertilizing': return 'text-green-600 bg-green-50';
      case 'pruning': return 'text-amber-600 bg-amber-50';
      case 'repotting': return 'text-emerald-600 bg-emerald-50';
      case 'pest-control': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="mb-4 rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Care History: {plantName}</h3>

      {history.length === 0 ? (
        <div className="text-center py-6">
          <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No care history yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {history.map((log, idx) => {
            const Icon = getIcon(log.type);
            const colors = getColor(log.type);
            return (
              <div key={log.id || idx} className="flex items-start gap-3 p-2 rounded-lg border border-slate-100 hover:bg-slate-50">
                <div className={`flex-shrink-0 p-2 rounded ${colors}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-slate-900">{getLabel(log.type)}</p>
                    <span className="text-xs text-slate-500 flex-shrink-0">{formatDate(log.date)}</span>
                  </div>
                  {log.notes && <p className="text-xs text-slate-600 mt-1">{log.notes}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlantCareHistory;
