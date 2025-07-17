import express from 'express';
import axios from 'axios';

const router: express.Router = express.Router();

router.post('/identify-plant', async (req, res) => {
  try {
    const { base64 } = req.body;
    const response = await axios.post(
      'https://plant.id/api/v3/identification',
      {
        images: [base64],
        similar_images: true,
      },
      {
        headers: {
          'Api-Key': process.env.PLANT_ID_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (err: any) {
    console.error('Plant ID API error:', err);
    if (err.response) {
      // The request was made and the server responded with a status code
      res.status(500).json({
        error: 'Plant ID API error',
        details: err.message,
        plantIdApiResponse: err.response.data,
      });
    } else if (err.request) {
      // The request was made but no response was received
      res.status(500).json({
        error: 'No response from Plant ID API',
        details: err.message,
      });
    } else {
      // Something happened in setting up the request
      res.status(500).json({
        error: 'Unknown error',
        details: err.message,
      });
    }
  }
});

export default router;
