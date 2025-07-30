import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FeaturedPlantCard from "../components/widgets/FeaturedPlantCard";
import apiClient from "../lib/axios";
import { ChevronDown, Leaf, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const MyPlants = () => {
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
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const res = await apiClient.get('/api/v1/plants');

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
          photoUrl: plant.images?.[0]?.url || '', // use first image or placeholder
          healthStatus: plant.healthStatus || 'Good', // fallback/default
          nextCare: plant.nextCare || 'N/A',
          humidity: plant.humidity, // Changed from ?? 0
          waterPH: plant.waterPH,   // Changed from ?? 0
          temperature: plant.temperature, // Changed from ?? ''
        }));
        setPlants(mappedPlants);
      } catch (err) {
        console.error('Failed to fetch plants:', err);
        setError(err.response?.data?.error || 'Failed to fetch plants');
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

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading your plants...</div>;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Minimalistic MVP Health Dashboard
  const HealthDashboard = ({ plant }) => {
    const [healthResult, setHealthResult] = useState(null);
    const [loadingHealth, setLoadingHealth] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (!plant) return;
      const fetchHealth = async () => {
        setLoadingHealth(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
          const res = await apiClient.post(`/api/v1/plants/${plant.id}/health-check`, null, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setHealthResult(res.data);
        } catch {
          setError('Failed to fetch health assessment.');
        } finally {
          setLoadingHealth(false);
        }
      };
      fetchHealth();
    }, [plant]);

    if (!plant) return null;
    if (loadingHealth) return <div className="mt-6">Loading health assessment...</div>;
    if (error) return <div className="mt-6 text-red-500">{error}</div>;
    if (!healthResult || !healthResult.result) return <div className="mt-6">No health data available.</div>;

    // HealthStatusCard
    const healthScore = Math.round((healthResult.result.is_healthy.probability || 0) * 100);
    const isHealthy = healthResult.result.is_healthy.binary;
    return (
      <div className="mt-6 w-full max-w-xl flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Assessment</h3>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                  {healthScore}%
                </div>
                <div className="text-sm text-gray-600">Health Score</div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${healthScore}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {isHealthy ? 'Plant is healthy' : 'Plant needs attention'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto ml-64">
        <div className="p-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Plants</h1>
              <p className="text-gray-600">Manage your plant collection</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-green-100">🔍</button>
              <button className="p-2 rounded-full hover:bg-green-100">🔔</button>
            </div>
          </header>

          {/* Mobile Plant Selector - Only visible on small screens */}
          <div className="lg:hidden">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <button
                onClick={() => setShowMobilePlantSelector(!showMobilePlantSelector)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span className="font-medium">
                    {selectedPlant ? selectedPlant.name : 'Select a plant'}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${showMobilePlantSelector ? 'rotate-180' : ''}`} />
              </button>
              
              {showMobilePlantSelector && (
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                  {plants.map(plant => (
                    <button
                      key={plant.id}
                      onClick={() => {
                        setSelectedPlantId(plant.id);
                        setShowMobilePlantSelector(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                        selectedPlantId === plant.id 
                          ? 'bg-green-100 border border-green-300' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <img
                        src={plant.photoUrl}
                        alt={plant.name}
                        className="w-10 h-10 rounded-full border-2 border-green-400 object-cover"
                        onError={e => { e.currentTarget.src = '/placeholder-plant.png'; }}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{plant.name}</div>
                        <div className="text-sm text-gray-600">{plant.species}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        plant.healthStatus === 'Good' || plant.healthStatus === 'Excellent'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {plant.healthStatus}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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

              {/* Charts and Widgets (placeholders) */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full mt-8">
                <div className="bg-white rounded-2xl shadow-sm p-6 h-64 flex items-center justify-center text-gray-400">
                  Plant Details Chart (coming soon)
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 h-64 flex items-center justify-center text-gray-400">
                  Water Level Chart (coming soon)
                </div>
              </section>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No plants yet</h2>
                <p className="text-gray-600 mb-8">Start building your plant collection by identifying your first plant!</p>
                <Link 
                  to="/find-plant"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Plant
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Hidden on small screens to prevent overflow */}
      <div className="hidden lg:block w-80 bg-white border-l border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Plant List</h3>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              see all
            </button>
          </div>
          
          {plants.length > 0 ? (
            <div className="space-y-3">
              {plants.map(plant => (
                <button
                  key={plant.id}
                  onClick={() => setSelectedPlantId(plant.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                    selectedPlantId === plant.id 
                      ? 'bg-green-100 border border-green-300' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <img
                    src={plant.photoUrl}
                    alt={plant.name}
                    className="w-12 h-12 rounded-full border-2 border-green-400 object-cover"
                    onError={e => { e.currentTarget.src = '/placeholder-plant.png'; }}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{plant.name}</div>
                    <div className="text-sm text-gray-600">{plant.species}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    plant.healthStatus === 'Good' || plant.healthStatus === 'Excellent'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {plant.healthStatus}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            /* Empty State for Right Sidebar */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">No plants yet</h4>
              <p className="text-xs text-gray-500 mb-4">Your plant list will appear here</p>
              <Link 
                to="/find-plant"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Plant
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPlants;


