import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.137.134:5000/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🚀 ApiService: Using REAL database data only');

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('adminToken');
        console.log('API Request interceptor - token available:', token ? 'Yes' : 'No');
        console.log('API Request to:', config.url);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('API Request - Authorization header set:', config.headers.Authorization ? 'Yes' : 'No');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        console.error('API Error:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Clear admin token and redirect to login if needed
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Analytics endpoints
  async getAnalytics() {
    try {
      const response = await this.api.get('/education-progress/analytics');
      return response?.data || response;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  async getLeaderboard(type = 'overall', limit = 10) {
    try {
      const response = await this.api.get(`/education-progress/leaderboard?type=${type}&limit=${limit}`);
      return response?.data || response;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  // User progress endpoints
  async getUserProgress(userId) {
    try {
      const response = await this.api.get(`/education-progress/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  }

  async getAllUsersProgress() {
    try {
      // This would need to be implemented in the backend
      const response = await this.api.get('/education-progress/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users progress:', error);
      return [];
    }
  }

  async resetUserProgress(userId) {
    try {
      const response = await this.api.delete(`/education-progress/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error resetting user progress:', error);
      throw error;
    }
  }

  // Content management endpoints
  async getTutorials(page = 1, limit = 10) {
    try {
      const response = await this.api.get(`/tutorials?page=${page}&limit=${limit}`);
      return response?.data || response || [];
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      throw error;
    }
  }

  async getQuizzes(page = 1, limit = 10) {
    try {
      const response = await this.api.get(`/quizzes?page=${page}&limit=${limit}`);
      return response?.data || response || [];
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  }

  async getSimulations() {
    try {
      // Mock data for simulations - these are more complex and would need separate implementation
      return [
        {
          id: 'investment-fraud',
          title: 'Investment Fraud Simulation',
          description: 'Interactive investment fraud scenario',
          difficulty: 'advanced',
          isActive: true,
          createdAt: '2024-01-12',
          updatedAt: '2024-01-22'
        },
        {
          id: 'employment-fraud',
          title: 'Employment Fraud Simulation',
          description: 'Interactive employment fraud scenario',
          difficulty: 'intermediate',
          isActive: true,
          createdAt: '2024-01-08',
          updatedAt: '2024-01-16'
        }
      ];
    } catch (error) {
      console.error('Error fetching simulations:', error);
      return [];
    }
  }

  // Content CRUD operations
  async createTutorial(tutorialData) {
    try {
      const response = await this.api.post('/tutorials', tutorialData);
      return response.data;
    } catch (error) {
      console.error('Error creating tutorial:', error);
      throw error;
    }
  }

  async updateTutorial(id, tutorialData) {
    try {
      const response = await this.api.put(`/tutorials/${id}`, tutorialData);
      return response.data;
    } catch (error) {
      console.error('Error updating tutorial:', error);
      throw error;
    }
  }

  async deleteTutorial(id) {
    try {
      const response = await this.api.delete(`/tutorials/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      throw error;
    }
  }

  async createQuiz(quizData) {
    try {
      const response = await this.api.post('/quizzes', quizData);
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  }

  async updateQuiz(id, quizData) {
    try {
      const response = await this.api.put(`/quizzes/${id}`, quizData);
      return response.data;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  }

  async deleteQuiz(id) {
    try {
      const response = await this.api.delete(`/quizzes/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  }

  // System settings
  async getSettings() {
    try {
      // Mock data for now
      return {
        siteName: 'ArthRakshak Education',
        maintenanceMode: false,
        allowRegistration: true,
        maxUsersPerDay: 1000,
        emailNotifications: true,
        backupFrequency: 'daily',
        dataRetentionDays: 365
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {};
    }
  }

  async updateSettings(settings) {
    try {
      const response = await this.api.put('/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Export data
  async exportUserData(format = 'csv') {
    try {
      const response = await this.api.get(`/export/users?format=${format}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  async exportAnalytics(format = 'csv') {
    try {
      const response = await this.api.get(`/admin/export/analytics?format=${format}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error exporting analytics:', error);
      throw error;
    }
  }

  // Admin authentication methods
  async adminLogin(username, password) {
    try {
      const response = await this.api.post('/admin/login', { username, password });
      console.log('Admin login response:', response);
      
      if (response && response.accessToken) {
        localStorage.setItem('adminToken', response.accessToken);
        console.log('Token stored in localStorage:', localStorage.getItem('adminToken') ? 'Success' : 'Failed');
        console.log('Token length:', response.accessToken.length);
        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Login failed');
      } else {
        throw new Error('Server is not responding. Please check if the backend is running.');
      }
    }
  }

  async adminLogout() {
    try {
      const response = await this.api.post('/admin/logout');
      localStorage.removeItem('adminToken');
      return response.data;
    } catch (error) {
      console.error('Admin logout error:', error);
      // Still remove token even if API call fails
      localStorage.removeItem('adminToken');
      throw error;
    }
  }

  // Admin stats method
  async getAdminStats() {
    try {
      const response = await this.api.get('/admin/stats');
      return response;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  // User management methods
  async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      const response = await this.api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const response = await this.api.get(`/admin/users/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await this.api.put(`/admin/users/${id}`, userData);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const response = await this.api.delete(`/admin/users/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Quiz results management
  async getQuizResults(page = 1, limit = 20) {
    try {
      const response = await this.api.get(`/admin/quiz-results?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      throw error;
    }
  }

  // Fraud reports management
  async getFraudReports(page = 1, limit = 20, status = 'all') {
    try {
      const response = await this.api.get(`/admin/fraud-reports?page=${page}&limit=${limit}&status=${status}`);
      return response;
    } catch (error) {
      console.error('Error fetching fraud reports:', error);
      throw error;
    }
  }

  async updateFraudReport(id, reportData) {
    try {
      const response = await this.api.put(`/admin/fraud-reports/${id}`, reportData);
      return response;
    } catch (error) {
      console.error('Error updating fraud report:', error);
      throw error;
    }
  }

  // Utility methods
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: 'API unavailable' };
    }
  }

  async testConnection() {
    try {
      const response = await this.api.get('/');
      return { status: 'success', data: response };
    } catch (error) {
      console.error('Connection test failed:', error);
      return { status: 'error', message: error.message };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;