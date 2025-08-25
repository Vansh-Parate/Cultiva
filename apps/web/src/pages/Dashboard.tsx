import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  Sprout,
  Plus,
  Camera,
  Droplet,
  Scan,
  CloudRain,
  CalendarDays,
  Activity,
  AlertTriangle,
  Heart,
  MessageCircle,
  Share2,
  
  Sun,
  ThermometerSun,
  Droplets,
  ChevronRight,
  Users
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import apiClient from '../lib/axios';
import CustomToast from '../components/CustomToast';
import { useWeather } from '../hooks/useWeather';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type CareTask = {
  id: string;
  plantName: string;
  type: string;
  frequency: string;
  dueDate: string;
  notes?: string | null;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
};

type PlantItem = {
  id: string;
  name: string;
  species?: { commonName?: string } | null;
  images?: { imageUrl: string; isPrimary: boolean }[];
  location?: string | null;
};

type CommunityPost = {
  id: string;
  title?: string | null;
  content?: string | null;
  imageUrls?: string[];
  createdAt: string;
  user?: { username?: string; avatarUrl?: string } | null;
  likes?: unknown[];
  comments?: unknown[];
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [plants, setPlants] = useState<PlantItem[]>([]);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(2);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });

  const { weather, loading: weatherLoading } = useWeather();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setTasksLoading(true);
        const res = await apiClient.get('/api/v1/care-tasks');
        if (mounted) setTasks(res.data || []);
      } catch {
        if (mounted) setTasks([]);
      } finally {
        if (mounted) setTasksLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setPlantsLoading(true);
        const res = await apiClient.get('/api/v1/plants');
        if (mounted) setPlants(res.data || []);
      } catch {
        if (mounted) setPlants([]);
      } finally {
        if (mounted) setPlantsLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setPostsLoading(true);
        const res = await apiClient.get('/api/v1/community/posts');
        if (mounted) setPosts(res.data || []);
      } catch {
        if (mounted) setPosts([]);
      } finally {
        if (mounted) setPostsLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    try {
      if (!task.completed) {
        await apiClient.patch(`/api/v1/care-tasks/${taskId}/complete`);
        setToast({ show: true, title: 'Task completed', message: `${task.plantName}: ${task.type} logged` });
        setTimeout(() => setToast({ show: false, title: '', message: '' }), 2000);
      }
    } catch {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: task.completed } : t));
    }
  };

  const getStatusColor = (dueDate: string, completed: boolean) => {
    if (completed) return 'bg-slate-800 text-slate-300 ring-slate-700/60';
    const due = new Date(dueDate).getTime();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (due < now - oneDay) return 'bg-rose-500/10 text-rose-300 ring-rose-400/20';
    if (due <= now + oneDay) return 'bg-teal-700/20 text-teal-200 ring-teal-700/40';
    return 'bg-amber-500/10 text-amber-300 ring-amber-400/20';
  };

  const handleLogWatering = () => {
    // Navigate to care page with watering mode
    navigate('/care?action=watering');
  };

  const handleQuickIdentify = () => {
    // Navigate to find plant page
    navigate('/find-plant');
  };

  const handleAddPlant = () => {
    // Navigate to plants page with add mode
    navigate('/plants?action=add');
  };

  const handleViewSchedule = () => {
    // Navigate to care page with schedule view
    navigate('/care?view=schedule');
  };

  const handlePlantClick = (plantName: string) => {
    // Navigate to specific plant detail
    navigate(`/plants?plant=${plantName.toLowerCase()}`);
  };

  const handleCommunityPost = () => {
    // Navigate to community page
    navigate('/community');
  };

  const handleScanPlant = () => {
    // Navigate to find plant page with camera mode
    navigate('/find-plant?mode=camera');
  };

  const handleUploadPlant = () => {
    // Navigate to find plant page with upload mode
    navigate('/find-plant?mode=upload');
  };

  const handleLogCare = () => {
    // Navigate to care page
    navigate('/care');
  };

  const handleAskCommunity = () => {
    // Navigate to community page with post mode
    navigate('/community?action=post');
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
    datasets: [
      {
        label: 'Monstera',
        data: [62, 60, 58, 70, 68, 66, 65, 64, 63, 61, 72, 70, 69, 68],
        tension: 0.36,
        borderColor: 'rgba(45, 212, 191, 1)',
        backgroundColor: 'rgba(45, 212, 191, 0.12)',
        fill: true,
        pointRadius: 0,
        borderWidth: 2
      },
      {
        label: 'Pothos',
        data: [55, 54, 53, 60, 59, 58, 57, 56, 55, 54, 61, 60, 59, 58],
        tension: 0.36,
        borderColor: 'rgba(56, 189, 248, 1)',
        backgroundColor: 'rgba(56, 189, 248, 0.10)',
        fill: true,
        pointRadius: 0,
        borderWidth: 2
      },
      {
        label: 'Calathea',
        data: [68, 67, 66, 64, 63, 62, 61, 59, 58, 57, 55, 54, 53, 52],
        tension: 0.36,
        borderColor: 'rgba(244, 114, 182, 1)',
        backgroundColor: 'rgba(244, 114, 182, 0.10)',
        fill: true,
        pointRadius: 0,
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(30, 41, 59, 1)', drawBorder: false },
        ticks: { color: 'rgba(148, 163, 184, 1)', font: { size: 10 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(30, 41, 59, 1)', drawBorder: false },
        ticks: { color: 'rgba(148, 163, 184, 1)', font: { size: 10 }, callback: (v: number) => v + '%' }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(226, 232, 240, 1)',
          usePointStyle: true,
          boxWidth: 6,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(2, 6, 23, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(51,65,85,0.6)',
        borderWidth: 1,
        callbacks: { label: (tooltipItem: { dataset?: { label?: string }; formattedValue: string }) => `${tooltipItem.dataset?.label ?? 'Plant'}: ${tooltipItem.formattedValue}%` }
      }
    },
    elements: { line: { borderJoinStyle: 'round' as const } }
  };

  const visiblePlants = useMemo(() => {
    if (!searchQuery) return plants;
    const q = searchQuery.toLowerCase();
    return plants.filter(p => p.name.toLowerCase().includes(q) || (p.species?.commonName || '').toLowerCase().includes(q));
  }, [plants, searchQuery]);

  return (
    <div className="bg-slate-950 text-slate-100 antialiased selection:bg-teal-400/30 selection:text-teal-50 min-h-screen">
      <CustomToast show={toast.show} title={toast.title} message={toast.message} />
      {/* Decorative Background Glows */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal-800/25 blur-3xl"></div>
        <div className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-cyan-700/20 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-teal-700/20 blur-3xl"></div>
      </div>

      {/* Layout */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 pt-4">
          <div className="flex items-center justify-between rounded-full border border-teal-500/15 bg-slate-900/60 px-3 py-2 backdrop-blur">
            <div className="flex items-center gap-2">
              <button 
                className="inline-flex md:hidden items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/70 p-2 text-slate-300 hover:text-teal-300 transition"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm ring-1 ring-teal-500/30">
                  <span className="text-sm font-semibold tracking-tight">CV</span>
                </div>
                <span className="text-sm font-medium tracking-tight text-teal-100">Cultiva</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900 px-3 py-1.5">
                <Search className="h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search plants, tips, tasks…" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => navigate('/notifications')}
                className="relative inline-flex items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/70 p-2 text-slate-300 hover:text-teal-300 transition cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-medium text-teal-50 ring-1 ring-teal-300/40">{notifications}</span>
              </button>
              <button 
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-slate-100 hover:border-slate-600 transition cursor-pointer"
              >
                <img className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-800" src="https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=80&auto=format&fit=crop" alt="Profile" />
                <span className="hidden sm:block">Alex</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mt-4">
          {/* Page intro */}
          <div className="rounded-2xl border border-teal-500/15 bg-slate-900/60 p-4 sm:p-6 backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl tracking-tight text-teal-50 font-medium">Good morning, Alex</h1>
                <p className="mt-1 text-sm text-slate-300">Here's what needs your care today.</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleLogWatering}
                  className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-teal-500/30 transition hover:bg-teal-500 cursor-pointer"
                >
                  <Droplet className="h-4 w-4" />
                  Log watering
                </button>
                <button 
                  onClick={handleQuickIdentify}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 hover:border-slate-600 transition cursor-pointer"
                >
                  <Scan className="h-4 w-4" />
                  Quick Identify
                </button>
              </div>
            </div>
          </div>

          {/* Widgets Grid */}
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {/* Col 1 */}
            <div className="space-y-4">
              {/* Today's Tasks */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-tight text-teal-100">Today's care</h2>
                  <button 
                    onClick={handleViewSchedule}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-900 px-3 py-1 text-xs text-slate-100 hover:border-slate-600"
                  >
                    <CalendarDays className="h-4 w-4" />
                    View schedule
                  </button>
                </div>
                <ul className="mt-3 space-y-2">
                  {tasksLoading && (
                    <>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <li key={i} className="flex items-center justify-between rounded-xl border border-slate-800 p-3 bg-slate-900/60 animate-pulse">
                          <div className="flex items-center gap-3">
                            <div className="h-5 w-5 rounded-md ring-1 ring-slate-600/50 bg-slate-800" />
                            <div>
                              <div className="h-3 w-40 bg-slate-800 rounded" />
                              <div className="h-2 w-24 bg-slate-800 rounded mt-1" />
                            </div>
                          </div>
                          <div className="h-4 w-16 bg-slate-800 rounded-full" />
                        </li>
                      ))}
                    </>
                  )}
                  {!tasksLoading && tasks.map((task) => (
                    <li key={task.id} className={`flex items-center justify-between rounded-xl border border-slate-800 p-3 transition-all duration-200 ${
                      task.completed 
                        ? 'bg-teal-900/20 opacity-60 grayscale' 
                        : 'bg-slate-900/60'
                    }`}>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleTask(task.id)}
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-md ring-1 transition-all duration-200 ${
                            task.completed 
                              ? 'ring-teal-600/50 bg-teal-950/50' 
                              : 'ring-slate-600/50 bg-teal-950/30'
                          }`}
                        >
                          <div className={`h-3.5 w-3.5 ${task.completed ? 'text-teal-300' : 'text-transparent'}`}>
                            ✓
                          </div>
                        </button>
                        <div>
                          <p className="text-sm font-medium text-teal-100">{task.type} · {task.plantName}</p>
                          <p className="text-xs text-slate-400">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] ring-1 ${getStatusColor(task.dueDate, task.completed)}`}>
                        {task.completed ? 'Done' : 'Due'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weather */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-tight text-teal-100">Local weather</h2>
                  <div className="text-xs text-slate-400">{weather.name || '—'}</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-900/30 ring-1 ring-teal-700/40">
                      <CloudRain className="h-5 w-5 text-teal-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-teal-100">{weatherLoading ? '—' : `${Math.round((weather.temperature ?? 0))}°C`} · Local weather</p>
                      <p className="text-xs text-slate-400">Humidity {weatherLoading ? '—' : `${weather.humidity ?? '—'}%`}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-teal-700/20 px-2.5 py-1 text-[11px] text-teal-200 ring-1 ring-teal-700/40">Water less</span>
                </div>
                <div className="mt-3 grid grid-cols-5 gap-2 text-center">
                  {['Now', '12p', '3p', '6p', '9p'].map((time, index) => (
                    <div key={time} className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
                      <p className="text-[11px] text-slate-400">{time}</p>
                      <p className="text-sm text-teal-100">{weatherLoading ? '—' : `${Math.round((weather.temperature ?? 0) + index)}°`}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Calendar */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-tight text-teal-100">Care calendar</h2>
                  <div className="inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-900 px-3 py-1 text-xs text-slate-200">
                    <CalendarDays className="h-4 w-4" />
                    June 2025
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }, (_, i) => (
                    <div key={i} className={`h-12 rounded-lg border border-slate-800 ${
                      i === 6 ? 'bg-teal-900/20 ring-1 ring-teal-700/30' : 'bg-slate-900/40'
                    }`}>
                      {i === 6 && (
                        <span className="absolute right-1 top-1 inline-flex h-1.5 w-1.5 rounded-full bg-teal-400 ring-2 ring-slate-900"></span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-3 text-[11px]">
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400"></span> Water
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300"></span> Fertilize
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-300"></span> Repot
                  </span>
                </div>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-4">
              {/* Plant Collection Overview */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-tight text-teal-100">My collection</h2>
                  <button 
                    onClick={handleAddPlant}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-900 px-3 py-1 text-xs text-slate-100 hover:border-slate-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plantsLoading && (
                    <>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 animate-pulse">
                          <div className="overflow-hidden rounded-lg ring-1 ring-slate-800 h-32 bg-slate-800" />
                          <div className="mt-2 flex items-center justify-between">
                            <div>
                              <div className="h-3 w-24 bg-slate-800 rounded" />
                              <div className="h-2 w-36 bg-slate-800 rounded mt-1" />
                            </div>
                            <div className="h-4 w-12 bg-slate-800 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {!plantsLoading && visiblePlants.map((plant) => {
                    const primaryImage = plant.images?.find(i => i.isPrimary)?.imageUrl || plant.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=800&q=80';
                    const status: 'healthy' | 'warning' | 'alert' = 'healthy';
                    const healthLabel = 'OK';
                    return (
                      <div 
                        key={plant.id} 
                        onClick={() => handlePlantClick(plant.name)}
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 cursor-pointer hover:border-teal-600/30 transition-colors hover:shadow-[0_0_0_1px_rgba(45,212,191,0.15)] active:scale-[0.99] cursor-pointer"
                      >
                        <div className="overflow-hidden rounded-lg ring-1 ring-slate-800">
                          <img loading="lazy" src={primaryImage} className="h-32 w-full object-cover transition-transform duration-300 hover:scale-105" alt={plant.name} />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-teal-100">{plant.name}</p>
                            <p className="text-xs text-slate-400">{plant.species?.commonName || '—'}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ring-1 ${
                            status === 'healthy' 
                              ? 'bg-teal-700/20 text-teal-200 ring-teal-700/40'
                              : status === 'warning'
                              ? 'bg-amber-500/10 text-amber-300 ring-amber-400/20'
                              : 'bg-rose-500/10 text-rose-300 ring-rose-400/20'
                          }`}>
                            {status === 'healthy' ? <Activity className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                            {healthLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Health Trends */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-tight text-teal-100">Health trends</h2>
                  <div className="text-xs text-slate-400">Last 14 days</div>
                </div>
                <p className="mt-1 text-sm text-slate-300">Soil moisture · Top 3 plants</p>
                <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/60 p-2">
                  <div className="h-32">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>

            {/* Col 3 */}
            <div className="space-y-4">
              {/* Quick Identify */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-teal-800/30 blur-2xl"></div>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-tight text-teal-100">Quick identify</h2>
                  <span className="rounded-full bg-teal-700/20 px-2 py-0.5 text-[11px] text-teal-200 ring-1 ring-teal-700/40">AI powered</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1635151227785-429f420c6b9d?w=800&q=80',
                    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop'
                  ].map((image, index) => (
                    <div key={index} className="relative h-20 overflow-hidden rounded-xl ring-1 ring-slate-800">
                      <img loading="lazy" src={image} className="h-full w-full object-cover" alt="Plant" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={handleScanPlant}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white ring-1 ring-teal-500/30 transition hover:bg-teal-500 cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    Scan
                  </button>
                  <button 
                    onClick={handleUploadPlant}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:border-slate-600 transition cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Upload
                  </button>
                </div>
              </div>

              {/* Community Feed */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-tight text-teal-100">Community</h2>
                  <button 
                    onClick={handleCommunityPost}
                    className="text-xs text-teal-300 hover:text-teal-200 inline-flex items-center gap-1 cursor-pointer"
                  >
                    View all <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {postsLoading && (
                    <>
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 animate-pulse">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-slate-800" />
                            <div className="flex-1">
                              <div className="h-3 w-24 bg-slate-800 rounded" />
                              <div className="h-2 w-32 bg-slate-800 rounded mt-1" />
                            </div>
                            <div className="h-2 w-8 bg-slate-800 rounded" />
                          </div>
                          <div className="mt-2 rounded-lg ring-1 ring-slate-800 h-28 bg-slate-800" />
                        </div>
                      ))}
                    </>
                  )}
                  {!postsLoading && posts.slice(0, 2).map((post) => (
                    <div key={post.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                      <div className="flex items-center gap-2">
                        <img className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-800" src={post.user?.avatarUrl || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=80&auto=format&fit=crop'} alt="Profile" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-teal-100">{post.user?.username || 'User'}</p>
                          <p className="text-[11px] text-slate-400">{post.title || post.content || ''}</p>
                        </div>
                        <span className="text-[11px] text-slate-400">{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {post.imageUrls && post.imageUrls.length > 0 && (
                        <div className="mt-2 overflow-hidden rounded-lg ring-1 ring-slate-800">
                          <img loading="lazy" src={post.imageUrls[0]} className="h-28 w-full object-cover" alt="Post" />
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-300">
                        <button className="inline-flex items-center gap-1 hover:text-rose-300 transition-colors">
                          <Heart className="h-4 w-4 text-rose-300" /> {(post.likes || []).length}
                        </button>
                        <button className="inline-flex items-center gap-1 hover:text-teal-300 transition-colors">
                          <MessageCircle className="h-4 w-4 text-teal-300" /> {(post.comments || []).length}
                        </button>
                        <button className="inline-flex items-center gap-1 hover:text-slate-200 transition-colors">
                          <Share2 className="h-4 w-4" /> Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Suggestions */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-tight text-teal-100">Smart suggestions</h2>
                  <span className="text-xs text-slate-400">Based on your routine</span>
                </div>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-teal-900/30 ring-1 ring-teal-700/40 flex items-center justify-center">
                        <Sun className="h-4 w-4 text-amber-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-teal-100">Move ZZ closer to light</p>
                        <p className="text-xs text-slate-400">Low light detected last week</p>
                      </div>
                    </div>
                    <button className="rounded-full border border-slate-700/60 bg-slate-900 px-3 py-1 text-xs text-slate-100 hover:border-slate-600">
                      Dismiss
                    </button>
                  </li>
                  <li className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-teal-900/30 ring-1 ring-teal-700/40 flex items-center justify-center">
                        <ThermometerSun className="h-4 w-4 text-rose-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-teal-100">Check balcony temps</p>
                        <p className="text-xs text-slate-400">Night lows near 10°C</p>
                      </div>
                    </div>
                    <button className="rounded-full border border-slate-700/60 bg-slate-900 px-3 py-1 text-xs text-slate-100 hover:border-slate-600">
                      Got it
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Subtle Divider */}
          <div className="my-6 border-t border-slate-800"></div>

          {/* Bottom quick actions */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Sprout, title: 'Add new plant', subtitle: 'Quick create', action: handleAddPlant },
              { icon: Droplets, title: 'Log care', subtitle: 'Water, mist, fertilize', action: handleLogCare },
              { icon: Camera, title: 'Identify plant', subtitle: 'Photo or upload', action: handleQuickIdentify },
              { icon: Users, title: 'Ask community', subtitle: 'Tips & support', action: handleAskCommunity }
            ].map((action, index) => (
              <button 
                key={index} 
                onClick={action.action}
                className="inline-flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:ring-1 hover:ring-teal-600/30 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-900/30 ring-1 ring-teal-700/40 flex items-center justify-center">
                    <action.icon className="h-5 w-5 text-teal-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-100">{action.title}</p>
                    <p className="text-xs text-slate-400">{action.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>

          <footer className="py-8">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} Cultiva. Grow smarter together.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
