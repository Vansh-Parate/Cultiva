import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import FeaturedPlantCard from "../components/widgets/FeaturedPlantCard";
import PlantAnalyticsCharts from "../components/widgets/PlantAnalyticsCharts";
import EnhancedAnalyticsDashboard from "../components/widgets/EnhancedAnalyticsDashboard";
import apiClient from "../lib/axios";

// Minimalistic MVP Health Dashboard
const HealthDashboard = ({ plant }) => {
  const [healthResult, setHealthResult] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!plant) return;

    const fetchHealth = async () => {
      try {
        setLoadingHealth(true);
        setError(null);
        
        const res = await apiClient.post(`/api/v1/plants/${plant?.id}/health-check`);
        setHealthResult(res.data);
      } catch (err) {
        console.error('Failed to fetch health data:', err);
        setError('Failed to fetch health assessment');
      } finally {
        setLoadingHealth(false);
      }
    };

    fetchHealth();
  }, [plant]);

  if (!plant) return null;
  if (loadingHealth) return <div className="mt-6 font-black">Loading health assessment...</div>;
  if (error) return <div className="mt-6 text-red-500 font-black">{error}</div>;
  if (!healthResult?.result) return <div className="mt-6 font-black">No health data available.</div>;

  const healthScore = Math.round((healthResult.result?.is_healthy?.probability || 0) * 100);
  const isHealthy = healthResult.result?.is_healthy?.binary;

  return (
    <div className="mt-6 w-full max-w-xl flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-black text-gray-600">Health Score</span>
            <span className={`px-2 py-1 text-xs rounded-full font-black ${
              isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isHealthy ? 'Healthy' : 'Needs Attention'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                isHealthy ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${healthScore}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span className="font-black">0%</span>
            <span className="font-black">{healthScore}%</span>
            <span className="font-black">100%</span>
          </div>
        </div>
      </div>

      {!isHealthy && healthResult.result?.disease_suggestions && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-black text-red-800 mb-3">Potential Issues Detected</h3>
          <div className="space-y-2">
            {healthResult.result.disease_suggestions.map((disease, index) => (
              <div key={`disease-${disease.name}-${index}`} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100">
                <span className="font-black text-red-700">{disease.name}</span>
                <span className="text-sm font-black text-red-600">
                  {Math.round(disease.probability * 100)}% confidence
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MyPlants = () => {
  const { user } = useAuthContext();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobilePlantSelector, setShowMobilePlantSelector] = useState(false);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found. Please sign in again.');
          setLoading(false);
          return;
        }

        console.log('Fetching plants with token:', token.substring(0, 20) + '...');
        const res = await apiClient.get('/api/v1/plants');
        console.log('Plants API response:', res.data);

        // Check if response data is an array
        if (!Array.isArray(res.data)) {
          console.error('API returned non-array data:', res.data);
          setError('Invalid response from server');
          setPlants([]);
          return;
        }

        // Map backend data to frontend shape
        const mappedPlants = res.data.map(plant => ({
          id: plant.id,
          name: plant.name,
          species: plant.species?.commonName || plant.speciesId || '', // fallback if missing
          photoUrl: plant.images?.[0]?.imageUrl || plant.primaryImageUrl || '/placeholder-plant.png', // use first image or placeholder
          healthStatus: plant.healthStatus || 'Good', // fallback/default
          nextCare: plant.nextCare || 'N/A',
          humidity: plant.humidity || null,
          waterPH: plant.waterPH || null,
          temperature: plant.temperature || null,
          location: plant.location || user?.location || null, // Use plant location, fallback to user location
        }));
        console.log('Mapped plants:', mappedPlants);
        setPlants(mappedPlants);
      } catch (err) {
        console.error('Failed to fetch plants:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        });
        
        let errorMessage = 'Failed to fetch plants';
        if (err.response?.status === 401) {
          errorMessage = 'Authentication failed. Please sign in again.';
        } else if (err.response?.status === 403) {
          errorMessage = 'Access denied. Please check your permissions.';
        } else if (err.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        setPlants([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlants();

    const handlePlantAdded = () => fetchPlants();
    window.addEventListener('plant-added', handlePlantAdded);

    return () => {
      window.removeEventListener('plant-added', handlePlantAdded);
    };
  }, []);

  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  useEffect(() => {
    if (plants.length > 0 && !selectedPlantId) {
      setSelectedPlantId(plants[0].id);
    }
  }, [plants, selectedPlantId])

  if (loading) return <div className="flex items-center justify-center min-h-screen font-black">Loading your plants...</div>;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4 font-black text-lg">Error: {error}</div>
          <div className="text-gray-600 mb-6 font-black text-sm">
            {error.includes('Authentication') ? 
              'Please sign in again to access your plants.' : 
              'There was a problem loading your plants. Please try again.'}
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-black transition-colors"
            >
              Retry
            </button>
            {error.includes('Authentication') && (
              <button 
                onClick={() => window.location.href = '/auth/signin'} 
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-black transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F9F3] text-slate-800 antialiased selection:bg-emerald-200/60 selection:text-emerald-900 min-h-screen">
      {/* Decorative Background Glows (aligned with LandingPage light theme) */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-300/40 blur-3xl"></div>
        <div className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-green-200/60 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-lime-200/50 blur-3xl"></div>
      </div>
      
      <div className="relative flex flex-col px-6 py-8 space-y-8 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-emerald-950 tracking-tight">My Plants</h1>
            <p className="text-slate-700 mt-1">Manage your plant collection</p>
          </div>
        </div>

        {/* Blank-state banner prompting to add plants */}
        {plants.length === 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/60 rounded-2xl p-5 flex items-start gap-4">
            <div className="shrink-0 rounded-xl bg-white p-3 border border-emerald-100 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-emerald-600"><path d="M12 2C8 2 6 6 6 6s4 0 6-2c2 2 6 2 6 2s-2-4-6-4z" /><path d="M6 10c0 3.866 3.134 7 7 7h1v5h-2v-3.5C8.91 17.83 6 14.33 6 10z" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-emerald-950">Add your first plant to unlock health insights and care tips</h3>
              <p className="text-slate-600 mt-1">Start your collection to see personalized health assessments, schedules, and AI recommendations.</p>
              <div className="mt-3 flex gap-3">
                <a href="/find-plant" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">Add a Plant</a>
                <a href="/community" className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors text-sm font-medium">Explore Community</a>
              </div>
            </div>
          </div>
        )}

      {/* Mobile Plant Selector */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobilePlantSelector(!showMobilePlantSelector)}
          className="w-full flex items-center justify-between p-4 bg-white/60 backdrop-blur rounded-2xl border border-emerald-900/10 hover:border-emerald-900/20 transition-colors"
        >
          <span className="font-medium text-slate-800">
            {selectedPlant ? selectedPlant.name : 'Select a plant'}
          </span>
          <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform ${
            showMobilePlantSelector ? 'rotate-180' : ''
          }`} />
        </button>
        
        {showMobilePlantSelector && (
          <div className="mt-2 bg-white/60 backdrop-blur rounded-2xl border border-emerald-900/10 max-h-60 overflow-y-auto">
            {plants.map(plant => (
              <button
                key={plant.id}
                onClick={() => {
                  setSelectedPlantId(plant.id);
                  setShowMobilePlantSelector(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                  selectedPlantId === plant.id 
                    ? 'bg-emerald-50 border border-emerald-200' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              >
                <img
                  src={plant.photoUrl || '/placeholder-plant.png'}
                  alt={plant.name}
                  className="w-10 h-10 rounded-full border-2 border-emerald-400 object-cover"
                  onError={e => { e.currentTarget.src = '/placeholder-plant.png'; }}
                />
                <div className="flex-1 text-left">
                  <div className="font-medium text-slate-800">{plant.name}</div>
                  <div className="text-sm text-slate-600">{plant.species}</div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ring-1 ${
                  plant.healthStatus === 'Good' || plant.healthStatus === 'Excellent'
                    ? 'bg-emerald-700/20 text-emerald-800 ring-emerald-700/40'
                    : 'bg-amber-500/10 text-amber-800 ring-amber-400/20'
                }`}>
                  {plant.healthStatus}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      {plants.length > 0 ? (
        <>
          {/* Featured Plant Card */}
          <section className="w-full flex justify-center px-4">
            <div className="flex flex-col items-center w-full max-w-5xl">
              {selectedPlant && <FeaturedPlantCard plant={selectedPlant} />}
              {selectedPlant && <HealthDashboard plant={selectedPlant} />}
            </div>
          </section>

          {/* Enhanced Analytics Dashboard */}
          <section className="w-full flex justify-center px-4">
            <div className="flex flex-col items-center w-full max-w-5xl">
              {selectedPlant && <EnhancedAnalyticsDashboard plant={selectedPlant} careHistory={selectedPlant.careHistory} />}
            </div>
          </section>

          {/* Analytics Charts */}
          <section className="w-full flex justify-center px-4">
            <div className="flex flex-col items-center w-full max-w-5xl">
              {selectedPlant && <PlantAnalyticsCharts plant={selectedPlant} careHistory={selectedPlant.careHistory} />}
            </div>
          </section>
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mx-auto mb-4 text-emerald-500"><path d="M12 2C8 2 6 6 6 6s4 0 6-2c2 2 6 2 6 2s-2-4-6-4z" /><path d="M6 10c0 3.866 3.134 7 7 7h1v5h-2v-3.5C8.91 17.83 6 14.33 6 10z" /></svg>
          <div className="text-slate-800 font-semibold text-lg mb-2">Add a plant to unlock personalized insights</div>
          <div className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
            Track health, see care schedules, and get AI-powered tips tailored to your plants.
          </div>
          <div className="flex items-center justify-center gap-3">
            <a href="/find-plant" className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-medium transition-colors shadow-sm ring-1 ring-emerald-900/20">Add Your First Plant</a>
            <a href="/community" className="px-6 py-3 border border-slate-300 text-slate-700 rounded-full hover:bg-white font-medium transition-colors">Browse Community</a>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MyPlants;