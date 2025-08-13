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

  // Load translations from backend with caching
  async loadTranslations(language) {
    try {
      // Check if we have cached translations for this language
      const cacheKey = `translations_${language}`;
      const cachedTranslations = await AsyncStorage.getItem(cacheKey);
      
      if (cachedTranslations) {
        try {
          const parsed = JSON.parse(cachedTranslations);
          // Check if cache is less than 24 hours old
          const cacheAge = Date.now() - (parsed.timestamp || 0);
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (cacheAge < maxAge) {
            console.log('Using cached translations for language:', language);
            this.translations = parsed.translations;
            this.currentLanguage = language;
            await AsyncStorage.setItem('userLanguage', language);
            return { success: true, translations: this.translations, fromCache: true };
          }
        } catch (parseError) {
          console.log('Error parsing cached translations:', parseError);
        }
      }

      console.log('Fetching translations from server for language:', language);
      const response = await api.post('/translation/translate-batch', {
        texts: Object.keys(this.getDefaultTranslations()),
        targetLanguage: language,
        sourceLanguage: 'en'
      });
      
      if (response.data.translations) {
        // Convert array response to object format
        const defaultKeys = Object.keys(this.getDefaultTranslations());
        const translatedTexts = response.data.translations;
        
        this.translations = {};
        defaultKeys.forEach((key, index) => {
          this.translations[key] = translatedTexts[index] || key;
        });
        
        this.currentLanguage = language;
        
        // Cache the translations with timestamp
        const cacheData = {
          translations: this.translations,
          timestamp: Date.now()
        };
        await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
        
        // Save language preference
        await AsyncStorage.setItem('userLanguage', language);
        
        return { success: true, translations: this.translations };
      } else {
        throw new Error('Failed to load translations');
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      
      // If rate limited or network error, try to use any cached version
      if (error.response?.status === 429 || error.code === 'NETWORK_ERROR') {
        const cacheKey = `translations_${language}`;
        const cachedTranslations = await AsyncStorage.getItem(cacheKey);
        
        if (cachedTranslations) {
          try {
            const parsed = JSON.parse(cachedTranslations);
            console.log('Using stale cached translations due to rate limit/network error');
            this.translations = parsed.translations;
            this.currentLanguage = language;
            await AsyncStorage.setItem('userLanguage', language);
            return { success: true, translations: this.translations, fromCache: true, rateLimited: true };
          } catch (parseError) {
            console.log('Error parsing cached translations:', parseError);
          }
        }
      }
      
      // Fallback to default English translations
      this.translations = this.getDefaultTranslations();
      return { success: false, error: error.message };
    }
  }

  // Change language with improved error handling
  async changeLanguage(language) {
    if (!this.supportedLanguages[language]) {
      throw new Error('Unsupported language');
    }

    try {
      // Load new translations
      const result = await this.loadTranslations(language);
      
      // Update user preference on backend if user is logged in (non-blocking)
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Don't await this to avoid blocking the UI
          api.post('/translation/update-language', { language }).catch(error => {
            console.log('Could not update language on backend:', error.message);
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
      'Report and avoid financial scams': 'Report and avoid financial scams',

      // Registration/Login
      'Create your account': 'Create your account',
      'Login to your account': 'Login to your account',
      'Phone (optional)': 'Phone (optional)',
      'Send OTP': 'Send OTP',
      'Enter 6-digit OTP': 'Enter 6-digit OTP',
      'Resend OTP': 'Resend OTP',
      'Verify & Register': 'Verify & Register',
      'Already have an account? Login': 'Already have an account? Login',
      'Don\'t have an account? Register': 'Don\'t have an account? Register',
      
      // Additional translations
      'Please fill in all fields': 'Please fill in all fields',
      'Login successful': 'Login successful',
      'Login failed': 'Login failed',
      'Logging in...': 'Logging in...',
      'Daily financial advice to improve your money management': 'Daily financial advice to improve your money management',
      'Failed to fetch financial tips': 'Failed to fetch financial tips',
      'Financial Chatbot': 'Financial Chatbot',
      'Ask me anything about finance': 'Ask me anything about finance',
'Financial Chatbot': 'Financial Chatbot',
      'Ask me anything about finance': 'Ask me anything about finance',
      'Budget Tips': 'Budget Tips',
      'Saving Tips': 'Saving Tips',
      'Investments': 'Investments',
      'Fraud Prevention': 'Fraud Prevention',
'Please enter your email address': 'Please enter your email address',
      'Please enter a valid email address': 'Please enter a valid email address',
      'Sending OTP...': 'Sending OTP...',
      'Sending...': 'Sending...',
      'Registering...': 'Registering...',
'About ArthRakshak': 'About ArthRakshak',
      'ArthRakshak is your comprehensive financial safety and education companion, powered by Punjab National Bank. We help you make informed financial decisions, protect against fraud, and build a secure financial future.': 'ArthRakshak is your comprehensive financial safety and education companion, powered by Punjab National Bank. We help you make informed financial decisions, protect against fraud, and build a secure financial future.',
      'OK': 'OK',
      'Help & Support': 'Help & Support',
      'Need help? Contact our support team:\n\nEmail: support@arthrakshak.com\nPhone: 1800-XXX-XXXX\n\nOr visit our help center for FAQs and guides.': 'Need help? Contact our support team:\n\nEmail: support@arthrakshak.com\nPhone: 1800-XXX-XXXX\n\nOr visit our help center for FAQs and guides.',
      'Email Support': 'Email Support',
      'Privacy Policy': 'Privacy Policy',
      'Your privacy is important to us. We collect and use your information to provide better financial services while keeping your data secure. For detailed information, please visit our website.': 'Your privacy is important to us. We collect and use your information to provide better financial services while keeping your data secure. For detailed information, please visit our website.',
      'Terms of Service': 'Terms of Service',
      'By using ArthRakshak, you agree to our terms and conditions. Please use the app responsibly and follow all financial regulations in your region.': 'By using ArthRakshak, you agree to our terms and conditions. Please use the app responsibly and follow all financial regulations in your region.',
      'Rate ArthRakshak': 'Rate ArthRakshak',
      'Enjoying ArthRakshak? Please rate us on the app store to help others discover our financial safety tools!': 'Enjoying ArthRakshak? Please rate us on the app store to help others discover our financial safety tools!',
      'Rate Now': 'Rate Now',
      'Share ArthRakshak': 'Share ArthRakshak',
      'Help your friends and family stay financially safe! Share ArthRakshak with them.': 'Help your friends and family stay financially safe! Share ArthRakshak with them.',
      'Share': 'Share',
      'Send Feedback': 'Send Feedback',
      'We value your feedback! Help us improve ArthRakshak by sharing your thoughts and suggestions.': 'We value your feedback! Help us improve ArthRakshak by sharing your thoughts and suggestions.',
      'Send Email': 'Send Email',
      'Additional features and settings': 'Additional features and settings',
      'Settings': 'Settings',
      'App settings and preferences': 'App settings and preferences',
      'About Us': 'About Us',
      'Learn more about ArthRakshak': 'Learn more about ArthRakshak',
      'Get help and contact support': 'Get help and contact support',
      'Read our privacy policy': 'Read our privacy policy',
      'Terms and conditions': 'Terms and conditions',
      'Rate App': 'Rate App',
      'Rate us on the app store': 'Rate us on the app store',
      'Share App': 'Share App',
      'Share ArthRakshak with friends': 'Share ArthRakshak with friends',
      'Feedback': 'Feedback',
      'Send us your feedback': 'Send us your feedback',
      'ArthRakshak v1.0.0': 'ArthRakshak v1.0.0',
      'Powered by Punjab National Bank': 'Powered by Punjab National Bank',
      'Type your financial question...': 'Type your financial question...',
      'Budget Tips': 'Budget Tips',
      'Saving Tips': 'Saving Tips',
      'Investments': 'Investments',
      'Fraud Prevention': 'Fraud Prevention',
      'Type your financial question...': 'Type your financial question...'
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