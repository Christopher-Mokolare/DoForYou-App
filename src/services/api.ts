import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/environment';
import {
  User, Task, TaskMessage, ProgressUpdate,
  RegisterModel, LoginModel, AuthResponse,
  CreateTaskData, ClaimTaskData,
  UserPreferences, UserWallet, WalletTransaction, WithdrawalRequest,
  UserNotification, PaymentRecord,
  PaginatedResponse, ApiResponse, DashboardStats,
  TaskFilter,
} from '../types';

const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (cfg) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) AsyncStorage.removeItem('auth_token');
    if (config.enableLogging) console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export { api };

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: async (data: RegisterModel): Promise<AuthResponse> => {
    const r = await api.post('/api/v1/auth/register', data);
    return r.data;
  },

  login: async (data: LoginModel): Promise<AuthResponse> => {
    const r = await api.post('/api/v1/auth/login', data);
    return r.data;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('auth_token');
  },
};

// ─── User ─────────────────────────────────────────────────────────────────────

export const userAPI = {
  getProfile: async (): Promise<User> => {
    const r = await api.get('/api/v1/user/profile');
    return r.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<void> => {
    await api.put('/api/v1/user/profile', data);
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const r = await api.get('/api/v1/user/dashboard/stats');
    return r.data.data;
  },

  getPreferences: async (): Promise<UserPreferences> => {
    const r = await api.get('/api/v1/UserPreferences');
    return r.data.data;
  },

  updatePreferences: async (data: { userType: string }): Promise<void> => {
    await api.put('/api/v1/UserPreferences', data);
  },
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const tasksAPI = {
  getAvailableTasks: async (page = 1, pageSize = 10, filters?: TaskFilter): Promise<Task[]> => {
    let url = `/api/v1/tasks/available?page=${page}&pageSize=${pageSize}`;
    if (filters?.search) url += `&search=${encodeURIComponent(filters.search)}`;
    if (filters?.category) url += `&category=${encodeURIComponent(filters.category)}`;
    const r = await api.get(url);
    return r.data.tasks ?? [];
  },

  getMyPostedTasks: async (): Promise<Task[]> => {
    const r = await api.get('/api/v1/tasks/my-posted');
    return r.data.data?.tasks ?? r.data.data ?? [];
  },

  getMyActiveTasks: async (): Promise<Task[]> => {
    const r = await api.get('/api/v1/tasks/my-active');
    return r.data.data ?? [];
  },

  getTaskById: async (taskId: string): Promise<Task> => {
    const r = await api.get(`/api/v1/tasks/${taskId}`);
    return r.data.data;
  },

  createTask: async (data: CreateTaskData): Promise<{ task: Task; paymentUrl: string }> => {
    const r = await api.post('/api/v1/tasks', data);
    return r.data.data;
  },

  claimTask: async (taskId: string, data: ClaimTaskData): Promise<void> => {
    await api.post(`/api/v1/tasks/${taskId}/claim`, data);
  },

  completeTask: async (taskId: string): Promise<void> => {
    await api.post(`/api/v1/tasks/${taskId}/complete`);
  },

  confirmTask: async (taskId: string): Promise<void> => {
    await api.post(`/api/v1/tasks/${taskId}/confirm`);
  },

  getMessages: async (taskId: string): Promise<TaskMessage[]> => {
    const r = await api.get(`/api/v1/tasks/${taskId}/messages`);
    return r.data.data ?? [];
  },

  sendMessage: async (taskId: string, content: string): Promise<void> => {
    await api.post(`/api/v1/tasks/${taskId}/messages`, { content });
  },

  getProgress: async (taskId: string): Promise<ProgressUpdate[]> => {
    const r = await api.get(`/api/v1/tasks/${taskId}/progress`);
    return r.data.data ?? [];
  },

  postProgress: async (taskId: string, progressNote: string): Promise<void> => {
    await api.post(`/api/v1/tasks/${taskId}/progress`, { progressNote });
  },

  getCategories: async (): Promise<string[]> => {
    const r = await api.get('/api/v1/categories');
    return r.data.data ?? [];
  },
};

// ─── Wallet ───────────────────────────────────────────────────────────────────

export const walletAPI = {
  getBalance: async (): Promise<UserWallet> => {
    const r = await api.get('/api/v1/wallet/balance');
    return r.data.data;
  },

  getTransactions: async (page = 1, pageSize = 20): Promise<WalletTransaction[]> => {
    const r = await api.get(`/api/v1/wallet/transactions?page=${page}&pageSize=${pageSize}`);
    return r.data.data?.items ?? [];
  },

  requestWithdrawal: async (data: WithdrawalRequest): Promise<void> => {
    await api.post('/api/v1/wallet/withdraw', data);
  },
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsAPI = {
  getAll: async (): Promise<UserNotification[]> => {
    const r = await api.get('/api/v1/notifications');
    return r.data.data ?? [];
  },

  getUnreadCount: async (): Promise<number> => {
    const r = await api.get('/api/v1/notifications/unread-count');
    return r.data.data ?? 0;
  },

  markRead: async (id: number): Promise<void> => {
    await api.post(`/api/v1/notifications/${id}/mark-read`);
  },

  markAllRead: async (): Promise<void> => {
    await api.post('/api/v1/notifications/mark-all-read');
  },
};

// ─── Payment ──────────────────────────────────────────────────────────────────

export const paymentAPI = {
  getPaymentUrl: async (taskId: string): Promise<string> => {
    const r = await api.get(`/api/v1/tasks/${taskId}/payment-url`);
    return r.data.data?.paymentUrl ?? '';
  },
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminAPI = {
  getDashboard: async (): Promise<any> => {
    const r = await api.get('/api/v1/admin/dashboard');
    return r.data.data;
  },

  getAllTasks: async (page = 1, pageSize = 20, status?: string): Promise<any> => {
    let url = `/api/v1/admin/tasks?page=${page}&pageSize=${pageSize}`;
    if (status) url += `&taskStatus=${status}`;
    const r = await api.get(url);
    return r.data.data;
  },

  getAllUsers: async (page = 1, pageSize = 20): Promise<any> => {
    const r = await api.get(`/api/v1/admin/users?page=${page}&pageSize=${pageSize}`);
    return r.data.data;
  },

  getPayments: async (): Promise<any> => {
    const r = await api.get('/api/v1/admin/payments');
    return r.data.data;
  },

  verifyTask: async (taskId: string): Promise<void> => {
    await api.patch(`/api/v1/admin/tasks/${taskId}/verify`);
  },

  unverifyTask: async (taskId: string): Promise<void> => {
    await api.patch(`/api/v1/admin/tasks/${taskId}/unverify`);
  },
};

// Backward compat aliases
export const errandAPI = {
  getErrands: (filters?: TaskFilter) => tasksAPI.getAvailableTasks(1, 10, filters),
  createErrand: (data: CreateTaskData) => tasksAPI.createTask(data),
  getMyErrands: () => tasksAPI.getMyPostedTasks(),
  acceptErrand: (id: string, data: ClaimTaskData) => tasksAPI.claimTask(id, data),
  completeErrand: (id: string) => tasksAPI.completeTask(id),
  confirmErrand: (id: string) => tasksAPI.confirmTask(id),
};
