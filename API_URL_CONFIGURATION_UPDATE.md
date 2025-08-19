# API URL Configuration Update

## Issue Fixed
The system was configured to use port 5000 for the backend API, but the actual backend server runs on port 5003. This caused connection failures between the frontend components and the backend.

## Files Updated

### 1. Admin Panel API Service
**File**: `admin-panel/src/services/apiService.js`
**Change**: 
```javascript
// Before
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// After  
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';
```

### 2. Mobile App API Service
**File**: `frontend/services/api.js`
**Change**:
```javascript
// Before
if (Platform.OS === 'android') {
  return 'http://192.168.1.6:5000/api';
} else {
  return 'http://192.168.1.6:5000/api';
}

// After
if (Platform.OS === 'android') {
  return 'http://192.168.1.6:5003/api';
} else {
  return 'http://192.168.1.6:5003/api';
}
```

### 3. Education Progress Service
**File**: `frontend/services/educationProgressService.js`
**Change**:
```javascript
// Before
const API_BASE_URL = 'http://localhost:5000/api/education-progress';

// After
const API_BASE_URL = 'http://localhost:5003/api/education-progress';
```

## Backend Server Configuration
The backend server is correctly configured to run on port 5003 as specified in:
- `backend/server.js`: `const PORT = process.env.PORT || 5003;`

## Impact
These changes ensure that:
1. **Admin Panel** can connect to the backend API for dashboard data and analytics
2. **Mobile App** can communicate with the backend for user authentication and data
3. **Education Progress Service** can track user progress and sync data properly
4. **Real-time synchronization** works between mobile app and admin panel

## Environment Variables
For production deployment, you can override these URLs using environment variables:
- **Admin Panel**: `REACT_APP_API_URL=https://your-backend-domain.com/api`
- **Mobile App**: `EXPO_PUBLIC_API_URL=https://your-backend-domain.com`

## Testing
After these changes, verify connectivity by:
1. Starting the backend server: `cd backend && npm start`
2. Testing admin panel: `cd admin-panel && npm start`
3. Testing mobile app: `cd frontend && npx expo start`
4. Checking API endpoints respond correctly at `http://localhost:5003/api`

## Status
✅ **All API URL configurations updated and synchronized**
✅ **System ready for testing and deployment**