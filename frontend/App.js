import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Context Providers
import { AuthContext } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Screens
import LoadingScreen from './screens/LoadingScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import BudgetPlannerScreen from './screens/BudgetPlannerScreen';
import EMICalculatorScreen from './screens/EMICalculatorScreen';
import SIPCalculatorScreen from './screens/SIPCalculatorScreen';
import FinancialGoalsScreen from './screens/FinancialGoalsScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import TipsScreen from './screens/TipsScreen';
import QuizScreen from './screens/QuizScreen';
import FraudReportingScreen from './screens/FraudReportingScreen';
import FinancialTherapistScreen from './screens/FinancialTherapistScreen';
import AlertsScreen from './screens/AlertsScreen';
import VoiceAssistantScreen from './screens/VoiceAssistantScreen';
import MoreScreen from './screens/MoreScreen';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Financial Education Screen (placeholder)
const FinancialEducationScreen = () => (
  <View style={styles.placeholderScreen}>
    <Icon name="school" size={60} color="#2E7D32" />
    <Text style={styles.placeholderText}>Financial Education</Text>
    <Text style={styles.placeholderSubtext}>Coming Soon</Text>
  </View>
);

// Helplines Screen (placeholder)
const HelplinesScreen = () => (
  <View style={styles.placeholderScreen}>
    <Icon name="support-agent" size={60} color="#2E7D32" />
    <Text style={styles.placeholderText}>Helplines</Text>
    <Text style={styles.placeholderSubtext}>Emergency contacts and support</Text>
  </View>
);

// Main tabs navigator with specified menu structure
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Financial Tips') {
            iconName = 'lightbulb-outline';
          } else if (route.name === 'Financial Education') {
            iconName = 'school';
          } else if (route.name === 'Helplines') {
            iconName = 'support-agent';
          } else if (route.name === 'More') {
            iconName = 'more-horiz';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32', // Primary color
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#FFFDE7', // Cream background
          borderTopColor: '#E8F5E9',
          borderTopWidth: 1,
          height: 75, // Increased height
          paddingBottom: 12, // More padding
          paddingTop: 12,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 13, // Slightly larger font
          fontWeight: '700', // Bolder text
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#FFFDE7',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Financial Tips" 
        component={TipsScreen}
        options={{ title: 'Financial Tips' }}
      />
      <Tab.Screen 
        name="Financial Education" 
        component={FinancialEducationScreen}
        options={{ title: 'Education' }}
      />
      <Tab.Screen 
        name="Helplines" 
        component={HelplinesScreen}
        options={{ title: 'Helplines' }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreScreen}
        options={{ title: 'More' }}
      />
    </Tab.Navigator>
  );
}

// Main drawer navigator
function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#FFFDE7',
        },
        drawerActiveTintColor: '#2E7D32',
        drawerInactiveTintColor: '#666',
        drawerLabelStyle: {
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#FFFDE7',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Drawer.Screen 
        name="Main" 
        component={MainTabs} 
        options={{ 
          headerShown: false,
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="account-circle" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Budget Planner" 
        component={BudgetPlannerScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="account-balance-wallet" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Financial Goals" 
        component={FinancialGoalsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="flag" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Chatbot" 
        component={ChatbotScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="chat" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="EMI Calculator" 
        component={EMICalculatorScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="calculate" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="SIP Calculator" 
        component={SIPCalculatorScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Quiz" 
        component={QuizScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="quiz" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Fraud Shield" 
        component={FraudReportingScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="security" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Financial Therapist" 
        component={FinancialTherapistScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="healing" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#FFFDE7',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Validate token by making a test API call
        try {
          const api = require('./services/api').default;
          await api.get('/user/profile');
          // If successful, user is logged in
          setIsLoggedIn(true);
        } catch (error) {
          // Token is invalid or expired, clear it
          console.log('Token validation failed, clearing stored tokens');
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('refreshToken');
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
    } finally {
      // Show loading screen for at least 2 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleLogin = () => {
    console.log('handleLogin called');
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    return (
      <LanguageProvider>
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <AuthContext.Provider value={{ onLogin: handleLogin, onLogout: handleLogout, isLoggedIn }}>
        <NavigationContainer>
          {isLoggedIn ? <MainDrawer /> : <AuthStack />}
        </NavigationContainer>
      </AuthContext.Provider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderScreen: {
    flex: 1,
    backgroundColor: '#FFFDE7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 20,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#388E3C',
    marginTop: 10,
    textAlign: 'center',
  },
});