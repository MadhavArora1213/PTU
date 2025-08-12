# ArthRakshak Frontend

## Overview

This is the frontend for ArthRakshak, a financial safety and education mobile app. The frontend is built with React Native and Expo.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI
- Android/iOS device or emulator

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the Expo development server:
   ```
   expo start
   ```

## Project Structure

```
frontend/
├── App.js                 # Main application component
├── package.json           # Project dependencies
├── components/            # Reusable UI components
│   ├── AchievementBadge.js
│   ├── BarChartComponent.js
│   ├── GoalProgressChart.js
│   ├── Leaderboard.js
│   └── PieChartComponent.js
├── screens/               # Application screens
│   ├── AlertsScreen.js
│   ├── BudgetPlannerScreen.js
│   ├── ChatbotScreen.js
│   ├── EMICalculatorScreen.js
│   ├── FinancialGoalsScreen.js
│   ├── FinancialTherapistScreen.js
│   ├── FraudReportingScreen.js
│   ├── HomeScreen.js
│   ├── LoginScreen.js
│   ├── ProfileScreen.js
│   ├── QuizScreen.js
│   ├── RegisterScreen.js
│   ├── SIPCalculatorScreen.js
│   ├── TipsScreen.js
│   └── VoiceAssistantScreen.js
└── services/              # API and utility services
    ├── api.js
    ├── authService.js
    ├── financialService.js
    ├── fraudService.js
    ├── notificationService.js
    ├── openaiService.js
    ├── quizService.js
    ├── tipsService.js
    ├── userService.js
    └── voiceService.js
```

## Features

### Authentication
- User registration with name, email, password, phone, user type, and language
- User login with email and password
- JWT-based authentication with refresh tokens

### Financial Management
- Budget planner with income, expenses, and savings tracking
- Financial goals tracking with progress visualization
- EMI calculator for loan planning
- SIP calculator for investment planning

### AI-Powered Features
- Persona-based financial chatbot
- AI financial therapist for stress relief
- Fraud detection in text

### Community Features
- Fraud reporting with location tagging
- Community verification of fraud reports
- Real-time alerts for local fraud incidents
- Gamification with points and achievements

### Educational Content
- Daily financial tips in multiple languages
- Financial quizzes with leaderboards
- Tax planning and investment guides

### Accessibility
- Voice-first interface for visually impaired users
- Text-to-speech for all content
- Voice commands for navigation

## UI Components

### Color Scheme
- Primary: Green (#2E8B57)
- Secondary: Yellow (#FFD700)
- Background: White (#FFFFFF)
- Text: Dark gray (#333333)

### Charts and Visualizations
- Pie charts for budget breakdown
- Bar charts for financial comparisons
- Progress circles for goal tracking

### Gamification Elements
- Achievement badges
- Point system
- Leaderboards

## API Integration

The frontend communicates with the backend API through service files:
- `authService.js` - Authentication endpoints
- `userService.js` - User management endpoints
- `financialService.js` - Financial management endpoints
- `quizService.js` - Quiz and gamification endpoints
- `tipsService.js` - Educational content endpoints
- `fraudService.js` - Fraud reporting endpoints
- `openaiService.js` - AI-powered features

## WebSocket Integration

Real-time features are implemented using Socket.IO:
- Fraud alerts
- Notification system
- Community updates

## Voice Interface

Voice features are implemented using Expo Speech and Speech Recognition:
- Text-to-speech for all content
- Voice commands for navigation
- Voice input for chatbot

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.