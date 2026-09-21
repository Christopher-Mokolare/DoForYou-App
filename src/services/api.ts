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
  BankDetails,
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

export const authAPI = {
  register: async (data: RegisterModel): Promise<AuthResponse> => (await api.post('/api/v1/auth/register', data)).data,
  login: async (data: LoginModel): Promise<AuthResponse> => (await api.post('/api/v1/auth/login', data)).data,
  logout: async (): Promise<void> => { await AsyncStorage.removeItem('auth_token'); },
  forgotPassword: async (data: { email: string }): Promise<{ message: string }> => (await api.post('/api/v1/auth/forgot-password', data)).data,
  resendVerification: async (email: string): Promise<{ message: string }> => (await api.post('/api/v1/auth/resend-verification', { email })).data,
};

export const userAPI = {
  getProfile: async (): Promise<User> => (await api.get('/api/v1/user/profile')).data.data,
  updateProfile: async (data: Partial<User>): Promise<void> => { await api.put('/api/v1/user/profile', data); },
  getDashboardStats: async (): Promise<DashboardStats> => (await api.get('/api/v1/user/dashboard/stats')).data.data,
  getPreferences: async (): Promise<UserPreferences> => (await api.get('/api/v1/user/preferences')).data.data,
  updatePreferences: async (data: { userType: string }): Promise<void> => { await api.put('/api/v1/user/preferences', data); },
};

export const tasksAPI = {
  getAvailableTasks: async (page = 1, pageSize = 10, filters?: TaskFilter): Promise<Task[]> => {
    let url = `/api/v1/tasks/available?page=${page}&pageSize=${pageSize}`;
    if (filters?.search) url += `&search=${encodeURIComponent(filters.search)}`;
    if (filters?.category) url += `&category=${encodeURIComponent(filters.category)}`;
    return (await api.get(url)).data.tasks ?? [];
  },
  getMyPostedTasks: async (): Promise<Task[]> => {
    const r = await api.get('/api/v1/tasks/my-posted');
    return r.data.data?.tasks ?? r.data.data ?? [];
  },
  getMyActiveTasks: async (): Promise<Task[]> => (await api.get('/api/v1/tasks/my-active')).data.data ?? [],
  getTaskById: async (taskId: string): Promise<Task> => (await api.get(`/api/v1/tasks/${taskId}`)).data.data,
  createTask: async (data: CreateTaskData): Promise<{ task: Task; paymentUrl: string }> => (await api.post('/api/v1/tasks', data)).data.data,
  claimTask: async (taskId: string, data: ClaimTaskData): Promise<void> => { await api.post(`/api/v1/tasks/${taskId}/claim`, data); },
  completeTask: async (taskId: string): Promise<void> => { await api.post(`/api/v1/tasks/${taskId}/complete`); },
  confirmTask: async (taskId: string): Promise<void> => { await api.post(`/api/v1/tasks/${taskId}/confirm`); },
  getMessages: async (taskId: string): Promise<TaskMessage[]> => (await api.get(`/api/v1/tasks/${taskId}/messages`)).data.data ?? [],
  sendMessage: async (taskId: string, content: string): Promise<void> => { await api.post(`/api/v1/tasks/${taskId}/messages`, { content }); },
  getProgress: async (taskId: string): Promise<ProgressUpdate[]> => (await api.get(`/api/v1/tasks/${taskId}/progress`)).data.data ?? [],
  postProgress: async (taskId: string, progressNote: string): Promise<void> => { await api.post(`/api/v1/tasks/${taskId}/progress`, { progressNote }); },
  getCategories: async (): Promise<string[]> => (await api.get('/api/v1/categories')).data.data ?? [],
};

export const bankingAPI = {
  getAccounts: async (): Promise<any[]> => (await api.get('/api/v1/banking/accounts')).data.data ?? [],
  getBanks: async (): Promise<any[]> => (await api.get('/api/v1/banking/banks')).data.data ?? [],
  addAccount: async (data: any): Promise<any> => (await api.post('/api/v1/banking/accounts', data)).data.data ?? {},
  verifyAccount: async (id: number): Promise<any> => (await api.post(`/api/v1/banking/bank-accounts/${id}/verify`)).data.data ?? {},
};

export const disputesAPI = {
  create: async (taskId: string, issue: string, category: string): Promise<any> => (await api.post('/api/v1/disputes', { taskId, issue, category })).data.data ?? {},
  getMine: async (): Promise<any[]> => (await api.get('/api/v1/disputes/my')).data.data ?? [],
};

export const ratingsAPI = {
  submit: async (taskId: string, ratingValue: number, review?: string): Promise<any> => (await api.post('/api/v1/ratings', { taskId, ratingValue, review })).data.data ?? {},
  canRate: async (taskId: string): Promise<any> => (await api.get(`/api/v1/ratings/can-rate/${taskId}`)).data.data ?? {},
};

export const walletAPI = {
  getBalance: async (): Promise<UserWallet> => (await api.get('/api/v1/wallet/balance')).data.data,
  getTransactions: async (page = 1, pageSize = 20): Promise<WalletTransaction[]> => (await api.get(`/api/v1/wallet/transactions?page=${page}&pageSize=${pageSize}`)).data.data?.items ?? [],
  requestWithdrawal: async (data: WithdrawalRequest): Promise<void> => { await api.post('/api/v1/wallet/withdraw', data); },
};

export const notificationsAPI = {
  getAll: async (): Promise<UserNotification[]> => (await api.get('/api/v1/notifications')).data.data ?? [],
  getUnreadCount: async (): Promise<number> => (await api.get('/api/v1/notifications/unread-count')).data.data ?? 0,
  markRead: async (id: number): Promise<void> => { await api.post(`/api/v1/notifications/${id}/mark-read`); },
  markAllRead: async (): Promise<void> => { await api.post('/api/v1/notifications/mark-all-read'); },
};

export const paymentAPI = {
  getPaymentUrl: async (taskId: string): Promise<string> => (await api.get(`/api/v1/tasks/${taskId}/payment-url`)).data.data?.paymentUrl ?? '',
};

export const adminAPI = {
  getDashboard: async (): Promise<any> => (await api.get('/api/v1/admin/dashboard')).data.data,
  getAllTasks: async (page = 1, pageSize = 20, status?: string): Promise<any> => {
    let url = `/api/v1/admin/tasks?page=${page}&pageSize=${pageSize}`;
    if (status) url += `&taskStatus=${status}`;
    return (await api.get(url)).data.data;
  },
  getAllUsers: async (page = 1, pageSize = 20): Promise<any> => (await api.get(`/api/v1/admin/users?page=${page}&pageSize=${pageSize}`)).data.data,
  getPayments: async (): Promise<any> => (await api.get('/api/v1/admin/payments')).data.data,
  verifyTask: async (taskId: string): Promise<void> => { await api.patch(`/api/v1/admin/tasks/${taskId}/verify`); },
  unverifyTask: async (taskId: string): Promise<void> => { await api.patch(`/api/v1/admin/tasks/${taskId}/unverify`); },
};

export const errandAPI = {
  getErrands: (filters?: TaskFilter) => tasksAPI.getAvailableTasks(1, 10, filters),
  createErrand: (data: CreateTaskData) => tasksAPI.createTask(data),
  getMyErrands: () => tasksAPI.getMyPostedTasks(),
  acceptErrand: (id: string, data: ClaimTaskData) => tasksAPI.claimTask(id, data),
  completeErrand: (id: string) => tasksAPI.completeTask(id),
  confirmErrand: (id: string) => tasksAPI.confirmTask(id),
};
