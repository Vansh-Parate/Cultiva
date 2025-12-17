import React from 'react';
import { Droplet, Leaf, Scissors, Sprout, Bug } from 'lucide-react';

interface QuickActionsProps {
  onAction?: (action: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest-control') => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      id: 'watering',
      label: 'Watering',
      icon: Droplet,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      description: 'Log watering'
    },
    {
      id: 'fertilizing',
      label: 'Fertilize',
      icon: Leaf,
      color: 'bg-green-100 text-green-600 hover:bg-green-200',
      description: 'Add nutrients'
    },
    {
      id: 'pruning',
      label: 'Prune',
      icon: Scissors,
      color: 'bg-amber-100 text-amber-600 hover:bg-amber-200',
      description: 'Trim growth'
    },
    {
      id: 'repotting',
      label: 'Repot',
      icon: Sprout,
      color: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
      description: 'Change pot'
    },
    {
      id: 'pest-control',
      label: 'Pest Control',
      icon: Bug,
      color: 'bg-red-100 text-red-600 hover:bg-red-200',
      description: 'Check pests'
    }
  ];

  return (
    <div className="mb-4 rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction?.(action.id as any)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${action.color}`}
              title={action.description}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
