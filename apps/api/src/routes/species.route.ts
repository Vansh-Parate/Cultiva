import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const speciesRoute:Router = express.Router();
const prisma = new PrismaClient();

speciesRoute.get('/', async (req, res) => {
  try {
    const species = await prisma.plantSpecies.findMany();
    res.json(species);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch species' });
  }
});

export default speciesRoute;