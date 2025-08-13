import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
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
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
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
      <Text style={styles.subtitle}>Create your account</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Phone (optional)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>User Type</Text>
          <Picker
            selectedValue={userType}
            style={styles.picker}
            onValueChange={(itemValue) => setUserType(itemValue)}
          >
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Salaried Professional" value="salaried" />
            <Picker.Item label="Business Owner" value="business" />
          </Picker>
        </View>
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Language</Text>
          <Picker
            selectedValue={language}
            style={styles.picker}
            onValueChange={(itemValue) => setLanguage(itemValue)}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Hindi (हिंदी)" value="hi" />
            <Picker.Item label="Punjabi (ਪੰਜਾਬੀ)" value="pa" />
            <Picker.Item label="Bengali (বাংলা)" value="bn" />
            <Picker.Item label="Telugu (తెలుగు)" value="te" />
            <Picker.Item label="Marathi (मराठी)" value="mr" />
            <Picker.Item label="Tamil (தமிழ்)" value="ta" />
            <Picker.Item label="Gujarati (ગુજરાતી)" value="gu" />
            <Picker.Item label="Kannada (ಕನ್ನಡ)" value="kn" />
            <Picker.Item label="Malayalam (മലയാളം)" value="ml" />
            <Picker.Item label="Odia (ଓଡ଼ିଆ)" value="or" />
          </Picker>
        </View>

        {!otpSent ? (
          <TouchableOpacity
            style={styles.otpButton}
            onPress={sendOTP}
            disabled={otpLoading || !email}
          >
            <Text style={styles.otpButtonText}>
              {otpLoading ? 'Sending OTP...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
            />
            
            <View style={styles.otpActions}>
              <TouchableOpacity
                style={styles.resendButton}
                onPress={sendOTP}
                disabled={otpLoading}
              >
                <Text style={styles.resendButtonText}>
                  {otpLoading ? 'Sending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading || !otp}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Registering...' : 'Verify & Register'}
              </Text>
            </TouchableOpacity>
          </>
        )}
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLink}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E8B57',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  otpButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  otpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  resendButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  resendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    textAlign: 'center',
    color: '#2E8B57',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;