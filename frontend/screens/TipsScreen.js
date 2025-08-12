import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const TipsScreen = () => {
  const [tips, setTips] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    fetchFinancialTips();
  }, [selectedLanguage]);

  const fetchFinancialTips = async () => {
    try {
      // Replace with your actual backend URL
      const response = await axios.get(`http://localhost:5003/api/tips?language=${selectedLanguage}`);
      
      // For demo purposes, using mock data
      const mockTips = {
        en: [
          { id: 1, title: "Emergency Fund", content: "Build an emergency fund with 3-6 months of expenses. Keep it in a high-yield savings account for easy access." },
          { id: 2, title: "Budget Tracking", content: "Track your expenses daily. Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings." },
          { id: 3, title: "Invest Early", content: "Start investing early to benefit from compound interest. Even small amounts can grow significantly over time." },
          { id: 4, title: "Avoid Lifestyle Inflation", content: "As your income increases, resist the urge to increase spending proportionally. Maintain your savings rate." },
        ],
        hi: [
          { id: 1, title: "आपातकालीन निधि", content: "3-6 महीने के खर्चों के साथ एक आपातकालीन निधि बनाएं। इसे एक उच्च उपज बचत खाते में रखें ताकि आसानी से पहुंच सकें।" },
          { id: 2, title: "बजट ट्रैकिंग", content: "अपने खर्चों को दैनिक रूप से ट्रैक करें। 50/30/20 नियम का उपयोग करें: 50% आवश्यकताएं, 30% इच्छाएं, 20% बचत।" },
          { id: 3, title: "जल्दी निवेश करें", content: "चक्रवृद्धि ब्याज के लाभ के लिए जल्दी निवेश करना शुरू करें। समय के साथ छोटी राशियां भी काफी हद तक बढ़ सकती हैं।" },
          { id: 4, title: "जीवनशैली महंगी करने से बचें", content: "जैसे ही आपकी आय बढ़ती है, खर्चों को समान रूप से बढ़ाने की प्रवृत्ति का विरोध करें। अपनी बचत दर बनाए रखें।" },
        ],
        pa: [
          { id: 1, title: "ਐਮਰਜੈਂਸੀ ਫੰਡ", content: "3-6 ਮਹੀਨਿਆਂ ਦੇ ਖਰਚਿਆਂ ਨਾਲ ਇੱਕ ਐਮਰਜੈਂਸੀ ਫੰਡ ਬਣਾਓ। ਇਸਨੂੰ ਇੱਕ ਉੱਚ-ਉਪਜ ਬੱਚਤ ਖਾਤੇ ਵਿੱਚ ਰੱਖੋ ਤਾਂ ਜੋ ਤੁਸੀਂ ਆਸਾਨੀ ਨਾਲ ਪਹੁੰਚ ਸਕੋ।" },
          { id: 2, title: "ਬਜਟ ਟਰੈਕਿੰਗ", content: "ਆਪਣੇ ਖਰਚਿਆਂ ਦੀ ਰੋਜ਼ਾਨਾ ਟਰੈਕਿੰਗ ਕਰੋ। 50/30/20 ਨਿਯਮ ਦੀ ਵਰਤੋਂ ਕਰੋ: 50% ਲੋੜਾਂ, 30% ਖਵਾਹਿਸ਼ਾਂ, 20% ਬੱਚਤ।" },
          { id: 3, title: "ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਨਿਵੇਸ਼", content: "ਚੱਕਰ ਵੱਡ੍ਹਣ ਵਿਆਜ ਦੇ ਲਾਭ ਲਈ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਨਿਵੇਸ਼ ਕਰੋ। ਸਮੇਂ ਦੇ ਨਾਲ ਛੋਟੀਆਂ ਰਕਮਾਂ ਵੀ ਵੱਡੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ।" },
          { id: 4, title: "ਜੀਵਨਸ਼ੈਲੀ ਵਿਸ਼ਾਲੀਕਰਣ ਤੋਂ ਬਚੋ", content: "ਜਿਵੇਂ ਹੀ ਤੁਹਾਡੀ ਆਮਦਨ ਵਧਦੀ ਹੈ, ਖਰਚਿਆਂ ਨੂੰ ਸਮਾਨ ਰੂਪ ਵਿੱਚ ਵਧਾਉਣ ਦੀ ਪ੍ਰਵ੍ਰਿਤੀ ਦਾ ਵਿਰੋਧ ਕਰੋ। ਆਪਣੀ ਬੱਚਤ ਦਰ ਬਣਾਈ ਰੱਖੋ।" },
        ]
      };
      
      setTips(mockTips[selectedLanguage] || mockTips['en']);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch financial tips');
    }
  };

  const renderTips = () => {
    return tips.map((tip) => (
      <View key={tip.id} style={styles.tipCard}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipContent}>{tip.content}</Text>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Tips & Tutorials</Text>
        <Text style={styles.subtitle}>Daily financial advice to improve your money management</Text>
      </View>

      <View style={styles.languageSelector}>
        <TouchableOpacity 
          style={[styles.languageButton, selectedLanguage === 'en' && styles.selectedLanguage]}
          onPress={() => setSelectedLanguage('en')}
        >
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.languageButton, selectedLanguage === 'hi' && styles.selectedLanguage]}
          onPress={() => setSelectedLanguage('hi')}
        >
          <Text style={styles.languageText}>Hindi</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.languageButton, selectedLanguage === 'pa' && styles.selectedLanguage]}
          onPress={() => setSelectedLanguage('pa')}
        >
          <Text style={styles.languageText}>Punjabi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipsContainer}>
        {renderTips()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E8B57',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
  },
  selectedLanguage: {
    backgroundColor: '#2E8B57',
    borderColor: '#2E8B57',
  },
  languageText: {
    color: '#333',
    fontWeight: 'bold',
  },
  tipsContainer: {
    padding: 20,
  },
  tipCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 10,
  },
  tipContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default TipsScreen;