import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected) return;

    this.userId = userId;
    this.socket = io('http://localhost:5000', {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket?.emit('join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('errand_accepted', (data) => {
      this.showNotification('Errand Accepted', `Your errand "${data.title}" has been accepted!`);
    });

    this.socket.on('errand_completed', (data) => {
      this.showNotification('Errand Completed', `Errand "${data.title}" has been completed!`);
    });

    this.socket.on('deadline_reminder', (data) => {
      this.showNotification('Deadline Reminder', `Errand "${data.title}" is due soon!`);
    });

    this.socket.on('errand_overdue', (data) => {
      this.showNotification('Errand Overdue', `Errand "${data.title}" is overdue!`);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private showNotification(title: string, body: string) {
    // In a real app, you'd use Expo Notifications or similar
    console.log(`Notification: ${title} - ${body}`);
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }
}

export default new SocketService();