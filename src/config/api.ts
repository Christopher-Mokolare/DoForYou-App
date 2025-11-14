export const API_CONFIG = {
  baseUrl: __DEV__ ? 'http://10.219.232.237:3001' : 'https://your-backend-domain.com',
  apiKey: 'DFY_63c6ee01-0ba6-49e1-9f67-4b752c523267',
  timeout: 30000,

  payfast: {
    merchant_id: process.env.PAYFAST_MERCHANT_ID || 'test_merchant',
    merchant_key: process.env.PAYFAST_MERCHANT_KEY || 'test_key',
    return_url: 'doforyou://payment/success',
    cancel_url: 'doforyou://payment/cancel',
    notify_url: `${__DEV__ ? 'http://10.219.232.237:3001' : 'https://your-backend-domain.com'}/api/Payment/payfast-notify`
  }
};

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    CHANGE_PASSWORD: '/api/auth/change-password',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    LOGOUT: '/api/auth/logout'
  },
  TASKS: {
    AVAILABLE: '/api/errands/available',
    CREATE: '/api/errands',
    MY_TASKS: '/api/errands/my-errands',
    CLAIM: (taskId: string) => `/api/errands/${taskId}/accept`,
    UPDATE_STATUS: (taskId: string) => `/api/errands/${taskId}/status`,
    DETAILS: (taskId: string) => `/api/errands/${taskId}`
  },
  PAYMENT: {
    CREATE_INTENT: '/api/payments/create-intent',
    CONFIRM: '/api/payments/confirm',
    WEBHOOK: '/api/payments/webhook'
  },
  USER: {
    PROFILE: '/api/users/profile'
  },
  ADMIN: {
    DASHBOARD: '/api/Admin/dashboard',
    USERS: '/api/Admin/users',
    TASKS: '/api/Admin/tasks',
    PAYMENTS: '/api/Admin/payments'
  }
};