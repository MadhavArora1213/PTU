import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your financial assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [userType, setUserType] = useState('student'); // Default user type

  // Simulate getting user type from profile
  useEffect(() => {
    // In a real app, you would fetch this from the user profile
    // setUserType(userProfile.userType);
  }, []);

  const getBotResponse = (userMessage) => {
    // This is a simplified response system
    // In a real app, this would connect to an AI service like OpenAI
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello there! How can I assist you with your finances today?";
    } else if (message.includes('budget')) {
      if (userType === 'student') {
        return "As a student, I recommend starting with a simple budget. Track your income from allowances or part-time work, and list your expenses like books, food, and entertainment. Try to save at least 10% if possible!";
      } else if (userType === 'salaried') {
        return "For salaried professionals, I suggest the 50/30/20 rule: 50% for needs (rent, groceries), 30% for wants (entertainment), and 20% for savings and debt repayment.";
      } else if (userType === 'business') {
        return "As a business owner, it's crucial to separate personal and business finances. Track both business expenses and personal expenses separately, and consider setting aside 30% of business income for taxes.";
      }
    } else if (message.includes('save') || message.includes('savings')) {
      return "Great question! Start by building an emergency fund with 3-6 months of expenses. Then, consider high-yield savings accounts or fixed deposits for better returns on your savings.";
    } else if (message.includes('invest') || message.includes('investment')) {
      if (userType === 'student') {
        return "As a student, start with learning about investing through paper trading or small amounts in index funds. SIPs (Systematic Investment Plans) in mutual funds are a good way to start investing regularly.";
      } else {
        return "Diversification is key! Consider a mix of equity (stocks/mutual funds) for growth and debt (bonds/FDs) for stability. Your investment strategy should align with your risk tolerance and financial goals.";
      }
    } else if (message.includes('loan') || message.includes('emi')) {
      return "Before taking a loan, calculate if you can comfortably pay the EMI, which should ideally be less than 30% of your monthly income. Always compare interest rates and terms from multiple lenders.";
    } else if (message.includes('tax') || message.includes('itr')) {
      return "For ITR filing, keep all your financial documents organized. Use the correct ITR form based on your income sources. Consider consulting a CA for complex tax situations, but basic ITR filing can be done online through the income tax portal.";
    } else if (message.includes('fraud') || message.includes('scam')) {
      return "Be cautious of unsolicited calls/emails asking for personal information. Never share OTPs or banking details. If you suspect fraud, report it immediately to the relevant authorities and your bank.";
    } else {
      return "I'm here to help with financial questions! You can ask me about budgeting, saving, investing, taxes, or fraud prevention. What would you like to know?";
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

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        sender: 'bot'
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (question) => {
    setInputText(question);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Chatbot</Text>
        <Text style={styles.subtitle}>Ask me anything about finance</Text>
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
              message.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer
            ]}
          >
            <Text style={[
              styles.messageText, 
              message.sender === 'user' ? styles.userMessageText : styles.botMessageText
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickQuestions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.quickQuestionButton}
            onPress={() => handleQuickQuestion("How should I budget as a student?")}
          >
            <Text style={styles.quickQuestionText}>Budget Tips</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickQuestionButton}
            onPress={() => handleQuickQuestion("How can I save more money?")}
          >
            <Text style={styles.quickQuestionText}>Saving Tips</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickQuestionButton}
            onPress={() => handleQuickQuestion("What are good investment options?")}
          >
            <Text style={styles.quickQuestionText}>Investments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickQuestionButton}
            onPress={() => handleQuickQuestion("How to avoid financial scams?")}
          >
            <Text style={styles.quickQuestionText}>Fraud Prevention</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your financial question..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
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
  botMessageContainer: {
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
  botMessageText: {
    color: '#333',
  },
  quickQuestions: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  quickQuestionButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  quickQuestionText: {
    color: '#333',
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
});

export default ChatbotScreen;