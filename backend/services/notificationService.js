const { io } = require('../server');

// Store connected users
const connectedUsers = new Map();

// Add user to connected users
const addUser = (userId, socketId) => {
  connectedUsers.set(userId, socketId);
};

// Remove user from connected users
const removeUser = (socketId) => {
  for (let [userId, sockId] of connectedUsers.entries()) {
    if (sockId === socketId) {
      connectedUsers.delete(userId);
      break;
    }
  }
};

// Get socket ID by user ID
const getSocketId = (userId) => {
  return connectedUsers.get(userId);
};

// Send notification to a specific user
const sendNotificationToUser = (userId, notification) => {
  const socketId = getSocketId(userId);
  if (socketId) {
    io.to(socketId).emit('notification', notification);
  }
};

// Send notification to all users
const sendNotificationToAll = (notification) => {
  io.emit('notification', notification);
};

// Send fraud alert to users in a specific area
const sendLocalFraudAlert = (latitude, longitude, alert) => {
  // In a real implementation, you would check which users are in the area
  // For now, we'll send to all users
  io.emit('localFraudAlert', {
    ...alert,
    location: { latitude, longitude }
  });
};

module.exports = {
  addUser,
  removeUser,
  sendNotificationToUser,
  sendNotificationToAll,
  sendLocalFraudAlert
};