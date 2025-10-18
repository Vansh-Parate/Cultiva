import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Droplets, 
  Sun, 
  Thermometer, 
  Clock, 
  Target,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Brain,
  Leaf,
  Zap,
  Calendar,
  Lightbulb,
  BookOpen,
  Camera
} from 'lucide-react';
import apiClient from '../lib/axios';

interface Plant {
  id: string;
  name: string;
  species?: string;
  location?: string;
  healthStatus?: string;
}

interface PropagationMethod {
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  successRate: number;
  timeToRoot: string;
  bestSeason: string;
  description: string;
  steps: Array<{
    step: number;
    title: string;
    description: string;
    duration: string;
    tips: string[];
  }>;
  materials: string[];
  careInstructions: {
    light: string;
    water: string;
    temperature: string;
    humidity: string;
  };
  troubleshooting: Array<{
    problem: string;
    cause: string;
    solution: string;
  }>;
}

interface PropagationPlan {
  plantName: string;
  recommendedMethod: PropagationMethod;
  alternativeMethods: PropagationMethod[];
  timeline: Array<{
    week: number;
    tasks: string[];
    milestones: string[];
  }>;
  successFactors: string[];
  commonMistakes: string[];
  expectedResults: {
    rootingTime: string;
    successRate: string;
    careLevel: string;
  };
}

const AIPropagationGuide: React.FC<{ plant: Plant }> = ({ plant }) => {
  const [propagationPlan, setPropagationPlan] = useState<PropagationPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PropagationMethod | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  useEffect(() => {
    if (plant) {
      generatePropagationPlan();
    }
  }, [plant]);

  const generatePropagationPlan = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/ai/propagation-guide', {
        plantName: plant.name,
        species: plant.species,
        currentHealth: plant.healthStatus
      });

      setPropagationPlan(response.data.plan);
      setSelectedMethod(response.data.plan.recommendedMethod);
    } catch (error) {
      console.error('Failed to generate propagation plan:', error);
      // Generate mock data for demonstration
      generateMockPropagationPlan();
    } finally {
      setLoading(false);
    }
  };

  const generateMockPropagationPlan = () => {
    const mockPlan: PropagationPlan = {
      plantName: plant.name,
      recommendedMethod: {
        name: "Stem Cutting",
        difficulty: "easy",
        successRate: 85,
        timeToRoot: "2-4 weeks",
        bestSeason: "Spring/Summer",
        description: "Cut a healthy stem section and root it in water or soil",
        steps: [
          {
            step: 1,
            title: "Select Cutting",
            description: "Choose a healthy stem with 2-3 nodes and no flowers",
            duration: "5 minutes",
            tips: ["Use sharp, clean scissors", "Cut at 45-degree angle", "Choose morning for best results"]
          },
          {
            step: 2,
            title: "Prepare Cutting",
            description: "Remove lower leaves and dip in rooting hormone",
            duration: "10 minutes",
            tips: ["Remove leaves that would be underwater", "Use clean, sharp knife", "Apply hormone to cut end"]
          },
          {
            step: 3,
            title: "Rooting Medium",
            description: "Place in water or well-draining soil mix",
            duration: "5 minutes",
            tips: ["Change water every 3-4 days", "Keep soil moist but not wet", "Use clear container for water method"]
          },
          {
            step: 4,
            title: "Care & Monitor",
            description: "Provide bright, indirect light and maintain humidity",
            duration: "Ongoing",
            tips: ["Check for roots weekly", "Mist leaves daily", "Avoid direct sunlight"]
          }
        ],
        materials: [
          "Sharp scissors or knife",
          "Rooting hormone",
          "Clean water or potting mix",
          "Small pot or container",
          "Plastic bag or humidity dome"
        ],
        careInstructions: {
          light: "Bright, indirect light (avoid direct sun)",
          water: "Keep medium moist, change water every 3-4 days",
          temperature: "70-75°F (21-24°C)",
          humidity: "High humidity (60-80%)"
        },
        troubleshooting: [
          {
            problem: "Cutting wilts quickly",
            cause: "Too much water or insufficient humidity",
            solution: "Reduce watering and increase humidity with plastic bag"
          },
          {
            problem: "No roots after 4 weeks",
            cause: "Insufficient light or wrong season",
            solution: "Move to brighter location and try in spring/summer"
          },
          {
            problem: "Leaves turn yellow",
            cause: "Overwatering or nutrient deficiency",
            solution: "Reduce watering frequency and check drainage"
          }
        ]
      },
      alternativeMethods: [
        {
          name: "Leaf Cutting",
          difficulty: "medium",
          successRate: 70,
          timeToRoot: "3-6 weeks",
          bestSeason: "Spring",
          description: "Root individual leaves to create new plants",
          steps: [],
          materials: [],
          careInstructions: {
            light: "Bright, indirect light",
            water: "Light misting",
            temperature: "70-75°F",
            humidity: "High humidity"
          },
          troubleshooting: []
        }
      ],
      timeline: [
        {
          week: 1,
          tasks: ["Take cuttings", "Prepare rooting medium", "Set up propagation station"],
          milestones: ["Cuttings taken", "Setup complete"]
        },
        {
          week: 2,
          tasks: ["Monitor for signs of stress", "Check humidity levels", "Adjust lighting if needed"],
          milestones: ["Cuttings stable", "No wilting observed"]
        },
        {
          week: 3,
          tasks: ["Check for root development", "Change water if using water method", "Begin reducing humidity"],
          milestones: ["First roots visible", "New growth emerging"]
        },
        {
          week: 4,
          tasks: ["Transplant rooted cuttings", "Begin normal care routine", "Monitor for pests"],
          milestones: ["Roots 1-2 inches long", "Ready for transplant"]
        }
      ],
      successFactors: [
        "Use healthy parent plant",
        "Take cuttings in morning",
        "Maintain consistent humidity",
        "Provide adequate light",
        "Use clean, sharp tools"
      ],
      commonMistakes: [
        "Taking cuttings from unhealthy plants",
        "Overwatering during rooting",
        "Insufficient humidity",
        "Too much direct sunlight",
        "Not changing water regularly"
      ],
      expectedResults: {
        rootingTime: "2-4 weeks",
        successRate: "85%",
        careLevel: "Easy to moderate"
      }
    };
    setPropagationPlan(mockPlan);
    setSelectedMethod(mockPlan.recommendedMethod);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!plant) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Scissors className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Select a plant to view propagation guide</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Generating propagation guide...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Propagation Guide</h2>
        <p className="text-gray-600">Step-by-step propagation instructions for {plant.name}</p>
      </div>

      {propagationPlan && (
        <div className="space-y-6">
          {/* Method Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Propagation Methods</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recommended Method */}
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{propagationPlan.recommendedMethod.name}</h4>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Recommended</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(propagationPlan.recommendedMethod.difficulty)}`}>
                      {propagationPlan.recommendedMethod.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className={`font-medium ${getSuccessRateColor(propagationPlan.recommendedMethod.successRate)}`}>
                      {propagationPlan.recommendedMethod.successRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time to Root:</span>
                    <span className="text-gray-900">{propagationPlan.recommendedMethod.timeToRoot}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Best Season:</span>
                    <span className="text-gray-900">{propagationPlan.recommendedMethod.bestSeason}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">{propagationPlan.recommendedMethod.description}</p>
                <button
                  onClick={() => setSelectedMethod(propagationPlan.recommendedMethod)}
                  className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Use This Method
                </button>
              </div>

              {/* Alternative Methods */}
              {propagationPlan.alternativeMethods.map((method, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{method.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(method.difficulty)}`}>
                        {method.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className={`font-medium ${getSuccessRateColor(method.successRate)}`}>
                        {method.successRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Time to Root:</span>
                      <span className="text-gray-900">{method.timeToRoot}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMethod(method)}
                    className="w-full mt-3 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Try This Method
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Guide */}
          {selectedMethod && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{selectedMethod.name} Guide</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentStep(Math.min(selectedMethod.steps.length - 1, currentStep + 1))}
                    disabled={currentStep === selectedMethod.steps.length - 1}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              {selectedMethod.steps[currentStep] && (
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3">
                      {selectedMethod.steps[currentStep].step}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{selectedMethod.steps[currentStep].title}</h4>
                      <p className="text-sm text-gray-600">{selectedMethod.steps[currentStep].duration}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{selectedMethod.steps[currentStep].description}</p>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Pro Tips
                    </h5>
                    <ul className="space-y-1">
                      {selectedMethod.steps[currentStep].tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Step Progress */}
              <div className="flex space-x-2">
                {selectedMethod.steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      index === currentStep
                        ? 'bg-green-600 text-white'
                        : index < currentStep
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Materials & Care Instructions */}
          {selectedMethod && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Materials */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Materials</h3>
                <ul className="space-y-2">
                  {selectedMethod.materials.map((material, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {material}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Care Instructions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Instructions</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 text-yellow-600 mr-3" />
                    <div>
                      <span className="font-medium text-gray-700">Light:</span>
                      <span className="text-gray-600 ml-2">{selectedMethod.careInstructions.light}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 text-blue-600 mr-3" />
                    <div>
                      <span className="font-medium text-gray-700">Water:</span>
                      <span className="text-gray-600 ml-2">{selectedMethod.careInstructions.water}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 text-red-600 mr-3" />
                    <div>
                      <span className="font-medium text-gray-700">Temperature:</span>
                      <span className="text-gray-600 ml-2">{selectedMethod.careInstructions.temperature}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-purple-600 mr-3" />
                    <div>
                      <span className="font-medium text-gray-700">Humidity:</span>
                      <span className="text-gray-600 ml-2">{selectedMethod.careInstructions.humidity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Propagation Timeline</h3>
            <div className="space-y-4">
              {propagationPlan.timeline.map((week, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    W{week.week}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">Week {week.week}</h4>
                    <div className="space-y-2">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Tasks:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {week.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Milestones:</h5>
                        <ul className="text-sm text-green-600 space-y-1">
                          {week.milestones.map((milestone, milestoneIndex) => (
                            <li key={milestoneIndex} className="flex items-start">
                              <CheckCircle className="h-3 w-3 mr-2 mt-1 flex-shrink-0" />
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Troubleshooting</h3>
              <button
                onClick={() => setShowTroubleshooting(!showTroubleshooting)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                {showTroubleshooting ? 'Hide' : 'Show'} Troubleshooting
              </button>
            </div>

            {showTroubleshooting && selectedMethod.troubleshooting.length > 0 && (
              <div className="space-y-4">
                {selectedMethod.troubleshooting.map((issue, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{issue.problem}</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Cause:</span>
                            <span className="text-gray-600 ml-2">{issue.cause}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Solution:</span>
                            <span className="text-gray-600 ml-2">{issue.solution}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Success Factors & Common Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Factors</h3>
              <ul className="space-y-2">
                {propagationPlan.successFactors.map((factor, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Mistakes</h3>
              <ul className="space-y-2">
                {propagationPlan.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Expected Results */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{propagationPlan.expectedResults.rootingTime}</div>
                <div className="text-sm text-gray-600">Rooting Time</div>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{propagationPlan.expectedResults.successRate}</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <Leaf className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{propagationPlan.expectedResults.careLevel}</div>
                <div className="text-sm text-gray-600">Care Level</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPropagationGuide;
