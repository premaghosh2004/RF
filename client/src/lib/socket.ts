import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001', {
      auth: { token },
      transports: ['websocket'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleReconnect();
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.socket?.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  // Event listeners
  onNewSpot(callback: (spot: any) => void): void {
    this.socket?.on('spot:new', callback);
  }

  onSpotUpdated(callback: (spot: any) => void): void {
    this.socket?.on('spot:updated', callback);
  }

  onNewComment(callback: (comment: any) => void): void {
    this.socket?.on('comment:new', callback);
  }

  onLikeUpdated(callback: (data: any) => void): void {
    this.socket?.on('like:updated', callback);
  }

  // Event emitters
  joinSpot(spotId: string): void {
    this.socket?.emit('spot:join', spotId);
  }

  leaveSpot(spotId: string): void {
    this.socket?.emit('spot:leave', spotId);
  }

  createSpot(spotData: any): void {
    this.socket?.emit('spot:create', spotData);
  }

  toggleLike(likeData: { spotId: string; isLiked: boolean }): void {
    this.socket?.emit('like:toggle', likeData);
  }

  addComment(commentData: { spotId: string; content: string }): void {
    this.socket?.emit('comment:create', commentData);
  }

  updateUserStatus(status: 'online' | 'offline' | 'away'): void {
    this.socket?.emit('user:status', status);
  }
}

export const socketService = new SocketService();
