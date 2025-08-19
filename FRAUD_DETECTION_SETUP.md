# ArthRakshak Fraud Detection System - Setup Guide

## 🚀 Quick Start

### 1. Database Setup
```bash
# Navigate to backend directory
cd backend

# Initialize fraud detection tables
node scripts/setupFraudTables.js

# Verify setup (optional)
node scripts/testFraudDetection.js
```

### 2. Backend Setup
```bash
# Install dependencies (if not already done)
npm install

# Start the backend server
npm start
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# For Android development, add required permissions
# The AndroidManifest.xml has been configured with necessary permissions

# Start the frontend
npm start
```

## 🔧 Configuration

### Environment Variables
Ensure your [`backend/.env`](backend/.env) file includes:
```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Socket.IO (optional)
SOCKET_IO_PORT=5003

# AI Services
SARVAM_API_KEY=your_sarvam_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Required Dependencies

#### Backend Dependencies
```json
{
  "socket.io": "^4.7.2",
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "jsonwebtoken": "^9.0.2",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.8.1"
}
```

#### Frontend Dependencies
```json
{
  "expo-device": "~5.4.0",
  "expo-location": "~16.1.0",
  "expo-notifications": "~0.20.1",
  "expo-task-manager": "~11.3.0",
  "expo-background-fetch": "~11.3.0",
  "expo-contacts": "~12.3.0",
  "socket.io-client": "^4.7.2",
  "react-native-vector-icons": "^10.0.0"
}
```

## 📱 Mobile App Integration

### 1. Initialize Fraud Protection
Add this to your main app component or login success handler:

```javascript
import fraudProtectionService from './services/fraudProtectionService';

// After successful login
const initializeFraudProtection = async (user) => {
  try {
    const result = await fraudProtectionService.initialize(user.id);
    if (result.success) {
      console.log('✅ Fraud protection activated');
      // Show success message to user
    } else {
      console.log('⚠️ Fraud protection failed to start:', result.message);
    }
  } catch (error) {
    console.error('Error initializing fraud protection:', error);
  }
};
```

### 2. Handle App State Changes
The fraud protection service automatically handles app state changes, but you can monitor the status:

```javascript
import { AppState } from 'react-native';

AppState.addEventListener('change', (nextAppState) => {
  console.log('App state changed to:', nextAppState);
  // Fraud protection continues running in background
});
```

### 3. Access Fraud Alerts
Navigate to the Fraud Alerts screen from your app's drawer menu:

```javascript
// The FraudAlertsScreen is already integrated into the drawer navigation
// Users can access it via: Drawer Menu > Fraud Alerts
```

## 🛡️ Security Features

### Real-Time Monitoring
- **Call Monitoring**: Detects suspicious calls from known scam numbers
- **SMS Analysis**: Scans messages for phishing attempts and fraud keywords
- **URL Protection**: Analyzes links for malicious domains
- **App Security**: Monitors app installations for dangerous permissions
- **Location Tracking**: Detects unusual location changes

### Alert System
- **Immediate Alerts**: Real-time notifications for detected threats
- **Severity Levels**: Critical, High, Medium, Low threat classifications
- **Detailed Information**: Comprehensive threat details and recommended actions
- **User Actions**: Mark as read, dismiss, or report false positives

### Background Protection
- **Continuous Monitoring**: Runs even when app is closed
- **Battery Optimized**: Efficient background processing
- **Offline Capability**: Queues activities for analysis when offline
- **Auto-Recovery**: Automatically restarts after device reboot

## 📊 API Endpoints

### Core Endpoints
```
POST /api/fraud/monitoring/start     - Start monitoring session
POST /api/fraud/monitoring/stop      - Stop monitoring session
POST /api/fraud/monitoring/heartbeat - Update session heartbeat

POST /api/fraud/analyze/call         - Analyze call activity
POST /api/fraud/analyze/sms          - Analyze SMS content
POST /api/fraud/analyze/url          - Analyze URL access
POST /api/fraud/analyze/app          - Analyze app installation

GET  /api/fraud/alerts               - Get user's fraud alerts
POST /api/fraud/alerts/:id/read      - Mark alert as read
POST /api/fraud/alerts/:id/dismiss   - Dismiss alert

GET  /api/fraud/settings             - Get fraud detection settings
PUT  /api/fraud/settings             - Update fraud detection settings
GET  /api/fraud/stats                - Get fraud detection statistics
```

## 🧪 Testing

### Manual Testing
You can test the fraud detection system using these methods:

#### 1. Test Call Detection
```javascript
// In your React Native app
import nativeFraudDetectionService from './services/nativeFraudDetection';

// Simulate suspicious call
await nativeFraudDetectionService.simulateCallActivity('+91-9999999999', 'incoming');
```

#### 2. Test SMS Detection
```javascript
// Simulate phishing SMS
await nativeFraudDetectionService.simulateSMSActivity(
  '+91-8888888888',
  'Congratulations! You won Rs 50,000. Click: http://bit.ly/fake-lottery'
);
```

#### 3. Test URL Analysis
```javascript
// Test malicious URL
await fraudProtectionService.analyzeContent({
  url: 'https://fake-banking-site.tk/login',
  source: 'sms'
}, 'url');
```

### Backend Testing
```bash
# Run comprehensive backend tests
cd backend
node scripts/testFraudDetection.js
```

## 🔒 Permissions Required

### Android Permissions
The app requires these permissions for full fraud detection:

- **READ_PHONE_STATE** - Monitor call states
- **READ_CALL_LOG** - Access call history for analysis
- **RECEIVE_SMS** - Monitor incoming SMS messages
- **READ_SMS** - Analyze SMS content
- **ACCESS_FINE_LOCATION** - Location-based fraud detection
- **ACCESS_BACKGROUND_LOCATION** - Background location monitoring
- **FOREGROUND_SERVICE** - Background service execution
- **RECEIVE_BOOT_COMPLETED** - Auto-start after device reboot

### Permission Handling
The app will request permissions gracefully:
1. Explain why each permission is needed
2. Allow users to grant permissions selectively
3. Provide reduced functionality if permissions are denied
4. Allow users to enable permissions later in settings

## 🚨 Alert Types

### Critical Alerts (🚨)
- Known scam number calls
- Confirmed phishing URLs
- Malicious app installations
- Account compromise indicators

### High Alerts (⚠️)
- Suspicious call patterns
- Potential phishing messages
- Risky app permissions
- Unusual location changes

### Medium Alerts (⚡)
- Moderate risk activities
- Pattern anomalies
- Unverified sources
- Minor security concerns

### Low Alerts (ℹ️)
- Informational notices
- System status updates
- Daily summaries
- Educational content

## 📈 Monitoring Dashboard

### Real-Time Statistics
- Activities monitored today
- Threats detected and blocked
- Alert response times
- Protection effectiveness

### Historical Data
- Weekly/monthly trends
- Geographic threat patterns
- Most common threat types
- System performance metrics

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check database connection
cd backend
node check_db.js
```

#### 2. Socket.IO Connection Problems
- Ensure backend server is running on correct port
- Check firewall settings
- Verify CORS configuration

#### 3. Permission Denied Errors
- Grant required Android permissions
- Check app settings for permission status
- Restart app after granting permissions

#### 4. Background Monitoring Not Working
- Disable battery optimization for the app
- Ensure background app refresh is enabled
- Check device power management settings

### Debug Mode
Enable debug logging by setting:
```javascript
// In your app
console.log('Fraud protection status:', await fraudProtectionService.getProtectionStatus());
```

## 🔄 Maintenance

### Regular Tasks
- **Weekly**: Review fraud patterns and update blocked entities
- **Monthly**: Analyze false positive rates and adjust sensitivity
- **Quarterly**: Performance optimization and security audit

### Monitoring
- Check system logs for errors
- Monitor database performance
- Review alert effectiveness
- Update threat intelligence

## 📞 Support

### Emergency Response
If critical fraud is detected:
1. Immediate user notification
2. Automatic threat blocking
3. Evidence collection
4. Recovery assistance

### User Support
- In-app help and tutorials
- Fraud reporting assistance
- Settings configuration help
- Technical support contact

---

## ⚡ Quick Commands

```bash
# Setup everything
cd backend && node scripts/setupFraudTables.js && npm start

# In another terminal
cd frontend && npm start

# Test the system
cd backend && node scripts/testFraudDetection.js
```

**🎯 The fraud detection system is now ready to protect ArthRakshak users from financial fraud in real-time!**