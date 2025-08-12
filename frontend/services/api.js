import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emulator can't reach host 'localhost'
const baseURL =
  Platform.OS === 'android'
    ? 'http://10.146.166.206:5000/api' // Android emulator
    : 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  timeout: 30000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
      }
    } catch (error) {
      console.error('Error getting token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        console.log('Token expired, please login again');
      } catch (storageError) {
        console.error('Error removing tokens from AsyncStorage:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;