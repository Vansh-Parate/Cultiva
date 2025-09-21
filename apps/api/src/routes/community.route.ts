import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/authMiddleware';

const router: express.Router = express.Router();
const prisma = new PrismaClient();

// Get all community posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.communityPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        },
        likes: true,
        comments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(posts);
  } catch (err) {
    console.error('Error fetching community posts:', err);
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
});

// Create a new community post
router.post('/posts', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { postType, title, content, tags, imageUrls } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const post = await prisma.communityPost.create({
      data: {
        userId,
        postType,
        title,
        content,
        tags,
        imageUrls: imageUrls || []
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

    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating community post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like a post
router.post('/posts/:id/like', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const postId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user already liked the post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (existingLike) {
      // Unlike the post
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });
    } else {
      // Like the post
      await prisma.postLike.create({
        data: {
          userId,
          postId
        }
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Add comment to a post
router.post('/posts/:id/comments', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const postId = req.params.id;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const comment = await prisma.postComment.create({
      data: {
        userId,
        postId,
        content
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

    res.status(201).json(comment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get comments for a post
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await prisma.postComment.findMany({
      where: {
        postId
      },
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
        createdAt: 'asc'
      }
    });

    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

export default router; 