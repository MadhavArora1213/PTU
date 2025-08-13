import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const ProfileScreen = () => {
  const { translate, currentLanguage, supportedLanguages, changeLanguage } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('en');
  const [points, setPoints] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    // Fetch user profile data
    fetchProfile();
    fetchUserPoints();
    fetchUserAchievements();
  }, []);

  useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      const { user } = response.data;
      
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setLanguage(user.language || 'en');
    } catch (error) {
      Alert.alert(translate('Error', 'Error'), translate('Failed to fetch profile data', 'Failed to fetch profile data'));
    }
  };

  const fetchUserPoints = async () => {
    try {
      const response = await api.get('/user/points');
      setPoints(response.data.points || 0);
    } catch (error) {
      // Silent fail for points
    }
  };

  const fetchUserAchievements = async () => {
    try {
      const response = await api.get('/user/achievements');
      setAchievements(response.data.achievements || []);
    } catch (error) {
      // Silent fail for achievements
    }
  };

  const updateProfile = async () => {
    if (!name) {
      Alert.alert(translate('Error', 'Error'), translate('Name is required', 'Name is required'));
      return;
    }

    setLoading(true);
    
    try {
      await api.put('/user/profile', {
        name,
        phone,
        language
      });
      
      setLoading(false);
      Alert.alert(translate('Success', 'Success'), translate('Profile updated successfully', 'Profile updated successfully'));
    } catch (error) {
      setLoading(false);
      Alert.alert(translate('Error', 'Error'), translate('Failed to update profile', 'Failed to update profile'));
    }
  };

  const handleLanguageChange = async (selectedLanguage) => {
    try {
      setLoading(true);
      setShowLanguageModal(false);
      
      // Update language in context (this will also update the backend)
      const success = await changeLanguage(selectedLanguage);
      
      if (success) {
        setLanguage(selectedLanguage);
        Alert.alert(
          translate('Success', 'Success'),
          translate('Language updated successfully', 'Language updated successfully')
        );
      } else {
        Alert.alert(
          translate('Error', 'Error'),
          translate('Failed to update language', 'Failed to update language')
        );
      }
    } catch (error) {
      Alert.alert(
        translate('Error', 'Error'),
        translate('Failed to update language', 'Failed to update language')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{translate('Your Profile', 'Your Profile')}</Text>
      </View>

      <View style={styles.pointsCard}>
        <Icon name="stars" size={32} color="#FFEB3B" />
        <View style={styles.pointsContent}>
          <Text style={styles.pointsTitle}>{translate('Your Reward Points', 'Your Reward Points')}</Text>
          <Text style={styles.pointsValue}>{points} {translate('points', 'points')}</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>{translate('Full Name', 'Full Name')}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={translate('Enter your full name', 'Enter your full name')}
          placeholderTextColor="#999"
        />
        
        <Text style={styles.label}>{translate('Email', 'Email')}</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
        />
        
        <Text style={styles.label}>{translate('Phone', 'Phone')}</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder={translate('Enter your phone number', 'Enter your phone number')}
          placeholderTextColor="#999"
        />
        
        <Text style={styles.label}>{translate('Language', 'Language')}</Text>
        <TouchableOpacity 
          style={styles.languageSelector}
          onPress={() => setShowLanguageModal(true)}
        >
          <Text style={styles.languageSelectorText}>
            {supportedLanguages[language] || 'English'}
          </Text>
          <Icon name="keyboard-arrow-down" size={24} color="#388E3C" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.updateButton, loading && styles.updateButtonDisabled]} 
          onPress={updateProfile}
          disabled={loading}
        >
          <Text style={styles.updateButtonText}>
            {loading ? translate('Updating...', 'Updating...') : translate('Update Profile', 'Update Profile')}
          </Text>
        </TouchableOpacity>
      </View>

      {achievements.length > 0 && (
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>{translate('Your Achievements', 'Your Achievements')}</Text>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Icon name="emoji-events" size={24} color="#FFEB3B" />
              <View style={styles.achievementContent}>
                <Text style={styles.achievementName}>{achievement.achievement_name}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                <Text style={styles.achievementPoints}>+{achievement.points} {translate('points', 'points')}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.languageModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{translate('Select Language', 'Select Language')}</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Icon name="close" size={24} color="#2E7D32" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.languageList}>
              {Object.entries(supportedLanguages).map(([code, name]) => (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.languageOption,
                    language === code && styles.selectedLanguageOption
                  ]}
                  onPress={() => handleLanguageChange(code)}
                >
                  <Text style={[
                    styles.languageOptionText,
                    language === code && styles.selectedLanguageOptionText
                  ]}>
                    {name}
                  </Text>
                  {language === code && (
                    <Icon name="check" size={20} color="#FFFDE7" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  pointsCard: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#FFEB3B', // Accent color
  },
  pointsContent: {
    marginLeft: 15,
    flex: 1,
  },
  pointsTitle: {
    fontSize: 16,
    color: '#2E7D32',
    marginBottom: 5,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#FFFDE7',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  languageSelector: {
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFDE7',
  },
  languageSelectorText: {
    fontSize: 16,
    color: '#2E7D32',
  },
  updateButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonDisabled: {
    backgroundColor: '#E8F5E9',
  },
  updateButtonText: {
    color: '#FFFDE7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  achievementCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FFEB3B',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  achievementContent: {
    marginLeft: 15,
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  achievementPoints: {
    fontSize: 14,
    color: '#FFEB3B',
    fontWeight: 'bold',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageModal: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '90%',
    maxHeight: '70%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  languageList: {
    maxHeight: 400,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguageOption: {
    backgroundColor: '#2E7D32',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#2E7D32',
  },
  selectedLanguageOptionText: {
    color: '#FFFDE7',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;