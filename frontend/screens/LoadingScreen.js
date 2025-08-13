import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const LoadingScreen = ({ onLoadingComplete }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-complete loading after 3 seconds
    const timer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Punjab National Bank Logo */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>PNB</Text>
          </View>
          <Text style={styles.bankName}>Punjab National Bank</Text>
          <Text style={styles.tagline}>The Name You Can Bank Upon</Text>
        </View>
        
        {/* App branding */}
        <View style={styles.appBranding}>
          <Text style={styles.appName}>ArthRakshak</Text>
          <Text style={styles.appTagline}>Your Financial Safety & Education Companion</Text>
        </View>
      </Animated.View>

      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBar}>
          <Animated.View 
            style={[
              styles.loadingProgress,
              {
                opacity: fadeAnim,
              }
            ]} 
          />
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7', // Cream background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2E7D32', // Primary color
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFDE7', // Cream text
    letterSpacing: 2,
  },
  bankName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32', // Primary color
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#388E3C', // Secondary color
    textAlign: 'center',
    fontStyle: 'italic',
  },
  appBranding: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#E8F5E9', // Light green
    width: width * 0.8,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32', // Primary color
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: '#388E3C', // Secondary color
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
    width: '100%',
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: '#E8F5E9', // Light green
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFEB3B', // Accent color
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 16,
    color: '#388E3C', // Secondary color
    fontWeight: '500',
  },
});

export default LoadingScreen;