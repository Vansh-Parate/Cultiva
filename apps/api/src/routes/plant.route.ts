import multer from 'multer';
import express from 'express';
import { uploadImageToS3 } from '@/s3';
import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authenticateJWT } from '@/middleware/authMiddleware';
import crypto from 'crypto';

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

      let species = await prisma.plantSpecies.findFirst({
        where: { commonName: { equals: speciesName, mode: 'insensitive' } }
      });
      if (!species) {
        // Use a more user-friendly common name
        let commonName = speciesName;
        if (commonName.length > 20) {
          commonName = commonName.split(' ')[0]; // Use first word if name is long
        }
        commonName = commonName.charAt(0).toUpperCase() + commonName.slice(1);
        species = await prisma.plantSpecies.create({
          data: {
            commonName,
            scientificName: speciesName, // fallback to original name
          }
        });
      }

      const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');
      const imageUrl = await uploadImageToS3(file.buffer, file.mimetype);

      // Prevent duplicate plant images for the same user
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

export default router;    