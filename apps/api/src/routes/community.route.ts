import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/authMiddleware';

const router: express.Router = express.Router();
const prisma = new PrismaClient();

// Get all community posts
router.get('/posts', async (req, res) => {
  try {
    const { 
      postType, 
      search, 
      sortBy = 'recent', 
      limit = 20, 
      offset = 0,
      tags
    } = req.query;

    // Build where clause
    const where: any = {};
    
    if (postType && postType !== 'all') {
      where.postType = postType;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
        { tags: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (tags) {
      const tagArray = (tags as string).split(',').map(tag => tag.trim());
      where.AND = tagArray.map(tag => ({
        tags: { contains: tag, mode: 'insensitive' }
      }));
    }

    // Build order by clause
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'popular') {
      orderBy = [
        { likes: { _count: 'desc' } },
        { createdAt: 'desc' }
      ];
    } else if (sortBy === 'discussed') {
      orderBy = [
        { comments: { _count: 'desc' } },
        { createdAt: 'desc' }
      ];
    }

    const posts = await prisma.communityPost.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            location: true,
            experienceLevel: true
          }
        },
        likes: {
          select: {
            userId: true
          }
        },
        comments: {
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
          take: 3
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy,
      take: Number(limit),
      skip: Number(offset)
    });

    // Format the response
    const formattedPosts = posts.map(post => ({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      tags: post.tags ? post.tags.split(',').map(tag => tag.trim()) : [],
      imageUrls: post.imageUrls ? JSON.parse(post.imageUrls) : [],
      isLiked: false, // Will be updated on frontend with user context
      recentComments: post.comments
    }));

    res.json(formattedPosts);
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
        tags: Array.isArray(tags) ? tags.join(',') : tags,
        imageUrls: Array.isArray(imageUrls) ? JSON.stringify(imageUrls) : JSON.stringify([])
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            location: true,
            experienceLevel: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    // Format response
    const formattedPost = {
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      tags: post.tags ? post.tags.split(',').map(tag => tag.trim()) : [],
      imageUrls: post.imageUrls ? JSON.parse(post.imageUrls) : [],
      isLiked: false,
      recentComments: []
    };

    res.status(201).json(formattedPost);
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

// Get trending topics/tags
router.get('/trending-tags', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const posts = await prisma.communityPost.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      select: {
        tags: true
      }
    });

    // Extract and count tags
    const tagCounts: Record<string, number> = {};
    posts.forEach(post => {
      if (post.tags) {
        const tags = post.tags.split(',').map(tag => tag.trim());
        tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // Sort by count and return top tags
    const trendingTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, Number(limit))
      .map(([tag, count]) => ({ tag, count }));

    res.json(trendingTags);
  } catch (err) {
    console.error('Error fetching trending tags:', err);
    res.status(500).json({ error: 'Failed to fetch trending tags' });
  }
});

// Get post statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalPosts, totalUsers, thisWeekPosts] = await Promise.all([
      prisma.communityPost.count(),
      prisma.user.count(),
      prisma.communityPost.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    const postTypeStats = await prisma.communityPost.groupBy({
      by: ['postType'],
      _count: {
        postType: true
      }
    });

    res.json({
      totalPosts,
      totalUsers,
      thisWeekPosts,
      postTypeDistribution: postTypeStats.map(stat => ({
        type: stat.postType,
        count: stat._count.postType
      }))
    });
  } catch (err) {
    console.error('Error fetching community stats:', err);
    res.status(500).json({ error: 'Failed to fetch community stats' });
  }
});

// Get user's posts
router.get('/my-posts', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { limit = 10, offset = 0 } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const posts = await prisma.communityPost.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: Number(limit),
      skip: Number(offset)
    });

    const formattedPosts = posts.map(post => ({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      tags: post.tags ? post.tags.split(',').map(tag => tag.trim()) : [],
      imageUrls: post.imageUrls ? JSON.parse(post.imageUrls) : []
    }));

    res.json(formattedPosts);
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

export default router; 