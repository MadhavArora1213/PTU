import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async (refreshToken) => {
  try {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};