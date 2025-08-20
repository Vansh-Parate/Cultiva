import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { MessageCircle, Heart, Share2, Search, Filter, Plus, Users, MapPin, Star, Camera, ThumbsUp, MessageSquare, Bookmark } from 'lucide-react';
import apiClient from "../lib/axios";

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  postType: 'question' | 'showcase' | 'tip' | 'trade';
  title: string;
  content: string;
  imageUrls: string[];
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  location?: string;
}

interface PlantShop {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  services: string[];
  rating: number;
  reviewCount: number;
  distance: string;
}

const Community = () => {
  const [activeTab, setActiveTab] = useState<'qa' | 'showcase' | 'tips' | 'shops'>('qa');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [shops, setShops] = useState<PlantShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    postType: 'question' as CommunityPost['postType'],
    title: '',
    content: '',
    tags: [] as string[],
    imageUrls: [] as string[]
  });

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      
      // Fetch community posts
      const postsResponse = await apiClient.get('/api/v1/community/posts');
      setPosts(postsResponse.data);

      // Fetch plant shops
      const shopsResponse = await apiClient.get('/api/v1/plant-shops');
      setShops(shopsResponse.data);

    } catch (err) {
      console.error('Failed to fetch community data:', err);
      // Fallback to demo data
      setPosts([
        {
          id: '1',
          userId: 'user1',
          userName: 'PlantLover123',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          postType: 'question',
          title: 'Why are my Monstera leaves turning yellow?',
          content: 'I\'ve had my Monstera for about 6 months and recently noticed the leaves are turning yellow. I water it weekly and it gets indirect sunlight. Any advice?',
          imageUrls: ['https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&h=300&fit=crop'],
          tags: ['monstera', 'yellow-leaves', 'care-help'],
          likes: 12,
          comments: 8,
          createdAt: '2024-01-15T10:30:00Z',
          location: 'New York, NY'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'GreenThumb',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          postType: 'showcase',
          title: 'My thriving Pothos collection!',
          content: 'After 2 years of care, my Pothos plants are finally reaching their full potential. Here\'s what I learned about proper care.',
          imageUrls: [
            'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&h=300&fit=crop'
          ],
          tags: ['pothos', 'success-story', 'care-tips'],
          likes: 45,
          comments: 15,
          createdAt: '2024-01-14T15:20:00Z',
          location: 'Los Angeles, CA'
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'PlantDoctor',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          postType: 'tip',
          title: 'Pro tip: Use coffee grounds for your plants!',
          content: 'Coffee grounds are excellent for acid-loving plants like Azaleas, Rhododendrons, and Blueberries. They provide nitrogen and improve soil structure.',
          imageUrls: [],
          tags: ['coffee-grounds', 'fertilizer', 'organic'],
          likes: 89,
          comments: 23,
          createdAt: '2024-01-13T09:15:00Z',
          location: 'Chicago, IL'
        }
      ]);

      setShops([
        {
          id: '1',
          name: 'Green Haven Nursery',
          address: '123 Plant Street, New York, NY 10001',
          phone: '(555) 123-4567',
          website: 'www.greenhaven.com',
          services: ['Plant Care', 'Landscaping', 'Plant Doctor'],
          rating: 4.8,
          reviewCount: 127,
          distance: '0.5 miles'
        },
        {
          id: '2',
          name: 'Botanical Gardens Shop',
          address: '456 Garden Ave, New York, NY 10002',
          phone: '(555) 987-6543',
          website: 'www.botanicalgardens.com',
          services: ['Plant Sales', 'Care Consultation', 'Workshops'],
          rating: 4.6,
          reviewCount: 89,
          distance: '1.2 miles'
        }
      ]);
    } finally {
      setLoading(false);
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
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = activeTab === 'qa' ? post.postType === 'question' :
                      activeTab === 'showcase' ? post.postType === 'showcase' :
                      activeTab === 'tips' ? post.postType === 'tip' : true;
    return matchesSearch && matchesTab;
  });

  const getPostTypeIcon = (type: CommunityPost['postType']) => {
    switch (type) {
      case 'question': return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'showcase': return <Camera className="w-5 h-5 text-green-600" />;
      case 'tip': return <Bookmark className="w-5 h-5 text-yellow-600" />;
      case 'trade': return <Share2 className="w-5 h-5 text-purple-600" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getPostTypeColor = (type: CommunityPost['postType']) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'showcase': return 'bg-green-100 text-green-800';
      case 'tip': return 'bg-yellow-100 text-yellow-800';
      case 'trade': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto ml-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community</h1>
              <p className="text-gray-600">Connect with fellow plant enthusiasts</p>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Post
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-5 h-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search posts, tips, or questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="nearby">Nearby</option>
              </select>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
            <button
              onClick={() => setActiveTab('qa')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'qa' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Q&A
            </button>
            <button
              onClick={() => setActiveTab('showcase')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'showcase' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Camera className="w-4 h-4 inline mr-2" />
              Showcase
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tips' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bookmark className="w-4 h-4 inline mr-2" />
              Care Tips
            </button>
            <button
              onClick={() => setActiveTab('shops')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'shops' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Local Shops
            </button>
          </div>

          {/* Content */}
          {activeTab === 'shops' ? (
            /* Plant Shops Directory */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map(shop => (
                <div key={shop.id} className="bg-white rounded-2xl shadow-sm p-6 border border-green-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{shop.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(shop.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({shop.reviewCount})</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{shop.distance}</span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>{shop.phone}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Services:</h4>
                    <div className="flex flex-wrap gap-1">
                      {shop.services.map(service => (
                        <span key={service} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                      Contact
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                      Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Community Posts */
            <div className="space-y-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <div key={post.id} className="bg-white rounded-2xl shadow-sm p-6 border border-green-100 hover:shadow-lg transition-shadow">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.userAvatar} 
                          alt={post.userName} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{post.userName}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPostTypeColor(post.postType)}`}>
                              {post.postType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            {post.location && (
                              <>
                                <span>•</span>
                                <span>{post.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {getPostTypeIcon(post.postType)}
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h4>
                      <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    </div>

                    {/* Post Images */}
                    {post.imageUrls.length > 0 && (
                      <div className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {post.imageUrls.map((image, index) => (
                            <img 
                              key={index}
                              src={image} 
                              alt={`Post image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
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
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <MessageSquare className="w-5 h-5" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                      <button className="text-gray-600 hover:text-yellow-600 transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-600">Be the first to share something with the community!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Post</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
                <select
                  value={newPost.postType}
                  onChange={(e) => setNewPost({ ...newPost, postType: e.target.value as CommunityPost['postType'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="question">Question</option>
                  <option value="showcase">Showcase</option>
                  <option value="tip">Care Tip</option>
                  <option value="trade">Plant Trade</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your post title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={6}
                  placeholder="Share your thoughts, questions, or tips..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newPost.tags.join(', ')}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="monstera, care-help, beginner"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreatePost}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Post
              </button>
              <button
                onClick={() => setShowCreatePost(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community; 