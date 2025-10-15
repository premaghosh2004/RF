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
  transports: ['websocket', 'polling'], // add this explicitly
});
  // Socket authentication middleware (optional, can be commented for open test)
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    // For testing: log connection
    console.log('Socket connected:', socket.id);

    // Simple test event
    socket.on('ping', () => {
      socket.emit('pong', 'Pong from server!');
    });

    // --- Your real-time events below ---
    const user = socket.data.user;
    if (user) {
      console.log(`User ${user.username || user.id} connected: ${socket.id}`);
      socket.join(`user:${user.id}`);
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
