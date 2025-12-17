import React, { useMemo } from 'react';
import { Lightbulb, Check, X } from 'lucide-react';

interface CareTask {
  id: string;
  plantName: string;
  type: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'pest-control';
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  dueDate: string;
  completed: boolean;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

interface AutomationSuggestion {
  id: string;
  title: string;
  description: string;
  reason: string;
  type: 'recurring' | 'scheduling' | 'grouping';
  impact: 'high' | 'medium';
}

interface TaskAutomationSuggestionsProps {
  tasks?: CareTask[];
  onCreateRecurring?: (plantName: string, type: CareTask['type'], frequency: CareTask['frequency']) => void;
}

const TaskAutomationSuggestions: React.FC<TaskAutomationSuggestionsProps> = ({
  tasks = [],
  onCreateRecurring
}) => {
  const suggestions = useMemo(() => {
    const sug: AutomationSuggestion[] = [];

    if (tasks.length === 0) {
      return sug;
    }

    // Suggestion 1: Identify frequently repeated tasks
    const tasksByPlantAndType = new Map<string, CareTask[]>();
    tasks.forEach(task => {
      const key = `${task.plantName}-${task.type}`;
      if (!tasksByPlantAndType.has(key)) {
        tasksByPlantAndType.set(key, []);
      }
      tasksByPlantAndType.get(key)!.push(task);
    });

    tasksByPlantAndType.forEach((plantTasks, key) => {
      if (plantTasks.length >= 3) {
        const [plantName, type] = key.split('-');
        const completedCount = plantTasks.filter(t => t.completed).length;
        if (completedCount >= 2) {
          sug.push({
            id: `recurring-${key}`,
            title: `Automate ${plantName} ${type}`,
            description: `Create a recurring schedule for ${type} ${plantName}`,
            reason: `You've completed ${completedCount} ${type} tasks for ${plantName}. Setting up automation will save time.`,
            type: 'recurring',
            impact: 'high'
          });
        }
      }
    });

    // Suggestion 2: Group similar tasks
    const taskCounts = new Map<CareTask['type'], number>();
    tasks.forEach(task => {
      taskCounts.set(task.type, (taskCounts.get(task.type) || 0) + 1);
    });

    taskCounts.forEach((count, type) => {
      if (count >= 4) {
        sug.push({
          id: `group-${type}`,
          title: `Batch ${type} tasks`,
          description: `You have ${count} ${type} tasks. Consider batching them for efficiency.`,
          reason: 'Grouping similar care tasks can improve efficiency and reduce care session time.',
          type: 'grouping',
          impact: 'medium'
        });
      }
    });

    // Suggestion 3: Overdue tasks pattern
    const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date());
    if (overdueTasks.length >= 2) {
      const mostCommonType = overdueTasks.reduce((acc, task) => {
        const count = overdueTasks.filter(t => t.type === task.type).length;
        return count > (acc[task.type] || 0) ? { ...acc, [task.type]: count } : acc;
      }, {} as Record<string, number>);

      const type = Object.keys(mostCommonType)[0] as CareTask['type'];
      sug.push({
        id: 'overdue-pattern',
        title: `Adjust ${type} frequency`,
        description: `Multiple ${type} tasks are overdue. You might need more frequent reminders.`,
        reason: 'Your current schedule may not match your actual care routine.',
        type: 'scheduling',
        impact: 'high'
      });
    }

    return sug;
  }, [tasks]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Automation Suggestions</h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <div key={suggestion.id} className="bg-white rounded-lg p-2.5 text-xs">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{suggestion.title}</p>
                    <p className="text-slate-600 mt-0.5">{suggestion.reason}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                    suggestion.impact === 'high'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {suggestion.impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-2 rounded-lg bg-white">
            <p className="text-xs text-slate-600">
              <span className="font-medium">📌 Note:</span> These suggestions are based on your task patterns. Manual recurring schedules can be created in the Recurring Schedules section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAutomationSuggestions;
