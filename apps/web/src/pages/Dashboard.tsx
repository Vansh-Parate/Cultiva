import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import apiClient from "../lib/axios";
import { useWeather } from "../hooks/useWeather";
import { Leaf, CalendarCheck, Sprout, Award, LogOut, CheckCircle, Sun, Droplet, Bell, ArrowRight, Scissors, Thermometer, Lightbulb, Flame } from "lucide-react";
import NotificationCenter from "../components/NotificationCenter";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Dynamic user data - will be fetched from backend
  const [user] = useState({
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
      icon: <Flame className="w-6 h-6" />,
      desc: "New additions",
    },
  ]);

  const [myPlants, setMyPlants] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const plantsRes = await apiClient.get('/api/v1/plants');

        const plants = plantsRes.data;

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
            icon: <Flame className="w-6 h-6" />,
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/signin';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {user.badge}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setNotificationsOpen(true)}
                className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.desc}</p>
                  </div>
                  <div className="text-green-500">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Plants Carousel */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-green-700">My Plants</h2>
                  <Link to="/plants" className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                {myPlants.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {myPlants.map((plant, index) => (
                      <div key={index} className="flex-shrink-0 w-48 bg-gray-50 rounded-lg p-4">
                        <img src={plant.img} alt={plant.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                        <h3 className="font-semibold text-gray-900">{plant.name}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${healthColors[plant.health] || healthColors.Good}`}>
                          {plant.health}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Leaf className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No plants yet. Start by identifying a plant!</p>
                    <Link to="/find-plant" className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Find a Plant
                    </Link>
                  </div>
                )}
              </div>

              {/* Care Tasks Overview */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-6 h-6 text-green-500" />
                    <span className="text-xl font-bold text-green-700">Care Tasks</span>
                  </div>
                  <Link to="/care" className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <Droplet className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="font-semibold text-green-700">Watering</p>
                    <p className="text-sm text-green-600">3 due today</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Sun className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold text-blue-700">Fertilizing</p>
                    <p className="text-sm text-blue-600">1 this week</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Scissors className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="font-semibold text-purple-700">Pruning</p>
                    <p className="text-sm text-purple-600">2 overdue</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <Droplet className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="font-medium text-gray-800">Water Peace Lily</div>
                        <div className="text-xs text-gray-600">Due today</div>
                      </div>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">High</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <Sun className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-800">Fertilize Snake Plant</div>
                        <div className="text-xs text-gray-600">Due in 5 days</div>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Low</span>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <Link to="/care" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    Manage Care Tasks <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
                <h2 className="text-xl font-bold text-green-700 mb-6">Recent Activity</h2>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img src={activity.img} alt={activity.plant} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.plant}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Weather & Tips */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
                <h2 className="text-xl font-bold text-green-700 mb-6">Weather & Tips</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">Temperature</span>
                    </div>
                    <span className="font-semibold text-blue-700">{weatherDisplay.temperature}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Humidity</span>
                    </div>
                    <span className="font-semibold text-green-700">{weatherDisplay.humidity}</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Today's Tip</p>
                      <p className="text-sm text-yellow-700 mt-1">{weatherDisplay.tip}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plant Health Overview */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
                <h2 className="text-xl font-bold text-green-700 mb-6">Plant Health Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Excellent</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(userStats.healthyPlants / Math.max(userStats.totalPlants, 1)) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userStats.healthyPlants}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Needs Attention</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${((userStats.totalPlants - userStats.healthyPlants) / Math.max(userStats.totalPlants, 1)) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userStats.totalPlants - userStats.healthyPlants}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collection Growth */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1">
                <h2 className="text-xl font-bold text-green-700 mb-6">Collection Growth</h2>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{userStats.monthlyAdditions}</div>
                  <p className="text-sm text-gray-600">New plants this month</p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min((userStats.monthlyAdditions / 10) * 100, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Goal: 10 plants/month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <NotificationCenter isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
};

export default Dashboard;
