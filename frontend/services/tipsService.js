import api from './api';

export const getFinancialTips = async (language = 'en') => {
  try {
    const response = await api.get(`/tips?language=${language}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTipById = async (tipId) => {
  try {
    const response = await api.get(`/tips/${tipId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getDailyTip = async () => {
  try {
    const response = await api.get('/tips/daily');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};