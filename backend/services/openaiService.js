const OpenAI = require('openai');
require('dotenv').config();

// Check if OpenAI API key is provided
const hasOpenAIKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';

// Initialize OpenAI client only if API key is provided
const openai = hasOpenAIKey ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const getChatbotResponse = async (message, userType) => {
  // If no OpenAI key, return a default response
  if (!hasOpenAIKey || !openai) {
    return `As a ${userType}, I recommend you to: 1) Track your expenses regularly, 2) Create a budget and stick to it, 3) Build an emergency fund, 4) Invest for your future. For more personalized advice, please configure OpenAI API key in the backend.`;
  }

  try {
    const prompt = `You are a financial advisor chatbot. The user is a ${userType}. Respond to their query: "${message}"`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    // Return a default response if OpenAI API fails
    return `As a ${userType}, I recommend you to: 1) Track your expenses regularly, 2) Create a budget and stick to it, 3) Build an emergency fund, 4) Invest for your future. For more personalized advice, please try again later.`;
  }
};

const getTherapistResponse = async (message, stressLevel) => {
  // If no OpenAI key, return a default response
  if (!hasOpenAIKey || !openai) {
    return "I understand financial stress can be challenging. Here are some general tips: 1) Take deep breaths and assess your situation, 2) Prioritize your expenses, 3) Reach out to family or friends for support, 4) Consider speaking with a financial advisor. Remember, financial difficulties are temporary and solvable.";
  }

  try {
    const prompt = `You are a financial therapist. The user is experiencing a stress level of ${stressLevel}/10. Respond compassionately to their concern: "${message}"`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.5
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    // Return a default response if OpenAI API fails
    return "I understand financial stress can be challenging. Here are some general tips: 1) Take deep breaths and assess your situation, 2) Prioritize your expenses, 3) Reach out to family or friends for support, 4) Consider speaking with a financial advisor. Remember, financial difficulties are temporary and solvable.";
  }
};

const detectFraud = async (text) => {
  // If no OpenAI key, return a default response
  if (!hasOpenAIKey || !openai) {
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
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.3
    });
    
    return response.choices[0].message.content.trim();
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
  getChatbotResponse,
  getTherapistResponse,
  detectFraud,
  hasOpenAIKey
};