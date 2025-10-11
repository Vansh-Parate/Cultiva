import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Stethoscope, 
  TrendingUp, 
  Users, 
  Lightbulb, 
  MessageCircle,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import apiClient from '../lib/axios';

interface Plant {
  id: string;
  name: string;
  species?: string;
  location?: string;
  healthStatus?: string;
}

interface CareRecommendations {
  watering: string;
  light: string;
  temperature: string;
  fertilization: string;
  tasks: string;
  seasonal: string;
  general: string;
}

interface DiseaseInfo {
  name: string;
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high';
}

interface GrowthPrediction {
  expectedHeight: string;
  expectedWidth: string;
  growthRate: string;
  milestones: string[];
  timeline: string;
}

interface CompanionPlant {
  name: string;
  benefits: string[];
  compatibility: 'excellent' | 'good' | 'moderate' | 'poor';
  spacing: string;
}

const AICareDashboard: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'disease' | 'growth' | 'companions' | 'chat'>('recommendations');
  
  // AI Features State
  const [careRecommendations, setCareRecommendations] = useState<CareRecommendations | null>(null);
  const [diseases, setDiseases] = useState<DiseaseInfo[]>([]);
  const [growthPrediction, setGrowthPrediction] = useState<GrowthPrediction | null>(null);
  const [companionPlants, setCompanionPlants] = useState<CompanionPlant[]>([]);
  const [chatResponse, setChatResponse] = useState<string>('');
  
  // Loading states
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [chatInput, setChatInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>(['']);
  const [currentSize, setCurrentSize] = useState('');

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await apiClient.get('/api/v1/plants');
      setPlants(response.data);
      if (response.data.length > 0) {
        setSelectedPlant(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const setLoadingState = (key: string, loading: boolean) => {
    setAiLoading(prev => ({ ...prev, [key]: loading }));
  };

  const getCareRecommendations = async () => {
    if (!selectedPlant) return;
    
    setLoadingState('recommendations', true);
    try {
      const response = await apiClient.post('/api/v1/ai/care-recommendations', {
        species: selectedPlant.species || selectedPlant.name,
        plantName: selectedPlant.name,
        location: selectedPlant.location,
        season: new Date().toLocaleDateString('en-US', { month: 'long' })
      });
      setCareRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Failed to get care recommendations:', error);
    } finally {
      setLoadingState('recommendations', false);
    }
  };

  const diagnoseDisease = async () => {
    if (!selectedPlant || symptoms.every(s => !s.trim())) return;
    
    setLoadingState('disease', true);
    try {
      const response = await apiClient.post('/api/v1/ai/disease-diagnosis', {
        symptoms: symptoms.filter(s => s.trim()),
        plantName: selectedPlant.name
      });
      setDiseases(response.data.diseases);
    } catch (error) {
      console.error('Failed to diagnose disease:', error);
    } finally {
      setLoadingState('disease', false);
    }
  };

  const predictGrowth = async () => {
    if (!selectedPlant || !currentSize.trim()) return;
    
    setLoadingState('growth', true);
    try {
      const response = await apiClient.post('/api/v1/ai/growth-prediction', {
        plantName: selectedPlant.name,
        currentSize: currentSize,
        careHistory: ['Regular watering', 'Monthly fertilization']
      });
      setGrowthPrediction(response.data.prediction);
    } catch (error) {
      console.error('Failed to predict growth:', error);
    } finally {
      setLoadingState('growth', false);
    }
  };

  const getCompanionPlants = async () => {
    if (!selectedPlant) return;
    
    setLoadingState('companions', true);
    try {
      const response = await apiClient.post('/api/v1/ai/companion-plants', {
        plantName: selectedPlant.name,
        gardenSize: 'medium',
        location: selectedPlant.location
      });
      setCompanionPlants(response.data.companions);
    } catch (error) {
      console.error('Failed to get companion plants:', error);
    } finally {
      setLoadingState('companions', false);
    }
  };

  const chatWithAssistant = async () => {
    if (!chatInput.trim()) return;
    
    setLoadingState('chat', true);
    try {
      const response = await apiClient.post('/api/v1/ai/chat', {
        question: chatInput,
        context: selectedPlant ? `Plant: ${selectedPlant.name} (${selectedPlant.species})` : undefined
      });
      setChatResponse(response.data.response);
    } catch (error) {
      console.error('Failed to chat with assistant:', error);
    } finally {
      setLoadingState('chat', false);
    }
  };

  const addSymptom = () => {
    setSymptoms([...symptoms, '']);
  };

  const updateSymptom = (index: number, value: string) => {
    const newSymptoms = [...symptoms];
    newSymptoms[index] = value;
    setSymptoms(newSymptoms);
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading AI Care Dashboard...</span>
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Plants Found</h3>
        <p className="text-gray-500">Add some plants to your collection to use AI-powered care features.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Care Dashboard</h1>
        <p className="text-gray-600">Get intelligent insights and recommendations for your plants</p>
      </div>

      {/* Plant Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Plant
        </label>
        <select
          value={selectedPlant?.id || ''}
          onChange={(e) => {
            const plant = plants.find(p => p.id === e.target.value);
            setSelectedPlant(plant || null);
          }}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {plants.map(plant => (
            <option key={plant.id} value={plant.id}>
              {plant.name} {plant.species && `(${plant.species})`}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'recommendations', label: 'Care Recommendations', icon: Lightbulb },
            { id: 'disease', label: 'Disease Diagnosis', icon: Stethoscope },
            { id: 'growth', label: 'Growth Prediction', icon: TrendingUp },
            { id: 'companions', label: 'Companion Plants', icon: Users },
            { id: 'chat', label: 'AI Assistant', icon: MessageCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'recommendations' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Care Recommendations</h2>
              <button
                onClick={getCareRecommendations}
                disabled={aiLoading.recommendations}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {aiLoading.recommendations ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                Get Recommendations
              </button>
            </div>

            {careRecommendations ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(careRecommendations).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 capitalize mb-2">{key}</h3>
                    <p className="text-gray-700 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Click "Get Recommendations" to receive AI-powered care advice for {selectedPlant?.name}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'disease' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Disease Diagnosis</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms (add multiple symptoms for better diagnosis)
              </label>
              {symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={symptom}
                    onChange={(e) => updateSymptom(index, e.target.value)}
                    placeholder="e.g., yellowing leaves, brown spots, wilting"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {symptoms.length > 1 && (
                    <button
                      onClick={() => removeSymptom(index)}
                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addSymptom}
                className="text-sm text-green-600 hover:text-green-700"
              >
                + Add another symptom
              </button>
            </div>

            <button
              onClick={diagnoseDisease}
              disabled={aiLoading.disease || symptoms.every(s => !s.trim())}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              {aiLoading.disease ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Stethoscope className="h-4 w-4 mr-2" />
              )}
              Diagnose Disease
            </button>

            {diseases.length > 0 && (
              <div className="mt-6 space-y-4">
                {diseases.map((disease, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{disease.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(disease.severity)}`}>
                        {disease.severity} severity
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Symptoms</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {disease.symptoms.map((symptom, i) => (
                            <li key={i}>• {symptom}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Treatment</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {disease.treatment.map((treatment, i) => (
                            <li key={i}>• {treatment}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'growth' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Growth Prediction</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Size Description
              </label>
              <input
                type="text"
                value={currentSize}
                onChange={(e) => setCurrentSize(e.target.value)}
                placeholder="e.g., 6 inches tall, small pot, 3 leaves"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              onClick={predictGrowth}
              disabled={aiLoading.growth || !currentSize.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {aiLoading.growth ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-2" />
              )}
              Predict Growth
            </button>

            {growthPrediction && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Expected Size</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Height:</span> {growthPrediction.expectedHeight}</div>
                    <div><span className="font-medium">Width:</span> {growthPrediction.expectedWidth}</div>
                    <div><span className="font-medium">Growth Rate:</span> {growthPrediction.growthRate}</div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Timeline</h3>
                  <p className="text-sm text-gray-700">{growthPrediction.timeline}</p>
                </div>
                
                <div className="md:col-span-2 bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Growth Milestones</h3>
                  <ul className="space-y-1">
                    {growthPrediction.milestones.map((milestone, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'companions' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Companion Plants</h2>
              <button
                onClick={getCompanionPlants}
                disabled={aiLoading.companions}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
              >
                {aiLoading.companions ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Users className="h-4 w-4 mr-2" />
                )}
                Find Companions
              </button>
            </div>

            {companionPlants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companionPlants.map((companion, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{companion.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompatibilityColor(companion.compatibility)}`}>
                        {companion.compatibility}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Benefits</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {companion.benefits.map((benefit, i) => (
                          <li key={i}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Spacing:</span> {companion.spacing}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Click "Find Companions" to discover plants that work well with {selectedPlant?.name}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Plant Assistant</h2>
            
            <div className="mb-4">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything about plant care..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
              />
            </div>

            <button
              onClick={chatWithAssistant}
              disabled={aiLoading.chat || !chatInput.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              {aiLoading.chat ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <MessageCircle className="h-4 w-4 mr-2" />
              )}
              Ask Assistant
            </button>

            {chatResponse && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Brain className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-medium text-gray-900">AI Assistant Response</h3>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{chatResponse}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AICareDashboard;
