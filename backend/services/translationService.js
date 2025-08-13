const axios = require('axios');

// Sarvam AI supported languages
const supportedLanguages = {
  'en': 'English',
  'hi': 'Hindi',
  'pa': 'Punjabi',
  'bn': 'Bengali',
  'te': 'Telugu',
  'mr': 'Marathi',
  'ta': 'Tamil',
  'gu': 'Gujarati',
  'kn': 'Kannada',
  'ml': 'Malayalam',
  'or': 'Odia'
};

// Language codes mapping for Sarvam AI
const sarvamLanguageCodes = {
  'en': 'en-IN',
  'hi': 'hi-IN',
  'pa': 'pa-IN',
  'bn': 'bn-IN',
  'te': 'te-IN',
  'mr': 'mr-IN',
  'ta': 'ta-IN',
  'gu': 'gu-IN',
  'kn': 'kn-IN',
  'ml': 'ml-IN',
  'or': 'or-IN'
};

// Translate text using Sarvam AI
const translateText = async (text, targetLanguage, sourceLanguage = 'en') => {
  try {
    if (!process.env.SARVAM_API_KEY) {
      console.error('Sarvam API key not configured');
      return { success: false, message: 'Translation service not configured' };
    }

    // If target language is same as source, return original text
    if (targetLanguage === sourceLanguage) {
      return { success: true, translatedText: text };
    }

    // Check if languages are supported
    if (!supportedLanguages[targetLanguage] || !supportedLanguages[sourceLanguage]) {
      return { success: false, message: 'Unsupported language' };
    }

    const response = await axios.post('https://api.sarvam.ai/translate', {
      input: text,
      source_language_code: sarvamLanguageCodes[sourceLanguage],
      target_language_code: sarvamLanguageCodes[targetLanguage],
      speaker_gender: 'Male',
      mode: 'formal',
      model: 'mayura:v1',
      enable_preprocessing: true
    }, {
      headers: {
        'api-subscription-key': process.env.SARVAM_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.translated_text) {
      return {
        success: true,
        translatedText: response.data.translated_text,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage
      };
    } else {
      return { success: false, message: 'Translation failed' };
    }
  } catch (error) {
    console.error('Translation error:', error.response?.data || error.message);
    return { 
      success: false, 
      message: 'Translation service error',
      error: error.response?.data || error.message 
    };
  }
};

// Translate multiple texts in batch
const translateBatch = async (texts, targetLanguage, sourceLanguage = 'en') => {
  try {
    const translations = await Promise.all(
      texts.map(text => translateText(text, targetLanguage, sourceLanguage))
    );
    
    return {
      success: true,
      translations: translations.map((result, index) => ({
        original: texts[index],
        translated: result.success ? result.translatedText : texts[index],
        success: result.success
      }))
    };
  } catch (error) {
    console.error('Batch translation error:', error);
    return { success: false, message: 'Batch translation failed' };
  }
};

// Get UI translations for common interface elements
const getUITranslations = async (targetLanguage) => {
  const uiElements = {
    // Navigation
    'Home': 'Home',
    'Profile': 'Profile',
    'Settings': 'Settings',
    'Logout': 'Logout',
    'Login': 'Login',
    'Register': 'Register',
    
    // Common buttons
    'Submit': 'Submit',
    'Cancel': 'Cancel',
    'Save': 'Save',
    'Delete': 'Delete',
    'Edit': 'Edit',
    'Back': 'Back',
    'Next': 'Next',
    'Previous': 'Previous',
    
    // Form labels
    'Name': 'Name',
    'Email': 'Email',
    'Password': 'Password',
    'Phone': 'Phone',
    'Language': 'Language',
    'User Type': 'User Type',
    
    // Messages
    'Success': 'Success',
    'Error': 'Error',
    'Warning': 'Warning',
    'Loading': 'Loading',
    'Please wait': 'Please wait',
    
    // Financial terms
    'Budget': 'Budget',
    'Income': 'Income',
    'Expenses': 'Expenses',
    'Savings': 'Savings',
    'Investment': 'Investment',
    'EMI Calculator': 'EMI Calculator',
    'SIP Calculator': 'SIP Calculator',
    'Financial Goals': 'Financial Goals',
    'Fraud Reporting': 'Fraud Reporting',
    
    // User types
    'Student': 'Student',
    'Salaried Professional': 'Salaried Professional',
    'Business Owner': 'Business Owner'
  };

  if (targetLanguage === 'en') {
    return { success: true, translations: uiElements };
  }

  try {
    const translatedElements = {};
    
    // Translate in batches to avoid rate limits
    const entries = Object.entries(uiElements);
    const batchSize = 10;
    
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      const texts = batch.map(([key, value]) => value);
      
      const result = await translateBatch(texts, targetLanguage, 'en');
      
      if (result.success) {
        batch.forEach(([key], index) => {
          translatedElements[key] = result.translations[index].translated;
        });
      } else {
        // Fallback to original text if translation fails
        batch.forEach(([key, value]) => {
          translatedElements[key] = value;
        });
      }
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < entries.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return { success: true, translations: translatedElements };
  } catch (error) {
    console.error('UI translation error:', error);
    return { success: false, message: 'UI translation failed', translations: uiElements };
  }
};

// Detect language of text (if needed)
const detectLanguage = async (text) => {
  try {
    // Simple language detection based on character patterns
    // This is a basic implementation - you might want to use a more sophisticated service
    
    // Check for Devanagari script (Hindi, Marathi)
    if (/[\u0900-\u097F]/.test(text)) {
      return { success: true, language: 'hi', confidence: 0.8 };
    }
    
    // Check for Bengali script
    if (/[\u0980-\u09FF]/.test(text)) {
      return { success: true, language: 'bn', confidence: 0.8 };
    }
    
    // Check for Tamil script
    if (/[\u0B80-\u0BFF]/.test(text)) {
      return { success: true, language: 'ta', confidence: 0.8 };
    }
    
    // Check for Telugu script
    if (/[\u0C00-\u0C7F]/.test(text)) {
      return { success: true, language: 'te', confidence: 0.8 };
    }
    
    // Check for Gujarati script
    if (/[\u0A80-\u0AFF]/.test(text)) {
      return { success: true, language: 'gu', confidence: 0.8 };
    }
    
    // Check for Kannada script
    if (/[\u0C80-\u0CFF]/.test(text)) {
      return { success: true, language: 'kn', confidence: 0.8 };
    }
    
    // Check for Malayalam script
    if (/[\u0D00-\u0D7F]/.test(text)) {
      return { success: true, language: 'ml', confidence: 0.8 };
    }
    
    // Check for Odia script
    if (/[\u0B00-\u0B7F]/.test(text)) {
      return { success: true, language: 'or', confidence: 0.8 };
    }
    
    // Check for Gurmukhi script (Punjabi)
    if (/[\u0A00-\u0A7F]/.test(text)) {
      return { success: true, language: 'pa', confidence: 0.8 };
    }
    
    // Default to English if no other script detected
    return { success: true, language: 'en', confidence: 0.6 };
    
  } catch (error) {
    console.error('Language detection error:', error);
    return { success: false, message: 'Language detection failed' };
  }
};

module.exports = {
  translateText,
  translateBatch,
  getUITranslations,
  detectLanguage,
  supportedLanguages,
  sarvamLanguageCodes
};