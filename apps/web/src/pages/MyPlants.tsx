import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import FeaturedPlantCard from "../components/widgets/FeaturedPlantCard";
import { Card, CardContent } from "../components/ui";
import { badgeClasses, buttonClasses } from "../lib/classNameHelpers";
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
  if (loadingHealth) return <div className="mt-6 font-semibold text-[hsl(var(--muted-foreground))]">Loading health assessment...</div>;
  if (error) return <div className="mt-6 text-red-500 font-semibold">{error}</div>;
  if (!healthResult?.result) return <div className="mt-6 font-semibold text-[hsl(var(--muted-foreground))]">No health data available.</div>;

  const healthScore = Math.round((healthResult.result?.is_healthy?.probability || 0) * 100);
  const isHealthy = healthResult.result?.is_healthy?.binary;

  return (
    <div className="mt-6 w-full max-w-xl flex flex-col gap-6">
      <Card className="flex items-center gap-6">
        <CardContent className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-[hsl(var(--muted-foreground))]">Health Score</span>
            <span className={isHealthy ? badgeClasses.success : badgeClasses.error}>
              {isHealthy ? 'Healthy' : 'Needs Attention'}
            </span>
          </div>
          <div className="w-full bg-[hsl(var(--muted))] rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isHealthy ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${healthScore}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))] mt-1">
            <span className="font-semibold">0%</span>
            <span className="font-semibold">{healthScore}%</span>
            <span className="font-semibold">100%</span>
          </div>
        </CardContent>
      </Card>

      {!isHealthy && healthResult.result?.disease_suggestions && (
        <Card className="border-red-200 dark:border-red-900/30">
          <div className="px-6 py-4 border-b border-[hsl(var(--card-border))]">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Potential Issues Detected</h3>
          </div>
          <CardContent>
            <div className="space-y-2">
              {healthResult.result.disease_suggestions.map((disease, index) => (
                <div key={`disease-${disease.name}-${index}`} className="flex items-center justify-between p-3 bg-[hsl(var(--background))] rounded-lg border border-[hsl(var(--border))]">
                  <span className="font-semibold text-red-700 dark:text-red-400">{disease.name}</span>
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {Math.round(disease.probability * 100)}% confidence
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

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
          species: plant.species?.commonName || plant.speciesId || '',
          photoUrl: plant.images?.[0]?.imageUrl || '/placeholder-plant.png',
          healthStatus: plant.healthStatus || 'Good',
          nextCare: plant.nextCare || 'N/A',
          humidity: plant.humidity || 0,
          waterPH: plant.waterPH || 0,
          temperature: plant.temperature || '',
        }));
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

  if (loading) return <div className="flex items-center justify-center min-h-screen font-semibold text-[hsl(var(--muted-foreground))]">Loading your plants...</div>;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4 font-semibold text-lg">Error: {error}</div>
          <div className="text-[hsl(var(--muted-foreground))] mb-6 font-semibold text-sm">
            {error.includes('Authentication') ?
              'Please sign in again to access your plants.' :
              'There was a problem loading your plants. Please try again.'}
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className={`w-full ${buttonClasses.primary}`}
            >
              Retry
            </button>
            {error.includes('Authentication') && (
              <button
                onClick={() => window.location.href = '/auth/signin'}
                className={`w-full ${buttonClasses.secondary}`}
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
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased">
      {/* Decorative Background Glows */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary-300/20 blur-3xl opacity-50"></div>
        <div className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-primary-200/15 blur-3xl opacity-50"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-primary-100/15 blur-3xl opacity-50"></div>
      </div>

      <div className="relative flex flex-col px-6 py-8 space-y-8 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[hsl(var(--foreground))] tracking-tight">My Plants</h1>
            <p className="text-[hsl(var(--muted-foreground))] mt-1">Manage your plant collection</p>
          </div>
        </div>

        {/* Blank-state banner prompting to add plants */}
        {plants.length === 0 && (
          <Card className="border-primary-200 dark:border-primary-800/30">
            <CardContent className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg bg-[hsl(var(--background))] p-3 border border-primary-200 dark:border-primary-800/30 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary-600"><path d="M12 2C8 2 6 6 6 6s4 0 6-2c2 2 6 2 6 2s-2-4-6-4z" /><path d="M6 10c0 3.866 3.134 7 7 7h1v5h-2v-3.5C8.91 17.83 6 14.33 6 10z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Add your first plant to unlock health insights and care tips</h3>
                <p className="text-[hsl(var(--muted-foreground))] mt-1">Start your collection to see personalized health assessments, schedules, and AI recommendations.</p>
                <div className="mt-3 flex gap-3">
                  <a href="/find-plant" className={buttonClasses.primary}>Add a Plant</a>
                  <a href="/community" className={buttonClasses.secondary}>Explore Community</a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile Plant Selector */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowMobilePlantSelector(!showMobilePlantSelector)}
            className="w-full flex items-center justify-between p-4 bg-[hsl(var(--card))] backdrop-blur rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <span className="font-medium text-[hsl(var(--foreground))]">
              {selectedPlant ? selectedPlant.name : 'Select a plant'}
            </span>
            <ChevronDown className={`w-5 h-5 text-[hsl(var(--muted-foreground))] transition-transform ${
              showMobilePlantSelector ? 'rotate-180' : ''
            }`} />
          </button>

          {showMobilePlantSelector && (
            <div className="mt-2 bg-[hsl(var(--card))] backdrop-blur rounded-lg border border-[hsl(var(--border))] max-h-60 overflow-y-auto">
              {plants.map(plant => (
                <button
                  key={plant.id}
                  onClick={() => {
                    setSelectedPlantId(plant.id);
                    setShowMobilePlantSelector(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                    selectedPlantId === plant.id
                      ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800'
                      : 'bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))]'
                  }`}
                >
                  <img
                    src={plant.photoUrl || '/placeholder-plant.png'}
                    alt={plant.name}
                    className="w-10 h-10 rounded-full border-2 border-primary-400 object-cover"
                    onError={e => { e.currentTarget.src = '/placeholder-plant.png'; }}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-[hsl(var(--foreground))]">{plant.name}</div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))]">{plant.species}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ring-1 ${
                    plant.healthStatus === 'Good' || plant.healthStatus === 'Excellent'
                      ? badgeClasses.success
                      : badgeClasses.warning
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
              <Card className="h-64 flex items-center justify-center">
                <p className="text-[hsl(var(--muted-foreground))]">Plant Details Chart (coming soon)</p>
              </Card>
              <Card className="h-64 flex items-center justify-center">
                <p className="text-[hsl(var(--muted-foreground))]">Water Level Chart (coming soon)</p>
              </Card>
            </section>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mx-auto mb-4 text-primary-500"><path d="M12 2C8 2 6 6 6 6s4 0 6-2c2 2 6 2 6 2s-2-4-6-4z" /><path d="M6 10c0 3.866 3.134 7 7 7h1v5h-2v-3.5C8.91 17.83 6 14.33 6 10z" /></svg>
            <div className="text-[hsl(var(--foreground))] font-semibold text-lg mb-2">Add a plant to unlock personalized insights</div>
            <div className="text-[hsl(var(--muted-foreground))] text-sm mb-6 max-w-md mx-auto">
              Track health, see care schedules, and get AI-powered tips tailored to your plants.
            </div>
            <div className="flex items-center justify-center gap-3">
              <a href="/find-plant" className={buttonClasses.primary}>Add Your First Plant</a>
              <a href="/community" className={buttonClasses.secondary}>Browse Community</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlants;
