# ArthRakshak Real-Time Fraud Detection System

## Overview

The ArthRakshak Real-Time Fraud Detection System is a comprehensive security module that monitors user mobile activities in real-time to detect and prevent financial fraud. This system provides 24/7 protection by analyzing calls, SMS messages, app installations, URL access, and location changes to identify suspicious activities.

## 🚀 Key Features

### Real-Time Monitoring
- **Call Monitoring**: Detects suspicious incoming/outgoing calls from known scam numbers
- **SMS Analysis**: Analyzes message content for phishing attempts and fraud keywords
- **URL Protection**: Scans links for malicious domains and phishing sites
- **App Security**: Monitors app installations for malicious applications
- **Location Tracking**: Detects unusual location changes that may indicate account compromise

### Background Protection
- **Continuous Monitoring**: Runs in background even when app is closed
- **Automatic Alerts**: Instant notifications for detected threats
- **Offline Capability**: Queues activities for analysis when offline
- **Battery Optimized**: Efficient background processing with minimal battery impact

### Intelligent Detection
- **AI-Powered Analysis**: Uses Sarvam AI for advanced fraud detection
- **Pattern Recognition**: Learns from fraud patterns and adapts to new threats
- **Risk Scoring**: Assigns risk scores to activities for prioritized alerts
- **False Positive Reduction**: Machine learning to minimize false alarms

### User Dashboard
- **Real-Time Alerts**: Live fraud alerts with detailed threat information
- **Daily Summaries**: Comprehensive daily protection reports
- **Statistics**: Detailed analytics on monitored activities and blocked threats
- **Settings Control**: Granular control over monitoring preferences

## 🏗️ System Architecture

### Backend Components

#### 1. Real-Time Fraud Detection Service
**File**: [`backend/services/realTimeFraudDetection.js`](backend/services/realTimeFraudDetection.js)
- Core fraud detection engine
- Pattern matching and risk scoring
- Alert generation and management
- User settings management

#### 2. Background Monitoring Service
**File**: [`backend/services/backgroundMonitoringService.js`](backend/services/backgroundMonitoringService.js)
- Continuous background processing
- Activity queue management
- Threat intelligence updates
- System cleanup and maintenance

#### 3. Enhanced Notification Service
**File**: [`backend/services/notificationService.js`](backend/services/notificationService.js)
- Real-time Socket.IO communication
- Multi-channel alert delivery
- Connection management
- Event handling

#### 4. Fraud Controller
**File**: [`backend/controllers/fraudController.js`](backend/controllers/fraudController.js)
- API endpoints for fraud detection
- Session management
- Alert CRUD operations
- Statistics and reporting

### Frontend Components

#### 1. Fraud Alerts Screen
**File**: [`frontend/screens/FraudAlertsScreen.js`](frontend/screens/FraudAlertsScreen.js)
- Real-time fraud alerts dashboard
- Alert management interface
- Protection statistics display
- Settings configuration

#### 2. Device Monitoring Service
**File**: [`frontend/services/deviceMonitoringService.js`](frontend/services/deviceMonitoringService.js)
- Device permission management
- Background task coordination
- Activity queuing and processing
- Offline capability handling

#### 3. Native Fraud Detection
**File**: [`frontend/services/nativeFraudDetection.js`](frontend/services/nativeFraudDetection.js)
- Native module integration
- Real-time event handling
- Activity simulation for testing
- Cross-platform compatibility

#### 4. Fraud Protection Service
**File**: [`frontend/services/fraudProtectionService.js`](frontend/services/fraudProtectionService.js)
- Main orchestration service
- App lifecycle management
- Alert processing and display
- System status monitoring

### Database Schema

#### Core Tables
**File**: [`backend/config/fraudDetectionSchema.sql`](backend/config/fraudDetectionSchema.sql)

1. **fraud_alerts** - Real-time fraud alerts
2. **device_monitoring_sessions** - Active monitoring sessions
3. **suspicious_activities** - Logged suspicious activities
4. **fraud_patterns** - Detection patterns and rules
5. **user_devices** - Registered user devices
6. **fraud_detection_settings** - User preferences
7. **blocked_entities** - Blocked numbers, URLs, and apps
8. **fraud_detection_stats** - Usage statistics

## 🔧 Installation & Setup

### 1. Database Setup

```bash
# Initialize fraud detection database schema
cd backend
node scripts/initializeFraudDetection.js
```

### 2. Backend Dependencies

Ensure these packages are installed in [`backend/package.json`](backend/package.json):
```json
{
  "socket.io": "^4.7.2",
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "jsonwebtoken": "^9.0.2"
}
```

### 3. Frontend Dependencies

Add these dependencies to [`frontend/package.json`](frontend/package.json):
```json
{
  "expo-device": "~5.4.0",
  "expo-location": "~16.1.0",
  "expo-notifications": "~0.20.1",
  "expo-task-manager": "~11.3.0",
  "expo-background-fetch": "~11.3.0",
  "expo-contacts": "~12.3.0",
  "socket.io-client": "^4.7.2"
}
```

### 4. Android Permissions

The system requires these Android permissions (already configured in [`AndroidManifest.xml`](frontend/android/app/src/main/AndroidManifest.xml)):
- `READ_PHONE_STATE` - Monitor call states
- `READ_CALL_LOG` - Access call history
- `RECEIVE_SMS` / `READ_SMS` - Monitor SMS messages
- `ACCESS_FINE_LOCATION` - Location monitoring
- `ACCESS_BACKGROUND_LOCATION` - Background location access
- `FOREGROUND_SERVICE` - Background service execution
- `RECEIVE_BOOT_COMPLETED` - Auto-start after device boot

## 🚀 Usage

### 1. Initialize Fraud Protection

```javascript
import fraudProtectionService from './services/fraudProtectionService';

// Initialize when user logs in
const userId = user.id;
const result = await fraudProtectionService.initialize(userId);

if (result.success) {
  console.log('Fraud protection active');
} else {
  console.error('Failed to start fraud protection:', result.message);
}
```

### 2. Monitor Activities

The system automatically monitors:
- **Incoming/Outgoing Calls**: Real-time call state monitoring
- **SMS Messages**: Content analysis for phishing attempts
- **App Installations**: Security analysis of new apps
- **URL Access**: Link scanning for malicious sites
- **Location Changes**: Anomaly detection for unusual movements

### 3. Handle Alerts

```javascript
// Listen for real-time alerts
socket.on('fraudAlert', (alert) => {
  console.log('Fraud alert received:', alert);
  // Display alert to user
  showAlertDialog(alert);
});

// Handle critical alerts
socket.on('criticalAlert', (alert) => {
  // Show immediate warning
  showCriticalAlertDialog(alert);
});
```

## 📊 API Endpoints

### Monitoring Endpoints
- `POST /api/fraud/monitoring/start` - Start monitoring session
- `POST /api/fraud/monitoring/stop` - Stop monitoring session
- `POST /api/fraud/monitoring/heartbeat` - Update session heartbeat

### Analysis Endpoints
- `POST /api/fraud/analyze/call` - Analyze call activity
- `POST /api/fraud/analyze/sms` - Analyze SMS content
- `POST /api/fraud/analyze/url` - Analyze URL access
- `POST /api/fraud/analyze/app` - Analyze app installation

### Alert Management
- `GET /api/fraud/alerts` - Get user's fraud alerts
- `POST /api/fraud/alerts/:id/read` - Mark alert as read
- `POST /api/fraud/alerts/:id/dismiss` - Dismiss alert

### Settings & Statistics
- `GET /api/fraud/settings` - Get fraud detection settings
- `PUT /api/fraud/settings` - Update fraud detection settings
- `GET /api/fraud/stats` - Get fraud detection statistics

## 🔒 Security Features

### Threat Detection
- **Known Scam Numbers**: Database of reported fraud numbers
- **Phishing Keywords**: AI-powered content analysis
- **Malicious URLs**: Pattern matching for suspicious domains
- **Dangerous Apps**: Permission analysis and package verification
- **Location Anomalies**: Unusual movement pattern detection

### Protection Mechanisms
- **Real-Time Blocking**: Immediate threat neutralization
- **User Alerts**: Instant notifications for detected threats
- **Activity Logging**: Comprehensive audit trail
- **Pattern Learning**: Adaptive threat detection
- **False Positive Handling**: User feedback integration

## 🧪 Testing

### Run Comprehensive Tests
```bash
# Test the entire fraud detection system
cd backend
node scripts/testFraudDetection.js
```

### Manual Testing
```javascript
// Test call detection
await nativeFraudDetectionService.simulateCallActivity('+91-9999999999', 'incoming');

// Test SMS detection
await nativeFraudDetectionService.simulateSMSActivity(
  '+91-8888888888',
  'Congratulations! You won Rs 50,000. Click: http://bit.ly/fake-lottery'
);

// Test app installation
await nativeFraudDetectionService.simulateAppInstallation(
  'com.fake.banking.app',
  'Fake Banking App',
  ['READ_SMS', 'CALL_PHONE']
);
```

## 📱 User Interface

### Fraud Alerts Dashboard
- **Real-time alerts** with severity indicators
- **Detailed threat information** with actionable insights
- **Alert management** (read, dismiss, report false positives)
- **Protection statistics** and daily summaries
- **Settings panel** for customization

### Alert Types
- 🚨 **Critical**: Immediate threats requiring urgent action
- ⚠️ **High**: Significant threats needing attention
- ⚡ **Medium**: Moderate risks worth monitoring
- ℹ️ **Low**: Minor anomalies for awareness

## 🔧 Configuration

### User Settings
- **Real-time Monitoring**: Enable/disable live monitoring
- **Activity Types**: Choose which activities to monitor
- **Alert Frequency**: Immediate, hourly, or daily notifications
- **Sensitivity Level**: Low, medium, or high detection sensitivity
- **Notification Methods**: Push, email, SMS combinations

### System Configuration
- **Pattern Updates**: Automatic threat intelligence updates
- **Data Retention**: Configurable data storage periods
- **Performance Tuning**: Adjustable processing intervals
- **Privacy Controls**: Data anonymization options

## 🛡️ Privacy & Compliance

### Data Protection
- **Local Processing**: Sensitive data processed on-device when possible
- **Encrypted Storage**: All stored data is encrypted
- **Minimal Collection**: Only necessary data is collected
- **User Control**: Complete control over data sharing

### Compliance
- **GDPR Compliant**: European data protection standards
- **Privacy by Design**: Built-in privacy protections
- **Transparent Processing**: Clear data usage policies
- **User Rights**: Data access, correction, and deletion rights

## 🚨 Emergency Features

### Critical Alert Handling
- **Immediate Notifications**: Instant alerts for critical threats
- **Emergency Contacts**: Automatic notification of trusted contacts
- **Threat Blocking**: Real-time blocking of malicious activities
- **Recovery Assistance**: Guided recovery from fraud attempts

### Incident Response
- **Automatic Reporting**: Integration with fraud databases
- **Evidence Collection**: Secure storage of threat evidence
- **Recovery Tools**: Account security restoration features
- **Support Integration**: Direct connection to fraud helplines

## 📈 Monitoring & Analytics

### Real-Time Metrics
- Activities monitored per day
- Threats detected and blocked
- Alert response times
- System performance metrics

### Historical Analysis
- Fraud trend analysis
- Geographic threat mapping
- Seasonal pattern recognition
- Effectiveness reporting

## 🔄 Maintenance

### Regular Tasks
- **Pattern Updates**: Weekly threat intelligence refresh
- **Data Cleanup**: Monthly old data archival
- **Performance Optimization**: Quarterly system tuning
- **Security Audits**: Regular security assessments

### Monitoring
- **System Health**: Continuous service monitoring
- **Performance Metrics**: Real-time performance tracking
- **Error Handling**: Comprehensive error logging and recovery
- **Capacity Planning**: Proactive scaling management

## 📞 Support

For technical support or fraud detection issues:
- **In-App Support**: Built-in help and support features
- **Emergency Hotline**: 24/7 fraud assistance
- **Documentation**: Comprehensive user guides
- **Community**: User community for tips and support

---

**⚠️ Important**: This fraud detection system is designed to provide an additional layer of security. Users should still exercise caution and follow standard security practices. The system continuously learns and improves its detection capabilities based on emerging fraud patterns.