const express = require('express');
const router = express.Router();
const translationService = require('../services/translationService');

// Translate text
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        error: 'Text and target language are required' 
      });
    }

    const translatedText = await translationService.translateText(
      text, 
      sourceLanguage, 
      targetLanguage
    );

    res.json({ 
      originalText: text,
      translatedText,
      sourceLanguage,
      targetLanguage
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Translation failed',
      message: error.message 
    });
  }
});

// Batch translate multiple texts
router.post('/translate-batch', async (req, res) => {
  try {
    const { texts, targetLanguage, sourceLanguage = 'en' } = req.body;
    
    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      return res.status(400).json({ 
        error: 'Texts array and target language are required' 
      });
    }

    const translations = await translationService.translateBatch(
      texts, 
      sourceLanguage, 
      targetLanguage
    );

    res.json({ 
      translations,
      sourceLanguage,
      targetLanguage
    });
  } catch (error) {
    console.error('Batch translation error:', error);
    res.status(500).json({ 
      error: 'Batch translation failed',
      message: error.message 
    });
  }
});

// Update user language preference (no auth required for basic functionality)
router.post('/update-language', async (req, res) => {
  try {
    const { language } = req.body;
    
    if (!language) {
      return res.status(400).json({ 
        error: 'Language is required' 
      });
    }

    // For now, just return success - can be enhanced later with user persistence
    res.json({ 
      message: 'Language preference updated',
      language 
    });
  } catch (error) {
    console.error('Language update error:', error);
    res.status(500).json({ 
      error: 'Failed to update language preference',
      message: error.message 
    });
  }
});

// Get supported languages
router.get('/languages', (req, res) => {
  const supportedLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
  ];

  res.json({ languages: supportedLanguages });
});

module.exports = router;