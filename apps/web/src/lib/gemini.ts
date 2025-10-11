// apps/web/src/lib/gemini.ts

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

export async function getWaterPHFromGemini(species: string, location?: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
  const prompt = `What is the ideal water pH for ${species}${location ? ` grown in ${location}` : ''}? Respond with only a number (e.g., 6.0) and nothing else.`;

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  const data = await res.json();
  // Extract the answer from Gemini's response
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer found';
}

export async function getComprehensiveCareRecommendations(species: string, plantName: string, location?: string, season?: string): Promise<CareRecommendations> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const prompt = `Provide comprehensive care recommendations for ${species} (${plantName})${location ? ` in ${location}` : ''}${season ? ` during ${season}` : ''}. 

Return a JSON object with these exact keys:
{
  "watering": "detailed watering instructions including frequency, amount, and timing",
  "light": "light requirements including intensity, duration, and positioning",
  "temperature": "temperature preferences and tolerances",
  "fertilization": "fertilizer recommendations including type, frequency, and application method",
  "tasks": "seasonal care tasks and maintenance activities",
  "seasonal": "season-specific care adjustments",
  "general": "overall care tips and important notes"
}

Be specific and actionable in your recommendations.`;

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Try to parse JSON response
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse care recommendations:', parseError);
    }
    
    // Fallback to structured text parsing
    return {
      watering: "Water when top inch of soil is dry",
      light: "Bright, indirect light for 6-8 hours daily",
      temperature: "65-75°F (18-24°C) ideal temperature range",
      fertilization: "Monthly with balanced fertilizer during growing season",
      tasks: "Regular pruning and repotting as needed",
      seasonal: "Reduce watering in winter, increase in summer",
      general: "Monitor for pests and diseases regularly"
    };
  } catch (error) {
    console.error('Error fetching care recommendations:', error);
    throw new Error('Failed to get care recommendations');
  }
}

export async function diagnosePlantDisease(symptoms: string[], plantName: string, imageDescription?: string): Promise<DiseaseInfo[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const prompt = `Diagnose potential diseases for ${plantName} with these symptoms: ${symptoms.join(', ')}${imageDescription ? `. Additional visual description: ${imageDescription}` : ''}.

Return a JSON array of potential diseases with this structure:
[
  {
    "name": "disease name",
    "symptoms": ["symptom1", "symptom2"],
    "causes": ["cause1", "cause2"],
    "treatment": ["treatment1", "treatment2"],
    "prevention": ["prevention1", "prevention2"],
    "severity": "low|medium|high"
  }
]

Provide 2-3 most likely diseases, ordered by probability.`;

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    try {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse disease diagnosis:', parseError);
    }
    
    return [{
      name: "Unknown condition",
      symptoms: symptoms,
      causes: ["Environmental stress", "Improper care"],
      treatment: ["Improve growing conditions", "Consult plant expert"],
      prevention: ["Maintain proper care routine", "Monitor plant health"],
      severity: "medium" as const
    }];
  } catch (error) {
    console.error('Error diagnosing plant disease:', error);
    throw new Error('Failed to diagnose plant disease');
  }
}

export async function predictPlantGrowth(plantName: string, currentSize: string, careHistory: string[]): Promise<GrowthPrediction> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const prompt = `Predict the growth trajectory for ${plantName} that is currently ${currentSize}. Care history: ${careHistory.join(', ')}.

Return a JSON object with this structure:
{
  "expectedHeight": "expected mature height",
  "expectedWidth": "expected mature width", 
  "growthRate": "growth rate description (slow/medium/fast)",
  "milestones": ["milestone1", "milestone2", "milestone3"],
  "timeline": "estimated timeline to reach maturity"
}

Base predictions on typical growth patterns for this species.`;

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse growth prediction:', parseError);
    }
    
    return {
      expectedHeight: "Varies by species",
      expectedWidth: "Varies by species",
      growthRate: "Medium",
      milestones: ["Initial establishment", "Active growth phase", "Maturity"],
      timeline: "1-3 years depending on species"
    };
  } catch (error) {
    console.error('Error predicting plant growth:', error);
    throw new Error('Failed to predict plant growth');
  }
}

export async function getCompanionPlants(plantName: string, gardenSize: string, location?: string): Promise<CompanionPlant[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const prompt = `Suggest companion plants for ${plantName} in a ${gardenSize} garden${location ? ` in ${location}` : ''}.

Return a JSON array of companion plants with this structure:
[
  {
    "name": "companion plant name",
    "benefits": ["benefit1", "benefit2"],
    "compatibility": "excellent|good|moderate|poor",
    "spacing": "recommended spacing from main plant"
  }
]

Provide 4-6 companion plant suggestions.`;

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    try {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse companion plants:', parseError);
    }
    
    return [{
      name: "Marigolds",
      benefits: ["Pest deterrent", "Attracts beneficial insects"],
      compatibility: "good" as const,
      spacing: "6-12 inches"
    }];
  } catch (error) {
    console.error('Error getting companion plants:', error);
    throw new Error('Failed to get companion plants');
  }
}

export async function getEnvironmentalOptimization(plantName: string, currentConditions: any): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const prompt = `Optimize growing conditions for ${plantName}. Current conditions: ${JSON.stringify(currentConditions)}.

Provide specific recommendations to improve the plant's environment, including:
- Light adjustments
- Temperature modifications  
- Humidity changes
- Air circulation improvements
- Soil amendments

Be practical and actionable.`;

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No optimization recommendations available';
  } catch (error) {
    console.error('Error getting environmental optimization:', error);
    throw new Error('Failed to get environmental optimization');
  }
}

export async function chatWithPlantAssistant(question: string, context?: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const prompt = `You are a knowledgeable plant care assistant. Answer this question about plant care: "${question}"${context ? `\n\nContext: ${context}` : ''}.

Provide helpful, accurate, and actionable advice. If you're unsure about something, say so and suggest consulting a local expert.`;

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I cannot provide an answer at this time.';
  } catch (error) {
    console.error('Error with plant assistant chat:', error);
    throw new Error('Failed to get response from plant assistant');
  }
}
