import api from './api';

export const getQuizzes = async () => {
  try {
    const response = await api.get('/quiz');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getQuizById = async (quizId) => {
  try {
    const response = await api.get(`/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const submitQuizAnswers = async (quizId, answers) => {
  try {
    const response = await api.post(`/quiz/${quizId}/submit`, { answers });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserQuizResults = async () => {
  try {
    const response = await api.get('/quiz/results');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};