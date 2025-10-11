import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { 
  getComprehensiveCareRecommendations, 
  diagnosePlantDisease, 
  predictPlantGrowth, 
  getCompanionPlants, 
  getEnvironmentalOptimization, 
  chatWithPlantAssistant 
} from '../../web/src/lib/gemini';

const router: express.Router = express.Router();

// Get comprehensive care recommendations
router.post('/care-recommendations', authenticateJWT, async (req, res) => {
  try {
    const { species, plantName, location, season } = req.body;
    
    if (!species || !plantName) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'species and plantName are required'
      });
    }

    const recommendations = await getComprehensiveCareRecommendations(
      species, 
      plantName, 
      location, 
      season
    );

    res.json({ recommendations });
  } catch (error: any) {
    console.error('Care recommendations error:', error);
    res.status(500).json({
      error: 'Failed to get care recommendations',
      details: error.message
    });
  }
});

// Diagnose plant disease
router.post('/disease-diagnosis', authenticateJWT, async (req, res) => {
  try {
    const { symptoms, plantName, imageDescription } = req.body;
    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        error: 'Invalid symptoms',
        details: 'symptoms must be a non-empty array'
      });
    }

    if (!plantName) {
      return res.status(400).json({
        error: 'Missing plant name',
        details: 'plantName is required'
      });
    }

    const diseases = await diagnosePlantDisease(symptoms, plantName, imageDescription);

    res.json({ diseases });
  } catch (error: any) {
    console.error('Disease diagnosis error:', error);
    res.status(500).json({
      error: 'Failed to diagnose plant disease',
      details: error.message
    });
  }
});

// Predict plant growth
router.post('/growth-prediction', authenticateJWT, async (req, res) => {
  try {
    const { plantName, currentSize, careHistory } = req.body;
    
    if (!plantName || !currentSize) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'plantName and currentSize are required'
      });
    }

    const prediction = await predictPlantGrowth(
      plantName, 
      currentSize, 
      careHistory || []
    );

    res.json({ prediction });
  } catch (error: any) {
    console.error('Growth prediction error:', error);
    res.status(500).json({
      error: 'Failed to predict plant growth',
      details: error.message
    });
  }
});

// Get companion plants
router.post('/companion-plants', authenticateJWT, async (req, res) => {
  try {
    const { plantName, gardenSize, location } = req.body;
    
    if (!plantName) {
      return res.status(400).json({
        error: 'Missing plant name',
        details: 'plantName is required'
      });
    }

    const companions = await getCompanionPlants(
      plantName, 
      gardenSize || 'medium', 
      location
    );

    res.json({ companions });
  } catch (error: any) {
    console.error('Companion plants error:', error);
    res.status(500).json({
      error: 'Failed to get companion plants',
      details: error.message
    });
  }
});

// Get environmental optimization
router.post('/environmental-optimization', authenticateJWT, async (req, res) => {
  try {
    const { plantName, currentConditions } = req.body;
    
    if (!plantName) {
      return res.status(400).json({
        error: 'Missing plant name',
        details: 'plantName is required'
      });
    }

    const optimization = await getEnvironmentalOptimization(
      plantName, 
      currentConditions || {}
    );

    res.json({ optimization });
  } catch (error: any) {
    console.error('Environmental optimization error:', error);
    res.status(500).json({
      error: 'Failed to get environmental optimization',
      details: error.message
    });
  }
});

// Chat with plant assistant
router.post('/chat', authenticateJWT, async (req, res) => {
  try {
    const { question, context } = req.body;
    
    if (!question || question.trim() === '') {
      return res.status(400).json({
        error: 'Missing question',
        details: 'question is required'
      });
    }

    const response = await chatWithPlantAssistant(question, context);

    res.json({ response });
  } catch (error: any) {
    console.error('Plant assistant chat error:', error);
    res.status(500).json({
      error: 'Failed to get response from plant assistant',
      details: error.message
    });
  }
});

export default router;
