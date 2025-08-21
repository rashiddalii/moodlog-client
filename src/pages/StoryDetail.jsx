import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Calendar, 
  Tag, 
  Flag,
  MoreHorizontal
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState(null);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  useEffect(() => {
    loadStory();
  }, [id]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stories/${id}`);
      setStory(response.data.story);
    } catch (error) {
      console.error('Error loading story:', error);
      toast.error('Failed to load story');
      navigate('/stories');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/stories/${id}/like`);
      setStory(prev => ({
        ...prev,
        likes: response.data.likes,
        userLiked: response.data.userLiked
      }));
    } catch (error) {
      console.error('Error liking story:', error);
      toast.error('Failed to like story');
    }
  };

  const handleFlag = async () => {
    if (!flagReason) {
      toast.error('Please select a reason for flagging');
      return;
    }

    try {
      await api.post(`/stories/${id}/flag`, { reason: flagReason });
      setShowFlagModal(false);
      setFlagReason('');
      toast.success('Story flagged successfully');
    } catch (error) {
      console.error('Error flagging story:', error);
      toast.error('Failed to flag story');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (!story) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Story not found.</p>
        <button
          onClick={() => navigate('/stories')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Stories
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/stories')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Stories
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFlagModal(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              title="Flag Story"
            >
              <Flag className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {story.title}
          </h1>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(story.category)}`}>
                {story.category}
              </span>
              
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(story.createdAt)}
              </div>
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                story.userLiked 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-500 hover:text-red-600 hover:bg-gray-50'
              }`}
            >
              <Heart className={`h-5 w-5 mr-2 ${story.userLiked ? 'fill-current' : ''}`} />
              {story.likes} {story.likes === 1 ? 'like' : 'likes'}
            </button>
          </div>

          {story.tags && story.tags.length > 0 && (
            <div className="flex items-center mb-6">
              <Tag className="h-4 w-4 text-gray-400 mr-2" />
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="prose max-w-none">
          <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
            {story.content}
          </div>
        </div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Flag Story
            </h3>
            <p className="text-gray-600 mb-4">
              Please select a reason for flagging this story:
            </p>
            
            <div className="space-y-2 mb-4">
              {['inappropriate', 'spam', 'harmful', 'other'].map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="flagReason"
                    value={reason}
                    checked={flagReason === reason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    className="mr-2"
                  />
                  <span className="capitalize">{reason}</span>
                </label>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFlag}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Flag Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDetail;
