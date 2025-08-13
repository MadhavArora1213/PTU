const axios = require('axios');
const cacheService = require('./cacheService');

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

// Translate text using Sarvam AI with Redis caching
const translateText = async (text, targetLanguage, sourceLanguage = 'en') => {
  try {
    // If target language is same as source, return original text
    if (targetLanguage === sourceLanguage) {
      return { success: true, translatedText: text };
    }

    // Check if languages are supported
    if (!supportedLanguages[targetLanguage] || !supportedLanguages[sourceLanguage]) {
      return { success: false, message: 'Unsupported language' };
    }

    // Check cache first
    const cacheKey = cacheService.getTranslationCacheKey(text, targetLanguage, sourceLanguage);
    const cachedTranslation = await cacheService.get(cacheKey);
    
    if (cachedTranslation) {
      console.log('Translation found in cache');
      return {
        success: true,
        translatedText: cachedTranslation.translatedText,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        fromCache: true
      };
    }

    if (!process.env.SARVAM_API_KEY) {
      console.error('Sarvam API key not configured');
      return { success: false, message: 'Translation service not configured' };
    }

    console.log('Making API call to Sarvam AI for translation');
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
      const result = {
        success: true,
        translatedText: response.data.translated_text,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage
      };

      // Cache the translation for 24 hours (86400 seconds)
      await cacheService.set(cacheKey, {
        translatedText: response.data.translated_text,
        timestamp: new Date().toISOString()
      }, 86400);

      return result;
    } else {
      return { success: false, message: 'Translation failed' };
    }
  } catch (error) {
    console.error('Translation error:', error.response?.data || error.message);
    
    // If rate limit exceeded, try to return cached version or fallback
    if (error.response?.data?.error?.code === 'rate_limit_exceeded_error') {
      console.log('Rate limit exceeded, checking for any cached version');
      const cacheKey = cacheService.getTranslationCacheKey(text, targetLanguage, sourceLanguage);
      const cachedTranslation = await cacheService.get(cacheKey);
      
      if (cachedTranslation) {
        return {
          success: true,
          translatedText: cachedTranslation.translatedText,
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage,
          fromCache: true,
          rateLimited: true
        };
      }
      
      // Return original text as fallback
      return {
        success: true,
        translatedText: text,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        fallback: true,
        rateLimited: true
      };
    }
    
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

// Get UI translations for common interface elements with caching
const getUITranslations = async (targetLanguage) => {
  // Check cache first
  const cacheKey = cacheService.getUITranslationCacheKey(targetLanguage);
  const cachedUITranslations = await cacheService.get(cacheKey);
  
  if (cachedUITranslations) {
    console.log('UI translations found in cache for language:', targetLanguage);
    return { success: true, translations: cachedUITranslations };
  }

  const uiElements = {
    // Navigation
    'Home': 'Home',
    'Profile': 'Profile',
    'Settings': 'Settings',
    'Logout': 'Logout',
    'Login': 'Login',
    'Register': 'Register',
    'Financial Tips': 'Financial Tips',
    'Financial Education': 'Financial Education',
    'Helplines': 'Helplines',
    'More': 'More',
    
    // Common buttons
    'Submit': 'Submit',
    'Cancel': 'Cancel',
    'Save': 'Save',
    'Delete': 'Delete',
    'Edit': 'Edit',
    'Back': 'Back',
    'Next': 'Next',
    'Previous': 'Previous',
    'Call': 'Call',
    'View All': 'View All',
    
    // Form labels
    'Name': 'Name',
    'Full Name': 'Full Name',
    'Email': 'Email',
    'Password': 'Password',
    'Phone': 'Phone',
    'Language': 'Language',
    'User Type': 'User Type',
    'Select Language': 'Select Language',
    
    // Messages
    'Success': 'Success',
    'Error': 'Error',
    'Warning': 'Warning',
    'Loading': 'Loading',
    'Loading...': 'Loading...',
    'Please wait': 'Please wait',
    'Updating...': 'Updating...',
    'Typing...': 'Typing...',
    
    // Greetings
    'Good Morning': 'Good Morning',
    'Good Afternoon': 'Good Afternoon',
    'Good Evening': 'Good Evening',
    'Welcome': 'Welcome',
    
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
    'Budget Planning': 'Budget Planning',
    'Emergency Fund': 'Emergency Fund',
    'Investment Tips': 'Investment Tips',
    'Fraud Protection': 'Fraud Protection',
    'Digital Banking': 'Digital Banking',
    
    // User types
    'Student': 'Student',
    'Salaried Professional': 'Salaried Professional',
    'Business Owner': 'Business Owner',
    'User': 'User',
    
    // Profile related
    'Your Profile': 'Your Profile',
    'Your Reward Points': 'Your Reward Points',
    'Your Achievements': 'Your Achievements',
    'Update Profile': 'Update Profile',
    'Profile updated successfully': 'Profile updated successfully',
    'Failed to update profile': 'Failed to update profile',
    'Failed to fetch profile data': 'Failed to fetch profile data',
    'Name is required': 'Name is required',
    'Language updated successfully': 'Language updated successfully',
    'Failed to update language': 'Failed to update language',
    'points': 'points',
    
    // Helplines
    'Emergency Helplines': 'Emergency Helplines',
    'Tap to call for immediate assistance': 'Tap to call for immediate assistance',
    'Call Helpline': 'Call Helpline',
    'Cyber Crime Helpline': 'Cyber Crime Helpline',
    'Banking Ombudsman': 'Banking Ombudsman',
    'Consumer Helpline': 'Consumer Helpline',
    'RBI Helpline': 'RBI Helpline',
    'Report cyber crimes and financial frauds': 'Report cyber crimes and financial frauds',
    'Banking complaints and grievances': 'Banking complaints and grievances',
    'Consumer protection and complaints': 'Consumer protection and complaints',
    'Reserve Bank of India assistance': 'Reserve Bank of India assistance',
    'These are toll-free numbers available 24/7': 'These are toll-free numbers available 24/7',
    'Unable to make call': 'Unable to make call',
    
    // Chatbot
    'Financial Assistant': 'Financial Assistant',
    'Online': 'Online',
    'Type your message...': 'Type your message...',
    
    // Quick Actions
    'Quick Actions': 'Quick Actions',
    'Tip of the Day': 'Tip of the Day',
    
    // Placeholders
    'Enter your full name': 'Enter your full name',
    'Enter your phone number': 'Enter your phone number',
    
    // Slider content
    'Create a monthly budget to track your income and expenses effectively': 'Create a monthly budget to track your income and expenses effectively',
    'Build an emergency fund covering 6 months of your expenses': 'Build an emergency fund covering 6 months of your expenses',
    'Start investing early to benefit from compound interest': 'Start investing early to benefit from compound interest',
    'Stay alert against financial frauds and scams': 'Stay alert against financial frauds and scams',
    'Use secure digital banking for convenient transactions': 'Use secure digital banking for convenient transactions',
    
    // Tips
    'Start saving at least 20% of your income for a secure financial future': 'Start saving at least 20% of your income for a secure financial future',
    
    // Action descriptions
    'Plan and track your monthly expenses': 'Plan and track your monthly expenses',
    'Set and track your savings targets': 'Set and track your savings targets',
    'Calculate your loan EMIs': 'Calculate your loan EMIs',
    'Report and avoid financial scams': 'Report and avoid financial scams'
  };

  if (targetLanguage === 'en') {
    // Cache English translations too
    await cacheService.set(cacheKey, uiElements, 86400);
    return { success: true, translations: uiElements };
  }

  try {
    const translatedElements = {};
    
    // Translate in smaller batches to avoid rate limits
    const entries = Object.entries(uiElements);
    const batchSize = 5; // Reduced batch size
    
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
      
      // Longer delay between batches to respect rate limits
      if (i + batchSize < entries.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Cache the translated UI elements for 24 hours
    await cacheService.set(cacheKey, translatedElements, 86400);
    
    return { success: true, translations: translatedElements };
  } catch (error) {
    console.error('UI translation error:', error);
    
    // If rate limited, cache and return English as fallback
    if (error.message && error.message.includes('rate_limit_exceeded')) {
      await cacheService.set(cacheKey, uiElements, 86400);
      return { success: true, translations: uiElements, rateLimited: true };
    }
    
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