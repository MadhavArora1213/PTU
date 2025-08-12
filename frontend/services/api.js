import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with default config
// Use 10.0.2.2 for Android emulator to access localhost on host machine
const api = axios.create({
  baseURL: 'http://localhost:5003/api',
  timeout: 30000, // Increase timeout to 30 seconds
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear stored tokens
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        // Note: Navigation should be handled in the component that receives this error
        console.log('Token expired, please login again');
      } catch (storageError) {
        console.error('Error removing tokens from AsyncStorage:', storageError);
    }
    return Promise.reject(error);
  }
}
);

export default api;