const axios = require('axios');
require('dotenv').config();

// Check if Sarvam AI API key is provided
const hasSarvamKey = !!process.env.SARVAM_API_KEY && process.env.SARVAM_API_KEY !== 'your_sarvam_api_key_here';

const SARVAM_API_URL = 'https://api.sarvam.ai';

const getSarvamChatResponse = async (message, userType) => {
  // If no Sarvam key, return a default response
  if (!hasSarvamKey) {
    return `As a ${userType}, I recommend you to: 1) Track your expenses regularly, 2) Create a budget and stick to it, 3) Build an emergency fund, 4) Invest for your future. For more personalized advice, please configure Sarvam AI API key in the backend.`;
  }

  try {
    const prompt = `You are a financial advisor chatbot. The user is a ${userType}. Respond to their query: "${message}"`;
    
    const response = await axios.post(
      `${SARVAM_API_URL}/chat`,
      {
        model: 'llama3',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.SARVAM_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    // Return a default response if Sarvam API fails
    return `As a ${userType}, I recommend you to: 1) Track your expenses regularly, 2) Create a budget and stick to it, 3) Build an emergency fund, 4) Invest for your future. For more personalized advice, please try again later.`;
  }
};

const getSarvamTherapistResponse = async (message, stressLevel) => {
  // If no Sarvam key, return a default response
  if (!hasSarvamKey) {
    return "I understand financial stress can be challenging. Here are some general tips: 1) Take deep breaths and assess your situation, 2) Prioritize your expenses, 3) Reach out to family or friends for support, 4) Consider speaking with a financial advisor. Remember, financial difficulties are temporary and solvable.";
  }

  try {
    const prompt = `You are a financial therapist. The user is experiencing a stress level of ${stressLevel}/10. Respond compassionately to their concern: "${message}"`;
    
    const response = await axios.post(
      `${SARVAM_API_URL}/chat`,
      {
        model: 'llama3',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.SARVAM_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    // Return a default response if Sarvam API fails
    return "I understand financial stress can be challenging. Here are some general tips: 1) Take deep breaths and assess your situation, 2) Prioritize your expenses, 3) Reach out to family or friends for support, 4) Consider speaking with a financial advisor. Remember, financial difficulties are temporary and solvable.";
  }
};

const detectFraudWithSarvam = async (text) => {
  // If no Sarvam key, return a default response
  if (!hasSarvamKey) {
    // Simple rule-based fraud detection as fallback
    const fraudKeywords = ['lottery', 'prize', 'urgent', 'act now', 'limited time', 'click here', 'congratulations', 'winner', 'free', 'no obligation', 'risk free'];
    const isFraud = fraudKeywords.some(keyword => text.toLowerCase().includes(keyword));
    
    if (isFraud) {
      return "FRAUD\nThis message contains common fraud indicators. Be cautious and do not share personal information or make payments.";
    } else {
      return "SAFE\nThis message appears to be safe, but always verify the source before taking any action.";
    }
  }

  try {
    const prompt = `Analyze the following text for potential financial fraud indicators. Respond with "FRAUD" if fraudulent, "SAFE" if not, and "UNSURE" if uncertain. Also provide a brief explanation: "${text}"`;
    
    const response = await axios.post(
      `${SARVAM_API_URL}/chat`,
      {
        model: 'llama3',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.SARVAM_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    // Simple rule-based fraud detection as fallback
    const fraudKeywords = ['lottery', 'prize', 'urgent', 'act now', 'limited time', 'click here', 'congratulations', 'winner', 'free', 'no obligation', 'risk free'];
    const isFraud = fraudKeywords.some(keyword => text.toLowerCase().includes(keyword));
    
    if (isFraud) {
      return "FRAUD\nThis message contains common fraud indicators. Be cautious and do not share personal information or make payments.";
    } else {
      return "SAFE\nThis message appears to be safe, but always verify the source before taking any action.";
    }
  }
};

module.exports = {
  getSarvamChatResponse,
  getSarvamTherapistResponse,
  detectFraudWithSarvam,
  hasSarvamKey
};