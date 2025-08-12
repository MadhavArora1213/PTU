const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  createBudgetPlan,
  getBudgetPlans,
  getBudgetPlanById,
  addBudgetCategory,
  createFinancialGoal,
  getFinancialGoals,
  updateFinancialGoal,
  calculateEMI,
  calculateSIP
} = require('../controllers/financialController');

// Budget planner routes
router.post('/budget', authenticateToken, createBudgetPlan);
router.get('/budget', authenticateToken, getBudgetPlans);
router.get('/budget/:planId', authenticateToken, getBudgetPlanById);
router.post('/budget/:planId/category', authenticateToken, addBudgetCategory);

// Financial goals routes
router.post('/goals', authenticateToken, createFinancialGoal);
router.get('/goals', authenticateToken, getFinancialGoals);
router.put('/goals/:goalId', authenticateToken, updateFinancialGoal);

// Calculator routes
router.post('/calculate/emi', calculateEMI);
router.post('/calculate/sip', calculateSIP);

module.exports = router;