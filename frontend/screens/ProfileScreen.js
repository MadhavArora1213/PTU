import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('en');
  const [points, setPoints] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user profile data
    fetchProfile();
    fetchUserPoints();
    fetchUserAchievements();
  }, []);

  const fetchProfile = async () => {
    try {
      // Replace with your actual backend URL
      // const response = await axios.get('http://localhost:5000/api/user/profile', {
      //   headers: { Authorization: `Bearer ${accessToken}` }
      // });
      
      // For demo purposes, using mock data
      setName('John Doe');
      setEmail('john@example.com');
      setPhone('+91 9876543210');
      setLanguage('en');
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile data');
    }
  };

  const fetchUserPoints = async () => {
    try {
      // Replace with your actual backend URL
      // const response = await axios.get('http://localhost:5000/api/user/points', {
      //   headers: { Authorization: `Bearer ${accessToken}` }
      // });
      
      // For demo purposes, using mock data
      setPoints(1250);
    } catch (error) {
      // Alert.alert('Error', 'Failed to fetch points');
    }
  };

  const fetchUserAchievements = async () => {
    try {
      // Replace with your actual backend URL
      // const response = await axios.get('http://localhost:5000/api/user/achievements', {
      //   headers: { Authorization: `Bearer ${accessToken}` }
      // });
      
      // For demo purposes, using mock data
      setAchievements([
        { id: 1, name: 'First Budget', description: 'Created your first budget plan', points: 100 },
        { id: 2, name: 'Quiz Master', description: 'Scored 100% in Financial Basics quiz', points: 250 },
        { id: 3, name: 'Safety First', description: 'Reported a potential fraud', points: 500 },
      ]);
    } catch (error) {
      // Alert.alert('Error', 'Failed to fetch achievements');
    }
  };

  const updateProfile = async () => {
    if (!name) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    
    try {
      // Replace with your actual backend URL
      // const response = await axios.put('http://localhost:5000/api/user/profile', {
      //   name,
      //   phone,
      //   language
      // }, {
      //   headers: { Authorization: `Bearer ${accessToken}` }
      // });
      
      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Profile</Text>
      </View>

      <View style={styles.pointsCard}>
        <Text style={styles.pointsTitle}>Your Reward Points</Text>
        <Text style={styles.pointsValue}>{points} points</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          editable={false}
        />
        
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        
        <Text style={styles.label}>Language</Text>
        <View style={styles.languageOptions}>
          <TouchableOpacity 
            style={[styles.languageButton, language === 'en' && styles.selectedLanguage]}
            onPress={() => setLanguage('en')}
          >
            <Text style={styles.languageText}>English</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.languageButton, language === 'hi' && styles.selectedLanguage]}
            onPress={() => setLanguage('hi')}
          >
            <Text style={styles.languageText}>Hindi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.languageButton, language === 'pa' && styles.selectedLanguage]}
            onPress={() => setLanguage('pa')}
          >
            <Text style={styles.languageText}>Punjabi</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.updateButton} 
          onPress={updateProfile}
          disabled={loading}
        >
          <Text style={styles.updateButtonText}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Your Achievements</Text>
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementCard}>
            <Text style={styles.achievementName}>{achievement.name}</Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
            <Text style={styles.achievementPoints}>+{achievement.points} points</Text>
          </View>
        ))}
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
  pointsCard: {
    backgroundColor: '#FFD700',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pointsTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  languageButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#2E8B57',
    borderColor: '#2E8B57',
  },
  languageText: {
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  achievementCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#2E8B57',
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  achievementPoints: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default ProfileScreen;