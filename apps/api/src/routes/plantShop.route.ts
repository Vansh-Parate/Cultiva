import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/authMiddleware';

const router: express.Router = express.Router();
const prisma = new PrismaClient();

// Get all plant shops
router.get('/', async (req, res) => {
  try {
    const { search, limit = 20, offset = 0 } = req.query;
    
    const where = search ? {
      OR: [
        { name: { contains: search as string, mode: 'insensitive' } },
        { address: { contains: search as string, mode: 'insensitive' } },
        { servicesOffered: { contains: search as string, mode: 'insensitive' } }
      ]
    } : {};

    const shops = await prisma.plantShop.findMany({
      where,
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      },
      take: Number(limit),
      skip: Number(offset)
    });

    // Calculate average ratings and format response
    const formattedShops = shops.map(shop => ({
      ...shop,
      averageRating: shop.rating || 0,
      reviewCount: shop._count.reviews,
      services: shop.servicesOffered ? shop.servicesOffered.split(',') : [],
      distance: `${(Math.random() * 5 + 0.1).toFixed(1)} miles` // Mock distance for now
    }));

    res.json(formattedShops);
  } catch (err) {
    console.error('Error fetching plant shops:', err);
    res.status(500).json({ error: 'Failed to fetch plant shops' });
  }
});

// Get a specific plant shop
router.get('/:id', async (req, res) => {
  try {
    const shop = await prisma.plantShop.findUnique({
      where: { id: req.params.id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

    if (!shop) {
      return res.status(404).json({ error: 'Plant shop not found' });
    }

    const formattedShop = {
      ...shop,
      averageRating: shop.rating || 0,
      reviewCount: shop._count.reviews,
      services: shop.servicesOffered ? shop.servicesOffered.split(',') : [],
      distance: `${(Math.random() * 5 + 0.1).toFixed(1)} miles`
    };

    res.json(formattedShop);
  } catch (err) {
    console.error('Error fetching plant shop:', err);
    res.status(500).json({ error: 'Failed to fetch plant shop' });
  }
});

// Add a review to a plant shop
router.post('/:id/reviews', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const shopId = req.params.id;
    const { rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user already reviewed this shop
    const existingReview = await prisma.shopReview.findFirst({
      where: {
        userId,
        shopId
      }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this shop' });
    }

    const review = await prisma.shopReview.create({
      data: {
        userId,
        shopId,
        rating,
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    });

    // Update shop's average rating
    const allReviews = await prisma.shopReview.findMany({
      where: { shopId },
      select: { rating: true }
    });

    const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;

    await prisma.plantShop.update({
      where: { id: shopId },
      data: { rating: averageRating }
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Create a new plant shop (admin only for now)
router.post('/', async (req, res) => {
  try {
    const { name, address, phone, website, servicesOffered } = req.body;

    const shop = await prisma.plantShop.create({
      data: {
        name,
        address,
        phone,
        website,
        servicesOffered: Array.isArray(servicesOffered) ? servicesOffered.join(',') : servicesOffered
      }
    });

    res.status(201).json(shop);
  } catch (err) {
    console.error('Error creating plant shop:', err);
    res.status(500).json({ error: 'Failed to create plant shop' });
  }
});

export default router;
