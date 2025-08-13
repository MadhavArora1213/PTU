import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const TipsScreen = () => {
  const { translate, currentLanguage, supportedLanguages, changeLanguage } = useLanguage();
  const [tips, setTips] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    fetchFinancialTips();
  }, [selectedLanguage]);

  const fetchFinancialTips = async () => {
    try {
      const response = await api.get(`/tips?language=${selectedLanguage}`);
      
      // Use actual data from backend if available, otherwise use mock data
      if (response.data.tips && response.data.tips.length > 0) {
        setTips(response.data.tips);
      } else {
        // Fallback to mock data if backend doesn't return tips
        const mockTips = {
          en: [
            { id: 1, title: "Emergency Fund", content: "Build an emergency fund with 3-6 months of expenses. Keep it in a high-yield savings account for easy access.", category: "Savings", icon: "savings" },
            { id: 2, title: "Budget Tracking", content: "Track your expenses daily. Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.", category: "Budgeting", icon: "account-balance-wallet" },
            { id: 3, title: "Invest Early", content: "Start investing early to benefit from compound interest. Even small amounts can grow significantly over time.", category: "Investment", icon: "trending-up" },
            { id: 4, title: "Avoid Lifestyle Inflation", content: "As your income increases, resist the urge to increase spending proportionally. Maintain your savings rate.", category: "Spending", icon: "money-off" },
            { id: 5, title: "Debt Management", content: "Pay off high-interest debt first. Consider debt consolidation if you have multiple loans.", category: "Debt", icon: "credit-card" },
            { id: 6, title: "Tax Planning", content: "Plan your taxes throughout the year. Use tax-saving instruments like ELSS, PPF, and NSC.", category: "Tax", icon: "receipt" },
          ],
          hi: [
            { id: 1, title: "आपातकालीन निधि", content: "3-6 महीने के खर्चों के साथ एक आपातकालीन निधि बनाएं। इसे एक उच्च उपज बचत खाते में रखें ताकि आसानी से पहुंच सकें।", category: "बचत", icon: "savings" },
            { id: 2, title: "बजट ट्रैकिंग", content: "अपने खर्चों को दैनिक रूप से ट्रैक करें। 50/30/20 नियम का उपयोग करें: 50% आवश्यकताएं, 30% इच्छाएं, 20% बचत।", category: "बजटिंग", icon: "account-balance-wallet" },
            { id: 3, title: "जल्दी निवेश करें", content: "चक्रवृद्धि ब्याज के लाभ के लिए जल्दी निवेश करना शुरू करें। समय के साथ छोटी राशियां भी काफी हद तक बढ़ सकती हैं।", category: "निवेश", icon: "trending-up" },
            { id: 4, title: "जीवनशैली महंगी करने से बचें", content: "जैसे ही आपकी आय बढ़ती है, खर्चों को समान रूप से बढ़ाने की प्रवृत्ति का विरोध करें। अपनी बचत दर बनाए रखें।", category: "खर्च", icon: "money-off" },
            { id: 5, title: "ऋण प्रबंधन", content: "पहले उच्च ब्याज वाले ऋण का भुगतान करें। यदि आपके पास कई ऋण हैं तो ऋण समेकन पर विचार करें।", category: "ऋण", icon: "credit-card" },
            { id: 6, title: "कर योजना", content: "साल भर अपने करों की योजना बनाएं। ELSS, PPF, और NSC जैसे कर-बचत उपकरणों का उपयोग करें।", category: "कर", icon: "receipt" },
          ],
          pa: [
            { id: 1, title: "ਐਮਰਜੈਂਸੀ ਫੰਡ", content: "3-6 ਮਹੀਨਿਆਂ ਦੇ ਖਰਚਿਆਂ ਨਾਲ ਇੱਕ ਐਮਰਜੈਂਸੀ ਫੰਡ ਬਣਾਓ। ਇਸਨੂੰ ਇੱਕ ਉੱਚ-ਉਪਜ ਬੱਚਤ ਖਾਤੇ ਵਿੱਚ ਰੱਖੋ ਤਾਂ ਜੋ ਤੁਸੀਂ ਆਸਾਨੀ ਨਾਲ ਪਹੁੰਚ ਸਕੋ।", category: "ਬੱਚਤ", icon: "savings" },
            { id: 2, title: "ਬਜਟ ਟਰੈਕਿੰਗ", content: "ਆਪਣੇ ਖਰਚਿਆਂ ਦੀ ਰੋਜ਼ਾਨਾ ਟਰੈਕਿੰਗ ਕਰੋ। 50/30/20 ਨਿਯਮ ਦੀ ਵਰਤੋਂ ਕਰੋ: 50% ਲੋੜਾਂ, 30% ਖਵਾਹਿਸ਼ਾਂ, 20% ਬੱਚਤ।", category: "ਬਜਟਿੰਗ", icon: "account-balance-wallet" },
            { id: 3, title: "ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਨਿਵੇਸ਼", content: "ਚੱਕਰ ਵੱਡ੍ਹਣ ਵਿਆਜ ਦੇ ਲਾਭ ਲਈ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਨਿਵੇਸ਼ ਕਰੋ। ਸਮੇਂ ਦੇ ਨਾਲ ਛੋਟੀਆਂ ਰਕਮਾਂ ਵੀ ਵੱਡੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ।", category: "ਨਿਵੇਸ਼", icon: "trending-up" },
            { id: 4, title: "ਜੀਵਨਸ਼ੈਲੀ ਵਿਸ਼ਾਲੀਕਰਣ ਤੋਂ ਬਚੋ", content: "ਜਿਵੇਂ ਹੀ ਤੁਹਾਡੀ ਆਮਦਨ ਵਧਦੀ ਹੈ, ਖਰਚਿਆਂ ਨੂੰ ਸਮਾਨ ਰੂਪ ਵਿੱਚ ਵਧਾਉਣ ਦੀ ਪ੍ਰਵ੍ਰਿਤੀ ਦਾ ਵਿਰੋਧ ਕਰੋ। ਆਪਣੀ ਬੱਚਤ ਦਰ ਬਣਾਈ ਰੱਖੋ।", category: "ਖਰਚ", icon: "money-off" },
            { id: 5, title: "ਕਰਜ਼ਾ ਪ੍ਰਬੰਧਨ", content: "ਪਹਿਲਾਂ ਉੱਚ ਵਿਆਜ ਵਾਲੇ ਕਰਜ਼ੇ ਦਾ ਭੁਗਤਾਨ ਕਰੋ। ਜੇ ਤੁਹਾਡੇ ਕੋਲ ਕਈ ਕਰਜ਼ੇ ਹਨ ਤਾਂ ਕਰਜ਼ਾ ਇਕੱਠਾ ਕਰਨ ਬਾਰੇ ਸੋਚੋ।", category: "ਕਰਜ਼ਾ", icon: "credit-card" },
            { id: 6, title: "ਟੈਕਸ ਯੋਜਨਾ", content: "ਸਾਲ ਭਰ ਆਪਣੇ ਟੈਕਸਾਂ ਦੀ ਯੋਜਨਾ ਬਣਾਓ। ELSS, PPF, ਅਤੇ NSC ਵਰਗੇ ਟੈਕਸ-ਬਚਤ ਸਾਧਨਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।", category: "ਟੈਕਸ", icon: "receipt" },
          ]
        };
        
        setTips(mockTips[selectedLanguage] || mockTips['en']);
      }
    } catch (error) {
      Alert.alert(translate('Error', 'Error'), translate('Failed to fetch financial tips', 'Failed to fetch financial tips'));
    }
  };

  const handleLanguageChange = async (language) => {
    setSelectedLanguage(language);
    await changeLanguage(language);
  };

  const renderTips = () => {
    return tips.map((tip) => (
      <View key={tip.id} style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <View style={styles.tipIconContainer}>
            <Icon name={tip.icon || 'lightbulb-outline'} size={24} color="#FFFDE7" />
          </View>
          <View style={styles.tipHeaderText}>
            <Text style={styles.tipCategory}>{tip.category}</Text>
            <Text style={styles.tipTitle}>{tip.title}</Text>
          </View>
        </View>
        <Text style={styles.tipContent}>{tip.content}</Text>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{translate('Financial Tips', 'Financial Tips')}</Text>
        <Text style={styles.subtitle}>{translate('Daily financial advice to improve your money management', 'Daily financial advice to improve your money management')}</Text>
      </View>

      <View style={styles.languageSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.entries(supportedLanguages).slice(0, 5).map(([code, name]) => (
            <TouchableOpacity 
              key={code}
              style={[styles.languageButton, selectedLanguage === code && styles.selectedLanguage]}
              onPress={() => handleLanguageChange(code)}
            >
              <Text style={[
                styles.languageText,
                selectedLanguage === code && styles.selectedLanguageText
              ]}>
                {name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    backgroundColor: '#FFFDE7', // Cream background
  },
  header: {
    backgroundColor: '#2E7D32', // Primary color
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFDE7', // Cream text
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFDE7', // Cream text
    opacity: 0.9,
  },
  languageSelector: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#E8F5E9', // Light green
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  selectedLanguage: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  languageText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedLanguageText: {
    color: '#FFFDE7',
  },
  tipsContainer: {
    padding: 20,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FFEB3B', // Accent color
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tipHeaderText: {
    flex: 1,
  },
  tipCategory: {
    fontSize: 12,
    color: '#388E3C', // Secondary color
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32', // Primary color
    marginTop: 2,
  },
  tipContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
});

export default TipsScreen;