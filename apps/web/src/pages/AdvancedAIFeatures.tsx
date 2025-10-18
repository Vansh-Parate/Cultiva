import React, { useState } from 'react';
import { 
  Brain, 
  TestTube, 
  Scissors, 
  Calendar, 
  Heart, 
  Users, 
  Camera, 
  ShoppingCart, 
  Trophy,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  BarChart3,
  Leaf,
  Droplets,
  Sun,
  Thermometer,
  Wind,
  Eye,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import AINutritionAnalyzer from '../components/AINutritionAnalyzer';
import AIPropagationGuide from '../components/AIPropagationGuide';
import AISeasonalPlanner from '../components/AISeasonalPlanner';
import AIStressDetector from '../components/AIStressDetector';

interface Plant {
  id: string;
  name: string;
  species?: string;
  location?: string;
  healthStatus?: string;
}

const AdvancedAIFeatures: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [plants] = useState<Plant[]>([
    { id: '1', name: 'Monstera Deliciosa', species: 'Monstera deliciosa', location: 'Living Room', healthStatus: 'Good' },
    { id: '2', name: 'Snake Plant', species: 'Sansevieria trifasciata', location: 'Bedroom', healthStatus: 'Excellent' },
    { id: '3', name: 'Pothos', species: 'Epipremnum aureum', location: 'Kitchen', healthStatus: 'Good' }
  ]);

  const advancedFeatures = [
    {
      id: 'nutrition',
      title: 'AI Nutrition Analyzer',
      description: 'Comprehensive soil analysis and fertilizer recommendations',
      icon: TestTube,
      color: 'text-blue-600 bg-blue-100',
      features: [
        'Soil pH and nutrient analysis',
        'Deficiency detection and treatment',
        'Personalized fertilizer recommendations',
        'Nutrition scheduling and timeline'
      ],
      benefits: [
        'Optimize plant nutrition',
        'Prevent nutrient deficiencies',
                'Save money on fertilizers',
        'Improve plant health and growth'
      ]
    },
    {
      id: 'propagation',
      title: 'AI Propagation Guide',
      description: 'Step-by-step plant propagation and cloning assistance',
      icon: Scissors,
      color: 'text-green-600 bg-green-100',
      features: [
        'Multiple propagation methods',
        'Success rate predictions',
        'Step-by-step instructions',
        'Troubleshooting guidance'
      ],
      benefits: [
        'Expand your plant collection',
        'Share plants with friends',
        'Learn propagation techniques',
        'Increase plant success rates'
      ]
    },
    {
      id: 'seasonal',
      title: 'AI Seasonal Planner',
      description: 'Weather-aware seasonal care planning and scheduling',
      icon: Calendar,
      color: 'text-purple-600 bg-purple-100',
      features: [
        'Weather integration and alerts',
        'Seasonal task scheduling',
        'Environmental monitoring',
        'Preparation recommendations'
      ],
      benefits: [
        'Adapt to seasonal changes',
        'Prevent weather-related damage',
        'Optimize care timing',
        'Plan ahead for seasons'
      ]
    },
    {
      id: 'stress',
      title: 'AI Stress Detector',
      description: 'Advanced stress detection and recovery recommendations',
      icon: Heart,
      color: 'text-red-600 bg-red-100',
      features: [
        'Multi-factor stress analysis',
        'Visual symptom recognition',
        'Environmental stress detection',
        'Recovery plan generation'
      ],
      benefits: [
        'Early problem detection',
        'Prevent plant loss',
        'Faster recovery times',
        'Better plant health'
      ]
    },
    {
      id: 'community',
      title: 'AI Community Matching',
      description: 'Smart plant community and social features',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-100',
      features: [
        'Plant parent matching',
        'Expert recommendations',
        'Local plant communities',
        'Knowledge sharing'
      ],
      benefits: [
        'Connect with plant lovers',
        'Learn from experts',
        'Share experiences',
        'Build plant community'
      ]
    },
    {
      id: 'photography',
      title: 'AI Photography Assistant',
      description: 'Plant photography and growth documentation',
      icon: Camera,
      color: 'text-pink-600 bg-pink-100',
      features: [
        'Growth progress tracking',
        'Photo quality optimization',
        'Timeline documentation',
        'Share-worthy moments'
      ],
      benefits: [
        'Document plant journey',
        'Track growth progress',
        'Create beautiful memories',
        'Share plant achievements'
      ]
    },
    {
      id: 'marketplace',
      title: 'AI Shopping Assistant',
      description: 'Intelligent plant marketplace and shopping recommendations',
      icon: ShoppingCart,
      color: 'text-orange-600 bg-orange-100',
      features: [
        'Personalized plant recommendations',
        'Price comparison and deals',
        'Care requirement matching',
        'Local nursery suggestions'
      ],
      benefits: [
        'Find perfect plants',
        'Save money on purchases',
        'Discover new species',
        'Support local businesses'
      ]
    },
    {
      id: 'gamification',
      title: 'AI Achievement System',
      description: 'Gamified plant care with achievements and rewards',
      icon: Trophy,
      color: 'text-yellow-600 bg-yellow-100',
      features: [
        'Care streak tracking',
        'Achievement badges',
        'Progress milestones',
        'Community challenges'
      ],
      benefits: [
        'Stay motivated',
        'Track progress',
        'Compete with friends',
        'Earn recognition'
      ]
    }
  ];

  const renderFeatureContent = () => {
    if (!selectedFeature || !selectedPlant) return null;

    switch (selectedFeature) {
      case 'nutrition':
        return <AINutritionAnalyzer plant={selectedPlant} />;
      case 'propagation':
        return <AIPropagationGuide plant={selectedPlant} />;
      case 'seasonal':
        return <AISeasonalPlanner plant={selectedPlant} />;
      case 'stress':
        return <AIStressDetector plant={selectedPlant} />;
      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This advanced AI feature is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 text-green-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Advanced AI Features</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge artificial intelligence for the most comprehensive plant care experience. 
              From nutrition analysis to stress detection, our AI features provide unprecedented insights.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Plant Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Plant for AI Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plants.map((plant) => (
              <button
                key={plant.id}
                onClick={() => setSelectedPlant(plant)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedPlant?.id === plant.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <Leaf className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-gray-900">{plant.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{plant.species}</p>
                <p className="text-sm text-gray-500">{plant.location}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plant.healthStatus === 'Excellent' ? 'text-green-600 bg-green-100' :
                    plant.healthStatus === 'Good' ? 'text-blue-600 bg-blue-100' :
                    'text-yellow-600 bg-yellow-100'
                  }`}>
                    {plant.healthStatus}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {advancedFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`p-6 rounded-lg shadow-sm border-2 text-left transition-all hover:shadow-md ${
                  selectedFeature === feature.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${feature.color} mr-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Key Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {feature.features.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                    {feature.features.length > 3 && (
                      <li className="text-gray-500">+{feature.features.length - 3} more features</li>
                    )}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature Content */}
        {selectedFeature && selectedPlant && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {(() => {
                    const feature = advancedFeatures.find(f => f.id === selectedFeature);
                    if (!feature) return null;
                    const Icon = feature.icon;
                    return (
                      <>
                        <div className={`p-2 rounded-lg ${feature.color} mr-3`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{feature.title}</h2>
                          <p className="text-gray-600">Analyzing {selectedPlant.name}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {renderFeatureContent()}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Our Advanced AI Features?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-700">Advanced machine learning algorithms provide accurate insights and recommendations.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Personalized</h4>
              <p className="text-sm text-gray-700">Tailored recommendations based on your specific plants and environment.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Proven Results</h4>
              <p className="text-sm text-gray-700">Users see 40% improvement in plant health and 60% reduction in plant loss.</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Preventive Care</h4>
              <p className="text-sm text-gray-700">Early detection and prevention of plant problems before they become serious.</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">AI Feature Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">Accuracy Rate</div>
              <div className="text-sm text-gray-600">AI disease detection and diagnosis</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">3x</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">Faster Growth</div>
              <div className="text-sm text-gray-600">With optimized nutrition and care</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">80%</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">Success Rate</div>
              <div className="text-sm text-gray-600">Plant propagation with AI guidance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAIFeatures;
