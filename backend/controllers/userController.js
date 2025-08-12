const db = require('../config/database');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await db.query(
      'SELECT id, name, email, phone, user_type, language, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, language } = req.body;
    
    const result = await db.query(
      'UPDATE users SET name = $1, phone = $2, language = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, phone, user_type, language',
      [name, phone, language, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

const getUserPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await db.query(
      'SELECT total_points FROM user_points WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User points not found' });
    }
    
    res.json({
      points: result.rows[0].total_points
    });
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({ message: 'Server error while fetching points' });
  }
};

const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await db.query(
      'SELECT achievement_name, description, points, created_at FROM user_achievements WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({
      achievements: result.rows
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ message: 'Server error while fetching achievements' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserPoints,
  getUserAchievements
};