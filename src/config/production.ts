export const PRODUCTION_CONFIG = {
  api: {
    baseUrl: 'https://api.doforyou.co.za',
    timeout: 30000,
    apiKey: process.env.EXPO_PUBLIC_API_KEY || '',
    version: 'v1'
  },
  websocket: {
    url: 'wss://api.doforyou.co.za/taskHub',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  },
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
  },
  sentry: {
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN
  },
  features: {
    enablePushNotifications: true,
    enableGeolocation: true,
    enableOfflineMode: true,
    enableCrashReporting: true,
    enableAnalytics: true
  },
  security: {
    enableSSLPinning: true,
    enableBiometricAuth: true,
    sessionTimeout: 1800000, // 30 minutes
    maxLoginAttempts: 5
  }
};