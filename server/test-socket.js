const { io } = require('socket.io-client');

const socket = io('http://localhost:5001', {
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('✅ Connected anonymously:', socket.id);
  socket.emit('ping');
});

socket.on('pong', (msg) => {
  console.log('✅ Received pong:', msg);
  socket.disconnect();
  process.exit(0);
});

socket.on('connect_error', (err) => {
  console.error('❌ Connection error:', err.message);
});

