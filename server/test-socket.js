const { io } = require('socket.io-client');

console.log('Starting Socket.IO connection test...');

const socket = io('http://localhost:5000', {
  forceNew: true,
  reconnection: true,
  timeout: 5000,
  transports: ['polling', 'websocket'] // Try polling first, then websocket
});

socket.on('connect', () => {
  console.log('✅ Connected to Socket.IO server!');
  console.log('Socket ID:', socket.id);
  console.log('Transport:', socket.io.engine.transport.name);
  
  // Test the ping event
  console.log('Sending ping...');
  socket.emit('ping');
});

socket.on('pong', (msg) => {
  console.log('✅ Received pong:', msg);
  console.log('Socket.IO test successful!');
  
  // Disconnect after successful test
  setTimeout(() => {
    socket.disconnect();
    console.log('Test completed. Disconnected.');
    process.exit(0);
  }, 1000);
});

socket.on('connect_error', (err) => {
  console.error('❌ Connection error:', err.message);
  console.error('Error details:', err);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected. Reason:', reason);
});

// Timeout after 10 seconds if no connection
setTimeout(() => {
  if (!socket.connected) {
    console.error('❌ Connection timeout - could not connect to server');
    console.log('Make sure your backend server is running on port 5000');
    process.exit(1);
  }
}, 10000);