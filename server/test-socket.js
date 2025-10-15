const { io } = require('socket.io-client');

const socket = io('http://localhost:5000', { transports: ['websocket'] });


socket.on('connect', () => {
  console.log('Connected to Socket.IO:', socket.id);
  socket.emit('ping');
});

socket.on('pong', (msg) => {
  console.log('Received from server:', msg);
  socket.disconnect();
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
});
