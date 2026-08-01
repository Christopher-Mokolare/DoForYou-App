import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';

interface QueuedRequest {
  id: string;
  method: string;
  url: string;
  data?: any;
  timestamp: number;
}

class OfflineService {
  private isOnline = true;
  private requestQueue: QueuedRequest[] = [];
  private readonly QUEUE_KEY = 'offline_request_queue';

  constructor() {
    this.initializeNetworkListener();
    this.loadQueueFromStorage();
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      if (wasOffline && this.isOnline) {
        this.processQueue();
      }
    });
  }

  private async loadQueueFromStorage() {
    try {
      const queueData = await AsyncStorage.getItem(this.QUEUE_KEY);
      if (queueData) {
        this.requestQueue = JSON.parse(queueData);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }

  private async saveQueueToStorage() {
    try {
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.requestQueue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  async queueRequest(method: string, url: string, data?: any): Promise<void> {
    const request: QueuedRequest = {
      id: Date.now().toString(),
      method,
      url,
      data,
      timestamp: Date.now()
    };

    this.requestQueue.push(request);
    await this.saveQueueToStorage();
  }

  private async processQueue() {
    if (this.requestQueue.length === 0) return;

    const { api } = await import('./api');
    const processedIds: string[] = [];

    for (const request of this.requestQueue) {
      try {
        // Retry the request
        await api.request({
          method: request.method as any,
          url: request.url,
          data: request.data
        });
        
        processedIds.push(request.id);
      } catch (error) {
        console.error('Failed to process queued request:', error);
        
        // Remove old requests (older than 24 hours)
        if (Date.now() - request.timestamp > 24 * 60 * 60 * 1000) {
          processedIds.push(request.id);
        }
      }
    }

    // Remove processed requests
    this.requestQueue = this.requestQueue.filter(req => !processedIds.includes(req.id));
    await this.saveQueueToStorage();
  }

  isOffline(): boolean {
    return !this.isOnline;
  }

  getQueueLength(): number {
    return this.requestQueue.length;
  }

  async clearQueue(): Promise<void> {
    this.requestQueue = [];
    await this.saveQueueToStorage();
  }
}

export const offlineService = new OfflineService();