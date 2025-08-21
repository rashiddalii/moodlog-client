import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Calendar, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Save,
  X
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Journal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [entry, setEntry] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Sad' },
    { value: 2, emoji: '😕', label: 'Sad' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '🙂', label: 'Happy' },
    { value: 5, emoji: '😊', label: 'Very Happy' }
  ];

  const [formData, setFormData] = useState({
    content: '',
    mood: 3,
    moodEmoji: '😐'
  });

  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setCurrentDate(new Date(dateParam));
    }
    loadEntry();
  }, [currentDate]);

  const loadEntry = async () => {
    try {
      setLoading(true);
      const dateString = currentDate.toISOString().split('T')[0];
      const response = await api.get(`/journal/entry/${dateString}`);
      setEntry(response.data.entry);
      setFormData({
        content: response.data.entry.content,
        mood: response.data.entry.mood,
        moodEmoji: response.data.entry.moodEmoji || moodOptions[response.data.entry.mood - 1].emoji
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setEntry(null);
        setFormData({
          content: '',
          mood: 3,
          moodEmoji: '😐'
        });
      } else {
        console.error('Error loading entry:', error);
        toast.error('Failed to load journal entry');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      toast.error('Please write something in your journal entry');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post('/journal/entry', {
        content: formData.content,
        mood: formData.mood,
        moodEmoji: formData.moodEmoji
      });

      setEntry(response.data.entry);
      setIsEditing(false);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save journal entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const dateString = currentDate.toISOString().split('T')[0];
      await api.delete(`/journal/entry/${dateString}`);
      setEntry(null);
      setFormData({
        content: '',
        mood: 3,
        moodEmoji: '😐'
      });
      toast.success('Journal entry deleted successfully');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete journal entry');
    } finally {
      setDeleting(false);
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
    setSearchParams({ date: newDate.toISOString().split('T')[0] });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Journal</h1>
            <p className="text-gray-600 mt-1">
              Reflect on your thoughts and feelings
            </p>
          </div>
          <Calendar className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {formatDate(currentDate)}
            </h2>
            {isToday(currentDate) && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                Today
              </span>
            )}
          </div>
          
          <button
            onClick={() => navigateDate(1)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Journal Entry */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {!isEditing ? (
          // View Mode
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {entry ? 'Journal Entry' : 'No Entry for This Date'}
              </h3>
              <div className="flex space-x-2">
                {entry && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {entry ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{entry.moodEmoji}</span>
                  <div>
                    <p className="text-sm text-gray-600">Mood</p>
                    <p className="font-medium text-gray-900">
                      {moodOptions.find(option => option.value === entry.mood)?.label}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Entry</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{entry.content}</p>
                  </div>
                </div>

                {entry.tags && entry.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                  {entry.isEdited ? 'Last edited: ' : 'Created: '}
                  {new Date(entry.updatedAt).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No journal entry for this date.</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Write an Entry
                </button>
              </div>
            )}
          </div>
        ) : (
          // Edit Mode
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {entry ? 'Edit Entry' : 'New Entry'}
              </h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                  if (entry) {
                    setFormData({
                      content: entry.content,
                      mood: entry.mood,
                      moodEmoji: entry.moodEmoji || moodOptions[entry.mood - 1].emoji
                    });
                  } else {
                    setFormData({
                      content: '',
                      mood: 3,
                      moodEmoji: '😐'
                    });
                  }
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mood Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling today?
                </label>
                <div className="flex space-x-2">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleMoodChange(option.value)}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                        formData.mood === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{option.emoji}</span>
                      <span className="text-xs text-gray-600">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  What's on your mind?
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Write about your day, your thoughts, or anything you'd like to reflect on..."
                  maxLength={5000}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {formData.content.length}/5000
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={saving || !formData.content.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Save className="h-4 w-4 mr-2" />
                      Save Entry
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
