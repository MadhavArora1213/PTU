const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  submitFraudReport,
  getFraudReports,
  verifyFraudReport,
  detectFraud
} = require('../controllers/fraudController');

// Submit fraud report
router.post('/report', authenticateToken, submitFraudReport);

// Get fraud reports
router.get('/reports', getFraudReports);

// Verify fraud report
router.post('/report/:reportId/verify', authenticateToken, verifyFraudReport);

// Detect fraud in text
router.post('/detect', authenticateToken, detectFraud);

module.exports = router;