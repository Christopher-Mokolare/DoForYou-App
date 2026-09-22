import * as signalR from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/environment';

export type ChatMessageListener = (message: {
  id: number | string;
  taskId: string;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isCurrentUser?: boolean;
  isSystem?: boolean;
}) => void;

export class TaskChatConnection {
  private connection: signalR.HubConnection | null = null;

  async connect(taskId: string, onMessage: ChatMessageListener, onStateChange?: (connected: boolean) => void) {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) throw new Error('Authentication required.');

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(config.websocket.url, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(config.enableLogging ? signalR.LogLevel.Warning : signalR.LogLevel.None)
      .build();

    this.connection.on('ReceiveMessage', (message) => onMessage({
      ...message,
      taskId: String(message.taskId ?? taskId),
    }));

    this.connection.onreconnecting(() => onStateChange?.(false));
    this.connection.onreconnected(async () => {
      onStateChange?.(true);
      await this.connection?.invoke('JoinTaskChat', taskId);
    });
    this.connection.onclose(() => onStateChange?.(false));

    await this.connection.start();
    await this.connection.invoke('JoinTaskChat', taskId);
    onStateChange?.(true);
  }

  async leave(taskId: string) {
    try {
      if (this.connection?.state === signalR.HubConnectionState.Connected) {
        await this.connection.invoke('LeaveTaskChat', taskId);
      }
    } catch {
      // Cleanup must remain best-effort.
    }
    await this.connection?.stop();
    this.connection = null;
  }

  get connected() {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}
