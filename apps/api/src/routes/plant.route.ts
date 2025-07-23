import multer from 'multer';
import express from 'express';
import { uploadImageToS3 } from '@/s3';
import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authenticateJWT } from '@/middleware/authMiddleware';
import crypto from 'crypto';
import axios from 'axios';

const router:Router = express.Router();
const upload = multer();
const prisma = new PrismaClient();

router.post('/',
  authenticateJWT,
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, speciesName, description } = req.body;
      const file = (req as any).file;
      const userId = (req as any).user?.userId;

      if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

      let species = await prisma.plantSpecies.findFirst({
        where: { commonName: { equals: speciesName, mode: 'insensitive' } }
      });
      if (!species) {
        let commonName = speciesName;
        if (commonName.length > 20) {
          commonName = commonName.split(' ')[0];
        }
        commonName = commonName.charAt(0).toUpperCase() + commonName.slice(1);
        species = await prisma.plantSpecies.create({
          data: {
            commonName,
            scientificName: speciesName,
          }
        });
      }

      const existingPlant = await prisma.plant.findFirst({
        where: {
          userId,
          images: {
            some: { hash }
          }
        }
      });
      if (existingPlant) {
        return res.status(409).json({ error: 'This plant image already exists in your collection.' });
      }

      const imageUrl = await uploadImageToS3(file.buffer, file.mimetype);

      const plant = await prisma.plant.create({
        data: {
          name,
          description,
          userId,
          speciesId: species.id,
          images: {
            create: [
              {
                url: imageUrl,
                isPrimary: true,
                hash, 
              }
            ]
          }
        },
        include: { images: true }
      });

      res.status(201).json(plant);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add plant' });
    }
  }
);

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const plants = await prisma.plant.findMany({
      where: { userId },
      include: { images: true, species: true }
    });

    res.json(plants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});

router.post('/:id/health-check', authenticateJWT, async (req, res) => {
  try {
    const plant = await prisma.plant.findUnique({
      where: { id: req.params.id },
      include: { images: true }
    });
    if (!plant || !plant.images[0]) {
      return res.status(404).json({ error: 'No image found for this plant.' });
    }

    const imageUrl = plant.images[0].url;
    const imageRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBase64 = Buffer.from(imageRes.data, 'binary').toString('base64');

    const plantIdRes = await axios.post('https://plant.id/api/v3/health_assessment', {
      images: [`data:image/jpeg;base64,${imageBase64}`],
      similar_images: true,
    }, {
      headers: {
        'Api-Key': process.env.PLANT_ID_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    res.json(plantIdRes.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assess plant health.' });
  }
});

export default router;    