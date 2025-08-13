import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const ChatbotScreen = () => {
  const { translate } = useLanguage();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your financial assistant. How can I help you today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [userType, setUserType] = useState('student'); // Default user type
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      // Try to get response from backend chatbot service
      const response = await api.post('/chatbot/chat', {
        message: currentInput
      });

      const botResponse = {
        id: Date.now() + 1,
        text: response.data.response || getBotResponse(currentInput),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      // Fallback to local bot response
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(currentInput),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputText(question);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{translate('Financial Chatbot', 'Financial Chatbot')}</Text>
        <Text style={styles.subtitle}>{translate('Ask me anything about finance', 'Ask me anything about finance')}</Text>
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
            <View style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userMessage : styles.botMessage
            ]}>
              <Text style={[
                styles.messageText,
                message.sender === 'user' ? styles.userMessageText : styles.botMessageText
              ]}>
                {message.text}
              </Text>
              {message.timestamp && (
                <Text style={[
                  styles.messageTime,
                  message.sender === 'user' ? styles.userMessageTime : styles.botMessageTime
                ]}>
                  {formatTime(message.timestamp)}
                </Text>
              )}
            </View>
          </View>
        ))}
        {isLoading && (
          <View style={styles.botMessageContainer}>
            <View style={[styles.messageBubble, styles.botMessage]}>
              <Text style={styles.typingText}>{translate('Typing...', 'Typing...')}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.quickQuestions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.quickQuestionButton}
            onPress={() => handleQuickQuestion("How should I budget as a student?")}
          >
            <Text style={styles.quickQuestionText}>{translate('Budget Tips', 'Budget Tips')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickQuestionButton}
            onPress={() => handleQuickQuestion("How can I save more money?")}
          >
            <Text style={styles.quickQuestionText}>{translate('Saving Tips', 'Saving Tips')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickQuestionButton}
            onPress={() => handleQuickQuestion("What are good investment options?")}
          >
            <Text style={styles.quickQuestionText}>{translate('Investments', 'Investments')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickQuestionButton}
            onPress={() => handleQuickQuestion("How to avoid financial scams?")}
          >
            <Text style={styles.quickQuestionText}>{translate('Fraud Prevention', 'Fraud Prevention')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={translate('Type your financial question...', 'Type your financial question...')}
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Icon name="send" size={20} color="#FFFDE7" />
        </TouchableOpacity>
      </View>
    </View>
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
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  chatContent: {
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  userMessage: {
    backgroundColor: '#2E7D32', // Primary color
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#E8F5E9', // Light green
    borderBottomLeftRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFDE7', // Cream text
  },
  botMessageText: {
    color: '#2E7D32', // Primary color
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  userMessageTime: {
    color: '#FFFDE7',
    opacity: 0.7,
  },
  botMessageTime: {
    color: '#388E3C',
  },
  typingText: {
    color: '#388E3C',
    fontStyle: 'italic',
  },
  quickQuestions: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#E8F5E9', // Light green
  },
  quickQuestionButton: {
    backgroundColor: '#FFEB3B', // Accent color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  quickQuestionText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 20,
    padding: 12,
    marginRight: 10,
    maxHeight: 100,
    backgroundColor: '#FFFDE7',
  },
  sendButton: {
    backgroundColor: '#2E7D32', // Primary color
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E8F5E9',
  },
  sendButtonText: {
    color: '#FFFDE7',
    fontWeight: 'bold',
  },
});

export default ChatbotScreen;