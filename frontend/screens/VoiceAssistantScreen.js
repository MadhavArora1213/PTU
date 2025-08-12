import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { speak, stopSpeaking, startListening, stopListening, isSpeaking } from '../services/voiceService';
import { getUserProfile } from '../services/userService';

const VoiceAssistantScreen = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setUserProfile(response.user);
      setLanguage(response.user.language || 'en');
    } catch (error) {
      console.log('Failed to fetch user profile');
    }
  };

  const handleStartListening = () => {
    startListening(
      (result) => {
        setTranscript(result);
        processVoiceCommand(result);
      },
      (error) => {
        Alert.alert('Error', 'Failed to recognize speech: ' + error.message);
        setIsListening(false);
      }
    );
    setIsListening(true);
  };

  const handleStopListening = () => {
    stopListening();
    setIsListening(false);
  };

  const processVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      speak(`Hello ${userProfile?.name || 'user'}! How can I help you today?`, language);
    } else if (lowerCommand.includes('budget')) {
      speak('You can check your budget in the Budget Planner section. Would you like me to navigate there for you?', language);
    } else if (lowerCommand.includes('goal') || lowerCommand.includes('target')) {
      speak('You can track your financial goals in the Goals section. Would you like me to navigate there for you?', language);
    } else if (lowerCommand.includes('tip') || lowerCommand.includes('advice')) {
      speak('You can find daily financial tips in the Tips section. Would you like me to navigate there for you?', language);
    } else if (lowerCommand.includes('quiz') || lowerCommand.includes('test')) {
      speak('You can test your financial knowledge with our quizzes. Would you like me to navigate there for you?', language);
    } else if (lowerCommand.includes('fraud') || lowerCommand.includes('scam')) {
      speak('You can report fraud or check fraud alerts in the Fraud Shield section. Would you like me to navigate there for you?', language);
    } else if (lowerCommand.includes('therapist') || lowerCommand.includes('stress')) {
      speak('You can speak with our financial therapist in the Therapist section. Would you like me to navigate there for you?', language);
    } else if (lowerCommand.includes('stop')) {
      stopSpeaking();
    } else {
      speak('I didn\'t understand that command. You can ask me about budgets, goals, tips, quizzes, fraud protection, or financial therapy.', language);
    }
  };

  const readScreenContent = () => {
    const content = `Voice Assistant Screen. 
      You can use voice commands to navigate the app. 
      Say "budget" to go to budget planner. 
      Say "goal" to track financial goals. 
      Say "tip" for financial advice. 
      Say "quiz" to test your knowledge. 
      Say "fraud" for fraud protection. 
      Say "therapist" for financial stress support.`;
    
    speak(content, language);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Assistant</Text>
        <Text style={styles.subtitle}>Control the app with your voice</Text>
      </View>

      <View style={styles.voiceCard}>
        <Text style={styles.voiceTitle}>Voice Commands</Text>
        <Text style={styles.voiceDescription}>
          Tap the microphone and speak your command. Try saying "budget", "goal", "tip", "quiz", "fraud", or "therapist".
        </Text>
        
        <View style={styles.microphoneContainer}>
          <TouchableOpacity 
            style={[styles.microphoneButton, isListening && styles.listeningButton]}
            onPress={isListening ? handleStopListening : handleStartListening}
          >
            <Text style={styles.microphoneText}>
              {isListening ? 'STOP LISTENING' : 'START LISTENING'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {transcript ? (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptLabel}>You said:</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Voice Features</Text>
        
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={readScreenContent}
        >
          <Text style={styles.featureTitle}>Read Screen Content</Text>
          <Text style={styles.featureDescription}>Hear the content of the current screen</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => speak('This is a sample text to speech feature.', language)}
        >
          <Text style={styles.featureTitle}>Text to Speech</Text>
          <Text style={styles.featureDescription}>Convert text to spoken words</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={stopSpeaking}
        >
          <Text style={styles.featureTitle}>Stop Speaking</Text>
          <Text style={styles.featureDescription}>Stop current text-to-speech output</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Voice Commands Guide</Text>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionText}>"Budget" - Go to budget planner</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionText}>"Goal" - Track financial goals</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionText}>"Tip" - Get financial advice</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionText}>"Quiz" - Test your knowledge</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionText}>"Fraud" - Report or check fraud alerts</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionText}>"Therapist" - Get financial stress support</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionText}>"Stop" - Stop current speech output</Text>
        </View>
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
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  voiceCard: {
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
  voiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  voiceDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  microphoneContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  microphoneButton: {
    backgroundColor: '#2E8B57',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listeningButton: {
    backgroundColor: '#ff6b6b',
  },
  microphoneText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  transcriptContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  transcriptLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  transcriptText: {
    fontSize: 16,
    color: '#666',
  },
  featuresContainer: {
    padding: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 16,
    color: '#666',
  },
  instructionsContainer: {
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
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  instructionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
  },
});

export default VoiceAssistantScreen;