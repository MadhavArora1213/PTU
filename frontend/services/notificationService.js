import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create socket connection
let socket;

const connectSocket = async () => {
  if (socket) return socket;
  
  // Get user token from storage
  const token = await AsyncStorage.getItem('token');
  
  if (token) {
    socket = io('http://localhost:5003', {
      transports: ['websocket'],
      auth: {
        token
      }
    });
    
    // Handle connection
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
    
    // Handle connection error
    socket.on('connect_error', (error) => {
      console.log('Socket connection error:', error);
    });
  }
  
  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

const joinRoom = (userId) => {
  if (socket) {
    socket.emit('join', userId);
  }
};

const onNotification = (callback) => {
  if (socket) {
    socket.on('notification', callback);
  }
};

const onLocalFraudAlert = (callback) => {
  if (socket) {
    socket.on('localFraudAlert', callback);
  }
};

export {
  connectSocket,
  disconnectSocket,
  joinRoom,
  onNotification,
  onLocalFraudAlert
};