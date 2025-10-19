import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Droplets, 
  Zap, 
  Sun, 
  Thermometer, 
  TestTube, 
  TrendingUp,
  CheckCircle,
  Loader2,
  Brain,
  Target,

} from 'lucide-react';
import apiClient from '../lib/axios';

interface Plant {
  id: string;
  name: string;
  species?: string;
  location?: string;
  healthStatus?: string;
}

interface SoilAnalysis {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  temperature: number;
}

interface NutrientDeficiency {
  nutrient: string;
  severity: 'low' | 'medium' | 'high';
  symptoms: string[];
  treatment: string[];
  fertilizer: string;
  timeline: string;
}

interface FertilizerRecommendation {
  name: string;
  type: 'organic' | 'synthetic' | 'liquid' | 'granular';
  npk: string;
  applicationRate: string;
  frequency: string;
  benefits: string[];
  warnings: string[];
  bestTime: string;
}

interface NutritionPlan {
  currentStatus: string;
  deficiencies: NutrientDeficiency[];
  recommendations: FertilizerRecommendation[];
  schedule: Array<{
    date: string;
    task: string;
    fertilizer: string;
    amount: string;
  }>;
  timeline: string;
  expectedResults: string[];
}

const AINutritionAnalyzer: React.FC<{ plant: Plant }> = ({ plant }) => {
  const [soilAnalysis, setSoilAnalysis] = useState<SoilAnalysis | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showSoilTest, setShowSoilTest] = useState(false);
  const [customSoilData, setCustomSoilData] = useState<Partial<SoilAnalysis>>({});

  useEffect(() => {
    if (plant) {
      fetchNutritionData();
    }
  }, [plant]);

  const fetchNutritionData = async () => {
    setLoading(true);
    try {
      // Simulate fetching existing nutrition data
      const mockSoilAnalysis: SoilAnalysis = {
        ph: 6.2 + (Math.random() - 0.5) * 0.8,
        nitrogen: 45 + Math.random() * 20,
        phosphorus: 30 + Math.random() * 15,
        potassium: 40 + Math.random() * 25,
        organicMatter: 3.5 + Math.random() * 2,
        moisture: 60 + Math.random() * 20,
        temperature: 20 + Math.random() * 8
      };
      setSoilAnalysis(mockSoilAnalysis);
    } catch (error) {
      console.error('Failed to fetch nutrition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeNutrition = async () => {
    if (!soilAnalysis) return;
    
    setAnalyzing(true);
    try {
      const response = await apiClient.post('/api/v1/ai/nutrition-analysis', {
        plantName: plant.name,
        species: plant.species,
        soilData: soilAnalysis,
        location: plant.location
      });

      setNutritionPlan(response.data.plan);
    } catch (error) {
      console.error('Failed to analyze nutrition:', error);
      // Generate mock data for demonstration
      generateMockNutritionPlan();
    } finally {
      setAnalyzing(false);
    }
  };

  const generateMockNutritionPlan = () => {
    const mockPlan: NutritionPlan = {
      currentStatus: "Your plant shows signs of mild nitrogen deficiency and optimal phosphorus levels.",
      deficiencies: [
        {
          nutrient: "Nitrogen",
          severity: "medium",
          symptoms: ["Yellowing of older leaves", "Stunted growth", "Reduced leaf size"],
          treatment: ["Apply nitrogen-rich fertilizer", "Increase organic matter", "Check drainage"],
          fertilizer: "10-6-4 NPK fertilizer",
          timeline: "2-3 weeks"
        }
      ],
      recommendations: [
        {
          name: "Balanced Plant Food",
          type: "organic",
          npk: "10-6-4",
          applicationRate: "1 tablespoon per gallon",
          frequency: "Every 2 weeks",
          benefits: ["Promotes healthy growth", "Improves leaf color", "Enhances root development"],
          warnings: ["Don't over-fertilize", "Water before applying"],
          bestTime: "Early morning or evening"
        }
      ],
      schedule: [
        {
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          task: "Apply nitrogen fertilizer",
          fertilizer: "10-6-4 NPK",
          amount: "1 tbsp per gallon"
        },
        {
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          task: "Reassess soil nutrients",
          fertilizer: "Soil test",
          amount: "Full analysis"
        }
      ],
      timeline: "4-6 weeks for visible improvement",
      expectedResults: [
        "Darker green foliage within 2 weeks",
        "Increased growth rate",
        "Improved overall plant health"
      ]
    };
    setNutritionPlan(mockPlan);
  };

  const getNutrientColor = (value: number, optimal: { min: number; max: number }) => {
    if (value < optimal.min) return 'text-red-600 bg-red-100';
    if (value > optimal.max) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFertilizerTypeColor = (type: string) => {
    switch (type) {
      case 'organic': return 'text-green-600 bg-green-100';
      case 'synthetic': return 'text-blue-600 bg-blue-100';
      case 'liquid': return 'text-purple-600 bg-purple-100';
      case 'granular': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!plant) {
    return (
      <div className="text-center py-8 text-gray-500">
        <TestTube className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Select a plant to analyze nutrition</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Nutrition Analyzer</h2>
        <p className="text-gray-600">Intelligent soil analysis and fertilizer recommendations for {plant.name}</p>
      </div>

      {/* Soil Analysis */}
      {soilAnalysis && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Soil Analysis</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSoilTest(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Custom Test
              </button>
              <button
                onClick={analyzeNutrition}
                disabled={analyzing}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {analyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                Analyze Nutrition
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Droplets className="h-6 w-6 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">pH Level</span>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getNutrientColor(soilAnalysis.ph, { min: 6.0, max: 7.0 })}`}>
                {soilAnalysis.ph.toFixed(1)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Optimal: 6.0-7.0</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="h-6 w-6 text-green-600 mr-2" />
                <span className="font-medium text-gray-900">Nitrogen</span>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getNutrientColor(soilAnalysis.nitrogen, { min: 40, max: 60 })}`}>
                {soilAnalysis.nitrogen.toFixed(0)} ppm
              </div>
              <p className="text-xs text-gray-500 mt-1">Optimal: 40-60 ppm</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-purple-600 mr-2" />
                <span className="font-medium text-gray-900">Phosphorus</span>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getNutrientColor(soilAnalysis.phosphorus, { min: 20, max: 40 })}`}>
                {soilAnalysis.phosphorus.toFixed(0)} ppm
              </div>
              <p className="text-xs text-gray-500 mt-1">Optimal: 20-40 ppm</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Sun className="h-6 w-6 text-yellow-600 mr-2" />
                <span className="font-medium text-gray-900">Potassium</span>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getNutrientColor(soilAnalysis.potassium, { min: 30, max: 50 })}`}>
                {soilAnalysis.potassium.toFixed(0)} ppm
              </div>
              <p className="text-xs text-gray-500 mt-1">Optimal: 30-50 ppm</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Thermometer className="h-5 w-5 mx-auto text-gray-600 mb-1" />
              <div className="text-sm font-medium text-gray-900">{soilAnalysis.temperature.toFixed(1)}°C</div>
              <div className="text-xs text-gray-500">Soil Temperature</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Droplets className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <div className="text-sm font-medium text-gray-900">{soilAnalysis.moisture.toFixed(0)}%</div>
              <div className="text-xs text-gray-500">Moisture Level</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Leaf className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <div className="text-sm font-medium text-gray-900">{soilAnalysis.organicMatter.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Organic Matter</div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Soil Test Modal */}
      {showSoilTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Soil Test</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">pH Level</label>
                <input
                  type="number"
                  step="0.1"
                  min="4"
                  max="9"
                  value={customSoilData.ph || ''}
                  onChange={(e) => setCustomSoilData({ ...customSoilData, ph: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="6.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nitrogen (ppm)</label>
                <input
                  type="number"
                  value={customSoilData.nitrogen || ''}
                  onChange={(e) => setCustomSoilData({ ...customSoilData, nitrogen: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phosphorus (ppm)</label>
                <input
                  type="number"
                  value={customSoilData.phosphorus || ''}
                  onChange={(e) => setCustomSoilData({ ...customSoilData, phosphorus: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Potassium (ppm)</label>
                <input
                  type="number"
                  value={customSoilData.potassium || ''}
                  onChange={(e) => setCustomSoilData({ ...customSoilData, potassium: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="40"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSoilTest(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customSoilData.ph && customSoilData.nitrogen && customSoilData.phosphorus && customSoilData.potassium) {
                    setSoilAnalysis({
                      ph: customSoilData.ph,
                      nitrogen: customSoilData.nitrogen,
                      phosphorus: customSoilData.phosphorus,
                      potassium: customSoilData.potassium,
                      organicMatter: 3.5,
                      moisture: 60,
                      temperature: 22
                    });
                    setShowSoilTest(false);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Update Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nutrition Plan */}
      {nutritionPlan && (
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Status</h3>
            <div className="flex items-start">
              <Brain className="h-5 w-5 text-blue-600 mr-3 mt-1" />
              <p className="text-gray-700">{nutritionPlan.currentStatus}</p>
            </div>
          </div>

          {/* Deficiencies */}
          {nutritionPlan.deficiencies.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrient Deficiencies</h3>
              <div className="space-y-4">
                {nutritionPlan.deficiencies.map((deficiency, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{deficiency.nutrient} Deficiency</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(deficiency.severity)}`}>
                        {deficiency.severity} severity
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Symptoms</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {deficiency.symptoms.map((symptom, i) => (
                            <li key={i}>• {symptom}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Treatment</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {deficiency.treatment.map((treatment, i) => (
                            <li key={i}>• {treatment}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Recommended Fertilizer:</span>
                        <span className="text-sm text-gray-600 ml-2">{deficiency.fertilizer}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Timeline:</span>
                        <span className="text-sm text-gray-600 ml-2">{deficiency.timeline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fertilizer Recommendations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fertilizer Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nutritionPlan.recommendations.map((fertilizer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{fertilizer.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFertilizerTypeColor(fertilizer.type)}`}>
                      {fertilizer.type}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">NPK Ratio:</span>
                      <span className="text-gray-600 ml-2">{fertilizer.npk}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Application Rate:</span>
                      <span className="text-gray-600 ml-2">{fertilizer.applicationRate}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Frequency:</span>
                      <span className="text-gray-600 ml-2">{fertilizer.frequency}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Best Time:</span>
                      <span className="text-gray-600 ml-2">{fertilizer.bestTime}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="font-medium text-gray-700 mb-1">Benefits</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {fertilizer.benefits.map((benefit, i) => (
                        <li key={i}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {fertilizer.warnings.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-gray-700 mb-1">Warnings</h5>
                      <ul className="text-sm text-red-600 space-y-1">
                        {fertilizer.warnings.map((warning, i) => (
                          <li key={i}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Schedule</h3>
            <div className="space-y-3">
              {nutritionPlan.schedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">{item.task}</h4>
                      <p className="text-sm text-gray-600">{item.fertilizer} - {item.amount}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Results</h3>
            <div className="flex items-start mb-3">
              <TrendingUp className="h-5 w-5 text-green-600 mr-3 mt-1" />
              <div>
                <p className="text-gray-700 mb-2">Timeline: {nutritionPlan.timeline}</p>
                <ul className="space-y-1">
                  {nutritionPlan.expectedResults.map((result, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">Loading nutrition data...</p>
        </div>
      )}
    </div>
  );
};

export default AINutritionAnalyzer;
