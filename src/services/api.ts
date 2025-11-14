import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  Task, 
  Errand, 
  RegisterModel, 
  LoginModel, 
  AuthResponse, 
  ChangePasswordModel,
  CreateTaskData,
  ClaimTaskData,
  TaskStatus,
  UserPreferences,
  UserWallet,
  PaymentRecord,
  UserNotification
} from '../types';

const API_BASE_URL = __DEV__ ? 'http://10.0.2.2:5015/api' : 'https://your-backend-domain.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'DoForYou-Mobile-App',
    'X-API-Key': 'DFY_63c6ee01-0ba6-49e1-9f67-4b752c523267'
  }
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('token');
    }
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export { api };

export const authAPI = {
  register: async (userData: RegisterModel): Promise<AuthResponse> => {
    try {
      const response = await api.post('/Authenticate/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },
  
  login: async (credentials: LoginModel): Promise<AuthResponse> => {
    try {
      const response = await api.post('/Authenticate/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  
  getCurrentUser: async (): Promise<{ user: User }> => {
    try {
      const response = await api.get('/Authenticate/me');
      return response.data;
    } catch (error) {
      console.error('Get current user API error:', error);
      throw error;
    }
  },
  
  changePassword: async (data: ChangePasswordModel): Promise<AuthResponse> => {
    try {
      const response = await api.post('/Authenticate/change-password', data);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
};

export const tasksAPI = {
  getAvailableTasks: async (page = 1, pageSize = 10): Promise<Task[]> => {
    try {
      const response = await api.get(`/Tasks/available?Page=${page}&PageSize=${pageSize}`);
      return response.data.tasks || response.data;
    } catch (error) {
      console.error('Get available tasks error:', error);
      throw error;
    }
  },
  
  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    try {
      const response = await api.post('/Tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },
  
  getMyTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get('/Tasks/my-tasks');
      return response.data;
    } catch (error) {
      console.error('Get my tasks error:', error);
      throw error;
    }
  },
  
  claimTask: async (taskId: number, claimData: ClaimTaskData): Promise<Task> => {
    try {
      const response = await api.patch(`/Tasks/${taskId}/claim`, claimData);
      return response.data;
    } catch (error) {
      console.error('Claim task error:', error);
      throw error;
    }
  },
  
  updateTaskStatus: async (taskId: number, status: TaskStatus): Promise<Task> => {
    try {
      const response = await api.patch(`/Tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update task status error:', error);
      throw error;
    }
  },
  
  confirmCompletion: async (taskId: number, confirmed: boolean): Promise<Task> => {
    try {
      const response = await api.patch(`/Tasks/${taskId}/confirm`, { confirmed });
      return response.data;
    } catch (error) {
      console.error('Confirm completion error:', error);
      throw error;
    }
  }
};

// Backward compatibility
export const errandAPI = {
  getErrands: () => tasksAPI.getAvailableTasks(),
  createErrand: (data: any) => tasksAPI.createTask(data),
  getMyErrands: () => tasksAPI.getMyTasks(),
  acceptErrand: (id: string) => tasksAPI.claimTask(parseInt(id), { helperName: '', helperContact: '' })
};

export const userAPI = {
  updateProfile: async (userData: Partial<User>): Promise<{ user: User }> => {
    try {
      const response = await api.put('/User/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  getPreferences: async (): Promise<UserPreferences> => {
    try {
      const response = await api.get('/User/preferences');
      return response.data;
    } catch (error) {
      console.error('Get preferences error:', error);
      throw error;
    }
  },
  
  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    try {
      const response = await api.put('/User/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  },
  
  getWallet: async (): Promise<UserWallet> => {
    try {
      const response = await api.get('/User/wallet');
      return response.data;
    } catch (error) {
      console.error('Get wallet error:', error);
      throw error;
    }
  }
};

export const paymentAPI = {
  generatePaymentUrl: async (taskId: number): Promise<{ paymentUrl: string }> => {
    try {
      const response = await api.post(`/Payment/generate-payment-url/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Generate payment URL error:', error);
      throw error;
    }
  },
  
  getPaymentHistory: async (): Promise<PaymentRecord[]> => {
    try {
      const response = await api.get('/Payment/history');
      return response.data;
    } catch (error) {
      console.error('Get payment history error:', error);
      throw error;
    }
  }
};

export const notificationsAPI = {
  getNotifications: async (): Promise<UserNotification[]> => {
    try {
      const response = await api.get('/Notifications');
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },
  
  markAsRead: async (notificationId: number): Promise<void> => {
    try {
      await api.patch(`/Notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }
};