import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to ArthRakshak</Text>
        <Text style={styles.subtitle}>Your Financial Safety & Education Companion</Text>
      </View>

      <View style={styles.featureGrid}>
        <TouchableOpacity 
          style={styles.featureCard} 
          onPress={() => navigation.navigate('Budget')}
        >
          <Icon name="account-balance-wallet" size={40} color="#2E8B57" />
          <Text style={styles.featureTitle}>Budget Planner</Text>
          <Text style={styles.featureDescription}>Plan and track your monthly expenses</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard} 
          onPress={() => navigation.navigate('Goals')}
        >
          <Icon name="flag" size={40} color="#2E8B57" />
          <Text style={styles.featureTitle}>Financial Goals</Text>
          <Text style={styles.featureDescription}>Set and track your savings targets</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard} 
          onPress={() => navigation.navigate('Chatbot')}
        >
          <Icon name="chat" size={40} color="#2E8B57" />
          <Text style={styles.featureTitle}>Financial Chatbot</Text>
          <Text style={styles.featureDescription}>Get personalized financial advice</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard} 
          onPress={() => navigation.navigate('Tips')}
        >
          <Icon name="lightbulb-outline" size={40} color="#2E8B57" />
          <Text style={styles.featureTitle}>Financial Tips</Text>
          <Text style={styles.featureDescription}>Daily tips to improve your finances</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard} 
          onPress={() => navigation.navigate('Quiz')}
        >
          <Icon name="quiz" size={40} color="#2E8B57" />
          <Text style={styles.featureTitle}>Financial Quiz</Text>
          <Text style={styles.featureDescription}>Test your financial knowledge</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard} 
          onPress={() => navigation.navigate('FraudShield')}
        >
          <Icon name="security" size={40} color="#2E8B57" />
          <Text style={styles.featureTitle}>Fraud Shield</Text>
          <Text style={styles.featureDescription}>Report and avoid financial scams</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard} 
          onPress={() => navigation.navigate('Therapist')}
        >
          <Icon name="healing" size={40} color="#2E8B57" />
          <Text style={styles.featureTitle}>Financial Therapist</Text>
          <Text style={styles.featureDescription}>Get stress-relief financial advice</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard} 
          onPress={() => navigation.navigate('EMI Calculator')}
        >
          <Icon name="calculate" size={40} color="#2E8B57" />
          <Text style={styles.featureTitle}>EMI Calculator</Text>
          <Text style={styles.featureDescription}>Calculate your loan EMIs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calculatorsSection}>
        <Text style={styles.sectionTitle}>Quick Calculators</Text>
        <TouchableOpacity 
          style={styles.calculatorButton}
          onPress={() => navigation.navigate('SIP Calculator')}
        >
          <Text style={styles.calculatorButtonText}>SIP Calculator</Text>
        </TouchableOpacity>
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  featureCard: {
    width: '45%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  calculatorsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  calculatorButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  calculatorButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;