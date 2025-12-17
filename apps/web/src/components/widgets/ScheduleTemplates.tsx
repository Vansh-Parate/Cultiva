import React, { useState } from 'react';
import { Plus, Copy, Check } from 'lucide-react';

interface CareTemplate {
  id: string;
  plantSpecies: string;
  tasks: Array<{
    type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest-control';
    frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
    notes?: string;
  }>;
}

interface ScheduleTemplatesProps {
  plantType?: string;
  onApplyTemplate?: (template: CareTemplate) => void;
}

const ScheduleTemplates: React.FC<ScheduleTemplatesProps> = ({
  plantType,
  onApplyTemplate
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Predefined templates for common plant types
  const templates: Record<string, CareTemplate> = {
    succulent: {
      id: 'succulent',
      plantSpecies: 'Succulent (Aloe, Echeveria, etc.)',
      tasks: [
        { type: 'watering', frequency: 'weekly', notes: 'Water sparingly, allow soil to dry completely' },
        { type: 'fertilizing', frequency: 'monthly', notes: 'Use diluted cactus fertilizer during growing season' },
        { type: 'pruning', frequency: 'monthly', notes: 'Remove dead leaves to maintain shape' },
        { type: 'pest-control', frequency: 'monthly', notes: 'Check for mealybugs and spider mites' }
      ]
    },
    tropical: {
      id: 'tropical',
      plantSpecies: 'Tropical Plants (Monstera, Philodendron, etc.)',
      tasks: [
        { type: 'watering', frequency: 'weekly', notes: 'Keep soil consistently moist but not waterlogged' },
        { type: 'fertilizing', frequency: 'weekly', notes: 'Use balanced liquid fertilizer during growing season' },
        { type: 'pruning', frequency: 'monthly', notes: 'Prune to encourage bushier growth' },
        { type: 'pest-control', frequency: 'bi-weekly', notes: 'Monitor for spider mites and scale insects' }
      ]
    },
    fern: {
      id: 'fern',
      plantSpecies: 'Ferns (Boston Fern, Maidenhair, etc.)',
      tasks: [
        { type: 'watering', frequency: 'weekly', notes: 'Keep soil moist; mist fronds regularly' },
        { type: 'fertilizing', frequency: 'monthly', notes: 'Use diluted balanced fertilizer' },
        { type: 'pruning', frequency: 'bi-weekly', notes: 'Remove dead or yellowing fronds' },
        { type: 'pest-control', frequency: 'monthly', notes: 'Check for spider mites and scale' }
      ]
    },
    cactus: {
      id: 'cactus',
      plantSpecies: 'Cacti (Prickly Pear, Barrel Cactus, etc.)',
      tasks: [
        { type: 'watering', frequency: 'monthly', notes: 'Water sparingly; less in winter' },
        { type: 'fertilizing', frequency: 'quarterly', notes: 'Use cactus-specific fertilizer' },
        { type: 'pruning', frequency: 'quarterly', notes: 'Remove dead segments' },
        { type: 'pest-control', frequency: 'monthly', notes: 'Watch for cochineal insects' }
      ]
    },
    flowering: {
      id: 'flowering',
      plantSpecies: 'Flowering Plants (African Violet, Orchid, etc.)',
      tasks: [
        { type: 'watering', frequency: 'weekly', notes: 'Water at soil level; avoid wetting leaves' },
        { type: 'fertilizing', frequency: 'weekly', notes: 'Use flower-promoting fertilizer' },
        { type: 'pruning', frequency: 'bi-weekly', notes: 'Deadhead spent flowers' },
        { type: 'pest-control', frequency: 'bi-weekly', notes: 'Check for spider mites and whiteflies' }
      ]
    },
    herb: {
      id: 'herb',
      plantSpecies: 'Herbs (Basil, Mint, Parsley, etc.)',
      tasks: [
        { type: 'watering', frequency: 'daily', notes: 'Keep soil consistently moist' },
        { type: 'fertilizing', frequency: 'weekly', notes: 'Use balanced or nitrogen-rich fertilizer' },
        { type: 'pruning', frequency: 'weekly', notes: 'Pinch tops to encourage branching and harvest' },
        { type: 'pest-control', frequency: 'weekly', notes: 'Monitor for common garden pests' }
      ]
    }
  };

  const availableTemplates = Object.values(templates);

  const handleCopy = (templateId: string) => {
    setCopiedId(templateId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mb-4 rounded-lg border border-emerald-100 bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Plant Care Schedule Templates</h3>
      <p className="text-xs text-slate-600 mb-3">Select a template based on your plant type to get started with a pre-configured care schedule</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableTemplates.map(template => (
          <div
            key={template.id}
            className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-medium text-slate-900">{template.plantSpecies}</h4>
            </div>

            <div className="space-y-1 mb-3">
              {template.tasks.map((task, idx) => (
                <div key={idx} className="text-xs text-slate-600">
                  <span className="font-medium capitalize">{task.type.replace('-', ' ')}:</span> {task.frequency}
                  {task.notes && <p className="text-slate-500 ml-4 mt-0.5">{task.notes}</p>}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                handleCopy(template.id);
                onApplyTemplate?.(template);
              }}
              className={`w-full px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                copiedId === template.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {copiedId === template.id ? (
                <>
                  <Check className="h-3 w-3" />
                  Applied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Apply Template
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
        <p className="text-xs text-blue-800">
          <span className="font-medium">💡 Tip:</span> Templates provide recommended watering, fertilizing, and care schedules based on plant type. You can customize them after applying.
        </p>
      </div>
    </div>
  );
};

export default ScheduleTemplates;
