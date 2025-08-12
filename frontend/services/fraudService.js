import api from './api';

export const getFraudReports = async () => {
  try {
    const response = await api.get('/fraud/reports');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFraudReportById = async (reportId) => {
  try {
    const response = await api.get(`/fraud/reports/${reportId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const submitFraudReport = async (reportData) => {
  try {
    const response = await api.post('/fraud/report', reportData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifyFraudReport = async (reportId) => {
  try {
    const response = await api.post(`/fraud/report/${reportId}/verify`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFraudAlerts = async () => {
  try {
    const response = await api.get('/fraud/alerts');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getHyperlocalAlerts = async (latitude, longitude) => {
  try {
    const response = await api.get(`/fraud/alerts/local?lat=${latitude}&lng=${longitude}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};