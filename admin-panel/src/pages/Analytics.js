import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';
import { apiService } from '../services/apiService';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('completion');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Get real admin stats and analytics data
      const [adminStats, analyticsData, leaderboardData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAnalytics(),
        apiService.getLeaderboard('overall', 10)
      ]);
      
      // Combine real admin stats with analytics
      const realAnalytics = {
        totalUsers: adminStats?.users || 0,
        tutorials: {
          totalCompleted: analyticsData?.data?.tutorials?.totalCompleted || 0,
          averageProgress: analyticsData?.data?.tutorials?.averageProgress || 0,
          completionRate: analyticsData?.data?.tutorials?.completionRate || 0
        },
        simulations: {
          totalCompleted: analyticsData?.data?.simulations?.totalCompleted || 0,
          averageScore: analyticsData?.data?.simulations?.averageScore || 0,
          completionRate: analyticsData?.data?.simulations?.completionRate || 0
        },
        quizzes: {
          totalCompleted: adminStats?.totalQuizzes || 0,
          averageScore: adminStats?.averageScore || 0,
          completionRate: adminStats?.completionRate || 0
        },
        engagement: {
          activeUsers: adminStats?.activeUsers || 0,
          activeUserRate: adminStats?.activeUsers && adminStats?.users
            ? Math.round((adminStats.activeUsers / adminStats.users) * 100)
            : 0,
          averageTimeSpent: analyticsData?.data?.engagement?.averageTimeSpent || 0
        }
      };
      
      console.log('Real analytics data loaded:', realAnalytics);
      setAnalytics(realAnalytics);
      setLeaderboard(leaderboardData?.data?.leaderboard || leaderboardData?.leaderboard || []);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const blob = await apiService.exportAnalytics('csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `analytics-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Analytics data exported successfully');
    } catch (error) {
      toast.error('Failed to export analytics data');
      console.error('Error exporting analytics:', error);
    }
  };

  // Mock time series data for charts
  const timeSeriesData = [
    { date: '2024-01-01', users: 120, completions: 45, scores: 78 },
    { date: '2024-01-02', users: 135, completions: 52, scores: 82 },
    { date: '2024-01-03', users: 148, completions: 61, scores: 79 },
    { date: '2024-01-04', users: 162, completions: 58, scores: 85 },
    { date: '2024-01-05', users: 171, completions: 67, scores: 81 },
    { date: '2024-01-06', users: 189, completions: 74, scores: 88 },
    { date: '2024-01-07', users: 203, completions: 82, scores: 86 },
  ];

  const contentTypeData = analytics ? [
    { name: 'Tutorials', value: analytics.tutorials.completionRate, color: '#10B981' },
    { name: 'Simulations', value: analytics.simulations.completionRate, color: '#3B82F6' },
    { name: 'Quizzes', value: analytics.quizzes.completionRate, color: '#F59E0B' },
  ] : [];

  const MetricCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className={`text-sm flex items-center mt-1 ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm lg:text-base text-gray-600">Detailed insights into user engagement and learning progress</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={() => handleExport('analytics')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title="Total Users"
            value={analytics.totalUsers.toLocaleString()}
            change={12}
            icon={Users}
            color="bg-blue-500"
          />
          <MetricCard
            title="Active Users"
            value={analytics.engagement.activeUsers.toLocaleString()}
            change={analytics.engagement.activeUserRate}
            icon={TrendingUp}
            color="bg-green-500"
          />
          <MetricCard
            title="Avg. Completion Rate"
            value={`${Math.round((analytics.tutorials.completionRate + analytics.simulations.completionRate + analytics.quizzes.completionRate) / 3)}%`}
            change={8}
            icon={BookOpen}
            color="bg-purple-500"
          />
          <MetricCard
            title="Avg. Quiz Score"
            value={`${analytics.quizzes.averageScore}%`}
            change={5}
            icon={Award}
            color="bg-yellow-500"
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* User Activity Over Time */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900">User Activity Trend</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="users">Active Users</option>
              <option value="completion">Completions</option>
              <option value="scores">Avg Scores</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Content Type Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Completion Rates by Content Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={contentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {contentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Performance Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Tutorial Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Tutorial Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Completed</span>
                <span className="font-semibold">{analytics.tutorials.totalCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Progress</span>
                <span className="font-semibold">{analytics.tutorials.averageProgress}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold">{analytics.tutorials.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${analytics.tutorials.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Simulation Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Simulation Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Completed</span>
                <span className="font-semibold">{analytics.simulations.totalCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Score</span>
                <span className="font-semibold">{analytics.simulations.averageScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold">{analytics.simulations.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${analytics.simulations.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quiz Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Quiz Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Completed</span>
                <span className="font-semibold">{analytics.quizzes.totalCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Score</span>
                <span className="font-semibold">{analytics.quizzes.averageScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold">{analytics.quizzes.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${analytics.quizzes.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Avg Quiz Score
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.map((user, index) => (
                <tr key={user.userId}>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.userId}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.completionRate.toFixed(1)}%
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {user.averageQuizScore}%
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {new Date(user.lastActivity).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;