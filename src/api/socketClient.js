import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3600';

export const socket = io(SOCKET_URL, {
  withCredentials: true
});

export const connectSocket = (userId) => {
  if (userId) {
    socket.emit('register', userId);
  }
};

export const disconnectSocket = () => {
  socket.disconnect();
};