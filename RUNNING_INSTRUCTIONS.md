# Running ArthRakshak Application

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (comes with Node.js)
- PostgreSQL database (or Neon DB account)
- Expo CLI for React Native development
- Git (optional, for cloning the repository)

## Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install backend dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - `DATABASE_URL`: Your PostgreSQL connection string (Neon DB)
   - `ACCESS_TOKEN_SECRET`: A random string for JWT access tokens
   - `REFRESH_TOKEN_SECRET`: A random string for JWT refresh tokens
   - `SARVAM_API_KEY`: Your Sarvam AI API key for AI features <write_to_file>
     <path>RUNNING_INSTRUCTIONS.md</path>
     <content>

# Running ArthRakshak Application

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (comes with Node.js)
- PostgreSQL database (or Neon DB account)
- Expo CLI for React Native development
- Git (optional, for cloning the repository)

## Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install backend dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:

   - `DATABASE_URL`: Your PostgreSQL connection string (Neon DB)
   - `ACCESS_TOKEN_SECRET`: A random string for JWT access tokens
   - `REFRESH_TOKEN_SECRET`: A random string for JWT refresh tokens
   - `SARVAM_API_KEY`: Your Sarvam AI API key for AI features (optional)
   - `FRONTEND_URL`: URL of your frontend application (e.g., http://localhost:3000)

5. Run database migrations (if applicable):
   The database tables will be automatically created when you start the server.

6. Start the backend server:

   ```
   npm start
   ```

   For development with auto-restart:

   ```
   npm run dev
   ```

   The backend will be available at http://localhost:5000 by default.

## Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install frontend dependencies:

   ```
   npm install
   ```

3. Start the Expo development server:

   ```
   npx expo start
   ```

4. To run on an emulator or physical device:

   - For iOS: Press `i` in the terminal after starting Expo
   - For Android: Press `a` in the terminal after starting Expo
   - For web: Press `w` in the terminal after starting Expo

5. To run on a physical device:
   - Install the Expo Go app on your device
   - Scan the QR code displayed in the terminal

## Testing the API

1. Import the `ArthRakshak.postman_collection.json` file into Postman
2. Update the environment variables:
   - `base_url`: The URL of your backend (e.g., http://localhost:5000)
   - `accessToken`: JWT token obtained after login
   - `refreshToken`: Refresh token obtained after login
3. Run the requests in the following order:
   - Register a new user
   - Login to get access and refresh tokens
   - Use other endpoints with the obtained tokens

## Deployment

### Backend Deployment Options:

1. **Render:**

   - Create a new Web Service on Render
   - Connect your repository
   - Set the build command to `npm install`
   - Set the start command to `npm start`
   - Add environment variables from your `.env` file

2. **Heroku:**

   - Install Heroku CLI
   - Login: `heroku login`
   - Create app: `heroku create`
   - Deploy: `git push heroku main`
   - Set environment variables: `heroku config:set KEY=VALUE`

3. **Vercel:**
   - Install Vercel CLI
   - Login: `vercel login`
   - Deploy: `vercel`
   - Set environment variables in the Vercel dashboard

### Frontend Deployment:

1. **Mobile App:**

   - Build for production: `npx expo build:android` or `npx expo build:ios`
   - Follow Expo's instructions for publishing to app stores

2. **Web App:**
   - Build for web: `npx expo build:web`
   - Deploy the contents of the `web-build` directory to any static hosting service

## Troubleshooting

1. **Port conflicts:**

   - Change the PORT in `.env` file for backend
   - Update the API URL in frontend services

2. **Database connection issues:**

   - Verify your DATABASE_URL in `.env`
   - Ensure your PostgreSQL/Neon DB is accessible
   - Check firewall settings if using a remote database

3. **Missing environment variables:**

   - Ensure all required variables from `.env.example` are in your `.env` file

4. **Frontend not connecting to backend:**

   - Check that the backend is running
   - Verify the API URL in `frontend/services/api.js`
   - Check CORS settings in backend

5. **AI features not working:**
   - The app works without a Sarvam AI API key using rule-based fallbacks
   - To enable AI features, add your SARVAM_API_KEY in `.env`
   - Check that you have quota available in your Sarvam AI account

## Development Workflow

1. **Backend development:**

   - Use `npm run dev` for auto-restart during development
   - Check logs in the terminal for errors

2. **Frontend development:**

   - The Expo development server will reload automatically when you save changes
   - Use the Expo Go app for testing on physical devices

3. **Testing:**

   - Use Postman collection for API testing
   - Test both positive and negative cases
   - Verify authentication and authorization

4. **Adding new features:**
   - Follow the existing patterns in controllers, routes, and services
   - Add new endpoints to the Postman collection
   - Update documentation when adding new features

## About AI Integration

The application includes AI integration for enhanced features:

- Financial chatbot responses
- Financial therapist responses
- Fraud detection in text

However, AI is completely optional:

- The app works without an API key using rule-based fallbacks
- To enable AI features, add your SARVAM_API_KEY to the `.env` file
- Without the key, the app provides default responses based on predefined rules
- The app is also compatible with OpenAI API if you prefer to use that instead
