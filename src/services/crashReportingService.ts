class CrashReportingService {
  captureException(error: Error, context?: any) {
    console.error('[CrashReporting]', error, context);
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    console.log(`[CrashReporting:${level}]`, message);
  }

  setUser(_user: { id: string; email?: string }) {}

  addBreadcrumb(message: string, category: string, _data?: any) {
    console.log(`[Breadcrumb:${category}]`, message);
  }
}

export const crashReporting = new CrashReportingService();
