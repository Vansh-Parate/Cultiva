import express from 'express';
import axios from 'axios';

const router: express.Router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { base64 } = req.body;
    
    // Check if API key is configured
    if (!process.env.PLANT_ID_API_KEY) {
      console.error('Plant ID API key not configured');
      return res.status(500).json({
        error: 'Plant identification service not configured',
        details: 'API key is missing. Please configure PLANT_ID_API_KEY in environment variables.',
        suggestion: 'Get a free API key from https://web.plant.id/plant-identification-api/'
      });
    }

    // Validate base64 input
    if (!base64) {
      return res.status(400).json({
        error: 'Invalid request',
        details: 'Base64 image data is required'
      });
    }

    // Ensure base64 is properly formatted
    const formattedBase64 = base64.startsWith('data:image/') ? base64 : `data:image/jpeg;base64,${base64}`;

    console.log('Making request to Plant.id API...');
    const response = await axios.post(
      'https://plant.id/api/v3/identification',
      {
        images: [formattedBase64],
        similar_images: true,
      },
      {
        headers: {
          'Api-Key': process.env.PLANT_ID_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );
    
    console.log('Plant.id API response received');
    res.json(response.data);
  } catch (err: any) {
    console.error('Plant ID API error:', err);
    
    if (err.code === 'ECONNABORTED') {
      res.status(408).json({
        error: 'Request timeout',
        details: 'The plant identification service took too long to respond. Please try again with a smaller image.',
        suggestion: 'Try uploading a smaller image file (under 2MB)'
      });
    } else if (err.response) {
      // The request was made and the server responded with a status code
      const statusCode = err.response.status;
      let errorMessage = 'Plant ID API error';
      let details = err.message;
      
      if (statusCode === 401) {
        errorMessage = 'Invalid API key';
        details = 'The Plant.id API key is invalid or expired';
      } else if (statusCode === 429) {
        errorMessage = 'Rate limit exceeded';
        details = 'Too many requests. Please wait a moment before trying again';
      } else if (statusCode === 400) {
        errorMessage = 'Invalid image format';
        details = 'The uploaded image format is not supported';
      }
      
      res.status(statusCode >= 400 && statusCode < 500 ? statusCode : 500).json({
        error: errorMessage,
        details: details,
        plantIdApiResponse: err.response.data,
        statusCode: statusCode
      });
    } else if (err.request) {
      // The request was made but no response was received
      res.status(503).json({
        error: 'Service unavailable',
        details: 'Unable to connect to plant identification service. Please try again later.',
        suggestion: 'Check your internet connection and try again'
      });
    } else {
      // Something happened in setting up the request
      res.status(500).json({
        error: 'Internal server error',
        details: err.message || 'An unexpected error occurred',
        suggestion: 'Please try again or contact support if the problem persists'
      });
    }
  }
});

export default router;
