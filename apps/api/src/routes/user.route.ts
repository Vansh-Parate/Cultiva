import { Router } from 'express'
import prisma from '@/db/index'
import { authenticateJWT, AuthRequest } from '@/middleware/authMiddleware'

const router: Router = Router()

// Get current authenticated user
router.get('/me', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true,
        avatarUrl: true,
        location: true,
        experienceLevel: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
})

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany()
  res.status(200).json(users)
})
router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id,
    },
  })
  res.status(200).json(user)
})
export default router
