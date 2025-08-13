const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:8083', 'http://10.146.166.206:8082', 'http://192.168.137.8:8082'],
  credentials: true
})); // Enable CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Database connection and initialization
const db = require('./config/database');
db.initializeDatabase();

// Socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/financial', require('./routes/financialRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/fraud', require('./routes/fraudRoutes'));
app.use('/api/therapist', require('./routes/therapistRoutes'));
app.use('/api/translation', require('./routes/translationRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'ArthRakshak Backend API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };