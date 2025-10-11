import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Camera,
  Upload,
  X,
  Heart,
  Droplets,
  Sun,
  Thermometer,
  Wind
} from 'lucide-react';
import apiClient from '../lib/axios';

interface Plant {
  id: string;
  name: string;
  species?: string;
  healthStatus?: string;
  images?: Array<{ imageUrl: string }>;
}

interface HealthAssessment {
  is_healthy: {
    binary: boolean;
    probability: number;
  };
  diseases: Array<{
    name: string;
    probability: number;
    similar_images: Array<{ url: string }>;
  }>;
  disease_suggestions: Array<{
    name: string;
    probability: number;
    similar_images: Array<{ url: string }>;
  }>;
}

interface DiseaseInfo {
  name: string;
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high';
}

interface EnvironmentalData {
  temperature?: number;
  humidity?: number;
  lightLevel?: string;
  airCirculation?: string;
}

const EnhancedHealthAssessment: React.FC<{ plant: Plant }> = ({ plant }) => {
  const [healthAssessment, setHealthAssessment] = useState<HealthAssessment | null>(null);
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>(['']);
  const [showDiseaseDiagnosis, setShowDiseaseDiagnosis] = useState(false);

  useEffect(() => {
    if (plant) {
      fetchHealthAssessment();
      fetchEnvironmentalData();
    }
  }, [plant]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchHealthAssessment = async () => {
    if (!plant || !plant.images || plant.images.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post(`/api/v1/plants/${plant.id}/health-check`);
      setHealthAssessment(response.data.result);
    } catch (err: unknown) {
      console.error('Health assessment error:', err);
      setError('Failed to assess plant health. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnvironmentalData = async () => {
    // Simulate environmental data - in a real app, this would come from sensors
    setEnvironmentalData({
      temperature: 22 + Math.random() * 6, // 22-28°C
      humidity: 45 + Math.random() * 20, // 45-65%
      lightLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      airCirculation: ['Poor', 'Good', 'Excellent'][Math.floor(Math.random() * 3)]
    });
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

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
  };

  const assessWithNewImage = async () => {
    if (!uploadedImage) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the health assessment endpoint with the new image
      const base64 = await fileToBase64(uploadedImage);
      const healthResponse = await apiClient.post('/api/v1/plants/health-assessment', {
        image: base64,
        plantName: plant.name,
      });
      
      setHealthAssessment(healthResponse.data.result);
      setShowImageUpload(false);
    } catch (err: unknown) {
      console.error('Image assessment error:', err);
      setError('Failed to assess image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  };

  const diagnoseDisease = async () => {
    if (symptoms.every(s => !s.trim())) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/api/v1/ai/disease-diagnosis', {
        symptoms: symptoms.filter(s => s.trim()),
        plantName: plant.name
      });
      setDiseaseInfo(response.data.diseases);
    } catch (err: unknown) {
      console.error('Disease diagnosis error:', err);
      setError('Failed to diagnose disease. Please try again.');
    } finally {
      setLoading(false);
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

  const getHealthStatusColor = (isHealthy: boolean, probability: number) => {
    if (isHealthy) {
      return probability > 0.8 ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';
    } else {
      return 'text-red-600 bg-red-100';
    }
  };

  const getHealthStatusText = (isHealthy: boolean, probability: number) => {
    if (isHealthy) {
      return probability > 0.8 ? 'Excellent Health' : 'Good Health';
    } else {
      return 'Health Issues Detected';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!plant) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Stethoscope className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Select a plant to view health assessment</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Assessment</h2>
        <p className="text-gray-600">AI-powered health analysis for {plant.name}</p>
      </div>

      {/* Health Status Overview */}
      {healthAssessment && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Health Status</h3>
            <button
              onClick={fetchHealthAssessment}
              disabled={loading}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Stethoscope className="h-4 w-4 mr-1" />}
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getHealthStatusColor(healthAssessment.is_healthy.binary, healthAssessment.is_healthy.probability)}`}>
                {healthAssessment.is_healthy.binary ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mr-2" />
                )}
                {getHealthStatusText(healthAssessment.is_healthy.binary, healthAssessment.is_healthy.probability)}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Confidence: {Math.round(healthAssessment.is_healthy.probability * 100)}%
              </p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {healthAssessment.diseases.length}
              </div>
              <p className="text-sm text-gray-600">Diseases Detected</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {healthAssessment.disease_suggestions.length}
              </div>
              <p className="text-sm text-gray-600">Potential Issues</p>
            </div>
          </div>
        </div>
      )}

      {/* Environmental Conditions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Conditions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Thermometer className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <div className="text-lg font-semibold text-gray-900">
              {environmentalData.temperature?.toFixed(1)}°C
            </div>
            <p className="text-sm text-gray-600">Temperature</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Droplets className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <div className="text-lg font-semibold text-gray-900">
              {environmentalData.humidity?.toFixed(0)}%
            </div>
            <p className="text-sm text-gray-600">Humidity</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Sun className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
            <div className="text-lg font-semibold text-gray-900">
              {environmentalData.lightLevel}
            </div>
            <p className="text-sm text-gray-600">Light Level</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Wind className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <div className="text-lg font-semibold text-gray-900">
              {environmentalData.airCirculation}
            </div>
            <p className="text-sm text-gray-600">Air Circulation</p>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload New Image for Assessment</h3>
          <button
            onClick={() => setShowImageUpload(!showImageUpload)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <Camera className="h-4 w-4 mr-2" />
            {showImageUpload ? 'Cancel' : 'Upload Image'}
          </button>
        </div>

        {showImageUpload && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {!imagePreview ? (
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
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
                    onClick={removeUploadedImage}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={assessWithNewImage}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Stethoscope className="h-4 w-4 mr-2" />
                  )}
                  Assess Image
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Disease Detection */}
      {healthAssessment && healthAssessment.diseases.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Diseases</h3>
          <div className="space-y-4">
            {healthAssessment.diseases.map((disease, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{disease.name}</h4>
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                    {Math.round(disease.probability * 100)}% confidence
                  </span>
                </div>
                {disease.similar_images.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {disease.similar_images.slice(0, 3).map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img.url}
                        alt="Similar disease"
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Disease Diagnosis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Disease Diagnosis</h3>
          <button
            onClick={() => setShowDiseaseDiagnosis(!showDiseaseDiagnosis)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
          >
            <Heart className="h-4 w-4 mr-2" />
            {showDiseaseDiagnosis ? 'Hide' : 'Diagnose'}
          </button>
        </div>

        {showDiseaseDiagnosis && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the symptoms you observe:
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
                      <X className="h-4 w-4" />
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
              disabled={loading || symptoms.every(s => !s.trim())}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Heart className="h-4 w-4 mr-2" />
              )}
              Diagnose Disease
            </button>

            {diseaseInfo.length > 0 && (
              <div className="mt-6 space-y-4">
                {diseaseInfo.map((disease, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-medium text-gray-900">{disease.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(disease.severity)}`}>
                        {disease.severity} severity
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Symptoms</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {disease.symptoms.map((symptom, i) => (
                            <li key={i}>• {symptom}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Treatment</h5>
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
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">Analyzing plant health...</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedHealthAssessment;
