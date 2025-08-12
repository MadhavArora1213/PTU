import api from './api';

// Budget planner functions
export const createBudgetPlan = async (budgetData) => {
  try {
    const response = await api.post('/financial/budget', budgetData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBudgetPlans = async () => {
  try {
    const response = await api.get('/financial/budget');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBudgetPlanById = async (planId) => {
  try {
    const response = await api.get(`/financial/budget/${planId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addBudgetCategory = async (planId, categoryData) => {
  try {
    const response = await api.post(`/financial/budget/${planId}/category`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Financial goals functions
export const createFinancialGoal = async (goalData) => {
  try {
    const response = await api.post('/financial/goals', goalData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFinancialGoals = async () => {
  try {
    const response = await api.get('/financial/goals');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateFinancialGoal = async (goalId, goalData) => {
  try {
    const response = await api.put(`/financial/goals/${goalId}`, goalData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Calculator functions
export const calculateEMI = async (emiData) => {
  try {
    const response = await api.post('/financial/calculate/emi', emiData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const calculateSIP = async (sipData) => {
  try {
    const response = await api.post('/financial/calculate/sip', sipData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};