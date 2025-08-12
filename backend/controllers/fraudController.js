const db = require('../config/database');
const { detectFraudWithSarvam } = require('../services/sarvamService');

const submitFraudReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, locationLat, locationLng, imageUrl } = req.body;

    // Insert new fraud report
    const result = await db.query(
      'INSERT INTO fraud_reports (user_id, title, description, location_lat, location_lng, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, title, description, locationLat, locationLng, imageUrl]
    );

    // Add reward points to user
    await db.query(
      'UPDATE user_points SET total_points = total_points + 50, last_updated = NOW() WHERE user_id = $1',
      [userId]
    );

    res.status(201).json({
      message: 'Fraud report submitted successfully',
      report: result.rows[0]
    });
  } catch (error) {
    console.error('Fraud report error:', error);
    res.status(500).json({ message: 'Error submitting fraud report' });
  }
};

const getFraudReports = async (req, res) => {
  try {
    // Get all fraud reports ordered by creation date
    const result = await db.query(
      'SELECT * FROM fraud_reports ORDER BY created_at DESC'
    );

    res.json({
      reports: result.rows
    });
  } catch (error) {
    console.error('Get fraud reports error:', error);
    res.status(500).json({ message: 'Error fetching fraud reports' });
  }
};

const verifyFraudReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user.id;

    // Update report status to verified
    const result = await db.query(
      'UPDATE fraud_reports SET status = $1, reward_points = $2 WHERE id = $3 RETURNING *',
      ['verified', 50, reportId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fraud report not found' });
    }

    // Add reward points to user for verification
    await db.query(
      'UPDATE user_points SET total_points = total_points + 50, last_updated = NOW() WHERE user_id = $1',
      [userId]
    );

    res.json({
      message: 'Fraud report verified successfully',
      report: result.rows[0]
    });
  } catch (error) {
    console.error('Verify fraud report error:', error);
    res.status(500).json({ message: 'Error verifying fraud report' });
  }
};

const detectFraud = async (req, res) => {
  try {
    const { text } = req.body;
    
    // Get fraud detection result from Sarvam AI service
    const result = await detectFraudWithSarvam(text);
    
    res.json({
      text,
      result
    });
  } catch (error) {
    console.error('Fraud detection error:', error);
    res.status(500).json({ message: 'Error detecting fraud' });
  }
};

module.exports = {
  submitFraudReport,
  getFraudReports,
  verifyFraudReport,
  detectFraud
};