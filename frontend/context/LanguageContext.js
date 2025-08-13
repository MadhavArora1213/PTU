import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationService from '../services/translationService';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [translationVersion, setTranslationVersion] = useState(0);

  const supportedLanguages = {
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

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      setIsLoading(true);
      
      // Get saved language from storage
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      if (savedLanguage && supportedLanguages[savedLanguage]) {
        await changeLanguage(savedLanguage);
      } else {
        await loadTranslations('en');
      }
    } catch (error) {
      console.error('Error initializing language:', error);
      await loadTranslations('en');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTranslations = async (language) => {
    try {
      const result = await translationService.loadTranslations(language);
      if (result.success) {
        setTranslations({ ...result.translations });
        setCurrentLanguage(language);
        setTranslationVersion(prev => prev + 1);
        await AsyncStorage.setItem('userLanguage', language);
      } else {
        // Fallback to default translations
        setTranslations({ ...translationService.getDefaultTranslations() });
        setCurrentLanguage('en');
        setTranslationVersion(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      setTranslations(translationService.getDefaultTranslations());
      setCurrentLanguage('en');
    }
  };

  const changeLanguage = async (language) => {
    if (!supportedLanguages[language]) {
      console.error('Unsupported language:', language);
      return false;
    }

    try {
      setIsLoading(true);
      const result = await translationService.changeLanguage(language);
      
      if (result.success) {
        // Force state update to trigger re-renders
        setCurrentLanguage(language);
        setTranslations({ ...result.translations }); // Create new object reference
        setTranslationVersion(prev => prev + 1); // Force re-render
        await AsyncStorage.setItem('userLanguage', language);
        
        // Force a small delay to ensure state updates propagate
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('Language changed successfully to:', language);
        return true;
      } else {
        console.error('Failed to change language:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const translate = (key, defaultValue = null) => {
    return translations[key] || defaultValue || key;
  };

  const formatText = (key, params = {}) => {
    let text = translate(key);
    
    // Replace parameters in the text
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };

  const value = {
    currentLanguage,
    supportedLanguages,
    translations,
    isLoading,
    changeLanguage,
    translate,
    formatText,
    translationVersion, // Add version to force re-renders
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;