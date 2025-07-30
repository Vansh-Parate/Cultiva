import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Leaf, CalendarCheck, Sprout, Award, LogOut, CheckCircle, Sun, Droplet, BarChart3, LineChart, Bell, ArrowRight } from "lucide-react";
import axios from "axios";
import { useWeather } from '~/hooks/useWeather';
import NotificationCenter from "../components/NotificationCenter";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Dynamic user data - will be fetched from backend
  const [user, setUser] = useState({
    name: "User",
  avatarUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    badge: "Plant Enthusiast",
  });

  const [stats, setStats] = useState([
  {
    label: "Total Plants",
    value: 0,
    icon: <Leaf className="w-6 h-6" />,
    desc: "Your growing collection",
  },
  {
    label: "Healthy Plants",
    value: 0,
    icon: <CheckCircle className="w-6 h-6" />,
    desc: "Thriving plants",
  },
  {
    label: "Species Collected",
    value: 0,
    icon: <Sprout className="w-6 h-6" />,
    desc: "Diverse collection",
  },
  {
    label: "This Month",
    value: "0 plants",
    icon: <img src='/streak-flame.svg' alt='streak' className='w-6 h-6 inline' />,
    desc: "New additions",
  },
]);

  const [myPlants, setMyPlants] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

const weather = {
  temperature: "Loading...",
  humidity: "Loading...",
  tip: "Checking weather conditions...",
};

const healthColors = {
  Excellent: "bg-green-200 text-green-800",
  Good: "bg-blue-100 text-blue-800",
  Fair: "bg-yellow-100 text-yellow-800",
  Poor: "bg-orange-100 text-orange-800",
  Critical: "bg-red-200 text-red-800",
    Healthy: "bg-green-200 text-green-800",
    "Needs Attention": "bg-yellow-100 text-yellow-800",
  };

  const { weather: liveWeather, loading: weatherLoading } = useWeather();
  const [userPlants, setUserPlants] = useState([]);
  const [userStats, setUserStats] = useState({
    totalPlants: 0,
    healthyPlants: 0,
    speciesCount: 0,
    monthlyAdditions: 0,
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Fetch user's plants and calculate statistics
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch user's plants
        const plantsRes = await axios.get('/api/v1/plants', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const plants = plantsRes.data;
        setUserPlants(plants);

        // Calculate statistics
        const totalPlants = plants.length;
        const healthyPlants = plants.filter(p => p.healthStatus === 'Good' || p.healthStatus === 'Excellent').length;
        const uniqueSpecies = new Set(plants.map(p => p.species?.commonName)).size;
        const thisMonth = new Date().getMonth();
        const monthlyAdditions = plants.filter(p => {
          const plantDate = new Date(p.createdAt);
          return plantDate.getMonth() === thisMonth;
        }).length;

        setUserStats({
          totalPlants,
          healthyPlants,
          speciesCount: uniqueSpecies,
          monthlyAdditions,
        });

        // Update stats display
        setStats([
          {
            label: "Total Plants",
            value: totalPlants,
            icon: <Leaf className="w-6 h-6" />,
            desc: "Your growing collection",
          },
          {
            label: "Healthy Plants",
            value: healthyPlants,
            icon: <CheckCircle className="w-6 h-6" />,
            desc: "Thriving plants",
          },
          {
            label: "Species Collected",
            value: uniqueSpecies,
            icon: <Sprout className="w-6 h-6" />,
            desc: "Diverse collection",
          },
          {
            label: "This Month",
            value: `${monthlyAdditions} plants`,
            icon: <img src='/streak-flame.svg' alt='streak' className='w-6 h-6 inline' />,
            desc: "New additions",
          },
        ]);

        // Create plant cards for carousel
        const plantCards = plants.slice(0, 5).map(plant => ({
          name: plant.name,
          img: plant.images?.[0]?.url || "/placeholder-plant.png",
          health: plant.healthStatus || "Good",
          id: plant.id,
        }));
        setMyPlants(plantCards);

        // Generate recent activity (simulated for now)
        const activities = plants.slice(0, 3).map(plant => ({
          plant: plant.name,
          action: "Added to collection",
          time: "Recently",
          img: plant.images?.[0]?.url || "/placeholder-plant.png",
          color: "bg-green-200 text-green-800",
        }));
        setRecentActivity(activities);

      } catch (err) {
        console.error('Failed to fetch user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Dynamic weather data
  const weatherDisplay = {
    temperature: weatherLoading ? "Loading..." : liveWeather.temperature ? `${liveWeather.temperature.toFixed(1)}°C` : "N/A",
    humidity: weatherLoading ? "Loading..." : liveWeather.humidity ? `${liveWeather.humidity}%` : "N/A",
    tip: weatherLoading 
      ? "Checking weather conditions..." 
      : liveWeather.temperature && liveWeather.temperature > 25 
        ? "It's warm today! Consider extra watering for your plants."
        : liveWeather.humidity && liveWeather.humidity > 70
          ? "High humidity today. Reduce watering frequency."
          : "Perfect conditions for plant care!",
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex bg-[#f7faf7] text-[#22313f]">
        <aside className="w-64 shrink-0">
          <Sidebar />
        </aside>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-green-700">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

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
          <div className="ml-auto flex items-center gap-2">
            <button 
              className="p-2 rounded-full hover:bg-green-100 relative"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-green-700 border border-green-300 hover:bg-green-50 hover:text-green-900 transition text-sm font-semibold shadow-sm"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/auth/signin';
              }}
            >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
          </div>
        </div>
        
        {/* My Plants Carousel */}
        <section className="w-full max-w-4xl mx-auto mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-6 h-6 text-green-500" />
            <span className="text-lg font-bold text-green-700">My Plants</span>
          </div>
          {myPlants.length > 0 ? (
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-6 pb-2">
              {myPlants.map((plant, i) => (
                <div
                  key={i}
                    className="min-w-[160px] bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1 cursor-pointer"
                    onClick={() => window.location.href = '/plants'}
                >
                  <img
                    src={plant.img}
                    alt={plant.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-green-300 mb-2"
                      onError={e => { e.currentTarget.src = '/placeholder-plant.png'; }}
                  />
                  <div className="font-bold text-[#22313f] text-center mb-1 truncate w-full">{plant.name}</div>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold shadow-sm ${healthColors[plant.health]}`}>{plant.health}</span>
                </div>
              ))}
            </div>
          </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Sprout className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No plants yet. Start by identifying a plant!</p>
              <button 
                onClick={() => window.location.href = '/find-plant'}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Add Your First Plant
              </button>
            </div>
          )}
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
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                <CalendarCheck className="w-6 h-6 text-green-500" />
                  <span className="text-xl font-bold text-green-700">Care Tasks</span>
                </div>
                <Link 
                  to="/care"
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">3</div>
                  <div className="text-xs text-green-600">Pending</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">1</div>
                  <div className="text-xs text-blue-600">Due Today</div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💧</span>
                    <div>
                      <div className="font-medium text-gray-800">Water Peace Lily</div>
                      <div className="text-xs text-gray-600">Due today</div>
                    </div>
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">High</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🌱</span>
                    <div>
                      <div className="font-medium text-gray-800">Fertilize Snake Plant</div>
                      <div className="text-xs text-gray-600">Due in 5 days</div>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Low</span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Link 
                  to="/care"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Manage Care Tasks
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
              <div className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                <Sprout className="w-6 h-6 text-green-500" /> Recent Activity
              </div>
              {recentActivity.length > 0 ? (
              <ul className="space-y-4">
                {recentActivity.map((a, i) => (
                  <li key={i} className="flex items-center gap-3">
                      <img src={a.img} alt={a.plant} className="w-8 h-8 rounded-full border-2 border-green-200 object-cover" onError={e => { e.currentTarget.src = '/placeholder-plant.png'; }} />
                    <span className="font-medium text-[#22313f]">{a.plant}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${a.color}`}>{a.action}</span>
                    <span className="text-xs text-gray-400 ml-auto">{a.time}</span>
                  </li>
                ))}
              </ul>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <p>No recent activity</p>
                </div>
              )}
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
                  <Sun className="w-5 h-5 inline text-yellow-400" /> {weatherDisplay.temperature}
                </span>
                <span className="text-2xl font-bold text-blue-700 flex items-center gap-1">
                  <Droplet className="w-5 h-5 inline text-blue-400" /> {weatherDisplay.humidity}
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-2">Today's temperature & humidity</div>
              <div className="px-3 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold text-center">
                {weatherDisplay.tip}
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
              <span className="text-xl font-bold text-green-700">Plant Health Overview</span>
            </div>
            <div className="w-full h-32 flex items-center justify-center text-green-400 text-2xl font-bold">
              {userStats.healthyPlants}/{userStats.totalPlants} Healthy
            </div>
            <div className="text-xs text-gray-400 mt-2">Your plant health status</div>
          </div>
          
          {/* Plant Health Trend Chart Placeholder */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 flex flex-col items-center justify-center min-h-[220px] hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <LineChart className="w-6 h-6 text-green-500" />
              <span className="text-xl font-bold text-green-700">Collection Growth</span>
            </div>
            <div className="w-full h-32 flex items-center justify-center text-green-400 text-2xl font-bold">
              {userStats.speciesCount} Species
            </div>
            <div className="text-xs text-gray-400 mt-2">Unique plant species in your collection</div>
          </div>
        </section>
      </main>
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
