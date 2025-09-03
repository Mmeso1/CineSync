import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private roomId: string | null = null;

  connect(roomId: string, username: string) {
    if (this.socket?.connected) {
      this.disconnect();
    }

    // In a real implementation, this would connect to your WebSocket server
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001', {
      query: { roomId, username }
    });

    this.roomId = roomId;
    this.setupEventListeners();
    
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.roomId = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Video sync events
  emitPlay(timestamp: number) {
    this.socket?.emit('video:play', { roomId: this.roomId, timestamp });
  }

  emitPause(timestamp: number) {
    this.socket?.emit('video:pause', { roomId: this.roomId, timestamp });
  }

  emitSeek(timestamp: number) {
    this.socket?.emit('video:seek', { roomId: this.roomId, timestamp });
  }

  // Voice chat events
  emitMicToggle(enabled: boolean) {
    this.socket?.emit('voice:mic-toggle', { roomId: this.roomId, enabled });
  }

  emitUserMute(userId: string, muted: boolean) {
    this.socket?.emit('voice:user-mute', { roomId: this.roomId, userId, muted });
  }

  emitUserRemove(userId: string) {
    this.socket?.emit('room:user-remove', { roomId: this.roomId, userId });
  }

  // Event listeners
  onVideoPlay(callback: (data: { timestamp: number; userId: string }) => void) {
    this.socket?.on('video:play', callback);
  }

  onVideoPause(callback: (data: { timestamp: number; userId: string }) => void) {
    this.socket?.on('video:pause', callback);
  }

  onVideoSeek(callback: (data: { timestamp: number; userId: string }) => void) {
    this.socket?.on('video:seek', callback);
  }

  onUserJoin(callback: (user: any) => void) {
    this.socket?.on('room:user-join', callback);
  }

  onUserLeave(callback: (userId: string) => void) {
    this.socket?.on('room:user-leave', callback);
  }

  onUserMute(callback: (data: { userId: string; muted: boolean }) => void) {
    this.socket?.on('voice:user-mute', callback);
  }

  onUserRemove(callback: (userId: string) => void) {
    this.socket?.on('room:user-remove', callback);
  }

  // Cleanup
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export const socketManager = new SocketManager();