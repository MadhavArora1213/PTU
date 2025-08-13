import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const { translate, supportedLanguages } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('student');
  const [language, setLanguage] = useState('en');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const { onLogin } = useContext(AuthContext);

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const sendOTP = async () => {
    // Validate email first
    if (!email) {
      Alert.alert(translate('Error', 'Error'), translate('Please enter your email address', 'Please enter your email address'));
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert(translate('Error', 'Error'), translate('Please enter a valid email address', 'Please enter a valid email address'));
      return;
    }

    setOtpLoading(true);
    
    try {
      console.log('Sending OTP to:', email);
      const response = await api.post('/auth/send-otp', {
        email,
        language
      });
      console.log('OTP response:', response.data);
      
      setOtpLoading(false);
      setOtpSent(true);
      
      // Handle development mode
      if (response.data.developmentMode) {
        Alert.alert(
          'Development Mode',
          'Email service is unavailable. The OTP has been logged to the server console. Check the terminal/logs for the OTP code.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Success',
          'OTP sent to your email. Please check your inbox and enter the 6-digit code.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('OTP error:', error);
      console.log('Error response:', error.response?.data);
      setOtpLoading(false);
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleRegister = async () => {
    // Validate all fields
    if (!name || !email || !password || !otp) {
      Alert.alert('Error', 'Please fill in all required fields including OTP');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters with uppercase, lowercase, number and special character'
      );
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      Alert.alert('Error', 'OTP must be exactly 6 digits');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Attempting to register user:', { name, email, phone, userType, language });
      const requestData = {
        name,
        email,
        password,
        phone,
        userType,
        language,
        otp
      };
      console.log('Registration request data:', requestData);
      console.log('Sending registration request to:', '/auth/register');
      const response = await api.post('/auth/register', requestData);
      console.log('Registration response:', response.data);
      console.log('Registration response status:', response.status);
      
      setLoading(false);
      Alert.alert(
        'Success',
        'Registration successful! You can now login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.error('Registration error:', error);
      console.log('Error response:', error.response?.data);
      setLoading(false);
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ArthRakshak</Text>
      <Text style={styles.subtitle}>{translate('Create your account', 'Create your account')}</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={translate('Full Name', 'Full Name')}
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.input}
          placeholder={translate('Email', 'Email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.input}
          placeholder={translate('Password', 'Password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.input}
          placeholder={translate('Phone (optional)', 'Phone (optional)')}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>{translate('User Type', 'User Type')}</Text>
          <Picker
            selectedValue={userType}
            style={styles.picker}
            onValueChange={(itemValue) => setUserType(itemValue)}
          >
            <Picker.Item label={translate('Student', 'Student')} value="student" />
            <Picker.Item label={translate('Salaried Professional', 'Salaried Professional')} value="salaried" />
            <Picker.Item label={translate('Business Owner', 'Business Owner')} value="business" />
          </Picker>
        </View>
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>{translate('Language', 'Language')}</Text>
          <Picker
            selectedValue={language}
            style={styles.picker}
            onValueChange={(itemValue) => setLanguage(itemValue)}
          >
            {Object.entries(supportedLanguages).map(([code, name]) => (
              <Picker.Item key={code} label={name} value={code} />
            ))}
          </Picker>
        </View>

        {!otpSent ? (
          <TouchableOpacity
            style={[styles.otpButton, (!email || otpLoading) && styles.buttonDisabled]}
            onPress={sendOTP}
            disabled={otpLoading || !email}
          >
            <Text style={styles.otpButtonText}>
              {otpLoading ? translate('Sending OTP...', 'Sending OTP...') : translate('Send OTP', 'Send OTP')}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder={translate('Enter 6-digit OTP', 'Enter 6-digit OTP')}
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
              placeholderTextColor="#999"
            />
            
            <View style={styles.otpActions}>
              <TouchableOpacity
                style={[styles.resendButton, otpLoading && styles.buttonDisabled]}
                onPress={sendOTP}
                disabled={otpLoading}
              >
                <Text style={styles.resendButtonText}>
                  {otpLoading ? translate('Sending...', 'Sending...') : translate('Resend OTP', 'Resend OTP')}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, (loading || !otp) && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading || !otp}
            >
              <Text style={styles.registerButtonText}>
                {loading ? translate('Registering...', 'Registering...') : translate('Verify & Register', 'Verify & Register')}
              </Text>
            </TouchableOpacity>
          </>
        )}
        
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLink}>
            {translate('Already have an account? Login', 'Already have an account? Login')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7', // Cream background
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32', // Primary color
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#388E3C', // Secondary color
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8F5E9', // Light green
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#FFFDE7', // Cream background
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#2E7D32', // Primary color
    fontWeight: 'bold',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 10,
    backgroundColor: '#FFFDE7',
  },
  otpButton: {
    backgroundColor: '#388E3C', // Secondary color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  otpButtonText: {
    color: '#FFFDE7', // Cream text
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  resendButton: {
    backgroundColor: '#FFEB3B', // Accent color
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#2E7D32', // Primary color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#FFFDE7', // Cream text
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    textAlign: 'center',
    color: '#2E7D32', // Primary color
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#E8F5E9', // Light green
    opacity: 0.6,
  },
});

export default RegisterScreen;