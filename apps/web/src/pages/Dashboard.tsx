import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  LayoutDashboard, 
  Leaf, 
  CalendarCheck2, 
  ScanLine, 
  Users, 
  Bell, 
  Settings, 
  Menu, 
  Search, 
  Sun, 
  MapPin, 
  Plus, 
  Droplets, 
  Check, 
  Flame, 
  Sparkles, 
  CloudRain, 
  Wind,
  Droplet,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import apiClient from '../lib/axios';
import { useWeather } from '../hooks/useWeather';

// Register Chart.js components
Chart.register(...registerables);

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'today' | 'later' | 'evening';
  completed: boolean;
}

interface Plant {
  id: string;
  name: string;
  image: string;
  status: 'healthy' | 'thriving' | 'drying' | 'thirsty' | 'stable';
  waterIn: string;
  light: string;
}

interface CommunityPost {
  id: string;
  userAvatar: string;
  content: string;
  likes: number;
  comments: number;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Water Monstera',
      description: 'Check soil moisture first',
      priority: 'today',
      completed: false
    },
    {
      id: '2',
      title: 'Mist Ferns',
      description: 'Boost humidity',
      priority: 'later',
      completed: false
    },
    {
      id: '3',
      title: 'Rotate Snake Plant',
      description: 'Encourage even growth',
      priority: 'evening',
      completed: false
    }
  ]);

  const [plants, setPlants] = useState<Plant[]>([
    {
      id: '1',
      name: 'Monstera',
      image: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80',
      status: 'healthy',
      waterIn: 'Water in 2 days',
      light: 'Bright, indirect'
    },
    {
      id: '2',
      name: 'Snake Plant',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=900&auto=format&fit=crop',
      status: 'drying',
      waterIn: 'Water in 5 days',
      light: 'Low–medium light'
    },
    {
      id: '3',
      name: 'Fiddle Leaf Fig',
      image: 'https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80',
      status: 'thriving',
      waterIn: 'Water tomorrow',
      light: 'Bright light'
    },
    {
      id: '4',
      name: 'Pothos',
      image: 'https://images.unsplash.com/photo-1635151227785-429f420c6b9d?w=1080&q=80',
      status: 'healthy',
      waterIn: 'Water in 3 days',
      light: 'Medium light'
    },
    {
      id: '5',
      name: 'Boston Fern',
      image: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80',
      status: 'thirsty',
      waterIn: 'Mist today',
      light: 'Low–medium light'
    },
    {
      id: '6',
      name: 'ZZ Plant',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900&auto=format&fit=crop',
      status: 'stable',
      waterIn: 'Water in 10 days',
      light: 'Low light'
    }
  ]);

  const [communityPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      content: 'New leaf unfurled! Monstera is loving the brighter spot.',
      likes: 128,
      comments: 18
    },
    {
      id: '2',
      userAvatar: 'https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80',
      content: 'Tip: Bottom watering saved my ferns during heatwaves.',
      likes: 64,
      comments: 9
    }
  ]);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { weather } = useWeather();

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'today':
        return 'bg-emerald-50 text-emerald-700';
      case 'later':
      case 'evening':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'thriving':
      case 'stable':
        return 'text-emerald-700 border-emerald-200';
      case 'drying':
      case 'thirsty':
        return 'text-amber-700 border-amber-200';
      default:
        return 'text-emerald-700 border-emerald-200';
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
            datasets: [{
              label: 'Moisture',
              data: [64, 58, 55, 62, 68, 60, 63],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,0.15)',
              fill: true,
              tension: 0.35,
              pointRadius: 3,
              pointBackgroundColor: '#10b981',
              pointBorderWidth: 0
            }]
          },
          options: {
            plugins: { 
              legend: { display: false }, 
              tooltip: { mode: 'index', intersect: false } 
            },
            scales: {
              y: {
                grid: { color: 'rgba(148,163,184,0.2)' },
                ticks: { callback: (v: any) => v + '%' },
                suggestedMin: 40,
                suggestedMax: 80
              },
              x: { grid: { display: false } }
            },
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/40 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-slate-200/60">
        <div className="flex items-center gap-3 px-4 md:px-6 h-16">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative flex-1 max-w-2xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              aria-label="Search" 
              placeholder="Search plants, tasks, or tips"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-200/80 focus:border-emerald-300 outline-none text-sm" 
            />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white">
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">{weather?.temperature || '72°F'}</span>
              <span className="text-xs text-slate-500">Humid</span>
              <span className="text-slate-300">•</span>
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">Seattle</span>
            </div>
            <button className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center shadow">3</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* Greeting + Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl tracking-tight font-semibold text-slate-900">Good morning, Aisha</h1>
            <p className="text-slate-600 mt-1">Here's a gentle plan for your plants today.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition">
              <Plus className="w-4 h-4" />
              Add plant
            </button>
            <button className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50">
              <ScanLine className="w-4 h-4" />
              Identify plant
            </button>
            <button className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50">
              <Droplets className="w-4 h-4" />
              Log care
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Today's Snapshot */}
          <div className="xl:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl tracking-tight font-semibold">Today's Snapshot</h2>
                  <p className="text-sm text-slate-600">Keep your routine light and steady.</p>
                </div>
                {/* Progress Ring */}
                <div className="relative h-16 w-16">
                  <div 
                    className="h-16 w-16 rounded-full"
                    style={{
                      background: `conic-gradient(#10b981 0% ${completionPercentage}%, #e6f7ef ${completionPercentage}% 100%)`
                    }}
                  />
                  <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-emerald-700">{completionPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              <ul className="mt-4 space-y-2">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300/60 transition">
                    <button 
                      className={`h-5 w-5 rounded-md border border-slate-300 flex items-center justify-center shrink-0 bg-white ${
                        task.completed ? 'bg-emerald-50 border-emerald-300' : ''
                      }`}
                      onClick={() => toggleTask(task.id)}
                      aria-label="Toggle task"
                    >
                      {task.completed && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500">{task.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'today' ? 'Today' : task.priority === 'later' ? 'Later' : 'This evening'}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700 text-sm">
                  <Flame className="w-4 h-4" />
                  <span>Care streak: <span className="font-medium">7 days</span></span>
                </div>
                <button className="text-sm font-medium text-emerald-700 hover:text-emerald-800">View schedule</button>
              </div>
            </div>

            {/* Smart Insight */}
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-tr from-emerald-50 to-white p-5">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-600/90 text-white flex items-center justify-center shadow">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg tracking-tight font-semibold">Smart Insight</h3>
                  <p className="text-sm text-slate-700">Higher humidity today. Water a little less for tropicals; mist instead to avoid soggy roots.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-700">
                      <CloudRain className="w-3.5 h-3.5" /> 84% humidity
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-700">
                      <Wind className="w-3.5 h-3.5" /> Low airflow
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Collection Preview */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl tracking-tight font-semibold">Your Collection</h2>
              <button className="text-sm font-medium text-emerald-700 hover:text-emerald-800">See all plants</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {plants.map((plant) => (
                <div key={plant.id} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition">
                  <div className="relative">
                    <img src={plant.image} alt={plant.name} className="h-40 w-full object-cover" />
                    <div className={`absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 text-xs border ${getStatusColor(plant.status)}`}>
                      {plant.status.charAt(0).toUpperCase() + plant.status.slice(1)}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{plant.name}</p>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Sun className="w-4 h-4" />
                        <Droplet className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">{plant.waterIn}</span>
                      <span className="text-xs text-slate-500">{plant.light}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Insights + Community */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Moisture Trend (Chart.js) */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg tracking-tight font-semibold">Soil Moisture — Monstera</h3>
                    <p className="text-sm text-slate-600">Last 7 days</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">
                    <Droplet className="w-3.5 h-3.5" /> Optimal
                  </span>
                </div>
                <div className="mt-3">
                  <div className="h-44">
                    <canvas ref={chartRef} className="w-full h-full" />
                  </div>
                </div>
              </div>

              {/* Community Peek */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg tracking-tight font-semibold">Community Peek</h3>
                  <button className="text-sm text-emerald-700 hover:text-emerald-800">Open</button>
                </div>
                <div className="mt-3 space-y-3">
                  {communityPosts.map((post) => (
                    <article key={post.id} className="flex gap-3">
                      <img src={post.userAvatar} alt="User post photo" className="h-10 w-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="text-sm">{post.content}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />{post.likes}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />{post.comments}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl bg-gradient-to-tr from-emerald-50 to-white border border-emerald-100">
                  <div className="flex items-start gap-2">
                    <Share2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <p className="text-sm text-slate-700">Share a photo of your happiest plant today.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
