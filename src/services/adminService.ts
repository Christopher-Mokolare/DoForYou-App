import { apiClient } from './apiClient';
import { ENDPOINTS } from '../config/api';
import { Task, User, PaymentRecord, PaginatedResponse } from '../types';

export interface AdminStats {
  totalUsers: number;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  totalRevenue: number;
  pendingPayments: number;
}

export const adminAPI = {
  getDashboardStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get(ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  },

  getUsers: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get(`${ENDPOINTS.ADMIN.USERS}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  updateUserStatus: async (userId: number, status: string): Promise<User> => {
    const response = await apiClient.patch(`${ENDPOINTS.ADMIN.USERS}/${userId}/status`, { status });
    return response.data;
  },

  getTasks: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Task>> => {
    const response = await apiClient.get(`${ENDPOINTS.ADMIN.TASKS}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  updateTaskStatus: async (taskId: number, status: string): Promise<Task> => {
    const response = await apiClient.patch(`${ENDPOINTS.ADMIN.TASKS}/${taskId}/status`, { status });
    return response.data;
  },

  getPayments: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<PaymentRecord>> => {
    const response = await apiClient.get(`${ENDPOINTS.ADMIN.PAYMENTS}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }
};