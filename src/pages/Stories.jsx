import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Filter, 
  Search,
  Heart,
  MessageCircle,
  Calendar,
  Tag
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Stories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    sort: 'newest',
    page: 1
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCategories();
    loadStories();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const response = await api.get('/stories/categories/list');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadStories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: filters.page,
        limit: 10,
        sort: filters.sort
      });
      
      if (filters.category) {
        params.append('category', filters.category);
      }

      const response = await api.get(`/stories?${params}`);
      setStories(response.data.stories);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (storyId) => {
    try {
      const response = await api.post(`/stories/${storyId}/like`);
      setStories(stories.map(story => 
        story._id === storyId 
          ? { ...story, likes: response.data.likes, userLiked: response.data.userLiked }
          : story
      ));
    } catch (error) {
      console.error('Error liking story:', error);
      toast.error('Failed to like story');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Anxiety': 'bg-red-100 text-red-800',
      'Depression': 'bg-blue-100 text-blue-800',
      'Recovery': 'bg-green-100 text-green-800',
      'Coping': 'bg-yellow-100 text-yellow-800',
      'Hope': 'bg-purple-100 text-purple-800',
      'Gratitude': 'bg-pink-100 text-pink-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Community Stories</h1>
            <p className="text-sm text-gray-600 mt-1">
              Share and read anonymous stories of hope, recovery, and support
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Filter className="h-3 w-3 mr-1.5" />
              Filters
            </button>
            <button
              onClick={() => navigate('/stories/new')}
              className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="h-3 w-3 mr-1.5" />
              Share Story
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stories List */}
      <div className="space-y-3">
        {stories.length > 0 ? (
          stories.map((story) => (
            <div
              key={story._id}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/stories/${story._id}`)}
            >
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {story.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(story.category)}`}>
                    {story.category}
                  </span>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(story.createdAt)}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(story._id);
                    }}
                    className={`flex items-center text-xs ${
                      story.userLiked 
                        ? 'text-red-600' 
                        : 'text-gray-500 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`h-3 w-3 mr-1 ${story.userLiked ? 'fill-current' : ''}`} />
                    {story.likes}
                  </button>
                </div>
              </div>

              {story.tags && story.tags.length > 0 && (
                <div className="flex items-center mt-2.5 pt-2.5 border-t border-gray-100">
                  <Tag className="h-3 w-3 text-gray-400 mr-1.5" />
                  <div className="flex flex-wrap gap-1">
                    {story.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {story.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{story.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-1.5">No stories found</h3>
            <p className="text-sm text-gray-500 mb-3">
              {filters.category 
                ? `No stories in the "${filters.category}" category yet.`
                : 'No stories have been shared yet.'
              }
            </p>
            <button
              onClick={() => navigate('/stories/new')}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm"
            >
              Be the first to share
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-700">
              Showing page {pagination.currentPage} of {pagination.totalPages}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-2.5 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-2.5 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;

