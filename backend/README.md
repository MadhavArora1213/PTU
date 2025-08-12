# ArthRakshak Backend API

## Overview

This is the backend API for ArthRakshak, a financial safety and education mobile app. The API is built with Node.js, Express, and PostgreSQL.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- OpenAI API key (for AI-powered features)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (protected)

### User Management

- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)
- `GET /api/user/points` - Get user points (protected)
- `GET /api/user/achievements` - Get user achievements (protected)

### Financial Management

- `POST /api/financial/budget` - Create budget plan (protected)
- `GET /api/financial/budget` - Get budget plans (protected)
- `GET /api/financial/budget/:planId` - Get specific budget plan (protected)
- `POST /api/financial/budget/:planId/category` - Add budget category (protected)
- `POST /api/financial/goals` - Create financial goal (protected)
- `GET /api/financial/goals` - Get financial goals (protected)
- `PUT /api/financial/goals/:goalId` - Update financial goal (protected)
- `POST /api/financial/calculate/emi` - Calculate EMI
- `POST /api/financial/calculate/sip` - Calculate SIP

### Chatbot

- `POST /api/chatbot/chat` - Chat with financial advisor bot (protected)

### Therapist

- `POST /api/therapist/chat` - Chat with financial therapist (protected)

### Fraud Reporting

- `POST /api/fraud/report` - Submit fraud report (protected)
- `GET /api/fraud/reports` - Get fraud reports
- `POST /api/fraud/report/:reportId/verify` - Verify fraud report (protected)
- `POST /api/fraud/detect` - Detect fraud in text (protected)

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Database Schema

The application uses PostgreSQL with the following tables:

- `users` - User information
- `financial_goals` - Financial goals tracking
- `budget_plans` - Monthly budget plans
- `budget_categories` - Budget categories
- `quiz_results` - Quiz results and scores
- `fraud_reports` - Community fraud reports
- `financial_tips` - Financial tips and tutorials
- `user_achievements` - User achievements and badges
- `user_points` - User reward points
- `refresh_tokens` - Refresh tokens for auth

## WebSocket Events

- `join` - User joins a room
- `notification` - General notification
- `localFraudAlert` - Local fraud alert

## AI Features

The application integrates with OpenAI for:

- Financial chatbot responses
- Financial therapist responses
- Fraud detection in text

## Environment Variables

- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `ACCESS_TOKEN_SECRET` - JWT access token secret
- `REFRESH_TOKEN_SECRET` - JWT refresh token secret
- `OPENAI_API_KEY` - OpenAI API key
- `FRONTEND_URL` - Frontend application URL for CORS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.