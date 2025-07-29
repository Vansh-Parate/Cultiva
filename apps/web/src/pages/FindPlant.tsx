import axios from 'axios';
import React, { useState } from 'react'
import Component from '~/components/comp-544'
import Sidebar from '~/components/Sidebar'
import CustomToast from '~/components/CustomToast';
import { Leaf, Lightbulb, Droplet, Sun, Thermometer } from 'lucide-react';

function fileToBase64(file){
    return new Promise((res,rej) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            res(reader.result.split(',')[1]);
          } else {
            rej(new Error('FileReader result is not a string'));
          }
        };
        reader.onerror = error => rej(error);
    })
}

// Plant care tips based on common plant types
const getCareTips = (plantName) => {
  const tips = {
    'aloe': {
      water: 'Water sparingly, allow soil to dry between watering',
      light: 'Bright indirect light or direct sunlight',
      temperature: '60-75°F (15-24°C)',
      tips: ['Drought tolerant', 'Good for beginners', 'Medicinal properties', 'Avoid overwatering']
    },
    'snake plant': {
      water: 'Water every 2-3 weeks, very drought tolerant',
      light: 'Low to bright indirect light',
      temperature: '60-85°F (15-29°C)',
      tips: ['Air purifying', 'Very low maintenance', 'Perfect for offices', 'Tolerates neglect']
    },
    'peace lily': {
      water: 'Keep soil consistently moist, not soggy',
      light: 'Medium to bright indirect light',
      temperature: '65-80°F (18-27°C)',
      tips: ['Air purifying', 'Drooping leaves indicate thirst', 'Toxic to pets', 'Humidity loving']
    },
    'pothos': {
      water: 'Water when top inch of soil is dry',
      light: 'Low to bright indirect light',
      temperature: '65-85°F (18-29°C)',
      tips: ['Trailing plant', 'Easy to propagate', 'Air purifying', 'Great for hanging baskets']
    },
    'monstera': {
      water: 'Water when top 2-3 inches of soil is dry',
      light: 'Bright indirect light',
      temperature: '65-85°F (18-29°C)',
      tips: ['Large leaves', 'Needs support to climb', 'Toxic to pets', 'Loves humidity']
    },
    'ficus': {
      water: 'Water when top inch of soil is dry',
      light: 'Bright indirect light',
      temperature: '60-75°F (15-24°C)',
      tips: ['Sensitive to drafts', 'Likes consistent care', 'Can drop leaves when stressed', 'Good air purifier']
    },
    'philodendron': {
      water: 'Water when top inch of soil is dry',
      light: 'Medium to bright indirect light',
      temperature: '65-80°F (18-27°C)',
      tips: ['Easy to care for', 'Trailing or climbing', 'Toxic to pets', 'Loves humidity']
    },
    'zz plant': {
      water: 'Water every 2-3 weeks, very drought tolerant',
      light: 'Low to bright indirect light',
      temperature: '65-75°F (18-24°C)',
      tips: ['Very low maintenance', 'Drought tolerant', 'Perfect for beginners', 'Slow growing']
    },
    'calathea': {
      water: 'Keep soil consistently moist',
      light: 'Medium to bright indirect light',
      temperature: '65-80°F (18-27°C)',
      tips: ['High humidity needed', 'Prayer plant movement', 'Sensitive to chemicals', 'Beautiful foliage']
    },
    'orchid': {
      water: 'Water weekly, let roots dry between watering',
      light: 'Bright indirect light',
      temperature: '65-80°F (18-27°C)',
      tips: ['Epiphytic roots', 'Loves humidity', 'Fertilize monthly', 'Repot every 2-3 years']
    },
    'cactus': {
      water: 'Water sparingly, allow soil to dry completely',
      light: 'Bright direct light',
      temperature: '60-80°F (15-27°C)',
      tips: ['Drought tolerant', 'Loves sunlight', 'Well-draining soil', 'Avoid overwatering']
    },
    'succulent': {
      water: 'Water when soil is completely dry',
      light: 'Bright direct light',
      temperature: '60-80°F (15-27°C)',
      tips: ['Drought tolerant', 'Well-draining soil', 'Avoid overwatering', 'Great for beginners']
    }
  };

  const lowerName = plantName.toLowerCase();
  for (const [key, value] of Object.entries(tips)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }

  // Default tips for unknown plants
  return {
    water: 'Water when top inch of soil feels dry',
    light: 'Bright indirect light',
    temperature: '65-75°F (18-24°C)',
    tips: ['Start with moderate care', 'Observe plant response', 'Adjust care as needed', 'Research specific needs']
  };
};

const FindPlant = () => {

  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [apiResult,setApiResult] = useState(null);
  const [error, setError] = useState(null);
  const [addedIdx, setAddedIdx] = useState(null);
  const [toast, setToast] = useState({ show: false, title: '', message: '' });
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [healthAssessment, setHealthAssessment] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderPlant, setReminderPlant] = useState(null);

  const handleIdentify = async() => {
    if(!uploadedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setShowResults(false);
    setError(null);
    
    try{
        const base64 = await fileToBase64(uploadedFile);

        const response = await axios.post('/api/identify-plant', {
            base64,
        });

        setApiResult(response.data);
        setShowResults(true);
    }catch (err){
        console.error('Identification error:', err);
        if (err.response?.data?.error) {
          setError(`Identification failed: ${err.response.data.error}`);
        } else if (err.response?.data?.details) {
          setError(`Identification failed: ${err.response.data.details}`);
        } else {
          setError('Failed to identify plant. Please try again with a clearer image.');
        }
    }finally{
        setLoading(false);
    }
  };

  const handleAddToCollection = async (idx) => {
    setAddedIdx(idx);
    const suggestion = apiResult.result.classification.suggestions[idx];

    const formData = new FormData();
    formData.append('name', suggestion.name);
    formData.append('speciesName', suggestion.name);
    formData.append('description', suggestion.details || '');
    formData.append('image', uploadedFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/v1/plants', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setToast({
        show: true,
        title: 'Added to Collection',
        message: 'Plant added to your collection.',
      });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
      window.dispatchEvent(new Event('plant-added'));
    } catch (err) {
      console.error('Add to collection error:', err);
      setToast({
        show: true,
        title: 'Error',
        message: err.response?.data?.error || 'Failed to add plant.',
      });
    } finally {
      setAddedIdx(null);
    }
  };

  const handlePlantSelect = (plant, idx) => {
    setSelectedPlant({ ...plant, index: idx });
    // Trigger health assessment when a plant is selected
    if (uploadedFile) {
      handleHealthAssessment(plant);
    }
  };

  const handleHealthAssessment = async (plant) => {
    setHealthLoading(true);
    setHealthAssessment(null);
    
    try {
      const base64 = await fileToBase64(uploadedFile);
      const token = localStorage.getItem('token');
      
      const response = await axios.post('/api/v1/plants/health-assessment', {
        image: base64,
        plantName: plant.name,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setHealthAssessment(response.data);
    } catch (err) {
      console.error('Health assessment error:', err);
      // Don't show error toast for health assessment failures
    } finally {
      setHealthLoading(false);
    }
  };

  const handleSetReminder = (plant) => {
    setReminderPlant(plant);
    setShowReminderModal(true);
  };

  const handleCreateReminder = async (reminderData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/v1/reminders', {
        plantName: reminderPlant.name,
        type: reminderData.type,
        frequency: reminderData.frequency,
        notes: reminderData.notes,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setToast({
        show: true,
        title: 'Reminder Set',
        message: `Care reminder set for ${reminderPlant.name}`,
      });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
      setShowReminderModal(false);
      setReminderPlant(null);
    } catch (err) {
      console.error('Failed to create reminder:', err);
      setToast({
        show: true,
        title: 'Error',
        message: 'Failed to set reminder. Please try again.',
      });
    }
  };

  return (
    <div className='min-h-screen w-full flex bg-[#F5E9DA] text-[#2D2D2D]'>
      <aside className="w-64 flex-shrink-0">
        <Sidebar />
      </aside>
      <div className='flex-1 flex justify-center items-center px-4 py-10'>
        <div className="relative max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <CustomToast
            show={toast.show}
            title={toast.title}
            message={toast.message}
          />
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-700 mb-2 flex items-center justify-center gap-2">
              <Leaf className="w-8 h-8" />
              Plant Identification
            </h1>
            <p className="text-gray-600 max-w-md">
              Upload a clear photo of your plant to identify its species and get personalized care recommendations.
            </p>
          </div>

          {/* Upload Section */}
          <div className="w-full max-w-md mb-8">
          <Component onFileChange={setUploadedFile} />
          <button
              className={`mt-6 w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors shadow-lg bg-green-600 hover:bg-green-700 cursor-pointer flex items-center justify-center gap-2`}
            onClick={handleIdentify}
              disabled={loading || !uploadedFile}
          >
            {loading ? (
                <>
                  <span className="loader"></span>
                  Identifying...
                </>
            ) : (
                <>
                  <Leaf className="w-5 h-5" />
                  Identify Plant
                </>
            )}
          </button>
          </div>

          {/* Results Section */}
          {showResults && apiResult && (
            <div className="w-full max-w-4xl">
              <h2 className='text-2xl font-bold mb-6 text-center text-green-700'>Identification Results</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Plant Suggestions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Matches</h3>
                  <div className="space-y-4">
              {Array.isArray(apiResult?.result?.classification?.suggestions) &&
                                             apiResult.result.classification.suggestions.slice(0, 3).map((s, idx) => {
                         return (
                          <div 
                            key={s.id || idx} 
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              selectedPlant?.index === idx 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-200 bg-gray-50 hover:border-green-300'
                            }`}
                            onClick={() => handlePlantSelect(s, idx)}
                          >
                            <div className="flex items-start gap-4">
                    {s.similar_images?.[0]?.url_small && (
                      <img 
                        src={s.similar_images[0].url_small}
                        alt={s.name}
                                  className='w-16 h-16 object-cover rounded-lg border'
                                />
                              )}
                              <div className="flex-1">
                                <div className='font-bold text-green-700 text-lg mb-1'>{s.name}</div>
                                <div className='text-sm text-gray-600 mb-3'>
                        Confidence: {(s.probability * 100).toFixed(1)}%
                      </div>
                      <button
                                  className={`px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow ${
                                    addedIdx === idx ? 'opacity-60 pointer-events-none bg-green-500' : ''
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCollection(idx);
                                  }}
                        disabled={addedIdx === idx}
                      >
                        {addedIdx === idx ? 'Added!' : 'Add to Collection'}
                      </button>
                      <button
                        className="mt-2 px-3 py-1 rounded-lg font-medium text-green-600 bg-green-50 hover:bg-green-100 transition-colors text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetReminder(s);
                        }}
                      >
                        Set Reminder
                      </button>
                    </div>
                  </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>

                {/* Care Tips */}
                {selectedPlant && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Care Tips for {selectedPlant.name}
                    </h3>
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      {(() => {
                        const tips = getCareTips(selectedPlant.name);
                        return (
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Droplet className="w-5 h-5 text-blue-500 mt-0.5" />
                              <div>
                                <div className="font-semibold text-gray-800">Watering</div>
                                <div className="text-sm text-gray-600">{tips.water}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <Sun className="w-5 h-5 text-yellow-500 mt-0.5" />
                              <div>
                                <div className="font-semibold text-gray-800">Light</div>
                                <div className="text-sm text-gray-600">{tips.light}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <Thermometer className="w-5 h-5 text-red-500 mt-0.5" />
                              <div>
                                <div className="font-semibold text-gray-800">Temperature</div>
                                <div className="text-sm text-gray-600">{tips.temperature}</div>
                              </div>
                            </div>
                            
                            <div className="pt-3 border-t border-green-200">
                              <div className="font-semibold text-gray-800 mb-2">Quick Tips</div>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {tips.tips.map((tip, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* Health Assessment */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold mb-3 text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Health Assessment
                      </h4>
                      {healthLoading ? (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="loader"></div>
                            <span className="text-sm text-blue-700">Analyzing plant health...</span>
                          </div>
                        </div>
                      ) : healthAssessment ? (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-gray-800">
                              Health Score: {Math.round((healthAssessment.result?.is_healthy?.probability || 0) * 100)}%
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                              healthAssessment.result?.is_healthy?.binary 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {healthAssessment.result?.is_healthy?.binary ? 'Healthy' : 'Needs Attention'}
                            </span>
                          </div>
                          {!healthAssessment.result?.is_healthy?.binary && healthAssessment.result?.disease?.suggestions?.length > 0 && (
                            <div className="mt-3">
                              <div className="text-sm font-medium text-gray-700 mb-2">Potential Issues:</div>
                              <div className="space-y-2">
                                {healthAssessment.result.disease.suggestions.slice(0, 2).map((issue, idx) => (
                                  <div key={idx} className="text-xs text-gray-600 bg-white rounded p-2">
                                    <span className="font-medium">{issue.name}</span>
                                    <span className="text-gray-500 ml-2">
                                      ({(issue.probability * 100).toFixed(1)}% confidence)
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <span className="text-sm text-gray-600">Select a plant to see health assessment</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <div className="font-semibold mb-1">Identification Error</div>
              <div className="text-sm">{error}</div>
            </div>
          )}

          {/* Loading Styles */}
          <style>{`
            .loader {
              border: 2px solid #fff;
              border-top: 2px solid #22c55e;
              border-radius: 50%;
              width: 1em;
              height: 1em;
              animation: spin 0.7s linear infinite;
              display: inline-block;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>

          {/* Reminder Modal */}
          {showReminderModal && reminderPlant && (
            <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-bold mb-4">Set Care Reminder</h3>
                <p className="text-gray-600 mb-4">Set up a care reminder for {reminderPlant.name}</p>
                <div className="space-y-4">
                  <button
                    onClick={() => handleCreateReminder({ type: 'watering', frequency: 'weekly', notes: 'Water your plant' })}
                    className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Watering Reminder (Weekly)
                  </button>
                  <button
                    onClick={() => handleCreateReminder({ type: 'fertilizing', frequency: 'monthly', notes: 'Fertilize your plant' })}
                    className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Fertilizing Reminder (Monthly)
                  </button>
                  <button
                    onClick={() => setShowReminderModal(false)}
                    className="w-full p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FindPlant
