import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/environment';

export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (cfg) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) AsyncStorage.removeItem('auth_token');
    return Promise.reject(error);
  }
);
