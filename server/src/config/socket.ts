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
      origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`User ${user.username} connected: ${socket.id}`);

    // Join user to their personal room
    socket.join(`user:${user.id}`);

    // Handle spot creation in real-time
    socket.on('spot:create', (spotData) => {
      socket.broadcast.emit('spot:new', {
        ...spotData,
        user: user,
        timestamp: new Date(),
      });
    });

    // Handle spot updates
    socket.on('spot:update', (spotData) => {
      io.to(`spot:${spotData.id}`).emit('spot:updated', spotData);
    });

    // Join spot room
    socket.on('spot:join', (spotId) => {
      socket.join(`spot:${spotId}`);
    });

    // Leave spot room
    socket.on('spot:leave', (spotId) => {
      socket.leave(`spot:${spotId}`);
    });

    // Handle comments in real-time
    socket.on('comment:create', (commentData) => {
      io.to(`spot:${commentData.spotId}`).emit('comment:new', {
        ...commentData,
        user: user,
        timestamp: new Date(),
      });
    });

    // Handle likes in real-time
    socket.on('like:toggle', (likeData) => {
      io.to(`spot:${likeData.spotId}`).emit('like:updated', likeData);
    });

    // Handle user status
    socket.on('user:status', (status) => {
      socket.broadcast.emit('user:status:updated', {
        userId: user.id,
        status,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`User ${user.username} disconnected: ${socket.id}`);
    });
  });

  return io;
};
