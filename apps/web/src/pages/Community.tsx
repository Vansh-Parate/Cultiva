import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, Heart, Share2, Search, Filter, Plus, MapPin, Star,
  Camera, MessageSquare, Bookmark, TrendingUp, Users, Calendar,
  Eye, ChevronDown, ChevronUp, Send, Image, X, Edit3, MoreHorizontal,
  Award, ThumbsUp, Reply, Flag, Download, ExternalLink, Phone
} from 'lucide-react';
import apiClient from "../lib/axios";
import { Card, CardContent } from '../components/ui';
import { badgeClasses, buttonClasses, inputClasses, textClasses } from '../lib/classNameHelpers';

interface CommunityPost {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
    location?: string;
    experienceLevel?: string;
  };
  postType: 'question' | 'showcase' | 'tip' | 'trade';
  title: string;
  content: string;
  imageUrls: string[];
  tags: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
  recentComments?: Comment[];
}

interface Comment {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  createdAt: string;
}

interface PlantShop {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  services: string[];
  averageRating: number;
  reviewCount: number;
  distance: string;
  reviews?: ShopReview[];
}

interface ShopReview {
  id: string;
  user: {
    username: string;
    avatarUrl: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface TrendingTag {
  tag: string;
  count: number;
}

interface CommunityStats {
  totalPosts: number;
  totalUsers: number;
  thisWeekPosts: number;
  postTypeDistribution: { type: string; count: number }[];
}

const Community = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'showcase' | 'tips' | 'shops' | 'explore'>('feed');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [shops, setShops] = useState<PlantShop[]>([]);
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [selectedShop, setSelectedShop] = useState<PlantShop | null>(null);
  const [hasPlants, setHasPlants] = useState<boolean | null>(null);
  
  const [newPost, setNewPost] = useState({
    postType: 'question' as CommunityPost['postType'],
    title: '',
    content: '',
    tags: [] as string[],
    imageUrls: [] as string[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCommunityData();
    fetchTrendingTags();
    fetchStats();
  }, [activeTab, sortBy, searchTerm, selectedTags]);

  useEffect(() => {
    // Determine if the user has plants to tailor blank states
    const checkPlants = async () => {
      try {
        const res = await apiClient.get('/api/v1/plants');
        setHasPlants(Array.isArray(res.data) && res.data.length > 0);
      } catch (err: any) {
        // If unauthorized or error, we assume user has no plants for blank state
        setHasPlants(false);
      }
    };
    checkPlants();
  }, []);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'shops') {
        const shopsResponse = await apiClient.get('/api/v1/plant-shops', {
          params: { search: searchTerm }
        });
        setShops(shopsResponse.data);
      } else {
        const params: any = {
          postType: activeTab === 'feed' ? 'all' : activeTab,
          search: searchTerm,
          sortBy,
          limit: 20
        };
        
        if (selectedTags.length > 0) {
          params.tags = selectedTags.join(',');
        }
        
        const postsResponse = await apiClient.get('/api/v1/community/posts', { params });
        setPosts(postsResponse.data);
      }
    } catch (err) {
      console.error('Failed to fetch community data:', err);
      // Fallback to demo data
      if (activeTab !== 'shops') {
        setPosts(getDemoPosts());
      } else {
        setShops(getDemoShops());
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingTags = async () => {
    try {
      const response = await apiClient.get('/api/v1/community/trending-tags');
      setTrendingTags(response.data);
    } catch (err) {
      setTrendingTags([
        { tag: 'monstera', count: 45 },
        { tag: 'care-tips', count: 38 },
        { tag: 'beginner', count: 32 },
        { tag: 'indoor-plants', count: 29 },
        { tag: 'pest-control', count: 25 }
      ]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/v1/community/stats');
      setStats(response.data);
    } catch (err) {
      setStats({
        totalPosts: 1247,
        totalUsers: 892,
        thisWeekPosts: 67,
        postTypeDistribution: [
          { type: 'question', count: 450 },
          { type: 'showcase', count: 320 },
          { type: 'tip', count: 290 },
          { type: 'trade', count: 187 }
        ]
      });
    }
  };

  const handleCreatePost = async () => {
    try {
      const response = await apiClient.post('/api/v1/community/posts', newPost);
      setPosts([response.data, ...posts]);
      setShowCreatePost(false);
      setNewPost({
        postType: 'question',
        title: '',
        content: '',
        tags: [],
        imageUrls: []
      });
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await apiClient.post(`/api/v1/community/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1, isLiked: !post.isLiked }
          : post
      ));
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleComment = async (postId: string) => {
    const content = newComment[postId];
    if (!content?.trim()) return;

    try {
      await apiClient.post(`/api/v1/community/posts/${postId}/comments`, { content });
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, commentsCount: post.commentsCount + 1 }
          : post
      ));
      setNewComment({ ...newComment, [postId]: '' });
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const toggleExpanded = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const toggleComments = (postId: string) => {
    const newShowComments = new Set(showComments);
    if (newShowComments.has(postId)) {
      newShowComments.delete(postId);
    } else {
      newShowComments.add(postId);
    }
    setShowComments(newShowComments);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getPostTypeIcon = (type: CommunityPost['postType']) => {
    switch (type) {
      case 'question': return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'showcase': return <Camera className="w-5 h-5 text-emerald-600" />;
      case 'tip': return <Award className="w-5 h-5 text-yellow-600" />;
      case 'trade': return <Share2 className="w-5 h-5 text-purple-600" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getPostTypeColor = (type: CommunityPost['postType']) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'showcase': return 'bg-emerald-100 text-emerald-800 border-green-200';
      case 'tip': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'trade': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-[hsl(var(--muted))] text-gray-800 border-[hsl(var(--border))]';
    }
  };

  const getExperienceBadge = (level?: string) => {
    switch (level) {
      case 'expert': return <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs rounded-full font-medium">Expert</div>;
      case 'intermediate': return <div className="px-2 py-1 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xs rounded-full font-medium">Intermediate</div>;
      case 'beginner': return <div className="px-2 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs rounded-full font-medium">Beginner</div>;
      default: return null;
    }
  };

  const getDemoPosts = (): CommunityPost[] => [
    {
      id: '1',
      userId: 'user1',
      user: {
        id: 'user1',
        username: 'PlantLover123',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        location: 'New York, NY',
        experienceLevel: 'intermediate'
      },
      postType: 'question',
      title: 'Why are my Monstera leaves turning yellow?',
      content: 'I\'ve had my Monstera for about 6 months and recently noticed the leaves are turning yellow. I water it weekly and it gets indirect sunlight. Any advice? I\'ve tried adjusting the watering schedule but nothing seems to help.',
      imageUrls: ['https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=600&h=400&fit=crop'],
      tags: ['monstera', 'yellow-leaves', 'care-help'],
      likesCount: 12,
      commentsCount: 8,
      createdAt: '2024-01-15T10:30:00Z',
      isLiked: false,
      recentComments: []
    }
  ];

  const getDemoShops = (): PlantShop[] => [
    {
      id: '1',
      name: 'Green Haven Nursery',
      address: '123 Plant Street, New York, NY 10001',
      phone: '(555) 123-4567',
      website: 'www.greenhaven.com',
      services: ['Plant Care', 'Landscaping', 'Plant Doctor'],
      averageRating: 4.8,
      reviewCount: 127,
      distance: '0.5 miles'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-[hsl(var(--muted-foreground))] font-medium">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Header */}
      <div className="bg-[hsl(var(--card))] shadow-sm border-b border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">
                Plant Community
              </h1>
              <p className="text-[hsl(var(--muted-foreground))] mt-1">Connect, learn, and grow together</p>
            </div>
            <div className="flex items-center gap-4">
              {stats && (
                <div className="hidden md:flex items-center gap-6 text-sm text-[hsl(var(--muted-foreground))]">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{stats.totalUsers.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{stats.totalPosts.toLocaleString()} posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stats.thisWeekPosts} this week</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowCreatePost(true)}
                className={`flex items-center gap-2 ${buttonClasses.primary} transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Create Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="bg-[hsl(var(--card))] rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-900/30 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="text"
                    placeholder="Search posts, tips, or questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border-0 focus:ring-0 text-[hsl(var(--foreground))] placeholder-gray-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-[hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="discussed">Most Discussed</option>
                  </select>
                  <Filter className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                </div>
              </div>

              {/* Active Tags */}
              {selectedTags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <span 
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full cursor-pointer hover:bg-green-200 transition-colors"
                      onClick={() => handleTagClick(tag)}
                    >
                      #{tag}
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="bg-[hsl(var(--card))] rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-900/30 p-2">
              <div className="flex space-x-1">
                {[
                  { id: 'feed', label: 'All Posts', icon: MessageCircle },
                  { id: 'showcase', label: 'Showcase', icon: Camera },
                  { id: 'tips', label: 'Tips', icon: Award },
                  { id: 'shops', label: 'Local Shops', icon: MapPin },
                  { id: 'explore', label: 'Explore', icon: TrendingUp }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md' 
                        : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            {activeTab === 'shops' ? (
              /* Plant Shops Directory */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {shops.map(shop => (
                  <div key={shop.id} className="bg-[hsl(var(--card))] rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-900/30 hover:shadow-md transition-all duration-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[hsl(var(--foreground))] mb-2">{shop.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${
                                    i < Math.floor(shop.averageRating) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-[hsl(var(--muted-foreground))]">
                              {shop.averageRating.toFixed(1)} ({shop.reviewCount})
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-emerald-600 font-medium bg-green-50 px-2 py-1 rounded-lg">
                          {shop.distance}
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{shop.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{shop.phone}</span>
                        </div>
                        {shop.website && (
                          <div className="flex items-center gap-2 text-sm text-emerald-600">
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            <a href={shop.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {shop.website}
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-2">Services:</h4>
                        <div className="flex flex-wrap gap-1">
                          {shop.services.map(service => (
                            <span key={service} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium">
                          Contact
                        </button>
                        <button 
                          onClick={() => setSelectedShop(shop)}
                          className="px-4 py-2 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Community Posts */
              <div className="space-y-6">
                {/* Blank-state banner prompting to add plants (only visible if no plants) */}
                {hasPlants === false && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl p-5 flex items-start gap-4">
                    <div className="shrink-0 rounded-xl bg-white p-3 border border-emerald-200 dark:border-emerald-900/30 shadow-sm">
                      <PlantIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Add a plant to unlock personalized community insights</h3>
                      <p className="text-[hsl(var(--muted-foreground))] mt-1">Recommendations, local tips, and relevant discussions become smarter once you add your first plant.</p>
                      <div className="mt-3 flex gap-3">
                        <a href="/my-plants" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">Go to My Plants</a>
                        <a href="/find-plant" className="px-4 py-2 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-lg hover:bg-[hsl(var(--muted))] transition-colors text-sm font-medium">Identify a Plant</a>
                      </div>
                    </div>
                  </div>
                )}
                {posts.length > 0 ? (
                  posts.map(post => (
                    <div key={post.id} className="bg-[hsl(var(--card))] rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-900/30 hover:shadow-md transition-all duration-200 overflow-hidden">
                      {/* Post Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={post.user.avatarUrl} 
                              alt={post.user.username} 
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100"
                            />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-[hsl(var(--foreground))]">{post.user.username}</h3>
                                {getExperienceBadge(post.user.experienceLevel)}
                                <span className={`px-3 py-1 text-xs rounded-full font-medium border ${getPostTypeColor(post.postType)}`}>
                                  {post.postType}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                {post.user.location && (
                                  <>
                                    <span>•</span>
                                    <span>{post.user.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPostTypeIcon(post.postType)}
                            <button className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                            </button>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <h4 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-3">{post.title}</h4>
                          <div className={`text-[hsl(var(--foreground))] leading-relaxed ${
                            expandedPosts.has(post.id) ? '' : 'line-clamp-3'
                          }`}>
                            {post.content}
                          </div>
                          {post.content.length > 200 && (
                            <button 
                              onClick={() => toggleExpanded(post.id)}
                              className="text-emerald-600 text-sm font-medium mt-2 hover:text-emerald-700 transition-colors"
                            >
                              {expandedPosts.has(post.id) ? 'Show less' : 'Read more'}
                            </button>
                          )}
                        </div>

                        {/* Post Images */}
                        {post.imageUrls.length > 0 && (
                          <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl overflow-hidden">
                              {post.imageUrls.map((image, index) => (
                                <img 
                                  key={index}
                                  src={image} 
                                  alt={`Post image ${index + 1}`}
                                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Post Tags */}
                        {post.tags.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map(tag => (
                                <button
                                  key={tag} 
                                  onClick={() => handleTagClick(tag)}
                                  className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                                    selectedTags.includes(tag)
                                      ? 'bg-emerald-100 text-emerald-800 ring-1 ring-green-300'
                                      : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                                  }`}
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="px-6 py-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <button 
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center gap-2 transition-colors ${
                                post.isLiked ? 'text-red-600' : 'text-[hsl(var(--muted-foreground))] hover:text-red-600'
                              }`}
                            >
                              <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                              <span className="text-sm font-medium">{post.likesCount}</span>
                            </button>
                            <button 
                              onClick={() => toggleComments(post.id)}
                              className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-blue-600 transition-colors"
                            >
                              <MessageSquare className="w-5 h-5" />
                              <span className="text-sm font-medium">{post.commentsCount}</span>
                            </button>
                            <button className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-emerald-600 transition-colors">
                              <Share2 className="w-5 h-5" />
                              <span className="text-sm font-medium">Share</span>
                            </button>
                          </div>
                          <button className="text-[hsl(var(--muted-foreground))] hover:text-yellow-600 transition-colors">
                            <Bookmark className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Comments Section */}
                        {showComments.has(post.id) && (
                          <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
                            {/* Add Comment */}
                            <div className="flex gap-3 mb-4">
                              <img 
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" 
                                alt="Your avatar" 
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1 flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  value={newComment[post.id] || ''}
                                  onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                                  onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                                  className="flex-1 px-3 py-2 border border-[hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                />
                                <button 
                                  onClick={() => handleComment(post.id)}
                                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Recent Comments */}
                            {post.recentComments && post.recentComments.length > 0 && (
                              <div className="space-y-3">
                                {post.recentComments.map(comment => (
                                  <div key={comment.id} className="flex gap-3">
                                    <img 
                                      src={comment.user.avatarUrl} 
                                      alt={comment.user.username} 
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="bg-[hsl(var(--muted))] rounded-lg px-3 py-2">
                                        <div className="font-semibold text-sm text-[hsl(var(--foreground))]">{comment.user.username}</div>
                                        <div className="text-sm text-[hsl(var(--foreground))]">{comment.content}</div>
                                      </div>
                                      <div className="flex items-center gap-4 mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        <button className="hover:text-[hsl(var(--foreground))]">Reply</button>
                                        <button className="hover:text-[hsl(var(--foreground))]">Like</button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  hasPlants === false ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-900/30">
                      <PlantIconLarge />
                      <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">Add a plant to unlock personalized content</h3>
                      <p className="text-[hsl(var(--muted-foreground))] mb-6 max-w-md mx-auto">Your feed gets better with your garden. Add your first plant to see tailored discussions, tips, and local shop recommendations.</p>
                      <div className="flex items-center justify-center gap-3">
                        <a href="/my-plants" className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">Add a Plant</a>
                        <a href="/find-plant" className="px-6 py-3 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-lg hover:bg-[hsl(var(--muted))] transition-colors font-medium">Identify a Plant</a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-900/30">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">No posts found</h3>
                      <p className="text-[hsl(var(--muted-foreground))] mb-6">Be the first to share something with the community!</p>
                      <button 
                        onClick={() => setShowCreatePost(true)}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium"
                      >
                        Create First Post
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            {stats && (
              <div className="bg-[hsl(var(--card))] rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-900/30 p-6">
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Community Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Total Members</span>
                    <span className="font-semibold text-[hsl(var(--foreground))]">{stats.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">Total Posts</span>
                    <span className="font-semibold text-[hsl(var(--foreground))]">{stats.totalPosts.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[hsl(var(--muted-foreground))]">This Week</span>
                    <span className="font-semibold text-emerald-600">+{stats.thisWeekPosts}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Trending Tags */}
            <div className="bg-[hsl(var(--card))] rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-900/30 p-6">
              <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Trending Topics
              </h3>
              <div className="space-y-2">
                {trendingTags.map(tag => (
                  <button
                    key={tag.tag}
                    onClick={() => handleTagClick(tag.tag)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedTags.includes(tag.tag)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                    }`}
                  >
                    <span className="font-medium">#{tag.tag}</span>
                    <span className="text-sm bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] px-2 py-1 rounded-full">
                      {tag.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[hsl(var(--card))] rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-900/30 p-6">
              <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-[hsl(var(--foreground))]">Create Post</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-[hsl(var(--muted))] rounded-lg transition-colors">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-[hsl(var(--foreground))]">Share Photo</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-[hsl(var(--muted))] rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-[hsl(var(--foreground))]">Ask Question</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[hsl(var(--card))] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[hsl(var(--border))]">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[hsl(var(--foreground))]">Create New Post</h3>
                <button 
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Post Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'question', label: 'Question', icon: MessageCircle, color: 'blue' },
                    { value: 'showcase', label: 'Showcase', icon: Camera, color: 'green' },
                    { value: 'tip', label: 'Care Tip', icon: Award, color: 'yellow' },
                    { value: 'trade', label: 'Trade', icon: Share2, color: 'purple' }
                  ].map(type => (
                    <button
                      key={type.value}
                      onClick={() => setNewPost({ ...newPost, postType: type.value as any })}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        newPost.postType === type.value
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : 'border-[hsl(var(--border))] hover:border-[hsl(var(--border))]'
                      }`}
                    >
                      <type.icon className={`w-5 h-5 text-${type.color}-600`} />
                      <span className="font-medium text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your post title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={6}
                  placeholder="Share your thoughts, questions, or tips..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Tags</label>
                <input
                  type="text"
                  value={newPost.tags.join(', ')}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                  className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="monstera, care-help, beginner"
                />
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Separate tags with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Images</label>
                <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden"
                  />
                  <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-[hsl(var(--muted-foreground))] mb-2">Drop images here or click to upload</p>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    Choose Images
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[hsl(var(--border))] flex gap-3">
              <button
                onClick={handleCreatePost}
                disabled={!newPost.title.trim() || !newPost.content.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Post
              </button>
              <button
                onClick={() => setShowCreatePost(false)}
                className="flex-1 px-6 py-3 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-lg hover:bg-[hsl(var(--muted))] transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shop Details Modal */}
      {selectedShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[hsl(var(--card))] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[hsl(var(--border))]">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[hsl(var(--foreground))]">{selectedShop.name}</h3>
                <button 
                  onClick={() => setSelectedShop(null)}
                  className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < Math.floor(selectedShop.averageRating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">
                  {selectedShop.averageRating.toFixed(1)} ({selectedShop.reviewCount} reviews)
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[hsl(var(--muted-foreground))] mt-0.5" />
                  <div>
                    <p className="font-medium text-[hsl(var(--foreground))]">Address</p>
                    <p className="text-[hsl(var(--muted-foreground))]">{selectedShop.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[hsl(var(--muted-foreground))] mt-0.5" />
                  <div>
                    <p className="font-medium text-[hsl(var(--foreground))]">Phone</p>
                    <p className="text-[hsl(var(--muted-foreground))]">{selectedShop.phone}</p>
                  </div>
                </div>

                {selectedShop.website && (
                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-[hsl(var(--muted-foreground))] mt-0.5" />
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">Website</p>
                      <a 
                        href={selectedShop.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline"
                      >
                        {selectedShop.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-[hsl(var(--foreground))] mb-3">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedShop.services.map(service => (
                    <span 
                      key={service} 
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {selectedShop.reviews && selectedShop.reviews.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[hsl(var(--foreground))] mb-4">Recent Reviews</h4>
                  <div className="space-y-4">
                    {selectedShop.reviews.map(review => (
                      <div key={review.id} className="border-l-4 border-green-200 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <img 
                            src={review.user.avatarUrl} 
                            alt={review.user.username}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium text-sm">{review.user.username}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[hsl(var(--muted-foreground))]">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[hsl(var(--foreground))] text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[hsl(var(--border))] flex gap-3">
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium">
                Contact Shop
              </button>
              <button className="flex-1 px-6 py-3 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-lg hover:bg-[hsl(var(--muted))] transition-colors font-medium">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;

// Simple inline icons for blank states to avoid extra asset imports
function PlantIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-emerald-600">
      <path d="M12 2C8 2 6 6 6 6s4 0 6-2c2 2 6 2 6 2s-2-4-6-4z" />
      <path d="M6 10c0 3.866 3.134 7 7 7h1v5h-2v-3.5C8.91 17.83 6 14.33 6 10z" />
    </svg>
  );
}

function PlantIconLarge() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mx-auto mb-4 text-green-500">
      <path d="M12 2C8 2 6 6 6 6s4 0 6-2c2 2 6 2 6 2s-2-4-6-4z" />
      <path d="M6 10c0 3.866 3.134 7 7 7h1v5h-2v-3.5C8.91 17.83 6 14.33 6 10z" />
    </svg>
  );
}