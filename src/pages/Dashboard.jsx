import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Calendar,
  Plus,
  Edit,
  RefreshCw,
  Sparkles,
  Clock,
  Heart
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recentEntries, setRecentEntries] = useState([]);
  const [todayEntry, setTodayEntry] = useState(null);
  const [apiError, setApiError] = useState(false);
  
  const [formData, setFormData] = useState({
    content: '',
    mood: 3,
    moodEmoji: '😐'
  });

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: 'bg-red-500' },
    { value: 2, emoji: '😕', label: 'Sad', color: 'bg-orange-500' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'bg-yellow-500' },
    { value: 4, emoji: '🙂', label: 'Happy', color: 'bg-blue-500' },
    { value: 5, emoji: '😊', label: 'Very Happy', color: 'bg-green-500' }
  ];

  useEffect(() => {
    loadDashboardData();
    
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, setting loading to false');
        setLoading(false);
        setApiError(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setApiError(false);
      
      const today = new Date().toISOString().split('T')[0];
      
      // Load recent entries first
      try {
        const recentResponse = await api.get('/journal/recent?limit=5');
        setRecentEntries(recentResponse.data.entries || []);
      } catch (recentError) {
        console.log('Recent entries not available:', recentError);
        setRecentEntries([]);
      }
      
      // Load today's entry
      try {
        const todayResponse = await api.get(`/journal/entry/${today}`);
        if (todayResponse.data.entry) {
          setTodayEntry(todayResponse.data.entry);
          setFormData({
            content: todayResponse.data.entry.content,
            mood: todayResponse.data.entry.mood,
            moodEmoji: todayResponse.data.entry.moodEmoji || moodOptions[todayResponse.data.entry.mood - 1].emoji
          });
        }
      } catch (todayError) {
        if (todayError.response?.status !== 404) {
          console.log('Today entry error:', todayError);
        }
        setTodayEntry(null);
        setFormData({
          content: '',
          mood: 3,
          moodEmoji: '😐'
        });
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setApiError(true);
      
      setRecentEntries([]);
      setTodayEntry(null);
      setFormData({
        content: '',
        mood: 3,
        moodEmoji: '😐'
      });
      
      if (error.response?.status === 401) {
        toast.error('Please log in again');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMoodChange = (mood) => {
    const moodOption = moodOptions.find(option => option.value === mood);
    setFormData({
      ...formData,
      mood,
      moodEmoji: moodOption.emoji
    });
  };

  const handleAIMoodAnalysis = async () => {
    if (!formData.content.trim()) return;
    
    try {
      const response = await api.post('/ai/analyze-mood', {
        content: formData.content
      });
      
      const suggestedMood = response.data.suggestedMood;
      const moodOption = moodOptions.find(option => option.value === suggestedMood);
      
      setFormData({
        ...formData,
        mood: suggestedMood,
        moodEmoji: moodOption.emoji
      });
      
      toast.success(`AI suggests mood: ${moodOption.label}`);
    } catch (error) {
      console.error('AI mood analysis error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      toast.error('Please write something in your journal entry');
      return;
    }

    setSaving(true);
    try {
      // Auto-analyze mood with AI before saving
      let finalMood = formData.mood;
      let finalMoodEmoji = formData.moodEmoji;
      
      try {
        const aiResponse = await api.post('/ai/analyze-mood', {
          content: formData.content
        });
        finalMood = aiResponse.data.suggestedMood;
        const moodOption = moodOptions.find(option => option.value === finalMood);
        finalMoodEmoji = moodOption.emoji;
      } catch (error) {
        console.log('AI mood analysis failed, using manual selection');
      }

      const response = await api.post('/journal/entry', {
        content: formData.content,
        mood: finalMood,
        moodEmoji: finalMoodEmoji
      });

      setTodayEntry(response.data.entry);
      setFormData({
        ...formData,
        mood: finalMood,
        moodEmoji: finalMoodEmoji
      });
      toast.success(response.data.message);
      
      // Reload recent entries
      const recentResponse = await api.get('/journal/recent?limit=5');
      setRecentEntries(recentResponse.data.entries || []);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save journal entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMoodEmoji = (mood) => {
    return moodOptions.find(option => option.value === mood)?.emoji || '😐';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Enhanced Welcome Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              {getGreeting()}, {user?.displayName || user?.username}! 👋
            </h1>
            <p className="text-sm lg:text-base text-gray-600">
              How are you feeling today? Take a moment to reflect and journal your thoughts.
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Entries</p>
                <p className="text-lg font-bold text-gray-900">{recentEntries.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Entry</p>
                <p className="text-lg font-bold text-gray-900">
                  {recentEntries.length > 0 ? formatDate(recentEntries[0].date) : 'None'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Streak</p>
                <p className="text-lg font-bold text-gray-900">
                  {recentEntries.length > 0 ? 'Active' : 'Start Today'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main Content - Journal Entry */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
                  {todayEntry ? 'Edit Today\'s Entry' : 'Today\'s Journal Entry'}
                </h2>
                <p className="text-sm text-gray-600">
                  {todayEntry ? 'Update your thoughts and feelings' : 'Start your daily reflection'}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              {/* Mood Selection */}
              <div>
                <label className="block text-sm lg:text-base font-semibold text-gray-900 mb-3">
                  How are you feeling today?
                </label>
                <div className="grid grid-cols-5 gap-2 lg:gap-3">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleMoodChange(option.value)}
                      className={`flex flex-col items-center p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                        formData.mood === option.value
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md shadow-blue-500/20'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl lg:text-3xl mb-1 lg:mb-2">{option.emoji}</span>
                      <span className="text-xs text-gray-700 text-center font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal Content */}
              <div>
                <label htmlFor="content" className="block text-sm lg:text-base font-semibold text-gray-900 mb-3">
                  What's on your mind? <span className="text-purple-600 text-xs">(AI will auto-detect mood)</span>
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="block w-full border border-gray-300 rounded-lg px-3 lg:px-4 py-2.5 lg:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 text-sm lg:text-base leading-relaxed"
                  placeholder="Write about your day, your thoughts, feelings, or anything you'd like to reflect on..."
                  maxLength={5000}
                />
                <div className="text-xs text-gray-500 mt-2 text-right">
                  {formData.content.length}/5000 characters
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || !formData.content.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 lg:py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm lg:text-base shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {todayEntry ? <Edit className="h-4 w-4 lg:h-5 lg:w-5 mr-2" /> : <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />}
                    {todayEntry ? 'Update Entry' : 'Save Entry'}
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/journal')}
                className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-200 group transform hover:scale-[1.02]"
              >
                <div className="p-1.5 lg:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                </div>
                <div className="ml-2.5 lg:ml-3">
                  <div className="font-semibold text-gray-900 text-sm">View All Entries</div>
                  <div className="text-xs text-gray-500">Browse your journal history</div>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/mood-trends')}
                className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-300 transition-all duration-200 group transform hover:scale-[1.02]"
              >
                <div className="p-1.5 lg:p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
                </div>
                <div className="ml-2.5 lg:ml-3">
                  <div className="font-semibold text-gray-900 text-sm">Mood Trends</div>
                  <div className="text-xs text-gray-500">See your mood patterns</div>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/stories')}
                className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:border-purple-300 transition-all duration-200 group transform hover:scale-[1.02]"
              >
                <div className="p-1.5 lg:p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Users className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
                </div>
                <div className="ml-2.5 lg:ml-3">
                  <div className="font-semibold text-gray-900 text-sm">Community</div>
                  <div className="text-xs text-gray-500">Read and share stories</div>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/ai-health')}
                className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 transition-all duration-200 group transform hover:scale-[1.02]"
              >
                <div className="p-1.5 lg:p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-indigo-600" />
                </div>
                <div className="ml-2.5 lg:ml-3">
                  <div className="font-semibold text-gray-900 text-sm">AI Health Journalist</div>
                  <div className="text-xs text-gray-500">Your ultimate health assistance</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">Recent Entries</h3>
            {recentEntries.length > 0 ? (
              <div className="space-y-3">
                {recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
                    onClick={() => navigate(`/journal?date=${entry.date.split('T')[0]}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-900 line-clamp-2 leading-relaxed font-medium">
                          {entry.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1.5 font-medium">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                      <span className="text-xl lg:text-2xl ml-2.5 lg:ml-3 flex-shrink-0">
                        {getMoodEmoji(entry.mood)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 lg:py-8">
                <div className="text-4xl lg:text-5xl mb-3">📝</div>
                <p className="text-gray-500 text-sm lg:text-base font-medium mb-1.5">No recent entries yet.</p>
                <p className="text-gray-400 text-xs">Start journaling to see your entries here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
