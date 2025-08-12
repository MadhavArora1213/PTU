const { getSarvamTherapistResponse } = require('../services/sarvamService');

const chatWithTherapist = async (req, res) => {
  try {
    const { message, stressLevel } = req.body;
    
    // Get response from Sarvam AI service
    const response = await getSarvamTherapistResponse(message, stressLevel);
    
    res.json({
      message,
      response
    });
  } catch (error) {
    console.error('Therapist error:', error);
    res.status(500).json({ message: 'Error processing therapist request' });
  }
};

module.exports = { chatWithTherapist };