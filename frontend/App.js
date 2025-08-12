import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from './context/AuthContext';
// Import screens
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

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Main tabs navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Budget') {
            iconName = 'account-balance-wallet';
          } else if (route.name === 'Goals') {
            iconName = 'flag';
          } else if (route.name === 'Chatbot') {
            iconName = 'chat';
          } else if (route.name === 'Tips') {
            iconName = 'lightbulb-outline';
          } else if (route.name === 'Quiz') {
            iconName = 'quiz';
          } else if (route.name === 'FraudShield') {
            iconName = 'security';
          } else if (route.name === 'Therapist') {
            iconName = 'healing';
          } else if (route.name === 'Alerts') {
            iconName = 'notifications';
          } else if (route.name === 'Voice') {
            iconName = 'mic';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E8B57',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Budget" component={BudgetPlannerScreen} />
      <Tab.Screen name="Goals" component={FinancialGoalsScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      <Tab.Screen name="Tips" component={TipsScreen} />
      <Tab.Screen name="Quiz" component={QuizScreen} />
      <Tab.Screen name="FraudShield" component={FraudReportingScreen} />
      <Tab.Screen name="Therapist" component={FinancialTherapistScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Voice" component={VoiceAssistantScreen} />
    </Tab.Navigator>
  );
}

// Main drawer navigator
function MainDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="EMI Calculator" component={EMICalculatorScreen} />
      <Drawer.Screen name="SIP Calculator" component={SIPCalculatorScreen} />
    </Drawer.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogin = () => {
    console.log('handleLogin called');
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider value={{ onLogin: handleLogin, isLoggedIn }}>
      <NavigationContainer>
        {isLoggedIn ? <MainDrawer /> : <AuthStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});