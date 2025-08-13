import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, ScrollView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const FloatingChatbot = () => {
  const { translate } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your financial assistant. How can I help you today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pulseAnim = new Animated.Value(1);

  React.useEffect(() => {
    // Pulse animation for the floating button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot/chat', {
        message: userMessage.text
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response || 'I apologize, but I couldn\'t process your request right now. Please try again.',
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'I\'m having trouble connecting right now. Please try again later.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Animated.View style={[styles.floatingButton, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setIsVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="chat" size={28} color="#FFFDE7" />
        </TouchableOpacity>
      </Animated.View>

      {/* Chat Modal */}
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.chatContainer}>
            {/* Header */}
            <View style={styles.chatHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.botAvatar}>
                  <Icon name="smart-toy" size={24} color="#FFFDE7" />
                </View>
                <View>
                  <Text style={styles.botName}>{translate('Financial Assistant', 'Financial Assistant')}</Text>
                  <Text style={styles.botStatus}>{translate('Online', 'Online')}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Icon name="close" size={24} color="#FFFDE7" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageWrapper,
                    message.isBot ? styles.botMessageWrapper : styles.userMessageWrapper
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      message.isBot ? styles.botMessage : styles.userMessage
                    ]}
                  >
                    <Text style={[
                      styles.messageText,
                      message.isBot ? styles.botMessageText : styles.userMessageText
                    ]}>
                      {message.text}
                    </Text>
                    <Text style={[
                      styles.messageTime,
                      message.isBot ? styles.botMessageTime : styles.userMessageTime
                    ]}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </View>
                </View>
              ))}
              {isLoading && (
                <View style={styles.botMessageWrapper}>
                  <View style={[styles.messageBubble, styles.botMessage]}>
                    <Text style={styles.typingText}>{translate('Typing...', 'Typing...')}</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder={translate('Type your message...', 'Type your message...')}
                placeholderTextColor="#999"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isLoading}
              >
                <Icon name="send" size={20} color="#FFFDE7" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  chatButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E7D32', // Primary color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    backgroundColor: '#FFFDE7', // Cream background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingTop: 20,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  botName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  botStatus: {
    fontSize: 12,
    color: '#388E3C',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageWrapper: {
    marginVertical: 4,
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  botMessage: {
    backgroundColor: '#E8F5E9', // Light green
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#2E7D32', // Primary color
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botMessageText: {
    color: '#2E7D32',
  },
  userMessageText: {
    color: '#FFFDE7',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  botMessageTime: {
    color: '#388E3C',
  },
  userMessageTime: {
    color: '#FFFDE7',
    opacity: 0.7,
  },
  typingText: {
    color: '#388E3C',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
    backgroundColor: '#FFFDE7',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E8F5E9',
  },
});

export default FloatingChatbot;