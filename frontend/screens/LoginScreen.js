import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { onLogin } = useContext(AuthContext);
  const { translate } = useLanguage();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(translate('Error', 'Error'), translate('Please fill in all fields', 'Please fill in all fields'));
      return;
    }

    setLoading(true);
    
    try {
      console.log('Attempting to login user:', { email });
      const response = await api.post('/auth/login', {
        email,
        password
      });
      console.log('Login response:', response.data);
      
      const { accessToken, refreshToken } = response.data;
      
      // Store tokens in AsyncStorage
      try {
        await AsyncStorage.setItem('token', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        console.log('Tokens stored successfully');
      } catch (storageError) {
        console.error('Error storing tokens:', storageError);
      }
      
      setLoading(false);
      Alert.alert(translate('Success', 'Success'), translate('Login successful', 'Login successful'));
      // Call onLogin function if provided
      // if (navigation.getParam) {
      //   const onLogin = navigation.getParam('onLogin');
      //   if (onLogin) onLogin();
      // }
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
      console.log('Error response:', error.response?.data);
      setLoading(false);
      Alert.alert(translate('Error', 'Error'), error.response?.data?.message || translate('Login failed', 'Login failed'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ArthRakshak</Text>
      <Text style={styles.subtitle}>{translate('Login to your account', 'Login to your account')}</Text>
      
      <View style={styles.form}>
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
        
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? translate('Logging in...', 'Logging in...') : translate('Login', 'Login')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerLink}>
            {translate('Don\'t have an account? Register', 'Don\'t have an account? Register')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7', // Cream background
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32', // Primary color
    textAlign: 'center',
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
  loginButton: {
    backgroundColor: '#2E7D32', // Primary color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#E8F5E9', // Light green
  },
  loginButtonText: {
    color: '#FFFDE7', // Cream text
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    textAlign: 'center',
    color: '#2E7D32', // Primary color
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;