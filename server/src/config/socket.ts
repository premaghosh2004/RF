import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export interface SocketUser extends IUser {
  socketId: string;
}

export const initializeSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Allow all origins for testing
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Socket authentication middleware - OPTIONAL (only if token is provided)
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      
      // If no token provided, allow connection but don't set user
      if (!token) {
        console.log('Socket connection without authentication');
        return next();
      }
      
      // If token provided, verify it
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.data.user = decoded;
      console.log('Socket connection with authentication for user:', decoded.id);
      next();
    } catch (error) {
      console.log('Socket authentication failed:', error);
      // Still allow connection but without user data
      next();
    }
  });

  io.on('connection', (socket) => {
    // For testing: log connection
    console.log('Socket connected:', socket.id);

    // Simple test event
    socket.on('ping', () => {
      console.log('Received ping from:', socket.id);
      socket.emit('pong', 'Pong from server!');
    });

    // --- Your real-time events below ---
    const user = socket.data.user;
    if (user) {
      console.log(`Authenticated user ${user.username || user.id} connected: ${socket.id}`);
      socket.join(`user:${user.id}`);
    } else {
      console.log(`Anonymous user connected: ${socket.id}`);
    }

    socket.on('spot:create', (spotData) => {
      socket.broadcast.emit('spot:new', {
        ...spotData,
        user: user,
        timestamp: new Date(),
      });
    });

    socket.on('spot:update', (spotData) => {
      io.to(`spot:${spotData.id}`).emit('spot:updated', spotData);
    });

    socket.on('spot:join', (spotId) => {
      socket.join(`spot:${spotId}`);
    });

    socket.on('spot:leave', (spotId) => {
      socket.leave(`spot:${spotId}`);
    });

    socket.on('comment:create', (commentData) => {
      io.to(`spot:${commentData.spotId}`).emit('comment:new', {
        ...commentData,
        user: user,
        timestamp: new Date(),
      });
    });

    socket.on('like:toggle', (likeData) => {
      io.to(`spot:${likeData.spotId}`).emit('like:updated', likeData);
    });

    socket.on('user:status', (status) => {
      socket.broadcast.emit('user:status:updated', {
        userId: user?.id,
        status,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      if (user) {
        console.log(`User ${user.username || user.id} disconnected: ${socket.id}`);
      } else {
        console.log(`Socket disconnected: ${socket.id}`);
      }
    });
  });

  return io;
};