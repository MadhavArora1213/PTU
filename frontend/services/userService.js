import api from './api';

export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/user/profile', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserPoints = async () => {
  try {
    const response = await api.get('/user/points');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserAchievements = async () => {
  try {
    const response = await api.get('/user/achievements');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};