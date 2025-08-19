# Fraud Protection Admin Panel

A comprehensive React-based admin panel for managing the ArthRakshak fraud protection app's financial education content, user progress, and system analytics.

## Features

- **Dashboard Analytics**: Real-time statistics and visualizations
- **User Progress Tracking**: Monitor user engagement and completion rates
- **Content Management**: Manage tutorials, quizzes, and simulations
- **Tutorial Management**: Create and edit step-by-step tutorials
- **Quiz Management**: Manage quiz questions and scoring
- **Settings Configuration**: System-wide settings and preferences
- **Omnidim.io Chatbot Integration**: AI-powered customer support

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Recharts
- **Backend**: Node.js/Express (shared with mobile app)
- **Database**: SQLite (shared with mobile app)
- **UI Components**: Lucide React icons
- **Charts**: Recharts library
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 16+ and npm 8+
- Backend server running on port 5003

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The admin panel will be available at `http://localhost:3001`

### Building for Production

1. Build the application:
```bash
npm run build
```

2. The built files will be in the `build/` directory and can be served by the backend server at `/admin`

## Backend Integration

The admin panel connects to the same backend server used by the mobile app:

- **API Base URL**: `http://localhost:5003/api`
- **Admin Stats**: `GET /api/admin/stats`
- **Education Progress**: `GET /api/education-progress/*`
- **Static Files**: Served at `/admin` by the backend server

### API Endpoints Used

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/education-progress/analytics` - Detailed analytics
- `GET /api/education-progress/leaderboard` - User leaderboard
- `GET /api/education-progress/users` - All user progress
- `GET /api/education-progress/user/:id` - Individual user progress

## Project Structure

```
admin-panel/
├── public/
│   ├── index.html          # Main HTML template with Omnidim chatbot
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   └── Layout.js       # Main layout with sidebar
│   ├── pages/
│   │   ├── Dashboard.js    # Analytics dashboard
│   │   ├── Analytics.js    # Detailed analytics
│   │   ├── TutorialManagement.js  # Tutorial CRUD
│   │   ├── QuizManagement.js      # Quiz CRUD
│   │   ├── UserProgress.js        # User progress tracking
│   │   ├── ContentEditor.js       # Content creation/editing
│   │   └── Settings.js            # System settings
│   ├── services/
│   │   └── apiService.js   # API communication layer
│   ├── App.js              # Main app component
│   ├── index.js            # Entry point
│   └── index.css           # Tailwind CSS styles
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── README.md              # This file
```

## Key Features

### Dashboard
- Real-time user statistics
- Progress completion charts
- Engagement metrics
- Performance analytics

### Content Management
- Tutorial creation and editing
- Quiz question management
- Simulation configuration
- Content activation/deactivation

### User Management
- Progress tracking
- Performance analytics
- User engagement metrics
- Leaderboard management

### System Settings
- Application configuration
- Notification settings
- Security preferences
- Chatbot integration settings

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Environment Variables

Create a `.env` file in the admin panel root:

```env
REACT_APP_API_URL=http://localhost:5003/api
REACT_APP_OMNIDIM_SECRET=f7dd22fc70eb6c18ec2c3fb51f35daf5
```

## Deployment

### Production Build

1. Build the application:
```bash
npm run build
```

2. The backend server automatically serves the built files at `/admin`

3. Access the admin panel at: `http://localhost:5003/admin`

### Docker Deployment

The admin panel is included in the main application Docker setup. The backend server serves the built static files.

## API Integration

The admin panel integrates with the existing mobile app backend:

- Shares the same database
- Uses existing authentication system
- Leverages education progress APIs
- Extends with admin-specific endpoints

## Security

- CORS configured for admin panel origin
- Authentication token support
- Secure API communication
- Input validation and sanitization

## Monitoring

- Real-time dashboard updates
- Error tracking and logging
- Performance metrics
- User activity monitoring

## Support

For technical support or questions:
- Check the backend server logs
- Verify API connectivity
- Review browser console for errors
- Ensure proper CORS configuration

## License

This project is part of the ArthRakshak fraud protection system.