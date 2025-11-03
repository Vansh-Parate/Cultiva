import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Camera,
  Stethoscope,
  TrendingUp,
  MessageCircle,
  Lightbulb,
  Target
} from 'lucide-react';
import AICareDashboard from '../components/AICareDashboard';
import AIAnalyticsDashboard from '../components/AIAnalyticsDashboard';

const AIFeatures: React.FC = () => {
  const features = [
    {
      icon: Camera,
      title: "AI Plant Identification",
      description: "Identify thousands of plant species with high accuracy using advanced computer vision",
      status: "Active",
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: Stethoscope,
      title: "Health Assessment & Disease Diagnosis",
      description: "Get instant health analysis, disease detection, and AI-powered treatment recommendations",
      status: "Active",
      color: "text-red-600 bg-red-100"
    },
    {
      icon: Lightbulb,
      title: "Smart Care Recommendations",
      description: "Personalized care advice based on species, location, season, and environmental optimization",
      status: "Active",
      color: "text-green-600 bg-green-100"
    },
    {
      icon: TrendingUp,
      title: "Growth Prediction",
      description: "Predict plant growth trajectory and milestones based on current conditions",
      status: "Active",
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: MessageCircle,
      title: "AI Plant Assistant",
      description: "Chat with an intelligent assistant for instant plant care answers",
      status: "Active",
      color: "text-teal-600 bg-teal-100"
    },
    {
      icon: Target,
      title: "Care Analytics Dashboard",
      description: "Comprehensive insights into your plant care performance and trends",
      status: "Active",
      color: "text-indigo-600 bg-indigo-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 text-green-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">AI-Powered Plant Care</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Harness the power of artificial intelligence to give your plants the best possible care.
              From identification and disease diagnosis to personalized recommendations, our AI helps you become an expert plant parent.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">AI Features Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${feature.color} mr-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      feature.status === 'Active' ? 'text-green-600 bg-green-100' :
                      feature.status === 'New' ? 'text-blue-600 bg-blue-100' :
                      'text-gray-600 bg-gray-100'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Try AI Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/find-plant"
              className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Camera className="h-6 w-6 text-blue-600 mr-3" />
              <span className="font-medium text-blue-900">Identify Plant</span>
            </Link>
            <Link
              to="/my-plants"
              className="flex items-center justify-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Stethoscope className="h-6 w-6 text-red-600 mr-3" />
              <span className="font-medium text-red-900">Health Check</span>
            </Link>
            <Link
              to="/care"
              className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Lightbulb className="h-6 w-6 text-green-600 mr-3" />
              <span className="font-medium text-green-900">Care Tasks</span>
            </Link>
            <button
              onClick={() => document.getElementById('ai-dashboard')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Brain className="h-6 w-6 text-purple-600 mr-3" />
              <span className="font-medium text-purple-900">AI Dashboard</span>
            </button>
          </div>
        </div>

        {/* AI Dashboard */}
        <div id="ai-dashboard">
          <AICareDashboard />
        </div>

        {/* AI Analytics Dashboard */}
        <div className="mt-12">
          <AIAnalyticsDashboard />
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">How Our AI Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Data Collection</h4>
              <p className="text-gray-600">
                We collect plant images, care history, and environmental data to build comprehensive plant profiles.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h4>
              <p className="text-gray-600">
                Advanced machine learning models analyze your data to provide personalized insights and recommendations.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Smart Recommendations</h4>
              <p className="text-gray-600">
                Get actionable advice tailored to your specific plants, environment, and care routine.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Benefits of AI-Powered Plant Care</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Core Features</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Instant plant identification
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Disease detection & diagnosis
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Personalized care guidance
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Growth prediction & insights
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Advanced Features</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Environmental optimization
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  AI plant assistant chatbot
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Care analytics & tracking
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Data-driven recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;
