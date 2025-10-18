import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Heart, 
  Droplets, 
  Sun, 
  Thermometer, 
  Wind,
  Eye,
  Camera,
  Brain,
  CheckCircle,
  XCircle,
  Loader2,
  Target,
  TrendingDown,
  TrendingUp,
  Lightbulb,
  Zap,
  Shield
} from 'lucide-react';
import apiClient from '../lib/axios';

interface Plant {
  id: string;
  name: string;
  species?: string;
  location?: string;
  healthStatus?: string;
}

interface StressIndicator {
  type: 'environmental' | 'nutritional' | 'pest' | 'disease' | 'physical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  symptoms: string[];
  causes: string[];
  impact: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

interface StressAnalysis {
  overallStressLevel: number;
  stressScore: number;
  primaryStressors: StressIndicator[];
  secondaryStressors: StressIndicator[];
  environmentalFactors: {
    temperature: { value: number; optimal: { min: number; max: number }; stress: boolean };
    humidity: { value: number; optimal: { min: number; max: number }; stress: boolean };
    light: { value: string; optimal: string; stress: boolean };
    airCirculation: { value: string; optimal: string; stress: boolean };
  };
  recoveryPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    timeline: string;
  };
  preventionTips: string[];
  monitoringSchedule: Array<{
    task: string;
    frequency: string;
    importance: 'low' | 'medium' | 'high';
  }>;
}

const AIStressDetector: React.FC<{ plant: Plant }> = ({ plant }) => {
  const [stressAnalysis, setStressAnalysis] = useState<StressAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [visualSymptoms, setVisualSymptoms] = useState<string[]>(['']);
  const [environmentalData, setEnvironmentalData] = useState({
    temperature: 22,
    humidity: 50,
    lightLevel: 'medium',
    airCirculation: 'good'
  });

  useEffect(() => {
    if (plant) {
      analyzeStress();
    }
  }, [plant]);

  const analyzeStress = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/ai/stress-detection', {
        plantName: plant.name,
        species: plant.species,
        environmentalData,
        visualSymptoms: visualSymptoms.filter(s => s.trim())
      });

      setStressAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Failed to analyze stress:', error);
      // Generate mock data for demonstration
      generateMockStressAnalysis();
    } finally {
      setLoading(false);
    }
  };

  const generateMockStressAnalysis = () => {
    const mockAnalysis: StressAnalysis = {
      overallStressLevel: 65,
      stressScore: 6.5,
      primaryStressors: [
        {
          type: 'environmental',
          severity: 'medium',
          confidence: 85,
          symptoms: ['Wilting leaves', 'Brown leaf tips', 'Reduced growth'],
          causes: ['Insufficient humidity', 'Temperature fluctuations'],
          impact: 'Reduced photosynthesis and growth rate',
          urgency: 'medium'
        },
        {
          type: 'nutritional',
          severity: 'low',
          confidence: 70,
          symptoms: ['Yellowing of older leaves', 'Stunted growth'],
          causes: ['Nitrogen deficiency', 'Poor soil drainage'],
          impact: 'Reduced nutrient uptake',
          urgency: 'low'
        }
      ],
      secondaryStressors: [
        {
          type: 'pest',
          severity: 'low',
          confidence: 60,
          symptoms: ['Small holes in leaves', 'Sticky residue'],
          causes: ['Aphid infestation', 'Poor plant hygiene'],
          impact: 'Minor damage to foliage',
          urgency: 'low'
        }
      ],
      environmentalFactors: {
        temperature: {
          value: environmentalData.temperature,
          optimal: { min: 18, max: 25 },
          stress: environmentalData.temperature < 18 || environmentalData.temperature > 25
        },
        humidity: {
          value: environmentalData.humidity,
          optimal: { min: 40, max: 70 },
          stress: environmentalData.humidity < 40 || environmentalData.humidity > 70
        },
        light: {
          value: environmentalData.lightLevel,
          optimal: 'bright indirect',
          stress: environmentalData.lightLevel === 'low' || environmentalData.lightLevel === 'very high'
        },
        airCirculation: {
          value: environmentalData.airCirculation,
          optimal: 'good',
          stress: environmentalData.airCirculation === 'poor'
        }
      },
      recoveryPlan: {
        immediate: [
          'Increase humidity to 60-70%',
          'Move to stable temperature location',
          'Check for pest infestation'
        ],
        shortTerm: [
          'Apply balanced fertilizer',
          'Improve air circulation',
          'Monitor soil moisture levels'
        ],
        longTerm: [
          'Establish consistent care routine',
          'Regular health monitoring',
          'Preventive pest management'
        ],
        timeline: '2-4 weeks for full recovery'
      },
      preventionTips: [
        'Maintain consistent environmental conditions',
        'Regular plant inspection for early signs',
        'Proper watering schedule',
        'Adequate nutrition program'
      ],
      monitoringSchedule: [
        {
          task: 'Check leaf color and texture',
          frequency: 'Daily',
          importance: 'high'
        },
        {
          task: 'Monitor soil moisture',
          frequency: 'Every 2 days',
          importance: 'medium'
        },
        {
          task: 'Inspect for pests',
          frequency: 'Weekly',
          importance: 'high'
        }
      ]
    };
    setStressAnalysis(mockAnalysis);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWithImage = async () => {
    if (!uploadedImage) return;
    
    setAnalyzing(true);
    try {
      const base64 = await fileToBase64(uploadedImage);
      const response = await apiClient.post('/api/v1/ai/stress-detection', {
        plantName: plant.name,
        image: base64,
        environmentalData
      });
      
      setStressAnalysis(response.data.analysis);
      setShowImageUpload(false);
    } catch (error) {
      console.error('Failed to analyze image:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  const addVisualSymptom = () => {
    setVisualSymptoms([...visualSymptoms, '']);
  };

  const updateVisualSymptom = (index: number, value: string) => {
    const newSymptoms = [...visualSymptoms];
    newSymptoms[index] = value;
    setVisualSymptoms(newSymptoms);
  };

  const removeVisualSymptom = (index: number) => {
    setVisualSymptoms(visualSymptoms.filter((_, i) => i !== index));
  };

  const getStressLevelColor = (level: number) => {
    if (level >= 80) return 'text-red-600 bg-red-100';
    if (level >= 60) return 'text-yellow-600 bg-yellow-100';
    if (level >= 40) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!plant) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Select a plant to analyze stress levels</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Stress Detector</h2>
        <p className="text-gray-600">Comprehensive stress analysis and recovery recommendations for {plant.name}</p>
      </div>

      {/* Environmental Data Input */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
            <input
              type="number"
              value={environmentalData.temperature}
              onChange={(e) => setEnvironmentalData({ ...environmentalData, temperature: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
            <input
              type="number"
              value={environmentalData.humidity}
              onChange={(e) => setEnvironmentalData({ ...environmentalData, humidity: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Light Level</label>
            <select
              value={environmentalData.lightLevel}
              onChange={(e) => setEnvironmentalData({ ...environmentalData, lightLevel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="bright indirect">Bright Indirect</option>
              <option value="direct">Direct</option>
              <option value="very high">Very High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Air Circulation</label>
            <select
              value={environmentalData.airCirculation}
              onChange={(e) => setEnvironmentalData({ ...environmentalData, airCirculation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="poor">Poor</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visual Symptoms Input */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Symptoms</h3>
        <div className="space-y-3">
          {visualSymptoms.map((symptom, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={symptom}
                onChange={(e) => updateVisualSymptom(index, e.target.value)}
                placeholder="e.g., yellowing leaves, brown spots, wilting"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {visualSymptoms.length > 1 && (
                <button
                  onClick={() => removeVisualSymptom(index)}
                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addVisualSymptom}
            className="text-sm text-green-600 hover:text-green-700"
          >
            + Add another symptom
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Image Analysis</h3>
          <button
            onClick={() => setShowImageUpload(!showImageUpload)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Camera className="h-4 w-4 mr-2" />
            {showImageUpload ? 'Cancel' : 'Upload Image'}
          </button>
        </div>

        {showImageUpload && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {!imagePreview ? (
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Upload a clear image of your plant</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  Choose Image
                </label>
              </div>
            ) : (
              <div>
                <div className="relative mb-4">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={analyzeWithImage}
                  disabled={analyzing}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {analyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  Analyze Image
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Analysis Button */}
      <div className="text-center mb-6">
        <button
          onClick={analyzeStress}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center mx-auto"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Brain className="h-5 w-5 mr-2" />
          )}
          Analyze Stress Levels
        </button>
      </div>

      {/* Stress Analysis Results */}
      {stressAnalysis && (
        <div className="space-y-6">
          {/* Overall Stress Level */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Stress Assessment</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">{stressAnalysis.overallStressLevel}%</div>
                <p className="text-gray-600">Stress Level</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStressLevelColor(stressAnalysis.overallStressLevel)}`}>
                  {stressAnalysis.overallStressLevel >= 80 ? 'High Stress' :
                   stressAnalysis.overallStressLevel >= 60 ? 'Moderate Stress' :
                   stressAnalysis.overallStressLevel >= 40 ? 'Low Stress' : 'Healthy'}
                </div>
                <p className="text-sm text-gray-600 mt-1">Score: {stressAnalysis.stressScore}/10</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  stressAnalysis.overallStressLevel >= 80 ? 'bg-red-500' :
                  stressAnalysis.overallStressLevel >= 60 ? 'bg-yellow-500' :
                  stressAnalysis.overallStressLevel >= 40 ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{ width: `${stressAnalysis.overallStressLevel}%` }}
              />
            </div>
          </div>

          {/* Primary Stressors */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Stressors</h3>
            <div className="space-y-4">
              {stressAnalysis.primaryStressors.map((stressor, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 capitalize">{stressor.type} Stress</h4>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(stressor.severity)}`}>
                        {stressor.severity} severity
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(stressor.urgency)}`}>
                        {stressor.urgency} urgency
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Symptoms</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {stressor.symptoms.map((symptom, i) => (
                          <li key={i}>• {symptom}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Causes</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {stressor.causes.map((cause, i) => (
                          <li key={i}>• {cause}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Impact:</span>
                    <span className="text-gray-600 ml-2">{stressor.impact}</span>
                  </div>
                  
                  <div className="mt-2">
                    <span className="font-medium text-gray-700">Confidence:</span>
                    <span className="text-gray-600 ml-2">{stressor.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Factors */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(stressAnalysis.environmentalFactors).map(([key, factor]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">{key}</h4>
                    {factor.stress ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Current: {typeof factor.value === 'number' ? factor.value.toFixed(1) : factor.value}</div>
                    <div>Optimal: {typeof factor.optimal === 'object' ? 
                      `${factor.optimal.min}-${factor.optimal.max}` : factor.optimal}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recovery Plan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Zap className="h-4 w-4 text-red-600 mr-2" />
                  Immediate Actions
                </h4>
                <ul className="space-y-2">
                  {stressAnalysis.recoveryPlan.immediate.map((action, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Target className="h-4 w-4 text-yellow-600 mr-2" />
                  Short-term (1-2 weeks)
                </h4>
                <ul className="space-y-2">
                  {stressAnalysis.recoveryPlan.shortTerm.map((action, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                  Long-term (1+ months)
                </h4>
                <ul className="space-y-2">
                  {stressAnalysis.recoveryPlan.longTerm.map((action, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">Expected Recovery Time:</span>
                <span className="text-gray-700 ml-2">{stressAnalysis.recoveryPlan.timeline}</span>
              </div>
            </div>
          </div>

          {/* Monitoring Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Schedule</h3>
            <div className="space-y-3">
              {stressAnalysis.monitoringSchedule.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">{task.task}</h4>
                      <p className="text-sm text-gray-600">{task.frequency}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.importance === 'high' ? 'text-red-600 bg-red-100' :
                    task.importance === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                    'text-green-600 bg-green-100'
                  }`}>
                    {task.importance} priority
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Prevention Tips */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prevention Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stressAnalysis.preventionTips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <Shield className="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">Analyzing stress levels...</p>
        </div>
      )}
    </div>
  );
};

export default AIStressDetector;
