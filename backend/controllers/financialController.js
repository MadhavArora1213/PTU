const db = require('../config/database');

// Budget planner functions
const createBudgetPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year, income, expenses, savings } = req.body;

    // Insert new budget plan
    const result = await db.query(
      'INSERT INTO budget_plans (user_id, month, year, income, expenses, savings) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, month, year, income, expenses, savings]
    );

    res.status(201).json({
      message: 'Budget plan created successfully',
      budgetPlan: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating budget plan:', error);
    res.status(500).json({ message: 'Server error while creating budget plan' });
  }
};

const getBudgetPlans = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT * FROM budget_plans WHERE user_id = $1 ORDER BY year DESC, month DESC',
      [userId]
    );

    res.json({
      budgetPlans: result.rows
    });
  } catch (error) {
    console.error('Error fetching budget plans:', error);
    res.status(500).json({ message: 'Server error while fetching budget plans' });
  }
};

const getBudgetPlanById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.params;

    const result = await db.query(
      'SELECT * FROM budget_plans WHERE id = $1 AND user_id = $2',
      [planId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Budget plan not found' });
    }

    // Get budget categories for this plan
    const categoriesResult = await db.query(
      'SELECT * FROM budget_categories WHERE plan_id = $1',
      [planId]
    );

    res.json({
      budgetPlan: result.rows[0],
      categories: categoriesResult.rows
    });
  } catch (error) {
    console.error('Error fetching budget plan:', error);
    res.status(500).json({ message: 'Server error while fetching budget plan' });
  }
};

const addBudgetCategory = async (req, res) => {
  try {
    const { planId } = req.params;
    const { categoryName, allocatedAmount } = req.body;

    // Verify the plan belongs to the user
    const planResult = await db.query(
      'SELECT user_id FROM budget_plans WHERE id = $1',
      [planId]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ message: 'Budget plan not found' });
    }

    if (planResult.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to budget plan' });
    }

    // Insert new budget category
    const result = await db.query(
      'INSERT INTO budget_categories (plan_id, category_name, allocated_amount) VALUES ($1, $2, $3) RETURNING *',
      [planId, categoryName, allocatedAmount]
    );

    res.status(201).json({
      message: 'Budget category added successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding budget category:', error);
    res.status(500).json({ message: 'Server error while adding budget category' });
  }
};

// Financial goals functions
const createFinancialGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goalType, targetAmount, targetDate } = req.body;

    const result = await db.query(
      'INSERT INTO financial_goals (user_id, goal_type, target_amount, target_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, goalType, targetAmount, targetDate]
    );

    res.status(201).json({
      message: 'Financial goal created successfully',
      goal: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating financial goal:', error);
    res.status(500).json({ message: 'Server error while creating financial goal' });
  }
};

const getFinancialGoals = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT * FROM financial_goals WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      goals: result.rows
    });
  } catch (error) {
    console.error('Error fetching financial goals:', error);
    res.status(500).json({ message: 'Server error while fetching financial goals' });
  }
};

const updateFinancialGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goalId } = req.params;
    const { currentAmount } = req.body;

    const result = await db.query(
      'UPDATE financial_goals SET current_amount = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      [currentAmount, goalId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Financial goal not found' });
    }

    res.json({
      message: 'Financial goal updated successfully',
      goal: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating financial goal:', error);
    res.status(500).json({ message: 'Server error while updating financial goal' });
  }
};

// EMI calculator function
const calculateEMI = async (req, res) => {
  try {
    const { principal, annualInterestRate, tenureInMonths } = req.body;

    // EMI formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
    // Where P = Principal, r = monthly interest rate, n = tenure in months
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const emi = principal * monthlyInterestRate * 
      Math.pow(1 + monthlyInterestRate, tenureInMonths) / 
      (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);

    const totalPayment = emi * tenureInMonths;
    const totalInterest = totalPayment - principal;

    res.json({
      principal,
      annualInterestRate,
      tenureInMonths,
      emi: parseFloat(emi.toFixed(2)),
      totalPayment: parseFloat(totalPayment.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2))
    });
  } catch (error) {
    console.error('Error calculating EMI:', error);
    res.status(500).json({ message: 'Server error while calculating EMI' });
  }
};

// SIP calculator function
const calculateSIP = async (req, res) => {
  try {
    const { monthlyInvestment, annualInterestRate, investmentPeriodInYears } = req.body;

    // SIP formula: FV = P × (((1 + i)^n - 1) / i) × (1 + i)
    // Where P = Monthly investment, i = monthly interest rate, n = number of months
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const numberOfMonths = investmentPeriodInYears * 12;
    
    const futureValue = monthlyInvestment * 
      (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1) / 
      monthlyInterestRate * (1 + monthlyInterestRate);

    const totalInvestment = monthlyInvestment * numberOfMonths;
    const wealthGained = futureValue - totalInvestment;

    res.json({
      monthlyInvestment,
      annualInterestRate,
      investmentPeriodInYears,
      futureValue: parseFloat(futureValue.toFixed(2)),
      totalInvestment: parseFloat(totalInvestment.toFixed(2)),
      wealthGained: parseFloat(wealthGained.toFixed(2))
    });
  } catch (error) {
    console.error('Error calculating SIP:', error);
    res.status(500).json({ message: 'Server error while calculating SIP' });
  }
};

module.exports = {
  createBudgetPlan,
  getBudgetPlans,
  getBudgetPlanById,
  addBudgetCategory,
  createFinancialGoal,
  getFinancialGoals,
  updateFinancialGoal,
  calculateEMI,
  calculateSIP
};