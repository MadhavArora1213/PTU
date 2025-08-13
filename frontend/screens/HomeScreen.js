import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../context/LanguageContext';
import ImageSlider from '../components/ImageSlider';
import HelplineNumbers from '../components/HelplineNumbers';
import FloatingChatbot from '../components/FloatingChatbot';
import api from '../services/api';

const HomeScreen = ({ navigation }) => {
  const { translate } = useLanguage();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Check if user is logged in by checking for token
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const token = await AsyncStorage.getItem('token');
      
      if (token) {
        // User is logged in, try to fetch profile
        const response = await api.get('/user/profile');
        setUserData(response.data.user);
      } else {
        // User is not logged in, use default data
        setUserData({ name: translate('Guest User', 'Guest User') });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't show error alert, just use default data
      setUserData({ name: translate('Guest User', 'Guest User') });
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return translate('Good Morning', 'Good Morning');
    } else if (hour < 17) {
      return translate('Good Afternoon', 'Good Afternoon');
    } else {
      return translate('Good Evening', 'Good Evening');
    }
  };

  const quickActions = [
    {
      id: 1,
      title: 'Budget Planner',
      description: 'Plan and track your monthly expenses',
      icon: 'account-balance-wallet',
      screen: 'Budget Planner',
      color: '#2E7D32'
    },
    {
      id: 2,
      title: 'Financial Goals',
      description: 'Set and track your savings targets',
      icon: 'flag',
      screen: 'Financial Goals',
      color: '#388E3C'
    },
    {
      id: 3,
      title: 'EMI Calculator',
      description: 'Calculate your loan EMIs',
      icon: 'calculate',
      screen: 'EMI Calculator',
      color: '#43A047'
    },
    {
      id: 4,
      title: 'Fraud Shield',
      description: 'Report and avoid financial scams',
      icon: 'security',
      screen: 'Fraud Shield',
      color: '#4CAF50'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with user greeting */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>
              {loading ? translate('Loading...', 'Loading...') : userData?.name || translate('User', 'User')}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="account-circle" size={40} color="#FFFDE7" />
          </TouchableOpacity>
        </View>

        {/* Image Slider */}
        <ImageSlider />

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>
            {translate('Quick Actions', 'Quick Actions')}
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { borderLeftColor: action.color }]}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Icon name={action.icon} size={24} color="#FFFDE7" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>
                    {translate(action.title, action.title)}
                  </Text>
                  <Text style={styles.actionDescription}>
                    {translate(action.description, action.description)}
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color="#388E3C" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Helpline Numbers */}
        <HelplineNumbers />

        {/* Financial Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsSectionHeader}>
            <Text style={styles.sectionTitle}>
              {translate('Financial Tips', 'Financial Tips')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tips')}>
              <Text style={styles.viewAllText}>
                {translate('View All', 'View All')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.tipCard}
            onPress={() => navigation.navigate('Tips')}
          >
            <View style={styles.tipIcon}>
              <Icon name="lightbulb-outline" size={24} color="#FFEB3B" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>
                {translate('Tip of the Day', 'Tip of the Day')}
              </Text>
              <Text style={styles.tipText}>
                {translate('Start saving at least 20% of your income for a secure financial future', 'Start saving at least 20% of your income for a secure financial future')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing for floating chatbot */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7', // Cream background
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2E7D32', // Primary color
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#FFFDE7', // Cream text
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFDE7', // Cream text
    marginTop: 4,
  },
  profileButton: {
    padding: 5,
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32', // Primary color
    marginBottom: 15,
  },
  quickActionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  tipsSection: {
    padding: 20,
    paddingTop: 0,
  },
  tipsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#388E3C',
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: '#E8F5E9', // Light green
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#388E3C',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100, // Space for floating chatbot
  },
});

export default HomeScreen;