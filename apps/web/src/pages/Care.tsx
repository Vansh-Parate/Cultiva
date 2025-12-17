import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Check, AlertCircle, LayoutList, Grid3x3, TrendingUp, Zap } from 'lucide-react';
import apiClient from '../lib/axios';
import CareStatistics from '../components/widgets/CareStatistics';
import CareCalendarMonthView from '../components/widgets/CareCalendarMonthView';
import TaskTimelineView from '../components/widgets/TaskTimelineView';
import CareFrequencyChart from '../components/widgets/CareFrequencyChart';
import CareTypeDistributionChart from '../components/widgets/CareTypeDistributionChart';
import TaskCompletionRateChart from '../components/widgets/TaskCompletionRateChart';
import RecurringTaskManager from '../components/widgets/RecurringTaskManager';
import ScheduleTemplates from '../components/widgets/ScheduleTemplates';
import TaskAutomationSuggestions from '../components/widgets/TaskAutomationSuggestions';
import { badgeClasses, inputClasses } from '../lib/classNameHelpers';

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


// Modern SVG Icons
const WateringSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2c0 0-6 7-6 11c0 3.314 2.686 6 6 6s6-2.686 6-6c0-4-6-11-6-11z" opacity="0.4"/>
    <path d="M12 13c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
  </svg>
);

const FertilizingSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2l-3 8h6l-3-8z" opacity="0.6"/>
    <circle cx="12" cy="15" r="4" opacity="0.4"/>
    <path d="M12 20v2M8 21h8"/>
  </svg>
);

const PruningSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M3 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" opacity="0.4"/>
    <path d="M17 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z"/>
    <line x1="11" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const RepottingSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M7 18h10l-2-8H9l-2 8z" opacity="0.4"/>
    <path d="M5 18v1h14v-1M6 11h12V6H6v5z" strokeLinecap="round" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const PestControlSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <circle cx="7" cy="7" r="2" opacity="0.6"/>
    <circle cx="17" cy="7" r="2" opacity="0.6"/>
    <path d="M12 4c2 2 3 5 3 8s-1 6-3 8-3-5-3-8 1-6 3-8z" opacity="0.4" strokeLinecap="round" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const AISVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" opacity="0.3"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <circle cx="7" cy="12" r="1.5" opacity="0.6"/>
    <circle cx="17" cy="12" r="1.5" opacity="0.6"/>
  </svg>
);

const Care = () => {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'' | CareTask['type']>('');
  const [priorityFilter, setPriorityFilter] = useState<'' | CareTask['priority']>('');
  const [newTask, setNewTask] = useState({
    plantName: '',
    type: 'watering' as CareTask['type'],
    frequency: 'weekly' as CareTask['frequency'],
    dueDate: '',
    notes: '',
    priority: 'medium' as CareTask['priority']
  });
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAutomation, setShowAutomation] = useState(false);
  const [recurringSchedules, setRecurringSchedules] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
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

      setTasks(tasksRes.data);

    } catch (err) {
      console.error('Failed to fetch data:', err);
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


  const handleCompleteTask = async (taskId: string) => {
    try {
      await apiClient.patch(`/api/v1/care-tasks/${taskId}/complete`);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      ));
    } catch (err) {
      console.error('Failed to complete task:', err);
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

  const handleAddRecurringSchedule = (schedule: any) => {
    const newSchedule = {
      id: Date.now().toString(),
      ...schedule,
      nextDueDate: new Date().toISOString()
    };
    setRecurringSchedules([...recurringSchedules, newSchedule]);
  };

  const handleDeleteRecurringSchedule = (id: string) => {
    setRecurringSchedules(recurringSchedules.filter(s => s.id !== id));
  };

  const handleToggleRecurringSchedule = (id: string) => {
    setRecurringSchedules(recurringSchedules.map(s =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const getTaskIcon = (type: CareTask['type']) => {
    switch (type) {
      case 'watering': return <WateringSVG />;
      case 'fertilizing': return <FertilizingSVG />;
      case 'pruning': return <PruningSVG />;
      case 'repotting': return <RepottingSVG />;
      case 'pest-control': return <PestControlSVG />;
      default: return <Calendar className="w-6 h-6" />;
    }
  };

  const getPriorityBadgeClass = (priority: CareTask['priority']) => {
    switch (priority) {
      case 'high': return badgeClasses.error;
      case 'medium': return badgeClasses.warning;
      case 'low': return badgeClasses.success;
      default: return badgeClasses.neutral;
    }
  };

  const getDueStatus = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'overdue', color: 'text-red-600' };
    if (diffDays === 0) return { status: 'due today', color: 'text-orange-600' };
    if (diffDays <= 2) return { status: `due in ${diffDays} days`, color: 'text-yellow-600' };
    return { status: `due in ${diffDays} days`, color: 'text-emerald-600' };
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' ||
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed);
    const matchesSearch = task.plantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || task.type === typeFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    return matchesFilter && matchesSearch && matchesType && matchesPriority;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen antialiased selection:bg-emerald-200/60 selection:text-emerald-900 bg-gradient-to-b from-emerald-50 via-white to-white text-[hsl(var(--foreground))]`}>
      {/* Decorative Background Blobs */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl opacity-50"></div>
        <div className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-emerald-200/15 blur-3xl opacity-50"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-teal-200/15 blur-3xl opacity-50"></div>
      </div>

      <div className="relative w-full px-4 sm:px-5 lg:px-6 py-5 lg:py-6">
        {/* Header Section */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">Plant Care</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Manage tasks and schedules with AI assistance</p>
        </div>

        {/* Care Statistics - Phase 1 Priority */}
        {tasks.length > 0 && (
          <CareStatistics
            totalTasks={tasks.length}
            completedTasks={tasks.filter(t => t.completed).length}
            overdueTasks={tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length}
            completionRate={Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}
          />
        )}

        {/* Urgent Alert Banner - Phase 1 Priority */}
        {tasks.length > 0 && (() => {
          const overdue = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;
          const dueToday = tasks.filter(t => !t.completed && new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
          return (overdue > 0 || dueToday > 0) ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-900 mb-1">Action Needed</h3>
                  {overdue > 0 && <p className="text-xs text-red-700">{overdue} overdue task{overdue !== 1 ? 's' : ''}</p>}
                  {dueToday > 0 && <p className="text-xs text-red-700">{dueToday} task{dueToday !== 1 ? 's' : ''} due today</p>}
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Blank State */}
        {tasks.length === 0 && (
          <div className="mb-4 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 text-center">
            <Calendar className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 mb-1">No care tasks yet</h3>
            <p className="text-xs text-slate-600 mb-4">Create your first care task to get started</p>
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 inline-flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" />Create Task
            </button>
          </div>
        )}

        {/* View Toggle & Filters */}
        {tasks.length > 0 && (
          <>
            {/* View Toggle */}
            <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-white">
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'timeline'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Timeline view"
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'calendar'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Calendar view"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors border ${
                    showAnalytics
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
                  }`}
                  title="Show analytics"
                >
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </button>
                <button
                  onClick={() => setShowAutomation(!showAutomation)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors border ${
                    showAutomation
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
                  }`}
                  title="Show automation"
                >
                  <Zap className="h-4 w-4" />
                  Automation
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-9 pr-3 rounded-lg py-2 text-xs w-full sm:w-48 ${inputClasses.base}`}
                />
              </div>
            </div>

            {/* Task Filters */}
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-600">Filter:</span>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
                className={`rounded-lg px-3 py-1.5 text-xs ${inputClasses.base}`}
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as '' | CareTask['type'])}
                className={`rounded-lg px-3 py-1.5 text-xs ${inputClasses.base}`}
              >
                <option value="">All Types</option>
                <option value="watering">Watering</option>
                <option value="fertilizing">Fertilizing</option>
                <option value="pruning">Pruning</option>
                <option value="repotting">Repotting</option>
                <option value="pest-control">Pest control</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as '' | CareTask['priority'])}
                className={`rounded-lg px-3 py-1.5 text-xs ${inputClasses.base}`}
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Views */}
            {viewMode === 'calendar' && (
              <CareCalendarMonthView
                tasks={filteredTasks.map(t => ({
                  id: t.id,
                  date: t.dueDate,
                  type: t.type,
                  plantName: t.plantName,
                  completed: t.completed,
                  priority: t.priority
                }))}
              />
            )}

            {viewMode === 'timeline' && (
              <TaskTimelineView
                tasks={filteredTasks.map(t => ({
                  id: t.id,
                  plantName: t.plantName,
                  type: t.type,
                  dueDate: t.dueDate,
                  completed: t.completed,
                  priority: t.priority,
                  notes: t.notes
                }))}
                onTaskComplete={handleCompleteTask}
                getTaskIcon={getTaskIcon}
              />
            )}

            {/* Analytics Section - Phase 2 */}
            {showAnalytics && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Care Analytics
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <CareFrequencyChart tasks={tasks} />
                  <CareTypeDistributionChart tasks={tasks} />
                </div>
                <TaskCompletionRateChart tasks={tasks} />
              </div>
            )}

            {/* Automation Section - Phase 3 */}
            {showAutomation && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Care Automation
                </h2>

                {/* Automation Suggestions */}
                <div className="mb-6">
                  <TaskAutomationSuggestions tasks={tasks} />
                </div>

                {/* Schedule Templates */}
                <div className="mb-6">
                  <ScheduleTemplates
                    onApplyTemplate={(template) => {
                      template.tasks.forEach(task => {
                        setNewTask({
                          ...newTask,
                          plantName: template.plantSpecies,
                          type: task.type,
                          frequency: task.frequency,
                          notes: task.notes || ''
                        });
                      });
                    }}
                  />
                </div>

                {/* Recurring Task Manager */}
                <div className="mb-6">
                  <RecurringTaskManager
                    schedules={recurringSchedules}
                    onAddSchedule={handleAddRecurringSchedule}
                    onDeleteSchedule={handleDeleteRecurringSchedule}
                    onToggleSchedule={handleToggleRecurringSchedule}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Task List - Minimal Cards */}
        {tasks.length > 0 && (
          <div className="space-y-2 mb-6">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => {
                const dueStatus = getDueStatus(task.dueDate);
                return (
                  <div key={task.id} className="group rounded-lg backdrop-blur border border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 dark:bg-[hsl(var(--card))]/30 p-3 hover:shadow-md hover:border-emerald-300/50 dark:hover:border-emerald-900/50 transition-all">
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                          task.completed
                            ? 'bg-emerald-600 dark:bg-emerald-600 border-emerald-600 text-white'
                            : 'border-[hsl(var(--border))] hover:border-emerald-600 dark:hover:border-emerald-500'
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3" />}
                      </button>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <div className="text-[hsl(var(--foreground))] w-4 h-4 flex-shrink-0">
                            {getTaskIcon(task.type)}
                          </div>
                          <h3 className={`font-medium text-xs text-[hsl(var(--foreground))] transition ${task.completed ? 'line-through text-[hsl(var(--muted-foreground))]' : ''}`}>
                            {task.plantName}
                          </h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.notes && <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{task.notes}</p>}
                        <div className="flex items-center gap-2 flex-wrap text-xs text-[hsl(var(--muted-foreground))]">
                          <span className="capitalize">{task.type}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-[hsl(var(--muted-foreground))]/30"></span>
                          <span className={dueStatus.color}>{dueStatus.status}</span>
                          {task.frequency && (
                            <>
                              <span className="w-0.5 h-0.5 rounded-full bg-[hsl(var(--muted-foreground))]/30"></span>
                              <span className="capitalize">{task.frequency}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      {!task.completed && (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 dark:hover:bg-emerald-500 transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--muted-foreground))]" />
                <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium">No tasks match your filters</p>
              </div>
            )}
          </div>
        )}


        {/* Floating Add Button */}
        {tasks.length > 0 && (
          <div className="fixed bottom-8 right-8 z-40">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 dark:hover:bg-emerald-500 hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        )}

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="rounded-xl bg-[hsl(var(--card))] w-full max-w-lg shadow-2xl border border-[hsl(var(--border))]">
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-[hsl(var(--foreground))]">Add Care Task</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition text-lg leading-none">✕</button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label htmlFor="plantName" className="mb-1.5 block text-xs font-medium text-[hsl(var(--foreground))]">Plant name</label>
                    <input
                      id="plantName"
                      value={newTask.plantName}
                      onChange={(e) => setNewTask({ ...newTask, plantName: e.target.value })}
                      className={`rounded-lg px-3 py-2 text-xs ${inputClasses.base}`}
                      placeholder="e.g., Aloe Vera"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="taskType" className="mb-1.5 block text-xs font-medium text-[hsl(var(--foreground))]">Type</label>
                      <select
                        id="taskType"
                        value={newTask.type}
                        onChange={(e) => setNewTask({ ...newTask, type: e.target.value as CareTask['type'] })}
                        className={`rounded-lg px-3 py-2 text-xs ${inputClasses.base}`}
                      >
                        <option value="watering">Watering</option>
                        <option value="fertilizing">Fertilizing</option>
                        <option value="pruning">Pruning</option>
                        <option value="repotting">Repotting</option>
                        <option value="pest-control">Pest control</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="taskFrequency" className="mb-1.5 block text-xs font-medium text-[hsl(var(--foreground))]">Frequency</label>
                      <select
                        id="taskFrequency"
                        value={newTask.frequency}
                        onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value as CareTask['frequency'] })}
                        className={`rounded-lg px-3 py-2 text-xs ${inputClasses.base}`}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="dueDate" className="mb-1.5 block text-xs font-medium text-[hsl(var(--foreground))]">Due date</label>
                      <input
                        id="dueDate"
                        type="datetime-local"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className={`rounded-lg px-3 py-2 text-xs ${inputClasses.base}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="priority" className="mb-1.5 block text-xs font-medium text-[hsl(var(--foreground))]">Priority</label>
                      <select
                        id="priority"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as CareTask['priority'] })}
                        className={`rounded-lg px-3 py-2 text-xs ${inputClasses.base}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="notes" className="mb-1.5 block text-xs font-medium text-[hsl(var(--foreground))]">Notes</label>
                    <textarea
                      id="notes"
                      value={newTask.notes}
                      onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                      rows={2}
                      className={`rounded-lg px-3 py-2 text-xs resize-none ${inputClasses.base}`}
                      placeholder="Optional notes"
                    />
                  </div>
                  <div className="mt-2 flex gap-2 justify-end">
                    <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-xs font-medium transition border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]">Cancel</button>
                    <button onClick={handleAddTask} className="px-4 py-2 rounded-lg text-xs font-medium transition text-white bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 hover:-translate-y-0.5 hover:shadow-md">Add Task</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Care;
