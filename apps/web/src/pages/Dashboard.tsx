import React from "react";
import Sidebar from "../components/Sidebar";
import { Leaf, CalendarCheck, Sprout, Award, LogOut, CheckCircle, Sun, Droplet, BarChart3, LineChart } from "lucide-react";

const user = {
  name: "Vansh",
  avatarUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  badge: "Plant Guru",
};

const stats = [
  {
    label: "Total Plants",
    value: 7,
    icon: <Leaf className="w-6 h-6" />,
    desc: "Your growing collection",
  },
  {
    label: "Tasks Completed",
    value: 42,
    icon: <CalendarCheck className="w-6 h-6" />,
    desc: "Great job caring!",
  },
  {
    label: "Species Collected",
    value: 4,
    icon: <Sprout className="w-6 h-6" />,
    desc: "Diverse plant parent",
  },
  {
    label: "Current Streak",
    value: "5 days",
    icon: <img src='/streak-flame.svg' alt='streak' className='w-6 h-6 inline' />,
    desc: "Keep it going!",
  },
];

const myPlants = [
  { name: "Fiddle Leaf Fig", img: "/plant1.png", health: "Good" },
  { name: "Snake Plant", img: "/plant2.png", health: "Excellent" },
  { name: "Peace Lily", img: "/plant3.png", health: "Fair" },
  { name: "Aloe Vera", img: "/plant4.png", health: "Excellent" },
  { name: "Spider Plant", img: "/plant5.png", health: "Good" },
];

const todaysTasks = [
  { task: "Water Fiddle Leaf Fig", due: "Today", done: true, plantImg: "/plant1.png" },
  { task: "Fertilize Snake Plant", due: "Today", done: false, plantImg: "/plant2.png" },
  { task: "Prune Peace Lily", due: "Today", done: false, plantImg: "/plant3.png" },
];

const recentActivity = [
  { plant: "Fiddle Leaf Fig", action: "Watered", time: "2h ago", img: "/plant1.png", color: "bg-green-200 text-green-800" },
  { plant: "Snake Plant", action: "Fertilized", time: "4h ago", img: "/plant2.png", color: "bg-blue-100 text-blue-800" },
  { plant: "Peace Lily", action: "Pruned", time: "1d ago", img: "/plant3.png", color: "bg-yellow-100 text-yellow-800" },
];

const weather = {
  temperature: "27°C",
  humidity: "65%",
  tip: "It's warm and humid today. Hold off on watering unless soil is dry!",
};

const healthColors = {
  Excellent: "bg-green-200 text-green-800",
  Good: "bg-blue-100 text-blue-800",
  Fair: "bg-yellow-100 text-yellow-800",
  Poor: "bg-orange-100 text-orange-800",
  Critical: "bg-red-200 text-red-800",
};

const Dashboard = () => {
  // Calculate progress for tasks
  const completed = todaysTasks.filter(t => t.done).length;
  const total = todaysTasks.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen w-full flex bg-[#f7faf7] text-[#22313f]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0">
        <Sidebar />
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-0 py-10 space-y-10 bg-[#f7faf7]">
        {/* Compact Profile Bar */}
        <div className="w-full max-w-4xl mx-auto flex items-center gap-4 mb-6">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-green-400 object-cover"
          />
          <div className="flex flex-col justify-center">
            <span className="font-bold text-lg text-green-700">{user.name}</span>
            <span className="flex items-center gap-1 text-xs text-green-600 font-semibold mt-1">
              <Award className="w-4 h-4 text-green-400" /> {user.badge}
            </span>
          </div>
          <button className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-green-700 border border-green-300 hover:bg-green-50 hover:text-green-900 transition text-sm font-semibold shadow-sm">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
        {/* My Plants Carousel */}
        <section className="w-full max-w-4xl mx-auto mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-6 h-6 text-green-500" />
            <span className="text-lg font-bold text-green-700">My Plants</span>
          </div>
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-6 pb-2">
              {myPlants.map((plant, i) => (
                <div
                  key={i}
                  className="min-w-[160px] bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
                >
                  <img
                    src={plant.img}
                    alt={plant.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-green-300 mb-2"
                  />
                  <div className="font-bold text-[#22313f] text-center mb-1 truncate w-full">{plant.name}</div>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold shadow-sm ${healthColors[plant.health]}`}>{plant.health}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Stats Row (full width) */}
        <section className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="mb-2 text-green-500">{stat.icon}</div>
              <div className="text-2xl font-bold text-green-700">{stat.value}</div>
              <div className="text-sm text-green-600 mt-1">{stat.label}</div>
              <div className="text-xs text-gray-400 mt-2 text-center">{stat.desc}</div>
            </div>
          ))}
        </section>
        {/* 2-Column: Left (Today's Tasks + Recent Activity), Right (Weather Tips) */}
        <section className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            {/* Today's Tasks */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 min-h-[260px] relative overflow-hidden hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-4">
                <CalendarCheck className="w-6 h-6 text-green-500" />
                <span className="text-xl font-bold text-green-700">Today's Tasks</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-green-100 rounded-full mb-6">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-green-400 to-green-600 transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <ul className="mt-2 space-y-4">
                {todaysTasks.map((t, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-green-500" />
                    </span>
                    <span className={`text-[#22313f] text-base ${t.done ? 'line-through opacity-60' : ''}`}>{t.task}</span>
                    {t.done ? (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    ) : (
                      <span className="ml-auto text-xs text-green-600">{t.due}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
              <div className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                <Sprout className="w-6 h-6 text-green-500" /> Recent Activity
              </div>
              <ul className="space-y-4">
                {recentActivity.map((a, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <img src={a.img} alt={a.plant} className="w-8 h-8 rounded-full border-2 border-green-200 object-cover" />
                    <span className="font-medium text-[#22313f]">{a.plant}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${a.color}`}>{a.action}</span>
                    <span className="text-xs text-gray-400 ml-auto">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-8">
            {/* Weather Tips */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 flex flex-col items-center hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-bold text-green-700">Weather Tips</span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-2xl font-bold text-green-700 flex items-center gap-1">
                  <Sun className="w-5 h-5 inline text-yellow-400" /> {weather.temperature}
                </span>
                <span className="text-2xl font-bold text-blue-700 flex items-center gap-1">
                  <Droplet className="w-5 h-5 inline text-blue-400" /> {weather.humidity}
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-2">Today's temperature & humidity</div>
              <div className="px-3 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold text-center">
                {weather.tip}
              </div>
            </div>
          </div>
        </section>
        {/* Charts Section (full width) */}
        <section className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Care Completion Rate Chart Placeholder */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 flex flex-col items-center justify-center min-h-[220px] hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-6 h-6 text-green-500" />
              <span className="text-xl font-bold text-green-700">Care Completion Rate</span>
            </div>
            <div className="w-full h-32 flex items-center justify-center text-green-400 text-2xl font-bold">[Bar Chart]</div>
            <div className="text-xs text-gray-400 mt-2">% of completed care tasks over the last 30 days</div>
          </div>
          {/* Plant Health Trend Chart Placeholder */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 flex flex-col items-center justify-center min-h-[220px] hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <LineChart className="w-6 h-6 text-green-500" />
              <span className="text-xl font-bold text-green-700">Plant Health Trend</span>
            </div>
            <div className="w-full h-32 flex items-center justify-center text-green-400 text-2xl font-bold">[Line Chart]</div>
            <div className="text-xs text-gray-400 mt-2">Healthy vs. needs attention plants over time</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
