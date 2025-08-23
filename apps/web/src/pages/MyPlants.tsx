import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import FeaturedPlantCard from "../components/widgets/FeaturedPlantCard";
import apiClient from "../lib/axios";

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

  if (loading) return <div className="flex items-center justify-center min-h-screen font-black">Loading your plants...</div>;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4 font-black">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-black"
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
        try {
          setLoadingHealth(true);
          setError(null);
          
          const res = await apiClient.post(`/api/v1/plants/${plant.id}/health-check`);
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
    if (!healthResult || !healthResult.result) return <div className="mt-6 font-black">No health data available.</div>;

    const healthScore = Math.round((healthResult.result.is_healthy.probability || 0) * 100);
    const isHealthy = healthResult.result.is_healthy.binary;

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

        {!isHealthy && healthResult.result.disease_suggestions && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-black text-red-800 mb-3">Potential Issues Detected</h3>
            <div className="space-y-2">
              {healthResult.result.disease_suggestions.map((disease, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100">
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

  return (
    <div className="flex flex-col px-6 py-8 space-y-8 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">My Plants</h1>
          <p className="text-gray-600 mt-1 font-black">Manage your plant collection</p>
        </div>
      </div>

      {/* Mobile Plant Selector */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobilePlantSelector(!showMobilePlantSelector)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <span className="font-black text-gray-900">
            {selectedPlant ? selectedPlant.name : 'Select a plant'}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
            showMobilePlantSelector ? 'rotate-180' : ''
          }`} />
        </button>
        
        {showMobilePlantSelector && (
          <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
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
                  <div className="font-black text-gray-900">{plant.name}</div>
                  <div className="text-sm font-black text-gray-600">{plant.species}</div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-black ${
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
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-sm p-6 h-64 flex items-center justify-center text-gray-400 font-black">
              Plant Details Chart (coming soon)
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 h-64 flex items-center justify-center text-gray-400 font-black">
              Water Level Chart (coming soon)
            </div>
          </section>
        </>
      ) : (
        /* Empty State */
        <div className="text-center text-gray-500 font-black">No plants in your collection yet.</div>
      )}
    </div>
  );
};

export default MyPlants;


