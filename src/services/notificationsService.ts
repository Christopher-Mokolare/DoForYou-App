import { apiClient } from './apiClient';
import { ENDPOINTS } from '../config/api';
import { UserNotification } from '../types';

export const notificationsAPI = {
  getNotifications: async (): Promise<UserNotification[]> => {
    const response = await apiClient.get(ENDPOINTS.USER.NOTIFICATIONS);
    return response.data;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.patch(`${ENDPOINTS.USER.NOTIFICATIONS}/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch(`${ENDPOINTS.USER.NOTIFICATIONS}/read-all`);
  }
};