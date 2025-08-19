# ArthRakshak Expo-Based Fraud Detection System

## 🎯 Pure Expo Implementation

This fraud detection system is built entirely using **Expo APIs** and **React Native**, without any native Java/Kotlin code. It provides comprehensive fraud protection while maintaining compatibility with Expo's managed workflow.

## 🚀 Quick Setup

### 1. Database Setup
```bash
cd backend
node scripts/setupFraudTables.js
```

### 2. Start Backend
```bash
cd backend
npm start
```

### 3. Start Frontend
```bash
cd frontend
npm start
```

## 📱 Expo-Based Features

### Real-Time Monitoring (Expo APIs)
- **Location Monitoring**: [`expo-location`](https://docs.expo.dev/versions/latest/sdk/location/) for background location tracking
- **URL Protection**: [`expo-linking`](https://docs.expo.dev/versions/latest/sdk/linking/) for deep link monitoring
- **App State Monitoring**: React Native [`AppState`](https://reactnative.dev/docs/appstate) for app lifecycle tracking
- **Background Tasks**: [`expo-background-fetch`](https://docs.expo.dev/versions/latest/sdk/background-fetch/) and [`expo-task-manager`](https://docs.expo.dev/versions/latest/sdk/task-manager/)
- **Notifications**: [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/) for real-time alerts

### User-Driven Fraud Detection
Since Expo doesn't provide direct access to SMS/call logs for security reasons, the system includes:

#### 1. Manual Fraud Reporting
Users can report suspicious activities through the app:
- **Suspicious Calls**: Report scam phone numbers
- **Phishing SMS**: Report suspicious messages
- **Malicious URLs**: Check URL safety
- **Fake Apps**: Report suspicious applications

#### 2. Fraud Education & Simulation
- **Interactive Learning**: Educational content about fraud patterns
- **Demo Simulations**: Test fraud detection with sample scenarios
- **Pattern Recognition**: Help users identify common fraud tactics

## 🛡️ Protection Features

### Automatic Detection
- **URL Analysis**: Real-time scanning of accessed links
- **Location Anomalies**: Detection of unusual location changes
- **App Behavior**: Monitoring of app state changes and deep links
- **Background Protection**: Continuous monitoring even when app is closed

### User-Initiated Protection
- **Manual Checks**: Users can check suspicious content
- **Fraud Reporting**: Easy reporting of encountered fraud
- **Safety Verification**: Instant analysis of suspicious activities
- **Educational Alerts**: Learning opportunities from detected patterns

## 📊 Available Screens

### 1. Fraud Detection Screen
**File**: [`frontend/screens/FraudDetectionScreen.js`](frontend/screens/FraudDetectionScreen.js:1)
- Toggle fraud protection on/off
- Report suspicious activities
- Test fraud detection system
- Educational content about fraud patterns

### 2. Fraud Alerts Screen  
**File**: [`frontend/screens/FraudAlertsScreen.js`](frontend/screens/FraudAlertsScreen.js:1)
- View real-time fraud alerts
- Manage alert notifications
- View protection statistics
- Configure detection settings

### 3. Fraud Reporting Screen (Enhanced)
**File**: [`frontend/screens/FraudReportingScreen.js`](frontend/screens/FraudReportingScreen.js:1)
- Community fraud reporting
- Location-based fraud alerts
- Verification and rewards system

## 🔧 Technical Implementation

### Backend Services
1. **Real-Time Fraud Detection** ([`backend/services/realTimeFraudDetection.js`](backend/services/realTimeFraudDetection.js:1))
2. **Background Monitoring** ([`backend/services/backgroundMonitoringService.js`](backend/services/backgroundMonitoringService.js:1))
3. **Enhanced Notifications** ([`backend/services/notificationService.js`](backend/services/notificationService.js:1))

### Frontend Services
1. **Expo Fraud Detection** ([`frontend/services/expoFraudDetection.js`](frontend/services/expoFraudDetection.js:1))
2. **Device Monitoring** ([`frontend/services/deviceMonitoringService.js`](frontend/services/deviceMonitoringService.js:1))
3. **Fraud Protection Orchestrator** ([`frontend/services/fraudProtectionService.js`](frontend/services/fraudProtectionService.js:1))

### Database Schema
**File**: [`backend/config/fraudDetectionSchema.sql`](backend/config/fraudDetectionSchema.sql:1)
- 9 comprehensive tables for fraud tracking
- Automated functions for statistics
- Pre-loaded fraud patterns and blocked entities

## 🎮 How to Use

### 1. Enable Protection
1. Open ArthRakshak app
2. Navigate to **Drawer Menu > Fraud Detection**
3. Toggle "Real-time Protection" to ON
4. Grant location and notification permissions

### 2. Report Suspicious Activity
1. In Fraud Detection screen, tap "Report Suspicious Activity"
2. Select activity type (Call/SMS/URL)
3. Enter details of the suspicious activity
4. Submit report for analysis

### 3. Test the System
1. Tap "Test Fraud Detection" in Fraud Detection screen
2. Enter test data (phone numbers, messages, URLs)
3. System will analyze and show results
4. Use "Run Demo Simulation" for comprehensive testing

### 4. View Alerts
1. Navigate to **Drawer Menu > Fraud Alerts**
2. View real-time fraud alerts
3. Check protection statistics
4. Manage alert settings

## 🔒 Expo Permissions Required

### Essential Permissions
- **Location (Foreground)**: [`expo-location`](https://docs.expo.dev/versions/latest/sdk/location/#locationrequestforegroundpermissionsasync) - Monitor location for fraud detection
- **Location (Background)**: [`expo-location`](https://docs.expo.dev/versions/latest/sdk/location/#locationrequestbackgroundpermissionsasync) - Continue monitoring in background
- **Notifications**: [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/#notificationsrequestpermissionsasync) - Send fraud alerts

### Optional Permissions
- **Contacts**: [`expo-contacts`](https://docs.expo.dev/versions/latest/sdk/contacts/) - Enhanced contact verification

## 🧪 Testing Features

### Built-in Test Scenarios
1. **Suspicious Call**: Test with numbers like `+91-9999999999`
2. **Phishing SMS**: Test with messages containing fraud keywords
3. **Malicious URLs**: Test with suspicious domains like `fake-bank.tk`
4. **Demo Simulation**: Complete fraud scenario testing

### Sample Test Data
```javascript
// Test suspicious call
Phone: +91-9999999999 (known scam pattern)

// Test phishing SMS
Message: "Congratulations! You won Rs 50,000. Click: http://bit.ly/fake-lottery"

// Test malicious URL
URL: https://fake-banking-site.tk/login
```

## 📈 Real-Time Features

### Background Monitoring
- **Expo Background Fetch**: Continuous fraud monitoring
- **Location Tracking**: Background location anomaly detection
- **URL Monitoring**: Deep link and external URL analysis
- **App State Tracking**: Monitor app usage patterns

### Live Alerts
- **Socket.IO Integration**: Real-time communication with backend
- **Push Notifications**: Instant fraud alerts
- **In-App Alerts**: Live alert dashboard
- **Email Notifications**: Critical alert backup delivery

## 🎓 Educational Features

### Fraud Awareness
- **Pattern Recognition**: Learn common fraud indicators
- **Interactive Examples**: Real fraud scenario demonstrations
- **Prevention Tips**: Best practices for fraud prevention
- **Community Learning**: Shared fraud experiences

### Simulation Mode
- **Safe Testing**: Test fraud detection without real threats
- **Educational Scenarios**: Learn from simulated fraud attempts
- **System Verification**: Confirm protection is working
- **User Training**: Practice identifying fraud patterns

## 🔄 App Integration

### Navigation Structure
```
Drawer Menu
├── Home
├── Profile
├── Budget Planner
├── Financial Goals
├── Chatbot
├── EMI Calculator
├── SIP Calculator
├── Quiz
├── Fraud Shield (Community Reporting)
├── Fraud Detection (Real-time Protection) ← NEW
├── Fraud Alerts (Alert Dashboard) ← NEW
└── Financial Therapist
```

### Automatic Initialization
- Fraud protection automatically starts when user logs in
- Background monitoring continues even when app is closed
- System restores protection state when app reopens
- No manual setup required after initial permission grants

## 🛠️ Development Notes

### Expo Compatibility
- ✅ **Expo Managed Workflow**: Fully compatible
- ✅ **Expo Go**: Works in development
- ✅ **EAS Build**: Production ready
- ✅ **Over-the-Air Updates**: Supports OTA updates

### No Native Code Required
- ❌ No Java/Kotlin files
- ❌ No Android Studio required
- ❌ No native module compilation
- ✅ Pure JavaScript/TypeScript implementation

## 🚨 Security Considerations

### Privacy-First Design
- **On-Device Processing**: Sensitive analysis done locally
- **Minimal Data Collection**: Only necessary data is collected
- **User Consent**: Clear permission requests with explanations
- **Data Encryption**: All stored data is encrypted

### Expo Security Benefits
- **Sandboxed Environment**: Expo's security model
- **Regular Updates**: Automatic security patches
- **Vetted APIs**: Only approved Expo APIs used
- **No Root Access**: Safer than native implementations

## 📞 User Support

### Help Features
- **In-App Guidance**: Step-by-step fraud detection setup
- **Educational Content**: Built-in fraud awareness training
- **Test Mode**: Safe environment to learn system features
- **Community Support**: Shared fraud reporting and verification

---

## ⚡ Quick Start Commands

```bash
# Setup database
cd backend && node scripts/setupFraudTables.js

# Start backend
cd backend && npm start

# Start frontend (in new terminal)
cd frontend && npm start

# Test the system
# Use the "Test Fraud Detection" feature in the app
```

**🎯 The fraud detection system now provides comprehensive protection using only Expo APIs, making it easy to develop, test, and deploy without any native code complexity!**