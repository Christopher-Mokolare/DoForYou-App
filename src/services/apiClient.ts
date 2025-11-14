import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';
import { getToken, getRefreshToken, storeTokens, clearTokens } from '../utils/tokenStorage';

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_CONFIG.apiKey
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.baseUrl}/api/auth/refresh-token`,
            { refreshToken },
            {
              headers: {
                'X-API-Key': API_CONFIG.apiKey
              }
            }
          );

          const { token: newToken, refreshToken: newRefreshToken } = response.data;
          await storeTokens(newToken, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        await clearTokens();
        // You might want to dispatch a logout action here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);