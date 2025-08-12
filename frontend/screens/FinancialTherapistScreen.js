import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import axios from 'axios';

const FinancialTherapistScreen = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your financial therapist. I'm here to help you manage financial stress and anxiety. How are you feeling today?", sender: 'therapist' }
  ]);
  const [inputText, setInputText] = useState('');
  const [stressLevel, setStressLevel] = useState(5); // 1-10 scale
  const [modalVisible, setModalVisible] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState(''); // 'inhale', 'hold', 'exhale'
  const [breathingActive, setBreathingActive] = useState(false);

  const getTherapistResponse = (userMessage) => {
    // This is a simplified response system
    // In a real app, this would connect to an AI service
    const message = userMessage.toLowerCase();
    
    if (message.includes('stressed') || message.includes('anxious') || message.includes('worried')) {
      return "I understand that financial stress can be overwhelming. Let's take a moment to breathe deeply. Financial challenges are common, and there are always steps we can take to improve the situation. Would you like to try a breathing exercise?";
    } else if (message.includes('debt') || message.includes('loan')) {
      return "Debt can feel burdensome, but remember that many people face similar challenges. The key is to create a realistic repayment plan. Consider speaking with your creditors about restructuring options if needed. You're taking a positive step by seeking help.";
    } else if (message.includes('income') || message.includes('job') || message.includes('unemployed')) {
      return "Income uncertainty is a major source of financial stress. While job searching or waiting for income changes, focus on essential expenses only. Consider reaching out to community resources or financial assistance programs that might be available to you.";
    } else if (message.includes('family') || message.includes('pressure')) {
      return "Family financial pressures are difficult to navigate. Remember that your worth isn't determined by your financial situation. Setting boundaries around financial discussions with family members can sometimes help reduce stress.";
    } else if (message.includes('future') || message.includes('scared')) {
      return "It's natural to feel uncertain about the future. Instead of focusing on worst-case scenarios, try to identify small, actionable steps you can take today. Building an emergency fund, even with small amounts, can provide a sense of security.";
    } else {
      return "I'm here to support you with financial stress and anxiety. Feel free to share what's on your mind. Remember, seeking help is a sign of strength, not weakness.";
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user'
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');

    // Simulate therapist thinking
    setTimeout(() => {
      const therapistResponse = {
        id: messages.length + 2,
        text: getTherapistResponse(inputText),
        sender: 'therapist'
      };
      setMessages(prevMessages => [...prevMessages, therapistResponse]);
    }, 1000);
  };

  const startBreathingExercise = () => {
    setModalVisible(true);
    setBreathingActive(true);
    breathingCycle();
  };

  const breathingCycle = () => {
    if (!breathingActive) return;
    
    setBreathingPhase('inhale');
    setTimeout(() => {
      if (!breathingActive) return;
      setBreathingPhase('hold');
      setTimeout(() => {
        if (!breathingActive) return;
        setBreathingPhase('exhale');
        setTimeout(() => {
          if (!breathingActive) return;
          breathingCycle();
        }, 4000);
      }, 4000);
    }, 4000);
  };

  const stopBreathingExercise = () => {
    setBreathingActive(false);
    setModalVisible(false);
  };

  const handleQuickStressCheck = () => {
    Alert.alert(
      "Stress Check",
      "On a scale of 1-10, how would you rate your current financial stress level?",
      [
        { text: "1", onPress: () => setStressLevel(1) },
        { text: "3", onPress: () => setStressLevel(3) },
        { text: "5", onPress: () => setStressLevel(5) },
        { text: "7", onPress: () => setStressLevel(7) },
        { text: "10", onPress: () => setStressLevel(10) }
      ]
    );
  };

  const getStressAdvice = () => {
    if (stressLevel <= 3) {
      return "You're doing well managing your financial stress. Keep practicing healthy coping strategies like budgeting and saving.";
    } else if (stressLevel <= 6) {
      return "You're experiencing moderate financial stress. Consider creating a detailed budget and speaking with a financial advisor for personalized guidance.";
    } else {
      return "You're experiencing high financial stress. It's important to seek support from financial counselors or mental health professionals. Remember, you're not alone in this.";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Therapist</Text>
        <Text style={styles.subtitle}>Managing financial stress and anxiety</Text>
      </View>

      <View style={styles.stressContainer}>
        <Text style={styles.stressText}>Current Stress Level: {stressLevel}/10</Text>
        <View style={styles.stressBar}>
          <View style={[styles.stressFill, { width: `${stressLevel * 10}%` }]} />
        </View>
        <Text style={styles.stressAdvice}>{getStressAdvice()}</Text>
        <TouchableOpacity 
          style={styles.stressButton}
          onPress={handleQuickStressCheck}
        >
          <Text style={styles.stressButtonText}>Update Stress Level</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.chatContainer} 
        contentContainerStyle={styles.chatContent}
        ref={ref => { this.scrollView = ref; }}
        onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageContainer, 
              message.sender === 'user' ? styles.userMessageContainer : styles.therapistMessageContainer
            ]}
          >
            <Text style={[
              styles.messageText, 
              message.sender === 'user' ? styles.userMessageText : styles.therapistMessageText
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.toolsContainer}>
        <TouchableOpacity 
          style={styles.toolButton}
          onPress={startBreathingExercise}
        >
          <Text style={styles.toolButtonText}>Breathing Exercise</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.toolButton}
          onPress={() => Alert.alert(
            "Financial Wellness Tips",
            "1. Practice gratitude for what you have\n2. Focus on progress, not perfection\n3. Seek support when needed\n4. Take breaks from financial news\n5. Celebrate small wins"
          )}
        >
          <Text style={styles.toolButtonText}>Wellness Tips</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Share your financial concerns..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={stopBreathingExercise}
      >
        <View style={styles.modalContainer}>
          <View style={styles.breathingModal}>
            <Text style={styles.breathingTitle}>Breathing Exercise</Text>
            <Text style={styles.breathingInstruction}>
              {breathingPhase === 'inhale' && 'Breathe in slowly through your nose...'}
              {breathingPhase === 'hold' && 'Hold your breath...'}
              {breathingPhase === 'exhale' && 'Exhale slowly through your mouth...'}
            </Text>
            <View style={styles.breathingCircle}>
              <Text style={styles.breathingText}>
                {breathingPhase === 'inhale' && '4'}
                {breathingPhase === 'hold' && '4'}
                {breathingPhase === 'exhale' && '6'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.stopButton}
              onPress={stopBreathingExercise}
            >
              <Text style={styles.stopButtonText}>Stop Exercise</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  stressContainer: {
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
  stressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  stressBar: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
  },
  stressFill: {
    height: '100%',
    backgroundColor: '#2E8B57',
    borderRadius: 10,
  },
  stressAdvice: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  stressButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  stressButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatContent: {
    paddingBottom: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessageContainer: {
    backgroundColor: '#2E8B57',
    alignSelf: 'flex-end',
  },
  therapistMessageContainer: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: 'white',
  },
  therapistMessageText: {
    color: '#333',
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  toolButton: {
    backgroundColor: '#2E8B57',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  toolButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  breathingModal: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  breathingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
  },
  breathingInstruction: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  breathingText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  stopButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FinancialTherapistScreen;