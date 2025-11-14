import { apiClient } from './apiClient';
import { ENDPOINTS } from '../config/api';
import { User, UserPreferences, UserWallet } from '../types';

export const userAPI = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get(ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await apiClient.put(ENDPOINTS.USER.PROFILE, profileData);
    return response.data;
  },

  getPreferences: async (): Promise<UserPreferences> => {
    const response = await apiClient.get(ENDPOINTS.USER.PREFERENCES);
    return response.data;
  },

  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    const response = await apiClient.put(ENDPOINTS.USER.PREFERENCES, preferences);
    return response.data;
  },

  getWallet: async (): Promise<UserWallet> => {
    const response = await apiClient.get(ENDPOINTS.USER.WALLET);
    return response.data;
  }
};