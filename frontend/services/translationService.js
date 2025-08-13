import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class TranslationService {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.supportedLanguages = {
      'en': 'English',
      'hi': 'Hindi (हिंदी)',
      'pa': 'Punjabi (ਪੰਜਾਬੀ)',
      'bn': 'Bengali (বাংলা)',
      'te': 'Telugu (తెలుగు)',
      'mr': 'Marathi (मराठी)',
      'ta': 'Tamil (தமிழ்)',
      'gu': 'Gujarati (ગુજરાતી)',
      'kn': 'Kannada (ಕನ್ನಡ)',
      'ml': 'Malayalam (മലയാളം)',
      'or': 'Odia (ଓଡ଼ିଆ)'
    };
  }

  // Initialize translation service
  async initialize() {
    try {
      // Get saved language from storage
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      if (savedLanguage && this.supportedLanguages[savedLanguage]) {
        this.currentLanguage = savedLanguage;
      }
      
      // Load translations for current language
      await this.loadTranslations(this.currentLanguage);
    } catch (error) {
      console.error('Error initializing translation service:', error);
    }
  }

  // Load translations from backend
  async loadTranslations(language) {
    try {
      const response = await api.get(`/auth/translations?language=${language}`);
      if (response.data.success) {
        this.translations = response.data.translations;
        this.currentLanguage = language;
        
        // Save language preference
        await AsyncStorage.setItem('userLanguage', language);
        
        return { success: true, translations: this.translations };
      } else {
        throw new Error(response.data.message || 'Failed to load translations');
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      
      // Fallback to default English translations
      this.translations = this.getDefaultTranslations();
      return { success: false, error: error.message };
    }
  }

  // Change language
  async changeLanguage(language) {
    if (!this.supportedLanguages[language]) {
      throw new Error('Unsupported language');
    }

    try {
      // Load new translations
      const result = await this.loadTranslations(language);
      
      // Update user preference on backend if user is logged in
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          await api.put('/auth/language', { language }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (error) {
        console.log('Could not update language on backend:', error.message);
      }

      return result;
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  }

  // Get translation for a key
  translate(key, defaultValue = null) {
    return this.translations[key] || defaultValue || key;
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Get default English translations
  getDefaultTranslations() {
    return {
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
      'Business Owner': 'Business Owner',

      // Registration/Login
      'Create your account': 'Create your account',
      'Login to your account': 'Login to your account',
      'Full Name': 'Full Name',
      'Phone (optional)': 'Phone (optional)',
      'Send OTP': 'Send OTP',
      'Enter 6-digit OTP': 'Enter 6-digit OTP',
      'Resend OTP': 'Resend OTP',
      'Verify & Register': 'Verify & Register',
      'Already have an account? Login': 'Already have an account? Login',
      'Don\'t have an account? Register': 'Don\'t have an account? Register'
    };
  }

  // Format text with parameters
  formatText(key, params = {}) {
    let text = this.translate(key);
    
    // Replace parameters in the text
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  }

  // Get language direction (for RTL languages if needed in future)
  getLanguageDirection(language = null) {
    const lang = language || this.currentLanguage;
    // All current supported languages are LTR
    return 'ltr';
  }

  // Check if language is RTL
  isRTL(language = null) {
    return this.getLanguageDirection(language) === 'rtl';
  }
}

// Create singleton instance
const translationService = new TranslationService();

export default translationService;