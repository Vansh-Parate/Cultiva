import { useEffect, useState, useCallback } from 'react';
import { useRealtimeUpdates, RealTimeEvents } from './useRealtimeUpdates';

export interface CommunityPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  authorName: string;
  avatarUrl?: string;
  imageUrls?: string[];
  tags?: string[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export const useRealtimeCommunity = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<Map<string, CommunityComment[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const { subscribe, connected } = useRealtimeUpdates();

  // Fetch initial posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:6969/api/v1/community/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(
          data.map((post: any) => ({
            ...post,
            createdAt: new Date(post.createdAt),
            likeCount: post._count?.likes || 0,
            commentCount: post._count?.comments || 0,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Setup real-time listeners
  useEffect(() => {
    if (!connected) return;

    // New post created
    const unsubPostCreated = subscribe(RealTimeEvents.POST_CREATED, (newPost) => {
      setPosts((prev) => [{ ...newPost, createdAt: new Date(newPost.timestamp) }, ...prev]);
    });

    // Post liked
    const unsubPostLiked = subscribe(RealTimeEvents.POST_LIKED, ({ postId, likeCount }) => {
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, likeCount } : post))
      );
    });

    // Post unliked
    const unsubPostUnliked = subscribe(RealTimeEvents.POST_UNLIKED, ({ postId, likeCount }) => {
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, likeCount } : post))
      );
    });

    // Comment added
    const unsubCommentAdded = subscribe(RealTimeEvents.COMMENT_ADDED, (comment) => {
      const { postId, ...commentData } = comment;
      setComments((prev) => {
        const newMap = new Map(prev);
        const postComments = newMap.get(postId) || [];
        newMap.set(postId, [
          ...postComments,
          {
            ...commentData,
            createdAt: new Date(commentData.timestamp),
            postId,
          },
        ]);
        return newMap;
      });

      // Update comment count
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, commentCount: post.commentCount + 1 } : post
        )
      );
    });

    return () => {
      unsubPostCreated?.();
      unsubPostLiked?.();
      unsubPostUnliked?.();
      unsubCommentAdded?.();
    };
  }, [connected, subscribe]);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Helper functions
  const likePost = useCallback(async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:6969/api/v1/community/posts/${postId}/like`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, likeCount: result.likes, isLiked: result.isLiked }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  }, []);

  const createComment = useCallback(
    async (postId: string, content: string) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:6969/api/v1/community/posts/${postId}/comments`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
          }
        );

        if (response.ok) {
          const comment = await response.json();
          setComments((prev) => {
            const newMap = new Map(prev);
            const postComments = newMap.get(postId) || [];
            newMap.set(postId, [
              ...postComments,
              { ...comment, createdAt: new Date(comment.createdAt) },
            ]);
            return newMap;
          });
        }
      } catch (error) {
        console.error('Failed to create comment:', error);
      }
    },
    []
  );

  const createPost = useCallback(async (postData: Omit<CommunityPost, 'id' | 'userId' | 'createdAt'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:6969/api/v1/community/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts((prev) => [{ ...newPost, createdAt: new Date(newPost.createdAt) }, ...prev]);
        return newPost;
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  }, []);

  const getPostComments = useCallback((postId: string): CommunityComment[] => {
    return comments.get(postId) || [];
  }, [comments]);

  return {
    posts,
    comments,
    loading,
    fetchPosts,
    likePost,
    createComment,
    createPost,
    getPostComments,
  };
};
