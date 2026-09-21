import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/environment';
import {
  User, Task, TaskMessage, ProgressUpdate,
  RegisterModel, LoginModel, AuthResponse,
  CreateTaskData, ClaimTaskData,
  UserPreferences, UserNotification,
  TaskFilter, DashboardStats,
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

type ApiEnvelope<T> = { success?: boolean; data?: T; message?: string; error?: string };

function unwrap<T>(response: { data: ApiEnvelope<T> | T }): T {
  const body: any = response.data;
  return body?.data !== undefined ? body.data : body;
}

function assertSuccess(body: any, fallback = 'Request failed') {
  if (body?.success === false) throw new Error(body.message || body.error || fallback);
}

export const authAPI = {
  register: async (data: RegisterModel): Promise<AuthResponse> => (await api.post('/api/v1/auth/register', data)).data,
  login: async (data: LoginModel): Promise<AuthResponse> => (await api.post('/api/v1/auth/login', data)).data,
  logout: async (): Promise<void> => { await AsyncStorage.removeItem('auth_token'); },
  forgotPassword: async (data: { email: string }): Promise<{ message: string }> => (await api.post('/api/v1/auth/forgot-password', data)).data,
  resendVerification: async (email: string): Promise<{ message: string }> => (await api.post('/api/v1/auth/resend-verification', { email })).data,
};

export const userAPI = {
  getProfile: async (): Promise<User> => unwrap(await api.get('/api/v1/user/profile')),
  updateProfile: async (data: Partial<User>): Promise<void> => { const r = await api.put('/api/v1/user/profile', data); assertSuccess(r.data); },
  getDashboardStats: async (): Promise<DashboardStats> => unwrap(await api.get('/api/v1/user/dashboard/stats')),
  getPreferences: async (): Promise<UserPreferences> => unwrap(await api.get('/api/v1/user/preferences')),
  updatePreferences: async (data: Partial<UserPreferences>): Promise<void> => { const r = await api.put('/api/v1/user/preferences', data); assertSuccess(r.data); },
};

export const tasksAPI = {
  getAvailableTasks: async (page = 1, pageSize = 10, filters?: TaskFilter): Promise<Task[]> => {
    let url = `/api/v1/tasks/available?page=${page}&pageSize=${pageSize}`;
    if (filters?.search) url += `&search=${encodeURIComponent(filters.search)}`;
    if (filters?.category) url += `&category=${encodeURIComponent(filters.category)}`;
    if (filters?.area) url += `&area=${encodeURIComponent(filters.area)}`;
    if (filters?.minBudget != null) url += `&minBudget=${filters.minBudget}`;
    if (filters?.maxBudget != null) url += `&maxBudget=${filters.maxBudget}`;
    if (filters?.priority) url += `&priority=${encodeURIComponent(filters.priority)}`;
    const r = await api.get(url);
    return r.data.tasks ?? [];
  },
  getMyTasks: async (): Promise<Task[]> => tasksAPI.getMyPostedTasks(),
  getMyPostedTasks: async (): Promise<Task[]> => {
    const r = await api.get('/api/v1/tasks/my-posted');
    return r.data.data?.tasks ?? r.data.data ?? [];
  },
  getMyActiveTasks: async (): Promise<Task[]> => unwrap(await api.get('/api/v1/tasks/my-active')) ?? [],
  getMyCompletedTasks: async (): Promise<Task[]> => unwrap(await api.get('/api/v1/tasks/my-completed')) ?? [],
  getTaskById: async (taskId: string): Promise<Task> => unwrap(await api.get(`/api/v1/tasks/${taskId}`)),
  createTask: async (data: CreateTaskData): Promise<{ task: Task; paymentUrl: string }> => {
    const r = await api.post('/api/v1/tasks', data);
    assertSuccess(r.data, 'Failed to create task');
    return unwrap(r);
  },
  claimTask: async (taskId: string, data: ClaimTaskData): Promise<void> => {
    const r = await api.post(`/api/v1/tasks/${taskId}/claim`, data);
    assertSuccess(r.data, 'Failed to claim task');
  },
  completeTask: async (taskId: string): Promise<void> => {
    const r = await api.post(`/api/v1/tasks/${taskId}/complete`, {});
    assertSuccess(r.data, 'Failed to complete task');
  },
  confirmTask: async (taskId: string): Promise<void> => {
    const r = await api.post(`/api/v1/tasks/${taskId}/confirm`, {});
    assertSuccess(r.data, 'Failed to confirm task');
  },
  cancelTask: async (taskId: string, reason = 'Cancelled by user'): Promise<void> => {
    const r = await api.post(`/api/v1/tasks/${taskId}/cancel`, { reason });
    assertSuccess(r.data, 'Failed to cancel task');
  },
  getMessages: async (taskId: string): Promise<TaskMessage[]> => unwrap(await api.get(`/api/v1/tasks/${taskId}/messages`)) ?? [],
  sendMessage: async (taskId: string, content: string): Promise<void> => {
    const r = await api.post(`/api/v1/tasks/${taskId}/messages`, { content });
    assertSuccess(r.data, 'Failed to send message');
  },
  getProgress: async (taskId: string): Promise<ProgressUpdate[]> => unwrap(await api.get(`/api/v1/tasks/${taskId}/progress`)) ?? [],
  postProgress: async (taskId: string, progressNote: string): Promise<void> => {
    const r = await api.post(`/api/v1/tasks/${taskId}/progress`, { progressNote });
    assertSuccess(r.data, 'Failed to post progress');
  },
  getCategories: async (): Promise<string[]> => unwrap(await api.get('/api/v1/categories')) ?? [],
  getPaymentHistory: async (): Promise<any[]> => unwrap(await api.get('/api/v1/tasks/payment-history')) ?? [],
  getPaymentUrl: async (taskId: string): Promise<string> => {
    const r = await api.get(`/api/v1/tasks/${taskId}/payment-url`);
    assertSuccess(r.data, 'Payment is not currently available');
    return r.data.data?.paymentUrl ?? '';
  },
};

export const bankingAPI = {
  getAccounts: async (): Promise<any[]> => unwrap(await api.get('/api/v1/banking/accounts')) ?? [],
  getBanks: async (): Promise<any[]> => unwrap(await api.get('/api/v1/banking/banks')) ?? [],
  addAccount: async (data: any): Promise<any> => { const r = await api.post('/api/v1/banking/accounts', data); assertSuccess(r.data); return unwrap(r); },
  verifyAccount: async (id: number): Promise<any> => { const r = await api.post(`/api/v1/banking/bank-accounts/${id}/verify`, {}); assertSuccess(r.data); return unwrap(r); },
};

export const disputesAPI = {
  create: async (taskId: string, issue: string, category: string): Promise<any> => { const r = await api.post('/api/v1/disputes', { taskId, issue, category }); assertSuccess(r.data); return unwrap(r); },
  getMine: async (): Promise<any[]> => unwrap(await api.get('/api/v1/disputes/my')) ?? [],
};

export const ratingsAPI = {
  submit: async (taskId: string, ratingValue: number, review?: string): Promise<any> => { const r = await api.post('/api/v1/ratings', { taskId, ratingValue, review }); assertSuccess(r.data); return unwrap(r); },
  canRate: async (taskId: string): Promise<any> => unwrap(await api.get(`/api/v1/ratings/can-rate/${taskId}`)),
};

export const notificationsAPI = {
  getAll: async (): Promise<UserNotification[]> => unwrap(await api.get('/api/v1/notifications')) ?? [],
  getUnreadCount: async (): Promise<number> => unwrap(await api.get('/api/v1/notifications/unread-count')) ?? 0,
  markRead: async (id: number): Promise<void> => { const r = await api.post(`/api/v1/notifications/${id}/mark-read`, {}); assertSuccess(r.data); },
  markAllRead: async (): Promise<void> => { const r = await api.post('/api/v1/notifications/mark-all-read', {}); assertSuccess(r.data); },
};

export const adminAPI = {
  getDashboard: async (): Promise<any> => unwrap(await api.get('/api/v1/admin/dashboard')),
  getAllTasks: async (page = 1, pageSize = 20, status?: string): Promise<any> => {
    let url = `/api/v1/admin/tasks?page=${page}&pageSize=${pageSize}`;
    if (status) url += `&taskStatus=${status}`;
    return unwrap(await api.get(url));
  },
  getAllUsers: async (page = 1, pageSize = 20): Promise<any> => unwrap(await api.get(`/api/v1/admin/users?page=${page}&pageSize=${pageSize}`)),
  getPayments: async (): Promise<any> => unwrap(await api.get('/api/v1/admin/payments')),
  verifyTask: async (taskId: string): Promise<void> => { const r = await api.patch(`/api/v1/admin/tasks/${taskId}/verify`); assertSuccess(r.data); },
  unverifyTask: async (taskId: string): Promise<void> => { const r = await api.patch(`/api/v1/admin/tasks/${taskId}/unverify`); assertSuccess(r.data); },
};

export const paymentAPI = {
  getPaymentUrl: (taskId: string) => tasksAPI.getPaymentUrl(taskId),
};

export const errandAPI = {
  getErrands: (filters?: TaskFilter) => tasksAPI.getAvailableTasks(1, 10, filters),
  createErrand: (data: CreateTaskData) => tasksAPI.createTask(data),
  getMyErrands: () => tasksAPI.getMyPostedTasks(),
  acceptErrand: (id: string, data: ClaimTaskData) => tasksAPI.claimTask(id, data),
  completeErrand: (id: string) => tasksAPI.completeTask(id),
  confirmErrand: (id: string) => tasksAPI.confirmTask(id),
};
