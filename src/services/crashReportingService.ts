import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

class CrashReportingService {
  private initialized = false;

  initialize() {
    if (this.initialized) return;

    const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
    if (!dsn) {
      console.warn('Sentry DSN not configured');
      return;
    }

    Sentry.init({
      dsn,
      debug: __DEV__,
      environment: __DEV__ ? 'development' : 'production',
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
      beforeSend: (event) => {
        // Filter out sensitive data
        if (event.user) {
          delete event.user.email;
          delete event.user.ip_address;
        }
        return event;
      }
    });

    this.initialized = true;
  }

  captureException(error: Error, context?: any) {
    if (!this.initialized) return;
    
    Sentry.captureException(error, {
      tags: {
        section: context?.section || 'unknown'
      },
      extra: context
    });
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    if (!this.initialized) return;
    
    Sentry.captureMessage(message, level);
  }

  setUser(user: { id: string; email?: string }) {
    if (!this.initialized) return;
    
    Sentry.setUser({
      id: user.id,
      // Don't send email for privacy
    });
  }

  addBreadcrumb(message: string, category: string, data?: any) {
    if (!this.initialized) return;
    
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info'
    });
  }
}

export const crashReporting = new CrashReportingService();