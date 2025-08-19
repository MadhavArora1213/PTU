# Admin Panel Setup and Running Guide

## Prerequisites
- Node.js 16+ and npm 8+
- Backend server running on port 5003

## Step-by-Step Setup Instructions

### 1. Navigate to Admin Panel Directory
```bash
cd admin-panel
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required dependencies including:
- React 18
- Tailwind CSS
- Recharts for analytics
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons

### 3. Start Development Server
```bash
npm start
```

The admin panel will start on **http://localhost:3001**

### 4. Access Admin Panel
Open your web browser and go to:
- **Development**: http://localhost:3001
- **Production** (when backend is running): http://localhost:5003/admin

## Alternative Running Methods

### Option 1: Development Mode (Recommended for testing)
```bash
cd admin-panel
npm install
npm start
```
- Runs on port 3001
- Hot reload enabled
- Development tools available

### Option 2: Production Build
```bash
cd admin-panel
npm install
npm run build
```
Then start the backend server which will serve the built admin panel at `/admin`

### Option 3: Using Backend Server (Production)
1. First build the admin panel:
```bash
cd admin-panel
npm run build
```

2. Start the backend server:
```bash
cd ../backend
npm start
```

3. Access admin panel at: http://localhost:5003/admin

## Troubleshooting

### Issue: Dependencies not installing
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3001 already in use
**Solution**: 
```bash
# Kill process on port 3001
npx kill-port 3001
# Or use different port
PORT=3002 npm start
```

### Issue: Admin panel can't connect to backend
**Solution**: 
1. Ensure backend is running on port 5003
2. Check CORS settings in backend
3. Verify API URLs are correct (should be port 5003)

### Issue: Blank page or loading errors
**Solution**:
1. Check browser console for errors
2. Ensure all dependencies are installed
3. Try clearing browser cache
4. Restart development server

## Environment Variables (Optional)

Create `.env` file in admin-panel directory:
```env
REACT_APP_API_URL=http://localhost:5003/api
PORT=3001
```

## Admin Panel Features

Once running, you'll have access to:

### 📊 Dashboard
- Real-time user statistics
- Progress completion charts
- Engagement metrics
- Performance analytics

### 📈 Analytics
- Detailed user progress data
- Tutorial completion rates
- Quiz performance metrics
- Time-based analytics

### 📚 Tutorial Management
- View all tutorials
- Create/edit tutorial content
- Manage tutorial status (active/inactive)
- Content organization

### 🧠 Quiz Management
- Quiz question management
- Scoring configuration
- Performance tracking
- Results analysis

### 👥 User Progress
- Individual user tracking
- Progress monitoring
- Performance insights
- User engagement data

### ⚙️ Settings
- System configuration
- Notification preferences
- Security settings
- Chatbot integration settings

## Quick Start Commands Summary

```bash
# Complete setup and run
cd admin-panel
npm install
npm start

# Then open browser to: http://localhost:3001
```

## System Requirements

- **Node.js**: 16.0.0 or higher
- **npm**: 8.0.0 or higher
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)
- **Backend**: Must be running on port 5003

## Default Login

The admin panel currently doesn't require authentication for development. In production, you would implement proper authentication.

## Support

If you encounter issues:
1. Check that backend server is running on port 5003
2. Verify all dependencies are installed
3. Check browser console for error messages
4. Ensure no firewall is blocking port 3001
5. Try restarting both backend and admin panel

## Production Deployment

For production deployment:
1. Build the admin panel: `npm run build`
2. The backend server automatically serves built files at `/admin`
3. Access via: `http://your-domain.com:5003/admin`