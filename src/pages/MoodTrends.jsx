import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Calendar, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const MoodTrends = () => {
  const [loading, setLoading] = useState(true);
  const [trendsData, setTrendsData] = useState(null);
  const [selectedDays, setSelectedDays] = useState(30);
  const [chartType, setChartType] = useState('line');

  const dayOptions = [7, 14, 30, 60, 90];

  const moodColors = {
    1: '#ef4444', // red
    2: '#f97316', // orange
    3: '#eab308', // yellow
    4: '#22c55e', // green
    5: '#3b82f6'  // blue
  };

  const moodLabels = {
    1: 'Very Sad',
    2: 'Sad',
    3: 'Neutral',
    4: 'Happy',
    5: 'Very Happy'
  };

  useEffect(() => {
    loadMoodTrends();
  }, [selectedDays]);

  const loadMoodTrends = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/journal/mood-trends?days=${selectedDays}`);
      setTrendsData(response.data);
    } catch (error) {
      console.error('Error loading mood trends:', error);
      toast.error('Failed to load mood trends');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-sm text-gray-600">
            Mood: {data.moodEmoji} {moodLabels[data.mood]}
          </p>
        </div>
      );
    }
    return null;
  };

  const getMoodDistributionData = () => {
    if (!trendsData?.statistics?.moodDistribution) return [];
    
    return Object.entries(trendsData.statistics.moodDistribution).map(([mood, count]) => ({
      name: moodLabels[mood],
      value: count,
      color: moodColors[mood]
    })).filter(item => item.value > 0);
  };

  const getTrendDirection = () => {
    if (!trendsData?.statistics?.improvementTrend) return 'stable';
    return trendsData.statistics.improvementTrend;
  };

  const getTrendIcon = () => {
    const trend = getTrendDirection();
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = () => {
    const trend = getTrendDirection();
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!trendsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No mood data available yet.</p>
        <p className="text-sm text-gray-400 mt-2">Start journaling to see your mood trends!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mood Trends</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track your emotional journey over time
            </p>
          </div>
          <TrendingUp className="h-6 w-6 text-blue-500" />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <label className="text-xs font-medium text-gray-700">Time Period:</label>
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {dayOptions.map(days => (
                <option key={days} value={days}>
                  Last {days} days
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'line' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Line Chart"
            >
              <TrendingUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'bar' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Bar Chart"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Entries</p>
              <p className="text-lg font-bold text-gray-900">
                {trendsData.statistics.totalEntries}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Average Mood</p>
              <p className="text-lg font-bold text-gray-900">
                {trendsData.statistics.averageMood}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Most Common</p>
              <p className="text-lg font-bold text-gray-900">
                {moodLabels[trendsData.statistics.mostFrequentMood]}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <span className="text-xl">{getTrendIcon()}</span>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Trend</p>
              <p className={`text-lg font-bold capitalize ${getTrendColor()}`}>
                {getTrendDirection()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Mood Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={trendsData.moodTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[1, 5]} 
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(value) => moodLabels[value]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={trendsData.moodTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[1, 5]} 
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(value) => moodLabels[value]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="mood" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Mood Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getMoodDistributionData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getMoodDistributionData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Date Range Info */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-center">
          <p className="text-xs text-gray-600">
            Data from {formatDate(trendsData.dateRange.start)} to {formatDate(trendsData.dateRange.end)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodTrends;

