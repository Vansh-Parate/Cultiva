import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Check } from 'lucide-react';
import apiClient from '../lib/axios';
import TodaysTasks from '../components/widgets/TodaysTasks';
import { useWeather } from '../hooks/useWeather';
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

interface CareRecommendations {
  watering?: string;
  light?: string;
  temperature?: string;
  fertilization?: string;
  tasks?: string;
  seasonal?: string;
  general?: string;
}

type GeneratedTask = {
  plantName?: string;
  type?: CareTask['type'];
  frequency?: CareTask['frequency'];
  dueDate?: string;
  notes?: string;
  priority?: CareTask['priority'];
};

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
  const [careRecommendations, setCareRecommendations] = useState<Record<string, CareRecommendations>>({});
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    plantName: '',
    type: 'watering' as CareTask['type'],
    frequency: 'weekly' as CareTask['frequency'],
    dueDate: '',
    notes: '',
    priority: 'medium' as CareTask['priority']
  });

  const { weather } = useWeather();

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
      await generateCareRecommendations(mappedPlants);

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

  const generateTaskFromAI = async () => {
    if (!aiInput.trim()) return;
    setAiError(null);
    setAiLoading(true);
    try {
      const prompt = `You are a plant care assistant. Convert the user's request into a single care task JSON.
Request: "${aiInput}"

Return ONLY compact JSON with keys: plantName (string), type (one of watering|fertilizing|pruning|repotting|pest-control), frequency (one of daily|weekly|bi-weekly|monthly|quarterly), dueDate (ISO 8601 string, default next suitable time in user's local timezone), notes (short string), priority (one of low|medium|high).`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + import.meta.env.VITE_GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      let parsed: GeneratedTask | null = null;
      try {
        parsed = JSON.parse(text) as GeneratedTask;
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          try { parsed = JSON.parse(match[0]) as GeneratedTask; } catch { void 0; }
        }
      }

      if (!parsed) throw new Error('Could not parse AI response');

      const nextTask = {
        plantName: String(parsed.plantName || ''),
        type: (['watering','fertilizing','pruning','repotting','pest-control'] as const).includes(parsed.type as CareTask['type']) ? (parsed.type as CareTask['type']) : 'watering',
        frequency: (['daily','weekly','bi-weekly','monthly','quarterly'] as const).includes(parsed.frequency as CareTask['frequency']) ? (parsed.frequency as CareTask['frequency']) : 'weekly',
        dueDate: (() => {
          const d = new Date(parsed?.dueDate || Date.now());
          if (isNaN(d.getTime())) return '';
          const pad = (n: number) => String(n).padStart(2, '0');
          const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
          return `${local.getFullYear()}-${pad(local.getMonth()+1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}`;
        })(),
        notes: String(parsed.notes || ''),
        priority: (['low','medium','high'] as const).includes(parsed.priority as CareTask['priority']) ? (parsed.priority as CareTask['priority']) : 'medium'
      };

      setNewTask(nextTask);
      setShowAddModal(true);
    } catch (err: unknown) {
      console.error('AI generation error:', err);
      setAiError('Could not generate a task. Please try refining your request.');
    } finally {
      setAiLoading(false);
    }
  };

  const generateCareRecommendations = async (plants: Plant[]) => {
    try {
      for (const plant of plants) {
        if (plant.species && !careRecommendations[plant.id]) {
          const recommendations = await getCareRecommendationsFromGemini(plant.species, plant.name);
          setCareRecommendations(prev => ({ ...prev, [plant.id]: recommendations }));
        }
      }
    } catch (err) {
      console.error('Failed to generate care recommendations:', err);
    }
  };

  const getCareRecommendationsFromGemini = async (species: string, plantName: string): Promise<CareRecommendations | null> => {
    try {
      const prompt = `Provide care recommendations for ${plantName} (${species}) based on current conditions. Include:
      1. Watering schedule and amount
      2. Light requirements
      3. Temperature preferences
      4. Fertilization needs
      5. Common care tasks and frequency
      6. Seasonal care adjustments

      Format as a JSON object with keys: watering, light, temperature, fertilization, tasks, seasonal.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + import.meta.env.VITE_GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      const recommendationsText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      try {
        return JSON.parse(recommendationsText);
      } catch {
        return { general: recommendationsText };
      }
    } catch (err) {
      console.error('Gemini API error:', err);
      return null;
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

    if (diffDays < 0) return { status: 'overdue', color: 'text-red-600', bg: 'bg-red-50' };
    if (diffDays === 0) return { status: 'due today', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (diffDays <= 2) return { status: `due in ${diffDays} days`, color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: `due in ${diffDays} days`, color: 'text-green-600', bg: 'bg-green-50' };
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
    <div className={`min-h-screen antialiased selection:bg-emerald-200/60 selection:text-emerald-900 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]`}>
      {/* Decorative Background Blobs */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl opacity-50 dark:bg-emerald-800/25 dark:opacity-40"></div>
        <div className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-emerald-200/15 blur-3xl opacity-50 dark:bg-emerald-700/20 dark:opacity-30"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-teal-200/15 blur-3xl opacity-50 dark:bg-teal-700/20 dark:opacity-25"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-medium text-[hsl(var(--foreground))] tracking-tight mb-2">Plant Care</h1>
          <p className="text-lg text-[hsl(var(--muted-foreground))]">Manage your plant care tasks and schedules with AI assistance</p>
        </div>

        {/* AI Task Assistant - Minimal Card */}
        <div className="mb-8 rounded-2xl backdrop-blur border border-emerald-200/30 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-emerald-600 dark:text-emerald-400">
              <AISVG />
            </div>
            <h2 className="text-xl sm:text-2xl font-medium text-[hsl(var(--foreground))]">AI Task Generator</h2>
          </div>
          <p className="text-[hsl(var(--muted-foreground))] mb-4 text-sm sm:text-base">Describe your care task in natural language and let AI create it for you</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="E.g., Water my Snake Plant every Sunday"
              className={`flex-1 rounded-full px-4 py-3 text-sm transition ${inputClasses.base}`}
            />
            <button
              onClick={generateTaskFromAI}
              disabled={aiLoading}
              className={`rounded-full px-6 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:shadow-md ${aiLoading ? 'opacity-60' : ''} bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500`}
            >
              {aiLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          {aiError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{aiError}</p>}
        </div>

        {/* Blank State */}
        {tasks.length === 0 && (
          <div className="mb-8 rounded-2xl backdrop-blur border border-emerald-200/30 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 p-8 sm:p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-emerald-600 dark:text-emerald-400">
                <path d="M12 2C8 2 6 6 6 6s4 0 6-2c2 2 6 2 6 2s-2-4-6-4z" /><path d="M6 10c0 3.866 3.134 7 7 7h1v5h-2v-3.5C8.91 17.83 6 14.33 6 10z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-medium text-[hsl(var(--foreground))] mb-2">No tasks yet</h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-6 max-w-md mx-auto">Add your first plant and create care tasks to get started</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setShowAddModal(true)} className="rounded-full px-6 py-2.5 font-medium transition hover:-translate-y-0.5 hover:shadow-md bg-emerald-600 text-white hover:bg-emerald-700 dark:hover:bg-emerald-500">
                <Plus className="w-5 h-5 inline mr-2" />Add Task
              </button>
              <a href="/find-plant" className="rounded-full px-6 py-2.5 font-medium transition hover:-translate-y-0.5 hover:shadow-md border border-emerald-200/50 dark:border-emerald-900/50 bg-transparent hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-[hsl(var(--foreground))]">
                Add a Plant
              </a>
            </div>
          </div>
        )}

        {/* Weather-Based Tips */}
        {tasks.length > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl backdrop-blur border border-blue-200/30 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-1">
                <div className="text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/></svg>
                </div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">Temperature</p>
              </div>
              <p className="text-2xl font-semibold text-blue-900 dark:text-blue-200">{weather?.temperature ? `${weather.temperature.toFixed(1)}°C` : '27°C'}</p>
            </div>
            <div className="rounded-xl backdrop-blur border border-emerald-200/30 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-1">
                <div className="text-emerald-600 dark:text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2c0 0-6 7-6 11c0 3.314 2.686 6 6 6s6-2.686 6-6c0-4-6-11-6-11z" opacity="0.6"/></svg>
                </div>
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Humidity</p>
              </div>
              <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-200">{weather?.humidity ? `${weather.humidity}%` : '83%'}</p>
            </div>
            <div className="rounded-xl backdrop-blur border border-amber-200/30 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/20 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-1">
                <div className="text-amber-600 dark:text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/></svg>
                </div>
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wide">Care Tip</p>
              </div>
              <p className="text-lg font-semibold text-amber-900 dark:text-amber-200">{weather?.temperature && weather.temperature > 25 ? '💧 Extra water' : '✓ Normal'}</p>
            </div>
          </div>
        )}

        {/* Task Filters - Minimal Design */}
        {tasks.length > 0 && (
          <div className="mb-8 flex flex-col sm:flex-row gap-3 flex-wrap items-start sm:items-center">
            <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
              <Filter className="w-5 h-5" />
              <span className="font-medium text-sm">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
                className={`rounded-full px-4 py-2 text-sm transition ${inputClasses.base}`}
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as '' | CareTask['type'])}
                className={`rounded-full px-4 py-2 text-sm transition ${inputClasses.base}`}
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
                className={`rounded-full px-4 py-2 text-sm transition ${inputClasses.base}`}
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="relative w-full sm:w-auto sm:ml-auto">
              <Search className="w-5 h-5 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 rounded-full py-2 text-sm transition ${inputClasses.base}`}
              />
            </div>
          </div>
        )}

        {/* Task List - Minimal Cards */}
        {tasks.length > 0 && (
          <div className="space-y-3 mb-12">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => {
                const dueStatus = getDueStatus(task.dueDate);
                return (
                  <div key={task.id} className="group rounded-xl backdrop-blur border border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 dark:bg-[hsl(var(--card))]/30 p-4 sm:p-5 hover:shadow-md hover:border-emerald-300/50 dark:hover:border-emerald-900/50 transition-all">
                    <div className="flex items-start gap-4 sm:gap-6">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mt-0.5 ${
                          task.completed
                            ? 'bg-emerald-600 dark:bg-emerald-600 border-emerald-600 text-white'
                            : 'border-[hsl(var(--border))] hover:border-emerald-600 dark:hover:border-emerald-500'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5" />}
                      </button>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <div className="text-[hsl(var(--foreground))] w-5 h-5 flex-shrink-0">
                            {getTaskIcon(task.type)}
                          </div>
                          <h3 className={`font-medium text-[hsl(var(--foreground))] transition ${task.completed ? 'line-through text-[hsl(var(--muted-foreground))]' : ''}`}>
                            {task.plantName}
                          </h3>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.notes && <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">{task.notes}</p>}
                        <div className="flex items-center gap-3 flex-wrap text-xs text-[hsl(var(--muted-foreground))]">
                          <span className="capitalize">{task.type}</span>
                          <span className="w-1 h-1 rounded-full bg-[hsl(var(--muted-foreground))]/30"></span>
                          <span className={dueStatus.color}>{dueStatus.status}</span>
                          {task.frequency && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-[hsl(var(--muted-foreground))]/30"></span>
                              <span className="capitalize">{task.frequency}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      {!task.completed && (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 dark:hover:bg-emerald-500 transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--muted-foreground))]" />
                <p className="text-[hsl(var(--muted-foreground))] font-medium">No tasks match your filters</p>
              </div>
            )}
          </div>
        )}

        {/* Today's Section */}
        {tasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-[hsl(var(--foreground))] mb-4">Today</h2>
            <TodaysTasks
              tasks={tasks}
              onComplete={async (id) => handleCompleteTask(id)}
              onBulkComplete={async (ids) => {
                try {
                  await apiClient.post('/api/v1/care-tasks/bulk-complete', { ids });
                } finally {
                  setTasks(prev => prev.map(t => ids.includes(t.id) ? { ...t, completed: true } : t));
                }
              }}
              onSnooze={async (id, days = 1) => {
                const res = await apiClient.patch(`/api/v1/care-tasks/${id}/snooze`, { days });
                setTasks(prev => prev.map(t => t.id === id ? { ...t, dueDate: res.data.dueDate } : t));
              }}
            />
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
            <div className="rounded-2xl bg-[hsl(var(--card))] w-full max-w-lg shadow-2xl border border-[hsl(var(--border))]">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-medium text-[hsl(var(--foreground))]">Add Care Task</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition text-2xl leading-none">✕</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="plantName" className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Plant name</label>
                    <input
                      id="plantName"
                      value={newTask.plantName}
                      onChange={(e) => setNewTask({ ...newTask, plantName: e.target.value })}
                      className={`rounded-lg px-4 py-2.5 ${inputClasses.base}`}
                      placeholder="e.g., Aloe Vera"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="taskType" className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Type</label>
                      <select
                        id="taskType"
                        value={newTask.type}
                        onChange={(e) => setNewTask({ ...newTask, type: e.target.value as CareTask['type'] })}
                        className={`rounded-lg px-4 py-2.5 ${inputClasses.base}`}
                      >
                        <option value="watering">Watering</option>
                        <option value="fertilizing">Fertilizing</option>
                        <option value="pruning">Pruning</option>
                        <option value="repotting">Repotting</option>
                        <option value="pest-control">Pest control</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="taskFrequency" className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Frequency</label>
                      <select
                        id="taskFrequency"
                        value={newTask.frequency}
                        onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value as CareTask['frequency'] })}
                        className={`rounded-lg px-4 py-2.5 ${inputClasses.base}`}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="dueDate" className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Due date</label>
                      <input
                        id="dueDate"
                        type="datetime-local"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className={`rounded-lg px-4 py-2.5 ${inputClasses.base}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="priority" className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Priority</label>
                      <select
                        id="priority"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as CareTask['priority'] })}
                        className={`rounded-lg px-4 py-2.5 ${inputClasses.base}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="notes" className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Notes</label>
                    <textarea
                      id="notes"
                      value={newTask.notes}
                      onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                      rows={3}
                      className={`rounded-lg px-4 py-2.5 resize-none ${inputClasses.base}`}
                      placeholder="Optional notes"
                    />
                  </div>
                  <div className="mt-4 flex gap-3 justify-end">
                    <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 rounded-lg font-medium transition border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]">Cancel</button>
                    <button onClick={handleAddTask} className="px-6 py-2.5 rounded-lg font-medium transition text-white bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 hover:-translate-y-0.5 hover:shadow-md">Add Task</button>
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
