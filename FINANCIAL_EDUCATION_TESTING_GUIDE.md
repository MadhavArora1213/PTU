# Financial Education System - Complete Testing Guide

## Overview

This document provides a comprehensive testing guide for the complete financial education system including the mobile app, backend APIs, admin panel, and chatbot integration.

## System Components

### 1. Mobile App (React Native/Expo)
- **Location**: `frontend/`
- **Port**: Expo development server (typically 8081)
- **Key Features**: Financial education screens, tutorials, simulations, quizzes

### 2. Backend Server (Node.js/Express)
- **Location**: `backend/`
- **Port**: 5003
- **Key Features**: APIs, database, progress tracking, admin endpoints

### 3. Admin Panel (React Web App)
- **Location**: `admin-panel/`
- **Development Port**: 3001
- **Production URL**: `http://localhost:5003/admin`
- **Key Features**: Dashboard, content management, user analytics

### 4. Chatbot Integration
- **Mobile**: WebView-based Omnidim.io widget
- **Admin Panel**: Embedded Omnidim.io widget
- **Secret Key**: `f7dd22fc70eb6c18ec2c3fb51f35daf5`

## Pre-Testing Setup

### 1. Backend Server Setup
```bash
cd backend
npm install
npm start
```
**Expected Output**: Server running on port 5003

### 2. Mobile App Setup
```bash
cd frontend
npm install
npx expo start
```
**Expected Output**: Expo development server with QR code

### 3. Admin Panel Setup
```bash
cd admin-panel
npm install
npm start
```
**Expected Output**: React dev server on port 3001

## Complete Testing Flow

### Phase 1: Backend API Testing

#### 1.1 Health Check
```bash
curl http://localhost:5003/
```
**Expected Response**:
```json
{
  "message": "ArthRakshak Backend API",
  "version": "1.0.0",
  "services": {
    "api": "running",
    "database": "connected",
    "adminPanel": "available at /admin"
  }
}
```

#### 1.2 Admin Stats API
```bash
curl http://localhost:5003/api/admin/stats
```
**Expected Response**:
```json
{
  "users": 0,
  "totalProgress": 0,
  "totalQuizzes": 0,
  "activeUsers": 0,
  "completionRate": 65
}
```

#### 1.3 Education Progress API
```bash
curl http://localhost:5003/api/education-progress/analytics
```
**Expected**: Analytics data or empty response

### Phase 2: Mobile App Testing

#### 2.1 App Launch
1. Open Expo Go app on mobile device
2. Scan QR code from `npx expo start`
3. **Expected**: App loads with loading screen, then login screen

#### 2.2 Navigation Testing
1. Register/Login to the app
2. Navigate to "Financial Education" tab
3. **Expected**: Main education screen with language selector and cards

#### 2.3 Financial Education Flow
1. **Main Screen**: 
   - Select language (English/Hindi/Punjabi)
   - See progress tracking display
   - View "Tutorials" and "Simulations" cards

2. **Tutorials Screen**:
   - See 10 tutorial cards
   - 2 active: "Ponzi Scheme Detection" and "Banking Security"
   - 8 locked/premium/coming soon
   - Tap on active tutorials

3. **Ponzi Tutorial**:
   - 6 lessons with step-by-step content
   - Progress tracking
   - Navigation between lessons
   - Quiz integration at the end

4. **Banking Tutorial**:
   - 5 lessons with banking security content
   - Similar structure to Ponzi tutorial
   - Quiz integration

5. **Simulations Screen**:
   - See 10 simulation cards
   - 2 active: "Investment Fraud" and "Employment Fraud"
   - 8 locked/premium/coming soon
   - Interactive audio-based simulations

#### 2.4 Quiz Integration Testing
1. Complete a tutorial
2. Take the associated quiz
3. **Expected**: 
   - Quiz questions display correctly
   - Progress tracking works
   - Results are saved to backend
   - Navigation back to tutorial works

#### 2.5 Chatbot Testing
1. Navigate to drawer menu
2. Select "AI Assistant"
3. **Expected**: 
   - WebView loads with Omnidim.io widget
   - Loading screen appears
   - Chatbot interface loads
   - Can send messages and receive responses

### Phase 3: Admin Panel Testing

#### 3.1 Admin Panel Access
1. Open browser to `http://localhost:3001` (dev) or `http://localhost:5003/admin` (production)
2. **Expected**: Admin panel loads with dashboard

#### 3.2 Dashboard Testing
1. **Statistics Cards**: Should show user counts, progress data
2. **Charts**: Completion rates and engagement metrics
3. **Refresh Button**: Should reload data from backend
4. **Expected**: Real-time data from backend APIs

#### 3.3 Navigation Testing
1. **Sidebar Navigation**: Test all menu items
2. **Analytics Page**: Detailed charts and metrics
3. **Tutorial Management**: List of tutorials with CRUD operations
4. **Quiz Management**: Quiz management interface
5. **User Progress**: User progress tracking and analytics
6. **Settings**: System configuration options

#### 3.4 Content Management Testing
1. **Tutorial Management**:
   - View existing tutorials
   - Create new tutorial (mock)
   - Edit tutorial content
   - Toggle active/inactive status

2. **Quiz Management**:
   - View existing quizzes
   - Create new quiz (mock)
   - Edit quiz questions
   - Manage scoring settings

#### 3.5 Chatbot Integration Testing
1. **Omnidim.io Widget**: Should load in admin panel
2. **Chat Functionality**: Test sending messages
3. **Widget Positioning**: Should not interfere with admin interface

### Phase 4: Integration Testing

#### 4.1 Data Flow Testing
1. **Mobile to Backend**: Complete tutorial/quiz in mobile app
2. **Backend to Admin**: Check if progress appears in admin panel
3. **Real-time Updates**: Refresh admin dashboard to see new data

#### 4.2 Cross-Platform Testing
1. **Mobile App**: Complete educational content
2. **Admin Panel**: Monitor progress in real-time
3. **Database**: Verify data persistence

#### 4.3 API Integration Testing
1. **Progress Tracking**: Verify progress APIs work correctly
2. **Analytics**: Check analytics data flows properly
3. **User Management**: Test user progress tracking

### Phase 5: Performance Testing

#### 5.1 Load Testing
1. **Multiple Users**: Simulate multiple users accessing content
2. **Concurrent Requests**: Test API performance under load
3. **Database Performance**: Monitor database response times

#### 5.2 Mobile Performance
1. **App Responsiveness**: Test smooth navigation
2. **Audio Playback**: Test simulation audio performance
3. **Memory Usage**: Monitor app memory consumption

#### 5.3 Admin Panel Performance
1. **Dashboard Loading**: Test dashboard load times
2. **Chart Rendering**: Verify chart performance with data
3. **Real-time Updates**: Test refresh performance

## Expected Test Results

### ✅ Success Criteria

#### Mobile App
- [ ] App launches successfully
- [ ] Financial Education screen loads
- [ ] Language selection works
- [ ] Tutorial navigation functions
- [ ] Quiz integration works
- [ ] Progress tracking saves data
- [ ] Simulations play audio correctly
- [ ] Chatbot WebView loads

#### Backend APIs
- [ ] Health check returns success
- [ ] Admin stats API returns data
- [ ] Education progress APIs function
- [ ] Database connections work
- [ ] CORS allows admin panel access

#### Admin Panel
- [ ] Dashboard loads with data
- [ ] Charts render correctly
- [ ] Navigation works smoothly
- [ ] Content management interfaces function
- [ ] Settings page loads
- [ ] Chatbot widget integrates

#### Integration
- [ ] Mobile app data appears in admin panel
- [ ] Real-time updates work
- [ ] Cross-platform data consistency
- [ ] API communication functions

## Troubleshooting Guide

### Common Issues

#### 1. Backend Connection Issues
**Problem**: Admin panel can't connect to backend
**Solution**: 
- Check backend server is running on port 5003
- Verify CORS settings include admin panel origin
- Check firewall/network settings

#### 2. Mobile App Navigation Issues
**Problem**: Financial Education screen shows placeholder
**Solution**:
- Verify FinancialEducationScreen import in App.js
- Check file paths are correct
- Restart Expo development server

#### 3. Database Issues
**Problem**: Progress data not saving
**Solution**:
- Check database file exists: `backend/data/arthrakshak.db`
- Verify education progress tables are created
- Check API endpoints are working

#### 4. Chatbot Integration Issues
**Problem**: Omnidim.io widget not loading
**Solution**:
- Check internet connection
- Verify secret key is correct
- Check WebView permissions (mobile)
- Verify script loading in browser console (admin)

#### 5. Audio Playback Issues
**Problem**: Simulation audio not playing
**Solution**:
- Check audio files exist in `frontend/assets/`
- Verify audio context setup
- Test device audio permissions

## Testing Checklist

### Pre-Testing Setup
- [ ] Backend server running (port 5003)
- [ ] Mobile app running (Expo)
- [ ] Admin panel accessible
- [ ] Database initialized
- [ ] All dependencies installed

### Mobile App Testing
- [ ] App launches and loads
- [ ] User authentication works
- [ ] Financial Education navigation
- [ ] Tutorial content displays
- [ ] Quiz functionality works
- [ ] Progress tracking functions
- [ ] Simulation audio plays
- [ ] Chatbot integration works

### Admin Panel Testing
- [ ] Dashboard loads with data
- [ ] All navigation links work
- [ ] Charts and analytics display
- [ ] Content management functions
- [ ] Settings page accessible
- [ ] Chatbot widget loads

### Integration Testing
- [ ] Mobile data syncs to admin
- [ ] Real-time updates work
- [ ] API communication functions
- [ ] Cross-platform consistency

### Performance Testing
- [ ] App responds quickly
- [ ] Dashboard loads efficiently
- [ ] Audio playback smooth
- [ ] No memory leaks detected

## Test Report Template

```
# Financial Education System Test Report

**Date**: [Date]
**Tester**: [Name]
**Environment**: [Development/Production]

## Test Summary
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Success Rate: [Percentage]

## Component Results

### Mobile App
- Status: [Pass/Fail]
- Issues: [List any issues]

### Backend APIs
- Status: [Pass/Fail]
- Issues: [List any issues]

### Admin Panel
- Status: [Pass/Fail]
- Issues: [List any issues]

### Integration
- Status: [Pass/Fail]
- Issues: [List any issues]

## Recommendations
[List any recommendations for improvements]

## Next Steps
[List any follow-up actions needed]
```

## Conclusion

This comprehensive testing guide ensures all components of the financial education system work together seamlessly. Follow each phase systematically to verify the complete functionality of the mobile app, backend APIs, admin panel, and chatbot integration.

The system provides a complete educational platform for fraud prevention with:
- Interactive tutorials and simulations
- Progress tracking and analytics
- Administrative oversight and content management
- AI-powered chatbot support
- Multi-language support
- Real-time data synchronization

Regular testing using this guide will ensure the system maintains high quality and reliability for end users.