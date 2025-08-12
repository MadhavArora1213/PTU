import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

export const getChatbotResponse = async (message, userType) => {
  try {
    const prompt = `You are a financial advisor chatbot. The user is a ${userType}. Respond to their query: "${message}"`;
    
    const response = await axios.post(
      `${OPENAI_API_URL}/chat/completions`,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    throw new Error('Failed to get response from AI');
  }
};

export const getTherapistResponse = async (message, stressLevel) => {
  try {
    const prompt = `You are a financial therapist. The user is experiencing a stress level of ${stressLevel}/10. Respond compassionately to their concern: "${message}"`;
    
    const response = await axios.post(
      `${OPENAI_API_URL}/chat/completions`,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.5
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    throw new Error('Failed to get response from AI');
  }
};

export const detectFraud = async (text) => {
  try {
    const prompt = `Analyze the following text for potential financial fraud indicators. Respond with "FRAUD" if fraudulent, "SAFE" if not, and "UNSURE" if uncertain. Also provide a brief explanation: "${text}"`;
    
    const response = await axios.post(
      `${OPENAI_API_URL}/chat/completions`,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    throw new Error('Failed to analyze text for fraud');
  }
};