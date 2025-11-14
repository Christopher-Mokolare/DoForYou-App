import { apiClient } from './apiClient';
import { ENDPOINTS } from '../config/api';
import { PaymentRecord } from '../types';

export const paymentAPI = {
  generatePaymentUrl: async (taskId: string): Promise<{ paymentUrl: string; paymentId: string }> => {
    const response = await apiClient.post(ENDPOINTS.PAYMENT.GENERATE_URL(taskId));
    return response.data;
  },

  verifyPayment: async (paymentId: string): Promise<PaymentRecord> => {
    const response = await apiClient.post(ENDPOINTS.PAYMENT.VERIFY, { paymentId });
    return response.data;
  },

  getPaymentHistory: async (): Promise<PaymentRecord[]> => {
    const response = await apiClient.get(ENDPOINTS.PAYMENT.HISTORY);
    return response.data;
  }
};