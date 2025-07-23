import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import FeaturedPlantCard from "../components/widgets/FeaturedPlantCard";
import axios from "axios";

const MyPlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/v1/plants', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        // Map backend data to frontend shape
        const mappedPlants = res.data.map(plant => ({
          id: plant.id,
          name: plant.name,
          species: plant.species?.commonName || plant.speciesId || '', // fallback if missing
          photoUrl: plant.images?.[0]?.url || '', // use first image or placeholder
          healthStatus: plant.healthStatus || 'Good', // fallback/default
          nextCare: plant.nextCare || 'N/A',
          humidity: plant.humidity ?? 0,
          waterPH: plant.waterPH ?? 0,
          temperature: plant.temperature ?? '',
        }));
        setPlants(mappedPlants);
      } catch (err) {
        console.error('Failed to fetch plants:', err);
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
          const res = await axios.post(`/api/v1/plants/${plant.id}/health-check`, null, {
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
          <div className="flex flex-col items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#f3f3f3" stroke="#e5e7eb" strokeWidth="2" />
              <circle
                cx="20" cy="20" r="18"
                fill="none"
                stroke={isHealthy ? '#22c55e' : '#f59e42'}
                strokeWidth="3.5"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={(1 - healthScore / 100) * 2 * Math.PI * 18}
                strokeLinecap="round"
              />
              <text x="50%" y="54%" textAnchor="middle" fontSize="18" fill="#222" fontWeight="bold">{healthScore}</text>
            </svg>
            <div className={`mt-2 text-lg font-semibold ${isHealthy ? 'text-green-600' : 'text-yellow-600'}`}>{isHealthy ? 'Healthy' : 'Needs Attention'}</div>
            <div className="text-xs text-gray-500 mt-1">Confidence: {healthScore}%</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-700">Last checked: {healthResult.timestamp ? new Date(healthResult.timestamp).toLocaleString() : 'Just now'}</div>
            {/* Add more quick stats here if needed */}
          </div>
        </div>
        {/* DiseaseDashboard: only if not healthy */}
        {!isHealthy && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-bold mb-2">Detected Issues</div>
            <ul className="space-y-2">
              {healthResult.result.disease.suggestions.map(s => (
                <li key={s.id} className="flex items-center gap-4">
                  <div className="w-2 h-8 rounded bg-yellow-400" style={{ height: `${Math.max(8, s.probability * 40)}px` }}></div>
                  <div className="flex-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-gray-500">Probability: {(s.probability * 100).toFixed(1)}%</div>
                  </div>
                  {s.similar_images?.[0]?.url_small && (
                    <img src={s.similar_images[0].url_small} alt={s.name} width={36} height={36} className="rounded" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex bg-[#e6efe6]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-10 py-8 space-y-8 ">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome Back, <span className="text-green-700">YourName</span>!</h1>
            <div className="text-gray-500 text-sm mt-1">Saturday, 27 Jul 2022</div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-green-100">🔍</button>
            <button className="p-2 rounded-full hover:bg-green-100">🔔</button>
          </div>
        </header>

        {/* Featured Plant Card */}
        <section className="w-full flex justify-center">
          <div className="flex flex-col items-center w-full">
            {selectedPlant && <FeaturedPlantCard plant={selectedPlant} />}
            {selectedPlant && <HealthDashboard plant={selectedPlant} />}
          </div>
        </section>

        {/* No plants message */}
        {plants.length === 0 && (
          <div className="text-center text-gray-500">No plants in your collection yet.</div>
        )}

        {/* Charts and Widgets (placeholders) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-64 flex items-center justify-center text-gray-400">
            Plant Details Chart (coming soon)
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 h-64 flex items-center justify-center text-gray-400">
            Water Level Chart (coming soon)
          </div>
        </section>
      </main>

      {/* Right Sidebar */}
      <RightSidebar
        plants={plants}
        selectedPlantId={selectedPlantId}
        onSelectPlant={setSelectedPlantId}
      />
    </div>
  );
};

export default MyPlants;


