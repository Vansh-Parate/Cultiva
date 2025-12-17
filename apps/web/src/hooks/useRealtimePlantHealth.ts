import { useEffect, useState, useCallback } from 'react';
import { useRealtimeUpdates, RealTimeEvents } from './useRealtimeUpdates';

export interface PlantHealth {
  plantId: string;
  status: 'healthy' | 'warning' | 'critical';
  confidence: number;
  issues?: string[];
  recommendations?: string[];
  lastChecked?: Date;
  temperature?: number;
  humidity?: number;
  waterPH?: number;
}

export interface HealthCheckProgress {
  plantId: string;
  status: 'analyzing' | 'complete' | 'error';
  progress?: number;
  message?: string;
}

export const useRealtimePlantHealth = (plantId?: string) => {
  const [plantHealth, setPlantHealth] = useState<Map<string, PlantHealth>>(new Map());
  const [healthCheckProgress, setHealthCheckProgress] = useState<Map<string, HealthCheckProgress>>(new Map());
  const { subscribe, subscribeToPlant, connected } = useRealtimeUpdates();

  // Setup real-time listeners
  useEffect(() => {
    if (!connected) return;

    if (plantId) {
      subscribeToPlant(plantId);
    }

    // Health check started
    const unsubHealthStart = subscribe(RealTimeEvents.HEALTH_CHECK_START, ({ plantId, status }) => {
      setHealthCheckProgress((prev) => {
        const newMap = new Map(prev);
        newMap.set(plantId, { plantId, status: 'analyzing', progress: 0 });
        return newMap;
      });
    });

    // Health check completed
    const unsubHealthComplete = subscribe(RealTimeEvents.HEALTH_CHECK_COMPLETE, (results) => {
      const { plantId, ...healthData } = results;
      setPlantHealth((prev) => {
        const newMap = new Map(prev);
        newMap.set(plantId, {
          plantId,
          status: healthData.status || 'healthy',
          confidence: healthData.confidence || 0,
          issues: healthData.issues || [],
          recommendations: healthData.recommendations || [],
          lastChecked: new Date(),
          ...healthData,
        });
        return newMap;
      });

      setHealthCheckProgress((prev) => {
        const newMap = new Map(prev);
        newMap.set(plantId, { plantId, status: 'complete' });
        return newMap;
      });
    });

    // Health status updated
    const unsubHealthUpdate = subscribe(RealTimeEvents.HEALTH_STATUS_UPDATED, (status) => {
      const { plantId, ...healthData } = status;
      setPlantHealth((prev) => {
        const newMap = new Map(prev);
        const existing = newMap.get(plantId) || { plantId, status: 'healthy', confidence: 0 };
        newMap.set(plantId, { ...existing, ...healthData, lastChecked: new Date() });
        return newMap;
      });
    });

    return () => {
      unsubHealthStart?.();
      unsubHealthComplete?.();
      unsubHealthUpdate?.();
    };
  }, [connected, plantId, subscribe, subscribeToPlant]);

  // Helper function to perform health check
  const performHealthCheck = useCallback(async (plantId: string) => {
    try {
      const token = localStorage.getItem('token');
      setHealthCheckProgress((prev) => {
        const newMap = new Map(prev);
        newMap.set(plantId, { plantId, status: 'analyzing', progress: 25 });
        return newMap;
      });

      const response = await fetch(`http://localhost:6969/api/v1/plants/${plantId}/health-check`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const results = await response.json();
        setHealthCheckProgress((prev) => {
          const newMap = new Map(prev);
          newMap.set(plantId, { plantId, status: 'complete' });
          return newMap;
        });
        return results;
      } else {
        setHealthCheckProgress((prev) => {
          const newMap = new Map(prev);
          newMap.set(plantId, { plantId, status: 'error', message: 'Health check failed' });
          return newMap;
        });
      }
    } catch (error) {
      console.error('Health check error:', error);
      setHealthCheckProgress((prev) => {
        const newMap = new Map(prev);
        newMap.set(plantId, { plantId, status: 'error', message: String(error) });
        return newMap;
      });
    }
  }, []);

  // Get health status for specific plant
  const getPlantHealth = useCallback((plantId: string): PlantHealth | undefined => {
    return plantHealth.get(plantId);
  }, [plantHealth]);

  // Get all health data
  const getAllHealth = useCallback((): PlantHealth[] => {
    return Array.from(plantHealth.values());
  }, [plantHealth]);

  // Get health check progress
  const getHealthCheckProgress = useCallback((plantId: string): HealthCheckProgress | undefined => {
    return healthCheckProgress.get(plantId);
  }, [healthCheckProgress]);

  return {
    plantHealth,
    healthCheckProgress,
    performHealthCheck,
    getPlantHealth,
    getAllHealth,
    getHealthCheckProgress,
  };
};
