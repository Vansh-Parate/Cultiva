import { useEffect, useState, useCallback } from 'react';
import { useRealtimeUpdates, RealTimeEvents } from './useRealtimeUpdates';

export interface DiseaseDetectionResult {
  plantId?: string;
  diseases: {
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
    symptoms: string[];
    treatments: string[];
    prevention: string[];
  }[];
  confidence: number;
  recommendations: string[];
}

export interface AIResponse {
  type: string;
  response: any;
  timestamp: Date;
}

export const useRealtimeAI = () => {
  const [diseaseDetections, setDiseaseDetections] = useState<Map<string, DiseaseDetectionResult>>(new Map());
  const [aiResponses, setAIResponses] = useState<AIResponse[]>([]);
  const [detecting, setDetecting] = useState<Map<string, boolean>>(new Map());
  const { subscribe, connected } = useRealtimeUpdates();

  // Setup real-time listeners
  useEffect(() => {
    if (!connected) return;

    // Disease detection results
    const unsubDiseaseDetection = subscribe(RealTimeEvents.AI_DISEASE_DETECTION, (result) => {
      const { plantId, ...detectionData } = result;
      setDiseaseDetections((prev) => {
        const newMap = new Map(prev);
        newMap.set(plantId, {
          plantId,
          ...detectionData,
        });
        return newMap;
      });
      setDetecting((prev) => {
        const newMap = new Map(prev);
        newMap.delete(plantId);
        return newMap;
      });
    });

    // General AI responses
    const unsubAIResponse = subscribe(RealTimeEvents.AI_RESPONSE, (response) => {
      setAIResponses((prev) => [
        ...prev,
        {
          ...response,
          timestamp: new Date(response.timestamp),
        },
      ]);
    });

    return () => {
      unsubDiseaseDetection?.();
      unsubAIResponse?.();
    };
  }, [connected, subscribe]);

  // Detect diseases for a plant image
  const detectDiseases = useCallback(async (plantId: string, imageUrl: string) => {
    setDetecting((prev) => {
      const newMap = new Map(prev);
      newMap.set(plantId, true);
      return newMap;
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:6969/api/v1/plants/detect-diseases', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plantId,
          imageUrl,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setDiseaseDetections((prev) => {
          const newMap = new Map(prev);
          newMap.set(plantId, result);
          return newMap;
        });
        return result;
      }
    } catch (error) {
      console.error('Disease detection failed:', error);
      setDetecting((prev) => {
        const newMap = new Map(prev);
        newMap.delete(plantId);
        return newMap;
      });
    }
  }, []);

  // Get care recommendations from AI
  const getCareRecommendations = useCallback(async (plantName: string, plantData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:6969/api/v1/ai/care-recommendations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plantName,
          plantData,
        }),
      });

      if (response.ok) {
        const recommendations = await response.json();
        setAIResponses((prev) => [
          ...prev,
          {
            type: 'care-recommendations',
            response: recommendations,
            timestamp: new Date(),
          },
        ]);
        return recommendations;
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    }
  }, []);

  // Chat with plant assistant
  const chatWithAssistant = useCallback(async (message: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:6969/api/v1/ai/chat', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const chatResponse = await response.json();
        setAIResponses((prev) => [
          ...prev,
          {
            type: 'chat',
            response: chatResponse,
            timestamp: new Date(),
          },
        ]);
        return chatResponse;
      }
    } catch (error) {
      console.error('Chat failed:', error);
    }
  }, []);

  // Get disease detection for a plant
  const getPlantDiseases = useCallback((plantId: string): DiseaseDetectionResult | undefined => {
    return diseaseDetections.get(plantId);
  }, [diseaseDetections]);

  // Check if detection is in progress
  const isDetecting = useCallback((plantId: string): boolean => {
    return detecting.get(plantId) || false;
  }, [detecting]);

  return {
    diseaseDetections,
    aiResponses,
    detecting,
    detectDiseases,
    getCareRecommendations,
    chatWithAssistant,
    getPlantDiseases,
    isDetecting,
  };
};
