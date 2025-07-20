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

  return (
    <div className="min-h-screen w-full flex bg-[#e6efe6]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-10 py-8 space-y-8">
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
          {selectedPlant && <FeaturedPlantCard plant={selectedPlant} />}
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


