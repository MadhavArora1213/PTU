# ArthRakshak Fraud Detection System - Error Handling Documentation

## Overview
This document provides comprehensive information about error handling mechanisms implemented in the ArthRakshak fraud detection system, including common errors, their solutions, and preventive measures.

## Table of Contents
1. [Authentication Errors](#authentication-errors)
2. [Camera Permission Errors](#camera-permission-errors)
3. [Network Request Failures](#network-request-failures)
4. [Pattern Matching Errors](#pattern-matching-errors)
5. [Background Task Errors](#background-task-errors)
6. [Socket Connection Errors](#socket-connection-errors)
7. [Email Service Errors](#email-service-errors)
8. [General Error Handling Patterns](#general-error-handling-patterns)
9. [Troubleshooting Guide](#troubleshooting-guide)

---

## Authentication Errors

### Error: "Cannot read property 'id' of undefined"

**Location**: [`frontend/context/AuthContext.js`](frontend/context/AuthContext.js)

**Cause**: Attempting to access `userData.id` when `userData` is null or undefined during login process.

**Solution Implemented**:
```javascript
// Before fix
const userId = userData.id; // Error if userData is null

// After fix
const userId = userData?.id;
if (!userId) {
  console.error('User data or user ID is missing');
  return { success: false, error: 'Invalid user data' };
}
```

**Prevention**:
- Always validate user data before accessing properties
- Use optional chaining (`?.`) for safe property access
- Implement null checks for critical user data

---

## Camera Permission Errors

### Error: "Camera.getCameraPermissionsAsync is not a function"

**Location**: [`frontend/services/permissionService.js`](frontend/services/permissionService.js)

**Cause**: Expo Camera API methods not available or incorrectly imported.

**Solution Implemented**:
```javascript
// Enhanced error handling with fallbacks
const requestCameraPermission = async () => {
  try {
    if (Camera?.getCameraPermissionsAsync) {
      const { status } = await Camera.getCameraPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Camera.requestCameraPermissionsAsync();
        return newStatus === 'granted';
      }
      return true;
    } else {
      // Fallback for when Camera API is not available
      console.log('Camera API not available, using fallback');
      return await requestPermissionFallback('camera');
    }
  } catch (error) {
    console.error('Camera permission error:', error);
    return false;
  }
};
```

**Prevention**:
- Always check if API methods exist before calling them
- Implement fallback mechanisms for Expo Go compatibility
- Use try-catch blocks around permission requests

---

## Network Request Failures

### Error: Network request failed / Timeout errors

**Location**: [`frontend/services/realTimeReportingService.js`](frontend/services/realTimeReportingService.js)

**Cause**: Network connectivity issues, server unavailability, or request timeouts.

**Solution Implemented**:
```javascript
// Enhanced network request with timeout and retry
const sendReportToBackend = async (report) => {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.6:5000';
    
    // Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(`${apiUrl}/api/fraud/submit-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Store for offline retry if network error
    if (error.name === 'AbortError' || error.message.includes('Network request failed')) {
      await this.storeReportForOfflineRetry(report);
      return { success: true, messageId: 'offline-mode' };
    }
    throw error;
  }
};
```

**Prevention**:
- Implement request timeouts using AbortController
- Add offline retry mechanisms
- Use multiple fallback server URLs
- Implement exponential backoff for retries

---

## Pattern Matching Errors

### Error: "TypeError: pattern.test is not a function"

**Location**: [`frontend/services/nativeFraudDetectionService.js`](frontend/services/nativeFraudDetectionService.js)

**Cause**: RegExp patterns stored as strings in AsyncStorage lose their RegExp prototype methods.

**Solution Implemented**:
```javascript
// Convert stored string patterns back to RegExp objects
const loadThreatPatterns = async () => {
  try {
    const stored = await AsyncStorage.getItem('threat_patterns');
    if (stored) {
      const patterns = JSON.parse(stored);
      
      // Convert string patterns back to RegExp objects
      Object.keys(patterns).forEach(category => {
        if (Array.isArray(patterns[category])) {
          patterns[category] = patterns[category].map(pattern => {
            if (typeof pattern === 'string') {
              try {
                return new RegExp(pattern, 'i');
              } catch (e) {
                console.error('Invalid regex pattern:', pattern);
                return null;
              }
            }
            return pattern;
          }).filter(Boolean);
        }
      });
      
      return patterns;
    }
  } catch (error) {
    console.error('Error loading threat patterns:', error);
    return getDefaultPatterns();
  }
};
```

**Prevention**:
- Always validate RegExp objects before using `.test()`
- Implement proper serialization/deserialization for RegExp patterns
- Use try-catch blocks around pattern matching operations

---

## Background Task Errors

### Error: Background task registration failed

**Location**: [`frontend/services/backgroundFraudMonitoringService.js`](frontend/services/backgroundFraudMonitoringService.js)

**Cause**: Background tasks not supported in Expo Go or registration failures.

**Solution Implemented**:
```javascript
// Enhanced background task registration with Expo Go compatibility
const registerBackgroundTask = async () => {
  try {
    // Check if running in Expo Go
    if (__DEV__ && Constants.appOwnership === 'expo') {
      console.log('Running in Expo Go - using foreground fallback');
      return await setupForegroundFallback();
    }

    // Check if background tasks are available
    if (!TaskManager.isAvailableAsync()) {
      console.log('Background tasks not available - using foreground fallback');
      return await setupForegroundFallback();
    }

    // Register background task
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
      minimumInterval: 15 * 60 * 1000, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });

    return { success: true, mode: 'background' };
  } catch (error) {
    console.error('Background task registration failed:', error);
    return await setupForegroundFallback();
  }
};
```

**Prevention**:
- Always check platform capabilities before registering background tasks
- Implement foreground fallbacks for Expo Go compatibility
- Use proper error handling for task registration

---

## Socket Connection Errors

### Error: Socket connection failed / Reconnection issues

**Location**: [`frontend/services/notificationService.js`](frontend/services/notificationService.js)

**Cause**: Network connectivity issues, server unavailability, or configuration problems.

**Solution Implemented**:
```javascript
// Enhanced socket connection with retry logic and fallbacks
const connectSocket = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.log('No token found, skipping socket connection');
      return null;
    }

    const serverUrl = getServerUrl(); // Multiple fallback URLs
    
    socket = io(serverUrl, {
      transports: ['websocket', 'polling'], // Fallback to polling
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      auth: { token },
      forceNew: true
    });
    
    // Enhanced error handling
    socket.on('connect_error', (error) => {
      console.log('Socket connection error:', error.message);
      connectionAttempts++;
      
      if (connectionAttempts < maxConnectionAttempts) {
        scheduleReconnect();
      } else {
        AsyncStorage.setItem('socketOfflineMode', 'true');
      }
    });

    return socket;
  } catch (error) {
    console.error('Error creating socket connection:', error);
    AsyncStorage.setItem('socketOfflineMode', 'true');
    return null;
  }
};
```

**Prevention**:
- Implement multiple server URL fallbacks
- Use both websocket and polling transports
- Add exponential backoff for reconnection attempts
- Store offline mode flags for graceful degradation

---

## Email Service Errors

### Error: Brevo API failures / Email sending errors

**Location**: [`backend/services/emailService.js`](backend/services/emailService.js)

**Cause**: Brevo API key issues, IP restrictions, or network connectivity problems.

**Solution Implemented**:
```javascript
// Enhanced email service with fallbacks and error handling
const sendOTPEmail = async (email, otp, language = 'en') => {
  try {
    if (!emailServiceReady) {
      // Development mode fallback
      console.log(`OTP for ${email}: ${otp}`);
      return { success: true, messageId: 'dev-mode' };
    }

    const sendSmtpEmail = {
      to: [{ email }],
      sender: { email: process.env.SENDER_EMAIL, name: 'ArthRakshak' },
      subject: template.subject,
      htmlContent: template.html
    };

    const result = await brevoApiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: result.messageId };
    
  } catch (brevoError) {
    // Handle IP restriction errors
    if (brevoError.status === 401 && brevoError.response?.body?.message?.includes('IP address')) {
      console.log('IP restriction error - check Brevo authorized IPs');
      console.log(`OTP for ${email}: ${otp}`);
      return { success: true, messageId: 'dev-mode' };
    }
    
    // Fallback to development mode
    console.log(`Email failed, using development mode - OTP: ${otp}`);
    return { success: true, messageId: 'dev-mode' };
  }
};
```

**Prevention**:
- Implement development mode fallbacks
- Handle specific API error codes
- Add IP whitelist instructions for production
- Use multiple email service providers as fallbacks

---

## General Error Handling Patterns

### 1. Try-Catch Blocks
Always wrap potentially failing operations in try-catch blocks:

```javascript
const riskyOperation = async () => {
  try {
    const result = await someAsyncOperation();
    return { success: true, data: result };
  } catch (error) {
    console.error('Operation failed:', error);
    return { success: false, error: error.message };
  }
};
```

### 2. Null/Undefined Checks
Use optional chaining and null checks:

```javascript
// Safe property access
const value = data?.property?.nestedProperty;

// Null checks before operations
if (userData && userData.id) {
  // Safe to use userData.id
}
```

### 3. Fallback Mechanisms
Implement fallbacks for critical functionality:

```javascript
const getDataWithFallback = async () => {
  try {
    return await primaryDataSource();
  } catch (error) {
    console.log('Primary source failed, using fallback');
    return await fallbackDataSource();
  }
};
```

### 4. Offline Support
Store data locally when network operations fail:

```javascript
const syncWithOfflineSupport = async (data) => {
  try {
    await sendToServer(data);
  } catch (error) {
    await storeOffline(data);
    console.log('Data stored offline for later sync');
  }
};
```

---

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. App Crashes on Startup
**Symptoms**: App crashes immediately after launch
**Possible Causes**:
- Missing permissions
- Invalid configuration
- Database connection issues

**Solutions**:
1. Check permission service initialization
2. Verify environment variables
3. Test database connectivity

#### 2. Features Not Working in Expo Go
**Symptoms**: Background tasks, camera, or notifications not working
**Possible Causes**:
- Expo Go limitations
- Missing native modules

**Solutions**:
1. Use development build instead of Expo Go
2. Implement Expo Go compatible fallbacks
3. Test on physical device with development build

#### 3. Network Requests Failing
**Symptoms**: API calls timeout or fail
**Possible Causes**:
- Incorrect API URLs
- Network connectivity issues
- Server not running

**Solutions**:
1. Verify API URL configuration
2. Check server status
3. Test with different network connections
4. Use offline fallbacks

#### 4. Email Services Not Working
**Symptoms**: OTP emails not received
**Possible Causes**:
- Brevo API key issues
- IP restrictions
- Email configuration problems

**Solutions**:
1. Check Brevo API key validity
2. Add IP to Brevo whitelist
3. Verify sender email configuration
4. Use development mode for testing

### Debug Mode Instructions

To enable comprehensive debugging:

1. **Enable Console Logging**:
   ```javascript
   // Add to app initialization
   console.log('Debug mode enabled');
   ```

2. **Check Service Status**:
   ```javascript
   // Use service status methods
   const status = realTimeReportingService.getStatus();
   console.log('Service status:', status);
   ```

3. **Monitor Network Requests**:
   ```javascript
   // Add request logging
   console.log('API Request:', url, method, body);
   ```

4. **Test Offline Functionality**:
   ```javascript
   // Simulate offline mode
   await AsyncStorage.setItem('socketOfflineMode', 'true');
   ```

---

## Error Monitoring and Logging

### Implemented Logging Patterns

1. **Service Initialization Logs**:
   ```javascript
   console.log('✅ Service initialized successfully');
   console.log('❌ Service initialization failed:', error);
   ```

2. **Operation Status Logs**:
   ```javascript
   console.log('📊 Processing report queue...');
   console.log('🔗 Socket connection established');
   ```

3. **Error Context Logs**:
   ```javascript
   console.error('Error in function:', functionName, error);
   console.log('Context:', { userId, operation, timestamp });
   ```

### Production Monitoring

For production deployments, consider implementing:

1. **Crash Reporting**: Sentry, Bugsnag, or similar
2. **Performance Monitoring**: Real-time performance metrics
3. **User Analytics**: Track error patterns and user impact
4. **Health Checks**: Automated service health monitoring

---

## Best Practices Summary

1. **Always Use Try-Catch**: Wrap async operations in try-catch blocks
2. **Implement Fallbacks**: Provide alternative paths when primary methods fail
3. **Validate Inputs**: Check data validity before processing
4. **Log Appropriately**: Use consistent logging patterns for debugging
5. **Handle Offline Scenarios**: Store data locally when network fails
6. **Test Error Paths**: Verify error handling works as expected
7. **User-Friendly Messages**: Show helpful error messages to users
8. **Graceful Degradation**: Continue functioning with reduced capabilities

---

## Contact and Support

For additional support with error handling:

1. **Development Team**: Check service implementation files
2. **Documentation**: Refer to service-specific documentation
3. **Logs**: Check console logs for detailed error information
4. **Testing**: Use comprehensive testing service for validation

---

*Last Updated: 2025-01-15*
*Version: 2.0*
*ArthRakshak Fraud Detection System*