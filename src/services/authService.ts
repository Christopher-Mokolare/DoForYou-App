import { apiClient } from './apiClient';
import { ENDPOINTS } from '../config/api';
import { LoginModel, RegisterModel, AuthResponse, ChangePasswordModel } from '../types';

export const authAPI = {
  login: async (credentials: LoginModel): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData: RegisterModel): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  changePassword: async (passwordData: ChangePasswordModel): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  }
};