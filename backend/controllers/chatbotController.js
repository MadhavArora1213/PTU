const { getSarvamChatResponse } = require('../services/sarvamService');

const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    const userType = req.user.user_type;
    
    // Get response from Sarvam AI service
    const response = await getSarvamChatResponse(message, userType);
    
    res.json({
      message,
      response
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Error processing chatbot request' });
  }
};

module.exports = { chatWithBot };
